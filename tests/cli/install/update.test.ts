import { afterEach, expect, test } from 'bun:test';
import { join } from 'node:path';
import {
  AGY_PLUGIN_BRANCH,
  AGY_PLUGIN_BRANCH_INSTALL,
  AGY_PLUGIN_BRANCH_SKILL,
  type FlowSpec,
  openCodeV2Script,
  runSide,
} from '../../helpers/command-flow';
import { fileAt } from '../../helpers/host-differential';
import { CLAUDE_CURSOR_PLUGIN_SEED, removeTempRoots } from '../../helpers/temp-home';

const flow = async (spec: FlowSpec) => await runSide(spec);

const NUDGE =
  'Update available: cc-safety-net dev → 9.9.9. Update this CLI with your package manager, e.g. `npm i -g cc-safety-net@latest` for a global install.';
const PERSISTENT_SCRIPT = '/opt/cc-safety-net/bin/cc-safety-net';
const BUNX_PREFIX = `bunx-${process.getuid?.() ?? 0}-`;
const BUNX_ENTRY = `${BUNX_PREFIX}cc-safety-net@`;

const versions = (canned: Record<string, string> = {}) => ({
  fetchVersion: async (args: string[]) => canned[args.join(' ')] ?? null,
  checkLatestVersion: async () => ({
    currentVersion: 'dev',
    latestVersion: '9.9.9',
    updateAvailable: true,
  }),
  scriptPath: PERSISTENT_SCRIPT,
});

afterEach(removeTempRoots);

test('an empty home has nothing to update and still gets the nudge', async () => {
  const result = await flow({ invoke: 'update', options: () => versions() });

  expect(result).toMatchObject({
    exitCode: 0,
    lines: [
      'No installed integrations found. Run `cc-safety-net install` to set one up.',
      '',
      NUDGE,
      '',
    ],
    errors: [],
    log: [],
  });
});

test('updates a v2 OpenCode package object through the native package manager', async () => {
  const result = await flow({
    invoke: 'update',
    seed: {
      '.config/opencode/opencode.jsonc':
        '{"plugins":[{"package":"cc-safety-net@latest","options":{}}]}',
    },
    script: openCodeV2Script(
      undefined,
      'Plugin "cc-safety-net@latest" is already configured in <home>/.config/opencode/opencode.jsonc\n',
    ),
    options: () => versions(),
  });
  expect(result.exitCode).toBe(0);
  expect(result.lines).toContain('Updated OpenCode integration');
  expect(result.log).toContain('opencode plugin update cc-safety-net@latest\t<root>');
});

test('an unparseable argument fails before anything is detected', async () => {
  const result = await flow({ invoke: 'update', args: ['--x'], options: () => versions() });

  expect(result).toMatchObject({
    exitCode: 1,
    lines: [''],
    errors: ['Unknown option for update: --x'],
    log: [],
  });
});

const CURSOR_HOOKS = '.cursor/hooks.json';
const KIMI_CONFIG = '.kimi-code/config.toml';
const HERMES_DIR = '.hermes/plugins/cc-safety-net';
const NPX_ENTRY = '.npm/_npx/9f1/node_modules/cc-safety-net/package.json';
const DRIFTED_KIMI_HOOK = `[[hooks]]
event = "PreToolUse"
command = "npx cc-safety-net hook --kimi-code"
`;

async function seedInstalledHome() {
  const cursor = await flow({ invoke: 'install', args: ['--cursor'] });
  const hermes = await flow({
    invoke: 'install',
    args: ['--hermes-agent'],
    script: [{ command: 'hermes' }],
  });

  return {
    [CURSOR_HOOKS]: fileAt(cursor.tree, CURSOR_HOOKS) ?? '',
    [KIMI_CONFIG]: DRIFTED_KIMI_HOOK,
    [`${HERMES_DIR}/__init__.py`]: fileAt(hermes.tree, `${HERMES_DIR}/__init__.py`) ?? '',
    [`${HERMES_DIR}/plugin.yaml`]: fileAt(hermes.tree, `${HERMES_DIR}/plugin.yaml`) ?? '',
    '.claude/plugins/installed_plugins.json':
      '{"plugins":{"cc-safety-net@cc-marketplace":["kenryu42/cc-marketplace"]}}\n',
    '.claude/settings.json': '{"enabledPlugins":{"cc-safety-net@cc-marketplace":true}}\n',
    '.gemini/extensions/gemini-safety-net/gemini-extension.json': '{}\n',
    [NPX_ENTRY]: '{"name":"cc-safety-net"}\n',
  };
}

const UPDATE_REPORTS = [
  'Updated Claude Code integration',
  `Cursor hook up to date in <home>/${CURSOR_HOOKS}`,
  'Gemini CLI not found; skipped',
  `Updated Hermes Agent plugin at <home>/${HERMES_DIR}`,
  'Restart Hermes to apply the change.',
  `Updated Kimi Code hook in <home>/${KIMI_CONFIG}`,
];

const AGY_PLUGIN = '.gemini/config/plugins/cc-safety-net';
const AGY_LEGACY = '.gemini/config/hooks.json';
const AGY_COMMAND = 'npx -y cc-safety-net hook --agy-cli';
const AGY_BUNDLED_COMMAND = 'node ./dist/bin/cc-safety-net.js hook --agy-cli';
const agyHooks = (name: string, command: string) => ({
  [name]: { PreToolUse: [{ matcher: '*', hooks: [{ type: 'command', command }] }] },
});
const AGY_INSTALL_LOG = [
  'agy plugin install https://github.com/kenryu42/cc-safety-net/tree/plugin\t<root>',
];

test.each([
  ['plugin', `${AGY_PLUGIN}/hooks.json`, AGY_BUNDLED_COMMAND],
  ['legacy npx hook', AGY_LEGACY, AGY_COMMAND],
])(
  'a retained Antigravity CLI %s is skipped when agy is not on PATH and the npx package is still refreshed',
  async (_install, hooksPath, command) => {
    const result = await flow({
      invoke: 'update',
      seed: {
        [hooksPath]: `${JSON.stringify(agyHooks('cc-safety-net', command))}\n`,
        [NPX_ENTRY]: '{"name":"cc-safety-net"}\n',
      },
      options: () => versions(),
    });

    expect(result).toMatchObject({
      exitCode: 0,
      lines: ['Antigravity CLI not found; skipped', '', NUDGE, ''],
      errors: [],
      log: [],
    });
    expect(result.tree.map((entry) => entry.path)).not.toContain('.npm/_npx/9f1');
  },
);

test('update moves a legacy Antigravity CLI hook onto the agy plugin and keeps other hooks', async () => {
  const unrelated = agyHooks('mine', 'echo mine');
  const result = await flow({
    invoke: 'update',
    seed: {
      [AGY_LEGACY]: `${JSON.stringify({ ...unrelated, ...agyHooks('cc-safety-net', AGY_COMMAND) })}\n`,
      [NPX_ENTRY]: '{"name":"cc-safety-net"}\n',
    },
    seedTmp: AGY_PLUGIN_BRANCH,
    script: [AGY_PLUGIN_BRANCH_INSTALL],
    options: () => versions(),
  });

  expect(result).toMatchObject({
    exitCode: 0,
    lines: [
      'Updated Antigravity CLI integration',
      `Removed the legacy Antigravity CLI hook from <home>/${AGY_LEGACY}`,
      '',
      NUDGE,
      '',
    ],
    errors: [],
    log: AGY_INSTALL_LOG,
  });
  expect(fileAt(result.tree, `${AGY_PLUGIN}/hooks.json`)).toContain(AGY_BUNDLED_COMMAND);
  expect(fileAt(result.tree, `${AGY_PLUGIN}/skills/cc-safety-net/SKILL.md`)).toBe(
    AGY_PLUGIN_BRANCH_SKILL,
  );
  expect(JSON.parse(fileAt(result.tree, AGY_LEGACY) ?? '{}')).toEqual({
    ...unrelated,
    'cc-safety-net': { PreToolUse: [] },
  });
  expect(result.tree.map((entry) => entry.path)).not.toContain('.npm/_npx/9f1');
});

test.each([
  ['a cached npx package', NPX_ENTRY, '{"name":"cc-safety-net"}\n'],
  ['an npx cache that cannot be cleared', '.npm/_npx', 'not a directory\n'],
])(
  'update reinstalls the Antigravity CLI plugin from the plugin branch to refresh its skill with %s',
  async (_cache, cachePath, cacheContent) => {
    const result = await flow({
      invoke: 'update',
      seed: {
        [`${AGY_PLUGIN}/.antigravity-plugin/plugin.json`]:
          '{"name":"cc-safety-net","version":"0.0.1"}\n',
        [`${AGY_PLUGIN}/hooks.json`]: `${JSON.stringify(agyHooks('cc-safety-net', AGY_BUNDLED_COMMAND))}\n`,
        [`${AGY_PLUGIN}/skills/cc-safety-net/SKILL.md`]: '# CC Safety Net, outdated\n',
        [cachePath]: cacheContent,
      },
      seedTmp: AGY_PLUGIN_BRANCH,
      script: [AGY_PLUGIN_BRANCH_INSTALL],
      options: () => versions(),
    });

    expect(result).toMatchObject({
      exitCode: 0,
      lines: ['Updated Antigravity CLI integration', '', NUDGE, ''],
      errors: [],
      log: AGY_INSTALL_LOG,
    });
    expect(
      JSON.parse(fileAt(result.tree, `${AGY_PLUGIN}/.antigravity-plugin/plugin.json`) ?? '{}'),
    ).toMatchObject({ version: '9.9.9' });
    expect(fileAt(result.tree, `${AGY_PLUGIN}/skills/cc-safety-net/SKILL.md`)).toBe(
      AGY_PLUGIN_BRANCH_SKILL,
    );
    expect(result.tree.map((entry) => entry.path)).not.toContain('.npm/_npx/9f1');
  },
);

test('every installed integration is updated in catalog order behind one cache clear', async () => {
  const result = await flow({
    invoke: 'update',
    seed: await seedInstalledHome(),
    script: [{ command: 'claude' }, { command: 'hermes' }],
    options: () => versions(),
  });

  expect(result).toMatchObject({
    exitCode: 0,
    lines: [...UPDATE_REPORTS, '', NUDGE, ''],
    errors: [],
    log: [
      'claude plugin marketplace update cc-marketplace\t<root>',
      'claude plugin update cc-safety-net@cc-marketplace\t<root>',
      'hermes plugins enable cc-safety-net --no-allow-tool-override\t<root>',
    ].sort(),
  });
  expect(result.tree.map((entry) => entry.path)).not.toContain('.npm/_npx/9f1');
  expect(fileAt(result.tree, KIMI_CONFIG)).toBe(
    `${DRIFTED_KIMI_HOOK}\n[[hooks]]\nevent = "PreToolUse"\ncommand = "npx -y cc-safety-net hook --kimi-code"\n`,
  );
});

test('one failing target is reported as an error while the rest still update', async () => {
  const result = await flow({
    invoke: 'update',
    seed: await seedInstalledHome(),
    script: [
      { command: 'claude', args: ['plugin', 'update'], exit: 1, stderr: 'marketplace gone\n' },
      { command: 'claude' },
      { command: 'hermes' },
    ],
    options: () => versions(),
  });

  expect(result.exitCode).toBe(1);
  expect(result.lines).toEqual([
    ...UPDATE_REPORTS.filter((line) => line !== 'Updated Claude Code integration'),
    '',
    NUDGE,
    '',
  ]);
  expect(result.errors).toHaveLength(1);
  expect(result.errors[0]).toStartWith(
    'Failed to run claude plugin update cc-safety-net@cc-marketplace (exit 1)',
  );
});

test('an npx script path skips the registry check entirely', async () => {
  const result = await flow({
    invoke: 'update',
    options: (home) => ({
      fetchVersion: async () => null,
      scriptPath: join(home, '..', '_npx', 'abc', 'node_modules', '.bin', 'cc-safety-net'),
      checkLatestVersion: () => {
        throw new Error('the registry must not be asked from an npx cache path');
      },
    }),
  });

  expect(result).toMatchObject({
    exitCode: 0,
    lines: ['No installed integrations found. Run `cc-safety-net install` to set one up.', ''],
    errors: [],
  });
});

test('the bunx entry the update runs from survives while the stale one goes', async () => {
  const result = await flow({
    invoke: 'update',
    seedTmp: {
      [`${BUNX_ENTRY}latest/running.txt`]: 'running\n',
      [`${BUNX_ENTRY}1.2.3/stale.txt`]: 'stale\n',
      [`${BUNX_PREFIX}other-tool@latest/keep.txt`]: 'keep\n',
    },
    options: (home) => ({
      fetchVersion: async () => null,
      scriptPath: join(
        home,
        '..',
        'tmp',
        `${BUNX_ENTRY}latest`,
        'node_modules',
        '.bin',
        'cc-safety-net',
      ),
      checkLatestVersion: () => {
        throw new Error('the registry must not be asked from a bunx cache path');
      },
    }),
  });

  expect(result.exitCode).toBe(0);
  expect(result.tmp.map((entry) => entry.path)).toEqual([
    `${BUNX_ENTRY}latest`,
    `${BUNX_ENTRY}latest/running.txt`,
    `${BUNX_PREFIX}other-tool@latest`,
    `${BUNX_PREFIX}other-tool@latest/keep.txt`,
  ]);
});

test('a persistent install clears its bunx entry and prints the nudge', async () => {
  const result = await flow({
    invoke: 'update',
    seedTmp: { [`${BUNX_ENTRY}latest/x.txt`]: 'stale\n' },
    options: () => versions(),
  });

  expect(result.lines).toEqual([
    'No installed integrations found. Run `cc-safety-net install` to set one up.',
    '',
    NUDGE,
    '',
  ]);
  expect(result.tmp).toEqual([]);
});

const CODEX_LIST =
  '  cc-safety-net  https://github.com/kenryu42/cc-safety-net.git  installed, enabled\n  safety-net@cc-marketplace  https://github.com/kenryu42/cc-safety-net.git  installed, enabled\n';

test('a Codex plugin list with a legacy row updates Codex and removes the old plugin', async () => {
  const result = await flow({
    invoke: 'update',
    script: [{ command: 'codex' }],
    options: () => versions({ 'codex plugin list --marketplace cc-marketplace': CODEX_LIST }),
  });

  expect(result).toMatchObject({
    exitCode: 0,
    warnings: [],
    log: [
      'codex plugin marketplace upgrade cc-marketplace\t<root>',
      'codex plugin add cc-safety-net@cc-marketplace\t<root>',
      'codex plugin remove safety-net@cc-marketplace\t<root>',
    ].sort(),
  });
  expect(result.lines[0]).toBe('Updated Codex integration');
});

test('Codex is found from its cc-marketplace listing without the catalog-fetching full list', async () => {
  const result = await flow({
    invoke: 'update',
    script: [
      {
        command: 'codex',
        args: ['plugin', 'list', '--marketplace', 'cc-marketplace'],
        stdout: [
          'Marketplace `cc-marketplace`',
          '/Users/x/.codex/.tmp/marketplaces/cc-marketplace/.agents/plugins/marketplace.json',
          '',
          'PLUGIN                        STATUS              VERSION  SOURCE',
          'cc-safety-net@cc-marketplace  installed, enabled  2.8.3    https://github.com/kenryu42/cc-safety-net.git, ref `plugin`',
          '',
        ].join('\n'),
      },
      { command: 'codex', args: ['plugin', 'list'], exit: 1 },
      { command: 'codex' },
    ],
    options: () => ({ ...versions(), fetchVersion: undefined }),
  });

  expect(result).toMatchObject({
    exitCode: 0,
    warnings: [],
    log: [
      'codex plugin list --marketplace cc-marketplace\t<root>',
      'codex plugin marketplace upgrade cc-marketplace\t<root>',
      'codex plugin add cc-safety-net@cc-marketplace\t<root>',
    ].sort(),
  });
  expect(result.lines[0]).toBe('Updated Codex integration');
});

test('a Copilot plugin checkout on disk is enough to update Copilot', async () => {
  const result = await flow({
    invoke: 'update',
    seed: { '.copilot/installed-plugins/cc-marketplace/cc-safety-net/plugin.json': '{}\n' },
    script: [
      {
        command: 'copilot',
        args: ['plugin', 'list'],
        stdout: 'cc-safety-net@cc-marketplace  enabled\n',
      },
      { command: 'copilot' },
    ],
    options: () => versions(),
  });

  expect(result).toMatchObject({
    exitCode: 0,
    log: [
      'copilot plugin list\t<root>',
      'copilot plugin marketplace update cc-marketplace\t<root>',
      'copilot plugin update cc-safety-net@cc-marketplace\t<root>',
    ].sort(),
  });
  expect(result.lines[0]).toBe('Updated GitHub Copilot CLI integration');
});

test('a Claude Code install under CLAUDE_CONFIG_DIR is found and updated', async () => {
  const result = await flow({
    invoke: 'update',
    env: { CLAUDE_CONFIG_DIR: '<home>/relocated' },
    seed: {
      'relocated/plugins/installed_plugins.json':
        '{"plugins":{"cc-safety-net@cc-marketplace":[{}]}}\n',
      'relocated/settings.json': '{"enabledPlugins":{"cc-safety-net@cc-marketplace":true}}\n',
    },
    script: [{ command: 'claude' }],
    options: () => versions(),
  });

  expect(result).toMatchObject({
    exitCode: 0,
    log: [
      'claude plugin marketplace update cc-marketplace\t<root>',
      'claude plugin update cc-safety-net@cc-marketplace\t<root>',
    ].sort(),
  });
  expect(result.lines[0]).toBe('Updated Claude Code integration');
});

test('a Cursor protected only through the Claude Code plugin gets no npx hook on update', async () => {
  const result = await flow({
    invoke: 'update',
    seed: CLAUDE_CURSOR_PLUGIN_SEED,
    script: [{ command: 'claude' }],
    options: () => versions(),
  });

  expect(result.exitCode).toBe(0);
  expect(result.lines[0]).toBe('Updated Claude Code integration');
  expect(result.lines.join('\n')).not.toContain('Cursor');
  expect(fileAt(result.tree, CURSOR_HOOKS)).toBeUndefined();
});

test('a Kimi Code plugin install is named and left to the in-host update', async () => {
  const result = await flow({
    invoke: 'update',
    seed: {
      '.kimi-code/plugins/installed.json':
        '{"version":1,"plugins":[{"id":"cc-safety-net","enabled":true}]}\n',
    },
    options: () => versions(),
  });

  expect(result).toMatchObject({
    exitCode: 0,
    lines: [
      'Kimi Code plugin skipped: update it in Kimi Code from /plugins (Installed tab, select cc-safety-net, press Enter)',
      '',
      NUDGE,
      '',
    ],
    errors: [],
    log: [],
  });
  expect(fileAt(result.tree, KIMI_CONFIG)).toBeUndefined();
});
