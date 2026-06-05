import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { runRulebookFixtures } from '@/core/rules/rulebook';
import { NAME_PATTERN } from '@/types';
import { readRulesConfig, readScopeRulesConfig, writeJsonAtomic } from './config-file';
import { readLockfile } from './lockfile';
import { getRulebookCachePath, getScopePaths, RULE_SYNC_COMMAND } from './paths';
import {
  type DiscoveredRulebookSource,
  discoverGitHubRepositoryRulebooks,
  type ResolvedRulebook,
  resolveLocalRulebook,
  resolveRulebookSource,
  resolveRulebookSourceForSync,
} from './resolver';
import { loadScopePolicy } from './scope-policy';
import { getRemoveMatches, getSelectedUpdateSpecs, isGitHubRepositorySource } from './sources';
import type {
  RulebookLockEntry,
  RulebookLockEntryWithStats,
  RulesConfig,
  RulesLockfile,
  RulesPolicyOptions,
  SyncRulesConfigOptions,
  SyncRulesConfigResult,
} from './types';

interface InternalSyncRulesConfigOptions extends SyncRulesConfigOptions {
  discoveredDisplayRefs?: Map<string, string>;
  _testDeleteLocalSourceDir?: (dir: string) => void;
  _testPruneRulebookCacheDir?: (dir: string) => void;
}

interface RemoveRulebookSourceOptions extends SyncRulesConfigOptions {
  deleteSource?: boolean;
}

export async function syncRulesConfig(
  options: SyncRulesConfigOptions = {},
): Promise<SyncRulesConfigResult> {
  const internalOptions = options as InternalSyncRulesConfigOptions;
  const scope = getScopePaths(options);
  const scopeConfig = readScopeRulesConfig(scope.configPath);
  if (!scopeConfig.ok) return scopeConfig.result;
  const config = scopeConfig.config;

  if (options.check) {
    return checkRulesConfig(config, scope.configDir, scope.lockPath, options);
  }

  try {
    const existingLockResult = readLockfile(scope.lockPath);
    if (options.only && existingLockResult.errors.length > 0) {
      return { ok: false, errors: existingLockResult.errors, warnings: [], entries: [] };
    }
    const previousLock = existingLockResult.errors.length > 0 ? null : existingLockResult.lock;
    const selectedSpecs = options.only
      ? getSelectedUpdateSpecs(config, previousLock, options.only)
      : { ok: true as const, specs: config.rules };
    if (!selectedSpecs.ok) {
      return selectedSpecs.result;
    }
    if (options.only && !previousLock && selectedSpecs.specs.length < config.rules.length) {
      return {
        ok: false,
        errors: [`No lockfile available for partial update; run ${RULE_SYNC_COMMAND}`],
        warnings: [],
        entries: [],
      };
    }
    const resolved = (
      await Promise.all(
        selectedSpecs.specs.map((spec) =>
          resolveRulebookSourceForSync(spec, scope.configDir, options, previousLock),
        ),
      )
    ).map((item) => preserveDisplayRef(item, previousLock, internalOptions.discoveredDisplayRefs));
    for (const item of resolved) {
      writeCache(item.content, item.entry, scope.configDir, options);
    }
    const entries = options.only
      ? mergeSelectedLockEntries(config, previousLock, resolved)
      : resolved.map((item) => item.entry);
    writeJsonAtomic(scope.lockPath, { version: 1, rulebooks: entries });
    const ruleCountsBySpec = new Map(
      resolved.map((item) => [item.entry.spec, item.rulebook.rules.length]),
    );
    const warnings = pruneUnreferencedRulebookCaches(entries, scope.configDir, options);
    return {
      ok: true,
      errors: [],
      warnings,
      entries: entries.map((entry) => addRuleCount(entry, ruleCountsBySpec)),
    };
  } catch (error) {
    return failWithError(error);
  }
}

export async function testRulebookSources(
  sources: string[],
  options: SyncRulesConfigOptions = {},
): Promise<SyncRulesConfigResult> {
  const scope = getScopePaths(options);
  try {
    const resolved = await Promise.all(
      sources.map((spec) => resolveRulebookSource(spec, scope.configDir, options)),
    );
    const ruleCountsBySpec = new Map(
      resolved.map((item) => [item.entry.spec, item.rulebook.rules.length]),
    );
    const testCountsBySpec = new Map(
      resolved.map((item) => [item.entry.spec, item.rulebook.tests.length]),
    );
    const fixtureErrors = resolved.flatMap((item) =>
      runRulebookFixtures(item.rulebook).failures.map((failure) =>
        [
          `${item.entry.spec}: ${failure.command}: ${failure.message}`,
          ...failure.trace.map((line) => `  ${line}`),
        ].join('\n'),
      ),
    );
    return {
      ok: fixtureErrors.length === 0,
      errors: fixtureErrors,
      warnings: [],
      entries: resolved.map((item) => ({
        ...addRuleCount(item.entry, ruleCountsBySpec),
        testCount: testCountsBySpec.get(item.entry.spec),
      })),
    };
  } catch (error) {
    return failWithError(error);
  }
}

export async function addRulebookSource(
  source: string,
  options: SyncRulesConfigOptions = {},
): Promise<SyncRulesConfigResult> {
  const scope = getScopePaths(options);
  mkdirSync(scope.configDir, { recursive: true });
  const before = existsSync(scope.configPath) ? readFileSync(scope.configPath, 'utf-8') : null;
  const scopeConfig = readScopeRulesConfig(scope.configPath);
  if (!scopeConfig.ok) return scopeConfig.result;
  const config = scopeConfig.config;
  let discoveredSources: DiscoveredRulebookSource[];
  try {
    discoveredSources = isGitHubRepositorySource(source)
      ? await discoverGitHubRepositoryRulebooks(source)
      : [{ spec: source }];
  } catch (error) {
    return {
      ok: false,
      errors: [error instanceof Error ? error.message : String(error)],
      warnings: [],
      entries: [],
    };
  }
  const sources = discoveredSources.map((item) => item.spec);
  const nextRules = [...config.rules, ...sources.filter((item) => !config.rules.includes(item))];
  if (nextRules.length !== config.rules.length) {
    writeJsonAtomic(scope.configPath, {
      version: 1,
      rules: nextRules,
      overrides: config.overrides ?? {},
    });
  }
  const result = await syncRulesConfig({
    ...options,
    discoveredDisplayRefs: new Map(
      discoveredSources
        .filter((item): item is Required<DiscoveredRulebookSource> => !!item.display_ref)
        .map((item) => [item.spec, item.display_ref]),
    ),
  } as InternalSyncRulesConfigOptions);
  if (!result.ok) {
    restoreConfig(scope.configPath, before);
  }
  return result;
}

export async function removeRulebookSource(
  match: string,
  options: RemoveRulebookSourceOptions = {},
): Promise<SyncRulesConfigResult> {
  const internalOptions = options as InternalSyncRulesConfigOptions;
  const scope = getScopePaths(options);
  const loaded = readRulesConfig(scope.configPath);
  if (loaded.errors.length > 0) {
    return { ok: false, errors: loaded.errors, warnings: [], entries: [] };
  }
  if (!loaded.config) {
    return {
      ok: false,
      errors: [`No config found at ${scope.configPath}`],
      warnings: [],
      entries: [],
    };
  }
  const lockResult = readLockfile(scope.lockPath);
  if (lockResult.errors.length > 0) {
    return { ok: false, errors: lockResult.errors, warnings: [], entries: [] };
  }
  const matches = getRemoveMatches(loaded.config.rules, lockResult.lock, match);
  if (!matches.ok) return matches.result;
  const sourceDirs = options.deleteSource
    ? getLocalSourceDirsForDelete(scope.configDir, matches.specs, lockResult.lock)
    : { ok: true as const, dirs: [] };
  if (!sourceDirs.ok) return sourceDirs.result;
  const before = readFileSync(scope.configPath, 'utf-8');
  writeJsonAtomic(scope.configPath, {
    version: 1,
    rules: loaded.config.rules.filter((spec) => !matches.specs.includes(spec)),
    overrides: loaded.config.overrides ?? {},
  });
  const result = await syncRulesConfig(options);
  if (!result.ok) {
    restoreConfig(scope.configPath, before);
    return result;
  }
  const deleteResult = deleteLocalSourceDirs(sourceDirs.dirs, internalOptions);
  if (!deleteResult.ok) {
    restoreConfig(scope.configPath, before);
    const rollback = await syncRulesConfig(options);
    if (!rollback.ok) {
      return {
        ok: false,
        errors: [...deleteResult.result.errors, ...rollback.errors],
        warnings: rollback.warnings,
        entries: rollback.entries,
      };
    }
    return deleteResult.result;
  }
  return result;
}

export function repairLocalRulesPolicy(options: RulesPolicyOptions = {}): void {
  repairLocalRulesScope({ ...options, global: true });
  repairLocalRulesScope({ ...options, global: false });
}

async function checkRulesConfig(
  config: RulesConfig,
  configDir: string,
  lockPath: string,
  options: RulesPolicyOptions,
): Promise<SyncRulesConfigResult> {
  const result = loadScopePolicy(config, lockPath, configDir, options, 'project');
  return {
    ok: result.errors.length === 0,
    errors: result.errors,
    warnings: [],
    entries: result.entries,
  };
}

function repairLocalRulesScope(options: SyncRulesConfigOptions): void {
  const scope = getScopePaths(options);
  const loaded = readRulesConfig(scope.configPath);
  if (!loaded.config || loaded.errors.length > 0 || loaded.config.rules.length === 0) {
    return;
  }
  if (!loaded.config.rules.every((spec) => /^[a-zA-Z0-9_-]{1,64}$/.test(spec))) {
    return;
  }
  try {
    const resolved = loaded.config.rules.map((spec) =>
      resolveLocalRulebook(spec, scope.configDir, options),
    );
    for (const item of resolved) {
      writeCache(item.content, item.entry, scope.configDir, options);
    }
    writeJsonAtomic(scope.lockPath, {
      version: 1,
      rulebooks: resolved.map((item) => item.entry),
    });
  } catch {
    // Normal policy loading will report the unrepaired validation error.
  }
}

function preserveDisplayRef(
  item: ResolvedRulebook,
  previousLock: RulesLockfile | null,
  discoveredDisplayRefs?: Map<string, string>,
): ResolvedRulebook {
  const previousEntry = previousLock?.rulebooks.find(
    (entry) => entry.spec === item.entry.spec && entry.kind === 'github',
  );
  const displayRef =
    discoveredDisplayRefs?.get(item.entry.spec) ??
    (previousEntry?.kind === 'github' ? previousEntry.display_ref : undefined);
  if (!displayRef || item.entry.kind !== 'github') return item;
  return { ...item, entry: { ...item.entry, display_ref: displayRef } };
}

function mergeSelectedLockEntries(
  config: RulesConfig,
  previousLock: RulesLockfile | null,
  resolved: ResolvedRulebook[],
): RulebookLockEntry[] {
  const configuredSpecs = new Set(config.rules);
  const previousSpecs = new Set(previousLock?.rulebooks.map((entry) => entry.spec) ?? []);
  const resolvedBySpec = new Map(resolved.map((item) => [item.entry.spec, item.entry]));
  return [
    ...(previousLock?.rulebooks.filter((entry) => configuredSpecs.has(entry.spec)) ?? []).map(
      (entry) => resolvedBySpec.get(entry.spec) ?? entry,
    ),
    ...resolved.filter((item) => !previousSpecs.has(item.entry.spec)).map((item) => item.entry),
  ];
}

function addRuleCount(
  entry: RulebookLockEntry,
  ruleCountsBySpec: Map<string, number>,
): RulebookLockEntryWithStats {
  return {
    ...entry,
    ruleCount: ruleCountsBySpec.get(entry.spec),
  };
}

function writeCache(
  content: string,
  entry: RulebookLockEntry,
  configDir: string,
  options: RulesPolicyOptions,
): void {
  const path = getRulebookCachePath(entry, { ...options, cacheConfigDir: configDir });
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf-8');
}

function pruneUnreferencedRulebookCaches(
  entries: RulebookLockEntry[],
  configDir: string,
  options: RulesPolicyOptions,
): string[] {
  const internalOptions = options as InternalSyncRulesConfigOptions;
  const cacheRoot = join(dirname(configDir), 'cache', 'rulebooks');
  if (!existsSync(cacheRoot)) return [];

  const keep = new Set(
    entries.map((entry) =>
      dirname(getRulebookCachePath(entry, { ...options, cacheConfigDir: configDir })),
    ),
  );

  return readdirSync(cacheRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const path = join(cacheRoot, entry.name);
      if (keep.has(path)) return [];
      try {
        pruneRulebookCacheDir(path, internalOptions);
        return [];
      } catch (error) {
        return [
          `Failed to prune rulebook cache entry ${path}: ${error instanceof Error ? error.message : String(error)}`,
        ];
      }
    });
}

function getLocalSourceDirsForDelete(
  configDir: string,
  specs: string[],
  lock: RulesLockfile | null,
): { ok: true; dirs: string[] } | { ok: false; result: SyncRulesConfigResult } {
  const entriesBySpec = new Map(lock?.rulebooks.map((entry) => [entry.spec, entry]) ?? []);
  const errors = specs.flatMap((spec) => {
    const entry = entriesBySpec.get(spec);
    if (!entry) {
      return NAME_PATTERN.test(spec)
        ? []
        : ['--delete-source can only delete local rulebook sources'];
    }
    return entry.kind === 'local-directory'
      ? []
      : ['--delete-source can only delete local rulebook sources'];
  });
  const dirs = specs.map((spec) => {
    const entry = entriesBySpec.get(spec);
    return join(configDir, entry?.kind === 'local-directory' ? entry.path : spec);
  });
  const dirErrors =
    errors.length > 0 ? [] : dirs.flatMap((dir) => getLocalSourceDirDeleteError(configDir, dir));
  const allErrors = [...errors, ...dirErrors];
  return allErrors.length > 0
    ? { ok: false, result: { ok: false, errors: allErrors, warnings: [], entries: [] } }
    : { ok: true, dirs };
}

function getLocalSourceDirDeleteError(configDir: string, dir: string): string[] {
  const resolvedConfigDir = resolve(configDir);
  const resolvedDir = resolve(dir);
  const relativeDir = relative(resolvedConfigDir, resolvedDir);
  if (
    relativeDir === '' ||
    relativeDir === '..' ||
    relativeDir.startsWith(`..${sep}`) ||
    isAbsolute(relativeDir)
  ) {
    return [`Refusing to delete local rulebook source outside ${configDir}: ${dir}`];
  }
  if (!existsSync(resolvedDir)) return [`Local rulebook source directory not found: ${dir}`];
  if (!lstatSync(resolvedDir).isDirectory()) {
    return [`Local rulebook source is not a directory: ${dir}`];
  }
  const entries = readdirSync(resolvedDir);
  if (!entries.includes('rulebook.json')) {
    return [`Local rulebook source directory is missing rulebook.json: ${dir}`];
  }
  if (!lstatSync(join(resolvedDir, 'rulebook.json')).isFile()) {
    return [`Local rulebook source rulebook.json is not a file: ${dir}`];
  }
  if (entries.length > 1) {
    return [
      `Local rulebook source directory contains extra files: ${dir}. delete manually if you really want to remove the directory.`,
    ];
  }
  return [];
}

function deleteLocalSourceDirs(
  dirs: string[],
  options: InternalSyncRulesConfigOptions,
): { ok: true } | { ok: false; result: SyncRulesConfigResult } {
  const errors = dirs.flatMap((dir) => {
    try {
      deleteLocalSourceDir(dir, options);
      return [];
    } catch (error) {
      return [
        `Failed to delete local rulebook source ${dir}: ${error instanceof Error ? error.message : String(error)}`,
      ];
    }
  });
  return errors.length > 0
    ? { ok: false, result: { ok: false, errors, warnings: [], entries: [] } }
    : { ok: true };
}

function pruneRulebookCacheDir(path: string, options: InternalSyncRulesConfigOptions): void {
  if (options._testPruneRulebookCacheDir) {
    options._testPruneRulebookCacheDir(path);
    return;
  }
  rmSync(path, { recursive: true, force: true });
}

function deleteLocalSourceDir(dir: string, options: InternalSyncRulesConfigOptions): void {
  if (options._testDeleteLocalSourceDir) {
    options._testDeleteLocalSourceDir(dir);
    return;
  }
  unlinkSync(join(dir, 'rulebook.json'));
  rmdirSync(dir);
}

function restoreConfig(path: string, content: string | null): void {
  if (content === null) {
    rmSync(path, { force: true });
    return;
  }
  writeFileSync(path, content, 'utf-8');
}

function failWithError(error: unknown): SyncRulesConfigResult {
  return {
    ok: false,
    errors: [error instanceof Error ? error.message : String(error)],
    warnings: [],
    entries: [],
  };
}
