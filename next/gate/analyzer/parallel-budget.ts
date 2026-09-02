export const PARALLEL_ANALYSIS_LIMITS = Object.freeze({
  maxChildAnalyses: 1_024,
  maxDerivedTokens: 16_384,
  maxDerivedBytes: 1024 * 1024,
  maxPlaceholderReplacements: 16_384,
});

export const REASON_PARALLEL_ANALYSIS_LIMIT =
  "Parallel command expands beyond CC Safety Net's analysis limits. Reduce the template or explicit argument list and retry.";

export type ParallelAnalysisBudget = {
  childAnalyses: number;
  derivedTokens: number;
  derivedBytes: number;
  placeholderReplacements: number;
};

export type ParallelAnalysisReservation = Partial<ParallelAnalysisBudget>;

export class ParallelAnalysisLimitError extends Error {
  constructor() {
    super(REASON_PARALLEL_ANALYSIS_LIMIT);
    this.name = 'ParallelAnalysisLimitError';
  }
}

export function createParallelAnalysisBudget(): ParallelAnalysisBudget {
  return {
    childAnalyses: 0,
    derivedTokens: 0,
    derivedBytes: 0,
    placeholderReplacements: 0,
  };
}

export function reserveParallelAnalysis(
  budget: ParallelAnalysisBudget,
  reservation: ParallelAnalysisReservation,
): void {
  const childAnalyses = reservation.childAnalyses ?? 0;
  const derivedTokens = reservation.derivedTokens ?? 0;
  const derivedBytes = reservation.derivedBytes ?? 0;
  const placeholderReplacements = reservation.placeholderReplacements ?? 0;
  if (
    exceedsLimit(budget.childAnalyses, childAnalyses, PARALLEL_ANALYSIS_LIMITS.maxChildAnalyses) ||
    exceedsLimit(budget.derivedTokens, derivedTokens, PARALLEL_ANALYSIS_LIMITS.maxDerivedTokens) ||
    exceedsLimit(budget.derivedBytes, derivedBytes, PARALLEL_ANALYSIS_LIMITS.maxDerivedBytes) ||
    exceedsLimit(
      budget.placeholderReplacements,
      placeholderReplacements,
      PARALLEL_ANALYSIS_LIMITS.maxPlaceholderReplacements,
    )
  ) {
    throw new ParallelAnalysisLimitError();
  }

  budget.childAnalyses += childAnalyses;
  budget.derivedTokens += derivedTokens;
  budget.derivedBytes += derivedBytes;
  budget.placeholderReplacements += placeholderReplacements;
}

function exceedsLimit(current: number, amount: number, limit: number): boolean {
  return (
    !Number.isSafeInteger(current) ||
    current < 0 ||
    current > limit ||
    !Number.isSafeInteger(amount) ||
    amount < 0 ||
    amount > limit - current
  );
}
