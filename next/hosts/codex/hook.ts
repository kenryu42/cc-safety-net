import { getToolRoute } from '@next/gate/intake';
import type { CommandToolKind } from '@next/gate/invocation';
import { runPreToolUseHook } from '@next/hosts/hook/pre-tool-use';

const CODEX_COMMAND_TOOLS = new Map<string, CommandToolKind>([['Bash', 'auto']]);

export async function runCodexHook(): Promise<void> {
  await runPreToolUseHook({
    agent: 'codex',
    getToolRoute: (toolName) => getToolRoute(toolName, CODEX_COMMAND_TOOLS),
  });
}
