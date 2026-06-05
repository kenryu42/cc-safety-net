export function extractShortOpts(
  tokens: readonly string[],
  options?: { readonly shortOptsWithValue?: ReadonlySet<string> },
): Set<string> {
  const opts = new Set<string>();
  let pastDoubleDash = false;

  for (const token of tokens) {
    if (token === '--') {
      pastDoubleDash = true;
      continue;
    }
    if (pastDoubleDash) continue;

    if (token.startsWith('-') && !token.startsWith('--') && token.length > 1) {
      for (let i = 1; i < token.length; i++) {
        const char = token[i];
        if (!char || !/[a-zA-Z]/.test(char)) {
          break;
        }
        const shortOpt = `-${char}`;
        opts.add(shortOpt);
        if (options?.shortOptsWithValue?.has(shortOpt)) {
          break;
        }
      }
    }
  }

  return opts;
}
