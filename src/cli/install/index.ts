import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseCommandArgs } from '@/cli/args';
import { checkForUpdates } from '@/cli/doctor/updates';
import { printInstallBanner } from '@/cli/install/banner';
import {
  canPromptInstallTargets,
  type KimiInstallMethod,
  promptInstallTargets,
  promptKimiInstallMethod,
} from '@/cli/install/prompt';
import { awaitWithSpinner, resolveAfterOptionalBanner } from '@/cli/startup/banner';
import { colors } from '@/cli/utils/colors';
import { createProcessEnvironment, type Environment } from '@/core/environment';
import { atomicWriteFile } from '@/core/io/atomic-write';
import { stripJsonComments } from '@/core/io/jsonc';
import { installAmp, uninstallAmp } from '@/hosts/amp/install';
import { installAntigravityCli, uninstallAntigravityCli } from '@/hosts/antigravity-cli/install';
import { getIntegrationDisplayName } from '@/hosts/catalog';
import { detectClaudeCode, hasClaudeInstalledPlugin } from '@/hosts/claude-code/detect';
import { _getCopilotConfigHome } from '@/hosts/copilot-cli/detect';
import {
  COPILOT_LEGACY_PLUGIN_DIR,
  COPILOT_PLUGIN_DIR,
  COPILOT_PLUGIN_ID,
  COPILOT_PRE_RENAME_PLUGIN_DIR,
  COPILOT_PRE_RENAME_PLUGIN_ID,
  hasCopilotLegacyPlugin,
  hasCopilotMarketplace,
  hasCopilotPreRenamePlugin,
  hasCopilotSafetyNetPlugin,
} from '@/hosts/copilot-cli/plugin-id';
import { installCursor, uninstallCursor } from '@/hosts/cursor/install';
import { detectAllHooks } from '@/hosts/detect/index';
import type { UpdateInfo } from '@/hosts/doctor-types';
import { detectGeminiCLI } from '@/hosts/gemini-cli/detect';
import { installGrokBuild, uninstallGrokBuild } from '@/hosts/grok-build/install';
import { HERMES_AGENT_PLUGIN_NAME } from '@/hosts/hermes-agent/artifact';
import { isHermesAgentPluginEnabled } from '@/hosts/hermes-agent/detect';
import {
  installHermesAgent,
  readOwnedHermesAgentFiles,
  uninstallHermesAgent,
} from '@/hosts/hermes-agent/install';
import { clearBunxSafetyNetCache } from '@/hosts/install/bunx-cache';
import {
  applyInstallTargetState,
  buildInstallTargetChoicesAsync,
  type InstallTargetChoice,
  type InstallTargetProbe,
  probeInstallTarget,
} from '@/hosts/install/choices';
import {
  type NativeCommand,
  runNativeCleanupCommands,
  runNativeCommand,
  runNativeCommands,
} from '@/hosts/install/native';
import { clearNpxSafetyNetCache } from '@/hosts/install/npx-cache';
import {
  INSTALL_TARGETS,
  type InstallAction,
  type InstallTarget,
  orderInstallTargets,
  runInstallTargetsInOrder,
} from '@/hosts/install/targets';
import type { InstallResult } from '@/hosts/install/types';
import { detect as detectKimiCodeHook } from '@/hosts/kimi-code/detect';
import { installKimiCode, uninstallKimiCode } from '@/hosts/kimi-code/install';
import { OPENCLAW_PLUGIN_ID } from '@/hosts/openclaw/artifact';
import {
  assertOpenClawPluginDirIsOurs,
  getOpenClawInstallCommands,
  verifyOpenClawPluginRuntime,
} from '@/hosts/openclaw/install';
import {
  clearOpenCodeCache,
  uninstallOpenCode,
  verifyOpenCodePluginRuntime,
} from '@/hosts/opencode/install';
import { getPiSettingsPath, isPiSafetyNetPackageSource } from '@/hosts/pi/detect';
import { defaultVersionFetcher, type VersionFetcher } from '@/hosts/system-info';

type ConfigInstallTarget = Extract<
  InstallTarget,
  'antigravity-cli' | 'grok-build' | 'kimi-code' | 'cursor'
>;

type ManagedArtifactTarget = Extract<InstallTarget, 'amp' | 'hermes-agent'>;
type NativeInstallTarget = Exclude<InstallTarget, ConfigInstallTarget | ManagedArtifactTarget>;
type NativeInstallPlan = {
  commands: readonly NativeCommand[];

  cleanupCommands?: readonly NativeCommand[];
  update?: boolean;
};
type InstallTargetSelection = readonly InstallTarget[] | null | 'update';

export type RunInstallCommandOptions = {
  input?: NodeJS.ReadStream;
  output?: NodeJS.WriteStream;
  probeTargets?: InstallTargetProbe;
  detectConfiguredTargets?: () => Promise<readonly InstallTarget[]>;
  fetchVersion?: VersionFetcher;
  selectTargets?: (
    action: InstallAction,
    choices: readonly InstallTargetChoice[],
  ) => Promise<InstallTargetSelection>;
  selectKimiInstallMethod?: () => Promise<KimiInstallMethod | null>;
  runUpdate?: () => Promise<number>;
};

type UpdateCommandOptions = {
  fetchVersion?: VersionFetcher;
  input?: NodeJS.ReadStream;
  output?: NodeJS.WriteStream;
  showBanner?: boolean;
  checkLatestVersion?: () => Promise<UpdateInfo>;
  scriptPath?: string;
};

type NativeInstallDefinition = {
  installCommands:
    | readonly NativeCommand[]
    | ((
        environment: Environment,
        codexPluginListOutput?: string | null,
      ) => NativeInstallPlan | Promise<NativeInstallPlan>);
  uninstallCommands?: readonly NativeCommand[];
  beforeInstall?: (environment: Environment) => void;
  postInstallMessage?: string;
};
type InstallTargetResolution = {
  ready?: Promise<unknown>;
  finish: () => Promise<InstallTargetSelection>;
};

const CLAUDE_LEGACY_PLUGIN_ID = 'safety-net@cc-marketplace';

const NATIVE_UPDATE_TARGETS = new Set<InstallTarget>([
  'claude-code',
  'codex',
  'copilot-cli',
  'gemini-cli',
  'hermes-agent',
  'openclaw',
  'opencode',
  'pi',
]);

const NPX_CACHE_TARGETS = new Set<InstallTarget>([
  'antigravity-cli',
  'cursor',
  'grok-build',
  'hermes-agent',
  'kimi-code',
]);

function hasCodexLegacyPlugin(output: string | null): boolean {
  return /^\s*safety-net@cc-marketplace[^a-z0-9-][^\n]*installed,/m.test(output ?? '');
}

function hasCodexReplacementPlugin(output: string | null): boolean {
  return /^\s*cc-safety-net[^a-z0-9-][^\n]*installed,/m.test(output ?? '');
}

function hasCodexMarketplace(output: string | null): boolean {
  return /^Marketplace `cc-marketplace`\s*$/m.test(output ?? '');
}

const NATIVE_INSTALLS: Record<NativeInstallTarget, NativeInstallDefinition> = {
  'claude-code': {
    installCommands: (environment) => {
      const update = hasClaudeInstalledPlugin(environment, 'cc-safety-net@cc-marketplace');
      return {
        commands: [
          ...(update
            ? ([
                ['claude', 'plugin', 'marketplace', 'update', 'cc-marketplace'],
                ['claude', 'plugin', 'update', 'cc-safety-net@cc-marketplace'],
              ] as const)
            : ([
                ['claude', 'plugin', 'marketplace', 'add', 'kenryu42/cc-marketplace'],

                ['claude', 'plugin', 'marketplace', 'update', 'cc-marketplace'],
                ['claude', 'plugin', 'install', 'cc-safety-net@cc-marketplace'],
              ] as const)),
          ...(detectClaudeCode(environment).status === 'disabled'
            ? ([['claude', 'plugin', 'enable', 'cc-safety-net@cc-marketplace']] as const)
            : []),
        ],

        cleanupCommands: hasClaudeInstalledPlugin(environment, CLAUDE_LEGACY_PLUGIN_ID)
          ? ([['claude', 'plugin', 'uninstall', CLAUDE_LEGACY_PLUGIN_ID]] as const)
          : [],
        update,
      };
    },
    uninstallCommands: [
      ['claude', 'plugin', 'uninstall', 'cc-safety-net@cc-marketplace'],
      ['claude', 'plugin', 'marketplace', 'remove', 'cc-marketplace'],
    ],
  },
  codex: {
    installCommands: async (_environment, codexPluginListOutput) => {
      const pluginList =
        codexPluginListOutput ?? (await runNativeCommand(['codex', 'plugin', 'list']));
      const update = hasCodexReplacementPlugin(pluginList);
      return {
        commands: [
          update || hasCodexMarketplace(pluginList)
            ? (['codex', 'plugin', 'marketplace', 'upgrade', 'cc-marketplace'] as const)
            : (['codex', 'plugin', 'marketplace', 'add', 'kenryu42/cc-marketplace'] as const),
          ['codex', 'plugin', 'add', 'cc-safety-net@cc-marketplace'],
        ],
        cleanupCommands: hasCodexLegacyPlugin(pluginList)
          ? ([['codex', 'plugin', 'remove', 'safety-net@cc-marketplace']] as const)
          : [],
        update,
      };
    },
    uninstallCommands: [
      ['codex', 'plugin', 'remove', 'cc-safety-net@cc-marketplace'],
      ['codex', 'plugin', 'marketplace', 'remove', 'cc-marketplace'],
    ],
    postInstallMessage:
      'Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it.',
  },
  'copilot-cli': {
    installCommands: async () => {
      const pluginList = await runNativeCommand(['copilot', 'plugin', 'list']);
      const cleanupCommands = [
        ...(hasCopilotLegacyPlugin(pluginList)
          ? ([['copilot', 'plugin', 'uninstall', 'copilot-safety-net']] as const)
          : []),
        ...(hasCopilotPreRenamePlugin(pluginList)
          ? ([['copilot', 'plugin', 'uninstall', COPILOT_PRE_RENAME_PLUGIN_ID]] as const)
          : []),
      ];
      if (hasCopilotSafetyNetPlugin(pluginList))
        return {
          commands: [
            ['copilot', 'plugin', 'marketplace', 'update', 'cc-marketplace'],
            ['copilot', 'plugin', 'update', COPILOT_PLUGIN_ID],
          ],
          cleanupCommands,
          update: true,
        };

      return {
        commands: [
          hasCopilotMarketplace(
            await runNativeCommand(['copilot', 'plugin', 'marketplace', 'list']),
          )
            ? (['copilot', 'plugin', 'marketplace', 'update', 'cc-marketplace'] as const)
            : (['copilot', 'plugin', 'marketplace', 'add', 'kenryu42/cc-marketplace'] as const),
          ['copilot', 'plugin', 'install', COPILOT_PLUGIN_ID],
        ],
        cleanupCommands,
      };
    },
    uninstallCommands: [
      ['copilot', 'plugin', 'uninstall', 'cc-safety-net@cc-marketplace'],
      ['copilot', 'plugin', 'marketplace', 'remove', 'cc-marketplace'],
    ],
  },
  'gemini-cli': {
    installCommands: (environment) => {
      const detection = detectGeminiCLI(environment);
      if (detection.status === 'configured')
        return {
          commands: [['gemini', 'extensions', 'update', 'gemini-safety-net']],
          update: true,
        };
      if (detection.status === 'disabled')
        return {
          commands: [
            ['gemini', 'extensions', 'update', 'gemini-safety-net'],
            ['gemini', 'extensions', 'enable', 'gemini-safety-net'],
          ],
          update: true,
        };
      return {
        commands: [
          [
            'gemini',
            'extensions',
            'install',
            'https://github.com/kenryu42/gemini-safety-net',
            '--consent',
          ],
        ],
      };
    },
    uninstallCommands: [['gemini', 'extensions', 'uninstall', 'gemini-safety-net']],
  },
  openclaw: {
    beforeInstall: assertOpenClawPluginDirIsOurs,
    installCommands: () => ({ commands: getOpenClawInstallCommands() }),
    uninstallCommands: [['openclaw', 'plugins', 'uninstall', OPENCLAW_PLUGIN_ID, '--force']],
    postInstallMessage: [
      'Restart the OpenClaw Gateway to apply the change.',
      'If plugins.allow is set in openclaw.json, it must also list cc-safety-net.',
    ].join('\n'),
  },
  opencode: {
    beforeInstall: clearOpenCodeCache,
    installCommands: [['opencode', 'plugin', '-g', '-f', 'cc-safety-net@latest']],
  },
  pi: {
    installCommands: [['pi', 'install', 'npm:cc-safety-net']],
    uninstallCommands: [['pi', 'uninstall', 'npm:cc-safety-net']],
  },
};

function parseJsonSettings(
  configPath: string,
  preprocess = (raw: string) => raw,
): Record<string, unknown> {
  try {
    const config = JSON.parse(preprocess(readFileSync(configPath, 'utf-8')));
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      throw new Error(`Settings file ${configPath} must be a JSON object`);
    }
    return config as Record<string, unknown>;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse ${configPath}: ${error.message}`);
    }
    throw error;
  }
}

function enableCopilotPlugin(environment: Environment): string | undefined {
  const settingsPath = join(_getCopilotConfigHome(environment), 'settings.json');
  if (!existsSync(settingsPath)) return;

  const settings = parseJsonSettings(settingsPath, stripJsonComments);
  const enabledPlugins = settings.enabledPlugins;
  if (!enabledPlugins || typeof enabledPlugins !== 'object' || Array.isArray(enabledPlugins))
    return;
  if ((enabledPlugins as Record<string, unknown>)[COPILOT_PLUGIN_ID] !== false) return;

  const raw = readFileSync(settingsPath, 'utf-8');
  const flipped = raw.replace(new RegExp(`("${COPILOT_PLUGIN_ID}"\\s*:\\s*)false`), '$1true');
  (enabledPlugins as Record<string, unknown>)[COPILOT_PLUGIN_ID] = true;
  atomicWriteFile(
    settingsPath,
    flipped !== raw ? flipped : `${JSON.stringify(settings, null, 2)}\n`,
  );
  return `Enabled ${COPILOT_PLUGIN_ID} plugin in ${settingsPath}`;
}

function removePiExtensionsFilter(environment: Environment): string | undefined {
  const settingsPath = getPiSettingsPath(environment);
  if (!existsSync(settingsPath)) return;

  const settings = parseJsonSettings(settingsPath);
  if (!Array.isArray(settings.packages)) return;

  const entry = settings.packages.find(
    (candidate): candidate is Record<string, unknown> =>
      !!candidate &&
      typeof candidate === 'object' &&
      !Array.isArray(candidate) &&
      isPiSafetyNetPackageSource((candidate as Record<string, unknown>).source) &&
      'extensions' in candidate,
  );
  if (!entry) return;

  delete entry.extensions;
  atomicWriteFile(settingsPath, `${JSON.stringify(settings, null, 2)}\n`);
  return `Enabled npm:cc-safety-net extensions in ${settingsPath}`;
}

function parseInstallTarget(args: readonly string[], action: InstallAction): InstallTarget {
  const parsed = parseCommandArgs(
    {
      label: action,
      booleans: Object.fromEntries(INSTALL_TARGETS.map((target) => [target.target, [target.flag]])),
    },
    args,
  );
  const error = parsed.errors[0];
  if (error) throw new Error(error);

  const targets = INSTALL_TARGETS.filter((target) => parsed.flags[target.target]).map(
    (target) => target.target,
  );
  if (targets.length !== 1)
    throw new Error(
      `Choose exactly one ${action} target: ${INSTALL_TARGETS.map((target) => target.flag).join(', ')}`,
    );
  return targets[0] as InstallTarget;
}

async function detectInstallHookState(
  environment: Environment,
  fetchVersion = defaultVersionFetcher,
) {
  const [ampPluginListOutput, codexPluginListOutput, copilotCliVersion] = await Promise.all([
    fetchVersion(['amp', 'plugins', 'list'], 30_000),

    fetchVersion(['codex', 'plugin', 'list'], 30_000),
    fetchVersion(['copilot', '--binary-version']),
  ]);

  return {
    codexPluginListOutput,
    hooks: detectAllHooks(environment, process.cwd(), {
      ampPluginListOutput,
      codexPluginListOutput,
      copilotCliVersion,
    }),
  };
}

async function detectConfiguredInstallTargets(
  environment: Environment,
  action: InstallAction,
  fetchVersion = defaultVersionFetcher,
): Promise<InstallTarget[]> {
  const state = await detectInstallHookState(environment, fetchVersion);
  return state.hooks

    .filter((hook) =>
      action === 'install'
        ? hook.configured
        : hook.detected || hook.inspectionStatus === 'not-inspected',
    )
    .filter(
      (hook) =>
        hook.platform !== 'codex' ||
        !hasCodexLegacyPlugin(state.codexPluginListOutput) ||
        hasCodexReplacementPlugin(state.codexPluginListOutput),
    )
    .map((hook) => hook.platform as InstallTarget);
}

function startResolveInstallTargets(
  environment: Environment,
  action: InstallAction,
  args: readonly string[],
  options: RunInstallCommandOptions,
): InstallTargetResolution {
  if (args.length > 0)
    return {
      finish: async () => [parseInstallTarget(args, action)],
    };
  if (!options.selectTargets && !canPromptInstallTargets(options.input, options.output)) {
    return {
      finish: async () => [parseInstallTarget(args, action)],
    };
  }

  const detectConfiguredTargets =
    options.detectConfiguredTargets ??
    (() => detectConfiguredInstallTargets(environment, action, options.fetchVersion));
  const ready = Promise.all([
    buildInstallTargetChoicesAsync(options.probeTargets),
    detectConfiguredTargets(),
  ]);

  return {
    ready,
    finish: async () => {
      const [choices, configuredTargets] = await ready;
      const targetChoices = applyInstallTargetState(choices, {
        action,
        configuredTargets,
      });
      const selected = options.selectTargets
        ? await options.selectTargets(action, allowKimiMethodChoice(action, targetChoices))
        : await promptInstallTargets(action, allowKimiMethodChoice(action, targetChoices), {
            input: options.input,
            output: options.output,
          });
      if (selected === 'update') return selected;
      if (!selected || selected.length === 0) return null;

      return orderInstallTargets(selected);
    },
  };
}

async function installNativeTarget(
  target: NativeInstallTarget,
  environment: Environment,
  updating = false,
  codexPluginListOutput?: string | null,
): Promise<string> {
  const definition = NATIVE_INSTALLS[target];
  definition.beforeInstall?.(environment);
  const plan =
    typeof definition.installCommands === 'function'
      ? await definition.installCommands(environment, codexPluginListOutput)
      : { commands: definition.installCommands };
  await runNativeCommands(plan.commands);
  await runNativeCleanupCommands(plan.cleanupCommands ?? []);
  return [
    `${plan.update || updating ? 'Updated' : 'Installed'} ${getIntegrationDisplayName(target)} integration`,
    definition.postInstallMessage,
  ]
    .filter(Boolean)
    .join('\n');
}

async function uninstallNativeTarget(
  target: Exclude<NativeInstallTarget, 'opencode'>,
): Promise<string> {
  const definition = NATIVE_INSTALLS[target];
  if (!definition.uninstallCommands)
    throw new Error(`${getIntegrationDisplayName(target)} uninstall is not supported`);

  await runNativeCommands(definition.uninstallCommands);
  return `Uninstalled ${getIntegrationDisplayName(target)} integration`;
}

function uninstallOpenCodeTarget(environment: Environment): string {
  const result = uninstallOpenCode(environment);
  return result.alreadyInstalled
    ? `Uninstalled OpenCode plugin from ${result.path}`
    : `OpenCode plugin not installed in ${result.path}`;
}

const CONFIG_INSTALLS = {
  'antigravity-cli': { install: installAntigravityCli, uninstall: uninstallAntigravityCli },
  cursor: { install: installCursor, uninstall: uninstallCursor },
  'grok-build': { install: installGrokBuild, uninstall: uninstallGrokBuild },
  'kimi-code': { install: installKimiCode, uninstall: uninstallKimiCode },
} satisfies Record<
  ConfigInstallTarget,
  Record<InstallAction, (environment: Environment) => InstallResult>
>;

function runConfigInstallTarget(
  action: InstallAction,
  target: ConfigInstallTarget,
  environment: Environment,
  updating = false,
): string {
  if (action === 'install' && !updating) clearNpxSafetyNetCache(environment);
  const result = CONFIG_INSTALLS[target][action](environment);
  const name = getIntegrationDisplayName(target);
  const pastTense = action !== 'install' ? 'Uninstalled' : updating ? 'Updated' : 'Installed';

  return action === 'install' && result.alreadyInstalled
    ? updating
      ? `${name} hook up to date in ${result.path}`
      : `${name} hook already installed in ${result.path}`
    : action === 'uninstall' && !result.alreadyInstalled
      ? `${name} hook not installed in ${result.path}`
      : `${pastTense} ${name} hook ${action === 'install' ? 'in' : 'from'} ${result.path}`;
}

const MANAGED_ARTIFACT_INSTALLS: Record<
  ManagedArtifactTarget,
  {
    install: (environment: Environment) => InstallResult | Promise<InstallResult>;
    uninstall: (environment: Environment) => InstallResult | Promise<InstallResult>;

    afterInstall?: (environment: Environment) => Promise<boolean>;
    beforeUninstall?: (environment: Environment) => Promise<void>;
    restartNote: string;
  }
> = {
  amp: {
    install: installAmp,
    uninstall: uninstallAmp,
    restartNote:
      'Amp personal plugins apply to every Amp session, including Orb threads. Restart Amp or run "plugins: reload" to apply the change.',
  },
  'hermes-agent': {
    install: installHermesAgent,
    uninstall: uninstallHermesAgent,

    afterInstall: async (environment) => {
      const wasEnabled = isHermesAgentPluginEnabled(environment);
      await runNativeCommand([
        'hermes',
        'plugins',
        'enable',
        HERMES_AGENT_PLUGIN_NAME,
        '--no-allow-tool-override',
      ]);
      return !wasEnabled;
    },

    beforeUninstall: async (environment) => {
      readOwnedHermesAgentFiles(environment);
      try {
        await runNativeCommand(['hermes', 'plugins', 'disable', HERMES_AGENT_PLUGIN_NAME]);
      } catch (error) {
        console.warn(
          `${error instanceof Error ? error.message : String(error)}\nRemoving the plugin files anyway; ${HERMES_AGENT_PLUGIN_NAME} may still be listed in the Hermes config.`,
        );
      }
    },
    restartNote: 'Restart Hermes to apply the change.',
  },
};

async function runManagedArtifactInstallTarget(
  action: InstallAction,
  target: ManagedArtifactTarget,
  environment: Environment,
  updating = false,
): Promise<string> {
  const definition = MANAGED_ARTIFACT_INSTALLS[target];
  if (action === 'uninstall') await definition.beforeUninstall?.(environment);
  const result =
    action === 'install'
      ? await definition.install(environment)
      : await definition.uninstall(environment);
  const changedHostState = action === 'install' && (await definition.afterInstall?.(environment));
  const name = getIntegrationDisplayName(target);
  const noChange =
    !changedHostState &&
    ((action === 'install' && result.alreadyInstalled) ||
      (action === 'uninstall' && !result.alreadyInstalled));
  const pastTense = action !== 'install' ? 'Uninstalled' : updating ? 'Updated' : 'Installed';
  const message = noChange
    ? action === 'install'
      ? `${name} plugin ${updating ? 'up to date' : 'already installed'} at ${result.path}`
      : `${name} plugin not installed at ${result.path}`
    : `${pastTense} ${name} plugin ${action === 'install' ? 'at' : 'from'} ${result.path}`;

  return [message, noChange ? undefined : definition.restartNote].filter(Boolean).join('\n');
}

const INSTALL_OPERATIONS = {
  amp: {
    install: (environment: Environment, updating?: boolean) =>
      runManagedArtifactInstallTarget('install', 'amp', environment, updating),
    uninstall: (environment: Environment) =>
      runManagedArtifactInstallTarget('uninstall', 'amp', environment),
  },
  'antigravity-cli': {
    install: (environment: Environment, updating?: boolean) =>
      runConfigInstallTarget('install', 'antigravity-cli', environment, updating),
    uninstall: (environment: Environment) =>
      runConfigInstallTarget('uninstall', 'antigravity-cli', environment),
  },
  'claude-code': {
    install: (environment: Environment, updating?: boolean) =>
      installNativeTarget('claude-code', environment, updating),
    uninstall: () => uninstallNativeTarget('claude-code'),
  },
  codex: {
    install: (
      environment: Environment,
      updating?: boolean,
      codexPluginListOutput?: string | null,
    ) => installNativeTarget('codex', environment, updating, codexPluginListOutput),
    uninstall: () => uninstallNativeTarget('codex'),
  },
  'copilot-cli': {
    install: async (environment: Environment, updating?: boolean) =>
      [
        await installNativeTarget('copilot-cli', environment, updating),
        enableCopilotPlugin(environment),
      ]
        .filter(Boolean)
        .join('\n'),
    uninstall: () => uninstallNativeTarget('copilot-cli'),
  },
  cursor: {
    install: (environment: Environment, updating?: boolean) =>
      runConfigInstallTarget('install', 'cursor', environment, updating),
    uninstall: (environment: Environment) =>
      runConfigInstallTarget('uninstall', 'cursor', environment),
  },
  'gemini-cli': {
    install: (environment: Environment, updating?: boolean) =>
      installNativeTarget('gemini-cli', environment, updating),
    uninstall: () => uninstallNativeTarget('gemini-cli'),
  },
  'grok-build': {
    install: (environment: Environment, updating?: boolean) =>
      runConfigInstallTarget('install', 'grok-build', environment, updating),
    uninstall: (environment: Environment) =>
      runConfigInstallTarget('uninstall', 'grok-build', environment),
  },
  'hermes-agent': {
    install: (environment: Environment, updating?: boolean) => {
      if (!updating) clearNpxSafetyNetCache(environment);
      return runManagedArtifactInstallTarget('install', 'hermes-agent', environment, updating);
    },
    uninstall: (environment: Environment) =>
      runManagedArtifactInstallTarget('uninstall', 'hermes-agent', environment),
  },
  'kimi-code': {
    install: (environment: Environment, updating?: boolean) =>
      runConfigInstallTarget('install', 'kimi-code', environment, updating),
    uninstall: (environment: Environment) =>
      runConfigInstallTarget('uninstall', 'kimi-code', environment),
  },
  openclaw: {
    install: async (environment: Environment, updating?: boolean) => {
      const message = await installNativeTarget('openclaw', environment, updating);
      await verifyOpenClawPluginRuntime();
      return message;
    },
    uninstall: (environment: Environment) => {
      assertOpenClawPluginDirIsOurs(environment);
      return uninstallNativeTarget('openclaw');
    },
  },
  opencode: {
    install: async (environment: Environment, updating?: boolean) => {
      const message = await installNativeTarget('opencode', environment, updating);
      await verifyOpenCodePluginRuntime(environment);
      return message;
    },
    uninstall: (environment: Environment) => uninstallOpenCodeTarget(environment),
  },
  pi: {
    install: async (environment: Environment, updating?: boolean) =>
      [
        await installNativeTarget('pi', environment, updating),
        removePiExtensionsFilter(environment),
      ]
        .filter(Boolean)
        .join('\n'),
    uninstall: () => uninstallNativeTarget('pi'),
  },
} satisfies Record<
  InstallTarget,
  Record<
    InstallAction,
    (
      environment: Environment,
      updating?: boolean,
      codexPluginListOutput?: string | null,
    ) => string | Promise<string>
  >
>;

const KIMI_PLUGIN_INSTRUCTIONS = [
  'Install CC Safety Net as a native Kimi Code plugin:',
  '',
  '  1. Start Kimi Code and run: /plugins install https://github.com/kenryu42/cc-safety-net',
  '     Confirm the trust prompt; it defaults to cancel.',
  '  2. Run /reload, or start a new session.',
  '',
  'Note: Kimi Code hooks are fail-open. When the hook process cannot start, crashes, or times',
  'out, Kimi Code allows the tool call.',
].join('\n');

function formatKimiPluginInstructions(environment: Environment): string {
  if (detectKimiCodeHook({ environment, cwd: process.cwd() }).status !== 'configured') {
    return KIMI_PLUGIN_INSTRUCTIONS;
  }

  return [
    KIMI_PLUGIN_INSTRUCTIONS,
    '',
    colors.red(
      [
        'CAUTION: the global Kimi Code hook is installed and will run alongside the plugin.',
        'After the plugin is active, remove it with: cc-safety-net uninstall --kimi-code',
      ].join('\n'),
    ),
  ].join('\n');
}

function allowKimiMethodChoice(
  action: InstallAction,
  choices: readonly InstallTargetChoice[],
): InstallTargetChoice[] {
  return choices.map((choice) =>
    action === 'install' &&
    choice.target === 'kimi-code' &&
    choice.unavailableReason === 'already installed'
      ? {
          ...choice,
          available: true,
          unavailableReason: undefined,
          label: `${choice.label} (global hook installed)`,
        }
      : choice,
  );
}

function resolveKimiInstallMethod(
  options: RunInstallCommandOptions,
  environment: Environment,
): Promise<KimiInstallMethod | null> {
  if (options.selectKimiInstallMethod) return options.selectKimiInstallMethod();

  if (!canPromptInstallTargets(options.input, options.output)) {
    return Promise.resolve('global-hook');
  }
  return promptKimiInstallMethod({
    input: options.input,
    output: options.output,
    globalHookInstalled:
      detectKimiCodeHook({ environment, cwd: process.cwd() }).status === 'configured',
  });
}

async function runSingleInstallTarget(
  action: InstallAction,
  target: InstallTarget,
  environment: Environment,
  updating = false,
  codexPluginListOutput?: string | null,
): Promise<string> {
  return INSTALL_OPERATIONS[target][action](environment, updating, codexPluginListOutput);
}

function parseUpdateArgs(args: readonly string[]): void {
  const error = parseCommandArgs({ label: 'update' }, args).errors[0];
  if (error) throw new Error(error);
}

async function detectUpdateTargets(environment: Environment, fetchVersion = defaultVersionFetcher) {
  const state = await detectInstallHookState(environment, fetchVersion);
  const copilotPluginsDir = join(_getCopilotConfigHome(environment), 'installed-plugins');
  const targets = orderInstallTargets([
    ...state.hooks
      .filter((hook) => hook.platform !== 'copilot-cli' && hook.detected)
      .map((hook) => hook.platform as InstallTarget),
    ...(
      [COPILOT_PLUGIN_DIR, COPILOT_PRE_RENAME_PLUGIN_DIR, COPILOT_LEGACY_PLUGIN_DIR] as const
    ).flatMap((dir) =>
      existsSync(join(copilotPluginsDir, ...dir)) ? (['copilot-cli'] as const) : [],
    ),
    ...(hasClaudeInstalledPlugin(environment, CLAUDE_LEGACY_PLUGIN_ID)
      ? (['claude-code'] as const)
      : []),
    ...(hasCodexLegacyPlugin(state.codexPluginListOutput) ? (['codex'] as const) : []),
  ]);
  return { targets, codexPluginListOutput: state.codexPluginListOutput };
}

async function updateInstalledIntegrations(options: UpdateCommandOptions): Promise<number> {
  const environment = createProcessEnvironment();
  const output = options.output ?? process.stdout;

  const scriptSegments = (options.scriptPath ?? process.argv[1] ?? '').split(/[\\/]/);

  const runningBunxEntry = scriptSegments.find((segment) => /^bunx-\d+-/.test(segment));
  const latestCheck =
    runningBunxEntry !== undefined || scriptSegments.includes('_npx')
      ? null
      : (options.checkLatestVersion ?? checkForUpdates)();

  const printUpdateNudge = async () => {
    const updateInfo = latestCheck && (await latestCheck);
    if (updateInfo?.updateAvailable)
      output.write(
        `\nUpdate available: cc-safety-net ${updateInfo.currentVersion} → ${updateInfo.latestVersion}. Update this CLI with your package manager, e.g. \`npm i -g cc-safety-net@latest\` for a global install.\n`,
      );
  };

  const prepared = detectUpdateTargets(
    environment,
    options.fetchVersion ?? defaultVersionFetcher,
  ).then(async (detection) => {
    const targetSet = new Set(detection.targets);
    return {
      targets: detection.targets,
      codexPluginListOutput: detection.codexPluginListOutput,
      available: new Map(
        await Promise.all(
          INSTALL_TARGETS.filter(
            (target) => targetSet.has(target.target) && NATIVE_UPDATE_TARGETS.has(target.target),
          ).map(
            async (target) =>
              [target.target, await probeInstallTarget(target.probeCommand)] as const,
          ),
        ),
      ),
    };
  });
  const detected = await resolveAfterOptionalBanner(
    options.showBanner ?? true,
    () => ({ ready: prepared, finish: () => prepared }),
    () => printInstallBanner({ input: options.input ?? process.stdin, output }),
    { loadingMessage: 'Checking installed integrations…', output },
  );

  const bunxCacheFailure = await Promise.resolve()
    .then(() => {
      clearBunxSafetyNetCache(environment.tmpdir, process.platform, runningBunxEntry);
      return null;
    })
    .catch((error: unknown) => formatInstallError(error));

  if (detected.targets.length === 0) {
    output.write('No installed integrations found. Run `cc-safety-net install` to set one up.\n');
    if (bunxCacheFailure !== null) console.error(bunxCacheFailure);
    await printUpdateNudge();
    return bunxCacheFailure === null ? 0 : 1;
  }

  const npxCacheFailure = detected.targets.some((target) => NPX_CACHE_TARGETS.has(target))
    ? await Promise.resolve()
        .then(() => {
          clearNpxSafetyNetCache(environment);
          return null;
        })
        .catch((error: unknown) => formatInstallError(error))
    : null;

  const reports = await awaitWithSpinner(
    Promise.all(
      detected.targets.map((target) => {
        if (NATIVE_UPDATE_TARGETS.has(target) && !detected.available.get(target))
          return Promise.resolve({
            message: `${getIntegrationDisplayName(target)} not found; skipped`,
            failed: false,
          });
        if (npxCacheFailure !== null && NPX_CACHE_TARGETS.has(target))
          return Promise.resolve({ message: npxCacheFailure, failed: true });
        return runSingleInstallTarget(
          'install',
          target,
          environment,
          true,
          detected.codexPluginListOutput,
        ).then(
          (message) => ({ message, failed: false }),
          (error: unknown) => ({ message: formatInstallError(error), failed: true }),
        );
      }),
    ),
    {
      loadingMessage: `Updating ${detected.targets.length} integration${detected.targets.length === 1 ? '' : 's'}…`,
      output,
    },
  );
  const allReports =
    bunxCacheFailure === null ? reports : [...reports, { message: bunxCacheFailure, failed: true }];
  allReports.forEach((report) => {
    report.failed ? console.error(report.message) : output.write(`${report.message}\n`);
  });
  await printUpdateNudge();
  return allReports.some((report) => report.failed) ? 1 : 0;
}

export function runUpdateCommand(
  args: readonly string[],
  options: UpdateCommandOptions = {},
): Promise<number> {
  return Promise.resolve()
    .then(() => parseUpdateArgs(args))
    .then(() => updateInstalledIntegrations(options))
    .catch((error: unknown) => {
      console.error(formatInstallError(error));
      return 1;
    });
}

export async function runInstallCommand(
  action: InstallAction,
  args: readonly string[],
  options: RunInstallCommandOptions = {},
): Promise<number> {
  try {
    const environment = createProcessEnvironment();
    const targets = await resolveAfterOptionalBanner(
      true,
      () => startResolveInstallTargets(environment, action, args, options),
      () =>
        printInstallBanner({
          input: options.input ?? process.stdin,
          output: options.output ?? process.stdout,
        }),
      {
        loadingMessage:
          action === 'install'
            ? 'Checking available integrations…'
            : 'Checking installed integrations…',
        output: options.output ?? process.stdout,
      },
    );

    if (!targets) {
      (options.output ?? process.stdout).write(`Cancelled: nothing was ${action}ed.\n`);
      return 0;
    }
    if (targets === 'update') {
      return (
        options.runUpdate ??
        (() =>
          runUpdateCommand([], {
            fetchVersion: options.fetchVersion,
            input: options.input,
            output: options.output,
            showBanner: false,
          }))
      )();
    }

    const output = options.output ?? process.stdout;

    await runInstallTargetsInOrder(targets, async (target) => {
      if (target === 'kimi-code' && action === 'install') {
        const method = await resolveKimiInstallMethod(options, environment);
        if (method === null) {
          output.write('Cancelled: Kimi Code integration was not installed.\n');
          return;
        }
        if (method === 'plugin') {
          output.write(`${formatKimiPluginInstructions(environment)}\n`);
          return;
        }
      }
      const message = await awaitWithSpinner(runSingleInstallTarget(action, target, environment), {
        loadingMessage: `${action === 'install' ? 'Installing' : 'Uninstalling'} ${getIntegrationDisplayName(target)} integration…`,
        output,
      });
      output.write(`${message}\n`);
    });

    return 0;
  } catch (e) {
    console.error(formatInstallError(e));
    return 1;
  }
}

function formatInstallError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : null;

  if (code === 'EACCES' || code === 'EPERM') {
    return `${message}\nCheck file permissions for the target config file and parent directory.`;
  }
  if (code === 'ENOENT') {
    return `${message}\nCheck that the target config path and parent directory exist.`;
  }
  if (code === 'ENOTDIR') {
    return `${message}\nCheck that every parent path component is a directory.`;
  }
  return message;
}
