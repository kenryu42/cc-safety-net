import { runConfiguredHookAdapter } from '@/bin/hook/common';
import { KIMI_CLI_HOOK_EVENT, KIMI_CLI_TOOL_NAME } from '@/bin/hook/constants';
import type { HookOutput, KimiCliHookInput } from '@/types';

export async function runKimiCliHook(): Promise<void> {
  await runConfiguredHookAdapter<KimiCliHookInput>({
    createDenyOutput: (message): HookOutput => ({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: message,
      },
    }),
    isSupported: (input) =>
      input.hook_event_name === KIMI_CLI_HOOK_EVENT && input.tool_name === KIMI_CLI_TOOL_NAME,
    getCommand: (input) => input.tool_input?.command,
    getCwd: (input) => input.cwd,
    getSessionId: (input) => input.session_id,
  });
}
