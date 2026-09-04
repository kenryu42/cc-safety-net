import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getActivityFeed } from '@/gui/activity';
import { mockReadFileError, writeJsonlFixture } from '../../helpers';
import { writeDeniedLogFixture } from '../../helpers/denied-log-fixture';
import { captureLogsCommand } from '../../helpers/logs';

async function withUnreadableFixture<T>(fn: (logsDir: string) => T | Promise<T>): Promise<T> {
  const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-incomplete-'));
  const logsDir = join(root, 'logs');
  const unreadable = join(logsDir, 'unreadable.jsonl');
  mkdirSync(logsDir, { recursive: true });
  writeJsonlFixture(unreadable, [
    {
      id: '3333333333333333',
      ts: new Date().toISOString(),
      decision: 'deny',
      command: 'hidden blocked',
      segment: 'hidden blocked',
      reason: 'blocked',
    },
  ]);
  const spy = mockReadFileError(unreadable);
  try {
    return await fn(logsDir);
  } finally {
    spy.mockRestore();
    rmSync(root, { recursive: true, force: true });
  }
}

describe('logs incomplete audit reads', () => {
  test('warns on stderr when every audit file is unreadable, with valid JSON on stdout', async () => {
    const result = await withUnreadableFixture((logsDir) =>
      captureLogsCommand(['--json'], logsDir),
    );

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual([]);
    expect(result.stderr).toContain('incomplete');
  });

  test('warns on stderr when an id lookup misses inside an unreadable file', async () => {
    const result = await withUnreadableFixture((logsDir) =>
      captureLogsCommand(['--id', '3333333333333333'], logsDir),
    );

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('No retained audit log entry found');
    expect(result.stderr).toContain('incomplete');
  });

  test('warns once when a malformed record is skipped', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-malformed-'));
    const logsDir = join(root, 'logs');
    try {
      mkdirSync(logsDir, { recursive: true });
      writeFileSync(
        join(logsDir, 'mixed.jsonl'),
        `${JSON.stringify({
          ts: new Date().toISOString(),
          decision: 'deny',
          command: 'visible blocked',
          segment: 'visible blocked',
          reason: 'blocked',
        })}\n{"broken\n`,
      );

      const result = await captureLogsCommand([], logsDir);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('visible blocked');
      expect(result.stderr.split('\n').filter(Boolean)).toHaveLength(1);
      expect(result.stderr).toContain('incomplete');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('stays silent when every audit source is readable', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-complete-'));
    const logsDir = join(root, 'logs');
    try {
      mkdirSync(logsDir, { recursive: true });
      writeDeniedLogFixture(join(logsDir, 'readable.jsonl'), 'visible blocked');

      const result = await captureLogsCommand([], logsDir);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe('');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('stays silent on a fresh install, where no logs directory exists yet', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-fresh-'));
    try {
      // A directory that was never created is an empty history, not an unreadable one.
      const result = await captureLogsCommand([], join(root, 'logs'));

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('No audit log entries found');
      expect(result.stderr).toBe('');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('the GUI activity feed reports how many sources it could not read', async () => {
    const feed = await withUnreadableFixture((logsDir) => getActivityFeed(7, logsDir));

    expect(feed.unreadable).toBe(1);
  });
});
