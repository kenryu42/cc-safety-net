import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { syncRulesConfig } from '@/core/rules/policy';

export const initialGitRule = {
  name: 'block-git-add-all',
  subcommand: 'add',
  block_args: ['-A'],
  reason: 'Stage specific files.',
};

export const updatedGitRule = {
  name: 'block-git-status',
  subcommand: 'status',
  block_args: ['status'],
  reason: 'Use porcelain status elsewhere.',
};

export async function syncInitialGitRulebook(dir: string): Promise<void> {
  writeGitRulebook(dir, [initialGitRule]);
  await syncRulesConfig({
    cwd: dir,
    userConfigDir: join(dir, 'home', '.cc-safety-net', 'rules'),
  });
}

export function writeUpdatedGitRulebook(dir: string): void {
  writeGitRulebook(dir, [updatedGitRule]);
}

function writeGitRulebook(
  dir: string,
  rules: Array<{ name: string; subcommand: string; block_args: string[]; reason: string }>,
): void {
  mkdirSync(join(dir, '.cc-safety-net/rules', 'project-rules'), { recursive: true });
  writeFileSync(
    join(dir, '.cc-safety-net/rules', 'rule.json'),
    JSON.stringify({ version: 1, rules: ['project-rules'], overrides: {} }),
    'utf-8',
  );
  writeFileSync(
    join(dir, '.cc-safety-net/rules', 'project-rules', 'rulebook.json'),
    JSON.stringify({
      rulebook_version: 1,
      name: 'project-rules',
      version: '1.0.0',
      allowed_commands: ['git'],
      rules: rules.map((rule) => ({
        name: rule.name,
        command: 'git',
        subcommand: rule.subcommand,
        block_args: rule.block_args,
        reason: rule.reason,
      })),
      tests: rules.map((rule) => ({
        command: `git ${rule.subcommand} ${rule.block_args[0]}`,
        expect: 'blocked',
        rule: rule.name,
      })),
    }),
    'utf-8',
  );
}
