import { describe, expect, test } from 'bun:test';
import {
  doctorIntegrationOrder,
  getIntegrationDisplayName,
  installIntegrationMetadata,
  runtimeHookIntegrationMetadata,
} from '@/integrations/catalog';

describe('integration metadata', () => {
  test('includes display names for every doctor platform', () => {
    expect(doctorIntegrationOrder.map((id) => getIntegrationDisplayName(id))).toEqual([
      'Claude Code',
      'Amp Code',
      'Antigravity CLI',
      'Codex',
      'Cursor',
      'Gemini CLI',
      'GitHub Copilot CLI',
      'Grok Build',
      'Hermes Agent',
      'Kimi Code',
      'OpenClaw',
      'OpenCode',
      'Pi',
    ]);
  });

  test('keeps doctor coding CLI order alphabetical after Claude Code', () => {
    expect(doctorIntegrationOrder).toEqual([
      'claude-code',
      'amp',
      'antigravity-cli',
      'codex',
      'cursor',
      'gemini-cli',
      'copilot-cli',
      'grok-build',
      'hermes-agent',
      'kimi-code',
      'openclaw',
      'opencode',
      'pi',
    ]);
  });

  test('runtime hook metadata separates canonical and legacy flags', () => {
    expect(runtimeHookIntegrationMetadata.map((integration) => integration.id)).toEqual([
      'antigravity-cli',
      'claude-code',
      'codex',
      'cursor',
      'gemini-cli',
      'copilot-cli',
      'grok-build',
      'hermes-agent',
      'kimi-code',
    ]);
    expect(runtimeHookIntegrationMetadata.map((integration) => integration.flags)).toEqual([
      ['-ac', '--agy-cli'],
      ['-cc', '--coding-cli'],
      ['-cx', '--codex'],
      ['-cu', '--cursor'],
      ['-gc', '--gemini-cli'],
      ['-cp', '--copilot-cli'],
      ['-gb', '--grok-build'],
      ['-ha', '--hermes-agent'],
      ['-kc', '--kimi-code'],
    ]);
    expect(runtimeHookIntegrationMetadata.map((integration) => integration.legacyFlags)).toEqual([
      [],
      ['--claude-code'],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ]);
    expect(
      runtimeHookIntegrationMetadata.map((integration) => integration.legacyTopLevelFlags),
    ).toEqual([
      [],
      ['-cc', '--claude-code'],
      [],
      [],
      ['-gc', '--gemini-cli'],
      ['-cp', '--copilot-cli'],
      [],
      [],
      [],
    ]);
  });

  test('runtime hook metadata can present a name separate from the integration target', () => {
    expect(runtimeHookIntegrationMetadata.map((integration) => integration.displayName)).toEqual([
      'Antigravity CLI',
      'Coding CLI',
      'Codex',
      'Cursor',
      'Gemini CLI',
      'GitHub Copilot CLI',
      'Grok Build',
      'Hermes Agent',
      'Kimi Code',
    ]);
    expect(getIntegrationDisplayName('claude-code')).toBe('Claude Code');
  });

  test('keeps install order and labels separate from runtime and doctor presentation', () => {
    expect(installIntegrationMetadata.map((integration) => integration.id)).toEqual([
      'amp',
      'antigravity-cli',
      'claude-code',
      'codex',
      'cursor',
      'gemini-cli',
      'copilot-cli',
      'grok-build',
      'hermes-agent',
      'kimi-code',
      'openclaw',
      'opencode',
      'pi',
    ]);
    expect(
      installIntegrationMetadata.find((integration) => integration.id === 'copilot-cli'),
    ).toEqual({
      id: 'copilot-cli',
      flag: '--copilot-cli',
      artifactKind: 'plugin',
      probeCommand: ['copilot', '--binary-version'],
    });
    expect(getIntegrationDisplayName('copilot-cli')).toBe('GitHub Copilot CLI');
  });

  test('describes the Hermes Agent and OpenClaw install targets', () => {
    expect(
      installIntegrationMetadata.find((integration) => integration.id === 'hermes-agent'),
    ).toEqual({
      id: 'hermes-agent',
      flag: '--hermes-agent',
      artifactKind: 'plugin',
      probeCommand: ['hermes', '--version'],
    });
    expect(installIntegrationMetadata.find((integration) => integration.id === 'openclaw')).toEqual(
      {
        id: 'openclaw',
        flag: '--openclaw',
        artifactKind: 'plugin',
        probeCommand: ['openclaw', '--version'],
      },
    );
  });
});
