import { analysisWordText, textCommandWords } from '@/analyzer/command-words';
import type { DestructiveCommandRuleMatch } from '@/ir/analysis';
import type { CommandWord } from '@/ir/command';
import { getBasename } from '@/parser/shell';
import { destructiveCommandMatch } from '@/rules/destructive-command-rules';

const REASON_COMMENT_WRITE =
  'acli comment create or update posts a Jira or Confluence comment. Ask the user to run it manually if the comment is intended.';
const REASON_EDIT =
  'acli edit or update changes Jira or Confluence content. Ask the user to run it manually if the edit is intended.';
const REASON_CREATE =
  'acli create posts a new Jira work item or Confluence page or blog. Ask the user to run it manually if creation is intended.';
const REASON_TRANSITION =
  'acli jira workitem transition changes work item status. Ask the user to run it manually if the transition is intended.';

const COMMENT_SAFE_VERBS = new Set(['list', 'delete', 'visibility']);
const CONFLUENCE_EDIT_RESOURCES = new Set(['page', 'space', 'blog']);
const CONFLUENCE_EDIT_VERBS = new Set(['update', 'edit']);
const CONFLUENCE_CREATE_RESOURCES = new Set(['page', 'blog']);

/** @internal */
export function analyzeAcli(tokens: readonly string[]): string | null {
  return analyzeAcliMatch(textCommandWords(tokens))?.reason ?? null;
}

export function analyzeAcliMatch(
  words: readonly CommandWord[],
): DestructiveCommandRuleMatch | null {
  const tokens = words.map(analysisWordText);
  const head = tokens[0] ? getBasename(tokens[0]).toLowerCase() : '';
  if (head !== 'acli') return null;

  const path = acliPositionalPath(tokens);
  if (isAcliHelp(tokens, path)) return null;
  if (isAcliCommentWrite(path)) {
    return destructiveCommandMatch('acli.comment-write', REASON_COMMENT_WRITE);
  }
  if (isAcliEdit(path)) {
    return destructiveCommandMatch('acli.edit', REASON_EDIT);
  }
  if (isAcliCreate(path)) {
    return destructiveCommandMatch('acli.create', REASON_CREATE);
  }
  if (isAcliTransition(path)) {
    return destructiveCommandMatch('acli.transition', REASON_TRANSITION);
  }
  return null;
}

function isAcliHelp(tokens: readonly string[], path: readonly string[]): boolean {
  if (path[0] === 'help') return true;
  return tokens.some(
    (token) => token === '-h' || token === '--help' || token.startsWith('--help='),
  );
}

function acliPositionalPath(tokens: readonly string[]): string[] {
  const end = tokens.indexOf('--', 1);
  const region = end === -1 ? tokens.slice(1) : tokens.slice(1, end);
  return region.filter((token) => !token.startsWith('-')).map((token) => token.toLowerCase());
}

function isAcliCommentWrite(path: readonly string[]): boolean {
  if (path[0] === 'jira' && path[1] === 'workitem' && path[2] === 'comment') {
    return isCommentWriteVerb(path[3]);
  }
  if (path[0] !== 'confluence') return false;
  const commentIndex = path.indexOf('comment');
  if (commentIndex < 1) return false;
  return isCommentWriteVerb(path[commentIndex + 1]);
}

function isCommentWriteVerb(verb: string | undefined): boolean {
  return verb === undefined || !COMMENT_SAFE_VERBS.has(verb);
}

function isAcliEdit(path: readonly string[]): boolean {
  if (path[0] === 'jira' && path[1] === 'workitem' && path[2] === 'edit') return true;
  if (path[0] !== 'confluence') return false;
  return CONFLUENCE_EDIT_RESOURCES.has(path[1] ?? '') && CONFLUENCE_EDIT_VERBS.has(path[2] ?? '');
}

function isAcliCreate(path: readonly string[]): boolean {
  if (
    path[0] === 'jira' &&
    path[1] === 'workitem' &&
    (path[2] === 'create' || path[2] === 'create-bulk')
  ) {
    return true;
  }
  if (path[0] !== 'confluence') return false;
  return CONFLUENCE_CREATE_RESOURCES.has(path[1] ?? '') && path[2] === 'create';
}

function isAcliTransition(path: readonly string[]): boolean {
  return path[0] === 'jira' && path[1] === 'workitem' && path[2] === 'transition';
}
