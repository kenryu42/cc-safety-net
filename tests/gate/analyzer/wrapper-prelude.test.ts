import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { LIMITS } from '@/core/budget';
import { analysisWordText, textCommandWords } from '@/gate/analyzer/command-words';
import {
  parseEnvAssignment,
  reconstructEnvSplitWords,
  stripEnvAssignmentWords,
  stripWrappersForPathScan,
  stripWrappersWithInfo,
} from '@/gate/analyzer/wrapper-prelude';
import { pairedEnvironments } from '../../core/differential-inputs';

const INHERITED = new Map([
  ['TMPDIR', '/inherited/tmp'],
  ['GIT_DIR', '/inherited/git'],
]);

const environments = pairedEnvironments(
  { TMPDIR: '/process/tmp', HOME: '/home/tester', PATH: '/usr/bin', CO: 'checkout' },
  '/home/tester',
);

let root = '';
let sub = '';

beforeAll(() => {
  root = realpathSync(mkdtempSync(join(tmpdir(), 'wrapper-prelude-')));
  sub = join(root, 'sub');
  mkdirSync(sub);
  writeFileSync(join(root, 'file'), 'x');
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('env assignment words', () => {
  test('only a strict NAME=value word is an assignment', () => {
    const rows: readonly {
      readonly token: string;
      readonly assignment: { name: string; value: string } | null;
    }[] = [
      { token: 'FOO=bar', assignment: { name: 'FOO', value: 'bar' } },
      { token: 'FOO=', assignment: { name: 'FOO', value: '' } },
      { token: 'FOO=a=b', assignment: { name: 'FOO', value: 'a=b' } },
      { token: '_X1=y', assignment: { name: '_X1', value: 'y' } },
      { token: '1BAD=x', assignment: null },
      { token: 'FOO+=bar', assignment: null },
      { token: 'FOO-BAR=1', assignment: null },
      { token: '=x', assignment: null },
      { token: 'echo', assignment: null },
      { token: '', assignment: null },
    ];
    for (const row of rows)
      expect(parseEnvAssignment(row.token), row.token).toStrictEqual(row.assignment);
  });

  test('the leading assignments are peeled off the words they prefix', () => {
    const strip = (argv: readonly string[]) => {
      const result = stripEnvAssignmentWords(textCommandWords([...argv]));
      return { words: result.words.map(analysisWordText), env: [...result.envAssignments] };
    };
    expect(strip(['FOO=bar', 'BAZ=qux', 'echo', 'hi'])).toStrictEqual({
      words: ['echo', 'hi'],
      env: [
        ['FOO', 'bar'],
        ['BAZ', 'qux'],
      ],
    });
    expect(strip(['echo', 'hi'])).toStrictEqual({ words: ['echo', 'hi'], env: [] });
    expect(strip(['FOO=bar'])).toStrictEqual({ words: [], env: [['FOO', 'bar']] });
    expect(strip(['TMPDIR+=/extra', 'echo'])).toStrictEqual({
      words: ['TMPDIR+=/extra', 'echo'],
      env: [],
    });
    expect(strip([])).toStrictEqual({ words: [], env: [] });
  });
});

describe('wrapper peel', () => {
  const peel = (
    tokens: readonly string[],
    cwd?: string | null,
    inherited?: ReadonlyMap<string, string>,
  ) => {
    const result = stripWrappersWithInfo([...tokens], environments, cwd, inherited);
    return {
      tokens: result.tokens,
      env: Object.fromEntries(result.envAssignments),
      cwd: result.cwd,
      split: result.envSplitValues,
    };
  };

  test('sudo options are stripped and a chdir option moves the command', () => {
    expect(peel(['sudo', '-u', 'root', 'rm', '-rf', '/tmp/a']).tokens).toStrictEqual([
      'rm',
      '-rf',
      '/tmp/a',
    ]);
    expect(peel(['sudo', '-n', 'rm', '-rf', '/tmp/a']).tokens).toStrictEqual([
      'rm',
      '-rf',
      '/tmp/a',
    ]);
    expect(peel(['sudo', '-u', 'root', '--', 'rm', '-rf', 'x']).tokens).toStrictEqual([
      'rm',
      '-rf',
      'x',
    ]);
    expect(peel(['sudo', '-p', 'prompt', 'rm', '-rf', 'x']).tokens).toStrictEqual([
      'rm',
      '-rf',
      'x',
    ]);
    expect(peel(['sudo']).tokens).toStrictEqual([]);
    expect(peel(['sudo', '-i', 'rm', '-rf', 'x'], root).cwd).toBeNull();
    expect(peel(['sudo', '--login', 'rm', '-rf', 'x'], root).cwd).toBeNull();
    expect(peel(['sudo', '--chdir=', 'rm', '-rf', 'x'], root).cwd).toBeNull();
    expect(peel(['sudo', '-D', 'missing', 'rm', '-rf', 'x'], root).cwd).toBeNull();
    for (const argv of [
      ['sudo', '-D', sub, 'rm', '-rf', 'x'],
      ['sudo', `--chdir=${sub}`, 'rm', '-rf', 'x'],
      ['sudo', `-D${sub}`, 'rm', '-rf', 'x'],
    ])
      expect(peel(argv, root), argv.join(' ')).toMatchObject({
        tokens: ['rm', '-rf', 'x'],
        cwd: sub,
      });
  });

  test('env options are stripped, unset names are recorded and -S values are kept raw', () => {
    expect(peel(['env', '-C=/tmp', 'rm', '-rf']).tokens).toStrictEqual(['rm', '-rf']);
    expect(peel(['env', '-C', '', 'git', 'status'], root)).toMatchObject({
      tokens: ['git', 'status'],
      cwd: null,
    });
    expect(peel(['env', '-C', 'relative', 'git', 'status'], null).cwd).toBeNull();
    expect(peel(['env', '-C', sub, 'rm', '-rf', 'x'], root).cwd).toBe(sub);
    expect(peel(['env', '-C', sub, 'env', '-C', '..', 'rm', '-rf', 'x'], root).cwd).toBe(root);
    expect(peel(['env', '-i', 'rm', '-rf', 'x'], root, INHERITED).env).toStrictEqual({
      TMPDIR: '',
      GIT_DIR: '',
    });
    expect(peel(['env', '-u', 'PATH', 'rm', '-rf', 'x']).env).toStrictEqual({ PATH: '' });
    expect(peel(['env', '-uPATH', 'rm', '-rf', 'x']).env).toStrictEqual({ PATH: '' });
    expect(peel(['env', '--unset=PATH', 'rm', '-rf', 'x']).env).toStrictEqual({ PATH: '' });
    expect(peel(['env', '-u=', 'rm', '-rf', 'x'])).toMatchObject({ tokens: ['rm', '-rf', 'x'] });
    expect(peel(['env', 'FOO=bar', '--', 'rm', '-rf', 'x'])).toMatchObject({
      tokens: ['rm', '-rf', 'x'],
      env: { FOO: 'bar' },
    });
    expect(peel(['env', '-0', 'printf', 'x']).tokens).toStrictEqual(['printf', 'x']);
    expect(peel(['env', '-P', '/bin', 'echo', 'x']).tokens).toStrictEqual(['echo', 'x']);
    expect(peel(['env']).tokens).toStrictEqual([]);
    expect(peel(['env', '-S', 'printf one\\_two', 'git', 'status'], root)).toMatchObject({
      tokens: ['git', 'status'],
      cwd: null,
      split: ['printf one\\_two'],
    });
    expect(peel(['env', '-SLC_ALL=C']).split).toStrictEqual(['LC_ALL=C']);
    expect(peel(['env', '--split-string=rm -rf x'])).toMatchObject({
      tokens: [],
      split: ['rm -rf x'],
    });
    expect(peel(['env', '--split-string', 'rm', '-rf', 'x'])).toMatchObject({
      tokens: ['-rf', 'x'],
      split: ['rm'],
    });
  });

  test('command and builtin prefixes are peeled, and `command -v` becomes a type lookup', () => {
    expect(peel(['command', '-pv', '--', 'git', 'status']).tokens).toStrictEqual(['git', 'status']);
    expect(peel(['command', '-v', 'ls']).tokens).toStrictEqual(['type', 'ls']);
    expect(peel(['command', '-V', 'ls']).tokens).toStrictEqual(['ls']);
    expect(peel(['command', '-x', 'rm']).tokens).toStrictEqual(['-x', 'rm']);
    expect(peel(['command']).tokens).toStrictEqual([]);
    expect(peel(['builtin', 'cd', '/tmp']).tokens).toStrictEqual(['cd', '/tmp']);
    expect(peel(['builtin', '--', 'echo', 'hi']).tokens).toStrictEqual(['echo', 'hi']);
  });

  test('append assignments are followed and other non-assignment prefixes are dropped', () => {
    expect(
      peel(['TMPDIR+=/nested', 'git', 'status'], '/tmp', new Map([['TMPDIR', '/base']])).env,
    ).toStrictEqual({ TMPDIR: '/base/nested' });
    expect(peel(['TMPDIR+=/nested', 'git', 'status'], '/tmp').env).toStrictEqual({
      TMPDIR: '/process/tmp/nested',
    });
    expect(peel(['GIT_DIR+=/extra', 'git', 'status'], root, INHERITED).env).toStrictEqual({
      GIT_DIR: '/inherited/git/extra',
    });
    expect(peel(['PATH+=:/x', 'echo', 'hi'])).toStrictEqual({
      tokens: ['echo', 'hi'],
      env: {},
      cwd: undefined,
      split: undefined,
    });
    expect(peel(['1BAD=x', 'echo', 'hi'])).toMatchObject({ tokens: ['echo', 'hi'], env: {} });
    expect(peel(['FOO+=bar', 'rm', '-rf'])).toMatchObject({ tokens: ['rm', '-rf'], env: {} });
    expect(peel(['FOO=', 'rm', '-rf'])).toMatchObject({ tokens: ['rm', '-rf'], env: { FOO: '' } });
  });

  test('wrappers nest, and assignments past the peel budget are still captured', () => {
    expect(
      peel(['sudo', 'env', 'FOO=1', 'sudo', 'command', '--', 'rm', '-rf', '/tmp/a']),
    ).toMatchObject({ tokens: ['rm', '-rf', '/tmp/a'], env: { FOO: '1' } });
    expect(peel(['FOO=1', 'sudo', '-u', 'root', 'env', 'BAR=2', 'rm', '-rf', 'x'])).toMatchObject({
      tokens: ['rm', '-rf', 'x'],
      env: { FOO: '1', BAR: '2' },
    });
    const overBudget = [
      ...Array.from({ length: LIMITS.wrapperPeelIterations.cap }, () => 'sudo'),
      'FOO=bar',
      'rm',
      '-rf',
    ];
    expect(peel(overBudget)).toMatchObject({ tokens: ['rm', '-rf'], env: { FOO: 'bar' } });
    for (const argv of [
      ['nice', '-n', '10', 'rm', '-rf', 'x'],
      ['time', 'rm', '-rf', 'x'],
      ['exec', 'rm', '-rf', 'x'],
      ['echo', 'hi'],
      [],
    ])
      expect(peel(argv).tokens, argv.join(' ')).toStrictEqual(argv);
  });

  test('the path-scan view splices the quote-grouped split-string words ahead of the operands', () => {
    expect(
      stripWrappersForPathScan(['env', '-S', 'LC_ALL=C mv "a b" c', 'x'], environments, root),
    ).toStrictEqual(['mv', 'a b', 'c', 'x']);
    expect(
      stripWrappersForPathScan(['env', '-S', "rm 'unbalanced x"], environments, root),
    ).toStrictEqual(['rm', 'unbalanced', 'x']);
    expect(stripWrappersForPathScan(['sudo', 'rm', 'x'], environments, root)).toStrictEqual([
      'rm',
      'x',
    ]);
  });

  test('split-string words are only reconstructed when they are inert and within budget', () => {
    const rows: readonly {
      readonly values: readonly string[];
      readonly operands: readonly string[];
      readonly words: string[] | null;
    }[] = [
      { values: [], operands: [], words: [] },
      { values: [], operands: ['tail'], words: ['tail'] },
      {
        values: ['LC_ALL=C rm -rf x'],
        operands: ['tail'],
        words: ['LC_ALL=C', 'rm', '-rf', 'x', 'tail'],
      },
      { values: ['  spaced   words  '], operands: [], words: ['spaced', 'words'] },
      { values: ['has "quote"'], operands: [], words: null },
      { values: ["has 'quote'"], operands: [], words: null },
      { values: ['has $var'], operands: [], words: null },
      { values: ['has `tick`'], operands: [], words: null },
      { values: ['has #comment'], operands: [], words: null },
      { values: ['has {brace}'], operands: [], words: null },
      { values: ['has \\escape'], operands: [], words: null },
      {
        values: [Array.from({ length: 64 }, (_, index) => `w${index}`).join(' ')],
        operands: [],
        words: Array.from({ length: 64 }, (_, index) => `w${index}`),
      },
      {
        values: [Array.from({ length: 64 }, (_, index) => `w${index}`).join(' ')],
        operands: ['tail'],
        words: null,
      },
    ];
    for (const row of rows)
      expect(
        reconstructEnvSplitWords(row.values, row.operands),
        `${row.values.join('|')} + ${row.operands.join('|')}`,
      ).toStrictEqual(row.words);
  });
});
