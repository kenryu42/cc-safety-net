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

/**
 * The one walk every pre-analysis guard runs over a parsed command.
 *
 * `readGuardSyntax` reads the tree once to decide whether the command is scannable at all, and
 * `walkGuardSyntax` then replays it as the linear stream of words, boundaries, redirections and
 * shell scopes the guards decide on. Word text keeps shell expansions inert (`$NAME` becomes
 * `${NAME}`) so variable tracking sees one spelling, heredoc bodies fed to inert data sinks stay
 * out of the stream, and a nested program that runs in its own shell — a subshell group, `$( )`,
 * backticks, a process substitution — saves and restores the directory state around it, while a
 * brace group, a called function body and arithmetic run in the current shell.
 *
 * The event list a walk reads is an internal detail: it is memoized per syntax so a command that
 * several guards inspect is read from the tree once, and it never leaves this module.
 */

export type GuardSyntax = Readonly<{
  status: 'complete' | 'unclosed-quote' | 'invalid' | 'structural-limit';
  /** The command source with inert heredoc bodies blanked out. */
  source: string;
  program: CommandProgram;
  assignmentFallbacks: readonly string[];
}>;

export type ProtectedPathShellState = Readonly<{
  cwd: string;
  variables: ReadonlyMap<string, string>;
  /** Where the last `cd` came from, so `cd -` can return to it. Null until one has moved. */
  previous: string | null;
}>;

type GuardRedirection = Readonly<{
  operator: string;
  role: 'file-read' | 'file-write' | 'here-data';
  targetOrder: 'immediate' | 'legacy-segment';
  target: string;
}>;

/**
 * A redirection whose target the shell reads as an operand of the segment around it (`<<`, `<<<`,
 * `>|`) rather than as a file the command opens on its own.
 */
export const ADOPT_AS_OPERAND: unique symbol = Symbol('adopt-as-operand');

export type GuardWalkVisitor = Readonly<{
  /** Maps a word before it joins the open segment; the tracked `cd` reads the mapped token. */
  word: (text: string) => string;
  /** One segment, with the state it ran under and the segment that piped into it. */
  segment: (
    tokens: readonly string[],
    state: ProtectedPathShellState,
    pipeProducer: readonly string[] | null,
    boundary: string | null,
  ) => string | null;
  redirection: (
    redirection: GuardRedirection,
    state: ProtectedPathShellState,
  ) => string | null | typeof ADOPT_AS_OPERAND;
}>;

/** The words, boundaries and redirection targets of a command, for reads that track no state. */
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
      readonly role: 'file-read' | 'file-write' | 'here-data';
      readonly targetOrder: 'immediate' | 'legacy-segment';
      readonly target?: string;
    }
  | { readonly kind: 'scope'; readonly edge: 'enter' | 'exit' };

const LEGACY_BOUNDARIES = new Set(['&&', '||', '|&', '|', '&', ';']);
const LEGACY_SEGMENT_REDIRECTS = new Set(['<<', '<<<', '>|']);
const PIPE_OPERATORS = new Set(['|', '|&']);
const SPECIAL_VARIABLE_NAME = /[*@#?$!_-]/;
// PowerShell variable names carry an optional scope or provider prefix, so `$env:USERPROFILE`
// is one name rather than `$env` followed by literal text.
const POWERSHELL_VARIABLE_NAME = /^\w+(?::\w+)*/;
const EMPTY_EVENTS = Object.freeze([]) as readonly GuardEvent[];
const SCOPE_ENTER: GuardEvent = Object.freeze({ kind: 'scope' as const, edge: 'enter' });
const SCOPE_EXIT: GuardEvent = Object.freeze({ kind: 'scope' as const, edge: 'exit' });
const EMPTY_STRINGS = Object.freeze([]) as readonly string[];
// A call site inlines the whole body, so branching recursion (`a() { a; a; }`) grows
// exponentially where the depth cap alone never triggers. Real commands call a handful of
// functions; anything past this budget fails closed instead of reading the tree dry.
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

/**
 * Reads the tree far enough to say whether the command is scannable, and remembers what it read
 * so the guards' walks over the same syntax cost one read.
 */
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

/**
 * The linear walk itself: one segment at a time, with the directory state a `cd`, an assignment
 * or a nested shell leaves behind. The first target a callback returns stops the walk, so the
 * guards keep reporting the earliest operand that matched.
 */
export function walkGuardSyntax(
  syntax: GuardSyntax,
  cwd: string,
  environment: EnvironmentContext,
  budget: Budget,
  visitor: GuardWalkVisitor,
): string | null {
  let state: ProtectedPathShellState = { cwd, variables: new Map(), previous: null };
  let segment: string[] = [];
  let pipeProducer: string[] | null = null;
  const frames: {
    readonly state: ProtectedPathShellState;
    readonly segment: string[];
    readonly pipeProducer: string[] | null;
  }[] = [];
  for (const event of guardEvents(syntax)) {
    if (event.kind === 'scope') {
      if (event.edge === 'enter') {
        frames.push({ state, segment: [...segment], pipeProducer });
        continue;
      }
      const target = visitor.segment(segment, state, pipeProducer, null);
      if (target) return target;
      const frame = frames.pop();
      if (frame === undefined) throw new Error('scope exit without a matching enter');
      state = frame.state;
      segment = frame.segment;
      pipeProducer = frame.pipeProducer;
      continue;
    }
    if (event.kind === 'operator') {
      if (!event.boundary) continue;
      const target = visitor.segment(segment, state, pipeProducer, event.operator);
      if (target) return target;
      state = applyShellState(segment, state, environment, budget);
      pipeProducer = segment.length > 0 && PIPE_OPERATORS.has(event.operator) ? segment : null;
      segment = [];
      continue;
    }
    if (event.kind === 'redirection') {
      if (event.target === undefined) continue;
      const outcome = visitor.redirection(
        {
          operator: event.operator,
          role: event.role,
          targetOrder: event.targetOrder,
          target: event.target,
        },
        state,
      );
      if (outcome === ADOPT_AS_OPERAND) {
        segment.push(visitor.word(event.target));
        continue;
      }
      if (outcome) return outcome;
      continue;
    }
    segment.push(visitor.word(event.text));
  }
  return visitor.segment(segment, state, pipeProducer, null);
}

/**
 * The same read, flattened for the checks that only ask which words and boundaries a command
 * carries — whether it is metadata-only, and whether a substitution decodes base64.
 */
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

/**
 * One segment's effect on the tracked shell state: an assignment-only segment extends the
 * variables, a `cd` after wrapper stripping moves the cwd and remembers where it came from,
 * `cd -` returns to that directory, and a bare `cd` — or a `cd -` with nothing remembered —
 * leaves the cwd where it was.
 */
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

// What `readGuardSyntax` read, remembered per syntax. A syntax it could not take whole carries
// nothing, which is why every guard decides on the status before it walks.
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
    // An explicit fd prefix (`2>&1`) is a word of its own in the stream, as the guards have
    // always seen it; folding it into the redirection would silently drop that token.
    ...(redirection.fd === undefined ? [] : [wordEvent(String(redirection.fd))]),
    Object.freeze({
      kind: 'redirection' as const,
      operator,
      role: getRedirectionRole(operator),
      targetOrder: LEGACY_SEGMENT_REDIRECTS.has(operator)
        ? ('legacy-segment' as const)
        : ('immediate' as const),
      ...(target === undefined ? {} : { target }),
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
      // The newline that closes the terminator line separates the heredoc from what follows;
      // without it the next command would join this one's segment.
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
    // A declared-but-never-terminated heredoc swallows the rest of the input; a heredoc with no
    // delimiter at all swallows nothing, so its trailing text is already an ordinary node.
    ...(heredocs.some((redirection) => !redirection.heredoc && redirection.target)
      ? readUnterminatedHeredoc(program, index, context)
      : []),
  ];
}

// An unterminated heredoc leaves its body outside the node tree: the parser stops at the
// declaration. The body text still reaches the shell, so it stays scannable here.
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

// Each re-parse resets the parser's own depth limit, so nesting across parses (heredoc bodies
// declaring further heredocs) is bounded here to keep total recursion finite.
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
  // A body is often not shell at all (code, prose), so its invalid marks stay contained: an
  // unclosed `${` aborts a real shell before anything in the text it swallows runs, which keeps
  // the surviving events faithful without failing the whole command's read.
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
    // Inside double quotes a substitution never breaks the word: its text stays inert, and the
    // nested command is still reached through the substitution scan over the source.
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
      continue;
    }
    const nested = view.nested.find(
      (program) => program.span.start >= part.span.start && program.span.end <= part.span.end,
    );
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
    // Arithmetic runs in the current shell, so only the single-frame form opens a scope.
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

// Reproduces the quoting, escaping and expansion rules the guards were built against: quotes come
// off, `$NAME` normalizes to `${NAME}`, active assignment expansions expose their fallback, and an
// unquoted `*`/`?` makes the whole word a glob whose text never reaches a segment. An unquoted
// parenthesis ends the run it sits in, so `open('.env')` still yields `.env` as a token of its own.
//
// A PowerShell word follows PowerShell's rules instead: the escape character is a backtick, a
// backslash is an ordinary path separator, and a variable name may carry a scope
// (`$env:USERPROFILE`).
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
    // A backtick escapes the next character everywhere except inside single quotes, which are
    // literal in PowerShell.
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

// Bodies fed to executing/applying consumers (bash, python, git apply, a pipe into another
// command, an output process substitution) must stay scannable; only inert data sinks qualify.
function collectDataSinkHeredocSpans(program: CommandProgram): CommandSpan[] {
  return program.nodes.flatMap((node, index): CommandSpan[] => {
    if (node.kind === 'group' || node.kind === 'function') {
      return collectDataSinkHeredocSpans(node.body);
    }
    if (node.kind !== 'command') return [];
    const nestedSpans = node.nested.flatMap((nested) => collectDataSinkHeredocSpans(nested));
    const next = program.nodes[index + 1];
    const piped = next?.kind === 'connector' && (next.operator === '|' || next.operator === '|&');
    if (piped || !isDataSinkHeredocConsumer(node)) return nestedSpans;
    return [
      ...nestedSpans,
      ...node.redirections.flatMap((redirection) =>
        redirection.heredoc?.quotedDelimiter ? [redirection.heredoc.bodySpan] : [],
      ),
    ];
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

// A message sink stores or publishes its body; it never resolves a word in it as a path.
// git apply is not one: its body names the files the patch writes, so it stays scannable.
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
