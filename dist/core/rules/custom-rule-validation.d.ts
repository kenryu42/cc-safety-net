interface ValidateCustomRuleOptions {
    messageStyle?: 'legacy' | 'rulebook';
}
export declare function validateCustomRule(rule: unknown, index: number, ruleNames: Set<string>, options?: ValidateCustomRuleOptions): string[];
export {};
