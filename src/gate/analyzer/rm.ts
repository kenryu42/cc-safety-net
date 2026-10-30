import { normalizeMsysDrivePath } from '@/core/paths/canonicalization';
import {
  type DestructiveCommandRulePolicy,
  filterDestructiveCommandMatch,
} from '@/core/policy/effective-rules';
import type { EffectivePolicy } from '@/core/policy/types';
import { destructiveCommandMatch } from '@/core/rules/destructive';
import type { DestructiveCommandRuleMatch } from '@/core/rules/types';
import type { CommandWord } from '@/core/shell/model';
import {
  isProtectedGitDeleteTarget,
  REASON_GIT_METADATA_PROTECTION,
} from '@/gate/guards/git-metadata-protection';
import { analysisWordText } from './command-words';
import {
  createRecursiveDeleteTargetContext,
  deleteTargetWordFacts,
  firstRecursiveDeleteMatch,
  matchRecursiveDeleteClassification,
  type RecursiveDeleteRuleTable,
  type RecursiveDeleteTargetOptions,
} from './recursive-delete-targets';
import { hasRecursiveOption } from './rm-flags';

const REASON_RM_RF =
  'rm -rf outside cwd is blocked. Retry deleting only explicit paths inside the current directory; escalate for anything outside it.';
const REASON_RM_RF_POLICY =
  'rm -rf for non-temporary paths is blocked by the active safety policy. Retry deleting only explicit paths inside the current directory; escalate for anything outside it.';
const REASON_RM_RF_DYNAMIC_TARGET =
  'rm -rf target contains shell variables that cannot be verified safely. Use literal paths within cwd, /tmp, /var/tmp, or $TMPDIR.';
const REASON_RM_RF_ROOT_HOME =
  'rm -rf targeting root or home directory is extremely dangerous and always blocked.';
const REASON_RM_HOME_CWD =
  'rm -rf in home directory is dangerous. Change to a project directory first.';

const RM_RULES: RecursiveDeleteRuleTable = {
  root_or_home_target: { id: 'rm.recursive-force-root-or-home', reason: REASON_RM_RF_ROOT_HOME },
  git_metadata_target: { id: 'rm.git-metadata', reason: REASON_GIT_METADATA_PROTECTION },
  dynamic_target: {
    id: 'rm.recursive-force-dynamic-target',
    reason: REASON_RM_RF_DYNAMIC_TARGET,
  },
  home_cwd_target: { id: 'rm.recursive-force-home-cwd', reason: REASON_RM_HOME_CWD },
  cwd_self_target: { id: 'rm.recursive-force-cwd-self', reason: REASON_RM_RF },
  within_anchored_cwd: { id: 'rm.recursive-force-paranoid', reason: REASON_RM_RF_POLICY },
  outside_anchored_cwd: { id: 'rm.recursive-force-outside-cwd', reason: REASON_RM_RF },
};

export interface AnalyzeRmOptions extends RecursiveDeleteTargetOptions {
  policy?: DestructiveCommandRulePolicy &
    Partial<Pick<EffectivePolicy, 'destructiveCommandAllowPaths'>>;
}

export function analyzeRmMatch(
  words: readonly CommandWord[],
  options: AnalyzeRmOptions,
): DestructiveCommandRuleMatch | null {
  const ctx = createRecursiveDeleteTargetContext({
    ...options,
    allowPaths: options.policy?.destructiveCommandAllowPaths,
    posixShell: true,
  });
  const flagTexts = words.map(analysisWordText);
  const recursive = hasRecursiveOption(flagTexts);
  const targets = extractTargets(words);

  for (const target of targets) {
    const facts = deleteTargetWordFacts(target.word);
    if (recursive && facts.unsafeBraceExpansion) {
      const match = filterDestructiveCommandMatch(
        matchRecursiveDeleteClassification(
          { kind: 'outside_anchored_cwd' },
          ctx,
          options.policy,
          RM_RULES,
        ),
        options.policy,
      );
      if (match) return match;
      continue;
    }

    for (const expandedTarget of facts.expandedTargets ?? [target.text]) {
      const nativeTarget = normalizeMsysDrivePath(expandedTarget);
      const classificationOptions = {
        targetIsLiteral: facts.expandedTargets !== undefined || facts.targetIsLiteral,
        tmpdirWordSplittingProtected: facts.tmpdirWordSplittingProtected,
      };
      if (
        !recursive &&
        ctx.resolvedCwd &&
        isProtectedGitDeleteTarget(
          nativeTarget,
          ctx.resolvedCwd,
          ctx.protectedGitMetadata,
          recursive,
          ctx.environment,
          ctx.budget,
        )
      ) {
        return destructiveCommandMatch('rm.git-metadata', REASON_GIT_METADATA_PROTECTION);
      }
      if (!recursive) continue;
      const match = firstRecursiveDeleteMatch(
        nativeTarget,
        ctx,
        options.policy,
        RM_RULES,
        classificationOptions,
      );
      if (match) return match;
    }
  }

  return null;
}

function extractTargets(words: readonly CommandWord[]): { text: string; word: CommandWord }[] {
  const targets: { text: string; word: CommandWord }[] = [];
  let pastDoubleDash = false;

  for (const word of words.slice(1)) {
    const text = analysisWordText(word);
    if (!text) continue;

    if (text === '--') {
      pastDoubleDash = true;
      continue;
    }

    if (pastDoubleDash) {
      targets.push({ text, word });
      continue;
    }

    if (!text.startsWith('-')) {
      targets.push({ text, word });
    }
  }

  return targets;
}
