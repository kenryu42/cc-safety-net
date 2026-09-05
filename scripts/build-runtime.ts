import { mkdirSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import type { BunPlugin } from 'bun';
import pkg from '../package.json';
import { type Layout, SHIPPED_LAYOUT } from './build-layout';
import { guiAssetsPlugin } from './gui-assets';

// zod modules the bundled copies replace with a stub. Every one of them is
// reachable only through an entry point the guard runtime never calls, and each
// costs the Amp plugin, the OpenClaw plugin, and the vendored dist/vendor/zod.cjs
// real bytes:
//   - locales/index.js is the `z.locales` barrel over ~40 translations. zod
//     imports `en` directly and installs it as the default error map, so a
//     translation is reachable only through `z.config(z.locales.xx())`.
//   - the JSON Schema converters back `z.toJSONSchema`, `z.fromJSONSchema`, and
//     the per-schema `.toJSONSchema()` method. Only scripts/build-schema.ts
//     converts schemas, and it imports zod from node_modules, not from a bundle.
// A stub that drops a name zod still imports by name fails the build, so a zod
// upgrade cannot silently turn one of these into dead weight or a bad reference.
const UNSUPPORTED_ZOD_EXPORT = 'JSON Schema conversion is not bundled into this plugin artifact';
const ZOD_MODULE_STUBS: readonly [RegExp, string][] = [
  [/zod[\\/]v4[\\/]locales[\\/]index\.js$/, 'export {};'],
  [
    /zod[\\/]v4[\\/]classic[\\/]from-json-schema\.js$/,
    `export const fromJSONSchema = () => { throw new Error(${JSON.stringify(UNSUPPORTED_ZOD_EXPORT)}); };`,
  ],
  [
    /zod[\\/]v4[\\/]core[\\/]to-json-schema\.js$/,
    `const unsupported = () => { throw new Error(${JSON.stringify(UNSUPPORTED_ZOD_EXPORT)}); };
     export const createToJSONSchemaMethod = () => unsupported;
     export const createStandardJSONSchemaMethod = () => unsupported;
     export const initializeContext = unsupported;
     export const process = unsupported;
     export const extractDefs = unsupported;
     export const finalize = unsupported;`,
  ],
];

// Bun.build normally resolves the tsconfig `@/*` alias itself, but inside `bun test`
// that implicit mapping is racy on Bun 1.4.0: the e2e-live beforeAll intermittently
// failed with `Could not resolve: "@/rules/constants"` (~1 in 3 under load) while the
// same build always succeeds in a standalone process. Resolving the alias explicitly
// removes the only environmental dependency that can produce that error.
const aliasPlugin = (layout: Layout): BunPlugin => ({
  name: 'alias',
  setup(build) {
    build.onResolve({ filter: layout.alias.filter }, (args) => ({
      path: Bun.resolveSync(
        args.path.replace(layout.alias.filter, `./${layout.alias.root}/`),
        join(import.meta.dir, '..'),
      ),
    }));
  },
});

const zodModuleStubs: BunPlugin = {
  name: 'zod-module-stubs',
  setup(build) {
    for (const [filter, contents] of ZOD_MODULE_STUBS) {
      build.onLoad({ filter }, () => ({ contents, loader: 'js' }));
    }
  },
};

// The Amp and OpenClaw plugins ship as single copied files, so they inline zod
// statically. schema.ts loads zod lazily through `createRequire('zod')` (a
// runtime require the bundler cannot follow); this plugin rewrites that one call
// into a static import so zod is bundled, without changing schema.ts or the
// split Node bundles' lazy-load behavior.
const inlineZod: BunPlugin = {
  name: 'inline-zod',
  setup(build) {
    // `args.path` is native, so the separator is a backslash on Windows.
    build.onLoad({ filter: /src[\\/]policy[\\/]schema\.ts$/ }, async (args) => {
      const source = await Bun.file(args.path).text();
      const replacements: Array<[string, string]> = [
        ["import type * as Zod from 'zod';", "import * as Zod from 'zod';"],
        ["const z = require('zod') as typeof Zod;", 'const z = Zod;'],
      ];
      const contents = replacements.reduce((current, [from, to]) => {
        if (!current.includes(from)) throw new Error(`inline-zod: missing "${from}"`);
        return current.replace(from, to);
      }, source);
      return { contents, loader: 'ts' };
    });
  },
};

// The split Node bundles ship in repository checkouts (Claude Code marketplace,
// Codex, Copilot CLI, Kimi Code) that never run a package manager, so
// `require('zod')` has no node_modules to resolve from. Repoint schema.ts's lazy
// require at the vendored copy buildRuntimeBundles emits, keeping zod parsed only
// when a custom-rule config exists. schema.ts lands in the shared chunk
// (dist/chunks/), so the specifier resolves to dist/vendor/zod.cjs.
const vendorZod: BunPlugin = {
  name: 'vendor-zod',
  setup(build) {
    build.onLoad({ filter: /src[\\/]policy[\\/]schema\.ts$/ }, async (args) => {
      const source = await Bun.file(args.path).text();
      const from = "const z = require('zod') as typeof Zod;";
      if (!source.includes(from)) throw new Error(`vendor-zod: missing "${from}"`);
      return {
        contents: source.replace(from, "const z = require('../vendor/zod.cjs') as typeof Zod;"),
        loader: 'ts',
      };
    });
  },
};

// Shared chunks are always emitted at `<outdir>/chunks/`, so a moved entry imports them
// through the path from its new directory to that one.
const chunkSpecifier = (path: string) => {
  const specifier = posix.relative(posix.dirname(path), 'chunks');
  return `${specifier.startsWith('.') ? specifier : `./${specifier}`}/`;
};

export async function buildRuntimeBundles(outdir: string, layout: Layout = SHIPPED_LAYOUT) {
  const result = await Bun.build({
    entrypoints: layout.entrypoints.runtime,
    outdir,
    target: 'node',
    splitting: true,
    naming: {
      entry: '[dir]/[name].[ext]',
      chunk: 'chunks/[name]-[hash].[ext]',
    },
    minify: true,
    define: {
      __PKG_VERSION__: JSON.stringify(pkg.version),
    },
    plugins: [
      aliasPlugin(layout),
      await guiAssetsPlugin(layout),
      ...(layout.lazyZod ? [vendorZod] : [zodModuleStubs]),
    ],
  });
  if (!result.success) return result;
  // Bun names a split entry's output directory after its source directory, so
  // the CLI and Pi entries land under cli/ and integrations/pi/. Their published
  // locations are fixed by package.json `bin`, package.json `pi.extensions`, and
  // hooks/hooks.json, so both are moved back. A move that changes an entry's
  // depth invalidates its relative shared-chunk specifiers; the rewrite is
  // anchored on the opening quote so `./chunks/` never matches inside
  // `../chunks/`, and it is a no-op for an entry that keeps its depth.
  await Promise.all(
    (
      [
        [layout.emitted.bin, 'bin/cc-safety-net.js'],
        [layout.emitted.pi, 'pi/index.js'],
      ] as const
    ).map(async ([from, to]) => {
      const emitted = Bun.file(join(outdir, from));
      await Bun.write(
        join(outdir, to),
        (await emitted.text()).replaceAll(`"${chunkSpecifier(from)}`, `"${chunkSpecifier(to)}`),
      );
      await emitted.delete();
    }),
  );
  if (!layout.lazyZod) return result;
  // The ESM entry, not index.cjs: zod's CJS tree uses `.cjs` filenames the stub
  // filters do not match. `.cjs` so Node loads the output as CommonJS despite the
  // package's "type": "module".
  const vendorResult = await Bun.build({
    entrypoints: ['node_modules/zod/index.js'],
    target: 'node',
    format: 'cjs',
    minify: true,
    plugins: [zodModuleStubs],
  });
  if (!vendorResult.success) return vendorResult;
  const vendored = vendorResult.outputs[0];
  if (!vendored) throw new Error('Vendored zod build produced no output');
  await Bun.write(join(outdir, 'vendor', 'zod.cjs'), vendored);
  return result;
}

/**
 * Build the standalone Amp plugin artifact separately from the split Node bundles. The
 * `cc-safety-net/index.ts` directory layout is significant: Amp materializes global directory
 * plugins as a plugin tree, whereas a root file is base64-encoded into one process environment
 * entry and exceeds Linux's per-entry limit. Every runtime dependency remains bundled so the
 * directory still contains one self-contained file.
 */
export async function buildAmpBundle(outdir: string, layout: Layout = SHIPPED_LAYOUT) {
  const result = await Bun.build({
    entrypoints: [layout.entrypoints.amp],
    target: 'bun',
    splitting: false,
    minify: true,
    define: {
      __PKG_VERSION__: JSON.stringify(pkg.version),
    },
    plugins: [aliasPlugin(layout), ...(layout.lazyZod ? [inlineZod] : []), zodModuleStubs],
  });
  if (!result.success) return result;
  const artifact = result.outputs[0];
  if (!artifact) throw new Error('Amp bundle produced no output');
  const amp = (await layout.loadArtifacts()).amp;
  const destination = join(outdir, 'amp', amp.AMP_PLUGIN_ENTRY);
  mkdirSync(dirname(destination), { recursive: true });
  await Bun.write(destination, amp.buildAmpArtifactHeader(pkg.version) + (await artifact.text()));
  return result;
}

/**
 * Build the complete OpenClaw plugin directory: the bundled runtime entry plus the manifest
 * and package metadata OpenClaw reads before it loads plugin code. Everything is inlined so a
 * local directory install, which gets no node_modules, still resolves at runtime.
 */
export async function buildOpenClawBundle(outdir: string, layout: Layout = SHIPPED_LAYOUT) {
  const result = await Bun.build({
    entrypoints: [layout.entrypoints.openclaw],
    target: 'node',
    splitting: false,
    minify: true,
    define: {
      __PKG_VERSION__: JSON.stringify(pkg.version),
    },
    plugins: [aliasPlugin(layout), ...(layout.lazyZod ? [inlineZod] : []), zodModuleStubs],
  });
  if (!result.success) return result;
  const artifact = result.outputs[0];
  if (!artifact) throw new Error('OpenClaw bundle produced no output');
  const openClaw = (await layout.loadArtifacts()).openclaw;
  const directory = join(outdir, 'openclaw', openClaw.OPENCLAW_PLUGIN_ID);
  mkdirSync(directory, { recursive: true });
  await Bun.write(
    join(directory, openClaw.OPENCLAW_PLUGIN_ENTRY_FILE),
    openClaw.buildOpenClawArtifactHeader(pkg.version) + (await artifact.text()),
  );
  await Promise.all(
    openClaw
      .buildOpenClawPluginManifests(pkg.version)
      .map((file) => Bun.write(join(directory, file.name), file.content)),
  );
  return result;
}
