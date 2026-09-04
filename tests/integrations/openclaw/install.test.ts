/**
 * OpenClaw plugin artifact, native install/uninstall commands, and doctor detection.
 *
 * Every case runs against an isolated temporary home and a bounded fake `openclaw`
 * executable; nothing here touches a real OpenClaw installation, its managed plugin
 * index, or the real audit logs.
 */

import { describe, expect, test } from 'bun:test';
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import {
  buildOpenClawArtifactHeader,
  buildOpenClawPluginManifests,
  OPENCLAW_MANAGED_HEADER,
  OPENCLAW_PLUGIN_ID,
} from '@/integrations/openclaw/artifact';
import { detect, modifiedFileErrors } from '@/integrations/openclaw/detect';
import openClawPluginEntry from '@/integrations/openclaw/index';
import {
  assertOpenClawPluginDirIsOurs,
  getOpenClawPluginDir,
  resolveOpenClawArtifactDir,
} from '@/integrations/openclaw/install';
import { getPackageVersion } from '@/integrations/system-info';
import { withEnv, withTempDir } from '../../helpers';
import { runCli } from '../hook-helpers';
import { writeFakeCommands } from '../install/install-test-helpers';

const ENTRY_FILE = 'index.js';
const MANIFEST_FILE = 'openclaw.plugin.json';
const PACKAGE_FILE = 'package.json';

function withHome<T>(fn: (homeDir: string) => T | Promise<T>) {
  return withTempDir('safety-net-openclaw-', fn);
}

function detectOpenClaw(homeDir: string) {
  return detect({ homeDir, cwd: homeDir });
}

function generatedFile(version: string, name: string) {
  const file = buildOpenClawPluginManifests(version).find((entry) => entry.name === name);
  if (!file) throw new Error(`missing generated file ${name}`);
  return JSON.parse(file.content);
}

/**
 * Lay down the exact directory `openclaw plugins install <dir>` copies into place. A
 * current-version install is the packaged directory byte for byte, which is what doctor compares
 * it against; an older stamp is reported as outdated before any content is compared, so a stub
 * carrying the header is all it needs.
 */
function installOpenClawFixtureIn(dir: string, version = getPackageVersion()) {
  mkdirSync(dir, { recursive: true });
  if (version === getPackageVersion()) {
    cpSync(resolveOpenClawArtifactDir(), dir, { recursive: true });
    return dir;
  }

  writeFileSync(
    join(dir, ENTRY_FILE),
    `${buildOpenClawArtifactHeader(version)}export default {};\n`,
  );
  buildOpenClawPluginManifests(version).forEach((file) => {
    writeFileSync(join(dir, file.name), file.content);
  });
  return dir;
}

function installOpenClawFixture(homeDir: string, version = getPackageVersion()) {
  return installOpenClawFixtureIn(getOpenClawPluginDir(homeDir), version);
}

/** The stamp the packaged runtime entry carries; an install must match it to be compared to it. */
function packagedArtifactVersion() {
  const entry = readFileSync(join(resolveOpenClawArtifactDir(), ENTRY_FILE), 'utf-8');
  const version = /^\/\/ version:\s*(.+)$/m.exec(entry)?.[1]?.trim();
  if (!version) throw new Error('the packaged OpenClaw runtime entry carries no version stamp');
  return version;
}

function writeOpenClawConfig(homeDir: string, config: unknown) {
  mkdirSync(join(homeDir, '.openclaw'), { recursive: true });
  const path = join(homeDir, '.openclaw', 'openclaw.json');
  writeFileSync(path, typeof config === 'string' ? config : JSON.stringify(config, null, 2));
  return path;
}

/** The config state `openclaw plugins enable cc-safety-net` leaves behind. */
function enableOpenClawPlugin(homeDir: string, plugins: Record<string, unknown> = {}) {
  return writeOpenClawConfig(homeDir, {
    plugins: { entries: { [OPENCLAW_PLUGIN_ID]: { enabled: true } }, ...plugins },
  });
}

/**
 * Fake `openclaw` binary: appends every invocation to a log and answers
 * `plugins inspect` with the JSON the test pins in the environment.
 */
function makeFakeOpenClawBin(homeDir: string) {
  const binDir = writeFakeCommands(homeDir, {
    openclaw: `appendFileSync(
  process.env.CC_SAFETY_NET_TEST_COMMAND_LOG ?? '',
  commandLine + '\\n',
);
if (args[1] === 'inspect') {
  process.stderr.write(process.env.CC_SAFETY_NET_TEST_INSPECT_STDERR ?? '');
  process.stdout.write(process.env.CC_SAFETY_NET_TEST_INSPECT_JSON ?? '');
}`,
  });
  return {
    path: `${binDir}${delimiter}${process.env.PATH ?? ''}`,
    logPath: join(homeDir, 'cmd.log'),
  };
}

async function runOpenClawCli(
  homeDir: string,
  args: readonly string[],
  inspectJson = JSON.stringify({ plugin: { id: OPENCLAW_PLUGIN_ID, status: 'loaded' } }),
  inspectStderr = '',
) {
  const fake = makeFakeOpenClawBin(homeDir);
  const result = await runCli(args, '', {
    HOME: homeDir,
    PATH: fake.path,
    CC_SAFETY_NET_TEST_COMMAND_LOG: fake.logPath,
    CC_SAFETY_NET_TEST_INSPECT_JSON: inspectJson,
    CC_SAFETY_NET_TEST_INSPECT_STDERR: inspectStderr,
  });
  return {
    ...result,
    commands: await Bun.file(fake.logPath)
      .text()
      .catch(() => ''),
  };
}

describe('OpenClaw plugin artifact', () => {
  test('ships a manifest OpenClaw can validate without loading plugin code', () => {
    const manifest = generatedFile('9.9.9', MANIFEST_FILE);

    expect(manifest.id).toBe(OPENCLAW_PLUGIN_ID);
    expect(manifest.version).toBe('9.9.9');
    expect(typeof manifest.name).toBe('string');
    expect(typeof manifest.description).toBe('string');
    // Required by OpenClaw for every native plugin, even with no config.
    expect(manifest.configSchema).toEqual({
      type: 'object',
      additionalProperties: false,
      properties: {},
    });
    // Without startup activation OpenClaw never imports the plugin, so the
    // before_tool_call hook is never registered and nothing is blocked.
    expect(manifest.activation).toEqual({ onStartup: true });
  });

  test('points the package entry at the built JavaScript runtime', () => {
    const packageJson = generatedFile('9.9.9', PACKAGE_FILE);

    expect(packageJson.openclaw).toEqual({ extensions: [`./${ENTRY_FILE}`] });
    expect(packageJson.type).toBe('module');
    expect(packageJson.version).toBe('9.9.9');
  });

  test('stamps the runtime artifact with the ownership marker and version', () => {
    const header = buildOpenClawArtifactHeader('9.9.9');

    expect(header.startsWith(OPENCLAW_MANAGED_HEADER)).toBeTrue();
    expect(header).toContain('// version: 9.9.9');
  });

  test('exports a plugin entry whose id matches the manifest and registers the hook', () => {
    const registered: Array<{ hook: string; opts: unknown }> = [];
    openClawPluginEntry.register({
      config: {},
      runtime: { agent: { resolveAgentWorkspaceDir: () => undefined } },
      on: (hook, _handler, opts) => {
        registered.push({ hook, opts });
      },
    });

    expect(openClawPluginEntry.id).toBe(generatedFile(getPackageVersion(), MANIFEST_FILE).id);
    expect(registered).toEqual([
      { hook: 'before_tool_call', opts: { matcher: ['exec'], priority: 50 } },
    ]);
  });

  test('refuses to install when the packaged plugin directory is missing', () => {
    expect(() => resolveOpenClawArtifactDir([])).toThrow(
      'Packaged OpenClaw plugin directory not found',
    );
  });
});

describe('OpenClaw native install commands', () => {
  test('accepts an empty plugin directory left by a native uninstall', () =>
    withHome((homeDir) => {
      mkdirSync(getOpenClawPluginDir(homeDir), { recursive: true });

      expect(() => assertOpenClawPluginDirIsOurs(homeDir)).not.toThrow();
    }));

  test('refuses an incomplete plugin directory without a managed runtime entry', () =>
    withHome((homeDir) => {
      const dir = getOpenClawPluginDir(homeDir);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, MANIFEST_FILE), '{}\n');
      writeFileSync(join(dir, PACKAGE_FILE), '{}\n');

      expect(() => assertOpenClawPluginDirIsOurs(homeDir)).toThrow(`Refusing to modify ${dir}`);
      expect(readFileSync(join(dir, MANIFEST_FILE), 'utf-8')).toBe('{}\n');
      expect(readFileSync(join(dir, PACKAGE_FILE), 'utf-8')).toBe('{}\n');
    }));

  test('drives the real CLI with the packaged directory and reports Gateway restart guidance', () =>
    withHome(async (homeDir) => {
      const result = await runOpenClawCli(homeDir, ['install', '--openclaw']);

      expect(result.exitCode).toBe(0);
      expect(result.commands.trim().split('\n')).toEqual([
        `plugins install ${resolveOpenClawArtifactDir()} --force`,
        `plugins enable ${OPENCLAW_PLUGIN_ID}`,
        `plugins inspect ${OPENCLAW_PLUGIN_ID} --runtime --json`,
      ]);
      expect(result.stdout).toContain('Restart the OpenClaw Gateway');
      expect(result.stdout).toContain('plugins.allow');
    }));

  test('uninstalls through the native OpenClaw plugin CLI', () =>
    withHome(async (homeDir) => {
      const result = await runOpenClawCli(homeDir, ['uninstall', '--openclaw']);

      expect(result.exitCode).toBe(0);
      expect(result.commands.trim()).toBe(`plugins uninstall ${OPENCLAW_PLUGIN_ID} --force`);
    }));

  test('reinstalls over its own managed plugin', () =>
    withHome(async (homeDir) => {
      installOpenClawFixture(homeDir, '0.0.1');

      const result = await runOpenClawCli(homeDir, ['install', '--openclaw']);

      expect(result.exitCode).toBe(0);
      expect(result.commands).toContain('plugins install');
    }));

  // `plugins install --force` overwrites, and `plugins uninstall --force` deletes, the whole
  // extension directory, so anything of the user's inside it must stop both — a plugin of their
  // own parked at our id, and a file of theirs sitting beside our managed entry alike.
  test.each([
    ['install', ENTRY_FILE],
    ['uninstall', ENTRY_FILE],
    ['install', 'notes.md'],
    ['uninstall', 'notes.md'],
  ] as const)("refuses to %s a plugin directory holding the user's %s", (action, name) =>
    withHome(async (homeDir) => {
      // A user file only reaches the directory beside a managed install; a user `index.js`
      // replaces ours outright.
      const dir =
        name === ENTRY_FILE ? getOpenClawPluginDir(homeDir) : installOpenClawFixture(homeDir);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, name), 'mine\n');

      const result = await runOpenClawCli(homeDir, [action, '--openclaw']);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain(dir);
      expect(result.commands).toBe('');
      expect(readFileSync(join(dir, name), 'utf-8')).toBe('mine\n');
    }));
});

describe('OpenClaw runtime inspection', () => {
  // OpenClaw writes its plugin lifecycle trace to stderr precisely so the `--json` report on
  // stdout stays parseable (`docs/help/debugging.md`), and any warning lands there too. Reading
  // the two streams merged turns a loaded plugin into an unreadable report and fails the install.
  test('verifies a loaded plugin whose inspect run also wrote to stderr', () =>
    withHome(async (homeDir) => {
      const result = await runOpenClawCli(
        homeDir,
        ['install', '--openclaw'],
        undefined,
        '[plugin-lifecycle] cc-safety-net: load\n',
      );

      expect(result.stderr).not.toContain('load state could not be verified');
      expect(result.exitCode).toBe(0);
    }));

  test('fails the install when the plugin load state cannot be verified', () =>
    withHome(async (homeDir) => {
      const result = await runOpenClawCli(homeDir, ['install', '--openclaw'], 'not json');

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('load state could not be verified');
      expect(result.stderr).toContain(`openclaw plugins inspect ${OPENCLAW_PLUGIN_ID} --runtime`);
    }));

  test('fails the install when OpenClaw could not load the installed plugin', () =>
    withHome(async (homeDir) => {
      const result = await runOpenClawCli(
        homeDir,
        ['install', '--openclaw'],
        JSON.stringify({ plugin: { id: OPENCLAW_PLUGIN_ID, status: 'error' } }),
      );

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('status "error"');
      expect(result.stderr).toContain(`openclaw plugins inspect ${OPENCLAW_PLUGIN_ID}`);
    }));
});

describe('OpenClaw detection', () => {
  test('reports not applicable when nothing is installed', () =>
    withHome((homeDir) => {
      const detection = detectOpenClaw(homeDir);

      expect(detection.status).toBe('n/a');
      expect(detection.errors).toBeUndefined();
      expect(detection.configPath).toBe(getOpenClawPluginDir(homeDir));
    }));

  // The install is the packaged directory byte for byte, so nothing is reported as modified. Run
  // from source the package version reads as `dev` while the packaged files carry the release
  // stamp, which is exactly the outdated report — and the only one this install earns.
  test('reports configured for an install byte-identical to the packaged plugin', () =>
    withHome((homeDir) => {
      installOpenClawFixture(homeDir);
      enableOpenClawPlugin(homeDir);

      const detection = detectOpenClaw(homeDir);

      expect(detection.status).toBe('configured');
      expect(detection.method).toBe('plugin directory');
      expect(detection.errors).toEqual([
        'Installed OpenClaw plugin is outdated; run install --openclaw to update',
      ]);
    }));

  test('treats an allowlist entry alone as enabled', () =>
    withHome((homeDir) => {
      installOpenClawFixture(homeDir);
      writeOpenClawConfig(homeDir, { plugins: { allow: [OPENCLAW_PLUGIN_ID] } });

      expect(detectOpenClaw(homeDir).status).toBe('configured');
    }));

  test('reports disabled with allowlist guidance when plugins.allow omits the plugin', () =>
    withHome((homeDir) => {
      installOpenClawFixture(homeDir);
      enableOpenClawPlugin(homeDir, { allow: ['other-plugin'] });

      const detection = detectOpenClaw(homeDir);

      expect(detection.status).toBe('disabled');
      expect(detection.errors?.join('\n')).toContain('plugins.allow');
      expect(detection.errors?.join('\n')).toContain(OPENCLAW_PLUGIN_ID);
    }));

  test('reports disabled when the plugin is on the deny list', () =>
    withHome((homeDir) => {
      installOpenClawFixture(homeDir);
      enableOpenClawPlugin(homeDir, { deny: [OPENCLAW_PLUGIN_ID] });

      expect(detectOpenClaw(homeDir).status).toBe('disabled');
    }));

  test('reports disabled when OpenClaw plugins are globally switched off', () =>
    withHome((homeDir) => {
      installOpenClawFixture(homeDir);
      enableOpenClawPlugin(homeDir, { enabled: false });

      const detection = detectOpenClaw(homeDir);

      expect(detection.status).toBe('disabled');
      expect(detection.errors?.join('\n')).toContain('plugins.enabled');
    }));

  test('reports disabled when the plugin entry is explicitly turned off', () =>
    withHome((homeDir) => {
      installOpenClawFixture(homeDir);
      writeOpenClawConfig(homeDir, {
        plugins: { entries: { [OPENCLAW_PLUGIN_ID]: { enabled: false } } },
      });

      expect(detectOpenClaw(homeDir).status).toBe('disabled');
    }));

  test('reports disabled with an enable hint when no OpenClaw config exists', () =>
    withHome((homeDir) => {
      installOpenClawFixture(homeDir);

      const detection = detectOpenClaw(homeDir);

      expect(detection.status).toBe('disabled');
      expect(detection.errors?.join('\n')).toContain(
        `openclaw plugins enable ${OPENCLAW_PLUGIN_ID}`,
      );
    }));

  test('reports disabled when the OpenClaw config cannot be read', () =>
    withHome((homeDir) => {
      installOpenClawFixture(homeDir);
      writeOpenClawConfig(homeDir, '{ not json');

      const detection = detectOpenClaw(homeDir);

      expect(detection.status).toBe('disabled');
      expect(detection.errors?.join('\n')).toContain('openclaw.json');
    }));

  // A stamp from another version is expected to differ from the packaged files, so it stays an
  // outdated report instead of being swallowed by the content comparison.
  test('reports the installed plugin as outdated when the runtime artifact drifts', () =>
    withHome((homeDir) => {
      installOpenClawFixture(homeDir, '0.0.1');
      enableOpenClawPlugin(homeDir);

      const detection = detectOpenClaw(homeDir);

      expect(detection.status).toBe('configured');
      expect(detection.errors?.join('\n')).toContain('outdated');
      expect(detection.errors?.join('\n')).not.toContain('Modified');
    }));

  test('reports a missing runtime artifact', () =>
    withHome((homeDir) => {
      rmSync(join(installOpenClawFixture(homeDir), ENTRY_FILE));
      enableOpenClawPlugin(homeDir);

      const detection = detectOpenClaw(homeDir);

      expect(detection.status).toBe('n/a');
      expect(detection.errors?.join('\n')).toContain(ENTRY_FILE);
    }));

  test('reports an unmanaged runtime artifact', () =>
    withHome((homeDir) => {
      writeFileSync(join(installOpenClawFixture(homeDir), ENTRY_FILE), 'export default {};\n');

      const detection = detectOpenClaw(homeDir);

      expect(detection.status).toBe('n/a');
      expect(detection.errors?.join('\n')).toContain('Unmanaged');
    }));

  // A managed header, our id, and an entry path are not a plugin: a current-version file edited
  // or truncated below them passes every shape check while OpenClaw registers nothing. Such an
  // install has a byte-for-byte counterpart in the packaged directory, so it is compared to it.
  test.each([
    [
      ENTRY_FILE,
      () => `${buildOpenClawArtifactHeader(packagedArtifactVersion())}export default {};\n`,
    ],
    [MANIFEST_FILE, () => JSON.stringify({ id: OPENCLAW_PLUGIN_ID })],
    [
      PACKAGE_FILE,
      () =>
        JSON.stringify({ name: OPENCLAW_PLUGIN_ID, openclaw: { extensions: [`./${ENTRY_FILE}`] } }),
    ],
  ])('reports a modified %s in a current-version install', (name, content) =>
    withHome((homeDir) => {
      writeFileSync(join(installOpenClawFixture(homeDir), name), content());
      enableOpenClawPlugin(homeDir);

      const detection = detectOpenClaw(homeDir);

      expect(detection.status).toBe('n/a');
      expect(detection.errors?.join('\n')).toContain(`Modified ${name}`);
      expect(detection.errors?.join('\n')).toContain('install --openclaw');
    }));

  // A checkout that was never built has no counterpart to compare an install against, so the
  // header and shape checks stay its only evidence instead of every install reading as modified.
  test('skips the content comparison when the packaged directory cannot be resolved', () =>
    withHome((homeDir) => {
      const dir = installOpenClawFixture(homeDir);
      writeFileSync(join(dir, MANIFEST_FILE), JSON.stringify({ id: OPENCLAW_PLUGIN_ID }));

      expect(
        modifiedFileErrors(dir, packagedArtifactVersion(), resolveOpenClawArtifactDir()),
      ).toEqual([
        `Modified ${MANIFEST_FILE} occupies ${join(dir, MANIFEST_FILE)}; run install --openclaw to restore it`,
      ]);
      expect(modifiedFileErrors(dir, packagedArtifactVersion(), undefined)).toEqual([]);
    }));

  // OpenClaw resolves the runtime entry from package.json's `openclaw.extensions`; without it the
  // plugin cannot load at all, however healthy the other two files look.
  test.each([
    ['missing', undefined],
    ['no longer pointing at the runtime entry', JSON.stringify({ name: OPENCLAW_PLUGIN_ID })],
  ] as const)('reports a package manifest that is %s', (_name, content) =>
    withHome((homeDir) => {
      const path = join(installOpenClawFixture(homeDir), PACKAGE_FILE);
      rmSync(path);
      if (content) writeFileSync(path, content);
      enableOpenClawPlugin(homeDir);

      const detection = detectOpenClaw(homeDir);

      expect(detection.status).toBe('n/a');
      expect(detection.errors?.join('\n')).toContain(PACKAGE_FILE);
    }));

  test('reports a symlinked runtime artifact', () =>
    withHome((homeDir) => {
      const dir = getOpenClawPluginDir(homeDir);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(homeDir, 'target.js'), 'target\n');
      symlinkSync(join(homeDir, 'target.js'), join(dir, ENTRY_FILE));

      const detection = detectOpenClaw(homeDir);

      expect(detection.status).toBe('n/a');
      expect(detection.errors?.join('\n')).toContain('symlink');
    }));

  test('reports a symlinked plugin directory', () =>
    withHome((homeDir) => {
      const dir = getOpenClawPluginDir(homeDir);
      mkdirSync(join(dir, '..'), { recursive: true });
      mkdirSync(join(homeDir, 'elsewhere'));
      symlinkSync(join(homeDir, 'elsewhere'), dir);

      const detection = detectOpenClaw(homeDir);

      expect(detection.status).toBe('n/a');
      expect(detection.errors?.join('\n')).toContain('symlink');
    }));

  test('reports a malformed plugin manifest', () =>
    withHome((homeDir) => {
      writeFileSync(join(installOpenClawFixture(homeDir), MANIFEST_FILE), '{ "id": ');
      enableOpenClawPlugin(homeDir);

      const detection = detectOpenClaw(homeDir);

      expect(detection.status).toBe('n/a');
      expect(detection.errors?.join('\n')).toContain(MANIFEST_FILE);
    }));

  // OpenClaw reads these two before falling back to ~/.openclaw, so a relocated install is
  // protected while doctor reports the default directory as empty. Both go through
  // `resolveUserPath`, which expands a leading `~` against the resolved home, so the tilde forms
  // have to land on the same directory the gateway loads the plugin from.
  test.each([
    ['OPENCLAW_STATE_DIR', (stateDir: string) => ({ OPENCLAW_STATE_DIR: stateDir })],
    [
      'OPENCLAW_CONFIG_PATH',
      (stateDir: string) => ({ OPENCLAW_CONFIG_PATH: join(stateDir, 'openclaw.json') }),
    ],
    ['a tilde-prefixed OPENCLAW_STATE_DIR', () => ({ OPENCLAW_STATE_DIR: '~/oc-state' })],
    [
      'a tilde-prefixed OPENCLAW_CONFIG_PATH',
      () => ({ OPENCLAW_CONFIG_PATH: '~/oc-state/openclaw.json' }),
    ],
  ] as const)('finds the plugin installed under %s', (_name, env) =>
    withHome((homeDir) => {
      const stateDir = join(homeDir, 'oc-state');
      const dir = installOpenClawFixtureIn(join(stateDir, 'extensions', OPENCLAW_PLUGIN_ID));
      writeFileSync(
        join(stateDir, 'openclaw.json'),
        JSON.stringify({ plugins: { entries: { [OPENCLAW_PLUGIN_ID]: { enabled: true } } } }),
      );

      withEnv(env(stateDir), () => {
        const detection = detectOpenClaw(homeDir);

        expect(detection.status).toBe('configured');
        expect(detection.configPath).toBe(dir);
      });
    }));

  test('reports a manifest that claims a different plugin id', () =>
    withHome((homeDir) => {
      writeFileSync(
        join(installOpenClawFixture(homeDir), MANIFEST_FILE),
        JSON.stringify({ id: 'someone-else' }),
      );
      enableOpenClawPlugin(homeDir);

      const detection = detectOpenClaw(homeDir);

      expect(detection.status).toBe('n/a');
      expect(detection.errors?.join('\n')).toContain(MANIFEST_FILE);
    }));
});
