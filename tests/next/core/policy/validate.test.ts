import { describe, expect, test } from 'bun:test';
import { homedir } from 'node:os';
import { assertValidRulebook as portedAssertValidRulebook } from '@next/core/policy/rulebook';
import * as portedSchema from '@next/core/policy/schema';
import * as ported from '@next/core/policy/validate';
import * as z from 'zod';
import * as shippedSchema from '@/policy/schema';
import { assertValidRulebook, validateRulebook } from '@/rules/rulebook';
import { describeOutcome } from '../../helpers/fixture-tree';
import { createSeededRandom, FUZZ_SEED } from '../../helpers/shell-inputs';
import { mutate, RULEBOOK_VALUES, RULES_CONFIG_VALUES, USER_POLICY_VALUES } from './policy-values';

/**
 * The hand-written validators under `next/` exist so the loader never pulls the schema
 * library onto the hook's path. They are only worth having if every diagnostic they
 * produce is the one the schema produced, so each fixture document and a seeded mutation
 * of it goes through the shipped schema, the ported schema, and the hand-written check.
 */

const HOME = process.env.HOME || homedir();
const MUTATIONS_PER_VALUE = 300;

function samples(values: readonly unknown[]): unknown[] {
  const random = createSeededRandom(FUZZ_SEED);
  return values.flatMap((value) => [
    value,
    ...Array.from({ length: MUTATIONS_PER_VALUE }, () => mutate(value, random)),
  ]);
}

function reported(value: unknown, result: unknown) {
  return { document: String(JSON.stringify(value)).slice(0, 300), result };
}

describe('policy validators without the schema library', () => {
  test('report the shipped user policy diagnostics', () => {
    for (const value of samples(USER_POLICY_VALUES)) {
      const expected = reported(value, shippedSchema.getUserPolicyDiagnostics(value));
      expect(reported(value, ported.getUserPolicyDiagnostics(value, HOME))).toStrictEqual(expected);
      expect(reported(value, portedSchema.getUserPolicyDiagnostics(value, HOME))).toStrictEqual(
        expected,
      );
    }
  }, 60_000);

  test('report the shipped rules config diagnostics and usable sources', () => {
    const flatten = (validation: { errors: string[]; sources: Set<string> }) => ({
      errors: validation.errors,
      sources: [...validation.sources],
    });
    for (const value of samples(RULES_CONFIG_VALUES)) {
      const expected = reported(value, flatten(shippedSchema.getRulesConfigValidation(value)));
      expect(reported(value, flatten(ported.getRulesConfigValidation(value)))).toStrictEqual(
        expected,
      );
      expect(reported(value, flatten(portedSchema.getRulesConfigValidation(value)))).toStrictEqual(
        expected,
      );
    }
  }, 60_000);

  test('report the shipped rulebook diagnostics and rule names', () => {
    const flatten = (validation: { errors: string[]; ruleNames: Set<string> }) => ({
      errors: validation.errors,
      ruleNames: [...validation.ruleNames],
    });
    for (const value of samples(RULEBOOK_VALUES)) {
      expect(reported(value, flatten(ported.validateRulebook(value)))).toStrictEqual(
        reported(value, flatten(validateRulebook(value))),
      );
      expect(
        reported(
          value,
          describeOutcome(() => portedAssertValidRulebook(value)),
        ),
      ).toStrictEqual(
        reported(
          value,
          describeOutcome(() => assertValidRulebook(value)),
        ),
      );
    }
  }, 60_000);
});

describe('the ported schema', () => {
  test('accepts and rejects the same documents as the shipped one', () => {
    for (const value of RULES_CONFIG_VALUES) {
      expect(
        reported(value, portedSchema.getRulesConfigSchema().safeParse(value).success),
      ).toStrictEqual(
        reported(value, shippedSchema.getRulesConfigSchema().safeParse(value).success),
      );
    }
    for (const value of USER_POLICY_VALUES) {
      expect(
        reported(value, portedSchema.getUserPolicySchema(HOME).safeParse(value).success),
      ).toStrictEqual(
        reported(value, shippedSchema.getUserPolicySchema().safeParse(value).success),
      );
    }
  });

  test('generates the shipped rule config JSON schema', () => {
    const options = { io: 'input', target: 'draft-7' } as const;
    expect(z.toJSONSchema(portedSchema.getRulesConfigSchema(), options)).toStrictEqual(
      z.toJSONSchema(shippedSchema.getRulesConfigSchema(), options),
    );
  });
});
