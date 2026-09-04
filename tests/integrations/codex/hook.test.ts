import { describe, expect, test } from 'bun:test';
import { readLatestAuditLogEntry } from '../../helpers';
import { withHookTestContext } from '../hook-helpers';

describe('Codex hook', () => {
  test('blocks a destructive Bash command and records the native agent', async () => {
    await withHookTestContext(async (context) => {
      const sessionId = 'codex-native-hook';
      const result = await context.runCli(
        ['hook', '--codex'],
        JSON.stringify({
          hook_event_name: 'PreToolUse',
          session_id: sessionId,
          cwd: context.cwd,
          tool_name: 'Bash',
          tool_input: { command: 'git reset --hard' },
        }),
      );

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe('');
      expect(JSON.parse(result.stdout).hookSpecificOutput).toMatchObject({
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
      });
      expect(readLatestAuditLogEntry(context.home, sessionId)).toMatchObject({
        agent: 'codex',
        decision: 'deny',
      });
    });
  });
});
