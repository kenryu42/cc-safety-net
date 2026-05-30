import { parseHookJson, runConfiguredHookAdapter } from '@/bin/hook/common';
import type { CopilotCliHookInput, CopilotCliHookOutput } from '@/types';

export async function runCopilotCliHook(): Promise<void> {
  await runConfiguredHookAdapter<CopilotCliHookInput>({
    createDenyOutput: (message): CopilotCliHookOutput => ({
      permissionDecision: 'deny',
      permissionDecisionReason: message,
    }),
    isSupported: (input) => input.toolName === 'bash',
    getCommand: (input, outputDeny) =>
      parseHookJson<{ command?: string }>(
        input.toolArgs,
        outputDeny,
        'Failed to parse toolArgs JSON.',
      )?.command,
    getCwd: (input) => input.cwd,
    getSessionId: (input) => `copilot-${input.timestamp ?? Date.now()}`,
  });
}
