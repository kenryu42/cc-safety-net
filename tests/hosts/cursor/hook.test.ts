import { afterEach, beforeEach, expect, test } from 'bun:test';
import { join } from 'node:path';
import { runCursorHook } from '@/hosts/cursor/hook';
import { captureHookRun } from '../../helpers/hook-capture';
import {
  createHookFixture,
  declareRemoteAndPlainCommandTools,
  type HookFixture,
  hostEnv,
} from '../../helpers/hook-hosts';

let fixture: HookFixture;

beforeEach(() => {
  fixture = createHookFixture('next-cursor-hook-');
  declareRemoteAndPlainCommandTools(fixture);
});

afterEach(() => {
  fixture.remove();
});

async function decide(toolName: string, command: string) {
  const captured = await captureHookRun(
    JSON.stringify({
      conversation_id: 'cursor-1',
      hook_event_name: 'preToolUse',
      tool_name: toolName,
      tool_input: { command, working_directory: '/sdcard/Download' },
      cwd: fixture.project,
      workspace_roots: [fixture.project],
    }),
    hostEnv(fixture, join(fixture.home, 'audit')),
    runCursorHook,
  );
  return JSON.parse(captured.stdout[0] as string);
}

test('a tool declared without a cwd argument is not refused for a remote working directory', async () => {
  expect(await decide('phone_shell', 'ls')).toEqual({ permission: 'allow' });
  expect((await decide('phone_shell', 'rm -rf /sdcard/DCIM')).agent_message).toContain(
    'Rule: rm.recursive-force-outside-cwd',
  );
  expect((await decide('ops_shell', 'ls')).agent_message).toContain('Rule: cwd.requested-unusable');
});
