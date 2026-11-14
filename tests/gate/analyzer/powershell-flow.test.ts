import { afterEach, expect, test } from 'bun:test';
import { join } from 'node:path';
import { loadPolicySnapshot } from '@/core/policy/snapshot';
import { analyzeCommand } from '@/gate/analyzer';
import { writeTree } from '../../helpers/fixture-tree';
import { testModes } from '../../helpers/policy';
import {
  createTempRoot,
  environmentFor,
  isolationEnv,
  removeTempRoots,
} from '../../helpers/temp-home';

afterEach(removeTempRoots);

function analyzeFromProject(command: string, tree: Parameters<typeof writeTree>[1]) {
  const root = createTempRoot('powershell-flow-');
  writeTree(root, { home: null, ...tree });
  const home = join(root, 'home');
  const cwd = join(root, 'project');
  const environment = environmentFor(home, isolationEnv(home));
  return analyzeCommand(command, {
    environment,
    cwd,
    shell: 'powershell',
    policySnapshot: loadPolicySnapshot(environment, { cwd }),
    effectiveCapabilities: testModes().capabilities,
    protectedGitMetadata: null,
  });
}

test.each([
  'Write-Output { Set-Location child }',
  'Start-Job { Set-Location child }',
  '$block = { Set-Location child }',
  'if ($false) { Set-Location child }',
])('an isolated script block leaves the parent directory unchanged: %s', (prefix) => {
  expect(
    analyzeFromProject(`${prefix}; Remove-Item build -Recurse -Force`, {
      'project/child': null,
      'project/build': null,
    }),
  ).toBeNull();
});

test.each([
  'Set-Location child',
  "'child' | Set-Location",
  'Write-Output child | Set-Location',
  "iex 'Set-Location child'",
  "Invoke-Expression -Command 'Set-Location child'",
])('a real directory change via %s makes relative deletion cwd unknown', (prefix) => {
  expect(
    analyzeFromProject(`${prefix}; Remove-Item ../sibling -Recurse -Force`, {
      'project/child': null,
      'project/sibling': null,
    }),
  ).toMatchObject({ kind: 'deny', ruleId: 'powershell.remove-item-recursive-force-outside-cwd' });
});

test('a PowerShell location change cannot relax deletion outside the initial workspace', () => {
  expect(
    analyzeFromProject('Set-Location ..; Remove-Item sibling -Recurse -Force', {
      project: null,
      sibling: null,
    }),
  ).toMatchObject({ kind: 'deny', ruleId: 'powershell.remove-item-recursive-force-outside-cwd' });
});

test.each([
  "$home = 'D:\\temp'; Remove-Item -Recurse -Force $home",
  "$home = Join-Path $env:TEMP 'isolated'\nWrite-Output $home\nRemove-Item -Recurse -Force $home",
])('an assignment to the read-only $HOME leaves a deletion aimed at home: %s', (command) => {
  expect(analyzeFromProject(command, { project: null })).toMatchObject({
    kind: 'deny',
    ruleId: 'powershell.remove-item-recursive-force-root-or-home',
  });
});

const scripts = {
  'project/helpers.ps1': 'function Get-Hello { "hi" }\n',
  'project/reset.ps1': 'git reset --hard\n',
};
const resetBlock = { kind: 'deny', ruleId: 'git.reset-hard' } as const;

test.skipIf(process.platform !== 'win32').each([
  [String.raw`. .\helpers.ps1; Get-Hello`, null],
  [String.raw`. .\reset.ps1`, resetBlock],
  [String.raw`Import-Module .\reset.ps1`, resetBlock],
  [String.raw`& .\reset.ps1`, resetBlock],
  [String.raw`.\reset.ps1`, resetBlock],
  [String.raw`pwsh -NoProfile -File .\reset.ps1`, resetBlock],
])('a local .ps1 is read: %s', (command, expected) => {
  const result = analyzeFromProject(command, scripts);
  expect(result === null ? null : { kind: result.kind, ruleId: result.ruleId }).toEqual(expected);
});
