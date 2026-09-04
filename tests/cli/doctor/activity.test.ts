/**
 * Tests for the doctor command activity functions.
 */

import { describe, expect, test } from 'bun:test';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getActivitySummary } from '@/cli/doctor/activity';
import { writeAuditLog } from '@/engine/audit';
import {
  mockReaddirError,
  mockReadFileError,
  withEnv,
  writeJsonlFixture,
  writeNestedAuditLogFixture,
} from '../../helpers';

function createLogsDir(): string {
  const logsDir = join(tmpdir(), `doctor-logs-${Date.now()}`);
  mkdirSync(logsDir, { recursive: true });
  return logsDir;
}

function expectActivityCounts(logsDir: string, totalBlocked: number, sessionCount: number): void {
  const activity = getActivitySummary(7, logsDir);
  expect(activity.totalBlocked).toBe(totalBlocked);
  expect(activity.sessionCount).toBe(sessionCount);
}

describe('getActivitySummary', () => {
  test('reads default logs from the configured audit home', () => {
    const root = join(tmpdir(), `doctor-audit-home-${Date.now()}`);
    const auditHome = join(root, 'audit-home');

    try {
      withEnv({ CC_SAFETY_NET_AUDIT_HOME: auditHome }, () => {
        writeAuditLog(
          'doctor-configured-home-session',
          'git reset --hard',
          'git reset --hard',
          'blocked',
          root,
        );

        const activity = getActivitySummary(7);
        expect(activity.totalBlocked).toBe(1);
        expect(activity.sessionCount).toBe(1);
        expect(activity.recentEntries[0]?.command).toBe('git reset --hard');
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('returns empty result when logs directory does not exist', () => {
    const nonExistentDir = join(tmpdir(), `non-existent-${Date.now()}`);
    const activity = getActivitySummary(7, nonExistentDir);

    expect(activity.totalBlocked).toBe(0);
    expect(activity.sessionCount).toBe(0);
    expect(activity.recentEntries).toEqual([]);
    // A history that was never written is empty, not incomplete.
    expect(activity.unreadable).toBe(0);
  });

  test('counts audit sources it could not read', () => {
    const logsDir = createLogsDir();
    const unreadable = join(logsDir, 'unreadable.jsonl');
    writeFileSync(
      unreadable,
      `${JSON.stringify({
        ts: new Date().toISOString(),
        command: 'git reset --hard',
        reason: 'Blocked by safety net',
      })}\n`,
    );
    writeFileSync(join(logsDir, 'malformed.jsonl'), '{"broken\n');
    const spy = mockReadFileError(unreadable);

    try {
      const activity = getActivitySummary(7, logsDir);

      expect(activity.totalBlocked).toBe(0);
      expect(activity.unreadable).toBe(2);
    } finally {
      spy.mockRestore();
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('reads and parses log files from directory', () => {
    const logsDir = createLogsDir();

    const now = new Date();
    const entry1 = {
      ts: now.toISOString(),
      command: 'git reset --hard',
      reason: 'Blocked by safety net',
    };
    const entry2 = {
      ts: new Date(now.getTime() - 1000).toISOString(),
      command: 'rm -rf /',
      reason: 'Dangerous command',
    };

    writeFileSync(join(logsDir, 'session1.jsonl'), `${JSON.stringify(entry1)}\n`);
    writeFileSync(join(logsDir, 'session2.jsonl'), `${JSON.stringify(entry2)}\n`);

    try {
      const activity = getActivitySummary(7, logsDir);

      expect(activity.totalBlocked).toBe(2);
      expect(activity.sessionCount).toBe(2);
      expect(activity.recentEntries.length).toBe(2);
      expect(activity.recentEntries[0]?.command).toBe('git reset --hard');
      expect(activity.recentEntries[1]?.command).toBe('rm -rf /');
      expect(activity.newestEntry).toBe(entry1.ts);
      expect(activity.oldestEntry).toBe(entry2.ts);
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('reads nested project/month log files', () => {
    const logsDir = createLogsDir();
    const now = new Date();
    const entry = {
      ts: now.toISOString(),
      sessionId: 'nested-session',
      command: 'git reset --hard',
      reason: 'Blocked by safety net',
    };

    try {
      writeNestedAuditLogFixture(logsDir, '-tmp-proj', entry);

      const activity = getActivitySummary(7, logsDir);
      expect(activity.totalBlocked).toBe(1);
      expect(activity.sessionCount).toBe(1);
      expect(activity.recentEntries[0]?.command).toBe('git reset --hard');
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('reads mixed legacy and nested log files', () => {
    const logsDir = createLogsDir();
    const now = new Date();

    try {
      writeJsonlFixture(join(logsDir, 'legacy-session.jsonl'), [
        { ts: now.toISOString(), command: 'legacy', reason: 'Blocked' },
      ]);
      writeNestedAuditLogFixture(logsDir, '-tmp-proj', {
        ts: new Date(now.getTime() - 1000).toISOString(),
        sessionId: 'nested-session',
        command: 'nested',
        reason: 'Blocked',
      });

      const activity = getActivitySummary(7, logsDir);
      expect(activity.totalBlocked).toBe(2);
      expect(activity.sessionCount).toBe(2);
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('counts readable entries when a nested child cannot be traversed', () => {
    const logsDir = createLogsDir();
    const unreadableDir = join(logsDir, 'unreadable');

    try {
      writeJsonlFixture(join(logsDir, 'readable.jsonl'), [
        { ts: new Date().toISOString(), command: 'visible', reason: 'Blocked' },
      ]);
      mkdirSync(unreadableDir);
      writeJsonlFixture(join(unreadableDir, 'hidden.jsonl'), [
        { ts: new Date().toISOString(), command: 'hidden', reason: 'Blocked' },
      ]);
      const spy = mockReaddirError(unreadableDir);

      try {
        const activity = getActivitySummary(7, logsDir);

        expect(activity.totalBlocked).toBe(1);
        expect(activity.recentEntries[0]?.command).toBe('visible');
      } finally {
        spy.mockRestore();
      }
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('dedupes sessions split across files by session id', () => {
    const logsDir = createLogsDir();
    const now = new Date();

    try {
      writeNestedAuditLogFixture(logsDir, '-tmp-one', {
        ts: now.toISOString(),
        sessionId: 'shared-session',
        command: 'first',
        reason: 'Blocked',
      });
      writeNestedAuditLogFixture(logsDir, '-tmp-two', {
        ts: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        sessionId: 'shared-session',
        command: 'second',
        reason: 'Blocked',
      });

      expectActivityCounts(logsDir, 2, 1);
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('uses legacy filename as session key when entry lacks session id', () => {
    const logsDir = createLogsDir();
    const now = new Date();

    try {
      writeJsonlFixture(join(logsDir, 'legacy-sess.jsonl'), [
        { ts: now.toISOString(), command: 'first', reason: 'Blocked' },
        {
          ts: new Date(now.getTime() - 1000).toISOString(),
          command: 'second',
          reason: 'Blocked',
        },
      ]);

      expectActivityCounts(logsDir, 2, 1);
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('ignores allowed debug entries', () => {
    const logsDir = createLogsDir();
    const deniedEntry = {
      ts: new Date().toISOString(),
      decision: 'deny',
      command: 'rm -rf /',
      segment: 'rm -rf /',
      reason: 'blocked',
      cwd: '/tmp',
    };
    const allowedEntry = {
      ts: new Date().toISOString(),
      decision: 'allow',
      command: 'git status',
      segment: 'git status',
      reason: 'allowed',
      cwd: '/tmp',
    };

    try {
      writeFileSync(
        join(logsDir, 'session.jsonl'),
        `${JSON.stringify(deniedEntry)}\n${JSON.stringify(allowedEntry)}\n`,
      );

      const activity = getActivitySummary(7, logsDir);
      expect(activity.totalBlocked).toBe(1);
      expect(activity.recentEntries.map((entry) => entry.command)).toEqual(['rm -rf /']);
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('treats legacy entries without decision as blocked', () => {
    const logsDir = createLogsDir();
    const entry = {
      ts: new Date().toISOString(),
      command: 'git reset --hard',
      segment: 'git reset --hard',
      reason: 'blocked',
      cwd: '/tmp',
    };

    try {
      writeFileSync(join(logsDir, 'session.jsonl'), JSON.stringify(entry));

      const activity = getActivitySummary(7, logsDir);
      expect(activity.totalBlocked).toBe(1);
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('filters entries older than specified days', () => {
    const logsDir = createLogsDir();

    const now = new Date();
    const recentEntry = {
      ts: now.toISOString(),
      command: 'recent command',
      reason: 'Blocked',
    };
    const oldEntry = {
      ts: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      command: 'old command',
      reason: 'Blocked',
    };

    writeFileSync(
      join(logsDir, 'mixed.jsonl'),
      `${JSON.stringify(recentEntry)}\n${JSON.stringify(oldEntry)}\n`,
    );

    try {
      const activity = getActivitySummary(7, logsDir); // Only last 7 days

      expect(activity.totalBlocked).toBe(1);
      expect(activity.recentEntries.length).toBe(1);
      expect(activity.recentEntries[0]?.command).toBe('recent command');
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('limits recent entries to 3', () => {
    const logsDir = join(tmpdir(), `doctor-logs-${Date.now()}`);
    mkdirSync(logsDir, { recursive: true });

    const now = new Date();
    const entries = [];
    for (let i = 0; i < 5; i++) {
      entries.push({
        ts: new Date(now.getTime() - i * 1000).toISOString(),
        command: `command ${i}`,
        reason: 'Blocked',
      });
    }

    writeFileSync(join(logsDir, 'session.jsonl'), entries.map((e) => JSON.stringify(e)).join('\n'));

    try {
      const activity = getActivitySummary(7, logsDir);

      expect(activity.totalBlocked).toBe(5);
      expect(activity.recentEntries.length).toBe(3);
      // Should have the 3 most recent (sorted by timestamp descending)
      expect(activity.recentEntries[0]?.command).toBe('command 0');
      expect(activity.recentEntries[1]?.command).toBe('command 1');
      expect(activity.recentEntries[2]?.command).toBe('command 2');
      expect(activity.newestEntry).toBe(entries[0]?.ts);
      expect(activity.oldestEntry).toBe(entries[4]?.ts);
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('keeps encounter order for entries with equal timestamps', () => {
    const logsDir = join(tmpdir(), `doctor-logs-${Date.now()}`);
    mkdirSync(logsDir, { recursive: true });

    const ts = new Date().toISOString();
    const entries = ['first', 'second', 'third', 'fourth'].map((command) => ({
      ts,
      command,
      reason: 'Blocked',
    }));

    writeFileSync(join(logsDir, 'session.jsonl'), entries.map((e) => JSON.stringify(e)).join('\n'));

    try {
      const activity = getActivitySummary(7, logsDir);

      expect(activity.recentEntries.map((entry) => entry.command)).toEqual([
        'first',
        'second',
        'third',
      ]);
      expect(activity.oldestEntry).toBe(ts);
      expect(activity.newestEntry).toBe(ts);
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('skips malformed JSON lines', () => {
    const logsDir = join(tmpdir(), `doctor-logs-${Date.now()}`);
    mkdirSync(logsDir, { recursive: true });

    const validEntry = {
      ts: new Date().toISOString(),
      command: 'valid command',
      reason: 'Blocked',
    };

    writeFileSync(
      join(logsDir, 'session.jsonl'),
      `${JSON.stringify(validEntry)}\n{ invalid json }\nnot json at all\n`,
    );

    try {
      const activity = getActivitySummary(7, logsDir);

      expect(activity.totalBlocked).toBe(1);
      expect(activity.recentEntries[0]?.command).toBe('valid command');
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  // A record with an object command would reach the human formatter, which
  // calls .replace() on it; it must be dropped and reported as unreadable.
  test('drops records with wrong field shapes and reports them as unreadable', () => {
    const logsDir = join(tmpdir(), `doctor-logs-shape-${Date.now()}`);
    mkdirSync(logsDir, { recursive: true });
    const ts = new Date().toISOString();
    writeFileSync(
      join(logsDir, 'session.jsonl'),
      [
        JSON.stringify({ ts, command: 'valid command', reason: 'Blocked' }),
        JSON.stringify({ ts, command: { nested: true }, reason: 'Blocked' }),
      ].join('\n'),
    );

    try {
      const activity = getActivitySummary(7, logsDir);

      expect(activity.totalBlocked).toBe(1);
      expect(activity.recentEntries.map((entry) => entry.command)).toEqual(['valid command']);
      expect(activity.unreadable).toBe(1);
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('ignores non-jsonl files', () => {
    const logsDir = join(tmpdir(), `doctor-logs-${Date.now()}`);
    mkdirSync(logsDir, { recursive: true });

    const entry = {
      ts: new Date().toISOString(),
      command: 'test command',
      reason: 'Blocked',
    };

    writeFileSync(join(logsDir, 'valid.jsonl'), JSON.stringify(entry));
    writeFileSync(join(logsDir, 'readme.txt'), 'This should be ignored');
    writeFileSync(join(logsDir, 'data.json'), JSON.stringify(entry));

    try {
      const activity = getActivitySummary(7, logsDir);

      expect(activity.totalBlocked).toBe(1);
      expect(activity.sessionCount).toBe(1);
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('formats relative time correctly', () => {
    const logsDir = join(tmpdir(), `doctor-logs-${Date.now()}`);
    mkdirSync(logsDir, { recursive: true });

    const now = new Date();
    const entries = [
      { ts: now.toISOString(), command: 'just now', reason: 'Blocked' },
      {
        ts: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
        command: '5m ago',
        reason: 'Blocked',
      },
      {
        ts: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        command: '2h ago',
        reason: 'Blocked',
      },
    ];

    writeFileSync(join(logsDir, 'session.jsonl'), entries.map((e) => JSON.stringify(e)).join('\n'));

    try {
      const activity = getActivitySummary(7, logsDir);

      expect(activity.recentEntries[0]?.relativeTime).toMatch(/just now|0m ago|1m ago/);
      expect(activity.recentEntries[1]?.relativeTime).toMatch(/\dm ago/);
      expect(activity.recentEntries[2]?.relativeTime).toMatch(/\dh ago/);
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('formats days in relative time for old entries', () => {
    const logsDir = join(tmpdir(), `doctor-logs-${Date.now()}`);
    mkdirSync(logsDir, { recursive: true });

    const now = new Date();
    const entry = {
      ts: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      command: '3 days ago',
      reason: 'Blocked',
    };

    writeFileSync(join(logsDir, 'session.jsonl'), JSON.stringify(entry));

    try {
      const activity = getActivitySummary(7, logsDir);

      expect(activity.recentEntries[0]?.relativeTime).toBe('3d ago');
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('counts sessions correctly with multiple files', () => {
    const logsDir = join(tmpdir(), `doctor-logs-${Date.now()}`);
    mkdirSync(logsDir, { recursive: true });

    const now = new Date();
    const recentEntry = { ts: now.toISOString(), command: 'cmd', reason: 'Blocked' };
    const oldEntry = {
      ts: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      command: 'old',
      reason: 'Blocked',
    };

    // Session 1 has recent entry
    writeFileSync(join(logsDir, 'session1.jsonl'), JSON.stringify(recentEntry));
    // Session 2 has only old entries (outside the 7 day window)
    writeFileSync(join(logsDir, 'session2.jsonl'), JSON.stringify(oldEntry));
    // Session 3 has recent entry
    writeFileSync(join(logsDir, 'session3.jsonl'), JSON.stringify(recentEntry));

    try {
      const activity = getActivitySummary(7, logsDir);

      // Only sessions with recent entries are counted
      expect(activity.sessionCount).toBe(2);
      expect(activity.totalBlocked).toBe(2);
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });

  test('handles empty log files', () => {
    const logsDir = join(tmpdir(), `doctor-logs-${Date.now()}`);
    mkdirSync(logsDir, { recursive: true });

    writeFileSync(join(logsDir, 'empty.jsonl'), '');

    try {
      const activity = getActivitySummary(7, logsDir);

      expect(activity.totalBlocked).toBe(0);
      expect(activity.sessionCount).toBe(0);
    } finally {
      rmSync(logsDir, { recursive: true, force: true });
    }
  });
});
