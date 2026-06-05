export interface EnvFlag {
    name: string;
    legacyName?: string;
}
export declare const ENV_FLAGS: {
    readonly strict: {
        readonly name: "CC_SAFETY_NET_STRICT";
        readonly legacyName: "SAFETY_NET_STRICT";
    };
    readonly paranoid: {
        readonly name: "CC_SAFETY_NET_PARANOID";
        readonly legacyName: "SAFETY_NET_PARANOID";
    };
    readonly paranoidRm: {
        readonly name: "CC_SAFETY_NET_PARANOID_RM";
        readonly legacyName: "SAFETY_NET_PARANOID_RM";
    };
    readonly paranoidInterpreters: {
        readonly name: "CC_SAFETY_NET_PARANOID_INTERPRETERS";
        readonly legacyName: "SAFETY_NET_PARANOID_INTERPRETERS";
    };
    readonly worktree: {
        readonly name: "CC_SAFETY_NET_WORKTREE";
        readonly legacyName: "SAFETY_NET_WORKTREE";
    };
    readonly debug: {
        readonly name: "CC_SAFETY_NET_DEBUG";
    };
};
export declare function getCCSafetyNetEnvModes(): {
    strict: boolean;
    paranoidAll: boolean;
    paranoidRm: boolean;
    paranoidInterpreters: boolean;
    worktreeMode: boolean;
};
export declare function envTruthy(flag: string | EnvFlag): boolean;
export declare function getEnvFlagValue(flag: EnvFlag): string | undefined;
export declare function envFlagIsSet(flag: EnvFlag): boolean;
