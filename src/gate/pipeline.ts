import type { AuditFailureStage } from '@/core/audit';
import { type AnalysisErrorCode, AnalysisLimit, createBudget } from '@/core/budget';
import type { Decision } from '@/core/decision';
import type { ProtectedGitMetadata } from '@/core/git/metadata';
import { getCCSafetyNetEnvModes } from '@/core/policy/env';
import { loadPolicySnapshot, type PolicySnapshotOptions } from '@/core/policy/snapshot';
import type { EffectiveSafetyLevel, PolicySnapshot } from '@/core/policy/types';
import { getCommandFromToolInput, ToolInputLimitError } from '@/core/tool-input';
import type { AnalyzeInput, EnvironmentContext } from '@/gate/analysis';
import { analyzeCommandWithProgram, analyzeOrCapBreach } from '@/gate/analyzer';
import {
  REASON_COMMAND_ANALYSIS_LIMIT,
  REASON_RECURSION_LIMIT,
  REASON_SAFETY_NET_FAILED_CLOSED,
  REASON_STRUCTURAL_COMMAND_VALIDATION_LIMIT,
} from '@/gate/analyzer/reasons';
import type { SemanticFacts } from '@/gate/facts';
import {
  findGitMetadataMutationTargetInSemanticFacts,
  REASON_GIT_METADATA_PROTECTION,
} from '@/gate/guards/git-metadata-protection';
import {
  findPolicyApplyInvocationInSemanticFacts,
  REASON_POLICY_APPLY_PROTECTION,
} from '@/gate/guards/policy-apply-protection';
import {
  findPolicyConfigMutationTargetInSemanticFacts,
  REASON_POLICY_CONFIG_PROTECTION,
} from '@/gate/guards/policy-protection';
import {
  createSemanticFacts,
  type FactParserDependencies,
  getCommandSyntaxFact,
  StructuralShellSyntaxLimitError,
} from '@/gate/guards/semantic-facts';
import type { ToolInvocation } from '@/gate/invocation';
import {
  findSensitiveTargetInSemanticFacts,
  REASON_SECRET_PROTECTION,
} from '@/gate/secret/secret-protection';
import type { CommandTraceContext } from '@/gate/trace';

export type GuardStage = AuditFailureStage;

export type GuardEvaluation = {
  stage: GuardStage;
  decision: Decision;

  level?: EffectiveSafetyLevel;

  configFallback?: { reason: string };

  errorCode?: AnalysisErrorCode;
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
  resolveGitMetadata: typeof resolveGitMetadataForCwds;
  getModes: typeof getCCSafetyNetEnvModes;
};

export type GuardOptions = {
  environment: EnvironmentContext;
  auditAllowed?: boolean;
  policyOptions?: Omit<PolicySnapshotOptions, 'cwd'>;
  dependencies?: Partial<GuardDependencies>;
  factParserDependencies?: Partial<FactParserDependencies>;

  trace?: CommandTraceContext;
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
  resolveGitMetadata: resolveGitMetadataForCwds,
  loadPolicySnapshot,
  findSensitiveTarget: findSensitiveTargetInSemanticFacts,
  analyzeCommand: analyzeCommandWithProgram,
  getModes: getCCSafetyNetEnvModes,
};

export function evaluateGuard(invocation: ToolInvocation, options: GuardOptions): GuardEvaluation {
  const dependencies = { ...DEFAULT_DEPENDENCIES, ...options.dependencies };
  const inputCommand = getInputCommandOrFail(invocation);
  const command = isCommandInvocation(invocation) ? invocation.command : inputCommand;

  const facts = callDependency('policy-protection', command, () =>
    createSemanticFacts(invocation, options.factParserDependencies),
  );
  const inputCandidate = getCommandSyntaxFact(facts, 'input-candidate');
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
  if (inputCandidate?.program.status === 'limited') {
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

  const budget = createBudget();
  const protectedGitMetadata = callDependency('policy-protection', command, () =>
    dependencies.resolveGitMetadata(
      [invocation.context.executionCwd, invocation.context.configCwd],
      options.environment,
    ),
  );
  const policyTarget = callDependency('policy-protection', command, () =>
    dependencies.findPolicyMutation(facts, options.environment, budget),
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

  const policyApplyTarget = callDependency('policy-protection', command, () =>
    findPolicyApplyInvocationInSemanticFacts(facts, options.environment, budget),
  );
  if (policyApplyTarget) {
    const displayCommand = command ?? policyApplyTarget.target;
    return {
      stage: 'policy-protection',
      decision: {
        kind: 'deny',
        reason: REASON_POLICY_APPLY_PROTECTION,
        intent: 'hard_stop',
        evidence: [{ kind: 'command', command: displayCommand, segment: policyApplyTarget.target }],
      },
    };
  }

  const gitMetadataTarget = callDependency('policy-protection', command, () =>
    dependencies.findGitMetadataMutation(facts, protectedGitMetadata, options.environment, budget),
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
    dependencies.loadPolicySnapshot(options.environment, {
      ...options.policyOptions,
      cwd: invocation.context.configCwd,
    }),
  );
  const policy = snapshot.policy;
  const modes = dependencies.getModes(policy, options.environment.env);

  const reported = { level: modes.effectiveLevel, ...getConfigFallback(snapshot) };
  const secretTarget =
    policy.secretProtection.enabled === false
      ? null
      : callDependency('secret-protection', command, () =>
          dependencies.findSensitiveTarget(
            facts,
            policy.secretProtection,
            options.environment,
            budget,
            {
              strict:
                isCommandInvocation(invocation) || inputCandidate?.program.dialect === 'powershell'
                  ? modes.strict
                  : undefined,
            },
          ),
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

  const analysis = callDependency('command-analysis', command, () =>
    analyzeOrCapBreach(
      () =>
        dependencies.analyzeCommand(
          invocation.command as string,
          {
            cwd: invocation.context.executionCwd,
            shell: invocation.route.shell,
            policySnapshot: snapshot,
            environment: options.environment,
            protectedGitMetadata,
            effectiveCapabilities: modes.capabilities,
            strict: modes.strict,
            paranoidRm: modes.paranoidRm,
            paranoidInterpreters: modes.paranoidInterpreters,
            worktreeMode: modes.worktreeMode,
            budget,

            ...(options.trace ? { trace: options.trace } : {}),
          },
          getDeclaredCommandProgram(facts),
          facts.store,
        ),
      invocation.command as string,
      options.trace,
    ),
  );
  if (analysis.decision) {
    return {
      stage: 'command-analysis',
      ...reported,
      ...('errorCode' in analysis ? { errorCode: analysis.errorCode } : {}),
      decision: analysis.decision,
    };
  }
  return { stage: 'command-analysis', ...reported, decision: { kind: 'allow' } };
}

function resolveGitMetadataForCwds(
  cwds: readonly (string | undefined)[],
  environment: EnvironmentContext,
): ProtectedGitMetadata | null {
  const resolved = [
    ...new Set(cwds.filter((cwd): cwd is string => typeof cwd === 'string' && cwd !== '')),
  ].flatMap((cwd) => environment.gitMetadata(cwd) ?? []);
  if (resolved.length === 0) return null;
  return Object.freeze({
    entries: Object.freeze([...new Set(resolved.flatMap((metadata) => metadata.entries))]),
    markerFiles: Object.freeze([...new Set(resolved.flatMap((metadata) => metadata.markerFiles))]),
    directories: Object.freeze([...new Set(resolved.flatMap((metadata) => metadata.directories))]),
    hooksDirectories: Object.freeze([
      ...new Set(resolved.flatMap((metadata) => metadata.hooksDirectories)),
    ]),
  });
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
  const isAnalysisLimit =
    cause instanceof AnalysisLimit || cause instanceof StructuralShellSyntaxLimitError;
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
