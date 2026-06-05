export declare function splitAtDoubleDash(tokens: readonly string[]): {
    index: number;
    before: readonly string[];
    after: readonly string[];
};
export declare function extractGitSubcommandAndRest(tokens: readonly string[]): {
    subcommand: string | null;
    rest: string[];
};
