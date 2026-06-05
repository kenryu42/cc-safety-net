import type { Config, ValidationResult } from '@/types';
export interface LoadConfigOptions {
    /** Override user config directory (for testing) */
    userConfigDir?: string;
    /** Repair local rulebook lock/cache state before loading rule-backed rules. */
    repairLocalRulebooks?: boolean;
}
export declare function loadConfig(cwd?: string, options?: LoadConfigOptions): Config;
/** @internal Exported for testing */
export declare function validateConfig(config: unknown): ValidationResult;
export declare function validateConfigFile(path: string): ValidationResult;
export declare function getLegacyProjectConfigPath(cwd?: string): string;
export declare function validateRulesConfigFile(path: string): ValidationResult;
export type { ValidationResult };
