import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { formatDenial } from '@/core/denial';
import { createProcessEnvironment, type PathResolver } from '@/core/environment';
import { loadPolicySnapshot } from '@/core/policy/snapshot';
import { getNonCommandToolInputKind } from '@/core/tool-input';
import { firstTrustedRoot } from '@/gate/intake';
import { getDeepSeekHarnessProfilesDir } from '@/hosts/deepseek-harness/detect';
import { type CommandToolKind, createToolInvocation, type ToolInvocation } from '@/gate/invocation';
import {
  createPluginToolCallHandler,
  failedClosedToolCall,
  type MalformedToolCall,
  malformedToolCall,
  type PluginHandlerOptions,
  type PluginToolCallHost,
  refusedCwdToolCall,
} from '@/hosts/hook/plugin-adapter';

type DeepSeekHarnessToolExecution = {
  name: unknown;
  arguments: unknown;
  agent?: { session: { header: { id: string; cwd: string } } };
};

type DeepSeekHarnessToolGuard = (execution: unknown) => string | undefined;

type DeepSeekHarnessPostToolDecision = {
  kind: 'accept' | 'block';
  additionalContexts?: unknown[];
};

type DeepSeekHarnessPostExecuteListener = (
  execution: unknown,
  result: unknown,
  next: () => Promise<DeepSeekHarnessPostToolDecision>,
) => Promise<DeepSeekHarnessPostToolDecision>;

type DeepSeekHarnessContext = {
  tools: { guard: (guard: DeepSeekHarnessToolGuard) => () => void };
  on: (event: 'tools/post-execute', listener: DeepSeekHarnessPostExecuteListener) => () => void;
};

export const DEEPSEEK_HARNESS_COMMAND_TOOLS = new Map<string, CommandToolKind>([
  ['bash', 'posix'],
  ['pwsh', 'powershell'],
]);

const DEEPSEEK_HARNESS_HOST: PluginToolCallHost<unknown, string, string | undefined> = {
  agent: 'deepseek-harness',
  debugLabel: 'deepseek-harness tool guard',
  extract: (execution, launchCwd, paths) => getDeepSeekHarnessToolCall(execution, launchCwd, paths),
  getSessionId: (execution) =>
    (execution as DeepSeekHarnessToolExecution | null)?.agent?.session.header.id,
  allow: undefined,
  block: (denial) => formatDenial(denial),
  includeEvidenceOnError: (toolCall) => toolCall.route.kind === 'command',
};

export function registerDeepSeekHarnessGuard(ctx: DeepSeekHarnessContext): void {
  const handle = createDeepSeekHarnessGuardHandler();
  ctx.tools.guard((execution) => handle(execution, process.cwd()));
  const noticed = new Set<string>();
  ctx.on('tools/post-execute', async (execution, _result, next) => {
    const decision = await next();
    const notice = noticeUndeclaredCommandTool(execution, noticed);
    if (!notice) return decision;
    return { ...decision, additionalContexts: [notice, ...(decision.additionalContexts ?? [])] };
  });
}

function noticeUndeclaredCommandTool(execution: unknown, noticed: Set<string>) {
  try {
    const toolCall = execution as DeepSeekHarnessToolExecution | null;
    const header = toolCall?.agent?.session.header;
    const toolName = toolCall?.name;
    const input = toolCall?.arguments;
    const command = (input as { command?: unknown } | null | undefined)?.command;
    if (
      !header ||
      typeof toolName !== 'string' ||
      DEEPSEEK_HARNESS_COMMAND_TOOLS.has(toolName) ||
      getNonCommandToolInputKind(toolName) !== 'unknown' ||
      typeof command !== 'string' ||
      command.trim() === ''
    ) {
      return undefined;
    }
    const key = JSON.stringify([header.id, toolName]);
    if (noticed.has(key)) return undefined;
    const environment = createProcessEnvironment();
    const declared = loadPolicySnapshot(environment, {
      cwd: header.cwd ?? process.cwd(),
    }).policy.commandTools.some((tool) => tool.name === toolName);
    if (declared) return undefined;
    noticed.add(key);
    const profilesDir = getDeepSeekHarnessProfilesDir(environment);
    return Object.freeze({
      id: randomUUID(),
      role: 'user',
      content: Object.freeze([
        Object.freeze({
          type: 'text',
          text: `CC Safety Net did not check the command \`${toolName}\` just ran. It checks a plugin's shell tool only after the tool is declared. First find out where \`${toolName}\` runs its commands: check its tool description, and if that doesn't say, read its plugin's source under \`${profilesDir}/<profile>/node_modules\`. If it runs them on this machine, declare it with \`npx -y cc-safety-net rule tool add ${toolName}\`, and add \`--cwd-arg <name>\` if it takes its working directory in an argument other than \`workdir\`, \`cwd\` or \`working_directory\`. If it runs them somewhere else, such as a remote host, or you can't tell, declare it with \`npx -y cc-safety-net rule tool add ${toolName} --no-cwd-arg\`: its commands are then checked as if they ran in this session's directory. Don't test the declaration by running a destructive command; \`npx -y cc-safety-net rule tool list\` confirms it. Either way, tell the user what you found and what you did.`,
        }),
      ]),
      source: Object.freeze({
        kind: 'cc-safety-net',
        form: 'notice',
        summary: `${toolName} commands are not checked`,
      }),
    });
  } catch {
    return undefined;
  }
}

/** @internal */
export function createDeepSeekHarnessGuardHandler(
  options: PluginHandlerOptions = {},
): (execution: unknown, launchCwd: string) => string | undefined {
  return createPluginToolCallHandler(DEEPSEEK_HARNESS_HOST, options);
}

function getDeepSeekHarnessToolCall(
  execution: unknown,
  launchCwd: string,
  paths: PathResolver,
): MalformedToolCall | ToolInvocation {
  if (!execution || typeof execution !== 'object') return failedClosedToolCall(null);
  const toolCall = execution as DeepSeekHarnessToolExecution;
  const sessionCwd = toolCall.agent?.session.header.cwd ?? launchCwd;
  const workspace = firstTrustedRoot([sessionCwd], paths);
  const toolName = toolCall.name;
  if (typeof toolName !== 'string' || toolName.trim() === '') {
    return malformedToolCall(workspace ?? null);
  }
  if (!workspace) {
    return refusedCwdToolCall(
      { directory: 'session', problem: 'unusable', cwd: sessionCwd },
      { toolName },
    );
  }

  const input = toolCall.arguments;
  const shell = DEEPSEEK_HARNESS_COMMAND_TOOLS.get(toolName);
  if (!shell) {
    return createToolInvocation(
      toolName,
      input,
      { kind: getNonCommandToolInputKind(toolName) },
      { configCwd: workspace, executionCwd: workspace },
      null,
    );
  }

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return malformedToolCall(workspace, { toolName });
  }
  const shellInput = input as Record<string, unknown>;
  const command = shellInput.command;
  if (typeof command !== 'string' || command.trim() === '') {
    return malformedToolCall(workspace, { toolName });
  }

  const workdir = shellInput.workdir;
  if (workdir !== undefined && (typeof workdir !== 'string' || workdir.trim() === '')) {
    return malformedToolCall(workspace, { command, toolName });
  }
  const executionCwd =
    workdir === undefined ? workspace : firstTrustedRoot([resolve(workspace, workdir)], paths);
  if (!executionCwd) {
    return refusedCwdToolCall(
      { directory: 'requested', problem: 'unusable', cwd: workdir as string },
      { command, toolName },
    );
  }

  return createToolInvocation(
    toolName,
    input,
    { kind: 'command', shell },
    { configCwd: workspace, executionCwd },
    command,
  );
}
