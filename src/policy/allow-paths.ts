import { isAbsolute, join, normalize, sep } from 'node:path';

const IS_WINDOWS = process.platform === 'win32';

const GLOB_CHARS = /[*?]/;

export function hasGlobChars(value: string): boolean {
  return GLOB_CHARS.test(value);
}

// Translates the supported glob subset — `**` across segments, `*` within a
// segment, `?` one non-separator character — into an anchored RegExp over a
// normalized forward-slash path. Every other character is literal; there are
// no brace, extglob, or character-class forms.
export function compilePathGlob(pattern: string): RegExp {
  const segments = pattern.split('/');
  const source = segments
    .map((segment, index) => {
      if (segment === '**') return index === segments.length - 1 ? '.*' : '(?:[^/]+/)*';
      const literal = segment
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '[^/]*')
        .replace(/\?/g, '[^/]');
      return index === segments.length - 1 ? literal : `${literal}/`;
    })
    .join('');
  return new RegExp(`^${source}$`);
}

export function expandAllowPathHome(path: string, home: string): string {
  if (path === '~') return home;
  if (path.startsWith('~/')) return `${home}${path.slice(1)}`;
  return path;
}

export function getDestructiveAllowPathError(value: unknown, home: string): string | null {
  if (typeof value !== 'string' || value.trim() === '') {
    return 'must be a non-empty path string';
  }
  const expanded = expandAllowPathHome(value.trim(), home);
  if (!isAbsolute(expanded)) {
    return 'must be an absolute path or start with ~/';
  }
  return getAllowPathHomeConflictError(expanded, home);
}

// Deny entries may be relative (they resolve against each session's config cwd,
// which is unknowable at save time), so only absolute and home-anchored entries
// are judged here. The rejected class — home, anything above it, `/` — has no
// legitimate reading and blocks essentially every command in every workspace
// under home.
export function getSecretDenyPathError(value: unknown, home: string): string | null {
  const expanded = expandSecretPolicyEntry(value, home);
  if (expanded === null) return 'must be a non-empty path string';
  if (!isAbsolute(expanded)) return null;
  if (getAllowPathHomeConflictError(expanded, home) === null) return null;
  return 'cannot be the home directory or a path above it (this would block every command the agent runs)';
}

const SECRET_ALLOW_DISABLES_EVERYTHING =
  'cannot cover the home directory or a path above it (this would disable secret protection everywhere)';
const SECRET_ALLOW_GUARD_CONFIG = "cannot cover the guard's own configuration";

// Shared entry preparation for the secret policy validators: trim, rewrite
// $HOME/${HOME} to ~, expand against home. Null means not a usable path string.
function expandSecretPolicyEntry(value: unknown, home: string): string | null {
  if (typeof value !== 'string' || value.trim() === '') return null;
  return expandAllowPathHome(value.trim().replace(/^\$(?:\{HOME\}|HOME(?=\/|$))/, '~'), home);
}

// Allow entries vouch for paths the user manages themselves (a repo's
// .env.test, a fixtures directory). Entries that would vouch for everything —
// home, anything above it, a bare `**` subtree over them — defeat the guard
// wholesale and are rejected; so is anything covering the guard's own config,
// which stays under policy-protection regardless. Relative entries resolve
// against each session's config cwd and cannot be judged at save time.
export function getSecretAllowPathError(value: unknown, home: string): string | null {
  const expanded = expandSecretPolicyEntry(value, home);
  if (expanded === null) return 'must be a non-empty path string';
  if (!hasGlobChars(expanded)) {
    if (!isAbsolute(expanded)) return null;
    if (getAllowPathHomeConflictError(expanded, home) !== null) {
      return SECRET_ALLOW_DISABLES_EVERYTHING;
    }
    return coversGuardConfig(expanded, home) ? SECRET_ALLOW_GUARD_CONFIG : null;
  }
  const prefix = literalGlobPrefix(expanded);
  const tail = expanded.slice(prefix.length).replace(/^\//, '');
  if (tail === '**' && globRootCoversEverything(prefix, home)) {
    return SECRET_ALLOW_DISABLES_EVERYTHING;
  }
  if (prefix !== '' && isAbsolute(prefix) && coversGuardConfig(prefix, home)) {
    return SECRET_ALLOW_GUARD_CONFIG;
  }
  return null;
}

// The literal directory a glob pattern is rooted at: everything before the
// first glob character, cut back to the last separator.
function literalGlobPrefix(pattern: string): string {
  const globIndex = pattern.search(GLOB_CHARS);
  const separatorIndex = pattern.lastIndexOf('/', globIndex);
  return separatorIndex <= 0 ? '' : pattern.slice(0, separatorIndex);
}

function globRootCoversEverything(prefix: string, home: string): boolean {
  if (prefix === '') return true;
  if (!isAbsolute(prefix)) return false;
  return getAllowPathHomeConflictError(prefix, home) !== null;
}

function coversGuardConfig(absolutePath: string, home: string): boolean {
  const normalized = comparableAllowPath(absolutePath);
  const guardRoot = comparableAllowPath(join(home, '.cc-safety-net'));
  return normalized === guardRoot || normalized.startsWith(`${guardRoot}${sep}`);
}

export function getAllowPathHomeConflictError(absolutePath: string, home: string): string | null {
  const normalized = comparableAllowPath(absolutePath);
  const normalizedHome = comparableAllowPath(home);
  if (normalized === normalizedHome) return 'cannot be the home directory';
  const prefix = normalized.endsWith(sep) ? normalized : `${normalized}${sep}`;
  if (normalizedHome.startsWith(prefix)) return 'cannot contain the home directory';
  return null;
}

function comparableAllowPath(path: string): string {
  let normalized = normalize(path);
  if (IS_WINDOWS) normalized = normalized.replace(/\//g, '\\').toLowerCase();
  if (normalized.length > (IS_WINDOWS ? 3 : 1) && normalized.endsWith(sep)) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}
