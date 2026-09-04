import type { Environment } from '@next/core/environment';
import { resolveStandardHookContext } from '@next/gate/intake';
import type { ToolRoute } from '@next/gate/invocation';
import { runConfiguredHookAdapter } from '@next/hosts/hook/common';
import { PRE_TOOL_USE_HOOK_EVENT } from '@next/hosts/hook/constants';

export type PreToolUseHookInput = {
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
};

export type PreToolUseHookOutput = {
  hookSpecificOutput: {
    hookEventName: typeof PRE_TOOL_USE_HOOK_EVENT;
    permissionDecision: 'allow' | 'deny';
    permissionDecisionReason?: string;
  };
};

export async function runPreToolUseHook(options: {
  agent: string;
  getAgent?: (input: PreToolUseHookInput, environment: Environment) => string;
  getToolRoute: (toolName: string) => ToolRoute;
}): Promise<void> {
  await runConfiguredHookAdapter<PreToolUseHookInput>({
    agent: options.agent,
    ...(options.getAgent ? { getAgent: options.getAgent } : {}),
    createDenyOutput: (message): PreToolUseHookOutput => ({
      hookSpecificOutput: {
        hookEventName: PRE_TOOL_USE_HOOK_EVENT,
        permissionDecision: 'deny',
        permissionDecisionReason: message,
      },
    }),
    isSupported: (input) => input.hook_event_name === PRE_TOOL_USE_HOOK_EVENT,
    getToolName: (input) => input.tool_name,
    getToolInput: (input, toolName) => ({
      ok: true,
      input: input.tool_input,
      route: options.getToolRoute(toolName),
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
