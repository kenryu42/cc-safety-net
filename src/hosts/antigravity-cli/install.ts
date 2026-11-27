import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Environment } from '@/core/environment';
import { atomicWriteFile } from '@/core/io/atomic-write';
import {
  ANTIGRAVITY_PLUGIN_NAME,
  getAntigravityPluginDir,
  isAntigravityPluginDisabled,
} from '@/hosts/antigravity-cli/detect';
import { getAntigravityHooksPath } from '@/hosts/antigravity-cli/hook';
import type { NativeCommand } from '@/hosts/install/native';
import { managedHookCommands } from '@/hosts/managed-command';
import { getPackageVersion } from '@/hosts/system-info';
import { CC_SAFETY_NET_SKILL } from '@/hosts/templates/cc-safety-net';

const ANTIGRAVITY_HOOK_COMMAND = managedHookCommands['antigravity-cli'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

export function planAntigravityCliInstall(environment: Environment) {
  const dir = mkdtempSync(join(environment.tmpdir, 'cc-safety-net-agy-'));
  mkdirSync(join(dir, 'skills', ANTIGRAVITY_PLUGIN_NAME), { recursive: true });
  writeJson(join(dir, 'plugin.json'), {
    name: ANTIGRAVITY_PLUGIN_NAME,
    version: getPackageVersion(),
    description: 'Blocks destructive commands and secret access before Antigravity CLI runs them.',
  });
  writeJson(join(dir, 'hooks.json'), {
    [ANTIGRAVITY_PLUGIN_NAME]: {
      PreToolUse: [
        {
          matcher: '*',
          hooks: [{ type: 'command', command: ANTIGRAVITY_HOOK_COMMAND, timeout: 30 }],
        },
      ],
    },
  });
  writeFileSync(join(dir, 'skills', ANTIGRAVITY_PLUGIN_NAME, 'SKILL.md'), CC_SAFETY_NET_SKILL);

  return {
    commands: [
      ['agy', 'plugin', 'install', dir],
      ...(isAntigravityPluginDisabled(environment.home)
        ? [['agy', 'plugin', 'enable', ANTIGRAVITY_PLUGIN_NAME] as const]
        : []),
    ] satisfies NativeCommand[],
    update: existsSync(getAntigravityPluginDir(environment.home)),
    cleanup: () => rmSync(dir, { recursive: true, force: true }),
  };
}

export function planAntigravityCliUninstall(environment: Environment) {
  return {
    commands: existsSync(getAntigravityPluginDir(environment.home))
      ? ([['agy', 'plugin', 'uninstall', ANTIGRAVITY_PLUGIN_NAME]] as const)
      : [],
    afterUninstall: () => {
      removeLegacyAntigravityHook(environment);
    },
  };
}

function removeManagedHook(config: Record<string, unknown>): boolean {
  let removed = false;
  for (const definition of Object.values(config)) {
    if (!isRecord(definition) || !Array.isArray(definition.PreToolUse)) continue;
    definition.PreToolUse = definition.PreToolUse.flatMap((entry) => {
      if (!isRecord(entry) || !Array.isArray(entry.hooks)) return [entry];

      const hooks = entry.hooks.filter(
        (hook) => !isRecord(hook) || hook.command !== ANTIGRAVITY_HOOK_COMMAND,
      );
      if (hooks.length !== entry.hooks.length) removed = true;
      return hooks.length === 0 ? [] : [{ ...entry, hooks }];
    });
  }
  return removed;
}

export function removeLegacyAntigravityHook(environment: Environment): string | undefined {
  const configPath = getAntigravityHooksPath(environment.home);
  if (!existsSync(configPath)) return;

  const config = parseAntigravityHooksConfig(configPath);
  if (!removeManagedHook(config)) return;

  atomicWriteFile(configPath, `${JSON.stringify(config, null, 2)}\n`);
  return `Removed the legacy Antigravity CLI hook from ${configPath}`;
}

function parseAntigravityHooksConfig(configPath: string): Record<string, unknown> {
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    if (!isRecord(config)) throw new Error('Antigravity hooks config must be a JSON object');
    return config;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse Antigravity hooks config ${configPath}: ${error.message}`);
    }
    throw error;
  }
}
