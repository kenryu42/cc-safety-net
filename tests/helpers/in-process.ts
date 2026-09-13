import { describe, expect, spyOn, test } from 'bun:test';
import { join } from 'node:path';
import { withEnv } from '../helpers';
import { clearAuditLogs, readAuditEntries } from './hook-capture';
import { type HookFixture, hostEnv } from './hook-hosts';

export async function captureInProcessCall<T>(
  fixture: HookFixture,
  env: Record<string, string | undefined>,
  call: () => T | Promise<T>,
) {
  const auditHome = auditHomeFor(fixture);
  clearAuditLogs(auditHome);
  const stderr: string[] = [];
  const spy = spyOn(console, 'error').mockImplementation((...parts: unknown[]) => {
    stderr.push(parts.map(String).join(' '));
  });
  const scope = {
    ...hostEnv(fixture, auditHome),
    CC_SAFETY_NET_AUDIT_SCOPE: undefined,
    CC_SAFETY_NET_DEBUG: undefined,
    ...env,
  };
  try {
    const returned = await withEnv(scope, call);
    return { returned, thrown: undefined, stderr, entries: readAuditEntries(auditHome) };
  } catch (error) {
    const thrown = error instanceof Error ? error.message : String(error);
    return { returned: undefined, thrown, stderr, entries: readAuditEntries(auditHome) };
  } finally {
    spy.mockRestore();
  }
}

export function auditHomeFor(fixture: HookFixture): string {
  return join(fixture.root, 'audit-ported');
}

export function describeDifferential<Row extends { name: string }, Outcome>(
  title: string,
  rows: readonly Row[],
  run: (row: Row) => Promise<Outcome>,
  check: (row: Row, outcome: Outcome) => void,
): void {
  describe(title, () => {
    for (const row of rows) {
      test(row.name, async () => {
        check(row, await run(row));
      });
    }
  });
}

export function expectFallbackDeny(
  ported: { returned: unknown; stderr: string[]; entries: unknown[] },
  expected: { denial: unknown; failure: string },
): void {
  expect(ported.returned).toStrictEqual(expected.denial);
  expect(ported.stderr[0]).toStartWith('CC Safety Net error:');
  expect(ported.stderr[0]).toContain(expected.failure);
  expect(ported.entries).toStrictEqual([]);
}
