import { describe, expect, test } from 'bun:test';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { analyzeCommand } from '@/core/analyze';
import {
  addRulebookSource,
  getProjectRulesConfigPath,
  getProjectRulesDir,
  getRulebookDisplaySource,
  getRulesConfigRuntimeErrorsForConfig,
  getRulesConfigSourceDisplayMap,
  getRulesLockPathForConfigPath,
  getUserRulesConfigPath,
  getUserRulesDir,
  getUserRulesLockPath,
  loadRulesPolicy,
  readRulesConfig,
  removeRulebookSource,
  syncRulesConfig,
  testRulebookSources,
  writeDefaultRulesConfig,
  writeStarterRulebook,
} from '@/core/rules/policy';
import { validateRulesConfig } from '@/core/rules/policy/config-file';
import { readLockfile } from '@/core/rules/policy/lockfile';
import { getProjectRulesLockPath, getRulebookCachePath } from '@/core/rules/policy/paths';
import {
  discoverGitHubRepositoryRulebooks,
  resolveRulebookSource,
  resolveRulebookSourceForSync,
  sha256Digest,
} from '@/core/rules/policy/resolver';
import {
  getUnknownOverrideErrorsForConfig,
  rulesPolicyToConfig,
} from '@/core/rules/policy/scope-policy';
import {
  assertBareRulebookName,
  getRemoveMatches,
  getRulebookSourceSyntaxError,
  getSelectedUpdateSpecs,
  isGitHubRepositorySource,
  isGitHubRulebookSource,
  parseGitHubSource,
} from '@/core/rules/policy/sources';
import { repairLocalRulesPolicy } from '@/core/rules/policy/sync';
import type { RulebookLockEntry, RulesLockfile } from '@/core/rules/policy/types';

type RemoveRulebookSourceTestOptions = NonNullable<Parameters<typeof removeRulebookSource>[1]> & {
  _testDeleteLocalSourceDir: (dir: string) => void;
};
type SyncRulesConfigTestOptions = NonNullable<Parameters<typeof syncRulesConfig>[0]> & {
  _testPruneRulebookCacheDir: (dir: string) => void;
};

function makeTempDir(name: string) {
  return mkdtempSync(join(tmpdir(), `${name}-`));
}

function writeRulebook(path: string, name = 'project-rules') {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, rulebookJson(name), 'utf-8');
}

function rulebookJson(name = 'project-rules') {
  return JSON.stringify({
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
  });
}

function writeProjectRulebook(tempDir: string, name = 'project-rules') {
  const path = join(getProjectRulesDir(tempDir), name, 'rulebook.json');
  mkdirSync(dirname(path), { recursive: true });
  writeRulebook(path, name);
  return path;
}

function writeProjectRulebookConfig(tempDir: string): void {
  writeProjectRulebook(tempDir);
  writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['project-rules']);
}

function writeProjectConfigOnly(tempDir: string): void {
  mkdirSync(getProjectRulesDir(tempDir), { recursive: true });
  writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['project-rules']);
}

async function expectProjectRulesDeleteSourceRemoved(tempDir: string): Promise<void> {
  const removed = await removeRulebookSource('project-rules', {
    cwd: tempDir,
    deleteSource: true,
  });

  expect(removed.ok).toBe(true);
  expect(readRulesConfig(getProjectRulesConfigPath(tempDir)).config?.rules).toEqual([]);
  expect(existsSync(join(getProjectRulesDir(tempDir), 'project-rules'))).toBe(false);
}

async function expectProjectRulesDeleteSourcePreflightError(
  name: string,
  setup: (tempDir: string) => void,
  message: string,
): Promise<void> {
  const tempDir = makeTempDir(name);
  try {
    setup(tempDir);
    const result = await removeRulebookSource('project-rules', {
      cwd: tempDir,
      deleteSource: true,
    });

    expect(result.ok).toBe(false);
    expect(result.errors[0]).toContain(message);
    expect(readRulesConfig(getProjectRulesConfigPath(tempDir)).config?.rules).toEqual([
      'project-rules',
    ]);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function mockGitHubRepoRulebooksFetch(
  rulebooks: Record<string, string>,
  extraTreeEntries: Array<{ path: string; type: 'blob' }> = [],
): typeof fetch {
  const rawPrefix = 'https://raw.githubusercontent.com/owner/repo/abc123/.cc-safety-net/rules/';
  return (async (input: Parameters<typeof fetch>[0]) => {
    const url = String(input);
    switch (url) {
      case 'https://api.github.com/repos/owner/repo':
        return new Response(JSON.stringify({ default_branch: 'main' }));
      case 'https://api.github.com/repos/owner/repo/commits/main':
      case 'https://api.github.com/repos/owner/repo/commits/abc123':
        return new Response(JSON.stringify({ sha: 'abc123' }));
    }
    if (url === 'https://api.github.com/repos/owner/repo/git/trees/abc123?recursive=1') {
      return new Response(
        JSON.stringify({
          tree: [
            ...extraTreeEntries,
            ...Object.keys(rulebooks).map((name) => ({
              path: `.cc-safety-net/rules/${name}/rulebook.json`,
              type: 'blob',
            })),
          ],
        }),
      );
    }
    if (url.startsWith(rawPrefix) && url.endsWith('/rulebook.json')) {
      const name = url.slice(rawPrefix.length).split('/')[0];
      if (name && rulebooks[name]) return new Response(rulebooks[name]);
    }
    return new Response('', { status: 404 });
  }) as unknown as typeof fetch;
}

describe('rules policy recovery coverage', () => {
  test('validates and reads rules config files', () => {
    const tempDir = makeTempDir('rules-policy-config');
    const configPath = join(tempDir, 'rule.json');

    try {
      expect(validateRulesConfig(null).errors).toEqual(['Config must be an object']);
      expect(
        validateRulesConfig({
          version: 2,
          rules: ['bad source!', '', 'project-rules', 'project-rules'],
          overrides: {
            missing: {},
            'project-rules/block-docker-prune': { reason: '' },
            'project-rules/off-rule': 'off',
          },
        }).errors,
      ).toEqual(
        expect.arrayContaining([
          'version must be 1',
          'rules[0]: Local rulebook sources must be bare names matching /^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/: bad source!',
          'rules[1]: must be a non-empty rulebook source string',
          'rules[3]: duplicate rulebook source "project-rules"',
          'overrides.missing: must use <rulebook-name>/<rule-name>',
          'overrides.project-rules/block-docker-prune.reason: required non-empty string',
        ]),
      );

      writeFileSync(configPath, '', 'utf-8');
      expect(readRulesConfig(configPath).errors).toEqual(['Config file is empty']);
      writeFileSync(configPath, '{bad json', 'utf-8');
      expect(readRulesConfig(configPath).errors[0]).toContain('Invalid JSON');
      writeDefaultRulesConfig(configPath, ['project-rules']);
      expect(readRulesConfig(configPath).config?.rules).toEqual(['project-rules']);
      writeStarterRulebook(join(tempDir, 'starter.json'), 'user-rules');
      expect(readFileSync(join(tempDir, 'starter.json'), 'utf-8')).toContain('User-specific');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('parses lockfiles, paths, source syntax, and match helpers', () => {
    const tempDir = makeTempDir('rules-policy-lock');
    const lockPath = join(tempDir, 'rule.lock');
    const githubEntry = {
      spec: 'owner/repo#main/project-rules',
      kind: 'github' as const,
      owner: 'owner',
      repo: 'repo',
      ref: 'main',
      commit: 'abc123',
      path: '.cc-safety-net/rules/project-rules/rulebook.json',
      name: 'project-rules',
      version: '1.0.0',
      digest: 'sha256:'.padEnd(71, 'a'),
      display_ref: 'feature',
    };

    try {
      expect(readLockfile(lockPath)).toEqual({ lock: null, errors: [] });
      writeFileSync(lockPath, '[]', 'utf-8');
      expect(readLockfile(lockPath).errors[0]).toContain('malformed lockfile');
      writeFileSync(lockPath, JSON.stringify({ version: 1, rulebooks: [{ kind: 'bad' }] }));
      expect(readLockfile(lockPath).errors).toContain(
        `${lockPath}: rulebooks[0].kind: unknown kind "bad"`,
      );
      writeFileSync(
        lockPath,
        JSON.stringify({
          version: 1,
          rulebooks: [{ ...githubEntry, spec: ' ', name: ' ', path: ' ' }],
        }),
      );
      expect(readLockfile(lockPath).errors).toEqual(
        expect.arrayContaining([
          `${lockPath}: rulebooks[0].spec: required string`,
          `${lockPath}: rulebooks[0].name: required string`,
          `${lockPath}: rulebooks[0].path: required string`,
        ]),
      );
      writeFileSync(lockPath, JSON.stringify({ version: 1, rulebooks: [githubEntry] }));
      expect(readLockfile(lockPath).lock?.rulebooks[0]).toEqual(githubEntry);
      expect(getRulebookDisplaySource(githubEntry)).toBe('owner/repo#feature/project-rules');
      expect(getRulebookCachePath(githubEntry, { cacheConfigDir: tempDir })).toContain(
        'owner-repo-feature-project-rules',
      );
      expect(getProjectRulesDir(tempDir)).toBe(join(tempDir, '.cc-safety-net', 'rules'));
      expect(
        getRulebookCachePath(githubEntry, { cacheConfigDir: getProjectRulesDir(tempDir) }),
      ).toContain(join(tempDir, '.cc-safety-net', 'cache', 'rulebooks'));

      expect(getRulebookSourceSyntaxError('bad:source')).toContain('Local rulebook sources');
      expect(getRulebookSourceSyntaxError('project-rules')).toBeNull();
      expect(getRulebookSourceSyntaxError('owner/repo#bad@/name')).toContain(
        'refs must be a single path segment',
      );
      expect(getRulebookSourceSyntaxError('owner/repo#main/bad/name')).toContain(
        'GitHub rulebook sources must be',
      );
      expect(isGitHubRepositorySource('owner/repo')).toBe(true);
      expect(isGitHubRulebookSource('owner/repo#main/project-rules')).toBe(true);
      expect(() => assertBareRulebookName('bad source!')).toThrow('Local rulebook sources');
      expect(parseGitHubSource('owner/repo#main/project-rules')).toEqual({
        owner: 'owner',
        repo: 'repo',
        ref: 'main',
        path: '.cc-safety-net/rules/project-rules/rulebook.json',
        name: 'project-rules',
      });
      expect(() => parseGitHubSource('github:owner/repo#main/project-rules')).toThrow();

      const lock: RulesLockfile = {
        version: 1,
        rulebooks: [
          {
            spec: 'one',
            kind: 'local-directory',
            path: 'one',
            name: 'shared',
            version: '1',
            digest: githubEntry.digest,
          },
          {
            spec: 'two',
            kind: 'local-directory',
            path: 'two',
            name: 'shared',
            version: '1',
            digest: githubEntry.digest,
          },
        ],
      };
      expect(
        getSelectedUpdateSpecs({ version: 1, rules: ['one'], overrides: {} }, null, 'one'),
      ).toEqual({
        ok: true,
        specs: ['one'],
      });
      expect(
        getSelectedUpdateSpecs({ version: 1, rules: ['one'], overrides: {} }, null, 'missing'),
      ).toEqual(expect.objectContaining({ ok: false }));
      expect(getRemoveMatches(['one', 'two'], lock, 'shared')).toEqual(
        expect.objectContaining({ ok: false }),
      );
      expect(getRemoveMatches(['owner/repo#main/alpha'], null, 'owner/repo#main')).toEqual({
        ok: true,
        specs: ['owner/repo#main/alpha'],
      });
      expect(getRemoveMatches(['owner/repo#main/alpha'], null, 'owner/repo')).toEqual({
        ok: true,
        specs: ['owner/repo#main/alpha'],
      });
      expect(
        getRemoveMatches(['owner/repo#main/alpha', 'owner/repo#dev/beta'], null, 'owner/repo'),
      ).toEqual(expect.objectContaining({ ok: false }));
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('syncs, loads, repairs, checks, and removes local rulebooks', async () => {
    const tempDir = makeTempDir('rules-policy-sync');
    const userConfigDir = join(tempDir, 'user');

    try {
      writeProjectRulebook(tempDir);
      writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['project-rules']);

      const synced = await syncRulesConfig({ cwd: tempDir, userConfigDir });
      expect(synced.ok).toBe(true);
      expect(synced.entries[0]?.ruleCount).toBe(1);
      expect(existsSync(getProjectRulesLockPath(tempDir))).toBe(true);

      const policy = loadRulesPolicy({ cwd: tempDir, userConfigDir });
      expect(policy.errors).toEqual([]);
      expect(policy.rules[0]?.name).toBe('project-rules/block-docker-prune');
      expect(rulesPolicyToConfig(policy).rules).toHaveLength(1);
      expect(getRulesConfigSourceDisplayMap(getProjectRulesConfigPath(tempDir))).toEqual(
        new Map([['project-rules', 'project-rules']]),
      );

      writeFileSync(
        getProjectRulesConfigPath(tempDir),
        JSON.stringify({
          version: 1,
          rules: ['project-rules'],
          overrides: { 'project-rules/missing': 'off' },
        }),
      );
      expect(
        getUnknownOverrideErrorsForConfig(
          getProjectRulesConfigPath(tempDir),
          getProjectRulesLockPath(tempDir),
          {
            userConfigDir,
          },
        ),
      ).toEqual(['unknown override key "project-rules/missing"']);

      const cachePath = getRulebookCachePath(synced.entries[0] as RulebookLockEntry, {
        cacheConfigDir: getProjectRulesDir(tempDir),
        userConfigDir,
      });
      rmSync(cachePath, { force: true });
      expect((await syncRulesConfig({ cwd: tempDir, userConfigDir, check: true })).ok).toBe(false);
      expect(
        getRulesConfigRuntimeErrorsForConfig(
          getProjectRulesConfigPath(tempDir),
          getProjectRulesLockPath(tempDir),
          {
            userConfigDir,
          },
        )[0],
      ).toContain('missing cache entry');

      repairLocalRulesPolicy({ cwd: tempDir, userConfigDir });
      expect(
        (await removeRulebookSource('project-rules', { cwd: tempDir, userConfigDir })).ok,
      ).toBe(true);
      expect(readRulesConfig(getProjectRulesConfigPath(tempDir)).config?.rules).toEqual([]);

      mkdirSync(join(userConfigDir, 'user-rules'), { recursive: true });
      writeRulebook(join(userConfigDir, 'user-rules', 'rulebook.json'), 'user-rules');
      expect(
        (await addRulebookSource('user-rules', { global: true, cwd: tempDir, userConfigDir })).ok,
      ).toBe(true);
      expect(getUserRulesDir({ userConfigDir })).toBe(userConfigDir);
      expect(getUserRulesConfigPath({ userConfigDir })).toBe(join(userConfigDir, 'rule.json'));
      expect(getUserRulesLockPath({ userConfigDir })).toBe(join(userConfigDir, 'rule.lock'));
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('syncs nonstandard user and project config filenames', async () => {
    const tempDir = makeTempDir('rules-policy-custom-config-paths');
    const userConfigPath = join(tempDir, 'user-rules.custom.json');
    const projectConfigPath = join(tempDir, 'project-rules.custom.json');

    try {
      writeRulebook(join(dirname(userConfigPath), 'user-rules', 'rulebook.json'), 'user-rules');
      writeDefaultRulesConfig(userConfigPath, ['user-rules']);
      writeRulebook(join(dirname(projectConfigPath), 'project-rules', 'rulebook.json'));
      writeDefaultRulesConfig(projectConfigPath, ['project-rules']);

      const userSynced = await syncRulesConfig({ global: true, cwd: tempDir, userConfigPath });
      const projectSynced = await syncRulesConfig({ cwd: tempDir, projectConfigPath });

      expect(userSynced.ok).toBe(true);
      expect(userSynced.entries.map((entry) => entry.name)).toEqual(['user-rules']);
      expect(projectSynced.ok).toBe(true);
      expect(projectSynced.entries.map((entry) => entry.name)).toEqual(['project-rules']);
      expect(
        readLockfile(getRulesLockPathForConfigPath(userConfigPath)).lock?.rulebooks,
      ).toHaveLength(1);
      expect(
        readLockfile(getRulesLockPathForConfigPath(projectConfigPath)).lock?.rulebooks,
      ).toHaveLength(1);
      expect(existsSync(getUserRulesConfigPath({ userConfigPath }))).toBe(false);
      expect(existsSync(getProjectRulesConfigPath(tempDir))).toBe(false);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('removes clean local rulebook source directory when requested', async () => {
    const tempDir = makeTempDir('rules-policy-remove-delete-source');

    try {
      writeProjectRulebookConfig(tempDir);
      const synced = await syncRulesConfig({ cwd: tempDir });
      expect(synced.ok).toBe(true);
      const cachePath = getRulebookCachePath(synced.entries[0] as RulebookLockEntry, {
        cacheConfigDir: getProjectRulesDir(tempDir),
      });
      expect(existsSync(cachePath)).toBe(true);

      await expectProjectRulesDeleteSourceRemoved(tempDir);
      expect(readdirSync(join(tempDir, '.cc-safety-net', 'cache', 'rulebooks'))).toEqual([]);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('removes clean bare local source without a lockfile when requested', async () => {
    const tempDir = makeTempDir('rules-policy-remove-delete-source-bare');

    try {
      writeProjectRulebookConfig(tempDir);
      await expectProjectRulesDeleteSourceRemoved(tempDir);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('refuses to delete dirty local or GitHub rulebook sources', async () => {
    const tempDir = makeTempDir('rules-policy-remove-delete-source-refuse');
    const githubEntry = {
      spec: 'owner/repo#main/alpha',
      kind: 'github' as const,
      owner: 'owner',
      repo: 'repo',
      ref: 'main',
      commit: 'abc123',
      path: '.cc-safety-net/rules/alpha/rulebook.json',
      name: 'alpha',
      version: '1.0.0',
      digest: 'sha256:'.padEnd(71, 'a'),
    };

    try {
      writeProjectRulebook(tempDir);
      writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['project-rules']);
      expect((await syncRulesConfig({ cwd: tempDir })).ok).toBe(true);
      writeFileSync(join(getProjectRulesDir(tempDir), 'project-rules', 'notes.txt'), 'keep me');

      const dirtyResult = await removeRulebookSource('project-rules', {
        cwd: tempDir,
        deleteSource: true,
      });

      expect(dirtyResult.ok).toBe(false);
      expect(dirtyResult.errors[0]).toContain('delete manually');
      expect(readRulesConfig(getProjectRulesConfigPath(tempDir)).config?.rules).toEqual([
        'project-rules',
      ]);

      writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['owner/repo#main/alpha']);
      writeFileSync(
        getProjectRulesLockPath(tempDir),
        JSON.stringify({ version: 1, rulebooks: [githubEntry] }),
      );
      const githubResult = await removeRulebookSource('alpha', {
        cwd: tempDir,
        deleteSource: true,
      });

      expect(githubResult.ok).toBe(false);
      expect(githubResult.errors).toContain(
        '--delete-source can only delete local rulebook sources',
      );
      expect(readRulesConfig(getProjectRulesConfigPath(tempDir)).config?.rules).toEqual([
        'owner/repo#main/alpha',
      ]);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('restores config and lock when delete-source fails after preflight', async () => {
    const tempDir = makeTempDir('rules-policy-remove-delete-source-failure');

    try {
      writeProjectRulebookConfig(tempDir);
      expect((await syncRulesConfig({ cwd: tempDir })).ok).toBe(true);
      const options = {
        cwd: tempDir,
        deleteSource: true,
        _testDeleteLocalSourceDir: () => {
          throw new Error('delete failed');
        },
      } satisfies RemoveRulebookSourceTestOptions;

      const result = await removeRulebookSource('project-rules', options);

      expect(result.ok).toBe(false);
      expect(result.errors[0]).toContain('Failed to delete local rulebook source');
      expect(readRulesConfig(getProjectRulesConfigPath(tempDir)).config?.rules).toEqual([
        'project-rules',
      ]);
      expect(readLockfile(getProjectRulesLockPath(tempDir)).lock?.rulebooks).toHaveLength(1);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('refuses unsafe local source directory shapes before changing config', async () => {
    await expectProjectRulesDeleteSourcePreflightError(
      'rules-policy-remove-delete-source-missing-dir',
      writeProjectConfigOnly,
      'directory not found',
    );
    await expectProjectRulesDeleteSourcePreflightError(
      'rules-policy-remove-delete-source-not-dir',
      (tempDir) => {
        writeProjectConfigOnly(tempDir);
        writeFileSync(join(getProjectRulesDir(tempDir), 'project-rules'), 'not a directory');
      },
      'not a directory',
    );
    await expectProjectRulesDeleteSourcePreflightError(
      'rules-policy-remove-delete-source-missing-rulebook',
      (tempDir) => {
        writeProjectConfigOnly(tempDir);
        mkdirSync(join(getProjectRulesDir(tempDir), 'project-rules'));
      },
      'missing rulebook.json',
    );
    await expectProjectRulesDeleteSourcePreflightError(
      'rules-policy-remove-delete-source-rulebook-dir',
      (tempDir) => {
        writeProjectConfigOnly(tempDir);
        mkdirSync(join(getProjectRulesDir(tempDir), 'project-rules', 'rulebook.json'), {
          recursive: true,
        });
      },
      'rulebook.json is not a file',
    );
    await expectProjectRulesDeleteSourcePreflightError(
      'rules-policy-remove-delete-source-outside',
      (tempDir) => {
        writeProjectRulebookConfig(tempDir);
        writeFileSync(
          getProjectRulesLockPath(tempDir),
          JSON.stringify({
            version: 1,
            rulebooks: [
              {
                spec: 'project-rules',
                kind: 'local-directory',
                path: '../outside',
                name: 'project-rules',
                version: '1.0.0',
                digest: 'sha256:'.padEnd(71, 'a'),
              },
            ],
          }),
        );
      },
      'outside',
    );
  });

  test('refuses to delete symlinked local source directory', async () => {
    const tempDir = makeTempDir('rules-policy-remove-delete-source-symlink-dir');
    const sourceDir = join(getProjectRulesDir(tempDir), 'project-rules');
    const targetDir = join(tempDir, 'outside-source');

    try {
      writeProjectConfigOnly(tempDir);
      mkdirSync(targetDir);
      writeRulebook(join(targetDir, 'rulebook.json'));
      symlinkSync(targetDir, sourceDir, 'dir');

      const result = await removeRulebookSource('project-rules', {
        cwd: tempDir,
        deleteSource: true,
      });

      expect(result.ok).toBe(false);
      expect(result.errors[0]).toContain('not a directory');
      expect(existsSync(join(targetDir, 'rulebook.json'))).toBe(true);
      expect(readRulesConfig(getProjectRulesConfigPath(tempDir)).config?.rules).toEqual([
        'project-rules',
      ]);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('refuses to delete symlinked local source rulebook file', async () => {
    const tempDir = makeTempDir('rules-policy-remove-delete-source-symlink-rulebook');
    const sourceDir = join(getProjectRulesDir(tempDir), 'project-rules');
    const targetPath = join(tempDir, 'outside-rulebook.json');

    try {
      writeProjectConfigOnly(tempDir);
      mkdirSync(sourceDir);
      writeRulebook(targetPath);
      symlinkSync(targetPath, join(sourceDir, 'rulebook.json'));

      const result = await removeRulebookSource('project-rules', {
        cwd: tempDir,
        deleteSource: true,
      });

      expect(result.ok).toBe(false);
      expect(result.errors[0]).toContain('rulebook.json is not a file');
      expect(existsSync(targetPath)).toBe(true);
      expect(readRulesConfig(getProjectRulesConfigPath(tempDir)).config?.rules).toEqual([
        'project-rules',
      ]);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('tests local fixtures and handles GitHub repository inspection errors', async () => {
    const tempDir = makeTempDir('rules-policy-github');
    const originalFetch = globalThis.fetch;

    try {
      writeProjectRulebook(tempDir);
      expect((await testRulebookSources(['project-rules'], { cwd: tempDir })).ok).toBe(true);

      globalThis.fetch = (async () => new Response('', { status: 500 })) as unknown as typeof fetch;
      expect((await addRulebookSource('owner/repo', { cwd: tempDir })).errors[0]).toContain(
        'GitHub returned 500',
      );

      globalThis.fetch = (async (input: Parameters<typeof fetch>[0]) => {
        const url = String(input);
        if (url.endsWith('/repos/owner/repo')) {
          return new Response(JSON.stringify({ default_branch: 'main' }));
        }
        if (url.endsWith('/commits/main')) {
          return new Response(JSON.stringify({ sha: 'abc123' }));
        }
        return new Response(JSON.stringify({ tree: [] }));
      }) as typeof fetch;
      expect((await addRulebookSource('owner/repo', { cwd: tempDir })).errors[0]).toContain(
        'No rulebooks found',
      );
    } finally {
      globalThis.fetch = originalFetch;
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('covers resolver error paths for local and GitHub sources', async () => {
    const tempDir = makeTempDir('rules-policy-resolver-errors');
    const originalFetch = globalThis.fetch;
    const locked = {
      spec: 'owner/repo#main/alpha',
      kind: 'github' as const,
      owner: 'owner',
      repo: 'repo',
      ref: 'main',
      commit: 'abc123',
      path: '.cc-safety-net/rules/alpha/rulebook.json',
      name: 'alpha',
      version: '1.0.0',
      digest: 'sha256:'.padEnd(71, '0'),
    };

    try {
      await expect(resolveRulebookSource('bad:source', tempDir, {})).rejects.toThrow(
        'Local rulebook sources',
      );
      await expect(discoverGitHubRepositoryRulebooks('/repo')).rejects.toThrow(
        'Invalid GitHub repository source',
      );

      globalThis.fetch = (async () =>
        new Response(JSON.stringify({}), { status: 200 })) as unknown as typeof fetch;
      await expect(discoverGitHubRepositoryRulebooks('owner/repo')).rejects.toThrow(
        'missing default branch',
      );

      globalThis.fetch = (async (input: Parameters<typeof fetch>[0]) => {
        const url = String(input);
        if (url === 'https://api.github.com/repos/owner/repo') {
          return new Response(JSON.stringify({ default_branch: 'main' }));
        }
        if (url === 'https://api.github.com/repos/owner/repo/commits/main') {
          return new Response(JSON.stringify({ sha: 'abc123' }));
        }
        return new Response('', { status: 500 });
      }) as unknown as typeof fetch;
      await expect(discoverGitHubRepositoryRulebooks('owner/repo')).rejects.toThrow(
        'GitHub tree returned 500',
      );

      globalThis.fetch = (async (input: Parameters<typeof fetch>[0]) => {
        const url = String(input);
        return url.endsWith('/commits/main')
          ? new Response(JSON.stringify({ sha: 'abc123' }))
          : new Response('', { status: 404 });
      }) as unknown as typeof fetch;
      await expect(resolveRulebookSource('owner/repo#main/alpha', tempDir, {})).rejects.toThrow(
        'GitHub raw returned 404',
      );

      globalThis.fetch = (async (input: Parameters<typeof fetch>[0]) => {
        const url = String(input);
        if (url === 'https://api.github.com/repos/owner/repo/commits/main') {
          return new Response(JSON.stringify({ sha: 'abc123' }));
        }
        if (url.includes('raw.githubusercontent.com')) {
          return new Response(rulebookJson('other'));
        }
        return new Response('', { status: 404 });
      }) as unknown as typeof fetch;
      await expect(resolveRulebookSource('owner/repo#main/alpha', tempDir, {})).rejects.toThrow(
        'must match GitHub source',
      );

      globalThis.fetch = (async (input: Parameters<typeof fetch>[0]) => {
        const url = String(input);
        if (url.includes('raw.githubusercontent.com')) {
          return new Response(rulebookJson('alpha'));
        }
        return new Response('', { status: 404 });
      }) as unknown as typeof fetch;
      await expect(
        resolveRulebookSourceForSync(
          'owner/repo#main/alpha',
          tempDir,
          {},
          {
            version: 1,
            rulebooks: [locked],
          },
        ),
      ).rejects.toThrow('locked GitHub digest mismatch');
    } finally {
      globalThis.fetch = originalFetch;
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('discovers GitHub rulebooks, preserves display refs, and supports partial sync', async () => {
    const tempDir = makeTempDir('rules-policy-github-success');
    const originalFetch = globalThis.fetch;
    const alphaRulebook = rulebookJson('alpha');

    try {
      globalThis.fetch = mockGitHubRepoRulebooksFetch({ alpha: alphaRulebook }, [
        { path: '.cc-safety-net/rules/zeta/ignored.txt', type: 'blob' },
      ]);

      const added = await addRulebookSource('owner/repo', { cwd: tempDir });
      expect(added.ok).toBe(true);
      expect(await discoverGitHubRepositoryRulebooks('owner/repo')).toEqual([
        { spec: 'owner/repo#abc123/alpha', display_ref: 'main' },
      ]);
      expect(readRulesConfig(getProjectRulesConfigPath(tempDir)).config?.rules).toEqual([
        'owner/repo#abc123/alpha',
      ]);
      expect(getRulesConfigSourceDisplayMap(getProjectRulesConfigPath(tempDir))).toEqual(
        new Map([['owner/repo#abc123/alpha', 'owner/repo#main/alpha']]),
      );

      const syncedFromCache = await syncRulesConfig({
        cwd: tempDir,
        only: 'alpha',
      });
      expect(syncedFromCache.ok).toBe(true);
      expect(syncedFromCache.entries[0]?.kind).toBe('github');
      const locked = readLockfile(getProjectRulesLockPath(tempDir)).lock?.rulebooks[0];
      if (!locked || locked.kind !== 'github') throw new Error('missing GitHub lock entry');
      expect(
        (
          await resolveRulebookSourceForSync(
            'owner/repo#abc123/alpha',
            getProjectRulesDir(tempDir),
            {},
            { version: 1, rulebooks: [locked] },
          )
        ).entry,
      ).toEqual(locked);
      expect(
        (await resolveRulebookSource('owner/repo#abc123/alpha', getProjectRulesDir(tempDir), {}))
          .entry.kind,
      ).toBe('github');
      expect(
        getRemoveMatches(
          ['owner/repo#abc123/alpha'],
          readLockfile(getProjectRulesLockPath(tempDir)).lock,
          'owner/repo',
        ),
      ).toEqual({ ok: true, specs: ['owner/repo#abc123/alpha'] });
      expect(
        getRemoveMatches(
          ['owner/repo#abc123/alpha', 'owner/repo#def456/beta'],
          readLockfile(getProjectRulesLockPath(tempDir)).lock,
          'owner/repo',
        ),
      ).toEqual(expect.objectContaining({ ok: false }));
    } finally {
      globalThis.fetch = originalFetch;
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('prunes unreferenced local rulebook caches on sync', async () => {
    const tempDir = makeTempDir('rules-policy-prune-local');

    try {
      writeProjectRulebook(tempDir, 'project-rules');
      writeProjectRulebook(tempDir, 'extra-rules');
      writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['project-rules', 'extra-rules']);
      expect((await syncRulesConfig({ cwd: tempDir })).ok).toBe(true);
      const initialLock = readLockfile(getProjectRulesLockPath(tempDir)).lock;
      if (!initialLock) throw new Error('missing lockfile');
      const extraEntry = initialLock.rulebooks.find((entry) => entry.name === 'extra-rules');
      if (!extraEntry) throw new Error('missing extra-rules entry');
      const extraCachePath = getRulebookCachePath(extraEntry, {
        cacheConfigDir: getProjectRulesDir(tempDir),
      });
      expect(existsSync(extraCachePath)).toBe(true);

      writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['project-rules']);
      expect((await syncRulesConfig({ cwd: tempDir })).ok).toBe(true);
      expect(existsSync(extraCachePath)).toBe(false);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('prunes unreferenced GitHub rulebook caches on sync', async () => {
    const tempDir = makeTempDir('rules-policy-prune-github');
    const originalFetch = globalThis.fetch;

    try {
      globalThis.fetch = mockGitHubRepoRulebooksFetch({
        alpha: rulebookJson('alpha'),
        beta: rulebookJson('beta'),
      });

      const added = await addRulebookSource('owner/repo', { cwd: tempDir });
      expect(added.ok).toBe(true);
      const initialLock = readLockfile(getProjectRulesLockPath(tempDir)).lock;
      if (!initialLock) throw new Error('missing lockfile');
      const betaEntry = initialLock.rulebooks.find(
        (entry) => entry.kind === 'github' && entry.name === 'beta',
      );
      if (!betaEntry) throw new Error('missing beta entry');
      const betaCachePath = getRulebookCachePath(betaEntry, {
        cacheConfigDir: getProjectRulesDir(tempDir),
      });
      expect(existsSync(betaCachePath)).toBe(true);

      writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['owner/repo#abc123/alpha']);
      expect((await syncRulesConfig({ cwd: tempDir })).ok).toBe(true);
      expect(existsSync(betaCachePath)).toBe(false);
    } finally {
      globalThis.fetch = originalFetch;
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('continues sync when cache pruning fails', async () => {
    const tempDir = makeTempDir('rules-policy-prune-warn');

    const cacheDir = join(dirname(getProjectRulesDir(tempDir)), 'cache', 'rulebooks', 'stale');
    try {
      writeProjectRulebook(tempDir, 'project-rules');
      writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['project-rules']);
      expect((await syncRulesConfig({ cwd: tempDir })).ok).toBe(true);

      mkdirSync(cacheDir, { recursive: true });
      writeFileSync(join(cacheDir, 'rulebook.json'), '{}', 'utf-8');
      const options = {
        cwd: tempDir,
        _testPruneRulebookCacheDir: () => {
          throw new Error('prune failed');
        },
      } satisfies SyncRulesConfigTestOptions;
      const synced = await syncRulesConfig(options);
      expect(synced.ok).toBe(true);
      expect(synced.warnings.length).toBeGreaterThan(0);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('covers lock validation, duplicate names, and sync rollback branches', async () => {
    const tempDir = makeTempDir('rules-policy-validation');
    const userConfigDir = join(tempDir, 'user');
    const localEntry = {
      spec: 'project-rules',
      kind: 'local-directory' as const,
      path: 'project-rules',
      name: 'project-rules',
      version: '1.0.0',
      digest: 'sha256:'.padEnd(71, 'a'),
    };

    try {
      writeFileSync(join(tempDir, '.safety-net.json'), '{not json', 'utf-8');
      expect(loadRulesPolicy({ cwd: tempDir, userConfigDir }).errors).toContain(
        'legacy rules config location is no longer used; ask the user to run `npx -y cc-safety-net rule migrate`',
      );

      writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['project-rules']);
      writeFileSync(
        getProjectRulesLockPath(tempDir),
        JSON.stringify({ version: 1, rulebooks: [localEntry] }),
      );
      expect((await syncRulesConfig({ cwd: tempDir, only: 'missing' })).errors[0]).toContain(
        'No configured rulebook matches missing',
      );
      expect((await syncRulesConfig({ cwd: tempDir, only: 'project-rules' })).errors[0]).toContain(
        'Rulebook source not found',
      );

      writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['owner/repo#main/alpha']);
      writeFileSync(getProjectRulesLockPath(tempDir), '{not json', 'utf-8');
      expect(
        (await removeRulebookSource('alpha', { cwd: tempDir, userConfigDir })).errors[0],
      ).toContain('malformed lockfile');
      writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['project-rules']);
      writeFileSync(
        getProjectRulesLockPath(tempDir),
        JSON.stringify({ version: 1, rulebooks: [localEntry] }),
      );

      writeRulebook(
        join(getProjectRulesDir(tempDir), 'project-rules', 'rulebook.json'),
        'actual-name',
      );
      expect((await syncRulesConfig({ cwd: tempDir })).errors[0]).toContain(
        'must match local source',
      );
      expect(readRulesConfig(getProjectRulesConfigPath(tempDir)).config?.rules).toEqual([
        'project-rules',
      ]);

      writeProjectRulebook(tempDir);
      expect((await syncRulesConfig({ cwd: tempDir })).ok).toBe(true);
      const syncedEntry = readLockfile(getProjectRulesLockPath(tempDir)).lock?.rulebooks[0];
      if (!syncedEntry || syncedEntry.kind !== 'local-directory') {
        throw new Error('missing local lock entry');
      }
      expect(
        sha256Digest(
          readFileSync(
            join(getProjectRulesDir(tempDir), 'project-rules', 'rulebook.json'),
            'utf-8',
          ),
        ),
      ).toBe(syncedEntry.digest);
      writeFileSync(
        getProjectRulesLockPath(tempDir),
        JSON.stringify({ version: 1, rulebooks: [{ ...syncedEntry, path: '../outside' }] }),
      );
      expect((await syncRulesConfig({ cwd: tempDir, check: true })).errors[0]).toContain(
        'must stay within',
      );
      writeFileSync(
        getProjectRulesLockPath(tempDir),
        JSON.stringify({ version: 1, rulebooks: [syncedEntry] }),
      );
      writeFileSync(join(getProjectRulesDir(tempDir), 'project-rules', 'rulebook.json'), '{}');
      expect((await syncRulesConfig({ cwd: tempDir, check: true })).errors[0]).toContain(
        'invalid local rulebook',
      );

      writeRulebook(join(userConfigDir, 'shared', 'rulebook.json'), 'shared');
      writeDefaultRulesConfig(getUserRulesConfigPath({ userConfigDir }), ['shared']);
      expect((await syncRulesConfig({ cwd: tempDir, userConfigDir, global: true })).ok).toBe(true);
      writeProjectRulebook(tempDir, 'shared');
      writeDefaultRulesConfig(getProjectRulesConfigPath(tempDir), ['shared']);
      expect((await syncRulesConfig({ cwd: tempDir, userConfigDir })).ok).toBe(true);
      expect(loadRulesPolicy({ cwd: tempDir, userConfigDir }).errors).toContain(
        'duplicate active rulebook name "shared"',
      );
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('loads user rule config once when cwd is the home directory', async () => {
    const tempDir = makeTempDir('rules-policy-home-cwd');
    const homeDir = join(tempDir, 'home');
    const userConfigDir = join(homeDir, '.cc-safety-net', 'rules');

    try {
      writeRulebook(join(userConfigDir, 'user-rules', 'rulebook.json'), 'user-rules');
      writeDefaultRulesConfig(getUserRulesConfigPath({ userConfigDir }), ['user-rules']);
      expect((await syncRulesConfig({ cwd: homeDir, userConfigDir, global: true })).ok).toBe(true);

      const policy = loadRulesPolicy({ cwd: homeDir, userConfigDir });
      const config = rulesPolicyToConfig(policy);

      expect(policy.errors).toEqual([]);
      expect(policy.rulebooks.map((rulebook) => rulebook.source)).toEqual(['user']);
      expect(policy.rules.map((rule) => rule.name)).toEqual(['user-rules/block-docker-prune']);
      expect(config.failClosedReason).toBeUndefined();
      expect(analyzeCommand('echo ok', { cwd: homeDir, config })).toBeNull();
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
