import { isGitConfigEnvName } from '@/core/git/worktree';
import type { CommandWord } from '@/core/shell/model';
import { analysisWordText } from './command-words';
import {
  isGitContextEnvOverrideName,
  isTrackedGitEnvName,
  parseGitContextAppendEnvAssignment,
} from './git/env';
import { parseEnvAssignment } from './wrapper-prelude';

export interface ShellGitContextEnvState {
  env: ReadonlyMap<string, string>;
  effectiveEnvAssignments?: ReadonlyMap<string, string>;
  shellAssignments: Map<string, string>;
  bodyDepth: number;
  bodyAssignments: Set<string>;
}

interface GitContextAssignment {
  name: string;
  value: string;
}

interface SegmentGitContextAssignment extends GitContextAssignment {
  persists: boolean;
}

const TMPDIR_ENV_NAME = 'TMPDIR';
const IFS_ENV_NAME = 'IFS';
const ENV_APPEND_ASSIGNMENT_RE = /^([A-Za-z_][A-Za-z0-9_]*)\+=/;
const ENV_NAME_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;

const EXPORT_BUILTINS = new Set(['export', 'typeset', 'declare', 'readonly']);

const BUILTIN_CALL_PREFIXES = new Set(['builtin', 'command', 'time']);

const COMPOUND_BODY_KEYWORDS = new Set(['do', 'then', 'else']);
const COMPOUND_OPEN_KEYWORDS = new Set(['do', 'then', 'case']);
const COMPOUND_CLOSE_KEYWORDS = new Set(['done', 'fi', 'esac']);

const UNQUOTED_ASSIGNMENT_TILDE_RE = /^[A-Za-z_][A-Za-z0-9_]*=~(?:\/|$)/;

const SHELL_VARIABLE_RE = /\$(?:\{([A-Za-z_][A-Za-z0-9_]*)\}|([A-Za-z_][A-Za-z0-9_]*))/g;

type ShellLocation = { home: string; cwd: string | null | undefined };

export function withImplicitShellVariables(
  assignments: ReadonlyMap<string, string>,
  location: ShellLocation,
): Map<string, string> {
  return new Map([
    ['HOME', location.home],
    ...(typeof location.cwd === 'string' ? [['PWD', location.cwd] as const] : []),
    ...assignments,
  ]);
}

export function expandHomeTildeWord(word: CommandWord, home: string): string | null {
  return word.provenance === 'literal' &&
    !word.quoted &&
    word.raw === word.text &&
    word.raw.startsWith('~/')
    ? `${home}${word.raw.slice(1)}`
    : null;
}

export function segmentTokensWithExpandedAssignments(
  words: readonly CommandWord[],
  state: ShellGitContextEnvState,
  location: ShellLocation & { darwinUserTempDir: () => string | null },
): string[] {
  const knownVariables = withImplicitShellVariables(state.shellAssignments, location);
  return words.map((word) => {
    if (!isEnvAssignmentToken(word.text)) return analysisWordText(word);
    if (word.provenance === 'variable') {
      return substituteKnownShellVariables(word.text, knownVariables);
    }
    if (word.provenance === 'command-substitution') {
      return (
        expandDarwinUserTempDirWord(word, location.darwinUserTempDir) ?? analysisWordText(word)
      );
    }
    return word.provenance === 'literal' && UNQUOTED_ASSIGNMENT_TILDE_RE.test(word.raw)
      ? word.text.replace('=~', `=${knownVariables.get('HOME')}`)
      : analysisWordText(word);
  });
}

function substituteKnownShellVariables(
  text: string,
  assignments: ReadonlyMap<string, string>,
): string {
  return text.replace(SHELL_VARIABLE_RE, (match, braced?: string, bare?: string) => {
    return assignments.get(braced ?? bare ?? '') ?? match;
  });
}

const DARWIN_USER_TEMP_DIR_SUBSTITUTIONS = new Set([
  '$(getconf DARWIN_USER_TEMP_DIR)',
  '`getconf DARWIN_USER_TEMP_DIR`',
]);

function expandDarwinUserTempDirWord(
  word: CommandWord,
  darwinUserTempDir: () => string | null,
): string | null {
  if (word.provenance !== 'command-substitution') return null;
  const pieces = word.parts.map((part) => {
    if (part.provenance === 'command-substitution') {
      return DARWIN_USER_TEMP_DIR_SUBSTITUTIONS.has(part.raw) ? darwinUserTempDir() : null;
    }
    return part.provenance === 'literal' && !/[$`\\']/.test(part.raw)
      ? part.raw.replaceAll('"', '')
      : null;
  });
  if (!pieces.every((piece): piece is string => piece !== null)) return null;
  const expanded = pieces.join('');
  return /[\s$`*?[]/.test(expanded) ? null : expanded;
}

export function expandKnownVariableWord(
  word: CommandWord,
  assignments: ReadonlyMap<string, string>,
): string | null {
  const everyDollarIsParsedExpansion = word.parts.every(
    (part) => part.provenance !== 'literal' || !/[$`]/.test(part.raw),
  );
  if (word.provenance !== 'variable' || !everyDollarIsParsedExpansion) return null;
  const expanded = substituteKnownShellVariables(word.text, assignments);
  return /^[~-]/.test(expanded) || /[\s$`*?[]/.test(expanded) ? null : expanded;
}

export function createShellGitContextEnvState(
  env: ReadonlyMap<string, string>,
  effectiveEnvAssignments?: ReadonlyMap<string, string>,
): ShellGitContextEnvState {
  return {
    env,
    effectiveEnvAssignments: getInitialEffectiveShellEnvAssignments(env, effectiveEnvAssignments),
    shellAssignments: new Map(),
    bodyDepth: 0,
    bodyAssignments: new Set(),
  };
}

export function cloneShellGitContextEnvState(
  state: ShellGitContextEnvState,
): ShellGitContextEnvState {
  return {
    env: state.env,
    effectiveEnvAssignments: state.effectiveEnvAssignments
      ? new Map(state.effectiveEnvAssignments)
      : undefined,
    shellAssignments: new Map(state.shellAssignments),
    bodyDepth: state.bodyDepth,
    bodyAssignments: new Set(state.bodyAssignments),
  };
}

export function applyShellGitContextEnvSegment(
  tokens: readonly string[],
  state: ShellGitContextEnvState,
): void {
  const segment = collectSegmentEnvAssignments(tokens, state);
  const head = tokens[0] ?? '';
  if (COMPOUND_OPEN_KEYWORDS.has(head)) state.bodyDepth += 1;
  if (head === 'elif' || COMPOUND_CLOSE_KEYWORDS.has(head)) {
    state.bodyDepth = Math.max(0, state.bodyDepth - 1);
  }
  if (COMPOUND_CLOSE_KEYWORDS.has(head) && state.bodyDepth === 0) {
    state.bodyAssignments.forEach((name) => {
      state.shellAssignments.delete(name);
    });
    state.bodyAssignments.clear();
  }

  segment.assignments
    .filter((assignment) => assignment.persists)
    .forEach((assignment) => {
      state.shellAssignments.set(assignment.name, assignment.value);
      if (state.bodyDepth > 0) state.bodyAssignments.add(assignment.name);
      setEffectiveGitContextAssignment(state, assignment);
    });

  const commandIndex = segment.commandIndex;
  if (commandIndex !== -1 && EXPORT_BUILTINS.has(tokens[commandIndex] ?? '')) {
    tokens
      .filter((token) => ENV_NAME_RE.test(token) && isTrackedShellEnvName(token))
      .forEach((name) => {
        exportTrackedGitContextEnvName(state, name);
      });
  }

  const invokedIndex = commandIndex === -1 ? -1 : resolveInvokedWordIndex(tokens, commandIndex);
  if (invokedIndex === -1 || tokens[invokedIndex] !== 'unset') {
    return;
  }
  const operandsStart = getUnsetOperandsStart(tokens, invokedIndex);
  if (operandsStart === null) {
    return;
  }
  tokens.slice(operandsStart).forEach((name) => {
    if (state.bodyDepth > 0) {
      state.shellAssignments.set(name, '');
      return;
    }
    unsetTrackedGitContextEnvName(state, name);
  });
}

export function getSegmentGitContextEnvAssignments(
  tokens: readonly string[],
  state: ShellGitContextEnvState,
): ReadonlyMap<string, string> | undefined {
  const assignments = collectSegmentEnvAssignments(tokens, state).assignments;
  if (assignments.length === 0) {
    return state.effectiveEnvAssignments;
  }

  const nextEnvAssignments = new Map(state.effectiveEnvAssignments ?? []);
  assignments.forEach((assignment) => {
    nextEnvAssignments.set(assignment.name, assignment.value);
  });
  return nextEnvAssignments;
}

function collectSegmentEnvAssignments(
  tokens: readonly string[],
  state: ShellGitContextEnvState,
): { assignments: readonly SegmentGitContextAssignment[]; commandIndex: number } {
  const bodyStart = COMPOUND_BODY_KEYWORDS.has(tokens[0] ?? '') ? 1 : 0;
  const commandIndex = tokens.findIndex(
    (token, index) => index >= bodyStart && !isEnvAssignmentToken(token),
  );
  const declaresOperands =
    commandIndex !== -1 &&
    EXPORT_BUILTINS.has(tokens[resolveInvokedWordIndex(tokens, commandIndex)] ?? '');
  const currentValues = getCurrentShellAssignmentValues(state);

  const assignments = tokens.flatMap((token, index) => {
    const assignment = parseShellContextEnvAssignment(token, currentValues, state.env);
    if (!assignment) {
      return [];
    }
    if (
      commandIndex !== -1 &&
      index > commandIndex &&
      !declaresOperands &&
      !isGitContextEnvOverrideName(assignment.name)
    ) {
      return [];
    }
    currentValues.set(assignment.name, assignment.value);
    return [
      {
        ...assignment,
        persists: commandIndex === -1 || declaresOperands,
      },
    ];
  });

  return { assignments, commandIndex };
}

function resolveInvokedWordIndex(tokens: readonly string[], commandIndex: number): number {
  let index = commandIndex;
  while (BUILTIN_CALL_PREFIXES.has(tokens[index] ?? '')) {
    index += 1;
    while (tokens[index]?.startsWith('-')) {
      if (/^-p*[vV][pvV]*$/.test(tokens[index] ?? '')) {
        return commandIndex;
      }
      index += 1;
    }
  }
  return index;
}

function isEnvAssignmentToken(token: string): boolean {
  return parseEnvAssignment(token) !== null || ENV_APPEND_ASSIGNMENT_RE.test(token);
}

function parseShellContextEnvAssignment(
  token: string,
  currentValues: ReadonlyMap<string, string>,
  env: ReadonlyMap<string, string>,
): GitContextAssignment | null {
  return parseEnvAssignment(token) ?? parseAppendEnvAssignment(token, currentValues, env);
}

function parseAppendEnvAssignment(
  token: string,
  currentValues: ReadonlyMap<string, string>,
  env: ReadonlyMap<string, string>,
): GitContextAssignment | null {
  const gitAssignment = parseGitContextAppendEnvAssignment(token, env, currentValues);
  if (gitAssignment) return gitAssignment;

  const name = token.match(ENV_APPEND_ASSIGNMENT_RE)?.[1];
  if (!name) return null;
  const eqIdx = token.indexOf('=');
  return {
    name,
    value: `${currentValues.has(name) ? currentValues.get(name) : (env.get(name) ?? '')}${token.slice(eqIdx + 1)}`,
  };
}

function isTrackedShellEnvName(name: string): boolean {
  return name === TMPDIR_ENV_NAME || name === IFS_ENV_NAME || isTrackedGitEnvName(name);
}

function getCurrentShellAssignmentValues(state: ShellGitContextEnvState): Map<string, string> {
  return new Map([...(state.effectiveEnvAssignments ?? []), ...state.shellAssignments]);
}

function getInitialEffectiveShellEnvAssignments(
  env: ReadonlyMap<string, string>,
  effectiveEnvAssignments?: ReadonlyMap<string, string>,
): ReadonlyMap<string, string> | undefined {
  const inheritedAssignments = [TMPDIR_ENV_NAME, IFS_ENV_NAME]
    .map((name) => {
      const value = env.get(name);
      return value === undefined ? null : ([name, value] as const);
    })
    .filter((assignment): assignment is readonly [string, string] => assignment !== null);

  if (inheritedAssignments.length === 0) {
    return effectiveEnvAssignments;
  }

  return new Map([...inheritedAssignments, ...(effectiveEnvAssignments ?? [])]);
}

function setEffectiveGitContextAssignment(
  state: ShellGitContextEnvState,
  assignment: GitContextAssignment,
): void {
  const nextEnvAssignments = new Map(state.effectiveEnvAssignments ?? []);
  nextEnvAssignments.set(assignment.name, assignment.value);
  state.effectiveEnvAssignments = nextEnvAssignments;
}

function exportTrackedGitContextEnvName(state: ShellGitContextEnvState, name: string): void {
  setEffectiveGitContextAssignment(state, {
    name,
    value:
      state.shellAssignments.get(name) ??
      state.effectiveEnvAssignments?.get(name) ??
      state.env.get(name) ??
      '',
  });
}

function unsetTrackedGitContextEnvName(state: ShellGitContextEnvState, name: string): void {
  if (!isTrackedShellEnvName(name) && !ENV_NAME_RE.test(name)) {
    return;
  }
  state.shellAssignments.set(name, '');
  if (isGitContextEnvOverrideName(name) && state.env.has(name)) {
    const env = new Map(state.env);
    env.delete(name);
    state.env = env;
  }
  if (
    !isTrackedShellEnvName(name) ||
    name === TMPDIR_ENV_NAME ||
    name === IFS_ENV_NAME ||
    isGitConfigEnvName(name)
  ) {
    setEffectiveGitContextAssignment(state, { name, value: '' });
    return;
  }
  if (!state.effectiveEnvAssignments?.has(name)) {
    return;
  }

  const nextEnvAssignments = new Map(state.effectiveEnvAssignments);
  nextEnvAssignments.delete(name);
  state.effectiveEnvAssignments = nextEnvAssignments.size === 0 ? undefined : nextEnvAssignments;
}

function getUnsetOperandsStart(tokens: readonly string[], commandIndex: number): number | null {
  let i = commandIndex + 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      return null;
    }
    if (token === '--') {
      return i + 1;
    }
    if (token === '-v') {
      i++;
      continue;
    }
    if (token.startsWith('-')) {
      return null;
    }
    return i;
  }
  return i;
}
