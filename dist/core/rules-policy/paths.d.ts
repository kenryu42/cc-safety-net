import type { RulebookLockEntry, RulesPolicyOptions, SyncRulesConfigOptions } from './types';
export declare const RULEBOOK_FILE = "rulebook.json";
export declare const RULES_DIR = ".cc-safetynet-rules";
export declare const GITHUB_RULEBOOK_SOURCE_FORMAT = "owner/repo#ref/<rulebook-name>";
export declare const RULE_SYNC_COMMAND = "`cc-safety-net rule sync`";
export declare const RULE_MIGRATE_COMMAND = "`npx cc-safety-net rule migrate`";
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
export declare function getProjectRulesDir(cwd?: string): string;
export declare function getProjectRulesConfigPath(cwd?: string): string;
export declare function getProjectRulesLockPath(cwd?: string): string;
export declare function getUserRulesDir(options?: RulesPolicyOptions): string;
export declare function getUserRulesConfigPath(options?: RulesPolicyOptions): string;
export declare function getUserRulesLockPath(options?: RulesPolicyOptions): string;
export declare function getRulesLockPathForConfigPath(configPath: string): string;
export declare function getLegacyUserRulesConfigPath(options?: RulesPolicyOptions): string;
export declare function getLegacyProjectRulesConfigPath(options?: RulesPolicyOptions): string;
export declare function getPolicyPaths(options: RulesPolicyOptions): PolicyPaths;
export declare function getScopePaths(options: SyncRulesConfigOptions): ScopePaths;
export declare function getRulebookDisplaySource(entry: RulebookLockEntry): string;
export declare function getRulebookCachePath(entry: RulebookLockEntry, options?: RulesPolicyOptions): string;
export declare function getRepositoryRulebookPath(name: string): string;
