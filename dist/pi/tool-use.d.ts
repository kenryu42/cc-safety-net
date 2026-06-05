import { analyzeCommand } from '@/core/analyze';
import type { LoadConfigOptions } from '@/core/config';
type PiApi = {
    on: (event: 'tool_call', handler: (event: unknown, ctx: PiToolUseContext) => PiToolUseResult) => void;
};
type PiToolUseContext = {
    cwd: string;
    sessionManager: {
        getSessionFile: () => string | undefined;
    };
    safetyNetAnalyzeCommand?: typeof analyzeCommand;
    safetyNetConfigOptions?: LoadConfigOptions;
};
type PiToolUseResult = {
    block: true;
    reason: string;
} | undefined;
export declare function registerToolUseEvent(pi: PiApi): void;
export declare function handlePiToolUse(event: unknown, ctx: PiToolUseContext): PiToolUseResult;
export {};
