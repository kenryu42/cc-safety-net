import { getToolRoute, resolveStandardHookContext } from '@next/gate/intake';
import type { CommandToolKind } from '@next/gate/invocation';
import { runConfiguredHookAdapter } from '@next/hosts/hook/common';
import { GEMINI_CLI_HOOK_EVENT } from '@next/hosts/hook/constants';

/** Gemini CLI hook input format */
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

/** Gemini CLI hook output format */
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
    // Gemini CLI expects exit code 0 with JSON for policy blocks; exit 2 is for hook errors.
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
