import { runConfiguredHookAdapter } from '@/bin/hook/common';
import { GEMINI_CLI_HOOK_EVENT, GEMINI_CLI_TOOL_NAME } from '@/bin/hook/constants';
import type { GeminiHookInput, GeminiHookOutput } from '@/types';

export async function runGeminiCLIHook(): Promise<void> {
  await runConfiguredHookAdapter<GeminiHookInput>({
    // Gemini CLI expects exit code 0 with JSON for policy blocks; exit 2 is for hook errors.
    createDenyOutput: (message): GeminiHookOutput => ({
      decision: 'deny',
      reason: message,
      systemMessage: message,
    }),
    isSupported: (input) =>
      input.hook_event_name === GEMINI_CLI_HOOK_EVENT && input.tool_name === GEMINI_CLI_TOOL_NAME,
    getCommand: (input) => input.tool_input?.command,
    getCwd: (input) => input.cwd,
    getSessionId: (input) => input.session_id,
  });
}
