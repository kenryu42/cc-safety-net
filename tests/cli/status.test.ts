import { afterEach, describe, expect, test } from 'bun:test';
import { posix } from 'node:path';
import { printStatus } from '@/cli/status';
import {
  type CliRow,
  runCliCommand,
  runCliDifferential,
  seedFiles,
} from '../helpers/cli-differential';
import {
  json,
  PLUGIN_SETTINGS,
  PROJECT_POLICY,
  RULE_SWITCHED_OFF,
  USER_POLICY,
  WEAKENED_BY_PROJECT,
} from '../helpers/cli-fixtures';
import { removeTempRoots } from '../helpers/temp-home';

afterEach(() => {
  removeTempRoots();
});

const statusRow = (row: Omit<CliRow, 'args'>): CliRow => ({ args: ['status'], ...row });

const runStatus = (row: Omit<CliRow, 'args'>) =>
  runCliCommand(statusRow(row), (environment) => {
    printStatus(environment);
    return 0;
  });

describe('status', () => {
  test('a fresh home reports the disabled plugin and points at doctor', async () => {
    const outcome = await runStatus({});
    expect(outcome.exitCode).toBe(0);
    expect(outcome.stdout).toContain('  Not active');
    expect(outcome.stdout).toContain(
      'plugin cc-safety-net@cc-marketplace is disabled in Claude Code',
    );
    expect(outcome.stdout).toContain('  Full report: cc-safety-net doctor');
    expect(outcome).toEqual(runCliDifferential(statusRow({})));
  }, 60_000);

  test('an enabled plugin leaves nothing inactive', async () => {
    const outcome = await runStatus({
      seed: (side) => seedFiles(side, { 'home/.claude/settings.json': PLUGIN_SETTINGS }),
    });
    expect(outcome.exitCode).toBe(0);
    expect(outcome.stdout).toContain('  Everything configured is active.');
    expect(outcome.stdout).toContain('CC Safety Net — ready');
  }, 60_000);

  test('a malformed user policy renders the degraded verdict', async () => {
    const outcome = await runStatus({
      seed: (side) => seedFiles(side, { [USER_POLICY]: 'not json' }),
    });
    expect(outcome.exitCode).toBe(0);
    expect(outcome.stdout).toContain('CC Safety Net — degraded');
  }, 60_000);

  test('the level environment override reaches the Level row', async () => {
    const outcome = await runStatus({ env: { CC_SAFETY_NET_LEVEL: 'strict' } });
    expect(outcome.stdout).toContain('  Level        strict\n');
  }, 60_000);

  test('worktree mode adds its own row', async () => {
    const outcome = await runStatus({ env: { CC_SAFETY_NET_WORKTREE: '1' } });
    expect(outcome.stdout).toContain('  Worktree     relaxations active\n');
  }, 60_000);

  test('a project policy that weakens the user policy is named as such', async () => {
    const outcome = await runStatus({
      seed: (side) => seedFiles(side, WEAKENED_BY_PROJECT),
    });
    expect(outcome.stdout).toContain(`  Project      ${posix.join('<root>', PROJECT_POLICY)}\n`);
    expect(outcome.stdout).toContain('  Project policy');
  }, 60_000);

  test('a rule override that changes inherited behaviour marks the level customised', async () => {
    const outcome = await runStatus({
      seed: (side) => seedFiles(side, { [USER_POLICY]: RULE_SWITCHED_OFF }),
    });
    expect(outcome.stdout).toContain('  Level        standard (customised)\n');
  }, 60_000);

  test('an active project rulebook is counted', async () => {
    const outcome = await runStatus({
      seed: (side) =>
        seedFiles(side, {
          'project/.cc-safety-net/rules/rule.json': json({
            version: 1,
            rules: ['project-rules'],
          }),
          'project/.cc-safety-net/rules/project-rules/rulebook.json': json({
            rulebook_version: 1,
            name: 'project-rules',
            version: '1.0.0',
            allowed_commands: ['docker'],
            rules: [
              {
                name: 'block-docker-system-prune',
                command: 'docker',
                subcommand: 'system',
                block_args: ['prune'],
                reason: 'Pruning the shared Docker host removes other work.',
                intent: 'manual_only',
              },
            ],
          }),
        }),
    });
    expect(outcome.stdout).toContain('  Rules        1 active\n');
  }, 60_000);
});
