import { isAbsolute, join, normalize, parse as parsePath, sep } from 'node:path';
import type { Environment, PathResolver } from '../environment';

const TEMP_ROOTS = ['/tmp', '/var/tmp', '/private/tmp', '/private/var/tmp'];
const DEFAULT_IFS = ' \t\n';

export function isTmpdirOverriddenToNonTemp(
  envAssignments: ReadonlyMap<string, string>,
  environment: Environment,
): boolean {
  if (hasUnsafeTmpdirWordSplitting(envAssignments, environment)) return true;

  if (!envAssignments.has('TMPDIR')) return false;
  return !isAssignedTmpdirValueTrusted(envAssignments.get('TMPDIR') ?? '', environment);
}

export function isTmpdirValueTrusted(
  envAssignments: ReadonlyMap<string, string>,
  environment: Environment,
): boolean {
  if (envAssignments.has('TMPDIR')) {
    return isAssignedTmpdirValueTrusted(envAssignments.get('TMPDIR') ?? '', environment);
  }
  const tmpdirValue = getEffectiveTmpdirValue(envAssignments, environment);
  if (tmpdirValue === undefined) return true;
  return isAssignedTmpdirValueTrusted(tmpdirValue, environment);
}

export function getEffectiveTmpdirValue(
  envAssignments: ReadonlyMap<string, string>,
  environment: Environment,
): string | undefined {
  return getEffectiveShellEnvValue(envAssignments, environment, 'TMPDIR');
}

function isAssignedTmpdirValueTrusted(tmpdirValue: string, environment: Environment): boolean {
  if (!tmpdirValue) return false;
  if (hasUnsafeTmpdirShellExpansion(tmpdirValue)) return false;
  return isTrustedTempPath(tmpdirValue, environment);
}

export function hasUnsafeTmpdirWordSplitting(
  envAssignments: ReadonlyMap<string, string>,
  environment: Environment,
): boolean {
  const ifs = getEffectiveShellEnvValue(envAssignments, environment, 'IFS');
  return ifs !== undefined && ifs !== '' && ifs !== DEFAULT_IFS;
}

export function isTrustedTempPath(path: string, environment: Environment): boolean {
  const normalizedPath = tryResolveExistingPathComponents(path, environment.paths);
  if (normalizedPath === null) return false;
  return trustedTempRoots(environment).some((root) => isPathOrSubpath(normalizedPath, root));
}

export function isTrustedTempRootPath(path: string, environment: Environment): boolean {
  const normalizedPath = tryResolveExistingPathComponents(path, environment.paths);
  if (normalizedPath === null) return false;
  return trustedTempRoots(environment).some(
    (root) => normalizePathForComparison(root) === normalizePathForComparison(normalizedPath),
  );
}

const trustedTempRootsByEnvironment = new WeakMap<Environment, string[]>();

function trustedTempRoots(environment: Environment): string[] {
  const cached = trustedTempRootsByEnvironment.get(environment);
  if (cached) return cached;
  const resolved = resolveTrustedTempRoots(environment);
  trustedTempRootsByEnvironment.set(environment, resolved);
  return resolved;
}

function resolveTrustedTempRoots(environment: Environment): string[] {
  const roots = TEMP_ROOTS.map(
    (root) => tryResolveExistingPathComponents(root, environment.paths) ?? normalize(root),
  );
  const systemTmpdir = tryResolveExistingPathComponents(environment.tmpdir, environment.paths);
  if (!systemTmpdir) return roots;
  if (process.platform === 'win32') return [...roots, systemTmpdir];
  if (process.platform === 'darwin' && isMacOSPerUserTempRoot(systemTmpdir)) {
    return [...roots, systemTmpdir];
  }
  return roots;
}

function hasUnsafeTmpdirShellExpansion(path: string): boolean {
  return (
    /[\s$`*?[]/.test(path) || /\{[^{}]*(?:,|\.\.)[^{}]*\}/.test(path) || /[+@!]\([^)]*\)/.test(path)
  );
}

function getEffectiveShellEnvValue(
  envAssignments: ReadonlyMap<string, string>,
  environment: Environment,
  name: string,
): string | undefined {
  return envAssignments.has(name) ? envAssignments.get(name) : environment.env.get(name);
}

function isMacOSPerUserTempRoot(path: string): boolean {
  return /^\/(?:private\/)?var\/folders\/[^/]{2}\/[^/]+\/T$/.test(path);
}

function tryResolveExistingPathComponents(path: string, paths: PathResolver): string | null {
  try {
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
      if (paths.entryKind(candidate) === 'missing') {
        return join(candidate, ...components.slice(i + 1));
      }

      const resolved = paths.realpath(candidate);
      if (resolved === null) return null;
      current = resolved;
    }

    return current;
  } catch {
    return null;
  }
}

function isPathOrSubpath(path: string, basePath: string): boolean {
  const normalizedPath = normalizePathForComparison(path);
  const normalizedBasePath = normalizePathForComparison(basePath);
  if (normalizedPath === normalizedBasePath) {
    return true;
  }

  const baseWithSlash = normalizedBasePath.endsWith(sep)
    ? normalizedBasePath
    : `${normalizedBasePath}${sep}`;
  return normalizedPath.startsWith(baseWithSlash);
}

function normalizePathForComparison(path: string): string {
  return process.platform === 'win32' ? path.toLowerCase() : path;
}
