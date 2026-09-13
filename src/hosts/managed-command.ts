import { type RuntimeHookIntegrationId, runtimeHookIntegrationMetadata } from './catalog';

export const managedHookCommands = Object.fromEntries(
  runtimeHookIntegrationMetadata.map((integration) => [
    integration.id,
    `npx -y cc-safety-net hook ${integration.flags[1]}`,
  ]),
) as Record<RuntimeHookIntegrationId, string>;
