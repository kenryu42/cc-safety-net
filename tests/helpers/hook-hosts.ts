import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { LIMITS, REASON_SAFETY_NET_FAILED_CLOSED } from '@/core/budget';
import { createCwdDenial, createMalformedToolCallDenial } from '@/core/denial';
import { createProcessEnvironment } from '@/core/environment';
import { getUserPolicyPath } from '@/core/policy/paths';
import { REASON_STRICT_UNPARSEABLE } from '@/gate/analyzer/reasons';
import { runAntigravityCliHook as portedAntigravityCliHook } from '@/hosts/antigravity-cli/hook';
import { runClaudeCodeHook as portedClaudeCodeHook } from '@/hosts/claude-code/hook';
import { runCodexHook as portedCodexHook } from '@/hosts/codex/hook';
import { runCopilotCliHook as portedCopilotCliHook } from '@/hosts/copilot-cli/hook';
import { runCursorHook as portedCursorHook } from '@/hosts/cursor/hook';
import { runDevinHook as portedDevinHook } from '@/hosts/devin/hook';
import { runDroidHook as portedDroidHook } from '@/hosts/droid/hook';
import { runGeminiCLIHook as portedGeminiCLIHook } from '@/hosts/gemini-cli/hook';
import { runGrokBuildHook as portedGrokBuildHook } from '@/hosts/grok-build/hook';
import { runHermesAgentHook as portedHermesAgentHook } from '@/hosts/hermes-agent/hook';
import { runKimiCodeHook as portedKimiCodeHook } from '@/hosts/kimi-code/hook';
import { withEnv } from '../helpers';

export type HookOutcome = {
  document: 'none' | 'allow' | 'deny';
  audit: 'allow' | 'deny' | 'none';
  ruleId?: string;
  reason?: string;
  stderr?: number;
  exitCode?: number;
};

export type HookRow = {
  name: string;
  stdin: string | Uint8Array;
  env?: Record<string, string | undefined>;
  processCwd?: string;
  expected: HookOutcome;
};

const cwdReason = (directory: 'session' | 'requested', problem: 'unusable' | 'outside-workspace') =>
  createCwdDenial({ directory, problem, cwd: '' }).reason;

const MALFORMED = {
  document: 'deny',
  audit: 'deny',
  ruleId: 'tool-call.malformed',
  reason: createMalformedToolCallDenial().reason,
} as const;
const FAILED_CLOSED = {
  document: 'deny',
  audit: 'deny',
  ruleId: 'analysis.failed-closed',
  reason: REASON_SAFETY_NET_FAILED_CLOSED,
} as const;
const SESSION_UNUSABLE = {
  document: 'deny',
  audit: 'deny',
  reason: cwdReason('session', 'unusable'),
} as const;
const SESSION_OUTSIDE = {
  document: 'deny',
  audit: 'deny',
  reason: cwdReason('session', 'outside-workspace'),
} as const;
const REQUESTED_UNUSABLE = {
  document: 'deny',
  audit: 'deny',
  reason: cwdReason('requested', 'unusable'),
} as const;
const REQUESTED_OUTSIDE = {
  document: 'deny',
  audit: 'deny',
  reason: cwdReason('requested', 'outside-workspace'),
} as const;

const OUTCOMES: Readonly<Record<string, HookOutcome>> = {
  'a denied command': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'git.push-force',
  },
  'an allowed command': { document: 'none', audit: 'allow' },
  'an allowed command under the blocked-only audit scope': {
    document: 'none',
    audit: 'none',
  },
  'an event the host does not handle': { document: 'none', audit: 'none' },
  'a payload that is not JSON': { document: 'deny', audit: 'none' },
  'an empty payload': { document: 'deny', audit: 'none' },
  'a payload that is an array': { document: 'deny', audit: 'none' },
  'a payload past the input byte limit': { document: 'deny', audit: 'none' },
  'a payload without a tool name': MALFORMED,
  'a payload with a blank tool name': MALFORMED,
  'a read tool over a relative path': { document: 'none', audit: 'none' },
  'a read tool over a private key': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'secret.home.ssh',
  },
  'a payload without a cwd': { document: 'none', audit: 'allow' },
  'a cwd that is a regular file': SESSION_UNUSABLE,
  'a cwd that does not exist': SESSION_UNUSABLE,
  'a denied command under a malformed user policy': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'git.reset-hard',
  },
  'a command that breaches an analysis limit': {
    document: 'deny',
    audit: 'deny',
  },
  'a command past the structural shell-syntax limit': {
    document: 'deny',
    audit: 'deny',
  },
  'a command that cannot be parsed': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'analysis.strict-unparseable',
    reason: REASON_STRICT_UNPARSEABLE,
  },
  'a command that breaches an analysis limit with debug output on': {
    document: 'deny',
    audit: 'deny',
    stderr: 1,
  },
  'a denied PowerShell command': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'powershell.remove-item-recursive-force-root-or-home',
  },
  'an allowed PowerShell command': { document: 'none', audit: 'allow' },
  'a destructive Monitor command': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'git.reset-hard',
  },
  'a Monitor watch without a command': { document: 'none', audit: 'none' },
  'a PowerShell removal Copilot sends as Bash': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'powershell.remove-item-recursive-force-root-or-home',
  },
  'a denied command in object tool args': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'git.reset-hard',
  },
  'an allowed command in object tool args': {
    document: 'none',
    audit: 'allow',
  },
  'a raw apply_patch string onto a private key': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'secret.home.ssh',
  },
  'a JSON-encoded apply_patch string onto a private key': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'secret.home.ssh',
  },
  'a Grep over a private key directory in paths': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'secret.home.ssh',
  },
  'an Edit whose input is a raw patch onto a private key': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'secret.home.ssh',
  },
  'a destructive monitor command': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'git.reset-hard',
  },
  'a Glob over dotenv files in patterns': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'secret.basename.env',
  },
  'a grep over private keys in glob_pattern': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'secret.ext.pem',
  },
  'a recursive delete from a home process cwd': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'rm.recursive-force-home-cwd',
  },
  'a destructive line written to a process': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'git.reset-hard',
  },
  'a keypress written to a process': { document: 'none', audit: 'none' },
  'a destructive line written to a process as key input': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'git.reset-hard',
  },
  'a prompt answer written to a process as key input': { document: 'none', audit: 'allow' },
  'an undocumented key token written to a process': FAILED_CLOSED,
  'a line written to a process as both text and key input': FAILED_CLOSED,
  'a line erased by a key before a destructive line': FAILED_CLOSED,
  'a line edited by backspace': FAILED_CLOSED,
  'an editor command after escape': FAILED_CLOSED,
  'an aborted line before a destructive line': FAILED_CLOSED,
  'a destructive line split by Ctrl-D': FAILED_CLOSED,
  'text written to a process followed by an editing key': FAILED_CLOSED,
  'text written to a process followed by Enter': { document: 'none', audit: 'allow' },
  'a recursive delete whose workdir is the home directory': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'rm.recursive-force-root-or-home',
  },
  'a transcript under the Codex home': { document: 'none', audit: 'allow' },
  'a transcript under the Copilot home': { document: 'none', audit: 'allow' },
  'a transcript under the Claude config directory': {
    document: 'none',
    audit: 'allow',
  },
  'no transcript under a Claude Code entrypoint': {
    document: 'none',
    audit: 'allow',
  },
  'a tool cwd inside the session cwd': { document: 'none', audit: 'allow' },
  'a tool cwd outside the session cwd': REQUESTED_OUTSIDE,
  'a tool cwd that does not exist': REQUESTED_UNUSABLE,
  'a blank tool cwd': MALFORMED,
  'a tool cwd that is not a string': MALFORMED,
  'a recursive delete from a home dir_path inside the session cwd': {
    document: 'none',
    audit: 'allow',
  },
  'a recursive delete whose dir_path is below the home session cwd': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'rm.recursive-force-home-cwd',
  },
  'a dir_path outside the session cwd': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'secret.home.ssh',
  },
  'a dir_path that does not exist': REQUESTED_UNUSABLE,
  'an empty dir_path': { document: 'none', audit: 'allow' },
  'a whitespace-only dir_path': MALFORMED,
  'a dir_path that is not a string': MALFORMED,
  'a grep_search whose dir_path is an npmrc file': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'secret.basename.npmrc',
  },
  'a grep_search over private keys in include_pattern': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'secret.basename.id-rsa',
  },
  'a list_directory over the ssh directory': { document: 'none', audit: 'none' },
  'a glob whose dir_path is the ssh directory': { document: 'none', audit: 'none' },
  'a read_file of an at-prefixed npmrc': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'secret.basename.npmrc',
  },
  'a read_file of an npmrc path holding a NUL byte': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'secret.basename.npmrc',
  },
  'a read_file of an at-prefixed name that exists as written': {
    document: 'none',
    audit: 'none',
  },
  'a read_file under an at-prefixed directory that exists': { document: 'none', audit: 'none' },
  'a read_file of an at-slash path into the ssh directory': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'secret.home.ssh',
  },
  'tool args that are not a string': { document: 'deny', audit: 'deny' },
  'tool args that are not JSON': { document: 'deny', audit: 'deny' },
  'a powershell command': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'powershell.remove-item-recursive-force-root-or-home',
  },
  'a blank session id': { document: 'none', audit: 'none' },
  'a working directory inside the workspace roots': {
    document: 'allow',
    audit: 'allow',
  },
  'a working directory outside the workspace roots': REQUESTED_OUTSIDE,
  'a working directory that does not exist': REQUESTED_UNUSABLE,
  'a blank working directory': MALFORMED,
  'no workspace roots': FAILED_CLOSED,
  'workspace roots that do not exist': SESSION_UNUSABLE,
  'a cwd outside the workspace roots': SESSION_OUTSIDE,
  'a Cwd inside the workspace paths': { document: 'none', audit: 'allow' },
  'a Cwd outside the workspace paths': REQUESTED_OUTSIDE,
  'a Cwd that does not exist': REQUESTED_UNUSABLE,
  'a Cwd whose name starts with two dots inside the workspace paths': {
    document: 'none',
    audit: 'allow',
  },
  'no workspace paths': FAILED_CLOSED,
  'a blank Cwd': MALFORMED,
  'a destructive line sent to a background task': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'git.reset-hard',
  },
  'a background task status check': { document: 'none', audit: 'none' },
  'view targets past the path-canonicalization budget': {
    document: 'deny',
    audit: 'deny',
  },
  'tool input the host truncated': { document: 'deny', audit: 'deny' },
  'a cwd inside the workspace root': { document: 'allow', audit: 'allow' },
  'a cwd outside the workspace root': SESSION_OUTSIDE,
  'a destructive run_terminal_cmd command': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'git.reset-hard',
  },
  'a destructive bash command': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'git.reset-hard',
  },
  'a destructive Shell command': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'git.reset-hard',
  },
  'a bash workdir outside the workspace root': REQUESTED_OUTSIDE,
  'a bash workdir relative to the session cwd': { document: 'allow', audit: 'allow' },
  'a blank bash workdir': MALFORMED,
  'a Shell working_directory inside the workspace root': { document: 'allow', audit: 'allow' },
  'a Shell working_directory outside the workspace root': REQUESTED_OUTSIDE,
  'a bash delete of its own workdir': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'rm.recursive-force-cwd-self',
  },
  'a Shell delete of its own working_directory': {
    document: 'deny',
    audit: 'deny',
    ruleId: 'rm.recursive-force-cwd-self',
  },
  'a workdir that exists': { document: 'none', audit: 'allow' },
  'a workdir that does not exist': REQUESTED_UNUSABLE,
  'a blank workdir': MALFORMED,
  'a workdir in Windows namespace form': REQUESTED_UNUSABLE,
};

const ANSWERED_OUTCOMES: Readonly<Record<string, HookOutcome>> = {
  'an allowed command': { document: 'allow', audit: 'allow' },
  'an allowed command under the blocked-only audit scope': {
    document: 'allow',
    audit: 'none',
  },
  'a read tool over a relative path': { document: 'allow', audit: 'none' },
  'a payload without a cwd': FAILED_CLOSED,
};

export type HookHost = {
  id: string;
  flag: string;
  ported: () => Promise<void>;
  rows: (fixture: HookFixture) => readonly HookRow[];
};

export type HookFixture = {
  root: string;
  home: string;
  project: string;
  outside: string;
  file: string;
  missing: string;
  remove: () => void;
};

export const BREACH_COMMAND = `cat ${'${HOME:-'.repeat(65)}x${'}'.repeat(65)}/.ssh/config`;

export const STRUCTURAL_LIMIT_COMMAND = `bash -c '${'a '.repeat(16_400)}'`;

const SESSION = 's1';
const MISSING_PREFIX = Array.from({ length: 14 }, (_, index) => `m${index}`).join('/');
const BAD_CONFIG_DIR = 'bad-config';
const NOT_A_DIRECTORY = 'not-a-directory';
const DOTTED_DIRECTORY = '..cache';
const AT_PREFIXED_FILE = '@.netrc';
const AT_PREFIXED_DIRECTORY = '@.ssh';
const OVERSIZED_PAYLOAD = `{"pad":"${'x'.repeat(8 * 1024 * 1024 - 9)}"}`;

export function createHookFixture(prefix: string): HookFixture {
  const root = mkdtempSync(join(process.env.CC_SAFETY_NET_TEST_TMPDIR ?? tmpdir(), prefix));
  const home = join(root, 'home');
  const project = join(root, 'project');
  for (const dir of [
    join(home, '.codex', 'sessions'),
    join(home, '.copilot'),
    join(home, '.claude', 'projects'),
    join(home, '.ssh'),
    join(home, AT_PREFIXED_DIRECTORY),
    join(project, 'sub'),
    join(project, DOTTED_DIRECTORY),
    join(root, 'outside'),
    join(root, BAD_CONFIG_DIR),
  ]) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(join(home, '.codex', 'sessions', 't.jsonl'), '');
  writeFileSync(join(home, '.copilot', 's.jsonl'), '');
  writeFileSync(join(home, '.claude', 'projects', 'p.jsonl'), '');
  writeFileSync(join(home, '.ssh', 'id_rsa'), `${['-----BEGIN', 'KEY-----'].join(' ')}\n`);
  writeFileSync(join(project, 'README.md'), 'a file the read rows point at\n');
  writeFileSync(join(project, AT_PREFIXED_FILE), '');
  writeFileSync(join(root, NOT_A_DIRECTORY), 'a file where a directory is expected\n');
  writeFileSync(
    withEnv({ CC_SAFETY_NET_HOME: join(root, BAD_CONFIG_DIR) }, () =>
      getUserPolicyPath(createProcessEnvironment()),
    ),
    '{',
  );
  return {
    root,
    home,
    project,
    outside: join(root, 'outside'),
    file: join(root, NOT_A_DIRECTORY),
    missing: join(root, 'gone'),
    remove: () => rmSync(root, { recursive: true, force: true }),
  };
}

export function hostEnv(fixture: HookFixture, auditHome: string) {
  return {
    HOME: fixture.home,
    CC_SAFETY_NET_HOME: join(fixture.home, '.cc-safety-net'),
    CC_SAFETY_NET_AUDIT_HOME: auditHome,
  };
}

type Payload = { tool?: string; args?: unknown; cwd?: string; event?: string };

type HostSpec = {
  id: string;
  flag: string;
  ported: () => Promise<void>;
  commandTool: string;
  commandArgs?: (command: string) => Record<string, unknown>;
  unsupportedEvent?: string;
  cwdFromProcess?: true;
  answersEveryCall?: true;
  denyExitCode?: number;
  build: (payload: Payload) => unknown;
  extraRows?: (fixture: HookFixture) => readonly Omit<HookRow, 'expected'>[];
};

const claudeShaped = (event: string) => (payload: Payload) => ({
  session_id: SESSION,
  hook_event_name: payload.event ?? event,
  tool_name: payload.tool,
  tool_input: payload.args,
  cwd: payload.cwd,
});

const claudePayload = (fixture: HookFixture, overrides: Record<string, unknown>) =>
  JSON.stringify({
    session_id: SESSION,
    hook_event_name: 'PreToolUse',
    tool_name: 'Bash',
    tool_input: { command: 'git status' },
    cwd: fixture.project,
    ...overrides,
  });

const copilotPayload = (fixture: HookFixture, overrides: Record<string, unknown>) =>
  JSON.stringify({
    sessionId: SESSION,
    timestamp: 0,
    cwd: fixture.project,
    toolName: 'bash',
    toolArgs: JSON.stringify({ command: 'git status' }),
    ...overrides,
  });

const privateKeyPatch = (fixture: HookFixture) =>
  `*** Begin Patch\n*** Update File: ${join(fixture.home, '.ssh', 'id_rsa')}\n@@\n-a\n+b\n*** End Patch\n`;

const cursorPayload = (fixture: HookFixture, overrides: Record<string, unknown>) =>
  JSON.stringify({
    conversation_id: SESSION,
    hook_event_name: 'preToolUse',
    tool_name: 'Shell',
    tool_input: { command: 'git status' },
    cwd: fixture.project,
    workspace_roots: [fixture.project],
    ...overrides,
  });

const antigravityPayload = (fixture: HookFixture, args: Record<string, unknown>) =>
  JSON.stringify({
    conversationId: SESSION,
    workspacePaths: [fixture.project],
    toolCall: {
      name: 'run_command',
      args: { CommandLine: 'git status', ...args },
    },
  });

const antigravityTaskPayload = (fixture: HookFixture, args: Record<string, unknown>) =>
  JSON.stringify({
    conversationId: SESSION,
    workspacePaths: [fixture.project],
    toolCall: { name: 'manage_task', args: { TaskId: 'task-1', ...args } },
  });

const grokPayload = (fixture: HookFixture, overrides: Record<string, unknown>) =>
  JSON.stringify({
    sessionId: SESSION,
    cwd: fixture.project,
    toolName: 'run_terminal_command',
    toolInput: { command: 'git status' },
    ...overrides,
  });

const droidShaped = (payload: Payload) => ({
  session_id: SESSION,
  transcript_path: '/home/agent/.factory/sessions/project/s1.jsonl',
  cwd: payload.cwd,
  permission_mode: 'auto-medium',
  hook_event_name: payload.event ?? 'PreToolUse',
  tool_name: payload.tool,
  tool_input: payload.args,
});

const devinShaped = (payload: Payload) => ({
  hook_event_name: payload.event ?? 'PreToolUse',
  tool_name: payload.tool,
  tool_input: payload.args,
  tool_use_id: 'toolu_01',
  session_id: 'glow-crane',
  prompt_id: 'prompt-01',
});

const devinPayload = (tool: string, args: Record<string, unknown>) =>
  JSON.stringify(devinShaped({ tool, args }));

const hermesPayload = (fixture: HookFixture, workdir: string) =>
  JSON.stringify({
    session_id: SESSION,
    hook_event_name: 'pre_tool_call',
    tool_name: 'terminal',
    tool_input: { command: 'git status', workdir },
    cwd: fixture.project,
  });

const kimiPayload = (fixture: HookFixture, cwd: unknown) =>
  JSON.stringify({
    session_id: SESSION,
    hook_event_name: 'PreToolUse',
    tool_name: 'Bash',
    tool_input: { command: 'git status', cwd },
    cwd: fixture.project,
  });

const geminiPayload = (cwd: string, command: string, dirPath: unknown) =>
  JSON.stringify({
    session_id: SESSION,
    hook_event_name: 'BeforeTool',
    tool_name: 'run_shell_command',
    tool_input: { command, dir_path: dirPath },
    cwd,
  });

const geminiToolPayload = (fixture: HookFixture, tool: string, args: Record<string, unknown>) =>
  JSON.stringify(claudeShaped('BeforeTool')({ tool, args, cwd: fixture.project }));

const HOST_SPECS: readonly HostSpec[] = [
  {
    id: 'claude-code',
    flag: '--coding-cli',
    ported: portedClaudeCodeHook,
    commandTool: 'Bash',
    unsupportedEvent: 'PostToolUse',
    build: claudeShaped('PreToolUse'),
    extraRows: (fixture) => [
      {
        name: 'a denied PowerShell command',
        stdin: claudePayload(fixture, {
          tool_name: 'PowerShell',
          tool_input: { command: 'Remove-Item -Recurse -Force C:\\' },
        }),
      },
      {
        name: 'an allowed PowerShell command',
        stdin: claudePayload(fixture, {
          tool_name: 'PowerShell',
          tool_input: { command: 'Get-ChildItem' },
        }),
      },
      {
        name: 'a destructive Monitor command',
        stdin: claudePayload(fixture, {
          tool_name: 'Monitor',
          tool_input: {
            description: 'reset',
            timeout_ms: 1000,
            command: 'git reset --hard',
          },
        }),
      },
      {
        name: 'a Monitor watch without a command',
        stdin: claudePayload(fixture, {
          tool_name: 'Monitor',
          tool_input: {
            description: 'events',
            timeout_ms: 1000,
            ws: { url: 'wss://example.test/events' },
          },
        }),
      },
      {
        name: 'a PowerShell removal Copilot sends as Bash',
        stdin: claudePayload(fixture, {
          tool_input: { command: 'Remove-Item -Recurse -Force $HOME' },
        }),
        env: { COPILOT_CLI: '1' },
      },
      {
        name: 'a Grep over a private key directory in paths',
        stdin: claudePayload(fixture, {
          tool_name: 'Grep',
          tool_input: { pattern: 'KEY', paths: [join(fixture.home, '.ssh')] },
        }),
      },
      {
        name: 'an Edit whose input is a raw patch onto a private key',
        stdin: claudePayload(fixture, {
          tool_name: 'Edit',
          tool_input: `*** Begin Patch\n*** Update File: ${join(fixture.home, '.ssh', 'id_rsa')}\n@@\n-a\n+b\n*** End Patch\n`,
        }),
      },
      {
        name: 'a transcript under the Codex home',
        stdin: claudePayload(fixture, {
          transcript_path: join(fixture.home, '.codex', 'sessions', 't.jsonl'),
        }),
      },
      {
        name: 'a transcript under the Copilot home',
        stdin: claudePayload(fixture, {
          transcript_path: join(fixture.home, '.copilot', 's.jsonl'),
        }),
      },
      {
        name: 'a transcript under the Claude config directory',
        stdin: claudePayload(fixture, {
          transcript_path: join(fixture.home, '.claude', 'projects', 'p.jsonl'),
        }),
      },
      {
        name: 'no transcript under a Claude Code entrypoint',
        stdin: claudePayload(fixture, {}),
        env: { CLAUDECODE: '1' },
      },
    ],
  },
  {
    id: 'codex',
    flag: '--codex',
    ported: portedCodexHook,
    commandTool: 'Bash',
    unsupportedEvent: 'PostToolUse',
    build: claudeShaped('PreToolUse'),
  },
  {
    id: 'kimi-code',
    flag: '--kimi-code',
    ported: portedKimiCodeHook,
    commandTool: 'Bash',
    unsupportedEvent: 'PostToolUse',
    build: claudeShaped('PreToolUse'),
    extraRows: (fixture) => [
      {
        name: 'a tool cwd inside the session cwd',
        stdin: kimiPayload(fixture, join(fixture.project, 'sub')),
      },
      {
        name: 'a tool cwd outside the session cwd',
        stdin: kimiPayload(fixture, fixture.outside),
      },
      {
        name: 'a tool cwd that does not exist',
        stdin: kimiPayload(fixture, fixture.missing),
      },
      { name: 'a blank tool cwd', stdin: kimiPayload(fixture, '') },
      {
        name: 'a tool cwd that is not a string',
        stdin: kimiPayload(fixture, 5),
      },
    ],
  },
  {
    id: 'gemini-cli',
    flag: '--gemini-cli',
    ported: portedGeminiCLIHook,
    commandTool: 'run_shell_command',
    unsupportedEvent: 'AfterTool',
    build: claudeShaped('BeforeTool'),
    extraRows: (fixture) => [
      {
        name: 'a recursive delete from a home dir_path inside the session cwd',
        stdin: geminiPayload(fixture.root, 'rm -rf build', 'home'),
      },
      {
        name: 'a recursive delete whose dir_path is below the home session cwd',
        stdin: geminiPayload(fixture.home, 'rm -rf build', '.copilot'),
      },
      {
        name: 'a dir_path outside the session cwd',
        stdin: geminiPayload(fixture.project, 'cat .ssh/config', '../home'),
      },
      {
        name: 'a dir_path that does not exist',
        stdin: geminiPayload(fixture.project, 'git status', 'missing-dir'),
      },
      {
        name: 'an empty dir_path',
        stdin: geminiPayload(fixture.project, 'git status', ''),
      },
      {
        name: 'a whitespace-only dir_path',
        stdin: geminiPayload(fixture.project, 'git status', '  '),
      },
      {
        name: 'a dir_path that is not a string',
        stdin: geminiPayload(fixture.project, 'git status', 5),
      },
      {
        name: 'a grep_search whose dir_path is an npmrc file',
        stdin: geminiToolPayload(fixture, 'grep_search', { pattern: '.', dir_path: '.npmrc' }),
      },
      {
        name: 'a grep_search over private keys in include_pattern',
        stdin: geminiToolPayload(fixture, 'grep_search', {
          pattern: 'KEY',
          include_pattern: '**/id_rsa',
        }),
      },
      {
        name: 'a list_directory over the ssh directory',
        stdin: geminiToolPayload(fixture, 'list_directory', {
          dir_path: join(fixture.home, '.ssh'),
        }),
      },
      {
        name: 'a glob whose dir_path is the ssh directory',
        stdin: geminiToolPayload(fixture, 'glob', {
          pattern: '*',
          dir_path: join(fixture.home, '.ssh'),
        }),
      },
      {
        name: 'a read_file of an at-prefixed npmrc',
        stdin: geminiToolPayload(fixture, 'read_file', { file_path: '@.npmrc' }),
      },
      {
        name: 'a read_file of an npmrc path holding a NUL byte',
        stdin: geminiToolPayload(fixture, 'read_file', { file_path: '.npm\u0000rc' }),
      },
      {
        name: 'a read_file of an at-prefixed name that exists as written',
        stdin: geminiToolPayload(fixture, 'read_file', { file_path: AT_PREFIXED_FILE }),
      },
      {
        name: 'a read_file under an at-prefixed directory that exists',
        stdin: JSON.stringify(
          claudeShaped('BeforeTool')({
            tool: 'read_file',
            args: { file_path: `${AT_PREFIXED_DIRECTORY}/config` },
            cwd: fixture.home,
          }),
        ),
      },
      {
        name: 'a read_file of an at-slash path into the ssh directory',
        stdin: JSON.stringify(
          claudeShaped('BeforeTool')({
            tool: 'read_file',
            args: { file_path: '@/.ssh/config' },
            cwd: fixture.home,
          }),
        ),
      },
    ],
  },
  {
    id: 'copilot-cli',
    flag: '--copilot-cli',
    ported: portedCopilotCliHook,
    commandTool: 'bash',
    build: (payload) => ({
      sessionId: SESSION,
      timestamp: 0,
      cwd: payload.cwd,
      toolName: payload.tool,
      toolArgs: payload.args === undefined ? undefined : JSON.stringify(payload.args),
    }),
    extraRows: (fixture) => [
      {
        name: 'tool args that are not a string',
        stdin: copilotPayload(fixture, { toolArgs: 5 }),
      },
      {
        name: 'tool args that are not JSON',
        stdin: copilotPayload(fixture, { toolArgs: '{' }),
      },
      {
        name: 'a denied command in object tool args',
        stdin: copilotPayload(fixture, {
          toolArgs: {
            command: 'git reset --hard',
            description: 'Reset the tree',
          },
        }),
      },
      {
        name: 'an allowed command in object tool args',
        stdin: copilotPayload(fixture, {
          toolArgs: {
            command: 'git status --short',
            description: 'Show working tree status',
          },
        }),
      },
      {
        name: 'a raw apply_patch string onto a private key',
        stdin: copilotPayload(fixture, {
          toolName: 'apply_patch',
          toolArgs: privateKeyPatch(fixture),
        }),
      },
      {
        name: 'a JSON-encoded apply_patch string onto a private key',
        stdin: copilotPayload(fixture, {
          toolName: 'apply_patch',
          toolArgs: JSON.stringify(privateKeyPatch(fixture)),
        }),
      },
      {
        name: 'a powershell command',
        stdin: copilotPayload(fixture, {
          toolName: 'powershell',
          toolArgs: JSON.stringify({
            command: 'Remove-Item -Recurse -Force C:\\',
          }),
        }),
      },
      {
        name: 'a blank session id',
        stdin: copilotPayload(fixture, { sessionId: '' }),
      },
    ],
  },
  {
    id: 'cursor',
    flag: '--cursor',
    answersEveryCall: true,
    ported: portedCursorHook,
    commandTool: 'Shell',
    build: (payload) => ({
      conversation_id: SESSION,
      hook_event_name: 'preToolUse',
      tool_name: payload.tool,
      tool_input: payload.args,
      cwd: payload.cwd,
    }),
    extraRows: (fixture) => [
      {
        name: 'a working directory inside the workspace roots',
        stdin: cursorPayload(fixture, {
          tool_input: {
            command: 'git status',
            working_directory: join(fixture.project, 'sub'),
          },
        }),
      },
      {
        name: 'a working directory outside the workspace roots',
        stdin: cursorPayload(fixture, {
          tool_input: {
            command: 'git status',
            working_directory: fixture.outside,
          },
        }),
      },
      {
        name: 'a working directory that does not exist',
        stdin: cursorPayload(fixture, {
          tool_input: {
            command: 'git status',
            working_directory: fixture.missing,
          },
        }),
      },
      {
        name: 'a blank working directory',
        stdin: cursorPayload(fixture, {
          tool_input: { command: 'git status', working_directory: '' },
        }),
      },
      {
        name: 'no workspace roots',
        stdin: cursorPayload(fixture, { workspace_roots: [] }),
      },
      {
        name: 'workspace roots that do not exist',
        stdin: cursorPayload(fixture, { workspace_roots: [fixture.missing] }),
      },
      {
        name: 'a cwd outside the workspace roots',
        stdin: cursorPayload(fixture, { cwd: fixture.outside }),
      },
    ],
  },
  {
    id: 'antigravity-cli',
    flag: '--agy-cli',
    ported: portedAntigravityCliHook,
    commandTool: 'run_command',
    commandArgs: (command) => ({ CommandLine: command }),
    build: (payload) => ({
      conversationId: SESSION,
      workspacePaths: payload.cwd === undefined ? undefined : [payload.cwd],
      toolCall: { name: payload.tool, args: payload.args },
    }),
    extraRows: (fixture) => [
      {
        name: 'a Cwd inside the workspace paths',
        stdin: antigravityPayload(fixture, {
          Cwd: join(fixture.project, 'sub'),
        }),
      },
      {
        name: 'a Cwd outside the workspace paths',
        stdin: antigravityPayload(fixture, { Cwd: fixture.outside }),
      },
      {
        name: 'a Cwd whose name starts with two dots inside the workspace paths',
        stdin: antigravityPayload(fixture, {
          Cwd: join(fixture.project, DOTTED_DIRECTORY),
        }),
      },
      {
        name: 'a Cwd that does not exist',
        stdin: antigravityPayload(fixture, { Cwd: fixture.missing }),
      },
      { name: 'a blank Cwd', stdin: antigravityPayload(fixture, { Cwd: '' }) },
      {
        name: 'a destructive line sent to a background task',
        stdin: antigravityTaskPayload(fixture, {
          Action: 'send_input',
          Input: 'git reset --hard\n',
        }),
      },
      {
        name: 'a background task status check',
        stdin: antigravityTaskPayload(fixture, { Action: 'status' }),
      },
      {
        name: 'no workspace paths',
        stdin: JSON.stringify({
          conversationId: SESSION,
          workspacePaths: [],
          toolCall: {
            name: 'run_command',
            args: { CommandLine: 'git status' },
          },
        }),
      },
      {
        name: 'view targets past the path-canonicalization budget',
        stdin: JSON.stringify({
          conversationId: SESSION,
          workspacePaths: [fixture.project],
          toolCall: {
            name: 'view_file',
            args: {
              targets: Array.from({ length: LIMITS.realpathAttempts.cap / 16 + 1 }, (_, index) => ({
                AbsolutePath: join(fixture.project, MISSING_PREFIX, `t-${index}.txt`),
              })),
            },
          },
        }),
      },
    ],
  },
  {
    id: 'grok-build',
    flag: '--grok-build',
    answersEveryCall: true,
    ported: portedGrokBuildHook,
    commandTool: 'run_terminal_command',
    build: (payload) => ({
      sessionId: SESSION,
      cwd: payload.cwd,
      toolName: payload.tool,
      toolInput: payload.args,
    }),
    extraRows: (fixture) => [
      {
        name: 'a destructive monitor command',
        stdin: grokPayload(fixture, {
          toolName: 'monitor',
          toolInput: { command: 'git reset --hard', description: 'reset' },
        }),
      },
      {
        name: 'tool input the host truncated',
        stdin: grokPayload(fixture, { toolInputTruncated: true }),
      },
      {
        name: 'a cwd inside the workspace root',
        stdin: grokPayload(fixture, {
          workspaceRoot: fixture.project,
          cwd: join(fixture.project, 'sub'),
        }),
      },
      {
        name: 'a cwd outside the workspace root',
        stdin: grokPayload(fixture, {
          workspaceRoot: fixture.project,
          cwd: fixture.outside,
        }),
      },
      {
        name: 'a destructive run_terminal_cmd command',
        stdin: grokPayload(fixture, {
          toolName: 'run_terminal_cmd',
          toolInput: { command: 'git reset --hard' },
        }),
      },
      {
        name: 'a destructive bash command',
        stdin: grokPayload(fixture, {
          toolName: 'bash',
          toolInput: { command: 'git reset --hard', workdir: fixture.project },
        }),
      },
      {
        name: 'a destructive Shell command',
        stdin: grokPayload(fixture, {
          toolName: 'Shell',
          toolInput: { command: 'git reset --hard', working_directory: fixture.project },
        }),
      },
      {
        name: 'a bash workdir outside the workspace root',
        stdin: grokPayload(fixture, {
          workspaceRoot: fixture.project,
          toolName: 'bash',
          toolInput: { command: 'git status', workdir: fixture.outside },
        }),
      },
      {
        name: 'a bash workdir relative to the session cwd',
        stdin: grokPayload(fixture, {
          workspaceRoot: fixture.project,
          cwd: join(fixture.project, 'sub'),
          toolName: 'bash',
          toolInput: { command: 'git status', workdir: '..' },
        }),
      },
      {
        name: 'a blank bash workdir',
        stdin: grokPayload(fixture, {
          toolName: 'bash',
          toolInput: { command: 'git status', workdir: ' ' },
        }),
      },
      {
        name: 'a Shell working_directory inside the workspace root',
        stdin: grokPayload(fixture, {
          workspaceRoot: fixture.project,
          toolName: 'Shell',
          toolInput: { command: 'git status', working_directory: join(fixture.project, 'sub') },
        }),
      },
      {
        name: 'a Shell working_directory outside the workspace root',
        stdin: grokPayload(fixture, {
          workspaceRoot: fixture.project,
          toolName: 'Shell',
          toolInput: { command: 'git status', working_directory: fixture.outside },
        }),
      },
      {
        name: 'a bash delete of its own workdir',
        stdin: grokPayload(fixture, {
          workspaceRoot: fixture.project,
          toolName: 'bash',
          toolInput: { command: 'rm -rf ../sub', workdir: 'sub' },
        }),
      },
      {
        name: 'a Shell delete of its own working_directory',
        stdin: grokPayload(fixture, {
          workspaceRoot: fixture.project,
          toolName: 'Shell',
          toolInput: { command: 'rm -rf ../sub', working_directory: join(fixture.project, 'sub') },
        }),
      },
    ],
  },
  {
    id: 'droid',
    flag: '--droid',
    ported: portedDroidHook,
    commandTool: 'Execute',
    commandArgs: (command) => ({
      command,
      summary: 'Run the command',
      riskLevel: 'low',
    }),
    unsupportedEvent: 'PostToolUse',
    denyExitCode: 2,
    build: droidShaped,
    extraRows: (fixture) => [
      {
        name: 'a Glob over dotenv files in patterns',
        stdin: JSON.stringify(
          droidShaped({
            tool: 'Glob',
            args: { patterns: '**/.env', folder: fixture.project },
            cwd: fixture.project,
          }),
        ),
      },
      {
        name: 'a grep over private keys in glob_pattern',
        stdin: JSON.stringify(
          droidShaped({
            tool: 'Grep',
            args: { pattern: 'KEY', glob_pattern: '*.pem' },
            cwd: fixture.project,
          }),
        ),
      },
    ],
  },
  {
    id: 'devin',
    flag: '--devin',
    ported: portedDevinHook,
    commandTool: 'exec',
    unsupportedEvent: 'PostToolUse',
    cwdFromProcess: true,
    build: devinShaped,
    extraRows: (fixture) => [
      {
        name: 'a recursive delete from a home process cwd',
        stdin: devinPayload('exec', { command: 'rm -rf build' }),
        processCwd: fixture.home,
      },
      {
        name: 'a destructive line written to a process',
        stdin: devinPayload('write_to_process', {
          shell_id: 'a8be43',
          text_input: 'git reset --hard',
        }),
      },
      {
        name: 'a keypress written to a process',
        stdin: devinPayload('write_to_process', {
          shell_id: 'a8be43',
          bytes_input: '<CR>',
        }),
      },
      {
        name: 'a destructive line written to a process as key input',
        stdin: devinPayload('write_to_process', {
          shell_id: 'a8be43',
          bytes_input: 'git reset --hard<CR>',
        }),
      },
      {
        name: 'a prompt answer written to a process as key input',
        stdin: devinPayload('write_to_process', {
          shell_id: 'a8be43',
          bytes_input: 'y<CR>',
        }),
      },
      {
        name: 'an undocumented key token written to a process',
        stdin: devinPayload('write_to_process', {
          shell_id: 'a8be43',
          bytes_input: 'git st<TAB><CR>',
        }),
      },
      {
        name: 'a line written to a process as both text and key input',
        stdin: devinPayload('write_to_process', {
          shell_id: 'a8be43',
          text_input: 'echo ok',
          bytes_input: '<C-u>git reset --hard<CR>',
        }),
      },
      {
        name: 'a line erased by a key before a destructive line',
        stdin: devinPayload('write_to_process', {
          shell_id: 'a8be43',
          bytes_input: 'echo ok<C-u>git reset --hard<CR>',
        }),
      },
      {
        name: 'a line edited by backspace',
        stdin: devinPayload('write_to_process', {
          shell_id: 'a8be43',
          bytes_input: 'git reset --hardx<BS><CR>',
        }),
      },
      {
        name: 'an editor command after escape',
        stdin: devinPayload('write_to_process', {
          shell_id: 'a8be43',
          bytes_input: 'i hello<ESC>:wq<CR>',
        }),
      },
      {
        name: 'an aborted line before a destructive line',
        stdin: devinPayload('write_to_process', {
          shell_id: 'a8be43',
          bytes_input: 'echo ok<C-c>git reset --hard<CR>',
        }),
      },
      {
        name: 'a destructive line split by Ctrl-D',
        stdin: devinPayload('write_to_process', {
          shell_id: 'a8be43',
          bytes_input: 'git reset<C-d> --hard<CR>',
        }),
      },
      {
        name: 'text written to a process followed by an editing key',
        stdin: devinPayload('write_to_process', {
          shell_id: 'a8be43',
          text_input: 'git reset --hardx',
          bytes_input: '<BS><CR>',
        }),
      },
      {
        name: 'text written to a process followed by Enter',
        stdin: devinPayload('write_to_process', {
          shell_id: 'a8be43',
          text_input: 'y',
          bytes_input: '<CR>',
        }),
      },
      {
        name: 'a recursive delete whose workdir is the home directory',
        stdin: devinPayload('exec', { command: 'rm -rf *', workdir: fixture.home }),
        processCwd: fixture.project,
      },
      {
        name: 'a blank workdir',
        stdin: devinPayload('exec', { command: 'git status', workdir: '' }),
      },
      {
        name: 'a grep over private keys in glob_pattern',
        stdin: devinPayload('grep', { pattern: 'KEY', glob_pattern: '*.pem' }),
        processCwd: fixture.project,
      },
    ],
  },
  {
    id: 'hermes-agent',
    flag: '--hermes-agent',
    ported: portedHermesAgentHook,
    commandTool: 'terminal',
    unsupportedEvent: 'post_tool_call',
    build: claudeShaped('pre_tool_call'),
    extraRows: (fixture) => [
      { name: 'a workdir that exists', stdin: hermesPayload(fixture, 'sub') },
      {
        name: 'a workdir that does not exist',
        stdin: hermesPayload(fixture, 'missing-dir'),
      },
      { name: 'a blank workdir', stdin: hermesPayload(fixture, '') },
      {
        name: 'a workdir in Windows namespace form',
        stdin: hermesPayload(fixture, `\\\\?\\${fixture.project}`),
      },
    ],
  },
];

function commonRows(spec: HostSpec, fixture: HookFixture): Omit<HookRow, 'expected'>[] {
  const commandArgs = spec.commandArgs ?? ((command: string) => ({ command }));
  const payload = (values: Payload) => JSON.stringify(spec.build(values));
  const commandPayload = (command: string, cwd?: string) =>
    payload({ tool: spec.commandTool, args: commandArgs(command), cwd });
  const inProject = (command: string) => commandPayload(command, fixture.project);

  return [
    {
      name: 'a denied command',
      stdin: inProject('git push --force origin main'),
    },
    { name: 'an allowed command', stdin: inProject('git status') },
    {
      name: 'an allowed command under the blocked-only audit scope',
      stdin: inProject('git status'),
      env: { CC_SAFETY_NET_AUDIT_SCOPE: 'blocked' },
    },
    ...(spec.unsupportedEvent === undefined
      ? []
      : [
          {
            name: 'an event the host does not handle',
            stdin: payload({
              tool: spec.commandTool,
              args: commandArgs('git status'),
              cwd: fixture.project,
              event: spec.unsupportedEvent,
            }),
          },
        ]),
    { name: 'a payload that is not JSON', stdin: '{' },
    { name: 'an empty payload', stdin: '' },
    { name: 'a payload that is an array', stdin: '[]' },
    { name: 'a payload past the input byte limit', stdin: OVERSIZED_PAYLOAD },
    {
      name: 'a payload without a tool name',
      stdin: payload({ args: commandArgs('git status'), cwd: fixture.project }),
    },
    {
      name: 'a payload with a blank tool name',
      stdin: payload({ tool: '', args: commandArgs('git status'), cwd: fixture.project }),
    },
    {
      name: 'a read tool over a relative path',
      stdin: payload({
        tool: 'Read',
        args: { file_path: 'README.md' },
        cwd: fixture.project,
      }),
    },
    {
      name: 'a read tool over a private key',
      stdin: payload({
        tool: 'Read',
        args: { file_path: join(fixture.home, '.ssh', 'id_rsa') },
        cwd: fixture.project,
      }),
    },
    { name: 'a payload without a cwd', stdin: commandPayload('git status') },
    ...(spec.cwdFromProcess
      ? []
      : [
          {
            name: 'a cwd that is a regular file',
            stdin: commandPayload('git status', fixture.file),
          },
          {
            name: 'a cwd that does not exist',
            stdin: commandPayload('git status', fixture.missing),
          },
        ]),
    {
      name: 'a denied command under a malformed user policy',
      stdin: inProject('git reset --hard HEAD~1'),
      env: { CC_SAFETY_NET_HOME: join(fixture.root, BAD_CONFIG_DIR) },
    },
    {
      name: 'a command that breaches an analysis limit',
      stdin: inProject(BREACH_COMMAND),
    },
    {
      name: 'a command past the structural shell-syntax limit',
      stdin: inProject(STRUCTURAL_LIMIT_COMMAND),
    },
    { name: 'a command that cannot be parsed', stdin: inProject('echo ${') },
    {
      name: 'a command that breaches an analysis limit with debug output on',
      stdin: inProject(BREACH_COMMAND),
      env: { CC_SAFETY_NET_DEBUG: '1' },
    },
  ];
}

function outcomeFor(spec: HostSpec, name: string): HookOutcome {
  const outcome =
    (spec.answersEveryCall === true ? ANSWERED_OUTCOMES[name] : undefined) ?? OUTCOMES[name];
  if (outcome === undefined) throw new Error(`no declared outcome for hook row: ${name}`);
  if (spec.denyExitCode === undefined || outcome.document !== 'deny') return outcome;
  return { ...outcome, stderr: (outcome.stderr ?? 0) + 1, exitCode: spec.denyExitCode };
}

export const HOOK_HOSTS: readonly HookHost[] = HOST_SPECS.map((spec) => ({
  id: spec.id,
  flag: spec.flag,
  ported: spec.ported,
  rows: (fixture: HookFixture) =>
    [...commonRows(spec, fixture), ...(spec.extraRows?.(fixture) ?? [])].map((row) => ({
      ...row,
      expected: outcomeFor(spec, row.name),
    })),
}));
