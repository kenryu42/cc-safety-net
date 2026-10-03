import { afterEach, describe, expect, test } from 'bun:test';
import { join } from 'node:path';
import { detect as detectDevin } from '@/hosts/devin/detect';
import { getDevinConfigPath, installDevin, uninstallDevin } from '@/hosts/devin/install';
import { expectRow, fileAt, hostRunner } from '../../helpers/host-differential';
import { DEVIN_CONFIG, environmentFor, removeTempRoots } from '../../helpers/temp-home';

const CONFIG_PATH = `<home>/${DEVIN_CONFIG}`;
const OURS = {
  type: 'command',
  command: 'npx -y cc-safety-net hook --devin',
  timeout: 30,
};
const OUR_ENTRY = { hooks: [OURS] };
const AUDIT_ENTRY = {
  matcher: 'exec',
  hooks: [{ type: 'command', command: 'echo audit' }],
};
const NEIGHBOUR = { type: 'command', command: 'echo neighbour' };
const STOP = [{ hooks: [{ type: 'command', command: 'echo stop' }] }];
const DEVIN_OWNED = {
  version: 1,
  devin: { org_id: 'org-0123' },
  shell: 'zsh',
  theme_mode: 'dark',
};

const configText = (config: object) => `${JSON.stringify(config, null, 2)}\n`;

const configuredAt = (configPath: string) =>
  ({
    platform: 'devin',
    status: 'configured',
    method: 'hook config',
    configPath,
  }) as const;

const { row, detection } = hostRunner((environment) => ({
  install: () => installDevin(environment),
  detect: () => detectDevin({ environment, cwd: environment.home }),
  uninstall: () => uninstallDevin(environment),
}));

afterEach(removeTempRoots);

describe('the Devin CLI config path', () => {
  const environment = environmentFor('/u', {
    APPDATA: '/u/roaming',
    XDG_CONFIG_HOME: '/u/xdg',
  });

  test('follows XDG_CONFIG_HOME outside Windows', () => {
    expect(getDevinConfigPath(environment, 'linux')).toBe(join('/u/xdg', 'devin', 'config.json'));
    expect(getDevinConfigPath(environmentFor('/u', {}), 'darwin')).toBe(
      join('/u', '.config', 'devin', 'config.json'),
    );
  });

  test('follows APPDATA on Windows, defaulting to the roaming profile', () => {
    expect(getDevinConfigPath(environment, 'win32')).toBe(
      join('/u/roaming', 'devin', 'config.json'),
    );
    expect(getDevinConfigPath(environmentFor('/u', {}), 'win32')).toBe(
      join('/u', 'AppData', 'Roaming', 'devin', 'config.json'),
    );
  });
});

describe('the Devin CLI hook config differential', () => {
  test('creates a hooks-only config and keeps the file on uninstall', async () => {
    expectRow((await row({})).steps, {
      file: DEVIN_CONFIG,
      alreadyInstalled: false,
      wrote: configText({ hooks: { PreToolUse: [OUR_ENTRY] } }),
      detected: configuredAt(CONFIG_PATH),
      left: configText({ hooks: { PreToolUse: [] } }),
    });
  });

  test('keeps the settings Devin owns, other events and foreign handlers', async () => {
    const seed = configText({
      ...DEVIN_OWNED,
      hooks: {
        Stop: STOP,
        PreToolUse: [AUDIT_ENTRY, { hooks: [NEIGHBOUR, { ...OURS, timeout: 9 }] }],
      },
    });

    expectRow((await row({ [DEVIN_CONFIG]: seed })).steps, {
      file: DEVIN_CONFIG,
      alreadyInstalled: false,
      wrote: configText({
        ...DEVIN_OWNED,
        hooks: {
          Stop: STOP,
          PreToolUse: [AUDIT_ENTRY, { hooks: [NEIGHBOUR] }, OUR_ENTRY],
        },
      }),
      detected: configuredAt(CONFIG_PATH),
      left: configText({
        ...DEVIN_OWNED,
        hooks: {
          Stop: STOP,
          PreToolUse: [AUDIT_ENTRY, { hooks: [NEIGHBOUR] }],
        },
      }),
    });
  });

  test('reads a config that uses the comments Devin supports', async () => {
    const seed = [
      '{',
      '  // set by the Devin CLI',
      '  "version": 1,',
      '  /* organisation */ "devin": { "org_id": "org-0123" },',
      '  "shell": "zsh",',
      '  "theme_mode": "dark",',
      '  "hooks": { "Stop": [{ "hooks": [{ "type": "command", "command": "echo stop" }] }] }',
      '}',
      '',
    ].join('\n');

    expectRow((await row({ [DEVIN_CONFIG]: seed })).steps, {
      file: DEVIN_CONFIG,
      alreadyInstalled: false,
      wrote: configText({ ...DEVIN_OWNED, hooks: { Stop: STOP, PreToolUse: [OUR_ENTRY] } }),
      detected: configuredAt(CONFIG_PATH),
      left: configText({ ...DEVIN_OWNED, hooks: { Stop: STOP, PreToolUse: [] } }),
    });
  });

  test.skipIf(process.platform === 'win32')('writes under XDG_CONFIG_HOME', async () => {
    const file = 'xdg/devin/config.json';
    const seed = configText({ ...DEVIN_OWNED, hooks: { Stop: STOP } });

    expectRow((await row({ [file]: seed }, { XDG_CONFIG_HOME: '<home>/xdg' })).steps, {
      file,
      alreadyInstalled: false,
      wrote: configText({
        ...DEVIN_OWNED,
        hooks: { Stop: STOP, PreToolUse: [OUR_ENTRY] },
      }),
      detected: configuredAt('<home>/xdg/devin/config.json'),
      left: configText({
        ...DEVIN_OWNED,
        hooks: { Stop: STOP, PreToolUse: [] },
      }),
    });
  });

  test.each([
    ['unparseable JSON', '{ "hooks": {', 'Failed to parse Devin CLI config'],
    ['a root that is not an object', '"zsh"\n', 'must be a JSON object'],
    ['hooks that are not an object', '{"version": 1, "hooks": []}\n', '"hooks" must be an object'],
    [
      'a PreToolUse that is not an array',
      '{"version": 1, "hooks": {"PreToolUse": {}}}\n',
      '"hooks.PreToolUse" must be an array',
    ],
  ])('refuses %s and leaves the file byte-identical', async (_name, seed, reason) => {
    const { steps, tree } = await row({ [DEVIN_CONFIG]: seed });
    const refusal = {
      ok: false,
      error: { name: 'Error', message: expect.stringContaining(reason) },
    } as const;

    expect([steps?.install.result, steps?.uninstall.result]).toEqual([refusal, refusal]);
    expect(fileAt(tree, DEVIN_CONFIG)).toBe(seed);
  });
});

describe('the Devin CLI detector differential', () => {
  test('names a matcher that narrows coverage', async () => {
    const seed = configText({
      ...DEVIN_OWNED,
      hooks: { PreToolUse: [{ matcher: 'exec', hooks: [OURS] }] },
    });

    expect(await detection({ [DEVIN_CONFIG]: seed })).toEqual({
      kind: 'returned',
      value: {
        ...configuredAt(CONFIG_PATH),
        errors: ['Managed hook has a "matcher" that narrows coverage; reinstall to repair'],
      },
    });
  });

  test('reports an unparseable config instead of calling it absent', async () => {
    expect(await detection({ [DEVIN_CONFIG]: '{ "hooks": {' })).toEqual({
      kind: 'returned',
      value: {
        platform: 'devin',
        status: 'n/a',
        configPath: CONFIG_PATH,
        errors: [expect.stringContaining(`Failed to parse Devin CLI config ${CONFIG_PATH}: `)],
      },
    });
  });

  test('says nothing is installed when only Devin settings or foreign hooks exist', async () => {
    const absent = {
      kind: 'returned',
      value: { platform: 'devin', status: 'n/a', configPath: CONFIG_PATH },
    } as const;

    expect(
      await detection({
        [DEVIN_CONFIG]: configText({
          ...DEVIN_OWNED,
          hooks: { PreToolUse: [AUDIT_ENTRY] },
        }),
      }),
    ).toEqual(absent);
    expect(await detection({})).toEqual(absent);
  });
});
