import { describe, expect, test } from 'bun:test';
import { REASON_DERIVED_COMMAND_WORK_LIMIT } from '@/core/budget';
import { getCCSafetyNetEnvModes } from '@/core/policy/env';
import { parseCommand } from '@/core/shell/parse';
import { projectSegmentWords } from '@/core/shell/traversal';
import { evaluateGuard, type GuardEvaluation } from '@/gate/pipeline';
import {
  type CommandTraceContext,
  type CommandTraceTerminal,
  createCommandTraceContext,
  createCommandTraceRecorder,
} from '@/gate/trace';
import { bashCall, SYNTHETIC_ENVIRONMENT as environment } from '../helpers/gate-differential';
import { policySnapshot } from '../helpers/policy';
import { corpusCommands, FIXED_COMMANDS } from '../helpers/shell-inputs';

const snapshot = policySnapshot();

const commands = [...new Set([...corpusCommands(), ...FIXED_COMMANDS])];

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

const CWD = '/work/project';

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

function evaluateWithSink(command: string) {
  const recorder = createCommandTraceRecorder();
  const trace = createCommandTraceContext(recorder);
  trace.recordGlobal({
    type: 'parse',
    input: command,
    segments: projectSegmentWords(parseCommand(command, 'posix')).map((words) => [...words]),
  });
  const evaluation = evaluateGuard(bashCall(command, CWD), {
    environment,
    trace,
    dependencies,
  });
  return { evaluation, trace: recorder.finish(terminalFor(evaluation, command)) };
}

describe('the analyzer steps reach a sink handed to evaluateGuard', () => {
  test('an analyzer cap breach reaches the sink as the error step the wrapper records', () => {
    const command = `custom-tool ${Array.from({ length: 190 }, () => 'bash').join(' ')}`;
    const sunk = evaluateWithSink(command);
    expect(sunk.evaluation.errorCode).toBe('structural-shell-syntax-limit');
    expect(sunk.trace.events.at(-1)).toStrictEqual({
      kind: 'step',
      scope: 'global',
      step: { type: 'error', message: REASON_DERIVED_COMMAND_WORK_LIMIT },
    });
  });

  test('a sink never changes a decision', () => {
    const decide = (command: string, trace?: CommandTraceContext) => {
      try {
        return evaluateGuard(bashCall(command, CWD), {
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
