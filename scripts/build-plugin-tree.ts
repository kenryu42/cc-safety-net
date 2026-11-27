import { cpSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import type { BunPlugin } from 'bun';
import pkg from '../package.json';
import { BIN_COMPILE_CACHE_LOADER } from './build-runtime';

const REPOSITORY_ROOT = join(import.meta.dir, '..');
const SOURCE_ROOT = join(REPOSITORY_ROOT, 'src');
const SOURCE_SPECIFIER = /^(\.|@\/)/;
const CLI_SPECIFIER = '@/cli/main';
const VIRTUAL_BUNDLE_ENTRY_DIR = 'bin/';
const COPIED_PATHS = [
  'kimi.plugin.json',
  'LICENSE',
  'assets/logo.png',
  'hooks/hooks.json',
  'hooks/codex.json',
  'hooks/cursor.json',
  'skills/cc-safety-net',
];
const LOGO_SVG_SOURCE = 'src/gui/frontend/favicon.svg';
const TREE_LOGO_SVG = 'assets/logo.svg';
const TREE_LOGO_PNG = './assets/logo.png';
const RELEASE_RAW_URL = `https://raw.githubusercontent.com/kenryu42/cc-safety-net/v${pkg.version}/`;
const RELEASE_BLOB_URL = `https://github.com/kenryu42/cc-safety-net/blob/v${pkg.version}/`;
const HOOK_BUNDLE_GROUPS = [
  ['gate/analyzer/analyze-command', 'analyzer-core'],
  ['gate/analyzer/segment', 'analyzer-core'],
  ['gate/analyzer/parallel', 'analyzer-core'],
  ['gate/analyzer/shell-execution', 'analyzer-core'],
  ['gate/analyzer/git/', 'analyzer-core'],
  ['gate/analyzer/', 'analyzer'],
  ['gate/', 'gate'],
  ['core/shell/', 'core-shell'],
  ['core/rules/', 'core-shell'],
  ['core/io/', 'core-shell'],
  ['core/', 'core'],
] as const;
const MAX_FILE_BYTES = 256 * 1024;
const MAX_FILES = 512;
const MAX_READABLE_LINE_LENGTH = 4096;
const LOCKFILES = ['bun.lock', 'bun.lockb', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];

const readSource = (path: string) => readFileSync(path, 'utf8').replace(/^#!.*/, '');

const readManifest = (path: string) =>
  JSON.parse(readFileSync(join(REPOSITORY_ROOT, path), 'utf8'));

const writeJson = (path: string, value: unknown) =>
  Bun.write(path, `${JSON.stringify(value, null, 2)}\n`);

const resolveSourceModule = (specifier: string, importer: string) =>
  resolve(Bun.resolveSync(specifier.replace(/^@\//, `${SOURCE_ROOT}/`), dirname(importer)));

const hookBundleOf = (path: string) => {
  const sourcePath = relative(SOURCE_ROOT, path).replaceAll('\\', '/');
  return sourcePath.startsWith(VIRTUAL_BUNDLE_ENTRY_DIR)
    ? basename(sourcePath, '.ts')
    : (HOOK_BUNDLE_GROUPS.find(([prefix]) => sourcePath.startsWith(prefix))?.[1] ?? 'hook');
};

/** @internal */
export function collectHookModules(entry: string) {
  const transpiler = new Bun.Transpiler({ loader: 'ts' });
  const modules = new Set<string>();
  const pending = [entry];
  while (pending.length > 0) {
    const path = pending.pop();
    if (path === undefined || modules.has(path)) continue;
    modules.add(path);
    pending.push(
      ...transpiler
        .scanImports(readSource(path))
        .filter((entry) => SOURCE_SPECIFIER.test(entry.path) && entry.path !== CLI_SPECIFIER)
        .map((entry) => resolveSourceModule(entry.path, path)),
    );
  }
  return [...modules];
}

const crossBundleImportsPlugin: BunPlugin = {
  name: 'cross-bundle-imports',
  setup(build) {
    build.onResolve({ filter: /^@\/cli\/main$/ }, () => ({ path: '../cli.js', external: true }));
    build.onResolve({ filter: SOURCE_SPECIFIER }, (args) => {
      const target = resolveSourceModule(args.path, args.importer);
      const bundle = hookBundleOf(target);
      return bundle === hookBundleOf(args.importer)
        ? { path: target }
        : { path: `./${bundle}.js`, external: true };
    });
  },
};

async function buildHookBundles(outdir: string) {
  const bundles = Map.groupBy(
    collectHookModules(join(SOURCE_ROOT, 'entries', 'bin.ts')),
    hookBundleOf,
  );
  const entries = Object.fromEntries(
    [...bundles].map(([bundle, paths]) => [
      join(SOURCE_ROOT, VIRTUAL_BUNDLE_ENTRY_DIR, `${bundle}.ts`),
      paths.map((path) => `export * from ${JSON.stringify(path)};`).join('\n'),
    ]),
  );
  const result = await Bun.build({
    entrypoints: Object.keys(entries),
    files: entries,
    outdir,
    naming: '[name].[ext]',
    target: 'node',
    format: 'cjs',
    minify: false,
    metafile: true,
    define: { __PKG_VERSION__: JSON.stringify(pkg.version) },
    plugins: [crossBundleImportsPlugin],
  });
  const outputExports = new Map(
    Object.entries(result.metafile?.outputs ?? {}).map(([path, output]) => [
      basename(path.replaceAll('\\', '/')),
      output.exports,
    ]),
  );
  const transpiler = new Bun.Transpiler({ loader: 'ts' });
  const droppedExports = [...bundles].flatMap(([bundle, paths]) =>
    paths
      .flatMap((path) => transpiler.scan(readSource(path)).exports)
      .filter((name) => !outputExports.get(`${bundle}.js`)?.includes(name))
      .map((name) => `${bundle}.js: ${name}`),
  );
  if (droppedExports.length > 0) {
    throw new Error(`Ambiguous hook bundle exports: ${droppedExports.join(', ')}`);
  }
}

export async function buildPluginTree(outdir: string) {
  const binDir = join(outdir, 'dist', 'bin');
  mkdirSync(binDir, { recursive: true });
  await buildHookBundles(binDir);
  COPIED_PATHS.forEach((path) =>
    cpSync(join(REPOSITORY_ROOT, path), join(outdir, path), { recursive: true }),
  );
  cpSync(join(REPOSITORY_ROOT, LOGO_SVG_SOURCE), join(outdir, TREE_LOGO_SVG));
  const codexPlugin = readManifest('.codex-plugin/plugin.json');
  const cursorPlugin = readManifest('.cursor-plugin/plugin.json');
  await Promise.all([
    Bun.write(join(binDir, 'cc-safety-net.js'), BIN_COMPILE_CACHE_LOADER),
    Bun.write(
      join(outdir, 'README.md'),
      readFileSync(join(REPOSITORY_ROOT, 'README.md'), 'utf8')
        .replace(/((?:src|srcset)=")\.\//g, `$1${RELEASE_RAW_URL}`)
        .replace(/\]\((?!https:|#)(?:\.\/)?/g, `](${RELEASE_BLOB_URL}`),
    ),
    Bun.write(join(binDir, 'package.json'), `${JSON.stringify({ type: 'commonjs' })}\n`),
    writeJson(join(outdir, '.claude-plugin', 'plugin.json'), {
      ...readManifest('.claude-plugin/plugin.json'),
      icon: TREE_LOGO_PNG,
    }),
    writeJson(join(outdir, '.codex-plugin', 'plugin.json'), {
      ...codexPlugin,
      interface: { ...codexPlugin.interface, logo: TREE_LOGO_PNG, composerIcon: TREE_LOGO_PNG },
    }),
    writeJson(join(outdir, '.cursor-plugin', 'plugin.json'), {
      ...cursorPlugin,
      logo: TREE_LOGO_SVG,
    }),
    writeJson(join(outdir, '.cursor-plugin', 'marketplace.json'), {
      name: cursorPlugin.name,
      owner: cursorPlugin.author,
      plugins: [{ name: cursorPlugin.name, source: './', description: cursorPlugin.description }],
    }),
    writeJson(join(outdir, '.antigravity-plugin', 'plugin.json'), {
      name: cursorPlugin.name,
      version: pkg.version,
      description: cursorPlugin.description,
      logo: TREE_LOGO_SVG,
    }),
    writeJson(join(outdir, 'hooks.json'), {
      [cursorPlugin.name]: {
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
    }),
  ]);
}

export function verifyPluginTree(tree: string) {
  const files = [...new Bun.Glob('**/*').scanSync({ cwd: tree, onlyFiles: true, dot: true })]
    .map((path) => path.replaceAll('\\', '/'))
    .sort();
  return [
    ...files
      .map((path) => [path, statSync(join(tree, path)).size] as const)
      .filter(([, size]) => size >= MAX_FILE_BYTES)
      .map(([path, size]) => `${path} is ${size} bytes; the limit is under ${MAX_FILE_BYTES}`),
    ...(files.length > MAX_FILES
      ? [`the tree has ${files.length} files; the limit is ${MAX_FILES}`]
      : []),
    ...(files.includes('package.json')
      ? LOCKFILES.filter((lockfile) => files.includes(lockfile)).map(
          (lockfile) => `package.json sits beside ${lockfile} at the tree root`,
        )
      : []),
    ...files
      .filter((path) => path.endsWith('.js'))
      .map(
        (path) =>
          [
            path,
            Math.max(
              ...readFileSync(join(tree, path), 'utf8')
                .split('\n')
                .map((line) => line.length),
            ),
          ] as const,
      )
      .filter(([, length]) => length > MAX_READABLE_LINE_LENGTH)
      .map(
        ([path, length]) =>
          `${path} has a ${length}-character line; minified output is not readable (limit ${MAX_READABLE_LINE_LENGTH})`,
      ),
  ];
}

if (import.meta.main) {
  const outdir = process.argv[2];
  if (outdir === undefined) {
    console.error('Usage: bun run build:plugin <outdir>');
    process.exit(1);
  }
  await buildPluginTree(outdir);
  const problems = verifyPluginTree(outdir);
  if (problems.length > 0) {
    console.error(`Plugin tree breaks the plugin directory limits:\n${problems.join('\n')}`);
    process.exit(1);
  }
  console.log(`Built plugin tree at ${outdir}`);
}
