import { describe, expect, test } from 'bun:test';
import { evaluateCommandWithTrace as portedEvaluateWithTrace } from '@next/gate/evaluate-command';
import { evaluateCommandWithTrace as shippedEvaluateWithTrace } from '@/engine/evaluate-command';
import { policySnapshot, testModes } from '../../helpers/policy';
import { SYNTHETIC_ENVIRONMENT as environment } from '../helpers/gate-differential';
import { corpusCommands, FIXED_COMMANDS } from '../helpers/shell-inputs';

/**
 * `explain` shows the user the analysis, step by step, so the port has to reach its decisions by
 * the same route and not merely arrive at the same verdict. Every corpus command is traced on
 * both sides at each safety level and the whole recording — every step, in order, with its
 * redacted text — is compared.
 *
 * The environment is synthetic and its filesystem empty, so the recordings depend on nothing but
 * the command: no path exists, `realpath` answers null, and the port reads no filesystem at all
 * (the shipped gate still stats the same absent paths and gets the same answer).
 */

const snapshot = policySnapshot();

function analysisInput(level: 'standard' | 'strict' | 'paranoid') {
  const modes = testModes(level);
  return {
    policySnapshot: snapshot,
    cwd: '/work/project',
    environment,
    protectedGitMetadata: null,
    effectiveCapabilities: modes.capabilities,
    strict: modes.strict,
    paranoidRm: modes.paranoidRm,
    paranoidInterpreters: modes.paranoidInterpreters,
  };
}

/**
 * The two analyzer budget breaches no corpus command reaches. They are the only inputs that record
 * an error step from a budget, and the two land in different scopes: the recursion cap on the open
 * segment, the derived-command cap globally.
 */
const budgetBreaches = [
  Array.from({ length: 10 }).reduce<string>(
    (inner) => `bash -c ${JSON.stringify(inner)}`,
    'echo ok',
  ),
  `unknown-head ${Array.from({ length: 181 }, () => 'bash').join(' ')}`,
];

/** The contract corpus plus the parser-shaped table the other differentials feed. */
const commands = [...new Set([...corpusCommands(), ...FIXED_COMMANDS, ...budgetBreaches])];

describe('recorded traces agree command by command', () => {
  for (const level of ['standard', 'strict', 'paranoid'] as const) {
    test(`${commands.length} corpus and parser-shaped commands at ${level}`, () => {
      const input = analysisInput(level);
      const divergent = commands.flatMap((command) => {
        const ported = portedEvaluateWithTrace(command, input);
        const shipped = shippedEvaluateWithTrace(command, input);
        return Bun.deepEquals(ported, shipped, true) ? [] : [{ command, ported, shipped }];
      });
      expect(divergent).toStrictEqual([]);
    });
  }

  test('the inputs record blocked traces, allowed traces and per-segment events', () => {
    const traces = commands.map(
      (command) => portedEvaluateWithTrace(command, analysisInput('standard')).trace,
    );
    const blocked = traces.filter((trace) => trace.terminal.result === 'blocked').length;
    expect({
      traced: traces.length,
      blocked,
      allowed: traces.length - blocked,
      withSegmentEvents: traces.filter((trace) =>
        trace.events.some((event) => event.scope === 'segment'),
      ).length,
      recordingNothing: traces.filter((trace) => trace.events.length === 0).length,
    }).toStrictEqual({
      traced: commands.length,
      blocked: 39,
      allowed: commands.length - 39,
      withSegmentEvents: 196,
      recordingNothing: 0,
    });
  });

  test('one recording is compared field by field, not merely counted', () => {
    const command = 'cd /tmp && rm -rf /';
    const ported = portedEvaluateWithTrace(command, analysisInput('standard'));
    expect(ported).toStrictEqual(shippedEvaluateWithTrace(command, analysisInput('standard')));
    expect(ported.trace.terminal).toMatchObject({ result: 'blocked', segment: 'rm -rf /' });
    expect(ported.trace.events.map((event) => event.step.type)).toContain('parse');
    expect(ported.trace.droppedEvents).toBe(0);
  });
});
