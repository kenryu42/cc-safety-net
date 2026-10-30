import { destructiveCommandMatch } from '@/core/rules/destructive';
import type { DestructiveCommandRuleMatch } from '@/core/rules/types';
import type { CommandWord } from '@/core/shell/model';
import { REASON_GIT_METADATA_PROTECTION } from '@/gate/guards/git-metadata-protection';
import { analysisWordText } from './command-words';
import { powerShellTargetForPolicy } from './powershell/remove-item';
import { dynamicShellSourceMatch } from './reasons';
import {
  createRecursiveDeleteTargetContext,
  firstRecursiveDeleteMatch,
  type RecursiveDeleteRuleTable,
  type RecursiveDeleteTargetContext,
} from './recursive-delete-targets';
import type { AnalyzeRmOptions } from './rm';

const REASON_CMD_DELETE_OUTSIDE_CWD =
  'cmd rmdir /s or del /s outside cwd is blocked. Retry deleting only explicit paths inside the current directory; escalate for anything outside it.';
const REASON_CMD_DELETE_POLICY =
  'cmd rmdir /s or del /s for non-temporary paths is blocked by the active safety policy. Retry deleting only explicit paths inside the current directory; escalate for anything outside it.';
const REASON_CMD_DELETE_DYNAMIC_TARGET =
  'cmd rmdir /s or del /s target contains wildcards or variables that cannot be verified safely. Use literal paths within cwd.';
const REASON_CMD_DELETE_ROOT_HOME =
  'cmd rmdir /s or del /s targeting root or home directory is extremely dangerous and always blocked.';
const REASON_CMD_DELETE_ESCAPED_QUOTE =
  'cmd rmdir /s or del /s with \\" quoting or a \\\\?\\ path is blocked: cmd does not treat \\" as an escape, so the target can split down to the root of the drive. Pass each path as its own quoted argument, or use Remove-Item -LiteralPath.';
const REASON_CMD_DELETE_HOME_CWD =
  'cmd rmdir /s or del /s in home directory is dangerous. Change to a project directory first.';

const CMD_DELETE_RULES: RecursiveDeleteRuleTable = {
  root_or_home_target: {
    id: 'cmd.recursive-delete-root-or-home',
    reason: REASON_CMD_DELETE_ROOT_HOME,
  },
  git_metadata_target: {
    id: 'cmd.recursive-delete-git-metadata',
    reason: REASON_GIT_METADATA_PROTECTION,
  },
  dynamic_target: {
    id: 'cmd.recursive-delete-dynamic-target',
    reason: REASON_CMD_DELETE_DYNAMIC_TARGET,
  },
  home_cwd_target: { id: 'cmd.recursive-delete-home-cwd', reason: REASON_CMD_DELETE_HOME_CWD },
  cwd_self_target: { id: 'cmd.recursive-delete-cwd-self', reason: REASON_CMD_DELETE_OUTSIDE_CWD },
  within_anchored_cwd: { id: 'cmd.recursive-delete-paranoid', reason: REASON_CMD_DELETE_POLICY },
  outside_anchored_cwd: {
    id: 'cmd.recursive-delete-outside-cwd',
    reason: REASON_CMD_DELETE_OUTSIDE_CWD,
  },
};

const CMD_BODY_SWITCH = /^\/\/?[ck]$/i;
const CMD_CONNECTORS = /[&|]+/;
const CMD_TOKEN = /(?:"[^"]*"|[^\s"])+/g;
const CMD_ESCAPE_OR_EXPANSION = /[\^%!]/;
const ESCAPED_QUOTE_INSIDE_WORD = /\\"./s;
const CMD_MATCH_ALL_FINAL_SEGMENT = /(^|\/)[*.]*\*[*.]*$/;
const WINDOWS_NAMESPACE_PREFIX = /^"?[\\/]+[?.][\\/]/;
const CMD_DELETE_COMMANDS = new Set(['rmdir', 'rd', 'del', 'erase']);
const CMD_DELETE_WORD = /(?<![\w-])(?:rmdir|rd|del|erase)(?!\w)/i;
const CMD_RECURSIVE_SWITCH = /\/s(?!\w)/i;
const CMD_DIRECTORY_WORD = /(?<![\w-])(?:cd|chdir|pushd|popd)(?!\w)/i;

interface AnalyzeCmdOptions extends AnalyzeRmOptions {
  powerShellRawWords: readonly string[];
  gitBashEscapesBodyQuotes: boolean;
  analyzeNested: (command: string) => DestructiveCommandRuleMatch | null;
}

export function analyzeCmdMatch(
  words: readonly CommandWord[],
  options: AnalyzeCmdOptions,
): DestructiveCommandRuleMatch | null {
  const texts = words.map(analysisWordText);
  const bodyIndex = texts.findIndex((text) => CMD_BODY_SWITCH.test(text));
  if (bodyIndex === -1) return null;
  const joined = texts.slice(bodyIndex + 1).join(' ');
  const body = /^".*"$/s.test(joined) ? joined.slice(1, -1) : joined;
  const commands = body.split(CMD_CONNECTORS).map((piece) => {
    const tokens = piece.match(CMD_TOKEN) ?? [];
    const deleteIndex = tokens.findIndex((token) =>
      CMD_DELETE_COMMANDS.has(token.replace(/^@/, '').toLowerCase()),
    );
    const deleteTokens = deleteIndex === -1 ? [] : tokens.slice(deleteIndex);
    return {
      piece,
      tokens,
      deleteTokens,
      recursiveDelete: deleteTokens
        .slice(1)
        .some((token) => token.startsWith('/') && token.toLowerCase().split('/').includes('s')),
    };
  });
  const recursiveDeletes = commands.filter((command) => command.recursiveDelete);
  const mentionsRecursiveDelete =
    recursiveDeletes.length > 0 || (CMD_DELETE_WORD.test(body) && CMD_RECURSIVE_SWITCH.test(body));
  if (
    mentionsRecursiveDelete &&
    (body.includes('\\"') ||
      (options.gitBashEscapesBodyQuotes && body.includes('"')) ||
      options.powerShellRawWords.some((raw) => ESCAPED_QUOTE_INSIDE_WORD.test(raw)) ||
      recursiveDeletes.some((command) =>
        command.tokens.some((token) => WINDOWS_NAMESPACE_PREFIX.test(token)),
      ))
  ) {
    return destructiveCommandMatch(
      'cmd.recursive-delete-escaped-quote',
      REASON_CMD_DELETE_ESCAPED_QUOTE,
    );
  }
  const ctx = createRecursiveDeleteTargetContext({
    ...options,
    allowPaths: options.policy?.destructiveCommandAllowPaths,
  });
  const pieceMatch = commands.reduce<DestructiveCommandRuleMatch | null>(
    (match, command) =>
      match ??
      (command.recursiveDelete
        ? recursiveDeleteTargetMatch(command.deleteTokens, ctx, options.policy)
        : options.analyzeNested(command.piece)),
    null,
  );
  const unverifiableRecursiveDelete =
    mentionsRecursiveDelete &&
    (recursiveDeletes.length === 0 ||
      CMD_ESCAPE_OR_EXPANSION.test(body) ||
      CMD_DIRECTORY_WORD.test(body) ||
      (body.includes('"') && CMD_CONNECTORS.test(body)));
  return pieceMatch ?? (unverifiableRecursiveDelete ? dynamicShellSourceMatch() : null);
}

function recursiveDeleteTargetMatch(
  tokens: readonly string[],
  ctx: RecursiveDeleteTargetContext,
  policy: AnalyzeCmdOptions['policy'],
): DestructiveCommandRuleMatch | null {
  return tokens
    .slice(1)
    .filter((token) => !token.startsWith('/'))
    .reduce<DestructiveCommandRuleMatch | null>(
      (match, token) =>
        match ??
        firstRecursiveDeleteMatch(
          powerShellTargetForPolicy(token.replaceAll('"', '')).replace(
            CMD_MATCH_ALL_FINAL_SEGMENT,
            '$1*',
          ),
          ctx,
          policy,
          CMD_DELETE_RULES,
        ),
      null,
    );
}
