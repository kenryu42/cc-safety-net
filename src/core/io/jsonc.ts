export function stripJsonComments(content: string): string {
  let result = '';
  let i = 0;
  let inString = false;
  let isEscaped = false;
  let lastCommaIndex = -1;

  while (i < content.length) {
    const char = content[i] as string;
    const next = content[i + 1];

    if (isEscaped) {
      result += char;
      isEscaped = false;
      i++;
      continue;
    }
    if (char === '"' && !inString) {
      inString = true;
      lastCommaIndex = -1;
      result += char;
      i++;
      continue;
    }
    if (char === '"' && inString) {
      inString = false;
      result += char;
      i++;
      continue;
    }
    if (char === '\\' && inString) {
      isEscaped = true;
      result += char;
      i++;
      continue;
    }
    if (inString) {
      result += char;
      i++;
      continue;
    }
    if (char === '/' && next === '/') {
      while (i < content.length && content[i] !== '\n') i++;
      continue;
    }
    if (char === '/' && next === '*') {
      i += 2;
      while (i < content.length - 1) {
        if (content[i] === '*' && content[i + 1] === '/') {
          i += 2;
          break;
        }
        i++;
      }
      continue;
    }
    if (char === ',') {
      lastCommaIndex = result.length;
      result += char;
      i++;
      continue;
    }
    if (char === '}' || char === ']') {
      if (lastCommaIndex !== -1) {
        const between = result.slice(lastCommaIndex + 1);
        if (/^\s*$/.test(between)) result = result.slice(0, lastCommaIndex) + between;
      }
      lastCommaIndex = -1;
      result += char;
      i++;
      continue;
    }
    if (!/\s/.test(char)) lastCommaIndex = -1;
    result += char;
    i++;
  }

  return result;
}

export type TextRange = {
  start: number;
  end: number;
};

function findJsonStringEnd(content: string, index: number, errorMessage: string) {
  let current = index + 1;
  let isEscaped = false;

  while (current < content.length) {
    if (isEscaped) {
      isEscaped = false;
      current++;
      continue;
    }
    if (content[current] === '\\') {
      isEscaped = true;
      current++;
      continue;
    }
    if (content[current] === '"') return current + 1;
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
): number {
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
      index = findJsonStringEnd(content, index, options.stringError);
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

export function getLineIndent(content: string, index: number): string {
  const lineStart = content.lastIndexOf('\n', index) + 1;
  return /^[ \t]*/.exec(content.slice(lineStart))?.[0] ?? '';
}

export function removeArrayRangeItem(content: string, item: TextRange): string {
  const afterItem = item.end + (/^\s*/.exec(content.slice(item.end))?.[0].length ?? 0);
  if (content[afterItem] === ',') {
    const removeEnd = content[afterItem + 1] === '\n' ? afterItem + 2 : afterItem + 1;
    return `${content.slice(0, item.start)}${content.slice(removeEnd)}`;
  }

  const beforeItem = content.slice(0, item.start).search(/\s*$/) - 1;
  if (content[beforeItem] !== ',') {
    return `${content.slice(0, item.start)}${content.slice(item.end)}`;
  }
  const lineStart = content.lastIndexOf('\n', beforeItem - 1);
  const removeStart =
    lineStart !== -1 && /^\s*$/.test(content.slice(lineStart + 1, beforeItem))
      ? lineStart
      : beforeItem;
  return `${content.slice(0, removeStart)}${content.slice(item.end)}`;
}

function skipJsonComment(content: string, index: number) {
  if (content.startsWith('//', index)) {
    const newlineIndex = content.indexOf('\n', index + 2);
    return newlineIndex === -1 ? content.length : newlineIndex + 1;
  }
  if (content.startsWith('/*', index)) {
    const closeIndex = content.indexOf('*/', index + 2);
    return closeIndex === -1 ? content.length : closeIndex + 2;
  }
  return index;
}

function skipJsonTrivia(content: string, index: number) {
  let current = index;

  while (current < content.length) {
    if (/\s/.test(content[current] ?? '')) {
      current++;
      continue;
    }
    const next = skipJsonComment(content, current);
    if (next === current) return current;
    current = next;
  }

  return current;
}

export function findJsonArrayProperty(
  content: string,
  key: string,
  errors: { stringError: string; bracketError: string },
): TextRange | undefined {
  let depth = 0;
  let index = 0;

  while (index < content.length) {
    const next = skipJsonComment(content, index);
    if (next !== index) {
      index = next;
      continue;
    }
    if (content[index] === '"') {
      const end = findJsonStringEnd(content, index, errors.stringError);
      if (depth === 1 && JSON.parse(content.slice(index, end)) === key) {
        const colonIndex = skipJsonTrivia(content, end);
        const arrayStart = skipJsonTrivia(content, colonIndex + 1);
        if (content[colonIndex] === ':' && content[arrayStart] === '[') {
          return {
            start: arrayStart,
            end: findMatchingBracket(content, arrayStart, {
              skipComment: skipJsonComment,
              ...errors,
            }),
          };
        }
      }
      index = end;
      continue;
    }
    if (content[index] === '{' || content[index] === '[') depth++;
    if (content[index] === '}' || content[index] === ']') depth--;
    index++;
  }

  return undefined;
}

export function findJsonStringItems(
  content: string,
  array: TextRange,
  stringError: string,
): Array<{ range: TextRange; value: string }> {
  const items: Array<{ range: TextRange; value: string }> = [];
  let index = array.start + 1;

  while (index < array.end) {
    const next = skipJsonComment(content, index);
    if (next !== index) {
      index = next;
      continue;
    }
    if (content[index] === '"') {
      const end = findJsonStringEnd(content, index, stringError);
      const value: unknown = JSON.parse(content.slice(index, end));
      if (typeof value === 'string') items.push({ range: { start: index, end }, value });
      index = end;
      continue;
    }
    index++;
  }

  return items;
}
