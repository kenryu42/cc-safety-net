import { describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { handlePiToolUse } from '@/pi/tool-use';
import {
  syncInitialGitRulebook,
  updatedGitRule,
  writeUpdatedGitRulebook,
} from '../helpers/rulebook';

describe('Pi tool_use event', () => {
  test('allows safe bash commands', () => {
    expect(handlePiToolUse(bashToolCall('git status'), piContext(process.cwd()))).toBeUndefined();
  });

  test('blocks dangerous bash commands', () => {
    const result = handlePiToolUse(bashToolCall('rm -rf .'), piContext(process.cwd()));

    expect(result).toEqual({
      block: true,
      reason: expect.stringContaining('BLOCKED by CC Safety Net'),
    });
    expect(result?.reason).toContain('Command: rm -rf .');
  });

  test('blocks Pi tool call payloads without a type field', () => {
    const result = handlePiToolUse(
      {
        toolCallId: 'pi-tool-call',
        toolName: 'bash',
        input: { command: 'git checkout -- README.md' },
      },
      piContext(process.cwd()),
    );

    expect(result?.reason).toContain('git checkout -- discards uncommitted changes permanently');
  });

  test('fails closed when Pi passes malformed bash input', () => {
    const result = handlePiToolUse(
      { type: 'tool_call', toolCallId: 'pi-tool-call', toolName: 'bash', input: {} },
      piContext(process.cwd()),
    );

    expect(result).toEqual({
      block: true,
      reason: expect.stringContaining('CC Safety Net failed closed'),
    });
  });

  test('reloads and repairs local rules before each tool execution', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-tool-use-'));
    try {
      await syncInitialGitRulebook(dir);
      writeUpdatedGitRulebook(dir);

      expect(handlePiToolUse(bashToolCall('git status'), piContext(dir))?.reason).toContain(
        updatedGitRule.reason,
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('fails closed when command analysis throws unexpectedly', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-tool-use-fail-'));
    try {
      const result = handlePiToolUse(bashToolCall('git status'), {
        ...piContext(dir),
        safetyNetAnalyzeCommand: () => {
          throw new Error('unexpected analysis failure');
        },
      });

      expect(result).toEqual({
        block: true,
        reason: expect.stringContaining('CC Safety Net failed closed'),
      });
      expect(result?.reason).toContain('Command: git status');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('logs allowed commands when debug mode is enabled', () => {
    const originalDebug = process.env.CC_SAFETY_NET_DEBUG;
    process.env.CC_SAFETY_NET_DEBUG = '1';
    try {
      expect(handlePiToolUse(bashToolCall('git status'), piContext(process.cwd()))).toBeUndefined();
    } finally {
      if (originalDebug === undefined) {
        delete process.env.CC_SAFETY_NET_DEBUG;
      } else {
        process.env.CC_SAFETY_NET_DEBUG = originalDebug;
      }
    }
  });

  test('ignores user bash commands because CC Safety Net only blocks agent tool execution', () => {
    expect(
      handlePiToolUse(
        { type: 'user_bash', command: 'rm -rf .', cwd: process.cwd() },
        piContext(process.cwd()),
      ),
    ).toBeUndefined();
  });
});

function bashToolCall(command: string) {
  return {
    type: 'tool_call',
    toolCallId: 'pi-tool-call',
    toolName: 'bash',
    input: { command },
  };
}

function piContext(cwd: string) {
  return {
    cwd,
    sessionManager: {
      getSessionFile: () => join(cwd, '.pi', 'sessions', 'session.jsonl'),
    },
  };
}
