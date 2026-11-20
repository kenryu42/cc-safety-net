import { describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import type { Rulebook } from '@/core/policy/rulebook';
import { evaluateRulebookFixtures } from '@/gate/rulebook-fixtures';

const DEEPLY_NESTED = `echo ${'$('.repeat(100)}docker system prune${')'.repeat(100)}`;

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
    { command: 'env FOO=1 docker system prune', expect: 'blocked', rule: 'block-system-prune' },
    { command: 'timeout 30 docker system prune', expect: 'blocked', rule: 'block-system-prune' },
    { command: '{ docker system prune; }', expect: 'blocked', rule: 'block-system-prune' },
    { command: "bash -c 'docker system prune'", expect: 'blocked', rule: 'block-system-prune' },
    {
      command: 'docker system prune | tee prune.log',
      expect: 'blocked',
      rule: 'block-system-prune',
    },
    { command: 'echo $(docker system prune)', expect: 'blocked', rule: 'block-system-prune' },
    {
      command: 'cleanup() { docker system prune; }; cleanup',
      expect: 'blocked',
      rule: 'block-system-prune',
    },
    { command: 'docker ps', expect: 'allowed' },
    { command: 'rm -rf /', expect: 'allowed' },
    { command: 'git reset --hard', expect: 'allowed' },
    {
      command: 'cleanup() { docker system prune; }',
      expect: 'blocked',
      rule: 'block-system-prune',
    },
    { command: 'docker system prune --all', expect: 'allowed' },
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
    { command: 'rm -rf /', expect: 'blocked', rule: 'block-system-prune' },
    { command: DEEPLY_NESTED, expect: 'blocked', rule: 'block-system-prune' },
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
  test('reads each fixture the way the hook would, and names the ones that disagree', () => {
    expect(evaluateRulebookFixtures(RULEBOOK)).toEqual([
      'tests[13]: expected "block-system-prune" to block "cleanup() { docker system prune; }" but no rule matched',
      'tests[14]: expected "docker system prune --all" to be allowed but "block-system-prune" matched',
      'tests[15]: expected "block-system-prune" to block "kubectl config use-context prod" but "block-context-use" matched first',
      'tests[16]: expected "block-system-prune" to block "docker system prune --filter until=24h" but no rule matched',
      'tests[17]: expected "block-system-prune" to block "rm -rf /" but "rm.recursive-force-root-or-home" matched first',
      `tests[18]: expected "block-system-prune" to block "${DEEPLY_NESTED}" but "analysis.recursion-limit" matched first`,
    ]);
  });

  test('reads a fixture with the options the rulebook declares as taking a value', () => {
    const fixture = {
      command: 'kubectl --context prod config use-context staging',
      expect: 'blocked' as const,
      rule: 'block-context-use',
    };
    expect(evaluateRulebookFixtures({ ...RULEBOOK, tests: [fixture] })).toEqual([
      'tests[0]: expected "block-context-use" to block "kubectl --context prod config use-context staging" but no rule matched',
    ]);
    expect(
      evaluateRulebookFixtures({
        ...RULEBOOK,
        options_with_values: { kubectl: ['--context'] },
        tests: [fixture],
      }),
    ).toEqual([]);
  });

  test('judges a fixture on its command line and reads no file it names', () => {
    const script = join(mkdtempSync(join(tmpdir(), 'ccsn-fixture-script-')), 'cleanup.sh');
    writeFileSync(script, 'docker system prune\n');
    try {
      expect(
        evaluateRulebookFixtures({
          ...RULEBOOK,
          tests: [
            { command: `bash ${script}`, expect: 'allowed' },
            { command: `git -C ${dirname(script)} status`, expect: 'allowed' },
          ],
        }),
      ).toEqual([]);
    } finally {
      rmSync(dirname(script), { recursive: true });
    }
  });

  test('leaves a version 1 rulebook shape-validated only', () => {
    expect(evaluateRulebookFixtures(VERSION_ONE_RULEBOOK)).toEqual([]);
  });
});
