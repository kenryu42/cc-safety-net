import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Environment } from '@/core/environment';
import { atomicWriteFile } from '@/core/io/atomic-write';
import {
  canonicalPreToolUseEntry,
  isInstalledOnceCanonically,
  withoutManagedHandlers,
} from '@/hosts/install/pre-tool-use-entries';
import type { InstallResult } from '@/hosts/install/types';
import { managedHookCommands } from '@/hosts/managed-command';

export const DROID_HOOK_COMMAND = managedHookCommands.droid;
export const DROID_HOOK_TIMEOUT = 30;

export function getDroidHooksPath(environment: Environment): string {
  return join(environment.home, '.factory', 'hooks.json');
}

function getDroidSettingsPath(environment: Environment): string {
  return join(environment.home, '.factory', 'settings.json');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readDroidJson(configPath: string): unknown {
  try {
    return JSON.parse(readFileSync(configPath, 'utf-8'));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse Factory Droid hooks config ${configPath}: ${error.message}`);
    }
    throw error;
  }
}

function parseDroidHooksConfig(configPath: string) {
  const parsed = readDroidJson(configPath);
  if (!isRecord(parsed))
    throw new Error(`Factory Droid hooks config ${configPath} must be a JSON object`);
  if (parsed.PreToolUse === undefined || Array.isArray(parsed.PreToolUse)) return parsed;
  throw new Error(`Factory Droid hooks config ${configPath} "PreToolUse" must be an array`);
}

function settingsFallbackHooks(settingsPath: string): Record<string, unknown> {
  if (!existsSync(settingsPath)) return {};
  const settings = readDroidJson(settingsPath);
  return isRecord(settings) && isRecord(settings.hooks) ? settings.hooks : {};
}

function getPreToolUse(config: Record<string, unknown>): unknown[] {
  return Array.isArray(config.PreToolUse) ? config.PreToolUse : [];
}

function writeDroidHooksConfig(
  configPath: string,
  config: Record<string, unknown>,
  preToolUse: unknown[],
): void {
  atomicWriteFile(
    configPath,
    `${JSON.stringify({ ...config, PreToolUse: preToolUse }, null, 2)}\n`,
  );
}

export function installDroid(environment: Environment): InstallResult {
  const configPath = getDroidHooksPath(environment);
  const hooksFileExists = existsSync(configPath);
  const config = hooksFileExists
    ? parseDroidHooksConfig(configPath)
    : settingsFallbackHooks(getDroidSettingsPath(environment));
  const existing = getPreToolUse(config);
  if (
    hooksFileExists &&
    isInstalledOnceCanonically(existing, DROID_HOOK_COMMAND, DROID_HOOK_TIMEOUT)
  ) {
    return { path: configPath, alreadyInstalled: true };
  }

  mkdirSync(dirname(configPath), { recursive: true });
  writeDroidHooksConfig(configPath, config, [
    ...withoutManagedHandlers(existing, DROID_HOOK_COMMAND),
    canonicalPreToolUseEntry(DROID_HOOK_COMMAND, DROID_HOOK_TIMEOUT),
  ]);
  return { path: configPath, alreadyInstalled: false };
}

export function uninstallDroid(environment: Environment): InstallResult {
  const configPath = getDroidHooksPath(environment);
  if (!existsSync(configPath)) return { path: configPath, alreadyInstalled: false };

  const config = parseDroidHooksConfig(configPath);
  const existing = getPreToolUse(config);
  const stripped = withoutManagedHandlers(existing, DROID_HOOK_COMMAND);
  if (JSON.stringify(stripped) === JSON.stringify(existing)) {
    return { path: configPath, alreadyInstalled: false };
  }

  const settingsFallbackWouldLoad = existsSync(getDroidSettingsPath(environment));
  if (stripped.length === 0 && Object.keys(config).length === 1 && !settingsFallbackWouldLoad) {
    rmSync(configPath);
    return { path: configPath, alreadyInstalled: true };
  }

  writeDroidHooksConfig(configPath, config, stripped);
  return { path: configPath, alreadyInstalled: true };
}
