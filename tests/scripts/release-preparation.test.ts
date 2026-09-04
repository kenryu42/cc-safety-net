import { describe, expect, test } from 'bun:test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { updateReleaseManifests } from '../../scripts/prepare-release-files';
import { withTempDir } from '../helpers';

describe('release file preparation', () => {
  test('updates package and all repository plugin versions together', async () => {
    await withTempDir('cc-safety-net-prepare-', (directory) => {
      mkdirSync(join(directory, '.claude-plugin'));
      mkdirSync(join(directory, '.codex-plugin'));
      writeFileSync(join(directory, 'package.json'), '{"name":"fixture","version":"1.0.0"}\n');
      writeFileSync(
        join(directory, '.claude-plugin', 'plugin.json'),
        '{"name":"fixture","version":"1.0.0"}\n',
      );
      writeFileSync(
        join(directory, '.codex-plugin', 'plugin.json'),
        '{"name":"fixture","version":"1.0.0"}\n',
      );
      writeFileSync(join(directory, 'kimi.plugin.json'), '{"name":"fixture","version":"1.0.0"}\n');

      updateReleaseManifests(directory, '2.0.0');

      expect(JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8')).version).toBe(
        '2.0.0',
      );
      expect(
        JSON.parse(readFileSync(join(directory, '.claude-plugin', 'plugin.json'), 'utf8')).version,
      ).toBe('2.0.0');
      expect(
        JSON.parse(readFileSync(join(directory, '.codex-plugin', 'plugin.json'), 'utf8')).version,
      ).toBe('2.0.0');
      expect(JSON.parse(readFileSync(join(directory, 'kimi.plugin.json'), 'utf8')).version).toBe(
        '2.0.0',
      );
    });
  });

  test('changes only the version and keeps the committed formatting', async () => {
    await withTempDir('cc-safety-net-prepare-', (directory) => {
      mkdirSync(join(directory, '.claude-plugin'));
      mkdirSync(join(directory, '.codex-plugin'));
      // Biome collapses short arrays onto one line; a reserialized manifest would expand
      // them and the release commit would then fail biome ci on the tag.
      const formatted =
        '{\n  "name": "fixture",\n  "version": "1.0.0",\n  "keywords": ["kimi-code", "security"]\n}\n';
      writeFileSync(join(directory, 'package.json'), formatted);
      writeFileSync(join(directory, '.claude-plugin', 'plugin.json'), formatted);
      writeFileSync(join(directory, '.codex-plugin', 'plugin.json'), formatted);
      writeFileSync(join(directory, 'kimi.plugin.json'), formatted);

      updateReleaseManifests(directory, '2.0.0');

      expect(readFileSync(join(directory, 'kimi.plugin.json'), 'utf8')).toBe(
        formatted.replace('"version": "1.0.0"', '"version": "2.0.0"'),
      );
      expect(readFileSync(join(directory, '.codex-plugin', 'plugin.json'), 'utf8')).toBe(
        formatted.replace('"version": "1.0.0"', '"version": "2.0.0"'),
      );
    });
  });

  test('includes the Codex manifest in the prepared release artifact', () => {
    const workflow = readFileSync(
      join(import.meta.dir, '..', '..', '.github', 'workflows', 'prepare-release.yml'),
      'utf8',
    );
    const artifactCommand = workflow
      .split('\n')
      .find((line) => line.includes('tar -czf "$RUNNER_TEMP/prepared-release.tgz"'));

    expect(artifactCommand?.split(' ')).toContain('.codex-plugin/plugin.json');
  });
});
