import { getToolRoute } from '@/gate/intake';
import type { CommandToolKind } from '@/gate/invocation';
import { getStandardHookContext, runConfiguredHookAdapter } from '@/hosts/hook/common';
import { PRE_TOOL_USE_HOOK_EVENT } from '@/hosts/hook/constants';

type DevinHookInput = {
  hook_event_name?: unknown;
  tool_name?: unknown;
  tool_input?: unknown;
  session_id?: unknown;
};

const DEVIN_COMMAND_TOOLS = new Map<string, CommandToolKind>([['exec', 'auto']]);

function textTypedIntoProcess(toolName: string, toolInput: unknown): string | undefined {
  if (toolName !== 'write_to_process' || typeof toolInput !== 'object' || toolInput === null) {
    return undefined;
  }
  const text = (toolInput as Record<string, unknown>).text_input;
  return typeof text === 'string' && text !== '' ? text : undefined;
}

export async function runDevinHook(): Promise<void> {
  await runConfiguredHookAdapter<DevinHookInput>({
    agent: 'devin',
    createDenyOutput: (message) => ({ decision: 'block', reason: message }),
    isSupported: (input) => input.hook_event_name === PRE_TOOL_USE_HOOK_EVENT,
    getToolName: (input) => input.tool_name,
    getToolInput: (input, toolName) => {
      const typed = textTypedIntoProcess(toolName, input.tool_input);
      if (typed === undefined) {
        return {
          ok: true,
          input: input.tool_input,
          route: getToolRoute(toolName, DEVIN_COMMAND_TOOLS),
        };
      }
      return { ok: true, input: { command: typed }, route: { kind: 'command', shell: 'auto' } };
    },
    getContext: (_input, ...call) => getStandardHookContext({}, ...call),
    getSessionId: (input) =>
      typeof input.session_id === 'string' && input.session_id !== ''
        ? input.session_id
        : undefined,
  });
}
