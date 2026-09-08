import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { realpathSync } from 'node:fs';
import { join } from 'node:path';
import type { PolicyRule } from '@/core/rules/types';
import {
  analyzeChildCommandMatch,
  type ChildCommandAnalysisOptions,
} from '@/gate/analyzer/child-analyzer';
import {
  collectCommandTemplate,
  normalizeChildCommand,
  normalizeChildCommands,
} from '@/gate/analyzer/child-command';
import { pairedEnvironments } from '../../core/differential-inputs';
import { describeOutcome, writeTree } from '../../helpers/fixture-tree';
import { createTempRoot, removeTempRoots } from '../../helpers/temp-home';

/**
 * A child command reaches the rule sets only after the wrapper prelude, the transparent
 * wrappers and busybox have been peeled, and the peel is bounded. Each row states both halves:
 * what normalization yields for a candidate, and which rule the dispatch then reports.
 */

let root = '';
let home = '';
let workspace = '';

beforeAll(() => {
  root = realpathSync(createTempRoot('next-child-'));
  home = join(root, 'home');
  workspace = join(root, 'work');
  writeTree(root, { 'home/notes': null, 'work/build': null, elsewhere: null });
});

afterAll(removeTempRoots);

const CUSTOM_RULES: readonly PolicyRule[] = [
  {
    name: 'block-deploy',
    command: 'deploy-tool',
    block_args: ['--prod'],
    reason: 'Deployments are manual.',
  },
];

const TRANSPARENT_WRAPPERS: readonly string[] = ['uv', 'poetry'];

function normalizationContext(useEnv: boolean) {
  const paired = pairedEnvironments({ HOME: home, PATH: '/usr/bin' }, home);
  const shared = {
    cwd: workspace,
    envAssignments: useEnv ? new Map([['SEEDED', 'yes']]) : undefined,
    policy: {
      rules: CUSTOM_RULES,
      transparentWrappers: TRANSPARENT_WRAPPERS,
      destructiveCommandProtectionEnabled: true,
      effectiveDestructiveCommandRules: {},
    },
  };
  return { ...shared, environment: paired };
}

describe('child command normalization', () => {
  test('the wrapper prelude, busybox and a transparent wrapper are peeled off the child', () => {
    const context = normalizationContext(false);
    const rows: readonly {
      readonly tokens: readonly string[];
      readonly head: string;
      readonly child: readonly string[];
      readonly wrappedByTransparent: boolean;
      readonly cwd?: string;
    }[] = [
      {
        tokens: ['rm', '-rf', 'build'],
        head: 'rm',
        child: ['rm', '-rf', 'build'],
        wrappedByTransparent: false,
      },
      {
        tokens: ['sudo', '-u', 'root', '--', 'rm', '-rf', 'build'],
        head: 'rm',
        child: ['rm', '-rf', 'build'],
        wrappedByTransparent: false,
      },
      {
        tokens: ['env', 'FOO=bar', 'rm', '-rf', 'build'],
        head: 'rm',
        child: ['rm', '-rf', 'build'],
        wrappedByTransparent: false,
      },
      {
        tokens: ['command', '-p', 'rm', '-rf', 'build'],
        head: 'rm',
        child: ['rm', '-rf', 'build'],
        wrappedByTransparent: false,
      },
      {
        tokens: ['builtin', 'rm', '-rf', 'build'],
        head: 'rm',
        child: ['rm', '-rf', 'build'],
        wrappedByTransparent: false,
      },
      {
        tokens: ['busybox', 'rm', '-rf', 'build'],
        head: 'rm',
        child: ['rm', '-rf', 'build'],
        wrappedByTransparent: false,
      },
      {
        tokens: ['env', '-S', 'git status'],
        head: 'git',
        child: ['git', 'status'],
        wrappedByTransparent: false,
        // An `env -S` string is re-split, and the directory it would run in is not known.
        cwd: undefined,
      },
      {
        tokens: ['uv', 'run', 'rm', '-rf', 'build'],
        head: 'rm',
        child: ['rm', '-rf', 'build'],
        wrappedByTransparent: true,
      },
      {
        tokens: ['poetry', 'run', 'git', 'reset', '--hard'],
        head: 'git',
        child: ['git', 'reset', '--hard'],
        wrappedByTransparent: true,
      },
      // A command that is not a wrapper is its own child.
      {
        tokens: ['xargs', 'rm', '-rf'],
        head: 'xargs',
        child: ['xargs', 'rm', '-rf'],
        wrappedByTransparent: false,
      },
      {
        tokens: ['echo', 'hello'],
        head: 'echo',
        child: ['echo', 'hello'],
        wrappedByTransparent: false,
      },
      { tokens: ['uv'], head: 'uv', child: ['uv'], wrappedByTransparent: false },
      { tokens: ['busybox'], head: 'busybox', child: ['busybox'], wrappedByTransparent: false },
    ];
    for (const row of rows) {
      const candidate = normalizeChildCommand(row.tokens, context);
      expect(candidate.head, row.tokens.join(' ')).toBe(row.head);
      expect(candidate.tokens, row.tokens.join(' ')).toStrictEqual([...row.child]);
      expect(candidate.wrappedByTransparent, row.tokens.join(' ')).toBe(row.wrappedByTransparent);
      expect(candidate.cwd, row.tokens.join(' ')).toBe('cwd' in row ? row.cwd : workspace);
    }
  });

  test('the wrapper carries the environment and directory it sets to the child', () => {
    const candidate = normalizeChildCommand(
      ['env', 'FOO=bar', 'rm', '-rf', 'build'],
      normalizationContext(false),
    );
    expect([...candidate.wrapperEnvAssignments]).toStrictEqual([['FOO', 'bar']]);
    expect([...candidate.envAssignments]).toStrictEqual([['FOO', 'bar']]);

    const chdir = normalizeChildCommand(
      ['env', '-C', join(root, 'elsewhere'), 'rm', '-rf', 'build'],
      normalizationContext(false),
    );
    expect(chdir.wrapperCwd).toBe(join(root, 'elsewhere'));
    expect(chdir.cwd).toBe(join(root, 'elsewhere'));

    // An assignment the caller already tracked stays in the child's environment.
    const seeded = normalizeChildCommand(['rm', '-rf', 'build'], normalizationContext(true));
    expect([...seeded.envAssignments]).toStrictEqual([['SEEDED', 'yes']]);
    expect([...seeded.wrapperEnvAssignments]).toStrictEqual([]);
  });

  test('the peel is bounded and a transparent wrapper offers every protectable child', () => {
    const context = normalizationContext(false);
    expect(normalizeChildCommand(['busybox', 'busybox', 'rm', '-rf', 'x'], context).head).toBe(
      'rm',
    );
    const overCap = [...Array.from({ length: 24 }, () => 'busybox'), 'rm'];
    expect(() => normalizeChildCommand(overCap, context)).toThrow('derived-command work limit');
    const wrapped = [...normalizeChildCommands(['uv', 'run', 'rm', '-rf', 'build'], context)];
    expect(wrapped.map((candidate) => candidate.head)).toStrictEqual(['rm']);
    expect(wrapped[0]?.wrappedByTransparent).toBeTrue();
    // An `env -S` value that needs the quote language has no channel for a match.
    expect(() => normalizeChildCommand(['env', '-S', 'echo "quoted"'], context)).toThrow();
    expect(normalizeChildCommand(['env', '-S', 'a b', 'sudo'], context).tokens).toStrictEqual([
      'a',
      'b',
    ]);
  });

  test('a parallel command template stops at the argument marker', () => {
    const rows: readonly {
      readonly tokens: readonly string[];
      readonly start: number;
      readonly template: { markerIndex: number; templateTokens: string[] };
    }[] = [
      {
        tokens: ['parallel', 'rm', '-rf', '{}', ':::', 'a', 'b'],
        start: 1,
        template: { markerIndex: 4, templateTokens: ['rm', '-rf', '{}'] },
      },
      {
        tokens: ['parallel', 'rm', '-rf', '{}', ':::', 'a', 'b'],
        start: 0,
        template: { markerIndex: 4, templateTokens: ['parallel', 'rm', '-rf', '{}'] },
      },
      {
        tokens: ['parallel', 'rm', '-rf', '{}'],
        start: 1,
        template: { markerIndex: -1, templateTokens: ['rm', '-rf', '{}'] },
      },
      {
        tokens: ['parallel', ':::', 'a'],
        start: 1,
        template: { markerIndex: 1, templateTokens: [] },
      },
      {
        tokens: ['parallel', ':::', 'a'],
        start: 2,
        template: { markerIndex: -1, templateTokens: ['a'] },
      },
      { tokens: [], start: 0, template: { markerIndex: -1, templateTokens: [] } },
    ];
    for (const row of rows) {
      expect(
        collectCommandTemplate(row.tokens, row.start),
        `${row.tokens.join(' ')}@${row.start}`,
      ).toStrictEqual(row.template);
    }
  });
});

const CHILD_COMMANDS: readonly (readonly string[])[] = [
  [],
  [''],
  ['echo', 'hello'],
  ['eval', 'rm -rf /'],
  ['eval', '$COMMAND'],
  ['eval'],
  ['bash', '-c', 'rm -rf /'],
  ['bash', '-c', '$COMMAND'],
  ['bash', '-n', '-c', 'rm -rf /'],
  ['bash', 'script.sh'],
  ['bash'],
  ['sh', '-c'],
  ['zsh', '-c', 'git reset --hard'],
  ['awk', 'BEGIN { system("rm -rf /") }'],
  ['awk', '{ print }'],
  ['gawk', '-f', 'prog.awk'],
  ['python3', '-c', 'import os; os.system("rm -rf /")'],
  ['python3', '-c', 'print("hello")'],
  ['python3', 'script.py'],
  ['node', '-e', 'require("fs").rmSync("/", {recursive: true})'],
  ['perl', '-e', 'print 1'],
  ['ruby', '-e', 'puts 1'],
  ['rm', '-rf', 'build'],
  ['rm', '-rf', '/'],
  ['rm', '-rf', '/nonexistent/elsewhere'],
  ['rm', 'notes'],
  ['rmdir', 'build'],
  ['find', '.', '-delete'],
  ['find', '.', '-exec', 'rm', '-rf', '{}', ';'],
  ['git', 'reset', '--hard'],
  ['git', 'clean', '-fd'],
  ['git', 'status'],
  ['git', 'push', '--force'],
  ['deploy-tool', '--prod'],
  ['deploy-tool', '--dry-run'],
  ['unknown-tool', 'arg'],
];

const DYNAMIC_MATCH = {
  id: 'shell.dynamic-input',
  reason: 'dynamic shell input',
  intent: 'manual_only',
} as const;
const SOURCE_MATCH = {
  id: 'shell.dynamic-source',
  reason: 'dynamic source',
  intent: 'manual_only',
} as const;
const RM_MATCH = {
  id: 'rm.recursive-force-dynamic-target',
  reason: 'dynamic rm input',
  intent: 'scope_down',
} as const;

const ANALYSIS_OPTIONS: readonly ChildCommandAnalysisOptions[] = [
  {},
  { dynamicInput: true, shellDynamicMatch: DYNAMIC_MATCH },
  { dynamicSourceInput: true, dynamicSourceMatch: SOURCE_MATCH },
  { dynamicRmInput: true, rmDynamicMatch: RM_MATCH, dynamicInput: true },
  {
    dynamicInput: true,
    dynamicSourceInput: true,
    dynamicRmInput: true,
    shellDynamicMatch: DYNAMIC_MATCH,
    dynamicSourceMatch: SOURCE_MATCH,
    rmDynamicMatch: RM_MATCH,
  },
];

type ChildAnalysisCase = {
  readonly label: string;
  readonly strict?: boolean;
  readonly paranoidRm?: boolean;
  readonly paranoidInterpreters?: boolean;
  readonly worktreeMode?: boolean;
};

const ANALYSIS_CASES: readonly ChildAnalysisCase[] = [
  { label: 'standard' },
  { label: 'strict', strict: true },
  { label: 'paranoid rm', paranoidRm: true },
  { label: 'paranoid interpreters', paranoidInterpreters: true },
  { label: 'worktree mode', worktreeMode: true },
];

/** The dispatch over one token list, recording the nested sources it asks about. */
function dispatchPair(
  tokens: readonly string[],
  row: ChildAnalysisCase,
  options: ChildCommandAnalysisOptions,
) {
  const paired = pairedEnvironments({ HOME: home }, home);
  const shared = {
    cwd: workspace,
    originalCwd: workspace,
    strict: row.strict,
    paranoidRm: row.paranoidRm,
    paranoidInterpreters: row.paranoidInterpreters,
    worktreeMode: row.worktreeMode,
    allowTmpdirVar: true,
    envAssignments: new Map<string, string>(),
    protectedGitMetadata: null,
    policy: {
      rules: CUSTOM_RULES,
      destructiveCommandProtectionEnabled: true,
      effectiveDestructiveCommandRules: {},
    },
  };
  const nested: string[] = [];
  const record = (command: string) => {
    nested.push(command);
    return command.includes('NESTED')
      ? { id: 'custom.nested', reason: 'nested', intent: 'manual_only' as const }
      : null;
  };
  return {
    match: describeOutcome(() =>
      analyzeChildCommandMatch(
        tokens,
        { ...shared, environment: paired, analyzeNested: record },
        options,
      ),
    ),
    nested,
  };
}

describe('child command analysis', () => {
  test('each head reaches the rule its own analyzer reports', () => {
    const standard = { label: 'standard' };
    const rows: readonly { readonly tokens: readonly string[]; readonly id: string | null }[] = [
      { tokens: [], id: null },
      { tokens: [''], id: null },
      { tokens: ['echo', 'hello'], id: null },
      { tokens: ['rm', '-rf', 'build'], id: null },
      { tokens: ['rm', '-rf', '/'], id: 'rm.recursive-force-root-or-home' },
      { tokens: ['rm', '-rf', '/nonexistent/elsewhere'], id: 'rm.recursive-force-outside-cwd' },
      { tokens: ['rm', 'notes'], id: null },
      { tokens: ['find', '.', '-delete'], id: 'find.delete' },
      {
        tokens: ['find', '.', '-exec', 'rm', '-rf', '{}', ';'],
        id: 'find.exec-rm-recursive-force',
      },
      { tokens: ['git', 'reset', '--hard'], id: 'git.reset-hard' },
      { tokens: ['git', 'push', '--force'], id: 'git.push-force' },
      { tokens: ['git', 'status'], id: null },
      { tokens: ['deploy-tool', '--prod'], id: 'custom.block-deploy' },
      { tokens: ['deploy-tool', '--dry-run'], id: null },
      { tokens: ['unknown-tool', 'arg'], id: null },
      {
        tokens: ['python3', '-c', 'import os; os.system("rm -rf /")'],
        id: 'interpreter.dangerous-command',
      },
      { tokens: ['python3', '-c', 'print("hello")'], id: null },
      { tokens: ['python3', 'script.py'], id: null },
      // A shell asked only to check syntax runs nothing.
      { tokens: ['bash', '-n', '-c', 'rm -rf /'], id: null },
      { tokens: ['awk', '{ print }'], id: null },
      { tokens: ['gawk', '-f', 'prog.awk'], id: null },
    ];
    for (const row of rows) {
      const outcome = dispatchPair(row.tokens, standard, {}).match;
      if (!outcome.ok) throw outcome.error;
      expect(outcome.value?.id ?? null, row.tokens.join(' ')).toBe(row.id);
    }
  });

  test('the caller-supplied matches answer for the input it says is dynamic', () => {
    const standard = { label: 'standard' };
    const matchFor = (tokens: readonly string[], options: ChildCommandAnalysisOptions) => {
      const outcome = dispatchPair(tokens, standard, options).match;
      if (!outcome.ok) throw outcome.error;
      return outcome.value;
    };
    expect(matchFor(['eval', '$COMMAND'], {})).toBeNull();
    expect(
      matchFor(['eval', '$COMMAND'], { dynamicInput: true, shellDynamicMatch: DYNAMIC_MATCH }),
    ).toStrictEqual(DYNAMIC_MATCH);
    expect(
      matchFor(['bash', '-c', '$COMMAND'], {
        dynamicInput: true,
        shellDynamicMatch: DYNAMIC_MATCH,
      }),
    ).toStrictEqual(DYNAMIC_MATCH);
    expect(
      matchFor(['python3', 'script.py'], {
        dynamicSourceInput: true,
        dynamicSourceMatch: SOURCE_MATCH,
      }),
    ).toStrictEqual(SOURCE_MATCH);
    expect(
      matchFor(['rm', '-rf', 'build'], {
        dynamicRmInput: true,
        rmDynamicMatch: RM_MATCH,
        dynamicInput: true,
      }),
    ).toStrictEqual(RM_MATCH);
    // A catastrophic target is reported by the rm analyzer itself, not the caller's match.
    expect(
      matchFor(['rm', '-rf', '/'], {
        dynamicRmInput: true,
        rmDynamicMatch: RM_MATCH,
        dynamicInput: true,
      })?.id,
    ).toBe('rm.recursive-force-root-or-home');
  });

  test('a paranoid capability blocks an interpreter one-liner the standard level allows', () => {
    const idFor = (tokens: readonly string[], row: ChildAnalysisCase) => {
      const outcome = dispatchPair(tokens, row, {}).match;
      if (!outcome.ok) throw outcome.error;
      return outcome.value?.id ?? null;
    };
    expect(idFor(['python3', '-c', 'print("hello")'], { label: 'standard' })).toBeNull();
    expect(
      idFor(['python3', '-c', 'print("hello")'], {
        label: 'paranoid interpreters',
        paranoidInterpreters: true,
      }),
    ).toBe('interpreter.one-liner-paranoid');
    expect(idFor(['rm', '-rf', 'build'], { label: 'standard' })).toBeNull();
    expect(idFor(['rm', '-rf', 'build'], { label: 'paranoid rm', paranoidRm: true })).toBe(
      'rm.recursive-force-paranoid',
    );
  });

  test('the table reaches the interpreter, rm, find, git, custom and dynamic reasons', () => {
    const reported = new Set(
      ANALYSIS_CASES.flatMap((row) =>
        ANALYSIS_OPTIONS.flatMap((options) =>
          CHILD_COMMANDS.flatMap((tokens) => {
            const outcome = dispatchPair(tokens, row, options).match;
            return outcome.ok && outcome.value ? [outcome.value.id] : [];
          }),
        ),
      ),
    );
    for (const id of [
      'custom.block-deploy',
      'find.delete',
      'git.reset-hard',
      'interpreter.dangerous-command',
      'interpreter.one-liner-paranoid',
      'rm.recursive-force-outside-cwd',
      'rm.recursive-force-root-or-home',
      'shell.dynamic-input',
      'shell.dynamic-source',
    ]) {
      expect([...reported].sort(), id).toContain(id);
    }
  });

  test('a nested source is handed to the caller for eval, shells and interpreters', () => {
    const nestedFor = (tokens: readonly string[]) =>
      dispatchPair(tokens, { label: 'standard' }, {}).nested;
    expect(nestedFor(['eval', 'echo NESTED'])).toStrictEqual(['echo NESTED']);
    expect(nestedFor(['bash', '-c', 'echo NESTED'])).toStrictEqual(['echo NESTED']);
    expect(nestedFor(['python3', '-c', 'echo NESTED'])).toStrictEqual(['echo NESTED']);
    expect(nestedFor(['awk', 'BEGIN { system("echo NESTED") }'])).toStrictEqual(['echo NESTED']);
    // A shell reading a script operand has no source the analyzer can see.
    expect(nestedFor(['bash', 'script.sh'])).toStrictEqual([]);
  });
});
