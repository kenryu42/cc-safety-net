import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

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
  // The two hosts whose SDK types are the host's own parameter shapes: an `import type` is erased,
  // so neither the cold-start closure nor a git checkout without `node_modules` ever sees them.
  'hosts/opencode/plugin.ts': ['@opencode-ai/plugin'],
  'entries/index.ts': ['@opencode-ai/plugin'],
  'hosts/amp/tool-call.ts': ['@ampcode/plugin'],
  'entries/amp.ts': ['@ampcode/plugin'],
};

/** The layers a host adapter may reach for; `entries` is above it, and `hosts` is its own. */
const HOST_LAYERS = ['core', 'gate', 'audit', 'hosts'];
const NETWORK_MODULES = ['node:http', 'node:https', 'node:net', 'http', 'https', 'net'];
/**
 * The installers' spawn boundary: the four host-layer files whose `src/` counterparts spawn a
 * host CLI. The hook path never spawns, and the import-closure test keeps all four off it.
 */
const CHILD_PROCESS_ALLOWANCES: readonly string[] = [
  'hosts/amp/run.ts',
  'hosts/install/native.ts',
  'hosts/install/choices.ts',
  'hosts/system-info.ts',
];

/** The layers a CLI command may reach for; `entries` is above it, and `cli` is its own. */
const CLI_LAYERS = ['core', 'gate', 'audit', 'hosts', 'cli'];
/** The arg parser sits in entries until Phase 7 relocates it with the dynamic CLI chunk. */
const CLI_ENTRY_ALLOWANCE = '@next/entries/args';

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

/**
 * The top-level directory under `next/` a specifier resolves to, so the layering rule reads the
 * layer rather than the spelling: `../audit/writer` and `@next/audit/writer` are one violation.
 */
function layerOf(specifier: string, file: string) {
  if (specifier.startsWith('@next/')) return specifier.split('/')[1];
  if (!specifier.startsWith('.')) return undefined;
  return relative(NEXT_ROOT, join(file, '..', specifier)).split(sep)[0];
}

function resolvesToSchemaModule(specifier: string, file: string): boolean {
  if (specifier === '@next/core/policy/schema') return true;
  if (!specifier.startsWith('.')) return false;
  const resolved = join(file, '..', specifier);
  return resolved === SCHEMA_MODULE || `${resolved}.ts` === SCHEMA_MODULE;
}

/** The specifiers a file imports as types only, which are erased before anything runs. */
const TYPE_ONLY_IMPORT = /(?:^|\n)\s*(import\b[^'"]*?)\bfrom\s*['"]([^'"]+)['"]/g;

function typeOnlyImports(source: string): string[] {
  return [...source.matchAll(TYPE_ONLY_IMPORT)].flatMap((match) =>
    match[2] !== undefined && match[1]?.startsWith('import type') ? [match[2]] : [],
  );
}

/**
 * The host tier: an adapter reaches down into the gate, core and audit and never back up into an
 * entry, and no file the hook path loads opens a socket or spawns a process — the two capabilities
 * a gate that runs on every tool call has no use for.
 */
function layeringViolations(file: string, source: string): string[] {
  const path = relative(NEXT_ROOT, file);
  const layer = path.split(sep)[0];
  const specifiers = importSpecifiers(source);
  const allowedThirdParty = THIRD_PARTY_ALLOWANCES[path] ?? [];
  const offending = specifiers.filter((specifier) => {
    if (layer === 'hosts' || layer === 'entries') {
      if (NETWORK_MODULES.includes(specifier)) return true;
      if (specifier === 'node:child_process') return !CHILD_PROCESS_ALLOWANCES.includes(path);
    }
    if (layer === 'hosts') {
      if (specifier.startsWith('node:') || allowedThirdParty.includes(specifier)) return false;
      return !HOST_LAYERS.includes(layerOf(specifier, file) ?? '');
    }
    if (layer === 'cli') {
      if (
        specifier.startsWith('node:') ||
        allowedThirdParty.includes(specifier) ||
        specifier === CLI_ENTRY_ALLOWANCE
      )
        return false;
      return !CLI_LAYERS.includes(layerOf(specifier, file) ?? '');
    }
    if (layer === 'core' || layer === 'gate' || layer === 'audit') {
      return (
        layerOf(specifier, file) === 'hosts' ||
        layerOf(specifier, file) === 'entries' ||
        layerOf(specifier, file) === 'cli'
      );
    }
    return false;
  });
  return [
    ...offending.map((specifier) => `${path} imports ${specifier}`),
    ...allowedThirdParty
      .filter(
        (specifier) =>
          (layer === 'hosts' || layer === 'entries') &&
          specifiers.includes(specifier) &&
          !typeOnlyImports(source).includes(specifier),
      )
      .map((specifier) => `${path} imports ${specifier} as a value`),
  ];
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

  test('audit sits under core, and neither core nor gate reaches back into it', () => {
    const violations = files.flatMap((file) => {
      const path = relative(NEXT_ROOT, file);
      const specifiers = importSpecifiers(readFileSync(file, 'utf-8'));
      const offending = path.startsWith(`audit${sep}`)
        ? specifiers.filter(
            (specifier) =>
              !specifier.startsWith('node:') &&
              layerOf(specifier, file) !== 'core' &&
              layerOf(specifier, file) !== 'audit',
          )
        : specifiers.filter(
            (specifier) =>
              layerOf(specifier, file) === 'audit' &&
              (path.startsWith(`core${sep}`) || path.startsWith(`gate${sep}`)),
          );
      return offending.map((specifier) => `${path} imports ${specifier}`);
    });
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

  test('hosts import gate, core and audit; entries import anything below; nothing reaches up', () => {
    expect(files.flatMap((file) => layeringViolations(file, readFileSync(file, 'utf-8')))).toEqual(
      [],
    );
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

    const pipeline = join(NEXT_ROOT, 'gate', 'pipeline.ts');
    expect(layerOf('../audit/writer', pipeline)).toBe('audit');
    expect(layerOf('@next/audit/writer', pipeline)).toBe('audit');
    expect(layerOf('../core/redaction', join(NEXT_ROOT, 'audit', 'display.ts'))).toBe('core');
    expect(layerOf('node:fs', pipeline)).toBeUndefined();

    expect(
      layeringViolations(
        join(NEXT_ROOT, 'hosts', 'example', 'hook.ts'),
        "import { main } from '@next/entries/bin';\nimport { request } from 'node:http';\nimport { spawn } from 'node:child_process';\n",
      ),
    ).toEqual([
      'hosts/example/hook.ts imports @next/entries/bin',
      'hosts/example/hook.ts imports node:http',
      'hosts/example/hook.ts imports node:child_process',
    ]);
    expect(
      layeringViolations(
        join(NEXT_ROOT, 'cli', 'example.ts'),
        "import { main } from '@next/entries/bin';\nimport { parseCommandArgs } from '@next/entries/args';\n",
      ),
    ).toEqual(['cli/example.ts imports @next/entries/bin']);
    expect(
      layeringViolations(
        join(NEXT_ROOT, 'core', 'example.ts'),
        "import { writeGuardAudit } from '@next/hosts/audit';\n",
      ),
    ).toEqual(['core/example.ts imports @next/hosts/audit']);
    expect(
      layeringViolations(
        join(NEXT_ROOT, 'core', 'example.ts'),
        "import { colorize } from '@next/cli/utils/colors';\n",
      ),
    ).toEqual(['core/example.ts imports @next/cli/utils/colors']);
    expect(
      layeringViolations(
        join(NEXT_ROOT, 'hosts', 'install', 'native.ts'),
        "import { spawn } from 'node:child_process';\n",
      ),
    ).toEqual([]);
    expect(
      layeringViolations(
        join(NEXT_ROOT, 'hosts', 'opencode', 'plugin.ts'),
        "import { Plugin } from '@opencode-ai/plugin';\n",
      ),
    ).toEqual(['hosts/opencode/plugin.ts imports @opencode-ai/plugin as a value']);
  });
});
