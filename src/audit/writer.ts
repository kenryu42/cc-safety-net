import { appendFileSync, mkdirSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import type { AuditErrorCode, AuditFailureStage, AuditLogEntry } from '@/core/audit';
import type { BlockIntent } from '@/core/decision';
import type { Environment } from '@/core/environment';
import type { EffectiveSafetyLevel } from '@/core/policy/types';
import { randomHex16 } from '@/core/random-hex';
import { redactSecrets } from '@/core/redaction';
import { pruneExpiredAuditLogs } from './retention';

type AuditLogDecision = 'allow' | 'deny';

declare const __PKG_VERSION__: string | undefined;

const AUDIT_LOG_VERSION = typeof __PKG_VERSION__ !== 'undefined' ? __PKG_VERSION__ : 'dev';
const COMMAND_MAX_LENGTH = 10_000;
const SEGMENT_MAX_LENGTH = 2_000;
const TOOL_NAME_MAX_LENGTH = 256;
const CWD_MAX_LENGTH = 32_768;

/**
 * Sanitize session ID to prevent path traversal attacks.
 * Returns null if the session ID is invalid.
 * @internal Exported for testing
 */
export function sanitizeSessionIdForFilename(sessionId: string): string | null {
  const raw = sessionId.trim();
  if (!raw) {
    return null;
  }

  let safe = raw.replace(/[^A-Za-z0-9_.-]+/g, '_');

  safe = safe.replace(/^[._-]+|[._-]+$/g, '').slice(0, 128);

  if (!safe || safe === '.' || safe === '..') {
    return null;
  }

  return safe;
}

/** @internal Exported for testing */
export function encodeCwdForLogDirname(cwd: string | null): string {
  const encoded = (cwd ?? '').replace(/[^A-Za-z0-9]/g, '-').slice(0, 180);
  return encoded || 'no-cwd';
}

export function writeAuditLog(
  environment: Environment,
  sessionId: string,
  command: string,
  segment: string,
  reason: string,
  cwd: string | null,
  options: {
    decision?: AuditLogDecision;
    agent?: string;
    shape?: string;
    level?: EffectiveSafetyLevel;
    configFallback?: true;
    toolName?: string;
    ruleId?: string;
    intent?: BlockIntent;
    failureStage?: AuditFailureStage;
    errorCode?: AuditErrorCode;
    now?: () => Date;
    createId?: () => string;
  } = {},
): void {
  const safeSessionId = sanitizeSessionIdForFilename(sessionId);
  if (!safeSessionId) {
    return;
  }

  const logsDir = getAuditLogsDir(environment);
  if (!logsDir) {
    return;
  }

  try {
    const ts = (options.now ?? (() => new Date()))().toISOString();

    const cappedCommand = capField(
      redactSecrets(command),
      options.failureStage ? Number.POSITIVE_INFINITY : COMMAND_MAX_LENGTH,
    );
    const cappedSegment = capField(redactSecrets(segment), SEGMENT_MAX_LENGTH);
    const cappedToolName = options.toolName
      ? capField(redactSecrets(options.toolName), TOOL_NAME_MAX_LENGTH)
      : undefined;
    const cappedCwd = cwd === null ? undefined : capField(redactSecrets(cwd), CWD_MAX_LENGTH);
    const sessionDir = join(
      logsDir,
      encodeCwdForLogDirname(cappedCwd?.value ?? null),
      ts.slice(0, 7),
    );
    mkdirSync(sessionDir, { recursive: true, mode: 0o700 });

    const logFile = join(sessionDir, `${ts.slice(0, 10)}-${safeSessionId}.jsonl`);
    const entry: AuditLogEntry = {
      ts,
      id: (options.createId ?? randomHex16)(),
      v: AUDIT_LOG_VERSION,
      sessionId: safeSessionId,
      decision: options.decision ?? 'deny',
      agent: options.agent,
      shape: options.shape,
      level: options.level,
      configFallback: options.configFallback,
      toolName: cappedToolName?.value,
      command: cappedCommand.value,
      segment: cappedSegment.value,
      ...(cappedCommand.truncated ||
      cappedSegment.truncated ||
      cappedToolName?.truncated ||
      cappedCwd?.truncated
        ? { truncated: true }
        : {}),
      reason,
      ruleId: options.ruleId,
      intent: options.intent,
      failureStage: options.failureStage,
      errorCode: options.errorCode,
      cwd: cappedCwd?.value ?? null,
    };

    appendFileSync(logFile, `${JSON.stringify(entry)}\n`, { encoding: 'utf-8', mode: 0o600 });

    pruneExpiredAuditLogs(environment, logsDir, options.now);
  } catch {}
}

function capField(value: string, maxLength: number) {
  return { value: value.slice(0, maxLength), truncated: value.length > maxLength };
}

export function getAuditLogHomeDir(environment: Environment): string | null {
  const homeFromEnv = environment.env.get('CC_SAFETY_NET_AUDIT_HOME');
  if (environment.env.get('NODE_ENV') === 'test' && !homeFromEnv) {
    return null;
  }
  const home = homeFromEnv || environment.home;
  return home && isAbsolute(home) ? home : null;
}

export function getAuditLogsDir(environment: Environment): string | null {
  const homeDir = getAuditLogHomeDir(environment);
  return homeDir ? join(homeDir, '.cc-safety-net', 'logs') : null;
}
