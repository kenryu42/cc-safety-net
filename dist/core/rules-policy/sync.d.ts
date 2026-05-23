import type { RulesPolicyOptions, SyncRulesConfigOptions, SyncRulesConfigResult } from './types';
export declare function syncRulesConfig(options?: SyncRulesConfigOptions): Promise<SyncRulesConfigResult>;
export declare function testRulebookSources(sources: string[], options?: SyncRulesConfigOptions): Promise<SyncRulesConfigResult>;
export declare function addRulebookSource(source: string, options?: SyncRulesConfigOptions): Promise<SyncRulesConfigResult>;
export declare function removeRulebookSource(match: string, options?: SyncRulesConfigOptions): Promise<SyncRulesConfigResult>;
export declare function repairLocalRulesPolicy(options?: RulesPolicyOptions): void;
