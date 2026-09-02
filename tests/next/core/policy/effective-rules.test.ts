import { describe, expect, test } from 'bun:test';
import { resolveCommandAnalysisContext as contextWithNext } from '@next/core/policy/analysis-context';
import {
  createCommandAnalysisPolicy as analysisPolicyWithNext,
  filterDestructiveCommandMatch as filterWithNext,
  resolveEffectiveDestructiveCommandRules as resolveWithNext,
  destructiveCommandRuleIsEnabled as ruleEnabledWithNext,
} from '@next/core/policy/effective-rules';
import type {
  DestructiveCommandRuleOverride,
  EffectivePolicy,
  EffectiveSafetyCapabilities,
} from '@next/core/policy/types';
import type { DestructiveCommandRuleMatch } from '@next/core/rules/types';
import { resolveCommandAnalysisContext as contextWithSrc } from '@/analyzer/policy-context';
import { getCCSafetyNetEnvModes } from '@/policy/env';
import { createPolicySnapshot } from '@/policy/snapshot';
import {
  createCommandAnalysisPolicy as analysisPolicyWithSrc,
  DESTRUCTIVE_COMMAND_RULE_METADATA,
  type DestructiveCommandRuleId,
  destructiveCommandMatch,
  filterDestructiveCommandMatch as filterWithSrc,
  resolveEffectiveDestructiveCommandRules as resolveWithSrc,
  destructiveCommandRuleIsEnabled as ruleEnabledWithSrc,
} from '@/rules/destructive-command-rules';
import { withEnv } from '../../../helpers';

/**
 * Rule activation is a pure function of the resolved capabilities and the policy
 * overrides. The capability objects come from the shipped resolver so the provenance
 * they carry is real, then the same plain objects drive both implementations.
 */

const CLEARED = {
  CC_SAFETY_NET_LEVEL: undefined,
  CC_SAFETY_NET_STRICT: undefined,
  SAFETY_NET_STRICT: undefined,
  CC_SAFETY_NET_PARANOID: undefined,
  SAFETY_NET_PARANOID: undefined,
  CC_SAFETY_NET_PARANOID_RM: undefined,
  SAFETY_NET_PARANOID_RM: undefined,
  CC_SAFETY_NET_PARANOID_INTERPRETERS: undefined,
  SAFETY_NET_PARANOID_INTERPRETERS: undefined,
  CC_SAFETY_NET_WORKTREE: undefined,
  SAFETY_NET_WORKTREE: undefined,
  CC_SAFETY_NET_DEBUG: undefined,
  CC_SAFETY_NET_AUDIT_SCOPE: undefined,
};

const CAPABILITIES: readonly EffectiveSafetyCapabilities[] = [
  { env: {}, policy: undefined },
  { env: {}, policy: { safety: { level: 'strict' as const } } },
  { env: {}, policy: { safety: { level: 'paranoid' as const } } },
  { env: { CC_SAFETY_NET_LEVEL: 'strict' }, policy: undefined },
  { env: { CC_SAFETY_NET_LEVEL: 'paranoid' }, policy: undefined },
  { env: { CC_SAFETY_NET_STRICT: '1' }, policy: undefined },
  { env: { CC_SAFETY_NET_PARANOID: '1' }, policy: undefined },
  { env: { CC_SAFETY_NET_PARANOID_RM: '1' }, policy: undefined },
  { env: { CC_SAFETY_NET_PARANOID_INTERPRETERS: '1' }, policy: undefined },
  { env: {}, policy: { safety: { level: 'standard' as const, overrides: { failClosed: true } } } },
  {
    env: {},
    policy: { safety: { level: 'paranoid' as const, overrides: { paranoidRm: false } } },
  },
  {
    env: {},
    policy: {
      safety: {
        level: 'paranoid' as const,
        overrides: { failClosed: false, paranoidRm: false, paranoidInterpreters: false },
      },
    },
  },
].map((pair) =>
  withEnv({ ...CLEARED, ...pair.env }, () => getCCSafetyNetEnvModes(pair.policy).capabilities),
);

function firstRuleId(
  predicate: (rule: (typeof DESTRUCTIVE_COMMAND_RULE_METADATA)[number]) => boolean,
) {
  const rule = DESTRUCTIVE_COMMAND_RULE_METADATA.find(predicate);
  if (!rule) throw new Error('the catalog no longer holds a rule for this predicate');
  return rule.id;
}

const CHOSEN_IDS: readonly string[] = [
  firstRuleId((rule) => rule.catastrophic === true),
  firstRuleId((rule) => rule.activationCapability === 'fail_closed'),
  firstRuleId((rule) => rule.activationCapability === 'paranoid_rm'),
  firstRuleId((rule) => rule.activationCapability === 'paranoid_interpreters'),
  firstRuleId((rule) => !rule.catastrophic && rule.activationCapability === undefined),
  'custom.nope',
];

const MIXED_OVERRIDES: Record<string, DestructiveCommandRuleOverride> = Object.fromEntries(
  CHOSEN_IDS.map((id, index) => [id, index % 2 === 0 ? 'off' : 'on'] as const),
);

const OVERRIDE_MAPS: readonly Record<string, DestructiveCommandRuleOverride>[] = [
  {},
  ...CHOSEN_IDS.map((id) => ({ [id]: 'on' as const })),
  ...CHOSEN_IDS.map((id) => ({ [id]: 'off' as const })),
  MIXED_OVERRIDES,
];

const BASE_POLICY: EffectivePolicy = {
  rules: [],
  transparentWrappers: [],
  safety: {},
  worktreeMode: false,
  destructiveCommandProtectionEnabled: true,
  destructiveCommandRuleOverrides: {},
  destructiveCommandAllowPaths: [],
  secretProtection: { enabled: true, disabledRules: [], denyPaths: [], allowPaths: [] },
};

const POLICIES: readonly EffectivePolicy[] = [true, false].flatMap((enabled) =>
  OVERRIDE_MAPS.map((overrides) => ({
    ...BASE_POLICY,
    destructiveCommandProtectionEnabled: enabled,
    destructiveCommandRuleOverrides: overrides,
  })),
);

const CATALOG_IDS = DESTRUCTIVE_COMMAND_RULE_METADATA.map(
  (rule) => rule.id as DestructiveCommandRuleId,
);

const ANALYSIS_POLICIES = CAPABILITIES.flatMap((capabilities) =>
  POLICIES.map((policy) => ({
    src: analysisPolicyWithSrc(policy, capabilities),
    next: analysisPolicyWithNext(policy, capabilities),
  })),
);

/** Every catalog id against every resolved policy, plus the no-policy and no-match edges. */
function filteredMatches<P>(
  filter: (
    match: DestructiveCommandRuleMatch | null,
    policy: P | undefined,
  ) => DestructiveCommandRuleMatch | null,
  policies: readonly (P | undefined)[],
) {
  return policies.flatMap((policy) => [
    ...CATALOG_IDS.map((id) => filter(destructiveCommandMatch(id, 'r'), policy)),
    filter(null, policy),
  ]);
}

function enabledFlags<P>(
  isEnabled: (policy: P | undefined, id: DestructiveCommandRuleId, inherited: boolean) => boolean,
  policies: readonly (P | undefined)[],
) {
  return policies.flatMap((policy) =>
    [true, false].flatMap((inherited) => CATALOG_IDS.map((id) => isEnabled(policy, id, inherited))),
  );
}

const TRISTATE = [undefined, true, false] as const;

const OPTION_COMBINATIONS = TRISTATE.flatMap((strict) =>
  TRISTATE.flatMap((paranoidRm) =>
    TRISTATE.flatMap((paranoidInterpreters) =>
      TRISTATE.map((worktreeMode) => ({
        strict,
        paranoidRm,
        paranoidInterpreters,
        worktreeMode,
      })),
    ),
  ),
);

const SNAPSHOT = createPolicySnapshot({
  ...BASE_POLICY,
  destructiveCommandRuleOverrides: MIXED_OVERRIDES,
});

describe('effective destructive-command rules', () => {
  test('the capability sets cover every provenance', () => {
    const sources = new Set(
      CAPABILITIES.flatMap((capabilities) => Object.values(capabilities).map((one) => one.source)),
    );
    expect([...sources].sort()).toStrictEqual(['capability_override', 'environment', 'preset']);
  });

  test('resolveEffectiveDestructiveCommandRules agrees for every policy and capability set', () => {
    for (const capabilities of CAPABILITIES) {
      for (const policy of POLICIES) {
        expect(resolveWithNext(policy, capabilities)).toStrictEqual(
          resolveWithSrc(policy, capabilities),
        );
      }
    }
  });

  test('createCommandAnalysisPolicy agrees for every policy and capability set', () => {
    for (const pair of ANALYSIS_POLICIES) {
      expect(pair.next).toStrictEqual(pair.src);
    }
  });

  test('filterDestructiveCommandMatch agrees for every catalog id', () => {
    expect(
      filteredMatches(filterWithNext, [...ANALYSIS_POLICIES.map((pair) => pair.next), undefined]),
    ).toStrictEqual(
      filteredMatches(filterWithSrc, [...ANALYSIS_POLICIES.map((pair) => pair.src), undefined]),
    );
  });

  test('destructiveCommandRuleIsEnabled agrees for every catalog id and inherited value', () => {
    expect(
      enabledFlags(ruleEnabledWithNext, [...ANALYSIS_POLICIES.map((pair) => pair.next), undefined]),
    ).toStrictEqual(
      enabledFlags(ruleEnabledWithSrc, [...ANALYSIS_POLICIES.map((pair) => pair.src), undefined]),
    );
  });

  test('resolveCommandAnalysisContext agrees for every option and capability combination', () => {
    for (const effectiveCapabilities of CAPABILITIES) {
      for (const options of OPTION_COMBINATIONS) {
        const input = { policySnapshot: SNAPSHOT, effectiveCapabilities, ...options };
        expect(contextWithNext(input)).toStrictEqual(contextWithSrc(input));
      }
    }
  });
});
