import type {
  CustomRuleMetadata,
  DestructiveCommandRuleOverride,
  EffectiveDestructiveCommandRuleState,
  EffectiveSafetyCapabilities,
  EffectiveSafetyLevel,
  PolicySafetyLevel,
  PolicyScopes,
  PolicySnapshot,
} from '@next/core/policy/types';
import type { TraceStep } from './trace';

/** Trace data for explain command */
export interface ExplainTrace {
  steps: TraceStep[];
  segments: { index: number; steps: TraceStep[] }[];
}

/** Options for explain command */
export interface ExplainOptions {
  cwd?: string;
  userConfigDir?: string;
  strict?: boolean;
  policySnapshot?: PolicySnapshot;
}

/** Result of explain command */
export interface ExplainResult {
  trace: ExplainTrace;
  result: 'blocked' | 'allowed';
  reason?: string;
  segment?: string;
  ruleId?: string;
  customRule?: CustomRuleMetadata;
  configSource: string | null;
  configValid: boolean;
  effectiveLevel: EffectiveSafetyLevel;
  selectedPreset: PolicySafetyLevel;
  /** Which scope supplied `selectedPreset`, set only when a project policy file
   *  was read. The per-field deltas belong to `status` and `doctor`. */
  safetyPresetScope?: PolicyScopes['levelScope'];
  effectiveCapabilities: EffectiveSafetyCapabilities;
  destructiveCommandRuleOverrides: Readonly<Record<string, DestructiveCommandRuleOverride>>;
  ruleActivation?: EffectiveDestructiveCommandRuleState & { id: string };
}
