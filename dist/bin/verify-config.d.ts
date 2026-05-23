/**
 * Verify user and project scope config files for safety-net.
 */
export interface VerifyConfigOptions {
    userConfigPath?: string;
    projectConfigPath?: string;
}
export declare function verifyConfig(options?: VerifyConfigOptions): number;
