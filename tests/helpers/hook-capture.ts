import { spyOn } from 'bun:test';
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { withEnv } from '../helpers';

export async function captureHookRun(
  input: string | Uint8Array,
  env: Record<string, string | undefined>,
  run: () => Promise<void>,
): Promise<{ stdout: string[]; stderr: string[] }> {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const log = spyOn(console, 'log').mockImplementation((...parts: unknown[]) => {
    stdout.push(parts.map(String).join(' '));
  });
  const error = spyOn(console, 'error').mockImplementation((...parts: unknown[]) => {
    stderr.push(parts.map(String).join(' '));
  });
  const stdin = process.stdin;
  Object.defineProperty(process, 'stdin', {
    value: Readable.from([Buffer.from(input)]),
    configurable: true,
  });

  try {
    await withEnv(env, run);
    return { stdout, stderr };
  } finally {
    Object.defineProperty(process, 'stdin', { value: stdin, configurable: true });
    log.mockRestore();
    error.mockRestore();
  }
}

export function readAuditEntries(
  auditHome: string,
): { file: string; entry: Record<string, unknown> }[] {
  const logs = auditLogsDir(auditHome);
  if (!existsSync(logs)) return [];
  return readdirSync(logs, { recursive: true, encoding: 'utf-8' })
    .filter((name) => name.endsWith('.jsonl'))
    .sort()
    .flatMap((file) =>
      readFileSync(join(logs, file), 'utf-8')
        .split('\n')
        .filter((line) => line !== '')
        .map((line) => {
          const entry = JSON.parse(line) as Record<string, unknown>;
          delete entry.ts;
          delete entry.id;
          return { file, entry };
        }),
    );
}

export function clearAuditLogs(auditHome: string): void {
  rmSync(auditLogsDir(auditHome), { recursive: true, force: true });
}

function auditLogsDir(auditHome: string): string {
  return join(auditHome, '.cc-safety-net', 'logs');
}
