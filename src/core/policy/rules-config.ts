import { BLOCK_INTENTS, type BlockIntent } from '@/core/decision';
import {
  bindDelegatedPolicyFilesystemTarget,
  PolicyFilesystemError,
  type PolicyFilesystemTarget,
  readPolicyFile,
} from '@/core/io/safe-read';
import { COMMAND_PATTERN, MAX_REASON_LENGTH } from '@/core/rules/constants';
import { RULE_SOURCE_LIMIT, RULE_SOURCE_LIMIT_ERROR } from './resource-limits';
import { getRulebookSourceSyntaxError } from './source-syntax';
import { isReservedTransparentWrapper } from './transparent-wrappers';
import type { CustomRule } from './types';

export type RuleOverride = 'off' | { reason: string; intent?: BlockIntent };

export type RulesConfig = {
  version: 1;
  rules: string[];
  overrides: Record<string, RuleOverride>;
  transparent_wrappers: string[];
};

export const DEFAULT_CONFIG: RulesConfig = {
  version: 1,
  rules: [],
  overrides: {},
  transparent_wrappers: [],
};

export interface ActiveRulebookSummary {
  spec: string;
  name: string;
  version: string;
  ruleCount: number;
}

export interface LoadedRulebookInfo {
  source: 'user' | 'project';
  spec: string;
  name: string;
  version: string;
  rules: string[];
}

export interface LoadedRulesPolicy {
  rules: CustomRule[];
  transparent_wrappers: string[];
  rulebooks: LoadedRulebookInfo[];

  errors: string[];

  warnings: string[];
  userConfig?: RulesConfig;
  projectConfig?: RulesConfig;
  userConfigPath: string;
  projectConfigPath: string;
}

export function readRulesConfig(path: string | PolicyFilesystemTarget): {
  config: RulesConfig | null;
  errors: string[];
} {
  try {
    const content = readPolicyFile(toTarget(path));
    if (content === null) return { config: null, errors: [] };
    if (!content.trim()) {
      return { config: null, errors: ['Config file is empty'] };
    }

    const parsed = JSON.parse(content) as Partial<RulesConfig>;
    const validation = getRulesConfigValidation(parsed);
    if (validation.errors.length > 0) {
      return { config: null, errors: validation.errors };
    }

    return {
      config: {
        version: 1,
        rules: parsed.rules ?? [],
        overrides: parsed.overrides ?? {},
        transparent_wrappers: parsed.transparent_wrappers ?? [],
      },
      errors: [],
    };
  } catch (error) {
    if (error instanceof PolicyFilesystemError) {
      return { config: null, errors: [error.message] };
    }

    const message = error instanceof Error ? error.message : String(error);
    return {
      config: null,
      errors: [error instanceof SyntaxError ? 'Invalid JSON' : message],
    };
  }
}

function toTarget(path: string | PolicyFilesystemTarget): PolicyFilesystemTarget {
  return typeof path === 'string' ? bindDelegatedPolicyFilesystemTarget(path) : path;
}

export type Issue = {
  path: readonly PropertyKey[];
  message: string;
  kind: 'typed' | 'custom' | 'unknownKeys' | 'key' | 'limit';
};

export const typed = (path: readonly PropertyKey[], message: string): Issue => ({
  path,
  message,
  kind: 'typed',
});

export const custom = (path: readonly PropertyKey[], message: string): Issue => ({
  path,
  message,
  kind: 'custom',
});

export function duplicateRuleNameIssues(rules: readonly unknown[]): Issue[] {
  const names = new Set<string>();
  return rules.flatMap((rule, index) => {
    const name = isRecord(rule) ? rule.name : undefined;
    if (typeof name !== 'string') return [];
    if (names.has(name.toLowerCase())) {
      return [custom(['rules', index, 'name'], `duplicate rule name "${name}"`)];
    }
    names.add(name.toLowerCase());
    return [];
  });
}

export const INTENT_ERROR = `must be one of ${BLOCK_INTENTS.join(', ')}`;
/** @internal */
export const RULE_OVERRIDE_KEY_PATTERN = /^[^/]+\/[^/]+$/;
/** @internal */
export const RULES_CONFIG_FIELDS = ['version', 'rules', 'overrides', 'transparent_wrappers'];

export function getRulesConfigValidation(config: unknown): {
  errors: string[];
  sources: Set<string>;
} {
  const issues = rulesConfigIssues(config);
  return {
    errors: formatIssues(
      sortIssues(issues, RULES_CONFIG_FIELDS, (issue) => issue.kind === 'custom'),
      ': ',
      ' ',
    ),
    sources: collectValidSources(config, issues),
  };
}

function rulesConfigIssues(config: unknown): Issue[] {
  if (!isRecord(config)) return [typed([], 'Config must be an object')];

  const overLimit = Array.isArray(config.rules) && config.rules.length > RULE_SOURCE_LIMIT;
  return [
    ...(config.version === 1 ? [] : [typed(['version'], 'must be 1')]),
    ...ruleSourceIssues(config.rules, overLimit),
    ...ruleOverrideIssues(config.overrides),
    ...transparentWrapperIssues(config.transparent_wrappers),
    ...(overLimit ? [] : duplicateRuleSourceIssues(config.rules)),
    ...(isRecord(config.overrides)
      ? Object.keys(config.overrides)
          .filter((key) => !RULE_OVERRIDE_KEY_PATTERN.test(key))
          .map((key) => custom(['overrides', key], 'must use <rulebook-name>/<rule-name>'))
      : []),
    ...reservedWrapperIssues(config.transparent_wrappers),
  ];
}

function ruleSourceIssues(rules: unknown, overLimit: boolean): Issue[] {
  if (rules === undefined) return [];
  if (!Array.isArray(rules)) {
    return [
      typed(['rules'], 'must be an array of rulebook source strings'),

      ...(exceedsLength(rules, RULE_SOURCE_LIMIT)
        ? [typed(['rules'], RULE_SOURCE_LIMIT_ERROR)]
        : []),
    ];
  }
  if (overLimit) return [{ path: ['rules'], message: RULE_SOURCE_LIMIT_ERROR, kind: 'limit' }];
  return rules.flatMap((source, index) => {
    if (typeof source !== 'string') {
      return [
        typed(['rules', index], 'must be a rulebook source string'),
        ...(fallsShortOfLength(source, 1)
          ? [typed(['rules', index], 'must be a non-empty rulebook source string')]
          : []),
      ];
    }
    return source === ''
      ? [typed(['rules', index], 'must be a non-empty rulebook source string')]
      : [];
  });
}

function exceedsLength(value: unknown, maximum: number): boolean {
  const length = lengthOf(value);
  return length !== undefined && !(length <= maximum);
}

function fallsShortOfLength(value: unknown, minimum: number): boolean {
  const length = lengthOf(value);
  return length !== undefined && !(length >= minimum);
}

function lengthOf(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined;
  const length = (value as { length?: unknown }).length;
  return length === undefined ? undefined : Number(length);
}

function duplicateRuleSourceIssues(rules: unknown): Issue[] {
  if (!Array.isArray(rules)) return [];
  const sources = new Set<string>();
  return rules.flatMap((source, index) => {
    if (typeof source !== 'string' || source === '') return [];
    if (source.trim() === '') {
      return [custom(['rules', index], 'must be a non-empty rulebook source string')];
    }
    const sourceError = getRulebookSourceSyntaxError(source);
    if (sourceError) return [custom(['rules', index], sourceError)];
    if (sources.has(source)) {
      return [custom(['rules', index], `duplicate rulebook source "${source}"`)];
    }
    sources.add(source);
    return [];
  });
}

function ruleOverrideIssues(overrides: unknown): Issue[] {
  if (overrides === undefined) return [];
  if (!isRecord(overrides)) return [typed(['overrides'], 'must be an object if provided')];
  return Object.keys(overrides).flatMap((key) => {
    const override = overrides[key];
    if (override === 'off') return [];
    if (!isRecord(override)) return [typed(['overrides', key], 'must be "off" or an object')];
    return [
      ...overrideReasonIssues(override.reason, ['overrides', key, 'reason']),
      ...(override.intent === undefined || isBlockIntent(override.intent)
        ? []
        : [typed(['overrides', key, 'intent'], INTENT_ERROR)]),
    ];
  });
}

function overrideReasonIssues(reason: unknown, path: readonly PropertyKey[]): Issue[] {
  if (typeof reason !== 'string') {
    return [
      typed(path, 'required non-empty string'),
      ...(exceedsLength(reason, MAX_REASON_LENGTH)
        ? [typed(path, `must be at most ${MAX_REASON_LENGTH} characters`)]
        : []),
    ];
  }
  if (reason === '') return [typed(path, 'required non-empty string')];
  return reason.length > MAX_REASON_LENGTH
    ? [typed(path, `must be at most ${MAX_REASON_LENGTH} characters`)]
    : [];
}

function transparentWrapperIssues(wrappers: unknown): Issue[] {
  if (wrappers === undefined) return [];
  if (!Array.isArray(wrappers)) {
    return [typed(['transparent_wrappers'], 'must be an array of command strings')];
  }
  return wrappers.flatMap((wrapper, index) => {
    if (typeof wrapper !== 'string') {
      return [typed(['transparent_wrappers', index], 'must be a command string')];
    }
    return COMMAND_PATTERN.test(wrapper)
      ? []
      : [typed(['transparent_wrappers', index], 'must match command pattern')];
  });
}

function reservedWrapperIssues(wrappers: unknown): Issue[] {
  if (!Array.isArray(wrappers)) return [];
  const seen = new Set<string>();
  return wrappers.flatMap((wrapper, index) => {
    if (typeof wrapper !== 'string' || !COMMAND_PATTERN.test(wrapper)) return [];
    if (seen.has(wrapper)) {
      return [custom(['transparent_wrappers', index], `duplicate command "${wrapper}"`)];
    }
    if (isReservedTransparentWrapper(wrapper)) {
      return [
        custom(
          ['transparent_wrappers', index],
          `reserved command "${wrapper}" cannot be a wrapper`,
        ),
      ];
    }
    seen.add(wrapper);
    return [];
  });
}

function collectValidSources(
  config: unknown,
  issues: readonly { path: readonly PropertyKey[] }[],
): Set<string> {
  const rules = isRecord(config) ? config.rules : undefined;
  if (!Array.isArray(rules)) return new Set();
  if (issues.some((issue) => issue.path.length === 1 && issue.path[0] === 'rules')) {
    return new Set();
  }
  const rejected = new Set(
    issues
      .filter((issue) => issue.path[0] === 'rules' && typeof issue.path[1] === 'number')
      .map((issue) => issue.path[1]),
  );
  return new Set(
    rules.filter(
      (source, index): source is string => typeof source === 'string' && !rejected.has(index),
    ),
  );
}

export function sortIssues<T extends { path: readonly PropertyKey[] }>(
  issues: readonly T[],
  fields: readonly string[],
  isRefinement: (issue: T) => boolean,
): T[] {
  const entries = issues.map((issue) => issue.path[1]);
  const entryOrder = [...new Set(entries.filter((entry) => typeof entry === 'string'))];
  const rank = (issue: T, entry: PropertyKey | undefined) =>
    [
      issue.path.length === 0 ? -1 : fields.indexOf(String(issue.path[0])),
      typeof entry === 'number' ? entry : entryOrder.indexOf(String(entry)),
      isRefinement(issue) ? 0 : 1,
    ] as const;
  return issues
    .map((issue, index) => ({ issue, rank: rank(issue, entries[index]) }))
    .sort((a, b) => a.rank[0] - b.rank[0] || a.rank[1] - b.rank[1] || a.rank[2] - b.rank[2])
    .map((entry) => entry.issue);
}

export function formatIssues(
  issues: readonly Issue[],
  separator: string,
  topLevelSeparator: string,
): string[] {
  return [
    ...new Set(
      issues.map((issue) => {
        const rendered = renderIssuePath(issue.path);
        if (issue.kind === 'unknownKeys') {
          return `${rendered ? `${rendered}.` : ''}unknown field "${issue.message}"`;
        }

        if (issue.kind === 'key' || issue.kind === 'limit' || issue.path.length === 0) {
          return issue.message;
        }
        return `${rendered}${issue.path.length === 1 ? topLevelSeparator : separator}${issue.message}`;
      }),
    ),
  ];
}

function renderIssuePath(path: readonly PropertyKey[]): string {
  return path
    .map((segment, index) => {
      if (typeof segment === 'number') return `[${segment}]`;
      return index === 0 ? String(segment) : `.${String(segment)}`;
    })
    .join('');
}

export function isBlockIntent(value: unknown): boolean {
  return (BLOCK_INTENTS as readonly unknown[]).includes(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
