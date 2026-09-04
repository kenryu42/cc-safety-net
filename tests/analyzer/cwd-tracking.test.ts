import { describe, expect, test } from 'bun:test';
import { tmpdir } from 'node:os';
import { resolveCwdAfterCommandView } from '@/analyzer/segment';
import { parseCommand } from '@/parser/command';
import { projectCommandViews } from '@/parser/traversal';
import { TEST_ENVIRONMENT } from '../helpers/environment';

function powerShellCommand(source: string) {
  const view = projectCommandViews(parseCommand(source, 'powershell'))[0];
  if (!view) throw new Error(`Expected a PowerShell command view for: ${source}`);
  return view;
}

describe('command working-directory tracking', () => {
  test('tracks PowerShell location commands only while the resulting directory stays known', () => {
    const cwd = tmpdir();
    const target = `'${cwd.replaceAll("'", "''")}'`;
    for (const command of [`Set-Location ${target}`, `& Set-Location ${target}`]) {
      expect(
        resolveCwdAfterCommandView(powerShellCommand(command), cwd, TEST_ENVIRONMENT),
        command,
      ).toBe(cwd);
    }

    for (const command of [
      'Set-Location /other',
      'Set-Location Registry::HKLM',
      'Pop-Location',
      'Set-Location -Unknown value',
      `Set-Location -- ${target}`,
      `Microsoft.PowerShell.Management\\Set-Location ${target}`,
      `Set-Location FileSystem::${target}`,
      `Set-Location -LiteralPath:${target} -Verbose -ErrorAction Stop`,
      'Set-Location -StackName work',
    ]) {
      expect(
        resolveCwdAfterCommandView(powerShellCommand(command), cwd, TEST_ENVIRONMENT),
        command,
      ).toBeNull();
    }
  });

  test('uses literal pipeline input only when no explicit PowerShell path is present', () => {
    const cwd = tmpdir();
    expect(
      resolveCwdAfterCommandView(powerShellCommand('Set-Location'), cwd, TEST_ENVIRONMENT, cwd),
    ).toBe(cwd);
    expect(
      resolveCwdAfterCommandView(
        powerShellCommand('Set-Location /other'),
        cwd,
        TEST_ENVIRONMENT,
        cwd,
      ),
    ).toBeNull();
  });
});
