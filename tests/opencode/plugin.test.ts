import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { syncRulesConfig } from '@/core/rules/policy';
import { CCSafetyNetPlugin } from '@/index';

type ToolPlugin = {
  'tool.execute.before': (
    input: { tool: string },
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
      'Safety Net failed closed',
    );
  });

  test('reloads and repairs local rules before each tool execution', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-opencode-plugin-'));
    try {
      writeRulebook(dir, [
        {
          name: 'block-git-add-all',
          subcommand: 'add',
          block_args: ['-A'],
          reason: 'Stage specific files.',
        },
      ]);
      await syncRulesConfig({
        cwd: dir,
        userConfigDir: join(dir, 'home', '.cc-safety-net', 'rules'),
      });
      const plugin = await loadToolPlugin(dir);

      writeRulebook(dir, [
        {
          name: 'block-git-status',
          subcommand: 'status',
          block_args: ['status'],
          reason: 'Use porcelain status elsewhere.',
        },
      ]);

      await expect(
        plugin['tool.execute.before']({ tool: 'bash' }, { args: { command: 'git status' } }),
      ).rejects.toThrow('Use porcelain status elsewhere.');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

async function loadToolPlugin(directory: string): Promise<ToolPlugin> {
  return (await CCSafetyNetPlugin({
    directory,
  } as Parameters<typeof CCSafetyNetPlugin>[0])) as unknown as ToolPlugin;
}

function writeRulebook(
  dir: string,
  rules: Array<{ name: string; subcommand: string; block_args: string[]; reason: string }>,
): void {
  mkdirSync(join(dir, '.cc-safety-net/rules', 'project-rules'), { recursive: true });
  writeFileSync(
    join(dir, '.cc-safety-net/rules', 'rule.json'),
    JSON.stringify({ version: 1, rules: ['project-rules'], overrides: {} }),
    'utf-8',
  );
  writeFileSync(
    join(dir, '.cc-safety-net/rules', 'project-rules', 'rulebook.json'),
    JSON.stringify({
      rulebook_version: 1,
      name: 'project-rules',
      version: '1.0.0',
      allowed_commands: ['git'],
      rules: rules.map((rule) => ({
        name: rule.name,
        command: 'git',
        subcommand: rule.subcommand,
        block_args: rule.block_args,
        reason: rule.reason,
      })),
      tests: rules.map((rule) => ({
        command: `git ${rule.subcommand} ${rule.block_args[0]}`,
        expect: 'blocked',
        rule: rule.name,
      })),
    }),
    'utf-8',
  );
}
