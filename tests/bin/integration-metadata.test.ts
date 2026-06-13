import { describe, expect, test } from 'bun:test';
import {
  doctorIntegrationOrder,
  getIntegrationDisplayName,
  runtimeHookIntegrationMetadata,
} from '@/bin/integration-metadata';

describe('integration metadata', () => {
  test('includes display names for every doctor platform', () => {
    expect(doctorIntegrationOrder.map((id) => getIntegrationDisplayName(id))).toEqual([
      'Claude Code',
      'Codex',
      'Copilot CLI',
      'Gemini CLI',
      'Kimi Code',
      'OpenCode',
      'Pi',
    ]);
  });

  test('keeps doctor coding CLI order alphabetical after Claude Code', () => {
    expect(doctorIntegrationOrder).toEqual([
      'claude-code',
      'codex',
      'copilot-cli',
      'gemini-cli',
      'kimi-code',
      'opencode',
      'pi',
    ]);
  });

  test('runtime hook metadata keeps flags and legacy top-level settings', () => {
    expect(runtimeHookIntegrationMetadata.map((integration) => integration.id)).toEqual([
      'claude-code',
      'copilot-cli',
      'gemini-cli',
      'kimi-code',
    ]);
    expect(runtimeHookIntegrationMetadata.map((integration) => integration.flags)).toEqual([
      ['-cc', '--claude-code'],
      ['-cp', '--copilot-cli'],
      ['-gc', '--gemini-cli'],
      ['-kc', '--kimi-code'],
    ]);
    expect(runtimeHookIntegrationMetadata.map((integration) => integration.legacyTopLevel)).toEqual(
      [true, true, true, false],
    );
  });

  test('runtime hook metadata uses display names from the shared integration metadata', () => {
    expect(
      runtimeHookIntegrationMetadata.map((integration) =>
        getIntegrationDisplayName(integration.id),
      ),
    ).toEqual(runtimeHookIntegrationMetadata.map((integration) => integration.displayName));
  });
});
