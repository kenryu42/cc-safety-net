export function extractFlagArg(
  tokens: readonly string[],
  flags: readonly string[],
  options?: { rejectDashNext?: boolean },
): string | null {
  const rejectDashNext = options?.rejectDashNext ?? false;
  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) continue;

    if (flags.includes(token) && tokens[i + 1]) {
      return tokens[i + 1] ?? null;
    }

    if (
      token.startsWith('-') &&
      !token.startsWith('--') &&
      flags.some((flag) => token.includes(flag[1] ?? ''))
    ) {
      const nextToken = tokens[i + 1];
      if (!nextToken) continue;
      if (rejectDashNext && nextToken.startsWith('-')) continue;
      return nextToken;
    }
  }
  return null;
}

const SHELL_CODE_FLAGS = ['-c'] as const;

export function extractDashCArg(tokens: readonly string[]): string | null {
  return extractFlagArg(tokens, SHELL_CODE_FLAGS, { rejectDashNext: true });
}
