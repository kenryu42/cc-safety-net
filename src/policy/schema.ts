import { createRequire } from 'node:module';
import type * as Zod from 'zod';
import { isReservedTransparentWrapper } from '@/analyzer/transparent-wrappers';
import { BLOCK_INTENTS } from '@/ir/decision';
import { processHomeDir } from '@/ir/environment';
import {
  getDestructiveAllowPathError,
  getSecretAllowPathError,
  getSecretDenyPathError,
} from '@/policy/allow-paths';
import { MAX_AUDIT_RETENTION_DAYS, MIN_AUDIT_RETENTION_DAYS } from '@/policy/audit-retention-days';
import { COMMAND_PATTERN, MAX_REASON_LENGTH } from '@/rules/constants';
import { DESTRUCTIVE_COMMAND_RULE_ID_SET } from '@/rules/destructive-command-rules';
import { RULE_SOURCE_LIMIT, RULE_SOURCE_LIMIT_ERROR } from '@/rules/policy/resource-limits';
import { getRulebookSourceSyntaxError, NAME_PATTERN } from '@/rules/policy/source-syntax';
import { SECRET_PROTECTION_RULE_ID_SET } from '@/rules/secret-protection-rules';

const require = createRequire(import.meta.url);
let schemas: ReturnType<typeof createSchemas> | undefined;
const OVER_LIMIT_RULE_SOURCES = Array(RULE_SOURCE_LIMIT + 1).fill('over-limit');
const RULE_OVERRIDE_KEY_PATTERN = /^[^/]+\/[^/]+$/;
const SHA256_DIGEST_PATTERN = /^sha256:[a-f0-9]{64}$/;
const AUDIT_RETENTION_ERROR = `must be an integer between ${MIN_AUDIT_RETENTION_DAYS} and ${MAX_AUDIT_RETENTION_DAYS}`;
const RULES_CONFIG_FIELDS = ['version', 'rules', 'overrides', 'transparent_wrappers'];
const USER_POLICY_FIELDS = [
  'version',
  'safety',
  'workflow',
  'destructive_command_protection',
  'secret_protection',
  'audit',
];

function preflightRulesConfig(config: unknown): unknown {
  if (
    !isRecord(config) ||
    !Array.isArray(config.rules) ||
    config.rules.length <= RULE_SOURCE_LIMIT
  ) {
    return config;
  }
  return {
    $schema: config.$schema,
    version: config.version,
    rules: OVER_LIMIT_RULE_SOURCES,
    overrides: config.overrides,
    transparent_wrappers: config.transparent_wrappers,
  };
}

function createSchemas() {
  const z = require('zod') as typeof Zod;
  // Zod skips a container's refinement once one of its entries fails fatally, which
  // would hide the remaining entry diagnostics. `when` opts the refinement out of
  // that short-circuit so every entry still reports its own error.
  const alwaysRun = <T>(refinement: (value: T, context: Zod.core.$RefinementCtx<T>) => void) => {
    const check = z.superRefine(refinement);
    check._zod.def.when = () => true;
    return check;
  };
  const BlockIntentSchema = z.enum(BLOCK_INTENTS);
  const RuleOverrideSchema = z
    .union(
      [
        z.literal('off'),
        z.looseObject({
          reason: z
            .string({ error: 'required non-empty string' })
            .min(1, 'required non-empty string')
            .max(MAX_REASON_LENGTH, `must be at most ${MAX_REASON_LENGTH} characters`)
            .describe('Replacement block reason'),
          intent: BlockIntentSchema.optional(),
        }),
      ],
      { error: 'must be "off" or an object' },
    )
    .describe('Disable a rule or replace its block reason and intent.');
  const RuleSourceSchema = z
    .string({ error: 'must be a rulebook source string' })
    .min(1, 'must be a non-empty rulebook source string');
  const TransparentWrapperSchema = z
    .string({ error: 'must be a command string' })
    .regex(COMMAND_PATTERN, 'must match command pattern')
    .describe("Command name such as 'git', 'docker', or 'rtk'.");
  const RulesConfigObjectSchema = z.looseObject({
    $schema: z.unknown().optional().describe('JSON Schema reference for IDE support'),
    version: z.literal(1).describe('Schema version (must be 1)'),
    rules: z
      .array(RuleSourceSchema, { error: 'must be an array of rulebook source strings' })
      .max(RULE_SOURCE_LIMIT, RULE_SOURCE_LIMIT_ERROR)
      .default([])
      .describe('Rulebook source strings such as project-rules or owner/repo#main/team-rules'),
    // The key pattern rides on metadata rather than on the key schema: Zod drops the
    // value of an entry whose key fails, which would hide the override's own errors.
    overrides: z
      .record(z.string().meta({ pattern: RULE_OVERRIDE_KEY_PATTERN.source }), RuleOverrideSchema)
      .default({})
      .describe('Rule overrides by id'),
    transparent_wrappers: z
      .array(TransparentWrapperSchema, { error: 'must be an array of command strings' })
      .default([])
      .describe('Commands that transparently execute a visible protected child command'),
  });
  const refineRulesConfig = (
    config: Zod.output<typeof RulesConfigObjectSchema>,
    context: Zod.core.$RefinementCtx,
  ) => {
    if (!isRecord(config)) return;
    if (Array.isArray(config.rules) && config.rules.length <= RULE_SOURCE_LIMIT) {
      const sources = new Set<string>();
      config.rules.forEach((source, index) => {
        // Non-strings and empty strings already carry the element's own issue.
        if (typeof source !== 'string' || source === '') return;
        if (source.trim() === '') {
          context.addIssue({
            code: 'custom',
            message: 'must be a non-empty rulebook source string',
            path: ['rules', index],
          });
          return;
        }
        const sourceError = getRulebookSourceSyntaxError(source);
        if (sourceError) {
          context.addIssue({ code: 'custom', message: sourceError, path: ['rules', index] });
          return;
        }
        if (sources.has(source)) {
          context.addIssue({
            code: 'custom',
            message: `duplicate rulebook source "${source}"`,
            path: ['rules', index],
          });
          return;
        }
        sources.add(source);
      });
    }

    if (isRecord(config.overrides)) {
      for (const key of Object.keys(config.overrides)) {
        if (RULE_OVERRIDE_KEY_PATTERN.test(key)) continue;
        context.addIssue({
          code: 'custom',
          message: 'must use <rulebook-name>/<rule-name>',
          path: ['overrides', key],
        });
      }
    }

    if (!Array.isArray(config.transparent_wrappers)) return;
    const wrappers = new Set<string>();
    config.transparent_wrappers.forEach((wrapper, index) => {
      if (typeof wrapper !== 'string' || !COMMAND_PATTERN.test(wrapper)) return;
      if (wrappers.has(wrapper)) {
        context.addIssue({
          code: 'custom',
          message: `duplicate command "${wrapper}"`,
          path: ['transparent_wrappers', index],
        });
        return;
      }
      if (isReservedTransparentWrapper(wrapper)) {
        context.addIssue({
          code: 'custom',
          message: `reserved command "${wrapper}" cannot be a wrapper`,
          path: ['transparent_wrappers', index],
        });
        return;
      }
      wrappers.add(wrapper);
    });
  };
  const RulesConfigSchema = z.preprocess(
    preflightRulesConfig,
    RulesConfigObjectSchema.check(z.superRefine(refineRulesConfig)),
  );
  // Same shape and same refinement, but reporting instead of parsing: it keeps naming
  // config problems that the authoritative parse stops looking for after a fatal one.
  const RulesConfigDiagnosticSchema = z.preprocess(
    preflightRulesConfig,
    RulesConfigObjectSchema.check(alwaysRun(refineRulesConfig)),
  );
  const SafetyOverridesSchema = z.strictObject({
    fail_closed: z.boolean().optional(),
    paranoid_rm: z.boolean().optional(),
    paranoid_interpreters: z.boolean().optional(),
  });
  // The rule id lives in the record key, so the key schema is the only place that can
  // name it; Zod nests the resulting issue under `invalid_key` and then drops that
  // entry's value, so a second record reports the values independently.
  const ruleIdOverridesSchema = (knownIds: ReadonlySet<string>, label: string) =>
    z.intersection(
      z.record(
        z.string().refine((id) => knownIds.has(id), {
          error: (issue) => `unknown ${label} rule id "${String(issue.input)}"`,
        }),
        z.unknown(),
      ),
      z.record(z.string(), z.enum(['on', 'off'])),
    );
  const policyPathsSchema = (getPathError: (value: unknown, home: string) => string | null) =>
    z
      .array(z.string({ error: 'must be a non-empty path string' }), {
        error: 'must be an array of paths',
      })
      .check(
        alwaysRun<string[]>((paths, context) => {
          if (!Array.isArray(paths)) return;
          const home = processHomeDir();
          paths.forEach((path, index) => {
            if (typeof path !== 'string') return;
            const error = getPathError(path, home);
            if (error) context.addIssue({ code: 'custom', message: error, path: [index] });
          });
        }),
      );
  const UserPolicySchema = z.strictObject({
    version: z.literal(1),
    safety: z
      .strictObject({
        level: z.enum(['standard', 'strict', 'paranoid']).optional(),
        overrides: SafetyOverridesSchema.optional(),
      })
      .optional(),
    workflow: z.strictObject({ worktree_mode: z.boolean().optional() }).optional(),
    destructive_command_protection: z
      .strictObject({
        enabled: z.boolean().optional(),
        overrides: ruleIdOverridesSchema(
          DESTRUCTIVE_COMMAND_RULE_ID_SET,
          'destructive command',
        ).optional(),
        allow_paths: policyPathsSchema(getDestructiveAllowPathError).optional(),
      })
      .optional(),
    secret_protection: z
      .strictObject({
        enabled: z.boolean().optional(),
        overrides: ruleIdOverridesSchema(
          SECRET_PROTECTION_RULE_ID_SET,
          'secret protection',
        ).optional(),
        deny_paths: policyPathsSchema(getSecretDenyPathError).optional(),
        allow_paths: policyPathsSchema(getSecretAllowPathError).optional(),
      })
      .optional(),
    audit: z
      .strictObject({
        retention_days: z
          .number({ error: AUDIT_RETENTION_ERROR })
          .int(AUDIT_RETENTION_ERROR)
          .min(MIN_AUDIT_RETENTION_DAYS, AUDIT_RETENTION_ERROR)
          .max(MAX_AUDIT_RETENTION_DAYS, AUDIT_RETENTION_ERROR)
          .optional()
          .describe('Days of audit log history to keep before the sweep deletes it'),
      })
      .optional(),
  });
  // Legacy configs and rulebooks accept the same custom rules but word each failure
  // differently, so every message names both wordings.
  const customRulesSchema = (style: 'legacy' | 'rulebook') => {
    const say = (legacy: string, rulebook: string) => (style === 'legacy' ? legacy : rulebook);
    const commandPatternError = say(
      'must match pattern (letters, numbers, hyphens, underscores)',
      'must match command pattern',
    );
    const reasonError = `required non-empty string up to ${MAX_REASON_LENGTH} characters`;
    const CustomRuleSchema = z.looseObject(
      {
        name: z
          .string({ error: 'required string' })
          .regex(
            NAME_PATTERN,
            say(
              'must match pattern (letters, numbers, hyphens, underscores; max 64 chars)',
              'must match rule name pattern',
            ),
          ),
        command: z
          .string({ error: say('required string', 'required string matching command pattern') })
          .regex(
            COMMAND_PATTERN,
            say(commandPatternError, 'required string matching command pattern'),
          ),
        subcommand: z
          .string({ error: say('must be a string if provided', 'must match command pattern') })
          .regex(COMMAND_PATTERN, commandPatternError)
          .optional(),
        block_args: z
          .array(
            z
              .string({ error: say('must be a string', 'must be a non-empty string') })
              .refine((arg) => arg !== '', {
                error: say('must not be empty', 'must be a non-empty string'),
              }),
            { error: say('required array', 'required non-empty array') },
          )
          .refine((args) => args.length > 0, {
            error: say('must have at least one element', 'required non-empty array'),
          }),
        reason: z
          .string({ error: say('required string', reasonError) })
          .refine((reason) => reason !== '', { error: say('must not be empty', reasonError) })
          .refine((reason) => reason.length <= MAX_REASON_LENGTH, {
            error: say(`must be at most ${MAX_REASON_LENGTH} characters`, reasonError),
          }),
        intent: BlockIntentSchema.optional(),
      },
      { error: 'must be an object' },
    );
    return z.array(CustomRuleSchema, { error: say('must be an array', 'required array') }).check(
      alwaysRun<unknown[]>((rules, context) => {
        if (!Array.isArray(rules)) return;
        const names = new Set<string>();
        rules.forEach((rule, index) => {
          const name = isRecord(rule) ? rule.name : undefined;
          if (typeof name !== 'string') return;
          if (names.has(name.toLowerCase())) {
            context.addIssue({
              code: 'custom',
              message: `duplicate rule name "${name}"`,
              path: [index, 'name'],
            });
            return;
          }
          names.add(name.toLowerCase());
        });
      }),
    );
  };
  const LegacyConfigSchema = z.looseObject({
    version: z.literal(1),
    rules: customRulesSchema('legacy').optional(),
  });
  const rulebookNameError = 'required string matching rule name pattern';
  const RulebookFixtureSchema = z
    .looseObject(
      {
        command: z
          .string({ error: 'required non-empty string' })
          .refine((command) => command.trim() !== '', { error: 'required non-empty string' }),
        expect: z.enum(['blocked', 'allowed']),
        rule: z.string({ error: 'must be a string if provided' }).optional(),
      },
      { error: 'must be an object' },
    )
    .check(
      alwaysRun<Record<string, unknown>>((fixture, context) => {
        if (!isRecord(fixture)) return;
        if (fixture.expect !== 'blocked' || typeof fixture.rule === 'string') return;
        context.addIssue({
          code: 'custom',
          message: 'required string for blocked fixtures',
          path: ['rule'],
        });
      }),
    );
  const RulebookSchema = z
    .looseObject({
      name: z.string({ error: rulebookNameError }).regex(NAME_PATTERN, rulebookNameError),
      version: z
        .string({ error: 'required non-empty string' })
        .refine((version) => version !== '', { error: 'required non-empty string' }),
      allowed_commands: z
        .array(
          z
            .string({ error: 'must match command pattern' })
            .regex(COMMAND_PATTERN, 'must match command pattern'),
          { error: 'required array' },
        )
        .check(
          alwaysRun<unknown[]>((commands, context) => {
            if (!Array.isArray(commands)) return;
            const seen = new Set<string>();
            commands.forEach((command, index) => {
              if (typeof command !== 'string' || !COMMAND_PATTERN.test(command)) return;
              if (seen.has(command)) {
                context.addIssue({
                  code: 'custom',
                  message: `duplicate command "${command}"`,
                  path: [index],
                });
                return;
              }
              seen.add(command);
            });
          }),
        ),
      rules: customRulesSchema('rulebook'),
      tests: z.array(RulebookFixtureSchema, { error: 'must be an array if provided' }).optional(),
    })
    .check(
      alwaysRun<Record<string, unknown>>((rulebook, context) => {
        if (!isRecord(rulebook)) return;
        const declared = new Set(collectCustomRuleNames(rulebook));
        if (Array.isArray(rulebook.tests)) {
          const blocked = new Set(
            rulebook.tests.flatMap((fixture) =>
              isRecord(fixture) && fixture.expect === 'blocked' && typeof fixture.rule === 'string'
                ? [fixture.rule]
                : [],
            ),
          );
          for (const rule of blocked) {
            if (declared.has(rule)) continue;
            context.addIssue({
              code: 'custom',
              message: `blocked fixture references unknown rule "${rule}"`,
              path: ['tests'],
            });
          }
        }
        if (!Array.isArray(rulebook.allowed_commands) || !Array.isArray(rulebook.rules)) return;
        const allowed = new Set(
          rulebook.allowed_commands.filter((command) => typeof command === 'string'),
        );
        rulebook.rules.forEach((rule, index) => {
          const command = isRecord(rule) ? rule.command : undefined;
          if (typeof command !== 'string' || allowed.has(command)) return;
          context.addIssue({
            code: 'custom',
            message: `"${command}" must be listed in allowed_commands`,
            path: ['rules', index, 'command'],
          });
        });
      }),
    );
  const requiredLockString = z
    .string({ error: 'required string' })
    .refine((value) => value.trim() !== '', { error: 'required string' });
  // The fields every kind shares stay outside the union: a union stops at an unmatched
  // discriminator, which would hide the rest of the entry's own errors.
  const LockEntrySharedSchema = z.looseObject(
    {
      spec: requiredLockString,
      name: requiredLockString,
      version: requiredLockString,
      digest: z
        .string({ error: 'required sha256 digest' })
        .regex(SHA256_DIGEST_PATTERN, 'required sha256 digest'),
    },
    { error: 'must be an object' },
  );
  const RulesLockfileSchema = z.looseObject({
    rulebooks: z.array(
      z.intersection(
        LockEntrySharedSchema,
        z.discriminatedUnion(
          'kind',
          [
            z.object({
              kind: z.literal('local-directory'),
              path: requiredLockString,
            }),
            z.object({
              kind: z.literal('github'),
              owner: requiredLockString,
              repo: requiredLockString,
              ref: requiredLockString,
              commit: requiredLockString,
              path: requiredLockString,
              // Kept out of validation: a malformed display ref is dropped, not reported.
              display_ref: z.unknown().optional(),
            }),
          ],
          {
            // The union reports a non-object entry, and otherwise an unmatched `kind`
            // under the discriminator's own path.
            error: (issue) => {
              if (!isRecord(issue.input)) return 'must be an object';
              const kind = issue.input.kind;
              return typeof kind === 'string' ? `unknown kind "${kind}"` : 'required string';
            },
          },
        ),
      ),
    ),
  });
  return {
    RulesConfigSchema,
    RulesConfigDiagnosticSchema,
    RuleOverrideSchema,
    UserPolicySchema,
    LegacyConfigSchema,
    RulebookSchema,
    RulesLockfileSchema,
  };
}

function getSchemas() {
  schemas ??= createSchemas();
  return schemas;
}

export function getRulesConfigSchema() {
  return getSchemas().RulesConfigSchema;
}

/** @internal */
export function getUserPolicySchema() {
  return getSchemas().UserPolicySchema;
}

export function getLegacyConfigSchema() {
  return getSchemas().LegacyConfigSchema;
}

export function getRulebookSchema() {
  return getSchemas().RulebookSchema;
}

export function getRulesLockfileSchema() {
  return getSchemas().RulesLockfileSchema;
}

/** Custom rule names as written, in declaration order. */
export function collectCustomRuleNames(config: unknown): string[] {
  const rules = isRecord(config) ? config.rules : undefined;
  return (Array.isArray(rules) ? rules : []).flatMap((rule) => {
    const name = isRecord(rule) ? rule.name : undefined;
    return typeof name === 'string' ? [name] : [];
  });
}

export type RulesConfig = Zod.output<ReturnType<typeof getRulesConfigSchema>>;
export type RuleOverride = Zod.output<ReturnType<typeof createSchemas>['RuleOverrideSchema']>;

/** @internal */
export function getRulesConfigDiagnostics(config: unknown): string[] {
  return getRulesConfigValidation(config).errors;
}

export function getRulesConfigValidation(config: unknown): {
  errors: string[];
  sources: Set<string>;
} {
  const parsed = getSchemas().RulesConfigDiagnosticSchema.safeParse(config);
  if (parsed.success) return { errors: [], sources: new Set(parsed.data.rules) };
  return {
    errors: formatSchemaIssues(sortSchemaIssues(parsed.error.issues, RULES_CONFIG_FIELDS)),
    sources: collectValidSources(config, parsed.error.issues),
  };
}

export function getUserPolicyDiagnostics(config: unknown): string[] {
  const parsed = getUserPolicySchema().safeParse(config);
  if (parsed.success) return [];
  return formatSchemaIssues(sortSchemaIssues(parsed.error.issues, USER_POLICY_FIELDS), ' ');
}

/**
 * Renders Zod issues as this project's diagnostic strings: a `field.path` prefix joined
 * to a short reason, where nested fields use `separator` (`rules[0]: ...`) and top-level
 * ones use `topLevelSeparator`, a sentence by default (`version must be 1`). Both halves
 * of an intersection can name the same problem, so an identical string is reported once.
 */
export function formatSchemaIssues(
  issues: readonly Zod.core.$ZodIssue[],
  separator = ': ',
  topLevelSeparator = ' ',
): string[] {
  return [
    ...new Set(
      issues.flatMap((issue) => formatSchemaIssue(issue, separator, topLevelSeparator, [])),
    ),
  ];
}

function formatSchemaIssue(
  issue: Zod.core.$ZodIssue,
  separator: string,
  topLevelSeparator: string,
  prefix: readonly PropertyKey[],
): string[] {
  const path = [...prefix, ...issue.path];
  const rendered = renderIssuePath(path);
  if (issue.code === 'unrecognized_keys') {
    return issue.keys.map((key) => `${rendered ? `${rendered}.` : ''}unknown field "${key}"`);
  }
  // A record key error is raised by the key schema, which knows the key and so
  // already carries the whole message.
  if (issue.code === 'invalid_key') return issue.issues.map((inner) => inner.message);
  if (issue.code === 'invalid_union') {
    const inner = issue.errors.flat().filter((candidate) => candidate.path.length > 0);
    if (inner.length > 0) {
      return inner.flatMap((candidate) =>
        formatSchemaIssue(candidate, separator, topLevelSeparator, path),
      );
    }
  }
  if (path.length === 0) {
    return [issue.code === 'invalid_type' ? 'Config must be an object' : issue.message];
  }
  // A top-level collection size limit describes the whole config, not one field of it.
  if (
    path.length === 1 &&
    (issue.code === 'too_big' || issue.code === 'too_small') &&
    issue.origin === 'array'
  ) {
    return [issue.message];
  }
  return [`${rendered}${path.length === 1 ? topLevelSeparator : separator}${describeIssue(issue)}`];
}

function describeIssue(issue: Zod.core.$ZodIssue): string {
  if (issue.code === 'invalid_value') return `must be ${renderExpectedValues(issue.values)}`;
  // Only Zod's own wording is rephrased; a schema that supplies its own keeps it.
  if (issue.code !== 'invalid_type' || !issue.message.startsWith('Invalid input:')) {
    return issue.message;
  }
  if (issue.expected === 'object' || issue.expected === 'record') {
    return 'must be an object if provided';
  }
  return issue.expected === 'boolean' ? 'must be a boolean' : issue.message;
}

function renderExpectedValues(values: readonly Zod.core.util.Primitive[]) {
  if (values.length > 3) return `one of ${values.join(', ')}`;
  const rendered = values.map((value) =>
    typeof value === 'string' ? `"${value}"` : String(value),
  );
  if (rendered.length < 2) return `${rendered[0]}`;
  return `${rendered.slice(0, -1).join(', ')}${rendered.length > 2 ? ',' : ''} or ${rendered.at(-1)}`;
}

function renderIssuePath(path: readonly PropertyKey[]): string {
  return path
    .map((segment, index) => {
      if (typeof segment === 'number') return `[${segment}]`;
      return index === 0 ? String(segment) : `.${String(segment)}`;
    })
    .join('');
}

/**
 * Zod reports issues in schema-declaration order and appends refinement issues last,
 * so group them back into the field order the diagnostics have always used.
 */
function sortSchemaIssues(issues: readonly Zod.core.$ZodIssue[], fields: readonly string[]) {
  const entries = issues.map((issue) => issue.path[1]);
  const entryOrder = [...new Set(entries.filter((entry) => typeof entry === 'string'))];
  const rank = (issue: Zod.core.$ZodIssue, entry: PropertyKey | undefined) =>
    [
      issue.path.length === 0 ? -1 : fields.indexOf(String(issue.path[0])),
      typeof entry === 'number' ? entry : entryOrder.indexOf(String(entry)),
      issue.code === 'custom' ? 0 : 1,
    ] as const;
  return issues
    .map((issue, index) => ({ issue, rank: rank(issue, entries[index]) }))
    .sort((a, b) => a.rank[0] - b.rank[0] || a.rank[1] - b.rank[1] || a.rank[2] - b.rank[2])
    .map((entry) => entry.issue);
}

/**
 * Sources that carry no issue of their own stay usable even when the rest of the
 * config is rejected; an over-limit or non-array `rules` field yields none.
 */
function collectValidSources(config: unknown, issues: readonly Zod.core.$ZodIssue[]): Set<string> {
  const rules = isRecord(config) ? config.rules : undefined;
  if (!Array.isArray(rules)) return new Set();
  if (issues.some((issue) => issue.path.length === 1 && issue.path[0] === 'rules')) {
    return new Set();
  }
  const rejected = new Set(
    issues
      .filter((issue) => issue.path[0] === 'rules' && typeof issue.path[1] === 'number')
      .map((issue) => issue.path[1]),
  );
  return new Set(
    rules.filter(
      (source, index): source is string => typeof source === 'string' && !rejected.has(index),
    ),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
