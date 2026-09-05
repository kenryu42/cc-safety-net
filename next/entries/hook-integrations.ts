import { parseCommandArgs } from '@next/cli/args';
import { runAntigravityCliHook } from '@next/hosts/antigravity-cli/hook';
import { type RuntimeHookIntegrationId, runtimeHookIntegrationMetadata } from '@next/hosts/catalog';
import { runClaudeCodeHook } from '@next/hosts/claude-code/hook';
import { runCodexHook } from '@next/hosts/codex/hook';
import { runCopilotCliHook } from '@next/hosts/copilot-cli/hook';
import { runCursorHook } from '@next/hosts/cursor/hook';
import { runGeminiCLIHook } from '@next/hosts/gemini-cli/hook';
import { runGrokBuildHook } from '@next/hosts/grok-build/hook';
import { runHermesAgentHook } from '@next/hosts/hermes-agent/hook';
import { runKimiCodeHook } from '@next/hosts/kimi-code/hook';

export type HookIntegration = {
  id: RuntimeHookIntegrationId;
  displayName: string;
  flags: readonly [string, string];
  legacyFlags: readonly string[];
  description: string;
  legacyTopLevelFlags: readonly string[];
  run: () => Promise<void>;
};

const hookRunners = {
  'antigravity-cli': runAntigravityCliHook,
  'claude-code': runClaudeCodeHook,
  codex: runCodexHook,
  'copilot-cli': runCopilotCliHook,
  cursor: runCursorHook,
  'gemini-cli': runGeminiCLIHook,
  'grok-build': runGrokBuildHook,
  'hermes-agent': runHermesAgentHook,
  'kimi-code': runKimiCodeHook,
} satisfies Record<RuntimeHookIntegrationId, () => Promise<void>>;

export const hookIntegrations: readonly HookIntegration[] = runtimeHookIntegrationMetadata.map(
  (integration) => ({
    ...integration,
    run: hookRunners[integration.id],
  }),
);

/**
 * Resolve the one integration the `hook` arguments name. Anything else — no flag,
 * two integrations, a stray option or argument — resolves to nothing, because the
 * hook command runs exactly one integration or none.
 */
export function findHookIntegrationByFlag(args: readonly string[]): HookIntegration | undefined {
  const parsed = parseCommandArgs(
    {
      label: 'hook',
      booleans: Object.fromEntries(
        hookIntegrations.map((integration) => [
          integration.id,
          [...integration.flags, ...integration.legacyFlags],
        ]),
      ),
    },
    args,
  );
  if (parsed.errors.length > 0) return undefined;

  const named = hookIntegrations.filter((integration) => parsed.flags[integration.id]);
  return named.length === 1 ? named[0] : undefined;
}

export function findLegacyTopLevelHookIntegration(
  flag: string | undefined,
): HookIntegration | undefined {
  return hookIntegrations.find((integration) =>
    integration.legacyTopLevelFlags.some((integrationFlag) => integrationFlag === flag),
  );
}
