import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BLOCK_INTENTS } from '@/core/decision';
import { RULE_SOURCE_LIMIT } from '@/core/policy/resource-limits';
import { RULE_OVERRIDE_KEY_PATTERN, RULES_CONFIG_FIELDS } from '@/core/policy/rules-config';
import { COMMAND_PATTERN, MAX_REASON_LENGTH } from '@/core/rules/constants';

/**
 * `assets/cc-safety-net.schema.json` is published for editors and is written by hand, so nothing
 * but this test stops it from describing a `rule.json` the validator no longer accepts. It holds
 * the asset to every acceptance decision the validator makes that the schema also states.
 */
describe('the published JSON Schema asset', () => {
  const schema = JSON.parse(
    readFileSync(
      join(import.meta.dir, '..', '..', '..', 'assets', 'cc-safety-net.schema.json'),
      'utf8',
    ),
  );

  test('states the same fields, limits and patterns as the rules config validator', () => {
    expect(Object.keys(schema.properties)).toEqual(['$schema', ...RULES_CONFIG_FIELDS]);
    expect(schema.required).toEqual(['version']);
    expect(schema.properties.version.const).toBe(1);
    expect(schema.properties.rules.maxItems).toBe(RULE_SOURCE_LIMIT);
    expect(schema.properties.overrides.propertyNames.pattern).toBe(
      RULE_OVERRIDE_KEY_PATTERN.source,
    );
    expect(
      schema.properties.overrides.additionalProperties.anyOf[1].properties.intent.enum,
    ).toEqual([...BLOCK_INTENTS]);
    expect(
      schema.properties.overrides.additionalProperties.anyOf[1].properties.reason.maxLength,
    ).toBe(MAX_REASON_LENGTH);
    expect(schema.properties.transparent_wrappers.items.pattern).toBe(COMMAND_PATTERN.source);
  });
});
