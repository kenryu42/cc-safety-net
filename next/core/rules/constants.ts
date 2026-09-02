/** Git global options that consume the following token as their value. */
export const GIT_GLOBAL_OPTS_WITH_VALUE: ReadonlySet<string> = new Set([
  '-c',
  '-C',
  '--git-dir',
  '--work-tree',
  '--namespace',
  '--super-prefix',
  '--config-env',
]);
