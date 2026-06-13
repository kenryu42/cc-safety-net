import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

describe('runtime dependencies', () => {
  test('uses patched shell-quote release', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8')) as {
      dependencies?: Record<string, string>;
    };
    const lockfile = readFileSync('bun.lock', 'utf-8');

    expect(packageJson.dependencies?.['shell-quote']).toBe('^1.8.4');
    expect(lockfile).toContain('"shell-quote": "^1.8.4"');
    expect(lockfile).toContain('"shell-quote": ["shell-quote@1.8.4"');
    expect(lockfile).not.toContain('shell-quote@1.8.3');
  });
});
