export declare const TRUSTED_GIT_BINARIES: readonly ["/usr/bin/git", "/usr/local/bin/git", "/opt/homebrew/bin/git", "C:\\Program Files\\Git\\cmd\\git.exe", "C:\\Program Files\\Git\\bin\\git.exe"];
export declare function hasRecursiveSubmoduleConfig(tokens: readonly string[], envAssignments: ReadonlyMap<string, string> | undefined, gitCwd: string): boolean;
export declare function effectiveGitConfigEnablesRecursiveSubmodules(cwd: string, gitBinary?: string | null): boolean;
