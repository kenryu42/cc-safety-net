export const GIT_CONTEXT_ENV_OVERRIDES = [
  'GIT_DIR',
  'GIT_WORK_TREE',
  'GIT_COMMON_DIR',
  'GIT_INDEX_FILE',
] as const;

const GIT_CONTEXT_ENV_OVERRIDE_NAMES: ReadonlySet<string> = new Set(GIT_CONTEXT_ENV_OVERRIDES);

/** @internal - exported for test coverage */
export const GIT_CONFIG_AFFECTING_ENV_NAMES: ReadonlySet<string> = new Set([
  'GIT_CONFIG_GLOBAL',
  'GIT_CONFIG_NOSYSTEM',
  'GIT_CONFIG_SYSTEM',
  'HOME',
  'XDG_CONFIG_HOME',
]);

/** @internal - exported for test coverage */
export const GIT_SSH_ENV_NAMES: ReadonlySet<string> = new Set([
  'GIT_SSH_COMMAND',
  'GIT_SSH',
  'GIT_SSH_VARIANT',
]);

const GIT_CONTEXT_APPEND_ASSIGNMENT_RE = /^([A-Za-z_][A-Za-z0-9_]*)\+=/;

/** @internal - exported for test coverage */
export function isGitContextEnvOverrideName(name: string): boolean {
  return GIT_CONTEXT_ENV_OVERRIDE_NAMES.has(name);
}

export function isGitConfigEnvName(name: string): boolean {
  return (
    name === 'GIT_CONFIG_COUNT' ||
    name === 'GIT_CONFIG_PARAMETERS' ||
    /^GIT_CONFIG_(KEY|VALUE)_\d+$/.test(name)
  );
}

export function isTrackedGitEnvName(name: string): boolean {
  return (
    isGitContextEnvOverrideName(name) ||
    GIT_CONFIG_AFFECTING_ENV_NAMES.has(name) ||
    GIT_SSH_ENV_NAMES.has(name) ||
    isGitConfigEnvName(name)
  );
}

export function parseGitContextAppendEnvAssignment(
  token: string,
): { name: string; value: string } | null {
  const match = token.match(GIT_CONTEXT_APPEND_ASSIGNMENT_RE);
  const name = match?.[1];
  if (!name || !isTrackedGitEnvName(name)) {
    return null;
  }
  const eqIdx = token.indexOf('=');
  return { name, value: token.slice(eqIdx + 1) };
}

export function hasGitSshEnvAssignment(envAssignments?: ReadonlyMap<string, string>): boolean {
  if (!envAssignments) {
    return false;
  }
  for (const key of envAssignments.keys()) {
    if (GIT_SSH_ENV_NAMES.has(key)) {
      return true;
    }
  }
  return false;
}

export function hasConfigAffectingEnvAssignment(
  envAssignments?: ReadonlyMap<string, string>,
): boolean {
  if (!envAssignments) {
    return false;
  }
  for (const key of envAssignments.keys()) {
    if (GIT_CONFIG_AFFECTING_ENV_NAMES.has(key)) {
      return true;
    }
  }
  return false;
}
