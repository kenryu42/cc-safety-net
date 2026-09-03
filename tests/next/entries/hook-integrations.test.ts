import { describe, expect, test } from 'bun:test';
import {
  type HookIntegration,
  findHookIntegrationByFlag as portedFindByFlag,
  findLegacyTopLevelHookIntegration as portedFindLegacy,
  hookIntegrations as portedIntegrations,
} from '@next/entries/hook-integrations';
import {
  getIntegrationDisplayName as portedDisplayName,
  integrationDisplayNames as portedDisplayNames,
  doctorIntegrationOrder as portedDoctorOrder,
  installIntegrationMetadata as portedInstallMetadata,
  runtimeHookIntegrationMetadata as portedRuntimeMetadata,
} from '@next/hosts/catalog';
import {
  findHookIntegrationByFlag as shippedFindByFlag,
  findLegacyTopLevelHookIntegration as shippedFindLegacy,
  hookIntegrations as shippedIntegrations,
} from '@/cli/hook-integrations';
import {
  type IntegrationId,
  getIntegrationDisplayName as shippedDisplayName,
  integrationDisplayNames as shippedDisplayNames,
  doctorIntegrationOrder as shippedDoctorOrder,
  installIntegrationMetadata as shippedInstallMetadata,
  runtimeHookIntegrationMetadata as shippedRuntimeMetadata,
} from '@/integrations/catalog';

/**
 * The hook table is what the bin resolves a flag through, so the port has to name the same
 * integrations under the same spellings and reject the same argument lists. Comparing ids rather
 * than the objects is deliberate: the two `run` functions are different closures over the two
 * implementations, and every other field is data the catalog owns.
 */

const HOOK_ARGS: readonly (readonly string[])[] = [
  [],
  ['--kimi-code'],
  ['-kc'],
  ['--coding-cli'],
  ['--claude-code'],
  ['-cc'],
  ['--agy-cli'],
  ['-ac'],
  ['--cursor'],
  ['--gemini-cli'],
  ['--copilot-cli'],
  ['--grok-build'],
  ['--hermes-agent'],
  ['--cursor', '--kimi-code'],
  ['--kimi-code', 'extra'],
  ['--kimi-code', '--unknown'],
  ['--help'],
];

const LEGACY_FLAGS: readonly (string | undefined)[] = [
  '-cc',
  '--claude-code',
  '-cp',
  '--copilot-cli',
  '-gc',
  '--gemini-cli',
  '--cursor',
  '--statusline',
  undefined,
];

const withoutRun = (integrations: readonly HookIntegration[]) =>
  integrations.map(({ run: _run, ...integration }) => integration);

describe('the ported hook table', () => {
  test('resolves the same integration for every hook argument list', () => {
    for (const args of HOOK_ARGS) {
      expect([args, portedFindByFlag(args)?.id]).toStrictEqual([args, shippedFindByFlag(args)?.id]);
    }
  });

  test('resolves the same integration for every legacy top-level flag', () => {
    for (const flag of LEGACY_FLAGS) {
      expect([flag, portedFindLegacy(flag)?.id]).toStrictEqual([flag, shippedFindLegacy(flag)?.id]);
    }
  });

  test('carries the same metadata for the same integrations in the same order', () => {
    expect(withoutRun(portedIntegrations)).toStrictEqual(withoutRun(shippedIntegrations));
  });
});

describe('the ported catalog', () => {
  test('projects the same four tables', () => {
    expect(portedRuntimeMetadata).toStrictEqual(shippedRuntimeMetadata);
    expect(portedInstallMetadata).toStrictEqual(shippedInstallMetadata);
    expect(portedDoctorOrder).toStrictEqual(shippedDoctorOrder);
    expect(portedDisplayNames).toStrictEqual(shippedDisplayNames);
  });

  test('names every integration the way the shipped catalog names it', () => {
    for (const id of Object.keys(shippedDisplayNames) as IntegrationId[]) {
      expect([id, portedDisplayName(id)]).toStrictEqual([id, shippedDisplayName(id)]);
    }
  });
});
