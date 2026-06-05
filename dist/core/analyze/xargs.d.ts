export interface XargsAnalyzeContext {
    cwd: string | undefined;
    originalCwd: string | undefined;
    paranoidRm: boolean | undefined;
    allowTmpdirVar: boolean;
    envAssignments?: ReadonlyMap<string, string>;
    worktreeMode?: boolean;
}
export declare function analyzeXargs(tokens: readonly string[], context: XargsAnalyzeContext): string | null;
interface XargsParseResult {
    childTokens: string[];
    replacementToken: string | null;
}
/** @internal - exported for test coverage */
export declare function extractXargsChildCommandWithInfo(tokens: readonly string[]): XargsParseResult;
export {};
