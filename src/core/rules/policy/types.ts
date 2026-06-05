import type { CustomRule } from '@/types';

export type RuleOverride = 'off' | { reason: string };
export interface RulesConfig {
  version: 1;
  rules: string[];
  overrides?: Record<string, RuleOverride>;
}

interface RulebookLockEntryBase {
  spec: string;
  name: string;
  version: string;
  digest: string;
}

interface LocalDirectoryRulebookLockEntry extends RulebookLockEntryBase {
  kind: 'local-directory';
  path: string;
}

export interface GitHubRulebookLockEntry extends RulebookLockEntryBase {
  kind: 'github';
  owner: string;
  repo: string;
  ref: string;
  commit: string;
  path: string;
  display_ref?: string;
}

export type RulebookLockEntry = LocalDirectoryRulebookLockEntry | GitHubRulebookLockEntry;

export type RulebookLockEntryWithStats = RulebookLockEntry & {
  ruleCount?: number;
  testCount?: number;
};

export interface RulesLockfile {
  version: 1;
  rulebooks: RulebookLockEntry[];
}

export interface RulesPolicyOptions {
  cwd?: string;
  cacheConfigDir?: string;
  userConfigDir?: string;
  userConfigPath?: string;
  projectConfigPath?: string;
}

export interface SyncRulesConfigOptions extends RulesPolicyOptions {
  global?: boolean;
  check?: boolean;
  only?: string;
  refresh?: boolean;
}

export interface SyncRulesConfigResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  entries: RulebookLockEntryWithStats[];
}

export interface LoadedRulebookInfo {
  source: 'user' | 'project';
  spec: string;
  name: string;
  version: string;
  rules: string[];
}

export interface LoadedRulesPolicy {
  rules: CustomRule[];
  rulebooks: LoadedRulebookInfo[];
  errors: string[];
  userConfig?: RulesConfig;
  projectConfig?: RulesConfig;
  userConfigPath: string;
  projectConfigPath: string;
  userLockPath: string;
  projectLockPath: string;
}

export const DEFAULT_CONFIG: RulesConfig = { version: 1, rules: [], overrides: {} };
