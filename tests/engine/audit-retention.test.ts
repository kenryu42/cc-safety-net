import { describe, expect, spyOn, test } from 'bun:test';
import * as fs from 'node:fs';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  statSync,
  symlinkSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { writeAuditLog } from '@/engine/audit';
import { pruneExpiredAuditLogs } from '@/engine/audit-retention';
import { listAuditLogFiles } from '@/engine/audit-scan';
import { withEnv } from '../helpers';

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = new Date('2026-07-26T12:00:00.000Z');
const now = () => NOW;
// With no policy file the sweep uses the 30-day default, whose cutoff for NOW is
// 2026-06-26T12:00:00.000Z. The boundary pair straddles it: 2026-06-25 ends
// before the cutoff, 2026-06-26 ends after it.
const BOUNDARY_EXPIRED_DAY = '2026-06-25';
const CUTOFF_DAY = '2026-06-26';
// Comfortably outside any window under test, for fixtures about layout rather
// than the boundary.
const EXPIRED_DAY = '2026-04-26';
const RECENT_DAY = '2026-07-20';
const FUTURE_DAY = '2026-12-01';
const EXPIRED_MTIME = new Date('2026-04-01T00:00:00.000Z');

function withLogsDir<T>(fn: (logsDir: string, homeDir: string) => T): T {
  const homeDir = mkdtempSync(join(tmpdir(), 'safety-net-audit-retention-'));
  try {
    const logsDir = join(homeDir, '.cc-safety-net', 'logs');
    mkdirSync(logsDir, { recursive: true });
    return fn(logsDir, homeDir);
  } finally {
    rmSync(homeDir, { recursive: true, force: true });
  }
}

function writeFileAt(...segments: string[]): string {
  const filePath = join(...segments);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, '{"ts":"2026-01-15T00:00:00.000Z","decision":"deny"}\n');
  return filePath;
}

function writeDatedLog(logsDir: string, day: string, session = 's1'): string {
  return writeFileAt(logsDir, '-project-a', day.slice(0, 7), `${day}-${session}.jsonl`);
}

function entryLine(ts: string): string {
  return JSON.stringify({ ts, decision: 'deny', command: 'git reset --hard' });
}

function writeLegacyLog(filePath: string, lines: readonly string[], mtime: Date): string {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, lines.join('\n'));
  utimesSync(filePath, mtime, mtime);
  return filePath;
}

describe('pruneExpiredAuditLogs dated layout', () => {
  test('deletes a file whose whole UTC day ended before the cutoff', () => {
    withLogsDir((logsDir) => {
      const expired = writeDatedLog(logsDir, BOUNDARY_EXPIRED_DAY);

      pruneExpiredAuditLogs(logsDir, now);

      expect(existsSync(expired)).toBe(false);
    });
  });

  test('retains a file whose UTC day overlaps the cutoff', () => {
    withLogsDir((logsDir) => {
      const overlapping = writeDatedLog(logsDir, CUTOFF_DAY);

      pruneExpiredAuditLogs(logsDir, now);

      expect(existsSync(overlapping)).toBe(true);
    });
  });

  test('retains files inside the window and future-dated files', () => {
    withLogsDir((logsDir) => {
      const recent = writeDatedLog(logsDir, RECENT_DAY);
      const future = writeDatedLog(logsDir, FUTURE_DAY);

      pruneExpiredAuditLogs(logsDir, now);

      expect(existsSync(recent)).toBe(true);
      expect(existsSync(future)).toBe(true);
    });
  });

  test('honors a retention window configured shorter than the default', () => {
    withLogsDir((logsDir, homeDir) => {
      const safetyNetHome = join(homeDir, '.cc-safety-net');
      writeFileSync(
        join(safetyNetHome, 'policy.json'),
        JSON.stringify({ audit: { retention_days: 5 } }),
      );
      // Both days sit inside the 30-day default window, so only the configured
      // five-day window can decide between them.
      const expired = writeDatedLog(logsDir, '2026-07-16');
      const retained = writeDatedLog(logsDir, '2026-07-24', 's2');

      withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => pruneExpiredAuditLogs(logsDir, now));

      expect(existsSync(expired)).toBe(false);
      expect(existsSync(retained)).toBe(true);
    });
  });

  test('retains malformed filenames in a valid month directory', () => {
    withLogsDir((logsDir) => {
      const monthDir = join(logsDir, '-project-a', '2026-04');
      const malformed = [
        'not-a-date-s1.jsonl',
        '2026-04-26-s1.json',
        '2026-4-26-s1.jsonl',
        '2026-04-26.jsonl',
      ].map((name) => writeFileAt(monthDir, name));

      pruneExpiredAuditLogs(logsDir, now);

      expect(malformed.filter((file) => !existsSync(file))).toEqual([]);
    });
  });

  test('retains dated files at unexpected depths', () => {
    withLogsDir((logsDir) => {
      const misplaced = [
        // A month directory sitting where a project directory belongs.
        writeFileAt(logsDir, '2026-04', `${EXPIRED_DAY}-s1.jsonl`),
        // A dated file directly under a project directory.
        writeFileAt(logsDir, '-project-a', `${EXPIRED_DAY}-s1.jsonl`),
        // A dated file one level below its month directory.
        writeFileAt(logsDir, '-project-a', '2026-04', 'nested', `${EXPIRED_DAY}-s1.jsonl`),
        // A month directory that is not a valid year-month.
        writeFileAt(logsDir, '-project-a', '2026-4', `${EXPIRED_DAY}-s1.jsonl`),
      ];

      pruneExpiredAuditLogs(logsDir, now);

      expect(misplaced.filter((file) => !existsSync(file))).toEqual([]);
    });
  });

  test('retains a dated file whose month disagrees with its month directory', () => {
    withLogsDir((logsDir) => {
      const mismatched = writeFileAt(logsDir, '-project-a', '2026-04', '2026-03-26-s1.jsonl');

      pruneExpiredAuditLogs(logsDir, now);

      expect(existsSync(mismatched)).toBe(true);
    });
  });

  test('retains unrelated files', () => {
    withLogsDir((logsDir) => {
      const unrelated = [
        writeFileAt(logsDir, 'notes.txt'),
        writeFileAt(logsDir, '-project-a', '2026-04', 'notes.txt'),
        writeFileAt(logsDir, '-project-a', '2026-04', `${EXPIRED_DAY}-s1.txt`),
      ];

      pruneExpiredAuditLogs(logsDir, now);

      expect(unrelated.filter((file) => !existsSync(file))).toEqual([]);
    });
  });

  test('reclaims the month and project directories left empty by pruning', () => {
    withLogsDir((logsDir) => {
      writeDatedLog(logsDir, EXPIRED_DAY);
      const husk = join(logsDir, '-project-husk');
      mkdirSync(husk);

      pruneExpiredAuditLogs(logsDir, now);

      expect(existsSync(join(logsDir, '-project-a'))).toBe(false);
      expect(existsSync(husk)).toBe(false);
      expect(existsSync(logsDir)).toBe(true);
    });
  });

  test('keeps a project directory whose other months still hold logs', () => {
    withLogsDir((logsDir) => {
      writeDatedLog(logsDir, EXPIRED_DAY);
      const recent = writeDatedLog(logsDir, RECENT_DAY);

      pruneExpiredAuditLogs(logsDir, now);

      expect(existsSync(join(logsDir, '-project-a', '2026-04'))).toBe(false);
      expect(existsSync(recent)).toBe(true);
    });
  });

  test('keeps an empty current-month directory a writer may be about to fill', () => {
    withLogsDir((logsDir) => {
      // writeAuditLog creates the month directory and appends as two steps, and
      // only ever for the current month. Reclaiming that one could land between
      // them and cost the entry the write was made to persist.
      const current = join(logsDir, '-project-a', NOW.toISOString().slice(0, 7));
      const past = join(logsDir, '-project-a', '2026-04');
      mkdirSync(current, { recursive: true });
      mkdirSync(past, { recursive: true });

      pruneExpiredAuditLogs(logsDir, now);

      expect(existsSync(current)).toBe(true);
      expect(existsSync(past)).toBe(false);
      expect(existsSync(join(logsDir, '-project-a'))).toBe(true);
    });
  });

  test('does not follow symlinked directories or files', () => {
    withLogsDir((logsDir, homeDir) => {
      const outsideProject = join(homeDir, 'outside-project');
      const outsideFile = writeFileAt(outsideProject, '2026-04', `${EXPIRED_DAY}-s1.jsonl`);
      const outsideLegacy = writeLegacyLog(
        join(homeDir, 'outside-legacy.jsonl'),
        [entryLine('2026-01-15T00:00:00.000Z')],
        EXPIRED_MTIME,
      );
      symlinkSync(outsideProject, join(logsDir, '-linked-project'), 'dir');
      mkdirSync(join(logsDir, '-project-a', '2026-04'), { recursive: true });
      symlinkSync(outsideFile, join(logsDir, '-project-a', '2026-04', `${EXPIRED_DAY}-link.jsonl`));
      symlinkSync(outsideLegacy, join(logsDir, 'legacy-link.jsonl'));
      // Same shape, reached without a symlink: proves the fixture above is
      // otherwise a prunable target.
      const control = writeFileAt(logsDir, '-project-b', '2026-04', `${EXPIRED_DAY}-s1.jsonl`);

      pruneExpiredAuditLogs(logsDir, now);

      expect(existsSync(control)).toBe(false);
      expect(existsSync(outsideFile)).toBe(true);
      expect(existsSync(outsideLegacy)).toBe(true);
      expect(existsSync(join(logsDir, 'legacy-link.jsonl'))).toBe(true);
      expect(existsSync(join(logsDir, '-project-a', '2026-04', `${EXPIRED_DAY}-link.jsonl`))).toBe(
        true,
      );
    });
  });
});

describe('pruneExpiredAuditLogs legacy layout', () => {
  test('deletes a legacy file whose entries and modification time are all expired', () => {
    withLogsDir((logsDir) => {
      const legacy = writeLegacyLog(
        join(logsDir, 'legacy-sess.jsonl'),
        [entryLine('2026-01-15T00:00:00.000Z'), entryLine('2026-02-01T00:00:00.000Z')],
        EXPIRED_MTIME,
      );

      pruneExpiredAuditLogs(logsDir, now);

      expect(existsSync(legacy)).toBe(false);
    });
  });

  test('retains a legacy file with a non-expired modification time', () => {
    withLogsDir((logsDir) => {
      const legacy = writeLegacyLog(
        join(logsDir, 'legacy-sess.jsonl'),
        [entryLine('2026-01-15T00:00:00.000Z')],
        NOW,
      );

      pruneExpiredAuditLogs(logsDir, now);

      expect(existsSync(legacy)).toBe(true);
    });
  });

  test('retains empty, malformed, mixed-age, and invalidly timed legacy files', () => {
    withLogsDir((logsDir) => {
      const retained = [
        writeLegacyLog(join(logsDir, 'empty.jsonl'), ['', ''], EXPIRED_MTIME),
        writeLegacyLog(
          join(logsDir, 'malformed.jsonl'),
          [entryLine('2026-01-15T00:00:00.000Z'), '{ not json'],
          EXPIRED_MTIME,
        ),
        writeLegacyLog(
          join(logsDir, 'mixed-age.jsonl'),
          [entryLine('2026-01-15T00:00:00.000Z'), entryLine('2026-07-01T00:00:00.000Z')],
          EXPIRED_MTIME,
        ),
        writeLegacyLog(
          join(logsDir, 'invalid-ts.jsonl'),
          [entryLine('2026-01-15T00:00:00.000Z'), entryLine('not-a-timestamp')],
          EXPIRED_MTIME,
        ),
      ];

      pruneExpiredAuditLogs(logsDir, now);

      expect(retained.filter((file) => !existsSync(file))).toEqual([]);
    });
  });

  test('retains a legacy file modified while it is inspected', () => {
    withLogsDir((logsDir) => {
      const legacy = writeLegacyLog(
        join(logsDir, 'legacy-sess.jsonl'),
        [entryLine('2026-01-15T00:00:00.000Z')],
        EXPIRED_MTIME,
      );
      // A concurrent writer can only append between the metadata reads that
      // bracket the file read, so the read itself is the hook point.
      const readFileSync = fs.readFileSync;
      const spy = spyOn(fs, 'readFileSync').mockImplementation(((path, options) => {
        const content = readFileSync(path, options);
        if (path === legacy) utimesSync(legacy, NOW, NOW);
        return content;
      }) as typeof fs.readFileSync);

      try {
        pruneExpiredAuditLogs(logsDir, now);
      } finally {
        spy.mockRestore();
      }

      expect(existsSync(legacy)).toBe(true);
    });
  });
});

describe('pruneExpiredAuditLogs throttling', () => {
  test('records the attempt in a zero-content non-jsonl marker', () => {
    withLogsDir((logsDir) => {
      pruneExpiredAuditLogs(logsDir, now);

      const created = readdirSync(logsDir);
      expect(created.length).toBe(1);
      expect(created[0]?.endsWith('.jsonl')).toBe(false);
      expect(statSync(join(logsDir, created[0] ?? '')).size).toBe(0);
      expect(listAuditLogFiles(logsDir)).toEqual([]);
    });
  });

  test('does not traverse again on the same UTC day', () => {
    withLogsDir((logsDir) => {
      pruneExpiredAuditLogs(logsDir, now);
      const expired = writeDatedLog(logsDir, EXPIRED_DAY, 's2');

      pruneExpiredAuditLogs(logsDir, () => new Date(NOW.getTime() + 60 * 60 * 1000));

      expect(existsSync(expired)).toBe(true);
    });
  });

  test('retries on the next UTC day', () => {
    withLogsDir((logsDir) => {
      pruneExpiredAuditLogs(logsDir, now);
      const expired = writeDatedLog(logsDir, EXPIRED_DAY, 's2');

      pruneExpiredAuditLogs(logsDir, () => new Date(NOW.getTime() + DAY_MS));

      expect(existsSync(expired)).toBe(false);
    });
  });

  test('is idempotent across repeated runs', () => {
    withLogsDir((logsDir) => {
      const expired = writeDatedLog(logsDir, EXPIRED_DAY);
      const recent = writeDatedLog(logsDir, RECENT_DAY);
      const legacy = writeLegacyLog(
        join(logsDir, 'legacy-sess.jsonl'),
        [entryLine('2026-01-15T00:00:00.000Z')],
        EXPIRED_MTIME,
      );

      for (const offset of [0, DAY_MS, 2 * DAY_MS]) {
        pruneExpiredAuditLogs(logsDir, () => new Date(NOW.getTime() + offset));
      }

      expect(existsSync(expired)).toBe(false);
      expect(existsSync(legacy)).toBe(false);
      expect(existsSync(recent)).toBe(true);
    });
  });

  test('does not create a missing audit root', () => {
    withLogsDir((_logsDir, homeDir) => {
      const missing = join(homeDir, 'missing-logs');

      pruneExpiredAuditLogs(missing, now);

      expect(existsSync(missing)).toBe(false);
    });
  });
});

describe('pruneExpiredAuditLogs failure handling', () => {
  test('records the attempt and writes the audit entry when deletion fails', () => {
    withLogsDir((logsDir, homeDir) => {
      const expired = writeDatedLog(logsDir, EXPIRED_DAY);
      const realUnlinkSync = fs.unlinkSync;
      const spy = spyOn(fs, 'unlinkSync').mockImplementation(((path: string) => {
        if (path === expired) throw new Error('EACCES: permission denied');
        realUnlinkSync(path);
      }) as typeof fs.unlinkSync);

      try {
        expect(() =>
          writeAuditLog('retention-session', 'git status', 'git status', 'allowed', null, {
            homeDir,
            decision: 'allow',
            now,
          }),
        ).not.toThrow();

        expect(existsSync(expired)).toBe(true);
        expect(
          listAuditLogFiles(logsDir).some((file) =>
            file.endsWith(join('2026-07', '2026-07-26-retention-session.jsonl')),
          ),
        ).toBe(true);

        // The failed attempt still counts, so the same UTC day does not retry.
        pruneExpiredAuditLogs(logsDir, now);
        expect(existsSync(expired)).toBe(true);
      } finally {
        spy.mockRestore();
      }
    });
  });
});
