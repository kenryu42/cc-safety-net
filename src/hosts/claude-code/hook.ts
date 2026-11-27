import type { Environment } from '@/core/environment';
import { getToolRoute } from '@/gate/intake';
import type { CommandToolKind, ToolRoute } from '@/gate/invocation';
import { runAntigravityCliHook } from '@/hosts/antigravity-cli/hook';
import { detectClaudeShapeAgent } from '@/hosts/hook/agent-detection';
import { type PreToolUseHookInput, runPreToolUseHook } from '@/hosts/hook/pre-tool-use';

export const CLAUDE_CODE_COMMAND_TOOLS = new Map<string, CommandToolKind>([
  ['Bash', 'posix'],
  ['PowerShell', 'powershell'],
  ['Monitor', 'posix'],
]);

const PERMISSION_MODES_THAT_PROMPT_ON_ASK = ['default', 'acceptEdits', 'plan', 'auto'];

function getClaudeCodeToolRoute(
  toolName: string,
  toolInput: PreToolUseHookInput['tool_input'],
  environment: Environment,
): ToolRoute {
  const isCopilotShell = toolName === 'Bash' && environment.env.get('COPILOT_CLI') === '1';
  if (isCopilotShell) return { kind: 'command', shell: 'auto' };
  const isWebSocketMonitor = toolName === 'Monitor' && toolInput?.command === undefined;
  return isWebSocketMonitor
    ? getToolRoute(toolName, new Map())
    : getToolRoute(toolName, CLAUDE_CODE_COMMAND_TOOLS);
}

export async function runClaudeCodeHook(): Promise<void> {
  await runPreToolUseHook({
    agent: 'claude-code',
    getAgent: (input, environment) => detectClaudeShapeAgent(input.transcript_path, environment),
    canPromptPerson: (input) =>
      PERMISSION_MODES_THAT_PROMPT_ON_ASK.includes(input.permission_mode ?? ''),
    getToolRoute: getClaudeCodeToolRoute,
    handOff: (input) =>
      'toolCall' in input &&
      typeof input.toolCall === 'object' &&
      input.toolCall !== null &&
      !Array.isArray(input.toolCall) &&
      !('tool_name' in input)
        ? runAntigravityCliHook(input)
        : undefined,
  });
}
