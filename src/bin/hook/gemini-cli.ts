import { runConfiguredHookAdapter } from '@/bin/hook/common';
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
      input.hook_event_name === 'BeforeTool' && input.tool_name === 'run_shell_command',
    getCommand: (input) => input.tool_input?.command,
    getCwd: (input) => input.cwd,
    getSessionId: (input) => input.session_id,
  });
}
