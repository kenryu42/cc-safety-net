import { describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { delimiter, dirname, join } from 'node:path';
import { runUpdateCommand } from '@/cli/install';
import { AMP_MANAGED_HEADER } from '@/integrations/amp/artifact';
import { getCursorHooksPath } from '@/integrations/cursor/install';
import type { UpdateInfo } from '@/integrations/doctor-types';
import { captureConsoleOutput, withEnv } from '../../helpers';
import { makeTempHome, runCli } from '../../integrations/hook-helpers';
import {
  makeLoggedFakeCommandHome,
  writeClaudePluginRecords,
  writeFakeCommands,
  writeLoggedFakeCommand,
} from '../../integrations/install/install-test-helpers';
import { createLolcatOutput, stripAnsi } from '../lolcat-test-helpers';

function writeCursorHook(homeDir: string) {
  const path = getCursorHooksPath(homeDir);
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(
    path,
    JSON.stringify({
      version: 1,
      hooks: {
        preToolUse: [
          {
            command: 'npx -y cc-safety-net hook --cursor',
            timeout: 30,
            failClosed: true,
          },
        ],
      },
    }),
  );
  return path;
}

function makeFakeBinHome(name: string, commands: readonly string[]) {
  const fake = makeLoggedFakeCommandHome(name, commands);
  return {
    ...fake,
    path: [fake.binDir, dirname(process.execPath), '/usr/bin', '/bin'].join(delimiter),
  };
}

function normalizedCommandLog(logPath: string): string[] {
  if (!existsSync(logPath)) return [];
  return readFileSync(logPath, 'utf-8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((entry) => entry.replace(/^.*[\\/]bin[\\/]/, ''));
}

async function expectUpdateFindsNothing(homeDir: string, cwd?: string) {
  try {
    const result = await runUpdate({ homeDir, path: dirname(process.execPath), cwd });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe(
      'No installed integrations found. Run `cc-safety-net install` to set one up.',
    );
  } finally {
    rmSync(homeDir, { recursive: true, force: true });
  }
}

let directUpdateQueue = Promise.resolve();

function runUpdate(options: {
  homeDir: string;
  path: string;
  logPath?: string;
  cwd?: string;
  isTTY?: boolean;
  tmpDir?: string;
  scriptPath?: string;
  checkLatestVersion?: () => Promise<UpdateInfo>;
}) {
  // The bunx cache clear scans os.tmpdir(), and the Amp install mkdtemps inside it; both
  // re-read the env per call, so every update run stays inside the test home instead of the
  // developer's real temp dir. Only the default is created — an injected path is the test's own.
  const tmpDir = options.tmpDir ?? join(options.homeDir, 'tmp');
  if (!options.tmpDir) mkdirSync(tmpDir, { recursive: true });
  const execute = async () => {
    const originalCwd = process.cwd();
    // A non-TTY input keeps the banner off the real stdin (no raw mode, no keypress listener).
    const { chunks, output } = createLolcatOutput(options.isTTY ?? false);
    try {
      if (options.cwd) process.chdir(options.cwd);
      const { result, stderr } = await captureConsoleOutput(() =>
        withEnv(
          {
            HOME: options.homeDir,
            PATH: options.path,
            npm_config_cache: join(options.homeDir, '.npm'),
            // TMPDIR is the posix name os.tmpdir() reads, TEMP/TMP the win32 ones.
            TMPDIR: tmpDir,
            TEMP: tmpDir,
            TMP: tmpDir,
            ...(options.logPath ? { CC_SAFETY_NET_TEST_COMMAND_LOG: options.logPath } : {}),
          },
          () =>
            runUpdateCommand([], {
              input: { isTTY: false } as unknown as NodeJS.ReadStream,
              output: output as unknown as NodeJS.WriteStream,
              // A persistent-looking script path plus an up-to-date stub by default: the nudge
              // branch is exercised silently and no test reaches the real npm registry.
              scriptPath: options.scriptPath ?? '/usr/local/bin/ccsn',
              checkLatestVersion:
                options.checkLatestVersion ??
                (() =>
                  Promise.resolve({
                    currentVersion: '0.0.0',
                    latestVersion: null,
                    updateAvailable: false,
                  })),
            }),
        ),
      );
      return {
        exitCode: result,
        stdout: stripAnsi(chunks.join('')).trimEnd(),
        stderr: stderr.join('\n'),
      };
    } finally {
      process.chdir(originalCwd);
    }
  };
  const result = directUpdateQueue.then(execute);
  directUpdateQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

// The npx and bunx clears differ only in the directory they scan; `tmp` is the test home's
// injected os.tmpdir(). `installedHook: false` exercises the zero-integrations early return.
async function expectStaleCacheEntryCleared(
  name: string,
  entrySegments: string[],
  installedHook = true,
) {
  const homeDir = makeTempHome(name);
  if (installedHook) writeCursorHook(homeDir);
  const cacheEntry = join(homeDir, ...entrySegments);
  mkdirSync(join(cacheEntry, 'node_modules', 'cc-safety-net'), { recursive: true });

  try {
    const result = await runUpdate({ homeDir, path: dirname(process.execPath) });

    expect(result.exitCode).toBe(0);
    expect(existsSync(cacheEntry)).toBe(false);
  } finally {
    rmSync(homeDir, { recursive: true, force: true });
  }
}

const NUDGE_LINE =
  'Update available: cc-safety-net 2.1.0 → 9.9.9. Update this CLI with your package manager, e.g. `npm i -g cc-safety-net@latest` for a global install.';
const behindCheck = () =>
  Promise.resolve({ currentVersion: '2.1.0', latestVersion: '9.9.9', updateAvailable: true });

// Every suppression case still updates the cursor hook, so the reports prove the run happened.
async function expectNoUpgradeNudge(
  name: string,
  options: { scriptPath?: string; checkLatestVersion?: () => Promise<UpdateInfo> },
) {
  const homeDir = makeTempHome(name);
  writeCursorHook(homeDir);

  try {
    const result = await runUpdate({ homeDir, path: dirname(process.execPath), ...options });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Cursor hook up to date');
    expect(result.stdout).not.toContain('Update available');
  } finally {
    rmSync(homeDir, { recursive: true, force: true });
  }
}

async function expectCodexLegacyMigration(fake: ReturnType<typeof makeFakeBinHome>) {
  try {
    const result = await runUpdate(fake);

    expect(result.exitCode).toBe(0);
    expect(normalizedCommandLog(fake.logPath)).toEqual([
      'codex plugin list',
      'codex --version',
      'codex plugin marketplace add kenryu42/cc-marketplace',
      'codex plugin add cc-safety-net@cc-marketplace',
      'codex plugin remove safety-net@cc-marketplace',
    ]);
    expect(result.stdout).toContain('Updated Codex integration');
    expect(result.stderr).toBe('');
  } finally {
    rmSync(fake.homeDir, { recursive: true, force: true });
  }
}

describe('update command', () => {
  test('updates a configured Claude Code integration', async () => {
    const fake = makeFakeBinHome('safety-net-update-claude', ['claude']);
    writeClaudePluginRecords(fake.homeDir, ['cc-safety-net@cc-marketplace'], {
      enableByDefault: true,
    });

    try {
      const result = await runUpdate(fake);

      expect(result.exitCode).toBe(0);
      expect(normalizedCommandLog(fake.logPath)).toEqual([
        'claude --version',
        'claude plugin marketplace update cc-marketplace',
        'claude plugin update cc-safety-net@cc-marketplace',
      ]);
      expect(result.stdout).toContain('Updated Claude Code integration');
    } finally {
      rmSync(fake.homeDir, { recursive: true, force: true });
    }
  });

  test('updates and re-enables a disabled Claude Code integration', async () => {
    const fake = makeFakeBinHome('safety-net-update-disabled-claude', ['claude']);
    writeClaudePluginRecords(fake.homeDir, ['cc-safety-net@cc-marketplace'], {
      enabled: { 'cc-safety-net@cc-marketplace': false },
      enableByDefault: true,
    });

    try {
      const result = await runUpdate(fake);

      expect(result.exitCode).toBe(0);
      expect(normalizedCommandLog(fake.logPath)).toEqual([
        'claude --version',
        'claude plugin marketplace update cc-marketplace',
        'claude plugin update cc-safety-net@cc-marketplace',
        'claude plugin enable cc-safety-net@cc-marketplace',
      ]);
      expect(result.stdout).toContain('Updated Claude Code integration');
    } finally {
      rmSync(fake.homeDir, { recursive: true, force: true });
    }
  });

  test('ignores a repo-level Copilot hooks kill-switch with no plugin installed', async () => {
    const homeDir = makeTempHome('safety-net-update-copilot-veto');
    const cwd = join(homeDir, 'repo');
    mkdirSync(join(cwd, '.github', 'copilot'), { recursive: true });
    writeFileSync(
      join(cwd, '.github', 'copilot', 'settings.json'),
      JSON.stringify({ disableAllHooks: true }),
    );

    await expectUpdateFindsNothing(homeDir, cwd);
  });

  test('migrates a legacy-only Claude Code integration', async () => {
    const fake = makeFakeBinHome('safety-net-update-legacy-claude', ['claude']);
    writeClaudePluginRecords(fake.homeDir, ['safety-net@cc-marketplace'], {
      enableByDefault: true,
    });

    try {
      const result = await runUpdate(fake);

      expect(result.exitCode).toBe(0);
      expect(normalizedCommandLog(fake.logPath)).toEqual([
        'claude --version',
        'claude plugin marketplace add kenryu42/cc-marketplace',
        'claude plugin marketplace update cc-marketplace',
        'claude plugin install cc-safety-net@cc-marketplace',
        'claude plugin uninstall safety-net@cc-marketplace',
      ]);
      expect(result.stdout).toContain('Updated Claude Code integration');
    } finally {
      rmSync(fake.homeDir, { recursive: true, force: true });
    }
  });

  test('migrates a legacy-only Codex integration', async () => {
    const fake = makeFakeBinHome('safety-net-update-legacy-codex', ['codex']);
    writeLoggedFakeCommand(
      fake.homeDir,
      'codex',
      `if (commandLine === 'plugin list') {
  console.log('safety-net@cc-marketplace https://github.com/kenryu42/cc-safety-net.git installed, enabled');
}`,
    );

    await expectCodexLegacyMigration(fake);
  });

  test('detects a legacy-only Copilot CLI plugin from the filesystem', async () => {
    const fake = makeFakeBinHome('safety-net-update-legacy-copilot', ['copilot']);
    mkdirSync(
      join(fake.homeDir, '.copilot', 'installed-plugins', '_direct', 'copilot-safety-net'),
      { recursive: true },
    );
    writeLoggedFakeCommand(
      fake.homeDir,
      'copilot',
      `if (commandLine === 'plugin list') {
  console.log(${JSON.stringify('Installed plugins:\n  copilot-safety-net (v1.0.0)')});
}`,
    );

    try {
      const result = await runUpdate(fake);

      expect(result.exitCode).toBe(0);
      expect(normalizedCommandLog(fake.logPath)).toEqual([
        'copilot --binary-version',
        'copilot --binary-version',
        'copilot plugin list',
        'copilot plugin marketplace list',
        'copilot plugin marketplace add kenryu42/cc-marketplace',
        'copilot plugin install cc-safety-net@cc-marketplace',
        'copilot plugin uninstall copilot-safety-net',
      ]);
      expect(result.stdout).toContain('Updated GitHub Copilot CLI integration');
    } finally {
      rmSync(fake.homeDir, { recursive: true, force: true });
    }
  });

  test('migrates a pre-rename Copilot CLI plugin from the marketplace checkout', async () => {
    const fake = makeFakeBinHome('safety-net-update-prerename-copilot', ['copilot']);
    mkdirSync(join(fake.homeDir, '.copilot', 'installed-plugins', 'cc-marketplace', 'safety-net'), {
      recursive: true,
    });
    writeLoggedFakeCommand(
      fake.homeDir,
      'copilot',
      `if (commandLine === 'plugin list') {
  console.log(${JSON.stringify('Installed plugins:\n  • safety-net@cc-marketplace (v1.0.6)')});
}
if (commandLine === 'plugin marketplace list') {
  console.log(${JSON.stringify('Registered marketplaces:\n  • cc-marketplace (GitHub: kenryu42/cc-marketplace)')});
}`,
    );

    try {
      const result = await runUpdate(fake);

      expect(result.exitCode).toBe(0);
      expect(normalizedCommandLog(fake.logPath)).toEqual([
        'copilot --binary-version',
        'copilot --binary-version',
        'copilot plugin list',
        'copilot plugin marketplace list',
        'copilot plugin marketplace update cc-marketplace',
        'copilot plugin install cc-safety-net@cc-marketplace',
        'copilot plugin uninstall safety-net@cc-marketplace',
      ]);
      expect(result.stdout).toContain('Updated GitHub Copilot CLI integration');
    } finally {
      rmSync(fake.homeDir, { recursive: true, force: true });
    }
  });

  test('tolerates a stale legacy Claude Code plugin record', async () => {
    const fake = makeFakeBinHome('safety-net-update-stale-legacy-claude', ['claude']);
    writeClaudePluginRecords(
      fake.homeDir,
      ['cc-safety-net@cc-marketplace', 'safety-net@cc-marketplace'],
      { enableByDefault: true },
    );
    writeLoggedFakeCommand(
      fake.homeDir,
      'claude',
      `if (commandLine === 'plugin uninstall safety-net@cc-marketplace') {
  console.error('Plugin "safety-net@cc-marketplace" not found in installed plugins');
  process.exit(1);
}`,
    );

    try {
      const result = await runUpdate(fake);

      expect(result.exitCode).toBe(0);
      expect(normalizedCommandLog(fake.logPath)).toEqual([
        'claude --version',
        'claude plugin marketplace update cc-marketplace',
        'claude plugin update cc-safety-net@cc-marketplace',
        'claude plugin uninstall safety-net@cc-marketplace',
      ]);
      expect(result.stdout).toContain('Updated Claude Code integration');
      expect(result.stderr).toContain('claude plugin uninstall safety-net@cc-marketplace');
    } finally {
      rmSync(fake.homeDir, { recursive: true, force: true });
    }
  });

  test('detects a Codex integration whose plugin list is slower than the version probe timeout', async () => {
    const fake = makeFakeBinHome('safety-net-update-slow-codex', ['codex']);
    writeLoggedFakeCommand(
      fake.homeDir,
      'codex',
      `if (commandLine === 'plugin list') {
  const sleptPath = join(process.env.HOME ?? '', '.codex-slept');
  if (!existsSync(sleptPath)) {
    writeFileSync(sleptPath, '');
    await Bun.sleep(6000);
  }
  console.log('safety-net@cc-marketplace https://github.com/kenryu42/cc-safety-net.git installed, enabled');
}`,
    );

    await expectCodexLegacyMigration(fake);
  }, 20000);

  test('skips a configured native integration when its CLI is missing', async () => {
    const homeDir = makeTempHome('safety-net-update-missing-cli');
    writeClaudePluginRecords(homeDir, ['cc-safety-net@cc-marketplace'], {
      enableByDefault: true,
    });

    try {
      const result = await runUpdate({ homeDir, path: dirname(process.execPath) });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe('Claude Code not found; skipped');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('updates a configured file integration without its CLI', async () => {
    const homeDir = makeTempHome('safety-net-update-cursor');
    const configPath = writeCursorHook(homeDir);

    try {
      const result = await runUpdate({ homeDir, path: dirname(process.execPath) });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe(`Cursor hook up to date in ${configPath}`);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('reports a bunx cache clear failure without stopping the update', async () => {
    const homeDir = makeTempHome('safety-net-update-bunx-failure');
    const configPath = writeCursorHook(homeDir);
    const tmpDir = join(homeDir, 'not-a-dir');
    writeFileSync(tmpDir, '');

    try {
      const result = await runUpdate({ homeDir, path: dirname(process.execPath), tmpDir });

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toContain(`Cursor hook up to date in ${configPath}`);
      expect(result.stderr).toContain(tmpDir);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('updates the Amp plugin in the personal plugins repository', async () => {
    const homeDir = makeTempHome('safety-net-update-amp');
    // A leftover managed system-scope plugin masks the personal one, so update clears it.
    const maskingPath = join(homeDir, '.config', 'amp', 'plugins', 'cc-safety-net.ts');
    mkdirSync(join(maskingPath, '..'), { recursive: true });
    writeFileSync(maskingPath, `${AMP_MANAGED_HEADER}\n// stale artifact\n`);
    const binDir = writeFakeCommands(homeDir, {
      // Personal-scope plugin line, repositories preflight, and a clone that leaves the
      // throwaway checkout empty. No network and no real Amp repository is involved.
      amp: `if (args[0] === 'plugins' && args[1] === 'list') {
  console.log('✓ cc-safety-net (User Plugins) active');
}
if (args[0] === 'plugins' && args[1] === 'repositories') {
  console.log('[{"scope":"user","exists":true,"viewerCanWrite":true,"cloneRef":"tester/-/plugins"}]');
}`,
      // Only `git status --porcelain` needs a real answer: the modified directory-plugin entry
      // means the artifact is staged, so `commitAndPush` proceeds to commit and push.
      git: `if (commandLine === 'status --porcelain') {
  console.log('M  cc-safety-net/index.ts');
}`,
    });

    try {
      const result = await runUpdate({
        homeDir,
        path: [binDir, dirname(process.execPath), '/usr/bin', '/bin'].join(delimiter),
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Updated Amp Code plugin at tester/-/plugins/cc-safety-net');
      expect(result.stdout).toContain('including Orb threads');
      expect(existsSync(maskingPath)).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('reports when no installed integration is found', async () => {
    await expectUpdateFindsNothing(makeTempHome('safety-net-update-none'));
  });

  test('continues with the remaining targets after a target failure', async () => {
    const fake = makeFakeBinHome('safety-net-update-failure', ['claude', 'codex']);
    writeClaudePluginRecords(fake.homeDir, ['cc-safety-net@cc-marketplace'], {
      enableByDefault: true,
    });
    writeLoggedFakeCommand(
      fake.homeDir,
      'claude',
      `if (commandLine === 'plugin marketplace update cc-marketplace') process.exit(42);`,
    );
    writeLoggedFakeCommand(
      fake.homeDir,
      'codex',
      `if (commandLine === 'plugin list') {
  console.log('cc-safety-net@cc-marketplace https://github.com/kenryu42/cc-safety-net.git installed, enabled');
}`,
    );

    try {
      const result = await runUpdate(fake);

      expect(result.exitCode).toBe(1);
      expect(normalizedCommandLog(fake.logPath)).toContain(
        'codex plugin marketplace upgrade cc-marketplace',
      );
      expect(result.stderr).toContain('claude plugin marketplace update cc-marketplace');
      expect(result.stdout).toContain('Updated Codex integration');
    } finally {
      rmSync(fake.homeDir, { recursive: true, force: true });
    }
  });

  test('updates independent targets concurrently', async () => {
    const fake = makeFakeBinHome('safety-net-update-parallel', ['claude', 'codex']);
    writeClaudePluginRecords(fake.homeDir, ['cc-safety-net@cc-marketplace'], {
      enableByDefault: true,
    });
    // Claude Code runs before Codex in canonical order, and here it only finishes once Codex
    // signals that it started, so this passes only when the two targets run concurrently.
    writeLoggedFakeCommand(
      fake.homeDir,
      'claude',
      `if (commandLine === 'plugin marketplace update cc-marketplace') {
  const runningPath = join(process.env.HOME ?? '', '.codex-running');
  for (let attempt = 0; attempt < 50; attempt++) {
    if (existsSync(runningPath)) process.exit(0);
    await Bun.sleep(100);
  }
  process.exit(42);
}`,
    );
    writeLoggedFakeCommand(
      fake.homeDir,
      'codex',
      `if (commandLine === 'plugin list') {
  console.log('cc-safety-net@cc-marketplace https://github.com/kenryu42/cc-safety-net.git installed, enabled');
}
if (commandLine === 'plugin marketplace upgrade cc-marketplace') {
  writeFileSync(join(process.env.HOME ?? '', '.codex-running'), '');
}`,
    );

    try {
      const result = await runUpdate(fake);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Updated Claude Code integration');
      expect(result.stdout).toContain('Updated Codex integration');
    } finally {
      rmSync(fake.homeDir, { recursive: true, force: true });
    }
  }, 20000);

  test('clears a stale npx cache entry while updating', async () => {
    await expectStaleCacheEntryCleared('safety-net-update-npx-cache', ['.npm', '_npx', 'a1b2c3']);
  });

  test('clears a stale bunx cache entry while updating', async () => {
    await expectStaleCacheEntryCleared('safety-net-update-bunx-cache', [
      'tmp',
      `bunx-${process.getuid?.() ?? 0}-cc-safety-net@latest`,
    ]);
  });

  test('clears a stale bunx cache entry even when no integrations are detected', async () => {
    await expectStaleCacheEntryCleared(
      'safety-net-update-bunx-cache-no-integrations',
      ['tmp', `bunx-${process.getuid?.() ?? 0}-cc-safety-net@latest`],
      false,
    );
  });

  test('keeps the bunx entry the update itself runs from while clearing the rest', async () => {
    const homeDir = makeTempHome('safety-net-update-bunx-cache-running');
    writeCursorHook(homeDir);
    const running = join(homeDir, 'tmp', `bunx-${process.getuid?.() ?? 0}-cc-safety-net@latest`);
    const stale = join(homeDir, 'tmp', `bunx-${process.getuid?.() ?? 0}-cc-safety-net@2.1.0`);
    mkdirSync(join(running, 'node_modules', 'cc-safety-net'), { recursive: true });
    mkdirSync(join(stale, 'node_modules', 'cc-safety-net'), { recursive: true });

    try {
      const result = await runUpdate({
        homeDir,
        path: dirname(process.execPath),
        scriptPath: join(running, 'node_modules', '.bin', 'cc-safety-net'),
      });

      expect(result.exitCode).toBe(0);
      expect(existsSync(running)).toBe(true);
      expect(existsSync(stale)).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('fails only npx-cache targets when the cache cannot be cleared', async () => {
    const fake = makeFakeBinHome('safety-net-update-npx-clear-failure', ['claude']);
    writeCursorHook(fake.homeDir);
    writeClaudePluginRecords(fake.homeDir, ['cc-safety-net@cc-marketplace'], {
      enableByDefault: true,
    });
    // A file where the cache directory belongs: existsSync passes, readdirSync throws ENOTDIR.
    mkdirSync(join(fake.homeDir, '.npm'), { recursive: true });
    writeFileSync(join(fake.homeDir, '.npm', '_npx'), 'not a directory');

    try {
      const result = await runUpdate(fake);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toContain('Updated Claude Code integration');
      expect(result.stdout).not.toContain('Cursor hook up to date');
      expect(result.stderr).toContain('Check that every parent path component is a directory');
    } finally {
      rmSync(fake.homeDir, { recursive: true, force: true });
    }
  });

  // The nudge-printing cases differ only in what the update run itself reports first.
  async function expectUpgradeNudgeAfter(
    name: string,
    firstLine: (homeDir: string) => string,
    scriptPath?: string,
  ) {
    const homeDir = makeTempHome(name);
    const expected = firstLine(homeDir);

    try {
      const result = await runUpdate({
        homeDir,
        path: dirname(process.execPath),
        checkLatestVersion: behindCheck,
        ...(scriptPath ? { scriptPath } : {}),
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe(`${expected}\n\n${NUDGE_LINE}`);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  }

  test('nudges a persistent install when the registry has a newer version', async () => {
    await expectUpgradeNudgeAfter(
      'safety-net-update-nudge',
      (homeDir) => `Cursor hook up to date in ${writeCursorHook(homeDir)}`,
    );
  });

  test('nudges a stale persistent install even when no integrations are detected', async () => {
    await expectUpgradeNudgeAfter(
      'safety-net-update-nudge-no-integrations',
      () => 'No installed integrations found. Run `cc-safety-net install` to set one up.',
    );
  });

  test('nudges a persistent install whose path holds a non-numeric bunx directory', async () => {
    await expectUpgradeNudgeAfter(
      'safety-net-update-nudge-bunx-lookalike',
      (homeDir) => `Cursor hook up to date in ${writeCursorHook(homeDir)}`,
      '/opt/bunx-tools/bin/cc-safety-net',
    );
  });

  // Ephemeral runs must skip the registry round-trip entirely, not merely suppress the line.
  async function expectEphemeralRegistrySkip(name: string, scriptPath: string) {
    let checked = false;

    await expectNoUpgradeNudge(name, {
      scriptPath,
      checkLatestVersion: () => {
        checked = true;
        return behindCheck();
      },
    });

    expect(checked).toBe(false);
  }

  test('skips the registry check entirely when running from an npx cache', async () => {
    await expectEphemeralRegistrySkip(
      'safety-net-update-nudge-npx',
      '/Users/u/.npm/_npx/abc123/node_modules/.bin/cc-safety-net',
    );
  });

  test('skips the registry check entirely when running from a bunx cache', async () => {
    await expectEphemeralRegistrySkip(
      'safety-net-update-nudge-bunx',
      '/var/folders/zz/T/bunx-501-cc-safety-net@latest/node_modules/.bin/cc-safety-net',
    );
  });

  test('prints no nudge when the registry check fails', async () => {
    await expectNoUpgradeNudge('safety-net-update-nudge-error', {
      checkLatestVersion: () =>
        Promise.resolve({
          currentVersion: '2.1.0',
          latestVersion: null,
          updateAvailable: false,
          error: 'npm registry returned 500',
        }),
    });
  });

  test('prints no nudge when the running version is current', async () => {
    await expectNoUpgradeNudge('safety-net-update-nudge-current', {
      checkLatestVersion: () =>
        Promise.resolve({
          currentVersion: '2.1.0',
          latestVersion: '2.1.0',
          updateAvailable: false,
        }),
    });
  });

  test('prints the install banner before the reports on a TTY', async () => {
    const fake = makeFakeBinHome('safety-net-update-banner', ['claude']);
    writeClaudePluginRecords(fake.homeDir, ['cc-safety-net@cc-marketplace'], {
      enableByDefault: true,
    });

    try {
      // Spinner frames race the real update, so only the banner and the report are asserted.
      const result = await runUpdate({ ...fake, isTTY: true });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('┏━┛┏━┛  ┏━┛┏━┃┏━┛┏━┛━┏┛┃ ┃  ┏━ ┏━┛━┏┛');
      expect(result.stdout.indexOf('┏━┛┏━┛')).toBeLessThan(
        result.stdout.indexOf('Updated Claude Code integration'),
      );
    } finally {
      rmSync(fake.homeDir, { recursive: true, force: true });
    }
  });

  test('rejects arguments and options', async () => {
    const unexpected = await runCli(['update', 'extra']);
    const unknownOption = await runCli(['update', '--codex']);

    expect(unexpected.exitCode).toBe(1);
    expect(unexpected.stderr).toContain('Unexpected argument for update: extra');
    expect(unknownOption.exitCode).toBe(1);
    expect(unknownOption.stderr).toContain('Unknown option for update: --codex');
  });
});
