declare const integrationMetadata: readonly [{
    readonly id: "claude-code";
    readonly displayName: "Claude Code";
    readonly doctorVisible: true;
    readonly runtimeHook: {
        readonly flags: readonly ["-cc", "--claude-code"];
        readonly description: "Run as Claude Code PreToolUse hook";
        readonly legacyTopLevel: true;
        readonly order: 1;
    };
}, {
    readonly id: "codex";
    readonly displayName: "Codex";
    readonly doctorVisible: true;
}, {
    readonly id: "copilot-cli";
    readonly displayName: "Copilot CLI";
    readonly doctorVisible: true;
    readonly runtimeHook: {
        readonly flags: readonly ["-cp", "--copilot-cli"];
        readonly description: "Run as Copilot CLI PreToolUse hook";
        readonly legacyTopLevel: true;
        readonly order: 2;
    };
}, {
    readonly id: "gemini-cli";
    readonly displayName: "Gemini CLI";
    readonly doctorVisible: true;
    readonly runtimeHook: {
        readonly flags: readonly ["-gc", "--gemini-cli"];
        readonly description: "Run as Gemini CLI BeforeTool hook";
        readonly legacyTopLevel: true;
        readonly order: 3;
    };
}, {
    readonly id: "kimi-cli";
    readonly displayName: "Kimi CLI";
    readonly doctorVisible: true;
    readonly runtimeHook: {
        readonly flags: readonly ["-kc", "--kimi-cli"];
        readonly description: "Run as Kimi CLI PreToolUse hook";
        readonly legacyTopLevel: false;
        readonly order: 4;
    };
}, {
    readonly id: "opencode";
    readonly displayName: "OpenCode";
    readonly doctorVisible: true;
}, {
    readonly id: "pi";
    readonly displayName: "Pi";
    readonly doctorVisible: true;
}];
export type IntegrationId = (typeof integrationMetadata)[number]['id'];
type RuntimeHookIntegrationMetadata = Extract<(typeof integrationMetadata)[number], {
    runtimeHook: object;
}>;
export type RuntimeHookIntegrationId = RuntimeHookIntegrationMetadata['id'];
export declare const doctorIntegrationOrder: ("claude-code" | "codex" | "copilot-cli" | "gemini-cli" | "kimi-cli" | "opencode" | "pi")[];
export declare const runtimeHookIntegrationMetadata: {
    id: "claude-code" | "copilot-cli" | "gemini-cli" | "kimi-cli";
    displayName: "Claude Code" | "Copilot CLI" | "Gemini CLI" | "Kimi CLI";
    flags: readonly ["-cc", "--claude-code"] | readonly ["-cp", "--copilot-cli"] | readonly ["-gc", "--gemini-cli"] | readonly ["-kc", "--kimi-cli"];
    description: "Run as Claude Code PreToolUse hook" | "Run as Copilot CLI PreToolUse hook" | "Run as Gemini CLI BeforeTool hook" | "Run as Kimi CLI PreToolUse hook";
    legacyTopLevel: boolean;
}[];
export declare function getIntegrationDisplayName(id: IntegrationId): string;
export {};
