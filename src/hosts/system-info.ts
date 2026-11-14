import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { delimiter, extname, join } from 'node:path';
import { stripVTControlCharacters } from 'node:util';

import { installIntegrationMetadata } from '@/hosts/catalog';
import type { SystemInfo } from '@/hosts/doctor-types';

declare const __PKG_VERSION__: string | undefined;

const CURRENT_VERSION = typeof __PKG_VERSION__ !== 'undefined' ? __PKG_VERSION__ : 'dev';

const VERSION_FETCH_TIMEOUT_MS = 5000;
const TEST_SPAWN_PLATFORM_ENV = '_CC_SAFETY_NET_TEST_SPAWN_PLATFORM';

export function getPackageVersion(): string {
  return CURRENT_VERSION;
}

export type VersionFetcher = (args: string[], timeoutMs?: number) => Promise<string | null>;

function getEnvValue(env: NodeJS.ProcessEnv, name: string): string | undefined {
  const direct = env[name];
  if (direct) return direct;
  const matchingName = Object.keys(env).find(
    (key) => key.toLowerCase() === name.toLowerCase() && !!env[key],
  );
  return matchingName ? env[matchingName] : direct;
}

function getWindowsExecutableExtensions(env: NodeJS.ProcessEnv): string[] {
  return (getEnvValue(env, 'PATHEXT') || '.COM;.EXE;.BAT;.CMD')
    .split(';')
    .filter((extension) => extension.length > 0);
}

function resolveWindowsCommand(command: string, env: NodeJS.ProcessEnv): string {
  const candidates = extname(command)
    ? [command]
    : [
        ...getWindowsExecutableExtensions(env).map((extension) => `${command}${extension}`),
        command,
      ];
  if (command.includes('/') || command.includes('\\')) {
    return candidates.find((candidate) => existsSync(candidate)) ?? command;
  }
  return (
    (getEnvValue(env, 'PATH') ?? '')
      .split(delimiter)
      .flatMap((dir) => candidates.map((candidate) => join(dir, candidate)))
      .find((candidate) => existsSync(candidate)) ?? command
  );
}

function quoteWindowsCommandArg(value: string): string {
  if (!/[\s"&|<>^]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

export function getSpawnCommand(
  args: string[],
  env: NodeJS.ProcessEnv,
): { cmd: string; args: string[]; windowsVerbatimArguments?: boolean } {
  const [command, ...rest] = args;
  const platform = env[TEST_SPAWN_PLATFORM_ENV] === 'win32' ? 'win32' : process.platform;
  if (!command || platform !== 'win32') return { cmd: command ?? '', args: rest };

  const resolved = resolveWindowsCommand(command, env);
  if (!/\.(?:bat|cmd)$/i.test(resolved)) return { cmd: resolved, args: rest };

  return {
    cmd: getEnvValue(env, 'COMSPEC') ?? 'cmd.exe',
    args: [
      '/d',
      '/s',
      '/c',
      `"${['call', quoteWindowsCommandArg(resolved), ...rest.map(quoteWindowsCommandArg)].join(' ')}"`,
    ],
    windowsVerbatimArguments: true,
  };
}

export const defaultVersionFetcher = async (
  args: string[],
  timeoutMs = VERSION_FETCH_TIMEOUT_MS,
): Promise<string | null> => {
  const result = await runCommand(args, { timeoutMs });
  if (result.code !== 0) return null;

  return (
    stripVTControlCharacters(result.stdout).trim() ||
    stripVTControlCharacters(result.stderr).trim() ||
    null
  );
};

interface CommandResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

function runCommand(args: string[], options: { timeoutMs: number }): Promise<CommandResult> {
  const [cmd, ...rest] = args;
  if (!cmd) {
    return Promise.resolve({ code: null, stdout: '', stderr: '' });
  }

  return new Promise((resolve) => {
    try {
      const spawnCommand = getSpawnCommand([cmd, ...rest], process.env);
      const proc = spawn(spawnCommand.cmd, spawnCommand.args, {
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsVerbatimArguments: spawnCommand.windowsVerbatimArguments,
      });
      let isSettled = false;
      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
      });
      proc.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      const finish = (result: CommandResult): void => {
        if (isSettled) return;
        isSettled = true;
        clearTimeout(timeoutId);
        resolve(result);
      };

      const timeoutId = setTimeout(() => {
        proc.kill();
        finish({ code: null, stdout, stderr });
      }, options.timeoutMs);

      proc.on('close', (code) => {
        finish({ code, stdout, stderr });
      });

      proc.on('error', () => {
        finish({ code: null, stdout, stderr });
      });
    } catch {
      resolve({ code: null, stdout: '', stderr: '' });
    }
  });
}

function parseVersion(output: string | null): string | null {
  if (!output) return null;

  const claudeMatch = /Claude Code\s+(\d+\.\d+\.\d+)/i.exec(output);
  if (claudeMatch) return claudeMatch[1] ?? null;

  const versionMatch = /v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(output);
  if (versionMatch) return versionMatch[1] ?? null;

  const firstLine = output.split('\n')[0]?.trim();
  return firstLine || null;
}

export async function getSystemInfo(
  hasOpenCodeEntry: (openCodeVersion: string) => boolean,
  fetcher: VersionFetcher = defaultVersionFetcher,
  cwd = process.cwd(),
): Promise<SystemInfo> {
  const versionProbes = Promise.all(
    installIntegrationMetadata.map(
      async (integration) =>
        [integration.id, parseVersion(await fetcher([...integration.probeCommand]))] as const,
    ),
  );
  const [
    versionEntries,
    openCodePluginListOutput,
    codexPluginListOutput,
    ampPluginListOutput,
    nodeRaw,
    npmRaw,
    bunRaw,
  ] = await Promise.all([
    versionProbes,
    versionProbes.then(async (entries) => {
      const openCodeVersion = entries.find(([id]) => id === 'opencode')?.[1];
      if (!openCodeVersion?.startsWith('2.') || !hasOpenCodeEntry(openCodeVersion)) return null;
      const location = ['--param', `location[directory]=${cwd}`];
      const awaitPluginActivation = ['opencode', 'api', 'integration.list', ...location];
      await fetcher(awaitPluginActivation, 30_000);
      return fetcher(['opencode', 'api', 'plugin.list', ...location], 30_000);
    }),
    fetcher(['codex', 'plugin', 'list'], 30_000),
    fetcher(['amp', 'plugins', 'list'], 30_000),
    fetcher(['node', '--version']),
    fetcher(['npm', '--version']),
    fetcher(['bun', '--version']),
  ]);

  return {
    version: CURRENT_VERSION,
    versions: Object.fromEntries(versionEntries),
    codexPluginListOutput,
    ampPluginListOutput,
    openCodePluginListOutput,
    nodeVersion: parseVersion(nodeRaw),
    npmVersion: parseVersion(npmRaw),
    bunVersion: parseVersion(bunRaw),
    platform: `${process.platform} ${process.arch}`,
  };
}
