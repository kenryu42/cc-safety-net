export declare const REASON_SAFETY_NET_FAILED_CLOSED = "CC Safety Net failed closed because command analysis failed unexpectedly.";
type HookDenyOutput = (reason: string, command?: string, segment?: string) => void;
type HookAdapter<T> = {
    outputDeny: HookDenyOutput;
    isSupported: (input: T) => boolean;
    getCommand: (input: T, outputDeny: HookDenyOutput) => string | undefined;
    getCwd: (input: T) => string | undefined;
    getSessionId: (input: T) => string | undefined;
};
type ConfiguredHookAdapter<T> = Omit<HookAdapter<T>, 'outputDeny'> & {
    createDenyOutput: (message: string) => object;
    getManualPermissionAdvice?: (reason: string) => boolean | undefined;
};
export declare function outputHookDeny(createDenyOutput: (message: string) => object, reason: string, command?: string, segment?: string, manualPermissionAdvice?: boolean): void;
export declare function readHookInput<T>(outputDeny: (reason: string) => void): Promise<T | null>;
export declare function parseHookJson<T>(inputText: string, outputDeny: (reason: string) => void, strictReason: string): T | null;
export declare function handleBlockedHookCommand(command: string, cwd: string, sessionId: string | undefined, outputDeny: (reason: string, command?: string, segment?: string) => void): void;
export declare function runHookAdapter<T>(adapter: HookAdapter<T>): Promise<void>;
export declare function runConfiguredHookAdapter<T>(adapter: ConfiguredHookAdapter<T>): Promise<void>;
export {};
