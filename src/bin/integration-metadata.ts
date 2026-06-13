type IntegrationMetadata = {
  id: string;
  displayName: string;
  doctorVisible: boolean;
  runtimeHook?: {
    flags: readonly [string, string];
    description: string;
    legacyTopLevel: boolean;
    order: number;
  };
};

const integrationMetadata = [
  {
    id: 'claude-code',
    displayName: 'Claude Code',
    doctorVisible: true,
    runtimeHook: {
      flags: ['-cc', '--claude-code'],
      description: 'Run as Claude Code PreToolUse hook',
      legacyTopLevel: true,
      order: 1,
    },
  },
  {
    id: 'codex',
    displayName: 'Codex',
    doctorVisible: true,
  },
  {
    id: 'copilot-cli',
    displayName: 'Copilot CLI',
    doctorVisible: true,
    runtimeHook: {
      flags: ['-cp', '--copilot-cli'],
      description: 'Run as Copilot CLI PreToolUse hook',
      legacyTopLevel: true,
      order: 2,
    },
  },
  {
    id: 'gemini-cli',
    displayName: 'Gemini CLI',
    doctorVisible: true,
    runtimeHook: {
      flags: ['-gc', '--gemini-cli'],
      description: 'Run as Gemini CLI BeforeTool hook',
      legacyTopLevel: true,
      order: 3,
    },
  },
  {
    id: 'kimi-code',
    displayName: 'Kimi Code',
    doctorVisible: true,
    runtimeHook: {
      flags: ['-kc', '--kimi-code'],
      description: 'Run as Kimi Code PreToolUse hook',
      legacyTopLevel: false,
      order: 4,
    },
  },
  {
    id: 'opencode',
    displayName: 'OpenCode',
    doctorVisible: true,
  },
  {
    id: 'pi',
    displayName: 'Pi',
    doctorVisible: true,
  },
] as const satisfies readonly IntegrationMetadata[];

export type IntegrationId = (typeof integrationMetadata)[number]['id'];

type RuntimeHookIntegrationMetadata = Extract<
  (typeof integrationMetadata)[number],
  { runtimeHook: object }
>;

export type RuntimeHookIntegrationId = RuntimeHookIntegrationMetadata['id'];

export const doctorIntegrationOrder = integrationMetadata
  .filter((integration) => integration.doctorVisible)
  .map((integration) => integration.id);

export const runtimeHookIntegrationMetadata = integrationMetadata
  .filter(
    (integration): integration is RuntimeHookIntegrationMetadata => 'runtimeHook' in integration,
  )
  .toSorted((a, b) => a.runtimeHook.order - b.runtimeHook.order)
  .map((integration) => ({
    id: integration.id,
    displayName: integration.displayName,
    flags: integration.runtimeHook.flags,
    description: integration.runtimeHook.description,
    legacyTopLevel: integration.runtimeHook.legacyTopLevel,
  }));

export function getIntegrationDisplayName(id: IntegrationId): string {
  return integrationMetadata.find((integration) => integration.id === id)?.displayName ?? id;
}
