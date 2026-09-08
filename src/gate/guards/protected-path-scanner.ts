import type { Budget } from '@/core/budget';
import type { EnvironmentContext } from '@/gate/analysis';
import {
  expandTrackedShellVariables,
  type GuardSyntax,
  type ProtectedPathShellState,
  walkGuardSyntax,
} from './guard-walk';
import { StructuralShellSyntaxLimitError } from './semantic-facts';

const MV_OPTIONS_WITH_VALUES = new Set(['-S', '--suffix']);

type ProtectedPathCommandScanner = Readonly<{
  findSegmentTarget: (segment: readonly string[], state: ProtectedPathShellState) => string | null;
  isRedirectionTarget: (target: string, state: ProtectedPathShellState) => boolean;
  findMalformedTarget: (source: string) => string | null;
}>;

/**
 * The adapter every protected-path guard drives the walk through: a segment reaches
 * `findSegmentTarget` with the directory it runs in, a write-like redirection target reaches
 * `isRedirectionTarget` with the tracked variables expanded, and a command the parser could not
 * read whole is handed to `findMalformedTarget` as text.
 */
export function findProtectedPathMutationInCommand(
  syntax: GuardSyntax,
  cwd: string,
  environment: EnvironmentContext,
  budget: Budget,
  scanner: ProtectedPathCommandScanner,
): string | null {
  if (syntax.status === 'structural-limit') throw new StructuralShellSyntaxLimitError();
  if (syntax.status !== 'complete') return scanner.findMalformedTarget(syntax.source);
  return walkGuardSyntax(syntax, cwd, environment, budget, {
    word: (text) => text,
    segment: (tokens, state) => scanner.findSegmentTarget(tokens, state),
    redirection: (redirection, state) =>
      redirection.role === 'file-write' &&
      scanner.isRedirectionTarget(
        expandTrackedShellVariables(redirection.target, state.variables),
        state,
      )
        ? redirection.target
        : null,
  });
}

export function extractMvOperandPaths(args: readonly string[]): {
  sources: readonly string[];
  destination: string | null;
} {
  const operands: string[] = [];
  let targetDirectory: string | null = null;
  let optionsEnded = false;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === undefined) break;
    if (!optionsEnded && arg === '--') {
      optionsEnded = true;
      continue;
    }
    if (!optionsEnded && (arg === '-t' || arg === '--target-directory')) {
      targetDirectory = args[++index] ?? null;
      continue;
    }
    if (!optionsEnded && arg.startsWith('--target-directory=')) {
      targetDirectory = arg.slice('--target-directory='.length);
      continue;
    }
    if (!optionsEnded && arg.startsWith('-t') && arg.length > 2) {
      targetDirectory = arg.slice(2);
      continue;
    }
    if (!optionsEnded && MV_OPTIONS_WITH_VALUES.has(arg)) {
      index++;
      continue;
    }
    if (!optionsEnded && (arg.startsWith('--suffix=') || arg.startsWith('--backup='))) continue;
    if (!optionsEnded && arg.startsWith('-')) continue;
    operands.push(arg);
  }
  return targetDirectory
    ? { sources: operands, destination: targetDirectory }
    : { sources: operands.slice(0, -1), destination: operands.at(-1) ?? null };
}
