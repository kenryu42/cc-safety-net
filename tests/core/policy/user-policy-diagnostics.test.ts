import { describe, expect, test } from 'bun:test';
import { getUserPolicyDiagnostics } from '@/core/policy/user-policy-diagnostics';

const HOME = '/srv/home/tester';

describe('user policy diagnostics', () => {
  test.each([
    ['the minimal document is accepted', { version: 1 }, []],
    ['a missing version is the first thing reported', {}, ['version must be 1']],
    ['a document that is not an object is rejected whole', 'policy', ['Config must be an object']],
    [
      'an unrecognized top-level field is named',
      { version: 1, tier: 'gold' },
      ['unknown field "tier"'],
    ],
    [
      'an unrecognized level lists the levels that exist',
      { version: 1, safety: { level: 'lenient' } },
      ['safety.level must be "standard", "strict", or "paranoid"'],
    ],
    [
      'a level that is not a string is rejected even when it spells a level',
      { version: 1, safety: { level: ['strict'] } },
      ['safety.level must be "standard", "strict", or "paranoid"'],
    ],
    [
      'a capability override must be a boolean',
      { version: 1, safety: { level: 'strict', overrides: { fail_closed: 'yes' } } },
      ['safety.overrides.fail_closed must be a boolean'],
    ],
    [
      'every rejected allow path is reported at its own index',
      { version: 1, destructive_command_protection: { allow_paths: ['relative/dir', 42] } },
      [
        'destructive_command_protection.allow_paths[0] must be an absolute path or start with ~/',
        'destructive_command_protection.allow_paths[1] must be a non-empty path string',
      ],
    ],
    [
      'the secret lists report the reason each entry was refused',
      { version: 1, secret_protection: { deny_paths: ['~'], allow_paths: ['~/**/x'] } },
      [
        'secret_protection.deny_paths[0] cannot be the home directory or a path above it (this would block every command the agent runs)',
        'secret_protection.allow_paths[0] cannot contain glob characters (* or ?); list the exact file or directory',
      ],
    ],
    [
      'a retention window out of range names the range',
      { version: 1, audit: { retention_days: 0 } },
      ['audit.retention_days must be an integer between 1 and 365'],
    ],
    [
      'an override naming no built-in rule names the id it could not find',
      { version: 1, destructive_command_protection: { overrides: { 'git.no-such-rule': 'on' } } },
      ['unknown destructive command rule id "git.no-such-rule"'],
    ],
  ] as const)('%s', (_behavior, document, expected) => {
    expect(getUserPolicyDiagnostics(document, HOME)).toEqual([...expected]);
  });
});
