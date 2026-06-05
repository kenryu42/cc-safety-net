import { NAME_PATTERN } from '@/types';
import {
  GITHUB_RULEBOOK_SOURCE_FORMAT,
  getRepositoryRulebookPath,
  RULE_SYNC_COMMAND,
  RULEBOOK_FILE,
  RULES_DIR,
} from './paths';
import type { RulesConfig, RulesLockfile, SyncRulesConfigResult } from './types';

const GITHUB_SOURCE_RE = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;
const GITHUB_REPOSITORY_SOURCE_RE = /^[A-Za-z0-9][A-Za-z0-9_.-]*\/[A-Za-z0-9_.-]+$/;
const GITHUB_REPOSITORY_REF_SOURCE_RE = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#([A-Za-z0-9._-]+)$/;
const GITHUB_REF_PATTERN = /^[A-Za-z0-9._-]+$/;
const RULES_DIR_RE = RULES_DIR.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const RULEBOOK_FILE_RE = RULEBOOK_FILE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const GITHUB_RULEBOOK_PATH_RE = new RegExp(
  `^${RULES_DIR_RE}/(${NAME_PATTERN.source.slice(1, -1)})/${RULEBOOK_FILE_RE}$`,
);

export interface ParsedGitHubSource {
  owner: string;
  repo: string;
  ref: string;
  path: string;
  name: string;
}

export function getRulebookSourceSyntaxError(source: string): string | null {
  if (isGitHubRulebookSource(source)) {
    try {
      parseGitHubSource(source);
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : String(error);
    }
  }
  return NAME_PATTERN.test(source)
    ? null
    : `Local rulebook sources must be bare names matching ${NAME_PATTERN}: ${source}`;
}

export function parseGitHubSource(spec: string): ParsedGitHubSource {
  if (spec.startsWith('github:')) {
    throw new Error(`Invalid rulebook source: ${spec}`);
  }
  const match = spec.match(GITHUB_SOURCE_RE);
  if (!match?.[1] || !match[2] || !match[3]) {
    throw new Error(`Invalid GitHub rulebook source: ${spec}`);
  }
  const [ref, name, ...extraParts] = match[3].split('/');
  if (!ref || !GITHUB_REF_PATTERN.test(ref)) {
    throw new Error(`GitHub rulebook refs must be a single path segment: ${spec}`);
  }
  if (!name || extraParts.length > 0 || !NAME_PATTERN.test(name)) {
    throw new Error(`GitHub rulebook sources must be ${GITHUB_RULEBOOK_SOURCE_FORMAT}: ${spec}`);
  }
  return {
    owner: match[1],
    repo: match[2],
    ref,
    path: getRepositoryRulebookPath(name),
    name,
  };
}

export function isGitHubRepositorySource(source: string): boolean {
  return GITHUB_REPOSITORY_SOURCE_RE.test(source);
}

export function isGitHubRulebookSource(source: string): boolean {
  return GITHUB_SOURCE_RE.test(source);
}

export function assertBareRulebookName(source: string): void {
  if (!NAME_PATTERN.test(source)) {
    throw new Error(
      `Local rulebook sources must be bare names matching ${NAME_PATTERN}: ${source}`,
    );
  }
}

export function getSelectedUpdateSpecs(
  config: RulesConfig,
  lock: RulesLockfile | null,
  match: string,
): { ok: true; specs: string[] } | { ok: false; result: SyncRulesConfigResult } {
  const exactMatches = config.rules.filter((spec) => spec === match);
  if (exactMatches.length > 0) {
    return { ok: true, specs: exactMatches };
  }
  if (!lock) {
    return {
      ok: false,
      result: {
        ok: false,
        errors: [
          `No lockfile available to match rulebook name ${match}; use the exact source or run ${RULE_SYNC_COMMAND}`,
        ],
        warnings: [],
        entries: [],
      },
    };
  }
  const configuredSpecs = new Set(config.rules);
  const nameMatches = lock.rulebooks
    .filter((entry) => entry.name === match && configuredSpecs.has(entry.spec))
    .map((entry) => entry.spec);
  if (nameMatches.length === 1) {
    return { ok: true, specs: nameMatches };
  }
  return noRulebookMatch(match, nameMatches);
}

export function getRemoveMatches(
  rules: string[],
  lock: RulesLockfile | null,
  match: string,
): { ok: true; specs: string[] } | { ok: false; result: SyncRulesConfigResult } {
  const exactMatches = rules.filter((spec) => spec === match);
  if (exactMatches.length > 0) return { ok: true, specs: exactMatches };

  const githubRefMatches = getGitHubRepositoryRefMatches(rules, match);
  if (githubRefMatches.length > 0) return { ok: true, specs: githubRefMatches };

  const githubRepositoryMatches = getGitHubRepositoryMatches(rules, match);
  if (!githubRepositoryMatches.ok) return githubRepositoryMatches;
  if (githubRepositoryMatches.specs.length > 0) {
    return { ok: true, specs: githubRepositoryMatches.specs };
  }

  const nameMatches = lock
    ? rules.filter((spec) => lock.rulebooks.find((entry) => entry.spec === spec)?.name === match)
    : [];
  if (nameMatches.length === 1) return { ok: true, specs: nameMatches };

  return noRulebookMatch(match, nameMatches);
}

function noRulebookMatch(
  match: string,
  nameMatches: string[],
): { ok: false; result: SyncRulesConfigResult } {
  return {
    ok: false,
    result: {
      ok: false,
      errors:
        nameMatches.length === 0
          ? [`No configured rulebook matches ${match}`]
          : [`Ambiguous rulebook match ${match}: ${nameMatches.join(', ')}`],
      warnings: [],
      entries: [],
    },
  };
}

function getGitHubRepositoryRefMatches(rules: string[], match: string): string[] {
  const parsed = match.match(GITHUB_REPOSITORY_REF_SOURCE_RE);
  if (!parsed?.[1] || !parsed[2] || !parsed[3]) return [];
  return rules.filter((spec) => {
    const source = getConfiguredGitHubSource(spec);
    if (!source) return false;
    return source.owner === parsed[1] && source.repo === parsed[2] && source.ref === parsed[3];
  });
}

function getGitHubRepositoryMatches(
  rules: string[],
  match: string,
): { ok: true; specs: string[] } | { ok: false; result: SyncRulesConfigResult } {
  if (!isGitHubRepositorySource(match)) return { ok: true, specs: [] };

  const specs = rules.filter((spec) => {
    const source = getConfiguredGitHubSource(spec);
    if (!source) return false;
    return source.owner === match.split('/')[0] && source.repo === match.split('/')[1];
  });
  const refs = new Set(
    specs.map((spec) => getConfiguredGitHubSource(spec)?.ref).filter((ref): ref is string => !!ref),
  );
  if (refs.size < 2) return { ok: true, specs };

  return {
    ok: false,
    result: {
      ok: false,
      errors: [
        `Multiple refs are configured for ${match}. Use an explicit ref:`,
        `  cc-safety-net rule remove ${match}#<ref>`,
      ],
      warnings: [],
      entries: [],
    },
  };
}

function getConfiguredGitHubSource(
  spec: string,
): { owner: string; repo: string; ref: string } | null {
  try {
    return parseGitHubSource(spec);
  } catch {
    return null;
  }
}
