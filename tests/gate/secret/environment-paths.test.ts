import { afterEach, expect, test } from 'bun:test';
import { join } from 'node:path';
import { pathTarget } from './path-target';
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
  expect(pathTarget([target], home, environment)).toEqual({ target, ruleId });
  expect(
    pathTarget([target], home, environment, {
      denyPaths: [],
      disabledRules: [ruleId],
    }),
  ).toBeNull();
  expect(pathTarget(['release-notes.old'], home, environment)).toBeNull();
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
  expect(pathTarget(['custom/settings.json'], home, environment)).toEqual({
    target: 'custom/settings.json',
    ruleId: 'secret.cli.opencode.config',
  });
  expect(pathTarget(['neighbor/settings.json'], home, environment)).toBeNull();
});

test.each([
  ['the default location', {}, '.config'],
  ['a custom config dir', { OPENCODE_CONFIG_DIR: 'custom', XDG_CONFIG_HOME: 'xdg' }, 'xdg'],
])('protects the OpenCode v1 global config.json under %s', (_, overrides, configHome) => {
  const home = createTempRoot('secret-v1-config-');
  writeTree(home, {
    [`${configHome}/opencode/config.json`]: '{}',
    [`${configHome}/other/config.json`]: '{}',
  });
  const environment = environmentFor(home, isolationEnv(home, overrides));
  const target = join(home, configHome, 'opencode', 'config.json');
  expect(pathTarget([target], home, environment)).toEqual({
    target,
    ruleId: 'secret.cli.opencode.config',
  });
  expect(
    pathTarget([join(home, configHome, 'other', 'config.json')], home, environment),
  ).toBeNull();
});

test('keeps the OpenCode v1 global opencode.json protected under a custom config dir', () => {
  const home = createTempRoot('secret-v1-opencode-json-');
  writeTree(home, { '.config/opencode/opencode.json': '{}' });
  const environment = environmentFor(home, isolationEnv(home, { OPENCODE_CONFIG_DIR: 'custom' }));
  const target = join(home, '.config', 'opencode', 'opencode.json');
  expect(pathTarget([target], home, environment)).toEqual({
    target,
    ruleId: 'secret.cli.opencode.config',
  });
});

test.each(['', '-wal', '-shm'])('protects a relocated OpenCode database%s', (suffix) => {
  const home = createTempRoot('secret-database-');
  writeTree(home, { [`storage/session.sqlite${suffix}`]: 'fixture' });
  const environment = environmentFor(
    home,
    isolationEnv(home, { OPENCODE_DB: 'storage/session.sqlite' }),
  );
  const target = `storage/session.sqlite${suffix}`;
  expect(pathTarget([target], home, environment)).toEqual({
    target,
    ruleId: 'secret.cli.opencode',
  });
  expect(pathTarget([`${target}.backup`], home, environment)).toBeNull();
});

test('protects Gemini system settings under the configured ProgramData directory', () => {
  const home = createTempRoot('secret-system-config-');
  const target = join(home, 'system', 'gemini-cli', 'settings.json');
  writeTree(home, { 'system/gemini-cli/settings.json': '{}' });
  const environment = environmentFor(
    home,
    isolationEnv(home, { ProgramData: join(home, 'system') }),
  );
  expect(pathTarget([target], home, environment)).toEqual({
    target,
    ruleId: 'secret.cli.gemini.config',
  });
  expect(
    pathTarget([join(home, 'other', 'gemini-cli', 'settings.json')], home, environment),
  ).toBeNull();
});

test.each([
  ['XDG_DATA_HOME', 'devin/credentials.toml', 'secret.cli.devin'],
  ['XDG_DATA_HOME', 'devin/mcp/oauth/server.json', 'secret.cli.devin'],
  ['XDG_CONFIG_HOME', 'devin/config.json', 'secret.cli.devin.config'],
])('protects the Devin CLI store relocated by %s at %s', (name, file, ruleId) => {
  const home = createTempRoot('secret-devin-xdg-');
  const environment = environmentFor(home, isolationEnv(home, { [name]: join(home, 'xdg') }));
  const target = join(home, 'xdg', file);
  expect(pathTarget([target], home, environment)).toEqual({ target, ruleId });
  expect(
    pathTarget([join(home, 'xdg', 'devin', 'cli', 'logs', 'x')], home, environment),
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
  expect(pathTarget(['guard/id_rsa'], home, environment, config)).toEqual({
    target: 'guard/id_rsa',
    ruleId: 'secret.basename.id-rsa',
  });
  expect(pathTarget(['fixtures/id_rsa'], home, environment, config)).toBeNull();
});
