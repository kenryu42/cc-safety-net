import { type RulesConfig, type SyncRulesConfigResult } from './types';
export declare function validateRulesConfig(config: unknown): {
    errors: string[];
    sources: Set<string>;
};
export declare function readRulesConfig(path: string): {
    config: RulesConfig | null;
    errors: string[];
};
export declare function readScopeRulesConfig(path: string): {
    ok: true;
    config: RulesConfig;
} | {
    ok: false;
    result: SyncRulesConfigResult;
};
export declare function writeDefaultRulesConfig(path: string, rules?: string[]): void;
export declare function writeStarterRulebook(path: string, name?: string): void;
export declare function writeJsonAtomic(path: string, value: unknown): void;
