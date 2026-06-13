import { runConfiguredHookAdapter } from '@/bin/hook/common';
import { KIMI_CODE_HOOK_EVENT, KIMI_CODE_TOOL_NAME } from '@/bin/hook/constants';
import type { HookOutput, KimiCodeHookInput } from '@/types';

export async function runKimiCodeHook(): Promise<void> {
  await runConfiguredHookAdapter<KimiCodeHookInput>({
    createDenyOutput: (message): HookOutput => ({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: message,
      },
    }),
    isSupported: (input) =>
      input.hook_event_name === KIMI_CODE_HOOK_EVENT && input.tool_name === KIMI_CODE_TOOL_NAME,
    getCommand: (input) => input.tool_input?.command,
    getCwd: (input) => input.cwd,
    getSessionId: (input) => input.session_id,
  });
}
