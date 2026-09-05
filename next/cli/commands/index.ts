import { doctorCommand } from './doctor';
import { explainCommand } from './explain';
import { guiCommand } from './gui';
import { hookCommand } from './hook';
import { installCommand, uninstallCommand, updateCommand } from './install';
import { logsCommand } from './logs';
import { policyCommand } from './policy';
import { ruleCommand } from './rule';
import { statusCommand } from './status';
import { statuslineCommand } from './statusline';
import type { Command } from './types';

export type { Command } from './types';

/**
 * All registered commands.
 * Order determines display order in main help.
 */
export const commands = [
  statusCommand,
  doctorCommand,
  logsCommand,
  explainCommand,
  ruleCommand,
  policyCommand,
  installCommand,
  updateCommand,
  uninstallCommand,
  hookCommand,
  guiCommand,
  statuslineCommand,
] as const satisfies readonly Command[];

export type CommandName = (typeof commands)[number]['name'];
type RegisteredCommand = Command & { name: CommandName };

function getCommandAliases(command: Command): readonly string[] {
  return command.aliases ?? [];
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
