import { describe, expect, test } from 'bun:test';
import { chmodSync, readFileSync, writeFileSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { Writable } from 'node:stream';
import { runInstallCommand } from '@/cli/install';
import { canPromptInstallTargets, renderInstallSelection } from '@/cli/install/prompt';
import {
  applyInstallTargetState,
  buildInstallTargetChoicesAsync,
  type InstallTargetChoice,
} from '@/integrations/install/choices';
import {
  type InstallTarget,
  orderInstallTargets,
  runInstallTargetsInOrder,
} from '@/integrations/install/targets';
import { captureConsoleOutput, withEnv, withTempDir } from '../../helpers';
import { createInstallPromptStreams, startInstallPrompt } from '../../integrations/hook-helpers';
import { writeFakeCommands } from '../../integrations/install/install-test-helpers';

function makeChoice(target: InstallTarget, label: string, available: boolean) {
  return { target, flag: `--${target}`, label, available };
}

function expectAvailableTargets(
  choices: readonly InstallTargetChoice[],
  expected: readonly InstallTarget[],
) {
  expect(choices.filter((choice) => choice.available).map((choice) => choice.target)).toEqual([
    ...expected,
  ]);
}

function writeFakeInstallProbeBinaries(homeDir: string) {
  const commands = [
    'codex',
    'claude',
    'agy',
    'gemini',
    'copilot',
    'grok',
    'hermes',
    'kimi',
    'openclaw',
    'opencode',
    'pi',
    'cursor',
    'amp',
  ];
  return writeFakeCommands(
    homeDir,
    Object.fromEntries(
      commands.map((command) => [
        command,
        `process.exit(${command === 'codex' || command === 'gemini' ? 0 : 1});`,
      ]),
    ),
  );
}

async function withFakeInstallProbePath<T>(prefix: string, fn: () => T | Promise<T>) {
  await withTempDir(prefix, async (dir) => {
    const binDir = writeFakeInstallProbeBinaries(dir);

    return withEnv({ PATH: `${binDir}${delimiter}${process.env.PATH ?? ''}` }, fn);
  });
}

type CapturedChoice = {
  target: InstallTarget;
  available: boolean;
  unavailableReason?: string;
};

async function spawnInstallEval<T>(script: string, env: Record<string, string | undefined>) {
  const proc = Bun.spawn([process.execPath, '--eval', script], {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    stderr: 'pipe',
    stdout: 'pipe',
  });
  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);

  expect(await proc.exited).toBe(0);
  expect(stderr).toBe('');
  return JSON.parse(stdout) as T;
}

async function runInstallDispatchProbe(
  homeDir: string,
  options: {
    args?: readonly string[];
    configuredTargets?: readonly InstallTarget[];
    selectedTargets?: readonly InstallTarget[] | null | 'update';
    updateExitCode?: number;
  },
) {
  const choices: CapturedChoice[] = [];
  const events: string[] = [];
  const output: string[] = [];
  const selectedTargets = options.selectedTargets;
  const captured = await withEnv({ HOME: homeDir }, () =>
    captureConsoleOutput(() =>
      runInstallCommand('install', options.args ?? [], {
        detectConfiguredTargets: async () => options.configuredTargets ?? [],
        output: new Writable({
          write(chunk, _encoding, callback) {
            output.push(String(chunk));
            callback();
          },
        }) as NodeJS.WriteStream,
        probeTargets: (command) => {
          events.push(`probe:${command[0]}`);
          return command[0] === 'kimi';
        },
        runUpdate: async () => {
          events.push('update');
          return options.updateExitCode ?? 0;
        },
        ...(selectedTargets === undefined
          ? {}
          : {
              selectTargets: async (_action, offered) => {
                choices.push(
                  ...offered.map((choice) => ({
                    target: choice.target,
                    available: choice.available,
                    unavailableReason: choice.unavailableReason,
                  })),
                );
                events.push(`select:${offered.length}`);
                return selectedTargets;
              },
            }),
      }),
    ),
  );
  expect(captured.stderr).toEqual([]);
  return { choices, exitCode: captured.result, events, output: output.join('') };
}

/** Records the exact argv every runtime CLI receives during a bare `install`. */
async function recordBareInstallProbeArgv(homeDir: string): Promise<string> {
  const logPath = join(homeDir, 'argv.log');
  const binDir = writeFakeCommands(
    homeDir,
    Object.fromEntries(
      ['amp', 'agy', 'claude', 'codex', 'copilot', 'gemini', 'pi'].map((command) => [
        command,
        `appendFileSync(${JSON.stringify(logPath)}, ${JSON.stringify(command)} + ' ' + commandLine + '\\n');
process.stdout.write('1.0.0\\n');`,
      ]),
    ),
  );

  // console.log and the output stream are part of the command protocol, so
  // they are captured and asserted rather than discarded: a probe run that
  // starts printing diagnostics must fail here.
  const probe = await spawnInstallEval<{
    exitCode: number;
    consoleLines: string[];
    output: string;
  }>(
    `
import { Writable } from "node:stream";
import { runInstallCommand } from "./src/cli/install/index.ts";

const consoleLines = [];
console.log = (...args) => {
  consoleLines.push(args.join(" "));
};
let output = "";
const exitCode = await runInstallCommand("install", [], {
  output: new Writable({
    write(chunk, _encoding, callback) {
      output += String(chunk);
      callback();
    },
  }),
  probeTargets: () => true,
  selectTargets: async () => null,
});

process.stdout.write(JSON.stringify({ exitCode, consoleLines, output }));
`,
    { HOME: homeDir, PATH: `${binDir}${delimiter}${process.env.PATH ?? ''}` },
  );
  expect(probe.exitCode).toBe(0);
  expect(probe.consoleLines).toEqual([]);
  expect(probe.output).toBe('Cancelled: nothing was installed.\n');

  return readFileSync(logPath, 'utf-8');
}

async function runInstallGateProbe(
  homeDir: string,
  fixtures: Partial<Record<'codex' | 'claude', string>>,
) {
  const choices: CapturedChoice[] = [];
  const captured = await withEnv({ HOME: homeDir }, () =>
    captureConsoleOutput(() =>
      runInstallCommand('install', [], {
        // Serves the claude fixture too, so a regression that starts inspecting Claude Code
        // through `claude plugin list` sees the enabled plugin and fails the gate assertions.
        fetchVersion: async (command) =>
          ({ 'codex plugin list': fixtures.codex, 'claude plugin list': fixtures.claude })[
            command.join(' ')
          ] ?? null,
        output: new Writable({
          write(_chunk, _encoding, callback) {
            callback();
          },
        }) as NodeJS.WriteStream,
        probeTargets: (command) => Object.keys(fixtures).includes(command[0] ?? ''),
        selectTargets: async (_action, offered) => {
          choices.push(
            ...offered.map((choice) => ({
              target: choice.target,
              available: choice.available,
              unavailableReason: choice.unavailableReason,
            })),
          );
          return null;
        },
      }),
    ),
  );
  expect(captured.stderr).toEqual([]);
  return { choices, exitCode: captured.result };
}

describe('install target availability', () => {
  test('probes target CLIs and preserves install help order', async () => {
    await withFakeInstallProbePath('safety-net-install-probe-', async () => {
      const choices = await buildInstallTargetChoicesAsync();

      expect(choices.map((choice) => choice.target)).toEqual([
        'amp',
        'antigravity-cli',
        'claude-code',
        'codex',
        'cursor',
        'gemini-cli',
        'copilot-cli',
        'grok-build',
        'hermes-agent',
        'kimi-code',
        'openclaw',
        'opencode',
        'pi',
      ]);
      expectAvailableTargets(choices, ['codex', 'gemini-cli']);
    });
  });

  test('can build choices with async probes in parallel', async () => {
    let active = 0;
    let maxActive = 0;
    const choices = await buildInstallTargetChoicesAsync(async (command) => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active -= 1;
      return command[0] === 'codex' || command[0] === 'gemini';
    });

    expect(maxActive).toBeGreaterThan(1);
    expectAvailableTargets(choices, ['codex', 'gemini-cli']);
  });

  async function withFakeWindowsCmdShimPath<T>(prefix: string, fn: () => T | Promise<T>) {
    return await withTempDir(prefix, async (dir) => {
      const comspecPath = join(dir, 'cmd');
      writeFileSync(join(dir, 'codex.CMD'), '');
      writeFileSync(comspecPath, '#!/bin/sh\nexit 0\n');
      chmodSync(comspecPath, 0o755);

      return withEnv(
        {
          COMSPEC: comspecPath,
          PATH: dir,
          PATHEXT: '.CMD',
          _CC_SAFETY_NET_TEST_SPAWN_PLATFORM: 'win32',
        },
        fn,
      );
    });
  }

  test.skipIf(process.platform === 'win32')(
    'probes Windows cmd shims through COMSPEC',
    async () => {
      await withFakeWindowsCmdShimPath('safety-net-install-windows-probe-', async () => {
        expectAvailableTargets(await buildInstallTargetChoicesAsync(), ['codex']);
      });
    },
  );

  test('applies configured state after async CLI probing', async () => {
    const choices = applyInstallTargetState(
      await buildInstallTargetChoicesAsync(
        async (command) => command[0] === 'codex' || command[0] === 'gemini',
      ),
      { action: 'install', configuredTargets: ['codex'] },
    );

    expectAvailableTargets(choices, ['gemini-cli']);
    expect(choices.find((choice) => choice.target === 'codex')?.unavailableReason).toBe(
      'already installed',
    );
    expect(choices.find((choice) => choice.target === 'claude-code')?.unavailableReason).toBe(
      'CLI not installed',
    );
  });

  test('disables already configured integrations while installing', async () => {
    const choices = await buildInstallTargetChoicesAsync(() => true, {
      action: 'install',
      configuredTargets: ['codex', 'kimi-code'],
    });

    expectAvailableTargets(choices, [
      'amp',
      'antigravity-cli',
      'claude-code',
      'cursor',
      'gemini-cli',
      'copilot-cli',
      'grok-build',
      'hermes-agent',
      'openclaw',
      'opencode',
      'pi',
    ]);
    expect(choices.find((choice) => choice.target === 'codex')?.unavailableReason).toBe(
      'already installed',
    );
  });

  test('enables only configured integrations while uninstalling', async () => {
    const choices = await buildInstallTargetChoicesAsync((command) => command[0] !== 'opencode', {
      action: 'uninstall',
      configuredTargets: ['codex', 'kimi-code', 'opencode'],
    });

    expectAvailableTargets(choices, ['codex', 'kimi-code', 'opencode']);
    expect(choices.find((choice) => choice.target === 'claude-code')?.unavailableReason).toBe(
      'not installed',
    );
  });

  test('keeps configured integrations selectable for uninstall without their CLI', async () => {
    const choices = await buildInstallTargetChoicesAsync(() => false, {
      action: 'uninstall',
      configuredTargets: ['amp', 'antigravity-cli', 'cursor', 'kimi-code', 'opencode'],
    });

    expectAvailableTargets(choices, ['amp', 'antigravity-cli', 'cursor', 'kimi-code', 'opencode']);
  });
});

describe('install selection prompt', () => {
  test('detects whether interactive prompting is available', () => {
    const streams = createInstallPromptStreams();

    expect(canPromptInstallTargets(streams.input, streams.output)).toBe(true);
    streams.output.isTTY = false;
    expect(canPromptInstallTargets(streams.input, streams.output)).toBe(false);
  });

  test('waits for cancellation when no integration is selectable', async () => {
    const prompt = startInstallPrompt('uninstall', [makeChoice('codex', 'Codex', false)]);

    expect(prompt.input.isRaw).toBe(true);
    prompt.press('q');

    expect(await prompt.result).toBeNull();
    expect(prompt.input.isRaw).toBe(false);
    expect(prompt.chunks.join('')).toContain('Uninstall CC Safety Net from:');
    expect(prompt.chunks.join('')).toContain(
      'No selectable integrations found for uninstall. q/Esc: close',
    );
  });

  test('never confirms a disabled row when no integration is selectable', async () => {
    const prompt = startInstallPrompt('uninstall', [
      makeChoice('codex', 'Codex', false),
      makeChoice('claude-code', 'Claude Code', false),
    ]);

    // The cursor parks on the disabled row 0; space then enter must not submit it.
    prompt.press(' ', 'enter', 'q');

    expect(await prompt.result).toBeNull();
  });

  test('handles keyboard selection, empty confirm, ignored keys, and abort', async () => {
    const prompt = startInstallPrompt('install', [
      makeChoice('codex', 'Codex', true),
      makeChoice('claude-code', 'Claude Code', false),
      makeChoice('gemini-cli', 'Gemini CLI', true),
    ]);

    // An unknown key is ignored, and confirming an empty selection only rings the bell.
    prompt.press('x', 'enter', 'down', 'up', 'j', 'k', ' ', 'down', ' ', 'enter');

    expect(await prompt.result).toEqual(['codex', 'gemini-cli']);
    expect(prompt.input.isRaw).toBe(false);
    expect(prompt.chunks.join('')).toContain('\x07');
    expect(prompt.chunks.join('')).toContain('Installing selected integrations...');
  });

  test('resolves the update sentinel for u only while installing', async () => {
    const codexOnly = [makeChoice('codex', 'Codex', false)];
    const install = startInstallPrompt('install', codexOnly);
    install.press('u');

    const shifted = startInstallPrompt('install', codexOnly);
    shifted.press('U');

    const uninstall = startInstallPrompt('uninstall', codexOnly);
    uninstall.press('u', 'q');

    expect(await install.result).toBe('update');
    expect(await shifted.result).toBe('update');
    expect(await uninstall.result).toBeNull();
  });

  test('aborts through keyboard shortcuts without selecting targets', async () => {
    const codexOnly = [makeChoice('codex', 'Codex', true)];
    const interrupts: string[] = [];
    const quit = startInstallPrompt('install', codexOnly);
    quit.press('q');

    const interrupted = startInstallPrompt('install', codexOnly, {
      onInterrupt: () => interrupts.push('ctrl-c'),
    });
    interrupted.press('ctrl-c');

    const escaped = startInstallPrompt('install', codexOnly, {
      onInterrupt: () => interrupts.push('escape'),
    });
    escaped.press('esc');

    expect(await quit.result).toBeNull();
    expect(await interrupted.result).toBeNull();
    expect(await escaped.result).toBeNull();
    // Ctrl-C is an interrupt and is raised as the signal; q and Esc are ordinary quits.
    expect(interrupts).toEqual(['ctrl-c']);
  });
});

describe('install selection movement', () => {
  const choices = [
    makeChoice('codex', 'Codex', false),
    makeChoice('claude-code', 'Claude Code', true),
    makeChoice('antigravity-cli', 'Antigravity CLI', false),
    makeChoice('gemini-cli', 'Gemini CLI', true),
  ];

  test('starts on the first available choice and wraps past unavailable rows', async () => {
    const prompt = startInstallPrompt('install', choices);

    // Two moves from row 1 reach row 3 and wrap back to row 1; rows 0 and 2 are never focused.
    prompt.press('down', 'down', ' ', 'enter');

    expect(await prompt.result).toEqual(['claude-code']);
  });

  test('renders unavailable rows and action-specific footers', () => {
    const output = renderInstallSelection(
      'install',
      choices,
      { cursor: 1, selected: ['claude-code'] },
      { color: false },
    );
    const uninstallOutput = renderInstallSelection(
      'uninstall',
      choices,
      { cursor: 1, selected: ['claude-code'] },
      { color: false },
    );

    expect(output).toContain('Install CC Safety Net into:');
    expect(output).toContain('◉ Claude Code');
    expect(output).toContain('◯ Codex (not installed)');
    expect(output).toContain('◯ Antigravity CLI (not installed)');
    expect(output).toContain('u: update installed');
    expect(uninstallOutput).not.toContain('u: update installed');
  });
});

describe('interactive install dispatch', () => {
  test('disables configured integrations before prompting to install', async () => {
    await withTempDir('safety-net-install-configured-', async (homeDir) => {
      const result = await runInstallDispatchProbe(homeDir, {
        configuredTargets: ['cursor', 'kimi-code'],
        selectedTargets: null,
      });

      expect(result.choices.find((choice) => choice.target === 'cursor')).toEqual({
        target: 'cursor',
        available: false,
        unavailableReason: 'already installed',
      });
      // Kimi Code is the exception: its configured row stays selectable because the method
      // prompt is the only path to the native-plugin instructions.
      expect(result.choices.find((choice) => choice.target === 'kimi-code')).toEqual({
        target: 'kimi-code',
        available: true,
        unavailableReason: undefined,
      });
    });
  });

  test('runs the shared update routine when u returns the update sentinel', async () => {
    await withTempDir('safety-net-install-update-', async (homeDir) => {
      const result = await runInstallDispatchProbe(homeDir, {
        selectedTargets: 'update',
        updateExitCode: 7,
      });

      expect(result.exitCode).toBe(7);
      expect(result.events.at(-1)).toBe('update');
    });
  });

  test('probes target availability before no-argument install selection', async () => {
    await withTempDir('safety-net-install-select-before-probe-', async (homeDir) => {
      const result = await runInstallDispatchProbe(homeDir, { selectedTargets: null });

      expect(result.exitCode).toBe(0);
      expect(result.events).toEqual([
        'probe:amp',
        'probe:agy',
        'probe:claude',
        'probe:codex',
        'probe:cursor',
        'probe:gemini',
        'probe:copilot',
        'probe:grok',
        'probe:hermes',
        'probe:kimi',
        'probe:openclaw',
        'probe:opencode',
        'probe:pi',
        'select:13',
      ]);
    });
  });

  test('reports a cancelled install selector as a normal outcome', async () => {
    await withTempDir('safety-net-install-cancel-', async (homeDir) => {
      const result = await runInstallDispatchProbe(homeDir, { selectedTargets: null });

      // Quitting the selector is a decision, not a failure — but it must still say
      // that nothing was written.
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('Cancelled');
    });
  });

  test('runs no state-mutating runtime probe during a bare install', async () => {
    await withTempDir('safety-net-install-argv-', async (homeDir) => {
      const argv = await recordBareInstallProbeArgv(homeDir);

      expect(argv).not.toContain('claude plugin list');
      expect(argv).not.toContain('gemini extensions list');
      expect(argv).not.toContain('copilot plugin list');
      expect(argv).not.toContain('pi -e');
      expect(argv).toContain('codex plugin list');
    });
  });

  test('runs a selected target after resolving install choices', async () => {
    await withTempDir('safety-net-install-selected-probe-', async (homeDir) => {
      const result = await runInstallDispatchProbe(homeDir, { selectedTargets: ['kimi-code'] });

      expect(result.exitCode).toBe(0);
      expect(result.events.at(-1)).toBe('select:13');
    });
  });

  test('probes no unrequested targets for explicit install target', async () => {
    await withTempDir('safety-net-install-explicit-probe-', async (homeDir) => {
      const result = await runInstallDispatchProbe(homeDir, { args: ['--kimi-code'] });

      expect(result.exitCode).toBe(0);
      expect(result.events.filter((event) => event !== 'probe:kimi')).toEqual([]);
    });
  });

  const LEGACY_CODEX_ROW =
    'safety-net@cc-marketplace https://github.com/kenryu42/cc-safety-net.git installed, enabled';
  const NEW_CODEX_ROW =
    'cc-safety-net https://github.com/kenryu42/cc-safety-net.git installed, enabled';

  async function probeCodexGateChoice(prefix: string, codexPluginListFixture: string) {
    return withTempDir(prefix, async (homeDir) => {
      const result = await runInstallGateProbe(homeDir, { codex: codexPluginListFixture });
      return result.choices.find((choice) => choice.target === 'codex');
    });
  }

  const ENABLED_CLAUDE_PLUGIN_LIST = `Installed plugins:

  cc-safety-net@cc-marketplace
    Version: 0.8.2
    Scope: user
    Status: enabled`;

  test('interactive install keeps Claude Code selectable, never inspected', async () => {
    await withTempDir('safety-net-install-claude-enabled-', async (homeDir) => {
      const result = await runInstallGateProbe(homeDir, { claude: ENABLED_CLAUDE_PLUGIN_LIST });
      const claude = result.choices.find((choice) => choice.target === 'claude-code');

      expect(result.exitCode).toBe(0);
      expect(claude?.available).toBe(true);
      expect(claude?.unavailableReason).toBeUndefined();
    });
  });

  test('Codex: interactive install offers codex when only the legacy plugin is installed', async () => {
    const codex = await probeCodexGateChoice('safety-net-install-codex-legacy-', LEGACY_CODEX_ROW);

    expect(codex?.available).toBe(true);
    expect(codex?.unavailableReason).toBeUndefined();
  });

  test('Codex: interactive install offers codex when the replacement is only a not-installed marketplace row', async () => {
    const codex = await probeCodexGateChoice(
      'safety-net-install-codex-avail-',
      `${LEGACY_CODEX_ROW}\ncc-safety-net@cc-marketplace not installed /codex/plugins/cc-safety-net`,
    );

    expect(codex?.available).toBe(true);
    expect(codex?.unavailableReason).toBeUndefined();
  });

  test('Codex: interactive install gates when both plugin generations are installed', async () => {
    const codex = await probeCodexGateChoice(
      'safety-net-install-codex-both-',
      `${LEGACY_CODEX_ROW}\n${NEW_CODEX_ROW}`,
    );

    expect(codex?.unavailableReason).toBe('already installed');
  });

  test('Codex: interactive install gates when the new plugin is installed', async () => {
    const codex = await probeCodexGateChoice('safety-net-install-codex-new-', NEW_CODEX_ROW);

    expect(codex?.unavailableReason).toBe('already installed');
  });

  test('runs selected targets in order and stops on the first failure', async () => {
    const ordered = orderInstallTargets(['pi', 'codex', 'gemini-cli']);
    const calls: InstallTarget[] = [];

    await expect(
      runInstallTargetsInOrder(ordered, async (target) => {
        calls.push(target);
        if (target === 'gemini-cli') throw new Error('gemini failed');
      }),
    ).rejects.toThrow('gemini failed');
    expect(calls).toEqual(['codex', 'gemini-cli']);
  });
});
