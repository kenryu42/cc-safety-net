import { describe, expect, test } from 'bun:test';
import { managedHookCommands } from '@/hosts/managed-command';

describe('the managed hook command', () => {
  test('spells out what every npx-launched host runs', () => {
    expect(managedHookCommands).toEqual({
      'antigravity-cli': 'npx -y cc-safety-net hook --agy-cli',
      'claude-code': 'npx -y cc-safety-net hook --coding-cli',
      codex: 'npx -y cc-safety-net hook --codex',
      'copilot-cli': 'npx -y cc-safety-net hook --copilot-cli',
      cursor: 'npx -y cc-safety-net hook --cursor',
      droid: 'npx -y cc-safety-net hook --droid',
      'gemini-cli': 'npx -y cc-safety-net hook --gemini-cli',
      'grok-build': 'npx -y cc-safety-net hook --grok-build',
      'hermes-agent': 'npx -y cc-safety-net hook --hermes-agent',
      'kimi-code': 'npx -y cc-safety-net hook --kimi-code',
    });
  });
});
