import { afterAll, describe, expect, test } from 'bun:test';
import { createProcessEnvironment } from '@next/core/environment';
import { resolveProtectedGitMetadata } from '@/guards/git-metadata-protection';
import { policySnapshot } from '../../helpers/policy';
import {
  bashCall,
  createGateTree,
  deniedByTrackedCwd,
  type GateVerdict,
  portedVerdict,
  shippedVerdict,
} from '../helpers/gate-differential';
import { HARVESTED_LITERAL_COUNT, HARVESTED_LITERALS } from '../helpers/harvested-literals';
import { FUZZ_SAMPLE_COUNT, FUZZ_SEED, fuzzShellSources } from '../helpers/shell-inputs';

/**
 * Every string the shipped test suite spells out, replayed as a command through both gates. The
 * legacy suite proved thousands of small facts against `src/`; running its literals through the
 * port turns all of them into one oracle without importing or copying a single test file. The
 * seeded fuzz then pins the catch boundary: whatever the port throws, `src/` throws it too, and
 * the class is always `GuardEvaluationError`.
 */

const tree = createGateTree('gate-harvested-');
const environment = createProcessEnvironment();

afterAll(() => {
  tree.remove();
});

/** Both directories are real, so a relative operand resolves; only one of them is a repository. */
const PLACES = [
  {
    where: 'workspace',
    cwd: tree.workspace,
    metadata: resolveProtectedGitMetadata([tree.workspace]),
  },
  {
    where: 'repository',
    cwd: tree.repository,
    metadata: resolveProtectedGitMetadata([tree.repository]),
  },
] as const;

/**
 * The level comes from the policy each side is handed. `getCCSafetyNetEnvModes` can still raise it
 * from an ambient `CC_SAFETY_NET_*` variable, but both gates read that from the same process — the
 * shipped one directly, the port through the snapshot of it — so the two always agree.
 */
const LEVELS = [
  { level: 'standard', snapshot: policySnapshot() },
  { level: 'strict', snapshot: policySnapshot({ safety: { level: 'strict' } }) },
] as const;

const PARANOID_LEVELS = [
  {
    level: 'paranoid_rm',
    snapshot: policySnapshot({ safety: { overrides: { paranoidRm: true } } }),
  },
  {
    level: 'paranoid_interpreters',
    snapshot: policySnapshot({ safety: { overrides: { paranoidInterpreters: true } } }),
  },
] as const;

type Mismatch = {
  input: string;
  where: string;
  level: string;
  ported: GateVerdict;
  shipped: GateVerdict;
};

/** Room for a slow machine: a batch decides a few thousand invocations against both gates. */
const BATCH_TIMEOUT_MS = 30_000;

/**
 * The one class of difference the port is meant to have: a secret denial the shared guard walk
 * reaches because a `cd` moved the tracked cwd. Collected instead of failing, then pinned to the
 * exact inputs below so a second literal cannot slip into the class unnoticed.
 */
const walkDivergences: Mismatch[] = [];

function evidenceSegment(verdict: GateVerdict): string | undefined {
  const evidence = Array.isArray(verdict.evidence) ? verdict.evidence[0] : undefined;
  if (typeof evidence !== 'object' || evidence === null || !('segment' in evidence))
    return undefined;
  return typeof evidence.segment === 'string' ? evidence.segment : undefined;
}

/** Which verdicts the replay actually reached, so the batches cannot pass by deciding nothing. */
const reached = new Set<string>();

function disagreements(input: string, index: number): Mismatch[] {
  const levels = index % 10 === 0 ? [...LEVELS, ...PARANOID_LEVELS] : LEVELS;
  return PLACES.flatMap((place) =>
    levels.flatMap((entry) => {
      const call = bashCall(input, place.cwd);
      const dependencies = {
        loadPolicySnapshot: () => entry.snapshot,
        resolveGitMetadata: () => place.metadata,
      };
      const ported = portedVerdict(call, environment, dependencies);
      const shipped = shippedVerdict(call, dependencies);
      reached.add(`${ported.outcome} ${String(ported.stage)} ${ported.ruleId ?? ''}`.trim());
      if (Bun.deepEquals(ported, shipped, true)) return [];
      const mismatch = { input, where: place.where, level: entry.level, ported, shipped };
      const segment = evidenceSegment(ported);
      if (
        ported.outcome === 'deny' &&
        ported.stage === 'secret-protection' &&
        (shipped.outcome === 'allow' || shipped.stage === 'command-analysis') &&
        segment !== undefined &&
        deniedByTrackedCwd(
          input,
          segment,
          ported.ruleId,
          place.cwd,
          environment,
          entry.snapshot.policy.secretProtection,
        )
      ) {
        walkDivergences.push(mismatch);
        return [];
      }
      return [mismatch];
    }),
  );
}

const BATCH_SIZE = 250;

describe(`${HARVESTED_LITERAL_COUNT} literals harvested from the shipped test suite`, () => {
  test('the harvest read whole files, not a fragment of them', () => {
    expect(HARVESTED_LITERAL_COUNT).toBeGreaterThan(5_000);
    for (const known of ['rm -rf /', 'git reset --hard', 'cat ~/.ssh/config', 'npm run build']) {
      expect(HARVESTED_LITERALS).toContain(known);
    }
    // A literal this long means the scanner lost the quote state and swallowed source: the
    // longest the shipped suites actually spell out is a few hundred characters.
    expect(HARVESTED_LITERALS.filter((literal) => literal.length > 2_000)).toStrictEqual([]);
  });

  for (let start = 0; start < HARVESTED_LITERAL_COUNT; start += BATCH_SIZE) {
    const batch = HARVESTED_LITERALS.slice(start, start + BATCH_SIZE);
    test(
      `literals ${start + 1}-${start + batch.length} of ${HARVESTED_LITERAL_COUNT} decide identically`,
      () => {
        expect(
          batch.flatMap((input, offset) => disagreements(input, start + offset)),
        ).toStrictEqual([]);
      },
      BATCH_TIMEOUT_MS,
    );
  }

  test('the accepted differences are the tracked-cwd secret denials and nothing else', () => {
    const inputs = [...new Set(walkDivergences.map((entry) => entry.input))].sort();
    console.log(
      `tracked-cwd divergences: ${walkDivergences.length} over ${inputs.length} input(s) ${JSON.stringify(inputs)}`,
    );
    expect(inputs).toStrictEqual(['cd ~ && cat .ssh/config']);
    expect(
      walkDivergences.filter((entry) => entry.ported.ruleId?.startsWith('secret.') !== true),
    ).toStrictEqual([]);
    expect(walkDivergences.filter((entry) => entry.shipped.outcome !== 'allow')).toStrictEqual([]);
  });

  test('the replay reached allows, analyzer denials and secret denials', () => {
    expect([...reached].some((entry) => entry.startsWith('allow'))).toBeTrue();
    expect(reached.has('deny command-analysis rm.recursive-force-root-or-home')).toBeTrue();
    expect(reached.has('deny secret-protection secret.home.ssh')).toBeTrue();
    expect(reached.has('deny command-validation')).toBeTrue();
  });
});

const FUZZ_BATCH_SIZE = 500;

describe(`${FUZZ_SAMPLE_COUNT} seeded fuzz sources through both gates`, () => {
  const sources = fuzzShellSources(FUZZ_SAMPLE_COUNT, FUZZ_SEED);
  const dependencies = {
    loadPolicySnapshot: () => LEVELS[0].snapshot,
    resolveGitMetadata: () => null,
  };
  for (let start = 0; start < sources.length; start += FUZZ_BATCH_SIZE) {
    const batch = sources.slice(start, start + FUZZ_BATCH_SIZE);
    test(
      `sources ${start + 1}-${start + batch.length} agree and never escape the catch boundary`,
      () => {
        const escaped: GateVerdict[] = [];
        const differing = batch.flatMap((source) => {
          const call = bashCall(source, tree.workspace);
          const ported = portedVerdict(call, environment, dependencies);
          if (ported.outcome === 'uncaught') escaped.push(ported);
          const shipped = shippedVerdict(call, dependencies);
          return Bun.deepEquals(ported, shipped, true) ? [] : [{ source, ported, shipped }];
        });
        expect({ differing, escaped }).toStrictEqual({ differing: [], escaped: [] });
      },
      BATCH_TIMEOUT_MS,
    );
  }
});
