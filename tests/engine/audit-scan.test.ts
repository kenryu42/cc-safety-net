import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { listAuditLogFiles, readAuditLogEntries } from '@/engine/audit-scan';
import { mockReaddirError } from '../helpers';

describe('listAuditLogFiles', () => {
  test('returns legacy and nested jsonl files', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-audit-scan-'));
    try {
      writeFileSync(join(dir, 'a.jsonl'), '{}\n');
      mkdirSync(join(dir, '-tmp-x', '2026-07'), { recursive: true });
      writeFileSync(join(dir, '-tmp-x', '2026-07', '2026-07-07-b.jsonl'), '{}\n');
      writeFileSync(join(dir, 'notes.txt'), 'ignore');

      expect(listAuditLogFiles(dir).sort()).toEqual(
        [join(dir, '-tmp-x', '2026-07', '2026-07-07-b.jsonl'), join(dir, 'a.jsonl')].sort(),
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('returns empty array for missing directory', () => {
    expect(listAuditLogFiles(join(tmpdir(), 'missing-audit-scan-dir'))).toEqual([]);
  });

  test('keeps readable jsonl files when a nested directory is unreadable', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-audit-scan-'));
    const unreadableDir = join(dir, 'unreadable');
    try {
      writeFileSync(join(dir, 'a.jsonl'), '{}\n');
      mkdirSync(join(dir, 'readable', '2026-07'), { recursive: true });
      writeFileSync(join(dir, 'readable', '2026-07', 'b.jsonl'), '{}\n');
      mkdirSync(unreadableDir);
      writeFileSync(join(unreadableDir, 'hidden.jsonl'), '{}\n');
      const spy = mockReaddirError(unreadableDir);

      try {
        expect(listAuditLogFiles(dir).sort()).toEqual(
          [join(dir, 'a.jsonl'), join(dir, 'readable', '2026-07', 'b.jsonl')].sort(),
        );
      } finally {
        spy.mockRestore();
      }
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('readAuditLogEntries', () => {
  test('returns parsed entries and skips malformed lines', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-audit-read-'));
    try {
      const file = join(dir, 'session.jsonl');
      writeFileSync(
        file,
        [
          JSON.stringify({ ts: '2026-07-07T00:00:00.000Z', command: 'first', reason: 'blocked' }),
          '{ malformed',
          JSON.stringify({ ts: '2026-07-07T00:00:01.000Z', command: 'second', reason: 'blocked' }),
        ].join('\n'),
      );

      expect(readAuditLogEntries(file).map((entry) => entry.command)).toEqual(['first', 'second']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('returns empty array for missing files', () => {
    expect(readAuditLogEntries(join(tmpdir(), 'missing-audit-log.jsonl'))).toEqual([]);
  });

  // Valid JSON lines can still carry the wrong field shapes; readers downstream
  // call string methods on these fields, so such records must be dropped here.
  test('drops records whose fields have the wrong shape and counts them', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-audit-shape-'));
    try {
      const file = join(dir, 'session.jsonl');
      writeFileSync(
        file,
        [
          JSON.stringify({ ts: '2026-07-07T00:00:00.000Z', command: 'valid', reason: 'blocked' }),
          JSON.stringify({ ts: '2026-07-07T00:00:01.000Z', command: { nested: true } }),
          JSON.stringify({
            ts: '2026-07-07T00:00:02.000Z',
            command: 'ok',
            agent: { nested: true },
          }),
          JSON.stringify(['not', 'an', 'object']),
        ].join('\n'),
      );

      const skips = { count: 0 };
      expect(readAuditLogEntries(file, skips).map((entry) => entry.command)).toEqual(['valid']);
      expect(skips.count).toBe(3);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
