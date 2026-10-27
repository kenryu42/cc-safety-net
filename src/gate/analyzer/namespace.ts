import { destructiveCommandMatch } from '@/core/rules/destructive';
import type { DestructiveCommandRuleMatch } from '@/core/rules/types';

const REASON_USER_NAMESPACE =
  'unshare creating a user namespace grants root inside it, a common step toward privilege escalation. Ask the user to run it manually if it is needed.';

const USER_NAMESPACE_LONG_OPTION =
  /^--(?:user|map-root-user|map-current-user|map-auto|map-subids|map-(?:user|group)s?|owner|mount-binfmt|load-interp)(?:=|$)/;
const USER_NAMESPACE_SHORT_FLAG = /[Urcl]/;
const SHORT_VALUE_FLAG = /[RwSGl]/;
const LONG_VALUE_OPTIONS = new Set([
  '--propagation',
  '--setgroups',
  '--root',
  '--wd',
  '--setuid',
  '--setgid',
  '--map-user',
  '--map-group',
  '--map-users',
  '--map-groups',
  '--owner',
  '--whitelist-env',
  '--load-interp',
]);

function firstValueFlagIndex(cluster: string) {
  const index = cluster.slice(1).search(SHORT_VALUE_FLAG);
  return index === -1 ? cluster.length : index + 1;
}

function takesNextValue(token: string) {
  return (
    LONG_VALUE_OPTIONS.has(token) ||
    (/^-[^-]/.test(token) && firstValueFlagIndex(token) === token.length - 1)
  );
}

function createsUserNamespace(option: string) {
  return option.startsWith('--')
    ? USER_NAMESPACE_LONG_OPTION.test(option)
    : USER_NAMESPACE_SHORT_FLAG.test(option.slice(1, firstValueFlagIndex(option) + 1));
}

export function analyzeNamespaceCommandMatch(
  head: string,
  tokens: readonly string[],
): DestructiveCommandRuleMatch | null {
  if (head !== 'unshare') return null;
  const operands = tokens.slice(1);
  const isOptionValue = (index: number) => takesNextValue(operands[index - 1] ?? '');
  const programIndex = operands.findIndex(
    (token, index) => !isOptionValue(index) && (token === '--' || !token.startsWith('-')),
  );
  return operands
    .slice(0, programIndex === -1 ? undefined : programIndex)
    .some((token, index) => !isOptionValue(index) && createsUserNamespace(token))
    ? destructiveCommandMatch('unshare.user-namespace', REASON_USER_NAMESPACE)
    : null;
}
