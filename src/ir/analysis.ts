import type { CommandProgram, ShellKind } from './command.js';
import type { CommandTraceContext } from './command-trace.js';
import type { BlockIntent } from './decision.js';
import type { EffectiveSafetyCapabilities, PolicySnapshot } from './policy.js';

export interface DestructiveCommandRuleMatch {
  id: string;
  reason: string;
  intent: BlockIntent;
}

/** Result of command analysis */
export interface AnalyzeResult {
  /** The reason the command was blocked */
  reason: string;
  /** The specific segment that triggered the block */
  segment: string;
  /** Stable identifier for the rule that blocked the command */
  ruleId?: string;
  /** Intended agent behavior after the block */
  intent?: BlockIntent;
}

/** Filesystem lookups the analyzer needs, so path facts are injected instead of read ambiently. */
export type PathResolver = Readonly<{
  /** Fully resolved path, or null when it cannot be resolved. */
  realpath: (path: string) => string | null;
  /** What sits at the path: a symlink, some other existing entry, or nothing. */
  entryKind: (path: string) => 'symlink' | 'present' | 'missing';
}>;

/**
 * Git control-plane paths that must not be mutated, resolved once at the entry
 * point. May cover several repositories when the execution and configuration
 * directories live in different ones.
 */
export type ProtectedGitMetadata = Readonly<{
  entries: readonly string[];
  markerFiles: readonly string[];
  directories: readonly string[];
  hooksDirectories: readonly string[];
}>;

/** Ambient process state the analyzer reads, captured once at the entry point. */
export type EnvironmentContext = Readonly<{
  env: ReadonlyMap<string, string>;
  home: string;
  tmpdir: string;
  paths: PathResolver;
}>;

/**
 * Options for command analysis.
 * @internal
 */
export interface AnalyzeOptions {
  /** Immutable policy snapshot to evaluate. */
  policySnapshot: PolicySnapshot;
  /** Current working directory */
  cwd?: string;
  /** Shell syntax to use for command-specific analysis */
  shell?: ShellKind;
  /** Effective cwd after cd commands (null = unknown, undefined = use cwd) */
  effectiveCwd?: string | null;
  /** Environment assignments inherited by nested command analysis */
  envAssignments?: ReadonlyMap<string, string>;
  /** Fail-closed on unparseable commands */
  strict?: boolean;
  /** Block non-temp rm -rf even within cwd */
  paranoidRm?: boolean;
  /** Block interpreter one-liners */
  paranoidInterpreters?: boolean;
  /** Allow local Git discard commands in linked worktrees */
  worktreeMode?: boolean;
  /** Allow $TMPDIR paths (false when TMPDIR is overridden to non-temp) */
  allowTmpdirVar?: boolean;
  /** Recorder that captures the analysis steps for `explain` */
  trace?: CommandTraceContext;
  /** Analyze programs with unclosed quotes instead of falling back to raw-text scanning */
  analyzePartialProgram?: boolean;
}

/**
 * What the analyzer entry point needs: the caller's options plus the process state it must
 * read instead of touching env, home, tmpdir or the filesystem.
 */
export type AnalyzeInput = AnalyzeOptions & {
  /** Capability values and provenance already resolved at the caller boundary. */
  effectiveCapabilities: EffectiveSafetyCapabilities;
  environment: EnvironmentContext;
  protectedGitMetadata: ProtectedGitMetadata | null;
};

export interface AnalyzeNestedOverrides {
  effectiveCwd?: string | null;
  envAssignments?: ReadonlyMap<string, string>;
  worktreeMode?: boolean;
  /** Functions the nested source can still call: set only where it runs in the same shell. */
  functionDefinitions?: ReadonlyMap<string, CommandProgram>;
}
