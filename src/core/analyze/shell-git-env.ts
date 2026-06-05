import { isTrackedGitEnvName, parseGitContextAppendEnvAssignment } from '@/core/git/env';
import { parseEnvAssignment } from '@/core/shell';

export interface ShellGitContextEnvState {
  effectiveEnvAssignments?: ReadonlyMap<string, string>;
  shellAssignments: Map<string, string>;
  exportedNames: Set<string>;
  allexport: boolean;
  keywordExport: boolean;
}

interface GitContextAssignment {
  name: string;
  value: string;
}

interface ShellCommandInfo {
  command: string | null;
  commandIndex: number;
  leadingAssignments: Map<string, GitContextAssignment>;
}

export function createShellGitContextEnvState(
  effectiveEnvAssignments?: ReadonlyMap<string, string>,
): ShellGitContextEnvState {
  return {
    effectiveEnvAssignments,
    shellAssignments: new Map(),
    exportedNames: getInitiallyExportedGitContextNames(effectiveEnvAssignments),
    allexport: false,
    keywordExport: false,
  };
}

export function applyShellGitContextEnvSegment(
  tokens: readonly string[],
  state: ShellGitContextEnvState,
): void {
  const commandInfo = getShellCommandInfo(tokens);
  if (!commandInfo) {
    return;
  }

  const { command, commandIndex, leadingAssignments } = commandInfo;
  if (command === null) {
    for (const assignment of leadingAssignments.values()) {
      setShellGitContextAssignment(state, assignment);
    }
    return;
  }

  if (command === 'set') {
    const changes = getSetOptionChanges(tokens, commandIndex);
    if (changes.allexport !== null) {
      state.allexport = changes.allexport;
    }
    if (changes.keywordExport !== null) {
      state.keywordExport = changes.keywordExport;
    }
    return;
  }

  if (
    command !== 'export' &&
    command !== 'typeset' &&
    command !== 'declare' &&
    command !== 'readonly'
  ) {
    return;
  }

  for (const assignment of leadingAssignments.values()) {
    setShellGitContextAssignment(state, assignment);
  }

  if (command === 'export') {
    const operandsStart = getExportOperandsStart(tokens, commandIndex);
    if (operandsStart === null) {
      return;
    }
    for (const token of tokens.slice(operandsStart)) {
      addExportedGitContextEnvAssignment(state, token);
    }
    return;
  }

  const operandsInfo = getTypesetOperandsInfo(tokens, commandIndex);
  if (operandsInfo === null) {
    return;
  }
  for (const token of tokens.slice(operandsInfo.operandsStart)) {
    addTypesetGitContextEnvAssignment(
      state,
      token,
      operandsInfo.exports,
      command === 'readonly' ? leadingAssignments : undefined,
    );
  }
}

export function getSegmentGitContextEnvAssignments(
  tokens: readonly string[],
  state: ShellGitContextEnvState,
): ReadonlyMap<string, string> | undefined {
  if (!state.keywordExport) {
    return state.effectiveEnvAssignments;
  }

  let nextEnvAssignments: Map<string, string> | null = null;
  for (const token of tokens) {
    const assignment = parseGitContextEnvAssignment(token);
    if (!assignment) {
      continue;
    }
    nextEnvAssignments ??= new Map(state.effectiveEnvAssignments ?? []);
    nextEnvAssignments.set(assignment.name, assignment.value);
  }

  return nextEnvAssignments ?? state.effectiveEnvAssignments;
}

function getShellCommandInfo(tokens: readonly string[]): ShellCommandInfo | null {
  const leadingAssignments = new Map<string, GitContextAssignment>();
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      return null;
    }
    const assignment = parseShellAssignment(token);
    if (!assignment) {
      break;
    }
    if (isTrackedGitEnvName(assignment.name)) {
      leadingAssignments.set(assignment.name, assignment);
    }
    i++;
  }

  if (i >= tokens.length) {
    return { command: null, commandIndex: i, leadingAssignments };
  }

  let commandIndex = i;
  let command = tokens[commandIndex] ?? null;
  if (command === 'builtin') {
    commandIndex++;
    if (tokens[commandIndex] === '--') {
      commandIndex++;
    }
    command = tokens[commandIndex] ?? null;
  }
  if (command === 'command') {
    const commandBuiltinInfo = getCommandBuiltinTarget(tokens, commandIndex);
    if (!commandBuiltinInfo) {
      return null;
    }
    commandIndex = commandBuiltinInfo.commandIndex;
    command = commandBuiltinInfo.command;
  }
  if (command === null) {
    return null;
  }

  return { command, commandIndex, leadingAssignments };
}

function getCommandBuiltinTarget(
  tokens: readonly string[],
  commandIndex: number,
): { command: string; commandIndex: number } | null {
  let i = commandIndex + 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      return null;
    }
    if (token === '--') {
      i++;
      break;
    }
    if (token === '-p') {
      i++;
      continue;
    }
    if (token === '-v' || token === '-V') {
      return null;
    }
    break;
  }

  const command = tokens[i];
  return command ? { command, commandIndex: i } : null;
}

function parseShellAssignment(token: string): GitContextAssignment | null {
  return parseEnvAssignment(token) ?? parseGitContextAppendEnvAssignment(token);
}

function parseGitContextEnvAssignment(token: string): GitContextAssignment | null {
  const assignment = parseEnvAssignment(token) ?? parseGitContextAppendEnvAssignment(token);
  if (!assignment || !isTrackedGitEnvName(assignment.name)) {
    return null;
  }
  return assignment;
}

function getInitiallyExportedGitContextNames(
  effectiveEnvAssignments?: ReadonlyMap<string, string>,
): Set<string> {
  const exportedNames = new Set<string>();
  for (const name of Object.keys(process.env)) {
    if (isTrackedGitEnvName(name)) {
      exportedNames.add(name);
    }
  }
  for (const name of effectiveEnvAssignments?.keys() ?? []) {
    if (isTrackedGitEnvName(name)) {
      exportedNames.add(name);
    }
  }
  return exportedNames;
}

function setShellGitContextAssignment(
  state: ShellGitContextEnvState,
  assignment: GitContextAssignment,
): void {
  state.shellAssignments.set(assignment.name, assignment.value);
  if (state.allexport || state.exportedNames.has(assignment.name)) {
    setEffectiveGitContextAssignment(state, assignment);
  }
}

function setEffectiveGitContextAssignment(
  state: ShellGitContextEnvState,
  assignment: GitContextAssignment,
): void {
  const nextEnvAssignments = new Map(state.effectiveEnvAssignments ?? []);
  nextEnvAssignments.set(assignment.name, assignment.value);
  state.effectiveEnvAssignments = nextEnvAssignments;
}

function addExportedGitContextEnvAssignment(state: ShellGitContextEnvState, token: string): void {
  const assignment = parseGitContextEnvAssignment(token);
  if (assignment) {
    state.shellAssignments.set(assignment.name, assignment.value);
    state.exportedNames.add(assignment.name);
    setEffectiveGitContextAssignment(state, assignment);
    return;
  }

  if (isTrackedGitEnvName(token)) {
    exportTrackedGitContextEnvName(state, token);
  }
}

function addTypesetGitContextEnvAssignment(
  state: ShellGitContextEnvState,
  token: string,
  exports: boolean,
  readonlyLeadingAssignments?: ReadonlyMap<string, GitContextAssignment>,
): void {
  const assignment = parseGitContextEnvAssignment(token);
  if (assignment) {
    state.shellAssignments.set(assignment.name, assignment.value);
    if (exports) {
      state.exportedNames.add(assignment.name);
      setEffectiveGitContextAssignment(state, assignment);
    } else if (state.allexport || state.exportedNames.has(assignment.name)) {
      setEffectiveGitContextAssignment(state, assignment);
    }
    return;
  }

  const readonlyAssignment = readonlyLeadingAssignments?.get(token);
  if (readonlyAssignment) {
    state.exportedNames.add(token);
    setEffectiveGitContextAssignment(state, readonlyAssignment);
    return;
  }

  if (exports && isTrackedGitEnvName(token)) {
    exportTrackedGitContextEnvName(state, token);
  }
}

function exportTrackedGitContextEnvName(state: ShellGitContextEnvState, name: string): void {
  state.exportedNames.add(name);
  setEffectiveGitContextAssignment(state, {
    name,
    value: state.shellAssignments.get(name) ?? '',
  });
}

function getExportOperandsStart(tokens: readonly string[], commandIndex: number): number | null {
  let i = commandIndex + 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      return null;
    }
    if (token === '--') {
      return i + 1;
    }
    if (token === '-p') {
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

interface TypesetOperandsInfo {
  operandsStart: number;
  exports: boolean;
}

function getTypesetOperandsInfo(
  tokens: readonly string[],
  commandIndex: number,
): TypesetOperandsInfo | null {
  let i = commandIndex + 1;
  let hasExportFlag = false;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      return null;
    }
    if (token === '--') {
      return { operandsStart: i + 1, exports: hasExportFlag };
    }
    if (token.startsWith('-')) {
      if (token.slice(1).includes('x')) {
        hasExportFlag = true;
      }
      i++;
      continue;
    }
    if (token.startsWith('+')) {
      if (token.slice(1).includes('x')) {
        hasExportFlag = false;
      }
      i++;
      continue;
    }
    return { operandsStart: i, exports: hasExportFlag };
  }
  return { operandsStart: i, exports: hasExportFlag };
}

interface SetOptionChanges {
  allexport: boolean | null;
  keywordExport: boolean | null;
}

function getSetOptionChanges(tokens: readonly string[], commandIndex: number): SetOptionChanges {
  const changes: SetOptionChanges = { allexport: null, keywordExport: null };
  let i = commandIndex + 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      return changes;
    }
    if (token === '--') {
      return changes;
    }
    if (token === '-o' || token === '+o') {
      if (tokens[i + 1] === 'allexport') {
        changes.allexport = token === '-o';
      }
      if (tokens[i + 1] === 'keyword') {
        changes.keywordExport = token === '-o';
      }
      i += 2;
      continue;
    }
    if (token.startsWith('-') && token.length > 1) {
      const flags = token.slice(1);
      if (flags.includes('a')) {
        changes.allexport = true;
      }
      if (flags.includes('k')) {
        changes.keywordExport = true;
      }
      i++;
      continue;
    }
    if (token.startsWith('+') && token.length > 1) {
      const flags = token.slice(1);
      if (flags.includes('a')) {
        changes.allexport = false;
      }
      if (flags.includes('k')) {
        changes.keywordExport = false;
      }
      i++;
      continue;
    }
    return changes;
  }
  return changes;
}
