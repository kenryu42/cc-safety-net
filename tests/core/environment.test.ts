import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  createProcessEnvironment,
  createTestEnvironment,
  type FakeEntry,
  processPathResolver,
  realpathWithinKernelSymlinkLimit,
} from '@/core/environment';
import { createLinkedWorktreeFixture, runGit } from '../helpers';
import { describeOutcome } from '../helpers/fixture-tree';

import { writeSymlinkLoopTree } from './differential-inputs';

let root = '';

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'next-environment-'));
  writeSymlinkLoopTree(root, {
    dir: null,
    link: { symlink: join(root, 'dir') },
    'repo/nested': null,
  });
  runGit(['init', '-q'], join(root, 'repo'));
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('process environment', () => {
  test('resolves entries like the shipped resolver', () => {
    const canonical = realpathSync(root);
    const answers = {
      dir: { realpath: join(canonical, 'dir'), entryKind: 'present' },
      file: { realpath: join(canonical, 'file'), entryKind: 'present' },
      link: { realpath: join(canonical, 'dir'), entryKind: 'symlink' },
      broken: { realpath: null, entryKind: 'symlink' },
      'loop-a': { realpath: null, entryKind: 'symlink' },
      missing: { realpath: null, entryKind: 'missing' },
      '': { realpath: canonical, entryKind: 'present' },
    } as const;
    for (const [name, answer] of Object.entries(answers)) {
      const path = join(root, name);
      expect(processPathResolver.realpath(path), name).toBe(answer.realpath);
      expect(processPathResolver.entryKind(path), name).toBe(answer.entryKind);
    }
  });

  test('a path under a regular file is missing or refused, never an entry', () => {
    const under = join(root, 'file', 'under');
    expect(processPathResolver.realpath(under)).toBeNull();
    expect(describeOutcome(() => processPathResolver.entryKind(under))).toSatisfy(
      (outcome) =>
        (outcome.ok && outcome.value === 'missing') ||
        (!outcome.ok && outcome.error.message.includes('ENOTDIR')),
    );
  });

  test('a name too long for the filesystem is missing, not an error', () => {
    expect(processPathResolver.entryKind(join(root, 'x'.repeat(300)))).toBe('missing');
    expect(processPathResolver.entryKind(join(root, 'x/'.repeat(4000)))).toBe('missing');
  });
});

describe('linux realpath', () => {
  const chained = (count: number) => {
    const dir = join(realpathSync(root), `chained-${count}`);
    mkdirSync(dir);
    writeFileSync(join(dir, 'target'), 'x');
    Array.from({ length: count }, (_, index) => index).forEach((index) => {
      symlinkSync(index === 0 ? 'target' : `link-${index - 1}`, join(dir, `link-${index}`));
    });
    return { path: join(dir, `link-${count - 1}`), target: join(dir, 'target') };
  };
  const spread = (count: number) => {
    const dir = join(realpathSync(root), `spread-${count}`);
    mkdirSync(dir);
    writeFileSync(join(dir, 'target'), 'x');
    const links = Array.from({ length: count }, (_, index) => `same-dir-${index}`);
    links.forEach((link) => {
      symlinkSync('.', join(dir, link));
    });
    return { path: join(dir, ...links, 'target'), target: join(dir, 'target') };
  };

  test.skipIf(process.platform === 'win32')(
    'resolves a path that crosses as many symlinks as the kernel follows',
    () => {
      for (const fixture of [chained(40), spread(40)]) {
        expect(realpathWithinKernelSymlinkLimit(fixture.path), fixture.path).toBe(fixture.target);
      }
    },
  );

  test.skipIf(process.platform === 'win32')(
    'refuses a path the kernel would refuse, and a symlink loop, without hanging',
    () => {
      for (const path of [chained(41).path, spread(41).path, join(root, 'loop-a')]) {
        expect(
          describeOutcome(() => realpathWithinKernelSymlinkLimit(path)),
          path,
        ).toSatisfy((outcome) => !outcome.ok && outcome.error.message.includes('ELOOP'));
      }
    },
  );

  test.skipIf(process.platform === 'win32')('reports a broken link as missing', () => {
    expect(describeOutcome(() => realpathWithinKernelSymlinkLimit(join(root, 'broken')))).toSatisfy(
      (outcome) => !outcome.ok && outcome.error.message.includes('ENOENT'),
    );
  });
});

describe('test environment', () => {
  test('holds only the listed entries and follows symlinks to their target', () => {
    const environment = createTestEnvironment({
      entries: new Map<string, FakeEntry>([
        ['/repo', 'present'],
        ['/link', { symlink: '/repo' }],
        ['/tree', 'directory'],
        ['/tree-link', { symlink: '/tree' }],
        ['/broken', { symlink: '/nowhere' }],
        ['/loop-a', { symlink: '/loop-b' }],
        ['/loop-b', { symlink: '/loop-a' }],
      ]),
    });
    expect(environment.paths.entryKind('/repo')).toBe('present');
    expect(environment.paths.entryKind('/link')).toBe('symlink');
    expect(environment.paths.entryKind('/broken')).toBe('symlink');
    expect(environment.paths.entryKind('/repo/child')).toBe('missing');
    expect(environment.paths.realpath('/repo')).toBe('/repo');
    expect(environment.paths.realpath('/link')).toBe('/repo');
    expect(environment.paths.realpath('/broken')).toBeNull();
    expect(environment.paths.realpath('/loop-a')).toBeNull();
    expect(environment.paths.realpath('/missing')).toBeNull();
    expect(environment.paths.isDirectory('/tree')).toBe(true);
    expect(environment.paths.isDirectory('/tree-link')).toBe(true);
    expect(environment.paths.isDirectory('/repo')).toBe(false);
    expect(environment.env.size).toBe(0);
    expect(environment.home).toBe('/home/user');
    expect(environment.tmpdir).toBe('/tmp');
    expect(environment.gitMetadata('/repo')).toBeNull();
    expect(environment.worktreeFacts('/repo')).toBeNull();
  });

  test('takes overrides for every field', () => {
    const gitMetadata = () => null;
    const environment = createTestEnvironment({
      env: new Map([['TMPDIR', '/scratch']]),
      home: '/srv/home',
      tmpdir: '/scratch',
      paths: processPathResolver,
      gitMetadata,
    });
    expect(environment.env.get('TMPDIR')).toBe('/scratch');
    expect(environment.home).toBe('/srv/home');
    expect(environment.tmpdir).toBe('/scratch');
    expect(environment.paths).toBe(processPathResolver);
    expect(environment.gitMetadata).toBe(gitMetadata);
  });
});

describe('git facts through the seam', () => {
  test('gitMetadata agrees with the shipped resolver and is memoized per cwd', () => {
    const environment = createProcessEnvironment();
    expect(environment.gitMetadata(join(root, 'repo', 'nested'))).toEqual(
      environment.gitMetadata(join(root, 'repo')),
    );
    for (const cwd of [join(root, 'dir'), root]) {
      expect(environment.gitMetadata(cwd), cwd).toBeNull();
    }
    expect(environment.gitMetadata(join(root, 'repo'))).not.toBeNull();
    expect(environment.gitMetadata(join(root, 'repo'))).toBe(
      environment.gitMetadata(join(root, 'repo')),
    );
    expect(environment.gitMetadata('')).toBeNull();
  });

  test('worktreeFacts is null outside a linked worktree and memoized inside one', () => {
    const fixture = createLinkedWorktreeFixture();
    try {
      const environment = createProcessEnvironment();
      expect(environment.worktreeFacts(fixture.mainWorktree)).toBeNull();
      expect(environment.worktreeFacts(join(root, 'dir'))).toBeNull();
      const facts = environment.worktreeFacts(fixture.linkedWorktree);
      expect(facts?.recursiveSubmodules).toBe(false);
      expect(environment.worktreeFacts(fixture.linkedWorktree)).toBe(facts);
    } finally {
      fixture.cleanup();
    }
  });
});
