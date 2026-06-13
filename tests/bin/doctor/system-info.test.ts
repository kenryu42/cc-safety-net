/**
 * Tests for the doctor command system-info functions.
 */

import { describe, expect, test } from 'bun:test';
import { chmodSync, writeFileSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import {
  defaultVersionFetcher,
  getPackageVersion,
  getSystemInfo,
  type PiProbeRunner,
} from '@/bin/doctor/system-info';
import { mockVersionFetcher, withEnv, withTempDir } from '../../helpers.ts';

function createDeferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
} {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

function createCopilotDeferredFetcher() {
  const calls: string[][] = [];
  const binaryVersion = createDeferred<string | null>();
  const fallbackVersion = createDeferred<string | null>();
  const fetcher = (args: string[]): Promise<string | null> => {
    calls.push(args);
    if (args[0] === 'copilot' && args[1] === '--binary-version') {
      return binaryVersion.promise;
    }
    if (args[0] === 'copilot' && args[1] === '--version') {
      return fallbackVersion.promise;
    }
    return Promise.resolve(null);
  };
  return { binaryVersion, calls, fallbackVersion, fetcher };
}

function expectCopilotVersionProbesStarted(calls: string[][]): void {
  expect(calls.some((args) => args[0] === 'copilot' && args[1] === '--binary-version')).toBe(true);
  expect(calls.some((args) => args[0] === 'copilot' && args[1] === '--version')).toBe(true);
}

async function withFakePi<T>(
  mode: 'configured' | 'not-found' | 'nonzero' | 'missing-result' | 'invalid-json' | 'non-object',
  fn: (cwd: string) => Promise<T>,
): Promise<T> {
  return withTempDir('doctor-fake-pi-', async (tmpDir) => {
    writeFileSync(
      join(tmpDir, 'pi.js'),
      `import { writeFileSync } from "node:fs";

if (process.argv[2] === "--version") {
  console.log("pi 0.4.0");
  process.exit(0);
}

if (process.env.FAKE_PI_MODE === "nonzero") {
  console.error("extension failed");
  process.exit(7);
}

if (process.env.FAKE_PI_MODE === "missing-result") {
  process.exit(0);
}

if (process.env.FAKE_PI_MODE === "invalid-json") {
  writeFileSync(process.env.PI_PROBE_OUT, "{");
  process.exit(0);
}

if (process.env.FAKE_PI_MODE === "non-object") {
  writeFileSync(process.env.PI_PROBE_OUT, "[]");
  process.exit(0);
}

writeFileSync(
  process.env.PI_PROBE_OUT,
  JSON.stringify(
    process.env.FAKE_PI_MODE === "not-found"
      ? { installedAndEnabled: false, matched: [] }
      : {
          installedAndEnabled: true,
          matched: [
            {
              kind: "command",
              name: "cc-safety-net",
              path: "/tmp/safety-net.js",
              source: "local",
            },
            { kind: "event", name: "ignored" },
            { kind: "tool", name: 42 },
          ],
        },
  ),
);
`,
    );
    writeFileSync(join(tmpDir, 'pi'), '#!/bin/sh\nexec bun "$0.js" "$@"\n');
    writeFileSync(join(tmpDir, 'pi.cmd'), '@echo off\r\nbun "%~dp0pi.js" %*\r\n');
    chmodSync(join(tmpDir, 'pi'), 0o755);

    const originalPath = process.env.PATH;
    const originalPathAlt = process.env.Path;
    const originalMode = process.env.FAKE_PI_MODE;
    process.env.PATH = `${tmpDir}${delimiter}${originalPath ?? originalPathAlt ?? ''}`;
    if (process.platform === 'win32') process.env.Path = process.env.PATH;
    process.env.FAKE_PI_MODE = mode;
    try {
      return await fn(tmpDir);
    } finally {
      if (originalPath === undefined) {
        delete process.env.PATH;
      } else {
        process.env.PATH = originalPath;
      }
      if (originalPathAlt === undefined) {
        delete process.env.Path;
      } else {
        process.env.Path = originalPathAlt;
      }
      if (originalMode === undefined) {
        delete process.env.FAKE_PI_MODE;
      } else {
        process.env.FAKE_PI_MODE = originalMode;
      }
    }
  });
}

describe('getSystemInfo', () => {
  test('returns all required fields', async () => {
    const sysInfo = await getSystemInfo(mockVersionFetcher);

    expect(typeof sysInfo.version).toBe('string');
    expect(typeof sysInfo.platform).toBe('string');
    expect(
      sysInfo.claudeCodeVersion === null || typeof sysInfo.claudeCodeVersion === 'string',
    ).toBe(true);
    expect(
      sysInfo.claudePluginListOutput === null || typeof sysInfo.claudePluginListOutput === 'string',
    ).toBe(true);
    expect(sysInfo.openCodeVersion === null || typeof sysInfo.openCodeVersion === 'string').toBe(
      true,
    );
    expect(sysInfo.codexCliVersion === null || typeof sysInfo.codexCliVersion === 'string').toBe(
      true,
    );
    expect(sysInfo.geminiCliVersion === null || typeof sysInfo.geminiCliVersion === 'string').toBe(
      true,
    );
    expect(sysInfo.piCliVersion === null || typeof sysInfo.piCliVersion === 'string').toBe(true);
    expect(sysInfo.kimiCodeVersion === null || typeof sysInfo.kimiCodeVersion === 'string').toBe(
      true,
    );
    expect(
      sysInfo.geminiExtensionsListOutput === null ||
        typeof sysInfo.geminiExtensionsListOutput === 'string',
    ).toBe(true);
    expect(
      sysInfo.copilotCliVersion === null || typeof sysInfo.copilotCliVersion === 'string',
    ).toBe(true);
    expect(sysInfo.nodeVersion === null || typeof sysInfo.nodeVersion === 'string').toBe(true);
    expect(sysInfo.npmVersion === null || typeof sysInfo.npmVersion === 'string').toBe(true);
    expect(sysInfo.bunVersion === null || typeof sysInfo.bunVersion === 'string').toBe(true);
    expect(typeof sysInfo.copilotPluginInstalled).toBe('boolean');
    expect(sysInfo.piSafetyNetProbe).toHaveProperty('status');
    expect(typeof sysInfo.piSafetyNetProbe.installedAndEnabled).toBe('boolean');
  });

  test('detects Bun version with mock fetcher', async () => {
    const sysInfo = await getSystemInfo(mockVersionFetcher);
    expect(sysInfo.bunVersion).toBe('1.0.0');
  });

  test('includes Copilot CLI version with mock fetcher', async () => {
    const sysInfo = await getSystemInfo(mockVersionFetcher);
    expect(sysInfo.copilotCliVersion).toBe('1.0.9');
  });

  test('includes Gemini extensions list output with mock fetcher', async () => {
    const sysInfo = await getSystemInfo(mockVersionFetcher);
    expect(sysInfo.geminiExtensionsListOutput).toContain(
      'https://github.com/kenryu42/gemini-safety-net',
    );
  });

  test('includes Kimi Code version with mock fetcher', async () => {
    const sysInfo = await getSystemInfo(mockVersionFetcher);
    expect(sysInfo.kimiCodeVersion).toBe('0.3.0');
  });

  test('includes Pi CLI version with mock fetcher', async () => {
    const sysInfo = await getSystemInfo(mockVersionFetcher);
    expect(sysInfo.piCliVersion).toBe('0.4.0');
  });

  test('includes Codex CLI version with mock fetcher', async () => {
    const sysInfo = await getSystemInfo(mockVersionFetcher);
    expect(sysInfo.codexCliVersion).toBe('1.2.0');
  });

  test('includes successful Pi safety-net probe result', async () => {
    const piProbeRunner: PiProbeRunner = async () => ({
      status: 'configured',
      installedAndEnabled: true,
      matched: [{ kind: 'command', name: 'cc-safety-net', path: '/tmp/safety-net.js' }],
    });

    const sysInfo = await getSystemInfo(mockVersionFetcher, { piProbeRunner });

    expect(sysInfo.piSafetyNetProbe).toEqual({
      status: 'configured',
      installedAndEnabled: true,
      matched: [{ kind: 'command', name: 'cc-safety-net', path: '/tmp/safety-net.js' }],
    });
  });

  test('reports Pi probe unavailable when Pi CLI is missing', async () => {
    const sysInfo = await getSystemInfo(async (args) => {
      if (args[0] === 'pi') return null;
      return mockVersionFetcher(args);
    });

    expect(sysInfo.piCliVersion).toBeNull();
    expect(sysInfo.piSafetyNetProbe).toEqual({
      status: 'unavailable',
      installedAndEnabled: false,
      matched: [],
    });
  });

  test('surfaces Pi probe errors without throwing', async () => {
    const piProbeRunner: PiProbeRunner = async () => ({
      status: 'error',
      installedAndEnabled: false,
      matched: [],
      error: 'probe failed',
    });

    const sysInfo = await getSystemInfo(mockVersionFetcher, { piProbeRunner });

    expect(sysInfo.piSafetyNetProbe).toEqual({
      status: 'error',
      installedAndEnabled: false,
      matched: [],
      error: 'probe failed',
    });
  });

  test('runs the default Pi probe through the Pi CLI', async () => {
    await withFakePi('configured', async (cwd) => {
      const sysInfo = await getSystemInfo(defaultVersionFetcher, { cwd });

      expect(sysInfo.piCliVersion).toBe('0.4.0');
      expect(sysInfo.piSafetyNetProbe).toEqual({
        status: 'configured',
        installedAndEnabled: true,
        matched: [
          {
            kind: 'command',
            name: 'cc-safety-net',
            path: '/tmp/safety-net.js',
            source: 'local',
          },
        ],
      });
    });
  });

  test('reports not-found from the default Pi probe when the sentinel is absent', async () => {
    await withFakePi('not-found', async (cwd) => {
      const sysInfo = await getSystemInfo(defaultVersionFetcher, { cwd });

      expect(sysInfo.piSafetyNetProbe).toEqual({
        status: 'not-found',
        installedAndEnabled: false,
        matched: [],
      });
    });
  });

  test('reports non-zero default Pi probe exits', async () => {
    await withFakePi('nonzero', async (cwd) => {
      const sysInfo = await getSystemInfo(defaultVersionFetcher, { cwd });

      expect(sysInfo.piSafetyNetProbe.status).toBe('error');
      expect(sysInfo.piSafetyNetProbe.error).toContain('code 7');
      expect(sysInfo.piSafetyNetProbe.error).toContain('extension failed');
    });
  });

  test('reports missing default Pi probe result files', async () => {
    await withFakePi('missing-result', async (cwd) => {
      const sysInfo = await getSystemInfo(defaultVersionFetcher, { cwd });

      expect(sysInfo.piSafetyNetProbe.status).toBe('error');
      expect(sysInfo.piSafetyNetProbe.error).toContain('Pi probe failed');
    });
  });

  test('reports invalid default Pi probe JSON', async () => {
    await withFakePi('invalid-json', async (cwd) => {
      const sysInfo = await getSystemInfo(defaultVersionFetcher, { cwd });

      expect(sysInfo.piSafetyNetProbe.status).toBe('error');
      expect(sysInfo.piSafetyNetProbe.error).toContain('Failed to parse Pi probe result');
    });
  });

  test('reports non-object default Pi probe JSON', async () => {
    await withFakePi('non-object', async (cwd) => {
      const sysInfo = await getSystemInfo(defaultVersionFetcher, { cwd });

      expect(sysInfo.piSafetyNetProbe).toEqual({
        status: 'error',
        installedAndEnabled: false,
        matched: [],
        error: 'Pi probe result was not an object',
      });
    });
  });

  test('parses Kimi Code version output through existing parser', async () => {
    const sysInfo = await getSystemInfo(async (args) => {
      if (args[0] === 'kimi') return 'Kimi Code v1.2.3';
      return null;
    });

    expect(sysInfo.kimiCodeVersion).toBe('1.2.3');
  });

  test('parses Codex CLI version output through existing parser', async () => {
    const sysInfo = await getSystemInfo(async (args) => {
      if (args[0] === 'codex') return 'Codex CLI v1.2.3';
      return null;
    });

    expect(sysInfo.codexCliVersion).toBe('1.2.3');
  });

  test('includes Claude plugin list output with mock fetcher', async () => {
    const sysInfo = await getSystemInfo(mockVersionFetcher);
    expect(sysInfo.claudePluginListOutput).toContain('safety-net@cc-marketplace');
  });

  test('starts both copilot version probes immediately and prefers --binary-version', async () => {
    const probes = createCopilotDeferredFetcher();
    const sysInfoPromise = getSystemInfo(probes.fetcher);
    await Promise.resolve();

    expectCopilotVersionProbesStarted(probes.calls);

    probes.fallbackVersion.resolve('copilot 1.0.8');
    probes.binaryVersion.resolve('Copilot binary version: 1.0.9');

    const sysInfo = await sysInfoPromise;

    expect(sysInfo.copilotCliVersion).toBe('1.0.9');
  });

  test('falls back to copilot --version when --binary-version is unavailable', async () => {
    const calls: string[][] = [];
    const fetcher = async (args: string[]) => {
      calls.push(args);
      if (args[0] !== 'copilot') return null;
      if (args[1] === '--binary-version') return null;
      if (args[1] === '--version') return 'copilot 1.0.8';
      return null;
    };

    const sysInfo = await getSystemInfo(fetcher);

    expect(sysInfo.copilotCliVersion).toBe('1.0.8');
    expectCopilotVersionProbesStarted(calls);
  });

  test('does not wait for copilot --version when --binary-version succeeds', async () => {
    const probes = createCopilotDeferredFetcher();
    const sysInfoPromise = getSystemInfo(probes.fetcher);
    await Promise.resolve();

    expectCopilotVersionProbesStarted(probes.calls);

    probes.binaryVersion.resolve('Copilot binary version: 1.0.9');

    const sysInfo = await sysInfoPromise;

    expect(sysInfo.copilotCliVersion).toBe('1.0.9');

    probes.fallbackVersion.resolve('copilot 1.0.8');
  }, 100);

  test('handles commands that exit with non-zero code', async () => {
    const failingFetcher = async (_args: string[]) => null;
    const result = await getSystemInfo(failingFetcher);
    expect(result.claudeCodeVersion).toBeNull();
    expect(result.claudePluginListOutput).toBeNull();
    expect(result.copilotCliVersion).toBeNull();
    expect(result.codexCliVersion).toBeNull();
    expect(result.kimiCodeVersion).toBeNull();
    expect(result.piCliVersion).toBeNull();
    expect(result.geminiExtensionsListOutput).toBeNull();
    expect(result.copilotPluginInstalled).toBe(false);
    expect(result.piSafetyNetProbe.status).toBe('unavailable');
    expect(result.bunVersion).toBeNull();
    expect(result.nodeVersion).toBeNull();
  });

  test('handles empty version output', async () => {
    const emptyFetcher = async (_args: string[]) => '';
    const result = await getSystemInfo(emptyFetcher);
    expect(result.claudeCodeVersion).toBeNull();
    expect(result.copilotCliVersion).toBeNull();
    expect(result.codexCliVersion).toBeNull();
    expect(result.bunVersion).toBeNull();
  });
});

describe('copilotPluginInstalled', () => {
  test('returns true when copilot plugin list includes copilot-safety-net', async () => {
    const fetcher = async (args: string[]) => {
      if (args[0] === 'copilot' && args[1] === 'plugin') {
        return 'Installed plugins:\n  • copilot-safety-net (v1.0.0)';
      }
      return null;
    };

    const sysInfo = await getSystemInfo(fetcher);

    expect(sysInfo.copilotPluginInstalled).toBe(true);
  });

  test('returns false when plugin list does not include copilot-safety-net', async () => {
    const fetcher = async (args: string[]) => {
      if (args[0] === 'copilot' && args[1] === 'plugin') {
        return 'Installed plugins:\n  • other-plugin (v1.0.0)';
      }
      return null;
    };

    const sysInfo = await getSystemInfo(fetcher);

    expect(sysInfo.copilotPluginInstalled).toBe(false);
  });

  test('returns false for partial plugin id matches', async () => {
    const fetcher = async (args: string[]) => {
      if (args[0] === 'copilot' && args[1] === 'plugin') {
        return 'Installed plugins:\n  • other-copilot-safety-net (v1.0.0)';
      }
      return null;
    };

    const sysInfo = await getSystemInfo(fetcher);

    expect(sysInfo.copilotPluginInstalled).toBe(false);
  });

  test('returns false when copilot plugin list is unavailable', async () => {
    const fetcher = async (_args: string[]) => null;

    const sysInfo = await getSystemInfo(fetcher);

    expect(sysInfo.copilotPluginInstalled).toBe(false);
  });
});

describe('defaultVersionFetcher', () => {
  test('returns null for non-existent commands', async () => {
    const result = await defaultVersionFetcher([
      '__nonexistent_command_that_definitely_does_not_exist__',
      '--version',
    ]);
    expect(result).toBeNull();
  });

  test('returns null for empty args', async () => {
    const result = await defaultVersionFetcher([]);
    expect(result).toBeNull();
  });

  test('returns null when spawn throws synchronously for invalid command input', async () => {
    const result = await defaultVersionFetcher(['\u0000']);
    expect(result).toBeNull();
  });

  test('returns version for existing commands', async () => {
    const result = await defaultVersionFetcher(['bun', '--version']);
    expect(result).not.toBeNull();
    expect(result).toMatch(/^\d+\.\d+/);
  });

  test('returns stderr output when a successful command writes no stdout', async () => {
    const result = await defaultVersionFetcher([
      'bun',
      '-e',
      'console.error("stderr-only output")',
    ]);
    expect(result).toBe('stderr-only output');
  });

  test('returns null for commands that time out', async () => {
    const startedAt = Date.now();
    const result = await defaultVersionFetcher(['bun', '-e', 'setTimeout(() => {}, 3000)']);
    const durationMs = Date.now() - startedAt;

    expect(result).toBeNull();
    expect(durationMs).toBeLessThan(2800);
  }, 5000);

  test('returns null for commands that exit with non-zero code', async () => {
    const result = await defaultVersionFetcher(['false']);
    expect(result).toBeNull();
  });

  test('detects bun version with the real fetcher', async () => {
    const result = await defaultVersionFetcher(['bun', '--version']);
    expect(result).toMatch(/^\d+\.\d+/);
  }, 5000);

  test('preserves arguments when resolving Windows exe commands', async () => {
    if (process.platform === 'win32') return;

    await withTempDir('doctor-windows-exe-', async (tmpDir) => {
      const commandPath = join(tmpDir, 'fake.EXE');
      writeFileSync(commandPath, '#!/bin/sh\nprintf "%s" "$1"\n');
      chmodSync(commandPath, 0o755);

      const result = await withEnv(
        {
          PATH: tmpDir,
          PATHEXT: '.EXE;.CMD',
          _CC_SAFETY_NET_TEST_SPAWN_PLATFORM: 'win32',
        },
        () => defaultVersionFetcher(['fake', 'stderr-only output']),
      );

      expect(result).toBe('stderr-only output');
    });
  });

  test('wraps Windows cmd shims without shelling exe commands', async () => {
    if (process.platform === 'win32') return;

    await withTempDir('doctor-windows-cmd-', async (tmpDir) => {
      const extensionlessPath = join(tmpDir, 'fake');
      const commandPath = join(tmpDir, 'fake.CMD');
      const comspecPath = join(tmpDir, 'cmd');
      writeFileSync(extensionlessPath, '#!/bin/sh\nprintf "extensionless"\n');
      writeFileSync(commandPath, '');
      writeFileSync(comspecPath, '#!/bin/sh\nprintf "%s" "$3"\n');
      chmodSync(extensionlessPath, 0o755);
      chmodSync(comspecPath, 0o755);

      const result = await withEnv(
        {
          COMSPEC: comspecPath,
          PATH: '',
          Path: tmpDir,
          PATHEXT: '.CMD',
          _CC_SAFETY_NET_TEST_SPAWN_PLATFORM: 'win32',
        },
        () => defaultVersionFetcher(['fake', 'arg with space']),
      );

      expect(result).toContain(join(tmpDir, 'fake.CMD'));
      expect(result).toContain('"arg with space"');
    });
  });
});

describe('version comparison', () => {
  test('system version is a string', async () => {
    const sysInfo = await getSystemInfo(mockVersionFetcher);
    expect(typeof sysInfo.version).toBe('string');
  });

  test('getPackageVersion returns version string', () => {
    const version = getPackageVersion();
    expect(typeof version).toBe('string');
    expect(version === 'dev' || /^\d+\.\d+\.\d+/.test(version)).toBe(true);
  });
});
