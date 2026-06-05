import { resolve } from 'node:path';
import { REASON_SAFETY_NET_FAILED_CLOSED } from '@/bin/hook/common';
import { analyzeCommand, loadConfig } from '@/core/analyze';
import { redactSecrets, writeAuditLog } from '@/core/audit';
import type { LoadConfigOptions } from '@/core/config';
import { ENV_FLAGS, envTruthy, getCCSafetyNetEnvModes } from '@/core/env';
import { formatBlockedMessage } from '@/core/format';

type PiApi = {
  on: (
    event: 'tool_call',
    handler: (event: unknown, ctx: PiToolCallContext) => PiToolCallResult,
  ) => void;
};

type PiToolCallContext = {
  cwd: string;
  sessionManager: {
    getSessionFile: () => string | undefined;
  };
  safetyNetAnalyzeCommand?: typeof analyzeCommand;
  safetyNetConfigOptions?: LoadConfigOptions;
};

type PiToolCallResult = { block: true; reason: string } | undefined;

type PiToolCallEvent = {
  type?: string;
  toolName?: string;
  input?: Record<string, unknown>;
};

type PiShellToolAdapter = {
  commandField: string;
  cwdField?: string;
};

const PI_SHELL_TOOL_ADAPTERS: Partial<Record<string, PiShellToolAdapter>> = {
  bash: {
    commandField: 'command',
  },
  Shell: {
    commandField: 'command',
    cwdField: 'working_directory',
  },
};

type PiShellToolCall =
  | {
      command: string;
      cwd: string;
    }
  | {
      malformed: true;
    };

export function registerToolCallEvent(pi: PiApi): void {
  pi.on('tool_call', handlePiToolCall);
}

/** @internal - exported for test coverage */
export function handlePiToolCall(event: unknown, ctx: PiToolCallContext): PiToolCallResult {
  const shellToolCall = getPiShellToolCall(event, ctx);
  if (!shellToolCall) return undefined;

  if ('malformed' in shellToolCall) {
    return blockPiToolCall(REASON_SAFETY_NET_FAILED_CLOSED);
  }

  const command = shellToolCall.command;
  const cwd = shellToolCall.cwd;
  const modes = getCCSafetyNetEnvModes();
  let result: ReturnType<typeof analyzeCommand>;
  try {
    result = (ctx.safetyNetAnalyzeCommand ?? analyzeCommand)(command, {
      cwd,
      config: loadConfig(cwd, {
        repairLocalRulebooks: true,
        ...ctx.safetyNetConfigOptions,
      }),
      strict: modes.strict,
      paranoidRm: modes.paranoidRm,
      paranoidInterpreters: modes.paranoidInterpreters,
      worktreeMode: modes.worktreeMode,
    });
  } catch (error) {
    if (envTruthy(ENV_FLAGS.debug)) {
      console.error(
        `CC Safety Net debug: pi tool_call analysis failed: ${redactSecrets(error instanceof Error ? error.message : String(error))}`,
      );
    }
    return blockPiToolCall(REASON_SAFETY_NET_FAILED_CLOSED, command, command);
  }

  if (!result) {
    const sessionId = ctx.sessionManager.getSessionFile();
    if (sessionId && envTruthy(ENV_FLAGS.debug)) {
      writeAuditLog(sessionId, command, command, 'allowed', cwd, {
        decision: 'allow',
      });
    }
    return undefined;
  }

  const sessionId = ctx.sessionManager.getSessionFile();
  if (sessionId) {
    writeAuditLog(sessionId, command, result.segment, result.reason, cwd);
  }
  return blockPiToolCall(result.reason, command, result.segment, result.manualPermissionAdvice);
}

function getPiShellToolCall(event: unknown, ctx: PiToolCallContext): PiShellToolCall | undefined {
  if (!event || typeof event !== 'object') return undefined;
  const toolCall = event as PiToolCallEvent;
  if (typeof toolCall.toolName !== 'string') return undefined;

  const adapter = PI_SHELL_TOOL_ADAPTERS[toolCall.toolName];
  if (!adapter) return undefined;
  if (!toolCall.input || typeof toolCall.input !== 'object') return { malformed: true };

  const command = toolCall.input[adapter.commandField];
  if (typeof command !== 'string') return { malformed: true };

  const cwdInput = adapter.cwdField ? toolCall.input[adapter.cwdField] : undefined;
  const cwd = typeof cwdInput === 'string' ? resolve(ctx.cwd, cwdInput) : ctx.cwd;
  return { command, cwd };
}

function blockPiToolCall(
  reason: string,
  command?: string,
  segment?: string,
  manualPermissionAdvice?: boolean,
): PiToolCallResult {
  return {
    block: true,
    reason: formatBlockedMessage({
      reason,
      command,
      segment,
      redact: redactSecrets,
      manualPermissionAdvice,
    }),
  };
}
