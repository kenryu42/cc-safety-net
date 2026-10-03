import { afterEach, describe, expect, test } from 'bun:test';
import { detect as detectDroid } from '@/hosts/droid/detect';
import { installDroid, uninstallDroid } from '@/hosts/droid/install';
import { expectRow, fileAt, hostRunner } from '../../helpers/host-differential';
import { removeTempRoots } from '../../helpers/temp-home';

const HOOKS = '.factory/hooks.json';
const HOOKS_PATH = `<home>/${HOOKS}`;
const MANAGED = 'npx -y cc-safety-net hook --droid';
const OURS = { type: 'command', command: MANAGED, timeout: 30 };
const CANONICAL_ENTRY = { hooks: [OURS] };
const SESSION_START = [{ hooks: [{ type: 'command', command: 'echo session' }] }];
const FOREIGN_ENTRY = { matcher: 'Execute', hooks: [{ type: 'command', command: 'echo audit' }] };
const SIBLING = { type: 'command', command: 'echo sibling' };

const droidHooks = (events: Record<string, unknown>) => `${JSON.stringify(events, null, 2)}\n`;

const CONFIGURED = {
  platform: 'droid',
  status: 'configured',
  method: 'hook config',
  configPath: HOOKS_PATH,
} as const;

const { row, detection } = hostRunner((environment) => ({
  install: () => installDroid(environment),
  detect: () => detectDroid({ environment, cwd: environment.home }),
  uninstall: () => uninstallDroid(environment),
}));

afterEach(removeTempRoots);

describe('the Factory Droid hook config differential', () => {
  test('creates the hooks file and deletes it once nothing else remains', async () => {
    expectRow((await row({})).steps, {
      file: HOOKS,
      alreadyInstalled: false,
      wrote: droidHooks({ PreToolUse: [CANONICAL_ENTRY] }),
      detected: CONFIGURED,
      left: undefined,
    });
  });

  test('keeps other events, foreign entries and sibling handlers through install and uninstall', async () => {
    const seed = droidHooks({
      SessionStart: SESSION_START,
      PreToolUse: [FOREIGN_ENTRY, { hooks: [SIBLING, { ...OURS, timeout: 5 }] }],
    });

    expectRow((await row({ [HOOKS]: seed })).steps, {
      file: HOOKS,
      alreadyInstalled: false,
      wrote: droidHooks({
        SessionStart: SESSION_START,
        PreToolUse: [FOREIGN_ENTRY, { hooks: [SIBLING] }, CANONICAL_ENTRY],
      }),
      detected: CONFIGURED,
      left: droidHooks({
        SessionStart: SESSION_START,
        PreToolUse: [FOREIGN_ENTRY, { hooks: [SIBLING] }],
      }),
    });
  });

  test('carries the settings.json fallback hooks into the hooks file it creates', async () => {
    const settings = `${JSON.stringify({
      model: 'custom',
      hooks: { SessionStart: SESSION_START, PreToolUse: [FOREIGN_ENTRY] },
    })}\n`;
    const { steps } = await row({ '.factory/settings.json': settings });

    expectRow(steps, {
      file: HOOKS,
      alreadyInstalled: false,
      wrote: droidHooks({
        SessionStart: SESSION_START,
        PreToolUse: [FOREIGN_ENTRY, CANONICAL_ENTRY],
      }),
      detected: CONFIGURED,
      left: droidHooks({ SessionStart: SESSION_START, PreToolUse: [FOREIGN_ENTRY] }),
    });
    expect(fileAt(steps?.uninstall.tree, '.factory/settings.json')).toBe(settings);
  });

  test('keeps the hooks file on uninstall so a settings.json fallback stays inactive', async () => {
    const settings = `${JSON.stringify({ hooks: { PreToolUse: [CANONICAL_ENTRY] } })}\n`;
    const { steps } = await row({ '.factory/settings.json': settings });

    expectRow(steps, {
      file: HOOKS,
      alreadyInstalled: false,
      wrote: droidHooks({ PreToolUse: [CANONICAL_ENTRY] }),
      detected: CONFIGURED,
      left: droidHooks({ PreToolUse: [] }),
    });
    expect(fileAt(steps?.uninstall.tree, '.factory/settings.json')).toBe(settings);
  });

  test.each([
    [
      '{ "PreToolUse": [',
      'Failed to parse Factory Droid hooks config',
      [expect.stringContaining(`Failed to parse Factory Droid hooks config ${HOOKS_PATH}: `)],
    ],
    ['[]\n', 'must be a JSON object', undefined],
    ['{"PreToolUse": {}}\n', '"PreToolUse" must be an array', undefined],
  ])('refuses %s without touching it', async (seed, reason, errors) => {
    const { steps, tree } = await row({ [HOOKS]: seed });
    const refusal = {
      ok: false,
      error: { name: 'Error', message: expect.stringContaining(reason) },
    } as const;

    expect(steps?.install.result).toEqual(refusal);
    expect(steps?.finalUninstall).toEqual(refusal);
    expect(fileAt(tree, HOOKS)).toBe(seed);
    expect(steps?.install.detection).toEqual({
      platform: 'droid',
      status: 'n/a',
      configPath: HOOKS_PATH,
      errors,
    });
  });
});

describe('the Factory Droid detector differential', () => {
  test('names the drift a reinstall would repair', async () => {
    expect(
      await detection({
        [HOOKS]: droidHooks({ PreToolUse: [{ matcher: 'Execute', hooks: [OURS] }] }),
      }),
    ).toEqual({
      kind: 'returned',
      value: {
        ...CONFIGURED,
        errors: ['Managed hook has a "matcher" that narrows coverage; reinstall to repair'],
      },
    });
    expect(
      await detection({
        [HOOKS]: droidHooks({ PreToolUse: [{ commandRegex: '^git ', hooks: [OURS] }] }),
      }),
    ).toEqual({
      kind: 'returned',
      value: {
        ...CONFIGURED,
        errors: ['Managed hook has a "commandRegex" that narrows coverage; reinstall to repair'],
      },
    });
  });

  test('says nothing is installed for a foreign or absent file', async () => {
    const absent = {
      kind: 'returned',
      value: { platform: 'droid', status: 'n/a', configPath: HOOKS_PATH },
    } as const;

    expect(await detection({ [HOOKS]: droidHooks({ PreToolUse: [FOREIGN_ENTRY] }) })).toEqual(
      absent,
    );
    expect(await detection({})).toEqual(absent);
  });
});
