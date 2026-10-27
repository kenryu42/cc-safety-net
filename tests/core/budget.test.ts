import { describe, expect, test } from 'bun:test';
import { AnalysisLimit, type CountedKind, createBudget, LIMITS } from '@/core/budget';

const ANALYSIS =
  'CC Safety Net could not analyze the command because it exceeds safe analysis limits. Simplify or split the command and retry.';
const RECURSION =
  'Command exceeds maximum recursion depth and cannot be safely analyzed. Flatten the nesting and retry.';
const DERIVED_WORK =
  "Command analysis exceeds CC Safety Net's derived-command work limit. Reduce nested or embedded command complexity and retry.";

const CAPS: Readonly<Record<CountedKind, number>> = {
  realpathAttempts: 16_384,
  processedCandidateBytes: 4 * 1024 * 1024,
  pathEnvironmentExpansion: 64,
  recursionDepth: 10,
  derivedTokens: 16_384,
  trackedHeredocFiles: 64,
  scriptFiles: 64,
  controlFlowStates: 64,
  wrapperPeelIterations: 20,
};

const REASONS: Readonly<Record<keyof typeof LIMITS, string>> = {
  realpathAttempts: ANALYSIS,
  processedCandidateBytes: ANALYSIS,
  pathEnvironmentExpansion: ANALYSIS,
  recursionDepth: RECURSION,
  derivedTokens: DERIVED_WORK,
  trackedHeredocFiles: DERIVED_WORK,
  scriptFiles: DERIVED_WORK,
  controlFlowStates: DERIVED_WORK,
  wrapperPeelIterations: DERIVED_WORK,
  derivedCommandShape: DERIVED_WORK,
};

const COUNTED_KINDS: readonly CountedKind[] = [
  'realpathAttempts',
  'processedCandidateBytes',
  'pathEnvironmentExpansion',
  'recursionDepth',
  'derivedTokens',
  'trackedHeredocFiles',
  'scriptFiles',
  'controlFlowStates',
  'wrapperPeelIterations',
];

function limitThrownBy(call: () => void): AnalysisLimit | undefined {
  try {
    call();
    return undefined;
  } catch (error) {
    return error instanceof AnalysisLimit ? error : undefined;
  }
}

describe('analysis budget', () => {
  test('names every capped kind in the table', () => {
    expect(Object.keys(CAPS).sort()).toEqual([...COUNTED_KINDS].sort());
  });

  test('each counter breaches independently one unit past its cap', () => {
    for (const kind of COUNTED_KINDS) {
      const budget = createBudget();
      budget.charge(kind, LIMITS[kind].cap);
      const breach = limitThrownBy(() => budget.charge(kind));
      expect(breach?.kind).toBe(kind);
      expect(breach?.message).toBe(LIMITS[kind].reason);
      expect([...budget.counters.keys()]).toEqual([kind]);
      for (const other of COUNTED_KINDS.filter((candidate) => candidate !== kind)) {
        expect(limitThrownBy(() => budget.charge(other, LIMITS[other].cap))).toBeUndefined();
      }
    }
  });

  test('charges one unit by default and counts cumulatively', () => {
    const budget = createBudget();
    for (let token = 0; token < LIMITS.derivedTokens.cap; token++) budget.charge('derivedTokens');
    expect(budget.counters.get('derivedTokens')).toBe(LIMITS.derivedTokens.cap);
    expect(limitThrownBy(() => budget.charge('derivedTokens'))?.kind).toBe('derivedTokens');
  });

  test('carries a kind for the refusal without a numeric cap', () => {
    expect(new AnalysisLimit('derivedCommandShape').message).toBe(DERIVED_WORK);
    expect(new AnalysisLimit('derivedCommandShape').kind).toBe('derivedCommandShape');
    expect(new AnalysisLimit('derivedCommandShape').name).toBe('AnalysisLimit');
  });

  test('every capped kind ships the cap this table names', () => {
    expect(Object.keys(CAPS).sort()).toStrictEqual(
      Object.entries(LIMITS)
        .filter(([, limit]) => 'cap' in limit)
        .map(([kind]) => kind)
        .sort(),
    );
    for (const [kind, cap] of Object.entries(CAPS)) {
      expect(LIMITS[kind as CountedKind].cap, kind).toBe(cap);
    }
  });

  test('every kind reports the sentence this table names', () => {
    expect(Object.keys(REASONS).sort()).toStrictEqual(Object.keys(LIMITS).sort());
    for (const [kind, reason] of Object.entries(REASONS)) {
      expect(LIMITS[kind as keyof typeof LIMITS].reason, kind).toBe(reason);
    }
  });

  test('maps every kind to a shipped audit error class', () => {
    expect(
      Object.fromEntries(Object.entries(LIMITS).map(([kind, limit]) => [kind, limit.errorCode])),
    ).toEqual({
      realpathAttempts: 'path-canonicalization-limit',
      processedCandidateBytes: 'path-canonicalization-limit',
      pathEnvironmentExpansion: 'path-canonicalization-limit',
      recursionDepth: 'structural-shell-syntax-limit',
      derivedTokens: 'structural-shell-syntax-limit',
      trackedHeredocFiles: 'structural-shell-syntax-limit',
      scriptFiles: 'structural-shell-syntax-limit',
      controlFlowStates: 'structural-shell-syntax-limit',
      wrapperPeelIterations: 'structural-shell-syntax-limit',
      derivedCommandShape: 'structural-shell-syntax-limit',
    });
  });
});
