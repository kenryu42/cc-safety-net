import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/index.ts!', 'src/bin/cc-safety-net.ts!', 'src/pi/index.ts!'],
  project: ['src/**/*.ts!'],
  ignoreBinaries: ['gh', 'tsc'],
  ignoreDependencies: ['lint-staged'],
  ignoreIssues: {
    'src/bin/hook/common.ts': ['exports'],
    'src/bin/rule/format.ts': ['exports'],
    'src/pi/builtin-commands/commands.ts': ['exports'],
    'src/pi/tool-call.ts': ['exports'],
    'src/core/analyze/parallel.ts': ['exports'],
    'src/core/analyze/xargs.ts': ['exports'],
    'src/core/env.ts': ['exports'],
    'src/core/git/env.ts': ['exports'],
    'src/core/rules/policy/index.ts': ['exports', 'types'],
    'src/core/rules/policy/paths.ts': ['exports'],
    'src/core/rules/policy/scope-policy.ts': ['exports'],
    'src/core/rules/policy/sync.ts': ['exports'],
    'src/core/rules/policy/types.ts': ['types'],
    'src/core/rules/rulebook.ts': ['exports', 'types'],
  },
};

export default config;
