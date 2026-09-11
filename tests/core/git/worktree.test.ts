import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  findDotGitInAncestors,
  isLinkedWorktree,
  normalizePathForComparison,
  resolveDotGitFileTargets,
  resolveWorktreeFacts,
} from '@/core/git/worktree';
import { createLinkedWorktreeFixture } from '../../helpers';

const fixture = createLinkedWorktreeFixture();
let scratch = '';

const ODD_LINK_NAME = process.platform === 'win32' ? 'odd name' : 'odd "\\\t\n\bname';

const GIT_CONFIG_ESCAPED: Readonly<Record<string, string>> = {
  '\\': '\\\\',
  '"': '\\"',
  '\t': '\\t',
  '\n': '\\n',
  '\b': '\\b',
};

function quoteForGitConfig(path: string): string {
  return `"${path.replace(/[\\"\t\n\b]/g, (char) => GIT_CONFIG_ESCAPED[char] ?? char)}"`;
}

function linkedGitDir(): string {
  return resolveDotGitFileTargets(join(fixture.linkedWorktree, '.git'))?.gitDir ?? '';
}

function fakeGit(script: string): string {
  const path = join(scratch, `git-${Buffer.from(script).toString('hex').slice(0, 16)}`);
  writeFileSync(path, `#!/bin/sh\n${script}\n`);
  chmodSync(path, 0o755);
  return path;
}

beforeAll(() => {
  scratch = mkdtempSync(join(tmpdir(), 'next-worktree-'));
  mkdirSync(join(fixture.linkedWorktree, 'nested'));
  writeFileSync(join(scratch, 'file'), 'x');
  symlinkSync(fixture.linkedWorktree, join(scratch, ODD_LINK_NAME));
});

afterAll(() => {
  fixture.cleanup();
  rmSync(scratch, { recursive: true, force: true });
});

describe('linked worktree facts', () => {
  test('a directory is a linked worktree only inside the checkout that is one', () => {
    const rows = () =>
      [
        [fixture.mainWorktree, false],
        [fixture.linkedWorktree, true],
        [join(fixture.linkedWorktree, 'nested'), true],
        [join(fixture.linkedWorktree, 'missing'), false],
        [fixture.rootDir, false],
        [scratch, false],
        [join(scratch, 'file'), false],
      ] as const;
    for (const [cwd, linked] of rows()) expect(isLinkedWorktree(cwd), cwd).toBe(linked);
  });

  test('the walk finds the nearest .git, and stops where there is none', () => {
    expect(findDotGitInAncestors(fixture.mainWorktree)).toBe(join(fixture.mainWorktree, '.git'));
    expect(findDotGitInAncestors(fixture.linkedWorktree)).toBe(
      join(fixture.linkedWorktree, '.git'),
    );
    for (const name of ['nested', 'missing']) {
      expect(findDotGitInAncestors(join(fixture.linkedWorktree, name))).toBe(
        join(fixture.linkedWorktree, '.git'),
      );
    }
    for (const cwd of [fixture.rootDir, scratch, join(scratch, 'file')]) {
      expect(findDotGitInAncestors(cwd), cwd).toBeNull();
    }
  });

  test('a .git file names its git directory and the common one; a .git directory names neither', () => {
    const targets = resolveDotGitFileTargets(join(fixture.linkedWorktree, '.git'));
    expect(realpathSync(targets?.gitDir ?? '.')).toBe(
      realpathSync(join(fixture.mainWorktree, '.git', 'worktrees', 'linked')),
    );
    expect(realpathSync(targets?.commonDir ?? '.')).toBe(
      realpathSync(join(fixture.mainWorktree, '.git')),
    );
    for (const dotGit of [
      join(fixture.mainWorktree, '.git'),
      join(scratch, 'file'),
      join(scratch, 'missing'),
    ]) {
      expect(resolveDotGitFileTargets(dotGit), dotGit).toBeNull();
    }
  });

  test('reads quoted and escaped core.worktree values like the shipped parser', () => {
    const configPath = join(linkedGitDir(), 'config.worktree');
    const quoted = quoteForGitConfig(realpathSync(fixture.linkedWorktree));
    const escaped = quoted.slice(1, -1);
    const values = [
      quoted,
      `"${escaped}\\n"`,
      `"${escaped}\\t"`,
      `"${escaped}\\"`,
      `'${escaped}'`,
      escaped,
      '"',
      `"${escaped}\\q"`,
      fixture.mainWorktree,
      quoteForGitConfig(join(scratch, ODD_LINK_NAME)),
    ];
    const accepted: readonly (readonly [string, boolean])[] = [
      [quoted, true],
      [`"${escaped}\\n"`, false],
      [`"${escaped}\\t"`, false],
      [`"${escaped}\\"`, true],
      [`'${escaped}'`, false],
      [escaped, true],
      ['"', false],
      [`"${escaped}\\q"`, false],
      [fixture.mainWorktree, false],
      [quoteForGitConfig(join(scratch, ODD_LINK_NAME)), true],
    ];
    expect(accepted.map(([value]) => value)).toEqual(values);

    try {
      for (const [value, linked] of accepted) {
        writeFileSync(configPath, `[core]\n\tworktree = ${value}\n`);
        expect(isLinkedWorktree(fixture.linkedWorktree), value).toBe(linked);
      }
    } finally {
      rmSync(configPath, { force: true });
    }
  });

  test.each([
    ['\\\\?\\C:\\x\\', 'C:/x'],
    ['\\\\?\\UNC\\srv\\share\\', '//srv/share'],
    ['C:\\x\\y\\', 'C:/x/y'],
    ['/a/b/', '/a/b'],
    ['/', '/'],
    ['x/', 'x'],
    ['', ''],
  ])('%s compares as %s', (path, compared) => {
    expect(normalizePathForComparison(path)).toBe(
      process.platform === 'win32' ? compared.toLowerCase() : compared,
    );
  });

  test('the comparison spelling case-folds only on Windows', () => {
    expect(normalizePathForComparison('C:\\X')).toBe(
      process.platform === 'win32' ? 'c:/x' : 'C:/X',
    );
    expect(normalizePathForComparison(fixture.linkedWorktree)).toBe(
      process.platform === 'win32'
        ? fixture.linkedWorktree.replaceAll('\\', '/').toLowerCase()
        : fixture.linkedWorktree,
    );
  });

  test('reports the effective submodule.recurse setting like the shipped config walk', () => {
    const commonConfig = join(fixture.mainWorktree, '.git', 'config');
    const worktreeConfig = join(linkedGitDir(), 'config.worktree');
    const original = readFileSync(commonConfig, 'utf-8');
    const variants: [common: string, worktree: string | null, recursive: boolean][] = [
      ['', null, false],
      ['[submodule]\n\trecurse = true\n', null, true],
      ['[submodule]\n\trecurse = no\n', null, false],
      ['[submodule]\n\trecurse = no\n', '[submodule]\n\trecurse = yes\n', true],
      ['', '[submodule]\n\trecurse\n', true],
      ['[include]\n\tpath = /nonexistent/include\n', null, true],
      ['', '[includeIf "gitdir:/x/"]\n\tpath = /nonexistent/include\n', true],
    ];
    try {
      for (const [common, worktree, recursive] of variants) {
        writeFileSync(commonConfig, `${original}${common}`);
        if (worktree === null) rmSync(worktreeConfig, { force: true });
        if (worktree !== null) writeFileSync(worktreeConfig, worktree);
        const facts = resolveWorktreeFacts(fixture.linkedWorktree);
        expect(facts).not.toBeNull();
        expect(facts?.recursiveSubmodules, JSON.stringify([common, worktree])).toBe(recursive);
      }
    } finally {
      writeFileSync(commonConfig, original);
      rmSync(worktreeConfig, { force: true });
    }
  });

  test('yields no facts outside a verified linked worktree', () => {
    expect(resolveWorktreeFacts(fixture.mainWorktree)).toBeNull();
    expect(resolveWorktreeFacts(scratch)).toBeNull();
    expect(resolveWorktreeFacts(join(scratch, 'file'))).toBeNull();
    expect(resolveWorktreeFacts(join(scratch, 'missing'))).toBeNull();
    expect(resolveWorktreeFacts(join(fixture.linkedWorktree, 'nested'))).toEqual(
      resolveWorktreeFacts(fixture.linkedWorktree),
    );
  });

  test.skipIf(process.platform === 'win32')(
    'takes the answer from the git binary it is pointed at',
    () => {
      expect(resolveWorktreeFacts(fixture.linkedWorktree, fakeGit('echo true; exit 0'))).toEqual({
        recursiveSubmodules: true,
      });
      expect(resolveWorktreeFacts(fixture.linkedWorktree, fakeGit('echo off; exit 0'))).toEqual({
        recursiveSubmodules: false,
      });
      expect(resolveWorktreeFacts(fixture.linkedWorktree, fakeGit('exit 1'))).toEqual({
        recursiveSubmodules: false,
      });
      expect(resolveWorktreeFacts(fixture.linkedWorktree, fakeGit('exit 128'))).toBeNull();
      expect(resolveWorktreeFacts(fixture.linkedWorktree, null)).toEqual({
        recursiveSubmodules: true,
      });
    },
  );

  test.skipIf(process.platform === 'win32')(
    'gives up without relaxation when git hangs past the timeout',
    () => {
      const started = performance.now();
      expect(resolveWorktreeFacts(fixture.linkedWorktree, fakeGit('sleep 1'), 100)).toBeNull();
      const elapsed = performance.now() - started;
      expect(elapsed).toBeGreaterThanOrEqual(100);
      expect(elapsed).toBeLessThan(900);
    },
  );
});
