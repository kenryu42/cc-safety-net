import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { realpathSync } from 'node:fs';
import { join } from 'node:path';
import { createBudget } from '@/core/budget';
import type { CustomRule } from '@/core/policy/types';
import type { ChildProvenance } from '@/gate/analyzer/child-command';
import { analyzeChildCommand } from '@/gate/analyzer/segment';
import { pairedEnvironments } from '../../core/differential-inputs';
import { describeOutcome, writeTree } from '../../helpers/fixture-tree';
import { policySnapshot, testModes } from '../../helpers/policy';
import { createTempRoot, removeTempRoots } from '../../helpers/temp-home';

/**
 * A child a producer synthesized from its own arguments is dispatched through the same
 * per-command path as the command as written, carrying the provenance that says which producer
 * built it and what the input it cannot see could still change. Each row states the rule one
 * child reaches, and which of the producer's own reasons answers when no rule does.
 */

let root = '';
let workspace = '';

beforeAll(() => {
  root = realpathSync(createTempRoot('next-segment-'));
  workspace = join(root, 'work');
  writeTree(root, { 'home/notes': null, 'work/build': null });
});
afterAll(removeTempRoots);

const CUSTOM_RULES: readonly CustomRule[] = [
  {
    name: 'block-deploy',
    command: 'deploy-tool',
    block_args: ['--prod'],
    reason: 'Deployments are manual.',
  },
];

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

/** The half of a child's provenance a producer fills in from the input it cannot see. */
type ChildInput = Partial<
  Pick<
    ChildProvenance,
    | 'producer'
    | 'wrappedByTransparent'
    | 'dynamicInput'
    | 'dynamicRmInput'
    | 'dynamicSourceInput'
    | 'shellDynamicMatch'
    | 'dynamicSourceMatch'
    | 'rmDynamicMatch'
  >
>;

const ANALYSIS_OPTIONS: readonly ChildInput[] = [
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
function dispatchPair(tokens: readonly string[], row: ChildAnalysisCase, input: ChildInput) {
  const snapshot = policySnapshot({ rules: CUSTOM_RULES });
  const nested: string[] = [];
  const options = {
    policySnapshot: snapshot,
    effectiveCapabilities: testModes().capabilities,
    environment: pairedEnvironments({ HOME: join(root, 'home') }, join(root, 'home')),
    protectedGitMetadata: null,
    budget: createBudget(),
    policy: { ...snapshot.policy, effectiveDestructiveCommandRules: {} },
    cwd: workspace,
    effectiveCwd: workspace,
    envAssignments: new Map<string, string>(),
    strict: row.strict,
    paranoidRm: row.paranoidRm,
    paranoidInterpreters: row.paranoidInterpreters,
    worktreeMode: row.worktreeMode,
    analyzeNested: (command: string) => {
      nested.push(command);
      return command.includes('NESTED')
        ? { reason: 'nested', ruleId: 'custom.nested', intent: 'manual_only' as const }
        : null;
    },
  };
  const child: ChildProvenance = {
    producer: 'xargs',
    cwd: workspace,
    originalCwd: workspace,
    effectiveCwd: workspace,
    envAssignments: new Map(),
    allowTmpdirVar: true,
    worktreeMode: row.worktreeMode,
    wrappedByTransparent: false,
    ...input,
  };
  return {
    match: describeOutcome(() => analyzeChildCommand(tokens, 0, options, child)),
    nested,
  };
}

describe('synthesized child dispatch', () => {
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
    const matchFor = (tokens: readonly string[], input: ChildInput) => {
      const outcome = dispatchPair(tokens, standard, input).match;
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

  test('a command the caller only named reaches the custom rules through a wrapper', () => {
    const standard = { label: 'standard' };
    const idFor = (input: ChildInput) => {
      const outcome = dispatchPair(['deploy-tool', '--prod'], standard, input).match;
      if (!outcome.ok) throw outcome.error;
      return outcome.value?.id ?? null;
    };
    expect(idFor({ producer: 'unknown-head', wrappedByTransparent: false })).toBeNull();
    expect(idFor({ producer: 'unknown-head', wrappedByTransparent: true })).toBe(
      'custom.block-deploy',
    );
    // A child a producer built from its own arguments always asks them.
    expect(idFor({})).toBe('custom.block-deploy');
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
        ANALYSIS_OPTIONS.flatMap((input) =>
          CHILD_COMMANDS.flatMap((tokens) => {
            const outcome = dispatchPair(tokens, row, input).match;
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
