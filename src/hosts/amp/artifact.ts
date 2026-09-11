export const AMP_MANAGED_HEADER =
  '// cc-safety-net managed Amp plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --amp';

export const AMP_PLUGIN_DIRECTORY = 'cc-safety-net';

export const AMP_PLUGIN_ENTRY = `${AMP_PLUGIN_DIRECTORY}/index.ts`;

export function buildAmpArtifactHeader(version: string): string {
  return `${AMP_MANAGED_HEADER}\n// version: ${version}\n`;
}
