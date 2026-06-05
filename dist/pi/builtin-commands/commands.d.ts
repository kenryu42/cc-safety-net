type PiCommandApi = {
    registerCommand: (name: 'cc-safety-net', command: {
        description: string;
        handler: (args: string, ctx: PiCommandContext) => Promise<void>;
    }) => void;
    sendUserMessage: (content: string, options?: {
        deliverAs: 'followUp';
    }) => void;
};
type PiCommandContext = {
    isIdle: () => boolean;
};
export declare function registerBuiltinCommands(pi: PiCommandApi): void;
export declare function buildSafetyNetCommandPrompt(args: string): string;
export {};
