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

/**
 * The bin over the row's bytes, by two paths that answer with the same verdict table.
 *
 * The spawned rows pin the process contract: `src/entries/bin.ts` run through the bun running the
 * suite — `process.execPath`, so the run does not depend on a `bun` on `PATH` — with the argv the
 * host sends, answering on stdout bytes and an exit status. The in-process rows pin the step the
 * adapter runs in tests/hosts/hook/adapters.test.ts cannot reach: flag to integration to adapter,
 * through `findHookIntegrationByFlag` rather than through the adapter function directly. Together
 * every row of every host still has to answer with the verdict the shared table declares for it.
 */

const REPO_ROOT = join(import.meta.dir, '..', '..');
const PORTED = 'src/entries/bin.ts';
const CLAUDE_DENIAL = 'a denied command';
/** The two rows every host declares, kept on the process path so each host's argv is spelled out
 *  once against a deny and once against an allow. */
const SPAWNED = new Set([CLAUDE_DENIAL, 'an allowed command']);

const fixture = createHookFixture('bin-');
const auditHome = join(fixture.home, 'audit-ported');

afterAll(() => {
  fixture.remove();
});

function runEntry(argv: readonly string[], row: HookRow) {
  clearAuditLogs(auditHome);
  // A row may unset a variable, and node stringifies an `undefined` value to the literal
  // `'undefined'`, so those entries leave the map before it is merged over the parent's.
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
    // Empty means exactly empty; a document keeps every line but the trailing newline.
    stdout: result.stdout === '' ? [] : result.stdout.trimEnd().split('\n'),
    exitCode: result.status,
    // The optional debug line ends in the limit message Phase 1 rewrote; everything up to the
    // stage label is what the line reports. Only that detail is dropped, so any further stderr
    // line is recorded byte for byte.
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
  // In process there is no exit status to read, so the documents carry the decision on their own.
  return { ...captured, audit: readAuditEntries(auditHome), exitCode: 0 };
}

const denialRow = (HOOK_HOSTS.find((host) => host.id === 'claude-code') as HookHost)
  .rows(fixture)
  .find((row) => row.name === CLAUDE_DENIAL) as HookRow;

/** The verdict the run answered with, whichever host protocol carried it. */
function expectOutcome(
  ported: Awaited<ReturnType<typeof runInProcess>> | ReturnType<typeof runEntry>,
  expected: HookRow['expected'],
): void {
  // The bin reports a decision through the document it prints, never through the exit code: a
  // non-zero status would read to the host as the hook itself having failed.
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
  // One document per call, and a denial says so in the words the reader acts on.
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
  // `Hook` is here because the bin looks its verb up case-insensitively, so a case-variant
  // spelling still runs the integration rather than reporting a missing flag.
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
      // Naming no integration is the bin failing rather than a host being answered, so nothing is
      // printed, nothing is audited, and the status is the one the shell reads as a failure.
      expect(ported.stdout).toEqual([]);
      expect(ported.audit).toEqual([]);
      expect(ported.exitCode).toBe(1);
    }, 60_000);
  }
});
