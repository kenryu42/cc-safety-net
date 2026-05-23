import { effectiveGitConfigEnablesRecursiveSubmodules, TRUSTED_GIT_BINARIES } from '@/core/git/config';
import { extractGitSubcommandAndRest } from '@/core/git/parse';
import { getCheckoutPositionalArgs } from '@/core/git/rules';
import { type GitAnalyzeOptions, type GitWorktreeRelaxation } from '@/core/git/worktree-relaxation';
export declare function analyzeGit(tokens: readonly string[], options?: GitAnalyzeOptions): string | null;
export declare function getGitWorktreeRelaxation(tokens: readonly string[], options?: GitAnalyzeOptions): GitWorktreeRelaxation | null;
/** @internal Exported for testing */
export { effectiveGitConfigEnablesRecursiveSubmodules as _effectiveGitConfigEnablesRecursiveSubmodules, extractGitSubcommandAndRest as _extractGitSubcommandAndRest, getCheckoutPositionalArgs as _getCheckoutPositionalArgs, TRUSTED_GIT_BINARIES as _TRUSTED_GIT_BINARIES, };
