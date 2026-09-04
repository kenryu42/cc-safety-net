import { expect } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PassThrough, Readable, Writable } from 'node:stream';
import { promptInstallTargets, promptKimiInstallMethod } from '@/cli/install/prompt';
import { runAntigravityCliHook } from '@/integrations/antigravity-cli/hook';
import { runClaudeCodeHook as runClaudeCodeHookAdapter } from '@/integrations/claude-code/hook';
import { runCopilotCliHook } from '@/integrations/copilot-cli/hook';
import { runCursorHook } from '@/integrations/cursor/hook';
import { runGeminiCLIHook } from '@/integrations/gemini-cli/hook';
import { runGrokBuildHook } from '@/integrations/grok-build/hook';
import { runHermesAgentHook } from '@/integrations/hermes-agent/hook';
import type { InstallTargetChoice } from '@/integrations/install/choices';
import type { InstallAction } from '@/integrations/install/targets';
import { runKimiCodeHook } from '@/integrations/kimi-code/hook';
import { createSpawnEnv } from '../helpers';

/**
 * Shared test helpers for CLI hook integration tests.
 */

export type HookResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

export type HookFormat =
  | 'antigravity-cli'
  | 'claude-code'
  | 'copilot-cli'
  | 'cursor'
  | 'gemini-cli'
  | 'grok-build'
  | 'hermes-agent'
  | 'kimi-code';

export const TEST_HOOK_CWD = mkdtempSync(join(tmpdir(), 'safety-net-hook-cwd-'));

export function makeTempHome(name: string) {
  return mkdtempSync(join(tmpdir(), `${name}-`));
}

/**
 * Fake TTY stream pair for driving the install selection prompt: `input.emit('keypress', ...)`
 * feeds keys, and `chunks` collects every rendered frame.
 */
export function createInstallPromptStreams() {
  const chunks: string[] = [];
  const input = new PassThrough() as unknown as NodeJS.ReadStream;
  const output = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(String(chunk));
      callback();
    },
  }) as NodeJS.WriteStream;

  input.isTTY = true;
  input.setRawMode = (mode) => {
    input.isRaw = mode;
    return input;
  };
  input.isRaw = false;
  output.isTTY = true;

  return { chunks, input, output };
}

/** What Node's readline emits for each key the install selection prompt understands. */
const INSTALL_PROMPT_KEYS = {
  ' ': [' ', { name: 'space' }],
  U: ['U', { name: 'u', shift: true }],
  'ctrl-c': ['\x03', { ctrl: true, name: 'c', sequence: '\x03' }],
  down: ['', { name: 'down' }],
  enter: ['', { name: 'return' }],
  esc: ['', { name: 'escape' }],
  j: ['j', { name: 'j' }],
  k: ['k', { name: 'k' }],
  q: ['q', { name: 'q' }],
  u: ['u', { name: 'u' }],
  up: ['', { name: 'up' }],
  x: ['x', { name: 'x' }],
} as const satisfies Record<string, readonly [string, Record<string, unknown>]>;

/**
 * Starts a prompt on fake TTY streams. `press` feeds keys in order, and `result` resolves
 * with the prompt outcome once a key ends it.
 */
function startPrompt<T>(
  run: (streams: ReturnType<typeof createInstallPromptStreams>) => Promise<T>,
) {
  const streams = createInstallPromptStreams();
  return {
    chunks: streams.chunks,
    input: streams.input,
    press: (...keys: readonly (keyof typeof INSTALL_PROMPT_KEYS)[]) => {
      for (const key of keys) streams.input.emit('keypress', ...INSTALL_PROMPT_KEYS[key]);
    },
    result: run(streams),
  };
}

export function startInstallPrompt(
  action: InstallAction,
  choices: readonly InstallTargetChoice[],
  options: { onInterrupt?: () => void } = {},
) {
  return startPrompt((streams) =>
    promptInstallTargets(action, choices, {
      input: streams.input,
      output: streams.output,
      ...options,
    }),
  );
}

/** Starts the Kimi install method prompt on fake TTY streams, mirroring startInstallPrompt. */
export function startKimiMethodPrompt(
  options: { onInterrupt?: () => void; globalHookInstalled?: boolean } = {},
) {
  return startPrompt((streams) =>
    promptKimiInstallMethod({
      input: streams.input,
      output: streams.output,
      ...options,
    }),
  );
}

process.on('exit', () => {
  rmSync(TEST_HOOK_CWD, { recursive: true, force: true });
});

export type HookTestContext = {
  cwd: string;
  home: string;
  copilotBashInput: typeof copilotBashInput;
  copilotRawToolArgsInput: typeof copilotRawToolArgsInput;
  antigravityShellInput: typeof antigravityShellInput;
  geminiShellInput: typeof geminiShellInput;
  claudeCodeBashInput: typeof claudeCodeBashInput;
  grokBuildShellInput: typeof grokBuildShellInput;
  hermesTerminalInput: typeof hermesTerminalInput;
  kimiShellInput: typeof kimiShellInput;
  cursorShellInput: typeof cursorShellInput;
  runCli: typeof runCli;
  runAntigravityHook: typeof runAntigravityHook;
  runClaudeCodeHook: typeof runClaudeCodeHookDirect;
  runGeminiHook: typeof runGeminiHook;
  runGrokBuildHook: typeof runGrokBuildHookDirect;
  runHermesHook: typeof runHermesHookDirect;
  runKimiHook: typeof runKimiHook;
  runCopilotHook: typeof runCopilotHook;
  runCursorHook: typeof runCursorHookDirect;
};

export function writeUserPolicy(home: string, policy: unknown): void {
  mkdirSync(join(home, '.cc-safety-net'), { recursive: true });
  writeFileSync(join(home, '.cc-safety-net', 'policy.json'), JSON.stringify(policy), 'utf-8');
}

export async function withHookTestContext<T>(fn: (context: HookTestContext) => T | Promise<T>) {
  const cwd = mkdtempSync(join(tmpdir(), 'safety-net-hook-cwd-'));
  const home = join(cwd, 'home');
  const safetyNetHome = join(home, '.cc-safety-net');
  try {
    return await fn({
      cwd,
      home,
      copilotBashInput: (command) => copilotBashInput(command, cwd),
      copilotRawToolArgsInput: (toolArgs) => copilotRawToolArgsInput(toolArgs, cwd),
      antigravityShellInput: (command) => antigravityShellInput(command, cwd),
      geminiShellInput: (command) => geminiShellInput(command, cwd),
      claudeCodeBashInput: (command) => claudeCodeBashInput(command, cwd),
      grokBuildShellInput: (command) => grokBuildShellInput(command, cwd),
      hermesTerminalInput: (command) => hermesTerminalInput(command, cwd),
      kimiShellInput: (command) => kimiShellInput(command, cwd),
      cursorShellInput: (command) => cursorShellInput(command, cwd),
      runCli: (args, input = '', env) =>
        runCli(args, input, { HOME: home, CC_SAFETY_NET_HOME: safetyNetHome, ...(env ?? {}) }, cwd),
      runClaudeCodeHook: (input, env) =>
        runClaudeCodeHookDirect(
          input,
          { HOME: home, CC_SAFETY_NET_HOME: safetyNetHome, ...(env ?? {}) },
          cwd,
        ),
      runGeminiHook: (input, env) =>
        runGeminiHookDirect(
          input,
          { HOME: home, CC_SAFETY_NET_HOME: safetyNetHome, ...(env ?? {}) },
          cwd,
        ),
      runGrokBuildHook: (input, env) =>
        runGrokBuildHookDirect(
          input,
          { HOME: home, CC_SAFETY_NET_HOME: safetyNetHome, ...(env ?? {}) },
          cwd,
        ),
      runHermesHook: (input, env) =>
        runHermesHookDirect(
          input,
          { HOME: home, CC_SAFETY_NET_HOME: safetyNetHome, ...(env ?? {}) },
          cwd,
        ),
      runKimiHook: (input, env) =>
        runKimiHookDirect(
          input,
          { HOME: home, CC_SAFETY_NET_HOME: safetyNetHome, ...(env ?? {}) },
          cwd,
        ),
      runCopilotHook: (input, env) =>
        runCopilotHookDirect(
          input,
          { HOME: home, CC_SAFETY_NET_HOME: safetyNetHome, ...(env ?? {}) },
          cwd,
        ),
      runAntigravityHook: (input, env) =>
        runAntigravityHookDirect(
          input,
          { HOME: home, CC_SAFETY_NET_HOME: safetyNetHome, ...(env ?? {}) },
          cwd,
        ),
      runCursorHook: (input, env) =>
        runCursorHookDirect(
          input,
          { HOME: home, CC_SAFETY_NET_HOME: safetyNetHome, ...(env ?? {}) },
          cwd,
        ),
    });
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}

export function copilotBashInput(command: string, cwd = TEST_HOOK_CWD) {
  return {
    sessionId: 'copilot-test-session',
    timestamp: Date.now(),
    cwd,
    toolName: 'bash',
    toolArgs: JSON.stringify({ command }),
  };
}

export function copilotRawToolArgsInput(toolArgs: string, cwd = TEST_HOOK_CWD) {
  return {
    sessionId: 'copilot-test-session',
    timestamp: Date.now(),
    cwd,
    toolName: 'bash',
    toolArgs,
  };
}

export function antigravityShellInput(command: string, cwd = TEST_HOOK_CWD) {
  return {
    toolCall: {
      name: 'run_command',
      args: {
        CommandLine: command,
        Cwd: cwd,
        WaitMsBeforeAsync: 1000,
      },
    },
    stepIdx: 0,
    conversationId: 'antigravity-test-session',
    workspacePaths: [cwd],
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

export function grokBuildShellInput(command: string, cwd = TEST_HOOK_CWD) {
  return {
    hookEventName: 'pre_tool_use',
    sessionId: 'grok-build-test-session',
    cwd,
    workspaceRoot: cwd,
    toolName: 'run_terminal_command',
    toolUseId: 'grok-build-test-tool-call',
    toolInput: { command },
    toolInputTruncated: false,
  };
}

export function hermesTerminalInput(command: string, cwd = TEST_HOOK_CWD) {
  return {
    hook_event_name: 'pre_tool_call',
    tool_name: 'terminal',
    tool_input: { command },
    session_id: 'hermes-test-session',
    cwd,
    extra: { task_id: 'hermes-test-task', tool_call_id: 'hermes-test-tool-call' },
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

export function cursorShellInput(command: string, cwd = TEST_HOOK_CWD) {
  return {
    conversation_id: 'cursor-test-session',
    hook_event_name: 'preToolUse',
    cwd,
    workspace_roots: [cwd],
    tool_name: 'Shell',
    tool_input: { command },
  };
}

export function cursorFileInput(
  toolName: string,
  toolInput: Record<string, unknown>,
  cwd = TEST_HOOK_CWD,
) {
  return {
    conversation_id: 'cursor-test-session',
    hook_event_name: 'preToolUse',
    cwd,
    workspace_roots: [cwd],
    tool_name: toolName,
    tool_input: toolInput,
  };
}

/**
 * Runs a hook CLI with the given input and optional environment variables.
 * @param flag - Hook platform flag (e.g., '--coding-cli', '-gc', '-cp')
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
  const home = env?.HOME ?? join(cwd, 'home');
  const proc = Bun.spawn(
    [process.execPath, join(process.cwd(), 'src/cli/cc-safety-net.ts'), ...args],
    {
      stdin: 'pipe',
      stdout: 'pipe',
      stderr: 'pipe',
      env: createSpawnEnv({
        HOME: home,
        CC_SAFETY_NET_AUDIT_HOME: env?.CC_SAFETY_NET_AUDIT_HOME ?? home,
        ...(env ?? {}),
      }),
      cwd,
    },
  );
  proc.stdin.write(input);
  proc.stdin.end();
  const stdoutPromise = new Response(proc.stdout).text();
  const stderrPromise = new Response(proc.stderr).text();
  const [stdout, stderr] = await Promise.all([stdoutPromise, stderrPromise]);
  const exitCode = await proc.exited;
  return { stdout: stdout.trim(), stderr: stderr.trim(), exitCode };
}

let directHookQueue = Promise.resolve();

function runHookDirect(
  run: () => Promise<void>,
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
): Promise<HookResult> {
  const execute = async () => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalStdin = process.stdin;
    const originalCwd = process.cwd();
    const home = env?.HOME ?? join(cwd, 'home');
    const effectiveEnv = {
      HOME: home,
      CC_SAFETY_NET_AUDIT_HOME: env?.CC_SAFETY_NET_AUDIT_HOME ?? home,
      ...(env ?? {}),
    };
    const originalEnv = Object.fromEntries(
      Object.keys(effectiveEnv).map((key) => [key, process.env[key]]),
    );
    const stdout: string[] = [];
    const stderr: string[] = [];

    console.log = (...args: unknown[]) => stdout.push(args.map(String).join(' '));
    console.error = (...args: unknown[]) => stderr.push(args.map(String).join(' '));
    Object.assign(process.env, effectiveEnv);
    process.chdir(cwd);
    Object.defineProperty(process, 'stdin', {
      value: Readable.from([
        Buffer.from(typeof input === 'string' ? input : JSON.stringify(input)),
      ]),
      configurable: true,
    });

    try {
      await run();
      return { stdout: stdout.join('\n').trim(), stderr: stderr.join('\n').trim(), exitCode: 0 };
    } finally {
      console.log = originalLog;
      console.error = originalError;
      process.chdir(originalCwd);
      Object.defineProperty(process, 'stdin', { value: originalStdin, configurable: true });
      for (const [key, value] of Object.entries(originalEnv)) {
        if (value === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = value;
        }
      }
    }
  };
  const result = directHookQueue.then(execute);
  directHookQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

export function runClaudeCodeHookDirect(
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
) {
  return runHookDirect(runClaudeCodeHookAdapter, input, env, cwd);
}

export function runGeminiHookDirect(
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
) {
  return runHookDirect(runGeminiCLIHook, input, env, cwd);
}

export function runGrokBuildHookDirect(
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
) {
  return runHookDirect(runGrokBuildHook, input, env, cwd);
}

export function runHermesHookDirect(
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
) {
  return runHookDirect(runHermesAgentHook, input, env, cwd);
}

export function runKimiHookDirect(
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
) {
  return runHookDirect(runKimiCodeHook, input, env, cwd);
}

export function runCopilotHookDirect(
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
) {
  return runHookDirect(runCopilotCliHook, input, env, cwd);
}

export function runAntigravityHookDirect(
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
) {
  return runHookDirect(runAntigravityCliHook, input, env, cwd);
}

export function runCursorHookDirect(
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
) {
  return runHookDirect(runCursorHook, input, env, cwd);
}

export function expectCursorAllowOutput(result: HookResult): void {
  expect(result.exitCode).toBe(0);
  expect(JSON.parse(result.stdout)).toEqual({ permission: 'allow' });
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

  if (format === 'antigravity-cli') {
    expect(output.decision).toBe('deny');
    return output.reason;
  }

  if (format === 'grok-build') {
    expect(output.decision).toBe('deny');
    return output.reason;
  }

  if (format === 'hermes-agent') {
    expect(output.action).toBe('block');
    return output.message;
  }

  if (format === 'cursor') {
    expect(output.permission).toBe('deny');
    expect(output.agent_message).toBe(output.user_message);
    return output.user_message;
  }

  expect(output.hookSpecificOutput.permissionDecision).toBe('deny');
  return output.hookSpecificOutput.permissionDecisionReason;
}

export function expectSecretProtectionDeny(result: HookResult, format: HookFormat): void {
  const reason = getHookDenyReason(result, format);
  expect(reason).toContain('BLOCKED by CC Safety Net');
  expect(reason).toContain('Access to a sensitive path is not allowed.');
  expect(reason).toContain('Command:');
  expect(reason).not.toContain('ask the user for explicit permission');
}

/**
 * Runs the Coding CLI hook.
 */
export async function runCodingCliHook(
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
): Promise<HookResult> {
  const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
  return runHook('--coding-cli', inputStr, env, cwd);
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
 * Runs the GitHub Copilot CLI hook.
 */
export async function runCopilotHook(
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
): Promise<HookResult> {
  const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
  return runHook('-cp', inputStr, env, cwd);
}

/**
 * Runs the Antigravity CLI hook.
 */
export async function runAntigravityHook(
  input: object | string,
  env?: Record<string, string>,
  cwd = TEST_HOOK_CWD,
): Promise<HookResult> {
  const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
  return runHook('-ac', inputStr, env, cwd);
}
