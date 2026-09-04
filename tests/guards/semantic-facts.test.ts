import { describe, expect, test } from 'bun:test';
import { analyzeCommandWithProgram } from '@/analyzer';
import { findPolicyConfigMutationTargetInSemanticFacts } from '@/guards/policy-protection';
import { findSensitiveTargetInSemanticFacts } from '@/guards/secret-protection';
import {
  createSemanticFactStore,
  createSemanticFacts,
  type FactParserDependencies,
  getCommandSyntaxFact,
} from '@/guards/semantic-facts';
import type { ShellKind } from '@/ir/command';
import { parseCommand } from '@/parser/command';
import { projectShellSyntax } from '@/parser/shell/entry-projection';
import { projectCommandViews } from '@/parser/traversal';
import { TEST_ENVIRONMENT } from '../helpers/environment';
import { policySnapshot, testModes } from '../helpers/policy';

function commandFacts(
  source: string,
  parserDependencies: Partial<FactParserDependencies> = {},
  shell: ShellKind = 'posix',
) {
  return createSemanticFacts(
    {
      toolName: shell === 'powershell' ? 'PowerShell' : 'Bash',
      input: { command: source },
      route: { kind: 'command', shell },
      command: source,
      context: { configCwd: '/project', executionCwd: '/project' },
    },
    parserDependencies,
  );
}

function observedProjection(record: () => void): FactParserDependencies['projectShellSyntax'] {
  return (source, program) => {
    record();
    return projectShellSyntax(source, program);
  };
}

function commandFactsWithLimitedBody(command: string, recordBodyParse: () => void = () => {}) {
  return commandFacts(command, {
    parseCommand: (source, dialect) => {
      if (source === 'a a a') recordBodyParse();
      return parseCommand(
        source,
        dialect,
        source === 'a a a'
          ? { maxInputLength: 20, maxWords: 2, maxDepth: 10 }
          : { maxInputLength: 100, maxWords: 20, maxDepth: 10 },
      );
    },
  });
}

describe('semantic facts', () => {
  test.each([
    ['input', 'posix', 'abcd', { maxInputLength: 3, maxWords: 10, maxDepth: 10 }],
    ['words', 'posix', 'a b c', { maxInputLength: 10, maxWords: 2, maxDepth: 10 }],
    ['depth', 'posix', '((echo ok))', { maxInputLength: 20, maxWords: 10, maxDepth: 1 }],
    ['PowerShell words', 'powershell', 'a b c', { maxInputLength: 10, maxWords: 2, maxDepth: 10 }],
  ] as const)('skips entry projection after structural %s exhaustion', (_label, shell, source, limits) => {
    let projections = 0;
    const facts = commandFacts(
      source,
      {
        parseCommand: (value, dialect) => parseCommand(value, dialect, limits),
        projectShellSyntax: observedProjection(() => projections++),
      },
      shell,
    );

    const command = facts.commands[0];
    if (!command) throw new Error('Expected command fact');
    expect(command.program.status).toBe('limited');
    expect(command.shell).toEqual({
      status: 'structural-limit',
      source,
      entries: [],
      assignmentFallbacks: [],
    });
    expect(facts.store.getShellSyntax(source, command.program)).toBe(command.shell);
    expect(projections).toBe(0);
  });

  test.each([
    ['input', 'abcd', { maxInputLength: 4, maxWords: 10, maxDepth: 10 }],
    ['words', 'a b', { maxInputLength: 10, maxWords: 2, maxDepth: 10 }],
    ['depth', '((echo ok))', { maxInputLength: 20, maxWords: 10, maxDepth: 2 }],
  ] as const)('preserves entry projection at the exact structural %s limit', (_label, source, limits) => {
    let projections = 0;
    const facts = commandFacts(source, {
      parseCommand: (value, dialect) => parseCommand(value, dialect, limits),
      projectShellSyntax: observedProjection(() => projections++),
    });

    expect(facts.commands[0]?.program.status).not.toBe('limited');
    expect(facts.commands[0]?.shell.status).not.toBe('structural-limit');
    expect(projections).toBe(1);
  });

  test('bounds recursive heredoc-body projection instead of overflowing the stack', () => {
    const levels = 6000;
    const source = `${Array.from({ length: levels }, (_, i) => `cat <<D${i}`).join('\n')}\nx\n${Array.from(
      { length: levels },
      (_, i) => `D${levels - 1 - i}`,
    ).join('\n')}\n`;
    expect(source.length).toBeLessThan(131_072);
    const program = parseCommand(source, 'posix');
    expect(program.status).toBe('complete');
    expect(projectShellSyntax(source, program).status).toBe('structural-limit');
  });

  test('keeps ordinary and structural-limit shell facts independent in both cache orders', () => {
    const source = 'Write-Output one two';
    const store = createSemanticFactStore();
    const ordinaryProgram = store.getCommandProgram(source, 'posix');
    const limitedPowerShellProgram = parseCommand(source, 'powershell', {
      maxInputLength: 100,
      maxWords: 2,
      maxDepth: 10,
    });

    const ordinary = store.getShellSyntax(source, ordinaryProgram);
    const limited = store.getShellSyntax(source, limitedPowerShellProgram);
    expect(ordinary.status).toBe('complete');
    expect(limited.status).toBe('structural-limit');
    expect(store.getShellSyntax(source, ordinaryProgram)).toBe(ordinary);
    expect(store.getShellSyntax(source, limitedPowerShellProgram)).toBe(limited);

    const reverseStore = createSemanticFactStore();
    const reverseLimited = reverseStore.getShellSyntax(source, limitedPowerShellProgram);
    const reverseOrdinary = reverseStore.getShellSyntax(
      source,
      reverseStore.getCommandProgram(source, 'posix'),
    );
    expect(reverseLimited.status).toBe('structural-limit');
    expect(reverseOrdinary.status).toBe('complete');
    expect(reverseLimited).not.toBe(reverseOrdinary);
  });

  test('validates supplied program sources and caches limit facts by program identity', () => {
    const store = createSemanticFactStore();
    const first = parseCommand('a b', 'posix', {
      maxInputLength: 10,
      maxWords: 1,
      maxDepth: 10,
    });
    const second = parseCommand('a b', 'posix', {
      maxInputLength: 10,
      maxWords: 1,
      maxDepth: 10,
    });

    expect(() => store.getShellSyntax('different', first)).toThrow(
      'Shell syntax source does not match command program source.',
    );
    expect(store.getShellSyntax(first.source, first)).toBe(
      store.getShellSyntax(first.source, first),
    );
    expect(store.getShellSyntax(second.source, second)).not.toBe(
      store.getShellSyntax(first.source, first),
    );
  });

  test.each([
    ['partial command', 'echo $(foo', 'complete'],
    ['unclosed shell quote', 'echo "x', 'unclosed-quote'],
    ['invalid shell syntax', 'echo ${', 'invalid'],
  ] as const)('preserves the ordinary %s control', (_label, source, shellStatus) => {
    const facts = createSemanticFacts({
      toolName: 'Bash',
      input: { command: source },
      route: { kind: 'command', shell: 'posix' },
      command: source,
      context: { configCwd: '/project', executionCwd: '/project' },
    });

    if (_label === 'partial command') expect(facts.commands[0]?.program.status).toBe('partial');
    expect(facts.commands[0]?.shell.status).toBe(shellStatus);
  });

  test('keeps tokenizing when a closed expansion holds a parenthesis', () => {
    const shell = commandFacts('cat ${OUT:-$(pwd)}/.env').commands[0]?.shell;

    expect(shell?.status).toBe('complete');
    expect(
      shell?.entries.some((entry) => entry.kind === 'word' && entry.text.includes('.env')),
    ).toBe(true);
  });

  test('projects active assignment fallbacks but keeps single-quoted text inert', () => {
    const active = commandFacts('cat "${X:=proof-target}"').commands[0]?.shell;
    const inert = commandFacts("cat '${X:=proof-target}'").commands[0]?.shell;

    expect(active?.entries).toContainEqual({ kind: 'word', text: '${X:=proof-target}' });
    expect(active?.assignmentFallbacks).toEqual(['proof-target']);
    expect(inert?.entries).toContainEqual({ kind: 'word', text: '${X:=proof-target}' });
    expect(inert?.assignmentFallbacks).toEqual([]);
  });

  test('policy protection does not emulate nested shell bodies', () => {
    const body = 'a a a';
    const command = `bash -c '${body}'`;
    let bodyProjections = 0;
    const facts = commandFacts(command, {
      parseCommand: (source, dialect) =>
        parseCommand(
          source,
          dialect,
          source === body
            ? { maxInputLength: 20, maxWords: 2, maxDepth: 10 }
            : { maxInputLength: 100, maxWords: 20, maxDepth: 10 },
        ),
      projectShellSyntax: (source, program) => {
        if (source === body) bodyProjections++;
        return projectShellSyntax(source, program);
      },
    });

    expect(facts.commands[0]?.program.status).toBe('complete');
    expect(findPolicyConfigMutationTargetInSemanticFacts(facts)).toBeNull();
    expect(() => findSensitiveTargetInSemanticFacts(facts, { denyPaths: [] })).toThrow(
      'Structural command analysis limit exceeded.',
    );
    expect(bodyProjections).toBe(0);
  });

  test.each([
    ['option-terminator', "bash -- -c 'a a a'"],
    ['script-positional', "bash script.sh -c 'a a a'"],
    ['consumed-option-value', "bash -O -c 'a a a'"],
    ['ksh option-terminator', "ksh -- -c 'a a a'"],
    ['ksh script-positional', "ksh script.ksh -c 'a a a'"],
    ['ksh unsupported plus resumed cluster', "ksh +o-c 'a a a'"],
  ] as const)('does not reinterpret shell argv for secret protection after the %s boundary', (_case, command) => {
    let bodyProgramParses = 0;
    const facts = commandFactsWithLimitedBody(command, () => bodyProgramParses++);

    expect(() => findSensitiveTargetInSemanticFacts(facts, { denyPaths: [] })).not.toThrow();
    expect(bodyProgramParses).toBe(0);
  });

  test('secret protection continues argv-aware structural checks after consumed options', () => {
    const facts = commandFactsWithLimitedBody("bash -O extglob -lc 'a a a'");

    expect(() => findSensitiveTargetInSemanticFacts(facts, { denyPaths: [] })).toThrow(
      'Structural command analysis limit exceeded.',
    );
  });

  test.each([
    ['sh plus-option', "sh +e -c 'a a a'"],
    ['bash mixed option/value cluster', "bash -lO extglob -c 'a a a'"],
    ['bash command/value cluster', "bash -co errexit 'a a a'"],
    ['zsh attached option value', "zsh -ocorrect -c 'a a a'"],
    ['ksh attached option name', "ksh -oerrexit -c 'a a a'"],
    ['ksh separated option name', "ksh -o errexit -c 'a a a'"],
    ['ksh separated plus option name', "ksh +o errexit -c 'a a a'"],
    ['ksh command option in the option-name cluster', "ksh -oc 'a a a'"],
    ['ksh resumed negative command option', "ksh -o-c 'a a a'"],
    ['ksh resumed negative option cluster', "ksh -o-lc 'a a a'"],
    ['ksh bare option-name selector', "ksh -o -c 'a a a'"],
    ['ksh attached plus option name', "ksh +oerrexit -c 'a a a'"],
    ['ksh bare plus option-name selector', "ksh +o -c 'a a a'"],
    ['ksh option-looking token after bare option selector', "ksh -o +e -c 'a a a'"],
    ['ksh command/value cluster', "ksh -co errexit 'a a a'"],
  ] as const)('selects the real shell body for secret protection through %s', (_case, command) => {
    const facts = commandFactsWithLimitedBody(command);

    expect(() => findSensitiveTargetInSemanticFacts(facts, { denyPaths: [] })).toThrow(
      'Structural command analysis limit exceeded.',
    );
  });

  test('direct semantic-fact consumers reject structural limits before fallback scanning', () => {
    const marker = 'private-structural-limit-marker';
    const source = `${marker} .env .cc-safety-net/policy.json`;
    const facts = commandFacts(source, {
      parseCommand: (value, dialect) =>
        parseCommand(value, dialect, { maxInputLength: 10, maxWords: 10, maxDepth: 10 }),
    });

    for (const read of [
      () => findPolicyConfigMutationTargetInSemanticFacts(facts),
      () => findSensitiveTargetInSemanticFacts(facts, { denyPaths: [] }),
    ]) {
      try {
        read();
        throw new Error('Expected structural shell syntax limit');
      } catch (error) {
        expect((error as Error).constructor.name).toBe('StructuralShellSyntaxLimitError');
        expect((error as Error).message).toBe('Structural command analysis limit exceeded.');
        expect((error as Error).message).not.toContain(marker);
      }
    }
  });

  test('skips entry projection for the exact one-MiB structural payload', () => {
    const source = 'a '.repeat(524_288);
    let projections = 0;
    const facts = commandFacts(source, {
      projectShellSyntax: observedProjection(() => projections++),
    });

    expect(Buffer.byteLength(source)).toBe(1_048_576);
    expect(facts.commands[0]?.program.status).toBe('limited');
    expect(facts.commands[0]?.shell.status).toBe('structural-limit');
    expect(projections).toBe(0);
  });

  test('preserves declared and input command provenance without conflating them', () => {
    const facts = createSemanticFacts({
      toolName: 'bash',
      input: { command: 'cat .env' },
      route: { kind: 'command', shell: 'posix' },
      command: 'git status',
      context: { configCwd: '/project', executionCwd: '/project' },
    });

    expect(
      facts.commands.flatMap((fact) =>
        fact.usages.map((usage) => ({ usage, source: fact.source })),
      ),
    ).toEqual([
      { usage: 'input-candidate', source: 'cat .env' },
      { usage: 'declared-command', source: 'git status' },
    ]);
    expect(getCommandSyntaxFact(facts, 'input-candidate')?.source).toBe('cat .env');
    expect(getCommandSyntaxFact(facts, 'declared-command')?.source).toBe('git status');
  });

  test('deduplicates equal command text while retaining both usages', () => {
    const facts = createSemanticFacts({
      toolName: 'bash',
      input: { command: 'git status' },
      route: { kind: 'command', shell: 'posix' },
      command: 'git status',
      context: { configCwd: '/project', executionCwd: '/project' },
    });

    expect(facts.commands).toHaveLength(1);
    expect(facts.commands[0]?.usages).toEqual(['input-candidate', 'declared-command']);
  });

  test('preserves Windows paths in unknown-tool command fallback', () => {
    const platform = Object.getOwnPropertyDescriptor(process, 'platform');
    if (!platform) throw new Error('Expected process.platform descriptor');
    Object.defineProperty(process, 'platform', { ...platform, value: 'win32' });

    try {
      const source = 'rm C:\\Users\\alice\\.cc-safety-net\\policy.json';
      const facts = createSemanticFacts({
        toolName: 'custom_runner',
        input: { command: source },
        route: { kind: 'unknown' },
        context: { configCwd: 'C:\\project', executionCwd: 'C:\\project' },
      });

      expect(facts.commands[0]?.program.dialect).toBe('powershell');
      expect(facts.commands[0]?.shell.entries).toContainEqual({
        kind: 'word',
        text: 'C:\\Users\\alice\\.cc-safety-net\\policy.json',
      });
    } finally {
      Object.defineProperty(process, 'platform', platform);
    }
  });

  test('keeps nested command substitutions in the parsed program', () => {
    const facts = createSemanticFacts({
      toolName: 'bash',
      input: { command: 'echo $(git reset --hard); rm -rf /' },
      route: { kind: 'command', shell: 'posix' },
      command: 'echo $(git reset --hard); rm -rf /',
      context: { configCwd: '/project', executionCwd: '/project' },
    });
    const program = facts.commands[0]?.program;
    if (!program) throw new Error('Expected command fact');

    expect(
      projectCommandViews(program).map((view) => view.words.map((word) => word.text).join(' ')),
    ).toEqual(['echo ', 'git reset --hard', 'rm -rf /']);
  });

  test('records bounded parser uncertainty', () => {
    const facts = createSemanticFacts({
      toolName: 'bash',
      input: { command: `echo ${'x'.repeat(131_100)}` },
      route: { kind: 'command', shell: 'posix' },
      command: `echo ${'x'.repeat(131_100)}`,
      context: { configCwd: '/project', executionCwd: '/project' },
    });

    expect(facts.commands[0]?.program.issues.map((issue) => issue.code)).toContain('input-limit');
  });

  test('keeps patch content inert while retaining patch target provenance', () => {
    const facts = createSemanticFacts({
      toolName: 'apply_patch',
      input: {
        patch: '*** Begin Patch\n*** Update File: README.md\n+cat ~/.ssh/id_rsa\n*** End Patch',
      },
      route: { kind: 'patch' },
      context: { configCwd: '/project', executionCwd: '/project' },
    });

    expect(facts.commands).toEqual([]);
    expect(facts.paths).toEqual(['README.md']);
  });

  test('classifies file and here-data redirections without losing legacy ordering', () => {
    const source = 'cat .env < input > output <<< data >| legacy';
    const facts = createCommandFacts(source);

    expect(
      facts.commands[0]?.shell.entries.filter((entry) => entry.kind === 'redirection'),
    ).toEqual([
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
  });

  test.each([
    ['cat << data', '<<'],
    ['cat<<data', '<<'],
    ['cat <<< data', '<<<'],
    ['cat<<<data', '<<<'],
  ])('coalesces the here-data redirection in %s', (source, operator) => {
    const facts = createCommandFacts(source);

    expect(
      facts.commands[0]?.shell.entries.filter((entry) => entry.kind === 'redirection'),
    ).toEqual([
      {
        kind: 'redirection',
        operator,
        role: 'here-data',
        targetOrder: 'legacy-segment',
        target: 'data',
      },
    ]);
  });

  test('marks only the fixed legacy shell operators as segment boundaries', () => {
    const source = 'echo ok <(cat file); echo done';
    const facts = createCommandFacts(source);

    expect(
      facts.commands[0]?.shell.entries
        .filter((entry) => entry.kind === 'operator')
        .map(({ operator, boundary }) => ({ operator, boundary })),
    ).toEqual([
      { operator: '<(', boundary: false },
      { operator: ')', boundary: false },
      { operator: ';', boundary: true },
    ]);
  });

  test('projects executed brace groups as segments and keeps inert function bodies out', () => {
    const grouped = createCommandFacts('{ rm -rf /project/cache; }').commands[0]?.shell.entries;
    const defined = createCommandFacts('cleanup() { rm -rf /project/cache; }').commands[0]?.shell
      .entries;
    const called = createCommandFacts('cleanup() { rm -rf /project/cache; }; X=1 cleanup')
      .commands[0]?.shell.entries;
    const timed = createCommandFacts('cleanup() { rm -rf /project/cache; }; time -p cleanup')
      .commands[0]?.shell.entries;
    const timedWithTerminator = createCommandFacts(
      'cleanup() { rm -rf /project/cache; }; time -p -- cleanup',
    ).commands[0]?.shell.entries;

    expect(grouped).toEqual([
      { kind: 'operator', operator: '{', boundary: true },
      { kind: 'word', text: 'rm' },
      { kind: 'word', text: '-rf' },
      { kind: 'word', text: '/project/cache' },
      { kind: 'operator', operator: ';', boundary: true },
      { kind: 'operator', operator: '}', boundary: true },
    ]);
    expect(defined).toEqual([]);
    expect(called?.filter((entry) => entry.kind === 'word').map((entry) => entry.text)).toEqual([
      'X=1',
      'cleanup',
      'rm',
      '-rf',
      '/project/cache',
    ]);
    expect(timed?.filter((entry) => entry.kind === 'word').map((entry) => entry.text)).toEqual([
      'time',
      '-p',
      'cleanup',
      'rm',
      '-rf',
      '/project/cache',
    ]);
    expect(
      timedWithTerminator?.filter((entry) => entry.kind === 'word').map((entry) => entry.text),
    ).toEqual(['time', '-p', '--', 'cleanup', 'rm', '-rf', '/project/cache']);
  });

  test('fails closed when recursive POSIX function projection reaches the structural limit', () => {
    const source = 'loop() { loop; }; loop';
    const program = parseCommand(source, 'posix');

    expect(program.status).toBe('complete');
    expect(projectShellSyntax(source, program).status).toBe('structural-limit');
  });

  test('fails closed when branching POSIX function projection exhausts the expansion budget', () => {
    const source = 'fan() { fan; fan; }; fan';
    const program = parseCommand(source, 'posix');

    expect(projectShellSyntax(source, program).status).toBe('structural-limit');
  });

  test('parses equal roots and repeated nested bodies once per evaluation', () => {
    const canonicalCalls = new Map<string, number>();
    const projectionCalls = new Map<string, number>();
    const source = "bash -c 'echo ok'; bash -c 'echo ok'; echo $(printf safe); echo $(printf safe)";
    const facts = createSemanticFacts(
      {
        toolName: 'bash',
        input: { command: source },
        route: { kind: 'command', shell: 'posix' },
        command: source,
        context: { configCwd: '/project', executionCwd: '/project' },
      },
      {
        parseCommand: (command, dialect) => {
          canonicalCalls.set(command, (canonicalCalls.get(command) ?? 0) + 1);
          return parseCommand(command, dialect);
        },
        projectShellSyntax: (command, program) => {
          projectionCalls.set(command, (projectionCalls.get(command) ?? 0) + 1);
          return projectShellSyntax(command, program);
        },
      },
    );

    expect(findPolicyConfigMutationTargetInSemanticFacts(facts)).toBeNull();
    expect(
      findSensitiveTargetInSemanticFacts(facts, {
        disabledRules: [],
        denyPaths: [],
      }),
    ).toBeNull();
    const command = getCommandSyntaxFact(facts, 'declared-command');
    expect(
      analyzeCommandWithProgram(
        source,
        {
          cwd: '/project',
          shell: 'posix',
          policySnapshot: policySnapshot(),
          environment: TEST_ENVIRONMENT,
          effectiveCapabilities: testModes().capabilities,
          protectedGitMetadata: null,
        },
        command?.program,
        facts.store,
      ),
    ).toBeNull();

    expect(Object.fromEntries(projectionCalls)).toEqual({
      [source]: 1,
      'echo ok': 1,
      'printf safe': 1,
    });
    expect(Object.fromEntries(canonicalCalls)).toEqual({
      [source]: 1,
      'echo ok': 1,
      'printf safe': 1,
    });
  });

  // Commands below are analyzer input strings only; they are never executed in a shell.
  test.each([
    [
      'keeps an explicit fd prefix as a word of its own',
      'cmd 2>&1',
      [
        { kind: 'word', text: 'cmd' },
        { kind: 'word', text: '2' },
        {
          kind: 'redirection',
          operator: '>&',
          role: 'file-write',
          targetOrder: 'immediate',
          target: '1',
        },
      ],
    ],
    [
      'reports a glob word as an operator instead of a path token',
      'rm *.env',
      [
        { kind: 'word', text: 'rm' },
        { kind: 'operator', operator: 'glob', boundary: false },
      ],
    ],
    [
      'keeps the glob pattern text when it names a redirection target',
      'echo a > *.log',
      [
        { kind: 'word', text: 'echo' },
        { kind: 'word', text: 'a' },
        {
          kind: 'redirection',
          operator: '>',
          role: 'file-write',
          targetOrder: 'immediate',
          target: '*.log',
        },
      ],
    ],
    [
      'normalizes a bare variable reference to its braced spelling',
      '$FOO/.env',
      [{ kind: 'word', text: '${FOO}/.env' }],
    ],
    [
      'inlines command-substitution words and keeps the residual literal',
      'cat $(pwd)/.env',
      [
        { kind: 'word', text: 'cat' },
        { kind: 'word', text: '${}' },
        { kind: 'operator', operator: '(', boundary: false },
        { kind: 'word', text: 'pwd' },
        { kind: 'operator', operator: ')', boundary: false },
        { kind: 'word', text: '/.env' },
      ],
    ],
    [
      'splits an unquoted heredoc body into boundary-separated lines',
      'cat <<EOF\ncat .env\nEOF',
      [
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
      ],
    ],
  ] as const)('%s', (_label, source, entries) => {
    expect(createCommandFacts(source).commands[0]?.shell.entries).toEqual([...entries]);
  });

  describe('quoted-heredoc body masking', () => {
    function bodyWordTexts(source: string) {
      const facts = createCommandFacts(source);
      return facts.commands[0]?.shell.entries
        .filter((entry) => entry.kind === 'word')
        .map((entry) => entry.text);
    }

    function hereDataRedirections(source: string) {
      const facts = createCommandFacts(source);
      return facts.commands[0]?.shell.entries.filter(
        (entry) => entry.kind === 'redirection' && entry.role === 'here-data',
      );
    }

    test('masks a quoted-delimiter body so its words never enter the token stream', () => {
      const source = "cat <<'EOF'\ncat .env\nEOF";

      expect(bodyWordTexts(source)).not.toContain('.env');
      expect(hereDataRedirections(source)).toEqual([
        {
          kind: 'redirection',
          operator: '<<',
          role: 'here-data',
          targetOrder: 'legacy-segment',
          target: 'EOF',
        },
      ]);
    });

    test('leaves an unquoted-delimiter body scannable', () => {
      expect(bodyWordTexts('cat <<EOF\ncat .env\nEOF')).toContain('.env');
    });

    test('leaves bodies fed to executing or applying consumers scannable', () => {
      for (const source of [
        "bash <<'EOF'\ncat .env\nEOF",
        "git apply <<'EOF'\n--- a/.env\n+++ b/.env\nEOF",
        "cat <<'EOF' | bash\ncat .env\nEOF",
        "cat <<'EOF' > >(bash)\ncat .env\nEOF",
        "tee >(bash) <<'EOF'\ncat .env\nEOF",
      ]) {
        expect(createCommandFacts(source).commands[0]?.shell.source, source).toContain('.env');
      }
    });

    test('masks before the unclosed-quote check so an apostrophe body still parses', () => {
      const facts = createCommandFacts("cat <<'EOF'\nit's literal\nEOF");

      expect(facts.commands[0]?.shell.status).toBe('complete');
    });

    test('never masks an unterminated heredoc (program is not complete)', () => {
      expect(bodyWordTexts("cat <<'EOF'\ncat .env")).toContain('.env');
    });

    test('masks a strip-tabs body using the body span, not the tab-stripped text', () => {
      expect(bodyWordTexts("cat <<-'EOF'\n\tcat .env\n\tEOF")).not.toContain('.env');
    });

    test('contains an invalid heredoc-body projection instead of failing the command', () => {
      const facts = createCommandFacts("python3 - <<'PY'\nvalue = ${incomplete\nprint(value)\nPY");

      expect(facts.commands[0]?.shell.status).toBe('complete');
      expect(bodyWordTexts("bash <<'EOF'\ncat .env\nx=${q\nEOF")).toContain('.env');
    });
  });
});

function createCommandFacts(command: string) {
  return createSemanticFacts({
    toolName: 'bash',
    input: { command },
    route: { kind: 'command', shell: 'posix' },
    command,
    context: { configCwd: '/project', executionCwd: '/project' },
  });
}
