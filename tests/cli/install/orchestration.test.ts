import { describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { delimiter, dirname, join } from 'node:path';
import { PassThrough, Writable } from 'node:stream';
import { runInstallCommand } from '@/cli/install';
import { AMP_MANAGED_HEADER } from '@/integrations/amp/artifact';
import type { InstallTargetChoice } from '@/integrations/install/choices';
import type { InstallTarget } from '@/integrations/install/targets';
import { withEnv } from '../../helpers';
import { makeTempHome, runCli } from '../../integrations/hook-helpers';
import {
  writeClaudePluginRecords,
  writeFakeCommands,
} from '../../integrations/install/install-test-helpers';
import { createLolcatOutput, stripAnsi } from '../lolcat-test-helpers';

const PROBED_CLIS = [
  'agy',
  'amp',
  'claude',
  'codex',
  'copilot',
  'cursor',
  'gemini',
  'grok',
  'hermes',
  'kimi',
  'openclaw',
  'opencode',
  'pi',
] as const;

function makeFakeBin(homeDir: string, bodies: Readonly<Record<string, string>>) {
  return `${writeFakeCommands(homeDir, bodies)}${delimiter}${process.env.PATH ?? ''}`;
}

/** Runs a real `install --<target>` against a hand-written settings file and returns its final text. */
async function installOverSettings(
  name: string,
  binary: string,
  targetFlag: string,
  settingsRelativePath: string,
  settings: string,
) {
  const homeDir = makeTempHome(name);
  const path = makeFakeBin(homeDir, { [binary]: '' });
  const settingsPath = join(homeDir, settingsRelativePath);
  mkdirSync(dirname(settingsPath), { recursive: true });
  writeFileSync(settingsPath, settings);

  const result = await runCli(['install', targetFlag], '', { HOME: homeDir, PATH: path });

  expect(result.exitCode).toBe(0);
  return { stdout: result.stdout, text: readFileSync(settingsPath, 'utf-8') };
}

/** Drives the interactive picker for `action` and captures the choices it was offered. */
async function probeInstallChoices(
  action: 'install' | 'uninstall',
  name: string,
  fixtures: Readonly<Record<string, string>>,
  setup: (homeDir: string) => void = () => {},
) {
  const homeDir = makeTempHome(name);
  setup(homeDir);
  const path = makeFakeBin(
    homeDir,
    Object.fromEntries(PROBED_CLIS.map((command) => [command, fixtures[command] ?? ''])),
  );
  const choices: InstallTargetChoice[] = [];

  const exitCode = await withEnv({ HOME: homeDir, PATH: path }, () =>
    runInstallCommand(action, [], {
      fetchVersion: async () => null,
      output: new Writable({
        write(_chunk, _encoding, callback) {
          callback();
        },
      }) as unknown as NodeJS.WriteStream,
      probeTargets: () => true,
      selectTargets: async (_action, offered) => {
        choices.push(...offered);
        return null;
      },
    }),
  );

  // This helper always cancels the selector, which is an ordinary outcome.
  expect(exitCode).toBe(0);
  return (target: InstallTarget) => choices.find((choice) => choice.target === target);
}

describe('Kimi Code install method', () => {
  const kimiConfigPath = (homeDir: string) => join(homeDir, '.kimi-code', 'config.toml');
  const GLOBAL_HOOK_CONFIG = `[[hooks]]
event = "PreToolUse"
command = "npx -y cc-safety-net hook --kimi-code"
`;

  async function runKimiInstall(
    homeDir: string,
    options: {
      input?: NodeJS.ReadStream;
      selectKimiInstallMethod?: () => Promise<'global-hook' | 'plugin' | null>;
    },
  ) {
    const chunks: string[] = [];
    const exitCode = await withEnv({ HOME: homeDir, KIMI_CODE_HOME: undefined }, () =>
      runInstallCommand('install', ['--kimi-code'], {
        output: new Writable({
          write(chunk, _encoding, callback) {
            chunks.push(String(chunk));
            callback();
          },
        }) as unknown as NodeJS.WriteStream,
        ...options,
      }),
    );
    return { exitCode, text: stripAnsi(chunks.join('')) };
  }

  test('the plugin method prints the native install steps and writes no config', async () => {
    const homeDir = makeTempHome('safety-net-kimi-method-plugin');

    const result = await runKimiInstall(homeDir, {
      selectKimiInstallMethod: async () => 'plugin',
    });

    expect(result.exitCode).toBe(0);
    expect(result.text).toContain('/plugins install https://github.com/kenryu42/cc-safety-net');
    expect(result.text).toContain('/reload');
    expect(result.text).toContain('fail-open');
    // The instructions must not name a verification command: a destructive example would
    // run for real whenever the hook is not yet active.
    expect(result.text).not.toContain('shred');
    expect(result.text).not.toContain('git reset --hard');
    expect(result.text).not.toContain('CAUTION');
    expect(existsSync(kimiConfigPath(homeDir))).toBeFalse();
  });

  test('the plugin method warns about an installed global hook and leaves it untouched', async () => {
    const homeDir = makeTempHome('safety-net-kimi-method-caution');
    const configPath = kimiConfigPath(homeDir);
    mkdirSync(dirname(configPath), { recursive: true });
    writeFileSync(configPath, GLOBAL_HOOK_CONFIG);

    const result = await runKimiInstall(homeDir, {
      selectKimiInstallMethod: async () => 'plugin',
    });

    expect(result.exitCode).toBe(0);
    expect(result.text).toContain('CAUTION');
    expect(result.text).toContain('cc-safety-net uninstall --kimi-code');
    expect(readFileSync(configPath, 'utf-8')).toBe(GLOBAL_HOOK_CONFIG);
  });

  test('the global-hook method installs the config.toml hook', async () => {
    const homeDir = makeTempHome('safety-net-kimi-method-global');

    const result = await runKimiInstall(homeDir, {
      selectKimiInstallMethod: async () => 'global-hook',
    });

    expect(result.exitCode).toBe(0);
    expect(result.text).toContain('Installed Kimi Code hook');
    expect(readFileSync(kimiConfigPath(homeDir), 'utf-8')).toContain(
      'npx -y cc-safety-net hook --kimi-code',
    );
  });

  test('cancelling the method prompt installs nothing and exits 0', async () => {
    const homeDir = makeTempHome('safety-net-kimi-method-cancel');

    const result = await runKimiInstall(homeDir, {
      selectKimiInstallMethod: async () => null,
    });

    expect(result.exitCode).toBe(0);
    expect(result.text).toContain('Cancelled: Kimi Code integration was not installed.');
    expect(existsSync(kimiConfigPath(homeDir))).toBeFalse();
  });

  test('the picker keeps a configured Kimi Code row selectable and names its state', async () => {
    const getChoice = await withEnv({ KIMI_CODE_HOME: undefined }, () =>
      probeInstallChoices('install', 'safety-net-kimi-configured-row', {}, (homeDir) => {
        mkdirSync(join(homeDir, '.kimi-code'), { recursive: true });
        writeFileSync(join(homeDir, '.kimi-code', 'config.toml'), GLOBAL_HOOK_CONFIG);
      }),
    );

    const kimi = getChoice('kimi-code');
    expect(kimi?.available).toBeTrue();
    expect(kimi?.label).toContain('global hook installed');
  });

  test('a non-interactive --kimi-code install falls back to the global hook', async () => {
    const homeDir = makeTempHome('safety-net-kimi-method-fallback');

    const result = await runKimiInstall(homeDir, {
      input: new PassThrough() as unknown as NodeJS.ReadStream,
    });

    expect(result.exitCode).toBe(0);
    expect(readFileSync(kimiConfigPath(homeDir), 'utf-8')).toContain(
      'npx -y cc-safety-net hook --kimi-code',
    );
  });
});

describe('install settings rewrites', () => {
  test('Pi: leaves settings.json untouched when the managed package has no extensions filter', async () => {
    const settings = `{
  "packages": [
    "npm:pi-web-access",
    { "source": "npm:cc-safety-net" },
    { "source": "../cc-safety-net", "extensions": ["-dist/pi/index.js"] }
  ]
}
`;
    const result = await installOverSettings(
      'safety-net-pi-no-filter',
      'pi',
      '--pi',
      '.pi/agent/settings.json',
      settings,
    );

    expect(result.text).toBe(settings);
    expect(result.stdout).toContain('Installed Pi integration');
    expect(result.stdout).not.toContain('Enabled npm:cc-safety-net extensions');
  });

  test('GitHub Copilot CLI: enables a disabled plugin whose raw text form is unmatchable', async () => {
    const result = await installOverSettings(
      'safety-net-copilot-unmatchable',
      'copilot',
      '--copilot-cli',
      '.copilot/settings.json',
      `{
  "enabledPlugins": {
    "cc-safety-net@cc-marketplace": /* turned off */ false
  }
}
`,
    );

    expect(JSON.parse(result.text).enabledPlugins['cc-safety-net@cc-marketplace']).toBe(true);
    expect(result.stdout).toContain('Enabled cc-safety-net@cc-marketplace plugin');
  });
});

describe('flagged install loading state', () => {
  // Spinner frames are asserted deterministically in tests/cli/startup/banner.test.ts with a
  // controlled pending promise; asserting a frame here would race the real install against
  // the spinner delay timer, an ordering no injected sleep can pin down.
  test('prints the install message after a flagged install runs', async () => {
    const homeDir = makeTempHome('safety-net-install-spinner');
    const path = makeFakeBin(homeDir, { pi: '' });
    const { chunks, output } = createLolcatOutput();

    const exitCode = await withEnv({ HOME: homeDir, PATH: path }, () =>
      runInstallCommand('install', ['--pi'], {
        output: output as unknown as NodeJS.WriteStream,
      }),
    );

    expect(exitCode).toBe(0);
    expect(stripAnsi(chunks.join(''))).toContain('Installed Pi integration');
  });
});

describe('interactive uninstall detection', () => {
  test('offers a detected-but-disabled Claude Code plugin for uninstall', async () => {
    const choice = await probeInstallChoices(
      'uninstall',
      'safety-net-uninstall-claude-disabled',
      {},
      (homeDir) => {
        writeClaudePluginRecords(homeDir, ['cc-safety-net@cc-marketplace'], {
          enabled: { 'cc-safety-net@cc-marketplace': false },
        });
      },
    );

    expect(choice('claude-code')?.available).toBe(true);
    expect(choice('claude-code')?.unavailableReason).toBeUndefined();
  });

  test('offers an installed Copilot CLI plugin for uninstall', async () => {
    const uninstallChoice = await probeInstallChoices(
      'uninstall',
      'safety-net-uninstall-copilot-plugin',
      {},
      (homeDir) => {
        mkdirSync(
          join(homeDir, '.copilot', 'installed-plugins', 'cc-marketplace', 'cc-safety-net'),
          {
            recursive: true,
          },
        );
      },
    );

    expect(uninstallChoice('copilot-cli')?.available).toBe(true);
    expect(uninstallChoice('copilot-cli')?.unavailableReason).toBeUndefined();
  });
});

/**
 * `install --amp` writes into the account's hosted Personal Plugins repository, so the CLI is
 * driven against a fake `amp` and `git` on PATH: no network and no real repository.
 */
function makeAmpFakeBin(homeDir: string, seedCheckout: boolean) {
  return makeFakeBin(homeDir, {
    amp: `if (args[0] === 'plugins' && args[1] === 'repositories') {
  console.log('[{"scope":"user","exists":true,"viewerCanWrite":true,"cloneRef":"tester/-/plugins"}]');
}
if (args[0] === 'clone' && args[1] === 'user-plugins' && ${seedCheckout}) {
  const pluginDir = join(args[2] ?? '', 'cc-safety-net');
  mkdirSync(pluginDir, { recursive: true });
  writeFileSync(join(pluginDir, 'index.ts'), ${JSON.stringify(AMP_MANAGED_HEADER)} + '\\n');
}`,
    git: `appendFileSync(join(process.env.HOME ?? '', 'git.log'), commandLine + '\\n');
// An empty porcelain status means "nothing staged", which skips the commit and push.
if (commandLine === 'status --porcelain') console.log('M  cc-safety-net/index.ts');`,
  });
}

/**
 * An empty PATH, so no real `amp` can be resolved and the missing-CLI path cannot reach the
 * account's hosted repository. The CLI under test starts through the current Bun executable.
 */
function makeEmptyPath(homeDir: string) {
  const binDir = join(homeDir, 'runtime-bin');
  mkdirSync(binDir, { recursive: true });
  return binDir;
}

describe('Amp personal-scope install command', () => {
  test('routes install --amp to the personal plugins repository', async () => {
    const homeDir = makeTempHome('safety-net-amp-install-cli');
    const path = makeAmpFakeBin(homeDir, false);
    const maskingPlugin = join(homeDir, '.config', 'amp', 'plugins', 'cc-safety-net.ts');
    mkdirSync(join(maskingPlugin, '..'), { recursive: true });
    writeFileSync(maskingPlugin, `${AMP_MANAGED_HEADER}\nexport default 0;\n`);

    const result = await runCli(['install', '--amp'], '', { HOME: homeDir, PATH: path });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Installed Amp Code plugin at tester/-/plugins/cc-safety-net');
    expect(result.stdout).toContain('including Orb threads');
    expect(readFileSync(join(homeDir, 'git.log'), 'utf-8')).toContain('push origin HEAD');
    expect(existsSync(maskingPlugin)).toBe(false);
  });

  test('routes uninstall --amp to the personal plugins repository', async () => {
    const homeDir = makeTempHome('safety-net-amp-uninstall-cli');
    const path = makeAmpFakeBin(homeDir, true);

    const result = await runCli(['uninstall', '--amp'], '', { HOME: homeDir, PATH: path });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(
      'Uninstalled Amp Code plugin from tester/-/plugins/cc-safety-net',
    );
    expect(readFileSync(join(homeDir, 'git.log'), 'utf-8')).toContain(
      'rm -- cc-safety-net/index.ts',
    );
  });

  test('fails with an actionable message when the amp CLI is missing', async () => {
    const homeDir = makeTempHome('safety-net-amp-missing-cli');

    const result = await runCli(['install', '--amp'], '', {
      HOME: homeDir,
      PATH: makeEmptyPath(homeDir),
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Amp CLI not found');
  });
});
