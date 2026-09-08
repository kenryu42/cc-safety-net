import { describe, expect, test } from 'bun:test';
import {
  extractDashCArg,
  extractShellStartupLoaderMetadata,
  isShellSyntaxCheck,
  parseShellArgv,
  type ShellStartupLoaderMetadata,
} from '@/gate/analyzer/shell-wrappers';

/**
 * The wrapper argv reader decides which operand of `bash -c …` is a command and which startup
 * file a shell would source, so each row states the argv and the answer it earns.
 */

const label = (tokens: readonly string[]) => tokens.join(' ') || '(empty)';

describe('gate/analyzer/shell-wrappers', () => {
  test('the -c operand is the command string, wherever the option sits', () => {
    const rows: readonly { readonly tokens: readonly string[]; readonly arg: string | null }[] = [
      { tokens: [], arg: null },
      { tokens: ['bash'], arg: null },
      { tokens: ['bash', '-c', 'echo ok'], arg: 'echo ok' },
      { tokens: ['bash', '-c', '--', 'echo ok'], arg: 'echo ok' },
      { tokens: ['bash', '-lc', 'echo ok'], arg: 'echo ok' },
      { tokens: ['bash', '-lc', '--', 'echo ok'], arg: 'echo ok' },
      { tokens: ['sh', '-xc', 'rm -rf /'], arg: 'rm -rf /' },
      { tokens: ['bash', '-c'], arg: null },
      { tokens: ['bash', '-lc'], arg: null },
      // The scan runs past `--` for compatibility with the historical wrapper peel.
      { tokens: ['bash', '--', '-c', 'echo'], arg: 'echo' },
      { tokens: ['bash', '--rcfile', 'script'], arg: null },
      // A clustered option refuses a dash-led operand; a standalone `-c` accepts one.
      { tokens: ['bash', '-lc', '-x'], arg: null },
      { tokens: ['bash', '-c', '-x', 'echo hi'], arg: '-x' },
      { tokens: ['bash', '-l', '-c', 'echo ok'], arg: 'echo ok' },
      { tokens: ['bash', 'script.sh', '-c', 'not-a-command'], arg: 'not-a-command' },
      { tokens: ['ksh', '-o-c', 'echo hi'], arg: 'echo hi' },
    ];
    for (const row of rows) expect(extractDashCArg(row.tokens), label(row.tokens)).toBe(row.arg);
  });

  test('a no-exec flag marks a syntax check until a later `+n` clears it', () => {
    const rows: readonly { readonly tokens: readonly string[]; readonly check: boolean }[] = [
      { tokens: ['bash', '-n', '-c', 'rm -rf /'], check: true },
      { tokens: ['bash', '-nc', 'rm -rf /'], check: true },
      { tokens: ['bash', '-n', 'script.sh'], check: true },
      { tokens: ['bash', '-c', 'rm -rf /', '-n'], check: false },
      { tokens: ['bash', '-n', '+n', '-c', 'rm -rf /'], check: false },
      { tokens: ['bash', '-n', '--', '-c', 'x'], check: true },
      // A long option ends the short-option scan.
      { tokens: ['bash', '--norc', '-n', '-c', 'x'], check: false },
      // zsh and ksh go through the argv parser, where `-onotify` is an option name, not flags.
      { tokens: ['zsh', '-onotify', '-c', 'echo hi'], check: false },
      { tokens: ['zsh', '-n', '-c', 'echo hi'], check: true },
      { tokens: ['ksh', '-onotify', '-c', 'echo hi'], check: false },
      { tokens: ['ksh', '-n', '-c', 'x'], check: true },
      { tokens: [], check: false },
      { tokens: ['bash'], check: false },
    ];
    for (const row of rows)
      expect(isShellSyntaxCheck(row.tokens), label(row.tokens)).toBe(row.check);
  });

  test('startup loading is reported per shell and per interactive mode', () => {
    const rows: readonly {
      readonly tokens: readonly string[];
      readonly metadata: ShellStartupLoaderMetadata;
    }[] = [
      {
        tokens: ['bash', '--rcfile', 'profile', '-i'],
        metadata: {
          argvSource: { kind: 'literal', value: 'profile' },
          argvSourceApplies: true,
          envName: 'BASH_ENV',
          envSourceApplies: false,
        },
      },
      {
        tokens: ['bash', '--rcfile'],
        metadata: {
          argvSource: { kind: 'absent' },
          argvSourceApplies: false,
          envName: 'BASH_ENV',
          envSourceApplies: false,
        },
      },
      {
        tokens: ['sh', '-i'],
        metadata: {
          argvSource: null,
          argvSourceApplies: false,
          envName: 'ENV',
          envSourceApplies: true,
        },
      },
      {
        tokens: ['bash', '-c', 'echo hi'],
        metadata: {
          argvSource: null,
          argvSourceApplies: false,
          envName: 'BASH_ENV',
          envSourceApplies: true,
        },
      },
      {
        tokens: ['bash', '-i', '-c', 'echo hi'],
        metadata: {
          argvSource: null,
          argvSourceApplies: false,
          envName: 'BASH_ENV',
          envSourceApplies: false,
        },
      },
      {
        // The last startup option wins.
        tokens: ['bash', '--init-file', 'first.sh', '--rcfile', 'second.sh', '-i', '-c', 'echo hi'],
        metadata: {
          argvSource: { kind: 'literal', value: 'second.sh' },
          argvSourceApplies: true,
          envName: 'BASH_ENV',
          envSourceApplies: false,
        },
      },
      {
        // Only the two-token spelling is recorded; `--rcfile=…` is skipped as an ordinary option.
        tokens: ['bash', '--rcfile=inline.sh', '-i', '-c', 'echo hi'],
        metadata: {
          argvSource: null,
          argvSourceApplies: false,
          envName: 'BASH_ENV',
          envSourceApplies: false,
        },
      },
      {
        // A short option closes bash's long options, so a later `--rcfile` is not a startup file.
        tokens: ['bash', '-i', '--rcfile', 'evil.sh', '-c', 'echo hi'],
        metadata: {
          argvSource: null,
          argvSourceApplies: false,
          envName: 'BASH_ENV',
          envSourceApplies: false,
        },
      },
      {
        tokens: ['dash', '-c', 'echo hi'],
        metadata: {
          argvSource: null,
          argvSourceApplies: false,
          envName: 'ENV',
          envSourceApplies: false,
        },
      },
      {
        tokens: ['ksh', '-i'],
        metadata: {
          argvSource: null,
          argvSourceApplies: false,
          envName: 'ENV',
          envSourceApplies: true,
        },
      },
      {
        tokens: ['zsh', '-i'],
        metadata: {
          argvSource: null,
          argvSourceApplies: false,
          envName: null,
          envSourceApplies: false,
        },
      },
      {
        tokens: ['busybox', 'sh', '-c', 'echo hi'],
        metadata: {
          argvSource: null,
          argvSourceApplies: false,
          envName: null,
          envSourceApplies: false,
        },
      },
      {
        // contract: src/gate/analyzer/shell-wrappers.ts:140 — a `+i` scan reports no interactive
        // option, and the outer flag is only written when one is reported, so it stays set.
        tokens: ['sh', '-i', '+i'],
        metadata: {
          argvSource: null,
          argvSourceApplies: false,
          envName: 'ENV',
          envSourceApplies: true,
        },
      },
      {
        tokens: [],
        metadata: {
          argvSource: null,
          argvSourceApplies: false,
          envName: null,
          envSourceApplies: false,
        },
      },
    ];
    for (const row of rows)
      expect(extractShellStartupLoaderMetadata(row.tokens), label(row.tokens)).toStrictEqual(
        row.metadata,
      );
  });

  test('the argv split names the command, the script and stdin mode', () => {
    const rows: readonly {
      readonly tokens: readonly string[];
      readonly parsed: ReturnType<typeof parseShellArgv>;
    }[] = [
      {
        tokens: ['bash', '-c', 'rm -rf /tmp/x'],
        parsed: {
          command: 'rm -rf /tmp/x',
          commandIndex: 2,
          scriptIndex: null,
          readsStdinAsCommands: false,
          syntaxCheck: false,
        },
      },
      {
        tokens: ['bash', '-c', '--', 'rm -rf /tmp/x'],
        parsed: {
          command: 'rm -rf /tmp/x',
          commandIndex: 3,
          scriptIndex: null,
          readsStdinAsCommands: false,
          syntaxCheck: false,
        },
      },
      {
        tokens: ['bash', '-lc', 'rm -rf /tmp/x'],
        parsed: {
          command: 'rm -rf /tmp/x',
          commandIndex: 2,
          scriptIndex: null,
          readsStdinAsCommands: false,
          syntaxCheck: false,
        },
      },
      {
        // `--` before `-c` makes the next operand a script, not a command.
        tokens: ['bash', '--', '-c', 'rm -rf /tmp/x'],
        parsed: {
          command: null,
          commandIndex: null,
          scriptIndex: 2,
          readsStdinAsCommands: false,
          syntaxCheck: false,
        },
      },
      {
        tokens: ['bash', '-nc', 'rm -rf /'],
        parsed: {
          command: 'rm -rf /',
          commandIndex: 2,
          scriptIndex: null,
          readsStdinAsCommands: false,
          syntaxCheck: true,
        },
      },
      {
        tokens: ['bash', '-s', 'arg'],
        parsed: {
          command: null,
          commandIndex: null,
          scriptIndex: null,
          readsStdinAsCommands: true,
          syntaxCheck: false,
        },
      },
      {
        tokens: ['bash', '-', 'arg'],
        parsed: {
          command: null,
          commandIndex: null,
          scriptIndex: null,
          readsStdinAsCommands: true,
          syntaxCheck: false,
        },
      },
      {
        tokens: ['bash', 'script.sh', '-c', 'x'],
        parsed: {
          command: null,
          commandIndex: null,
          scriptIndex: 1,
          readsStdinAsCommands: false,
          syntaxCheck: false,
        },
      },
      {
        tokens: ['bash'],
        parsed: {
          command: null,
          commandIndex: null,
          scriptIndex: null,
          readsStdinAsCommands: true,
          syntaxCheck: false,
        },
      },
      {
        tokens: ['bash', '-c'],
        parsed: {
          command: null,
          commandIndex: null,
          scriptIndex: null,
          readsStdinAsCommands: false,
          syntaxCheck: false,
        },
      },
      {
        tokens: [],
        parsed: {
          command: null,
          commandIndex: null,
          scriptIndex: null,
          readsStdinAsCommands: true,
          syntaxCheck: false,
        },
      },
      {
        // `--rcfile` consumes its value for bash; `--rcfile=…` does not.
        tokens: ['bash', '--rcfile', 'evil.sh', '-c', 'x'],
        parsed: {
          command: 'x',
          commandIndex: 4,
          scriptIndex: null,
          readsStdinAsCommands: false,
          syntaxCheck: false,
        },
      },
      {
        tokens: ['bash', '--rcfile=inline.sh', '-c', 'x'],
        parsed: {
          command: 'x',
          commandIndex: 3,
          scriptIndex: null,
          readsStdinAsCommands: false,
          syntaxCheck: false,
        },
      },
      {
        // ksh `-o` takes an option name, attached or separate.
        tokens: ['ksh', '-o', 'notify', '-c', 'echo hi'],
        parsed: {
          command: 'echo hi',
          commandIndex: 4,
          scriptIndex: null,
          readsStdinAsCommands: false,
          syntaxCheck: false,
        },
      },
      {
        tokens: ['ksh', '-o-c', 'echo hi'],
        parsed: {
          command: 'echo hi',
          commandIndex: 2,
          scriptIndex: null,
          readsStdinAsCommands: false,
          syntaxCheck: false,
        },
      },
      {
        tokens: ['busybox', 'sh', '-c', 'echo hi'],
        parsed: {
          command: null,
          commandIndex: null,
          scriptIndex: 1,
          readsStdinAsCommands: false,
          syntaxCheck: false,
        },
      },
    ];
    for (const row of rows)
      expect(parseShellArgv(row.tokens), label(row.tokens)).toStrictEqual(row.parsed);
  });
});
