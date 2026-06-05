import { describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import {
  withLinkedWorktreeFixture,
  withReadonlyLinkedWorktreeFixture,
  withTempDir,
} from './helpers.ts';

describe('test helpers', () => {
  test('withTempDir waits for async callbacks before cleanup', async () => {
    let tempDir = '';

    await withTempDir('safety-net-helper-', async (dir) => {
      tempDir = dir;
      await Promise.resolve();
      expect(existsSync(dir)).toBe(true);
    });

    expect(existsSync(tempDir)).toBe(false);
  });

  test('withLinkedWorktreeFixture waits for async callbacks before cleanup', async () => {
    let rootDir = '';

    await withLinkedWorktreeFixture(async (fixture) => {
      rootDir = fixture.rootDir;
      await Promise.resolve();
      expect(existsSync(fixture.rootDir)).toBe(true);
    });

    expect(existsSync(rootDir)).toBe(false);
  });

  test('withReadonlyLinkedWorktreeFixture reuses a live fixture', async () => {
    let firstRoot = '';
    let secondRoot = '';

    await withReadonlyLinkedWorktreeFixture(async (fixture) => {
      firstRoot = fixture.rootDir;
      await Promise.resolve();
      expect(existsSync(fixture.rootDir)).toBe(true);
    });
    await withReadonlyLinkedWorktreeFixture((fixture) => {
      secondRoot = fixture.rootDir;
      expect(existsSync(fixture.rootDir)).toBe(true);
    });

    expect(secondRoot).toBe(firstRoot);
    expect(existsSync(firstRoot)).toBe(true);
  });
});
