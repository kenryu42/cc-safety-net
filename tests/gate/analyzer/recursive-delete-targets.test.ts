import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createProcessEnvironment } from '@/core/environment';
import type { ProtectedGitMetadata } from '@/core/git/metadata';
import { resolveProtectedGitMetadata } from '@/core/git/metadata';
import type { CommandWord } from '@/core/shell/model';
import { parseCommand } from '@/core/shell/parse';
import {
  classifyRecursiveDeleteTarget,
  createRecursiveDeleteTargetContext,
  deleteTargetWordFacts,
  isDangerousRootOrHomeTarget,
  isTrustedTempDescendantTarget,
  type RecursiveDeleteTargetClassificationOptions,
  type RecursiveDeleteTargetOptions,
} from '@/gate/analyzer/recursive-delete-targets';
import { pairedEnvironments } from '../../core/differential-inputs';
import { createLinkedWorktreeFixture, type LinkedWorktreeFixture } from '../../helpers';
import { writeTree } from '../../helpers/fixture-tree';

let root = '';
let home = '';
let workspace = '';
let worktrees: LinkedWorktreeFixture;
let gitMetadata: ProtectedGitMetadata | null = null;

function environments(env: Record<string, string> = {}) {
  return pairedEnvironments({ HOME: home, ...env }, home);
}

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'next-delete-targets-'));
  home = join(root, 'home');
  workspace = join(root, 'work');
  writeTree(root, {
    'home/projects': null,
    'work/nested/deep': null,
    'work/file.txt': 'x',
    allowed: null,
    'allowed/inner': null,
    'home/allowed-home': null,
    tmp: null,
    'tmp/inner': null,
    'not-temp': null,
    'link-to-work': { symlink: join(root, 'work') },
  });
  worktrees = createLinkedWorktreeFixture();
  gitMetadata = resolveProtectedGitMetadata(worktrees.mainWorktree, createProcessEnvironment());
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
  worktrees.cleanup();
});

type ContextCase = {
  label: string;
  env?: Record<string, string>;
  options: Omit<RecursiveDeleteTargetOptions, 'environment'>;
};

function contextCases(): readonly ContextCase[] {
  return [
    {
      label: 'workspace anchored',
      options: { cwd: workspace, originalCwd: workspace, protectedGitMetadata: null },
    },
    {
      label: 'workspace anchored, posix shell',
      options: {
        cwd: workspace,
        originalCwd: workspace,
        posixShell: true,
        protectedGitMetadata: null,
      },
    },
    {
      label: 'nested cwd under the anchor',
      options: {
        cwd: join(workspace, 'nested'),
        originalCwd: workspace,
        posixShell: true,
        strict: true,
        protectedGitMetadata: null,
      },
    },
    {
      label: 'home is the anchor',
      options: { cwd: home, originalCwd: home, paranoid: true, protectedGitMetadata: null },
    },
    {
      label: 'no anchor',
      options: { protectedGitMetadata: null },
    },
    {
      label: 'tmpdir variable distrusted',
      env: { TMPDIR: join(root, 'tmp') },
      options: {
        cwd: workspace,
        originalCwd: workspace,
        posixShell: true,
        allowTmpdirVar: false,
        protectedGitMetadata: null,
      },
    },
    {
      label: 'tmpdir word splitting unsafe',
      env: { TMPDIR: join(root, 'tmp') },
      options: {
        cwd: workspace,
        originalCwd: workspace,
        posixShell: true,
        tmpdirWordSplittingUnsafe: true,
        trustedTmpdirValue: true,
        protectedGitMetadata: null,
      },
    },
    {
      label: 'tmpdir pointed outside the temp roots',
      env: { TMPDIR: join(root, 'not-temp') },
      options: {
        cwd: workspace,
        originalCwd: workspace,
        posixShell: true,
        trustedTmpdirValue: false,
        protectedGitMetadata: null,
      },
    },
    {
      label: 'allow paths configured',
      options: {
        cwd: workspace,
        originalCwd: workspace,
        allowPaths: [join(root, 'allowed'), '~/allowed-home', 'relative', join(root, 'missing')],
        protectedGitMetadata: null,
      },
    },
    {
      label: 'allow path containing home',
      options: {
        cwd: workspace,
        originalCwd: workspace,
        allowPaths: [root, home],
        protectedGitMetadata: null,
      },
    },
    {
      label: 'git repository',
      options: {
        cwd: '',
        originalCwd: '',
        posixShell: true,
        protectedGitMetadata: null,
      },
    },
  ];
}

function resolvedOptions(row: ContextCase): Omit<RecursiveDeleteTargetOptions, 'environment'> {
  if (row.label !== 'git repository') return row.options;
  return {
    ...row.options,
    cwd: worktrees.mainWorktree,
    originalCwd: worktrees.mainWorktree,
    protectedGitMetadata: gitMetadata,
  };
}

function contextPair(row: ContextCase) {
  return createRecursiveDeleteTargetContext({
    ...resolvedOptions(row),
    environment: environments(row.env),
  });
}

function targets(cwd: string): readonly string[] {
  return [
    '/',
    '/*',
    '/**',
    '/*/*',
    '//',
    '~',
    '~/',
    '~/*',
    '~/projects',
    '$HOME',
    '$HOME/',
    '$HOME/*',
    '${HOME}',
    '${HOME}/projects',
    'C:/',
    'C:\\',
    '//server/share',
    '.',
    './',
    '.\\',
    '..',
    '../x',
    '*',
    './*',
    'file.txt',
    './nested',
    'nested/deep',
    'nested/../file.txt',
    cwd,
    `${cwd}/`,
    join(cwd, 'nested'),
    join(root, 'link-to-work'),
    join(root, 'allowed'),
    join(root, 'allowed', 'inner'),
    join(home, 'allowed-home'),
    join(root, 'tmp'),
    join(root, 'tmp', 'inner'),
    '/tmp',
    '/tmp/next-delete-targets-probe',
    '$TMPDIR',
    '$TMPDIR/',
    '$TMPDIR/x',
    '${TMPDIR}/x',
    '$TMPDIR/../escape',
    '$TMPDIR/$VAR',
    '$TMPDIRX/x',
    '$VAR/x',
    '`hostname`/x',
    'a?b',
    '[ab]',
    '{a,b}',
    '+(x)',
    '@(x)',
    '!(x)',
    'x\\*y',
    '.git',
    '.git/hooks',
    '',
    '   ',
  ];
}

type ReadableContext = {
  readonly anchoredCwd: string | null;
  readonly resolvedCwd: string | null;
  readonly strict: boolean;
  readonly paranoid: boolean;
  readonly trustTmpdirVar: boolean;
  readonly posixShell: boolean;
  readonly tmpdirWordSplittingUnsafe: boolean;
  readonly trustedTmpdirValue: boolean;
  readonly allowRoots: readonly string[];
  readonly protectedGitMetadata: ProtectedGitMetadata | null;
};

const CLASSIFICATION_OPTIONS: readonly RecursiveDeleteTargetClassificationOptions[] = [
  {},
  { targetIsLiteral: true },
  { tmpdirWordSplittingProtected: true },
  { skipHomeCwd: true },
  { skipCwdSelf: true },
  { skipHomeCwd: true, skipCwdSelf: true, targetIsLiteral: true },
];

describe('recursive delete target context', () => {
  test('the anchors and flags come from the options and the environment', () => {
    const readable = (label: string): ReadableContext => {
      const row = contextCases().find((option) => option.label === label);
      if (!row) throw new Error(`unknown context case: ${label}`);
      const context = contextPair(row);
      return {
        anchoredCwd: context.anchoredCwd,
        resolvedCwd: context.resolvedCwd,
        strict: context.strict,
        paranoid: context.paranoid,
        trustTmpdirVar: context.trustTmpdirVar,
        posixShell: context.posixShell,
        tmpdirWordSplittingUnsafe: context.tmpdirWordSplittingUnsafe,
        trustedTmpdirValue: context.trustedTmpdirValue,
        allowRoots: context.allowRoots,
        protectedGitMetadata: context.protectedGitMetadata,
      };
    };
    expect(readable('workspace anchored')).toStrictEqual({
      anchoredCwd: workspace,
      resolvedCwd: workspace,
      strict: false,
      paranoid: false,
      trustTmpdirVar: true,
      posixShell: false,
      tmpdirWordSplittingUnsafe: false,
      trustedTmpdirValue: true,
      allowRoots: [],
      protectedGitMetadata: null,
    });
    expect(readable('no anchor')).toMatchObject({ anchoredCwd: null, resolvedCwd: null });
    expect(readable('nested cwd under the anchor')).toMatchObject({
      anchoredCwd: workspace,
      resolvedCwd: join(workspace, 'nested'),
      strict: true,
      posixShell: true,
    });
    expect(readable('home is the anchor')).toMatchObject({ anchoredCwd: home, paranoid: true });
    expect(readable('tmpdir variable distrusted')).toMatchObject({
      trustTmpdirVar: false,
      trustedTmpdirValue: false,
    });
    expect(readable('tmpdir pointed outside the temp roots')).toMatchObject({
      trustTmpdirVar: true,
      trustedTmpdirValue: false,
    });
    expect(readable('git repository')).toMatchObject({
      anchoredCwd: worktrees.mainWorktree,
      protectedGitMetadata: gitMetadata,
    });
  });

  test('an allow path that would widen into home is dropped', () => {
    const withAllowed = contextPair({
      label: 'allow paths configured',
      options: {
        cwd: workspace,
        originalCwd: workspace,
        allowPaths: [join(root, 'allowed'), '~/allowed-home', 'relative', join(root, 'missing')],
        protectedGitMetadata: null,
      },
    });
    const allowRoot = (path: string) => (process.platform === 'win32' ? path.toLowerCase() : path);
    expect(withAllowed.allowRoots).toContain(allowRoot(join(realpathSync(root), 'allowed')));
    expect(withAllowed.allowRoots).toContain(allowRoot(join(realpathSync(home), 'allowed-home')));
    expect(withAllowed.allowRoots).not.toContain('relative');
    expect(
      contextPair({
        label: 'allow path containing home',
        options: {
          cwd: workspace,
          originalCwd: workspace,
          allowPaths: [root, home],
          protectedGitMetadata: null,
        },
      }).allowRoots,
    ).toStrictEqual([]);
  });
});

describe('recursive delete target classification', () => {
  function kindFor(
    target: string,
    label: string,
    options: RecursiveDeleteTargetClassificationOptions = {},
  ): string {
    const row = contextCases().find((option) => option.label === label);
    if (!row) throw new Error(`unknown context case: ${label}`);
    return classifyRecursiveDeleteTarget(target, contextPair(row), options).kind;
  }

  test('a target is classified by where it lands relative to the anchor', () => {
    const rows: readonly { readonly target: string; readonly kind: string }[] = [
      { target: '/', kind: 'root_or_home_target' },
      { target: '~', kind: 'root_or_home_target' },
      { target: '$HOME', kind: 'root_or_home_target' },
      { target: home, kind: 'root_or_home_target' },
      { target: '.', kind: 'cwd_self_target' },
      { target: './', kind: 'cwd_self_target' },
      { target: 'file.txt', kind: 'within_anchored_cwd' },
      { target: 'nested/deep', kind: 'within_anchored_cwd' },
      { target: 'nested/../file.txt', kind: 'within_anchored_cwd' },
      { target: '..', kind: 'outside_anchored_cwd' },
      { target: '../x', kind: 'outside_anchored_cwd' },
      { target: '/nonexistent/elsewhere', kind: 'outside_anchored_cwd' },
      { target: '/tmp/next-delete-targets-probe', kind: 'temp_target' },
      { target: workspace, kind: 'temp_target' },
      { target: join(home, 'projects'), kind: 'temp_target' },
    ];
    for (const row of rows)
      expect(kindFor(row.target, 'workspace anchored'), row.target).toBe(row.kind);
  });

  test('a target a shell would expand is dynamic unless it is read literally', () => {
    for (const target of ['*', '$VAR/x', '`hostname`/x', 'a?b', '[ab]', '{a,b}', '+(x)'])
      expect(kindFor(target, 'workspace anchored, posix shell'), target).toBe('dynamic_target');
    expect(kindFor('x\\*y', 'workspace anchored, posix shell')).toBe('within_anchored_cwd');
    expect(kindFor('*', 'workspace anchored, posix shell', { targetIsLiteral: true })).toBe(
      'within_anchored_cwd',
    );
  });

  test('$TMPDIR is a temp target only while the variable and its value are both trusted', () => {
    expect(kindFor('$TMPDIR/x', 'workspace anchored, posix shell')).toBe('temp_target');
    expect(kindFor('${TMPDIR}/x', 'workspace anchored, posix shell')).toBe('temp_target');
    expect(kindFor('$TMPDIR/x', 'tmpdir variable distrusted')).toBe('dynamic_target');
    for (const target of ['$TMPDIR/../escape', '$TMPDIR/$VAR', '$TMPDIRX/x'])
      expect(kindFor(target, 'workspace anchored, posix shell'), target).toBe('dynamic_target');
    expect(kindFor('$TMPDIR/x', 'tmpdir word splitting unsafe')).toBe('outside_anchored_cwd');
    expect(
      kindFor('$TMPDIR/x', 'tmpdir word splitting unsafe', { tmpdirWordSplittingProtected: true }),
    ).toBe('temp_target');
  });

  test('the anchor, the allow roots and the Git metadata each move the boundary', () => {
    expect(kindFor('projects', 'home is the anchor')).toBe('home_cwd_target');
    expect(kindFor('projects', 'home is the anchor', { skipHomeCwd: true })).toBe(
      'within_anchored_cwd',
    );
    expect(kindFor('.', 'home is the anchor', { skipHomeCwd: true })).toBe('root_or_home_target');
    expect(kindFor('.', 'workspace anchored', { skipCwdSelf: true })).toBe('within_anchored_cwd');
    expect(kindFor('file.txt', 'no anchor')).toBe('outside_anchored_cwd');
    expect(kindFor('.', 'no anchor')).toBe('outside_anchored_cwd');
    for (const target of [
      join(root, 'allowed'),
      join(root, 'allowed', 'inner'),
      join(home, 'allowed-home'),
    ])
      expect(kindFor(target, 'allow paths configured'), target).toBe('temp_target');
    expect(kindFor(join(root, 'allowed'), 'allow path containing home')).toBe('temp_target');
    expect(kindFor('.git', 'git repository')).toBe('git_metadata_target');
    expect(kindFor('.git/hooks', 'git repository')).toBe('git_metadata_target');
    expect(kindFor('.git', 'workspace anchored')).toBe('within_anchored_cwd');
  });

  test('every classification kind is reached by the table', () => {
    const kinds = new Set(
      contextCases().flatMap((row) => {
        const context = contextPair(row);
        const cwd = context.resolvedCwd ?? workspace;
        return targets(cwd).flatMap((target) =>
          CLASSIFICATION_OPTIONS.map(
            (options) => classifyRecursiveDeleteTarget(target, context, options).kind,
          ),
        );
      }),
    );
    expect([...kinds].sort()).toStrictEqual([
      'cwd_self_target',
      'dynamic_target',
      'git_metadata_target',
      'home_cwd_target',
      'outside_anchored_cwd',
      'root_or_home_target',
      'temp_target',
      'within_anchored_cwd',
    ]);
  });

  test('a temp descendant is trusted but a temp root or a workspace parent is not', () => {
    const context = contextPair({
      label: 'tmpdir variable distrusted',
      env: { TMPDIR: join(root, 'tmp') },
      options: {
        cwd: workspace,
        originalCwd: workspace,
        posixShell: true,
        protectedGitMetadata: null,
      },
    });
    expect(isTrustedTempDescendantTarget(join(root, 'tmp', 'inner'), context)).toBeTrue();
    expect(isTrustedTempDescendantTarget(tmpdir(), context)).toBeFalse();
    expect(isTrustedTempDescendantTarget('$TMPDIR', context)).toBeFalse();
    expect(isTrustedTempDescendantTarget('$TMPDIR/x', context)).toBeTrue();
    expect(isTrustedTempDescendantTarget(workspace, context)).toBeFalse();
  });
});

describe('dangerous root or home targets', () => {
  test('the root and home spellings are dangerous only while they can expand', () => {
    const rows: readonly {
      readonly target: string;
      readonly literal: boolean;
      readonly dangerous: boolean;
    }[] = [
      { target: '/', literal: true, dangerous: true },
      { target: '//', literal: true, dangerous: true },
      { target: '/*', literal: true, dangerous: true },
      { target: '/*/*', literal: true, dangerous: true },
      { target: 'C:/', literal: true, dangerous: true },
      { target: 'C:\\', literal: true, dangerous: true },
      { target: '//server/share', literal: true, dangerous: true },
      { target: '/tmp/x', literal: false, dangerous: false },
      { target: '~/projects', literal: false, dangerous: false },
      { target: '', literal: false, dangerous: false },
      { target: '~', literal: false, dangerous: true },
      { target: '~/*', literal: false, dangerous: true },
      { target: '~/*', literal: true, dangerous: false },
      { target: '$HOME', literal: false, dangerous: true },
      { target: '$HOME', literal: true, dangerous: false },
      { target: '${HOME}/', literal: false, dangerous: true },
    ];
    for (const row of rows)
      expect(
        isDangerousRootOrHomeTarget(row.target, row.literal),
        `${row.target} literal=${row.literal}`,
      ).toBe(row.dangerous);
  });
});

function words(source: string): readonly CommandWord[] {
  const node = parseCommand(source, 'posix').nodes[0];
  return node?.kind === 'command' ? node.words : [];
}

describe('delete target word facts', () => {
  test('the facts cover expansion, both limits and the quoted $TMPDIR form', () => {
    const facts = (source: string) => {
      const word = words(source).at(-1);
      if (!word) throw new Error(`no word in ${source}`);
      return deleteTargetWordFacts(word);
    };
    expect(facts('rm -rf {a,b}').expandedTargets).toStrictEqual(['a', 'b']);
    expect(facts('rm -rf {a,b}{c,d}{e,f}{g,h}{i,j}{k,l}{m,n}').unsafeBraceExpansion).toBeTrue();
    expect(facts(`rm -rf ${'x'.repeat(9000)}{a,b}`).unsafeBraceExpansion).toBeTrue();
    expect(facts('rm -rf "quoted"').targetIsLiteral).toBeTrue();
    expect(facts('rm -rf plain').targetIsLiteral).toBeFalse();
    expect(facts('rm -rf "$TMPDIR"/x').tmpdirWordSplittingProtected).toBeTrue();
    expect(facts('rm -rf $TMPDIR/x').tmpdirWordSplittingProtected).toBeFalse();
  });

  test('a brace expansion is expanded only when it is literal, bounded and active', () => {
    const expansion = (source: string) => {
      const word = words(source).at(-1);
      if (!word) throw new Error(`no word in ${source}`);
      return deleteTargetWordFacts(word).expandedTargets;
    };
    expect(expansion('rm -rf plain')).toBeUndefined();
    expect(expansion('rm -rf {a,b}/{c,d}')).toStrictEqual(['a/c', 'a/d', 'b/c', 'b/d']);
    expect(expansion('rm -rf y{,z}')).toStrictEqual(['y', 'yz']);
    expect(expansion('rm -rf x{1..3}')).toBeUndefined();
    expect(expansion('rm -rf {}')).toBeUndefined();
    expect(expansion('rm -rf a{b')).toBeUndefined();
    expect(expansion('rm -rf "{a,b}"')).toBeUndefined();
    expect(expansion("rm -rf '{a,b}'")).toBeUndefined();
  });

  test('a $TMPDIR word is splitting-protected only when the variable itself is quoted', () => {
    const protectedWord = (source: string) => {
      const word = words(source).at(-1);
      if (!word) throw new Error(`no word in ${source}`);
      return deleteTargetWordFacts(word).tmpdirWordSplittingProtected;
    };
    for (const source of [
      'rm -rf "$TMPDIR"/x',
      'rm -rf "$TMPDIR/x"',
      'rm -rf "${TMPDIR}"/x',
      'rm -rf prefix"$TMPDIR"suffix',
    ])
      expect(protectedWord(source), source).toBeTrue();
    for (const source of [
      'rm -rf $TMPDIR/x',
      'rm -rf ${TMPDIR}/x',
      "rm -rf '$TMPDIR'/x",
      'rm -rf $TMPDIR"/x"',
      'rm -rf "$TMPDIRX"/x',
      'rm -rf $HOME/x',
      'rm -rf "$(hostname)"',
    ])
      expect(protectedWord(source), source).toBeFalse();
  });
});
