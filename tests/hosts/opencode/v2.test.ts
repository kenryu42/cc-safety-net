import { afterEach, beforeEach, expect, jest, test } from 'bun:test';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { CommandDefinition } from '@opencode/plugin/effect/command';
import type { Context } from '@opencode/plugin/effect/plugin';
import type { ShellHooks } from '@opencode/plugin/effect/shell';
import type { ToolHooks } from '@opencode/plugin/effect/tool';
import { Agent } from '@opencode/schema/agent';
import { AbsolutePath } from '@opencode/schema/schema';
import { Session } from '@opencode/schema/session';
import { SessionMessage } from '@opencode/schema/session-message';
import { Tool } from '@opencode/schema/tool';
import { Effect } from 'effect';
import { createOpenCodeV2Plugin } from '@/hosts/opencode/v2';
import { createHookFixture, type HookFixture } from '../../helpers/hook-hosts';
import { captureInProcessCall } from '../../helpers/in-process';

let fixture: HookFixture;
beforeEach(() => {
  fixture = createHookFixture('opencode-v2-');
  mkdirSync(join(fixture.project, '.git'), { recursive: true });
});
afterEach(() => fixture.remove());

function host(options: Context['options'] = {}, existingCommands: string[] = []) {
  const tools: Array<(event: ToolHooks['execute.before']) => Effect.Effect<void, Tool.Error>> = [];
  const shells: Array<(event: ShellHooks['create.before']) => Effect.Effect<void>> = [];
  const commands: CommandDefinition[] = [];
  const prompts: Array<Parameters<Context['session']['prompt']>[0]> = [];
  return {
    tools,
    shells,
    commands,
    prompts,
    register: createOpenCodeV2Plugin().effect({
      location: { directory: AbsolutePath.make(fixture.project) },
      options,
      tool: {
        hook: (_name, callback) =>
          Effect.sync(() => {
            tools.push(callback);
            return { dispose: Effect.void };
          }),
      },
      shell: {
        hook: (_name, callback) =>
          Effect.sync(() => {
            shells.push(callback);
            return { dispose: Effect.void };
          }),
      },
      command: {
        list: () =>
          Effect.succeed({
            data: existingCommands.map((name) => ({ name })),
            location: { directory: AbsolutePath.make(fixture.project) },
          }),
        transform: (callback) =>
          Effect.sync(() => {
            callback({ add: (command) => commands.push(command) });
            return { dispose: Effect.void };
          }),
      },
      session: {
        prompt: (input) =>
          Effect.suspend(() => {
            prompts.push(input);
            return Effect.fail('test prompt result');
          }),
      },
    }),
  };
}

function event(tool: string, input: unknown): ToolHooks['execute.before'] {
  return {
    tool,
    input,
    sessionID: Session.ID.make('ses_v2-test'),
    agent: Agent.ID.make('build'),
    messageID: SessionMessage.ID.make('msg_v2-test'),
    id: Tool.CallID.make('call_v2-test'),
  };
}

function callTool(runtime: ReturnType<typeof host>, tool: string, input: unknown) {
  return captureInProcessCall(fixture, {}, () =>
    Effect.runPromise(
      Effect.scoped(
        runtime.register.pipe(
          Effect.andThen(() => Effect.forEach(runtime.tools, (hook) => hook(event(tool, input)))),
          Effect.as('executed'),
          Effect.catchTag('Tool.Error', (error) => Effect.succeed(error)),
        ),
      ),
    ),
  );
}

test.each([
  ['shell', { command: 'git reset --hard' }, 'git.reset-hard'],
  ['shell', { command: 'git status', workdir: 'missing' }, 'Working directory: missing'],
  ['shell', { command: 'git status', workdir: '~other' }, 'Working directory: ~other'],
  ['shell', { command: 'x'.repeat(1_048_577) }, 'limit exceeded'],
  ['read', { path: '~/.ssh/id_rsa' }, 'secret.home.ssh'],
  ['write', { path: '~/.cc-safety-net/policy.json', content: '{}' }, 'protected policy'],
  [
    'patch',
    { patchText: '*** Begin Patch\n*** Delete File: .git/hooks/pre-commit\n*** End Patch' },
    'git',
  ],
  [
    'opencode_worktree_remove',
    { directory: '../feature', force: true },
    'git.worktree-remove-force',
  ],
] as const)(
  'v2 blocks %s with a typed tool error before any side effect',
  async (tool, input, reason) => {
    const result = await callTool(host(), tool, input);
    expect(result.returned).toBeInstanceOf(Tool.Error);
    expect(result.returned instanceof Tool.Error ? result.returned.message : '').toContain(reason);
    expect(result.entries[0]?.entry).toMatchObject({ sessionId: 'ses_v2-test', decision: 'deny' });
  },
);

test('v2 records effective cwd', async () => {
  const runtime = host();
  const result = await callTool(runtime, 'shell', { command: 'git status', workdir: 'sub' });
  expect(result.returned).toBe('executed');
  expect(result.entries).toHaveLength(1);
  expect(result.entries[0]?.entry).toMatchObject({
    cwd: join(fixture.project, 'sub'),
    toolName: 'shell',
  });
  expect(runtime.commands.map((command) => command.name)).toEqual(['cc-safety-net']);
});

test('v2 analyzes a ~ workdir in the home directory, not <project>/~', async () => {
  mkdirSync(join(fixture.project, '~'));
  const result = await callTool(host(), 'shell', { command: 'rm -rf build', workdir: '~' });
  expect(result.returned).toBeInstanceOf(Tool.Error);
  expect(result.returned instanceof Tool.Error ? result.returned.message : '').toContain(
    'rm.recursive-force-home-cwd',
  );
  expect(result.entries[0]?.entry).toMatchObject({ cwd: fixture.home, decision: 'deny' });
});

test.each([
  ['~', () => fixture.home],
  ['~/', () => fixture.home],
  ['~/.codex', () => join(fixture.home, '.codex')],
] as const)('v2 resolves %s under the home directory like the host', async (workdir, expected) => {
  const result = await callTool(host(), 'shell', { command: 'git status', workdir });
  expect(result.returned).toBe('executed');
  expect(result.entries[0]?.entry).toMatchObject({ cwd: expected(), decision: 'allow' });
});

test.each([{ directory: '../feature' }, { directory: '../feature', force: false }])(
  'v2 leaves an unforced worktree removal %p to the host',
  async (input) => {
    const result = await callTool(host(), 'opencode_worktree_remove', input);
    expect(result.returned).toBe('executed');
  },
);

test('v2 lets a forced removal of a temp-root worktree outside the workspace through, like the shell form', async () => {
  const worktree = mkdtempSync(join(tmpdir(), 'opencode-v2-worktree-'));
  const result = await callTool(host(), 'opencode_worktree_remove', {
    directory: worktree,
    force: true,
  });
  rmSync(worktree, { recursive: true });
  expect(result.returned).toBe('executed');
  expect(result.entries[0]?.entry).toMatchObject({ decision: 'allow' });
});

test('v2 only grants command capability to the exact shell name', async () => {
  const result = await callTool(host(), 'custom_shell', { command: 'git reset --hard' });
  expect(result.returned).toBe('executed');
  expect(result.entries).toEqual([]);
});

test('PowerShell relative Git metadata moves are blocked without auto-detection', async () => {
  const result = await callTool(host({ shell: 'powershell' }), 'shell', {
    command: 'mv .\\.git .\\git-backup',
  });
  expect(result.returned).toBeInstanceOf(Tool.Error);
  expect(result.returned instanceof Tool.Error ? result.returned.message : '').toContain('BLOCKED');
});

function createShell(shell: string, env: Record<string, string | undefined> = {}) {
  const runtime = host({ shell: 'posix' });
  return Effect.runPromise(
    Effect.scoped(
      runtime.register.pipe(
        Effect.andThen(() =>
          Effect.forEach(runtime.shells, (hook) =>
            hook({ shell, command: 'echo safe', cwd: fixture.project, timeout: 1000, env }),
          ),
        ),
        Effect.as('created'),
      ),
    ),
  );
}

test.each(['/bin/fish', '/bin/pwsh', 'cmd.exe'])(
  'a POSIX adapter rejects actual shell %s before spawn',
  async (shell) => {
    await expect(createShell(shell)).rejects.toThrow('shell');
  },
);

test('a POSIX adapter checks and creates a real bash, Git Bash on Windows', async () => {
  const bash =
    process.platform === 'win32'
      ? join(process.env.ProgramFiles ?? 'C:\\Program Files', 'Git', 'bin', 'bash.exe')
      : '/bin/bash';
  expect(await createShell(bash, process.env)).toBe('created');
}, 30_000);

function writeShellStub() {
  const shell = join(fixture.root, 'ash');
  writeFileSync(
    shell,
    `#!/bin/sh\ntrap '' TERM\nprintf . >> "$SHELL_CHECK_LOG"\n[ -z "$SHELL_CHECK_HANG" ] || exec sleep 30\nexec /bin/sh "$@"\n`,
    { mode: 0o755 },
  );
  return shell;
}

test.skipIf(process.platform === 'win32')(
  'a POSIX adapter checks an unfamiliar POSIX shell once, then creates it',
  async () => {
    const shell = writeShellStub();
    const checks = join(fixture.root, 'shell-checks.log');
    const env = { SHELL_CHECK_LOG: checks };
    expect(await Promise.all([createShell(shell, env), createShell(shell, env)])).toEqual([
      'created',
      'created',
    ]);
    expect(await createShell(shell, env)).toBe('created');
    expect(readFileSync(checks, 'utf8')).toBe('.');
  },
);

test.skipIf(process.platform === 'win32')(
  'a POSIX adapter stops a shell check at its deadline and checks again next time',
  async () => {
    const shell = writeShellStub();
    const checks = join(fixture.root, 'shell-checks.log');
    jest.useFakeTimers();
    const stalled = createShell(shell, { SHELL_CHECK_LOG: checks, SHELL_CHECK_HANG: '1' });
    Array.from({ length: 500 }).some(() => existsSync(checks) || Bun.sleepSync(10));
    jest.advanceTimersByTime(10_000);
    jest.useRealTimers();
    await expect(stalled).rejects.toThrow('shell');
    expect(await createShell(shell, { SHELL_CHECK_LOG: checks })).toBe('created');
    expect(readFileSync(checks, 'utf8')).toBe('..');
  },
);

test.skipIf(process.platform === 'win32')(
  'a POSIX adapter rejects a shell named bash that does not run POSIX syntax',
  async () => {
    const shell = join(fixture.root, 'bash');
    symlinkSync('/usr/bin/false', shell);
    await expect(createShell(shell)).rejects.toThrow('shell');
  },
);

test('the v2 command forwards arguments, attachments, session, and queued delivery', async () => {
  const runtime = host();
  await Effect.runPromise(Effect.scoped(runtime.register));
  const command = runtime.commands[0];
  if (!command) throw new Error('command was not registered');
  await Effect.runPromise(
    command
      .execute({
        sessionID: Session.ID.make('ses_command'),
        prompt: { text: 'explain the last block', files: [{ uri: 'file:///project/notes.md' }] },
        delivery: 'queue',
      })
      .pipe(Effect.flip),
  );
  expect(runtime.prompts).toEqual([
    {
      sessionID: Session.ID.make('ses_command'),
      delivery: 'queue',
      text: expect.stringContaining('# CC Safety Net'),
      files: [{ uri: 'file:///project/notes.md' }],
    },
  ]);
  expect(runtime.prompts[0]?.text).toEndWith('explain the last block');
});

test('a user command already present at load is not replaced', async () => {
  const runtime = host({}, ['cc-safety-net']);
  await Effect.runPromise(Effect.scoped(runtime.register));
  expect(runtime.commands).toEqual([]);
  expect(runtime.tools).toHaveLength(1);
});

test('an invalid configured dialect fails initialization explicitly', async () => {
  const runtime = host({ shell: 'cmd' });
  await expect(Effect.runPromise(Effect.scoped(runtime.register))).rejects.toThrow(
    'posix or powershell',
  );
  expect(runtime.tools).toEqual([]);
});
