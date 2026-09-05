import type { Command } from './types';

export const guiCommand = {
  name: 'gui' as const,
  description: 'Open the local policy editor GUI',
  usage: 'gui [options]',
  options: [
    { flags: '--no-open', description: 'Print the URL without opening a browser' },
    { flags: '-h, --help', description: 'Show this help' },
  ],
  examples: ['cc-safety-net gui', 'cc-safety-net gui --no-open'],
} satisfies Command;
