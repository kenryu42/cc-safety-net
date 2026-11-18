import { existsSync, readFileSync } from 'node:fs';
import type { BlockIntent } from '@/core/decision';
import type { Environment } from '@/core/environment';
import { DESTRUCTIVE_COMMAND_RULE_ID_SET } from '@/core/rules/destructive';
import { SECRET_DEFAULT_OFF_RULE_ID_SET, SECRET_PROTECTION_RULE_ID_SET } from '@/core/rules/secret';
import {
  getDestructiveAllowPathError,
  getSecretAllowPathError,
  getSecretDenyPathError,
} from './allow-paths';
import {
  clampAuditRetentionDays,
  DEFAULT_AUDIT_RETENTION_DAYS,
  MAX_AUDIT_RETENTION_DAYS,
  MIN_AUDIT_RETENTION_DAYS,
} from './audit-retention-days';
import { resolveEffectiveDestructiveCommandRules } from './effective-rules';
import { ENV_FLAGS, envTruthy, getCCSafetyNetEnvModes, sessionSafetyLevel } from './env';
import { mergeProjectPolicy, type ProjectPolicyProjection } from './merge';
import {
  getProjectPolicyPath,
  getUserPolicyPath,
  projectPolicyIsUserPolicy,
  type RulesPolicyOptions,
} from './paths';
import { custom, type Issue, renderIssuePath, ruleMessageIssues, typed } from './rules-config';
import { SAFETY_OVERRIDE_KEYS } from './safety-level';
import type {
  DestructiveCommandRuleOverride,
  EffectiveDestructiveCommandRuleState,
  EffectiveSafetyCapabilities,
  GuiPolicy,
  PolicySafety,
  PolicySafetyLevel,
  PolicyScopes,
  RuleMessage,
  SecretProtectionConfig,
} from './types';

const SAFETY_LEVELS = new Set(['standard', 'strict', 'paranoid']);

type PolicyFallback = 'salvaged' | 'defaults';

type PartialPolicy = {
  safety: PolicySafety;
  worktreeMode: boolean;
  destructiveCommandProtectionEnabled: boolean;
  destructiveCommandRuleOverrides: Record<string, DestructiveCommandRuleOverride>;
  destructiveCommandAllowPaths: string[];
  secretProtection: SecretProtectionConfig;
};

type PolicyConfig = PartialPolicy & {
  ruleMessages: Record<string, RuleMessage>;
  errors: string[];
  fallback?: PolicyFallback;
  policyScopes?: PolicyScopes;
};

export const DEFAULT_GUI_POLICY: GuiPolicy = {
  version: 1,
  safety: {
    level: 'standard',
    overrides: {},
  },
  workflow: {
    worktree_mode: false,
  },
  destructive_command_protection: {
    enabled: true,
    overrides: {},
    allow_paths: [],
  },
  secret_protection: {
    enabled: true,
    overrides: {},
    deny_paths: [],
    allow_paths: [],
  },
  audit: {
    retention_days: DEFAULT_AUDIT_RETENTION_DAYS,
  },
};

export function loadPolicyConfig(
  environment: Environment,
  options: RulesPolicyOptions,
): PolicyConfig {
  const user = readPolicyConfig(getUserPolicyPath(environment, options), environment.home);
  const projectFile: ReturnType<typeof readPolicyFile> = projectPolicyIsUserPolicy(
    environment,
    options,
  )
    ? { exists: false, policy: createDefaultGuiPolicy(), errors: [] }
    : readPolicyFile(getProjectPolicyPath(options.cwd), environment.home);
  const project = projectPolicyProjection(projectFile.parsed, environment.home);
  const weakeningsIgnored = envTruthy(ENV_FLAGS.projectTightenOnly, environment.env);
  const userPolicy = user.gui ?? DEFAULT_GUI_POLICY;
  const merged =
    Object.keys(project.policy).length > 0
      ? mergeProjectPolicy(
          userPolicy,
          project.policy,
          weakeningsIgnored,
          sessionSafetyLevel(userPolicy.safety.level, environment.env),
        )
      : undefined;
  const errors = [...user.errors, ...projectFile.errors, ...project.diagnostics];

  const fallback =
    (user.fallback === 'defaults' && merged ? 'salvaged' : user.fallback) ??
    (user.gui ? undefined : projectFile.fallback) ??
    (errors.length > 0 ? 'salvaged' : undefined);

  const levelScope =
    project.policy.safety?.level && merged?.policy.safety.level === project.policy.safety.level
      ? 'project'
      : user.levelPresent
        ? 'user'
        : 'default';
  return {
    ...(merged ? normalizePolicyConfig(merged.policy) : user.policy),
    ruleMessages: ruleMessagesOf(userPolicy),
    errors,
    ...(fallback ? { fallback } : {}),

    ...(projectFile.exists
      ? {
          policyScopes: { levelScope, weakenings: merged?.weakenings ?? [], weakeningsIgnored },
        }
      : {}),
  };
}

const PROJECT_AUDIT_DIAGNOSTIC =
  'project policy audit settings are ignored; audit is user scope only';

export function ruleMessagesOf(policy: GuiPolicy): Record<string, RuleMessage> {
  return {
    ...policy.destructive_command_protection.messages,
    ...policy.secret_protection.messages,
  };
}

function projectRuleMessageFields(value: Record<string, unknown>): string[] {
  return ['destructive_command_protection', 'secret_protection'].flatMap((section) => {
    const fields = value[section];
    return isRecord(fields) && fields.messages !== undefined ? [`${section}.messages`] : [];
  });
}

export function projectRuleMessageRejections(proposal: unknown): string[] {
  return (isRecord(proposal) ? projectRuleMessageFields(proposal) : []).map(
    (field) => `${field} is user scope only; remove it from a project proposal`,
  );
}

export function projectPolicyProjection(
  value: unknown,
  home: string,
): {
  policy: ProjectPolicyProjection;
  diagnostics: string[];
} {
  if (!isRecord(value)) return { policy: {}, diagnostics: [] };
  const safety = isRecord(value.safety) ? value.safety : {};
  const workflow = isRecord(value.workflow) ? value.workflow : {};
  const destructive = isRecord(value.destructive_command_protection)
    ? value.destructive_command_protection
    : {};
  const secret = isRecord(value.secret_protection) ? value.secret_protection : {};
  const safetySection = {
    ...(SAFETY_LEVELS.has(safety.level as string)
      ? { level: safety.level as PolicySafetyLevel }
      : {}),
    ...(isRecord(safety.overrides)
      ? withPresentFields({
          overrides: pickBooleans(
            safety.overrides,
            SAFETY_OVERRIDE_KEYS,
            ['safety', 'overrides'],
            IGNORE_ISSUES,
          ),
        })
      : {}),
  };
  const destructiveSection = {
    ...(typeof destructive.enabled === 'boolean' ? { enabled: destructive.enabled } : {}),
    ...(destructive.overrides !== undefined
      ? {
          overrides: repairRuleOverrides(
            destructive.overrides,
            DESTRUCTIVE_COMMAND_RULE_ID_SET,
            DESTRUCTIVE_OVERRIDES,
            IGNORE_ISSUES,
          ),
        }
      : {}),
    ...(destructive.allow_paths !== undefined
      ? {
          allow_paths: repairPaths(
            destructive.allow_paths,
            getDestructiveAllowPathError,
            home,
            ['destructive_command_protection', 'allow_paths'],
            IGNORE_ISSUES,
          ),
        }
      : {}),
  };
  const secretSection = {
    ...(typeof secret.enabled === 'boolean' ? { enabled: secret.enabled } : {}),
    ...(secret.overrides !== undefined
      ? {
          overrides: repairRuleOverrides(
            secret.overrides,
            SECRET_PROTECTION_RULE_ID_SET,
            SECRET_OVERRIDES,
            IGNORE_ISSUES,
          ),
        }
      : {}),
    ...(secret.deny_paths !== undefined
      ? {
          deny_paths: repairPaths(
            secret.deny_paths,
            getSecretDenyPathError,
            home,
            ['secret_protection', 'deny_paths'],
            IGNORE_ISSUES,
          ),
        }
      : {}),
    ...(secret.allow_paths !== undefined
      ? {
          allow_paths: repairPaths(
            secret.allow_paths,
            getSecretAllowPathError,
            home,
            ['secret_protection', 'allow_paths'],
            IGNORE_ISSUES,
          ),
        }
      : {}),
  };
  return {
    policy: withPresentFields({
      safety: safetySection,
      workflow:
        typeof workflow.worktree_mode === 'boolean'
          ? { worktree_mode: workflow.worktree_mode }
          : {},
      destructive_command_protection: destructiveSection,
      secret_protection: secretSection,
    }),
    diagnostics: [
      ...(value.audit === undefined ? [] : [PROJECT_AUDIT_DIAGNOSTIC]),
      ...projectRuleMessageFields(value).map(
        (field) => `project policy ${field} is ignored; rule messages are user scope only`,
      ),
    ],
  };
}

function pickBooleans<K extends string>(
  source: Record<string, unknown>,
  keys: readonly K[],
  path: readonly PropertyKey[],
  report: ReportIssue,
) {
  return Object.fromEntries(
    keys.flatMap((key) => {
      const value = source[key];
      if (typeof value === 'boolean') return [[key, value]];
      if (value !== undefined) report(typed([...path, key], NOT_A_BOOLEAN));
      return [];
    }),
  ) as Partial<Record<K, boolean>>;
}

function withPresentFields<T extends Record<string, object>>(sections: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(sections).flatMap((entry) => (Object.keys(entry[1]).length > 0 ? [entry] : [])),
  ) as Partial<T>;
}

type ReportIssue = (issue: Issue) => void;

const IGNORE_ISSUES: ReportIssue = () => undefined;

const NOT_A_BOOLEAN = 'must be a boolean';
const NOT_AN_OBJECT = 'must be an object if provided';
const AUDIT_RETENTION_ERROR = `must be an integer between ${MIN_AUDIT_RETENTION_DAYS} and ${MAX_AUDIT_RETENTION_DAYS}`;
const DESTRUCTIVE_OVERRIDES = {
  path: ['destructive_command_protection', 'overrides'],
  label: 'destructive command',
} as const;
const SECRET_OVERRIDES = {
  path: ['secret_protection', 'overrides'],
  label: 'secret protection',
} as const;
const DESTRUCTIVE_MESSAGES = {
  path: ['destructive_command_protection', 'messages'],
  label: 'destructive command',
} as const;
const SECRET_MESSAGES = {
  path: ['secret_protection', 'messages'],
  label: 'secret protection',
} as const;
const RULE_MESSAGE_FIELDS = ['reason', 'intent'];
export const USER_POLICY_FIELDS = [
  'version',
  'safety',
  'workflow',
  'destructive_command_protection',
  'secret_protection',
  'audit',
];

export function validateUserPolicy(
  value: unknown,
  home: string,
): { policy: GuiPolicy; issues: Issue[] } {
  const issues: Issue[] = [];
  const policy = salvagePolicy(value, home, (issue) => {
    issues.push(issue);
  });
  return { policy, issues };
}

export function normalizeGuiPolicy(value: unknown, home: string): GuiPolicy {
  return salvagePolicy(value, home, IGNORE_ISSUES);
}

function salvagePolicy(value: unknown, home: string, report: ReportIssue): GuiPolicy {
  if (!isRecord(value)) {
    report(typed([], 'Config must be an object'));
    return createDefaultGuiPolicy();
  }

  if (value.version !== 1) report(typed(['version'], 'must be 1'));
  const safety = readSection(value.safety, ['safety'], ['level', 'overrides'], report);
  const safetyOverrides = readSection(
    safety.overrides,
    ['safety', 'overrides'],
    SAFETY_OVERRIDE_KEYS,
    report,
  );
  const workflow = readSection(value.workflow, ['workflow'], ['worktree_mode'], report);
  const destructiveCommand = readSection(
    value.destructive_command_protection,
    ['destructive_command_protection'],
    ['enabled', 'overrides', 'messages', 'allow_paths'],
    report,
  );
  const secret = readSection(
    value.secret_protection,
    ['secret_protection'],
    ['enabled', 'overrides', 'messages', 'deny_paths', 'allow_paths'],
    report,
  );
  const audit = readSection(value.audit, ['audit'], ['retention_days'], report);

  reportUnknownFields(value, USER_POLICY_FIELDS, [], report);
  return {
    version: 1,
    safety: {
      level: readSafetyLevel(safety.level, report),
      overrides: pickBooleans(
        safetyOverrides,
        SAFETY_OVERRIDE_KEYS,
        ['safety', 'overrides'],
        report,
      ),
    },
    workflow: {
      worktree_mode: readBoolean(
        workflow.worktree_mode,
        ['workflow', 'worktree_mode'],
        false,
        report,
      ),
    },
    destructive_command_protection: {
      enabled: readBoolean(
        destructiveCommand.enabled,
        ['destructive_command_protection', 'enabled'],
        true,
        report,
      ),
      overrides: repairRuleOverrides(
        destructiveCommand.overrides,
        DESTRUCTIVE_COMMAND_RULE_ID_SET,
        DESTRUCTIVE_OVERRIDES,
        report,
      ),
      ...repairRuleMessages(
        destructiveCommand.messages,
        DESTRUCTIVE_COMMAND_RULE_ID_SET,
        DESTRUCTIVE_MESSAGES,
        report,
      ),
      allow_paths: repairPaths(
        destructiveCommand.allow_paths,
        getDestructiveAllowPathError,
        home,
        ['destructive_command_protection', 'allow_paths'],
        report,
      ),
    },
    secret_protection: {
      enabled: readBoolean(secret.enabled, ['secret_protection', 'enabled'], true, report),
      overrides: repairRuleOverrides(
        secret.overrides,
        SECRET_PROTECTION_RULE_ID_SET,
        SECRET_OVERRIDES,
        report,
      ),
      ...repairRuleMessages(
        secret.messages,
        SECRET_PROTECTION_RULE_ID_SET,
        SECRET_MESSAGES,
        report,
      ),
      deny_paths: repairPaths(
        secret.deny_paths,
        getSecretDenyPathError,
        home,
        ['secret_protection', 'deny_paths'],
        report,
      ),
      allow_paths: repairPaths(
        secret.allow_paths,
        getSecretAllowPathError,
        home,
        ['secret_protection', 'allow_paths'],
        report,
      ),
    },
    audit: { retention_days: readAuditRetentionDays(audit.retention_days, report) },
  };
}

function readSection(
  value: unknown,
  path: readonly PropertyKey[],
  known: readonly string[],
  report: ReportIssue,
): Record<string, unknown> {
  if (value === undefined) return {};
  if (!isRecord(value)) {
    report(typed(path, NOT_AN_OBJECT));
    return {};
  }
  reportUnknownFields(value, known, path, report);
  return value;
}

function reportUnknownFields(
  record: Record<string, unknown>,
  known: readonly string[],
  path: readonly PropertyKey[],
  report: ReportIssue,
): void {
  for (const key of Object.keys(record).filter((candidate) => !known.includes(candidate))) {
    report({ path, message: key, kind: 'unknownKeys' });
  }
}

function readSafetyLevel(value: unknown, report: ReportIssue): PolicySafetyLevel {
  if (value === undefined) return 'standard';
  if (SAFETY_LEVELS.has(value as string)) return value as PolicySafetyLevel;
  report(typed(['safety', 'level'], 'must be "standard", "strict", or "paranoid"'));
  return 'standard';
}

function readBoolean(
  value: unknown,
  path: readonly PropertyKey[],
  fallback: boolean,
  report: ReportIssue,
): boolean {
  if (typeof value === 'boolean') return value;
  if (value !== undefined) report(typed(path, NOT_A_BOOLEAN));
  return fallback;
}

function readAuditRetentionDays(value: unknown, report: ReportIssue): number {
  const usable =
    value === undefined ||
    (typeof value === 'number' &&
      Number.isInteger(value) &&
      value >= MIN_AUDIT_RETENTION_DAYS &&
      value <= MAX_AUDIT_RETENTION_DAYS);

  if (!usable) report(typed(['audit', 'retention_days'], AUDIT_RETENTION_ERROR));
  return clampAuditRetentionDays(value);
}

type RuleEntries = { readonly path: readonly PropertyKey[]; readonly label: string };

function repairRuleEntries<T>(
  value: unknown,
  knownRuleIds: ReadonlySet<string>,
  entries: RuleEntries,
  report: ReportIssue,
  repairEntry: (entry: unknown, path: readonly PropertyKey[]) => T | undefined,
): Record<string, T> {
  if (value === undefined) return {};
  if (!isRecord(value)) {
    report(typed(entries.path, NOT_AN_OBJECT));
    return {};
  }
  return Object.fromEntries(
    Object.entries(value).flatMap(([id, entry]) => {
      const path = [...entries.path, id];
      if (!knownRuleIds.has(id)) {
        report({ path, message: `unknown ${entries.label} rule id "${id}"`, kind: 'key' });
        return [];
      }
      const repaired = repairEntry(entry, path);
      return repaired === undefined ? [] : [[id, repaired] as const];
    }),
  );
}

function repairRuleOverrides(
  value: unknown,
  knownRuleIds: ReadonlySet<string>,
  overrides: RuleEntries,
  report: ReportIssue,
) {
  return repairRuleEntries(value, knownRuleIds, overrides, report, (override, path) => {
    if (override === 'on' || override === 'off') return override;
    report(
      typed(
        path,
        isRecord(override)
          ? `must be "on" or "off"; a custom reason belongs in ${String(overrides.path[0])}.messages`
          : 'must be "on" or "off"',
      ),
    );
    return undefined;
  });
}

function repairRuleMessages(
  value: unknown,
  knownRuleIds: ReadonlySet<string>,
  messages: RuleEntries,
  report: ReportIssue,
): { messages?: Record<string, RuleMessage> } {
  const repaired = repairRuleEntries(value, knownRuleIds, messages, report, (message, path) => {
    if (!isRecord(message)) {
      report(typed(path, 'must be an object with a reason'));
      return undefined;
    }
    reportUnknownFields(message, RULE_MESSAGE_FIELDS, path, report);
    const issues = ruleMessageIssues(message, path);
    for (const issue of issues) report(issue);
    if (issues.length > 0) return undefined;
    return {
      reason: message.reason as string,
      ...(message.intent === undefined ? {} : { intent: message.intent as BlockIntent }),
    };
  });
  return Object.keys(repaired).length > 0 ? { messages: repaired } : {};
}

function repairPaths(
  value: unknown,
  getPathError: (value: unknown, home: string) => string | null,
  home: string,
  path: readonly PropertyKey[],
  report: ReportIssue,
): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    report(typed(path, 'must be an array of paths'));
    return [];
  }
  return value.flatMap((entry, index) => {
    const error = getPathError(entry, home);
    if (error === null) return [entry as string];
    report(
      typeof entry === 'string' ? custom([...path, index], error) : typed([...path, index], error),
    );
    return [];
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function createDefaultGuiPolicy(): GuiPolicy {
  return structuredClone(DEFAULT_GUI_POLICY);
}

export interface PolicyPreview {
  selectedPreset: PolicySafetyLevel;
  effectiveLevel: ReturnType<typeof getCCSafetyNetEnvModes>['effectiveLevel'];
  capabilities: EffectiveSafetyCapabilities;
  rules: Readonly<Record<string, EffectiveDestructiveCommandRuleState>>;
  counts: {
    enabled: number;
    disabled: number;
    effectiveCustomizations: number;
  };
}

export function createPolicyPreview(
  policy: GuiPolicy,
  env: ReadonlyMap<string, string>,
): PolicyPreview {
  const modes = getCCSafetyNetEnvModes({ safety: normalizeSafety(policy.safety) }, env);
  const rules = resolveEffectiveDestructiveCommandRules(
    {
      destructiveCommandProtectionEnabled: policy.destructive_command_protection.enabled,
      destructiveCommandRuleOverrides: policy.destructive_command_protection.overrides,
    },
    modes.capabilities,
  );
  const values = Object.values(rules);

  const configurableValues = values.filter((state) => state.source !== 'catastrophic');
  return {
    selectedPreset: policy.safety.level,
    effectiveLevel: modes.effectiveLevel,
    capabilities: modes.capabilities,
    rules,
    counts: {
      enabled: configurableValues.filter((state) => state.enabled).length,
      disabled: configurableValues.filter((state) => !state.enabled).length,
      effectiveCustomizations: values.filter((state) => state.changesInherited).length,
    },
  };
}

export function readPolicyFile(
  path: string,
  home: string,
): {
  exists: boolean;
  parsed?: unknown;
  policy: GuiPolicy;
  errors: string[];
  fallback?: PolicyFallback;
} {
  if (!existsSync(path)) return { exists: false, policy: createDefaultGuiPolicy(), errors: [] };

  try {
    const content = readFileSync(path, 'utf-8');
    if (!content.trim()) {
      return {
        exists: true,
        policy: createDefaultGuiPolicy(),
        errors: [`${path}: Config file is empty`],
        fallback: 'defaults',
      };
    }
    const parsed = JSON.parse(content) as unknown;
    const salvaged = validateUserPolicy(parsed, home);
    if (salvaged.issues.length === 0) {
      return { exists: true, parsed, policy: salvaged.policy, errors: [] };
    }
    return {
      exists: true,
      parsed,
      policy: salvaged.policy,
      errors: salvaged.issues.map((issue) => `${path}: ${renderSalvageIssue(issue)}`),
      fallback: isRecord(parsed) ? 'salvaged' : 'defaults',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      exists: true,
      policy: createDefaultGuiPolicy(),
      errors: [`${path}: ${error instanceof SyntaxError ? 'Invalid JSON' : message}`],
      fallback: 'defaults',
    };
  }
}

const SALVAGE_WORDING = new Map([
  ['Config must be an object', 'not a JSON object'],
  ['must be 1', 'not 1'],
  [NOT_AN_OBJECT, 'not an object'],
  ['must be "standard", "strict", or "paranoid"', 'not one of standard, strict, paranoid'],
  [NOT_A_BOOLEAN, 'not a boolean'],
  ['must be "on" or "off"', 'not "on" or "off"'],
  ['must be an array of paths', 'not an array'],
  [
    AUDIT_RETENTION_ERROR,
    `not an integer between ${MIN_AUDIT_RETENTION_DAYS} and ${MAX_AUDIT_RETENTION_DAYS}`,
  ],
]);

function renderSalvageIssue(issue: Issue): string {
  const path = renderIssuePath(issue.path);
  if (issue.kind === 'unknownKeys') {
    return `${path === '' ? '' : `${path}.`}${issue.message}: unknown field`;
  }
  if (issue.kind === 'key') return `${path}: unknown rule id`;
  const reason = SALVAGE_WORDING.get(issue.message) ?? issue.message;
  return path === '' ? reason : `${path}: ${reason}`;
}

function readPolicyConfig(
  path: string,
  home: string,
): {
  policy: PartialPolicy;
  gui?: GuiPolicy;
  errors: string[];
  fallback?: PolicyFallback;

  levelPresent?: boolean;
} {
  const file = readPolicyFile(path, home);
  if (!file.exists) {
    const embedded = (globalThis as Record<string, unknown>).__CC_SAFETY_NET_EMBEDDED_POLICY__;
    if (!isRecord(embedded))
      return { policy: normalizePolicyConfig(createDefaultGuiPolicy()), errors: [] };
    const gui = normalizeGuiPolicy(embedded, home);
    return {
      policy: normalizePolicyConfig(gui),
      gui,
      errors: [],
      levelPresent: hasOwnSafetyLevel(embedded),
    };
  }
  if (file.parsed === undefined) {
    return {
      policy: normalizePolicyConfig(createDefaultGuiPolicy()),
      errors: file.errors,
      ...(file.fallback ? { fallback: file.fallback } : {}),
    };
  }

  return {
    policy: normalizePolicyConfig(file.policy),
    gui: file.policy,
    errors: file.errors,
    ...(file.fallback ? { fallback: file.fallback } : {}),
    levelPresent: hasOwnSafetyLevel(file.parsed),
  };
}

function hasOwnSafetyLevel(value: unknown): boolean {
  const safety = isRecord(value) && isRecord(value.safety) ? value.safety : {};
  return SAFETY_LEVELS.has(safety.level as string);
}

export function resolveSecretDisabledRules(overrides: Record<string, 'on' | 'off'>): string[] {
  const entries = Object.entries(overrides);
  const optedIn = new Set(entries.flatMap(([id, value]) => (value === 'on' ? [id] : [])));
  return [
    ...new Set([
      ...[...SECRET_DEFAULT_OFF_RULE_ID_SET].filter((id) => !optedIn.has(id)),
      ...entries.flatMap(([id, value]) => (value === 'off' ? [id] : [])),
    ]),
  ];
}

function normalizePolicyConfig(config: GuiPolicy): PartialPolicy {
  return {
    safety: normalizeSafety(config.safety),
    worktreeMode: config.workflow.worktree_mode,
    destructiveCommandProtectionEnabled: config.destructive_command_protection.enabled,
    destructiveCommandRuleOverrides: config.destructive_command_protection.overrides,
    destructiveCommandAllowPaths: config.destructive_command_protection.allow_paths,
    secretProtection: {
      enabled: config.secret_protection.enabled,
      disabledRules: resolveSecretDisabledRules(config.secret_protection.overrides),
      denyPaths: config.secret_protection.deny_paths,
      allowPaths: config.secret_protection.allow_paths,
    },
  };
}

export function normalizeSafety(safety: GuiPolicy['safety']): PolicySafety {
  const overrides = {
    ...(safety.overrides.fail_closed !== undefined
      ? { failClosed: safety.overrides.fail_closed }
      : {}),
    ...(safety.overrides.paranoid_rm !== undefined
      ? { paranoidRm: safety.overrides.paranoid_rm }
      : {}),
    ...(safety.overrides.paranoid_interpreters !== undefined
      ? { paranoidInterpreters: safety.overrides.paranoid_interpreters }
      : {}),
  };
  return {
    level: safety.level,
    ...(Object.keys(overrides).length > 0 ? { overrides } : {}),
  };
}
