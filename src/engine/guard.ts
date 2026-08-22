import { analyzeCommandWithProgram } from '@/analyzer';
import { PathCanonicalizationLimitError } from '@/analyzer/path-canonicalization';
import {
  REASON_COMMAND_ANALYSIS_LIMIT,
  REASON_RECURSION_LIMIT,
  REASON_SAFETY_NET_FAILED_CLOSED,
  REASON_STRUCTURAL_COMMAND_VALIDATION_LIMIT,
} from '@/analyzer/reasons';
import {
  findGitMetadataMutationTargetInSemanticFacts,
  REASON_GIT_METADATA_PROTECTION,
  resolveProtectedGitMetadata,
} from '@/guards/git-metadata-protection';
import {
  findPolicyConfigMutationTargetInSemanticFacts,
  REASON_POLICY_CONFIG_PROTECTION,
} from '@/guards/policy-protection';
import {
  findSensitiveTargetInSemanticFacts,
  REASON_SECRET_PROTECTION,
} from '@/guards/secret-protection';
import {
  createSemanticFacts,
  type FactParserDependencies,
  getCommandSyntaxFact,
  StructuralShellSyntaxLimitError,
} from '@/guards/semantic-facts';
import type { AnalyzeInput } from '@/ir/analysis';
import type { AuditFailureStage } from '@/ir/audit';
import type { Decision } from '@/ir/decision';
import { createProcessEnvironment } from '@/ir/environment';
import type { ToolInvocation } from '@/ir/invocation';
import type { EffectiveSafetyLevel, PolicySnapshot } from '@/ir/policy';
import type { SemanticFacts } from '@/ir/semantic-facts';
import { getCommandFromToolInput, ToolInputLimitError } from '@/parser/tool-input';
import { getCCSafetyNetEnvModes } from '@/policy/env';
import { loadPolicySnapshot, type PolicySnapshotOptions } from '@/policy/snapshot';

export type GuardStage = AuditFailureStage;

export type GuardEvaluation = {
  stage: GuardStage;
  decision: Decision;
  /**
   * Effective safety level in force for this evaluation. Absent when the guard
   * returned before the policy snapshot resolved, since those denials (input
   * limits, policy and git metadata protection) do not depend on the level.
   */
  level?: EffectiveSafetyLevel;
  /**
   * Set when the snapshot enforced a fallback policy instead of the configured one.
   * The reason names the failing source, what is not active, and the repair, so
   * diagnostic surfaces can relay all of it.
   */
  configFallback?: { reason: string };
};

export type GuardDependencies = {
  findPolicyMutation: typeof findPolicyConfigMutationTargetInSemanticFacts;
  findGitMetadataMutation: typeof findGitMetadataMutationTargetInSemanticFacts;
  loadPolicySnapshot: typeof loadPolicySnapshot;
  findSensitiveTarget: typeof findSensitiveTargetInSemanticFacts;
  analyzeCommand: (
    command: string,
    options: AnalyzeInput,
    program?: ReturnType<typeof getDeclaredCommandProgram>,
    factStore?: SemanticFacts['store'],
  ) => Extract<Decision, { kind: 'deny' }> | null;
  resolveGitMetadata: typeof resolveProtectedGitMetadata;
  getModes: typeof getCCSafetyNetEnvModes;
};

export type GuardOptions = {
  auditAllowed?: boolean;
  policyOptions?: PolicySnapshotOptions;
  dependencies?: Partial<GuardDependencies>;
  factParserDependencies?: Partial<FactParserDependencies>;
};

export class GuardEvaluationError extends Error {
  override readonly name = 'GuardEvaluationError';

  constructor(
    readonly stage: GuardStage,
    readonly evaluation: GuardEvaluation,
    cause: unknown,
  ) {
    super(`CC Safety Net ${stage} dependency failed`, { cause });
  }
}

const DEFAULT_DEPENDENCIES: GuardDependencies = {
  findPolicyMutation: findPolicyConfigMutationTargetInSemanticFacts,
  findGitMetadataMutation: findGitMetadataMutationTargetInSemanticFacts,
  resolveGitMetadata: resolveProtectedGitMetadata,
  loadPolicySnapshot,
  findSensitiveTarget: findSensitiveTargetInSemanticFacts,
  analyzeCommand: analyzeCommandWithProgram,
  getModes: getCCSafetyNetEnvModes,
};

export function evaluateGuard(
  invocation: ToolInvocation,
  options: GuardOptions = {},
): GuardEvaluation {
  const dependencies = { ...DEFAULT_DEPENDENCIES, ...options.dependencies };
  const inputCommand = getInputCommandOrFail(invocation);
  const command = isCommandInvocation(invocation) ? invocation.command : inputCommand;

  const facts = callDependency('policy-protection', command, () =>
    createSemanticFacts(invocation, options.factParserDependencies),
  );
  const declaredCommand = getCommandSyntaxFact(facts, 'declared-command');
  if (
    isCommandInvocation(invocation) &&
    invocation.command?.trim() &&
    declaredCommand?.program.status === 'limited'
  ) {
    return {
      stage: 'command-analysis',
      decision: {
        kind: 'deny',
        reason: REASON_RECURSION_LIMIT,
        intent: 'stop_and_explain',
        evidence: [{ kind: 'command', command: invocation.command, segment: invocation.command }],
      },
    };
  }
  if (getCommandSyntaxFact(facts, 'input-candidate')?.program.status === 'limited') {
    return {
      stage: 'command-validation',
      decision: {
        kind: 'deny',
        reason: REASON_STRUCTURAL_COMMAND_VALIDATION_LIMIT,
        intent: 'stop_and_explain',
        evidence: [],
      },
    };
  }
  const protectedGitMetadata = callDependency('policy-protection', command, () =>
    dependencies.resolveGitMetadata([
      invocation.context.executionCwd,
      invocation.context.configCwd,
    ]),
  );
  const policyTarget = callDependency('policy-protection', command, () =>
    dependencies.findPolicyMutation(facts),
  );
  if (policyTarget) {
    const displayCommand = command ?? policyTarget.target;
    return {
      stage: 'policy-protection',
      decision: {
        kind: 'deny',
        reason: REASON_POLICY_CONFIG_PROTECTION,
        intent: 'hard_stop',
        evidence: [{ kind: 'command', command: displayCommand, segment: policyTarget.target }],
      },
    };
  }

  const gitMetadataTarget = callDependency('policy-protection', command, () =>
    dependencies.findGitMetadataMutation(facts, protectedGitMetadata),
  );
  if (gitMetadataTarget) {
    const displayCommand = command ?? gitMetadataTarget.target;
    return {
      stage: 'policy-protection',
      decision: {
        kind: 'deny',
        reason: REASON_GIT_METADATA_PROTECTION,
        intent: 'hard_stop',
        evidence: [{ kind: 'command', command: displayCommand, segment: gitMetadataTarget.target }],
      },
    };
  }

  const snapshot = callDependency('config-load', command, () =>
    dependencies.loadPolicySnapshot({
      ...options.policyOptions,
      cwd: invocation.context.configCwd,
    }),
  );
  const policy = snapshot.policy;
  const modes = dependencies.getModes(policy);
  // Every decision made after the snapshot resolved reports the level in force and,
  // when a fallback policy is enforced, the reason behind it.
  const reported = { level: modes.effectiveLevel, ...getConfigFallback(snapshot) };
  const secretTarget =
    policy.secretProtection.enabled === false
      ? null
      : callDependency('secret-protection', command, () =>
          dependencies.findSensitiveTarget(facts, policy.secretProtection, {
            strict: isCommandInvocation(invocation) ? modes.strict : undefined,
          }),
        );
  if (secretTarget) {
    const displayCommand = command ?? secretTarget.target;
    return {
      stage: 'secret-protection',
      ...reported,
      decision: {
        kind: 'deny',
        reason: REASON_SECRET_PROTECTION,
        intent: 'hard_stop',
        ruleId: secretTarget.ruleId,
        evidence: [{ kind: 'command', command: displayCommand, segment: secretTarget.target }],
      },
    };
  }

  if (!isCommandInvocation(invocation)) {
    return { stage: 'non-command', ...reported, decision: { kind: 'allow' } };
  }

  if (!invocation.command || invocation.command.trim() === '') {
    return {
      ...failedClosedEvaluation('command-validation', command),
      ...reported,
    };
  }

  const decision = callDependency('command-analysis', command, () => {
    return dependencies.analyzeCommand(
      invocation.command as string,
      {
        cwd: invocation.context.executionCwd,
        shell: invocation.route.shell,
        policySnapshot: snapshot,
        environment: createProcessEnvironment(),
        protectedGitMetadata,
        effectiveCapabilities: modes.capabilities,
        strict: modes.strict,
        paranoidRm: modes.paranoidRm,
        paranoidInterpreters: modes.paranoidInterpreters,
        worktreeMode: modes.worktreeMode,
      },
      getDeclaredCommandProgram(facts),
      facts.store,
    );
  });
  if (decision) return { stage: 'command-analysis', ...reported, decision };
  return { stage: 'command-analysis', ...reported, decision: { kind: 'allow' } };
}

function getConfigFallback(snapshot: PolicySnapshot) {
  if (snapshot.state === 'ready') return {};
  return { configFallback: { reason: snapshot.reason } };
}

function getDeclaredCommandProgram(facts: SemanticFacts) {
  return getCommandSyntaxFact(facts, 'declared-command')?.program;
}

function getInputCommandOrFail(invocation: ToolInvocation): string | undefined {
  try {
    return getCommandFromToolInput(invocation.input);
  } catch (cause) {
    const command = isCommandInvocation(invocation) ? invocation.command : undefined;
    throw new GuardEvaluationError(
      'policy-protection',
      failedClosedEvaluation(
        'policy-protection',
        cause instanceof ToolInputLimitError ? undefined : command,
        cause,
      ),
      cause,
    );
  }
}

function callDependency<T>(
  stage: GuardStage,
  command: string | null | undefined,
  call: () => T,
): T {
  try {
    return call();
  } catch (cause) {
    throw new GuardEvaluationError(
      stage,
      failedClosedEvaluation(
        stage,
        cause instanceof ToolInputLimitError ? undefined : command,
        cause,
      ),
      cause,
    );
  }
}

function failedClosedEvaluation(
  stage: GuardStage,
  command: string | null | undefined,
  cause?: unknown,
): GuardEvaluation {
  // Analysis budgets are documented limits the command crossed, so they get
  // actionable wording instead of the internal-fault report.
  const isAnalysisLimit =
    cause instanceof PathCanonicalizationLimitError ||
    cause instanceof StructuralShellSyntaxLimitError;
  return {
    stage,
    decision: {
      kind: 'deny',
      reason: isAnalysisLimit ? REASON_COMMAND_ANALYSIS_LIMIT : REASON_SAFETY_NET_FAILED_CLOSED,
      intent: 'stop_and_explain',
      evidence: command ? [{ kind: 'command', command, segment: command }] : [],
    },
  };
}

function isCommandInvocation(
  invocation: ToolInvocation,
): invocation is Extract<ToolInvocation, { route: { kind: 'command' } }> {
  return invocation.route.kind === 'command';
}
