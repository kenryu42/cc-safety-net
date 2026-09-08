import { describe, expect, test } from 'bun:test';
import { getRulesConfigValidation } from '@/core/policy/rules-config';
import * as schema from '@/core/policy/schema';
import { named, RULES_CONFIG_VALUES, samples } from './policy-values';

/**
 * `rule.json` keeps two implementations: this one, which the loader runs on the hook's path
 * without the schema library, and the schema, which renders the published JSON Schema asset and
 * answers `doctor`. They are only worth having if every diagnostic they produce is the same one,
 * so each fixture document and 300 seeded mutations of it go through both. Nothing is recorded:
 * the schema module is the oracle, and the property is that the two never disagree.
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

describe('the hand-written rules config validator agrees with the schema', () => {
  test('rules config diagnostics and usable sources are identical', () => {
    for (const value of samples(RULES_CONFIG_VALUES)) {
      const read = getRulesConfigValidation(value);
      const oracle = schema.getRulesConfigValidation(value);
      expect(read.errors, named(value)).toStrictEqual(oracle.errors);
      expect([...read.sources], named(value)).toStrictEqual([...oracle.sources]);
    }
  }, 60_000);

  test('a rules config is accepted by the schema exactly when it has no diagnostics', () => {
    for (const value of samples(RULES_CONFIG_VALUES)) {
      expect(schema.getRulesConfigSchema().safeParse(value).success, named(value)).toBe(
        getRulesConfigValidation(value).errors.length === 0,
      );
    }
  }, 60_000);
});
