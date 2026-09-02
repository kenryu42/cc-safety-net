import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Environment } from '@next/core/environment';
import { createToolInvocation, type ToolInvocation, type ToolRoute } from '@next/gate/invocation';
import {
  type GuardEvaluation,
  type GuardDependencies as PortedDependencies,
  evaluateGuard as portedEvaluateGuard,
} from '@next/gate/pipeline';
import {
  type GuardDependencies as ShippedDependencies,
  evaluateGuard as shippedEvaluateGuard,
} from '@/engine/guard';
import { writeTree } from './fixture-tree';

/**
 * The two gates side by side. The end-to-end differential files (`harvested`, `tool-routes`,
 * `failure-injection`) all need the same three things — a fixture the corpora and the harvest can
 * name, one invocation shape, and one comparable verdict — so they share them here instead of
 * spelling them out three times.
 */

/** A plain workspace, a real repository and an empty home under one removable root. */
export function createGateTree(prefix: string) {
  const root = mkdtempSync(join(tmpdir(), prefix));
  writeTree(root, { workspace: null, repository: null, home: null });
  const repository = join(root, 'repository');
  execFileSync('git', ['init', '--quiet', repository]);
  return {
    root,
    repository,
    workspace: join(root, 'workspace'),
    home: join(root, 'home'),
    remove: () => rmSync(root, { recursive: true, force: true }),
  };
}

export function bashCall(command: string, cwd: string): ToolInvocation {
  return toolCall('Bash', { command }, { kind: 'command', shell: 'posix' }, cwd);
}

export function toolCall(
  toolName: string,
  input: unknown,
  route: ToolRoute,
  cwd: string,
): ToolInvocation {
  return createToolInvocation(
    toolName,
    input,
    route,
    { configCwd: cwd, executionCwd: cwd },
    route.kind === 'command' && input !== null && typeof input === 'object'
      ? ((input as { command?: string }).command ?? null)
      : null,
  );
}

/**
 * Everything a caller may compare between the implementations: the stage, the decision's own
 * fields, the level in force, and — where the guard failed closed — the class it threw. An
 * exception that is not a `GuardEvaluationError` is reported rather than rethrown, so a leak past
 * the catch boundary shows up as a difference instead of as a crashed test.
 */
export type GateVerdict = Readonly<{
  stage?: unknown;
  outcome: 'allow' | 'deny' | 'uncaught';
  thrown?: string;
  reason?: string;
  intent?: string;
  ruleId?: string;
  evidence?: unknown;
  level?: string;
  configFallback?: unknown;
}>;

function describeEvaluation(evaluation: GuardEvaluation, thrown?: string): GateVerdict {
  const decision = evaluation.decision;
  return {
    stage: evaluation.stage,
    outcome: decision.kind,
    ...(thrown === undefined ? {} : { thrown }),
    ...(decision.kind === 'deny'
      ? {
          reason: decision.reason,
          intent: decision.intent,
          ruleId: decision.ruleId,
          evidence: decision.evidence,
        }
      : {}),
    ...(evaluation.level === undefined ? {} : { level: evaluation.level }),
    ...(evaluation.configFallback === undefined
      ? {}
      : { configFallback: evaluation.configFallback }),
  };
}

function gateVerdict(run: () => GuardEvaluation): GateVerdict {
  try {
    return describeEvaluation(run());
  } catch (error) {
    const failure = error as Error & { evaluation?: GuardEvaluation };
    if (failure.name === 'GuardEvaluationError' && failure.evaluation) {
      return describeEvaluation(failure.evaluation, failure.name);
    }
    return { outcome: 'uncaught', thrown: failure.name, reason: failure.message };
  }
}

export function shippedVerdict(
  call: ToolInvocation,
  dependencies: Partial<ShippedDependencies>,
): GateVerdict {
  return gateVerdict(() => shippedEvaluateGuard(call, { dependencies }));
}

export function portedVerdict(
  call: ToolInvocation,
  environment: Environment,
  dependencies: Partial<PortedDependencies>,
): GateVerdict {
  return gateVerdict(() => portedEvaluateGuard(call, { environment, dependencies }));
}
