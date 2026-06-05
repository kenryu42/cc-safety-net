import { REASON_SAFETY_NET_FAILED_CLOSED } from '@/bin/hook/common';
import { analyzeCommand, loadConfig } from '@/core/analyze';
import { redactSecrets, writeAuditLog } from '@/core/audit';
import type { LoadConfigOptions } from '@/core/config';
import { ENV_FLAGS, envTruthy, getCCSafetyNetEnvModes } from '@/core/env';
import { formatBlockedMessage } from '@/core/format';

type PiApi = {
  on: (
    event: 'tool_call',
    handler: (event: unknown, ctx: PiToolUseContext) => PiToolUseResult,
  ) => void;
};

type PiToolUseContext = {
  cwd: string;
  sessionManager: {
    getSessionFile: () => string | undefined;
  };
  safetyNetAnalyzeCommand?: typeof analyzeCommand;
  safetyNetConfigOptions?: LoadConfigOptions;
};

type PiToolUseResult = { block: true; reason: string } | undefined;

type PiToolUseEvent = {
  type?: string;
  toolName?: string;
  input?: {
    command?: unknown;
  };
};

export function registerToolUseEvent(pi: PiApi): void {
  pi.on('tool_call', handlePiToolUse);
}

export function handlePiToolUse(event: unknown, ctx: PiToolUseContext): PiToolUseResult {
  if (!isPiBashToolUseEvent(event)) return undefined;

  if (typeof event.input.command !== 'string') {
    return blockPiToolUse(REASON_SAFETY_NET_FAILED_CLOSED);
  }

  const modes = getCCSafetyNetEnvModes();
  let result: ReturnType<typeof analyzeCommand>;
  try {
    result = (ctx.safetyNetAnalyzeCommand ?? analyzeCommand)(event.input.command, {
      cwd: ctx.cwd,
      config: loadConfig(ctx.cwd, {
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
        `CC Safety Net debug: pi tool_use analysis failed: ${redactSecrets(error instanceof Error ? error.message : String(error))}`,
      );
    }
    return blockPiToolUse(
      REASON_SAFETY_NET_FAILED_CLOSED,
      event.input.command,
      event.input.command,
    );
  }

  if (!result) {
    const sessionId = ctx.sessionManager.getSessionFile();
    if (sessionId && envTruthy(ENV_FLAGS.debug)) {
      writeAuditLog(sessionId, event.input.command, event.input.command, 'allowed', ctx.cwd, {
        decision: 'allow',
      });
    }
    return undefined;
  }

  const sessionId = ctx.sessionManager.getSessionFile();
  if (sessionId) {
    writeAuditLog(sessionId, event.input.command, result.segment, result.reason, ctx.cwd);
  }
  return blockPiToolUse(
    result.reason,
    event.input.command,
    result.segment,
    result.manualPermissionAdvice,
  );
}

function isPiBashToolUseEvent(event: unknown): event is PiToolUseEvent & {
  toolName: 'bash';
  input: { command?: unknown };
} {
  if (!event || typeof event !== 'object') return false;
  const toolUse = event as PiToolUseEvent;
  return toolUse.toolName === 'bash' && !!toolUse.input;
}

function blockPiToolUse(
  reason: string,
  command?: string,
  segment?: string,
  manualPermissionAdvice?: boolean,
): PiToolUseResult {
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
