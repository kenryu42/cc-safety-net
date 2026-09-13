import { afterAll, describe, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { findHookIntegrationByFlag, type HookIntegration } from '@/entries/hook-integrations';
import { createSpawnEnv } from '../helpers';
import { captureHookRun, clearAuditLogs, readAuditEntries } from '../helpers/hook-capture';
import {
  createHookFixture,
  HOOK_HOSTS,
  type HookHost,
  type HookRow,
  hostEnv,
} from '../helpers/hook-hosts';

const REPO_ROOT = join(import.meta.dir, '..', '..');
const PORTED = 'src/entries/bin.ts';
const CLAUDE_DENIAL = 'a denied command';
const SPAWNED = new Set([CLAUDE_DENIAL, 'an allowed command']);

const fixture = createHookFixture('bin-');
const auditHome = join(fixture.home, 'audit-ported');

afterAll(() => {
  fixture.remove();
});

function runEntry(argv: readonly string[], row: HookRow) {
  clearAuditLogs(auditHome);
  const defined = Object.fromEntries(
    Object.entries({ ...hostEnv(fixture, auditHome), ...row.env }).flatMap(([name, value]) =>
      value === undefined ? [] : [[name, value] as const],
    ),
  );
  const result = spawnSync(process.execPath, ['run', PORTED, ...argv], {
    cwd: REPO_ROOT,
    input: row.stdin,
    encoding: 'utf-8',
    maxBuffer: 32 * 1024 * 1024,
    env: createSpawnEnv(defined),
  });
  return {
    stdout: result.stdout === '' ? [] : result.stdout.trimEnd().split('\n'),
    exitCode: result.status,
    stderr: result.stderr
      .replace(/(CC Safety Net debug: [^:\n]+: )[^\n]*/, '$1')
      .split('\n')
      .filter((line) => line !== ''),
    audit: readAuditEntries(auditHome),
  };
}

async function runInProcess(flag: string, row: HookRow) {
  clearAuditLogs(auditHome);
  const integration = findHookIntegrationByFlag([flag]);
  expect(integration).toBeDefined();
  const captured = await captureHookRun(
    row.stdin,
    { ...hostEnv(fixture, auditHome), ...row.env },
    () => (integration as HookIntegration).run(),
  );
  return { ...captured, audit: readAuditEntries(auditHome), exitCode: 0 };
}

const denialRow = (HOOK_HOSTS.find((host) => host.id === 'claude-code') as HookHost)
  .rows(fixture)
  .find((row) => row.name === CLAUDE_DENIAL) as HookRow;

function expectOutcome(
  ported: Awaited<ReturnType<typeof runInProcess>> | ReturnType<typeof runEntry>,
  expected: HookRow['expected'],
): void {
  expect(ported.exitCode).toBe(0);
  expect(ported.stderr).toHaveLength(expected.stderr ?? 0);
  expect(ported.audit.map((line) => line.entry.decision)).toEqual(
    expected.audit === 'none' ? [] : [expected.audit],
  );
  if (expected.ruleId !== undefined) expect(ported.audit[0]?.entry.ruleId).toBe(expected.ruleId);
  if (expected.document === 'none') {
    expect(ported.stdout).toEqual([]);
    return;
  }
  expect(ported.stdout).toHaveLength(1);
  expect((ported.stdout[0] as string).includes('BLOCKED by CC Safety Net')).toBe(
    expected.document === 'deny',
  );
}

for (const host of HOOK_HOSTS) {
  describe(`hook ${host.flag}`, () => {
    for (const row of host.rows(fixture)) {
      test(row.name, async () => {
        expectOutcome(
          SPAWNED.has(row.name)
            ? runEntry(['hook', host.flag], row)
            : await runInProcess(host.flag, row),
          row.expected,
        );
      }, 60_000);
    }
  });
}

describe('flag resolution', () => {
  for (const argv of [
    ['hook', '--claude-code'],
    ['Hook', '--claude-code'],
    ['--claude-code'],
    ['-cc'],
  ]) {
    test(`\`${argv.join(' ')}\` runs the Claude Code hook`, () => {
      expectOutcome(runEntry(argv, denialRow), denialRow.expected);
    }, 60_000);
  }

  for (const argv of [['hook'], ['hook', '--cursor', '--kimi-code']]) {
    test(`\`${argv.join(' ')}\` names no integration`, () => {
      const ported = runEntry(argv, denialRow);
      expect(ported.stdout).toEqual([]);
      expect(ported.audit).toEqual([]);
      expect(ported.exitCode).toBe(1);
    }, 60_000);
  }
});
