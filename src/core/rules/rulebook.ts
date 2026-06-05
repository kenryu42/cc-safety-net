import { checkCustomRules } from '@/core/rules/custom';
import { validateCustomRule } from '@/core/rules/custom-rule-validation';
import { splitShellCommands } from '@/core/shell';
import { COMMAND_PATTERN, type CustomRule, NAME_PATTERN, type ValidationResult } from '@/types';

export interface RulebookFixture {
  command: string;
  expect: 'blocked' | 'allowed';
  rule?: string;
}

export interface Rulebook {
  rulebook_version: 1;
  name: string;
  version: string;
  description?: string;
  author?: string;
  allowed_commands: string[];
  rules: CustomRule[];
  tests: RulebookFixture[];
}

/** @internal - exported for test coverage */
export interface RulebookFixtureFailure {
  command: string;
  message: string;
  trace: string[];
}

export interface RulebookFixtureResult {
  ok: boolean;
  failures: RulebookFixtureFailure[];
}

/** @internal - exported for test coverage */
export function validateRulebook(rulebook: unknown): ValidationResult {
  const errors: string[] = [];
  const ruleNames = new Set<string>();

  if (!rulebook || typeof rulebook !== 'object') {
    return { errors: ['Rulebook must be an object'], ruleNames };
  }

  const rb = rulebook as Record<string, unknown>;

  if (rb.rulebook_version !== 1) {
    errors.push('rulebook_version must be 1');
  }
  if (typeof rb.name !== 'string' || !NAME_PATTERN.test(rb.name)) {
    errors.push('name: required string matching rule name pattern');
  }
  if (typeof rb.version !== 'string' || rb.version === '') {
    errors.push('version: required non-empty string');
  }
  if (!Array.isArray(rb.allowed_commands)) {
    errors.push('allowed_commands: required array');
  } else {
    validateAllowedCommands(rb.allowed_commands, errors);
  }
  if (!Array.isArray(rb.rules)) {
    errors.push('rules: required array');
  } else {
    for (let i = 0; i < rb.rules.length; i++) {
      errors.push(...validateCustomRule(rb.rules[i], i, ruleNames, { messageStyle: 'rulebook' }));
    }
  }
  if (!Array.isArray(rb.tests)) {
    errors.push('tests: required array');
  } else {
    validateFixtures(rb.tests, rb.rules, errors);
  }

  if (Array.isArray(rb.allowed_commands) && Array.isArray(rb.rules)) {
    const allowed = new Set(rb.allowed_commands.filter((cmd) => typeof cmd === 'string'));
    for (let i = 0; i < rb.rules.length; i++) {
      const rule = rb.rules[i] as Record<string, unknown>;
      if (typeof rule.command === 'string' && !allowed.has(rule.command)) {
        errors.push(`rules[${i}].command: "${rule.command}" must be listed in allowed_commands`);
      }
    }
  }

  return { errors, ruleNames };
}

function validateAllowedCommands(commands: unknown[], errors: string[]): void {
  const seen = new Set<string>();
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    if (typeof command !== 'string' || !COMMAND_PATTERN.test(command)) {
      errors.push(`allowed_commands[${i}]: must match command pattern`);
      continue;
    }
    if (seen.has(command)) {
      errors.push(`allowed_commands[${i}]: duplicate command "${command}"`);
      continue;
    }
    seen.add(command);
  }
}

function validateFixtures(tests: unknown[], rules: unknown, errors: string[]): void {
  const blockedFixtures = new Set<string>();
  const ruleNames = new Set(
    Array.isArray(rules)
      ? rules
          .map((rule) =>
            rule && typeof rule === 'object' ? (rule as Record<string, unknown>).name : null,
          )
          .filter((name): name is string => typeof name === 'string')
      : [],
  );

  for (let i = 0; i < tests.length; i++) {
    const fixture = tests[i];
    if (!fixture || typeof fixture !== 'object') {
      errors.push(`tests[${i}]: must be an object`);
      continue;
    }
    const f = fixture as Record<string, unknown>;
    if (typeof f.command !== 'string' || f.command.trim() === '') {
      errors.push(`tests[${i}].command: required non-empty string`);
    }
    if (f.expect !== 'blocked' && f.expect !== 'allowed') {
      errors.push(`tests[${i}].expect: must be "blocked" or "allowed"`);
    }
    if (f.rule !== undefined && typeof f.rule !== 'string') {
      errors.push(`tests[${i}].rule: must be a string if provided`);
    }
    if (f.expect === 'blocked' && typeof f.rule !== 'string') {
      errors.push(`tests[${i}].rule: required string for blocked fixtures`);
    }
    if (f.expect === 'blocked' && typeof f.rule === 'string') {
      blockedFixtures.add(f.rule);
    }
  }

  for (let i = 0; i < (Array.isArray(rules) ? rules.length : 0); i++) {
    const rule = (rules as unknown[])[i] as Record<string, unknown>;
    if (typeof rule.name === 'string' && !blockedFixtures.has(rule.name)) {
      errors.push(`rules[${i}]: missing blocked fixture for rule "${rule.name}"`);
    }
  }

  for (const rule of blockedFixtures) {
    if (!ruleNames.has(rule)) {
      errors.push(`tests: blocked fixture references unknown rule "${rule}"`);
    }
  }
}

export function runRulebookFixtures(rulebook: Rulebook): RulebookFixtureResult {
  const failures = rulebook.tests.flatMap((fixture) => {
    const segments = splitShellCommands(fixture.command).map((tokens) => {
      const result = checkCustomRules(tokens, rulebook.rules);
      return { tokens, result, matchedRule: result?.match(/^\[([^\]]+)]/)?.[1] ?? null };
    });
    const firstSegment = segments[0] ?? { tokens: [], result: null, matchedRule: null };

    if (fixture.expect === 'allowed') {
      const blockedSegment = segments.find((segment) => segment.result);
      return blockedSegment
        ? [
            {
              command: fixture.command,
              message: `expected allowed but matched ${blockedSegment.matchedRule ?? 'a rule'}`,
              trace: traceRulebookFixture(blockedSegment.tokens, rulebook.rules),
            },
          ]
        : [];
    }

    const firstBlockedSegment = segments.find((segment) => segment.result);
    if (!firstBlockedSegment) {
      return [
        {
          command: fixture.command,
          message: `expected blocked by ${fixture.rule ?? 'a rule'} but command was allowed`,
          trace: traceRulebookFixture(firstSegment.tokens, rulebook.rules),
        },
      ];
    }
    if (!fixture.rule || firstBlockedSegment.matchedRule === fixture.rule) return [];

    return [
      {
        command: fixture.command,
        message: `expected blocked by ${fixture.rule} but matched ${firstBlockedSegment.matchedRule}`,
        trace: traceRulebookFixture(firstBlockedSegment.tokens, rulebook.rules),
      },
    ];
  });

  return { ok: failures.length === 0, failures };
}

function traceRulebookFixture(tokens: readonly string[], rules: readonly CustomRule[]): string[] {
  return rules.map((rule) => {
    const result = checkCustomRules([...tokens], [rule]);
    return `${result ? 'matched' : 'skipped'} ${rule.name}`;
  });
}

export function assertValidRulebook(rulebook: unknown): Rulebook {
  const result = validateRulebook(rulebook);
  if (result.errors.length > 0) {
    throw new Error(result.errors.join('; '));
  }
  const parsed = rulebook as Rulebook;
  const fixtures = runRulebookFixtures(parsed);
  if (!fixtures.ok) {
    throw new Error(
      fixtures.failures.map((failure) => `${failure.command}: ${failure.message}`).join('; '),
    );
  }
  return parsed;
}
