import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Environment } from '@/core/environment';
import { lstatOrUndefined, readRecord } from '@/hosts/detect/context';
import { type NativeCommand, runNativeCommand } from '@/hosts/install/native';
import {
  OPENCLAW_MANAGED_HEADER,
  OPENCLAW_PLUGIN_ENTRY_FILE,
  OPENCLAW_PLUGIN_ID,
  OPENCLAW_PLUGIN_MANIFEST_FILE,
  OPENCLAW_PLUGIN_PACKAGE_FILE,
} from '@/hosts/openclaw/artifact';

const OPENCLAW_ARTIFACT_RELATIVE = join('openclaw', OPENCLAW_PLUGIN_ID);

const INSTALLED_PLUGIN_FILES = [
  OPENCLAW_PLUGIN_ENTRY_FILE,
  OPENCLAW_PLUGIN_MANIFEST_FILE,
  OPENCLAW_PLUGIN_PACKAGE_FILE,
];

function expandTilde(value: string, homeDir: string): string {
  if (value === '~') return homeDir;
  if (value.startsWith('~/') || value.startsWith('~\\')) return join(homeDir, value.slice(2));
  return value;
}

function getOpenClawStateDir(environment: Environment): string {
  const stateDir = environment.env.get('OPENCLAW_STATE_DIR')?.trim();
  if (stateDir) return expandTilde(stateDir, environment.home);

  const configPath = environment.env.get('OPENCLAW_CONFIG_PATH')?.trim();
  return configPath
    ? dirname(expandTilde(configPath, environment.home))
    : join(environment.home, '.openclaw');
}

export function getOpenClawConfigPath(environment: Environment): string {
  const configPath = environment.env.get('OPENCLAW_CONFIG_PATH')?.trim();
  return configPath
    ? expandTilde(configPath, environment.home)
    : join(getOpenClawStateDir(environment), 'openclaw.json');
}

export function getOpenClawPluginDir(environment: Environment): string {
  return join(getOpenClawStateDir(environment), 'extensions', OPENCLAW_PLUGIN_ID);
}

function holdsOnlyOurPlugin(dir: string): boolean {
  const entries = readdirSync(dir);
  if (entries.length === 0) return true;
  if (entries.some((name) => !INSTALLED_PLUGIN_FILES.includes(name))) return false;

  const entry = join(dir, OPENCLAW_PLUGIN_ENTRY_FILE);
  const info = lstatOrUndefined(entry);
  return (
    info !== undefined &&
    !info.isSymbolicLink() &&
    info.isFile() &&
    readFileSync(entry, 'utf-8').startsWith(OPENCLAW_MANAGED_HEADER)
  );
}

export function assertOpenClawPluginDirIsOurs(environment: Environment): void {
  const dir = getOpenClawPluginDir(environment);
  const info = lstatOrUndefined(dir);
  if (!info) return;
  if (!info.isSymbolicLink() && info.isDirectory() && holdsOnlyOurPlugin(dir)) return;

  throw new Error(
    `Refusing to modify ${dir}: it does not hold a cc-safety-net managed OpenClaw plugin. Move or remove it, then run the command again.`,
  );
}

function openClawArtifactCandidates(): string[] {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  return [
    join(moduleDir, '..', OPENCLAW_ARTIFACT_RELATIVE),
    join(moduleDir, '..', '..', '..', 'dist', OPENCLAW_ARTIFACT_RELATIVE),
  ];
}

export function findOpenClawArtifactDir(
  candidates: readonly string[] = openClawArtifactCandidates(),
): string | undefined {
  return candidates.find((path) => existsSync(path) && lstatSync(path).isDirectory());
}

/** @internal */
export function resolveOpenClawArtifactDir(
  candidates: readonly string[] = openClawArtifactCandidates(),
): string {
  const found = findOpenClawArtifactDir(candidates);
  if (!found)
    throw new Error(
      'Packaged OpenClaw plugin directory not found. Reinstall cc-safety-net and try again.',
    );
  return found;
}

export function getOpenClawInstallCommands(
  artifactDir: string = resolveOpenClawArtifactDir(),
): readonly NativeCommand[] {
  return [
    ['openclaw', 'plugins', 'install', artifactDir, '--force'],
    ['openclaw', 'plugins', 'enable', OPENCLAW_PLUGIN_ID],
  ];
}

function readOpenClawPluginStatus(inspectOutput: string): string | undefined {
  const report = (() => {
    try {
      return JSON.parse(inspectOutput);
    } catch {
      return undefined;
    }
  })();
  const status = readRecord(readRecord(report, 'plugin'), 'status');
  return typeof status === 'string' ? status : undefined;
}

export async function verifyOpenClawPluginRuntime(): Promise<void> {
  const status = readOpenClawPluginStatus(
    await runNativeCommand(
      ['openclaw', 'plugins', 'inspect', OPENCLAW_PLUGIN_ID, '--runtime', '--json'],
      {
        stdoutOnly: true,
      },
    ),
  );
  if (status === 'loaded') return;
  throw new Error(
    `${
      status === undefined
        ? `The ${OPENCLAW_PLUGIN_ID} plugin's load state could not be verified: OpenClaw's runtime inspect report was unreadable.`
        : `OpenClaw reports the ${OPENCLAW_PLUGIN_ID} plugin with status "${status}".`
    } Run \`openclaw plugins inspect ${OPENCLAW_PLUGIN_ID} --runtime\` for details.`,
  );
}
