import type { Command } from './types';

export const ruleCommand: Command = {
  name: 'rule',
  description: 'Manage Safety Net rulebook sources',
  usage: 'rule <subcommand>',
  subcommands: [
    { usage: 'init', description: 'Create starter rule config and rulebook files' },
    { usage: 'add <source>', description: 'Add a rulebook source and sync' },
    { usage: 'remove <source>', description: 'Remove a rulebook source and sync' },
    { usage: 'update [source]', description: 'Refresh rulebook lock/cache state' },
    { usage: 'sync', description: 'Sync configured rulebooks' },
    { usage: 'list', description: 'List active rulebooks' },
    { usage: 'test [source]', description: 'Run rulebook fixtures' },
    { usage: 'doc', description: 'Print the rulebook authoring guide' },
    { usage: 'verify', description: 'Validate rule config files' },
  ],
  options: [
    { flags: '-g, --global', description: 'Use user-scope rule config' },
    { flags: '--check', description: 'Check without changing lock/cache state' },
    { flags: '-h, --help', description: 'Show this help' },
  ],
  examples: [
    'cc-safety-net rule init',
    'cc-safety-net rule add project-rules',
    'cc-safety-net rule sync',
    'cc-safety-net rule verify',
  ],
};
