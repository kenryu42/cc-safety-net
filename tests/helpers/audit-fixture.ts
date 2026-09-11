import { mkdirSync, symlinkSync, utimesSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const DAY_MS = 24 * 60 * 60 * 1000;

const entry = (ts: string) =>
  `${JSON.stringify({ ts, command: 'echo hi', segment: 'echo hi', reason: 'fixture' })}\n`;

export function writeAuditFixture(root: string, nowMs: number): string {
  const logs = join(root, 'logs');
  const outside = join(root, 'symlink-target');

  const files: Record<string, string> = {
    [join(logs, 'proj-a', '2026-03', '2026-03-02-sess.jsonl')]: entry('2026-03-02T01:00:00.000Z'),
    [join(logs, 'proj-b', '2026-04', '2026-04-16-sess.jsonl')]: entry('2026-04-16T01:00:00.000Z'),
    [join(logs, 'proj-b', '2026-04', '2026-04-17-sess.jsonl')]: entry('2026-04-17T01:00:00.000Z'),
    [join(logs, 'proj-b', '2026-05', '2026-05-16-sess.jsonl')]: entry('2026-05-16T01:00:00.000Z'),
    [join(logs, 'proj-b', '2026-06', '2026-06-01-sess.jsonl')]: entry('2026-06-01T01:00:00.000Z'),
    [join(logs, 'proj-b', '2026-04', 'garbage.jsonl')]: entry('2026-03-01T01:00:00.000Z'),
    [join(logs, 'proj-b', '2026-04', '2026-04-99-impossible.jsonl')]: entry(
      '2026-03-01T01:00:00.000Z',
    ),
    [join(logs, 'proj-b', '2026-05', '2026-03-02-wrong-month.jsonl')]: entry(
      '2026-03-02T01:00:00.000Z',
    ),
    [join(logs, 'proj-b', 'notamonth', '2026-03-02-sess.jsonl')]: entry('2026-03-02T01:00:00.000Z'),
    [join(logs, 'proj-c', '2026-03', 'nested', '2026-03-02-deep.jsonl')]: entry(
      '2026-03-02T01:00:00.000Z',
    ),
    [join(logs, 'proj-b', '2026-04', 'notes.txt')]: 'not an audit log\n',
    [join(logs, 'README.md')]: 'not an audit log\n',
    [join(outside, '2026-03', '2026-03-02-sess.jsonl')]: entry('2026-03-02T01:00:00.000Z'),
  };

  const legacy: Record<string, { content: string; mtime: number }> = {
    'legacy-expired.jsonl': {
      content: `${entry('2026-03-01T01:00:00.000Z')}${entry('2026-03-02T01:00:00.000Z')}`,
      mtime: nowMs - 60 * DAY_MS,
    },
    'legacy-fresh-mtime.jsonl': {
      content: entry('2026-03-01T01:00:00.000Z'),
      mtime: nowMs - 60 * 60 * 1000,
    },
    'legacy-empty.jsonl': { content: '', mtime: nowMs - 60 * DAY_MS },
    'legacy-malformed.jsonl': { content: 'not json at all\n', mtime: nowMs - 60 * DAY_MS },
    'legacy-mixed.jsonl': {
      content: `${entry('2026-03-01T01:00:00.000Z')}${entry(new Date(nowMs - DAY_MS).toISOString())}`,
      mtime: nowMs - 60 * DAY_MS,
    },
  };

  const links: Record<string, string> = {
    [join(logs, 'linked-project')]: join('..', 'symlink-target'),
    [join(logs, 'proj-b', '2026-04', '2026-04-16-link.jsonl')]: join(
      '..',
      '..',
      '..',
      'symlink-target',
      '2026-03',
      '2026-03-02-sess.jsonl',
    ),
    [join(logs, 'legacy-link.jsonl')]: join(
      '..',
      'symlink-target',
      '2026-03',
      '2026-03-02-sess.jsonl',
    ),
  };

  for (const dir of [
    join(logs, 'proj-empty-current', '2026-05'),
    join(logs, 'proj-empty-old', '2026-02'),
  ]) {
    mkdirSync(dir, { recursive: true });
  }
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
  for (const [name, file] of Object.entries(legacy)) {
    writeFileSync(join(logs, name), file.content);
    utimesSync(join(logs, name), file.mtime / 1000, file.mtime / 1000);
  }
  for (const [path, target] of Object.entries(links)) symlinkSync(target, path);

  writeFileSync(join(logs, '.last-prune'), '', { mode: 0o600 });
  utimesSync(join(logs, '.last-prune'), (nowMs - DAY_MS) / 1000, (nowMs - DAY_MS) / 1000);

  return logs;
}
