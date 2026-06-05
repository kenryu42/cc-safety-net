import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/index.ts!', 'src/bin/cc-safety-net.ts!', 'src/pi/index.ts!'],
  project: ['src/**/*.ts!'],
  ignoreBinaries: ['gh', 'tsc'],
  ignoreDependencies: ['lint-staged'],
};

export default config;
