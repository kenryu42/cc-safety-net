import { extractShortOpts } from '@/core/shell';
import { extractGitSubcommandAndRest, splitAtDoubleDash } from './parse';

const REASON_CHECKOUT_DOUBLE_DASH =
  "git checkout -- discards uncommitted changes permanently. Use 'git stash' first.";
const REASON_CHECKOUT_FORCE =
  "git checkout --force discards uncommitted changes. Use 'git stash' first.";
const REASON_CHECKOUT_REF_PATH =
  "git checkout <ref> -- <path> overwrites working tree with ref version. Use 'git stash' first.";
const REASON_CHECKOUT_PATHSPEC_FROM_FILE =
  "git checkout --pathspec-from-file can overwrite multiple files. Use 'git stash' first.";
const REASON_CHECKOUT_AMBIGUOUS =
  "git checkout with multiple positional args may overwrite files. Use 'git switch' for branches or 'git restore' for files.";
const REASON_SWITCH_DISCARD_CHANGES =
  "git switch --discard-changes discards uncommitted changes. Use 'git stash' first.";
const REASON_SWITCH_FORCE =
  "git switch --force discards uncommitted changes. Use 'git stash' first.";
const REASON_RESTORE =
  "git restore discards uncommitted changes. Use 'git stash' first, or use --staged to only unstage.";
const REASON_RESTORE_WORKTREE =
  "git restore --worktree explicitly discards working tree changes. Use 'git stash' first.";
const REASON_RESET_HARD =
  "git reset --hard destroys all uncommitted changes permanently. Use 'git stash' first.";
const REASON_RESET_MERGE = "git reset --merge can lose uncommitted changes. Use 'git stash' first.";
const REASON_CLEAN =
  "git clean -f removes untracked files permanently. Use 'git clean -n' to preview first.";
const REASON_PUSH_FORCE =
  'git push --force destroys remote history. Use --force-with-lease for safer force push.';
const REASON_BRANCH_DELETE =
  'git branch -D force-deletes without merge check. Use -d for safe delete.';
const REASON_REBASE_ABORT =
  "git rebase --abort discards rebase conflict resolutions. Use 'git status' first.";
const REASON_MERGE_ABORT =
  "git merge --abort discards merge conflict resolutions. Use 'git status' first.";
const REASON_TAG_DELETE = 'git tag -d permanently deletes tags.';
const REASON_REFLOG_DELETE = 'git reflog delete removes recovery history.';
const REASON_STASH_DROP =
  "git stash drop permanently deletes stashed changes. Consider 'git stash list' first.";
const REASON_STASH_CLEAR = 'git stash clear deletes ALL stashed changes permanently.';
const REASON_WORKTREE_REMOVE_FORCE =
  'git worktree remove --force can delete uncommitted changes. Remove --force flag.';

const CHECKOUT_OPTS_WITH_VALUE = new Set([
  '-b',
  '-B',
  '--orphan',
  '--conflict',
  '--inter-hunk-context',
  '--pathspec-from-file',
  '--unified',
]);

const CHECKOUT_OPTS_WITH_OPTIONAL_VALUE = new Set(['--recurse-submodules', '--track', '-t']);
export const CHECKOUT_SHORT_OPTS_WITH_VALUE = new Set(['-b', '-B', '-U']);
export const SWITCH_SHORT_OPTS_WITH_VALUE = new Set(['-c', '-C']);

const CHECKOUT_KNOWN_OPTS_NO_VALUE = new Set([
  '-q',
  '--quiet',
  '--no-quiet',
  '-f',
  '--force',
  '--no-force',
  '-d',
  '--detach',
  '--no-detach',
  '-m',
  '--merge',
  '--no-merge',
  '-p',
  '--patch',
  '--no-patch',
  '--guess',
  '--no-guess',
  '--overlay',
  '--no-overlay',
  '--ours',
  '--theirs',
  '--ignore-skip-worktree-bits',
  '--no-ignore-skip-worktree-bits',
  '--no-track',
  '--overwrite-ignore',
  '--no-overwrite-ignore',
  '--ignore-other-worktrees',
  '--no-ignore-other-worktrees',
  '--progress',
  '--no-progress',
  '--pathspec-file-nul',
  '--no-pathspec-file-nul',
  '--no-recurse-submodules',
]);

export interface GitRuleMatch {
  reason: string;
  localDiscard: boolean;
}

export function matchesGitLongOption(token: string, option: string): boolean {
  const optionName = token.split('=', 1)[0] ?? token;
  return (
    optionName.length >= 4 &&
    option.startsWith(optionName) &&
    optionName.startsWith('--') &&
    optionName.slice(2).length >= 2
  );
}

export function analyzeGitRule(tokens: readonly string[]): GitRuleMatch | null {
  const { subcommand, rest } = extractGitSubcommandAndRest(tokens);

  if (!subcommand) {
    return null;
  }

  switch (subcommand.toLowerCase()) {
    case 'checkout':
      return localDiscard(analyzeGitCheckout(rest));
    case 'switch':
      return localDiscard(analyzeGitSwitch(rest));
    case 'restore':
      return localDiscard(analyzeGitRestore(rest));
    case 'reset':
      return analyzeGitReset(rest);
    case 'clean':
      return localDiscard(analyzeGitClean(rest));
    case 'push':
      return sharedState(analyzeGitPush(rest));
    case 'branch':
      return sharedState(analyzeGitBranch(rest));
    case 'stash':
      return sharedState(analyzeGitStash(rest));
    case 'worktree':
      return sharedState(analyzeGitWorktree(rest));
    case 'rebase':
      return localDiscard(analyzeGitRebase(rest));
    case 'merge':
      return localDiscard(analyzeGitMerge(rest));
    case 'tag':
      return sharedState(analyzeGitTag(rest));
    case 'reflog':
      return sharedState(analyzeGitReflog(rest));
    default:
      return null;
  }
}

function localDiscard(reason: string | null): GitRuleMatch | null {
  return reason ? { reason, localDiscard: true } : null;
}

function sharedState(reason: string | null): GitRuleMatch | null {
  return reason ? { reason, localDiscard: false } : null;
}

function analyzeGitCheckout(tokens: readonly string[]): string | null {
  const { index: doubleDashIdx, before: beforeDash } = splitAtDoubleDash(tokens);
  const shortOpts = extractShortOpts(beforeDash, {
    shortOptsWithValue: CHECKOUT_SHORT_OPTS_WITH_VALUE,
  });

  if (beforeDash.some((token) => matchesGitLongOption(token, '--force')) || shortOpts.has('-f')) {
    return REASON_CHECKOUT_FORCE;
  }

  for (const token of tokens) {
    if (token === '-b' || token === '-B' || token === '--orphan') {
      return null;
    }
    if (matchesGitLongOption(token, '--pathspec-from-file')) {
      return REASON_CHECKOUT_PATHSPEC_FROM_FILE;
    }
  }

  if (doubleDashIdx !== -1) {
    const hasRefBeforeDash = beforeDash.some((t) => !t.startsWith('-'));

    if (hasRefBeforeDash) {
      return REASON_CHECKOUT_REF_PATH;
    }
    return REASON_CHECKOUT_DOUBLE_DASH;
  }

  const positionalArgs = getCheckoutPositionalArgs(tokens);
  if (positionalArgs.length >= 2) {
    return REASON_CHECKOUT_AMBIGUOUS;
  }

  return null;
}

function analyzeGitSwitch(tokens: readonly string[]): string | null {
  const { before } = splitAtDoubleDash(tokens);

  if (before.some((token) => matchesGitLongOption(token, '--discard-changes'))) {
    return REASON_SWITCH_DISCARD_CHANGES;
  }

  const shortOpts = extractShortOpts(before, {
    shortOptsWithValue: SWITCH_SHORT_OPTS_WITH_VALUE,
  });
  if (before.some((token) => matchesGitLongOption(token, '--force')) || shortOpts.has('-f')) {
    return REASON_SWITCH_FORCE;
  }

  return null;
}

function getCheckoutPositionalArgs(tokens: readonly string[]): string[] {
  const positional: string[] = [];

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) break;

    if (token === '--') {
      break;
    }

    if (token.startsWith('-')) {
      if (CHECKOUT_OPTS_WITH_VALUE.has(token)) {
        i += 2;
      } else if (token.startsWith('--') && token.includes('=')) {
        i++;
      } else if (CHECKOUT_OPTS_WITH_OPTIONAL_VALUE.has(token)) {
        const nextToken = tokens[i + 1];
        if (
          nextToken &&
          !nextToken.startsWith('-') &&
          (token === '--recurse-submodules' || token === '--track' || token === '-t')
        ) {
          const validModes =
            token === '--recurse-submodules' ? ['checkout', 'on-demand'] : ['direct', 'inherit'];
          if (validModes.includes(nextToken)) {
            i += 2;
          } else {
            i++;
          }
        } else {
          i++;
        }
      } else if (
        token.startsWith('--') &&
        !CHECKOUT_KNOWN_OPTS_NO_VALUE.has(token) &&
        !CHECKOUT_OPTS_WITH_VALUE.has(token) &&
        !CHECKOUT_OPTS_WITH_OPTIONAL_VALUE.has(token)
      ) {
        i++;
      } else {
        i++;
      }
    } else {
      positional.push(token);
      i++;
    }
  }

  return positional;
}

function analyzeGitRestore(tokens: readonly string[]): string | null {
  let hasStaged = false;
  for (const token of tokens) {
    if (token === '--help' || token === '--version') {
      return null;
    }
    if (token === '--worktree' || token === '-W') {
      return REASON_RESTORE_WORKTREE;
    }
    if (token === '--staged' || token === '-S') {
      hasStaged = true;
    }
  }
  return hasStaged ? null : REASON_RESTORE;
}

function analyzeGitReset(tokens: readonly string[]): GitRuleMatch | null {
  let reason: string | null = null;

  for (const token of tokens) {
    if (matchesGitLongOption(token, '--hard')) {
      reason = REASON_RESET_HARD;
      break;
    }
    if (matchesGitLongOption(token, '--merge')) {
      reason = REASON_RESET_MERGE;
      break;
    }
  }

  if (!reason) {
    return null;
  }

  return resetHasRef(tokens) ? sharedState(reason) : localDiscard(reason);
}

function resetHasRef(tokens: readonly string[]): boolean {
  for (const token of tokens) {
    if (token === '--') {
      return false;
    }
    if (!token.startsWith('-')) {
      return true;
    }
  }
  return false;
}

function analyzeGitClean(tokens: readonly string[]): string | null {
  for (const token of tokens) {
    if (token === '-n' || matchesGitLongOption(token, '--dry-run')) {
      return null;
    }
  }

  const shortOpts = extractShortOpts(tokens.filter((t) => t !== '--'));
  if (tokens.some((token) => matchesGitLongOption(token, '--force')) || shortOpts.has('-f')) {
    return REASON_CLEAN;
  }

  return null;
}

function analyzeGitPush(tokens: readonly string[]): string | null {
  const shortOpts = extractShortOpts(tokens.filter((t) => t !== '--'));
  const hasForce =
    tokens.some((token) => matchesGitLongOption(token, '--force')) || shortOpts.has('-f');

  if (hasForce) {
    return REASON_PUSH_FORCE;
  }

  return null;
}

function analyzeGitBranch(tokens: readonly string[]): string | null {
  const { before } = splitAtDoubleDash(tokens);
  const shortOpts = extractShortOpts(before);
  const hasDelete =
    shortOpts.has('-D') ||
    shortOpts.has('-d') ||
    before.some((token) => matchesGitLongOption(token, '--delete'));
  const hasForce =
    shortOpts.has('-D') ||
    shortOpts.has('-f') ||
    before.some((token) => matchesGitLongOption(token, '--force'));
  if (hasDelete && hasForce) {
    return REASON_BRANCH_DELETE;
  }
  return null;
}

function analyzeGitRebase(tokens: readonly string[]): string | null {
  const { before } = splitAtDoubleDash(tokens);
  return before.some((token) => matchesGitLongOption(token, '--abort'))
    ? REASON_REBASE_ABORT
    : null;
}

function analyzeGitMerge(tokens: readonly string[]): string | null {
  const { before } = splitAtDoubleDash(tokens);
  return before.some((token) => matchesGitLongOption(token, '--abort')) ? REASON_MERGE_ABORT : null;
}

function analyzeGitTag(tokens: readonly string[]): string | null {
  const { before } = splitAtDoubleDash(tokens);
  const shortOpts = extractShortOpts(before);
  return shortOpts.has('-d') || before.some((token) => matchesGitLongOption(token, '--delete'))
    ? REASON_TAG_DELETE
    : null;
}

function analyzeGitReflog(tokens: readonly string[]): string | null {
  return tokens[0] === 'delete' ? REASON_REFLOG_DELETE : null;
}

function analyzeGitStash(tokens: readonly string[]): string | null {
  for (const token of tokens) {
    if (token === 'drop') {
      return REASON_STASH_DROP;
    }
    if (token === 'clear') {
      return REASON_STASH_CLEAR;
    }
  }
  return null;
}

function analyzeGitWorktree(tokens: readonly string[]): string | null {
  const { before } = splitAtDoubleDash(tokens);
  const hasRemove = before.includes('remove');
  if (!hasRemove) return null;

  const shortOpts = extractShortOpts(before);
  if (before.some((token) => matchesGitLongOption(token, '--force')) || shortOpts.has('-f')) {
    return REASON_WORKTREE_REMOVE_FORCE;
  }

  return null;
}
