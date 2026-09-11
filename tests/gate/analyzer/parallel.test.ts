import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir as systemTempDir } from 'node:os';
import { join } from 'node:path';
import { type Budget, createBudget, REASON_PARALLEL_ANALYSIS_LIMIT } from '@/core/budget';
import type { CustomRule } from '@/core/policy/types';
import { textCommandWords } from '@/gate/analyzer/command-words';
import {
  analyzeParallel,
  extractParallelChildStart,
  REASON_PARALLEL_RM,
  REASON_PARALLEL_SHELL,
  replaceParallelPlaceholder,
} from '@/gate/analyzer/parallel';
import { analyzeChildCommand } from '@/gate/analyzer/segment';
import { pairedEnvironments } from '../../core/differential-inputs';
import { describeOutcome, writeTree } from '../../helpers/fixture-tree';
import { policySnapshot, testModes } from '../../helpers/policy';

let root = '';
let home = '';
let project = '';

beforeAll(() => {
  root = realpathSync(mkdtempSync(join(systemTempDir(), 'next-parallel-')));
  home = join(root, 'user');
  project = join(root, 'project');
  writeTree(root, { 'user/.cache': null, 'project/build': null, other: null });
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

const RULES: readonly CustomRule[] = [
  {
    name: 'no-prod-deploy',
    command: 'deploy-tool',
    block_args: ['--prod'],
    reason: 'Production deploys are manual.',
  },
  {
    name: 'no-registry-publish',
    command: 'npm',
    subcommand: 'publish',
    block_args: ['--force'],
    reason: 'Publishing is manual.',
  },
];

const NESTED = { id: 'custom.nested-job', reason: 'nested job', intent: 'manual_only' } as const;

type ParallelRow = {
  readonly label: string;
  readonly strict?: boolean;
  readonly paranoidRm?: boolean;
  readonly worktreeMode?: boolean;
  readonly rules?: readonly CustomRule[];
  readonly env?: Record<string, string>;
  readonly assignments?: ReadonlyMap<string, string>;
  readonly disabledRule?: string;
};

const ROWS: readonly ParallelRow[] = [
  { label: 'bare' },
  { label: 'custom rules', rules: RULES },
  { label: 'strict', strict: true, rules: RULES },
  { label: 'paranoid rm', paranoidRm: true },
  { label: 'worktree mode', worktreeMode: true },
  { label: 'PARALLEL in the environment', env: { PARALLEL: '-j4' } },
  { label: 'PARALLEL blank in the environment', env: { PARALLEL: '   ' } },
  { label: 'PARALLEL assigned in the shell', assignments: new Map([['PARALLEL', '--tag']]) },
  {
    label: 'PARALLEL assigned empty over an environment value',
    env: { PARALLEL: '-j4' },
    assignments: new Map([['PARALLEL', '']]),
  },
  { label: 'command-stream disabled', disabledRule: 'parallel.command-stream-dynamic' },
];

function parallelWork(budget: Budget) {
  return {
    childAnalyses: budget.counters.get('parallelChildAnalyses') ?? 0,
    derivedTokens: budget.counters.get('parallelDerivedTokens') ?? 0,
    derivedBytes: budget.counters.get('parallelDerivedBytes') ?? 0,
    placeholderReplacements: budget.counters.get('parallelPlaceholderReplacements') ?? 0,
  };
}

function bothAnalyzers(tokens: readonly string[], row: ParallelRow) {
  const paired = pairedEnvironments({ HOME: home, ...row.env }, home);
  const budget = createBudget();
  const scan = { units: 0 };
  const jobs: string[] = [];
  const snapshot = policySnapshot({ rules: row.rules ?? [], transparent_wrappers: ['uv'] });
  const settings = {
    cwd: project,
    originalCwd: project,
    strict: row.strict,
    paranoidRm: row.paranoidRm,
    worktreeMode: row.worktreeMode,
    allowTmpdirVar: true,
    envAssignments: row.assignments ?? new Map<string, string>(),
    protectedGitMetadata: null,
    policy: {
      ...snapshot.policy,
      effectiveDestructiveCommandRules: row.disabledRule
        ? {
            [row.disabledRule]: {
              enabled: false,
              inheritedEnabled: true,
              changesInherited: true,
              source: 'rule_override' as const,
            },
          }
        : {},
    },
  };
  const dispatchOptions = {
    ...settings,
    policySnapshot: snapshot,
    effectiveCapabilities: testModes().capabilities,
    effectiveCwd: project,
    environment: paired,
    budget,
    scanWork: scan,
    analyzeNested: (command: string, overrides?: { effectiveCwd?: string | null }) => {
      jobs.push(`${command} @ ${overrides?.effectiveCwd ?? '-'}`);
      return command.includes('BOOM')
        ? { reason: NESTED.reason, ruleId: NESTED.id, intent: NESTED.intent }
        : null;
    },
  };
  return {
    match: describeOutcome(() =>
      analyzeParallel(textCommandWords(tokens), {
        ...dispatchOptions,
        analyzeChild: (childTokens, child) =>
          analyzeChildCommand(childTokens, 0, dispatchOptions, child),
        analyzeNested: (command: string, overrides?: { effectiveCwd?: string | null }) => {
          jobs.push(`${command} @ ${overrides?.effectiveCwd ?? '-'}`);
          return command.includes('BOOM') ? NESTED : null;
        },
      }),
    ),
    budget,
    scan,
    jobs,
  };
}

const ARGUMENT_SHAPES: readonly (readonly string[])[] = [
  ['parallel'],
  ['parallel', '--version'],
  ['parallel', '--help'],
  ['parallel', 'echo', ':::', 'a', 'b'],
  ['parallel', 'echo', '{}', ':::', 'a', 'b'],
  ['parallel', 'echo', '{1}', '{2}', ':::', 'a', 'b', ':::', 'c', 'd'],
  ['parallel', 'echo', '{2}', ':::', 'a'],
  ['parallel', 'echo', '{-1}', ':::', 'a', 'b'],
  ['parallel', 'echo', '{0}', ':::', 'a'],
  ['parallel', 'echo', '{.}', ':::', 'a'],
  ['parallel', 'echo', '{/}', '{//}', ':::', 'a'],
  ['parallel', 'echo', '{= s/a/b/ =}', ':::', 'a'],
  ['parallel', 'echo', ':::', 'a', ':::', 'b', 'c'],
  ['parallel', 'echo', ':::'],
  ['parallel', '::::', 'file'],
  ['parallel', ':::+', 'a'],
  ['parallel', ':::', 'rm -rf /tmp/x', 'echo hi'],
  ['parallel', ':::', 'echo BOOM'],
  ['parallel', ':::', 'a', 'b'],
  ['parallel', '--', 'rm', '-rf', '{}', ':::', 'a'],
  ['parallel', '-I', '{}', 'echo', '{}', ':::', 'a'],
  ['parallel', '-I', '%', 'echo', '%', ':::', 'a'],
  ['parallel', '-I%', 'echo', '%', ':::', 'a'],
  ['parallel', '--replace', 'echo', ':::', 'a'],
  ['parallel', '--replace=', 'echo', '{}', ':::', 'a'],
  ['parallel', '-i', 'echo', ':::', 'a'],
  ['parallel', '-j', '4', 'echo', ':::', 'a'],
  ['parallel', '-j4', 'echo', ':::', 'a'],
  ['parallel', '--jobs', '4', 'echo', ':::', 'a'],
  ['parallel', '-n', '2', 'echo', ':::', 'a', 'b'],
  ['parallel', '-n', ':::', 'a'],
  ['parallel', '--delay', '1', 'echo', ':::', 'a'],
  ['parallel', '--tagstring', '{}', 'echo', ':::', 'a'],
  ['parallel', '--dry-run', 'rm', '-rf', '{}', ':::', 'a'],
  ['parallel', '--dry-run', 'FOO={= x =}', 'echo', ':::', 'a'],
  ['parallel', '--dry-run', 'FOO={}', 'echo', ':::', 'a'],
  ['parallel', '--pipe', 'rm', '-rf', '{}'],
  ['parallel', '--pipepart', 'cat'],
  ['parallel', '-a', 'list', 'echo'],
  ['parallel', '--arg-file', 'list', 'echo'],
  ['parallel', '--colsep', ',', 'echo', ':::', 'a'],
  ['parallel', '--rpl', '{x}', 'echo', ':::', 'a'],
  ['parallel', '--env', 'FOO', 'echo', ':::', 'a'],
  ['parallel', '--env=FOO', 'echo', ':::', 'a'],
  ['parallel', '-S', 'host', 'rm', '-rf', '{}', ':::', 'a'],
  ['parallel', '-Shost', 'rm', '-rf', ':::', 'a'],
  ['parallel', '--sshlogin', 'host', 'rm', '-rf', ':::', 'a'],
  ['parallel', '--workdir', '/tmp', 'rm', '-rf', 'x', ':::', 'a'],
  ['parallel', '--workdir', '...', 'rm', '-rf', 'x', ':::', 'a'],
  ['parallel', '--workdir', '{}', 'rm', '-rf', 'x', ':::', 'a'],
  ['parallel', '--wd=', 'rm', '-rf', 'x', ':::', 'a'],
  ['parallel', '--workdir', ':::', 'a'],
  ['parallel', '--workdir', 'relative', 'rm', '-rf', 'x', ':::', 'a'],
  ['parallel', '--workdir', '/tmp', '-S', 'host', 'rm', '-rf', 'x'],
];

const TEMPLATE_SHAPES: readonly (readonly string[])[] = [
  ['parallel', 'rm', '-rf', '{}', ':::', 'build', 'dist'],
  ['parallel', 'rm', '-rf', '{}'],
  ['parallel', 'rm', '-rf', ':::', 'build'],
  ['parallel', 'rm', '-rf'],
  ['parallel', 'rm', '-rf', '{}', '--', ':::', 'a'],
  ['parallel', 'rm', '-rf', '-{}', ':::', 'a'],
  ['parallel', 'rm', '-rf', '/', ':::', 'a'],
  ['parallel', 'rm', '-rf', '{1}', ':::', 'a', ':::', 'b'],
  ['parallel', 'rm', 'build', ':::', 'a'],
  ['parallel', 'bash', '-c', 'rm -rf {}', ':::', 'a'],
  ['parallel', 'bash', '-c', '{}', ':::', 'rm -rf /tmp/x'],
  ['parallel', 'bash', '-c', '{}'],
  ['parallel', 'bash', '-c', 'echo hi', ':::', 'a'],
  ['parallel', 'bash', '-c', 'echo BOOM'],
  ['parallel', 'bash', '-c', 'rm -rf /tmp/x'],
  ['parallel', 'bash', '-c', 'eval "$FOO"'],
  ['parallel', 'sh', '-c', 'echo "$1"', '_', ':::', 'a'],
  ['parallel', 'sh', '-c', 'echo "$1"', '{}', ':::', 'a'],
  ['parallel', 'sh', '-n', '-c', 'rm -rf {}', ':::', 'a'],
  ['parallel', 'sh', '-n', '-c', 'rm -rf x'],
  ['parallel', 'bash', 'script.sh', ':::', 'a'],
  ['parallel', 'bash', '{}', ':::', 'script.sh'],
  ['parallel', 'bash', ':::', 'rm -rf /tmp/x'],
  ['parallel', 'bash', ':::', 'echo BOOM'],
  ['parallel', 'bash', '{}'],
  ['parallel', 'bash'],
  ['parallel', 'sh', '-c'],
  ['parallel', 'git', 'reset', '--hard', ':::', 'a'],
  ['parallel', 'git', 'reset', '--hard'],
  ['parallel', 'git', '{}', ':::', 'status'],
  ['parallel', 'git', 'checkout', '{}', ':::', '.'],
  ['parallel', 'git', 'checkout', '--', '{}', ':::', '.'],
  ['parallel', 'git', '-c', '{}', 'status', ':::', 'a'],
  ['parallel', 'git', '-c', 'core.pager=x', 'status', ':::', 'a'],
  ['parallel', 'git', 'status', ':::', 'a'],
  ['parallel', 'find', '.', '-delete', ':::', 'a'],
  ['parallel', 'find', '{}', '-delete'],
  ['parallel', 'find', '.', '-name', '{}'],
  ['parallel', 'find', '.', '-exec', 'rm', '-rf', '{}', ';'],
  ['parallel', 'find', '.', '-exec', 'rm', '-{}', 'x', ';'],
  ['parallel', 'find', '.', '-exec', 'sh', '-c', '{}', ';'],
  ['parallel', 'find', '.', '-newermt', '{}', '-print'],
  ['parallel', 'xargs', 'rm', '-rf'],
  ['parallel', 'xargs', '-I', '{}', 'rm', '-rf', '{}'],
  ['parallel', 'xargs', 'echo'],
  ['parallel', 'awk', '{}'],
  ['parallel', 'awk', '-f', '{}'],
  ['parallel', 'awk', '{ print }', ':::', 'a'],
  ['parallel', 'python3', '-c', '{}'],
  ['parallel', 'python3', '{}'],
  ['parallel', 'python3', '-c', 'print(1)', ':::', 'a'],
  ['parallel', 'node', '--eval={}'],
  ['parallel', 'eval', '{}'],
  ['parallel', 'source', '{}'],
  ['parallel', '.', '{}'],
  ['parallel', 'parallel', 'rm', '-rf'],
  ['parallel', '{}', 'arg'],
  ['parallel', 'deploy-tool', '{}', ':::', '--prod'],
  ['parallel', 'deploy-tool', '--prod'],
  ['parallel', 'deploy-tool', '{}'],
  ['parallel', 'npm', 'publish', '{}'],
  ['parallel', 'echo', '{}'],
  ['parallel', 'uv', 'run', 'rm', '-rf', '{}', ':::', 'a'],
  ['parallel', 'FOO=bar', 'echo', ':::', 'a'],
  ['parallel', 'FOO=rm -rf /', 'echo', ':::', 'a'],
  ['parallel', 'FOO={}', 'echo', ':::', 'a'],
  ['parallel', 'FOO={.}', 'echo', ':::', 'a'],
  ['parallel', 'FOO={= x =}', 'echo', ':::', 'a'],
];

const ALL_SHAPES = [...ARGUMENT_SHAPES, ...TEMPLATE_SHAPES];

describe('parallel command parsing', () => {
  test('the child command starts after the options and their values', () => {
    const rows: readonly { readonly tokens: readonly string[]; readonly start: number }[] = [
      { tokens: ['parallel', 'rm', '-rf'], start: 1 },
      { tokens: ['parallel', '--', 'rm', '-rf', '{}', ':::', 'a'], start: 2 },
      { tokens: ['parallel', '-j4', 'echo', ':::', 'a'], start: 2 },
      { tokens: ['parallel', '-j', '4', 'echo', ':::', 'a'], start: 3 },
      { tokens: ['parallel', '--jobs', '4', 'echo', ':::', 'a'], start: 3 },
      { tokens: ['parallel', '-n', '2', 'echo', ':::', 'a', 'b'], start: 3 },
      { tokens: ['parallel', '-I', '{}', 'echo', '{}', ':::', 'a'], start: 3 },
      { tokens: ['parallel', '-I%', 'echo', '%', ':::', 'a'], start: 2 },
      { tokens: ['parallel', '-S', 'host', 'rm', '-rf', '{}', ':::', 'a'], start: 3 },
      { tokens: ['parallel', '--workdir', '/tmp', 'rm', '-rf', 'x', ':::', 'a'], start: 3 },
      { tokens: ['parallel', '--dry-run', 'rm', '-rf', '{}', ':::', 'a'], start: 2 },
      { tokens: ['parallel', 'echo', '{}', ':::', 'a', 'b'], start: 1 },
      { tokens: ['parallel'], start: 1 },
      { tokens: ['parallel', ':::', 'a'], start: 3 },
      { tokens: [], start: 0 },
      { tokens: ['-j4'], start: 1 },
    ];
    for (const row of rows) {
      expect(extractParallelChildStart(row.tokens), row.tokens.join(' ')).toBe(row.start);
    }
  });

  test('a placeholder is replaced wherever it appears, and nothing else is', () => {
    const rows: readonly {
      readonly template: string;
      readonly argument: string;
      readonly replaced: string;
    }[] = [
      { template: '{}', argument: 'x', replaced: 'x' },
      { template: 'a{}b', argument: 'x', replaced: 'axb' },
      { template: 'a{}b', argument: '', replaced: 'ab' },
      { template: '{1}', argument: 'x', replaced: 'x' },
      { template: '{-2}', argument: 'x', replaced: 'x' },
      { template: '{.}/{}', argument: 'a b', replaced: 'a b/a b' },
      { template: '{=x=}', argument: 'x', replaced: 'x' },
      { template: '{{}}', argument: 'x', replaced: '{x}' },
      { template: 'plain', argument: 'x', replaced: 'plain' },
      { template: '{ }', argument: 'x', replaced: '{ }' },
      { template: '{}', argument: '{}', replaced: '{}' },
      { template: 'before{}after', argument: '$&', replaced: 'before$&after' },
      { template: 'before{}after', argument: "$'", replaced: "before$'after" },
      { template: 'before{}after', argument: '$`', replaced: 'before$`after' },
    ];
    for (const row of rows) {
      expect(
        replaceParallelPlaceholder(row.template, row.argument),
        `${row.template} <- ${row.argument}`,
      ).toBe(row.replaced);
    }
  });
});

describe('parallel analysis', () => {
  const idFor = (tokens: readonly string[], row: ParallelRow = { label: 'bare' }) => {
    const outcome = bothAnalyzers(tokens, row).match;
    if (!outcome.ok) throw outcome.error;
    return outcome.value?.id ?? null;
  };

  test('a job whose template can carry a command is unverifiable', () => {
    const rows: readonly { readonly tokens: readonly string[]; readonly id: string | null }[] = [
      { tokens: ['parallel', 'rm', '-rf', '{}'], id: 'parallel.rm-recursive-force-dynamic' },
      { tokens: ['parallel', 'bash', '-c', '{}'], id: 'parallel.shell-dynamic' },
      { tokens: ['parallel', 'git', '{}'], id: 'parallel.shell-dynamic' },
      { tokens: ['parallel', 'git', '{}', ':::', 'status'], id: null },
      { tokens: ['parallel', 'git', '-c', '{}', 'status'], id: 'parallel.shell-dynamic' },
      { tokens: ['parallel', 'find', '{}', '-delete'], id: 'parallel.shell-dynamic' },
      { tokens: ['parallel', 'awk', '-f', '{}'], id: 'parallel.shell-dynamic' },
      { tokens: ['parallel', 'python3', '-c', '{}'], id: 'parallel.shell-dynamic' },
      { tokens: ['parallel', 'eval', '{}'], id: 'parallel.shell-dynamic' },
      { tokens: ['parallel', 'source', '{}'], id: 'parallel.shell-dynamic' },
      {
        tokens: ['parallel', 'git', 'checkout', '--', '{}', ':::', '.'],
        id: 'git.checkout-double-dash',
      },
      { tokens: ['parallel', 'find', '.', '-name', '{}'], id: null },
      { tokens: ['parallel', 'find', '.', '-newermt', '{}', '-print'], id: null },
      { tokens: ['parallel', 'python3', '{}'], id: 'parallel.shell-dynamic' },
    ];
    for (const row of rows) {
      expect(idFor(row.tokens), row.tokens.join(' ')).toBe(row.id);
    }
  });

  test('a job with no placeholder is analyzed as the command it runs', () => {
    const rows: readonly {
      readonly tokens: readonly string[];
      readonly row?: ParallelRow;
      readonly id: string | null;
    }[] = [
      { tokens: ['parallel', 'echo', ':::', 'a', 'b'], id: null },
      { tokens: ['parallel', 'git', 'status', ':::', 'a'], id: null },
      { tokens: ['parallel', 'git', 'reset', '--hard', ':::', 'a'], id: 'git.reset-hard' },
      { tokens: ['parallel', 'find', '.', '-delete', ':::', 'a'], id: 'find.delete' },
      { tokens: ['parallel', 'rm', '-rf', '/', ':::', 'a'], id: 'rm.recursive-force-root-or-home' },
      {
        tokens: ['parallel', 'busybox', 'rm', '-rf', '/', ':::', 'a'],
        id: 'rm.recursive-force-root-or-home',
      },
      { tokens: ['parallel', 'rm', 'build', ':::', 'a'], id: null },
      {
        tokens: ['parallel', 'deploy-tool', '--prod'],
        row: { label: 'custom rules', rules: RULES },
        id: 'custom.no-prod-deploy',
      },
      { tokens: ['parallel', 'deploy-tool', '--prod'], id: null },
      { tokens: ['parallel', 'uv', 'run', 'rm', '-rf', '{}', ':::', 'a'], id: null },
      { tokens: ['parallel', 'FOO=bar', 'echo', ':::', 'a'], id: null },
      {
        tokens: ['parallel', 'FOO=rm -rf /', 'echo', ':::', 'a'],
        id: 'raw-text.dangerous-command',
      },
    ];
    for (const row of rows) {
      expect(idFor(row.tokens, row.row), row.tokens.join(' ')).toBe(row.id);
    }
  });

  test('an input the reader cannot enumerate makes the command stream unverifiable', () => {
    const rows: readonly { readonly tokens: readonly string[]; readonly id: string | null }[] = [
      { tokens: ['parallel'], id: 'parallel.command-stream-dynamic' },
      { tokens: ['parallel', '::::', 'file'], id: 'parallel.command-stream-dynamic' },
      { tokens: ['parallel', ':::+', 'a'], id: 'parallel.command-stream-dynamic' },
      { tokens: ['parallel', '-a', 'list', 'echo'], id: 'parallel.command-stream-dynamic' },
      {
        tokens: ['parallel', '--colsep', ',', 'echo', ':::', 'a'],
        id: 'parallel.command-stream-dynamic',
      },
      {
        tokens: ['parallel', '--rpl', '{x}', 'echo', ':::', 'a'],
        id: 'parallel.command-stream-dynamic',
      },
      {
        tokens: ['parallel', '-I', '%', 'echo', '%', ':::', 'a'],
        id: 'parallel.command-stream-dynamic',
      },
      {
        tokens: ['parallel', '--env', 'FOO', 'echo', ':::', 'a'],
        id: 'parallel.command-stream-dynamic',
      },
      {
        tokens: ['parallel', '--pipe', 'rm', '-rf', '{}'],
        id: 'parallel.rm-recursive-force-dynamic',
      },
      {
        tokens: ['parallel', '--workdir', '...', 'rm', '-rf', 'x', ':::', 'a'],
        id: 'parallel.command-stream-dynamic',
      },
      {
        tokens: ['parallel', '--wd=', 'rm', '-rf', 'x', ':::', 'a'],
        id: 'parallel.command-stream-dynamic',
      },
      { tokens: ['parallel', '-I', '{}', 'echo', '{}', ':::', 'a'], id: null },
      { tokens: ['parallel', '--dry-run', 'rm', '-rf', '{}', ':::', 'a'], id: null },
    ];
    for (const row of rows) {
      expect(idFor(row.tokens), row.tokens.join(' ')).toBe(row.id);
    }
    expect(
      idFor(['parallel'], { label: 'off', disabledRule: 'parallel.command-stream-dynamic' }),
    ).toBeNull();
  });

  test('a job the analyzer can read is handed to the caller with its directory', () => {
    const pair = bothAnalyzers(['parallel', 'bash', '-c', 'echo BOOM'], { label: 'bare' });
    expect(pair.jobs).toStrictEqual([`echo BOOM @ ${project}`]);
    expect(pair.match.ok && pair.match.value).toStrictEqual(NESTED);
  });

  test('the shapes reach the shell, rm, command-stream and unsupported verdicts', () => {
    const seen = new Set(
      ROWS.flatMap((row) =>
        ALL_SHAPES.flatMap((tokens) => {
          const outcome = bothAnalyzers(tokens, row).match;
          return outcome.ok && outcome.value ? [outcome.value.id] : [];
        }),
      ),
    );
    for (const id of [
      'parallel.shell-dynamic',
      'parallel.rm-recursive-force-dynamic',
      'parallel.command-stream-dynamic',
      'custom.no-prod-deploy',
      'find.delete',
      'git.reset-hard',
    ]) {
      expect([...seen].sort(), id).toContain(id);
    }
    const stream = bothAnalyzers(['parallel'], { label: 'bare' }).match;
    expect(stream.ok && stream.value?.id).toBe('parallel.command-stream-dynamic');
    const template = bothAnalyzers(['parallel', 'rm', '-rf', '{}'], { label: 'bare' }).match;
    expect(template.ok && template.value?.reason).toBe(REASON_PARALLEL_RM);
    const script = bothAnalyzers(['parallel', 'bash', '-c', '{}'], { label: 'bare' }).match;
    expect(script.ok && script.value?.reason).toBe(REASON_PARALLEL_SHELL);
  });

  test('a PARALLEL value in the environment makes the construction unverifiable', () => {
    const plain = bothAnalyzers(['parallel', 'echo', ':::', 'a'], { label: 'bare' });
    expect(plain.match).toStrictEqual({ ok: true, value: null });
    const ambient = bothAnalyzers(['parallel', 'echo', ':::', 'a'], {
      label: 'ambient',
      env: { PARALLEL: '-j4' },
    });
    expect(ambient.match.ok && ambient.match.value?.id).toBe('parallel.command-stream-dynamic');
    const shadowed = bothAnalyzers(['parallel', 'echo', ':::', 'a'], {
      label: 'shadowed',
      env: { PARALLEL: '-j4' },
      assignments: new Map([['PARALLEL', '']]),
    });
    expect(shadowed.match).toStrictEqual({ ok: true, value: null });
  });

  test('an argument product past the child-analysis cap breaches the parallel budget', () => {
    const overCap = Array.from({ length: 1030 }, (_, index) => `job${index}`);
    const breach = bothAnalyzers(['parallel', 'echo', '{}', ':::', ...overCap], {
      label: 'breach',
    });
    expect(breach.match).toStrictEqual({
      ok: false,
      error: { name: 'AnalysisLimit', message: REASON_PARALLEL_ANALYSIS_LIMIT },
    });
    const within = bothAnalyzers(['parallel', 'echo', '{}', ':::', ...overCap.slice(0, 1000)], {
      label: 'within',
    });
    expect(within.match).toStrictEqual({ ok: true, value: null });
    expect(within.budget.counters.get('parallelChildAnalyses')).toBe(1000);
    expect(parallelWork(within.budget)).toMatchObject({
      childAnalyses: 1000,
      placeholderReplacements: 1000,
    });
  });

  test('the two reasons are the strings the denials render', () => {
    expect(REASON_PARALLEL_RM).toBe(
      'parallel rm -rf with dynamic input is dangerous. Use explicit file list instead.',
    );
    expect(REASON_PARALLEL_SHELL).toBe(
      'parallel with shell -c can execute arbitrary commands from dynamic input. Run the inner command directly on an explicit file list instead.',
    );
  });
});
