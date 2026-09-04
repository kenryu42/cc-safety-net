import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createAmpToolCallHandler, handleAmpToolCall } from '@/integrations/amp/tool-call';
import { getUserPolicyPath } from '@/policy/store';
import {
  readAuditLogEntriesForSession,
  readLatestAuditLogEntry,
  toShellPath,
  withEnv,
} from '../../helpers';
import { type AnalyzeCall, captureAnalyzeCalls } from '../../helpers/analyze-capture';

type FakeShellCommand = { command: string; dir?: string } | null;

describe('Amp tool.call event', () => {
  test('allows a safe shell_command', () => {
    withTempDir((dir) => {
      expect(handleAmpToolCall(shellEvent('git status'), ampApi(dir))).toEqual({ action: 'allow' });
    });
  });

  test('routes shell commands as POSIX from the contained working directory', () => {
    withTempDir((dir) => {
      mkdirSync(join(dir, 'app'));
      const calls: AnalyzeCall[] = [];

      expect(
        createAmpToolCallHandler({
          guardDependencies: { analyzeCommand: captureAnalyzeCalls(calls) },
        })(shellEvent('git status', 'app'), ampApi(dir)),
      ).toEqual({ action: 'allow' });
      expect(calls).toEqual([
        { command: 'git status', cwd: realpathSync(join(dir, 'app')), shell: 'posix' },
      ]);
    });
  });

  test('blocks destructive Git commands', () => {
    withTempDir((dir) => {
      const result = handleAmpToolCall(shellEvent('git reset --hard'), ampApi(dir));

      expect(result).toEqual({
        action: 'reject-and-continue',
        message: expect.stringContaining('BLOCKED by CC Safety Net'),
      });
      expect((result as { message: string }).message).toContain('git reset --hard');
    });
  });

  test('blocks destructive filesystem commands', () => {
    withTempDir((dir) => {
      const result = handleAmpToolCall(shellEvent('rm -rf .'), ampApi(dir));

      expect(result).toMatchObject({ action: 'reject-and-continue' });
      expect((result as { message: string }).message).toContain('Command: rm -rf .');
    });
  });

  test('blocks sensitive read tool path inputs', () => {
    withTempDir((dir) => {
      const result = handleAmpToolCall(ampEvent('Read', { file_path: '.env' }), ampApi(dir));

      expect((result as { message: string }).message).toContain(
        'Access to a sensitive path is not allowed.',
      );
    });
  });

  test('blocks writes that mutate the protected policy config', () => {
    withTempDir((dir) => {
      withEnv({ CC_SAFETY_NET_HOME: join(dir, 'home', '.cc-safety-net') }, () => {
        const result = handleAmpToolCall(
          ampEvent('Write', { file_path: getUserPolicyPath(), content: '{}' }),
          ampApi(dir),
        );

        expect((result as { message: string }).message).toContain(
          'This path contains the protected policy config and you must not modify or delete it.',
        );
      });
    });
  });

  test('blocks sensitive search tool path inputs', () => {
    withTempDir((dir) => {
      const result = handleAmpToolCall(
        ampEvent('grep', { pattern: 'token', path: '.env' }),
        ampApi(dir),
      );

      expect((result as { message: string }).message).toContain(
        'Access to a sensitive path is not allowed.',
      );
    });
  });

  test('blocks apply_patch targets that mutate the protected policy config', () => {
    withTempDir((dir) => {
      withEnv({ CC_SAFETY_NET_HOME: join(dir, 'home', '.cc-safety-net') }, () => {
        const patch = [
          '*** Begin Patch',
          `*** Update File: ${getUserPolicyPath()}`,
          '@@ -1 +1 @@',
          '-{}',
          '+{"version":1}',
          '*** End Patch',
        ].join('\n');

        const result = handleAmpToolCall(ampEvent('apply_patch', { command: patch }), ampApi(dir));

        expect((result as { message: string }).message).toContain(
          'This path contains the protected policy config and you must not modify or delete it.',
        );
      });
    });
  });

  test('keeps inert destructive command text inside a safe apply_patch allowed', () => {
    withTempDir((dir) => {
      let analyzed = false;
      const result = createAmpToolCallHandler({
        guardDependencies: {
          analyzeCommand: () => {
            analyzed = true;
            return null;
          },
        },
      })(
        ampEvent('apply_patch', {
          command: [
            '*** Begin Patch',
            '*** Update File: tests/example.test.ts',
            '@@',
            '-const example = "rm -rf ~";',
            '+const example = "safe";',
            '*** End Patch',
          ].join('\n'),
        }),
        ampApi(dir),
      );

      expect(result).toEqual({ action: 'allow' });
      expect(analyzed).toBeFalse();
    });
  });

  test('does not treat apply_patch input as a shell command', () => {
    withTempDir((dir) => {
      const calls: AnalyzeCall[] = [];

      createAmpToolCallHandler({
        guardDependencies: { analyzeCommand: captureAnalyzeCalls(calls) },
      })(ampEvent('apply_patch', { command: 'rm -rf ~' }), ampApi(dir));

      expect(calls).toEqual([]);
    });
  });

  test('uses the workspace root as the execution cwd when no dir is provided', () => {
    withTempDir((dir) => {
      const calls: AnalyzeCall[] = [];

      createAmpToolCallHandler({
        guardDependencies: { analyzeCommand: captureAnalyzeCalls(calls) },
      })(shellEvent('git status'), ampApi(dir));

      expect(calls).toEqual([{ command: 'git status', cwd: realpathSync(dir), shell: 'posix' }]);
    });
  });

  test('allows a valid absolute dir inside the workspace root', () => {
    withTempDir((dir) => {
      mkdirSync(join(dir, 'app'));

      expect(handleAmpToolCall(shellEvent('git status', join(dir, 'app')), ampApi(dir))).toEqual({
        action: 'allow',
      });
    });
  });

  test('fails closed on a non-object event', () => {
    withTempDir((dir) => {
      for (const event of [null, undefined, 'nope', 42]) {
        expect(handleAmpToolCall(event, ampApi(dir))).toEqual({
          action: 'reject-and-continue',
          message: expect.stringContaining('CC Safety Net failed closed'),
        });
      }
    });
  });

  test('fails closed on a missing or blank tool name', () => {
    withTempDir((dir) => {
      for (const tool of [undefined, null, '', '   ', 42]) {
        expect(
          handleAmpToolCall({ tool, input: {}, thread: { id: 'T-1' } }, ampApi(dir)),
        ).toMatchObject({ action: 'reject-and-continue' });
      }
    });
  });

  test('fails closed when the event input is not an object', () => {
    withTempDir((dir) => {
      expect(
        handleAmpToolCall({ tool: 'Read', input: 'nope', thread: { id: 'T-1' } }, ampApi(dir)),
      ).toMatchObject({ action: 'reject-and-continue' });
    });
  });

  test('fails closed when the workspace root is missing', () => {
    expect(handleAmpToolCall(shellEvent('git status'), ampApi(null))).toEqual({
      action: 'reject-and-continue',
      message: expect.stringContaining('CC Safety Net failed closed'),
    });
  });

  test('fails closed when the workspace URI cannot be resolved', () => {
    withTempDir((dir) => {
      expect(
        handleAmpToolCall(
          shellEvent('git status'),
          ampApi(dir, {
            filePathFromURI: () => {
              throw new Error('invalid uri');
            },
          }),
        ),
      ).toMatchObject({ action: 'reject-and-continue' });
      expect(
        handleAmpToolCall(shellEvent('git status'), ampApi(dir, { filePathFromURI: () => '' })),
      ).toMatchObject({ action: 'reject-and-continue' });
    });
  });

  test('fails closed when the shell helper throws', () => {
    withTempDir((dir) => {
      expect(
        handleAmpToolCall(
          shellEvent('git status'),
          ampApi(dir, {
            shellCommandFromToolCall: () => {
              throw new Error('shell parse failed');
            },
          }),
        ),
      ).toMatchObject({ action: 'reject-and-continue' });
    });
  });

  test('fails closed when the shell command is blank or non-string', () => {
    withTempDir((dir) => {
      for (const command of ['', '   ']) {
        expect(handleAmpToolCall(shellEvent(command), ampApi(dir))).toEqual({
          action: 'reject-and-continue',
          message: expect.stringContaining('CC Safety Net failed closed'),
        });
      }
      expect(
        handleAmpToolCall(
          shellEvent('ignored'),
          ampApi(dir, {
            shellCommandFromToolCall: () => ({ command: 42 as unknown as string }),
          }),
        ),
      ).toMatchObject({ action: 'reject-and-continue' });
    });
  });

  test('analyzes an out-of-workspace dir against its canonical path', () => {
    withTempDir((dir) => {
      const outside = mkdtempSync(join(tmpdir(), 'safety-net-amp-outside-'));
      try {
        symlinkSync(outside, join(dir, 'outside-link'));
        const calls: AnalyzeCall[] = [];
        const handler = createAmpToolCallHandler({
          guardDependencies: { analyzeCommand: captureAnalyzeCalls(calls) },
        });

        expect(handler(shellEvent('git status', outside), ampApi(dir))).toEqual({
          action: 'allow',
        });
        expect(handler(shellEvent('git status', 'outside-link'), ampApi(dir))).toEqual({
          action: 'allow',
        });
        expect(calls.map((call) => call.cwd)).toEqual([
          realpathSync(outside),
          realpathSync(outside),
        ]);
      } finally {
        rmSync(outside, { recursive: true, force: true });
      }
    });
  });

  test('still protects the workspace repo git metadata from an out-of-workspace dir', () => {
    withTempDir((dir) => {
      mkdirSync(join(dir, '.git'));
      const outside = mkdtempSync(join(tmpdir(), 'safety-net-amp-outside-'));
      try {
        withEnv({ HOME: join(dir, 'home') }, () => {
          const result = handleAmpToolCall(
            shellEvent(`rm -rf ${toShellPath(join(realpathSync(dir), '.git'))}`, outside),
            ampApi(dir),
          );

          expect(result).toEqual({
            action: 'reject-and-continue',
            message: expect.stringContaining('Git metadata and hooks are protected'),
          });
        });
      } finally {
        rmSync(outside, { recursive: true, force: true });
      }
    });
  });

  test('reports how to recover when the working directory cannot be canonicalized', () => {
    withTempDir((dir) => {
      const command = 'amp clone user-skills ampcode.com-user-skills';
      const missing = join(dir, 'missing');
      const calls: AnalyzeCall[] = [];
      const result = createAmpToolCallHandler({
        guardDependencies: { analyzeCommand: captureAnalyzeCalls(calls) },
      })(shellEvent(command, missing), ampApi(dir));

      expect(result).toEqual({
        action: 'reject-and-continue',
        message: expect.stringContaining(
          'CC Safety Net could not use the requested working directory because it does not exist, is inaccessible, is not a directory, or uses an unsupported path form. Use an existing accessible working directory. If the requested directory is missing, create it from an accessible location before retrying the command.',
        ),
      });
      expect(calls).toEqual([]);
      expect((result as { message: string }).message).toContain(`Command: ${command}`);
      expect((result as { message: string }).message).toContain(`Segment: ${missing}`);
      expect((result as { message: string }).message).toContain(
        'Continue the task using the safer alternative described above.',
      );
      expect((result as { message: string }).message).not.toContain(
        'command analysis failed unexpectedly',
      );
    });
  });

  test('attributes audit records to amp with the thread id as session id', () => {
    withTempDir((dir) => {
      const home = join(dir, 'home');
      const sessionId = 'T-019f6be1-74c3-7692-852d-7fee79b8e67f';
      withEnv({ HOME: home }, () => {
        const result = handleAmpToolCall(shellEvent('cat .env', undefined, sessionId), ampApi(dir));

        expect((result as { message: string }).message).toContain(
          'Access to a sensitive path is not allowed.',
        );
        expect(readLatestAuditLogEntry(home, sessionId)).toEqual(
          expect.objectContaining({
            agent: 'amp',
            decision: 'deny',
            command: 'cat .env',
            segment: '.env',
          }),
        );
      });
    });
  });

  test.each([
    [undefined, 1],
    ['all', 1],
    ['blocked', 0],
    ['everything', 0],
  ])('records an allowed shell command only when the %p audit scope allows it', (scope, recorded) => {
    withTempDir((dir) => {
      const home = join(dir, 'home');
      const sessionId = 'T-amp-scope-allow';
      withEnv({ HOME: home, CC_SAFETY_NET_AUDIT_SCOPE: scope }, () => {
        expect(
          handleAmpToolCall(shellEvent('git status', undefined, sessionId), ampApi(dir)),
        ).toEqual({ action: 'allow' });

        const entries = readAuditLogEntriesForSession(home, sessionId);
        expect(entries).toHaveLength(recorded as number);
        if (recorded) {
          expect(entries[0]).toMatchObject({ agent: 'amp', decision: 'allow', reason: 'allowed' });
        }
      });
    });
  });

  test.each([
    undefined,
    'all',
    'blocked',
    'everything',
  ])('records a denial under the %p audit scope', (scope) => {
    withTempDir((dir) => {
      const home = join(dir, 'home');
      const sessionId = 'T-amp-scope-deny';
      withEnv({ HOME: home, CC_SAFETY_NET_AUDIT_SCOPE: scope }, () => {
        expect(
          handleAmpToolCall(shellEvent('git reset --hard', undefined, sessionId), ampApi(dir)),
        ).toMatchObject({ action: 'reject-and-continue' });

        expect(readAuditLogEntriesForSession(home, sessionId)).toMatchObject([
          { agent: 'amp', decision: 'deny', ruleId: 'git.reset-hard' },
        ]);
      });
    });
  });

  test('audits malformed tool calls with the amp agent', () => {
    withTempDir((dir) => {
      const home = join(dir, 'home');
      withEnv({ HOME: home }, () => {
        const result = handleAmpToolCall(shellEvent('', undefined, 'T-amp-preflight'), ampApi(dir));

        expect((result as { message: string }).message).toContain('CC Safety Net failed closed');
        expect(readAuditLogEntriesForSession(home, 'T-amp-preflight')).toMatchObject([
          { agent: 'amp' },
        ]);
      });
    });
  });

  test('returns a denial rather than throwing when guard analysis fails', () => {
    withTempDir((dir) => {
      const result = createAmpToolCallHandler({
        guardDependencies: {
          analyzeCommand: () => {
            throw new Error('unexpected analysis failure');
          },
        },
      })(shellEvent('git status'), ampApi(dir));

      expect(result).toEqual({
        action: 'reject-and-continue',
        message: expect.stringContaining('CC Safety Net failed closed'),
      });
      expect((result as { message: string }).message).toContain('Command: git status');
      expect((result as { message: string }).message).not.toContain('unexpected analysis failure');
    });
  });

  test('does not leak state across concurrent thread ids', () => {
    withTempDir((dir) => {
      const home = join(dir, 'home');
      withEnv({ HOME: home }, () => {
        const handler = createAmpToolCallHandler();

        expect(handler(shellEvent('cat .env', undefined, 'T-thread-a'), ampApi(dir))).toMatchObject(
          { action: 'reject-and-continue' },
        );
        expect(
          handler(shellEvent('rm -rf ~/.ssh', undefined, 'T-thread-b'), ampApi(dir)),
        ).toMatchObject({ action: 'reject-and-continue' });

        expect(readAuditLogEntriesForSession(home, 'T-thread-a')).toMatchObject([
          { agent: 'amp', command: 'cat .env' },
        ]);
        expect(readAuditLogEntriesForSession(home, 'T-thread-b')).toMatchObject([
          { agent: 'amp', command: 'rm -rf ~/.ssh' },
        ]);
      });
    });
  });
});

function ampEvent(tool: string, input: Record<string, unknown>, threadId = 'T-amp-session') {
  return { toolUseID: 'amp-tool-use', tool, input, thread: { id: threadId } };
}

function shellEvent(command: string, dir?: string, threadId = 'T-amp-session') {
  return ampEvent('shell_command', dir === undefined ? { command } : { command, dir }, threadId);
}

function defaultShellCommandFromToolCall(event: {
  tool: string;
  input: Record<string, unknown>;
}): FakeShellCommand {
  if (event.tool !== 'shell_command' && event.tool !== 'Bash') return null;
  return { command: event.input.command as string, dir: event.input.dir as string | undefined };
}

function ampApi(
  rootDir: string | null,
  overrides: {
    filePathFromURI?: (uri: { toString(): string }) => string;
    shellCommandFromToolCall?: (event: {
      tool: string;
      input: Record<string, unknown>;
    }) => FakeShellCommand;
  } = {},
) {
  return {
    system: { workspaceRoot: rootDir === null ? null : pathToFileURL(rootDir) },
    helpers: {
      filePathFromURI: overrides.filePathFromURI ?? ((uri) => fileURLToPath(uri.toString())),
      shellCommandFromToolCall:
        overrides.shellCommandFromToolCall ?? defaultShellCommandFromToolCall,
    },
  };
}

function withTempDir(fn: (dir: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), 'safety-net-amp-'));
  try {
    fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
