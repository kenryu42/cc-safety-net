import type { Command } from './types';
/** @internal Exported for testing */
export type { Command, CommandOption, CommandSubcommand } from './types';
/**
 * All registered commands.
 * Order determines display order in main help.
 * @internal Exported for testing
 */
export declare const commands: readonly [{
    name: "doctor";
    aliases: string[];
    description: string;
    usage: string;
    options: {
        flags: string;
        description: string;
    }[];
    examples: string[];
}, {
    name: "explain";
    description: string;
    usage: string;
    argument: string;
    options: ({
        flags: string;
        description: string;
        argument?: undefined;
    } | {
        flags: string;
        argument: string;
        description: string;
    })[];
    examples: string[];
}, {
    name: "rule";
    description: string;
    usage: string;
    subcommands: {
        usage: string;
        description: string;
    }[];
    options: {
        flags: string;
        description: string;
    }[];
    examples: string[];
}, {
    name: "hook";
    description: string;
    usage: string;
    subcommands: {
        usage: string;
        description: string;
    }[];
    options: {
        flags: string;
        description: string;
    }[];
    examples: string[];
}, {
    name: "statusline";
    description: string;
    usage: string;
    options: {
        flags: string;
        description: string;
    }[];
    examples: string[];
}];
export type CommandName = (typeof commands)[number]['name'];
type RegisteredCommand = Command & {
    name: CommandName;
};
/**
 * Lookup a command by name or alias.
 * Returns undefined if not found.
 */
export declare function findCommand(nameOrAlias: string): RegisteredCommand | undefined;
/**
 * Get all visible commands (non-hidden) for main help display.
 */
export declare function getVisibleCommands(): readonly Command[];
