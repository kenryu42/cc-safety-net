import { afterEach, describe, expect, test } from 'bun:test';
import { detect as detectKimi } from '@/hosts/kimi-code/detect';
import { installKimiCode, uninstallKimiCode } from '@/hosts/kimi-code/install';
import { expectRow, fileAt, hostRunner } from '../../helpers/host-differential';
import { removeTempRoots } from '../../helpers/temp-home';

const TOML = '.kimi-code/config.toml';
const MANAGED = 'npx -y cc-safety-net hook --kimi-code';
const HOOK_BLOCK = `[[hooks]]\nevent = "PreToolUse"\ncommand = "${MANAGED}"`;
const INLINE_HOOK = `{ event = "PreToolUse", command = "${MANAGED}" }`;
const COMMENTED = '# top comment\nmodel = "x" # trailing\n\n[model]\nname = "y"\n';
const INLINE_SEED = 'hooks = [\n  { event = "PostToolUse", command = "echo" }, # keep\n]\n';

const CONFIGURED = {
  platform: 'kimi-code',
  status: 'configured',
  method: 'hook config',
  configPath: `<home>/${TOML}`,
} as const;

const { row, detection } = hostRunner({
  ported: (environment) => ({
    install: () => installKimiCode(environment),
    detect: () => detectKimi({ environment, cwd: environment.home }),
    uninstall: () => uninstallKimiCode(environment),
  }),
});

afterEach(removeTempRoots);

describe('the Kimi Code hook config differential', () => {
  test('writes the hook block when the host has no config', async () => {
    expectRow((await row({})).steps, {
      file: TOML,
      alreadyInstalled: false,
      wrote: `${HOOK_BLOCK}\n`,
      detected: CONFIGURED,
      left: '\n',
    });
  });

  test('appends the block after the config the user wrote, and gives it back untouched', async () => {
    expectRow((await row({ [TOML]: COMMENTED })).steps, {
      file: TOML,
      alreadyInstalled: false,
      wrote: `${COMMENTED}\n${HOOK_BLOCK}\n`,
      detected: CONFIGURED,
      left: COMMENTED,
    });
  });

  test('joins an inline hooks array as one more item, and takes only that item back out', async () => {
    expectRow((await row({ [TOML]: INLINE_SEED })).steps, {
      file: TOML,
      alreadyInstalled: false,
      wrote: `hooks = [\n  { event = "PostToolUse", command = "echo" }, # keep,\n     ${INLINE_HOOK}]\n`,
      detected: CONFIGURED,
      left: 'hooks = [\n  { event = "PostToolUse", command = "echo" }, # keep]\n',
    });
  });

  test('drops an empty inline hooks array so the block can take the key over', async () => {
    expectRow((await row({ [TOML]: 'hooks = []\n[model]\nname = "y"\n' })).steps, {
      file: TOML,
      alreadyInstalled: false,
      wrote: `[model]\nname = "y"\n\n${HOOK_BLOCK}\n`,
      detected: CONFIGURED,
      left: '[model]\nname = "y"\n',
    });
  });

  test('reports a config that already runs the hook without touching it', async () => {
    expectRow((await row({ [TOML]: `${HOOK_BLOCK}\n` })).steps, {
      file: TOML,
      alreadyInstalled: true,
      wrote: `${HOOK_BLOCK}\n`,
      detected: CONFIGURED,
      left: '\n',
    });
  });

  test.each([
    ['a string that never closes', 'hooks = [ "abc\n', 'Unterminated string in Kimi Code config'],
    [
      'an array that never closes',
      'hooks = [ { event = "PreToolUse" }\n',
      'Unmatched hooks array in Kimi Code config',
    ],
  ])('refuses %s instead of rewriting the config', async (_label, seed, message) => {
    const { steps, tree } = await row({ [TOML]: seed });

    expect(steps?.install.result).toEqual({ ok: false, error: { name: 'Error', message } });
    expect(fileAt(tree, TOML)).toBe(seed);
  });

  test('takes its own block back out and leaves the table that follows it', async () => {
    const table = '[model]\nname = "y"\n';
    expectRow((await row({ [TOML]: `${HOOK_BLOCK}\n\n${table}` })).steps, {
      file: TOML,
      alreadyInstalled: true,
      wrote: `${HOOK_BLOCK}\n\n${table}`,
      detected: CONFIGURED,
      left: `\n${table}`,
    });
  });

  test('follows KIMI_CODE_HOME out of the home directory', async () => {
    const relocated = 'kimi-home/config.toml';
    const { steps } = await row({}, { KIMI_CODE_HOME: '<home>/kimi-home' });

    expect(fileAt(steps?.install.tree, TOML)).toBeUndefined();
    expectRow(steps, {
      file: relocated,
      alreadyInstalled: false,
      wrote: `${HOOK_BLOCK}\n`,
      detected: { ...CONFIGURED, configPath: `<home>/${relocated}` },
      left: '\n',
    });
  });
});

describe('the Kimi Code detector differential', () => {
  test('finds the managed hook', async () => {
    expect(await detection({ [TOML]: `${HOOK_BLOCK}\n` })).toEqual({
      kind: 'returned',
      value: CONFIGURED,
    });
  });

  test('says nothing is installed for a foreign or absent config', async () => {
    const absent = {
      kind: 'returned',
      value: { platform: 'kimi-code', status: 'n/a', configPath: `<home>/${TOML}` },
    } as const;

    expect(await detection({ [TOML]: COMMENTED })).toEqual(absent);
    expect(await detection({})).toEqual(absent);
  });

  test('reports a config it cannot read instead of guessing', async () => {
    expect(await detection({ [TOML]: null })).toMatchObject({
      kind: 'returned',
      value: {
        platform: 'kimi-code',
        status: 'n/a',
        configPath: `<home>/${TOML}`,
        errors: [expect.stringContaining(`Failed to read <home>/${TOML}: EISDIR`)],
      },
    });
  });
});
