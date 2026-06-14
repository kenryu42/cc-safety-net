import type { PluginInput } from '@opencode-ai/plugin';
type CCSafetyNetPluginInput = PluginInput & {
    homeDir?: string;
};
export declare const CCSafetyNetPlugin: ({ directory, homeDir }: CCSafetyNetPluginInput) => Promise<{
    config: (opencodeConfig: Record<string, unknown>) => Promise<void>;
    'tool.execute.before': (input: {
        tool: string;
        sessionID: string;
        callID: string;
    }, output: {
        args: any;
    }) => Promise<void>;
}>;
export {};
