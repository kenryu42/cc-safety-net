import { destructiveCommandMatch } from '@/core/rules/destructive';
import type { DestructiveCommandRuleMatch } from '@/core/rules/types';

const REASON_CLOUD_METADATA =
  'This reaches a cloud metadata endpoint, which hands out instance credentials. Run metadata requests manually if you need them.';

const TEXT_ONLY_HEADS = new Set(['echo', 'printf', 'grep', 'rg']);
const CLOUD_METADATA_HOST =
  /(?<![\w.-])(?:169\.254\.169\.254|100\.100\.100\.200|metadata\.google\.internal|metadata\.goog)(?![\w-]|\.[\w-])|(?<![\w:])fd00:ec2::254(?![\w:])/i;

export function analyzeNetworkCommandMatch(
  head: string,
  tokens: readonly string[],
): DestructiveCommandRuleMatch | null {
  return !TEXT_ONLY_HEADS.has(head) && tokens.some((token) => CLOUD_METADATA_HOST.test(token))
    ? destructiveCommandMatch('network.cloud-metadata', REASON_CLOUD_METADATA)
    : null;
}
