/**
 * Hermes Agent managed-plugin artifact, installer, uninstaller, and doctor detection.
 *
 * Every case runs against an isolated temporary home; nothing here touches the real
 * `~/.hermes` directory, the real Hermes config, or the real audit logs.
 */

import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { delimiter, join } from 'node:path';
import {
  buildHermesAgentPluginFiles,
  HERMES_AGENT_MANAGED_HEADER,
  HERMES_AGENT_PLUGIN_NAME,
} from '@/integrations/hermes-agent/artifact';
import { detect } from '@/integrations/hermes-agent/detect';
import {
  getHermesAgentPluginDir,
  installHermesAgent,
  uninstallHermesAgent,
} from '@/integrations/hermes-agent/install';
import { getPackageVersion } from '@/integrations/system-info';
import { createSpawnEnv, withEnv } from '../../helpers';
import { makeTempHome, runCli } from '../hook-helpers';
import { writeFakeCommands } from '../install/install-test-helpers';

const MODULE_FILE = '__init__.py';
const MANIFEST_FILE = 'plugin.yaml';

function detectHermes(homeDir: string) {
  return detect({ homeDir, cwd: homeDir });
}

function writeHermesConfig(homeDir: string, contents: string) {
  const path = join(homeDir, '.hermes', 'config.yaml');
  mkdirSync(join(homeDir, '.hermes'), { recursive: true });
  writeFileSync(path, contents);
  return path;
}

function enableHermesPlugin(homeDir: string) {
  return writeHermesConfig(
    homeDir,
    `plugins:
  enabled:
  - ${HERMES_AGENT_PLUGIN_NAME}
`,
  );
}

/** Install and mark the plugin enabled, the state a real `install --hermes-agent` leaves behind. */
function installEnabled(homeDir: string) {
  const result = installHermesAgent(homeDir);
  enableHermesPlugin(homeDir);
  return result;
}

function writeManagedFiles(homeDir: string, version: string) {
  const dir = getHermesAgentPluginDir(homeDir);
  mkdirSync(dir, { recursive: true });
  buildHermesAgentPluginFiles(version).forEach((file) => {
    writeFileSync(join(dir, file.name), file.content);
  });
  return dir;
}

/** Plant a symlink where the managed module belongs and return its target. */
function symlinkManagedFile(homeDir: string) {
  const dir = getHermesAgentPluginDir(homeDir);
  mkdirSync(dir, { recursive: true });
  const target = join(homeDir, 'target.py');
  writeFileSync(target, 'target\n');
  symlinkSync(target, join(dir, MODULE_FILE));
  return target;
}

/** Plant a symlink where the plugin directory belongs and return its target directory. */
function symlinkPluginDir(homeDir: string) {
  const dir = getHermesAgentPluginDir(homeDir);
  mkdirSync(join(dir, '..'), { recursive: true });
  const target = join(homeDir, 'elsewhere');
  mkdirSync(target);
  symlinkSync(target, dir);
  return target;
}

function makeFakeHermesBin(homeDir: string) {
  const binDir = writeFakeCommands(homeDir, {
    hermes: `appendFileSync(
  process.env.CC_SAFETY_NET_TEST_COMMAND_LOG ?? '',
  commandLine + '\\n',
);
const watchPath = process.env.CC_SAFETY_NET_TEST_WATCH_PATH;
if (watchPath && existsSync(watchPath)) {
  appendFileSync(process.env.CC_SAFETY_NET_TEST_COMMAND_LOG ?? '', 'watched-exists\\n');
}`,
  });
  return {
    path: `${binDir}${delimiter}${process.env.PATH ?? ''}`,
    logPath: join(homeDir, 'cmd.log'),
  };
}

/** Run the CLI against a fake `hermes` on PATH, reporting the commands it drove. */
async function runHermesCli(
  homeDir: string,
  args: readonly string[],
  extraEnv: Record<string, string> = {},
) {
  const fake = makeFakeHermesBin(homeDir);
  const result = await runCli(args, '', {
    HOME: homeDir,
    PATH: fake.path,
    CC_SAFETY_NET_TEST_COMMAND_LOG: fake.logPath,
    ...extraEnv,
  });
  return {
    ...result,
    commands: existsSync(fake.logPath) ? readFileSync(fake.logPath, 'utf-8').trim() : '',
  };
}

const pythonBin = ['python3', 'python']
  .map((name) => Bun.which(name))
  .filter((path): path is string => path !== null)
  .find((path) => Bun.spawnSync([path, '--version']).exitCode === 0);

/** The `task_id` the host passes; Hermes keys its cwd record by it when the contextvar is unset. */
const HERMES_TASK_ID = 'task-1';

const PYTHON_HOST = `
import importlib.util, json, os, sys, time
mode, tool, args = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
spec = importlib.util.spec_from_file_location("ccsn", sys.argv[4])
plugin = importlib.util.module_from_spec(spec)
spec.loader.exec_module(plugin)
plugin.TIMEOUT_SECONDS = 1
if mode == "start-fail":
    def fail_start(*_, **__):
        raise OSError("synthetic start failure")
    plugin.subprocess.Popen = fail_start
if mode == "cleanup-fail":
    class TimedOutProcess:
        pid = 1
        def communicate(self, *_, **kwargs):
            raise plugin.subprocess.TimeoutExpired("npx", kwargs.get("timeout"))
    def fail_cleanup(*_, **__):
        raise OSError("synthetic cleanup failure")
    plugin.subprocess.Popen = lambda *_, **__: TimedOutProcess()
    if os.name == "nt":
        plugin.subprocess.run = fail_cleanup
    else:
        plugin.os.killpg = fail_cleanup
if mode == "native-hang":
    plugin.ANALYZER = [sys.executable, "-c", """
import os
import subprocess
import sys
import time

child = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(20)"])
with open(os.environ["CC_SAFETY_NET_TEST_GRANDCHILD_PID"], "w", encoding="utf-8") as pid_file:
    pid_file.write(str(child.pid))
time.sleep(20)
"""]
registered = {}
class Ctx:
    def register_hook(self, name, callback):
        registered[name] = callback
plugin.register(Ctx())
name = next(iter(registered))
started = time.monotonic()
result = registered[name](tool_name=tool, args=args, session_id="sess-1", task_id="${HERMES_TASK_ID}")
json.dump({
    "hookName": name,
    "result": result,
    "cwd": os.getcwd(),
    "elapsedSeconds": time.monotonic() - started,
}, sys.stdout)
`;

/**
 * Hermes' own `tools` package, stubbed at the shape the plugin imports: `get_session_cwd` reads
 * the per-session cwd record (`tools/terminal_tool.py`), and `get_current_session_key` returns
 * the default it is given, which is what a tool-worker thread sees when the contextvar is unset
 * — that is when Hermes keys the record by the raw `task_id`.
 */
function writeHermesModules(dir: string, sessionCwd: string | undefined) {
  const pkg = join(dir, 'tools');
  mkdirSync(pkg);
  writeFileSync(join(pkg, '__init__.py'), '');
  writeFileSync(
    join(pkg, 'approval.py'),
    'def get_current_session_key(default="default"):\n    return default\n',
  );
  writeFileSync(
    join(pkg, 'terminal_tool.py'),
    `RECORD = ${JSON.stringify(sessionCwd === undefined ? {} : { [HERMES_TASK_ID]: sessionCwd })}


def get_session_cwd(session_key):
    return RECORD.get(session_key)
`,
  );
}

/**
 * The stub `npx` every python-host case runs instead of the real analyzer. Its bytes are fixed
 * and it is written once: macOS scans each newly written executable on its first exec, which
 * measured ~400ms per case back when the mode and the output paths were baked into the script.
 * Both now arrive by environment, so every case after the first reuses the already-scanned file.
 */
let analyzerStubBinDir = '';
let analyzerStubHome = '';

function writeAnalyzerStub() {
  analyzerStubHome = makeTempHome('safety-net-hermes-npx');
  return writeFakeCommands(analyzerStubHome, {
    npx: `writeFileSync(process.env.CC_SAFETY_NET_TEST_SPAWN_CWD ?? '', process.cwd());
writeFileSync(process.env.CC_SAFETY_NET_TEST_PAYLOAD ?? '', await Bun.stdin.text());
const mode = process.env.CC_SAFETY_NET_TEST_MODE;
if (mode === 'block') process.stdout.write('{"action":"block","message":"nope"}');
if (mode === 'garbage') process.stdout.write('not json');
if (mode === 'binary') process.stdout.write(Buffer.from([255, 254]));
if (mode === 'fail') process.exit(3);
if (mode === 'hang') {
  const child = Bun.spawn(
    [process.execPath, '-e', 'setTimeout(() => {}, 20_000)'],
    { stdout: 'inherit', stderr: 'inherit' },
  );
  child.unref();
  writeFileSync(process.env.CC_SAFETY_NET_TEST_GRANDCHILD_PID ?? '', String(child.pid));
}
if (mode === 'allow-shaped') process.stdout.write('{"action":"allow"}');`,
  });
}

/**
 * Run the generated plugin under a stub adapter, forcing one transport outcome.
 * Returns the directive it handed back to Hermes plus the payload the stub received.
 * `hermes` seeds the session cwd record; `null` stands for a Hermes without those modules.
 * `extraEnv` reaches the plugin process, which is how `TERMINAL_CWD` is set for a case.
 */
function runPluginCallback(
  mode: string,
  tool: string,
  args: Record<string, unknown>,
  hermes: { sessionCwd?: string } | null = {},
  extraEnv: Record<string, string> = {},
) {
  const dir = makeTempHome('safety-net-hermes-python');
  try {
    const modulePath = join(dir, MODULE_FILE);
    writeFileSync(
      modulePath,
      buildHermesAgentPluginFiles(getPackageVersion()).find((file) => file.name === MODULE_FILE)
        ?.content ?? '',
    );
    if (hermes) writeHermesModules(dir, hermes.sessionCwd);
    const payloadPath = join(dir, 'payload.json');
    const spawnCwdPath = join(dir, 'spawn-cwd.txt');
    const grandchildPidPath = join(dir, 'grandchild.pid');

    // `missing` runs with an empty PATH, so Python itself is launched by absolute path.
    const env = createSpawnEnv({
      PATH: mode === 'missing' ? '' : `${analyzerStubBinDir}${delimiter}${process.env.PATH}`,
      PYTHONPATH: dir,
      CC_SAFETY_NET_TEST_MODE: mode,
      CC_SAFETY_NET_TEST_PAYLOAD: payloadPath,
      CC_SAFETY_NET_TEST_SPAWN_CWD: spawnCwdPath,
      CC_SAFETY_NET_TEST_GRANDCHILD_PID: grandchildPidPath,
      ...extraEnv,
    });
    const spawned = Bun.spawnSync(
      [pythonBin ?? 'python3', '-c', PYTHON_HOST, mode, tool, JSON.stringify(args), modulePath],
      {
        cwd: dir,
        env,
      },
    );
    expect(spawned.stderr.toString()).toBe('');
    return {
      ...(JSON.parse(spawned.stdout.toString()) as {
        hookName: string;
        result: unknown;
        cwd: string;
        elapsedSeconds: number;
      }),
      payload: existsSync(payloadPath)
        ? (JSON.parse(readFileSync(payloadPath, 'utf-8')) as Record<string, unknown>)
        : undefined,
      spawnCwd: existsSync(spawnCwdPath) ? readFileSync(spawnCwdPath, 'utf-8').trim() : undefined,
      grandchildPid: existsSync(grandchildPidPath)
        ? Number(readFileSync(grandchildPidPath, 'utf-8').trim())
        : undefined,
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function isRunning(pid: number | undefined) {
  if (pid === undefined) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

describe('Hermes Agent plugin artifact', () => {
  test('stamps both managed files with the ownership marker and package version', () => {
    const files = buildHermesAgentPluginFiles('9.9.9');

    expect(files.map((file) => file.name)).toEqual([MODULE_FILE, MANIFEST_FILE]);
    files.forEach((file) => {
      expect(file.content.startsWith(HERMES_AGENT_MANAGED_HEADER)).toBe(true);
      expect(file.content).toContain('# version: 9.9.9');
    });
  });

  test('manifest declares the plugin name and the pre_tool_call hook', () => {
    const manifest = buildHermesAgentPluginFiles(getPackageVersion()).find(
      (file) => file.name === MANIFEST_FILE,
    );

    expect(manifest?.content).toContain(`name: ${HERMES_AGENT_PLUGIN_NAME}`);
    expect(manifest?.content).toContain('pre_tool_call');
  });

  test('module spawns the packaged adapter', () => {
    const source =
      buildHermesAgentPluginFiles(getPackageVersion()).find((file) => file.name === MODULE_FILE)
        ?.content ?? '';

    expect(source).toContain('"cc-safety-net", "hook", "--hermes-agent"');
  });

  test('module uses platform-specific analyzer launch and process-tree cleanup', () => {
    const source =
      buildHermesAgentPluginFiles(getPackageVersion()).find((file) => file.name === MODULE_FILE)
        ?.content ?? '';

    expect(source).toContain('{"start_new_session": True}');
    expect(source).toContain('os.path.join(system_root, "System32", "taskkill.exe")');
  });

  // Decoding with the process locale raises UnicodeDecodeError on undecodable analyzer output,
  // and Hermes turns a raising callback into an allowed tool call.
  test('decodes the analyzer output with a decoder that cannot raise', () => {
    const source =
      buildHermesAgentPluginFiles(getPackageVersion()).find((file) => file.name === MODULE_FILE)
        ?.content ?? '';

    expect(source).toContain('encoding="utf-8"');
    expect(source).toContain('errors="replace"');
  });

  // Exercises the generated Python through Hermes' own contract: register(ctx) ->
  // ctx.register_hook('pre_tool_call', cb), then cb(tool_name=, args=, session_id=).
  // A stub stands in for the adapter so each transport outcome can be forced.
  describe.skipIf(pythonBin === undefined)('module behaviour under Hermes', () => {
    beforeAll(() => {
      analyzerStubBinDir = writeAnalyzerStub();
    });

    afterAll(() => {
      rmSync(analyzerStubHome, { recursive: true, force: true });
    });

    test.each([
      ['allow', null],
      ['block', { action: 'block', message: 'nope' }],
      ['garbage', 'CC Safety Net failed closed: analysis returned unreadable output.'],
      // Undecodable bytes must fail closed like any other unreadable answer: a decode error
      // raised out of the callback is swallowed by Hermes, which then allows the tool call.
      ['binary', 'CC Safety Net failed closed: analysis returned unreadable output.'],
      ['fail', 'CC Safety Net failed closed: analysis exited with status 3.'],
      ['allow-shaped', 'CC Safety Net failed closed: analysis returned an unexpected directive.'],
      ['missing', 'CC Safety Net failed closed: npx was not found on PATH.'],
      [
        'start-fail',
        'CC Safety Net failed closed: analysis could not start (synthetic start failure).',
      ],
      ['cleanup-fail', 'CC Safety Net failed closed: analysis timed out after 1s.'],
    ] as const)('%s', (mode, expected) => {
      const run = runPluginCallback(mode, 'terminal', { command: 'rm -rf /' });
      expect(run.result).toEqual(
        typeof expected === 'string' ? { action: 'block', message: expected } : expected,
      );
    });

    // Hermes runs a `terminal` call without `workdir` in the session's own cwd RECORD — its `cd`
    // state (`_resolve_command_cwd` in tools/terminal_tool.py) — not in the Hermes process
    // directory. Analysing the process directory would clear `cd ~/.cc-safety-net && rm policy.json`.
    test('analyses a terminal call in the session cwd record, not the process directory', () => {
      const run = runPluginCallback(
        'allow',
        'terminal',
        { command: 'rm policy.json' },
        { sessionCwd: '/session/elsewhere' },
      );

      expect(run.payload?.cwd).toBe('/session/elsewhere');
      expect(run.payload?.cwd).not.toBe(run.cwd);
    });

    // Without a record the Hermes local terminal backend runs the command in
    // `os.getenv("TERMINAL_CWD", <process cwd>)`, and `hermes_cli/config.py` bridges the
    // configured `terminal.cwd` into that variable — so the process directory is the last resort.
    test('analyses a terminal call in TERMINAL_CWD when the session has no cwd record', () => {
      const run = runPluginCallback(
        'allow',
        'terminal',
        { command: 'rm policy.json' },
        {},
        { TERMINAL_CWD: '/terminal/configured' },
      );

      expect(run.payload?.cwd).toBe('/terminal/configured');
      expect(run.payload?.cwd).not.toBe(run.cwd);
    });

    // The record is the session's live `cd` state, so it outranks the configured default.
    test('prefers the session cwd record over TERMINAL_CWD', () => {
      const run = runPluginCallback(
        'allow',
        'terminal',
        { command: 'rm policy.json' },
        { sessionCwd: '/session/elsewhere' },
        { TERMINAL_CWD: '/terminal/configured' },
      );

      expect(run.payload?.cwd).toBe('/session/elsewhere');
    });

    // A Hermes refactor that moves the accessor leaves us unable to tell which directory the
    // command runs in, which is an analysis-context failure like any other.
    test('blocks when the Hermes session cwd accessor cannot be imported', () => {
      const run = runPluginCallback('allow', 'terminal', { command: 'ls' }, null);

      expect(run.result).toMatchObject({ action: 'block' });
      expect((run.result as { message: string }).message).toContain('install --hermes-agent');
      expect(run.payload).toBeUndefined();
    });

    // This stub exercises POSIX process groups and inherited pipe handles. Windows process-tree
    // cleanup uses taskkill and is exercised by the native subprocess case immediately below.
    test.skipIf(process.platform === 'win32')(
      'kills the whole analyzer process tree when the analysis times out',
      () => {
        const run = runPluginCallback('hang', 'terminal', { command: 'ls' });

        expect(run.result).toEqual({
          action: 'block',
          message: 'CC Safety Net failed closed: analysis timed out after 1s.',
        });
        expect(run.elapsedSeconds).toBeLessThan(2);
        // `isRunning` reads an absent pid as "not running", so pin that the descendant was spawned:
        // without this the kill assertion below passes even when no process tree was ever created.
        expect(run.grandchildPid).toBeGreaterThan(0);
        expect(isRunning(run.grandchildPid)).toBe(false);
      },
    );

    test.skipIf(process.platform !== 'win32')(
      '[windows] kills the native analyzer process tree and returns a timeout block',
      () => {
        const run = runPluginCallback('native-hang', 'terminal', { command: 'ls' });

        expect(run.result).toEqual({
          action: 'block',
          message: 'CC Safety Net failed closed: analysis timed out after 1s.',
        });
        expect(run.elapsedSeconds).toBeLessThan(3);
        expect(run.grandchildPid).toBeGreaterThan(0);
        expect(isRunning(run.grandchildPid)).toBe(false);
      },
    );

    // Hermes' own first-command behaviour: no record yet, so the command runs in the process cwd.
    // A repository-local node_modules/.bin/cc-safety-net would otherwise win the `npx` lookup
    // from Hermes' own working directory and stand in for the analyzer.
    test('registers the hook and sends the payload from the correct directories', () => {
      const run = runPluginCallback('allow', 'terminal', { command: 'ls' });

      expect(run.hookName).toBe('pre_tool_call');
      expect(run.payload).toEqual({
        hook_event_name: 'pre_tool_call',
        tool_name: 'terminal',
        tool_input: { command: 'ls' },
        session_id: 'sess-1',
        cwd: run.cwd,
      });
      expect(run.spawnCwd).toBe(homedir());
      expect(run.spawnCwd).not.toBe(run.cwd);
      expect(run.payload?.cwd).toBe(run.cwd);
    });

    test.each(['read_file', 'write_file', 'patch'])('forwards the %s tool', (tool) => {
      expect(runPluginCallback('allow', tool, { path: 'x' }).payload?.tool_name).toBe(tool);
    });

    test('ignores a tool outside the supported set without spawning the adapter', () => {
      const run = runPluginCallback('block', 'web_search', { query: 'x' });

      expect(run.result).toBeNull();
      expect(run.payload).toBeUndefined();
    });
  });
});

describe('Hermes Agent install', () => {
  test('writes both managed files into a fresh plugin directory', () => {
    const homeDir = makeTempHome('safety-net-hermes-install');
    try {
      const result = installHermesAgent(homeDir);

      expect(result.alreadyInstalled).toBe(false);
      expect(result.path).toBe(getHermesAgentPluginDir(homeDir));
      buildHermesAgentPluginFiles(getPackageVersion()).forEach((file) => {
        expect(readFileSync(join(result.path, file.name), 'utf-8')).toBe(file.content);
      });
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('reports already installed without rewriting when both files match', () => {
    const homeDir = makeTempHome('safety-net-hermes-install');
    try {
      const dir = installHermesAgent(homeDir).path;
      const before = statSync(join(dir, MODULE_FILE)).mtimeMs;

      const result = installHermesAgent(homeDir);

      expect(result.alreadyInstalled).toBe(true);
      expect(statSync(join(dir, MODULE_FILE)).mtimeMs).toBe(before);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('replaces an older managed install', () => {
    const homeDir = makeTempHome('safety-net-hermes-install');
    try {
      const dir = writeManagedFiles(homeDir, '0.0.1');

      const result = installHermesAgent(homeDir);

      expect(result.alreadyInstalled).toBe(false);
      expect(readFileSync(join(dir, MODULE_FILE), 'utf-8')).toContain(
        `# version: ${getPackageVersion()}`,
      );
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test.each([MODULE_FILE, MANIFEST_FILE])('refuses to overwrite an unmanaged %s', (name) => {
    const homeDir = makeTempHome('safety-net-hermes-install');
    try {
      const dir = getHermesAgentPluginDir(homeDir);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, name), 'handwritten\n');

      expect(() => installHermesAgent(homeDir)).toThrow('Refusing to overwrite unmanaged file');
      expect(readFileSync(join(dir, name), 'utf-8')).toBe('handwritten\n');
      // A refused install must not leave the other managed file behind either.
      expect(existsSync(join(dir, name === MODULE_FILE ? MANIFEST_FILE : MODULE_FILE))).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('refuses to overwrite a symlinked managed file', () => {
    const homeDir = makeTempHome('safety-net-hermes-install');
    try {
      const target = symlinkManagedFile(homeDir);

      expect(() => installHermesAgent(homeDir)).toThrow('not a regular file');
      expect(readFileSync(target, 'utf-8')).toBe('target\n');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('refuses to install through a symlinked plugin directory', () => {
    const homeDir = makeTempHome('safety-net-hermes-install');
    try {
      const target = symlinkPluginDir(homeDir);

      expect(() => installHermesAgent(homeDir)).toThrow('not a regular directory');
      expect(existsSync(join(target, MODULE_FILE))).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('leaves unrelated Hermes plugins untouched', () => {
    const homeDir = makeTempHome('safety-net-hermes-install');
    try {
      const other = join(homeDir, '.hermes', 'plugins', 'other', MODULE_FILE);
      mkdirSync(join(other, '..'), { recursive: true });
      writeFileSync(other, 'other\n');

      installHermesAgent(homeDir);

      expect(readFileSync(other, 'utf-8')).toBe('other\n');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('enables the plugin through the Hermes CLI when installed from the command line', async () => {
    const homeDir = makeTempHome('safety-net-hermes-install-cli');
    try {
      const result = await runHermesCli(homeDir, ['install', '--hermes-agent']);

      expect(result.exitCode).toBe(0);
      expect(result.commands).toBe(
        `plugins enable ${HERMES_AGENT_PLUGIN_NAME} --no-allow-tool-override`,
      );
      expect(result.stdout).toContain('Hermes Agent plugin');
      expect(existsSync(join(getHermesAgentPluginDir(homeDir), MANIFEST_FILE))).toBe(true);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  // `plugins enable` runs on every reinstall, so an unchanged artifact is only "already installed"
  // when Hermes had the plugin enabled already; otherwise the reinstall turned it back on, and a
  // user told nothing changed never restarts Hermes to pick it up.
  test.each([
    ['re-enables a disabled plugin', false, 'Restart Hermes'],
    ['leaves an enabled plugin alone', true, 'already installed'],
  ] as const)('reports a reinstall that %s', async (_name, enabled, expected) => {
    const homeDir = makeTempHome('safety-net-hermes-install-cli');
    try {
      installHermesAgent(homeDir);
      if (enabled) enableHermesPlugin(homeDir);

      const result = await runHermesCli(homeDir, ['install', '--hermes-agent']);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain(expected);
      expect(result.stdout.includes('Restart Hermes')).toBe(!enabled);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });
});

// `hermes plugins enable` honours HERMES_HOME, so an installer that writes to the platform
// default while the CLI enables in a custom profile leaves the plugin enabled but absent.
describe('Hermes home resolution', () => {
  test('installs, detects, and uninstalls inside HERMES_HOME', () => {
    const homeDir = makeTempHome('safety-net-hermes-home');
    try {
      const hermesHome = join(homeDir, 'profiles', 'work');
      withEnv({ HERMES_HOME: hermesHome }, () => {
        const dir = installHermesAgent(homeDir).path;
        expect(dir).toBe(join(hermesHome, 'plugins', HERMES_AGENT_PLUGIN_NAME));
        writeFileSync(
          join(hermesHome, 'config.yaml'),
          `plugins:\n  enabled:\n  - ${HERMES_AGENT_PLUGIN_NAME}\n`,
        );

        expect(detectHermes(homeDir).status).toBe('configured');
        expect(uninstallHermesAgent(homeDir).alreadyInstalled).toBe(true);
        expect(existsSync(dir)).toBe(false);
      });
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('falls back to the platform default when HERMES_HOME is blank', () => {
    const homeDir = makeTempHome('safety-net-hermes-home');
    try {
      withEnv({ HERMES_HOME: '   ' }, () => {
        expect(installHermesAgent(homeDir).path).toBe(
          join(homeDir, '.hermes', 'plugins', HERMES_AGENT_PLUGIN_NAME),
        );
      });
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });
});

describe('Hermes Agent uninstall', () => {
  test('removes the managed files and the now-empty plugin directory', () => {
    const homeDir = makeTempHome('safety-net-hermes-uninstall');
    try {
      const dir = installHermesAgent(homeDir).path;
      const sibling = join(dir, '..', 'other', MODULE_FILE);
      mkdirSync(join(sibling, '..'), { recursive: true });
      writeFileSync(sibling, 'other\n');

      const result = uninstallHermesAgent(homeDir);

      expect(result.alreadyInstalled).toBe(true);
      expect(existsSync(dir)).toBe(false);
      expect(readFileSync(sibling, 'utf-8')).toBe('other\n');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('removes the bytecode cache Hermes leaves beside the managed module', () => {
    const homeDir = makeTempHome('safety-net-hermes-uninstall');
    try {
      const dir = installHermesAgent(homeDir).path;
      mkdirSync(join(dir, '__pycache__'));
      writeFileSync(join(dir, '__pycache__', '__init__.cpython-312.pyc'), 'bytecode');

      expect(uninstallHermesAgent(homeDir).alreadyInstalled).toBe(true);
      expect(existsSync(dir)).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('keeps the plugin directory when it still holds unmanaged files', () => {
    const homeDir = makeTempHome('safety-net-hermes-uninstall');
    try {
      const dir = installHermesAgent(homeDir).path;
      writeFileSync(join(dir, 'notes.md'), 'mine\n');

      uninstallHermesAgent(homeDir);

      expect(existsSync(join(dir, MODULE_FILE))).toBe(false);
      expect(readFileSync(join(dir, 'notes.md'), 'utf-8')).toBe('mine\n');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('reports not installed when the plugin directory is absent', () => {
    const homeDir = makeTempHome('safety-net-hermes-uninstall');
    try {
      const result = uninstallHermesAgent(homeDir);

      expect(result.alreadyInstalled).toBe(false);
      expect(result.path).toBe(getHermesAgentPluginDir(homeDir));
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('refuses to remove an unmanaged file at a managed path', () => {
    const homeDir = makeTempHome('safety-net-hermes-uninstall');
    try {
      const dir = getHermesAgentPluginDir(homeDir);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, MODULE_FILE), 'handwritten\n');

      expect(() => uninstallHermesAgent(homeDir)).toThrow('Refusing to remove unmanaged file');
      expect(readFileSync(join(dir, MODULE_FILE), 'utf-8')).toBe('handwritten\n');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  // Leaving `cc-safety-net` in plugins.enabled would auto-load any future plugin of that name.
  // Hermes resolves the plugin from disk, so the disable has to happen while the files are there.
  test('disables the plugin through the Hermes CLI before removing its files', async () => {
    const homeDir = makeTempHome('safety-net-hermes-uninstall-cli');
    try {
      const dir = installHermesAgent(homeDir).path;

      const result = await runHermesCli(homeDir, ['uninstall', '--hermes-agent'], {
        CC_SAFETY_NET_TEST_WATCH_PATH: join(dir, MODULE_FILE),
      });

      expect(result.exitCode).toBe(0);
      expect(result.commands.split('\n')).toEqual([
        `plugins disable ${HERMES_AGENT_PLUGIN_NAME}`,
        'watched-exists',
      ]);
      expect(existsSync(dir)).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  // `hermes plugins disable` edits the user's config, so it must not run for a plugin directory
  // whose contents the uninstall is going to refuse to touch anyway.
  test('refuses an unmanaged occupant before touching the Hermes config', async () => {
    const homeDir = makeTempHome('safety-net-hermes-uninstall-cli');
    try {
      const dir = getHermesAgentPluginDir(homeDir);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, MODULE_FILE), 'handwritten\n');

      const result = await runHermesCli(homeDir, ['uninstall', '--hermes-agent']);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Refusing to remove unmanaged file');
      expect(result.commands).toBe('');
      expect(readFileSync(join(dir, MODULE_FILE), 'utf-8')).toBe('handwritten\n');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('removes the managed files even when the hermes executable is missing', async () => {
    const homeDir = makeTempHome('safety-net-hermes-uninstall-cli');
    try {
      const dir = installHermesAgent(homeDir).path;
      const binDir = join(homeDir, 'bin-without-hermes');
      mkdirSync(binDir);
      symlinkSync(Bun.which('bun') ?? 'bun', join(binDir, 'bun'));

      const result = await runCli(['uninstall', '--hermes-agent'], '', {
        HOME: homeDir,
        PATH: binDir,
      });

      // The failed config cleanup is reported, but the plugin files are gone either way.
      expect(result.exitCode).toBe(0);
      expect(result.stderr).toContain(`plugins disable ${HERMES_AGENT_PLUGIN_NAME}`);
      expect(existsSync(dir)).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });
});

describe('Hermes Agent detection', () => {
  test('reports not applicable when nothing is installed', () => {
    const homeDir = makeTempHome('safety-net-hermes-detect');
    try {
      const detection = detectHermes(homeDir);

      expect(detection.status).toBe('n/a');
      expect(detection.errors).toBeUndefined();
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('reports configured for an installed and enabled plugin', () => {
    const homeDir = makeTempHome('safety-net-hermes-detect');
    try {
      installEnabled(homeDir);

      const detection = detectHermes(homeDir);

      expect(detection.status).toBe('configured');
      expect(detection.configPath).toBe(getHermesAgentPluginDir(homeDir));
      expect(detection.errors).toBeUndefined();
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('reports disabled when Hermes does not list the plugin as enabled', () => {
    const homeDir = makeTempHome('safety-net-hermes-detect');
    try {
      installHermesAgent(homeDir);
      writeHermesConfig(
        homeDir,
        `plugins:
  enabled:
  - security-guidance
`,
      );

      const detection = detectHermes(homeDir);

      expect(detection.status).toBe('disabled');
      expect(detection.errors?.join('\n')).toContain('hermes plugins enable');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('reports disabled when the plugin is also on the deny list', () => {
    const homeDir = makeTempHome('safety-net-hermes-detect');
    try {
      installHermesAgent(homeDir);
      writeHermesConfig(
        homeDir,
        `plugins:
  enabled:
  - ${HERMES_AGENT_PLUGIN_NAME}
  disabled:
  - ${HERMES_AGENT_PLUGIN_NAME}
`,
      );

      expect(detectHermes(homeDir).status).toBe('disabled');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('does not read an enabled list from an unrelated config section', () => {
    const homeDir = makeTempHome('safety-net-hermes-detect');
    try {
      installHermesAgent(homeDir);
      writeHermesConfig(
        homeDir,
        `tools:
  enabled:
  - ${HERMES_AGENT_PLUGIN_NAME}
plugins:
  enabled: []
`,
      );

      expect(detectHermes(homeDir).status).toBe('disabled');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test.each([
    ['a missing runtime artifact', MODULE_FILE, undefined],
    ['a manifest CC Safety Net does not own', MANIFEST_FILE, 'name: something-else\n'],
    // A header and a version stamp are not a plugin: Hermes cannot register the hook from a
    // module whose body is gone, so `configured` would claim protection that is not there.
    [
      'a managed module truncated to its header',
      MODULE_FILE,
      `${HERMES_AGENT_MANAGED_HEADER}\n# version: ${getPackageVersion()}\n`,
    ],
  ] as const)('reports %s', (_name, file, content) => {
    const homeDir = makeTempHome('safety-net-hermes-detect');
    try {
      const path = join(installEnabled(homeDir).path, file);
      rmSync(path);
      if (content) writeFileSync(path, content);

      const detection = detectHermes(homeDir);

      expect(detection.status).toBe('n/a');
      expect(detection.errors?.join('\n')).toContain(file);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('reports version drift while staying configured', () => {
    const homeDir = makeTempHome('safety-net-hermes-detect');
    try {
      writeManagedFiles(homeDir, '0.0.1');
      enableHermesPlugin(homeDir);

      const detection = detectHermes(homeDir);

      expect(detection.status).toBe('configured');
      expect(detection.errors?.join('\n')).toContain('outdated');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('reports a symlinked plugin directory as uninspectable', () => {
    const homeDir = makeTempHome('safety-net-hermes-detect');
    try {
      symlinkPluginDir(homeDir);

      const detection = detectHermes(homeDir);

      expect(detection.status).toBe('n/a');
      expect(detection.errors?.join('\n')).toContain('symlink');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });
});
