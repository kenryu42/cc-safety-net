import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { ProtectedGitMetadata } from '@/core/git/metadata';
import type { ShellKind } from '@/core/shell/model';
import { parseCommand } from '@/core/shell/parse';
import { projectCommandViews } from '@/core/shell/traversal';
import { analyzePowerShellCommandViewMatch } from '@/gate/analyzer/powershell/remove-item';
import { createRecursiveDeleteTargetContext } from '@/gate/analyzer/recursive-delete-targets';
import { pairedEnvironments } from '../../core/differential-inputs';
import { writeTree } from '../../helpers/fixture-tree';

let root = '';
let home = '';
let workspace = '';
let repoMetadata: ProtectedGitMetadata | null = null;

beforeAll(() => {
  root = realpathSync(mkdtempSync(join(tmpdir(), 'next-remove-item-')));
  home = join(root, 'home');
  workspace = join(root, 'work');
  writeTree(root, {
    'home/Documents': null,
    'work/build': null,
    'work/.git/hooks': null,
    temp: null,
  });
  const dotGit = join(workspace, '.git');
  repoMetadata = {
    entries: [dotGit],
    markerFiles: [join(dotGit, 'HEAD')],
    directories: [dotGit],
    hooksDirectories: [join(dotGit, 'hooks')],
  };
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

const REMOVE_ITEM_COMMANDS: readonly string[] = [
  'Remove-Item build',
  'Remove-Item -Recurse -Force build',
  'Remove-Item -Recurse -Force ..',
  'Remove-Item -Recurse -Force .',
  'Remove-Item -Recurse -Force /',
  'Remove-Item /',
  'Remove-Item -Force ~',
  'Remove-Item -Recurse -Force C:\\',
  'Remove-Item -Recurse -Force $env:USERPROFILE',
  'Remove-Item -Recurse -Force $env:USERPROFILE\\Documents',
  'Remove-Item -Recurse -Force $env:HOME',
  'Remove-Item -Recurse -Force ~',
  'Remove-Item -Recurse -Force $HOME',
  'Remove-Item -Recurse -Force $target',
  'Remove-Item -Recurse -Force',
  'Remove-Item -Recurse',
  'Remove-Item -Force build',
  'Remove-Item -Rec -Fo build',
  'Remove-Item -r -f build',
  'Remove-Item -Recurse:$true -Force:$true build',
  'Remove-Item -Recurse -Force -WhatIf build',
  'Remove-Item -Recurse -Force -WhatIf:$false build',
  'Remove-Item -Recurse -Force -wi build',
  'Remove-Item -Path build -Recurse -Force',
  'Remove-Item -Path:build -Recurse -Force',
  'Remove-Item -LiteralPath build -Recurse -Force',
  'Remove-Item -p build -Recurse -Force',
  'Remove-Item -Path -Recurse -Force',
  'Remove-Item -Recurse -Force ./build -Path',
  'Remove-Item -Recurse -Force -- -weird',
  'Remove-Item -Recurse -Force a, b',
  'Remove-Item -Recurse -Force a,b',
  'Remove-Item -Recurse -Force .git',
  'Remove-Item -Recurse -Force .git\\hooks',
  'Remove-Item -Force .git\\HEAD',
  'Remove-Item .git\\hooks\\pre-commit',
  'Remove-Item -Recurse -Force \\\\?\\C:\\Temp',
  'ri -Recurse -Force build',
  'del -Recurse -Force build',
  'erase -Recurse -Force build',
  'rd -Recurse -Force build',
  'rm -Recurse -Force build',
  'rmdir -Recurse -Force build',
  '& Remove-Item -Recurse -Force build',
  '. Remove-Item -Recurse -Force build',
  '& Remove-Item',
  'Get-ChildItem | Remove-Item -Recurse -Force',
  'Get-ChildItem | Remove-Item build',
  'Get-ChildItem | Remove-Item -Recurse -Force build',
  'Remove-Item -Recurse -Force $env:TEMP\\x',
  'Remove-Item -Recurse -Force "quoted dir"',
  "Remove-Item -Recurse -Force 'quoted dir'",
  'Write-Output x',
];

type RemoveItemCase = {
  readonly label: string;
  readonly cwd?: string;
  readonly strict?: boolean;
  readonly paranoid?: boolean;
  readonly metadata?: boolean;
  readonly disablePipelineRule?: boolean;
};

function removeItemCases(): readonly RemoveItemCase[] {
  return [
    { label: 'workspace', cwd: workspace },
    { label: 'workspace, strict', cwd: workspace, strict: true },
    { label: 'workspace, paranoid', cwd: workspace, paranoid: true },
    { label: 'workspace, strict with metadata', cwd: workspace, strict: true, metadata: true },
    { label: 'home as cwd', cwd: home, strict: true },
    { label: 'no cwd', strict: true },
    {
      label: 'pipeline rule disabled by policy',
      cwd: workspace,
      strict: true,
      disablePipelineRule: true,
    },
  ];
}

function optionsFor(row: RemoveItemCase) {
  return {
    cwd: row.cwd ?? workspace,
    originalCwd: row.cwd ?? workspace,
    strict: row.strict,
    paranoid: row.paranoid,
    protectedGitMetadata: row.metadata ? repoMetadata : null,
    policy: row.disablePipelineRule
      ? {
          destructiveCommandProtectionEnabled: true,
          effectiveDestructiveCommandRules: {
            'powershell.remove-item-pipeline-dynamic-target': {
              enabled: false,
              inheritedEnabled: true,
              changesInherited: true,
              source: 'rule_override' as const,
            },
          },
        }
      : undefined,
  };
}

function viewPairs(source: string, dialect: ShellKind) {
  return projectCommandViews(parseCommand(source, dialect));
}

describe('powershell Remove-Item', () => {
  function matchFor(source: string, label: string, piped = false) {
    const row = removeItemCases().find((option) => option.label === label);
    if (!row) throw new Error(`unknown case: ${label}`);
    const view = viewPairs(source, 'powershell')[0];
    if (!view) throw new Error(`no command view in: ${source}`);
    return analyzePowerShellCommandViewMatch(view, piped, {
      ...optionsFor(row),
      environment: pairedEnvironments({ HOME: home, TMPDIR: join(root, 'temp') }, home),
    });
  }

  const ruleIdFor = (source: string, label: string, piped = false) =>
    matchFor(source, label, piped)?.id ?? null;

  test('a root or home target is catastrophic, recursive or not', () => {
    const rows: readonly { readonly source: string; readonly id: string | null }[] = [
      {
        source: 'Remove-Item -Recurse -Force /',
        id: 'powershell.remove-item-recursive-force-root-or-home',
      },
      {
        source: 'Remove-Item -Recurse -Force C:\\',
        id: 'powershell.remove-item-recursive-force-root-or-home',
      },
      {
        source: 'Remove-Item -Recurse -Force ~',
        id: 'powershell.remove-item-recursive-force-root-or-home',
      },
      {
        source: 'Remove-Item -Recurse -Force $HOME',
        id: 'powershell.remove-item-recursive-force-root-or-home',
      },
      {
        source: 'Remove-Item -Recurse -Force $env:USERPROFILE',
        id: 'powershell.remove-item-recursive-force-root-or-home',
      },
      {
        source: 'Remove-Item -Recurse -Force $env:HOME',
        id: 'powershell.remove-item-recursive-force-root-or-home',
      },
      { source: 'Remove-Item /', id: 'powershell.remove-item-root-or-home' },
      { source: 'Remove-Item -Force ~', id: 'powershell.remove-item-root-or-home' },
    ];
    for (const row of rows) expect(ruleIdFor(row.source, 'workspace'), row.source).toBe(row.id);
    expect(matchFor('Remove-Item -Recurse -Force /', 'workspace')).toStrictEqual({
      id: 'powershell.remove-item-recursive-force-root-or-home',
      reason:
        'PowerShell Remove-Item targeting root or home directory is extremely dangerous and always blocked.',
      intent: 'hard_stop',
    });
  });

  test('the switches decide whether a target is deleted recursively at all', () => {
    const rows: readonly { readonly source: string; readonly id: string | null }[] = [
      {
        source: 'Remove-Item -Recurse -Force .',
        id: 'powershell.remove-item-recursive-force-cwd-self',
      },
      {
        source: 'Remove-Item -Recurse -Force ..',
        id: 'powershell.remove-item-recursive-force-outside-cwd',
      },
      { source: 'Remove-Item -Recurse -Force build', id: null },
      { source: 'Remove-Item build', id: null },
      { source: 'Remove-Item -Force build', id: null },
      { source: 'Remove-Item -Rec -Fo .', id: 'powershell.remove-item-recursive-force-cwd-self' },
      { source: 'Remove-Item -r -f .', id: null },
      {
        source: 'Remove-Item -Recurse:$true -Force:$true .',
        id: 'powershell.remove-item-recursive-force-cwd-self',
      },
      { source: 'Remove-Item -Recurse -Force -WhatIf .', id: null },
      { source: 'Remove-Item -Recurse -Force -wi .', id: null },
      {
        source: 'Remove-Item -Recurse -Force -WhatIf:$false .',
        id: 'powershell.remove-item-recursive-force-cwd-self',
      },
      {
        source: '& Remove-Item -Recurse -Force .',
        id: 'powershell.remove-item-recursive-force-cwd-self',
      },
      {
        source: '. Remove-Item -Recurse -Force .',
        id: 'powershell.remove-item-recursive-force-cwd-self',
      },
      { source: '& Remove-Item', id: null },
      { source: 'Write-Output x', id: null },
    ];
    for (const row of rows) expect(ruleIdFor(row.source, 'workspace'), row.source).toBe(row.id);
    for (const alias of ['ri', 'del', 'erase', 'rd', 'rm', 'rmdir'])
      expect(ruleIdFor(`${alias} -Recurse -Force ..`, 'workspace'), alias).toBe(
        'powershell.remove-item-recursive-force-outside-cwd',
      );
  });

  test('the path parameters and array commas decide which words are targets', () => {
    const rows: readonly { readonly source: string; readonly id: string | null }[] = [
      { source: 'Remove-Item -Path build -Recurse -Force', id: null },
      { source: 'Remove-Item -Path:build -Recurse -Force', id: null },
      { source: 'Remove-Item -LiteralPath build -Recurse -Force', id: null },
      { source: 'Remove-Item -p build -Recurse -Force', id: null },
      { source: 'Remove-Item -Recurse -Force a, b', id: null },
      { source: 'Remove-Item -Recurse -Force a,b', id: null },
      {
        source: 'Remove-Item -Recurse -Force .\\dist,..',
        id: 'powershell.remove-item-recursive-force-outside-cwd',
      },
      { source: 'Remove-Item -Recurse -Force -- -weird', id: null },
      {
        source: 'Remove-Item -Recurse -Force -- .',
        id: 'powershell.remove-item-recursive-force-cwd-self',
      },
    ];
    for (const row of rows) expect(ruleIdFor(row.source, 'workspace'), row.source).toBe(row.id);
  });

  test('an unverifiable target or pipeline input is reported in strict mode only', () => {
    for (const source of [
      'Remove-Item -Recurse -Force $target',
      'Remove-Item -Recurse -Force',
      'Remove-Item -Recurse -Force ./build -Path',
    ]) {
      expect(ruleIdFor(source, 'workspace'), source).toBeNull();
      expect(ruleIdFor(source, 'workspace, strict'), source).toBe(
        'powershell.remove-item-recursive-force-dynamic-target',
      );
    }
    expect(ruleIdFor('Remove-Item -Path -Recurse -Force', 'workspace, strict')).toBeNull();
    expect(ruleIdFor('Remove-Item -Recurse -Force build', 'workspace, strict', true)).toBe(
      'powershell.remove-item-pipeline-dynamic-target',
    );
    expect(ruleIdFor('Remove-Item -Recurse -Force build', 'workspace', true)).toBeNull();
    expect(ruleIdFor('Remove-Item build', 'workspace, strict', true)).toBeNull();
    expect(
      ruleIdFor('Remove-Item -Recurse -Force build', 'pipeline rule disabled by policy', true),
    ).toBeNull();
  });

  test('the anchored directory, the paranoid tier and Git metadata each change the verdict', () => {
    const rows: readonly {
      readonly label: string;
      readonly source: string;
      readonly id: string | null;
    }[] = [
      {
        label: 'home as cwd',
        source: 'Remove-Item -Recurse -Force Documents',
        id: 'powershell.remove-item-recursive-force-home-cwd',
      },
      {
        label: 'workspace, strict',
        source: 'Remove-Item -Recurse -Force ..',
        id: 'powershell.remove-item-recursive-force-outside-cwd',
      },
      {
        label: 'workspace, paranoid',
        source: 'Remove-Item -Recurse -Force build',
        id: 'powershell.remove-item-recursive-force-paranoid',
      },
      { label: 'workspace, paranoid', source: 'Remove-Item build', id: null },
      {
        label: 'workspace, strict with metadata',
        source: 'Remove-Item -Recurse -Force .git',
        id: 'powershell.remove-item-git-metadata',
      },
      {
        label: 'workspace, strict with metadata',
        source: 'Remove-Item -Recurse -Force .git\\hooks',
        id: 'powershell.remove-item-git-metadata',
      },
      {
        label: 'workspace, strict with metadata',
        source: 'Remove-Item .git\\hooks\\pre-commit',
        id: 'powershell.remove-item-git-metadata',
      },
      { label: 'workspace, strict', source: 'Remove-Item -Recurse -Force .git', id: null },
    ];
    for (const row of rows)
      expect(ruleIdFor(row.source, row.label), `${row.label}: ${row.source}`).toBe(row.id);
    expect(matchFor('Remove-Item -Recurse -Force build', 'workspace, paranoid')).toStrictEqual({
      id: 'powershell.remove-item-recursive-force-paranoid',
      reason:
        'PowerShell Remove-Item -Recurse -Force for non-temporary paths is blocked by the active safety policy. Retry deleting only explicit paths inside the current directory; escalate for anything outside it.',
      intent: 'scope_down',
    });
  });

  test('the table reaches every Remove-Item rule', () => {
    const reported = new Set(
      removeItemCases().flatMap((row) => {
        const paired = pairedEnvironments({ HOME: home }, home);
        const options = { ...optionsFor(row), environment: paired };
        return REMOVE_ITEM_COMMANDS.flatMap((source) =>
          viewPairs(source, 'powershell').flatMap((view) =>
            [false, true].flatMap((hasPipelineInput) => {
              const match = analyzePowerShellCommandViewMatch(view, hasPipelineInput, options);
              return match ? [match.id] : [];
            }),
          ),
        );
      }),
    );
    expect([...reported].sort()).toStrictEqual([
      'powershell.remove-item-git-metadata',
      'powershell.remove-item-pipeline-dynamic-target',
      'powershell.remove-item-recursive-force-cwd-self',
      'powershell.remove-item-recursive-force-dynamic-target',
      'powershell.remove-item-recursive-force-home-cwd',
      'powershell.remove-item-recursive-force-outside-cwd',
      'powershell.remove-item-recursive-force-paranoid',
      'powershell.remove-item-recursive-force-root-or-home',
      'powershell.remove-item-root-or-home',
    ]);
  });

  test('a caller-supplied delete-target context overrides the one built from the options', () => {
    const paired = pairedEnvironments({ HOME: home }, home);
    const anchoredAtHome = { cwd: home, originalCwd: home, protectedGitMetadata: null };
    const options = { cwd: workspace, originalCwd: workspace, protectedGitMetadata: null };
    for (const view of viewPairs('Remove-Item -Recurse -Force build', 'powershell')) {
      const next = analyzePowerShellCommandViewMatch(
        view,
        false,
        { ...options, environment: paired },
        createRecursiveDeleteTargetContext({ ...anchoredAtHome, environment: paired }),
      );
      expect(next?.id).toBe('powershell.remove-item-recursive-force-home-cwd');
      expect(
        analyzePowerShellCommandViewMatch(view, false, {
          ...options,
          environment: paired,
        }),
      ).toBeNull();
    }
  });

  test('-WhatIf disarms the command and an unabbreviated alias is still recognized', () => {
    const paired = pairedEnvironments({ HOME: home }, home);
    const options = {
      cwd: workspace,
      originalCwd: workspace,
      protectedGitMetadata: null,
      environment: paired,
    };
    const analyze = (source: string, piped = false) =>
      viewPairs(source, 'powershell').map(
        (view) => analyzePowerShellCommandViewMatch(view, piped, options)?.id ?? null,
      );
    expect(analyze('Remove-Item -Recurse -Force ..')).toStrictEqual([
      'powershell.remove-item-recursive-force-outside-cwd',
    ]);
    expect(analyze('Remove-Item -Recurse -Force -WhatIf ..')).toStrictEqual([null]);
    expect(analyze('rd -Recurse -Force ..')).toStrictEqual([
      'powershell.remove-item-recursive-force-outside-cwd',
    ]);
    expect(analyze('Write-Output ..')).toStrictEqual([null]);
  });
});
