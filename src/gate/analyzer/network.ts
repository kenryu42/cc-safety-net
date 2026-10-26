import { destructiveCommandMatch } from '@/core/rules/destructive';
import type { DestructiveCommandRuleMatch } from '@/core/rules/types';
import { isInterpreterCommand } from '@/core/policy/transparent-wrappers';
import { normalizeCommandToken } from '@/core/shell/tokens';
import type { EnvironmentContext } from '@/gate/analysis';
import { getFindExecCommand, isFindExecPrimary } from './find';
import { stripWrappers } from './wrapper-prelude';
import { extractXargsChildCommandWithInfo } from './xargs';

const REASON_CLOUD_METADATA =
  'This reaches a cloud metadata endpoint, which hands out instance credentials. Run metadata requests manually if you need them.';

const REQUEST_CLIENT_HEADS = new Set([
  'curl',
  'wget',
  'aria2c',
  'http',
  'https',
  'xh',
  'xhs',
  'httpie',
  'fetch',
  'lwp-request',
  'nc',
  'ncat',
  'netcat',
  'socat',
  'telnet',
]);
const CLOUD_METADATA_HOST =
  /(?<![\w.-])(?:169\.254\.169\.254|169\.254\.170\.23|169\.254\.170\.2|100\.100\.100\.200|metadata\.google\.internal|metadata\.goog)(?![\w-]|\.[\w-])|(?<![\w:])fd00:ec2::(?:254|23)(?![\w:])/i;

export function analyzeNetworkCommandMatch(
  head: string,
  tokens: readonly string[],
  environment: EnvironmentContext,
): DestructiveCommandRuleMatch | null {
  if (head === 'xargs' || head === 'find') {
    const launchedCommands =
      head === 'xargs'
        ? [tokens.slice(extractXargsChildCommandWithInfo(tokens).childStart)]
        : tokens.flatMap((token, index) =>
            isFindExecPrimary(token) ? [getFindExecCommand(tokens, index).tokens] : [],
          );
    return (
      launchedCommands
        .map((command) => stripWrappers([...command], environment))
        .map((command) =>
          analyzeNetworkCommandMatch(normalizeCommandToken(command[0] ?? ''), command, environment),
        )
        .find((match) => match) ?? null
    );
  }
  return (REQUEST_CLIENT_HEADS.has(head) || isInterpreterCommand(head)) &&
    tokens.some((token) => CLOUD_METADATA_HOST.test(token))
    ? destructiveCommandMatch('network.cloud-metadata', REASON_CLOUD_METADATA)
    : null;
}
