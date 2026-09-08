import { afterAll, describe, expect, test } from 'bun:test';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getRulesConfigSchema, getUserPolicyDiagnostics } from '@/core/policy/schema';
import { writeRulesConfigJsonSchema } from '../../../scripts/build-schema';

const REPO_ROOT = join(import.meta.dir, '..', '..', '..');
const HOME = '/srv/home/tester';

/**
 * The diagnostics `doctor`, `policy check` and the GUI report a user policy with. The runtime
 * salvages the same document in its own plain wording; `store-parity.test.ts` holds the two to
 * the same outcome.
 */
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

/**
 * `assets/cc-safety-net.schema.json` is a committed, published artifact, and after cutover the
 * ported schema is what generates it. A ported schema drift, a changed post-processing step or a
 * Biome formatting change makes the rendered document differ from the committed bytes and fails
 * this test; the test and `scripts/build-schema.ts` call the same writer, so they cannot disagree
 * about how the document is produced.
 */
describe('ported rules config schema', () => {
  // Named here but created inside the test, so a run whose tests are all filtered out leaves no
  // directory behind: `afterAll` never fires for a describe that contributed no test.
  const directory = join(
    process.env.CC_SAFETY_NET_TEST_TMPDIR ?? tmpdir(),
    `schema-asset-${process.pid}`,
  );
  afterAll(() => rmSync(directory, { recursive: true, force: true }));

  test('the ported schema renders the committed asset byte for byte', async () => {
    mkdirSync(directory, { recursive: true });
    const output = join(directory, 'cc-safety-net.schema.json');
    const result = await writeRulesConfigJsonSchema(getRulesConfigSchema(), output);

    expect(result.exitCode).toBe(0);
    expect(readFileSync(output, 'utf8')).toBe(
      readFileSync(join(REPO_ROOT, 'assets', 'cc-safety-net.schema.json'), 'utf8'),
    );
  }, 30_000);
});
