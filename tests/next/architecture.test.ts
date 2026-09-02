import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * The rebuild under `next/` is a second implementation of the same contract,
 * not a layer over the old one. Two rules keep it that way until cutover:
 * nothing under `next/` imports `src/`, and nothing under `next/` imports a
 * third-party package (the schema validator stays off the hot path, and the
 * host layer is the only place a host SDK may appear, allowed here per file
 * when Phase 5 lands the first one).
 */

const NEXT_ROOT = join(import.meta.dir, '..', '..', 'next');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf-8' })
    .filter((entry) => entry.endsWith('.ts'))
    .map((entry) => join(dir, entry));
}

const IMPORT_SPECIFIER =
  /(?:^|\n)\s*(?:import|export)\b[^'"]*?\bfrom\s*['"]([^'"]+)['"]|\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

function importSpecifiers(source: string): string[] {
  return [...source.matchAll(IMPORT_SPECIFIER)].flatMap((match) => {
    const specifier = match[1] ?? match[2];
    return specifier === undefined ? [] : [specifier];
  });
}

function isAllowed(specifier: string, file: string): boolean {
  if (specifier.startsWith('node:')) return true;
  if (specifier.startsWith('@next/')) return true;
  if (specifier.startsWith('.')) {
    return !relative(NEXT_ROOT, join(file, '..', specifier)).startsWith('..');
  }
  return specifier === 'bun';
}

describe('next/ architecture', () => {
  const files = sourceFiles(NEXT_ROOT);

  test('contains source files', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  test('never imports src/ and never imports a third-party package', () => {
    const violations = files.flatMap((file) =>
      importSpecifiers(readFileSync(file, 'utf-8'))
        .filter((specifier) => !isAllowed(specifier, file))
        .map((specifier) => `${relative(NEXT_ROOT, file)} imports ${specifier}`),
    );
    expect(violations).toEqual([]);
  });

  test('the rule is falsifiable', () => {
    const file = join(NEXT_ROOT, 'core', 'example.ts');
    const offending =
      "import { x } from '@/engine/guard';\nimport y from 'zod';\nimport { z } from '../../src/api';\nimport { ok } from './decision';\nimport { n } from 'node:fs';\nconst lazy = await import('@next/core/decision');\n";
    expect(importSpecifiers(offending).filter((specifier) => !isAllowed(specifier, file))).toEqual([
      '@/engine/guard',
      'zod',
      '../../src/api',
    ]);
  });
});
