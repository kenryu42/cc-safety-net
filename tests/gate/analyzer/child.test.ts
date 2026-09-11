import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { realpathSync } from 'node:fs';
import { join } from 'node:path';
import type { PolicyRule } from '@/core/rules/types';
import {
  collectCommandTemplate,
  normalizeChildCommand,
  normalizeChildCommands,
} from '@/gate/analyzer/child-command';
import { pairedEnvironments } from '../../core/differential-inputs';
import { writeTree } from '../../helpers/fixture-tree';
import { createTempRoot, removeTempRoots } from '../../helpers/temp-home';

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
