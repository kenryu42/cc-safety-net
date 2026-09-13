import type { Environment } from '@/core/environment';
import type { RulesPolicyOptions } from './paths';
import type { LoadedRulesPolicy } from './rules-config';
import { loadRulesPolicy } from './scope-policy';
import { loadPolicyConfig } from './store';
import type {
  ConfigStateInfo,
  CustomRuleMetadata,
  EffectivePolicy,
  PolicyScopes,
  PolicySnapshot,
} from './types';

export type PolicySnapshotOptions = RulesPolicyOptions;

export function loadPolicySnapshot(
  environment: Environment,
  options: PolicySnapshotOptions,
): PolicySnapshot {
  const rules = loadRulesPolicy(environment, options);
  const userPolicy = loadPolicyConfig(environment, options);
  const policy = {
    rules: rules.rules,
    transparentWrappers: rules.transparent_wrappers,
    safety: userPolicy.safety,
    worktreeMode: userPolicy.worktreeMode,
    destructiveCommandProtectionEnabled: userPolicy.destructiveCommandProtectionEnabled,
    destructiveCommandRuleOverrides: userPolicy.destructiveCommandRuleOverrides,
    destructiveCommandAllowPaths: userPolicy.destructiveCommandAllowPaths,
    secretProtection: {
      enabled: userPolicy.secretProtection.enabled ?? true,
      disabledRules: userPolicy.secretProtection.disabledRules ?? [],
      denyPaths: userPolicy.secretProtection.denyPaths,
      allowPaths: userPolicy.secretProtection.allowPaths ?? [],
    },
  };

  const overrides = {
    ...(rules.userConfig?.overrides ?? {}),
    ...(rules.projectConfig?.overrides ?? {}),
  };
  const ruleMetadata = Object.freeze(
    Object.fromEntries(
      policy.rules.map((rule): [string, CustomRuleMetadata] => {
        const rulebook = rules.rulebooks.find((item) => item.rules.includes(rule.name));
        const override = overrides[rule.name];
        return [
          rule.name,
          Object.freeze({
            id: rule.name,
            ...(rulebook
              ? {
                  rulebook: Object.freeze({ name: rulebook.name, version: rulebook.version }),
                  ...(isPublicRuleSource(rulebook.spec) ? { source: rulebook.spec } : {}),
                }
              : {}),
            ...(override && typeof override === 'object'
              ? { override: Object.freeze({ type: 'reason' as const, reason: override.reason }) }
              : {}),
          }),
        ];
      }),
    ),
  );
  return createPolicySnapshot(
    policy,
    getSnapshotFailure(rules, userPolicy),
    ruleMetadata,
    userPolicy.policyScopes,
  );
}

export function describeConfigState(snapshot: PolicySnapshot): ConfigStateInfo {
  if (snapshot.state === 'ready') return { state: snapshot.state };
  return { state: snapshot.state, reason: snapshot.reason };
}

function getSnapshotFailure(
  rules: LoadedRulesPolicy,
  userPolicy: ReturnType<typeof loadPolicyConfig>,
) {
  const policyWarning = getPolicyFallbackWarning(userPolicy);
  if (rules.errors.length === 0 && rules.warnings.length === 0 && !policyWarning) return undefined;
  return {
    diagnostics: [...rules.errors, ...rules.warnings, ...userPolicy.errors],
    reason: combineInvalidReasons(
      rules.errors.length > 0 ? withDroppedSourceAdvice(rules.errors) : undefined,
      rules.warnings.length > 0 ? withTerminalPeriod(rules.warnings.join('; ')) : undefined,
      policyWarning,
    ),
  };
}

function withDroppedSourceAdvice(errors: string[]): string {
  return `${withTerminalPeriod(errors.join('; '))} Those rule sources are not active; every other rule and all built-in protections still apply`;
}

function getPolicyFallbackWarning(userPolicy: ReturnType<typeof loadPolicyConfig>) {
  if (userPolicy.errors.length === 0) return undefined;
  const fallback =
    userPolicy.fallback === 'salvaged'
      ? 'the salvaged policy with protective defaults'
      : 'built-in protective defaults';
  return `invalid policy config: ${userPolicy.errors.join('; ')}. Enforcing ${fallback}; the invalid values are not active. Fix the policy file manually`;
}

function isPublicRuleSource(source: string): boolean {
  return /^(?:[A-Za-z0-9_.-]+$|https:\/\/github\.com\/|github:|gh:|[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:#|$))/.test(
    source,
  );
}

export function createPolicySnapshot(
  policy: EffectivePolicy,
  failure?: { readonly diagnostics: readonly string[]; readonly reason: string },
  ruleMetadata: Readonly<Record<string, CustomRuleMetadata>> = Object.freeze({}),
  policyScopes?: PolicyScopes,
): PolicySnapshot {
  const frozenPolicy = deepFreeze(structuredClone(policy));
  const scopes = policyScopes ? { policyScopes: deepFreeze(structuredClone(policyScopes)) } : {};
  if (!failure) {
    return Object.freeze({
      state: 'ready',
      policy: frozenPolicy,
      diagnostics: Object.freeze([]),
      ruleMetadata,
      ...scopes,
    });
  }
  return Object.freeze({
    state: 'degraded',
    policy: frozenPolicy,
    diagnostics: Object.freeze([...failure.diagnostics]),
    reason: failure.reason,
    ruleMetadata,
    ...scopes,
  });
}

function deepFreeze<T>(value: T): T {
  if (typeof value !== 'object' || value === null) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function combineInvalidReasons(...reasons: Array<string | undefined>): string {
  return withTerminalPeriod(reasons.filter((reason): reason is string => !!reason).join('; '));
}

function withTerminalPeriod(value: string): string {
  return /[.!?]$/.test(value) ? value : `${value}.`;
}
