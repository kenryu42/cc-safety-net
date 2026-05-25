export type BuiltinCommandName = 'cc-safety-net';

export interface CommandDefinition {
  description?: string;
  template: string;
}

export type BuiltinCommands = Record<string, CommandDefinition>;
