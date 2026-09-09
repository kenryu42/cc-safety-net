/**
 * The legacy config validator and the atomic JSON writer the diagnostic surfaces need:
 * `doctor` reports on both rule configs and on a `.safety-net.json` left over from version 0,
 * `rule verify` and `policy apply` write through the same atomic path.
 *
 * The inline rules a version-0 config carries are validated here as an issue list, the way
 * `rules-config.ts` validates `rule.json`; rulebooks accept the same rules with their own
 * wording, which `rulebook.ts` reports.
 */

import { dirname, join, resolve } from 'node:path';
import type { Environment } from '@/core/environment';
import {
  bindDelegatedPolicyFilesystemTarget,
  PolicyFilesystemError,
  type PolicyFilesystemTarget,
  readPolicyFile,
  writePolicyFileAtomic,
} from '@/core/io/safe-read';
import { COMMAND_PATTERN, MAX_REASON_LENGTH } from '@/core/rules/constants';
import { getUserRulesDir, type UserScopeOptions } from './paths';
import { collectCustomRuleNames } from './rulebook';
import {
  duplicateRuleNameIssues,
  formatIssues,
  getRulesConfigValidation,
  INTENT_ERROR,
  type Issue,
  isBlockIntent,
  typed,
} from './rules-config';
import { NAME_PATTERN } from './source-syntax';

const LEGACY_RULES_CONFIG_FILE = 'config.json';

export function writeJsonAtomic(
  path: string | PolicyFilesystemTarget,
  value: unknown,
  mode?: number,
  afterRename?: (path: string) => void,
): void {
  writePolicyFileAtomic(toTarget(path), `${JSON.stringify(value, null, 2)}\n`, mode, afterRename);
}

function toTarget(path: string | PolicyFilesystemTarget): PolicyFilesystemTarget {
  return typeof path === 'string' ? bindDelegatedPolicyFilesystemTarget(path) : path;
}

/** Result of config validation */
export interface ValidationResult {
  /** List of validation error messages */
  errors: string[];
  /** Set of rule names found (for duplicate detection) */
  ruleNames: Set<string>;
}

export function validateConfig(config: unknown): ValidationResult {
  return {
    errors: formatIssues(legacyConfigIssues(config), ': ', ' '),
    ruleNames: new Set(collectCustomRuleNames(config).map((name) => name.toLowerCase())),
  };
}

const NAME_ERROR = 'must match pattern (letters, numbers, hyphens, underscores; max 64 chars)';
const COMMAND_ERROR = 'must match pattern (letters, numbers, hyphens, underscores)';

function legacyConfigIssues(config: unknown): Issue[] {
  if (!isRecord(config)) return [typed([], 'Config must be an object')];
  return [
    ...(config.version === 1 ? [] : [typed(['version'], 'must be 1')]),
    ...legacyRuleIssues(config.rules),
  ];
}

/**
 * Every rule reports the fields it failed before any duplicate name is named, so a config
 * with several broken rules reads as one list of shapes followed by the clashes between them.
 */
function legacyRuleIssues(rules: unknown): Issue[] {
  if (rules === undefined) return [];
  if (!Array.isArray(rules)) return [typed(['rules'], 'must be an array')];
  return [
    ...rules.flatMap((rule, index) =>
      isRecord(rule)
        ? legacyRuleFieldIssues(rule, ['rules', index])
        : [typed(['rules', index], 'must be an object')],
    ),
    ...duplicateRuleNameIssues(rules),
  ];
}

function legacyRuleFieldIssues(
  rule: Record<string, unknown>,
  path: readonly PropertyKey[],
): Issue[] {
  return [
    ...patternIssues(rule.name, [...path, 'name'], 'required string', NAME_PATTERN, NAME_ERROR),
    ...patternIssues(
      rule.command,
      [...path, 'command'],
      'required string',
      COMMAND_PATTERN,
      COMMAND_ERROR,
    ),
    ...(rule.subcommand === undefined
      ? []
      : patternIssues(
          rule.subcommand,
          [...path, 'subcommand'],
          'must be a string if provided',
          COMMAND_PATTERN,
          COMMAND_ERROR,
        )),
    ...blockArgIssues(rule.block_args, [...path, 'block_args']),
    ...legacyReasonIssues(rule.reason, [...path, 'reason']),
    ...(rule.intent === undefined || isBlockIntent(rule.intent)
      ? []
      : [typed([...path, 'intent'], INTENT_ERROR)]),
  ];
}

function patternIssues(
  value: unknown,
  path: readonly PropertyKey[],
  typeError: string,
  pattern: RegExp,
  patternError: string,
): Issue[] {
  if (typeof value !== 'string') return [typed(path, typeError)];
  return pattern.test(value) ? [] : [typed(path, patternError)];
}

function blockArgIssues(value: unknown, path: readonly PropertyKey[]): Issue[] {
  if (!Array.isArray(value)) return [typed(path, 'required array')];
  if (value.length === 0) return [typed(path, 'must have at least one element')];
  return value.flatMap((arg, index) => {
    if (typeof arg !== 'string') return [typed([...path, index], 'must be a string')];
    return arg === '' ? [typed([...path, index], 'must not be empty')] : [];
  });
}

function legacyReasonIssues(reason: unknown, path: readonly PropertyKey[]): Issue[] {
  if (typeof reason !== 'string') return [typed(path, 'required string')];
  if (reason === '') return [typed(path, 'must not be empty')];
  return reason.length > MAX_REASON_LENGTH
    ? [typed(path, `must be at most ${MAX_REASON_LENGTH} characters`)]
    : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function validateConfigFile(path: string | PolicyFilesystemTarget): ValidationResult {
  const loaded = readConfigFileInput(path);
  if (!loaded.ok) return loaded.result;
  return validateConfig(loaded.parsed);
}

type ConfigFileInput = { ok: true; parsed: unknown } | { ok: false; result: ValidationResult };

function readConfigFileInput(path: string | PolicyFilesystemTarget): ConfigFileInput {
  const errors: string[] = [];
  const ruleNames = new Set<string>();

  try {
    const target = typeof path === 'string' ? bindDelegatedPolicyFilesystemTarget(path) : path;
    const content = readPolicyFile(target);
    if (content === null) {
      errors.push(`File not found: ${target.path}`);
      return { ok: false, result: { errors, ruleNames } };
    }
    if (!content.trim()) {
      errors.push('Config file is empty');
      return { ok: false, result: { errors, ruleNames } };
    }

    return { ok: true, parsed: JSON.parse(content) as unknown };
  } catch (error) {
    if (error instanceof PolicyFilesystemError) {
      errors.push(error.message);
      return { ok: false, result: { errors, ruleNames } };
    }
    // Only a parse failure means malformed JSON; every other failure names itself.
    const message = error instanceof Error ? error.message : String(error);
    errors.push(error instanceof SyntaxError ? 'Invalid JSON' : message);
    return { ok: false, result: { errors, ruleNames } };
  }
}

export function getLegacyProjectConfigPath(cwd: string): string {
  return resolve(cwd, '.safety-net.json');
}

export function validateRulesConfigFile(path: string | PolicyFilesystemTarget): ValidationResult {
  const loaded = readConfigFileInput(path);
  if (!loaded.ok) return loaded.result;
  const result = getRulesConfigValidation(loaded.parsed);
  return { errors: result.errors, ruleNames: result.sources };
}

export function getLegacyUserRulesConfigPath(
  environment: Environment,
  options: UserScopeOptions = {},
): string {
  return join(dirname(getUserRulesDir(environment, options)), LEGACY_RULES_CONFIG_FILE);
}
