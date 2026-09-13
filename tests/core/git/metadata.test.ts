import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createProcessEnvironment } from '@/core/environment';
import { resolveProtectedGitMetadata } from '@/core/git/metadata';
import { runGit } from '../../helpers/git-worktree';

const IDENTITY = ['-c', 'user.name=Next Test', '-c', 'user.email=next@example.test'];

let root = '';

function commitAll(repository: string, message: string): void {
  runGit(repository, ['add', '-A']);
  runGit(repository, [...IDENTITY, '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', message]);
}

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'next-git-metadata-'));

  const submodule = join(root, 'sub');
  mkdirSync(submodule);
  runGit(submodule, ['init', '-q']);
  writeFileSync(join(submodule, 'lib.txt'), 'lib\n');
  commitAll(submodule, 'lib');

  const main = join(root, 'main');
  mkdirSync(main);
  runGit(main, ['init', '-q']);
  writeFileSync(join(main, 'file.txt'), 'main\n');
  commitAll(main, 'main');
  runGit(main, [
    '-c',
    'protocol.file.allow=always',
    'submodule',
    'add',
    '-q',
    '../sub',
    'vendor/sub',
  ]);
  commitAll(main, 'add submodule');
  mkdirSync(join(main, 'nested'));
  runGit(main, ['worktree', 'add', '-q', '-b', 'feature/linked', join(root, 'linked')]);
  mkdirSync(join(root, 'linked', 'inner'));

  mkdirSync(join(root, 'plain'));
  symlinkSync(main, join(root, 'via-symlink'));

  const external = join(root, 'external');
  mkdirSync(external);
  runGit(external, ['init', '-q']);
  renameSync(join(external, '.git'), join(root, 'external-gitdir'));
  symlinkSync(join(root, 'external-gitdir'), join(external, '.git'));
  mkdirSync(join(root, 'hooks-outside'));
  rmSync(join(root, 'external-gitdir', 'hooks'), { recursive: true, force: true });
  symlinkSync(join(root, 'hooks-outside'), join(root, 'external-gitdir', 'hooks'));
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('protected git metadata', () => {
  const fold = (path: string) =>
    process.platform === 'win32' ? path.replaceAll('\\', '/').toLowerCase() : path;
  const compared = (...parts: string[]) => fold(join(realpathSync(root), ...parts));

  const mainRepository = () => ({
    directories: [compared('main', '.git')],
    entries: [compared('main', '.git')],
    hooksDirectories: [compared('main', '.git', 'hooks')],
    markerFiles: [],
  });

  const linkedWorktree = () => {
    const gitDir = fold(
      realpathSync(
        readFileSync(join(root, 'linked', '.git'), 'utf8')
          .replace('gitdir:', '')
          .trim(),
      ),
    );
    const commonDir = gitDir.slice(0, gitDir.indexOf('/worktrees/'));
    return {
      directories: [gitDir, commonDir],
      entries: [compared('linked', '.git')],
      hooksDirectories: [`${gitDir}/hooks`, `${commonDir}/hooks`],
      markerFiles: [compared('linked', '.git')],
    };
  };

  const ROWS = [
    {
      name: 'the working tree of a repository',
      cwd: () => join(root, 'main'),
      expected: mainRepository,
    },
    {
      name: 'a directory under the working tree',
      cwd: () => join(root, 'main', 'nested'),
      expected: mainRepository,
    },
    {
      name: 'a submodule checkout',
      cwd: () => join(root, 'main', 'vendor', 'sub'),
      expected: () => ({
        directories: [compared('main', '.git', 'modules', 'vendor', 'sub')],
        entries: [compared('main', 'vendor', 'sub', '.git')],
        hooksDirectories: [compared('main', '.git', 'modules', 'vendor', 'sub', 'hooks')],
        markerFiles: [compared('main', 'vendor', 'sub', '.git')],
      }),
    },
    {
      name: 'a path under the working tree that does not exist',
      cwd: () => join(root, 'main', 'missing', 'deeper'),
      expected: mainRepository,
    },
    { name: 'a linked worktree', cwd: () => join(root, 'linked'), expected: linkedWorktree },
    {
      name: 'a directory under a linked worktree',
      cwd: () => join(root, 'linked', 'inner'),
      expected: linkedWorktree,
    },
    {
      name: 'a directory in no repository',
      cwd: () => join(root, 'plain'),
      expected: () => null,
    },
    {
      name: 'a working tree reached through a symlink',
      cwd: () => join(root, 'via-symlink'),
      expected: mainRepository,
    },
    {
      name: 'a directory under a symlinked working tree',
      cwd: () => join(root, 'via-symlink', 'nested'),
      expected: mainRepository,
    },
    {
      name: 'a working tree whose git directory is a symlink out of it',
      cwd: () => join(root, 'external'),
      expected: () => ({
        directories: [compared('external', '.git'), compared('external-gitdir')],
        entries: [compared('external-gitdir')],
        hooksDirectories: [
          compared('external', '.git', 'hooks'),
          compared('hooks-outside'),
          compared('external-gitdir', 'hooks'),
        ],
        markerFiles: [],
      }),
    },
    {
      name: 'a git directory standing on its own',
      cwd: () => join(root, 'external-gitdir'),
      expected: () => null,
    },
    {
      name: 'the git directory inside a working tree',
      cwd: () => join(root, 'main', '.git'),
      expected: mainRepository,
    },
    { name: 'the directory the fixtures sit in', cwd: () => root, expected: () => null },
    { name: 'no working directory at all', cwd: () => '', expected: () => null },
  ];

  test.each(ROWS)('$name', (row) => {
    expect(resolveProtectedGitMetadata(row.cwd(), createProcessEnvironment())).toEqual(
      row.expected(),
    );
  });
});
