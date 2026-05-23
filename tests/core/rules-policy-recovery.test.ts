import { describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  addRulebookSource,
  getProjectRulesConfigPath,
  getProjectRulesDir,
  getProjectRulesLockPath,
  getRulebookCachePath,
  getRulebookDisplaySource,
  getRulesConfigRuntimeErrorsForConfig,
  getRulesConfigSourceDisplayMap,
  getUnknownOverrideErrorsForConfig,
  getUserRulesConfigPath,
  getUserRulesDir,
  getUserRulesLockPath,
  loadRulesPolicy,
  parseGitHubSource,
  type RulebookLockEntry,
  type RulesLockfile,
  readRulesConfig,
  removeRulebookSource,
  repairLocalRulesPolicy,
  rulesPolicyToConfig,
  syncRulesConfig,
  testRulebookSources,
  validateRulesConfig,
  writeDefaultRulesConfig,
  writeStarterRulebook,
} from '@/core/rules/policy';
import { readLockfile } from '@/core/rules/policy/lockfile';
import {
  discoverGitHubRepositoryRulebooks,
  resolveRulebookSource,
  resolveRulebookSourceForSync,
  sha256Digest,
} from '@/core/rules/policy/resolver';
import {
  assertBareRulebookName,
  getRemoveMatches,
  getRulebookSourceSyntaxError,
  getSelectedUpdateSpecs,
  isGitHubRepositorySource,
  isGitHubRulebookSource,
} from '@/core/rules/policy/sources';

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
      path: '.cc-safetynet-rules/project-rules/rulebook.json',
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
      writeFileSync(lockPath, JSON.stringify({ version: 1, rulebooks: [githubEntry] }));
      expect(readLockfile(lockPath).lock?.rulebooks[0]).toEqual(githubEntry);
      expect(getRulebookDisplaySource(githubEntry)).toBe('owner/repo#feature/project-rules');
      expect(getRulebookCachePath(githubEntry, { cacheConfigDir: tempDir })).toContain(
        'owner-repo-feature-project-rules',
      );

      expect(getRulebookSourceSyntaxError('builtin:old')).toContain('Invalid rulebook source');
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
        path: '.cc-safetynet-rules/project-rules/rulebook.json',
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
      path: '.cc-safetynet-rules/alpha/rulebook.json',
      name: 'alpha',
      version: '1.0.0',
      digest: 'sha256:'.padEnd(71, '0'),
    };

    try {
      await expect(resolveRulebookSource('builtin:old', tempDir, {})).rejects.toThrow(
        'Invalid rulebook source',
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
      globalThis.fetch = (async (input: Parameters<typeof fetch>[0]) => {
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
                { path: '.cc-safetynet-rules/zeta/ignored.txt', type: 'blob' },
                { path: '.cc-safetynet-rules/alpha/rulebook.json', type: 'blob' },
              ],
            }),
          );
        }
        if (
          url ===
          'https://raw.githubusercontent.com/owner/repo/abc123/.cc-safetynet-rules/alpha/rulebook.json'
        ) {
          return new Response(alphaRulebook);
        }
        return new Response('', { status: 404 });
      }) as unknown as typeof fetch;

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
      writeFileSync(join(tempDir, '.safety-net.json'), JSON.stringify({ version: 2 }), 'utf-8');
      expect(loadRulesPolicy({ cwd: tempDir, userConfigDir }).errors).toContain(
        'legacy rules config location is no longer used; run `npx cc-safety-net rule migrate`',
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
});
