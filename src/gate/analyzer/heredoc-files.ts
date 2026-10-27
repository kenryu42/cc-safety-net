import { readFileSync, statSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import type { Budget } from '@/core/budget';
import { resolveExistingPath } from '@/core/paths/canonicalization';
import type { PathResolver } from '@/gate/analysis';

export function resolveTrackedHeredocPath(
  source: string,
  effectiveCwd: string | null | undefined,
  paths: PathResolver,
  budget: Budget,
): string | undefined {
  const path = isAbsolute(source)
    ? resolve(source)
    : effectiveCwd
      ? resolve(effectiveCwd, source)
      : undefined;
  if (!path) return undefined;
  try {
    return resolveExistingPath(path, paths, budget);
  } catch {
    return path;
  }
}

export function isPersistentHeredocFilePath(path: string): boolean {
  return !['/dev', '/proc', '/sys'].some((root) => path === root || path.startsWith(`${root}/`));
}

const SCRIPT_FILE_MAX_BYTES = 256 * 1024;

export function readShellScriptFile(path: string): string | null {
  if (!isPersistentHeredocFilePath(path)) return null;
  try {
    const stats = statSync(path, { throwIfNoEntry: false });
    if (!stats?.isFile() || stats.size > SCRIPT_FILE_MAX_BYTES) return null;
    const content = readFileSync(path);
    return content.length > SCRIPT_FILE_MAX_BYTES || content.includes(0)
      ? null
      : content.toString('utf8');
  } catch {
    return null;
  }
}
