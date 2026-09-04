import { detectClaudeShapeAgent } from '@/integrations/hook/agent-detection';
import { getToolRoute } from '@/integrations/hook/common';
import { type PreToolUseHookOutput, runPreToolUseHook } from '@/integrations/hook/pre-tool-use';
import type { CommandToolKind } from '@/ir/invocation';

export type HookOutput = PreToolUseHookOutput;

const CLAUDE_CODE_COMMAND_TOOLS = new Map<string, CommandToolKind>([
  ['Bash', 'posix'],
  ['PowerShell', 'powershell'],
]);

/** @internal */
export function getClaudeCodeToolRoute(toolName: string) {
  return getToolRoute(toolName, CLAUDE_CODE_COMMAND_TOOLS);
}

export async function runClaudeCodeHook(): Promise<void> {
  await runPreToolUseHook({
    agent: 'claude-code',
    getAgent: (input) => detectClaudeShapeAgent(input.transcript_path),
    getToolRoute: getClaudeCodeToolRoute,
  });
}
