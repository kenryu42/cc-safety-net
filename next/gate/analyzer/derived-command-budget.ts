/** @internal */
export const DERIVED_COMMAND_WORK_LIMITS = Object.freeze({
  maxDerivedTokens: 16_384,
});

export const REASON_DERIVED_COMMAND_WORK_LIMIT =
  "Command analysis exceeds CC Safety Net's derived-command work limit. Reduce nested or embedded command complexity and retry.";

export type DerivedCommandWorkBudget = {
  derivedTokens: number;
};

export class DerivedCommandWorkLimitError extends Error {
  constructor() {
    super(REASON_DERIVED_COMMAND_WORK_LIMIT);
    this.name = 'DerivedCommandWorkLimitError';
  }
}

export function createDerivedCommandWorkBudget(): DerivedCommandWorkBudget {
  return { derivedTokens: 0 };
}

export function reserveDerivedCommandTokens(
  budget: DerivedCommandWorkBudget,
  derivedTokens: number,
): void {
  if (
    !Number.isSafeInteger(budget.derivedTokens) ||
    budget.derivedTokens < 0 ||
    budget.derivedTokens > DERIVED_COMMAND_WORK_LIMITS.maxDerivedTokens ||
    !Number.isSafeInteger(derivedTokens) ||
    derivedTokens < 0 ||
    derivedTokens > DERIVED_COMMAND_WORK_LIMITS.maxDerivedTokens - budget.derivedTokens
  ) {
    throw new DerivedCommandWorkLimitError();
  }
  budget.derivedTokens += derivedTokens;
}
