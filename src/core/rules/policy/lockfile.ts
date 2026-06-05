import { existsSync, readFileSync } from 'node:fs';
import type { GitHubRulebookLockEntry, RulebookLockEntry, RulesLockfile } from './types';

const SHA256_DIGEST_PATTERN = /^sha256:[a-f0-9]{64}$/;
const RULEBOOK_SOURCE_KINDS = new Set(['local-directory', 'github']);

export function readLockfile(path: string): { lock: RulesLockfile | null; errors: string[] } {
  if (!existsSync(path)) {
    return { lock: null, errors: [] };
  }
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf-8')) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return { lock: null, errors: [`malformed lockfile ${path}: must be an object`] };
    }
    const lock = parsed as Record<string, unknown>;
    if (lock.version !== 1 || !Array.isArray(lock.rulebooks)) {
      return { lock: null, errors: [`malformed lockfile ${path}`] };
    }
    const parsedEntries = lock.rulebooks.map((entry, index) =>
      parseLockEntry(entry, `${path}: rulebooks[${index}]`),
    );
    const entryErrors = parsedEntries.flatMap((entry) => entry.errors);
    if (entryErrors.length > 0) {
      return { lock: null, errors: [`malformed lockfile ${path}`, ...entryErrors] };
    }
    return {
      lock: {
        version: 1,
        rulebooks: parsedEntries.flatMap((entry) => (entry.entry ? [entry.entry] : [])),
      },
      errors: [],
    };
  } catch (error) {
    return {
      lock: null,
      errors: [
        `malformed lockfile ${path}: ${error instanceof Error ? error.message : String(error)}`,
      ],
    };
  }
}

function parseLockEntry(
  entry: unknown,
  prefix: string,
): { entry: RulebookLockEntry | null; errors: string[] } {
  if (!entry || typeof entry !== 'object') {
    return { entry: null, errors: [`${prefix}: must be an object`] };
  }
  const candidate = entry as Record<string, unknown>;
  const errors = [
    ...validateRequiredString(candidate, prefix, 'spec'),
    ...validateRequiredString(candidate, prefix, 'name'),
    ...validateRequiredString(candidate, prefix, 'version'),
    ...validateDigest(candidate, prefix),
    ...validateKind(candidate, prefix),
    ...validateKindFields(candidate, prefix),
  ];
  if (errors.length > 0) return { entry: null, errors };

  if (candidate.kind === 'local-directory') {
    return {
      entry: {
        spec: requiredString(candidate, 'spec'),
        kind: 'local-directory',
        path: requiredString(candidate, 'path'),
        name: requiredString(candidate, 'name'),
        version: requiredString(candidate, 'version'),
        digest: requiredString(candidate, 'digest'),
      },
      errors: [],
    };
  }

  const githubEntry: GitHubRulebookLockEntry = {
    spec: requiredString(candidate, 'spec'),
    kind: 'github',
    owner: requiredString(candidate, 'owner'),
    repo: requiredString(candidate, 'repo'),
    ref: requiredString(candidate, 'ref'),
    commit: requiredString(candidate, 'commit'),
    path: requiredString(candidate, 'path'),
    name: requiredString(candidate, 'name'),
    version: requiredString(candidate, 'version'),
    digest: requiredString(candidate, 'digest'),
  };
  return {
    entry:
      typeof candidate.display_ref === 'string' && candidate.display_ref !== ''
        ? { ...githubEntry, display_ref: candidate.display_ref }
        : githubEntry,
    errors: [],
  };
}

function validateRequiredString(
  candidate: Record<string, unknown>,
  prefix: string,
  field: string,
): string[] {
  return typeof candidate[field] === 'string' && candidate[field].trim() !== ''
    ? []
    : [`${prefix}.${field}: required string`];
}

function validateDigest(candidate: Record<string, unknown>, prefix: string): string[] {
  return typeof candidate.digest === 'string' && SHA256_DIGEST_PATTERN.test(candidate.digest)
    ? []
    : [`${prefix}.digest: required sha256 digest`];
}

function validateKind(candidate: Record<string, unknown>, prefix: string): string[] {
  if (typeof candidate.kind !== 'string') {
    return [`${prefix}.kind: required string`];
  }
  return RULEBOOK_SOURCE_KINDS.has(candidate.kind)
    ? []
    : [`${prefix}.kind: unknown kind "${candidate.kind}"`];
}

function validateKindFields(candidate: Record<string, unknown>, prefix: string): string[] {
  if (candidate.kind === 'local-directory') {
    return validateRequiredString(candidate, prefix, 'path');
  }
  if (candidate.kind === 'github') {
    return ['owner', 'repo', 'ref', 'commit', 'path'].flatMap((field) =>
      validateRequiredString(candidate, prefix, field),
    );
  }
  return [];
}

function requiredString(candidate: Record<string, unknown>, field: string): string {
  const value = candidate[field];
  if (typeof value !== 'string') {
    throw new Error(`Expected ${field} to be validated before reading`);
  }
  return value;
}
