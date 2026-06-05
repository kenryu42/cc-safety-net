export type TextRange = {
  start: number;
  end: number;
};

function isWhitespace(char: string | undefined) {
  return char !== undefined && /\s/.test(char);
}

function skipString(content: string, index: number, errorMessage: string) {
  let current = index + 1;
  let isEscaped = false;

  while (current < content.length) {
    const char = content[current];
    if (isEscaped) {
      isEscaped = false;
      current++;
      continue;
    }

    if (char === '\\') {
      isEscaped = true;
      current++;
      continue;
    }

    if (char === '"') return current + 1;
    current++;
  }

  throw new Error(errorMessage);
}

export function findMatchingBracket(
  content: string,
  openIndex: number,
  options: {
    skipComment?: (content: string, index: number) => number;
    stringError: string;
    bracketError: string;
  },
) {
  const open = content[openIndex];
  const close = open === '[' ? ']' : '}';
  let depth = 0;
  let index = openIndex;

  while (index < content.length) {
    const nextIndex = options.skipComment?.(content, index) ?? index;
    if (nextIndex !== index) {
      index = nextIndex;
      continue;
    }

    if (content[index] === '"') {
      index = skipString(content, index, options.stringError);
      continue;
    }

    if (content[index] === open) depth++;
    if (content[index] === close) {
      depth--;
      if (depth === 0) return index;
    }
    index++;
  }

  throw new Error(options.bracketError);
}

export function getLineIndent(content: string, index: number) {
  const lineStart = content.lastIndexOf('\n', index) + 1;
  const match = /^[ \t]*/.exec(content.slice(lineStart));
  return match?.[0] ?? '';
}

export function removeArrayRangeItem(content: string, item: TextRange) {
  let removeStart = item.start;
  let removeEnd = item.end;
  let index = item.end;
  while (isWhitespace(content[index])) index++;

  if (content[index] === ',') {
    removeEnd = index + 1;
    if (content[removeEnd] === '\n') removeEnd++;
    return `${content.slice(0, removeStart)}${content.slice(removeEnd)}`;
  }

  index = item.start - 1;
  while (isWhitespace(content[index])) index--;

  if (content[index] === ',') {
    removeStart = index;
    const lineStart = content.lastIndexOf('\n', removeStart - 1);
    if (lineStart !== -1 && /^\s*$/.test(content.slice(lineStart + 1, removeStart))) {
      removeStart = lineStart;
    }
  }

  return `${content.slice(0, removeStart)}${content.slice(removeEnd)}`;
}
