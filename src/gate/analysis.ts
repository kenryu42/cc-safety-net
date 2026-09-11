import type { Budget } from '@/core/budget';
import type { BlockIntent } from '@/core/decision';
import type { Environment } from '@/core/environment';
import type { ProtectedGitMetadata } from '@/core/git/metadata';
import type { EffectiveSafetyCapabilities, PolicySnapshot } from '@/core/policy/types';
import type { CommandProgram, ShellKind } from '@/core/shell/model';
import type { CommandTraceContext } from './trace';

export type { PathResolver } from '@/core/environment';
export type { ProtectedGitMetadata } from '@/core/git/metadata';
export type { DestructiveCommandRuleMatch } from '@/core/rules/types';

export interface AnalyzeResult {
  reason: string;

  segment: string;

  ruleId?: string;

  intent?: BlockIntent;
}

export type EnvironmentContext = Environment;

/**
 * Options for command analysis.
 * @internal
 */
export interface AnalyzeOptions {
  policySnapshot: PolicySnapshot;

  cwd?: string;

  shell?: ShellKind;

  effectiveCwd?: string | null;

  envAssignments?: ReadonlyMap<string, string>;

  strict?: boolean;

  paranoidRm?: boolean;

  paranoidInterpreters?: boolean;

  worktreeMode?: boolean;

  allowTmpdirVar?: boolean;

  trace?: CommandTraceContext;

  analyzePartialProgram?: boolean;
}

export type AnalyzeInput = AnalyzeOptions & {
  effectiveCapabilities: EffectiveSafetyCapabilities;
  environment: EnvironmentContext;
  protectedGitMetadata: ProtectedGitMetadata | null;

  budget?: Budget;
};

export interface AnalyzeNestedOverrides {
  effectiveCwd?: string | null;
  envAssignments?: ReadonlyMap<string, string>;
  worktreeMode?: boolean;

  functionDefinitions?: ReadonlyMap<string, CommandProgram>;
}
