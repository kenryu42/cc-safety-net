import { describe, expect, test } from 'bun:test';
import {
  ENV_FLAGS,
  envFlagIsSet,
  envTruthy,
  getCCSafetyNetEnvModes,
  getEnvFlagValue,
} from '@/core/env';

describe('envTruthy', () => {
  test("returns true for '1'", () => {
    process.env.TEST_ENV_TRUTHY = '1';
    expect(envTruthy('TEST_ENV_TRUTHY')).toBe(true);
    delete process.env.TEST_ENV_TRUTHY;
  });

  test("returns true for 'true'", () => {
    process.env.TEST_ENV_TRUTHY = 'true';
    expect(envTruthy('TEST_ENV_TRUTHY')).toBe(true);
    delete process.env.TEST_ENV_TRUTHY;
  });

  test("returns true for 'TRUE'", () => {
    process.env.TEST_ENV_TRUTHY = 'TRUE';
    expect(envTruthy('TEST_ENV_TRUTHY')).toBe(true);
    delete process.env.TEST_ENV_TRUTHY;
  });

  test("returns true for 'True'", () => {
    process.env.TEST_ENV_TRUTHY = 'True';
    expect(envTruthy('TEST_ENV_TRUTHY')).toBe(true);
    delete process.env.TEST_ENV_TRUTHY;
  });

  test("returns false for 'false'", () => {
    process.env.TEST_ENV_TRUTHY = 'false';
    expect(envTruthy('TEST_ENV_TRUTHY')).toBe(false);
    delete process.env.TEST_ENV_TRUTHY;
  });

  test("returns false for 'FALSE'", () => {
    process.env.TEST_ENV_TRUTHY = 'FALSE';
    expect(envTruthy('TEST_ENV_TRUTHY')).toBe(false);
    delete process.env.TEST_ENV_TRUTHY;
  });

  test("returns false for '0'", () => {
    process.env.TEST_ENV_TRUTHY = '0';
    expect(envTruthy('TEST_ENV_TRUTHY')).toBe(false);
    delete process.env.TEST_ENV_TRUTHY;
  });

  test('returns false for empty string', () => {
    process.env.TEST_ENV_TRUTHY = '';
    expect(envTruthy('TEST_ENV_TRUTHY')).toBe(false);
    delete process.env.TEST_ENV_TRUTHY;
  });

  test('returns false for undefined', () => {
    delete process.env.TEST_ENV_TRUTHY;
    expect(envTruthy('TEST_ENV_TRUTHY')).toBe(false);
  });

  test('returns false for random string', () => {
    process.env.TEST_ENV_TRUTHY = 'yes';
    expect(envTruthy('TEST_ENV_TRUTHY')).toBe(false);
    delete process.env.TEST_ENV_TRUTHY;
  });

  test('uses new env flag name', () => {
    process.env.CC_SAFETY_NET_STRICT = '1';
    expect(envTruthy(ENV_FLAGS.strict)).toBe(true);
    delete process.env.CC_SAFETY_NET_STRICT;
  });

  test('falls back to legacy env flag name', () => {
    process.env.SAFETY_NET_STRICT = '1';
    expect(envTruthy(ENV_FLAGS.strict)).toBe(true);
    delete process.env.SAFETY_NET_STRICT;
  });

  test('new env flag wins over legacy env flag', () => {
    process.env.CC_SAFETY_NET_STRICT = '0';
    process.env.SAFETY_NET_STRICT = '1';
    expect(envTruthy(ENV_FLAGS.strict)).toBe(false);
    delete process.env.CC_SAFETY_NET_STRICT;
    delete process.env.SAFETY_NET_STRICT;
  });

  test('debug flag has no legacy fallback', () => {
    process.env.SAFETY_NET_DEBUG = '1';
    expect(envTruthy(ENV_FLAGS.debug)).toBe(false);
    delete process.env.SAFETY_NET_DEBUG;
  });
});

describe('getEnvFlagValue', () => {
  test('returns the new env flag value before legacy fallback', () => {
    process.env.CC_SAFETY_NET_PARANOID = '0';
    process.env.SAFETY_NET_PARANOID = '1';

    expect(getEnvFlagValue(ENV_FLAGS.paranoid)).toBe('0');

    delete process.env.CC_SAFETY_NET_PARANOID;
    delete process.env.SAFETY_NET_PARANOID;
  });

  test('returns legacy env flag value when new flag is unset', () => {
    process.env.SAFETY_NET_WORKTREE = '1';

    expect(getEnvFlagValue(ENV_FLAGS.worktree)).toBe('1');

    delete process.env.SAFETY_NET_WORKTREE;
  });

  test('returns undefined when neither flag is set', () => {
    delete process.env.CC_SAFETY_NET_DEBUG;

    expect(getEnvFlagValue(ENV_FLAGS.debug)).toBeUndefined();
  });
});

describe('envFlagIsSet', () => {
  test('detects new and legacy flag names even when the value is falsey', () => {
    process.env.CC_SAFETY_NET_STRICT = '';
    expect(envFlagIsSet(ENV_FLAGS.strict)).toBe(true);
    delete process.env.CC_SAFETY_NET_STRICT;

    process.env.SAFETY_NET_STRICT = '0';
    expect(envFlagIsSet(ENV_FLAGS.strict)).toBe(true);
    delete process.env.SAFETY_NET_STRICT;
  });

  test('returns false when no supported flag name is present', () => {
    delete process.env.CC_SAFETY_NET_DEBUG;
    delete process.env.SAFETY_NET_DEBUG;

    expect(envFlagIsSet(ENV_FLAGS.debug)).toBe(false);
  });
});

describe('getCCSafetyNetEnvModes', () => {
  test('expands paranoid all mode to rm and interpreter modes', () => {
    process.env.CC_SAFETY_NET_PARANOID = '1';

    expect(getCCSafetyNetEnvModes()).toEqual({
      strict: false,
      paranoidAll: true,
      paranoidRm: true,
      paranoidInterpreters: true,
      worktreeMode: false,
    });

    delete process.env.CC_SAFETY_NET_PARANOID;
  });

  test('reads individual safety net modes', () => {
    process.env.CC_SAFETY_NET_STRICT = '1';
    process.env.CC_SAFETY_NET_PARANOID_RM = '1';
    process.env.CC_SAFETY_NET_PARANOID_INTERPRETERS = '1';
    process.env.CC_SAFETY_NET_WORKTREE = '1';

    expect(getCCSafetyNetEnvModes()).toEqual({
      strict: true,
      paranoidAll: false,
      paranoidRm: true,
      paranoidInterpreters: true,
      worktreeMode: true,
    });

    delete process.env.CC_SAFETY_NET_STRICT;
    delete process.env.CC_SAFETY_NET_PARANOID_RM;
    delete process.env.CC_SAFETY_NET_PARANOID_INTERPRETERS;
    delete process.env.CC_SAFETY_NET_WORKTREE;
  });
});
