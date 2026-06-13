import { runClaudeCodeHook } from '@/bin/hook/claude-code';
import { runCopilotCliHook } from '@/bin/hook/copilot-cli';
import { runGeminiCLIHook } from '@/bin/hook/gemini-cli';
import { runKimiCodeHook } from '@/bin/hook/kimi-code';
import {
  type RuntimeHookIntegrationId,
  runtimeHookIntegrationMetadata,
} from '@/bin/integration-metadata';

export type HookIntegration = {
  id: RuntimeHookIntegrationId;
  displayName: string;
  flags: readonly [string, string];
  description: string;
  legacyTopLevel: boolean;
  run: () => Promise<void>;
};

const hookRunners = {
  'claude-code': runClaudeCodeHook,
  'copilot-cli': runCopilotCliHook,
  'gemini-cli': runGeminiCLIHook,
  'kimi-code': runKimiCodeHook,
} satisfies Record<RuntimeHookIntegrationId, () => Promise<void>>;

export const hookIntegrations: readonly HookIntegration[] = runtimeHookIntegrationMetadata.map(
  (integration) => ({
    ...integration,
    run: hookRunners[integration.id],
  }),
);

export function findHookIntegrationByFlag(args: readonly string[]): HookIntegration | undefined {
  return hookIntegrations.find((integration) =>
    integration.flags.some((flag) => args.includes(flag)),
  );
}

export function findLegacyTopLevelHookIntegration(
  flag: string | undefined,
): HookIntegration | undefined {
  return hookIntegrations.find(
    (integration) =>
      integration.legacyTopLevel &&
      integration.flags.some((integrationFlag) => integrationFlag === flag),
  );
}
