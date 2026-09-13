import { getToolRoute } from '@/gate/intake';
import type { CommandToolKind } from '@/gate/invocation';
import { getStandardHookContext, runConfiguredHookAdapter } from '@/hosts/hook/common';
import { GEMINI_CLI_HOOK_EVENT } from '@/hosts/hook/constants';

interface GeminiHookInput {
  session_id?: string;
  transcript_path?: string;
  cwd?: string;
  hook_event_name: string;
  timestamp?: string;
  tool_name?: string;
  tool_input?: {
    command?: string;
    [key: string]: unknown;
  };
}

interface GeminiHookOutput {
  decision: 'deny';
  reason: string;
  systemMessage: string;
  continue?: boolean;
  stopReason?: string;
  suppressOutput?: boolean;
}

const GEMINI_CLI_COMMAND_TOOLS = new Map<string, CommandToolKind>([['run_shell_command', 'auto']]);

function getGeminiCliToolRoute(toolName: string) {
  return getToolRoute(toolName, GEMINI_CLI_COMMAND_TOOLS);
}

export async function runGeminiCLIHook(): Promise<void> {
  await runConfiguredHookAdapter<GeminiHookInput>({
    agent: 'gemini-cli',

    createDenyOutput: (message): GeminiHookOutput => ({
      decision: 'deny',
      reason: message,
      systemMessage: message,
    }),
    isSupported: (input) => input.hook_event_name === GEMINI_CLI_HOOK_EVENT,
    getToolName: (input) => input.tool_name,
    getToolInput: (input, toolName) => ({
      ok: true,
      input: input.tool_input,
      route: getGeminiCliToolRoute(toolName),
    }),
    getContext: getStandardHookContext,
    getSessionId: (input) => input.session_id,
  });
}
