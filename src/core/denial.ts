import { REASON_SAFETY_NET_FAILED_CLOSED } from './budget';
import type { BlockIntent, Decision } from './decision';
import { redactSecrets } from './redaction';

export interface FormatBlockedMessageInput {
  reason: string;
  ruleId?: string;
  intent?: BlockIntent;
  command?: string;
  segment?: string;
  toolName?: string;
  cwd?: string;
  maxLen?: number;
  redact?: (text: string) => string;
  configWarning?: string;
  askUser?: boolean;
}

const FOOTERS: Record<BlockIntent, string> = {
  hard_stop:
    'Do not retry this operation or attempt any workaround (other tools, flags, or paths). Report the block to the user and continue with the rest of the task.',
  use_alternative:
    'Do not retry the blocked form. Continue the task using the safer alternative described above.',
  scope_down:
    'Retry with a narrower, explicit target as described above. Escalate to the user if the broad operation is truly required.',
  manual_only:
    'If this operation is truly needed, ask the user for explicit permission and have them run the command manually.',
  stop_and_explain:
    'Do not brute-force variants. Simplify or restructure the command so it can be analyzed, or report the block to the user.',
};

export function formatBlockedMessage(input: FormatBlockedMessageInput): string {
  const maxLen = input.maxLen ?? 200;
  const redact = input.redact ?? ((text: string) => text);
  const excerpt = (text: string) => (text.length > maxLen ? `${text.slice(0, maxLen)}...` : text);

  return [
    input.askUser ? 'CC Safety Net could not verify this command' : 'BLOCKED by CC Safety Net',
    `Reason: ${redact(input.reason)}`,
    input.ruleId ? `Rule: ${input.ruleId}` : undefined,
    input.toolName ? `Tool: ${input.toolName}` : undefined,
    input.command ? `Command: ${excerpt(redact(input.command))}` : undefined,
    input.segment && input.segment !== input.command
      ? `Segment: ${excerpt(redact(input.segment))}`
      : undefined,
    input.cwd ? `Working directory: ${excerpt(redact(input.cwd))}` : undefined,
    input.configWarning ? `Config warning: ${redact(input.configWarning)}` : undefined,
    input.askUser
      ? 'Approve only if you expected this command.'
      : FOOTERS[input.intent ?? 'manual_only'],
  ]
    .filter((line): line is string => line !== undefined)
    .join('\n\n');
}

export type IntegrationDenial = {
  reason: string;
  ruleId?: string;
  intent?: BlockIntent;
  command?: string;
  segment?: string;
  toolName?: string;
  cwd?: string;

  configWarning?: string;
  unverifiedByStandardMode?: true;
};

export function projectGuardDenial(
  evaluation: { decision: Decision; configFallback?: { reason: string } },
  options: { includeEvidence: boolean; toolName?: string },
): IntegrationDenial | undefined {
  if (evaluation.decision.kind !== 'deny') return undefined;
  const evidence = options.includeEvidence ? evaluation.decision.evidence : undefined;
  return {
    reason: evaluation.decision.reason,
    ruleId: evaluation.decision.ruleId,
    intent: evaluation.decision.intent,
    command: evidence?.command,
    segment: evidence?.segment,
    toolName: options.toolName,

    ...(evaluation.configFallback ? { configWarning: evaluation.configFallback.reason } : {}),
    ...(evaluation.decision.unverifiedByStandardMode
      ? { unverifiedByStandardMode: true as const }
      : {}),
  };
}

export function createFailedClosedDenial(
  options: Pick<IntegrationDenial, 'command' | 'segment' | 'toolName'> = {},
): IntegrationDenial {
  return {
    reason: REASON_SAFETY_NET_FAILED_CLOSED,
    ruleId: 'analysis.failed-closed',
    intent: 'stop_and_explain',
    command: options.command,
    segment: options.segment ?? options.command,
    toolName: options.toolName,
  };
}

export function createMalformedToolCallDenial(
  options: Pick<IntegrationDenial, 'command' | 'toolName'> = {},
) {
  return {
    reason:
      'CC Safety Net could not check this tool call because it arrived without a usable tool name or arguments. This is not a CC Safety Net failure. Send the call again with its tool name and complete arguments.',
    ruleId: 'tool-call.malformed',
    intent: 'use_alternative',
    command: options.command,
    segment: options.command,
    toolName: options.toolName,
  } satisfies IntegrationDenial;
}

const CWD_DENIALS = {
  session: {
    unusable: {
      reason:
        "CC Safety Net cannot check tool calls because the session's working directory or workspace root no longer exists, is inaccessible, is not a directory, or uses an unsupported path form. Ask the user to restart the session from an existing directory.",
      intent: 'hard_stop',
      ruleId: 'cwd.session-unusable',
    },
    'outside-workspace': {
      reason:
        "CC Safety Net cannot check tool calls because the session's working directory is outside its workspace roots. Ask the user to restart the session from a directory inside the workspace.",
      intent: 'hard_stop',
      ruleId: 'cwd.session-outside-workspace',
    },
  },
  requested: {
    unusable: {
      reason:
        'CC Safety Net could not use the requested working directory because it does not exist, is inaccessible, is not a directory, or uses an unsupported path form. Use an existing accessible working directory. If the requested directory is missing, create it from an accessible location before retrying the command.',
      intent: 'use_alternative',
      ruleId: 'cwd.requested-unusable',
    },
    'outside-workspace': {
      reason:
        "CC Safety Net could not use the requested working directory because it is outside the session's workspace. Use a working directory inside the workspace.",
      intent: 'use_alternative',
      ruleId: 'cwd.requested-outside-workspace',
    },
  },
} as const satisfies Record<
  string,
  Record<string, { reason: string; intent: BlockIntent; ruleId: string }>
>;

export type CwdProblem = keyof (typeof CWD_DENIALS)['session'];

export type CwdDenial = {
  directory: keyof typeof CWD_DENIALS;
  problem: CwdProblem;
  cwd: string;
};

export function createCwdDenial(
  cause: CwdDenial,
  options: Pick<IntegrationDenial, 'command' | 'toolName'> = {},
) {
  return {
    ...CWD_DENIALS[cause.directory][cause.problem],
    command: options.command,
    toolName: options.toolName,
    cwd: cause.cwd,
  };
}

export function formatDenial(denial: IntegrationDenial): string {
  return formatBlockedMessage({ ...denial, redact: redactSecrets });
}

export function formatAskPrompt(denial: IntegrationDenial): string {
  return formatBlockedMessage({ ...denial, redact: redactSecrets, askUser: true });
}

export function formatIntegrationError(cause: unknown): string {
  return redactSecrets(cause instanceof Error ? cause.message : String(cause));
}
