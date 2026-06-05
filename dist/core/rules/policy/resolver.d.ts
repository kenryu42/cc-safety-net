import { type Rulebook } from '@/core/rules/rulebook';
import type { RulebookLockEntry, RulesLockfile, RulesPolicyOptions, SyncRulesConfigOptions } from './types';
export interface ResolvedRulebook {
    entry: RulebookLockEntry;
    rulebook: Rulebook;
    content: string;
}
export interface DiscoveredRulebookSource {
    spec: string;
    display_ref?: string;
}
export declare function resolveRulebookSource(spec: string, configDir: string, options: RulesPolicyOptions): Promise<ResolvedRulebook>;
export declare function resolveRulebookSourceForSync(spec: string, configDir: string, options: SyncRulesConfigOptions, previousLock: RulesLockfile | null): Promise<ResolvedRulebook>;
export declare function discoverGitHubRepositoryRulebooks(source: string): Promise<DiscoveredRulebookSource[]>;
export declare function resolveLocalRulebook(spec: string, configDir: string, _options: RulesPolicyOptions): ResolvedRulebook;
export declare function sha256Digest(content: string): string;
