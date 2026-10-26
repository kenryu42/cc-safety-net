import { isInterpreterCommand } from '@/core/policy/transparent-wrappers';
import { REQUEST_CLIENT_COMMANDS } from '@/core/rules/constants';
import { destructiveCommandMatch } from '@/core/rules/destructive';
import type { DestructiveCommandRuleMatch } from '@/core/rules/types';
import { getBasename, normalizeCommandToken } from '@/core/shell/tokens';

const REASON_CLOUD_METADATA =
  'This reaches a cloud metadata endpoint, which hands out instance credentials. Run metadata requests manually if you need them.';

const CLOUD_METADATA_HOST =
  /(?<![\w.-])(?:169\.254\.169\.254|169\.254\.170\.23|169\.254\.170\.2|100\.100\.100\.200|metadata\.google\.internal|metadata\.goog)(?![\w-]|\.[\w-])|(?<![\w:])fd00:ec2::(?:254|23)(?![\w:])/i;

const COMMAND_LAUNCHERS = new Set(['xargs', 'find']);

export function analyzeNetworkCommandMatch(
  head: string,
  tokens: readonly string[],
): DestructiveCommandRuleMatch | null {
  const launchesRequest = COMMAND_LAUNCHERS.has(head)
    ? tokens.slice(1).some(isRequestCapableCommand)
    : isRequestCapableCommand(head);
  return launchesRequest &&
    tokens.some(
      (token, index) =>
        !isNoProxyValue(tokens[index - 1], token) && CLOUD_METADATA_HOST.test(token),
    )
    ? destructiveCommandMatch('network.cloud-metadata', REASON_CLOUD_METADATA)
    : null;
}

function isRequestCapableCommand(token: string): boolean {
  const command = normalizeCommandToken(getBasename(token));
  return REQUEST_CLIENT_COMMANDS.has(command) || isInterpreterCommand(command);
}

function isNoProxyValue(previous: string | undefined, token: string): boolean {
  return previous === '--noproxy' || token.startsWith('--noproxy=');
}
