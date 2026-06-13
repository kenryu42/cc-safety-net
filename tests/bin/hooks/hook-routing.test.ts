import { describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeLockedGitHubRulebookPolicy } from '../../helpers.ts';
import { claudeCodeBashInput, geminiShellInput, kimiShellInput, runCli } from './hook-helpers';

describe('hook command routing', () => {
  test('top-level Claude Code long flag routes to hook command for compatibility', async () => {
    const { stdout, exitCode } = await runCli(
      ['--claude-code'],
      JSON.stringify(claudeCodeBashInput('git reset --hard')),
    );

    const output = JSON.parse(stdout);
    expect(exitCode).toBe(0);
    expect(output.hookSpecificOutput.hookEventName).toBe('PreToolUse');
    expect(output.hookSpecificOutput.permissionDecision).toBe('deny');
    expect(output.hookSpecificOutput.permissionDecisionReason).toContain('git reset --hard');
  });

  test('top-level Claude Code short flag routes to hook command for compatibility', async () => {
    const { stdout, exitCode } = await runCli(
      ['-cc'],
      JSON.stringify(claudeCodeBashInput('git reset --hard')),
    );

    const output = JSON.parse(stdout);
    expect(exitCode).toBe(0);
    expect(output.hookSpecificOutput.permissionDecision).toBe('deny');
    expect(output.hookSpecificOutput.permissionDecisionReason).toContain('git reset --hard');
  });

  test('Claude Code hook fails closed when config loading throws', async () => {
    const cwd = mkdtempSync(join(tmpdir(), 'safety-net-hook-bad-config-'));
    try {
      writeLockedGitHubRulebookPolicy(cwd, '{}', { cacheAsDirectory: true });

      const { stdout, exitCode } = await runCli(
        ['hook', '--claude-code'],
        JSON.stringify({ ...claudeCodeBashInput('echo ok'), cwd }),
      );
      const output = JSON.parse(stdout);

      expect(exitCode).toBe(0);
      expect(output.hookSpecificOutput.permissionDecision).toBe('deny');
      expect(output.hookSpecificOutput.permissionDecisionReason).toContain(
        'failed to read cached rulebook',
      );
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test('top-level non-Claude hook flags route to hook command for compatibility', async () => {
    const { stdout, exitCode } = await runCli(
      ['-gc'],
      JSON.stringify(geminiShellInput('git reset --hard')),
    );

    const output = JSON.parse(stdout);
    expect(exitCode).toBe(0);
    expect(output.decision).toBe('deny');
    expect(output.reason).toContain('git reset --hard');
  });

  test('Kimi Code routes through hook command only', async () => {
    const { stdout, exitCode } = await runCli(
      ['hook', '--kimi-code'],
      JSON.stringify(kimiShellInput('git status')),
    );

    expect(exitCode).toBe(0);
    expect(stdout).toBe('');
  });

  test('hook kimi-code is not a platform subcommand', async () => {
    const { stdout, exitCode } = await runCli(['hook', 'kimi-code']);

    expect(exitCode).toBe(1);
    expect(stdout).toContain('cc-safety-net hook');
    expect(stdout).toContain('-kc, --kimi-code');
  });

  test('top-level Kimi Code flags are not legacy compatibility aliases', async () => {
    const longFlag = await runCli(['--kimi-code']);
    const shortFlag = await runCli(['-kc']);

    expect(longFlag.exitCode).toBe(1);
    expect(longFlag.stderr).toContain('Unknown option: --kimi-code');
    expect(shortFlag.exitCode).toBe(1);
    expect(shortFlag.stderr).toContain('Unknown option: -kc');
  });

  test('does not route nested legacy hook flags outside the hook command', async () => {
    const { stderr, exitCode } = await runCli(
      ['xxx', '--claude-code'],
      JSON.stringify(claudeCodeBashInput('git reset --hard')),
    );

    expect(exitCode).toBe(1);
    expect(stderr).toContain('Unknown option: xxx');
  });

  test('hook without platform flag prints hook help and exits nonzero', async () => {
    const { stdout, exitCode } = await runCli(['hook']);

    expect(exitCode).toBe(1);
    expect(stdout).toContain('cc-safety-net hook');
    expect(stdout).toContain('-cc, --claude-code');
    expect(stdout).toContain('-cp, --copilot-cli');
    expect(stdout).toContain('-gc, --gemini-cli');
    expect(stdout).toContain('-kc, --kimi-code');
  });
});
