import { consumeHeredocBodies, type PendingHeredoc, readHeredocDelimiter } from './heredoc';
import {
  appendAccumulatedCommand,
  type CommandFunction,
  type CommandGroup,
  type CommandIssue,
  type CommandNode,
  type CommandParserLimits,
  type CommandParseStatus,
  type CommandProgram,
  type CommandRedirection,
  type CommandView,
  type CommandWord,
  type CommandWordPart,
  createCommandAccumulator,
  createCommandWordParts,
  freezeCommandProgram,
  freezeParsedCommandWord,
  type WordProvenance,
} from './model';

type ScanResult = {
  nodes: CommandNode[];
  issues: CommandIssue[];
  next: number;
  closed: boolean;
  limited: boolean;
  pendingHeredocs: PendingHeredoc[];
};

type WordResult = {
  word: CommandWord;
  nested: CommandProgram[];
  issues: CommandIssue[];
  next: number;
  limited: boolean;
};

type WordBudget = {
  used: number;
  readonly max: number;
};

type AnsiEscapeResult = {
  text: string;
  next: number;
  invalidCodePoint?: number;
};

type FunctionOpening = {
  readonly name: string;
  readonly braceIndex: number;
};

type LexicalScanState = {
  single: boolean;
  double: boolean;
};

const CONTINUATION_CONNECTORS = new Set(['&&', '||', '|', '|&']);
const RESERVED_COMMAND_PREFIXES = new Set([
  '!',
  'do',
  'elif',
  'else',
  'if',
  'then',
  'until',
  'while',
]);

export function parsePosixCommand(source: string, limits: CommandParserLimits): CommandProgram {
  const span = { start: 0, end: source.length };
  if (source.length > limits.maxInputLength) {
    return freezeCommandProgram({
      kind: 'program',
      dialect: 'posix',
      source,
      span,
      status: 'limited',
      issues: [
        {
          code: 'input-limit',
          message: `command exceeds ${limits.maxInputLength} UTF-16 code units`,
        },
      ],
      nodes: [],
    });
  }

  const result = scanSequence(
    source,
    0,
    source.length,
    limits,
    {
      used: 0,
      max: limits.maxWords,
    },
    0,
  );
  return freezeCommandProgram({
    kind: 'program',
    dialect: 'posix',
    source,
    span,
    status: getParseStatus(result.issues, result.limited),
    issues: result.issues,
    nodes: result.nodes,
  });
}

function scanSequence(
  source: string,
  start: number,
  end: number,
  limits: CommandParserLimits,
  wordBudget: WordBudget,
  depth: number,
  closing?: ')' | '}',
): ScanResult {
  const nodes: CommandNode[] = [];
  const issues: CommandIssue[] = [];
  const accumulator = createCommandAccumulator();
  const pendingHeredocs: PendingHeredoc[] = [];

  const flushCommand = () => {
    if (accumulator.words.length === 0 && accumulator.redirections.length === 0) return;
    const span = { start: accumulator.start, end: accumulator.end };
    const tokens = accumulator.words.map((word) => word.text);
    appendAccumulatedCommand(nodes, accumulator, {
      kind: 'command',
      dialect: 'posix',
      source: source.slice(span.start, span.end),
      span,
      words: accumulator.words,
      redirections: accumulator.redirections,
      nested: accumulator.nested,
      displayText:
        issues.length > 0 && nodes.length === 0 ? source.slice(start, end) : tokens.join(' '),
    } satisfies CommandView);
  };

  let i = start;
  while (i < end) {
    const char = source[i];
    if (!char) break;

    if (closing && char === closing) {
      flushCommand();
      appendMissingCommandIssue(nodes, issues);
      return {
        nodes,
        issues,
        next: i + 1,
        closed: true,
        limited: false,
        pendingHeredocs,
      };
    }

    if (isShellWhitespace(char)) {
      if (char === '\n' || char === '\r') {
        flushCommand();
        const connectorEnd = char === '\r' && source[i + 1] === '\n' ? i + 2 : i + 1;
        const previous = nodes.at(-1);
        if (previous?.kind !== 'connector' || !CONTINUATION_CONNECTORS.has(previous.operator)) {
          nodes.push(
            Object.freeze({
              kind: 'connector',
              operator: source.slice(i, connectorEnd),
              span: Object.freeze({ start: i, end: connectorEnd }),
            }),
          );
        }
        if (pendingHeredocs.length > 0) {
          const bodies = consumeHeredocBodies(source, connectorEnd, end, pendingHeredocs.splice(0));
          issues.push(...bodies.issues);
          i = bodies.next;
          continue;
        }
        i = connectorEnd;
        continue;
      }
      i++;
      continue;
    }

    if (char === '#') {
      while (i < end && source[i] !== '\n' && source[i] !== '\r') i++;
      continue;
    }

    const functionOpening =
      accumulator.start === -1 ? readFunctionOpening(source, i, end) : undefined;
    if (functionOpening) {
      appendMissingConnectorIssue(nodes, issues);
      if (depth >= limits.maxDepth) {
        return limitedResult(nodes, issues, i, 'depth-limit', limits.maxDepth);
      }
      if (!consumeWord(wordBudget)) {
        return limitedResult(nodes, issues, i, 'word-limit', limits.maxWords);
      }
      const inner = scanSequence(
        source,
        functionOpening.braceIndex + 1,
        end,
        limits,
        wordBudget,
        depth + 1,
        '}',
      );
      const functionEnd = inner.next;
      const bodySpan = {
        start: functionOpening.braceIndex + 1,
        end: inner.closed ? functionEnd - 1 : functionEnd,
      };
      const body = buildNestedCommandProgram(source, bodySpan, inner);
      nodes.push({
        kind: 'function',
        name: functionOpening.name,
        span: { start: i, end: functionEnd },
        body,
      } satisfies CommandFunction);
      issues.push(...inner.issues);
      if (inner.pendingHeredocs.length > 0 || containsHeredoc(inner.nodes)) {
        issues.push({
          code: 'unsupported-heredoc-context',
          message: 'heredocs attached inside function bodies are not supported safely',
        });
      }
      pendingHeredocs.push(...inner.pendingHeredocs);
      if (inner.limited) return propagatedLimitResult(nodes, issues, inner.next);
      if (!inner.closed) {
        issues.push({
          code: 'unclosed-function-body',
          message: 'function body is not closed',
        });
      }
      i = functionEnd;
      continue;
    }

    const connector = readConnector(source, i);
    if (connector) {
      flushCommand();
      if (!isExecutableNode(nodes.at(-1))) {
        issues.push({
          code: 'unexpected-connector',
          message: `connector ${connector} has no preceding command`,
        });
      }
      nodes.push(
        Object.freeze({
          kind: 'connector',
          operator: connector,
          span: Object.freeze({ start: i, end: i + connector.length }),
        }),
      );
      i += connector.length;
      continue;
    }

    if (char === ')') {
      flushCommand();
      issues.push({
        code: 'unexpected-closing-delimiter',
        message: 'closing parenthesis has no matching opening parenthesis',
      });
      nodes.push({ kind: 'unknown', source: char, span: { start: i, end: i + 1 } });
      i++;
      continue;
    }

    if (
      (char === '(' || (char === '{' && isBraceGroupOpening(source, i, end))) &&
      accumulator.start === -1
    ) {
      appendMissingConnectorIssue(nodes, issues);
      if (depth >= limits.maxDepth) {
        return limitedResult(nodes, issues, i, 'depth-limit', limits.maxDepth);
      }
      const close = char === '(' ? ')' : '}';
      const inner = scanSequence(source, i + 1, end, limits, wordBudget, depth + 1, close);
      const groupEnd = inner.next;
      const bodySpan = { start: i + 1, end: inner.closed ? groupEnd - 1 : groupEnd };
      const body = buildNestedCommandProgram(source, bodySpan, inner);
      nodes.push({
        kind: 'group',
        style: char === '(' ? 'subshell' : 'brace',
        span: { start: i, end: groupEnd },
        body,
      } satisfies CommandGroup);
      issues.push(...inner.issues);
      if (inner.pendingHeredocs.length > 0 || containsHeredoc(inner.nodes)) {
        issues.push({
          code: 'unsupported-heredoc-context',
          message: 'heredocs attached inside command groups are not supported safely',
        });
      }
      pendingHeredocs.push(...inner.pendingHeredocs);
      if (inner.limited) return propagatedLimitResult(nodes, issues, inner.next);
      if (!inner.closed) {
        issues.push({
          code: char === '(' ? 'unclosed-subshell' : 'unclosed-brace-group',
          message: `${char} group is not closed`,
        });
      }
      i = groupEnd;
      continue;
    }

    const redirect =
      (char === '<' || char === '>') && source[i + 1] !== '(' ? readRedirect(source, i) : null;
    if (redirect) {
      const prior = accumulator.words.at(-1);
      const attachedFd =
        prior && prior.span.end === i && /^[0-9]+$/.test(prior.raw) ? Number(prior.raw) : undefined;
      if (attachedFd !== undefined) accumulator.words.pop();
      const redirectStart = attachedFd === undefined ? i : (prior?.span.start ?? i);
      accumulator.start = accumulator.start === -1 ? i : accumulator.start;
      let targetStart = i + redirect.length;
      while (targetStart < end && /[ \t]/.test(source[targetStart] ?? '')) targetStart++;
      const targetChar = source[targetStart];
      const targetStartsComment = targetStart > i + redirect.length && targetChar === '#';
      const targetIsBoundary =
        !targetChar ||
        isShellWhitespace(targetChar) ||
        !!readConnector(source, targetStart) ||
        targetChar === closing ||
        targetChar === ')' ||
        targetStartsComment ||
        ((targetChar === '<' || targetChar === '>') && source[targetStart + 1] !== '(');
      const heredocRedirect = redirect === '<<' || redirect === '<<-';
      const delimiter = heredocRedirect
        ? readHeredocDelimiter(source, targetStart, end)
        : undefined;
      const targetResult = delimiter
        ? {
            word: freezeParsedCommandWord(
              source,
              targetStart,
              delimiter.next,
              delimiter.delimiter,
              'literal',
              delimiter.quoted,
            ),
            nested: [],
            issues: [],
            next: delimiter.next,
            limited: false,
          }
        : !targetIsBoundary
          ? readWord(source, targetStart, end, limits, wordBudget, depth)
          : undefined;
      if (targetResult) {
        issues.push(...targetResult.issues);
        if (targetResult.limited) {
          return propagatedLimitResult(nodes, issues, targetResult.next);
        }
        if (!consumeWord(wordBudget)) {
          return limitedResult(nodes, issues, targetResult.next, 'word-limit', limits.maxWords);
        }
      }
      const redirectEnd = targetResult?.next ?? i + redirect.length;
      const redirection: {
        kind: 'redirection';
        operator: string;
        span: { start: number; end: number };
        fd?: number;
        target?: CommandWord;
        heredoc?: CommandRedirection['heredoc'];
      } = {
        kind: 'redirection',
        operator: redirect,
        span: { start: redirectStart, end: redirectEnd },
        ...(attachedFd === undefined ? {} : { fd: attachedFd }),
        ...(targetResult ? { target: targetResult.word } : {}),
      };
      accumulator.redirections.push(redirection);
      if (heredocRedirect && !delimiter) {
        issues.push({
          code: 'missing-heredoc-delimiter',
          message: 'heredoc redirection requires a delimiter word',
        });
      }
      if (delimiter) {
        if (delimiter.ambiguous || delimiter.delimiter.length === 0) {
          issues.push({
            code: 'ambiguous-heredoc-delimiter',
            message: 'heredoc delimiter cannot be determined safely',
          });
        }
        const nested = accumulator.nested;
        pendingHeredocs.push({
          delimiter: delimiter.delimiter,
          quotedDelimiter: delimiter.quoted,
          stripTabs: redirect === '<<-',
          attach: (heredoc) => {
            redirection.heredoc = heredoc;
            if (heredoc.quotedDelimiter) return;
            const body = readExpandedText(
              source,
              heredoc.bodySpan.start,
              heredoc.bodySpan.end,
              limits,
              wordBudget,
              depth + 1,
              'bare',
            );
            nested.push(...body.programs);
            issues.push(...body.issues);
          },
        });
      }
      if (!heredocRedirect && !targetResult) {
        issues.push({
          code: 'missing-redirection-target',
          message: `redirection ${redirect} requires a target word`,
        });
      }
      if (targetResult) {
        accumulator.nested.push(...targetResult.nested);
      }
      accumulator.end = redirectEnd;
      i = redirectEnd;
      continue;
    }

    const commandStart = accumulator.start === -1;
    if (commandStart) appendMissingConnectorIssue(nodes, issues);
    const wordResult = readWord(source, i, end, limits, wordBudget, depth);
    issues.push(...wordResult.issues);
    if (wordResult.limited) {
      return propagatedLimitResult(nodes, issues, wordResult.next);
    }
    const expanded = isCommandWordPosition(accumulator.words)
      ? expandLiteralCommandWord(
          source,
          wordResult.word,
          wordBudget.max - wordBudget.used,
          limits.maxDepth,
          limits.maxInputLength,
        )
      : undefined;
    if (expanded?.limitCode) {
      return limitedResult(
        nodes,
        issues,
        wordResult.next,
        expanded.limitCode,
        expanded.limitCode === 'word-limit'
          ? limits.maxWords
          : expanded.limitCode === 'depth-limit'
            ? limits.maxDepth
            : limits.maxInputLength,
      );
    }
    const words = expanded?.words ?? [wordResult.word];
    for (const word of words) {
      if (!consumeWord(wordBudget)) {
        return limitedResult(nodes, issues, wordResult.next, 'word-limit', limits.maxWords);
      }
      accumulator.words.push(word);
    }
    accumulator.start = accumulator.start === -1 ? i : accumulator.start;
    accumulator.end = wordResult.next;
    accumulator.nested.push(...wordResult.nested);
    if (commandStart && isReservedCommandPrefix(wordResult.word)) flushCommand();
    i = wordResult.next > i ? wordResult.next : i + 1;
  }

  flushCommand();
  appendMissingCommandIssue(nodes, issues);
  issues.push(...unterminatedHeredocIssues(pendingHeredocs));
  return {
    nodes,
    issues,
    next: i,
    closed: closing === undefined,
    limited: false,
    pendingHeredocs: [],
  };
}

function buildNestedCommandProgram(
  source: string,
  span: { start: number; end: number },
  result: ScanResult,
): CommandProgram {
  return {
    kind: 'program',
    dialect: 'posix',
    source: source.slice(span.start, span.end),
    span,
    status: getParseStatus(result.issues, result.limited),
    issues: result.issues,
    nodes: result.nodes,
  };
}

function readWord(
  source: string,
  start: number,
  end: number,
  limits: CommandParserLimits,
  wordBudget: WordBudget,
  depth: number,
): WordResult {
  let text = '';
  let i = start;
  let quoted = false;
  let provenance: WordProvenance = 'literal';
  const nested: CommandProgram[] = [];
  const issues: CommandIssue[] = [];
  let limited = false;

  while (i < end) {
    const char = source[i];
    const processSubstitution = (char === '<' || char === '>') && source[i + 1] === '(';
    if (
      !char ||
      isShellWhitespace(char) ||
      ((char === ';' || char === '|' || char === '&') && readConnector(source, i)) ||
      ((char === '<' || char === '>') && !processSubstitution)
    ) {
      break;
    }
    if (char === ')') break;

    if (char === "'") {
      quoted = true;
      const close = source.indexOf("'", i + 1);
      if (close === -1 || close >= end) {
        text += source.slice(i + 1, end);
        issues.push({
          code: 'unclosed-single-quote',
          message: 'single-quoted word is not closed',
        });
        i = end;
        break;
      }
      text += source.slice(i + 1, close);
      i = close + 1;
      continue;
    }

    if (char === '"') {
      quoted = true;
      const result = readDoubleQuoted(source, i, end, limits, wordBudget, depth);
      text += result.text;
      nested.push(...result.nested);
      issues.push(...result.issues);
      limited ||= result.limited;
      provenance = mergeProvenance(provenance, result.provenance);
      i = result.next;
      if (limited) break;
      continue;
    }

    if (source.startsWith("$'", i)) {
      quoted = true;
      const ansi = readAnsiCString(source, i + 2, end);
      text += ansi.text;
      issues.push(...ansi.issues);
      if (!ansi.closed) {
        issues.push({
          code: 'unclosed-ansi-c-quote',
          message: 'ANSI-C quoted word is not closed',
        });
      }
      i = ansi.next;
      continue;
    }

    if (char === '\\') {
      const next = source[i + 1];
      if (!next) {
        issues.push({
          code: 'trailing-escape',
          message: 'escape has no following character',
        });
        i++;
        break;
      }
      if (next === '\n') {
        i += 2;
        continue;
      }
      text += next;
      i += 2;
      continue;
    }

    if (opensFunctionSubstitution(source, i)) issues.push(FUNCTION_SUBSTITUTION_ISSUE);
    const substitution =
      char === '$' || char === '<' || char === '>' || char === '`'
        ? (readSubstitution(source, i, end, limits, wordBudget, depth) ??
          readParameterExpansion(source, i, end, limits, wordBudget, depth, true))
        : null;
    if (substitution) {
      if (substitution.provenance === 'variable') text += source.slice(i, substitution.next);
      const collected = collectSubstitution(substitution, nested, issues);
      limited ||= collected.limited;
      provenance = mergeProvenance(provenance, collected.provenance);
      i = collected.next;
      if (limited) break;
      continue;
    }

    if (char === '$') {
      const variable = appendVariable(source, i, end, text, provenance, true);
      text = variable.text;
      provenance = variable.provenance;
      i = variable.next;
      continue;
    }

    if (char === '*' || char === '?' || char === '[') {
      provenance = mergeProvenance(provenance, 'glob');
    }
    text += char;
    i++;
  }

  return {
    word: freezeParsedCommandWord(
      source,
      start,
      i,
      text,
      provenance,
      quoted,
      provenance === 'literal' ? undefined : derivePosixWordParts(source, start, i),
    ),
    nested,
    issues,
    next: i,
    limited,
  };
}

function readDoubleQuoted(
  source: string,
  start: number,
  end: number,
  limits: CommandParserLimits,
  wordBudget: WordBudget,
  depth: number,
): Omit<WordResult, 'word'> & { text: string; provenance: WordProvenance } {
  let text = '';
  let provenance: WordProvenance = 'literal';
  const nested: CommandProgram[] = [];
  const issues: CommandIssue[] = [];
  let limited = false;
  let i = start + 1;
  while (i < end) {
    const char = source[i];
    if (char === '"') {
      return { text, provenance, nested, issues, next: i + 1, limited };
    }
    if (char === '\\' && source[i + 1]) {
      const escaped = source[i + 1] ?? '';
      if (escaped === '\n') {
        i += 2;
        continue;
      }
      if (escaped === '\r' && source[i + 2] === '\n') {
        i += 3;
        continue;
      }
      text += ['$', '`', '"', '\\'].includes(escaped) ? escaped : `\\${escaped}`;
      i += 2;
      continue;
    }
    if (opensFunctionSubstitution(source, i)) issues.push(FUNCTION_SUBSTITUTION_ISSUE);
    const substitution =
      readSubstitution(source, i, end, limits, wordBudget, depth) ??
      readParameterExpansion(source, i, end, limits, wordBudget, depth, false);
    if (substitution) {
      if (substitution.provenance !== 'command-substitution') {
        text += source.slice(i, substitution.next);
      }
      const collected = collectSubstitution(substitution, nested, issues);
      i = collected.next;
      limited ||= collected.limited;
      provenance = mergeProvenance(provenance, collected.provenance);
      if (limited) return { text, provenance, nested, issues, next: i, limited };
      continue;
    }
    if (char === '$') {
      const variable = appendVariable(source, i, end, text, provenance, false);
      text = variable.text;
      provenance = variable.provenance;
      i = variable.next;
      continue;
    }
    text += char ?? '';
    i++;
  }
  issues.push({
    code: 'unclosed-double-quote',
    message: 'double-quoted word is not closed',
  });
  return { text, provenance, nested, issues, next: end, limited };
}

function readSubstitution(
  source: string,
  start: number,
  end: number,
  limits: CommandParserLimits,
  wordBudget: WordBudget,
  depth: number,
): { program: CommandProgram; next: number; provenance: WordProvenance } | null {
  const arithmetic = source.startsWith('$((', start);
  const command = source.startsWith('$(', start) && !arithmetic;
  const process = source.startsWith('<(', start) || source.startsWith('>(', start);
  const backtick = source[start] === '`';
  if (!arithmetic && !command && !process && !backtick) return null;

  const openLength = arithmetic ? 3 : backtick ? 1 : 2;
  const closing = arithmetic ? '))' : backtick ? '`' : ')';
  const close = findSubstitutionEnd(source, start + openLength, end, closing);
  const innerEnd = close === -1 ? end : close;
  const next = close === -1 ? end : close + closing.length;
  if (depth >= limits.maxDepth) {
    return {
      program: limitedProgram(source, start + openLength, innerEnd, 'depth-limit'),
      next,
      provenance: arithmetic ? 'arithmetic' : 'command-substitution',
    };
  }
  if (arithmetic) {
    const arithmeticNodes: CommandNode[] = [];
    const arithmeticIssues: CommandIssue[] = [];
    let arithmeticLimited = false;
    let cursor = start + openLength;
    while (cursor < innerEnd) {
      const nestedSubstitution = readSubstitution(
        source,
        cursor,
        innerEnd,
        limits,
        wordBudget,
        depth + 1,
      );
      if (!nestedSubstitution) {
        if (opensFunctionSubstitution(source, cursor))
          arithmeticIssues.push(FUNCTION_SUBSTITUTION_ISSUE);
        cursor++;
        continue;
      }
      arithmeticNodes.push(...nestedSubstitution.program.nodes);
      arithmeticIssues.push(...nestedSubstitution.program.issues);
      arithmeticLimited ||= nestedSubstitution.program.status === 'limited';
      cursor = nestedSubstitution.next;
      if (arithmeticLimited) break;
    }
    if (close === -1) {
      arithmeticIssues.push({
        code: 'unclosed-arithmetic',
        message: '$(( substitution is not closed',
      });
    }
    return {
      program: freezeCommandProgram({
        kind: 'program',
        dialect: 'posix',
        source: source.slice(start + openLength, innerEnd),
        span: { start: start + openLength, end: innerEnd },
        status: getParseStatus(arithmeticIssues, arithmeticLimited),
        issues: arithmeticIssues,
        nodes: arithmeticNodes,
      }),
      next,
      provenance: 'arithmetic',
    };
  }
  const inner = scanSequence(source, start + openLength, innerEnd, limits, wordBudget, depth + 1);
  const substitutionIssue =
    close === -1
      ? [
          {
            code: 'unclosed-command-substitution',
            message: `${source.slice(start, start + openLength)} substitution is not closed`,
          },
        ]
      : [];
  const contextIssue =
    (backtick || process) && containsHeredoc(inner.nodes)
      ? [
          {
            code: 'unsupported-heredoc-context',
            message: 'heredocs are supported only in ordinary commands and $(...) substitutions',
          },
        ]
      : [];
  const escapeIssue =
    backtick && backtickBodyHidesExpansion(source, start + openLength, innerEnd)
      ? [
          {
            code: 'unsupported-backtick-escape',
            message:
              'a backslash before $, ` or a quoted backslash inside backticks changes the command the shell runs and cannot be analyzed',
          },
        ]
      : [];
  return {
    program: freezeCommandProgram({
      kind: 'program',
      dialect: 'posix',
      source: source.slice(start + openLength, innerEnd),
      span: { start: start + openLength, end: innerEnd },
      status: getParseStatus(
        [...inner.issues, ...substitutionIssue, ...contextIssue, ...escapeIssue],
        inner.limited,
      ),
      issues: [...inner.issues, ...substitutionIssue, ...contextIssue, ...escapeIssue],
      nodes: inner.nodes,
    }),
    next,
    provenance: 'command-substitution',
  };
}

type ExpandedTextKind = 'bare' | 'operand' | 'quoted-operand';

function readExpandedText(
  source: string,
  start: number,
  end: number,
  limits: CommandParserLimits,
  wordBudget: WordBudget,
  depth: number,
  kind: ExpandedTextKind,
): { programs: CommandProgram[]; issues: CommandIssue[]; close: number } {
  const patternQuotes = kind !== 'bare';
  const opening = patternQuotes ? patternOperatorAt(source, start) : null;
  const name = opening
    ? readExpandedText(source, start, opening.nameEnd, limits, wordBudget, depth, 'bare')
    : null;
  const programs = name?.programs ?? [];
  const issues = name?.issues ?? [];
  let level = operandLevel(kind === 'operand', opening);
  const enclosing: (typeof level)[] = [];
  let i = opening?.next ?? start;
  while (i < end) {
    const char = source[i];
    if (char === '\\') {
      i += 2;
      continue;
    }
    if (level.quotes && char === '"') {
      level = { ...level, double: !level.double };
      i++;
      continue;
    }
    if (level.quotes && !level.double && char === "'") {
      i = skipSingleQuoted(source, i, end);
      continue;
    }
    if (level.quotes && !level.double && char === '$' && source[i + 1] === "'") {
      i = readAnsiCString(source, i + 2, end).next;
      continue;
    }
    if (level.patternSlash && !level.double && char === '/') {
      level = operandLevel(false, null);
      i++;
      continue;
    }
    if (char === '}' && !level.double) {
      const parent = enclosing.pop();
      if (parent) {
        level = parent;
        i++;
        continue;
      }
      if (kind !== 'bare') return { programs, issues, close: i };
    }
    if (char === '$' && source[i + 1] === '{') {
      if (opensFunctionSubstitution(source, i)) issues.push(FUNCTION_SUBSTITUTION_ISSUE);
      const nested = patternQuotes ? patternOperatorAt(source, i + 2) : null;
      if (nested) {
        const nestedName = readExpandedText(
          source,
          i + 2,
          nested.nameEnd,
          limits,
          wordBudget,
          depth,
          'bare',
        );
        programs.push(...nestedName.programs);
        issues.push(...nestedName.issues);
      }
      enclosing.push(level);
      level = operandLevel(level.quotes && !level.double, nested);
      i = nested?.next ?? i + 2;
      continue;
    }
    const substitution =
      char === '$' || char === '`'
        ? readSubstitution(source, i, end, limits, wordBudget, depth)
        : null;
    if (!substitution) {
      if (opensFunctionSubstitution(source, i)) issues.push(FUNCTION_SUBSTITUTION_ISSUE);
      i++;
      continue;
    }
    programs.push(substitution.program);
    if (
      containsFunctionSubstitutionOpener(source, i, substitution.next) &&
      mayRunFunctionSubstitution(substitution.program)
    ) {
      issues.push(FUNCTION_SUBSTITUTION_ISSUE);
    }
    i = substitution.next;
  }
  return { programs, issues, close: -1 };
}

function collectSubstitution(
  substitution: NonNullable<ReturnType<typeof readSubstitution>>,
  nested: CommandProgram[],
  issues: CommandIssue[],
) {
  nested.push(substitution.program);
  issues.push(...substitution.program.issues);
  return {
    provenance: substitution.provenance,
    next: substitution.next,
    limited: substitution.program.status === 'limited',
  };
}

function findSubstitutionEnd(
  source: string,
  start: number,
  end: number,
  closing: '))' | ')' | '`',
): number {
  if (closing === '`') {
    for (let i = start; i < end; i++) {
      if (source[i] === '\\') {
        i++;
        continue;
      }
      if (source[i] === '`') return i;
    }
    return -1;
  }
  let lexicalState: LexicalScanState = { single: false, double: false };
  const enclosing: LexicalScanState[] = [];
  const pendingHeredocs: PendingHeredoc[] = [];
  for (let i = start; i < end; i++) {
    const char = source[i];
    if ((char === '\n' || char === '\r') && pendingHeredocs.length > 0) {
      const lineEnd = char === '\r' && source[i + 1] === '\n' ? i + 2 : i + 1;
      const bodies = consumeHeredocBodies(source, lineEnd, end, pendingHeredocs.splice(0));
      if (!bodies.terminated) return -1;
      i = bodies.next - 1;
      continue;
    }
    const lexicalEnd = scanLexicalQuoteOrComment(source, i, start, end, lexicalState);
    if (lexicalEnd !== null) {
      i = lexicalEnd;
      continue;
    }
    if (!lexicalState.double && source.startsWith('$((', i)) {
      const arithmeticClose = findArithmeticEnd(source, i + 3, end);
      if (arithmeticClose === -1) return -1;
      i = arithmeticClose + 1;
      continue;
    }
    if (
      closing === ')' &&
      !lexicalState.double &&
      char === '<' &&
      source[i + 1] === '<' &&
      source[i + 2] !== '<'
    ) {
      const stripTabs = source[i + 2] === '-';
      let targetStart = i + (stripTabs ? 3 : 2);
      while (targetStart < end && /[ \t]/.test(source[targetStart] ?? '')) targetStart++;
      const delimiter = readHeredocDelimiter(source, targetStart, end);
      if (delimiter) {
        pendingHeredocs.push({
          delimiter: delimiter.delimiter,
          quotedDelimiter: delimiter.quoted,
          stripTabs,
          attach: () => undefined,
        });
        i = delimiter.next - 1;
        continue;
      }
    }
    if (source.startsWith('$(', i) && !source.startsWith('$((', i)) {
      enclosing.push(lexicalState);
      lexicalState = { single: false, double: false };
      i++;
      continue;
    }
    if (char === '(' && !lexicalState.double) {
      enclosing.push(lexicalState);
      lexicalState = { single: false, double: false };
      continue;
    }
    if (char !== ')' || lexicalState.double) continue;
    const parent = enclosing.pop();
    if (parent) {
      lexicalState = parent;
      continue;
    }
    return closing === '))' && source[i + 1] !== ')' ? -1 : i;
  }
  return -1;
}

function findArithmeticEnd(source: string, start: number, end: number): number {
  let depth = 1;
  const lexicalState = { single: false, double: false };
  for (let i = start; i < end; i++) {
    const char = source[i];
    const lexicalEnd = scanLexicalQuoteOrComment(source, i, start, end, lexicalState);
    if (lexicalEnd !== null) {
      i = lexicalEnd;
      continue;
    }
    if (source.startsWith('$(', i) && !source.startsWith('$((', i)) {
      depth++;
      i++;
      continue;
    }
    if (char === '(' && !lexicalState.double) depth++;
    if (char !== ')' || lexicalState.double) continue;
    depth--;
    if (depth === 0) return source[i + 1] === ')' ? i : -1;
  }
  return -1;
}

function scanLexicalQuoteOrComment(
  source: string,
  index: number,
  start: number,
  end: number,
  state: LexicalScanState,
): number | null {
  const char = source[index];
  if (char === '\\' && !state.single) return index + 1;
  if (!state.single && !state.double && char === '$' && source[index + 1] === "'") {
    return readAnsiCString(source, index + 2, end).next - 1;
  }
  if (!state.double && char === "'") state.single = !state.single;
  if (!state.single && char === '"') state.double = !state.double;
  if (state.single) return index;
  if (state.double || char !== '#' || !isCommentStart(source, index, start)) return null;

  let commentEnd = index;
  while (
    commentEnd + 1 < end &&
    source[commentEnd + 1] !== '\n' &&
    source[commentEnd + 1] !== '\r'
  ) {
    commentEnd++;
  }
  return commentEnd;
}

function readConnector(source: string, index: number): string | null {
  const char = source[index];
  if (char === ';') return ';';
  if (char === '&') return source[index + 1] === '&' ? '&&' : '&';
  if (char === '|')
    return source[index + 1] === '|' ? '||' : source[index + 1] === '&' ? '|&' : '|';
  return null;
}

function readRedirect(source: string, index: number): string | null {
  const char = source[index];
  if (char === '>') {
    if (source[index + 1] === '>') return '>>';
    if (source[index + 1] === '&') return '>&';
    return source[index + 1] === '|' ? '>|' : '>';
  }
  if (char !== '<') return null;
  if (source.startsWith('<<<', index)) return '<<<';
  if (source.startsWith('<<-', index)) return '<<-';
  if (source[index + 1] === '<') return '<<';
  if (source[index + 1] === '&') return '<&';
  if (source[index + 1] === '>') return '<>';
  return '<';
}

function isShellWhitespace(char: string): boolean {
  const code = char.charCodeAt(0);
  if (code === 32 || (code >= 9 && code <= 13)) return true;
  if (code < 128) return false;
  return /\s/u.test(char);
}

const FUNCTION_SUBSTITUTION_ISSUE: CommandIssue = Object.freeze({
  code: 'unsupported-function-substitution',
  message: '${ list; } function substitutions run in the current shell and cannot be analyzed',
});

function opensFunctionSubstitution(source: string, start: number): boolean {
  if (source[start] !== '$') return false;
  const brace = skipLineContinuations(source, start + 1);
  if (source[brace] !== '{') return false;
  const next = source[skipLineContinuations(source, brace + 1)] ?? '';
  return next === '|' || isShellWhitespace(next);
}

function containsFunctionSubstitutionOpener(source: string, start: number, end: number): boolean {
  for (let k = source.indexOf('$', start); k !== -1 && k < end; k = source.indexOf('$', k + 1)) {
    if (opensFunctionSubstitution(source, k)) return true;
  }
  return false;
}

function mayRunFunctionSubstitution(program: CommandProgram | undefined): boolean {
  return (
    program?.status === 'limited' ||
    (program?.issues ?? []).some((issue) => issue.code === FUNCTION_SUBSTITUTION_ISSUE.code)
  );
}

function skipLineContinuations(source: string, start: number): number {
  let index = start;
  while (source.startsWith('\\\n', index) || source.startsWith('\\\r\n', index)) {
    index += source[index + 1] === '\r' ? 3 : 2;
  }
  return index;
}

const UNCLOSED_PARAMETER_EXPANSION_ISSUE: CommandIssue = Object.freeze({
  code: 'unclosed-parameter-expansion',
  message: '${ parameter expansion is not closed',
});

function readParameterExpansion(
  source: string,
  start: number,
  end: number,
  limits: CommandParserLimits,
  wordBudget: WordBudget,
  depth: number,
  operandQuotes: boolean,
): { program: CommandProgram; next: number; provenance: WordProvenance } | null {
  if (source[start] !== '$' || source[start + 1] !== '{') return null;
  const inner = readExpandedText(
    source,
    start + 2,
    end,
    limits,
    wordBudget,
    depth + 1,
    operandQuotes ? 'operand' : 'quoted-operand',
  );
  const close = inner.close;
  const innerEnd = close === -1 ? end : close;
  const issues = [
    ...inner.programs.flatMap((program) => program.issues),
    ...inner.issues,
    ...(close === -1 ? [UNCLOSED_PARAMETER_EXPANSION_ISSUE] : []),
  ];
  if (inner.programs.length === 0 && issues.length === 0) return null;
  return {
    program: freezeCommandProgram({
      kind: 'program',
      dialect: 'posix',
      source: source.slice(start + 2, innerEnd),
      span: { start: start + 2, end: innerEnd },
      status: getParseStatus(
        issues,
        inner.programs.some((program) => program.status === 'limited'),
      ),
      issues,
      nodes: inner.programs.flatMap((program) => program.nodes),
    }),
    next: close === -1 ? end : close + 1,
    provenance: 'variable',
  };
}

export function findParameterExpansionEnd(
  source: string,
  start: number,
  end: number,
  operandQuotes: boolean,
): number {
  const opening = patternOperatorAt(source, start);
  let level = operandLevel(operandQuotes, opening);
  const enclosing: (typeof level)[] = [];
  for (let i = opening?.next ?? start; i < end; i++) {
    const char = source[i];
    if (char === '\\') {
      i++;
      continue;
    }
    if (level.quotes && char === '"') {
      level = { ...level, double: !level.double };
      continue;
    }
    if (level.quotes && !level.double && char === "'") {
      i = skipSingleQuoted(source, i, end) - 1;
      continue;
    }
    if (level.quotes && !level.double && char === '$' && source[i + 1] === "'") {
      i = readAnsiCString(source, i + 2, end).next - 1;
      continue;
    }
    if (char === '`' || (char === '$' && source[i + 1] === '(')) {
      const next = findSubstitutionNext(source, i, end);
      if (next === -1) return -1;
      i = next - 1;
      continue;
    }
    if (level.patternSlash && !level.double && char === '/') {
      level = operandLevel(false, null);
      continue;
    }
    if (char === '$' && source[i + 1] === '{') {
      const nested = patternOperatorAt(source, i + 2);
      enclosing.push(level);
      level = operandLevel(level.quotes && !level.double, nested);
      i = (nested?.next ?? i + 2) - 1;
      continue;
    }
    if (char !== '}' || level.double) continue;
    const parent = enclosing.pop();
    if (!parent) return i;
    level = parent;
  }
  return -1;
}

function findSubstitutionNext(source: string, start: number, end: number): number {
  const arithmetic = source.startsWith('$((', start);
  const backtick = source[start] === '`';
  const closing = arithmetic ? '))' : backtick ? '`' : ')';
  const openLength = arithmetic ? 3 : backtick ? 1 : 2;
  const close = findSubstitutionEnd(source, start + openLength, end, closing);
  return close === -1 ? -1 : close + closing.length;
}

function operandLevel(base: boolean, opening: { operator: string } | null) {
  return {
    quotes: base || opening !== null,
    double: false,
    patternSlash: !base && opening?.operator === '/',
  };
}

function patternOperatorAt(
  source: string,
  start: number,
): { operator: string; nameEnd: number; next: number } | null {
  const name = /^!?(?:[A-Za-z_][A-Za-z0-9_]*(?:\[[^\]]*\])?|[0-9]+|[@*?$!-])/.exec(
    source.slice(start),
  )?.[0];
  if (!name) return null;
  const operator = source[start + name.length];
  if (operator !== '#' && operator !== '%' && operator !== '/') return null;
  const second = source[start + name.length + 1];
  const length =
    second === operator || (operator === '/' && (second === '#' || second === '%')) ? 2 : 1;
  const nameEnd = start + name.length;
  return { operator, nameEnd, next: nameEnd + length };
}

function skipSingleQuoted(source: string, start: number, end: number): number {
  const close = source.indexOf("'", start + 1);
  return close === -1 || close >= end ? end : close + 1;
}

function backtickBodyHidesExpansion(source: string, start: number, end: number): boolean {
  for (let i = start; i < end; i++) {
    if (source[i] !== '\\') continue;
    if (source[i + 1] === '\n') {
      i++;
      continue;
    }
    if (source[i + 1] === '$' || source[i + 1] === '`') return true;
    if (source[i + 1] === '\\') {
      let afterPair = i + 2;
      while (afterPair < end && source[afterPair] === '\\' && source[afterPair + 1] === '\n') {
        afterPair += 2;
      }
      if (source[afterPair] === "'" || source[afterPair] === '"') return true;
    }
    i++;
  }
  return false;
}

function readVariableEnd(
  source: string,
  start: number,
  end: number,
  operandQuotes: boolean,
): number {
  if (source[start + 1] === '{') {
    const close = findParameterExpansionEnd(source, start + 2, end, operandQuotes);
    return close === -1 ? end : close + 1;
  }
  if (source[start + 1] === '$') return start + 2;
  let i = start + 1;
  while (i < end && /[A-Za-z0-9_?@#!*-]/.test(source[i] ?? '')) i++;
  return i === start + 1 ? start + 1 : i;
}

function readAnsiCString(source: string, start: number, end: number) {
  let text = '';
  const issues: CommandIssue[] = [];
  let i = start;
  while (i < end) {
    const char = source[i];
    if (char === "'") return { text, next: i + 1, closed: true, issues };
    if (char !== '\\') {
      text += char ?? '';
      i++;
      continue;
    }
    const decoded = readAnsiEscape(source, i + 1, end);
    text += decoded.text;
    if (decoded.invalidCodePoint !== undefined) {
      issues.push({
        code: 'invalid-ansi-c-code-point',
        message: `ANSI-C escape is not a valid Unicode scalar value: ${decoded.invalidCodePoint}`,
      });
    }
    i = decoded.next;
  }
  return { text, next: end, closed: false, issues };
}

function readAnsiEscape(source: string, start: number, end: number): AnsiEscapeResult {
  const char = source[start];
  if (!char || start >= end) return { text: '\\', next: start };
  const simple = new Map([
    ['a', '\x07'],
    ['b', '\b'],
    ['e', '\x1b'],
    ['E', '\x1b'],
    ['f', '\f'],
    ['n', '\n'],
    ['r', '\r'],
    ['t', '\t'],
    ['v', '\v'],
    ['\\', '\\'],
    ["'", "'"],
    ['"', '"'],
  ]);
  if (simple.has(char)) return { text: simple.get(char) ?? char, next: start + 1 };
  if (char === 'x') return readFixedBaseEscape(source, start + 1, end, 16, 2, start + 1);
  if (char === 'u') return readFixedBaseEscape(source, start + 1, end, 16, 4, start + 1);
  if (char === 'U') return readFixedBaseEscape(source, start + 1, end, 16, 8, start + 1);
  if (/[0-7]/.test(char)) return readFixedBaseEscape(source, start, end, 8, 3, start + 1);
  return { text: char, next: start + 1 };
}

function readFixedBaseEscape(
  source: string,
  start: number,
  end: number,
  base: 8 | 16,
  maxLength: number,
  fallbackNext: number,
): AnsiEscapeResult {
  const digitPattern = base === 16 ? /[0-9a-fA-F]/ : /[0-7]/;
  let digits = '';
  let i = start;
  while (i < end && digits.length < maxLength && digitPattern.test(source[i] ?? '')) {
    digits += source[i];
    i++;
  }
  if (!digits) return { text: source[fallbackNext - 1] ?? '', next: fallbackNext };
  const codePoint = Number.parseInt(digits, base);
  return codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff)
    ? { text: '\ufffd', next: i, invalidCodePoint: codePoint }
    : { text: String.fromCodePoint(codePoint), next: i };
}

function getParseStatus(issues: readonly CommandIssue[], limited = false): CommandParseStatus {
  if (limited) return 'limited';
  if (
    issues.some(
      (issue) =>
        issue.code === 'invalid-ansi-c-code-point' ||
        issue.code === 'missing-heredoc-delimiter' ||
        issue.code === 'ambiguous-heredoc-delimiter' ||
        issue.code === 'unterminated-heredoc' ||
        issue.code === 'unsupported-heredoc-context' ||
        issue.code === 'unsupported-function-substitution' ||
        issue.code === 'unsupported-backtick-escape' ||
        issue.code === 'unclosed-parameter-expansion',
    )
  ) {
    return 'invalid';
  }
  return issues.length > 0 ? 'partial' : 'complete';
}

function appendVariable(
  source: string,
  start: number,
  end: number,
  text: string,
  provenance: WordProvenance,
  operandQuotes: boolean,
) {
  const next = readVariableEnd(source, start, end, operandQuotes);
  return {
    text: text + source.slice(start, next),
    provenance: mergeProvenance(provenance, 'variable'),
    next,
  };
}

function derivePosixWordParts(source: string, start: number, end: number): CommandWordPart[] {
  const collector = createCommandWordParts(source);
  let literalStart = start;
  let single = false;
  let double = false;

  let i = start;
  while (i < end) {
    const char = source[i];
    if (char === '\\' && !single) {
      i += 2;
      continue;
    }
    if (!double && char === "'") {
      single = !single;
      i++;
      continue;
    }
    if (!single && char === '"') {
      double = !double;
      i++;
      continue;
    }
    if (single) {
      i++;
      continue;
    }

    const arithmetic = source.startsWith('$((', i);
    const command = source.startsWith('$(', i) && !arithmetic;
    const process = !double && (source.startsWith('<(', i) || source.startsWith('>(', i));
    const backtick = char === '`';
    if (arithmetic || command || process || backtick) {
      const openLength = arithmetic ? 3 : backtick ? 1 : 2;
      const closing = arithmetic ? '))' : backtick ? '`' : ')';
      const close = findSubstitutionEnd(source, i + openLength, end, closing);
      const next = close === -1 ? end : close + closing.length;
      collector.push(literalStart, i, 'literal');
      collector.push(i, next, arithmetic ? 'arithmetic' : 'command-substitution');
      i = next;
      literalStart = next;
      continue;
    }
    if (char === '$') {
      const next = readVariableEnd(source, i, end, !double);
      if (next > i + 1) {
        collector.push(literalStart, i, 'literal');
        collector.push(i, next, 'variable');
        i = next;
        literalStart = next;
        continue;
      }
    }
    if (!double && (char === '*' || char === '?' || char === '[')) {
      collector.push(literalStart, i, 'literal');
      collector.push(i, i + 1, 'glob');
      i++;
      literalStart = i;
      continue;
    }
    i++;
  }
  collector.push(literalStart, end, 'literal');
  return collector.parts;
}

function mergeProvenance(current: WordProvenance, next: WordProvenance): WordProvenance {
  if (next === 'command-substitution' || current === 'command-substitution') {
    return 'command-substitution';
  }
  if (next === 'arithmetic' || current === 'arithmetic') return 'arithmetic';
  if (next === 'variable' || current === 'variable') return 'variable';
  if (next === 'glob' || current === 'glob') return 'glob';
  return current;
}

function isBraceGroupOpening(source: string, start: number, end: number): boolean {
  return (
    start + 1 >= end ||
    isShellWhitespace(source[start + 1] ?? '') ||
    readConnector(source, start + 1) !== null
  );
}

const ENV_WRAPPER_OPTIONS_WITH_VALUE = new Set([
  '-u',
  '--unset',
  '-C',
  '--chdir',
  '-S',
  '--split-string',
  '-P',
]);
const SUDO_WRAPPER_OPTIONS_WITH_VALUE = new Set([
  '-u',
  '-g',
  '-C',
  '-D',
  '-h',
  '-p',
  '-r',
  '-t',
  '-T',
  '-U',
]);

function isCommandWordPosition(words: readonly CommandWord[]): boolean {
  let index = 0;

  while (index <= words.length) {
    while (/^[A-Za-z_][A-Za-z0-9_]*=/.test(words[index]?.text ?? '')) index++;
    if (index === words.length) return true;

    const next = getStandardWrapperPrefixEnd(words, index);
    if (next === undefined || next === null) return false;
    index = next;
  }

  return false;
}

function getStandardWrapperPrefixEnd(
  words: readonly CommandWord[],
  start: number,
): number | null | undefined {
  const wrapper = words[start]?.text.toLowerCase();
  if (wrapper === 'command') return getCommandPrefixEnd(words, start);
  if (wrapper === 'env') return getEnvPrefixEnd(words, start);
  if (wrapper === 'sudo') return getSudoPrefixEnd(words, start);
  return undefined;
}

function getCommandPrefixEnd(words: readonly CommandWord[], start: number): number | null {
  if (words[start + 1]?.text === '-v') return null;

  for (let index = start + 1; index < words.length; index++) {
    const token = words[index]?.text ?? '';
    if (token === '--') return index + 1;
    if (token === '-p' || token === '-v' || token === '-V' || /^-[pvV]+$/.test(token)) continue;
    return index;
  }

  return words.length;
}

function getEnvPrefixEnd(words: readonly CommandWord[], start: number): number | null {
  for (let index = start + 1; index < words.length; index++) {
    const token = words[index]?.text ?? '';
    if (token === '--') return index + 1;
    if (ENV_WRAPPER_OPTIONS_WITH_VALUE.has(token)) {
      if (words[index + 1] === undefined) return null;
      index++;
      continue;
    }
    if (
      token.startsWith('-u=') ||
      token.startsWith('--unset=') ||
      (token.startsWith('-C') && token.length > 2) ||
      token.startsWith('--chdir=') ||
      (token.startsWith('-S') && token.length > 2) ||
      token.startsWith('--split-string=') ||
      token.startsWith('-P')
    ) {
      continue;
    }
    if (token.startsWith('-') || /^[A-Za-z_][A-Za-z0-9_]*=/.test(token)) continue;
    return index;
  }

  return words.length;
}

function getSudoPrefixEnd(words: readonly CommandWord[], start: number): number | null {
  for (let index = start + 1; index < words.length; index++) {
    const token = words[index]?.text ?? '';
    if (token === '--') return index + 1;
    if (SUDO_WRAPPER_OPTIONS_WITH_VALUE.has(token)) {
      if (words[index + 1] === undefined) return null;
      index++;
      continue;
    }
    if (token.startsWith('-')) continue;
    return index;
  }

  return words.length;
}

export function expandPosixLiteralBraceWord(
  word: CommandWord,
  maxWords: number,
  maxExpansions: number,
  maxExpandedLength: number,
) {
  if (word.provenance !== 'literal' || !word.raw.includes('{')) return undefined;

  const expanded = expandBraceValues(word.raw, maxWords, maxExpansions, maxExpandedLength, true);
  if (!expanded) return undefined;
  if ('limited' in expanded) return { limited: true as const };

  const words = expanded.values.map((value) => decodePosixLiteralWord(value, maxExpansions));
  if (words.some((value) => value === null)) return { limited: true as const };
  return {
    words: [...new Set(words.filter((value): value is string => value !== null && value !== ''))],
  };
}

function expandLiteralCommandWord(
  source: string,
  word: CommandWord,
  maxWords: number,
  maxDepth: number,
  maxExpandedLength: number,
):
  | {
      words?: CommandWord[];
      limitCode?: 'word-limit' | 'depth-limit' | 'brace-expansion-limit';
    }
  | undefined {
  if (word.provenance !== 'literal' || !word.raw.includes('{')) return undefined;

  const expanded = expandBraceValues(word.raw, maxWords, maxDepth, maxExpandedLength, false);
  if (!expanded) return undefined;
  if ('limited' in expanded) {
    if (expanded.limited === 'expansions') return { limitCode: 'depth-limit' };
    return { limitCode: expanded.limited === 'length' ? 'brace-expansion-limit' : 'word-limit' };
  }

  const texts = expanded.values.map((value) => decodePosixLiteralWord(value, maxDepth));
  if (texts.some((text) => text === null)) return undefined;
  return {
    words: texts
      .filter((text): text is string => text !== null && text !== '')
      .map((text) =>
        freezeParsedCommandWord(source, word.span.start, word.span.end, text, 'literal', false),
      ),
  };
}

function expandBraceValues(
  raw: string,
  maxWords: number,
  maxExpansions: number,
  maxExpandedLength: number,
  ranges: boolean,
): { values: string[] } | { limited: 'expansions' | 'length' | 'words' } | undefined {
  const values = [raw];
  let totalLength = raw.length;
  let expansions = 0;
  while (true) {
    const valueIndex = values.findIndex((value) => findActiveBraceExpansion(value, ranges));
    if (valueIndex === -1) break;
    if (++expansions > maxExpansions) return { limited: 'expansions' };
    const value = values[valueIndex] ?? '';
    const expansion = findActiveBraceExpansion(value, ranges);
    if (!expansion || expansion.kind === 'range') return { limited: 'expansions' };
    const fixedLength = expansion.start + value.length - expansion.end;
    const replacementsLength = expansion.alternatives.reduce(
      (total, alternative) => total + fixedLength + alternative.length,
      0,
    );
    if (totalLength - value.length + replacementsLength > maxExpandedLength) {
      return { limited: 'length' };
    }
    if (values.length - 1 + expansion.alternatives.length > maxWords) {
      return { limited: 'words' };
    }
    values.splice(valueIndex, 1, ...buildBraceReplacements(value, expansion));
    totalLength += replacementsLength - value.length;
  }

  return expansions === 0 ? undefined : { values };
}

function findActiveBraceExpansion(value: string, ranges: boolean) {
  const stack: { start: number; commas: number[] }[] = [];
  let selected:
    | { kind: 'alternatives'; start: number; end: number; commas: number[] }
    | { kind: 'range'; start: number; end: number }
    | undefined;
  let quote: "'" | '"' | null = null;
  let escaped = false;
  for (let index = 0; index < value.length; index++) {
    const char = value[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\' && quote !== "'") {
      escaped = true;
      continue;
    }
    if (char === quote) {
      quote = null;
      continue;
    }
    if (quote === null && (char === "'" || char === '"')) {
      quote = char;
      continue;
    }
    if (quote !== null) continue;
    if (char === '{') {
      stack.push({ start: index, commas: [] });
      continue;
    }
    if (char === ',' && stack.length > 0) {
      stack.at(-1)?.commas.push(index);
      continue;
    }
    if (char !== '}' || stack.length === 0) continue;
    const frame = stack.pop();
    if (!frame) continue;
    const candidate =
      frame.commas.length > 0
        ? ({
            kind: 'alternatives',
            start: frame.start,
            end: index + 1,
            commas: frame.commas,
          } as const)
        : ranges && isActiveBraceRange(value.slice(frame.start + 1, index))
          ? ({ kind: 'range', start: frame.start, end: index + 1 } as const)
          : undefined;
    if (candidate && (!selected || candidate.start < selected.start)) selected = candidate;
  }

  if (!selected || selected.kind === 'range') return selected;
  return {
    kind: selected.kind,
    start: selected.start,
    end: selected.end,
    alternatives: sliceBraceAlternatives(value, selected),
  };
}

function buildBraceReplacements(
  value: string,
  expansion: { start: number; end: number; alternatives: readonly string[] },
) {
  return expansion.alternatives.map(
    (alternative) =>
      `${value.slice(0, expansion.start)}${alternative}${value.slice(expansion.end)}`,
  );
}

function sliceBraceAlternatives(
  value: string,
  expansion: { start: number; end: number; commas: readonly number[] },
) {
  const boundaries = [expansion.start, ...expansion.commas, expansion.end - 1];
  return boundaries
    .slice(0, -1)
    .map((start, index) => value.slice(start + 1, boundaries[index + 1]));
}

function isActiveBraceRange(value: string): boolean {
  return (
    /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(value) ||
    /^[A-Za-z]\.\.[A-Za-z](?:\.\.-?\d+)?$/.test(value)
  );
}

function decodePosixLiteralWord(value: string, maxDepth: number): string | null {
  const source = `x${value}`;
  const result = readWord(
    source,
    0,
    source.length,
    { maxInputLength: source.length, maxWords: 1, maxDepth },
    { used: 0, max: 1 },
    0,
  );
  if (
    result.limited ||
    result.issues.length > 0 ||
    result.next !== source.length ||
    result.word.provenance !== 'literal'
  ) {
    return null;
  }
  return result.word.text.slice(1);
}

function limitedProgram(source: string, start: number, end: number, code: string): CommandProgram {
  return freezeCommandProgram({
    kind: 'program',
    dialect: 'posix',
    source: source.slice(start, end),
    span: { start, end },
    status: 'limited',
    issues: [{ code, message: 'command structure exceeds parser limit' }],
    nodes: [],
  });
}

function limitedResult(
  nodes: CommandNode[],
  issues: CommandIssue[],
  next: number,
  code: string,
  limit: number,
): ScanResult {
  return {
    nodes,
    issues: [
      ...issues,
      {
        code,
        message: `command structure exceeds parser limit ${limit}`,
      },
    ],
    next,
    closed: false,
    limited: true,
    pendingHeredocs: [],
  };
}

function propagatedLimitResult(
  nodes: CommandNode[],
  issues: CommandIssue[],
  next: number,
): ScanResult {
  return { nodes, issues, next, closed: false, limited: true, pendingHeredocs: [] };
}

function consumeWord(budget: WordBudget): boolean {
  budget.used++;
  return budget.used <= budget.max;
}

function readFunctionOpening(
  source: string,
  start: number,
  end: number,
): FunctionOpening | undefined {
  const slice = source.slice(start, end);
  const match =
    /^(?:function[ \t]+)?([A-Za-z_][A-Za-z0-9_]*)[ \t]*\([ \t]*\)[ \t]*\{/.exec(slice) ??
    /^function[ \t]+([A-Za-z_][A-Za-z0-9_]*)[ \t]+\{/.exec(slice);
  const name = match?.[1];
  if (!match || !name) return undefined;
  return { name, braceIndex: start + match[0].lastIndexOf('{') };
}

function containsHeredoc(nodes: readonly CommandNode[]): boolean {
  return nodes.some((node) => {
    if (node.kind === 'command') {
      return (
        node.redirections.some((redirection) => redirection.heredoc) ||
        node.nested.some((program) => containsHeredoc(program.nodes))
      );
    }
    return (node.kind === 'group' || node.kind === 'function') && containsHeredoc(node.body.nodes);
  });
}

function unterminatedHeredocIssues(pending: readonly PendingHeredoc[]): CommandIssue[] {
  return pending.map((declaration) => ({
    code: 'unterminated-heredoc',
    message: `heredoc delimiter ${declaration.delimiter} was not found`,
  }));
}

function isExecutableNode(node: CommandNode | undefined): boolean {
  return node?.kind === 'command' || node?.kind === 'group' || node?.kind === 'function';
}

function appendMissingCommandIssue(nodes: readonly CommandNode[], issues: CommandIssue[]): void {
  const trailing = nodes.at(-1);
  if (trailing?.kind !== 'connector' || !CONTINUATION_CONNECTORS.has(trailing.operator)) return;
  issues.push({
    code: 'missing-command-after-connector',
    message: `connector ${trailing.operator} requires a following command`,
  });
}

function isReservedCommandPrefix(word: CommandWord | undefined): boolean {
  return (
    word?.provenance === 'literal' &&
    !word.quoted &&
    word.raw === word.text &&
    RESERVED_COMMAND_PREFIXES.has(word.text)
  );
}

function appendMissingConnectorIssue(nodes: readonly CommandNode[], issues: CommandIssue[]): void {
  const previous = nodes.at(-1);
  if (!isExecutableNode(previous)) return;
  if (previous?.kind === 'command' && isReservedCommandPrefix(previous.words[0])) return;
  issues.push({
    code: 'missing-command-connector',
    message: 'adjacent commands require a connector',
  });
}

function isCommentStart(source: string, index: number, start: number): boolean {
  return index === start || /[\s;&|()]/u.test(source[index - 1] ?? '');
}
