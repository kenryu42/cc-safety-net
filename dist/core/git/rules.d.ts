export declare const CHECKOUT_SHORT_OPTS_WITH_VALUE: Set<string>;
export declare const SWITCH_SHORT_OPTS_WITH_VALUE: Set<string>;
export interface GitRuleMatch {
    reason: string;
    localDiscard: boolean;
}
export declare function matchesGitLongOption(token: string, option: string): boolean;
export declare function analyzeGitRule(tokens: readonly string[]): GitRuleMatch | null;
