import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { colors } from '@/bin/utils/colors';
import {
  getLegacyProjectConfigPath,
  type ValidationResult,
  validateConfigFile,
  validateRulesConfigFile,
} from '@/core/config';
import {
  getLegacyUserRulesConfigPath,
  getProjectRulesConfigPath,
  getRulesConfigRuntimeErrorsForConfig,
  getRulesConfigSourceDisplayMap,
  getRulesLockPathForConfigPath,
  getUserRulesConfigPath,
  getUserRulesLockPath,
  RULES_DIR,
} from '@/core/rules/policy';
import { assertValidRulebook } from '@/core/rules/rulebook';
import { NAME_PATTERN } from '@/types';

const VERIFY_HEADER = 'CC Safety Net Config';
const VERIFY_SEPARATOR = '═'.repeat(VERIFY_HEADER.length);
const RULES_SCHEMA_URL =
  'https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json';
const RULES_DIR_RESERVED_ENTRIES = new Set(['rule.json', 'rule.lock', 'cache']);

type RulesConfigSchemaKind = 'rules' | 'legacy';

interface RulesVerifyOptions {
  cwd?: string;
  userConfigPath?: string;
  projectConfigPath?: string;
  legacyUserConfigPath?: string;
  legacyProjectConfigPath?: string;
}

export function runRulesVerify(options: RulesVerifyOptions = {}): number {
  const cwd = options.cwd ?? process.cwd();
  const userConfig = options.userConfigPath ?? getUserRulesConfigPath();
  const projectConfig = options.projectConfigPath ?? getProjectRulesConfigPath(cwd);
  const legacyUserConfig = options.legacyUserConfigPath ?? getLegacyUserRulesConfigPath();
  const legacyProjectConfig = options.legacyProjectConfigPath ?? getLegacyProjectConfigPath(cwd);
  const githubSourceRulesDir = resolve(cwd, RULES_DIR);
  const userConfigDir = dirname(userConfig);

  let hasErrors = false;
  let hasWarnings = false;
  const configsChecked: Array<{
    scope: string;
    path: string;
    result: ValidationResult;
    schema: RulesConfigSchemaKind;
    sourceDisplayMap: Map<string, string>;
    inactive?: boolean;
  }> = [];
  const warnings: string[] = [];
  const githubSourceRules = getGitHubSourceRulesValidation(githubSourceRulesDir);

  printRulesVerifyHeader();

  if (existsSync(userConfig)) {
    const result = validateRulesConfigFile(userConfig);
    result.errors.push(
      ...getRulesConfigRuntimeErrorsForConfig(userConfig, getUserRulesLockPath({ userConfigDir }), {
        userConfigDir,
      }),
    );
    configsChecked.push({
      scope: 'User',
      path: userConfig,
      result,
      schema: 'rules',
      sourceDisplayMap: getRulesConfigSourceDisplayMap(userConfig),
    });
    if (result.errors.length > 0) hasErrors = true;
  }

  if (existsSync(legacyUserConfig)) {
    hasWarnings = true;
    if (existsSync(userConfig)) {
      warnings.push(getLegacyRulesConfigWarning('user', 'cleanup'));
    } else {
      const result = validateConfigFile(legacyUserConfig);
      configsChecked.push({
        scope: 'User',
        path: legacyUserConfig,
        result,
        schema: 'legacy',
        sourceDisplayMap: new Map(),
        inactive: true,
      });
      warnings.push(
        getLegacyRulesConfigWarning('user', result.errors.length > 0 ? 'fix-or-delete' : 'migrate'),
      );
      if (result.errors.length > 0) hasErrors = true;
    }
  }

  if (existsSync(projectConfig)) {
    const result = validateRulesConfigFile(projectConfig);
    result.errors.push(
      ...getRulesConfigRuntimeErrorsForConfig(
        projectConfig,
        getRulesLockPathForConfigPath(projectConfig),
        {
          userConfigDir,
        },
      ),
    );
    configsChecked.push({
      scope: 'Project',
      path: resolve(projectConfig),
      result,
      schema: 'rules',
      sourceDisplayMap: getRulesConfigSourceDisplayMap(projectConfig),
    });
    if (result.errors.length > 0) hasErrors = true;
    if (existsSync(legacyProjectConfig)) {
      hasWarnings = true;
      warnings.push(getLegacyRulesConfigWarning('project', 'cleanup'));
    }
  } else if (existsSync(legacyProjectConfig)) {
    hasWarnings = true;
    hasErrors = true;
    const result = validateConfigFile(legacyProjectConfig);
    configsChecked.push({
      scope: 'Project',
      path: resolve(legacyProjectConfig),
      result,
      schema: 'legacy',
      sourceDisplayMap: new Map(),
      inactive: true,
    });
    warnings.push(
      getLegacyRulesConfigWarning(
        'project',
        result.errors.length > 0 ? 'fix-or-delete' : 'migrate',
      ),
    );
  }

  if (githubSourceRules?.result.errors.length) hasErrors = true;

  if (configsChecked.length === 0 && !githubSourceRules) {
    console.log('\nNo config files found. Using built-in rules only.');
    return 0;
  }

  for (const config of configsChecked) {
    if (config.inactive) {
      printInactiveLegacyRulesConfig(
        config.scope,
        config.path,
        config.result,
        config.sourceDisplayMap,
      );
    } else if (config.result.errors.length > 0) {
      printInvalidRulesConfig(config.scope, config.path, config.result.errors);
    } else {
      if (config.schema === 'rules' && addRulesSchemaIfMissing(config.path)) {
        console.log(`\nAdded $schema to ${config.scope.toLowerCase()} config.`);
      }
      printValidRulesConfig(
        config.scope,
        config.path,
        config.result,
        config.schema,
        config.sourceDisplayMap,
      );
    }
  }

  for (const warning of warnings) console.error(`\n${colors.red(warning)}`);

  if (githubSourceRules) {
    if (githubSourceRules.result.errors.length > 0) {
      printInvalidGitHubSourceRules(githubSourceRules.path, githubSourceRules.result.errors);
    } else {
      printValidGitHubSourceRules(githubSourceRules.path, githubSourceRules.result);
    }
  }

  if (hasErrors) {
    console.error('\nConfig validation failed.');
    return 1;
  }

  console.log(hasWarnings ? '\nConfigs valid with warnings.' : '\nAll configs valid.');
  return 0;
}

function getLegacyRulesConfigWarning(
  scope: 'project' | 'user',
  action: 'cleanup' | 'migrate' | 'fix-or-delete',
): string {
  const label = `legacy ${scope} config`;
  if (action === 'cleanup') {
    return `Warning: Legacy ${scope} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;
  }
  if (action === 'migrate') {
    return `Warning: Legacy ${scope} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;
  }
  return `Warning: Legacy ${scope} config is no longer supported. Fix or delete the ${label}, then run \`npx -y cc-safety-net rule migrate\`.`;
}

function getGitHubSourceRulesValidation(
  path: string,
): { path: string; result: ValidationResult } | null {
  if (!existsSync(path)) return null;
  const result = validateGitHubSourceRules(path);
  if (result.ruleNames.size === 0 && result.errors.length === 0) return null;
  return { path, result };
}

function validateGitHubSourceRules(path: string): ValidationResult {
  const errors: string[] = [];
  const ruleNames = new Set<string>();

  try {
    if (!statSync(path).isDirectory()) {
      return { errors: [`${RULES_DIR} must be a directory`], ruleNames };
    }
  } catch (error) {
    return {
      errors: [
        error instanceof Error
          ? `Failed to inspect ${RULES_DIR}: ${error.message}`
          : `Failed to inspect ${RULES_DIR}: ${String(error)}`,
      ],
      ruleNames,
    };
  }

  const entries = readdirSync(path, { withFileTypes: true })
    .filter((entry) => !RULES_DIR_RESERVED_ENTRIES.has(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name));
  if (entries.length === 0) {
    return { errors, ruleNames };
  }

  for (const entry of entries) {
    if (!NAME_PATTERN.test(entry.name)) {
      errors.push(`rulebook directory names must match ${NAME_PATTERN}: ${entry.name}`);
      continue;
    }
    if (!entry.isDirectory()) {
      errors.push(`${entry.name} must be a rulebook directory`);
      continue;
    }

    const rulebookPath = join(path, entry.name, 'rulebook.json');
    if (!existsSync(rulebookPath)) {
      errors.push(`${entry.name}/rulebook.json is required`);
      continue;
    }

    try {
      const rulebook = assertValidRulebook(JSON.parse(readFileSync(rulebookPath, 'utf-8')));
      if (rulebook.name !== entry.name) {
        errors.push(`rulebook name "${rulebook.name}" must match folder "${entry.name}"`);
        continue;
      }
      ruleNames.add(entry.name);
    } catch (error) {
      errors.push(
        error instanceof Error
          ? `${entry.name}/rulebook.json: ${error.message}`
          : `${entry.name}/rulebook.json: ${String(error)}`,
      );
    }
  }

  return { errors, ruleNames };
}

function printRulesVerifyHeader(): void {
  console.log(VERIFY_HEADER);
  console.log(VERIFY_SEPARATOR);
}

function printValidRulesConfig(
  scope: string,
  path: string,
  result: ValidationResult,
  schema: RulesConfigSchemaKind,
  sourceDisplayMap: Map<string, string>,
): void {
  console.log(`\n✓ ${scope} config: ${path}`);
  console.log(`  Schema: ${schema === 'rules' ? 'rulebook sources' : 'legacy inline rules'}`);
  if (result.ruleNames.size > 0) {
    console.log(`  ${schema === 'rules' ? 'Sources' : 'Rules'}:`);
    let i = 1;
    for (const name of result.ruleNames) {
      console.log(`    ${i}. ${sourceDisplayMap.get(name) ?? name}`);
      i++;
    }
  } else {
    console.log(`  ${schema === 'rules' ? 'Sources' : 'Rules'}: (none)`);
  }
}

function printInactiveLegacyRulesConfig(
  scope: string,
  path: string,
  result: ValidationResult,
  sourceDisplayMap: Map<string, string>,
): void {
  console.error(`\n✗ Legacy ${scope.toLowerCase()} config: ${path}`);
  console.error('  Schema: legacy inline rules');
  console.error('  Status: ignored by CC Safety Net');
  if (result.errors.length > 0) {
    console.error('  Errors:');
    let errorNum = 1;
    for (const error of result.errors) {
      for (const part of error.split('; ')) {
        console.error(`    ${errorNum}. ${part}`);
        errorNum++;
      }
    }
    return;
  }
  if (result.ruleNames.size > 0) {
    console.error('  Rules:');
    let i = 1;
    for (const name of result.ruleNames) {
      console.error(`    ${i}. ${sourceDisplayMap.get(name) ?? name}`);
      i++;
    }
    return;
  }
  console.error('  Rules: (none)');
}

function printInvalidRulesConfig(scope: string, path: string, errors: string[]): void {
  printInvalidVerifyTarget(`${scope} config`, path, errors);
}

function printValidGitHubSourceRules(path: string, result: ValidationResult): void {
  console.log(`\n✓ GitHub source rules: ${path}`);
  console.log('  Rulebooks:');
  let i = 1;
  for (const name of result.ruleNames) {
    console.log(`    ${i}. ${name}`);
    i++;
  }
}

function printInvalidGitHubSourceRules(path: string, errors: string[]): void {
  printInvalidVerifyTarget('GitHub source rules', path, errors);
}

function printInvalidVerifyTarget(label: string, path: string, errors: string[]): void {
  console.error(`\n✗ ${label}: ${path}`);
  console.error('  Errors:');
  let errorNum = 1;
  for (const error of errors) {
    for (const part of error.split('; ')) {
      console.error(`    ${errorNum}. ${part}`);
      errorNum++;
    }
  }
}

function addRulesSchemaIfMissing(path: string): boolean {
  try {
    const content = readFileSync(path, 'utf-8');
    const parsed = JSON.parse(content) as Record<string, unknown>;
    if (parsed.$schema) return false;

    writeFileSync(path, JSON.stringify({ $schema: RULES_SCHEMA_URL, ...parsed }, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}
