import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Environment } from '@/core/environment';
import { resolveEffectiveDestructiveCommandRules } from '@/core/policy/effective-rules';
import { ENV_FLAGS, envTruthy, getCCSafetyNetEnvModes } from '@/core/policy/env';
import { loadPolicySnapshot } from '@/core/policy/snapshot';
import { readBoundedHookInput } from '@/gate/intake';

type StatuslineInput = Parameters<typeof readBoundedHookInput>[0] & { isTTY?: boolean };

async function readStdinAsync(input: StatuslineInput): Promise<string | null> {
  if (input.isTTY) {
    return null;
  }

  const content = await readBoundedHookInput(input).catch(() => null);
  return content?.trim() || null;
}

function getSettingsPath(environment: Environment): string {
  const override = environment.env.get('CLAUDE_SETTINGS_PATH');
  if (override) {
    return override;
  }
  return join(environment.home, '.claude', 'settings.json');
}

interface ClaudeSettings {
  enabledPlugins?: Record<string, boolean>;
}

export function isPluginEnabled(environment: Environment): boolean {
  const settingsPath = getSettingsPath(environment);

  if (!existsSync(settingsPath)) {
    return false;
  }

  try {
    const content = readFileSync(settingsPath, 'utf-8');
    const settings = JSON.parse(content) as ClaudeSettings;

    if (!settings.enabledPlugins) {
      return false;
    }

    const pluginKey = 'cc-safety-net@cc-marketplace';

    if (!(pluginKey in settings.enabledPlugins)) {
      return false;
    }

    return settings.enabledPlugins[pluginKey] === true;
  } catch (error) {
    if (envTruthy(ENV_FLAGS.debug, environment.env)) {
      console.error(
        `CC Safety Net debug: failed to read Claude settings: ${settingsPath}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    return false;
  }
}

export async function printStatusline(
  environment: Environment,
  input: StatuslineInput = process.stdin,
): Promise<void> {
  const enabled = isPluginEnabled(environment);

  let status: string;

  if (!enabled) {
    status = '🛡️ CC Safety Net ❌';
  } else {
    const snapshot = loadPolicySnapshot(environment, { cwd: process.cwd() });
    const policy = snapshot.policy;
    const modes = getCCSafetyNetEnvModes(policy, environment.env);
    const hasEffectiveRuleCustomization = Object.values(
      resolveEffectiveDestructiveCommandRules(policy, modes.capabilities),
    ).some((rule) => rule.changesInherited);
    const levelEmoji = {
      standard: '✅',
      strict: '🔒',
      paranoid: '👁️',
      custom: '🔧',
    }[hasEffectiveRuleCustomization ? 'custom' : modes.effectiveLevel];

    const weakened = (snapshot.policyScopes?.weakenings.length ?? 0) > 0 ? '🔻' : '';

    status = `🛡️ CC Safety Net ${levelEmoji}${modes.worktreeMode ? '🌳' : ''}${weakened}${snapshot.state === 'degraded' ? '⚠️' : ''}`;
  }

  const stdinInput = await readStdinAsync(input);
  if (stdinInput && !stdinInput.startsWith('{')) {
    console.log(`${stdinInput} | ${status}`);
  } else {
    console.log(status);
  }
}
