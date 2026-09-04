import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  assertExactReleaseBase,
  assertRemoteMain,
  pushReleaseAtomically,
} from '../../scripts/release-git';
import { runReleaseTransaction } from '../../scripts/release-transaction';
import { withTempDir } from '../helpers';

function git(cwd: string, ...args: string[]) {
  const result = Bun.spawnSync(['git', '-c', 'commit.gpgsign=false', ...args], {
    cwd,
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'Release Test',
      GIT_AUTHOR_EMAIL: 'release@example.com',
      GIT_COMMITTER_NAME: 'Release Test',
      GIT_COMMITTER_EMAIL: 'release@example.com',
    },
    stdout: 'pipe',
    stderr: 'pipe',
  });
  if (result.exitCode !== 0) {
    throw new Error(result.stderr.toString());
  }
  return result.stdout.toString().trim();
}

let repositorySeed: { root: string; bare: string } | undefined;

function getRepositorySeed() {
  if (repositorySeed) return repositorySeed.bare;

  const root = mkdtempSync(join(tmpdir(), 'cc-safety-net-release-seed-'));
  const source = join(root, 'source');
  const bare = join(root, 'seed.git');
  mkdirSync(source);
  git(source, 'init', '-b', 'main');
  writeFileSync(join(source, 'file.txt'), 'base\n');
  mkdirSync(join(source, '.claude-plugin'));
  mkdirSync(join(source, '.codex-plugin'));
  writeFileSync(
    join(source, 'package.json'),
    JSON.stringify({ name: 'cc-safety-net-release-test', version: '1.0.0' }),
  );
  writeFileSync(
    join(source, '.claude-plugin', 'plugin.json'),
    JSON.stringify({ version: '1.0.0' }),
  );
  writeFileSync(join(source, '.codex-plugin', 'plugin.json'), JSON.stringify({ version: '1.0.0' }));
  writeFileSync(join(source, 'kimi.plugin.json'), JSON.stringify({ version: '1.0.0' }));
  git(
    source,
    'add',
    'file.txt',
    'package.json',
    '.claude-plugin/plugin.json',
    '.codex-plugin/plugin.json',
    'kimi.plugin.json',
  );
  git(source, 'commit', '-m', 'base');
  git(root, 'clone', '--bare', '--local', source, bare);
  repositorySeed = { root, bare };
  return bare;
}

process.on('exit', () => {
  if (repositorySeed) rmSync(repositorySeed.root, { recursive: true, force: true });
});

function createRepository(root: string) {
  const remote = join(root, 'remote.git');
  const repo = join(root, 'repo');
  git(root, 'clone', '--bare', '--local', getRepositorySeed(), remote);
  git(
    root,
    'clone',
    '-c',
    'commit.gpgsign=false',
    '-c',
    'user.name=Release Test',
    '-c',
    'user.email=release@example.com',
    '--local',
    remote,
    repo,
  );
  return { remote, repo };
}

function createReleaseCommit(repo: string) {
  writeFileSync(join(repo, 'file.txt'), 'release\n');
  git(repo, 'commit', '-am', 'release: v2.0.0');
  git(repo, 'tag', 'v2.0.0');
}

function createReleaseRepository(root: string) {
  return createRepository(root);
}

function prepareVersion(repo: string, version: string) {
  const pkg = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8'));
  const plugin = JSON.parse(readFileSync(join(repo, '.claude-plugin', 'plugin.json'), 'utf8'));
  const codexPlugin = JSON.parse(readFileSync(join(repo, '.codex-plugin', 'plugin.json'), 'utf8'));
  writeFileSync(join(repo, 'package.json'), JSON.stringify({ ...pkg, version }));
  writeFileSync(
    join(repo, '.claude-plugin', 'plugin.json'),
    JSON.stringify({ ...plugin, version }),
  );
  writeFileSync(
    join(repo, '.codex-plugin', 'plugin.json'),
    JSON.stringify({ ...codexPlugin, version }),
  );
  writeFileSync(
    join(repo, 'kimi.plugin.json'),
    JSON.stringify({
      ...JSON.parse(readFileSync(join(repo, 'kimi.plugin.json'), 'utf8')),
      version,
    }),
  );
}

async function runTransactionCli(repo: string, version: string, dryRun = false) {
  const registry = Bun.serve({
    port: 0,
    fetch: () => new Response('missing', { status: 404 }),
  });
  try {
    const child = Bun.spawn(
      [
        process.execPath,
        'run',
        join(import.meta.dir, '..', '..', 'scripts', 'release-transaction.ts'),
        '--version',
        version,
        '--expected-base',
        git(repo, 'rev-parse', 'HEAD'),
        '--registry-url',
        registry.url.href,
        ...(dryRun ? ['--dry-run'] : []),
      ],
      { cwd: repo, stdout: 'pipe', stderr: 'pipe' },
    );
    const [exitCode, stdout, stderr] = await Promise.all([
      child.exited,
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ]);
    if (exitCode !== 0) throw new Error(stderr);
    return stdout;
  } finally {
    registry.stop(true);
  }
}

async function runTransaction(repo: string, version: string, dryRun = false, npmCommit?: string) {
  const registry = Bun.serve({
    port: 0,
    fetch: () =>
      npmCommit ? Response.json({ gitHead: npmCommit }) : new Response('missing', { status: 404 }),
  });
  try {
    return await runReleaseTransaction({
      cwd: repo,
      version,
      expectedBase: git(repo, 'rev-parse', 'HEAD'),
      registryUrl: registry.url.href,
      dryRun,
    });
  } finally {
    registry.stop(true);
  }
}

function expectRemoteUnchanged(root: string, remote: string, before: string) {
  expect(git(root, '--git-dir', remote, 'rev-parse', 'main')).toBe(before);
  expect(() => git(root, '--git-dir', remote, 'rev-parse', 'v2.0.0')).toThrow();
}

function expectRemoteRelease(root: string, remote: string, released: string) {
  expect(git(root, '--git-dir', remote, 'rev-parse', 'main')).toBe(released);
  expect(git(root, '--git-dir', remote, 'rev-parse', 'v2.0.0')).toBe(released);
}

async function withPreparedRelease(
  root: string,
  callback: (fixture: { remote: string; repo: string; before: string }) => Promise<void>,
) {
  const { remote, repo } = createReleaseRepository(root);
  prepareVersion(repo, '2.0.0');
  await callback({ remote, repo, before: git(root, '--git-dir', remote, 'rev-parse', 'main') });
}

describe('release git transaction', () => {
  test('requires an exact local and remote release base plus a semantic release tag', async () => {
    await withTempDir('cc-safety-net-release-', async (root) => {
      const { repo } = createRepository(root);
      const base = git(repo, 'rev-parse', 'HEAD');

      await assertExactReleaseBase(repo, base);
      await expect(assertExactReleaseBase(repo, 'main')).rejects.toThrow(
        'Expected base must be a full commit SHA',
      );
      await expect(pushReleaseAtomically(repo, 'latest')).rejects.toThrow('Invalid release tag');

      writeFileSync(join(repo, 'file.txt'), 'local advance\n');
      git(repo, 'commit', '-am', 'local advance');
      await expect(assertExactReleaseBase(repo, base)).rejects.toThrow('Release base mismatch');
    });
  });

  test('pushes a new release branch and tag atomically', async () => {
    await withTempDir('cc-safety-net-release-', async (root) => {
      const { remote, repo } = createRepository(root);
      createReleaseCommit(repo);

      await pushReleaseAtomically(repo, 'v2.0.0');

      expect(git(root, '--git-dir', remote, 'rev-parse', 'main')).toBe(
        git(root, '--git-dir', remote, 'rev-parse', 'v2.0.0'),
      );
    });
  });

  test('rejects an advanced remote without moving branch or tag', async () => {
    await withTempDir('cc-safety-net-release-', async (root) => {
      const { remote, repo } = createRepository(root);
      const other = join(root, 'other');
      git(
        root,
        'clone',
        '-c',
        'user.name=Other',
        '-c',
        'user.email=other@example.com',
        remote,
        other,
      );
      writeFileSync(join(other, 'other.txt'), 'advanced\n');
      git(other, 'add', 'other.txt');
      git(other, 'commit', '-m', 'advance');
      git(other, 'push', 'origin', 'HEAD:main');
      createReleaseCommit(repo);

      await expect(assertRemoteMain(repo)).rejects.toThrow('origin/main advanced');
      expect(() => git(root, '--git-dir', remote, 'rev-parse', 'v2.0.0')).toThrow();
    });
  });

  test('resumes the same tag and rejects a different target atomically', async () => {
    await withTempDir('cc-safety-net-release-', async (root) => {
      const { remote, repo } = createRepository(root);
      createReleaseCommit(repo);
      await pushReleaseAtomically(repo, 'v2.0.0');
      await pushReleaseAtomically(repo, 'v2.0.0');
      const released = git(root, '--git-dir', remote, 'rev-parse', 'main');

      writeFileSync(join(repo, 'file.txt'), 'different\n');
      git(repo, 'commit', '-am', 'different target');
      git(repo, 'tag', '--force', 'v2.0.0');
      await expect(pushReleaseAtomically(repo, 'v2.0.0')).rejects.toThrow();
      expectRemoteRelease(root, remote, released);
    });
  });

  test('the production CLI performs the tested non-dry atomic transaction', async () => {
    await withTempDir('cc-safety-net-release-', async (root) => {
      const { remote, repo } = createReleaseRepository(root);
      prepareVersion(repo, '2.0.0');

      expect(await runTransactionCli(repo, '2.0.0')).toContain('"kind":"prepared"');
      expect(git(root, '--git-dir', remote, 'rev-parse', 'main')).toBe(
        git(root, '--git-dir', remote, 'rev-parse', 'v2.0.0'),
      );
      expect(await runTransactionCli(repo, '2.0.0')).toContain('"kind":"resume"');
    });
  });

  test('the production CLI dry-run executes the same checks without mutation', async () => {
    await withTempDir('cc-safety-net-release-', async (root) => {
      await withPreparedRelease(root, async ({ remote, repo, before }) => {
        expect(await runTransactionCli(repo, '2.0.0', true)).toContain('"kind":"prepare"');
        expectRemoteUnchanged(root, remote, before);
      });
    });
  });

  test('the production CLI rejects a missing or mismatched kimi manifest', async () => {
    await withTempDir('cc-safety-net-release-', async (root) => {
      await withPreparedRelease(root, async ({ remote, repo, before }) => {
        writeFileSync(join(repo, 'kimi.plugin.json'), JSON.stringify({ version: '1.0.0' }));
        await expect(runTransaction(repo, '2.0.0')).rejects.toThrow(
          'Prepared manifests must all contain 2.0.0',
        );

        rmSync(join(repo, 'kimi.plugin.json'));
        await expect(runTransaction(repo, '2.0.0')).rejects.toThrow('kimi.plugin.json');
        expectRemoteUnchanged(root, remote, before);
      });
    });
  });

  test('the production CLI rejects a missing or mismatched Codex manifest', async () => {
    await withTempDir('cc-safety-net-release-', async (root) => {
      await withPreparedRelease(root, async ({ remote, repo, before }) => {
        writeFileSync(
          join(repo, '.codex-plugin', 'plugin.json'),
          JSON.stringify({ version: '1.0.0' }),
        );
        await expect(runTransactionCli(repo, '2.0.0')).rejects.toThrow(
          'Prepared manifests must all contain 2.0.0',
        );

        rmSync(join(repo, '.codex-plugin', 'plugin.json'));
        await expect(runTransactionCli(repo, '2.0.0')).rejects.toThrow(
          join('.codex-plugin', 'plugin.json'),
        );
        expectRemoteUnchanged(root, remote, before);
      });
    });
  });

  test('the production CLI rejects an npm collision before Git mutation', async () => {
    await withTempDir('cc-safety-net-release-', async (root) => {
      await withPreparedRelease(root, async ({ remote, repo, before }) => {
        await expect(
          runTransaction(repo, '2.0.0', false, '0123456789abcdef0123456789abcdef01234567'),
        ).rejects.toThrow('npm version already exists');
        expectRemoteUnchanged(root, remote, before);
      });
    });
  });

  test('rejects unrelated worktree changes before release mutation', async () => {
    await withTempDir('cc-safety-net-release-', async (root) => {
      await withPreparedRelease(root, async ({ remote, repo, before }) => {
        writeFileSync(join(repo, 'notes.txt'), 'not part of the release\n');

        await expect(runTransaction(repo, '2.0.0')).rejects.toThrow(
          'Unexpected release changes: notes.txt',
        );
        expectRemoteUnchanged(root, remote, before);
        expect(git(repo, 'status', '--short')).toContain('?? notes.txt');
      });
    });
  });

  test('requires a clean worktree when resuming an immutable release', async () => {
    await withTempDir('cc-safety-net-release-', async (root) => {
      const { remote, repo } = createReleaseRepository(root);
      prepareVersion(repo, '2.0.0');
      await runTransaction(repo, '2.0.0');
      const released = git(repo, 'rev-parse', 'HEAD');
      writeFileSync(
        join(repo, 'package.json'),
        `${JSON.stringify(JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8')), null, 2)}\n`,
      );

      await expect(runTransaction(repo, '2.0.0')).rejects.toThrow(
        'A resumed release must have a clean worktree',
      );
      expect(git(repo, 'rev-parse', 'HEAD')).toBe(released);
      expectRemoteRelease(root, remote, released);
    });
  });

  test('the production CLI rejects an advanced remote before local or remote mutation', async () => {
    await withTempDir('cc-safety-net-release-', async (root) => {
      await withPreparedRelease(root, async ({ remote, repo }) => {
        const before = git(repo, 'rev-parse', 'HEAD');
        const other = join(root, 'other-cli');
        git(
          root,
          'clone',
          '-c',
          'user.name=Other',
          '-c',
          'user.email=other@example.com',
          remote,
          other,
        );
        writeFileSync(join(other, 'advanced.txt'), 'advanced\n');
        git(other, 'add', 'advanced.txt');
        git(other, 'commit', '-m', 'advance remote');
        git(other, 'push', 'origin', 'HEAD:main');
        const advanced = git(root, '--git-dir', remote, 'rev-parse', 'main');

        await expect(runTransaction(repo, '2.0.0')).rejects.toThrow('Release base mismatch');
        expect(git(repo, 'rev-parse', 'HEAD')).toBe(before);
        expect(git(root, '--git-dir', remote, 'rev-parse', 'main')).toBe(advanced);
        expect(() => git(repo, 'rev-parse', 'v2.0.0')).toThrow();
      });
    });
  });

  test('the production CLI rejects a conflicting immutable tag without moving it', async () => {
    await withTempDir('cc-safety-net-release-', async (root) => {
      await withPreparedRelease(root, async ({ remote, repo, before }) => {
        git(repo, 'tag', 'v2.0.0');
        git(repo, 'push', 'origin', 'v2.0.0');

        await expect(runTransaction(repo, '2.0.0')).rejects.toThrow('different version state');
        expect(git(repo, 'rev-parse', 'HEAD')).toBe(before);
        expect(git(repo, 'rev-parse', 'v2.0.0')).toBe(before);
        expect(git(root, '--git-dir', remote, 'rev-parse', 'main')).toBe(before);
        expect(git(root, '--git-dir', remote, 'rev-parse', 'v2.0.0')).toBe(before);
      });
    });
  });
});
