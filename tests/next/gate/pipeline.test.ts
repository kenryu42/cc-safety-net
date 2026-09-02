import { afterAll, describe, expect, test } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { homedir, tmpdir as systemTemp } from 'node:os';
import { dirname, join } from 'node:path';
import { AnalysisLimit } from '@next/core/budget';
import { createProcessEnvironment } from '@next/core/environment';
import { getUserPolicyPath } from '@next/core/policy/paths';
import { StructuralShellSyntaxLimitError as PortedStructuralLimit } from '@next/gate/guards/semantic-facts';
import { createToolInvocation, type ToolInvocation, type ToolRoute } from '@next/gate/invocation';
import {
  type GuardEvaluation,
  type GuardStage,
  type GuardDependencies as PortedDependencies,
  evaluateGuard as portedEvaluateGuard,
} from '@next/gate/pipeline';
import { PathCanonicalizationLimitError } from '@/analyzer/path-canonicalization';
import {
  type GuardDependencies as ShippedDependencies,
  evaluateGuard as shippedEvaluateGuard,
} from '@/engine/guard';
import { StructuralShellSyntaxLimitError as ShippedStructuralLimit } from '@/guards/semantic-facts';
import { behavioralContractCases } from '../../analyzer/behavioral-contract-cases';
import { pipelineContractCases } from '../../engine/pipeline-contract-cases';
import { policySnapshot } from '../../helpers/policy';
import { writeTree } from '../helpers/fixture-tree';

/**
 * The shipped pipeline and the port decide every input the same way. Both corpora and a
 * hand-built row per stage exit run through both `evaluateGuard` entry points and the whole
 * `GuardEvaluation` is compared; the shipped side reads `process.env` ambiently, so the port is
 * handed the snapshot of that same process state and no variable is mutated for the comparison.
 */

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

/**
 * The evaluation, or the fail-closed error the guard threw, in one comparable shape. The error's
 * `cause` is left out on purpose: the two implementations throw different classes for a budget
 * breach (`AnalysisLimit` against `PathCanonicalizationLimitError`), and the injected causes below
 * are chosen per side for exactly that reason.
 */
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

type OverridePair = {
  readonly shipped?: Partial<ShippedDependencies>;
  readonly ported?: Partial<PortedDependencies>;
};

function shippedOutcome(
  call: ToolInvocation,
  snapshot: ReturnType<typeof policySnapshot>,
  overrides: OverridePair['shipped'] = {},
): GuardOutcome {
  return guardOutcome(() =>
    shippedEvaluateGuard(call, {
      dependencies: { loadPolicySnapshot: () => snapshot, ...overrides },
    }),
  );
}

function portedOutcome(
  call: ToolInvocation,
  snapshot: ReturnType<typeof policySnapshot>,
  overrides: OverridePair['ported'] = {},
): GuardOutcome {
  return guardOutcome(() =>
    portedEvaluateGuard(call, {
      environment,
      dependencies: { loadPolicySnapshot: () => snapshot, ...overrides },
    }),
  );
}

/** Compares one invocation, naming it in the failure so a diff points at the input. */
function expectSameOutcome(
  label: string,
  call: ToolInvocation,
  snapshot: ReturnType<typeof policySnapshot> = readySnapshot,
  overrides: OverridePair = {},
): GuardOutcome {
  const outcome = portedOutcome(call, snapshot, overrides.ported);
  expect({ label, outcome }).toStrictEqual({
    label,
    outcome: shippedOutcome(call, snapshot, overrides.shipped),
  });
  return outcome;
}

function stageOf(outcome: GuardOutcome): unknown {
  return outcome.kind === 'evaluation' ? outcome.evaluation.stage : outcome.stage;
}

describe('evaluateGuard differential over the corpora', () => {
  test('every analyzer corpus row decides identically, snapshot and cwd included', () => {
    const rows = behavioralContractCases({ cwd: project, home: homedir() });
    expect(rows.length).toBeGreaterThan(100);
    for (const row of rows) {
      const cwd = row.options.cwd ?? project;
      expectSameOutcome(
        row.name,
        invocation(
          'Bash',
          { command: row.command },
          { kind: 'command', shell: row.options.shell ?? 'posix' },
          cwd,
          row.command,
        ),
        row.options.policySnapshot,
      );
    }
  });

  test('every pipeline corpus row decides identically, tool routes included', () => {
    const rows = pipelineContractCases({
      workspace: plain,
      repo: project,
      home: homedir(),
      userPolicyPath,
      userPolicyDir: dirname(userPolicyPath),
    });
    expect(rows.length).toBeGreaterThan(15);
    for (const row of rows) {
      expectSameOutcome(
        row.name,
        invocation(
          row.toolName,
          row.input,
          row.route,
          row.cwd === 'repo' ? project : plain,
          row.route.kind === 'command' && typeof row.input === 'object' && row.input !== null
            ? ((row.input as { command?: string }).command ?? null)
            : null,
        ),
        policySnapshot(row.level ? { safety: { level: row.level } } : {}),
      );
    }
  });
});

// Longer than the parser's 131,072 code-unit cap, so the program it yields carries status
// `limited` and the gate exits before any guard runs.
const OVERSIZED_COMMAND = `echo ${'x'.repeat(131_072)}`;

const STAGE_EXITS: readonly {
  readonly label: string;
  readonly stage: GuardStage;
  readonly call: ToolInvocation;
  readonly snapshot?: ReturnType<typeof policySnapshot>;
  /** Absent where the row is expected to allow, so every row pins its own outcome. */
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
    call: bash(`printf x > ${userPolicyPath}`, plain),
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
    denyReason: 'failed closed',
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
      const outcome = expectSameOutcome(exit.label, exit.call, exit.snapshot ?? readySnapshot);
      expect(stageOf(outcome)).toBe(exit.stage);
      const decision = outcome.kind === 'evaluation' ? outcome.evaluation.decision : null;
      expect(decision?.kind).toBe(exit.denyReason ? 'deny' : 'allow');
      if (!exit.denyReason || decision?.kind !== 'deny') return;
      expect(decision.reason).toContain(exit.denyReason);
    });
  }

  test('the table reaches every stage the guard can exit at', () => {
    expect([...new Set(STAGE_EXITS.map((exit) => exit.stage))].sort()).toStrictEqual([
      'command-analysis',
      'command-validation',
      'non-command',
      'policy-protection',
      'secret-protection',
    ]);
  });

  test('a degraded snapshot reports its fallback reason and the level in force', () => {
    const degraded = policySnapshot({
      configFallbackReason: 'invalid policy config: fix the file named in the diagnostic.',
      safety: { level: 'strict' },
    });
    const outcome = expectSameOutcome('degraded strict', bash('git status', plain), degraded);
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

/**
 * A budget breach is the one cause the two implementations spell differently, so each side is
 * handed its own class and both must still report the analysis-limit wording.
 */
const INJECTED_CAUSES: readonly {
  readonly label: string;
  readonly shipped: () => never;
  readonly ported: () => never;
  readonly reasonIncludes: string;
}[] = [
  {
    label: 'an unexpected fault',
    shipped: throwing(new Error('injected dependency fault')),
    ported: throwing(new Error('injected dependency fault')),
    reasonIncludes: 'failed closed',
  },
  {
    label: 'a path canonicalization breach',
    shipped: throwing(new PathCanonicalizationLimitError()),
    ported: throwing(new AnalysisLimit('realpathAttempts')),
    reasonIncludes: 'exceeds safe analysis limits',
  },
  {
    label: 'a structural shell syntax breach',
    shipped: throwing(new ShippedStructuralLimit()),
    ported: throwing(new PortedStructuralLimit()),
    reasonIncludes: 'exceeds safe analysis limits',
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
        const outcome = expectSameOutcome(
          `${seam.slot}/${cause.label}`,
          bash('git status', plain),
          readySnapshot,
          { shipped: { [seam.slot]: cause.shipped }, ported: { [seam.slot]: cause.ported } },
        );
        expect(outcome.kind).toBe('failed-closed');
        if (outcome.kind !== 'failed-closed') return;
        expect(outcome.stage).toBe(seam.stage);
        expect(outcome.name).toBe('GuardEvaluationError');
        expect(outcome.evaluation).toStrictEqual({
          stage: seam.stage,
          decision: {
            kind: 'deny',
            reason: expect.stringContaining(cause.reasonIncludes),
            intent: 'stop_and_explain',
            evidence: [{ kind: 'command', command: 'git status', segment: 'git status' }],
          },
        });
      });
    }
  }

  test('a tool input that refuses traversal fails closed with the command withheld', () => {
    const input = { command: 'git status' };
    Object.defineProperty(input, 'command', { get: () => 'git status', enumerable: true });
    const outcome = expectSameOutcome(
      'accessor command',
      invocation('Bash', input, { kind: 'command', shell: 'posix' }, plain, 'git status'),
    );
    expect(outcome.kind === 'failed-closed' ? outcome.evaluation : null).toStrictEqual({
      stage: 'policy-protection',
      decision: {
        kind: 'deny',
        reason: expect.stringContaining('failed closed'),
        intent: 'stop_and_explain',
        evidence: [],
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

describe('the analyzer receives the same input from both pipelines', () => {
  test('one call, one set of analysis options', () => {
    const captured: Record<string, unknown> = {};
    const capture = (side: string) => (command: string, options: { environment: unknown }) => {
      const { environment: _processState, ...rest } = options;
      captured[side] = { command, options: rest };
      return null;
    };
    shippedEvaluateGuard(bash('rm -rf build', project), {
      dependencies: {
        loadPolicySnapshot: () => readySnapshot,
        analyzeCommand: capture('shipped'),
      },
    });
    portedEvaluateGuard(bash('rm -rf build', project), {
      environment,
      dependencies: {
        loadPolicySnapshot: () => readySnapshot,
        analyzeCommand: capture('ported'),
      },
    });
    expect(captured.ported).toStrictEqual(captured.shipped);
    expect(captured.ported).toMatchObject({
      command: 'rm -rf build',
      options: { cwd: project, shell: 'posix', strict: false, worktreeMode: false },
    });
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
    shippedEvaluateGuard(call, {
      dependencies: {
        loadPolicySnapshot: () => readySnapshot,
        findGitMetadataMutation: record(
          'shipped',
        ) as ShippedDependencies['findGitMetadataMutation'],
      },
    });
    portedEvaluateGuard(call, {
      environment,
      dependencies: {
        loadPolicySnapshot: () => readySnapshot,
        findGitMetadataMutation: record('ported'),
      },
    });
    expect(seen.ported).toStrictEqual(seen.shipped);
    return seen.ported as { entries: readonly string[] } | null;
  }

  test('one repository resolves to one anchor', () => {
    expect(metadataFor(project, project)?.entries).toStrictEqual([join(project, '.git')]);
  });

  test('two repositories union into both anchors, in the order the pair names them', () => {
    expect(metadataFor(project, tooling)?.entries).toStrictEqual([
      join(project, '.git'),
      join(tooling, '.git'),
    ]);
  });

  test('a directory outside a repository contributes nothing', () => {
    expect(metadataFor(plain, tooling)?.entries).toStrictEqual([join(tooling, '.git')]);
    expect(metadataFor(plain, plain)).toBeNull();
  });
});
