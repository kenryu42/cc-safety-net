import { describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { runClaudeCodeHook } from '@/bin/hook/claude-code';
import { runCopilotCliHook } from '@/bin/hook/copilot-cli';
import { runGeminiCLIHook } from '@/bin/hook/gemini-cli';
import { runKimiCliHook } from '@/bin/hook/kimi-cli';
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
  const originalStdin = process.stdin;
  const previousEnv = Object.fromEntries(
    Object.keys(env ?? {}).map((key) => [key, process.env[key]]),
  );
  const output: string[] = [];
  console.log = (...args: unknown[]) => output.push(args.map(String).join(' '));
  Object.assign(process.env, env);
  Object.defineProperty(process, 'stdin', {
    value: Readable.from([Buffer.from(typeof input === 'string' ? input : JSON.stringify(input))]),
    configurable: true,
  });
  try {
    await run();
    return output.join('\n');
  } finally {
    console.log = originalLog;
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

describe('hook adapter direct integration', () => {
  test('Claude Code hook blocks supported Bash commands', async () => {
    const output = JSON.parse(
      await runWithInput(runClaudeCodeHook, claudeCodeBashInput('git reset --hard')),
    );

    expect(output.hookSpecificOutput.permissionDecision).toBe('deny');
    expect(output.hookSpecificOutput.permissionDecisionReason).toContain('git reset --hard');
  });

  test('Gemini CLI hook ignores unsupported events', async () => {
    const output = await runWithInput(runGeminiCLIHook, {
      ...geminiShellInput('git reset --hard'),
      hook_event_name: 'AfterTool',
    });

    expect(output).toBe('');
  });

  test('Gemini CLI hook blocks supported shell commands', async () => {
    const output = JSON.parse(
      await runWithInput(runGeminiCLIHook, geminiShellInput('git reset --hard')),
    );

    expect(output.decision).toBe('deny');
    expect(output.reason).toContain('git reset --hard');
  });

  test('Kimi CLI hook blocks supported Shell commands', async () => {
    const output = JSON.parse(
      await runWithInput(runKimiCliHook, kimiShellInput('git reset --hard')),
    );

    expect(output.hookSpecificOutput.permissionDecision).toBe('deny');
    expect(output.hookSpecificOutput.permissionDecisionReason).toContain('git reset --hard');
  });

  test('Copilot CLI hook parses toolArgs before blocking bash commands', async () => {
    const output = JSON.parse(
      await runWithInput(runCopilotCliHook, copilotBashInput('git reset --hard')),
    );

    expect(output.permissionDecision).toBe('deny');
    expect(output.permissionDecisionReason).toContain('git reset --hard');
  });

  test('Copilot CLI hook fails closed for invalid toolArgs JSON', async () => {
    const output = JSON.parse(await runWithInput(runCopilotCliHook, copilotRawToolArgsInput('{')));

    expect(output.permissionDecision).toBe('deny');
    expect(output.permissionDecisionReason).toContain('Failed to parse toolArgs JSON.');
  });

  test('missing stdin fails closed with platform deny output', async () => {
    const output = JSON.parse(await runWithInput(runGeminiCLIHook, ''));

    expect(output.decision).toBe('deny');
    expect(output.reason).toContain('Missing hook input JSON.');
  });

  test('allowed commands with debug sessions return no hook output', async () => {
    const output = await runWithInput(runKimiCliHook, kimiShellInput('git status'), {
      CC_SAFETY_NET_DEBUG: '1',
    });

    expect(output).toBe('');
  });

  test('analysis errors fail closed through the shared handler', async () => {
    const cwd = mkdtempSync(join(tmpdir(), 'safety-net-hook-direct-bad-config-'));
    try {
      writeLockedGitHubRulebookPolicy(cwd, '{}', { cacheAsDirectory: true });
      const output = JSON.parse(
        await runWithInput(runCopilotCliHook, {
          ...copilotBashInput('git status'),
          cwd,
        }),
      );

      expect(output.permissionDecision).toBe('deny');
      expect(output.permissionDecisionReason).toContain('failed to read cached rulebook');
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});
