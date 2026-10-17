import { dirname, isAbsolute, join, parse as parsePath, resolve, sep } from 'node:path';
import { AnalysisLimit, type Budget, LIMITS } from '@/core/budget';
import { resolveExistingPath } from '@/core/paths/canonicalization';
import {
  destructiveCommandRuleIsEnabled,
  filterDestructiveCommandMatch,
} from '@/core/policy/effective-rules';
import { isInterpreterCommand } from '@/core/policy/transparent-wrappers';
import type { CommandAnalysisPolicy } from '@/core/policy/types';
import { SHELL_WRAPPERS } from '@/core/rules/constants';
import { destructiveCommandMatch } from '@/core/rules/destructive';
import {
  type CommandHeredoc,
  type CommandProgram,
  type CommandRedirection,
  type CommandView,
  type CommandWord,
  getCalledCommandName,
  isDynamicExecutable,
} from '@/core/shell/model';
import { parseCommand } from '@/core/shell/parse';
import { getBasename, normalizeCommandToken } from '@/core/shell/tokens';
import type {
  AnalysisModeFlag,
  AnalyzeInput,
  AnalyzeNestedOverrides,
  AnalyzeOptions,
  AnalyzeResult,
  DestructiveCommandRuleMatch,
  EnvironmentContext,
  PathResolver,
} from '@/gate/analysis';
import type { SemanticFactStore } from '@/gate/facts';
import type { CommandTraceContext } from '@/gate/trace';
import { analysisWordText, analyzedViewWords } from './command-words';
import { dangerousInTextMatch } from './dangerous-text';
import { isDataOnlyQuotedAssignment } from './deferred-assignment';
import { analyzeDeviceRedirectionMatch } from './device';
import { isPersistentHeredocFilePath, resolveTrackedHeredocPath } from './heredoc-files';
import {
  containsDangerousCode,
  REASON_INTERPRETER_BLOCKED,
  REASON_INTERPRETER_DANGEROUS,
} from './interpreters';
import { analyzePowerShellCommandViewMatch } from './powershell/remove-item';
import {
  REASON_RECURSION_LIMIT,
  REASON_STRICT_UNPARSEABLE,
  REASON_UNSUPPORTED_HEREDOC_SYNTAX,
} from './reasons';
import { analyzeSegment, resolveCwdAfterCommandView } from './segment';
import { extractLiteralPrintfOutput } from './shell-execution';
import {
  applyShellGitContextEnvSegment,
  cloneShellGitContextEnvState,
  createShellGitContextEnvState,
  expandHomeTildeWord,
  expandKnownVariableWord,
  getSegmentGitContextEnvAssignments,
  type ShellGitContextEnvState,
  segmentTokensWithExpandedAssignments,
  withImplicitShellVariables,
} from './shell-git-env';
import { isShellSyntaxCheck } from './shell-wrappers';
import { stripWrapperWords } from './wrapper-prelude';

export type InternalOptions = AnalyzeInput &
  Pick<AnalyzeOptions, AnalysisModeFlag> & {
    policy: CommandAnalysisPolicy;
    factStore?: SemanticFactStore;
    budget: Budget;
    literalHeredocFiles?: ReadonlyMap<string, string>;
    functionDefinitions?: ReadonlyMap<string, CommandProgram>;
    rootProgram?: CommandProgram;
  };

const REASON_UNQUOTED_HEREDOC =
  'Unquoted heredoc input is not supported safely. Quote the delimiter or ask the user to verify.';
const REASON_UNSUPPORTED_HEREDOC =
  'This heredoc form or stdin consumer is not supported safely. Use a quoted heredoc with a supported consumer (cat, tee, git apply, git commit, gh pr create, gh issue create), or ask the user to verify.';

export function analyzeCommandInternal(
  command: string,
  depth: number,
  options: InternalOptions,
  parsedProgram?: CommandProgram,
): AnalyzeResult | null {
  if (depth >= LIMITS.recursionDepth.cap) {
    options.trace?.recordSegment({ type: 'error', message: REASON_RECURSION_LIMIT });
    return {
      reason: REASON_RECURSION_LIMIT,
      segment: command,
      ruleId: 'analysis.recursion-limit',
      intent: 'stop_and_explain',
    };
  }

  const program =
    parsedProgram ??
    options.factStore?.getCommandProgram(command, options.shell ?? 'auto') ??
    parseCommand(command, options.shell);

  if (program.status === 'limited') {
    options.trace?.recordSegment({ type: 'error', message: REASON_RECURSION_LIMIT });
    return {
      reason: REASON_RECURSION_LIMIT,
      segment: command,
      ruleId: 'analysis.recursion-limit',
      intent: 'stop_and_explain',
    };
  }

  if (program.status === 'invalid') {
    const heredocIssue = program.issues.find((issue) => issue.code.includes('heredoc'));
    if (heredocIssue) {
      if (!options.strict) return analyzeUnparseableCommand(command, options);
      const reason = `${REASON_UNSUPPORTED_HEREDOC_SYNTAX}: ${heredocIssue.message}`;
      options.trace?.recordGlobal({ type: 'error', message: reason });
      return {
        reason,
        segment: command,
        ruleId: 'analysis.unsupported-heredoc',
        intent: 'stop_and_explain',
      };
    }
    recordStrictUnparseable(command, options);
    return {
      reason: REASON_STRICT_UNPARSEABLE,
      segment: command,
      ruleId: 'analysis.strict-unparseable',
      intent: 'stop_and_explain',
    };
  }

  if (options.strict && program.status === 'partial') {
    recordStrictUnparseable(command, options);
    return {
      reason: REASON_STRICT_UNPARSEABLE,
      segment: command,
      ruleId: 'analysis.strict-unparseable',
      intent: 'stop_and_explain',
    };
  }

  const hasUnclosedQuote = program.issues.some((issue) => issue.code.includes('quote'));
  if (hasUnclosedQuote) {
    return analyzeUnparseableCommand(command, options);
  }

  const originalCwd = options.cwd;

  const effectiveCwd = options.effectiveCwd !== undefined ? options.effectiveCwd : options.cwd;
  const shellGitContextState = createShellGitContextEnvState(
    options.environment.env,
    options.envAssignments,
  );
  return analyzeProgram(program, depth, { ...options, rootProgram: program }, originalCwd, [
    {
      effectiveCwd,
      shellGitContextState,
      literalHeredocFiles: new Map(options.literalHeredocFiles),
      functionDefinitions: new Map(options.functionDefinitions),
      createdDirectories: new Set(),
      compoundBodies: [],
    },
  ]).result;
}

type AnalysisState = {
  effectiveCwd: string | null | undefined;
  shellGitContextState: ShellGitContextEnvState;
  literalHeredocFiles: Map<string, string>;
  functionDefinitions: Map<string, CommandProgram>;
  createdDirectories: Set<string>;
  compoundBodies: readonly CompoundBody[];
};

type CompoundBody = {
  readonly entryCwd: string | null | undefined;
  readonly branchCwds: readonly (string | null | undefined)[];
  readonly hasElse: boolean;
};

type ProgramAnalysis = {
  result: AnalyzeResult | null;
  states: AnalysisState[];
};

type ConditionalAnalysisStates = {
  success: AnalysisState[];
  failure: AnalysisState[];
};

type ControlFlowOutcome = {
  connector: string | undefined;
  skippedSuccessStates: readonly AnalysisState[];
  skippedFailureStates: readonly AnalysisState[];
};

function analyzeProgram(
  program: CommandProgram,
  depth: number,
  options: InternalOptions,
  originalCwd: string | undefined,
  initialStates: readonly AnalysisState[],
): ProgramAnalysis {
  let states = [...initialStates];
  let conditionalStates: ConditionalAnalysisStates | undefined;
  let previousConnector: string | undefined;
  let pipelineOutcome: ControlFlowOutcome | undefined;
  for (const [nodeIndex, node] of program.nodes.entries()) {
    if (node.kind === 'connector') {
      previousConnector = node.operator;
      continue;
    }
    const nextNode = program.nodes[nodeIndex + 1];
    const nextConnector = nextNode?.kind === 'connector' ? nextNode.operator : undefined;
    const isolated = isAnalysisNodeIsolated(
      program,
      nodeIndex,
      node,
      previousConnector,
      nextConnector,
    );
    const conditional = previousConnector === '&&' || previousConnector === '||';
    const priorConditionalStates = conditional ? conditionalStates : undefined;
    const executionStates =
      previousConnector === '&&'
        ? (priorConditionalStates?.success ?? states)
        : previousConnector === '||'
          ? (priorConditionalStates?.failure ?? states)
          : states;
    const skippedSuccessStates =
      previousConnector === '||' ? (priorConditionalStates?.success ?? []) : [];
    const skippedFailureStates =
      previousConnector === '&&' ? (priorConditionalStates?.failure ?? []) : [];
    const connectorOutcome = {
      connector: previousConnector,
      skippedSuccessStates,
      skippedFailureStates,
    };
    if (isPipelineConnector(nextConnector) && !isPipelineConnector(previousConnector)) {
      pipelineOutcome = connectorOutcome;
    }
    const outcome = isPipelineConnector(nextConnector)
      ? { connector: undefined, skippedSuccessStates: [], skippedFailureStates: [] }
      : isPipelineConnector(previousConnector)
        ? (pipelineOutcome ?? connectorOutcome)
        : connectorOutcome;
    const tracksCommandOutcome =
      isConditionalConnector(outcome.connector) || isConditionalConnector(nextConnector);

    if (node.kind === 'function') {
      const successStates = executionStates.flatMap((state) => {
        const definedState = cloneAnalysisState(state);
        definedState.functionDefinitions.set(node.name, node.body);
        return getSuccessfulAnalysisStates(
          state,
          [definedState],
          isolated,
          nextConnector === '&',
          isConditionalConnector(nextConnector),
        );
      });
      const next = finishControlFlowStep(
        successStates,
        [],
        outcome.skippedSuccessStates,
        outcome.skippedFailureStates,
        outcome.connector,
        nextConnector,
      );
      states = next.states;
      conditionalStates = next.conditionalStates;
      previousConnector = undefined;
      continue;
    }

    if (node.kind === 'group') {
      const successStates: AnalysisState[] = [];
      const failureStates: AnalysisState[] = [];
      for (const state of executionStates) {
        const analysis = analyzeProgram(node.body, depth, options, originalCwd, [
          cloneAnalysisState(state),
        ]);
        if (analysis.result) return analysis;
        successStates.push(
          ...getSuccessfulAnalysisStates(
            state,
            analysis.states,
            isolated,
            nextConnector === '&',
            isConditionalConnector(nextConnector),
          ),
        );
        if (tracksCommandOutcome) {
          failureStates.push(
            state,
            ...(isolated
              ? analysis.states.map((nextState) => isolateFilesystemState(state, nextState))
              : analysis.states),
          );
        }
      }
      const next = finishControlFlowStep(
        successStates,
        failureStates,
        outcome.skippedSuccessStates,
        outcome.skippedFailureStates,
        outcome.connector,
        nextConnector,
      );
      states = next.states;
      conditionalStates = next.conditionalStates;
      previousConnector = undefined;
      continue;
    }
    if (node.kind !== 'command') continue;

    const negated = isNegation(program.nodes[nodeIndex - 1]);
    const segmentIndex = options.trace?.flattenNested
      ? options.trace.currentSegmentIndex
      : options.trace?.allocateSegment();
    const pipelineSource = program.nodes[nodeIndex - 2];
    const literalShellInput =
      isPipelineConnector(previousConnector) && pipelineSource?.kind === 'command'
        ? (extractLiteralPrintfOutput(pipelineSource) ??
          extractLiteralPowerShellPipelineOutput(pipelineSource))
        : undefined;
    const successStates: AnalysisState[] = [];
    const failureStates: AnalysisState[] = [];
    for (const state of executionStates) {
      const nestedAnalysis = analyzeCommandNestedPrograms(node, depth, options, originalCwd, [
        cloneAnalysisState(state),
      ]);
      if (nestedAnalysis.result) return { result: nestedAnalysis.result, states };

      const commandStates =
        program.dialect === 'powershell'
          ? nestedAnalysis.states
          : nestedAnalysis.states.map((nestedState) => isolateFilesystemState(state, nestedState));
      for (const commandState of commandStates) {
        const analyzedState = cloneAnalysisState(commandState);
        const result = analyzeCommandView(
          node,
          depth,
          options.trace
            ? { ...options, trace: withTraceSegment(options.trace, segmentIndex) }
            : options,
          originalCwd,
          analyzedState,
          isPipelineConnector(previousConnector),
          literalShellInput,
        );
        if (result) return { result, states };
        const functionBody = getCalledFunctionBody(node, analyzedState.functionDefinitions);

        if (functionBody) {
          options.budget.charge('derivedTokens', countCommandProgramWords(functionBody));
        }
        const functionAnalysis = functionBody
          ? depth + 1 >= LIMITS.recursionDepth.cap
            ? recursionLimitAnalysis(node.displayText, options, [analyzedState])
            : analyzeProgram(functionBody, depth + 1, options, originalCwd, [analyzedState])
          : {
              result: null,
              states: forkForLoopStates(node, analyzedState).flatMap((loopState) =>
                forkUncertainCwdStates(node, commandState, loopState, negated),
              ),
            };
        if (functionAnalysis.result) return functionAnalysis;
        successStates.push(
          ...getSuccessfulAnalysisStates(
            state,
            functionAnalysis.states,
            isolated,
            nextConnector === '&',
            isConditionalConnector(nextConnector),
          ),
        );
        const enteredExistingDirectory =
          typeof analyzedState.effectiveCwd === 'string' &&
          analyzedState.effectiveCwd !== commandState.effectiveCwd &&
          node.redirections.every(
            (redirection) =>
              ['<', '>', '>>', '>|'].includes(redirection.operator) &&
              redirection.target?.text === '/dev/null',
          );
        if (tracksCommandOutcome && (negated || !enteredExistingDirectory)) {
          failureStates.push(state);
          failureStates.push(
            ...functionAnalysis.states.map((functionState) =>
              isolated ? isolateFilesystemState(state, functionState) : functionState,
            ),
          );
        }
      }
    }
    const next = finishControlFlowStep(
      successStates,
      failureStates,
      outcome.skippedSuccessStates,
      outcome.skippedFailureStates,
      outcome.connector,
      nextConnector,
    );
    states = next.states;
    conditionalStates = next.conditionalStates;
    previousConnector = undefined;
  }
  return { result: null, states };
}

function isAnalysisNodeIsolated(
  program: CommandProgram,
  nodeIndex: number,
  node: CommandProgram['nodes'][number],
  previousConnector: string | undefined,
  nextConnector: string | undefined,
): boolean {
  if (node.kind === 'group' && node.style === 'subshell') return true;
  if (
    program.dialect === 'posix' &&
    (isPipelineConnector(previousConnector) || isPipelineConnector(nextConnector))
  ) {
    return true;
  }
  if (nextConnector === '&') return true;
  return (
    program.dialect === 'powershell' &&
    node.kind === 'group' &&
    node.style === 'brace' &&
    powerShellBraceStateIsIsolated(program, nodeIndex)
  );
}

function getSuccessfulAnalysisStates(
  initialState: AnalysisState,
  analyzedStates: readonly AnalysisState[],
  isolated: boolean,
  background: boolean,
  retainInitialFilesystemState: boolean,
): AnalysisState[] {
  const completedStates = isolated
    ? analyzedStates.map((state) => isolateFilesystemState(initialState, state))
    : [...analyzedStates];
  const filesystemStates = retainInitialFilesystemState
    ? completedStates.flatMap((state) =>
        optionalMapsEqual(initialState.literalHeredocFiles, state.literalHeredocFiles)
          ? [state]
          : [
              {
                ...state,
                literalHeredocFiles: new Map(initialState.literalHeredocFiles),
              },
              state,
            ],
      )
    : completedStates;
  return background ? [initialState, ...filesystemStates] : filesystemStates;
}

function isolateFilesystemState(
  initialState: AnalysisState,
  analyzedState: AnalysisState,
): AnalysisState {
  return {
    ...initialState,
    literalHeredocFiles: new Map(analyzedState.literalHeredocFiles),
    createdDirectories: new Set(analyzedState.createdDirectories),
  };
}

function powerShellBraceStateIsIsolated(program: CommandProgram, nodeIndex: number): boolean {
  const header = program.nodes
    .slice(0, nodeIndex)
    .reverse()
    .find((node) => node.kind === 'command' || node.kind === 'connector');
  if (!header || header.kind !== 'command') return true;

  const head = header.words[0]?.text.toLowerCase();
  if (head === '&' || head === '.') return false;
  if (head === 'write-output' || head === 'function' || head === 'start-job') return true;
  if (getPowerShellScriptBlockAssignmentName(header)) return true;
  return header.source.replaceAll(/\s/g, '').toLowerCase() === 'if($false)';
}

function isPipelineConnector(connector: string | undefined): boolean {
  return connector === '|' || connector === '|&';
}

function extractLiteralPowerShellPipelineOutput(
  command: CommandView | undefined,
): string | undefined {
  if (command?.dialect !== 'powershell') return undefined;
  if (
    command.words.length === 1 &&
    command.words[0]?.quoted &&
    command.words[0].provenance === 'literal'
  ) {
    return command.words[0].text;
  }
  if (
    command.words[0]?.text.toLowerCase() === 'write-output' &&
    command.words.length === 2 &&
    command.words[1]?.provenance === 'literal'
  ) {
    return command.words[1].text;
  }
  return undefined;
}

function isConditionalConnector(connector: string | undefined): boolean {
  return connector === '&&' || connector === '||';
}

function finishControlFlowStep(
  successStates: readonly AnalysisState[],
  failureStates: readonly AnalysisState[],
  skippedSuccessStates: readonly AnalysisState[],
  skippedFailureStates: readonly AnalysisState[],
  previousConnector: string | undefined,
  nextConnector: string | undefined,
) {
  const outcomes = {
    success: deduplicateAnalysisStates([...skippedSuccessStates, ...successStates]),
    failure: deduplicateAnalysisStates([...skippedFailureStates, ...failureStates]),
  };
  const conditionalStates = isConditionalConnector(nextConnector) ? outcomes : undefined;
  return {
    states:
      isConditionalConnector(previousConnector) || conditionalStates
        ? deduplicateAnalysisStates([...outcomes.success, ...outcomes.failure])
        : outcomes.success,
    conditionalStates,
  };
}

function withTraceSegment(
  trace: CommandTraceContext,
  currentSegmentIndex: number | undefined,
  flattenNested = trace.flattenNested,
): CommandTraceContext {
  return {
    currentSegmentIndex,
    flattenNested,
    allocateSegment: trace.allocateSegment,
    getNextSegmentIndex: trace.getNextSegmentIndex,
    branch: trace.branch,
    recordGlobal: trace.recordGlobal,
    recordSegment: (step, segmentIndex = currentSegmentIndex) =>
      trace.recordSegment(step, segmentIndex),
  };
}

type NestedProgramAnalysisTarget = {
  program: CommandProgram;
  depth: number;
};

function analyzeCommandNestedPrograms(
  commandView: CommandView,
  depth: number,
  options: InternalOptions,
  originalCwd: string | undefined,
  initialStates: readonly AnalysisState[],
): ProgramAnalysis {
  const programs: NestedProgramAnalysisTarget[] = commandView.nested.map((program) => ({
    program,
    depth,
  }));
  if (commandView.dialect === 'powershell') {
    const evaluatedSource = getLiteralPowerShellEvaluationSource(commandView);
    if (evaluatedSource) {
      if (depth + 1 >= LIMITS.recursionDepth.cap) {
        return recursionLimitAnalysis(evaluatedSource, options, initialStates);
      }
      const evaluatedProgram = parseCommand(evaluatedSource, 'powershell');
      if (evaluatedProgram.status === 'limited') {
        return recursionLimitAnalysis(evaluatedSource, options, initialStates);
      }
      if (evaluatedProgram.status !== 'complete') {
        return analyzeNestedPrograms(programs, options, originalCwd, initialStates);
      }
      options.budget.charge('derivedTokens', countCommandProgramWords(evaluatedProgram));
      programs.push({ program: evaluatedProgram, depth: depth + 1 });
    }
  }

  return analyzeNestedPrograms(programs, options, originalCwd, initialStates);
}

function getPowerShellScriptBlockAssignmentName(commandView: CommandView): string | undefined {
  const variable = commandView.words[0];
  return variable?.provenance === 'variable' && commandView.words.at(-1)?.text === '='
    ? variable.text.toLowerCase()
    : undefined;
}

function analyzeNestedPrograms(
  programs: readonly NestedProgramAnalysisTarget[],
  options: InternalOptions,
  originalCwd: string | undefined,
  initialStates: readonly AnalysisState[],
): ProgramAnalysis {
  let states = [...initialStates];
  for (const target of programs) {
    const nextStates: AnalysisState[] = [];
    for (const state of states) {
      const analysis = analyzeProgram(target.program, target.depth, options, originalCwd, [
        cloneAnalysisState(state),
      ]);
      if (analysis.result) return analysis;
      nextStates.push(...analysis.states);
    }
    states = deduplicateAnalysisStates(nextStates);
  }
  return { result: null, states };
}

function getLiteralPowerShellEvaluationSource(commandView: CommandView): string | undefined {
  const invoked =
    commandView.words[0]?.provenance === 'literal' &&
    !commandView.words[0].quoted &&
    commandView.words[0].raw === commandView.words[0].text &&
    (commandView.words[0].text === '&' || commandView.words[0].text === '.');
  const commandIndex = invoked ? 1 : 0;
  const command = commandView.words[commandIndex];
  if (
    command?.provenance !== 'literal' ||
    (!invoked && (command.quoted || command.raw !== command.text)) ||
    !['iex', 'invoke-expression'].includes(command.text.toLowerCase())
  ) {
    return undefined;
  }

  const args = commandView.words.slice(commandIndex + 1);
  const sourceIndex =
    args[0] &&
    !args[0].quoted &&
    args[0].raw === args[0].text &&
    ['-c', '-command'].includes(args[0].text.toLowerCase())
      ? 1
      : 0;
  const source = args[sourceIndex];
  return args.length === sourceIndex + 1 && source?.quoted && source.provenance === 'literal'
    ? source.text
    : undefined;
}

function countCommandProgramWords(program: CommandProgram): number {
  return program.nodes.reduce(
    (count, node) =>
      count +
      (node.kind === 'command'
        ? node.words.length +
          node.nested.reduce((sum, nested) => sum + countCommandProgramWords(nested), 0)
        : node.kind === 'group' || node.kind === 'function'
          ? countCommandProgramWords(node.body)
          : 0),
    0,
  );
}

function recursionLimitAnalysis(
  segment: string,
  options: InternalOptions,
  states: readonly AnalysisState[],
): ProgramAnalysis {
  options.trace?.recordSegment({ type: 'error', message: REASON_RECURSION_LIMIT });
  return {
    result: {
      reason: REASON_RECURSION_LIMIT,
      segment,
      ruleId: 'analysis.recursion-limit',
      intent: 'stop_and_explain',
    },
    states: [...states],
  };
}

function analyzeCommandView(
  commandView: CommandView,
  depth: number,
  inheritedOptions: InternalOptions,
  originalCwd: string | undefined,
  state: AnalysisState,
  hasPipelineInput: boolean,
  literalShellInput: string | undefined,
): AnalyzeResult | null {
  const options = {
    ...inheritedOptions,
    environment: {
      ...inheritedOptions.environment,
      env: state.shellGitContextState.env,
      paths: withCreatedDirectories(
        inheritedOptions.environment.paths,
        state.createdDirectories,
        inheritedOptions.budget,
      ),
    },
  };
  const heredocReason = getHeredocReason(commandView, !options.strict);
  if (heredocReason && options.strict) {
    options.trace?.recordSegment({ type: 'error', message: heredocReason });
    return {
      reason: heredocReason,
      segment: commandView.source,
      ruleId: 'analysis.unsupported-heredoc',
      intent: 'stop_and_explain',
    };
  }
  invalidateLiteralHeredocFiles(
    commandView,
    state,
    'before-consumer',
    options.environment.paths,
    options.budget,
  );
  const words = analyzedViewWords(commandView.dialect, commandView.words);
  const segment = words.map(analysisWordText);
  const segmentStr = commandView.displayText;
  const envSegment = segmentTokensWithExpandedAssignments(words, state.shellGitContextState, {
    home: options.environment.home,
    cwd: state.effectiveCwd,
    darwinUserTempDir: options.environment.darwinUserTempDir,
  });
  const segmentEnvAssignments = getSegmentGitContextEnvAssignments(
    envSegment,
    state.shellGitContextState,
  );

  if (commandView.dialect === 'powershell') {
    const match = filterDestructiveCommandMatch(
      analyzePowerShellCommandViewMatch(
        commandView,
        hasPipelineInput,
        getPowerShellRemoveItemOptions(options, state.effectiveCwd),
      ),
      options.policy,
    );
    options.trace?.recordSegment({
      type: 'rule-check',
      rule: 'analyzer/powershell/remove-item.ts:analyzePowerShellCommandViewMatch',
      matched: !!match,
      reason: match?.reason,
    });
    if (match) return resultFromCommandMatch(segmentStr, match);
  }

  const redirectMatch = filterDestructiveCommandMatch(
    analyzeDeviceRedirectionMatch(commandView.redirections),
    options.policy,
  );
  if (redirectMatch) {
    options.trace?.recordSegment({
      type: 'rule-check',
      rule: 'analyzer/device.ts:analyzeDeviceRedirectionMatch',
      matched: true,
      reason: redirectMatch.reason,
    });
    return resultFromCommandMatch(segmentStr, redirectMatch);
  }

  if (
    segment.length === 1 &&
    segment[0]?.includes(' ') &&
    !isDynamicExecutable(commandView.dialect, commandView.words)
  ) {
    const textMatch = filterDestructiveCommandMatch(
      dangerousInTextMatch(segment[0]),
      options.policy,
    );
    const deferredToUseTime =
      textMatch !== null &&
      !options.strict &&
      isDataOnlyQuotedAssignment(commandView, options.rootProgram);
    if (textMatch && !deferredToUseTime) {
      options.trace?.recordSegment({
        type: 'dangerous-text',
        token: segment[0],
        matched: true,
        reason: textMatch.reason,
      });
      return {
        reason: textMatch.reason,
        segment: segmentStr,
        ruleId: textMatch.id,
        intent: textMatch.intent,
      };
    }
    options.trace?.recordSegment({ type: 'dangerous-text', token: segment[0], matched: false });
    const deferredResult = finalizeAnalyzedCommandView(
      commandView,
      heredocReason,
      state,
      segmentEnvAssignments,
      literalShellInput,
      options,
    );
    if (deferredResult) return deferredResult;
    applyShellGitContextEnvSegment(envSegment, state.shellGitContextState);
    return null;
  }

  const result = analyzeSegment(commandView.words, depth, {
    ...options,
    commandView,
    cwd: originalCwd,
    effectiveCwd: state.effectiveCwd,
    envAssignments: segmentEnvAssignments,
    shellAssignments: state.shellGitContextState.shellAssignments,
    literalHeredocFiles: state.literalHeredocFiles,
    functionDefinitions: state.functionDefinitions,
    hasPipelineInput,
    literalShellInput,
    analyzeNested: (
      nestedCommand: string,
      overrides?: AnalyzeNestedOverrides,
    ): Omit<AnalyzeResult, 'segment'> | null => {
      const nestedEffectiveCwd =
        overrides && Object.hasOwn(overrides, 'effectiveCwd')
          ? overrides.effectiveCwd
          : state.effectiveCwd;
      const nestedResult = analyzeCommandInternal(nestedCommand, depth + 1, {
        ...options,
        effectiveCwd: nestedEffectiveCwd,
        envAssignments: overrides?.envAssignments ?? segmentEnvAssignments,
        literalHeredocFiles: state.literalHeredocFiles,

        functionDefinitions: overrides?.functionDefinitions,
        worktreeMode: overrides?.worktreeMode ?? options.worktreeMode,
        shell: overrides?.shell ?? options.shell,
        trace: options.trace
          ? withTraceSegment(options.trace, options.trace.currentSegmentIndex, true)
          : undefined,
      });
      return nestedResult
        ? {
            reason: nestedResult.reason,
            ruleId: nestedResult.ruleId,
            intent: nestedResult.intent,
          }
        : null;
    },
  });
  if (result) return { ...result, segment: segmentStr };

  const postCommandResult = finalizeAnalyzedCommandView(
    commandView,
    heredocReason,
    state,
    segmentEnvAssignments,
    literalShellInput,
    options,
  );
  if (postCommandResult) return postCommandResult;
  applyShellGitContextEnvSegment(envSegment, state.shellGitContextState);
  return null;
}

function finalizeAnalyzedCommandView(
  commandView: CommandView,
  heredocReason: string | undefined,
  state: AnalysisState,
  segmentEnvAssignments: ReadonlyMap<string, string> | undefined,
  literalShellInput: string | undefined,
  options: InternalOptions,
): AnalyzeResult | null {
  const heredocResult = analyzeUnsupportedHeredoc(
    commandView,
    heredocReason,
    state,
    segmentEnvAssignments ?? new Map(),
    options,
  );
  if (heredocResult) return heredocResult;

  invalidateLiteralHeredocFiles(
    commandView,
    state,
    'after-consumer',
    options.environment.paths,
    options.budget,
  );
  if (!onlyAssignsVariables(commandView)) state.literalHeredocFiles.clear();
  trackLiteralHeredocFiles(
    commandView,
    heredocReason,
    state,
    options.environment.paths,
    options.budget,
    options.environment.home,
  );
  trackCreatedDirectories(
    commandView,
    state,
    options.environment.paths,
    options.budget,
    options.environment.home,
  );
  updateCwdAfterCommandView(
    commandView,
    state,
    literalShellInput,
    options.environment,
    options.trace,
  );
  return null;
}

const FILE_NONTRUNCATING_WRITE_REDIRECTIONS = new Set(['>>', '<>']);
const SHELL_ASSIGNMENT_WORD_RE = /^[A-Za-z_][A-Za-z0-9_]*\+?=/;

function onlyAssignsVariables(commandView: CommandView): boolean {
  return (
    commandView.nested.length === 0 &&
    commandView.redirections.length === 0 &&
    commandView.words.length > 0 &&
    commandView.words.every((word) => SHELL_ASSIGNMENT_WORD_RE.test(word.raw))
  );
}

function invalidateLiteralHeredocFiles(
  commandView: CommandView,
  state: AnalysisState,
  phase: 'before-consumer' | 'after-consumer',
  paths: PathResolver,
  budget: Budget,
): void {
  for (const redirection of commandView.redirections) {
    const writesFile =
      phase === 'before-consumer'
        ? isTruncatingFileRedirection(redirection)
        : FILE_NONTRUNCATING_WRITE_REDIRECTIONS.has(redirection.operator);
    if (!writesFile) continue;
    invalidateLiteralHeredocFile(redirection.target, state, paths, budget);
  }

  if (phase !== 'before-consumer' || !isBareCommandWord(commandView.words[0], 'tee')) return;
  const teeArguments = getTeeArguments(commandView.words.slice(1));
  if (!teeArguments) return;
  for (const operand of teeArguments.operands) {
    invalidateLiteralHeredocFile(operand, state, paths, budget);
  }
}

function isTruncatingFileRedirection(redirection: CommandRedirection): boolean {
  if (redirection.operator === '>' || redirection.operator === '>|') return true;
  return (
    redirection.operator === '>&' &&
    redirection.fd === undefined &&
    redirection.target?.provenance === 'literal' &&
    !/^(?:[0-9]+|-)$/.test(redirection.target.text)
  );
}

function invalidateLiteralHeredocFile(
  target: CommandWord | undefined,
  state: AnalysisState,
  paths: PathResolver,
  budget: Budget,
): void {
  const path =
    target?.provenance === 'literal'
      ? resolveTrackedHeredocPath(target.text, state.effectiveCwd, paths, budget)
      : undefined;
  if (!path) return;
  state.literalHeredocFiles.delete(path);
}

function trackLiteralHeredocFiles(
  commandView: CommandView,
  heredocReason: string | undefined,
  state: AnalysisState,
  paths: PathResolver,
  budget: Budget,
  home: string,
): void {
  if (heredocReason) return;
  const heredoc = commandView.redirections.find(
    (redirection) => redirection.operator === '<<' || redirection.operator === '<<-',
  )?.heredoc;
  if (!heredoc) return;

  for (const target of getLiteralHeredocOutputTargets(
    commandView,
    withImplicitShellVariables(state.shellGitContextState.shellAssignments, {
      home,
      cwd: state.effectiveCwd,
    }),
    home,
  )) {
    const path = resolveTrackedHeredocPath(target, state.effectiveCwd, paths, budget);
    if (!path || !isPersistentHeredocFilePath(path)) continue;
    if (
      !state.literalHeredocFiles.has(path) &&
      state.literalHeredocFiles.size >= LIMITS.trackedHeredocFiles.cap
    ) {
      throw new AnalysisLimit('trackedHeredocFiles');
    }
    state.literalHeredocFiles.set(path, heredoc.body);
  }
}

function getLiteralHeredocOutputTargets(
  commandView: CommandView,
  assignments: ReadonlyMap<string, string>,
  home: string,
): string[] {
  const stdoutTarget = fileWordPath(
    getFinalStdoutRedirection(commandView.redirections)?.target,
    assignments,
    home,
  );
  const stdoutTargets = stdoutTarget === undefined ? [] : [stdoutTarget];
  if (isBareCommandWord(commandView.words[0], 'cat')) {
    return catWritesHeredocVerbatim(commandView.words) ? stdoutTargets : [];
  }
  if (!isBareCommandWord(commandView.words[0], 'tee')) return [];

  const teeArguments = getTeeArguments(commandView.words.slice(1), assignments);
  if (!teeArguments || teeArguments.append || teeArguments.hasUnsupportedOptions) return [];
  const operandPaths = teeArguments.operands.map((operand) =>
    fileWordPath(operand, assignments, home),
  );
  if (!operandPaths.every((path): path is string => path !== undefined)) return [];
  return [...operandPaths, ...stdoutTargets];
}

function fileWordPath(
  word: CommandWord | undefined,
  assignments: ReadonlyMap<string, string>,
  home: string,
): string | undefined {
  if (isTrackableLiteralFileWord(word)) return word.text;
  if (!word) return undefined;
  return expandHomeTildeWord(word, home) ?? expandKnownVariableWord(word, assignments) ?? undefined;
}

function withCreatedDirectories(
  paths: PathResolver,
  created: ReadonlySet<string>,
  budget: Budget,
): PathResolver {
  if (created.size === 0) return paths;
  const isCreated = (path: string) => {
    const canonical = resolveExistingPath(path, paths, budget);
    return [...created].some((leaf) => leaf === canonical || leaf.startsWith(`${canonical}${sep}`));
  };
  return {
    realpath: (path) =>
      paths.realpath(path) ?? (isCreated(path) ? resolveExistingPath(path, paths, budget) : null),
    entryKind: (path) => {
      const kind = paths.entryKind(path);
      return kind === 'missing' && isCreated(path) ? 'present' : kind;
    },
    isDirectory: (path) => paths.isDirectory(path) || isCreated(path),
  };
}

function trackCreatedDirectories(
  commandView: CommandView,
  state: AnalysisState,
  paths: PathResolver,
  budget: Budget,
  home: string,
): void {
  if (
    state.shellGitContextState.bodyDepth > 0 ||
    !isBareCommandWord(commandView.words[0], 'mkdir')
  ) {
    return;
  }
  const args = commandView.words
    .slice(1)
    .map((word) => fileWordPath(word, state.shellGitContextState.shellAssignments, home));
  if (!args.every((arg): arg is string => arg !== undefined)) return;
  const optionEnd = args.findIndex((arg) => arg === '--' || arg === '-' || !arg.startsWith('-'));
  const options = args.slice(0, optionEnd);
  if (
    optionEnd === -1 ||
    !options.every((option) => /^(?:-[pv]+|--parents|--verbose)$/.test(option))
  ) {
    return;
  }
  const parents = options.some((option) => option === '--parents' || /^-v*p/.test(option));
  const cwd = state.effectiveCwd;
  for (const operand of args.slice(args[optionEnd] === '--' ? optionEnd + 1 : optionEnd)) {
    if (operand.split(/[\\/]/).includes('..') || (!isAbsolute(operand) && !cwd)) continue;
    const leaf = resolveExistingPath(resolve(cwd ?? '', operand), paths, budget);
    const creates = parents
      ? mkdirParentsCreates(leaf, paths)
      : paths.isDirectory(dirname(leaf)) && isMissing(leaf, paths);
    if (creates) state.createdDirectories.add(leaf);
  }
}

function mkdirParentsCreates(path: string, paths: PathResolver): boolean {
  const root = parsePath(path).root;
  const components = path
    .slice(root.length)
    .split(/[\\/]+/)
    .filter(Boolean);
  const prefixAt = (index: number) => join(root, ...components.slice(0, index + 1));
  const firstNonDirectory = components.findIndex((_, index) => !paths.isDirectory(prefixAt(index)));
  return firstNonDirectory === -1 || isMissing(prefixAt(firstNonDirectory), paths);
}

function isMissing(path: string, paths: PathResolver): boolean {
  try {
    return paths.entryKind(path) === 'missing';
  } catch {
    return false;
  }
}

function catWritesHeredocVerbatim(words: readonly CommandWord[]): boolean {
  let optionTerminated = false;
  for (const word of words.slice(1)) {
    if (optionTerminated || word.provenance !== 'literal') return false;
    if (word.text === '--') {
      optionTerminated = true;
      continue;
    }
    if (!/^-u+$/.test(word.text)) return false;
  }
  return true;
}

function getFinalStdoutRedirection(
  redirections: readonly CommandRedirection[],
): CommandRedirection | undefined {
  const redirection = redirections.findLast(
    (candidate) =>
      (candidate.fd ?? (['>', '>|', '>>', '>&'].includes(candidate.operator) ? 1 : 0)) === 1,
  );
  return redirection?.operator === '>' || redirection?.operator === '>|' ? redirection : undefined;
}

function getTeeArguments(
  words: readonly CommandWord[],
  assignments: ReadonlyMap<string, string> = new Map(),
):
  | {
      operands: CommandWord[];
      append: boolean;
      hasUnsupportedOptions: boolean;
    }
  | undefined {
  const operands: CommandWord[] = [];
  let parsesOptions = true;
  let append = false;
  let hasUnsupportedOptions = false;
  for (const word of words) {
    if (word.provenance !== 'literal' && expandKnownVariableWord(word, assignments) === null) {
      return undefined;
    }
    if (parsesOptions && isBareCommandWord(word, '--')) {
      parsesOptions = false;
      continue;
    }
    if (parsesOptions && !word.quoted && word.raw === word.text && /^-[^-]/.test(word.text)) {
      append ||= word.text.slice(1).includes('a');
      hasUnsupportedOptions ||= Array.from(word.text.slice(1)).some(
        (option) => option !== 'a' && option !== 'i',
      );
      continue;
    }
    if (parsesOptions && !word.quoted && word.raw === word.text && word.text.startsWith('--')) {
      append ||= word.text === '--append';
      hasUnsupportedOptions ||= word.text !== '--append' && word.text !== '--ignore-interrupts';
      continue;
    }
    operands.push(word);
  }
  return { operands, append, hasUnsupportedOptions };
}

function isTrackableLiteralFileWord(word: CommandWord | undefined): word is CommandWord {
  if (!word || word.provenance !== 'literal' || word.text.length === 0) return false;
  if (word.quoted || word.raw !== word.text) return true;
  return !word.raw.startsWith('~') && !/[{}]/.test(word.raw);
}

function isBareCommandWord(word: CommandWord | undefined, value: string): boolean {
  return (
    word?.text === value && word.raw === value && word.provenance === 'literal' && !word.quoted
  );
}

function isLiteralHeredoc(heredoc: CommandHeredoc): boolean {
  return heredoc.quotedDelimiter || !/[$`\\]/.test(heredoc.body);
}

function getHeredocReason(commandView: CommandView, standard: boolean): string | undefined {
  const heredocs = commandView.redirections.filter(
    (redirection) => redirection.operator === '<<' || redirection.operator === '<<-',
  );
  if (heredocs.length === 0) return undefined;
  if (heredocs.length !== 1) return REASON_UNSUPPORTED_HEREDOC;

  const heredoc = heredocs[0];
  if (!heredoc?.heredoc) return REASON_UNSUPPORTED_HEREDOC;
  const bodyHasCommandSubstitution = /\$\(|`/.test(heredoc.heredoc.body);
  if (!isLiteralHeredoc(heredoc.heredoc) && (!standard || bodyHasCommandSubstitution)) {
    return REASON_UNQUOTED_HEREDOC;
  }
  if (heredoc.fd !== undefined && heredoc.fd !== 0) return REASON_UNSUPPORTED_HEREDOC;
  if (
    commandView.redirections.some(
      (redirection) =>
        redirection !== heredoc &&
        ['<', '<<', '<<-', '<<<', '<&', '<>'].includes(redirection.operator),
    )
  ) {
    return REASON_UNSUPPORTED_HEREDOC;
  }

  const outputProcessSubstitution = commandView.redirections.some(
    (redirection) => redirection !== heredoc && hasOutputProcessSubstitution(redirection.target),
  );
  if (isBareCommandWord(commandView.words[0], 'cat')) {
    return outputProcessSubstitution ? REASON_UNSUPPORTED_HEREDOC : undefined;
  }
  if (isBareCommandWord(commandView.words[0], 'tee')) {
    return outputProcessSubstitution ||
      commandView.words.slice(1).some(hasOutputProcessSubstitution)
      ? REASON_UNSUPPORTED_HEREDOC
      : undefined;
  }

  const head = commandView.words[0];
  const sub = commandView.words[1];
  if (
    isBareCommandWord(head, 'git') &&
    (isBareCommandWord(sub, 'apply') || isBareCommandWord(sub, 'commit'))
  ) {
    return undefined;
  }
  if (
    isBareCommandWord(head, 'gh') &&
    (isBareCommandWord(sub, 'pr') || isBareCommandWord(sub, 'issue')) &&
    isBareCommandWord(commandView.words[2], 'create')
  ) {
    return undefined;
  }
  return REASON_UNSUPPORTED_HEREDOC;
}

function hasOutputProcessSubstitution(word: CommandWord | undefined): boolean {
  return (
    word?.parts.some(
      (part) => part.provenance === 'command-substitution' && part.raw.startsWith('>('),
    ) ?? false
  );
}

function analyzeUnsupportedHeredoc(
  commandView: CommandView,
  reason: string | undefined,
  state: AnalysisState,
  envAssignments: ReadonlyMap<string, string>,
  options: InternalOptions,
): AnalyzeResult | null {
  if (!reason) return null;
  const heredocs = commandView.redirections.filter(
    (redirection) => redirection.operator === '<<' || redirection.operator === '<<-',
  );
  const bodies = heredocs.flatMap((redirection) =>
    redirection.heredoc ? [redirection.heredoc.body] : [],
  );
  if (isInertShellHeredoc(commandView, heredocs, state, envAssignments, options)) return null;
  const interpreterMatch = analyzeInterpreterHeredocMatch(commandView, heredocs, options);
  if (interpreterMatch !== undefined) {
    return interpreterMatch
      ? {
          reason: interpreterMatch.reason,
          segment: commandView.displayText,
          ruleId: interpreterMatch.id,
          intent: interpreterMatch.intent,
        }
      : null;
  }
  const result = analyzeUnparseableCommand(
    bodies.length === heredocs.length ? bodies.join('\n') : commandView.source,
    options,
  );
  return result ? { ...result, segment: commandView.displayText } : null;
}

function analyzeInterpreterHeredocMatch(
  commandView: CommandView,
  heredocs: readonly CommandRedirection[],
  options: InternalOptions,
): DestructiveCommandRuleMatch | null | undefined {
  const heredoc = heredocs.length === 1 ? heredocs[0] : undefined;
  if (
    !heredoc?.heredoc ||
    !isLiteralHeredoc(heredoc.heredoc) ||
    (heredoc.fd !== undefined && heredoc.fd !== 0)
  ) {
    return undefined;
  }
  const words =
    isBareCommandWord(commandView.words[0], 'uv') && isBareCommandWord(commandView.words[1], 'run')
      ? commandView.words.slice(2)
      : commandView.words;
  const head = words[0];
  if (head?.provenance !== 'literal' || !isInterpreterCommand(head.text)) return undefined;
  const stdinMarker = words.findIndex((word) => isBareCommandWord(word, '-'));
  const stdinIsProgram = words
    .slice(1, stdinMarker === -1 ? undefined : stdinMarker)
    .every((word) => word.provenance === 'literal' && word.text.startsWith('-'));
  if (!stdinIsProgram) return undefined;

  const body = heredoc.heredoc.body;
  const paranoidEnabled = destructiveCommandRuleIsEnabled(
    options.policy,
    'interpreter.one-liner-paranoid',
    !!options.paranoidInterpreters,
  );
  options.trace?.recordSegment({
    type: 'interpreter',
    interpreter: head.text,
    codeArg: body,
    paranoidBlocked: paranoidEnabled,
  });
  if (paranoidEnabled) {
    const filteredParanoidMatch = filterDestructiveCommandMatch(
      destructiveCommandMatch('interpreter.one-liner-paranoid', REASON_INTERPRETER_BLOCKED),
      options.policy,
    );
    if (filteredParanoidMatch) return filteredParanoidMatch;
  }
  if (!containsDangerousCode(body, undefined, !options.strict)) return null;
  const match = filterDestructiveCommandMatch(
    destructiveCommandMatch('interpreter.dangerous-command', REASON_INTERPRETER_DANGEROUS),
    options.policy,
  );
  if (!match) return null;
  options.trace?.recordSegment({
    type: 'dangerous-text',
    token: body,
    matched: true,
    reason: match.reason,
  });
  return match;
}

function isInertShellHeredoc(
  commandView: CommandView,
  heredocs: readonly CommandRedirection[],
  state: AnalysisState,
  envAssignments: ReadonlyMap<string, string>,
  options: InternalOptions,
): boolean {
  const heredoc = heredocs.length === 1 ? heredocs[0] : undefined;
  if (
    !heredoc?.heredoc ||
    !isLiteralHeredoc(heredoc.heredoc) ||
    (heredoc.fd !== undefined && heredoc.fd !== 0)
  ) {
    return false;
  }

  const stripped = stripWrapperWords(
    commandView.words,
    options.environment,
    state.effectiveCwd,
    envAssignments,
  );
  const tokens = stripped.words.map(analysisWordText);
  const head = normalizeCommandToken(tokens[0] ?? '');
  if (
    (stripped.envSplitValues?.length ?? 0) > 0 ||
    (!SHELL_WRAPPERS.has(head) && !SHELL_WRAPPERS.has(getBasename(head)))
  ) {
    return false;
  }
  return isShellSyntaxCheck(tokens);
}

function updateCwdAfterCommandView(
  commandView: CommandView,
  state: AnalysisState,
  literalPipelineInput: string | undefined,
  environment: EnvironmentContext,
  trace?: CommandTraceContext,
): void {
  const nextCwd = resolveCwdAfterCommandView(
    commandView,
    state.effectiveCwd,
    environment,
    state.shellGitContextState.shellAssignments,
    literalPipelineInput,
  );
  if (nextCwd === null) {
    trace?.recordSegment({
      type: 'cwd-change',
      segment: commandView.words.map(analysisWordText).join(' '),
      effectiveCwdNowUnknown: true,
    });
  }
  if (nextCwd !== undefined) state.effectiveCwd = nextCwd;
}

const COMPOUND_BODY_CLOSERS = new Set(['fi', 'done', 'esac']);

function isNegation(node: CommandProgram['nodes'][number] | undefined): boolean {
  return node?.kind === 'command' && node.words.length === 1 && node.words[0]?.raw === '!';
}

function forkUncertainCwdStates(
  view: CommandView,
  before: AnalysisState,
  state: AnalysisState,
  negated: boolean,
): AnalysisState[] {
  const head = view.words[0]?.text ?? '';
  const outerDepth = before.shellGitContextState.bodyDepth;
  const innerDepth = state.shellGitContextState.bodyDepth;
  const bodies = state.compoundBodies;
  if (innerDepth > outerDepth) {
    state.compoundBodies = [
      ...bodies.slice(0, outerDepth),
      {
        entryCwd: before.effectiveCwd,
        branchCwds: bodies[outerDepth]?.branchCwds ?? [],
        hasElse: false,
      },
    ];
    return [state];
  }
  const body = outerDepth > 0 ? bodies[outerDepth - 1] : undefined;
  if (body && (head === 'else' || head === 'elif')) {
    state.compoundBodies = [
      ...bodies.slice(0, outerDepth - 1),
      {
        entryCwd: body.entryCwd,
        branchCwds: [...body.branchCwds, state.effectiveCwd],
        hasElse: head === 'else',
      },
    ];
    state.effectiveCwd = body.entryCwd;
    return [state];
  }
  const closesBody = body !== undefined && COMPOUND_BODY_CLOSERS.has(head);
  if (closesBody) state.compoundBodies = bodies.slice(0, innerDepth);
  const possibleCwds = new Set([
    state.effectiveCwd,
    ...(closesBody ? body.branchCwds : []),
    ...(closesBody && !body.hasElse ? [body.entryCwd] : []),
    ...(negated ? [before.effectiveCwd] : []),
  ]);
  return [...possibleCwds].map((cwd) => {
    if (cwd === state.effectiveCwd) return state;
    const alternative = cloneAnalysisState(state);
    alternative.effectiveCwd = cwd;
    return alternative;
  });
}

function compoundBodiesEqual(
  left: readonly CompoundBody[],
  right: readonly CompoundBody[],
): boolean {
  return (
    left.length === right.length &&
    left.every((body, index) => {
      const other = right[index];
      return (
        other !== undefined &&
        body.entryCwd === other.entryCwd &&
        body.hasElse === other.hasElse &&
        body.branchCwds.length === other.branchCwds.length &&
        body.branchCwds.every((cwd, branch) => cwd === other.branchCwds[branch])
      );
    })
  );
}

const FOR_LOOP_NAME_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
const FOR_LOOP_WORD_CAP = 8;

function forkForLoopStates(view: CommandView, state: AnalysisState): AnalysisState[] {
  const name = view.words[1]?.text;
  if (
    view.dialect !== 'posix' ||
    view.words[0]?.text !== 'for' ||
    name === undefined ||
    !FOR_LOOP_NAME_RE.test(name)
  ) {
    return [state];
  }
  const items = view.words.slice(3);
  const bindable =
    view.words[2]?.text === 'in' &&
    items.length >= 1 &&
    items.length <= FOR_LOOP_WORD_CAP &&
    items.every((word) => word.provenance === 'literal' && !/[\s$`*?[{}~'"\\]/.test(word.text));
  if (!bindable) {
    state.shellGitContextState.shellAssignments.delete(name);
    return [state];
  }
  return items.map((word) => {
    const forked = cloneAnalysisState(state);
    forked.shellGitContextState.shellAssignments.set(name, word.text);
    return forked;
  });
}

function cloneAnalysisState(state: AnalysisState): AnalysisState {
  return {
    effectiveCwd: state.effectiveCwd,
    shellGitContextState: cloneShellGitContextEnvState(state.shellGitContextState),
    literalHeredocFiles: new Map(state.literalHeredocFiles),
    functionDefinitions: new Map(state.functionDefinitions),
    createdDirectories: new Set(state.createdDirectories),
    compoundBodies: state.compoundBodies,
  };
}

function deduplicateAnalysisStates(states: readonly AnalysisState[]): AnalysisState[] {
  const uniqueStates: AnalysisState[] = [];
  for (const state of states) {
    if (!uniqueStates.some((candidate) => analysisStatesEqual(candidate, state))) {
      uniqueStates.push(state);
    }
    if (uniqueStates.length > LIMITS.controlFlowStates.cap) {
      throw new AnalysisLimit('controlFlowStates');
    }
  }
  return uniqueStates;
}

function analysisStatesEqual(left: AnalysisState, right: AnalysisState): boolean {
  return (
    left.effectiveCwd === right.effectiveCwd &&
    compoundBodiesEqual(left.compoundBodies, right.compoundBodies) &&
    optionalMapsEqual(left.shellGitContextState.env, right.shellGitContextState.env) &&
    optionalMapsEqual(left.literalHeredocFiles, right.literalHeredocFiles) &&
    optionalMapsEqual(left.functionDefinitions, right.functionDefinitions) &&
    optionalMapsEqual(
      left.shellGitContextState.effectiveEnvAssignments,
      right.shellGitContextState.effectiveEnvAssignments,
    ) &&
    optionalMapsEqual(
      left.shellGitContextState.shellAssignments,
      right.shellGitContextState.shellAssignments,
    ) &&
    left.shellGitContextState.bodyDepth === right.shellGitContextState.bodyDepth &&
    setsEqual(
      left.shellGitContextState.bodyAssignments,
      right.shellGitContextState.bodyAssignments,
    ) &&
    setsEqual(left.createdDirectories, right.createdDirectories)
  );
}

function setsEqual(left: ReadonlySet<string>, right: ReadonlySet<string>): boolean {
  return left.size === right.size && [...left].every((value) => right.has(value));
}

function optionalMapsEqual<T>(
  left: ReadonlyMap<string, T> | undefined,
  right: ReadonlyMap<string, T> | undefined,
): boolean {
  if (left === right) return true;
  if (!left || !right || left.size !== right.size) return false;
  return [...left].every(([key, value]) => right.get(key) === value && right.has(key));
}

function getCalledFunctionBody(
  view: CommandView,
  functions: ReadonlyMap<string, CommandProgram>,
): CommandProgram | undefined {
  const name = getCalledCommandName(view);
  return name === undefined ? undefined : functions.get(name);
}

function resultFromCommandMatch(
  command: string,
  match: DestructiveCommandRuleMatch | null,
): AnalyzeResult | null {
  if (!match) return null;
  return {
    reason: match.reason,
    segment: command,
    ruleId: match.id,
    intent: match.intent,
  };
}

function getPowerShellRemoveItemOptions(
  options: InternalOptions,
  effectiveCwd: string | null | undefined = options.effectiveCwd,
) {
  const cwdUnknown = effectiveCwd === null;
  return {
    environment: options.environment,
    cwd: cwdUnknown ? undefined : (effectiveCwd ?? options.cwd),
    originalCwd: cwdUnknown ? undefined : options.cwd,
    strict: options.strict,
    paranoid: options.paranoidRm,
    allowTmpdirVar: options.allowTmpdirVar,
    protectedGitMetadata: options.protectedGitMetadata,
    policy: options.policy,
    budget: options.budget,
  };
}

function analyzeUnparseableCommand(
  command: string,
  options: InternalOptions,
): AnalyzeResult | null {
  const textMatch = filterDestructiveCommandMatch(dangerousInTextMatch(command), options.policy);
  const segmentIndex = options.trace?.currentSegmentIndex ?? options.trace?.allocateSegment();
  const step = {
    type: 'dangerous-text' as const,
    token: command,
    matched: !!textMatch,
    reason: textMatch?.reason,
  };
  options.trace?.recordSegment(step, segmentIndex);
  if (!textMatch && /^(?:cd|pushd)\s/.test(command)) {
    options.trace?.recordSegment(
      { type: 'cwd-change', segment: command, effectiveCwdNowUnknown: true },
      segmentIndex,
    );
  }
  return textMatch
    ? {
        reason: textMatch.reason,
        segment: command,
        ruleId: textMatch.id,
        intent: textMatch.intent,
      }
    : null;
}

function recordStrictUnparseable(command: string, options: InternalOptions): void {
  const step = {
    type: 'strict-unparseable' as const,
    rawCommand: command,
    reason: REASON_STRICT_UNPARSEABLE,
  };
  const segmentIndex = options.trace?.currentSegmentIndex;
  if (segmentIndex === undefined) options.trace?.recordGlobal(step);
  if (segmentIndex !== undefined) options.trace?.recordSegment(step);
}
