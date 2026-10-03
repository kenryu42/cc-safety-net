import { existsSync, readFileSync } from 'node:fs';
import type { DetectContext, HookDetection } from '@/hosts/detect/context';
import {
  GROK_BUILD_HOOK_COMMAND,
  GROK_BUILD_HOOK_TIMEOUT,
  getGrokBuildHooksPath,
} from '@/hosts/grok-build/install';
import { findManagedEntry, managedEntryDriftErrors } from '@/hosts/install/pre-tool-use-entries';

function _isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function detect(context: DetectContext): HookDetection {
  const configPath = getGrokBuildHooksPath(context.environment);

  if (!existsSync(configPath)) {
    return { platform: 'grok-build', status: 'n/a', configPath };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(configPath, 'utf-8'));
  } catch (e) {
    return {
      platform: 'grok-build',
      status: 'n/a',
      configPath,
      errors: [
        `Failed to parse Grok Build hooks config ${configPath}: ${e instanceof Error ? e.message : String(e)}`,
      ],
    };
  }

  const preToolUse =
    _isRecord(parsed) && _isRecord(parsed.hooks) ? parsed.hooks.PreToolUse : undefined;
  const entry = findManagedEntry(
    Array.isArray(preToolUse) ? preToolUse : [],
    GROK_BUILD_HOOK_COMMAND,
  );
  if (!entry) {
    return { platform: 'grok-build', status: 'n/a', configPath };
  }

  const errors = managedEntryDriftErrors(entry, GROK_BUILD_HOOK_COMMAND, GROK_BUILD_HOOK_TIMEOUT);
  return {
    platform: 'grok-build',
    status: 'configured',
    method: 'hook config',
    configPath,
    errors: errors.length > 0 ? errors : undefined,
  };
}
