import { spawnSync } from 'node:child_process';
import { lstatSync, realpathSync, statSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { type ProtectedGitMetadata, resolveProtectedGitMetadata } from './git/metadata';
import {
  gitDirectoryRedirects,
  isGitDirectory,
  resolveWorktreeFacts,
  type WorktreeFacts,
} from './git/worktree';
import { normalizeMsysDrivePath } from './paths/canonicalization';

export type PathResolver = Readonly<{
  realpath: (path: string) => string | null;

  entryKind: (path: string) => 'symlink' | 'present' | 'missing';

  isDirectory: (path: string) => boolean;
}>;

export type Environment = Readonly<{
  env: ReadonlyMap<string, string>;
  home: string;
  tmpdir: string;
  darwinUserTempDir: () => string | null;
  paths: PathResolver;

  gitMetadata: (cwd: string) => ProtectedGitMetadata | null;

  worktreeFacts: (cwd: string) => WorktreeFacts | null;

  isGitDirectory: (gitDir: string) => boolean;

  gitDirectoryRedirects: (gitDir: string) => boolean;
}>;

/** @internal */
export const processPathResolver: PathResolver = {
  realpath: (path) => {
    try {
      return realpathSync(path);
    } catch {
      return null;
    }
  },
  entryKind: (path) => {
    try {
      const stats = lstatSync(path, { throwIfNoEntry: false });
      if (!stats) return 'missing';
      return stats.isSymbolicLink() ? 'symlink' : 'present';
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENAMETOOLONG') return 'missing';
      throw error;
    }
  },

  isDirectory: (path) => {
    try {
      return statSync(path).isDirectory();
    } catch {
      return false;
    }
  },
};

export function createProcessEnvironment(): Environment {
  const darwinUserTempDir = new Map<string, string | null>();
  return withGitFacts({
    env: new Map(
      Object.entries(process.env).flatMap(([name, value]) =>
        value === undefined ? [] : [[name, value] as const],
      ),
    ),
    home: normalizeMsysDrivePath(process.env.HOME || homedir()),
    tmpdir: tmpdir(),
    darwinUserTempDir: () => memoized(darwinUserTempDir, '', readDarwinUserTempDir),
    paths: processPathResolver,
  });
}

function readDarwinUserTempDir(): string | null {
  if (process.platform !== 'darwin') return null;
  const result = spawnSync('/usr/bin/getconf', ['DARWIN_USER_TEMP_DIR'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    timeout: 1000,
  });
  const value = result.stdout?.replace(/\n$/, '');
  return result.status === 0 && value?.startsWith('/') ? value : null;
}

/** @internal */
export type FakeEntry = 'present' | 'directory' | { symlink: string };

/** @internal */
export function createTestEnvironment(
  overrides: Partial<Environment> & { entries?: ReadonlyMap<string, FakeEntry> } = {},
): Environment {
  const { entries = new Map<string, FakeEntry>(), ...rest } = overrides;
  return withGitFacts(
    {
      env: new Map(),
      home: '/home/user',
      tmpdir: '/tmp',
      darwinUserTempDir: () => null,
      paths: {
        realpath: (path) => fakeRealpath(entries, path, new Set()),
        entryKind: (path) => {
          const entry = entries.get(path);
          if (entry === undefined) return 'missing';
          return typeof entry === 'string' ? 'present' : 'symlink';
        },
        isDirectory: (path) => {
          const target = fakeRealpath(entries, path, new Set());
          return target !== null && entries.get(target) === 'directory';
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
  if (typeof entry === 'string') return path;
  return fakeRealpath(entries, entry.symlink, new Set([...seen, path]));
}

function withGitFacts(
  base: Omit<
    Environment,
    'gitMetadata' | 'worktreeFacts' | 'isGitDirectory' | 'gitDirectoryRedirects'
  >,
  overrides: Partial<Environment> = {},
): Environment {
  const metadata = new Map<string, ProtectedGitMetadata | null>();
  const facts = new Map<string, WorktreeFacts | null>();
  const redirects = new Map<string, boolean>();
  const environment: Environment = {
    ...base,
    gitMetadata: (cwd) =>
      memoized(metadata, cwd, () => resolveProtectedGitMetadata(cwd, environment)),
    worktreeFacts: (cwd) => memoized(facts, cwd, () => resolveWorktreeFacts(cwd)),
    isGitDirectory,
    gitDirectoryRedirects: (gitDir) =>
      memoized(redirects, gitDir, () => gitDirectoryRedirects(gitDir)),
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
