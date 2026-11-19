import { describe, expect, test } from 'bun:test';
import {
  blockMessagePreview,
  messagesWithinLimit,
  withRuleMessage,
} from '@/gui/frontend/rule-messages';

describe('editing a rule message', () => {
  test('stores the trimmed reason and only an intent the user picked', () => {
    expect(withRuleMessage(undefined, 'git.push-force', '  Use the helper.\n', '')).toEqual({
      'git.push-force': { reason: 'Use the helper.' },
    });
    expect(withRuleMessage(undefined, 'git.push-force', 'Use the helper.', 'scope_down')).toEqual({
      'git.push-force': { reason: 'Use the helper.', intent: 'scope_down' },
    });
    expect(withRuleMessage(undefined, 'git.push-force', 'Use the helper.', 'bogus')).toEqual({
      'git.push-force': { reason: 'Use the helper.' },
    });
  });

  test('rewording a message keeps its place among the others', () => {
    const messages = {
      'git.push-force': { reason: 'first' },
      'git.reset-hard': { reason: 'second' },
    };

    expect(JSON.stringify(withRuleMessage(messages, 'git.push-force', 'first, reworded', ''))).toBe(
      JSON.stringify({
        'git.push-force': { reason: 'first, reworded' },
        'git.reset-hard': { reason: 'second' },
      }),
    );
  });

  test('an emptied reason removes the message, and the last removal leaves no map', () => {
    const messages = {
      'git.push-force': { reason: 'first' },
      'git.reset-hard': { reason: 'second' },
    };

    expect(withRuleMessage(messages, 'git.push-force', '   ', 'hard_stop')).toEqual({
      'git.reset-hard': { reason: 'second' },
    });
    expect(
      withRuleMessage({ 'git.push-force': { reason: 'first' } }, 'git.push-force', '', ''),
    ).toBeUndefined();
  });

  test('a message over the length limit is left out of what the preview checks', () => {
    expect(
      messagesWithinLimit({
        'git.push-force': { reason: 'x'.repeat(257) },
        'git.reset-hard': { reason: 'x'.repeat(256) },
      }),
    ).toEqual({ 'git.reset-hard': { reason: 'x'.repeat(256) } });
    expect(messagesWithinLimit({ 'git.push-force': { reason: 'x'.repeat(257) } })).toBeUndefined();
  });
});

describe('the block message preview', () => {
  const rule = {
    ruleId: 'git.push-force',
    command: 'git push --force origin main',
    builtIn: { reason: 'git push --force destroys remote history.', intent: 'manual_only' },
  } as const;

  test('shows the built-in message with nothing marked as custom', () => {
    const parts = blockMessagePreview(rule);

    expect(parts.map((part) => part.text).join('')).toBe(
      [
        'BLOCKED by CC Safety Net',
        'Reason: git push --force destroys remote history.',
        'Rule: git.push-force',
        'Command: git push --force origin main',
        'If this operation is truly needed, ask the user for explicit permission and have them run the command manually.',
      ].join('\n\n'),
    );
    expect(parts.filter((part) => part.custom)).toEqual([]);
  });

  test('marks the custom reason and the closing line a chosen intent sets', () => {
    const parts = blockMessagePreview({
      ...rule,
      message: { reason: 'Use scripts/safe-push.', intent: 'use_alternative' },
    });

    expect(parts.map((part) => part.text).join('')).toBe(
      [
        'BLOCKED by CC Safety Net',
        'Reason: Use scripts/safe-push.',
        'Rule: git.push-force',
        'Command: git push --force origin main',
        'Do not retry the blocked form. Continue the task using the safer alternative described above.',
      ].join('\n\n'),
    );
    expect(parts.filter((part) => part.custom).map((part) => part.text)).toEqual([
      'Use scripts/safe-push.',
      'Do not retry the blocked form. Continue the task using the safer alternative described above.',
    ]);
  });

  test('keeps the built-in closing line unmarked when only the reason is custom', () => {
    const parts = blockMessagePreview({
      ruleId: 'secret.pattern.env-variant',
      builtIn: { reason: 'Access to a sensitive path is not allowed.', intent: 'hard_stop' },
      message: { reason: 'Run link-env.\n\nNever read env files.' },
    });

    expect(parts.filter((part) => part.custom).map((part) => part.text)).toEqual([
      'Run link-env.\n\nNever read env files.',
    ]);
    expect(parts.at(-1)?.text).toStartWith('Do not retry this operation');
    expect(parts.map((part) => part.text).join('')).not.toContain('Command:');
  });
});
