import { expect } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Shared test helpers for CLI hook integration tests.
 */

export type HookResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

export const TEST_HOOK_CWD = mkdtempSync(join(tmpdir(), 'safety-net-hook-cwd-'));

process.on('exit', () => {
  rmSync(TEST_HOOK_CWD, { recursive: true, force: true });
});

export function copilotBashInput(command: string) {
  return {
    timestamp: Date.now(),
    cwd: TEST_HOOK_CWD,
    toolName: 'bash',
    toolArgs: JSON.stringify({ command }),
  };
}

export function copilotRawToolArgsInput(toolArgs: string) {
  return {
    timestamp: Date.now(),
    cwd: TEST_HOOK_CWD,
    toolName: 'bash',
    toolArgs,
  };
}

export function geminiShellInput(command: string) {
  return {
    hook_event_name: 'BeforeTool',
    cwd: TEST_HOOK_CWD,
    tool_name: 'run_shell_command',
    tool_input: { command },
  };
}

export function claudeCodeBashInput(command: string) {
  return {
    hook_event_name: 'PreToolUse',
    cwd: TEST_HOOK_CWD,
    tool_name: 'Bash',
    tool_input: { command },
  };
}

export function kimiShellInput(command: string) {
  return {
    hook_event_name: 'PreToolUse',
    session_id: 'kimi-test-session',
    cwd: TEST_HOOK_CWD,
    tool_name: 'Shell',
    tool_input: { command },
    tool_call_id: 'kimi-test-tool-call',
  };
}

/**
 * Runs a hook CLI with the given input and optional environment variables.
 * @param flag - Hook platform flag (e.g., '--claude-code', '-gc', '-cp')
 * @param input - Raw string input to send to stdin
 * @param env - Optional environment variables to set
 */
export async function runHook(
  flag: string,
  input: string,
  env?: Record<string, string>,
): Promise<HookResult> {
  return runCli(['hook', flag], input, env);
}

export async function runCli(
  args: readonly string[],
  input: string = '',
  env?: Record<string, string>,
): Promise<HookResult> {
  const baseEnv: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) {
      baseEnv[key] = value;
    }
  }

  const mergedEnv: Record<string, string> = {
    ...baseEnv,
    HOME: join(TEST_HOOK_CWD, 'home'),
    ...(env ?? {}),
  };

  const proc = Bun.spawn(['bun', join(process.cwd(), 'src/bin/cc-safety-net.ts'), ...args], {
    stdin: 'pipe',
    stdout: 'pipe',
    stderr: 'pipe',
    env: mergedEnv,
    cwd: TEST_HOOK_CWD,
  });
  proc.stdin.write(input);
  proc.stdin.end();
  const stdoutPromise = new Response(proc.stdout).text();
  const stderrPromise = new Response(proc.stderr).text();
  const [stdout, stderr] = await Promise.all([stdoutPromise, stderrPromise]);
  const exitCode = await proc.exited;
  return { stdout: stdout.trim(), stderr: stderr.trim(), exitCode };
}

export async function expectNoHookOutput(
  run: (input: object | string, env?: Record<string, string>) => Promise<HookResult>,
  input: object | string,
  env?: Record<string, string>,
): Promise<void> {
  const { stdout, exitCode } = await run(input, env);
  expect(stdout).toBe('');
  expect(exitCode).toBe(0);
}

/**
 * Runs the Claude Code hook.
 */
export async function runClaudeCodeHook(
  input: object | string,
  env?: Record<string, string>,
): Promise<HookResult> {
  const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
  return runHook('--claude-code', inputStr, env);
}

/**
 * Runs the Gemini CLI hook.
 */
export async function runGeminiHook(
  input: object | string,
  env?: Record<string, string>,
): Promise<HookResult> {
  const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
  return runHook('-gc', inputStr, env);
}

/**
 * Runs the Kimi CLI hook.
 */
export async function runKimiHook(
  input: object | string,
  env?: Record<string, string>,
): Promise<HookResult> {
  const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
  return runHook('-kc', inputStr, env);
}

/**
 * Runs the Copilot CLI hook.
 */
export async function runCopilotHook(
  input: object | string,
  env?: Record<string, string>,
): Promise<HookResult> {
  const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
  return runHook('-cp', inputStr, env);
}
