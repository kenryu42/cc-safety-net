import { afterEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { listAuditLogFiles } from '@/engine/audit-scan';
import { writeDefaultRulesConfig, writeStarterRulebook } from '@/rules/policy';
import { readAuditLogEntriesForSession, readLatestAuditLogEntry, toShellPath } from '../../helpers';
import {
  claudeCodeBashInput,
  expectNoHookOutput,
  expectSecretProtectionDeny,
  getHookDenyReason,
  type HookTestContext,
  runClaudeCodeHookDirect as runClaudeCodeHook,
  withHookTestContext,
  writeUserPolicy,
} from '../hook-helpers';

describe('Claude Code hook', () => {
  function writeProjectPolicy(cwd: string, policy: unknown): void {
    mkdirSync(join(cwd, '.cc-safety-net'), { recursive: true });
    writeFileSync(join(cwd, '.cc-safety-net', 'policy.json'), JSON.stringify(policy), 'utf-8');
  }

  describe('blocked commands', () => {
    test.each([
      ['codex', '.codex', 'claude-code'],
      ['claude-code', '.claude', undefined],
      ['unknown', undefined, 'claude-code'],
    ] as const)('audits Claude-shaped calls as %s', async (agent, root, shape) => {
      await withHookTestContext(async (context) => {
        const sessionId = `agent-${agent}`;
        await context.runClaudeCodeHook(
          {
            ...context.claudeCodeBashInput('git reset --hard'),
            session_id: sessionId,
            ...(root
              ? { transcript_path: join(context.home, root, 'sessions', 'transcript.jsonl') }
              : {}),
          },
          { CLAUDECODE: '', CLAUDE_CODE_ENTRYPOINT: '' },
        );

        expect(readLatestAuditLogEntry(context.home, sessionId)).toMatchObject({
          agent,
          ...(shape ? { shape } : {}),
        });
        if (shape === undefined) {
          expect(readLatestAuditLogEntry(context.home, sessionId)).not.toHaveProperty('shape');
        }
      });
    });

    test('persists exactly the audited fields for a denied command', async () => {
      await withHookTestContext(async (context) => {
        const sessionId = 'audit-key-set';

        await context.runClaudeCodeHook({
          ...context.claudeCodeBashInput('git reset --hard'),
          session_id: sessionId,
        });

        // Equality, not a subset: a field added to the persisted entry for
        // debugging would slip past every partial audit assertion.
        expect(Object.keys(readLatestAuditLogEntry(context.home, sessionId))).toEqual([
          'ts',
          'id',
          'v',
          'sessionId',
          'decision',
          'agent',
          'shape',
          'level',
          'toolName',
          'command',
          'segment',
          'reason',
          'ruleId',
          'intent',
          'cwd',
        ]);
      });
    });

    test('blocked command produces correct JSON structure', async () => {
      const { stdout, exitCode } = await runClaudeCodeHook(claudeCodeBashInput('git reset --hard'));

      const parsed = JSON.parse(stdout);
      expect(exitCode).toBe(0);
      expect(parsed.hookSpecificOutput).toBeDefined();
      expect(parsed.hookSpecificOutput.hookEventName).toBe('PreToolUse');
      expect(parsed.hookSpecificOutput.permissionDecision).toBe('deny');
      expect(parsed.hookSpecificOutput.permissionDecisionReason).toContain(
        'BLOCKED by CC Safety Net',
      );
      expect(parsed.hookSpecificOutput.permissionDecisionReason).toContain('git reset --hard');
    });

    test('command-executing wrapper around destructive command is denied', async () => {
      const result = await runClaudeCodeHook(claudeCodeBashInput('timeout 10 rm -rf /'));

      expect(getHookDenyReason(result, 'claude-code')).toContain('rm -rf');
    });

    test('PowerShell Remove-Item command is denied', async () => {
      await withHookTestContext(async (context) => {
        const result = await context.runClaudeCodeHook({
          hook_event_name: 'PreToolUse',
          cwd: context.cwd,
          tool_name: 'PowerShell',
          tool_input: { command: 'Remove-Item . -Recurse -Force' },
        });

        const reason = getHookDenyReason(result, 'claude-code');
        expect(reason).toContain('Remove-Item -Recurse -Force');
        expect(reason).toContain('powershell.remove-item-recursive-force-cwd-self');
      });
    });

    test('PowerShell tool still denies Bash-like git commands', async () => {
      await withHookTestContext(async (context) => {
        const result = await context.runClaudeCodeHook({
          hook_event_name: 'PreToolUse',
          cwd: context.cwd,
          tool_name: 'PowerShell',
          tool_input: { command: 'git reset --hard' },
        });

        const reason = getHookDenyReason(result, 'claude-code');
        expect(reason).toContain('git reset --hard');
        expect(reason).toContain('git.reset-hard');
      });
    });

    test('a rule source with no rulebook rides along as a warning on an unrelated denial', async () => {
      await withHookTestContext(async (context) => {
        writeProjectRulesConfigWithoutRulebook(context.cwd);

        // The unreadable source is dropped, so an ordinary command passes...
        const allowed = await context.runClaudeCodeHook(
          context.claudeCodeBashInput('git status --short --branch'),
        );

        expect(allowed.exitCode).toBe(0);
        expect(allowed.stdout).toBe('');

        // ...and the diagnostic surfaces on the next denial it did not cause.
        const reason = await denialReason(context, 'git reset --hard');

        expect(reason).toContain('Config warning: missing rulebook file');
        expect(reason).toContain('create that file or remove that source from the rules config');
      });
    });
  });

  test('fails closed without reflecting over-budget Git fallback patch input', async () => {
    await withHookTestContext(async (context) => {
      const marker = 'private-claude-fallback-marker';
      const target = Array.from({ length: 65 }, (_, index) => `${marker}-${index}`).join(' ');
      const attackerPatch = `diff --git ${target} ${target}`;
      const result = await context.runClaudeCodeHook({
        hook_event_name: 'PreToolUse',
        cwd: context.cwd,
        tool_name: 'apply_patch',
        tool_input: { command: attackerPatch },
      });

      expect(getHookDenyReason(result, 'claude-code')).toContain('CC Safety Net failed closed');
      expect(result.stdout).not.toContain(marker);
    });
  });

  describe('allowed commands', () => {
    test('allowed command produces no output', async () => {
      await expectNoHookOutput(runClaudeCodeHook, claudeCodeBashInput('git status'));
    });

    test('allows find delete for an explicit trusted temporary descendant', async () => {
      await withHookTestContext(async (context) => {
        await expectNoHookOutput(
          context.runClaudeCodeHook,
          context.claudeCodeBashInput('find /tmp/ccsn-perf-head.1T5B58 -depth -delete'),
        );
      });
    });

    test.each([
      `BASE_SOURCE="$(git show 849d475eddafc04fd57ab73887e53e8d5abfc1ea:username.py)" PYTHONDONTWRITEBYTECODE=1 python3 -c 'import os, runpy, sys, types, unittest; module = types.ModuleType("username"); exec(os.environ["BASE_SOURCE"], module.__dict__); sys.modules["username"] = module; namespace = runpy.run_path("tests/test_username.py", run_name="red_check"); suite = unittest.TestSuite([namespace["NormalizeUsernameTest"]("test_strips_surrounding_whitespace")]); result = unittest.TextTestRunner(verbosity=2).run(suite); raise SystemExit(0 if result.wasSuccessful() else 1)'`,
      `cd /Users/kenryu/Developer/420024-lab/pi-grok-cli && git add src/provider/billing.ts tests/provider/register.test.ts && git commit -m "fix: keep weekly usage block visible when creditUsagePercent is omitted

The credits endpoint omits creditUsagePercent until there is usage in the
period, so default to 0 instead of hiding the Weekly block at fresh-period start."`,
      'I have the onboarding context and the vault repo snapshot. Next I’m checking the connected app surfaces and the vault’s git remotes so I can filter out anything already handled or not actually actionable here.',
    ])('allows a historical path-canonicalization false positive', async (command) => {
      await withHookTestContext(async (context) => {
        await expectNoHookOutput(context.runClaudeCodeHook, context.claudeCodeBashInput(command));
      });
    });

    test('PowerShell WhatIf Remove-Item command produces no output', async () => {
      await withHookTestContext(async (context) => {
        await expectNoHookOutput(context.runClaudeCodeHook, {
          hook_event_name: 'PreToolUse',
          cwd: context.cwd,
          tool_name: 'PowerShell',
          tool_input: { command: 'Remove-Item .\\dist -Recurse -Force -WhatIf' },
        });
      });
    });

    test.each([
      ['unset', {}],
      ['all', { CC_SAFETY_NET_AUDIT_SCOPE: 'all' }],
      ['debug-only', { CC_SAFETY_NET_DEBUG: '1' }],
    ] as const)('records a redacted allowed command when the scope is %s', async (label, env) => {
      await withHookTestContext(async (context) => {
        const sessionId = `scope-${label}-allow`;
        await expectNoHookOutput(
          context.runClaudeCodeHook,
          { ...context.claudeCodeBashInput('TOKEN=secret git status'), session_id: sessionId },
          env,
        );

        const entry = readLatestAuditLogEntry(context.home, sessionId);
        expect(entry.decision).toBe('allow');
        expect(entry.reason).toBe('allowed');
        expect(entry.command).toContain('<redacted>');
        expect(entry.command).not.toContain('secret');
      });
    });

    test.each([
      ['blocked', { CC_SAFETY_NET_AUDIT_SCOPE: 'blocked' }],
      ['invalid', { CC_SAFETY_NET_AUDIT_SCOPE: 'everything' }],
      ['blocked-with-debug', { CC_SAFETY_NET_AUDIT_SCOPE: 'blocked', CC_SAFETY_NET_DEBUG: '1' }],
    ] as const)('suppresses allowed commands but still records denials when the scope is %s', async (label, env) => {
      await withHookTestContext(async (context) => {
        const allowSession = `scope-${label}-allow`;
        await expectNoHookOutput(
          context.runClaudeCodeHook,
          { ...context.claudeCodeBashInput('git status'), session_id: allowSession },
          env,
        );
        expect(readAuditLogEntriesForSession(context.home, allowSession)).toEqual([]);

        const denySession = `scope-${label}-deny`;
        await context.runClaudeCodeHook(
          { ...context.claudeCodeBashInput('git reset --hard'), session_id: denySession },
          env,
        );
        expect(readAuditLogEntriesForSession(context.home, denySession)).toMatchObject([
          { decision: 'deny', ruleId: 'git.reset-hard' },
        ]);
      });
    });

    test('leaves an allowed non-command tool route unrecorded', async () => {
      await withHookTestContext(async (context) => {
        const sessionId = 'scope-non-command-allow';
        writeFileSync(join(context.cwd, 'README.md'), 'public');
        await expectNoHookOutput(context.runClaudeCodeHook, {
          hook_event_name: 'PreToolUse',
          session_id: sessionId,
          cwd: context.cwd,
          tool_name: 'Read',
          tool_input: { file_path: join(context.cwd, 'README.md') },
        });

        expect(readAuditLogEntriesForSession(context.home, sessionId)).toEqual([]);
      });
    });

    test('a local rulebook enforces with no lockfile of any kind', async () => {
      await withHookTestContext(async (context) => {
        writeProjectRulesConfigWithoutRulebook(context.cwd);
        writeStarterRulebook(join(context.cwd, '.cc-safety-net/rules/project-rules/rulebook.json'));

        const result = JSON.parse(
          (await context.runClaudeCodeHook(context.claudeCodeBashInput('docker system prune')))
            .stdout,
        );

        expect(existsSync(join(context.cwd, '.cc-safety-net/rules/rule.lock'))).toBe(false);
        expect(result.hookSpecificOutput.permissionDecision).toBe('deny');
        expect(result.hookSpecificOutput.permissionDecisionReason).toContain(
          '[project-rules/block-docker-system-prune] Use targeted cleanup instead.',
        );
      });
    });
  });

  describe('offline decisions', () => {
    const originalFetch = globalThis.fetch;

    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    test('decides allowed and denied commands without any network access', async () => {
      await withHookTestContext(async (context) => {
        let fetchCalls = 0;
        globalThis.fetch = (() => {
          fetchCalls++;
          throw new Error('hook decisions must remain offline');
        }) as unknown as typeof fetch;

        await expectNoHookOutput(
          context.runClaudeCodeHook,
          context.claudeCodeBashInput('git status'),
        );
        expect(
          getHookDenyReason(
            await context.runClaudeCodeHook(context.claudeCodeBashInput('git reset --hard')),
            'claude-code',
          ),
        ).toContain('git reset --hard');
        expect(fetchCalls).toBe(0);
      });
    });
  });

  describe('non-target tool', () => {
    test('secret protection blocks non-Bash path-like tool input', async () => {
      const result = await runClaudeCodeHook({
        hook_event_name: 'PreToolUse',
        tool_name: 'Read',
        tool_input: { file_path: '.env' },
      });

      expectSecretProtectionDeny(result, 'claude-code');
      const reason = getHookDenyReason(result, 'claude-code');
      expect(reason).toContain('Rule: secret.basename.env');
      expect(reason).toContain('Command: .env');
      expect(reason).toContain('Tool: Read');
    });

    test('unknown command-scoped env assignment does not affect secret protection', async () => {
      const result = await runClaudeCodeHook(claudeCodeBashInput('IGNORED_FLAG=0 cat .env'));

      const reason = getHookDenyReason(result, 'claude-code');
      expect(reason).toContain('Access to a sensitive path is not allowed.');
      expect(reason).toContain('cat .env');
      expect(reason).toContain('Segment: .env');
      expect(reason).toContain('Tool: Bash');
    });

    test('env command assignment does not affect secret protection', async () => {
      const result = await runClaudeCodeHook(claudeCodeBashInput('env IGNORED_FLAG=0 cat .env'));

      expect(getHookDenyReason(result, 'claude-code')).toContain(
        'Access to a sensitive path is not allowed.',
      );
    });

    test('secret protection ignores non-sensitive non-Bash tool input', async () => {
      await expectNoHookOutput(runClaudeCodeHook, {
        hook_event_name: 'PreToolUse',
        tool_name: 'Read',
        tool_input: { file_path: 'README.md' },
      });
    });

    test('allows safe apply_patch context containing destructive command text', async () => {
      await expectNoHookOutput(runClaudeCodeHook, {
        hook_event_name: 'PreToolUse',
        tool_name: 'apply_patch',
        tool_input: {
          command: [
            '*** Begin Patch',
            '*** Update File: tests/example.test.ts',
            '@@',
            ' rm -rf ~',
            '*** End Patch',
          ].join('\n'),
        },
      });
    });

    test('secret protection ignores sensitive-looking edit content and grep patterns', async () => {
      const envFile = ['.', 'env'].join('');
      const keyName = ['id', 'rsa'].join('_');

      await expectNoHookOutput(runClaudeCodeHook, {
        hook_event_name: 'PreToolUse',
        tool_name: 'Edit',
        tool_input: {
          file_path: 'tests/core/secret-protection.test.ts',
          old_string: keyName,
          new_string: envFile,
        },
      });
      await expectNoHookOutput(runClaudeCodeHook, {
        hook_event_name: 'PreToolUse',
        tool_name: 'Grep',
        tool_input: { pattern: envFile, path: 'src' },
      });
    });

    test('secret protection blocks directory targets', async () => {
      const result = await runClaudeCodeHook({
        hook_event_name: 'PreToolUse',
        tool_name: 'Read',
        tool_input: { file_path: '~/.ssh' },
      });

      expectSecretProtectionDeny(result, 'claude-code');
      expect(getHookDenyReason(result, 'claude-code')).toContain('Command: ~/.ssh');
      expect(getHookDenyReason(result, 'claude-code')).toContain('Tool: Read');
    });

    test('secret protection parse errors fail closed before command analysis', async () => {
      const result = await runClaudeCodeHook(claudeCodeBashInput('rm -rf / ${'));

      expect(result.stderr).toBe('');
      expect(getHookDenyReason(result, 'claude-code')).toContain('CC Safety Net failed closed');
    });
  });

  describe('policy config protection', () => {
    test('allows read-only access to user policy file', async () => {
      await withHookTestContext(async (context) => {
        const policyPath = join(context.home, '.cc-safety-net', 'policy.json');
        await expectNoHookOutput(context.runClaudeCodeHook, {
          hook_event_name: 'PreToolUse',
          cwd: context.cwd,
          tool_name: 'Read',
          tool_input: { file_path: policyPath },
        });

        await expectNoHookOutput(
          context.runClaudeCodeHook,
          context.claudeCodeBashInput(`cat ${toShellPath(policyPath)}`),
        );
      });
    });

    test('denies user policy file mutation tools', async () => {
      await withHookTestContext(async (context) => {
        const policyPath = join(context.home, '.cc-safety-net', 'policy.json');
        for (const tool_name of ['Write', 'Edit', 'MultiEdit']) {
          const result = await context.runClaudeCodeHook({
            hook_event_name: 'PreToolUse',
            cwd: context.cwd,
            tool_name,
            tool_input: { file_path: policyPath, content: '{}' },
          });

          expect(getHookDenyReason(result, 'claude-code')).toContain(
            'This path contains the protected policy config and you must not modify or delete it.',
          );
        }
      });
    });

    test('denies bash writes and ambiguous commands touching user policy file', async () => {
      await withHookTestContext(async (context) => {
        const policyPath = join(context.home, '.cc-safety-net', 'policy.json');
        const shellPolicyPath = toShellPath(policyPath);
        for (const command of [
          `cat package.json > ${shellPolicyPath}`,
          `tee ${shellPolicyPath}`,
          `rm ${shellPolicyPath}`,
          `node script.js ${shellPolicyPath}`,
        ]) {
          const result = await context.runClaudeCodeHook(context.claudeCodeBashInput(command));

          expect(getHookDenyReason(result, 'claude-code')).toContain(
            'This path contains the protected policy config and you must not modify or delete it.',
          );
        }
      });
    });

    test('denies writes to the project policy path', async () => {
      await withHookTestContext(async (context) => {
        const result = await context.runClaudeCodeHook({
          hook_event_name: 'PreToolUse',
          cwd: context.cwd,
          tool_name: 'Write',
          tool_input: { file_path: '.cc-safety-net/policy.json', content: '{}' },
        });

        expect(getHookDenyReason(result, 'claude-code')).toContain(
          'This path contains the protected policy config and you must not modify or delete it.',
        );
      });
    });
  });

  describe('secret protection policy', () => {
    test('secret protection is enabled without policy or env flag', async () => {
      await withHookTestContext(async (context) => {
        const result = await context.runClaudeCodeHook({
          hook_event_name: 'PreToolUse',
          cwd: context.cwd,
          tool_name: 'Read',
          tool_input: { file_path: '.env' },
        });

        expectSecretProtectionDeny(result, 'claude-code');
        expect(getHookDenyReason(result, 'claude-code')).toContain('Rule: secret.basename.env');
      });
    });

    test('user policy can disable secret protection', async () => {
      await withHookTestContext(async (context) => {
        writeUserPolicy(context.home, { version: 1, secret_protection: { enabled: false } });

        await expectNoHookOutput(context.runClaudeCodeHook, {
          hook_event_name: 'PreToolUse',
          cwd: context.cwd,
          tool_name: 'Read',
          tool_input: { file_path: '.env' },
        });
      });
    });

    test('user policy deny paths and overrides affect secret protection', async () => {
      await withHookTestContext(async (context) => {
        writeUserPolicy(context.home, {
          version: 1,
          secret_protection: {
            overrides: { 'secret.pattern.env-variant': 'off' },
            deny_paths: ['private/token.txt'],
          },
        });

        await expectNoHookOutput(context.runClaudeCodeHook, {
          hook_event_name: 'PreToolUse',
          cwd: context.cwd,
          tool_name: 'Read',
          tool_input: { file_path: '.env.local' },
        });

        const result = await context.runClaudeCodeHook({
          hook_event_name: 'PreToolUse',
          cwd: context.cwd,
          tool_name: 'Read',
          tool_input: { file_path: 'private/token.txt' },
        });

        expectSecretProtectionDeny(result, 'claude-code');
        expect(getHookDenyReason(result, 'claude-code')).toContain('Rule: secret.deny-path');
      });
    });

    test('project policy disabling secret protection is honored', async () => {
      await withHookTestContext(async (context) => {
        writeProjectPolicy(context.cwd, {
          version: 1,
          secret_protection: { enabled: false, overrides: { 'secret.basename.env': 'off' } },
        });

        const result = await context.runClaudeCodeHook({
          hook_event_name: 'PreToolUse',
          cwd: context.cwd,
          tool_name: 'Read',
          tool_input: { file_path: '.env' },
        });

        expect(result.exitCode).toBe(0);
        expect(result.stdout).toBe('');
      });
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
    test('non-strict mode blocks invalid JSON', async () => {
      const result = await runClaudeCodeHook('{invalid json');

      expect(getHookDenyReason(result, 'claude-code')).toContain(
        'Failed to parse hook input JSON.',
      );
    });
  });

  describe('missing command', () => {
    test('missing command in tool_input fails closed', async () => {
      const input = {
        hook_event_name: 'PreToolUse',
        tool_name: 'Bash',
        tool_input: {},
      };

      expect(getHookDenyReason(await runClaudeCodeHook(input), 'claude-code')).toContain(
        'CC Safety Net failed closed',
      );
    });

    test('null tool_input fails closed', async () => {
      const input = {
        hook_event_name: 'PreToolUse',
        tool_name: 'Bash',
        tool_input: null,
      };

      expect(getHookDenyReason(await runClaudeCodeHook(input), 'claude-code')).toContain(
        'CC Safety Net failed closed',
      );
    });

    test('missing tool_input fails closed', async () => {
      const input = {
        hook_event_name: 'PreToolUse',
        tool_name: 'Bash',
      };

      expect(getHookDenyReason(await runClaudeCodeHook(input), 'claude-code')).toContain(
        'CC Safety Net failed closed',
      );
    });
  });

  describe('preflight audit', () => {
    test('audits path canonicalization limits with sanitized diagnostics', async () => {
      await withHookTestContext(async (context) => {
        const sessionId = 'path-canonicalization-limit-session';
        const result = await context.runClaudeCodeHook({
          ...context.claudeCodeBashInput(
            `echo ${Array.from({ length: 82 }, (_, index) =>
              [
                ...Array.from({ length: 200 }, (_, depth) => `p${index}x${depth}`),
                'policy.json',
              ].join('/'),
            ).join(' ')}`,
          ),
          session_id: sessionId,
        });

        expect(getHookDenyReason(result, 'claude-code')).toContain('exceeds safe analysis limits');
        const entries = readAuditLogEntriesForSession(context.home, sessionId);
        expect(entries).toMatchObject([
          {
            failureStage: 'policy-protection',
            errorCode: 'path-canonicalization-limit',
          },
        ]);
        expect(JSON.stringify(entries)).not.toContain('Path canonicalization work limit exceeded.');
      });
    });

    test('audits a missing tool name exactly once', async () => {
      await withHookTestContext(async (context) => {
        const sessionId = 'missing-tool-session';
        await context.runClaudeCodeHook({
          hook_event_name: 'PreToolUse',
          session_id: sessionId,
          cwd: context.cwd,
          tool_input: { command: 'git reset --hard' },
        });

        expect(readAuditLogEntriesForSession(context.home, sessionId)).toMatchObject([
          {
            agent: 'unknown',
            shape: 'claude-code',
            command: 'git reset --hard',
            reason:
              'CC Safety Net failed closed because command analysis failed unexpectedly. This is not caused by your command. Report it to the user.',
          },
        ]);
      });
    });

    test('audits an invalid cwd exactly once with available context', async () => {
      await withHookTestContext(async (context) => {
        const sessionId = 'invalid-cwd-session';
        const invalidCwd = join(context.cwd, 'missing');
        await context.runClaudeCodeHook({
          ...context.claudeCodeBashInput('git reset --hard'),
          session_id: sessionId,
          cwd: invalidCwd,
        });

        expect(readAuditLogEntriesForSession(context.home, sessionId)).toMatchObject([
          {
            toolName: 'Bash',
            command: 'git reset --hard',
            segment: invalidCwd,
            cwd: invalidCwd,
          },
        ]);
      });
    });

    test('redacts an untrusted invalid cwd before persisting it', async () => {
      await withHookTestContext(async (context) => {
        const sessionId = 'invalid-secret-cwd-session';
        const invalidCwd = join(context.cwd, 'API_TOKEN=cwd-preflight-canary');
        await context.runClaudeCodeHook({
          ...context.claudeCodeBashInput('git status'),
          session_id: sessionId,
          cwd: invalidCwd,
        });

        expect(readAuditLogEntriesForSession(context.home, sessionId)).toMatchObject([
          {
            segment: join(context.cwd, 'API_TOKEN=<redacted>'),
            cwd: join(context.cwd, 'API_TOKEN=<redacted>'),
          },
        ]);
        expect(
          listAuditLogFiles(join(context.home, '.cc-safety-net', 'logs')).join('\n'),
        ).not.toContain('cwd-preflight-canary');
      });
    });
  });
});

async function denialReason(context: HookTestContext, command: string): Promise<string> {
  const result = await context.runClaudeCodeHook(context.claudeCodeBashInput(command));
  const parsed = JSON.parse(result.stdout);

  expect(parsed.hookSpecificOutput.permissionDecision).toBe('deny');
  return parsed.hookSpecificOutput.permissionDecisionReason as string;
}

function writeProjectRulesConfigWithoutRulebook(cwd: string): void {
  rmSync(join(cwd, '.cc-safety-net/rules'), { recursive: true, force: true });
  writeDefaultRulesConfig(join(cwd, '.cc-safety-net/rules/rule.json'), ['project-rules']);
}
