import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { processPathResolver } from '@/core/environment';
import { GIT_GLOBAL_OPTS_WITH_VALUE } from '@/core/rules/constants';
import type { GitExecutionContext } from '@/gate/analyzer/git/worktree';
import { getGitExecutionContext, hasGitContextEnvOverride } from '@/gate/analyzer/git/worktree';

/**
 * Worktree relaxation only applies to the directory Git would actually run in, so the reader has
 * to land on the right directory for every `-C`, `--git-dir` and `--work-tree` form.
 */

let root = '';
const paths = { repo: '', sub: '', deep: '', outside: '' };

beforeAll(() => {
  root = realpathSync(mkdtempSync(join(tmpdir(), 'git-exec-')));
  paths.repo = join(root, 'repo');
  paths.sub = join(paths.repo, 'sub');
  paths.deep = join(paths.sub, 'deep');
  paths.outside = join(root, 'outside');
  mkdirSync(join(paths.repo, '.git'), { recursive: true });
  mkdirSync(paths.deep, { recursive: true });
  mkdirSync(paths.outside, { recursive: true });
  writeFileSync(join(paths.repo, 'file.txt'), 'x');
  symlinkSync(paths.sub, join(paths.repo, 'link'));
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

const TOKEN_ROWS: readonly (readonly string[])[] = [
  ['git', 'status'],
  ['git'],
  ['git', '-C', 'sub', 'status'],
  ['git', '-C', 'sub', '-C', 'deep', 'status'],
  ['git', '-Csub', 'status'],
  ['git', '-C', 'link', 'status'],
  ['git', '-C', 'missing', 'status'],
  ['git', '-C', 'file.txt', 'status'],
  ['git', '-C', '..', 'status'],
  ['git', '-C', ''],
  ['git', '-C'],
  ['git', '-C', 'sub', '-C', '..', 'status'],
  ['git', '--git-dir', '.git', 'status'],
  ['git', '--git-dir=.git', 'status'],
  ['git', '--work-tree', '.', 'status'],
  ['git', '--work-tree=.', 'status'],
  ['git', '-C', 'sub', '--git-dir', 'x', 'status'],
  ['git', '--git-dir', 'x', '-C', 'sub', 'status'],
  ['git', '-c', 'core.hooksPath=/tmp/hooks', 'status'],
  ['git', '-ccore.hooksPath=/tmp/hooks', 'status'],
  ['git', '--namespace', 'ns', '-C', 'sub', 'status'],
  ['git', '--super-prefix', 'p/', '-C', 'sub', 'status'],
  ['git', '--config-env', 'K=V', '-C', 'sub', 'status'],
  ['git', '--no-pager', '-C', 'sub', 'status'],
  ['git', '--', '-C', 'sub'],
  ['git', 'status', '-C', 'sub'],
  ['git', '-C', 'sub', '--', '-C', 'deep'],
  ['git', '-C', 'sub/deep', 'status'],
  ['git', '-C', 'sub', '-C', 'deep', '-C', '../..', 'status'],
];

describe('gate/analyzer/git/worktree', () => {
  test('the global-option table names every option that consumes the next token', () => {
    expect([...GIT_GLOBAL_OPTS_WITH_VALUE].sort()).toStrictEqual([
      '--config-env',
      '--git-dir',
      '--namespace',
      '--super-prefix',
      '--work-tree',
      '-C',
      '-c',
    ]);
  });

  test('the execution directory follows every -C form and stops at the first operand', () => {
    const rows: readonly {
      readonly tokens: readonly string[];
      readonly cwd: () => string | undefined;
      readonly context: () => GitExecutionContext;
    }[] = [
      {
        tokens: ['git', 'status'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: paths.repo, hasExplicitGitContext: false }),
      },
      {
        tokens: ['git', 'status'],
        cwd: () => undefined,
        context: () => ({ gitCwd: null, hasExplicitGitContext: false }),
      },
      {
        tokens: ['git', 'status'],
        cwd: () => join(root, 'missing'),
        context: () => ({ gitCwd: null, hasExplicitGitContext: false }),
      },
      {
        tokens: ['git', '-C', 'sub', '-C', 'deep', 'status'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: paths.deep, hasExplicitGitContext: false }),
      },
      {
        tokens: ['git', '-Csub', 'status'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: paths.sub, hasExplicitGitContext: false }),
      },
      {
        // contract: src/core/paths/chdir.ts — a `-C` through a symlink lands on the physical
        // directory, as a shell `cd` would.
        tokens: ['git', '-C', 'link', 'status'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: paths.sub, hasExplicitGitContext: false }),
      },
      {
        tokens: ['git', '-C', 'missing', 'status'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: null, hasExplicitGitContext: false }),
      },
      {
        tokens: ['git', '-C', 'file.txt', 'status'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: null, hasExplicitGitContext: false }),
      },
      {
        tokens: ['git', '-C'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: null, hasExplicitGitContext: false }),
      },
      {
        tokens: ['git', '-C', ''],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: null, hasExplicitGitContext: false }),
      },
      {
        tokens: ['git', '-C', 'sub', '-C', 'deep', '-C', '../..', 'status'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: paths.repo, hasExplicitGitContext: false }),
      },
      {
        tokens: ['git', '-C', 'sub/deep', 'status'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: paths.deep, hasExplicitGitContext: false }),
      },
      {
        tokens: ['git', '--git-dir', '.git', 'status'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: paths.repo, hasExplicitGitContext: true }),
      },
      {
        tokens: ['git', '--work-tree=.', 'status'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: paths.repo, hasExplicitGitContext: true }),
      },
      {
        tokens: ['git', '-C', 'sub', '--git-dir', 'x', 'status'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: paths.sub, hasExplicitGitContext: true }),
      },
      {
        tokens: ['git', '--git-dir', 'x', '-C', 'sub', 'status'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: paths.sub, hasExplicitGitContext: true }),
      },
      {
        tokens: ['git', '--namespace', 'ns', '-C', 'sub', 'status'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: paths.sub, hasExplicitGitContext: false }),
      },
      {
        tokens: ['git', '--no-pager', '-C', 'sub', 'status'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: paths.sub, hasExplicitGitContext: false }),
      },
      {
        // contract: src/gate/analyzer/git/worktree.ts:41 — `--` ends the global options, so what
        // follows is an operand rather than a directory change.
        tokens: ['git', '--', '-C', 'sub'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: paths.repo, hasExplicitGitContext: false }),
      },
      {
        tokens: ['git', 'status', '-C', 'sub'],
        cwd: () => paths.repo,
        context: () => ({ gitCwd: paths.repo, hasExplicitGitContext: false }),
      },
    ];
    for (const row of rows) {
      expect(
        getGitExecutionContext(row.tokens, row.cwd(), processPathResolver),
        row.tokens.join(' '),
      ).toStrictEqual(row.context());
    }
  });

  test('the table reaches a resolved directory and an explicit context', () => {
    const contexts = TOKEN_ROWS.map((tokens) =>
      getGitExecutionContext(tokens, paths.repo, processPathResolver),
    );
    expect(contexts.filter((context) => context.gitCwd === paths.sub).length).toBeGreaterThan(2);
    expect(contexts.filter((context) => context.gitCwd === null).length).toBeGreaterThan(2);
    expect(contexts.filter((context) => context.hasExplicitGitContext).length).toBeGreaterThan(3);
  });

  test('a Git context environment override is read from the environment or the assignments', () => {
    const rows: readonly {
      readonly env: readonly (readonly [string, string])[];
      readonly assignments?: readonly (readonly [string, string])[];
      readonly override: boolean;
    }[] = [
      { env: [], override: false },
      { env: [['PATH', '/usr/bin']], override: false },
      { env: [['GIT_CONFIG_COUNT', '1']], override: false },
      // contract: src/gate/analyzer/git/env.ts — the override names are matched exactly.
      { env: [['git_dir', '/tmp/other.git']], override: false },
      { env: [['GIT_DIR', '/tmp/other.git']], override: true },
      { env: [['GIT_WORK_TREE', '/tmp/tree']], override: true },
      { env: [['GIT_COMMON_DIR', '/tmp/common']], override: true },
      { env: [['GIT_INDEX_FILE', '/tmp/index']], override: true },
      { env: [], assignments: [['GIT_DIR', '/tmp/other.git']], override: true },
      { env: [], assignments: [['PATH', '/usr/bin']], override: false },
      { env: [['GIT_DIR', '/tmp/other.git']], assignments: [], override: true },
    ];
    for (const row of rows) {
      const assignments = row.assignments === undefined ? undefined : new Map(row.assignments);
      expect(
        hasGitContextEnvOverride(new Map(row.env), assignments),
        `${JSON.stringify(row.env)} ${JSON.stringify(row.assignments)}`,
      ).toBe(row.override);
    }
  });
});
