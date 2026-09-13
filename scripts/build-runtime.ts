import { mkdirSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import type { BunPlugin } from 'bun';
import pkg from '../package.json';
import { AMP_PLUGIN_ENTRY, buildAmpArtifactHeader } from '../src/hosts/amp/artifact';
import {
  buildOpenClawArtifactHeader,
  buildOpenClawPluginManifests,
  OPENCLAW_PLUGIN_ENTRY_FILE,
  OPENCLAW_PLUGIN_ID,
} from '../src/hosts/openclaw/artifact';
import { guiAssetsPlugin } from './gui-assets';

// Bun.build normally resolves the tsconfig `@/*` alias itself, but inside `bun test`
// that implicit mapping is racy on Bun 1.4.0: the e2e-live beforeAll intermittently
// failed with `Could not resolve: "@/rules/constants"` (~1 in 3 under load) while the
// same build always succeeds in a standalone process. Resolving the alias explicitly
// removes the only environmental dependency that can produce that error.
const aliasPlugin: BunPlugin = {
  name: 'alias',
  setup(build) {
    build.onResolve({ filter: /^@\// }, (args) => ({
      path: Bun.resolveSync(args.path.replace(/^@\//, './src/'), join(import.meta.dir, '..')),
    }));
  },
};

// Shared chunks are always emitted at `<outdir>/chunks/`, so a moved entry imports them
// through the path from its new directory to that one.
const chunkSpecifier = (path: string) => {
  const specifier = posix.relative(posix.dirname(path), 'chunks');
  return `${specifier.startsWith('.') ? specifier : `./${specifier}`}/`;
};

export async function buildRuntimeBundles(outdir: string) {
  const result = await Bun.build({
    entrypoints: [
      'src/entries/index.ts',
      'src/entries/api.ts',
      'src/entries/cli.ts',
      'src/entries/pi.ts',
    ],
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
    plugins: [aliasPlugin, await guiAssetsPlugin()],
  });
  if (!result.success) return result;
  // Bun names a split entry after its path below the entries' common root, so
  // the Pi entry lands at the outdir root as pi.js. Its published location is
  // fixed by package.json `pi.extensions`, so it is moved back. A move that changes an entry's
  // depth invalidates its relative shared-chunk specifiers; the rewrite is
  // anchored on the opening quote so `./chunks/` never matches inside
  // `../chunks/`, and it is a no-op for an entry that keeps its depth.
  const moves = [['pi.js', 'pi/index.js']] as const;
  await Promise.all(
    moves.map(async ([from, to]) => {
      const emitted = Bun.file(join(outdir, from));
      await Bun.write(
        join(outdir, to),
        (await emitted.text()).replaceAll(`"${chunkSpecifier(from)}`, `"${chunkSpecifier(to)}`),
      );
      await emitted.delete();
    }),
  );
  // Bun may hoist code an entry shares with a chunk into the entry itself, so the chunk imports
  // those symbols back from `../pi.js`; a move that renames an entry leaves those references
  // dangling and the published entry fails to load.
  await Promise.all(
    result.outputs
      .filter((output) => output.kind === 'chunk')
      .map(async (output) => {
        const source = await Bun.file(output.path).text();
        await Bun.write(
          output.path,
          moves.reduce(
            (current, [from, to]) => current.replaceAll(`"../${from}"`, `"../${to}"`),
            source,
          ),
        );
      }),
  );
  const bin = await buildBinBundle(outdir);
  return bin.success ? result : bin;
}

/** The hook bundle's file name beside the bin, and the CLI entry the bundle loads for any other verb. */
const BIN_HOOK_BUNDLE = 'hook.js';
const BIN_CLI_SPECIFIER = '../cli.js';

/**
 * The published bin: a CommonJS loader plus the hook bundle it requires, both under a
 * `package.json` that marks the directory CommonJS inside an ESM package, so the pinned path
 * `dist/bin/cc-safety-net.js` keeps its name. The hook runs as a fresh Node process per tool call
 * and CommonJS skips the ES module loader's resolve, link and async-evaluate steps, which cost
 * more than a hook's own work. The bundle is self-contained: everything it reaches statically is
 * inlined, and the CLI stays behind its one dynamic import as the ESM `dist/cli.js` entry.
 *
 * The loader exists for Node's compile cache: bytecode is cached only for modules compiled after
 * `enableCompileCache` runs, so the module that calls it cannot be the bundle. The cache lives
 * under the user's CC Safety Net home rather than the shared temp directory, since it is executable
 * bytecode the hook trusts on the next run; a Node without the API, or an unwritable home, runs
 * uncached.
 */
async function buildBinBundle(outdir: string) {
  const result = await Bun.build({
    entrypoints: ['src/entries/bin.ts'],
    target: 'node',
    format: 'cjs',
    splitting: false,
    minify: true,
    define: {
      __PKG_VERSION__: JSON.stringify(pkg.version),
    },
    plugins: [
      {
        name: 'cli-entry',
        setup(build) {
          build.onResolve({ filter: /^@\/cli\/main$/ }, () => ({
            path: BIN_CLI_SPECIFIER,
            external: true,
          }));
        },
      },
      aliasPlugin,
    ],
  });
  if (!result.success) return result;
  const artifact = result.outputs[0];
  if (!artifact) throw new Error('Bin bundle produced no output');
  const directory = join(outdir, 'bin');
  mkdirSync(directory, { recursive: true });
  await Promise.all([
    Bun.write(join(directory, BIN_HOOK_BUNDLE), await artifact.text()),
    Bun.write(join(directory, 'package.json'), `${JSON.stringify({ type: 'commonjs' })}\n`),
    Bun.write(
      join(directory, 'cc-safety-net.js'),
      [
        '#!/usr/bin/env node',
        "'use strict';",
        "const { enableCompileCache } = require('node:module');",
        'if (enableCompileCache !== undefined) {',
        "  const { join } = require('node:path');",
        '  enableCompileCache(',
        '    join(',
        "      process.env.CC_SAFETY_NET_HOME || join(require('node:os').homedir(), '.cc-safety-net'),",
        "      'compile-cache',",
        '    ),',
        '  );',
        '}',
        `require('./${BIN_HOOK_BUNDLE}');`,
        '',
      ].join('\n'),
    ),
  ]);
  return result;
}

/**
 * Build the standalone Amp plugin artifact separately from the split Node bundles. The
 * `cc-safety-net/index.ts` directory layout is significant: Amp materializes global directory
 * plugins as a plugin tree, whereas a root file is base64-encoded into one process environment
 * entry and exceeds Linux's per-entry limit. Every runtime dependency remains bundled so the
 * directory still contains one self-contained file.
 */
export async function buildAmpBundle(outdir: string) {
  const result = await Bun.build({
    entrypoints: ['src/entries/amp.ts'],
    target: 'bun',
    splitting: false,
    minify: true,
    define: {
      __PKG_VERSION__: JSON.stringify(pkg.version),
    },
    plugins: [aliasPlugin],
  });
  if (!result.success) return result;
  const artifact = result.outputs[0];
  if (!artifact) throw new Error('Amp bundle produced no output');
  const destination = join(outdir, 'amp', AMP_PLUGIN_ENTRY);
  mkdirSync(dirname(destination), { recursive: true });
  await Bun.write(destination, buildAmpArtifactHeader(pkg.version) + (await artifact.text()));
  return result;
}

/**
 * Build the complete OpenClaw plugin directory: the bundled runtime entry plus the manifest
 * and package metadata OpenClaw reads before it loads plugin code. Everything is inlined so a
 * local directory install, which gets no node_modules, still resolves at runtime.
 */
export async function buildOpenClawBundle(outdir: string) {
  const result = await Bun.build({
    entrypoints: ['src/entries/openclaw.ts'],
    target: 'node',
    splitting: false,
    minify: true,
    define: {
      __PKG_VERSION__: JSON.stringify(pkg.version),
    },
    plugins: [aliasPlugin],
  });
  if (!result.success) return result;
  const artifact = result.outputs[0];
  if (!artifact) throw new Error('OpenClaw bundle produced no output');
  const directory = join(outdir, 'openclaw', OPENCLAW_PLUGIN_ID);
  mkdirSync(directory, { recursive: true });
  await Bun.write(
    join(directory, OPENCLAW_PLUGIN_ENTRY_FILE),
    buildOpenClawArtifactHeader(pkg.version) + (await artifact.text()),
  );
  await Promise.all(
    buildOpenClawPluginManifests(pkg.version).map((file) =>
      Bun.write(join(directory, file.name), file.content),
    ),
  );
  return result;
}
