import { mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import type { Environment } from '@/core/environment';
import { atomicWriteFile } from '@/core/io/atomic-write';
import { lstatOrUndefined } from '@/hosts/detect/context';
import {
  buildHermesAgentPluginFiles,
  HERMES_AGENT_MANAGED_HEADER,
  HERMES_AGENT_PLUGIN_NAME,
} from '@/hosts/hermes-agent/artifact';
import type { InstallResult } from '@/hosts/install/types';
import { getPackageVersion } from '@/hosts/system-info';

const BYTECODE_CACHE_DIR = '__pycache__';

export function getHermesHomeDir(environment: Environment): string {
  const hermesHome = environment.env.get('HERMES_HOME')?.trim();
  return hermesHome ? hermesHome : join(environment.home, '.hermes');
}

export function getHermesAgentPluginDir(environment: Environment): string {
  return join(getHermesHomeDir(environment), 'plugins', HERMES_AGENT_PLUGIN_NAME);
}

export function isManagedHermesAgentFile(content: string): boolean {
  return content.startsWith(HERMES_AGENT_MANAGED_HEADER);
}

function resolvePluginDir(environment: Environment, action: 'install' | 'remove'): string {
  const dir = getHermesAgentPluginDir(environment);
  const info = lstatOrUndefined(dir);
  if (info && (info.isSymbolicLink() || !info.isDirectory()))
    throw new Error(
      `Refusing to ${action} ${dir}: not a regular directory. Move or remove it and rerun ${action === 'install' ? 'install' : 'uninstall'} --hermes-agent.`,
    );
  return dir;
}

function readManagedFile(path: string, action: 'overwrite' | 'remove'): string | undefined {
  const info = lstatOrUndefined(path);
  if (!info) return undefined;
  if (info.isSymbolicLink() || !info.isFile())
    throw new Error(`Refusing to ${action} ${path}: not a regular file. Move or remove it.`);

  const content = readFileSync(path, 'utf-8');
  if (!isManagedHermesAgentFile(content))
    throw new Error(`Refusing to ${action} unmanaged file at ${path}. Move or remove it.`);
  return content;
}

export function installHermesAgent(environment: Environment): InstallResult {
  const dir = resolvePluginDir(environment, 'install');
  const files = buildHermesAgentPluginFiles(getPackageVersion());

  const current = files.map((file) => readManagedFile(join(dir, file.name), 'overwrite'));
  if (current.every((content, index) => content === files[index]?.content))
    return { path: dir, alreadyInstalled: true };

  mkdirSync(dir, { recursive: true });
  files.forEach((file) => {
    atomicWriteFile(join(dir, file.name), file.content);
  });
  return { path: dir, alreadyInstalled: false };
}

export function readOwnedHermesAgentFiles(environment: Environment): readonly { name: string }[] {
  const dir = resolvePluginDir(environment, 'remove');
  if (!lstatOrUndefined(dir)) return [];

  return buildHermesAgentPluginFiles(getPackageVersion()).filter(
    (file) => readManagedFile(join(dir, file.name), 'remove') !== undefined,
  );
}

export function uninstallHermesAgent(environment: Environment): InstallResult {
  const dir = resolvePluginDir(environment, 'remove');
  if (!lstatOrUndefined(dir)) return { path: dir, alreadyInstalled: false };

  const present = readOwnedHermesAgentFiles(environment);
  present.forEach((file) => {
    rmSync(join(dir, file.name));
  });
  rmSync(join(dir, BYTECODE_CACHE_DIR), { recursive: true, force: true });

  if (readdirSync(dir).length === 0) rmSync(dir, { recursive: true });

  return { path: dir, alreadyInstalled: present.length > 0 };
}
