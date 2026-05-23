import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import type { RulebookLockEntry, RulesPolicyOptions, SyncRulesConfigOptions } from './types';

const RULES_CONFIG_FILE = 'rule.json';
const RULES_LOCK_FILE = 'rule.lock';
export const RULEBOOK_FILE = 'rulebook.json';
const LEGACY_RULES_CONFIG_FILE = 'config.json';
const SAFETY_NET_DIR = '.cc-safetynet-rules';
const LEGACY_PROJECT_RULES_DIR = '.cc-safety-net/rules';
export const RULES_DIR = SAFETY_NET_DIR;
const CC_SAFETY_NET_HOME = 'CC_SAFETY_NET_HOME';
export const GITHUB_RULEBOOK_SOURCE_FORMAT = 'owner/repo#ref/<rulebook-name>';
export const RULE_SYNC_COMMAND = '`cc-safety-net rule sync`';
export const RULE_MIGRATE_COMMAND = '`npx cc-safety-net rule migrate`';

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
  const base = cwd ?? process.cwd();
  const legacyPath = resolve(base, LEGACY_PROJECT_RULES_DIR);
  return existsSync(legacyPath) ? legacyPath : resolve(base, RULES_DIR);
}

export function getProjectRulesConfigPath(cwd?: string): string {
  return join(getProjectRulesDir(cwd), RULES_CONFIG_FILE);
}

export function getProjectRulesLockPath(cwd?: string): string {
  return join(getProjectRulesDir(cwd), RULES_LOCK_FILE);
}

export function getUserRulesDir(options?: RulesPolicyOptions): string {
  return (
    options?.userConfigDir ??
    (options?.userConfigPath ? dirname(options.userConfigPath) : getUserSafetyNetHome())
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
  return {
    userConfigPath: options.userConfigPath ?? getUserRulesConfigPath(options),
    projectConfigPath: options.projectConfigPath ?? getProjectRulesConfigPath(options.cwd),
    userLockPath: getUserRulesLockPath(options),
    projectLockPath: getRulesLockPathForConfigPath(
      options.projectConfigPath ?? getProjectRulesConfigPath(options.cwd),
    ),
  };
}

export function getScopePaths(options: SyncRulesConfigOptions): ScopePaths {
  const configPath = options.global
    ? getUserRulesConfigPath(options)
    : getProjectRulesConfigPath(options.cwd);
  return {
    configDir: dirname(configPath),
    configPath,
    lockPath: options.global ? getUserRulesLockPath(options) : getProjectRulesLockPath(options.cwd),
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
    options?.cacheConfigDir ?? getUserRulesDir(options),
    'cache',
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
