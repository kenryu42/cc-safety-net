import type { Command } from './types';

export const ruleAddOptions = [
  { flags: '--ref', argument: '<ref>', description: 'Use a branch, tag, or commit' },
  {
    flags: '--only',
    argument: '<rulebook...>',
    description: 'Add only these repository rulebooks',
  },
  { flags: '-g, --global', description: 'Use user-scope rule config' },
  { flags: '-h, --help', description: 'Show this help' },
];

export const ruleAddExamples = [
  'cc-safety-net rule add project-rules',
  'cc-safety-net rule add acme/safety-rules',
  'cc-safety-net rule add acme/safety-rules --only aws gcloud',
  'cc-safety-net rule add acme/safety-rules --ref v2 --only aws',
  'cc-safety-net rule add --only terraform aws',
];

export const ruleCommand = {
  name: 'rule' as const,
  description: 'Manage CC Safety Net rule config and rulebook sources',
  usage: 'rule <subcommand>',
  subcommands: [
    { usage: 'init [--example]', description: 'Create inert rule config' },
    {
      usage: 'add [source] [--ref <ref>] [--only <rulebook...>]',
      description: 'Add rulebook sources and sync',
    },
    { usage: 'remove <source>', description: 'Remove a rulebook source and sync' },
    { usage: 'update [source]', description: 'Re-fetch and vendor remote rulebooks' },
    { usage: 'sync', description: 'Deprecated: migrate lock and cache leftovers' },
    { usage: 'list', description: 'List active rulebooks' },
    { usage: 'wrapper add <command>', description: 'Trust a transparent command wrapper' },
    { usage: 'wrapper remove <command>', description: 'Remove a transparent command wrapper' },
    { usage: 'wrapper list', description: 'List transparent command wrappers' },
    {
      usage: 'tool add <name...> [--cwd-arg <name> | --no-cwd-arg] [--project]',
      description: 'Analyze community shell tools (user scope by default)',
    },
    { usage: 'tool remove <name...> [--project]', description: 'Stop analyzing declared tools' },
    { usage: 'tool list', description: 'List declared command tools in both scopes' },
    { usage: 'migrate [--cleanup]', description: 'Migrate legacy inline rules' },
    { usage: 'doc', description: 'Print the rulebook authoring guide' },
    { usage: 'verify', description: 'Validate rule config files' },
  ],
  options: [
    { flags: '-g, --global', description: 'Use user-scope rule config' },
    { flags: '--cleanup', description: 'Delete legacy files after rule migrate verifies them' },
    { flags: '--delete-source', description: 'Delete clean local source directory on remove' },
    { flags: '--example', description: 'Create an inactive example rulebook with rule init' },
    { flags: '--project', description: 'Use project-scope rule config with rule tool' },
    {
      flags: '--cwd-arg',
      argument: '<name>',
      description: 'Name the working-directory argument with rule tool add',
    },
    {
      flags: '--no-cwd-arg',
      description: 'Read no working-directory argument with rule tool add, for a remote tool',
    },
    ...ruleAddOptions.slice(0, 2),
    { flags: '-h, --help', description: 'Show this help' },
  ],
  examples: [
    'cc-safety-net rule init',
    'cc-safety-net rule init --example',
    'cc-safety-net rule wrapper add rtk',
    'cc-safety-net rule tool add ops_bash',
    'cc-safety-net rule tool add ops_run_background --cwd-arg cwd --project',
    'cc-safety-net rule tool add phone_shell --no-cwd-arg',
    ...ruleAddExamples,
    'cc-safety-net rule update',
    'cc-safety-net rule migrate --cleanup',
    'cc-safety-net rule verify',
  ],
} satisfies Command;
