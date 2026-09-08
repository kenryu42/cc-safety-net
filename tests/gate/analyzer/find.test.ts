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

/**
 * The find analyzer decides three separate things — the catastrophic starting point, `-delete`
 * against the trusted temp roots, and what each `-exec` child is — and it hands the child to the
 * caller. Each row therefore states the match and the nested calls it issues.
 */

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
    'work/.git/hooks': null,
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

const FIND_COMMANDS: readonly string[] = [
  'find',
  'find .',
  'find . -name "*.log"',
  'find . -delete',
  'find . -name "*.log" -delete',
  'find . -name -delete',
  'find . -newermt yesterday -delete',
  'find . -newerXY ref -delete',
  'find . -fprintf out fmt -delete',
  'find -delete',
  'find / -delete',
  'find /* -delete',
  'find ~ -delete',
  'find $HOME -delete',
  'find "$HOME"/notes -delete',
  'find $TMPDIR -delete',
  'find $TMPDIR/build -delete',
  'find /tmp/next-find-probe -delete',
  'find logs -delete',
  'find logs -L -delete',
  'find logs -follow -delete',
  'find -H -P -- logs -delete',
  'find ! -name x -delete',
  'find ( logs ) -delete',
  'find .git -delete',
  'find . -name hooks -delete',
  'find . -iname HOOKS -delete',
  'find . -name hooks -print',
  'find . -exec rm -rf {} ;',
  'find . -exec rm -rf {} \\;',
  'find . -exec rm -rf {} +',
  'find . -exec rm {} \\;',
  'find . -execdir rm -rf {} \\;',
  'find . -ok rm -rf {} \\;',
  'find . -okdir rm -rf {} \\;',
  'find . -exec busybox rm -rf {} \\;',
  'find . -exec env rm -rf {} \\;',
  'find . -exec sudo rm -rf {} \\;',
  'find . -exec echo {} \\;',
  'find . -exec rm -rf {} \\; -exec echo done \\;',
  'find . -exec rm -rf',
  'find . -exec',
  'find . -name -exec -delete',
  'find . -exec DANGER {} \\; -exec CUSTOM {} \\;',
  'find /nonexistent -exec rm -rf {} +',
  'find . -type f -exec rm {} + -delete',
  'find . -maxdepth 1 -delete',
  'find . -exec DANGER {} \\;',
  'find . -exec CUSTOM {} \\;',
];

type NestedCall = { tokens: string[]; cwd: string | null | undefined; command?: string };

/** Blocks on two sentinel heads so the caller-supplied match is exercised both ways. */
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

/** The analyzer over one command, with a recorder for the nested calls it issues. */
function analyzePair(source: string, row: FindCase, mode: 'tokens' | 'nested') {
  const paired = pairedEnvironments({ HOME: home, ...row.env }, home);
  const calls: NestedCall[] = [];
  const hooks =
    mode === 'tokens'
      ? {
          analyzeTokens: (tokens: readonly string[], cwd: string | null | undefined) => {
            calls.push({ tokens: [...tokens], cwd });
            return nestedMatchFor(tokens);
          },
        }
      : {
          analyzeNested: (command: string, overrides?: { effectiveCwd?: string | null }) => {
            calls.push({ tokens: command.split(' '), cwd: overrides?.effectiveCwd, command });
            return nestedMatchFor(command.split(' '));
          },
        };
  return {
    match: describeOutcome(() =>
      analyzeFindMatch(commandWords(source), {
        ...sharedContext(row),
        environment: paired,
        ...hooks,
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
  const outcome = analyzePair(source, row, 'tokens').match;
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
      // contract: src/gate/analyzer/find.ts — `-newer` takes two letters after it.
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
        // contract: src/gate/analyzer/find.ts — a body without a terminator runs to the end.
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
    expect(findHasDelete(['find', '.', '-delete'], 1)).toBeTrue();
    expect(findHasDelete(['find', '-name', '-delete'], 1)).toBeFalse();
    expect(findHasDelete(['find', '-exec', 'rm', '-delete', ';'], 1)).toBeFalse();
    expect(getFindPrimaryArity('-newerat')).toBe(1);
    expect(getFindPrimaryArity('-fprintf')).toBe(2);
    expect(getFindPrimaryArity('-print')).toBe(0);
  });

  test('a scan for -delete skips the operands each primary owns', () => {
    const rows: readonly {
      readonly tokens: readonly string[];
      readonly start: number;
      readonly deletes: boolean;
    }[] = [
      {
        tokens: ['find', '.', '-type', 'f', '-exec', 'rm', '{}', '+', '-delete'],
        start: 1,
        deletes: true,
      },
      { tokens: ['find', '.', '-fprintf', 'out', 'fmt', '-delete'], start: 1, deletes: true },
      { tokens: ['find', '.', '-newermt', 'yesterday', '-delete'], start: 1, deletes: true },
      { tokens: ['-delete'], start: 0, deletes: true },
      { tokens: [], start: 0, deletes: false },
      { tokens: ['find', '.', '-delete'], start: 3, deletes: false },
      { tokens: ['find', '.', '-gid', '-delete', '-print'], start: 1, deletes: false },
      { tokens: ['find', '.', '-exec', 'echo', '-delete', '+'], start: 1, deletes: false },
    ];
    for (const row of rows) {
      expect(findHasDelete(row.tokens, row.start), row.tokens.join(' ')).toBe(row.deletes);
    }
  });

  test('the starting points are the operands before the first primary', () => {
    const rows: readonly { readonly source: string; readonly points: string[] | null }[] = [
      { source: 'find -H -P -- logs -delete', points: ['logs'] },
      { source: 'find logs -delete', points: ['logs'] },
      { source: 'find . -name "*.log"', points: ['.'] },
      { source: 'find /tmp/a /tmp/b -delete', points: ['/tmp/a', '/tmp/b'] },
      // contract: src/gate/analyzer/find.ts:307 — no operand at all reads as no starting point,
      // which the caller turns into the implicit `.`.
      { source: 'find -delete', points: null },
      { source: 'find', points: null },
      // contract: src/gate/analyzer/find.ts — an expression the reader cannot bound gives up.
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
      // contract: src/gate/analyzer/find.ts:225 — only the wrapper prelude is peeled here, so a
      // busybox applet is not read as an rm.
      { tokens: ['find', '.', '-exec', 'busybox', 'rm', '-rf', '{}', ';'], deletes: false },
      { tokens: ['find', '.', '-execdir', 'rm', '-rf', '{}', ';'], deletes: true },
      { tokens: ['find', '.', '-exec', 'rm', '-rf', 'x', ';'], deletes: false },
      { tokens: ['find', '.', '-exec', 'echo', '{}', ';'], deletes: false },
      // contract: src/gate/analyzer/find.ts:227 — the probe asks whether the body removes the
      // paths find hands it, not whether the removal is recursive.
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
      { source: 'find logs -delete', id: 'find.delete' },
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
    // The temp root itself is not a descendant of a trusted temp directory.
    expect(matchId('find $TMPDIR -delete', tmpdir)).toBe('find.delete');
    expect(matchId('find $TMPDIR/build -delete', caseFor('workspace'))).toBe('find.delete');

    const off = caseFor('destructive protection off');
    expect(matchId('find . -delete', off)).toBeNull();
    expect(matchId('find . -exec DANGER {} \\;', off)).toBeNull();
    // A custom rule is not the destructive protection to disable.
    expect(matchId('find . -exec CUSTOM {} \\;', off)).toBe('custom.nested');
    expect(matchId('find / -delete', off)).toBe('rm.recursive-force-root-or-home');
  });

  test('the table reaches the delete, exec and git-metadata rules', () => {
    const reported = new Set(
      findCases().flatMap((row) =>
        FIND_COMMANDS.flatMap((source) => {
          const outcome = analyzePair(source, row, 'tokens').match;
          return outcome.ok && outcome.value ? [outcome.value.id] : [];
        }),
      ),
    );
    expect([...reported].sort()).toStrictEqual([
      'custom.nested',
      'find.delete',
      'find.delete-git-metadata',
      'find.exec-rm-recursive-force',
      'rm.recursive-force-outside-cwd',
      'rm.recursive-force-root-or-home',
    ]);
  });

  test('a -execdir child is analyzed without a cwd, an -exec child keeps it', () => {
    const execdir = analyzePair(
      'find . -execdir rm {} \\;',
      { label: 'x', cwd: workspace },
      'tokens',
    );
    expect(execdir.calls).toStrictEqual([{ tokens: ['rm', '{}'], cwd: null }]);
    const exec = analyzePair('find . -exec rm {} \\;', { label: 'x', cwd: workspace }, 'tokens');
    expect(exec.calls).toStrictEqual([{ tokens: ['rm', '{}'], cwd: workspace }]);
  });

  test('a nested analysis is handed the exec body as a command', () => {
    const nested = analyzePair('find . -exec rm {} \\;', { label: 'x', cwd: workspace }, 'nested');
    expect(nested.calls).toStrictEqual([
      { tokens: ['rm', '{}'], cwd: workspace, command: 'rm {}' },
    ]);
  });

  test('a derived-command budget shared across many exec bodies fails closed', () => {
    const source = `find . ${'-exec rm {} \\; '.repeat(120)}`.trim();
    const pair = analyzePair(source, { label: 'budget', cwd: workspace }, 'tokens');
    expect(pair.match.ok).toBeFalse();
    expect(pair.match.ok ? '' : pair.match.error.name).toBe('AnalysisLimit');
    expect(pair.match.ok ? '' : pair.match.error.message).toBe(REASON_DERIVED_COMMAND_WORK_LIMIT);
  });
});
