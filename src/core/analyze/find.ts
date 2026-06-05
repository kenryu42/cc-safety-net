import { hasRecursiveForceFlags } from '@/core/analyze/rm-flags';
import { getBasename, stripWrappers } from '@/core/shell';
import type { AnalyzeNestedOverrides } from '@/types';

const REASON_FIND_DELETE = 'find -delete permanently removes files. Use -print first to preview.';
const FIND_PRIMARIES_WITH_VALUE = new Set([
  '-amin',
  '-anewer',
  '-atime',
  '-cmin',
  '-cnewer',
  '-context',
  '-ctime',
  '-exec',
  '-execdir',
  '-fprint',
  '-fprintf',
  '-fstype',
  '-gid',
  '-group',
  '-ilname',
  '-iname',
  '-inum',
  '-ipath',
  '-iwholename',
  '-iregex',
  '-links',
  '-lname',
  '-mmin',
  '-mtime',
  '-name',
  '-newer',
  '-newerXY',
  '-path',
  '-perm',
  '-printf',
  '-regex',
  '-samefile',
  '-size',
  '-type',
  '-uid',
  '-used',
  '-user',
  '-wholename',
  '-xtype',
]);

export interface AnalyzeFindContext {
  cwd?: string;
  envAssignments?: ReadonlyMap<string, string>;
  analyzeTokens?: (tokens: readonly string[], cwd: string | null | undefined) => string | null;
  analyzeNested?: (command: string, overrides?: AnalyzeNestedOverrides) => string | null;
}

export function analyzeFind(
  tokens: readonly string[],
  context: AnalyzeFindContext = {},
): string | null {
  // Check for -delete outside of -exec/-execdir blocks
  if (findHasDelete(tokens.slice(1))) {
    return REASON_FIND_DELETE;
  }

  // Check all -exec and -execdir blocks for dangerous commands
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '-exec' || token === '-execdir') {
      const execCommand = getFindExecCommand(tokens, i);
      const directReason = analyzeFindExecCommand(execCommand);
      if (directReason) {
        return directReason;
      }

      if (context.analyzeTokens) {
        const reason = context.analyzeTokens(
          execCommand,
          token === '-execdir' ? null : context.cwd,
        );
        if (reason) {
          return reason;
        }
        continue;
      }

      if (context.analyzeNested) {
        const reason = context.analyzeNested(execCommand.join(' '), {
          effectiveCwd: token === '-execdir' ? undefined : context.cwd,
          envAssignments: context.envAssignments,
        });
        if (reason) {
          return reason;
        }
        continue;
      }

      const fallbackReason = analyzeFindExecCommand(execCommand);
      if (fallbackReason) return fallbackReason;
    }
  }

  return null;
}

function analyzeFindExecCommand(tokens: readonly string[]): string | null {
  let execCommand = stripWrappers([...tokens]);
  if (execCommand.length === 0) {
    return null;
  }

  let head = getBasename(execCommand[0] ?? '');
  if (head === 'busybox' && execCommand.length > 1) {
    execCommand = execCommand.slice(1);
    head = getBasename(execCommand[0] ?? '');
  }

  if (head === 'rm' && hasRecursiveForceFlags(execCommand)) {
    return 'find -exec rm -rf is dangerous. Use explicit file list instead.';
  }

  return null;
}

function getFindExecCommand(tokens: readonly string[], execIndex: number): string[] {
  const execTokens = tokens.slice(execIndex + 1);
  const semicolonIdx = execTokens.indexOf(';');
  const plusIdx = execTokens.indexOf('+');
  // If no terminator found, shell-quote may have parsed it as an operator.
  // In that case, treat the rest of the tokens as the exec command.
  const endIdx =
    semicolonIdx !== -1 && plusIdx !== -1
      ? Math.min(semicolonIdx, plusIdx)
      : semicolonIdx !== -1
        ? semicolonIdx
        : plusIdx !== -1
          ? plusIdx
          : execTokens.length;

  return execTokens.slice(0, endIdx);
}

/**
 * Check if find command has -delete action (not as argument to another option).
 * Handles cases like "find -name -delete" where -delete is a filename pattern.
 */
function findHasDelete(tokens: readonly string[]): boolean {
  let i = 0;
  let insideExec = false;
  let execDepth = 0;

  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      i++;
      continue;
    }

    // Track -exec/-execdir blocks
    if (token === '-exec' || token === '-execdir') {
      insideExec = true;
      execDepth++;
      i++;
      continue;
    }

    // End of -exec block
    if (insideExec && (token === ';' || token === '+')) {
      execDepth--;
      if (execDepth === 0) {
        insideExec = false;
      }
      i++;
      continue;
    }

    // Skip -delete inside -exec blocks
    if (insideExec) {
      i++;
      continue;
    }

    // Options that take an argument - skip the next token
    if (findPrimaryTakesValue(token)) {
      i += 2; // Skip option and its argument
      continue;
    }

    // Found -delete outside of -exec and not as an argument
    if (token === '-delete') {
      return true;
    }

    i++;
  }

  return false;
}

function findPrimaryTakesValue(token: string): boolean {
  return FIND_PRIMARIES_WITH_VALUE.has(token) || /^-newer[A-Za-z]{2}$/.test(token);
}
