export interface ShellCommandSegmentInfo {
    tokens: string[];
    hasDynamicSubstitution: boolean;
}
export declare function splitShellCommands(command: string): string[][];
export declare function splitShellCommandsWithInfo(command: string): ShellCommandSegmentInfo[];
