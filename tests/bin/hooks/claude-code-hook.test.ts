import { describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  claudeCodeBashInput,
  expectNoHookOutput,
  runClaudeCodeHook,
  TEST_HOOK_CWD,
} from './hook-helpers';

describe('Claude Code hook', () => {
  describe('blocked commands', () => {
    test('blocked command produces correct JSON structure', async () => {
      const { stdout, exitCode } = await runClaudeCodeHook(claudeCodeBashInput('git reset --hard'));

      const parsed = JSON.parse(stdout);
      expect(exitCode).toBe(0);
      expect(parsed.hookSpecificOutput).toBeDefined();
      expect(parsed.hookSpecificOutput.hookEventName).toBe('PreToolUse');
      expect(parsed.hookSpecificOutput.permissionDecision).toBe('deny');
      expect(parsed.hookSpecificOutput.permissionDecisionReason).toContain(
        'BLOCKED by CC SafetyNet',
      );
      expect(parsed.hookSpecificOutput.permissionDecisionReason).toContain('git reset --hard');
    });

    test('policy fail-closed denial shows repair command without manual permission footer', async () => {
      rmSync(join(TEST_HOOK_CWD, '.cc-safetynet-rules'), { recursive: true, force: true });
      mkdirSync(join(TEST_HOOK_CWD, '.cc-safetynet-rules'), { recursive: true });
      writeFileSync(
        join(TEST_HOOK_CWD, '.cc-safetynet-rules', 'rule.json'),
        JSON.stringify({ version: 1, rules: ['project-rules'], overrides: {} }),
        'utf-8',
      );

      const result = await runClaudeCodeHook(claudeCodeBashInput('git status --short --branch'));
      rmSync(join(TEST_HOOK_CWD, '.cc-safetynet-rules'), { recursive: true, force: true });

      const parsed = JSON.parse(result.stdout);
      expect(result.exitCode).toBe(0);
      expect(parsed.hookSpecificOutput.permissionDecision).toBe('deny');
      expect(parsed.hookSpecificOutput.permissionDecisionReason).toContain(
        'BLOCKED by CC SafetyNet',
      );
      expect(parsed.hookSpecificOutput.permissionDecisionReason).toContain('missing lockfile');
      expect(parsed.hookSpecificOutput.permissionDecisionReason).toContain(
        'run `cc-safety-net rule sync`',
      );
      expect(parsed.hookSpecificOutput.permissionDecisionReason).toContain(
        'Command: git status --short --branch',
      );
      expect(parsed.hookSpecificOutput.permissionDecisionReason).not.toContain('ask the user');
    });
  });

  describe('allowed commands', () => {
    test('allowed command produces no output', async () => {
      await expectNoHookOutput(runClaudeCodeHook, claudeCodeBashInput('git status'));
    });

    test('debug mode logs allowed command without output', async () => {
      const homeDir = join(TEST_HOOK_CWD, `debug-home-${Date.now()}`);
      await expectNoHookOutput(
        runClaudeCodeHook,
        {
          ...claudeCodeBashInput('TOKEN=secret git status'),
          session_id: 'debug-session',
        },
        { CC_SAFETY_NET_DEBUG: '1', HOME: homeDir },
      );

      const logFile = join(homeDir, '.cc-safety-net', 'logs', 'debug-session.jsonl');
      expect(existsSync(logFile)).toBe(true);
      const entry = JSON.parse(readFileSync(logFile, 'utf-8').trim());
      expect(entry.decision).toBe('allow');
      expect(entry.reason).toBe('allowed');
      expect(entry.command).toContain('<redacted>');
      expect(entry.command).not.toContain('secret');
    });
  });

  describe('non-target tool', () => {
    test('non-Bash tool produces no output', async () => {
      const input = {
        hook_event_name: 'PreToolUse',
        tool_name: 'Read',
        tool_input: {
          path: '/some/file.txt',
        },
      };

      await expectNoHookOutput(runClaudeCodeHook, input);
    });
  });

  describe('empty stdin', () => {
    test('empty input produces no output', async () => {
      await expectNoHookOutput(runClaudeCodeHook, '');
    });

    test('whitespace-only input produces no output', async () => {
      await expectNoHookOutput(runClaudeCodeHook, '   \n\t  ');
    });
  });

  describe('invalid JSON', () => {
    test('strict mode blocks invalid JSON', async () => {
      const { stdout, exitCode } = await runClaudeCodeHook('{invalid json', {
        CC_SAFETY_NET_STRICT: '1',
      });

      expect(exitCode).toBe(0);
      const parsed = JSON.parse(stdout);
      expect(parsed.hookSpecificOutput.permissionDecision).toBe('deny');
      expect(parsed.hookSpecificOutput.permissionDecisionReason).toContain(
        'Failed to parse hook input JSON (strict mode)',
      );
    });

    test('non-strict mode silently ignores invalid JSON', async () => {
      await expectNoHookOutput(runClaudeCodeHook, '{invalid json');
    });
  });

  describe('missing command', () => {
    test('missing command in tool_input produces no output', async () => {
      const input = {
        hook_event_name: 'PreToolUse',
        tool_name: 'Bash',
        tool_input: {},
      };

      await expectNoHookOutput(runClaudeCodeHook, input);
    });

    test('null tool_input produces no output', async () => {
      const input = {
        hook_event_name: 'PreToolUse',
        tool_name: 'Bash',
        tool_input: null,
      };

      await expectNoHookOutput(runClaudeCodeHook, input);
    });

    test('missing tool_input produces no output', async () => {
      const input = {
        hook_event_name: 'PreToolUse',
        tool_name: 'Bash',
      };

      await expectNoHookOutput(runClaudeCodeHook, input);
    });
  });
});
