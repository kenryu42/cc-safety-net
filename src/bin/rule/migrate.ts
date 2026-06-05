import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { validateConfig } from '@/core/config';
import {
  getRulebookMigratedFrom,
  readRulesConfig,
  type SyncRulesConfigOptions,
  syncRulesConfig,
} from '@/core/rules/policy';
import { writeJsonAtomic } from '@/core/rules/policy/config-file';
import {
  getLegacyProjectRulesConfigPath,
  getLegacyUserRulesConfigPath,
  getProjectRulesConfigPath,
  getRulesLockPathForConfigPath,
  getUserRulesConfigPath,
} from '@/core/rules/policy/paths';
import type { CustomRule } from '@/types';

const PROJECT_MIGRATED_FROM = '.safety-net.json';
const USER_MIGRATED_FROM = '~/.cc-safety-net/config.json';

interface RulesMigrateOptions {
  cleanup: boolean;
  cwd: string;
}

interface MigrateRulesScopeOptions {
  legacyPath: string;
  configPath: string;
  defaultRulebookName: string;
  migratedFrom: string;
  cleanup: boolean;
  syncOptions: SyncRulesConfigOptions;
}

interface LegacyRulesConfig {
  version: 1;
  rules: CustomRule[];
}

type FileSnapshot = { path: string; content: string | null };

export async function runRulesMigrate(options: RulesMigrateOptions): Promise<number> {
  const results = [
    await migrateRulesScope({
      legacyPath: getLegacyProjectRulesConfigPath({ cwd: options.cwd }),
      configPath: getProjectRulesConfigPath(options.cwd),
      defaultRulebookName: 'project-rules',
      migratedFrom: PROJECT_MIGRATED_FROM,
      cleanup: options.cleanup,
      syncOptions: { cwd: options.cwd },
    }),
    await migrateRulesScope({
      legacyPath: getLegacyUserRulesConfigPath(),
      configPath: getUserRulesConfigPath(),
      defaultRulebookName: 'user-rules',
      migratedFrom: USER_MIGRATED_FROM,
      cleanup: options.cleanup,
      syncOptions: { cwd: options.cwd, global: true },
    }),
  ];
  return results.every((result) => result) ? 0 : 1;
}

async function migrateRulesScope(options: MigrateRulesScopeOptions): Promise<boolean> {
  if (!existsSync(options.legacyPath)) {
    console.log(`No legacy config found at ${options.legacyPath}`);
    return true;
  }

  const legacy = readLegacyRulesConfig(options.legacyPath);
  if (!legacy.ok) {
    for (const error of legacy.errors) console.error(error);
    return false;
  }

  const loaded = readRulesConfig(options.configPath);
  if (loaded.errors.length > 0) {
    for (const error of loaded.errors) console.error(error);
    return false;
  }

  const config = loaded.config ?? { version: 1 as const, rules: [], overrides: {} };
  const rulebookName = getMigratedRulebookName(
    dirname(options.configPath),
    config.rules,
    options.defaultRulebookName,
    options.migratedFrom,
  );
  const rulebookPath = join(dirname(options.configPath), rulebookName, 'rulebook.json');
  const snapshots = [
    snapshotFile(options.configPath),
    snapshotFile(rulebookPath),
    snapshotFile(getRulesLockPathForConfigPath(options.configPath)),
  ];

  const result = await writeAndSyncMigratedRulebook(
    options,
    rulebookPath,
    rulebookName,
    legacy.config.rules,
    config.rules.includes(rulebookName) ? config.rules : [...config.rules, rulebookName],
    config.overrides ?? {},
  );
  if (!result.ok) {
    restoreFiles(snapshots);
    for (const error of result.errors) console.error(error);
    return false;
  }

  if (!options.cleanup) {
    console.log(`Migrated legacy config at ${options.legacyPath}. Legacy file is no longer used.`);
    return true;
  }

  if (
    !isCleanupVerified(
      options.configPath,
      rulebookPath,
      rulebookName,
      options.migratedFrom,
      legacy.config.rules,
    )
  ) {
    console.error(`Migration cleanup verification failed for ${options.legacyPath}`);
    return false;
  }

  rmSync(options.legacyPath, { force: true });
  console.log(`Deleted legacy config at ${options.legacyPath}`);
  return true;
}

async function writeAndSyncMigratedRulebook(
  options: MigrateRulesScopeOptions,
  rulebookPath: string,
  rulebookName: string,
  rules: CustomRule[],
  configRules: string[],
  overrides: Record<string, unknown>,
): Promise<{ ok: boolean; errors: string[] }> {
  try {
    writeJsonAtomic(options.configPath, {
      version: 1,
      rules: configRules,
      overrides,
    });
    writeJsonAtomic(rulebookPath, getMigratedRulebook(rulebookName, options.migratedFrom, rules));
    return await syncRulesConfig(options.syncOptions);
  } catch (error) {
    return { ok: false, errors: [error instanceof Error ? error.message : String(error)] };
  }
}

function readLegacyRulesConfig(
  path: string,
): { ok: true; config: LegacyRulesConfig } | { ok: false; errors: string[] } {
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf-8')) as unknown;
    const validation = validateConfig(parsed);
    if (validation.errors.length > 0) return { ok: false, errors: validation.errors };
    return {
      ok: true,
      config: {
        version: 1,
        rules: ((parsed as Record<string, unknown>).rules as CustomRule[] | undefined) ?? [],
      },
    };
  } catch (error) {
    return {
      ok: false,
      errors: [`Invalid JSON: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

function getMigratedRulebookName(
  configDir: string,
  sources: string[],
  defaultRulebookName: string,
  migratedFrom: string,
): string {
  const existing = sources.find(
    (source) => getRulebookMigratedFrom(configDir, source) === migratedFrom,
  );
  if (existing) return existing;
  if (!existsSync(join(configDir, defaultRulebookName, 'rulebook.json')))
    return defaultRulebookName;

  for (let i = 2; ; i++) {
    const name = `${defaultRulebookName}-${i}`;
    if (!existsSync(join(configDir, name, 'rulebook.json'))) return name;
  }
}

function getMigratedRulebook(name: string, migratedFrom: string, rules: CustomRule[]) {
  return {
    rulebook_version: 1,
    name,
    version: '1.0.0',
    description: 'Migrated CC Safety Net rules.',
    author: 'project',
    migrated_from: migratedFrom,
    allowed_commands: [...new Set(rules.map((rule) => rule.command))],
    rules,
    tests: rules.map((rule) => ({
      command: [rule.command, rule.subcommand, rule.block_args[0]].filter(Boolean).join(' '),
      expect: 'blocked',
      rule: rule.name,
    })),
  };
}

function isCleanupVerified(
  configPath: string,
  rulebookPath: string,
  rulebookName: string,
  migratedFrom: string,
  legacyRules: CustomRule[],
): boolean {
  const config = readRulesConfig(configPath).config;
  if (!config?.rules.includes(rulebookName) || !existsSync(rulebookPath)) return false;

  try {
    const rulebook = JSON.parse(readFileSync(rulebookPath, 'utf-8')) as Record<string, unknown>;
    return (
      rulebook.migrated_from === migratedFrom &&
      JSON.stringify(rulebook.rules) === JSON.stringify(legacyRules)
    );
  } catch {
    return false;
  }
}

function snapshotFile(path: string): FileSnapshot {
  return { path, content: existsSync(path) ? readFileSync(path, 'utf-8') : null };
}

function restoreFiles(snapshots: FileSnapshot[]): void {
  for (const snapshot of snapshots) {
    if (snapshot.content === null) {
      rmSync(snapshot.path, { force: true });
      continue;
    }
    writeFileSync(snapshot.path, snapshot.content, 'utf-8');
  }
}
