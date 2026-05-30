import type { Command } from './types';

export const statuslineCommand = {
  name: 'statusline' as const,
  description: 'Print status line with mode indicators for shell integration',
  usage: 'statusline <coding cli>',
  options: [
    {
      flags: '-cc, --claude-code',
      description: 'Print status line for Claude Code',
    },
    {
      flags: '-h, --help',
      description: 'Show this help',
    },
  ],
  examples: ['cc-safety-net statusline -cc', 'cc-safety-net statusline --claude-code'],
} satisfies Command;
