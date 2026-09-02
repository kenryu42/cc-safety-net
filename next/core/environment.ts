import { lstatSync, realpathSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { type ProtectedGitMetadata, resolveProtectedGitMetadata } from './git/metadata';
import { resolveWorktreeFacts, type WorktreeFacts } from './git/worktree';
import { normalizeMsysDrivePath } from './paths/canonicalization';

/** Filesystem lookups the gate needs, so path facts are injected instead of read ambiently. */
export type PathResolver = Readonly<{
  /** Fully resolved path, or null when it cannot be resolved. */
  realpath: (path: string) => string | null;
  /** What sits at the path: a symlink, some other existing entry, or nothing. */
  entryKind: (path: string) => 'symlink' | 'present' | 'missing';
}>;

/** Ambient process state the gate reads, captured once at the entry point. */
export type Environment = Readonly<{
  env: ReadonlyMap<string, string>;
  home: string;
  tmpdir: string;
  paths: PathResolver;
  /** Git control-plane paths around `cwd`, or null outside a repository; memoized per cwd. */
  gitMetadata: (cwd: string) => ProtectedGitMetadata | null;
  /** Facts for worktree relaxation, or null when it must not apply; memoized per cwd. */
  worktreeFacts: (cwd: string) => WorktreeFacts | null;
}>;

/** The real filesystem behind a PathResolver. */
export const processPathResolver: PathResolver = {
  realpath: (path) => {
    try {
      return realpathSync(path);
    } catch {
      return null;
    }
  },
  entryKind: (path) => {
    const stats = lstatSync(path, { throwIfNoEntry: false });
    if (!stats) return 'missing';
    return stats.isSymbolicLink() ? 'symlink' : 'present';
  },
};

/** Snapshot the current process state for one gate call. */
export function createProcessEnvironment(): Environment {
  return withGitFacts({
    env: new Map(
      Object.entries(process.env).flatMap(([name, value]) =>
        value === undefined ? [] : [[name, value] as const],
      ),
    ),
    home: normalizeMsysDrivePath(process.env.HOME || homedir()),
    tmpdir: tmpdir(),
    paths: processPathResolver,
  });
}

/** What the in-memory filesystem holds at a path: a plain entry or a symlink to another path. */
export type FakeEntry = 'present' | { symlink: string };

/**
 * An environment over an in-memory filesystem for tests: only the listed paths exist, a symlink
 * resolves through its target, and the git facts read the real filesystem unless overridden.
 */
export function createTestEnvironment(
  overrides: Partial<Environment> & { entries?: ReadonlyMap<string, FakeEntry> } = {},
): Environment {
  const { entries = new Map<string, FakeEntry>(), ...rest } = overrides;
  return withGitFacts(
    {
      env: new Map(),
      home: '/home/user',
      tmpdir: '/tmp',
      paths: {
        realpath: (path) => fakeRealpath(entries, path, new Set()),
        entryKind: (path) => {
          const entry = entries.get(path);
          if (entry === undefined) return 'missing';
          return entry === 'present' ? 'present' : 'symlink';
        },
      },
    },
    rest,
  );
}

function fakeRealpath(
  entries: ReadonlyMap<string, FakeEntry>,
  path: string,
  seen: ReadonlySet<string>,
): string | null {
  const entry = entries.get(path);
  if (entry === undefined || seen.has(path)) return null;
  if (entry === 'present') return path;
  return fakeRealpath(entries, entry.symlink, new Set([...seen, path]));
}

function withGitFacts(
  base: Omit<Environment, 'gitMetadata' | 'worktreeFacts'>,
  overrides: Partial<Environment> = {},
): Environment {
  const metadata = new Map<string, ProtectedGitMetadata | null>();
  const facts = new Map<string, WorktreeFacts | null>();
  const environment: Environment = {
    ...base,
    gitMetadata: (cwd) =>
      memoized(metadata, cwd, () => resolveProtectedGitMetadata(cwd, environment)),
    worktreeFacts: (cwd) => memoized(facts, cwd, () => resolveWorktreeFacts(cwd)),
    ...overrides,
  };
  return environment;
}

function memoized<T>(cache: Map<string, T>, key: string, compute: () => T): T {
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  const value = compute();
  cache.set(key, value);
  return value;
}
