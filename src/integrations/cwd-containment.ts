import { realpathSync, statSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { isUnsupportedWindowsNamespacePath } from '@/analyzer/path';

export function resolveContainedCwd(
  requestedCwd: string,
  trustedRoots: readonly string[],
): string | undefined {
  if (isUnsupportedWindowsNamespacePath(requestedCwd)) return undefined;

  const roots = trustedRoots.flatMap((root) => canonicalDirectory(root));
  if (!roots[0]) return undefined;

  const requested = canonicalDirectory(
    isAbsolute(requestedCwd) ? requestedCwd : resolve(roots[0], requestedCwd),
  )[0];
  if (!requested) return undefined;

  return roots.some((root) => isSameOrInsidePath(requested, root)) ? requested : undefined;
}

// Canonicalizes without requiring containment: for agents (Amp) whose commands
// legitimately execute outside the workspace root. Symlinks still resolve to
// their real path so path guards compare against the true location.
export function resolveCanonicalCwd(requestedCwd: string, baseCwd: string): string | undefined {
  if (isUnsupportedWindowsNamespacePath(requestedCwd)) return undefined;
  return canonicalDirectory(
    isAbsolute(requestedCwd) ? requestedCwd : resolve(baseCwd, requestedCwd),
  )[0];
}

export function firstTrustedRoot(trustedRoots: readonly string[]): string | undefined {
  return trustedRoots.flatMap((root) => canonicalDirectory(root))[0];
}

function canonicalDirectory(path: string): string[] {
  try {
    const realPath = realpathSync(path);
    return statSync(realPath).isDirectory() ? [realPath] : [];
  } catch {
    return [];
  }
}

export function isSameOrInsidePath(path: string, root: string): boolean {
  const rel = relative(root, path);
  return rel === '' || (rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel));
}
