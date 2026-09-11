import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';
import type { ProtectedGitMetadata } from '@/core/git/metadata';
import type { EffectiveDestructiveCommandRuleState } from '@/core/policy/types';
import { parseCommand } from '@/core/shell/parse';
import { projectCommandViews } from '@/core/shell/traversal';
import { type AnalyzeRmOptions, analyzeRmMatch } from '@/gate/analyzer/rm';
import { pairedEnvironments } from '../../core/differential-inputs';
import { describeOutcome, writeTree } from '../../helpers/fixture-tree';

let root = '';
let home = '';
let workspace = '';
let gitMetadata: ProtectedGitMetadata = {
  entries: [],
  markerFiles: [],
  directories: [],
  hooksDirectories: [],
};

beforeAll(() => {
  root = realpathSync(mkdtempSync(join(tmpdir(), 'next-rm-')));
  home = join(root, 'home');
  workspace = join(root, 'work');
  writeTree(root, {
    'home/keep': null,
    'work/src': null,
    'work/.git/hooks': null,
    'work/.git/HEAD': 'ref: refs/heads/main\n',
    allowed: null,
    scratch: null,
  });
  const compared = (...parts: string[]) => {
    const path = join(workspace, ...parts)
      .split(sep)
      .join('/');
    return process.platform === 'win32' ? path.toLowerCase() : path;
  };
  gitMetadata = {
    entries: [compared('.git')],
    markerFiles: [compared('.git', 'HEAD')],
    directories: [compared('.git')],
    hooksDirectories: [compared('.git', 'hooks')],
  };
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

function ruleState(enabled: boolean): EffectiveDestructiveCommandRuleState {
  return { enabled, inheritedEnabled: !enabled, changesInherited: true, source: 'rule_override' };
}

type OptionCase = {
  readonly label: string;
  readonly env?: Record<string, string>;
  readonly options: Omit<AnalyzeRmOptions, 'environment' | 'protectedGitMetadata'> & {
    protectedGitMetadata?: ProtectedGitMetadata | null;
  };
};

function optionCases(): readonly OptionCase[] {
  return [
    { label: 'plain workspace', options: { cwd: workspace, originalCwd: workspace } },
    {
      label: 'strict',
      options: { cwd: workspace, originalCwd: workspace, strict: true },
    },
    {
      label: 'paranoid rm',
      options: { cwd: workspace, originalCwd: workspace, paranoid: true },
    },
    {
      label: 'paranoid rm disabled by policy',
      options: {
        cwd: workspace,
        originalCwd: workspace,
        paranoid: true,
        policy: {
          destructiveCommandProtectionEnabled: true,
          effectiveDestructiveCommandRules: { 'rm.recursive-force-paranoid': ruleState(false) },
        },
      },
    },
    {
      label: 'destructive protection disabled',
      options: {
        cwd: workspace,
        originalCwd: workspace,
        policy: {
          destructiveCommandProtectionEnabled: false,
          effectiveDestructiveCommandRules: {},
        },
      },
    },
    {
      label: 'allow paths cover a sibling directory',
      options: {
        cwd: workspace,
        originalCwd: workspace,
        policy: {
          destructiveCommandProtectionEnabled: true,
          effectiveDestructiveCommandRules: {},
          destructiveCommandAllowPaths: [join(root, 'allowed')],
        },
      },
    },
    {
      label: 'git metadata resolved',
      options: { cwd: workspace, originalCwd: workspace, protectedGitMetadata: gitMetadata },
    },
    {
      label: 'strict inside a nested directory',
      options: {
        cwd: join(workspace, 'src'),
        originalCwd: workspace,
        strict: true,
        protectedGitMetadata: gitMetadata,
      },
    },
    {
      label: 'home is the cwd',
      options: { cwd: home, originalCwd: home },
    },
    {
      label: 'no cwd at all',
      options: {},
    },
    {
      label: 'tmpdir trusted',
      env: { TMPDIR: join(root, 'scratch') },
      options: {
        cwd: workspace,
        originalCwd: workspace,
        allowTmpdirVar: true,
        trustedTmpdirValue: true,
      },
    },
    {
      label: 'tmpdir word splitting unsafe',
      env: { TMPDIR: join(root, 'scratch') },
      options: {
        cwd: workspace,
        originalCwd: workspace,
        allowTmpdirVar: true,
        trustedTmpdirValue: true,
        tmpdirWordSplittingUnsafe: true,
      },
    },
  ];
}

const RM_COMMANDS: readonly string[] = [
  'rm',
  'rm -rf',
  'rm --',
  'rm -rf --',
  'rm file.txt',
  'rm -r src',
  'rm -rf src',
  'rm -rf ./src',
  'rm -fr src',
  'rm -r -f src',
  'rm --recursive --force src',
  'rm --recursive src',
  'rm -rf src other',
  'rm -rf -- -weird-name',
  'rm -rf -- ../outside',
  'rm -rf ..',
  'rm -rf .',
  'rm -rf ./',
  'rm -rf *',
  'rm -rf /',
  'rm -rf /*',
  'rm -rf ~',
  'rm -rf ~/keep',
  'rm -rf $HOME',
  'rm -rf "$HOME"',
  'rm -rf ${HOME}/keep',
  'rm -rf $UNKNOWN/x',
  'rm -rf "$UNKNOWN"',
  'rm -rf $TMPDIR',
  'rm -rf $TMPDIR/build',
  'rm -rf "$TMPDIR"/build',
  'rm -rf ${TMPDIR}/build',
  'rm -rf /tmp/scratch-dir',
  'rm -rf /var/tmp/scratch-dir',
  'rm -rf {a,b}',
  'rm -rf {a,b}/{c,d}',
  'rm -rf x{1..3}',
  'rm -rf {a,b}{c,d}{e,f}{g,h}{i,j}{k,l}{m,n}',
  'rm -rf "quoted dir"',
  "rm -rf 'quoted dir'",
  'rm -rf escaped\\ dir',
  'rm .git',
  'rm .git/HEAD',
  'rm -f .git/hooks/pre-commit',
  'rm -rf .git',
  'rm -rf .git/hooks',
  'rm -rf .git/*',
  'rm -r .git',
  'rm -rf ../work',
  'rm -rf /nonexistent/elsewhere',
  'rm -rf -- "$(pwd)"',
  'rm -rf `pwd`',
  'rmdir src',
  'rm -rf allowed',
  'rm -rf allowed/inner',
];

function rmWords(source: string) {
  return projectCommandViews(parseCommand(source, 'posix')).flatMap((view) =>
    view.words[0]?.text === 'rm' ? [view.words] : [],
  );
}

function runPair(source: string, row: OptionCase) {
  const paired = pairedEnvironments({ HOME: home, ...row.env }, home);
  const options = { protectedGitMetadata: null, ...row.options };
  return rmWords(source).map((words) =>
    describeOutcome(() => analyzeRmMatch(words, { ...options, environment: paired })),
  );
}

describe('rm rule set', () => {
  function ruleIdFor(source: string, label: string): string | null {
    const row = optionCases().find((option) => option.label === label);
    if (!row) throw new Error(`unknown option case: ${label}`);
    const outcome = runPair(source, row)[0];
    if (!outcome) throw new Error(`no rm command in: ${source}`);
    if (!outcome.ok) throw new Error(`${label}: ${source} threw ${outcome.error.name}`);
    return outcome.value?.id ?? null;
  }

  test('a root or home target is catastrophic however it is spelled', () => {
    const rows: readonly { readonly source: string; readonly id: string | null }[] = [
      { source: 'rm -rf /', id: 'rm.recursive-force-root-or-home' },
      { source: 'rm -rf /*', id: 'rm.recursive-force-root-or-home' },
      { source: 'rm -rf ~', id: 'rm.recursive-force-root-or-home' },
      { source: 'rm -rf $HOME', id: 'rm.recursive-force-root-or-home' },
      { source: 'rm -rf "$HOME"', id: 'rm.recursive-force-root-or-home' },
      { source: 'rm -r /', id: 'rm.recursive-force-root-or-home' },
      { source: 'rm -rf ~/keep', id: 'rm.recursive-force-outside-cwd' },
      { source: 'rm -rf ${HOME}/keep', id: null },
    ];
    for (const row of rows)
      expect(ruleIdFor(row.source, 'plain workspace'), row.source).toBe(row.id);
    const words = rmWords('rm -rf /')[0];
    if (!words) throw new Error('missing root command');
    expect(
      analyzeRmMatch(words, {
        environment: pairedEnvironments({ HOME: home }, home),
        protectedGitMetadata: null,
        cwd: workspace,
        originalCwd: workspace,
      }),
    ).toStrictEqual({
      id: 'rm.recursive-force-root-or-home',
      reason: 'rm -rf targeting root or home directory is extremely dangerous and always blocked.',
      intent: 'hard_stop',
    });
  });

  test('a recursive force target is judged against the anchored cwd', () => {
    const rows: readonly { readonly source: string; readonly id: string | null }[] = [
      { source: 'rm -rf src', id: null },
      { source: 'rm -rf ./src', id: null },
      { source: 'rm -fr src', id: null },
      { source: 'rm --recursive --force src', id: null },
      { source: 'rm -rf "quoted dir"', id: null },
      { source: 'rm -r src', id: null },
      { source: 'rm file.txt', id: null },
      { source: 'rm -rf -- -weird-name', id: null },
      { source: 'rm -rf .', id: 'rm.recursive-force-cwd-self' },
      { source: 'rm -rf ./', id: 'rm.recursive-force-cwd-self' },
      { source: 'rm -rf ..', id: 'rm.recursive-force-outside-cwd' },
      { source: 'rm -rf -- ../outside', id: 'rm.recursive-force-outside-cwd' },
      { source: 'rm -rf /nonexistent/elsewhere', id: 'rm.recursive-force-outside-cwd' },
      { source: 'rm -rf {a,b}', id: null },
      { source: 'rm -rf {a,b}/{c,d}', id: null },
      { source: 'rm -rf x{1..3}', id: 'rm.recursive-force-outside-cwd' },
    ];
    for (const row of rows)
      expect(ruleIdFor(row.source, 'plain workspace'), row.source).toBe(row.id);
  });

  test('the temp roots and $TMPDIR are trusted unless word splitting can escape them', () => {
    const rows: readonly {
      readonly label: string;
      readonly source: string;
      readonly id: string | null;
    }[] = [
      { label: 'plain workspace', source: 'rm -rf /tmp/scratch-dir', id: null },
      { label: 'plain workspace', source: 'rm -rf /var/tmp/scratch-dir', id: null },
      { label: 'paranoid rm', source: 'rm -rf /tmp/scratch-dir', id: null },
      { label: 'tmpdir trusted', source: 'rm -rf $TMPDIR/build', id: null },
      { label: 'tmpdir trusted', source: 'rm -rf ${TMPDIR}/build', id: null },
      {
        label: 'tmpdir word splitting unsafe',
        source: 'rm -rf $TMPDIR/build',
        id: 'rm.recursive-force-outside-cwd',
      },
      { label: 'tmpdir word splitting unsafe', source: 'rm -rf "$TMPDIR"/build', id: null },
    ];
    for (const row of rows)
      expect(ruleIdFor(row.source, row.label), `${row.label}: ${row.source}`).toBe(row.id);
  });

  test('an unverifiable target is reported in strict mode only', () => {
    for (const source of ['rm -rf $UNKNOWN/x', 'rm -rf "$UNKNOWN"', 'rm -rf `pwd`', 'rm -rf *']) {
      expect(ruleIdFor(source, 'plain workspace'), source).toBeNull();
      expect(ruleIdFor(source, 'strict'), source).toBe('rm.recursive-force-dynamic-target');
    }
  });

  test('Git metadata is protected only when the caller resolved it', () => {
    for (const source of [
      'rm .git',
      'rm -f .git/hooks/pre-commit',
      'rm -rf .git',
      'rm -rf .git/hooks',
      'rm -r .git',
      'rm -rf .',
    ]) {
      expect(ruleIdFor(source, 'git metadata resolved'), source).toBe('rm.git-metadata');
      expect(ruleIdFor(source, 'plain workspace'), source).not.toBe('rm.git-metadata');
    }
    expect(ruleIdFor('rm .git/HEAD', 'git metadata resolved')).toBeNull();
  });

  test('the home directory and a missing cwd change which target is anchored', () => {
    const rows: readonly {
      readonly label: string;
      readonly source: string;
      readonly id: string | null;
    }[] = [
      { label: 'home is the cwd', source: 'rm -rf src', id: 'rm.recursive-force-home-cwd' },
      { label: 'home is the cwd', source: 'rm -rf *', id: 'rm.recursive-force-root-or-home' },
      { label: 'home is the cwd', source: 'rm -rf /tmp/scratch-dir', id: null },
      { label: 'no cwd at all', source: 'rm -rf src', id: 'rm.recursive-force-outside-cwd' },
      { label: 'no cwd at all', source: 'rm -rf .', id: 'rm.recursive-force-outside-cwd' },
      { label: 'no cwd at all', source: 'rm -rf /', id: 'rm.recursive-force-root-or-home' },
      { label: 'no cwd at all', source: 'rm -rf /tmp/scratch-dir', id: null },
      {
        label: 'strict inside a nested directory',
        source: 'rm -rf .',
        id: 'rm.recursive-force-cwd-self',
      },
      { label: 'strict inside a nested directory', source: 'rm -rf ..', id: 'rm.git-metadata' },
    ];
    for (const row of rows)
      expect(ruleIdFor(row.source, row.label), `${row.label}: ${row.source}`).toBe(row.id);
  });

  test('an allow path and the system temp root are both trusted', () => {
    for (const label of ['plain workspace', 'allow paths cover a sibling directory'])
      for (const target of [join(root, 'allowed'), join(root, 'allowed', 'inner')])
        expect(ruleIdFor(`rm -rf ${target}`, label), `${label}: ${target}`).toBeNull();
    expect(ruleIdFor('rm -rf /nonexistent/allowed', 'allow paths cover a sibling directory')).toBe(
      'rm.recursive-force-outside-cwd',
    );
  });

  test('the table reaches every rm rule the analyzer can report', () => {
    const reported = new Set(
      optionCases().flatMap((row) =>
        RM_COMMANDS.flatMap((source) =>
          runPair(source, row).flatMap((outcome) =>
            outcome.ok && outcome.value ? [outcome.value.id] : [],
          ),
        ),
      ),
    );
    expect([...reported].sort()).toStrictEqual([
      'rm.git-metadata',
      'rm.recursive-force-cwd-self',
      'rm.recursive-force-dynamic-target',
      'rm.recursive-force-home-cwd',
      'rm.recursive-force-outside-cwd',
      'rm.recursive-force-paranoid',
      'rm.recursive-force-root-or-home',
    ]);
  });

  test('a brace expansion that overflows the limit is treated as outside the anchored cwd', () => {
    const paired = pairedEnvironments({ HOME: home }, home);
    const words = rmWords('rm -rf {a,b}{c,d}{e,f}{g,h}{i,j}{k,l}{m,n}')[0];
    if (!words) throw new Error('missing overflow command');
    expect(
      analyzeRmMatch(words, {
        environment: paired,
        protectedGitMetadata: null,
        cwd: workspace,
        originalCwd: workspace,
      })?.id,
    ).toBe('rm.recursive-force-outside-cwd');
  });

  test('a disabled rule and disabled protection both suppress the match', () => {
    const paired = pairedEnvironments({ HOME: home }, home);
    const words = rmWords('rm -rf src')[0];
    if (!words) throw new Error('missing paranoid command');
    const base = {
      environment: paired,
      protectedGitMetadata: null,
      cwd: workspace,
      originalCwd: workspace,
      paranoid: true,
    };
    expect(analyzeRmMatch(words, base)?.id).toBe('rm.recursive-force-paranoid');
    expect(
      analyzeRmMatch(words, {
        ...base,
        policy: {
          destructiveCommandProtectionEnabled: true,
          effectiveDestructiveCommandRules: { 'rm.recursive-force-paranoid': ruleState(false) },
        },
      }),
    ).toBeNull();
    const rootWords = rmWords('rm -rf /')[0];
    if (!rootWords) throw new Error('missing root command');
    expect(
      analyzeRmMatch(rootWords, {
        ...base,
        policy: {
          destructiveCommandProtectionEnabled: false,
          effectiveDestructiveCommandRules: {},
        },
      })?.id,
    ).toBe('rm.recursive-force-root-or-home');
  });
});
