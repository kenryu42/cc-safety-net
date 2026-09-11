import type {
  ConfigStateInfo,
  DestructiveCommandRuleOverride,
  EffectiveSafetyCapabilities,
  EffectiveSafetyLevel,
  PolicyScopes,
} from '@/core/policy/types';
import type { IntegrationId } from '@/hosts/catalog';
import type { SelfTestSummary } from '@/hosts/self-test';

export type HookPlatform = IntegrationId;

type HookInspectionStatus = 'verified' | 'failed' | 'not-applicable' | 'not-inspected';

export interface HookStatus {
  platform: HookPlatform;
  detected: boolean;
  configured: boolean;
  inspectionStatus: HookInspectionStatus;
  method?: string;
  configPath?: string;
  configPaths?: readonly string[];
  errors?: string[];
}

export interface UpdateInfo {
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  error?: string;
}

export interface SystemInfo {
  version: string;

  versions: Partial<Record<IntegrationId, string | null>>;

  codexPluginListOutput: string | null;

  ampPluginListOutput: string | null;

  nodeVersion: string | null;

  npmVersion: string | null;

  bunVersion: string | null;

  platform: string;
}

export interface ConfigSourceInfo {
  path: string;
  exists: boolean;
  valid: boolean;
  ruleCount: number;
  errors?: string[];
}

export interface EffectiveRule {
  source: 'user' | 'project';
  name: string;
  command: string;
  subcommand?: string;
  blockArgs: string[];
  reason: string;
}

export interface ShadowedRule {
  name: string;
  shadowedBy: 'project';
}

export interface EnvVarInfo {
  name: string;
  value: string | undefined;
  isSet: boolean;
  legacyName?: string;
  legacyValue?: string;
  legacyIsSet?: boolean;
  description: string;
  defaultBehavior: string;
}

interface EffectiveSafetyInfo {
  selectedPreset: 'standard' | 'strict' | 'paranoid';
  level: EffectiveSafetyLevel;
  capabilities: EffectiveSafetyCapabilities;
  ruleOverrides: Readonly<Record<string, DestructiveCommandRuleOverride>>;
  weakenedRuleOverrides: string[];

  policyScopes?: PolicyScopes;
  ruleCounts: {
    stored: number;
    effective: number;
  };
}

export type DoctorFindingSeverity = 'info' | 'warning' | 'error';

export interface DoctorFinding {
  checkId: string;
  severity: DoctorFindingSeverity;
  title: string;
  detail: string;
  fixHint?: string;
  integration?: string;
  path?: string;
}

export type ProtectedDirectoryKind = 'policy' | 'config' | 'audit';

export type ProtectedDirectoryIssue = 'ownership' | 'permissions' | 'symlink' | 'not-directory';

export interface ProtectedDirectoryPosture {
  kind: ProtectedDirectoryKind;
  path?: string;
  status: 'safe' | 'unsafe' | 'unknown' | 'not-applicable';
  issues: ProtectedDirectoryIssue[];
}

export interface DoctorPosture {
  directories: ProtectedDirectoryPosture[];
}

export interface ActivitySummary {
  totalBlocked: number;
  sessionCount: number;
  recentEntries: Array<{
    timestamp: string;
    command: string;
    reason: string;
    relativeTime: string;
  }>;
  oldestEntry?: string;
  newestEntry?: string;

  unreadable: number;
}

export interface DoctorReport {
  hooks: HookStatus[];
  engineSelfTest: SelfTestSummary;
  userConfig: ConfigSourceInfo;
  projectConfig: ConfigSourceInfo;

  configState: ConfigStateInfo;
  effectiveRules: EffectiveRule[];
  shadowedRules: ShadowedRule[];
  environment: EnvVarInfo[];
  effectiveSafety: EffectiveSafetyInfo;

  v2Leftovers?: readonly string[];
  posture: DoctorPosture;
  findings: DoctorFinding[];
  activity: ActivitySummary;
  update: UpdateInfo;
  system: SystemInfo;
}

export interface DoctorOptions {
  json?: boolean;
  cwd?: string;
  skipUpdateCheck?: boolean;
}
