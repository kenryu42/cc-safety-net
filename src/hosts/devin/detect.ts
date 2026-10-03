import { existsSync } from 'node:fs';
import type { DetectContext, HookDetection } from '@/hosts/detect/context';
import {
  DEVIN_HOOK_COMMAND,
  DEVIN_HOOK_TIMEOUT,
  getDevinConfigPath,
  readDevinConfig,
} from '@/hosts/devin/install';
import { findManagedEntry, managedEntryDriftErrors } from '@/hosts/install/pre-tool-use-entries';

export function detect(context: DetectContext): HookDetection {
  const configPath = getDevinConfigPath(context.environment);
  if (!existsSync(configPath)) return { platform: 'devin', status: 'n/a', configPath };

  const devin = readDevinConfig(configPath);
  if (typeof devin === 'string') {
    return { platform: 'devin', status: 'n/a', configPath, errors: [devin] };
  }

  const entry = findManagedEntry(devin.preToolUse, DEVIN_HOOK_COMMAND);
  if (!entry) return { platform: 'devin', status: 'n/a', configPath };

  const errors = managedEntryDriftErrors(entry, DEVIN_HOOK_COMMAND, DEVIN_HOOK_TIMEOUT);
  return {
    platform: 'devin',
    status: 'configured',
    method: 'hook config',
    configPath,
    errors: errors.length > 0 ? errors : undefined,
  };
}
