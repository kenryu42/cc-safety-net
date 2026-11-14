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

function analyzeFromProject(command: string) {
  const root = createTempRoot('powershell-script-');
  writeTree(root, {
    home: null,
    'project/helpers.ps1': 'function Get-Hello { "hi" }\n',
    'project/reset.ps1': 'git reset --hard\n',
  });
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

const resetBlock = { kind: 'deny', ruleId: 'git.reset-hard' } as const;

test.skipIf(process.platform !== 'win32').each([
  [String.raw`. .\helpers.ps1; Get-Hello`, null],
  [String.raw`. .\reset.ps1`, resetBlock],
  [String.raw`Import-Module .\reset.ps1`, resetBlock],
  [String.raw`& .\reset.ps1`, resetBlock],
  [String.raw`.\reset.ps1`, resetBlock],
  [String.raw`pwsh -NoProfile -File .\reset.ps1`, resetBlock],
])('a local .ps1 is read: %s', (command, expected) => {
  const result = analyzeFromProject(command);
  expect(result === null ? null : { kind: result.kind, ruleId: result.ruleId }).toEqual(expected);
});
