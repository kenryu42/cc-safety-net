import { describe, expect, test } from 'bun:test';
import { expectNoHookOutput, getHookDenyReason, kimiShellInput, runKimiHook } from './hook-helpers';

describe('Kimi Code hook', () => {
  describe('blocked commands', () => {
    test('blocks rm -rf via Bash tool', async () => {
      const { stdout, exitCode } = await runKimiHook(kimiShellInput('rm -rf /'));

      expect(exitCode).toBe(0);
      const output = JSON.parse(stdout);
      expect(output.hookSpecificOutput.hookEventName).toBe('PreToolUse');
      expect(output.hookSpecificOutput.permissionDecision).toBe('deny');
      expect(output.hookSpecificOutput.permissionDecisionReason).toContain('rm -rf');
    });
  });

  describe('allowed commands', () => {
    test('allows safe commands with no output', async () => {
      await expectNoHookOutput(runKimiHook, kimiShellInput('git status'));
    });
  });

  describe('non-target tool', () => {
    test('ignores non-Bash tools', async () => {
      const input = {
        hook_event_name: 'PreToolUse',
        tool_name: 'ReadFile',
        tool_input: { file_path: '/etc/passwd' },
      };

      await expectNoHookOutput(runKimiHook, input);
    });
  });

  describe('non-target event', () => {
    test('ignores non-PreToolUse events', async () => {
      const input = {
        hook_event_name: 'PostToolUse',
        tool_name: 'Bash',
        tool_input: { command: 'rm -rf /' },
      };

      await expectNoHookOutput(runKimiHook, input);
    });
  });

  describe('invalid JSON', () => {
    test('empty input produces deny output', async () => {
      const result = await runKimiHook('');

      expect(getHookDenyReason(result, 'kimi-code')).toContain('Missing hook input JSON.');
    });

    test('whitespace-only input produces deny output', async () => {
      const result = await runKimiHook('   \n\t  ');

      expect(getHookDenyReason(result, 'kimi-code')).toContain('Missing hook input JSON.');
    });

    test('strict mode blocks invalid JSON', async () => {
      const { stdout, exitCode } = await runKimiHook('{invalid json', {
        SAFETY_NET_STRICT: '1',
      });

      expect(getHookDenyReason({ stdout, stderr: '', exitCode }, 'kimi-code')).toContain(
        'Failed to parse hook input JSON.',
      );
    });

    test('non-strict mode blocks invalid JSON', async () => {
      const result = await runKimiHook('{invalid json');

      expect(getHookDenyReason(result, 'kimi-code')).toContain('Failed to parse hook input JSON.');
    });
  });

  describe('missing command', () => {
    test('missing command in tool_input produces no output', async () => {
      const input = {
        hook_event_name: 'PreToolUse',
        tool_name: 'Bash',
        tool_input: {},
      };

      await expectNoHookOutput(runKimiHook, input);
    });
  });
});
