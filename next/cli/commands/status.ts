import type { Command } from './types';

export const statusCommand = {
  name: 'status' as const,
  description: 'Show what the runtime is enforcing right now',
  usage: 'status',
  options: [
    {
      flags: '-h, --help',
      description: 'Show this help',
    },
  ],
  examples: ['cc-safety-net status'],
} satisfies Command;
