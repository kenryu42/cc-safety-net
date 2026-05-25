import { describe, expect, test } from 'bun:test';
import {
  assertValidRulebook,
  type Rulebook,
  runRulebookFixtures,
  validateRulebook,
} from '@/core/rules/rulebook';

function rulebook(input: Partial<Rulebook> = {}): Rulebook {
  return {
    rulebook_version: 1,
    name: 'project-rules',
    version: '1.0.0',
    allowed_commands: ['docker', 'git'],
    rules: [
      {
        name: 'block-docker-prune',
        command: 'docker',
        subcommand: 'system',
        block_args: ['prune'],
        reason: 'Use targeted cleanup.',
      },
    ],
    tests: [
      {
        command: 'docker system prune',
        expect: 'blocked',
        rule: 'block-docker-prune',
      },
      {
        command: 'docker ps',
        expect: 'allowed',
      },
    ],
    ...input,
  };
}

describe('rulebook validation', () => {
  test('accepts a valid rulebook and runs fixtures', () => {
    const parsed = assertValidRulebook(rulebook());

    expect(parsed.name).toBe('project-rules');
    expect(runRulebookFixtures(parsed)).toEqual({ ok: true, failures: [] });
  });

  test('reports schema errors with enough detail to repair the rulebook', () => {
    const result = validateRulebook({
      rulebook_version: 2,
      name: 'bad name',
      version: '',
      allowed_commands: ['docker', 'docker', 'bad command'],
      rules: [
        {
          name: 'block-docker-prune',
          command: 'npm',
          block_args: [],
          reason: '',
        },
        {
          name: 'block-docker-prune',
          command: 'docker',
          subcommand: 'bad subcommand',
          block_args: [''],
          reason: 'ok',
        },
      ],
      tests: [
        { command: '', expect: 'blocked' },
        { command: 'docker system prune', expect: 'blocked', rule: 'missing' },
        { command: 'docker ps', expect: 'maybe' },
      ],
    });

    expect(result.errors).toContain('rulebook_version must be 1');
    expect(result.errors).toContain('name: required string matching rule name pattern');
    expect(result.errors).toContain('version: required non-empty string');
    expect(result.errors).toContain('allowed_commands[1]: duplicate command "docker"');
    expect(result.errors).toContain('allowed_commands[2]: must match command pattern');
    expect(result.errors).toContain('rules[0].command: "npm" must be listed in allowed_commands');
    expect(result.errors).toContain('rules[1].name: duplicate rule name "block-docker-prune"');
    expect(result.errors).toContain('tests: blocked fixture references unknown rule "missing"');
  });

  test('rejects rule names that differ only by case', () => {
    const result = validateRulebook(
      rulebook({
        rules: [
          {
            name: 'block-docker-prune',
            command: 'docker',
            subcommand: 'system',
            block_args: ['prune'],
            reason: 'Use targeted cleanup.',
          },
          {
            name: 'BLOCK-DOCKER-PRUNE',
            command: 'docker',
            subcommand: 'system',
            block_args: ['prune'],
            reason: 'Use targeted cleanup.',
          },
        ],
        tests: [
          {
            command: 'docker system prune',
            expect: 'blocked',
            rule: 'block-docker-prune',
          },
        ],
      }),
    );

    expect(result.errors).toContain('rules[1].name: duplicate rule name "BLOCK-DOCKER-PRUNE"');
  });

  test('fixture failures distinguish allowed, missing block, and wrong rule matches', () => {
    const result = runRulebookFixtures(
      rulebook({
        rules: [
          {
            name: 'block-docker-prune',
            command: 'docker',
            subcommand: 'system',
            block_args: ['prune'],
            reason: 'Use targeted cleanup.',
          },
          {
            name: 'block-git-reset',
            command: 'git',
            subcommand: 'reset',
            block_args: ['--hard'],
            reason: 'Avoid destructive reset.',
          },
        ],
        tests: [
          { command: 'docker ps', expect: 'blocked', rule: 'block-docker-prune' },
          { command: 'docker system prune', expect: 'allowed' },
          { command: 'git reset --hard', expect: 'blocked', rule: 'block-docker-prune' },
        ],
      }),
    );

    expect(result.ok).toBe(false);
    expect(result.failures.map((failure) => failure.message)).toEqual([
      'expected blocked by block-docker-prune but command was allowed',
      'expected allowed but matched block-docker-prune',
      'expected blocked by block-docker-prune but matched block-git-reset',
    ]);
    expect(result.failures[0]?.trace).toContain('skipped block-docker-prune');
    expect(() => assertValidRulebook(rulebook({ tests: result.failures as never }))).toThrow();
  });
});
