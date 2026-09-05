import type { Command } from './types';

export const policyCommand = {
  name: 'policy' as const,
  description: 'Check and apply project or user policy proposals',
  usage: 'policy <subcommand>',
  subcommands: [
    { usage: 'check <file>', description: 'Validate a policy proposal and print its diff' },
    { usage: 'apply <file>', description: 'Apply a proposal after confirming in a terminal' },
  ],
  options: [
    { flags: '-g, --global', description: 'Use the user-scope policy instead of the project one' },
    { flags: '-h, --help', description: 'Show this help' },
  ],
  examples: [
    'cc-safety-net policy check proposal.json',
    'cc-safety-net policy apply proposal.json',
    'cc-safety-net policy apply proposal.json --global',
  ],
} satisfies Command;
