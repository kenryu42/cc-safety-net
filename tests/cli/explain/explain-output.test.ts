import { describe, expect, test } from 'bun:test';
import { join, parse } from 'node:path';
import { analyzeCommand } from '@/analyzer';
import { explainCommand, formatTraceHuman } from '@/cli/explain';
import { REASON_POLICY_CONFIG_PROTECTION } from '@/guards/policy-protection';
import type { TraceStep } from '@/ir/command-trace';
import type { ExplainResult } from '@/ir/explain';
import { getUserPolicyPath } from '@/policy/store';
import { getTraceSteps, toShellPath, withEnv, withStdoutColor } from '../../helpers';
import { TEST_ENVIRONMENT } from '../../helpers/environment';
import { policySnapshot, testModes } from '../../helpers/policy';

const ROOT = parse(process.cwd()).root;
const OPTIONS = {
  cwd: join(ROOT, 'tmp', 'cc-safety-net-explain-output-no-config'),
  userConfigDir: join(ROOT, 'tmp', 'cc-safety-net-explain-output-no-home'),
};
const GIT_REASON =
  "git reset --hard destroys all uncommitted changes permanently. Use 'git stash' first.";
const RM_REASON =
  'rm -rf targeting root or home directory is extremely dangerous and always blocked.';

function exactBlocked(
  command: string,
  tokens: string[],
  steps: TraceStep[],
  reason: string,
  segment = command,
  effectiveLevel: ExplainResult['effectiveLevel'] = 'standard',
) {
  return {
    trace: {
      steps: [{ type: 'parse', input: command, segments: [tokens] }],
      segments: [{ index: 0, steps }],
    },
    result: 'blocked',
    reason,
    segment,
    customRule: undefined,
    configSource: null,
    configValid: true,
    effectiveLevel,
  };
}

function exactAllowed(command: string, tokens: string[], steps: TraceStep[]) {
  return {
    trace: {
      steps: [{ type: 'parse', input: command, segments: [tokens] }],
      segments: [{ index: 0, steps }],
    },
    result: 'allowed',
    reason: undefined,
    segment: undefined,
    customRule: undefined,
    configSource: null,
    configValid: true,
    effectiveLevel: 'standard',
  };
}

describe('explain output', () => {
  // Root/home rm is shadowed by the policy-config pre-analysis stage (the filesystem root is an
  // ancestor of the user policy directory), exactly as the runtime guard blocks it first.
  test('preserves the exact root-or-home rm shadowed by policy protection payload', () => {
    withEnv({ TMPDIR: '/tmp/explain-output-tmpdir' }, () => {
      const root = toShellPath(parse(getUserPolicyPath()).root);
      expect(
        explainCommand(`rm -rf ${root}`, { ...OPTIONS, policySnapshot: policySnapshot() }),
      ).toMatchObject({
        trace: {
          steps: [],
          segments: [
            {
              index: 0,
              steps: [
                {
                  type: 'rule-check',
                  rule: 'policy-protection:findPolicyConfigMutationTargetInSemanticFacts',
                  matched: true,
                  reason: REASON_POLICY_CONFIG_PROTECTION,
                },
              ],
            },
          ],
        },
        result: 'blocked',
        reason: REASON_POLICY_CONFIG_PROTECTION,
        segment: root,
        ruleId: 'policy-protection',
        configSource: null,
        configValid: true,
        effectiveLevel: 'standard',
      });
    });
  });

  for (const fixture of [
    {
      name: 'disabled Git rule',
      command: 'git reset --hard',
      disabled: ['git.reset-hard'],
      expected: exactAllowed(
        'git reset --hard',
        ['git', 'reset', '--hard'],
        [
          { type: 'rule-check', rule: 'git:analyzeGitMatch', matched: false },
          { type: 'fallback-scan', tokensScanned: [] },
          { type: 'custom-rules-check', rulesChecked: false, matched: false },
        ],
      ),
    },
    {
      name: 'disabled find rule',
      command: 'find . -delete',
      disabled: ['find.delete'],
      expected: exactAllowed(
        'find . -delete',
        ['find', '.', '-delete'],
        [
          {
            type: 'rule-check',
            rule: 'analyzer/find.ts:analyzeFindMatch',
            matched: false,
          },
          { type: 'fallback-scan', tokensScanned: [] },
          { type: 'custom-rules-check', rulesChecked: false, matched: false },
        ],
      ),
    },
    {
      name: 'disabled fallback Git rule',
      command: 'tool -x git reset --hard',
      disabled: ['git.reset-hard'],
      expected: exactAllowed(
        'tool -x git reset --hard',
        ['tool', '-x', 'git', 'reset', '--hard'],
        [
          { type: 'fallback-scan', tokensScanned: ['-x', 'git', 'reset', '--hard'] },
          { type: 'custom-rules-check', rulesChecked: false, matched: false },
        ],
      ),
    },
    {
      name: 'disabled nested shell Git rule',
      command: 'bash -c "git reset --hard"',
      disabled: ['git.reset-hard'],
      expected: exactAllowed(
        'bash -c "git reset --hard"',
        ['bash', '-c', 'git reset --hard'],
        [
          { type: 'shell-wrapper', wrapper: 'bash', innerCommand: 'git reset --hard' },
          {
            type: 'recurse',
            reason: 'shell-wrapper',
            innerCommand: 'git reset --hard',
            depth: 1,
          },
          { type: 'rule-check', rule: 'git:analyzeGitMatch', matched: false },
          { type: 'fallback-scan', tokensScanned: [] },
          { type: 'custom-rules-check', rulesChecked: false, matched: false },
        ],
      ),
    },
  ]) {
    test(`reports the guard's allow for a ${fixture.name}`, () => {
      withEnv({ TMPDIR: '/tmp/explain-output-tmpdir' }, () => {
        const snapshot = policySnapshot({
          destructiveCommandRuleOverrides: Object.fromEntries(
            fixture.disabled.map((id) => [id, 'off'] as const),
          ),
        });
        expect(
          analyzeCommand(fixture.command, {
            policySnapshot: snapshot,
            environment: TEST_ENVIRONMENT,
            effectiveCapabilities: testModes().capabilities,
            protectedGitMetadata: null,
          }),
        ).toBeNull();
        expect(
          explainCommand(fixture.command, { ...OPTIONS, policySnapshot: snapshot }),
        ).toMatchObject(fixture.expected);
      });
    });
  }

  test('rule overrides drop raw, AWK, and interpreter matches exactly as the guard does', () => {
    const rawReason =
      'Unparseable command text contains a destructive pattern (rm -rf). Rewrite as a plain, parseable command so it can be analyzed.';
    const awkDynamicReason =
      'Detected awk system(), pipe, or getline command with dynamic command that cannot be safely analyzed. Use a literal command or process the data without system(), pipes, or getline.';
    const interpreterReason =
      'Interpreter code contains a dangerous command. Run the underlying command directly so it can be analyzed, or use the safer alternative for that command.';
    const nestedRawReason =
      'Unparseable command text contains a destructive pattern (git reset --hard). Rewrite as a plain, parseable command so it can be analyzed.';
    const interpreterSteps: TraceStep[] = [
      {
        type: 'interpreter',
        interpreter: 'python',
        codeArg: "os.system('git reset --hard')",
        paranoidBlocked: false,
      },
      {
        type: 'recurse',
        reason: 'interpreter',
        innerCommand: "os.system('git reset --hard')",
        depth: 1,
      },
      {
        type: 'dangerous-text',
        token: 'os.system(git reset --hard',
        matched: true,
        reason: nestedRawReason,
      },
    ];
    const fixtures = [
      {
        id: 'raw-text.dangerous-command',
        command: "'rm -rf /tmp/cache",
        expected: exactBlocked(
          "'rm -rf /tmp/cache",
          ['rm -rf /tmp/cache'],
          [
            {
              type: 'dangerous-text',
              token: 'rm -rf /tmp/cache',
              matched: true,
              reason: rawReason,
            },
          ],
          rawReason,
        ),
        allowed: exactAllowed(
          "'rm -rf /tmp/cache",
          ['rm -rf /tmp/cache'],
          [{ type: 'dangerous-text', token: 'rm -rf /tmp/cache', matched: false }],
        ),
      },
      {
        id: 'git.reset-hard',
        command: `awk 'BEGIN { system("git reset --hard") }'`,
        expected: exactBlocked(
          `awk 'BEGIN { system("git reset --hard") }'`,
          ['awk', 'BEGIN { system("git reset --hard") }'],
          [
            {
              type: 'rule-check',
              rule: 'git:analyzeGitMatch',
              matched: true,
              reason: GIT_REASON,
            },
            {
              type: 'rule-check',
              rule: 'awk:analyzeAwkSystemCallMatch',
              matched: true,
              reason: GIT_REASON,
            },
          ],
          GIT_REASON,
          'awk BEGIN { system("git reset --hard") }',
        ),
        allowed: exactAllowed(
          `awk 'BEGIN { system("git reset --hard") }'`,
          ['awk', 'BEGIN { system("git reset --hard") }'],
          [
            { type: 'rule-check', rule: 'git:analyzeGitMatch', matched: false },
            { type: 'fallback-scan', tokensScanned: [] },
            { type: 'custom-rules-check', rulesChecked: false, matched: false },
            { type: 'fallback-scan', tokensScanned: [] },
            { type: 'custom-rules-check', rulesChecked: false, matched: false },
          ],
        ),
      },
      {
        id: 'awk.system-dynamic',
        command: `awk '{ system($0) }'`,
        expected: exactBlocked(
          `awk '{ system($0) }'`,
          ['awk', '{ system($0) }'],
          [
            {
              type: 'rule-check',
              rule: 'awk:analyzeAwkSystemCallMatch',
              matched: true,
              reason: awkDynamicReason,
            },
          ],
          awkDynamicReason,
          'awk { system($0) }',
        ),
        allowed: exactAllowed(
          `awk '{ system($0) }'`,
          ['awk', '{ system($0) }'],
          [
            { type: 'fallback-scan', tokensScanned: [] },
            { type: 'custom-rules-check', rulesChecked: false, matched: false },
          ],
        ),
      },
      {
        id: 'interpreter.dangerous-command',
        command: `python -c "os.system('git reset --hard')"`,
        expected: exactBlocked(
          `python -c "os.system('git reset --hard')"`,
          ['python', '-c', "os.system('git reset --hard')"],
          [
            ...interpreterSteps,
            {
              type: 'dangerous-text',
              token: "os.system('git reset --hard')",
              matched: true,
              reason: interpreterReason,
            },
          ],
          interpreterReason,
          "python -c os.system('git reset --hard')",
        ),
        allowed: exactAllowed(
          `python -c "os.system('git reset --hard')"`,
          ['python', '-c', "os.system('git reset --hard')"],
          interpreterSteps,
        ),
      },
    ];

    for (const fixture of fixtures) {
      expect(
        explainCommand(fixture.command, { ...OPTIONS, policySnapshot: policySnapshot() }),
      ).toMatchObject(fixture.expected);
      const disabled = policySnapshot({
        destructiveCommandRuleOverrides: { [fixture.id]: 'off' },
      });
      expect(
        explainCommand(fixture.command, { ...OPTIONS, policySnapshot: disabled }),
      ).toMatchObject(fixture.allowed);
      expect(
        analyzeCommand(fixture.command, {
          policySnapshot: disabled,
          environment: TEST_ENVIRONMENT,
          effectiveCapabilities: testModes().capabilities,
          protectedGitMetadata: null,
        }),
      ).toBeNull();
    }

    const paranoidReason =
      'Interpreter one-liners are blocked by the active safety policy. Write the code to a script file and run it, or run the equivalent shell command directly.';
    const paranoidExpected = exactBlocked(
      'python -c "print(1)"',
      ['python', '-c', 'print(1)'],
      [
        {
          type: 'interpreter',
          interpreter: 'python',
          codeArg: 'print(1)',
          paranoidBlocked: true,
        },
      ],
      paranoidReason,
      'python -c print(1)',
      'custom',
    );
    for (const disabledRuleIds of [[], ['interpreter.one-liner-paranoid']]) {
      const result = explainCommand('python -c "print(1)"', {
        ...OPTIONS,
        policySnapshot: policySnapshot({
          destructiveCommandRuleOverrides: Object.fromEntries(
            disabledRuleIds.map((id) => [id, 'off'] as const),
          ),
          safety: { overrides: { paranoidInterpreters: true } },
        }),
      });
      if (disabledRuleIds.length > 0) {
        expect(result.result).toBe('allowed');
      } else {
        expect(result).toMatchObject(paranoidExpected);
      }
    }
    expect(
      analyzeCommand('python -c "print(1)"', {
        policySnapshot: policySnapshot({
          destructiveCommandRuleOverrides: { 'interpreter.one-liner-paranoid': 'off' },
          safety: { overrides: { paranoidInterpreters: true } },
        }),
        environment: TEST_ENVIRONMENT,
        effectiveCapabilities: testModes().capabilities,
        protectedGitMetadata: null,
      }),
    ).toBeNull();
  });

  test('strict unclosed quotes preserve the exact segment-free payload', () => {
    const reason =
      'Command could not be safely analyzed (strict mode). Simplify the command and retry, or ask the user to verify.';
    expect(
      explainCommand('echo "unclosed', {
        ...OPTIONS,
        strict: true,
        policySnapshot: policySnapshot(),
      }),
    ).toMatchObject({
      trace: {
        steps: [
          { type: 'parse', input: 'echo "unclosed', segments: [['echo', 'unclosed']] },
          { type: 'strict-unparseable', rawCommand: 'echo "unclosed', reason },
        ],
        segments: [],
      },
      result: 'blocked',
      reason,
      segment: 'echo "unclosed',
      customRule: undefined,
      configSource: null,
      configValid: true,
      effectiveLevel: 'strict',
    });
  });

  test('a fallback policy still analyzes PowerShell Remove-Item', () => {
    // Invalid configuration no longer suppresses analysis: the fallback policy is a
    // real enforcement policy, so explain reports what the guard would decide.
    expect(
      explainCommand('Remove-Item . -Recurse -Force', {
        ...OPTIONS,
        policySnapshot: policySnapshot({ configFallbackReason: 'invalid config' }),
      }),
    ).toMatchObject({
      result: 'blocked',
      ruleId: 'powershell.remove-item-recursive-force-cwd-self',
      segment: 'Remove-Item . -Recurse -Force',
      customRule: undefined,
      configSource: null,
      configValid: true,
      effectiveLevel: 'standard',
    });
  });

  test('PowerShell analysis keeps the exact legacy POSIX display projection', () => {
    const command = String.raw`Remove-Item C:\Windows -Recurse -Force`;
    const reason =
      'PowerShell Remove-Item -Recurse -Force outside cwd is blocked. Retry deleting only explicit paths inside the current directory; escalate for anything outside it.';
    const result = explainCommand(command, {
      ...OPTIONS,
      policySnapshot: policySnapshot(),
    });

    expect(result).toMatchObject(
      exactBlocked(
        command,
        ['Remove-Item', 'C:Windows', '-Recurse', '-Force'],
        [
          {
            type: 'rule-check',
            rule: 'analyzer/powershell/remove-item.ts:analyzePowerShellCommandViewMatch',
            matched: true,
            reason,
          },
        ],
        reason,
      ),
    );
    const human = withStdoutColor(false, () => formatTraceHuman(result));
    expect(human).toContain('Remove-Item C:\\Windows -Recurse -Force');
    expect(human).toContain('Segment 1: ["Remove-Item","C:Windows","-Recurse","-Force"]');

    const nearby = explainCommand(String.raw`Remove-Item .\cache -Recurse -Force`, {
      ...OPTIONS,
      policySnapshot: policySnapshot(),
    });
    expect(nearby.result).toBe('allowed');
    expect(nearby.trace.steps[0]).toEqual({
      type: 'parse',
      input: String.raw`Remove-Item .\cache -Recurse -Force`,
      segments: [['Remove-Item', '.cache', '-Recurse', '-Force']],
    });
  });

  test('busybox wrapper chains reach the inner command at any nesting', () => {
    withEnv({ TMPDIR: '/tmp/explain-output-tmpdir' }, () => {
      for (const wrappers of [9, 10, 11]) {
        const command = `${'busybox '.repeat(wrappers)}rm -rf /`;
        expect(
          analyzeCommand(command, {
            policySnapshot: policySnapshot(),
            environment: TEST_ENVIRONMENT,
            effectiveCapabilities: testModes().capabilities,
            protectedGitMetadata: null,
          })?.reason,
        ).toBe(RM_REASON);
        const explained = explainCommand(command, {
          ...OPTIONS,
          policySnapshot: policySnapshot(),
        });
        expect(explained.reason).toBe(RM_REASON);
        expect(getTraceSteps(explained).at(-1)).toEqual({
          type: 'rule-check',
          rule: 'analyzer/rm.ts:analyzeRmMatch',
          matched: true,
          reason: RM_REASON,
        });
      }
    });
  });
});
