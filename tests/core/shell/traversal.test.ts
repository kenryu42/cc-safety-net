import { describe, expect, test } from 'bun:test';
import { parseCommand } from '@/core/shell/parse';
import { parseSimpleWords, projectSegmentWords } from '@/core/shell/traversal';

const segments = (source: string) => projectSegmentWords(parseCommand(source, 'posix'));

describe('core/shell/traversal', () => {
  test('projects every command segment as its word texts', () => {
    const rows: readonly {
      readonly source: string;
      readonly expected: readonly (readonly string[])[];
    }[] = [
      { source: 'echo "unterminated', expected: [['echo', 'unterminated']] },
      { source: 'echo hi # comment', expected: [['echo', 'hi']] },
      {
        source: 'echo hi # comment\nrm -rf /',
        expected: [
          ['echo', 'hi'],
          ['rm', '-rf', '/'],
        ],
      },
      { source: 'echo $((1+2))', expected: [['echo', '']] },
      { source: 'echo `date`', expected: [['echo', ''], ['date']] },
      { source: 'echo `a`:`b`', expected: [['echo', ':'], ['a'], ['b']] },
      {
        source: 'echo $(rm -rf /tmp/x && echo ok)',
        expected: [
          ['echo', ''],
          ['rm', '-rf', '/tmp/x'],
          ['echo', 'ok'],
        ],
      },
      {
        source: 'echo $( (git reset --hard) )',
        expected: [
          ['echo', ''],
          ['git', 'reset', '--hard'],
        ],
      },
      {
        source: 'echo $(cd /tmp; rm -rf .)',
        expected: [
          ['echo', ''],
          ['cd', '/tmp'],
          ['rm', '-rf', '.'],
        ],
      },
      {
        source: 'echo $(rm -rf /tmp/x',
        expected: [
          ['echo', ''],
          ['rm', '-rf', '/tmp/x'],
        ],
      },
      { source: 'rm -rf ./foo 2>/dev/null', expected: [['rm', '-rf', './foo']] },
      { source: 'rm -rf 7 > /dev/null', expected: [['rm', '-rf', '7']] },
      { source: "echo '2>/dev/null'", expected: [['echo', '2>/dev/null']] },
      { source: 'rm -rf 2>/dev/null /', expected: [['rm', '-rf', '/']] },
      {
        source: 'echo <(git reset --hard)',
        expected: [
          ['echo', ''],
          ['git', 'reset', '--hard'],
        ],
      },
      {
        source: 'echo "x$(printf \'y\')w"',
        expected: [
          ['echo', 'xw'],
          ['printf', 'y'],
        ],
      },
      { source: 'git add *.ts', expected: [['git', 'add', '*.ts']] },
    ];
    for (const row of rows) {
      expect(segments(row.source), row.source).toStrictEqual(row.expected);
    }
  });

  test('reads argv-like text as one plain command, or nothing when the parse cannot pin it down', () => {
    const rows: readonly { readonly source: string; readonly expected: string[] | null }[] = [
      { source: 'log --oneline -n 5', expected: ['log', '--oneline', '-n', '5'] },
      { source: 'commit -m "msg"', expected: ['commit', '-m', 'msg'] },
      { source: 'echo {}', expected: ['echo', '{}'] },
      { source: 'status $(pwd)', expected: null },
      { source: 'echo one; echo two', expected: null },
      { source: 'echo > out', expected: null },
      { source: '', expected: null },
      { source: 'echo "unterminated', expected: null },
      { source: '(echo x)', expected: null },
      { source: 'echo $((1+2))', expected: null },
      { source: 'echo $HOME', expected: ['echo', '$HOME'] },
    ];
    for (const row of rows) {
      expect(parseSimpleWords(row.source), row.source).toStrictEqual(row.expected);
    }
  });
});
