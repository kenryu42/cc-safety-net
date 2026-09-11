import { describe, expect, test } from 'bun:test';
import { clampAuditRetentionDays } from '@/core/policy/audit-retention-days';
import {
  DEFAULT_GUI_POLICY,
  projectPolicyProjection,
  salvageUserPolicy,
} from '@/core/policy/store';
import { getUserPolicyDiagnostics } from '@/core/policy/user-policy-diagnostics';
import { named, samples, USER_POLICY_VALUES } from './policy-values';

const HOME = '/srv/home/tester';
const DOCUMENTS = samples(USER_POLICY_VALUES);

const NOT_A_JSON_OBJECT: [readonly string[], readonly string[]] = [
  ['Config must be an object'],
  [''],
];

const VERDICTS: readonly [readonly string[], readonly string[]][] = [
  [[], []],
  [[], []],
  [[], []],
  [[], []],
  [['version must be 1'], ['version']],
  [['version must be 1'], ['version']],
  [['version must be 1'], ['version']],
  [['version must be 1'], ['version']],
  [['safety must be an object if provided'], ['safety']],
  [['safety must be an object if provided'], ['safety']],
  [['safety must be an object if provided'], ['safety']],
  [['safety.level must be "standard", "strict", or "paranoid"'], ['safety.level']],
  [
    [
      'safety.level must be "standard", "strict", or "paranoid"',
      'safety.overrides must be an object if provided',
    ],
    ['safety.overrides', 'safety.level'],
  ],
  [['safety.overrides must be an object if provided'], ['safety.overrides']],
  [['safety.overrides.fail_closed must be a boolean'], ['safety.overrides.fail_closed']],
  [
    [
      'safety.overrides.paranoid_rm must be a boolean',
      'safety.overrides.paranoid_interpreters must be a boolean',
      'safety.overrides.unknown field "tighten"',
    ],
    [
      'safety.overrides.tighten',
      'safety.overrides.paranoid_rm',
      'safety.overrides.paranoid_interpreters',
    ],
  ],
  [['safety.unknown field "tier"'], ['safety.tier']],
  [['workflow must be an object if provided'], ['workflow']],
  [['workflow must be an object if provided'], ['workflow']],
  [
    ['workflow.unknown field "branch"', 'workflow.worktree_mode must be a boolean'],
    ['workflow.branch', 'workflow.worktree_mode'],
  ],
  [
    ['destructive_command_protection must be an object if provided'],
    ['destructive_command_protection'],
  ],
  [
    ['destructive_command_protection must be an object if provided'],
    ['destructive_command_protection'],
  ],
  [
    ['destructive_command_protection.enabled must be a boolean'],
    ['destructive_command_protection.enabled'],
  ],
  [
    ['destructive_command_protection.overrides must be an object if provided'],
    ['destructive_command_protection.overrides'],
  ],
  [
    [
      'unknown destructive command rule id "git.no-such-rule"',
      'destructive_command_protection.overrides.git.alias-config must be "on" or "off"',
    ],
    [
      'destructive_command_protection.overrides.git.no-such-rule',
      'destructive_command_protection.overrides.git.alias-config',
    ],
  ],
  [
    ['destructive_command_protection.allow_paths must be an array of paths'],
    ['destructive_command_protection.allow_paths'],
  ],
  [
    [
      'destructive_command_protection.allow_paths[0] must be a non-empty path string',
      'destructive_command_protection.allow_paths[2] must be an absolute path or start with ~/',
      'destructive_command_protection.allow_paths[3] cannot be the home directory',
      'destructive_command_protection.allow_paths[4] cannot contain the home directory',
      'destructive_command_protection.allow_paths[1] must be a non-empty path string',
    ],
    [
      'destructive_command_protection.allow_paths[0]',
      'destructive_command_protection.allow_paths[1]',
      'destructive_command_protection.allow_paths[2]',
      'destructive_command_protection.allow_paths[3]',
      'destructive_command_protection.allow_paths[4]',
    ],
  ],
  [
    [
      'destructive_command_protection.unknown field "keep"',
      'destructive_command_protection.allow_paths[0] must be an absolute path or start with ~/',
    ],
    ['destructive_command_protection.keep', 'destructive_command_protection.allow_paths[0]'],
  ],
  [['secret_protection must be an object if provided'], ['secret_protection']],
  [['secret_protection must be an object if provided'], ['secret_protection']],
  [
    [
      'secret_protection.enabled must be a boolean',
      'secret_protection.overrides must be an object if provided',
    ],
    ['secret_protection.enabled', 'secret_protection.overrides'],
  ],
  [
    [
      'unknown secret protection rule id "secret.nope"',
      'secret_protection.overrides.secret.basename.env must be "on" or "off"',
    ],
    ['secret_protection.overrides.secret.nope', 'secret_protection.overrides.secret.basename.env'],
  ],
  [['secret_protection.deny_paths must be an array of paths'], ['secret_protection.deny_paths']],
  [
    [
      'secret_protection.deny_paths[0] cannot be the home directory or a path above it (this would block every command the agent runs)',
      'secret_protection.deny_paths[1] cannot be the home directory or a path above it (this would block every command the agent runs)',
      'secret_protection.deny_paths[2] cannot be the home directory or a path above it (this would block every command the agent runs)',
      'secret_protection.deny_paths[3] must be a non-empty path string',
      'secret_protection.deny_paths[4] must be a non-empty path string',
    ],
    [
      'secret_protection.deny_paths[0]',
      'secret_protection.deny_paths[1]',
      'secret_protection.deny_paths[2]',
      'secret_protection.deny_paths[3]',
      'secret_protection.deny_paths[4]',
    ],
  ],
  [
    [
      'secret_protection.allow_paths[0] cannot contain glob characters (* or ?); list the exact file or directory',
      "secret_protection.allow_paths[1] cannot cover the guard's own configuration",
    ],
    ['secret_protection.allow_paths[0]', 'secret_protection.allow_paths[1]'],
  ],
  [
    [
      'secret_protection.allow_paths[0] cannot cover the home directory or a path above it (this would disable secret protection everywhere)',
    ],
    ['secret_protection.allow_paths[0]'],
  ],
  [['audit must be an object if provided'], ['audit']],
  [['audit must be an object if provided'], ['audit']],
  [['audit.retention_days must be an integer between 1 and 365'], ['audit.retention_days']],
  [[], []],
  [[], []],
  [['audit.retention_days must be an integer between 1 and 365'], ['audit.retention_days']],
  [['audit.retention_days must be an integer between 1 and 365'], ['audit.retention_days']],
  [['audit.retention_days must be an integer between 1 and 365'], ['audit.retention_days']],
  [['audit.retention_days must be an integer between 1 and 365'], ['audit.retention_days']],
  [['audit.unknown field "scope"'], ['audit.scope']],
  [
    ['unknown field "telemetry"', 'unknown field "notes"'],
    ['telemetry', 'notes'],
  ],
  [
    [
      'destructive_command_protection.overrides.git.checkout-force must be "on" or "off"',
      'destructive_command_protection.allow_paths[0] must be an absolute path or start with ~/',
      'secret_protection.unknown field "extra"',
      'secret_protection.allow_paths[0] must be a non-empty path string',
      'secret_protection.enabled must be a boolean',
      'secret_protection.deny_paths[0] cannot be the home directory or a path above it (this would block every command the agent runs)',
    ],
    [
      'secret_protection.extra',
      'destructive_command_protection.overrides.git.checkout-force',
      'destructive_command_protection.allow_paths[0]',
      'secret_protection.enabled',
      'secret_protection.deny_paths[0]',
      'secret_protection.allow_paths[0]',
    ],
  ],
  [
    [
      'unknown field "stray"',
      'version must be 1',
      'safety.level must be "standard", "strict", or "paranoid"',
      'safety.overrides.fail_closed must be a boolean',
      'workflow.worktree_mode must be a boolean',
      'destructive_command_protection.enabled must be a boolean',
      'destructive_command_protection.allow_paths[0] must be a non-empty path string',
      'secret_protection.enabled must be a boolean',
      'secret_protection.deny_paths must be an array of paths',
      'audit.retention_days must be an integer between 1 and 365',
    ],
    [
      'version',
      'stray',
      'safety.level',
      'safety.overrides.fail_closed',
      'workflow.worktree_mode',
      'destructive_command_protection.enabled',
      'destructive_command_protection.allow_paths[0]',
      'secret_protection.enabled',
      'secret_protection.deny_paths',
      'audit.retention_days',
    ],
  ],
  NOT_A_JSON_OBJECT,
  NOT_A_JSON_OBJECT,
  NOT_A_JSON_OBJECT,
  NOT_A_JSON_OBJECT,
  NOT_A_JSON_OBJECT,
  NOT_A_JSON_OBJECT,
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function valueAt(document: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (current, segment) => (isRecord(current) ? current[segment] : undefined),
      document,
    );
}

function dropsCovering(dropped: ReadonlySet<string>, path: string): boolean {
  const segments = path.split('.');
  return ['', ...segments.map((_segment, index) => segments.slice(0, index + 1).join('.'))].some(
    (prefix) => dropped.has(prefix),
  );
}

const SCALAR_FIELDS = [
  'safety.level',
  'safety.overrides.fail_closed',
  'safety.overrides.paranoid_rm',
  'safety.overrides.paranoid_interpreters',
  'workflow.worktree_mode',
  'destructive_command_protection.enabled',
  'secret_protection.enabled',
];

const RECORD_FIELDS = ['destructive_command_protection.overrides', 'secret_protection.overrides'];

const ARRAY_FIELDS = [
  'destructive_command_protection.allow_paths',
  'secret_protection.deny_paths',
  'secret_protection.allow_paths',
];

describe('the salvage normalizer and the diagnostics judge each document alike', () => {
  test('every fixture document has a stated verdict', () => {
    expect(VERDICTS.length).toBe(USER_POLICY_VALUES.length);
  });

  test.each(
    VERDICTS.map(
      (verdict, index) =>
        [named(USER_POLICY_VALUES[index]), USER_POLICY_VALUES[index], ...verdict] as const,
    ),
  )('%s', (_name, document, diagnostics, dropPaths) => {
    expect(getUserPolicyDiagnostics(document, HOME)).toEqual([...diagnostics]);
    expect(salvageUserPolicy(document, HOME).drops.map((drop) => drop.path)).toEqual([
      ...dropPaths,
    ]);
  });

  test('a dropped field falls back to its default and every other field survives', () => {
    for (const document of DOCUMENTS) {
      const salvaged = salvageUserPolicy(document, HOME);
      const dropped = new Set(salvaged.drops.map((drop) => drop.path));
      expect(salvaged.policy.version, named(document)).toBe(1);
      expect(salvaged.policy.audit.retention_days, named(document)).toBe(
        clampAuditRetentionDays(valueAt(document, 'audit.retention_days')),
      );
      for (const field of SCALAR_FIELDS) {
        expect(valueAt(salvaged.policy, field), `${field} of ${named(document)}`).toEqual(
          dropsCovering(dropped, field)
            ? valueAt(DEFAULT_GUI_POLICY, field)
            : (valueAt(document, field) ?? valueAt(DEFAULT_GUI_POLICY, field)),
        );
      }
      for (const field of RECORD_FIELDS) {
        const written = valueAt(document, field);
        expect(valueAt(salvaged.policy, field), `${field} of ${named(document)}`).toEqual(
          dropsCovering(dropped, field) || !isRecord(written)
            ? {}
            : Object.fromEntries(
                Object.entries(written).filter(([id]) => !dropped.has(`${field}.${id}`)),
              ),
        );
      }
      for (const field of ARRAY_FIELDS) {
        const written = valueAt(document, field);
        expect(valueAt(salvaged.policy, field), `${field} of ${named(document)}`).toEqual(
          dropsCovering(dropped, field) || !Array.isArray(written)
            ? []
            : written.filter((_entry, index) => !dropped.has(`${field}[${index}]`)),
        );
      }
    }
  }, 60_000);

  test('the project projection carries nothing the drop report rejected', () => {
    for (const document of DOCUMENTS) {
      const dropped = new Set(salvageUserPolicy(document, HOME).drops.map((drop) => drop.path));
      const projection = projectPolicyProjection(document, HOME).policy;
      for (const field of SCALAR_FIELDS.filter((candidate) => dropsCovering(dropped, candidate))) {
        expect(valueAt(projection, field), `${field} of ${named(document)}`).toBeUndefined();
      }
    }
  }, 60_000);

  test('a document that is not a JSON object is replaced whole', () => {
    for (const document of ['policy', 42, true, null, [], ['version']]) {
      const salvaged = salvageUserPolicy(document, HOME);
      expect(salvaged.drops, named(document)).toEqual([{ path: '', reason: 'not a JSON object' }]);
      expect(salvaged.policy, named(document)).toEqual(DEFAULT_GUI_POLICY);
    }
  });
});

describe('the documented recovery cases, section by section', () => {
  test('an unknown field in an otherwise readable policy.json drops only that field', () => {
    const salvaged = salvageUserPolicy(
      { version: 1, tier: 'gold', safety: { level: 'strict' } },
      HOME,
    );
    expect(salvaged.drops).toEqual([{ path: 'tier', reason: 'unknown field' }]);
    expect(salvaged.policy.safety).toEqual({ level: 'strict', overrides: {} });
  });

  test('every invalid recognized field is named and falls back to its protective default', () => {
    const salvaged = salvageUserPolicy(
      {
        version: 1,
        safety: { level: 'stricter' },
        workflow: { worktree_mode: 'x' },
        destructive_command_protection: {
          enabled: 'yes',
          overrides: { 'git.no-such-rule': 'off', 'git.alias-config': 'sometimes' },
          allow_paths: ['~', 'rel', 42],
        },
        secret_protection: { deny_paths: ['~'] },
        audit: { retention_days: 0 },
      },
      HOME,
    );
    expect(salvaged.drops).toEqual([
      { path: 'safety.level', reason: 'not one of standard, strict, paranoid' },
      { path: 'workflow.worktree_mode', reason: 'not a boolean' },
      { path: 'destructive_command_protection.enabled', reason: 'not a boolean' },
      {
        path: 'destructive_command_protection.overrides.git.no-such-rule',
        reason: 'unknown rule id',
      },
      {
        path: 'destructive_command_protection.overrides.git.alias-config',
        reason: 'not "on" or "off"',
      },
      {
        path: 'destructive_command_protection.allow_paths[0]',
        reason: 'cannot be the home directory',
      },
      {
        path: 'destructive_command_protection.allow_paths[1]',
        reason: 'must be an absolute path or start with ~/',
      },
      {
        path: 'destructive_command_protection.allow_paths[2]',
        reason: 'must be a non-empty path string',
      },
      {
        path: 'secret_protection.deny_paths[0]',
        reason:
          'cannot be the home directory or a path above it (this would block every command the agent runs)',
      },
      { path: 'audit.retention_days', reason: 'not an integer between 1 and 365' },
    ]);
    expect(salvaged.policy).toEqual({
      ...DEFAULT_GUI_POLICY,
      audit: { retention_days: 1 },
    });
  });

  test('the project projection keeps its valid fields and reports only its audit section', () => {
    const projected = projectPolicyProjection(
      { version: 1, tier: 'gold', safety: { level: 'strict', overrides: { fail_closed: 'yes' } } },
      HOME,
    );
    expect(projected.policy).toEqual({ safety: { level: 'strict' } });
    expect(projected.diagnostics).toEqual([]);
    expect(projectPolicyProjection({ version: 1, audit: { retention_days: 5 } }, HOME)).toEqual({
      policy: {},
      diagnostics: ['project policy audit settings are ignored; audit is user scope only'],
    });
  });
});
