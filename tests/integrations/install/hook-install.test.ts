import { afterAll, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { Writable } from 'node:stream';
import { runInstallCommand } from '@/cli/install';
import { buildAmpArtifactHeader } from '@/integrations/amp/artifact';
import { ampArtifactCandidates, resolveAmpArtifactPath } from '@/integrations/amp/install';
import { getAntigravityHooksPath } from '@/integrations/antigravity-cli/hook';
import { getCursorHooksPath, installCursor, uninstallCursor } from '@/integrations/cursor/install';
import { captureConsoleOutput, withEnv } from '../../helpers';
import { makeTempHome, runCli } from '../hook-helpers';
import {
  makeLoggedFakeCommandHome,
  writeAntigravityConfig,
  writeClaudePluginRecords,
  writeLoggedFakeCommand,
} from './install-test-helpers';

const CURSOR_CANONICAL_ENTRY = {
  command: 'npx -y cc-safety-net hook --cursor',
  timeout: 30,
  failClosed: true,
};

const KIMI_HOOK_BLOCK = `[[hooks]]
event = "PreToolUse"
command = "npx -y cc-safety-net hook --kimi-code"`;
const KIMI_INLINE_HOOK =
  '{ event = "PreToolUse", command = "npx -y cc-safety-net hook --kimi-code" }';
const ANTIGRAVITY_HOOK_COMMAND = 'npx -y cc-safety-net hook --agy-cli';
const COPILOT_INSTALL_COMMANDS = [
  'copilot plugin list',
  'copilot plugin marketplace list',
  'copilot plugin marketplace add kenryu42/cc-marketplace',
  'copilot plugin install cc-safety-net@cc-marketplace',
] as const;
const sharedFakeCommandHomes = new Map<string, ReturnType<typeof makeLoggedFakeCommandHome>>();

afterAll(() => {
  sharedFakeCommandHomes.forEach((fake) => {
    rmSync(fake.homeDir, { recursive: true, force: true });
  });
  sharedFakeCommandHomes.clear();
});

function writeGeminiExtension(homeDir: string, options: { disabled?: boolean } = {}) {
  const extensionsDir = join(homeDir, '.gemini', 'extensions');
  mkdirSync(join(extensionsDir, 'gemini-safety-net'), { recursive: true });
  writeFileSync(
    join(extensionsDir, 'extension-enablement.json'),
    JSON.stringify({
      'gemini-safety-net': { overrides: [`${options.disabled ? '!' : ''}${homeDir}/*`] },
    }),
  );
}

function writeKimiConfig(homeDir: string, content: string) {
  const shareDir = join(homeDir, '.kimi-code');
  const configPath = join(shareDir, 'config.toml');
  mkdirSync(shareDir, { recursive: true });
  writeFileSync(configPath, content);
  return configPath;
}

function getOpenCodeConfigPath(homeDir: string, filename = 'opencode.json') {
  return join(homeDir, '.config', 'opencode', filename);
}

function writeOpenCodeConfig(homeDir: string, content: string, filename = 'opencode.json') {
  const configPath = getOpenCodeConfigPath(homeDir, filename);
  mkdirSync(join(configPath, '..'), { recursive: true });
  writeFileSync(configPath, content);
  return configPath;
}

function getOpenCodeCachePath(homeDir: string) {
  return join(homeDir, '.cache', 'opencode', 'packages', 'cc-safety-net@latest');
}

function writeNpxCacheEntry(homeDir: string, entry: string, packageName: string) {
  const entryPath = join(homeDir, '.npm', '_npx', entry);
  const packagePath = join(entryPath, 'node_modules', packageName);
  mkdirSync(packagePath, { recursive: true });
  writeFileSync(join(packagePath, 'x.js'), '');
  return entryPath;
}

function makeFakeBinHome(name: string, commands: readonly string[], isolatedBin = true) {
  if (isolatedBin) {
    const fake = makeLoggedFakeCommandHome(name, commands);
    return { ...fake, path: `${fake.binDir}${delimiter}${process.env.PATH ?? ''}` };
  }

  const key = JSON.stringify(commands);
  const cached = sharedFakeCommandHomes.get(key);
  const fake = cached ?? makeLoggedFakeCommandHome('safety-net-shared-native-command', commands);
  sharedFakeCommandHomes.set(key, fake);
  const homeDir = makeTempHome(name);
  return {
    binDir: fake.binDir,
    homeDir,
    logPath: join(homeDir, 'commands.log'),
    path: `${fake.binDir}${delimiter}${process.env.PATH ?? ''}`,
  };
}

function readCommandLog(logPath: string): string[] {
  const content = existsSync(logPath) ? readFileSync(logPath, 'utf-8').trim() : '';
  return content ? content.split('\n') : [];
}

function normalizedCommandLog(logPath: string): string[] {
  return readCommandLog(logPath).map((entry) => entry.replace(/^.*[\\/]bin[\\/]/, ''));
}

function runNativeCli(
  fake: ReturnType<typeof makeFakeBinHome>,
  action: 'install' | 'uninstall',
  targetFlag: string,
) {
  return captureConsoleOutput(({ stdout }) => {
    const output = new Writable({
      write(chunk, _encoding, callback) {
        stdout.push(String(chunk).trim());
        callback();
      },
    });
    return withEnv(
      {
        HOME: fake.homeDir,
        PATH: fake.path,
        npm_config_cache: join(fake.homeDir, '.npm'),
        CC_SAFETY_NET_TEST_COMMAND_LOG: fake.logPath,
      },
      () => runInstallCommand(action, [targetFlag], { output: output as NodeJS.WriteStream }),
    );
  }).then(({ result: exitCode, stdout, stderr }) => ({
    exitCode,
    stdout: stdout.filter(Boolean).join('\n').trim(),
    stderr: stderr.filter(Boolean).join('\n').trim(),
  }));
}

function expectCodexTrustReminder(result: Awaited<ReturnType<typeof runNativeCli>>) {
  expect(result.stdout).toContain('Start Codex');
  expect(result.stdout).toContain('/hooks');
  expect(result.stdout).toContain('press `t`');
}

function codexPluginListOptions(pluginList: string, options: NativeActionOptions = {}) {
  return {
    isolatedBin: true,
    ...options,
    setup: (fake: ReturnType<typeof makeFakeBinHome>) => {
      writeLoggedFakeCommand(
        fake.homeDir,
        'codex',
        `if (commandLine === 'plugin list') console.log(${JSON.stringify(pluginList)});`,
      );
    },
  };
}

type NativeActionOptions = {
  isolatedBin?: boolean;
  setup?: (fake: ReturnType<typeof makeFakeBinHome>) => void;
  assert?: (
    fake: ReturnType<typeof makeFakeBinHome>,
    result: Awaited<ReturnType<typeof runNativeCli>>,
  ) => void;
};

async function expectNativeAction(
  action: 'install' | 'uninstall',
  targetFlag: string,
  fakeCommands: readonly string[],
  expectedCommands: readonly string[],
  stdoutContains: string,
  options: NativeActionOptions = {},
) {
  const fake = makeFakeBinHome(
    `safety-net-${targetFlag.slice(2)}-${action}`,
    fakeCommands,
    options.isolatedBin ?? false,
  );

  try {
    options.setup?.(fake);
    const result = await runNativeCli(fake, action, targetFlag);

    expect(result.exitCode).toBe(0);
    expect(normalizedCommandLog(fake.logPath)).toEqual([...expectedCommands]);
    expect(result.stdout).toContain(stdoutContains);
    options.assert?.(fake, result);
  } finally {
    rmSync(fake.homeDir, { recursive: true, force: true });
  }
}

async function expectNativeInstall(
  targetFlag: string,
  fakeCommands: readonly string[],
  expectedCommands: readonly string[],
  stdoutContains: string,
  options: NativeActionOptions = {},
) {
  await expectNativeAction(
    'install',
    targetFlag,
    fakeCommands,
    expectedCommands,
    stdoutContains,
    options,
  );
}

function expectCopilotInstall(options: NativeActionOptions = {}) {
  return expectNativeInstall(
    '--copilot-cli',
    ['copilot'],
    COPILOT_INSTALL_COMMANDS,
    'Installed GitHub Copilot CLI integration',
    options,
  );
}

async function expectNativeUninstall(
  targetFlag: string,
  fakeCommands: readonly string[],
  expectedCommands: readonly string[],
  stdoutContains: string,
) {
  await expectNativeAction('uninstall', targetFlag, fakeCommands, expectedCommands, stdoutContains);
}

async function runKimiInstall(homeDir: string, configPath: string) {
  const result = await runCli(['install', '--kimi-code'], '', { HOME: homeDir });
  return { result, content: readFileSync(configPath, 'utf-8') };
}

async function runKimiUninstall(homeDir: string, configPath: string) {
  const result = await runCli(['uninstall', '--kimi-code'], '', { HOME: homeDir });
  return { result, content: readFileSync(configPath, 'utf-8') };
}

async function runAntigravityInstall(homeDir: string, configPath: string) {
  const result = await runCli(['install', '--agy-cli'], '', { HOME: homeDir });
  return { result, config: JSON.parse(readFileSync(configPath, 'utf-8')) };
}

async function runAntigravityUninstall(homeDir: string, configPath: string) {
  const result = await runCli(['uninstall', '--agy-cli'], '', { HOME: homeDir });
  return { result, config: JSON.parse(readFileSync(configPath, 'utf-8')) };
}

function getCopilotSettingsPath(homeDir: string) {
  return join(homeDir, '.copilot', 'settings.json');
}

function writeCopilotSettings(homeDir: string, content: string) {
  const settingsPath = getCopilotSettingsPath(homeDir);
  mkdirSync(join(settingsPath, '..'), { recursive: true });
  writeFileSync(settingsPath, content);
}

function expectInstalledKimiInlineHook(
  installed: Awaited<ReturnType<typeof runKimiInstall>>,
  preservedContent: string[],
) {
  expect(installed.result.exitCode).toBe(0);
  preservedContent.forEach((content) => {
    expect(installed.content).toContain(content);
  });
  expect(installed.content).toContain(KIMI_INLINE_HOOK);
  expect(installed.content).not.toContain('[[hooks]]');
}

function expectSingleAntigravityHook(config: unknown) {
  expect(JSON.stringify(config).match(/cc-safety-net hook --agy-cli/g)?.length).toBe(1);
}

describe('install command', () => {
  test('requires exactly one install target', async () => {
    const homeDir = makeTempHome('safety-net-install');

    try {
      const result = await runCli(['install'], '', { HOME: homeDir });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Choose exactly one install target:');
      expect(result.stderr).toContain('--codex');
      expect(result.stderr).toContain('--kimi-code');
      expect(existsSync(join(homeDir, '.kimi-code', 'config.toml'))).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('rejects multiple install targets', async () => {
    const homeDir = makeTempHome('safety-net-install');

    try {
      const result = await runCli(['install', '--kimi-code', '--agy-cli'], '', {
        HOME: homeDir,
      });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Choose exactly one install target:');
      expect(existsSync(join(homeDir, '.kimi-code', 'config.toml'))).toBe(false);
      expect(existsSync(getAntigravityHooksPath(homeDir))).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Codex: installs marketplace plugin and prints trust reminder', async () => {
    await expectNativeInstall(
      '--codex',
      ['codex'],
      [
        'codex plugin list',
        'codex plugin marketplace add kenryu42/cc-marketplace',
        'codex plugin add cc-safety-net@cc-marketplace',
      ],
      'Installed Codex integration',
      {
        assert: (_fake, result) => expectCodexTrustReminder(result),
      },
    );
  });

  test('Claude Code: installs marketplace plugin through native CLI', async () => {
    await expectNativeInstall(
      '--claude-code',
      ['claude'],
      [
        'claude plugin marketplace add kenryu42/cc-marketplace',
        'claude plugin marketplace update cc-marketplace',
        'claude plugin install cc-safety-net@cc-marketplace',
      ],
      'Installed Claude Code integration',
    );
  });

  test('Claude Code: uninstalls the legacy plugin after installing the replacement', async () => {
    await expectNativeInstall(
      '--claude-code',
      ['claude'],
      [
        'claude plugin marketplace add kenryu42/cc-marketplace',
        'claude plugin marketplace update cc-marketplace',
        'claude plugin install cc-safety-net@cc-marketplace',
        'claude plugin uninstall safety-net@cc-marketplace',
      ],
      'Installed Claude Code integration',
      {
        setup: (fake) => {
          writeClaudePluginRecords(fake.homeDir, ['safety-net@cc-marketplace'], {
            enabled: { 'safety-net@cc-marketplace': true },
            version: 2,
          });
        },
      },
    );
  });

  test('Claude Code: updates the installed replacement plugin', async () => {
    await expectNativeInstall(
      '--claude-code',
      ['claude'],
      [
        'claude plugin marketplace update cc-marketplace',
        'claude plugin update cc-safety-net@cc-marketplace',
      ],
      'Updated Claude Code integration',
      {
        setup: (fake) => {
          writeClaudePluginRecords(fake.homeDir, ['cc-safety-net@cc-marketplace'], {
            enabled: { 'cc-safety-net@cc-marketplace': true },
            version: 2,
          });
        },
      },
    );
  });

  test('Claude Code: removes the legacy plugin after updating the replacement', async () => {
    await expectNativeInstall(
      '--claude-code',
      ['claude'],
      [
        'claude plugin marketplace update cc-marketplace',
        'claude plugin update cc-safety-net@cc-marketplace',
        'claude plugin uninstall safety-net@cc-marketplace',
      ],
      'Updated Claude Code integration',
      {
        setup: (fake) => {
          writeClaudePluginRecords(
            fake.homeDir,
            ['cc-safety-net@cc-marketplace', 'safety-net@cc-marketplace'],
            {
              enabled: {
                'cc-safety-net@cc-marketplace': true,
                'safety-net@cc-marketplace': true,
              },
              version: 2,
            },
          );
        },
      },
    );
  });

  test('Claude Code: enables a disabled plugin during update', async () => {
    await expectNativeInstall(
      '--claude-code',
      ['claude'],
      [
        'claude plugin marketplace update cc-marketplace',
        'claude plugin update cc-safety-net@cc-marketplace',
        'claude plugin enable cc-safety-net@cc-marketplace',
      ],
      'Updated Claude Code integration',
      {
        setup: (fake) => {
          writeClaudePluginRecords(fake.homeDir, ['cc-safety-net@cc-marketplace'], {
            enabled: { 'cc-safety-net@cc-marketplace': false },
            version: 2,
          });
        },
      },
    );
  });

  test('Codex: removes the legacy plugin after installing the replacement', async () => {
    await expectNativeInstall(
      '--codex',
      ['codex'],
      [
        'codex plugin list',
        'codex plugin marketplace add kenryu42/cc-marketplace',
        'codex plugin add cc-safety-net@cc-marketplace',
        'codex plugin remove safety-net@cc-marketplace',
      ],
      'Installed Codex integration',
      codexPluginListOptions(
        'safety-net@cc-marketplace https://github.com/kenryu42/cc-safety-net.git installed, enabled',
      ),
    );
  });

  test('Codex: updates the installed replacement plugin and prints trust reminder', async () => {
    await expectNativeInstall(
      '--codex',
      ['codex'],
      [
        'codex plugin list',
        'codex plugin marketplace upgrade cc-marketplace',
        'codex plugin add cc-safety-net@cc-marketplace',
      ],
      'Updated Codex integration',
      codexPluginListOptions('cc-safety-net@cc-marketplace installed, enabled', {
        assert: (_fake, result) => expectCodexTrustReminder(result),
      }),
    );
  });

  test('Codex: removes the legacy plugin after updating the replacement', async () => {
    await expectNativeInstall(
      '--codex',
      ['codex'],
      [
        'codex plugin list',
        'codex plugin marketplace upgrade cc-marketplace',
        'codex plugin add cc-safety-net@cc-marketplace',
        'codex plugin remove safety-net@cc-marketplace',
      ],
      'Updated Codex integration',
      codexPluginListOptions(
        'cc-safety-net@cc-marketplace installed, enabled\nsafety-net@cc-marketplace installed, enabled',
      ),
    );
  });

  test('Codex: removes an installed-but-disabled legacy plugin', async () => {
    await expectNativeInstall(
      '--codex',
      ['codex'],
      [
        'codex plugin list',
        'codex plugin marketplace add kenryu42/cc-marketplace',
        'codex plugin add cc-safety-net@cc-marketplace',
        'codex plugin remove safety-net@cc-marketplace',
      ],
      'Installed Codex integration',
      codexPluginListOptions(
        'safety-net@cc-marketplace https://github.com/kenryu42/cc-safety-net.git installed, disabled',
      ),
    );
  });

  test('Codex: refreshes an already registered marketplace instead of re-adding it', async () => {
    await expectNativeInstall(
      '--codex',
      ['codex'],
      [
        'codex plugin list',
        'codex plugin marketplace upgrade cc-marketplace',
        'codex plugin add cc-safety-net@cc-marketplace',
      ],
      'Installed Codex integration',
      codexPluginListOptions(
        'Marketplace `cc-marketplace`\ncc-safety-net@cc-marketplace not installed https://github.com/kenryu42/cc-safety-net.git',
      ),
    );
  });

  test('Codex: ignores a not-installed legacy marketplace row', async () => {
    await expectNativeInstall(
      '--codex',
      ['codex'],
      [
        'codex plugin list',
        'codex plugin marketplace add kenryu42/cc-marketplace',
        'codex plugin add cc-safety-net@cc-marketplace',
      ],
      'Installed Codex integration',
      codexPluginListOptions('safety-net@cc-marketplace not installed /codex/plugins/safety-net'),
    );
  });

  test('GitHub Copilot CLI: uninstalls the legacy plugin after installing the replacement', async () => {
    await expectNativeInstall(
      '--copilot-cli',
      ['copilot'],
      [
        'copilot plugin list',
        'copilot plugin marketplace list',
        'copilot plugin marketplace add kenryu42/cc-marketplace',
        'copilot plugin install cc-safety-net@cc-marketplace',
        'copilot plugin uninstall copilot-safety-net',
      ],
      'Installed GitHub Copilot CLI integration',
      {
        isolatedBin: true,
        setup: (fake) => {
          writeLoggedFakeCommand(
            fake.homeDir,
            'copilot',
            `if (commandLine === 'plugin list') {
  console.log(${JSON.stringify('Installed plugins:\n  copilot-safety-net (v1.0.0)')});
}`,
          );
        },
      },
    );
  });

  test('GitHub Copilot CLI: migrates the pre-rename marketplace plugin', async () => {
    await expectNativeInstall(
      '--copilot-cli',
      ['copilot'],
      [
        'copilot plugin list',
        'copilot plugin marketplace list',
        'copilot plugin marketplace update cc-marketplace',
        'copilot plugin install cc-safety-net@cc-marketplace',
        'copilot plugin uninstall safety-net@cc-marketplace',
      ],
      'Installed GitHub Copilot CLI integration',
      {
        isolatedBin: true,
        setup: (fake) => {
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
        },
      },
    );
  });

  test('GitHub Copilot CLI: updates the new plugin and removes the legacy plugin', async () => {
    await expectNativeInstall(
      '--copilot-cli',
      ['copilot'],
      [
        'copilot plugin list',
        'copilot plugin marketplace update cc-marketplace',
        'copilot plugin update cc-safety-net@cc-marketplace',
        'copilot plugin uninstall copilot-safety-net',
      ],
      'Updated GitHub Copilot CLI integration',
      {
        isolatedBin: true,
        setup: (fake) => {
          writeLoggedFakeCommand(
            fake.homeDir,
            'copilot',
            `if (commandLine === 'plugin list') {
  console.log(${JSON.stringify(
    'Installed plugins:\n  cc-safety-net@cc-marketplace (v1.0.0)\n  copilot-safety-net (v1.0.0)',
  )});
}`,
          );
        },
      },
    );
  });

  test('legacy uninstall failure does not fail the install', async () => {
    const fake = makeFakeBinHome('safety-net-legacy-uninstall-fail', ['claude']);
    writeLoggedFakeCommand(
      fake.homeDir,
      'claude',
      `if (commandLine === 'plugin uninstall safety-net@cc-marketplace') {
  console.error('uninstall failed');
  process.exit(42);
}`,
    );
    writeClaudePluginRecords(fake.homeDir, ['safety-net@cc-marketplace'], {
      enabled: { 'safety-net@cc-marketplace': true },
      version: 2,
    });

    try {
      const result = await runNativeCli(fake, 'install', '--claude-code');

      expect(result.exitCode).toBe(0);
      expect(normalizedCommandLog(fake.logPath)).toEqual([
        'claude plugin marketplace add kenryu42/cc-marketplace',
        'claude plugin marketplace update cc-marketplace',
        'claude plugin install cc-safety-net@cc-marketplace',
        'claude plugin uninstall safety-net@cc-marketplace',
      ]);
      expect(result.stderr).toContain('claude plugin uninstall safety-net@cc-marketplace');
      expect(result.stdout).toContain('Installed Claude Code integration');
    } finally {
      rmSync(fake.homeDir, { recursive: true, force: true });
    }
  });

  test('Gemini CLI: installs extension through native CLI', async () => {
    await expectNativeInstall(
      '--gemini-cli',
      ['gemini'],
      ['gemini extensions install https://github.com/kenryu42/gemini-safety-net --consent'],
      'Installed Gemini CLI integration',
    );
  });

  test('Gemini CLI: updates and enables a disabled extension', async () => {
    await expectNativeInstall(
      '--gemini-cli',
      ['gemini'],
      ['gemini extensions update gemini-safety-net', 'gemini extensions enable gemini-safety-net'],
      'Updated Gemini CLI integration',
      {
        setup: (fake) => {
          writeGeminiExtension(fake.homeDir, { disabled: true });
        },
      },
    );
  });

  test('Gemini CLI: updates the extension when it is already enabled', async () => {
    await expectNativeInstall(
      '--gemini-cli',
      ['gemini'],
      ['gemini extensions update gemini-safety-net'],
      'Updated Gemini CLI integration',
      {
        setup: (fake) => {
          writeGeminiExtension(fake.homeDir);
        },
      },
    );
  });

  test('GitHub Copilot CLI: installs marketplace plugin through native CLI', async () => {
    await expectCopilotInstall();
  });

  test('GitHub Copilot CLI: refreshes an already registered marketplace', async () => {
    await expectNativeInstall(
      '--copilot-cli',
      ['copilot'],
      [
        'copilot plugin list',
        'copilot plugin marketplace list',
        'copilot plugin marketplace update cc-marketplace',
        'copilot plugin install cc-safety-net@cc-marketplace',
      ],
      'Installed GitHub Copilot CLI integration',
      {
        isolatedBin: true,
        setup: (fake) => {
          writeLoggedFakeCommand(
            fake.homeDir,
            'copilot',
            `if (commandLine === 'plugin marketplace list') {
  console.log(${JSON.stringify('Registered marketplaces:\n  • cc-marketplace (GitHub: kenryu42/cc-marketplace)')});
}`,
          );
        },
      },
    );
  });

  test('GitHub Copilot CLI: updates the plugin when it is already installed', async () => {
    await expectNativeInstall(
      '--copilot-cli',
      ['copilot'],
      [
        'copilot plugin list',
        'copilot plugin marketplace update cc-marketplace',
        'copilot plugin update cc-safety-net@cc-marketplace',
      ],
      'Updated GitHub Copilot CLI integration',
      {
        isolatedBin: true,
        setup: (fake) => {
          writeLoggedFakeCommand(
            fake.homeDir,
            'copilot',
            `if (commandLine === 'plugin list') {
  console.log(${JSON.stringify('Installed plugins:\n  • cc-safety-net@cc-marketplace (v1.0.6)')});
}`,
          );
        },
      },
    );
  });

  test('GitHub Copilot CLI: enables a disabled plugin in settings after install', async () => {
    await expectCopilotInstall({
      setup: (fake) => {
        writeCopilotSettings(
          fake.homeDir,
          `${JSON.stringify({ enabledPlugins: { 'cc-safety-net@cc-marketplace': false } }, null, 2)}\n`,
        );
      },
      assert: (fake, result) => {
        const settings = JSON.parse(readFileSync(getCopilotSettingsPath(fake.homeDir), 'utf-8'));
        expect(settings.enabledPlugins['cc-safety-net@cc-marketplace']).toBe(true);
        expect(result.stdout).toContain('Enabled cc-safety-net@cc-marketplace plugin');
      },
    });
  });

  test('GitHub Copilot CLI: tolerates JSONC comments in settings.json', async () => {
    const jsoncSettings = `{
  // plugins I turned off
  "enabledPlugins": {
    "some-other-plugin": false,
  },
}
`;
    await expectCopilotInstall({
      setup: (fake) => {
        writeCopilotSettings(fake.homeDir, jsoncSettings);
      },
      assert: (fake) => {
        expect(readFileSync(getCopilotSettingsPath(fake.homeDir), 'utf-8')).toBe(jsoncSettings);
      },
    });
  });

  test('GitHub Copilot CLI: enabling a disabled plugin preserves JSONC comments and formatting', async () => {
    const jsoncSettings = `{
  // plugins I turned off
  "enabledPlugins": {
    "some-other-plugin": false,
    "cc-safety-net@cc-marketplace": false,
  },
}
`;
    await expectCopilotInstall({
      setup: (fake) => {
        writeCopilotSettings(fake.homeDir, jsoncSettings);
      },
      assert: (fake, result) => {
        expect(readFileSync(getCopilotSettingsPath(fake.homeDir), 'utf-8')).toBe(
          jsoncSettings.replace(
            '"cc-safety-net@cc-marketplace": false',
            '"cc-safety-net@cc-marketplace": true',
          ),
        );
        expect(result.stdout).toContain('Enabled cc-safety-net@cc-marketplace plugin');
      },
    });
  });

  test('GitHub Copilot CLI: does not create settings.json when absent', async () => {
    await expectCopilotInstall({
      assert: (fake) => {
        expect(existsSync(getCopilotSettingsPath(fake.homeDir))).toBe(false);
      },
    });
  });

  test('Pi: removes the disabling extensions filter after install', async () => {
    await expectNativeInstall(
      '--pi',
      ['pi'],
      ['pi install npm:cc-safety-net'],
      'Installed Pi integration',
      {
        setup: (fake) => {
          const agentDir = join(fake.homeDir, '.pi', 'agent');
          mkdirSync(agentDir, { recursive: true });
          writeFileSync(
            join(agentDir, 'settings.json'),
            `${JSON.stringify(
              {
                packages: [
                  { source: 'npm:cc-safety-net', extensions: ['-dist/pi/index.js'] },
                  'npm:pi-web-access',
                  {
                    source: '../../Developer/420024-lab/cc-safety-net',
                    extensions: ['-dist/pi/index.js'],
                  },
                ],
              },
              null,
              2,
            )}\n`,
          );
        },
        assert: (fake, result) => {
          const settings = JSON.parse(
            readFileSync(join(fake.homeDir, '.pi', 'agent', 'settings.json'), 'utf-8'),
          );
          expect(settings.packages[0]).toEqual({ source: 'npm:cc-safety-net' });
          expect(settings.packages[1]).toBe('npm:pi-web-access');
          expect(settings.packages[2]).toEqual({
            source: '../../Developer/420024-lab/cc-safety-net',
            extensions: ['-dist/pi/index.js'],
          });
          expect(result.stdout).toContain('Enabled npm:cc-safety-net extensions');
        },
      },
    );
  });

  test('OpenCode: clears stale cache before installing latest plugin through native CLI', async () => {
    await expectNativeInstall(
      '--opencode',
      ['opencode'],
      ['opencode plugin -g -f cc-safety-net@latest'],
      'Installed OpenCode integration',
      {
        isolatedBin: true,
        setup: (fake) => {
          const cachePath = join(
            fake.homeDir,
            '.cache',
            'opencode',
            'packages',
            'cc-safety-net@latest',
          );
          mkdirSync(cachePath, { recursive: true });
          writeFileSync(join(cachePath, 'stale.txt'), 'stale');
          // `opencode plugin` reifies the package into the cache, and the install now refuses to
          // report success without it, so the fake has to leave the same layout behind.
          const packageDir = join(cachePath, 'node_modules', 'cc-safety-net');
          writeLoggedFakeCommand(
            fake.homeDir,
            'opencode',
            `const packageDir = ${JSON.stringify(packageDir)};
mkdirSync(packageDir, { recursive: true });
writeFileSync(join(packageDir, 'package.json'), '{"main":"index.js"}');
writeFileSync(join(packageDir, 'index.js'), 'export const CCSafetyNetPlugin = () => {};');`,
          );
        },
        assert: (fake) => {
          expect(
            existsSync(
              join(
                fake.homeDir,
                '.cache',
                'opencode',
                'packages',
                'cc-safety-net@latest',
                'stale.txt',
              ),
            ),
          ).toBe(false);
        },
      },
    );
  });

  test('Pi: installs package through native CLI', async () => {
    await expectNativeInstall(
      '--pi',
      ['pi'],
      ['pi install npm:cc-safety-net'],
      'Installed Pi integration',
    );
  });

  test('native installer fails fast and reports command output', async () => {
    const fake = makeFakeBinHome('safety-net-native-install-fail', ['codex']);
    writeLoggedFakeCommand(
      fake.homeDir,
      'codex',
      `if (commandLine === 'plugin list') process.exit(0);
console.log('native stdout');
console.error('native stderr');
process.exit(42);`,
    );

    try {
      const result = await runNativeCli(fake, 'install', '--codex');

      expect(result.exitCode).toBe(1);
      expect(normalizedCommandLog(fake.logPath)).toEqual([
        'codex plugin list',
        'codex plugin marketplace add kenryu42/cc-marketplace',
      ]);
      expect(result.stderr).toContain('codex plugin marketplace add kenryu42/cc-marketplace');
      expect(result.stderr).toContain('native stdout');
      expect(result.stderr).toContain('native stderr');
    } finally {
      rmSync(fake.homeDir, { recursive: true, force: true });
    }
  });

  test('Antigravity CLI: creates hooks.json when missing', async () => {
    const homeDir = makeTempHome('safety-net-antigravity-install');
    const npxCacheEntry = writeNpxCacheEntry(homeDir, 'hashA', 'cc-safety-net');

    try {
      const result = await runCli(['install', '--agy-cli'], '', {
        HOME: homeDir,
        npm_config_cache: join(homeDir, '.npm'),
      });
      const configPath = getAntigravityHooksPath(homeDir);
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain(`Installed Antigravity CLI hook in ${configPath}`);
      expect(config['cc-safety-net'].PreToolUse[0].hooks).toEqual([
        {
          type: 'command',
          command: ANTIGRAVITY_HOOK_COMMAND,
          timeout: 30,
        },
      ]);
      expect(config['cc-safety-net'].PreToolUse[0]).not.toHaveProperty('matcher');
      expect(existsSync(npxCacheEntry)).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Antigravity CLI: appends managed hook to existing hooks.json', async () => {
    const homeDir = makeTempHome('safety-net-antigravity-install');
    const configPath = writeAntigravityConfig(homeDir, {
      'existing-hook': {
        PreToolUse: [
          {
            matcher: 'run_command',
            hooks: [{ type: 'command', command: './scripts/check.sh', timeout: 10 }],
          },
        ],
      },
    });

    try {
      const installed = await runAntigravityInstall(homeDir, configPath);

      expect(installed.result.exitCode).toBe(0);
      expect(installed.config['existing-hook'].PreToolUse[0].hooks[0].command).toBe(
        './scripts/check.sh',
      );
      expect(installed.config['cc-safety-net'].PreToolUse[0].hooks[0].command).toBe(
        ANTIGRAVITY_HOOK_COMMAND,
      );
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Antigravity CLI: install is idempotent', async () => {
    const homeDir = makeTempHome('safety-net-antigravity-install');
    const configPath = writeAntigravityConfig(homeDir, {
      'cc-safety-net': {
        PreToolUse: [{ hooks: [{ command: ANTIGRAVITY_HOOK_COMMAND }] }],
      },
    });

    try {
      const installed = await runAntigravityInstall(homeDir, configPath);

      expect(installed.result.exitCode).toBe(0);
      expectSingleAntigravityHook(installed.config);
      expect(installed.result.stdout).toContain('already installed');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Antigravity CLI: enables disabled managed hook during install', async () => {
    const homeDir = makeTempHome('safety-net-antigravity-install');
    const configPath = writeAntigravityConfig(homeDir, {
      'cc-safety-net': {
        enabled: false,
        PreToolUse: [{ hooks: [{ command: ANTIGRAVITY_HOOK_COMMAND }] }],
      },
    });

    try {
      const installed = await runAntigravityInstall(homeDir, configPath);

      expect(installed.result.exitCode).toBe(0);
      expect(installed.config['cc-safety-net'].enabled).toBe(true);
      expectSingleAntigravityHook(installed.config);
      expect(installed.result.stdout).toContain(`Installed Antigravity CLI hook in ${configPath}`);
      expect(installed.result.stdout).not.toContain('already installed');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Antigravity CLI: rejects malformed hooks.json without rewriting', async () => {
    const homeDir = makeTempHome('safety-net-antigravity-install');
    const configPath = getAntigravityHooksPath(homeDir);
    mkdirSync(join(configPath, '..'), { recursive: true });
    writeFileSync(configPath, '{ invalid json');

    try {
      const result = await runCli(['install', '--agy-cli'], '', { HOME: homeDir });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Failed to parse Antigravity hooks config');
      expect(readFileSync(configPath, 'utf-8')).toBe('{ invalid json');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Antigravity CLI: rejects incompatible cc-safety-net entry', async () => {
    const homeDir = makeTempHome('safety-net-antigravity-install');
    writeAntigravityConfig(homeDir, { 'cc-safety-net': false });

    try {
      const result = await runCli(['install', '--agy-cli'], '', { HOME: homeDir });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain(
        'Antigravity hooks config entry "cc-safety-net" must be an object',
      );
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi Code: creates default config when missing', async () => {
    const homeDir = makeTempHome('safety-net-kimi-install');
    const npxCacheEntry = writeNpxCacheEntry(homeDir, 'hashA', 'cc-safety-net');

    try {
      const result = await runCli(['install', '--kimi-code'], '', {
        HOME: homeDir,
        npm_config_cache: join(homeDir, '.npm'),
      });
      const configPath = join(homeDir, '.kimi-code', 'config.toml');

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain(`Installed Kimi Code hook in ${configPath}`);
      expect(readFileSync(configPath, 'utf-8').trim()).toBe(KIMI_HOOK_BLOCK);
      expect(readFileSync(configPath, 'utf-8')).not.toContain('matcher');
      expect(existsSync(npxCacheEntry)).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi Code: honors KIMI_CODE_HOME and removes top-level hooks array', async () => {
    const homeDir = makeTempHome('safety-net-kimi-install');
    const shareDir = join(homeDir, 'custom-kimi');
    const configPath = join(shareDir, 'config.toml');
    mkdirSync(shareDir, { recursive: true });
    writeFileSync(
      configPath,
      `model = "kimi-k2"
hooks = []

[nested]
hooks = []
`,
    );

    try {
      const result = await runCli(['install', '--kimi-code'], '', {
        HOME: homeDir,
        KIMI_CODE_HOME: shareDir,
      });
      const content = readFileSync(configPath, 'utf-8');

      expect(result.exitCode).toBe(0);
      expect(content.startsWith('model = "kimi-k2"\nhooks = []')).toBe(false);
      expect(content).toContain('[nested]\nhooks = []');
      expect(content).toContain(KIMI_HOOK_BLOCK);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi Code: install is idempotent', async () => {
    const homeDir = makeTempHome('safety-net-kimi-install');
    const configPath = writeKimiConfig(homeDir, `${KIMI_HOOK_BLOCK}\n`);

    try {
      const installed = await runKimiInstall(homeDir, configPath);

      expect(installed.result.exitCode).toBe(0);
      expect(installed.content.match(/cc-safety-net hook --kimi-code/g)?.length).toBe(1);
      expect(installed.result.stdout).toContain('already installed');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi Code: preserves non-empty inline hooks array syntax', async () => {
    const homeDir = makeTempHome('safety-net-kimi-install');
    const configPath = writeKimiConfig(
      homeDir,
      `hooks = [
     { event = "PreToolUse", matcher = "Shell|WriteFile", command = ".kimi/hooks/validate.sh", timeout = 10 },
     { event = "PostToolUse", matcher = "WriteFile", command = "prettier --write" },
     { event = "Stop", command = ".kimi/hooks/check-complete.sh" }
]
`,
    );

    try {
      const installed = await runKimiInstall(homeDir, configPath);

      expectInstalledKimiInlineHook(installed, ['hooks = [', '.kimi/hooks/validate.sh']);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi Code: preserves inline hooks array with hash comments', async () => {
    const homeDir = makeTempHome('safety-net-kimi-install');
    const configPath = writeKimiConfig(
      homeDir,
      `hooks = [
     # ignore comment delimiters ] }
     { event = "PostToolUse", matcher = "WriteFile", command = "prettier --write" }
]
`,
    );

    try {
      const installed = await runKimiInstall(homeDir, configPath);
      const preservedComment = '# ignore comment delimiters ] }';

      expectInstalledKimiInlineHook(installed, [preservedComment, 'prettier --write']);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('rejects unexpected install positional arguments', async () => {
    const homeDir = makeTempHome('safety-net-install');

    try {
      const result = await runCli(['install', '--kimi-code', 'extra'], '', {
        HOME: homeDir,
      });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Unexpected argument for install: extra');
      expect(existsSync(join(homeDir, '.kimi-code', 'config.toml'))).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('rejects unknown install options before target validation', async () => {
    const homeDir = makeTempHome('safety-net-install');

    try {
      const result = await runCli(['install', '--unknown', '--kimi-code'], '', {
        HOME: homeDir,
      });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Unknown option for install: --unknown');
      expect(existsSync(join(homeDir, '.kimi-code', 'config.toml'))).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('adds filesystem guidance for install path errors', async () => {
    const homePath = join(tmpdir(), `safety-net-install-file-${Date.now()}`);
    writeFileSync(homePath, '');

    try {
      const result = await runCli(['install', '--kimi-code'], '', { HOME: homePath });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Check that every parent path component is a directory.');
    } finally {
      rmSync(homePath, { force: true });
    }
  });
});

describe('uninstall command', () => {
  test('requires exactly one uninstall target', async () => {
    const homeDir = makeTempHome('safety-net-uninstall');

    try {
      const result = await runCli(['uninstall'], '', { HOME: homeDir });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Choose exactly one uninstall target:');
      expect(result.stderr).toContain('--codex');
      expect(result.stderr).toContain('--agy-cli');
      expect(result.stderr).toContain('--kimi-code');
      expect(result.stderr).toContain('--opencode');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('rejects multiple uninstall targets', async () => {
    const homeDir = makeTempHome('safety-net-uninstall');

    try {
      const result = await runCli(['uninstall', '--kimi-code', '--agy-cli'], '', {
        HOME: homeDir,
      });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Choose exactly one uninstall target:');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Claude Code: uninstalls marketplace plugin through native CLI', async () => {
    await expectNativeUninstall(
      '--claude-code',
      ['claude'],
      [
        'claude plugin uninstall cc-safety-net@cc-marketplace',
        'claude plugin marketplace remove cc-marketplace',
      ],
      'Uninstalled Claude Code integration',
    );
  });

  test('Codex: uninstalls marketplace plugin through native CLI', async () => {
    await expectNativeUninstall(
      '--codex',
      ['codex'],
      [
        'codex plugin remove cc-safety-net@cc-marketplace',
        'codex plugin marketplace remove cc-marketplace',
      ],
      'Uninstalled Codex integration',
    );
  });

  test('Gemini CLI: uninstalls extension through native CLI', async () => {
    await expectNativeUninstall(
      '--gemini-cli',
      ['gemini'],
      ['gemini extensions uninstall gemini-safety-net'],
      'Uninstalled Gemini CLI integration',
    );
  });

  test('GitHub Copilot CLI: uninstalls marketplace plugin through native CLI', async () => {
    await expectNativeUninstall(
      '--copilot-cli',
      ['copilot'],
      [
        'copilot plugin uninstall cc-safety-net@cc-marketplace',
        'copilot plugin marketplace remove cc-marketplace',
      ],
      'Uninstalled GitHub Copilot CLI integration',
    );
  });

  test('Pi: uninstalls package through native CLI', async () => {
    await expectNativeUninstall(
      '--pi',
      ['pi'],
      ['pi uninstall npm:cc-safety-net'],
      'Uninstalled Pi integration',
    );
  });

  test('OpenCode: removes cache and plugin from JSON config', async () => {
    const homeDir = makeTempHome('safety-net-opencode-uninstall');
    const cachePath = getOpenCodeCachePath(homeDir);
    const configPath = writeOpenCodeConfig(
      homeDir,
      `${JSON.stringify(
        {
          plugin: ['other-plugin', 'cc-safety-net@latest'],
          theme: 'system',
        },
        null,
        2,
      )}\n`,
    );
    mkdirSync(cachePath, { recursive: true });
    writeFileSync(join(cachePath, 'stale.txt'), 'stale');

    try {
      const result = await runCli(['uninstall', '--opencode'], '', { HOME: homeDir });
      const config = JSON.parse(readFileSync(configPath, 'utf-8')) as { plugin: string[] };

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain(`Uninstalled OpenCode plugin from ${configPath}`);
      expect(existsSync(cachePath)).toBe(false);
      expect(config.plugin).toEqual(['other-plugin']);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('OpenCode: removes plugin from JSONC config while preserving unrelated content', async () => {
    const homeDir = makeTempHome('safety-net-opencode-uninstall');
    const configPath = writeOpenCodeConfig(
      homeDir,
      `{
        // keep this comment
        "plugin": [
          "other-plugin",
          "cc-safety-net@latest", // managed plugin
        ],
        "theme": "system",
      }`,
      'opencode.jsonc',
    );

    try {
      const result = await runCli(['uninstall', '--opencode'], '', { HOME: homeDir });
      const content = readFileSync(configPath, 'utf-8');

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain(`Uninstalled OpenCode plugin from ${configPath}`);
      expect(content).toContain('// keep this comment');
      expect(content).toContain('"other-plugin"');
      expect(content).toContain('"theme": "system"');
      expect(content).not.toContain('cc-safety-net');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('OpenCode: uninstall is idempotent when config is missing', async () => {
    const homeDir = makeTempHome('safety-net-opencode-uninstall');
    const cachePath = getOpenCodeCachePath(homeDir);
    mkdirSync(cachePath, { recursive: true });
    writeFileSync(join(cachePath, 'stale.txt'), 'stale');

    try {
      const result = await runCli(['uninstall', '--opencode'], '', { HOME: homeDir });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('OpenCode plugin not installed');
      expect(existsSync(cachePath)).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('OpenCode: uninstall is idempotent when managed plugin is absent', async () => {
    const homeDir = makeTempHome('safety-net-opencode-uninstall');
    const configPath = writeOpenCodeConfig(
      homeDir,
      `${JSON.stringify({ plugin: ['other-plugin'] }, null, 2)}\n`,
    );

    try {
      const result = await runCli(['uninstall', '--opencode'], '', { HOME: homeDir });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain(`OpenCode plugin not installed in ${configPath}`);
      expect(JSON.parse(readFileSync(configPath, 'utf-8')).plugin).toEqual(['other-plugin']);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('OpenCode: malformed config fails without rewriting', async () => {
    const homeDir = makeTempHome('safety-net-opencode-uninstall');
    const configPath = writeOpenCodeConfig(homeDir, '{ invalid json }');

    try {
      const result = await runCli(['uninstall', '--opencode'], '', { HOME: homeDir });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Failed to parse OpenCode config');
      expect(readFileSync(configPath, 'utf-8')).toBe('{ invalid json }');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi Code: removes managed table hook block only', async () => {
    const homeDir = makeTempHome('safety-net-kimi-uninstall');
    const configPath = writeKimiConfig(
      homeDir,
      `model = "kimi-k2"

${KIMI_HOOK_BLOCK}

[[hooks]]
event = "PostToolUse"
matcher = "WriteFile"
command = "prettier --write"
`,
    );

    try {
      const uninstalled = await runKimiUninstall(homeDir, configPath);

      expect(uninstalled.result.exitCode).toBe(0);
      expect(uninstalled.result.stdout).toContain(`Uninstalled Kimi Code hook from ${configPath}`);
      expect(uninstalled.content).toContain('prettier --write');
      expect(uninstalled.content).not.toContain('cc-safety-net hook --kimi-code');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi Code: removes managed inline hook and preserves inline syntax', async () => {
    const homeDir = makeTempHome('safety-net-kimi-uninstall');
    const configPath = writeKimiConfig(
      homeDir,
      `hooks = [
     { event = "PreToolUse", matcher = "Shell|WriteFile", command = ".kimi/hooks/validate.sh", timeout = 10 },
     ${KIMI_INLINE_HOOK},
     { event = "Stop", command = ".kimi/hooks/check-complete.sh" }
]
`,
    );

    try {
      const uninstalled = await runKimiUninstall(homeDir, configPath);

      expect(uninstalled.result.exitCode).toBe(0);
      expect(uninstalled.content).toContain('hooks = [');
      expect(uninstalled.content).toContain('.kimi/hooks/validate.sh');
      expect(uninstalled.content).toContain('.kimi/hooks/check-complete.sh');
      expect(uninstalled.content).not.toContain('cc-safety-net hook --kimi-code');
      expect(uninstalled.content).not.toContain('[[hooks]]');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi Code: removes inline hook with hash comments in hooks array', async () => {
    const homeDir = makeTempHome('safety-net-kimi-uninstall');
    const configPath = writeKimiConfig(
      homeDir,
      `hooks = [
     # ignore comment delimiters ] }
     { event = "PreToolUse", matcher = "Shell|WriteFile", command = ".kimi/hooks/validate.sh", timeout = 10 },
     ${KIMI_INLINE_HOOK}
]
`,
    );

    try {
      const uninstalled = await runKimiUninstall(homeDir, configPath);
      const preservedComment = '# ignore comment delimiters ] }';

      expect(uninstalled.result.exitCode).toBe(0);
      expect(uninstalled.content).toContain(preservedComment);
      expect(uninstalled.content).toContain('.kimi/hooks/validate.sh');
      expect(uninstalled.content).not.toContain('cc-safety-net hook --kimi-code');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('rejects unexpected uninstall positional arguments', async () => {
    const homeDir = makeTempHome('safety-net-uninstall');
    const configPath = writeKimiConfig(homeDir, `${KIMI_HOOK_BLOCK}\n`);

    try {
      const result = await runCli(['uninstall', '--kimi-code', 'extra'], '', {
        HOME: homeDir,
      });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Unexpected argument for uninstall: extra');
      expect(readFileSync(configPath, 'utf-8')).toBe(`${KIMI_HOOK_BLOCK}\n`);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi Code: uninstall is idempotent when managed hook is absent', async () => {
    const homeDir = makeTempHome('safety-net-kimi-uninstall');
    const configPath = writeKimiConfig(
      homeDir,
      `[[hooks]]
event = "PostToolUse"
matcher = "WriteFile"
command = "prettier --write"
`,
    );

    try {
      const uninstalled = await runKimiUninstall(homeDir, configPath);

      expect(uninstalled.result.exitCode).toBe(0);
      expect(uninstalled.result.stdout).toContain('not installed');
      expect(uninstalled.content).toContain('prettier --write');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Antigravity CLI: removes managed hook and preserves unrelated hooks', async () => {
    const homeDir = makeTempHome('safety-net-antigravity-uninstall');
    const configPath = writeAntigravityConfig(homeDir, {
      'cc-safety-net': {
        PreToolUse: [
          {
            hooks: [
              { type: 'command', command: ANTIGRAVITY_HOOK_COMMAND, timeout: 30 },
              { type: 'command', command: './scripts/keep.sh', timeout: 10 },
            ],
          },
        ],
        Stop: [{ type: 'command', command: './scripts/stop.sh' }],
      },
      other: {
        PreToolUse: [{ hooks: [{ type: 'command', command: './scripts/other.sh' }] }],
      },
    });

    try {
      const uninstalled = await runAntigravityUninstall(homeDir, configPath);
      const serialized = JSON.stringify(uninstalled.config);

      expect(uninstalled.result.exitCode).toBe(0);
      expect(uninstalled.result.stdout).toContain(
        `Uninstalled Antigravity CLI hook from ${configPath}`,
      );
      expect(serialized).not.toContain(ANTIGRAVITY_HOOK_COMMAND);
      expect(serialized).toContain('./scripts/keep.sh');
      expect(serialized).toContain('./scripts/stop.sh');
      expect(serialized).toContain('./scripts/other.sh');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Antigravity CLI: uninstall is idempotent when managed hook is absent', async () => {
    const homeDir = makeTempHome('safety-net-antigravity-uninstall');
    const configPath = writeAntigravityConfig(homeDir, {
      other: {
        PreToolUse: [{ hooks: [{ type: 'command', command: './scripts/other.sh' }] }],
      },
    });

    try {
      const uninstalled = await runAntigravityUninstall(homeDir, configPath);

      expect(uninstalled.result.exitCode).toBe(0);
      expect(uninstalled.result.stdout).toContain('not installed');
      expect(JSON.stringify(uninstalled.config)).toContain('./scripts/other.sh');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });
});

function writeCursorConfig(homeDir: string, config: unknown): string {
  const configPath = getCursorHooksPath(homeDir);
  mkdirSync(join(configPath, '..'), { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  return configPath;
}

function readCursorConfig(configPath: string): {
  version?: unknown;
  hooks?: { preToolUse?: unknown[] } & Record<string, unknown>;
} & Record<string, unknown> {
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

function installAndReadCursorConfig(homeDir: string, configPath: string) {
  const result = installCursor(homeDir);
  return { config: readCursorConfig(configPath), result };
}

describe('Cursor install', () => {
  test('creates hooks.json with version 1 and the canonical entry when missing', () => {
    const homeDir = makeTempHome('safety-net-cursor-install');

    try {
      const result = installCursor(homeDir);
      const config = readCursorConfig(result.path);

      expect(result.alreadyInstalled).toBe(false);
      expect(result.path).toBe(getCursorHooksPath(homeDir));
      expect(config.version).toBe(1);
      expect(config.hooks?.preToolUse).toEqual([CURSOR_CANONICAL_ENTRY]);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('preserves unrelated top-level keys, hook events, and preToolUse entries', () => {
    const homeDir = makeTempHome('safety-net-cursor-install');
    const configPath = writeCursorConfig(homeDir, {
      version: 1,
      customKey: 'keep-me',
      hooks: {
        afterFileEdit: [{ command: './scripts/other.sh' }],
        preToolUse: [{ command: './scripts/other.sh', timeout: 5 }],
      },
    });

    try {
      const result = installCursor(homeDir);
      const config = readCursorConfig(configPath);

      expect(result.alreadyInstalled).toBe(false);
      expect(config.customKey).toBe('keep-me');
      expect(config.hooks?.afterFileEdit).toEqual([{ command: './scripts/other.sh' }]);
      expect(config.hooks?.preToolUse).toEqual([
        { command: './scripts/other.sh', timeout: 5 },
        CURSOR_CANONICAL_ENTRY,
      ]);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('is idempotent when the canonical entry is already present', () => {
    const homeDir = makeTempHome('safety-net-cursor-install');
    const configPath = writeCursorConfig(homeDir, {
      version: 1,
      hooks: { preToolUse: [CURSOR_CANONICAL_ENTRY] },
    });
    const before = readFileSync(configPath, 'utf-8');

    try {
      const result = installCursor(homeDir);

      expect(result.alreadyInstalled).toBe(true);
      expect(readFileSync(configPath, 'utf-8')).toBe(before);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('repairs a drifted managed entry and reports installed', () => {
    const homeDir = makeTempHome('safety-net-cursor-install');
    const configPath = writeCursorConfig(homeDir, {
      version: 1,
      hooks: {
        preToolUse: [{ command: 'npx -y cc-safety-net hook --cursor', timeout: 5, matcher: '*' }],
      },
    });

    try {
      const { config, result } = installAndReadCursorConfig(homeDir, configPath);

      expect(result.alreadyInstalled).toBe(false);
      expect(config.hooks?.preToolUse).toEqual([CURSOR_CANONICAL_ENTRY]);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('collapses duplicate managed entries into one canonical entry at the first position', () => {
    const homeDir = makeTempHome('safety-net-cursor-install');
    const configPath = writeCursorConfig(homeDir, {
      version: 1,
      hooks: {
        preToolUse: [
          { command: 'npx -y cc-safety-net hook --cursor', timeout: 5 },
          { command: './scripts/other.sh' },
          { command: 'npx -y cc-safety-net hook --cursor', timeout: 30, failClosed: true },
        ],
      },
    });

    try {
      const { config, result } = installAndReadCursorConfig(homeDir, configPath);

      expect(result.alreadyInstalled).toBe(false);
      expect(config.hooks?.preToolUse).toEqual([
        CURSOR_CANONICAL_ENTRY,
        { command: './scripts/other.sh' },
      ]);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('rejects invalid JSON without writing', () => {
    const homeDir = makeTempHome('safety-net-cursor-install');
    const configPath = getCursorHooksPath(homeDir);
    mkdirSync(join(configPath, '..'), { recursive: true });
    writeFileSync(configPath, '{ invalid json');

    try {
      expect(() => installCursor(homeDir)).toThrow('Failed to parse Cursor hooks config');
      expect(readFileSync(configPath, 'utf-8')).toBe('{ invalid json');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('rejects unsupported versions without writing', () => {
    const homeDir = makeTempHome('safety-net-cursor-install');
    const configPath = writeCursorConfig(homeDir, { version: 2, hooks: {} });
    const before = readFileSync(configPath, 'utf-8');

    try {
      expect(() => installCursor(homeDir)).toThrow('must set "version": 1');
      expect(readFileSync(configPath, 'utf-8')).toBe(before);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('rejects incompatible preToolUse shape without writing', () => {
    const homeDir = makeTempHome('safety-net-cursor-install');
    const configPath = writeCursorConfig(homeDir, {
      version: 1,
      hooks: { preToolUse: { command: 'x' } },
    });
    const before = readFileSync(configPath, 'utf-8');

    try {
      expect(() => installCursor(homeDir)).toThrow('"hooks.preToolUse" must be an array');
      expect(readFileSync(configPath, 'utf-8')).toBe(before);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('routes through the install command dispatch', async () => {
    const homeDir = makeTempHome('safety-net-cursor-install');
    const safetyNetCacheEntry = writeNpxCacheEntry(homeDir, 'hashA', 'cc-safety-net');
    const otherCacheEntry = writeNpxCacheEntry(homeDir, 'hashB', 'other-pkg');

    try {
      const result = await runCli(['install', '--cursor'], '', {
        HOME: homeDir,
        npm_config_cache: join(homeDir, '.npm'),
      });
      const configPath = getCursorHooksPath(homeDir);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain(`Installed Cursor hook in ${configPath}`);
      expect(readCursorConfig(configPath).hooks?.preToolUse).toEqual([CURSOR_CANONICAL_ENTRY]);
      expect(existsSync(safetyNetCacheEntry)).toBe(false);
      expect(existsSync(otherCacheEntry)).toBe(true);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });
});

describe('Cursor uninstall', () => {
  test('leaves the npx cache unchanged through command dispatch', async () => {
    const homeDir = makeTempHome('safety-net-cursor-uninstall');
    writeCursorConfig(homeDir, {
      version: 1,
      hooks: { preToolUse: [CURSOR_CANONICAL_ENTRY] },
    });
    const npxCacheEntry = writeNpxCacheEntry(homeDir, 'hashA', 'cc-safety-net');

    try {
      const result = await runCli(['uninstall', '--cursor'], '', { HOME: homeDir });

      expect(result.exitCode).toBe(0);
      expect(existsSync(npxCacheEntry)).toBe(true);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('removes only exact-command entries and retains unrelated structure', () => {
    const homeDir = makeTempHome('safety-net-cursor-uninstall');
    const configPath = writeCursorConfig(homeDir, {
      version: 1,
      customKey: 'keep-me',
      hooks: {
        afterFileEdit: [{ command: './scripts/other.sh' }],
        preToolUse: [CURSOR_CANONICAL_ENTRY, { command: './scripts/other.sh' }],
      },
    });

    try {
      const result = uninstallCursor(homeDir);
      const config = readCursorConfig(configPath);

      expect(result.alreadyInstalled).toBe(true);
      expect(config.customKey).toBe('keep-me');
      expect(config.hooks?.afterFileEdit).toEqual([{ command: './scripts/other.sh' }]);
      expect(config.hooks?.preToolUse).toEqual([{ command: './scripts/other.sh' }]);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('retains an empty preToolUse container after removing the only managed entry', () => {
    const homeDir = makeTempHome('safety-net-cursor-uninstall');
    const configPath = writeCursorConfig(homeDir, {
      version: 1,
      hooks: { preToolUse: [CURSOR_CANONICAL_ENTRY] },
    });

    try {
      const result = uninstallCursor(homeDir);

      expect(result.alreadyInstalled).toBe(true);
      expect(readCursorConfig(configPath).hooks?.preToolUse).toEqual([]);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('is idempotent when no managed entry exists', () => {
    const homeDir = makeTempHome('safety-net-cursor-uninstall');
    const configPath = writeCursorConfig(homeDir, {
      version: 1,
      hooks: { preToolUse: [{ command: './scripts/other.sh' }] },
    });
    const before = readFileSync(configPath, 'utf-8');

    try {
      const result = uninstallCursor(homeDir);

      expect(result.alreadyInstalled).toBe(false);
      expect(readFileSync(configPath, 'utf-8')).toBe(before);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('reports not installed when the config file is missing', () => {
    const homeDir = makeTempHome('safety-net-cursor-uninstall');

    try {
      const result = uninstallCursor(homeDir);

      expect(result.alreadyInstalled).toBe(false);
      expect(existsSync(getCursorHooksPath(homeDir))).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('rejects invalid JSON without writing', () => {
    const homeDir = makeTempHome('safety-net-cursor-uninstall');
    const configPath = getCursorHooksPath(homeDir);
    mkdirSync(join(configPath, '..'), { recursive: true });
    writeFileSync(configPath, '{ invalid json');

    try {
      expect(() => uninstallCursor(homeDir)).toThrow('Failed to parse Cursor hooks config');
      expect(readFileSync(configPath, 'utf-8')).toBe('{ invalid json');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });
});

function writeAmpArtifactFixture(dir: string, version = '9.9.9', name = 'artifact.ts'): string {
  const artifactPath = join(dir, name);
  writeFileSync(artifactPath, `${buildAmpArtifactHeader(version)}export default function () {}\n`);
  return artifactPath;
}

describe('Amp artifact resolution', () => {
  test('lists candidate paths relative to the installed CLI', () => {
    const candidates = ampArtifactCandidates();
    expect(candidates.length).toBe(2);
    for (const candidate of candidates) {
      expect(candidate.endsWith(join('amp', 'cc-safety-net', 'index.ts'))).toBe(true);
    }
  });

  test('resolves the first existing candidate and throws when none exist', () => {
    const homeDir = makeTempHome('safety-net-amp-resolve');
    try {
      const artifactPath = writeAmpArtifactFixture(homeDir);
      expect(resolveAmpArtifactPath(['/no/such/artifact.ts', artifactPath])).toBe(artifactPath);
      expect(() => resolveAmpArtifactPath(['/no/such/artifact.ts'])).toThrow(
        'Packaged Amp plugin artifact not found',
      );
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });
});
