import { describe, expect, test } from 'bun:test';
import {
  type CommandTraceEvent,
  type CommandTraceTerminal,
  createCommandTraceContext as createPortedContext,
  createCommandTraceRecorder as createPortedRecorder,
  type TraceStep,
} from '@/gate/trace';

type RecorderOptions = Parameters<typeof createPortedRecorder>[0];

const PORTED = { recorder: createPortedRecorder, context: createPortedContext };

const SECRETS = [
  'hunter2',
  'derived-value-9',
  'ghp_abcdefghijklmnopqrstuvwxyz012345',
  'AKIAIOSFODNN7EXAMPLE',
  'Bearer top-secret',
  'admin:swordfish',
  'eyJhbGciOiJIUzI1NiJ9.c2lnbmVk.c2lnbmVk',
];

const globalEvent = (step: TraceStep): CommandTraceEvent => ({
  kind: 'step',
  scope: 'global',
  step,
});

const segmentEvent = (segmentIndex: number, step: TraceStep): CommandTraceEvent => ({
  kind: 'step',
  scope: 'segment',
  segmentIndex,
  step,
});

function cyclicEvent(): CommandTraceEvent {
  const step: Record<string, unknown> = { type: 'error', message: 'AWS_KEY=derived-value-9' };
  step.self = step;
  step.nested = { deeper: { deepest: ['derived-value-9', 'AKIAIOSFODNN7EXAMPLE'] } };
  return globalEvent(step as unknown as TraceStep);
}

const EVENTS: readonly CommandTraceEvent[] = [
  globalEvent({
    type: 'parse',
    input:
      'AWS_KEY=derived-value-9 PASSWORD=hunter2 curl -u admin:swordfish https://api.example.com',
    segments: [['derived-value-9'], ['ghp_abcdefghijklmnopqrstuvwxyz012345'], ['echo', 'ok']],
  }),
  globalEvent({
    type: 'env-strip',
    input: ['PASSWORD=hunter2', 'git', 'status'],
    envVars: ['PASSWORD'],
    output: ['git', 'status'],
  }),
  globalEvent({
    type: 'leading-tokens-stripped',
    input: ['sudo', '-u', 'root', '--', 'rm', '-rf', '/'],
    removed: ['sudo', '-u', 'root', '--'],
    output: ['rm', '-rf', '/'],
  }),
  globalEvent({ type: 'shell-wrapper', wrapper: 'bash', innerCommand: 'rm -rf /tmp/x' }),
  globalEvent({
    type: 'interpreter',
    interpreter: 'python3',
    codeArg: 'import os; os.environ["TOKEN"]="hunter2"',
    paranoidBlocked: true,
  }),
  globalEvent({ type: 'busybox', subcommand: 'rm' }),
  globalEvent({ type: 'transparent-wrapper', wrapper: 'env', output: ['rm', '-rf', '.'] }),
  globalEvent({ type: 'recurse', reason: 'shell-wrapper', innerCommand: 'rm -rf /', depth: 1 }),
  globalEvent({ type: 'recurse', reason: 'heredoc-file', innerCommand: 'cat <<EOF', depth: 4 }),
  globalEvent({
    type: 'tmpdir-check',
    tmpdirValue: '/home/agent/not-temp',
    isOverriddenToNonTemp: true,
    allowTmpdirVar: false,
  }),
  globalEvent({
    type: 'strict-unparseable',
    rawCommand: 'echo "unclosed',
    reason: 'unclosed quote',
  }),
  segmentEvent(0, { type: 'rule-check', rule: 'rm-rf-root', matched: true, reason: 'Blocked' }),
  segmentEvent(0, { type: 'rule-check', rule: 'git-clean', matched: false }),
  segmentEvent(1, { type: 'worktree-relaxation', originalReason: 'discard', gitCwd: '/work/repo' }),
  segmentEvent(1, {
    type: 'fallback-scan',
    tokensScanned: ['Authorization: Bearer top-secret', 'eyJhbGciOiJIUzI1NiJ9.c2lnbmVk.c2lnbmVk'],
    embeddedCommandFound: 'rm -rf /',
  }),
  segmentEvent(2, { type: 'custom-rules-check', rulesChecked: true, matched: true, reason: 'r' }),
  segmentEvent(2, { type: 'custom-rules-check', rulesChecked: false, matched: false }),
  segmentEvent(2, { type: 'cwd-change', segment: 'cd /tmp', effectiveCwdNowUnknown: true }),
  segmentEvent(3, { type: 'dangerous-text', token: 'AKIAIOSFODNN7EXAMPLE', matched: false }),
  segmentEvent(3, { type: 'segment-skipped', index: 3, reason: 'prior-segment-blocked' }),
  segmentEvent(4, { type: 'error', message: 'boom', partial: true }),
  cyclicEvent(),
  { kind: 'step', scope: 'nowhere', step: { type: 'busybox', subcommand: 'ls' } } as never,
  undefined as never,
];

const TERMINALS: readonly CommandTraceTerminal[] = [
  { result: 'allowed' },
  { result: 'blocked', reason: 'Blocked destructive command.', segment: 'rm -rf /' },
  {
    result: 'blocked',
    reason: 'Blocked: PASSWORD=hunter2 leaked into the reason',
    segment: 'curl -u admin:swordfish https://api.example.com',
    ruleId: 'destructive-rm-rf',
  },
  { result: 'interrupted', reason: 'x', segment: 'y' } as never,
  {
    result: 'blocked',
    reason: 'r'.repeat(9_000),
    segment: 's'.repeat(9_000),
    ruleId: '',
    extra: 'ignored',
  } as never,
];

function recordAll(
  createRecorder: typeof createPortedRecorder,
  options: RecorderOptions,
  terminal: CommandTraceTerminal,
) {
  const recorder = createRecorder(options);
  EVENTS.forEach((event) => {
    recorder.record(event);
  });
  const trace = recorder.finish(terminal);
  recorder.record(EVENTS[0] as CommandTraceEvent);
  return { trace, afterFinish: recorder.finish({ result: 'allowed' }) };
}

function walkContext(module: typeof PORTED) {
  const recorder = module.recorder({ maxEvents: 16 });
  const context = module.context(recorder);
  const beforeAnySegment = context.getNextSegmentIndex();
  context.recordSegment({ type: 'busybox', subcommand: 'dropped-without-current-segment' });
  const first = context.allocateSegment();
  context.currentSegmentIndex = first;
  context.recordSegment({ type: 'rule-check', rule: 'first', matched: false });
  const second = context.allocateSegment();
  context.recordSegment({ type: 'rule-check', rule: 'explicit', matched: true }, second);
  context.recordGlobal({ type: 'parse', input: 'PASSWORD=hunter2 id', segments: [['id']] });
  return {
    beforeAnySegment,
    first,
    second,
    afterAllocation: context.getNextSegmentIndex(),
    trace: recorder.finish({ result: 'blocked', reason: 'no', segment: 'id', ruleId: 'r' }),
  };
}

const STEP_TYPES: TraceStep['type'][] = [
  'parse',
  'env-strip',
  'leading-tokens-stripped',
  'shell-wrapper',
  'interpreter',
  'busybox',
  'transparent-wrapper',
  'recurse',
  'recurse',
  'tmpdir-check',
  'strict-unparseable',
  'rule-check',
  'rule-check',
  'worktree-relaxation',
  'fallback-scan',
  'custom-rules-check',
  'custom-rules-check',
  'cwd-change',
  'dangerous-text',
  'segment-skipped',
  'error',
  'error',
];

describe('the command trace recorder', () => {
  test('keeps every well-formed event and counts the two it cannot read', () => {
    const recorded = recordAll(
      createPortedRecorder,
      undefined,
      TERMINALS[0] as CommandTraceTerminal,
    );

    expect(recorded.trace.events.map((event) => event.step.type)).toEqual(STEP_TYPES);
    expect(recorded.trace.droppedEvents).toBe(2);
    expect(recorded.trace.terminal).toEqual({ result: 'allowed' });
    expect(recorded.afterFinish).toBe(recorded.trace);
  });

  test('stops at maxEvents and counts everything past it as dropped', () => {
    const recorded = recordAll(
      createPortedRecorder,
      { maxEvents: 4 },
      TERMINALS[0] as CommandTraceTerminal,
    );

    expect(recorded.trace.events.map((event) => event.step.type)).toEqual(STEP_TYPES.slice(0, 4));
    expect(recorded.trace.droppedEvents).toBe(EVENTS.length - 4);
  });

  test('bounds the text, the lists and the properties of a step', () => {
    const bounded = recordAll(
      createPortedRecorder,
      { maxTextLength: 10, maxListLength: 2, maxDepth: 2 },
      TERMINALS[0] as CommandTraceTerminal,
    ).trace;
    const perProperty = recordAll(
      createPortedRecorder,
      { maxTextLength: 24, maxListLength: 1, maxObjectProperties: 1, maxDepth: 1 },
      TERMINALS[0] as CommandTraceTerminal,
    ).trace;

    expect(bounded.events[0]).toEqual({
      kind: 'step',
      scope: 'global',
      step: { type: 'parse', input: 'AWS_KEY=<r' },
    } as never);
    expect(perProperty.events[0]).toEqual({
      kind: 'step',
      scope: 'global',
      step: { type: 'parse' },
    } as never);
  });

  test('cuts a step off at the depth bound and never follows a cycle', () => {
    const stepAt = (options: RecorderOptions) => {
      const recorder = createPortedRecorder(options);
      recorder.record(cyclicEvent());
      return recorder.finish({ result: 'allowed' }).events[0]?.step;
    };

    expect(stepAt(undefined)).toEqual({
      type: 'error',
      message: 'AWS_KEY=<redacted>',
      nested: { deeper: { deepest: ['<redacted>', '<redacted>'] } },
    } as never);
    expect(stepAt({ maxDepth: 3 })).toEqual({
      type: 'error',
      message: 'AWS_KEY=<redacted>',
      nested: { deeper: {} },
    } as never);
  });

  test('redacts assignment, derived and provider secrets out of every recorded step', () => {
    const trace = recordAll(createPortedRecorder, undefined, TERMINALS[2] as CommandTraceTerminal);
    const serialized = JSON.stringify(trace.trace);

    expect(SECRETS.filter((secret) => serialized.includes(secret))).toEqual([]);
    expect(trace.trace.events[0]).toEqual({
      kind: 'step',
      scope: 'global',
      step: {
        type: 'parse',
        input:
          'AWS_KEY=<redacted> PASSWORD=<redacted> curl -u <redacted>:<redacted> https://api.example.com',
        segments: [['<redacted>'], ['<redacted>'], ['echo', 'ok']],
      },
    });
  });

  test('normalizes the terminal it was finished with', () => {
    const terminalOf = (terminal: CommandTraceTerminal, options?: RecorderOptions) =>
      recordAll(createPortedRecorder, options, terminal).trace;

    expect(terminalOf(TERMINALS[2] as CommandTraceTerminal).terminal).toEqual({
      result: 'blocked',
      reason: 'Blocked: PASSWORD=<redacted> leaked into the reason',
      segment: 'curl -u <redacted>:<redacted> https://api.example.com',
      ruleId: 'destructive-rm-rf',
    });
    const unreadable = terminalOf(TERMINALS[3] as CommandTraceTerminal);
    expect(unreadable.terminal).toEqual({
      result: 'blocked',
      reason: 'trace unavailable',
      segment: 'trace unavailable',
    });
    expect(unreadable.droppedEvents).toBe(3);
    expect(
      terminalOf(TERMINALS[4] as CommandTraceTerminal, { maxTextLength: 24 }).terminal,
    ).toEqual({ result: 'blocked', reason: 'r'.repeat(24), segment: 's'.repeat(24) });
  });

  test('freezes the trace, its events and its terminal', () => {
    const ported = recordAll(createPortedRecorder, {}, TERMINALS[1] as CommandTraceTerminal).trace;

    expect([
      Object.isFrozen(ported),
      Object.isFrozen(ported.events),
      Object.isFrozen(ported.events[0]?.step),
      Object.isFrozen(ported.terminal),
    ]).toEqual([true, true, true, true]);
  });

  test('allocates segments in order and routes each step to one', () => {
    expect(walkContext(PORTED)).toEqual({
      beforeAnySegment: 0,
      first: 0,
      second: 1,
      afterAllocation: 2,
      trace: {
        droppedEvents: 0,
        events: [
          {
            kind: 'step',
            scope: 'segment',
            segmentIndex: 0,
            step: { type: 'rule-check', rule: 'first', matched: false },
          },
          {
            kind: 'step',
            scope: 'segment',
            segmentIndex: 1,
            step: { type: 'rule-check', rule: 'explicit', matched: true },
          },
          {
            kind: 'step',
            scope: 'global',
            step: { type: 'parse', input: 'PASSWORD=<redacted> id', segments: [['id']] },
          },
        ],
        terminal: { result: 'blocked', reason: 'no', segment: 'id', ruleId: 'r' },
      },
    });
  });
});
