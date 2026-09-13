import {
  lstatSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  statSync,
  unlinkSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import type { AuditLogEntry } from '@/core/audit';
import type { Environment } from '@/core/environment';
import { readRetentionDays } from '@/core/policy/retention';

const DAY_MS = 24 * 60 * 60 * 1000;

const PRUNE_MARKER_NAME = '.last-prune';
const MONTH_DIR = /^\d{4}-\d{2}$/;
const DATED_LOG_FILE = /^((\d{4}-\d{2})-\d{2})-.+\.jsonl$/;

const utcDay = (ms: number) => Math.floor(ms / DAY_MS);

export function pruneExpiredAuditLogs(
  environment: Environment,
  logsDir: string,
  now: () => Date = () => new Date(),
): void {
  try {
    const nowMs = now().getTime();
    if (!statSync(logsDir, { throwIfNoEntry: false })?.isDirectory()) return;

    const markerPath = join(logsDir, PRUNE_MARKER_NAME);
    const lastAttempt = statSync(markerPath, { throwIfNoEntry: false })?.mtimeMs;
    if (lastAttempt !== undefined && utcDay(lastAttempt) === utcDay(nowMs)) return;

    const cutoff = nowMs - readRetentionDays(environment) * DAY_MS;
    const currentMonth = new Date(nowMs).toISOString().slice(0, 7);
    for (const entry of readDirEntries(logsDir)) {
      if (entry.isDirectory()) {
        pruneProjectDir(join(logsDir, entry.name), cutoff, currentMonth);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith('.jsonl')) {
        pruneLegacyFile(join(logsDir, entry.name), cutoff);
      }
    }

    writeFileSync(markerPath, '', { mode: 0o600 });

    utimesSync(markerPath, nowMs / 1000, nowMs / 1000);
  } catch {}
}

function pruneProjectDir(projectDir: string, cutoff: number, currentMonth: string): void {
  for (const month of readDirEntries(projectDir)) {
    if (!month.isDirectory() || !MONTH_DIR.test(month.name)) continue;
    const monthDir = join(projectDir, month.name);
    for (const file of readDirEntries(monthDir)) {
      if (!file.isFile()) continue;
      const dated = DATED_LOG_FILE.exec(file.name);

      if (!dated || dated[2] !== month.name) continue;

      const endOfDay = Date.parse(`${dated[1]}T00:00:00.000Z`) + DAY_MS;
      if (!Number.isFinite(endOfDay) || endOfDay >= cutoff) continue;
      unlinkQuietly(join(monthDir, file.name));
    }

    if (month.name !== currentMonth) rmdirQuietly(monthDir);
  }
  rmdirQuietly(projectDir);
}

function pruneLegacyFile(filePath: string, cutoff: number): void {
  try {
    const before = lstatSync(filePath);
    if (before.mtimeMs >= cutoff) return;

    const timestamps = readFileSync(filePath, 'utf-8')
      .split('\n')
      .filter((line) => line.trim())
      .map(parseEntryTimestamp);
    if (timestamps.length === 0) return;
    if (timestamps.some((ts) => ts === undefined || ts >= cutoff)) return;

    if (lstatSync(filePath).mtimeMs !== before.mtimeMs) return;

    unlinkQuietly(filePath);
  } catch {}
}

function parseEntryTimestamp(line: string): number | undefined {
  try {
    const ts = (JSON.parse(line) as AuditLogEntry).ts;
    const parsed = typeof ts === 'string' ? Date.parse(ts) : Number.NaN;
    return Number.isFinite(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function readDirEntries(dir: string) {
  try {
    return readdirSync(dir, { withFileTypes: true, encoding: 'utf8' });
  } catch {
    return [];
  }
}

function unlinkQuietly(filePath: string): void {
  try {
    unlinkSync(filePath);
  } catch {}
}

function rmdirQuietly(dir: string): void {
  try {
    rmdirSync(dir);
  } catch {}
}
