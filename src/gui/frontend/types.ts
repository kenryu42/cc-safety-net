import type { BlockIntent } from '@/core/decision';
import type { SafetyLevelCapability } from '@/core/policy/safety-level';
import type { Policy } from './project-draft';

export type RuleState = {
  enabled: boolean;
  inheritedEnabled: boolean;
  source: string;
  changesInherited: boolean;
};
export type CapabilitySources = Record<string, { source: string; sources: string[] }>;
export type Preview = {
  counts: { enabled: number; disabled: number; effectiveCustomizations: number };
  rules: Record<string, RuleState>;
  capabilities: CapabilitySources;
};
export type DestructiveRule = {
  id: string;
  label: string;
  description: string;
  category: string;
  example: string;
  intent: BlockIntent;
  catastrophic?: boolean;
  activationCapability?: SafetyLevelCapability;
};
export type SecretRule = {
  id: string;
  label: string;
  description?: string;
  category: string;
  defaultOff?: boolean;
  paths?: string[];
};
export type PolicyState = {
  policy: Policy;
  preview: Preview | null;
  destructiveCommandRules: DestructiveRule[];
  secretPatterns: SecretRule[];
  secretDenial: { reason: string; intent: BlockIntent };
  errors: string[];
  raw: string;
  path: string;
  exists: boolean;
  version: string;
  configState?: { state: string; reason: string };
  projectPolicy?: { path: string; weakenings: string[] };
};
export type FeedEntry = {
  ts: string;
  decision: string;
  agent?: string;
  ruleId?: string;
  segment?: string;
  command?: string;
  reason?: string;
  failureStage?: string;
  sessionId?: string;
  cwd?: string;
};
export type ActivityFeed = {
  days: number;
  entries: FeedEntry[];
  totalInWindow: number;
  truncated: boolean;
  unreadable: number;
  logsDir?: string | null;
  homeDir?: string | null;
  counts: {
    blocked: number;
    allowed: number;
    errors: number;
    rules: Record<string, number>;
    commands: Record<string, number>;
    agents: Record<string, number>;
    blockedByDay: number[];
    analyzedByDay: number[];
  };
};
export type IntegrationRow = {
  target: string;
  label: string;
  version: string | null;
  status: 'active' | 'disabled' | 'not-installed' | 'not-inspected';
  note?: { kind: string; text: string };
};
export type UpdateStatus = { latestVersion: string | null; updateAvailable: boolean };
