import { describe, expect, test } from 'bun:test';
import {
  advanceQuoteScanState,
  extractShortOpts,
  getBasename,
  getShellCommandString,
  hasUnclosedQuotes,
  normalizeCommandToken,
} from '@/core/shell/tokens';

describe('core/shell/tokens', () => {
  test('a command token is its basename without an .exe suffix, normalized to lower case', () => {
    const rows: readonly {
      readonly token: string;
      readonly basename: string;
      readonly normalized: string;
    }[] = [
      { token: '/usr/bin/Git.EXE', basename: 'Git', normalized: 'git' },
      { token: 'C:\\Program Files\\Git\\git.exe', basename: 'git', normalized: 'git' },
      { token: './rm.exe', basename: 'rm', normalized: 'rm' },
      { token: 'x.exe.exe', basename: 'x.exe', normalized: 'x.exe' },
      { token: 'a/b/', basename: '', normalized: '' },
      { token: '', basename: '', normalized: '' },
      { token: 'RM', basename: 'RM', normalized: 'rm' },
      { token: 'git', basename: 'git', normalized: 'git' },
      { token: '/usr/local/bin/python3', basename: 'python3', normalized: 'python3' },
      { token: '..\\tools\\NODE.Exe', basename: 'NODE', normalized: 'node' },
    ];
    for (const row of rows) {
      expect(getBasename(row.token), row.token).toBe(row.basename);
      expect(normalizeCommandToken(row.token), row.token).toBe(row.normalized);
    }
  });

  test('short options are the letters of a single-dash token, up to `--` or a value option', () => {
    const withValue = { shortOptsWithValue: new Set(['-c', '-C']) };
    const rows: readonly {
      readonly argv: readonly string[];
      readonly options?: typeof withValue;
      readonly expected: readonly string[];
    }[] = [
      { argv: ['git', 'add', '--', '-Ap'], expected: [] },
      { argv: ['rm', '-r', '--', '-f'], expected: ['-r'] },
      { argv: ['git', '-v', 'add', '-n', '--', '-x'], expected: ['-v', '-n'] },
      { argv: ['rm', '-rf', 'x'], expected: ['-r', '-f'] },
      { argv: ['rm', '--recursive'], expected: [] },
      { argv: ['rm', '-'], expected: [] },
      { argv: ['rm', '-r1f'], expected: ['-r'] },
      { argv: ['git', 'switch', '-cfeature'], options: withValue, expected: ['-c'] },
      { argv: ['git', 'switch', '-qcfeature'], options: withValue, expected: ['-q', '-c'] },
      { argv: ['git', 'branch', '-Cfixup'], options: withValue, expected: ['-C'] },
      { argv: [], expected: [] },
    ];
    for (const row of rows) {
      expect([...extractShortOpts(row.argv, row.options)], row.argv.join(' ')).toStrictEqual([
        ...row.expected,
      ]);
    }
  });

  test('a shell argv selects a command string only before a script positional', () => {
    const rows: readonly {
      readonly shell: string;
      readonly args: readonly string[];
      readonly command: string | null;
    }[] = [
      { shell: 'bash', args: ['-c', 'echo ok'], command: 'echo ok' },
      { shell: 'bash', args: ['-lc', 'echo ok'], command: 'echo ok' },
      { shell: 'bash', args: ['--', '-c', 'echo ok'], command: null },
      { shell: 'bash', args: ['script.sh', '-c', 'echo ok'], command: null },
      { shell: 'bash', args: ['-c'], command: null },
      { shell: 'bash', args: ['--rcfile=profile', '-c', 'echo ok'], command: 'echo ok' },
      { shell: 'bash', args: ['--rcfile', 'profile', '-c', 'echo ok'], command: 'echo ok' },
      { shell: 'bash', args: ['--rcfile'], command: null },
      // `-O` takes the next argument, so it swallows the `-c`.
      { shell: 'bash', args: ['-O', '-c', 'echo ok'], command: null },
      { shell: 'bash', args: ['-O', 'extglob', '-lc', 'echo ok'], command: 'echo ok' },
      { shell: 'ksh', args: ['-o', 'errexit', '-c', 'echo ok'], command: 'echo ok' },
      { shell: 'ksh', args: ['-oc', 'echo ok'], command: 'echo ok' },
      { shell: 'ksh', args: ['-o-c', 'echo ok'], command: 'echo ok' },
      { shell: 'sh', args: ['+e', '-c', 'echo ok'], command: 'echo ok' },
      { shell: 'fish', args: ['-c', 'echo ok'], command: 'echo ok' },
    ];
    for (const row of rows) {
      expect(getShellCommandString(row.shell, row.args), `${row.shell} ${row.args.join(' ')}`).toBe(
        row.command,
      );
    }
  });

  test('the quote scan consumes a quote only where it opens or closes one', () => {
    const rows: readonly {
      readonly char: string;
      readonly state: { inSingle: boolean; inDouble: boolean; escaped: boolean };
      readonly consumed: boolean;
      readonly after: { inSingle: boolean; inDouble: boolean; escaped: boolean };
    }[] = [
      {
        char: '\\',
        state: { inSingle: false, inDouble: false, escaped: false },
        consumed: true,
        after: { inSingle: false, inDouble: false, escaped: true },
      },
      {
        char: 'a',
        state: { inSingle: false, inDouble: false, escaped: true },
        consumed: true,
        after: { inSingle: false, inDouble: false, escaped: false },
      },
      {
        char: "'",
        state: { inSingle: false, inDouble: true, escaped: false },
        consumed: false,
        after: { inSingle: false, inDouble: true, escaped: false },
      },
      {
        char: '"',
        state: { inSingle: true, inDouble: false, escaped: false },
        consumed: false,
        after: { inSingle: true, inDouble: false, escaped: false },
      },
      {
        char: 'a',
        state: { inSingle: false, inDouble: false, escaped: false },
        consumed: false,
        after: { inSingle: false, inDouble: false, escaped: false },
      },
      {
        char: "'",
        state: { inSingle: false, inDouble: false, escaped: false },
        consumed: true,
        after: { inSingle: true, inDouble: false, escaped: false },
      },
    ];
    for (const row of rows) {
      const state = { ...row.state };
      expect(advanceQuoteScanState(row.char, state), row.char).toBe(row.consumed);
      expect(state, row.char).toStrictEqual(row.after);
    }
  });

  test('unclosed quotes are reported over the text a shell would read, comments aside', () => {
    const rows: readonly { readonly command: string; readonly unclosed: boolean }[] = [
      { command: "echo ok # 'ignored\necho done", unclosed: false },
      { command: "echo '# literal' \"unterminated", unclosed: true },
      { command: 'echo "it\'s fine"', unclosed: false },
      { command: "echo 'unterminated", unclosed: true },
      { command: 'echo "closed"', unclosed: false },
      { command: "echo \\'", unclosed: false },
      { command: '', unclosed: false },
    ];
    for (const row of rows) {
      expect(hasUnclosedQuotes(row.command), row.command).toBe(row.unclosed);
    }
  });
});
