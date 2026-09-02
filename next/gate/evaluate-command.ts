import type { Decision } from '@next/core/decision';
import { projectSegmentWords } from '@next/core/shell/traversal';
import type { AnalyzeInput } from '@next/gate/analysis';
import { analyzeCommandWithProgram, analyzeOrCapBreach } from '@next/gate/analyzer';
import type { SemanticFactStore } from '@next/gate/facts';
import { createSemanticFactStore } from '@next/gate/guards/semantic-facts';
import {
  type CommandTrace,
  createCommandTraceContext,
  createCommandTraceRecorder,
} from '@next/gate/trace';

export type TracedCommandEvaluation = Readonly<{
  decision: Extract<Decision, { kind: 'deny' }> | null;
  trace: CommandTrace;
}>;

/**
 * Authoritative command evaluation with passive intrinsic diagnostics.
 * This entry point is intentionally internal; ordinary guard evaluation never creates a recorder.
 */
export function evaluateCommandWithTrace(
  command: string,
  options: AnalyzeInput,
  suppliedFactStore?: SemanticFactStore,
): TracedCommandEvaluation {
  const factStore = suppliedFactStore ?? createSemanticFactStore();
  const program = factStore.getCommandProgram(command, options.shell ?? 'auto');
  const recorder = createCommandTraceRecorder();
  const trace = createCommandTraceContext(recorder);
  const displayProgram =
    program.dialect === 'powershell' ? factStore.getCommandProgram(command, 'posix') : program;
  const segments = projectSegmentWords(displayProgram);
  trace.recordGlobal({
    type: 'parse',
    input: command,
    segments: segments.map((words) => [...words]),
  });
  // The analyzer's own caps read back as the denial it produces for them, so the skipped-segment
  // logic and the terminal are built from the same decision the pipeline reports.
  const decision = analyzeOrCapBreach(
    () =>
      analyzeCommandWithProgram(
        command,
        { ...options, analyzePartialProgram: true, trace },
        program,
        factStore,
      ),
    command,
    trace,
  ).decision;
  const index = trace.getNextSegmentIndex();
  if (decision && index > 0 && index < segments.length) {
    trace.recordSegment({ type: 'segment-skipped', index, reason: 'prior-segment-blocked' }, index);
  }
  return Object.freeze({
    decision,
    trace: recorder.finish(
      decision
        ? {
            result: 'blocked',
            reason: decision.reason,
            segment: decision.evidence.find((item) => item.kind === 'command')?.segment ?? command,
            ...(decision.ruleId ? { ruleId: decision.ruleId } : {}),
          }
        : { result: 'allowed' },
    ),
  });
}
