import { describe, expect, test } from 'bun:test';
import { createBudget } from '@/core/budget';
import type { CustomRule } from '@/core/policy/types';
import { textCommandWords } from '@/gate/analyzer/command-words';
import { analyzeChildCommand } from '@/gate/analyzer/segment';
import {
  analyzeXargs,
  extractXargsChildCommandWithInfo,
  REASON_XARGS_RM,
  REASON_XARGS_SHELL,
} from '@/gate/analyzer/xargs';
import { pairedEnvironments } from '../../core/differential-inputs';
import { describeOutcome } from '../../helpers/fixture-tree';
import { policySnapshot, testModes } from '../../helpers/policy';

/**
 * `xargs` reads its arguments from a stream nobody can see, so the analyzer asks two questions of
 * every child: what appended input can still change, and what a replacement token could be made to
 * spell. Each row states the verdict the analyzer reaches over the option shapes, child heads and
 * policy states, and the nested sources it hands back to the caller.
 *
 * The paths here are lexical, not a fixture tree: every verdict `xargs` reaches is decided by the
 * option scan and the child dispatch, and the canonicalization underneath is pinned by the path
 * tests under `tests/core/`.
 */

const AGENT_HOME = '/srv/agent';
const CHECKOUT = '/srv/agent/checkout';

const DEPLOY_RULES: readonly CustomRule[] = [
  {
    name: 'no-cluster-drain',
    command: 'kubectl',
    subcommand: 'drain',
    block_args: ['--force'],
    reason: 'Draining a node is an operator action.',
  },
  {
    name: 'no-registry-push',
    command: 'skopeo',
    block_args: ['copy'],
    reason: 'Image promotion goes through the release job.',
  },
];

const NESTED_HIT = {
  id: 'custom.nested-xargs-source',
  reason: 'nested source',
  intent: 'manual_only',
} as const;

type XargsSetting = {
  readonly label: string;
  readonly rules?: readonly CustomRule[];
  readonly strict?: boolean;
  readonly paranoidRm?: boolean;
  readonly worktreeMode?: boolean;
  readonly assignments?: ReadonlyMap<string, string>;
  readonly ruleOff?: string;
};

const SETTINGS: readonly XargsSetting[] = [
  { label: 'defaults' },
  { label: 'custom rules', rules: DEPLOY_RULES },
  { label: 'strict', strict: true, rules: DEPLOY_RULES },
  { label: 'paranoid rm', paranoidRm: true },
  { label: 'worktree mode', worktreeMode: true },
  { label: 'wrapper assignment', assignments: new Map([['GIT_DIR', '/srv/elsewhere/.git']]) },
  { label: 'dynamic rule off', ruleOff: 'xargs.shell-dynamic', rules: DEPLOY_RULES },
];

/** The one effective-rule state a setting can carry: a single rule switched off by an override. */
function ruleStates(id: string | undefined) {
  if (id === undefined) return {};
  return {
    [id]: {
      changesInherited: true,
      enabled: false,
      inheritedEnabled: true,
      source: 'rule_override' as const,
    },
  };
}

function snapshotFor(setting: XargsSetting) {
  return policySnapshot({ rules: setting.rules ?? [], transparent_wrappers: ['uv'] });
}

/** One token list through the analyzer, with its own budget and nested-source log. */
function runBothXargs(tokens: readonly string[], setting: XargsSetting) {
  const paired = pairedEnvironments({ HOME: AGENT_HOME, PATH: '/usr/bin:/bin' }, AGENT_HOME);
  const asked: string[] = [];
  const shared = {
    allowTmpdirVar: true,
    cwd: CHECKOUT,
    envAssignments: setting.assignments ?? new Map<string, string>(),
    originalCwd: CHECKOUT,
    paranoidRm: setting.paranoidRm,
    policy: {
      ...snapshotFor(setting).policy,
      effectiveDestructiveCommandRules: ruleStates(setting.ruleOff),
    },
    protectedGitMetadata: null,
    strict: setting.strict,
    worktreeMode: setting.worktreeMode,
  };
  // The dispatch the analyzer entry point would hand this producer, so a child reaches the same
  // rules it reaches through the whole gate. The capabilities are inert here: the modes each
  // child is judged under are the ones `shared` already carries.
  const dispatchOptions = {
    ...shared,
    policySnapshot: snapshotFor(setting),
    effectiveCapabilities: testModes().capabilities,
    budget: createBudget(),
    effectiveCwd: CHECKOUT,
    environment: paired,
    analyzeNested: (source: string) => {
      asked.push(source);
      return source.includes('BOOM')
        ? { reason: NESTED_HIT.reason, ruleId: NESTED_HIT.id, intent: NESTED_HIT.intent }
        : null;
    },
  };
  return {
    asked,
    match: describeOutcome(() =>
      analyzeXargs(textCommandWords(tokens), {
        ...dispatchOptions,
        analyzeChild: (childTokens, child) =>
          analyzeChildCommand(childTokens, 0, dispatchOptions, child),
        analyzeNested: (source: string) => {
          asked.push(source);
          return source.includes('BOOM') ? NESTED_HIT : null;
        },
      }),
    ),
  };
}

/** Option shapes: the replacement forms, the value-taking options and the terminators. */
const OPTION_SHAPES: readonly (readonly string[])[] = [
  ['xargs'],
  ['xargs', 'rm', '-rf'],
  ['xargs', '-0', 'rm', '-rf'],
  ['xargs', '-0', '-n', '1', 'rm', '-rf'],
  ['xargs', '-n1', 'rm', '-rf'],
  ['xargs', '-P', '4', 'rm', '-rf'],
  ['xargs', '-P4', '-n', '2', 'rm', '-rf'],
  ['xargs', '-L', '1', 'echo'],
  ['xargs', '-s', '4096', 'echo'],
  ['xargs', '-E', 'END', 'echo'],
  ['xargs', '-a', 'list.txt', 'rm', '-rf'],
  ['xargs', '-d', '\\n', 'rm', '-rf'],
  ['xargs', '--max-args', '2', 'rm', '-rf'],
  ['xargs', '--max-procs=4', 'rm', '-rf'],
  ['xargs', '--delimiter', '\\0', 'rm', '-rf'],
  ['xargs', '--process-slot-var', 'SLOT', 'echo'],
  ['xargs', '--unknown-flag', 'rm', '-rf'],
  ['xargs', '--', 'rm', '-rf'],
  ['xargs', '--', '-I', '{}'],
  ['xargs', '-I', '{}', 'rm', '-rf', '{}'],
  ['xargs', '-I{}', 'rm', '-rf', '{}'],
  ['xargs', '-I', '%', 'rm', '-rf', '%'],
  ['xargs', '-I%', 'rm', '%'],
  ['xargs', '--replace', 'rm', '-rf', '{}'],
  ['xargs', '--replace=%', 'rm', '-rf', '%'],
  ['xargs', '--replace=', 'rm', '-rf', '{}'],
  ['xargs', '-J', '%', 'cp', 'src', '%'],
  ['xargs', '-I'],
  ['xargs', '-J'],
  ['xargs', '-n'],
  ['xargs', '', 'rm', '-rf'],
  ['xargs', '-I', '{}'],
];

/** Child heads: every branch of the executed-source question. */
const CHILD_SHAPES: readonly (readonly string[])[] = [
  ['xargs', 'cat'],
  ['xargs', 'rm', '-rf', 'dist'],
  ['xargs', '-I', '{}', 'rm', '{}'],
  ['xargs', '-I', '{}', 'rm', '-{}', 'dist'],
  ['xargs', '-I', '{}', 'rm', '-rf', '--', '{}'],
  ['xargs', '-I', '{}', '{}', 'dist'],
  ['xargs', '-I', '{}', 'rm', '-rf', '/'],
  ['xargs', 'sh', '-c', 'rm -rf /tmp/x'],
  ['xargs', 'sh', '-c', 'rm -rf "$1"', '_'],
  ['xargs', 'sh', '-c', 'eval "$FOO"'],
  ['xargs', 'bash', '-c', '$0'],
  ['xargs', 'bash', '-c', 'echo BOOM'],
  ['xargs', 'sh', '-n', '-c', 'rm -rf /'],
  ['xargs', 'sh', 'script.sh'],
  ['xargs', 'sh'],
  ['xargs', '-I', '{}', 'sh', '-c', 'echo {}'],
  ['xargs', '-I', '{}', 'sh', '-c', '{}'],
  ['xargs', '-I', '{}', 'sh', '{}'],
  ['xargs', '-I', '{}', 'sh', '-{}', 'echo hi'],
  ['xargs', '-I', '{}', '{}c', 'rm -rf /'],
  ['xargs', 'env', 'FOO=bar', 'rm', '-rf'],
  ['xargs', '-I', '{}', 'env', 'FOO={}', 'sh', '-c', 'eval "$FOO"'],
  ['xargs', '-I', '{}', 'env', 'FOO={}', 'sh', '-c', 'echo hi'],
  ['xargs', 'python3', '-c', 'print(1)'],
  ['xargs', 'python3', 'main.py'],
  ['xargs', 'python3'],
  ['xargs', '-I', '{}', 'python3', '-c', '{}'],
  ['xargs', '-I', '{}', 'python3', '{}'],
  ['xargs', '-I', '{}', 'python3', '-{}', 'print(1)'],
  ['xargs', 'node', '-e', 'process.exit(0)'],
  ['xargs', '-I', '{}', 'node', '--eval={}'],
  ['xargs', 'awk', '{ print }'],
  ['xargs', 'awk'],
  ['xargs', '-I', '{}', 'awk', '{}'],
  ['xargs', '-I', '{}', 'awk', '-f', '{}'],
  ['xargs', 'eval'],
  ['xargs', 'eval', 'echo hi'],
  ['xargs', '-I', '{}', 'eval', '{}'],
  ['xargs', 'find', '.', '-delete'],
  ['xargs', '-I', '{}', 'find', '{}', '-delete'],
  ['xargs', '-I', '{}', 'find', '.', '-name', '{}'],
  ['xargs', '-I', '{}', 'find', '.', '-name', 'x', '-print'],
  ['xargs', '-I', '{}', 'find', '.', '-exec', 'rm', '-rf', '{}', ';'],
  ['xargs', '-I', '%', 'find', '.', '-exec', 'rm', '-%', 'dist', ';'],
  ['xargs', '-I', '{}', 'find', '.', '-exec', 'sh', '-c', '{}', ';'],
  ['xargs', '-I', '{}', 'find', '.', '-newermt', '{}'],
  ['xargs', 'git', 'reset', '--hard'],
  ['xargs', 'git'],
  ['xargs', 'git', 'status'],
  ['xargs', '-I', '{}', 'git', '{}', '--hard'],
  ['xargs', '-I', '{}', 'git', 'checkout', '{}'],
  ['xargs', '-I', '{}', 'git', 'checkout', '--', '{}'],
  ['xargs', '-I', '{}', 'git', 'status', '{}'],
  ['xargs', 'command', 'rm', '-rf'],
  ['xargs', 'command', '-I', '{}'],
  ['xargs', 'sudo', 'rm', '-rf'],
  ['xargs', '-I', '{}', 'sudo', '{}'],
  ['xargs', 'uv', 'run', 'rm', '-rf'],
  ['xargs', 'kubectl', 'drain', '--force'],
  ['xargs', '-I', '{}', 'kubectl', 'drain', '{}'],
  ['xargs', '-I', '{}', 'skopeo', '{}'],
  ['xargs', 'skopeo', 'copy'],
  ['xargs', '-I', '{}', 'echo', '{}'],
  ['xargs', 'printf', '%s'],
];

const EVERY_SHAPE = [...OPTION_SHAPES, ...CHILD_SHAPES];

describe('xargs option parsing', () => {
  test('the option scan stops where the child command starts', () => {
    const rows: readonly {
      readonly tokens: readonly string[];
      readonly info: { childStart: number; replacementToken: string | null };
    }[] = [
      { tokens: ['xargs', 'rm', '-rf'], info: { childStart: 1, replacementToken: null } },
      {
        tokens: ['xargs', '-I', '{}', 'rm', '-rf', '{}'],
        info: { childStart: 3, replacementToken: '{}' },
      },
      {
        tokens: ['xargs', '-I%', 'rm', '-rf', '%'],
        info: { childStart: 2, replacementToken: '%' },
      },
      {
        tokens: ['xargs', '--replace', 'rm', '-rf'],
        info: { childStart: 2, replacementToken: '{}' },
      },
      {
        tokens: ['xargs', '--replace=', 'rm', '-rf'],
        info: { childStart: 2, replacementToken: '{}' },
      },
      {
        tokens: ['xargs', '--replace=FOO', 'rm', 'FOO'],
        info: { childStart: 2, replacementToken: 'FOO' },
      },
      {
        tokens: ['xargs', '-J', '%', 'cp', 'src', '%'],
        info: { childStart: 3, replacementToken: '%' },
      },
      // Value-taking options consume their value, attached or separate.
      { tokens: ['xargs', '-0', 'rm'], info: { childStart: 2, replacementToken: null } },
      { tokens: ['xargs', '-n', '1', 'rm'], info: { childStart: 3, replacementToken: null } },
      { tokens: ['xargs', '-n1', 'rm'], info: { childStart: 2, replacementToken: null } },
      {
        tokens: ['xargs', '-P4', '-n', '2', 'rm'],
        info: { childStart: 4, replacementToken: null },
      },
      { tokens: ['xargs', '--max-procs=4', 'rm'], info: { childStart: 2, replacementToken: null } },
      {
        tokens: ['xargs', '--process-slot-var', 'SLOT', 'rm'],
        info: { childStart: 3, replacementToken: null },
      },
      {
        tokens: ['xargs', '--process-slot-var=SLOT', 'rm'],
        info: { childStart: 2, replacementToken: null },
      },
      { tokens: ['xargs', '--', 'rm', '-rf'], info: { childStart: 2, replacementToken: null } },
      { tokens: ['xargs'], info: { childStart: 1, replacementToken: null } },
      { tokens: [], info: { childStart: 0, replacementToken: null } },
    ];
    for (const row of rows)
      expect(extractXargsChildCommandWithInfo(row.tokens), row.tokens.join(' ')).toStrictEqual(
        row.info,
      );
  });

  test('the table separates every replacement spelling from the plain options', () => {
    const spellings = EVERY_SHAPE.map(
      (tokens) => extractXargsChildCommandWithInfo(tokens).replacementToken,
    );
    expect(new Set(spellings)).toStrictEqual(new Set([null, '{}', '%']));
    expect(extractXargsChildCommandWithInfo(['xargs', '-0', 'rm']).childStart).toBe(2);
    expect(extractXargsChildCommandWithInfo(['xargs', '-n', '1', 'rm']).childStart).toBe(3);
    expect(extractXargsChildCommandWithInfo(['xargs', '-n1', 'rm']).childStart).toBe(2);
  });
});

describe('xargs analysis', () => {
  /** The rule one child earns under one of the settings above. */
  function ruleIdFor(tokens: readonly string[], label: string): string | null {
    const setting = SETTINGS.find((row) => row.label === label);
    if (!setting) throw new Error(`unknown setting: ${label}`);
    const verdict = runBothXargs(tokens, setting).match;
    if (!verdict.ok) throw new Error(`${label}: ${tokens.join(' ')} threw ${verdict.error.name}`);
    return verdict.value?.id ?? null;
  }

  test('appended input can complete a wrapper, an interpreter or an option', () => {
    const rows: readonly { readonly tokens: readonly string[]; readonly id: string | null }[] = [
      { tokens: ['xargs', 'env', '--'], id: 'xargs.shell-dynamic' },
      { tokens: ['xargs', 'bash'], id: 'xargs.shell-dynamic' },
      { tokens: ['xargs', 'python3'], id: 'xargs.shell-dynamic' },
      { tokens: ['xargs', 'node', '-e', 'console.log(1)'], id: 'xargs.shell-dynamic' },
      { tokens: ['xargs', 'git'], id: 'xargs.shell-dynamic' },
      { tokens: ['xargs', 'find', '.'], id: 'xargs.shell-dynamic' },
      { tokens: ['xargs', 'rm', '-rf'], id: 'xargs.rm-recursive-force-dynamic' },
      // A child that only reads, or one whose options are already closed, has nothing to change.
      { tokens: ['xargs', 'cat'], id: null },
      { tokens: ['xargs', 'echo'], id: null },
      { tokens: ['xargs', 'printf', '%s'], id: null },
      { tokens: ['xargs', 'node', '-e', 'console.log(1)', '--'], id: null },
      { tokens: ['xargs', 'git', 'status'], id: null },
      // busybox is peeled by the child dispatch, so the applet is the child that is judged.
      { tokens: ['xargs', 'busybox', 'rm', '-rf'], id: 'xargs.rm-recursive-force-dynamic' },
      // A literal catastrophic target is judged by the child's own rule.
      { tokens: ['xargs', '-I', '{}', 'rm', '-rf', '/'], id: 'rm.recursive-force-root-or-home' },
      {
        tokens: ['xargs', '-I', '{}', 'busybox', 'rm', '-rf', '/'],
        id: 'rm.recursive-force-root-or-home',
      },
      { tokens: ['xargs', 'git', 'reset', '--hard'], id: 'git.reset-hard' },
      { tokens: ['xargs', 'find', '.', '-delete'], id: 'find.delete' },
    ];
    for (const row of rows)
      expect(ruleIdFor(row.tokens, 'defaults'), row.tokens.join(' ')).toBe(row.id);
  });

  test('a replacement token is judged by what it could be made to spell', () => {
    const rows: readonly { readonly tokens: readonly string[]; readonly id: string | null }[] = [
      { tokens: ['xargs', '-I', '{}', 'bash', '{}'], id: 'xargs.shell-dynamic' },
      { tokens: ['xargs', '-I', '{}', 'node', '-{}', 'console.log(1)'], id: 'xargs.shell-dynamic' },
      { tokens: ['xargs', '-I', '{}', 'awk', '-f', '{}'], id: 'xargs.shell-dynamic' },
      { tokens: ['xargs', '-I', '{}', 'git', 'reset', '{}'], id: 'xargs.shell-dynamic' },
      { tokens: ['xargs', '-I', '{}', 'rm', '-{}', '/'], id: 'xargs.shell-dynamic' },
      // A replacement that can only be an operand leaves the child as written.
      { tokens: ['xargs', '-I', '{}', 'echo', '{}'], id: null },
      { tokens: ['xargs', '-I', '{}', 'git', 'status', '--', '{}'], id: null },
      { tokens: ['xargs', '-I', '{}', 'rm', '--', '{}'], id: null },
    ];
    for (const row of rows)
      expect(ruleIdFor(row.tokens, 'defaults'), row.tokens.join(' ')).toBe(row.id);
    // With the dynamic-source rule off, the replacement still reaches `rm`'s own options, so the
    // dynamic-input rm rule is what remains.
    expect(ruleIdFor(['xargs', '-I', '{}', 'rm', '-{}', '/'], 'dynamic rule off')).toBe(
      'xargs.rm-recursive-force-dynamic',
    );
  });

  test('a custom rule can be completed by appended input or by a replacement', () => {
    for (const tokens of [
      ['xargs', 'kubectl', 'drain'],
      ['xargs', 'kubectl', 'drain', '--force'],
      ['xargs', '-I', '{}', 'kubectl', 'drain', '{}'],
    ]) {
      expect(ruleIdFor(tokens, 'custom rules'), tokens.join(' ')).toBe('custom.no-cluster-drain');
      expect(ruleIdFor(tokens, 'defaults'), tokens.join(' ')).not.toBe('custom.no-cluster-drain');
    }
    expect(ruleIdFor(['xargs', 'skopeo', 'copy'], 'custom rules')).toBe('custom.no-registry-push');
  });

  test('the nested sources handed back are the child command bodies', () => {
    expect(runBothXargs(['xargs', 'sh', '-c', 'echo hi'], { label: 'defaults' }).asked).toContain(
      'echo hi',
    );
    const nested = runBothXargs(['xargs', 'bash', '-c', 'echo BOOM'], { label: 'defaults' });
    expect(nested.match).toStrictEqual({ ok: true, value: NESTED_HIT });
    expect(runBothXargs(['xargs', 'cat'], { label: 'defaults' }).asked).toStrictEqual([]);
  });

  test('the shapes reach the dynamic-source, dynamic-rm and custom-rule verdicts', () => {
    const reported: string[] = [];
    for (const tokens of EVERY_SHAPE) {
      for (const setting of SETTINGS) {
        const verdict = runBothXargs(tokens, setting).match;
        if (verdict.ok && verdict.value) reported.push(verdict.value.id);
      }
    }
    for (const ruleId of [
      'custom.no-cluster-drain',
      'find.delete',
      'git.reset-hard',
      'rm.recursive-force-root-or-home',
      'xargs.rm-recursive-force-dynamic',
      'xargs.shell-dynamic',
    ]) {
      expect([...new Set(reported)].sort(), ruleId).toContain(ruleId);
    }
  });

  test('a reader child is allowed where a deleting child is not', () => {
    // `printf / | xargs rm -rf` denies without a replacement token: appended input is the target.
    const appended = runBothXargs(['xargs', 'rm', '-rf'], { label: 'defaults' }).match;
    expect(appended.ok && appended.value?.id).toBe('xargs.rm-recursive-force-dynamic');
    expect(appended.ok && appended.value?.reason).toBe(REASON_XARGS_RM);
    // `echo x | xargs cat` reads, it does not execute, so there is nothing to deny.
    expect(runBothXargs(['xargs', 'cat'], { label: 'defaults' }).match).toStrictEqual({
      ok: true,
      value: null,
    });
  });

  test('a disabled rule drops only the filterable verdict', () => {
    const dynamicShell = ['xargs', 'sh', '-c', 'eval "$1"', '_'];
    const on = runBothXargs(dynamicShell, { label: 'defaults' }).match;
    expect(on.ok && on.value?.id).toBe('xargs.shell-dynamic');
    expect(on.ok && on.value?.reason).toBe(REASON_XARGS_SHELL);
    const off = runBothXargs(dynamicShell, { label: 'off', ruleOff: 'xargs.shell-dynamic' });
    expect(off.match).toStrictEqual({ ok: true, value: null });
  });

  test('the denial reasons name what the caller should do instead', () => {
    expect(REASON_XARGS_RM).toBe(
      'xargs rm -rf with dynamic input is dangerous. Use explicit file list instead.',
    );
    expect(REASON_XARGS_SHELL).toBe(
      'xargs dynamic input can supply arbitrary executable command source. Use an explicit child command and arguments instead.',
    );
  });
});
