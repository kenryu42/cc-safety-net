import { doctorCommand } from './doctor';
import { explainCommand } from './explain';
import { hookCommand } from './hook';
import { ruleCommand } from './rule';
import { statuslineCommand } from './statusline';
import type { Command } from './types';

/** @internal Exported for testing */
export type { Command, CommandOption, CommandSubcommand } from './types';

/**
 * All registered commands.
 * Order determines display order in main help.
 * @internal Exported for testing
 */
export const commands = [
  doctorCommand,
  explainCommand,
  ruleCommand,
  hookCommand,
  statuslineCommand,
] as const satisfies readonly Command[];

export type CommandName = (typeof commands)[number]['name'];
type RegisteredCommand = Command & { name: CommandName };

function getCommandAliases(command: Command): readonly string[] {
  return command.aliases ?? [];
}

function isVisibleCommand(command: Command): boolean {
  return !command.hidden;
}

/**
 * Lookup a command by name or alias.
 * Returns undefined if not found.
 */
export function findCommand(nameOrAlias: string): RegisteredCommand | undefined {
  const normalized = nameOrAlias.toLowerCase();
  return commands.find(
    (cmd) =>
      cmd.name.toLowerCase() === normalized ||
      getCommandAliases(cmd).some((alias) => alias.toLowerCase() === normalized),
  );
}

/**
 * Get all visible commands (non-hidden) for main help display.
 */
export function getVisibleCommands(): readonly Command[] {
  return commands.filter(isVisibleCommand);
}
