import { getToolRoute } from '@/integrations/hook/common';
import { runPreToolUseHook } from '@/integrations/hook/pre-tool-use';
import type { CommandToolKind } from '@/ir/invocation';

const CODEX_COMMAND_TOOLS = new Map<string, CommandToolKind>([['Bash', 'auto']]);

export async function runCodexHook(): Promise<void> {
  await runPreToolUseHook({
    agent: 'codex',
    getToolRoute: (toolName) => getToolRoute(toolName, CODEX_COMMAND_TOOLS),
  });
}
