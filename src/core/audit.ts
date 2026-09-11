import type { AnalysisErrorCode } from './budget';
import type { BlockIntent } from './decision';
import type { EffectiveSafetyLevel } from './policy/types';

export type AuditFailureStage =
  | 'policy-protection'
  | 'config-load'
  | 'secret-protection'
  | 'non-command'
  | 'command-validation'
  | 'command-analysis';

export type AuditErrorCode = AnalysisErrorCode | 'unexpected-error';

type AuditLogDecision = 'allow' | 'deny';

export interface AuditLogEntry {
  ts: string;
  id?: string;
  v?: string;
  sessionId?: string;
  decision?: AuditLogDecision;
  agent?: string;
  shape?: string;

  level?: EffectiveSafetyLevel;

  configFallback?: true;
  toolName?: string;
  command: string;
  segment: string;
  truncated?: boolean;
  reason: string;
  ruleId?: string;
  intent?: BlockIntent;
  failureStage?: AuditFailureStage;
  errorCode?: AuditErrorCode;
  cwd?: string | null;
}
