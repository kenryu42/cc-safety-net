/**
 * Rulebook-backed configuration display with source tracking.
 */
import type { ConfigSourceInfo, EffectiveRule, ShadowedRule } from '@/bin/doctor/types';
export interface ConfigInfo {
    userConfig: ConfigSourceInfo;
    projectConfig: ConfigSourceInfo;
    effectiveRules: EffectiveRule[];
    shadowedRules: ShadowedRule[];
}
export interface ConfigInfoOptions {
    userConfigPath?: string;
    projectConfigPath?: string;
}
export declare function getConfigInfo(cwd: string, options?: ConfigInfoOptions): ConfigInfo;
