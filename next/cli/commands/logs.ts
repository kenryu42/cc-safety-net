import type { Command } from './types';

export const logsCommand = {
  name: 'logs' as const,
  description: 'Browse audit log entries recorded by hooks',
  usage: 'logs [options]',
  options: [
    {
      flags: '--id',
      argument: '<id>',
      description:
        'Show one entry from retained history by its 16-character id (not guaranteed once it is older than the configured retention)',
    },
    {
      flags: '--limit',
      argument: '<n>',
      description: 'Maximum entries to print',
      default: '20',
    },
    {
      flags: '--since',
      argument: '<days>',
      description:
        'Only include entries newer than this many days (max: the configured audit retention, 1-365)',
      default: '30',
    },
    {
      flags: '--agent',
      argument: '<name>',
      description: 'Filter by agent name',
    },
    {
      flags: '--rule',
      argument: '<ruleId>',
      description: 'Filter by rule id',
    },
    {
      flags: '--session',
      argument: '<id>',
      description: 'Filter by session id',
    },
    {
      flags: '--project',
      argument: '<path>',
      description: 'Filter by project path',
    },
    {
      flags: '--suspect',
      description: 'Only denials that look like false positives',
    },
    {
      flags: '--all',
      description: 'Include allow entries',
    },
    {
      flags: '--prune-legacy',
      description: 'Permanently delete all legacy root-level logs; nested logs are untouched',
    },
    {
      flags: '--dry-run',
      description: 'With --prune-legacy, report what would be deleted and delete nothing',
    },
    {
      flags: '--json',
      description: 'Output entries as JSON',
    },
    {
      flags: '-h, --help',
      description: 'Show this help',
    },
  ],
  examples: [
    'cc-safety-net logs --id 3fa9c2d1a70e8b42',
    'cc-safety-net logs --agent claude-code',
    'cc-safety-net logs --project . --since 7',
    'cc-safety-net logs --suspect --since 7',
    'cc-safety-net logs --json',
    'cc-safety-net logs --prune-legacy --dry-run',
    'cc-safety-net logs --prune-legacy',
  ],
} satisfies Command;
