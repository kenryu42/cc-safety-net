/**
 * Tests for the explain command paranoid mode.
 */
import { describe, expect, test } from 'bun:test';
import { explainCommand as explainCommandBase } from '@/bin/explain/index';
import type { ExplainOptions } from '@/types';
import { withEnv } from '../../helpers.ts';

function explainCommand(command: string, options?: ExplainOptions) {
  return explainCommandBase(command, { config: { version: 1, rules: [] }, ...options });
}

describe('explainCommand paranoid mode', () => {
  test('interpreter blocked in paranoid mode', () => {
    withEnv({ SAFETY_NET_PARANOID_INTERPRETERS: '1' }, () => {
      const result = explainCommand('python -c "print(1)"');
      expect(result.result).toBe('blocked');
      expect(result.reason).toContain('paranoid');
      const allSteps = result.trace.segments.flatMap((s) => s.steps);
      const interpStep = allSteps.find((s) => s.type === 'interpreter');
      expect(interpStep).toBeDefined();
      if (interpStep && interpStep.type === 'interpreter') {
        expect(interpStep.paranoidBlocked).toBe(true);
      }
    });
  });

  test('SAFETY_NET_PARANOID enables paranoid interpreters', () => {
    withEnv({ SAFETY_NET_PARANOID: '1' }, () => {
      const result = explainCommand('node -e "console.log(1)"');
      expect(result.result).toBe('blocked');
      expect(result.reason).toContain('paranoid');
    });
  });

  test('CC_SAFETY_NET_PARANOID enables paranoid interpreters', () => {
    withEnv({ CC_SAFETY_NET_PARANOID: '1' }, () => {
      const result = explainCommand('node -e "console.log(1)"');
      expect(result.result).toBe('blocked');
      expect(result.reason).toContain('paranoid');
    });
  });
});
