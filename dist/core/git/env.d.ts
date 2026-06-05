export declare const GIT_CONTEXT_ENV_OVERRIDES: readonly ["GIT_DIR", "GIT_WORK_TREE", "GIT_COMMON_DIR", "GIT_INDEX_FILE"];
/** @internal - exported for test coverage */
export declare const GIT_CONFIG_AFFECTING_ENV_NAMES: ReadonlySet<string>;
/** @internal - exported for test coverage */
export declare const GIT_SSH_ENV_NAMES: ReadonlySet<string>;
/** @internal - exported for test coverage */
export declare function isGitContextEnvOverrideName(name: string): boolean;
export declare function isGitConfigEnvName(name: string): boolean;
export declare function isTrackedGitEnvName(name: string): boolean;
export declare function parseGitContextAppendEnvAssignment(token: string): {
    name: string;
    value: string;
} | null;
export declare function hasGitSshEnvAssignment(envAssignments?: ReadonlyMap<string, string>): boolean;
export declare function hasConfigAffectingEnvAssignment(envAssignments?: ReadonlyMap<string, string>): boolean;
