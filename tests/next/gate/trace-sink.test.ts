import { describe, expect, test } from 'bun:test';
import { REASON_DERIVED_COMMAND_WORK_LIMIT } from '@next/core/budget';
import { getCCSafetyNetEnvModes } from '@next/core/policy/env';
import { parseCommand } from '@next/core/shell/parse';
import { projectSegmentWords } from '@next/core/shell/traversal';
import { evaluateCommandWithTrace } from '@next/gate/evaluate-command';
import { evaluateGuard, type GuardEvaluation } from '@next/gate/pipeline';
import {
  type CommandTraceContext,
  type CommandTraceEvent,
  type CommandTraceTerminal,
  createCommandTraceContext,
  createCommandTraceRecorder,
} from '@next/gate/trace';
import { policySnapshot } from '../../helpers/policy';
import { bashCall, SYNTHETIC_ENVIRONMENT as environment } from '../helpers/gate-differential';
import { corpusCommands, FIXED_COMMANDS } from '../helpers/shell-inputs';

/**
 * `explain` will run the real pipeline instead of the analyzer wrapper (design §8.4), so the
 * recorder it hands `evaluateGuard` has to receive exactly what the wrapper records today. Every
 * corpus command is evaluated through the pipeline with a sink attached and compared against the
 * wrapper's recording of the same command, step by step and terminal by terminal.
 *
 * Two classes cannot be compared and are counted instead of dropped silently: a command a
 * protection or the secret matcher denies never reaches the analyzer through the pipeline, and a
 * command whose program does not parse completely is analyzed by the wrapper alone
 * (`analyzePartialProgram`). Everything else is compared, after removing the two steps the wrapper
 * records around the analyzer and the pipeline does not own: the global `parse` and
 * `segment-skipped`, which design §8.4 moves into `explain` itself.
 */

const snapshot = policySnapshot();

/** The contract corpus plus the parser-shaped table, the same inputs trace parity records. */
const commands = [...new Set([...corpusCommands(), ...FIXED_COMMANDS])];

// The wrapper takes the modes as analysis options while the pipeline derives them, so the same
// forced-standard set is handed to both: the sink test compares recordings, not mode resolution.
const modes = {
  ...getCCSafetyNetEnvModes(snapshot.policy, environment.env),
  strict: false,
  paranoidRm: false,
  paranoidInterpreters: false,
  worktreeMode: false,
};

const dependencies = {
  loadPolicySnapshot: () => snapshot,
  resolveGitMetadata: () => null,
  getModes: () => modes,
};

// The modes go in whole rather than field by field, so the wrapper analyzes under exactly the set
// `getModes` hands the pipeline; the analyzer reads the capabilities under its own name.
const analysisInput = {
  ...modes,
  cwd: '/work/project',
  shell: 'posix' as const,
  policySnapshot: snapshot,
  environment,
  protectedGitMetadata: null,
  effectiveCapabilities: modes.capabilities,
};

function terminalFor(evaluation: GuardEvaluation, command: string): CommandTraceTerminal {
  const decision = evaluation.decision;
  if (decision.kind !== 'deny') return { result: 'allowed' };
  const evidence = decision.evidence.find((item) => item.kind === 'command');
  return {
    result: 'blocked',
    reason: decision.reason,
    segment: evidence?.segment ?? command,
    ...(decision.ruleId ? { ruleId: decision.ruleId } : {}),
  };
}

/** One evaluation through the pipeline with a sink attached, finished the way `explain` will. */
function evaluateWithSink(command: string) {
  const recorder = createCommandTraceRecorder();
  const trace = createCommandTraceContext(recorder);
  // The parse step is `explain`'s own once it runs the pipeline (design §8.4), and the recorder
  // reads the command's assignment values out of it to redact them from every later step. A sink
  // without it would compare differently redacted text against the wrapper, so the harness records
  // the step the same way the wrapper does and both sides drop it before comparing.
  trace.recordGlobal({
    type: 'parse',
    input: command,
    segments: projectSegmentWords(parseCommand(command, 'posix')).map((words) => [...words]),
  });
  const evaluation = evaluateGuard(bashCall(command, analysisInput.cwd), {
    environment,
    trace,
    dependencies,
  });
  return { evaluation, trace: recorder.finish(terminalFor(evaluation, command)) };
}

/**
 * The pipeline can also refuse before the analyzer runs — a nested program the parser reported
 * `limited` fails the protection walk closed — where the wrapper has no stage that can. Those are
 * counted, not compared; the evaluation the failure carries is what the differentials pin.
 */
function sinkOutcome(command: string) {
  try {
    return evaluateWithSink(command);
  } catch (error) {
    if ((error as Error).name !== 'GuardEvaluationError') throw error;
    return null;
  }
}

/** The steps the pipeline itself owns: neither recorder's `parse`, and no skipped-segment note. */
function ownedSteps(events: readonly CommandTraceEvent[]) {
  return events.filter(
    (event) => event.step.type !== 'parse' && event.step.type !== 'segment-skipped',
  );
}

describe('the analyzer steps reach a sink handed to evaluateGuard', () => {
  test('every corpus command records what the analyzer wrapper records', () => {
    const counts = { compared: 0, recordingSteps: 0, preempted: 0, partial: 0, failedClosed: 0 };
    const blocked = new Set<string>();
    const divergent = commands.flatMap((command) => {
      const sunk = sinkOutcome(command);
      if (!sunk) {
        counts.failedClosed++;
        return [];
      }
      if (sunk.evaluation.stage !== 'command-analysis') {
        counts.preempted++;
        return [];
      }
      if (parseCommand(command, 'posix').status !== 'complete') {
        counts.partial++;
        return [];
      }
      counts.compared++;
      blocked.add(sunk.trace.terminal.result);
      const steps = ownedSteps(sunk.trace.events);
      // A sink that received nothing would agree with a reference that recorded nothing, so the
      // recordings that carry steps are counted: the comparison is over real recordings.
      if (steps.length > 0) counts.recordingSteps++;
      const reference = evaluateCommandWithTrace(command, analysisInput).trace;
      return Bun.deepEquals(steps, ownedSteps(reference.events), true) &&
        Bun.deepEquals(sunk.trace.terminal, reference.terminal, true)
        ? []
        : [{ command, sunk: sunk.trace, reference }];
    });
    expect(divergent).toStrictEqual([]);
    expect(counts).toStrictEqual({
      compared: 152,
      recordingSteps: 151,
      preempted: 14,
      partial: 32,
      failedClosed: 3,
    });
    // Both terminals occur among the compared commands, so the comparison covers a recording that
    // ends in a denial as well as one that runs to the end of the program.
    expect([...blocked].sort()).toStrictEqual(['allowed', 'blocked']);
  });

  test('an analyzer cap breach reaches the sink as the error step the wrapper records', () => {
    const command = `custom-tool ${Array.from({ length: 190 }, () => 'bash').join(' ')}`;
    const sunk = evaluateWithSink(command);
    expect(sunk.evaluation.errorCode).toBe('structural-shell-syntax-limit');
    expect(sunk.trace.events.at(-1)).toStrictEqual({
      kind: 'step',
      scope: 'global',
      step: { type: 'error', message: REASON_DERIVED_COMMAND_WORK_LIMIT },
    });
    expect(sunk.trace.events.at(-1)).toStrictEqual(
      evaluateCommandWithTrace(command, analysisInput).trace.events.at(-1),
    );
  });

  test('a sink never changes a decision', () => {
    const decide = (command: string, trace?: CommandTraceContext) => {
      try {
        return evaluateGuard(bashCall(command, analysisInput.cwd), {
          environment,
          trace,
          dependencies,
        });
      } catch (error) {
        return (error as { evaluation?: GuardEvaluation }).evaluation ?? (error as Error).name;
      }
    };
    expect(
      commands.map((command) =>
        decide(command, createCommandTraceContext(createCommandTraceRecorder())),
      ),
    ).toStrictEqual(commands.map((command) => decide(command)));
  });
});
