import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createTestEnvironment, type Environment, type PathResolver } from '@/core/environment';
import { createToolInvocation, type ToolInvocation, type ToolRoute } from '@/gate/invocation';
import {
  type GuardEvaluation,
  type GuardDependencies as PortedDependencies,
  evaluateGuard as portedEvaluateGuard,
} from '@/gate/pipeline';
import { writeTree } from './fixture-tree';

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

export function memoizedPaths(paths: PathResolver): PathResolver {
  const realpaths = new Map<string, string | null>();
  const kinds = new Map<string, ReturnType<PathResolver['entryKind']>>();
  return {
    ...paths,
    realpath: (path) => {
      if (realpaths.has(path)) return realpaths.get(path) ?? null;
      const resolved = paths.realpath(path);
      realpaths.set(path, resolved);
      return resolved;
    },
    entryKind: (path) => {
      const cached = kinds.get(path);
      if (cached !== undefined) return cached;
      const kind = paths.entryKind(path);
      kinds.set(path, kind);
      return kind;
    },
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

export function portedVerdict(
  call: ToolInvocation,
  environment: Environment,
  dependencies: Partial<PortedDependencies>,
): GateVerdict {
  return gateVerdict(() => portedEvaluateGuard(call, { environment, dependencies }));
}
