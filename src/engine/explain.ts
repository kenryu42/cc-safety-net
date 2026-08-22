/**
 * Explain composes the guard's command evaluation with the semantic-fact
 * protection matchers so a diagnostic surface can report why a command would be
 * blocked without executing anything.
 */

import { resolve } from 'node:path';
import { analyzeCommand } from '@/analyzer';
import { resolveCommandAnalysisContext } from '@/analyzer/policy-context';
import { evaluateCommandWithTrace } from '@/engine/evaluate-command';
import { sanitizeDiagnosticText } from '@/engine/sanitize';
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
import { createSemanticFacts } from '@/guards/semantic-facts';
import type { AnalyzeInput } from '@/ir/analysis';
import type { CommandTrace } from '@/ir/command-trace';
import { createProcessEnvironment } from '@/ir/environment';
import type { ExplainOptions, ExplainResult, ExplainTrace } from '@/ir/explain';
import { createToolInvocation } from '@/ir/invocation';
import type { PolicySnapshot } from '@/ir/policy';
import { getCCSafetyNetEnvModes } from '@/policy/env';
import { createPolicySnapshot, loadPolicySnapshot } from '@/policy/snapshot';
import { validateRulesConfigFile } from '@/rules/config';
import { DESTRUCTIVE_COMMAND_RULE_METADATA } from '@/rules/destructive-command-rules';
import { getProjectRulesConfigPath, getUserRulesConfigPath } from '@/rules/policy';
import { PolicyFilesystemError, readPolicyFile } from '@/rules/policy/filesystem';
import { getPolicyPaths } from '@/rules/policy/paths';

export function explainCommand(command: string, options?: ExplainOptions): ExplainResult {
  const analyzeOptions = buildAnalyzeOptions(options);
  const context = resolveCommandAnalysisContext(analyzeOptions);
  const configuration = {
    effectiveLevel: context.effectiveLevel,
    selectedPreset: analyzeOptions.policySnapshot.policy.safety.level ?? 'standard',
    effectiveCapabilities: context.effectiveCapabilities,
    destructiveCommandRuleOverrides:
      analyzeOptions.policySnapshot.policy.destructiveCommandRuleOverrides,
  };
  const { configSource, configValid } = getConfigSource({
    cwd: options?.cwd,
    userConfigDir: options?.userConfigDir,
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

  const preAnalysisBlock = findPreAnalysisBlock(command, analyzeOptions);
  if (preAnalysisBlock) {
    return {
      trace: {
        steps: [],
        segments: [
          {
            index: 0,
            steps: [
              {
                type: 'rule-check',
                rule: preAnalysisBlock.rule,
                matched: true,
                reason: preAnalysisBlock.reason,
              },
            ],
          },
        ],
      },
      result: 'blocked',
      reason: sanitizeDiagnosticText(preAnalysisBlock.reason),
      segment: sanitizeDiagnosticText(preAnalysisBlock.target),
      ...(preAnalysisBlock.ruleId
        ? { ruleId: sanitizeDiagnosticText(preAnalysisBlock.ruleId) }
        : {}),
      configSource,
      configValid,
      ...configuration,
    };
  }

  const evaluation = evaluateCommandWithTrace(command, analyzeOptions);
  const decision = evaluation.decision;
  const activationRuleId = decision?.ruleId ?? identifyModeGatedCandidate(command, analyzeOptions);
  const activationMetadata = DESTRUCTIVE_COMMAND_RULE_METADATA.find(
    (rule) => rule.id === activationRuleId && rule.activationCapability,
  );
  const activationState = activationMetadata
    ? context.policy.effectiveDestructiveCommandRules[activationMetadata.id]
    : undefined;
  return {
    trace: projectExplainTrace(evaluation.trace),
    result: decision ? 'blocked' : 'allowed',
    reason: decision ? sanitizeDiagnosticText(decision.reason) : undefined,
    segment: decision
      ? sanitizeDiagnosticText(
          decision.evidence.find((item) => item.kind === 'command')?.segment ?? command,
        )
      : undefined,
    ruleId: decision?.ruleId ? sanitizeDiagnosticText(decision.ruleId) : undefined,
    customRule: sanitizeCustomRule(getCustomRule(decision?.ruleId, analyzeOptions.policySnapshot)),
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

interface GetConfigSourceOptions {
  cwd?: string;
  /** Override user rules config directory for testing */
  userConfigDir?: string;
  /** Override user rules config path for testing */
  userConfigPath?: string;
}

/**
 * Get the config source path and validity status.
 * Checks project config first, falls back to user config.
 *
 * @internal
 */
export function getConfigSource(options?: GetConfigSourceOptions): {
  configSource: string | null;
  configValid: boolean;
} {
  const projectPath = getProjectRulesConfigPath(options?.cwd);
  const userPath = options?.userConfigPath ?? getUserRulesConfigPath(options);
  const paths = getPolicyPaths({
    cwd: options?.cwd,
    userConfigDir: options?.userConfigDir,
    userConfigPath: options?.userConfigPath,
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

/**
 * Build AnalyzeOptions from ExplainOptions.
 * Merges user options with environment variable defaults.
 */
function buildAnalyzeOptions(explainOptions?: ExplainOptions): AnalyzeInput {
  // Resolve to absolute path - relative paths break cwd comparison logic
  const cwd = resolve(explainOptions?.cwd ?? process.cwd());
  const policySnapshot =
    explainOptions?.policySnapshot ??
    loadPolicySnapshot({ cwd, userConfigDir: explainOptions?.userConfigDir });
  const modes = getCCSafetyNetEnvModes(policySnapshot.policy);
  return {
    cwd,
    effectiveCwd: cwd,
    policySnapshot,
    environment: createProcessEnvironment(),
    protectedGitMetadata: resolveProtectedGitMetadata([cwd]),
    effectiveCapabilities: modes.capabilities,
    strict: explainOptions?.strict ?? modes.strict,
    paranoidRm: modes.paranoidRm,
    paranoidInterpreters: modes.paranoidInterpreters,
    worktreeMode: modes.worktreeMode,
  };
}

function findPreAnalysisBlock(command: string, options: AnalyzeInput) {
  const cwd = options.cwd ?? process.cwd();
  const facts = createSemanticFacts(
    createToolInvocation(
      '',
      { command },
      { kind: 'command', shell: 'posix' },
      { executionCwd: cwd, configCwd: cwd },
      command,
    ),
  );
  const policyTarget = findPolicyConfigMutationTargetInSemanticFacts(facts);
  if (policyTarget)
    return {
      reason: REASON_POLICY_CONFIG_PROTECTION,
      target: policyTarget.target,
      ruleId: 'policy-protection',
      rule: 'policy-protection:findPolicyConfigMutationTargetInSemanticFacts',
    };
  const gitMetadataTarget = findGitMetadataMutationTargetInSemanticFacts(
    facts,
    options.protectedGitMetadata,
  );
  if (gitMetadataTarget)
    return {
      reason: REASON_GIT_METADATA_PROTECTION,
      target: gitMetadataTarget.target,
      ruleId: 'git-metadata-protection',
      rule: 'git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts',
    };
  const policy = options.policySnapshot.policy;
  const secretTarget =
    policy.secretProtection.enabled === false
      ? null
      : findSensitiveTargetInSemanticFacts(facts, policy.secretProtection, {
          strict: options.strict,
        });
  if (secretTarget)
    return {
      reason: REASON_SECRET_PROTECTION,
      target: secretTarget.target,
      ruleId: secretTarget.ruleId,
      rule: 'secret-protection:findSensitiveTargetInSemanticFacts',
    };
  return null;
}

function identifyModeGatedCandidate(command: string, options: AnalyzeInput) {
  const policy = options.policySnapshot.policy;
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
    options.policySnapshot.state === 'degraded'
      ? {
          diagnostics: options.policySnapshot.diagnostics,
          reason: options.policySnapshot.reason,
        }
      : undefined,
  );
  return analyzeCommand(command, {
    ...options,
    policySnapshot: candidateSnapshot,
    strict: true,
    paranoidRm: true,
    paranoidInterpreters: true,
  })?.ruleId;
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
  const steps = trace.events.flatMap((event) =>
    event.kind === 'step' && event.scope === 'global' ? [event.step] : [],
  );
  const segments = new Map<number, ExplainTrace['segments'][number]>();
  for (const event of trace.events) {
    if (event.kind !== 'step' || event.scope !== 'segment') continue;
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
