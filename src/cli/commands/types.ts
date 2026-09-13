interface CommandOption {
  flags: string;

  description: string;

  default?: string;

  argument?: string;
}

interface CommandSubcommand {
  usage: string;

  description: string;
}

export interface Command {
  name: string;

  aliases?: string[];

  description: string;

  usage: string;

  options: CommandOption[];

  subcommands?: CommandSubcommand[];

  examples?: string[];

  argument?: string;
}
