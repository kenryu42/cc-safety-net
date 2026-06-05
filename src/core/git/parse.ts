import { getBasename } from '@/core/shell';
import { GIT_GLOBAL_OPTS_WITH_VALUE } from './worktree';

export function splitAtDoubleDash(tokens: readonly string[]): {
  index: number;
  before: readonly string[];
  after: readonly string[];
} {
  const index = tokens.indexOf('--');
  if (index === -1) {
    return { index: -1, before: tokens, after: [] };
  }
  return {
    index,
    before: tokens.slice(0, index),
    after: tokens.slice(index + 1),
  };
}

export function extractGitSubcommandAndRest(tokens: readonly string[]): {
  subcommand: string | null;
  rest: string[];
} {
  if (tokens.length === 0) {
    return { subcommand: null, rest: [] };
  }

  const firstToken = tokens[0];
  const command = firstToken ? getBasename(firstToken).toLowerCase() : null;
  if (command !== 'git') {
    return { subcommand: null, rest: [] };
  }

  let i = 1;

  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) break;

    if (token === '--') {
      const nextToken = tokens[i + 1];
      if (nextToken && !nextToken.startsWith('-')) {
        return { subcommand: nextToken, rest: tokens.slice(i + 2) };
      }
      return { subcommand: null, rest: tokens.slice(i + 1) };
    }

    if (token.startsWith('-')) {
      if (GIT_GLOBAL_OPTS_WITH_VALUE.has(token)) {
        i += 2;
      } else if (token.startsWith('-c') && token.length > 2) {
        i++;
      } else if (token.startsWith('-C') && token.length > 2) {
        i++;
      } else {
        i++;
      }
    } else {
      return { subcommand: token, rest: tokens.slice(i + 1) };
    }
  }

  return { subcommand: null, rest: [] };
}
