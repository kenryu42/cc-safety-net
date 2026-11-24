import { afterEach, describe, expect, test } from 'bun:test';
import { join } from 'node:path';
import { DEEPSEEK_HARNESS_NPM_PROBE } from '@/hosts/catalog';
import {
  applyInstallTargetState,
  buildInstallTargetChoicesAsync,
  type InstallTargetChoice,
  probeInstallTarget,
} from '@/hosts/install/choices';
import type { NativeCommand } from '@/hosts/install/native';
import { type InstallTarget } from '@/hosts/install/targets';
import { createFakeBin, type FakeScriptEntry } from '../../helpers/fake-bin';
import { createTempRoot, removeTempRoots, withProcessEnv } from '../../helpers/temp-home';

const SCRIPT: readonly FakeScriptEntry[] = [
  { command: 'present', stdout: '1.0.0\n' },
  { command: 'broken', exit: 1 },
  { command: 'stalled', delayMs: 10_000 },
];

const CONFIGURED: readonly InstallTarget[] = ['cursor', 'pi'];
const ANSWERING = ['cursor --version', 'pi --version'];

const scriptedProbe = (command: NativeCommand) => ANSWERING.includes(command.join(' '));

const groupedReasons = (
  choices: readonly InstallTargetChoice[],
): { configured: readonly string[]; rest: readonly string[] } => {
  const distinct = (rows: readonly InstallTargetChoice[]) => [
    ...new Set(rows.map((row) => `${row.available} ${row.unavailableReason ?? ''}`.trim())),
  ];
  return {
    configured: distinct(choices.filter((choice) => CONFIGURED.includes(choice.target))),
    rest: distinct(choices.filter((choice) => !CONFIGURED.includes(choice.target))),
  };
};

afterEach(removeTempRoots);

describe('probing a host CLI', () => {
  test('a CLI on PATH is present however it answers; a missing one is not', async () => {
    const bin = createFakeBin(join(createTempRoot('next-probe-'), 'fake'), SCRIPT);
    const commands: NativeCommand[] = [
      ['present', '--version'],
      ['broken', '--version'],
      ['stalled', '--version'],
      ['absent', '--version'],
    ];
    const probed = await withProcessEnv(bin.env, () =>
      Promise.all(commands.map((command) => probeInstallTarget(command))),
    );
    expect(probed).toEqual([true, true, true, false]);
  });

  test('DeepSeek Harness counts only when the npm package answers, not when npx is on PATH', async () => {
    const probeWith = (exit: number) => {
      const bin = createFakeBin(join(createTempRoot('next-probe-'), 'fake'), [
        { command: 'npx', exit },
      ]);
      return withProcessEnv(bin.env, () => probeInstallTarget(DEEPSEEK_HARNESS_NPM_PROBE));
    };
    expect([await probeWith(0), await probeWith(1)]).toEqual([true, false]);
  });
});

describe('the install picker rows', () => {
  test.each([
    [undefined, { configured: ['true'], rest: ['false CLI not installed'] }],
    ['install', { configured: ['false already installed'], rest: ['false CLI not installed'] }],
    ['uninstall', { configured: ['true'], rest: ['false not installed'] }],
  ] as const)('uses independent availability reasons for %s', async (action, expected) => {
    const options = { action, configuredTargets: CONFIGURED };
    const base = await buildInstallTargetChoicesAsync(scriptedProbe);
    expect(groupedReasons(await buildInstallTargetChoicesAsync(scriptedProbe, options))).toEqual(
      expected,
    );
    expect(groupedReasons(applyInstallTargetState(base, options))).toEqual(expected);
  });

  test('offers Cursor when only the standalone cursor-agent CLI answers', async () => {
    const choices = await buildInstallTargetChoicesAsync(
      (command) => command.join(' ') === 'cursor-agent --version',
    );
    expect(choices.filter((choice) => choice.available).map((choice) => choice.target)).toEqual([
      'cursor',
    ]);
  });
});
