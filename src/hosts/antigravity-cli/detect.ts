import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getAntigravityHooksPath } from '@/hosts/antigravity-cli/hook';
import { type DetectContext, type HookDetection, readStateFile } from '@/hosts/detect/context';

export const ANTIGRAVITY_PLUGIN_NAME = 'cc-safety-net';

const ANTIGRAVITY_HOOK_COMMAND_PATTERN =
  /cc-safety-net\s+hook\s+(?:[^\s]+\s+)*(?:--agy-cli|-ac)(\s|["']|$)/;

export function getAntigravityPluginDir(homeDir: string): string {
  return join(homeDir, '.gemini', 'config', 'plugins', ANTIGRAVITY_PLUGIN_NAME);
}

export function isAntigravityPluginDisabled(homeDir: string): boolean {
  const config = readStateFile(join(homeDir, '.gemini', 'config', 'config.json'));
  return (
    config.kind === 'ok' &&
    (
      config.value as {
        plugins?: Record<string, { enabled?: unknown } | null | undefined>;
      } | null
    )?.plugins?.[ANTIGRAVITY_PLUGIN_NAME]?.enabled === false
  );
}

function _findAntigravitySafetyNetHooks(
  config: unknown,
): Array<{ enabled: boolean; command: string }> {
  if (!config || typeof config !== 'object' || Array.isArray(config)) return [];

  return Object.values(config as Record<string, unknown>).flatMap((definition) => {
    if (!definition || typeof definition !== 'object' || Array.isArray(definition)) return [];

    const record = definition as Record<string, unknown>;
    const preToolUse = record.PreToolUse;
    if (!Array.isArray(preToolUse)) return [];

    return preToolUse.flatMap((entry) => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return [];
      const hooks = (entry as Record<string, unknown>).hooks;
      if (!Array.isArray(hooks)) return [];

      return hooks.flatMap((hook) => {
        if (!hook || typeof hook !== 'object' || Array.isArray(hook)) return [];
        const command = (hook as Record<string, unknown>).command;
        if (typeof command !== 'string' || !ANTIGRAVITY_HOOK_COMMAND_PATTERN.test(command)) {
          return [];
        }
        return [{ command, enabled: record.enabled !== false }];
      });
    });
  });
}

function inspectHooksFile(
  configPath: string,
  method: 'plugin' | 'hook config',
  pluginEnabled: boolean,
): HookDetection {
  if (!existsSync(configPath)) {
    return { platform: 'antigravity-cli', status: 'n/a', configPath };
  }

  let matches: Array<{ enabled: boolean; command: string }>;
  try {
    matches = _findAntigravitySafetyNetHooks(JSON.parse(readFileSync(configPath, 'utf-8')));
  } catch (e) {
    return {
      platform: 'antigravity-cli',
      status: 'n/a',
      configPath,
      errors: [
        `Failed to parse Antigravity hooks config ${configPath}: ${e instanceof Error ? e.message : String(e)}`,
      ],
    };
  }

  if (pluginEnabled && matches.some((match) => match.enabled)) {
    return { platform: 'antigravity-cli', status: 'configured', method, configPath };
  }

  if (matches.length > 0) {
    return { platform: 'antigravity-cli', status: 'disabled', method, configPath };
  }

  return { platform: 'antigravity-cli', status: 'n/a', configPath };
}

export function detect(context: DetectContext): HookDetection {
  const home = context.environment.home;
  const detections = [
    inspectHooksFile(
      join(getAntigravityPluginDir(home), 'hooks.json'),
      'plugin',
      !isAntigravityPluginDisabled(home),
    ),
    inspectHooksFile(getAntigravityHooksPath(home), 'hook config', true),
  ] as const;

  return (
    detections.find((detection) => detection.status === 'configured') ??
    detections.find((detection) => detection.status === 'disabled') ??
    detections.find((detection) => detection.errors !== undefined) ??
    detections[1]
  );
}
