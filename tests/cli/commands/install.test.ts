import { describe, expect, test } from 'bun:test';
import {
  installCommand as portedInstallCommand,
  uninstallCommand as portedUninstallCommand,
  updateCommand as portedUpdateCommand,
} from '@/cli/commands/install';
import { getIntegrationDisplayName, installIntegrationMetadata } from '@/hosts/catalog';

describe('cli/commands/install', () => {
  test('each definition keeps its name, usage and description', () => {
    expect([portedInstallCommand, portedUninstallCommand, portedUpdateCommand]).toMatchObject([
      {
        name: 'install',
        usage: 'install [TARGET_FLAG]',
        description: 'Install CC Safety Net into a coding agent CLI',
      },
      {
        name: 'uninstall',
        usage: 'uninstall [TARGET_FLAG]',
        description: 'Uninstall CC Safety Net from a coding agent CLI',
      },
      {
        name: 'update',
        usage: 'update',
        description: 'Update every installed CC Safety Net integration to the latest version',
      },
    ]);
  });

  test('every install target reaches the help, described by its catalog row', () => {
    for (const [command, verb] of [
      [portedInstallCommand, 'Install'],
      [portedUninstallCommand, 'Uninstall'],
    ] as const) {
      expect(command.options, verb).toEqual([
        ...installIntegrationMetadata.map((integration) => ({
          flags: integration.flag,
          description: `${verb} ${getIntegrationDisplayName(integration.id)} ${integration.artifactKind}`,
        })),
        { flags: '-h, --help', description: 'Show this help' },
      ]);
      expect(command.examples, verb).toEqual([
        `cc-safety-net ${command.name}`,
        ...installIntegrationMetadata.map(
          (integration) => `cc-safety-net ${command.name} ${integration.flag}`,
        ),
      ]);
    }
  });

  test('update takes no target of its own', () => {
    expect(portedUpdateCommand.options).toEqual([
      { flags: '-h, --help', description: 'Show this help' },
    ]);
    expect(portedUpdateCommand.examples).toEqual(['cc-safety-net update']);
  });
});
