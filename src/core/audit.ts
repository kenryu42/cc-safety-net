import { appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import type { AuditLogEntry } from '@/types';

type AuditLogDecision = 'allow' | 'deny';

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

  // Replace any non-safe characters with underscores
  let safe = raw.replace(/[^A-Za-z0-9_.-]+/g, '_');

  // Strip leading/trailing special chars and limit length
  safe = safe.replace(/^[._-]+|[._-]+$/g, '').slice(0, 128);

  if (!safe || safe === '.' || safe === '..') {
    return null;
  }

  return safe;
}

/**
 * Write an audit log entry for a denied command.
 * Logs are written to ~/.cc-safety-net/logs/<session_id>.jsonl
 */
export function writeAuditLog(
  sessionId: string,
  command: string,
  segment: string,
  reason: string,
  cwd: string | null,
  options: { homeDir?: string; decision?: AuditLogDecision } = {},
): void {
  const safeSessionId = sanitizeSessionIdForFilename(sessionId);
  if (!safeSessionId) {
    return;
  }

  const home = options.homeDir ?? process.env.HOME ?? homedir();
  const logsDir = join(home, '.cc-safety-net', 'logs');

  try {
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }

    const logFile = join(logsDir, `${safeSessionId}.jsonl`);
    const entry: AuditLogEntry = {
      ts: new Date().toISOString(),
      decision: options.decision ?? 'deny',
      command: redactSecrets(command).slice(0, 300),
      segment: redactSecrets(segment).slice(0, 300),
      reason,
      cwd,
    };

    appendFileSync(logFile, `${JSON.stringify(entry)}\n`, 'utf-8');
  } catch {
    // Silently ignore errors (matches Python behavior)
  }
}

/**
 * Redact secrets from text to avoid leaking sensitive information in logs.
 */
export function redactSecrets(text: string): string {
  let result = text;

  // PEM private keys
  result = result.replace(
    /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
    '<redacted>',
  );

  // Database connection string env vars
  result = result.replace(
    /\b((?:DATABASE|POSTGRES|POSTGRESQL|MYSQL|MARIADB|REDIS|MONGO(?:DB)?|DB)_URL)=([^\s]+)/gi,
    '$1=<redacted>',
  );

  // KEY=VALUE patterns for common secret-ish keys
  result = result.replace(
    /\b([A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|PASS|KEY|CREDENTIALS)[A-Z0-9_]*)=([^\s]+)/gi,
    '$1=<redacted>',
  );

  // Common secret-bearing headers
  result = result.replace(
    /(['"]?\s*(?:authorization|cookie|x-api-key|api-key)\s*:\s*)([^'"\r\n]+)(['"]?)/gi,
    '$1<redacted>$3',
  );
  result = result.replace(/(['"]?\s*authorization\s*:\s*)([^'"]+)(['"]?)/gi, '$1<redacted>$3');
  result = result.replace(/(authorization\s*:\s*)([^\s"']+)(\s+[^\s"']+)?/gi, '$1<redacted>');

  // URL credentials: scheme://user:pass@host or scheme://token@host
  result = result.replace(
    /\b([a-z][a-z0-9+.-]*:\/\/)([^\s/:@]+):([^\s@/]+)@/gi,
    '$1<redacted>:<redacted>@',
  );
  result = result.replace(/\b([a-z][a-z0-9+.-]*:\/\/)([^\s/@:]+)@/gi, '$1<redacted>@');

  // Common GitHub token prefixes
  result = result.replace(/\bgh[pousr]_[A-Za-z0-9]{20,}\b/g, '<redacted>');

  // Common provider token prefixes
  result = result.replace(/\bxoxb-[A-Za-z0-9-]{20,}\b/g, '<redacted>');
  result = result.replace(/\bnpm_[A-Za-z0-9_]{20,}\b/g, '<redacted>');
  result = result.replace(/\b[rs]k_(?:live|test)_[A-Za-z0-9_]{20,}\b/g, '<redacted>');
  result = result.replace(/\bpypi-[A-Za-z0-9_-]{20,}\b/g, '<redacted>');

  // JWTs and AWS access key IDs
  result = result.replace(
    /\b[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{6,}\b/g,
    '<redacted>',
  );
  result = result.replace(/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g, '<redacted>');

  return result;
}
