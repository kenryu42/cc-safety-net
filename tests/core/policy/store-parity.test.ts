import { describe, expect, test } from 'bun:test';
import { clampAuditRetentionDays } from '@/core/policy/audit-retention-days';
import { renderIssuePath } from '@/core/policy/rules-config';
import { getUserPolicySchema } from '@/core/policy/schema';
import {
  DEFAULT_GUI_POLICY,
  projectPolicyProjection,
  salvageUserPolicy,
} from '@/core/policy/store';
import { named, samples, USER_POLICY_VALUES } from './policy-values';

/**
 * The salvage normalizer is the runtime's only acceptance of `policy.json`, and the schema is
 * what `doctor` and `policy check` report with. The two must agree on the outcome — which
 * document is acceptable and which fields it loses — even though they word it differently, so
 * every fixture document and a seeded mutation of it is judged by both. The empty and malformed
 * files of `docs/config-recovery.md` never reach either one and are pinned in `snapshot.test.ts`.
 */

const HOME = '/srv/home/tester';
const DOCUMENTS = samples(USER_POLICY_VALUES);

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** The field paths the schema refuses, spelled the way the drop report spells them. */
function schemaRejectedPaths(value: unknown): Set<string> {
  const parsed = getUserPolicySchema(HOME).safeParse(value);
  if (parsed.success) return new Set();
  return new Set(
    parsed.error.issues.flatMap((issue) =>
      issue.code === 'unrecognized_keys'
        ? issue.keys.map((key) => renderIssuePath([...issue.path, key]))
        : [renderIssuePath(issue.path)],
    ),
  );
}

function valueAt(document: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (current, segment) => (isRecord(current) ? current[segment] : undefined),
      document,
    );
}

/** Whether the field, or a section holding it, was dropped. */
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

describe('the salvage normalizer accepts exactly what the schema accepts', () => {
  test('a document is schema-valid exactly when nothing was dropped', () => {
    for (const document of DOCUMENTS) {
      expect(getUserPolicySchema(HOME).safeParse(document).success, named(document)).toBe(
        salvageUserPolicy(document, HOME).drops.length === 0,
      );
    }
  }, 60_000);

  test('the dropped paths are the paths the schema rejects, each named once', () => {
    for (const document of DOCUMENTS) {
      const paths = salvageUserPolicy(document, HOME).drops.map((drop) => drop.path);
      expect(new Set(paths).size, named(document)).toBe(paths.length);
      expect(new Set(paths), named(document)).toEqual(schemaRejectedPaths(document));
    }
  }, 60_000);

  test('a dropped field falls back to its default and every other field survives', () => {
    for (const document of DOCUMENTS) {
      const salvaged = salvageUserPolicy(document, HOME);
      const dropped = new Set(salvaged.drops.map((drop) => drop.path));
      expect(salvaged.policy.version, named(document)).toBe(1);
      // The one field a drop does not replace with the default: an out-of-range window
      // clamps into range, which `store.test.ts` pins against the documented fallback.
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
