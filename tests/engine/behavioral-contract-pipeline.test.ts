import { afterAll, describe, expect, test } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { evaluateGuard, type GuardDependencies, type GuardEvaluation } from '@/engine/guard';
import type { BlockIntent } from '@/ir/decision';
import type { ToolInvocation } from '@/ir/invocation';
import { createToolInvocation } from '@/ir/invocation';
import type { PolicySnapshot } from '@/ir/policy';
import { getCommandFromToolInput } from '@/parser/tool-input';
import { getCCSafetyNetEnvModes } from '@/policy/env';
import { getUserPolicyPath } from '@/policy/store';
import { behavioralContractCases } from '../analyzer/behavioral-contract-cases';
import { blockedSegment, withEnv } from '../helpers';
import { policySnapshot } from '../helpers/policy';
import { type PipelineContractCase, pipelineContractCases } from './pipeline-contract-cases';

/**
 * The behavioral contract evaluated the way every host evaluates it: through
 * `evaluateGuard`, so the protection stages and secret matching sit in front of
 * command analysis for every row. `tests/analyzer/behavioral-contract.test.ts`
 * pins the analyzer alone; this file pins the pipeline. Policy loading is
 * injected here, so policy discovery and degraded reporting are pinned elsewhere.
 */

/**
 * Cleared for every row: the mode variables, and the ambient names the analyzer
 * still reads from `process.env` until the Phase 1 environment seam exists
 * (`GIT_SSH*` turns Git rows into dynamic-executable denials; `PARALLEL`
 * changes what the `parallel` rows see).
 */
const AMBIENT_ENV_CLEARED = {
  CC_SAFETY_NET_LEVEL: '',
  CC_SAFETY_NET_STRICT: '',
  SAFETY_NET_STRICT: '',
  CC_SAFETY_NET_PARANOID: '',
  SAFETY_NET_PARANOID: '',
  CC_SAFETY_NET_PARANOID_RM: '',
  SAFETY_NET_PARANOID_RM: '',
  CC_SAFETY_NET_PARANOID_INTERPRETERS: '',
  SAFETY_NET_PARANOID_INTERPRETERS: '',
  CC_SAFETY_NET_WORKTREE: '',
  SAFETY_NET_WORKTREE: '',
  GIT_SSH_COMMAND: undefined,
  GIT_SSH: undefined,
  GIT_SSH_VARIANT: undefined,
  PARALLEL: undefined,
};

const root = mkdtempSync(join(tmpdir(), 'cc-safety-net-pipeline-contract-'));
const workspace = join(root, 'workspace');
const repo = join(root, 'repo');
mkdirSync(workspace);
mkdirSync(repo);
execFileSync('git', ['init', '--quiet', repo]);

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

/**
 * Every injected dependency, `getModes` included, is called by the guard inside
 * the cleared environment, so no ambient variable reaches a decision.
 */
function evaluate(
  invocation: ToolInvocation,
  snapshot: PolicySnapshot,
  overrides: Partial<GuardDependencies> = {},
): GuardEvaluation {
  return withEnv(AMBIENT_ENV_CLEARED, () =>
    evaluateGuard(invocation, {
      dependencies: { loadPolicySnapshot: () => snapshot, ...overrides },
    }),
  );
}

describe('behavioral contract through the guard pipeline', () => {
  for (const contractCase of behavioralContractCases({ cwd: workspace, home: homedir() })) {
    test(contractCase.name, () => {
      const options = contractCase.options;
      const cwd = options.cwd ?? workspace;
      const snapshot = options.policySnapshot;
      const invocation = createToolInvocation(
        'Bash',
        { command: contractCase.command },
        { kind: 'command', shell: options.shell ?? 'posix' },
        { configCwd: cwd, executionCwd: cwd },
        contractCase.command,
      );
      // The analyzer corpus fixes `protectedGitMetadata: null`; mirror it here so
      // both files pin the same decision for the same row.
      const evaluation = evaluate(invocation, snapshot, {
        getModes: () => ({
          ...getCCSafetyNetEnvModes(snapshot.policy),
          strict: options.strict ?? false,
          paranoidRm: options.paranoidRm ?? false,
          paranoidInterpreters: options.paranoidInterpreters ?? false,
          worktreeMode: options.worktreeMode ?? false,
        }),
        resolveGitMetadata: () => null,
      });

      if (contractCase.expected.kind === 'allow') {
        expect(evaluation.decision).toEqual({ kind: 'allow' });
        return;
      }

      expect(evaluation.decision.kind).toBe('deny');
      if (evaluation.decision.kind !== 'deny') return;
      expect(evaluation.decision.ruleId).toBe(contractCase.expected.ruleId);
      expect<BlockIntent | undefined>(evaluation.decision.intent).toBe(
        contractCase.expected.intent,
      );
      expect(evaluation.decision.reason).toContain(contractCase.expected.reasonIncludes);
      if (contractCase.expected.segment !== undefined) {
        expect(blockedSegment(evaluation.decision)).toBe(contractCase.expected.segment);
      }
    });
  }
});

describe('pipeline-only contract', () => {
  const userPolicyPath = getUserPolicyPath();
  const cases = pipelineContractCases({
    workspace,
    repo,
    home: homedir(),
    userPolicyPath,
    userPolicyDir: dirname(userPolicyPath),
  });

  function runCase(contractCase: PipelineContractCase): GuardEvaluation {
    const cwd = contractCase.cwd === 'repo' ? repo : workspace;
    const invocation = createToolInvocation(
      contractCase.toolName,
      contractCase.input,
      contractCase.route,
      { configCwd: cwd, executionCwd: cwd },
      contractCase.route.kind === 'command'
        ? (getCommandFromToolInput(contractCase.input) ?? null)
        : null,
    );
    return evaluate(
      invocation,
      policySnapshot(contractCase.level ? { safety: { level: contractCase.level } } : {}),
    );
  }

  for (const contractCase of cases) {
    const run = contractCase.knownGap ? test.failing : test;
    run(contractCase.name, () => {
      const evaluation = runCase(contractCase);

      if (contractCase.expected.kind === 'allow') {
        expect(evaluation.decision).toEqual({ kind: 'allow' });
        return;
      }

      expect(evaluation.stage).toBe(contractCase.expected.stage);
      expect(evaluation.decision.kind).toBe('deny');
      if (evaluation.decision.kind !== 'deny') return;
      expect(evaluation.decision.ruleId).toBe(contractCase.expected.ruleId);
      expect(evaluation.decision.intent).toBe(contractCase.expected.intent);
      expect(evaluation.decision.reason).toContain(contractCase.expected.reasonIncludes);
    });
  }
});
