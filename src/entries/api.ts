import { isAbsolute, resolve } from 'node:path';
import { REASON_SAFETY_NET_FAILED_CLOSED } from '@/core/budget';
import type { Decision } from '@/core/decision';
import { createProcessEnvironment } from '@/core/environment';
import { isUsableDirectory } from '@/gate/intake';
import { createToolInvocation } from '@/gate/invocation';
import { evaluateGuard, GuardEvaluationError } from '@/gate/pipeline';

export type CheckCommandInput = Readonly<{
  command: string;
  cwd: string;
}>;

export type CheckCommandResult =
  | Readonly<{ kind: 'allow' }>
  | Readonly<{ kind: 'deny'; reason: string; ruleId?: string }>;

export function checkCommand(input: CheckCommandInput): CheckCommandResult {
  if (typeof input !== 'object' || input === null) {
    throw new TypeError('checkCommand requires an input object with command and cwd');
  }
  if (typeof input.command !== 'string' || input.command.trim() === '') {
    throw new TypeError('command must be a non-empty string');
  }
  if (typeof input.cwd !== 'string' || input.cwd.trim() === '' || !isAbsolute(input.cwd)) {
    throw new TypeError('cwd must be an absolute directory path');
  }

  const cwd = resolve(input.cwd);
  if (!isUsableDirectory(cwd)) {
    return { kind: 'deny', reason: REASON_SAFETY_NET_FAILED_CLOSED };
  }
  return projectDecision(
    evaluateCommandGuard(
      createToolInvocation(
        'library-api',
        { command: input.command },
        { kind: 'command', shell: 'auto' },
        { configCwd: cwd, executionCwd: cwd },
        input.command,
      ),
    ),
  );
}

function evaluateCommandGuard(invocation: Parameters<typeof evaluateGuard>[0]): Decision {
  try {
    return evaluateGuard(invocation, { environment: createProcessEnvironment() }).decision;
  } catch (error) {
    if (!(error instanceof GuardEvaluationError)) throw error;
    return error.evaluation.decision;
  }
}

function projectDecision(decision: Decision): CheckCommandResult {
  if (decision.kind === 'allow') return { kind: 'allow' };
  return {
    kind: 'deny',
    reason: decision.reason,
    ...(decision.ruleId === undefined ? {} : { ruleId: decision.ruleId }),
  };
}
