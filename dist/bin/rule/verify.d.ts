interface RulesVerifyOptions {
    cwd?: string;
    userConfigPath?: string;
    projectConfigPath?: string;
    legacyUserConfigPath?: string;
    legacyProjectConfigPath?: string;
}
export declare function runRulesVerify(options?: RulesVerifyOptions): number;
export {};
