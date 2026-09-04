import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, parse } from 'node:path';
import {
  PATH_CANONICALIZATION_LIMITS,
  PathCanonicalizationLimitError,
} from '@/analyzer/path-canonicalization';
import type { GuardDependencies } from '@/engine/guard';
import { CCSafetyNetPlugin } from '@/index';
import {
  createCCSafetyNetPlugin,
  normalizeOpenCodeWindowsWorkdir,
  resolveOpenCodeShellRoute,
} from '@/integrations/opencode/plugin';
import { getUserPolicyPath } from '@/policy/store';
import { writeDefaultRulesConfig } from '@/rules/policy';
import {
  createLinkedWorktreeFixture,
  readAuditLogEntriesForSession,
  readLatestAuditLogEntry,
  withEnv,
} from '../../helpers';
import {
  gitCommitRule,
  initialGitRule,
  syncInitialGitRulebook,
  syncTransparentGitCommitRulebook,
  updatedGitRule,
  writeUpdatedGitRulebook,
} from '../../helpers/rulebook';

type ToolPlugin = {
  config: (opencodeConfig: Record<string, unknown>) => Promise<void>;
  'tool.execute.before': (
    input: { tool: string; sessionID?: string },
    output: { args: Record<string, unknown> },
  ) => Promise<void>;
};

function executeBash(plugin: ToolPlugin, command: string, workdir?: string) {
  return plugin['tool.execute.before'](
    { tool: 'bash' },
    { args: { command, ...(workdir ? { workdir } : {}) } },
  );
}

function executeGitStatus(plugin: ToolPlugin, workdir?: string) {
  return executeBash(plugin, 'git status', workdir);
}

function catastrophicDeleteCommand(cwd: string) {
  const root = parse(cwd).root;
  return process.platform === 'win32'
    ? `Remove-Item '${root.replaceAll("'", "''")}' -Recurse -Force`
    : `rm -rf ${root}`;
}

const CATASTROPHIC_DELETE_REASON =
  process.platform === 'win32'
    ? 'PowerShell Remove-Item targeting root or home directory is extremely dangerous and always blocked.'
    : 'This path contains the protected policy config and you must not modify or delete it.';

const publicInputExposesGuardDependencies: 'safetyNetGuardDependencies' extends keyof Parameters<
  typeof CCSafetyNetPlugin
>[0]
  ? true
  : false = false;
const publicInputAcceptsHomeDir: 'homeDir' extends keyof Parameters<typeof CCSafetyNetPlugin>[0]
  ? true
  : false = false;
type PublicPluginHooks = Awaited<ReturnType<typeof CCSafetyNetPlugin>>;
const publicConfigHookIsRequired: object extends Pick<PublicPluginHooks, 'config'> ? false : true =
  false;
const publicToolHookIsRequired: object extends Pick<PublicPluginHooks, 'tool.execute.before'>
  ? false
  : true = false;

describe('OpenCode plugin', () => {
  test('rejects over-budget path sets with only the fixed canonicalization cause', async () => {
    await withSafetyNetHomeDir('safety-net-opencode-path-budget-', async (dir) => {
      const plugin = await loadToolPlugin(dir);
      const marker = 'private-opencode-path-marker';
      // A target costs one realpath attempt per missing component plus one for
      // the existing root. Moderately deep targets exceed the attempt budget with
      // few enough input nodes to stay under the tool input traversal limits and
      // few enough walked bytes to stay under the processed-candidate budget.
      const missingComponentsPerTarget = 15;
      const missingPrefix = Array.from(
        { length: missingComponentsPerTarget - 1 },
        (_, index) => `m${index}`,
      ).join('/');

      const errorMessage = await capturePluginErrorMessage(() =>
        plugin['tool.execute.before'](
          { tool: 'Read' },
          {
            args: {
              targets: Array.from(
                {
                  length:
                    PATH_CANONICALIZATION_LIMITS.maxRealpathAttempts /
                      (missingComponentsPerTarget + 1) +
                    1,
                },
                (_, index) => ({ path: join(dir, missingPrefix, `${marker}-${index}`) }),
              ),
            },
          },
        ),
      );

      expect(errorMessage).toBe(new PathCanonicalizationLimitError().message);
      expect(errorMessage).not.toContain(marker);
    });
  });

  test('rejects Git fallback exhaustion with only the fixed underlying cause', async () => {
    await withSafetyNetHomeDir('safety-net-opencode-git-fallback-', async (dir) => {
      const plugin = await loadToolPlugin(dir);
      const marker = 'private-opencode-fallback-marker';
      const target = Array.from({ length: 65 }, (_, index) => `${marker}-${index}`).join(' ');
      const attackerPatch = `diff --git ${target} ${target}`;

      const errorMessage = await capturePluginErrorMessage(() =>
        plugin['tool.execute.before'](
          { tool: 'apply_patch' },
          { args: { command: attackerPatch } },
        ),
      );

      expect(errorMessage).toBe('tool input traversal limit exceeded');
      expect(errorMessage).not.toContain(marker);
    });
  });

  test('keeps guard dependencies out of the public plugin input', () => {
    expect(publicInputExposesGuardDependencies).toBeFalse();
    expect(publicInputAcceptsHomeDir).toBeFalse();
    expect(publicConfigHookIsRequired).toBeFalse();
    expect(publicToolHookIsRequired).toBeFalse();
  });

  test('ignores attempted guard dependency injection on the production plugin', async () => {
    const plugin = (await CCSafetyNetPlugin({
      directory: process.cwd(),
      safetyNetGuardDependencies: { analyzeCommand: () => null },
    } as never)) as unknown as ToolPlugin;

    await expect(
      plugin['tool.execute.before']({ tool: 'bash' }, { args: { command: 'git reset --hard' } }),
    ).rejects.toThrow('git reset --hard');
  });
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

  test('maps the configured executable to the shell route used by the real bash tool', () => {
    for (const shell of ['pwsh', '/opt/powershell.exe', String.raw`C:\Program Files\pwsh.EXE`]) {
      expect(resolveOpenCodeShellRoute(shell)).toBe('powershell');
    }
    for (const shell of ['bash', '/bin/dash', '/usr/local/bin/ksh', '/bin/sh', '/bin/zsh']) {
      expect(resolveOpenCodeShellRoute(shell)).toBe('posix');
    }
    for (const shell of ['cmd', 'cmd.exe', 'fish', '/bin/custom-shell']) {
      expect(resolveOpenCodeShellRoute(shell)).toBe('auto');
    }
    for (const shell of [undefined, 42]) {
      expect(resolveOpenCodeShellRoute(shell, 'win32')).toBe('powershell');
      expect(resolveOpenCodeShellRoute(shell, 'darwin', '/bin/zsh')).toBe('posix');
      expect(resolveOpenCodeShellRoute(shell, 'linux', 'pwsh')).toBe('powershell');
      expect(resolveOpenCodeShellRoute(shell, 'linux', 'fish')).toBe('auto');
      withEnv({ SHELL: undefined }, () => {
        expect(resolveOpenCodeShellRoute(shell, 'linux')).toBe('auto');
      });
    }
  });

  test('normalizes documented Windows workdir forms and passes through other paths', () => {
    expect(normalizeOpenCodeWindowsWorkdir('/c/work')).toBe('C:/work');
    expect(normalizeOpenCodeWindowsWorkdir('/C:/work')).toBe('C:/work');
    expect(normalizeOpenCodeWindowsWorkdir('/cygdrive/d/work')).toBe('D:/work');
    expect(normalizeOpenCodeWindowsWorkdir('/mnt/e/work')).toBe('E:/work');
    expect(normalizeOpenCodeWindowsWorkdir('nested/work')).toBe('nested/work');
    expect(normalizeOpenCodeWindowsWorkdir('/usr/local/work')).toBe('/usr/local/work');
  });

  test('uses the final shell value after later config mutations', async () => {
    const plugin = (await CCSafetyNetPlugin({
      directory: process.cwd(),
    } as Parameters<typeof CCSafetyNetPlugin>[0])) as unknown as ToolPlugin;
    const opencodeConfig = { shell: '/bin/bash' };
    await plugin.config(opencodeConfig);
    opencodeConfig.shell = 'pwsh';

    await expectBashBlock(
      plugin,
      'Remove-Item . -Recurse -Force',
      'powershell.remove-item-git-metadata',
    );
  });

  test('routes real bash traffic through the configured PowerShell analyzer', async () => {
    for (const shell of ['pwsh', String.raw`C:\Program Files\PowerShell\7\powershell.exe`]) {
      const plugin = await loadToolPlugin(process.cwd(), undefined, shell);

      await expectBashBlock(
        plugin,
        'Remove-Item . -Recurse -Force',
        'powershell.remove-item-git-metadata',
      );
      await expectBashBlock(
        plugin,
        'Remove-Item / -Recurse -Force',
        'powershell.remove-item-recursive-force-root-or-home',
      );
    }
  });

  test('routes real bash traffic through the configured POSIX analyzer', async () => {
    const plugin = await loadToolPlugin(process.cwd(), undefined, '/bin/bash');

    await expect(
      plugin['tool.execute.before'](
        { tool: 'bash' },
        { args: { command: 'Remove-Item . -Recurse -Force' } },
      ),
    ).resolves.toBeUndefined();
  });

  test('uses auto routing for cmd and unknown shell configuration', async () => {
    for (const shell of ['cmd.exe', '/bin/custom-shell']) {
      const plugin = await loadToolPlugin(process.cwd(), undefined, shell);

      await expectBashBlock(
        plugin,
        'Remove-Item . -Recurse -Force',
        'powershell.remove-item-git-metadata',
      );
      await expectBashBlock(plugin, 'rm -rf .', 'rm.git-metadata');
    }
  });

  test('does not promote command-like non-bash tool names to command executors', async () => {
    const plugin = await loadToolPlugin(process.cwd(), undefined, 'pwsh');

    for (const tool of ['Bash', 'PowerShell', 'shell']) {
      await expect(
        plugin['tool.execute.before'](
          { tool },
          { args: { command: 'Remove-Item . -Recurse -Force' } },
        ),
      ).resolves.toBeUndefined();
    }
  });

  test('fails closed when OpenCode passes malformed bash output', async () => {
    const plugin = await loadToolPlugin(process.cwd());

    for (const command of [undefined, null, '', '   ', 42]) {
      await expect(
        plugin['tool.execute.before']({ tool: 'bash' }, { args: { command } }),
      ).rejects.toThrow('CC Safety Net failed closed');
    }
  });

  test('fails closed when OpenCode passes an invalid tool name', async () => {
    const plugin = await loadToolPlugin(process.cwd());

    for (const tool of ['', '   ']) {
      await expect(plugin['tool.execute.before']({ tool }, { args: {} })).rejects.toThrow(
        'CC Safety Net failed closed',
      );
    }
  });

  test('fails closed when OpenCode passes an unusable workdir', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-opencode-workdir-'));
    const file = join(dir, 'not-a-directory');
    writeFileSync(file, 'fixture');
    try {
      const plugin = await loadToolPlugin(dir);

      for (const workdir of [null, '', '   ', 42, join(dir, 'missing'), file]) {
        await expect(
          plugin['tool.execute.before'](
            { tool: 'bash' },
            { args: { command: 'echo safe', workdir } },
          ),
        ).rejects.toThrow('CC Safety Net failed closed');
      }
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test.each([
    ['findPolicyMutation', 'policy raw failure'],
    ['loadPolicySnapshot', 'config raw failure'],
    ['findSensitiveTarget', 'secret raw failure'],
  ] as const)('propagates %s dependency errors unchanged', async (dependency, message) => {
    const plugin = await loadToolPlugin(process.cwd(), undefined, undefined, {
      [dependency]: () => {
        throw new Error(message);
      },
    });

    expect(
      await capturePluginErrorMessage(() =>
        plugin['tool.execute.before']({ tool: 'bash' }, { args: { command: 'git status' } }),
      ),
    ).toBe(message);
  });

  test('renders command analysis dependency errors as generic denials', async () => {
    const plugin = await loadToolPlugin(process.cwd(), undefined, undefined, {
      analyzeCommand: () => {
        throw new Error('analysis raw failure');
      },
    });

    const message = await capturePluginErrorMessage(() =>
      plugin['tool.execute.before']({ tool: 'bash' }, { args: { command: 'git status' } }),
    );
    expect(message).toContain('CC Safety Net failed closed');
    expect(message).not.toContain('analysis raw failure');
  });

  test('blocks sensitive non-bash tool path inputs', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-opencode-secret-'));
    try {
      const plugin = await loadToolPlugin(dir);

      await expect(
        plugin['tool.execute.before']({ tool: 'read' }, { args: { path: '.env' } }),
      ).rejects.toThrow('Rule: secret.basename.env');
      expect(
        await capturePluginErrorMessage(() =>
          plugin['tool.execute.before']({ tool: 'read' }, { args: { path: '.env' } }),
        ),
      ).not.toContain('Tool:');
      await expect(
        plugin['tool.execute.before']({ tool: 'Read' }, { args: { file_path: '.env.local' } }),
      ).rejects.toThrow('Command: .env.local');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('allows non-sensitive non-bash tool path inputs', async () => {
    const plugin = await loadToolPlugin(process.cwd());

    await expect(
      plugin['tool.execute.before']({ tool: 'read' }, { args: { path: 'README.md' } }),
    ).resolves.toBeUndefined();
  });

  test('keeps safe patch, edit, and search content inert', async () => {
    await withSafetyNetHomeDir('safety-net-opencode-inert-content-', async (dir) => {
      const plugin = await loadToolPlugin(dir);
      const policyPath = getUserPolicyPath();
      const patch = [
        '*** Begin Patch',
        '*** Update File: tests/example.test.ts',
        '@@ -1 +1,3 @@',
        '-const fixture = "safe";',
        '+const fixture = "rm -rf ~";',
        `+const policyExample = "${policyPath}";`,
        '+const secretExample = ".env";',
        '*** End Patch',
      ].join('\n');

      await expect(
        plugin['tool.execute.before']({ tool: 'apply_patch' }, { args: { patchText: patch } }),
      ).resolves.toBeUndefined();
      await expect(
        plugin['tool.execute.before'](
          { tool: 'edit' },
          {
            args: {
              file_path: 'README.md',
              old_string: 'safe',
              new_string: `rm -rf ~\n${policyPath}\n.env`,
            },
          },
        ),
      ).resolves.toBeUndefined();
      await expect(
        plugin['tool.execute.before'](
          { tool: 'grep' },
          { args: { pattern: `rm -rf ~|${policyPath}|.env`, path: 'README.md' } },
        ),
      ).resolves.toBeUndefined();
    });
  });

  test('keeps policy protection on patch targets across every OpenCode patch field', async () => {
    await withSafetyNetHomeDir('safety-net-opencode-patch-policy-', async (dir) => {
      const plugin = await loadToolPlugin(dir);
      const patch = [
        '*** Begin Patch',
        `*** Update File: ${getUserPolicyPath()}`,
        '@@ -1 +1 @@',
        '-{}',
        '+{"version":1}',
        '*** End Patch',
      ].join('\n');

      for (const field of ['command', 'patch', 'diff', 'input', 'patchText']) {
        await expect(
          plugin['tool.execute.before']({ tool: 'apply_patch' }, { args: { [field]: patch } }),
        ).rejects.toThrow(
          'This path contains the protected policy config and you must not modify or delete it.',
        );
      }
    });
  });

  test('keeps conservative protection on unknown named tools without destructive analysis', async () => {
    await withSafetyNetHomeDir('safety-net-opencode-unknown-tool-', async (dir) => {
      const plugin = await loadToolPlugin(dir);

      await expect(
        plugin['tool.execute.before'](
          { tool: 'custom_runner' },
          { args: { command: 'git reset --hard' } },
        ),
      ).resolves.toBeUndefined();
      await expect(
        plugin['tool.execute.before']({ tool: 'custom_runner' }, { args: { command: 'cat .env' } }),
      ).rejects.toThrow('Rule: secret.basename.env');
      await expect(
        plugin['tool.execute.before'](
          { tool: 'custom_runner' },
          { args: { command: `cat package.json > ${getUserPolicyPath()}` } },
        ),
      ).rejects.toThrow(
        'This path contains the protected policy config and you must not modify or delete it.',
      );
    });
  });

  test('blocks policy config mutations before loading config', async () => {
    await withSafetyNetHomeDir('safety-net-opencode-policy-protection-', async (dir) => {
      const plugin = await loadToolPlugin(dir);
      const policyPath = getUserPolicyPath();

      await expect(
        plugin['tool.execute.before'](
          { tool: 'Write' },
          { args: { file_path: policyPath, content: '{}' } },
        ),
      ).rejects.toThrow(
        'This path contains the protected policy config and you must not modify or delete it.',
      );
      await expect(
        plugin['tool.execute.before'](
          { tool: 'bash' },
          { args: { command: `cat package.json > ${policyPath}` } },
        ),
      ).rejects.toThrow(`Segment: ${policyPath}`);
    });
  });

  test('allows read-only access to policy config', async () => {
    await withSafetyNetHomeDir('safety-net-opencode-policy-read-', async (dir) => {
      const plugin = await loadToolPlugin(dir);
      const policyPath = getUserPolicyPath();

      await expect(
        plugin['tool.execute.before']({ tool: 'Read' }, { args: { file_path: policyPath } }),
      ).resolves.toBeUndefined();
      await expect(
        plugin['tool.execute.before']({ tool: 'bash' }, { args: { command: `cat ${policyPath}` } }),
      ).resolves.toBeUndefined();
    });
  });

  test('resolves policy and secret targets from a nested execution workdir', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-opencode-nested-targets-'));
    const nested = join(dir, 'nested');
    const safetyNetHome = join(dir, 'home', '.cc-safety-net');
    mkdirSync(nested);
    try {
      writeUserPolicy(safetyNetHome, {
        version: 1,
      });
      await withEnv({ HOME: join(dir, 'home') }, () =>
        withSafetyNetHome(safetyNetHome, async () => {
          const plugin = await loadToolPlugin(dir);

          await expect(
            plugin['tool.execute.before'](
              { tool: 'Write' },
              {
                args: {
                  file_path: '../home/.cc-safety-net/policy.json',
                  content: '{}',
                  workdir: 'nested',
                },
              },
            ),
          ).rejects.toThrow(
            'This path contains the protected policy config and you must not modify or delete it.',
          );
          await expect(
            plugin['tool.execute.before'](
              { tool: 'read' },
              { args: { path: '../home/.aws/config', workdir: 'nested' } },
            ),
          ).rejects.toThrow('Rule: secret.home.aws');
        }),
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('honors user secret protection policy without weakening destructive blocking', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-opencode-secret-policy-'));
    const safetyNetHome = join(dir, 'home', '.cc-safety-net');
    try {
      writeUserPolicy(safetyNetHome, {
        version: 1,
        secret_protection: { enabled: false },
      });
      await withSafetyNetHome(safetyNetHome, async () => {
        const plugin = await loadToolPlugin(dir);

        await expect(
          plugin['tool.execute.before']({ tool: 'read' }, { args: { path: '.env' } }),
        ).resolves.toBeUndefined();
        await expect(
          plugin['tool.execute.before'](
            { tool: 'bash' },
            { args: { command: catastrophicDeleteCommand(dir) } },
          ),
        ).rejects.toThrow(CATASTROPHIC_DELETE_REASON);
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('honors user secret protection overrides and deny paths', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-opencode-secret-rules-'));
    const safetyNetHome = join(dir, 'home', '.cc-safety-net');
    try {
      writeUserPolicy(safetyNetHome, {
        version: 1,
        secret_protection: {
          overrides: { 'secret.ext.pem': 'off' },
          deny_paths: ['private-note.txt'],
        },
      });
      await withSafetyNetHome(safetyNetHome, async () => {
        const plugin = await loadToolPlugin(dir);

        await expect(
          plugin['tool.execute.before']({ tool: 'read' }, { args: { path: 'server.pem' } }),
        ).resolves.toBeUndefined();
        await expect(
          plugin['tool.execute.before']({ tool: 'read' }, { args: { path: 'id_rsa.pem' } }),
        ).rejects.toThrow('Access to a sensitive path is not allowed.');
        await expect(
          plugin['tool.execute.before']({ tool: 'read' }, { args: { path: 'private-note.txt' } }),
        ).rejects.toThrow('Rule: secret.deny-path');
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('keeps secret protection for non-bash tools when policy config is invalid', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-opencode-invalid-policy-'));
    const safetyNetHome = join(dir, 'home', '.cc-safety-net');
    try {
      writeUserPolicy(safetyNetHome, {
        version: 1,
        secret_protection: { enabled: 'yes' },
      });
      await withSafetyNetHome(safetyNetHome, async () => {
        const plugin = await loadToolPlugin(dir);

        // The rejected `enabled` never becomes active, so the degraded policy
        // keeps discovering secrets while ordinary reads keep working.
        await expect(
          plugin['tool.execute.before']({ tool: 'read' }, { args: { path: 'README.md' } }),
        ).resolves.toBeUndefined();
        await expect(
          plugin['tool.execute.before']({ tool: 'read' }, { args: { path: '.env' } }),
        ).rejects.toThrow('Access to a sensitive path is not allowed.');
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('writes audit log for blocked commands with session id', async () => {
    await withAuditDirs(
      'safety-net-opencode-home-',
      'safety-net-opencode-project-',
      async (homeDir, projectDir) => {
        const plugin = await loadToolPlugin(projectDir, homeDir);

        await expect(
          plugin['tool.execute.before'](
            { tool: 'bash', sessionID: 'opencode-test-session' },
            { args: { command: 'git reset --hard' } },
          ),
        ).rejects.toThrow('git reset --hard');

        const entry = readLatestAuditLogEntry(homeDir, 'opencode-test-session');
        expect(entry.decision).toBe('deny');
        expect(entry.command).toBe('git reset --hard');
        expect(entry.segment).toBe('git reset --hard');
        expect(entry.reason).toContain('git reset --hard');
        expect(entry.cwd).toBe(projectDir);
      },
    );
  });

  test('writes audit log for secret protection blocks with session id', async () => {
    await withAuditDirs(
      'safety-net-opencode-secret-home-',
      'safety-net-opencode-secret-project-',
      async (homeDir, projectDir) => {
        const plugin = await loadToolPlugin(projectDir, homeDir);

        await expect(
          plugin['tool.execute.before'](
            { tool: 'read', sessionID: 'opencode-secret-session' },
            { args: { path: '.env' } },
          ),
        ).rejects.toThrow('Rule: secret.basename.env');

        const entry = readLatestAuditLogEntry(homeDir, 'opencode-secret-session');
        expect(entry.decision).toBe('deny');
        expect(entry.command).toBe('.env');
        expect(entry.segment).toBe('.env');
        expect(entry.reason).toBe('Access to a sensitive path is not allowed.');
        expect(entry.ruleId).toBe('secret.basename.env');
        expect(entry.cwd).toBe(projectDir);
      },
    );
  });

  test.each([
    ['invalid tool', { tool: '   ' }, { args: {} }],
    ['invalid workdir', { tool: 'bash' }, { args: { command: 'git status', workdir: 'missing' } }],
    [
      'unsafe tool input',
      { tool: 'bash' },
      { args: Object.create({ command: 'git reset --hard' }) },
    ],
  ] as const)('audits %s preflight denials exactly once', async (label, input, output) => {
    await withAuditDirs(
      `safety-net-opencode-${label}-home-`,
      `safety-net-opencode-${label}-project-`,
      async (homeDir, projectDir) => {
        const plugin = await loadToolPlugin(projectDir, homeDir);
        const sessionID = `opencode-${label.replaceAll(' ', '-')}`;

        await expect(
          plugin['tool.execute.before']({ ...input, sessionID }, output as never),
        ).rejects.toThrow('CC Safety Net failed closed');

        expect(readAuditLogEntriesForSession(homeDir, sessionID)).toHaveLength(1);
      },
    );
  });

  test('reloads local rules from the edited rulebook on the next tool call', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-opencode-plugin-'));
    try {
      await syncInitialGitRulebook(dir);
      const plugin = await loadToolPlugin(dir);
      await executeGitStatus(plugin);
      await expect(executeBash(plugin, 'git add -A')).rejects.toThrow(initialGitRule.reason);

      writeUpdatedGitRulebook(dir);

      // The local rulebook is a live file: the edit rules on the next call, and
      // the stale lock entry and cached copy from the sync above are ignored.
      await expect(executeGitStatus(plugin)).rejects.toThrow(updatedGitRule.reason);
      await executeBash(plugin, 'git add -A');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('loads root rule configuration for commands in a nested execution workdir', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-opencode-nested-config-'));
    const nested = join(dir, 'nested');
    mkdirSync(nested);
    try {
      await syncInitialGitRulebook(dir);
      const plugin = await loadToolPlugin(dir);

      await expect(executeBash(plugin, 'git add -A', 'nested')).rejects.toThrow(
        initialGitRule.reason,
      );

      writeUpdatedGitRulebook(dir);

      await expect(executeGitStatus(plugin, 'nested')).rejects.toThrow(updatedGitRule.reason);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('uses the execution workdir for linked-worktree analysis', async () => {
    const fixture = createLinkedWorktreeFixture();
    try {
      const plugin = await loadToolPlugin(fixture.mainWorktree);

      await withEnv({ CC_SAFETY_NET_WORKTREE: '1' }, async () => {
        await expect(
          plugin['tool.execute.before'](
            { tool: 'bash' },
            { args: { command: 'git reset --hard', workdir: fixture.linkedWorktree } },
          ),
        ).resolves.toBeUndefined();
      });
    } finally {
      fixture.cleanup();
    }
  });

  test('blocks configured transparent wrapper child command', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-opencode-plugin-'));
    try {
      await syncTransparentGitCommitRulebook(dir);
      const plugin = await loadToolPlugin(dir);

      await expect(
        plugin['tool.execute.before'](
          { tool: 'bash' },
          { args: { command: 'rtk git commit -m msg' } },
        ),
      ).rejects.toThrow(gitCommitRule.reason);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('preserves the exact rule-sync repair command under fail-closed config', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-opencode-rule-sync-'));
    try {
      writeDefaultRulesConfig(join(dir, '.cc-safety-net/rules/rule.json'), ['project-rules']);
      const plugin = await loadToolPlugin(dir);

      await expect(
        plugin['tool.execute.before'](
          { tool: 'bash' },
          { args: { command: 'npx -y cc-safety-net rule sync' } },
        ),
      ).resolves.toBeUndefined();
      await expect(
        plugin['tool.execute.before'](
          { tool: 'bash' },
          {
            args: {
              command: `npx -y cc-safety-net rule sync ${process.platform === 'win32' ? ';' : '&&'} ${catastrophicDeleteCommand(dir)}`,
            },
          },
        ),
      ).rejects.toThrow(CATASTROPHIC_DELETE_REASON);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

async function loadToolPlugin(
  directory: string,
  homeDir?: string,
  shell?: unknown,
  guardDependencies?: Partial<GuardDependencies>,
): Promise<ToolPlugin> {
  const pluginFactory = guardDependencies
    ? createCCSafetyNetPlugin(guardDependencies)
    : CCSafetyNetPlugin;
  const plugin = (await pluginFactory({
    directory,
    homeDir,
  } as unknown as Parameters<typeof CCSafetyNetPlugin>[0])) as unknown as ToolPlugin;
  await plugin.config(shell === undefined ? {} : { shell });
  return plugin;
}

async function expectBashBlock(plugin: ToolPlugin, command: string, ruleId: string): Promise<void> {
  await expect(
    plugin['tool.execute.before']({ tool: 'bash' }, { args: { command } }),
  ).rejects.toThrow(`Rule: ${ruleId}`);
}

async function capturePluginErrorMessage(run: () => Promise<void>): Promise<string> {
  try {
    await run();
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
  throw new Error('Expected OpenCode plugin call to throw');
}

function writeUserPolicy(safetyNetHome: string, policy: unknown): void {
  mkdirSync(safetyNetHome, { recursive: true });
  writeFileSync(join(safetyNetHome, 'policy.json'), JSON.stringify(policy), 'utf-8');
}

async function withSafetyNetHome<T>(safetyNetHome: string, fn: () => Promise<T>): Promise<T> {
  const original = process.env.CC_SAFETY_NET_HOME;
  process.env.CC_SAFETY_NET_HOME = safetyNetHome;
  try {
    return await fn();
  } finally {
    if (original === undefined) {
      delete process.env.CC_SAFETY_NET_HOME;
    } else {
      process.env.CC_SAFETY_NET_HOME = original;
    }
  }
}

async function withSafetyNetHomeDir<T>(
  prefix: string,
  fn: (dir: string, safetyNetHome: string) => Promise<T>,
): Promise<T> {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  const safetyNetHome = join(dir, 'home', '.cc-safety-net');
  try {
    return await withSafetyNetHome(safetyNetHome, () => fn(dir, safetyNetHome));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

async function withAuditDirs<T>(
  homePrefix: string,
  projectPrefix: string,
  fn: (homeDir: string, projectDir: string) => Promise<T>,
): Promise<T> {
  const homeDir = mkdtempSync(join(tmpdir(), homePrefix));
  const projectDir = mkdtempSync(join(tmpdir(), projectPrefix));
  try {
    return await fn(homeDir, projectDir);
  } finally {
    rmSync(homeDir, { recursive: true, force: true });
    rmSync(projectDir, { recursive: true, force: true });
  }
}
