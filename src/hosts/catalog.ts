type RuntimeMetadata = {
  displayName?: string;
  flags: readonly [string, string];
  legacyFlags?: readonly string[];
  description: string;
  legacyTopLevelFlags: readonly string[];
};

type InstallMetadata = {
  flag: string;
  artifactKind: 'plugin' | 'extension' | 'hook config' | 'package';
  probeCommand: readonly [string, ...string[]];
};

type IntegrationCatalogEntry = {
  id: string;
  displayName: string;
  runtime?: RuntimeMetadata;
  install: InstallMetadata;
};

export const DEEPSEEK_HARNESS_NPM_PROBE = [
  'npx',
  '--offline',
  '--no-install',
  '@deepseek-ai/dsh',
  '--version',
] as const;

export const CURSOR_AGENT_PROBE = ['cursor-agent', '--version'] as const;

const catalog = [
  {
    id: 'antigravity-cli',
    displayName: 'Antigravity CLI',
    runtime: {
      flags: ['-ac', '--agy-cli'],
      description: 'Run as Antigravity CLI PreToolUse hook',
      legacyTopLevelFlags: [],
    },
    install: {
      flag: '--agy-cli',
      artifactKind: 'plugin',
      probeCommand: ['agy', '--version'],
    },
  },
  {
    id: 'claude-code',
    displayName: 'Claude Code',
    runtime: {
      displayName: 'Coding CLI',
      flags: ['-cc', '--coding-cli'],
      legacyFlags: ['--claude-code'],
      description: 'Run as Coding CLI PreToolUse hook',
      legacyTopLevelFlags: ['-cc', '--claude-code'],
    },
    install: {
      flag: '--claude-code',
      artifactKind: 'plugin',
      probeCommand: ['claude', '--version'],
    },
  },
  {
    id: 'codex',
    displayName: 'Codex',
    runtime: {
      flags: ['-cx', '--codex'],
      description: 'Run as a Codex PreToolUse hook',
      legacyTopLevelFlags: [],
    },
    install: {
      flag: '--codex',
      artifactKind: 'plugin',
      probeCommand: ['codex', '--version'],
    },
  },
  {
    id: 'copilot-cli',
    displayName: 'GitHub Copilot CLI',
    runtime: {
      flags: ['-cp', '--copilot-cli'],
      description: 'Run as GitHub Copilot CLI PreToolUse hook',
      legacyTopLevelFlags: ['-cp', '--copilot-cli'],
    },
    install: {
      flag: '--copilot-cli',
      artifactKind: 'plugin',
      probeCommand: ['copilot', '--binary-version'],
    },
  },
  {
    id: 'gemini-cli',
    displayName: 'Gemini CLI',
    runtime: {
      flags: ['-gc', '--gemini-cli'],
      description: 'Run as Gemini CLI BeforeTool hook',
      legacyTopLevelFlags: ['-gc', '--gemini-cli'],
    },
    install: {
      flag: '--gemini-cli',
      artifactKind: 'extension',
      probeCommand: ['gemini', '--version'],
    },
  },
  {
    id: 'grok-build',
    displayName: 'Grok Build',
    runtime: {
      flags: ['-gb', '--grok-build'],
      description: 'Run as Grok Build PreToolUse hook',
      legacyTopLevelFlags: [],
    },
    install: {
      flag: '--grok-build',
      artifactKind: 'hook config',
      probeCommand: ['grok', '--version'],
    },
  },
  {
    id: 'hermes-agent',
    displayName: 'Hermes Agent',
    runtime: {
      flags: ['-ha', '--hermes-agent'],
      description: 'Run as Hermes Agent pre_tool_call hook',
      legacyTopLevelFlags: [],
    },
    install: {
      flag: '--hermes-agent',
      artifactKind: 'plugin',
      probeCommand: ['hermes', '--version'],
    },
  },
  {
    id: 'kimi-code',
    displayName: 'Kimi Code',
    runtime: {
      flags: ['-kc', '--kimi-code'],
      description: 'Run as Kimi Code PreToolUse hook',
      legacyTopLevelFlags: [],
    },
    install: {
      flag: '--kimi-code',
      artifactKind: 'hook config',
      probeCommand: ['kimi', '--version'],
    },
  },
  {
    id: 'openclaw',
    displayName: 'OpenClaw',
    install: {
      flag: '--openclaw',
      artifactKind: 'plugin',
      probeCommand: ['openclaw', '--version'],
    },
  },
  {
    id: 'opencode',
    displayName: 'OpenCode',
    install: {
      flag: '--opencode',
      artifactKind: 'plugin',
      probeCommand: ['opencode', '--version'],
    },
  },
  {
    id: 'pi',
    displayName: 'Pi',
    install: {
      flag: '--pi',
      artifactKind: 'package',
      probeCommand: ['pi', '--version'],
    },
  },
  {
    id: 'cursor',
    displayName: 'Cursor',
    runtime: {
      flags: ['-cu', '--cursor'],
      description: 'Run as Cursor preToolUse hook',
      legacyTopLevelFlags: [],
    },
    install: {
      flag: '--cursor',
      artifactKind: 'hook config',
      probeCommand: ['cursor', '--version'],
    },
  },
  {
    id: 'deepseek-harness',
    displayName: 'DeepSeek Harness',
    install: {
      flag: '--deepseek-harness',
      artifactKind: 'package',
      probeCommand: DEEPSEEK_HARNESS_NPM_PROBE,
    },
  },
  {
    id: 'devin',
    displayName: 'Devin CLI',
    runtime: {
      flags: ['-dv', '--devin'],
      description: 'Run as Devin CLI PreToolUse hook',
      legacyTopLevelFlags: [],
    },
    install: {
      flag: '--devin',
      artifactKind: 'hook config',
      probeCommand: ['devin', '--version'],
    },
  },
  {
    id: 'droid',
    displayName: 'Factory Droid',
    runtime: {
      flags: ['-fd', '--droid'],
      description: 'Run as Factory Droid PreToolUse hook',
      legacyTopLevelFlags: [],
    },
    install: {
      flag: '--droid',
      artifactKind: 'hook config',
      probeCommand: ['droid', '--version'],
    },
  },
  {
    id: 'amp',
    displayName: 'Amp Code',
    install: {
      flag: '--amp',
      artifactKind: 'plugin',
      probeCommand: ['amp', '--version'],
    },
  },
] as const satisfies readonly IntegrationCatalogEntry[];

export type IntegrationId = (typeof catalog)[number]['id'];
type RuntimeEntry = Extract<(typeof catalog)[number], { runtime: RuntimeMetadata }>;
export type RuntimeHookIntegrationId = RuntimeEntry['id'];

const catalogByDisplayName = catalog
  .slice()
  .sort((a, b) => a.displayName.localeCompare(b.displayName, 'en'));

export const doctorIntegrationOrder = catalogByDisplayName
  .map((integration) => integration.id)
  .sort((a, b) => Number(b === 'claude-code') - Number(a === 'claude-code'));

export const runtimeHookIntegrationMetadata = catalogByDisplayName
  .filter((integration): integration is RuntimeEntry => 'runtime' in integration)
  .map((integration) => ({
    id: integration.id,
    displayName:
      'displayName' in integration.runtime
        ? integration.runtime.displayName
        : integration.displayName,
    flags: integration.runtime.flags,
    legacyFlags: 'legacyFlags' in integration.runtime ? integration.runtime.legacyFlags : [],
    description: integration.runtime.description,
    legacyTopLevelFlags: integration.runtime.legacyTopLevelFlags,
  }));

export const installIntegrationMetadata = catalogByDisplayName.map((integration) => ({
  id: integration.id,
  ...integration.install,
}));

export const integrationDisplayNames = Object.fromEntries(
  catalog.map((integration) => [integration.id, integration.displayName]),
) as Record<IntegrationId, string>;

export function getIntegrationDisplayName(id: IntegrationId): string {
  return integrationDisplayNames[id];
}
