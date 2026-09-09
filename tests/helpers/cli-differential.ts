import { spyOn } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { Console } from 'node:console';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Writable } from 'node:stream';
import { createProcessEnvironment, type Environment } from '@/core/environment';
import { createFakeBin } from './fake-bin';
import { snapshotTree, type TreeEntry, type TreeSpec, writeTree } from './fixture-tree';
import {
  createTempRoot,
  isolatedSpawnEnv,
  normalize,
  rootFolds,
  WINDOWS_SEPARATOR_FOLDS,
  withProcessEnv,
} from './temp-home';

/**
 * One argument vector over its own temp root, with every home the CLI reads pointed inside it and
 * a `PATH` that holds one empty directory, so every host, node, npm and git probe fails with
 * ENOENT instead of finding whatever the machine installed. `runCliDifferential` runs the bin as
 * a child process; `runCliCommand` calls a command handler in this process over the same fixture.
 * What is recorded is what a user sees: the stdout bytes, the stderr bytes, the exit code and the
 * tree the run left behind.
 */

export const REPO_ROOT = join(import.meta.dir, '..', '..');
export const PORTED_ENTRY = join(REPO_ROOT, 'src/entries/bin.ts');

/** The temp root one side of a row runs against, handed to `seed` and `cwd`. */
export type CliSide = {
  root: string;
  home: string;
  project: string;
  env: Record<string, string>;
};

export type CliRow = {
  args: readonly string[];
  /** Writes the fixture this row reads, with the side's own env already resolved. */
  seed?: (side: CliSide) => void;
  /** Where the CLI runs; the project directory by default. */
  cwd?: (side: CliSide) => string;
  env?: Record<string, string | undefined>;
  stdin?: string;
};

export type CliOutcome = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  tree: TreeEntry[];
};

/** The mode, debug and audit variables a developer's shell may carry into the run. */
const BLANKED_ENV_NAMES = [
  'CC_SAFETY_NET_LEVEL',
  'CC_SAFETY_NET_STRICT',
  'CC_SAFETY_NET_PARANOID',
  'CC_SAFETY_NET_PARANOID_RM',
  'CC_SAFETY_NET_PARANOID_INTERPRETERS',
  'CC_SAFETY_NET_WORKTREE',
  'CC_SAFETY_NET_DEBUG',
  'CC_SAFETY_NET_AUDIT_SCOPE',
  'SAFETY_NET_STRICT',
  'SAFETY_NET_PARANOID',
  'SAFETY_NET_PARANOID_RM',
  'SAFETY_NET_PARANOID_INTERPRETERS',
  'SAFETY_NET_WORKTREE',
  'CLAUDE_SETTINGS_PATH',
  'NO_COLOR',
  'FORCE_COLOR',
];

/**
 * Scaffolding rather than something the run wrote: the fake bin's own files, and the transpiler
 * cache `bun run` fills under the isolated `HOME`, whose content-keyed entries name the build that
 * filled them.
 */
const SCAFFOLDING = /^(bin|fake-script\.json|fake-log\.txt|home\/\.bun)(\/|$)/;

function createSide(row: CliRow): CliSide {
  // A short label: a row that renders a path into a fixed-width column truncates it, so the
  // root's length is part of what `status` prints, and macOS spells the temp root eight
  // characters longer once canonicalized (`/private/tmp/…`).
  const root = createTempRoot('cli-');
  const home = join(root, 'home');
  const project = join(root, 'project');
  mkdirSync(home, { recursive: true });
  mkdirSync(project, { recursive: true });
  // Drop blanked names rather than stringifying undefined, and remove an inherited Windows Path
  // before installing the fake bin's PATH. Row overrides apply after the fixture environment.
  const env = isolatedSpawnEnv(home, {
    ...createFakeBin(root, []).env,
    TZ: 'UTC',
    ...Object.fromEntries(BLANKED_ENV_NAMES.map((name) => [name, undefined])),
  });
  return {
    root,
    home,
    project,
    env: Object.fromEntries(
      Object.entries({ ...env, ...row.env }).flatMap(([name, value]) =>
        value === undefined ? [] : [[name, value] as const],
      ),
    ),
  };
}

export function runCliDifferential(row: CliRow): CliOutcome {
  const side = createSide(row);
  row.seed?.(side);
  const result = spawnSync(process.execPath, ['run', PORTED_ENTRY, ...row.args], {
    cwd: row.cwd?.(side) ?? side.project,
    input: row.stdin ?? '',
    env: side.env,
    encoding: 'utf-8',
    maxBuffer: 32 * 1024 * 1024,
  });
  return outcome(side, result.stdout, result.stderr, result.status);
}

function outcome(
  side: CliSide,
  stdout: string,
  stderr: string,
  exitCode: number | null,
): CliOutcome {
  const folds = rootFolds(side.root);
  const clean = (text: string) =>
    normalize(text, [...folds, [REPO_ROOT, '<repo>'], ...WINDOWS_SEPARATOR_FOLDS]);
  return {
    stdout: clean(stdout),
    stderr: clean(stderr),
    exitCode,
    tree: normalize(
      snapshotTree(side.root).filter((entry) => !SCAFFOLDING.test(entry.path)),
      [...folds, ...WINDOWS_SEPARATOR_FOLDS],
    ),
  };
}

/**
 * Command behavior over the same real fixture as the subprocess runner. Only the entry point is
 * bypassed; the caller supplies the real handler. Dispatch, stdin and process-exit tests must use
 * runCliDifferential. This changes process globals and must not run concurrently with other tests.
 */
export async function runCliCommand(
  row: Omit<CliRow, 'stdin'>,
  run: (environment: Environment) => number | Promise<number>,
): Promise<CliOutcome> {
  const side = createSide(row);
  row.seed?.(side);
  const stdout: Buffer[] = [];
  const stderr: Buffer[] = [];
  const stream = (chunks: Buffer[]) =>
    new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk));
        callback();
      },
    });
  const out = stream(stdout);
  const err = stream(stderr);
  const captured = new Console({ stdout: out, stderr: err, colorMode: false });
  const spies = [
    spyOn(console, 'log').mockImplementation(captured.log.bind(captured)),
    spyOn(console, 'error').mockImplementation(captured.error.bind(captured)),
    spyOn(process.stdout, 'write').mockImplementation(out.write.bind(out)),
    spyOn(process.stderr, 'write').mockImplementation(err.write.bind(err)),
  ];
  const cwd = process.cwd();
  const terminal = ['isTTY', 'columns'].map(
    (name) => [name, Object.getOwnPropertyDescriptor(process.stdout, name)] as const,
  );
  Object.defineProperty(process.stdout, 'isTTY', { value: false, configurable: true });
  Object.defineProperty(process.stdout, 'columns', { value: undefined, configurable: true });
  try {
    process.chdir(row.cwd?.(side) ?? side.project);
    const exitCode = await withProcessEnv(
      {
        ...Object.fromEntries(Object.keys(process.env).map((name) => [name, undefined])),
        ...side.env,
      },
      () => run(createProcessEnvironment()),
    );
    return outcome(
      side,
      Buffer.concat(stdout).toString(),
      Buffer.concat(stderr).toString(),
      exitCode,
    );
  } finally {
    process.chdir(cwd);
    for (const [name, descriptor] of terminal) {
      if (descriptor) Object.defineProperty(process.stdout, name, descriptor);
      else Reflect.deleteProperty(process.stdout, name);
    }
    for (const spy of spies) spy.mockRestore();
    out.destroy();
    err.destroy();
  }
}

/** Write a row's fixture under its temp root, with paths spelled from the root. */
export function seedFiles(side: CliSide, spec: TreeSpec): void {
  writeTree(side.root, spec);
}
