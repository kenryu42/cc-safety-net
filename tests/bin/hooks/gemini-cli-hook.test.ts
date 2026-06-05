import { describe, expect, test } from 'bun:test';
import {
  expectNoHookOutput,
  geminiShellInput,
  getHookDenyReason,
  runGeminiHook,
} from './hook-helpers';

describe('Gemini CLI hook', () => {
  describe('blocked commands', () => {
    test('blocks rm -rf via run_shell_command', async () => {
      const { stdout, exitCode } = await runGeminiHook(geminiShellInput('rm -rf /'));

      expect(exitCode).toBe(0);
      const output = JSON.parse(stdout);
      expect(output.decision).toBe('deny');
      expect(output.reason).toContain('rm -rf');
    });

    test('outputs Gemini format with decision: deny', async () => {
      const { stdout, exitCode } = await runGeminiHook(geminiShellInput('git reset --hard'));

      expect(exitCode).toBe(0);
      const output = JSON.parse(stdout);
      expect(output).toHaveProperty('decision', 'deny');
      expect(output).toHaveProperty('reason');
      expect(output.reason).toContain('git reset --hard');
    });
  });

  describe('allowed commands', () => {
    test('allows safe commands (no output)', async () => {
      await expectNoHookOutput(runGeminiHook, geminiShellInput('ls -la'));
    });
  });

  describe('non-target tool', () => {
    test('ignores non-shell tools', async () => {
      const input = {
        hook_event_name: 'BeforeTool',
        tool_name: 'write_file',
        tool_input: { path: '/etc/passwd' },
      };

      await expectNoHookOutput(runGeminiHook, input);
    });
  });

  describe('non-target event', () => {
    test('ignores non-BeforeTool events', async () => {
      const input = {
        hook_event_name: 'AfterTool',
        tool_name: 'run_shell_command',
        tool_input: { command: 'rm -rf /' },
      };

      await expectNoHookOutput(runGeminiHook, input);
    });
  });

  describe('empty stdin', () => {
    test('empty input produces deny output', async () => {
      const result = await runGeminiHook('');

      expect(getHookDenyReason(result, 'gemini-cli')).toContain('Missing hook input JSON.');
    });

    test('whitespace-only input produces deny output', async () => {
      const result = await runGeminiHook('   \n\t  ');

      expect(getHookDenyReason(result, 'gemini-cli')).toContain('Missing hook input JSON.');
    });
  });

  describe('invalid JSON', () => {
    test('strict mode blocks invalid JSON', async () => {
      const { stdout, exitCode } = await runGeminiHook('{invalid json', {
        SAFETY_NET_STRICT: '1',
      });

      expect(getHookDenyReason({ stdout, stderr: '', exitCode }, 'gemini-cli')).toContain(
        'Failed to parse hook input JSON.',
      );
    });

    test('non-strict mode blocks invalid JSON', async () => {
      const result = await runGeminiHook('{invalid json');

      expect(getHookDenyReason(result, 'gemini-cli')).toContain('Failed to parse hook input JSON.');
    });
  });

  describe('missing command', () => {
    test('missing command in tool_input produces no output', async () => {
      const input = {
        hook_event_name: 'BeforeTool',
        tool_name: 'run_shell_command',
        tool_input: {},
      };

      await expectNoHookOutput(runGeminiHook, input);
    });

    test('null tool_input produces no output', async () => {
      const input = {
        hook_event_name: 'BeforeTool',
        tool_name: 'run_shell_command',
        tool_input: null,
      };

      await expectNoHookOutput(runGeminiHook, input);
    });

    test('missing tool_input produces no output', async () => {
      const input = {
        hook_event_name: 'BeforeTool',
        tool_name: 'run_shell_command',
      };

      await expectNoHookOutput(runGeminiHook, input);
    });
  });
});
