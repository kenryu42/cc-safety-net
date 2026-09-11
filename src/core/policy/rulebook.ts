import type { BlockIntent } from '@/core/decision';
import { COMMAND_PATTERN, MAX_REASON_LENGTH } from '@/core/rules/constants';
import type { CustomRuleMatch } from '@/core/rules/types';
import {
  isRulebookWithinAcceptanceLimits,
  RULEBOOK_LIMIT_ERROR,
  RULEBOOK_LIMITS,
  RULEBOOK_VALIDATION_TRUNCATED,
} from './rulebook-limits';
import {
  custom,
  duplicateRuleNameIssues,
  formatIssues,
  INTENT_ERROR,
  type Issue,
  isBlockIntent,
  typed,
} from './rules-config';
import { NAME_PATTERN } from './source-syntax';
import type { CustomRule } from './types';

interface RulebookFixture {
  command: string;
  expect: 'blocked' | 'allowed';
  rule?: string;
}

interface CustomRuleV2 {
  name: string;
  command: string;
  match: CustomRuleMatch;
  reason: string;
  intent?: BlockIntent;
}

interface RulebookBase {
  name: string;
  version: string;
  description?: string;
  author?: string;
  allowed_commands: string[];
  tests?: RulebookFixture[];
}

export type Rulebook =
  | (RulebookBase & { rulebook_version: 1; rules: CustomRule[] })
  | (RulebookBase & { rulebook_version: 2; rules: CustomRuleV2[] });

export function assertValidRulebook(rulebook: unknown): Rulebook {
  const result = validateRulebook(rulebook);
  if (result.errors.length > 0) {
    throw new Error(result.errors.join('; '));
  }
  return rulebook as Rulebook;
}

const RULEBOOK_REASON_ERROR = `required non-empty string up to ${MAX_REASON_LENGTH} characters`;
const TOKEN_LIST_ERROR = 'must be a non-empty array of unique non-empty strings';
const COMMAND_PATH_ERROR = 'required non-empty array of non-empty strings';

/**
 * Rulebook acceptance, in the wording rulebook authors read. A rulebook is loaded on the
 * hook's path; the legacy `.safety-net.json` inline rules it resembles are validated in
 * `config-file.ts` under their own wording.
 *
 * @internal
 */
export function validateRulebook(rulebook: unknown): { errors: string[]; ruleNames: Set<string> } {
  if (!isRecord(rulebook)) {
    return { errors: ['Rulebook must be an object'], ruleNames: new Set() };
  }
  if (!isRulebookWithinAcceptanceLimits(rulebook)) {
    return { errors: [RULEBOOK_LIMIT_ERROR], ruleNames: new Set() };
  }
  const errors = [
    ...(rulebook.rulebook_version === 1 || rulebook.rulebook_version === 2
      ? []
      : ['rulebook_version must be 1 or 2']),
    ...formatIssues(rulebookIssues(rulebook, rulebook.rulebook_version === 2), ': ', ': '),
  ];
  return {
    errors:
      errors.length > RULEBOOK_LIMITS.maxValidationErrors
        ? [...errors.slice(0, RULEBOOK_LIMITS.maxValidationErrors), RULEBOOK_VALIDATION_TRUNCATED]
        : errors,
    ruleNames: new Set(collectCustomRuleNames(rulebook).map((name) => name.toLowerCase())),
  };
}

export function collectCustomRuleNames(config: unknown): string[] {
  const rules = isRecord(config) ? config.rules : undefined;
  return (Array.isArray(rules) ? rules : []).flatMap((rule) => {
    const name = isRecord(rule) ? rule.name : undefined;
    return typeof name === 'string' ? [name] : [];
  });
}

function rulebookIssues(rulebook: Record<string, unknown>, v2: boolean): Issue[] {
  return [
    ...(typeof rulebook.name === 'string' && NAME_PATTERN.test(rulebook.name)
      ? []
      : [typed(['name'], 'required string matching rule name pattern')]),
    ...(typeof rulebook.version === 'string' && rulebook.version !== ''
      ? []
      : [typed(['version'], 'required non-empty string')]),
    ...allowedCommandIssues(rulebook.allowed_commands),
    ...rulebookRuleIssues(rulebook.rules, v2),
    ...rulebookTestIssues(rulebook.tests),
    ...unknownFixtureRuleIssues(rulebook),
    ...unlistedRuleCommandIssues(rulebook),
  ];
}

function allowedCommandIssues(commands: unknown): Issue[] {
  if (!Array.isArray(commands)) return [typed(['allowed_commands'], 'required array')];
  const seen = new Set<string>();
  return [
    ...commands.flatMap((command, index) =>
      typeof command === 'string' && COMMAND_PATTERN.test(command)
        ? []
        : [typed(['allowed_commands', index], 'must match command pattern')],
    ),
    ...commands.flatMap((command, index) => {
      if (typeof command !== 'string' || !COMMAND_PATTERN.test(command)) return [];
      if (seen.has(command)) {
        return [custom(['allowed_commands', index], `duplicate command "${command}"`)];
      }
      seen.add(command);
      return [];
    }),
  ];
}

function rulebookRuleIssues(rules: unknown, v2: boolean): Issue[] {
  if (!Array.isArray(rules)) return [typed(['rules'], 'required array')];
  return [
    ...rules.flatMap((rule, index) => {
      if (!isRecord(rule)) return [typed(['rules', index], 'must be an object')];
      return v2 ? v2RuleIssues(rule, ['rules', index]) : v1RuleIssues(rule, ['rules', index]);
    }),
    ...duplicateRuleNameIssues(rules),
  ];
}

function v1RuleIssues(rule: Record<string, unknown>, path: readonly PropertyKey[]): Issue[] {
  return [
    ...ruleNameIssues(rule.name, path),
    ...ruleCommandIssues(rule.command, path),
    ...(rule.subcommand === undefined ||
    (typeof rule.subcommand === 'string' && COMMAND_PATTERN.test(rule.subcommand))
      ? []
      : [typed([...path, 'subcommand'], 'must match command pattern')]),
    ...tokenArrayIssues(
      rule.block_args,
      [...path, 'block_args'],
      'required non-empty array',
      false,
    ),
    ...ruleReasonIssues(rule.reason, path),
    ...ruleIntentIssues(rule.intent, path),
  ];
}

function v2RuleIssues(rule: Record<string, unknown>, path: readonly PropertyKey[]): Issue[] {
  return [
    ...ruleNameIssues(rule.name, path),
    ...ruleCommandIssues(rule.command, path),
    ...ruleReasonIssues(rule.reason, path),
    ...ruleIntentIssues(rule.intent, path),
    ...v2MatchIssues(rule.match, [...path, 'match']),
    ...(rule.subcommand === undefined
      ? []
      : [typed([...path, 'subcommand'], 'not supported in rulebook_version 2')]),
    ...(rule.block_args === undefined
      ? []
      : [typed([...path, 'block_args'], 'not supported in rulebook_version 2')]),
  ];
}

function ruleNameIssues(name: unknown, path: readonly PropertyKey[]): Issue[] {
  if (typeof name !== 'string') return [typed([...path, 'name'], 'required string')];
  return NAME_PATTERN.test(name) ? [] : [typed([...path, 'name'], 'must match rule name pattern')];
}

function ruleCommandIssues(command: unknown, path: readonly PropertyKey[]): Issue[] {
  return typeof command === 'string' && COMMAND_PATTERN.test(command)
    ? []
    : [typed([...path, 'command'], 'required string matching command pattern')];
}

function ruleReasonIssues(reason: unknown, path: readonly PropertyKey[]): Issue[] {
  return typeof reason === 'string' && reason !== '' && reason.length <= MAX_REASON_LENGTH
    ? []
    : [typed([...path, 'reason'], RULEBOOK_REASON_ERROR)];
}

function ruleIntentIssues(intent: unknown, path: readonly PropertyKey[]): Issue[] {
  return intent === undefined || isBlockIntent(intent)
    ? []
    : [typed([...path, 'intent'], INTENT_ERROR)];
}

function v2MatchIssues(match: unknown, path: readonly PropertyKey[]): Issue[] {
  if (!isRecord(match)) return [typed(path, 'required object')];
  return [
    ...tokenArrayIssues(match.command_path, [...path, 'command_path'], COMMAND_PATH_ERROR, false),
    ...(match.any_args === undefined
      ? []
      : tokenArrayIssues(match.any_args, [...path, 'any_args'], TOKEN_LIST_ERROR, true)),
    ...(match.exclude_args === undefined
      ? []
      : tokenArrayIssues(match.exclude_args, [...path, 'exclude_args'], TOKEN_LIST_ERROR, true)),
  ];
}

function tokenArrayIssues(
  tokens: unknown,
  path: readonly PropertyKey[],
  arrayError: string,
  unique: boolean,
): Issue[] {
  if (!Array.isArray(tokens)) return [typed(path, arrayError)];
  const elements = tokens.flatMap((token, index) => {
    if (typeof token !== 'string') {
      return [typed([...path, index], 'must be a non-empty string')];
    }
    return token === '' ? [custom([...path, index], 'must be a non-empty string')] : [];
  });
  if (tokens.some((token) => typeof token !== 'string')) return elements;
  return [
    ...elements,
    ...(tokens.length === 0 ? [custom(path, arrayError)] : []),
    ...(unique && new Set(tokens).size !== tokens.length
      ? [custom(path, 'must not contain duplicate values')]
      : []),
  ];
}

function rulebookTestIssues(tests: unknown): Issue[] {
  if (tests === undefined) return [];
  if (!Array.isArray(tests)) return [typed(['tests'], 'must be an array if provided')];
  return tests.flatMap((fixture, index) => {
    if (!isRecord(fixture)) return [typed(['tests', index], 'must be an object')];
    return [
      ...(typeof fixture.command === 'string' && fixture.command.trim() !== ''
        ? []
        : [typed(['tests', index, 'command'], 'required non-empty string')]),
      ...(fixture.expect === 'blocked' || fixture.expect === 'allowed'
        ? []
        : [typed(['tests', index, 'expect'], 'must be "blocked" or "allowed"')]),
      ...(fixture.rule === undefined || typeof fixture.rule === 'string'
        ? []
        : [typed(['tests', index, 'rule'], 'must be a string if provided')]),
      ...(fixture.expect === 'blocked' && typeof fixture.rule !== 'string'
        ? [custom(['tests', index, 'rule'], 'required string for blocked fixtures')]
        : []),
    ];
  });
}

function unknownFixtureRuleIssues(rulebook: Record<string, unknown>): Issue[] {
  if (!Array.isArray(rulebook.tests)) return [];
  const declared = new Set(collectCustomRuleNames(rulebook));
  return [
    ...new Set(
      rulebook.tests.flatMap((fixture) =>
        isRecord(fixture) && fixture.expect === 'blocked' && typeof fixture.rule === 'string'
          ? [fixture.rule]
          : [],
      ),
    ),
  ]
    .filter((rule) => !declared.has(rule))
    .map((rule) => custom(['tests'], `blocked fixture references unknown rule "${rule}"`));
}

function unlistedRuleCommandIssues(rulebook: Record<string, unknown>): Issue[] {
  if (!Array.isArray(rulebook.allowed_commands) || !Array.isArray(rulebook.rules)) return [];
  const allowed = new Set(
    rulebook.allowed_commands.filter((command) => typeof command === 'string'),
  );
  return rulebook.rules.flatMap((rule, index) => {
    const command = isRecord(rule) ? rule.command : undefined;
    if (typeof command !== 'string' || allowed.has(command)) return [];
    return [custom(['rules', index, 'command'], `"${command}" must be listed in allowed_commands`)];
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
