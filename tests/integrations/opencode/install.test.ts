import { describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { stripJsonComments } from '@/integrations/jsonc';
import { uninstallOpenCode, verifyOpenCodePluginRuntime } from '@/integrations/opencode/install';
import { withEnv } from '../../helpers.ts';
import { makeTempHome, runCli } from '../hook-helpers';
import { writeFakeCommands } from '../install/install-test-helpers';

function uninstallWithConfigs(name: string, files: Record<string, string>) {
  const homeDir = makeTempHome(name);
  const configDir = join(homeDir, '.config', 'opencode');
  mkdirSync(configDir, { recursive: true });
  for (const [filename, content] of Object.entries(files)) {
    writeFileSync(join(configDir, filename), content);
  }

  try {
    const result = withEnv({ XDG_CONFIG_HOME: undefined, XDG_CACHE_HOME: undefined }, () =>
      uninstallOpenCode(homeDir),
    );
    return {
      result,
      contents: Object.fromEntries(
        Object.keys(files).map((filename) => [
          filename,
          readFileSync(join(configDir, filename), 'utf-8'),
        ]),
      ),
      configDir,
    };
  } finally {
    rmSync(homeDir, { recursive: true, force: true });
  }
}

function uninstallWithConfig(name: string, config: string, filename = 'opencode.json') {
  const { result, contents, configDir } = uninstallWithConfigs(name, { [filename]: config });
  return { result, content: contents[filename] ?? '', configPath: join(configDir, filename) };
}

describe('OpenCode uninstall config editing', () => {
  test('ignores a nested "plugin" key and edits the root plugin array', () => {
    const { result, content, configPath } = uninstallWithConfig(
      'safety-net-opencode-nested',
      `{
  "experimental": {
    "hook": {
      "plugin": ["nested-only"]
    }
  },
  "plugin": [
    "cc-safety-net@latest",
    "other-plugin"
  ]
}
`,
    );

    expect(result).toEqual({ path: configPath, alreadyInstalled: true });
    expect(content).toContain('"plugin": ["nested-only"]');
    expect(content).not.toContain('cc-safety-net');
    expect(JSON.parse(content)).toEqual({
      experimental: { hook: { plugin: ['nested-only'] } },
      plugin: ['other-plugin'],
    });
  });

  test('does not touch managed text inside comments when removing plugin entries', () => {
    const { result, content, configPath } = uninstallWithConfig(
      'safety-net-opencode-comments',
      `{
  /* plugin list ] here */
  "plugin": [
    // "cc-safety-net@dev",
    "cc-safety-net@latest",
    "other-plugin"
  ]
}
`,
      'opencode.jsonc',
    );

    expect(result).toEqual({ path: configPath, alreadyInstalled: true });
    expect(content).toContain('/* plugin list ] here */');
    expect(content).toContain('// "cc-safety-net@dev",');
    expect(content).not.toContain('"cc-safety-net@latest"');
    expect(JSON.parse(stripJsonComments(content))).toEqual({ plugin: ['other-plugin'] });
  });

  test('removes multiple managed plugin entries without corrupting the array', () => {
    const { result, content, configPath } = uninstallWithConfig(
      'safety-net-opencode-multi',
      `{
  "plugin": [
    "cc-safety-net",
    "other-plugin",
    "cc-safety-net@latest"
  ]
}
`,
    );

    expect(result).toEqual({ path: configPath, alreadyInstalled: true });
    expect(JSON.parse(content)).toEqual({ plugin: ['other-plugin'] });
  });

  test('removing the only plugin entry leaves a valid empty array', () => {
    const { result, content, configPath } = uninstallWithConfig(
      'safety-net-opencode-only',
      `{
  "plugin": [
    "cc-safety-net@latest"
  ],
  "theme": "system"
}
`,
    );

    expect(result).toEqual({ path: configPath, alreadyInstalled: true });
    expect(JSON.parse(content)).toEqual({ plugin: [], theme: 'system' });
  });

  test('escaped quotes and comment-like text inside a string value do not confuse the scanner', () => {
    const instructions = 'say \\"plugin\\": [ nope ] // not a comment';
    const { result, content, configPath } = uninstallWithConfig(
      'safety-net-opencode-escapes',
      `{
  "instructions": "${instructions}",
  "plugin": [
    "cc-safety-net@latest",
    "other-plugin"
  ]
}
`,
    );

    expect(result).toEqual({ path: configPath, alreadyInstalled: true });
    expect(content).toContain(`"instructions": "${instructions}",`);
    expect(JSON.parse(content)).toEqual({
      instructions: 'say "plugin": [ nope ] // not a comment',
      plugin: ['other-plugin'],
    });
  });

  test('comments between the "plugin" key and its array do not defeat the array locator', () => {
    const { result, content, configPath } = uninstallWithConfig(
      'safety-net-opencode-key-comments',
      `{
  "plugin" /* which plugins */ : // list
  [
    "cc-safety-net@latest",
    "other-plugin"
  ]
}
`,
      'opencode.jsonc',
    );

    expect(result).toEqual({ path: configPath, alreadyInstalled: true });
    expect(content).toContain('/* which plugins */');
    expect(content).toContain('// list');
    expect(content).not.toContain('cc-safety-net');
    expect(JSON.parse(stripJsonComments(content))).toEqual({ plugin: ['other-plugin'] });
  });
});

describe('OpenCode uninstall config discovery', () => {
  test('scans every config file, not just the first one that exists', () => {
    const json = `{
  "plugin": ["unrelated-plugin"]
}
`;
    const { result, contents, configDir } = uninstallWithConfigs('safety-net-opencode-both', {
      'opencode.json': json,
      'opencode.jsonc': `{
  "plugin": ["cc-safety-net@latest", "other-plugin"]
}
`,
    });

    expect(result).toEqual({
      path: join(configDir, 'opencode.jsonc'),
      alreadyInstalled: true,
    });
    expect(contents['opencode.json']).toBe(json);
    expect(JSON.parse(contents['opencode.jsonc'] ?? '')).toEqual({ plugin: ['other-plugin'] });
  });

  test('a broken opencode.json does not block uninstalling from opencode.jsonc', () => {
    const { result, contents, configDir } = uninstallWithConfigs('safety-net-opencode-broken', {
      'opencode.json': '{ "plugin": [ ',
      'opencode.jsonc': `{
  "plugin": ["cc-safety-net@latest", "other-plugin"]
}
`,
    });

    expect(result).toEqual({
      path: join(configDir, 'opencode.jsonc'),
      alreadyInstalled: true,
    });
    expect(contents['opencode.json']).toBe('{ "plugin": [ ');
    expect(JSON.parse(contents['opencode.jsonc'] ?? '')).toEqual({ plugin: ['other-plugin'] });
  });

  test('reports the existing jsonc config when no managed plugin is present', () => {
    const { result, configDir } = uninstallWithConfigs('safety-net-opencode-jsonc-only', {
      'opencode.jsonc': `{
  // no managed plugin here
  "plugin": ["other-plugin"]
}
`,
    });

    expect(result).toEqual({
      path: join(configDir, 'opencode.jsonc'),
      alreadyInstalled: false,
    });
  });

  test('falls back to the default opencode.json path when no config file exists', () => {
    const { result, configDir } = uninstallWithConfigs('safety-net-opencode-none', {});

    expect(result).toEqual({
      path: join(configDir, 'opencode.json'),
      alreadyInstalled: false,
    });
  });
});

describe('OpenCode XDG base directories', () => {
  test('uninstall edits the XDG_CONFIG_HOME config and clears the XDG_CACHE_HOME package', () => {
    const homeDir = makeTempHome('safety-net-opencode-xdg');
    const configPath = join(homeDir, 'xdg-config', 'opencode', 'opencode.json');
    mkdirSync(join(configPath, '..'), { recursive: true });
    writeFileSync(configPath, JSON.stringify({ plugin: ['cc-safety-net@latest'] }));
    const cacheDir = join(homeDir, 'xdg-cache', 'opencode', 'packages', 'cc-safety-net@latest');
    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(join(cacheDir, 'marker'), 'cached');

    try {
      const result = withEnv(
        {
          XDG_CONFIG_HOME: join(homeDir, 'xdg-config'),
          XDG_CACHE_HOME: join(homeDir, 'xdg-cache'),
        },
        () => uninstallOpenCode(homeDir),
      );

      expect(result).toEqual({ path: configPath, alreadyInstalled: true });
      expect(readFileSync(configPath, 'utf-8')).not.toContain('cc-safety-net');
      expect(existsSync(cacheDir)).toBeFalse();
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  });
});

/** The package layout `opencode plugin -g -f cc-safety-net@latest` leaves in the cache. */
function writeOpenCodeCacheFixture(homeDir: string, entrySource: string) {
  const packageDir = join(
    homeDir,
    '.cache',
    'opencode',
    'packages',
    'cc-safety-net@latest',
    'node_modules',
    'cc-safety-net',
  );
  mkdirSync(packageDir, { recursive: true });
  writeFileSync(join(packageDir, 'package.json'), JSON.stringify({ main: 'index.js' }));
  writeFileSync(join(packageDir, 'index.js'), entrySource);
  return packageDir;
}

function withCacheHome<T>(name: string, fn: (homeDir: string) => T) {
  const homeDir = makeTempHome(name);
  const cleanup = () => rmSync(homeDir, { recursive: true, force: true });
  const result = withEnv({ XDG_CACHE_HOME: undefined }, () => fn(homeDir));
  if (result instanceof Promise) return result.finally(cleanup) as T;
  cleanup();
  return result;
}

describe('OpenCode plugin runtime verification', () => {
  test('fails when the install left no plugin package in the cache', () =>
    withCacheHome('safety-net-opencode-runtime-missing', (homeDir) =>
      expect(verifyOpenCodePluginRuntime(homeDir)).rejects.toThrow('missing its package'),
    ));

  test('fails when the cached entry does not export a callable plugin', () =>
    withCacheHome('safety-net-opencode-runtime-broken', (homeDir) => {
      writeOpenCodeCacheFixture(homeDir, 'export const CCSafetyNetPlugin = 42;\n');

      return expect(verifyOpenCodePluginRuntime(homeDir)).rejects.toThrow(
        'does not export a callable',
      );
    }));

  test('accepts a cached entry whose plugin export is callable', () =>
    withCacheHome('safety-net-opencode-runtime-loaded', (homeDir) => {
      writeOpenCodeCacheFixture(homeDir, 'export const CCSafetyNetPlugin = () => {};\n');

      return expect(verifyOpenCodePluginRuntime(homeDir)).resolves.toBeUndefined();
    }));

  // `opencode plugin` exiting 0 proves nothing: OpenCode fails open when a configured plugin
  // cannot be loaded, so an install that never populated the cache must not report success.
  // This starts a nested Bun CLI and a Windows command shim, which can exceed Bun's default
  // five-second test timeout under full-suite coverage instrumentation.
  test('fails the install when the plugin command left the cache empty', async () => {
    const homeDir = makeTempHome('safety-net-opencode-runtime-cli');
    const binDir = writeFakeCommands(homeDir, { opencode: 'process.exit(0);' });

    try {
      const result = await runCli(['install', '--opencode'], '', {
        HOME: homeDir,
        PATH: `${binDir}${delimiter}${process.env.PATH ?? ''}`,
        XDG_CONFIG_HOME: join(homeDir, '.config'),
        XDG_CACHE_HOME: join(homeDir, '.cache'),
      });

      expect(result.stderr).toContain('missing its package');
      expect(result.exitCode).toBe(1);
    } finally {
      rmSync(homeDir, { recursive: true, force: true });
    }
  }, 15_000);
});
