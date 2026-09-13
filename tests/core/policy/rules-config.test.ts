import { describe, expect, test } from 'bun:test';
import { getRulesConfigValidation } from '@/core/policy/rules-config';

describe('rules config diagnostics', () => {
  test('whitespace-only sources are rejected as empty', () => {
    expect(getRulesConfigValidation({ version: 1, rules: [' \t '] }).errors).toContain(
      'rules[0]: must be a non-empty rulebook source string',
    );
  });
  test.each([
    [
      'a scalar source list is rejected without collecting its characters as sources',
      { version: 1, rules: 'infra-rules' },
      ['rules must be an array of rulebook source strings'],
      [],
    ],
    [
      'invalid source entries do not discard valid siblings',
      { version: 1, rules: [null, [], 'infra-rules'] },
      [
        'rules[0]: must be a rulebook source string',
        'rules[1]: must be a rulebook source string',
        'rules[1]: must be a non-empty rulebook source string',
      ],
      ['infra-rules'],
    ],
    [
      'an override cannot use a boolean in place of a reason override',
      { version: 1, overrides: { 'infra/deploy': false } },
      ['overrides.infra/deploy: must be "off" or an object'],
      [],
    ],
    [
      'an override object must provide a textual reason',
      { version: 1, overrides: { 'infra/deploy': { reason: 42 } } },
      ['overrides.infra/deploy.reason: required non-empty string'],
      [],
    ],
    [
      'wrappers must be a list',
      { version: 1, transparent_wrappers: 'rtk' },
      ['transparent_wrappers must be an array of command strings'],
      [],
    ],
    [
      'wrapper entries reject nonstrings and shell fragments',
      { version: 1, transparent_wrappers: [false, 'rtk; rm'] },
      [
        'transparent_wrappers[0]: must be a command string',
        'transparent_wrappers[1]: must match command pattern',
      ],
      [],
    ],
    [
      'repeated wrappers identify the duplicate entry',
      { version: 1, transparent_wrappers: ['rtk', 'rtk'] },
      ['transparent_wrappers[1]: duplicate command "rtk"'],
      [],
    ],
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
