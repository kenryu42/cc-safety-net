import type { Config, CustomRule } from '@/types';
import type { LoadedRulebookInfo, LoadedRulesPolicy, RulebookLockEntry, RulesConfig, RulesPolicyOptions } from './types';
interface ScopePolicy {
    rules: CustomRule[];
    rulebooks: LoadedRulebookInfo[];
    entries: RulebookLockEntry[];
    knownRuleIds: Set<string>;
    errors: string[];
    canValidateOverrides: boolean;
}
export declare function loadRulesPolicy(options?: RulesPolicyOptions): LoadedRulesPolicy;
export declare function getRulesConfigSourceDisplayMap(configPath: string): Map<string, string>;
export declare function getRulesConfigRuntimeErrorsForConfig(configPath: string, lockPath: string, options: RulesPolicyOptions): string[];
export declare function getUnknownOverrideErrorsForConfig(configPath: string, lockPath: string, options: RulesPolicyOptions): string[];
export declare function loadScopePolicy(config: RulesConfig, lockPath: string, configDir: string, options: RulesPolicyOptions, source: 'user' | 'project'): ScopePolicy;
export declare function rulesPolicyToConfig(policy: LoadedRulesPolicy): Config;
export declare function getRulebookMigratedFrom(configDir: string, source: string): string | null;
export {};
