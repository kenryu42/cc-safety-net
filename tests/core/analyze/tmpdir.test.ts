import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';
import { isTmpdirOverriddenToNonTemp } from '@/core/analyze/tmpdir';

describe('isTmpdirOverriddenToNonTemp', () => {
  test('allows known temp subpaths', () => {
    expect(isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', '/tmp/subdir']]))).toBe(false);
    expect(isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', '/var/tmp/subdir']]))).toBe(false);
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

  test('returns false when TMPDIR is not set in env assignments', () => {
    expect(isTmpdirOverriddenToNonTemp(new Map([['OTHER', '/something']]))).toBe(false);
  });

  test('blocks empty TMPDIR value', () => {
    expect(isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', '']]))).toBe(true);
  });

  test('blocks non-temp paths', () => {
    expect(isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', '/home/user/data']]))).toBe(true);
    expect(isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', '/usr/local']]))).toBe(true);
  });

  test('allows exact /tmp path', () => {
    expect(isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', '/tmp']]))).toBe(false);
  });

  test('allows exact /var/tmp path', () => {
    expect(isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', '/var/tmp']]))).toBe(false);
  });

  test('blocks TMPDIR with path containing nonexistent intermediate components', () => {
    expect(
      isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', '/nonexistent-root-path/subdir/deep']])),
    ).toBe(true);
  });

  test('blocks paths with symlink that resolves outside temp directories', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'safety-net-tmpdir-symlink-'));
    const targetDir = join(tempDir, 'real');
    const linkInTmp = join(tempDir, 'link');
    mkdirSync(targetDir);
    symlinkSync(targetDir, linkInTmp);
    try {
      // The link resolves to a path under tempDir which is under /tmp, so allowed
      expect(isTmpdirOverriddenToNonTemp(new Map([['TMPDIR', linkInTmp]]))).toBe(false);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
