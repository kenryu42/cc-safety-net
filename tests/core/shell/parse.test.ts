import { describe, expect, test } from 'bun:test';
import type { CommandParserLimits, ShellKind } from '@/core/shell/model';
import { DEFAULT_COMMAND_PARSER_LIMITS, parseCommand } from '@/core/shell/parse';
import { projectCommandViews } from '@/core/shell/traversal';
import { differentialSources, SHELL_DIALECTS } from '../../helpers/shell-inputs';

const STATUSES = ['complete', 'partial', 'invalid', 'limited'];

describe('core/shell/parse', () => {
  test.each([
    ['E\\$OF', 'E$OF'],
    ['E\\q', 'E\\q'],
  ])('decodes a quoted heredoc delimiter %s without expanding its body', (quoted, delimiter) => {
    const program = parseCommand(`cat <<"${quoted}"\n$value\n${delimiter}`, 'posix');
    expect(program.status).toBe('complete');
    expect(projectCommandViews(program)[0]?.redirections[0]?.heredoc).toMatchObject({
      delimiter,
      quotedDelimiter: true,
      body: '$value\n',
    });
  });

  test('a dangling escape in a heredoc delimiter is rejected as ambiguous', () => {
    const program = parseCommand('cat <<EOF\\', 'posix');
    expect(program.status).toBe('invalid');
    expect(program.issues.map((issue) => issue.code)).toContain('ambiguous-heredoc-delimiter');
  });

  test('refuses a quoted CRLF continuation, because bash keeps the backslash and the CR', () => {
    const program = parseCommand('printf "first\\\r\nsecond"', 'posix');
    expect(program.status).toBe('invalid');
    expect(program.issues.map((issue) => issue.code)).toContain('unsupported-blank');
  });

  test.each(['echo; f() { :; }', 'echo > output'])(
    'counts function names and redirect targets toward the word limit: %s',
    (source) => {
      const program = parseCommand(source, 'posix', {
        ...DEFAULT_COMMAND_PARSER_LIMITS,
        maxWords: 1,
      });
      expect(program.status).toBe('limited');
      expect(program.issues.map((issue) => issue.code)).toContain('word-limit');
    },
  );

  test('the caps a parse runs under', () => {
    expect(DEFAULT_COMMAND_PARSER_LIMITS).toEqual({
      maxInputLength: 128 * 1024,
      maxWords: 16_384,
      maxDepth: 64,
    });
  });

  test('parses a command into segments, words and nested programs', () => {
    const program = parseCommand('echo "\u{1F600}" && git reset --hard\nrm -rf /tmp/x', 'posix');
    expect(program.status).toBe('complete');
    expect(
      projectCommandViews(program).map((view) => view.words.map((word) => word.text)),
    ).toStrictEqual([
      ['echo', '\u{1F600}'],
      ['git', 'reset', '--hard'],
      ['rm', '-rf', '/tmp/x'],
    ]);
    expect(
      parseCommand('echo "\u{1F600}" && git reset --hard\nrm -rf /tmp/x', 'posix'),
    ).toStrictEqual(program);
  });

  test('joins quoted and unquoted spans into one word, and pins each word to its span', () => {
    const rows: readonly {
      readonly source: string;
      readonly words: readonly string[];
      readonly firstProvenance?: 'command-substitution';
    }[] = [
      { source: "printf '' a\"\"b 'c'd", words: ['printf', '', 'ab', 'cd'] },
      {
        source: '"C:\\Program Files\\Git\\bin\\git.exe" reset --hard',
        words: ['C:\\Program Files\\Git\\bin\\git.exe', 'reset', '--hard'],
      },
      {
        source: '$(printf r)m -rf /',
        words: ['m', '-rf', '/'],
        firstProvenance: 'command-substitution',
      },
    ];
    for (const row of rows) {
      const view = projectCommandViews(parseCommand(row.source, 'posix'))[0];
      expect(
        view?.words.map((word) => word.text),
        row.source,
      ).toStrictEqual([...row.words]);
      if (row.firstProvenance) expect(view?.words[0]?.provenance).toBe(row.firstProvenance);
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

  test.each([
    'echo ${ rm -rf x; }',
    'echo ${|REPLY=x; }',
    'echo "${ rm -rf x; }"',
    'echo $(echo ${ rm -rf x; })',
    'echo $(( ${ rm -rf x; echo 0; } ))',
    'echo "$(( ${ rm -rf x; echo 0; } ))"',
    '(( ${ rm -rf x; echo 0; } ))',
    ': <<EOF\n# ${ rm -rf x; }\nEOF',
    ': <<EOF\n# $(( ${ rm -rf x; echo 0; } ))\nEOF',
    ': <<EOF\n$(echo ${ rm -rf x; })\nEOF',
    'echo ${\\\n rm -rf x; }',
    'echo $\\\n{ rm -rf x; }',
    `: <<EOF\n${'$(( '.repeat(64)}\${ rm -rf x; echo 0; }${' ))'.repeat(64)}\nEOF`,
    `: <<EOF\n${'$(( '.repeat(64)}0${' ))'.repeat(64)}\n\${ rm -rf x; }\nEOF`,
    'echo $x${ rm -rf x; }',
    'echo "$x${ rm -rf x; }"',
    'echo $$${ rm -rf x; }',
    'echo ${x:-${ rm -rf x; }}',
    'echo "${x:+${ rm -rf x; }}"',
  ])('rejects a function substitution where the shell expands it: %s', (source) => {
    const program = parseCommand(source, 'posix');
    expect(program.status).toBe('invalid');
    expect(program.issues.map((issue) => issue.code)).toContain(
      'unsupported-function-substitution',
    );
  });

  test.each([
    ['vertical tab', '\v', 'invalid'],
    ['form feed', '\f', 'invalid'],
    ['carriage return', '\r', 'invalid'],
    ['no-break space', '\u00a0', 'complete'],
    ['ogham space mark', '\u1680', 'complete'],
    ['en quad', '\u2000', 'complete'],
    ['figure space', '\u2007', 'complete'],
    ['hair space', '\u200a', 'complete'],
    ['line separator', '\u2028', 'complete'],
    ['paragraph separator', '\u2029', 'complete'],
    ['narrow no-break space', '\u202f', 'complete'],
    ['medium mathematical space', '\u205f', 'complete'],
    ['ideographic space', '\u3000', 'complete'],
    ['byte order mark', '\ufeff', 'complete'],
  ] as const)(
    'rejects an unquoted %s, which bash and zsh read as part of a word, and reads a quoted one as %s',
    (_name, blank, quotedStatus) => {
      for (const source of [
        `cd /tmp${blank}; rm -rf x`,
        `echo a${blank}b`,
        `cat <<EOF${blank}x\nEOF${blank}x\nEOF`,
        `echo "$(echo a${blank}b)"`,
      ]) {
        const program = parseCommand(source, 'posix');
        expect(program.status).toBe('invalid');
        expect(program.issues.map((issue) => issue.code)).toContain('unsupported-blank');
      }
      for (const source of [
        `echo 'a${blank}b'`,
        `git commit -m "a${blank}b"`,
        `cat <<'EOF'\na${blank}b\nEOF`,
        `cat <<EOF\na${blank}b\nEOF`,
      ]) {
        expect(parseCommand(source, 'posix').status).toBe(quotedStatus);
      }
    },
  );

  test.each(['echo a b\tc\nd', 'echo \u0085 \u200b é 日本語'])(
    'leaves space, tab, newline and non-blank Unicode alone: %s',
    (source) => {
      expect(parseCommand(source, 'posix').status).toBe('complete');
    },
  );

  test.each([
    'echo ${HOME} ${x:-a b} ${#x}',
    "echo '${ rm -rf x; }'",
    'echo \\${ rm -rf x; }',
    "cat <<'EOF'\n${ rm -rf x; }\nEOF",
    'cat <<EOF\n\\${ rm -rf x; }\nEOF',
    `echo "$(( $(grep -Fc '\${ ' template.txt) + 1 ))"`,
    'echo $x$y $HOME$PATH $$ $x$$ $x$',
  ])('leaves text the shell does not expand as a function substitution alone: %s', (source) => {
    expect(parseCommand(source, 'posix').status).toBe('complete');
  });

  test.each(['echo $x$(rm -rf x)', 'echo "$x$(rm -rf x)"', 'echo $$$(rm -rf x)'])(
    'reads a command substitution glued to a variable: %s',
    (source) => {
      const program = parseCommand(source, 'posix');
      expect(program.status).toBe('complete');
      const command = program.nodes[0];
      expect(command?.kind === 'command' && command.nested.map((nested) => nested.source)).toEqual([
        'rm -rf x',
      ]);
    },
  );

  test.each([
    'echo ${x:-$(rm -rf x)}',
    'echo "${x:-$(rm -rf x)}"',
    'echo ${x:+`rm -rf x`}',
    'echo ${x:-${y:-$(rm -rf x)}}',
    'echo "${y#<(rm -rf x)}"',
    'echo ${x:-$(( $(rm -rf x) ))}',
    'echo "$(( $(rm -rf x) ))"',
    'echo "$(( 1 + $(( $(rm -rf x) )) ))"',
    'echo ${x:-$(dirname "$(rm -rf x)")}',
  ])(
    'reads a substitution inside a parameter expansion or double-quoted arithmetic: %s',
    (source) => {
      const program = parseCommand(source, 'posix');
      expect(program.status).toBe('complete');
      expect(
        projectCommandViews(program).map((view) => view.words.map((word) => word.text).join(' ')),
      ).toContain('rm -rf x');
    },
  );

  test.each([
    ['echo ${x:-${y}}', '${x:-${y}}'],
    ['echo "${A:-${B:-c}}"', '${A:-${B:-c}}'],
    [': ${FOO:=${BAR}}', '${FOO:=${BAR}}'],
    ['echo ${x:-a\\}b}', '${x:-a\\}b}'],
  ])('reads a nested parameter expansion as one variable part: %s', (source, expansion) => {
    const program = parseCommand(source, 'posix');
    expect(program.status).toBe('complete');
    const command = program.nodes[0];
    const word = command?.kind === 'command' ? command.words[1] : undefined;
    expect(
      word?.parts.filter((part) => part.provenance === 'variable').map((part) => part.raw),
    ).toEqual([expansion]);
  });

  test.each([
    'echo ${x:-"$(rm -rf x)"}',
    'echo "${x:-\'$(rm -rf x)\'}"',
    "echo ${x:-$(rm -rf x)'}'}",
    'echo ${x:-\\"$(rm -rf x)}',
    "echo ${x:-$'\\x41'$(rm -rf x)}",
    'FILES=(${(f)"$(sed -n p list)"})',
    "echo ${x:-'}'$(rm -rf x)\\'}",
    'echo ${x:-"}"$(rm -rf x)\\"}',
    'echo ${x:-$\\\n(rm -rf x)}',
    "echo ${x:-'\"'\"}'$(rm -rf x)'\"}'\"\\'",
    "echo ${x:-'\\''}'$(rm -rf x)'}'\\'}",
    'echo ${x:-"a"} "$(date)"',
    'echo "${x#\\"}" `date`',
  ])(
    'refuses a parameter expansion whose quote or backslash hides a substitution: %s',
    (source) => {
      const program = parseCommand(source, 'posix');
      expect(program.status).toBe('invalid');
      expect(program.issues.map((issue) => issue.code)).toContain(
        'unsupported-parameter-expansion',
      );
    },
  );

  test.each([
    'echo "${MSG:-it\'s done}"',
    'echo $(date) ${x:-"a"}',
    'cat ${x:-"a"} <<EOF\n$(date)\nEOF',
  ])('keeps a quoted parameter expansion that no substitution follows: %s', (source) => {
    const program = parseCommand(source, 'posix');
    expect(program.status).toBe('complete');
    expect(program.issues).toEqual([]);
  });

  test.each(['echo ${x', 'echo ${x:-$(date)', 'echo "${x"', "echo ${x:-'${'}; rm -rf x"])(
    'refuses a parameter expansion without its closing brace: %s',
    (source) => {
      const program = parseCommand(source, 'posix');
      expect(program.status).toBe('invalid');
      expect(program.issues.map((issue) => issue.code)).toContain('unclosed-parameter-expansion');
    },
  );

  test.each([
    `echo "${'$(( '.repeat(65)}\${ rm -rf x; echo 0; }${' ))'.repeat(65)}"`,
    `echo "${'$(( '.repeat(65)}0${' ))'.repeat(65)}"`,
  ])('limits double-quoted arithmetic at the same depth as unquoted arithmetic: %s', (source) => {
    expect(parseCommand(source, 'posix').status).toBe('limited');
  });

  test.each([
    'echo `echo "\\$(rm -rf x)"`',
    'echo `echo \\`rm -rf x\\``',
    'echo `echo \\${ rm -rf x; }`',
    "echo `echo \\\\'$(rm -rf x)\\\\'`",
    'echo `echo \\\\"$(rm -rf x)\\\\"`',
    "echo `echo \\\\\\\n'$(rm -rf x)\\\\\\\n'`",
    "echo `echo \\\n\\\\'$(rm -rf x)\\\n\\\\'`",
    'echo `r\\\\m -rf x`',
    'echo `r\\\nm -rf x`',
    "echo `printf '%s\\\\n' x`",
    'echo `echo "$x" \\\\$y`',
  ])('refuses a backtick body whose escapes change what the shell runs: %s', (source) => {
    const program = parseCommand(source, 'posix');
    expect(program.status).toBe('invalid');
    expect(program.issues.map((issue) => issue.code)).toContain('unsupported-backtick-escape');
  });

  test.each(['echo `date`', "echo `printf '%s\\n' x`", 'echo `echo $(rm -rf x)`'])(
    'keeps a backtick body whose escapes do not hide an expansion: %s',
    (source) => {
      const program = parseCommand(source, 'posix');
      expect(program.status).toBe('complete');
      expect(program.issues).toEqual([]);
    },
  );

  test.each([
    'echo $(dirname "$(command -v node)") tail',
    'echo "$(dirname "$(command -v node)")" tail',
  ])('reads a double-quoted substitution nested in a substitution: %s', (source) => {
    const program = parseCommand(source, 'posix');
    expect(program.status).toBe('complete');
    const command = program.nodes[0];
    expect(command?.kind === 'command' && command.words.map((word) => word.text)).toHaveLength(3);
    expect(command?.kind === 'command' && command.nested.map((nested) => nested.source)).toEqual([
      'dirname "$(command -v node)"',
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

  test('a reserved word that starts a command is a command of its own', () => {
    const rows: readonly {
      readonly source: string;
      readonly views: string[][];
    }[] = [
      {
        source: 'if vault read s; then :; fi',
        views: [['if'], ['vault', 'read', 's'], ['then'], [':'], ['fi']],
      },
      { source: 'while true; do x; done', views: [['while'], ['true'], ['do'], ['x'], ['done']] },
      { source: 'until x; do :; done', views: [['until'], ['x'], ['do'], [':'], ['done']] },
      {
        source: 'if ! x; then :; elif y; then :; else z; fi',
        views: [
          ['if'],
          ['!'],
          ['x'],
          ['then'],
          [':'],
          ['elif'],
          ['y'],
          ['then'],
          [':'],
          ['else'],
          ['z'],
          ['fi'],
        ],
      },
      { source: '! git status', views: [['!'], ['git', 'status']] },
      {
        source: '[ ! -f x ] && echo then',
        views: [
          ['[', '!', '-f', 'x', ']'],
          ['echo', 'then'],
        ],
      },
      { source: 'echo if then', views: [['echo', 'if', 'then']] },
      { source: '"then" x', views: [['then', 'x']] },
      { source: 'X=1 if', views: [['X=1', 'if']] },
    ];
    for (const row of rows) {
      const program = parseCommand(row.source, 'posix');
      expect(program.issues, row.source).toStrictEqual([]);
      expect(
        projectCommandViews(program).map((view) => view.words.map((word) => word.text)),
        row.source,
      ).toStrictEqual(row.views);
    }
    const grouped = parseCommand(
      'if true; then (rm -rf /tmp/x); { git reset --hard; }; fi',
      'posix',
    );
    expect(grouped.status).toBe('complete');
    expect(
      grouped.nodes.flatMap((node) => (node.kind === 'group' ? [node.style] : [])),
    ).toStrictEqual(['subshell', 'brace']);
    const defined = parseCommand('while true; do cleanup() { rm -rf build; }; done', 'posix');
    expect(defined.status).toBe('complete');
    expect(
      defined.nodes.flatMap((node) => (node.kind === 'function' ? [node.name] : [])),
    ).toStrictEqual(['cleanup']);
  });

  test('reports what it could not close or read as an issue', () => {
    const unterminated = parseCommand('echo "unterminated', 'posix');
    expect(unterminated.status).toBe('partial');
    expect(unterminated.issues).toStrictEqual([
      { code: 'unclosed-double-quote', message: 'double-quoted word is not closed' },
    ]);
    const openBody = parseCommand('cleanup() { echo ok', 'posix');
    expect(openBody.status).toBe('partial');
    expect(openBody.issues).toContainEqual({
      code: 'unclosed-function-body',
      message: 'function body is not closed',
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
      ['cat $env:TEMP\\x', 'powershell'],
      ["python3 - <<'PY'\nRemove-Item x -Recurse -Force\nPY", 'posix'],
      ["Remove-Item '<<' x", 'powershell'],
      ['$records | ForEach-Object { $_.key }', 'powershell'],
      ["$records | Where-Object { $_.key -eq 'a' }", 'powershell'],
      ['git commit -m "use ForEach-Object { $_.key }"', 'posix'],
      ['Get-ChildItem C:\\Users\\bob -Recurse', 'powershell'],
      ['mytool --root C:\\proj', 'powershell'],
      ['rm -rf C:\\', 'powershell'],
      ['mytool --config=C:\\proj\\settings.json', 'powershell'],
      ['Get-ChildItem ~\\OneDrive -Recurse', 'powershell'],
      ['mytool $env:USERPROFILE\\proj', 'powershell'],
      ['Get-ChildItem -Path:C:\\proj', 'powershell'],
      ['S=C:\\tmp\\scratch; bash $S/make-fixture.sh', 'posix'],
      ["printf '%s\\n' 'C:\\Users\\O'\\''Brien'", 'posix'],
      ['', 'posix'],
    ] as const;
    for (const [source, dialect] of rows) {
      const program = parseCommand(source);
      expect(program.dialect, source).toBe(dialect);
      expect(program.status, source).toBe('complete');
      expect(program).toStrictEqual(parseCommand(source, 'auto'));
    }
  });

  test.each([
    'echo \\`; rm -rf ~; Get-Content x',
    'Get-Content README.md # use `code` in docs',
    'Get-Content x#; rm -rf ~',
    'echo \\"; rm -rf ~; echo \\"; Get-Content x',
    "echo \\'; rm -rf ~; echo \\'; Get-Content x",
    'Get-Content x; r\\\nm -rf ~',
    'Get-Content x # note',
  ])('an auto parse that picks PowerShell is the PowerShell parse: %s', (source) => {
    expect(parseCommand(source, 'auto')).toStrictEqual(parseCommand(source, 'powershell'));
  });
});

describe('parser caps yield status limited without throwing', () => {
  const small: CommandParserLimits = {
    maxInputLength: 40,
    maxWords: 6,
    maxDepth: 2,
  };
  const overCap: readonly {
    readonly source: string;
    readonly dialects: readonly ShellKind[];
  }[] = [
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
