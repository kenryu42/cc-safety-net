import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import * as nextDestructive from '@next/core/rules/destructive';
import * as nextSecret from '@next/core/rules/secret';
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
 * break that must be recorded on purpose, never by accident. Until cutover the
 * shipped catalog and the `next/` catalog both pin it.
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

const catalogs = [
  {
    destructive: DESTRUCTIVE_COMMAND_RULE_METADATA,
    secretIds: SECRET_PROTECTION_RULE_IDS,
    secretDefaultOff: SECRET_DEFAULT_OFF_RULE_ID_SET,
  },
  {
    destructive: nextDestructive.DESTRUCTIVE_COMMAND_RULE_METADATA,
    secretIds: nextSecret.SECRET_PROTECTION_RULE_IDS,
    secretDefaultOff: nextSecret.SECRET_DEFAULT_OFF_RULE_ID_SET,
  },
];

describe('rule id snapshot', () => {
  test('destructive rule ids, intents, catastrophic flags, and activation gates match the snapshot', () => {
    for (const catalog of catalogs) {
      const live: DestructiveEntry[] = catalog.destructive.map((rule) => ({
        id: rule.id,
        intent: rule.intent,
        ...(rule.catastrophic ? { catastrophic: true } : {}),
        ...(rule.activationCapability ? { activationCapability: rule.activationCapability } : {}),
      }));
      expect(live).toEqual(snapshot.destructive);
    }
  });

  test('secret rule ids and the default-off tier match the snapshot', () => {
    for (const catalog of catalogs) {
      const live: SecretEntry[] = catalog.secretIds.map((id) => ({
        id,
        ...(catalog.secretDefaultOff.has(id) ? { defaultOff: true } : {}),
      }));
      expect(live).toEqual(snapshot.secret);
    }
  });
});
