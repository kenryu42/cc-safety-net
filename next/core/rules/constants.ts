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

export const COMMAND_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
export const MAX_REASON_LENGTH = 256;

/** Shell wrappers that need recursive analysis */
export const SHELL_WRAPPERS = new Set(['bash', 'sh', 'zsh', 'ksh', 'dash', 'fish', 'csh', 'tcsh']);

/** Interpreters that can execute code */
export const INTERPRETERS = new Set(['python', 'python3', 'python2', 'node', 'ruby', 'perl']);
export const PYTHON_INTERPRETER_PATTERN = /^python(?:[23](?:\.\d+)*)?$/;

export const AWK_INTERPRETERS = new Set(['awk', 'gawk', 'nawk', 'mawk']);
