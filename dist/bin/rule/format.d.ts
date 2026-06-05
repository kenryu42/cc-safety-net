import { type LoadedRulesPolicy, type RulebookLockEntryWithStats } from '@/core/rules/policy';
export declare function printSyncResult(result: {
    ok: boolean;
    errors: string[];
    warnings?: string[];
    entries: RulebookLockEntryWithStats[];
}): void;
export declare function printRuleChangeResult(result: {
    ok: boolean;
    errors: string[];
    warnings?: string[];
    entries: RulebookLockEntryWithStats[];
}, action: string): void;
export declare function printRulesTestResult(result: {
    ok: boolean;
    errors: string[];
    warnings?: string[];
    entries: RulebookLockEntryWithStats[];
}, sourceDisplayMap?: Map<string, string>): void;
export declare function printRulesListReport(policy: LoadedRulesPolicy, sourceDisplayMaps: Record<'user' | 'project', Map<string, string>>): void;
export declare function relativeDisplay(cwd: string, path: string): string;
