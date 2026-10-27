import {
  type AnalysisErrorCode,
  AnalysisLimit,
  createBudget,
  LIMITS,
  type LimitKind,
} from '@/core/budget';
import type { Decision } from '@/core/decision';
import { resolveCommandAnalysisContext } from '@/core/policy/analysis-context';
import type { CommandProgram } from '@/core/shell/model';
import type { AnalyzeInput } from '@/gate/analysis';
import type { SemanticFactStore } from '@/gate/facts';
import type { CommandTraceContext } from '@/gate/trace';
import { analyzeCommandInternal } from './analyze-command';

const ANALYZER_CAP_KINDS = new Set<LimitKind>([
  'derivedTokens',
  'trackedHeredocFiles',
  'controlFlowStates',
  'wrapperPeelIterations',
  'derivedCommandShape',
]);

/** @internal */
export function analyzeCommand(command: string, options: AnalyzeInput) {
  return analyzeCommandWithProgram(command, options);
}

export function analyzeCommandWithProgram(
  command: string,
  options: AnalyzeInput,
  program?: CommandProgram,
  factStore?: SemanticFactStore,
): Extract<Decision, { kind: 'deny' }> | null {
  const result = analyzeCommandInternal(
    command,
    0,
    {
      ...options,
      ...resolveCommandAnalysisContext(options),
      budget: options.budget ?? createBudget(),
      factStore,
    },
    program,
  );
  if (!result) return null;
  return {
    kind: 'deny',
    reason: result.scriptLocation ? `${result.scriptLocation}: ${result.reason}` : result.reason,
    intent: result.intent ?? 'manual_only',
    ruleId: result.ruleId,
    evidence: { command, segment: result.segment },
  };
}

export function analyzeOrCapBreach(
  run: () => Extract<Decision, { kind: 'deny' }> | null,
  command: string,
  trace?: CommandTraceContext,
) {
  try {
    return { decision: run() };
  } catch (cause) {
    const breach = analyzerCapBreach(cause, command, trace);
    if (!breach) throw cause;
    return breach;
  }
}

/** @internal */
export function analyzerCapBreach(
  cause: unknown,
  command: string,
  trace?: CommandTraceContext,
): { decision: Extract<Decision, { kind: 'deny' }>; errorCode: AnalysisErrorCode } | null {
  if (!(cause instanceof AnalysisLimit) || !ANALYZER_CAP_KINDS.has(cause.kind)) return null;
  const limit = LIMITS[cause.kind];
  if (trace?.currentSegmentIndex !== undefined) {
    trace.recordSegment({ type: 'error', message: limit.reason });
  }
  if (trace?.currentSegmentIndex === undefined) {
    trace?.recordGlobal({ type: 'error', message: limit.reason });
  }
  return {
    decision: {
      kind: 'deny',
      reason: limit.reason,
      ruleId: 'analysis.derived-command-limit',
      intent: 'stop_and_explain',
      evidence: { command, segment: command },
    },
    errorCode: limit.errorCode,
  };
}
