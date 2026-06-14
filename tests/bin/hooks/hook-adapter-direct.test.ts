import { describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { runClaudeCodeHook } from '@/bin/hook/claude-code';
import { handleBlockedHookCommand } from '@/bin/hook/common';
import { runCopilotCliHook } from '@/bin/hook/copilot-cli';
import { runGeminiCLIHook } from '@/bin/hook/gemini-cli';
import { runKimiCodeHook } from '@/bin/hook/kimi-code';
import { writeLockedGitHubRulebookPolicy } from '../../helpers';
import {
  claudeCodeBashInput,
  copilotBashInput,
  copilotRawToolArgsInput,
  geminiShellInput,
  kimiShellInput,
} from './hook-helpers';

async function runWithInput(
  run: () => Promise<void>,
  input: object | string,
  env?: Record<string, string>,
) {
  const originalLog = console.log;
  const originalError = console.error;
  const originalStdin = process.stdin;
  const previousEnv = Object.fromEntries(
    Object.keys(env ?? {}).map((key) => [key, process.env[key]]),
  );
  const output: string[] = [];
  const errorOutput: string[] = [];
  console.log = (...args: unknown[]) => output.push(args.map(String).join(' '));
  console.error = (...args: unknown[]) => errorOutput.push(args.map(String).join(' '));
  Object.assign(process.env, env);
  Object.defineProperty(process, 'stdin', {
    value: Readable.from([Buffer.from(typeof input === 'string' ? input : JSON.stringify(input))]),
    configurable: true,
  });
  try {
    await run();
    return { stdout: output.join('\n'), stderr: errorOutput.join('\n') };
  } finally {
    console.log = originalLog;
    console.error = originalError;
    for (const [key, value] of Object.entries(previousEnv)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    Object.defineProperty(process, 'stdin', { value: originalStdin, configurable: true });
  }
}

async function runHookJson(run: () => Promise<void>, input: object | string) {
  return JSON.parse((await runWithInput(run, input)).stdout);
}

describe('hook adapter direct integration', () => {
  test('Claude Code hook blocks supported Bash commands', async () => {
    const output = await runHookJson(runClaudeCodeHook, claudeCodeBashInput('git reset --hard'));

    expect(output.hookSpecificOutput.permissionDecision).toBe('deny');
    expect(output.hookSpecificOutput.permissionDecisionReason).toContain('git reset --hard');
  });

  test('Gemini CLI hook ignores unsupported events', async () => {
    const output = await runWithInput(runGeminiCLIHook, {
      ...geminiShellInput('git reset --hard'),
      hook_event_name: 'AfterTool',
    });

    expect(output.stdout).toBe('');
  });

  test('Gemini CLI hook blocks supported shell commands', async () => {
    const output = await runHookJson(runGeminiCLIHook, geminiShellInput('git reset --hard'));

    expect(output.decision).toBe('deny');
    expect(output.reason).toContain('git reset --hard');
  });

  test('Kimi Code hook blocks supported Bash commands', async () => {
    const output = await runHookJson(runKimiCodeHook, kimiShellInput('git reset --hard'));

    expect(output.hookSpecificOutput.permissionDecision).toBe('deny');
    expect(output.hookSpecificOutput.permissionDecisionReason).toContain('git reset --hard');
  });

  test('Copilot CLI hook parses toolArgs before blocking bash commands', async () => {
    const output = await runHookJson(runCopilotCliHook, copilotBashInput('git reset --hard'));

    expect(output.permissionDecision).toBe('deny');
    expect(output.permissionDecisionReason).toContain('git reset --hard');
  });

  test('Copilot CLI hook fails closed for invalid toolArgs JSON', async () => {
    const output = await runHookJson(runCopilotCliHook, copilotRawToolArgsInput('{'));

    expect(output.permissionDecision).toBe('deny');
    expect(output.permissionDecisionReason).toContain('Failed to parse toolArgs JSON.');
  });

  test('missing stdin fails closed with platform deny output', async () => {
    const output = await runHookJson(runGeminiCLIHook, '');

    expect(output.decision).toBe('deny');
    expect(output.reason).toContain('Missing hook input JSON.');
  });

  test('allowed commands with debug sessions return no hook output', async () => {
    const output = await runWithInput(runKimiCodeHook, kimiShellInput('git status'), {
      CC_SAFETY_NET_DEBUG: '1',
    });

    expect(output.stdout).toBe('');
  });

  test('analysis errors fail closed through the shared handler', async () => {
    const cwd = mkdtempSync(join(tmpdir(), 'safety-net-hook-direct-bad-config-'));
    try {
      writeLockedGitHubRulebookPolicy(cwd, '{}', { cacheAsDirectory: true });
      const result = await runWithInput(runCopilotCliHook, {
        ...copilotBashInput('git status'),
        cwd,
      });
      const output = JSON.parse(result.stdout);

      expect(output.permissionDecision).toBe('deny');
      expect(output.permissionDecisionReason).toContain('failed to read cached rulebook');
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test('analysis exceptions are logged only in debug mode', async () => {
    const previousDebug = process.env.CC_SAFETY_NET_DEBUG;
    const originalError = console.error;
    const errors: string[] = [];
    const denials: string[] = [];
    process.env.CC_SAFETY_NET_DEBUG = '1';
    console.error = (...args: unknown[]) => errors.push(args.map(String).join(' '));
    try {
      handleBlockedHookCommand(null as never, process.cwd(), 'debug-session', (reason) =>
        denials.push(reason),
      );

      expect(denials[0]).toContain('CC Safety Net failed closed');
      expect(errors.join('\n')).toContain('CC Safety Net debug: hook analysis failed:');
    } finally {
      console.error = originalError;
      if (previousDebug === undefined) {
        delete process.env.CC_SAFETY_NET_DEBUG;
      } else {
        process.env.CC_SAFETY_NET_DEBUG = previousDebug;
      }
    }
  });
});
