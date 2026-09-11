import type { BlockIntent } from '@/core/decision';
import type { CustomRuleMatch, PolicyRule, RuleActivationCapability } from '@/core/rules/types';

export interface CustomRule {
  name: string;

  command: string;

  subcommand?: string;

  block_args: string[];

  match?: CustomRuleMatch;

  reason: string;

  intent?: BlockIntent;
}

export type PolicySafetyLevel = 'standard' | 'strict' | 'paranoid';
export type EffectiveSafetyLevel = PolicySafetyLevel | 'custom';

export interface PolicySafety {
  level?: PolicySafetyLevel;
  overrides?: {
    failClosed?: boolean;
    paranoidRm?: boolean;
    paranoidInterpreters?: boolean;
  };
}

export interface SecretProtectionConfig {
  enabled?: boolean;
  disabledRules?: readonly string[];
  denyPaths: string[];
  allowPaths?: string[];
}

export type DestructiveCommandRuleOverride = 'on' | 'off';

export type GuiPolicy = {
  version: 1;
  safety: {
    level: PolicySafetyLevel;
    overrides: {
      fail_closed?: boolean;
      paranoid_rm?: boolean;
      paranoid_interpreters?: boolean;
    };
  };
  workflow: {
    worktree_mode: boolean;
  };
  destructive_command_protection: {
    enabled: boolean;
    overrides: Record<string, DestructiveCommandRuleOverride>;
    allow_paths: string[];
  };
  secret_protection: {
    enabled: boolean;
    overrides: Record<string, DestructiveCommandRuleOverride>;
    deny_paths: string[];
    allow_paths: string[];
  };
  audit: {
    retention_days: number;
  };
};

export type EffectiveCapabilitySource = 'preset' | 'capability_override' | 'environment';

export type EffectiveCapabilityState = Readonly<{
  enabled: boolean;
  source: EffectiveCapabilitySource;
  sources: readonly string[];
}>;

export type EffectiveSafetyCapabilities = Readonly<
  Record<RuleActivationCapability, EffectiveCapabilityState>
>;

/** @internal */
export type EffectiveRuleSource =
  | 'catastrophic'
  | 'master_disabled'
  | 'rule_override'
  | 'preset'
  | 'capability_override'
  | 'environment'
  | 'built_in_default';

export type EffectiveDestructiveCommandRuleState = Readonly<{
  enabled: boolean;
  inheritedEnabled: boolean;
  changesInherited: boolean;
  source: EffectiveRuleSource;
  activationCapability?: RuleActivationCapability;
  override?: DestructiveCommandRuleOverride;
}>;

export type EffectivePolicy = {
  readonly rules: readonly PolicyRule[];
  readonly transparentWrappers: readonly string[];
  readonly safety: {
    readonly level?: 'standard' | 'strict' | 'paranoid';
    readonly overrides?: {
      readonly failClosed?: boolean;
      readonly paranoidRm?: boolean;
      readonly paranoidInterpreters?: boolean;
    };
  };
  readonly worktreeMode: boolean;
  readonly destructiveCommandProtectionEnabled: boolean;
  readonly destructiveCommandRuleOverrides: Readonly<
    Record<string, DestructiveCommandRuleOverride>
  >;
  readonly destructiveCommandAllowPaths: readonly string[];
  readonly secretProtection: {
    readonly enabled: boolean;
    readonly disabledRules: readonly string[];
    readonly denyPaths: readonly string[];
    readonly allowPaths: readonly string[];
  };
};

export type CommandAnalysisPolicy = EffectivePolicy & {
  readonly effectiveDestructiveCommandRules: Readonly<
    Record<string, EffectiveDestructiveCommandRuleState>
  >;
};

/** @internal */
/** Provenance for a custom rule: its rulebook, public source, and reason override. */
export type CustomRuleMetadata = {
  id: string;
  rulebook?: {
    name: string;
    version: string;
  };
  source?: string;
  override?: {
    type: 'reason';
    reason: string;
  };
};

export type PolicyScopes = {
  readonly levelScope: 'user' | 'project' | 'default';
  readonly weakenings: readonly string[];
};

export function describePolicyScope(scope: PolicyScopes['levelScope']): string {
  return scope === 'default' ? 'built-in default' : `${scope} policy`;
}

export type PolicySnapshot =
  | {
      readonly state: 'ready';
      readonly policy: EffectivePolicy;
      readonly diagnostics: readonly string[];
      readonly ruleMetadata: Readonly<Record<string, CustomRuleMetadata>>;
      readonly policyScopes?: PolicyScopes;
    }
  | {
      readonly state: 'degraded';
      readonly policy: EffectivePolicy;
      readonly diagnostics: readonly string[];
      readonly reason: string;
      readonly ruleMetadata: Readonly<Record<string, CustomRuleMetadata>>;
      readonly policyScopes?: PolicyScopes;
    };

export type ConfigStateInfo =
  | { readonly state: 'ready' }
  | {
      readonly state: 'degraded';

      readonly reason: string;
    };
