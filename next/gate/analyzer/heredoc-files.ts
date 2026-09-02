import { isAbsolute, resolve } from 'node:path';
import { createBudget } from '@next/core/budget';
import { resolveExistingPath } from '@next/core/paths/canonicalization';
import type { PathResolver } from '@next/gate/analysis';

export const MAX_TRACKED_HEREDOC_FILES = 64;

export function resolveTrackedHeredocPath(
  source: string,
  effectiveCwd: string | null | undefined,
  paths: PathResolver,
): string | undefined {
  const path = isAbsolute(source)
    ? resolve(source)
    : effectiveCwd
      ? resolve(effectiveCwd, source)
      : undefined;
  if (!path) return undefined;
  try {
    return resolveExistingPath(path, paths, createBudget());
  } catch {
    return path;
  }
}

export function isPersistentHeredocFilePath(path: string): boolean {
  return !['/dev', '/proc', '/sys'].some((root) => path === root || path.startsWith(`${root}/`));
}
