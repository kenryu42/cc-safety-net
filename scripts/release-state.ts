const STABLE_SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function assertReleaseVersion(version: string): string {
  if (STABLE_SEMVER.test(version)) return version;
  throw new Error(`Release version must be a stable semantic version: ${version}`);
}

interface ReleaseStateInput {
  requestedVersion: string;
  packageVersion: string;
  pluginVersion: string;
  codexVersion: string;
  kimiVersion: string;
  headCommit: string;
  tagCommit: string | null;
  npmCommit: string | null;
}

export function classifyReleaseState(input: ReleaseStateInput) {
  assertReleaseVersion(input.requestedVersion);
  if (
    input.packageVersion !== input.pluginVersion ||
    input.packageVersion !== input.codexVersion ||
    input.packageVersion !== input.kimiVersion
  ) {
    throw new Error('Release manifest version files disagree');
  }
  if (!input.tagCommit) {
    if (input.npmCommit) {
      throw new Error(
        `npm version already exists at ${input.npmCommit} without the requested immutable tag`,
      );
    }
    if (input.packageVersion === input.requestedVersion) {
      throw new Error('Release version is already recorded without its immutable tag');
    }
    return { kind: 'prepare' } as const;
  }
  if (input.packageVersion !== input.requestedVersion) {
    throw new Error('Requested version has an immutable tag for a different version state');
  }
  if (input.tagCommit !== input.headCommit) {
    throw new Error('Existing immutable tag does not identify the current release commit');
  }
  if (input.npmCommit && input.npmCommit !== input.tagCommit) {
    throw new Error('Published package identity does not match the immutable tag');
  }
  if (input.npmCommit) return { kind: 'published', commit: input.tagCommit } as const;
  return { kind: 'resume', commit: input.tagCommit } as const;
}
