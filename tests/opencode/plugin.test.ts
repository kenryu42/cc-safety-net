import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { syncRulesConfig } from '@/core/rules-policy';
import { SafetyNetPlugin } from '@/index';

describe('OpenCode plugin', () => {
  test('registers built-in commands without removing existing commands', async () => {
    const plugin = (await SafetyNetPlugin({
      directory: process.cwd(),
    } as Parameters<typeof SafetyNetPlugin>[0])) as unknown as {
      config: (opencodeConfig: Record<string, unknown>) => Promise<void>;
    };
    const opencodeConfig = {
      command: {
        existing: { description: 'Existing command', template: 'keep' },
      },
    };

    await plugin.config(opencodeConfig);

    expect(Object.keys(opencodeConfig.command)).toContain('cc-safetynet-rules');
    expect(opencodeConfig.command.existing).toEqual({
      description: 'Existing command',
      template: 'keep',
    });
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
      const plugin = (await SafetyNetPlugin({
        directory: dir,
      } as Parameters<typeof SafetyNetPlugin>[0])) as unknown as {
        'tool.execute.before': (
          input: { tool: string },
          output: { args: { command: string } },
        ) => Promise<void>;
      };

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
