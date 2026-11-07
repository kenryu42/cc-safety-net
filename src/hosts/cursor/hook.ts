import type { IntegrationDenial } from '@/core/denial';
import type { Environment } from '@/core/environment';
import { normalizeUriDrivePath } from '@/core/paths/canonicalization';
import { isDeclaredWithoutCwdArgument } from '@/core/policy/scope-policy';
import {
  cwdProblem,
  firstTrustedRoot,
  getToolRoute,
  outputCwdDenial,
  outputFailedClosed,
  outputMalformedToolCall,
  resolveContainedCwd,
} from '@/gate/intake';
import type { CommandToolKind, ToolCallContext } from '@/gate/invocation';
import { runConfiguredHookAdapter } from '@/hosts/hook/common';

interface CursorHookInput {
  conversation_id?: string;
  hook_event_name?: string;
  tool_name?: string;
  tool_input?: {
    command?: string;
    working_directory?: string;
    [key: string]: unknown;
  };
  cwd?: string;
  workspace_roots?: string[];
}

type CursorHookOutput =
  | { permission: 'allow' }
  | { permission: 'deny'; user_message: string; agent_message: string };

export const CURSOR_COMMAND_TOOLS = new Map<string, CommandToolKind>([['Shell', 'auto']]);

function getCursorToolRoute(toolName: string) {
  return getToolRoute(toolName, CURSOR_COMMAND_TOOLS);
}

type CursorDenyOutput = (denial: IntegrationDenial) => void;

export async function runCursorHook(): Promise<void> {
  await runConfiguredHookAdapter<CursorHookInput>({
    agent: 'cursor',
    createDenyOutput: (message): CursorHookOutput => ({
      permission: 'deny',
      user_message: message,
      agent_message: message,
    }),
    createAllowOutput: (): CursorHookOutput => ({ permission: 'allow' }),
    isSupported: () => true,
    getToolName: (input) => input.tool_name,
    getToolInput: (input, toolName) => ({
      ok: true,
      input: input.tool_input,
      route: getCursorToolRoute(toolName),
    }),
    getContext: resolveCursorContext,
    getSessionId: (input) => input.conversation_id,
  });
}

function resolveCursorContext(
  input: CursorHookInput,
  toolInput: unknown,
  toolName: string,
  outputDeny: CursorDenyOutput,
  environment: Environment,
): ToolCallContext | null {
  const requestedRoots = requestedCursorRoots(input);
  if (!requestedRoots[0]) {
    outputFailedClosed(outputDeny, toolInput, toolName);
    return null;
  }
  const roots = requestedRoots.flatMap((root) => {
    const canonicalRoot = firstTrustedRoot([root], environment.paths);
    return canonicalRoot ? [canonicalRoot] : [];
  });
  if (!roots[0]) {
    outputCwdDenial(outputDeny, toolInput, toolName, {
      directory: 'session',
      problem: 'unusable',
      cwd: requestedRoots[0],
    });
    return null;
  }

  const baseCwd = cursorBaseCwd(input.cwd);
  const base = resolveContainedCwd(baseCwd, roots, environment.paths);
  if (!base) {
    outputCwdDenial(outputDeny, toolInput, toolName, {
      directory: 'session',
      problem: cwdProblem(baseCwd, roots[0], environment.paths),
      cwd: baseCwd,
    });
    return null;
  }

  if (toolInput === null || typeof toolInput !== 'object' || Array.isArray(toolInput)) {
    return { configCwd: base, executionCwd: base };
  }
  if (
    !Object.hasOwn(toolInput, 'working_directory') ||
    (getCursorToolRoute(toolName).kind === 'unknown' &&
      isDeclaredWithoutCwdArgument(environment, base, toolName))
  ) {
    return { configCwd: base, executionCwd: base };
  }

  const requestedWorkingDirectory = (toolInput as Record<string, unknown>).working_directory;
  if (typeof requestedWorkingDirectory !== 'string' || requestedWorkingDirectory.trim() === '') {
    outputMalformedToolCall(outputDeny, toolInput, toolName);
    return null;
  }
  const workingDirectory = normalizeUriDrivePath(requestedWorkingDirectory);
  const executionCwd = resolveContainedCwd(workingDirectory, roots, environment.paths);
  if (!executionCwd) {
    outputCwdDenial(outputDeny, toolInput, toolName, {
      directory: 'requested',
      problem: cwdProblem(workingDirectory, roots[0], environment.paths),
      cwd: workingDirectory,
    });
    return null;
  }
  return { configCwd: base, executionCwd };
}

function requestedCursorRoots(input: CursorHookInput): string[] {
  if (input.workspace_roots === undefined) {
    return typeof input.cwd === 'string' && input.cwd.trim() !== ''
      ? [normalizeUriDrivePath(input.cwd)]
      : [];
  }
  if (!Array.isArray(input.workspace_roots)) return [];
  return input.workspace_roots
    .filter((root) => typeof root === 'string' && root.trim() !== '')
    .map((root) => normalizeUriDrivePath(root));
}

function cursorBaseCwd(cwd: unknown): string {
  return typeof cwd === 'string' && cwd.trim() !== '' ? normalizeUriDrivePath(cwd) : '.';
}
