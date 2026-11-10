import { resolve } from 'node:path';
import type { Decision } from '@/core/decision';
import type { Environment } from '@/core/environment';
import { PolicyFilesystemError, readPolicyFile } from '@/core/io/safe-read';
import { resolveCommandAnalysisContext } from '@/core/policy/analysis-context';
import { validateRulesConfigFile } from '@/core/policy/config-file';
import { getCCSafetyNetEnvModes } from '@/core/policy/env';
import {
  getPolicyPaths,
  getProjectRulesConfigPath,
  getUserRulesConfigPath,
} from '@/core/policy/paths';
import { createPolicySnapshot, loadPolicySnapshot } from '@/core/policy/snapshot';
import type {
  CustomRuleMetadata,
  DestructiveCommandRuleOverride,
  EffectiveDestructiveCommandRuleState,
  EffectiveSafetyCapabilities,
  EffectiveSafetyLevel,
  PolicySafetyLevel,
  PolicyScopes,
  PolicySnapshot,
} from '@/core/policy/types';
import { sanitizeDiagnosticText } from '@/core/redaction';
import { DESTRUCTIVE_COMMAND_RULE_METADATA } from '@/core/rules/destructive';
import type { ShellKind } from '@/core/shell/model';
import { parseCommand } from '@/core/shell/parse';
import { projectSegmentWords } from '@/core/shell/traversal';
import { REASON_GIT_METADATA_PROTECTION } from './guards/git-metadata-protection';
import { REASON_POLICY_APPLY_PROTECTION } from './guards/policy-apply-protection';
import { REASON_POLICY_CONFIG_PROTECTION } from './guards/policy-protection';
import { StructuralShellSyntaxLimitError } from './guards/semantic-facts';
import { createToolInvocation, type ToolInvocation } from './invocation';
import { evaluateGuard } from './pipeline';
import {
  type CommandTrace,
  createCommandTraceContext,
  createCommandTraceRecorder,
  type TraceStep,
} from './trace';

interface ExplainTrace {
  steps: TraceStep[];
  segments: { index: number; steps: TraceStep[] }[];
}

export interface ExplainOptions {
  cwd?: string;
  shell?: ShellKind;
  userConfigDir?: string;
  policySnapshot?: PolicySnapshot;
}

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

  safetyPresetScope?: PolicyScopes['levelScope'];
  effectiveCapabilities: EffectiveSafetyCapabilities;
  destructiveCommandRuleOverrides: Readonly<Record<string, DestructiveCommandRuleOverride>>;
  ruleActivation?: EffectiveDestructiveCommandRuleState & { id: string };
}

export function explainCommand(
  command: string,
  options: ExplainOptions = {},
  environment: Environment,
): ExplainResult {
  const cwd = resolve(options.cwd ?? process.cwd());
  const snapshot =
    options.policySnapshot ??
    loadPolicySnapshot(environment, { cwd, userConfigDir: options.userConfigDir });
  const modes = getCCSafetyNetEnvModes(snapshot.policy, environment.env);
  const context = resolveCommandAnalysisContext({
    policySnapshot: snapshot,
    effectiveCapabilities: modes.capabilities,
    worktreeMode: modes.worktreeMode,
  });
  const configuration = {
    effectiveLevel: context.effectiveLevel,
    selectedPreset: snapshot.policy.safety.level,
    ...(snapshot.policyScopes ? { safetyPresetScope: snapshot.policyScopes.levelScope } : {}),
    effectiveCapabilities: context.effectiveCapabilities,
    destructiveCommandRuleOverrides: snapshot.policy.destructiveCommandRuleOverrides,
  };
  const { configSource, configValid } = getConfigSource(environment, {
    cwd,
    userConfigDir: options.userConfigDir,
  });

  if (!command || !command.trim()) {
    return {
      trace: { steps: [{ type: 'error', message: 'No command provided' }], segments: [] },
      result: 'allowed',
      configSource,
      configValid,
      ...configuration,
    };
  }

  const shell = options.shell ?? 'auto';
  const program = parseCommand(command, shell);

  if (program.status === 'limited') throw new StructuralShellSyntaxLimitError();
  const segments = projectSegmentWords(program);
  const recorder = createCommandTraceRecorder();
  const trace = createCommandTraceContext(recorder);

  trace.recordGlobal({
    type: 'parse',
    input: command,
    segments: segments.map((words) => [...words]),
  });
  const invocation = createToolInvocation(
    'Bash',
    { command },
    { kind: 'command', shell },
    { configCwd: cwd, executionCwd: cwd },
    command,
  );
  const evaluation = evaluateGuard(invocation, {
    environment,
    trace,
    dependencies: {
      loadPolicySnapshot: () => snapshot,
    },
  });
  const decision = evaluation.decision.kind === 'deny' ? evaluation.decision : null;

  if (
    decision &&
    (evaluation.stage === 'policy-protection' || evaluation.stage === 'secret-protection')
  ) {
    return {
      trace: {
        steps: [],
        segments: [
          {
            index: 0,
            steps: [
              {
                type: 'rule-check',
                rule: preAnalysisRule(decision),
                matched: true,
                reason: decision.reason,
              },
            ],
          },
        ],
      },
      result: 'blocked',
      reason: sanitizeDiagnosticText(decision.reason),
      segment: sanitizeDiagnosticText(denialSegment(decision, command)),
      ruleId: sanitizeDiagnosticText(decision.ruleId),
      configSource,
      configValid,
      ...configuration,
    };
  }

  const index = trace.getNextSegmentIndex();
  if (decision && index > 0 && index < segments.length) {
    trace.recordSegment({ type: 'segment-skipped', index, reason: 'prior-segment-blocked' }, index);
  }
  const commandTrace = recorder.finish();
  const activationRuleId =
    decision?.ruleId ?? identifyModeGatedCandidate(invocation, snapshot, modes, environment);
  const activationMetadata = DESTRUCTIVE_COMMAND_RULE_METADATA.find(
    (rule) => rule.id === activationRuleId && rule.activationCapability,
  );
  const activationState = activationMetadata
    ? context.policy.effectiveDestructiveCommandRules[activationMetadata.id]
    : undefined;
  return {
    trace: projectExplainTrace(commandTrace),
    result: decision ? 'blocked' : 'allowed',
    reason: decision ? sanitizeDiagnosticText(decision.reason) : undefined,
    segment: decision ? sanitizeDiagnosticText(denialSegment(decision, command)) : undefined,
    ruleId: decision ? sanitizeDiagnosticText(decision.ruleId) : undefined,
    customRule: sanitizeCustomRule(getCustomRule(decision?.ruleId, snapshot)),
    configSource,
    configValid,
    ...configuration,
    ...(activationMetadata && activationState
      ? {
          ruleActivation: {
            id: activationMetadata.id,
            ...activationState,
          },
        }
      : {}),
  };
}

type CommandDenial = Extract<Decision, { kind: 'deny' }>;

function denialSegment(decision: CommandDenial, command: string): string {
  return decision.evidence?.segment ?? command;
}

function preAnalysisRule(decision: CommandDenial) {
  if (decision.reason === REASON_POLICY_CONFIG_PROTECTION)
    return 'policy-protection:findPolicyConfigMutationTargetInSemanticFacts';
  if (decision.reason === REASON_POLICY_APPLY_PROTECTION)
    return 'policy-apply-protection:findPolicyApplyInvocationInSemanticFacts';
  if (decision.reason === REASON_GIT_METADATA_PROTECTION)
    return 'git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts';
  return 'secret-protection:findSensitiveTargetInSemanticFacts';
}

interface GetConfigSourceOptions {
  cwd: string;

  userConfigDir?: string;
}

function getConfigSource(
  environment: Environment,
  options: GetConfigSourceOptions,
): {
  configSource: string | null;
  configValid: boolean;
} {
  const projectPath = getProjectRulesConfigPath(options.cwd);
  const userPath = getUserRulesConfigPath(environment, options);
  const paths = getPolicyPaths(environment, {
    cwd: options.cwd,
    userConfigDir: options.userConfigDir,
  });

  try {
    if (readPolicyFile(paths.projectConfigTarget) !== null) {
      const validation = validateRulesConfigFile(paths.projectConfigTarget);
      if (validation.errors.length === 0) {
        return { configSource: projectPath, configValid: true };
      }
      return { configSource: projectPath, configValid: false };
    }
  } catch (error) {
    if (error instanceof PolicyFilesystemError) {
      return { configSource: projectPath, configValid: false };
    }
    throw error;
  }

  try {
    if (readPolicyFile(paths.userConfigTarget) !== null) {
      const validation = validateRulesConfigFile(paths.userConfigTarget);
      return { configSource: userPath, configValid: validation.errors.length === 0 };
    }

    return { configSource: null, configValid: true };
  } catch (error) {
    if (error instanceof PolicyFilesystemError) {
      return { configSource: userPath, configValid: false };
    }
    throw error;
  }
}

function identifyModeGatedCandidate(
  invocation: ToolInvocation,
  snapshot: PolicySnapshot,
  modes: ReturnType<typeof getCCSafetyNetEnvModes>,
  environment: Environment,
) {
  const policy = snapshot.policy;
  const candidateSnapshot = createPolicySnapshot(
    {
      ...policy,
      destructiveCommandProtectionEnabled: true,
      destructiveCommandRuleOverrides: {
        ...policy.destructiveCommandRuleOverrides,
        ...Object.fromEntries(
          DESTRUCTIVE_COMMAND_RULE_METADATA.flatMap((rule) =>
            rule.activationCapability ? [[rule.id, 'on'] as const] : [],
          ),
        ),
      },
    },
    snapshot.state === 'degraded'
      ? { diagnostics: snapshot.diagnostics, reason: snapshot.reason }
      : undefined,
  );
  const evaluation = evaluateGuard(invocation, {
    environment,
    dependencies: {
      loadPolicySnapshot: () => candidateSnapshot,
      getModes: () => ({
        ...modes,
        strict: true,
        paranoidRm: true,
        paranoidInterpreters: true,
        capabilities: {
          fail_closed: { ...modes.capabilities.fail_closed, enabled: true },
          paranoid_rm: { ...modes.capabilities.paranoid_rm, enabled: true },
          paranoid_interpreters: { ...modes.capabilities.paranoid_interpreters, enabled: true },
        },
      }),
      findSensitiveTarget: () => null,
    },
  });
  return evaluation.decision.kind === 'deny' ? evaluation.decision.ruleId : undefined;
}

function sanitizeCustomRule(rule: ExplainResult['customRule']): ExplainResult['customRule'] {
  if (!rule) return undefined;
  return {
    id: sanitizeDiagnosticText(rule.id),
    ...(rule.rulebook
      ? {
          rulebook: {
            name: sanitizeDiagnosticText(rule.rulebook.name),
            version: sanitizeDiagnosticText(rule.rulebook.version),
          },
        }
      : {}),
    ...(rule.source ? { source: sanitizeDiagnosticText(rule.source) } : {}),
    ...(rule.override
      ? {
          override: {
            type: 'reason' as const,
            reason: sanitizeDiagnosticText(rule.override.reason),
          },
        }
      : {}),
  };
}

function projectExplainTrace(trace: CommandTrace): ExplainTrace {
  const steps = trace.events.flatMap((event) => (event.scope === 'global' ? [event.step] : []));
  const segments = new Map<number, ExplainTrace['segments'][number]>();
  for (const event of trace.events) {
    if (event.scope !== 'segment') continue;
    const segment = segments.get(event.segmentIndex) ?? { index: event.segmentIndex, steps: [] };
    segment.steps.push(event.step);
    segments.set(event.segmentIndex, segment);
  }
  return { steps, segments: [...segments.values()] };
}

function getCustomRule(
  ruleId: string | undefined,
  snapshot: PolicySnapshot,
): ExplainResult['customRule'] {
  const id = ruleId?.replace(/^custom\./, '');
  if (!id || !snapshot.policy.rules.some((rule) => rule.name === id)) return undefined;
  return snapshot.ruleMetadata[id] ?? Object.freeze({ id });
}
