import { describe, expect, test } from 'bun:test';
import { cpSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import pkg from '../../package.json';
import { buildPackageTarball } from '../../scripts/verify-package';
import { withTempDir } from '../helpers';

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
      const packedManifest = Bun.spawnSync(
        ['tar', '-xOf', result.tarball, 'package/package.json'],
        { stdout: 'pipe', stderr: 'pipe' },
      );

      expect(packedManifest.exitCode).toBe(0);
      const manifest = JSON.parse(packedManifest.stdout.toString());
      expect(manifest.gitHead).toBe(gitHead);
      expect(manifest.scripts.prepare).toBeUndefined();
    });
  }, 90_000);

  test('the repository source installs outside a git checkout', async () => {
    await withTempDir('cc-safety-net-source-install-', (directory) => {
      cpSync('package.json', join(directory, 'package.json'));
      cpSync('bun.lock', join(directory, 'bun.lock'));
      const result = Bun.spawnSync(
        [process.execPath, 'install', '--production', '--frozen-lockfile'],
        { cwd: directory, stdout: 'pipe', stderr: 'pipe' },
      );

      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toMatchObject({
        exitCode: 0,
      });
    });
  }, 90_000);

  test('reads the tarball from npm 12 pack output keyed by package name', async () => {
    await withTempDir('cc-safety-net-release-pack-', async (directory) => {
      const result = await buildPackageTarball({
        outputDirectory: directory,
        npmCommand: [
          process.execPath,
          '--eval',
          "const packed = Object.values(JSON.parse(Bun.spawnSync(['npm', ...process.argv.slice(1)]).stdout.toString())); process.stdout.write(JSON.stringify(Object.fromEntries(packed.map((entry) => [entry.name, entry]))));",
        ],
      });
      expect(result.tarball).toBe(join(directory, `cc-safety-net-${pkg.version}.tgz`));
    });
  }, 90_000);
});
