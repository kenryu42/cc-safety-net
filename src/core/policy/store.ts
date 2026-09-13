import { existsSync, readFileSync } from 'node:fs';
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
import { getCCSafetyNetEnvModes } from './env';
import { mergeProjectPolicy, type ProjectPolicyProjection } from './merge';
import { getProjectPolicyPath, getUserPolicyPath, type RulesPolicyOptions } from './paths';
import { SAFETY_OVERRIDE_KEYS } from './safety-level';
import type {
  DestructiveCommandRuleOverride,
  EffectiveDestructiveCommandRuleState,
  EffectiveSafetyCapabilities,
  GuiPolicy,
  PolicySafety,
  PolicySafetyLevel,
  PolicyScopes,
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
  const projectFile = readPolicyFile(getProjectPolicyPath(options.cwd), environment.home);
  const project = projectPolicyProjection(projectFile.parsed, environment.home);
  const merged =
    Object.keys(project.policy).length > 0
      ? mergeProjectPolicy(user.gui ?? DEFAULT_GUI_POLICY, project.policy)
      : undefined;
  const errors = [...user.errors, ...projectFile.errors, ...project.diagnostics];

  const fallback =
    (user.fallback === 'defaults' && merged ? 'salvaged' : user.fallback) ??
    (user.gui ? undefined : projectFile.fallback) ??
    (errors.length > 0 ? 'salvaged' : undefined);

  const levelScope = project.policy.safety?.level
    ? 'project'
    : user.levelPresent
      ? 'user'
      : 'default';
  return {
    ...(merged ? normalizePolicyConfig(merged.policy) : user.policy),
    errors,
    ...(fallback ? { fallback } : {}),

    ...(projectFile.exists
      ? { policyScopes: { levelScope, weakenings: merged?.weakenings ?? [] } }
      : {}),
  };
}

const PROJECT_AUDIT_DIAGNOSTIC =
  'project policy audit settings are ignored; audit is user scope only';

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
            'safety.overrides',
            IGNORE_DROPS,
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
            'destructive_command_protection.overrides',
            IGNORE_DROPS,
          ),
        }
      : {}),
    ...(destructive.allow_paths !== undefined
      ? {
          allow_paths: repairPaths(
            destructive.allow_paths,
            getDestructiveAllowPathError,
            home,
            'destructive_command_protection.allow_paths',
            IGNORE_DROPS,
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
            'secret_protection.overrides',
            IGNORE_DROPS,
          ),
        }
      : {}),
    ...(secret.deny_paths !== undefined
      ? {
          deny_paths: repairPaths(
            secret.deny_paths,
            getSecretDenyPathError,
            home,
            'secret_protection.deny_paths',
            IGNORE_DROPS,
          ),
        }
      : {}),
    ...(secret.allow_paths !== undefined
      ? {
          allow_paths: repairPaths(
            secret.allow_paths,
            getSecretAllowPathError,
            home,
            'secret_protection.allow_paths',
            IGNORE_DROPS,
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
    diagnostics: value.audit === undefined ? [] : [PROJECT_AUDIT_DIAGNOSTIC],
  };
}

function pickBooleans<K extends string>(
  source: Record<string, unknown>,
  keys: readonly K[],
  path: string,
  drop: ReportDrop,
) {
  return Object.fromEntries(
    keys.flatMap((key) => {
      const value = source[key];
      if (typeof value === 'boolean') return [[key, value]];
      if (value !== undefined) drop(`${path}.${key}`, NOT_A_BOOLEAN);
      return [];
    }),
  ) as Partial<Record<K, boolean>>;
}

function withPresentFields<T extends Record<string, object>>(sections: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(sections).flatMap((entry) => (Object.keys(entry[1]).length > 0 ? [entry] : [])),
  ) as Partial<T>;
}

type PolicyDrop = { readonly path: string; readonly reason: string };

type ReportDrop = (path: string, reason: string) => void;

const IGNORE_DROPS: ReportDrop = () => undefined;

const NOT_A_BOOLEAN = 'not a boolean';
const NOT_AN_OBJECT = 'not an object';
const AUDIT_RETENTION_DROP = `not an integer between ${MIN_AUDIT_RETENTION_DAYS} and ${MAX_AUDIT_RETENTION_DAYS}`;
const USER_POLICY_FIELDS = [
  'version',
  'safety',
  'workflow',
  'destructive_command_protection',
  'secret_protection',
  'audit',
];

/**
 * The runtime's only acceptance of a policy document: every recognized valid field survives,
 * everything else falls back to its protective default and is named in `drops`, which is what
 * the degraded snapshot reports. `user-policy-diagnostics.ts` answers the same question for the
 * diagnostic surfaces, in its own wording; `tests/core/policy/store-parity.test.ts` states both
 * verdicts for every fixture document.
 *
 * @internal
 */
export function salvageUserPolicy(
  value: unknown,
  home: string,
): { policy: GuiPolicy; drops: PolicyDrop[] } {
  const drops: PolicyDrop[] = [];
  const policy = salvagePolicy(value, home, (path, reason) => {
    drops.push({ path, reason });
  });
  return { policy, drops };
}

export function normalizeGuiPolicy(value: unknown, home: string): GuiPolicy {
  return salvagePolicy(value, home, IGNORE_DROPS);
}

function salvagePolicy(value: unknown, home: string, drop: ReportDrop): GuiPolicy {
  if (!isRecord(value)) {
    drop('', 'not a JSON object');
    return createDefaultGuiPolicy();
  }

  if (value.version !== 1) drop('version', 'not 1');
  const safety = readSection(value.safety, 'safety', ['level', 'overrides'], drop);
  const safetyOverrides = readSection(
    safety.overrides,
    'safety.overrides',
    SAFETY_OVERRIDE_KEYS,
    drop,
  );
  const workflow = readSection(value.workflow, 'workflow', ['worktree_mode'], drop);
  const destructiveCommand = readSection(
    value.destructive_command_protection,
    'destructive_command_protection',
    ['enabled', 'overrides', 'allow_paths'],
    drop,
  );
  const secret = readSection(
    value.secret_protection,
    'secret_protection',
    ['enabled', 'overrides', 'deny_paths', 'allow_paths'],
    drop,
  );
  const audit = readSection(value.audit, 'audit', ['retention_days'], drop);

  reportUnknownFields(value, USER_POLICY_FIELDS, '', drop);
  return {
    version: 1,
    safety: {
      level: readSafetyLevel(safety.level, drop),
      overrides: pickBooleans(safetyOverrides, SAFETY_OVERRIDE_KEYS, 'safety.overrides', drop),
    },
    workflow: {
      worktree_mode: readBoolean(workflow.worktree_mode, 'workflow.worktree_mode', false, drop),
    },
    destructive_command_protection: {
      enabled: readBoolean(
        destructiveCommand.enabled,
        'destructive_command_protection.enabled',
        true,
        drop,
      ),
      overrides: repairRuleOverrides(
        destructiveCommand.overrides,
        DESTRUCTIVE_COMMAND_RULE_ID_SET,
        'destructive_command_protection.overrides',
        drop,
      ),
      allow_paths: repairPaths(
        destructiveCommand.allow_paths,
        getDestructiveAllowPathError,
        home,
        'destructive_command_protection.allow_paths',
        drop,
      ),
    },
    secret_protection: {
      enabled: readBoolean(secret.enabled, 'secret_protection.enabled', true, drop),
      overrides: repairRuleOverrides(
        secret.overrides,
        SECRET_PROTECTION_RULE_ID_SET,
        'secret_protection.overrides',
        drop,
      ),
      deny_paths: repairPaths(
        secret.deny_paths,
        getSecretDenyPathError,
        home,
        'secret_protection.deny_paths',
        drop,
      ),
      allow_paths: repairPaths(
        secret.allow_paths,
        getSecretAllowPathError,
        home,
        'secret_protection.allow_paths',
        drop,
      ),
    },
    audit: { retention_days: readAuditRetentionDays(audit.retention_days, drop) },
  };
}

function readSection(
  value: unknown,
  path: string,
  known: readonly string[],
  drop: ReportDrop,
): Record<string, unknown> {
  if (value === undefined) return {};
  if (!isRecord(value)) {
    drop(path, NOT_AN_OBJECT);
    return {};
  }
  reportUnknownFields(value, known, path, drop);
  return value;
}

function reportUnknownFields(
  record: Record<string, unknown>,
  known: readonly string[],
  path: string,
  drop: ReportDrop,
): void {
  for (const key of Object.keys(record).filter((candidate) => !known.includes(candidate))) {
    drop(path === '' ? key : `${path}.${key}`, 'unknown field');
  }
}

function readSafetyLevel(value: unknown, drop: ReportDrop): PolicySafetyLevel {
  if (value === undefined) return 'standard';
  if (SAFETY_LEVELS.has(value as string)) return value as PolicySafetyLevel;
  drop('safety.level', 'not one of standard, strict, paranoid');
  return 'standard';
}

function readBoolean(value: unknown, path: string, fallback: boolean, drop: ReportDrop): boolean {
  if (typeof value === 'boolean') return value;
  if (value !== undefined) drop(path, NOT_A_BOOLEAN);
  return fallback;
}

function readAuditRetentionDays(value: unknown, drop: ReportDrop): number {
  const usable =
    value === undefined ||
    (typeof value === 'number' &&
      Number.isInteger(value) &&
      value >= MIN_AUDIT_RETENTION_DAYS &&
      value <= MAX_AUDIT_RETENTION_DAYS);

  if (!usable) drop('audit.retention_days', AUDIT_RETENTION_DROP);
  return clampAuditRetentionDays(value);
}

function repairRuleOverrides(
  value: unknown,
  knownRuleIds: ReadonlySet<string>,
  path: string,
  drop: ReportDrop,
) {
  if (value === undefined) return {};
  if (!isRecord(value)) {
    drop(path, NOT_AN_OBJECT);
    return {};
  }
  return Object.fromEntries(
    Object.entries(value).flatMap(([id, override]) => {
      if (!knownRuleIds.has(id)) {
        drop(`${path}.${id}`, 'unknown rule id');
        return [];
      }
      if (override === 'on' || override === 'off') return [[id, override]];
      drop(`${path}.${id}`, 'not "on" or "off"');
      return [];
    }),
  ) as Record<string, 'on' | 'off'>;
}

function repairPaths(
  value: unknown,
  getPathError: (value: unknown, home: string) => string | null,
  home: string,
  path: string,
  drop: ReportDrop,
): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    drop(path, 'not an array');
    return [];
  }
  return value.flatMap((entry, index) => {
    const error = getPathError(entry, home);
    if (error === null) return [entry as string];
    drop(`${path}[${index}]`, error);
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
    const salvaged = salvageUserPolicy(parsed, home);
    if (salvaged.drops.length === 0) {
      return { exists: true, parsed, policy: salvaged.policy, errors: [] };
    }
    return {
      exists: true,
      parsed,
      policy: salvaged.policy,
      errors: salvaged.drops.map((drop) => `${path}: ${renderPolicyDrop(drop)}`),
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

function renderPolicyDrop(drop: PolicyDrop): string {
  return drop.path === '' ? drop.reason : `${drop.path}: ${drop.reason}`;
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
    if (!isRecord(embedded)) return { policy: createEmptyPolicy(), errors: [] };
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
      policy: createEmptyPolicy(),
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

function createEmptyPolicy(): PartialPolicy {
  return {
    safety: {},
    worktreeMode: false,
    destructiveCommandProtectionEnabled: true,
    destructiveCommandRuleOverrides: {},
    destructiveCommandAllowPaths: [],
    secretProtection: {
      enabled: true,
      disabledRules: resolveSecretDisabledRules({}),
      denyPaths: [],
      allowPaths: [],
    },
  };
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
