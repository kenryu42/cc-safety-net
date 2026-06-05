#!/usr/bin/env bun
/**
 * Build script that injects __PKG_VERSION__ at compile time
 * to avoid embedding the full package.json in the bundle.
 */

import pkg from '../package.json';
import { getBundledOutputs } from './build-output';
import { formatSubprocessFailure } from './subprocess-output';

const result = await Bun.build({
  entrypoints: ['src/index.ts', 'src/bin/cc-safety-net.ts', 'src/pi/index.ts'],
  outdir: 'dist',
  target: 'node',
  define: {
    __PKG_VERSION__: JSON.stringify(pkg.version),
  },
});

if (!result.success) {
  console.error('Build failed:');
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

// Run build:types and build:schema
const typesResult = Bun.spawnSync(['bun', 'run', 'build:types']);
if (typesResult.exitCode !== 0) {
  console.error(formatSubprocessFailure('build:types', typesResult));
  process.exit(1);
}

const schemaResult = Bun.spawnSync(['bun', 'run', 'build:schema']);
if (schemaResult.exitCode !== 0) {
  console.error(formatSubprocessFailure('build:schema', schemaResult));
  process.exit(1);
}

// Verify expected output files exist
const expectedFiles = [
  'dist/index.js',
  'dist/index.d.ts',
  'dist/bin/cc-safety-net.js',
  'dist/pi/index.js',
  'dist/pi/index.d.ts',
];
for (const file of expectedFiles) {
  if (!(await Bun.file(file).exists())) {
    console.error(`Build verification failed: ${file} not found`);
    process.exit(1);
  }
}
const { indexOutput, binOutput, piOutput } = getBundledOutputs(result.outputs);
if (!indexOutput || !binOutput || !piOutput) {
  console.error('Build verification failed: expected bundled outputs not found');
  process.exit(1);
}
console.log(`  dist/index.js              ${(indexOutput.size / 1024).toFixed(2)} KB`);
console.log(`  dist/bin/cc-safety-net.js  ${(binOutput.size / 1024).toFixed(2)} KB`);
console.log(`  dist/pi/index.js           ${(piOutput.size / 1024).toFixed(2)} KB`);
console.log('  ✓ Build verification passed');
