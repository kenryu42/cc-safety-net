import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    'src/index.ts!',
    'src/api.ts!',
    'src/cli/cc-safety-net.ts!',
    'src/integrations/pi/index.ts!',
    'src/integrations/amp/index.ts!',
    'src/integrations/openclaw/index.ts!',
    // Built for the browser by src/gui/assets.ts, so no module imports it.
    'src/gui/frontend/main.ts!',
    'next/entries/bin.ts!',
    'next/entries/index.ts!',
    'next/entries/api.ts!',
    'next/entries/pi.ts!',
    'next/entries/amp.ts!',
    'next/entries/openclaw.ts!',
    // Built for the browser by next/gui/assets.ts, so no module imports it.
    'next/gui/frontend/main.ts!',
    // Test-only differential harness that Phase 11 deletes with its tests.
    'next/gate/evaluate-command.ts!',
    // scripts invoked directly by package.json scripts or GitHub workflows
    'scripts/build.ts!',
    'scripts/build-schema.ts!',
    'scripts/prepare-release-files.ts!',
    'scripts/release-assets.ts!',
    'scripts/release-transaction.ts!',
    'scripts/verify-coverage.ts!',
    'scripts/verify-package.ts!',
    'scripts/verify-repository-plugin.ts!',
  ],
  project: ['src/**/*.ts!', 'next/**/*.ts!', 'scripts/**/*.ts!'],
  // Workflow-invoked scripts are declared in `entry` above; the plugin would
  // re-claim them as dev-only entries and hide their imports from --production.
  'github-actions': false,
  ignoreBinaries: ['gh', 'tsc'],
  ignoreDependencies: ['@opencode-ai/plugin'],
};

export default config;
