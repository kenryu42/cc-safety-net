import type { ShellCommand, ToolCall, URI } from '@ampcode/plugin';
import { writeIntegrationDenialAudit } from '@/integrations/audit';
import { resolveCanonicalCwd, resolveContainedCwd } from '@/integrations/cwd-containment';
import {
  createFailedClosedDenial,
  formatDenial,
  formatIntegrationError,
  type IntegrationDenial,
  projectGuardDenial,
} from '@/integrations/denial';
import * as guardEngine from '@/integrations/runtime';
import * as invocationDomain from '@/ir/invocation';
import * as toolRouting from '@/parser/tool-input';
import { ENV_FLAGS, envTruthy, shouldRecordAllowedCommands } from '@/policy/env';

type AmpApi = {
  system: { workspaceRoot: URI | null };
  helpers: {
    filePathFromURI: (uri: URI) => string;
    shellCommandFromToolCall: (event: ToolCall) => ShellCommand | null;
  };
};

type AmpToolCallEvent = {
  tool?: unknown;
  input?: unknown;
  thread?: { id?: unknown };
};

type AmpToolCallResult = { action: 'allow' } | { action: 'reject-and-continue'; message: string };

type MalformedAmpToolCall = {
  malformed: true;
  denial: IntegrationDenial;
  cwd: string | null;
};

type AmpHandlerOptions = {
  guardDependencies?: Partial<guardEngine.GuardDependencies>;
};

export const handleAmpToolCall = createAmpToolCallHandler();

/** @internal */
export function createAmpToolCallHandler(
  options: AmpHandlerOptions = {},
): (event: unknown, amp: AmpApi) => AmpToolCallResult {
  return (event, amp) => handleAmpToolCallWithDependencies(event, amp, options);
}

function handleAmpToolCallWithDependencies(
  event: unknown,
  amp: AmpApi,
  options: AmpHandlerOptions,
): AmpToolCallResult {
  const toolCall = getAmpToolInvocation(event, amp);
  const getSessionId = () => ampThreadId(event);

  if ('malformed' in toolCall) {
    writeIntegrationDenialAudit(toolCall.denial, getSessionId, {
      agent: 'amp',
      toolName: toolCall.denial.toolName,
      cwd: toolCall.cwd,
    });
    return rejectAmpToolCall(toolCall.denial);
  }

  try {
    const evaluation = guardEngine.evaluateRuntimeGuard(toolCall, {
      guard: {
        auditAllowed: shouldRecordAllowedCommands(),
        dependencies: options.guardDependencies,
      },
      audit: {
        agent: 'amp',
        getSessionId,
      },
    });
    return projectAmpEvaluation(evaluation, true);
  } catch (error) {
    if (!(error instanceof guardEngine.GuardEvaluationError)) throw error;
    if (envTruthy(ENV_FLAGS.debug)) {
      console.error(
        `CC Safety Net debug: amp tool.call analysis failed: ${formatIntegrationError(error.cause)}`,
      );
    }
    return projectAmpEvaluation(error.evaluation, toolCall.route.kind === 'command');
  }
}

function getAmpToolInvocation(
  event: unknown,
  amp: AmpApi,
): MalformedAmpToolCall | invocationDomain.ToolInvocation {
  if (!event || typeof event !== 'object') return malformedAmpToolCall(null);
  const toolCall = event as AmpToolCallEvent;
  if (typeof toolCall.tool !== 'string' || toolCall.tool.trim() === '') {
    return malformedAmpToolCall(null);
  }
  if (!toolCall.input || typeof toolCall.input !== 'object') {
    return malformedAmpToolCall(null, toolCall.tool);
  }

  const workspaceRoot = resolveAmpWorkspaceRoot(amp);
  if (!workspaceRoot) return malformedAmpToolCall(null, toolCall.tool);

  const shell = extractAmpShellCommand(amp, event);
  if (!shell.ok) return malformedAmpToolCall(workspaceRoot, toolCall.tool);

  if (!shell.command) {
    return invocationDomain.createToolInvocation(
      toolCall.tool,
      toolCall.input,
      { kind: toolRouting.getNonCommandToolInputKind(toolCall.tool) },
      { configCwd: workspaceRoot, executionCwd: workspaceRoot },
      null,
    );
  }

  if (typeof shell.command.command !== 'string' || shell.command.command.trim() === '') {
    return malformedAmpToolCall(workspaceRoot, toolCall.tool);
  }

  const executionCwd =
    typeof shell.command.dir === 'string'
      ? resolveCanonicalCwd(shell.command.dir, workspaceRoot)
      : workspaceRoot;
  if (!executionCwd) {
    return malformedAmpToolCall(
      workspaceRoot,
      toolCall.tool,
      shell.command.command,
      shell.command.dir,
    );
  }

  return invocationDomain.createToolInvocation(
    toolCall.tool,
    toolCall.input,
    { kind: 'command', shell: 'posix' },
    { configCwd: workspaceRoot, executionCwd },
    shell.command.command,
  );
}

function resolveAmpWorkspaceRoot(amp: AmpApi): string | undefined {
  const workspaceRoot = amp.system.workspaceRoot;
  if (!workspaceRoot) return undefined;
  try {
    const rootPath = amp.helpers.filePathFromURI(workspaceRoot);
    if (typeof rootPath !== 'string' || rootPath.trim() === '') return undefined;
    return resolveContainedCwd('.', [rootPath]);
  } catch {
    return undefined;
  }
}

function extractAmpShellCommand(
  amp: AmpApi,
  event: unknown,
): { ok: true; command: ShellCommand | null } | { ok: false } {
  try {
    return { ok: true, command: amp.helpers.shellCommandFromToolCall(event as ToolCall) };
  } catch {
    return { ok: false };
  }
}

function ampThreadId(event: unknown): string | undefined {
  if (!event || typeof event !== 'object') return undefined;
  const id = (event as AmpToolCallEvent).thread?.id;
  return typeof id === 'string' && id.trim() !== '' ? id : undefined;
}

function malformedAmpToolCall(
  cwd: string | null,
  toolName?: string,
  command?: string,
  segment?: string,
): MalformedAmpToolCall {
  return {
    malformed: true,
    denial: createFailedClosedDenial({ command, segment, toolName }),
    cwd,
  };
}

function projectAmpEvaluation(
  evaluation: Parameters<typeof projectGuardDenial>[0],
  includeEvidence: boolean,
): AmpToolCallResult {
  const denial = projectGuardDenial(evaluation, { includeEvidence });
  return denial ? rejectAmpToolCall(denial) : { action: 'allow' };
}

function rejectAmpToolCall(denial: IntegrationDenial): AmpToolCallResult {
  return { action: 'reject-and-continue', message: formatDenial(denial) };
}
