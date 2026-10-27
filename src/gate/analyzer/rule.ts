import type { Budget } from '@/core/budget';
import { hasUnsafeTmpdirWordSplitting, isTmpdirValueTrusted } from '@/core/paths/tmpdir';
import type { CommandAnalysisPolicy } from '@/core/policy/types';
import type { CommandProgram, CommandView, CommandWord } from '@/core/shell/model';
import type {
  AnalysisModeFlag,
  AnalyzeInput,
  AnalyzeNestedOverrides,
  AnalyzeOptions,
  AnalyzeResult,
  DestructiveCommandRuleMatch,
} from '@/gate/analysis';
import type { ChildProvenance, NestedCommandAnalyzeContext } from './child-command';
import { analyzeCmdMatch } from './cmd';
import { analyzeFindMatch } from './find';
import { analyzeGitMatch } from './git';
import { analyzeParallel } from './parallel';
import { analyzePowerShellWrapperMatch } from './powershell-wrapper';
import { analyzeRmMatch } from './rm';
import { analyzeRsyncMatch } from './rsync';
import { analyzeXargs } from './xargs';

export type InternalOptions = AnalyzeInput &
  Pick<AnalyzeOptions, AnalysisModeFlag> & {
    policy: CommandAnalysisPolicy;
    effectiveCwd: string | null | undefined;
    analyzeNested: (
      command: string,
      overrides?: AnalyzeNestedOverrides,
    ) => Omit<AnalyzeResult, 'segment'> | null;
    commandView?: CommandView;
    budget: Budget;
    hasPipelineInput?: boolean;
    literalShellInput?: string;
    literalHeredocFiles?: ReadonlyMap<string, string>;
    writtenPaths?: ReadonlySet<string>;
    scriptBudget?: Budget;
    functionDefinitions?: ReadonlyMap<string, CommandProgram>;
    wrapperNormalizationBudget?: { iterations: number };
    shellAssignments?: ReadonlyMap<string, string>;

    child?: ChildProvenance;
  };

export type AnalyzerRuleContext = {
  readonly words: readonly CommandWord[];
  readonly parsedWords: readonly CommandWord[];
  readonly head: string;
  readonly cwd: string | undefined;
  readonly originalCwd: string | undefined;
  readonly effectiveCwd: string | null | undefined;
  readonly envAssignments: ReadonlyMap<string, string>;
  readonly allowTmpdirVar: boolean;

  readonly dynamicArguments: boolean;
  readonly depth: number;
  readonly options: InternalOptions;

  readonly analyzeChildTokens: (
    tokens: readonly string[],
    cwd: string | null | undefined,
  ) => DestructiveCommandRuleMatch | null;

  readonly analyzeChild: (
    tokens: readonly string[],
    child: ChildProvenance,
  ) => DestructiveCommandRuleMatch | null;
};

type AnalyzerRule = {
  readonly heads: ReadonlySet<string>;
  readonly analyze: (context: AnalyzerRuleContext) => DestructiveCommandRuleMatch | null;
};

export const ANALYZER_RULES: readonly AnalyzerRule[] = [
  {
    heads: new Set(['rm', 'rmdir']),
    analyze: (context) => analyzeRmMatch(context.words, recursiveDeleteAnalyzeOptions(context)),
  },
  {
    heads: new Set(['cmd']),
    analyze: (context) =>
      analyzeCmdMatch(context.words, {
        ...recursiveDeleteAnalyzeOptions(context),
        powerShellRawWords:
          context.options.commandView?.dialect === 'powershell'
            ? context.options.commandView.words.map((word) => word.raw)
            : [],
        gitBashEscapesBodyQuotes: context.options.commandView?.dialect !== 'powershell',
        analyzeNested: (command) =>
          matchFromBlockResult(
            context.options.analyzeNested(command, {
              effectiveCwd: context.effectiveCwd,
              envAssignments: context.envAssignments,
            }),
          ),
      }),
  },
  {
    heads: new Set(['powershell', 'pwsh']),
    analyze: (context) =>
      analyzePowerShellWrapperMatch(context.parsedWords, (script) =>
        matchFromBlockResult(
          context.options.analyzeNested(script, {
            effectiveCwd: context.effectiveCwd,
            envAssignments: context.envAssignments,
            shell: 'powershell',
          }),
        ),
      ),
  },
  {
    heads: new Set(['git']),
    analyze: (context) => analyzeGitMatch(context.words, gitAnalyzeOptions(context)),
  },
  {
    heads: new Set(['find']),
    analyze: (context) =>
      analyzeFindMatch(context.words, {
        ...recursiveDeleteAnalyzeOptions(context),
        envAssignments: context.envAssignments,
        analyzeTokens: context.analyzeChildTokens,
      }),
  },
  {
    heads: new Set(['rsync']),
    analyze: (context) =>
      analyzeRsyncMatch(context.words, {
        ...recursiveDeleteAnalyzeOptions(context),
        envAssignments: context.envAssignments,
      }),
  },
  {
    heads: new Set(['xargs']),
    analyze: (context) =>
      analyzeXargs(context.words, {
        ...nestedCommandAnalyzeContext(context),
        analyzeChild: context.analyzeChild,
        analyzeNested: (command, overrides) =>
          matchFromBlockResult(context.options.analyzeNested(command, overrides)),
      }),
  },
  {
    heads: new Set(['parallel']),
    analyze: (context) =>
      analyzeParallel(context.words, {
        ...nestedCommandAnalyzeContext(context),
        analyzeChild: context.analyzeChild,
        analyzeNested: (command, overrides) =>
          matchFromBlockResult(context.options.analyzeNested(command, overrides)),
      }),
  },
];

function nestedCommandAnalyzeContext(context: AnalyzerRuleContext): NestedCommandAnalyzeContext {
  return {
    environment: context.options.environment,
    cwd: context.cwd,
    originalCwd: context.originalCwd,
    strict: context.options.strict,
    paranoidRm: context.options.paranoidRm,
    paranoidInterpreters: context.options.paranoidInterpreters,
    allowTmpdirVar: context.allowTmpdirVar,
    protectedGitMetadata: context.options.protectedGitMetadata,
    budget: context.options.budget,
    envAssignments: context.envAssignments,
    worktreeMode: context.options.worktreeMode,
    policy: context.options.policy,
  };
}

export function matchFromBlockResult(
  result: Omit<AnalyzeResult, 'segment'> | null,
): DestructiveCommandRuleMatch | null {
  return result
    ? { id: result.ruleId, reason: result.reason, intent: result.intent ?? 'manual_only' }
    : null;
}

function recursiveDeleteAnalyzeOptions(context: AnalyzerRuleContext) {
  return {
    environment: context.options.environment,
    cwd: context.cwd,
    originalCwd: context.originalCwd,
    strict: context.options.strict,
    paranoid: context.options.paranoidRm,
    allowTmpdirVar: context.allowTmpdirVar,
    tmpdirWordSplittingUnsafe: hasUnsafeTmpdirWordSplitting(
      context.envAssignments,
      context.options.environment,
    ),
    trustedTmpdirValue: isTmpdirValueTrusted(context.envAssignments, context.options.environment),
    protectedGitMetadata: context.options.protectedGitMetadata,
    policy: context.options.policy,
    budget: context.options.budget,
  };
}

export function gitAnalyzeOptions(context: AnalyzerRuleContext) {
  return {
    environment: context.options.environment,
    cwd: context.cwd,
    originalCwd: context.originalCwd,
    dynamicArguments: context.dynamicArguments,
    envAssignments: context.envAssignments,
    shellAssignments: context.options.shellAssignments,
    policy: context.options.policy,
    worktreeMode: context.options.worktreeMode,
  };
}
