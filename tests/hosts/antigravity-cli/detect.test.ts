import { afterEach, describe, expect, test } from 'bun:test';
import { detect as detectAntigravity } from '@/hosts/antigravity-cli/detect';
import { differential } from '../../helpers/host-differential';
import { removeTempRoots } from '../../helpers/temp-home';

const CONFIG = '.gemini/config/hooks.json';
const CONFIG_PATH = `<home>/${CONFIG}`;
const PLUGIN_HOOKS = '.gemini/config/plugins/cc-safety-net/hooks.json';
const MANAGED = 'npx -y cc-safety-net hook --agy-cli';
const DEFINITION = {
  PreToolUse: [{ hooks: [{ type: 'command', command: MANAGED, timeout: 30 }] }],
};
const PLUGIN_DEFINITION = {
  PreToolUse: [{ matcher: '*', hooks: [{ type: 'command', command: MANAGED, timeout: 30 }] }],
};
const FOREIGN = { mine: { PreToolUse: [] } };
const PLUGIN_DISABLED = { plugins: { 'cc-safety-net': { enabled: false } } };

const hooksConfig = (config: Record<string, unknown>) => `${JSON.stringify(config, null, 2)}\n`;

const CONFIGURED = {
  platform: 'antigravity-cli',
  status: 'configured',
  method: 'hook config',
  configPath: CONFIG_PATH,
} as const;
const PLUGIN_CONFIGURED = {
  platform: 'antigravity-cli',
  status: 'configured',
  method: 'plugin',
  configPath: `<home>/${PLUGIN_HOOKS}`,
} as const;

const detection = async (seed: Record<string, string>) =>
  (
    await differential({ seed }, (environment) =>
      detectAntigravity({ environment, cwd: environment.home }),
    )
  ).outcome;

afterEach(removeTempRoots);

describe('the Antigravity detector differential', () => {
  test('reports the native agy plugin as configured', async () => {
    expect(
      await detection({ [PLUGIN_HOOKS]: hooksConfig({ 'cc-safety-net': PLUGIN_DEFINITION }) }),
    ).toEqual({ kind: 'returned', value: PLUGIN_CONFIGURED });
  });

  test('reports the native agy plugin as disabled when agy config turns it off', async () => {
    expect(
      await detection({
        [PLUGIN_HOOKS]: hooksConfig({ 'cc-safety-net': PLUGIN_DEFINITION }),
        '.gemini/config/config.json': hooksConfig(PLUGIN_DISABLED),
      }),
    ).toEqual({ kind: 'returned', value: { ...PLUGIN_CONFIGURED, status: 'disabled' } });
  });

  test('still reports a legacy hook entry that has not migrated yet as configured', async () => {
    expect(await detection({ [CONFIG]: hooksConfig({ 'cc-safety-net': DEFINITION }) })).toEqual({
      kind: 'returned',
      value: CONFIGURED,
    });
  });

  test('reports a definition the user disabled', async () => {
    const disabled = { 'cc-safety-net': { enabled: false, ...DEFINITION } };

    expect(await detection({ [CONFIG]: hooksConfig(disabled) })).toEqual({
      kind: 'returned',
      value: { ...CONFIGURED, status: 'disabled' },
    });
  });

  test('says nothing is installed for a foreign or absent config', async () => {
    const absent = {
      kind: 'returned',
      value: { platform: 'antigravity-cli', status: 'n/a', configPath: CONFIG_PATH },
    } as const;

    expect(await detection({ [CONFIG]: hooksConfig(FOREIGN) })).toEqual(absent);
    expect(await detection({})).toEqual(absent);
  });

  test('reports a config it cannot parse instead of guessing', async () => {
    expect(await detection({ [CONFIG]: '{ "cc-safety-net": {}, }\n' })).toMatchObject({
      kind: 'returned',
      value: {
        platform: 'antigravity-cli',
        status: 'n/a',
        configPath: CONFIG_PATH,
        errors: [
          expect.stringContaining(`Failed to parse Antigravity hooks config ${CONFIG_PATH}: `),
        ],
      },
    });
  });
});
