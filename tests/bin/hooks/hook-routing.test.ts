import { describe, expect, test } from 'bun:test';
import { claudeCodeBashInput, geminiShellInput, runCli } from './hook-helpers';

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
    expect(stdout).toContain('-kc, --kimi-cli');
  });
});
