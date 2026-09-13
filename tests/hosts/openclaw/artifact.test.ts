import { describe, expect, test } from 'bun:test';
import {
  buildOpenClawArtifactHeader,
  buildOpenClawPluginManifests,
  OPENCLAW_MANAGED_HEADER,
  OPENCLAW_PLUGIN_ENTRY,
  OPENCLAW_PLUGIN_ENTRY_FILE,
  OPENCLAW_PLUGIN_ID,
  OPENCLAW_PLUGIN_MANIFEST_FILE,
  OPENCLAW_PLUGIN_PACKAGE_FILE,
} from '@/hosts/openclaw/artifact';

const DESCRIPTION =
  'Block destructive commands and secret-file access before OpenClaw runs a tool.';

describe('the OpenClaw plugin artifact', () => {
  test.each(['dev', '1.2.3'])('builds the shipped metadata files at version %s', (version) => {
    const manifests = buildOpenClawPluginManifests(version);

    expect(manifests.map((manifest) => manifest.name)).toEqual([
      'openclaw.plugin.json',
      'package.json',
    ]);
    expect(manifests.map((manifest) => JSON.parse(manifest.content))).toEqual([
      {
        id: 'cc-safety-net',
        name: 'CC Safety Net',
        description: DESCRIPTION,
        version,
        activation: { onStartup: true },
        configSchema: { type: 'object', additionalProperties: false, properties: {} },
      },
      {
        name: 'cc-safety-net',
        version,
        description: DESCRIPTION,
        type: 'module',
        openclaw: { extensions: [`./${OPENCLAW_PLUGIN_ENTRY_FILE}`] },
      },
    ]);
    for (const manifest of manifests) {
      expect(manifest.content).toBe(`${JSON.stringify(JSON.parse(manifest.content), null, 2)}\n`);
    }
  });

  test('stamps the runtime entry the way the build does', () => {
    expect(buildOpenClawArtifactHeader('1.2.3')).toBe(
      `${OPENCLAW_MANAGED_HEADER}\n// version: 1.2.3\n`,
    );
  });

  test('names the same plugin OpenClaw was told to load', () => {
    expect(OPENCLAW_PLUGIN_ID).toBe('cc-safety-net');
    expect(OPENCLAW_PLUGIN_ENTRY_FILE).toBe('index.js');
    expect(OPENCLAW_PLUGIN_MANIFEST_FILE).toBe('openclaw.plugin.json');
    expect(OPENCLAW_PLUGIN_PACKAGE_FILE).toBe('package.json');
    expect(OPENCLAW_MANAGED_HEADER).toBe(
      '// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw',
    );
    expect(OPENCLAW_PLUGIN_ENTRY).toEqual({
      id: 'cc-safety-net',
      name: 'CC Safety Net',
      description: DESCRIPTION,
    });
  });
});
