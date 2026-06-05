import { extractShortOpts } from '@/core/shell';
import { hasRecursiveSubmoduleConfig } from './config';
import { extractGitSubcommandAndRest, splitAtDoubleDash } from './parse';
import {
  CHECKOUT_SHORT_OPTS_WITH_VALUE,
  type GitRuleMatch,
  matchesGitLongOption,
  SWITCH_SHORT_OPTS_WITH_VALUE,
} from './rules';
import { getGitExecutionContext, hasGitContextEnvOverride, isLinkedWorktree } from './worktree';

export interface GitAnalyzeOptions {
  cwd?: string;
  envAssignments?: ReadonlyMap<string, string>;
  worktreeMode?: boolean;
}

export interface GitWorktreeRelaxation {
  originalReason: string;
  gitCwd: string;
}

export function getGitWorktreeRelaxationForMatch(
  tokens: readonly string[],
  match: GitRuleMatch,
  options: GitAnalyzeOptions,
): GitWorktreeRelaxation | null {
  if (
    !match.localDiscard ||
    !options.worktreeMode ||
    hasGitContextEnvOverride(options.envAssignments)
  ) {
    return null;
  }

  const context = getGitExecutionContext(tokens, options.cwd);
  if (!context.gitCwd || context.hasExplicitGitContext) {
    return null;
  }

  if (!isLinkedWorktree(context.gitCwd)) {
    return null;
  }

  if (isNonRelaxableLocalDiscard(tokens, options, context.gitCwd)) {
    return null;
  }

  return {
    originalReason: match.reason,
    gitCwd: context.gitCwd,
  };
}

function isNonRelaxableLocalDiscard(
  tokens: readonly string[],
  options: GitAnalyzeOptions,
  gitCwd: string,
): boolean {
  const { subcommand, rest } = extractGitSubcommandAndRest(tokens);
  const normalizedSubcommand = subcommand?.toLowerCase();

  if (
    hasDynamicGitArgument(rest) ||
    hasRecursiveSubmoduleConfig(tokens, options.envAssignments, gitCwd) ||
    hasRecurseSubmodulesOption(rest) ||
    isForcedBranchReset(normalizedSubcommand, rest)
  ) {
    return true;
  }

  return normalizedSubcommand === 'clean' && countCleanForceFlags(rest) > 1;
}

function hasDynamicGitArgument(tokens: readonly string[]): boolean {
  return tokens.some((token) => /[$*?[]/.test(token));
}

function isForcedBranchReset(subcommand: string | undefined, rest: readonly string[]): boolean {
  if (subcommand === 'checkout') {
    const { before } = splitAtDoubleDash(rest);
    const shortOpts = extractShortOpts(before, {
      shortOptsWithValue: CHECKOUT_SHORT_OPTS_WITH_VALUE,
    });
    const hasForce =
      before.some((token) => matchesGitLongOption(token, '--force')) || shortOpts.has('-f');
    const hasBranchReset =
      shortOpts.has('-B') || before.some((token) => token === '-B' || token.startsWith('-B'));
    return hasForce && hasBranchReset;
  }

  if (subcommand === 'switch') {
    const { before } = splitAtDoubleDash(rest);
    const shortOpts = extractShortOpts(before, {
      shortOptsWithValue: SWITCH_SHORT_OPTS_WITH_VALUE,
    });
    const hasForce =
      before.some((token) => matchesGitLongOption(token, '--force')) ||
      before.some((token) => matchesGitLongOption(token, '--discard-changes')) ||
      shortOpts.has('-f');
    const hasForceCreate =
      before.some(
        (token) => token === '-C' || token.startsWith('-C') || isForceCreateOption(token),
      ) || shortOpts.has('-C');
    return hasForce && hasForceCreate;
  }

  return false;
}

function isForceCreateOption(token: string): boolean {
  const optionName = token.split('=', 1)[0] ?? token;
  return (
    optionName === '--force-create' ||
    (optionName.length >= '--force-c'.length && '--force-create'.startsWith(optionName))
  );
}

function hasRecurseSubmodulesOption(tokens: readonly string[]): boolean {
  return tokens.some((token) => token.startsWith('--recurse-sub'));
}

function countCleanForceFlags(tokens: readonly string[]): number {
  let count = 0;

  for (const token of tokens) {
    if (token === '--force') {
      count++;
      continue;
    }
    if (token.startsWith('-') && !token.startsWith('--')) {
      for (const opt of token.slice(1)) {
        if (opt === 'f') {
          count++;
        }
      }
    }
  }

  return count;
}
