import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import type { RulebookLockEntry, RulesPolicyOptions, SyncRulesConfigOptions } from './types';

const RULES_CONFIG_FILE = 'rule.json';
const RULES_LOCK_FILE = 'rule.lock';
export const RULEBOOK_FILE = 'rulebook.json';
const LEGACY_RULES_CONFIG_FILE = 'config.json';
const SAFETY_NET_DIR = '.cc-safety-net';
const RULES_SUBDIR = 'rules';
const CACHE_SUBDIR = 'cache';
export const RULES_DIR = `${SAFETY_NET_DIR}/${RULES_SUBDIR}`;
const CC_SAFETY_NET_HOME = 'CC_SAFETY_NET_HOME';
export const GITHUB_RULEBOOK_SOURCE_FORMAT = 'owner/repo#ref/<rulebook-name>';
export const RULE_SYNC_COMMAND = '`cc-safety-net rule sync`';
export const RULE_MIGRATE_COMMAND = '`npx -y cc-safety-net rule migrate`';

export interface PolicyPaths {
  userConfigPath: string;
  projectConfigPath: string;
  userLockPath: string;
  projectLockPath: string;
}

export interface ScopePaths {
  configDir: string;
  configPath: string;
  lockPath: string;
}

export function getProjectRulesDir(cwd?: string): string {
  return resolve(cwd ?? process.cwd(), RULES_DIR);
}

export function getProjectRulesConfigPath(cwd?: string): string {
  return join(getProjectRulesDir(cwd), RULES_CONFIG_FILE);
}

/** @internal - exported for test coverage */
export function getProjectRulesLockPath(cwd?: string): string {
  return join(getProjectRulesDir(cwd), RULES_LOCK_FILE);
}

export function getUserRulesDir(options?: RulesPolicyOptions): string {
  return (
    options?.userConfigDir ??
    (options?.userConfigPath
      ? dirname(options.userConfigPath)
      : join(getUserSafetyNetHome(), RULES_SUBDIR))
  );
}

function getUserSafetyNetHome(): string {
  const home = process.env[CC_SAFETY_NET_HOME];
  return home ? resolve(home) : join(homedir(), SAFETY_NET_DIR);
}

export function getUserRulesConfigPath(options?: RulesPolicyOptions): string {
  return join(getUserRulesDir(options), RULES_CONFIG_FILE);
}

export function getUserRulesLockPath(options?: RulesPolicyOptions): string {
  return join(getUserRulesDir(options), RULES_LOCK_FILE);
}

export function getRulesLockPathForConfigPath(configPath: string): string {
  return join(dirname(configPath), RULES_LOCK_FILE);
}

export function getLegacyUserRulesConfigPath(options: RulesPolicyOptions = {}): string {
  return join(dirname(getUserRulesDir(options)), LEGACY_RULES_CONFIG_FILE);
}

export function getLegacyProjectRulesConfigPath(options: RulesPolicyOptions = {}): string {
  return resolve(options.cwd ?? process.cwd(), '.safety-net.json');
}

export function getPolicyPaths(options: RulesPolicyOptions): PolicyPaths {
  const userConfigPath = options.userConfigPath ?? getUserRulesConfigPath(options);
  const projectConfigPath = options.projectConfigPath ?? getProjectRulesConfigPath(options.cwd);
  return {
    userConfigPath,
    projectConfigPath,
    userLockPath: getRulesLockPathForConfigPath(userConfigPath),
    projectLockPath: getRulesLockPathForConfigPath(projectConfigPath),
  };
}

export function getScopePaths(options: SyncRulesConfigOptions): ScopePaths {
  const configPath = options.global
    ? (options.userConfigPath ?? getUserRulesConfigPath(options))
    : (options.projectConfigPath ?? getProjectRulesConfigPath(options.cwd));
  return {
    configDir: dirname(configPath),
    configPath,
    lockPath: getRulesLockPathForConfigPath(configPath),
  };
}

export function getRulebookDisplaySource(entry: RulebookLockEntry): string {
  if (entry.kind === 'github' && entry.display_ref) {
    return `${entry.owner}/${entry.repo}#${entry.display_ref}/${entry.name}`;
  }
  return entry.spec;
}

export function getRulebookCachePath(
  entry: RulebookLockEntry,
  options?: RulesPolicyOptions,
): string {
  const digestHex = entry.digest.startsWith('sha256:') ? entry.digest.slice(7) : entry.digest;
  return join(
    getRulesCacheDir(options),
    'rulebooks',
    `${getRulebookCacheSlug(entry)}--${digestHex.slice(0, 12)}`,
    RULEBOOK_FILE,
  );
}

function getRulebookCacheSlug(entry: RulebookLockEntry): string {
  const source =
    entry.kind === 'github' && entry.display_ref
      ? `${entry.owner}/${entry.repo}#${entry.display_ref}/${entry.name}`
      : entry.spec;
  return (
    source
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'rulebook'
  );
}

export function getRepositoryRulebookPath(name: string): string {
  return `${RULES_DIR}/${name}/${RULEBOOK_FILE}`;
}

function getRulesCacheDir(options?: RulesPolicyOptions): string {
  return join(dirname(options?.cacheConfigDir ?? getUserRulesDir(options)), CACHE_SUBDIR);
}
