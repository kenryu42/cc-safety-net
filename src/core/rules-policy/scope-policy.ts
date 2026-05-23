import { existsSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { assertValidRulebook, type Rulebook } from '@/core/rulebook';
import type { Config, CustomRule } from '@/types';
import { readRulesConfig } from './config-file';
import { readLockfile } from './lockfile';
import {
  getLegacyProjectRulesConfigPath,
  getLegacyUserRulesConfigPath,
  getPolicyPaths,
  getRulebookCachePath,
  getRulebookDisplaySource,
  getRulesLockPathForConfigPath,
  RULE_MIGRATE_COMMAND,
  RULE_SYNC_COMMAND,
  RULEBOOK_FILE,
} from './paths';
import { sha256Digest } from './resolver';
import type {
  LoadedRulebookInfo,
  LoadedRulesPolicy,
  RulebookLockEntry,
  RuleOverride,
  RulesConfig,
  RulesPolicyOptions,
} from './types';

interface ScopePolicy {
  rules: CustomRule[];
  rulebooks: LoadedRulebookInfo[];
  entries: RulebookLockEntry[];
  knownRuleIds: Set<string>;
  errors: string[];
  canValidateOverrides: boolean;
}

export function loadRulesPolicy(options: RulesPolicyOptions = {}): LoadedRulesPolicy {
  const paths = getPolicyPaths(options);
  const user = readRulesConfig(paths.userConfigPath);
  const project = readRulesConfig(paths.projectConfigPath);
  const errors = [
    ...getLegacyRulesConfigErrors(paths, options),
    ...user.errors.map((error) => `${paths.userConfigPath}: ${error}`),
    ...project.errors.map((error) => `${paths.projectConfigPath}: ${error}`),
  ];

  const userPolicy = user.config
    ? loadScopePolicy(
        user.config,
        paths.userLockPath,
        dirname(paths.userConfigPath),
        options,
        'user',
      )
    : emptyScopePolicy();
  const projectPolicy = project.config
    ? loadScopePolicy(
        project.config,
        paths.projectLockPath,
        dirname(paths.projectConfigPath),
        options,
        'project',
      )
    : emptyScopePolicy();

  const duplicateNames = getDuplicateRulebookNames([
    ...(user.config ? getConfiguredLockEntries(user.config, paths.userLockPath) : []),
    ...(project.config ? getConfiguredLockEntries(project.config, paths.projectLockPath) : []),
  ]);
  const overrides = { ...(user.config?.overrides ?? {}), ...(project.config?.overrides ?? {}) };
  const knownRuleIds = new Set([...userPolicy.knownRuleIds, ...projectPolicy.knownRuleIds]);

  return {
    rules: applyOverrides([...userPolicy.rules, ...projectPolicy.rules], overrides),
    rulebooks: [...userPolicy.rulebooks, ...projectPolicy.rulebooks],
    errors: [
      ...errors,
      ...userPolicy.errors,
      ...projectPolicy.errors,
      ...duplicateNames.map((name) => `duplicate active rulebook name "${name}"`),
      ...(userPolicy.canValidateOverrides && projectPolicy.canValidateOverrides
        ? getUnknownOverrideErrors(overrides, knownRuleIds)
        : []),
    ],
    userConfig: user.config ?? undefined,
    projectConfig: project.config ?? undefined,
    ...paths,
  };
}

export function getRulesConfigSourceDisplayMap(configPath: string): Map<string, string> {
  const config = readRulesConfig(configPath).config;
  const lock = readLockfile(getRulesLockPathForConfigPath(configPath)).lock;
  if (!config || !lock) return new Map();

  const configuredSources = new Set(config.rules);
  return new Map(
    lock.rulebooks
      .filter((entry) => configuredSources.has(entry.spec))
      .map((entry) => [entry.spec, getRulebookDisplaySource(entry)]),
  );
}

export function getRulesConfigRuntimeErrorsForConfig(
  configPath: string,
  lockPath: string,
  options: RulesPolicyOptions,
): string[] {
  const loaded = loadScopePolicyForConfig(configPath, lockPath, options);
  if (!loaded) return [];
  return [...loaded.scope.errors, ...getUnknownOverrideErrorsForScope(loaded.config, loaded.scope)];
}

export function getUnknownOverrideErrorsForConfig(
  configPath: string,
  lockPath: string,
  options: RulesPolicyOptions,
): string[] {
  const loaded = loadScopePolicyForConfig(configPath, lockPath, options);
  if (!loaded) return [];
  return getUnknownOverrideErrorsForScope(loaded.config, loaded.scope);
}

function loadScopePolicyForConfig(
  configPath: string,
  lockPath: string,
  options: RulesPolicyOptions,
): { config: RulesConfig; scope: ScopePolicy } | null {
  const config = readRulesConfig(configPath).config;
  if (!config) {
    return null;
  }
  return {
    config,
    scope: loadScopePolicy(config, lockPath, dirname(configPath), options, 'project'),
  };
}

function getUnknownOverrideErrorsForScope(config: RulesConfig, scope: ScopePolicy): string[] {
  return scope.canValidateOverrides
    ? getUnknownOverrideErrors(config.overrides ?? {}, scope.knownRuleIds)
    : [];
}

export function loadScopePolicy(
  config: RulesConfig,
  lockPath: string,
  configDir: string,
  options: RulesPolicyOptions,
  source: 'user' | 'project',
): ScopePolicy {
  const lockResult = readLockfile(lockPath);
  if (lockResult.errors.length > 0) {
    return { ...emptyScopePolicy(), errors: lockResult.errors, canValidateOverrides: false };
  }
  const lock = lockResult.lock;
  if (!lock && config.rules.length > 0) {
    return {
      ...emptyScopePolicy(),
      errors: [`missing lockfile ${lockPath}; run ${RULE_SYNC_COMMAND}`],
      canValidateOverrides: false,
    };
  }
  const entries = lock?.rulebooks ?? [];
  const entriesBySpec = new Map(entries.map((entry) => [entry.spec, entry]));
  const errors: string[] = [];
  const loaded = config.rules.flatMap((spec) => {
    const entry = entriesBySpec.get(spec);
    if (!entry) {
      errors.push(`missing lock entry for ${spec}; run ${RULE_SYNC_COMMAND}`);
      return [];
    }
    const validationErrors = validateLockedRulebook(entry, configDir, options);
    if (validationErrors.length > 0) {
      errors.push(...validationErrors);
      return [];
    }
    const rulebook = JSON.parse(
      readFileSync(getRulebookCachePath(entry, { ...options, cacheConfigDir: configDir }), 'utf-8'),
    ) as Rulebook;
    return [
      {
        rules: rulebook.rules.map((rule) => ({ ...rule, name: `${rulebook.name}/${rule.name}` })),
        rulebook: {
          source,
          spec: entry.spec,
          name: rulebook.name,
          version: rulebook.version,
          rules: rulebook.rules.map((rule) => `${rulebook.name}/${rule.name}`),
        },
      },
    ];
  });

  const rules = loaded.flatMap((item) => item.rules);
  return {
    rules,
    rulebooks: loaded.map((item) => item.rulebook),
    entries,
    knownRuleIds: new Set(rules.map((rule) => rule.name)),
    errors,
    canValidateOverrides: errors.length === 0,
  };
}

function validateLockedRulebook(
  entry: RulebookLockEntry,
  configDir: string,
  options: RulesPolicyOptions,
): string[] {
  const errors: string[] = [];
  const cachePath = getRulebookCachePath(entry, { ...options, cacheConfigDir: configDir });
  if (!existsSync(cachePath)) {
    return [`missing cache entry for ${entry.spec}; run ${RULE_SYNC_COMMAND}`];
  }
  const cacheContent = readFileSync(cachePath, 'utf-8');
  if (sha256Digest(cacheContent) !== entry.digest) {
    errors.push(`cache digest mismatch for ${entry.spec}; run ${RULE_SYNC_COMMAND}`);
  }
  try {
    assertValidRulebook(JSON.parse(cacheContent));
  } catch (error) {
    errors.push(
      `invalid cached rulebook for ${entry.spec}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (entry.kind === 'local-directory') {
    const sourcePath = resolve(configDir, entry.path);
    const sourceRelative = relative(resolve(configDir), sourcePath);
    if (
      sourceRelative === '..' ||
      sourceRelative.startsWith(`..${sep}`) ||
      isAbsolute(sourceRelative)
    ) {
      errors.push(
        `lockfile local source path for ${entry.spec} must stay within ${configDir}; run ${RULE_SYNC_COMMAND}`,
      );
      return errors;
    }
    const localPath = join(sourcePath, RULEBOOK_FILE);
    if (!existsSync(localPath)) {
      errors.push(`missing local source for ${entry.spec}; run ${RULE_SYNC_COMMAND}`);
    } else {
      const localContent = readFileSync(localPath, 'utf-8');
      if (sha256Digest(localContent) !== entry.digest) {
        errors.push(getLocalSourceDriftError(entry.spec, localContent));
      }
    }
  }
  return errors;
}

export function rulesPolicyToConfig(policy: LoadedRulesPolicy): Config {
  if (policy.errors.length > 0) {
    return {
      version: 1,
      rules: [],
      failClosedReason: withTerminalPeriod(policy.errors.join('; ')),
    };
  }
  return { version: 1, rules: policy.rules };
}

function getLegacyRulesConfigErrors(
  paths: ReturnType<typeof getPolicyPaths>,
  options: RulesPolicyOptions,
): string[] {
  return Array.from(
    new Set([
      ...getLegacyRulesConfigError(getLegacyUserRulesConfigPath(options), paths.userConfigPath),
      ...getLegacyRulesConfigError(
        getLegacyProjectRulesConfigPath(options),
        paths.projectConfigPath,
      ),
    ]),
  );
}

function getLegacyRulesConfigError(legacyPath: string, configPath: string): string[] {
  if (existsSync(configPath) || !existsSync(legacyPath)) return [];
  try {
    const parsed = JSON.parse(readFileSync(legacyPath, 'utf-8')) as { version?: unknown };
    if (parsed.version === 1) return [];
  } catch {
    // Invalid legacy config should fail closed below.
  }
  return [`legacy rules config location is no longer used; run ${RULE_MIGRATE_COMMAND}`];
}

function getLocalSourceDriftError(spec: string, content: string): string {
  try {
    assertValidRulebook(JSON.parse(content));
  } catch (error) {
    return `invalid local rulebook for ${spec}: ${error instanceof Error ? error.message : String(error)}; fix the rulebook, then run ${RULE_SYNC_COMMAND}`;
  }
  return `local source digest mismatch for ${spec}; run ${RULE_SYNC_COMMAND}`;
}

function applyOverrides(
  rules: CustomRule[],
  overrides: Record<string, RuleOverride>,
): CustomRule[] {
  return rules.flatMap((rule) => {
    const override = overrides[rule.name];
    if (override === 'off') {
      return [];
    }
    if (override && typeof override === 'object') {
      return [{ ...rule, reason: override.reason }];
    }
    return [rule];
  });
}

function getUnknownOverrideErrors(
  overrides: Record<string, RuleOverride>,
  knownRuleIds: Set<string>,
): string[] {
  return Object.keys(overrides)
    .filter((key) => !knownRuleIds.has(key))
    .map((key) => `unknown override key "${key}"`);
}

function getDuplicateRulebookNames(entries: RulebookLockEntry[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.name)) {
      duplicates.add(entry.name);
      continue;
    }
    seen.add(entry.name);
  }
  return [...duplicates];
}

function getConfiguredLockEntries(config: RulesConfig, path: string): RulebookLockEntry[] {
  return (readLockfile(path).lock?.rulebooks ?? []).filter((entry) =>
    config.rules.includes(entry.spec),
  );
}

function emptyScopePolicy(): ScopePolicy {
  return {
    rules: [],
    rulebooks: [],
    entries: [],
    knownRuleIds: new Set(),
    errors: [],
    canValidateOverrides: true,
  };
}

function withTerminalPeriod(message: string): string {
  return /[.!?]$/.test(message) ? message : `${message}.`;
}
