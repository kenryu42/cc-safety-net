/**
 * Tests for the doctor command environment functions.
 */

import { describe, expect, test } from 'bun:test';
import { getEnvironmentInfo } from '@/bin/doctor/environment';

describe('getEnvironmentInfo', () => {
  test('returns all expected environment variables', () => {
    const envInfo = getEnvironmentInfo();

    const names = envInfo.map((v) => v.name);
    expect(names).toContain('CC_SAFETY_NET_STRICT');
    expect(names).toContain('CC_SAFETY_NET_PARANOID');
    expect(names).toContain('CC_SAFETY_NET_PARANOID_RM');
    expect(names).toContain('CC_SAFETY_NET_PARANOID_INTERPRETERS');
    expect(names).toContain('CC_SAFETY_NET_WORKTREE');
    expect(names).toContain('CC_SAFETY_NET_DEBUG');
    expect(names).toContain('CC_SAFETY_NET_HOME');
  });

  test('each env var has required fields', () => {
    const envInfo = getEnvironmentInfo();

    for (const v of envInfo) {
      expect(typeof v.name).toBe('string');
      expect(typeof v.description).toBe('string');
      expect(typeof v.defaultBehavior).toBe('string');
      expect(typeof v.isSet).toBe('boolean');
    }
  });

  test('reports legacy fallback status', () => {
    process.env.SAFETY_NET_STRICT = '1';
    try {
      const strict = getEnvironmentInfo().find((v) => v.name === 'CC_SAFETY_NET_STRICT');
      expect(strict?.isSet).toBe(true);
      expect(strict?.legacyName).toBe('SAFETY_NET_STRICT');
      expect(strict?.legacyIsSet).toBe(true);
    } finally {
      delete process.env.SAFETY_NET_STRICT;
    }
  });
});
