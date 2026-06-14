import { describe, expect, test } from 'bun:test';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CCSafetyNetPlugin } from '@/index';
import {
  syncInitialGitRulebook,
  updatedGitRule,
  writeUpdatedGitRulebook,
} from '../helpers/rulebook';

type ToolPlugin = {
  'tool.execute.before': (
    input: { tool: string; sessionID?: string },
    output: { args: { command?: string } },
  ) => Promise<void>;
};

describe('OpenCode plugin', () => {
  test('reads current environment mode names', async () => {
    const original = process.env.CC_SAFETY_NET_PARANOID_INTERPRETERS;
    process.env.CC_SAFETY_NET_PARANOID_INTERPRETERS = '1';
    try {
      const plugin = await loadToolPlugin(process.cwd());

      await expect(
        plugin['tool.execute.before'](
          { tool: 'bash' },
          { args: { command: 'node -e "console.log(1)"' } },
        ),
      ).rejects.toThrow('paranoid');
    } finally {
      if (original === undefined) {
        delete process.env.CC_SAFETY_NET_PARANOID_INTERPRETERS;
      } else {
        process.env.CC_SAFETY_NET_PARANOID_INTERPRETERS = original;
      }
    }
  });

  test('registers built-in commands without removing existing commands', async () => {
    const plugin = (await CCSafetyNetPlugin({
      directory: process.cwd(),
    } as Parameters<typeof CCSafetyNetPlugin>[0])) as unknown as {
      config: (opencodeConfig: Record<string, unknown>) => Promise<void>;
    };
    const opencodeConfig = {
      command: {
        existing: { description: 'Existing command', template: 'keep' },
      },
    };

    await plugin.config(opencodeConfig);

    expect(Object.keys(opencodeConfig.command)).toContain('cc-safety-net');
    expect(opencodeConfig.command.existing).toEqual({
      description: 'Existing command',
      template: 'keep',
    });
  });

  test('fails closed when OpenCode passes malformed bash output', async () => {
    const plugin = await loadToolPlugin(process.cwd());

    await expect(plugin['tool.execute.before']({ tool: 'bash' }, { args: {} })).rejects.toThrow(
      'CC Safety Net failed closed',
    );
  });

  test('writes audit log for blocked commands with session id', async () => {
    const homeDir = mkdtempSync(join(tmpdir(), 'safety-net-opencode-home-'));
    const projectDir = mkdtempSync(join(tmpdir(), 'safety-net-opencode-project-'));
    try {
      const plugin = await loadToolPlugin(projectDir, homeDir);

      await expect(
        plugin['tool.execute.before'](
          { tool: 'bash', sessionID: 'opencode-test-session' },
          { args: { command: 'git reset --hard' } },
        ),
      ).rejects.toThrow('git reset --hard');

      const logFile = join(homeDir, '.cc-safety-net', 'logs', 'opencode-test-session.jsonl');
      expect(existsSync(logFile)).toBe(true);
      const entry = JSON.parse(readFileSync(logFile, 'utf-8').trim());
      expect(entry.decision).toBe('deny');
      expect(entry.command).toBe('git reset --hard');
      expect(entry.segment).toBe('git reset --hard');
      expect(entry.reason).toContain('git reset --hard');
      expect(entry.cwd).toBe(projectDir);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
      rmSync(projectDir, { recursive: true, force: true });
    }
  });

  test('reloads and repairs local rules before each tool execution', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-opencode-plugin-'));
    try {
      await syncInitialGitRulebook(dir);
      const plugin = await loadToolPlugin(dir);

      writeUpdatedGitRulebook(dir);

      await expect(
        plugin['tool.execute.before']({ tool: 'bash' }, { args: { command: 'git status' } }),
      ).rejects.toThrow(updatedGitRule.reason);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

async function loadToolPlugin(directory: string, homeDir?: string): Promise<ToolPlugin> {
  return (await CCSafetyNetPlugin({
    directory,
    homeDir,
  } as Parameters<typeof CCSafetyNetPlugin>[0])) as unknown as ToolPlugin;
}
