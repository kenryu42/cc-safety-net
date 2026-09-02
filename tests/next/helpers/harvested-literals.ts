import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every string literal the shipped test suite spells out, harvested as text. The differential
 * gate tests replay them as commands, so a case the legacy suite proved against `src/` is proved
 * again against `next/` without importing or copying a single test file: the harvest reads the
 * files as bytes and keeps only their literals.
 */

const TESTS_ROOT = join(import.meta.dir, '..', '..');

/** The suites whose literals are shell commands, tool payloads and paths the gate decides on. */
const HARVEST_DIRECTORIES = ['analyzer', 'guards', 'engine', 'parser', 'integrations/hook', 'e2e'];

const SHORT_ESCAPES = new Map([
  ['b', '\b'],
  ['f', '\f'],
  ['n', '\n'],
  ['r', '\r'],
  ['t', '\t'],
  ['v', '\v'],
  ['0', '\0'],
  ['\n', ''],
]);

/** A decoded escape sequence and the index just past it. */
function readEscape(source: string, start: number): { text: string; end: number } {
  const marker = source[start + 1] ?? '';
  const short = SHORT_ESCAPES.get(marker);
  if (short !== undefined) return { text: short, end: start + 2 };
  if (marker === 'x') {
    const code = Number.parseInt(source.slice(start + 2, start + 4), 16);
    if (Number.isNaN(code)) return { text: 'x', end: start + 2 };
    return { text: String.fromCharCode(code), end: start + 4 };
  }
  if (marker === 'u' && source[start + 2] === '{') {
    const close = source.indexOf('}', start + 3);
    const code = close === -1 ? Number.NaN : Number.parseInt(source.slice(start + 3, close), 16);
    if (Number.isNaN(code) || code > 0x10_ffff) return { text: 'u', end: start + 2 };
    return { text: String.fromCodePoint(code), end: close + 1 };
  }
  if (marker === 'u') {
    const code = Number.parseInt(source.slice(start + 2, start + 6), 16);
    if (Number.isNaN(code)) return { text: 'u', end: start + 2 };
    return { text: String.fromCharCode(code), end: start + 6 };
  }
  return { text: marker, end: start + 2 };
}

/** Skips a `${…}` span, counting nested braces so the template's own end is not mistaken for it. */
function endOfInterpolation(source: string, open: number): number {
  let index = open + 1;
  let depth = 1;
  while (index < source.length && depth > 0) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    index += 1;
  }
  return index;
}

/**
 * The literal that starts at `start`, unescaped, or null where the span is a template with an
 * interpolation (its text is not a fixed input) or an unterminated quote.
 */
function readLiteral(source: string, start: number): { value: string | null; end: number } {
  const quote = source[start];
  const parts: string[] = [];
  let index = start + 1;
  let interpolated = false;
  while (index < source.length) {
    const char = source[index];
    if (char === quote) {
      const value = parts.join('');
      return { value: interpolated || value.length < 3 ? null : value, end: index + 1 };
    }
    if (char === '\\') {
      const decoded = readEscape(source, index);
      parts.push(decoded.text);
      index = decoded.end;
      continue;
    }
    if (quote === '`' && char === '$' && source[index + 1] === '{') {
      interpolated = true;
      index = endOfInterpolation(source, index + 1);
      continue;
    }
    if (quote !== '`' && char === '\n') return { value: null, end: index };
    parts.push(char as string);
    index += 1;
  }
  return { value: null, end: source.length };
}

/** Every quoted literal in one source file, with comments skipped so their prose stays out. */
function literalsInSource(source: string): string[] {
  const found: string[] = [];
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    if (char === '/' && source[index + 1] === '/') {
      const newline = source.indexOf('\n', index);
      index = newline === -1 ? source.length : newline + 1;
      continue;
    }
    if (char === '/' && source[index + 1] === '*') {
      const close = source.indexOf('*/', index + 2);
      index = close === -1 ? source.length : close + 2;
      continue;
    }
    if (char !== "'" && char !== '"' && char !== '`') {
      index += 1;
      continue;
    }
    const literal = readLiteral(source, index);
    if (literal.value !== null) found.push(literal.value);
    index = Math.max(literal.end, index + 1);
  }
  return found;
}

function harvest(): readonly string[] {
  const literals = HARVEST_DIRECTORIES.flatMap((directory) =>
    readdirSync(join(TESTS_ROOT, directory), { recursive: true, encoding: 'utf-8' })
      .filter((entry) => entry.endsWith('.ts'))
      .flatMap((entry) =>
        literalsInSource(readFileSync(join(TESTS_ROOT, directory, entry), 'utf-8')),
      ),
  );
  return [...new Set(literals)].sort();
}

/** Deduplicated and sorted, so the replay order is the same on every machine and every run. */
export const HARVESTED_LITERALS = harvest();

export const HARVESTED_LITERAL_COUNT = HARVESTED_LITERALS.length;
