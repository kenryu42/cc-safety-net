import type { BlockIntent } from './decision.js';

/** Custom blocking rule definition. */
export interface CustomRule {
  /** Unique identifier for the rule */
  name: string;
  /** Base command to match (e.g., "git", "npm") */
  command: string;
  /** Optional subcommand to match (e.g., "add", "install") */
  subcommand?: string;
  /** Arguments that trigger the block */
  block_args: string[];
  /** Message shown when blocked */
  reason: string;
  /** Optional agent behavior intent for the block message footer */
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
  disabledRules?: ReadonlySet<string>;
  denyPaths: string[];
  allowPaths?: string[];
}

export type DestructiveCommandRuleOverride = 'on' | 'off';

export type RuleActivationCapability = 'fail_closed' | 'paranoid_rm' | 'paranoid_interpreters';

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

export type PolicyRule = {
  readonly name: string;
  readonly command: string;
  readonly subcommand?: string;
  readonly block_args: readonly string[];
  readonly reason: string;
  readonly intent?: BlockIntent;
};

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

export type PolicySnapshot =
  | {
      readonly state: 'ready';
      readonly policy: EffectivePolicy;
      readonly diagnostics: readonly string[];
      readonly ruleMetadata: Readonly<Record<string, CustomRuleMetadata>>;
    }
  | {
      readonly state: 'degraded';
      readonly policy: EffectivePolicy;
      readonly diagnostics: readonly string[];
      readonly reason: string;
      readonly ruleMetadata: Readonly<Record<string, CustomRuleMetadata>>;
    };

/** The runtime configuration state as diagnostic surfaces report it. */
export type ConfigStateInfo =
  | { readonly state: 'ready' }
  | {
      readonly state: 'degraded';
      /** The failing source, what is not active, and the repair. */
      readonly reason: string;
    };
