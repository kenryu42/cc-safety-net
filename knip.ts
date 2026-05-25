import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/index.ts!', 'src/bin/cc-safety-net.ts!', 'scripts/**/*.ts'],
  project: ['src/**/*.ts!', 'scripts/**/*.ts!'],
  ignore: ['src/opencode/builtin-commands/templates/cc-safety-net.ts'],
  ignoreIssues: {
    'src/bin/hook/common.ts': ['exports'],
    'src/bin/rule/format.ts': ['exports'],
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
