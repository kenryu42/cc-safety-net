import { describe, expect, test } from 'bun:test';
import * as nextDestructive from '@/core/rules/destructive';
import * as nextSecret from '@/core/rules/secret';

describe('rule catalogs', () => {
  const destructive = nextDestructive.DESTRUCTIVE_COMMAND_RULE_METADATA;
  const secret = nextSecret.SECRET_PROTECTION_RULE_METADATA;

  test('every destructive record is uniquely identified and fully described', () => {
    expect(destructive).toHaveLength(59);
    const ids = destructive.map((rule) => rule.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(nextDestructive.DESTRUCTIVE_COMMAND_RULE_ID_SET).toEqual(new Set(ids));

    for (const rule of destructive) {
      expect(rule.id, rule.id).toMatch(/^[a-z0-9-]+\.[a-z0-9-]+$/);
      expect(rule.category, rule.id).not.toBe('');
      expect(rule.label, rule.id).not.toBe('');
      expect(rule.description, rule.id).toEndWith('.');
      expect(rule.example, rule.id).not.toBe('');
    }
  });

  test('the rules that carry a behaviour beyond their text are the ones that should', () => {
    expect(destructive.flatMap((rule) => (rule.catastrophic ? [rule.id] : []))).toEqual([
      'rm.recursive-force-root-or-home',
      'rm.git-metadata',
      'powershell.remove-item-root-or-home',
      'powershell.remove-item-recursive-force-root-or-home',
      'powershell.remove-item-git-metadata',
      'find.delete-git-metadata',
    ]);
    expect(
      destructive.flatMap((rule) =>
        rule.activationCapability ? [[rule.id, rule.activationCapability]] : [],
      ),
    ).toEqual([
      ['rm.recursive-force-dynamic-target', 'fail_closed'],
      ['rm.recursive-force-paranoid', 'paranoid_rm'],
      ['powershell.remove-item-recursive-force-dynamic-target', 'fail_closed'],
      ['powershell.remove-item-recursive-force-paranoid', 'paranoid_rm'],
      ['powershell.remove-item-pipeline-dynamic-target', 'fail_closed'],
      ['interpreter.one-liner-paranoid', 'paranoid_interpreters'],
      ['shell.dynamic-structure', 'fail_closed'],
      ['shell.dynamic-executable', 'fail_closed'],
    ]);
  });

  test('destructiveCommandMatch answers with the record intent and the reason it was handed', () => {
    expect([...new Set(destructive.map((rule) => rule.intent))].sort()).toEqual([
      'hard_stop',
      'manual_only',
      'scope_down',
      'stop_and_explain',
      'use_alternative',
    ]);
    for (const rule of destructive) {
      const id = rule.id as nextDestructive.DestructiveCommandRuleId;
      expect(nextDestructive.destructiveCommandMatch(id, `reason for ${id}`), id).toEqual({
        id,
        reason: `reason for ${id}`,
        intent: rule.intent,
      });
    }
  });

  test('the secret catalog is the matcher tables in order, and nothing else', () => {
    expect(
      [
        ...nextSecret.SECRET_BASENAME_RULES,
        nextSecret.SECRET_ENV_VARIANT_RULE,
        ...nextSecret.SECRET_HOME_PATH_RULES,
        ...nextSecret.SECRET_VARIANT_SEPARATOR_RULES,
        ...nextSecret.SECRET_VARIANT_DOT_SUFFIX_RULES,
        nextSecret.SECRET_BROAD_SSH_KEY_BASENAME_RULE,
        ...nextSecret.SECRET_EXTENSION_RULES,
        ...nextSecret.SECRET_EXTENSION_PATTERN_RULES,
        ...nextSecret.SECRET_CODING_CLI_RULES,
      ].map((rule) => rule.id),
    ).toEqual(secret.map((rule) => rule.id));
    expect(secret).toHaveLength(134);
    expect(new Set(secret.map((rule) => rule.id)).size).toBe(secret.length);
    expect(nextSecret.SECRET_PROTECTION_RULE_ID_SET).toEqual(
      new Set(secret.map((rule) => rule.id)),
    );

    for (const rule of secret) {
      expect(rule.id, rule.id).toStartWith('secret.');
      expect(rule.category, rule.id).not.toBe('');
      expect(rule.label, rule.id).not.toBe('');
      expect(
        'paths' in rule ? rule.paths.length > 0 : rule.description.endsWith('.'),
        rule.id,
      ).toBe(true);
    }
  });

  test('the tier that ships off is the coding-CLI config rules', () => {
    const off = secret.flatMap((rule) => (rule.defaultOff === true ? [rule.id] : []));
    expect(new Set(off)).toEqual(nextSecret.SECRET_DEFAULT_OFF_RULE_ID_SET);
    expect(off).toEqual(
      secret.flatMap((rule) => (rule.category === 'Coding CLI config' ? [rule.id] : [])),
    );
    expect(off).toHaveLength(11);
  });

  test('every pattern matcher is anchored at both ends and carries no flags', () => {
    expect(
      [
        nextSecret.SECRET_BROAD_SSH_KEY_BASENAME_RULE,
        ...nextSecret.SECRET_EXTENSION_PATTERN_RULES,
      ].map((rule) => [rule.id, rule.pattern.source, rule.pattern.flags]),
    ).toEqual([
      ['secret.pattern.ssh-key-basename', '^.*_(rsa|dsa|ed25519|ecdsa)$', ''],
      ['secret.ext-pattern.key', '^key(pair)?$', ''],
      ['secret.ext-pattern.keystore', '^key(store|ring)$', ''],
      ['secret.ext-pattern.kdbx', '^kdbx?$', ''],
    ]);
  });
});
