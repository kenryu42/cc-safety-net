/**
 * Tests for the doctor command config functions.
 */

import { describe, expect, test } from 'bun:test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getConfigInfo } from '@/bin/doctor/config';
import { syncRulesConfig } from '@/core/rules/policy';
import { withTempDir } from '../../helpers.ts';

function writeRulebook(dir: string, name = 'project-rules') {
  mkdirSync(join(dir, '.cc-safety-net', 'rules', name), { recursive: true });
  writeFileSync(
    join(dir, '.cc-safety-net', 'rules', 'rule.json'),
    JSON.stringify({ version: 1, rules: [name], overrides: {} }),
  );
  writeFileSync(
    join(dir, '.cc-safety-net', 'rules', name, 'rulebook.json'),
    JSON.stringify({
      rulebook_version: 1,
      name,
      version: '1.0.0',
      allowed_commands: ['test'],
      rules: [
        {
          name: 'test-rule',
          command: 'test',
          block_args: ['--dangerous'],
          reason: 'Test reason',
        },
      ],
      tests: [{ command: 'test --dangerous', expect: 'blocked', rule: 'test-rule' }],
    }),
  );
}

describe('getConfigInfo', () => {
  test('handles missing config files', async () => {
    await withTempDir('doctor-test-', (tmpDir) => {
      const info = getConfigInfo(tmpDir);
      expect(info.projectConfig.exists).toBe(false);
      expect(info.effectiveRules).toEqual([]);
      expect(info.shadowedRules).toEqual([]);
    });
  });

  test('detects valid project rules config', async () => {
    await withTempDir('doctor-test-', async (tmpDir) => {
      writeRulebook(tmpDir);
      expect((await syncRulesConfig({ cwd: tmpDir })).ok).toBe(true);

      const info = getConfigInfo(tmpDir);

      expect(info.projectConfig.exists).toBe(true);
      expect(info.projectConfig.valid).toBe(true);
      expect(info.projectConfig.ruleCount).toBe(1);
      expect(info.effectiveRules).toEqual([
        {
          source: 'project',
          name: 'project-rules/test-rule',
          command: 'test',
          blockArgs: ['--dangerous'],
          reason: 'Test reason',
        },
      ]);
    });
  });

  test('detects invalid project rules config', async () => {
    await withTempDir('doctor-test-', (tmpDir) => {
      mkdirSync(join(tmpDir, '.cc-safety-net', 'rules'), { recursive: true });
      writeFileSync(join(tmpDir, '.cc-safety-net', 'rules', 'rule.json'), '{ "version": 2 }');

      const info = getConfigInfo(tmpDir);

      expect(info.projectConfig.exists).toBe(true);
      expect(info.projectConfig.valid).toBe(false);
      expect(info.projectConfig.errors).toContain('version must be 1');
      expect(info.effectiveRules).toEqual([]);
    });
  });

  test('legacy project config is not reported as project rules config', async () => {
    await withTempDir('doctor-test-', (tmpDir) => {
      writeFileSync(join(tmpDir, '.safety-net.json'), JSON.stringify({ version: 1, rules: [] }));

      const info = getConfigInfo(tmpDir);

      expect(info.projectConfig.exists).toBe(false);
      expect(info.effectiveRules).toEqual([]);
    });
  });
});
