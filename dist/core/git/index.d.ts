import { type GitAnalyzeOptions, type GitWorktreeRelaxation } from '@/core/git/worktree-relaxation';
export declare function analyzeGit(tokens: readonly string[], options?: GitAnalyzeOptions): string | null;
export declare function getGitWorktreeRelaxation(tokens: readonly string[], options?: GitAnalyzeOptions): GitWorktreeRelaxation | null;
