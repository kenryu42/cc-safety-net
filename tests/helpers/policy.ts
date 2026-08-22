import { analyzeCommand } from '@/analyzer';
import { resolveProtectedGitMetadata } from '@/guards/git-metadata-protection';
import type { AnalyzeOptions, EnvironmentContext, ProtectedGitMetadata } from '@/ir/analysis';
import type { ExplainOptions } from '@/ir/explain';
import type {
  CustomRule,
  CustomRuleMetadata,
  DestructiveCommandRuleOverride,
  PolicySafety,
  PolicySafetyLevel,
  PolicySnapshot,
  SecretProtectionConfig,
} from '@/ir/policy';
import { getCCSafetyNetEnvModes } from '@/policy/env';
import {
  createPolicySnapshot,
  loadPolicySnapshot,
  type PolicySnapshotOptions,
} from '@/policy/snapshot';
import { createCommandAnalysisPolicy } from '@/rules/destructive-command-rules';
import { TEST_ENVIRONMENT } from './environment';

export type TestExplainOptions = Omit<ExplainOptions, 'policySnapshot'> & {
  config?: TestPolicyInput;
};

export interface TestPolicyInput {
  version?: number;
  rules?: readonly CustomRule[];
  transparent_wrappers?: readonly string[];
  safety?: PolicySafety;
  worktreeMode?: boolean;
  destructiveCommandProtectionEnabled?: boolean;
  destructiveCommandRuleOverrides?: Readonly<Record<string, DestructiveCommandRuleOverride>>;
  destructiveCommandAllowPaths?: readonly string[];
  secretProtection?: SecretProtectionConfig;
  configFallbackReason?: string;
  ruleMetadata?: Readonly<Record<string, CustomRuleMetadata>>;
}

export function testModes(level: PolicySafetyLevel = 'standard') {
  const strict = level === 'strict' || level === 'paranoid';
  const paranoid = level === 'paranoid';
  return {
    strict,
    paranoidRm: paranoid,
    paranoidInterpreters: paranoid,
    worktreeMode: false,
    effectiveLevel: level,
    capabilities: {
      fail_closed: { enabled: strict, source: 'preset' as const, sources: [] },
      paranoid_rm: { enabled: paranoid, source: 'preset' as const, sources: [] },
      paranoid_interpreters: { enabled: paranoid, source: 'preset' as const, sources: [] },
    },
  };
}

export function policySnapshot(input: TestPolicyInput = {}): PolicySnapshot {
  const policy = {
    rules: input.rules ?? [],
    transparentWrappers: input.transparent_wrappers ?? [],
    safety: input.safety ?? {},
    worktreeMode: input.worktreeMode ?? false,
    destructiveCommandProtectionEnabled: input.destructiveCommandProtectionEnabled ?? true,
    destructiveCommandRuleOverrides: { ...input.destructiveCommandRuleOverrides },
    destructiveCommandAllowPaths: [...(input.destructiveCommandAllowPaths ?? [])],
    secretProtection: {
      enabled: input.secretProtection?.enabled ?? true,
      disabledRules: Array.from(input.secretProtection?.disabledRules ?? []),
      denyPaths: [...(input.secretProtection?.denyPaths ?? [])],
      allowPaths: [...(input.secretProtection?.allowPaths ?? [])],
    },
  };
  return createPolicySnapshot(
    policy,
    input.configFallbackReason
      ? { diagnostics: [input.configFallbackReason], reason: input.configFallbackReason }
      : undefined,
    input.ruleMetadata,
  );
}

export function commandAnalysisPolicy(snapshot: PolicySnapshot = policySnapshot()) {
  return createCommandAnalysisPolicy(
    snapshot.policy,
    getCCSafetyNetEnvModes(snapshot.policy).capabilities,
  );
}

export function analyzeTestCommand(
  command: string,
  options: Omit<AnalyzeOptions, 'policySnapshot'> & {
    config?: TestPolicyInput;
    environment?: EnvironmentContext;
    protectedGitMetadata?: ProtectedGitMetadata | null;
  } = {},
) {
  const { config, ...analyzeOptions } = options;
  const snapshot = policySnapshot(config);
  return analyzeCommand(command, {
    environment: TEST_ENVIRONMENT,
    effectiveCapabilities: getCCSafetyNetEnvModes(snapshot.policy).capabilities,
    protectedGitMetadata: resolveProtectedGitMetadata([options.cwd]),
    ...analyzeOptions,
    policySnapshot: snapshot,
  });
}

export function loadTestPolicy(
  cwd?: string,
  options: Omit<PolicySnapshotOptions, 'cwd'> = {},
): TestPolicyInput {
  const snapshot = loadPolicySnapshot({ ...options, cwd });
  return {
    rules: snapshot.policy.rules.map((rule) => ({
      ...rule,
      block_args: [...rule.block_args],
    })),
    transparent_wrappers: snapshot.policy.transparentWrappers,
    safety: snapshot.policy.safety,
    worktreeMode: snapshot.policy.worktreeMode,
    destructiveCommandProtectionEnabled: snapshot.policy.destructiveCommandProtectionEnabled,
    destructiveCommandRuleOverrides: snapshot.policy.destructiveCommandRuleOverrides,
    destructiveCommandAllowPaths: snapshot.policy.destructiveCommandAllowPaths,
    secretProtection: {
      ...snapshot.policy.secretProtection,
      disabledRules: [...snapshot.policy.secretProtection.disabledRules],
      denyPaths: [...snapshot.policy.secretProtection.denyPaths],
      allowPaths: [...snapshot.policy.secretProtection.allowPaths],
    },
    ...(snapshot.state === 'degraded' ? { configFallbackReason: snapshot.reason } : {}),
  };
}

export function testExplainOptions(options: TestExplainOptions = {}): ExplainOptions {
  const { config, ...explainOptions } = options;
  return {
    ...explainOptions,
    ...(config ? { policySnapshot: policySnapshot(config) } : {}),
  };
}
