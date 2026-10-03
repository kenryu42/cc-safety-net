import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Environment } from '@/core/environment';
import { atomicWriteFile } from '@/core/io/atomic-write';
import { stripJsonComments } from '@/core/io/jsonc';
import {
  canonicalPreToolUseEntry,
  isInstalledOnceCanonically,
  withoutManagedHandlers,
} from '@/hosts/install/pre-tool-use-entries';
import type { InstallResult } from '@/hosts/install/types';
import { managedHookCommands } from '@/hosts/managed-command';

export const DEVIN_HOOK_COMMAND = managedHookCommands.devin;
export const DEVIN_HOOK_TIMEOUT = 30;

type DevinConfig = {
  config: Record<string, unknown>;
  hooks: Record<string, unknown>;
  preToolUse: unknown[];
};

const MISSING_CONFIG: DevinConfig = { config: {}, hooks: {}, preToolUse: [] };

export function getDevinConfigPath(environment: Environment, platform = process.platform): string {
  const configHome =
    platform === 'win32'
      ? environment.env.get('APPDATA') || join(environment.home, 'AppData', 'Roaming')
      : environment.env.get('XDG_CONFIG_HOME') || join(environment.home, '.config');
  return join(configHome, 'devin', 'config.json');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readJson(path: string): { ok: true; value: unknown } | { ok: false; message: string } {
  try {
    return { ok: true, value: JSON.parse(stripJsonComments(readFileSync(path, 'utf-8'))) };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : String(error) };
  }
}

export function readDevinConfig(configPath: string): DevinConfig | string {
  const parsed = readJson(configPath);
  if (!parsed.ok) return `Failed to parse Devin CLI config ${configPath}: ${parsed.message}`;
  const config = parsed.value;
  if (!isRecord(config)) return `Devin CLI config ${configPath} must be a JSON object`;
  const hooks = config.hooks === undefined ? {} : config.hooks;
  if (!isRecord(hooks)) return `Devin CLI config ${configPath} "hooks" must be an object`;
  const preToolUse = hooks.PreToolUse === undefined ? [] : hooks.PreToolUse;
  if (!Array.isArray(preToolUse)) {
    return `Devin CLI config ${configPath} "hooks.PreToolUse" must be an array`;
  }
  return { config, hooks, preToolUse };
}

function readDevinConfigOrThrow(configPath: string): DevinConfig {
  const devin = readDevinConfig(configPath);
  if (typeof devin === 'string') throw new Error(devin);
  return devin;
}

function writeDevinConfig(configPath: string, devin: DevinConfig, preToolUse: unknown[]): void {
  const config = { ...devin.config, hooks: { ...devin.hooks, PreToolUse: preToolUse } };
  atomicWriteFile(configPath, `${JSON.stringify(config, null, 2)}\n`);
}

export function installDevin(environment: Environment): InstallResult {
  const configPath = getDevinConfigPath(environment);
  const devin = existsSync(configPath) ? readDevinConfigOrThrow(configPath) : MISSING_CONFIG;
  if (isInstalledOnceCanonically(devin.preToolUse, DEVIN_HOOK_COMMAND, DEVIN_HOOK_TIMEOUT)) {
    return { path: configPath, alreadyInstalled: true };
  }

  mkdirSync(dirname(configPath), { recursive: true });
  writeDevinConfig(configPath, devin, [
    ...withoutManagedHandlers(devin.preToolUse, DEVIN_HOOK_COMMAND),
    canonicalPreToolUseEntry(DEVIN_HOOK_COMMAND, DEVIN_HOOK_TIMEOUT),
  ]);
  return { path: configPath, alreadyInstalled: false };
}

export function uninstallDevin(environment: Environment): InstallResult {
  const configPath = getDevinConfigPath(environment);
  if (!existsSync(configPath)) return { path: configPath, alreadyInstalled: false };

  const devin = readDevinConfigOrThrow(configPath);
  const stripped = withoutManagedHandlers(devin.preToolUse, DEVIN_HOOK_COMMAND);
  if (JSON.stringify(stripped) === JSON.stringify(devin.preToolUse)) {
    return { path: configPath, alreadyInstalled: false };
  }

  writeDevinConfig(configPath, devin, stripped);
  return { path: configPath, alreadyInstalled: true };
}
