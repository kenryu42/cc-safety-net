/**
 * Every cap the shipped analyzer enforces, in one table, so a breach anywhere in the gate reports
 * through one path: `AnalysisLimit{kind}` → `errorCode` (the public audit classes) → `reason`.
 *
 * Inventory of the caps in `src/` (value; reason wording today; error code today):
 *
 * Path canonicalization (`src/analyzer/path-canonicalization.ts`, `PATH_CANONICALIZATION_LIMITS`)
 * - realpath attempts 16,384 and processed candidate bytes 4 MiB: `PathCanonicalizationLimitError`
 *   → `path-canonicalization-limit`, "exceeds safe analysis limits. Simplify or split…" — except
 *   where a caller swallows it: `src/analyzer/recursive-delete-targets.ts` (cwd, home, allow-path
 *   and workspace comparisons fall back to lexical or to false), `src/analyzer/heredoc-files.ts`
 *   (the tracked path is dropped) and `src/guards/git-metadata-protection.ts` (the anchor is
 *   dropped): none, caught silently. `src/guards/secret-protection.ts` rethrows it.
 * - environment expansion depth 64, and the unsupported forms `${NAME=…}`, `${NAME:?…}` on an
 *   unusable value, an unknown operator on a supported name and an unterminated `${NAME`: the same
 *   error, code and wording.
 * - missing suffix components 256: not a breach; the walk stops and returns the lexical join.
 *
 * Structural shell syntax (`src/guards/semantic-facts.ts`): a guard that meets a nested program
 * with status `limited` throws `StructuralShellSyntaxLimitError` → `structural-shell-syntax-limit`,
 * "exceeds safe analysis limits. Simplify or split…". The parser caps themselves
 * (`src/parser/command.ts`: 131,072 code units, 16,384 words, depth 64; `entry-projection.ts`:
 * 256 function expansions) stay in the parser as status `limited`; the top-level program denies
 * with the recursion or structural-validation wording without throwing.
 *
 * Derived command work (`src/analyzer/derived-command-budget.ts` and the sites sharing its error):
 * derived tokens 16,384; tracked heredoc files 64 (`src/analyzer/heredoc-files.ts`); control-flow
 * states 64 per deduplication (`src/analyzer/analyze-command.ts`); wrapper peel iterations 20
 * (`src/rules/constants.ts`, `src/analyzer/segment.ts`; also a plain loop bound in
 * `wrapper-prelude.ts`); and a `command` wrapper still at the head after peeling. All caught in
 * `analyzeCommandInternal` → deny "exceeds CC Safety Net's derived-command work limit…": none,
 * an ordinary deny.
 *
 * Recursion depth 10 (`src/rules/constants.ts`): a returned deny "exceeds maximum recursion
 * depth…": none, an ordinary deny.
 *
 * Parallel (`src/analyzer/parallel-budget.ts`): child analyses 1,024; derived tokens 16,384;
 * derived bytes 1 MiB; placeholder replacements 16,384. Caught in `analyzeCommandInternal` → deny
 * "Parallel command expands beyond CC Safety Net's analysis limits…": none, an ordinary deny.
 *
 * The table below reports the derived-command and parallel breaches with the command-analysis
 * wording, not the two sentences above: design §4.8 names two wordings plus recursion depth, and
 * no corpus row or contract line asserts either sentence (the contract lists budget reason
 * strings as detail). Phase 3 bakes this choice into the denial text.
 *
 * Not breaches (no entry below): text-scanner work units (`src/analyzer/text-scanner.ts`) are a
 * measurement the linear-scan tests read; positional expansion (`src/analyzer/shell-execution.ts`,
 * 16,384 words / 131,072 characters) makes the source dynamic; git alias depth 5
 * (`src/analyzer/git/parse.ts`) stops expanding; the path-scan splice depth 8
 * (`src/analyzer/wrapper-prelude.ts`) returns the spliced view.
 *
 * Rule-visible (no entry below, per design §8.2): brace expansion of rm targets 64 words / 64
 * expansions / 16,384 characters (`src/analyzer/recursive-delete-targets.ts`) classifies the
 * target as outside the anchored cwd under an `rm.*` rule; `GIT_CONFIG_COUNT` above 1,024
 * (`src/analyzer/git/env.ts`) is `git.alias-config`; an `env -S` splice above 64 words
 * (`src/analyzer/wrapper-prelude.ts`) falls back to the raw-text scan.
 *
 * Intake, checked before a Budget exists: hook stdin 8 MiB (`src/integrations/hook/common.ts`)
 * → deny "Failed to parse hook input JSON." with no audit record: none; tool-input traversal
 * (`src/parser/tool-input.ts`: depth 64, nodes 10,000, keys 10,000, string 1 MiB, aggregate
 * strings 4 MiB, git-diff fallback candidates 64, and the shape refusals: accessor property,
 * proxy, inherited `command`, cycle) → `ToolInputLimitError` → `tool-input-limit`, "failed closed
 * because command analysis failed unexpectedly…" with the command omitted from the evidence.
 *
 * Outside analysis and not listed: audit field truncation (`src/engine/audit.ts`), custom-rule
 * reason length 256 (`src/rules/constants.ts`), rulebook, fetch and retention limits.
 */

export const REASON_COMMAND_ANALYSIS_LIMIT =
  'CC Safety Net could not analyze the command because it exceeds safe analysis limits. Simplify or split the command and retry.';

export const REASON_RECURSION_LIMIT =
  'Command exceeds maximum recursion depth and cannot be safely analyzed. Flatten the nesting and retry.';

export const REASON_SAFETY_NET_FAILED_CLOSED =
  'CC Safety Net failed closed because command analysis failed unexpectedly. This is not caused by your command. Report it to the user.';

export const REASON_HOOK_INPUT_UNREADABLE = 'Failed to parse hook input JSON.';

/** The audit error classes a limit breach maps to; `unexpected-error` is for everything else. */
export type AnalysisErrorCode =
  | 'path-canonicalization-limit'
  | 'tool-input-limit'
  | 'structural-shell-syntax-limit';

type Limit = { cap?: number; errorCode: AnalysisErrorCode; reason: string };

const PATH = {
  errorCode: 'path-canonicalization-limit',
  reason: REASON_COMMAND_ANALYSIS_LIMIT,
} as const;
const STRUCTURAL = {
  errorCode: 'structural-shell-syntax-limit',
  reason: REASON_COMMAND_ANALYSIS_LIMIT,
} as const;
const TOOL_INPUT = {
  errorCode: 'tool-input-limit',
  reason: REASON_SAFETY_NET_FAILED_CLOSED,
} as const;

export const LIMITS = Object.freeze({
  realpathAttempts: { cap: 16_384, ...PATH },
  processedCandidateBytes: { cap: 4 * 1024 * 1024, ...PATH },
  /** Nesting depth of `${…}` expansions; the unsupported forms fail closed under this kind too. */
  pathEnvironmentExpansion: { cap: 64, ...PATH },
  /** A nested program the parser reported `limited`; the parser's own caps decide. */
  structuralShellSyntax: STRUCTURAL,
  /** A depth that unwinds, not a running total: compare against the cap and throw; do not charge. */
  recursionDepth: {
    cap: 10,
    errorCode: 'structural-shell-syntax-limit',
    reason: REASON_RECURSION_LIMIT,
  },
  derivedTokens: { cap: 16_384, ...STRUCTURAL },
  trackedHeredocFiles: { cap: 64, ...STRUCTURAL },
  /** Per deduplication of one state list, not cumulative: compare against the cap directly. */
  controlFlowStates: { cap: 64, ...STRUCTURAL },
  wrapperPeelIterations: { cap: 20, ...STRUCTURAL },
  parallelChildAnalyses: { cap: 1_024, ...STRUCTURAL },
  parallelDerivedTokens: { cap: 16_384, ...STRUCTURAL },
  parallelDerivedBytes: { cap: 1024 * 1024, ...STRUCTURAL },
  parallelPlaceholderReplacements: { cap: 16_384, ...STRUCTURAL },
  hookInputBytes: {
    cap: 8 * 1024 * 1024,
    errorCode: 'tool-input-limit',
    reason: REASON_HOOK_INPUT_UNREADABLE,
  },
  /** A depth that unwinds, not a running total: compare against the cap and throw; do not charge. */
  toolInputDepth: { cap: 64, ...TOOL_INPUT },
  toolInputNodes: { cap: 10_000, ...TOOL_INPUT },
  toolInputKeys: { cap: 10_000, ...TOOL_INPUT },
  /** Per string, not cumulative (the aggregate is the next kind): compare and throw; do not charge. */
  toolInputStringBytes: { cap: 1024 * 1024, ...TOOL_INPUT },
  toolInputAggregateStringBytes: { cap: 4 * 1024 * 1024, ...TOOL_INPUT },
  toolInputGitDiffCandidates: { cap: 64, ...TOOL_INPUT },
  /** An accessor property, proxy, inherited `command` or cycle in the tool input. */
  toolInputShape: TOOL_INPUT,
} satisfies Record<string, Limit>);

export type LimitKind = keyof typeof LIMITS;

/** The kinds with a numeric cap: the ones a Budget counts. The rest are thrown by their caller. */
export type CountedKind = {
  [K in LimitKind]: (typeof LIMITS)[K] extends { cap: number } ? K : never;
}[LimitKind];

/** The one exception thrown on purpose inside the gate; the pipeline's catch boundary maps it. */
export class AnalysisLimit extends Error {
  override readonly name = 'AnalysisLimit';

  constructor(readonly kind: LimitKind) {
    super(LIMITS[kind].reason);
  }
}

/** Independent counters for one gate call; a counter past its cap throws `AnalysisLimit`. */
export function createBudget() {
  const counters = new Map<CountedKind, number>();
  return {
    counters,
    /** Paths already canonicalized in this call, keyed by the requested path. */
    resolvedPaths: new Map<string, string>(),
    charge(kind: CountedKind, units = 1): void {
      const total = (counters.get(kind) ?? 0) + units;
      counters.set(kind, total);
      if (total > LIMITS[kind].cap) throw new AnalysisLimit(kind);
    },
  };
}

export type Budget = ReturnType<typeof createBudget>;
