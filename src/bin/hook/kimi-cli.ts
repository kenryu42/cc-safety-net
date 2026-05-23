import { handleBlockedHookCommand, readHookInput } from '@/bin/hook/common';
import { redactSecrets } from '@/core/audit';
import { formatBlockedMessage } from '@/core/format';
import type { HookOutput, KimiCliHookInput } from '@/types';

function outputKimiDeny(
  reason: string,
  command?: string,
  segment?: string,
  manualPermissionAdvice?: boolean,
): void {
  const message = formatBlockedMessage({
    reason,
    command,
    segment,
    redact: redactSecrets,
    manualPermissionAdvice,
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

export async function runKimiCliHook(): Promise<void> {
  const input = await readHookInput<KimiCliHookInput>(outputKimiDeny);
  if (!input) {
    return;
  }

  if (input.hook_event_name !== 'PreToolUse') {
    return;
  }

  if (input.tool_name !== 'Shell') {
    return;
  }

  const command = input.tool_input?.command;
  if (!command) {
    return;
  }

  handleBlockedHookCommand(command, input.cwd ?? process.cwd(), input.session_id, outputKimiDeny);
}
