import { afterEach, beforeEach, expect, test } from 'bun:test';
import { mkdirSync, realpathSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createCwdDenial, createFailedClosedDenial, formatDenial } from '@/core/denial';
import {
  createDeepSeekHarnessGuardHandler,
  registerDeepSeekHarnessGuard,
} from '@/hosts/deepseek-harness/guard';
import { createHookFixture, type HookFixture } from '../../helpers/hook-hosts';
import {
  captureInProcessCall,
  describeDifferential,
  expectFallbackDeny,
} from '../../helpers/in-process';

const SESSION = 'dsh-session-1';
const ANALYZER_FAILURE = 'injected analyzer failure';
const EXECUTION_FAILURE = 'injected execution failure';
const HOME_DELETE_RULE = 'Rule: powershell.remove-item-recursive-force-root-or-home';
const HOME_CWD_DELETE_RULE = 'Rule: rm.recursive-force-home-cwd';
const MALFORMED_RULE = 'Rule: tool-call.malformed';
const FAILED_CLOSED_RULE = 'Rule: analysis.failed-closed';
const cwdReason = (directory: 'session' | 'requested') =>
  createCwdDenial({ directory, problem: 'unusable', cwd: '' }).reason;

type Row = {
  name: string;
  execution: (fixture: HookFixture) => unknown;
  launchCwd?: (fixture: HookFixture) => string;
  breaks?: true;
  env?: Record<string, string | undefined>;
  contains?: string;
  blocked: boolean;
  lines: number;
};

const tool =
  (name: string, args: unknown, sessionCwd = (fixture: HookFixture) => fixture.project) =>
  (fixture: HookFixture) => ({
    name,
    arguments: typeof args === 'function' ? args(fixture) : args,
    agent: { session: { header: { id: SESSION, cwd: sessionCwd(fixture) } } },
  });

const ROWS: readonly Row[] = [
  {
    name: 'a destructive bash command',
    execution: tool('bash', { command: 'git push --force origin main', description: 'push' }),
    contains: 'BLOCKED by CC Safety Net',
    blocked: true,
    lines: 1,
  },
  {
    name: 'a safe bash command recorded as an allow',
    execution: tool('bash', { command: 'git status', description: 'status' }),
    blocked: false,
    lines: 1,
  },
  {
    name: 'a pwsh deletion of the home directory',
    execution: tool('pwsh', { command: 'Remove-Item -Recurse -Force $HOME' }),
    contains: HOME_DELETE_RULE,
    blocked: true,
    lines: 1,
  },
  {
    name: 'a pwsh deletion after an assignment to the read-only $HOME',
    execution: tool('pwsh', {
      command: "$home = 'D:\\temp'\nRemove-Item -Recurse -Force $home",
    }),
    contains: HOME_DELETE_RULE,
    blocked: true,
    lines: 1,
  },
  {
    name: 'a recursive deletion inside the session workspace',
    execution: tool('bash', { command: 'rm -rf build' }),
    blocked: false,
    lines: 1,
  },
  {
    name: 'the same deletion from a workdir in the home directory',
    execution: tool('bash', (fixture: HookFixture) => ({
      command: 'rm -rf build',
      workdir: fixture.home,
    })),
    contains: HOME_CWD_DELETE_RULE,
    blocked: true,
    lines: 1,
  },
  {
    name: 'a workdir inside the workspace',
    execution: tool('bash', { command: 'git status', workdir: 'sub' }),
    blocked: false,
    lines: 1,
  },
  {
    name: 'a workdir that does not exist',
    execution: tool('bash', { command: 'git status', workdir: 'missing' }),
    contains: cwdReason('requested'),
    blocked: true,
    lines: 1,
  },
  {
    name: 'a blank workdir',
    execution: tool('bash', { command: 'git status', workdir: '' }),
    contains: MALFORMED_RULE,
    blocked: true,
    lines: 1,
  },
  {
    name: 'bash arguments that are not an object',
    execution: tool('bash', 'git status'),
    contains: MALFORMED_RULE,
    blocked: true,
    lines: 1,
  },
  {
    name: 'a bash call with a blank command',
    execution: tool('bash', { command: '   ' }),
    contains: MALFORMED_RULE,
    blocked: true,
    lines: 1,
  },
  {
    name: 'a read of a private key',
    execution: tool('read', (fixture: HookFixture) => ({
      file_path: join(fixture.home, '.ssh', 'id_rsa'),
    })),
    contains: 'Rule: secret.home.ssh',
    blocked: true,
    lines: 1,
  },
  {
    name: 'a read of a file in the project',
    execution: tool('read', { file_path: 'README.md' }),
    blocked: false,
    lines: 0,
  },
  {
    name: 'an execution that is null',
    execution: () => null,
    contains: FAILED_CLOSED_RULE,
    blocked: true,
    lines: 0,
  },
  {
    name: 'an execution without a tool name',
    execution: tool('', { command: 'git status' }),
    contains: MALFORMED_RULE,
    blocked: true,
    lines: 1,
  },
  {
    name: 'a call outside any agent session runs from the launch directory',
    execution: () => ({ name: 'bash', arguments: { command: 'rm -rf build' } }),
    launchCwd: (fixture) => fixture.home,
    contains: HOME_CWD_DELETE_RULE,
    blocked: true,
    lines: 0,
  },
  {
    name: 'a session directory that is a regular file',
    execution: tool('bash', { command: 'git status' }, (fixture) => fixture.file),
    contains: cwdReason('session'),
    blocked: true,
    lines: 1,
  },
  {
    name: 'an analyzer that fails on a command',
    execution: tool('bash', { command: 'echo analyzed' }),
    breaks: true,
    contains: 'Command: echo analyzed',
    blocked: true,
    lines: 1,
  },
  {
    name: 'an analyzer that fails with debug output on',
    execution: tool('bash', { command: 'echo analyzed' }),
    breaks: true,
    env: { CC_SAFETY_NET_DEBUG: '1' },
    blocked: true,
    lines: 1,
  },
];

let fixture: HookFixture;

beforeEach(() => {
  fixture = createHookFixture('next-deepseek-harness-');
});

afterEach(() => {
  fixture.remove();
});

function runRow(row: Row) {
  const handler = createDeepSeekHarnessGuardHandler({
    guardDependencies: row.breaks
      ? {
          analyzeCommand: () => {
            throw new Error(ANALYZER_FAILURE);
          },
        }
      : undefined,
  });
  return captureInProcessCall(fixture, row.env ?? {}, () =>
    handler(row.execution(fixture), (row.launchCwd ?? ((current) => current.project))(fixture)),
  );
}

describeDifferential('one DeepSeek Harness tool execution', ROWS, runRow, (row, outcome) => {
  expect(outcome.entries).toHaveLength(row.lines);
  expect(outcome.returned ?? '').toContain(row.contains ?? '');
  expect(outcome.returned === undefined).toBe(!row.blocked);
  if (row.env?.CC_SAFETY_NET_DEBUG === '1') {
    expect(outcome.stderr).toStrictEqual([
      `CC Safety Net debug: deepseek-harness tool guard analysis failed: ${ANALYZER_FAILURE}`,
    ]);
  }
  if (row.name === 'a safe bash command recorded as an allow') {
    expect(outcome.entries[0]?.entry).toMatchObject({
      decision: 'allow',
      agent: 'deepseek-harness',
      command: 'git status',
      cwd: realpathSync(fixture.project),
      sessionId: SESSION,
    });
  }
  if (row.name === 'an execution without a tool name') {
    expect(outcome.entries[0]?.entry).toMatchObject({
      decision: 'deny',
      agent: 'deepseek-harness',
      cwd: realpathSync(fixture.project),
      ruleId: 'tool-call.malformed',
      sessionId: SESSION,
    });
  }
});

function declareOpsBash() {
  const rules = join(fixture.home, '.cc-safety-net', 'rules');
  mkdirSync(rules, { recursive: true });
  writeFileSync(
    join(rules, 'rule.json'),
    JSON.stringify({ version: 1, command_tools: ['ops_bash'] }),
  );
}

test('a tool the user declared as a command tool is blocked and audited like bash', async () => {
  declareOpsBash();
  const handle = createDeepSeekHarnessGuardHandler();
  const decided = await captureInProcessCall(fixture, {}, () => [
    handle(tool('ops_bash', { command: 'git push --force origin main' })(fixture), fixture.project),
    handle(tool('ops_bash', { command: 'git status' })(fixture), fixture.project),
  ]);
  expect(decided.returned?.[0]).toContain('Rule: git.push-force');
  expect(decided.returned?.[1]).toBeUndefined();
  expect(decided.stderr).toStrictEqual([]);
  expect(decided.entries.map((line) => line.entry)).toMatchObject([
    { decision: 'deny', toolName: 'ops_bash', command: 'git push --force origin main' },
    {
      decision: 'allow',
      toolName: 'ops_bash',
      command: 'git status',
      cwd: realpathSync(fixture.project),
      sessionId: SESSION,
    },
  ]);
});

test('a declared command tool with a blank workdir is denied as malformed', async () => {
  declareOpsBash();
  const decided = await captureInProcessCall(fixture, {}, () =>
    createDeepSeekHarnessGuardHandler()(
      tool('ops_bash', { command: 'git status', workdir: '' })(fixture),
      fixture.project,
    ),
  );
  expect(decided.returned).toContain(MALFORMED_RULE);
  expect(decided.stderr).toStrictEqual([]);
  expect(decided.entries.map((line) => line.entry)).toMatchObject([
    { decision: 'deny', toolName: 'ops_bash', ruleId: 'tool-call.malformed' },
  ]);
});

type PostExecuteDecision = {
  kind: 'accept' | 'block';
  feedback?: unknown[];
  additionalContexts?: unknown[];
};
type PostExecuteListener = (
  execution: unknown,
  result: unknown,
  next: () => Promise<PostExecuteDecision>,
) => Promise<PostExecuteDecision>;

function registerOnFakeHarness() {
  const guards: ((execution: unknown) => string | undefined)[] = [];
  const postExecute: PostExecuteListener[] = [];
  registerDeepSeekHarnessGuard({
    tools: {
      guard: (guard) => {
        guards.push(guard);
        return () => {};
      },
    },
    on: (event, listener) => {
      if (event === 'tools/post-execute') postExecute.push(listener);
      return () => {};
    },
  });
  return { guards, postExecute };
}

const OTHER_SESSION = 'dsh-session-2';
const inSession = (session: string, name: string, args: unknown) => (current: HookFixture) => ({
  name,
  arguments: args,
  agent: { session: { header: { id: session, cwd: current.project } } },
});

const undeclaredNote = (name: string, profilesDir: string) =>
  `CC Safety Net did not check the command \`${name}\` just ran. It checks a plugin's shell tool only after the tool is declared. First find out where \`${name}\` runs its commands: check its tool description, and if that doesn't say, read its plugin's source under \`${profilesDir}/<profile>/node_modules\`. If it runs them on this machine, declare it with \`npx -y cc-safety-net rule tool add ${name}\`. Add \`--cwd-arg <name>\` if it takes its working directory in an argument other than \`workdir\`, \`cwd\` or \`working_directory\`. Don't test the declaration by running a destructive command; \`npx -y cc-safety-net rule tool list\` confirms it. If it runs them somewhere else, such as a remote host, or you can't tell, don't declare it. Either way, tell the user what you found and what you did.`;

async function postExecuteAll(
  executions: ((current: HookFixture) => unknown)[],
  downstream: PostExecuteDecision = { kind: 'accept' },
) {
  const { postExecute } = registerOnFakeHarness();
  const [listener] = postExecute;
  expect(postExecute).toHaveLength(1);
  const decided = await captureInProcessCall(fixture, { DSH_HOME: undefined }, async () => {
    const decisions: PostExecuteDecision[] = [];
    for (const execution of executions) {
      decisions.push(
        (await listener?.(execution(fixture), {}, async () => downstream)) ?? { kind: 'block' },
      );
    }
    return decisions;
  });
  expect(decided.thrown).toBeUndefined();
  expect(decided.stderr).toStrictEqual([]);
  return decided.returned ?? [];
}

test('registering installs one tool guard that denies with the formatted reason', async () => {
  const { guards } = registerOnFakeHarness();
  const [guard] = guards;

  expect(guards).toHaveLength(1);
  const decided = await captureInProcessCall(fixture, {}, () => [
    guard?.(tool('bash', { command: 'git reset --hard' })(fixture)),
    guard?.(tool('bash', { command: 'git status' })(fixture)),
  ]);
  expect(decided.returned?.[0]).toContain('Rule: git.reset-hard');
  expect(decided.returned?.[1]).toBeUndefined();
});

test('an undeclared shell tool tells the model once per session to have it declared', async () => {
  const opsBash = { command: 'git reset --hard' };
  const decisions = await postExecuteAll([
    inSession(SESSION, 'ops_bash', opsBash),
    inSession(SESSION, 'ops_bash', opsBash),
    inSession(OTHER_SESSION, 'ops_bash', opsBash),
  ]);
  const notice = {
    role: 'user',
    content: [
      { type: 'text', text: undeclaredNote('ops_bash', join(fixture.home, '.dsh', 'profiles')) },
    ],
    source: {
      kind: 'cc-safety-net',
      form: 'notice',
      summary: 'ops_bash commands are not checked',
    },
  };
  expect(decisions).toMatchObject([
    { kind: 'accept', additionalContexts: [notice] },
    { kind: 'accept' },
    { kind: 'accept', additionalContexts: [notice] },
  ]);
  expect(decisions[1]?.additionalContexts).toBeUndefined();
  expect(decisions[0]?.additionalContexts?.[0]).toHaveProperty('id', expect.any(String));
});

test('the notice rides ahead of the downstream contexts on accept and block', async () => {
  const theirs = { role: 'user', content: [], source: { kind: 'repeat-tool-reminder' } };
  const accepted = await postExecuteAll([inSession(SESSION, 'ops_bash', { command: 'ls' })], {
    kind: 'accept',
    additionalContexts: [theirs],
  });
  const blocked = await postExecuteAll([inSession(SESSION, 'ops_bash', { command: 'ls' })], {
    kind: 'block',
    feedback: [{ type: 'text', text: 'stop' }],
    additionalContexts: [theirs],
  });
  const ours = { source: { kind: 'cc-safety-net', form: 'notice' } };
  expect(accepted).toMatchObject([{ kind: 'accept', additionalContexts: [ours, theirs] }]);
  expect(blocked).toMatchObject([
    {
      kind: 'block',
      feedback: [{ type: 'text', text: 'stop' }],
      additionalContexts: [ours, theirs],
    },
  ]);
});

test('checked tools and tools without a command get no notice', async () => {
  declareOpsBash();
  const decisions = await postExecuteAll([
    inSession(SESSION, 'ops_bash', { command: 'git status' }),
    inSession(SESSION, 'bash', { command: 'git status' }),
    inSession(SESSION, 'pwsh', { command: 'Get-ChildItem' }),
    inSession(SESSION, 'write', { file_path: 'a.txt', content: 'x', command: 'x' }),
    inSession(SESSION, 'web_fetch', { url: 'https://example.com' }),
    inSession(SESSION, 'ops_run', { command: '   ' }),
  ]);
  expect(decisions).toStrictEqual(Array.from({ length: 6 }, () => ({ kind: 'accept' })));
});

test('a session without a cwd reads the tool declaration from the launch directory', async () => {
  const withoutCwd = (session: string) => () => ({
    name: 'ops_bash',
    arguments: { command: 'git status' },
    agent: { session: { header: { id: session } } },
  });
  const launchCwd = process.cwd();
  process.chdir(fixture.project);
  const undeclared = await postExecuteAll([withoutCwd(SESSION)]).finally(() =>
    process.chdir(launchCwd),
  );
  const rules = join(fixture.project, '.cc-safety-net', 'rules');
  mkdirSync(rules, { recursive: true });
  writeFileSync(
    join(rules, 'rule.json'),
    JSON.stringify({ version: 1, command_tools: ['ops_bash'] }),
  );
  process.chdir(fixture.project);
  const declared = await postExecuteAll([withoutCwd(OTHER_SESSION)]).finally(() =>
    process.chdir(launchCwd),
  );
  expect(undeclared).toMatchObject([
    { kind: 'accept', additionalContexts: [{ source: { kind: 'cc-safety-net' } }] },
  ]);
  expect(declared).toStrictEqual([{ kind: 'accept' }]);
});

test('an execution that throws passes the downstream decision through untouched', async () => {
  const hostile = () => ({
    name: 'ops_bash',
    get arguments(): unknown {
      throw new Error(EXECUTION_FAILURE);
    },
    agent: { session: { header: { id: SESSION, cwd: fixture.project } } },
  });
  const decisions = await postExecuteAll([hostile, () => null], {
    kind: 'block',
    feedback: [],
  });
  expect(decisions).toStrictEqual([
    { kind: 'block', feedback: [] },
    { kind: 'block', feedback: [] },
  ]);
});

test('an execution that throws blocks instead of escaping the guard', async () => {
  const hostile = {
    name: 'bash',
    get arguments(): unknown {
      throw new Error(EXECUTION_FAILURE);
    },
  };
  expectFallbackDeny(
    await captureInProcessCall(fixture, {}, () =>
      createDeepSeekHarnessGuardHandler()(hostile, fixture.project),
    ),
    { denial: formatDenial(createFailedClosedDenial()), failure: EXECUTION_FAILURE },
  );
});
