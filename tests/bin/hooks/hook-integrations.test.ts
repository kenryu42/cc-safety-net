import { describe, expect, test } from 'bun:test';
import {
  findHookIntegrationByFlag,
  findLegacyTopLevelHookIntegration,
  hookIntegrations,
} from '@/bin/hook/integrations';

describe('hook integration registry', () => {
  test('finds hook integrations by nested hook flags', () => {
    expect(findHookIntegrationByFlag(['hook', '--claude-code'])?.id).toBe('claude-code');
    expect(findHookIntegrationByFlag(['hook', '-cp'])?.id).toBe('copilot-cli');
    expect(findHookIntegrationByFlag(['hook', '-gc'])?.id).toBe('gemini-cli');
    expect(findHookIntegrationByFlag(['hook', '--kimi-code'])?.id).toBe('kimi-code');
    expect(findHookIntegrationByFlag(['hook', '--unknown'])).toBeUndefined();
  });

  test('limits legacy top-level aliases to existing legacy integrations', () => {
    expect(findLegacyTopLevelHookIntegration('--claude-code')?.id).toBe('claude-code');
    expect(findLegacyTopLevelHookIntegration('-cp')?.id).toBe('copilot-cli');
    expect(findLegacyTopLevelHookIntegration('-gc')?.id).toBe('gemini-cli');
    expect(findLegacyTopLevelHookIntegration('--kimi-code')).toBeUndefined();
    expect(findLegacyTopLevelHookIntegration(undefined)).toBeUndefined();
  });

  test('keeps Kimi Code in hook help metadata without top-level compatibility', () => {
    const kimi = hookIntegrations.find((integration) => integration.id === 'kimi-code');

    expect(kimi?.displayName).toBe('Kimi Code');
    expect(kimi?.flags).toEqual(['-kc', '--kimi-code']);
    expect(kimi?.legacyTopLevel).toBe(false);
  });

  test('has a runner for every hook integration', () => {
    expect(hookIntegrations.every((integration) => typeof integration.run === 'function')).toBe(
      true,
    );
  });
});
