import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createTestEnvironment, type Environment } from '@next/core/environment';
import type { EffectivePolicy } from '@next/core/policy/types';
import { createToolInvocation, type ToolInvocation, type ToolRoute } from '@next/gate/invocation';
import {
  type GuardEvaluation,
  type GuardDependencies as PortedDependencies,
  evaluateGuard as portedEvaluateGuard,
} from '@next/gate/pipeline';
import { findSensitivePathTarget } from '@next/gate/secret/secret-protection';
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

/**
 * Process state for the trace differentials: a synthetic home over an empty filesystem, so a
 * recording depends on nothing but the command — no path exists and `realpath` answers null, on
 * the shipped side as on the ported one.
 */
export const SYNTHETIC_ENVIRONMENT = createTestEnvironment({
  env: new Map([
    ['HOME', '/home/agent'],
    ['PATH', '/usr/local/bin:/usr/bin:/bin'],
    ['SHELL', '/bin/bash'],
    ['TMPDIR', '/tmp'],
    ['USER', 'agent'],
  ]),
  home: '/home/agent',
  tmpdir: '/tmp',
});

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

/**
 * Names the class of the port's one intended divergence from the shipped gate: a `secret.*` denial
 * of a relative operand that is not sensitive against the execution cwd, in a command containing a
 * `cd` word. The predicate is deliberately no tighter than that — it does not check that the `cd`
 * is the one that moved the operand's cwd. What a divergence actually is stays pinned by the exact
 * inputs harvested.test.ts and secret/secret-protection.test.ts list, and by the contract corpus's
 * knownGap row that pipeline.test.ts checks by stage and ruleId, so a row this predicate would wave
 * through still fails unless those pins name it.
 */
export function deniedByTrackedCwd(
  command: string,
  target: string,
  ruleId: string | undefined,
  cwd: string,
  environment: Environment,
  config?: EffectivePolicy['secretProtection'],
): boolean {
  return (
    ruleId?.startsWith('secret.') === true &&
    !/^(?:[/~$]|[A-Za-z]:[\\/]|file:)/i.test(target) &&
    /(?:^|[\s;&|(){}`])cd(?=\s|$)/.test(command) &&
    findSensitivePathTarget(
      [target],
      cwd,
      environment,
      // A resolved snapshot states its path lists as readonly; the matcher's own entry point
      // takes the configuration shape, so the lists are copied rather than aliased.
      config === undefined
        ? undefined
        : { ...config, denyPaths: [...config.denyPaths], allowPaths: [...config.allowPaths] },
    ) === null
  );
}
