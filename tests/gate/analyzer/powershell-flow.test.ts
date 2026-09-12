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
