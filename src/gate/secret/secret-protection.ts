import { isAbsolute, posix, resolve, win32 } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AnalysisLimit, type Budget, createBudget } from '@/core/budget';
import { normalizeMsysDrivePath, resolveExistingPath } from '@/core/paths/canonicalization';
import type { SecretProtectionConfig } from '@/core/policy/types';
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
import { advanceQuoteScanState, getShellCommandString } from '@/core/shell/tokens';
import type { EnvironmentContext } from '@/gate/analysis';
import { extractAwkSystemCommands } from '@/gate/analyzer/awk';
import { extractXargsChildCommandWithInfo } from '@/gate/analyzer/xargs';
import type { CommandSyntaxFacts, SemanticFactStore, SemanticFacts } from '@/gate/facts';
import {
  ADOPT_AS_OPERAND,
  type GuardSyntax,
  readGuardTokens,
  walkGuardSyntax,
} from '@/gate/guards/guard-walk';
import { safetyNetSubcommandIndex } from '@/gate/guards/safety-net-invocation';
import {
  createSemanticFacts,
  getCommandSyntaxFact,
  projectSensitiveShellText,
  StructuralShellSyntaxLimitError,
} from '@/gate/guards/semantic-facts';
import { createToolInvocation, type ToolRoute } from '@/gate/invocation';

export const REASON_SECRET_PROTECTION = 'Access to a sensitive path is not allowed.';

const NON_PATH_OPERAND_COMMANDS = new Set(['echo', 'printf']);

const PATH_ROOT_COMMANDS = new Set(['find']);
const FIND_EXEC_PRIMARIES = new Set(['-exec', '-execdir']);
const FIND_EXEC_TERMINATORS = new Set([';', '+']);
const FIND_NON_METADATA_ACTIONS = new Set([
  '-delete',
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

const CODE_INTERPRETERS = new Set([
  'python',
  'python2',
  'python3',
  'node',
  'deno',
  'bun',
  'ruby',
  'perl',
  'php',
  'rscript',
  'osascript',
  'bash',
  'sh',
  'zsh',
  'dash',
  'ksh',
]);

const JAVASCRIPT_INLINE_INTERPRETERS = new Set(['node', 'bun']);
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
  'popen',
  'read',
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
const SHELL_STDIN_INTERPRETERS = new Set(['bash', 'sh', 'zsh', 'dash', 'ksh']);
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
};

type SecretProtectionPolicy = {
  readonly disabledRules?: readonly string[];
  readonly denyPaths: readonly string[];
  readonly allowPaths?: readonly string[];
};

type SecretInspectionOptions = {
  readonly strict?: boolean;
};

type PathExtractionOptions = {
  readonly refineJavaScriptInlineData?: boolean;
};

/** @internal */
export function findSensitivePathTarget(
  targets: readonly string[],
  cwd: string,
  environment: EnvironmentContext,
  config?: SecretProtectionConfig,
  configCwd = cwd,
): SecretTarget | null {
  return findSensitivePolicyPathTarget(
    targets.map((target) => ({ target, cwd })),
    config,
    configCwd,
    environment,
    createBudget(),
  );
}

function findSensitivePolicyPathTarget(
  candidates: readonly SecretCandidate[],
  config: SecretProtectionPolicy | undefined,
  configCwd: string,
  environment: EnvironmentContext,
  budget: Budget,
  activeDefaultTargets?: ReadonlySet<string>,
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

/** @internal */
export function findSensitiveTargetInCommand(
  command: string,
  cwd: string,
  environment: EnvironmentContext,
  config?: SecretProtectionConfig,
  options: SecretInspectionOptions = {},
): SecretTarget | null {
  const facts = createSemanticFacts(
    createToolInvocation(
      '',
      { command },
      { kind: 'command', shell: 'posix' },
      { executionCwd: cwd, configCwd: cwd },
      command,
    ),
  );
  return findSensitiveTargetInSemanticFacts(facts, config, environment, createBudget(), options);
}

/** @internal */
export function findSensitiveTargetInToolInput(
  input: unknown,
  route: ToolRoute,
  executionCwd: string,
  environment: EnvironmentContext,
  config?: SecretProtectionConfig,
  configCwd = executionCwd,
): SecretTarget | null {
  return findSensitiveTargetInSemanticFacts(
    createSemanticFacts(createToolInvocation('', input, route, { executionCwd, configCwd }, null)),
    config,
    environment,
    createBudget(),
  );
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
  const refined =
    target?.ruleId !== 'secret.deny-path' && options.strict === false
      ? extractToolPathTargets(facts, environment, budget, { refineJavaScriptInlineData: true })
      : candidates;
  const refinedTarget =
    refined.length === candidates.length
      ? target
      : findSensitivePolicyPathTarget(
          candidates,
          config,
          facts.invocation.context.configCwd,
          environment,
          budget,
          new Set(refined.map((candidate) => candidate.target)),
        );
  if (
    refinedTarget?.ruleId !== 'secret.deny-path' &&
    options.strict === false &&
    isMetadataOnlyCommand(facts, environment)
  ) {
    return null;
  }
  return refinedTarget;
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
  const args = stripped.slice(1);
  if (facts.invocation.route.kind === 'unknown') {
    return syntax.program.dialect === 'powershell' && (command === 'ls' || command === 'stat');
  }
  if (command === 'ls' || command === 'stat') return true;
  if (command === 'test') return args.length === 2 && (args[0] === '-e' || args[0] === '-f');
  if (command !== 'find') return false;
  return !args.some((arg) => FIND_NON_METADATA_ACTIONS.has(arg));
}

function extractToolPathTargets(
  facts: SemanticFacts,
  environment: EnvironmentContext,
  budget: Budget,
  options: PathExtractionOptions = {},
): SecretCandidate[] {
  const cwd = facts.invocation.context.executionCwd;
  if (facts.invocation.route.kind === 'command') {
    const command = getCommandSyntaxFact(facts, 'input-candidate');
    return command
      ? extractCommandPathTargets(
          command.shell,
          facts.store,
          options,
          environment,
          cwd,
          budget,
          isPowerShell(command),
        )
      : [];
  }
  if (facts.invocation.route.kind !== 'unknown') {
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
    ...facts.paths.map((target) => ({ target, cwd })),
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

  const targets = [
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
  walkGuardSyntax(syntax, cwd, environment, budget, {
    word: map,
    segment: (tokens, state, pipeProducer) => {
      if (tokens.length === 0) return null;
      targets.push(
        ...extractSegmentPathTargets(tokens, store, options, environment, state.cwd, budget),
      );
      if (pipeProducer !== null) {
        targets.push(
          ...extractPipeCarrierPathTargets(
            pipeProducer,
            tokens,
            store,
            options,
            environment,
            state.cwd,
            budget,
          ),
        );
      }
      return null;
    },
    redirection: (redirection, state) => {
      if (redirection.targetOrder === 'legacy-segment') return ADOPT_AS_OPERAND;
      targets.push({ target: map(redirection.target), cwd: state.cwd });
      return null;
    },
  });

  return targets;
}

function extractSegmentPathTargets(
  tokens: readonly string[],
  store: SemanticFactStore,
  options: PathExtractionOptions,
  environment: EnvironmentContext,
  cwd: string,
  budget: Budget,
): SecretCandidate[] {
  const here = (target: string) => ({ target, cwd });

  const assignmentValues = extractLeadingAssignmentValues(tokens).map(here);
  const stripped = stripLeadingWrappersAndEnvAssignments(tokens);
  if (stripped.length === 0) return assignmentValues;

  const executable = stripped[0] ?? '';
  const command = basename(executable).toLowerCase();
  const post = stripped.slice(1);
  const explainTargets = extractSafetyNetExplainPathTargets(executable, command, post);

  if (explainTargets) {
    return [...assignmentValues, ...explainTargets.map(here)];
  }

  if (NON_PATH_OPERAND_COMMANDS.has(command)) {
    return assignmentValues;
  }

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
  if (PATTERN_FIRST_COMMANDS.has(command)) {
    return [...assignmentValues, ...extractPatternCommandTargets(post).map(here)];
  }
  if (PATH_ROOT_COMMANDS.has(command)) {
    return [
      ...assignmentValues,
      ...extractFindCommandTargets(post, store, options, environment, cwd, budget).map(here),
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
      ...post.flatMap((token) => extractOperandPathCandidates(command, token)).map(here),
      ...extractCurlUploadPathTargets(post).map(here),
    ];
  }
  if (isCodeInterpreter(command)) {
    const body = SHELL_STDIN_INTERPRETERS.has(command)
      ? getShellCommandString(command, post)
      : null;
    if (body !== null) {
      const syntax = store.getShellSyntax(body);
      if (syntax.status === 'structural-limit') throw new StructuralShellSyntaxLimitError();
      if (syntax.status === 'complete') {
        return [
          ...assignmentValues,
          ...extractCommandPathTargets(syntax, store, options, environment, cwd, budget),
          ...post
            .slice(post.indexOf(body) + 1)
            .filter((token) => !token.startsWith('-'))
            .map(here),
        ];
      }
    }
    return [
      ...assignmentValues,
      ...extractInterpreterPathTargets(command, post, options).map(here),
    ];
  }
  return [
    ...assignmentValues,
    ...post.flatMap((token) => extractOperandPathCandidates(command, token)).map(here),
  ];
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
    return extractDisplayCommandOperands(producer).map((target) => ({ target, cwd }));
  }

  const stdinInterpreter = getStdinScriptInterpreter(consumer);
  if (stdinInterpreter === null) {
    return [];
  }

  return extractDisplayCommandBodies(producer).flatMap((body) =>
    SHELL_STDIN_INTERPRETERS.has(stdinInterpreter)
      ? extractCommandPathTargets(
          store.getShellSyntax(body),
          store,
          options,
          environment,
          cwd,
          budget,
        )
      : extractPathLiteralsFromCode(body).map((target) => ({ target, cwd })),
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
  if (equals > 0 && equals < token.length - 1) candidates.push(token.slice(equals + 1));
  if (token.startsWith('-')) return candidates;
  if (command === 'tar' && /\.(?:tar|tgz|tar\.gz|zip)$/i.test(token)) return candidates;
  if (command === 'zip' && /\.zip$/i.test(token)) return candidates;
  candidates.push(token);
  return candidates;
}

function extractGitOperandPathTargets(tokens: readonly string[]): string[] {
  const targets: string[] = [];
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index] ?? '';
    if (token === '--' || !token.startsWith('-')) {
      return [
        ...targets,
        ...tokens.slice(index).flatMap((arg) => extractOperandPathCandidates('git', arg)),
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
  const targets = [...tokens.slice(0, expressionIndex === -1 ? tokens.length : expressionIndex)];
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

function isCodeInterpreter(command: string): boolean {
  return CODE_INTERPRETERS.has(command) || /^python\d/.test(command);
}

function extractInterpreterPathTargets(
  command: string,
  tokens: readonly string[],
  options: PathExtractionOptions,
): string[] {
  const candidates: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === undefined) break;

    if (CODE_EVAL_FLAGS.has(token) || isClusteredCodeEvalFlag(command, token)) {
      const code = tokens[i + 1];
      if (code !== undefined) {
        candidates.push(...extractInlineCodePathTargets(command, code, options));
        i++;
      }
      continue;
    }

    const inlineEval = /^--(?:eval|exec)=(.*)$/.exec(token);
    if (inlineEval !== null && inlineEval[1] !== undefined) {
      candidates.push(...extractInlineCodePathTargets(command, inlineEval[1], options));
      continue;
    }

    if (!token.startsWith('-')) {
      candidates.push(token);
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

function extractPathLiteralsFromCode(code: string): string[] {
  const quoted = Array.from(code.matchAll(/(['"`])((?:\\.|(?!\1).)*)\1/g))
    .map((match) => match[2])
    .filter((value): value is string => value !== undefined && value !== '');
  const bare = (code.match(/[\w./~@+-]*[./~][\w./~@+-]*/g) ?? []).filter(
    (candidate) =>
      candidate !== 'process.versions.sqlite' ||
      quoted.some((literal) => literal.includes(candidate)),
  );
  return [...quoted, ...quoted.flatMap(decodeBase64PathCandidate), ...bare];
}

function extractInlineCodePathTargets(
  command: string,
  code: string,
  options: PathExtractionOptions,
): string[] {
  const targets = extractPathLiteralsFromCode(code);
  if (
    !options.refineJavaScriptInlineData ||
    !JAVASCRIPT_INLINE_INTERPRETERS.has(command) ||
    targets.length === 0
  ) {
    return targets;
  }

  const executableCode = maskJavaScriptDataLiterals(code);
  return executableCode !== null && !containsRecognizableInlineAccess(executableCode)
    ? []
    : targets;
}

function maskJavaScriptDataLiterals(code: string): string | null {
  const masked = code.split('');
  for (let index = 0; index < code.length; index++) {
    const quote = code[index];
    if (quote !== "'" && quote !== '"' && quote !== '`') continue;
    if (quote === '`' && isTaggedTemplate(code, index)) return null;

    masked[index] = ' ';
    let closed = false;
    for (let cursor = index + 1; cursor < code.length; cursor++) {
      const char = code[cursor];
      masked[cursor] = ' ';
      if (char === '\\') {
        cursor++;
        if (cursor < code.length) masked[cursor] = ' ';
        continue;
      }
      if (quote === '`' && char === '$' && code[cursor + 1] === '{') return null;
      if (quote !== '`' && (char === '\n' || char === '\r')) return null;
      if (char !== quote) continue;
      index = cursor;
      closed = true;
      break;
    }
    if (!closed) return null;
  }
  return masked.join('');
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
    const parts = identifier
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .split(/[_$\s]+/)
      .map((part) => part.toLowerCase());
    if (!parts.some((part) => INLINE_ACCESS_IDENTIFIER_PARTS.has(part))) continue;
    if (parts.length > 1) return true;
    if (previousNonWhitespaceCharacter(code, start) === '.') return true;
    if (nextNonWhitespaceCharacter(code, start + identifier.length) === '(') return true;
  }
  return false;
}

function previousNonWhitespaceCharacter(value: string, start: number): string | undefined {
  for (let index = start - 1; index >= 0; index--) {
    if (!/\s/.test(value[index] ?? '')) return value[index];
  }
  return undefined;
}

function nextNonWhitespaceCharacter(value: string, start: number): string | undefined {
  for (let index = start; index < value.length; index++) {
    if (!/\s/.test(value[index] ?? '')) return value[index];
  }
  return undefined;
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
      ...extractCommandPathTargets(syntax, store, options, environment, cwd, budget),
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
  return firstCommandIndex === -1 ? [] : [...tokens.slice(firstCommandIndex)];
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
  try {
    const absolute = normalizeAbsoluteCandidatePath(target, cwd, environment, budget);
    return absolute !== '' && environment.paths.entryKind(absolute) !== 'missing';
  } catch (error) {
    if (error instanceof AnalysisLimit) throw error;
    return false;
  }
}

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

  if (
    ENV_EXEMPTION_BASENAMES.has(comparableName) ||
    ENV_EXEMPTION_PREFIXES.some((prefix) => comparableName.startsWith(prefix))
  ) {
    return null;
  }

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
          const configRoot = environment.env.get('OPENCODE_CONFIG_DIR')
            ? codingCliRoot(
                environment.env.get('OPENCODE_CONFIG_DIR'),
                '~/.config/opencode',
                cwd,
                environment,
                budget,
              )
            : appendPath(
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
            matchesFileInRoot(normalized, configRoot, configNames) ||
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
    const root = comparable(normalizeAbsoluteCandidatePath(entry, configCwd, environment, budget));
    if (!root) return false;

    if (home && (home === root || home.startsWith(root.endsWith('/') ? root : `${root}/`))) {
      return false;
    }
    return isSameOrChildPath(normalized, root);
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
