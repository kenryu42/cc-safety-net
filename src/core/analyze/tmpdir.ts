import { existsSync, lstatSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join, normalize, parse as parsePath, sep } from 'node:path';

export function isTmpdirOverriddenToNonTemp(envAssignments: Map<string, string>): boolean {
  if (!envAssignments.has('TMPDIR')) {
    return false;
  }
  const tmpdirValue = envAssignments.get('TMPDIR') ?? '';

  // Empty TMPDIR is dangerous: $TMPDIR/foo expands to /foo
  if (tmpdirValue === '') {
    return true;
  }

  const normalizedTmpdirValue = tryResolveExistingPathComponents(tmpdirValue);
  if (normalizedTmpdirValue === null) {
    return true;
  }

  // Check if it's a known temp path (exact match or subpath)
  const sysTmpdir = tryResolveExistingPathComponents(tmpdir()) ?? normalize(tmpdir());
  if (
    isPathOrSubpath(normalizedTmpdirValue, resolveExistingPathComponents('/tmp')) ||
    isPathOrSubpath(normalizedTmpdirValue, resolveExistingPathComponents('/var/tmp')) ||
    isPathOrSubpath(normalizedTmpdirValue, sysTmpdir)
  ) {
    return false;
  }
  return true;
}

function tryResolveExistingPathComponents(path: string): string | null {
  try {
    return resolveExistingPathComponents(path);
  } catch {
    return null;
  }
}

function resolveExistingPathComponents(path: string): string {
  const normalized = normalize(path);
  if (!isAbsolute(normalized)) {
    return normalized;
  }

  const root = parsePath(normalized).root;
  const components = normalized
    .slice(root.length)
    .split(/[\\/]+/)
    .filter(Boolean);
  let current = root;

  for (let i = 0; i < components.length; i++) {
    const candidate = join(current, components[i] ?? '');
    if (!existsSync(candidate)) {
      return join(candidate, ...components.slice(i + 1));
    }
    // This is a best-effort safety check before command execution; symlink targets can race.
    current = lstatSync(candidate).isSymbolicLink() ? realpathSync(candidate) : candidate;
  }

  return current;
}

/**
 * Check if a path equals or is a subpath of basePath.
 * E.g., isPathOrSubpath("/tmp/foo", "/tmp") → true
 *       isPathOrSubpath("/tmp-malicious", "/tmp") → false
 */
function isPathOrSubpath(path: string, basePath: string): boolean {
  if (path === basePath) {
    return true;
  }
  // Ensure basePath ends with the platform separator for proper prefix matching.
  const baseWithSlash = basePath.endsWith(sep) ? basePath : `${basePath}${sep}`;
  return path.startsWith(baseWithSlash);
}
