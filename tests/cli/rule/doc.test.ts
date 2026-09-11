import { afterEach, expect, test } from 'bun:test';
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { RULE_DOC } from '@/cli/rule/doc';
import { createTestEnvironment } from '@/core/environment';
import { assertValidRulebook } from '@/core/policy/rulebook';
import { readScopeRulesConfig } from '@/rules-manager/config-file';
import { getScopePaths } from '@/rules-manager/paths';
import { createTempRoot, removeTempRoots } from '../../helpers/temp-home';

afterEach(removeTempRoots);

const examples = [...RULE_DOC.matchAll(/```json\n([\s\S]*?)```/g)].map(
  (match) => JSON.parse(match[1] ?? '') as Record<string, unknown>,
);

test('the document carries the three examples it walks through', () => {
  expect(examples).toHaveLength(3);
});

test('the rule.json example is a config the loader accepts', () => {
  const path = join(createTempRoot('rule-doc-'), 'rule.json');
  writeFileSync(path, JSON.stringify(examples[0]));

  expect(readScopeRulesConfig(path)).toEqual({
    ok: true,
    config: {
      version: 1,
      rules: ['project-rules', 'owner/repo#main/team-rules'],
      overrides: {
        'project-rules/block-docker-system-prune': {
          reason: 'Use targeted Docker cleanup commands.',
        },
        'team-rules/block-npm-global': 'off',
      },
      transparent_wrappers: ['rtk'],
    },
  });
});

test('both rulebook examples are rulebooks the validator accepts', () => {
  expect(() => assertValidRulebook(examples[1])).not.toThrow();
  expect(() =>
    assertValidRulebook({
      rulebook_version: 2,
      name: 'doc-rules',
      version: '1.0.0',
      allowed_commands: ['terraform'],
      rules: [examples[2]],
    }),
  ).not.toThrow();
});

test('the paths it tells an agent to write are the paths the manager resolves', () => {
  const environment = createTestEnvironment({ home: '/home/agent' });
  const scope = (global?: true) => getScopePaths(environment, { cwd: '/work/app', global });

  expect(RULE_DOC).toContain('`~/.cc-safety-net/rules/rule.json`');
  expect(RULE_DOC).toContain('`~/.cc-safety-net/rules/<rulebook-name>/rulebook.json`');
  expect(RULE_DOC).toContain('`.cc-safety-net/rules/rule.json`');
  expect(RULE_DOC).toContain('`.cc-safety-net/rules/<rulebook-name>/rulebook.json`');
  expect(scope(true).configPath).toBe(join('/home/agent', '.cc-safety-net/rules/rule.json'));
  expect(scope().configPath).toBe(resolve('/work/app', '.cc-safety-net/rules/rule.json'));
  expect(RULE_DOC).toContain('`CC_SAFETY_NET_HOME`');
  expect(
    getScopePaths(
      createTestEnvironment({
        home: '/home/agent',
        env: new Map([['CC_SAFETY_NET_HOME', '/elsewhere']]),
      }),
      { cwd: '/work/app', global: true },
    ).configPath,
  ).toBe(resolve('/elsewhere', 'rules/rule.json'));
});
