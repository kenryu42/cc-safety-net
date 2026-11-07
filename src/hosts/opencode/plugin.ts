import { join, resolve } from 'node:path';
import type { Plugin, PluginInput } from '@opencode-ai/plugin';
import {
  type CwdDenial,
  createCwdDenial,
  createFailedClosedDenial,
  createMalformedToolCallDenial,
  formatDenial,
  type IntegrationDenial,
  projectGuardDenial,
} from '@/core/denial';
import { createProcessEnvironment } from '@/core/environment';
import { shouldRecordAllowedCommands } from '@/core/policy/env';
import { isDeclaredWithoutCwdArgument } from '@/core/policy/scope-policy';
import {
  getCommandFromToolInput,
  getNonCommandToolInputKind,
  ToolInputLimitError,
} from '@/core/tool-input';
import { isUsableDirectory } from '@/gate/intake';
import {
  type CommandToolKind,
  createToolInvocation,
  type ToolCallContext,
  type ToolRoute,
} from '@/gate/invocation';
import {
  type GuardDependencies,
  type GuardEvaluation,
  GuardEvaluationError,
} from '@/gate/pipeline';
import { writeIntegrationDenialAudit } from '@/hosts/audit';
import { loadBuiltinCommands } from '@/hosts/opencode/builtin-commands/commands';
import { evaluateRuntimeGuard } from '@/hosts/runtime';

type CCSafetyNetPluginInput = PluginInput & {
  homeDir?: string;
};

const POWERSHELL_EXECUTABLES = new Set(['powershell', 'pwsh']);

const OPENCODE_REFUSED_SHELLS = new Set(['fish', 'nu']);

export const OPENCODE_COMMAND_TOOL = 'bash';

export const OPENCODE_V2_COMMAND_TOOL = 'shell';

export function createCCSafetyNetPlugin(guardDependencies: Partial<GuardDependencies> = {}) {
  return (async ({ directory, homeDir }: CCSafetyNetPluginInput) => {
    const configCwd = resolve(directory);
    let currentConfig: Record<string, unknown> | undefined;

    return {
      config: async (opencodeConfig: Record<string, unknown>) => {
        currentConfig = opencodeConfig;
        const builtinCommands = loadBuiltinCommands();
        const existingCommands = (opencodeConfig.command as Record<string, unknown>) ?? {};

        opencodeConfig.command = {
          ...builtinCommands,
          ...existingCommands,
        };
      },

      'tool.execute.before': async (input, output) => {
        evaluateOpenCodeTool({
          configCwd,
          homeDir,
          tool: input.tool,
          sessionID: input.sessionID,
          toolInput: output.args,
          route: getOpenCodeToolRoute(input.tool, resolveOpenCodeShellRoute(currentConfig?.shell)),
          guardDependencies,
        });
      },
    };
  }) satisfies Plugin;
}

export function evaluateOpenCodeTool({
  configCwd,
  homeDir,
  expandHomeWorkdir = false,
  tool,
  sessionID,
  toolInput,
  route,
  guardDependencies = {},
}: {
  configCwd: string;
  homeDir?: string;
  expandHomeWorkdir?: boolean;
  tool: string;
  sessionID: string;
  toolInput: unknown;
  route: ToolRoute;
  guardDependencies?: Partial<GuardDependencies>;
}): void {
  const environment =
    homeDir === undefined
      ? createProcessEnvironment()
      : { ...createProcessEnvironment(), home: homeDir };
  const throwPreflightDenial = (
    denial: IntegrationDenial,
    toolName?: string,
    cwd: string | null = configCwd,
  ): never => {
    writeIntegrationDenialAudit(environment, denial, () => sessionID, {
      agent: 'opencode',
      toolName,
      cwd,
    });
    throwBlocked(denial);
  };
  if (typeof tool !== 'string' || tool.trim() === '') {
    throwPreflightDenial(createMalformedToolCallDenial());
  }

  let command: string | undefined;
  try {
    command = getCommandFromToolInput(toolInput);
  } catch (error) {
    if (!(error instanceof ToolInputLimitError)) throw error;
    throwPreflightDenial(createFailedClosedDenial({ toolName: tool }), tool);
  }
  if (!isUsableDirectory(configCwd)) {
    throwPreflightDenial(
      createCwdDenial(
        { directory: 'session', problem: 'unusable', cwd: configCwd },
        { command, toolName: tool },
      ),
      tool,
    );
    return;
  }
  const executionCwd = resolveOpenCodeExecutionCwd(
    configCwd,
    toolInput,
    expandHomeWorkdir ? environment.home : undefined,
    () => route.kind === 'unknown' && isDeclaredWithoutCwdArgument(environment, configCwd, tool),
  );
  if (executionCwd === null) {
    throwPreflightDenial(createMalformedToolCallDenial({ command, toolName: tool }), tool);
    return;
  }
  if (typeof executionCwd !== 'string') {
    throwPreflightDenial(
      createCwdDenial(executionCwd, { command, toolName: tool }),
      tool,
      executionCwd.cwd,
    );
    return;
  }
  const context: ToolCallContext = { configCwd, executionCwd };
  const invocation = createToolInvocation(tool, toolInput, route, context, command ?? null);
  try {
    const evaluation = evaluateRuntimeGuard(environment, invocation, {
      guard: {
        auditAllowed: shouldRecordAllowedCommands(environment.env),
        dependencies: guardDependencies,
      },
      audit: {
        agent: 'opencode',
        getSessionId: () => sessionID,
      },
    });
    throwGuardDenial(evaluation);
  } catch (error) {
    if (!(error instanceof GuardEvaluationError)) throw error;
    if (
      error.stage === 'policy-protection' ||
      error.stage === 'config-load' ||
      error.stage === 'secret-protection'
    ) {
      throw error.cause;
    }
    throwGuardDenial(error.evaluation);
    return;
  }
}

export function resolveOpenCodeShellRoute(
  configuredShell: unknown,
  platform = process.platform,
  environmentShell = process.env.SHELL,
): CommandToolKind {
  const candidate = typeof configuredShell === 'string' ? configuredShell : environmentShell;
  const executable = candidate
    ?.trim()
    .split(/[\\/]/)
    .at(-1)
    ?.toLowerCase()
    .replace(/\.exe$/, '');
  const hostFallsBackToPowerShell =
    typeof configuredShell !== 'string' &&
    platform === 'win32' &&
    (!executable || OPENCODE_REFUSED_SHELLS.has(executable));
  if (hostFallsBackToPowerShell) return 'powershell';
  if (!executable) return 'auto';
  if (POWERSHELL_EXECUTABLES.has(executable)) return 'powershell';
  return executable === 'cmd' ? 'auto' : 'posix';
}

function getOpenCodeToolRoute(toolName: string, shell: CommandToolKind): ToolRoute {
  if (toolName === OPENCODE_COMMAND_TOOL) return { kind: 'command', shell };
  return { kind: getNonCommandToolInputKind(toolName) };
}

function resolveOpenCodeExecutionCwd(
  configCwd: string,
  toolInput: unknown,
  workdirHome: string | undefined,
  ignoresWorkdir: () => boolean,
): string | CwdDenial | null {
  if (!toolInput || typeof toolInput !== 'object' || Array.isArray(toolInput)) return configCwd;
  if (!Object.hasOwn(toolInput, 'workdir') || ignoresWorkdir()) return configCwd;

  const workdir = (toolInput as Record<string, unknown>).workdir;
  if (typeof workdir !== 'string' || workdir.trim() === '') return null;
  const normalizedWorkdir =
    process.platform === 'win32' ? normalizeOpenCodeWindowsWorkdir(workdir) : workdir;
  const isHomeRelative =
    normalizedWorkdir.startsWith('~/') ||
    (process.platform === 'win32' && normalizedWorkdir.startsWith('~\\'));
  const hostWorkdir =
    workdirHome === undefined
      ? normalizedWorkdir
      : normalizedWorkdir === '~'
        ? workdirHome
        : isHomeRelative
          ? join(workdirHome, normalizedWorkdir.slice(2))
          : normalizedWorkdir;

  const executionCwd = resolve(configCwd, hostWorkdir);
  return isUsableDirectory(executionCwd)
    ? executionCwd
    : { directory: 'requested', problem: 'unusable', cwd: workdir };
}

/** @internal */
export function normalizeOpenCodeWindowsWorkdir(workdir: string): string {
  const normalized = workdir
    .replace(/^\/([a-zA-Z]):(?:[\\/]|$)/, (_, drive: string) => `${drive.toUpperCase()}:/`)
    .replace(/^\/([a-zA-Z])(?:[\\/]|$)/, (_, drive: string) => `${drive.toUpperCase()}:/`)
    .replace(/^\/cygdrive\/([a-zA-Z])(?:[\\/]|$)/, (_, drive: string) => `${drive.toUpperCase()}:/`)
    .replace(/^\/mnt\/([a-zA-Z])(?:[\\/]|$)/, (_, drive: string) => `${drive.toUpperCase()}:/`);

  return normalized;
}

function throwGuardDenial(evaluation: GuardEvaluation): void {
  const denial = projectGuardDenial(evaluation, { includeEvidence: true });
  if (denial) throwBlocked(denial);
}

function throwBlocked(denial: IntegrationDenial): never {
  throw new Error(formatDenial(denial));
}
