import { describe, expect, test } from 'bun:test';
import {
  copilotBashInput,
  copilotRawToolArgsInput,
  expectNoHookOutput,
  getHookDenyReason,
  runCopilotHook,
} from './hook-helpers';

async function expectStrictDeny(input: object | string, reason: string) {
  const result = await runCopilotHook(input, { SAFETY_NET_STRICT: '1' });
  expect(getHookDenyReason(result, 'copilot-cli')).toContain(reason);
}

async function expectDeny(input: object | string, reason: string) {
  const result = await runCopilotHook(input);
  expect(getHookDenyReason(result, 'copilot-cli')).toContain(reason);
}

describe('Copilot CLI hook', () => {
  describe('blocked commands', () => {
    test('blocks rm -rf via bash tool', async () => {
      const { stdout, exitCode } = await runCopilotHook(copilotBashInput('rm -rf /'));

      expect(exitCode).toBe(0);
      const output = JSON.parse(stdout);
      expect(output.permissionDecision).toBe('deny');
      expect(output.permissionDecisionReason).toContain('rm -rf');
    });
  });

  describe('allowed commands', () => {
    test('allows safe commands (no output)', async () => {
      await expectNoHookOutput(runCopilotHook, copilotBashInput('ls -la'));
    });
  });

  describe('non-target tool', () => {
    test('ignores non-bash tools', async () => {
      const input = {
        timestamp: Date.now(),
        cwd: process.cwd(),
        toolName: 'write_file',
        toolArgs: JSON.stringify({ path: '/etc/passwd' }),
      };

      await expectNoHookOutput(runCopilotHook, input);
    });
  });

  describe('empty stdin', () => {
    test('empty input produces deny output', async () => {
      await expectDeny('', 'Missing hook input JSON.');
    });

    test('whitespace-only input produces deny output', async () => {
      await expectDeny('   \n\t  ', 'Missing hook input JSON.');
    });
  });

  describe('invalid outer JSON', () => {
    test('strict mode blocks invalid outer JSON', async () => {
      await expectStrictDeny('{invalid json', 'Failed to parse hook input JSON.');
    });

    test('non-strict mode blocks invalid outer JSON', async () => {
      await expectDeny('{invalid json', 'Failed to parse hook input JSON.');
    });
  });

  describe('invalid toolArgs', () => {
    test('strict mode blocks invalid toolArgs JSON', async () => {
      await expectStrictDeny(copilotRawToolArgsInput('{invalid'), 'Failed to parse toolArgs JSON.');
    });

    test('non-strict mode blocks invalid toolArgs JSON', async () => {
      await expectDeny(copilotRawToolArgsInput('{invalid'), 'Failed to parse toolArgs JSON.');
    });
  });

  describe('missing command', () => {
    test('missing command in toolArgs produces no output', async () => {
      const input = {
        timestamp: Date.now(),
        cwd: process.cwd(),
        toolName: 'bash',
        toolArgs: JSON.stringify({}),
      };

      await expectNoHookOutput(runCopilotHook, input);
    });

    test('null command in toolArgs produces no output', async () => {
      const input = {
        timestamp: Date.now(),
        cwd: process.cwd(),
        toolName: 'bash',
        toolArgs: JSON.stringify({ command: null }),
      };

      await expectNoHookOutput(runCopilotHook, input);
    });

    test('empty string command in toolArgs produces no output', async () => {
      const input = {
        timestamp: Date.now(),
        cwd: process.cwd(),
        toolName: 'bash',
        toolArgs: JSON.stringify({ command: '' }),
      };

      await expectNoHookOutput(runCopilotHook, input);
    });
  });
});
