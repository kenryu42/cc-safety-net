import { describe, expect, test } from 'bun:test';
import { randomHex16 } from '@/core/random-hex';

describe('randomHex16', () => {
  test('is sixteen lowercase hex digits, fresh on every call', () => {
    const ids = Array.from({ length: 64 }, () => randomHex16());
    for (const id of ids) expect(id).toMatch(/^[0-9a-f]{16}$/);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
