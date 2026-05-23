import { describe, expect, test } from 'bun:test';
import { expectNoHookOutput, kimiShellInput, runKimiHook } from './hook-helpers';

describe('Kimi CLI hook', () => {
  describe('blocked commands', () => {
    test('blocks rm -rf via Shell tool', async () => {
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
    test('ignores non-Shell tools', async () => {
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
        tool_name: 'Shell',
        tool_input: { command: 'rm -rf /' },
      };

      await expectNoHookOutput(runKimiHook, input);
    });
  });

  describe('invalid JSON', () => {
    test('strict mode blocks invalid JSON', async () => {
      const { stdout, exitCode } = await runKimiHook('{invalid json', {
        SAFETY_NET_STRICT: '1',
      });

      expect(exitCode).toBe(0);
      const output = JSON.parse(stdout);
      expect(output.hookSpecificOutput.permissionDecision).toBe('deny');
      expect(output.hookSpecificOutput.permissionDecisionReason).toContain(
        'Failed to parse hook input JSON (strict mode)',
      );
    });

    test('non-strict mode silently ignores invalid JSON', async () => {
      await expectNoHookOutput(runKimiHook, '{invalid json');
    });
  });

  describe('missing command', () => {
    test('missing command in tool_input produces no output', async () => {
      const input = {
        hook_event_name: 'PreToolUse',
        tool_name: 'Shell',
        tool_input: {},
      };

      await expectNoHookOutput(runKimiHook, input);
    });
  });
});
