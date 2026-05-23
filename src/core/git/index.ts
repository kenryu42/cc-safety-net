import {
  effectiveGitConfigEnablesRecursiveSubmodules,
  TRUSTED_GIT_BINARIES,
} from '@/core/git/config';
import { extractGitSubcommandAndRest } from '@/core/git/parse';
import { analyzeGitRule, getCheckoutPositionalArgs } from '@/core/git/rules';
import {
  type GitAnalyzeOptions,
  type GitWorktreeRelaxation,
  getGitWorktreeRelaxationForMatch,
} from '@/core/git/worktree-relaxation';

export function analyzeGit(
  tokens: readonly string[],
  options: GitAnalyzeOptions = {},
): string | null {
  const match = analyzeGitRule(tokens);

  if (!match) {
    return null;
  }

  if (getGitWorktreeRelaxationForMatch(tokens, match, options)) {
    return null;
  }

  return match.reason;
}

export function getGitWorktreeRelaxation(
  tokens: readonly string[],
  options: GitAnalyzeOptions = {},
): GitWorktreeRelaxation | null {
  const match = analyzeGitRule(tokens);
  if (!match) {
    return null;
  }
  return getGitWorktreeRelaxationForMatch(tokens, match, options);
}

/** @internal Exported for testing */
export {
  effectiveGitConfigEnablesRecursiveSubmodules as _effectiveGitConfigEnablesRecursiveSubmodules,
  extractGitSubcommandAndRest as _extractGitSubcommandAndRest,
  getCheckoutPositionalArgs as _getCheckoutPositionalArgs,
  TRUSTED_GIT_BINARIES as _TRUSTED_GIT_BINARIES,
};
