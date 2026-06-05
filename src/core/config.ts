import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Config, ValidationResult } from '@/types';
import { validateCustomRule } from './rules/custom-rule-validation';
import { validateRulesConfig } from './rules/policy/config-file';
import { loadRulesPolicy, rulesPolicyToConfig } from './rules/policy/scope-policy';
import { repairLocalRulesPolicy } from './rules/policy/sync';

export interface LoadConfigOptions {
  /** Override user config directory (for testing) */
  userConfigDir?: string;
  /** Repair local rulebook lock/cache state before loading rule-backed rules. */
  repairLocalRulebooks?: boolean;
}

export function loadConfig(cwd?: string, options?: LoadConfigOptions): Config {
  const safeCwd = typeof cwd === 'string' ? cwd : process.cwd();
  if (options?.repairLocalRulebooks) {
    repairLocalRulesPolicy({ cwd: safeCwd, userConfigDir: options.userConfigDir });
  }
  return rulesPolicyToConfig(
    loadRulesPolicy({ cwd: safeCwd, userConfigDir: options?.userConfigDir }),
  );
}

/** @internal Exported for testing */
export function validateConfig(config: unknown): ValidationResult {
  const errors: string[] = [];
  const ruleNames = new Set<string>();

  if (!config || typeof config !== 'object') {
    errors.push('Config must be an object');
    return { errors, ruleNames };
  }

  const cfg = config as Record<string, unknown>;

  if (cfg.version !== 1) {
    errors.push('version must be 1');
  }

  if (cfg.rules !== undefined) {
    if (!Array.isArray(cfg.rules)) {
      errors.push('rules must be an array');
    } else {
      for (let i = 0; i < cfg.rules.length; i++) {
        errors.push(...validateCustomRule(cfg.rules[i], i, ruleNames));
      }
    }
  }

  return { errors, ruleNames };
}

export function validateConfigFile(path: string): ValidationResult {
  return validateParsedConfigFile(path, validateConfig);
}

type ConfigFileInput = { ok: true; parsed: unknown } | { ok: false; result: ValidationResult };

function readConfigFileInput(path: string): ConfigFileInput {
  const errors: string[] = [];
  const ruleNames = new Set<string>();

  if (!existsSync(path)) {
    errors.push(`File not found: ${path}`);
    return { ok: false, result: { errors, ruleNames } };
  }

  try {
    const content = readFileSync(path, 'utf-8');
    if (!content.trim()) {
      errors.push('Config file is empty');
      return { ok: false, result: { errors, ruleNames } };
    }

    return { ok: true, parsed: JSON.parse(content) as unknown };
  } catch (e) {
    errors.push(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
    return { ok: false, result: { errors, ruleNames } };
  }
}

export function getLegacyProjectConfigPath(cwd?: string): string {
  return resolve(cwd ?? process.cwd(), '.safety-net.json');
}

export function validateRulesConfigFile(path: string): ValidationResult {
  const loaded = readConfigFileInput(path);
  if (!loaded.ok) return loaded.result;
  const result = validateRulesConfig(loaded.parsed);
  return { errors: result.errors, ruleNames: result.sources };
}

function validateParsedConfigFile(
  path: string,
  validate: (config: unknown) => ValidationResult,
): ValidationResult {
  const loaded = readConfigFileInput(path);
  if (!loaded.ok) return loaded.result;
  return validate(loaded.parsed);
}

export type { ValidationResult };
