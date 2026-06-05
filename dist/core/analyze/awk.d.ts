export declare const AWK_INTERPRETERS: Set<string>;
export declare const REASON_AWK_SYSTEM_DYNAMIC = "Detected awk system() call with dynamic command that cannot be safely analyzed.";
export declare function analyzeAwkSystemCalls(tokens: readonly string[], analyzeNested: (command: string) => string | null): string | null;
