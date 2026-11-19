import { BLOCK_INTENTS, type BlockIntent } from '@/core/decision';
import { formatBlockedMessage } from '@/core/denial';
import { MAX_REASON_LENGTH } from '@/core/rules/constants';
import type { Messages } from './locales/en';
import type { RuleMessage, RuleMessages } from './project-draft';

export const intentLabels = (t: Messages): Record<BlockIntent, string> => ({
  hard_stop: t.intentHardStop,
  use_alternative: t.intentUseAlternative,
  scope_down: t.intentScopeDown,
  manual_only: t.intentManualOnly,
  stop_and_explain: t.intentStopAndExplain,
});

export const withRuleMessage = (
  messages: RuleMessages | undefined,
  ruleId: string,
  reason: string,
  intent: string,
) => {
  const next = { ...messages };
  const trimmed = reason.trim();
  const chosenIntent = BLOCK_INTENTS.find((candidate) => candidate === intent);
  if (trimmed)
    next[ruleId] = { reason: trimmed, ...(chosenIntent ? { intent: chosenIntent } : {}) };
  if (!trimmed) delete next[ruleId];
  return Object.keys(next).length > 0 ? next : undefined;
};

export const messagesWithinLimit = (messages: RuleMessages | undefined) => {
  const kept = Object.entries(messages ?? {}).filter(
    ([, message]) => message.reason.length <= MAX_REASON_LENGTH,
  );
  return kept.length > 0 ? Object.fromEntries(kept) : undefined;
};

export const blockMessagePreview = (options: {
  ruleId: string;
  command?: string;
  builtIn: RuleMessage & { intent: BlockIntent };
  message?: RuleMessage;
}) => {
  const reason = options.message?.reason ?? options.builtIn.reason;
  const text = formatBlockedMessage({
    reason,
    ruleId: options.ruleId,
    intent: options.message?.intent ?? options.builtIn.intent,
    command: options.command,
  });
  const reasonStart = text.indexOf(`Reason: ${reason}`) + 'Reason: '.length;
  const footerStart = text.lastIndexOf('\n\n') + 2;
  return [
    { text: text.slice(0, reasonStart), custom: false },
    { text: reason, custom: options.message !== undefined },
    { text: text.slice(reasonStart + reason.length, footerStart), custom: false },
    { text: text.slice(footerStart), custom: options.message?.intent !== undefined },
  ];
};
