import { analyzeChildCommand } from '@/core/analyze/child-analyzer';
import { collectCommandTemplate, normalizeChildCommand } from '@/core/analyze/child-command';
import { analyzeRm } from '@/core/analyze/rm';
import { hasRecursiveForceFlags } from '@/core/analyze/rm-flags';
import { extractDashCArg } from '@/core/analyze/shell-wrappers';
import { type AnalyzeNestedOverrides, SHELL_WRAPPERS } from '@/types';

const REASON_PARALLEL_RM =
  'parallel rm -rf with dynamic input is dangerous. Use explicit file list instead.';
const REASON_PARALLEL_SHELL =
  'parallel with shell -c can execute arbitrary commands from dynamic input.';
const PARALLEL_PLACEHOLDER_RE = /\{[^{}\s]*\}/;

export interface ParallelAnalyzeContext {
  cwd: string | undefined;
  originalCwd: string | undefined;
  paranoidRm: boolean | undefined;
  allowTmpdirVar: boolean;
  envAssignments?: ReadonlyMap<string, string>;
  worktreeMode?: boolean;
  analyzeNested: (command: string, overrides?: AnalyzeNestedOverrides) => string | null;
}

export function analyzeParallel(
  tokens: readonly string[],
  context: ParallelAnalyzeContext,
): string | null {
  const parseResult = parseParallelCommand(tokens);

  if (!parseResult) {
    return null;
  }

  const { template, args, templateHasPlaceholder, runsRemotely, usesStdin, envNames } = parseResult;

  if (template.length === 0) {
    // parallel ::: 'cmd1' 'cmd2' - commands mode
    // Analyze each arg as a command
    const nestedOverrides = buildCommandsModeOverrides(context, runsRemotely);
    for (const arg of args) {
      const reason = context.analyzeNested(arg, nestedOverrides);
      if (reason) {
        return reason;
      }
    }
    return null;
  }

  const childCommand = normalizeChildCommand(template, context);
  const childTokens = childCommand.tokens;
  const dynamicEnvValues = getParallelDynamicEnvValues(
    envNames,
    context.envAssignments,
    childCommand.envAssignments,
  );
  const envHasPlaceholder = dynamicEnvValues.some(hasParallelPlaceholder);
  const hasPlaceholder = templateHasPlaceholder || envHasPlaceholder;
  const hasDynamicStdinPlaceholder = usesStdin && hasPlaceholder;
  const nestedOverrides = buildNestedOverrides(
    childCommand.envAssignments,
    childCommand.wrapperCwd,
    runsRemotely || hasDynamicStdinPlaceholder,
  );

  // Check for shell wrapper with -c
  if (SHELL_WRAPPERS.has(childCommand.head)) {
    const dashCArg = extractDashCArg(childTokens);
    if (dashCArg) {
      // If script IS just the placeholder, stdin provides entire script - dangerous
      if (isOnlyParallelPlaceholder(dashCArg)) {
        return REASON_PARALLEL_SHELL;
      }
      // If script contains placeholder
      if (hasParallelPlaceholder(dashCArg)) {
        if (args.length > 0) {
          // Expand with actual args and analyze
          for (const arg of args) {
            const expandedScript = replaceParallelPlaceholder(dashCArg, arg);
            const reason = context.analyzeNested(expandedScript, nestedOverrides);
            if (reason) {
              return reason;
            }
          }
          return null;
        }
        // Stdin mode with placeholder - analyze the script template
        // Check if the script pattern is dangerous (e.g., rm -rf {})
        const reason = context.analyzeNested(dashCArg, nestedOverrides);
        if (reason) {
          return reason;
        }
        return null;
      }
      // Script doesn't have placeholder - analyze it directly
      const reason = context.analyzeNested(dashCArg, nestedOverrides);
      if (reason) {
        return reason;
      }
      const envReason = analyzeParallelDynamicEnvValues(dynamicEnvValues, args, context);
      if (envReason) {
        return envReason;
      }
      // If there's a placeholder in the shell wrapper args (not script),
      // it's still dangerous
      if (hasPlaceholder) {
        return REASON_PARALLEL_SHELL;
      }
      return null;
    }
    // bash -c without script argument
    // If there are args from :::, those become the scripts - dangerous pattern
    if (args.length > 0) {
      // The pattern of passing scripts via ::: to bash -c is inherently dangerous
      return REASON_PARALLEL_SHELL;
    }
    // Stdin provides the script - dangerous
    if (hasPlaceholder) {
      return REASON_PARALLEL_SHELL;
    }
    return null;
  }

  // For rm -rf, expand with actual args and analyze each expansion
  if (childCommand.head === 'rm' && hasRecursiveForceFlags(childTokens)) {
    if (templateHasPlaceholder && args.length > 0) {
      // Expand template with each arg and analyze
      return analyzeParallelRmExpansions(
        args.map((arg) => childTokens.map((t) => t.replace(/{}/g, arg))),
        childCommand.cwd,
        context,
      );
    }
    // No placeholder or no args - analyze template as-is
    // If there are args (from :::), they get appended, analyze each expansion
    if (args.length > 0) {
      return analyzeParallelRmExpansions(
        args.map((arg) => [...childTokens, arg]),
        childCommand.cwd,
        context,
      );
    }
    return REASON_PARALLEL_RM;
  }

  const tokenSets = getParallelChildTokenSets(childTokens, templateHasPlaceholder, args);
  for (const tokens of tokenSets) {
    const result = analyzeChildCommand(
      tokens,
      {
        cwd: childCommand.cwd,
        originalCwd: context.originalCwd,
        paranoidRm: context.paranoidRm,
        allowTmpdirVar: context.allowTmpdirVar,
        envAssignments: childCommand.envAssignments,
        worktreeMode: runsRemotely || usesStdin || hasPlaceholder ? false : context.worktreeMode,
        analyzeNested: context.analyzeNested,
      },
      {
        dynamicInput: usesStdin || hasPlaceholder,
        shellDynamicReason: REASON_PARALLEL_SHELL,
        rmDynamicReason: REASON_PARALLEL_RM,
      },
    );
    if (result) {
      return result;
    }
  }

  return null;
}

function analyzeParallelRmExpansions(
  tokenSets: readonly string[][],
  cwd: string | undefined,
  context: ParallelAnalyzeContext,
): string | null {
  for (const tokens of tokenSets) {
    const rmResult = analyzeRm(tokens, {
      cwd,
      originalCwd: context.originalCwd,
      paranoid: context.paranoidRm,
      allowTmpdirVar: context.allowTmpdirVar,
    });
    if (rmResult) {
      return rmResult;
    }
  }
  return null;
}

function getParallelChildTokenSets(
  childTokens: readonly string[],
  hasPlaceholder: boolean,
  args: readonly string[],
): string[][] {
  if (hasPlaceholder && args.length > 0) {
    return args.map((arg) => childTokens.map((token) => replaceParallelPlaceholder(token, arg)));
  }

  if (!hasPlaceholder && args.length > 0) {
    return args.map((arg) => [...childTokens, arg]);
  }

  return [[...childTokens]];
}

function getParallelDynamicEnvValues(
  envNames: readonly string[],
  contextEnvAssignments: ReadonlyMap<string, string> | undefined,
  childEnvAssignments: ReadonlyMap<string, string>,
): string[] {
  return [
    ...envNames.flatMap((name) => {
      const value = childEnvAssignments.get(name) ?? contextEnvAssignments?.get(name);
      return value === undefined ? [] : [value];
    }),
    ...childEnvAssignments.values(),
  ];
}

function analyzeParallelDynamicEnvValues(
  values: readonly string[],
  args: readonly string[],
  context: ParallelAnalyzeContext,
): string | null {
  for (const value of values) {
    if (!hasParallelPlaceholder(value)) {
      continue;
    }

    const commands =
      args.length > 0 ? args.map((arg) => replaceParallelPlaceholder(value, arg)) : [value];
    for (const command of commands) {
      const reason = context.analyzeNested(command, {
        envAssignments: context.envAssignments,
        effectiveCwd: context.cwd,
      });
      if (reason) {
        return reason;
      }
    }
  }

  return null;
}

function buildNestedOverrides(
  envAssignments: ReadonlyMap<string, string>,
  cwd: string | null | undefined,
  runsRemotely: boolean,
): AnalyzeNestedOverrides {
  const overrides: AnalyzeNestedOverrides = { envAssignments };
  if (cwd !== undefined) {
    overrides.effectiveCwd = cwd;
  }
  if (runsRemotely) {
    overrides.worktreeMode = false;
  }
  return overrides;
}

function buildCommandsModeOverrides(
  context: ParallelAnalyzeContext,
  runsRemotely: boolean,
): AnalyzeNestedOverrides | undefined {
  const overrides: AnalyzeNestedOverrides = {};
  if (context.envAssignments) {
    overrides.envAssignments = context.envAssignments;
  }
  if (context.cwd !== undefined) {
    overrides.effectiveCwd = context.cwd;
  }
  if (runsRemotely) {
    overrides.worktreeMode = false;
  }
  return Object.keys(overrides).length > 0 ? overrides : undefined;
}

interface ParallelParseResult {
  template: string[];
  args: string[];
  childCommandTokens: string[];
  templateHasPlaceholder: boolean;
  runsRemotely: boolean;
  usesStdin: boolean;
  envNames: string[];
}

function replaceParallelPlaceholder(token: string, arg: string): string {
  return token.replace(/\{[^{}\s]*\}/g, arg);
}

function hasParallelPlaceholder(token: string): boolean {
  return PARALLEL_PLACEHOLDER_RE.test(token);
}

function isOnlyParallelPlaceholder(token: string): boolean {
  return /^\{[^{}\s]*\}$/.test(token);
}

function parseParallelCommand(tokens: readonly string[]): ParallelParseResult | null {
  // Options that take a value as the next token
  const parallelOptsWithValue = new Set([
    '-a',
    '--arg-file',
    '--colsep',
    '-I',
    '--replace',
    '--results',
    '--result',
    '--res',
  ]);

  let i = 1;
  const templateTokens: string[] = [];
  let childCommandTokens: string[] = [];
  let markerIndex = -1;
  let runsRemotely = false;
  let usesPipe = false;
  const envNames: string[] = [];

  // First pass: find the ::: marker and extract template
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) break;

    if (token === ':::') {
      markerIndex = i;
      break;
    }

    if (token === '--') {
      // Everything after -- until ::: is the template
      const template = collectCommandTemplate(tokens, i + 1);
      templateTokens.push(...template.templateTokens);
      childCommandTokens = [...tokens.slice(i + 1)];
      markerIndex = template.markerIndex;
      break;
    }

    if (token.startsWith('-')) {
      if (token === '--pipe' || token === '--pipepart') {
        usesPipe = true;
        i++;
        continue;
      }

      if (token === '--env') {
        envNames.push(...splitParallelEnvNames(tokens[i + 1]));
        i += 2;
        continue;
      }

      if (token.startsWith('--env=')) {
        envNames.push(...splitParallelEnvNames(token.slice('--env='.length)));
        i++;
        continue;
      }

      if (
        token === '-S' ||
        token === '--sshlogin' ||
        token === '--slf' ||
        token === '--sshloginfile'
      ) {
        runsRemotely = true;
        i += 2;
        continue;
      }

      if (token.startsWith('-S') && token.length > 2) {
        runsRemotely = true;
        i++;
        continue;
      }

      if (
        token.startsWith('--sshlogin=') ||
        token.startsWith('--slf=') ||
        token.startsWith('--sshloginfile=')
      ) {
        runsRemotely = true;
        i++;
        continue;
      }

      // Handle -jN attached option
      if (token.startsWith('-j') && token.length > 2 && /^\d+$/.test(token.slice(2))) {
        i++;
        continue;
      }

      // Handle --option=value
      if (token.startsWith('--') && token.includes('=')) {
        i++;
        continue;
      }

      // Handle options that take a value
      if (parallelOptsWithValue.has(token)) {
        i += 2;
        continue;
      }

      // Handle -j as separate option
      if (token === '-j' || token === '--jobs') {
        i += 2;
        continue;
      }

      // Unknown option - skip it
      i++;
    } else {
      // Start of template
      const template = collectCommandTemplate(tokens, i);
      templateTokens.push(...template.templateTokens);
      childCommandTokens = [...tokens.slice(i)];
      markerIndex = template.markerIndex;
      break;
    }
  }

  // Extract args after :::
  const args: string[] = [];
  if (markerIndex !== -1) {
    for (let j = markerIndex + 1; j < tokens.length; j++) {
      const token = tokens[j];
      if (token && token !== ':::') {
        args.push(token);
      }
    }
  }

  // Determine if template has placeholder
  const templateHasPlaceholder = templateTokens.some(hasParallelPlaceholder);

  // If no template and no marker, no valid parallel command
  if (templateTokens.length === 0 && markerIndex === -1) {
    return null;
  }

  return {
    template: templateTokens,
    args,
    childCommandTokens,
    templateHasPlaceholder,
    runsRemotely,
    usesStdin: usesPipe || markerIndex === -1,
    envNames,
  };
}

function splitParallelEnvNames(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
}

/** @internal - exported for test coverage */
export function extractParallelChildCommand(tokens: readonly string[]): string[] {
  return parseParallelCommand(tokens)?.childCommandTokens ?? [];
}
