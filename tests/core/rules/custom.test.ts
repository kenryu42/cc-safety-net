import { describe, expect, test } from 'bun:test';
import { checkPolicyRuleMatch } from '@/core/rules/custom';
import type { PolicyRule } from '@/core/rules/types';

const V1_RULES: readonly PolicyRule[] = [
  {
    name: 'docker-prune',
    command: 'docker',
    subcommand: 'system',
    block_args: ['prune'],
    reason: 'r',
  },
  {
    name: 'docker-rm-force',
    command: 'docker',
    subcommand: 'rm',
    block_args: ['-f', '--force'],
    reason: 'r',
    intent: 'use_alternative',
  },
  {
    name: 'docker-volume',
    command: 'docker',
    subcommand: 'volume',
    block_args: ['rm', 'prune'],
    reason: 'r',
  },
  {
    name: 'docker-upper',
    command: 'DOCKER',
    subcommand: 'image',
    block_args: ['prune'],
    reason: 'r',
  },
  {
    name: 'git-push-force',
    command: 'git',
    subcommand: 'push',
    block_args: ['--force', '-f'],
    reason: 'r',
  },
  {
    name: 'git-branch-delete',
    command: 'git',
    subcommand: 'branch',
    block_args: ['-D', '-d', '--delete'],
    reason: 'r',
    intent: 'manual_only',
  },
  { name: 'git-any-hard', command: 'git', block_args: ['--hard'], reason: 'r' },
  { name: 'git-clean', command: 'git', subcommand: 'clean', block_args: ['-f', '-x'], reason: 'r' },
  { name: 'git-stash-empty', command: 'git', subcommand: 'stash', block_args: [], reason: 'r' },
  {
    name: 'git-checkout-dash',
    command: 'git',
    subcommand: 'checkout',
    block_args: ['--'],
    reason: 'r',
  },
  {
    name: 'git-exe-reset',
    command: 'C:\\Program Files\\Git\\bin\\git.exe',
    subcommand: 'reset',
    block_args: ['--hard'],
    reason: 'r',
    intent: 'stop_and_explain',
  },
  {
    name: 'npm-publish',
    command: 'npm',
    subcommand: 'publish',
    block_args: ['--access', 'public'],
    reason: 'r',
  },
  {
    name: 'npm-global',
    command: 'npm',
    subcommand: 'install',
    block_args: ['-g', '--global'],
    reason: 'r',
    intent: 'scope_down',
  },
  { name: 'rm-recursive', command: 'rm', block_args: ['-r', '-R'], reason: 'r' },
  { name: 'rm-force', command: 'rm', block_args: ['-f'], reason: 'r', intent: 'hard_stop' },
  {
    name: 'kubectl-delete-all',
    command: 'kubectl',
    subcommand: 'delete',
    block_args: ['--all', '-A'],
    reason: 'r',
  },
  {
    name: 'terraform-destroy-v1',
    command: 'terraform',
    subcommand: 'destroy',
    block_args: ['-auto-approve', '--auto-approve'],
    reason: 'r',
  },
  {
    name: 'gh-repo-delete',
    command: 'gh',
    subcommand: 'repo',
    block_args: ['delete'],
    reason: 'r',
  },
];

function v2(
  name: string,
  command: string,
  match: PolicyRule['match'],
  intent?: PolicyRule['intent'],
): PolicyRule {
  return { name, command, block_args: [], match, reason: `${name} reason`, intent };
}

const V2_RULES: readonly PolicyRule[] = [
  v2('tf-destroy', 'terraform', { command_path: ['destroy'] }),
  v2('tf-apply-destroy', 'terraform', {
    command_path: ['apply'],
    any_args: ['-destroy', '--destroy'],
  }),
  v2('tf-state-rm', 'terraform', {
    command_path: ['state', 'rm'],
    exclude_args: ['-dry-run', '--dry-run'],
  }),
  v2('aws-terminate', 'aws', { command_path: ['ec2', 'terminate-instances'] }, 'hard_stop'),
  v2('aws-s3-rm', 'aws', { command_path: ['s3', 'rm'], exclude_args: ['--dryrun'] }),
  v2('aws-s3-rb', 'aws', { command_path: ['s3', 'rb'], any_args: ['--force'] }),
  v2('aws-rds-delete', 'aws', {
    command_path: ['rds', 'delete-db-instance'],
    any_args: ['--skip-final-snapshot'],
    exclude_args: ['--dry-run'],
  }),
  v2('gcloud-instances-delete', 'gcloud', { command_path: ['compute', 'instances', 'delete'] }),
  v2('gcloud-beta-instances-delete', 'gcloud', {
    command_path: ['beta', 'compute', 'instances', 'delete'],
  }),
  v2('gcloud-projects-delete', 'gcloud', {
    command_path: ['projects', 'delete'],
    any_args: ['--quiet', '-q'],
  }),
  v2(
    'gcloud-sql-delete',
    'gcloud',
    { command_path: ['sql', 'instances', 'delete'] },
    'manual_only',
  ),
  v2('az-group-delete', 'az', { command_path: ['group', 'delete'] }),
  v2('az-vm-delete', 'az', { command_path: ['vm', 'delete'], any_args: ['--yes', '-y'] }),
  v2('az-storage-delete', 'az', {
    command_path: ['storage', 'account', 'delete'],
    exclude_args: ['--dry-run'],
  }),
  v2('az-exe-ad-delete', 'az.exe', { command_path: ['ad', 'app', 'delete'] }, 'use_alternative'),
  v2('docker-prune-all', 'docker', {
    command_path: ['system', 'prune'],
    any_args: ['-a', '--all'],
  }),
  v2('git-push-force-v2', 'git', {
    command_path: ['push'],
    any_args: ['--force', '-f'],
    exclude_args: ['--force-with-lease'],
  }),
  v2('kubectl-delete-ns', 'kubectl', { command_path: ['delete', 'namespace'] }, 'scope_down'),
  v2('nuke-anywhere', 'rm', { command_path: [], any_args: ['--nuke'] }),
];

const matchedId = (tokens: readonly string[], rules: readonly PolicyRule[]) =>
  checkPolicyRuleMatch(tokens, rules)?.id ?? null;

function expectIds(
  rows: readonly { readonly tokens: readonly string[]; readonly id: string | null }[],
  rules: readonly PolicyRule[],
) {
  for (const row of rows) {
    expect(matchedId(row.tokens, rules), row.tokens.join(' ')).toBe(row.id);
  }
}

describe('checkPolicyRuleMatch', () => {
  test('a v1 rule matches its command, subcommand and blocked argument', () => {
    const rows: readonly { readonly tokens: readonly string[]; readonly id: string | null }[] = [
      { tokens: ['docker', 'system', 'prune'], id: 'custom.docker-prune' },
      { tokens: ['docker', '--context', 'prod', 'system', 'prune'], id: 'custom.docker-prune' },
      { tokens: ['docker', '--context=prod', 'system', 'prune'], id: 'custom.docker-prune' },
      {
        tokens: ['docker', '-H', 'tcp://docker.example', 'system', 'prune'],
        id: 'custom.docker-prune',
      },
      { tokens: ['docker', '--context', 'system', 'prune'], id: null },
      { tokens: ['git', 'push', '--force'], id: 'custom.git-push-force' },
      { tokens: ['git', '-C', '/path', 'push', '--force'], id: 'custom.git-push-force' },
      { tokens: ['git', '-C/path', 'push', '--force'], id: 'custom.git-push-force' },
      { tokens: ['git', '--config=foo', 'push', '--force'], id: 'custom.git-push-force' },
      { tokens: ['git', '--', 'checkout', '--'], id: 'custom.git-checkout-dash' },
      { tokens: ['git', '--super-prefix', 'push', 'status', '--force'], id: null },
      { tokens: ['git', 'stash'], id: null },
      { tokens: ['git', 'status'], id: null },
      { tokens: ['npm', 'install', '-g', 'pkg'], id: 'custom.npm-global' },
      { tokens: [], id: null },
    ];
    expectIds(rows, V1_RULES);
  });

  test('a match carries the rule id, the reason and the intent the rule asked for', () => {
    expect(checkPolicyRuleMatch(['git', 'push', '--force'], V1_RULES)).toStrictEqual({
      id: 'custom.git-push-force',
      reason: '[git-push-force] r',
      intent: 'manual_only',
    });
    expect(checkPolicyRuleMatch(['rm', '-f', 'x'], V1_RULES)?.intent).toBe('hard_stop');
    expect(checkPolicyRuleMatch(['npm', 'install', '-g', 'pkg'], V1_RULES)?.intent).toBe(
      'scope_down',
    );
    expect(checkPolicyRuleMatch(['git', 'clean', '-f'], [...V1_RULES].reverse())?.id).toBe(
      'custom.git-clean',
    );
    expect(checkPolicyRuleMatch(['git', 'push', '--force'], [])).toBeNull();
  });

  test('the executable is matched by its normalized basename, the arguments exactly', () => {
    const rows: readonly { readonly tokens: readonly string[]; readonly id: string | null }[] = [
      { tokens: ['GIT', 'push', '-f'], id: 'custom.git-push-force' },
      { tokens: ['/usr/bin/git', 'push', '-f'], id: 'custom.git-push-force' },
      { tokens: ['C:\\Tools\\GIT.EXE', 'push', '-f'], id: 'custom.git-push-force' },
      { tokens: ['git', 'clean', '-fx'], id: 'custom.git-clean' },
      { tokens: ['git', 'clean', '-n'], id: null },
      { tokens: ['git', 'branch', '--delete-all'], id: null },
      { tokens: ['git', 'branch', '--delete'], id: 'custom.git-branch-delete' },
      { tokens: ['docker', 'image', 'prune'], id: 'custom.docker-upper' },
      { tokens: ['npm', 'publish', '--access', 'public'], id: 'custom.npm-publish' },
      { tokens: ['kubectl', 'delete', '--all'], id: 'custom.kubectl-delete-all' },
    ];
    expectIds(rows, V1_RULES);
  });

  test('a v2 rule matches an exact command path, with any_args and exclude_args', () => {
    const rows: readonly { readonly tokens: readonly string[]; readonly id: string | null }[] = [
      { tokens: ['terraform', 'destroy'], id: 'custom.tf-destroy' },
      { tokens: ['terraform', 'plan'], id: null },
      {
        tokens: ['terraform', '-chdir=prod', 'state', 'rm', 'module.old'],
        id: 'custom.tf-state-rm',
      },
      { tokens: ['terraform', 'state', 'rm', '--dry-run'], id: null },
      { tokens: ['terraform', 'apply', '-destroy'], id: 'custom.tf-apply-destroy' },
      { tokens: ['terraform', 'apply', '--destroy=true'], id: null },
      {
        tokens: ['aws', '--profile', 'prod', 'ec2', 'terminate-instances'],
        id: 'custom.aws-terminate',
      },
      { tokens: ['aws', 's3', 'rm', 's3://bucket'], id: 'custom.aws-s3-rm' },
      { tokens: ['aws', 's3', 'rm', 's3://bucket', '--dryrun'], id: null },
      {
        tokens: ['gcloud', 'compute', 'instances', 'delete', 'vm'],
        id: 'custom.gcloud-instances-delete',
      },
      {
        tokens: ['gcloud', 'beta', 'compute', 'instances', 'delete', 'vm'],
        id: 'custom.gcloud-beta-instances-delete',
      },
      { tokens: ['gcloud', 'compute', 'instances', 'create', 'delete'], id: null },
      {
        tokens: ['az', '--subscription', 'prod', 'group', 'delete', '--name', 'rg'],
        id: 'custom.az-group-delete',
      },
      { tokens: ['az', '--subscription', 'prod', 'group', 'list'], id: null },
      { tokens: ['rm', '-rf', '--nuke'], id: 'custom.nuke-anywhere' },
    ];
    expectIds(rows, V2_RULES);
  });
});
