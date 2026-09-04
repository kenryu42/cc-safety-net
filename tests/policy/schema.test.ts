import { describe, expect, test } from 'bun:test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, parse } from 'node:path';
import * as z from 'zod';
import {
  getRulesConfigDiagnostics,
  getRulesConfigSchema,
  getUserPolicyDiagnostics,
  getUserPolicySchema,
} from '@/policy/schema';
import { loadPolicySnapshot } from '@/policy/snapshot';
import { readRulesConfig, validateRulesConfig } from '@/rules/policy/config-file';
import { withTempDir } from '../helpers';

const SOURCE_LIMIT_ERROR = "Rule config exceeds CC Safety Net's safe source limit.";
const HOST_ROOT = parse(homedir()).root;

function expectOnlyAuthoritativeSourceLimit(input: unknown): void {
  const result = getRulesConfigSchema().safeParse(input);
  expect(result.success).toBe(false);
  if (result.success) throw new Error('expected authoritative source limit failure');
  expect(result.error.issues.map((issue) => issue.message)).toEqual([SOURCE_LIMIT_ERROR]);
  expect(JSON.stringify(result.error.issues)).not.toContain('TOPSECRET');
}

describe('configuration schemas', () => {
  test('accepts the existing permissive rule config surface', () => {
    const input = {
      $schema: 'https://example.test/schema.json',
      version: 1,
      rules: [],
      overrides: {
        'team/block-prune': {
          reason: 'Use targeted cleanup.',
          intent: 'scope_down',
          future_field: true,
        },
      },
      transparent_wrappers: ['rtk'],
      future_field: true,
    };

    expect(getRulesConfigSchema().safeParse(input).success).toBeTrue();
    expect(getRulesConfigDiagnostics(input)).toEqual([]);
  });

  test.each([
    42,
    { editor: 'legacy' },
  ])('keeps non-string $schema metadata permissive across validation and reads', async ($schema) => {
    const input = { $schema, version: 1, rules: ['project-rules'] };

    expect(getRulesConfigSchema().safeParse(input).success).toBeTrue();
    expect(validateRulesConfig(input)).toEqual({
      errors: [],
      sources: new Set(['project-rules']),
    });
    await withTempDir('cc-safety-net-schema-metadata-', (cwd) => {
      const path = join(cwd, 'rule.json');
      writeFileSync(path, JSON.stringify(input));
      expect(readRulesConfig(path)).toEqual({
        config: {
          version: 1,
          rules: ['project-rules'],
          overrides: {},
          transparent_wrappers: [],
        },
        errors: [],
      });
    });
  });

  test('keeps stable rule config diagnostics', () => {
    expect(
      getRulesConfigDiagnostics({
        version: 2,
        rules: ['bad source!', '', 'project-rules', 'project-rules'],
        overrides: {
          missing: {},
          'project-rules/block-prune': { reason: '' },
          'project-rules/bad-intent': { reason: 'No.', intent: 'retry_forever' },
        },
        transparent_wrappers: ['rtk', 'bad command', 'rtk', 1],
      }),
    ).toEqual([
      'version must be 1',
      'rules[0]: Local rulebook sources must be bare names matching /^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/: bad source!',
      'rules[1]: must be a non-empty rulebook source string',
      'rules[3]: duplicate rulebook source "project-rules"',
      'overrides.missing: must use <rulebook-name>/<rule-name>',
      'overrides.missing.reason: required non-empty string',
      'overrides.project-rules/block-prune.reason: required non-empty string',
      'overrides.project-rules/bad-intent.intent: must be one of hard_stop, use_alternative, scope_down, manual_only, stop_and_explain',
      'transparent_wrappers[1]: must match command pattern',
      'transparent_wrappers[2]: duplicate command "rtk"',
      'transparent_wrappers[3]: must be a command string',
    ]);
  });

  test('rejects a whitespace-only rulebook source at its array position', () => {
    expect(getRulesConfigDiagnostics({ version: 1, rules: ['   '] })).toEqual([
      'rules[0]: must be a non-empty rulebook source string',
    ]);
  });

  test('discovers valid sources independently from unrelated config errors', () => {
    expect(
      validateRulesConfig({
        version: 2,
        rules: ['project-rules', 'bad source!'],
        transparent_wrappers: ['git'],
      }),
    ).toEqual({
      errors: [
        'version must be 1',
        'rules[1]: Local rulebook sources must be bare names matching /^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/: bad source!',
        'transparent_wrappers[0]: reserved command "git" cannot be a wrapper',
      ],
      sources: new Set(['project-rules']),
    });
  });

  test('rejects malformed override keys in the authoritative schema', () => {
    const input = {
      version: 1,
      rules: [],
      overrides: { malformed: 'off' },
    };

    expect(getRulesConfigSchema().safeParse(input).success).toBeFalse();
    expect(validateRulesConfig(input).errors).toEqual([
      'overrides.malformed: must use <rulebook-name>/<rule-name>',
    ]);
    expect(
      getRulesConfigSchema().safeParse({
        version: 1,
        rules: [],
        overrides: { 'team/block-prune': 'off' },
      }).success,
    ).toBeTrue();
  });

  test('enforces source, wrapper, and policy refinements in the authoritative schemas', () => {
    expect(
      getRulesConfigSchema().safeParse({
        version: 1,
        rules: ['bad source!', 'team-rules', 'team-rules'],
        transparent_wrappers: ['rtk', 'rtk', 'git'],
      }).success,
    ).toBeFalse();
    expect(
      getUserPolicySchema().safeParse({
        version: 1,
        destructive_command_protection: { overrides: { unknown: 'off' } },
        secret_protection: { overrides: { unknown: 'off' }, deny_paths: [' '] },
      }).success,
    ).toBeFalse();
    expect(
      getUserPolicySchema().safeParse({
        version: 1,
        secret_protection: { overrides: { 'secret.dir.secrets': 'off' } },
      }).success,
    ).toBeFalse();
  });

  test('keeps user policy strict with stable diagnostics', () => {
    const input = {
      version: 1,
      safety: { level: 'standard', extra: true },
      workflow: { worktree_mode: 'yes' },
      extra: true,
    };

    expect(getUserPolicySchema().safeParse(input).success).toBeFalse();
    expect(getUserPolicyDiagnostics(input)).toEqual([
      'unknown field "extra"',
      'safety.unknown field "extra"',
      'workflow.worktree_mode must be a boolean',
    ]);
  });

  test('validates destructive command allow paths', () => {
    const allowPolicy = (allow_paths: unknown) => ({
      version: 1,
      destructive_command_protection: { allow_paths },
    });

    expect(
      getUserPolicyDiagnostics(allowPolicy(['~/sandbox', join(HOST_ROOT, 'opt', 'scratch')])),
    ).toEqual([]);
    expect(getUserPolicyDiagnostics(allowPolicy('~/sandbox'))).toEqual([
      'destructive_command_protection.allow_paths must be an array of paths',
    ]);
    expect(getUserPolicyDiagnostics(allowPolicy([' ', 42]))).toEqual([
      'destructive_command_protection.allow_paths[0] must be a non-empty path string',
      'destructive_command_protection.allow_paths[1] must be a non-empty path string',
    ]);
    expect(getUserPolicyDiagnostics(allowPolicy(['relative/path', '$HOME/sandbox']))).toEqual([
      'destructive_command_protection.allow_paths[0] must be an absolute path or start with ~/',
      'destructive_command_protection.allow_paths[1] must be an absolute path or start with ~/',
    ]);
    expect(getUserPolicyDiagnostics(allowPolicy(['~', homedir()]))).toEqual([
      'destructive_command_protection.allow_paths[0] cannot be the home directory',
      'destructive_command_protection.allow_paths[1] cannot be the home directory',
    ]);
    expect(getUserPolicyDiagnostics(allowPolicy([HOST_ROOT, dirname(homedir())]))).toEqual([
      'destructive_command_protection.allow_paths[0] cannot contain the home directory',
      'destructive_command_protection.allow_paths[1] cannot contain the home directory',
    ]);
    expect(getUserPolicySchema().safeParse(allowPolicy(['~'])).success).toBeFalse();
    expect(getUserPolicySchema().safeParse(allowPolicy(['~/sandbox'])).success).toBeTrue();
  });

  test('rejects allow paths that would cover catastrophic root or home targets', () => {
    const allowPolicy = (allow_paths: string[]) => ({
      version: 1,
      destructive_command_protection: { allow_paths },
    });

    expect(getUserPolicySchema().safeParse(allowPolicy([HOST_ROOT])).success).toBeFalse();
    expect(getUserPolicySchema().safeParse(allowPolicy([homedir()])).success).toBeFalse();
  });

  test('validates secret protection deny paths', () => {
    const denyPolicy = (deny_paths: unknown) => ({
      version: 1,
      secret_protection: { deny_paths },
    });
    const blocksEverything =
      'cannot be the home directory or a path above it (this would block every command the agent runs)';

    expect(
      getUserPolicyDiagnostics(
        denyPolicy([
          'protected',
          'server.pem',
          '~/documents/private',
          join(HOST_ROOT, 'opt', 'secrets'),
        ]),
      ),
    ).toEqual([]);
    expect(getUserPolicyDiagnostics(denyPolicy('protected'))).toEqual([
      'secret_protection.deny_paths must be an array of paths',
    ]);
    expect(getUserPolicyDiagnostics(denyPolicy([' ', 42]))).toEqual([
      'secret_protection.deny_paths[0] must be a non-empty path string',
      'secret_protection.deny_paths[1] must be a non-empty path string',
    ]);
    expect(getUserPolicyDiagnostics(denyPolicy(['~', homedir(), '$HOME', '${HOME}']))).toEqual([
      `secret_protection.deny_paths[0] ${blocksEverything}`,
      `secret_protection.deny_paths[1] ${blocksEverything}`,
      `secret_protection.deny_paths[2] ${blocksEverything}`,
      `secret_protection.deny_paths[3] ${blocksEverything}`,
    ]);
    expect(
      getUserPolicyDiagnostics(denyPolicy([HOST_ROOT, dirname(homedir()), '$HOME/..'])),
    ).toEqual([
      `secret_protection.deny_paths[0] ${blocksEverything}`,
      `secret_protection.deny_paths[1] ${blocksEverything}`,
      `secret_protection.deny_paths[2] ${blocksEverything}`,
    ]);
    expect(getUserPolicySchema().safeParse(denyPolicy(['~'])).success).toBeFalse();
    expect(
      getUserPolicySchema().safeParse(denyPolicy(['protected', '~/documents/private'])).success,
    ).toBeTrue();
  });

  test('preserves accepted deny path whitespace through schema and snapshot loading', async () => {
    const input = {
      version: 1 as const,
      secret_protection: { deny_paths: [' private/token.txt '] },
    };
    expect(getUserPolicySchema().parse(input).secret_protection?.deny_paths).toEqual([
      ' private/token.txt ',
    ]);

    await withTempDir('cc-safety-net-schema-deny-path-', (cwd) => {
      const userConfigDir = join(cwd, 'user', 'rules');
      mkdirSync(dirname(userConfigDir), { recursive: true });
      writeFileSync(join(dirname(userConfigDir), 'policy.json'), JSON.stringify(input));

      expect(loadPolicySnapshot({ cwd, userConfigDir }).policy.secretProtection.denyPaths).toEqual([
        ' private/token.txt ',
      ]);
    });
  });

  test('generates a permissive rule schema with intent', () => {
    const schema = z.toJSONSchema(getRulesConfigSchema(), { io: 'input', target: 'draft-7' }) as {
      additionalProperties?: unknown;
      required?: string[];
      properties?: {
        $schema?: { description?: string };
        overrides?: {
          propertyNames?: { pattern?: string };
        };
        rules?: { default?: unknown; maxItems?: number };
      };
    };
    const serialized = JSON.stringify(schema);

    expect(schema.additionalProperties).toEqual({});
    expect(schema.required).toEqual(['version']);
    expect(getRulesConfigSchema().parse({ version: 1 }).rules).toEqual([]);
    expect(schema.properties?.$schema?.description).toBe('JSON Schema reference for IDE support');
    expect(schema.properties?.overrides?.propertyNames?.pattern).toBe('^[^/]+\\/[^/]+$');
    expect(schema.properties?.rules?.default).toEqual([]);
    expect(schema.properties?.rules?.maxItems).toBe(64);
    expect(serialized).toContain('intent');
    expect(serialized).toContain('scope_down');
  });

  test('bounds rulebook sources before inspecting their contents', () => {
    const rules = [...Array.from({ length: 64 }, (_, index) => `rulebook-${index}`), 'TOPSECRET'];
    const input = {
      version: 2,
      rules,
      transparent_wrappers: ['git'],
    };

    expect(
      getRulesConfigSchema().safeParse({ version: 1, rules: rules.slice(0, 64) }).success,
    ).toBe(true);
    expectOnlyAuthoritativeSourceLimit({ version: 1, rules });
    const authoritativeWithUnrelatedError = getRulesConfigSchema().safeParse(input);
    expect(authoritativeWithUnrelatedError.success).toBe(false);
    if (authoritativeWithUnrelatedError.success) {
      throw new Error('expected authoritative source and version failures');
    }
    expect(authoritativeWithUnrelatedError.error.issues.map((issue) => issue.message)).toEqual([
      'Invalid input: expected 1',
      SOURCE_LIMIT_ERROR,
    ]);
    expect(validateRulesConfig(input)).toEqual({
      errors: [
        'version must be 1',
        SOURCE_LIMIT_ERROR,
        'transparent_wrappers[0]: reserved command "git" cannot be a wrapper',
      ],
      sources: new Set(),
    });
    expect(JSON.stringify(validateRulesConfig(input))).not.toContain('TOPSECRET');
  });

  test.each([
    { TOPSECRET: 'object tail' },
    42,
    null,
  ])('short-circuits authoritative source validation before malformed tail %p', (tail) => {
    const input = {
      version: 1,
      rules: [...Array.from({ length: 64 }, (_, index) => `rulebook-${index}`), tail],
    };
    expectOnlyAuthoritativeSourceLimit(input);
    expect(validateRulesConfig(input)).toEqual({
      errors: [SOURCE_LIMIT_ERROR],
      sources: new Set(),
    });
  });

  test('keeps authoritative Zod acceptance in parity with deterministic legacy diagnostics', () => {
    const rulesFields = [undefined, [], ['project-rules'], ['bad source!'], 'project-rules'];
    const overrideFields = [
      undefined,
      {},
      { 'team/block-prune': 'off' },
      { malformed: 'off' },
      { 'team/block-prune': { reason: '', intent: 'retry_forever' } },
    ];
    const wrapperFields = [undefined, [], ['rtk'], ['git'], ['rtk', 'rtk'], [1]];
    for (const version of [1, 2, undefined]) {
      for (const rules of rulesFields) {
        for (const overrides of overrideFields) {
          for (const transparent_wrappers of wrapperFields) {
            const input = { version, rules, overrides, transparent_wrappers };
            expect(getRulesConfigSchema().safeParse(input).success).toBe(
              getRulesConfigDiagnostics(input).length === 0,
            );
          }
        }
      }
    }

    const safetyFields = [undefined, {}, { level: 'standard' }, { level: 'unsafe' }, 'standard'];
    const workflowFields = [undefined, {}, { worktree_mode: true }, { worktree_mode: 'yes' }];
    const secretFields = [
      undefined,
      {},
      { enabled: true, deny_paths: ['private/token'] },
      { overrides: { unknown: 'off' } },
      { deny_paths: [' '] },
      { deny_paths: ['~'] },
      { deny_paths: [HOST_ROOT, 'private/token'] },
      { deny_paths: ['$HOME'] },
    ];
    const destructiveFields = [
      undefined,
      {},
      { enabled: 'yes' },
      { overrides: { unknown: 'off' } },
      { overrides: { 'git.ssh-env': 'maybe' } },
      { allow_paths: '~/sandbox' },
      { allow_paths: [42] },
      { allow_paths: [HOST_ROOT] },
      { allow_paths: [homedir()] },
    ];
    for (const version of [1, 2, undefined]) {
      for (const safety of safetyFields) {
        for (const workflow of workflowFields) {
          for (const secret_protection of secretFields) {
            for (const destructive_command_protection of destructiveFields) {
              const input = {
                version,
                safety,
                workflow,
                secret_protection,
                destructive_command_protection,
              };
              expect(getUserPolicySchema().safeParse(input).success).toBe(
                getUserPolicyDiagnostics(input).length === 0,
              );
            }
          }
        }
      }
    }
  });
});

test('validates secret protection allow paths', () => {
  const allowPolicy = (allow_paths: unknown) => ({
    version: 1,
    secret_protection: { allow_paths },
  });
  const disablesEverything =
    'cannot cover the home directory or a path above it (this would disable secret protection everywhere)';
  const noGlobs = 'cannot contain glob characters (* or ?); list the exact file or directory';

  expect(
    getUserPolicyDiagnostics(
      allowPolicy(['.env.test', '~/projects/vulcan', join(HOST_ROOT, 'opt', 'fixtures')]),
    ),
  ).toEqual([]);
  expect(
    getUserPolicyDiagnostics(allowPolicy(['**/.env.test', 'apps/*/.env.test', '.env.v?'])),
  ).toEqual([
    `secret_protection.allow_paths[0] ${noGlobs}`,
    `secret_protection.allow_paths[1] ${noGlobs}`,
    `secret_protection.allow_paths[2] ${noGlobs}`,
  ]);
  expect(getUserPolicyDiagnostics(allowPolicy('.env.test'))).toEqual([
    'secret_protection.allow_paths must be an array of paths',
  ]);
  expect(getUserPolicyDiagnostics(allowPolicy([' ', 42]))).toEqual([
    'secret_protection.allow_paths[0] must be a non-empty path string',
    'secret_protection.allow_paths[1] must be a non-empty path string',
  ]);
  expect(getUserPolicyDiagnostics(allowPolicy(['~', homedir(), '$HOME', '${HOME}']))).toEqual([
    `secret_protection.allow_paths[0] ${disablesEverything}`,
    `secret_protection.allow_paths[1] ${disablesEverything}`,
    `secret_protection.allow_paths[2] ${disablesEverything}`,
    `secret_protection.allow_paths[3] ${disablesEverything}`,
  ]);
  expect(getUserPolicyDiagnostics(allowPolicy([HOST_ROOT, dirname(homedir()), '**']))).toEqual([
    `secret_protection.allow_paths[0] ${disablesEverything}`,
    `secret_protection.allow_paths[1] ${disablesEverything}`,
    `secret_protection.allow_paths[2] ${noGlobs}`,
  ]);
  expect(
    getUserPolicyDiagnostics(allowPolicy(['~/.cc-safety-net', '~/.cc-safety-net/policy.json'])),
  ).toEqual([
    "secret_protection.allow_paths[0] cannot cover the guard's own configuration",
    "secret_protection.allow_paths[1] cannot cover the guard's own configuration",
  ]);
  expect(getUserPolicySchema().safeParse(allowPolicy(['~'])).success).toBeFalse();
  expect(
    getUserPolicySchema().safeParse(allowPolicy(['.env.test', '~/projects/vulcan'])).success,
  ).toBeTrue();
});
