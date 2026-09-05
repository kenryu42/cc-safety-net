import { afterEach, describe, expect, test } from 'bun:test';
import {
  type CliRow,
  expectSameCli,
  runCliDifferential,
  seedFiles,
} from '../helpers/cli-differential';
import {
  json,
  PLUGIN_SETTINGS,
  RULE_SWITCHED_OFF,
  USER_POLICY,
  WEAKENED_BY_PROJECT,
} from '../helpers/cli-fixtures';
import { removeTempRoots } from '../helpers/temp-home';

/**
 * `status` is the projection of one policy resolution a user reads before anything else, so
 * each row seeds one configuration and pins the line it is supposed to change. The plugin
 * probe, the level, the rule count, the two policy paths, the worktree row, the project
 * weakenings block and the "Not active" bullets each have a row that fails if the projection
 * drifts. Stdout is a pipe here, so both sides render the ASCII form without color.
 */

afterEach(() => {
  removeTempRoots();
});

const statusRow = (row: Omit<CliRow, 'args'>): CliRow => ({ args: ['status'], ...row });

const runStatus = async (row: Omit<CliRow, 'args'>) =>
  expectSameCli(await runCliDifferential(statusRow(row)));

describe('status', () => {
  test('a fresh home reports the disabled plugin and points at doctor', async () => {
    const shipped = await runStatus({});
    expect(shipped.exitCode).toBe(0);
    expect(shipped.stdout).toContain('  Not active');
    expect(shipped.stdout).toContain(
      'plugin cc-safety-net@cc-marketplace is disabled in Claude Code',
    );
    expect(shipped.stdout).toContain('  Full report: cc-safety-net doctor');
  }, 60_000);

  test('an enabled plugin leaves nothing inactive', async () => {
    const shipped = await runStatus({
      seed: (side) => seedFiles(side, { 'home/.claude/settings.json': PLUGIN_SETTINGS }),
    });
    expect(shipped.exitCode).toBe(0);
    expect(shipped.stdout).toContain('  Everything configured is active.');
    expect(shipped.stdout).toContain('CC Safety Net — ready');
  }, 60_000);

  test('a malformed user policy renders the degraded verdict', async () => {
    const shipped = await runStatus({
      seed: (side) => seedFiles(side, { [USER_POLICY]: 'not json' }),
    });
    expect(shipped.exitCode).toBe(0);
    expect(shipped.stdout).toContain('CC Safety Net — degraded');
  }, 60_000);

  test('the level environment override reaches the Level row', async () => {
    const shipped = await runStatus({ env: { CC_SAFETY_NET_LEVEL: 'strict' } });
    expect(shipped.stdout).toContain('  Level        strict\n');
  }, 60_000);

  test('worktree mode adds its own row', async () => {
    const shipped = await runStatus({ env: { CC_SAFETY_NET_WORKTREE: '1' } });
    expect(shipped.stdout).toContain('  Worktree     relaxations active\n');
  }, 60_000);

  test('a project policy that weakens the user policy is named as such', async () => {
    const shipped = await runStatus({
      seed: (side) => seedFiles(side, WEAKENED_BY_PROJECT),
    });
    expect(shipped.stdout).toContain('  Project      <root>/project/.cc-safety-net/policy.json\n');
    expect(shipped.stdout).toContain('  Project policy');
  }, 60_000);

  test('a rule override that changes inherited behaviour marks the level customised', async () => {
    const shipped = await runStatus({
      seed: (side) => seedFiles(side, { [USER_POLICY]: RULE_SWITCHED_OFF }),
    });
    expect(shipped.stdout).toContain('  Level        standard (customised)\n');
  }, 60_000);

  test('an active project rulebook is counted', async () => {
    const shipped = await runStatus({
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
    expect(shipped.stdout).toContain('  Rules        1 active\n');
  }, 60_000);
});
