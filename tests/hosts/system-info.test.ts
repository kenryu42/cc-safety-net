import { afterEach, describe, expect, test } from 'bun:test';
import { join } from 'node:path';
import {
  defaultVersionFetcher,
  getPackageVersion,
  getSpawnCommand,
  getSystemInfo,
} from '@/hosts/system-info';
import { createFakeBin, type FakeScriptEntry } from '../helpers/fake-bin';
import { writeTree } from '../helpers/fixture-tree';
import { createTempRoot, removeTempRoots, withProcessEnv } from '../helpers/temp-home';

const ANSI_VERSION = `\u001b[32mv2.0.0\u001b[0m\n`;

const SCRIPT: readonly FakeScriptEntry[] = [
  { command: 'ver', args: ['--version'], stdout: 'v1.2.3\n' },
  { command: 'painted', args: ['--version'], stdout: ANSI_VERSION },
  { command: 'noisy', args: ['--version'], stderr: 'v3.0.0\n' },
  { command: 'broken', args: ['--version'], stdout: 'v9.9.9\n', exit: 1 },
  { command: 'stalled', args: ['--version'], delayMs: 2000 },
];

afterEach(removeTempRoots);

describe('the Windows-safe argv', () => {
  test('hands a shim to COMSPEC and spawns everything else directly', () => {
    const dir = createTempRoot('next-spawn-');
    writeTree(dir, { 'tool.CMD': '', 'other.EXE': '' });
    const windows = {
      _CC_SAFETY_NET_TEST_SPAWN_PLATFORM: 'win32',
      PATH: dir,
      PATHEXT: '.EXE;.CMD',
    };
    const cases: readonly { args: string[]; env: NodeJS.ProcessEnv }[] = [
      { args: ['tool', 'a b', 'c'], env: {} },
      { args: [], env: {} },
      { args: ['tool', 'a b', 'c'], env: windows },
      { args: ['tool'], env: { ...windows, COMSPEC: 'D:\\Windows\\System32\\cmd.exe' } },
      { args: ['other', 'x'], env: windows },
      { args: [join(dir, 'tool'), 'x'], env: windows },
      { args: ['tool.CMD', 'x'], env: windows },
      { args: ['ghost', 'x'], env: windows },
    ];
    const resolved = (spawnCommand: typeof getSpawnCommand) =>
      cases.map((testCase) => spawnCommand(testCase.args, testCase.env));

    expect(resolved(getSpawnCommand)).toEqual([
      { cmd: 'tool', args: ['a b', 'c'] },
      { cmd: '', args: [] },
      { cmd: 'cmd.exe', args: ['/d', '/c', `call ${join(dir, 'tool.CMD')} "a b" c`] },
      {
        cmd: 'D:\\Windows\\System32\\cmd.exe',
        args: ['/d', '/c', `call ${join(dir, 'tool.CMD')}`],
      },
      { cmd: join(dir, 'other.EXE'), args: ['x'] },
      { cmd: 'cmd.exe', args: ['/d', '/c', `call ${join(dir, 'tool.CMD')} x`] },
      { cmd: 'cmd.exe', args: ['/d', '/c', `call ${join(dir, 'tool.CMD')} x`] },
      { cmd: 'ghost', args: ['x'] },
    ]);
  });
});

describe('the default version probe', () => {
  test('reads a clean exit only, and strips whatever painted it', async () => {
    const bin = createFakeBin(join(createTempRoot('next-version-'), 'fake'), SCRIPT);
    const probe = async (fetcher: typeof defaultVersionFetcher) => [
      await fetcher(['ver', '--version']),
      await fetcher(['painted', '--version']),
      await fetcher(['noisy', '--version']),
      await fetcher(['broken', '--version']),
      await fetcher([]),
      await fetcher(['stalled', '--version'], 200),
    ];
    const ported = await withProcessEnv(bin.env, () => probe(defaultVersionFetcher));
    expect(ported).toEqual(['v1.2.3', 'v2.0.0', 'v3.0.0', null, null, null]);
  });
});

describe('the system report', () => {
  test('probes every host once and parses whatever each one printed', async () => {
    const outputs: Record<string, string | null> = {
      'agy --version': 'v1.0.1',
      'claude --version': 'Claude Code 1.2.3',
      'codex --version': 'v2.0.0-beta.1',
      'copilot --binary-version': 'no digits\nsecond',
      'gemini --version': null,
      'grok --version': 'grok 1.0.6',
      'hermes --version': 'Hermes 1.0.7',
      'kimi --version': 'Kimi 1.0.8',
      'openclaw --version': '1.0.9',
      'opencode --version': '1.0.10',
      'pi --version': '1.0.11',
      'cursor --version': '1.0.12',
      'npx --offline --no-install @deepseek-ai/dsh --version': '1.0.13',
      'amp --version': '1.0.14',
      'droid --version': '0.233.0',
      'devin --version': 'devin 3000.11.3 (9c803229faa4)',
      'codex plugin list': 'codex plugins',
      'amp plugins list': 'amp plugins',
      'node --version': 'v22.0.0',
      'npm --version': '10.0.0',
      'bun --version': '1.3.0',
    };
    const calls: { args: string[]; timeoutMs: number | undefined }[] = [];
    const info = await getSystemInfo(
      () => false,
      async (args, timeoutMs) => {
        calls.push({ args, timeoutMs });
        return outputs[args.join(' ')] ?? null;
      },
    );
    expect(calls.map((call) => call.args.join(' ')).sort()).toEqual(Object.keys(outputs).sort());
    expect(calls.filter((call) => call.timeoutMs !== undefined)).toEqual([
      { args: ['codex', 'plugin', 'list'], timeoutMs: 30_000 },
      { args: ['amp', 'plugins', 'list'], timeoutMs: 30_000 },
    ]);
    expect(info.versions).toEqual({
      'antigravity-cli': '1.0.1',
      'claude-code': '1.2.3',
      codex: '2.0.0-beta.1',
      'copilot-cli': 'no digits',
      'gemini-cli': null,
      'grok-build': '1.0.6',
      'hermes-agent': '1.0.7',
      'kimi-code': '1.0.8',
      openclaw: '1.0.9',
      opencode: '1.0.10',
      pi: '1.0.11',
      cursor: '1.0.12',
      'deepseek-harness': '1.0.13',
      amp: '1.0.14',
      droid: '0.233.0',
      devin: '3000.11.3',
    });
    expect(info).toMatchObject({
      nodeVersion: '22.0.0',
      npmVersion: '10.0.0',
      bunVersion: '1.3.0',
      codexPluginListOutput: 'codex plugins',
      ampPluginListOutput: 'amp plugins',
    });
    expect(info.version).toBe('dev');
    expect(info.platform).toBe(`${process.platform} ${process.arch}`);
  });

  test.each([
    [
      '2.0.19 with a cc-safety-net entry',
      '2.0.19',
      true,
      [
        {
          args: [
            'opencode',
            'api',
            'integration.list',
            '--param',
            'location[directory]=/work/project',
          ],
          timeoutMs: 30_000,
        },
        {
          args: ['opencode', 'api', 'plugin.list', '--param', 'location[directory]=/work/project'],
          timeoutMs: 30_000,
        },
      ],
      'plugin inventory',
    ],
    ['2.0.19 without a cc-safety-net entry', '2.0.19', false, [], null],
    ['1.18.33 with a cc-safety-net entry', '1.18.33', true, [], null],
  ])(
    'asks OpenCode %s for its plugin inventory only on v2 with the entry',
    async (_case, version, hasEntry, apiCalls, output) => {
      const calls: { args: string[]; timeoutMs: number | undefined }[] = [];
      const entryChecks: string[] = [];
      const info = await getSystemInfo(
        (openCodeVersion) => {
          entryChecks.push(openCodeVersion);
          return hasEntry;
        },
        async (args, timeoutMs) => {
          calls.push({ args, timeoutMs });
          if (args.join(' ') === 'opencode --version') return version;
          return args[2] === 'plugin.list' ? 'plugin inventory' : null;
        },
        '/work/project',
      );
      expect(entryChecks).toEqual(version.startsWith('2.') ? [version] : []);
      expect(calls.filter((call) => call.args[0] === 'opencode' && call.args[1] === 'api')).toEqual(
        apiCalls,
      );
      expect(info.openCodePluginListOutput).toBe(output);
    },
  );

  test('reports the build-time package version', () => {
    expect(getPackageVersion()).toBe('dev');
  });
});
