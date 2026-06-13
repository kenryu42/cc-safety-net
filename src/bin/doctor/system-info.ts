/**
 * System information for the doctor command.
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { delimiter, extname, join } from 'node:path';

import type { PiProbeInfo, PiProbeResource, SystemInfo } from '@/bin/doctor/types';

declare const __PKG_VERSION__: string | undefined;

const CURRENT_VERSION = typeof __PKG_VERSION__ !== 'undefined' ? __PKG_VERSION__ : 'dev';
const VERSION_FETCH_TIMEOUT_MS = 2000;
const PI_PROBE_TIMEOUT_MS = 5000;
const PI_SENTINEL_COMMAND = 'cc-safety-net';
const PI_PROBE_COMMAND = '__cc_safety_net_probe';
const TEST_SPAWN_PLATFORM_ENV = '_CC_SAFETY_NET_TEST_SPAWN_PLATFORM';

const PI_PROBE_UNAVAILABLE: PiProbeInfo = {
  status: 'unavailable',
  installedAndEnabled: false,
  matched: [],
};

/**
 * Get the package version synchronously.
 * This is useful for callers that only need the version without fetching tool versions.
 */
export function getPackageVersion(): string {
  return CURRENT_VERSION;
}

/**
 * Version fetcher function type.
 * Takes command args and returns the version string or null.
 */
export type VersionFetcher = (args: string[]) => Promise<string | null>;
export type PiProbeRunner = (cwd: string) => Promise<PiProbeInfo>;

const COPILOT_PLUGIN_ID = 'copilot-safety-net';

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

function getSpawnCommand(args: string[], env: NodeJS.ProcessEnv): { cmd: string; args: string[] } {
  const [command, ...rest] = args;
  const platform = env[TEST_SPAWN_PLATFORM_ENV] === 'win32' ? 'win32' : process.platform;
  if (!command || platform !== 'win32') return { cmd: command ?? '', args: rest };

  const resolved = resolveWindowsCommand(command, env);
  if (!/\.(?:bat|cmd)$/i.test(resolved)) return { cmd: resolved, args: rest };

  return {
    cmd: getEnvValue(env, 'COMSPEC') ?? 'cmd.exe',
    args: [
      '/d',
      '/c',
      ['call', quoteWindowsCommandArg(resolved), ...rest.map(quoteWindowsCommandArg)].join(' '),
    ],
  };
}

/**
 * Default version fetcher that runs shell commands.
 * Uses Node.js child_process.spawn for compatibility with both Node and Bun runtimes.
 * @internal Exported for testing
 */
export const defaultVersionFetcher: VersionFetcher = async (args: string[]) => {
  const [cmd, ...rest] = args;
  if (!cmd) return null;

  return new Promise((resolve) => {
    try {
      const spawnCommand = getSpawnCommand([cmd, ...rest], process.env);
      const proc = spawn(spawnCommand.cmd, spawnCommand.args, {
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      let isSettled = false;

      let output = '';
      let errorOutput = '';
      proc.stdout.on('data', (data: Buffer) => {
        output += data.toString();
      });
      proc.stderr.on('data', (data: Buffer) => {
        errorOutput += data.toString();
      });

      const finish = (value: string | null): void => {
        if (isSettled) return;
        isSettled = true;
        clearTimeout(timeoutId);
        resolve(value);
      };

      const timeoutId = setTimeout(() => {
        proc.kill();
        finish(null);
      }, VERSION_FETCH_TIMEOUT_MS);

      proc.on('close', (code) => {
        finish(code === 0 ? output.trim() || errorOutput.trim() || null : null);
      });

      proc.on('error', () => {
        finish(null);
      });
    } catch {
      resolve(null);
    }
  });
};

const PI_PROBE_EXTENSION = `
import { writeFileSync } from "node:fs";

export default function (pi) {
  pi.registerCommand("${PI_PROBE_COMMAND}", {
    description: "Probe loaded CC Safety Net Pi resources",
    handler: async (args, ctx) => {
      const needle = args.trim();
      const commands = typeof pi.getCommands === "function"
        ? pi.getCommands().map((command) => ({
            kind: "command",
            name: command.name,
            path: command.sourceInfo?.path,
            source: command.sourceInfo?.source,
          }))
        : [];
      const tools = typeof pi.getAllTools === "function"
        ? pi.getAllTools().map((tool) => ({
            kind: "tool",
            name: tool.name,
            path: tool.sourceInfo?.path,
            source: tool.sourceInfo?.source,
          }))
        : [];
      const resources = [...commands, ...tools];
      const matched = resources.filter(
        (resource) => resource.name === needle || resource.path === needle,
      );

      writeFileSync(
        process.env.PI_PROBE_OUT,
        JSON.stringify({
          installedAndEnabled: matched.length > 0,
          matched,
        }),
      );

      ctx.shutdown?.();
    },
  });
}
`.trimStart();

interface CommandResult {
  code: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  error?: string;
}

function runCommand(
  args: string[],
  options: { cwd?: string; env?: Record<string, string>; timeoutMs: number },
): Promise<CommandResult> {
  const [cmd, ...rest] = args;
  if (!cmd) {
    return Promise.resolve({ code: null, stdout: '', stderr: '', timedOut: false });
  }

  return new Promise((resolve) => {
    try {
      const env = { ...process.env, ...(options.env ?? {}) };
      const spawnCommand = getSpawnCommand([cmd, ...rest], env);
      const proc = spawn(spawnCommand.cmd, spawnCommand.args, {
        cwd: options.cwd,
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
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
        finish({ code: null, stdout, stderr, timedOut: true });
      }, options.timeoutMs);

      proc.on('close', (code) => {
        finish({ code, stdout, stderr, timedOut: false });
      });

      proc.on('error', (error) => {
        finish({ code: null, stdout, stderr, timedOut: false, error: error.message });
      });
    } catch (error) {
      resolve({
        code: null,
        stdout: '',
        stderr: '',
        timedOut: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

/**
 * Run Pi with a temporary probe extension to verify the CC Safety Net extension
 * is runtime-visible under Pi's normal package and extension resolver.
 */
const defaultPiProbeRunner: PiProbeRunner = async (cwd: string): Promise<PiProbeInfo> => {
  const tempDir = await mkdtemp(join(tmpdir(), 'cc-safety-net-pi-probe-'));
  const probePath = join(tempDir, 'pi-extension-probe.ts');
  const resultPath = join(tempDir, 'result.json');
  const stdoutPath = join(tempDir, 'stdout.jsonl');

  try {
    await writeFile(probePath, PI_PROBE_EXTENSION);

    const result = await runCommand(
      ['pi', '-e', probePath, '--mode', 'json', `/${PI_PROBE_COMMAND} ${PI_SENTINEL_COMMAND}`],
      {
        cwd,
        env: { PI_PROBE_OUT: resultPath },
        timeoutMs: PI_PROBE_TIMEOUT_MS,
      },
    );

    await writeFile(stdoutPath, result.stdout);

    if (result.timedOut) {
      return {
        status: 'error',
        installedAndEnabled: false,
        matched: [],
        error: 'Pi probe timed out',
      };
    }

    if (result.error) {
      return {
        status: 'error',
        installedAndEnabled: false,
        matched: [],
        error: `Pi probe failed: ${result.error}`,
      };
    }

    if (result.code !== 0) {
      return {
        status: 'error',
        installedAndEnabled: false,
        matched: [],
        error: `Pi probe exited with code ${result.code ?? 'unknown'}${result.stderr.trim() ? `: ${result.stderr.trim()}` : ''}`,
      };
    }

    return parsePiProbeResult(await readFile(resultPath, 'utf-8'));
  } catch (error) {
    return {
      status: 'error',
      installedAndEnabled: false,
      matched: [],
      error: `Pi probe failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
};

function parsePiProbeResult(content: string): PiProbeInfo {
  try {
    const parsed = JSON.parse(content) as unknown;
    if (!isObject(parsed)) {
      return {
        status: 'error',
        installedAndEnabled: false,
        matched: [],
        error: 'Pi probe result was not an object',
      };
    }

    const matched = Array.isArray(parsed.matched)
      ? parsed.matched
          .map(parsePiProbeResource)
          .filter((resource): resource is PiProbeResource => resource !== null)
      : [];
    const installedAndEnabled = parsed.installedAndEnabled === true;

    return {
      status: installedAndEnabled ? 'configured' : 'not-found',
      installedAndEnabled,
      matched,
    };
  } catch (error) {
    return {
      status: 'error',
      installedAndEnabled: false,
      matched: [],
      error: `Failed to parse Pi probe result: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function parsePiProbeResource(value: unknown): PiProbeResource | null {
  if (!isObject(value)) return null;
  if (value.kind !== 'command' && value.kind !== 'tool') return null;
  if (typeof value.name !== 'string') return null;

  return {
    kind: value.kind,
    name: value.name,
    ...(typeof value.path === 'string' ? { path: value.path } : {}),
    ...(typeof value.source === 'string' ? { source: value.source } : {}),
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Parse version from command output.
 * Handles various formats like "v1.2.3", "1.2.3", "tool 1.2.3", etc.
 */
function parseVersion(output: string | null): string | null {
  if (!output) return null;

  // Handle "Claude Code X.Y.Z" format
  const claudeMatch = /Claude Code\s+(\d+\.\d+\.\d+)/i.exec(output);
  if (claudeMatch) return claudeMatch[1] ?? null;

  // Handle "vX.Y.Z" or just "X.Y.Z"
  const versionMatch = /v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(output);
  if (versionMatch) return versionMatch[1] ?? null;

  // If no version pattern found, return the output as-is (trimmed first line)
  const firstLine = output.split('\n')[0]?.trim();
  return firstLine || null;
}

function hasCopilotSafetyNetPlugin(output: string | null): boolean {
  if (!output) return false;

  const pluginPattern = new RegExp(`(^|[^a-z0-9-])${COPILOT_PLUGIN_ID}([^a-z0-9-]|$)`, 'm');

  return pluginPattern.test(output);
}

/**
 * Fetch system info with tool versions.
 * Runs all version checks in parallel for performance.
 */
export async function getSystemInfo(
  fetcher: VersionFetcher = defaultVersionFetcher,
  options: { cwd?: string; piProbeRunner?: PiProbeRunner } = {},
): Promise<SystemInfo> {
  const piRawPromise = fetcher(['pi', '--version']);
  const piProbeRunner = options.piProbeRunner ?? defaultPiProbeRunner;
  const shouldRunPiProbe = !!options.piProbeRunner || fetcher === defaultVersionFetcher;
  const piProbePromise = piRawPromise.then((piRaw) => {
    if (!piRaw) return PI_PROBE_UNAVAILABLE;
    if (!shouldRunPiProbe) return PI_PROBE_UNAVAILABLE;
    return piProbeRunner(options.cwd ?? process.cwd());
  });
  const fetchCopilotVersion = async (): Promise<string | null> => {
    const binaryVersionPromise = fetcher(['copilot', '--binary-version']);
    const fallbackVersionPromise = fetcher(['copilot', '--version']);
    const binaryVersion = await binaryVersionPromise;
    if (binaryVersion) {
      return binaryVersion;
    }
    return fallbackVersionPromise;
  };

  // Run all version fetches in parallel
  const [
    claudeRaw,
    claudePluginListOutput,
    openCodeRaw,
    codexRaw,
    geminiRaw,
    geminiExtensionsListOutput,
    copilotRaw,
    kimiRaw,
    piRaw,
    nodeRaw,
    npmRaw,
    bunRaw,
    pluginListRaw,
    piSafetyNetProbe,
  ] = await Promise.all([
    fetcher(['claude', '--version']),
    fetcher(['claude', 'plugin', 'list']),
    fetcher(['opencode', '--version']),
    fetcher(['codex', '--version']),
    fetcher(['gemini', '--version']),
    fetcher(['gemini', 'extensions', 'list']),
    fetchCopilotVersion(),
    fetcher(['kimi', '--version']),
    piRawPromise,
    fetcher(['node', '--version']),
    fetcher(['npm', '--version']),
    fetcher(['bun', '--version']),
    fetcher(['copilot', 'plugin', 'list']),
    piProbePromise,
  ]);

  return {
    version: CURRENT_VERSION,
    claudeCodeVersion: parseVersion(claudeRaw),
    claudePluginListOutput,
    openCodeVersion: parseVersion(openCodeRaw),
    codexCliVersion: parseVersion(codexRaw),
    geminiCliVersion: parseVersion(geminiRaw),
    geminiExtensionsListOutput,
    copilotCliVersion: parseVersion(copilotRaw),
    kimiCodeVersion: parseVersion(kimiRaw),
    piCliVersion: parseVersion(piRaw),
    nodeVersion: parseVersion(nodeRaw),
    npmVersion: parseVersion(npmRaw),
    bunVersion: parseVersion(bunRaw),
    copilotPluginInstalled: hasCopilotSafetyNetPlugin(pluginListRaw),
    piSafetyNetProbe,
    platform: `${process.platform} ${process.arch}`,
  };
}
