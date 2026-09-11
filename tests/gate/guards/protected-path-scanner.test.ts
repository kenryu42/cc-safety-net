import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { createBudget } from '@/core/budget';
import type { Environment } from '@/core/environment';
import {
  normalizeProtectedFileCandidate,
  normalizeProtectedPathCandidate,
} from '@/core/paths/canonicalization';
import { parseCommand } from '@/core/shell/parse';
import {
  expandTrackedShellVariables,
  isAssignmentOnlySegment,
  type ProtectedPathShellState,
  readGuardSyntax,
} from '@/gate/guards/guard-walk';
import {
  extractMvOperandPaths,
  findProtectedPathMutationInCommand,
} from '@/gate/guards/protected-path-scanner';
import { pairedEnvironments } from '../../core/differential-inputs';
import { describeOutcome, type Outcome, writeTree } from '../../helpers/fixture-tree';

const MARKER = 'policy.json';

let root = '';
let home = '';
let workspace = '';

type Observation = string;

function describeState(state: ProtectedPathShellState): string {
  return `cwd=${state.cwd} vars=${JSON.stringify([...state.variables].sort())}`;
}

function observing(observations: Observation[], stopWord: string | null) {
  return {
    findSegmentTarget: (segment: readonly string[], state: ProtectedPathShellState) => {
      observations.push(`segment ${JSON.stringify(segment)} ${describeState(state)}`);
      return stopWord !== null && segment.includes(stopWord) ? segment.join(' ') : null;
    },
    isRedirectionTarget: (target: string, state: ProtectedPathShellState) => {
      observations.push(`redirect ${target} ${describeState(state)}`);
      return target.includes(MARKER);
    },
    findMalformedTarget: (source: string) => {
      observations.push(`malformed ${source}`);
      return source.includes(MARKER) ? source : null;
    },
  };
}

type Walk = { result: string | null; observations: readonly Observation[] };

function walkWithNext(source: string, cwd: string, environment: Environment, stop: string | null) {
  const observations: Observation[] = [];
  const result = findProtectedPathMutationInCommand(
    readGuardSyntax(source, parseCommand(source, 'posix')),
    cwd,
    environment,
    createBudget(),
    observing(observations, stop),
  );
  return { result, observations };
}

const canonical = (base: string, ...parts: string[]) =>
  join(realpathSync(base), ...parts)
    .split(sep)
    .join('/');

function walkPair(source: string, cwd: string, stop: string | null): Outcome<Walk> {
  const environments = pairedEnvironments({ HOME: home, TMPDIR: join(root, 'tmp') }, home);
  return describeOutcome(() => walkWithNext(source, cwd, environments, stop));
}

function completedWalk(outcome: Outcome<Walk>): Walk {
  if (!outcome.ok) throw new Error(`walk threw ${outcome.error.name}`);
  return outcome.value;
}

const CD_SOURCES: readonly string[] = [
  `cd ${MARKER}`,
  'cd /nowhere && rm -rf x',
  'cd - && rm -rf x',
  'cd ..; rm -rf x',
  'cd ~ ; rm -rf x',
  'cd "$HOME" ; rm -rf x',
  'cd $DIR ; rm -rf x',
  'DIR=policy; cd $DIR; rm -rf x',
  'DIR=policy && cd ${DIR} && rm -rf x',
  'DIR=policy; cd ${OTHER:-$DIR}; rm -rf x',
  'DIR=policy; cd ${DIR:+alt}; rm -rf x',
  'EMPTY=; cd ${EMPTY:-policy}; rm -rf x',
  'EMPTY=; cd ${EMPTY-policy}; rm -rf x',
  'A=policy B=$A; cd $B; rm -rf x',
  'A=policy; B=$A; cd $B; rm -rf x',
  'cd policy | cd link | rm -rf x',
  'cd policy & cd link & rm -rf x',
  'cd policy || cd link || rm -rf x',
  'sudo cd policy && rm -rf x',
  'env -i cd policy && rm -rf x',
  'command cd policy && rm -rf x',
  'FOO=1 cd policy && rm -rf x',
  'cd link && rm -rf x',
  'cd policy/nested && rm -rf x',
  'cd /absolute/missing && rm -rf x',
  '(cd policy && rm -rf x)',
  'cd; rm -rf x',
  'cd ""; rm -rf x',
  './cd policy && rm -rf x',
  '/usr/bin/cd policy && rm -rf x',
];

const SEGMENT_SOURCES: readonly string[] = [
  `rm -rf ${MARKER}`,
  `rm -rf policy/${MARKER} && echo done`,
  `mv ${MARKER} /tmp/elsewhere`,
  `mv -t /tmp ${MARKER}`,
  `echo hi > ${MARKER}`,
  `echo hi >> policy/${MARKER}`,
  `echo hi 2> ${MARKER}`,
  `echo hi >| ${MARKER}`,
  `cat < ${MARKER}`,
  `cat <<EOF > ${MARKER}\nbody\nEOF`,
  `DEST=${MARKER}; echo hi > $DEST`,
  'DEST=policy.json; echo hi > ${DEST}',
  'DEST=policy.json echo hi > $DEST',
  `find . -name '*.json' -delete`,
  `find policy -delete`,
  `echo "unclosed > ${MARKER}`,
  `echo hi > ${MARKER}; echo second > other`,
  `A=1 B=2`,
  `A=1 B=2; rm -rf ${MARKER}`,
  `rm -rf x && echo hi > ${MARKER}`,
];

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'next-protected-path-'));
  home = join(root, 'home');
  workspace = join(root, 'work');
  writeTree(root, {
    'home/.config': null,
    tmp: null,
    'work/nested': null,
    [`policy/${MARKER}`]: '{}',
    'policy/nested': null,
    link: { symlink: join(root, 'policy') },
    'dangling-link': { symlink: join(root, 'nowhere') },
  });
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('protected path scanner walk', () => {
  const lastSegmentCwd = (source: string) => {
    const observations = completedWalk(walkPair(source, workspace, null)).observations.filter(
      (observation) => observation.startsWith('segment '),
    );
    return observations.at(-1)?.match(/cwd=(\S+)/)?.[1] ?? null;
  };

  test('a cd moves the directory the next segment is scanned in', () => {
    const rows: readonly { readonly source: string; readonly cwd: () => string }[] = [
      { source: 'cd policy && rm -rf x', cwd: () => canonical(workspace, 'policy') },
      {
        source: 'cd policy/nested && rm -rf x',
        cwd: () => canonical(workspace, 'policy', 'nested'),
      },
      { source: 'cd ..; rm -rf x', cwd: () => canonical(root) },
      { source: 'cd ~ ; rm -rf x', cwd: () => canonical(home) },
      { source: 'cd "$HOME" ; rm -rf x', cwd: () => canonical(home) },
      { source: 'DIR=policy; cd $DIR; rm -rf x', cwd: () => canonical(workspace, 'policy') },
      { source: 'DIR=policy && cd ${DIR} && rm -rf x', cwd: () => canonical(workspace, 'policy') },
      { source: 'A=policy; B=$A; cd $B; rm -rf x', cwd: () => canonical(workspace, 'policy') },
      { source: 'sudo cd policy && rm -rf x', cwd: () => canonical(workspace, 'policy') },
      { source: 'env -i cd policy && rm -rf x', cwd: () => canonical(workspace, 'policy') },
      { source: 'command cd policy && rm -rf x', cwd: () => canonical(workspace, 'policy') },
      { source: 'FOO=1 cd policy && rm -rf x', cwd: () => canonical(workspace, 'policy') },
      { source: '/usr/bin/cd policy && rm -rf x', cwd: () => canonical(workspace, 'policy') },
      { source: 'cd; rm -rf x', cwd: () => workspace },
      { source: 'cd ""; rm -rf x', cwd: () => workspace },
      {
        source: 'cd /absolute/missing && rm -rf x',
        cwd: () => resolve('/absolute/missing').split(sep).join('/'),
      },
      { source: '(cd policy) && rm -rf x', cwd: () => workspace },
      { source: 'rm -rf $(cd policy; pwd)/x', cwd: () => workspace },
      { source: 'cd policy && cd - && rm -rf x', cwd: () => workspace },
      { source: 'cd policy; cd -; cd -; rm -rf x', cwd: () => canonical(workspace, 'policy') },
      { source: 'cd - && rm -rf x', cwd: () => workspace },
    ];
    for (const row of rows) {
      expect(lastSegmentCwd(row.source), row.source).toBe(row.cwd());
    }
  });

  test('a segment target and a write-like redirection target reach the guard', () => {
    const rows: readonly { readonly source: string; readonly result: string | null }[] = [
      { source: `rm -rf ${MARKER}`, result: `rm -rf ${MARKER}` },
      { source: `rm -rf ${MARKER} && echo done`, result: `rm -rf ${MARKER}` },
      { source: `mv ${MARKER} /tmp/elsewhere`, result: `mv ${MARKER} /tmp/elsewhere` },
      { source: `echo hi > ${MARKER}`, result: MARKER },
      { source: `echo hi >> policy/${MARKER}`, result: `policy/${MARKER}` },
      { source: `echo hi 2> ${MARKER}`, result: MARKER },
      { source: `echo hi >| ${MARKER}`, result: MARKER },
      { source: `cat < ${MARKER}`, result: null },
      { source: `DEST=${MARKER}; echo hi > $DEST`, result: '${DEST}' },
      { source: 'DEST=policy.json echo hi > $DEST', result: null },
      { source: `find . -name '*.json' -delete`, result: null },
      { source: 'A=1 B=2', result: null },
      { source: `A=1 B=2; rm -rf ${MARKER}`, result: `rm -rf ${MARKER}` },
      { source: `rm -rf x && echo hi > ${MARKER}`, result: MARKER },
      { source: `echo hi > ${MARKER}; echo second > other`, result: MARKER },
      { source: `( rm -rf ${MARKER} )`, result: `rm -rf ${MARKER}` },
      { source: `(cd policy) && rm -rf ${MARKER}`, result: `rm -rf ${MARKER}` },
    ];
    for (const row of rows) {
      expect(completedWalk(walkPair(row.source, workspace, MARKER)).result, row.source).toBe(
        row.result,
      );
    }
  });

  test('the fixed table moves the tracked cwd and returns targets', () => {
    const trackedCwds = new Set(
      CD_SOURCES.flatMap((source) =>
        completedWalk(walkPair(source, workspace, null)).observations.flatMap(
          (observation) => observation.match(/cwd=(\S+)/)?.[1] ?? [],
        ),
      ),
    );
    expect(trackedCwds).toContain(canonical(workspace, 'policy'));
    expect(trackedCwds).toContain(canonical(home));
    expect(trackedCwds).toContain(canonical(root));
    expect(
      completedWalk(
        walkPair(`cd ${join(root, 'link').split(sep).join('/')} && rm -rf x`, workspace, null),
      ).observations.some((observation) =>
        observation.includes(`cwd=${canonical(root, 'policy')}`),
      ),
    ).toBeTrue();
    expect(
      SEGMENT_SOURCES.map(
        (source) => completedWalk(walkPair(source, workspace, MARKER)).result,
      ).filter((result) => result !== null).length,
    ).toBeGreaterThan(5);
  });

  test('a structural-limit read throws, an incomplete one is malformed', () => {
    const observations: Observation[] = [];
    const facts = {
      status: 'structural-limit',
      source: MARKER,
      program: parseCommand(MARKER, 'posix'),
      assignmentFallbacks: [],
    } as const;
    expect(() =>
      findProtectedPathMutationInCommand(
        facts,
        workspace,
        pairedEnvironments({}, home),
        createBudget(),
        observing(observations, null),
      ),
    ).toThrow('Structural command analysis limit exceeded.');
    expect(observations).toStrictEqual([]);

    const unclosed = walkPair(`echo "unclosed ${MARKER}`, workspace, null);
    expect(completedWalk(unclosed).observations[0]).toStartWith('malformed ');
    expect(completedWalk(unclosed).result).toBe(`echo "unclosed ${MARKER}`);
  });
});

describe('tracked shell variable expansion', () => {
  test('a tracked name is substituted, and a form the walk cannot resolve is left as written', () => {
    const rows: readonly {
      readonly text: string;
      readonly variables: readonly (readonly [string, string])[];
      readonly expanded: string;
    }[] = [
      { text: '$A/$B', variables: [['A', '/one']], expanded: '/one/$B' },
      { text: '${A}/${B}', variables: [['A', '/one']], expanded: '/one/${B}' },
      { text: '$A$A$A', variables: [['A', 'x']], expanded: 'xxx' },
      { text: '$AB', variables: [['A', 'x']], expanded: '$AB' },
      { text: '${AB}', variables: [['A', 'x']], expanded: '${AB}' },
      { text: '${A:-fallback}', variables: [['A', '']], expanded: 'fallback' },
      { text: '${A-fallback}', variables: [['A', '']], expanded: '' },
      { text: '${A:-fallback}', variables: [], expanded: '${A:-fallback}' },
      { text: '${A:+set}', variables: [['A', 'value']], expanded: 'set' },
      { text: '${A+set}', variables: [['A', '']], expanded: 'set' },
      {
        text: '${A:-$B}',
        variables: [
          ['A', ''],
          ['B', 'nested'],
        ],
        expanded: 'nested',
      },
      { text: '$1 $@ $? $$', variables: [['1', 'positional']], expanded: '$1 $@ $? $$' },
      { text: '${unclosed', variables: [['unclosed', 'x']], expanded: '${unclosed' },
      { text: 'no variables here', variables: [['A', 'x']], expanded: 'no variables here' },
      { text: '', variables: [['A', 'x']], expanded: '' },
    ];
    for (const row of rows) {
      expect(
        expandTrackedShellVariables(row.text, new Map(row.variables)),
        `${row.text} ${JSON.stringify(row.variables)}`,
      ).toBe(row.expanded);
    }
  });

  test('an unset name is left as written and a set one is substituted', () => {
    expect(expandTrackedShellVariables('$A', new Map())).toBe('$A');
    expect(expandTrackedShellVariables('$A', new Map([['A', 'x']]))).toBe('x');
  });
});

describe('segment and mv operand parsing', () => {
  test('a segment is assignment-only when every word is a name followed by a value', () => {
    const rows: readonly {
      readonly segment: readonly string[];
      readonly assignmentOnly: boolean;
    }[] = [
      { segment: [], assignmentOnly: false },
      { segment: [''], assignmentOnly: false },
      { segment: ['A=1'], assignmentOnly: true },
      { segment: ['A=1', 'B=2'], assignmentOnly: true },
      { segment: ['A='], assignmentOnly: true },
      { segment: ['A=1', 'echo'], assignmentOnly: false },
      { segment: ['echo', 'A=1'], assignmentOnly: false },
      { segment: ['1A=1'], assignmentOnly: false },
      { segment: ['_A=1'], assignmentOnly: true },
      { segment: ['A-B=1'], assignmentOnly: false },
      { segment: ['A=1=2'], assignmentOnly: true },
      { segment: ['A=$B'], assignmentOnly: true },
      { segment: ['A'], assignmentOnly: false },
      { segment: ['=1'], assignmentOnly: false },
    ];
    for (const row of rows) {
      expect(isAssignmentOnlySegment(row.segment), JSON.stringify(row.segment)).toBe(
        row.assignmentOnly,
      );
    }
  });

  test('mv operands are its sources and its destination, wherever the destination is named', () => {
    const rows: readonly {
      readonly args: readonly string[];
      readonly operands: { sources: readonly string[]; destination: string | null };
    }[] = [
      { args: [], operands: { sources: [], destination: null } },
      { args: ['a', 'b'], operands: { sources: ['a'], destination: 'b' } },
      { args: ['a', 'b', 'c'], operands: { sources: ['a', 'b'], destination: 'c' } },
      { args: ['a'], operands: { sources: [], destination: 'a' } },
      { args: ['-t', '/dest', 'a', 'b'], operands: { sources: ['a', 'b'], destination: '/dest' } },
      {
        args: ['--target-directory', '/dest', 'a'],
        operands: { sources: ['a'], destination: '/dest' },
      },
      {
        args: ['--target-directory=/dest', 'a'],
        operands: { sources: ['a'], destination: '/dest' },
      },
      { args: ['-t/dest', 'a'], operands: { sources: ['a'], destination: '/dest' } },
      { args: ['-t'], operands: { sources: [], destination: null } },
      { args: ['-S', '.bak', 'a', 'b'], operands: { sources: ['a'], destination: 'b' } },
      { args: ['--suffix=.bak', 'a', 'b'], operands: { sources: ['a'], destination: 'b' } },
      { args: ['-f', '-v', 'a', 'b'], operands: { sources: ['a'], destination: 'b' } },
      { args: ['--', '-a', '-b'], operands: { sources: ['-a'], destination: '-b' } },
      { args: ['-n', '--', 'a', '-t', 'b'], operands: { sources: ['a', '-t'], destination: 'b' } },
      { args: ['-'], operands: { sources: [], destination: null } },
    ];
    for (const row of rows) {
      expect(extractMvOperandPaths(row.args), JSON.stringify(row.args)).toStrictEqual({
        sources: [...row.operands.sources],
        destination: row.operands.destination,
      });
    }
  });
});

describe('protected candidate canonicalization', () => {
  test('a candidate is resolved against the tracked cwd, with its existing prefix canonicalized', () => {
    const environments = pairedEnvironments(
      { HOME: home, TMPDIR: join(root, 'tmp'), XDG_CONFIG_HOME: join(home, '.config') },
      home,
    );
    const budget = createBudget();
    const normalize = (candidate: string, cwd = workspace) =>
      normalizeProtectedPathCandidate(candidate, cwd, environments, budget);
    expect(normalize('.')).toBe(canonical(workspace));
    expect(normalize('policy')).toBe(canonical(workspace, 'policy'));
    expect(normalize('./policy')).toBe(canonical(workspace, 'policy'));
    expect(normalize(`policy/${MARKER}`, join(root, 'policy'))).toBe(
      canonical(root, 'policy', 'policy', MARKER),
    );
    expect(normalize('~')).toBe(canonical(home));
    expect(normalize('$HOME/.config')).toBe(canonical(home, '.config'));
    expect(normalize('${HOME}/.config')).toBe(canonical(home, '.config'));
    expect(normalize('$TMPDIR/x')).toBe(canonical(root, 'tmp', 'x'));
    expect(normalize(join(root, 'link'))).toBe(canonical(root, 'policy'));
    expect(normalize(join(root, 'dangling-link', 'deeper'))).toBe(
      `${canonical(root)}/dangling-link/deeper`,
    );
    expect(normalize('nested/../policy')).toBe(canonical(workspace, 'policy'));
    expect(normalize('${UNSET_NAME:-policy}')).toBe(
      `${canonical(workspace)}/\${UNSET_NAME:-policy}`,
    );
  });

  test('the file candidate skips the ancestor walk only for implausible basenames', () => {
    const environments = pairedEnvironments({ HOME: home }, home);
    const missing = join(root, 'missing', 'deeper.json');
    expect(
      normalizeProtectedFileCandidate(missing, workspace, environments, createBudget(), () => true),
    ).toBe(canonical(root, 'missing', 'deeper.json'));
    expect(
      normalizeProtectedFileCandidate(
        missing,
        workspace,
        environments,
        createBudget(),
        () => false,
      ),
    ).toBeNull();
    expect(
      normalizeProtectedFileCandidate(
        join(root, 'link'),
        workspace,
        environments,
        createBudget(),
        () => false,
      ),
    ).toBe(canonical(root, 'policy'));
  });
});

test('the walk charges one shared budget', () => {
  const budget = createBudget();
  const environment = pairedEnvironments({ HOME: home }, home);
  const observations: Observation[] = [];
  findProtectedPathMutationInCommand(
    readGuardSyntax('cd policy && cd nested', parseCommand('cd policy && cd nested', 'posix')),
    workspace,
    environment,
    budget,
    observing(observations, null),
  );
  expect(budget.counters.get('realpathAttempts')).toBeGreaterThan(0);
});
