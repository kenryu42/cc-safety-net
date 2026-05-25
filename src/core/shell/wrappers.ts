import { realpathSync } from 'node:fs';
import { isAbsolute, parse as parsePath } from 'node:path';
import { type ParseEntry, parse } from 'shell-quote';
import { parseGitContextAppendEnvAssignment } from '@/core/git/env';
import { resolveChdirTarget } from '@/core/path';
import { MAX_STRIP_ITERATIONS } from '@/types';
import { ENV_PROXY, getCommandTokenText, hasUnclosedQuotes } from './shared';

const ENV_ASSIGNMENT_RE = /^[A-Za-z_][A-Za-z0-9_]*=/;

export function parseEnvAssignment(token: string): { name: string; value: string } | null {
  if (!ENV_ASSIGNMENT_RE.test(token)) {
    return null;
  }
  const eqIdx = token.indexOf('=');
  return { name: token.slice(0, eqIdx), value: token.slice(eqIdx + 1) };
}

export interface EnvStrippingResult {
  tokens: string[];
  envAssignments: Map<string, string>;
  cwd?: string | null;
}

export function stripEnvAssignmentsWithInfo(tokens: string[]): EnvStrippingResult {
  const envAssignments = new Map<string, string>();
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      break;
    }
    const assignment = parseEnvAssignment(token);
    if (!assignment) {
      break;
    }
    envAssignments.set(assignment.name, assignment.value);
    i++;
  }
  return { tokens: tokens.slice(i), envAssignments };
}

export interface WrapperStrippingResult {
  tokens: string[];
  envAssignments: Map<string, string>;
  cwd?: string | null;
}

export function stripWrappers(tokens: string[], cwd?: string | null): string[] {
  return stripWrappersWithInfo(tokens, cwd).tokens;
}

export function stripWrappersWithInfo(
  tokens: string[],
  cwd?: string | null,
): WrapperStrippingResult {
  let result = [...tokens];
  const allEnvAssignments = new Map<string, string>();
  let currentCwd = cwd;

  for (let iteration = 0; iteration < MAX_STRIP_ITERATIONS; iteration++) {
    const before = result.join(' ');

    const { tokens: strippedTokens, envAssignments } = stripEnvAssignmentsWithInfo(result);
    for (const [k, v] of envAssignments) {
      allEnvAssignments.set(k, v);
    }
    result = strippedTokens;
    if (result.length === 0) break;

    while (
      result.length > 0 &&
      result[0]?.includes('=') &&
      !ENV_ASSIGNMENT_RE.test(result[0] ?? '')
    ) {
      const appendAssignment = parseGitContextAppendEnvAssignment(result[0] ?? '');
      if (appendAssignment) {
        allEnvAssignments.set(appendAssignment.name, appendAssignment.value);
      }
      // Other non-strict leading assignments are dropped to reach the executable token.
      // Git context append assignments are preserved above so worktree relaxation fails closed.
      result = result.slice(1);
    }
    if (result.length === 0) break;

    const head = result[0]?.toLowerCase();

    // Guard: unknown wrapper type, exit loop
    if (head !== 'sudo' && head !== 'env' && head !== 'command') {
      break;
    }

    if (head === 'sudo') {
      const sudoResult = stripSudoWithInfo(result, currentCwd);
      result = sudoResult.tokens;
      if (sudoResult.cwd !== undefined) {
        currentCwd = sudoResult.cwd;
      }
    }
    if (head === 'env') {
      const envResult = stripEnvWithInfo(result, currentCwd);
      result = envResult.tokens;
      if (envResult.cwd !== undefined) {
        currentCwd = envResult.cwd;
      }
      for (const [k, v] of envResult.envAssignments) {
        allEnvAssignments.set(k, v);
      }
    }
    if (head === 'command') {
      result = stripCommand(result);
    }

    if (result.join(' ') === before) break;
  }

  const { tokens: finalTokens, envAssignments: finalAssignments } =
    stripEnvAssignmentsWithInfo(result);
  for (const [k, v] of finalAssignments) {
    allEnvAssignments.set(k, v);
  }

  return { tokens: finalTokens, envAssignments: allEnvAssignments, cwd: currentCwd };
}

const SUDO_OPTS_WITH_VALUE = new Set(['-u', '-g', '-C', '-D', '-h', '-p', '-r', '-t', '-T', '-U']);

function stripSudoWithInfo(
  tokens: string[],
  cwd?: string | null,
): { tokens: string[]; cwd?: string | null } {
  let i = 1;
  let currentCwd = cwd;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) break;

    if (token === '--') {
      return { tokens: tokens.slice(i + 1), cwd: currentCwd };
    }

    // Guard: not an option, exit loop
    if (!token.startsWith('-')) {
      break;
    }

    if (token === '-D' || token === '--chdir') {
      const target = tokens[i + 1];
      currentCwd = target ? resolveWrapperCwd(currentCwd, target) : null;
      i += 2;
      continue;
    }

    if (token.startsWith('--chdir=')) {
      currentCwd = resolveWrapperCwd(currentCwd, token.slice('--chdir='.length));
      i++;
      continue;
    }

    if (token.startsWith('-D') && token.length > 2) {
      currentCwd = resolveWrapperCwd(currentCwd, token.slice(2));
      i++;
      continue;
    }

    if (token === '-i' || token === '--login') {
      currentCwd = null;
      i++;
      continue;
    }

    if (SUDO_OPTS_WITH_VALUE.has(token)) {
      i += 2;
      continue;
    }

    i++;
  }
  return { tokens: tokens.slice(i), cwd: currentCwd };
}

const ENV_OPTS_NO_VALUE = new Set(['-i', '-0', '--null']);
const ENV_OPTS_WITH_VALUE = new Set([
  '-u',
  '--unset',
  '-C',
  '--chdir',
  '-S',
  '--split-string',
  '-P',
]);

function stripEnvWithInfo(tokens: string[], cwd?: string | null): EnvStrippingResult {
  const envAssignments = new Map<string, string>();
  let currentCwd = cwd;
  let expandedTokens = tokens;
  let i = 1;
  while (i < expandedTokens.length) {
    const token = expandedTokens[i];
    if (!token) break;

    if (token === '--') {
      return { tokens: expandedTokens.slice(i + 1), envAssignments, cwd: currentCwd };
    }

    if (ENV_OPTS_NO_VALUE.has(token)) {
      i++;
      continue;
    }

    if (token === '-S' || token === '--split-string') {
      const splitValue = expandedTokens[i + 1];
      const splitTokens = splitValue !== undefined ? parseEnvSplitString(splitValue) : null;
      if (!splitTokens) {
        currentCwd = null;
        i += 2;
        continue;
      }
      expandedTokens = replaceEnvSplitTokens(expandedTokens, i, 2, splitTokens);
      continue;
    }

    if (token.startsWith('-S') && token.length > 2) {
      const splitTokens = parseEnvSplitString(token.slice('-S'.length));
      if (!splitTokens) {
        currentCwd = null;
        i++;
        continue;
      }
      expandedTokens = replaceEnvSplitTokens(expandedTokens, i, 1, splitTokens);
      continue;
    }

    if (token.startsWith('--split-string=')) {
      const splitTokens = parseEnvSplitString(token.slice('--split-string='.length));
      if (!splitTokens) {
        currentCwd = null;
        i++;
        continue;
      }
      expandedTokens = replaceEnvSplitTokens(expandedTokens, i, 1, splitTokens);
      continue;
    }

    if (ENV_OPTS_WITH_VALUE.has(token)) {
      if (token === '-C' || token === '--chdir') {
        const target = expandedTokens[i + 1];
        currentCwd = target ? resolveWrapperCwd(currentCwd, target) : null;
      }
      i += 2;
      continue;
    }

    if (token.startsWith('-u=') || token.startsWith('--unset=')) {
      i++;
      continue;
    }

    if ((token.startsWith('-C') && token.length > 2) || token.startsWith('--chdir=')) {
      const target = token.startsWith('--chdir=')
        ? token.slice('--chdir='.length)
        : token.startsWith('-C=')
          ? token.slice('-C='.length)
          : token.slice('-C'.length);
      currentCwd = resolveWrapperCwd(currentCwd, target);
      i++;
      continue;
    }

    if (token.startsWith('-P')) {
      i++;
      continue;
    }

    if (token.startsWith('-')) {
      i++;
      continue;
    }

    // Not an option - try to parse as env assignment
    const assignment = parseEnvAssignment(token);
    if (!assignment) {
      break;
    }
    envAssignments.set(assignment.name, assignment.value);
    i++;
  }
  return { tokens: expandedTokens.slice(i), envAssignments, cwd: currentCwd };
}

function parseEnvSplitString(value: string): string[] | null {
  if (hasUnclosedQuotes(value)) {
    return null;
  }

  const parsed = parse(value, ENV_PROXY);
  const result: string[] = [];
  for (const entry of parsed) {
    const token = getCommandTokenText(entry as ParseEntry);
    if (token === null) {
      return null;
    }
    result.push(token);
  }
  return result;
}

function replaceEnvSplitTokens(
  tokens: string[],
  index: number,
  consumed: number,
  splitTokens: string[],
): string[] {
  return [...tokens.slice(0, index), ...splitTokens, ...tokens.slice(index + consumed)];
}

function resolveWrapperCwd(cwd: string | null | undefined, target: string): string | null {
  if (target === '') {
    return null;
  }
  try {
    if (!cwd && !isAbsolute(target)) {
      return null;
    }
    const baseCwd = isAbsolute(target) ? getPathRoot(target) : realpathSync(cwd ?? '/');
    return resolveChdirTarget(baseCwd, target);
  } catch {
    return null;
  }
}

function getPathRoot(target: string): string {
  return parsePath(target).root;
}

function stripCommand(tokens: string[]): string[] {
  let i = 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) break;

    if (token === '-p' || token === '-v' || token === '-V') {
      i++;
      continue;
    }

    if (token === '--') {
      return tokens.slice(i + 1);
    }

    // Check for combined short opts like -pv
    if (token.startsWith('-') && !token.startsWith('--') && token.length > 1) {
      const chars = token.slice(1);
      if (!/^[pvV]+$/.test(chars)) {
        break;
      }
      i++;
      continue;
    }

    break;
  }
  return tokens.slice(i);
}
