import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { processPathResolver } from '@next/core/environment';
import { GIT_GLOBAL_OPTS_WITH_VALUE } from '@next/core/rules/constants';
import { getGitExecutionContext, hasGitContextEnvOverride } from '@next/gate/analyzer/git/worktree';
import {
  GIT_GLOBAL_OPTS_WITH_VALUE as SHIPPED_GIT_GLOBAL_OPTS_WITH_VALUE,
  getGitExecutionContext as shippedGetGitExecutionContext,
  hasGitContextEnvOverride as shippedHasGitContextEnvOverride,
} from '@/analyzer/git/worktree';

/**
 * Worktree relaxation only applies to the directory Git would actually run in, so the ported
 * reader has to land on the same directory for every `-C`, `--git-dir` and `--work-tree` form.
 */

let root = '';
const paths = { repo: '', sub: '', deep: '', outside: '' };

beforeAll(() => {
  root = realpathSync(mkdtempSync(join(tmpdir(), 'next-git-exec-')));
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

function cwdRows(): (string | undefined)[] {
  return [
    undefined,
    '',
    root,
    paths.repo,
    paths.sub,
    paths.outside,
    join(paths.repo, 'link'),
    join(paths.repo, 'file.txt'),
    join(paths.repo, 'missing'),
    '.',
  ];
}

const ENV_ROWS: readonly (readonly [string, string])[][] = [
  [],
  [['PATH', '/usr/bin']],
  [['GIT_DIR', '/tmp/other.git']],
  [['GIT_WORK_TREE', '/tmp/tree']],
  [['GIT_COMMON_DIR', '/tmp/common']],
  [['GIT_INDEX_FILE', '/tmp/index']],
  [['GIT_CONFIG_COUNT', '1']],
  [['git_dir', '/tmp/other.git']],
];

describe('next/gate/analyzer/git/worktree against src/analyzer/git/worktree', () => {
  test('carries the same global-option table', () => {
    expect([...GIT_GLOBAL_OPTS_WITH_VALUE].sort()).toStrictEqual(
      [...SHIPPED_GIT_GLOBAL_OPTS_WITH_VALUE].sort(),
    );
  });

  test('resolves the same execution directory for every -C and context form', () => {
    for (const cwd of cwdRows()) {
      for (const tokens of TOKEN_ROWS) {
        expect({
          cwd,
          tokens,
          context: getGitExecutionContext(tokens, cwd, processPathResolver),
        }).toStrictEqual({ cwd, tokens, context: shippedGetGitExecutionContext(tokens, cwd) });
      }
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

  test('reads the same Git context environment overrides', () => {
    for (const env of ENV_ROWS) {
      for (const assignments of [...ENV_ROWS, undefined]) {
        const envMap = new Map(env);
        const assignmentMap = assignments === undefined ? undefined : new Map(assignments);
        expect({
          env,
          assignments,
          override: hasGitContextEnvOverride(envMap, assignmentMap),
        }).toStrictEqual({
          env,
          assignments,
          override: shippedHasGitContextEnvOverride(envMap, assignmentMap),
        });
      }
    }
  });
});
