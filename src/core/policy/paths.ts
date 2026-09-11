import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import type { Environment } from '@/core/environment';
import {
  bindPolicyFilesystemScope,
  getPolicyFilesystemTargetForPath,
  type PolicyFilesystemScope,
  type PolicyFilesystemTarget,
} from '@/core/io/safe-read';
import { normalizeMsysDrivePath } from '@/core/paths/canonicalization';
import { RULEBOOK_FILE, RULES_DIR } from './source-syntax';

const RULES_CONFIG_FILE = 'rule.json';

export const POLICY_FILE = 'policy.json';
const SAFETY_NET_DIR = '.cc-safety-net';
const RULES_SUBDIR = 'rules';
const CC_SAFETY_NET_HOME = 'CC_SAFETY_NET_HOME';
export const RULE_UPDATE_COMMAND = '`cc-safety-net rule update`';

export interface PolicyPaths {
  userConfigPath: string;
  projectConfigPath: string;
  userScope: PolicyFilesystemScope;
  projectScope: PolicyFilesystemScope;
  userConfigTarget: PolicyFilesystemTarget;
  projectConfigTarget: PolicyFilesystemTarget;
}

export type RulesPolicyOptions = {
  cwd: string;
  userConfigDir?: string;
  userConfigPath?: string;
  projectConfigPath?: string;
};

export type UserScopeOptions = Pick<RulesPolicyOptions, 'userConfigDir' | 'userConfigPath'>;

export function getProjectRulesDir(cwd: string): string {
  return resolve(cwd, RULES_DIR);
}

export function getProjectRulesConfigPath(cwd: string): string {
  return join(getProjectRulesDir(cwd), RULES_CONFIG_FILE);
}

export function getProjectPolicyPath(cwd: string): string {
  return join(resolve(cwd), SAFETY_NET_DIR, POLICY_FILE);
}

export function getUserRulesDir(environment: Environment, options: UserScopeOptions = {}): string {
  return (
    options.userConfigDir ??
    (options.userConfigPath
      ? dirname(options.userConfigPath)
      : join(getUserSafetyNetHome(environment), RULES_SUBDIR))
  );
}

function getUserSafetyNetHome(environment: Environment): string {
  const home = environment.env.get(CC_SAFETY_NET_HOME);
  return home ? resolve(normalizeMsysDrivePath(home)) : join(environment.home, SAFETY_NET_DIR);
}

export function getUserRulesConfigPath(
  environment: Environment,
  options: UserScopeOptions = {},
): string {
  return join(getUserRulesDir(environment, options), RULES_CONFIG_FILE);
}

export function getUserPolicyPath(
  environment: Environment,
  options: UserScopeOptions = {},
): string {
  return join(dirname(getUserRulesDir(environment, options)), POLICY_FILE);
}

export function getPolicyPaths(environment: Environment, options: RulesPolicyOptions): PolicyPaths {
  const userConfigPath = options.userConfigPath ?? getUserRulesConfigPath(environment, options);
  const projectConfigPath = options.projectConfigPath ?? getProjectRulesConfigPath(options.cwd);
  const userScope = getUserPolicyFilesystemScope(environment, options);
  const projectScope = getProjectPolicyFilesystemScope(projectConfigPath, options.cwd);
  return {
    userConfigPath,
    projectConfigPath,
    userScope,
    projectScope,
    userConfigTarget: getPolicyFilesystemTargetForPath(userScope, userConfigPath),
    projectConfigTarget: getPolicyFilesystemTargetForPath(projectScope, projectConfigPath),
  };
}

export function getUserPolicyFilesystemScope(
  environment: Environment,
  options: UserScopeOptions,
): PolicyFilesystemScope {
  const root = options.userConfigPath
    ? dirname(dirname(resolve(options.userConfigPath)))
    : dirname(resolve(options.userConfigDir ?? getUserRulesDir(environment, options)));
  return bindPolicyFilesystemScope(root, 'user policy');
}

export function getProjectPolicyFilesystemScope(
  configPath: string,
  cwd: string,
): PolicyFilesystemScope {
  const projectRoot = resolve(cwd);
  const absoluteConfigPath = resolve(configPath);
  const fromCwd = relative(projectRoot, absoluteConfigPath);
  if (fromCwd !== '..' && !fromCwd.startsWith(`..${sep}`) && !isAbsolute(fromCwd)) {
    return bindPolicyFilesystemScope(projectRoot, 'project policy');
  }
  return bindPolicyFilesystemScope(dirname(dirname(absoluteConfigPath)), 'project policy');
}

export function getLocalRulebookPath(configDir: string, name: string): string {
  return join(configDir, name, RULEBOOK_FILE);
}
