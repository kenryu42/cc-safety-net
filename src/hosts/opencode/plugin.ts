import { join, resolve } from 'node:path';
import type { Plugin, PluginInput } from '@opencode-ai/plugin';
import {
  type CwdDenial,
  createCwdDenial,
  createFailedClosedDenial,
  formatDenial,
  type IntegrationDenial,
  projectGuardDenial,
} from '@/core/denial';
import { createProcessEnvironment } from '@/core/environment';
import { shouldRecordAllowedCommands } from '@/core/policy/env';
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
const POSIX_EXECUTABLES = new Set([
  'ash',
  'bash',
  'dash',
  'ksh',
  'mksh',
  'oksh',
  'pdksh',
  'posh',
  'sh',
  'yash',
  'zsh',
]);

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
    throwPreflightDenial(createFailedClosedDenial());
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
  );
  if (executionCwd === null) {
    throwPreflightDenial(createFailedClosedDenial({ command, toolName: tool }), tool);
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
  if (typeof configuredShell !== 'string' && platform === 'win32') return 'powershell';
  const candidate = typeof configuredShell === 'string' ? configuredShell : environmentShell;
  if (typeof candidate !== 'string') return 'auto';
  const executable = candidate
    .trim()
    .split(/[\\/]/)
    .at(-1)
    ?.toLowerCase()
    .replace(/\.exe$/, '');
  if (!executable) return 'auto';
  if (POWERSHELL_EXECUTABLES.has(executable)) return 'powershell';
  if (POSIX_EXECUTABLES.has(executable)) return 'posix';
  return 'auto';
}

function getOpenCodeToolRoute(toolName: string, shell: CommandToolKind): ToolRoute {
  if (toolName === 'bash') return { kind: 'command', shell };
  return { kind: getNonCommandToolInputKind(toolName) };
}

function resolveOpenCodeExecutionCwd(
  configCwd: string,
  toolInput: unknown,
  workdirHome: string | undefined,
): string | CwdDenial | null {
  if (!toolInput || typeof toolInput !== 'object' || Array.isArray(toolInput)) return configCwd;
  if (!Object.hasOwn(toolInput, 'workdir')) return configCwd;

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
