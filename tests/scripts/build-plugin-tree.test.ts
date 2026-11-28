import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import {
  buildPluginTree,
  collectHookModules,
  verifyPluginTree,
} from '../../scripts/build-plugin-tree';
import pkg from '../../package.json';
import { loadHarvestedVerdicts } from '../helpers/harvested-verdicts';
import { createTempRoot, isolatedSpawnEnv, removeTempRoots } from '../helpers/temp-home';

const SOURCE_BIN = join(import.meta.dir, '..', '..', 'src', 'entries', 'bin.ts');
const ONE_LITERAL_PER_DENYING_RULE = [
  ...Map.groupBy(
    loadHarvestedVerdicts().filter((row) => row['work/standard']?.startsWith('deny ')),
    (row) => row['work/standard']?.split(' ')[1],
  ).values(),
].map((rows) => rows[0]?.literal ?? '');

const VERBATIM_MANIFESTS = [
  'kimi.plugin.json',
  'hooks/hooks.json',
  'hooks/codex.json',
  'hooks/cursor.json',
];

const readJson = (path: string) => JSON.parse(readFileSync(path, 'utf8'));

const claudeShapedPayload = (command: string, cwd: string) => ({
  hook_event_name: 'PreToolUse',
  session_id: 'plugin-tree',
  cwd,
  tool_name: 'Bash',
  tool_input: { command },
  tool_call_id: 'plugin-tree-tool-call',
});
const claudeShapedReason = (output: { hookSpecificOutput: Record<string, string> }) =>
  output.hookSpecificOutput.permissionDecision === 'deny'
    ? output.hookSpecificOutput.permissionDecisionReason
    : undefined;

const HOSTS = [
  ['--coding-cli', claudeShapedPayload, claudeShapedReason],
  ['--codex', claudeShapedPayload, claudeShapedReason],
  ['--kimi-code', claudeShapedPayload, claudeShapedReason],
  [
    '--cursor',
    (command: string, cwd: string) => ({
      conversation_id: 'plugin-tree',
      hook_event_name: 'preToolUse',
      cwd,
      workspace_roots: [cwd],
      tool_name: 'Shell',
      tool_input: { command },
    }),
    (output: { permission: string; user_message: string }) =>
      output.permission === 'deny' ? output.user_message : undefined,
  ],
] as const;

const listFiles = (directory: string) =>
  [...new Bun.Glob('**/*').scanSync({ cwd: directory, onlyFiles: true, dot: true })]
    .map((path) => path.replaceAll(sep, '/'))
    .sort();

function writeTree(files: Record<string, string>) {
  const tree = createTempRoot('cc-safety-net-plugin-tree-fixture-');
  Object.entries(files).forEach(([path, content]) => {
    mkdirSync(dirname(join(tree, path)), { recursive: true });
    writeFileSync(join(tree, path), content);
  });
  return tree;
}

afterAll(removeTempRoots);

describe('the plugin tree', () => {
  const tree = join(createTempRoot('cc-safety-net-plugin-tree-'), 'tree');

  beforeAll(async () => {
    await buildPluginTree(tree);
  }, 60_000);

  test('holds exactly the plugin manifests, the skill, the logo and the readable hook build', () => {
    expect(listFiles(tree)).toEqual([
      '.antigravity-plugin/plugin.json',
      '.claude-plugin/plugin.json',
      '.codex-plugin/plugin.json',
      '.cursor-plugin/marketplace.json',
      '.cursor-plugin/plugin.json',
      'LICENSE',
      'README.md',
      'assets/logo.png',
      'assets/logo.svg',
      'dist/bin/analyzer-core.js',
      'dist/bin/analyzer.js',
      'dist/bin/cc-safety-net.js',
      'dist/bin/core-shell.js',
      'dist/bin/core.js',
      'dist/bin/gate.js',
      'dist/bin/hook.js',
      'dist/bin/package.json',
      'hooks.json',
      'hooks/codex.json',
      'hooks/cursor.json',
      'hooks/hooks.json',
      'kimi.plugin.json',
      'skills/cc-safety-net/SKILL.md',
      'skills/cc-safety-net/agents/openai.yaml',
    ]);
  });

  test('copies the hook configs and the Kimi manifest verbatim', () => {
    VERBATIM_MANIFESTS.forEach((path) =>
      expect(readFileSync(join(tree, path), 'utf8')).toBe(readFileSync(path, 'utf8')),
    );
  });

  test('copies the Claude, Codex and Cursor manifests with only their logos moved to assets/', () => {
    const codex = readJson('.codex-plugin/plugin.json');
    expect(readJson(join(tree, '.claude-plugin/plugin.json'))).toEqual({
      ...readJson('.claude-plugin/plugin.json'),
      icon: './assets/logo.png',
    });
    expect(readJson(join(tree, '.codex-plugin/plugin.json'))).toEqual({
      ...codex,
      interface: {
        ...codex.interface,
        logo: './assets/logo.png',
        composerIcon: './assets/logo.png',
      },
    });
    expect(readJson(join(tree, '.cursor-plugin/plugin.json'))).toEqual({
      ...readJson('.cursor-plugin/plugin.json'),
      logo: 'assets/logo.svg',
    });
  });

  test('carries an Antigravity manifest and a root agy hooks.json for agy plugin install', () => {
    expect(readJson(join(tree, '.antigravity-plugin/plugin.json'))).toEqual({
      name: 'cc-safety-net',
      version: pkg.version,
      description: 'Block destructive commands and secret access',
      logo: 'assets/logo.svg',
    });
    expect(readJson(join(tree, 'hooks.json'))).toEqual({
      'cc-safety-net': {
        PreToolUse: [
          {
            matcher: '*',
            hooks: [
              {
                type: 'command',
                command: 'node ./dist/bin/cc-safety-net.js hook --agy-cli',
                timeout: 30,
              },
            ],
          },
        ],
      },
    });
  });

  test('the agy hook command, run from the tree, blocks git reset --hard', () => {
    const home = createTempRoot('cc-safety-net-plugin-tree-home-');
    const command: string = readJson(join(tree, 'hooks.json'))['cc-safety-net'].PreToolUse[0]
      .hooks[0].command;
    const proc = Bun.spawnSync(command.split(' '), {
      cwd: tree,
      stdin: Buffer.from(
        JSON.stringify({
          toolCall: {
            id: 'plugin-tree-tool-call',
            name: 'run_command',
            args: { CommandLine: 'git reset --hard', Cwd: home },
          },
          conversationId: 'plugin-tree',
          workspacePaths: [home],
          hookEventName: 'PreToolUse',
          cwd: home,
        }),
      ),
      stdout: 'pipe',
      stderr: 'pipe',
      env: isolatedSpawnEnv(home),
    });

    expect(proc.stderr.toString()).toBe('');
    expect(proc.exitCode).toBe(0);
    expect(JSON.parse(proc.stdout.toString())).toMatchObject({
      decision: 'deny',
      reason: expect.stringContaining('git.reset-hard'),
    });
  });

  test('ships the repository README with its repository links pinned to the release tag', () => {
    const readme = readFileSync(join(tree, 'README.md'), 'utf8');
    const repositoryLinks = [
      ...readme.matchAll(/(?:src|srcset)="(?!https:)([^"]+)"|\]\((?!https:|#)([^)]+)\)/g),
    ].map((match) => match[1] ?? match[2]);

    expect(readme).toContain('CC Safety Net (Coding CLI Safety Net) blocks destructive commands');
    expect(repositoryLinks).toEqual([]);
    expect(readme).toContain(
      `src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v${pkg.version}/.github/assets/how-it-works-light.svg"`,
    );
    expect(readme).toContain(
      `(https://github.com/kenryu42/cc-safety-net/blob/v${pkg.version}/CONTRIBUTING.md)`,
    );
  });

  test('ships each path the manifests reference', () => {
    const claude = readJson(join(tree, '.claude-plugin/plugin.json'));
    const codex = readJson(join(tree, '.codex-plugin/plugin.json'));
    const cursor = readJson(join(tree, '.cursor-plugin/plugin.json'));
    const kimi = readJson(join(tree, 'kimi.plugin.json'));
    const antigravity = readJson(join(tree, '.antigravity-plugin/plugin.json'));
    const files = listFiles(tree);
    const relativeToTree = (path: string) => path.replace(/^\.\//, '');
    [claude.icon, codex.interface.logo, codex.interface.composerIcon, cursor.logo, antigravity.logo]
      .map(relativeToTree)
      .forEach((path) => expect(files).toContain(path));
    [codex.skills, codex.hooks, cursor.hooks, kimi.skills]
      .map(relativeToTree)
      .forEach((path) => expect(files.some((file) => file.startsWith(path))).toBeTrue());
  });

  test('lists itself as the only plugin of a Cursor marketplace at the tree root', () => {
    expect(JSON.parse(readFileSync(join(tree, '.cursor-plugin/marketplace.json'), 'utf8'))).toEqual(
      {
        name: 'cc-safety-net',
        owner: { name: 'J Liew', email: 'jliew@420024lab.com' },
        plugins: [
          {
            name: 'cc-safety-net',
            source: './',
            description: 'Block destructive commands and secret access',
          },
        ],
      },
    );
  });

  test('stays within the plugin directory limits', () => {
    expect(verifyPluginTree(tree)).toEqual([]);
  });

  test.each(HOSTS)('the hook %s blocks git reset --hard from the tree', (flag, payload, reason) => {
    const home = createTempRoot('cc-safety-net-plugin-tree-home-');
    const proc = Bun.spawnSync(
      ['node', join(tree, 'dist', 'bin', 'cc-safety-net.js'), 'hook', flag],
      {
        cwd: home,
        stdin: Buffer.from(JSON.stringify(payload('git reset --hard', home))),
        stdout: 'pipe',
        stderr: 'pipe',
        env: isolatedSpawnEnv(home),
      },
    );

    expect(proc.stderr.toString()).toBe('');
    expect(proc.exitCode).toBe(0);
    expect(reason(JSON.parse(proc.stdout.toString()))).toContain('git.reset-hard');
  });

  test('decides one command per denying rule exactly as the source does', async () => {
    const home = createTempRoot('cc-safety-net-plugin-tree-home-');
    const work = join(home, 'work');
    mkdirSync(work);
    const decide = (entry: string[]) =>
      Promise.all(
        ONE_LITERAL_PER_DENYING_RULE.map(async (literal) => {
          const proc = Bun.spawn([...entry, 'hook', '--coding-cli'], {
            cwd: work,
            stdin: Buffer.from(JSON.stringify(claudeShapedPayload(literal, work))),
            stdout: 'pipe',
            stderr: 'pipe',
            env: isolatedSpawnEnv(home),
          });
          return {
            literal,
            exitCode: await proc.exited,
            stdout: await new Response(proc.stdout).text(),
          };
        }),
      );

    const [fromTree, fromSource] = await Promise.all([
      decide(['node', join(tree, 'dist', 'bin', 'cc-safety-net.js')]),
      decide([process.execPath, SOURCE_BIN]),
    ]);

    expect(fromTree).toEqual(fromSource);
  }, 60_000);
});

describe('the hook module walk', () => {
  test('lists every module once, under one spelling of its path', () => {
    const modules = collectHookModules(SOURCE_BIN);
    expect(modules).toEqual([...new Set(modules.map((path) => resolve(path)))]);
  });
});

describe('the plugin tree verifier', () => {
  const kibLines = (count: number) => `${'x'.repeat(1023)}\n`.repeat(count);

  test.each([
    ['a file just under 256 KiB', { 'dist/bin/hook.js': kibLines(256).slice(1) }, []],
    [
      'a file of 256 KiB',
      { 'dist/bin/hook.js': kibLines(256) },
      ['dist/bin/hook.js is 262144 bytes; the limit is under 262144'],
    ],
    [
      '513 files',
      Object.fromEntries(Array.from({ length: 513 }, (_, index) => [`f/${index}.md`, ''])),
      ['the tree has 513 files; the limit is 512'],
    ],
    ['512 files', Object.fromEntries(Array.from({ length: 512 }, (_, i) => [`f/${i}.md`, ''])), []],
    [
      'a package.json beside a lockfile at the root',
      { 'package.json': '{}', 'bun.lock': '{}' },
      ['package.json sits beside bun.lock at the tree root'],
    ],
    ['a package.json below the root', { 'dist/bin/package.json': '{}', 'bun.lock': '{}' }, []],
  ] as const)('judges %s', (_name, files, problems) => {
    expect(verifyPluginTree(writeTree(files))).toEqual([...problems]);
  });

  test('rejects minified hook output and accepts a long readable line', () => {
    const tree = writeTree({ 'dist/bin/gate.js': `const x = ${'1 + '.repeat(500)}1;\n` });
    expect(verifyPluginTree(tree)).toEqual([]);

    writeFileSync(
      join(tree, 'dist/bin/hook.js'),
      readFileSync('dist/bin/hook.js', 'utf8').slice(0, 128 * 1024),
    );
    expect(verifyPluginTree(tree)).toEqual([
      expect.stringMatching(/^dist\/bin\/hook\.js has a \d+-character line; minified output/),
    ]);
  });
});
