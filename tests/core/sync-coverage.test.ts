import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  getProjectRulesConfigPath,
  getProjectRulesDir,
  removeRulebookSource,
  syncRulesConfig,
  testRulebookSources,
  writeDefaultRulesConfig,
} from '@/core/rules/policy';

async function withTempRulesDir<T>(name: string, fn: (tempDir: string) => Promise<T>): Promise<T> {
  const tempDir = mkdtempSync(join(tmpdir(), `${name}-`));
  try {
    return await fn(tempDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function writeProjectRulebook(tempDir: string, name = 'project-rules') {
  const path = join(getProjectRulesDir(tempDir), name, 'rulebook.json');
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(
    path,
    JSON.stringify({
      rulebook_version: 1,
      name,
      version: '1.0.0',
      allowed_commands: ['docker'],
      rules: [
        {
          name: 'block-docker-prune',
          command: 'docker',
          subcommand: 'system',
          block_args: ['prune'],
          reason: 'Use targeted cleanup.',
        },
      ],
      tests: [{ command: 'docker system prune', expect: 'blocked', rule: 'block-docker-prune' }],
    }),
    'utf-8',
  );
}

function writeInvalidLockfile(tempDir: string) {
  writeFileSync(join(getProjectRulesDir(tempDir), 'rule.lock'), 'not valid json', 'utf-8');
}

describe('syncRulesConfig coverage', () => {
  test('returns error when options.only is set and lockfile has errors', () =>
    withTempRulesDir('sync-only-lock-err', async (tempDir) => {
      writeProjectRulebook(tempDir);
      writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['project-rules']);
      writeInvalidLockfile(tempDir);
      const result = await syncRulesConfig({ cwd: tempDir, only: 'project-rules' });
      expect(result.ok).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    }));

  test('returns error when options.only requires partial update without lockfile', () =>
    withTempRulesDir('sync-only-no-lock', async (tempDir) => {
      writeProjectRulebook(tempDir, 'alpha');
      writeProjectRulebook(tempDir, 'beta');
      writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['alpha', 'beta']);
      const result = await syncRulesConfig({ cwd: tempDir, only: 'alpha' });
      expect(result.ok).toBe(false);
      expect(result.errors[0]).toContain('No lockfile available for partial update');
    }));
});

describe('testRulebookSources coverage', () => {
  test('reports fixture test failures with trace', () =>
    withTempRulesDir('test-fixture-fail', async (tempDir) => {
      const rulebookPath = join(getProjectRulesDir(tempDir), 'failing', 'rulebook.json');
      mkdirSync(dirname(rulebookPath), { recursive: true });
      writeFileSync(
        rulebookPath,
        JSON.stringify({
          rulebook_version: 1,
          name: 'failing',
          version: '1.0.0',
          allowed_commands: ['docker'],
          rules: [
            {
              name: 'block-docker-prune',
              command: 'docker',
              subcommand: 'system',
              block_args: ['prune'],
              reason: 'Use targeted cleanup.',
            },
          ],
          tests: [{ command: 'docker ps', expect: 'blocked', rule: 'block-docker-prune' }],
        }),
        'utf-8',
      );
      const result = await testRulebookSources(['failing'], { cwd: tempDir });
      expect(result.ok).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('docker ps');
    }));

  test('catches errors from invalid source specs', () =>
    withTempRulesDir('test-invalid-source', async (tempDir) => {
      const result = await testRulebookSources(['nonexistent-rulebook'], { cwd: tempDir });
      expect(result.ok).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    }));
});

describe('removeRulebookSource coverage', () => {
  test('returns error when config file is invalid JSON', () =>
    withTempRulesDir('remove-invalid-config', async (tempDir) => {
      const configPath = getProjectRulesConfigPath(tempDir);
      mkdirSync(dirname(configPath), { recursive: true });
      writeFileSync(configPath, 'not valid json', 'utf-8');
      const result = await removeRulebookSource('project-rules', { cwd: tempDir });
      expect(result.ok).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    }));

  test('returns error when no config file exists', () =>
    withTempRulesDir('remove-no-config', async (tempDir) => {
      const result = await removeRulebookSource('project-rules', { cwd: tempDir });
      expect(result.ok).toBe(false);
      expect(result.errors[0]).toContain('No config found');
    }));

  test('returns error when lockfile has errors', () =>
    withTempRulesDir('remove-lock-err', async (tempDir) => {
      writeProjectRulebook(tempDir);
      writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['project-rules']);
      writeInvalidLockfile(tempDir);
      const result = await removeRulebookSource('project-rules', { cwd: tempDir });
      expect(result.ok).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    }));

  test('returns error when --delete-source targets non-local source without lock entry', () =>
    withTempRulesDir('remove-delete-nonlocal', async (tempDir) => {
      const spec = 'acme/tools#v2/safety';
      writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), [spec]);
      const lockEntry = {
        spec,
        kind: 'github',
        owner: 'acme',
        repo: 'tools',
        ref: 'v2',
        commit: 'deadbeef',
        path: '.cc-safety-net/rules/safety/rulebook.json',
        name: 'safety',
        version: '2.0.0',
        digest: 'sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      };
      writeFileSync(
        join(getProjectRulesDir(tempDir), 'rule.lock'),
        JSON.stringify({ version: 1, rulebooks: [lockEntry] }),
        'utf-8',
      );
      const result = await removeRulebookSource(spec, { cwd: tempDir, deleteSource: true });
      expect(result.ok).toBe(false);
      expect(result.errors[0]).toContain('--delete-source can only delete local');
    }));
});
