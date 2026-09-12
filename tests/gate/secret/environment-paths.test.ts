import { afterEach, expect, test } from 'bun:test';
import { join } from 'node:path';
import { findSensitivePathTarget } from '@/gate/secret/secret-protection';
import { writeTree } from '../../helpers/fixture-tree';
import {
  createTempRoot,
  environmentFor,
  isolationEnv,
  removeTempRoots,
} from '../../helpers/temp-home';

afterEach(removeTempRoots);

test.each([
  ['credentials-work', 'secret.variant.credentials.separator'],
  ['id_rsa.old', 'secret.variant.id-rsa.old'],
])('protects credential backup %s while allowing an unrelated filename', (target, ruleId) => {
  const home = createTempRoot('secret-variant-');
  const environment = environmentFor(home, isolationEnv(home));
  expect(findSensitivePathTarget([target], home, environment)).toEqual({ target, ruleId });
  expect(
    findSensitivePathTarget([target], home, environment, {
      denyPaths: [],
      disabledRules: [ruleId],
    }),
  ).toBeNull();
  expect(findSensitivePathTarget(['release-notes.old'], home, environment)).toBeNull();
});

test('protects a custom OpenCode config filename while allowing a neighboring file', () => {
  const home = createTempRoot('secret-config-');
  writeTree(home, { 'custom/settings.json': '{}', 'neighbor/settings.json': '{}' });
  const environment = environmentFor(
    home,
    isolationEnv(home, {
      OPENCODE_CONFIG_DIR: 'custom',
      OPENCODE_CONFIG: 'custom/settings.json',
    }),
  );
  expect(findSensitivePathTarget(['custom/settings.json'], home, environment)).toEqual({
    target: 'custom/settings.json',
    ruleId: 'secret.cli.opencode.config',
  });
  expect(findSensitivePathTarget(['neighbor/settings.json'], home, environment)).toBeNull();
});

test.each(['', '-wal', '-shm'])('protects a relocated OpenCode database%s', (suffix) => {
  const home = createTempRoot('secret-database-');
  writeTree(home, { [`storage/session.sqlite${suffix}`]: 'fixture' });
  const environment = environmentFor(
    home,
    isolationEnv(home, { OPENCODE_DB: 'storage/session.sqlite' }),
  );
  const target = `storage/session.sqlite${suffix}`;
  expect(findSensitivePathTarget([target], home, environment)).toEqual({
    target,
    ruleId: 'secret.cli.opencode',
  });
  expect(findSensitivePathTarget([`${target}.backup`], home, environment)).toBeNull();
});

test('protects Gemini system settings under the configured ProgramData directory', () => {
  const home = createTempRoot('secret-system-config-');
  const target = join(home, 'system', 'gemini-cli', 'settings.json');
  writeTree(home, { 'system/gemini-cli/settings.json': '{}' });
  const environment = environmentFor(
    home,
    isolationEnv(home, { ProgramData: join(home, 'system') }),
  );
  expect(findSensitivePathTarget([target], home, environment)).toEqual({
    target,
    ruleId: 'secret.cli.gemini.config',
  });
  expect(
    findSensitivePathTarget(
      [join(home, 'other', 'gemini-cli', 'settings.json')],
      home,
      environment,
    ),
  ).toBeNull();
});

test('a secret allow path cannot exempt a relocated safety-net home', () => {
  const home = createTempRoot('secret-guard-home-');
  writeTree(home, { 'guard/id_rsa': 'fixture', 'fixtures/id_rsa': 'fixture' });
  const environment = environmentFor(
    home,
    isolationEnv(home, { CC_SAFETY_NET_HOME: join(home, 'guard') }),
  );
  const config = { denyPaths: [], allowPaths: [join(home, 'guard'), join(home, 'fixtures')] };
  expect(findSensitivePathTarget(['guard/id_rsa'], home, environment, config)).toEqual({
    target: 'guard/id_rsa',
    ruleId: 'secret.basename.id-rsa',
  });
  expect(findSensitivePathTarget(['fixtures/id_rsa'], home, environment, config)).toBeNull();
});
