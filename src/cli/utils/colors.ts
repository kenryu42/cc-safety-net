/**
 * Determines if color output should be used.
 * Evaluated lazily to allow tests to control via environment variables.
 * @internal Exported for testing
 */
export function shouldUseColor(): boolean {
  return Boolean(process.stdout.isTTY && !process.env.NO_COLOR);
}

const green = (s: string) => (shouldUseColor() ? `\x1b[32m${s}\x1b[0m` : s);
const yellow = (s: string) => (shouldUseColor() ? `\x1b[33m${s}\x1b[0m` : s);
const blue = (s: string) => (shouldUseColor() ? `\x1b[34m${s}\x1b[0m` : s);
const magenta = (s: string) => (shouldUseColor() ? `\x1b[35m${s}\x1b[0m` : s);
const cyan = (s: string) => (shouldUseColor() ? `\x1b[36m${s}\x1b[0m` : s);
const red = (s: string) => (shouldUseColor() ? `\x1b[31m${s}\x1b[0m` : s);
const dim = (s: string) => (shouldUseColor() ? `\x1b[2m${s}\x1b[0m` : s);
const bold = (s: string) => (shouldUseColor() ? `\x1b[1m${s}\x1b[0m` : s);

export const colors = {
  green,
  yellow,
  blue,
  magenta,
  cyan,
  red,
  dim,
  bold,
};

const ANSI_RESET = '\x1b[0m';

const DISTINCT_COLORS = [
  39, 82, 198, 226, 208, 51, 196, 46, 201, 214, 93, 154, 220, 27, 49, 190, 200, 33, 129, 227, 45,
  160, 63, 118, 123, 202,
];

function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function getShuffledPalette(seed: number): number[] {
  const palette = [...DISTINCT_COLORS];
  const random = createRandom(seed);

  for (let i = palette.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = palette[i] as number;
    palette[i] = palette[j] as number;
    palette[j] = temp;
  }
  return palette;
}

/**
 * Generate a distinct color for a given index using a curated palette.
 * @param index - The index of the token (0-based)
 * @param seed - Seed for randomization (defaults to 0 for consistent order)
 * @returns ANSI escape sequence for the color
 * @internal Exported for testing
 */
export function generateDistinctColor(index: number, seed = 0): string {
  if (!shouldUseColor()) return '';

  const palette = getShuffledPalette(seed);
  const colorCode = palette[index % palette.length];
  return `\x1b[38;5;${colorCode}m`;
}

export function colorizeToken(token: string, index: number, seed = 0): string {
  if (!shouldUseColor()) return `"${token}"`;
  const colorCode = generateDistinctColor(index, seed);
  return `${colorCode}"${token}"${ANSI_RESET}`;
}
