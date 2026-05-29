import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { writeDefaultRulesConfig, writeStarterRulebook } from '@/core/rules/policy';
import {
  claudeCodeBashInput,
  expectNoHookOutput,
  getHookDenyReason,
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

    test('command-executing wrapper around destructive command is denied', async () => {
      const result = await runClaudeCodeHook(claudeCodeBashInput('timeout 10 rm -rf /'));

      expect(getHookDenyReason(result, 'claude-code')).toContain('rm -rf');
    });

    test('policy fail-closed denial shows repair command without manual permission footer', async () => {
      writeProjectRulesConfigWithoutLock();

      const result = await runClaudeCodeHook(claudeCodeBashInput('git status --short --branch'));
      rmSync(join(TEST_HOOK_CWD, '.cc-safety-net/rules'), { recursive: true, force: true });

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

    test('policy fail-closed allows exact rule sync repair command', async () => {
      writeProjectRulesConfigWithoutLock();

      await expectNoHookOutput(
        runClaudeCodeHook,
        claudeCodeBashInput('npx -y cc-safety-net rule sync'),
      );
      const result = await runClaudeCodeHook(
        claudeCodeBashInput('npx -y cc-safety-net rule sync && rm -rf /'),
      );
      rmSync(join(TEST_HOOK_CWD, '.cc-safety-net/rules'), { recursive: true, force: true });

      const parsed = JSON.parse(result.stdout);
      expect(parsed.hookSpecificOutput.permissionDecision).toBe('deny');
      expect(parsed.hookSpecificOutput.permissionDecisionReason).toContain('missing lockfile');
    });

    test('legacy config fail-closed asks user to run migration manually', async () => {
      rmSync(join(TEST_HOOK_CWD, '.cc-safety-net'), { recursive: true, force: true });
      writeFileSync(
        join(TEST_HOOK_CWD, '.safety-net.json'),
        JSON.stringify({ version: 1, rules: [] }),
        'utf-8',
      );

      const result = await runClaudeCodeHook(claudeCodeBashInput('echo hello'));
      rmSync(join(TEST_HOOK_CWD, '.safety-net.json'), { force: true });

      const parsed = JSON.parse(result.stdout);
      expect(parsed.hookSpecificOutput.permissionDecision).toBe('deny');
      expect(parsed.hookSpecificOutput.permissionDecisionReason).toContain(
        'ask the user to run `npx -y cc-safety-net rule migrate`',
      );
      expect(parsed.hookSpecificOutput.permissionDecisionReason).toContain(
        'have them run the command manually',
      );
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

    test('repairs missing local rule lock before analysis', async () => {
      writeProjectRulesConfigWithoutLock();
      writeStarterRulebook(join(TEST_HOOK_CWD, '.cc-safety-net/rules/project-rules/rulebook.json'));

      const result = await runClaudeCodeHook(claudeCodeBashInput('docker system prune'));

      const parsed = JSON.parse(result.stdout);
      expect(existsSync(join(TEST_HOOK_CWD, '.cc-safety-net/rules/rule.lock'))).toBe(true);
      expect(parsed.hookSpecificOutput.permissionDecision).toBe('deny');
      expect(parsed.hookSpecificOutput.permissionDecisionReason).toContain(
        '[project-rules/block-docker-system-prune] Use targeted cleanup instead.',
      );
      rmSync(join(TEST_HOOK_CWD, '.cc-safety-net/rules'), { recursive: true, force: true });
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
    test('empty input produces deny output', async () => {
      const result = await runClaudeCodeHook('');

      expect(getHookDenyReason(result, 'claude-code')).toContain('Missing hook input JSON.');
    });

    test('whitespace-only input produces deny output', async () => {
      const result = await runClaudeCodeHook('   \n\t  ');

      expect(getHookDenyReason(result, 'claude-code')).toContain('Missing hook input JSON.');
    });
  });

  describe('invalid JSON', () => {
    test('strict mode blocks invalid JSON', async () => {
      const { stdout, exitCode } = await runClaudeCodeHook('{invalid json', {
        CC_SAFETY_NET_STRICT: '1',
      });

      expect(getHookDenyReason({ stdout, stderr: '', exitCode }, 'claude-code')).toContain(
        'Failed to parse hook input JSON.',
      );
    });

    test('non-strict mode blocks invalid JSON', async () => {
      const result = await runClaudeCodeHook('{invalid json');

      expect(getHookDenyReason(result, 'claude-code')).toContain(
        'Failed to parse hook input JSON.',
      );
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

function writeProjectRulesConfigWithoutLock(): void {
  rmSync(join(TEST_HOOK_CWD, '.cc-safety-net/rules'), { recursive: true, force: true });
  writeDefaultRulesConfig(join(TEST_HOOK_CWD, '.cc-safety-net/rules/rule.json'), ['project-rules']);
}
