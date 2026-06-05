import type { ParseEntry } from 'shell-quote';

export const ENV_PROXY = new Proxy(
  {},
  {
    get: (_, name) => `$${String(name)}`,
  },
);

export function hasUnclosedQuotes(command: string): boolean {
  let inSingle = false;
  let inDouble = false;
  let escaped = false;

  for (let i = 0; i < command.length; i++) {
    const char = command[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '#' && !inSingle && !inDouble && startsShellComment(command, i)) {
      break;
    }
    if (char === '\\' && !inSingle) {
      escaped = true;
      continue;
    }
    if (char === "'" && !inDouble) {
      inSingle = !inSingle;
    } else if (char === '"' && !inSingle) {
      inDouble = !inDouble;
    }
  }

  return inSingle || inDouble;
}

function startsShellComment(command: string, index: number): boolean {
  return index === 0 || /\s/.test(command[index - 1] ?? '');
}

export function getCommandTokenText(token: ParseEntry | undefined): string | null {
  if (typeof token === 'string') {
    return token;
  }

  if (
    token &&
    typeof token === 'object' &&
    'pattern' in token &&
    typeof token.pattern === 'string'
  ) {
    return token.pattern;
  }

  return null;
}
