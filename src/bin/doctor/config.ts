/**
 * Rulebook-backed configuration display with source tracking.
 */

import { existsSync } from 'node:fs';
import { dirname } from 'node:path';
import type { ConfigSourceInfo, EffectiveRule, ShadowedRule } from '@/bin/doctor/types';
import { validateRulesConfigFile } from '@/core/config';
import {
  getProjectRulesConfigPath,
  getRulesConfigRuntimeErrorsForConfig,
  getRulesLockPathForConfigPath,
  getUserRulesConfigPath,
  getUserRulesLockPath,
  loadRulesPolicy,
} from '@/core/rules/policy';
import type { CustomRule } from '@/types';

export interface ConfigInfo {
  userConfig: ConfigSourceInfo;
  projectConfig: ConfigSourceInfo;
  effectiveRules: EffectiveRule[];
  shadowedRules: ShadowedRule[];
}

export interface ConfigInfoOptions {
  userConfigPath?: string;
  projectConfigPath?: string;
}

function getConfigSourceInfo(
  path: string,
  lockPath: string,
  userConfigDir: string,
): ConfigSourceInfo {
  if (!existsSync(path)) {
    return { path, exists: false, valid: false, ruleCount: 0 };
  }

  const validation = validateRulesConfigFile(path);
  validation.errors.push(
    ...getRulesConfigRuntimeErrorsForConfig(path, lockPath, { userConfigDir }),
  );

  return {
    path,
    exists: true,
    valid: validation.errors.length === 0,
    ruleCount: validation.ruleNames.size,
    ...(validation.errors.length > 0 ? { errors: validation.errors } : {}),
  };
}

function toEffectiveRule(rule: CustomRule, source: 'user' | 'project'): EffectiveRule {
  return {
    source,
    name: rule.name,
    command: rule.command,
    subcommand: rule.subcommand,
    blockArgs: rule.block_args,
    reason: rule.reason,
  };
}

export function getConfigInfo(cwd: string, options?: ConfigInfoOptions): ConfigInfo {
  const userPath = options?.userConfigPath ?? getUserRulesConfigPath();
  const projectPath = options?.projectConfigPath ?? getProjectRulesConfigPath(cwd);
  const userConfigDir = dirname(userPath);
  const policy = loadRulesPolicy({
    cwd,
    userConfigPath: userPath,
    projectConfigPath: projectPath,
    userConfigDir,
  });
  const rulebookSources = new Map(
    policy.rulebooks.flatMap((rulebook) =>
      rulebook.rules.map((rule) => [rule, rulebook.source] as const),
    ),
  );

  return {
    userConfig: getConfigSourceInfo(
      userPath,
      getUserRulesLockPath({ userConfigPath: userPath }),
      userConfigDir,
    ),
    projectConfig: getConfigSourceInfo(
      projectPath,
      getRulesLockPathForConfigPath(projectPath),
      userConfigDir,
    ),
    effectiveRules: policy.rules.map((rule) =>
      toEffectiveRule(rule, rulebookSources.get(rule.name) ?? 'project'),
    ),
    shadowedRules: [],
  };
}
