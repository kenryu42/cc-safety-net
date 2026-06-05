import { analyzeCommand } from '@/core/analyze';
import type { LoadConfigOptions } from '@/core/config';
type PiApi = {
    on: (event: 'tool_call', handler: (event: unknown, ctx: PiToolCallContext) => PiToolCallResult) => void;
};
type PiToolCallContext = {
    cwd: string;
    sessionManager: {
        getSessionFile: () => string | undefined;
    };
    safetyNetAnalyzeCommand?: typeof analyzeCommand;
    safetyNetConfigOptions?: LoadConfigOptions;
};
type PiToolCallResult = {
    block: true;
    reason: string;
} | undefined;
export declare function registerToolCallEvent(pi: PiApi): void;
/** @internal - exported for test coverage */
export declare function handlePiToolCall(event: unknown, ctx: PiToolCallContext): PiToolCallResult;
export {};
