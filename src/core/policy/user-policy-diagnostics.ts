import { DESTRUCTIVE_COMMAND_RULE_ID_SET } from '@/core/rules/destructive';
import { SECRET_PROTECTION_RULE_ID_SET } from '@/core/rules/secret';
import {
  getDestructiveAllowPathError,
  getSecretAllowPathError,
  getSecretDenyPathError,
} from './allow-paths';
import { MAX_AUDIT_RETENTION_DAYS, MIN_AUDIT_RETENTION_DAYS } from './audit-retention-days';
import { custom, formatIssues, type Issue, sortIssues, typed } from './rules-config';

const USER_POLICY_FIELDS = [
  'version',
  'safety',
  'workflow',
  'destructive_command_protection',
  'secret_protection',
  'audit',
];
const SAFETY_LEVELS = ['standard', 'strict', 'paranoid'];
const NOT_AN_OBJECT = 'must be an object if provided';
const AUDIT_RETENTION_ERROR = `must be an integer between ${MIN_AUDIT_RETENTION_DAYS} and ${MAX_AUDIT_RETENTION_DAYS}`;

export function getUserPolicyDiagnostics(config: unknown, home: string): string[] {
  return formatIssues(
    sortIssues(
      userPolicyIssues(config, home),
      USER_POLICY_FIELDS,
      (issue) => issue.kind === 'custom',
    ),
    ' ',
    ' ',
  );
}

function userPolicyIssues(config: unknown, home: string): Issue[] {
  if (!isRecord(config)) return [typed([], 'Config must be an object')];
  return [
    ...(config.version === 1 ? [] : [typed(['version'], 'must be 1')]),
    ...section(config.safety, ['safety'], ['level', 'overrides'], (safety) => [
      ...(safety.level === undefined ||
      (typeof safety.level === 'string' && SAFETY_LEVELS.includes(safety.level))
        ? []
        : [typed(['safety', 'level'], `must be "standard", "strict", or "paranoid"`)]),
      ...section(safety.overrides, ['safety', 'overrides'], SAFETY_OVERRIDE_FIELDS, (overrides) =>
        SAFETY_OVERRIDE_FIELDS.flatMap((field) =>
          booleanIssues(overrides[field], ['safety', 'overrides', field]),
        ),
      ),
    ]),
    ...section(config.workflow, ['workflow'], ['worktree_mode'], (workflow) =>
      booleanIssues(workflow.worktree_mode, ['workflow', 'worktree_mode']),
    ),
    ...section(
      config.destructive_command_protection,
      ['destructive_command_protection'],
      ['enabled', 'overrides', 'allow_paths'],
      (protection) => [
        ...booleanIssues(protection.enabled, ['destructive_command_protection', 'enabled']),
        ...overrideIssues(
          protection.overrides,
          ['destructive_command_protection', 'overrides'],
          DESTRUCTIVE_COMMAND_RULE_ID_SET,
          'destructive command',
        ),
        ...pathIssues(
          protection.allow_paths,
          ['destructive_command_protection', 'allow_paths'],
          getDestructiveAllowPathError,
          home,
        ),
      ],
    ),
    ...section(
      config.secret_protection,
      ['secret_protection'],
      ['enabled', 'overrides', 'deny_paths', 'allow_paths'],
      (protection) => [
        ...booleanIssues(protection.enabled, ['secret_protection', 'enabled']),
        ...overrideIssues(
          protection.overrides,
          ['secret_protection', 'overrides'],
          SECRET_PROTECTION_RULE_ID_SET,
          'secret protection',
        ),
        ...pathIssues(
          protection.deny_paths,
          ['secret_protection', 'deny_paths'],
          getSecretDenyPathError,
          home,
        ),
        ...pathIssues(
          protection.allow_paths,
          ['secret_protection', 'allow_paths'],
          getSecretAllowPathError,
          home,
        ),
      ],
    ),
    ...section(config.audit, ['audit'], ['retention_days'], (audit) =>
      isRetentionWindow(audit.retention_days)
        ? []
        : [typed(['audit', 'retention_days'], AUDIT_RETENTION_ERROR)],
    ),
    ...Object.keys(config)
      .filter((key) => !USER_POLICY_FIELDS.includes(key))
      .map((key) => unknownKey([], key)),
  ];
}

const SAFETY_OVERRIDE_FIELDS = ['fail_closed', 'paranoid_rm', 'paranoid_interpreters'];

function section(
  value: unknown,
  path: readonly PropertyKey[],
  known: readonly string[],
  fields: (record: Record<string, unknown>) => Issue[],
): Issue[] {
  if (value === undefined) return [];
  if (!isRecord(value)) return [typed(path, NOT_AN_OBJECT)];
  return [
    ...fields(value),
    ...Object.keys(value)
      .filter((key) => !known.includes(key))
      .map((key) => unknownKey(path, key)),
  ];
}

function booleanIssues(value: unknown, path: readonly PropertyKey[]): Issue[] {
  return value === undefined || typeof value === 'boolean'
    ? []
    : [typed(path, 'must be a boolean')];
}

function overrideIssues(
  value: unknown,
  path: readonly PropertyKey[],
  knownIds: ReadonlySet<string>,
  label: string,
): Issue[] {
  if (value === undefined) return [];
  if (!isRecord(value)) return [typed(path, NOT_AN_OBJECT)];
  return [
    ...Object.keys(value)
      .filter((id) => !knownIds.has(id))
      .map(
        (id): Issue => ({
          path: [...path, id],
          message: `unknown ${label} rule id "${id}"`,
          kind: 'key',
        }),
      ),
    ...Object.keys(value)
      .filter((id) => value[id] !== 'on' && value[id] !== 'off')
      .map((id) => typed([...path, id], 'must be "on" or "off"')),
  ];
}

function pathIssues(
  value: unknown,
  path: readonly PropertyKey[],
  getPathError: (value: unknown, home: string) => string | null,
  home: string,
): Issue[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return [typed(path, 'must be an array of paths')];
  return value.flatMap((entry, index) => {
    if (typeof entry !== 'string') {
      return [typed([...path, index], 'must be a non-empty path string')];
    }
    const error = getPathError(entry, home);
    return error === null ? [] : [custom([...path, index], error)];
  });
}

function isRetentionWindow(value: unknown): boolean {
  if (value === undefined) return true;
  if (typeof value !== 'number' || !Number.isInteger(value)) return false;
  return value >= MIN_AUDIT_RETENTION_DAYS && value <= MAX_AUDIT_RETENTION_DAYS;
}

const unknownKey = (path: readonly PropertyKey[], key: string): Issue => ({
  path,
  message: key,
  kind: 'unknownKeys',
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
