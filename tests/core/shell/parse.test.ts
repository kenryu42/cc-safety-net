import { describe, expect, test } from 'bun:test';
import type { CommandParserLimits, ShellKind } from '@/core/shell/model';
import { DEFAULT_COMMAND_PARSER_LIMITS, parseCommand } from '@/core/shell/parse';
import { projectCommandViews } from '@/core/shell/traversal';
import { differentialSources, SHELL_DIALECTS } from '../../helpers/shell-inputs';

const STATUSES = ['complete', 'partial', 'invalid', 'limited'];

describe('core/shell/parse', () => {
  test('the caps a parse runs under', () => {
    expect(DEFAULT_COMMAND_PARSER_LIMITS).toEqual({
      maxInputLength: 128 * 1024,
      maxWords: 16_384,
      maxDepth: 64,
    });
  });

  test('parses a command into segments, words and nested programs', () => {
    const program = parseCommand('echo "\u{1F600}" && git reset --hard\r\nrm -rf /tmp/x', 'posix');
    expect(program.status).toBe('complete');
    expect(
      projectCommandViews(program).map((view) => view.words.map((word) => word.text)),
    ).toStrictEqual([
      ['echo', '\u{1F600}'],
      ['git', 'reset', '--hard'],
      ['rm', '-rf', '/tmp/x'],
    ]);
    // The parse is a pure function of the source: a second parse is the same program.
    expect(
      parseCommand('echo "\u{1F600}" && git reset --hard\r\nrm -rf /tmp/x', 'posix'),
    ).toStrictEqual(program);
  });

  test('joins quoted and unquoted spans into one word, and pins each word to its span', () => {
    const rows: readonly { readonly source: string; readonly words: readonly string[] }[] = [
      { source: "printf '' a\"\"b 'c'd", words: ['printf', '', 'ab', 'cd'] },
      {
        source: '"C:\\Program Files\\Git\\bin\\git.exe" reset --hard',
        words: ['C:\\Program Files\\Git\\bin\\git.exe', 'reset', '--hard'],
      },
      { source: '$(printf r)m -rf /', words: ['m', '-rf', '/'] },
    ];
    for (const row of rows) {
      const view = projectCommandViews(parseCommand(row.source, 'posix'))[0];
      expect(
        view?.words.map((word) => word.text),
        row.source,
      ).toStrictEqual([...row.words]);
      for (const word of view?.words ?? []) {
        expect(row.source.slice(word.span.start, word.span.end), word.text).toBe(word.raw);
      }
    }
  });

  test('projects the words of a substitution and records where each part came from', () => {
    const view = projectCommandViews(
      parseCommand('git reset --ha$(printf rd) $(printf path)', 'posix'),
    )[0];
    expect(
      view?.words.slice(2).map((word) => word.parts.map((part) => [part.raw, part.provenance])),
    ).toStrictEqual([
      [
        ['--ha', 'literal'],
        ['$(printf rd)', 'command-substitution'],
      ],
      [['$(printf path)', 'command-substitution']],
    ]);
  });

  test('reads a group, a redirection into a substitution and a function definition as their nodes', () => {
    const program = parseCommand('echo x >$(git reset --hard); (rm -rf /tmp/x)', 'posix');
    expect(program.nodes.map((node) => node.kind)).toContain('connector');
    expect(program.nodes.map((node) => node.kind)).toContain('group');
    expect(
      projectCommandViews(program).map((view) => view.words.map((word) => word.text)),
    ).toStrictEqual([
      ['echo', 'x'],
      ['git', 'reset', '--hard'],
      ['rm', '-rf', '/tmp/x'],
    ]);
    const definition = parseCommand('cleanup () { rm -rf build; }', 'posix');
    expect(definition.status).toBe('complete');
    expect(definition.issues).toStrictEqual([]);
    expect(definition.nodes[0]).toMatchObject({
      kind: 'function',
      name: 'cleanup',
      span: { start: 0, end: 'cleanup () { rm -rf build; }'.length },
    });
    const body = definition.nodes[0]?.kind === 'function' ? definition.nodes[0].body : undefined;
    expect(body?.nodes.map((node) => node.kind)).toStrictEqual(['command', 'connector']);
    expect(
      projectCommandViews(body ?? definition).map((view) => view.words.map((word) => word.text)),
    ).toStrictEqual([['rm', '-rf', 'build']]);
    // A definition alone runs nothing, so it projects no command view.
    expect(projectCommandViews(definition)).toStrictEqual([]);
    for (const source of [
      'function cleanup { echo ok; }',
      'function cleanup() { echo ok; }',
      'function cleanup () { echo ok; }',
    ]) {
      const named = parseCommand(source, 'posix');
      expect(
        named.nodes.flatMap((node) => (node.kind === 'function' ? [node.name] : [])),
        source,
      ).toStrictEqual(['cleanup']);
    }
  });

  test('reports what it could not close or read as an issue', () => {
    const unterminated = parseCommand('echo "unterminated', 'posix');
    expect(unterminated.status).toBe('partial');
    expect(unterminated.issues).toStrictEqual([
      {
        code: 'unclosed-double-quote',
        message: 'double-quoted word is not closed',
        span: { start: 5, end: 'echo "unterminated'.length },
      },
    ]);
    const openBody = parseCommand('cleanup() { echo ok', 'posix');
    expect(openBody.status).toBe('partial');
    expect(openBody.issues).toContainEqual({
      code: 'unclosed-function-body',
      message: 'function body is not closed',
      span: { start: 10, end: 19 },
    });
    for (const source of ["printf $'\\UFFFFFFFF'", "printf $'\\U00110000'", "printf $'\\uD800'"]) {
      expect(parseCommand(source, 'posix'), source).toMatchObject({
        status: 'invalid',
        issues: [{ code: 'invalid-ansi-c-code-point' }],
      });
    }
    expect(parseCommand("printf $'\\U0010FFFF'", 'posix').nodes).toMatchObject([
      { kind: 'command', words: [{ text: 'printf' }, { text: String.fromCodePoint(0x10ffff) }] },
    ]);
  });

  test('every source under the caps yields one of the four statuses and never throws', () => {
    for (const source of differentialSources()) {
      for (const dialect of SHELL_DIALECTS) {
        expect(() => parseCommand(source, dialect)).not.toThrow();
        const program = parseCommand(source, dialect);
        expect(STATUSES).toContain(program.status);
        expect(program.span).toStrictEqual({ start: 0, end: source.length });
        if (dialect !== 'auto') expect(program.dialect).toBe(dialect);
      }
    }
  });

  test('a parse with no dialect named is the auto parse, which picks one from the source', () => {
    const rows = [
      ['rm -rf x', 'posix'],
      ['Remove-Item x', 'powershell'],
      // A PowerShell environment variable, which posix would read as a literal.
      ['cat $env:TEMP\\x', 'powershell'],
      // Nothing to go on falls back to posix.
      ['', 'posix'],
    ] as const;
    for (const [source, dialect] of rows) {
      const program = parseCommand(source);
      expect(program.dialect, source).toBe(dialect);
      expect(program.status, source).toBe('complete');
      // Naming `auto` explicitly is the same parse, so the default is the dialect and not a
      // separate path through the parser.
      expect(program).toStrictEqual(parseCommand(source, 'auto'));
    }
  });
});

describe('parser caps yield status limited without throwing', () => {
  const small: CommandParserLimits = { maxInputLength: 40, maxWords: 6, maxDepth: 2 };
  const overCap: readonly { readonly source: string; readonly dialects: readonly ShellKind[] }[] = [
    { source: 'x'.repeat(41), dialects: ['posix', 'powershell'] },
    { source: 'a b c d e f g', dialects: ['posix', 'powershell'] },
    { source: 'echo $($($(deep)))', dialects: ['posix', 'powershell'] },
    { source: '( ( ( echo ) ) )', dialects: ['posix'] },
    { source: 'f() { g() { h() { :; }; }; }', dialects: ['posix'] },
    { source: 'echo "$($($(deep)))"', dialects: ['posix'] },
    { source: 'echo $((1+$((2+$((3))))))', dialects: ['posix'] },
    { source: '{a,b}{c,d}{e,f}', dialects: ['posix'] },
    { source: '{a,b,c,d,e,f,g}', dialects: ['posix'] },
    { source: '{aaaaaaaa,bbbbbbbb}{cccccccc,dddddddd}', dialects: ['posix'] },
    { source: 'echo >$($($(deep)))', dialects: ['posix'] },
    { source: '{ { { echo; }; }; }', dialects: ['posix', 'powershell'] },
    { source: '<# <# <# deep #> #> #>', dialects: ['powershell'] },
    { source: 'Remove-Item "$($($(deep)))"', dialects: ['powershell'] },
    { source: 'Remove-Item > $($($(deep)))', dialects: ['powershell'] },
    { source: `echo ${'y'.repeat(36)}\nRemove-Item -Recurse x`, dialects: ['auto'] },
  ];

  test('with small custom limits, a parse over a cap reports limited', () => {
    for (const row of overCap) {
      for (const dialect of row.dialects) {
        const program = parseCommand(row.source, dialect, small);
        // Refused for being too big, not misread: the parse still covers the whole source and
        // reports the dialect it was asked for.
        expect(program.status, `${dialect} ${row.source}`).toBe('limited');
        expect(program.span).toStrictEqual({ start: 0, end: row.source.length });
        if (dialect !== 'auto') expect(program.dialect).toBe(dialect);
      }
    }
  });

  test('a heredoc body substitution over the depth cap limits only the nested program', () => {
    const source = 'cat <<EOF\n$($($(deep)))\nEOF';
    const program = parseCommand(source, 'posix', small);
    expect(program.status).toBe('complete');
    const command = program.nodes[0];
    expect(command?.kind === 'command' && command.nested[0]?.status).toBe('limited');
  });

  test('with the default caps, a parse over a cap reports limited', () => {
    const sources = [
      `printf ${'y'.repeat(DEFAULT_COMMAND_PARSER_LIMITS.maxInputLength)}`,
      Array.from({ length: DEFAULT_COMMAND_PARSER_LIMITS.maxWords + 1 }, () => 'w').join(' '),
      `${'$('.repeat(DEFAULT_COMMAND_PARSER_LIMITS.maxDepth + 1)}echo${')'.repeat(
        DEFAULT_COMMAND_PARSER_LIMITS.maxDepth + 1,
      )}`,
    ];
    for (const source of sources) {
      for (const dialect of SHELL_DIALECTS) {
        const program = parseCommand(source, dialect);
        expect(program.status, `${dialect} ${source.slice(0, 24)}`).toBe('limited');
      }
    }
  });
});
