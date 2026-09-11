import { describe, expect, test } from 'bun:test';
import {
  assertValidRulebook,
  collectCustomRuleNames,
  validateRulebook,
} from '@/core/policy/rulebook';
import { describeOutcome } from '../../helpers/fixture-tree';
import { named, RULEBOOK_VALUES, samples } from './policy-values';

const VALID_RULEBOOK = {
  rulebook_version: 1,
  name: 'infra-guards',
  version: '2.4.0',
  allowed_commands: ['terraform'],
  rules: [
    {
      name: 'block-destroy',
      command: 'terraform',
      subcommand: 'destroy',
      block_args: ['-auto-approve'],
      reason: 'Destroying infrastructure needs a human.',
      intent: 'manual_only',
    },
  ],
};

const V2_RULE = {
  name: 'block-uninstall',
  command: 'helm',
  match: { command_path: ['uninstall'], any_args: ['--no-hooks'], exclude_args: ['--dry-run'] },
  reason: 'Uninstalling a release drops live state.',
  intent: 'hard_stop',
};

const V2_RULEBOOK = {
  rulebook_version: 2,
  name: 'deploy-guards',
  version: '0.1.0',
  allowed_commands: ['helm'],
  rules: [V2_RULE],
};

describe('rulebook diagnostics', () => {
  test.each([
    [
      'a valid rulebook is accepted and reports its rule names',
      VALID_RULEBOOK,
      [],
      ['block-destroy'],
    ],
    [
      'an unsupported rulebook version reads as a sentence, not a field error',
      { ...VALID_RULEBOOK, rulebook_version: 3 },
      ['rulebook_version must be 1 or 2'],
      ['block-destroy'],
    ],
    [
      'a rulebook name that is not a bare name is refused',
      { ...VALID_RULEBOOK, name: 'not a rule name' },
      ['name: required string matching rule name pattern'],
      ['block-destroy'],
    ],
    ['rules must be an array', { ...VALID_RULEBOOK, rules: 'none' }, ['rules: required array'], []],
    [
      'a rulebook that is not an object is rejected whole',
      'rulebook',
      ['Rulebook must be an object'],
      [],
    ],
    [
      'a rulebook version string must not be empty',
      { ...VALID_RULEBOOK, version: '' },
      ['version: required non-empty string'],
      ['block-destroy'],
    ],
    [
      'allowed_commands must be an array, not a single command',
      { ...VALID_RULEBOOK, allowed_commands: 'terraform' },
      ['allowed_commands: required array'],
      ['block-destroy'],
    ],
    [
      'every allowed command that is not a command name is reported at its index',
      { ...VALID_RULEBOOK, allowed_commands: [null, 'terraform', 'not a command'] },
      [
        'allowed_commands[0]: must match command pattern',
        'allowed_commands[2]: must match command pattern',
      ],
      ['block-destroy'],
    ],
    [
      'a repeated allowed command is reported at the repeat, naming the command',
      { ...VALID_RULEBOOK, allowed_commands: ['terraform', 'terraform', 'kubectl', 'kubectl'] },
      [
        'allowed_commands[1]: duplicate command "terraform"',
        'allowed_commands[3]: duplicate command "kubectl"',
      ],
      ['block-destroy'],
    ],
    [
      'a rule that is not an object is reported at its index and contributes no name',
      { ...VALID_RULEBOOK, rules: [null, 3, 'rule', []] },
      [
        'rules[0]: must be an object',
        'rules[1]: must be an object',
        'rules[2]: must be an object',
        'rules[3]: must be an object',
      ],
      [],
    ],
    [
      'an empty v1 rule reports every field it must carry',
      { ...VALID_RULEBOOK, rules: [{}] },
      [
        'rules[0].name: required string',
        'rules[0].command: required string matching command pattern',
        'rules[0].block_args: required non-empty array',
        'rules[0].reason: required non-empty string up to 256 characters',
      ],
      [],
    ],
    [
      'a v1 subcommand must be a command name',
      { ...VALID_RULEBOOK, rules: [{ ...VALID_RULEBOOK.rules[0], subcommand: 9 }] },
      ['rules[0].subcommand: must match command pattern'],
      ['block-destroy'],
    ],
    [
      'a v1 rule blocking nothing is refused',
      { ...VALID_RULEBOOK, rules: [{ ...VALID_RULEBOOK.rules[0], block_args: [] }] },
      ['rules[0].block_args: required non-empty array'],
      ['block-destroy'],
    ],
    [
      'each unusable blocked argument is reported at its own index',
      { ...VALID_RULEBOOK, rules: [{ ...VALID_RULEBOOK.rules[0], block_args: ['', 4, '-f'] }] },
      [
        'rules[0].block_args[0]: must be a non-empty string',
        'rules[0].block_args[1]: must be a non-empty string',
      ],
      ['block-destroy'],
    ],
    [
      'a rule without a reason cannot be shown to a user',
      { ...VALID_RULEBOOK, rules: [{ ...VALID_RULEBOOK.rules[0], reason: '' }] },
      ['rules[0].reason: required non-empty string up to 256 characters'],
      ['block-destroy'],
    ],
    [
      'a reason past the length bound reads as the same requirement',
      { ...VALID_RULEBOOK, rules: [{ ...VALID_RULEBOOK.rules[0], reason: 'r'.repeat(257) }] },
      ['rules[0].reason: required non-empty string up to 256 characters'],
      ['block-destroy'],
    ],
    [
      'an intent outside the catalogue lists the intents that exist',
      { ...VALID_RULEBOOK, rules: [{ ...VALID_RULEBOOK.rules[0], intent: 'shrug' }] },
      [
        'rules[0].intent: must be one of hard_stop, use_alternative, scope_down, manual_only, stop_and_explain',
      ],
      ['block-destroy'],
    ],
    [
      'a rule may only guard a command the rulebook declared',
      { ...VALID_RULEBOOK, rules: [{ ...VALID_RULEBOOK.rules[0], command: 'ansible' }] },
      ['rules[0].command: "ansible" must be listed in allowed_commands'],
      ['block-destroy'],
    ],
    [
      'a version 2 rule must carry a match object',
      { ...V2_RULEBOOK, rules: [{ ...V2_RULE, match: undefined }] },
      ['rules[0].match: required object'],
      ['block-uninstall'],
    ],
    [
      'a match reports its command path, its empty token list and each unusable token',
      {
        ...V2_RULEBOOK,
        rules: [{ ...V2_RULE, match: { command_path: 'x', any_args: [], exclude_args: [1, 1] } }],
      },
      [
        'rules[0].match.command_path: required non-empty array of non-empty strings',
        'rules[0].match.any_args: must be a non-empty array of unique non-empty strings',
        'rules[0].match.exclude_args[0]: must be a non-empty string',
        'rules[0].match.exclude_args[1]: must be a non-empty string',
      ],
      ['block-uninstall'],
    ],
    [
      'a token list reports an empty token and then its own duplication',
      {
        ...V2_RULEBOOK,
        rules: [{ ...V2_RULE, match: { command_path: ['a'], any_args: ['a', 'a', ''] } }],
      },
      [
        'rules[0].match.any_args[2]: must be a non-empty string',
        'rules[0].match.any_args: must not contain duplicate values',
      ],
      ['block-uninstall'],
    ],
    [
      'the version 1 matching fields are refused in a version 2 rule',
      {
        ...V2_RULEBOOK,
        rules: [{ ...V2_RULE, subcommand: 'uninstall', block_args: ['--no-hooks'] }],
      },
      [
        'rules[0].subcommand: not supported in rulebook_version 2',
        'rules[0].block_args: not supported in rulebook_version 2',
      ],
      ['block-uninstall'],
    ],
    [
      'tests must be an array when present',
      { ...VALID_RULEBOOK, tests: 'none' },
      ['tests: must be an array if provided'],
      ['block-destroy'],
    ],
    [
      'a fixture that is not an object is reported at its index',
      { ...VALID_RULEBOOK, tests: [null, 'x'] },
      ['tests[0]: must be an object', 'tests[1]: must be an object'],
      ['block-destroy'],
    ],
    [
      'a fixture needs a command to run and an outcome to expect',
      { ...VALID_RULEBOOK, tests: [{ command: '  ', expect: 'maybe' }] },
      [
        'tests[0].command: required non-empty string',
        'tests[0].expect: must be "blocked" or "allowed"',
      ],
      ['block-destroy'],
    ],
    [
      'a blocked fixture must name the rule it expects, and a non-string rule says so first',
      {
        ...VALID_RULEBOOK,
        tests: [{ command: 'terraform destroy', expect: 'blocked', rule: null }],
      },
      [
        'tests[0].rule: must be a string if provided',
        'tests[0].rule: required string for blocked fixtures',
      ],
      ['block-destroy'],
    ],
    [
      'a blocked fixture naming a rule the rulebook does not declare is reported once per rule',
      {
        ...VALID_RULEBOOK,
        tests: [
          { command: 'terraform apply', expect: 'blocked', rule: 'missing-rule' },
          { command: 'terraform apply', expect: 'blocked', rule: 'missing-rule' },
          { command: 'terraform apply', expect: 'blocked', rule: 'other-missing' },
        ],
      },
      [
        'tests: blocked fixture references unknown rule "missing-rule"',
        'tests: blocked fixture references unknown rule "other-missing"',
      ],
      ['block-destroy'],
    ],
    [
      'a rulebook carrying only its version reports every required field',
      { rulebook_version: 1 },
      [
        'name: required string matching rule name pattern',
        'version: required non-empty string',
        'allowed_commands: required array',
        'rules: required array',
      ],
      [],
    ],
  ] as const)('%s', (_behavior, rulebook, errors, names) => {
    const result = validateRulebook(rulebook);
    expect(result.errors).toEqual([...errors]);
    expect([...result.ruleNames]).toEqual([...names]);
  });

  test('rule names collide case-insensitively, and the later claim is the one reported', () => {
    const result = validateRulebook({
      ...VALID_RULEBOOK,
      rules: [
        { ...VALID_RULEBOOK.rules[0], name: 'dup' },
        { ...VALID_RULEBOOK.rules[0], name: 'DUP' },
      ],
    });
    expect(result.errors).toEqual(['rules[1].name: duplicate rule name "DUP"']);
    expect([...result.ruleNames]).toEqual(['dup']);
  });

  test('past the diagnostic budget the list is cut short and says so', () => {
    const errors = validateRulebook({
      ...VALID_RULEBOOK,
      rules: Array.from({ length: 70 }, (_unused, index) => index),
    }).errors;
    expect(errors).toHaveLength(65);
    expect(errors.at(0)).toBe('rules[0]: must be an object');
    expect(errors.at(-2)).toBe('rules[63]: must be an object');
    expect(errors.at(-1)).toBe('Additional rulebook validation errors were omitted.');
  });

  test('a rulebook over the acceptance limits is refused before any field is read', () => {
    expect(
      validateRulebook({
        ...VALID_RULEBOOK,
        rules: Array.from({ length: 1_025 }, () => ({})),
      }).errors,
    ).toEqual(["Rulebook exceeds CC Safety Net's safe validation limits."]);
  });

  test('rulebook validation answers every document with usable diagnostics and never throws', () => {
    for (const value of samples(RULEBOOK_VALUES)) {
      const result = validateRulebook(value);
      expect(
        result.errors.every((error) => typeof error === 'string' && error.trim() !== ''),
        named(value),
      ).toBe(true);
      expect(result.errors.length, named(value)).toBeLessThanOrEqual(65);
      expect(
        [...result.ruleNames].every((name) =>
          collectCustomRuleNames(value).some((written) => written.toLowerCase() === name),
        ),
        named(value),
      ).toBe(true);
    }
  }, 60_000);
});

describe('the rulebook assertion wrapper', () => {
  test('a valid rulebook is returned untouched', () => {
    expect(assertValidRulebook(VALID_RULEBOOK) as unknown).toBe(VALID_RULEBOOK);
  });

  test('an invalid rulebook throws with every diagnostic joined by "; "', () => {
    const thrown = describeOutcome(() => assertValidRulebook({ rulebook_version: 1 }));
    expect(thrown.ok).toBe(false);
    if (!thrown.ok) {
      expect(thrown.error.message).toBe(
        'name: required string matching rule name pattern; version: required non-empty string; allowed_commands: required array; rules: required array',
      );
    }
  });
});
