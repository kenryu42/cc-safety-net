import { describe, expect, test } from 'bun:test';
import { parseBump } from '../../scripts/publish-options';

describe('publish options', () => {
  test('allows known bump values', () => {
    expect(parseBump(undefined)).toBeUndefined();
    expect(parseBump('major')).toBe('major');
    expect(parseBump('minor')).toBe('minor');
    expect(parseBump('patch')).toBe('patch');
  });

  test('rejects invalid bump values before publish flow', () => {
    expect(() => parseBump('invalid')).toThrow('BUMP must be one of: major, minor, patch');
  });
});
