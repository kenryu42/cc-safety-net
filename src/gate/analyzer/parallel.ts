import { isAbsolute } from 'node:path';
import { AnalysisLimit, type Budget, LIMITS } from '@/core/budget';
import { resolveChdirTarget } from '@/core/paths/chdir';
import { hasUnsafeTmpdirWordSplitting, isTmpdirValueTrusted } from '@/core/paths/tmpdir';
import { filterDestructiveCommandMatch } from '@/core/policy/effective-rules';
import { isInterpreterCommand } from '@/core/policy/transparent-wrappers';
import { AWK_INTERPRETERS, SHELL_WRAPPERS } from '@/core/rules/constants';
import { checkPolicyRuleMatch } from '@/core/rules/custom';
import { type DestructiveCommandRuleId, destructiveCommandMatch } from '@/core/rules/destructive';
import type { DestructiveCommandRuleMatch } from '@/core/rules/types';
import type { CommandWord } from '@/core/shell/model';
import { normalizeCommandToken } from '@/core/shell/tokens';
import { parseSimpleWords } from '@/core/shell/traversal';
import type { AnalyzeNestedOverrides, PathResolver } from '@/gate/analysis';
import { extractAwkExecutableSources } from './awk';
import {
  type ChildProvenance,
  childProvenance,
  collectCommandTemplate,
  type NestedCommandAnalyzeContext,
  type NormalizedChildCommand,
  normalizeChildCommands,
} from './child-command';
import { analysisWordText, textCommandWords } from './command-words';
import { dangerousInTextMatch } from './dangerous-text';
import { substitutionAddsExecutableSource } from './dynamic-input';
import { parseFindArguments } from './find';
import { extractGitSubcommandAndRest } from './git/parse';
import { GIT_RULE_SUBCOMMANDS } from './git/rules';
import { extractInterpreterExecutableSources } from './interpreters';
import { analyzeRmMatch } from './rm';
import { dynamicShellSourceMatch } from './reasons';
import { hasRecursiveForceFlags } from './rm-flags';
import {
  extractPositionalShellSource,
  extractShellScriptOperandSource,
  quoteShellWord,
  shellSourceHasUnresolvedDynamicExecutionCarrier,
} from './shell-execution';
import {
  extractDashCArg,
  hasUnidentifiableCommandString,
  isShellSyntaxCheck,
} from './shell-wrappers';
import { extractXargsChildCommandWithInfo } from './xargs';

export const REASON_PARALLEL_RM =
  'parallel rm -rf with dynamic input is dangerous. Use explicit file list instead.';
export const REASON_PARALLEL_SHELL =
  'parallel with shell -c can execute arbitrary commands from dynamic input. Run the inner command directly on an explicit file list instead.';
const REASON_PARALLEL_COMMAND_STREAM =
  'parallel without a command reads executable commands from dynamic input. Use an explicit command template or ::: arguments instead.';
const REASON_PARALLEL_UNSUPPORTED =
  'parallel command construction cannot be verified safely. Use the default ::: separator, literal arguments, and built-in replacement strings.';
const PARALLEL_PLACEHOLDER_RE = /\{[^{}\s]*\}/g;
const PARALLEL_RM_PLACEHOLDER_RE = /\{\}|\{-?\d+\}/g;
const SHELL_SOURCE_CHARACTER_RE = /[\s;&|<>()$`\\"']/;
const AWK_SOURCE_OPTION_INPUTS = ['e', 'f', 'source', 'file', '-e', '-f', '--source', '--file'];
const INTERPRETER_SOURCE_OPTION_INPUTS = [
  'c',
  'e',
  'eval',
  'm',
  'r',
  'Mmodule',
  'import',
  'require',
  '-c',
  '-e',
  '-m',
  '-r',
  '--eval',
  '--import',
  '--require',
];
const PARALLEL_OPTIONS_WITH_VALUE = new Set([
  '-L',
  '-d',
  '-n',
  '--delay',
  '--delimiter',
  '--header',
  '--joblog',
  '--jl',
  '--max-args',
  '--max-lines',
  '--nice',
  '--results',
  '--result',
  '--res',
  '--tagstring',
  '--timeout',
]);
const PARALLEL_UNSUPPORTED_INPUT_OPTIONS = new Set([
  '--arg-file',
  '--colsep',
  '--rpl',
  '--arg-sep',
  '--arg-file-sep',
]);
const PARALLEL_REMOTE_OPTIONS = new Set(['-S', '--sshlogin', '--slf', '--sshloginfile']);
const PARALLEL_WORKDIR_OPTIONS = new Set(['--workdir', '--wd']);
const PARALLEL_APPENDED_SOURCE = '__CC_SAFETY_NET_PARALLEL_SOURCE__';

export interface ParallelAnalyzeContext extends NestedCommandAnalyzeContext {
  analyzeChild: (
    tokens: readonly string[],
    child: ChildProvenance,
  ) => DestructiveCommandRuleMatch | null;
  analyzeNested: (
    command: string,
    overrides?: AnalyzeNestedOverrides,
  ) => DestructiveCommandRuleMatch | null;
}

function firstMatch<T>(
  values: Iterable<T>,
  analyze: (value: T) => DestructiveCommandRuleMatch | null,
): DestructiveCommandRuleMatch | null {
  for (const value of values) {
    const result = analyze(value);
    if (result) return result;
  }
  return null;
}

function dangerousParallelEnvValue(values: Iterable<string>): DestructiveCommandRuleMatch | null {
  return firstMatch([...values], (value) => dangerousInTextMatch(value));
}

export function analyzeParallel(
  words: readonly CommandWord[],
  context: ParallelAnalyzeContext,
): DestructiveCommandRuleMatch | null {
  const tokens = words.map(analysisWordText);
  const ambientOptions = context.envAssignments?.has('PARALLEL')
    ? context.envAssignments.get('PARALLEL')
    : context.environment.env.get('PARALLEL');
  if (ambientOptions?.trim()) {
    const reason = parallelUnsupportedReason(context);
    if (reason) return reason;
  }

  if (tokens.length === 2 && (tokens[1] === '--version' || tokens[1] === '--help')) {
    return null;
  }

  const parseResult = parseParallelCommand(tokens);
  const { template, jobs, runsRemotely, readsCommandsFromInput, unsupported, workdir, dryRun } =
    parseResult;

  if (unsupported) {
    const reason = parallelUnsupportedReason(context);
    if (reason) return reason;
    const dangerousEnvValue = dangerousParallelEnvValue(context.envAssignments?.values() ?? []);
    if (dangerousEnvValue) return dangerousEnvValue;
  }

  if (readsCommandsFromInput) {
    const reason = parallelCommandStreamDynamicReason(context);
    if (reason) return reason;
  }

  if (workdir !== undefined && runsRemotely) {
    const reason = parallelUnsupportedReason(context);
    if (reason) return reason;
  }
  const workdirCwd = resolveParallelWorkdir(workdir, context.cwd, context.environment.paths);
  if (workdirCwd === null) {
    const reason = parallelUnsupportedReason(context);
    if (reason) return reason;
  }
  const executionContext = runsRemotely
    ? { ...context, cwd: undefined, originalCwd: undefined }
    : workdirCwd === null || workdirCwd === undefined || workdirCwd === context.cwd
      ? context
      : { ...context, cwd: workdirCwd };

  if (dryRun) {
    const envValues = [...normalizeChildCommands(template, executionContext)].flatMap(
      (childCommand) => [...childCommand.envAssignments.values()],
    );
    if (envValues.some(hasExecutableParallelPlaceholder)) {
      const reason = parallelUnsupportedReason(context);
      if (reason) return reason;
    }
    return null;
  }

  if (template.length === 0) {
    const commands = jobs.map((job) => job[0] ?? '');
    context.budget.charge('derivedTokens', commands.length);
    const nestedOverrides = buildNestedOverrides(
      executionContext.envAssignments,
      executionContext.cwd,
      runsRemotely,
    );
    return firstMatch(commands, (command) => context.analyzeNested(command, nestedOverrides));
  }

  return firstMatch(normalizeChildCommands(template, executionContext), (childCommand) =>
    analyzeParallelChildCommand(childCommand, parseResult, context, executionContext),
  );
}

function analyzeParallelChildCommand(
  childCommand: NormalizedChildCommand,
  parseResult: ParallelParseResult,
  context: ParallelAnalyzeContext,
  executionContext: ParallelAnalyzeContext,
): DestructiveCommandRuleMatch | null {
  const { templateHasPlaceholder, runsRemotely, usesStdin } = parseResult;
  const childTokens = childCommand.tokens;
  const childEnvValues = [...childCommand.envAssignments.values()];
  if (childEnvValues.some(hasUnsupportedParallelPlaceholder)) {
    const reason = parallelUnsupportedReason(context);
    if (reason) return reason;
  }
  const dangerousChildEnvValue = dangerousParallelEnvValue(childEnvValues);
  if (dangerousChildEnvValue) return dangerousChildEnvValue;
  const envHasPlaceholder = childEnvValues.some(hasParallelPlaceholder);
  const hasPlaceholder = templateHasPlaceholder || envHasPlaceholder;
  const hasDynamicStdinPlaceholder = usesStdin && hasPlaceholder;
  const childOverrides = buildNestedOverrides(
    childCommand.envAssignments,
    childCommand.wrapperCwd,
    runsRemotely || hasDynamicStdinPlaceholder,
  );
  const nestedOverrides = hasPlaceholder
    ? { ...childOverrides, worktreeMode: false }
    : childOverrides;

  const shellSource = childTokens.join(' ');
  const jobValuesRunAsCommand = hasParallelPlaceholder(shellSource.split(/[ \t\n=]/, 1)[0] ?? '');
  const runsAsShellSource =
    !parseResult.quotesCommand &&
    (jobValuesRunAsCommand || childTokens.some((token) => SHELL_SOURCE_CHARACTER_RE.test(token)));
  const headIsShellSource =
    jobValuesRunAsCommand || SHELL_SOURCE_CHARACTER_RE.test(childTokens[0] ?? '');
  const wordsResult =
    runsAsShellSource && headIsShellSource && parseResult.jobs.length > 0
      ? null
      : analyzeParallelChildWords(
          childCommand,
          parseResult,
          context,
          executionContext,
          nestedOverrides,
          envHasPlaceholder,
        );
  if (wordsResult || !runsAsShellSource) return wordsResult;
  return analyzeParallelShellSource(
    hasParallelPlaceholder(shellSource) ? shellSource : `${shellSource} {}`,
    !jobValuesRunAsCommand,
    childCommand,
    parseResult,
    context,
    executionContext,
    nestedOverrides,
  );
}

function analyzeParallelChildWords(
  childCommand: NormalizedChildCommand,
  parseResult: ParallelParseResult,
  context: ParallelAnalyzeContext,
  executionContext: ParallelAnalyzeContext,
  nestedOverrides: AnalyzeNestedOverrides | undefined,
  envHasPlaceholder: boolean,
): DestructiveCommandRuleMatch | null {
  const { jobs, templateHasPlaceholder, runsRemotely, usesStdin } = parseResult;
  const childTokens = childCommand.tokens;
  const hasPlaceholder = templateHasPlaceholder || envHasPlaceholder;

  if (SHELL_WRAPPERS.has(childCommand.head)) {
    const analyzeExpandedShellArgv = () => {
      if (!templateHasPlaceholder || jobs.length === 0) return null;
      return firstMatch(jobs, (job) =>
        context.analyzeChild(
          expandParallelJob(childTokens, job, context.budget),
          childProvenance(childCommand, executionContext),
        ),
      );
    };
    if (isShellSyntaxCheck(childTokens)) return analyzeExpandedShellArgv();
    if (hasUnidentifiableCommandString(childTokens)) return dynamicShellSourceMatch();
    const dashCArg = extractDashCArg(childTokens);
    if (dashCArg) {
      if (isOnlyParallelPlaceholder(dashCArg)) {
        const reason = parallelShellDynamicReason(context);
        if (reason) return reason;
        if (jobs.length === 0) return null;
        return firstMatch(jobs, (job) =>
          context.analyzeNested(
            expandParallelString(dashCArg, job, context.budget),
            nestedOverrides,
          ),
        );
      }

      if (hasParallelPlaceholder(dashCArg)) {
        return analyzeParallelShellSource(
          dashCArg,
          false,
          childCommand,
          parseResult,
          context,
          executionContext,
          nestedOverrides,
        );
      }

      const positionalSources =
        !envHasPlaceholder && (!templateHasPlaceholder || jobs.length > 0)
          ? (jobs.length > 0 ? jobs : [undefined]).map((job) =>
              extractPositionalShellSource(
                textCommandWords(
                  job === undefined
                    ? childTokens
                    : templateHasPlaceholder
                      ? childTokens.map((token) => replaceParallelJobPlaceholder(token, job))
                      : [...childTokens, ...job],
                ),
                dashCArg,
              ),
            )
          : [];
      if (positionalSources.some((source) => source.kind === 'dynamic')) {
        const reason = parallelShellDynamicReason(context);
        if (reason) return reason;
      }
      const literalPositionalSources = positionalSources.flatMap((source) =>
        source.kind === 'literal' ? [source.source] : [],
      );
      if (literalPositionalSources.length > 0) {
        context.budget.charge('derivedTokens', literalPositionalSources.length);
        return firstMatch(literalPositionalSources, (source) =>
          context.analyzeNested(source, nestedOverrides),
        );
      }
      if (shellSourceHasUnresolvedDynamicExecutionCarrier(dashCArg)) {
        const dynamicReason = parallelShellDynamicReason(context);
        if (dynamicReason) return dynamicReason;
      }
      const reason = context.analyzeNested(dashCArg, nestedOverrides);
      if (reason) {
        return reason;
      }

      if (hasPlaceholder) {
        return parallelShellDynamicReason(context);
      }
      return null;
    }

    const scriptSource = extractShellScriptOperandSource(textCommandWords(childTokens));
    if (
      scriptSource.kind === 'dynamic' ||
      (scriptSource.kind === 'literal' && hasParallelPlaceholder(scriptSource.source))
    ) {
      const reason = parallelShellDynamicReason(context);
      return reason ?? analyzeExpandedShellArgv();
    }
    if (scriptSource.kind === 'literal') return analyzeExpandedShellArgv();

    if (jobs.length > 0) {
      const reason = parallelShellDynamicReason(context);
      if (reason) return reason;
      const expandedArgvReason = analyzeExpandedShellArgv();
      if (expandedArgvReason) return expandedArgvReason;
      if (templateHasPlaceholder) return null;
      const sources = jobs.flatMap((job) => (job[0] === undefined ? [] : [job[0]]));
      context.budget.charge('derivedTokens', sources.length);
      return firstMatch(sources, (source) => context.analyzeNested(source, nestedOverrides));
    }

    if (hasPlaceholder || usesStdin) {
      const reason = parallelShellDynamicReason(context);
      return reason ?? analyzeExpandedShellArgv();
    }
    return null;
  }

  if (childCommand.head === 'rm' && hasRecursiveForceFlags(childTokens)) {
    if (templateHasPlaceholder && jobs.length > 0) {
      return firstMatch(jobs, (job) =>
        analyzeParallelRmExpansion(
          expandParallelJob(childTokens, job, context.budget, PARALLEL_RM_PLACEHOLDER_RE),
          childCommand.cwd,
          executionContext,
        ),
      );
    }

    if (jobs.length > 0) {
      return firstMatch(jobs, (job) =>
        analyzeParallelRmExpansion(
          appendParallelJob(childTokens, job, context.budget),
          childCommand.cwd,
          executionContext,
        ),
      );
    }
    const staticResult = analyzeParallelRmExpansion(
      childTokens.flatMap((token, index) => {
        if (index === 0 || !hasParallelPlaceholder(token)) return [token];
        return token.startsWith('-') ? [token.replace(PARALLEL_RM_PLACEHOLDER_RE, '')] : [];
      }),
      childCommand.cwd,
      executionContext,
    );
    if (staticResult) return staticResult;
    return parallelRmDynamicReason(context);
  }

  const childJobs: readonly (ParallelJob | undefined)[] = jobs.length > 0 ? jobs : [undefined];
  return firstMatch(childJobs, (job) => {
    const tokens =
      job === undefined
        ? childTokens
        : templateHasPlaceholder
          ? expandParallelJob(childTokens, job, context.budget)
          : appendParallelJob(childTokens, job, context.budget);
    const shellDynamicMatch = destructiveCommandMatch(
      'parallel.shell-dynamic',
      REASON_PARALLEL_SHELL,
    );
    const findDynamicInput =
      usesStdin && childCommand.head === 'find'
        ? analyzeDynamicParallelFind(tokens, executionContext)
        : null;
    const dynamicCustomResult =
      matchParallelStdinPolicyRule(tokens, usesStdin, context) ??
      findDynamicInput?.customResult ??
      null;
    const normalizedHead = normalizeCommandToken(childCommand.head);
    const dynamicRmInput =
      usesStdin &&
      ((normalizedHead === 'rm' && parallelInputCanChangeRmOptions(tokens)) ||
        (normalizedHead === 'xargs' && nestedRmInputCanChangeOptions(tokens)) ||
        findDynamicInput?.rmOptions === true);
    const dynamicSourceInput =
      usesStdin &&
      (dynamicRmInput ||
        findDynamicInput?.executedSource === true ||
        (findDynamicInput === null &&
          parallelInputCanChangeExecutedSource(tokens, normalizedHead)));
    const result = context.analyzeChild(tokens, {
      ...childProvenance(childCommand, executionContext),
      worktreeMode: runsRemotely || usesStdin || hasPlaceholder ? false : context.worktreeMode,
      dynamicInput: usesStdin || hasPlaceholder,
      dynamicRmInput,
      dynamicSourceInput: dynamicCustomResult !== null || dynamicSourceInput,
      shellDynamicMatch,
      dynamicSourceMatch: shellDynamicMatch,
      rmDynamicMatch: destructiveCommandMatch(
        'parallel.rm-recursive-force-dynamic',
        REASON_PARALLEL_RM,
      ),
    });

    if (dynamicSourceInput) {
      const parallelDynamic = filterDestructiveCommandMatch(shellDynamicMatch, context.policy);
      if (parallelDynamic) return parallelDynamic;
    }
    return (
      result ?? dynamicCustomResult ?? checkPolicyRuleMatch(tokens, context.policy?.rules ?? [])
    );
  });
}

function analyzeParallelShellSource(
  source: string,
  quoteJobValues: boolean,
  childCommand: NormalizedChildCommand,
  parseResult: ParallelParseResult,
  context: ParallelAnalyzeContext,
  executionContext: ParallelAnalyzeContext,
  nestedOverrides: AnalyzeNestedOverrides | undefined,
): DestructiveCommandRuleMatch | null {
  if (parseResult.jobs.length > 0) {
    return firstMatch(parseResult.jobs, (job) =>
      context.analyzeNested(
        expandParallelString(
          source,
          quoteJobValues ? job.map(quoteShellWord) : job,
          context.budget,
        ),
        nestedOverrides,
      ),
    );
  }

  const scriptTokens = parseSimpleWords(source);
  if (
    scriptTokens?.[0] &&
    normalizeCommandToken(scriptTokens[0]) === 'rm' &&
    hasRecursiveForceFlags(scriptTokens)
  ) {
    const reason = parallelRmDynamicReason(context);
    if (reason) return reason;
  }
  const dynamicReason = scriptTokens
    ? context.analyzeChild(scriptTokens, {
        ...childProvenance(childCommand, executionContext),
        dynamicInput: parseResult.usesStdin,
        shellDynamicMatch: destructiveCommandMatch('parallel.shell-dynamic', REASON_PARALLEL_SHELL),
        rmDynamicMatch: destructiveCommandMatch(
          'parallel.rm-recursive-force-dynamic',
          REASON_PARALLEL_RM,
        ),
      })
    : null;
  return dynamicReason ?? context.analyzeNested(source, nestedOverrides);
}

function parallelInputCanChangeExecutedSource(
  tokens: readonly string[],
  childHead: string,
): boolean {
  if (hasParallelPlaceholder(tokens[0] ?? '')) return true;
  if (childHead === 'eval' || childHead === 'source' || childHead === '.') return true;
  if (childHead === 'parallel' || childHead === 'xargs') return true;
  if (SHELL_WRAPPERS.has(childHead)) return shellArgvHasParallelSource(tokens);
  if (childHead === 'git') {
    return gitInputCanChangeProtectedOperation(tokens);
  }
  if (childHead === 'find') return true;
  if (AWK_INTERPRETERS.has(childHead))
    return executableSourceCanChange(tokens, AWK_SOURCE_OPTION_INPUTS, extractAwkExecutableSources);
  if (isInterpreterCommand(childHead))
    return executableSourceCanChange(
      tokens,
      INTERPRETER_SOURCE_OPTION_INPUTS,
      extractInterpreterExecutableSources,
    );
  return false;
}

function parallelInputCanChangeRmOptions(tokens: readonly string[]): boolean {
  const optionTerminator = tokens.indexOf('--');
  const optionTokens = tokens.slice(1, optionTerminator === -1 ? undefined : optionTerminator);
  const hasPlaceholder = tokens.some(hasParallelPlaceholder);
  if (!hasPlaceholder) return optionTerminator === -1;
  return optionTokens.some(
    (token) =>
      hasParallelPlaceholder(token) && (token.startsWith('-') || isOnlyParallelPlaceholder(token)),
  );
}

function gitInputCanChangeProtectedOperation(tokens: readonly string[]): boolean {
  if (gitGlobalConfigCanChange(tokens)) return true;
  const parsed = extractGitSubcommandAndRest(tokens);
  if (parsed.subcommand === null || hasParallelPlaceholder(parsed.subcommand)) return true;
  if (!GIT_RULE_SUBCOMMANDS.has(parsed.subcommand.toLowerCase())) return false;

  const optionTerminator = parsed.rest.indexOf('--');
  const structuralTokens = parsed.rest.slice(
    0,
    optionTerminator === -1 ? undefined : optionTerminator,
  );
  const hasPlaceholder = tokens.some(hasParallelPlaceholder);
  if (!hasPlaceholder) return optionTerminator === -1;
  return structuralTokens.some(hasParallelPlaceholder);
}

function gitGlobalConfigCanChange(tokens: readonly string[]): boolean {
  for (let index = 1; index < tokens.length; index++) {
    const token = tokens[index];
    if (!token || token === '--' || !token.startsWith('-')) return false;
    if (token === '-c' || token === '--config-env') {
      if (hasParallelPlaceholder(tokens[index + 1] ?? '')) return true;
      index++;
      continue;
    }
    if ((token.startsWith('-c') && token.length > 2) || token.startsWith('--config-env=')) {
      if (hasParallelPlaceholder(token)) return true;
      continue;
    }
    if (hasParallelPlaceholder(token)) return true;
  }
  return false;
}

function shellArgvHasParallelSource(tokens: readonly string[]): boolean {
  if (isShellSyntaxCheck(tokens)) return false;
  const dashCArg = extractDashCArg(tokens);
  if (dashCArg !== null) return hasParallelPlaceholder(dashCArg);
  const scriptSource = extractShellScriptOperandSource(textCommandWords(tokens));
  if (scriptSource.kind === 'literal') return hasParallelPlaceholder(scriptSource.source);
  if (scriptSource.kind === 'dynamic') return true;
  return !tokens.some(hasParallelPlaceholder);
}

function executableSourceCanChange<T extends { kind: string; tokenIndex: number; value: string }>(
  tokens: readonly string[],
  candidates: readonly string[],
  extractSources: (tokens: readonly string[]) => readonly T[],
): boolean {
  const existingSources = extractSources(tokens);
  if (existingSources.some((source) => hasParallelPlaceholder(source.value))) return true;
  if (!tokens.some(hasParallelPlaceholder)) {
    return extractSources([...tokens, PARALLEL_APPENDED_SOURCE]).some(
      (source) => source.value === PARALLEL_APPENDED_SOURCE,
    );
  }
  return substitutionAddsExecutableSource(existingSources, candidates, (candidate) =>
    extractSources(tokens.map((token) => replaceParallelJobPlaceholder(token, [candidate]))),
  );
}

function matchParallelStdinPolicyRule(
  tokens: readonly string[],
  usesStdin: boolean,
  context: ParallelAnalyzeContext,
): DestructiveCommandRuleMatch | null {
  const rules = context.policy?.rules ?? [];
  if (!usesStdin || rules.length === 0) return null;
  const relevantRules = rules.filter(
    (rule) => normalizeCommandToken(rule.command) === normalizeCommandToken(tokens[0] ?? ''),
  );
  if (relevantRules.length === 0) return null;
  if (tokens.slice(1).some(hasParallelPlaceholder)) return parallelShellDynamicReason(context);

  return firstMatch(relevantRules, (rule) =>
    checkPolicyRuleMatch(
      [...tokens, ...(rule.subcommand ? [rule.subcommand] : []), ...rule.block_args],
      [rule],
    ),
  );
}

type DynamicParallelFindAnalysis = {
  customResult: DestructiveCommandRuleMatch | null;
  executedSource: boolean;
  rmOptions: boolean;
};

function analyzeDynamicParallelFind(
  tokens: readonly string[],
  context: ParallelAnalyzeContext,
): DynamicParallelFindAnalysis {
  const parsed = parseFindArguments(tokens);
  const analysis: DynamicParallelFindAnalysis = {
    customResult: null,
    executedSource:
      !tokens.some(hasParallelPlaceholder) ||
      [
        ...parsed.leadingOptions,
        ...parsed.startingPoints,
        ...parsed.expression.map((part) => part.index),
      ].some((index) => hasParallelPlaceholder(tokens[index] ?? '')),
    rmOptions: false,
  };
  const execCommands = parsed.expression.flatMap((part) =>
    part.kind === 'exec' && part.command.some(hasParallelPlaceholder) ? [part.command] : [],
  );
  for (const childCommand of execCommands.flatMap((command) => [
    ...normalizeChildCommands(command, context),
  ])) {
    analysis.executedSource ||= parallelInputCanChangeExecutedSource(
      childCommand.tokens,
      childCommand.head,
    );
    analysis.rmOptions ||=
      (childCommand.head === 'rm' && parallelInputCanChangeRmOptions(childCommand.tokens)) ||
      (childCommand.head === 'xargs' && nestedRmInputCanChangeOptions(childCommand.tokens));
    analysis.customResult ??= matchParallelStdinPolicyRule(childCommand.tokens, true, context);
  }
  return analysis;
}

function nestedRmInputCanChangeOptions(tokens: readonly string[]): boolean {
  const childTokens = tokens.slice(extractXargsChildCommandWithInfo(tokens).childStart);
  return (
    normalizeCommandToken(childTokens[0] ?? '') === 'rm' &&
    parallelInputCanChangeRmOptions(childTokens)
  );
}

function parallelReason(ruleId: DestructiveCommandRuleId, reason: string) {
  return (context: ParallelAnalyzeContext): DestructiveCommandRuleMatch | null =>
    filterDestructiveCommandMatch(destructiveCommandMatch(ruleId, reason), context.policy);
}

const parallelShellDynamicReason = parallelReason('parallel.shell-dynamic', REASON_PARALLEL_SHELL);
const parallelCommandStreamDynamicReason = parallelReason(
  'parallel.command-stream-dynamic',
  REASON_PARALLEL_COMMAND_STREAM,
);
const parallelUnsupportedReason = parallelReason(
  'parallel.command-stream-dynamic',
  REASON_PARALLEL_UNSUPPORTED,
);
const parallelRmDynamicReason = parallelReason(
  'parallel.rm-recursive-force-dynamic',
  REASON_PARALLEL_RM,
);

function analyzeParallelRmExpansion(
  tokens: string[],
  cwd: string | undefined,
  context: ParallelAnalyzeContext,
): DestructiveCommandRuleMatch | null {
  return filterDestructiveCommandMatch(
    analyzeRmMatch(textCommandWords(tokens), {
      environment: context.environment,
      cwd,
      budget: context.budget,
      originalCwd: context.originalCwd,
      strict: context.strict,
      paranoid: context.paranoidRm,
      allowTmpdirVar: context.allowTmpdirVar,
      tmpdirWordSplittingUnsafe: hasUnsafeTmpdirWordSplitting(
        context.envAssignments ?? new Map(),
        context.environment,
      ),
      trustedTmpdirValue: isTmpdirValueTrusted(
        context.envAssignments ?? new Map(),
        context.environment,
      ),
      protectedGitMetadata: context.protectedGitMetadata,
      policy: context.policy,
    }),
    context.policy,
  );
}

type ParallelJob = readonly string[];

function buildNestedOverrides(
  envAssignments: ReadonlyMap<string, string> | undefined,
  cwd: string | null | undefined,
  runsRemotely: boolean,
): AnalyzeNestedOverrides | undefined {
  const overrides: AnalyzeNestedOverrides = {};
  if (envAssignments) overrides.envAssignments = envAssignments;
  if (runsRemotely) {
    overrides.effectiveCwd = null;
    overrides.worktreeMode = false;
    return overrides;
  }
  if (cwd !== undefined) {
    overrides.effectiveCwd = cwd;
  }
  return Object.keys(overrides).length > 0 ? overrides : undefined;
}

interface ParallelParseResult {
  template: string[];
  jobs: ParallelJob[];

  childStart: number;
  templateHasPlaceholder: boolean;
  runsRemotely: boolean;
  quotesCommand: boolean;
  usesStdin: boolean;
  readsCommandsFromInput: boolean;
  unsupported: boolean;
  workdir: string | undefined;
  dryRun: boolean;
}

function replaceParallelJobPlaceholder(token: string, job: ParallelJob): string {
  return token.replace(PARALLEL_PLACEHOLDER_RE, (placeholder) =>
    getParallelPlaceholderValue(placeholder, job),
  );
}

function expandParallelJob(
  tokens: readonly string[],
  job: ParallelJob,
  budget: Budget,
  placeholders = PARALLEL_PLACEHOLDER_RE,
): string[] {
  budget.charge(
    'derivedTokens',
    tokens.reduce((total, token) => total + 1 + Math.floor(token.length / 64), 0),
  );
  return tokens.map((token) =>
    token.replace(placeholders, (placeholder) => {
      const value = getParallelPlaceholderValue(placeholder, job);
      budget.charge('derivedTokens', Math.max(1, Math.ceil(value.length / 64)));
      return value;
    }),
  );
}

function expandParallelString(value: string, job: ParallelJob, budget: Budget): string {
  return expandParallelJob([value], job, budget)[0] ?? '';
}

function appendParallelJob(tokens: readonly string[], job: ParallelJob, budget: Budget): string[] {
  budget.charge('derivedTokens', tokens.length + job.length);
  return [...tokens, ...job];
}

function getParallelPlaceholderValue(placeholder: string, job: ParallelJob): string {
  const position = /^\{(-?\d+)[^{}\s]*\}$/.exec(placeholder)?.[1];
  if (position === undefined) {
    return job[0] ?? '';
  }
  const parsed = Number(position);
  return job[parsed > 0 ? parsed - 1 : job.length + parsed] ?? '';
}

function hasParallelPlaceholder(token: string): boolean {
  return token.search(PARALLEL_PLACEHOLDER_RE) !== -1;
}

function hasUnsupportedParallelPlaceholder(token: string): boolean {
  if (hasExecutableParallelPlaceholder(token)) return true;
  for (const match of token.matchAll(PARALLEL_PLACEHOLDER_RE)) {
    if (!/^(?:\{\}|\{\d+\})$/.test(match[0])) {
      return true;
    }
  }
  return false;
}

function hasExecutableParallelPlaceholder(token: string): boolean {
  const perlStart = token.indexOf('{=');
  return perlStart !== -1 && token.indexOf('=}', perlStart + 2) !== -1;
}

function isOnlyParallelPlaceholder(token: string): boolean {
  return /^\{[^{}\s]*\}$/.test(token);
}

function resolveParallelWorkdir(
  workdir: string | undefined,
  cwd: string | undefined,
  paths: PathResolver,
): string | null | undefined {
  if (workdir === undefined) {
    return undefined;
  }
  if (workdir === '...' || /^~|[{}$`*?[]/.test(workdir)) {
    return null;
  }
  if (!cwd && !isAbsolute(workdir)) {
    return null;
  }
  try {
    return resolveChdirTarget(cwd ?? workdir, workdir, paths);
  } catch {
    return null;
  }
}

function parseParallelCommand(tokens: readonly string[]): ParallelParseResult {
  let i = 1;
  const templateTokens: string[] = [];

  let childStart = tokens.length;
  let markerIndex = -1;
  let runsRemotely = false;
  let quotesCommand = false;
  let usesPipe = false;
  let workdir: string | undefined;
  let dryRun = false;
  let unsupported = tokens.some(
    (token) => token === '::::' || token === '::::+' || token === ':::+',
  );

  while (i < tokens.length) {
    const token = tokens[i];
    if (token === undefined) break;

    if (token === ':::') {
      markerIndex = i;
      break;
    }

    if (token === '--') {
      const template = collectCommandTemplate(tokens, i + 1);
      templateTokens.push(...template.templateTokens);
      childStart = i + 1;
      markerIndex = template.markerIndex;
      break;
    }

    if (!token.startsWith('-')) {
      const template = collectCommandTemplate(tokens, i);
      templateTokens.push(...template.templateTokens);
      childStart = i;
      markerIndex = template.markerIndex;
      break;
    }

    const nextToken = tokens[i + 1];
    const equalsIndex = token.indexOf('=');
    const optionName = equalsIndex === -1 ? token : token.slice(0, equalsIndex);
    const attachedValue = equalsIndex === -1 ? undefined : token.slice(equalsIndex + 1);

    if (token === '--dry-run') {
      dryRun = true;
      i++;
      continue;
    }
    if (token === '-I' || (token.startsWith('-I') && token.length > 2)) {
      unsupported ||= (token === '-I' ? nextToken : token.slice(2)) !== '{}';
      i += token === '-I' ? 2 : 1;
      continue;
    }
    if (token === '--replace' || token === '-i') {
      unsupported = true;
      i += 2;
      continue;
    }
    if (optionName === '--replace' || (token.startsWith('-i') && token.length > 2)) {
      const replacement = optionName === '--replace' ? attachedValue : token.slice(2);
      unsupported ||= replacement !== '' && replacement !== '{}';
      i++;
      continue;
    }
    if (token === '-a' || PARALLEL_UNSUPPORTED_INPUT_OPTIONS.has(optionName)) {
      unsupported = true;
      i += attachedValue === undefined ? 2 : 1;
      continue;
    }
    if (token === '-q' || token === '--quote') {
      quotesCommand = true;
      i++;
      continue;
    }
    if (token === '--pipe' || token === '--pipepart') {
      usesPipe = true;
      i++;
      continue;
    }
    if (optionName === '--env') {
      unsupported = true;
      i += attachedValue === undefined ? 2 : 1;
      continue;
    }
    if (PARALLEL_REMOTE_OPTIONS.has(optionName) || (token.startsWith('-S') && token.length > 2)) {
      runsRemotely = true;
      i += PARALLEL_REMOTE_OPTIONS.has(token) ? 2 : 1;
      continue;
    }
    if (PARALLEL_WORKDIR_OPTIONS.has(optionName)) {
      unsupported = true;
      const value = attachedValue ?? nextToken;
      if (value === undefined || value === ':::' || value === '--') {
        i++;
        continue;
      }
      workdir = value;
      i += attachedValue === undefined ? 2 : 1;
      continue;
    }
    if (token.startsWith('-j') && token.length > 2 && /^\d+$/.test(token.slice(2))) {
      i++;
      continue;
    }
    if (token.startsWith('--') && attachedValue !== undefined) {
      i++;
      continue;
    }
    if (PARALLEL_OPTIONS_WITH_VALUE.has(token)) {
      if (nextToken === undefined || nextToken === ':::' || nextToken === '--') {
        unsupported = true;
        i++;
        continue;
      }
      i += 2;
      continue;
    }
    i += token === '-j' || token === '--jobs' ? 2 : 1;
  }

  unsupported ||= templateTokens.some(
    dryRun ? hasExecutableParallelPlaceholder : hasUnsupportedParallelPlaceholder,
  );

  const argumentGroups: string[][] = [];
  if (markerIndex !== -1) {
    let group: string[] = [];
    for (let j = markerIndex + 1; j < tokens.length; j++) {
      const token = tokens[j];
      if (token === ':::') {
        argumentGroups.push(group);
        group = [];
        continue;
      }
      if (token !== undefined) {
        group.push(token);
      }
    }
    argumentGroups.push(group);
  }
  unsupported ||= argumentGroups.length > 1;
  const jobs = expandParallelJobs(argumentGroups);

  const templateHasPlaceholder = templateTokens.some(hasParallelPlaceholder);
  const readsCommandsFromInput = templateTokens.length === 0 && markerIndex === -1;

  return {
    template: templateTokens,
    jobs,
    childStart,
    templateHasPlaceholder,
    runsRemotely,
    quotesCommand,
    usesStdin: usesPipe || markerIndex === -1,
    readsCommandsFromInput,
    unsupported,
    workdir,
    dryRun,
  };
}

function expandParallelJobs(argumentGroups: readonly (readonly string[])[]): ParallelJob[] {
  if (argumentGroups.length === 0 || argumentGroups.some((group) => group.length === 0)) {
    return [];
  }
  let jobs: string[][] = [[]];
  for (const [index, group] of argumentGroups.entries()) {
    if (group.length === 1) {
      const arg = group[0];
      if (arg === undefined) return [];
      for (const job of jobs) job.push(arg);
      if (jobs.length * (index + 1) > LIMITS.derivedTokens.cap) {
        throw new AnalysisLimit('derivedTokens');
      }
      continue;
    }
    const expanded: string[][] = [];
    for (const job of jobs) {
      for (const arg of group) {
        if ((expanded.length + 1) * (index + 1) > LIMITS.derivedTokens.cap) {
          throw new AnalysisLimit('derivedTokens');
        }
        expanded.push([...job, arg]);
      }
    }
    jobs = expanded;
  }
  return jobs;
}

export function extractParallelChildStart(tokens: readonly string[]): number {
  return parseParallelCommand(tokens).childStart;
}
