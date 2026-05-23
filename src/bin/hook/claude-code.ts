import { handleBlockedHookCommand, readHookInput } from '@/bin/hook/common';
import { redactSecrets } from '@/core/audit';
import { formatBlockedMessage } from '@/core/format';
import type { HookInput, HookOutput } from '@/types';

function outputDeny(reason: string, command?: string, segment?: string): void {
  const message = formatBlockedMessage({
    reason,
    command,
    segment,
    redact: redactSecrets,
    manualPermissionAdvice: reason.includes('rule sync') ? false : undefined,
  });

  const output: HookOutput = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: message,
    },
  };

  console.log(JSON.stringify(output));
}

export async function runClaudeCodeHook(): Promise<void> {
  const input = await readHookInput<HookInput>(outputDeny);
  if (!input) {
    return;
  }

  if (input.tool_name !== 'Bash') {
    return;
  }

  const command = input.tool_input?.command;
  if (!command) {
    return;
  }

  handleBlockedHookCommand(command, input.cwd ?? process.cwd(), input.session_id, outputDeny);
}
