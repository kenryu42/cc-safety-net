import { existsSync, readFileSync } from 'node:fs';
import type { Environment } from '@/core/environment';
import { getUserPolicyPath, type UserScopeOptions } from './paths';
import { normalizeGuiPolicy } from './store';
import type { GuiPolicy } from './types';
import { getUserPolicyDiagnostics } from './user-policy-diagnostics';

export type PolicyDiffRow = { field: string; before?: string; after?: string };

/**
 * The whole diff: the policy file shape is fixed and small, so one flat map of
 * `field.path` to displayed value covers it without a diff library. Audit belongs
 * to the user scope only and drops out of a project-scope comparison.
 *
 * @internal
 */
export function flattenPolicy(policy: GuiPolicy, includeAudit: boolean): Record<string, string> {
  return {
    'safety.level': policy.safety.level,
    ...flattenSection('safety.overrides', policy.safety.overrides),
    'workflow.worktree_mode': String(policy.workflow.worktree_mode),
    'destructive_command_protection.enabled': String(policy.destructive_command_protection.enabled),
    ...flattenSection(
      'destructive_command_protection.overrides',
      policy.destructive_command_protection.overrides,
    ),
    'destructive_command_protection.allow_paths': flattenList(
      policy.destructive_command_protection.allow_paths,
    ),
    'secret_protection.enabled': String(policy.secret_protection.enabled),
    ...flattenSection('secret_protection.overrides', policy.secret_protection.overrides),
    'secret_protection.deny_paths': flattenList(policy.secret_protection.deny_paths),
    'secret_protection.allow_paths': flattenList(policy.secret_protection.allow_paths),
    ...(includeAudit ? { 'audit.retention_days': String(policy.audit.retention_days) } : {}),
  };
}

export function diffPolicyRows(
  current: GuiPolicy,
  proposed: GuiPolicy,
  includeAudit: boolean,
): PolicyDiffRow[] {
  const before = flattenPolicy(current, includeAudit);
  const after = flattenPolicy(proposed, includeAudit);
  return [...new Set([...Object.keys(before), ...Object.keys(after)])].flatMap((field) =>
    before[field] === after[field] ? [] : [{ field, before: before[field], after: after[field] }],
  );
}

export function readRuntimeUserBaseline(
  environment: Environment,
  options?: UserScopeOptions,
): {
  baseline: GuiPolicy;
  diagnostics: string[];
} {
  const path = getUserPolicyPath(environment, options);
  if (!existsSync(path)) {
    return {
      baseline: normalizeGuiPolicy(
        (globalThis as Record<string, unknown>).__CC_SAFETY_NET_EMBEDDED_POLICY__,
        environment.home,
      ),
      diagnostics: [],
    };
  }
  const file = readPolicyJson(path);
  return {
    baseline: normalizeGuiPolicy(file.value, environment.home),
    diagnostics:
      file.errors.length > 0 ? file.errors : getUserPolicyDiagnostics(file.value, environment.home),
  };
}

export function readPolicyJson(path: string): { value?: unknown; errors: string[] } {
  if (!existsSync(path)) return { errors: [`${path}: file not found`] };
  try {
    return { value: JSON.parse(readFileSync(path, 'utf-8')) as unknown, errors: [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      errors: [`${path}: ${error instanceof SyntaxError ? `Invalid JSON: ${message}` : message}`],
    };
  }
}

export function buildProjectPolicyFileValue(
  proposalValue: unknown,
  normalized: GuiPolicy,
): Record<string, unknown> {
  const value = isRecord(proposalValue) ? proposalValue : {};
  return {
    version: normalized.version,
    ...Object.fromEntries(
      ['safety', 'workflow', 'destructive_command_protection', 'secret_protection']
        .filter((key) => value[key] !== undefined)
        .map((key) => [key, value[key]]),
    ),
  };
}

function flattenSection(prefix: string, values: Record<string, string | boolean | undefined>) {
  return Object.fromEntries(
    Object.entries(values).flatMap(([key, value]) =>
      value === undefined ? [] : [[`${prefix}.${key}`, String(value)]],
    ),
  ) as Record<string, string>;
}

function flattenList(values: readonly string[]): string {
  return values.length === 0 ? '(none)' : values.join(', ');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
