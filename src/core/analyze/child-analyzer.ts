import { analyzeFind } from '@/core/analyze/find';
import { analyzeRm } from '@/core/analyze/rm';
import { hasRecursiveForceFlags } from '@/core/analyze/rm-flags';
import { extractDashCArg } from '@/core/analyze/shell-wrappers';
import { analyzeGit } from '@/core/git';
import { type AnalyzeNestedOverrides, SHELL_WRAPPERS } from '@/types';

export interface ChildCommandAnalysisContext {
  cwd: string | undefined;
  originalCwd: string | undefined;
  paranoidRm: boolean | undefined;
  allowTmpdirVar: boolean;
  envAssignments: ReadonlyMap<string, string>;
  worktreeMode?: boolean;
  analyzeNested?: (command: string, overrides?: AnalyzeNestedOverrides) => string | null;
}

export interface ChildCommandAnalysisOptions {
  dynamicInput?: boolean;
  shellDynamicReason?: string;
  rmDynamicReason?: string;
}

export function analyzeChildCommand(
  tokens: readonly string[],
  context: ChildCommandAnalysisContext,
  options: ChildCommandAnalysisOptions = {},
): string | null {
  if (tokens.length === 0) {
    return null;
  }

  const head = tokens[0];
  if (!head) {
    return null;
  }

  if (SHELL_WRAPPERS.has(head)) {
    if (options.dynamicInput && options.shellDynamicReason) {
      return options.shellDynamicReason;
    }

    const dashCArg = extractDashCArg(tokens);
    if (dashCArg && context.analyzeNested) {
      return context.analyzeNested(dashCArg, {
        effectiveCwd: context.cwd,
        envAssignments: context.envAssignments,
      });
    }
    return null;
  }

  if (head === 'rm' && hasRecursiveForceFlags(tokens)) {
    const rmResult = analyzeRm([...tokens], {
      cwd: context.cwd,
      originalCwd: context.originalCwd,
      paranoid: context.paranoidRm,
      allowTmpdirVar: context.allowTmpdirVar,
    });
    return rmResult ?? (options.dynamicInput ? (options.rmDynamicReason ?? null) : null);
  }

  if (head === 'find') {
    return analyzeFind(tokens, {
      ...context,
      analyzeTokens: (nestedTokens, cwd) =>
        analyzeChildCommand(nestedTokens, { ...context, cwd: cwd ?? undefined }, options),
    });
  }

  if (head === 'git') {
    return analyzeGit(tokens, {
      cwd: context.cwd,
      envAssignments: context.envAssignments,
      worktreeMode: options.dynamicInput ? false : context.worktreeMode,
    });
  }

  return null;
}
