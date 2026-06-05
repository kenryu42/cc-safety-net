interface RulesMigrateOptions {
    cleanup: boolean;
    cwd: string;
}
export declare function runRulesMigrate(options: RulesMigrateOptions): Promise<number>;
export {};
