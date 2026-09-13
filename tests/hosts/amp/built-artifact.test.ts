import { describe, expect, test } from 'bun:test';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { AMP_HOST_SCRIPT } from '../../../scripts/integration-host-scripts';

const ARTIFACT = resolve('dist/amp/cc-safety-net/index.ts');

function runAmpHost(command: string, artifact = ARTIFACT) {
  if (!existsSync(artifact))
    throw new Error(`Amp artifact not built at ${artifact}; run bun run build`);
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'safety-net-amp-host-'));
  try {
    const result = Bun.spawnSync([process.execPath, '--eval', AMP_HOST_SCRIPT], {
      stdin: Buffer.from(
        JSON.stringify({ artifact, workspaceRoot, command, threadId: 'T-amp-host' }),
      ),
      stdout: 'pipe',
      stderr: 'pipe',
      env: { ...process.env, CC_SAFETY_NET_HOME: join(workspaceRoot, 'safety-net-home') },
    });
    if (result.exitCode !== 0) {
      throw new Error(`Amp host failed (${result.exitCode}): ${result.stderr.toString()}`);
    }
    return JSON.parse(result.stdout.toString()) as { action: string; message?: string };
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
}

describe('built Amp plugin artifact', () => {
  test('allows a safe shell call', () => {
    expect(runAmpHost('git status')).toEqual({ action: 'allow' });
  });

  test('rejects a destructive shell call with the guard reason', () => {
    const result = runAmpHost('git reset --hard');
    expect(result.action).toBe('reject-and-continue');
    expect(result.message).toContain('git.reset-hard');
  });

  test('enforces the policy snapshot the installer stamps onto the artifact', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-amp-stamped-'));
    try {
      const stamped = join(dir, 'cc-safety-net.ts');
      writeFileSync(
        stamped,
        `${readFileSync(ARTIFACT, 'utf-8')};globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(
          {
            version: 1,
            safety: { level: 'paranoid', overrides: {} },
            workflow: { worktree_mode: false },
            destructive_command_protection: { enabled: true, overrides: {}, allow_paths: [] },
            secret_protection: { enabled: true, overrides: {}, deny_paths: [] },
            audit: { retention_days: 30 },
          },
        )};\n`,
      );

      expect(runAmpHost('python3 -c "print(1)"')).toEqual({ action: 'allow' });

      const result = runAmpHost('python3 -c "print(1)"', stamped);
      expect(result.action).toBe('reject-and-continue');
      expect(result.message).toContain('interpreter.one-liner-paranoid');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
