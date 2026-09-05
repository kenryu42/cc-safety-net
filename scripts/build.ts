#!/usr/bin/env bun
/**
 * Build script that injects __PKG_VERSION__ at compile time
 * to avoid embedding the full package.json in the bundle.
 */

import { renameSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';
import { resolveLayout } from './build-layout';
import { getBundledOutputs, isPublicDeclarationOutput } from './build-output';
import { buildAmpBundle, buildOpenClawBundle, buildRuntimeBundles } from './build-runtime';
import { generateThirdPartyLicenses } from './generate-third-party-licenses';
import { formatSubprocessFailure } from './subprocess-output';
import { verifyBuildArtifacts } from './verify-build';

const layout = resolveLayout(process.argv);

generateThirdPartyLicenses();
const result = await buildRuntimeBundles(layout.outdir, layout);

if (!result.success) {
  console.error('Build failed:');
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

const ampResult = await buildAmpBundle(layout.outdir, layout);
if (!ampResult.success) {
  console.error('Amp bundle failed:');
  for (const log of ampResult.logs) {
    console.error(log);
  }
  process.exit(1);
}

const openClawResult = await buildOpenClawBundle(layout.outdir, layout);
if (!openClawResult.success) {
  console.error('OpenClaw bundle failed:');
  for (const log of openClawResult.logs) {
    console.error(log);
  }
  process.exit(1);
}

// Run build:types and build:schema
const typesResult = Bun.spawnSync([...layout.typesCommand]);
if (typesResult.exitCode !== 0) {
  console.error(formatSubprocessFailure('build:types', typesResult));
  process.exit(1);
}

for await (const path of new Bun.Glob(`${layout.outdir}/**/*.d.ts`).scan('.')) {
  if (!isPublicDeclarationOutput(path, layout)) await Bun.file(path).delete();
}
// tsc names a declaration after its source directory relative to rootDir, so an entry that
// lives in a subdirectory is emitted into one; the package exposes both at the outdir root.
layout.emitted.declarations
  .filter((declaration) => posix.dirname(declaration) !== '.')
  .forEach((declaration) => {
    renameSync(join(layout.outdir, declaration), join(layout.outdir, posix.basename(declaration)));
  });

const schemaResult = Bun.spawnSync(['bun', 'run', 'build:schema', ...process.argv.slice(2)]);
if (schemaResult.exitCode !== 0) {
  console.error(formatSubprocessFailure('build:schema', schemaResult));
  process.exit(1);
}

await Bun.$`chmod 755 ${layout.outdir}/bin/cc-safety-net.js`;
await verifyBuildArtifacts(layout);
const { indexOutput, binOutput, piOutput } = getBundledOutputs(result.outputs, layout);
if (!indexOutput || !binOutput || !piOutput) {
  console.error('Build verification failed: expected bundled outputs not found');
  process.exit(1);
}
console.log(
  `  ${layout.outdir}/index.js              ${(statSync(`${layout.outdir}/index.js`).size / 1024).toFixed(2)} KB`,
);
console.log(
  `  ${layout.outdir}/bin/cc-safety-net.js  ${(statSync(`${layout.outdir}/bin/cc-safety-net.js`).size / 1024).toFixed(2)} KB`,
);
console.log(
  `  ${layout.outdir}/pi/index.js           ${(statSync(`${layout.outdir}/pi/index.js`).size / 1024).toFixed(2)} KB`,
);
const ampEntry = `amp/${(await layout.loadArtifacts()).amp.AMP_PLUGIN_ENTRY}`;
console.log(
  `  ${layout.outdir}/${ampEntry}  ${(statSync(`${layout.outdir}/${ampEntry}`).size / 1024).toFixed(2)} KB`,
);
console.log(
  `  ${layout.outdir}/openclaw/cc-safety-net/index.js  ${(statSync(`${layout.outdir}/openclaw/cc-safety-net/index.js`).size / 1024).toFixed(2)} KB`,
);
console.log('  ✓ Build verification passed');
