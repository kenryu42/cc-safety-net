import { describe, expect, test } from 'bun:test';
import { REASON_SAFETY_NET_FAILED_CLOSED } from '@/core/budget';
import { BLOCK_INTENTS, type BlockIntent, type Decision } from '@/core/decision';
import * as next from '@/core/denial';
import { corpusStrings } from './differential-inputs';

const LONG_COMMAND = `rm -rf ${'./build/artifacts '.repeat(20)}`;
const LONG_REASON = `Blocked: ${'the target is outside the workspace and cannot be recovered '.repeat(5)}`;
const SECRET_COMMAND =
  'GITHUB_TOKEN=ghp_abcdefghijklmnopqrstuvwxyz0123 git push --force origin main';
const SECRET_CONFIG = 'invalid policy config: token sk-proj-abcdefghijklmnopqrstuvwxyz';
const TOKEN = 'ghp_abcdefghijklmnopqrstuvwxyz0123';

function deny(
  reason: string,
  intent: BlockIntent,
  evidence: { command: string; segment?: string }[],
  ruleId?: string,
): Decision {
  return {
    kind: 'deny',
    reason,
    intent,
    ...(ruleId === undefined ? {} : { ruleId }),
    evidence: evidence.map((item) => ({ kind: 'command' as const, ...item })),
  };
}

const FOOTERS: Readonly<Record<BlockIntent, string>> = {
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

describe('denial renderer', () => {
  test('the frame prints its lines in one order, blank-line separated', () => {
    expect(
      next.formatBlockedMessage({
        reason: 'the reason',
        ruleId: 'rule.id',
        intent: 'hard_stop',
        command: 'git push --force origin main; echo 1',
        segment: 'git push --force origin main',
        toolName: 'Bash',
        configWarning: 'the policy load degraded',
      }),
    ).toBe(
      [
        'BLOCKED by CC Safety Net',
        'Reason: the reason',
        'Rule: rule.id',
        'Tool: Bash',
        'Command: git push --force origin main; echo 1',
        'Segment: git push --force origin main',
        'Config warning: the policy load degraded',
        FOOTERS.hard_stop,
      ].join('\n\n'),
    );
  });

  test('a field the caller left out, or left empty, prints no line at all', () => {
    expect(next.formatBlockedMessage({ reason: 'bare' })).toBe(
      `BLOCKED by CC Safety Net\n\nReason: bare\n\n${FOOTERS.manual_only}`,
    );
    expect(
      next.formatBlockedMessage({
        reason: 'bare',
        ruleId: '',
        command: '',
        segment: '',
        toolName: '',
        configWarning: '',
      }),
    ).toBe(`BLOCKED by CC Safety Net\n\nReason: bare\n\n${FOOTERS.manual_only}`);
    expect(
      next.formatBlockedMessage({
        reason: 'same',
        command: 'git reset --hard',
        segment: 'git reset --hard',
      }),
    ).toBe(
      `BLOCKED by CC Safety Net\n\nReason: same\n\nCommand: git reset --hard\n\n${FOOTERS.manual_only}`,
    );
    expect(next.formatBlockedMessage({ reason: 'orphan', segment: 'git reset --hard' })).toBe(
      `BLOCKED by CC Safety Net\n\nReason: orphan\n\nSegment: git reset --hard\n\n${FOOTERS.manual_only}`,
    );
  });

  test('each intent ends the frame with its own instruction, and no intent means manual_only', () => {
    for (const intent of BLOCK_INTENTS) {
      const lines = next.formatBlockedMessage({ reason: 'r', intent }).split('\n\n');
      expect(lines.at(-1), intent).toBe(FOOTERS[intent]);
    }
    expect(next.formatBlockedMessage({ reason: 'r' }).split('\n\n').at(-1)).toBe(
      FOOTERS.manual_only,
    );
    expect(Object.keys(FOOTERS).sort()).toEqual([...BLOCK_INTENTS].sort());
  });

  test('the command and segment lines are excerpted at the cap, and nothing else is', () => {
    const capped = next.formatBlockedMessage({
      reason: LONG_REASON,
      command: LONG_COMMAND,
      segment: 'short',
    });
    expect(capped).toContain(`Command: ${LONG_COMMAND.slice(0, 200)}...`);
    expect(capped).toContain(`Reason: ${LONG_REASON}`);
    expect(next.formatBlockedMessage({ reason: 'r', command: 'y'.repeat(200) })).toContain(
      `Command: ${'y'.repeat(200)}`,
    );
    expect(next.formatBlockedMessage({ reason: 'r', command: 'y'.repeat(201) })).toContain(
      `Command: ${'y'.repeat(200)}...`,
    );
    expect(
      next.formatBlockedMessage({
        reason: 'r',
        command: LONG_COMMAND,
        segment: LONG_COMMAND.slice(0, 60),
        maxLen: 50,
      }),
    ).toContain(`Segment: ${LONG_COMMAND.slice(0, 50)}...`);
    expect(next.formatBlockedMessage({ reason: 'r', command: 'abc', maxLen: 0 })).toContain(
      'Command: ...',
    );
  });

  test('the frame redacts through the redactor it is given, and only through that one', () => {
    const redacted = next.formatBlockedMessage({
      reason: 'custom redactor over secret',
      command: 'rm -rf /secret/path',
      segment: 'echo secret',
      configWarning: 'secret warning',
      redact: (text) => text.replace(/secret/g, '***'),
    });
    expect(redacted).toContain('Reason: custom redactor over ***');
    expect(redacted).toContain('Command: rm -rf /***/path');
    expect(redacted).toContain('Segment: echo ***');
    expect(redacted).toContain('Config warning: *** warning');
    expect(next.formatBlockedMessage({ reason: 'r', configWarning: SECRET_CONFIG })).toContain(
      SECRET_CONFIG,
    );
    expect(next.formatDenial({ reason: 'r', command: SECRET_COMMAND })).not.toContain(TOKEN);
  });

  test('the projection carries the decision, and the evidence only when the host asked for it', () => {
    const options = [
      { includeEvidence: true },
      { includeEvidence: false },
      { includeEvidence: true, toolName: 'Read' },
      { includeEvidence: false, toolName: 'Bash' },
      { includeEvidence: true, toolName: '' },
    ] as const;
    for (const option of options) {
      expect(next.projectGuardDenial({ decision: { kind: 'allow' } }, option)).toBeUndefined();
    }

    const decision = deny(
      'Reason',
      'hard_stop',
      [
        { command: 'first', segment: 'one' },
        { command: 'second', segment: 'two' },
      ],
      'test.rule',
    );
    expect(
      next.projectGuardDenial({ decision }, { includeEvidence: true, toolName: 'Bash' }),
    ).toEqual({
      reason: 'Reason',
      ruleId: 'test.rule',
      intent: 'hard_stop',
      command: 'first',
      segment: 'one',
      toolName: 'Bash',
    });
    expect(next.projectGuardDenial({ decision }, { includeEvidence: false })).toEqual({
      reason: 'Reason',
      ruleId: 'test.rule',
      intent: 'hard_stop',
      command: undefined,
      segment: undefined,
      toolName: undefined,
    });
    expect(
      next.projectGuardDenial(
        { decision: deny('Bare', 'scope_down', []) },
        { includeEvidence: true },
      ),
    ).toEqual({
      reason: 'Bare',
      ruleId: undefined,
      intent: 'scope_down',
      command: undefined,
      segment: undefined,
      toolName: undefined,
    });
    expect(
      next.projectGuardDenial(
        { decision: deny('No segment', 'scope_down', [{ command: 'find . -delete' }]) },
        { includeEvidence: true },
      )?.segment,
    ).toBeUndefined();
    expect(
      next.projectGuardDenial(
        {
          decision: deny('Unrelated', 'manual_only', [{ command: 'git reset --hard' }]),
          configFallback: { reason: 'digest mismatch' },
        },
        { includeEvidence: true },
      )?.configWarning,
    ).toBe('digest mismatch');
    for (const intent of BLOCK_INTENTS) {
      expect(
        next.projectGuardDenial({ decision: deny('r', intent, []) }, { includeEvidence: false })
          ?.intent,
      ).toBe(intent);
    }
  });

  test('a projected denial renders the same frame the formatter promises', () => {
    expect(
      next.formatDenial(
        next.projectGuardDenial(
          {
            decision: deny(
              'Secrets in every field',
              'hard_stop',
              [{ command: SECRET_COMMAND, segment: 'git push --force origin main' }],
              'secret.token',
            ),
            configFallback: { reason: SECRET_CONFIG },
          },
          { includeEvidence: true, toolName: 'Bash' },
        ) ?? { reason: 'unreachable' },
      ),
    ).toBe(
      [
        'BLOCKED by CC Safety Net',
        'Reason: Secrets in every field',
        'Rule: secret.token',
        'Tool: Bash',
        'Command: GITHUB_TOKEN=<redacted> git push --force origin main',
        'Segment: git push --force origin main',
        'Config warning: invalid policy config: token <redacted>',
        FOOTERS.hard_stop,
      ].join('\n\n'),
    );
  });

  test('an arbitrary corpus command reaches the reader intact, up to the cap', () => {
    const commands = corpusStrings();
    expect(commands).toHaveLength(93);
    for (const command of commands) {
      const rendering = next.formatDenial({
        reason: 'Corpus command',
        intent: 'hard_stop',
        command,
        segment: command.slice(0, Math.ceil(command.length / 2)),
        toolName: 'Bash',
      });
      expect(
        rendering.startsWith(
          'BLOCKED by CC Safety Net\n\nReason: Corpus command\n\nTool: Bash\n\n',
        ),
        command,
      ).toBe(true);
      expect(rendering.endsWith(FOOTERS.hard_stop), command).toBe(true);
      if (command === '') continue;
      expect(rendering, command).toContain(`Command: ${command.slice(0, 200)}`);
    }
  });

  test('the failed-closed denial names the budget reason whatever it is handed', () => {
    for (const option of [
      {},
      { command: 'rm -rf /' },
      { command: 'rm -rf /', toolName: 'Bash' },
      { command: 'a && b', segment: 'b', toolName: 'Write' },
      { segment: 'orphan segment' },
      { command: SECRET_COMMAND },
    ]) {
      const denial = next.createFailedClosedDenial(option);
      expect(denial.reason).toBe(REASON_SAFETY_NET_FAILED_CLOSED);
      expect(denial.intent).toBe('stop_and_explain');
      expect(denial.segment).toBe(option.segment ?? option.command);
      expect(next.formatDenial(denial)).not.toContain(TOKEN);
    }
    expect(next.createFailedClosedDenial()).toEqual(next.createFailedClosedDenial({}));
    expect(next.formatDenial(next.createFailedClosedDenial({ command: 'rm -rf /' }))).toBe(
      [
        'BLOCKED by CC Safety Net',
        `Reason: ${REASON_SAFETY_NET_FAILED_CLOSED}`,
        'Command: rm -rf /',
        FOOTERS.stop_and_explain,
      ].join('\n\n'),
    );
  });

  test('an integration error reports its message, and anything else its string form', () => {
    expect(next.formatIntegrationError(new Error(`boom ${SECRET_COMMAND}`))).toBe(
      'boom GITHUB_TOKEN=<redacted> git push --force origin main',
    );
    expect(next.formatIntegrationError(new TypeError('typed'))).toBe('typed');
    expect(next.formatIntegrationError(`string cause with ${TOKEN}`)).toBe(
      'string cause with <redacted>',
    );
    expect(next.formatIntegrationError(42)).toBe('42');
    expect(next.formatIntegrationError(null)).toBe('null');
    expect(next.formatIntegrationError(undefined)).toBe('undefined');
    expect(next.formatIntegrationError({ message: 'object' })).toBe('[object Object]');
  });
});
