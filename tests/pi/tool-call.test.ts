import { describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { handlePiToolCall } from '@/pi/tool-call';
import { withEnv, withLinkedWorktreeFixture } from '../helpers';
import {
  syncInitialGitRulebook,
  updatedGitRule,
  writeUpdatedGitRulebook,
} from '../helpers/rulebook';

describe('Pi tool_call event', () => {
  test('allows safe bash commands', () => {
    expect(handlePiToolCall(bashToolCall('git status'), piContext(process.cwd()))).toBeUndefined();
  });

  test('blocks dangerous bash commands', () => {
    const result = handlePiToolCall(bashToolCall('rm -rf .'), piContext(process.cwd()));

    expect(result).toEqual({
      block: true,
      reason: expect.stringContaining('BLOCKED by CC Safety Net'),
    });
    expect(result?.reason).toContain('Command: rm -rf .');
  });

  test('blocks dangerous Grok Shell commands', () => {
    const result = handlePiToolCall(
      shellToolCall({ command: 'git checkout -- README.md' }),
      piContext(process.cwd()),
    );

    expect(result?.reason).toContain('git checkout -- discards uncommitted changes permanently');
  });

  test('allows safe Grok Shell commands', () => {
    expect(
      handlePiToolCall(shellToolCall({ command: 'git status' }), piContext(process.cwd())),
    ).toBeUndefined();
  });

  test('fails closed when Grok Shell command is malformed', () => {
    const result = handlePiToolCall(shellToolCall({}), piContext(process.cwd()));

    expect(result).toEqual({
      block: true,
      reason: expect.stringContaining('CC Safety Net failed closed'),
    });
  });

  test('uses Grok Shell working_directory for analysis', async () => {
    await withLinkedWorktreeFixture((fixture) => {
      withEnv({ CC_SAFETY_NET_WORKTREE: '1' }, () => {
        expect(
          handlePiToolCall(
            shellToolCall({ command: 'git reset --hard' }),
            piContext(fixture.mainWorktree),
          )?.reason,
        ).toContain('git reset --hard');
        expect(
          handlePiToolCall(
            shellToolCall({
              command: 'git reset --hard',
              working_directory: fixture.linkedWorktree,
            }),
            piContext(fixture.mainWorktree),
          ),
        ).toBeUndefined();
      });
    });
  });

  test('ignores unknown custom tools', () => {
    expect(
      handlePiToolCall(
        {
          type: 'tool_call',
          toolCallId: 'pi-tool-call',
          toolName: 'NotShell',
          input: { command: 'rm -rf .' },
        },
        piContext(process.cwd()),
      ),
    ).toBeUndefined();
  });

  test('blocks Pi tool call payloads without a type field', () => {
    const result = handlePiToolCall(
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
    const result = handlePiToolCall(
      { type: 'tool_call', toolCallId: 'pi-tool-call', toolName: 'bash', input: {} },
      piContext(process.cwd()),
    );

    expect(result).toEqual({
      block: true,
      reason: expect.stringContaining('CC Safety Net failed closed'),
    });
  });

  test('reloads and repairs local rules before each tool execution', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-tool-call-'));
    try {
      await syncInitialGitRulebook(dir);
      writeUpdatedGitRulebook(dir);

      expect(handlePiToolCall(bashToolCall('git status'), piContext(dir))?.reason).toContain(
        updatedGitRule.reason,
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('fails closed when command analysis throws unexpectedly', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-tool-call-fail-'));
    try {
      const result = handlePiToolCall(bashToolCall('git status'), {
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
      expect(
        handlePiToolCall(bashToolCall('git status'), piContext(process.cwd())),
      ).toBeUndefined();
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
      handlePiToolCall(
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

function shellToolCall(input: Record<string, unknown>) {
  return {
    type: 'tool_call',
    toolCallId: 'pi-tool-call',
    toolName: 'Shell',
    input,
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
