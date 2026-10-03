import { existsSync, readFileSync } from 'node:fs';
import type { DetectContext, HookDetection } from '@/hosts/detect/context';
import { DROID_HOOK_COMMAND, DROID_HOOK_TIMEOUT, getDroidHooksPath } from '@/hosts/droid/install';
import { findManagedEntry, managedEntryDriftErrors } from '@/hosts/install/pre-tool-use-entries';

export function detect(context: DetectContext): HookDetection {
  const configPath = getDroidHooksPath(context.environment);

  if (!existsSync(configPath)) {
    return { platform: 'droid', status: 'n/a', configPath };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(configPath, 'utf-8'));
  } catch (e) {
    return {
      platform: 'droid',
      status: 'n/a',
      configPath,
      errors: [
        `Failed to parse Factory Droid hooks config ${configPath}: ${e instanceof Error ? e.message : String(e)}`,
      ],
    };
  }

  const preToolUse =
    typeof parsed === 'object' && parsed !== null && 'PreToolUse' in parsed
      ? parsed.PreToolUse
      : undefined;
  const entry = findManagedEntry(Array.isArray(preToolUse) ? preToolUse : [], DROID_HOOK_COMMAND);
  if (!entry) {
    return { platform: 'droid', status: 'n/a', configPath };
  }

  const errors = [
    ...(entry.commandRegex === undefined || entry.commandRegex === ''
      ? []
      : ['Managed hook has a "commandRegex" that narrows coverage; reinstall to repair']),
    ...managedEntryDriftErrors(entry, DROID_HOOK_COMMAND, DROID_HOOK_TIMEOUT),
  ];
  return {
    platform: 'droid',
    status: 'configured',
    method: 'hook config',
    configPath,
    errors: errors.length > 0 ? errors : undefined,
  };
}
