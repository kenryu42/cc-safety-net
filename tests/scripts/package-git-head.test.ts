import { describe, expect, test } from 'bun:test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { renderThirdPartyLicenses } from '../../scripts/generate-third-party-licenses';
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

      const packedNotices = Bun.spawnSync(
        ['tar', '-xOf', result.tarball, 'package/THIRD_PARTY_LICENSES.txt'],
        { stdout: 'pipe', stderr: 'pipe' },
      );
      expect(packedNotices.exitCode).toBe(0);
      expect(packedNotices.stdout.toString()).toBe(renderThirdPartyLicenses());
    });
  }, 30_000);
});
