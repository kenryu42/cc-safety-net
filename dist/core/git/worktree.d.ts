export declare const GIT_GLOBAL_OPTS_WITH_VALUE: ReadonlySet<string>;
export interface GitExecutionContext {
    gitCwd: string | null;
    hasExplicitGitContext: boolean;
}
export declare function hasGitContextEnvOverride(envAssignments?: ReadonlyMap<string, string>): boolean;
export declare function getGitExecutionContext(tokens: readonly string[], cwd: string | undefined): GitExecutionContext;
export declare function isLinkedWorktree(cwd: string): boolean;
/** @internal Exported for testing */
export declare function normalizePathForComparison(path: string): string;
export declare function findDotGitInAncestors(cwd: string): string | null;
