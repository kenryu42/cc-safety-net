import type { RulesConfig, RulesLockfile, SyncRulesConfigResult } from './types';
export declare const GITHUB_RULEBOOK_PATH_RE: RegExp;
export interface ParsedGitHubSource {
    owner: string;
    repo: string;
    ref: string;
    path: string;
    name: string;
}
export declare function getRulebookSourceSyntaxError(source: string): string | null;
export declare function parseGitHubSource(spec: string): ParsedGitHubSource;
export declare function isGitHubRepositorySource(source: string): boolean;
export declare function isGitHubRulebookSource(source: string): boolean;
export declare function assertBareRulebookName(source: string): void;
export declare function getSelectedUpdateSpecs(config: RulesConfig, lock: RulesLockfile | null, match: string): {
    ok: true;
    specs: string[];
} | {
    ok: false;
    result: SyncRulesConfigResult;
};
export declare function getRemoveMatches(rules: string[], lock: RulesLockfile | null, match: string): {
    ok: true;
    specs: string[];
} | {
    ok: false;
    result: SyncRulesConfigResult;
};
