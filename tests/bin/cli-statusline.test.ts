import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runSafetyNetCli } from '../helpers.ts';

function clearEnv(): void {
  delete process.env.CC_SAFETY_NET_STRICT;
  delete process.env.CC_SAFETY_NET_PARANOID;
  delete process.env.CC_SAFETY_NET_PARANOID_RM;
  delete process.env.CC_SAFETY_NET_PARANOID_INTERPRETERS;
  delete process.env.CC_SAFETY_NET_WORKTREE;
  delete process.env.SAFETY_NET_STRICT;
  delete process.env.SAFETY_NET_PARANOID;
  delete process.env.SAFETY_NET_PARANOID_RM;
  delete process.env.SAFETY_NET_PARANOID_INTERPRETERS;
  delete process.env.SAFETY_NET_WORKTREE;
  delete process.env.CLAUDE_SETTINGS_PATH;
}

async function runStatusline(env: Record<string, string>) {
  const result = await runSafetyNetCli(['statusline', '--claude-code'], env);
  return { output: result.output.trim(), exitCode: result.exitCode };
}

async function expectStatusline(env: Record<string, string>, output: string) {
  const result = await runStatusline(env);
  expect(result.output).toBe(output);
  expect(result.exitCode).toBe(0);
}

describe('statusline command', () => {
  // Create a temp settings file with plugin enabled to test statusline modes
  // When settings file doesn't exist, isPluginEnabled() defaults to false (disabled)
  let tempDir: string;
  let enabledSettingsPath: string;

  beforeEach(async () => {
    clearEnv();
    tempDir = await mkdtemp(join(tmpdir(), 'safety-net-statusline-'));
    enabledSettingsPath = join(tempDir, 'settings.json');
    await writeFile(
      enabledSettingsPath,
      JSON.stringify({
        enabledPlugins: { 'safety-net@cc-marketplace': true },
      }),
    );
    process.env.CLAUDE_SETTINGS_PATH = enabledSettingsPath;
  });

  afterEach(async () => {
    clearEnv();
    await rm(tempDir, { recursive: true, force: true });
  });

  const modes: Array<{ name: string; env: Record<string, string>; output: string }> = [
    { name: 'no env flags', env: {}, output: '🛡️ Safety Net ✅' },
    { name: 'SAFETY_NET_STRICT=1', env: { SAFETY_NET_STRICT: '1' }, output: '🛡️ Safety Net 🔒' },
    {
      name: 'SAFETY_NET_PARANOID=1',
      env: { SAFETY_NET_PARANOID: '1' },
      output: '🛡️ Safety Net 👁️',
    },
    {
      name: 'CC_SAFETY_NET_PARANOID=1',
      env: { CC_SAFETY_NET_PARANOID: '1' },
      output: '🛡️ Safety Net 👁️',
    },
    {
      name: 'SAFETY_NET_WORKTREE=1',
      env: { SAFETY_NET_WORKTREE: '1' },
      output: '🛡️ Safety Net 🌳',
    },
    {
      name: 'strict and paranoid',
      env: { SAFETY_NET_STRICT: '1', SAFETY_NET_PARANOID: '1' },
      output: '🛡️ Safety Net 🔒👁️',
    },
    {
      name: 'SAFETY_NET_PARANOID_RM=1 only',
      env: { SAFETY_NET_PARANOID_RM: '1' },
      output: '🛡️ Safety Net 🗑️',
    },
    {
      name: 'strict and paranoid rm',
      env: { SAFETY_NET_STRICT: '1', SAFETY_NET_PARANOID_RM: '1' },
      output: '🛡️ Safety Net 🔒🗑️',
    },
    {
      name: 'SAFETY_NET_PARANOID_INTERPRETERS=1',
      env: { SAFETY_NET_PARANOID_INTERPRETERS: '1' },
      output: '🛡️ Safety Net 🐚',
    },
    {
      name: 'strict and paranoid interpreters',
      env: { SAFETY_NET_STRICT: '1', SAFETY_NET_PARANOID_INTERPRETERS: '1' },
      output: '🛡️ Safety Net 🔒🐚',
    },
    {
      name: 'both granular paranoid flags',
      env: { SAFETY_NET_PARANOID_RM: '1', SAFETY_NET_PARANOID_INTERPRETERS: '1' },
      output: '🛡️ Safety Net 👁️',
    },
    {
      name: 'strict and both granular paranoid flags',
      env: {
        SAFETY_NET_STRICT: '1',
        SAFETY_NET_PARANOID_RM: '1',
        SAFETY_NET_PARANOID_INTERPRETERS: '1',
      },
      output: '🛡️ Safety Net 🔒👁️',
    },
  ];

  modes.forEach((mode) => {
    test(`shows ${mode.name}`, async () => {
      await expectStatusline(
        { CLAUDE_SETTINGS_PATH: enabledSettingsPath, ...mode.env },
        mode.output,
      );
    });
  });
});

describe('statusline command routing', () => {
  test('supports short Claude Code flag', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'safety-net-statusline-'));
    const settingsPath = join(tempDir, 'settings.json');
    try {
      await writePluginSettings(settingsPath, true);
      const result = await runSafetyNetCli(['statusline', '-cc'], {
        CLAUDE_SETTINGS_PATH: settingsPath,
      });

      expect(result.output.trim()).toBe('🛡️ Safety Net ✅');
      expect(result.exitCode).toBe(0);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  test('rejects legacy --statusline flag', async () => {
    const result = await runSafetyNetCli(['--statusline']);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Unknown option: --statusline');
  });

  test('statusline without platform flag prints help and exits nonzero', async () => {
    const result = await runSafetyNetCli(['statusline']);

    expect(result.exitCode).toBe(1);
    expect(result.output).toContain('cc-safety-net statusline');
    expect(result.output).toContain('-cc, --claude-code');
  });
});

describe('statusline enabled/disabled detection', () => {
  let tempDir: string;

  beforeEach(async () => {
    clearEnv();
    tempDir = await mkdtemp(join(tmpdir(), 'safety-net-test-'));
  });

  afterEach(async () => {
    clearEnv();
    await rm(tempDir, { recursive: true, force: true });
  });

  test('shows ❌ when plugin is disabled in settings', async () => {
    const settingsPath = join(tempDir, 'settings.json');
    await writePluginSettings(settingsPath, false);
    await expectStatusline({ CLAUDE_SETTINGS_PATH: settingsPath }, '🛡️ Safety Net ❌');
  });

  test('shows ✅ when plugin is enabled in settings', async () => {
    const settingsPath = join(tempDir, 'settings.json');
    await writePluginSettings(settingsPath, true);
    await expectStatusline({ CLAUDE_SETTINGS_PATH: settingsPath }, '🛡️ Safety Net ✅');
  });

  test('shows ❌ when settings file does not exist (default disabled)', async () => {
    const settingsPath = join(tempDir, 'nonexistent.json');

    await expectStatusline({ CLAUDE_SETTINGS_PATH: settingsPath }, '🛡️ Safety Net ❌');
  });

  test('shows ❌ when enabledPlugins key is missing (default disabled)', async () => {
    const settingsPath = join(tempDir, 'settings.json');
    await writeFile(settingsPath, JSON.stringify({ model: 'opus' }));

    await expectStatusline({ CLAUDE_SETTINGS_PATH: settingsPath }, '🛡️ Safety Net ❌');
  });

  test('disabled plugin ignores mode flags (shows ❌ only)', async () => {
    const settingsPath = join(tempDir, 'settings.json');
    await writePluginSettings(settingsPath, false);
    await expectStatusline(
      { CLAUDE_SETTINGS_PATH: settingsPath, SAFETY_NET_STRICT: '1', SAFETY_NET_PARANOID: '1' },
      '🛡️ Safety Net ❌',
    );
  });

  test('enabled plugin with modes shows mode emojis', async () => {
    const settingsPath = join(tempDir, 'settings.json');
    await writePluginSettings(settingsPath, true);
    await expectStatusline(
      { CLAUDE_SETTINGS_PATH: settingsPath, SAFETY_NET_STRICT: '1' },
      '🛡️ Safety Net 🔒',
    );
  });
});

async function writePluginSettings(path: string, enabled: boolean) {
  await writeFile(
    path,
    JSON.stringify({
      enabledPlugins: {
        'safety-net@cc-marketplace': enabled,
      },
    }),
  );
}
