import type { SafetyLevelCapability } from '@/core/policy/safety-level';
import { viewHash } from './format';
import type { Messages } from './locales/en';
import type { Policy, RuleMessages, RuleOverrides, SafetyLevel } from './project-draft';
import type { CapabilitySources, DestructiveRule, RuleState } from './types';

export const safetyLevels = (t: Messages): Record<SafetyLevel, [string, string]> => ({
  standard: [t.presetStandard, t.presetStandardDescription],
  strict: [t.presetStrict, t.presetStrictDescription],
  paranoid: [t.presetParanoid, t.presetParanoidDescription],
});
export const capabilityNames = (t: Messages): Record<SafetyLevelCapability, [string, string]> => ({
  fail_closed: [t.capabilityFailClosed, t.capabilityFailClosedDescription],
  paranoid_rm: [t.capabilityParanoidRm, t.capabilityParanoidRmDescription],
  paranoid_interpreters: [
    t.capabilityParanoidInterpreters,
    t.capabilityParanoidInterpretersDescription,
  ],
});

export const levelName = (level: SafetyLevel, t: Messages) => safetyLevels(t)[level][0];
export const tierForRule = (rule: Pick<DestructiveRule, 'activationCapability'>) =>
  !rule.activationCapability
    ? 'normal'
    : rule.activationCapability === 'fail_closed'
      ? 'strict'
      : 'paranoid';

export const commandRuleGroups = <T extends { category: string; catastrophic?: boolean }>(
  rules: T[],
  t: Messages,
) => {
  const alwaysOn = rules.filter((rule) => rule.catastrophic);
  const configurable = rules.filter((rule) => !rule.catastrophic);
  return [
    ...(alwaysOn.length > 0 ? [{ key: 'always-on', title: t.alwaysOn, rules: alwaysOn }] : []),
    ...[...new Set(configurable.map((rule) => rule.category))].map((category) => ({
      key: category,
      title: category,
      rules: configurable.filter((rule) => rule.category === category),
    })),
  ];
};

export const policyFiltersFromParams = (params: URLSearchParams) => ({
  query: params.get('q') ?? '',
  changedOnly: params.get('show') === 'changed',
});

export const policyHash = (filters: ReturnType<typeof policyFiltersFromParams>) =>
  viewHash('policy', [
    ['q', filters.query, ''],
    ['show', filters.changedOnly ? 'changed' : 'all', 'all'],
  ]);

export const ruleNote = (
  rule: Pick<DestructiveRule, 'activationCapability'>,
  effective: RuleState,
  capabilities: CapabilitySources,
  t: Messages,
) => {
  const capability = rule.activationCapability;
  if (effective.source === 'rule_override') return t.changedByYou;
  if (effective.source === 'capability_override' && capability)
    return t.forcedInAdvanced(capabilityNames(t)[capability][0], effective.enabled);
  if (effective.source === 'environment') {
    const source = [...(capability ? (capabilities[capability]?.sources ?? []) : [])]
      .reverse()
      .find((item) => item.startsWith('env '));
    return source ? t.setByEnvironmentVariable(source.slice(4)) : t.setByEnvironment;
  }
  if (effective.enabled || effective.source === 'master_disabled') return null;
  return t.needsPreset(tierForRule(rule) === 'strict' ? t.presetStrict : t.presetParanoid);
};

export const policyChanges = (
  saved: Policy,
  draft: Policy,
  labels: Record<string, string>,
  t: Messages,
) => {
  const onOff = (value: boolean) => (value ? t.stateOn : t.stateOff);
  const capabilities = capabilityNames(t);
  const overrideChanges = (before: RuleOverrides, after: RuleOverrides) =>
    [...new Set([...Object.keys(before), ...Object.keys(after)])]
      .filter((id) => before[id] !== after[id])
      .map((id) =>
        t.settingChange(
          labels[id] ?? id,
          after[id] === undefined ? t.stateDefault : onOff(after[id] === 'on'),
        ),
      );
  const messageChanges = (before: RuleMessages = {}, after: RuleMessages = {}) =>
    [...new Set([...Object.keys(before), ...Object.keys(after)])]
      .filter(
        (id) =>
          before[id]?.reason !== after[id]?.reason || before[id]?.intent !== after[id]?.intent,
      )
      .map((id) =>
        t.settingChange(
          labels[id] ?? id,
          after[id] ? t.customMessageChange : t.builtInMessageChange,
        ),
      );
  const pathChanges = (name: string, before: string[], after: string[]) => {
    const added = after.filter((path) => !before.includes(path)).length;
    const removed = before.filter((path) => !after.includes(path)).length;
    if (added === 0 && removed === 0) return null;
    return t.settingChange(
      name,
      [added ? t.pathsAdded(added) : '', removed ? t.pathsRemoved(removed) : '']
        .filter(Boolean)
        .join(t.listSeparator),
    );
  };
  return [
    saved.safety.level === draft.safety.level
      ? null
      : t.settingChange(
          t.presetLabel,
          `${levelName(saved.safety.level, t)} → ${levelName(draft.safety.level, t)}`,
        ),
    ...(Object.keys(capabilities) as SafetyLevelCapability[])
      .filter((key) => saved.safety.overrides[key] !== draft.safety.overrides[key])
      .map((key) => {
        const value = draft.safety.overrides[key];
        return t.settingChange(
          capabilities[key][0],
          value === undefined ? t.fromPreset : value ? t.forcedOn : t.forcedOff,
        );
      }),
    saved.workflow.worktree_mode === draft.workflow.worktree_mode
      ? null
      : t.settingChange(t.worktreeChange, draft.workflow.worktree_mode ? t.allowed : t.blocked),
    saved.destructive_command_protection.enabled === draft.destructive_command_protection.enabled
      ? null
      : t.settingChange(t.commandProtection, onOff(draft.destructive_command_protection.enabled)),
    saved.secret_protection.enabled === draft.secret_protection.enabled
      ? null
      : t.settingChange(t.secretProtection, onOff(draft.secret_protection.enabled)),
    ...overrideChanges(
      saved.destructive_command_protection.overrides,
      draft.destructive_command_protection.overrides,
    ),
    ...overrideChanges(saved.secret_protection.overrides, draft.secret_protection.overrides),
    ...messageChanges(
      saved.destructive_command_protection.messages,
      draft.destructive_command_protection.messages,
    ),
    ...messageChanges(saved.secret_protection.messages, draft.secret_protection.messages),
    pathChanges(
      t.allowPathsChange,
      saved.destructive_command_protection.allow_paths,
      draft.destructive_command_protection.allow_paths,
    ),
    pathChanges(
      t.denyPathsChange,
      saved.secret_protection.deny_paths,
      draft.secret_protection.deny_paths,
    ),
    pathChanges(
      t.secretAllowPathsChange,
      saved.secret_protection.allow_paths,
      draft.secret_protection.allow_paths,
    ),
  ].filter((change) => change !== null);
};
