import { destructiveCommandMatch } from '@/core/rules/destructive';
import type { DestructiveCommandRuleMatch } from '@/core/rules/types';
import { getBasename } from '@/core/shell/tokens';
import { getFindExecCommand, isFindExecPrimary } from './find';
import { extractXargsChildCommandWithInfo } from './xargs';

const REASON_CLOUD_METADATA =
  'This reaches a cloud metadata endpoint, which hands out instance credentials. Run metadata requests manually if you need them.';

const TEXT_ONLY_HEADS = new Set(['echo', 'printf', 'grep', 'rg', 'git', 'gh', 'export']);
const CLOUD_METADATA_HOST =
  /(?<![\w.-])(?:169\.254\.169\.254|100\.100\.100\.200|metadata\.google\.internal|metadata\.goog)(?![\w-]|\.[\w-])|(?<![\w:])fd00:ec2::254(?![\w:])/i;

export function analyzeNetworkCommandMatch(
  head: string,
  tokens: readonly string[],
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
        .map((command) => analyzeNetworkCommandMatch(getBasename(command[0] ?? ''), command))
        .find((match) => match) ?? null
    );
  }
  return !TEXT_ONLY_HEADS.has(head) && tokens.some((token) => CLOUD_METADATA_HOST.test(token))
    ? destructiveCommandMatch('network.cloud-metadata', REASON_CLOUD_METADATA)
    : null;
}
