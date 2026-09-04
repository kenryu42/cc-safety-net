#!/usr/bin/env bun

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { assertExactReleaseBase, pushReleaseAtomically } from './release-git';
import { assertReleaseVersion, classifyReleaseState } from './release-state';

const RELEASE_PATHS = [
  'package.json',
  '.claude-plugin/plugin.json',
  '.codex-plugin/plugin.json',
  'kimi.plugin.json',
  'assets/cc-safety-net.schema.json',
  'dist',
] as const;

function runGit(cwd: string, args: string[], allowFailure = false) {
  const result = Bun.spawnSync(['git', ...args], { cwd, stdout: 'pipe', stderr: 'pipe' });
  if (result.exitCode === 0 || allowFailure) return result;
  throw new Error(result.stderr.toString().trim() || `git ${args[0]} failed`);
}

function argument(name: string): string {
  const index = process.argv.indexOf(name);
  const value = index === -1 ? undefined : process.argv[index + 1];
  if (value) return value;
  throw new Error(`${name} is required`);
}

function manifestVersion(path: string): string {
  const version = (JSON.parse(readFileSync(path, 'utf8')) as { version?: unknown }).version;
  if (typeof version === 'string') return version;
  throw new Error(`${path} has no string version`);
}

function committedManifestVersion(cwd: string, path: string): string {
  const result = runGit(cwd, ['show', `HEAD:${path}`]);
  const version = (JSON.parse(result.stdout.toString()) as { version?: unknown }).version;
  if (typeof version === 'string') return version;
  throw new Error(`Committed ${path} has no string version`);
}

function changedReleasePaths(cwd: string): string[] {
  return runGit(cwd, ['status', '--porcelain'])
    .stdout.toString()
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => line.slice(3).split(' -> ').at(-1) ?? '')
    .map((path) => path.replaceAll('\\', '/'));
}

function isReleasePath(path: string): boolean {
  return RELEASE_PATHS.some((allowed) => path === allowed || path.startsWith(`${allowed}/`));
}

async function lookupNpmCommit(
  packageName: string,
  version: string,
  registryUrl: string,
): Promise<string | null> {
  const base = registryUrl.endsWith('/') ? registryUrl : `${registryUrl}/`;
  const response = await fetch(new URL(`${encodeURIComponent(packageName)}/${version}`, base));
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`npm registry returned ${response.status}`);
  const metadata = (await response.json()) as { gitHead?: unknown };
  return typeof metadata.gitHead === 'string' && metadata.gitHead !== ''
    ? metadata.gitHead
    : 'missing-gitHead';
}

export async function runReleaseTransaction(options: {
  cwd: string;
  version: string;
  expectedBase: string;
  registryUrl: string;
  dryRun: boolean;
}) {
  const version = assertReleaseVersion(options.version);
  const tag = `v${version}`;
  await assertExactReleaseBase(options.cwd, options.expectedBase);
  const workingPackageVersion = manifestVersion(resolve(options.cwd, 'package.json'));
  const workingPluginVersion = manifestVersion(
    resolve(options.cwd, '.claude-plugin', 'plugin.json'),
  );
  const workingCodexPluginVersion = manifestVersion(
    resolve(options.cwd, '.codex-plugin', 'plugin.json'),
  );
  if (
    workingPackageVersion !== version ||
    workingPluginVersion !== version ||
    workingCodexPluginVersion !== version ||
    manifestVersion(resolve(options.cwd, 'kimi.plugin.json')) !== version
  ) {
    throw new Error(`Prepared manifests must all contain ${version}`);
  }
  const changedPaths = changedReleasePaths(options.cwd);
  const unexpectedPaths = changedPaths.filter((path) => !isReleasePath(path));
  if (unexpectedPaths.length > 0) {
    throw new Error(`Unexpected release changes: ${unexpectedPaths.join(', ')}`);
  }
  const headCommit = runGit(options.cwd, ['rev-parse', 'HEAD']).stdout.toString().trim();
  const tagResult = runGit(
    options.cwd,
    ['rev-parse', '--verify', `refs/tags/${tag}^{commit}`],
    true,
  );
  const tagCommit = tagResult.exitCode === 0 ? tagResult.stdout.toString().trim() : null;
  const packageName = (
    JSON.parse(readFileSync(resolve(options.cwd, 'package.json'), 'utf8')) as {
      name?: unknown;
    }
  ).name;
  if (typeof packageName !== 'string' || packageName === '') {
    throw new Error('package.json has no package name');
  }
  const npmCommit = await lookupNpmCommit(packageName, version, options.registryUrl);
  const state = classifyReleaseState({
    requestedVersion: version,
    packageVersion: committedManifestVersion(options.cwd, 'package.json'),
    pluginVersion: committedManifestVersion(options.cwd, '.claude-plugin/plugin.json'),
    codexVersion: committedManifestVersion(options.cwd, '.codex-plugin/plugin.json'),
    kimiVersion: committedManifestVersion(options.cwd, 'kimi.plugin.json'),
    headCommit,
    tagCommit,
    npmCommit,
  });
  if (state.kind !== 'prepare') {
    if (changedPaths.length > 0) throw new Error('A resumed release must have a clean worktree');
    return state;
  }
  if (changedPaths.length === 0) throw new Error('Prepared release has no versioned changes');
  if (options.dryRun) return state;

  const paths = RELEASE_PATHS.filter((path) => existsSync(resolve(options.cwd, path)));
  runGit(options.cwd, ['add', '--all', '--', ...paths]);
  runGit(options.cwd, ['commit', '-m', `release: ${tag}`]);
  const releaseCommit = runGit(options.cwd, ['rev-parse', 'HEAD']).stdout.toString().trim();
  runGit(options.cwd, ['tag', tag]);
  await pushReleaseAtomically(options.cwd, tag);
  return { kind: 'prepared', commit: releaseCommit } as const;
}

if (import.meta.main) {
  const result = await runReleaseTransaction({
    cwd: process.cwd(),
    version: argument('--version'),
    expectedBase: argument('--expected-base'),
    registryUrl: process.argv.includes('--registry-url')
      ? argument('--registry-url')
      : 'https://registry.npmjs.org/',
    dryRun: process.argv.includes('--dry-run'),
  });
  console.log(JSON.stringify(result));
}
