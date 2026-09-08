import { describe, expect, test } from 'bun:test';
import { parseCommand } from '@/core/shell/parse';
import type { ShellSyntaxFacts } from '@/core/shell/projection';
import { projectShellSyntax } from '@/core/shell/projection';

const project = (source: string) => projectShellSyntax(source, parseCommand(source, 'posix'));
const entries = (source: string) => project(source).entries;
const words = (source: string) =>
  entries(source).flatMap((entry) => (entry.kind === 'word' ? [entry.text] : []));

describe('core/shell/projection', () => {
  test('projects redirections with their operator, role and target order', () => {
    expect(
      entries('cat .env < input > output <<< data >| legacy').filter(
        (entry) => entry.kind === 'redirection',
      ),
    ).toStrictEqual([
      {
        kind: 'redirection',
        operator: '<',
        role: 'file-read',
        targetOrder: 'immediate',
        target: 'input',
      },
      {
        kind: 'redirection',
        operator: '>',
        role: 'file-write',
        targetOrder: 'immediate',
        target: 'output',
      },
      {
        kind: 'redirection',
        operator: '<<<',
        role: 'here-data',
        targetOrder: 'legacy-segment',
        target: 'data',
      },
      {
        kind: 'redirection',
        operator: '>|',
        role: 'file-write',
        targetOrder: 'legacy-segment',
        target: 'legacy',
      },
    ]);
    expect(entries('cmd 2>&1')).toStrictEqual([
      { kind: 'word', text: 'cmd' },
      { kind: 'word', text: '2' },
      {
        kind: 'redirection',
        operator: '>&',
        role: 'file-write',
        targetOrder: 'immediate',
        target: '1',
      },
    ]);
    expect(entries('echo a > *.log')).toStrictEqual([
      { kind: 'word', text: 'echo' },
      { kind: 'word', text: 'a' },
      {
        kind: 'redirection',
        operator: '>',
        role: 'file-write',
        targetOrder: 'immediate',
        target: '*.log',
      },
    ]);
    for (const source of ['cat << data', 'cat<<data']) {
      expect(
        entries(source).filter((entry) => entry.kind === 'redirection'),
        source,
      ).toStrictEqual([
        {
          kind: 'redirection',
          operator: '<<',
          role: 'here-data',
          targetOrder: 'legacy-segment',
          target: 'data',
        },
      ]);
    }
  });

  test('projects groups, substitutions and globs as operators around their words', () => {
    expect(
      entries('echo ok <(cat file); echo done').filter((entry) => entry.kind === 'operator'),
    ).toStrictEqual([
      { kind: 'operator', operator: '<(', boundary: false },
      { kind: 'operator', operator: ')', boundary: false },
      { kind: 'operator', operator: ';', boundary: true },
    ]);
    expect(entries('{ rm -rf /project/cache; }')).toStrictEqual([
      { kind: 'operator', operator: '{', boundary: true },
      { kind: 'word', text: 'rm' },
      { kind: 'word', text: '-rf' },
      { kind: 'word', text: '/project/cache' },
      { kind: 'operator', operator: ';', boundary: true },
      { kind: 'operator', operator: '}', boundary: true },
    ]);
    expect(entries('cat $(pwd)/.env')).toStrictEqual([
      { kind: 'word', text: 'cat' },
      { kind: 'word', text: '${}' },
      { kind: 'operator', operator: '(', boundary: false },
      { kind: 'scope', edge: 'enter' },
      { kind: 'word', text: 'pwd' },
      { kind: 'operator', operator: ')', boundary: false },
      { kind: 'scope', edge: 'exit' },
      { kind: 'word', text: '/.env' },
    ]);
    expect(entries('rm *.env')).toStrictEqual([
      { kind: 'word', text: 'rm' },
      { kind: 'operator', operator: 'glob', boundary: false },
    ]);
    expect(entries('$FOO/.env')).toStrictEqual([{ kind: 'word', text: '${FOO}/.env' }]);
  });

  test('a function body is projected only where the function is called', () => {
    expect(entries('cleanup() { rm -rf /project/cache; }')).toStrictEqual([]);
    expect(words('cleanup() { rm -rf /project/cache; }; X=1 cleanup')).toStrictEqual([
      'X=1',
      'cleanup',
      'rm',
      '-rf',
      '/project/cache',
    ]);
    expect(words('cleanup() { rm -rf /project/cache; }; time -p cleanup')).toStrictEqual([
      'time',
      '-p',
      'cleanup',
      'rm',
      '-rf',
      '/project/cache',
    ]);
    expect(project('loop() { loop; }; loop').status).toBe('structural-limit');
  });

  test('brackets a nested shell with scope entries, and nothing else', () => {
    expect(entries('(cd x) && cat y')).toStrictEqual([
      { kind: 'scope', edge: 'enter' },
      { kind: 'operator', operator: '(', boundary: false },
      { kind: 'word', text: 'cd' },
      { kind: 'word', text: 'x' },
      { kind: 'operator', operator: ')', boundary: false },
      { kind: 'scope', edge: 'exit' },
      { kind: 'operator', operator: '&&', boundary: true },
      { kind: 'word', text: 'cat' },
      { kind: 'word', text: 'y' },
    ]);
    expect(entries('cat `cd x`')).toStrictEqual([
      { kind: 'word', text: 'cat' },
      { kind: 'word', text: '${}' },
      { kind: 'scope', edge: 'enter' },
      { kind: 'word', text: 'cd' },
      { kind: 'word', text: 'x' },
      { kind: 'scope', edge: 'exit' },
    ]);
    expect(entries('cat <(cd x)')).toStrictEqual([
      { kind: 'word', text: 'cat' },
      { kind: 'operator', operator: '<(', boundary: false },
      { kind: 'scope', edge: 'enter' },
      { kind: 'word', text: 'cd' },
      { kind: 'word', text: 'x' },
      { kind: 'operator', operator: ')', boundary: false },
      { kind: 'scope', edge: 'exit' },
    ]);
    // A group, a called function body and arithmetic all run in the current shell, so none of
    // them opens a scope.
    for (const source of [
      '{ cd x; } && cat y',
      'f() { cd x; }; f; cat y',
      'echo $((1 + 2))',
      'cd x && cat y',
    ]) {
      expect(
        entries(source).some((entry) => entry.kind === 'scope'),
        source,
      ).toBeFalse();
    }
  });

  test('projects heredoc bodies as segments and reports the assignment fallbacks', () => {
    expect(entries('cat <<EOF\ncat .env\nEOF')).toStrictEqual([
      { kind: 'word', text: 'cat' },
      {
        kind: 'redirection',
        operator: '<<',
        role: 'here-data',
        targetOrder: 'legacy-segment',
        target: 'EOF',
      },
      { kind: 'operator', operator: ';', boundary: true },
      { kind: 'word', text: 'cat' },
      { kind: 'word', text: '.env' },
      { kind: 'operator', operator: ';', boundary: true },
      { kind: 'word', text: 'EOF' },
    ]);
    expect(words("cat <<'EOF'\ncat .env\nEOF")).not.toContain('.env');
    expect(words("cat <<'EOF'\ncat .env")).toContain('.env');
    expect(project('cat "${X:=proof-target}"')).toMatchObject({
      entries: expect.arrayContaining([{ kind: 'word', text: '${X:=proof-target}' }]),
      assignmentFallbacks: ['proof-target'],
    });
    expect(project("cat '${X:=proof-target}'").assignmentFallbacks).toStrictEqual([]);
  });

  test('reports the status a projection could reach', () => {
    const rows: readonly {
      readonly source: string;
      readonly status: ShellSyntaxFacts['status'];
    }[] = [
      { source: 'echo ok', status: 'complete' },
      { source: 'echo $(foo', status: 'complete' },
      { source: 'echo "x', status: 'unclosed-quote' },
      { source: 'echo ${', status: 'invalid' },
      { source: 'fan() { fan; fan; }; fan', status: 'structural-limit' },
    ];
    for (const row of rows) {
      expect(project(row.source).status, row.source).toBe(row.status);
    }
  });
});
