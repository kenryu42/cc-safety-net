import { describe, expect, test } from 'bun:test';
import { getCommandFromToolInput } from '@/core/tool-input';
import {
  createToolInvocation as createPortedInvocation,
  type ToolCallContext,
  type ToolRoute,
} from '@/gate/invocation';
import { pipelineContractCases } from './pipeline-contract-cases';

const CONTEXT: ToolCallContext = { configCwd: '/srv/config', executionCwd: '/srv/run' };

type Row = {
  toolName: string;
  input: unknown;
  route: ToolRoute;
  context: ToolCallContext;
  command: string | null;
};

function corpusRows(): Row[] {
  return pipelineContractCases({
    workspace: '/srv/work/space',
    repo: '/srv/work/repo',
    home: '/srv/home/tester',
    userPolicyPath: '/srv/home/tester/.cc-safety-net/policy.json',
    userPolicyDir: '/srv/home/tester/.cc-safety-net',
  }).map((row) => ({
    toolName: row.toolName,
    input: row.input,
    route: row.route,
    context: {
      configCwd: '/srv/work/space',
      executionCwd: row.cwd === 'repo' ? '/srv/work/repo' : '/srv/work/space',
    },
    command: getCommandFromToolInput(row.input) ?? null,
  }));
}

const TABLE: readonly Row[] = [
  {
    toolName: 'Bash',
    input: { command: 'git status' },
    route: { kind: 'command', shell: 'posix' },
    context: CONTEXT,
    command: 'git status',
  },
  {
    toolName: 'Bash',
    input: { command: '' },
    route: { kind: 'command', shell: 'posix' },
    context: CONTEXT,
    command: '',
  },
  {
    toolName: 'Bash',
    input: {},
    route: { kind: 'command', shell: 'posix' },
    context: CONTEXT,
    command: null,
  },
  {
    toolName: 'Shell',
    input: { command: 'Remove-Item x' },
    route: { kind: 'command', shell: 'powershell' },
    context: CONTEXT,
    command: 'Remove-Item x',
  },
  {
    toolName: 'run_terminal_cmd',
    input: { command: 'ls' },
    route: { kind: 'command', shell: 'auto' },
    context: CONTEXT,
    command: 'ls',
  },
  {
    toolName: 'Edit',
    input: { file_path: '/etc/hosts' },
    route: { kind: 'path' },
    context: CONTEXT,
    command: null,
  },
  {
    toolName: 'ApplyPatch',
    input: { patch: '*** Begin Patch' },
    route: { kind: 'patch' },
    context: CONTEXT,
    command: null,
  },
  {
    toolName: 'Grep',
    input: { pattern: 'AWS_SECRET' },
    route: { kind: 'grep' },
    context: CONTEXT,
    command: 'grep AWS_SECRET',
  },
  {
    toolName: 'Glob',
    input: { pattern: '**/*.pem' },
    route: { kind: 'glob' },
    context: CONTEXT,
    command: null,
  },
  {
    toolName: 'custom_runner',
    input: { command: 'rm -rf /' },
    route: { kind: 'unknown' },
    context: CONTEXT,
    command: 'rm -rf /',
  },
  {
    toolName: '',
    input: undefined,
    route: { kind: 'unknown' },
    context: { configCwd: '', executionCwd: '' },
    command: null,
  },
  {
    toolName: 'Bash',
    input: null,
    route: { kind: 'command', shell: 'posix' },
    context: CONTEXT,
    command: null,
  },
  {
    toolName: 'Bash',
    input: 'raw string input',
    route: { kind: 'command', shell: 'posix' },
    context: CONTEXT,
    command: null,
  },
  {
    toolName: 'Bash',
    input: ['a', 'b'],
    route: { kind: 'command', shell: 'posix' },
    context: CONTEXT,
    command: 'a b',
  },
  {
    toolName: 'Bash',
    input: { command: { nested: true } },
    route: { kind: 'command', shell: 'posix' },
    context: CONTEXT,
    command: null,
  },
];

function expectInvocation(row: Row) {
  const invocation = createPortedInvocation(
    row.toolName,
    row.input,
    row.route,
    row.context,
    row.command,
  );

  expect(invocation.toolName).toBe(row.toolName);
  expect(invocation.input).toBe(row.input);
  expect(invocation.route).toBe(row.route);
  expect(invocation.context).toBe(row.context);
  expect(Object.keys(invocation).sort()).toEqual(
    row.route.kind === 'command'
      ? ['command', 'context', 'input', 'route', 'toolName']
      : ['context', 'input', 'route', 'toolName'],
  );
  if ('command' in invocation) expect(invocation.command).toBe(row.command);
}

describe('ported tool invocation', () => {
  test('carries every corpus payload through unchanged', () => {
    const rows = corpusRows();
    expect(rows.length).toBeGreaterThan(10);
    rows.forEach(expectInvocation);
  });

  test('keeps the command text for a command route and drops it for every other', () => {
    expect(TABLE.some((row) => row.route.kind !== 'command' && row.command !== null)).toBeTrue();
    TABLE.forEach(expectInvocation);
  });
});
