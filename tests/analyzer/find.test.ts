import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { isTrustedTempRootPath } from '@/analyzer/tmpdir';
import { TEST_ENVIRONMENT, testEnvironment } from '../helpers/environment.ts';
import { analyzeTestCommand } from '../helpers/policy.ts';
import { assertAllowed, assertBlocked, quoteShellPath } from '../helpers.ts';

describe('find -delete tests', () => {
  test('find delete blocked', () => {
    assertBlocked('find . -name "*.pyc" -delete', 'find -delete');
  });

  test('find empty delete blocked', () => {
    assertBlocked('find . -empty -delete', 'find -delete');
  });

  test('find delete allows explicit trusted temporary descendants', () => {
    assertAllowed('find /tmp/ccsn-perf-head.1T5B58 -depth -delete');
    assertAllowed('find /var/tmp/ccsn-cache -name "*.tmp" -delete');
    assertAllowed(`find ${quoteShellPath(join(tmpdir(), 'ccsn-native'))} -depth -delete`);
    assertAllowed('find /tmp/ccsn-a /var/tmp/ccsn-b -depth -delete');
  });

  test('find delete allows trusted TMPDIR descendants', () => {
    const environment = testEnvironment({ TMPDIR: '/tmp/ccsn-find-root' });
    assertAllowed('find $TMPDIR/child -depth -delete', undefined, environment);
    assertAllowed('find "$TMPDIR/child" -depth -delete', undefined, environment);
  });

  test('find delete allows trusted temporary descendants in strict mode', () => {
    expect(analyzeTestCommand('find /tmp/ccsn-strict -depth -delete', { strict: true })).toBeNull();
  });

  test('find delete allows targets inside configured allow paths', () => {
    const config = { destructiveCommandAllowPaths: ['/some/allowed'] };
    expect(analyzeTestCommand('find /some/allowed -depth -delete', { config })).toBeNull();
    expect(analyzeTestCommand('find /some/allowed/sub -delete', { config })).toBeNull();
    expect(analyzeTestCommand('find /some/allowed-evil -delete', { config })?.reason).toContain(
      'find -delete',
    );
    assertBlocked('find /some/allowed -depth -delete', 'find -delete');
  });

  test('find delete allows allow-path targets in strict and paranoid mode', () => {
    const config = { destructiveCommandAllowPaths: ['/some/allowed'] };
    expect(
      analyzeTestCommand('find /some/allowed/dir -depth -delete', { strict: true, config }),
    ).toBeNull();
    expect(
      analyzeTestCommand('find /some/allowed/dir -depth -delete', {
        strict: true,
        paranoidRm: true,
        config,
      }),
    ).toBeNull();
  });

  test('find delete blocks symlink-following modes even under allow paths', () => {
    const config = { destructiveCommandAllowPaths: ['/some/allowed'] };
    expect(analyzeTestCommand('find -L /some/allowed -delete', { config })?.reason).toContain(
      'find -delete',
    );
    expect(analyzeTestCommand('find /some/allowed -follow -delete', { config })?.reason).toContain(
      'find -delete',
    );
    expect(analyzeTestCommand('find -f /some/allowed -delete', { config })?.reason).toContain(
      'find -delete',
    );
  });

  test('find delete protects trusted temporary roots', () => {
    assertBlocked('find /tmp -depth -delete', 'find -delete');
    assertBlocked('find /var/tmp/ -depth -delete', 'find -delete');
    // A nested TMPDIR (e.g. an isolated test home under /tmp) is a trusted temp
    // descendant, not a root, so the system-tmpdir assertion only holds when the
    // real tmpdir is itself a recognized root.
    if (isTrustedTempRootPath(tmpdir(), TEST_ENVIRONMENT)) {
      assertBlocked(`find ${quoteShellPath(tmpdir())} -depth -delete`, 'find -delete');
    }
    const environment = testEnvironment({ TMPDIR: '/tmp/ccsn-find-root' });
    assertBlocked('find $TMPDIR -depth -delete', 'find -delete', undefined, environment);
    assertBlocked('find "$TMPDIR/." -depth -delete', 'find -delete', undefined, environment);
    assertBlocked('find "${TMPDIR}//" -depth -delete', 'find -delete', undefined, environment);
  });

  test('find delete blocks missing relative mixed and dynamic starting paths', () => {
    assertBlocked('find -delete', 'find -delete');
    assertBlocked('find . -delete', 'find -delete', '/tmp/ccsn-find-root');
    assertBlocked('find /tmp/ccsn-safe /Users -delete', 'find -delete');
    assertBlocked('find /tmp/ccsn-safe/../other -delete', 'find -delete');
    assertBlocked('find /tmp/ccsn-* -delete', 'find -delete');
    assertBlocked('find $OTHER_TMP/child -delete', 'find -delete');
    assertBlocked('find "$(printf /tmp/ccsn-safe)" -delete', 'find -delete');
    assertBlocked('find -f /tmp/ccsn-safe -delete', 'find -delete');
  });

  test('find delete blocks unsafe TMPDIR expansion', () => {
    assertBlocked(
      'find "$TMPDIR/child" -delete',
      'find -delete',
      undefined,
      testEnvironment({ TMPDIR: '' }),
    );
    assertBlocked(
      'find "$TMPDIR/child" -delete',
      'find -delete',
      undefined,
      testEnvironment({ TMPDIR: '/Users' }),
    );
    const splitting = testEnvironment({ IFS: ':', TMPDIR: '/tmp/ccsn-find-root' });
    assertBlocked('find $TMPDIR/child -delete', 'find -delete', undefined, splitting);
    assertAllowed('find "$TMPDIR/child" -delete', undefined, splitting);
  });

  test('find delete blocks traversal through followed symlinks', () => {
    const root = mkdtempSync(join(tmpdir(), 'ccsn-find-delete-'));
    const external = join(root, 'external');
    symlinkSync(homedir(), external, 'dir');
    try {
      assertBlocked(`find ${quoteShellPath(external)} -delete`, 'extremely dangerous');
      assertBlocked(`find -L ${quoteShellPath(root)} -delete`, 'find -delete');
      assertBlocked(`find ${quoteShellPath(root)} -follow -delete`, 'find -delete');
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  test('find delete protects original and effective workspaces under temporary targets', () => {
    const root = mkdtempSync(join(tmpdir(), 'ccsn-find-workspace-'));
    const repo = join(root, 'repo');
    const other = mkdtempSync(join(tmpdir(), 'ccsn-find-other-'));
    mkdirSync(repo);
    try {
      assertBlocked(`find ${quoteShellPath(root)} -depth -delete`, 'find -delete', repo);
      assertBlocked(`find ${quoteShellPath(repo)} -depth -delete`, 'find -delete', repo);
      assertAllowed(`find ${quoteShellPath(other)} -depth -delete`, repo);
      assertBlocked(
        `find "$TMPDIR/${basename(root)}" -depth -delete`,
        'find -delete',
        repo,
        testEnvironment({ TMPDIR: tmpdir() }),
      );
      assertBlocked(
        `env -C ${quoteShellPath(repo)} find ${quoteShellPath(root)} -depth -delete`,
        'find -delete',
        other,
      );
      assertBlocked(
        `env -C ${quoteShellPath(other)} find ${quoteShellPath(root)} -depth -delete`,
        'find -delete',
        repo,
      );
    } finally {
      rmSync(root, { force: true, recursive: true });
      rmSync(other, { force: true, recursive: true });
    }
  });

  test('find delete exemption preserves nested and dynamic command protection', () => {
    assertAllowed("bash -c 'find /tmp/ccsn-safe -depth -delete'");
    assertBlocked('find /tmp/ccsn-safe -delete -exec git reset --hard \\;', 'git reset --hard');
    assertBlocked(
      "printf '/tmp/ccsn-other\\n' | xargs find /tmp/ccsn-safe -delete",
      'xargs dynamic input',
    );
    assertBlocked('parallel find /tmp/ccsn-safe -delete', 'dynamic input');
  });

  test('find delete exemption preserves custom and disabled rules', () => {
    expect(
      analyzeTestCommand('find /tmp/ccsn-safe -delete', {
        config: {
          rules: [
            {
              name: 'block-find-delete',
              command: 'find',
              block_args: ['-delete'],
              reason: 'Custom find cleanup policy.',
            },
          ],
        },
      }),
    ).toMatchObject({ ruleId: 'custom.block-find-delete' });
    expect(
      analyzeTestCommand('find /Users -delete', {
        config: { destructiveCommandRuleOverrides: { 'find.delete': 'off' } },
      }),
    ).toBeNull();
  });

  test('find name argument delete allowed', () => {
    assertAllowed('find . -name -delete -print');
  });

  test('find numeric and file reference predicate arguments named delete allowed', () => {
    assertAllowed('find . -gid -delete -print');
    assertAllowed('find . -inum -delete -print');
    assertAllowed('find . -samefile -delete -print');
  });

  test('find exec echo delete allowed', () => {
    assertAllowed('find . -exec echo -delete \\; -print');
  });

  test('find exec plus terminator mentions delete allowed', () => {
    assertAllowed('find . -exec echo -delete + -print');
  });

  test('busybox find delete blocked', () => {
    assertBlocked('busybox find . -name "*.pyc" -delete', 'find -delete');
  });

  test('busybox find delete allows trusted temporary descendants', () => {
    assertAllowed('busybox find /tmp/ccsn-busybox -depth -delete');
  });

  test('find print allowed', () => {
    assertAllowed('find . -name "*.pyc" -print');
  });

  test('echo mentions find delete allowed', () => {
    assertAllowed('echo "find . -name *.pyc -delete"');
  });

  test('rg mentions find delete allowed', () => {
    assertAllowed('rg "find .* -delete" file.txt');
  });

  test('python c system find delete blocked', () => {
    assertBlocked(
      'python -c "import os; os.system(\\"find . -delete\\")"',
      'Interpreter code contains a dangerous command',
    );
  });
});

describe('find -exec rm tests', () => {
  test('find exec rm rf blocked', () => {
    assertBlocked('find . -exec rm -rf {} \\;', 'rm -rf');
  });

  test('find root exec rm rf placeholder blocked with cwd', () => {
    assertBlocked('find / -exec rm -rf {} +', 'rm -rf', '/tmp');
  });

  test('find execdir rm rf blocked', () => {
    assertBlocked('find /tmp -execdir rm -rf {} +', 'rm -rf');
  });

  test('find exec rm r force blocked', () => {
    assertBlocked("find . -name '*.tmp' -exec rm -r --force {} \\;", 'rm -rf');
  });

  test('find exec rm recursive blocked', () => {
    assertBlocked('find . -exec rm --recursive -f {} \\;', 'rm -rf');
  });

  test('find exec rm no force allowed', () => {
    assertAllowed('find . -exec rm -r {} \\;');
  });

  test('find exec rm no recursive allowed', () => {
    assertAllowed('find . -exec rm -f {} \\;');
  });

  test('find exec echo allowed', () => {
    assertAllowed('find . -exec echo {} \\;');
  });

  test('find exec cat allowed', () => {
    assertAllowed('find . -type f -exec cat {} +');
  });

  test('busybox find exec rm rf blocked', () => {
    assertBlocked('busybox find . -exec rm -rf {} \\;', 'rm -rf');
  });

  test('find exec rm rf in bash c blocked', () => {
    assertBlocked("bash -c 'find . -exec rm -rf {} \\;'", 'rm -rf');
  });

  test('find exec env rm rf blocked', () => {
    assertBlocked('find . -exec env rm -rf {} ;', 'rm -rf');
  });

  test('find exec env rm rf plus terminator blocked', () => {
    assertBlocked('find / -exec env rm -rf {} +', 'rm -rf', '/tmp');
  });

  test('find exec sudo rm rf blocked', () => {
    assertBlocked('find . -exec sudo rm -rf {} ;', 'rm -rf');
  });

  test('find exec command rm rf blocked', () => {
    assertBlocked('find . -exec command rm -rf {} ;', 'rm -rf');
  });

  test('find exec busybox rm rf blocked', () => {
    assertBlocked('find . -exec busybox rm -rf {} ;', 'rm -rf');
  });

  test('find exec git reset hard blocked', () => {
    assertBlocked('find . -exec git reset --hard ;', 'git reset --hard');
  });

  test('find exec shell git reset hard blocked', () => {
    assertBlocked("find . -exec sh -c 'git reset --hard' ;", 'git reset --hard');
  });

  test('find execdir env rm rf blocked', () => {
    assertBlocked('find /tmp -execdir env rm -rf {} +', 'rm -rf');
  });

  test('find execdir rm rf relative target blocked even when parent cwd is known', () => {
    assertBlocked('find . -execdir rm -rf build +', 'rm -rf', '/tmp');
  });
});
