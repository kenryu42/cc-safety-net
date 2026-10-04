import { describe, expect, test } from 'bun:test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildPackageTarball } from '../../scripts/verify-package';
import { withTempDir } from '../helpers';

function readPackedManifest(tarball: string) {
  const packedManifest = Bun.spawnSync(['tar', '-xOf', tarball, 'package/package.json'], {
    stdout: 'pipe',
    stderr: 'pipe',
  });
  expect(packedManifest.exitCode).toBe(0);
  return JSON.parse(packedManifest.stdout.toString()) as {
    gitHead?: string;
    scripts?: Record<string, unknown>;
  };
}

const NPM_OBJECT_OUTPUT = `
import { cpSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const staging = args[args.indexOf('pack') + 1];
const destination = args[args.indexOf('--pack-destination') + 1];
const stagingRoot = join(destination, 'package-root');
const packageRoot = join(stagingRoot, 'package');
mkdirSync(packageRoot, { recursive: true });
cpSync(staging, packageRoot, { recursive: true });
const filename = 'cc-safety-net-0.0.0.tgz';
Bun.spawnSync(['tar', '-czf', join(destination, filename), '-C', stagingRoot, 'package']);
process.stdout.write(
  JSON.stringify({ 'cc-safety-net': { filename, size: statSync(join(destination, filename)).size, files: [] } }),
);
`;

describe('release package identity', () => {
  test('npm preserves the tag commit without repository lifecycle hooks', async () => {
    await withTempDir('cc-safety-net-release-pack-', async (directory) => {
      const outputDirectory = join(directory, 'output');
      mkdirSync(outputDirectory);
      const gitHead = '0123456789abcdef0123456789abcdef01234567';
      const result = await buildPackageTarball({
        outputDirectory,
        gitHead,
      });
      const manifest = readPackedManifest(result.tarball);
      expect(manifest.gitHead).toBe(gitHead);
      expect(manifest.scripts?.prepare).toBeUndefined();
    });
  }, 90_000);

  test('reads the artifact from npm 12 object-shaped pack output', async () => {
    await withTempDir('cc-safety-net-release-pack-object-', async (directory) => {
      const outputDirectory = join(directory, 'output');
      mkdirSync(outputDirectory);
      const fakeNpm = join(directory, 'fake-npm.ts');
      writeFileSync(fakeNpm, NPM_OBJECT_OUTPUT);
      const gitHead = '0123456789abcdef0123456789abcdef01234567';
      const result = await buildPackageTarball({
        outputDirectory,
        gitHead,
        npmCommand: [process.execPath, fakeNpm],
      });
      expect(readPackedManifest(result.tarball).gitHead).toBe(gitHead);
    });
  }, 90_000);
});
