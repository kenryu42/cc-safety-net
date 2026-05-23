import { type GitRuleMatch } from './rules';
export interface GitAnalyzeOptions {
    cwd?: string;
    envAssignments?: ReadonlyMap<string, string>;
    worktreeMode?: boolean;
}
export interface GitWorktreeRelaxation {
    originalReason: string;
    gitCwd: string;
}
export declare function getGitWorktreeRelaxationForMatch(tokens: readonly string[], match: GitRuleMatch, options: GitAnalyzeOptions): GitWorktreeRelaxation | null;
