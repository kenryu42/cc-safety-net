import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { assertValidRulebook, type Rulebook } from '@/core/rules/rulebook';
import { getRulebookCachePath, RULE_SYNC_COMMAND, RULEBOOK_FILE, RULES_DIR } from './paths';
import {
  assertBareRulebookName,
  GITHUB_RULEBOOK_PATH_RE,
  isGitHubRulebookSource,
  parseGitHubSource,
} from './sources';
import type {
  GitHubRulebookLockEntry,
  RulebookLockEntry,
  RulesLockfile,
  RulesPolicyOptions,
  SyncRulesConfigOptions,
} from './types';

export interface ResolvedRulebook {
  entry: RulebookLockEntry;
  rulebook: Rulebook;
  content: string;
}

export interface DiscoveredRulebookSource {
  spec: string;
  display_ref?: string;
}

export async function resolveRulebookSource(
  spec: string,
  configDir: string,
  options: RulesPolicyOptions,
): Promise<ResolvedRulebook> {
  if (isGitHubRulebookSource(spec)) {
    return resolveGitHubRulebook(spec);
  }
  return resolveLocalRulebook(spec, configDir, options);
}

export async function resolveRulebookSourceForSync(
  spec: string,
  configDir: string,
  options: SyncRulesConfigOptions,
  previousLock: RulesLockfile | null,
): Promise<ResolvedRulebook> {
  if (!isGitHubRulebookSource(spec) || options.refresh) {
    return resolveRulebookSource(spec, configDir, options);
  }
  const locked = previousLock?.rulebooks.find((entry) => entry.spec === spec);
  if (!locked || locked.kind !== 'github') {
    return resolveRulebookSource(spec, configDir, options);
  }
  return readLockedGitHubRulebook(locked, configDir, options);
}

export async function discoverGitHubRepositoryRulebooks(
  source: string,
): Promise<DiscoveredRulebookSource[]> {
  const [owner, repo] = source.split('/');
  if (!owner || !repo) {
    throw new Error(`Invalid GitHub repository source: ${source}`);
  }
  const metadataResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (!metadataResponse.ok) {
    throw new Error(`Failed to inspect ${source}: GitHub returned ${metadataResponse.status}`);
  }
  const metadata = (await metadataResponse.json()) as { default_branch?: string };
  if (!metadata.default_branch) {
    throw new Error(`Failed to inspect ${source}: missing default branch`);
  }
  const commit = await resolveGitHubCommit(owner, repo, metadata.default_branch, source);
  const treeResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${commit}?recursive=1`,
  );
  if (!treeResponse.ok) {
    throw new Error(`Failed to inspect ${source}: GitHub tree returned ${treeResponse.status}`);
  }
  const treeJson = (await treeResponse.json()) as {
    tree?: Array<{ path?: string; type?: string }>;
  };
  const names = (treeJson.tree ?? [])
    .flatMap((entry) => {
      if (entry.type !== 'blob' || typeof entry.path !== 'string') return [];
      const match = entry.path.match(GITHUB_RULEBOOK_PATH_RE);
      return match?.[1] ? [match[1]] : [];
    })
    .sort();
  if (names.length === 0) {
    throw new Error(`No rulebooks found in ${source} under ${RULES_DIR}/`);
  }
  return names.map((name) => ({
    spec: `${owner}/${repo}#${commit}/${name}`,
    display_ref: metadata.default_branch,
  }));
}

export function resolveLocalRulebook(
  spec: string,
  configDir: string,
  _options: RulesPolicyOptions,
): ResolvedRulebook {
  assertBareRulebookName(spec);
  const path = getLocalRulebookPath(configDir, spec);
  if (!existsSync(path)) {
    throw new Error(`Rulebook source not found: ${spec}`);
  }
  const content = readFileSync(path, 'utf-8');
  const rulebook = assertValidRulebook(JSON.parse(content));
  if (rulebook.name !== spec) {
    throw new Error(`rulebook name "${rulebook.name}" must match local source "${spec}"`);
  }
  return {
    rulebook,
    content,
    entry: {
      spec,
      kind: 'local-directory',
      path: spec,
      name: rulebook.name,
      version: rulebook.version,
      digest: sha256Digest(content),
    },
  };
}

async function resolveGitHubRulebook(spec: string): Promise<ResolvedRulebook> {
  const parsed = parseGitHubSource(spec);
  const commit = await resolveGitHubCommit(parsed.owner, parsed.repo, parsed.ref, spec);
  const rawResponse = await fetch(
    `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/${commit}/${parsed.path}`,
  );
  if (!rawResponse.ok) {
    throw new Error(`Failed to fetch ${spec}: GitHub raw returned ${rawResponse.status}`);
  }
  const content = await rawResponse.text();
  const rulebook = assertValidRulebook(JSON.parse(content));
  if (rulebook.name !== parsed.name) {
    throw new Error(`rulebook name "${rulebook.name}" must match GitHub source "${parsed.name}"`);
  }
  return {
    rulebook,
    content,
    entry: {
      spec,
      kind: 'github',
      owner: parsed.owner,
      repo: parsed.repo,
      ref: parsed.ref,
      commit,
      path: parsed.path,
      name: rulebook.name,
      version: rulebook.version,
      digest: sha256Digest(content),
    },
  };
}

async function readLockedGitHubRulebook(
  entry: GitHubRulebookLockEntry,
  configDir: string,
  options: RulesPolicyOptions,
): Promise<ResolvedRulebook> {
  const cachePath = getRulebookCachePath(entry, { ...options, cacheConfigDir: configDir });
  if (existsSync(cachePath)) {
    const content = readFileSync(cachePath, 'utf-8');
    if (sha256Digest(content) === entry.digest) {
      return { entry, rulebook: assertRulebookMatchesLockEntry(content, entry), content };
    }
  }
  return fetchLockedGitHubRulebook(entry);
}

async function fetchLockedGitHubRulebook(
  entry: GitHubRulebookLockEntry,
): Promise<ResolvedRulebook> {
  const rawResponse = await fetch(
    `https://raw.githubusercontent.com/${entry.owner}/${entry.repo}/${entry.commit}/${entry.path}`,
  );
  if (!rawResponse.ok) {
    throw new Error(`Failed to restore ${entry.spec}: GitHub raw returned ${rawResponse.status}`);
  }
  const content = await rawResponse.text();
  if (sha256Digest(content) !== entry.digest) {
    throw new Error(`locked GitHub digest mismatch for ${entry.spec}; run ${RULE_SYNC_COMMAND}`);
  }
  return { entry, rulebook: assertRulebookMatchesLockEntry(content, entry), content };
}

function assertRulebookMatchesLockEntry(content: string, entry: GitHubRulebookLockEntry): Rulebook {
  const rulebook = assertValidRulebook(JSON.parse(content));
  if (rulebook.name !== entry.name) {
    throw new Error(`rulebook name "${rulebook.name}" must match lock entry "${entry.name}"`);
  }
  return rulebook;
}

async function resolveGitHubCommit(
  owner: string,
  repo: string,
  ref: string,
  source: string,
): Promise<string> {
  const commitResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits/${encodeURIComponent(ref)}`,
  );
  if (!commitResponse.ok) {
    throw new Error(`Failed to resolve ${source}: GitHub returned ${commitResponse.status}`);
  }
  const commitJson = (await commitResponse.json()) as { sha?: string };
  if (!commitJson.sha) {
    throw new Error(`Failed to resolve commit for ${source}`);
  }
  return commitJson.sha;
}

function getLocalRulebookPath(configDir: string, name: string): string {
  return join(configDir, name, RULEBOOK_FILE);
}

export function sha256Digest(content: string): string {
  return `sha256:${createHash('sha256').update(content).digest('hex')}`;
}
