import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Environment } from '@/core/environment';
import {
  type DetectContext,
  type HookDetection,
  readRecord,
  readStateFile,
} from '@/hosts/detect/context';

const GEMINI_SAFETY_NET_EXTENSION = 'gemini-safety-net';

export function detectGeminiCLI(environment: Environment): HookDetection {
  const extensionsDir = join(environment.home, '.gemini', 'extensions');
  const extensionDir = join(extensionsDir, GEMINI_SAFETY_NET_EXTENSION);
  if (!existsSync(extensionDir)) return { platform: 'gemini-cli', status: 'n/a' };

  const enablementPath = join(extensionsDir, 'extension-enablement.json');
  const enablement = readStateFile(enablementPath);
  if (enablement.kind === 'unreadable') return { platform: 'gemini-cli', status: 'not-inspected' };

  const overrides =
    enablement.kind === 'ok'
      ? readRecord(readRecord(enablement.value, GEMINI_SAFETY_NET_EXTENSION), 'overrides')
      : undefined;
  const disabled =
    Array.isArray(overrides) &&
    overrides.some((entry) => typeof entry === 'string' && entry.startsWith('!'));

  if (disabled) {
    return {
      platform: 'gemini-cli',
      status: 'disabled',
      method: 'extension config',
      configPath: enablementPath,
      errors: [`${GEMINI_SAFETY_NET_EXTENSION} is disabled in Gemini CLI`],
    };
  }

  return {
    platform: 'gemini-cli',
    status: 'configured',
    method: 'extension config',
    configPath: extensionDir,
  };
}

export function detect(context: DetectContext): HookDetection {
  return detectGeminiCLI(context.environment);
}
