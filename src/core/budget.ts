export const REASON_COMMAND_ANALYSIS_LIMIT =
  'CC Safety Net could not analyze the command because it exceeds safe analysis limits. Simplify or split the command and retry.';

export const REASON_RECURSION_LIMIT =
  'Command exceeds maximum recursion depth and cannot be safely analyzed. Flatten the nesting and retry.';

export const REASON_SAFETY_NET_FAILED_CLOSED =
  'CC Safety Net failed closed because command analysis failed unexpectedly. This is not caused by your command. Report it to the user.';

/** @internal */
export const REASON_DERIVED_COMMAND_WORK_LIMIT =
  "Command analysis exceeds CC Safety Net's derived-command work limit. Reduce nested or embedded command complexity and retry.";

export type AnalysisErrorCode =
  | 'path-canonicalization-limit'
  | 'tool-input-limit'
  | 'structural-shell-syntax-limit';

type Limit = { cap?: number; errorCode: AnalysisErrorCode; reason: string };

const PATH = {
  errorCode: 'path-canonicalization-limit',
  reason: REASON_COMMAND_ANALYSIS_LIMIT,
} as const;
const DERIVED = {
  errorCode: 'structural-shell-syntax-limit',
  reason: REASON_DERIVED_COMMAND_WORK_LIMIT,
} as const;

export const LIMITS = Object.freeze({
  realpathAttempts: { cap: 16_384, ...PATH },
  processedCandidateBytes: { cap: 4 * 1024 * 1024, ...PATH },

  pathEnvironmentExpansion: { cap: 64, ...PATH },

  recursionDepth: {
    cap: 10,
    errorCode: 'structural-shell-syntax-limit',
    reason: REASON_RECURSION_LIMIT,
  },
  derivedTokens: { cap: 16_384, ...DERIVED },

  trackedHeredocFiles: { cap: 64, ...DERIVED },

  scriptFiles: { cap: 64, ...DERIVED },

  controlFlowStates: { cap: 64, ...DERIVED },

  wrapperPeelIterations: { cap: 20, ...DERIVED },

  derivedCommandShape: DERIVED,
} satisfies Record<string, Limit>);

export type LimitKind = keyof typeof LIMITS;

export type CountedKind = {
  [K in LimitKind]: (typeof LIMITS)[K] extends { cap: number } ? K : never;
}[LimitKind];

export class AnalysisLimit extends Error {
  override readonly name = 'AnalysisLimit';

  constructor(readonly kind: LimitKind) {
    super(LIMITS[kind].reason);
  }
}

export function createBudget() {
  const counters = new Map<CountedKind, number>();
  return {
    counters,

    resolvedPaths: new Map<string, string>(),
    charge(kind: CountedKind, units = 1): void {
      const total = (counters.get(kind) ?? 0) + units;
      counters.set(kind, total);
      if (total > LIMITS[kind].cap) throw new AnalysisLimit(kind);
    },
  };
}

export type Budget = ReturnType<typeof createBudget>;
