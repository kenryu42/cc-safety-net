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

export const GROK_BUILD_HOOK_COMMAND = managedHookCommands['grok-build'];
export const GROK_BUILD_HOOK_TIMEOUT = 30;
const GROK_BUILD_CANONICAL_ENTRY = canonicalPreToolUseEntry(
  GROK_BUILD_HOOK_COMMAND,
  GROK_BUILD_HOOK_TIMEOUT,
);

export function getGrokBuildHooksPath(environment: Environment): string {
  return join(
    environment.env.get('GROK_HOME') ?? join(environment.home, '.grok'),
    'hooks',
    'cc-safety-net.json',
  );
}

type GrokBuildConfig = { hooks?: unknown; [key: string]: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseGrokBuildConfig(raw: string): GrokBuildConfig | null {
  try {
    const parsed = JSON.parse(raw);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getPreToolUse(config: GrokBuildConfig): unknown[] {
  const preToolUse = isRecord(config.hooks) ? config.hooks.PreToolUse : undefined;
  return Array.isArray(preToolUse) ? preToolUse : [];
}

function writeGrokBuildConfig(
  configPath: string,
  config: GrokBuildConfig,
  preToolUse: unknown[],
): void {
  const hooks = isRecord(config.hooks) ? config.hooks : {};
  atomicWriteFile(
    configPath,
    `${JSON.stringify({ ...config, hooks: { ...hooks, PreToolUse: preToolUse } }, null, 2)}\n`,
  );
}

export function installGrokBuild(environment: Environment): InstallResult {
  const configPath = getGrokBuildHooksPath(environment);
  if (!existsSync(configPath)) {
    mkdirSync(dirname(configPath), { recursive: true });
    writeGrokBuildConfig(configPath, {}, [GROK_BUILD_CANONICAL_ENTRY]);
    return { path: configPath, alreadyInstalled: false };
  }

  const config = parseGrokBuildConfig(readFileSync(configPath, 'utf-8'));

  if (!config) {
    writeGrokBuildConfig(configPath, {}, [GROK_BUILD_CANONICAL_ENTRY]);
    return { path: configPath, alreadyInstalled: false };
  }

  const existing = getPreToolUse(config);
  if (isInstalledOnceCanonically(existing, GROK_BUILD_HOOK_COMMAND, GROK_BUILD_HOOK_TIMEOUT)) {
    return { path: configPath, alreadyInstalled: true };
  }

  writeGrokBuildConfig(configPath, config, [
    ...withoutManagedHandlers(existing, GROK_BUILD_HOOK_COMMAND),
    GROK_BUILD_CANONICAL_ENTRY,
  ]);
  return { path: configPath, alreadyInstalled: false };
}

export function uninstallGrokBuild(environment: Environment): InstallResult {
  const configPath = getGrokBuildHooksPath(environment);
  if (!existsSync(configPath)) return { path: configPath, alreadyInstalled: false };

  const config = parseGrokBuildConfig(readFileSync(configPath, 'utf-8'));

  if (!config) return { path: configPath, alreadyInstalled: false };

  const existing = getPreToolUse(config);
  const stripped = withoutManagedHandlers(existing, GROK_BUILD_HOOK_COMMAND);
  if (JSON.stringify(stripped) === JSON.stringify(existing)) {
    return { path: configPath, alreadyInstalled: false };
  }

  const hooks = isRecord(config.hooks) ? config.hooks : {};
  const onlyOurs =
    stripped.length === 0 && Object.keys(config).length === 1 && Object.keys(hooks).length === 1;
  if (onlyOurs) {
    rmSync(configPath);
    return { path: configPath, alreadyInstalled: true };
  }

  writeGrokBuildConfig(configPath, config, stripped);
  return { path: configPath, alreadyInstalled: true };
}
