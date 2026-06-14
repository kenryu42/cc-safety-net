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

export type HookFormat = 'claude-code' | 'copilot-cli' | 'gemini-cli' | 'kimi-code';

export const TEST_HOOK_CWD = mkdtempSync(join(tmpdir(), 'safety-net-hook-cwd-'));

process.on('exit', () => {
  rmSync(TEST_HOOK_CWD, { recursive: true, force: true });
});

export type HookTestContext = {
  cwd: string;
  home: string;
  copilotBashInput: typeof copilotBashInput;
  copilotRawToolArgsInput: typeof copilotRawToolArgsInput;
  geminiShellInput: typeof geminiShellInput;
  claudeCodeBashInput: typeof claudeCodeBashInput;
  kimiShellInput: typeof kimiShellInput;
  runCli: typeof runCli;
  runClaudeCodeHook: typeof runClaudeCodeHook;
  runGeminiHook: typeof runGeminiHook;
  runKimiHook: typeof runKimiHook;
  runCopilotHook: typeof runCopilotHook;
};

export async function withHookTestContext<T>(fn: (context: HookTestContext) => T | Promise<T>) {
  const cwd = mkdtempSync(join(tmpdir(), 'safety-net-hook-cwd-'));
  const home = join(cwd, 'home');
  try {
    return await fn({
      cwd,
      home,
      copilotBashInput: (command) => copilotBashInput(command, cwd),
      copilotRawToolArgsInput: (toolArgs) => copilotRawToolArgsInput(toolArgs, cwd),
      geminiShellInput: (command) => geminiShellInput(command, cwd),
      claudeCodeBashInput: (command) => claudeCodeBashInput(command, cwd),
      kimiShellInput: (command) => kimiShellInput(command, cwd),
      runCli: (args, input = '', env) => runCli(args, input, { HOME: home, ...(env ?? {}) }, cwd),
      runClaudeCodeHook: (input, env) =>
        runClaudeCodeHook(input, { HOME: home, ...(env ?? {}) }, cwd),
      runGeminiHook: (input, env) => runGeminiHook(input, { HOME: home, ...(env ?? {}) }, cwd),
      runKimiHook: (input, env) => runKimiHook(input, { HOME: home, ...(env ?? {}) }, cwd),
      runCopilotHook: (input, env) => runCopilotHook(input, { HOME: home, ...(env ?? {}) }, cwd),
    });
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}

export function copilotBashInput(command: string, cwd = TEST_HOOK_CWD) {
  return {
    timestamp: Date.now(),
    cwd,
    toolName: 'bash',
    toolArgs: JSON.stringify({ command }),
  };
}

export function copilotRawToolArgsInput(toolArgs: string, cwd = TEST_HOOK_CWD) {
  return {
    timestamp: Date.now(),
    cwd,
    toolName: 'bash',
    toolArgs,
  };
}

export function geminiShellInput(command: string, cwd = TEST_HOOK_CWD) {
  return {
    hook_event_name: 'BeforeTool',
    cwd,
    tool_name: 'run_shell_command',
    tool_input: { command },
  };
}

export function claudeCodeBashInput(command: string, cwd = TEST_HOOK_CWD) {
  return {
    hook_event_name: 'PreToolUse',
    cwd,
    tool_name: 'Bash',
    tool_input: { command },
  };
}

export function kimiShellInput(command: string, cwd = TEST_HOOK_CWD) {
  return {
    hook_event_name: 'PreToolUse',
    session_id: 'kimi-test-session',
    cwd,
    tool_name: 'Bash',
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
  cwd = TEST_HOOK_CWD,
): Promise<HookResult> {
  return runCli(['hook', flag], input, env, cwd);
}

export async function runCli(
  args: readonly string[],
  input: string = '',
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
): Promise<HookResult> {
  const baseEnv: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) {
      baseEnv[key] = value;
    }
  }

  const mergedEnv: Record<string, string> = {
    ...baseEnv,
    HOME: join(cwd, 'home'),
    ...(env ?? {}),
  };

  const proc = Bun.spawn(['bun', join(process.cwd(), 'src/bin/cc-safety-net.ts'), ...args], {
    stdin: 'pipe',
    stdout: 'pipe',
    stderr: 'pipe',
    env: mergedEnv,
    cwd,
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

export function getHookDenyReason(result: HookResult, format: HookFormat): string {
  expect(result.exitCode).toBe(0);
  const output = JSON.parse(result.stdout);

  if (format === 'gemini-cli') {
    expect(output.decision).toBe('deny');
    return output.reason;
  }

  if (format === 'copilot-cli') {
    expect(output.permissionDecision).toBe('deny');
    return output.permissionDecisionReason;
  }

  expect(output.hookSpecificOutput.permissionDecision).toBe('deny');
  return output.hookSpecificOutput.permissionDecisionReason;
}

/**
 * Runs the Claude Code hook.
 */
export async function runClaudeCodeHook(
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
): Promise<HookResult> {
  const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
  return runHook('--claude-code', inputStr, env, cwd);
}

/**
 * Runs the Gemini CLI hook.
 */
export async function runGeminiHook(
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
): Promise<HookResult> {
  const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
  return runHook('-gc', inputStr, env, cwd);
}

/**
 * Runs the Kimi Code hook.
 */
export async function runKimiHook(
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
): Promise<HookResult> {
  const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
  return runHook('-kc', inputStr, env, cwd);
}

/**
 * Runs the Copilot CLI hook.
 */
export async function runCopilotHook(
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
): Promise<HookResult> {
  const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
  return runHook('-cp', inputStr, env, cwd);
}
