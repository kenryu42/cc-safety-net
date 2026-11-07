import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REASON_DERIVED_COMMAND_WORK_LIMIT } from '@/core/budget';
import type { ProtectedGitMetadata } from '@/core/git/metadata';
import type { DestructiveCommandRuleMatch } from '@/core/rules/types';
import { parseCommand } from '@/core/shell/parse';
import { projectCommandViews } from '@/core/shell/traversal';
import {
  analyzeFindMatch,
  findExecRmDeletesFoundPaths,
  findHasDelete,
  getFindExecCommand,
  getFindPrimaryArity,
  getFindStartingPoints,
  isFindExecPrimary,
} from '@/gate/analyzer/find';
import { pairedEnvironments } from '../../core/differential-inputs';
import { describeOutcome, writeTree } from '../../helpers/fixture-tree';

let root = '';
let home = '';
let workspace = '';
let hookMetadata: ProtectedGitMetadata = {
  entries: [],
  markerFiles: [],
  directories: [],
  hooksDirectories: [],
};

beforeAll(() => {
  root = realpathSync(mkdtempSync(join(tmpdir(), 'next-find-')));
  home = join(root, 'home');
  workspace = join(root, 'work');
  writeTree(root, {
    'home/notes': null,
    'work/logs': null,
    'work/escape-link': { symlink: join(root, 'scratch') },
    'work/.git/HEAD': 'ref: refs/heads/main\n',
    'work/.git/hooks/pre-commit.sample': '#!/bin/sh\n',
    'work/.git/objects/pack/pack-1.pack': '',
    scratch: null,
  });
  const gitDir = join(workspace, '.git');
  const hooks = join(gitDir, 'hooks');
  hookMetadata = {
    entries: [gitDir],
    markerFiles: [],
    directories: [gitDir],
    hooksDirectories: [hooks],
  };
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

type NestedCall = { tokens: string[]; cwd: string | null | undefined };

function nestedMatchFor(tokens: readonly string[]): DestructiveCommandRuleMatch | null {
  if (tokens.includes('DANGER')) {
    return { id: 'rm.recursive-force-outside-cwd', reason: 'nested', intent: 'manual_only' };
  }
  if (tokens.includes('CUSTOM')) {
    return { id: 'custom.nested', reason: 'nested custom', intent: 'manual_only' };
  }
  return null;
}

type FindCase = {
  readonly label: string;
  readonly env?: Record<string, string>;
  readonly cwd?: string;
  readonly strict?: boolean;
  readonly metadata?: boolean;
  readonly allowTmpdirVar?: boolean;
  readonly protectionOff?: boolean;
};

function findCases(): readonly FindCase[] {
  return [
    { label: 'workspace', cwd: workspace },
    { label: 'workspace, strict', cwd: workspace, strict: true },
    { label: 'workspace with git metadata', cwd: workspace, metadata: true },
    { label: 'home as cwd', cwd: home },
    { label: 'no cwd', cwd: undefined },
    {
      label: 'tmpdir trusted',
      cwd: workspace,
      env: { TMPDIR: join(root, 'scratch') },
      allowTmpdirVar: true,
    },
    { label: 'destructive protection off', cwd: workspace, protectionOff: true },
  ];
}

function commandWords(source: string) {
  return projectCommandViews(parseCommand(source, 'posix'))[0]?.words ?? [];
}

function sharedContext(row: FindCase) {
  return {
    cwd: row.cwd,
    originalCwd: workspace,
    strict: row.strict,
    allowTmpdirVar: row.allowTmpdirVar,
    protectedGitMetadata: row.metadata ? hookMetadata : null,
    policy: row.protectionOff
      ? { destructiveCommandProtectionEnabled: false, effectiveDestructiveCommandRules: {} }
      : undefined,
  };
}

function analyzePair(source: string, row: FindCase) {
  const paired = pairedEnvironments({ HOME: home, ...row.env }, home);
  const calls: NestedCall[] = [];
  return {
    match: describeOutcome(() =>
      analyzeFindMatch(commandWords(source), {
        ...sharedContext(row),
        environment: paired,
        analyzeTokens: (tokens, cwd) => {
          calls.push({ tokens: [...tokens], cwd });
          return nestedMatchFor(tokens);
        },
      }),
    ),
    calls,
  };
}

function caseFor(label: string): FindCase {
  const row = findCases().find((candidate) => candidate.label === label);
  if (!row) throw new Error(`missing case ${label}`);
  return row;
}

function matchId(source: string, row: FindCase): string | null {
  const outcome = analyzePair(source, row).match;
  if (!outcome.ok) throw outcome.error;
  return outcome.value?.id ?? null;
}

describe('find primaries', () => {
  test('a primary reports how many operands it consumes, and which take a command', () => {
    const rows: readonly {
      readonly token: string | undefined;
      readonly arity: number;
      readonly exec: boolean;
    }[] = [
      { token: '-print', arity: 0, exec: false },
      { token: '-delete', arity: 0, exec: false },
      { token: '-name', arity: 1, exec: false },
      { token: '-newerat', arity: 1, exec: false },
      { token: '-newerXY', arity: 1, exec: false },
      { token: '-newerx', arity: 0, exec: false },
      { token: '-fprintf', arity: 2, exec: false },
      { token: '-exec', arity: 0, exec: true },
      { token: '-execdir', arity: 0, exec: true },
      { token: '-ok', arity: 0, exec: true },
      { token: '-okdir', arity: 0, exec: true },
      { token: 'logs', arity: 0, exec: false },
      { token: undefined, arity: 0, exec: false },
    ];
    for (const row of rows) {
      expect(getFindPrimaryArity(row.token ?? ''), `${row.token}`).toBe(row.arity);
      expect(isFindExecPrimary(row.token), `${row.token}`).toBe(row.exec);
    }
  });

  test('an -exec body ends at its terminator', () => {
    const rows: readonly {
      readonly tokens: readonly string[];
      readonly index: number;
      readonly command: { tokens: string[]; nextIndex: number };
    }[] = [
      {
        tokens: ['find', '.', '-exec', 'rm', '-rf', '{}', ';', '-print'],
        index: 2,
        command: { tokens: ['rm', '-rf', '{}'], nextIndex: 7 },
      },
      {
        tokens: ['find', '.', '-exec', 'rm', '{}', '+'],
        index: 2,
        command: { tokens: ['rm', '{}'], nextIndex: 6 },
      },
      {
        tokens: ['find', '.', '-exec', 'rm', '-rf'],
        index: 2,
        command: { tokens: ['rm', '-rf'], nextIndex: 5 },
      },
      {
        tokens: ['find', '-exec', '-exec', '-exec', ';'],
        index: 1,
        command: { tokens: ['-exec', '-exec'], nextIndex: 5 },
      },
      { tokens: ['find', '.', '-exec'], index: 2, command: { tokens: [], nextIndex: 3 } },
    ];
    for (const row of rows) {
      expect(getFindExecCommand(row.tokens, row.index), row.tokens.join(' ')).toStrictEqual(
        row.command,
      );
    }
  });

  test('-delete is found only as an action, never as an option value or inside -exec', () => {
    expect(findHasDelete(['find', '.', '-delete'])).toBeTrue();
    expect(findHasDelete(['find', '-name', '-delete'])).toBeFalse();
    expect(findHasDelete(['find', '-exec', 'rm', '-delete', ';'])).toBeFalse();
    expect(getFindPrimaryArity('-newerat')).toBe(1);
    expect(getFindPrimaryArity('-fprintf')).toBe(2);
    expect(getFindPrimaryArity('-print')).toBe(0);
  });

  test('a scan for -delete skips the operands each primary owns', () => {
    const rows: readonly { readonly tokens: readonly string[]; readonly deletes: boolean }[] = [
      { tokens: ['find', '.', '-type', 'f', '-exec', 'rm', '{}', '+', '-delete'], deletes: true },
      { tokens: ['find', '.', '-fprintf', 'out', 'fmt', '-delete'], deletes: true },
      { tokens: ['find', '.', '-newermt', 'yesterday', '-delete'], deletes: true },
      { tokens: ['find', '-delete'], deletes: true },
      { tokens: [], deletes: false },
      { tokens: ['find', '.'], deletes: false },
      { tokens: ['find', '.', '-gid', '-delete', '-print'], deletes: false },
      { tokens: ['find', '.', '-exec', 'echo', '-delete', '+'], deletes: false },
    ];
    for (const row of rows) {
      expect(findHasDelete(row.tokens), row.tokens.join(' ')).toBe(row.deletes);
    }
  });

  test('the starting points are the operands before the first primary', () => {
    const rows: readonly { readonly source: string; readonly points: string[] | null }[] = [
      { source: 'find -H -P -- logs -delete', points: ['logs'] },
      { source: 'find logs -delete', points: ['logs'] },
      { source: 'find . -name "*.log"', points: ['.'] },
      { source: 'find /tmp/a /tmp/b -delete', points: ['/tmp/a', '/tmp/b'] },
      { source: 'find "" / -delete', points: ['', '/'] },
      { source: 'find -L -O3 -xd -D tree -f / -delete', points: ['tree', '/'] },
      { source: 'find - / -delete', points: null },
      { source: 'find -D tree -L / -delete', points: ['tree', '/'] },
      { source: 'find -delete', points: null },
      { source: 'find', points: null },
      { source: 'find ! -name x -delete', points: null },
      { source: 'find ( logs ) -delete', points: null },
    ];
    for (const row of rows) {
      expect(
        getFindStartingPoints(commandWords(row.source))?.map((word) => word.text) ?? null,
        row.source,
      ).toStrictEqual(row.points);
    }
  });

  test('an -exec body that deletes the paths find hands it is recognized through wrappers', () => {
    const paired = pairedEnvironments({ HOME: home }, home);
    const rows: readonly { readonly tokens: readonly string[]; readonly deletes: boolean }[] = [
      { tokens: ['find', '.', '-exec', 'rm', '-rf', '{}', ';'], deletes: true },
      { tokens: ['find', '.', '-exec', 'sudo', 'rm', '-rf', '{}', '+'], deletes: true },
      { tokens: ['find', '.', '-exec', 'env', 'rm', '-rf', '{}', ';'], deletes: true },
      { tokens: ['find', '.', '-exec', 'busybox', 'rm', '-rf', '{}', ';'], deletes: false },
      { tokens: ['find', '.', '-execdir', 'rm', '-rf', '{}', ';'], deletes: true },
      { tokens: ['find', '.', '-exec', 'rm', '-rf', 'x', ';'], deletes: false },
      { tokens: ['find', '.', '-exec', 'echo', '{}', ';'], deletes: false },
      { tokens: ['find', '.', '-exec', 'rm', '{}', ';'], deletes: true },
      { tokens: ['find', '.', '-exec', 'rmdir', '{}', ';'], deletes: true },
      { tokens: ['find', '.', '-delete'], deletes: false },
    ];
    for (const row of rows) {
      expect(findExecRmDeletesFoundPaths(row.tokens, paired), row.tokens.join(' ')).toBe(
        row.deletes,
      );
    }
  });
});

describe('find analysis', () => {
  test('a delete is judged against its starting point', () => {
    const workspaceCase = caseFor('workspace');
    const rows: readonly { readonly source: string; readonly id: string | null }[] = [
      { source: 'find . -delete', id: 'find.delete' },
      { source: 'find . -name "*.log" -delete', id: 'find.delete' },
      { source: 'find -delete', id: 'find.delete' },
      { source: 'find logs -delete', id: null },
      { source: 'find ./logs src -delete', id: null },
      { source: 'find logs -L -delete', id: 'find.delete' },
      { source: 'find "$HOME"/notes -delete', id: 'find.delete' },
      { source: 'find / -delete', id: 'rm.recursive-force-root-or-home' },
      { source: 'find /* -delete', id: 'rm.recursive-force-root-or-home' },
      { source: 'find ~ -delete', id: 'rm.recursive-force-root-or-home' },
      { source: 'find $HOME -delete', id: 'rm.recursive-force-root-or-home' },
      { source: 'find /tmp/next-find-probe -delete', id: null },
      { source: 'find . -name -delete', id: null },
      { source: 'find . -name hooks -print', id: null },
      { source: 'find .', id: null },
    ];
    for (const row of rows) {
      expect(matchId(row.source, workspaceCase), row.source).toBe(row.id);
    }
  });

  test('a delete inside the workspace stays blocked under paranoid rm or through an escaping symlink', () => {
    const workspaceCase = caseFor('workspace');
    const paired = pairedEnvironments({ HOME: home }, home);
    expect(
      analyzeFindMatch(commandWords('find logs -delete'), {
        ...sharedContext(workspaceCase),
        environment: paired,
        paranoid: true,
      })?.id,
    ).toBe('find.delete');

    expect(matchId('find escape-link/ -delete', workspaceCase)).toBe('find.delete');
  });

  test('an -exec body decides the match, through the wrappers it runs behind', () => {
    const workspaceCase = caseFor('workspace');
    const rows: readonly { readonly source: string; readonly id: string | null }[] = [
      { source: 'find . -exec rm -rf {} ;', id: 'find.exec-rm-recursive-force' },
      { source: 'find . -exec rm -rf {} +', id: 'find.exec-rm-recursive-force' },
      { source: 'find . -execdir rm -rf {} \\;', id: 'find.exec-rm-recursive-force' },
      { source: 'find . -ok rm -rf {} \\;', id: 'find.exec-rm-recursive-force' },
      { source: 'find . -exec sudo rm -rf {} \\;', id: 'find.exec-rm-recursive-force' },
      { source: 'find /nonexistent -exec rm -rf {} +', id: 'find.exec-rm-recursive-force' },
      { source: 'find . -exec DANGER {} \\;', id: 'rm.recursive-force-outside-cwd' },
      { source: 'find . -exec CUSTOM {} \\;', id: 'custom.nested' },
      {
        source: 'find . -exec DANGER {} \\; -exec CUSTOM {} \\;',
        id: 'rm.recursive-force-outside-cwd',
      },
      { source: 'find . -exec rm {} \\;', id: null },
      { source: 'find . -exec echo {} \\;', id: null },
      { source: 'find . -exec', id: null },
    ];
    for (const row of rows) {
      expect(matchId(row.source, workspaceCase), row.source).toBe(row.id);
    }
  });

  test('git metadata, a trusted TMPDIR and a disabled protection change the verdict', () => {
    const metadata = caseFor('workspace with git metadata');
    expect(matchId('find .git -delete', metadata)).toBe('find.delete-git-metadata');
    expect(matchId('find . -name hooks -delete', metadata)).toBe('find.delete-git-metadata');
    expect(matchId('find . -iname HOOKS -delete', metadata)).toBe('find.delete-git-metadata');
    expect(matchId('find . -name hooks -print', metadata)).toBeNull();

    const tmpdir = caseFor('tmpdir trusted');
    expect(matchId('find $TMPDIR/build -delete', tmpdir)).toBeNull();
    expect(matchId('find $TMPDIR -delete', tmpdir)).toBe('find.delete');
    expect(matchId('find $TMPDIR/build -delete', caseFor('workspace'))).toBe('find.delete');

    const off = caseFor('destructive protection off');
    expect(matchId('find . -delete', off)).toBeNull();
    expect(matchId('find . -exec DANGER {} \\;', off)).toBeNull();
    expect(matchId('find . -exec CUSTOM {} \\;', off)).toBe('custom.nested');
    expect(matchId('find / -delete', off)).toBe('rm.recursive-force-root-or-home');
  });

  test('a delete filtered by -name reaches git metadata only when a metadata entry matches', () => {
    const metadata = caseFor('workspace with git metadata');
    const rows: readonly { readonly source: string; readonly id: string | null }[] = [
      { source: 'find . -name "*.pyc" -exec rm {} +', id: null },
      { source: 'find . -name "*.pyc" -exec rm -f {} \\;', id: null },
      { source: "find . -iname '*.ORIG' -exec rm {} \\;", id: null },
      { source: 'find . -name "*.pyc" -delete', id: 'find.delete' },
      {
        source: 'find . -type d -name __pycache__ -exec rm -rf {} +',
        id: 'find.delete-git-metadata',
      },
      { source: 'find . -name "*.sample" -exec rm {} +', id: 'find.delete-git-metadata' },
      { source: 'find . -name "pre-*" -exec rm {} +', id: 'find.delete-git-metadata' },
      { source: 'find . -name HEAD -exec rm {} +', id: 'find.delete-git-metadata' },
      { source: 'find . -iname head -exec rm {} +', id: 'find.delete-git-metadata' },
      { source: 'find . -name "*.pack" -delete', id: 'find.delete-git-metadata' },
      { source: 'find . -name .git -exec rm -rf {} +', id: 'find.delete-git-metadata' },
      { source: 'find . -name "*" -exec rm {} +', id: 'find.delete-git-metadata' },
      { source: 'find . -name *.pyc -exec rm {} +', id: 'find.delete-git-metadata' },
      { source: 'find . -name "*.$EXT" -exec rm {} +', id: 'find.delete-git-metadata' },
      { source: 'find . ! -name "*.pyc" -exec rm {} +', id: 'find.delete-git-metadata' },
      { source: 'find . -name "*.pyc" -o -type f -exec rm {} +', id: 'find.delete-git-metadata' },
      { source: 'find . -type f -exec rm {} +', id: 'find.delete-git-metadata' },
      { source: 'find .git -name "*.pyc" -exec rm {} +', id: null },
      { source: 'find .git -name "pre-commit*" -exec rm {} +', id: 'find.delete-git-metadata' },
      { source: "find . -type d -name 'build-*' -exec rm -r {} +", id: 'find.delete-git-metadata' },
      { source: "find . -name 'build-*' -exec rm -R -- {} +", id: 'find.delete-git-metadata' },
      {
        source: "find . -name 'build-*' -exec rm --recursive {} +",
        id: 'find.delete-git-metadata',
      },
      { source: "find . -name 'build-*' -exec sudo rm -r {} +", id: 'find.delete-git-metadata' },
      {
        source: "find . -name 'x*' -exec rm {} + -exec rm -r {} +",
        id: 'find.delete-git-metadata',
      },
      {
        source: 'find . -maxdepth 0 -name . -exec rm {}/.git/hooks/pre-commit \\;',
        id: 'find.delete-git-metadata',
      },
      {
        source: 'find . -name "*.pyc" -exec rm -f {}/.git/index {}/.git/HEAD \\;',
        id: 'find.delete-git-metadata',
      },
      {
        source: 'find . -name "*.pyc" -exec rm {} \\; -execdir rm .git/hooks/pre-commit \\;',
        id: 'find.delete-git-metadata',
      },
      { source: 'find . -name "*.pyc" -execdir rm -f -- {} \\;', id: null },
      { source: 'find . -exec sh -c \'rm -rf "$0"\' {} \\;', id: 'find.delete-git-metadata' },
      {
        source: 'find . -maxdepth 0 -exec bash -c \'rm -rf "$1"/.git\' _ {} \\;',
        id: 'find.delete-git-metadata',
      },
      { source: "find . -exec sh -c '/bin/rm {}' \\;", id: 'find.delete-git-metadata' },
      {
        source: "find . -name 'build-*' -exec sh -c 'rm -- \"$@\"' _ {} +",
        id: 'find.delete-git-metadata',
      },
      { source: "find . -name '*.txt' -exec sh -c 'wc -l \"$0\"' {} \\;", id: null },
      { source: 'find . -exec sh -c \'echo rm "$0"\' {} \\;', id: 'find.delete-git-metadata' },
      { source: 'find . -exec sh -c \'"rm" -rf "$0"\' {} +', id: 'find.delete-git-metadata' },
      { source: 'find . -exec sh -c "r\'\'m -rf \\"$0\\"" {} +', id: 'find.delete-git-metadata' },
      { source: 'find -H . -name "*.pyc" -exec rm {} +', id: null },
      { source: 'find . . -name "*.pyc" -exec rm {} +', id: null },
      { source: 'find . -exec sh -c \'exec rm -rf "$0"\' {} +', id: 'find.delete-git-metadata' },
      {
        source: 'find . -exec sh -c \'if [ -d "$0" ]; then rm -rf "$0"; fi\' {} +',
        id: 'find.delete-git-metadata',
      },
      {
        source: 'find . -exec sh -c \'f() { rm "$1"; }; f "$0"\' {} \\;',
        id: 'find.delete-git-metadata',
      },
      { source: 'find -P -- . -name "*.pyc" -exec rm {} +', id: null },
    ];
    for (const row of rows) {
      expect(matchId(row.source, metadata), row.source).toBe(row.id);
    }
  });

  test('a find starting at . after a tracked cd is judged by the directory the cd entered', () => {
    const scratch = { label: 'tracked cd into a temp directory', cwd: join(root, 'scratch') };
    const parent = { label: 'tracked cd into the temp parent of the workspace', cwd: root };
    const workspaceSubdirectory = {
      label: 'tracked cd into a workspace subdirectory',
      cwd: join(workspace, 'logs'),
    };
    const rows: readonly {
      readonly source: string;
      readonly row: FindCase;
      readonly id: string | null;
    }[] = [
      { source: 'find . -delete', row: scratch, id: null },
      { source: 'find ./ -maxdepth 1 -name "still-*.jpg" -delete', row: scratch, id: null },
      { source: 'find -L . -delete', row: scratch, id: 'find.delete' },
      { source: 'find . -delete', row: parent, id: 'find.delete' },
      { source: 'find . -delete', row: workspaceSubdirectory, id: 'find.delete' },
      { source: 'find . -delete', row: caseFor('workspace'), id: 'find.delete' },
    ];
    for (const { source, row, id } of rows) {
      expect(matchId(source, row), `${row.label}: ${source}`).toBe(id);
    }
  });

  test.skipIf(process.platform === 'win32')(
    'a find starting at . after a tracked cd into a temp root stays blocked',
    () => {
      const tempRoot = { label: 'tracked cd into a temp root', cwd: realpathSync('/tmp') };
      expect(matchId('find . -name "*.jpg" -delete', tempRoot)).toBe('find.delete');
    },
  );

  test('a -execdir child is analyzed without a cwd, an -exec child keeps it', () => {
    const execdir = analyzePair('find . -execdir rm {} \\;', { label: 'x', cwd: workspace });
    expect(execdir.calls).toStrictEqual([{ tokens: ['rm', '{}'], cwd: null }]);
    const exec = analyzePair('find . -exec rm {} \\;', { label: 'x', cwd: workspace });
    expect(exec.calls).toStrictEqual([{ tokens: ['rm', '{}'], cwd: workspace }]);
  });

  test('a derived-command budget shared across many exec bodies fails closed', () => {
    const source = `find . ${'-exec rm {} \\; '.repeat(120)}`.trim();
    const pair = analyzePair(source, { label: 'budget', cwd: workspace });
    expect(pair.match.ok).toBeFalse();
    expect(pair.match.ok ? '' : pair.match.error.name).toBe('AnalysisLimit');
    expect(pair.match.ok ? '' : pair.match.error.message).toBe(REASON_DERIVED_COMMAND_WORK_LIMIT);
  });
});
