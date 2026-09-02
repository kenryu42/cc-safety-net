import { describe, expect, test } from 'bun:test';
import { createProcessEnvironment } from '@next/core/environment';
import {
  createSemanticFactStore,
  createSemanticFacts,
  getCommandSyntaxFact,
  projectSensitiveShellText,
  StructuralShellSyntaxLimitError,
} from '@next/gate/guards/semantic-facts';
import type { ToolRoute } from '@next/gate/invocation';
import { createToolInvocation } from '@next/gate/invocation';
import {
  StructuralShellSyntaxLimitError as ShippedStructuralShellSyntaxLimitError,
  createSemanticFactStore as shippedCreateSemanticFactStore,
  createSemanticFacts as shippedCreateSemanticFacts,
  getCommandSyntaxFact as shippedGetCommandSyntaxFact,
  projectSensitiveShellText as shippedProjectSensitiveShellText,
} from '@/guards/semantic-facts';
import { createToolInvocation as shippedCreateToolInvocation } from '@/ir/invocation';
import { corpusCommands, corpusToolInputs, FIXED_COMMANDS } from '../../helpers/shell-inputs';

/**
 * Every guard reads the call through these facts, so a divergence here moves a decision even
 * when the parser and the rule catalog agree.
 */

const CONTEXT = { configCwd: '/work/project', executionCwd: '/work/project/repo' };

const ROUTES: readonly ToolRoute[] = [
  { kind: 'command', shell: 'posix' },
  { kind: 'command', shell: 'powershell' },
  { kind: 'command', shell: 'auto' },
  { kind: 'patch' },
  { kind: 'path' },
  { kind: 'grep' },
  { kind: 'glob' },
  { kind: 'unknown' },
];

const EXTRA_INPUTS: readonly { toolName: string; input: unknown }[] = [
  { toolName: 'Bash', input: { command: 'rm -rf /tmp/x' } },
  { toolName: 'Read', input: { file_path: '/home/agent/.ssh/config' } },
  { toolName: 'Grep', input: { pattern: 'key', path: '/etc', glob: '*.pem' } },
  { toolName: 'Glob', input: { pattern: '**/*.env', search_directory: '/srv' } },
  { toolName: 'ApplyPatch', input: { patch: '*** Begin Patch\n*** Update File: a.txt\n' } },
  { toolName: 'NotebookEdit', input: { notebook_path: '/nb.ipynb', absolutePath: '/nb.ipynb' } },
  { toolName: 'Write', input: { targetFile: '/x', TargetFile: '/y', 'target-file': '/z' } },
  { toolName: 'Unknown', input: { command: '', file: '/a', include: '/b' } },
  { toolName: 'Bash', input: 'not-an-object' },
  { toolName: 'Bash', input: null },
  { toolName: '', input: {} },
];

const DECLARED_COMMANDS = [
  null,
  'rm -rf /tmp/x',
  'echo hi | tee out',
  'Remove-Item -Recurse C:\\Temp',
  '',
];

type FactRow = {
  toolName: string;
  input: unknown;
  route: ToolRoute;
  command: string | null;
};

/** One row's facts from both implementations. */
function factsPair(row: FactRow) {
  return {
    next: createSemanticFacts(
      createToolInvocation(row.toolName, row.input, row.route, CONTEXT, row.command),
    ),
    shipped: shippedCreateSemanticFacts(
      shippedCreateToolInvocation(row.toolName, row.input, row.route, CONTEXT, row.command),
    ),
  };
}

/** The facts minus the store, whose closures cannot be compared across implementations. */
function comparable(facts: {
  invocation: unknown;
  commands: readonly { usages: unknown; source: string; program: unknown; shell: unknown }[];
  paths: readonly string[];
}) {
  return {
    invocation: facts.invocation,
    commands: facts.commands.map((fact) => ({
      usages: fact.usages,
      source: fact.source,
      program: fact.program,
      shell: fact.shell,
    })),
    paths: facts.paths,
  };
}

describe('next/gate/guards/semantic-facts against src/guards/semantic-facts', () => {
  const rows = [...corpusToolInputs(), ...EXTRA_INPUTS].flatMap((row) =>
    ROUTES.flatMap((route) => DECLARED_COMMANDS.map((command) => ({ ...row, route, command }))),
  );

  test('builds the same facts for every corpus input on every route', () => {
    expect(rows.length).toBeGreaterThan(1_000);
    for (const row of rows) {
      const pair = factsPair(row);
      expect(comparable(pair.next)).toStrictEqual(comparable(pair.shipped));
    }
  });

  test('selects the same fact for each usage', () => {
    for (const row of rows) {
      const pair = factsPair(row);
      for (const usage of ['input-candidate', 'declared-command'] as const) {
        expect(getCommandSyntaxFact(pair.next, usage)?.source).toStrictEqual(
          shippedGetCommandSyntaxFact(pair.shipped, usage)?.source,
        );
      }
    }
  });

  test('the store parses and projects every corpus command identically', () => {
    const store = createSemanticFactStore();
    const shipped = shippedCreateSemanticFactStore();
    for (const source of [...corpusCommands(), ...FIXED_COMMANDS]) {
      for (const dialect of ['posix', 'powershell', 'auto'] as const) {
        expect(store.getCommandProgram(source, dialect)).toStrictEqual(
          shipped.getCommandProgram(source, dialect),
        );
      }
      expect(store.getShellSyntax(source)).toStrictEqual(shipped.getShellSyntax(source));
      const program = store.getCommandProgram(source, 'posix');
      expect(store.getShellSyntax(source, program)).toStrictEqual(
        shipped.getShellSyntax(source, shipped.getCommandProgram(source, 'posix')),
      );
    }
  });

  test('the store rejects a program built from another source the same way', () => {
    const store = createSemanticFactStore();
    const shipped = shippedCreateSemanticFactStore();
    const other = store.getCommandProgram('echo other', 'posix');
    expect(() => store.getShellSyntax('echo mine', other)).toThrowError(
      new TypeError('Shell syntax source does not match command program source.'),
    );
    expect(() => shipped.getShellSyntax('echo mine', other)).toThrowError(
      new TypeError('Shell syntax source does not match command program source.'),
    );
  });

  test('expands the same path variables in sensitive text', () => {
    const environment = createProcessEnvironment();
    const words = [
      ...new Set(
        [...corpusCommands(), ...FIXED_COMMANDS].flatMap((command) => command.split(/\s+/)),
      ),
      '$HOME/.ssh/config',
      '${HOME}/.aws/credentials',
      '$TMPDIR/x',
      '$XDG_CONFIG_HOME/y',
      '${UNSET_VARIABLE:-/fallback}',
      'no-dollar-here',
      '$',
      '$$',
    ];
    for (const word of words) {
      expect(projectSensitiveShellText(word, environment)).toStrictEqual(
        shippedProjectSensitiveShellText(word),
      );
    }
  });

  test('raises the same structural limit error', () => {
    const error = new StructuralShellSyntaxLimitError();
    const shipped = new ShippedStructuralShellSyntaxLimitError();
    expect([error.name, error.message]).toStrictEqual([shipped.name, shipped.message]);
  });
});
