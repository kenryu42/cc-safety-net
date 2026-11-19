import type { BlockIntent } from '@/core/decision';
import type { SafetyLevelCapability } from '@/core/policy/safety-level';

export type SafetyLevel = 'standard' | 'strict' | 'paranoid';
export type RuleOverrides = Record<string, 'on' | 'off'>;
export type RuleMessage = { reason: string; intent?: BlockIntent };
export type RuleMessages = Record<string, RuleMessage>;
export type Policy = {
  version: number;
  safety: {
    level: SafetyLevel;
    overrides: Record<SafetyLevelCapability, boolean | undefined>;
  };
  workflow: { worktree_mode: boolean };
  destructive_command_protection: {
    enabled: boolean;
    overrides: RuleOverrides;
    messages?: RuleMessages;
    allow_paths: string[];
  };
  secret_protection: {
    enabled: boolean;
    overrides: RuleOverrides;
    messages?: RuleMessages;
    deny_paths: string[];
    allow_paths: string[];
  };
  audit: { retention_days: number };
};
export type ProjectProposal = {
  version?: number;
  safety?: { level?: SafetyLevel; overrides?: Record<string, boolean> };
  workflow?: { worktree_mode?: boolean };
  destructive_command_protection?: {
    enabled?: boolean;
    overrides?: RuleOverrides;
    allow_paths?: string[];
  };
  secret_protection?: {
    enabled?: boolean;
    overrides?: RuleOverrides;
    deny_paths?: string[];
    allow_paths?: string[];
  };
};

export const clonePolicy = (policy: Policy): Policy => JSON.parse(JSON.stringify(policy));

const markedOverrides = (
  marked: Set<string>,
  section: string,
  overrides: Record<string, unknown>,
) =>
  Object.fromEntries(
    Object.entries(overrides).filter(
      ([key, value]) => value !== undefined && marked.has(`${section}.overrides.${key}`),
    ),
  );
const withOverrides = (overrides: Record<string, unknown>) =>
  Object.keys(overrides).length > 0 ? { overrides } : {};

export const collectProjectProposal = (marked: Set<string>, policy: Policy) => {
  const sections: Record<string, Record<string, unknown>> = {
    safety: {
      ...(marked.has('safety.level') ? { level: policy.safety.level } : {}),
      ...withOverrides(markedOverrides(marked, 'safety', policy.safety.overrides)),
    },
    workflow: marked.has('workflow.worktree_mode')
      ? { worktree_mode: policy.workflow.worktree_mode }
      : {},
    destructive_command_protection: {
      ...(marked.has('destructive_command_protection.enabled')
        ? { enabled: policy.destructive_command_protection.enabled }
        : {}),
      ...withOverrides(
        markedOverrides(
          marked,
          'destructive_command_protection',
          policy.destructive_command_protection.overrides,
        ),
      ),
      ...(marked.has('destructive_command_protection.allow_paths')
        ? { allow_paths: policy.destructive_command_protection.allow_paths }
        : {}),
    },
    secret_protection: {
      ...(marked.has('secret_protection.enabled')
        ? { enabled: policy.secret_protection.enabled }
        : {}),
      ...withOverrides(
        markedOverrides(marked, 'secret_protection', policy.secret_protection.overrides),
      ),
      ...(marked.has('secret_protection.deny_paths')
        ? { deny_paths: policy.secret_protection.deny_paths }
        : {}),
      ...(marked.has('secret_protection.allow_paths')
        ? { allow_paths: policy.secret_protection.allow_paths }
        : {}),
    },
  };
  return {
    version: 1,
    ...Object.fromEntries(
      Object.entries(sections).filter(([, fields]) => Object.keys(fields).length > 0),
    ),
  };
};

export const projectMarkedFields = (projection: ProjectProposal) => {
  const destructive = projection.destructive_command_protection ?? {};
  const secret = projection.secret_protection ?? {};
  return [
    ...(projection.safety?.level === undefined ? [] : ['safety.level']),
    ...Object.keys(projection.safety?.overrides ?? {}).map((key) => `safety.overrides.${key}`),
    ...(projection.workflow?.worktree_mode === undefined ? [] : ['workflow.worktree_mode']),
    ...(destructive.enabled === undefined ? [] : ['destructive_command_protection.enabled']),
    ...Object.keys(destructive.overrides ?? {}).map(
      (id) => `destructive_command_protection.overrides.${id}`,
    ),
    ...(destructive.allow_paths === undefined
      ? []
      : ['destructive_command_protection.allow_paths']),
    ...(secret.enabled === undefined ? [] : ['secret_protection.enabled']),
    ...Object.keys(secret.overrides ?? {}).map((id) => `secret_protection.overrides.${id}`),
    ...(secret.deny_paths === undefined ? [] : ['secret_protection.deny_paths']),
    ...(secret.allow_paths === undefined ? [] : ['secret_protection.allow_paths']),
  ];
};

export const overlayProjectProposal = (baseline: Policy, proposal: ProjectProposal) => {
  const displayed = clonePolicy(baseline);
  const destructive = proposal.destructive_command_protection ?? {};
  const secret = proposal.secret_protection ?? {};
  if (proposal.safety?.level) displayed.safety.level = proposal.safety.level;
  Object.assign(displayed.safety.overrides, proposal.safety?.overrides ?? {});
  if (proposal.workflow?.worktree_mode !== undefined)
    displayed.workflow.worktree_mode = proposal.workflow.worktree_mode;
  if (destructive.enabled !== undefined)
    displayed.destructive_command_protection.enabled = destructive.enabled;
  Object.assign(displayed.destructive_command_protection.overrides, destructive.overrides ?? {});
  if (destructive.allow_paths)
    displayed.destructive_command_protection.allow_paths = destructive.allow_paths;
  if (secret.enabled !== undefined) displayed.secret_protection.enabled = secret.enabled;
  Object.assign(displayed.secret_protection.overrides, secret.overrides ?? {});
  if (secret.deny_paths) displayed.secret_protection.deny_paths = secret.deny_paths;
  if (secret.allow_paths) displayed.secret_protection.allow_paths = secret.allow_paths;
  return displayed;
};

export const seedProjectDraft = (data: {
  baseline?: Policy;
  projection?: ProjectProposal;
  userPolicyDiagnostics?: unknown;
}) => {
  if (!data.baseline) return null;
  if (!Array.isArray(data.userPolicyDiagnostics) || data.userPolicyDiagnostics.length > 0)
    return null;
  const marked = new Set(projectMarkedFields(data.projection ?? {}));
  const policy = overlayProjectProposal(data.baseline, data.projection ?? {});
  return {
    baseline: data.baseline,
    marked,
    policy,
    snapshot: JSON.stringify(collectProjectProposal(marked, policy)),
  };
};
