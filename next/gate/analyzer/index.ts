import type { Decision } from '@next/core/decision';
import { resolveCommandAnalysisContext } from '@next/core/policy/analysis-context';
import type { CommandProgram } from '@next/core/shell/model';
import type { AnalyzeInput } from '@next/gate/analysis';
import type { SemanticFactStore } from '@next/gate/facts';
import { analyzeCommandInternal } from './analyze-command';

export function analyzeCommand(command: string, options: AnalyzeInput) {
  return analyzeCommandWithProgram(command, options);
}

/** Canonical pre-parsed command-analysis entry point. */
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
      factStore,
    },
    program,
  );
  if (!result) return null;
  return {
    kind: 'deny',
    reason: result.reason,
    intent: result.intent ?? 'manual_only',
    ...(result.ruleId ? { ruleId: result.ruleId } : {}),
    evidence: [{ kind: 'command', command, segment: result.segment }],
  };
}
