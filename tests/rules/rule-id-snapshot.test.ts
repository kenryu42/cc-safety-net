import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { DESTRUCTIVE_COMMAND_RULE_METADATA } from '@/rules/destructive-command-rules';
import {
  SECRET_DEFAULT_OFF_RULE_ID_SET,
  SECRET_PROTECTION_RULE_IDS,
} from '@/rules/secret-protection-rules';

/**
 * Rule ids are an external contract: policy overrides, audit filters, rulebook
 * fixtures, and explain output all reference them. The snapshot pins each id in
 * catalog order, with the destructive intent, catastrophic flag, and activation
 * gate, and the secret default-off tier. A new rule is recorded by appending an
 * entry; a removed, renamed, reordered, or re-tiered rule is a compatibility
 * break that must be recorded on purpose, never by accident.
 */

type DestructiveEntry = {
  id: string;
  intent: string;
  catastrophic?: true;
  activationCapability?: string;
};
type SecretEntry = { id: string; defaultOff?: true };

const snapshot = JSON.parse(
  readFileSync(new URL('./rule-ids.snapshot.json', import.meta.url), 'utf-8'),
) as { destructive: DestructiveEntry[]; secret: SecretEntry[] };

describe('rule id snapshot', () => {
  test('destructive rule ids, intents, catastrophic flags, and activation gates match the snapshot', () => {
    const live: DestructiveEntry[] = DESTRUCTIVE_COMMAND_RULE_METADATA.map((rule) => ({
      id: rule.id,
      intent: rule.intent,
      ...(rule.catastrophic ? { catastrophic: true } : {}),
      ...(rule.activationCapability ? { activationCapability: rule.activationCapability } : {}),
    }));
    expect(live).toEqual(snapshot.destructive);
  });

  test('secret rule ids and the default-off tier match the snapshot', () => {
    const live: SecretEntry[] = SECRET_PROTECTION_RULE_IDS.map((id) => ({
      id,
      ...(SECRET_DEFAULT_OFF_RULE_ID_SET.has(id) ? { defaultOff: true } : {}),
    }));
    expect(live).toEqual(snapshot.secret);
  });
});
