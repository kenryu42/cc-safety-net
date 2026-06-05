import { type ParseEntry, parse } from 'shell-quote';
import { SHELL_OPERATORS } from '@/types';
import { ENV_PROXY, getCommandTokenText, hasUnclosedQuotes } from './shared';

const ARITHMETIC_SENTINEL = '__CC_SAFETY_NET_ARITH_SENTINEL__';
const BACKTICK_ATTACHED_SUFFIX_SENTINEL = '__CC_SAFETY_NET_BACKTICK_SUFFIX__';

export interface ShellCommandSegmentInfo {
  tokens: string[];
  hasDynamicSubstitution: boolean;
}

export function splitShellCommands(command: string): string[][] {
  return splitShellCommandsWithInfo(command).map((segment) => segment.tokens);
}

export function splitShellCommandsWithInfo(command: string): ShellCommandSegmentInfo[] {
  if (hasUnclosedQuotes(command)) {
    return [{ tokens: [command], hasDynamicSubstitution: false }];
  }
  const normalizedCommand = _stripAttachedIoNumbers(
    _normalizeAnsiCQuotes(command).replace(/\n/g, ' ; '),
  );
  const tokens = parse(normalizedCommand, ENV_PROXY);
  const segments: ShellCommandSegmentInfo[] = [];
  let current: string[] = [];
  let currentHasDynamicSubstitution = false;
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i] as ParseEntry;
    if (isOperator(token)) {
      if (current.length > 0) {
        segments.push({
          tokens: current,
          hasDynamicSubstitution: currentHasDynamicSubstitution,
        });
        current = [];
        currentHasDynamicSubstitution = false;
      }
      i++;
      continue;
    }

    if (_isProcessSubstitutionStart(tokens, i)) {
      if (current.length > 0) {
        segments.push({
          tokens: current,
          hasDynamicSubstitution: currentHasDynamicSubstitution,
        });
        current = [];
        currentHasDynamicSubstitution = false;
      }
      const { innerSegments, endIndex } = extractProcessSubstitution(tokens, i);
      for (const seg of innerSegments) {
        segments.push({ tokens: seg, hasDynamicSubstitution: false });
      }
      i = endIndex + 1;
      continue;
    }

    if (_isRedirectOp(token)) {
      const { redirectTarget, advance } = _getRedirectTargetInfo(tokens, i);
      if (redirectTarget !== null) {
        _pushInlineSubstitutionSegmentInfos(segments, redirectTarget);
      }
      i += advance;
      continue;
    }

    if (_isCommandSubstitutionStart(tokens, i)) {
      const substitution = getCommandSubstitution(tokens, i);

      if (current.length > 0) {
        currentHasDynamicSubstitution = true;
        if (!substitution.shouldKeepCurrent) {
          segments.push({
            tokens: current,
            hasDynamicSubstitution: currentHasDynamicSubstitution,
          });
          current = [];
          currentHasDynamicSubstitution = false;
        }
      }
      for (const seg of substitution.innerSegments) {
        segments.push({ tokens: seg, hasDynamicSubstitution: false });
      }
      if (substitution.shouldKeepCurrent && substitution.attachedSuffix) {
        current.push(substitution.attachedSuffix);
      }
      i = substitution.endIndex + (substitution.attachedSuffix !== null ? 2 : 1);
      continue;
    }

    if (_isAttachedCommandSubstitutionStart(tokens, i)) {
      const tokenText = tokens[i];
      if (typeof tokenText === 'string') {
        const prefix = tokenText.slice(0, -1);
        if (prefix) {
          current.push(prefix);
        }
      }
      currentHasDynamicSubstitution = current.length > 0;
      const { innerSegments, endIndex } = extractCommandSubstitution(tokens, i + 2);
      for (const seg of innerSegments) {
        segments.push({ tokens: seg, hasDynamicSubstitution: false });
      }
      i = endIndex + 1;
      continue;
    }

    const tokenText = getCommandTokenText(token);
    if (tokenText === null) {
      if (token && typeof token === 'object' && 'op' in token && typeof token.op === 'string') {
        _pushInlineSubstitutionSegmentInfos(segments, token.op);
      }
      i++;
      continue;
    }

    _pushInlineSubstitutionSegmentInfos(segments, tokenText);
    current.push(tokenText);
    i++;
  }

  if (current.length > 0) {
    segments.push({
      tokens: current,
      hasDynamicSubstitution: currentHasDynamicSubstitution,
    });
  }

  return segments;
}

interface QuoteScanState {
  inSingle: boolean;
  inDouble: boolean;
  escaped: boolean;
}

function extractInlineCommandSubstitutions(token: string): string[][] {
  const segments: string[][] = [];
  let i = 0;
  const quoteState: QuoteScanState = { inSingle: false, inDouble: false, escaped: false };

  while (i < token.length) {
    const char = token[i];
    if (!char) {
      break;
    }

    if (advanceQuotedScanState(char, quoteState)) {
      i++;
      continue;
    }

    if (!quoteState.inSingle && char === '$' && token[i + 1] === '(' && token[i + 2] !== '(') {
      const end = _findInlineCommandSubstitutionEnd(token, i + 2);
      if (end === -1) {
        break;
      }

      const innerCommand = token.slice(i + 2, end);
      if (innerCommand.trim()) {
        const innerSegments = splitShellCommands(innerCommand);
        for (const seg of innerSegments) {
          segments.push(seg);
        }
      }
      i = end + 1;
      continue;
    }

    i++;
  }

  return segments;
}

function isParenOpen(token: ParseEntry | undefined): boolean {
  return typeof token === 'object' && token !== null && 'op' in token && token.op === '(';
}

function isParenClose(token: ParseEntry | undefined): boolean {
  return typeof token === 'object' && token !== null && 'op' in token && token.op === ')';
}

function getCommandSubstitution(tokens: ParseEntry[], index: number) {
  const { innerSegments, endIndex } = extractCommandSubstitution(tokens, index + 2);
  const attachedSuffix = _getBacktickAttachedSuffix(tokens[endIndex + 1]);
  return {
    innerSegments,
    endIndex,
    attachedSuffix,
    shouldKeepCurrent:
      attachedSuffix !== null &&
      !_isRedirectOp(tokens[index - 1]) &&
      !isOperatorToken(tokens[index - 1]),
  };
}

function extractCommandSubstitution(
  tokens: ParseEntry[],
  startIndex: number,
): { innerSegments: string[][]; endIndex: number } {
  if (tokens[startIndex] === ARITHMETIC_SENTINEL) {
    return _extractArithmeticSubstitution(tokens, startIndex);
  }

  const innerSegments: string[][] = [];
  let currentSegment: string[] = [];
  let depth = 1;
  let i = startIndex;

  while (i < tokens.length && depth > 0) {
    const token = tokens[i];

    if (isParenOpen(token)) {
      depth++;
      i++;
      continue;
    }

    if (isParenClose(token)) {
      depth--;
      if (depth === 0) break;
      i++;
      continue;
    }

    if (depth === 1 && token && isOperator(token)) {
      if (currentSegment.length > 0) {
        innerSegments.push(currentSegment);
        currentSegment = [];
      }
      i++;
      continue;
    }

    if (depth === 1 && _isProcessSubstitutionStart(tokens, i)) {
      if (currentSegment.length > 0) {
        innerSegments.push(currentSegment);
        currentSegment = [];
      }
      const { innerSegments: nestedSegments, endIndex } = extractProcessSubstitution(tokens, i);
      for (const seg of nestedSegments) {
        innerSegments.push(seg);
      }
      i = endIndex + 1;
      continue;
    }

    if (depth === 1 && _isRedirectOp(token)) {
      const { redirectTarget, advance } = _getRedirectTargetInfo(tokens, i);
      if (redirectTarget !== null) {
        _pushInlineSubstitutionSegments(innerSegments, redirectTarget);
      }
      i += advance;
      continue;
    }

    if (depth === 1 && _isCommandSubstitutionStart(tokens, i)) {
      const substitution = getCommandSubstitution(tokens, i);

      if (!substitution.shouldKeepCurrent && currentSegment.length > 0) {
        innerSegments.push(currentSegment);
        currentSegment = [];
      }
      for (const seg of substitution.innerSegments) {
        innerSegments.push(seg);
      }
      if (substitution.shouldKeepCurrent && substitution.attachedSuffix) {
        currentSegment.push(substitution.attachedSuffix);
      }
      i = substitution.endIndex + (substitution.attachedSuffix !== null ? 2 : 1);
      continue;
    }

    if (depth === 1 && _isAttachedCommandSubstitutionStart(tokens, i)) {
      if (typeof token === 'string') {
        const prefix = token.slice(0, -1);
        if (prefix) {
          currentSegment.push(prefix);
        }
      }
      const { innerSegments: nestedSegments, endIndex } = extractCommandSubstitution(
        tokens as ParseEntry[],
        i + 2,
      );
      for (const seg of nestedSegments) {
        innerSegments.push(seg);
      }
      i = endIndex + 1;
      continue;
    }

    const tokenText = getCommandTokenText(token);
    if (tokenText !== null) {
      currentSegment.push(tokenText);
    }
    i++;
  }

  if (currentSegment.length > 0) {
    innerSegments.push(currentSegment);
  }

  return { innerSegments, endIndex: i };
}

function _extractArithmeticSubstitution(
  tokens: readonly ParseEntry[],
  startIndex: number,
): { innerSegments: string[][]; endIndex: number } {
  const innerSegments: string[][] = [];
  let expression = '';
  let depth = 1;
  let i = startIndex + 1;

  while (i < tokens.length) {
    const token = tokens[i];

    if (_isCommandSubstitutionStart(tokens, i)) {
      const nested = extractArithmeticNestedCommand(innerSegments, expression, tokens, i + 2);
      expression = nested.expression;
      i = nested.endIndex + 1;
      continue;
    }

    if (_isAttachedCommandSubstitutionStart(tokens, i)) {
      const tokenText = tokens[i];
      if (typeof tokenText === 'string') {
        expression += tokenText.slice(0, -1);
      }
      const nested = extractArithmeticNestedCommand(innerSegments, expression, tokens, i + 2);
      expression = nested.expression;
      i = nested.endIndex + 1;
      continue;
    }

    if (isParenOpen(token)) {
      depth++;
      expression += '(';
      i++;
      continue;
    }

    if (isParenClose(token)) {
      depth--;
      if (depth === 0) {
        return {
          innerSegments: expression ? [...innerSegments, [expression]] : innerSegments,
          endIndex: i,
        };
      }
      expression += ')';
      i++;
      continue;
    }

    if (typeof token === 'string') {
      _pushInlineSubstitutionSegments(innerSegments, token);
      expression += token;
      i++;
      continue;
    }

    if (token && typeof token === 'object') {
      if ('pattern' in token && typeof token.pattern === 'string') {
        expression += token.pattern;
        i++;
        continue;
      }

      if ('op' in token) {
        expression += String(token.op);
      }
    }
    i++;
  }

  return {
    innerSegments: expression ? [...innerSegments, [expression]] : innerSegments,
    endIndex: i,
  };
}

function extractArithmeticNestedCommand(
  innerSegments: string[][],
  expression: string,
  tokens: readonly ParseEntry[],
  startIndex: number,
): { expression: string; endIndex: number } {
  if (expression) {
    innerSegments.push([expression]);
  }
  const { innerSegments: nestedSegments, endIndex } = extractCommandSubstitution(
    tokens as ParseEntry[],
    startIndex,
  );
  for (const seg of nestedSegments) {
    innerSegments.push(seg);
  }
  return { expression: '', endIndex };
}

function _pushInlineSubstitutionSegments(segments: string[][], token: string): void {
  const inlineSegments = extractInlineCommandSubstitutions(token);
  for (const seg of inlineSegments) {
    segments.push(seg);
  }
}

function _pushInlineSubstitutionSegmentInfos(
  segments: ShellCommandSegmentInfo[],
  token: string,
): void {
  const inlineSegments = extractInlineCommandSubstitutions(token);
  for (const seg of inlineSegments) {
    segments.push({ tokens: seg, hasDynamicSubstitution: false });
  }
}

function _normalizeAnsiCQuotes(command: string): string {
  let result = '';
  let inSingle = false;
  let inDouble = false;
  let escaped = false;

  for (let i = 0; i < command.length; ) {
    const char = command[i];
    if (!char) break;

    if (escaped) {
      result += char;
      escaped = false;
      i++;
      continue;
    }

    if (!inSingle && char === '\\') {
      result += char;
      escaped = true;
      i++;
      continue;
    }

    if (!inSingle && !inDouble && command.startsWith("$'", i)) {
      const parsed = _readAnsiCString(command, i + 2);
      if (!parsed) {
        result += char;
        i++;
        continue;
      }
      result += _singleQuoteShellToken(parsed.value);
      i = parsed.endIndex + 1;
      continue;
    }

    if (!inDouble && char === "'") {
      inSingle = !inSingle;
    } else if (!inSingle && char === '"') {
      inDouble = !inDouble;
    }

    result += char;
    i++;
  }

  return result;
}

function _readAnsiCString(
  command: string,
  startIndex: number,
): { value: string; endIndex: number } | null {
  let value = '';

  for (let i = startIndex; i < command.length; i++) {
    const char = command[i];
    if (!char) break;

    if (char === "'") {
      return { value, endIndex: i };
    }

    if (char !== '\\') {
      value += char;
      continue;
    }

    const decoded = _readAnsiEscape(command, i + 1);
    value += decoded.value;
    i = decoded.endIndex;
  }

  return null;
}

function _readAnsiEscape(command: string, index: number): { value: string; endIndex: number } {
  const char = command[index];
  if (!char) return { value: '\\', endIndex: index };

  const simpleEscapes: Record<string, string> = {
    a: '\x07',
    b: '\b',
    e: '\x1b',
    E: '\x1b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t',
    v: '\v',
    '\\': '\\',
    "'": "'",
    '"': '"',
  };
  if (Object.hasOwn(simpleEscapes, char)) {
    return { value: simpleEscapes[char] ?? char, endIndex: index };
  }

  if (char === 'x') {
    return _readFixedBaseEscape(command, index + 1, 16, 2, index);
  }

  if (char === 'u') {
    return _readFixedBaseEscape(command, index + 1, 16, 4, index);
  }

  if (char === 'U') {
    return _readFixedBaseEscape(command, index + 1, 16, 8, index);
  }

  if (/[0-7]/.test(char)) {
    return _readFixedBaseEscape(command, index, 8, 3, index - 1);
  }

  return { value: char, endIndex: index };
}

function _readFixedBaseEscape(
  command: string,
  startIndex: number,
  base: 8 | 16,
  maxLength: number,
  fallbackEndIndex: number,
): { value: string; endIndex: number } {
  let digits = '';
  let endIndex = startIndex - 1;
  const digitRegex = base === 16 ? /[0-9a-fA-F]/ : /[0-7]/;

  for (let i = startIndex; i < command.length && digits.length < maxLength; i++) {
    const char = command[i];
    if (!char || !digitRegex.test(char)) break;
    digits += char;
    endIndex = i;
  }

  if (!digits) {
    return { value: command[fallbackEndIndex] ?? '', endIndex: fallbackEndIndex };
  }

  return { value: String.fromCodePoint(Number.parseInt(digits, base)), endIndex };
}

function _singleQuoteShellToken(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function _stripAttachedIoNumbers(command: string): string {
  let result = '';
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  let atTokenBoundary = true;
  let arithmeticParenDepth = 0;

  for (let i = 0; i < command.length; ) {
    const char = command[i];
    if (!char) {
      break;
    }

    if (escaped) {
      result += char;
      escaped = false;
      atTokenBoundary = false;
      i++;
      continue;
    }

    if (!inSingle && char === '\\') {
      result += char;
      escaped = true;
      i++;
      continue;
    }

    if (!inDouble && char === "'") {
      result += char;
      inSingle = !inSingle;
      atTokenBoundary = false;
      i++;
      continue;
    }

    if (!inSingle && char === '"') {
      result += char;
      inDouble = !inDouble;
      atTokenBoundary = false;
      i++;
      continue;
    }

    if (!inSingle && char === '`') {
      const endIndex = _findBacktickEnd(command, i + 1);
      if (endIndex === -1) {
        result += char;
        atTokenBoundary = false;
        i++;
        continue;
      }

      result += `$(${command.slice(i + 1, endIndex)})`;
      if (
        atTokenBoundary &&
        command[endIndex + 1] &&
        _isPathLikeBacktickSuffix(command[endIndex + 1] as string)
      ) {
        result += BACKTICK_ATTACHED_SUFFIX_SENTINEL;
      }
      atTokenBoundary = false;
      i = endIndex + 1;
      continue;
    }

    if (!inSingle && !inDouble) {
      if (arithmeticParenDepth === 0 && command.startsWith('$((', i)) {
        result += `$( ${ARITHMETIC_SENTINEL} `;
        arithmeticParenDepth = 1;
        atTokenBoundary = false;
        i += 3;
        continue;
      }

      if (arithmeticParenDepth > 0) {
        if (char === '(') {
          arithmeticParenDepth++;
          result += char;
        } else if (char === ')') {
          arithmeticParenDepth--;
          if (arithmeticParenDepth === 0) {
            result += ')';
            if (command[i + 1] === ')') {
              i += 2;
            } else {
              i++;
            }
            atTokenBoundary = false;
            continue;
          }
          result += char;
        } else {
          result += char;
        }
        atTokenBoundary = false;
        i++;
        continue;
      }

      if (_isWhitespaceChar(char)) {
        result += char;
        atTokenBoundary = true;
        i++;
        continue;
      }

      if (atTokenBoundary && _isAsciiDigit(char)) {
        let end = i + 1;
        while (end < command.length) {
          const nextChar = command[end];
          if (!nextChar || !_isAsciiDigit(nextChar)) {
            break;
          }
          end++;
        }

        const redirectOpLength = _getRawRedirectOpLength(command, end);
        if (redirectOpLength > 0) {
          i = end;
          atTokenBoundary = true;
          continue;
        }
      }
    }

    result += char;
    atTokenBoundary = _isShellTokenBoundaryChar(char);
    i++;
  }

  return result;
}

function isOperator(token: ParseEntry): boolean {
  return (
    typeof token === 'object' &&
    token !== null &&
    'op' in token &&
    SHELL_OPERATORS.has(token.op as string)
  );
}

function isOperatorToken(token: ParseEntry | undefined): boolean {
  return token !== undefined && isOperator(token);
}

const REDIRECT_OPS = new Set(['>', '>>', '<', '>&', '<&', '>|']);
const RAW_REDIRECT_OPS = ['>>', '>&', '<&', '>|', '>', '<'];

function _isRedirectOp(token: ParseEntry | undefined): boolean {
  return (
    typeof token === 'object' &&
    token !== null &&
    'op' in token &&
    REDIRECT_OPS.has(token.op as string)
  );
}

function _isCommandSubstitutionStart(tokens: readonly ParseEntry[], index: number): boolean {
  return tokens[index] === '$' && isParenOpen(tokens[index + 1]);
}

function _isAttachedCommandSubstitutionStart(
  tokens: readonly ParseEntry[],
  index: number,
): boolean {
  const token = tokens[index];
  return (
    typeof token === 'string' &&
    token !== '$' &&
    token.endsWith('$') &&
    isParenOpen(tokens[index + 1])
  );
}

function _getBacktickAttachedSuffix(token: ParseEntry | undefined): string | null {
  return typeof token === 'string' && token.startsWith(BACKTICK_ATTACHED_SUFFIX_SENTINEL)
    ? token.slice(BACKTICK_ATTACHED_SUFFIX_SENTINEL.length)
    : null;
}

function _isProcessSubstitutionStart(tokens: readonly ParseEntry[], index: number): boolean {
  const token = tokens[index];
  return (
    typeof token === 'object' &&
    token !== null &&
    'op' in token &&
    (token.op === '<(' || (token.op === '>' && isParenOpen(tokens[index + 1])))
  );
}

function extractProcessSubstitution(
  tokens: readonly ParseEntry[],
  startIndex: number,
): { innerSegments: string[][]; endIndex: number } {
  const token = tokens[startIndex];
  if (typeof token === 'object' && token !== null && 'op' in token && token.op === '<(') {
    return extractCommandSubstitution(tokens as ParseEntry[], startIndex + 1);
  }

  if (_isProcessSubstitutionStart(tokens, startIndex)) {
    return extractCommandSubstitution(tokens as ParseEntry[], startIndex + 2);
  }

  return { innerSegments: [], endIndex: startIndex };
}

function _getRedirectTargetInfo(
  tokens: readonly ParseEntry[],
  index: number,
): { redirectTarget: string | null; advance: number } {
  if (
    _isCommandSubstitutionStart(tokens, index + 1) ||
    _isProcessSubstitutionStart(tokens, index + 1)
  ) {
    return { redirectTarget: null, advance: 1 };
  }

  const firstTarget = tokens[index + 1];
  if (typeof firstTarget !== 'string') {
    const isGlobTarget =
      firstTarget &&
      typeof firstTarget === 'object' &&
      'pattern' in firstTarget &&
      typeof firstTarget.pattern === 'string';
    return { redirectTarget: null, advance: isGlobTarget ? 2 : 1 };
  }

  let redirectTarget = firstTarget;
  let nextIndex = index + 2;

  if (firstTarget.endsWith('$') && isParenOpen(tokens[nextIndex])) {
    const { text, consumed } = _collectParenthesizedTokens(tokens, nextIndex);
    if (consumed > 0) {
      redirectTarget += text;
      nextIndex += consumed;
    }
  }

  return {
    redirectTarget,
    advance: nextIndex - index,
  };
}

function _findInlineCommandSubstitutionEnd(token: string, startIndex: number): number {
  let depth = 1;
  const quoteState: QuoteScanState = { inSingle: false, inDouble: false, escaped: false };

  for (let i = startIndex; i < token.length; i++) {
    const char = token[i];
    if (!char) {
      break;
    }

    if (advanceQuotedScanState(char, quoteState)) {
      continue;
    }

    if (!quoteState.inSingle && !quoteState.inDouble) {
      if (char === '(') {
        depth++;
      } else if (char === ')') {
        depth--;
        if (depth === 0) {
          return i;
        }
      }
    }
  }

  return -1;
}

function advanceQuotedScanState(char: string, state: QuoteScanState): boolean {
  if (state.escaped) {
    state.escaped = false;
    return true;
  }

  if (char === '\\' && !state.inSingle) {
    state.escaped = true;
    return true;
  }

  if (!state.inDouble && char === "'") {
    state.inSingle = !state.inSingle;
    return true;
  }

  if (!state.inSingle && char === '"') {
    state.inDouble = !state.inDouble;
    return true;
  }

  return false;
}

function _findBacktickEnd(command: string, startIndex: number): number {
  let escaped = false;

  for (let i = startIndex; i < command.length; i++) {
    const char = command[i];
    if (!char) {
      break;
    }

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '`') {
      return i;
    }
  }

  return -1;
}

function _collectParenthesizedTokens(
  tokens: readonly ParseEntry[],
  startIndex: number,
): { text: string; consumed: number } {
  if (!isParenOpen(tokens[startIndex])) {
    return { text: '', consumed: 0 };
  }

  const parts: string[] = [];
  let depth = 0;
  let i = startIndex;

  while (i < tokens.length) {
    const token = tokens[i];
    if (isParenOpen(token)) {
      depth++;
    } else if (isParenClose(token)) {
      depth--;
    }

    const piece = _stringifyParseEntry(token);
    if (piece) {
      parts.push(piece);
    }

    i++;
    if (depth === 0) {
      break;
    }
  }

  return { text: parts.join(' '), consumed: i - startIndex };
}

function _stringifyParseEntry(token: ParseEntry | undefined): string {
  if (typeof token === 'string') {
    return token;
  }

  if (token && typeof token === 'object') {
    if ('pattern' in token && typeof token.pattern === 'string') {
      return token.pattern;
    }

    if ('op' in token) {
      return String(token.op);
    }
  }

  return '';
}

function _getRawRedirectOpLength(command: string, index: number): number {
  for (const op of RAW_REDIRECT_OPS) {
    if (command.startsWith(op, index)) {
      return op.length;
    }
  }

  return 0;
}

function _isWhitespaceChar(char: string): boolean {
  return /\s/.test(char);
}

function _isAsciiDigit(char: string): boolean {
  return char >= '0' && char <= '9';
}

function _isPathLikeBacktickSuffix(char: string): boolean {
  return char === '/' || char === '.';
}

function _isShellTokenBoundaryChar(char: string): boolean {
  return _isWhitespaceChar(char) || ';|&()<>'.includes(char);
}
