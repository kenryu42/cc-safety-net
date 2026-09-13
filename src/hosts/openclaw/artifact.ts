export const OPENCLAW_PLUGIN_ID = 'cc-safety-net';

export const OPENCLAW_PLUGIN_ENTRY_FILE = 'index.js';

export const OPENCLAW_PLUGIN_MANIFEST_FILE = 'openclaw.plugin.json';

export const OPENCLAW_PLUGIN_PACKAGE_FILE = 'package.json';

const OPENCLAW_PLUGIN_NAME = 'CC Safety Net';
const OPENCLAW_PLUGIN_DESCRIPTION =
  'Block destructive commands and secret-file access before OpenClaw runs a tool.';

export const OPENCLAW_MANAGED_HEADER =
  '// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw';

export function buildOpenClawArtifactHeader(version: string): string {
  return `${OPENCLAW_MANAGED_HEADER}\n// version: ${version}\n`;
}

export const OPENCLAW_PLUGIN_ENTRY = {
  id: OPENCLAW_PLUGIN_ID,
  name: OPENCLAW_PLUGIN_NAME,
  description: OPENCLAW_PLUGIN_DESCRIPTION,
};

export function buildOpenClawPluginManifests(
  version: string,
): readonly { name: string; content: string }[] {
  return [
    {
      name: OPENCLAW_PLUGIN_MANIFEST_FILE,
      content: `${JSON.stringify(
        {
          ...OPENCLAW_PLUGIN_ENTRY,
          version,

          activation: { onStartup: true },
          configSchema: { type: 'object', additionalProperties: false, properties: {} },
        },
        null,
        2,
      )}\n`,
    },
    {
      name: OPENCLAW_PLUGIN_PACKAGE_FILE,
      content: `${JSON.stringify(
        {
          name: OPENCLAW_PLUGIN_ID,
          version,
          description: OPENCLAW_PLUGIN_DESCRIPTION,
          type: 'module',
          openclaw: { extensions: [`./${OPENCLAW_PLUGIN_ENTRY_FILE}`] },
        },
        null,
        2,
      )}\n`,
    },
  ];
}
