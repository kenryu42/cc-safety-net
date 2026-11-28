import {
  createFailedClosedDenial,
  formatAskPrompt,
  formatDenial,
  formatIntegrationError,
  type IntegrationDenial,
  projectGuardDenial,
} from '@/core/denial';
import { createProcessEnvironment, type Environment } from '@/core/environment';
import { ENV_FLAGS, envTruthy, shouldRecordAllowedCommands } from '@/core/policy/env';
import { getCommandFromToolInput, ToolInputLimitError } from '@/core/tool-input';
import {
  cwdProblem,
  outputCwdDenial,
  outputFailedClosed,
  outputMalformedToolCall,
  parseHookJson,
  readBoundedHookInput,
  resolveCanonicalCwd,
  resolveContainedCwd,
  resolveStandardHookContext,
} from '@/gate/intake';
import type { CommandToolKind, ToolCallContext, ToolRoute } from '@/gate/invocation';
import { createToolInvocation } from '@/gate/invocation';
import { type GuardDependencies, GuardEvaluationError, type GuardStage } from '@/gate/pipeline';
import { writeIntegrationDenialAudit } from '@/hosts/audit';
import { evaluateRuntimeGuard } from '@/hosts/runtime';

type HookDenyOutput = (denial: IntegrationDenial) => void;

type HookAdapter<T> = {
  agent: string;
  getAgent?: (input: T, environment: Environment) => string;
  outputDeny: HookDenyOutput;
  canPromptPerson?: (input: T) => boolean;
  outputAsk?: (denial: IntegrationDenial) => void;
  outputAllow?: () => void;
  guardDependencies?: Partial<GuardDependencies>;
  isSupported: (input: T) => boolean;
  handOff?: (input: object) => Promise<void> | undefined;
  getToolName: (input: T) => unknown;
  getToolInput: (
    input: T,
    toolName: string,
    outputDeny: HookDenyOutput,
    environment: Environment,
  ) => ToolInputResult;
  getContext: (
    input: T,
    toolInput: unknown,
    toolName: string,
    outputDeny: HookDenyOutput,
    environment: Environment,
  ) => ToolCallContext | null;
  getSessionId: (input: T) => string | undefined;
};

type ConfiguredHookAdapter<T> = Omit<HookAdapter<T>, 'outputDeny' | 'outputAsk' | 'outputAllow'> & {
  createDenyOutput: (message: string) => object;
  createAskOutput?: (message: string) => object;
  createAllowOutput?: () => object;
  denyExitCode?: number;
};

type ToolInputResult = { ok: true; input: unknown; route: ToolRoute } | { ok: false };

export const getStandardHookContext: HookAdapter<{ cwd?: string }>['getContext'] = (
  input,
  toolInput,
  toolName,
  outputDeny,
  environment,
) =>
  resolveStandardHookContext(
    input.cwd,
    toolInput,
    toolName,
    outputDeny,
    environment.paths,
    process.cwd(),
  );

export const getToolCwdHookContext =
  (
    cwdKey: string,
    commandTools: ReadonlyMap<string, CommandToolKind>,
    options?: { emptyMeansSessionCwd: boolean; allowOutsideSessionCwd: boolean },
  ): HookAdapter<{ cwd?: string; tool_input?: Record<string, unknown> }>['getContext'] =>
  (input, toolInput, toolName, outputDeny, environment) => {
    const context = getStandardHookContext(input, toolInput, toolName, outputDeny, environment);
    if (!context) return null;
    const args = input.tool_input;
    if (!commandTools.has(toolName) || !args || !Object.hasOwn(args, cwdKey)) return context;
    const requestedCwd = args[cwdKey];
    if (options?.emptyMeansSessionCwd && requestedCwd === '') return context;
    if (typeof requestedCwd !== 'string' || requestedCwd.trim() === '') {
      outputMalformedToolCall(outputDeny, toolInput, toolName);
      return null;
    }
    const executionCwd = options?.allowOutsideSessionCwd
      ? resolveCanonicalCwd(requestedCwd, context.configCwd, environment.paths)
      : resolveContainedCwd(requestedCwd, [context.configCwd], environment.paths);
    if (executionCwd) return { configCwd: context.configCwd, executionCwd };
    outputCwdDenial(outputDeny, toolInput, toolName, {
      directory: 'requested',
      problem: cwdProblem(requestedCwd, context.configCwd, environment.paths),
      cwd: requestedCwd,
    });
    return null;
  };

function outputHookDeny<T>(adapter: ConfiguredHookAdapter<T>, denial: IntegrationDenial): void {
  const message = formatDenial(denial);
  console.log(JSON.stringify(adapter.createDenyOutput(message)));
  if (adapter.denyExitCode === undefined) return;
  console.error(message);
  process.exitCode = adapter.denyExitCode;
}

async function readHookInput<T>(outputDeny: HookDenyOutput): Promise<T | undefined> {
  let inputText: string;
  try {
    inputText = (await readBoundedHookInput(process.stdin)).trim();
  } catch {
    outputDeny({ reason: 'Failed to parse hook input JSON.' });
    return undefined;
  }

  if (!inputText) {
    outputDeny({ reason: 'Missing hook input JSON.' });
    return undefined;
  }

  return parseHookJson<T>(inputText, outputDeny, 'Failed to parse hook input JSON.');
}

async function runHookAdapter<T>(adapter: HookAdapter<T>, parsedInput?: T): Promise<void> {
  const environment = createProcessEnvironment();
  const input = parsedInput ?? (await readHookInput<T>(adapter.outputDeny));
  if (input === undefined) {
    return;
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    outputFailedClosed(adapter.outputDeny);
    return;
  }

  const handedOff = adapter.handOff?.(input);
  if (handedOff) return handedOff;

  if (!adapter.isSupported(input)) {
    return;
  }

  const agent = adapter.getAgent?.(input, environment) ?? adapter.agent;
  const shape = adapter.agent === agent ? undefined : adapter.agent;
  const auditCwd = getHookAuditCwd(input);

  const outputPreflightDeny = (denial: IntegrationDenial, toolName?: string): void => {
    writeIntegrationDenialAudit(environment, denial, () => adapter.getSessionId(input), {
      agent,
      shape,
      toolName,
      cwd: denial.cwd ?? auditCwd,
    });
    adapter.outputDeny(denial);
  };

  const toolNameInput = adapter.getToolName(input);
  if (typeof toolNameInput !== 'string' || toolNameInput.trim() === '') {
    outputMalformedToolCall((denial) => outputPreflightDeny(denial), getRawHookToolInput(input));
    return;
  }
  const toolName = toolNameInput;
  const outputToolPreflightDeny = (denial: IntegrationDenial): void =>
    outputPreflightDeny(denial, toolName);

  let toolInputResult: ToolInputResult;
  try {
    toolInputResult = adapter.getToolInput(input, toolName, outputToolPreflightDeny, environment);
  } catch (error) {
    if (!(error instanceof ToolInputLimitError)) throw error;
    outputFailedClosed(outputToolPreflightDeny, undefined, toolName);
    return;
  }
  if (!toolInputResult.ok) return;

  const context = adapter.getContext(
    input,
    toolInputResult.input,
    toolName,
    outputToolPreflightDeny,
    environment,
  );
  if (!context) return;

  let command: string | undefined;
  try {
    command = getCommandFromToolInput(toolInputResult.input);
  } catch (error) {
    if (!(error instanceof ToolInputLimitError)) throw error;
    outputFailedClosed(outputToolPreflightDeny, undefined, toolName);
    return;
  }
  const invocation = createToolInvocation(
    toolName,
    toolInputResult.input,
    toolInputResult.route,
    context,
    command ?? null,
  );
  try {
    const evaluation = evaluateRuntimeGuard(environment, invocation, {
      guard: {
        auditAllowed: shouldRecordAllowedCommands(environment.env),
        dependencies: adapter.guardDependencies,
      },
      audit: { agent, shape, getSessionId: () => adapter.getSessionId(input) },
    });
    const denial = projectGuardDenial(evaluation, {
      includeEvidence: true,
      toolName: evaluation.stage === 'command-analysis' ? undefined : toolName,
    });
    if (denial) {
      if (
        denial.unverifiedByStandardMode &&
        adapter.outputAsk &&
        adapter.canPromptPerson?.(input)
      ) {
        adapter.outputAsk(denial);
        return;
      }
      adapter.outputDeny(denial);
      return;
    }
    adapter.outputAllow?.();
  } catch (error) {
    if (!(error instanceof GuardEvaluationError)) {
      throw error;
    }
    logHookGuardError(error, environment.env);
    const denial = projectGuardDenial(error.evaluation, {
      includeEvidence: true,
      toolName: error.evaluation.stage === 'command-analysis' ? undefined : toolName,
    });
    if (denial) adapter.outputDeny(denial);
    return;
  }
}

function logHookGuardError(error: GuardEvaluationError, env: ReadonlyMap<string, string>): void {
  if (!envTruthy(ENV_FLAGS.debug, env)) return;
  console.error(
    `CC Safety Net debug: ${getHookGuardErrorLabel(error.stage)}: ${formatIntegrationError(error.cause)}`,
  );
}

function getHookGuardErrorLabel(stage: GuardStage): string {
  if (stage === 'policy-protection') return 'hook policy protection failed';
  if (stage === 'config-load') return 'hook config loading failed';
  if (stage === 'secret-protection') return 'hook secret protection failed';
  return 'hook analysis failed';
}

function getRawHookToolInput(input: unknown): unknown {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return undefined;
  if (Object.hasOwn(input, 'tool_input')) return (input as Record<string, unknown>).tool_input;
  const toolCall = (input as Record<string, unknown>).toolCall;
  if (toolCall && typeof toolCall === 'object' && !Array.isArray(toolCall)) {
    return (toolCall as Record<string, unknown>).args;
  }
  return undefined;
}

function getHookAuditCwd(input: unknown): string | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const cwd = (input as Record<string, unknown>).cwd;
  if (typeof cwd === 'string') return cwd;
  const toolCall = (input as Record<string, unknown>).toolCall;
  if (!toolCall || typeof toolCall !== 'object' || Array.isArray(toolCall)) return null;
  const args = (toolCall as Record<string, unknown>).args;
  if (!args || typeof args !== 'object' || Array.isArray(args)) return null;
  const commandCwd = (args as Record<string, unknown>).Cwd;
  return typeof commandCwd === 'string' ? commandCwd : null;
}

export async function runConfiguredHookAdapter<T>(
  adapter: ConfiguredHookAdapter<T>,
  parsedInput?: T,
): Promise<void> {
  const outputDeny: HookDenyOutput = (denial) => outputHookDeny(adapter, denial);
  const createAskOutput = adapter.createAskOutput;
  const outputAsk = createAskOutput
    ? (denial: IntegrationDenial) =>
        console.log(JSON.stringify(createAskOutput(formatAskPrompt(denial))))
    : undefined;
  const createAllowOutput = adapter.createAllowOutput;
  const outputAllow = createAllowOutput
    ? () => console.log(JSON.stringify(createAllowOutput()))
    : undefined;

  try {
    await runHookAdapter<T>({ ...adapter, outputDeny, outputAsk, outputAllow }, parsedInput);
  } catch (error) {
    console.error('CC Safety Net error:', error);
    outputDeny(createFailedClosedDenial());
  }
}
