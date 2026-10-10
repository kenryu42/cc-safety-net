import { isAbsolute, posix, resolve, win32 } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AnalysisLimit, type Budget } from '@/core/budget';
import { normalizeMsysDrivePath, resolveExistingPath } from '@/core/paths/canonicalization';
import { parseRecursiveSecretAllowPath } from '@/core/policy/allow-paths';
import { AWK_INTERPRETERS, GIT_GLOBAL_OPTS_WITH_VALUE } from '@/core/rules/constants';
import {
  SECRET_BASENAME_RULES,
  SECRET_BROAD_SSH_KEY_BASENAME_RULE,
  SECRET_CODING_CLI_RULES,
  SECRET_ENV_VARIANT_RULE,
  SECRET_EXTENSION_PATTERN_RULES,
  SECRET_EXTENSION_RULES,
  SECRET_HOME_PATH_RULES,
  SECRET_VARIANT_DOT_SUFFIX_RULES,
  SECRET_VARIANT_SEPARATOR_RULES,
} from '@/core/rules/secret';
import { advanceQuoteScanState, normalizeCommandToken, parseShellArgv } from '@/core/shell/tokens';
import type { EnvironmentContext } from '@/gate/analysis';
import { extractAwkSystemCommands } from '@/gate/analyzer/awk';
import { closingParenthesis, firstArgumentHasName } from '@/gate/analyzer/interpreters';
import { readPowerShellScript } from '@/gate/analyzer/powershell-wrapper';
import { extractXargsChildCommandWithInfo } from '@/gate/analyzer/xargs';
import type { CommandSyntaxFacts, SemanticFactStore, SemanticFacts } from '@/gate/facts';
import {
  ADOPT_AS_OPERAND,
  type GuardSyntax,
  isCodeInterpreter,
  readGuardTokens,
  SHELL_STDIN_INTERPRETERS,
  walkGuardSyntax,
} from '@/gate/guards/guard-walk';
import { safetyNetSubcommandIndex } from '@/gate/guards/safety-net-invocation';
import {
  getCommandSyntaxFact,
  projectSensitiveShellText,
  StructuralShellSyntaxLimitError,
} from '@/gate/guards/semantic-facts';

export const REASON_SECRET_PROTECTION = 'Access to a sensitive path is not allowed.';

const NON_PATH_OPERAND_COMMANDS = new Set(['echo', 'printf']);

const PATH_ROOT_COMMANDS = new Set(['find']);
const SHELL_RESERVED_WORDS = new Set(['!', 'do', 'elif', 'else', 'if', 'then', 'until', 'while']);
const FIND_EXEC_PRIMARIES = new Set(['-exec', '-execdir']);
const FIND_EXEC_TERMINATORS = new Set([';', '+']);
const FIND_NON_METADATA_ARGS = new Set([
  '-delete',
  '-files0-from',
  '-exec',
  '-execdir',
  '-fls',
  '-fprint',
  '-fprint0',
  '-fprintf',
  '-ok',
  '-okdir',
]);
const FIND_MATCH_PATH_PRIMARIES = new Set([
  '-name',
  '-iname',
  '-path',
  '-ipath',
  '-wholename',
  '-iwholename',
  '-samefile',
]);

const CURL_UPLOAD_FLAGS = new Set([
  '-d',
  '--data',
  '--data-ascii',
  '--data-binary',
  '--data-urlencode',
  '-F',
  '--form',
]);

const INLINE_ACCESS_NAMESPACES = new Set([
  'bun',
  'child_process',
  'deno',
  'dotenv',
  'fs',
  'subprocess',
]);
const INLINE_ACCESS_IDENTIFIER_PARTS = new Set([
  'append',
  'awk',
  'base64',
  'cat',
  'chmod',
  'chown',
  'connect',
  'copy',
  'cp',
  'database',
  'dd',
  'eval',
  'exec',
  'fetch',
  'file',
  'function',
  'grep',
  'head',
  'include',
  'load',
  'move',
  'mv',
  'open',
  'fopen',
  'popen',
  'read',
  'readfile',
  'remove',
  'rename',
  'require',
  'rg',
  'rm',
  'sed',
  'shell',
  'source',
  'spawn',
  'strings',
  'system',
  'tail',
  'tar',
  'truncate',
  'unlink',
  'write',
  'xxd',
  'zip',
]);
const CODE_EVAL_FLAGS = new Set(['-c', '-e', '-r', '-E', '--eval', '--exec']);
const INTERPRETERS_BY_CLUSTERED_CODE_EVAL_FLAG = new Map([
  ['c', new Set(['bash', 'sh', 'zsh', 'dash', 'ksh', 'python'])],
  ['e', new Set(['node', 'deno', 'bun', 'ruby', 'perl', 'rscript', 'osascript'])],
  ['E', new Set(['perl'])],
  ['r', new Set(['php'])],
]);

const PATTERN_FIRST_COMMANDS = new Set(['grep', 'rg']);
const SEARCH_NAMES_ONLY_LONG = new Set([
  'files-with-matches',
  'files-without-match',
  'count',
  'quiet',
]);
const SEARCH_VALUELESS_LONG = new Set([
  ...SEARCH_NAMES_ONLY_LONG,
  'ignore-case',
  'fixed-strings',
  'hidden',
]);
const NAME_LISTING_METADATA_COMMANDS = new Set(['wc', ...PATTERN_FIRST_COMMANDS]);
const CERTIFICATE_PIPE_PROGRAMS = new Set(['cd', 'grep', 'head', 'openssl', 'tail', 'tailscale']);
const WC_COUNT_OPTION = /^(?:-[lwcm]+|--(?:lines|words|bytes|chars))$/;
const GH_TEXT_FLAGS = new Set(['--search', '-S', '--title', '-t', '--body', '-b', '--jq', '-q']);
const GIT_MESSAGE_SUBCOMMANDS = new Set(['commit', 'merge', 'notes', 'stash', 'tag']);
const GIT_MESSAGE_FLAGS = new Set(['-m', '--message']);
const GIT_GREP_FLAGS = new Set(['--grep']);
const POWERSHELL_HEADS = new Set(['powershell', 'pwsh']);
const JQ_COMMANDS = new Set(['jq', 'gojq', 'jaq']);
const PATTERN_FILE_SHORT = 'f';
const PATTERN_FILE_LONG = 'file';
const PATTERNLESS_FILES_LONG = 'files';
const PATTERN_SUPPLY_SHORT = new Set(['e', 'f']);
const PATTERN_SUPPLY_LONG = new Set(['regexp', 'file']);
const PATTERN_ARG_SHORT = new Set(['e', 'f', 'A', 'B', 'C', 'm']);
const PATTERN_ARG_LONG = new Set([
  'regexp',
  'file',
  'after-context',
  'before-context',
  'context',
  'max-count',
]);

const PIPE_INPUT_PATH_MARKER = '__CC_SAFETY_NET_PIPE_INPUT__';
const BARE_PATH_PATTERN = /[\w./~@+-]*[./~][\w./~@+-]*/g;
const PYTHON_STRING_PREFIX = /(?:^|[^\w])([rRbBuUfF]{1,2})$/;
const UNMASKABLE_SIMPLE_CODE = /^(?:`|%[qQwWiIxX]?[([{<|!/]|<<<?[~-]?['"]?[A-Za-z_])/;
const SIMPLE_INTERPOLATION = /#\{|\$\{|\{\$|[$@][A-Za-z_]/;
const SHELL_EXEC_CALL =
  /\b(?:subprocess\s*\.\s*(?:run|call|Popen|check_output|check_call|getoutput|getstatusoutput)|(?:[\w$]+\s*\.\s*)*(?:exec(?:File)?(?:Sync)?|spawn(?:File)?(?:Sync)?|system|popen|shell_exec|passthru|child_process|eval))\s*\(/g;
const SHELL_EXEC_PREFIX = /\b(?:system|exec|spawn|popen)\s*$/;
const LANGUAGE_EVAL_CALL = /\b(?:eval|exec)\s*\(/g;
const LANGUAGE_EVAL_PREFIX = /\b(?:eval|exec)\s*$/;
const VALUE_CONSUMING_INTERPRETER_FLAGS = new Map([
  ['bash', new Set(['-O'])],
  ['sh', new Set(['-O'])],
  ['zsh', new Set(['-o'])],
  ['dash', new Set(['-o'])],
  ['ksh', new Set(['-o'])],
  ['python', new Set(['-W', '-X'])],
  ['node', new Set(['-r', '--require', '--loader', '--import', '--input-type'])],
]);

type SecretTarget = {
  target: string;
  ruleId: string;
};

type SecretCandidate = {
  readonly target: string;
  readonly cwd: string;
  readonly isRedirectionWriteTarget?: true;
  readonly isCreatedPath?: true;
  readonly isCertificateInput?: true;
  readonly certificateOutputMayFeedReader?: true;
  readonly literalRole?: 'data' | 'write';
  readonly loopVariable?: string;
};

type SecretProtectionPolicy = {
  readonly disabledRules?: readonly string[];
  readonly denyPaths: readonly string[];
  readonly allowPaths?: readonly string[];
};

type SecretInspectionOptions = {
  readonly strict?: boolean;
};

type LiteralFamily = 'python' | 'javascript' | 'simple' | 'opaque';

type CodeLiteral = {
  readonly start: number;
  readonly text: string;
  readonly tokenStart: number;
  readonly tokenEnd: number;
};

type LiteralScan = { readonly masked: string[]; readonly literals: CodeLiteral[] };

type MaskedCode =
  | { readonly kind: 'masked'; readonly masked: string; readonly literals: readonly CodeLiteral[] }
  | { readonly kind: 'unmaskable' };

type PathExtractionOptions = {
  readonly skipMetadataOnlySegments?: boolean;
  readonly inlineLiteralsPresumedData?: boolean;
  readonly displayOperandsAreCapturedOutput?: boolean;
  readonly segmentMayFeedReader?: boolean;
  readonly commandHoldsPipe?: boolean;
};

function findSensitivePolicyPathTarget(
  candidates: readonly SecretCandidate[],
  config: SecretProtectionPolicy | undefined,
  configCwd: string,
  environment: EnvironmentContext,
  budget: Budget,
  activeDefaultTargets?: ReadonlyMap<string, 'path' | 'data' | 'write'>,
): SecretTarget | null {
  for (const candidate of candidates) {
    const target = candidate.target;
    if (
      matchesPolicyPath(
        target,
        candidate.cwd,
        config?.denyPaths ?? [],
        configCwd,
        environment,
        budget,
      )
    ) {
      return { target, ruleId: 'secret.deny-path' };
    }
    if (activeDefaultTargets && !activeDefaultTargets.has(target)) continue;
    const ruleId = isSensitivePath(target, candidate.cwd, config, environment, budget);
    if (ruleId) {
      const standardModeFileNameRule =
        activeDefaultTargets !== undefined &&
        !ruleId.startsWith('secret.home.') &&
        !ruleId.startsWith('secret.cli.');
      const matchedDirectory =
        standardModeFileNameRule &&
        environment.paths.isDirectory(
          candidateAbsolutePath(target, candidate.cwd, environment, budget),
        );
      if (matchedDirectory) continue;
      const dataRoleLiteral =
        standardModeFileNameRule && activeDefaultTargets?.get(target) === 'data';
      if (dataRoleLiteral) continue;
      const writeCreatesNewFile =
        standardModeFileNameRule &&
        (candidate.isRedirectionWriteTarget === true ||
          activeDefaultTargets?.get(target) === 'write') &&
        !target.includes('$') &&
        !candidateExistsOnDisk(target, candidate.cwd, environment, budget);
      if (writeCreatesNewFile) continue;
      if (
        standardModeFileNameRule &&
        (candidate.isCreatedPath === true || candidate.isCertificateInput === true)
      ) {
        continue;
      }
      const spacedNonPathWord =
        standardModeFileNameRule &&
        /\s/.test(target) &&
        !target.includes('$') &&
        !/^(?:[~./]|[A-Za-z]:[\\/])/.test(target) &&
        !candidateExistsOnDisk(target, candidate.cwd, environment, budget);
      if (spacedNonPathWord) continue;
      if (
        !ruleId.startsWith('secret.cli.') &&
        matchesAllowedPath(
          target,
          candidate.cwd,
          config?.allowPaths ?? [],
          configCwd,
          environment,
          budget,
        )
      ) {
        continue;
      }
      return { target, ruleId };
    }
  }
  return null;
}

export function findSensitiveTargetInSemanticFacts(
  facts: SemanticFacts,
  config: SecretProtectionPolicy | undefined,
  environment: EnvironmentContext,
  budget: Budget,
  options: SecretInspectionOptions = {},
): SecretTarget | null {
  const candidates = extractToolPathTargets(facts, environment, budget);
  const target = findSensitivePolicyPathTarget(
    candidates,
    config,
    facts.invocation.context.configCwd,
    environment,
    budget,
  );
  if (target === null || target.ruleId === 'secret.deny-path' || options.strict !== false) {
    return target;
  }
  const refinedWithLoopWords = extractToolPathTargets(facts, environment, budget, {
    skipMetadataOnlySegments: true,
    inlineLiteralsPresumedData: true,
  });
  const loopsReferencing = new Map<string, Set<string | undefined>>();
  refinedWithLoopWords.forEach((other) =>
    referencedShellVariables(other.target).forEach((name) =>
      loopsReferencing.set(name, (loopsReferencing.get(name) ?? new Set()).add(other.loopVariable)),
    ),
  );
  const referencedOutsideLoop = (name: string, loopVariable: string) =>
    (loopsReferencing.get(name)?.size ?? 0) >
    (loopsReferencing.get(name)?.has(loopVariable) ? 1 : 0);
  const refinedCandidates = refinedWithLoopWords.filter(
    ({ loopVariable }) =>
      loopVariable === undefined ||
      referencedOutsideLoop(loopVariable, loopVariable) ||
      referencedOutsideLoop('!', loopVariable),
  );
  const pathRoleTargets = new Set(
    refinedCandidates
      .filter((candidate) => candidate.literalRole === undefined)
      .map((candidate) => candidate.target),
  );
  const writeRoleTargets = new Set(
    refinedCandidates
      .filter((candidate) => candidate.literalRole === 'write')
      .map((candidate) => candidate.target),
  );
  const refinedTarget = findSensitivePolicyPathTarget(
    candidates,
    config,
    facts.invocation.context.configCwd,
    environment,
    budget,
    new Map(
      refinedCandidates.map((candidate) => [
        candidate.target,
        pathRoleTargets.has(candidate.target)
          ? 'path'
          : writeRoleTargets.has(candidate.target)
            ? 'write'
            : 'data',
      ]),
    ),
  );
  return refinedTarget?.ruleId !== 'secret.deny-path' && isMetadataOnlyCommand(facts, environment)
    ? null
    : refinedTarget;
}

function isMetadataOnlyCommand(facts: SemanticFacts, environment: EnvironmentContext): boolean {
  const syntax =
    getCommandSyntaxFact(facts, 'input-candidate') ??
    getCommandSyntaxFact(facts, 'declared-command');
  if (!syntax) return false;
  if (syntax.program.nodes.some((node) => node.kind === 'command' && node.nested.length > 0)) {
    return false;
  }

  const tokens: string[] = [];
  for (const token of readGuardTokens(syntax.shell)) {
    if (token.kind === 'operator' && token.boundary) return false;
    if (token.kind === 'redirection') return false;
    if (token.kind === 'operator') continue;
    tokens.push(projectSensitiveShellText(token.text, environment));
  }

  const stripped = stripLeadingWrappersAndEnvAssignments(tokens);
  if (stripped.length === 0) return false;
  const command = basename(stripped[0] ?? '').toLowerCase();
  if (facts.invocation.route.kind === 'unknown') {
    return syntax.program.dialect === 'powershell' && (command === 'ls' || command === 'stat');
  }
  return isMetadataOnlyArgv(command, stripped.slice(1));
}

function isMetadataOnlyArgv(command: string, args: readonly string[]): boolean {
  if (command === 'ls' || command === 'stat') return true;
  if (command === 'test') return args.length === 2 && (args[0] === '-e' || args[0] === '-f');
  if (command === '[') {
    return args.length === 3 && (args[0] === '-e' || args[0] === '-f') && args[2] === ']';
  }
  if (command === 'git') return args[0] === 'check-ignore';
  if (command === 'wc')
    return args.every((arg) => !arg.startsWith('-') || WC_COUNT_OPTION.test(arg));
  if (PATTERN_FIRST_COMMANDS.has(command)) return isNamesOrCountsOnlySearch(command, args);
  if (command !== 'find') return false;
  return !args.some((arg) => FIND_NON_METADATA_ARGS.has(arg));
}

function isNamesOrCountsOnlySearch(command: string, args: readonly string[]): boolean {
  const beforeDoubleDash = args.includes('--') ? args.slice(0, args.indexOf('--')) : args;
  if (
    beforeDoubleDash.some(
      (arg) => /^--(?:(?:file|pre)(?:=|$)|json|format)/.test(arg) || /^-[^-]*f/.test(arg),
    )
  ) {
    return false;
  }
  const valueFlag = command === 'rg' ? /[ABCEMTdegjmrt]/ : /[ABCDdefm]/;
  const namesOnlyFlag = command === 'rg' ? /[clq]/ : /[Lclq]/;
  const isShortCluster = (arg: string) => /^-[^-]/.test(arg);
  const consumedAsValue = (index: number) => {
    const previous = beforeDoubleDash[index - 1] ?? '';
    return (
      (/^--[^=]+$/.test(previous) && !SEARCH_VALUELESS_LONG.has(previous.slice(2))) ||
      (isShortCluster(previous) && previous.slice(1).search(valueFlag) === previous.length - 2)
    );
  };
  const firstOperand = beforeDoubleDash.findIndex(
    (arg, index) => !arg.startsWith('-') && !consumedAsValue(index),
  );
  const optionArgs =
    command === 'grep' && firstOperand >= 0
      ? beforeDoubleDash.slice(0, firstOperand)
      : beforeDoubleDash;
  return optionArgs.some((arg, index) => {
    if (consumedAsValue(index)) return false;
    if (arg.startsWith('--')) return SEARCH_NAMES_ONLY_LONG.has(arg.slice(2));
    return isShortCluster(arg) && namesOnlyFlag.test(arg.slice(1).split(valueFlag)[0] ?? '');
  });
}

function extractToolPathTargets(
  facts: SemanticFacts,
  environment: EnvironmentContext,
  budget: Budget,
  options: PathExtractionOptions = {},
): SecretCandidate[] {
  const cwd = facts.invocation.context.executionCwd;
  const route = facts.invocation.route.kind;
  if (route !== 'command' && route !== 'unknown') {
    return facts.paths.map((target) => ({ target, cwd }));
  }

  const command = getCommandSyntaxFact(facts, 'input-candidate');
  return [
    ...(command
      ? extractCommandPathTargets(
          command.shell,
          facts.store,
          options,
          environment,
          cwd,
          budget,
          isPowerShell(command),
        )
      : []),
    ...(route === 'unknown' ? facts.paths.map((target) => ({ target, cwd })) : []),
  ];
}

function isPowerShell(command: CommandSyntaxFacts): boolean {
  return command.program.dialect === 'powershell';
}

function extractCommandPathTargets(
  syntax: GuardSyntax,
  store: SemanticFactStore,
  options: PathExtractionOptions,
  environment: EnvironmentContext,
  cwd: string,
  budget: Budget,
  powershell = false,
): SecretCandidate[] {
  if (syntax.status === 'structural-limit') throw new StructuralShellSyntaxLimitError();
  if (syntax.status === 'unclosed-quote') return [];
  if (syntax.status === 'invalid') throw new Error('Unable to parse command for secret protection');

  const targets: SecretCandidate[] = [
    ...syntax.assignmentFallbacks.map((target) => ({ target, cwd })),
    ...extractCommandSubstitutionPathTargets(
      projectSensitiveShellText(syntax.source, environment),
      store,
      options,
      environment,
      cwd,
      budget,
    ),
  ];

  const map = (text: string) =>
    projectSensitiveShellText(rewritePowerShellHomePrefix(text, powershell), environment);
  const holdsProcessSubstitution = /[<>=]\(/.test(syntax.source);
  const holdsCoprocess = /\bcoproc\b|\|&/.test(syntax.source);
  const pipedWords: string[] = [];
  const programs: string[] = [];
  const withPipeAhead = (pipeAhead: boolean) => ({
    ...options,
    commandHoldsPipe: options.commandHoldsPipe === true || pipeAhead || holdsCoprocess,
  });
  walkGuardSyntax(syntax, cwd, environment, budget, {
    word: map,
    segment: (tokens, state, pipeProducer, boundary, shellWords, pipeAhead) => {
      if (tokens.length === 0) return null;
      const scriptOptions = withPipeAhead(pipeAhead);
      if (scriptOptions.commandHoldsPipe) pipedWords.push(...tokens);
      programs.push(
        basename(
          withoutTimeout(stripLeadingWrappersAndEnvAssignments(tokens))[0] ?? '',
        ).toLowerCase(),
      );
      targets.push(
        ...extractSegmentPathTargets(
          tokens,
          store,
          holdsProcessSubstitution || boundary === '|' || boundary === '|&'
            ? { ...scriptOptions, segmentMayFeedReader: true }
            : scriptOptions,
          environment,
          state.cwd,
          budget,
          shellWords,
        ),
      );
      if (pipeProducer !== null) {
        targets.push(
          ...extractPipeCarrierPathTargets(
            pipeProducer,
            tokens,
            store,
            scriptOptions,
            environment,
            state.cwd,
            budget,
          ),
        );
      }
      return null;
    },
    redirection: (redirection, state, pipeAhead) => {
      if (redirection.body !== undefined && redirection.consumer !== undefined) {
        const scriptOptions = withPipeAhead(pipeAhead);
        targets.push(
          ...extractStdinScriptPathTargets(
            redirection.consumer,
            [redirection.body],
            store,
            scriptOptions,
            environment,
            state.cwd,
            budget,
            (body) =>
              rewalkInterpreterHeredocAsShell(
                redirection.consumer ?? [],
                body,
                store,
                scriptOptions,
                environment,
                state.cwd,
                budget,
              ),
          ),
        );
      }
      if (redirection.targetOrder === 'legacy-segment') return ADOPT_AS_OPERAND;
      targets.push({
        target: map(redirection.target),
        cwd: state.cwd,
        ...(redirection.role === 'file-write' ? { isRedirectionWriteTarget: true as const } : {}),
      });
      return null;
    },
  });

  const pipedNames = new Set(pipedWords.flatMap(referencedShellVariables));
  const certificateOutputMayReachReader =
    holdsProcessSubstitution ||
    /\$\(|`/.test(syntax.source) ||
    !programs.every((program) => CERTIFICATE_PIPE_PROGRAMS.has(program));
  return targets.map(({ loopVariable, ...candidate }) => {
    if (candidate.certificateOutputMayFeedReader === true && certificateOutputMayReachReader) {
      return { target: candidate.target, cwd: candidate.cwd };
    }
    return loopVariable === undefined ||
      holdsProcessSubstitution ||
      pipedNames.has(loopVariable) ||
      pipedNames.has('!')
      ? candidate
      : { ...candidate, loopVariable };
  });
}

function referencedShellVariables(text: string): string[] {
  return [
    ...(/^[A-Za-z_][A-Za-z0-9_]*$/.test(text) ? [text] : []),
    ...Array.from(
      text.matchAll(/\$(?:\{(!)|\{?([A-Za-z_][A-Za-z0-9_]*))/g),
      (match) => match[1] ?? match[2] ?? '',
    ),
  ];
}

function walkShellText(
  text: string,
  store: SemanticFactStore,
  options: PathExtractionOptions,
  environment: EnvironmentContext,
  cwd: string,
  budget: Budget,
  powershell = false,
): SecretCandidate[] | null {
  const syntax = store.getShellSyntax(
    text,
    powershell ? store.getCommandProgram(text, 'powershell') : undefined,
  );
  if (syntax.status === 'structural-limit') throw new StructuralShellSyntaxLimitError();
  return syntax.status === 'complete'
    ? extractCommandPathTargets(syntax, store, options, environment, cwd, budget, powershell)
    : null;
}

function extractSegmentPathTargets(
  tokens: readonly string[],
  store: SemanticFactStore,
  options: PathExtractionOptions,
  environment: EnvironmentContext,
  cwd: string,
  budget: Budget,
  shellWords?: ReadonlySet<number>,
): SecretCandidate[] {
  const here = (target: string) => ({ target, cwd });
  const reservedPrefix = tokens.findIndex((token) => !SHELL_RESERVED_WORDS.has(token));
  if (options.skipMetadataOnlySegments === true && reservedPrefix > 0) {
    return extractSegmentPathTargets(
      tokens.slice(reservedPrefix),
      store,
      options,
      environment,
      cwd,
      budget,
      new Set([...(shellWords ?? [])].map((index) => index - reservedPrefix)),
    );
  }
  const loopVariable = tokens[1] ?? '';
  if (
    options.skipMetadataOnlySegments === true &&
    tokens[0] === 'for' &&
    tokens[2] === 'in' &&
    /^[A-Za-z_][A-Za-z0-9_]*$/.test(loopVariable)
  ) {
    return tokens
      .slice(3)
      .flatMap((token) => extractOperandPathCandidates('for', token))
      .map((target) => ({ ...here(target), loopVariable }));
  }
  if (shellWords?.size) {
    const argv = tokens.filter((_, index) => !shellWords.has(index));
    if (
      JQ_COMMANDS.has(basename(stripLeadingWrappersAndEnvAssignments(argv)[0] ?? '').toLowerCase())
    ) {
      return [
        ...tokens.filter((_, index) => shellWords.has(index)).map(here),
        ...extractSegmentPathTargets(argv, store, options, environment, cwd, budget),
      ];
    }
  }
  const assignmentValues = extractLeadingAssignmentValues(tokens).map(here);
  const stripped = stripLeadingWrappersAndEnvAssignments(tokens);
  if (stripped.length === 0) return assignmentValues;

  const executable = stripped[0] ?? '';
  const command = basename(executable).toLowerCase();
  const post = stripped.slice(1);
  const outputMayFeedReader =
    options.segmentMayFeedReader === true ||
    options.commandHoldsPipe === true ||
    options.displayOperandsAreCapturedOutput === true;
  const metadataOutputMayFeedReader =
    outputMayFeedReader && NAME_LISTING_METADATA_COMMANDS.has(command);
  if (
    options.skipMetadataOnlySegments === true &&
    !metadataOutputMayFeedReader &&
    isMetadataOnlyArgv(command, post)
  ) {
    return assignmentValues;
  }
  const explainTargets = extractSafetyNetExplainPathTargets(executable, command, post);

  if (explainTargets) {
    return [...assignmentValues, ...explainTargets.map(here)];
  }

  if (NON_PATH_OPERAND_COMMANDS.has(command)) {
    return options.displayOperandsAreCapturedOutput === true
      ? [...assignmentValues, ...extractDisplayCommandOperands(tokens).map(here)]
      : assignmentValues;
  }

  if (command === 'eval') {
    return [
      ...assignmentValues,
      ...(walkShellText(post.join(' '), store, options, environment, cwd, budget) ??
        post.map(here)),
    ];
  }

  const powerShellScript = POWERSHELL_HEADS.has(normalizeCommandToken(executable))
    ? readPowerShellScript(stripped)
    : undefined;
  if (powerShellScript !== undefined) budget.charge('derivedTokens', stripped.length);
  const powerShellTargets =
    powerShellScript === undefined
      ? null
      : walkShellText(powerShellScript, store, options, environment, cwd, budget, true);
  if (powerShellTargets?.length) return [...assignmentValues, ...powerShellTargets];

  if (command === 'export') {
    return [
      ...assignmentValues,
      ...post
        .flatMap((token) =>
          /^[A-Za-z_][A-Za-z0-9_]*=/.test(token)
            ? [token.slice(token.indexOf('=') + 1)]
            : extractOperandPathCandidates(command, token),
        )
        .map(here),
    ];
  }
  if (command === 'git') {
    return [...assignmentValues, ...extractGitOperandPathTargets(post).map(here)];
  }
  if (command === 'gh') {
    return [
      ...assignmentValues,
      ...extractTextFlagOperandCandidates(command, post, GH_TEXT_FLAGS).map(here),
    ];
  }
  if (JQ_COMMANDS.has(command)) {
    return [...assignmentValues, ...extractJqPathTargets(post).map(here)];
  }
  if (PATTERN_FIRST_COMMANDS.has(command)) {
    return [...assignmentValues, ...extractPatternCommandTargets(post).map(here)];
  }
  if (PATH_ROOT_COMMANDS.has(command)) {
    return [
      ...assignmentValues,
      ...extractFindCommandTargets(post, store, options, environment, cwd, budget).map(here),
    ];
  }
  if (command === 'mkdir' || command === 'touch') {
    const redirectionTargets = new Set(tokens.filter((_, index) => shellWords?.has(index)));
    const createsOperands =
      options.segmentMayFeedReader !== true &&
      !(command === 'touch' && post.some((token) => /^(?:--r|-[^-]*r)/.test(token)));
    return [
      ...assignmentValues,
      ...post.flatMap((token) =>
        extractOperandPathCandidates(command, token).map((target) =>
          createsOperands && !token.startsWith('-') && !redirectionTargets.has(token)
            ? { ...here(target), isCreatedPath: true as const }
            : here(target),
        ),
      ),
    ];
  }
  if (AWK_INTERPRETERS.has(command)) {
    return [
      ...assignmentValues,
      ...post.flatMap((token) => extractOperandPathCandidates('awk', token)).map(here),
      ...post.flatMap((token) =>
        extractAwkSystemCommandTargets(token, store, options, environment, cwd, budget),
      ),
      ...post.flatMap(extractAwkGetlineRedirectTargets).map(here),
    ];
  }
  if (command === 'curl') {
    return [
      ...assignmentValues,
      ...post
        .filter(
          (token, index) =>
            attachedCurlUploadOperand(token) === null &&
            curlOperandUploadFlag(post[index - 1]) === null,
        )
        .flatMap((token) => extractOperandPathCandidates(command, token))
        .map(here),
      ...extractCurlUploadPathTargets(post).map(here),
    ];
  }
  if (isCodeInterpreter(command)) {
    const shellArgv = SHELL_STDIN_INTERPRETERS.has(command)
      ? parseShellArgv([command, ...post])
      : null;
    if (shellArgv !== null && shellArgv.command !== null && shellArgv.commandIndex !== null) {
      const syntax = store.getShellSyntax(shellArgv.command);
      if (syntax.status === 'structural-limit') throw new StructuralShellSyntaxLimitError();
      if (syntax.status === 'complete') {
        return [
          ...assignmentValues,
          ...extractCommandPathTargets(syntax, store, options, environment, cwd, budget),
          ...post
            .slice(shellArgv.commandIndex)
            .filter((token) => !token.startsWith('-'))
            .map(here),
        ];
      }
    }
    return [
      ...assignmentValues,
      ...extractInterpreterPathTargets(command, post, store, options, environment, cwd, budget),
    ];
  }
  const optionValue = (option: string, index: number) =>
    new RegExp(`^--?${option}=`).test(post[index] ?? '') ||
    new RegExp(`^--?${option}$`).test(post[index - 1] ?? '');
  const writesTailscaleCertFiles = runsTailscaleCert(stripped);
  const readsOnlyCertificate = command === 'openssl' && post[0] === 'x509';
  const certificateOutput = outputMayFeedReader
    ? { certificateOutputMayFeedReader: true as const }
    : {};
  return [
    ...assignmentValues,
    ...post.flatMap((token, index) =>
      extractOperandPathCandidates(command, token).map((target) =>
        writesTailscaleCertFiles && optionValue('(?:cert|key)-file', index)
          ? { ...here(target), isCreatedPath: true as const, ...certificateOutput }
          : readsOnlyCertificate && optionValue('in', index)
            ? { ...here(target), isCertificateInput: true as const, ...certificateOutput }
            : here(target),
      ),
    ),
  ];
}

function withoutTimeout(argv: readonly string[]): readonly string[] {
  return basename(argv[0] ?? '').toLowerCase() === 'timeout' ? argv.slice(2) : argv;
}

function runsTailscaleCert(argv: readonly string[]): boolean {
  const program = withoutTimeout(argv);
  return basename(program[0] ?? '').toLowerCase() === 'tailscale' && program[1] === 'cert';
}

function extractSafetyNetExplainPathTargets(
  executable: string,
  command: string,
  tokens: readonly string[],
): string[] | null {
  const prefixLength = safetyNetSubcommandIndex(command, tokens);
  if (prefixLength === null || tokens[prefixLength] !== 'explain') return null;

  const targets = [executable, ...tokens.slice(0, prefixLength)];
  const args = tokens.slice(prefixLength + 1);
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--json' || arg === '--help' || arg === '-h') continue;
    if (arg === '--cwd') {
      const cwd = args[index + 1];
      if (cwd && !cwd.startsWith('--')) targets.push(cwd);
      index++;
      continue;
    }
    return targets;
  }
  return targets;
}

function extractPipeCarrierPathTargets(
  producer: readonly string[],
  consumer: readonly string[],
  store: SemanticFactStore,
  options: PathExtractionOptions,
  environment: EnvironmentContext,
  cwd: string,
  budget: Budget,
): SecretCandidate[] {
  if (xargsReadsPipeInputAsPath(consumer, store, options, environment, cwd, budget)) {
    const stripped = stripLeadingWrappersAndEnvAssignments(producer);
    const namesListedByMetadataProducer = isMetadataOnlyArgv(
      basename(stripped[0] ?? '').toLowerCase(),
      stripped.slice(1),
    )
      ? stripped.slice(1).filter((token) => !token.startsWith('-'))
      : [];
    return [...extractDisplayCommandOperands(producer), ...namesListedByMetadataProducer].map(
      (target) => ({ target, cwd }),
    );
  }

  return extractStdinScriptPathTargets(
    consumer,
    extractDisplayCommandBodies(producer),
    store,
    options,
    environment,
    cwd,
    budget,
    () => [],
  );
}

function rewalkInterpreterHeredocAsShell(
  consumer: readonly string[],
  body: string,
  store: SemanticFactStore,
  options: PathExtractionOptions,
  environment: EnvironmentContext,
  cwd: string,
  budget: Budget,
): SecretCandidate[] {
  const stripped = stripLeadingWrappersAndEnvAssignments(consumer);
  if (!isCodeInterpreter(basename(stripped[0] ?? '').toLowerCase())) return [];
  return walkShellText(body, store, options, environment, cwd, budget) ?? [{ target: body, cwd }];
}

function extractStdinScriptPathTargets(
  consumer: readonly string[],
  bodies: readonly string[],
  store: SemanticFactStore,
  options: PathExtractionOptions,
  environment: EnvironmentContext,
  cwd: string,
  budget: Budget,
  rewalkNonScriptHeredocBody: (body: string) => SecretCandidate[],
): SecretCandidate[] {
  const interpreter = getStdinScriptInterpreter(consumer);
  if (interpreter === null) return bodies.flatMap(rewalkNonScriptHeredocBody);

  return bodies.flatMap((body) =>
    SHELL_STDIN_INTERPRETERS.has(interpreter)
      ? extractCommandPathTargets(
          store.getShellSyntax(body),
          store,
          options,
          environment,
          cwd,
          budget,
        )
      : extractInlineCodePathTargets(interpreter, body, store, options, environment, cwd, budget),
  );
}

function extractDisplayCommandOperands(tokens: readonly string[]): string[] {
  const stripped = stripLeadingWrappersAndEnvAssignments(tokens);
  if (stripped.length === 0) return [];

  const command = basename(stripped[0] ?? '').toLowerCase();
  if (!NON_PATH_OPERAND_COMMANDS.has(command)) return [];

  const format = stripped[stripped[1] === '--' ? 2 : 1];
  if (
    command === 'printf' &&
    format !== undefined &&
    !format.startsWith('-') &&
    !format.replaceAll('%%', '').includes('%')
  ) {
    return [decodePrintfEscapes(format.replaceAll('%%', '%'))];
  }
  return stripped.slice(1);
}

function extractDisplayCommandBodies(tokens: readonly string[]): string[] {
  const stripped = stripLeadingWrappersAndEnvAssignments(tokens);
  if (stripped.length === 0) return [];

  const command = basename(stripped[0] ?? '').toLowerCase();
  const args = stripped.slice(1);
  if (command === 'echo') {
    const optionEnd = args.findIndex((token) => !/^-[neE]+$/.test(token));
    return [(optionEnd === -1 ? [] : args.slice(optionEnd)).join(' ')];
  }
  if (command === 'printf') {
    return extractPrintfDisplayBodies(args);
  }
  return [];
}

function extractPrintfDisplayBodies(tokens: readonly string[]): string[] {
  const format = tokens[0];
  if (format === undefined) {
    return [];
  }

  const valuesPerFormat = (format.match(/%%|%[bqs]/g) ?? []).filter(
    (specifier) => specifier !== '%%',
  ).length;
  if (valuesPerFormat === 0 || tokens.length === 1) {
    return [decodePrintfEscapes(format)];
  }

  const values = tokens.slice(1);
  return Array.from({ length: Math.ceil(values.length / valuesPerFormat) }, (_, index) =>
    applyPrintfStringArguments(
      format,
      values.slice(index * valuesPerFormat, (index + 1) * valuesPerFormat),
    ),
  );
}

function applyPrintfStringArguments(format: string, values: readonly string[]): string {
  let valueIndex = 0;
  return decodePrintfEscapes(
    format.replace(/%%|%[bqs]/g, (specifier) => {
      if (specifier === '%%') {
        return '%';
      }
      const value = values[valueIndex] ?? '';
      valueIndex++;
      return value;
    }),
  );
}

function decodePrintfEscapes(value: string): string {
  return value.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r');
}

function xargsReadsPipeInputAsPath(
  tokens: readonly string[],
  store: SemanticFactStore,
  options: PathExtractionOptions,
  environment: EnvironmentContext,
  cwd: string,
  budget: Budget,
): boolean {
  const stripped = stripLeadingWrappersAndEnvAssignments(tokens);
  if (stripped.length === 0 || basename(stripped[0] ?? '').toLowerCase() !== 'xargs') {
    return false;
  }

  const xargs = extractXargsChildCommandWithInfo(stripped);
  const xargsChildTokens = stripped.slice(xargs.childStart);
  if (xargsChildTokens.length === 0) {
    return false;
  }
  if (xargs.replacementToken === '') {
    return false;
  }

  const replacementToken = xargs.replacementToken;
  const childTokens =
    replacementToken === null
      ? [...xargsChildTokens, PIPE_INPUT_PATH_MARKER]
      : xargsChildTokens.map((token) => token.split(replacementToken).join(PIPE_INPUT_PATH_MARKER));
  return extractSegmentPathTargets(childTokens, store, options, environment, cwd, budget).some(
    (candidate) => candidate.target.includes(PIPE_INPUT_PATH_MARKER),
  );
}

function getStdinScriptInterpreter(tokens: readonly string[]): string | null {
  const stripped = stripLeadingWrappersAndEnvAssignments(tokens);
  if (stripped.length === 0) return null;

  const command = basename(stripped[0] ?? '').toLowerCase();
  if (!isCodeInterpreter(command)) return null;
  return interpreterReadsStdinScript(command, stripped.slice(1)) ? command : null;
}

function interpreterReadsStdinScript(command: string, tokens: readonly string[]): boolean {
  const normalizedCommand = normalizeInterpreterName(command);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === undefined) break;
    if (
      CODE_EVAL_FLAGS.has(token) ||
      isClusteredCodeEvalFlag(command, token) ||
      /^--(?:eval|exec)=/.test(token)
    ) {
      return false;
    }
    if (token === '-') {
      return true;
    }
    if (token.startsWith('-')) {
      if (normalizedCommand === 'python' && token === '-m') return false;
      if (VALUE_CONSUMING_INTERPRETER_FLAGS.get(normalizedCommand)?.has(token)) i++;
      continue;
    }
    return false;
  }
  return true;
}

function normalizeInterpreterName(command: string): string {
  return /^python\d/.test(command) ? 'python' : command;
}

function extractLeadingAssignmentValues(tokens: readonly string[]): string[] {
  const values: string[] = [];
  for (const token of tokens) {
    if (isWrapperToken(token)) {
      continue;
    }
    const assignment = /^[A-Za-z_][A-Za-z0-9_]*=(.*)$/.exec(token);
    if (assignment === null) {
      break;
    }
    if (assignment[1] !== undefined && assignment[1] !== '') {
      values.push(assignment[1]);
    }
  }
  return values;
}

const POWERSHELL_HOME_PREFIX = /^(?:\$\{home\}|\$\{env:(?:userprofile|home)\}|~)(?=[\\/])/i;

function rewritePowerShellHomePrefix(token: string, powershell: boolean): string {
  if (!powershell || !POWERSHELL_HOME_PREFIX.test(token)) return token;
  return `~${token.replace(POWERSHELL_HOME_PREFIX, '').replace(/\\/g, '/')}`;
}

function extractOperandPathCandidates(command: string, token: string): string[] {
  if (token === '--') return [];
  const candidates: string[] = [];
  const equals = token.indexOf('=');
  if (equals > 0 && equals < token.length - 1 && !token.slice(0, equals).includes('?')) {
    candidates.push(token.slice(equals + 1));
  }
  if (token.startsWith('-')) return candidates;
  if (command === 'tar' && /\.(?:tar|tgz|tar\.gz|zip)$/i.test(token)) return candidates;
  if (command === 'zip' && /\.zip$/i.test(token)) return candidates;
  candidates.push(token);
  return candidates;
}

function extractJqPathTargets(tokens: readonly string[]): string[] {
  let programIndex = -1;
  let afterDashDash = false;
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index] ?? '';
    if (!afterDashDash && token === '--') {
      afterDashDash = true;
      continue;
    }
    if (afterDashDash || !/^-(?:[A-Za-z]|-)/.test(token)) {
      if (programIndex === -1) programIndex = index;
      continue;
    }
    if (/^--(?:arg|argjson|argfile|rawfile|slurpfile)$/.test(token)) {
      index += 2;
      continue;
    }
    if (token === '--indent' || token === '-L') {
      index++;
      continue;
    }
    if (token.startsWith('-L')) continue;
    if (
      /^-[srjcCMaSRnbehV]+$/.test(token) ||
      /^--(?:slurp|raw-output0?|join-output|compact-output|color-output|monochrome-output|ascii-output|unbuffered|sort-keys|raw-input|null-input|binary|tab|seq|stream|stream-errors|exit-status|args|jsonargs|help|version|build-configuration)$/.test(
        token,
      )
    ) {
      continue;
    }
    return tokens.flatMap((arg) => extractOperandPathCandidates('jq', arg));
  }
  return tokens.flatMap((token, index) =>
    index === programIndex ? [] : extractOperandPathCandidates('jq', token),
  );
}

function extractGitOperandPathTargets(tokens: readonly string[]): string[] {
  const targets: string[] = [];
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index] ?? '';
    if (token === '--' || !token.startsWith('-')) {
      return [
        ...targets,
        ...(GIT_MESSAGE_SUBCOMMANDS.has(token)
          ? extractTextFlagOperandCandidates(
              'git',
              // `-am` is `-a -m`; only letters that take no value may precede the `m`.
              tokens.slice(index).map((arg) => (/^-[aeinopqsv]+m$/.test(arg) ? '-m' : arg)),
              GIT_MESSAGE_FLAGS,
            )
          : extractTextFlagOperandCandidates('git', tokens.slice(index), GIT_GREP_FLAGS)),
      ];
    }
    targets.push(...extractOperandPathCandidates('git', token));
    if (!GIT_GLOBAL_OPTS_WITH_VALUE.has(token)) continue;
    const value = tokens[index + 1];
    if (value === undefined) break;

    targets.push(
      ...(token === '-c' && value.includes('=')
        ? [value.slice(value.indexOf('=') + 1)]
        : extractOperandPathCandidates('git', value)),
    );
    index++;
  }
  return targets;
}

function extractTextFlagOperandCandidates(
  command: string,
  tokens: readonly string[],
  textFlags: ReadonlySet<string>,
): string[] {
  const candidates: string[] = [];
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index] ?? '';
    if (token === '--') {
      return [
        ...candidates,
        ...tokens.slice(index).flatMap((arg) => extractOperandPathCandidates(command, arg)),
      ];
    }
    if (textFlags.has(token)) {
      index++;
      continue;
    }
    if (token.includes('=') && textFlags.has(token.slice(0, token.indexOf('=')))) continue;
    candidates.push(...extractOperandPathCandidates(command, token));
  }
  return candidates;
}

function extractCurlUploadPathTargets(tokens: readonly string[]): string[] {
  return tokens.flatMap((token, index) => {
    const attached = attachedCurlUploadOperand(token);
    if (attached !== null) return curlUploadOperandPaths(attached.flag, attached.value);
    const flag = curlOperandUploadFlag(tokens[index - 1]);
    return flag === null ? [] : curlUploadOperandPaths(flag, token);
  });
}

function curlUploadOperandPaths(flag: string, value: string): string[] {
  if (flag === '-F' || flag === '--form') {
    const equals = value.indexOf('=');
    const part = equals === -1 ? value : value.slice(equals + 1);
    if (!part.startsWith('@') && !part.startsWith('<')) return [];
    return curlUploadPath(part.slice(1).split(';')[0] ?? '');
  }
  if (flag === '--data-urlencode') {
    const at = value.indexOf('@');
    const equals = value.indexOf('=');
    if (at === -1 || (equals !== -1 && equals < at)) return [];
    return curlUploadPath(value.slice(at + 1));
  }
  return value.startsWith('@') ? curlUploadPath(value.slice(1)) : [];
}

function curlOperandUploadFlag(token: string | undefined): string | null {
  if (token === undefined) return null;
  if (CURL_UPLOAD_FLAGS.has(token)) return token;
  return /^-[A-Za-z]+[dF]$/.test(token) ? `-${token.slice(-1)}` : null;
}

function attachedCurlUploadOperand(token: string) {
  const short = token.slice(0, 2);
  if (token.length > 2 && (short === '-d' || short === '-F')) {
    return { flag: short, value: token.slice(2) };
  }
  const equals = token.indexOf('=');
  if (equals === -1) return null;
  const flag = token.slice(0, equals);
  return CURL_UPLOAD_FLAGS.has(flag) ? { flag, value: token.slice(equals + 1) } : null;
}

function curlUploadPath(path: string): string[] {
  return path === '' || path === '-' ? [] : [path];
}

function extractFindCommandTargets(
  tokens: readonly string[],
  store: SemanticFactStore,
  options: PathExtractionOptions,
  environment: EnvironmentContext,
  cwd: string,
  budget: Budget,
): string[] {
  const expressionIndex = tokens.findIndex(
    (token) => token.startsWith('-') || token === '(' || token === '!' || token === ';',
  );
  const targets = [
    ...tokens.slice(0, expressionIndex === -1 ? tokens.length : expressionIndex),
    // `-files0-from FILE` reads FILE, which may sit before the start points.
    ...tokens.flatMap((token, index) =>
      token === '-files0-from' && tokens[index + 1] !== undefined ? [tokens[index + 1] ?? ''] : [],
    ),
  ];
  for (let i = 0; i < tokens.length; i++) {
    if (!FIND_EXEC_PRIMARIES.has(tokens[i] ?? '')) continue;
    const execTokens = tokens.slice(i + 1);
    const terminatorIndex = execTokens.findIndex((token) => FIND_EXEC_TERMINATORS.has(token));
    const execCommand = terminatorIndex === -1 ? execTokens : execTokens.slice(0, terminatorIndex);
    const execTargets = extractSegmentPathTargets(
      execCommand,
      store,
      options,
      environment,
      cwd,
      budget,
    ).map((candidate) => candidate.target);
    targets.push(...execTargets.filter((target) => target !== '{}'));
    if (!execTargets.includes('{}')) continue;
    targets.push(
      ...tokens.slice(0, i).flatMap((token, index, expression) => {
        if (!FIND_MATCH_PATH_PRIMARIES.has(token)) return [];
        const value = expression[index + 1];
        return value === undefined
          ? []
          : [
              value,
              value
                .replace(/^\*+\//, '')
                .replace(/\/\*+$/g, '')
                .replace(/^\*+/, '')
                .replace(/\*+$/g, ''),
            ];
      }),
    );
  }
  return targets;
}

function extractInterpreterPathTargets(
  command: string,
  tokens: readonly string[],
  store: SemanticFactStore,
  options: PathExtractionOptions,
  environment: EnvironmentContext,
  cwd: string,
  budget: Budget,
): SecretCandidate[] {
  const candidates: SecretCandidate[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === undefined) break;

    if (CODE_EVAL_FLAGS.has(token) || isClusteredCodeEvalFlag(command, token)) {
      const code = tokens[i + 1];
      if (code !== undefined) {
        candidates.push(
          ...extractInlineCodePathTargets(command, code, store, options, environment, cwd, budget),
        );
        i++;
      }
      continue;
    }

    const inlineEval = /^--(?:eval|exec)=(.*)$/.exec(token);
    if (inlineEval !== null && inlineEval[1] !== undefined) {
      candidates.push(
        ...extractInlineCodePathTargets(
          command,
          inlineEval[1],
          store,
          options,
          environment,
          cwd,
          budget,
        ),
      );
      continue;
    }

    if (!token.startsWith('-')) {
      candidates.push({ target: token, cwd });
    }
  }
  return candidates;
}

function isClusteredCodeEvalFlag(command: string, token: string): boolean {
  if (!token.startsWith('-') || token.startsWith('--') || token.length <= 2) return false;
  return (
    INTERPRETERS_BY_CLUSTERED_CODE_EVAL_FLAG.get(token[token.length - 1] ?? '')?.has(
      normalizeInterpreterName(command),
    ) ?? false
  );
}

function extractAwkSystemCommandTargets(
  code: string,
  store: SemanticFactStore,
  options: PathExtractionOptions,
  environment: EnvironmentContext,
  cwd: string,
  budget: Budget,
): SecretCandidate[] {
  if (!code.includes('system')) return [];
  return (
    extractAwkSystemCommands(code)?.commands.flatMap((command) =>
      extractCommandPathTargets(
        store.getShellSyntax(command),
        store,
        options,
        environment,
        cwd,
        budget,
      ),
    ) ?? []
  );
}

function extractAwkGetlineRedirectTargets(code: string): string[] {
  return Array.from(
    code.matchAll(/\bgetline(?:\s+[A-Za-z_][A-Za-z0-9_]*)?\s*<\s*"((?:\\.|[^"\\])*)"/g),
  )
    .map((match) => match[1])
    .filter((value): value is string => value !== undefined && value !== '');
}

function extractAllPathCandidatesUnmasked(code: string): string[] {
  const quoted = Array.from(code.matchAll(/(['"`])((?:\\.|(?!\1).)*)\1/g))
    .map((match) => match[2])
    .filter((value): value is string => value !== undefined && value !== '');
  return [
    ...quoted,
    ...quoted.flatMap(decodeBase64PathCandidate),
    ...(code.match(BARE_PATH_PATTERN) ?? []),
  ];
}

function extractInlineCodePathTargets(
  command: string,
  code: string,
  store: SemanticFactStore,
  options: PathExtractionOptions,
  environment: EnvironmentContext,
  cwd: string,
  budget: Budget,
): SecretCandidate[] {
  const here = (target: string) => ({ target, cwd });
  const family = literalFamily(command);
  const masked = maskStringLiterals(code, family);
  if (masked.kind === 'unmaskable') return extractAllPathCandidatesUnmasked(code).map(here);

  const shellExec =
    masked.masked.match(SHELL_EXEC_CALL) !== null ||
    masked.literals.some((literal) =>
      SHELL_EXEC_PREFIX.test(masked.masked.slice(0, literal.start)),
    );
  const languageEval =
    masked.masked.match(LANGUAGE_EVAL_CALL) !== null ||
    masked.literals.some((literal) =>
      LANGUAGE_EVAL_PREFIX.test(masked.masked.slice(0, literal.start)),
    );
  const literalsPresumedData =
    options.inlineLiteralsPresumedData === true && !SHELL_STDIN_INTERPRETERS.has(command);
  const codeRolesReadable =
    literalsPresumedData && (family === 'python' || family === 'javascript');
  const literals =
    literalsPresumedData &&
    !(containsRecognizableInlineAccess(masked.masked) || shellExec || languageEval)
      ? []
      : masked.literals;
  const execCalls = literalsPresumedData
    ? Array.from(masked.masked.matchAll(SHELL_EXEC_CALL), (call) => {
        const start = call.index + call[0].length;
        return { start, end: closingParenthesis(masked.masked, start) };
      })
    : [];
  const literalsExecCallsReceive =
    !literalsPresumedData ||
    execCalls.some(
      (call) =>
        firstArgumentHasName(masked.masked, call.start) &&
        !runsArgvWithoutCodeFlag(masked, call.start),
    )
      ? masked.literals
      : masked.literals.filter(
          (literal) =>
            SHELL_EXEC_PREFIX.test(masked.masked.slice(0, literal.start)) ||
            execCalls.some((call) => literal.start >= call.start && literal.start < call.end),
        );
  const literalsWalkedAsShell = new Set(shellExec ? literalsExecCallsReceive : []);
  const literalRolesReadable =
    codeRolesReadable &&
    literals.length > 0 &&
    !holdsUnreadableLiteralRoles(masked.masked, family === 'python' ? '#' : '//');
  const openers = literalRolesReadable ? innermostOpeners(masked.masked) : [];
  const sequencesMayHoldArguments = literalRolesReadable && namesCommandExecution(masked.masked);
  return [
    ...literals
      .filter((literal) => literal.text !== '')
      .map((literal) => {
        if (!literalRolesReadable || literalsWalkedAsShell.has(literal)) return here(literal.text);
        if (inDataPosition(masked.masked, literal, openers, sequencesMayHoldArguments)) {
          return { ...here(literal.text), literalRole: 'data' as const };
        }
        return feedsOnlyWrite(masked, literal, openers)
          ? { ...here(literal.text), literalRole: 'write' as const }
          : here(literal.text);
      }),
    ...literals.flatMap((literal) => decodeBase64PathCandidate(literal.text)).map(here),
    ...(literalsPresumedData
      ? []
      : masked.literals
          .flatMap((literal) => literal.text.match(BARE_PATH_PATTERN) ?? [])
          .map(here)),
    ...(shellExec
      ? literalsExecCallsReceive.flatMap(
          (literal) =>
            walkShellText(
              literal.text,
              store,
              { ...options, commandHoldsPipe: true },
              environment,
              cwd,
              budget,
            ) ?? [here(literal.text)],
        )
      : []),
    ...(languageEval
      ? masked.literals.flatMap((literal) =>
          extractInlineCodePathTargets(
            command,
            literal.text.replace(/\\(.)/g, (_, escaped: string) =>
              escaped === 'n' ? '\n' : escaped,
            ),
            store,
            options,
            environment,
            cwd,
            budget,
          ),
        )
      : []),
    ...(codeRolesReadable ? [] : (masked.masked.match(BARE_PATH_PATTERN) ?? []).map(here)),
    ...(literalsPresumedData ? (code.match(/\$\{[^}]*\}|\$[A-Za-z_]\w*/g) ?? []).map(here) : []),
  ];
}

const BRACKET_CLOSERS: Readonly<Record<string, string>> = { '(': ')', '[': ']', '{': '}' };
const GROUPING_KEYWORDS = 'and|elif|else|if|in|is|not|of|or|return|while|yield';
const GROUPING_KEYWORD = new RegExp(`(?:^|[^\\w$])(?:${GROUPING_KEYWORDS})$`);
const UNREADABLE_LITERAL_ROLE_SHAPE = new RegExp(
  `(?:\\*|\\.\\.\\.)\\s*[([{]|\\.\\s*(?:${GROUPING_KEYWORDS})\\s*\\(|/\\*`,
);
const COMMAND_EXECUTION_IDENTIFIER_PART = /^(?:exec|spawn)|^(?:popen|system|subprocess)$/;

function holdsUnreadableLiteralRoles(masked: string, commentOpener: string): boolean {
  return (
    UNREADABLE_LITERAL_ROLE_SHAPE.test(masked) ||
    masked.split('\n').some((line) => {
      const comment = line.indexOf(commentOpener);
      return comment >= 0 && /[()[\]{}]/.test(line.slice(comment));
    })
  );
}

function namesCommandExecution(masked: string): boolean {
  return Array.from(masked.matchAll(/[A-Za-z_$][\w$]*/g), (match) =>
    identifierParts(match[0]),
  ).some((parts) => parts.some((part) => COMMAND_EXECUTION_IDENTIFIER_PART.test(part)));
}

const WINDOWS_SHELLS = new Set(['cmd', 'powershell', 'pwsh']);

function runsArgvWithoutCodeFlag(
  masked: Extract<MaskedCode, { kind: 'masked' }>,
  start: number,
): boolean {
  const opener = nextNonWhitespaceIndex(masked.masked, start);
  const closer = BRACKET_CLOSERS[masked.masked[opener] ?? ''];
  if (closer === undefined || closer === '}') return false;
  const end = masked.masked.indexOf(closer, opener + 1);
  const elements = masked.masked.slice(opener + 1, end);
  return (
    end !== -1 &&
    /^\s*,[\w\s,]*$/.test(elements) &&
    /^[,)]/.test(masked.masked.slice(nextNonWhitespaceIndex(masked.masked, end + 1))) &&
    !masked.literals.some(
      (literal) =>
        literal.tokenStart > opener &&
        literal.tokenStart < end &&
        (CODE_EVAL_FLAGS.has(literal.text) ||
          isCodeInterpreter(basename(literal.text).toLowerCase()) ||
          WINDOWS_SHELLS.has(
            basename(literal.text)
              .toLowerCase()
              .replace(/\.exe$/, ''),
          )),
    )
  );
}

function innermostOpeners(masked: string): number[] {
  const open: number[] = [];
  return masked.split('').map((char, index) => {
    const innermost = open.at(-1) ?? -1;
    if (char in BRACKET_CLOSERS) open.push(index);
    if (char === ')' || char === ']' || char === '}') open.pop();
    return innermost;
  });
}

function inDataPosition(
  masked: string,
  literal: CodeLiteral,
  openers: readonly number[],
  sequencesMayHoldArguments: boolean,
): boolean {
  const opener = openers[literal.tokenStart] ?? -1;
  const bracket = masked[opener] ?? '';
  const before = previousNonWhitespaceIndex(masked, literal.tokenStart);
  const after = nextNonWhitespaceIndex(masked, literal.tokenEnd);
  if (/(?:^|[^\w$])in$|[=!]=$/.test(masked.slice(Math.max(0, before - 3), before + 1))) {
    return true;
  }
  if (/^(?:(?:not\s+)?in(?![\w$])|[=!]=)/.test(masked.slice(after, after + 8))) return true;
  if (sequencesMayHoldArguments && (bracket === '[' || bracket === '(')) return false;
  const previous = masked[before];
  const next = masked[after];
  if (bracket === '{' && previous === ':') return startsObjectEntry(masked, before);
  const element =
    (previous === bracket || previous === ',') &&
    (next === ',' || next === BRACKET_CLOSERS[bracket] || (bracket === '{' && next === ':'));
  if (bracket !== '(') return element && bracket !== '';
  return element && (previous === ',' || next === ',') && isGroupingParenthesis(masked, opener);
}

const PATH_CONSTRUCTOR_CALL = /(?:^|[^\w$.])(?:pathlib\s*\.\s*)?Path\s*$/;
const PATH_WRITE_METHOD = /^\s*\.\s*write_(?:text|bytes)\s*\(/;
const BARE_OPEN_CALL = /(?:^|[^\w$.])open\s*$/;
const WRITE_ONLY_OPEN_MODE = /^[bt]*[awx][abtwx]*$/;
const WRITE_FIRST_ARGUMENT_CALL =
  /(?:^|[^\w$])(?:writeFile|writeFileSync|appendFile|appendFileSync|Bun\s*\.\s*write)\s*$/;

function feedsOnlyWrite(
  masked: Extract<MaskedCode, { kind: 'masked' }>,
  literal: CodeLiteral,
  openers: readonly number[],
): boolean {
  const opener = openers[literal.tokenStart] ?? -1;
  if (masked.masked[opener] !== '(') return false;
  const previous = previousNonWhitespaceIndex(masked.masked, literal.tokenStart);
  const after = nextNonWhitespaceIndex(masked.masked, literal.tokenEnd);
  const next = masked.masked[after];
  const callee = masked.masked.slice(Math.max(0, opener - 40), opener);
  if (PATH_CONSTRUCTOR_CALL.test(callee)) {
    return (
      (previous === opener || masked.masked[previous] === ',') &&
      (next === ',' || next === ')') &&
      !masked.literals.some(
        (other) => other.tokenStart > opener && other.tokenStart < literal.tokenStart,
      ) &&
      PATH_WRITE_METHOD.test(masked.masked.slice(closingParenthesis(masked.masked, opener + 1) + 1))
    );
  }
  if (previous !== opener || next !== ',') return false;
  if (WRITE_FIRST_ARGUMENT_CALL.test(callee)) return true;
  if (!BARE_OPEN_CALL.test(callee)) return false;
  const mode = masked.literals.find((candidate) =>
    /^,\s*(?:mode\s*=\s*)?$/.test(masked.masked.slice(after, candidate.tokenStart)),
  );
  return (
    mode !== undefined &&
    WRITE_ONLY_OPEN_MODE.test(mode.text) &&
    /^[,)]/.test(masked.masked.slice(nextNonWhitespaceIndex(masked.masked, mode.tokenEnd)))
  );
}

function startsObjectEntry(masked: string, colon: number): boolean {
  const keyEnd = previousNonWhitespaceIndex(masked, colon);
  const key = /[\w$]*$/.exec(masked.slice(Math.max(0, keyEnd - 63), keyEnd + 1))?.[0] ?? '';
  const entryStart = masked[previousNonWhitespaceIndex(masked, keyEnd + 1 - key.length)];
  return entryStart === '{' || entryStart === ',';
}

function isGroupingParenthesis(masked: string, opener: number): boolean {
  const before = previousNonWhitespaceIndex(masked, opener);
  const preceding = masked.slice(Math.max(0, before - 7), before + 1);
  return !/[\w$)\]]$/.test(preceding) || GROUPING_KEYWORD.test(preceding);
}

function literalFamily(command: string): LiteralFamily {
  const normalized = normalizeInterpreterName(command);
  if (normalized === 'python') return 'python';
  if (normalized === 'osascript') return 'opaque';
  return normalized === 'node' || normalized === 'bun' || normalized === 'deno'
    ? 'javascript'
    : 'simple';
}

const HOLE_UNREADABLE_CHARACTER: Partial<Record<LiteralFamily, string>> = {
  python: '#',
  javascript: '/',
};

function maskStringLiterals(code: string, family: LiteralFamily): MaskedCode {
  if (family === 'opaque') return { kind: 'unmaskable' };
  const scan: LiteralScan = { masked: code.split(''), literals: [] };
  return maskCode(code, 0, family, scan, false) === null
    ? { kind: 'unmaskable' }
    : { kind: 'masked', masked: scan.masked.join(''), literals: scan.literals };
}

function maskCode(
  code: string,
  from: number,
  family: LiteralFamily,
  scan: LiteralScan,
  insideHole: boolean,
): number | null {
  let openBraces = 0;
  for (let index = from; index < code.length; index++) {
    const char = code[index] ?? '';
    if (insideHole && char === '}' && openBraces === 0) return index;
    if (insideHole && char === HOLE_UNREADABLE_CHARACTER[family]) return null;
    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
    if (family === 'simple' && (char === '`' || char === '%' || char === '<')) {
      if (UNMASKABLE_SIMPLE_CODE.test(code.slice(index))) return null;
    }
    const quote =
      char === "'" || char === '"' || (family === 'javascript' && char === '`') ? char : null;
    if (quote === null) continue;
    if (quote === '`' && isTaggedTemplate(code, index)) return null;

    const prefix = family === 'python' ? pythonStringPrefix(code, index) : '';
    const delimiter =
      family === 'python' && code.startsWith(quote.repeat(3), index) ? quote.repeat(3) : quote;
    const start = index + delimiter.length;
    const interpolated = quote === '`' || /[fF]/.test(prefix);
    const tokenStart = index - prefix.length;
    const end = interpolated
      ? maskInterpolatedLiteral(code, tokenStart, start, delimiter, family, scan)
      : findLiteralEnd(code, start, delimiter);
    if (end === null) return null;
    if (!interpolated) {
      const text = code.slice(start, end);
      if (family === 'simple' && quote === '"' && SIMPLE_INTERPOLATION.test(text)) return null;
      scan.literals.push({ start, text, tokenStart, tokenEnd: end + delimiter.length });
      scan.masked.fill(' ', start, end);
    }
    scan.masked.fill(' ', index, start);
    scan.masked.fill(' ', end, end + delimiter.length);
    index = end + delimiter.length - 1;
  }
  return insideHole ? null : code.length;
}

function maskInterpolatedLiteral(
  code: string,
  tokenStart: number,
  start: number,
  delimiter: string,
  family: LiteralFamily,
  scan: LiteralScan,
): number | null {
  const holeOpener = family === 'python' ? '{' : '${';
  const multiline = delimiter === '`' || delimiter.length === 3;
  let text = '';
  for (let cursor = start; cursor < code.length; cursor++) {
    const char = code[cursor] ?? '';
    if (code.startsWith(delimiter, cursor)) {
      scan.literals.push({ start, text, tokenStart, tokenEnd: cursor + delimiter.length });
      return cursor;
    }
    if (!multiline && (char === '\n' || char === '\r')) return null;
    const pythonDoubledBrace =
      family === 'python' && (char === '{' || char === '}') && code[cursor + 1] === char;
    if (!pythonDoubledBrace && code.startsWith(holeOpener, cursor)) {
      const holeEnd = maskCode(code, cursor + holeOpener.length, family, scan, true);
      if (holeEnd === null) return null;
      text += `${holeOpener}}`;
      scan.masked.fill(' ', cursor, cursor + holeOpener.length);
      scan.masked[holeEnd] = ' ';
      cursor = holeEnd;
      continue;
    }
    const escapesNext = char === '\\' && !(family === 'python' && code[cursor + 1] === '{');
    const width = escapesNext || pythonDoubledBrace ? 2 : 1;
    text += code.slice(cursor, cursor + width);
    scan.masked.fill(' ', cursor, cursor + width);
    cursor += width - 1;
  }
  return null;
}

function pythonStringPrefix(code: string, index: number): string {
  return PYTHON_STRING_PREFIX.exec(code.slice(Math.max(0, index - 3), index))?.[1] ?? '';
}

function findLiteralEnd(code: string, start: number, delimiter: string): number | null {
  const multiline = delimiter.length === 3;
  for (let cursor = start; cursor < code.length; cursor++) {
    const char = code[cursor];
    if (char === '\\') {
      cursor++;
      continue;
    }
    if (!multiline && (char === '\n' || char === '\r')) return null;
    if (code.startsWith(delimiter, cursor)) return cursor;
  }
  return null;
}

function isTaggedTemplate(code: string, index: number): boolean {
  for (let cursor = index - 1; cursor >= 0; cursor--) {
    const char = code[cursor];
    if (!char || /\s/.test(char)) continue;
    return /[\w$\])]/.test(char);
  }
  return false;
}

function containsRecognizableInlineAccess(code: string): boolean {
  for (const match of code.matchAll(/[A-Za-z_$][A-Za-z0-9_$]*/g)) {
    const identifier = match[0];
    const start = match.index;
    if (INLINE_ACCESS_NAMESPACES.has(identifier.toLowerCase())) return true;
    const parts = identifierParts(identifier);
    if (!parts.some((part) => INLINE_ACCESS_IDENTIFIER_PARTS.has(part))) continue;
    if (parts.length > 1) return true;
    if (code[previousNonWhitespaceIndex(code, start)] === '.') return true;
    if (code[nextNonWhitespaceIndex(code, start + identifier.length)] === '(') return true;
  }
  return false;
}

function identifierParts(identifier: string): string[] {
  return identifier
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[_$\s]+/)
    .map((part) => part.toLowerCase());
}

function previousNonWhitespaceIndex(value: string, start: number): number {
  for (let index = start - 1; index >= 0; index--) {
    if (!/\s/.test(value[index] ?? '')) return index;
  }
  return -1;
}

function nextNonWhitespaceIndex(value: string, start: number): number {
  for (let index = start; index < value.length; index++) {
    if (!/\s/.test(value[index] ?? '')) return index;
  }
  return value.length;
}

function extractCommandSubstitutionPathTargets(
  command: string,
  store: SemanticFactStore,
  options: PathExtractionOptions,
  environment: EnvironmentContext,
  cwd: string,
  budget: Budget,
): SecretCandidate[] {
  return extractCommandSubstitutionBodies(command).flatMap((body) => {
    const syntax = store.getShellSyntax(body);

    if (syntax.status === 'invalid') return [];
    return [
      ...extractCommandPathTargets(
        syntax,
        store,
        { ...options, displayOperandsAreCapturedOutput: true },
        environment,
        cwd,
        budget,
      ),
      ...(commandSubstitutionDecodesBase64(syntax, environment)
        ? extractBase64DecodedPathCandidates(syntax, environment).map((target) => ({ target, cwd }))
        : []),
    ];
  });
}

function commandSubstitutionDecodesBase64(
  syntax: GuardSyntax,
  environment: EnvironmentContext,
): boolean {
  const tokens = readGuardTokens(syntax);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (
      token?.kind !== 'word' ||
      basename(projectSensitiveShellText(token.text, environment)).toLowerCase() !== 'base64'
    ) {
      continue;
    }
    for (let j = i + 1; j < tokens.length; j++) {
      const candidate = tokens[j];
      if (candidate?.kind === 'operator') break;
      if (candidate?.kind !== 'word') continue;
      const flag = projectSensitiveShellText(candidate.text, environment);
      if (
        flag === '--decode' ||
        (!flag.startsWith('--') && flag.startsWith('-') && /[dD]/.test(flag))
      ) {
        return true;
      }
    }
  }
  return false;
}

function extractBase64DecodedPathCandidates(
  syntax: GuardSyntax,
  environment: EnvironmentContext,
): string[] {
  return readGuardTokens(syntax)
    .flatMap((token) =>
      token.kind === 'word'
        ? [projectSensitiveShellText(token.text, environment)]
        : token.kind === 'redirection' && token.target
          ? [projectSensitiveShellText(token.target, environment)]
          : [],
    )
    .flatMap(decodeBase64PathCandidate);
}

function decodeBase64PathCandidate(token: string): string[] {
  const normalized = normalizeBase64Token(token);
  if (normalized === null) return [];
  const decoded = Buffer.from(normalized, 'base64').toString('utf8');
  if (decoded === '' || hasControlCharacter(decoded)) return [];
  const canonical = Buffer.from(decoded, 'utf8').toString('base64').replace(/=+$/g, '');
  return canonical === normalized.replace(/=+$/g, '') ? [decoded] : [];
}

function hasControlCharacter(value: string): boolean {
  return Array.from(value).some((char) => {
    const code = char.charCodeAt(0);
    return code < 32 || code === 127;
  });
}

function normalizeBase64Token(token: string): string | null {
  if (token.length < 8 || !/^[A-Za-z0-9+/_-]+={0,2}$/.test(token)) return null;
  if (/=/.test(token.replace(/=+$/g, ''))) return null;
  const unpadded = token.replace(/=+$/g, '');
  if (unpadded.length % 4 === 1) return null;
  return `${unpadded.replace(/-/g, '+').replace(/_/g, '/')}${'='.repeat(
    (4 - (unpadded.length % 4)) % 4,
  )}`;
}

function extractCommandSubstitutionBodies(command: string): string[] {
  const bodies: string[] = [];
  const quoteState = { inSingle: false, inDouble: false, escaped: false };
  for (let i = 0; i < command.length; i++) {
    const char = command[i];
    if (!char) break;
    if (advanceQuoteScanState(char, quoteState)) continue;
    if (startsCommandSubstitution(command, i, quoteState)) {
      const substitution = readCommandSubstitutionBody(command, i + 1);
      if (substitution !== null) {
        bodies.push(substitution.body);
        i = substitution.endIndex;
      }
      continue;
    }
    if (!quoteState.inSingle && char === '`') {
      const substitution = readBacktickCommandSubstitutionBody(command, i);
      if (substitution !== null) {
        bodies.push(substitution.body);
        i = substitution.endIndex;
      }
    }
  }
  return bodies;
}

function readCommandSubstitutionBody(
  command: string,
  startIndex: number,
): { body: string; endIndex: number } | null {
  const quoteState = { inSingle: false, inDouble: false, escaped: false };
  let depth = 1;
  for (let i = startIndex + 1; i < command.length; i++) {
    const char = command[i];
    if (!char) break;
    if (advanceQuoteScanState(char, quoteState)) continue;
    if (startsCommandSubstitution(command, i, quoteState)) {
      depth++;
      i++;
      continue;
    }
    if (!quoteState.inSingle && !quoteState.inDouble && char === ')') {
      depth--;
      if (depth === 0) {
        return { body: command.slice(startIndex + 1, i), endIndex: i };
      }
    }
  }
  return null;
}

function readBacktickCommandSubstitutionBody(
  command: string,
  startIndex: number,
): { body: string; endIndex: number } | null {
  let escaped = false;
  for (let i = startIndex + 1; i < command.length; i++) {
    const char = command[i];
    if (!char) break;
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (char === '`') {
      return { body: command.slice(startIndex + 1, i), endIndex: i };
    }
  }
  return null;
}

function startsCommandSubstitution(
  command: string,
  index: number,
  state: { inSingle: boolean },
): boolean {
  return (
    !state.inSingle &&
    command[index] === '$' &&
    command[index + 1] === '(' &&
    command[index + 2] !== '('
  );
}

function extractPatternCommandTargets(tokens: readonly string[]): string[] {
  const optionFileTargets: string[] = [];
  const positionals: string[] = [];
  let patternFromOption = false;
  let patternlessMode = false;
  let afterDashDash = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === undefined) break;

    if (!afterDashDash && token === '--') {
      afterDashDash = true;
      continue;
    }
    if (afterDashDash) {
      positionals.push(token);
      continue;
    }

    const longOption = /^--([^=]+)(?:=(.*))?$/.exec(token);
    if (longOption !== null) {
      const name = longOption[1] ?? '';
      const inlineValue = longOption[2];
      if (name === PATTERNLESS_FILES_LONG) patternlessMode = true;
      if (PATTERN_SUPPLY_LONG.has(name)) patternFromOption = true;
      if (inlineValue !== undefined) {
        if (name === PATTERN_FILE_LONG) optionFileTargets.push(inlineValue);
        continue;
      }
      if (PATTERN_ARG_LONG.has(name)) {
        const next = tokens[i + 1];
        if (name === PATTERN_FILE_LONG && next !== undefined) optionFileTargets.push(next);
        i++;
      }
      continue;
    }

    if (token.startsWith('-') && token.length > 1) {
      const flags = token.slice(1);
      let consumerChar = '';
      let consumerInline = '';
      for (let j = 0; j < flags.length; j++) {
        const flag = flags[j] ?? '';
        if (PATTERN_SUPPLY_SHORT.has(flag)) patternFromOption = true;
        if (PATTERN_ARG_SHORT.has(flag)) {
          consumerChar = flag;
          consumerInline = flags.slice(j + 1);
          break;
        }
      }
      if (consumerChar === '') continue;
      if (consumerInline.length > 0) {
        if (consumerChar === PATTERN_FILE_SHORT) optionFileTargets.push(consumerInline);
        continue;
      }
      const next = tokens[i + 1];
      if (consumerChar === PATTERN_FILE_SHORT && next !== undefined) {
        optionFileTargets.push(next);
      }
      i++;
      continue;
    }

    positionals.push(token);
  }

  const dropFirstPositional = !patternFromOption && !patternlessMode;
  const positionalFiles = dropFirstPositional ? positionals.slice(1) : positionals;
  return [...optionFileTargets, ...positionalFiles];
}

function stripLeadingWrappersAndEnvAssignments(tokens: readonly string[]): string[] {
  const firstCommandIndex = tokens.findIndex(
    (token) => !isWrapperToken(token) && !/^[A-Za-z_][A-Za-z0-9_]*=.*/.test(token),
  );
  return firstCommandIndex === -1 ? [] : tokens.slice(firstCommandIndex);
}

function isWrapperToken(token: string): boolean {
  return token === 'env' || token === 'command' || token === 'builtin' || token === 'sudo';
}

const PUBLIC_KEY_BASENAMES = new Set(['id_rsa.pub', 'id_ed25519.pub', 'id_ecdsa.pub']);

const ENV_PREFIX = '.env.';

const ENV_EXEMPTION_BASENAMES = new Set([
  '.env.example',
  '.env.sample',
  '.env.template',
  '.env.tpl',
  '.env.defaults',
]);

const ENV_EXEMPTION_PREFIXES = ['.env.example.', '.env.sample.'];

function isRemoteUrl(target: string): boolean {
  let url: URL;
  try {
    url = new URL(target.trim());
  } catch {
    return false;
  }
  return url.protocol !== 'file:' && url.host !== '';
}

function isFilenameShaped(name: string): boolean {
  return name.length > 0 && !/\s/.test(name);
}

function candidateExistsOnDisk(
  target: string,
  cwd: string,
  environment: EnvironmentContext,
  budget: Budget,
): boolean {
  const absolute = candidateAbsolutePath(target, cwd, environment, budget);
  return absolute !== '' && environment.paths.entryKind(absolute) !== 'missing';
}

function candidateAbsolutePath(
  target: string,
  cwd: string,
  environment: EnvironmentContext,
  budget: Budget,
): string {
  try {
    return normalizeAbsoluteCandidatePath(target, cwd, environment, budget);
  } catch (error) {
    if (error instanceof AnalysisLimit) throw error;
    return '';
  }
}

const QUERY_PARAMETER = /[?&][^?&=/]+=/;

const SKIPPABLE_PATH_SEGMENTS = new Set(['node_modules', '__pycache__']);

const SKIPPABLE_PATH_SEGMENT_PAIRS = [
  ['vendor', 'bundle'],
  ['vendor', 'cache'],
];

function isSensitivePath(
  target: string,
  cwd: string,
  config: SecretProtectionPolicy | undefined,
  environment: EnvironmentContext,
  budget: Budget,
): string | null {
  if (isRemoteUrl(target)) {
    return null;
  }

  const normalized = normalizeCandidatePath(target, cwd, environment, budget);
  if (!normalized) {
    return null;
  }

  const comparableName = comparable(normalized.split('/').pop() ?? '');
  const comparablePath = comparable(normalized);

  const isFilenameShapedName = () =>
    isFilenameShaped(comparableName) || candidateExistsOnDisk(target, cwd, environment, budget);

  const comparableUnresolvedPath = comparable(
    normalizeUnresolvedHomePath(target, cwd, environment, budget),
  );
  for (const rule of SECRET_HOME_PATH_RULES) {
    const prefix = `~/${rule.suffixParts.join('/')}`;
    if (
      (isSameOrChildHomePath(comparablePath, prefix) ||
        isSameOrChildHomePath(comparableUnresolvedPath, prefix)) &&
      isSecretRuleEnabled(rule.id, config)
    ) {
      return rule.id;
    }
  }

  if (
    ENV_EXEMPTION_BASENAMES.has(comparableName) ||
    ENV_EXEMPTION_PREFIXES.some((prefix) => comparableName.startsWith(prefix))
  ) {
    return null;
  }

  const codingCliRuleId = matchesCodingCliPath(normalized, cwd, config, environment, budget);
  if (codingCliRuleId) return codingCliRuleId;

  if (PUBLIC_KEY_BASENAMES.has(comparableName)) return null;
  for (const rule of SECRET_BASENAME_RULES) {
    if (comparableName === rule.basename && isSecretRuleEnabled(rule.id, config)) return rule.id;
  }
  if (
    comparableName.startsWith(ENV_PREFIX) &&
    isSecretRuleEnabled(SECRET_ENV_VARIANT_RULE.id, config) &&
    isFilenameShapedName()
  ) {
    return SECRET_ENV_VARIANT_RULE.id;
  }

  for (const rule of SECRET_VARIANT_SEPARATOR_RULES) {
    if (comparableName.length > rule.prefix.length && comparableName.startsWith(rule.prefix)) {
      const next = comparableName.slice(rule.prefix.length)[0];
      if (
        (next === '-' || next === '_') &&
        isSecretRuleEnabled(rule.id, config) &&
        isFilenameShapedName()
      ) {
        return rule.id;
      }
    }
  }
  for (const rule of SECRET_VARIANT_DOT_SUFFIX_RULES) {
    if (comparableName.length > rule.prefix.length && comparableName.startsWith(rule.prefix)) {
      if (
        comparableName.slice(rule.prefix.length) === rule.suffix &&
        isSecretRuleEnabled(rule.id, config)
      ) {
        return rule.id;
      }
    }
  }

  if (isSkippablePathForBroadSignatures(comparablePath)) return null;
  if (
    !comparableName.includes('.') &&
    SECRET_BROAD_SSH_KEY_BASENAME_RULE.pattern.test(comparableName) &&
    isSecretRuleEnabled(SECRET_BROAD_SSH_KEY_BASENAME_RULE.id, config)
  ) {
    return SECRET_BROAD_SSH_KEY_BASENAME_RULE.id;
  }
  if (QUERY_PARAMETER.test(target) && !candidateExistsOnDisk(target, cwd, environment, budget)) {
    return null;
  }
  const extensionRuleId = hasSensitiveExtension(comparableName, config);
  if (extensionRuleId) return extensionRuleId;

  return null;
}

function matchesCodingCliPath(
  normalized: string,
  cwd: string,
  config: SecretProtectionPolicy | undefined,
  environment: EnvironmentContext,
  budget: Budget,
): string | null {
  return (
    SECRET_CODING_CLI_RULES.find((rule) => {
      if (!isSecretRuleEnabled(rule.id, config)) return false;
      switch (rule.id) {
        case 'secret.cli.claude-code':
          return matchesFileInRoot(
            normalized,
            codingCliRoot(
              environment.env.get('CLAUDE_CONFIG_DIR'),
              '~/.claude',
              cwd,
              environment,
              budget,
            ),
            ['.credentials.json'],
          );
        case 'secret.cli.claude-code.config': {
          const segments = comparable(normalized).split('/');
          return (
            matchesFileInRoot(
              normalized,
              codingCliRoot(
                environment.env.get('CLAUDE_CONFIG_DIR'),
                '~/.claude',
                cwd,
                environment,
                budget,
              ),
              ['settings.json', 'settings.local.json'],
            ) ||
            matchesExactPath(normalized, '~/.claude.json', cwd, environment, budget) ||
            (segments.at(-1) === 'settings.local.json' && segments.at(-2) === '.claude') ||
            segments.at(-1) === '.mcp.json'
          );
        }
        case 'secret.cli.antigravity':
          return matchesFileInRoot(
            normalized,
            normalizeCandidatePath('~/.gemini/config', cwd, environment, budget),
            ['hooks.json', 'mcp_config.json'],
          );
        case 'secret.cli.codex': {
          const root = codingCliRoot(
            environment.env.get('CODEX_HOME'),
            '~/.codex',
            cwd,
            environment,
            budget,
          );
          return (
            matchesFileInRoot(normalized, root, ['auth.json', '.credentials.json']) ||
            matchesDirInRoot(normalized, root, ['secrets', '.sandbox-secrets'])
          );
        }
        case 'secret.cli.codex.config': {
          const root = codingCliRoot(
            environment.env.get('CODEX_HOME'),
            '~/.codex',
            cwd,
            environment,
            budget,
          );
          const name = comparable(normalized).split('/').at(-1) ?? '';
          return (
            matchesFileInRoot(normalized, root, ['config.toml']) ||
            (name.endsWith('.config.toml') && matchesFileInRoot(normalized, root, [name]))
          );
        }
        case 'secret.cli.gemini':
          return matchesFileInRoot(
            normalized,
            appendPath(
              codingCliRoot(environment.env.get('GEMINI_CLI_HOME'), '~', cwd, environment, budget),
              '.gemini',
            ),
            [
              'oauth_creds.json',
              'mcp-oauth-tokens.json',
              'a2a-oauth-tokens.json',
              'gemini-credentials.json',
            ],
          );
        case 'secret.cli.gemini.config': {
          const segments = comparable(normalized).split('/');
          const systemSettingsPath = environment.env.get('GEMINI_CLI_SYSTEM_SETTINGS_PATH');
          const programDataConfig = environment.env.get('ProgramData')
            ? [
                appendPath(
                  codingCliRoot(environment.env.get('ProgramData'), '', cwd, environment, budget),
                  'gemini-cli',
                ),
              ]
            : [];
          return (
            matchesFileInRoot(
              normalized,
              appendPath(
                codingCliRoot(
                  environment.env.get('GEMINI_CLI_HOME'),
                  '~',
                  cwd,
                  environment,
                  budget,
                ),
                '.gemini',
              ),
              ['settings.json', 'google_accounts.json'],
            ) ||
            (segments.at(-1) === 'settings.json' && segments.at(-2) === '.gemini') ||
            (systemSettingsPath?.trim()
              ? matchesExactPath(normalized, systemSettingsPath, cwd, environment, budget)
              : false) ||
            [
              '/Library/Application Support/GeminiCli',
              '/etc/gemini-cli',
              ...programDataConfig,
            ].some((root) =>
              matchesFileInRoot(
                normalized,
                normalizeCandidatePath(root, cwd, environment, budget),
                ['settings.json'],
              ),
            )
          );
        }
        case 'secret.cli.copilot-cli': {
          const root = codingCliRoot(
            environment.env.get('COPILOT_HOME'),
            '~/.copilot',
            cwd,
            environment,
            budget,
          );
          return (
            matchesFileInRoot(normalized, root, ['config.json']) ||
            matchesDirInRoot(normalized, root, ['mcp-oauth-config', 'mcp-secrets'])
          );
        }
        case 'secret.cli.copilot-cli.config':
          return matchesFileInRoot(
            normalized,
            codingCliRoot(
              environment.env.get('COPILOT_HOME'),
              '~/.copilot',
              cwd,
              environment,
              budget,
            ),
            ['mcp-config.json'],
          );
        case 'secret.cli.kimi-code': {
          const currentRoot = codingCliRoot(
            environment.env.get('KIMI_CODE_HOME'),
            '~/.kimi-code',
            cwd,
            environment,
            budget,
          );
          const legacyRoot = codingCliRoot(
            environment.env.get('KIMI_SHARE_DIR'),
            '~/.kimi',
            cwd,
            environment,
            budget,
          );
          return (
            matchesFileInRoot(normalized, currentRoot, ['server.token']) ||
            matchesDirInRoot(normalized, currentRoot, ['credentials']) ||
            matchesDirInRoot(normalized, legacyRoot, ['credentials', 'mcp-oauth'])
          );
        }
        case 'secret.cli.kimi-code.config': {
          const configFiles = ['config.toml', 'mcp.json'];
          const segments = comparable(normalized).split('/');
          return (
            (segments.at(-1) === 'mcp.json' && segments.at(-2) === '.kimi-code') ||
            matchesFileInRoot(
              normalized,
              codingCliRoot(
                environment.env.get('KIMI_CODE_HOME'),
                '~/.kimi-code',
                cwd,
                environment,
                budget,
              ),
              configFiles,
            ) ||
            matchesFileInRoot(
              normalized,
              codingCliRoot(
                environment.env.get('KIMI_SHARE_DIR'),
                '~/.kimi',
                cwd,
                environment,
                budget,
              ),

              [...configFiles, 'config.json', 'config.json.bak'],
            )
          );
        }
        case 'secret.cli.opencode': {
          const dataRoot = appendPath(
            codingCliRoot(
              environment.env.get('XDG_DATA_HOME'),
              '~/.local/share',
              cwd,
              environment,
              budget,
            ),
            'opencode',
          );

          const databaseName = comparable(normalized).split('/').at(-1) ?? '';
          const databaseEnv = environment.env.get('OPENCODE_DB')?.trim();
          const databaseEnvPaths =
            databaseEnv && databaseEnv !== ':memory:'
              ? [databaseEnv, `${databaseEnv}-wal`, `${databaseEnv}-shm`]
              : [];
          return (
            matchesFileInRoot(normalized, dataRoot, ['auth.json', 'mcp-auth.json']) ||
            (/^opencode(-.+)?\.db(-wal|-shm)?$/.test(databaseName) &&
              matchesFileInRoot(normalized, dataRoot, [databaseName])) ||
            databaseEnvPaths.some((path) =>
              matchesExactPath(normalized, path, cwd, environment, budget),
            )
          );
        }
        case 'secret.cli.opencode.config': {
          const xdgConfigRoot = appendPath(
            codingCliRoot(
              environment.env.get('XDG_CONFIG_HOME'),
              '~/.config',
              cwd,
              environment,
              budget,
            ),
            'opencode',
          );
          const programDataConfig = environment.env.get('ProgramData')
            ? [
                appendPath(
                  codingCliRoot(environment.env.get('ProgramData'), '', cwd, environment, budget),
                  'opencode',
                ),
              ]
            : [];

          const configNames = ['opencode.json', 'opencode.jsonc'];
          const opencodeConfig = environment.env.get('OPENCODE_CONFIG');
          return (
            configNames.includes(comparable(normalized).split('/').at(-1) ?? '') ||
            matchesFileInRoot(normalized, xdgConfigRoot, ['config.json']) ||
            (opencodeConfig?.trim()
              ? matchesExactPath(normalized, opencodeConfig, cwd, environment, budget)
              : false) ||
            ['/Library/Application Support/opencode', '/etc/opencode', ...programDataConfig].some(
              (root) =>
                matchesFileInRoot(
                  normalized,
                  normalizeCandidatePath(root, cwd, environment, budget),
                  configNames,
                ),
            )
          );
        }
        case 'secret.cli.pi':
          return matchesFileInRoot(
            normalized,
            codingCliRoot(
              environment.env.get('PI_CODING_AGENT_DIR'),
              '~/.pi/agent',
              cwd,
              environment,
              budget,
            ),
            ['auth.json'],
          );
        case 'secret.cli.pi.config':
          return matchesFileInRoot(
            normalized,
            codingCliRoot(
              environment.env.get('PI_CODING_AGENT_DIR'),
              '~/.pi/agent',
              cwd,
              environment,
              budget,
            ),
            ['models.json'],
          );
        case 'secret.cli.amp': {
          const home = normalizeCandidatePath('~', cwd, environment, budget);
          const dataRoots = [
            appendPath(
              codingCliRoot(
                environment.env.get('XDG_DATA_HOME'),
                '~/.local/share',
                cwd,
                environment,
                budget,
              ),
              'amp',
            ),
            appendPath(home, '.local', 'share', 'amp'),
          ];
          return (
            dataRoots.some((root) => matchesFileInRoot(normalized, root, ['secrets.json'])) ||
            matchesDirInRoot(normalized, appendPath(home, '.amp'), ['oauth'])
          );
        }
        case 'secret.cli.amp.config': {
          const settingsNames = ['settings.json', 'settings.jsonc'];
          const configRoots = [
            appendPath(
              codingCliRoot(
                environment.env.get('XDG_CONFIG_HOME'),
                '~/.config',
                cwd,
                environment,
                budget,
              ),
              'amp',
            ),
            appendPath(normalizeCandidatePath('~', cwd, environment, budget), '.config', 'amp'),
          ];
          const segments = comparable(normalized).split('/');
          const ampSettingsFile = environment.env.get('AMP_SETTINGS_FILE');
          return (
            configRoots.some((root) => matchesFileInRoot(normalized, root, settingsNames)) ||
            (segments.at(-2) === '.amp' && settingsNames.includes(segments.at(-1) ?? '')) ||
            (ampSettingsFile?.trim()
              ? matchesExactPath(normalized, ampSettingsFile, cwd, environment, budget)
              : false)
          );
        }
        case 'secret.cli.cursor': {
          const configRoot = appendPath(
            codingCliRoot(
              environment.env.get('XDG_CONFIG_HOME'),
              '~/.config',
              cwd,
              environment,
              budget,
            ),
            'cursor',
          );
          const projectsRoot = appendPath(
            codingCliRoot(
              environment.env.get('CURSOR_DATA_DIR'),
              '~/.cursor',
              cwd,
              environment,
              budget,
            ),
            'projects',
          );
          return (
            matchesFileInRoot(
              normalized,
              normalizeCandidatePath('~/.cursor', cwd, environment, budget),
              ['auth.json'],
            ) ||
            matchesFileInRoot(normalized, configRoot, ['auth.json']) ||
            (comparable(normalized).split('/').at(-1) === 'mcp-auth.json' &&
              isSameOrChildPath(comparable(normalized), comparable(projectsRoot)))
          );
        }
        case 'secret.cli.cursor.config': {
          const segments = comparable(normalized).split('/');
          return segments.at(-1) === 'mcp.json' && segments.at(-2) === '.cursor';
        }
        case 'secret.cli.grok-build':
          return matchesFileInRoot(
            normalized,
            codingCliRoot(environment.env.get('GROK_HOME'), '~/.grok', cwd, environment, budget),
            ['auth.json', 'mcp_credentials.json'],
          );
        case 'secret.cli.grok-build.config': {
          const segments = comparable(normalized).split('/');
          return (
            (segments.at(-1) === 'config.toml' && segments.at(-2) === '.grok') ||
            matchesFileInRoot(
              normalized,
              codingCliRoot(environment.env.get('GROK_HOME'), '~/.grok', cwd, environment, budget),
              ['config.toml', 'managed_config.toml', 'requirements.toml'],
            ) ||
            matchesFileInRoot(
              normalized,
              normalizeCandidatePath('/etc/grok', cwd, environment, budget),
              ['managed_config.toml', 'requirements.toml'],
            )
          );
        }
        case 'secret.cli.droid':
          return matchesFileInRoot(
            normalized,
            normalizeCandidatePath('~/.factory', cwd, environment, budget),
            ['auth.encrypted', 'auth.v2.file', 'auth.v2.key', 'auth.v2.loginkeychain'],
          );
        case 'secret.cli.droid.config': {
          const segments = comparable(normalized).split('/');
          return (
            (segments.at(-1) === 'mcp.json' && segments.at(-2) === '.factory') ||
            matchesFileInRoot(
              normalized,
              normalizeCandidatePath('~/.factory', cwd, environment, budget),
              ['settings.json', 'hooks.json'],
            )
          );
        }
        case 'secret.cli.devin':
          return [
            codingCliRoot(
              environment.env.get('XDG_DATA_HOME'),
              '~/.local/share',
              cwd,
              environment,
              budget,
            ),
            normalizeCandidatePath('~/.local/share', cwd, environment, budget),
          ].some(
            (dataHome) =>
              matchesFileInRoot(normalized, appendPath(dataHome, 'devin'), ['credentials.toml']) ||
              matchesDirInRoot(normalized, appendPath(dataHome, 'devin', 'mcp'), ['oauth']),
          );
        case 'secret.cli.devin.config':
          return [
            codingCliRoot(
              environment.env.get('XDG_CONFIG_HOME'),
              '~/.config',
              cwd,
              environment,
              budget,
            ),
            normalizeCandidatePath('~/.config', cwd, environment, budget),
          ].some((configHome) =>
            matchesFileInRoot(normalized, appendPath(configHome, 'devin'), ['config.json']),
          );
        default:
          return false;
      }
    })?.id ?? null
  );
}

const codingCliRoots = new WeakMap<Budget, Map<string, string>>();

function codingCliRoot(
  envValue: string | undefined,
  fallback: string,
  cwd: string,
  environment: EnvironmentContext,
  budget: Budget,
): string {
  const roots = codingCliRoots.get(budget) ?? new Map<string, string>();
  codingCliRoots.set(budget, roots);
  const key = `${cwd}\0${envValue ?? ''}\0${fallback}`;
  const cached = roots.get(key);
  if (cached !== undefined) return cached;
  const root = normalizeCandidatePath(
    envValue?.trim() ? envValue : fallback,
    cwd,
    environment,
    budget,
  );
  roots.set(key, root);
  return root;
}

function matchesFileInRoot(normalized: string, root: string, files: readonly string[]): boolean {
  return files.some((file) => sameComparablePath(normalized, appendPath(root, file)));
}

function matchesDirInRoot(normalized: string, root: string, dirs: readonly string[]): boolean {
  return dirs.some((dir) =>
    isSameOrChildPath(comparable(normalized), comparable(appendPath(root, dir))),
  );
}

function matchesExactPath(
  normalized: string,
  path: string,
  cwd: string,
  environment: EnvironmentContext,
  budget: Budget,
): boolean {
  return sameComparablePath(normalized, normalizeCandidatePath(path, cwd, environment, budget));
}

function sameComparablePath(a: string, b: string): boolean {
  return comparable(a) === comparable(b);
}

function appendPath(root: string, ...parts: readonly string[]): string {
  return normalizePathText([root, ...parts].filter(Boolean).join('/'));
}

function matchesPolicyPath(
  target: string,
  cwd: string,
  paths: readonly string[],
  configCwd: string,
  environment: EnvironmentContext,
  budget: Budget,
): boolean {
  if (paths.length === 0) return false;
  const normalized = comparable(normalizeAbsoluteCandidatePath(target, cwd, environment, budget));
  return paths.some((path) =>
    isSameOrChildPath(
      normalized,
      comparable(normalizeAbsoluteCandidatePath(path, configCwd, environment, budget)),
    ),
  );
}

function matchesAllowedPath(
  target: string,
  cwd: string,
  allowPaths: readonly string[],
  configCwd: string,
  environment: EnvironmentContext,
  budget: Budget,
): boolean {
  if (allowPaths.length === 0) return false;
  const normalized = comparable(normalizeAbsoluteCandidatePath(target, cwd, environment, budget));
  if (!normalized) return false;
  const homeValue = environment.env.get('HOME') ?? environment.home;
  const resolvedHome = homeValue
    ? normalizePathText(
        resolveExistingPath(normalizeMsysDrivePath(homeValue), environment.paths, budget),
      )
    : '';
  const home = comparable(resolvedHome);
  const guardHomeValue = environment.env.get('CC_SAFETY_NET_HOME');

  const guardRoot = comparable(
    guardHomeValue
      ? normalizePathText(
          resolveExistingPath(
            resolve(normalizeMsysDrivePath(guardHomeValue)),
            environment.paths,
            budget,
          ),
        )
      : resolvedHome &&
          normalizePathText(
            resolveExistingPath(`${resolvedHome}/.cc-safety-net`, environment.paths, budget),
          ),
  );

  if (guardRoot && isSameOrChildPath(normalized, guardRoot)) return false;
  return allowPaths.some((entry) => {
    const recursive = parseRecursiveSecretAllowPath(entry);
    if (recursive && posix.basename(normalized) !== comparable(recursive.name)) return false;
    const root = comparable(
      normalizeAbsoluteCandidatePath(recursive?.root ?? entry, configCwd, environment, budget),
    );
    if (!root) return false;

    if (home && (home === root || home.startsWith(root.endsWith('/') ? root : `${root}/`))) {
      return false;
    }
    return isSameOrChildPath(normalized, root) && !(recursive && normalized === root);
  });
}

function isSkippablePathForBroadSignatures(comparablePath: string): boolean {
  const parts = comparablePath.split('/');
  return (
    parts.some((part) => SKIPPABLE_PATH_SEGMENTS.has(part)) ||
    SKIPPABLE_PATH_SEGMENT_PAIRS.some(([parent, child]) =>
      parts.some((part, index) => part === parent && parts[index + 1] === child),
    )
  );
}

function hasSensitiveExtension(
  comparableName: string,
  config: SecretProtectionPolicy | undefined,
): string | null {
  const index = comparableName.lastIndexOf('.');
  const extension =
    index > 0 && index < comparableName.length - 1 ? comparableName.slice(index + 1) : '';
  if (extension === '') return null;
  for (const rule of SECRET_EXTENSION_RULES) {
    if (extension === rule.extension && isSecretRuleEnabled(rule.id, config)) return rule.id;
  }
  for (const rule of SECRET_EXTENSION_PATTERN_RULES) {
    if (rule.pattern.test(extension) && isSecretRuleEnabled(rule.id, config)) return rule.id;
  }
  return null;
}

function comparable(value: string): string {
  return value.toLowerCase();
}

function isSecretRuleEnabled(id: string, config: SecretProtectionPolicy | undefined): boolean {
  return !config?.disabledRules?.includes(id);
}

function normalizeCandidatePath(
  target: string,
  cwd: string,
  environment: EnvironmentContext,
  budget: Budget,
): string {
  const { home, normalized } = prepareCandidatePath(target, environment, budget);
  if (!normalized) {
    return '';
  }
  if (!home) {
    return normalized;
  }

  const expanded = expandHomePath(normalized, home);
  const absolute = isAbsolute(expanded) ? expanded : normalizePathText(resolve(cwd, expanded));
  const canonicalAbsolute = normalizePathText(
    resolveExistingPath(absolute, environment.paths, budget),
  );
  if (!isSameOrChildPath(canonicalAbsolute, home)) {
    if (isAbsolute(expanded)) return canonicalAbsolute;
    return canonicalAbsolute === absolute ? normalized : canonicalAbsolute;
  }

  const relativeHomePath = canonicalAbsolute.slice(home.length);
  return relativeHomePath ? `~${relativeHomePath}` : '~';
}

function isSameOrChildHomePath(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
}

function normalizeUnresolvedHomePath(
  target: string,
  cwd: string,
  environment: EnvironmentContext,
  budget: Budget,
): string {
  const { home, normalized } = prepareCandidatePath(target, environment, budget);
  if (!normalized || !home) return '';
  const expanded = expandHomePath(normalized, home);

  const absolute = posix.normalize(
    isAbsolute(expanded) ? expanded : normalizePathText(resolve(cwd, expanded)),
  );

  const literalHome = normalizePathText(
    normalizeMsysDrivePath(environment.env.get('HOME') ?? environment.home),
  );

  const fold = (value: string) => (process.platform === 'win32' ? value.toLowerCase() : value);
  const root = [home, literalHome].find(
    (candidate) => candidate !== '' && isSameOrChildPath(fold(absolute), fold(candidate)),
  );
  if (root === undefined) return '';
  const relativeHomePath = absolute.slice(root.length);
  return relativeHomePath ? `~${relativeHomePath}` : '~';
}

function normalizeAbsoluteCandidatePath(
  target: string,
  cwd: string,
  environment: EnvironmentContext,
  budget: Budget,
): string {
  const { home, normalized } = prepareCandidatePath(target, environment, budget);
  if (!normalized) return '';
  const expanded = home ? expandHomePath(normalized, home) : normalized;
  return normalizePathText(
    resolveExistingPath(
      isAbsolute(expanded) ? expanded : resolve(cwd, expanded),
      environment.paths,
      budget,
    ),
  );
}

function prepareCandidatePath(target: string, environment: EnvironmentContext, budget: Budget) {
  const homeValue = environment.env.get('HOME') ?? environment.home;
  const home = homeValue
    ? normalizePathText(
        resolveExistingPath(normalizeMsysDrivePath(homeValue), environment.paths, budget),
      )
    : '';
  const normalized = normalizePathText(
    normalizeMsysDrivePath(normalizeFileUriPath(projectSensitiveShellText(target, environment))),
  );
  return { home, normalized };
}

function normalizeFileUriPath(value: string): string {
  if (!value.trim().toLowerCase().startsWith('file:')) return value;
  try {
    return fileURLToPath(value);
  } catch {
    return value;
  }
}

function expandHomePath(path: string, home: string): string {
  if (path === '~') return home;
  if (path.startsWith('~/')) return appendPath(home, path.slice(2));
  return path;
}

function usesBackslashSeparators(value: string): boolean {
  if (process.platform === 'win32') return true;
  return win32.parse(value).root.length > 1;
}

function normalizePathText(value: string): string {
  const trimmed = value.trim();

  const normalized = (
    trimmed.includes('\\') && usesBackslashSeparators(trimmed)
      ? trimmed.replace(/\\/g, '/')
      : trimmed
  )
    .replace(/\/{2,}/g, '/')
    .replace(/^\.\//, '');
  if (normalized === '/') {
    return normalized;
  }
  return normalized.replace(/\/+$/g, '');
}

function isSameOrChildPath(path: string, parent: string): boolean {
  return path === parent || path.startsWith(parent.endsWith('/') ? parent : `${parent}/`);
}

function basename(token: string): string {
  return (
    token
      .split(/[\\/]/)
      .pop()
      ?.replace(/\.exe$/i, '') ?? token
  );
}
