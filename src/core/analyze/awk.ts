export const AWK_INTERPRETERS = new Set(['awk', 'gawk', 'nawk', 'mawk']);

export const REASON_AWK_SYSTEM_DYNAMIC =
  'Detected awk system() call with dynamic command that cannot be safely analyzed.';

export function analyzeAwkSystemCalls(
  tokens: readonly string[],
  analyzeNested: (command: string) => string | null,
): string | null {
  for (const token of tokens.slice(1)) {
    if (!token.includes('system')) continue;

    const commands = extractAwkSystemCommands(token);
    if (!commands) continue;
    if (commands.dynamic) return REASON_AWK_SYSTEM_DYNAMIC;

    for (const command of commands.commands) {
      const reason = analyzeNested(command);
      if (reason) return reason;
    }
  }
  return null;
}

function extractAwkSystemCommands(code: string): { dynamic: boolean; commands: string[] } | null {
  const commands: string[] = [];
  let sawSystem = false;
  let searchIndex = 0;

  while (searchIndex < code.length) {
    const systemIndex = code.indexOf('system', searchIndex);
    if (systemIndex === -1) break;
    searchIndex = systemIndex + 'system'.length;

    if (
      !isAwkIdentifierBoundary(code[systemIndex - 1]) ||
      !isAwkIdentifierBoundary(code[searchIndex])
    ) {
      continue;
    }

    let i = skipAwkWhitespace(code, searchIndex);
    if (code[i] !== '(') continue;
    i = skipAwkWhitespace(code, i + 1);

    const quote = code[i];
    if (quote !== '"' && quote !== "'") {
      sawSystem = true;
      continue;
    }

    const parsed = readAwkStringLiteral(code, i, quote);
    if (!parsed) {
      sawSystem = true;
      continue;
    }

    i = skipAwkWhitespace(code, parsed.endIndex);
    sawSystem = true;
    if (code[i] !== ')') {
      return { dynamic: true, commands };
    }
    commands.push(parsed.value);
    searchIndex = i + 1;
  }

  if (!sawSystem) return null;
  return commands.length > 0 ? { dynamic: false, commands } : { dynamic: true, commands };
}

function isAwkIdentifierBoundary(char: string | undefined): boolean {
  return !char || !/[A-Za-z0-9_]/.test(char);
}

function skipAwkWhitespace(code: string, index: number): number {
  let i = index;
  while (/\s/.test(code[i] ?? '')) {
    i++;
  }
  return i;
}

function readAwkStringLiteral(
  code: string,
  startIndex: number,
  quote: '"' | "'",
): { value: string; endIndex: number } | null {
  let value = '';
  let escaped = false;

  for (let i = startIndex + 1; i < code.length; i++) {
    const char = code[i];
    if (!char) break;

    if (escaped) {
      value += char;
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === quote) {
      return { value, endIndex: i + 1 };
    }

    value += char;
  }

  return null;
}
