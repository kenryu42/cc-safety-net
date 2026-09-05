import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { chmodSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, sep } from 'node:path';
import { buildAmpArtifactHeader } from '@next/hosts/amp/artifact';
import { buildOpenClawArtifactHeader } from '@next/hosts/openclaw/artifact';
import pkg from '../../package.json';
import { PORTED_LAYOUT, resolveLayout, SHIPPED_LAYOUT } from '../../scripts/build-layout';
import { getBundledOutputs, isPublicDeclarationOutput } from '../../scripts/build-output';
import {
  buildAmpBundle,
  buildOpenClawBundle,
  buildRuntimeBundles,
} from '../../scripts/build-runtime';
import { verifyBuildArtifacts } from '../../scripts/verify-build';
import { repairBundlerDirectoryCache } from '../next/helpers/gui-bundle-repair';

// zod names its error class with a string literal minification cannot rewrite, so the
// marker is present exactly where zod itself was bundled.
const ZOD_MARKER = 'ZodError';
const STATIC_SPECIFIER = /\b(?:from|import)\s*["']([^"']+)["']/g;
const DYNAMIC_SPECIFIER = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;

function readSpecifiers(source: string, pattern: RegExp): string[] {
  return [...source.matchAll(pattern)]
    .map((match) => match[1])
    .filter((specifier): specifier is string => specifier !== undefined);
}

// The sources reachable from one output without crossing a dynamic import. Minified
// string literals can look like a bare specifier, so only relative ones are followed.
function readStaticClosure(start: string): string[] {
  const visited = new Set<string>();
  const pending = [start];
  while (pending.length > 0) {
    const path = pending.shift();
    if (path === undefined || visited.has(path)) continue;
    visited.add(path);
    pending.push(
      ...readSpecifiers(readFileSync(path, 'utf8'), STATIC_SPECIFIER)
        .filter((specifier) => specifier.startsWith('.'))
        .map((specifier) => resolve(dirname(path), specifier)),
    );
  }
  return [...visited].map((path) => readFileSync(path, 'utf8'));
}

describe('resolveLayout', () => {
  test('defaults to the shipped layout and names the ported one', () => {
    // A script that drops `--layout` while forwarding its arguments would build the
    // ported tree into the committed dist/, or check the shipped schema twice.
    expect(resolveLayout([])).toBe(SHIPPED_LAYOUT);
    expect(resolveLayout(['--layout', 'shipped'])).toBe(SHIPPED_LAYOUT);
    expect(resolveLayout(['bun', 'scripts/build.ts', '--layout', 'ported'])).toBe(PORTED_LAYOUT);
    expect(() => resolveLayout(['--layout', 'next'])).toThrow(
      '--layout must be shipped or ported, got next',
    );
  });
});

describe('ported build outputs', () => {
  test('keeps the declarations tsc emits under entries/', () => {
    // tsc names them relative to rootDir. Matching the shipped names instead would
    // delete both before build.ts moves them to the outdir root.
    expect(isPublicDeclarationOutput('dist-next\\entries\\api.d.ts', PORTED_LAYOUT)).toBeTrue();
    expect(isPublicDeclarationOutput('dist-next\\api.d.ts', PORTED_LAYOUT)).toBeFalse();
  });

  test('finds the bundled outputs Bun emits at the outdir root', () => {
    // Every ported entry shares the next/entries root, so Bun emits bin.js and pi.js
    // flat; looking for the shipped subdirectories would report the build incomplete.
    const outputs = getBundledOutputs(
      [
        { path: 'C:\\a\\cc-safety-net\\dist-next\\index.js', size: 1000 },
        { path: 'C:\\a\\cc-safety-net\\dist-next\\bin.js', size: 2000 },
        { path: 'C:\\a\\cc-safety-net\\dist-next\\pi.js', size: 3000 },
      ],
      PORTED_LAYOUT,
    );

    expect(outputs.indexOutput?.size).toBe(1000);
    expect(outputs.binOutput?.size).toBe(2000);
    expect(outputs.piOutput?.size).toBe(3000);
  });
});

describe('ported layout build', () => {
  // Named here but created in `beforeAll`, so a run whose tests are all filtered out leaves no
  // directory behind: `afterAll` never fires for a describe that contributed no test.
  const root = join(
    process.env.CC_SAFETY_NET_TEST_TMPDIR ?? tmpdir(),
    `build-layout-${process.pid}`,
  );
  const outdir = join(root, 'dist-next');
  const bin = join(outdir, 'bin', 'cc-safety-net.js');
  const originalCwd = process.cwd();
  const listOutputs = (pattern: string) =>
    [...new Bun.Glob(pattern).scanSync({ cwd: outdir, onlyFiles: true })]
      .map((path) => path.replaceAll(sep, '/'))
      .sort();

  beforeAll(async () => {
    mkdirSync(outdir, { recursive: true });
    for (const build of [buildRuntimeBundles, buildAmpBundle, buildOpenClawBundle]) {
      expect((await build(outdir, PORTED_LAYOUT)).success).toBeTrue();
    }
    // verifyBuildArtifacts only checks that the two public declarations exist, and no
    // assertion below reads their bytes, so tsc would cost seconds for nothing.
    for (const declaration of ['index.d.ts', 'api.d.ts']) {
      writeFileSync(join(outdir, declaration), 'export {};\n');
    }
    chmodSync(bin, 0o755);
    // Building this layout imports next/gui/assets in-process, which leaves bun's
    // listings of next/core and next/gui stale for every later test file.
    await repairBundlerDirectoryCache();
  }, 60_000);

  afterAll(() => {
    process.chdir(originalCwd);
    rmSync(root, { recursive: true, force: true });
  });

  test('emits exactly the pinned published paths', () => {
    // A wrong Bun root or a missed move-back leaves bin.js and pi.js at the outdir root,
    // and a stale allowlist would let dist-next/entries/*.d.ts or vendor/zod.cjs survive.
    expect(listOutputs('**/*').filter((path) => !path.startsWith('chunks/'))).toEqual([
      'amp/cc-safety-net/index.ts',
      'api.d.ts',
      'api.js',
      'bin/cc-safety-net.js',
      'index.d.ts',
      'index.js',
      'openclaw/cc-safety-net/index.js',
      'openclaw/cc-safety-net/openclaw.plugin.json',
      'openclaw/cc-safety-net/package.json',
      'pi/index.js',
    ]);
    expect(listOutputs('chunks/*.js').length).toBeGreaterThan(0);
  });

  test('starts the bin with the Node shebang', () => {
    // npm links the bin as an executable, so the interpreter line is what runs it.
    expect(readFileSync(bin, 'utf8').startsWith('#!/usr/bin/env node\n')).toBeTrue();
  });

  test('reaches zod only through the CLI chunk the bin imports dynamically', () => {
    // A static import of the CLI or of the policy schema from the bin puts zod on the
    // hook path; a build that stopped bundling zod would leave the CLI chunk without it.
    const dynamic = readSpecifiers(readFileSync(bin, 'utf8'), DYNAMIC_SPECIFIER);

    expect(readStaticClosure(bin).some((source) => source.includes(ZOD_MARKER))).toBeFalse();
    expect(dynamic).toEqual([expect.stringMatching(/^\.\.\/chunks\/[A-Za-z0-9_-]+\.js$/)]);
    expect(
      dynamic
        .flatMap((specifier) => readStaticClosure(resolve(dirname(bin), specifier)))
        .some((source) => source.includes(ZOD_MARKER)),
    ).toBeTrue();
  });

  test('replaces the version define and keeps the internal sync field out', () => {
    // Without the define the published CLI reports `__PKG_VERSION__` as its version, and
    // the rule synchronization field must never reach a published bundle.
    const sources = listOutputs('**/*.{js,ts}').map(
      (path) => [path, readFileSync(join(outdir, path), 'utf8')] as const,
    );

    expect(
      sources.filter(([, source]) => source.includes('__PKG_VERSION__')).map(([path]) => path),
    ).toEqual([]);
    expect(
      sources.filter(([, source]) => source.includes('_operation')).map(([path]) => path),
    ).toEqual([]);
    expect(
      readStaticClosure(bin).some((source) => source.includes(JSON.stringify(pkg.version))),
    ).toBeTrue();
  });

  test('stamps both plugin artifacts with their managed header', () => {
    // The installers and doctor identify a managed plugin by this exact first line.
    expect(
      readFileSync(join(outdir, 'amp', 'cc-safety-net', 'index.ts'), 'utf8').startsWith(
        buildAmpArtifactHeader(pkg.version),
      ),
    ).toBeTrue();
    expect(
      readFileSync(join(outdir, 'openclaw', 'cc-safety-net', 'index.js'), 'utf8').startsWith(
        buildOpenClawArtifactHeader(pkg.version),
      ),
    ).toBeTrue();
  });

  test('passes build verification against the ported layout', async () => {
    // verifyBuildArtifacts reports paths relative to the working directory, so the
    // ported outdir has to be verified from the root that holds it.
    process.chdir(root);

    expect(await verifyBuildArtifacts(PORTED_LAYOUT)).toContain('dist-next/bin/cc-safety-net.js');
  });
});
