export const DEFAULT_AUDIT_RETENTION_DAYS = 30;
export const MIN_AUDIT_RETENTION_DAYS = 1;

export const MAX_AUDIT_RETENTION_DAYS = 365;

export function clampAuditRetentionDays(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) return DEFAULT_AUDIT_RETENTION_DAYS;
  if (value < MIN_AUDIT_RETENTION_DAYS) return MIN_AUDIT_RETENTION_DAYS;
  return value > MAX_AUDIT_RETENTION_DAYS ? MAX_AUDIT_RETENTION_DAYS : value;
}
