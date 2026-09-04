import { describe, expect, test } from 'bun:test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, parse } from 'node:path';
import { PathCanonicalizationLimitError } from '@/analyzer/path-canonicalization';
import { REASON_RECURSION_LIMIT } from '@/analyzer/reasons';
import {
  evaluateGuard,
  type GuardDependencies,
  type GuardEvaluation,
  GuardEvaluationError,
  type GuardStage,
} from '@/engine/guard';
import { REASON_POLICY_APPLY_PROTECTION } from '@/guards/policy-apply-protection';
import { StructuralShellSyntaxLimitError } from '@/guards/semantic-facts';
import { parseCommand } from '@/parser/command';
import { getUserPolicyPath } from '@/policy/store';
import { quoteShellPath, toShellPath, withTempDir } from '../helpers';
import { policySnapshot, testModes } from '../helpers/policy';

const SNAPSHOT = policySnapshot();
const REASON_STRUCTURAL_COMMAND_VALIDATION_LIMIT =
  'CC Safety Net could not validate the command because its structure exceeds safe analysis limits.';
const REASON_COMMAND_ANALYSIS_LIMIT =
  'CC Safety Net could not analyze the command because it exceeds safe analysis limits. Simplify or split the command and retry.';

function structurallyLimitedFactParsers() {
  return {
    parseCommand: (source: string, dialect: Parameters<typeof parseCommand>[1]) =>
      parseCommand(source, dialect, {
        maxInputLength: 20,
        maxWords: 2,
        maxDepth: 10,
      }),
  };
}

function commandInvocation(cwd: string, command: string | null = 'git status') {
  return {
    toolName: 'Bash',
    input: command === null ? {} : { command },
    context: { configCwd: cwd, executionCwd: cwd },
    route: { kind: 'command' as const, shell: 'posix' as const },
    command,
  };
}

function nonCommandInvocation(cwd: string, input: unknown = { path: 'README.md' }) {
  return {
    toolName: 'Read',
    input,
    context: { configCwd: cwd, executionCwd: cwd },
    route: { kind: 'path' as const },
  };
}

function dependencies(
  overrides: Partial<GuardDependencies> = {},
  calls: string[] = [],
): GuardDependencies {
  return {
    findPolicyMutation: () => {
      calls.push('policy');
      return null;
    },
    findGitMetadataMutation: () => null,
    resolveGitMetadata: () => null,
    loadPolicySnapshot: () => {
      calls.push('config');
      return SNAPSHOT;
    },
    findSensitiveTarget: () => {
      calls.push('secret');
      return null;
    },
    analyzeCommand: () => {
      calls.push('analysis');
      return null;
    },
    getModes: () => testModes(),
    ...overrides,
  };
}

const strictModes = () => testModes('strict');

function captureGuardError(run: () => unknown): GuardEvaluationError {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(GuardEvaluationError);
    return error as GuardEvaluationError;
  }
  throw new Error('Expected guard evaluation to throw');
}

function captureNonCommandGuardError(cwd: string, input: unknown): GuardEvaluationError {
  return captureGuardError(() => evaluateGuard(nonCommandInvocation(cwd, input)));
}

function fallbackLimitPatch(marker: string): string {
  const target = Array.from({ length: 65 }, (_, index) => `${marker}-${index}`).join(' ');
  return `diff --git ${target} ${target}`;
}

function expectNonReflectiveToolInputLimit(error: GuardEvaluationError, marker: string): void {
  expect(error.stage).toBe('policy-protection');
  expect((error.cause as Error).constructor.name).toBe('ToolInputLimitError');
  expect((error.cause as Error).message).toBe('tool input traversal limit exceeded');
  expect(error.evaluation.decision).toEqual(
    expect.objectContaining({ kind: 'deny', intent: 'stop_and_explain', evidence: [] }),
  );
  expect(JSON.stringify(error.evaluation)).not.toContain(marker);
}

describe('guard evaluation', () => {
  test('denies an authoritative structurally limited command before guard dependencies', async () => {
    await withTempDir('cc-safety-net-guard-structural-command-', (cwd) => {
      const calls: string[] = [];
      const command = 'a a a';

      expect(
        evaluateGuard(commandInvocation(cwd, command), {
          dependencies: dependencies({}, calls),
          factParserDependencies: structurallyLimitedFactParsers(),
        }),
      ).toEqual({
        stage: 'command-analysis',
        decision: {
          kind: 'deny',
          reason: REASON_RECURSION_LIMIT,
          intent: 'stop_and_explain',
          evidence: [{ kind: 'command', command, segment: command }],
        },
      });
      expect(calls).toEqual([]);
    });
  });

  test.each([
    ['missing declared command', null, { command: 'a a a' }, 'command'],
    ['blank declared command', '   ', { command: 'a a a' }, 'command'],
    ['declared/input mismatch', 'git status', { command: 'a a a' }, 'command'],
    ['unknown route', undefined, { command: 'a a a' }, 'unknown'],
  ] as const)('denies a structurally limited input candidate during validation: %s', async (_label, declaredCommand, input, routeKind) => {
    await withTempDir('cc-safety-net-guard-structural-input-', (cwd) => {
      const calls: string[] = [];
      const invocation =
        routeKind === 'unknown'
          ? {
              toolName: 'custom_runner',
              input,
              context: { configCwd: cwd, executionCwd: cwd },
              route: { kind: 'unknown' as const },
            }
          : {
              ...commandInvocation(cwd, declaredCommand),
              input,
            };

      expect(
        evaluateGuard(invocation, {
          dependencies: dependencies({}, calls),
          factParserDependencies: structurallyLimitedFactParsers(),
        }),
      ).toEqual({
        stage: 'command-validation',
        decision: {
          kind: 'deny',
          reason: REASON_STRUCTURAL_COMMAND_VALIDATION_LIMIT,
          intent: 'stop_and_explain',
          evidence: [],
        },
      });
      expect(calls).toEqual([]);
    });
  });

  test('preserves unsafe tool-input validation ahead of structural command checks', async () => {
    await withTempDir('cc-safety-net-guard-structural-input-precedence-', (cwd) => {
      const input = Object.create({ command: 'a a a' });
      const error = captureGuardError(() =>
        evaluateGuard(
          {
            ...commandInvocation(cwd, 'a a a'),
            input,
          },
          {
            factParserDependencies: structurallyLimitedFactParsers(),
          },
        ),
      );

      expect(error.stage).toBe('policy-protection');
      expect(error.evaluation.decision).toEqual(
        expect.objectContaining({ kind: 'deny', evidence: [] }),
      );
    });
  });

  test('keeps ordinary guard validation and configuration precedence', async () => {
    await withTempDir('cc-safety-net-guard-ordinary-precedence-', (cwd) => {
      const calls: string[] = [];
      const result = evaluateGuard(commandInvocation(cwd, null), {
        dependencies: dependencies({}, calls),
        factParserDependencies: {
          parseCommand: (source, dialect) =>
            parseCommand(source, dialect, {
              maxInputLength: 20,
              maxWords: 20,
              maxDepth: 10,
            }),
        },
      });

      expect(result.stage).toBe('command-validation');
      if (result.decision.kind !== 'deny') throw new Error('Expected guard denial');
      expect(result.decision.reason).not.toBe(REASON_STRUCTURAL_COMMAND_VALIDATION_LIMIT);
      expect(calls).toEqual(['policy', 'config', 'secret']);
    });
  });

  test('deterministically denies the exact one-MiB structurally limited command', async () => {
    await withTempDir('cc-safety-net-guard-exact-structural-limit-', (cwd) => {
      const command = 'a '.repeat(524_288);
      const result = evaluateGuard(commandInvocation(cwd, command));

      expect(Buffer.byteLength(command)).toBe(1_048_576);
      expect(result.stage).toBe('command-analysis');
      expect(result.decision).toEqual(
        expect.objectContaining({
          kind: 'deny',
          reason: REASON_RECURSION_LIMIT,
          intent: 'stop_and_explain',
        }),
      );
    });
  });

  test('fails closed before policy evaluation when recursive tool input exceeds traversal bounds', async () => {
    await withTempDir('cc-safety-net-guard-input-bounds-', (cwd) => {
      const input: Record<string, unknown> = {};
      input.cycle = input;
      const error = captureNonCommandGuardError(cwd, input);

      expect(error.stage).toBe('policy-protection');
      expect(error.evaluation.decision).toEqual(
        expect.objectContaining({ kind: 'deny', intent: 'stop_and_explain' }),
      );
    });
  });

  test('fails closed without reflecting patch input when Git fallback work exceeds its limit', async () => {
    await withTempDir('cc-safety-net-guard-git-fallback-', (cwd) => {
      const marker = 'private-guard-fallback-marker';
      const attackerPatch = fallbackLimitPatch(marker);
      const error = captureGuardError(() =>
        evaluateGuard({
          ...nonCommandInvocation(cwd, { command: attackerPatch }),
          toolName: 'apply_patch',
          route: { kind: 'patch' as const },
        }),
      );

      expectNonReflectiveToolInputLimit(error, marker);
    });
  });

  test('does not reflect a declared command when command input shape exceeds its limit', async () => {
    await withTempDir('cc-safety-net-guard-command-shape-limit-', (cwd) => {
      const marker = 'private-declared-command-marker';
      const error = captureGuardError(() =>
        evaluateGuard({
          ...commandInvocation(cwd, marker),
          input: Object.create({ command: marker }),
        }),
      );

      expectNonReflectiveToolInputLimit(error, marker);
    });
  });

  test.each([
    ['inherited path', () => Object.create({ path: '.env' })],
    [
      'stateful getter',
      () =>
        Object.defineProperty({}, 'path', {
          enumerable: true,
          get: () => '.env',
        }),
    ],
  ])('fails closed for unsafe tool input shape: %s', async (_label, createInput) => {
    await withTempDir('cc-safety-net-guard-input-shape-', (cwd) => {
      const error = captureNonCommandGuardError(cwd, createInput());
      expect(error.stage).toBe('policy-protection');
      expect(error.evaluation.decision.kind).toBe('deny');
    });
  });

  test('does not read a stateful command getter while building failure evidence', async () => {
    await withTempDir('cc-safety-net-guard-command-getter-', (cwd) => {
      let getterCalls = 0;
      const input = Object.defineProperty({}, 'command', {
        enumerable: true,
        get: () => {
          getterCalls++;
          return 'rm -rf /';
        },
      });
      const error = captureNonCommandGuardError(cwd, input);

      expect(error.stage).toBe('policy-protection');
      expect(error.evaluation.decision).toEqual(
        expect.objectContaining({ kind: 'deny', evidence: [] }),
      );
      expect(getterCalls).toBe(0);
    });
  });

  test('runs policy, config, secret, and command analysis in order', async () => {
    await withTempDir('cc-safety-net-guard-order-', (cwd) => {
      const calls: string[] = [];

      expect(
        evaluateGuard(commandInvocation(cwd), { dependencies: dependencies({}, calls) }),
      ).toEqual({ stage: 'command-analysis', level: 'standard', decision: { kind: 'allow' } });
      expect(calls).toEqual(['policy', 'config', 'secret', 'analysis']);
    });
  });

  test('resolves Git metadata once and shares it with both protection paths', async () => {
    await withTempDir('cc-safety-net-guard-git-metadata-', (cwd) => {
      const metadata = Object.freeze({
        entries: Object.freeze([join(cwd, '.git')]),
        markerFiles: Object.freeze([]),
        directories: Object.freeze([join(cwd, '.git')]),
        hooksDirectories: Object.freeze([join(cwd, '.git', 'hooks')]),
      });
      let resolutions = 0;

      expect(
        evaluateGuard(commandInvocation(cwd), {
          dependencies: dependencies({
            resolveGitMetadata: () => {
              resolutions++;
              return metadata;
            },
            findGitMetadataMutation: (_facts, resolved) => {
              expect(resolved).toBe(metadata);
              return null;
            },
            analyzeCommand: (_command, options) => {
              expect(options.protectedGitMetadata).toBe(metadata);
              return null;
            },
          }),
        }),
      ).toEqual({ stage: 'command-analysis', level: 'standard', decision: { kind: 'allow' } });
      expect(resolutions).toBe(1);
    });
  });

  test('policy protection short-circuits before broken config loading', async () => {
    await withTempDir('cc-safety-net-guard-policy-', (cwd) => {
      const result = evaluateGuard(commandInvocation(cwd, 'rm policy.json'), {
        dependencies: dependencies({
          findPolicyMutation: () => ({ target: 'policy.json' }),
          loadPolicySnapshot: () => {
            throw new Error('must not load');
          },
        }),
      });

      expect(result).toEqual({
        stage: 'policy-protection',
        decision: {
          kind: 'deny',
          reason:
            'This path contains the protected policy config and you must not modify or delete it.',
          intent: 'hard_stop',
          evidence: [{ kind: 'command', command: 'rm policy.json', segment: 'policy.json' }],
        },
      });
    });
  });

  test('allows a review command that mentions the policy path inside its prompt', async () => {
    await withTempDir('cc-safety-net-guard-policy-prompt-', (cwd) => {
      const policyPath = getUserPolicyPath();
      const prompt = [
        `Review against this intentional contract: only canonical ${policyPath} is policy-protected.`,
        'Rule configs, locks, rulebooks, caches, and ordinary directory inspection are intentionally allowed.',
        'Recursive rm of the policy directory remains hard-blocked.',
        'Direct policy writes, patches, symlink aliases, redirects, and directly extractable malformed commands must remain protected.',
      ].join(' ');
      const command = [
        '/opt/autoreview --mode local',
        `--prompt '${prompt}'`,
        "--parallel-tests 'bun test tests/core/policy-protection.test.ts tests/engine/guard.test.ts tests/pi/tool-call.test.ts tests/bin/hooks/antigravity-cli-hook.test.ts tests/opencode/plugin.test.ts'",
        '--stream-engine-output',
      ].join(' ');

      expect(
        evaluateGuard(commandInvocation(cwd, command), {
          policyOptions: { userConfigDir: join(cwd, 'user-rules') },
        }),
      ).toEqual({ stage: 'command-analysis', level: 'standard', decision: { kind: 'allow' } });
    });
  });

  test('hard-stops direct policy file mutation commands', async () => {
    await withTempDir('cc-safety-net-guard-policy-mutation-', (cwd) => {
      const policyPath = getUserPolicyPath();
      const policyDirectory = dirname(policyPath);
      const shellPolicyPath = toShellPath(policyPath);
      const shellPolicyDirectory = toShellPath(policyDirectory);
      for (const command of [
        `printf '{}' > "${shellPolicyPath}"`,
        `tee "${shellPolicyPath}"`,
        `rm "${shellPolicyPath}"`,
        `mv "${shellPolicyDirectory}" /tmp/disabled-safety-net`,
        `mv -t /tmp "${shellPolicyPath}"`,
        `rm -rf "${shellPolicyDirectory}"`,
        `rm -rf "${toShellPath(dirname(policyDirectory))}"`,
        `POLICY="${shellPolicyPath}"; printf '{}' > "$POLICY"`,
        `cd "${shellPolicyDirectory}" && printf '{}' > policy.json`,
      ]) {
        expect(evaluateGuard(commandInvocation(cwd, command)), command).toMatchObject({
          stage: 'policy-protection',
          decision: { kind: 'deny', intent: 'hard_stop' },
        });
      }
    });
  });

  test('hard-stops agent invocations of policy apply', async () => {
    await withTempDir('cc-safety-net-guard-policy-apply-', (cwd) => {
      // Analyzer input strings only; nothing here is executed.
      for (const command of [
        'cc-safety-net policy apply proposal.json',
        'pnpm dlx cc-safety-net policy apply proposal.json',
      ]) {
        expect(evaluateGuard(commandInvocation(cwd, command)), command).toMatchObject({
          stage: 'policy-protection',
          decision: {
            kind: 'deny',
            intent: 'hard_stop',
            reason: REASON_POLICY_APPLY_PROTECTION,
            evidence: [{ kind: 'command', command, segment: command }],
          },
        });
      }
      expect(
        evaluateGuard(commandInvocation(cwd, 'cc-safety-net policy check proposal.json')).decision,
      ).not.toMatchObject({ reason: REASON_POLICY_APPLY_PROTECTION });
    });
  });

  test('secret protection precedes invalid config state', async () => {
    await withTempDir('cc-safety-net-guard-secret-', (cwd) => {
      const result = evaluateGuard(commandInvocation(cwd, 'cat .env'), {
        dependencies: dependencies({
          loadPolicySnapshot: () =>
            policySnapshot({ configFallbackReason: 'invalid policy config' }),
          findSensitiveTarget: () => ({ target: '.env', ruleId: 'secret.basename.env' }),
        }),
      });

      expect(result.stage).toBe('secret-protection');
      expect(result.decision).toEqual({
        kind: 'deny',
        reason: 'Access to a sensitive path is not allowed.',
        intent: 'hard_stop',
        ruleId: 'secret.basename.env',
        evidence: [{ kind: 'command', command: 'cat .env', segment: '.env' }],
      });
    });
  });

  test('honors secretProtection.enabled=false and skips secret discovery', async () => {
    await withTempDir('cc-safety-net-guard-secret-disabled-', (cwd) => {
      const calls: string[] = [];

      expect(
        evaluateGuard(nonCommandInvocation(cwd, { path: '.env' }), {
          dependencies: dependencies(
            {
              loadPolicySnapshot: () => {
                calls.push('config');
                return policySnapshot({ secretProtection: { enabled: false, denyPaths: [] } });
              },
            },
            calls,
          ),
        }),
      ).toEqual({ stage: 'non-command', level: 'standard', decision: { kind: 'allow' } });
      expect(calls).toEqual(['policy', 'config']);
    });
  });

  test('never disables secret protection because of a malformed user policy.json', async () => {
    await withTempDir('cc-safety-net-guard-secret-malformed-policy-', (cwd) => {
      const userConfigDir = join(cwd, 'user', 'rules');
      mkdirSync(dirname(userConfigDir), { recursive: true });
      writeFileSync(join(dirname(userConfigDir), 'policy.json'), '{ not valid json');

      const result = evaluateGuard(nonCommandInvocation(cwd, { path: '.env' }), {
        policyOptions: { userConfigDir },
      });

      expect(result.stage).toBe('secret-protection');
      expect(result.decision.kind).toBe('deny');
    });
  });

  test('threads the safety level into metadata-only secret discovery', async () => {
    await withTempDir('cc-safety-net-guard-secret-metadata-', (cwd) => {
      const command = 'test -f ~/.ssh/id_rsa';

      expect(evaluateGuard(commandInvocation(cwd, command))).toEqual({
        stage: 'command-analysis',
        level: 'standard',
        decision: { kind: 'allow' },
      });
      expect(
        evaluateGuard(commandInvocation(cwd, command), {
          dependencies: {
            getModes: strictModes,
          },
        }),
      ).toMatchObject({
        stage: 'secret-protection',
        decision: { kind: 'deny', ruleId: 'secret.home.ssh' },
      });
    });
  });

  test.skipIf(process.platform !== 'win32')(
    '[windows] applies mode-aware secret protection to unknown command candidates',
    async () => {
      await withTempDir('cc-safety-net-guard-unknown-metadata-', (cwd) => {
        const sensitivePath = join(cwd, '.env');
        const metadataCommands = [`ls ${sensitivePath}`, `stat ${sensitivePath}`];

        metadataCommands.forEach((command) => {
          expect(evaluateGuard(unknownInvocation(cwd, command))).toEqual({
            stage: 'non-command',
            level: 'standard',
            decision: { kind: 'allow' },
          });
          (['strict', 'paranoid'] as const).forEach((level) => {
            expect(
              evaluateGuard(unknownInvocation(cwd, command), {
                dependencies: { getModes: () => testModes(level) },
              }),
            ).toMatchObject({
              stage: 'secret-protection',
              level,
              decision: { kind: 'deny', ruleId: 'secret.basename.env' },
            });
          });
        });

        [`cat ${sensitivePath}`, `find "TOKEN" ${sensitivePath}`].forEach((command) => {
          expect(evaluateGuard(unknownInvocation(cwd, command))).toMatchObject({
            stage: 'secret-protection',
            decision: { kind: 'deny', ruleId: 'secret.basename.env' },
          });
        });

        const policyPath = getUserPolicyPath();
        const policyCommand = `rm ${policyPath}`;
        expect(evaluateGuard(unknownInvocation(cwd, policyCommand))).toEqual(
          expectedPolicyBlock(policyCommand, policyPath),
        );
      });
    },
  );

  test.skipIf(process.platform === 'win32')(
    'keeps non-Windows unknown-route metadata fallback conservative',
    async () => {
      await withTempDir('cc-safety-net-guard-unknown-posix-metadata-', (cwd) => {
        expect(evaluateGuard(unknownInvocation(cwd, `ls ${join(cwd, '.env')}`))).toMatchObject({
          stage: 'secret-protection',
          level: 'standard',
          decision: { kind: 'deny', ruleId: 'secret.basename.env' },
        });
      });
    },
  );

  test('keeps deny paths and built-in secrets protected inside a destructive allow path', async () => {
    await withTempDir('cc-safety-net-guard-allow-path-secret-', (cwd) => {
      // A destructive allow path only relaxes the analyzer; it must never widen
      // what the secret guard, which runs first, is willing to expose.
      const allowPath = join(cwd, 'x');
      const guardDependencies = {
        loadPolicySnapshot: () =>
          policySnapshot({
            destructiveCommandAllowPaths: [allowPath],
            secretProtection: { enabled: true, denyPaths: [join(allowPath, 'private')] },
          }),
        getModes: strictModes,
      };

      for (const [command, ruleId] of [
        [`rm -rf ${quoteShellPath(join(allowPath, 'private'))}`, 'secret.deny-path'],
        [`rm -rf ${quoteShellPath(join(allowPath, 'private', 'sub'))}`, 'secret.deny-path'],
        [`rm -rf ${quoteShellPath(join(allowPath, '.env'))}`, 'secret.basename.env'],
      ] as const) {
        expect(
          evaluateGuard(commandInvocation(cwd, command), { dependencies: guardDependencies }),
          command,
        ).toMatchObject({ stage: 'secret-protection', decision: { kind: 'deny', ruleId } });
      }

      expect(
        evaluateGuard(
          commandInvocation(cwd, `rm -rf ${quoteShellPath(join(allowPath, 'other'))}`),
          { dependencies: guardDependencies },
        ),
      ).toEqual({ stage: 'command-analysis', level: 'strict', decision: { kind: 'allow' } });
    });
  });

  test('allows inert JavaScript inline secret data in standard mode', async () => {
    await withTempDir('cc-safety-net-guard-secret-inline-data-', (cwd) => {
      const command = `node -e 'const cases = ["cat .env", "Bun.file(\\".env\\")"]; for (const value of cases) console.log(value)'`;

      expect(evaluateGuard(commandInvocation(cwd, command))).toEqual({
        stage: 'command-analysis',
        level: 'standard',
        decision: { kind: 'allow' },
      });

      for (const activeCommand of [
        `node -e 'const path = ".env"; require("fs").readFileSync(path, "utf8")'`,
        `bun -e 'const path = ".env"; Bun.file(path).text()'`,
      ]) {
        expect(evaluateGuard(commandInvocation(cwd, activeCommand)), activeCommand).toMatchObject({
          stage: 'secret-protection',
          decision: { kind: 'deny', ruleId: 'secret.basename.env' },
        });
      }
    });
  });

  test('does not analyze command-looking input on an unknown non-command route', async () => {
    await withTempDir('cc-safety-net-guard-unknown-', (cwd) => {
      let analyzed = false;
      const invocation = {
        toolName: 'custom_runner',
        input: { command: 'git reset --hard' },
        context: { configCwd: cwd, executionCwd: cwd },
        route: { kind: 'unknown' as const },
      };

      expect(
        evaluateGuard(invocation, {
          dependencies: dependencies({
            analyzeCommand: () => {
              analyzed = true;
              return null;
            },
          }),
        }),
      ).toEqual({ stage: 'non-command', level: 'standard', decision: { kind: 'allow' } });
      expect(analyzed).toBeFalse();
    });
  });

  test('allows non-command tools while a fallback config is enforced', async () => {
    await withTempDir('cc-safety-net-guard-config-', (cwd) => {
      expect(
        evaluateGuard(nonCommandInvocation(cwd), {
          dependencies: dependencies({
            loadPolicySnapshot: () =>
              policySnapshot({ configFallbackReason: 'invalid policy config' }),
          }),
        }),
      ).toEqual({
        stage: 'non-command',
        level: 'standard',
        configFallback: { reason: 'invalid policy config' },
        decision: { kind: 'allow' },
      });
    });
  });

  test('fails closed for a null command after secret protection', async () => {
    await withTempDir('cc-safety-net-guard-validation-', (cwd) => {
      const calls: string[] = [];

      expect(
        evaluateGuard(commandInvocation(cwd, null), { dependencies: dependencies({}, calls) }),
      ).toEqual({
        stage: 'command-validation',
        level: 'standard',
        decision: {
          kind: 'deny',
          reason:
            'CC Safety Net failed closed because command analysis failed unexpectedly. This is not caused by your command. Report it to the user.',
          intent: 'stop_and_explain',
          evidence: [],
        },
      });
      expect(calls).toEqual(['policy', 'config', 'secret']);
    });
  });

  test('analyzes commands normally while a fallback config is enforced', async () => {
    await withTempDir('cc-safety-net-guard-recovery-', (cwd) => {
      const root = toShellPath(parse(getUserPolicyPath()).root);
      const options = {
        dependencies: {
          loadPolicySnapshot: () => policySnapshot({ configFallbackReason: 'missing lockfile' }),
        },
      };

      // No command is special-cased any more: the fallback state neither widens nor
      // narrows analysis, it only rides along on the report.
      expect(
        evaluateGuard(commandInvocation(cwd, 'npx -y cc-safety-net rule sync'), options),
      ).toEqual({
        stage: 'command-analysis',
        level: 'standard',
        configFallback: { reason: 'missing lockfile' },
        decision: { kind: 'allow' },
      });
      expect(
        evaluateGuard(
          commandInvocation(cwd, `npx -y cc-safety-net rule sync && rm -rf ${root}`),
          options,
        ).decision,
      ).toMatchObject({
        kind: 'deny',
        reason:
          'This path contains the protected policy config and you must not modify or delete it.',
        intent: 'hard_stop',
      });
    });
  });

  test.each([
    ['policy-protection', 'findPolicyMutation'],
    ['policy-protection', 'resolveGitMetadata'],
    ['policy-protection', 'findGitMetadataMutation'],
    ['config-load', 'loadPolicySnapshot'],
    ['secret-protection', 'findSensitiveTarget'],
    ['command-analysis', 'analyzeCommand'],
  ] as const)('wraps %s dependency failures with a generic denial', async (stage, dependency) => {
    await withTempDir(`cc-safety-net-guard-error-${stage}-`, (cwd) => {
      const cause = new Error(`${stage} failed`);
      const error = captureGuardError(() =>
        evaluateGuard(commandInvocation(cwd), {
          dependencies: dependencies({
            [dependency]: () => {
              throw cause;
            },
          }),
        }),
      );

      expect(error.stage).toBe(stage as GuardStage);
      expect(error.cause).toBe(cause);
      expect(error.evaluation).toEqual({
        stage,
        decision: {
          kind: 'deny',
          reason:
            'CC Safety Net failed closed because command analysis failed unexpectedly. This is not caused by your command. Report it to the user.',
          intent: 'stop_and_explain',
          evidence: [{ kind: 'command', command: 'git status', segment: 'git status' }],
        },
      });
    });
  });

  test.each([
    ['path canonicalization', () => new PathCanonicalizationLimitError()],
    ['structural shell syntax', () => new StructuralShellSyntaxLimitError()],
  ] as const)('reports analysis-limit dependency failures with the limit reason: %s', async (label, createCause) => {
    await withTempDir(`cc-safety-net-guard-limit-reason-${label.replace(/ /g, '-')}-`, (cwd) => {
      const cause = createCause();
      const error = captureGuardError(() =>
        evaluateGuard(commandInvocation(cwd), {
          dependencies: dependencies({
            findPolicyMutation: () => {
              throw cause;
            },
          }),
        }),
      );

      expect(error.stage).toBe('policy-protection');
      expect(error.cause).toBe(cause);
      expect(error.evaluation.decision).toMatchObject({
        kind: 'deny',
        reason: REASON_COMMAND_ANALYSIS_LIMIT,
      });
    });
  });

  test('allows path-token-dense commands end-to-end', async () => {
    await withTempDir('cc-safety-net-guard-token-flood-', (cwd) => {
      const command = `echo ${Array.from({ length: 256 }, (_, index) => `d${index}/e${index}/f${index}`).join(' ')}`;

      expect(evaluateGuard(commandInvocation(cwd, command))).toEqual({
        stage: 'command-analysis',
        level: 'standard',
        decision: { kind: 'allow' },
      });
    });
  });

  test('keeps git.reset-hard denials intact', async () => {
    await withTempDir('cc-safety-net-guard-reset-control-', (cwd) => {
      expect(evaluateGuard(commandInvocation(cwd, 'git reset --hard origin/main'))).toMatchObject({
        stage: 'command-analysis',
        decision: { kind: 'deny', ruleId: 'git.reset-hard' },
      });
    });
  });

  test('keeps audit persistence concerns out of guard evaluations', async () => {
    await withTempDir('cc-safety-net-guard-audit-', (cwd) => {
      const blocked = evaluateGuard(commandInvocation(cwd, 'git reset --hard'), {
        dependencies: dependencies({
          analyzeCommand: () => ({
            kind: 'deny',
            reason: 'reset blocked',
            ruleId: 'git.reset-hard',
            intent: 'use_alternative',
            evidence: [
              { kind: 'command', command: 'git reset --hard', segment: 'git reset --hard' },
            ],
          }),
        }),
      });
      const allowed = evaluateGuard(commandInvocation(cwd), {
        auditAllowed: true,
        dependencies: dependencies(),
      });
      const ordinaryAllowed = evaluateGuard(commandInvocation(cwd), {
        dependencies: dependencies(),
      });

      expect(blocked).not.toHaveProperty('audit');
      expect(allowed).not.toHaveProperty('audit');
      expect(ordinaryAllowed).not.toHaveProperty('audit');
      expect(allowed).toEqual(ordinaryAllowed);
    });
  });

  test('reports the analyzer decision unchanged', async () => {
    await withTempDir('cc-safety-net-guard-decision-', (cwd) => {
      const decision = {
        kind: 'deny' as const,
        reason: 'blocked',
        intent: 'scope_down' as const,
        evidence: [{ kind: 'command' as const, command: 'danger', segment: 'danger' }],
      };
      const result = evaluateGuard(commandInvocation(cwd, 'danger'), {
        dependencies: dependencies({ analyzeCommand: () => decision }),
      });

      expect(result.decision).toEqual(decision);
    });
  });

  test('uses actual dependencies by default', async () => {
    await withTempDir('cc-safety-net-guard-default-', (cwd) => {
      expect(evaluateGuard(commandInvocation(cwd))).toEqual({
        stage: 'command-analysis',
        level: 'standard',
        decision: { kind: 'allow' },
      });
    });
  });

  test('preserves secret target ordering across here-data and legacy redirects', async () => {
    await withTempDir('cc-safety-net-guard-redirection-order-', (cwd) => {
      expect(evaluateGuard(commandInvocation(cwd, 'echo <<< .env'))).toEqual({
        stage: 'command-analysis',
        level: 'standard',
        decision: { kind: 'allow' },
      });

      for (const command of [
        'echo < .env',
        'echo<.env',
        'echo > .env',
        'cat foo < .env',
        'cat .env < input',
        'cat foo > .env',
        'cat .env > output',
        'cat foo >> .env',
        'cat .env >> output',
        'cat foo <> .env',
        'cat .env <> file',
        'cat foo <& .env',
        'cat .env <& 0',
        'cat foo >& .env',
        'cat .env >& output',
        'cat foo &> .env',
        'cat .env &> output',
        'cat foo &>> .env',
        'cat .env &>> output',
        'rm foo < .env',
        'cat <<< .env',
        'cat<<<.env',
        'cat << .env',
        'cat<<.env',
        'cat foo <<< .env',
        'cat .env <<< ~/.ssh/id_rsa',
        'cat .env >| ~/.ssh/id_rsa',
      ]) {
        expect(evaluateGuard(commandInvocation(cwd, command))).toEqual(
          expectedSecretBlock(command),
        );
      }
    });
  });

  test('treats here-data values as data rather than policy mutation targets', async () => {
    await withTempDir('cc-safety-net-guard-policy-here-data-', (cwd) => {
      const target = toShellPath(getUserPolicyPath());
      const command = `rm <<< ${target}`;

      expect(evaluateGuard(commandInvocation(cwd, command))).toEqual({
        stage: 'command-analysis',
        level: 'standard',
        decision: { kind: 'allow' },
      });
    });
  });

  test('leaves boundaries after missing here-data targets for later policy evaluation', async () => {
    await withTempDir('cc-safety-net-guard-missing-here-policy-', (cwd) => {
      const target = toShellPath(getUserPolicyPath());
      const commands = [
        `cat <<< ; rm ${target}`,
        `cat << ; rm ${target}`,
        `cat < < ; rm ${target}`,
        `cat <<<\nrm ${target}`,
        `cat <<\r\nrm ${target}`,
      ];

      for (const command of commands) {
        expect(evaluateGuard(commandInvocation(cwd, command))).toEqual(
          expectedPolicyBlock(command, target),
        );
        expect(evaluateGuard(unknownInvocation(cwd, command))).toEqual(
          expectedPolicyBlock(command, target),
        );
      }
    });
  });

  test('leaves boundaries after missing here-data targets for later secret evaluation', async () => {
    await withTempDir('cc-safety-net-guard-missing-here-secret-', (cwd) => {
      for (const command of [
        'echo <<< ; cat .env',
        'echo << ; cat .env',
        'echo <<<\ncat .env',
        'echo <<\r\ncat .env',
      ]) {
        expect(evaluateGuard(commandInvocation(cwd, command))).toEqual(
          expectedSecretBlock(command),
        );
      }
    });
  });

  test('uses mode-aware fallback for a missing heredoc delimiter', async () => {
    await withTempDir('cc-safety-net-guard-missing-here-eof-', (cwd) => {
      for (const command of ['cat <<<', 'cat <<', 'cat < <']) {
        expect(evaluateGuard(commandInvocation(cwd, command))).toEqual({
          stage: 'command-analysis',
          level: 'standard',
          decision: { kind: 'allow' },
        });
      }

      expect(
        evaluateGuard(commandInvocation(cwd, 'cat <<'), {
          dependencies: {
            getModes: strictModes,
          },
        }),
      ).toEqual({
        stage: 'command-analysis',
        level: 'strict',
        decision: {
          kind: 'deny',
          intent: 'stop_and_explain',
          reason: 'Unsupported heredoc syntax: heredoc redirection requires a delimiter word',
          evidence: [{ kind: 'command', command: 'cat <<', segment: 'cat <<' }],
        },
      });
    });
  });

  test('keeps process-substitution operators out of the legacy boundary set', async () => {
    await withTempDir('cc-safety-net-guard-process-substitution-', (cwd) => {
      for (const command of ['echo ok <(cat .env)', 'echo ok >(cat .env)']) {
        expect(evaluateGuard(commandInvocation(cwd, command))).toEqual({
          stage: 'command-analysis',
          level: 'standard',
          decision: { kind: 'allow' },
        });
      }

      for (const command of ['cat README.md <(cat .env)', 'cat README.md >(cat .env)']) {
        expect(evaluateGuard(commandInvocation(cwd, command))).toEqual(
          expectedSecretBlock(command),
        );
      }
    });
  });

  test('treats a quoted heredoc body as literal data but still scans unquoted ones', async () => {
    await withTempDir('cc-safety-net-guard-quoted-heredoc-', (cwd) => {
      const nested = `git commit -m "$(cat <<'EOF'\nsee \`cat .env\` here\nEOF\n)"`;
      expect(evaluateGuard(commandInvocation(cwd, nested))).toEqual({
        stage: 'command-analysis',
        level: 'standard',
        decision: { kind: 'allow' },
      });

      const unquoted = 'cat <<EOF\n$(cat .env)\nEOF';
      expect(evaluateGuard(commandInvocation(cwd, unquoted))).toEqual(
        expectedSecretBlock(unquoted),
      );

      const executed = "bash <<'EOF'\ncat .env\nEOF";
      expect(evaluateGuard(commandInvocation(cwd, executed))).toEqual(
        expectedSecretBlock(executed),
      );
    });
  });

  test('passes explicit policy paths without runtime repair', async () => {
    await withTempDir('cc-safety-net-guard-config-options-', (cwd) => {
      let received: unknown;

      evaluateGuard(commandInvocation(cwd), {
        policyOptions: { userConfigDir: '/user-rules' },
        dependencies: dependencies({
          loadPolicySnapshot: (options) => {
            received = options;
            return SNAPSHOT;
          },
        }),
      });

      expect(received).toEqual({
        userConfigDir: '/user-rules',
        cwd,
      });
    });
  });
});

function expectedSecretBlock(command: string): GuardEvaluation {
  return {
    stage: 'secret-protection',
    level: 'standard',
    decision: {
      kind: 'deny',
      reason: 'Access to a sensitive path is not allowed.',
      intent: 'hard_stop',
      ruleId: 'secret.basename.env',
      evidence: [{ kind: 'command', command, segment: '.env' }],
    },
  };
}

function expectedPolicyBlock(command: string, target: string): GuardEvaluation {
  return {
    stage: 'policy-protection',
    decision: {
      kind: 'deny',
      reason:
        'This path contains the protected policy config and you must not modify or delete it.',
      intent: 'hard_stop',
      evidence: [{ kind: 'command', command, segment: target }],
    },
  };
}

function unknownInvocation(cwd: string, command: string) {
  return {
    toolName: 'custom_runner',
    input: { command },
    context: { configCwd: cwd, executionCwd: cwd },
    route: { kind: 'unknown' as const },
  };
}
