import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';

const NEXT_ROOT = join(import.meta.dir, '..', '..', 'src');
const HOOK_ENTRY = join(NEXT_ROOT, 'entries', 'bin.ts');

const STATIC_SPECIFIER = /(?:^|[\n;])\s*(?:import|export)\b[^'"]*?\bfrom\s*['"]([^'"]+)['"]/g;
const DYNAMIC_SPECIFIER = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

function staticSpecifiers(source: string): string[] {
  return [...source.matchAll(STATIC_SPECIFIER)].flatMap((match) =>
    match[1] === undefined ? [] : [match[1]],
  );
}

function dynamicSpecifiers(source: string): string[] {
  return [...source.matchAll(DYNAMIC_SPECIFIER)].flatMap((match) =>
    match[1] === undefined ? [] : [match[1]],
  );
}

function resolveSpecifier(specifier: string, fromFile: string): string | undefined {
  const base = specifier.startsWith('@/')
    ? join(NEXT_ROOT, specifier.slice('@/'.length))
    : specifier.startsWith('.')
      ? join(dirname(fromFile), specifier)
      : undefined;
  if (base === undefined) return undefined;
  return existsSync(`${base}.ts`) ? `${base}.ts` : join(base, 'index.ts');
}

const relativeToRoot = (file: string) => relative(NEXT_ROOT, file).split(sep).join('/');

function closureOf(entryFile: string) {
  const files = new Set<string>();
  const bare = new Set<string>();
  const pending = [entryFile];
  while (pending.length > 0) {
    const file = pending.pop() as string;
    if (files.has(relativeToRoot(file))) continue;
    files.add(relativeToRoot(file));
    for (const specifier of staticSpecifiers(readFileSync(file, 'utf-8'))) {
      const resolved = resolveSpecifier(specifier, file);
      if (resolved === undefined) bare.add(specifier);
      else pending.push(resolved);
    }
  }
  return { files, bare };
}

const OFF_THE_HOOK_PATH =
  /(^|\/)(install|detect|doctor|system-info)|^cli\/|(^|\/)gui\/|rules-manager\//;
const IN_PROCESS_ENTRIES = [
  'hosts/openclaw/',
  'hosts/opencode/',
  'hosts/pi/',
  'hosts/amp/',
  'hosts/templates/',
];

const offTheHookPath = (file: string) =>
  file !== 'cli/args.ts' &&
  (OFF_THE_HOOK_PATH.test(file) ||
    IN_PROCESS_ENTRIES.some((prefix) => file.startsWith(prefix)) ||
    file === 'entries/api.ts');

const offTheCheckout = (specifier: string) => !specifier.startsWith('node:') && specifier !== 'bun';

const closure = closureOf(HOOK_ENTRY);

describe('the hook entry closure', () => {
  test('cold-start budget: the gate, the writer and the adapters, and nothing the CLI carries', () => {
    expect(
      [
        'gate/pipeline.ts',
        'audit/writer.ts',
        'entries/hook-integrations.ts',
        'hosts/antigravity-cli/hook.ts',
        'hosts/claude-code/hook.ts',
        'hosts/codex/hook.ts',
        'hosts/copilot-cli/hook.ts',
        'hosts/cursor/hook.ts',
        'hosts/gemini-cli/hook.ts',
        'hosts/grok-build/hook.ts',
        'hosts/hermes-agent/hook.ts',
        'hosts/kimi-code/hook.ts',
      ].filter((file) => !closure.files.has(file)),
    ).toEqual([]);
    expect([...closure.files].filter(offTheHookPath)).toEqual([]);
  });

  test('the bin reaches the CLI through exactly one dynamic import', () => {
    expect(dynamicSpecifiers(readFileSync(HOOK_ENTRY, 'utf-8'))).toEqual(['@/cli/main']);
  });

  test('the CLI chunk carries the GUI on a static import', () => {
    expect(staticSpecifiers(readFileSync(join(NEXT_ROOT, 'cli', 'main.ts'), 'utf-8'))).toContain(
      '@/gui/index',
    );
  });

  test('git-checkout mode: the closure names no package', () => {
    expect([...closure.bare].filter(offTheCheckout)).toEqual([]);
  });

  test('cold-start budget: the closure loads no crypto at import', () => {
    expect([...closure.bare].filter((specifier) => specifier === 'node:crypto')).toEqual([]);
  });

  test('the predicates are falsifiable', () => {
    const source =
      "import { a } from '@/cli/main'; import z from 'zod'; import { b } from './x'; import { c } from '@/hosts/system-info';";
    const specifiers = staticSpecifiers(source);
    expect(specifiers).toEqual(['@/cli/main', 'zod', './x', '@/hosts/system-info']);

    const resolved = specifiers.map((specifier) => resolveSpecifier(specifier, HOOK_ENTRY));
    expect(
      resolved
        .filter((file) => file !== undefined)
        .map(relativeToRoot)
        .filter(offTheHookPath),
    ).toEqual(['cli/main.ts', 'hosts/system-info.ts']);
    expect(
      specifiers.filter((_, index) => resolved[index] === undefined).filter(offTheCheckout),
    ).toEqual(['zod']);

    expect(offTheHookPath('cli/args.ts')).toBeFalse();
    expect(offTheHookPath('cli/main.ts')).toBeTrue();
    expect(offTheHookPath('rules-manager/sync.ts')).toBeTrue();
    expect(offTheHookPath('cli/rule/index.ts')).toBeTrue();
    expect(offTheHookPath('gui/index.ts')).toBeTrue();
    expect(offTheHookPath('gui/frontend/main.ts')).toBeTrue();
    expect(
      dynamicSpecifiers(
        "const cli = await import('@/cli/main');\nconst gui = await import('@/cli/gui');\n",
      ),
    ).toEqual(['@/cli/main', '@/cli/gui']);
  });
});
