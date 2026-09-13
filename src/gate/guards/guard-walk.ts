import type { Budget } from '@/core/budget';
import { normalizeProtectedPathCandidate } from '@/core/paths/canonicalization';
import {
  type CommandNode,
  type CommandProgram,
  type CommandRedirection,
  type CommandSpan,
  type CommandView,
  type CommandWord,
  getCalledCommandName,
} from '@/core/shell/model';
import { DEFAULT_COMMAND_PARSER_LIMITS, parseCommand } from '@/core/shell/parse';
import { getBasename, hasUnclosedQuotes } from '@/core/shell/tokens';
import type { EnvironmentContext } from '@/gate/analysis';
import { stripWrappers } from '@/gate/analyzer/wrapper-prelude';

export type GuardSyntax = Readonly<{
  status: 'complete' | 'unclosed-quote' | 'invalid' | 'structural-limit';

  source: string;
  program: CommandProgram;
  assignmentFallbacks: readonly string[];
}>;

export type ProtectedPathShellState = Readonly<{
  cwd: string;
  variables: ReadonlyMap<string, string>;

  previous: string | null;
}>;

type GuardRedirection = Readonly<{
  operator: string;
  role: 'file-read' | 'file-write' | 'here-data';
  targetOrder: 'immediate' | 'legacy-segment';
  target: string;
  body?: string;
  consumer?: readonly string[];
}>;

export const ADOPT_AS_OPERAND: unique symbol = Symbol('adopt-as-operand');

export type GuardWalkVisitor = Readonly<{
  word: (text: string) => string;
  segment: (
    tokens: readonly string[],
    state: ProtectedPathShellState,
    pipeProducer: readonly string[] | null,
    boundary: string | null,
    shellWords: ReadonlySet<number>,
  ) => string | null;
  redirection: (
    redirection: GuardRedirection,
    state: ProtectedPathShellState,
  ) => string | null | typeof ADOPT_AS_OPERAND;
}>;

export type GuardToken =
  | { readonly kind: 'word'; readonly text: string }
  | { readonly kind: 'operator'; readonly boundary: boolean }
  | { readonly kind: 'redirection'; readonly target: string | undefined };

type GuardEvent =
  | { readonly kind: 'word'; readonly text: string }
  | { readonly kind: 'operator'; readonly operator: string; readonly boundary: boolean }
  | {
      readonly kind: 'redirection';
      readonly operator: string;
      readonly fd?: number;
      readonly role: 'file-read' | 'file-write' | 'here-data';
      readonly targetOrder: 'immediate' | 'legacy-segment';
      readonly target?: string;
      readonly body?: string;
      readonly consumer?: readonly string[];
    }
  | { readonly kind: 'scope'; readonly edge: 'enter' | 'exit' };

const HEREDOC_CONSUMER_WRAPPERS = new Set(['env', 'sudo', 'command', 'builtin']);

const LEGACY_BOUNDARIES = new Set(['&&', '||', '|&', '|', '&', ';']);
const LEGACY_SEGMENT_REDIRECTS = new Set(['<<', '<<<', '>|']);
const PIPE_OPERATORS = new Set(['|', '|&']);
const SPECIAL_VARIABLE_NAME = /[*@#?$!_-]/;

const POWERSHELL_VARIABLE_NAME = /^\w+(?::\w+)*/;
const EMPTY_EVENTS = Object.freeze([]) as readonly GuardEvent[];
const SCOPE_ENTER: GuardEvent = Object.freeze({ kind: 'scope' as const, edge: 'enter' });
const SCOPE_EXIT: GuardEvent = Object.freeze({ kind: 'scope' as const, edge: 'exit' });
const EMPTY_STRINGS = Object.freeze([]) as readonly string[];

const CODE_INTERPRETERS = new Set([
  'python',
  'python2',
  'python3',
  'node',
  'deno',
  'bun',
  'ruby',
  'perl',
  'php',
  'rscript',
  'osascript',
  'bash',
  'sh',
  'zsh',
  'dash',
  'ksh',
]);

export const SHELL_STDIN_INTERPRETERS = new Set(['bash', 'sh', 'zsh', 'dash', 'ksh']);

const MAX_FUNCTION_EXPANSIONS = 256;

const READ_EVENTS = new WeakMap<GuardSyntax, readonly GuardEvent[]>();

type ReadFlags = {
  invalid: boolean;
  limited: boolean;
  expansions: number;
  assignmentFallbacks: string[];
};

type ReadContext = {
  readonly source: string;
  readonly suppressed: ReadonlySet<CommandSpan>;
  readonly flags: ReadFlags;
  readonly depth: number;
  readonly functions: Map<string, CommandProgram>;
  readonly powershell: boolean;
};

type QuoteState = { single: boolean; double: boolean };

type PositionedEvents = { readonly start: number; readonly events: readonly GuardEvent[] };

export function readGuardSyntax(source: string, program: CommandProgram): GuardSyntax {
  const suppressed =
    program.status === 'complete'
      ? new Set(collectDataSinkHeredocSpans(program))
      : new Set<CommandSpan>();
  const masked = maskSpans(source, suppressed);
  if (hasUnclosedQuotes(masked)) return freezeSyntax('unclosed-quote', masked, program);
  const flags: ReadFlags = {
    invalid: false,
    limited: false,
    expansions: 0,
    assignmentFallbacks: [],
  };
  const events = readProgram(program, {
    source: masked,
    suppressed,
    flags,
    depth: 0,
    functions: new Map(),
    powershell: program.dialect === 'powershell',
  });
  if (flags.limited) return freezeSyntax('structural-limit', masked, program);
  if (flags.invalid) return freezeSyntax('invalid', masked, program);
  const syntax = freezeSyntax('complete', masked, program, flags.assignmentFallbacks);
  READ_EVENTS.set(syntax, Object.freeze(events));
  return syntax;
}

export function walkGuardSyntax(
  syntax: GuardSyntax,
  cwd: string,
  environment: EnvironmentContext,
  budget: Budget,
  visitor: GuardWalkVisitor,
): string | null {
  let state: ProtectedPathShellState = { cwd, variables: new Map(), previous: null };
  let segment: string[] = [];
  let shellWords = new Set<number>();
  let pipeProducer: string[] | null = null;
  const frames: {
    readonly state: ProtectedPathShellState;
    readonly segment: string[];
    readonly shellWords: Set<number>;
    readonly pipeProducer: string[] | null;
  }[] = [];
  for (const event of guardEvents(syntax)) {
    if (event.kind === 'scope') {
      if (event.edge === 'enter') {
        frames.push({
          state,
          segment: [...segment],
          shellWords: new Set(shellWords),
          pipeProducer,
        });
        continue;
      }
      const target = visitor.segment(segment, state, pipeProducer, null, shellWords);
      if (target) return target;
      const frame = frames.pop();
      if (frame === undefined) throw new Error('scope exit without a matching enter');
      state = frame.state;
      segment = frame.segment;
      shellWords = frame.shellWords;
      pipeProducer = frame.pipeProducer;
      continue;
    }
    if (event.kind === 'operator') {
      if (!event.boundary) continue;
      const target = visitor.segment(segment, state, pipeProducer, event.operator, shellWords);
      if (target) return target;
      state = applyShellState(segment, state, environment, budget);
      pipeProducer = segment.length > 0 && PIPE_OPERATORS.has(event.operator) ? segment : null;
      segment = [];
      shellWords = new Set();
      continue;
    }
    if (event.kind === 'redirection') {
      if (event.fd !== undefined) shellWords.add(segment.length - 1);
      if (event.target === undefined) continue;
      const outcome = visitor.redirection(
        {
          operator: event.operator,
          role: event.role,
          targetOrder: event.targetOrder,
          target: event.target,
          ...(event.body === undefined ? {} : { body: event.body, consumer: event.consumer }),
        },
        state,
      );
      if (outcome === ADOPT_AS_OPERAND) {
        shellWords.add(segment.length);
        segment.push(visitor.word(event.target));
        continue;
      }
      if (outcome) return outcome;
      continue;
    }
    segment.push(visitor.word(event.text));
  }
  return visitor.segment(segment, state, pipeProducer, null, shellWords);
}

export function readGuardTokens(syntax: GuardSyntax): readonly GuardToken[] {
  return guardEvents(syntax).flatMap((event): GuardToken[] => {
    if (event.kind === 'word') return [{ kind: 'word', text: event.text }];
    if (event.kind === 'operator') return [{ kind: 'operator', boundary: event.boundary }];
    if (event.kind === 'redirection') return [{ kind: 'redirection', target: event.target }];
    return [];
  });
}

export function expandTrackedShellVariables(
  text: string,
  variables: ReadonlyMap<string, string>,
): string {
  return text
    .replace(
      /\$\{([A-Za-z_][A-Za-z0-9_]*)(:?[-+])([^}]*)\}/g,
      (match, name: string, operator: string, word: string) => {
        const value = variables.get(name);
        if (value === undefined) return match;
        const usable = operator.startsWith(':') ? value !== '' : true;
        if (operator.endsWith('-')) {
          return usable ? value : expandTrackedShellVariables(word, variables);
        }
        return usable ? expandTrackedShellVariables(word, variables) : '';
      },
    )
    .replace(
      /\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g,
      (match, name: string) => variables.get(name) ?? match,
    )
    .replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (match, name: string) => variables.get(name) ?? match);
}

export function isAssignmentOnlySegment(tokens: readonly string[]): boolean {
  return tokens.length > 0 && tokens.every((token) => /^[A-Za-z_][A-Za-z0-9_]*=.*/.test(token));
}

function applyShellState(
  segment: readonly string[],
  state: ProtectedPathShellState,
  environment: EnvironmentContext,
  budget: Budget,
): ProtectedPathShellState {
  const variables = isAssignmentOnlySegment(segment)
    ? new Map([...state.variables, ...extractShellAssignments(segment, state.variables)])
    : state.variables;
  const stripped = stripWrappers([...segment], environment);
  const target = getBasename(stripped[0] ?? '').toLowerCase() === 'cd' ? stripped[1] : undefined;
  if (!target) return { ...state, variables };
  if (target === '-') {
    if (state.previous === null) return { ...state, variables };
    return { cwd: state.previous, variables, previous: state.cwd };
  }
  return {
    cwd: normalizeProtectedPathCandidate(
      expandTrackedShellVariables(target, variables),
      state.cwd,
      environment,
      budget,
    ),
    variables,
    previous: state.cwd,
  };
}

function extractShellAssignments(
  segment: readonly string[],
  variables: ReadonlyMap<string, string>,
): readonly [string, string][] {
  return segment.flatMap((token): [string, string][] => {
    const assignment = /^([A-Za-z_][A-Za-z0-9_]*)(.*)$/.exec(token);
    const value = assignment?.[2]?.startsWith('=') ? assignment[2].slice(1) : undefined;
    return assignment?.[1] !== undefined && value !== undefined
      ? [[assignment[1], expandTrackedShellVariables(value, variables)]]
      : [];
  });
}

function guardEvents(syntax: GuardSyntax): readonly GuardEvent[] {
  return READ_EVENTS.get(syntax) ?? EMPTY_EVENTS;
}

function maskSpans(source: string, spans: ReadonlySet<CommandSpan>): string {
  return [...spans].reduce(
    (text, span) =>
      text.slice(0, span.start) + ' '.repeat(span.end - span.start) + text.slice(span.end),
    source,
  );
}

function freezeSyntax(
  status: GuardSyntax['status'],
  source: string,
  program: CommandProgram,
  assignmentFallbacks: readonly string[] = EMPTY_STRINGS,
): GuardSyntax {
  return Object.freeze({
    status,
    source,
    program,
    assignmentFallbacks: Object.freeze(assignmentFallbacks),
  });
}

function readProgram(program: CommandProgram, context: ReadContext): GuardEvent[] {
  return program.nodes
    .flatMap((node, index) => readNode(node, program, index, context))
    .sort((left, right) => left.start - right.start)
    .flatMap((item) => [...item.events]);
}

function readNode(
  node: CommandNode,
  program: CommandProgram,
  index: number,
  context: ReadContext,
): PositionedEvents[] {
  if (node.kind === 'connector') {
    return [{ start: node.span.start, events: [operatorEvent(normalizeConnector(node.operator))] }];
  }
  if (node.kind === 'unknown') {
    return [{ start: node.span.start, events: [operatorEvent(node.source)] }];
  }
  if (node.kind === 'function') {
    context.functions.set(node.name, node.body);
    return [];
  }
  if (node.kind === 'group') {
    const brace = node.style !== 'subshell';
    const closed = context.source[node.span.end - 1] === (brace ? '}' : ')');
    const groupContext = brace ? context : { ...context, functions: new Map(context.functions) };
    return [
      {
        start: node.span.start,
        events: brace
          ? [
              boundaryOperatorEvent('{'),
              ...readProgram(node.body, groupContext),
              ...(closed ? [boundaryOperatorEvent('}')] : []),
            ]
          : [
              SCOPE_ENTER,
              operatorEvent('('),
              ...readProgram(node.body, groupContext),
              ...(closed ? [operatorEvent(')')] : []),
              SCOPE_EXIT,
            ],
      },
    ];
  }
  const functionBody = getCalledFunctionBody(node, context.functions);
  if (functionBody) {
    if (
      context.depth >= DEFAULT_COMMAND_PARSER_LIMITS.maxDepth ||
      ++context.flags.expansions > MAX_FUNCTION_EXPANSIONS
    ) {
      context.flags.limited = true;
      return [];
    }
    return [
      {
        start: node.span.start,
        events: [
          ...readView(node, context),
          boundaryOperatorEvent(';'),
          ...readProgram(functionBody, { ...context, depth: context.depth + 1 }),
          boundaryOperatorEvent(';'),
        ],
      },
      ...readHeredocs(node, program, index, context),
    ];
  }
  return [
    { start: node.span.start, events: readView(node, context) },
    ...readHeredocs(node, program, index, context),
  ];
}

function readView(view: CommandView, context: ReadContext): GuardEvent[] {
  return [
    ...view.words.map((word) => ({
      start: word.span.start,
      events: readWord(word, view, context, false),
    })),
    ...view.redirections.map((redirection) => ({
      start: redirection.span.start,
      events: readRedirection(redirection, view, context),
    })),
  ]
    .sort((left, right) => left.start - right.start)
    .flatMap((item) => item.events);
}

function readRedirection(
  redirection: CommandRedirection,
  view: CommandView,
  context: ReadContext,
): GuardEvent[] {
  const operator = redirection.operator === '<<-' ? '<<' : redirection.operator;
  const targetEvents = redirection.target ? readWord(redirection.target, view, context, true) : [];
  const first = targetEvents[0];
  const target = first?.kind === 'word' ? first.text : undefined;
  return [
    ...(redirection.fd === undefined ? [] : [wordEvent(String(redirection.fd))]),
    Object.freeze({
      kind: 'redirection' as const,
      operator,
      ...(redirection.fd === undefined ? {} : { fd: redirection.fd }),
      role: getRedirectionRole(operator),
      targetOrder: LEGACY_SEGMENT_REDIRECTS.has(operator)
        ? ('legacy-segment' as const)
        : ('immediate' as const),
      ...(target === undefined ? {} : { target }),
      ...(redirection.heredoc && context.suppressed.has(redirection.heredoc.bodySpan)
        ? { body: redirection.heredoc.body, consumer: heredocConsumerWords(view) }
        : {}),
    }),
    ...(target === undefined ? targetEvents : targetEvents.slice(1)),
  ];
}

function readHeredocs(
  view: CommandView,
  program: CommandProgram,
  index: number,
  context: ReadContext,
): PositionedEvents[] {
  const heredocs = view.redirections.filter(
    (redirection) => redirection.operator === '<<' || redirection.operator === '<<-',
  );
  return [
    ...heredocs.flatMap((redirection): PositionedEvents[] => {
      const heredoc = redirection.heredoc;
      if (!heredoc) return [];

      const terminator = [
        wordEvent(heredoc.delimiter),
        ...(/[\r\n]/.test(context.source[heredoc.terminatorSpan.end] ?? '')
          ? [operatorEvent(';')]
          : []),
      ];
      if (context.suppressed.has(heredoc.bodySpan)) {
        return [{ start: heredoc.bodySpan.start, events: terminator }];
      }
      return [
        {
          start: heredoc.bodySpan.start,
          events: [
            ...readText(
              context.source.slice(heredoc.bodySpan.start, heredoc.bodySpan.end),
              context,
            ),
            ...terminator,
          ],
        },
      ];
    }),

    ...(heredocs.some((redirection) => !redirection.heredoc && redirection.target)
      ? readUnterminatedHeredoc(program, index, context)
      : []),
  ];
}

function readUnterminatedHeredoc(
  program: CommandProgram,
  index: number,
  context: ReadContext,
): PositionedEvents[] {
  const connector = program.nodes.slice(index + 1).find((node) => node.kind === 'connector');
  if (!connector || connector.span.end >= program.span.end) return [];
  return [
    {
      start: connector.span.end,
      events: readText(context.source.slice(connector.span.end, program.span.end), context),
    },
  ];
}

function readText(text: string, context: ReadContext): GuardEvent[] {
  if (context.depth >= DEFAULT_COMMAND_PARSER_LIMITS.maxDepth) {
    context.flags.limited = true;
    return [];
  }
  const program = parseCommand(text, 'posix');
  if (program.status === 'limited') {
    context.flags.limited = true;
    return [];
  }

  const flags: ReadFlags = {
    invalid: false,
    limited: false,
    expansions: context.flags.expansions,
    assignmentFallbacks: context.flags.assignmentFallbacks,
  };
  const events = readProgram(program, {
    source: text,
    suppressed: new Set<CommandSpan>(),
    flags,
    depth: context.depth + 1,
    functions: new Map(),
    powershell: false,
  });
  context.flags.limited ||= flags.limited;
  context.flags.expansions = flags.expansions;
  return events;
}

function readWord(
  word: CommandWord,
  view: CommandView,
  context: ReadContext,
  keepGlobText: boolean,
): GuardEvent[] {
  const events: GuardEvent[] = [];
  const state: QuoteState = { single: false, double: false };
  let pending = '';
  let glob = false;
  const flush = () => {
    const event =
      glob && !keepGlobText
        ? operatorEvent('glob')
        : pending !== '' || (word.quoted && events.length === 0)
          ? wordEvent(pending)
          : undefined;
    if (event) events.push(event);
    pending = '';
    glob = false;
  };

  for (const part of word.parts) {
    if (part.provenance !== 'command-substitution' && part.provenance !== 'arithmetic') {
      for (const run of scanWordText(part.raw, state, context.flags, context.powershell)) {
        if (typeof run === 'string') {
          flush();
          events.push(operatorEvent(run));
          continue;
        }
        pending += run.text;
        glob ||= run.glob;
      }
      continue;
    }

    const nested = view.nested.find(
      (program) => program.span.start >= part.span.start && program.span.end <= part.span.end,
    );
    if (state.double) {
      const quotedText = context.source.slice(part.span.start, part.span.end);
      pending += scanWordText(
        quotedText,
        { single: false, double: true },
        context.flags,
        context.powershell,
      )
        .map((run) => (typeof run === 'string' ? run : run.text))
        .join('');
      // The substitution stays word text, but a heredoc body its command hands over is masked
      // out of that text, so the handover events still have to reach the consumer.
      const handovers = nested
        ? readProgram(nested, context).filter(
            (event) => event.kind === 'redirection' && event.body !== undefined,
          )
        : [];
      if (handovers.length > 0) events.push(SCOPE_ENTER, ...handovers, SCOPE_EXIT);
      continue;
    }
    const inner = nested ? readProgram(nested, context) : [];
    if (part.raw.startsWith('`')) {
      pending += '${}';
      flush();
      events.push(SCOPE_ENTER, ...inner, SCOPE_EXIT);
      continue;
    }
    if (part.raw.startsWith('<(') || part.raw.startsWith('>(')) {
      flush();
      events.push(
        part.raw.startsWith('<(')
          ? operatorEvent('<(')
          : Object.freeze({
              kind: 'redirection' as const,
              operator: '>',
              role: 'file-write' as const,
              targetOrder: 'immediate' as const,
            }),
        SCOPE_ENTER,
        ...inner,
        ...(part.raw.endsWith(')') ? [operatorEvent(')')] : []),
        SCOPE_EXIT,
      );
      continue;
    }

    const frames = part.raw.startsWith('$((') ? 2 : 1;
    pending += '${}';
    flush();
    events.push(
      ...Array.from({ length: frames }, () => operatorEvent('(')),
      ...(frames === 1 ? [SCOPE_ENTER] : []),
      ...inner,
      ...(part.raw.endsWith(')'.repeat(frames))
        ? Array.from({ length: frames }, () => operatorEvent(')'))
        : []),
      ...(frames === 1 ? [SCOPE_EXIT] : []),
    );
  }
  flush();
  return events;
}

function scanWordText(
  raw: string,
  state: QuoteState,
  flags: ReadFlags,
  powershell: boolean,
): ({ text: string; glob: boolean } | string)[] {
  const runs: ({ text: string; glob: boolean } | string)[] = [];
  let text = '';
  let glob = false;
  let index = 0;
  while (index < raw.length) {
    const char = raw[index] ?? '';
    if (!state.single && !state.double && (char === '(' || char === ')')) {
      runs.push({ text, glob }, char);
      text = '';
      glob = false;
      index++;
      continue;
    }

    if (powershell && char === '`' && !state.single) {
      text += raw[index + 1] ?? '';
      index += 2;
      continue;
    }
    if (state.single && char === "'") {
      state.single = false;
      index++;
      continue;
    }
    if (state.single) {
      text += char;
      index++;
      continue;
    }
    if (state.double) {
      if (char === '"') {
        state.double = false;
        index++;
        continue;
      }
      if (!powershell && char === '\\') {
        const escaped = raw[index + 1] ?? '';
        text += ['"', '\\', '$'].includes(escaped) ? escaped : `\\${escaped}`;
        index += 2;
        continue;
      }
      if (char === '$') {
        const expansion = readExpansion(raw, index, state, flags, powershell);
        text += expansion.text;
        index = expansion.next;
        continue;
      }
      text += char;
      index++;
      continue;
    }
    if (char === "'" || char === '"') {
      state.single = char === "'";
      state.double = char === '"';
      index++;
      continue;
    }
    if (!powershell && char === '\\') {
      const escaped = raw[index + 1] ?? '';
      glob ||= escaped === '*' || escaped === '?';
      text += escaped;
      index += 2;
      continue;
    }
    if (char === '$') {
      const expansion = readExpansion(raw, index, state, flags, powershell);
      text += expansion.text;
      index = expansion.next;
      continue;
    }
    glob ||= char === '*' || char === '?';
    text += char;
    index++;
  }
  return [...runs, { text, glob }];
}

function readExpansion(
  raw: string,
  start: number,
  state: QuoteState,
  flags: ReadFlags,
  powershell: boolean,
) {
  const char = raw[start + 1];
  if (char === '{') {
    const close = findExpansionClose(raw, start + 2);
    if (close === -1) {
      flags.invalid = true;
      return { text: '', next: raw.length };
    }
    const expansion = raw.slice(start, close + 1);
    collectAssignmentFallback(expansion, state, flags, powershell);
    return { text: expansion, next: close + 1 };
  }
  if (char !== undefined && SPECIAL_VARIABLE_NAME.test(char)) {
    return { text: `\${${char}}`, next: start + 2 };
  }
  const name =
    (powershell ? POWERSHELL_VARIABLE_NAME : /^\w*/).exec(raw.slice(start + 1))?.[0] ?? '';
  return { text: `\${${name}}`, next: start + 1 + name.length };
}

function collectAssignmentFallback(
  expansion: string,
  state: QuoteState,
  flags: ReadFlags,
  powershell: boolean,
): void {
  const content = expansion.slice(2, -1);
  const name = /^[A-Za-z_][A-Za-z0-9_]*/.exec(content)?.[0];
  if (!name) return;
  const suffix = content.slice(name.length);
  const operator = [':=', '='].find((candidate) => suffix.startsWith(candidate));
  if (!operator) return;
  const runs = scanWordText(suffix.slice(operator.length), { ...state }, flags, powershell);
  flags.assignmentFallbacks.push(
    ...runs.flatMap((run) => (typeof run === 'string' || !run.text ? [] : [run.text])),
  );
}

function findExpansionClose(raw: string, start: number): number {
  let depth = 1;
  let index = start;
  while (depth > 0 && index < raw.length) {
    if (raw[index] === '{' && raw[index - 1] === '$') depth++;
    if (raw[index] === '}') depth--;
    index++;
  }
  return depth === 0 ? index - 1 : -1;
}

function normalizeConnector(operator: string): string {
  return /^[\r\n]+$/.test(operator) ? ';' : operator;
}

function operatorEvent(operator: string): GuardEvent {
  return Object.freeze({
    kind: 'operator' as const,
    operator,
    boundary: LEGACY_BOUNDARIES.has(operator),
  });
}

function boundaryOperatorEvent(operator: string): GuardEvent {
  return Object.freeze({ kind: 'operator' as const, operator, boundary: true });
}

function wordEvent(text: string): GuardEvent {
  return Object.freeze({ kind: 'word' as const, text });
}

function getRedirectionRole(operator: string) {
  if (operator === '<<' || operator === '<<<') return 'here-data' as const;
  if (operator === '<' || operator === '<&') return 'file-read' as const;
  return 'file-write' as const;
}

export function isCodeInterpreter(command: string): boolean {
  return CODE_INTERPRETERS.has(command) || /^python\d/.test(command);
}

// The words of the command that owns a heredoc, from the called name on. `time`, `-p`, `--`
// and `!` are dropped here; `env`/`sudo` and assignments stay for the consumer to strip.
function heredocConsumerWords(view: CommandView): string[] {
  const name = getCalledCommandName(view);
  const start = view.words.findIndex((word) => word.provenance === 'literal' && word.text === name);
  return start < 0 ? [] : view.words.slice(start).map((word) => word.text);
}

function isCodeInterpreterHeredocConsumer(view: CommandView): boolean {
  const name = heredocConsumerWords(view).find(
    (word) => !HEREDOC_CONSUMER_WRAPPERS.has(word) && !/^[A-Za-z_][A-Za-z0-9_]*=/.test(word),
  );
  if (name === undefined) return false;
  const command = getBasename(name).toLowerCase();
  return isCodeInterpreter(command) && !SHELL_STDIN_INTERPRETERS.has(command);
}

function collectDataSinkHeredocSpans(program: CommandProgram): CommandSpan[] {
  return program.nodes.flatMap((node, index): CommandSpan[] => {
    if (node.kind === 'group' || node.kind === 'function') {
      return collectDataSinkHeredocSpans(node.body);
    }
    if (node.kind !== 'command') return [];
    const nestedSpans = node.nested.flatMap((nested) => collectDataSinkHeredocSpans(nested));
    const quotedBodies = node.redirections.flatMap((redirection) =>
      redirection.heredoc?.quotedDelimiter ? [redirection.heredoc.bodySpan] : [],
    );
    // An interpreter reads its heredoc as code, so shell-reading the body invents shell words.
    if (isCodeInterpreterHeredocConsumer(node)) return [...nestedSpans, ...quotedBodies];
    const next = program.nodes[index + 1];
    const piped = next?.kind === 'connector' && (next.operator === '|' || next.operator === '|&');
    if (piped || !isDataSinkHeredocConsumer(node)) return nestedSpans;
    return [...nestedSpans, ...quotedBodies];
  });
}

function getCalledFunctionBody(
  view: CommandView,
  functions: ReadonlyMap<string, CommandProgram>,
): CommandProgram | undefined {
  const name = getCalledCommandName(view);
  return name === undefined ? undefined : functions.get(name);
}

function isBareWord(word: CommandWord | undefined, text: string): boolean {
  return (
    word !== undefined &&
    word.provenance === 'literal' &&
    !word.quoted &&
    word.raw === word.text &&
    word.text === text
  );
}

function isMessageSinkConsumer(view: CommandView): boolean {
  if (isBareWord(view.words[0], 'git')) return isBareWord(view.words[1], 'commit');
  if (!isBareWord(view.words[0], 'gh') || !isBareWord(view.words[2], 'create')) return false;
  return isBareWord(view.words[1], 'pr') || isBareWord(view.words[1], 'issue');
}

function isDataSinkHeredocConsumer(view: CommandView): boolean {
  const isDataSink =
    isBareWord(view.words[0], 'cat') ||
    isBareWord(view.words[0], 'tee') ||
    isMessageSinkConsumer(view);
  return (
    isDataSink &&
    !view.words.some(hasOutputProcessSubstitution) &&
    !view.redirections.some((redirection) => hasOutputProcessSubstitution(redirection.target))
  );
}

function hasOutputProcessSubstitution(word: CommandWord | undefined): boolean {
  return (
    word?.parts.some(
      (part) => part.provenance === 'command-substitution' && part.raw.startsWith('>('),
    ) ?? false
  );
}
