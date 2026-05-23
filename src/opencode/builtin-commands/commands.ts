import { CC_SAFETYNET_RULES_TEMPLATE } from '@/opencode/builtin-commands/templates/cc-safetynet-rules';
import type {
  BuiltinCommandName,
  BuiltinCommands,
  CommandDefinition,
} from '@/opencode/builtin-commands/types';

const COMMAND_NAME: BuiltinCommandName = 'cc-safetynet-rules';

export function loadBuiltinCommands(disabledCommands?: BuiltinCommandName[]): BuiltinCommands {
  const disabled = new Set(disabledCommands ?? []);
  const commands: BuiltinCommands = {};
  const definition: CommandDefinition = {
    description: 'Manage Safety Net rulebooks',
    template: CC_SAFETYNET_RULES_TEMPLATE.slice(CC_SAFETYNET_RULES_TEMPLATE.indexOf('## Workflow')),
  };

  if (!disabled.has(COMMAND_NAME)) {
    commands[COMMAND_NAME] = definition;
  }

  return commands;
}
