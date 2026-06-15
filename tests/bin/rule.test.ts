import { describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RULE_DOC } from '@/bin/rule/doc';
import { runCCSafetyNetCli, withTempDir } from '../helpers';

describe('rule command docs', () => {
  test('documents current rulebook configuration', () => {
    expect(RULE_DOC).toContain('.cc-safety-net/rules/rule.json');
    expect(RULE_DOC).toContain('.cc-safety-net/rules/<rulebook-name>/rulebook.json');
    expect(RULE_DOC).toContain('.cc-safety-net/cache/rulebooks/');
    expect(RULE_DOC).toContain('owner/repo#ref/<rulebook-name>');
    expect(RULE_DOC).toContain('allowed_commands');
    expect(RULE_DOC).toContain('tests');
    expect(RULE_DOC).toContain('overrides');
    expect(RULE_DOC).toContain('<rulebook-name>/<rule-name>');
    expect(RULE_DOC).not.toContain(
      'Agent reference for generating `.safety-net.json` config files.',
    );
  });

  test('prints rule docs', async () => {
    const result = await runCCSafetyNetCli(['rule', 'doc']);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.output).toBe(`${RULE_DOC}\n`);
  });

  test('prints help error when rule subcommand is missing', async () => {
    for (const args of [['rule'], ['rule', '--check']]) {
      const result = await runCCSafetyNetCli(args);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toBe('');
      expect(result.output).toContain('cc-safety-net rule');
      expect(result.output).toContain('SUBCOMMANDS:');
    }
  });

  test('prints successful help for rule help flag', async () => {
    const result = await runCCSafetyNetCli(['rule', '--help']);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.output).toContain('cc-safety-net rule');
    expect(result.output).toContain('--delete-source');
  });

  test('initializes project rules and sibling cache in the canonical layout', async () => {
    await withTempDir('safety-net-rule-init-', async (tempDir) => {
      const result = await runCCSafetyNetCli(
        ['rule', 'init'],
        { HOME: join(tempDir, 'home') },
        tempDir,
      );

      expectSuccessfulCli(result);
      expectCanonicalRulesLayout(tempDir, 'project-rules');
    });
  });

  test('initializes global rules and sibling cache in the canonical layout', async () => {
    await withTempDir('safety-net-rule-init-global-', async (tempDir) => {
      const result = await runCCSafetyNetCli(['rule', 'init', '--global'], {
        CC_SAFETY_NET_HOME: join(tempDir, '.cc-safety-net'),
        HOME: join(tempDir, 'home'),
      });

      expectSuccessfulCli(result);
      expectCanonicalRulesLayout(tempDir, 'user-rules');
    });
  });

  test('reinitializes project rules after removing the default source', async () => {
    await withTempDir('safety-net-rule-init-removed-', async (tempDir) => {
      const env = { HOME: join(tempDir, 'home') };

      expect((await runCCSafetyNetCli(['rule', 'init'], env, tempDir)).exitCode).toBe(0);
      expect(
        (await runCCSafetyNetCli(['rule', 'remove', 'project-rules'], env, tempDir)).exitCode,
      ).toBe(0);
      const result = await runCCSafetyNetCli(['rule', 'init'], env, tempDir);

      expectSuccessfulCli(result);
      expectProjectRulesConfigRules(tempDir, ['project-rules']);
      expectCanonicalRulesLayout(tempDir, 'project-rules');
    });
  });

  test('reinitializes global rules after removing the default source', async () => {
    await withTempDir('safety-net-rule-init-global-removed-', async (tempDir) => {
      const env = globalRuleEnv(tempDir);

      expect((await runCCSafetyNetCli(['rule', 'init', '--global'], env)).exitCode).toBe(0);
      expect(
        (await runCCSafetyNetCli(['rule', 'remove', 'user-rules', '--global'], env)).exitCode,
      ).toBe(0);
      const result = await runCCSafetyNetCli(['rule', 'init', '--global'], env);

      expectSuccessfulCli(result);
      expect(readRulesConfig(join(tempDir, '.cc-safety-net', 'rules', 'rule.json')).rules).toEqual([
        'user-rules',
      ]);
      expectCanonicalRulesLayout(tempDir, 'user-rules');
    });
  });

  test('initialization preserves existing sources and appends the default source', async () => {
    await withTempDir('safety-net-rule-init-existing-', async (tempDir) => {
      writeLocalRulebook(
        join(tempDir, '.cc-safety-net', 'rules', 'team-rules', 'rulebook.json'),
        'team-rules',
      );
      writeFileSync(
        join(tempDir, '.cc-safety-net', 'rules', 'rule.json'),
        JSON.stringify({
          version: 1,
          rules: ['team-rules'],
          overrides: {
            'team-rules/team-rules-rule': 'off',
          },
        }),
      );

      const result = await runCCSafetyNetCli(
        ['rule', 'init'],
        { HOME: join(tempDir, 'home') },
        tempDir,
      );

      expectSuccessfulCli(result);
      expect(readRulesConfig(join(tempDir, '.cc-safety-net', 'rules', 'rule.json'))).toEqual({
        version: 1,
        rules: ['team-rules', 'project-rules'],
        overrides: {
          'team-rules/team-rules-rule': 'off',
        },
      });
    });
  });

  test('initialization does not duplicate an existing default source', async () => {
    await withTempDir('safety-net-rule-init-no-duplicate-', async (tempDir) => {
      const result = await runCCSafetyNetCli(
        ['rule', 'init'],
        { HOME: join(tempDir, 'home') },
        tempDir,
      );
      const secondResult = await runCCSafetyNetCli(
        ['rule', 'init'],
        { HOME: join(tempDir, 'home') },
        tempDir,
      );

      expect(result.exitCode).toBe(0);
      expect(secondResult.exitCode).toBe(0);
      expectProjectRulesConfigRules(tempDir, ['project-rules']);
    });
  });
});

describe('rule list', () => {
  test('prints merged active sources, active rules, overrides, and issues', async () => {
    await withTempDir('safety-net-rule-list-', async (tempDir) => {
      const env = ruleListEnv(tempDir);
      writeLocalRulebook(
        join(tempDir, 'home', '.cc-safety-net', 'rules', 'user-rules', 'rulebook.json'),
        'user-rules',
      );
      writeLocalRulebook(
        join(tempDir, '.cc-safety-net', 'rules', 'project-rules', 'rulebook.json'),
        'project-rules',
      );
      writeFileSync(
        join(tempDir, 'home', '.cc-safety-net', 'rules', 'rule.json'),
        JSON.stringify({
          version: 1,
          rules: ['user-rules'],
          overrides: {
            'user-rules/user-rules-rule': 'off',
          },
        }),
      );
      writeFileSync(
        join(tempDir, '.cc-safety-net', 'rules', 'rule.json'),
        JSON.stringify({
          version: 1,
          rules: ['project-rules'],
          overrides: {
            'project-rules/project-rules-rule': { reason: 'Ask before echo danger.' },
          },
        }),
      );
      expect((await runCCSafetyNetCli(['rule', 'sync', '--global'], env, tempDir)).exitCode).toBe(
        0,
      );
      expect((await runCCSafetyNetCli(['rule', 'sync'], env, tempDir)).exitCode).toBe(0);

      const result = await runRuleList(tempDir, env);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe('');
      expect(result.output).toContain('Active sources (2):');
      expect(result.output).toContain('[user] user-rules 1.0.0');
      expect(result.output).toContain('[project] project-rules 1.0.0');
      expect(result.output).toContain('Active rules (1):');
      expect(result.output).toContain('[project] project-rules/project-rules-rule');
      expect(result.output).toContain('Command: echo');
      expect(result.output).toContain('Reason: Ask before echo danger.');
      expect(result.output).toContain('Disabled rules (1):');
      expect(result.output).toContain('user-rules/user-rules-rule');
      expect(result.output).toContain('Reason overrides (1):');
      expect(result.output).toContain('Issues: (none)');
    });
  });

  test('prints policy issues and exits nonzero', async () => {
    await withTempDir('safety-net-rule-list-issues-', async (tempDir) => {
      writeProjectRulesConfig(tempDir, ['project-rules']);

      const result = await runRuleList(tempDir);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toBe('');
      expect(result.output).toContain('Issues (1):');
      expect(result.output).toContain('missing lockfile');
    });
  });

  test('rejects global list scope', async () => {
    const result = await runCCSafetyNetCli(['rule', 'list', '--global']);

    expect(result.exitCode).toBe(1);
    expect(result.output).toBe('');
    expect(result.stderr).toContain('Unknown option for rule list: --global');
  });

  test('does not load global rules twice when listing from home directory', async () => {
    await withTempDir('safety-net-rule-list-home-cwd-', async (tempDir) => {
      const homeDir = join(tempDir, 'home');
      mkdirSync(homeDir, { recursive: true });
      const env = {
        CC_SAFETY_NET_HOME: join(homeDir, '.cc-safety-net'),
        HOME: homeDir,
      };

      expect((await runCCSafetyNetCli(['rule', 'init', '--global'], env, homeDir)).exitCode).toBe(
        0,
      );
      const result = await runCCSafetyNetCli(['rule', 'list'], env, homeDir);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe('');
      expect(result.output).toContain('Active sources (1):');
      expect(result.output).toContain('[user] user-rules 1.0.0');
      expect(result.output).not.toContain('[project] user-rules 1.0.0');
      expect(result.output).not.toContain('duplicate active rulebook name');
    });
  });

  test('prints empty merged policy', async () => {
    await withTempDir('safety-net-rule-list-empty-', async (tempDir) => {
      const result = await runRuleList(tempDir);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe('');
      expect(result.output).toContain('Active sources: (none)');
      expect(result.output).toContain('Active rules: (none)');
      expect(result.output).toContain('Disabled rules: (none)');
      expect(result.output).toContain('Reason overrides: (none)');
      expect(result.output).toContain('Issues: (none)');
    });
  });
});

describe('rule remove', () => {
  test('removes local project source without deleting editable rulebook by default', async () => {
    await withInitializedProjectRules(
      'safety-net-rule-remove-keep-source-',
      async (tempDir, env) => {
        const result = await runCCSafetyNetCli(['rule', 'remove', 'project-rules'], env, tempDir);

        expectSuccessfulCli(result);
        expectProjectRulesConfigRules(tempDir, []);
        expect(
          existsSync(join(tempDir, '.cc-safety-net', 'rules', 'project-rules', 'rulebook.json')),
        ).toBe(true);
      },
    );
  });

  test('deletes clean local project source with delete-source', async () => {
    await withInitializedProjectRules(
      'safety-net-rule-remove-delete-source-',
      async (tempDir, env) => {
        const result = await runCCSafetyNetCli(
          ['rule', 'remove', 'project-rules', '--delete-source'],
          env,
          tempDir,
        );

        expectSuccessfulCli(result);
        expectProjectRulesConfigRules(tempDir, []);
        expect(existsSync(join(tempDir, '.cc-safety-net', 'rules', 'project-rules'))).toBe(false);
        expect(readdirSync(join(tempDir, '.cc-safety-net', 'cache', 'rulebooks'))).toEqual([]);
      },
    );
  });

  test('accepts delete-source before remove subcommand', async () => {
    await withInitializedProjectRules(
      'safety-net-rule-remove-delete-source-first-',
      async (tempDir, env) => {
        const result = await runCCSafetyNetCli(
          ['rule', '--delete-source', 'remove', 'project-rules'],
          env,
          tempDir,
        );

        expectSuccessfulCli(result);
        expectProjectRulesConfigRules(tempDir, []);
        expect(existsSync(join(tempDir, '.cc-safety-net', 'rules', 'project-rules'))).toBe(false);
      },
    );
  });

  test('fails before changing config when delete-source local directory has extra files', async () => {
    await withInitializedProjectRules(
      'safety-net-rule-remove-dirty-source-',
      async (tempDir, env) => {
        writeFileSync(
          join(tempDir, '.cc-safety-net', 'rules', 'project-rules', 'notes.txt'),
          'keep me',
        );

        const result = await runCCSafetyNetCli(
          ['rule', 'remove', 'project-rules', '--delete-source'],
          env,
          tempDir,
        );

        expect(result.exitCode).toBe(1);
        expect(result.stderr).toContain('delete manually');
        expectProjectRulesConfigRules(tempDir, ['project-rules']);
        expect(existsSync(join(tempDir, '.cc-safety-net', 'rules', 'project-rules'))).toBe(true);
      },
    );
  });

  test('rejects delete-source for GitHub sources before changing config', async () => {
    await withTempDir('safety-net-rule-remove-github-source-', async (tempDir) => {
      writeProjectRulesConfig(tempDir, ['owner/repo#abc123/project-rules']);

      const result = await runCCSafetyNetCli(
        ['rule', 'remove', 'owner/repo#abc123/project-rules', '--delete-source'],
        { HOME: join(tempDir, 'home') },
        tempDir,
      );

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('--delete-source can only delete local rulebook sources');
      expectProjectRulesConfigRules(tempDir, ['owner/repo#abc123/project-rules']);
    });
  });

  test('deletes clean global local source with delete-source', async () => {
    await withInitializedGlobalRules(
      'safety-net-rule-remove-global-delete-source-',
      async (tempDir, env) => {
        const result = await runCCSafetyNetCli(
          ['rule', 'remove', '--global', 'user-rules', '--delete-source'],
          env,
        );

        expectSuccessfulCli(result);
        expect(
          readRulesConfig(join(tempDir, '.cc-safety-net', 'rules', 'rule.json')).rules,
        ).toEqual([]);
        expect(existsSync(join(tempDir, '.cc-safety-net', 'rules', 'user-rules'))).toBe(false);
      },
    );
  });

  test('rejects delete-source on non-remove subcommands', async () => {
    const result = await runCCSafetyNetCli(['rule', 'add', 'project-rules', '--delete-source']);

    expect(result.exitCode).toBe(1);
    expect(result.output).toBe('');
    expect(result.stderr).toContain('Unknown option for rule add: --delete-source');
  });

  test('rejects delete-source without subcommand with remove-specific guidance', async () => {
    const result = await runCCSafetyNetCli(['rule', '--delete-source']);

    expect(result.exitCode).toBe(1);
    expect(result.output).toBe('');
    expect(result.stderr).toContain("--delete-source is only valid with 'rule remove'");
  });
});

function ruleListEnv(tempDir: string): Record<string, string> {
  return {
    CC_SAFETY_NET_HOME: join(tempDir, 'home', '.cc-safety-net'),
    HOME: join(tempDir, 'home'),
  };
}

function projectRuleEnv(tempDir: string): Record<string, string> {
  return { HOME: join(tempDir, 'home') };
}

function globalRuleEnv(tempDir: string): Record<string, string> {
  return {
    CC_SAFETY_NET_HOME: join(tempDir, '.cc-safety-net'),
    HOME: join(tempDir, 'home'),
  };
}

async function withInitializedProjectRules(
  prefix: string,
  fn: (tempDir: string, env: Record<string, string>) => Promise<void>,
) {
  await withTempDir(prefix, async (tempDir) => {
    const env = projectRuleEnv(tempDir);
    expect((await runCCSafetyNetCli(['rule', 'init'], env, tempDir)).exitCode).toBe(0);
    await fn(tempDir, env);
  });
}

async function withInitializedGlobalRules(
  prefix: string,
  fn: (tempDir: string, env: Record<string, string>) => Promise<void>,
) {
  await withTempDir(prefix, async (tempDir) => {
    const env = globalRuleEnv(tempDir);
    expect((await runCCSafetyNetCli(['rule', 'init', '--global'], env)).exitCode).toBe(0);
    await fn(tempDir, env);
  });
}

function writeProjectRulesConfig(tempDir: string, rules: string[]): void {
  mkdirSync(join(tempDir, '.cc-safety-net', 'rules'), { recursive: true });
  writeFileSync(
    join(tempDir, '.cc-safety-net', 'rules', 'rule.json'),
    JSON.stringify({ version: 1, rules, overrides: {} }),
  );
}

function runRuleList(tempDir: string, env = ruleListEnv(tempDir)) {
  return runCCSafetyNetCli(['rule', 'list'], env, tempDir);
}

describe('rule migrate', () => {
  test('rejects unsupported write option', async () => {
    const result = await runCCSafetyNetCli(['rule', 'migrate', '--write']);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Unknown option for rule migrate: --write');
  });

  test('accepts cleanup before migrate subcommand', async () => {
    await withTempDir('safety-net-rule-migrate-cleanup-first-', async (tempDir) => {
      writeLegacyConfig(join(tempDir, '.safety-net.json'), 'block-project-rm', 'rm');

      const result = await runCCSafetyNetCli(
        ['rule', '--cleanup', 'migrate'],
        { HOME: join(tempDir, 'home') },
        tempDir,
      );

      expectSuccessfulCli(result);
      expect(existsSync(join(tempDir, '.safety-net.json'))).toBe(false);
      expectProjectRulesConfigRules(tempDir, ['project-rules']);
    });
  });

  test('migrates project and user legacy rules', async () => {
    await withTempDir('safety-net-rule-migrate-', async (tempDir) => {
      writeLegacyConfig(join(tempDir, '.safety-net.json'), 'block-project-rm', 'rm');
      writeLegacyConfig(
        join(tempDir, 'home', '.cc-safety-net', 'config.json'),
        'block-user-docker',
        'docker',
      );

      const result = await runCCSafetyNetCli(
        ['rule', 'migrate'],
        {
          CC_SAFETY_NET_HOME: join(tempDir, 'home', '.cc-safety-net'),
          HOME: join(tempDir, 'home'),
        },
        tempDir,
      );

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe('');
      expectProjectRulesConfigRules(tempDir, ['project-rules']);
      expect(
        readRulesConfig(join(tempDir, '.cc-safety-net', 'rules', 'rule.json')).overrides,
      ).toEqual({});
      expect(
        readRulebook(join(tempDir, '.cc-safety-net', 'rules', 'project-rules', 'rulebook.json')),
      ).toEqual(
        expect.objectContaining({
          name: 'project-rules',
          migrated_from: '.safety-net.json',
          allowed_commands: ['rm'],
          rules: [legacyRule('block-project-rm', 'rm')],
        }),
      );
      expect(
        readRulebook(
          join(tempDir, 'home', '.cc-safety-net', 'rules', 'user-rules', 'rulebook.json'),
        ),
      ).toEqual(
        expect.objectContaining({
          name: 'user-rules',
          migrated_from: '~/.cc-safety-net/config.json',
          allowed_commands: ['docker'],
          rules: [legacyRule('block-user-docker', 'docker')],
        }),
      );
      expect(existsSync(join(tempDir, '.safety-net.json'))).toBe(true);
      expect(existsSync(join(tempDir, 'home', '.cc-safety-net', 'config.json'))).toBe(true);
    });
  });

  test('appends to existing user config and rerun updates migrated rulebook', async () => {
    await withTempDir('safety-net-rule-migrate-rerun-', async (tempDir) => {
      const userRulesDir = join(tempDir, '.cc-safety-net', 'rules');
      mkdirSync(userRulesDir, { recursive: true });
      writeFileSync(
        join(userRulesDir, 'rule.json'),
        JSON.stringify({
          version: 1,
          rules: ['team-rules'],
          overrides: { 'team-rules/old': 'off' },
        }),
      );
      writeLocalRulebook(join(userRulesDir, 'team-rules', 'rulebook.json'), 'team-rules');
      writeLegacyConfig(
        join(tempDir, '.cc-safety-net', 'config.json'),
        'block-user-docker',
        'docker',
      );

      const env = {
        CC_SAFETY_NET_HOME: join(tempDir, '.cc-safety-net'),
        HOME: join(tempDir, 'home'),
      };
      expect((await runCCSafetyNetCli(['rule', 'migrate'], env, tempDir)).exitCode).toBe(0);
      writeLegacyConfig(join(tempDir, '.cc-safety-net', 'config.json'), 'block-user-git', 'git');
      const result = await runCCSafetyNetCli(['rule', 'migrate'], env, tempDir);

      expect(result.exitCode).toBe(0);
      expect(readRulesConfig(join(userRulesDir, 'rule.json'))).toEqual({
        version: 1,
        rules: ['team-rules', 'user-rules'],
        overrides: { 'team-rules/old': 'off' },
      });
      expect(readRulebook(join(userRulesDir, 'user-rules', 'rulebook.json')).rules).toEqual([
        legacyRule('block-user-git', 'git'),
      ]);
    });
  });

  test('cleanup removes only verified successful legacy configs', async () => {
    await withTempDir('safety-net-rule-migrate-cleanup-', async (tempDir) => {
      writeLegacyConfig(join(tempDir, '.safety-net.json'), 'block-project-rm', 'rm');
      mkdirSync(join(tempDir, 'home', '.cc-safety-net'), { recursive: true });
      writeFileSync(
        join(tempDir, 'home', '.cc-safety-net', 'config.json'),
        JSON.stringify({ version: 2 }),
      );

      const result = await runCCSafetyNetCli(
        ['rule', 'migrate', '--cleanup'],
        {
          CC_SAFETY_NET_HOME: join(tempDir, 'home', '.cc-safety-net'),
          HOME: join(tempDir, 'home'),
        },
        tempDir,
      );

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('version must be 1');
      expect(existsSync(join(tempDir, '.safety-net.json'))).toBe(false);
      expect(existsSync(join(tempDir, 'home', '.cc-safety-net', 'config.json'))).toBe(true);
      expect(readRulesConfig(join(tempDir, '.cc-safety-net', 'rules', 'rule.json')).rules).toEqual([
        'project-rules',
      ]);
    });
  });

  test('chooses unique migrated rulebook name when default already exists', async () => {
    await withTempDir('safety-net-rule-migrate-collision-', async (tempDir) => {
      writeLocalRulebook(
        join(tempDir, '.cc-safety-net', 'rules', 'user-rules', 'rulebook.json'),
        'user-rules',
      );
      writeLegacyConfig(join(tempDir, '.cc-safety-net', 'config.json'), 'block-user-git', 'git');

      const result = await runCCSafetyNetCli(
        ['rule', 'migrate'],
        {
          CC_SAFETY_NET_HOME: join(tempDir, '.cc-safety-net'),
          HOME: join(tempDir, 'home'),
        },
        tempDir,
      );

      expect(result.exitCode).toBe(0);
      expect(readRulesConfig(join(tempDir, '.cc-safety-net', 'rules', 'rule.json')).rules).toEqual([
        'user-rules-2',
      ]);
      expect(
        readRulebook(join(tempDir, '.cc-safety-net', 'rules', 'user-rules-2', 'rulebook.json'))
          .name,
      ).toBe('user-rules-2');
    });
  });
});

describe('rule verify', () => {
  test('returns success with warnings for valid legacy-only user config', async () => {
    await withTempDir('safety-net-rule-verify-legacy-user-', async (tempDir) => {
      writeLegacyConfig(join(tempDir, '.cc-safety-net', 'config.json'), 'block-user-git', 'git');

      const result = await runCCSafetyNetCli(
        ['rule', 'verify'],
        {
          CC_SAFETY_NET_HOME: join(tempDir, '.cc-safety-net'),
          HOME: join(tempDir, 'home'),
        },
        tempDir,
      );

      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('Configs valid with warnings.');
      expect(result.stderr).toContain('Warning: Legacy user config is ignored by CC Safety Net.');
      expect(result.stderr).not.toContain('Config validation failed.');
    });
  });
});

function expectCanonicalRulesLayout(dir: string, rulebookName: string): void {
  expect(existsSync(join(dir, '.cc-safety-net', 'rules', 'rule.json'))).toBe(true);
  expect(existsSync(join(dir, '.cc-safety-net', 'rules', 'rule.lock'))).toBe(true);
  expect(existsSync(join(dir, '.cc-safety-net', 'rules', rulebookName, 'rulebook.json'))).toBe(
    true,
  );
  expect(existsSync(join(dir, '.cc-safety-net', 'cache', 'rulebooks'))).toBe(true);
  expect(existsSync(join(dir, '.cc-safety-net', 'rules', 'cache'))).toBe(false);
}

function expectSuccessfulCli(result: Awaited<ReturnType<typeof runCCSafetyNetCli>>): void {
  expect(result.exitCode).toBe(0);
  expect(result.stderr).toBe('');
}

function expectProjectRulesConfigRules(dir: string, rules: string[]): void {
  expect(readRulesConfig(join(dir, '.cc-safety-net', 'rules', 'rule.json')).rules).toEqual(rules);
}

function writeLegacyConfig(path: string, name: string, command: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(
    path,
    JSON.stringify({
      version: 1,
      rules: [legacyRule(name, command)],
    }),
  );
}

function legacyRule(name: string, command: string) {
  return {
    name,
    command,
    block_args: ['danger'],
    reason: `Do not run ${command} danger.`,
  };
}

function writeLocalRulebook(path: string, name: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(
    path,
    JSON.stringify({
      rulebook_version: 1,
      name,
      version: '1.0.0',
      allowed_commands: ['echo'],
      rules: [legacyRule(`${name}-rule`, 'echo')],
      tests: [{ command: 'echo danger', expect: 'blocked', rule: `${name}-rule` }],
    }),
  );
}

function readRulesConfig(path: string) {
  return JSON.parse(readFileSync(path, 'utf-8')) as {
    version: 1;
    rules: string[];
    overrides: Record<string, unknown>;
  };
}

function readRulebook(path: string) {
  return JSON.parse(readFileSync(path, 'utf-8')) as Record<string, unknown>;
}
