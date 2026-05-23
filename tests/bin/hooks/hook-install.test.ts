import { describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runCli } from './hook-helpers';

const KIMI_HOOK_BLOCK = `[[hooks]]
event = "PreToolUse"
matcher = "Shell"
command = "npx -y cc-safety-net hook --kimi-cli"`;
const KIMI_INLINE_HOOK =
  '{ event = "PreToolUse", matcher = "Shell", command = "npx -y cc-safety-net hook --kimi-cli" }';

function makeTempHome(name: string) {
  const dir = join(tmpdir(), `${name}-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function writeOpenCodeConfig(homeDir: string, content: string) {
  const configDir = join(homeDir, '.config', 'opencode');
  const configPath = join(configDir, 'opencode.jsonc');
  mkdirSync(configDir, { recursive: true });
  writeFileSync(configPath, content);
  return configPath;
}

function writeKimiConfig(homeDir: string, content: string) {
  const shareDir = join(homeDir, '.kimi');
  const configPath = join(shareDir, 'config.toml');
  mkdirSync(shareDir, { recursive: true });
  writeFileSync(configPath, content);
  return configPath;
}

async function runKimiInstall(homeDir: string, configPath: string) {
  const result = await runCli(['hook', 'install', '--kimi-cli'], '', { HOME: homeDir });
  return { result, content: readFileSync(configPath, 'utf-8') };
}

async function runKimiUninstall(homeDir: string, configPath: string) {
  const result = await runCli(['hook', 'uninstall', '--kimi-cli'], '', { HOME: homeDir });
  return { result, content: readFileSync(configPath, 'utf-8') };
}

async function runOpenCodeInstall(homeDir: string, configPath: string) {
  const result = await runCli(['hook', 'install', '--opencode'], '', { HOME: homeDir });
  return { result, content: readFileSync(configPath, 'utf-8') };
}

async function runOpenCodeUninstall(homeDir: string, configPath: string) {
  const result = await runCli(['hook', 'uninstall', '--opencode'], '', { HOME: homeDir });
  return { result, content: readFileSync(configPath, 'utf-8') };
}

function expectOpenCodeInstalled(result: Awaited<ReturnType<typeof runCli>>, configPath: string) {
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain(`Installed OpenCode hook in ${configPath}`);
}

function expectOpenCodeUninstalled(result: Awaited<ReturnType<typeof runCli>>, configPath: string) {
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain(`Uninstalled OpenCode hook from ${configPath}`);
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

describe('hook install command', () => {
  test('OpenCode: creates default config when missing', async () => {
    const homeDir = makeTempHome('safety-net-opencode-install');

    try {
      const result = await runCli(['hook', 'install', '--opencode'], '', { HOME: homeDir });
      const configPath = join(homeDir, '.config', 'opencode', 'opencode.jsonc');

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain(`Installed OpenCode hook in ${configPath}`);
      expect(JSON.parse(readFileSync(configPath, 'utf-8'))).toEqual({
        plugin: ['cc-safety-net@latest'],
      });
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('OpenCode: honors OPENCODE_CONFIG_DIR and preserves JSONC comments', async () => {
    const homeDir = makeTempHome('safety-net-opencode-install');
    const configDir = join(homeDir, 'custom-opencode');
    const configPath = join(configDir, 'opencode.jsonc');
    mkdirSync(configDir, { recursive: true });
    writeFileSync(
      configPath,
      `{
  // keep this comment
  "name": "plugin",
  "theme": "system",
  "plugin": [
    "other-plugin"
  ],
}
`,
    );

    try {
      const result = await runCli(['hook', 'install', '--opencode'], '', {
        HOME: homeDir,
        OPENCODE_CONFIG_DIR: configDir,
      });
      const content = readFileSync(configPath, 'utf-8');

      expect(result.exitCode).toBe(0);
      expect(content).toContain('// keep this comment');
      expect(content).toContain('"other-plugin"');
      expect(content).toContain('"cc-safety-net@latest"');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('OpenCode: installs into plugin array after leading JSONC comment', async () => {
    const homeDir = makeTempHome('safety-net-opencode-install');
    const configPath = writeOpenCodeConfig(
      homeDir,
      `// leading comment
{
  "plugin": [
    "other-plugin"
  ]
}
`,
    );

    try {
      const installed = await runOpenCodeInstall(homeDir, configPath);

      expectOpenCodeInstalled(installed.result, configPath);
      expect(installed.content).toContain('// leading comment');
      expect(installed.content).toContain('"other-plugin"');
      expect(installed.content).toContain('"cc-safety-net@latest"');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('OpenCode: adds plugin property after leading block comment', async () => {
    const homeDir = makeTempHome('safety-net-opencode-install');
    const configPath = writeOpenCodeConfig(
      homeDir,
      `/* leading comment */
{
  "theme": "system"
}
`,
    );

    try {
      const installed = await runOpenCodeInstall(homeDir, configPath);

      expectOpenCodeInstalled(installed.result, configPath);
      expect(installed.content).toContain('/* leading comment */');
      expect(installed.content).toContain('"theme": "system"');
      expect(installed.content).toContain('"plugin"');
      expect(installed.content).toContain('"cc-safety-net@latest"');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('OpenCode: honors XDG_CONFIG_HOME and first existing candidate', async () => {
    const homeDir = makeTempHome('safety-net-opencode-install');
    const configDir = join(homeDir, 'xdg', 'opencode');
    mkdirSync(configDir, { recursive: true });
    writeFileSync(join(configDir, 'opencode.jsonc'), '{ "plugin": [] }');
    writeFileSync(join(configDir, 'opencode.json'), '{ "plugin": [] }');

    try {
      const result = await runCli(['hook', 'install', '--opencode'], '', {
        HOME: homeDir,
        XDG_CONFIG_HOME: join(homeDir, 'xdg'),
      });

      expect(result.exitCode).toBe(0);
      expect(readFileSync(join(configDir, 'opencode.jsonc'), 'utf-8')).toContain(
        'cc-safety-net@latest',
      );
      expect(readFileSync(join(configDir, 'opencode.json'), 'utf-8')).not.toContain(
        'cc-safety-net@latest',
      );
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('OpenCode: install is idempotent', async () => {
    const homeDir = makeTempHome('safety-net-opencode-install');
    const configPath = writeOpenCodeConfig(homeDir, '{ "plugin": ["cc-safety-net@latest"] }');

    try {
      const first = await runCli(['hook', 'install', '--opencode'], '', { HOME: homeDir });
      const second = await runCli(['hook', 'install', '--opencode'], '', { HOME: homeDir });
      const content = readFileSync(configPath, 'utf-8');

      expect(first.exitCode).toBe(0);
      expect(second.exitCode).toBe(0);
      expect(content.match(/cc-safety-net/g)?.length).toBe(1);
      expect(second.stdout).toContain('already installed');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('OpenCode: install recognizes pinned and unpinned managed plugins', async () => {
    const homeDir = makeTempHome('safety-net-opencode-install');
    const configPath = writeOpenCodeConfig(
      homeDir,
      '{ "plugin": ["cc-safety-net@0.9.0", "cc-safety-net"] }',
    );

    try {
      const installed = await runOpenCodeInstall(homeDir, configPath);

      expect(installed.result.exitCode).toBe(0);
      expect(installed.result.stdout).toContain('already installed');
      expect(installed.content).not.toContain('cc-safety-net@latest');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('OpenCode: install does not treat substring plugin names as managed', async () => {
    const homeDir = makeTempHome('safety-net-opencode-install');
    const configPath = writeOpenCodeConfig(homeDir, '{ "plugin": ["my-cc-safety-net-wrapper"] }');

    try {
      const installed = await runOpenCodeInstall(homeDir, configPath);

      expectOpenCodeInstalled(installed.result, configPath);
      expect(installed.content).toContain('"my-cc-safety-net-wrapper"');
      expect(installed.content).toContain('"cc-safety-net@latest"');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('OpenCode: rejects non-array plugin without modifying config', async () => {
    const homeDir = makeTempHome('safety-net-opencode-install');
    const configPath = writeOpenCodeConfig(homeDir, '{ "plugin": "cc-safety-net" }');

    try {
      const result = await runCli(['hook', 'install', '--opencode'], '', { HOME: homeDir });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('OpenCode plugin must be an array');
      expect(readFileSync(configPath, 'utf-8')).toBe('{ "plugin": "cc-safety-net" }');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi CLI: creates default config when missing', async () => {
    const homeDir = makeTempHome('safety-net-kimi-install');

    try {
      const result = await runCli(['hook', 'install', '--kimi-cli'], '', { HOME: homeDir });
      const configPath = join(homeDir, '.kimi', 'config.toml');

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain(`Installed Kimi CLI hook in ${configPath}`);
      expect(readFileSync(configPath, 'utf-8').trim()).toBe(KIMI_HOOK_BLOCK);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi CLI: honors KIMI_SHARE_DIR and removes top-level hooks array', async () => {
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
      const result = await runCli(['hook', 'install', '--kimi-cli'], '', {
        HOME: homeDir,
        KIMI_SHARE_DIR: shareDir,
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

  test('Kimi CLI: install is idempotent', async () => {
    const homeDir = makeTempHome('safety-net-kimi-install');
    const configPath = writeKimiConfig(homeDir, `${KIMI_HOOK_BLOCK}\n`);

    try {
      const installed = await runKimiInstall(homeDir, configPath);

      expect(installed.result.exitCode).toBe(0);
      expect(installed.content.match(/cc-safety-net hook --kimi-cli/g)?.length).toBe(1);
      expect(installed.result.stdout).toContain('already installed');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi CLI: preserves non-empty inline hooks array syntax', async () => {
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

  test('Kimi CLI: preserves inline hooks array with hash comments', async () => {
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
      const result = await runCli(['hook', 'install', '--opencode', 'extra'], '', {
        HOME: homeDir,
      });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Unexpected argument for hook install: extra');
      expect(existsSync(join(homeDir, '.config', 'opencode', 'opencode.jsonc'))).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('rejects ambiguous install target', async () => {
    const homeDir = makeTempHome('safety-net-install');

    try {
      const result = await runCli(['hook', 'install', '--opencode', '--kimi-cli'], '', {
        HOME: homeDir,
      });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Choose exactly one install target');
      expect(existsSync(join(homeDir, '.config', 'opencode', 'opencode.jsonc'))).toBe(false);
      expect(existsSync(join(homeDir, '.kimi', 'config.toml'))).toBe(false);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });
});

describe('hook uninstall command', () => {
  test('OpenCode: removes managed plugin and preserves other plugins and comments', async () => {
    const homeDir = makeTempHome('safety-net-opencode-uninstall');
    const configPath = writeOpenCodeConfig(
      homeDir,
      `// leading comment
{
  // keep this comment
  "plugin": [
    "other-plugin",
    "cc-safety-net@latest"
  ]
}
`,
    );

    try {
      const result = await runCli(['hook', 'uninstall', '--opencode'], '', { HOME: homeDir });
      const content = readFileSync(configPath, 'utf-8');

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain(`Uninstalled OpenCode hook from ${configPath}`);
      expect(content).toContain('// leading comment');
      expect(content).toContain('// keep this comment');
      expect(content).toContain('"other-plugin"');
      expect(content).not.toContain('cc-safety-net@latest');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('OpenCode: uninstall is idempotent when managed plugin is absent', async () => {
    const homeDir = makeTempHome('safety-net-opencode-uninstall');
    const configPath = writeOpenCodeConfig(homeDir, '{ "plugin": ["other-plugin"] }');

    try {
      const result = await runCli(['hook', 'uninstall', '--opencode'], '', { HOME: homeDir });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('not installed');
      expect(readFileSync(configPath, 'utf-8')).toBe('{ "plugin": ["other-plugin"] }');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('OpenCode: removes pinned and unpinned managed plugins', async () => {
    const homeDir = makeTempHome('safety-net-opencode-uninstall');
    const configPath = writeOpenCodeConfig(
      homeDir,
      `{
  "plugin": [
    "cc-safety-net@0.9.0",
    "other-plugin",
    "cc-safety-net"
  ]
}
`,
    );

    try {
      const uninstalled = await runOpenCodeUninstall(homeDir, configPath);

      expectOpenCodeUninstalled(uninstalled.result, configPath);
      expect(uninstalled.content).toContain('"other-plugin"');
      expect(uninstalled.content).not.toContain('cc-safety-net@0.9.0');
      expect(uninstalled.content).not.toContain('"cc-safety-net"');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('OpenCode: uninstall ignores substring plugin names', async () => {
    const homeDir = makeTempHome('safety-net-opencode-uninstall');
    const configPath = writeOpenCodeConfig(
      homeDir,
      '{ "plugin": ["my-cc-safety-net-wrapper", "other-plugin"] }',
    );

    try {
      const uninstalled = await runOpenCodeUninstall(homeDir, configPath);

      expect(uninstalled.result.exitCode).toBe(0);
      expect(uninstalled.result.stdout).toContain('not installed');
      expect(uninstalled.content).toBe(
        '{ "plugin": ["my-cc-safety-net-wrapper", "other-plugin"] }',
      );
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi CLI: removes managed table hook block only', async () => {
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
      expect(uninstalled.result.stdout).toContain(`Uninstalled Kimi CLI hook from ${configPath}`);
      expect(uninstalled.content).toContain('prettier --write');
      expect(uninstalled.content).not.toContain('cc-safety-net hook --kimi-cli');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi CLI: removes managed inline hook and preserves inline syntax', async () => {
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
      expect(uninstalled.content).not.toContain('cc-safety-net hook --kimi-cli');
      expect(uninstalled.content).not.toContain('[[hooks]]');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi CLI: removes inline hook with hash comments in hooks array', async () => {
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
      expect(uninstalled.content).not.toContain('cc-safety-net hook --kimi-cli');
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('rejects unexpected uninstall positional arguments', async () => {
    const homeDir = makeTempHome('safety-net-uninstall');
    const configPath = writeKimiConfig(homeDir, `${KIMI_HOOK_BLOCK}\n`);

    try {
      const result = await runCli(['hook', 'uninstall', '--kimi-cli', 'extra'], '', {
        HOME: homeDir,
      });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Unexpected argument for hook uninstall: extra');
      expect(readFileSync(configPath, 'utf-8')).toBe(`${KIMI_HOOK_BLOCK}\n`);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  test('Kimi CLI: uninstall is idempotent when managed hook is absent', async () => {
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
});
