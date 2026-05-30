import { runConfiguredHookAdapter } from '@/bin/hook/common';
import type { HookInput, HookOutput } from '@/types';

export async function runClaudeCodeHook(): Promise<void> {
  await runConfiguredHookAdapter<HookInput>({
    createDenyOutput: (message): HookOutput => ({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: message,
      },
    }),
    getManualPermissionAdvice: (reason) => (reason.includes('rule sync') ? false : undefined),
    isSupported: (input) => input.tool_name === 'Bash',
    getCommand: (input) => input.tool_input?.command,
    getCwd: (input) => input.cwd,
    getSessionId: (input) => input.session_id,
  });
}
