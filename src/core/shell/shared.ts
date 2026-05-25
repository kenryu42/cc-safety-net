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

  for (const char of command) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
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
