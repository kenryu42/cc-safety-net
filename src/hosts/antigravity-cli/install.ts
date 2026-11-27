import { existsSync, readFileSync } from 'node:fs';
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

const ANTIGRAVITY_HOOK_COMMAND = managedHookCommands['antigravity-cli'];
const PLUGIN_BRANCH_URL = 'https://github.com/kenryu42/cc-safety-net/tree/plugin';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function planAntigravityCliInstall(environment: Environment) {
  return {
    commands: [
      ['agy', 'plugin', 'install', PLUGIN_BRANCH_URL],
      ...(isAntigravityPluginDisabled(environment.home)
        ? [['agy', 'plugin', 'enable', ANTIGRAVITY_PLUGIN_NAME] as const]
        : []),
    ] satisfies NativeCommand[],
    update: existsSync(getAntigravityPluginDir(environment.home)),
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
