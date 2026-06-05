export interface ShellGitContextEnvState {
    effectiveEnvAssignments?: ReadonlyMap<string, string>;
    shellAssignments: Map<string, string>;
    exportedNames: Set<string>;
    allexport: boolean;
    keywordExport: boolean;
}
export declare function createShellGitContextEnvState(effectiveEnvAssignments?: ReadonlyMap<string, string>): ShellGitContextEnvState;
export declare function applyShellGitContextEnvSegment(tokens: readonly string[], state: ShellGitContextEnvState): void;
export declare function getSegmentGitContextEnvAssignments(tokens: readonly string[], state: ShellGitContextEnvState): ReadonlyMap<string, string> | undefined;
