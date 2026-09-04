import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, parse } from 'node:path';
import { createPiToolCallHandler, handlePiToolCall } from '@/integrations/pi/tool-call';
import { getUserPolicyPath } from '@/policy/store';
import { writeDefaultRulesConfig } from '@/rules/policy';
import {
  readAuditLogEntriesForSession,
  readLatestAuditLogEntry,
  toShellPath,
  withEnv,
} from '../../helpers';
import { type AnalyzeCall, captureAnalyzeCalls } from '../../helpers/analyze-capture';
import {
  initialGitRule,
  syncInitialGitRulebook,
  updatedGitRule,
  writeUpdatedGitRulebook,
} from '../../helpers/rulebook';

describe('Pi tool_call event', () => {
  test('allows safe bash commands', () => {
    expect(handlePiToolCall(bashToolCall('git status'), piContext(process.cwd()))).toBeUndefined();
  });

  test('routes built-in bash commands as POSIX from the context cwd', () => {
    const calls: AnalyzeCall[] = [];
    const cwd = process.cwd();

    expect(
      createPiToolCallHandler({
        guardDependencies: { analyzeCommand: captureAnalyzeCalls(calls) },
      })(bashToolCall('git status'), piContext(cwd)),
    ).toBeUndefined();
    expect(calls).toEqual([{ command: 'git status', cwd, shell: 'posix' }]);
  });

  test('analyzes from the validated canonical cwd when the context cwd is a symlink', () => {
    const calls: AnalyzeCall[] = [];
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-symlink-cwd-'));
    try {
      const real = join(dir, 'real');
      mkdirSync(real);
      const link = join(dir, 'link');
      symlinkSync(real, link);

      expect(
        createPiToolCallHandler({
          guardDependencies: { analyzeCommand: captureAnalyzeCalls(calls) },
        })(bashToolCall('git status'), piContext(link)),
      ).toBeUndefined();
      expect(calls).toEqual([{ command: 'git status', cwd: realpathSync(real), shell: 'posix' }]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('blocks dangerous bash commands', () => {
    const result = handlePiToolCall(bashToolCall('rm -rf .'), piContext(process.cwd()));

    expect(result).toEqual({
      block: true,
      reason: expect.stringContaining('BLOCKED by CC Safety Net'),
    });
    expect(result?.reason).toContain('Command: rm -rf .');
    expect(result?.reason).not.toContain('Tool:');
  });

  test('blocks sensitive bash command targets before destructive command analysis', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-secret-'));
    try {
      const result = handlePiToolCall(bashToolCall('rm -rf ~/.ssh'), piContext(dir));

      expect(result?.reason).toContain('Access to a sensitive path is not allowed.');
      expect(result?.reason).toContain('Command: rm -rf ~/.ssh');
      expect(result?.reason).toContain('Segment: ~/.ssh');
      expect(result?.reason).not.toContain(
        'ask the user for explicit permission and have them run the command manually',
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('blocks sensitive Pi read tool path inputs', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-read-secret-'));
    try {
      const envResult = handlePiToolCall(toolCall('read', { path: '.env' }), piContext(dir));

      expect(envResult?.reason).toContain('Access to a sensitive path is not allowed.');
      expect(envResult?.reason).toContain('Rule: secret.basename.env');
      expect(envResult?.reason).not.toContain('Tool:');
      const result = handlePiToolCall(
        toolCall('Read', { file_path: '.env.local' }),
        piContext(dir),
      );

      expect(result?.reason).toContain('Access to a sensitive path is not allowed.');
      expect(result?.reason).toContain('Command: .env.local');
      expect(result?.reason).not.toContain(
        'ask the user for explicit permission and have them run the command manually',
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('fails closed without reflecting over-budget Git fallback patch input', () => {
    const marker = 'private-pi-fallback-marker';
    const target = Array.from({ length: 65 }, (_, index) => `${marker}-${index}`).join(' ');
    const attackerPatch = `diff --git ${target} ${target}`;
    const result = handlePiToolCall(
      toolCall('apply_patch', { command: attackerPatch }),
      piContext(process.cwd()),
    );

    expect(result?.reason).toContain('CC Safety Net failed closed');
    expect(result?.reason).not.toContain(marker);
  });

  test('inspects the Pi find tool pattern and treats find as read-only', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-find-'));
    try {
      mkdirSync(join(dir, '.git', 'hooks'), { recursive: true });
      writeFileSync(join(dir, '.git', 'HEAD'), 'ref: refs/heads/main\n');
      writeFileSync(join(dir, '.git', 'hooks', 'pre-commit'), '#!/bin/sh\n');
      const secretResult = handlePiToolCall(toolCall('find', { pattern: '.env' }), piContext(dir));

      expect(secretResult?.reason).toContain('Access to a sensitive path is not allowed.');
      expect(secretResult?.reason).toContain('Rule: secret.basename.env');
      expect(
        handlePiToolCall(
          toolCall('find', { pattern: '*.ts', path: '.git/hooks/pre-commit' }),
          piContext(dir),
        ),
      ).toBeUndefined();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('allows non-sensitive Pi read tool path inputs', () => {
    expect(
      handlePiToolCall(toolCall('read', { path: 'README.md' }), piContext(process.cwd())),
    ).toBeUndefined();
  });

  test('blocks Pi tool calls that mutate user policy config', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-policy-protection-'));
    try {
      withEnv({ CC_SAFETY_NET_HOME: join(dir, 'home', '.cc-safety-net') }, () => {
        const policyPath = getUserPolicyPath();

        expect(
          handlePiToolCall(
            toolCall('Write', { file_path: policyPath, content: '{}' }),
            piContext(dir),
          )?.reason,
        ).toContain(
          'This path contains the protected policy config and you must not modify or delete it.',
        );
        const result = handlePiToolCall(
          bashToolCall(`cat package.json > ${toShellPath(policyPath)}`),
          piContext(dir),
        );

        expect(result?.reason).toContain(
          'This path contains the protected policy config and you must not modify or delete it.',
        );
        expect(result?.reason).toContain(`Command: cat package.json > ${toShellPath(policyPath)}`);
        expect(result?.reason).toContain(`Segment: ${toShellPath(policyPath)}`);
        expect(result?.reason).not.toContain(
          'ask the user for explicit permission and have them run the command manually',
        );
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('allows Pi read-only access to user policy config', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-policy-read-'));
    try {
      withEnv({ CC_SAFETY_NET_HOME: join(dir, 'home', '.cc-safety-net') }, () => {
        const policyPath = getUserPolicyPath();

        expect(
          handlePiToolCall(toolCall('Read', { file_path: policyPath }), piContext(dir)),
        ).toBeUndefined();
        expect(
          handlePiToolCall(bashToolCall(`cat ${toShellPath(policyPath)}`), piContext(dir)),
        ).toBeUndefined();
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test.each([
    undefined,
    null,
    '',
    '   ',
    42,
    false,
  ])('fails closed when a recognized adapter command is %p', (command) => {
    const result = handlePiToolCall(toolCall('bash', { command }), piContext(process.cwd()));

    expect(result).toEqual({
      block: true,
      reason: expect.stringContaining('CC Safety Net failed closed'),
    });
  });

  test('fails closed when Pi context cwd is missing or not a directory', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-invalid-context-cwd-'));
    try {
      writeFileSync(join(dir, 'file.txt'), 'not a directory', 'utf-8');

      for (const cwd of [join(dir, 'missing'), join(dir, 'file.txt')]) {
        expect(handlePiToolCall(bashToolCall('git status'), piContext(cwd))).toEqual({
          block: true,
          reason: expect.stringContaining('CC Safety Net failed closed'),
        });
        expect(
          handlePiToolCall(toolCall('Read', { file_path: 'README.md' }), piContext(cwd)),
        ).toEqual({
          block: true,
          reason: expect.stringContaining('CC Safety Net failed closed'),
        });
      }
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
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

  test.each([
    'Bash',
    'shell',
    'SHELL',
    'bash-tool',
  ])('does not promote the custom tool name %s to a command executor', (toolName) => {
    let analyzed = false;

    expect(
      createPiToolCallHandler({
        guardDependencies: {
          analyzeCommand: () => {
            analyzed = true;
            return null;
          },
        },
      })(toolCall(toolName, { command: 'git reset --hard' }), piContext(process.cwd())),
    ).toBeUndefined();
    expect(analyzed).toBeFalse();
  });

  test('retains policy and secret fallback inspection for unknown command-style tools', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-unknown-fallback-'));
    try {
      withEnv({ CC_SAFETY_NET_HOME: join(dir, 'home', '.cc-safety-net') }, () => {
        const secretResult = handlePiToolCall(
          toolCall('custom_runner', { command: 'cat .env' }),
          piContext(dir),
        );
        const policyPath = getUserPolicyPath();
        const policyResult = handlePiToolCall(
          toolCall('custom_runner', { command: `rm ${policyPath}` }),
          piContext(dir),
        );

        expect(secretResult?.reason).toContain('Access to a sensitive path is not allowed.');
        expect(policyResult?.reason).toContain(
          'This path contains the protected policy config and you must not modify or delete it.',
        );
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('keeps safe patch command text inert', () => {
    let analyzed = false;
    const result = createPiToolCallHandler({
      guardDependencies: {
        analyzeCommand: () => {
          analyzed = true;
          return null;
        },
      },
    })(
      toolCall('apply_patch', {
        command: [
          '*** Begin Patch',
          '*** Update File: tests/example.test.ts',
          '@@',
          '-const example = "rm .cc-safety-net/rules/rule.json";',
          '+const example = "safe";',
          '*** End Patch',
        ].join('\n'),
      }),
      piContext(process.cwd()),
    );

    expect(result).toBeUndefined();
    expect(analyzed).toBeFalse();
  });

  test('fails closed when a Pi tool_call has a missing or empty tool name', () => {
    for (const toolName of [undefined, null, '', '   ']) {
      const result = handlePiToolCall(
        { type: 'tool_call', toolCallId: 'pi-tool-call', toolName, input: {} },
        piContext(process.cwd()),
      );

      expect(result).toEqual({
        block: true,
        reason: expect.stringContaining('CC Safety Net failed closed'),
      });
    }
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

  test('honors user secret protection policy for non-shell Pi tools', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-read-policy-'));
    try {
      expect(
        createHandlerWithSecretProtectionDisabled(dir)(
          toolCall('read', { path: '.env' }),
          piContext(dir),
        ),
      ).toBeUndefined();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('keeps secret protection for non-shell Pi tools when policy config is invalid', () => {
    withInvalidSecretPolicy('safety-net-pi-read-invalid-policy-', (dir, userConfigDir) => {
      expectDegradedPolicyStillProtects(
        createPiToolCallHandler({ policyOptions: { userConfigDir } }),
        dir,
        toolCall('read', { path: 'README.md' }),
        toolCall('read', { path: '.env' }),
      );
    });
  });

  test('honors user secret protection policy without weakening destructive command blocking', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-secret-policy-'));
    try {
      const handler = createHandlerWithSecretProtectionDisabled(dir);
      const root = toShellPath(parse(dir).root);

      expect(handler(bashToolCall('cat .env'), piContext(dir))).toBeUndefined();
      expect(handler(bashToolCall(`rm -rf ${root}`), piContext(dir))?.reason).toContain(
        'This path contains the protected policy config and you must not modify or delete it.',
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('honors user secret protection overrides and deny paths', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-secret-rules-'));
    try {
      const userConfigDir = join(dir, 'home', '.cc-safety-net', 'rules');
      writeUserPolicy(userConfigDir, {
        version: 1,
        secret_protection: {
          overrides: { 'secret.ext.pem': 'off' },
          deny_paths: ['private-note.txt'],
        },
      });
      const handler = createPiToolCallHandler({ policyOptions: { userConfigDir } });
      const ctx = piContext(dir);

      expect(handler(bashToolCall('cat server.pem'), ctx)).toBeUndefined();
      expect(handler(bashToolCall('cat id_rsa.pem'), ctx)?.reason).toContain(
        'Access to a sensitive path is not allowed.',
      );
      const deniedByPolicyResult = handler(bashToolCall('cat private-note.txt'), ctx);

      expect(deniedByPolicyResult?.reason).toContain('Access to a sensitive path is not allowed.');
      expect(deniedByPolicyResult?.reason).toContain('Rule: secret.deny-path');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('keeps secret protection for shell tools when policy config is invalid', () => {
    withInvalidSecretPolicy('safety-net-pi-invalid-policy-', (dir, userConfigDir) => {
      expectDegradedPolicyStillProtects(
        createPiToolCallHandler({ policyOptions: { userConfigDir } }),
        dir,
        bashToolCall('git status'),
        bashToolCall('cat .env'),
      );
    });
  });

  test('writes audit logs for secret protection blocks', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-secret-audit-'));
    const home = join(dir, 'home');
    const sessionId = '019f6be1-74c3-7692-852d-7fee79b8e67f';
    try {
      withEnv({ HOME: home }, () => {
        const result = handlePiToolCall(bashToolCall('cat .env'), {
          ...piContext(dir),
          sessionManager: { getSessionId: () => sessionId },
        });

        expect(result?.reason).toContain('Access to a sensitive path is not allowed.');
        expect(readLatestAuditLogEntry(home, sessionId)).toEqual(
          expect.objectContaining({
            decision: 'deny',
            command: 'cat .env',
            segment: '.env',
            reason: 'Access to a sensitive path is not allowed.',
            ruleId: 'secret.basename.env',
            cwd: realpathSync(dir),
          }),
        );
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('audits malformed recognized tool calls exactly once', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-preflight-audit-'));
    const home = join(dir, 'home');
    try {
      withEnv({ HOME: home }, () => {
        const result = handlePiToolCall(toolCall('bash', {}), {
          ...piContext(dir),
          sessionManager: { getSessionId: () => 'pi-preflight-session' },
        });

        expect(result?.reason).toContain('CC Safety Net failed closed');
        expect(readAuditLogEntriesForSession(home, 'pi-preflight-session')).toMatchObject([
          { agent: 'pi', toolName: 'bash', cwd: dir },
        ]);
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('reloads local rules from the edited rulebook on the next tool call', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-tool-call-'));
    try {
      await syncInitialGitRulebook(dir);
      expect(handlePiToolCall(bashToolCall('git status'), piContext(dir))).toBeUndefined();
      expect(handlePiToolCall(bashToolCall('git add -A'), piContext(dir))?.reason).toContain(
        initialGitRule.reason,
      );

      writeUpdatedGitRulebook(dir);

      // The local rulebook is a live file: the edit rules on the next call, and
      // the stale lock entry and cached copy from the sync above are ignored.
      expect(handlePiToolCall(bashToolCall('git status'), piContext(dir))?.reason).toContain(
        updatedGitRule.reason,
      );
      expect(handlePiToolCall(bashToolCall('git add -A'), piContext(dir))).toBeUndefined();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('fails closed when command analysis throws unexpectedly', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-tool-call-fail-'));
    try {
      const result = createPiToolCallHandler({
        guardDependencies: {
          analyzeCommand: () => {
            throw new Error('unexpected analysis failure');
          },
        },
      })(bashToolCall('git status'), piContext(dir));

      expect(result).toEqual({
        block: true,
        reason: expect.stringContaining('CC Safety Net failed closed'),
      });
      expect(result?.reason).toContain('Command: git status');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test.each([
    'findPolicyMutation',
    'loadPolicySnapshot',
    'findSensitiveTarget',
    'analyzeCommand',
  ] as const)('renders %s dependency failures as generic denials', (dependency) => {
    const result = createPiToolCallHandler({
      guardDependencies: {
        [dependency]: () => {
          throw new Error(`${dependency} raw failure`);
        },
      },
    })(bashToolCall('git status'), piContext(process.cwd()));

    expect(result?.reason).toContain('CC Safety Net failed closed');
    expect(result?.reason).not.toContain(`${dependency} raw failure`);
    expect(result?.reason).not.toContain('Tool:');
  });

  test('resolves sessions only for auditable evaluations', () => {
    const cwd = process.cwd();
    const sessionLookups: string[] = [];
    const ctx = {
      ...piContext(cwd),
      sessionManager: {
        getSessionId: () => {
          sessionLookups.push('session');
          return undefined;
        },
      },
    };
    const policyHandler = createPiToolCallHandler({
      guardDependencies: { findPolicyMutation: () => ({ target: 'policy.json' }) },
    });
    const evaluatorErrorHandler = createPiToolCallHandler({
      guardDependencies: {
        analyzeCommand: () => {
          throw new Error('analysis failed');
        },
      },
    });

    expect(handlePiToolCall(toolCall('bash', {}), ctx)?.block).toBeTrue();
    expect(policyHandler(bashToolCall('git status'), ctx)?.block).toBeTrue();
    expect(evaluatorErrorHandler(bashToolCall('git status'), ctx)?.block).toBeTrue();
    expect(handlePiToolCall(toolCall('Read', { path: 'README.md' }), ctx)).toBeUndefined();
    expect(sessionLookups).toEqual(['session', 'session', 'session']);

    expect(handlePiToolCall(bashToolCall('cat .env'), ctx)?.block).toBeTrue();
    expect(handlePiToolCall(bashToolCall('git reset --hard'), ctx)?.block).toBeTrue();
    expect(sessionLookups).toEqual(['session', 'session', 'session', 'session', 'session']);
  });

  test.each([
    'cat .env',
    'git reset --hard',
  ])('keeps %s blocked when session lookup throws', (command) => {
    const result = handlePiToolCall(bashToolCall(command), {
      ...piContext(process.cwd()),
      sessionManager: {
        getSessionId: () => {
          throw new Error('session lookup failed');
        },
      },
    });

    expect(result?.block).toBeTrue();
    expect(result?.reason).toContain('BLOCKED by CC Safety Net');
  });

  test.each([
    [undefined, 1],
    ['all', 1],
    ['blocked', 0],
    ['everything', 0],
  ])('resolves a safe-command session only when the audit scope %p records allows', (scope, expectedLookups) => {
    let sessionLookups = 0;
    const ctx = {
      ...piContext(process.cwd()),
      sessionManager: {
        getSessionId: () => {
          sessionLookups++;
          return undefined;
        },
      },
    };

    withEnv({ CC_SAFETY_NET_AUDIT_SCOPE: scope, CC_SAFETY_NET_DEBUG: undefined }, () => {
      expect(handlePiToolCall(bashToolCall('git status'), ctx)).toBeUndefined();
    });
    expect(sessionLookups).toBe(expectedLookups);
  });

  test.each([
    undefined,
    null,
    '',
    '   ',
    42,
    false,
  ])('rejects malformed recognized command %p before guard evaluation', (command) => {
    const calls: string[] = [];
    const handler = createPiToolCallHandler({
      guardDependencies: {
        findPolicyMutation: () => {
          calls.push('guard');
          return null;
        },
      },
    });
    const result = handler(toolCall('bash', { command }), {
      ...piContext(process.cwd()),
      sessionManager: {
        getSessionId: () => {
          calls.push('session');
          return undefined;
        },
      },
    });

    expect(result?.reason).toContain('CC Safety Net failed closed');
    expect(calls).toEqual(['session']);
  });

  test.each([
    [undefined, 'allow'],
    ['all', 'allow'],
    ['blocked', undefined],
    ['everything', undefined],
  ])('records an allowed command under the %p audit scope as %p', (scope, decision) => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-scope-'));
    const home = join(dir, 'home');
    const sessionId = 'pi-scope-session';
    try {
      withEnv({ HOME: home, CC_SAFETY_NET_AUDIT_SCOPE: scope }, () => {
        expect(
          handlePiToolCall(bashToolCall('TOKEN=secret git status'), {
            ...piContext(dir),
            sessionManager: { getSessionId: () => sessionId },
          }),
        ).toBeUndefined();

        const entries = readAuditLogEntriesForSession(home, sessionId);
        if (decision === undefined) {
          expect(entries).toEqual([]);
          return;
        }
        expect(entries).toMatchObject([
          {
            decision: 'allow',
            reason: 'allowed',
            agent: 'pi',
            command: 'TOKEN=<redacted> git status',
          },
        ]);
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test.each([
    undefined,
    'all',
    'blocked',
    'everything',
  ])('records a denial under the %p audit scope', (scope) => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-scope-deny-'));
    const home = join(dir, 'home');
    const sessionId = 'pi-scope-deny-session';
    try {
      withEnv({ HOME: home, CC_SAFETY_NET_AUDIT_SCOPE: scope }, () => {
        expect(
          handlePiToolCall(bashToolCall('git reset --hard'), {
            ...piContext(dir),
            sessionManager: { getSessionId: () => sessionId },
          })?.block,
        ).toBeTrue();

        expect(readAuditLogEntriesForSession(home, sessionId)).toMatchObject([
          { decision: 'deny', agent: 'pi', ruleId: 'git.reset-hard' },
        ]);
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('preserves the exact rule-sync repair command under fail-closed config', () => {
    const dir = mkdtempSync(join(tmpdir(), 'safety-net-pi-rule-sync-'));
    try {
      writeDefaultRulesConfig(join(dir, '.cc-safety-net/rules/rule.json'), ['project-rules']);
      const root = toShellPath(parse(dir).root);

      expect(
        handlePiToolCall(bashToolCall('npx -y cc-safety-net rule sync'), piContext(dir)),
      ).toBeUndefined();
      expect(
        handlePiToolCall(
          bashToolCall(`npx -y cc-safety-net rule sync && rm -rf ${root}`),
          piContext(dir),
        )?.reason,
      ).toContain(
        'This path contains the protected policy config and you must not modify or delete it.',
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
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

function toolCall(toolName: string, input: Record<string, unknown>) {
  return {
    type: 'tool_call',
    toolCallId: 'pi-tool-call',
    toolName,
    input,
  };
}

function piContext(cwd: string, options: Partial<Parameters<typeof handlePiToolCall>[1]> = {}) {
  return {
    cwd,
    sessionManager: {
      getSessionId: () => 'pi-session',
    },
    ...options,
  };
}

function writeUserPolicy(userConfigDir: string, policy: unknown): void {
  mkdirSync(dirname(userConfigDir), { recursive: true });
  writeFileSync(join(dirname(userConfigDir), 'policy.json'), JSON.stringify(policy), 'utf-8');
}

function createHandlerWithSecretProtectionDisabled(dir: string) {
  const userConfigDir = join(dir, 'home', '.cc-safety-net', 'rules');
  writeUserPolicy(userConfigDir, {
    version: 1,
    secret_protection: { enabled: false },
  });
  return createPiToolCallHandler({ policyOptions: { userConfigDir } });
}

function withInvalidSecretPolicy(
  prefix: string,
  fn: (dir: string, userConfigDir: string) => void,
): void {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  try {
    const userConfigDir = join(dir, 'home', '.cc-safety-net', 'rules');
    writeUserPolicy(userConfigDir, {
      version: 1,
      secret_protection: { enabled: 'yes' },
    });
    fn(dir, userConfigDir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * An unreadable policy degrades to protective defaults, so the rejected
 * `secret_protection.enabled` never turns secret discovery off.
 */
function expectDegradedPolicyStillProtects(
  handler: ReturnType<typeof createPiToolCallHandler>,
  dir: string,
  allowed: ReturnType<typeof toolCall>,
  denied: ReturnType<typeof toolCall>,
): void {
  expect(handler(allowed, piContext(dir))).toBeUndefined();
  expect(handler(denied, piContext(dir))?.reason).toContain(
    'Access to a sensitive path is not allowed.',
  );
}
