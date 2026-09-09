import { describe, expect, test } from 'bun:test';
import { getRulesConfigValidation } from '@/core/policy/rules-config';

/**
 * `rule.json` has one validator: the loader runs it on the hook's path, and `doctor` and
 * `explain` report the same document through it. The table below states the diagnostics and the
 * usable sources each document must produce; `schema-asset.test.ts` holds the published JSON
 * Schema to the same acceptance decisions.
 */

describe('rules config diagnostics', () => {
  test.each([
    ['a config with no sources is accepted', { version: 1 }, [], []],
    [
      'both source spellings are accepted and reported as usable',
      { version: 1, rules: ['infra-rules', 'acme/guardrails#main/deploy-rules'] },
      [],
      ['infra-rules', 'acme/guardrails#main/deploy-rules'],
    ],
    [
      'a source that is not a name reports the syntax rule it broke',
      { version: 1, rules: ['not a source!'] },
      [
        'rules[0]: Local rulebook sources must be bare names matching /^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/: not a source!',
      ],
      [],
    ],
    [
      'a repeated source is reported at the repeat, and the first claim stays usable',
      { version: 1, rules: ['infra-rules', 'infra-rules'] },
      ['rules[1]: duplicate rulebook source "infra-rules"'],
      ['infra-rules'],
    ],
    [
      'a wrapper naming a command the analyzer inspects itself is refused',
      { version: 1, transparent_wrappers: ['git', 'rtk'] },
      ['transparent_wrappers[0]: reserved command "git" cannot be a wrapper'],
      [],
    ],
    [
      'an override key must name a rulebook and a rule',
      { version: 1, overrides: { plain: 'off' } },
      ['overrides.plain: must use <rulebook-name>/<rule-name>'],
      [],
    ],
    [
      'an override that rewrites a reason needs one',
      { version: 1, overrides: { 'a/b': { reason: '' } } },
      ['overrides.a/b.reason: required non-empty string'],
      [],
    ],
    ['a config that is not an object is rejected whole', null, ['Config must be an object'], []],
  ] as const)('%s', (_behavior, document, errors, sources) => {
    const result = getRulesConfigValidation(document);
    expect(result.errors).toEqual([...errors]);
    expect([...result.sources]).toEqual([...sources]);
  });

  test('a config over the source limit is refused as a whole rather than per source', () => {
    expect(
      getRulesConfigValidation({
        version: 1,
        rules: Array.from({ length: 65 }, (_unused, index) => `bulk-${index}`),
      }).errors,
    ).toEqual(["Rule config exceeds CC Safety Net's safe source limit."]);
  });
});
