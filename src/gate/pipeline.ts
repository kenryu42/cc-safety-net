import type { AuditFailureStage } from '@/core/audit';
import { type AnalysisErrorCode, AnalysisLimit, createBudget } from '@/core/budget';
import type { Decision } from '@/core/decision';
import { createCwdDenial, createMalformedToolCallDenial } from '@/core/denial';
import type { PathResolver } from '@/core/environment';
import type { ProtectedGitMetadata } from '@/core/git/metadata';
import { getCCSafetyNetEnvModes } from '@/core/policy/env';
import { loadPolicySnapshot, type PolicySnapshotOptions } from '@/core/policy/snapshot';
import type { EffectiveSafetyLevel, PolicySnapshot } from '@/core/policy/types';
import { getCommandFromToolInput, ToolInputLimitError } from '@/core/tool-input';
import type { AnalyzeInput, EnvironmentContext } from '@/gate/analysis';
import { analyzeCommandWithProgram, analyzeOrCapBreach } from '@/gate/analyzer';
import { dangerousInTextMatch } from '@/gate/analyzer/dangerous-text';
import { REASON_DYNAMIC_SHELL_SOURCE } from '@/gate/analyzer/reasons';
import {
  REASON_COMMAND_ANALYSIS_LIMIT,
  REASON_RECURSION_LIMIT,
  REASON_SAFETY_NET_FAILED_CLOSED,
  REASON_STRICT_UNPARSEABLE,
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
  getCommandSyntaxFact,
  StructuralShellSyntaxLimitError,
  UnparseableCommandError,
} from '@/gate/guards/semantic-facts';
import { resolveCanonicalCwd } from '@/gate/intake';
import { createToolInvocation, type ToolInvocation } from '@/gate/invocation';
import {
  findSensitiveTargetInSemanticFacts,
  REASON_SECRET_PROTECTION,
} from '@/gate/secret/secret-protection';
import type { CommandTraceContext } from '@/gate/trace';

export type GuardStage = AuditFailureStage;

export type GuardEvaluation = {
  stage: GuardStage;
  decision: Decision;

  promotedInvocation?: ToolInvocation;

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

const BARE_SHELL_READING_STDIN = /^(?:\S*\/)?(?:ba|da|z|k)?sh(?:\s+-[A-Za-z-]*)*$/;
const WORKING_DIRECTORY_ARGUMENTS = ['workdir', 'cwd', 'working_directory'];

export function evaluateGuard(
  hostInvocation: ToolInvocation,
  options: GuardOptions,
): GuardEvaluation {
  const dependencies = { ...DEFAULT_DEPENDENCIES, ...options.dependencies };
  const inputCommand = getInputCommandOrFail(hostInvocation);
  const loadSnapshot = () =>
    callDependency('config-load', inputCommand, () =>
      dependencies.loadPolicySnapshot(options.environment, {
        ...options.policyOptions,
        cwd: hostInvocation.context.configCwd,
      }),
    );
  const declarationSnapshot =
    hostInvocation.route.kind === 'unknown' && inputCommand ? loadSnapshot() : undefined;
  const declaration = declarationSnapshot?.policy.commandTools.find(
    (tool) => tool.name === hostInvocation.toolName,
  );
  const promotion =
    declaration && inputCommand
      ? promoteDeclaredCommandTool(
          hostInvocation,
          inputCommand,
          declaration.cwd,
          options.environment.paths,
        )
      : hostInvocation;
  if ('decision' in promotion) return promotion;
  const invocation = promotion;
  const promoted = invocation === hostInvocation ? {} : { promotedInvocation: invocation };
  const command = isCommandInvocation(invocation) ? invocation.command : inputCommand;

  const facts = callDependency('policy-protection', command, () => createSemanticFacts(invocation));
  const inputCandidate = getCommandSyntaxFact(facts, 'input-candidate');
  const declaredCommand = getCommandSyntaxFact(facts, 'declared-command');
  if (
    isCommandInvocation(invocation) &&
    invocation.command?.trim() &&
    declaredCommand?.program.status === 'limited'
  ) {
    return {
      stage: 'command-analysis',
      ...promoted,
      decision: {
        kind: 'deny',
        reason: REASON_RECURSION_LIMIT,
        ruleId: 'analysis.recursion-limit',
        intent: 'stop_and_explain',
        evidence: { command: invocation.command, segment: invocation.command },
      },
    };
  }
  if (inputCandidate?.program.status === 'limited') {
    return {
      stage: 'command-validation',
      ...promoted,
      decision: {
        kind: 'deny',
        reason: REASON_STRUCTURAL_COMMAND_VALIDATION_LIMIT,
        ruleId: 'analysis.structural-limit',
        intent: 'stop_and_explain',
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
      ...promoted,
      decision: {
        kind: 'deny',
        reason: REASON_POLICY_CONFIG_PROTECTION,
        ruleId: 'guard.policy-config',
        intent: 'hard_stop',
        evidence: { command: displayCommand, segment: policyTarget.target },
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
      ...promoted,
      decision: {
        kind: 'deny',
        reason: REASON_POLICY_APPLY_PROTECTION,
        ruleId: 'guard.policy-apply',
        intent: 'hard_stop',
        evidence: { command: displayCommand, segment: policyApplyTarget.target },
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
      ...promoted,
      decision: {
        kind: 'deny',
        reason: REASON_GIT_METADATA_PROTECTION,
        ruleId: 'guard.git-metadata',
        intent: 'hard_stop',
        evidence: { command: displayCommand, segment: gitMetadataTarget.target },
      },
    };
  }

  const snapshot = declarationSnapshot ?? loadSnapshot();
  const policy = snapshot.policy;
  const modes = dependencies.getModes(policy, options.environment.env);

  const reported = {
    level: modes.effectiveLevel,
    ...getConfigFallback(snapshot),
    ...promoted,
  };
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
        evidence: { command: displayCommand, segment: secretTarget.target },
      },
    };
  }

  if (!isCommandInvocation(invocation)) {
    return { stage: 'non-command', ...reported, decision: { kind: 'allow' } };
  }

  if (!invocation.command || invocation.command.trim() === '') {
    return { ...malformedToolCallEvaluation(command), ...reported };
  }

  const analysis = callDependency('command-analysis', command, () =>
    analyzeOrCapBreach(
      () =>
        dependencies.analyzeCommand(
          invocation.command as string,
          {
            cwd: invocation.context.configCwd,
            effectiveCwd: invocation.context.executionCwd,
            shell: invocation.route.shell,
            policySnapshot: snapshot,
            environment: options.environment,
            protectedGitMetadata,
            effectiveCapabilities: modes.capabilities,
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
  const readAsPosix =
    invocation.route.shell === 'auto' && facts.store.readsAutoAsPowerShell()
      ? () => {
          const posixTrace = options.trace?.branch();
          const evaluation: GuardEvaluation = {
            ...evaluateGuard(
              { ...invocation, route: { kind: 'command', shell: 'posix' } },
              {
                ...options,
                ...(posixTrace ? { trace: posixTrace.trace } : {}),
                dependencies: {
                  ...options.dependencies,
                  loadPolicySnapshot: () => snapshot,
                  resolveGitMetadata: () => protectedGitMetadata,
                },
              },
            ),
            ...promoted,
          };
          return {
            decision: evaluation.decision,
            withItsTrace: () => {
              posixTrace?.adopt();
              return evaluation;
            },
          };
        }
      : undefined;
  if (analysis.decision) {
    const unverifiedByStandardMode =
      !modes.strict &&
      (analysis.decision.ruleId === 'raw-text.dangerous-command' ||
        (analysis.decision.reason === REASON_DYNAMIC_SHELL_SOURCE &&
          !BARE_SHELL_READING_STDIN.test(analysis.decision.evidence?.segment ?? '') &&
          dangerousInTextMatch(invocation.command as string) === null));
    const posixReading = unverifiedByStandardMode ? readAsPosix?.() : undefined;
    if (posixReading?.decision.kind === 'deny' && !posixReading.decision.unverifiedByStandardMode) {
      return posixReading.withItsTrace();
    }
    return {
      stage: 'command-analysis',
      ...reported,
      ...('errorCode' in analysis ? { errorCode: analysis.errorCode } : {}),
      decision: unverifiedByStandardMode
        ? { ...analysis.decision, unverifiedByStandardMode: true }
        : analysis.decision,
    };
  }
  return (
    readAsPosix?.().withItsTrace() ?? {
      stage: 'command-analysis',
      ...reported,
      decision: { kind: 'allow' },
    }
  );
}

function promoteDeclaredCommandTool(
  invocation: ToolInvocation,
  command: string,
  cwdArgument: string | undefined,
  paths: PathResolver,
): ToolInvocation | GuardEvaluation {
  const requestedCwds = [
    ...new Set(
      (cwdArgument ? [cwdArgument] : WORKING_DIRECTORY_ARGUMENTS).flatMap((key) => {
        const descriptor = Object.getOwnPropertyDescriptor(invocation.input, key);
        return descriptor ? [descriptor.value] : [];
      }),
    ),
  ];
  const usableCwds = requestedCwds.filter(
    (value): value is string => typeof value === 'string' && value.trim() !== '',
  );
  if (requestedCwds.length > 1 || usableCwds.length !== requestedCwds.length) {
    return malformedToolCallEvaluation(command);
  }
  const requestedCwd = usableCwds[0];
  const executionCwd =
    requestedCwd === undefined
      ? invocation.context.configCwd
      : resolveCanonicalCwd(requestedCwd, invocation.context.configCwd, paths);
  if (!executionCwd) {
    const denial = createCwdDenial({
      directory: 'requested',
      problem: 'unusable',
      cwd: requestedCwd ?? '',
    });
    return {
      stage: 'command-validation',
      decision: {
        kind: 'deny',
        reason: denial.reason,
        ruleId: denial.ruleId,
        intent: denial.intent,
        evidence: { command, segment: command },
      },
    };
  }
  return createToolInvocation(
    invocation.toolName,
    invocation.input,
    { kind: 'command', shell: 'auto' },
    { configCwd: invocation.context.configCwd, executionCwd },
    command,
  );
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
  const denial =
    cause instanceof UnparseableCommandError
      ? { reason: REASON_STRICT_UNPARSEABLE, ruleId: 'analysis.strict-unparseable' }
      : cause instanceof AnalysisLimit || cause instanceof StructuralShellSyntaxLimitError
        ? { reason: REASON_COMMAND_ANALYSIS_LIMIT, ruleId: 'analysis.limit' }
        : { reason: REASON_SAFETY_NET_FAILED_CLOSED, ruleId: 'analysis.failed-closed' };
  return {
    stage,
    decision: {
      kind: 'deny',
      ...denial,
      intent: 'stop_and_explain',
      ...(command ? { evidence: { command, segment: command } } : {}),
    },
  };
}

function malformedToolCallEvaluation(command: string | null | undefined): GuardEvaluation {
  const denial = createMalformedToolCallDenial();
  return {
    stage: 'command-validation',
    decision: {
      kind: 'deny',
      reason: denial.reason,
      ruleId: denial.ruleId,
      intent: denial.intent,
      ...(command ? { evidence: { command, segment: command } } : {}),
    },
  };
}

function isCommandInvocation(
  invocation: ToolInvocation,
): invocation is Extract<ToolInvocation, { route: { kind: 'command' } }> {
  return invocation.route.kind === 'command';
}
