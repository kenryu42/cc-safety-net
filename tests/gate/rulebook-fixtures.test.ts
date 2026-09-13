import { describe, expect, test } from 'bun:test';
import type { Rulebook } from '@/core/policy/rulebook';
import { evaluateRulebookFixtures } from '@/gate/rulebook-fixtures';

const RULEBOOK: Rulebook = {
  rulebook_version: 2,
  name: 'fixture-rules',
  version: '1.0.0',
  allowed_commands: ['docker', 'kubectl'],
  rules: [
    {
      name: 'block-context-use',
      command: 'kubectl',
      match: { command_path: ['config', 'use-context'] },
      reason: 'Switching context mid-session hides which cluster the next command reaches.',
    },
    {
      name: 'block-system-prune',
      command: 'docker',
      match: { command_path: ['system', 'prune'], exclude_args: ['--filter'] },
      reason: 'Prune everything and an unrelated stopped container goes with it.',
    },
  ],
  tests: [
    { command: 'docker system prune', expect: 'blocked', rule: 'block-system-prune' },
    { command: 'FOO=1 docker system prune', expect: 'blocked', rule: 'block-system-prune' },
    { command: 'sudo docker system prune', expect: 'blocked', rule: 'block-system-prune' },
    { command: '{ docker system prune; }', expect: 'blocked', rule: 'block-system-prune' },
    {
      command: 'cleanup() { docker system prune; }',
      expect: 'blocked',
      rule: 'block-system-prune',
    },
    { command: "bash -c 'docker system prune'", expect: 'blocked', rule: 'block-system-prune' },
    {
      command: 'docker system prune | tee prune.log',
      expect: 'blocked',
      rule: 'block-system-prune',
    },
    { command: 'echo $(docker system prune)', expect: 'blocked', rule: 'block-system-prune' },
    { command: '', expect: 'blocked', rule: 'block-system-prune' },
    { command: 'docker system prune --all', expect: 'allowed' },
    { command: 'docker ps', expect: 'allowed' },
    {
      command: 'kubectl config use-context prod',
      expect: 'blocked',
      rule: 'block-system-prune',
    },
    {
      command: 'docker system prune --filter until=24h',
      expect: 'blocked',
      rule: 'block-system-prune',
    },
  ],
};

const VERSION_ONE_RULEBOOK: Rulebook = {
  rulebook_version: 1,
  name: 'fixture-rules',
  version: '1.0.0',
  allowed_commands: ['docker'],
  rules: [
    {
      name: 'block-system-prune',
      command: 'docker',
      subcommand: 'system',
      block_args: ['prune'],
      reason: 'Prune everything and an unrelated stopped container goes with it.',
    },
  ],
  tests: [
    { command: 'docker system prune', expect: 'blocked', rule: 'block-system-prune' },
    { command: 'docker system prune', expect: 'allowed' },
  ],
};

describe('the rulebook fixture evaluator', () => {
  test('names the failing fixture, its verdict and why', () => {
    expect(evaluateRulebookFixtures(RULEBOOK)).toEqual([
      'tests[2]: expected "block-system-prune" to block "sudo docker system prune" but no rule matched',
      'tests[5]: expected "block-system-prune" to block "bash -c \'docker system prune\'" but no rule matched',
      'tests[8]: could not parse fixture command: ',
      'tests[9]: expected "docker system prune --all" to be allowed but "block-system-prune" matched',
      'tests[11]: expected "block-system-prune" to block "kubectl config use-context prod" but "block-context-use" matched first',
      'tests[12]: expected "block-system-prune" to block "docker system prune --filter until=24h" but no rule matched',
    ]);
  });

  test('leaves a version 1 rulebook shape-validated only', () => {
    expect(evaluateRulebookFixtures(VERSION_ONE_RULEBOOK)).toEqual([]);
  });
});
