import { handleBlockedHookCommand, parseHookJson, readHookInput } from '@/bin/hook/common';
import { redactSecrets } from '@/core/audit';
import { formatBlockedMessage } from '@/core/format';
import type { CopilotCliHookInput, CopilotCliHookOutput } from '@/types';

function outputCopilotDeny(reason: string, command?: string, segment?: string): void {
  const message = formatBlockedMessage({
    reason,
    command,
    segment,
    redact: redactSecrets,
  });

  const output: CopilotCliHookOutput = {
    permissionDecision: 'deny',
    permissionDecisionReason: message,
  };

  console.log(JSON.stringify(output));
}

export async function runCopilotCliHook(): Promise<void> {
  const input = await readHookInput<CopilotCliHookInput>(outputCopilotDeny);
  if (!input) {
    return;
  }

  // Only handle bash tool calls
  if (input.toolName !== 'bash') {
    return;
  }

  // Parse toolArgs which is a JSON string containing {command: string}
  const toolArgs = parseHookJson<{ command?: string }>(
    input.toolArgs,
    outputCopilotDeny,
    'Failed to parse toolArgs JSON (strict mode)',
  );
  if (!toolArgs) {
    return;
  }

  const command = toolArgs.command;
  if (!command) {
    return;
  }

  handleBlockedHookCommand(
    command,
    input.cwd ?? process.cwd(),
    `copilot-${input.timestamp ?? Date.now()}`,
    outputCopilotDeny,
  );
}
