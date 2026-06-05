import { CC_SAFETY_NET_TEMPLATE } from '@/builtin-commands/templates/cc-safety-net';
import type {
  BuiltinCommandName,
  BuiltinCommands,
  CommandDefinition,
} from '@/opencode/builtin-commands/types';

const COMMAND_NAME: BuiltinCommandName = 'cc-safety-net';

export function loadBuiltinCommands(disabledCommands?: BuiltinCommandName[]): BuiltinCommands {
  const disabled = new Set(disabledCommands ?? []);
  const commands: BuiltinCommands = {};
  const definition: CommandDefinition = {
    description: 'Manage CC Safety Net rulebooks',
    template: CC_SAFETY_NET_TEMPLATE.slice(CC_SAFETY_NET_TEMPLATE.indexOf('## Workflow')),
  };

  if (!disabled.has(COMMAND_NAME)) {
    commands[COMMAND_NAME] = definition;
  }

  return commands;
}
