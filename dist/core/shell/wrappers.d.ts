export declare function parseEnvAssignment(token: string): {
    name: string;
    value: string;
} | null;
export interface EnvStrippingResult {
    tokens: string[];
    envAssignments: Map<string, string>;
    cwd?: string | null;
}
export declare function stripEnvAssignmentsWithInfo(tokens: string[]): EnvStrippingResult;
export interface WrapperStrippingResult {
    tokens: string[];
    envAssignments: Map<string, string>;
    cwd?: string | null;
}
export declare function stripWrappers(tokens: string[], cwd?: string | null): string[];
export declare function stripWrappersWithInfo(tokens: string[], cwd?: string | null): WrapperStrippingResult;
