import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { runRulebookFixtures } from '@/core/rules/rulebook';
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
      return { ok: false, errors: existingLockResult.errors, entries: [] };
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
    return {
      ok: true,
      errors: [],
      entries: entries.map((entry) => addRuleCount(entry, ruleCountsBySpec)),
    };
  } catch (error) {
    return {
      ok: false,
      errors: [error instanceof Error ? error.message : String(error)],
      entries: [],
    };
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
      entries: resolved.map((item) => ({
        ...addRuleCount(item.entry, ruleCountsBySpec),
        testCount: testCountsBySpec.get(item.entry.spec),
      })),
    };
  } catch (error) {
    return {
      ok: false,
      errors: [error instanceof Error ? error.message : String(error)],
      entries: [],
    };
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
  options: SyncRulesConfigOptions = {},
): Promise<SyncRulesConfigResult> {
  const scope = getScopePaths(options);
  const loaded = readRulesConfig(scope.configPath);
  if (loaded.errors.length > 0) {
    return { ok: false, errors: loaded.errors, entries: [] };
  }
  if (!loaded.config) {
    return { ok: false, errors: [`No config found at ${scope.configPath}`], entries: [] };
  }
  const lock = readLockfile(scope.lockPath).lock;
  const matches = getRemoveMatches(loaded.config.rules, lock, match);
  if (!matches.ok) return matches.result;
  const before = readFileSync(scope.configPath, 'utf-8');
  writeJsonAtomic(scope.configPath, {
    version: 1,
    rules: loaded.config.rules.filter((spec) => !matches.specs.includes(spec)),
    overrides: loaded.config.overrides ?? {},
  });
  const result = await syncRulesConfig(options);
  if (!result.ok) {
    restoreConfig(scope.configPath, before);
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
  return { ok: result.errors.length === 0, errors: result.errors, entries: result.entries };
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

function restoreConfig(path: string, content: string | null): void {
  if (content === null) {
    rmSync(path, { force: true });
    return;
  }
  writeFileSync(path, content, 'utf-8');
}
