import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { analyzeCommand } from '@/core/analyze';
import { loadConfig } from '@/core/config';
import { syncRulesConfig } from '@/core/rules/policy';

async function writeConfig(
  dir: string,
  data: { rules: Array<Record<string, unknown>>; version: number },
) {
  mkdirSync(join(dir, '.cc-safety-net/rules/project-rules'), { recursive: true });
  writeFileSync(
    join(dir, '.cc-safety-net/rules/rule.json'),
    JSON.stringify({ version: 1, rules: ['project-rules'], overrides: {} }),
    'utf-8',
  );
  writeFileSync(
    join(dir, '.cc-safety-net/rules/project-rules/rulebook.json'),
    JSON.stringify({
      rulebook_version: 1,
      name: 'project-rules',
      version: '1.0.0',
      allowed_commands: [...new Set(data.rules.map((rule) => rule.command))],
      rules: data.rules,
      tests: data.rules.map((rule) => ({
        command: [rule.command, rule.subcommand, (rule.block_args as string[] | undefined)?.[0]]
          .filter(Boolean)
          .join(' '),
        expect: 'blocked',
        rule: rule.name,
      })),
    }),
    'utf-8',
  );
  expect((await syncRulesConfig({ cwd: dir })).ok).toBe(true);
}

function runGuard(command: string, cwd?: string): string | null {
  const config = loadConfig(cwd);
  return analyzeCommand(command, { cwd, config })?.reason ?? null;
}

function writeEmptyRulesConfig(dir: string): void {
  mkdirSync(join(dir, '.cc-safety-net/rules'), { recursive: true });
  writeFileSync(
    join(dir, '.cc-safety-net/rules/rule.json'),
    JSON.stringify({ version: 1, rules: [], overrides: {} }),
    'utf-8',
  );
}

function writeLegacyProjectConfig(dir: string): void {
  writeFileSync(join(dir, '.safety-net.json'), JSON.stringify(blockGitAddAllConfig), 'utf-8');
}

function assertBlocked(command: string, reasonContains: string, cwd?: string): void {
  const result = runGuard(command, cwd);
  expect(result).not.toBeNull();
  expect(result).toContain(reasonContains);
}

function assertAllowed(command: string, cwd?: string): void {
  const result = runGuard(command, cwd);
  expect(result).toBeNull();
}

const blockGitAddAllConfig = {
  version: 1,
  rules: [
    {
      name: 'block-git-add-all',
      command: 'git',
      subcommand: 'add',
      block_args: ['-A', '--all', '.'],
      reason: 'Use specific files.',
    },
  ],
};

describe('custom rules integration', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'safety-net-custom-rules-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  test('custom rule blocks command', async () => {
    await writeConfig(tempDir, blockGitAddAllConfig);
    assertBlocked('git add -A', '[project-rules/block-git-add-all] Use specific files.', tempDir);
  });

  test('custom rule blocks with dot', async () => {
    await writeConfig(tempDir, blockGitAddAllConfig);
    assertBlocked('git add .', '[project-rules/block-git-add-all]', tempDir);
  });

  test('custom rule allows non-matching command', async () => {
    await writeConfig(tempDir, {
      version: 1,
      rules: [
        {
          name: 'block-git-add-all',
          command: 'git',
          subcommand: 'add',
          block_args: ['-A'],
          reason: 'Use specific files.',
        },
      ],
    });
    assertAllowed('git add file.txt', tempDir);
  });

  test('builtin rule takes precedence', async () => {
    await writeConfig(tempDir, {
      version: 1,
      rules: [
        {
          name: 'custom-reset-rule',
          command: 'git',
          subcommand: 'reset',
          block_args: ['--soft'],
          reason: 'Custom reason.',
        },
      ],
    });
    // Built-in rule blocks git reset --hard, not custom rule
    assertBlocked('git reset --hard', 'git reset --hard destroys', tempDir);
  });

  test('multiple custom rules - any match triggers block', async () => {
    await writeConfig(tempDir, {
      version: 1,
      rules: [
        {
          name: 'block-git-add-all',
          command: 'git',
          subcommand: 'add',
          block_args: ['-A'],
          reason: 'No blanket add.',
        },
        {
          name: 'block-npm-global',
          command: 'npm',
          subcommand: 'install',
          block_args: ['-g'],
          reason: 'No global installs.',
        },
      ],
    });
    assertBlocked('git add -A', '[project-rules/block-git-add-all]', tempDir);
    assertBlocked('npm install -g pkg', '[project-rules/block-npm-global]', tempDir);
  });

  test('rule without subcommand matches any invocation', async () => {
    await writeConfig(tempDir, {
      version: 1,
      rules: [
        {
          name: 'block-npm-global',
          command: 'npm',
          block_args: ['-g', '--global'],
          reason: 'No global.',
        },
      ],
    });
    assertBlocked('npm install -g pkg', '[project-rules/block-npm-global]', tempDir);
    assertBlocked('npm uninstall -g pkg', '[project-rules/block-npm-global]', tempDir);
  });

  test('no config uses builtin only', () => {
    // tempDir has no config file
    assertBlocked('git reset --hard', 'git reset --hard destroys', tempDir);
    assertAllowed('git add -A', tempDir);
  });

  test('empty rules list uses builtin only', () => {
    writeEmptyRulesConfig(tempDir);
    assertBlocked('git reset --hard', 'git reset --hard destroys', tempDir);
    assertAllowed('git add -A', tempDir);
  });

  test('empty legacy project config without new project config uses builtin only', () => {
    writeFileSync(
      join(tempDir, '.safety-net.json'),
      JSON.stringify({ version: 1, rules: [] }),
      'utf-8',
    );

    assertBlocked('git reset --hard', 'git reset --hard destroys', tempDir);
    assertAllowed('echo hello', tempDir);
  });

  test('legacy project config with rules without new project config fails closed', () => {
    writeLegacyProjectConfig(tempDir);

    assertBlocked(
      'git reset --hard',
      'legacy rules config location is no longer used; ask the user to run `npx -y cc-safety-net rule migrate`',
      tempDir,
    );
    assertBlocked(
      'echo hello',
      'legacy rules config location is no longer used; ask the user to run `npx -y cc-safety-net rule migrate`',
      tempDir,
    );
  });

  test('legacy project config with rules fails closed when new project config has no migration evidence', () => {
    writeLegacyProjectConfig(tempDir);
    writeEmptyRulesConfig(tempDir);

    assertBlocked(
      'git reset --hard',
      'legacy rules config location is no longer used; ask the user to run `npx -y cc-safety-net rule migrate`',
      tempDir,
    );
    assertBlocked(
      'git add -A',
      'legacy rules config location is no longer used; ask the user to run `npx -y cc-safety-net rule migrate`',
      tempDir,
    );
  });

  test('legacy project config is ignored after migration evidence exists', async () => {
    writeLegacyProjectConfig(tempDir);
    await writeConfig(tempDir, blockGitAddAllConfig);
    const rulebookPath = join(tempDir, '.cc-safety-net/rules/project-rules/rulebook.json');
    writeFileSync(
      rulebookPath,
      JSON.stringify({
        rulebook_version: 1,
        name: 'project-rules',
        version: '1.0.0',
        migrated_from: '.safety-net.json',
        allowed_commands: ['git'],
        rules: blockGitAddAllConfig.rules,
        tests: [{ command: 'git add -A', expect: 'blocked', rule: 'block-git-add-all' }],
      }),
      'utf-8',
    );
    expect((await syncRulesConfig({ cwd: tempDir })).ok).toBe(true);

    assertBlocked('git add -A', '[project-rules/block-git-add-all]', tempDir);
  });

  test('custom rules not applied to embedded commands', async () => {
    await writeConfig(tempDir, {
      version: 1,
      rules: [
        {
          name: 'block-git-add-all',
          command: 'git',
          subcommand: 'add',
          block_args: ['-A'],
          reason: 'No blanket add.',
        },
      ],
    });
    // Direct command is blocked
    assertBlocked('git add -A', '[project-rules/block-git-add-all]', tempDir);
    // Embedded in bash -c is NOT blocked by custom rule (per spec)
    assertAllowed("bash -c 'git add -A'", tempDir);
  });

  test('custom rules apply to xargs', async () => {
    await writeConfig(tempDir, {
      version: 1,
      rules: [
        {
          name: 'block-xargs-grep',
          command: 'xargs',
          block_args: ['grep'],
          reason: 'Use ripgrep instead.',
        },
      ],
    });
    assertBlocked('find . | xargs grep pattern', '[project-rules/block-xargs-grep]', tempDir);
  });

  test('custom rules apply to parallel', async () => {
    await writeConfig(tempDir, {
      version: 1,
      rules: [
        {
          name: 'block-parallel-curl',
          command: 'parallel',
          block_args: ['curl'],
          reason: 'No parallel curl.',
        },
      ],
    });
    assertBlocked('parallel curl ::: url1 url2', '[project-rules/block-parallel-curl]', tempDir);
  });

  test('attached option value not false positive', async () => {
    await writeConfig(tempDir, {
      version: 1,
      rules: [
        {
          name: 'block-p-flag',
          command: 'git',
          block_args: ['-p'],
          reason: 'No -p allowed.',
        },
      ],
    });
    // -C/path/to/project contains 'p' in the path, but should NOT match -p
    assertAllowed('git -C/path/to/project status', tempDir);
  });
});
