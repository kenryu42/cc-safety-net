import { describe, expect, test } from 'bun:test';
import { tmpdir } from 'node:os';
import { join, parse, sep } from 'node:path';
import { analyzeCommandWithProgram } from '@/analyzer';
import {
  isTmpdirOverriddenToNonTemp as isTmpdirOverriddenWithEnvironment,
  isTrustedTempPath,
  isTrustedTempRootPath,
} from '@/analyzer/tmpdir';
import type { EnvironmentContext } from '@/ir/analysis';
import { toShellPath } from '../helpers';
import { TEST_ENVIRONMENT } from '../helpers/environment';
import { policySnapshot, testModes } from '../helpers/policy';

const isTmpdirOverriddenToNonTemp = (envAssignments: ReadonlyMap<string, string>) =>
  isTmpdirOverriddenWithEnvironment(envAssignments, TEST_ENVIRONMENT);

const STUB_ROOT = parse(tmpdir()).root;
const STUB_TMPDIR = join(STUB_ROOT, 'tmp');
const STUB_WORKDIR = join(STUB_ROOT, 'work');

/**
 * A filesystem that exists only in this test: the listed symlinks over the temp roots
 * and the working directory the analyzer case below runs in.
 */
function stubEnvironment(symlinks: Record<string, string>): EnvironmentContext {
  const present = [
    STUB_TMPDIR,
    join(STUB_ROOT, 'var', 'tmp'),
    join(STUB_ROOT, 'private', 'tmp'),
    join(STUB_ROOT, 'private', 'var', 'tmp'),
    STUB_WORKDIR,
  ];
  return {
    ...TEST_ENVIRONMENT,
    tmpdir: STUB_TMPDIR,
    paths: {
      entryKind: (path) =>
        path in symlinks ? 'symlink' : present.includes(path) ? 'present' : 'missing',
      realpath: (path) => symlinks[path] ?? (present.includes(path) ? path : null),
    },
  };
}

function evaluateInFreshProcess(
  assignedTmpdir: string,
  options: {
    environment?: Record<string, string>;
    platform?: NodeJS.Platform;
  } = {},
): boolean {
  const result = Bun.spawnSync(
    [
      process.execPath,
      '-e',
      `${options.platform ? `Object.defineProperty(process, 'platform', { value: ${JSON.stringify(options.platform)} });` : ''}
const { isTmpdirOverriddenToNonTemp } = await import(${JSON.stringify(join(process.cwd(), 'src/analyzer/tmpdir.ts'))});
const { createProcessEnvironment } = await import(${JSON.stringify(join(process.cwd(), 'src/ir/environment.ts'))});
process.stdout.write(String(isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', process.env.TMPDIR ?? '']]), createProcessEnvironment())));`,
    ],
    {
      env: { ...process.env, TMPDIR: assignedTmpdir, ...options.environment },
      stderr: 'pipe',
      stdout: 'pipe',
    },
  );
  expect(result.exitCode).toBe(0);
  expect(result.stderr.toString()).toBe('');
  return result.stdout.toString() === 'true';
}

describe('isTmpdirOverriddenToNonTemp', () => {
  test('allows when TMPDIR is not assigned', () => {
    expect(isTmpdirOverriddenToNonTemp(new Map())).toBe(false);
  });

  test('allows known temp subpaths', () => {
    expect(isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', '/tmp/subdir']]))).toBe(false);
    expect(isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', '/var/tmp/subdir']]))).toBe(false);
  });

  test('blocks values that cannot be resolved safely', () => {
    expect(isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', '\0']]))).toBe(true);
  });

  test('blocks traversal that escapes /tmp', () => {
    expect(isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', '/tmp/../root']]))).toBe(true);
  });

  test('blocks traversal that escapes /var/tmp', () => {
    expect(isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', '/var/tmp/../root']]))).toBe(true);
  });

  test('blocks traversal that escapes the system tmpdir', () => {
    const systemTmpdir = tmpdir();
    const escapedTmpdir = systemTmpdir.endsWith(sep)
      ? `${systemTmpdir}..${sep}escape`
      : `${systemTmpdir}${sep}..${sep}escape`;

    expect(isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', escapedTmpdir]]))).toBe(true);
  });

  test('resolves symlinks through the injected path resolver, not the real filesystem', () => {
    const escaped = join(STUB_TMPDIR, 'escape');
    const outside = join(STUB_ROOT, 'root', 'escape');
    const environment = stubEnvironment({ [escaped]: outside });

    expect(isTmpdirOverriddenWithEnvironment(new Map([['TMPDIR', escaped]]), environment)).toBe(
      true,
    );
    expect(
      isTmpdirOverriddenWithEnvironment(
        new Map([['TMPDIR', join(STUB_TMPDIR, 'plain')]]),
        environment,
      ),
    ).toBe(false);
  });

  test('does not trust a hostile process-start TMPDIR', () => {
    expect(evaluateInFreshProcess('/Users')).toBe(true);
  });

  test.each([
    '/tmp',
    '/var/tmp',
    '/private/tmp',
    '/private/var/tmp',
  ])('trusts canonical system temp root %s in a fresh process', (root) => {
    expect(evaluateInFreshProcess(root)).toBe(false);
  });

  test.skipIf(process.platform !== 'darwin')(
    'trusts only the canonical macOS per-user temporary directory shape on Darwin',
    () => {
      expect(evaluateInFreshProcess('/var/folders/ab/cdef123456/T')).toBe(false);
      expect(evaluateInFreshProcess('/var/folders/ab/cdef123456/not-T')).toBe(true);
    },
  );

  test('does not trust the macOS per-user temporary directory shape outside Darwin', () => {
    expect(
      evaluateInFreshProcess('/var/folders/ab/cdef123456/T', {
        ...(process.platform === 'darwin' ? { platform: 'linux' } : {}),
      }),
    ).toBe(true);
  });

  test.skipIf(process.platform !== 'win32')(
    '[windows] trusts the captured native Windows temp root but not a separate hostile TMPDIR assignment',
    () => {
      const nativeTmpdir = tmpdir();
      const environment = { TEMP: nativeTmpdir, TMP: nativeTmpdir };

      expect(evaluateInFreshProcess(nativeTmpdir, { environment })).toBe(false);
      expect(evaluateInFreshProcess('/Users', { environment })).toBe(true);
    },
  );

  test.skipIf(process.platform !== 'win32')(
    '[windows] compares native Windows temp paths case-insensitively',
    () => {
      const differentlyCasedTmpdir = tmpdir().replace(
        /^([A-Za-z]):/,
        (_, drive: string) =>
          `${drive === drive.toLowerCase() ? drive.toUpperCase() : drive.toLowerCase()}:`,
      );

      expect(isTrustedTempRootPath(differentlyCasedTmpdir, TEST_ENVIRONMENT)).toBe(true);
      expect(
        isTrustedTempPath(join(differentlyCasedTmpdir, 'claude', 'scratchpad'), TEST_ENVIRONMENT),
      ).toBe(true);
    },
  );
});

describe('analysis over an injected filesystem', () => {
  test('classifies a temp target from the injected resolver, not the real filesystem', () => {
    const analyze = (environment: EnvironmentContext) =>
      analyzeCommandWithProgram(`rm -rf ${toShellPath(join(STUB_TMPDIR, 'escape'))}`, {
        cwd: STUB_WORKDIR,
        policySnapshot: policySnapshot(),
        environment,
        effectiveCapabilities: testModes().capabilities,
        protectedGitMetadata: null,
      });

    // Without the synthetic symlink, the target stays within the injected temp root.
    expect(analyze(stubEnvironment({}))).toBeNull();
    expect(
      analyze(
        stubEnvironment({
          [join(STUB_TMPDIR, 'escape')]: join(STUB_ROOT, 'root', 'escape'),
        }),
      ),
    ).toMatchObject({
      kind: 'deny',
      ruleId: 'rm.recursive-force-outside-cwd',
    });
  });
});
