import {
  BUILTIN_ANALYZED_COMMANDS,
  isInterpreterCommand,
} from '@/core/policy/transparent-wrappers';
import type { EffectivePolicy } from '@/core/policy/types';
import {
  AWK_INTERPRETERS,
  DISPLAY_COMMANDS,
  REQUEST_CLIENT_COMMANDS,
  SHELL_WRAPPERS,
} from '@/core/rules/constants';
import { getBasename, normalizeCommandToken } from '@/core/shell/tokens';
import { isDeviceCommand } from './device';

const STANDARD_COMMAND_WRAPPERS = new Set(['sudo', 'env', 'command', 'builtin']);
const EXEC_WRAPPERS = new Set([
  'caffeinate',
  'exec',
  'nice',
  'nohup',
  'setsid',
  'stdbuf',
  'time',
  'timeout',
]);

export function isExecWrapper(command: string): boolean {
  return EXEC_WRAPPERS.has(command);
}

interface TransparentWrapperUnwrap {
  wrapper: string;
  tokens: string[];
  childIndex: number;
  alternativeChildIndices: number[];
}

export function unwrapTransparentWrapper(
  tokens: readonly string[],
  policy: Pick<EffectivePolicy, 'rules' | 'transparentWrappers'>,
): TransparentWrapperUnwrap | null {
  const head = tokens[0];
  if (!head || !isTransparentWrapper(getBasename(head), policy)) {
    return null;
  }

  const wrapper = getBasename(head);
  const startIndex = tokens[1] === '--' ? 2 : 1;
  const childIndices = findChildIndices(tokens, startIndex, wrapper, policy);
  const childIndex = childIndices[0];
  if (childIndex === undefined) return null;
  return {
    wrapper,
    tokens: tokens.slice(childIndex),
    childIndex,
    alternativeChildIndices: childIndices.slice(1),
  };
}

function findChildIndices(
  tokens: readonly string[],
  startIndex: number,
  wrapper: string,
  policy: Pick<EffectivePolicy, 'rules' | 'transparentWrappers'>,
): number[] {
  const explicitChild = tokens[1] === '--';
  const childIndices: number[] = [];

  for (let index = startIndex; index < tokens.length; index++) {
    const child = tokens[index];
    if (!child) continue;
    const protectable = getBasename(child) !== wrapper && isProtectableCommand(child, policy);
    if (protectable) childIndices.push(index);
    if (!protectable && DISPLAY_COMMANDS.has(normalizeCommandToken(child))) break;
    if (explicitChild) break;
  }

  return childIndices;
}

function isProtectableCommand(
  token: string,
  policy: Pick<EffectivePolicy, 'rules' | 'transparentWrappers'>,
): boolean {
  const basename = getBasename(token);
  const normalized = normalizeCommandToken(token);
  return (
    normalized === 'git' ||
    normalized === 'unshare' ||
    basename === 'busybox' ||
    isStandardCommandWrapper(token) ||
    BUILTIN_ANALYZED_COMMANDS.has(basename) ||
    isDeviceCommand(normalized) ||
    REQUEST_CLIENT_COMMANDS.has(normalized) ||
    isTransparentWrapper(basename, policy) ||
    SHELL_WRAPPERS.has(normalized) ||
    token === '$SHELL' ||
    isInterpreterCommand(normalized) ||
    AWK_INTERPRETERS.has(normalized) ||
    policy.rules.some((rule) => rule.command === basename)
  );
}

function isTransparentWrapper(
  command: string,
  policy: Pick<EffectivePolicy, 'transparentWrappers'>,
): boolean {
  return EXEC_WRAPPERS.has(command) || policy.transparentWrappers.includes(command);
}

export function isStandardCommandWrapper(token: string): boolean {
  return STANDARD_COMMAND_WRAPPERS.has(token.toLowerCase());
}
