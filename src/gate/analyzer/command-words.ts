import type { CommandView, CommandWord } from '@/core/shell/model';

export function analysisWordText(word: CommandWord): string {
  return word.provenance === 'command-substitution' ? word.raw : word.text;
}

export function analyzedViewWords(
  dialect: CommandView['dialect'],
  words: readonly CommandWord[],
): readonly CommandWord[] {
  return dialect === 'posix' ? words : textCommandWords(words.map((word) => word.text));
}

export function isLiteralExecutionSourceWord(word: CommandWord | undefined, text: string): boolean {
  return word && word.provenance !== 'unknown'
    ? word.provenance === 'literal'
    : !/[$`*?[\]]/.test(text);
}

export function textCommandWords(tokens: readonly string[]): readonly CommandWord[] {
  return tokens.map((text) => ({
    kind: 'word' as const,
    text,
    raw: text,
    span: { start: 0, end: 0 },
    provenance: 'unknown' as const,
    quoted: false,
    parts: [],
  }));
}
