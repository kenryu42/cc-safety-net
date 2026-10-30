import { afterAll, describe, expect, test } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir as systemTemp } from 'node:os';
import { join, parse, sep } from 'node:path';
import { AnalysisLimit } from '@/core/budget';
import { createProcessEnvironment, createTestEnvironment } from '@/core/environment';
import { createCwdDenial, createMalformedToolCallDenial } from '@/core/denial';
import { getUserPolicyPath } from '@/core/policy/paths';
import { StructuralShellSyntaxLimitError as PortedStructuralLimit } from '@/gate/guards/semantic-facts';
import { createToolInvocation, type ToolInvocation, type ToolRoute } from '@/gate/invocation';
import {
  type GuardEvaluation,
  type GuardStage,
  type GuardDependencies as PortedDependencies,
  evaluateGuard as portedEvaluateGuard,
} from '@/gate/pipeline';
import { writeTree } from '../helpers/fixture-tree';
import { policySnapshot } from '../helpers/policy';

const fixtureRoot = mkdtempSync(join(systemTemp(), 'gate-pipeline-differential-'));
const project = join(fixtureRoot, 'checkout');
const tooling = join(fixtureRoot, 'tooling');
const plain = join(fixtureRoot, 'notes');
writeTree(fixtureRoot, { checkout: null, tooling: null, 'notes/readme.md': 'notes\n' });
for (const repository of [project, tooling]) {
  execFileSync('git', ['init', '--quiet', repository]);
}

afterAll(() => {
  rmSync(fixtureRoot, { recursive: true, force: true });
});

const environment = createProcessEnvironment();
const userPolicyPath = getUserPolicyPath(environment);
const readySnapshot = policySnapshot();

function bash(command: string, cwd: string): ToolInvocation {
  return invocation('Bash', { command }, { kind: 'command', shell: 'posix' }, cwd, command);
}

function invocation(
  toolName: string,
  input: unknown,
  route: ToolRoute,
  cwd: string,
  command: string | null = null,
): ToolInvocation {
  return createToolInvocation(
    toolName,
    input,
    route,
    { configCwd: cwd, executionCwd: cwd },
    command,
  );
}

type GuardOutcome =
  | { readonly kind: 'evaluation'; readonly evaluation: GuardEvaluation }
  | {
      readonly kind: 'failed-closed';
      readonly name: string;
      readonly message: string;
      readonly stage: unknown;
      readonly evaluation: unknown;
    };

function guardOutcome(run: () => GuardEvaluation): GuardOutcome {
  try {
    return { kind: 'evaluation', evaluation: run() };
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    const failure = error as Error & { stage?: unknown; evaluation?: unknown };
    return {
      kind: 'failed-closed',
      name: failure.name,
      message: failure.message,
      stage: failure.stage,
      evaluation: failure.evaluation,
    };
  }
}

function portedOutcome(
  call: ToolInvocation,
  snapshot: ReturnType<typeof policySnapshot> = readySnapshot,
  overrides: Partial<PortedDependencies> = {},
): GuardOutcome {
  return guardOutcome(() =>
    portedEvaluateGuard(call, {
      environment,
      dependencies: { loadPolicySnapshot: () => snapshot, ...overrides },
    }),
  );
}

function stageOf(outcome: GuardOutcome): unknown {
  return outcome.kind === 'evaluation' ? outcome.evaluation.stage : outcome.stage;
}

const OVERSIZED_COMMAND = `echo ${'x'.repeat(131_072)}`;

const STAGE_EXITS: readonly {
  readonly label: string;
  readonly stage: GuardStage;
  readonly call: ToolInvocation;
  readonly snapshot?: ReturnType<typeof policySnapshot>;
  readonly denyReason?: string;
}[] = [
  {
    label: 'a declared command past the parser cap',
    stage: 'command-analysis',
    call: bash(OVERSIZED_COMMAND, plain),
    denyReason: 'maximum recursion depth',
  },
  {
    label: 'an input candidate past the parser cap on a non-command route',
    stage: 'command-validation',
    call: invocation('MysteryTool', { command: OVERSIZED_COMMAND }, { kind: 'unknown' }, plain),
    denyReason: 'could not validate the command',
  },
  {
    label: 'a redirection into the user policy file',
    stage: 'policy-protection',
    call: bash(`printf x > ${userPolicyPath.split(sep).join('/')}`, plain),
    denyReason: 'protected policy config',
  },
  {
    label: 'a policy proposal applied through a package runner',
    stage: 'policy-protection',
    call: bash('npx -y cc-safety-net policy apply proposal.json', plain),
    denyReason: 'Only the user may apply a policy proposal',
  },
  {
    label: 'a redirection into a Git hook',
    stage: 'policy-protection',
    call: bash('echo x > .git/hooks/pre-commit', project),
    denyReason: 'Git metadata and hooks are protected',
  },
  {
    label: 'a sensitive path under a degraded configuration',
    stage: 'secret-protection',
    call: bash('cat ~/.ssh/config', plain),
    snapshot: policySnapshot({
      configFallbackReason: 'invalid policy config: fix the file named in the diagnostic.',
    }),
    denyReason: 'Access to a sensitive path is not allowed.',
  },
  {
    label: 'a sensitive path with secret protection switched off',
    stage: 'command-analysis',
    call: bash('cat ~/.ssh/config', plain),
    snapshot: policySnapshot({ secretProtection: { enabled: false, denyPaths: [] } }),
  },
  {
    label: 'a read tool over an ordinary file',
    stage: 'non-command',
    call: invocation('Read', { file_path: join(plain, 'readme.md') }, { kind: 'path' }, plain),
  },
  {
    label: 'a blank shell command',
    stage: 'command-validation',
    call: bash('   ', plain),
    denyReason: 'This is not a CC Safety Net failure.',
  },
  {
    label: 'a destructive command the analyzer denies',
    stage: 'command-analysis',
    call: bash('git reset --hard', plain),
    denyReason: 'destroys all uncommitted changes',
  },
  {
    label: 'an everyday command the analyzer allows',
    stage: 'command-analysis',
    call: bash('git status', plain),
  },
];

describe('every stage exit agrees', () => {
  for (const exit of STAGE_EXITS) {
    test(exit.label, () => {
      const outcome = portedOutcome(exit.call, exit.snapshot ?? readySnapshot);
      expect(stageOf(outcome)).toBe(exit.stage);
      const decision = outcome.kind === 'evaluation' ? outcome.evaluation.decision : null;
      expect(decision?.kind).toBe(exit.denyReason ? 'deny' : 'allow');
      if (!exit.denyReason || decision?.kind !== 'deny') return;
      expect(decision.reason).toContain(exit.denyReason);
    });
  }

  test('a degraded snapshot reports its fallback reason and the level in force', () => {
    const degraded = policySnapshot({
      configFallbackReason: 'invalid policy config: fix the file named in the diagnostic.',
      safety: { level: 'strict' },
    });
    const outcome = portedOutcome(bash('git status', plain), degraded);
    expect(outcome.kind === 'evaluation' ? outcome.evaluation : null).toStrictEqual({
      stage: 'command-analysis',
      level: 'strict',
      configFallback: {
        reason: 'invalid policy config: fix the file named in the diagnostic.',
      },
      decision: { kind: 'allow' },
    });
  });
});

function throwing(error: Error): () => never {
  return () => {
    throw error;
  };
}

const INJECTED_CAUSES: readonly {
  readonly label: string;
  readonly ported: () => never;
  readonly reasonIncludes: string;
  readonly ruleId: string;
}[] = [
  {
    label: 'an unexpected fault',
    ported: throwing(new Error('injected dependency fault')),
    reasonIncludes: 'failed closed',
    ruleId: 'analysis.failed-closed',
  },
  {
    label: 'a path canonicalization breach',
    ported: throwing(new AnalysisLimit('realpathAttempts')),
    reasonIncludes: 'exceeds safe analysis limits',
    ruleId: 'analysis.limit',
  },
  {
    label: 'a structural shell syntax breach',
    ported: throwing(new PortedStructuralLimit()),
    reasonIncludes: 'exceeds safe analysis limits',
    ruleId: 'analysis.limit',
  },
];

const FAILING_SEAMS: readonly {
  readonly slot: keyof PortedDependencies;
  readonly stage: GuardStage;
}[] = [
  { slot: 'resolveGitMetadata', stage: 'policy-protection' },
  { slot: 'findPolicyMutation', stage: 'policy-protection' },
  { slot: 'findGitMetadataMutation', stage: 'policy-protection' },
  { slot: 'loadPolicySnapshot', stage: 'config-load' },
  { slot: 'findSensitiveTarget', stage: 'secret-protection' },
  { slot: 'analyzeCommand', stage: 'command-analysis' },
];

describe('a failing dependency fails closed the same way', () => {
  for (const seam of FAILING_SEAMS) {
    for (const cause of INJECTED_CAUSES) {
      test(`${seam.slot} throwing ${cause.label}`, () => {
        const outcome = portedOutcome(bash('git status', plain), readySnapshot, {
          [seam.slot]: cause.ported,
        });
        expect(outcome.kind).toBe('failed-closed');
        if (outcome.kind !== 'failed-closed') return;
        expect(outcome.stage).toBe(seam.stage);
        expect(outcome.name).toBe('GuardEvaluationError');
        expect(outcome.evaluation).toStrictEqual({
          stage: seam.stage,
          decision: {
            kind: 'deny',
            reason: expect.stringContaining(cause.reasonIncludes),
            ruleId: cause.ruleId,
            intent: 'stop_and_explain',
            evidence: { command: 'git status', segment: 'git status' },
          },
        });
      });
    }
  }

  test('a tool input that refuses traversal fails closed with the command withheld', () => {
    const input = { command: 'git status' };
    Object.defineProperty(input, 'command', { get: () => 'git status', enumerable: true });
    const outcome = portedOutcome(
      invocation('Bash', input, { kind: 'command', shell: 'posix' }, plain, 'git status'),
    );
    expect(outcome.kind === 'failed-closed' ? outcome.evaluation : null).toStrictEqual({
      stage: 'policy-protection',
      decision: {
        kind: 'deny',
        reason: expect.stringContaining('failed closed'),
        ruleId: 'analysis.failed-closed',
        intent: 'stop_and_explain',
      },
    });
  });

  test('the thrown error keeps the failing cause', () => {
    const cause = new Error('injected dependency fault');
    expect(() =>
      portedEvaluateGuard(bash('git status', plain), {
        environment,
        dependencies: { loadPolicySnapshot: () => readySnapshot, analyzeCommand: throwing(cause) },
      }),
    ).toThrow(expect.objectContaining({ cause }));
  });
});

describe('git metadata for the execution and configuration directories', () => {
  function metadataFor(executionCwd: string, configCwd: string) {
    const call = createToolInvocation(
      'Bash',
      { command: 'echo hi' },
      { kind: 'command', shell: 'posix' },
      { configCwd, executionCwd },
      'echo hi',
    );
    const seen: Record<string, unknown> = {};
    const record = (side: string) => (_facts: unknown, metadata: unknown) => {
      seen[side] = metadata;
      return null;
    };
    portedEvaluateGuard(call, {
      environment,
      dependencies: {
        loadPolicySnapshot: () => readySnapshot,
        findGitMetadataMutation: record('ported'),
      },
    });
    return seen.ported as { entries: readonly string[] } | null;
  }

  const anchor = (repository: string) => {
    const path = join(realpathSync(repository), '.git');
    return process.platform === 'win32' ? path.replaceAll('\\', '/').toLowerCase() : path;
  };

  test('one repository resolves to one anchor', () => {
    expect(metadataFor(project, project)?.entries).toStrictEqual([anchor(project)]);
  });

  test('two repositories union into both anchors, in the order the pair names them', () => {
    expect(metadataFor(project, tooling)?.entries).toStrictEqual([
      anchor(project),
      anchor(tooling),
    ]);
  });

  test('a directory outside a repository contributes nothing', () => {
    expect(metadataFor(plain, tooling)?.entries).toStrictEqual([anchor(tooling)]);
    expect(metadataFor(plain, plain)).toBeNull();
  });
});

describe('a tool the user declared as a command tool', () => {
  const home = join(fixtureRoot, 'home');
  mkdirSync(join(home, '.ssh'), { recursive: true });
  const isolated = { ...environment, home: realpathSync(home) };
  const declared = policySnapshot({
    commandTools: [
      { name: 'ops_bash' },
      { name: 'ops_run_background' },
      { name: 'ops_explicit', cwd: 'dir' },
      { name: 'Bash', cwd: 'dir' },
    ],
  });
  const unknown = (toolName: string, input: unknown) =>
    invocation(toolName, input, { kind: 'unknown' }, plain);
  const evaluate = (call: ToolInvocation, snapshot = declared) =>
    portedEvaluateGuard(call, {
      environment: isolated,
      dependencies: { loadPolicySnapshot: () => snapshot },
    });
  const verdict = (evaluation: GuardEvaluation) =>
    evaluation.decision.kind === 'deny' ? evaluation.decision.ruleId : 'allow';

  test('a destructive command is analyzed like a built-in shell tool', () => {
    expect(verdict(evaluate(unknown('ops_bash', { command: 'git reset --hard' })))).toBe(
      'git.reset-hard',
    );
  });

  test('the same tool without a declaration stays a non-command tool', () => {
    const evaluation = evaluate(
      unknown('ops_bash', { command: 'git reset --hard' }),
      readySnapshot,
    );
    expect([evaluation.stage, verdict(evaluation)]).toEqual(['non-command', 'allow']);
  });

  test('an everyday command passes command analysis', () => {
    const evaluation = evaluate(unknown('ops_bash', { command: 'echo hi' }));
    expect([evaluation.stage, verdict(evaluation)]).toEqual(['command-analysis', 'allow']);
  });

  test('a call without a command stays a non-command tool', () => {
    const evaluation = evaluate(unknown('ops_bash', { script_path: 'deploy.sh' }));
    expect([evaluation.stage, verdict(evaluation)]).toEqual(['non-command', 'allow']);
  });

  test('standard mode reaches the same verdict on metadata of a sensitive path as bash', () => {
    const viaBash = evaluate(bash('ls ~/.ssh', plain));
    const viaDeclared = evaluate(unknown('ops_bash', { command: 'ls ~/.ssh' }));
    expect(verdict(viaDeclared)).toBe(verdict(viaBash));
    expect(viaDeclared.stage).toBe(viaBash.stage);
  });

  test('a cwd argument in the home directory is the working directory analyzed', () => {
    expect(
      verdict(evaluate(unknown('ops_run_background', { command: 'rm -rf build', cwd: home }))),
    ).toBe('rm.recursive-force-home-cwd');
  });

  test('two working directory arguments that disagree are denied', () => {
    expect(
      verdict(evaluate(unknown('ops_bash', { command: 'echo hi', workdir: plain, cwd: project }))),
    ).toBe('tool-call.malformed');
  });

  test('a blank or non-string working directory argument is denied as malformed', () => {
    expect(evaluate(unknown('ops_bash', { command: 'echo hi', workdir: '' }))).toStrictEqual({
      stage: 'command-validation',
      decision: {
        kind: 'deny',
        reason: createMalformedToolCallDenial().reason,
        ruleId: 'tool-call.malformed',
        intent: 'use_alternative',
        evidence: { command: 'echo hi', segment: 'echo hi' },
      },
    });
    expect(verdict(evaluate(unknown('ops_bash', { command: 'echo hi', cwd: 7 })))).toBe(
      'tool-call.malformed',
    );
  });

  test('a working directory that does not exist is denied as unusable', () => {
    const evaluation = evaluate(unknown('ops_bash', { command: 'echo hi', workdir: 'missing' }));
    expect(verdict(evaluation)).toBe('cwd.requested-unusable');
    expect(evaluation.decision.kind === 'deny' ? evaluation.decision.reason : '').toBe(
      createCwdDenial({ directory: 'requested', problem: 'unusable', cwd: 'missing' }).reason,
    );
  });

  test('a declared cwd argument name is the only key read', () => {
    expect(
      verdict(
        evaluate(unknown('ops_explicit', { command: 'rm -rf build', dir: home, workdir: project })),
      ),
    ).toBe('rm.recursive-force-home-cwd');
  });

  test('a declaration named like a built-in shell tool changes nothing', () => {
    const call = invocation(
      'Bash',
      { command: 'rm -rf build', dir: home },
      { kind: 'command', shell: 'posix' },
      plain,
      'rm -rf build',
    );
    expect(verdict(evaluate(call))).toBe('allow');
  });

  test('the always-on protections still deny without config state', () => {
    const degraded = policySnapshot({
      commandTools: [{ name: 'ops_bash' }],
      configFallbackReason: 'invalid policy config: fix the file named in the diagnostic.',
    });
    const evaluation = evaluate(
      unknown('ops_bash', { command: 'echo x > .git/hooks/pre-commit', workdir: project }),
      degraded,
    );
    expect(evaluation).toStrictEqual({
      stage: 'policy-protection',
      decision: expect.objectContaining({ ruleId: 'guard.git-metadata' }),
      promotedInvocation: expect.objectContaining({
        context: { configCwd: plain, executionCwd: realpathSync(project) },
      }),
    });
  });
});

describe('a host working directory outside the session workspace', () => {
  const base = join(parse(fixtureRoot).root, 'ccsn-workdir-anchor');
  const workspace = join(base, 'workspace');
  const outside = join(base, 'outside');
  const synthetic = createTestEnvironment({
    home: join(base, 'home'),
    entries: new Map([
      [base, 'directory'],
      [workspace, 'directory'],
      [join(workspace, 'sub'), 'directory'],
      [outside, 'directory'],
      [join(base, 'home'), 'directory'],
    ]),
  });
  const fromWorkdir = (
    shell: 'posix' | 'powershell',
    command: string,
    workdir = base,
    sessionCwd = workspace,
    snapshot = readySnapshot,
  ) =>
    portedEvaluateGuard(
      createToolInvocation(
        shell === 'posix' ? 'bash' : 'pwsh',
        { command, workdir },
        { kind: 'command', shell },
        { configCwd: sessionCwd, executionCwd: workdir },
        command,
      ),
      { environment: synthetic, dependencies: { loadPolicySnapshot: () => snapshot } },
    ).decision;

  test('a pwsh deletion of a folder beside the workspace is still outside the workspace', () => {
    expect(
      fromWorkdir('powershell', `Remove-Item -LiteralPath "${outside}" -Recurse -Force`),
    ).toMatchObject({ kind: 'deny', ruleId: 'powershell.remove-item-recursive-force-outside-cwd' });
  });

  test('a bash deletion of a folder beside the workspace is still outside the workspace', () => {
    expect(fromWorkdir('posix', 'rm -rf outside')).toMatchObject({
      kind: 'deny',
      ruleId: 'rm.recursive-force-outside-cwd',
    });
  });

  test('a deletion from a home workdir inside a session that contains home is denied', () => {
    expect(fromWorkdir('posix', 'rm -rf build', join(base, 'home'), base)).toMatchObject({
      kind: 'deny',
      ruleId: 'rm.recursive-force-home-cwd',
    });
  });

  test.each([
    [
      'powershell.remove-item-recursive-force',
      `Remove-Item -LiteralPath "${outside}" -Recurse -Force`,
    ],
    ['cmd.recursive-delete', 'cmd /c rd /s /q ..\\outside'],
  ] as const)(
    'a deletion beside the workspace from a home workdir with %s-home-cwd off is outside the workspace',
    (rulePrefix, command) => {
      const homeCwdOff = policySnapshot({
        destructiveCommandRuleOverrides: { [`${rulePrefix}-home-cwd`]: 'off' },
      });
      expect(
        fromWorkdir('powershell', command, join(base, 'home'), workspace, homeCwdOff),
      ).toMatchObject({ kind: 'deny', ruleId: `${rulePrefix}-outside-cwd` });
    },
  );

  test('a deletion inside a workdir below the workspace is still allowed', () => {
    expect(fromWorkdir('posix', 'rm -rf build', join(workspace, 'sub'))).toStrictEqual({
      kind: 'allow',
    });
  });
});
