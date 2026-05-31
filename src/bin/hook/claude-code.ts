import { runConfiguredHookAdapter } from '@/bin/hook/common';
import { CLAUDE_CODE_HOOK_EVENT, CLAUDE_CODE_TOOL_NAME } from '@/bin/hook/constants';
import type { HookInput, HookOutput } from '@/types';

export async function runClaudeCodeHook(): Promise<void> {
  await runConfiguredHookAdapter<HookInput>({
    createDenyOutput: (message): HookOutput => ({
      hookSpecificOutput: {
        hookEventName: CLAUDE_CODE_HOOK_EVENT,
        permissionDecision: 'deny',
        permissionDecisionReason: message,
      },
    }),
    getManualPermissionAdvice: (reason) => (reason.includes('rule sync') ? false : undefined),
    isSupported: (input) => input.tool_name === CLAUDE_CODE_TOOL_NAME,
    getCommand: (input) => input.tool_input?.command,
    getCwd: (input) => input.cwd,
    getSessionId: (input) => input.session_id,
  });
}
