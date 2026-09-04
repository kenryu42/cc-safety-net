import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { printStatus } from '@/cli/status';
import { loadPolicySnapshot } from '@/policy/snapshot';
import { hermeticSafetyNetHome, runCCSafetyNetCli, withEnv, withStdoutColor } from '../helpers.ts';

/**
 * `status` renders one snapshot on two surfaces. The subprocess runs cover the
 * non-TTY surface (piped stdout, so `columns` is unset and the width cap is 80);
 * the one in-process run covers the TTY surface, where the glyphs and colour
 * that the ASCII fallbacks replace are the thing under test.
 */

const WIDTH = 80;
const PLUGIN_DIAGNOSTIC =
  'plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected.';

const hermeticHome = hermeticSafetyNetHome('cc-safety-net-status-home-');

function clearEnv(): void {
  process.env.CC_SAFETY_NET_HOME = hermeticHome;
  delete process.env.CC_SAFETY_NET_LEVEL;
  delete process.env.CC_SAFETY_NET_STRICT;
  delete process.env.CC_SAFETY_NET_PARANOID;
  delete process.env.CC_SAFETY_NET_WORKTREE;
  delete process.env.SAFETY_NET_STRICT;
  delete process.env.SAFETY_NET_PARANOID;
  delete process.env.SAFETY_NET_WORKTREE;
  delete process.env.CLAUDE_SETTINGS_PATH;
  delete process.env.NO_COLOR;
}

/** Rebuilds each issue bullet from the lines its hanging indent spans. */
function issueBullets(output: string): string[] {
  return output
    .replace(/\n {6}/g, ' ')
    .split('\n')
    .filter((line) => line.startsWith('    - '))
    .map((line) => line.slice(6));
}

function factValue(output: string, label: string): string {
  return (output.split('\n').find((line) => line.startsWith(`  ${label} `)) ?? '')
    .slice(2 + label.length)
    .trim();
}

describe('status command', () => {
  let root: string;
  let home: string;
  let project: string;
  let settingsPath: string;

  beforeEach(async () => {
    clearEnv();
    root = await mkdtemp(join(tmpdir(), 'safety-net-status-'));
    home = join(root, 'safety-net-home');
    project = join(root, 'project');
    settingsPath = join(root, 'settings.json');
    await mkdir(home);
    await mkdir(project);
    await writePluginSettings(settingsPath, true);
  });

  afterEach(async () => {
    clearEnv();
    await rm(root, { recursive: true, force: true });
  });

  const runStatus = (env: Record<string, string> = {}) =>
    runCCSafetyNetCli(
      ['status'],
      { CLAUDE_SETTINGS_PATH: settingsPath, CC_SAFETY_NET_HOME: home, ...env },
      project,
    );

  /**
   * The one TTY rendering: glyphs and colour instead of the ASCII fallbacks.
   * `columns` is pinned because the render width must not depend on the
   * terminal that happens to run the suite (lefthook gives its jobs a 0-width
   * pty, which once truncated every row and failed the ✘ test on pre-push).
   */
  const renderOnTTY = (columns = 80) => {
    const lines: string[] = [];
    const originalLog = console.log;
    const originalCwd = process.cwd();
    const originalColumns = process.stdout.columns;
    console.log = (line: string) => {
      lines.push(line);
    };
    Object.defineProperty(process.stdout, 'columns', {
      value: columns,
      writable: true,
      configurable: true,
    });
    process.chdir(project);
    try {
      withEnv({ CLAUDE_SETTINGS_PATH: settingsPath, CC_SAFETY_NET_HOME: home }, () =>
        withStdoutColor(true, printStatus),
      );
    } finally {
      console.log = originalLog;
      Object.defineProperty(process.stdout, 'columns', {
        value: originalColumns,
        writable: true,
        configurable: true,
      });
      process.chdir(originalCwd);
    }
    return lines.join('\n');
  };

  const writeUserPolicy = (policy: Record<string, unknown>) =>
    writeFile(join(home, 'policy.json'), JSON.stringify(policy));

  const writeProjectPolicy = async (policy: Record<string, unknown>) => {
    await mkdir(join(project, '.cc-safety-net'), { recursive: true });
    await writeFile(join(project, '.cc-safety-net', 'policy.json'), JSON.stringify(policy));
  };

  test('prints the facts block and no issues block when ready', async () => {
    const result = await runStatus();

    expect(result.output).toContain('CC Safety Net — ready');
    expect(result.output).toMatch(/^ {2}Protection\s+destructive ok\s+secrets ok$/m);
    expect(result.output).toMatch(/^ {2}Level\s+standard$/m);
    expect(result.output).toMatch(/^ {2}Rules\s+none active$/m);
    // Rows never fold: the policy path is printed as a prefix cut with `…`.
    expect(join(home, 'policy.json')).toStartWith(factValue(result.output, 'Policy').slice(0, -1));
    expect(result.output).toContain('Everything configured is active.');
    expect(result.output).not.toContain('Not active');
    expect(issueBullets(result.output)).toEqual([]);
  });

  /**
   * The project policy is a second file in force, so it is named as a fact, and
   * what it relaxes is stated where the reader already looks. The deltas are
   * informational: nothing about them is inactive, so they never join the
   * "Not active" bullets.
   */
  test('names the project policy file and prints its weakenings as their own block', async () => {
    await writeUserPolicy({ version: 1, safety: { level: 'strict' } });

    const withoutProject = await runStatus();
    expect(withoutProject.output).not.toContain('Project');

    await writeProjectPolicy({ version: 1, safety: { level: 'standard' } });
    const result = await runStatus();

    expect(factValue(result.output, 'Project')).not.toBe('');
    expect(
      [project, await realpath(project)].some((candidate) =>
        join(candidate, '.cc-safety-net', 'policy.json').startsWith(
          factValue(result.output, 'Project').slice(0, -1),
        ),
      ),
    ).toBeTrue();
    expect(result.output).toMatch(/^ {2}Level\s+standard$/m);
    expect(result.output).toMatch(/^ {2}Project policy$/m);
    expect(result.output).toMatch(/^ {4}project policy lowers level: strict -> standard$/m);
    expect(issueBullets(result.output)).toEqual([]);
    expect(result.output).toContain('Everything configured is active.');
  });

  test('wrapped weakening lines stay inside the render width', async () => {
    await writeUserPolicy({ version: 1 });
    await writeProjectPolicy({
      version: 1,
      // A path with spaces gives the wrapper real break points; the budget bug
      // shows as continuation lines two columns past the render width.
      destructive_command_protection: { allow_paths: [`~/team/${'word '.repeat(25)}end`] },
    });

    const output = renderOnTTY(60);

    expect(output).toContain('Project policy');
    output.split('\n').forEach((line) => {
      // biome-ignore lint/suspicious/noControlCharactersInRegex: strips ANSI color codes
      expect(line.replace(/\[[0-9;]*m/g, '').length, line).toBeLessThanOrEqual(60);
    });
  });

  test('does not tilde-abbreviate a path that merely shares a prefix with home', async () => {
    await writeUserPolicy({ version: 1 });
    await writeProjectPolicy({ version: 1, workflow: { worktree_mode: true } });

    // With home `<root>/proj`, the project under `<root>/project` shares a raw
    // string prefix; abbreviating it would display a path that does not exist.
    const result = await runStatus({ HOME: join(root, 'proj') });

    expect(result.output).not.toContain('~ect');
  });

  test('prints one bullet per diagnostic and never the combined reason', async () => {
    await writeUserPolicy({ version: 1, safety: { level: 'nope' }, not_a_real_field: true });
    const snapshot = loadPolicySnapshot({ cwd: project, userConfigDir: join(home, 'rules') });
    const reason = snapshot.state === 'degraded' ? snapshot.reason : '';
    expect(snapshot.diagnostics.length).toBeGreaterThan(1);
    expect(reason).not.toBe('');

    const result = await runStatus();

    expect(result.output).toContain('CC Safety Net — degraded');
    expect(issueBullets(result.output)).toEqual([...snapshot.diagnostics]);
    expect(result.output).not.toContain(reason);
    expect(result.output).toContain('Full report: cc-safety-net doctor');
  });

  test('leads with the plugin bullet and still prints the facts when the plugin is off', async () => {
    await writePluginSettings(settingsPath, false);

    const result = await runStatus();

    expect(issueBullets(result.output)).toEqual([PLUGIN_DIAGNOSTIC]);
    expect(result.output).toMatch(/^ {2}Protection\s+destructive ok\s+secrets ok$/m);
    expect(result.output).toMatch(/^ {2}Level\s+standard$/m);
    expect(result.output).toMatch(/^ {2}Rules\s+none active$/m);
  });

  // The verdict answers for the whole snapshot; the Claude Code plugin key answers
  // for one integration, so it must never set the verdict in either direction.
  test('keeps the snapshot verdict when the Claude Code plugin key is absent', async () => {
    await writeFile(settingsPath, JSON.stringify({}));

    const result = await runStatus();

    expect(result.output).toContain('CC Safety Net — ready');
    expect(result.output).not.toContain('not enforcing');
    expect(issueBullets(result.output)).toEqual([PLUGIN_DIAGNOSTIC]);
  });

  test('keeps the degraded verdict when the plugin is off', async () => {
    await writeUserPolicy({ version: 1, not_a_real_field: true });
    await writePluginSettings(settingsPath, false);
    const snapshot = loadPolicySnapshot({ cwd: project, userConfigDir: join(home, 'rules') });

    const result = await runStatus();

    expect(result.output).toContain('CC Safety Net — degraded');
    expect(result.output).not.toContain('not enforcing');
    expect(issueBullets(result.output)).toEqual([PLUGIN_DIAGNOSTIC, ...snapshot.diagnostics]);
  });

  test('never claims everything is active while the plugin is off', async () => {
    await writePluginSettings(settingsPath, false);

    const result = await runStatus();

    expect(result.output).not.toContain('Everything configured is active.');
    expect(result.output).toContain('Not active');
  });

  test('exits 0 whether ready or degraded, and with the plugin off', async () => {
    expect((await runStatus()).exitCode).toBe(0);

    await writeUserPolicy({ version: 1, not_a_real_field: true });
    const degraded = await runStatus();
    expect(degraded.output).toContain('degraded');
    expect(degraded.exitCode).toBe(0);

    await writePluginSettings(settingsPath, false);
    expect((await runStatus()).exitCode).toBe(0);
  });

  test('falls back to ASCII glyphs without escapes under NO_COLOR', async () => {
    await writeUserPolicy({
      version: 1,
      destructive_command_protection: { enabled: false },
      not_a_real_field: true,
    });

    const result = await runStatus({ NO_COLOR: '1' });

    expect(result.output).not.toContain('\x1b');
    expect(result.output).toMatch(/^ {2}Protection\s+destructive OFF\s+secrets ok$/m);
    expect(issueBullets(result.output)).toHaveLength(1);
    expect(result.output).not.toContain('🛡');
    expect(result.output).not.toContain('✔');
    expect(result.output).not.toContain('✘');
    expect(result.output).not.toContain('·');
  });

  test('inverts a disabled protection to a red ✘ on a TTY', async () => {
    await writeUserPolicy({
      version: 1,
      destructive_command_protection: { enabled: false },
      not_a_real_field: true,
    });

    const output = renderOnTTY();

    expect(output).toContain(`destructive \x1b[31m✘\x1b[0m`);
    expect(output).toContain('secrets ✔');
    expect(output).toContain('🛡️');
    expect(output).toContain('    · ');
  });

  test('falls back to width 80 when the terminal reports zero columns', async () => {
    await writeUserPolicy({
      version: 1,
      destructive_command_protection: { enabled: false },
      not_a_real_field: true,
    });

    const output = renderOnTTY(0);

    expect(output).toContain('secrets ✔');
    expect(output).toMatch(/^ {2}Level {8}standard$/m);
  });

  test('prints the worktree row only when worktree mode is on', async () => {
    expect((await runStatus()).output).not.toContain('Worktree');

    const worktree = await runStatus({ CC_SAFETY_NET_WORKTREE: '1' });

    expect(worktree.output).toMatch(/^ {2}Worktree\s+relaxations active$/m);
  });

  test('wraps a long diagnostic with a hanging indent instead of overflowing the width', async () => {
    await writePluginSettings(settingsPath, false);

    const lines = (await runStatus()).output.trimEnd().split('\n');

    const bullet = lines.findIndex((line) => line.startsWith('    - '));
    expect(lines[bullet]?.length).toBeGreaterThan('    - '.length);
    expect(lines[bullet + 1]).toMatch(/^ {6}\S/);
    expect(lines.filter((line) => line.length > WIDTH)).toEqual([]);
  });
});

function writePluginSettings(path: string, enabled: boolean) {
  return writeFile(
    path,
    JSON.stringify({ enabledPlugins: { 'cc-safety-net@cc-marketplace': enabled } }),
  );
}
