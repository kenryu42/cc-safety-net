import { expect } from 'bun:test';
import { mkdirSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import type { Environment } from '@/core/environment';
import { loadRulesPolicy as portedLoadRulesPolicy } from '@/core/policy/scope-policy';
import { snapshotTree, type TreeSpec, writeTree } from './fixture-tree';
import {
  createTempRoot,
  environmentFor,
  type Fold,
  isolationEnv,
  normalize,
  WINDOWS_SEPARATOR_FOLDS,
} from './temp-home';

export type Side = {
  root: string;
  home: string;
  project: string;
  values: Record<string, string | undefined>;
};

const POLICY_TEMP_NAME_RE = /\.[0-9a-f]{16}\.tmp$/;

type GatePolicy = {
  errors: string[];
  warnings: string[];
  rulebooks: readonly {
    source: 'user' | 'project';
    spec: string;
    name: string;
    version: string;
    rules: string[];
  }[];
};

type ManagerResult = {
  ok: boolean;
  errors: string[];
  entries: { spec: string; name: string; version: string; ruleCount: number }[];
};

function seedSide(spec: TreeSpec): Side {
  const root = createTempRoot('rules-manager-');
  const home = join(root, 'home');
  const project = join(root, 'project');
  mkdirSync(home, { recursive: true });
  mkdirSync(project, { recursive: true });
  writeTree(root, spec);
  return { root, home, project, values: isolationEnv(home) };
}

export async function runManagerDifferential<T>(
  spec: TreeSpec,
  run: (side: Side, environment: Environment) => Promise<T>,
) {
  const side = seedSide(spec);
  const ported = await observe(side, () => run(side, environmentFor(side.home, side.values)));
  expect(ported.tree.filter((entry) => POLICY_TEMP_NAME_RE.test(entry.path))).toEqual([]);
  return { results: ported.results, tree: ported.tree, side };
}

async function observe<T>(side: Side, run: () => Promise<T>) {
  const results = await run();
  return normalize({ results, tree: snapshotTree(side.root) }, replacementsFor(side.root));
}

export function expectGateView(side: Side, scope: 'user' | 'project', result: ManagerResult) {
  const ported = gateView(
    portedLoadRulesPolicy(environmentFor(side.home, side.values), { cwd: side.project }),
    scope,
    side.root,
  );
  if (!result.ok) {
    for (const error of result.errors) expect(ported.warnings).toContain(error);
    return;
  }
  expect(ported.errors).toEqual([]);
  expect(ported.rulebooks).toEqual(
    result.entries.map((entry) => ({
      spec: entry.spec,
      name: entry.name,
      version: entry.version,
      ruleCount: entry.ruleCount,
    })),
  );
}

function gateView(policy: GatePolicy, scope: 'user' | 'project', root: string) {
  return normalize(
    {
      errors: policy.errors,
      warnings: policy.warnings,
      rulebooks: policy.rulebooks
        .filter((rulebook) => rulebook.source === scope)
        .map((rulebook) => ({
          spec: rulebook.spec,
          name: rulebook.name,
          version: rulebook.version,
          ruleCount: rulebook.rules.length,
        })),
    },
    replacementsFor(root),
  );
}

function replacementsFor(root: string): readonly Fold[] {
  return [[root, '<root>'], [realpathSync(root), '<root>'], ...WINDOWS_SEPARATOR_FOLDS];
}
