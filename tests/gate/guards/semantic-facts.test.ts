import { describe, expect, test } from 'bun:test';
import { createTestEnvironment, processPathResolver } from '@/core/environment';
import { parseCommand } from '@/core/shell/parse';
import {
  createSemanticFactStore,
  createSemanticFacts,
  getCommandSyntaxFact,
  projectSensitiveShellText,
  StructuralShellSyntaxLimitError,
} from '@/gate/guards/semantic-facts';
import type { ToolRoute } from '@/gate/invocation';
import { createToolInvocation } from '@/gate/invocation';

/**
 * Every guard reads the call through these facts, so a wrong answer here moves a decision even
 * when the parser and the rule catalog agree.
 */

const CONTEXT = { configCwd: '/work/project', executionCwd: '/work/project/repo' };

/** One call's facts, from the raw input a host would deliver. */
function facts(toolName: string, input: unknown, route: ToolRoute, command: string | null = null) {
  return createSemanticFacts(createToolInvocation(toolName, input, route, CONTEXT, command));
}

describe('gate/guards/semantic-facts', () => {
  test('a command fact is carried by the route that has one, and names where it came from', () => {
    const rows: readonly {
      readonly route: ToolRoute;
      readonly command: string | null;
      readonly sources: readonly (readonly [string, string])[];
    }[] = [
      {
        route: { kind: 'command', shell: 'posix' },
        command: 'git status',
        sources: [
          ['input-candidate', 'cat .env'],
          ['declared-command', 'git status'],
        ],
      },
      // The same text from both sources is one fact carrying both usages.
      {
        route: { kind: 'command', shell: 'posix' },
        command: 'cat .env',
        sources: [
          ['input-candidate', 'cat .env'],
          ['declared-command', 'cat .env'],
        ],
      },
      {
        route: { kind: 'command', shell: 'posix' },
        command: null,
        sources: [['input-candidate', 'cat .env']],
      },
      // The unknown route carries the input candidate but never a declared command.
      {
        route: { kind: 'unknown' },
        command: 'git status',
        sources: [['input-candidate', 'cat .env']],
      },
      { route: { kind: 'path' }, command: 'git status', sources: [] },
      { route: { kind: 'patch' }, command: 'git status', sources: [] },
      { route: { kind: 'grep' }, command: 'git status', sources: [] },
      { route: { kind: 'glob' }, command: 'git status', sources: [] },
    ];
    for (const row of rows) {
      const built = facts('Bash', { command: 'cat .env' }, row.route, row.command);
      const label = `${row.route.kind} ${row.command}`;
      expect(
        built.commands.flatMap((fact) => fact.usages.map((usage) => [usage, fact.source])),
        label,
      ).toStrictEqual(row.sources.map((source) => [...source]));
      for (const usage of ['input-candidate', 'declared-command'] as const) {
        expect(getCommandSyntaxFact(built, usage)?.source ?? null, `${label} ${usage}`).toBe(
          row.sources.find((source) => source[0] === usage)?.[1] ?? null,
        );
      }
    }
  });

  test('the paths a route reads are the keys that route treats as paths', () => {
    const rows: readonly {
      readonly toolName: string;
      readonly input: unknown;
      readonly route: ToolRoute;
      readonly paths: readonly string[];
    }[] = [
      {
        toolName: 'Read',
        input: { file_path: '/home/agent/.config' },
        route: { kind: 'path' },
        paths: ['/home/agent/.config'],
      },
      // A grep route adds `glob` to the path keys, and a glob route adds `pattern` as well.
      {
        toolName: 'Grep',
        input: { pattern: 'key', path: '/etc', glob: '*.txt' },
        route: { kind: 'grep' },
        paths: ['/etc', '*.txt'],
      },
      {
        toolName: 'Glob',
        input: { pattern: '**/*.env', path: '/srv' },
        route: { kind: 'glob' },
        paths: ['**/*.env', '/srv'],
      },
      // A key is folded before it is looked up, so three spellings are three paths.
      {
        toolName: 'Write',
        input: { targetFile: '/x', TargetFile: '/y', 'target-file': '/z' },
        route: { kind: 'path' },
        paths: ['/x', '/y', '/z'],
      },
      // A patch route reads the files the patch names instead.
      {
        toolName: 'ApplyPatch',
        input: { patch: '*** Begin Patch\n*** Update File: README.md\n' },
        route: { kind: 'patch' },
        paths: ['README.md'],
      },
      {
        toolName: 'Bash',
        input: { command: 'rm -rf /tmp/x' },
        route: { kind: 'command', shell: 'posix' },
        paths: [],
      },
      { toolName: 'Bash', input: 'not-an-object', route: { kind: 'path' }, paths: [] },
      { toolName: 'Bash', input: null, route: { kind: 'path' }, paths: [] },
    ];
    for (const row of rows) {
      expect(
        facts(row.toolName, row.input, row.route).paths,
        `${row.toolName} ${row.route.kind}`,
      ).toStrictEqual([...row.paths]);
    }
  });

  test('a command fact carries the program and the entry stream of its own dialect', () => {
    const posix = facts(
      'Bash',
      { command: 'cat "$HOME"/.config' },
      { kind: 'command', shell: 'posix' },
    );
    expect(posix.commands[0]?.program.dialect).toBe('posix');
    expect(posix.commands[0]?.shell.status).toBe('complete');
    const powershell = facts(
      'Bash',
      { command: 'Remove-Item -Recurse C:\\Temp' },
      { kind: 'command', shell: 'powershell' },
    );
    expect(powershell.commands[0]?.program.dialect).toBe('powershell');
    expect(powershell.commands[0]?.shell.program).toBe(powershell.commands[0]?.program);
    // A source the walk cannot read whole is reported as such rather than as a readable one.
    expect(
      facts('Bash', { command: 'echo "x' }, { kind: 'command', shell: 'posix' }).commands[0]?.shell
        .status,
    ).toBe('unclosed-quote');
    expect(
      facts('Bash', { command: 'echo ${' }, { kind: 'command', shell: 'posix' }).commands[0]?.shell
        .status,
    ).toBe('invalid');
  });

  test('the store parses each source once, and refuses a program built from another source', () => {
    const store = createSemanticFactStore();
    const program = store.getCommandProgram('rm -rf /tmp/x', 'posix');
    expect(store.getCommandProgram('rm -rf /tmp/x', 'posix')).toBe(program);
    // A different dialect is a different program, cached under its own key.
    expect(store.getCommandProgram('rm -rf /tmp/x', 'powershell')).not.toBe(program);
    expect(store.getShellSyntax('rm -rf /tmp/x')).toBe(
      store.getShellSyntax('rm -rf /tmp/x', program),
    );
    const other = store.getCommandProgram('echo other', 'posix');
    expect(() => store.getShellSyntax('echo mine', other)).toThrowError(
      new TypeError('Shell syntax source does not match command program source.'),
    );
  });

  test('a source over the structural limit is never read, and reports the limit', () => {
    const limited = createSemanticFacts(
      createToolInvocation(
        'Bash',
        { command: 'abcd' },
        { kind: 'command', shell: 'posix' },
        CONTEXT,
        null,
      ),
      {
        parseCommand: (source, dialect) =>
          parseCommand(source, dialect, { maxInputLength: 3, maxWords: 10, maxDepth: 10 }),
        readGuardSyntax: () => {
          throw new Error('a limited program is never read');
        },
      },
    );
    const limitedProgram = limited.commands[0]?.program;
    if (limitedProgram === undefined) throw new Error('the limited command has no program');
    expect(limited.commands[0]?.shell).toStrictEqual({
      status: 'structural-limit',
      source: 'abcd',
      program: limitedProgram,
      assignmentFallbacks: [],
    });
    const error = new StructuralShellSyntaxLimitError();
    expect(error.name).toBe('StructuralShellSyntaxLimitError');
    expect(error.message).toBe('Structural command analysis limit exceeded.');
  });

  test('sensitive text is projected through the path variables the environment carries', () => {
    const environment = createTestEnvironment({
      env: new Map([
        ['HOME', '/home/agent'],
        ['TMPDIR', '/tmp'],
      ]),
      home: '/home/agent',
      tmpdir: '/tmp',
      paths: processPathResolver,
    });
    const rows: readonly { readonly word: string; readonly projected: string }[] = [
      { word: 'no-dollar-here', projected: 'no-dollar-here' },
      { word: '$HOME/.config', projected: '/home/agent/.config' },
      { word: '${HOME}/.config', projected: '/home/agent/.config' },
      { word: '$TMPDIR/x', projected: '/tmp/x' },
      // A variable the projection does not support, or one the environment does not carry, is
      // left as written.
      { word: '$XDG_CONFIG_HOME/y', projected: '$XDG_CONFIG_HOME/y' },
      { word: '$UNSUPPORTED/z', projected: '$UNSUPPORTED/z' },
      { word: '$', projected: '$' },
      { word: '$$', projected: '$$' },
      { word: '', projected: '' },
    ];
    for (const row of rows) {
      expect(projectSensitiveShellText(row.word, environment), row.word).toBe(row.projected);
    }
  });
});
