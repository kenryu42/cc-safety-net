import { destructiveCommandMatch } from '@/core/rules/destructive';
import type { DestructiveCommandRuleMatch } from '@/core/rules/types';
import type { CommandWord } from '@/core/shell/model';
import { analysisWordText, isLiteralExecutionSourceWord } from './command-words';
import { dynamicShellSourceMatch } from './reasons';

const REASON_NESTED_RECURSIVE_DELETE_UNREAD =
  'Recursive delete handed to powershell or pwsh in a form CC Safety Net does not read is blocked: pass the script as a single -Command with literal paths, after only -NoProfile, -NonInteractive, -NoLogo, or -ExecutionPolicy.';

const READ_SWITCH = /^-(?:noprofile|nop|noninteractive|noni|nologo)$/i;
const READ_EXECUTION_POLICY = /^-(?:executionpolicy|ep)$/i;
const READ_COMMAND = /^-(?:command|c)$/i;
const PARAMETER_NAME = /^(?:--?|[/\u2013\u2014\u2015])(\w+)$/;
const ENCODED_COMMAND = 'encodedcommand';
const DELETE_VERB = /(?<![\w-])(?:remove-item|ri|rm|rmdir|rd|del|erase)(?![\w-])/i;
const RECURSIVE_FLAG =
  /(?<![\w-])(?:[-\u2013\u2014\u2015]{1,2}r(?:e(?:c(?:u(?:r(?:s(?:e|ive?)?)?)?)?)?)?(?!\w)|-[dfipvwx]*r[dfipvwx]*(?!\w))|\/s(?!\w)/i;
const OUTER_EXPANSION = /[$`]/;
const STOP_PARSING = '--%';

export function analyzePowerShellWrapperMatch(
  words: readonly CommandWord[],
  analyzeNested: (script: string) => DestructiveCommandRuleMatch | null,
): DestructiveCommandRuleMatch | null {
  const texts = words.map(analysisWordText);
  const script = texts.every(
    (text, index) =>
      index === 0 || (text !== STOP_PARSING && isLiteralScriptWord(words[index], text)),
  )
    ? readPowerShellScript(texts)
    : undefined;
  if (script !== undefined) return analyzeNested(script);
  if (texts.some(isEncodedCommandParameter)) return dynamicShellSourceMatch();
  const text = texts.join(' ');
  return DELETE_VERB.test(text) && RECURSIVE_FLAG.test(text)
    ? destructiveCommandMatch(
        'powershell.nested-recursive-delete-unread',
        REASON_NESTED_RECURSIVE_DELETE_UNREAD,
      )
    : null;
}

export function readPowerShellScript(texts: readonly string[]): string | undefined {
  const commandIndex = readCommandIndex(texts, 1);
  const script = commandIndex === undefined ? [] : texts.slice(commandIndex + 1);
  return script.length > 0 ? script.join(' ') : undefined;
}

function readCommandIndex(texts: readonly string[], index: number): number | undefined {
  const text = texts[index] ?? '';
  if (READ_COMMAND.test(text)) return index;
  if (READ_SWITCH.test(text)) return readCommandIndex(texts, index + 1);
  return READ_EXECUTION_POLICY.test(text) ? readCommandIndex(texts, index + 2) : undefined;
}

function isLiteralScriptWord(word: CommandWord | undefined, text: string): boolean {
  return word?.provenance === 'unknown'
    ? !OUTER_EXPANSION.test(text)
    : isLiteralExecutionSourceWord(word, text);
}

function isEncodedCommandParameter(text: string): boolean {
  const name = PARAMETER_NAME.exec(text)?.[1]?.toLowerCase();
  return name !== undefined && (name === 'ec' || ENCODED_COMMAND.startsWith(name));
}
