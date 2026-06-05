import type { AnalyzeNestedOverrides } from '@/types';
export interface AnalyzeFindContext {
    cwd?: string;
    envAssignments?: ReadonlyMap<string, string>;
    analyzeTokens?: (tokens: readonly string[], cwd: string | null | undefined) => string | null;
    analyzeNested?: (command: string, overrides?: AnalyzeNestedOverrides) => string | null;
}
export declare function analyzeFind(tokens: readonly string[], context?: AnalyzeFindContext): string | null;
