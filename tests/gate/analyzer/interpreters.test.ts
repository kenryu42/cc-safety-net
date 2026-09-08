import { describe, expect, test } from 'bun:test';
import { isInterpreterCommand } from '@/core/policy/transparent-wrappers';
import type { InterpreterArgvMetadata } from '@/gate/analyzer/interpreters';
import {
  containsDangerousCode,
  extractInterpreterCodeArg,
  extractInterpreterExecutableSources,
  getInterpreterExecutableSourceSelectors,
  isInterpreterDisplayOnly,
  parseInterpreterArgv,
  REASON_INTERPRETER_BLOCKED,
  REASON_INTERPRETER_DANGEROUS,
} from '@/gate/analyzer/interpreters';

/**
 * The interpreter argv scanner walks each `-c`/`-e` form the four interpreters accept, and the
 * code detector judges the body it recovers — including the encoded payloads a one-liner hides a
 * command in.
 */

describe('interpreter denial reasons', () => {
  test('the two reasons are the strings the denials render', () => {
    expect(REASON_INTERPRETER_DANGEROUS).toBe(
      'Interpreter code contains a dangerous command. Run the underlying command directly so it can be analyzed, or use the safer alternative for that command.',
    );
    expect(REASON_INTERPRETER_BLOCKED).toBe(
      'Interpreter one-liners are blocked by the active safety policy. Write the code to a script file and run it, or run the equivalent shell command directly.',
    );
  });
});

describe('interpreter argv scanning', () => {
  test('the inline code operand is found in every attached and separate spelling', () => {
    const rows: readonly { readonly argv: readonly string[]; readonly code: string | null }[] = [
      { argv: ['python3', '-c', 'print(1)'], code: 'print(1)' },
      { argv: ['python3', '-cimport os'], code: 'import os' },
      { argv: ['python3', '-uc', 'print(1)'], code: 'print(1)' },
      { argv: ['python3', '-u', '-c', 'print(1)'], code: 'print(1)' },
      { argv: ['python3', '-X', 'dev', '-c', 'print(1)'], code: 'print(1)' },
      { argv: ['python3.12', '-c', 'print(1)'], code: 'print(1)' },
      { argv: ['/usr/bin/python3', '-c', 'print(1)'], code: 'print(1)' },
      { argv: ['node', '--eval', 'console.log(1)'], code: 'console.log(1)' },
      { argv: ['node', '--eval=console.log(1)'], code: 'console.log(1)' },
      { argv: ['node', '-e', 'a', '-e', 'b'], code: 'b' },
      { argv: ['node', '-p', '-e', 'console.log(1)'], code: 'console.log(1)' },
      { argv: ['ruby', '-esystem("id")'], code: 'system("id")' },
      { argv: ['perl', '-E', 'say 1'], code: 'say 1' },
      { argv: ['perl', '-ne', 'print'], code: 'print' },
      { argv: ['perl', '-i.bak', '-pe', 's/a/b/'], code: 's/a/b/' },
      { argv: ['python3', 'script.py', '-c', 'print(1)'], code: null },
      { argv: ['python3', '-m', 'http.server'], code: null },
      { argv: ['python3', '-c'], code: null },
      { argv: ['node', 'main.js'], code: null },
      { argv: ['rm', '-rf', '/tmp/x'], code: null },
      { argv: [], code: null },
    ];
    for (const row of rows) {
      expect(extractInterpreterCodeArg(row.argv), row.argv.join(' ')).toBe(row.code);
    }
  });

  test('the argv scan reports the code, the loaded sources and whether options are open', () => {
    const rows: readonly {
      readonly argv: readonly string[];
      readonly parsed: InterpreterArgvMetadata;
    }[] = [
      {
        argv: ['python3', '-c', 'print(1)'],
        parsed: {
          code: 'print(1)',
          sources: [{ tokenIndex: 2, kind: 'inline-code', value: 'print(1)' }],
          optionsOpen: false,
        },
      },
      {
        argv: ['python3', 'script.py'],
        parsed: {
          code: null,
          sources: [{ tokenIndex: 1, kind: 'main-script', value: 'script.py' }],
          optionsOpen: false,
        },
      },
      {
        argv: ['python3', '-m', 'http.server'],
        parsed: {
          code: null,
          sources: [{ tokenIndex: 2, kind: 'module-file', value: 'http.server' }],
          optionsOpen: false,
        },
      },
      {
        argv: ['python3', '-mhttp.server'],
        parsed: {
          code: null,
          sources: [{ tokenIndex: 1, kind: 'module-file', value: 'http.server' }],
          optionsOpen: false,
        },
      },
      { argv: ['python3'], parsed: { code: null, sources: [], optionsOpen: true } },
      {
        argv: ['python3', '--', 'script.py'],
        parsed: {
          code: null,
          sources: [{ tokenIndex: 2, kind: 'main-script', value: 'script.py' }],
          optionsOpen: false,
        },
      },
      {
        argv: ['node', '-r', 'preload.js', '-e', 'x'],
        parsed: {
          code: 'x',
          sources: [
            { tokenIndex: 2, kind: 'module-file', value: 'preload.js' },
            { tokenIndex: 4, kind: 'inline-code', value: 'x' },
          ],
          // Unlike python's `-c`, an `-e` operand does not end the option list, so an argv that
          // stops there leaves it open.
          optionsOpen: true,
        },
      },
      {
        argv: ['node', '--import', 'loader.mjs', 'main.mjs'],
        parsed: {
          code: null,
          sources: [
            { tokenIndex: 2, kind: 'module-file', value: 'loader.mjs' },
            { tokenIndex: 3, kind: 'main-script', value: 'main.mjs' },
          ],
          optionsOpen: false,
        },
      },
      {
        // An option that needs a value it never gets invalidates the scan.
        argv: ['node', '-r'],
        parsed: { code: null, sources: [], optionsOpen: false },
      },
      {
        argv: ['ruby', '-rjson', '-e', 'puts 1'],
        parsed: {
          code: 'puts 1',
          sources: [
            { tokenIndex: 1, kind: 'module-file', value: 'json' },
            { tokenIndex: 3, kind: 'inline-code', value: 'puts 1' },
          ],
          optionsOpen: true,
        },
      },
      {
        argv: ['perl', '-MData::Dumper', '-e', 'print 1'],
        parsed: {
          code: 'print 1',
          sources: [
            { tokenIndex: 1, kind: 'module-file', value: 'Data::Dumper' },
            { tokenIndex: 3, kind: 'inline-code', value: 'print 1' },
          ],
          optionsOpen: true,
        },
      },
      { argv: ['rm', '-rf', '/tmp/x'], parsed: { code: null, sources: [], optionsOpen: false } },
      { argv: [''], parsed: { code: null, sources: [], optionsOpen: false } },
      { argv: [], parsed: { code: null, sources: [], optionsOpen: false } },
    ];
    for (const row of rows) {
      const parsed = parseInterpreterArgv(row.argv);
      expect(parsed, row.argv.join(' ')).toStrictEqual(row.parsed);
      expect(extractInterpreterExecutableSources(row.argv), row.argv.join(' ')).toStrictEqual(
        row.parsed.sources,
      );
    }
  });

  test('only the four interpreters carry executable-source selectors', () => {
    const rows: readonly {
      readonly command: string;
      readonly selectors: number;
      readonly isInterpreter: boolean;
    }[] = [
      { command: 'python', selectors: 2, isInterpreter: true },
      { command: 'python3.11', selectors: 2, isInterpreter: true },
      { command: '/usr/local/bin/python3', selectors: 2, isInterpreter: true },
      { command: 'node', selectors: 9, isInterpreter: true },
      { command: '/usr/bin/node', selectors: 9, isInterpreter: true },
      { command: 'ruby', selectors: 2, isInterpreter: true },
      { command: 'perl', selectors: 4, isInterpreter: true },
      // A name that only resembles an interpreter is not one.
      { command: 'nodejs', selectors: 0, isInterpreter: false },
      { command: 'pypy3', selectors: 0, isInterpreter: false },
      { command: 'perl5', selectors: 0, isInterpreter: false },
      { command: 'awk', selectors: 0, isInterpreter: false },
      { command: 'bash', selectors: 0, isInterpreter: false },
      { command: 'rm', selectors: 0, isInterpreter: false },
      { command: '', selectors: 0, isInterpreter: false },
    ];
    for (const row of rows) {
      expect(getInterpreterExecutableSourceSelectors(row.command).length, row.command).toBe(
        row.selectors,
      );
      expect(isInterpreterCommand(row.command), row.command).toBe(row.isInterpreter);
    }
  });

  test('a node one-liner that only prints a literal is display-only', () => {
    const rows: readonly {
      readonly command: string;
      readonly code: string;
      readonly display: boolean;
    }[] = [
      { command: 'node', code: 'console.log("hello")', display: true },
      { command: 'node', code: "console.info('hi');", display: true },
      { command: 'node', code: 'console.error("bye")', display: true },
      { command: '/usr/bin/node', code: 'console.warn("careful")', display: true },
      { command: 'node', code: 'console.log(variable)', display: false },
      { command: 'node', code: 'console.log("a", "b")', display: false },
      { command: 'node', code: 'console.log("hi"); rm()', display: false },
      { command: 'node', code: '', display: false },
      // The form is node's; another interpreter running the same text is not display-only.
      { command: 'nodejs', code: 'console.log("hello")', display: false },
      { command: 'python3', code: 'console.log("hello")', display: false },
    ];
    for (const row of rows) {
      expect(isInterpreterDisplayOnly(row.command, row.code), `${row.command} ${row.code}`).toBe(
        row.display,
      );
    }
  });
});

describe('dangerous interpreter code', () => {
  test('a dangerous command counts when the code can hand it to a shell', () => {
    const rows: readonly { readonly code: string; readonly dangerous: boolean }[] = [
      { code: '', dangerous: false },
      { code: 'print(1)', dangerous: false },
      { code: 'console.log("hello")', dangerous: false },
      // A match confined to a string literal is inert data without an exec sink.
      { code: 'print("rm -rf /tmp/x")', dangerous: false },
      { code: 'x = "rm -rf /tmp/x"', dangerous: false },
      { code: 'x = "rm -rf /tmp/x"; print(x)', dangerous: false },
      { code: 'os.system("rm -rf /tmp/x")', dangerous: true },
      { code: 'x = "rm -rf /tmp/x"; os.system(x)', dangerous: true },
      { code: 'subprocess.run("rm -rf /tmp/x", shell=True)', dangerous: true },
      { code: 'require("child_process").execSync("rm -rf /tmp/x")', dangerous: true },
      { code: 'puts `rm -rf /tmp/x`', dangerous: true },
      { code: 'puts %x{rm -rf /tmp/x}', dangerous: true },
      // An unterminated literal keeps its tail, so the conservative scan still sees it.
      { code: 'x = "unterminated rm -rf /tmp/x', dangerous: true },
      // A comment is not a string literal.
      { code: 'x = 1 # rm -rf /tmp/x', dangerous: true },
      { code: 'os.system("rm \\\n-rf /tmp/x")', dangerous: true },
      { code: 'os.system("git reset --hard")', dangerous: true },
      { code: 'os.system("git checkout -- .")', dangerous: true },
      { code: 'os.system("find . -delete")', dangerous: true },
      { code: 'os.system("dd if=/dev/zero of=/dev/sda")', dangerous: true },
      { code: 'os.system("shred secret")', dangerous: true },
      { code: 'os.system("git restore --staged .")', dangerous: false },
      { code: 'os.system("rm -r\\n-f /tmp/x")', dangerous: false },
    ];
    for (const row of rows) {
      expect(containsDangerousCode(row.code), row.code).toBe(row.dangerous);
    }
  });

  test('the detector charges its scan and answers the same without a counter', () => {
    const code = 'os.system("rm -rf /tmp/x")';
    const work = { units: 0 };
    expect(containsDangerousCode(code, work)).toBeTrue();
    expect(work.units).toBeGreaterThanOrEqual(code.length);
    expect(containsDangerousCode(code)).toBeTrue();
  });
});
