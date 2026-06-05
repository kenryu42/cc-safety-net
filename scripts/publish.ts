#!/usr/bin/env bun

import { $ } from 'bun';
import pkg from '../package.json';
import { formatReleaseNotes, generateChangelog, getContributors } from './generate-changelog';
import { parseBump } from './publish-options';

const PACKAGE_NAME = pkg.name;

let bump: ReturnType<typeof parseBump>;
try {
  bump = parseBump(process.env.BUMP);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
const versionOverride = process.env.VERSION;
const dryRun = process.argv.includes('--dry-run');
const recoverMode = process.argv.includes('--recover');
const executeRecovery = process.argv.includes('--execute');

console.log(`=== ${dryRun ? '[DRY-RUN] ' : ''}Publishing cc-safety-net ===\n`);

async function fetchPreviousVersion(): Promise<string | null> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${PACKAGE_NAME}/latest`);
    if (!res.ok) {
      if (res.status === 404) {
        console.log('Package not found on npm - this appears to be the first publish');
        return '0.0.0';
      }
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }
    const data = (await res.json()) as { version: string };
    console.log(`Previous version: ${data.version}`);
    return data.version;
  } catch (error) {
    console.error(`Failed to fetch previous version from npm: ${error}`);
    return null;
  }
}

function bumpVersion(version: string, type: 'major' | 'minor' | 'patch'): string {
  const parts = version.split('.').map((part) => Number(part));
  const major = parts[0] ?? 0;
  const minor = parts[1] ?? 0;
  const patch = parts[2] ?? 0;
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
  }
}

async function updatePackageVersion(newVersion: string): Promise<void> {
  const pkgPath = new URL('../package.json', import.meta.url).pathname;
  let pkg = await Bun.file(pkgPath).text();
  pkg = pkg.replace(/"version": "[^"]+"/, `"version": "${newVersion}"`);
  await Bun.write(pkgPath, pkg);
  console.log(`Updated: ${pkgPath}`);
}

async function updatePluginVersion(newVersion: string): Promise<void> {
  const pluginPath = new URL('../.claude-plugin/plugin.json', import.meta.url).pathname;
  let plugin = await Bun.file(pluginPath).text();
  plugin = plugin.replace(/"version": "[^"]+"/, `"version": "${newVersion}"`);
  await Bun.write(pluginPath, plugin);
  console.log(`Updated: ${pluginPath}`);
}

async function revertVersionChanges(): Promise<void> {
  await $`git checkout -- package.json .claude-plugin/plugin.json`.nothrow();
  await $`git checkout -- dist/`.nothrow();
  await $`git clean -fd dist/`.nothrow(); // Remove untracked build artifacts
}

async function build(): Promise<void> {
  console.log('\nBuilding...');
  const buildResult = Bun.spawnSync(['bun', 'run', 'build']);
  if (buildResult.exitCode !== 0) {
    console.error('Build failed');
    console.error(buildResult.stderr.toString());
    throw new Error('Build failed');
  }
}

async function npmPublish(): Promise<void> {
  console.log('Publishing to npm...');
  if (process.env.CI) {
    await $`npm publish --access public --provenance --ignore-scripts`;
  } else {
    await $`npm publish --access public --ignore-scripts`;
  }
}

async function gitCommitTagPush(newVersion: string): Promise<void> {
  console.log('\nCommitting and tagging...');
  await $`git config user.email "github-actions[bot]@users.noreply.github.com"`;
  await $`git config user.name "github-actions[bot]"`;
  await $`git add package.json .claude-plugin/plugin.json assets/cc-safety-net.schema.json dist/`;

  const hasStagedChanges = await $`git diff --cached --quiet`.nothrow();
  if (hasStagedChanges.exitCode !== 0) {
    await $`git commit -m "release: v${newVersion}"`;
  } else {
    console.log('No changes to commit (version already updated)');
  }

  const tagExists = await $`git rev-parse v${newVersion}`.nothrow();
  if (tagExists.exitCode !== 0) {
    await $`git tag v${newVersion}`;
  } else {
    // Tag exists but npm doesn't have this version (checked before calling this function).
    // This is a retry after failed npm publish - force update tag to current HEAD.
    console.log(
      `Tag v${newVersion} exists from failed previous publish - updating to current HEAD`,
    );
    await $`git tag -f v${newVersion}`;
  }

  await $`git push origin HEAD`;
  // Force push the tag in case we updated an existing one from a failed previous run
  await $`git push origin v${newVersion} --force`;
}

async function createGitHubRelease(newVersion: string, notes: string[]): Promise<void> {
  console.log('\nCreating GitHub release...');
  const releaseNotes = notes.length > 0 ? notes.join('\n') : 'No notable changes';
  const releaseExists = await $`gh release view v${newVersion}`.nothrow();
  if (releaseExists.exitCode !== 0) {
    await $`gh release create v${newVersion} --title "v${newVersion}" --notes ${releaseNotes}`;
  } else {
    console.log(`Release v${newVersion} already exists`);
  }
}

/**
 * Check if a version exists on npm.
 * @returns `true` if version exists, `false` if definitely absent (404), `null` if uncertain (network error)
 */
async function checkVersionExists(version: string): Promise<boolean | null> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${PACKAGE_NAME}/${version}`);
    if (res.ok) return true;
    if (res.status === 404) return false;
    // Other HTTP errors (5xx, rate limiting, etc.) - state is uncertain
    console.warn(`npm registry returned ${res.status} for version check - treating as uncertain`);
    return null;
  } catch (error) {
    // Network error - state is uncertain
    console.warn(`npm registry check failed: ${error} - treating as uncertain`);
    return null;
  }
}

async function preflight(
  newVersion: string,
  previousVersion: string,
  isDryRun: boolean,
): Promise<void> {
  console.log('\n🔍 Running preflight checks...\n');

  // 1. Ensure working directory is clean (except expected changes)
  const status = await $`git status --porcelain`.text();

  if (isDryRun) {
    // Dry-run requires completely clean working directory to avoid data loss
    if (status.trim()) {
      console.error(`❌ Dry-run requires clean working directory. Uncommitted changes:\n${status}`);
      process.exit(1);
    }
  } else {
    // CI allows expected changes from version updates (for recovery scenarios)
    const unexpectedChanges = status.split('\n').filter((line) => {
      if (!line.trim()) return false;
      const allowed = ['package.json', 'plugin.json', 'schema.json', 'dist/'];
      return !allowed.some((f) => line.includes(f));
    });
    if (unexpectedChanges.length > 0) {
      console.error(`❌ Unexpected uncommitted changes:\n${unexpectedChanges.join('\n')}`);
      process.exit(1);
    }
  }
  console.log('  ✓ Working directory is clean');

  // 2. Verify previous tag exists for changelog
  const prevTag = `v${previousVersion}`;
  const tagCheck = await $`git rev-parse ${prevTag}`.nothrow();
  if (tagCheck.exitCode !== 0) {
    console.warn(`  ⚠️  Previous tag ${prevTag} not found - changelog may be incomplete`);
  } else {
    console.log(`  ✓ Previous tag ${prevTag} exists`);
  }

  // 3. Verify version doesn't already have a tag
  const newTag = `v${newVersion}`;
  const newTagCheck = await $`git rev-parse ${newTag}`.nothrow();
  if (newTagCheck.exitCode === 0) {
    console.warn(`  ⚠️  Tag ${newTag} already exists`);
  }

  console.log('\n✅ Preflight checks passed\n');
}

async function runRecovery(): Promise<void> {
  console.log('🔧 Recovery mode: checking for partial publish state...\n');

  // Get version from npm - fail fast if we can't determine the version
  const npmVersion = await fetchPreviousVersion();
  if (npmVersion === null) {
    console.error('❌ Cannot determine npm version - recovery aborted');
    console.error(
      '   Fix npm connectivity or specify VERSION explicitly if this is a first publish.',
    );
    process.exit(1);
  }

  // Guard against 404 returning "0.0.0" - verify version actually exists
  if (npmVersion === '0.0.0') {
    const exists = await checkVersionExists('0.0.0');
    if (exists === null) {
      console.error('❌ Cannot verify if 0.0.0 exists on npm - recovery aborted');
      console.error('   Retry when npm is reachable.');
      process.exit(1);
    }
    if (exists === false) {
      console.error('❌ Package not found on npm - nothing to recover');
      console.error('   Use normal publish flow for first publish.');
      process.exit(1);
    }
  }

  // Check if tag exists
  const tagExists = await $`git rev-parse v${npmVersion}`.nothrow();

  // Check if release exists
  const releaseExists = await $`gh release view v${npmVersion}`.nothrow();

  console.log(`\nnpm version: ${npmVersion}`);
  console.log(`Git tag v${npmVersion}: ${tagExists.exitCode === 0 ? '✅ exists' : '❌ missing'}`);
  console.log(`GitHub release: ${releaseExists.exitCode === 0 ? '✅ exists' : '❌ missing'}`);

  if (tagExists.exitCode === 0 && releaseExists.exitCode === 0) {
    console.log('\n✅ No recovery needed - all artifacts exist');
    return;
  }

  if (!executeRecovery) {
    console.log('\nUse --recover --execute to create missing artifacts.');
    return;
  }

  // Execute recovery
  console.log('\nExecuting recovery...');

  if (tagExists.exitCode !== 0) {
    const headSha = (await $`git rev-parse --short HEAD`.text()).trim();
    const branch = (await $`git branch --show-current`.text()).trim();
    console.warn(`⚠️  Warning: Will tag current HEAD (${headSha} on ${branch})`);
    console.warn(`   Ensure this is the commit that was published to npm!`);
    console.log(`Creating missing tag v${npmVersion}...`);
    await $`git tag v${npmVersion}`;
    await $`git push origin v${npmVersion}`;
  }

  if (releaseExists.exitCode !== 0) {
    console.log(`Creating missing release v${npmVersion}...`);
    await $`gh release create v${npmVersion} --title "v${npmVersion}" --notes "Recovery release"`;
  }

  console.log('\n✅ Recovery complete');
}

async function runDryRun(newVersion: string, previousVersion: string): Promise<void> {
  console.log('\n[DRY-RUN] Simulating full publish flow...\n');

  // Run preflight before any modifications
  await preflight(newVersion, previousVersion, true);

  try {
    // Actually update version files (we'll revert at the end)
    await updatePackageVersion(newVersion);
    await updatePluginVersion(newVersion);

    // Actually build
    await build();

    // Stage and check what would be committed
    await $`git add package.json .claude-plugin/plugin.json assets/cc-safety-net.schema.json dist/`;
    const staged = await $`git diff --cached --stat`.text();
    console.log('[DRY-RUN] Would commit:');
    console.log(staged);

    // Generate changelog preview
    const changelog = await generateChangelog(`v${previousVersion}`);
    const contributors = await getContributors(`v${previousVersion}`);
    const notes = formatReleaseNotes(changelog, contributors);

    console.log('\n--- Release Notes ---');
    console.log(notes.length > 0 ? notes.join('\n') : 'No notable changes');

    console.log(`\n[DRY-RUN] ✅ All checks passed - would publish ${PACKAGE_NAME}@${newVersion}`);
  } catch (error) {
    console.error('\n[DRY-RUN] ❌ Simulation failed');
    throw error;
  } finally {
    // Always cleanup: unstage and revert changes
    await $`git reset HEAD`.nothrow();
    await revertVersionChanges();
  }
}

async function main(): Promise<void> {
  // Recovery mode
  if (recoverMode) {
    await runRecovery();
    return;
  }

  const previous = await fetchPreviousVersion();

  // If npm lookup failed and no explicit version override, fail fast
  if (previous === null && !versionOverride) {
    console.error('❌ Cannot determine previous version from npm');
    console.error('   Set VERSION=x.y.z explicitly to proceed.');
    process.exit(1);
  }

  // For changelog/preflight, use previous if available, otherwise use a placeholder
  // (This only happens when VERSION override is used with npm down - changelog will be incomplete)
  const previousForChangelog = previous ?? '0.0.0';

  // Use override, or bump from previous
  const newVersion =
    versionOverride ||
    (bump ? bumpVersion(previousForChangelog, bump) : bumpVersion(previousForChangelog, 'patch'));
  console.log(`New version: ${newVersion}\n`);

  // Dry-run mode with full simulation
  if (dryRun) {
    await runDryRun(newVersion, previousForChangelog);
    return;
  }

  // Check if version already exists on npm
  const versionExists = await checkVersionExists(newVersion);
  if (versionExists === true) {
    console.log(`Version ${newVersion} already exists on npm. Skipping publish.`);
    process.exit(0);
  }
  if (versionExists === null) {
    console.error(`❌ Cannot confirm version ${newVersion} is unpublished (npm check failed)`);
    console.error('   Refusing to proceed - could corrupt existing release tag.');
    console.error('   Retry when npm is reachable, or use --recover for manual recovery.');
    process.exit(1);
  }

  // Only run in CI for actual publish
  if (!process.env.CI) {
    console.log('Not in CI environment. Use --dry-run to test locally.');
    process.exit(1);
  }

  // Run preflight checks
  await preflight(newVersion, previousForChangelog, false);

  // Update version files
  await updatePackageVersion(newVersion);
  await updatePluginVersion(newVersion);

  // Generate changelog before building
  const changelog = await generateChangelog(`v${previousForChangelog}`);
  const contributors = await getContributors(`v${previousForChangelog}`);
  const notes = formatReleaseNotes(changelog, contributors);

  // Build with new version
  await build();

  // Git commit, tag, and push FIRST (reversible via force-push if needed)
  await gitCommitTagPush(newVersion);

  // Only publish to npm AFTER git is successful (irreversible)
  await npmPublish();

  // Create GitHub release last (easily recoverable)
  await createGitHubRelease(newVersion, notes);

  console.log(`\n=== Successfully published ${PACKAGE_NAME}@${newVersion} ===`);
}

main();
