import { afterEach, expect, test } from 'bun:test';
import { join, sep } from 'node:path';
import { runRuleCommand } from '@/cli/rule/index';
import { runCliCommand, runCliDifferential, seedFiles } from '../helpers/cli-differential';
import { removeTempRoots, withProcessEnv } from '../helpers/temp-home';

afterEach(removeTempRoots);

test('in-process rule output, return code and filesystem match the CLI', async () => {
  for (const args of [['list'], ['init', '--example'], ['--nope']]) {
    const row = { args: ['rule', ...args], env: { CC_SAFETY_NET_NO_UPDATE_CHECK: '1' } };
    const child = runCliDifferential(row);
    expect(child.exitCode).toBe(args[0] === '--nope' ? 1 : 0);
    expect(await runCliCommand(row, (environment) => runRuleCommand(environment, args))).toEqual(
      child,
    );
  }
});

test('captures both output channels and write callbacks inside an isolated process window', async () => {
  const cwd = process.cwd();
  const log = console.log;
  const write = process.stdout.write;
  const tty = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY');
  const columns = Object.getOwnPropertyDescriptor(process.stdout, 'columns');
  const expectRestored = () => {
    expect(process.cwd()).toBe(cwd);
    expect(process.env.CCSN_CAPTURE_TEST).toBeUndefined();
    expect(console.log).toBe(log);
    expect(process.stdout.write).toBe(write);
    expect(Object.getOwnPropertyDescriptor(process.stdout, 'isTTY')).toEqual(tty);
    expect(Object.getOwnPropertyDescriptor(process.stdout, 'columns')).toEqual(columns);
  };
  await withProcessEnv({ CC_SAFETY_NET_LEVEL: 'paranoid' }, async () => {
    const outcome = await runCliCommand(
      {
        args: [],
        seed: (side) => seedFiles(side, { 'project/sub': null }),
        cwd: (side) => join(side.project, 'sub'),
        env: { CCSN_CAPTURE_TEST: 'isolated' },
      },
      async (environment) => {
        await Promise.resolve();
        expect(environment.env.has('CC_SAFETY_NET_LEVEL')).toBeFalse();
        expect(process.env.CC_SAFETY_NET_LEVEL).toBeUndefined();
        expect(process.env.CCSN_CAPTURE_TEST).toBe('isolated');
        expect(process.cwd()).toEndWith(`${sep}project${sep}sub`);
        expect(process.stdout.isTTY).toBeFalsy();
        expect(process.stdout.columns).toBeUndefined();
        console.log('home=%s', environment.home);
        console.error('diagnostic');
        await new Promise<void>((resolve) => process.stdout.write('flushed\n', () => resolve()));
        process.stderr.write(Buffer.from('detail\n'));
        return 7;
      },
    );
    expect(outcome.stdout).toBe('home=<root>/home\nflushed\n');
    expect(outcome.stderr).toBe('diagnostic\ndetail\n');
    expect(outcome.exitCode).toBe(7);
    expect(process.env.CC_SAFETY_NET_LEVEL).toBe('paranoid');
  });
  expectRestored();

  for (const run of [
    () => {
      throw new Error('sync failure');
    },
    async () => {
      await Promise.resolve();
      throw new Error('async failure');
    },
  ]) {
    await expect(
      runCliCommand({ args: [], env: { CCSN_CAPTURE_TEST: 'failure' } }, run),
    ).rejects.toThrow('failure');
    expectRestored();
  }
});
