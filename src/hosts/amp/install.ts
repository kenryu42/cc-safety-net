import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Environment } from '@/core/environment';
import { atomicWriteFile } from '@/core/io/atomic-write';
import { getUserPolicyPath } from '@/core/policy/paths';
import { normalizeGuiPolicy } from '@/core/policy/store';
import { AMP_MANAGED_HEADER, AMP_PLUGIN_DIRECTORY, AMP_PLUGIN_ENTRY } from '@/hosts/amp/artifact';
import { type AmpRunner, runAmpCommand } from '@/hosts/amp/run';
import { lstatOrUndefined, readRecord } from '@/hosts/detect/context';
import type { InstallResult } from '@/hosts/install/types';
import { getPackageVersion } from '@/hosts/system-info';

const AMP_LEGACY_PLUGIN_FILE = 'cc-safety-net.ts';
const AMP_ARTIFACT_RELATIVE = join('amp', AMP_PLUGIN_ENTRY);

/**
 * Local system-scope plugin path. Nothing installs here anymore; a leftover file masks the
 * personal plugin, so install and uninstall clean it up when it is one of ours. Spelled out
 * rather than sharing the repository migration constant: this path is permanent.
 * @internal
 */
export function getAmpPluginPath(environment: Environment): string {
  return join(environment.home, '.config', 'amp', 'plugins', 'cc-safety-net.ts');
}

/**
 * Candidate locations of the packaged Amp artifact, resolved relative to the
 * installed CLI module (never the user's project). The bundled CLI and its
 * chunks sit one directory under `dist/`; the dev entrypoint runs from
 * `src/hosts/amp/`.
 * @internal
 */
export function ampArtifactCandidates(): string[] {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  return [
    join(moduleDir, '..', AMP_ARTIFACT_RELATIVE),
    join(moduleDir, '..', '..', '..', 'dist', AMP_ARTIFACT_RELATIVE),
  ];
}

/** @internal */
export function resolveAmpArtifactPath(
  candidates: readonly string[] = ampArtifactCandidates(),
): string {
  const found = candidates.find((path) => existsSync(path) && lstatSync(path).isFile());
  if (!found)
    throw new Error(
      'Packaged Amp plugin artifact not found. Reinstall cc-safety-net and try again.',
    );
  return found;
}

function parseJsonOrUndefined(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function isManagedAmpArtifact(content: Buffer): boolean {
  return (
    content.subarray(0, Buffer.byteLength(AMP_MANAGED_HEADER)).toString('utf-8') ===
    AMP_MANAGED_HEADER
  );
}

async function runAmpStep(run: AmpRunner, command: readonly [string, ...string[]], cwd?: string) {
  const result = await run(command, cwd);
  if (result.status === 0) return result;
  throw new Error(
    [
      `Failed to run ${command.join(' ')}${result.status === null ? '' : ` (exit ${result.status})`}.`,
      [result.stdout, result.stderr].filter(Boolean).join('\n').trim(),
    ]
      .filter(Boolean)
      .join('\n'),
  );
}

async function requirePersonalPluginsRef(run: AmpRunner): Promise<string> {
  const result = await run(['amp', 'plugins', 'repositories', '--json']);
  if (result.status === null)
    throw new Error(
      `${
        result.errorCode === 'ENOENT'
          ? 'Amp CLI not found. Install the amp CLI, sign in with "amp login", and rerun install --amp.'
          : `amp plugins repositories --json did not finish (${result.errorCode ?? 'terminated'}). Check that the amp CLI responds and rerun install --amp.`
      }\n${result.stderr}`.trim(),
    );
  if (result.status !== 0)
    throw new Error(
      `Failed to run amp plugins repositories --json (exit ${result.status}). Sign in with "amp login" and rerun install --amp.\n${[result.stdout, result.stderr].filter(Boolean).join('\n')}`.trim(),
    );

  const parsed = parseJsonOrUndefined(result.stdout);
  const cloneRef = (Array.isArray(parsed) ? parsed : [])
    .filter(
      (entry) =>
        readRecord(entry, 'scope') === 'user' &&
        readRecord(entry, 'exists') === true &&
        readRecord(entry, 'viewerCanWrite') === true,
    )
    .map((entry) => readRecord(entry, 'cloneRef'))
    .find((ref): ref is string => typeof ref === 'string' && ref.length > 0);
  if (!cloneRef)
    throw new Error(
      'Your Amp account has no writable Personal Plugins repository. Sign in with "amp login", open Amp once to create it, and rerun install --amp.',
    );
  return cloneRef;
}

async function withAmpCheckout<T>(
  run: AmpRunner,
  environment: Environment,
  body: (checkout: string) => Promise<T>,
): Promise<T> {
  const checkout = mkdtempSync(join(environment.tmpdir, 'cc-safety-net-amp-'));
  try {
    await runAmpStep(run, ['amp', 'clone', 'user-plugins', checkout]);
    return await body(checkout);
  } finally {
    rmSync(checkout, { recursive: true, force: true });
  }
}

function rerun(action: 'overwrite' | 'remove'): string {
  return `rerun ${action === 'overwrite' ? 'install' : 'uninstall'} --amp`;
}

function readManagedPluginFile(
  checkout: string,
  relativePath: string,
  action: 'overwrite' | 'remove',
) {
  const dest = join(checkout, relativePath);
  const info = lstatOrUndefined(dest);
  if (!info) return undefined;
  if (info.isSymbolicLink() || !info.isFile())
    throw new Error(
      `Refusing to ${action} ${relativePath} in your Amp personal plugins repository: not a regular file. Remove it there and ${rerun(action)}.`,
    );

  const current = readFileSync(dest);
  if (isManagedAmpArtifact(current)) return current;
  throw new Error(
    `Refusing to ${action} unmanaged file ${relativePath} in your Amp personal plugins repository. Remove it there and ${rerun(action)}.`,
  );
}

function readManagedPluginDirectory(checkout: string, action: 'overwrite' | 'remove') {
  const directory = join(checkout, AMP_PLUGIN_DIRECTORY);
  const info = lstatOrUndefined(directory);
  if (!info) return undefined;
  if (info.isSymbolicLink() || !info.isDirectory())
    throw new Error(
      `Refusing to ${action} ${AMP_PLUGIN_DIRECTORY} in your Amp personal plugins repository: not a regular directory. Remove it there and ${rerun(action)}.`,
    );
  return readManagedPluginFile(checkout, AMP_PLUGIN_ENTRY, action);
}

function readRemovableLegacyFile(checkout: string) {
  const dest = join(checkout, AMP_LEGACY_PLUGIN_FILE);
  const info = lstatOrUndefined(dest);
  if (!info || info.isSymbolicLink() || !info.isFile()) return undefined;
  const current = readFileSync(dest);
  return isManagedAmpArtifact(current) ? current : undefined;
}

async function commitAndPush(
  run: AmpRunner,
  checkout: string,
  stage: readonly [string, ...string[]],
  message: string,
): Promise<boolean> {
  await runAmpStep(run, stage, checkout);

  const staged = await runAmpStep(run, ['git', 'status', '--porcelain'], checkout);
  if (staged.stdout.trim() === '') return false;

  await runAmpStep(
    run,
    [
      'git',
      '-c',
      'commit.gpgsign=false',
      '-c',
      'user.name=cc-safety-net',
      '-c',
      'user.email=cc-safety-net@localhost',
      'commit',
      '-m',
      message,
    ],
    checkout,
  );

  await runAmpStep(run, ['git', 'push', 'origin', 'HEAD'], checkout);
  return true;
}

function removeMaskingLocalPlugin(environment: Environment, onUnmanaged: 'fail' | 'keep'): void {
  removeMaskingLocalFile(environment, onUnmanaged);
  removeMaskingLocalDirectory(environment, onUnmanaged);
}

function keepUnmanagedLocalPlugin(local: string, onUnmanaged: 'fail' | 'keep'): void {
  if (onUnmanaged === 'keep') return;
  throw new Error(
    `Local Amp plugin ${local} is not a managed copy and masks the personal plugin. Remove it and rerun install --amp.`,
  );
}

function removeMaskingLocalFile(environment: Environment, onUnmanaged: 'fail' | 'keep'): void {
  const local = getAmpPluginPath(environment);
  const info = lstatOrUndefined(local);
  if (!info) return;
  if (!info.isSymbolicLink() && info.isFile() && isManagedAmpArtifact(readFileSync(local))) {
    rmSync(local);
    return;
  }
  keepUnmanagedLocalPlugin(local, onUnmanaged);
}

function removeMaskingLocalDirectory(environment: Environment, onUnmanaged: 'fail' | 'keep'): void {
  const local = join(environment.home, '.config', 'amp', 'plugins', AMP_PLUGIN_DIRECTORY);
  const info = lstatOrUndefined(local);
  if (!info) return;
  if (!info.isSymbolicLink() && info.isDirectory() && holdsOnlyManagedEntry(local)) {
    rmSync(local, { recursive: true });
    return;
  }
  keepUnmanagedLocalPlugin(local, onUnmanaged);
}

function holdsOnlyManagedEntry(directory: string): boolean {
  const entryName = basename(AMP_PLUGIN_ENTRY);
  if (readdirSync(directory).join(' ') !== entryName) return false;
  const entry = join(directory, entryName);
  const info = lstatOrUndefined(entry);
  return (
    !!info && !info.isSymbolicLink() && info.isFile() && isManagedAmpArtifact(readFileSync(entry))
  );
}

function embeddedPolicyStamp(environment: Environment): string {
  const path = getUserPolicyPath(environment);
  if (!existsSync(path)) return '';
  const parsed = parseJsonOrUndefined(readFileSync(path, 'utf-8'));
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return '';
  return `;globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(normalizeGuiPolicy(parsed, environment.home))};\n`;
}

export async function installAmp(
  environment: Environment,
  artifactPath: string = resolveAmpArtifactPath(),
  run: AmpRunner = runAmpCommand,
): Promise<InstallResult> {
  const content = Buffer.concat([
    readFileSync(artifactPath),
    Buffer.from(embeddedPolicyStamp(environment), 'utf-8'),
  ]);
  const cloneRef = await requirePersonalPluginsRef(run);

  return withAmpCheckout(run, environment, async (checkout) => {
    const path = `${cloneRef}/${AMP_PLUGIN_DIRECTORY}`;
    const current = readManagedPluginDirectory(checkout, 'overwrite');
    const legacy = readManagedPluginFile(checkout, AMP_LEGACY_PLUGIN_FILE, 'overwrite');
    if (current?.equals(content) && !legacy) {
      removeMaskingLocalPlugin(environment, 'fail');
      return { path, alreadyInstalled: true };
    }

    mkdirSync(join(checkout, AMP_PLUGIN_DIRECTORY), { recursive: true });
    atomicWriteFile(join(checkout, AMP_PLUGIN_ENTRY), content);
    if (legacy) rmSync(join(checkout, AMP_LEGACY_PLUGIN_FILE));
    const pushed = await commitAndPush(
      run,
      checkout,

      ['git', 'add', '--', AMP_PLUGIN_ENTRY, ...(legacy ? [AMP_LEGACY_PLUGIN_FILE] : [])],
      `chore: update cc-safety-net plugin to v${getPackageVersion()}`,
    );
    removeMaskingLocalPlugin(environment, 'fail');
    return { path, alreadyInstalled: !pushed };
  });
}

export async function uninstallAmp(
  environment: Environment,
  run: AmpRunner = runAmpCommand,
): Promise<InstallResult> {
  const cloneRef = await requirePersonalPluginsRef(run);

  return withAmpCheckout(run, environment, async (checkout) => {
    const current = readManagedPluginDirectory(checkout, 'remove');
    const legacy = readRemovableLegacyFile(checkout);

    const path = `${cloneRef}/${legacy && !current ? AMP_LEGACY_PLUGIN_FILE : AMP_PLUGIN_DIRECTORY}`;
    if (!current && !legacy) {
      removeMaskingLocalPlugin(environment, 'keep');
      return { path, alreadyInstalled: false };
    }

    await commitAndPush(
      run,
      checkout,

      [
        'git',
        'rm',
        '--',
        ...(current ? [AMP_PLUGIN_ENTRY] : []),
        ...(legacy ? [AMP_LEGACY_PLUGIN_FILE] : []),
      ],
      `chore: remove cc-safety-net plugin v${getPackageVersion()}`,
    );
    removeMaskingLocalPlugin(environment, 'keep');
    return { path, alreadyInstalled: true };
  });
}
