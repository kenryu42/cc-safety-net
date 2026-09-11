import { stripVTControlCharacters } from 'node:util';
import type { DetectContext, HookDetection } from '@/hosts/detect/context';

const AMP_PLUGIN_LIST_CONFIG_PATH = 'amp plugins list';
const AMP_USER_PLUGIN_LINE = /^\s*[✓✗]\s+cc-safety-net(?:\.ts)?\s+\(User Plugins\)\s+(\S+)\s*$/;

export function detect(context: DetectContext): HookDetection {
  if (!context.ampPluginListOutput) return { platform: 'amp', status: 'n/a' };

  const status = stripVTControlCharacters(context.ampPluginListOutput)
    .split('\n')
    .map((line) => AMP_USER_PLUGIN_LINE.exec(line)?.[1])
    .find((match): match is string => match !== undefined);
  if (!status) return { platform: 'amp', status: 'n/a' };

  if (status !== 'active') {
    return {
      platform: 'amp',
      status: 'disabled',
      method: AMP_PLUGIN_LIST_CONFIG_PATH,
      configPath: AMP_PLUGIN_LIST_CONFIG_PATH,
      errors: [
        `Amp personal plugin cc-safety-net is ${status}; run "plugins: reload" in Amp or reinstall with install --amp`,
      ],
    };
  }

  return {
    platform: 'amp',
    status: 'configured',
    method: AMP_PLUGIN_LIST_CONFIG_PATH,
    configPath: AMP_PLUGIN_LIST_CONFIG_PATH,
  };
}
