import { expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { isAbsolute, join } from 'node:path';
import { runNode, withHostWorkspace, withWorkspace } from './harness';

// The harness watches the real home, so this proof runs in a subprocess whose
// HOME points at a throwaway directory: the inner tests dirty that fake host
// state and throw, and the outer tests assert the isolation checks still
// reported the writes instead of being skipped by an earlier failure.
const SELFTEST = process.env.CC_SAFETY_NET_HARNESS_SELFTEST;

test.if(SELFTEST === undefined)('runNode uses an absolute Node.js executable', async () => {
  await withWorkspace(async ({ cwd, home }) => {
    const result = await runNode(
      ['--eval', "process.stdout.write(process.versions.bun ? 'bun' : 'node')"],
      '',
      cwd,
      home,
    );

    expect(isAbsolute(result.command[0] ?? '')).toBe(true);
    expect(result.stdout).toBe('node');
  });
});

test.if(SELFTEST === '1')('selftest: callback dirties watched state and throws', async () => {
  await withHostWorkspace(async () => {
    mkdirSync(join(homedir(), '.openclaw'), { recursive: true });
    throw new Error('callback failure');
  });
});

test.if(SELFTEST === '2')('selftest: callback also leaves a session audit file', async () => {
  await withHostWorkspace(async () => {
    mkdirSync(join(homedir(), '.openclaw'), { recursive: true });
    const logs = join(homedir(), '.cc-safety-net', 'logs');
    mkdirSync(logs, { recursive: true });
    writeFileSync(join(logs, 'hostpkg-selftest.jsonl'), '');
    throw new Error('callback failure');
  });
});

async function runSelftest(mode: string) {
  const fakeHome = mkdtempSync(join(tmpdir(), 'cc-safety-net-harness-selftest-'));
  try {
    const proc = Bun.spawn([process.execPath, 'test', import.meta.path], {
      cwd: process.cwd(),
      env: { ...process.env, HOME: fakeHome, CC_SAFETY_NET_HARNESS_SELFTEST: mode },
      stdout: 'pipe',
      stderr: 'pipe',
    });
    const stderr = await new Response(proc.stderr).text();
    return { exitCode: await proc.exited, stderr };
  } finally {
    rmSync(fakeHome, { recursive: true, force: true });
  }
}

test.if(SELFTEST === undefined)(
  'host-state checks still run when the test callback throws',
  async () => {
    const { exitCode, stderr } = await runSelftest('1');

    expect(exitCode).not.toBe(0);
    // The snapshot mismatch names the dirtied path, proving the isolation
    // assertion ran even though the callback threw first.
    expect(stderr).toContain('.openclaw=dir:');
  },
  20_000,
);

test.if(SELFTEST === undefined)(
  'leaked audit files are reported even when the host-state check fails first',
  async () => {
    const { exitCode, stderr } = await runSelftest('2');

    expect(exitCode).not.toBe(0);
    expect(stderr).toContain('hostpkg-selftest.jsonl');
  },
  20_000,
);
