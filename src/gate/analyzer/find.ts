import { createBudget } from '@/core/budget';
import type { ProtectedGitMetadata } from '@/core/git/metadata';
import { filterDestructiveCommandMatch } from '@/core/policy/effective-rules';
import { SHELL_WRAPPERS } from '@/core/rules/constants';
import { destructiveCommandMatch } from '@/core/rules/destructive';
import type { DestructiveCommandRuleMatch } from '@/core/rules/types';
import type { CommandWord } from '@/core/shell/model';
import { getBasename } from '@/core/shell/tokens';
import type { EnvironmentContext } from '@/gate/analysis';
import {
  isProtectedGitHookNameSelection,
  mayHaveGitMetadataEntryNamed,
  REASON_GIT_METADATA_PROTECTION,
} from '@/gate/guards/git-metadata-protection';
import { analysisWordText, textCommandWords } from './command-words';
import {
  classifyRecursiveDeleteTarget,
  createRecursiveDeleteTargetContext,
  deleteTargetWordFacts,
  hasOnlyScopedDeleteTargets,
  type ScopedDeleteTargetOptions,
} from './recursive-delete-targets';
import { hasRecursiveForceFlags, hasRecursiveOption } from './rm-flags';
import { extractDashCArg } from './shell-wrappers';
import { stripWrappers, stripWrappersForPathScan } from './wrapper-prelude';

const REASON_FIND_DELETE = 'find -delete permanently removes files. Use -print first to preview.';
const REASON_FIND_EXEC_RM_RF = 'find -exec rm -rf is dangerous. Use explicit file list instead.';
const FIND_EXEC_PRIMARIES = new Set(['-exec', '-execdir', '-ok', '-okdir']);
const FIND_PRIMARY_ARITY = new Map<string, number>([
  ...[
    '-Bmin',
    '-Bnewer',
    '-Btime',
    '-amin',
    '-anewer',
    '-atime',
    '-cmin',
    '-cnewer',
    '-context',
    '-ctime',
    '-f',
    '-flags',
    '-fprint',
    '-fprint0',
    '-fls',
    '-fstype',
    '-gid',
    '-group',
    '-ilname',
    '-iname',
    '-inum',
    '-ipath',
    '-iwholename',
    '-iregex',
    '-links',
    '-lname',
    '-maxdepth',
    '-mindepth',
    '-mmin',
    '-mnewer',
    '-mtime',
    '-name',
    '-newer',
    '-newerXY',
    '-newermt',
    '-path',
    '-perm',
    '-printf',
    '-regex',
    '-samefile',
    '-size',
    '-type',
    '-uid',
    '-used',
    '-user',
    '-wholename',
    '-xattrname',
    '-xtype',
  ].map((primary) => [primary, 1] as const),
  ['-fprintf', 2],
]);

export interface AnalyzeFindContext extends ScopedDeleteTargetOptions {
  analyzeTokens?: (
    tokens: readonly string[],
    cwd: string | null | undefined,
  ) => DestructiveCommandRuleMatch | null;
}

export function analyzeFindMatch(
  words: readonly CommandWord[],
  context: AnalyzeFindContext,
): DestructiveCommandRuleMatch | null {
  const tokens = words.map(analysisWordText);
  const catastrophicMatch = findCatastrophicDeleteMatch(words, tokens, context);
  if (catastrophicMatch) return catastrophicMatch;

  if (findHasDelete(tokens) && !hasOnlyScopedFindStartingPoints(words, tokens, context)) {
    const match = filterDestructiveCommandMatch(
      destructiveCommandMatch('find.delete', REASON_FIND_DELETE),
      context.policy,
    );
    if (match) return match;
  }

  const budget = context.budget ?? createBudget();

  for (const part of parseFindArguments(tokens).expression) {
    if (part.kind !== 'exec') continue;
    budget.charge('derivedTokens', tokens.length - part.index - 1);
    const directMatch = analyzeFindExecCommand(part.command, context.environment);
    if (directMatch) {
      const match = filterDestructiveCommandMatch(directMatch, context.policy);
      if (match) return match;
    }

    const directoryRelative = tokens[part.index] === '-execdir' || tokens[part.index] === '-okdir';
    const nestedMatch =
      context.analyzeTokens?.(part.command, directoryRelative ? null : context.cwd) ?? null;
    const match = nestedMatch?.id.startsWith('custom.')
      ? nestedMatch
      : filterDestructiveCommandMatch(nestedMatch, context.policy);
    if (match) return match;
  }

  return null;
}

function findCatastrophicDeleteMatch(
  words: readonly CommandWord[],
  tokens: readonly string[],
  context: AnalyzeFindContext,
): DestructiveCommandRuleMatch | null {
  const deletesDirectly = findHasDelete(tokens);
  if (!deletesDirectly && !findExecRmDeletesFoundPaths(tokens, context.environment)) return null;

  const targets = getFindStartingPoints(words) ?? textCommandWords(['.']);
  const targetContext = createRecursiveDeleteTargetContext({
    ...context,
    allowPaths: context.policy?.destructiveCommandAllowPaths,
    posixShell: true,
  });
  for (const target of targets) {
    const facts = deleteTargetWordFacts(target);
    for (const expandedTarget of facts.expandedTargets ?? [analysisWordText(target)]) {
      const classification = classifyRecursiveDeleteTarget(expandedTarget, targetContext, {
        targetIsLiteral: facts.expandedTargets !== undefined || facts.targetIsLiteral,
        tmpdirWordSplittingProtected: facts.tmpdirWordSplittingProtected,
      });

      if (classification.kind === 'root_or_home_target') {
        return destructiveCommandMatch(
          'rm.recursive-force-root-or-home',
          'rm -rf targeting root or home directory is extremely dangerous and always blocked.',
        );
      }
      if (
        classification.kind === 'git_metadata_target' &&
        !nameFilterExcludesGitMetadata(
          words,
          targetContext.protectedGitMetadata,
          context.environment,
        )
      ) {
        return destructiveCommandMatch('find.delete-git-metadata', REASON_GIT_METADATA_PROTECTION);
      }
    }
  }
  if (
    findSelectsHooksByName(tokens) &&
    targetContext.resolvedCwd &&
    isProtectedGitHookNameSelection(
      targets.map(analysisWordText),
      targetContext.resolvedCwd,
      targetContext.protectedGitMetadata,
      targetContext.environment,
      targetContext.budget,
    )
  ) {
    return destructiveCommandMatch('find.delete-git-metadata', REASON_GIT_METADATA_PROTECTION);
  }
  return null;
}

function nameFilterExcludesGitMetadata(
  words: readonly CommandWord[],
  metadata: ProtectedGitMetadata | null,
  environment: EnvironmentContext,
): boolean {
  if (!metadata) return false;
  const tokens = words.map(analysisWordText);
  const patterns: RegExp[] = [];
  let actionSeen = false;
  for (const part of parseFindArguments(tokens).expression) {
    const token = tokens[part.index] ?? '';
    if (part.kind === 'exec') {
      const stripped = stripWrappersForPathScan([...part.command], environment);
      const recursesIntoMatchedDirectories = hasRecursiveOption(stripped);
      const execRunsUnanalyzedShell = SHELL_WRAPPERS.has(
        getBasename(stripped[0] ?? '').toLowerCase(),
      );
      const derivesPathFromMatch = part.command.some((arg) => arg !== '{}' && arg.includes('{}'));
      const execdirFixedPathEscapesCwdAnalysis =
        (token === '-execdir' || token === '-okdir') &&
        stripped.slice(1).some((arg) => arg !== '{}' && !arg.startsWith('-'));
      if (
        recursesIntoMatchedDirectories ||
        execRunsUnanalyzedShell ||
        derivesPathFromMatch ||
        execdirFixedPathEscapesCwdAnalysis
      ) {
        return false;
      }
      actionSeen = true;
      continue;
    }
    if (token === '-delete') {
      actionSeen = true;
      continue;
    }
    if (token === '-name' || token === '-iname') {
      const pattern = words[part.index + 1];
      const translatableLiteralGlob =
        pattern?.provenance === 'literal' && !/[[\\]/.test(pattern.text);
      if (!translatableLiteralGlob) return false;
      if (!actionSeen) patterns.push(findNamePatternRegExp(pattern.text, token === '-iname'));
      continue;
    }
    if (!FIND_PRIMARIES_THAT_NEVER_WIDEN.has(token)) return false;
  }
  return (
    patterns.length > 0 &&
    !mayHaveGitMetadataEntryNamed(metadata, (name) => patterns.every((regex) => regex.test(name)))
  );
}

const FIND_PRIMARIES_THAT_NEVER_WIDEN = new Set([
  '-a',
  '-and',
  '-depth',
  '-maxdepth',
  '-mindepth',
  '-mmin',
  '-mtime',
  '-newer',
  '-size',
  '-type',
]);

function findNamePatternRegExp(pattern: string, caseless: boolean): RegExp {
  const source = pattern.replace(/[*?]|[.+^${}()|\]/]/g, (char) =>
    char === '*' ? '.*' : char === '?' ? '.' : `\\${char}`,
  );
  return new RegExp(`^${source}$`, caseless ? 'isu' : 'su');
}

const RM_AS_ANY_WORD = /(?:^|[\s;&|(`{])\\?(?:\S*\/)?rm(?:dir)?(?=[\s;&|)`}]|$)/;

export function findExecRmDeletesFoundPaths(
  tokens: readonly string[],
  environment: EnvironmentContext,
): boolean {
  return parseFindArguments(tokens).expression.some((part) => {
    if (part.kind !== 'exec') return false;
    const stripped = stripWrappersForPathScan([...part.command], environment);
    const head = getBasename(stripped[0] ?? '').toLowerCase();
    const shellBodyMentionsRmAfterUnquoting =
      SHELL_WRAPPERS.has(head) &&
      RM_AS_ANY_WORD.test((extractDashCArg(stripped) ?? '').replace(/["'\\]/g, ''));
    const removes = head === 'rm' || head === 'rmdir' || shellBodyMentionsRmAfterUnquoting;
    return removes && stripped.some((token) => token.includes('{}'));
  });
}

function findSelectsHooksByName(tokens: readonly string[]): boolean {
  return tokens.some((token, index) => {
    if (!['-name', '-iname'].includes(token)) return false;
    return tokens[index + 1]?.toLowerCase() === 'hooks';
  });
}

function hasOnlyScopedFindStartingPoints(
  words: readonly CommandWord[],
  tokens: readonly string[],
  context: AnalyzeFindContext,
): boolean {
  if (
    tokens.includes('-follow') ||
    tokens.some((token) => FIND_LEADING_OPTION.test(token) && /[Lf]/.test(token))
  )
    return false;
  const targets = getFindStartingPoints(words);
  return targets !== null && hasOnlyScopedDeleteTargets(targets, context);
}

export function getFindStartingPoints(words: readonly CommandWord[]): CommandWord[] | null {
  const targets = parseFindArguments(words.map(analysisWordText)).startingPoints.flatMap(
    (index) => words[index] ?? [],
  );
  return targets.length > 0 ? targets : null;
}

function analyzeFindExecCommand(
  tokens: readonly string[],
  environment: EnvironmentContext,
): DestructiveCommandRuleMatch | null {
  let execCommand = stripWrappers([...tokens], environment);
  if (execCommand.length === 0) {
    return null;
  }

  let head = getBasename(execCommand[0] ?? '');
  if (head === 'busybox' && execCommand.length > 1) {
    execCommand = execCommand.slice(1);
    head = getBasename(execCommand[0] ?? '');
  }

  if (head === 'rm' && hasRecursiveForceFlags(execCommand)) {
    return destructiveCommandMatch('find.exec-rm-recursive-force', REASON_FIND_EXEC_RM_RF);
  }

  return null;
}

/** @internal */
export function getFindExecCommand(
  tokens: readonly string[],
  execIndex: number,
): { tokens: string[]; nextIndex: number } {
  let terminatorIndex = execIndex + 1;
  while (
    terminatorIndex < tokens.length &&
    tokens[terminatorIndex] !== ';' &&
    !(tokens[terminatorIndex] === '+' && tokens[terminatorIndex - 1] === '{}')
  ) {
    terminatorIndex++;
  }

  return {
    tokens: tokens.slice(execIndex + 1, terminatorIndex),
    nextIndex: Math.min(terminatorIndex + 1, tokens.length),
  };
}

export function findHasDelete(tokens: readonly string[]): boolean {
  return parseFindArguments(tokens).expression.some(
    (part) => part.kind === 'primary' && tokens[part.index] === '-delete',
  );
}

type FindExpressionPart =
  | { readonly kind: 'primary'; readonly index: number }
  | { readonly kind: 'exec'; readonly index: number; readonly command: readonly string[] };

const FIND_LEADING_OPTION = /^-(?:[HLPEXdsx]+f?|[fD]|O\d*)$/;
const FIND_EXPRESSION_OPENERS = new Set(['!', '(', ')']);

export function parseFindArguments(tokens: readonly string[]) {
  const leadingOptions: number[] = [];
  const startingPoints: number[] = [];
  let index = 1;
  while (FIND_LEADING_OPTION.test(tokens[index] ?? '')) {
    const option = tokens[index] ?? '';
    leadingOptions.push(index);
    index++;
    if (index >= tokens.length || !/[fD]$/.test(option)) continue;
    (option.endsWith('f') ? startingPoints : leadingOptions).push(index);
    index++;
  }
  if (tokens[index] === '--') leadingOptions.push(index++);

  while (index < tokens.length) {
    const token = tokens[index] ?? '';
    if (token.startsWith('-') || FIND_EXPRESSION_OPENERS.has(token)) break;
    startingPoints.push(index);
    index++;
  }

  const expression: FindExpressionPart[] = [];
  while (index < tokens.length) {
    const token = tokens[index] ?? '';
    if (isFindExecPrimary(token)) {
      const execCommand = getFindExecCommand(tokens, index);
      expression.push({ kind: 'exec', index, command: execCommand.tokens });
      index = execCommand.nextIndex;
      continue;
    }
    expression.push({ kind: 'primary', index });
    index += 1 + getFindPrimaryArity(token);
  }
  return { leadingOptions, startingPoints, expression };
}

/** @internal */
export function getFindPrimaryArity(token: string): number {
  return FIND_PRIMARY_ARITY.get(token) ?? (/^-newer[A-Za-z]{2}$/.test(token) ? 1 : 0);
}

/** @internal */
export function isFindExecPrimary(token: string | undefined): boolean {
  return token !== undefined && FIND_EXEC_PRIMARIES.has(token);
}
