import { getToolRoute, resolveStandardHookContext } from '@next/gate/intake';
import type { CommandToolKind } from '@next/gate/invocation';
import { detectClaudeShapeAgent } from '@next/hosts/hook/agent-detection';
import { runConfiguredHookAdapter } from '@next/hosts/hook/common';
import { CLAUDE_CODE_HOOK_EVENT } from '@next/hosts/hook/constants';

/** Claude Code hook input format */
interface HookInput {
  session_id?: string;
  transcript_path?: string | null;
  cwd?: string;
  permission_mode?: string;
  hook_event_name: string;
  tool_name: string;
  tool_input?: {
    command?: string;
    description?: string;
    [key: string]: unknown;
  };
  tool_use_id?: string;
}

/** Claude Code hook output format */
export interface HookOutput {
  hookSpecificOutput: {
    hookEventName: string;
    permissionDecision: 'allow' | 'deny';
    permissionDecisionReason?: string;
  };
}

const CLAUDE_CODE_COMMAND_TOOLS = new Map<string, CommandToolKind>([
  ['Bash', 'posix'],
  ['PowerShell', 'powershell'],
]);

function getClaudeCodeToolRoute(toolName: string) {
  return getToolRoute(toolName, CLAUDE_CODE_COMMAND_TOOLS);
}

export async function runClaudeCodeHook(): Promise<void> {
  await runConfiguredHookAdapter<HookInput>({
    agent: 'claude-code',
    getAgent: (input, environment) => detectClaudeShapeAgent(input.transcript_path, environment),
    createDenyOutput: (message): HookOutput => ({
      hookSpecificOutput: {
        hookEventName: CLAUDE_CODE_HOOK_EVENT,
        permissionDecision: 'deny',
        permissionDecisionReason: message,
      },
    }),
    isSupported: (input) => input.hook_event_name === CLAUDE_CODE_HOOK_EVENT,
    getToolName: (input) => input.tool_name,
    getToolInput: (input, toolName) => ({
      ok: true,
      input: input.tool_input,
      route: getClaudeCodeToolRoute(toolName),
    }),
    getContext: (input, toolInput, toolName, outputDeny, environment) =>
      resolveStandardHookContext(
        input.cwd,
        toolInput,
        toolName,
        outputDeny,
        environment.paths,
        process.cwd(),
      ),
    getSessionId: (input) => input.session_id,
  });
}
