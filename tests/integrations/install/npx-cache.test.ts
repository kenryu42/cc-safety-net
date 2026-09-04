import { describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { clearNpxSafetyNetCache } from '@/integrations/install/npx-cache';
import { withEnv, withTempDir } from '../../helpers';

function writeNpxEntry(cacheDir: string, entry: string, packageName: string) {
  const entryPath = join(cacheDir, '_npx', entry);
  mkdirSync(join(entryPath, 'node_modules', packageName), { recursive: true });
  writeFileSync(join(entryPath, 'node_modules', packageName, 'x.js'), '');
  return entryPath;
}

describe('clearNpxSafetyNetCache', () => {
  test('falls back to ~/.npm when npm_config_cache is unset', async () => {
    await withTempDir('safety-net-npx-cache-', async (homeDir) => {
      const safetyNetEntry = writeNpxEntry(join(homeDir, '.npm'), 'hashA', 'cc-safety-net');
      const otherEntry = writeNpxEntry(join(homeDir, '.npm'), 'hashB', 'other-pkg');

      withEnv({ npm_config_cache: undefined }, () => clearNpxSafetyNetCache(homeDir, 'linux'));

      expect(existsSync(safetyNetEntry)).toBe(false);
      expect(existsSync(otherEntry)).toBe(true);
    });
  });

  test('treats an empty npm_config_cache as unset', async () => {
    await withTempDir('safety-net-npx-cache-empty-', async (homeDir) => {
      const safetyNetEntry = writeNpxEntry(join(homeDir, '.npm'), 'hashA', 'cc-safety-net');

      withEnv({ npm_config_cache: '' }, () => clearNpxSafetyNetCache(homeDir, 'linux'));

      expect(existsSync(safetyNetEntry)).toBe(false);
    });
  });

  test('uses the LOCALAPPDATA npm-cache default on win32', async () => {
    await withTempDir('safety-net-npx-cache-win-', async (homeDir) => {
      const localAppData = join(homeDir, 'local-app-data');
      const winEntry = writeNpxEntry(join(localAppData, 'npm-cache'), 'hashD', 'cc-safety-net');

      withEnv({ npm_config_cache: undefined, LOCALAPPDATA: localAppData }, () =>
        clearNpxSafetyNetCache(homeDir, 'win32'),
      );

      expect(existsSync(winEntry)).toBe(false);
    });
  });

  test('derives the win32 default from home when LOCALAPPDATA is empty or unset', async () => {
    await withTempDir('safety-net-npx-cache-win-home-', async (homeDir) => {
      const winEntry = writeNpxEntry(
        join(homeDir, 'AppData', 'Local', 'npm-cache'),
        'hashE',
        'cc-safety-net',
      );

      withEnv({ npm_config_cache: undefined, LOCALAPPDATA: '' }, () =>
        clearNpxSafetyNetCache(homeDir, 'win32'),
      );

      expect(existsSync(winEntry)).toBe(false);
    });
  });

  test('honors npm_config_cache over the home default', async () => {
    await withTempDir('safety-net-npx-cache-env-', async (homeDir) => {
      const cacheDir = join(homeDir, 'custom-cache');
      const overriddenEntry = writeNpxEntry(cacheDir, 'hashC', 'cc-safety-net');
      const defaultEntry = writeNpxEntry(join(homeDir, '.npm'), 'hashA', 'cc-safety-net');

      withEnv({ npm_config_cache: cacheDir }, () => clearNpxSafetyNetCache(homeDir));

      expect(existsSync(overriddenEntry)).toBe(false);
      expect(existsSync(defaultEntry)).toBe(true);
    });
  });
});
