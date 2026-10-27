import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as Record<string, unknown>;

describe('published runtime contract', () => {
  test('publishes the supported ESM entries and rejects deep imports', () => {
    expect(pkg.exports).toEqual({
      '.': {
        types: './dist/index.d.ts',
        import: './dist/index.js',
      },
      './api': {
        types: './dist/api.d.ts',
        import: './dist/api.js',
      },
      './opencode/v2': {
        types: './dist/opencode-v2.d.ts',
        import: './dist/index.js',
      },
      './package.json': './package.json',
    });
    expect(pkg.main).toBe('dist/index.js');
    expect(pkg.types).toBe('dist/index.d.ts');
    expect(pkg.type).toBe('module');
  });

  test('publishes both command names from one entrypoint', () => {
    expect(pkg.bin).toEqual({
      'cc-safety-net': 'dist/bin/cc-safety-net.js',
      ccsn: 'dist/bin/cc-safety-net.js',
    });
  });

  test('pins the supported build and runtime dependency contract', () => {
    expect(pkg.packageManager).toMatch(/^bun@\d+\.\d+\.\d+$/);
    expect(pkg.engines).toEqual({ node: '>=18' });
    expect(pkg.dependencies).toBeUndefined();
    expect(pkg.devDependencies).toMatchObject({
      '@ampcode/plugin': '0.0.0-20260724002649-ga3413e7',
      '@opencode-ai/plugin': '^1.18.29',
      '@opencode/plugin': '2.0.6',
      effect: '4.0.0-rc.112',
    });
    expect(pkg.peerDependencies).toEqual({
      '@opencode-ai/plugin': '^1.18.29',
      '@opencode/plugin': '>=2.0.6 <2.2.0',
    });
    expect(pkg.peerDependenciesMeta).toEqual({
      '@opencode-ai/plugin': { optional: true },
      '@opencode/plugin': { optional: true },
    });
    expect((pkg.scripts as Record<string, string>)['audit:dependencies']).toBe(
      'bun audit --ignore=GHSA-ch52-4w7c-c8xp',
    );
    expect(pkg.gitHead).toBeUndefined();
  });
});
