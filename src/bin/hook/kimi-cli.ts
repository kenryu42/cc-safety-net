import { runConfiguredHookAdapter } from '@/bin/hook/common';
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
    isSupported: (input) => input.hook_event_name === 'PreToolUse' && input.tool_name === 'Shell',
    getCommand: (input) => input.tool_input?.command,
    getCwd: (input) => input.cwd,
    getSessionId: (input) => input.session_id,
  });
}
