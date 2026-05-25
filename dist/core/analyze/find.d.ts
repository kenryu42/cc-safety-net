import type { AnalyzeNestedOverrides } from '@/types';
export interface AnalyzeFindContext {
    cwd?: string;
    envAssignments?: ReadonlyMap<string, string>;
    analyzeTokens?: (tokens: readonly string[], cwd: string | null | undefined) => string | null;
    analyzeNested?: (command: string, overrides?: AnalyzeNestedOverrides) => string | null;
}
export declare function analyzeFind(tokens: readonly string[], context?: AnalyzeFindContext): string | null;
/**
 * Check if find command has -delete action (not as argument to another option).
 * Handles cases like "find -name -delete" where -delete is a filename pattern.
 */
export declare function findHasDelete(tokens: readonly string[]): boolean;
