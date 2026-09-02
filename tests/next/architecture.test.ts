import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * The rebuild under `next/` is a second implementation of the same contract,
 * not a layer over the old one. Two rules keep it that way until cutover:
 * nothing under `next/` imports `src/`, and nothing under `next/` imports a
 * third-party package, except the files listed below — the schema validator,
 * which every other module reaches for diagnostics through `validate.ts` so the
 * loader never pulls it onto the hook's path, and the host layer, allowed here
 * per file when Phase 5 lands the first one.
 */

const NEXT_ROOT = join(import.meta.dir, '..', '..', 'next');
const SCHEMA_MODULE = join(NEXT_ROOT, 'core', 'policy', 'schema.ts');

const THIRD_PARTY_ALLOWANCES: Record<string, readonly string[]> = {
  'core/policy/schema.ts': ['zod'],
};

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf-8' })
    .filter((entry) => entry.endsWith('.ts'))
    .map((entry) => join(dir, entry));
}

// The third alternative is `createRequire`: the shipped schema module reaches its
// validator that way, so a port of that line would otherwise name a package no
// static import mentions.
const IMPORT_SPECIFIER =
  /(?:^|\n)\s*(?:import|export)\b[^'"]*?\bfrom\s*['"]([^'"]+)['"]|\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)|\w*[rR]equire\s*\((?:[^()'"]*\)\s*\()?\s*['"]([^'"]+)['"]\s*\)/g;

function importSpecifiers(source: string): string[] {
  return [...source.matchAll(IMPORT_SPECIFIER)].flatMap((match) => {
    const specifier = match[1] ?? match[2] ?? match[3];
    return specifier === undefined ? [] : [specifier];
  });
}

function isAllowed(specifier: string, file: string): boolean {
  if (specifier.startsWith('node:')) return true;
  if (specifier.startsWith('@next/')) return true;
  if (specifier.startsWith('.')) {
    return !relative(NEXT_ROOT, join(file, '..', specifier)).startsWith('..');
  }
  if (specifier === 'bun') return true;
  return (THIRD_PARTY_ALLOWANCES[relative(NEXT_ROOT, file)] ?? []).includes(specifier);
}

function resolvesToSchemaModule(specifier: string, file: string): boolean {
  if (specifier === '@next/core/policy/schema') return true;
  if (!specifier.startsWith('.')) return false;
  const resolved = join(file, '..', specifier);
  return resolved === SCHEMA_MODULE || `${resolved}.ts` === SCHEMA_MODULE;
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

  test('the schema validator is imported by no other module under next/', () => {
    const violations = files
      .filter((file) => file !== SCHEMA_MODULE)
      .flatMap((file) =>
        importSpecifiers(readFileSync(file, 'utf-8'))
          .filter((specifier) => resolvesToSchemaModule(specifier, file))
          .map((specifier) => `${relative(NEXT_ROOT, file)} imports ${specifier}`),
      );
    expect(violations).toEqual([]);
  });

  test('the rule is falsifiable', () => {
    const file = join(NEXT_ROOT, 'core', 'example.ts');
    const offending =
      "import { x } from '@/engine/guard';\nimport y from 'zod';\nimport { z } from '../../src/api';\nimport { ok } from './decision';\nimport { n } from 'node:fs';\nconst lazy = await import('@next/core/decision');\nconst required = require('zod');\nconst lazily = createRequire(import.meta.url)('zod');\n";
    expect(importSpecifiers(offending).filter((specifier) => !isAllowed(specifier, file))).toEqual([
      '@/engine/guard',
      'zod',
      '../../src/api',
      'zod',
      'zod',
    ]);

    const snapshot = join(NEXT_ROOT, 'core', 'policy', 'snapshot.ts');
    expect(isAllowed('zod', SCHEMA_MODULE)).toBeTrue();
    expect(isAllowed('zod', snapshot)).toBeFalse();
    expect(resolvesToSchemaModule('./schema', snapshot)).toBeTrue();
    expect(resolvesToSchemaModule('@next/core/policy/schema', snapshot)).toBeTrue();
    expect(resolvesToSchemaModule('./validate', snapshot)).toBeFalse();
  });
});
