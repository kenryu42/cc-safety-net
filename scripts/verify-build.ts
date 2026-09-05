import { readdir, readFile, stat } from 'node:fs/promises';
import { isBuiltin } from 'node:module';
import { posix, relative, resolve } from 'node:path';
import pkg from '../package.json';
import { type Layout, SHIPPED_LAYOUT } from './build-layout';

function isBuildChunkArtifact(path: string, outdir: string): boolean {
  return new RegExp(`^${outdir}/chunks/[A-Za-z0-9_-]+\\.js$`).test(path);
}

/** @internal */
export function requiresRepositoryExecutableMode(platform: NodeJS.Platform): boolean {
  return platform !== 'win32';
}

// Every module specifier the source actually imports or requires at runtime.
// Only import (`from "x"`), dynamic import (`import("x")`), and require (`require("x")`)
// positions are matched, so the word "import" appearing inside a string literal is ignored.
/** @internal */
export function getRuntimeImportSpecifiers(source: string): string[] {
  return [
    ...source.matchAll(/(?:\bfrom\s*["']|\bimport\s*\(\s*["']|\brequire\w*\(\s*["'])([^"']+)["']/g),
  ]
    .map((match) => match[1])
    .filter((specifier): specifier is string => specifier !== undefined);
}

// A self-contained artifact may only import Node built-ins; any other specifier
// (zod, a repository `@/` alias, a shared `./chunks/` file, `@ampcode/plugin`) means
// a runtime dependency leaked into the bundle.
/** @internal */
export function unbundledRuntimeImports(source: string): string[] {
  return [
    ...new Set(getRuntimeImportSpecifiers(source).filter((specifier) => !isBuiltin(specifier))),
  ];
}

async function listFiles(directory: string): Promise<string[]> {
  return (
    await Promise.all(
      (
        await readdir(directory, { withFileTypes: true })
      ).map(async (entry) => {
        const path = resolve(directory, entry.name);
        if (entry.isDirectory()) return listFiles(path);
        return [relative(process.cwd(), path).replaceAll('\\', '/')];
      }),
    )
  )
    .flat()
    .sort();
}

function getSharedChunkImports(path: string, source: string, outdir: string): string[] {
  return [...source.matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((specifier): specifier is string => specifier !== undefined)
    .map((specifier) => posix.normalize(posix.join(posix.dirname(path), specifier)))
    .filter((specifier) => isBuildChunkArtifact(specifier, outdir));
}

export async function verifyBuildArtifacts(layout: Layout = SHIPPED_LAYOUT): Promise<string[]> {
  const artifacts = await layout.loadArtifacts();
  const ampArtifact = `${layout.outdir}/amp/${artifacts.amp.AMP_PLUGIN_ENTRY}`;
  const openClawPluginDir = `${layout.outdir}/openclaw/${artifacts.openclaw.OPENCLAW_PLUGIN_ID}`;
  const openClawArtifact = `${openClawPluginDir}/${artifacts.openclaw.OPENCLAW_PLUGIN_ENTRY_FILE}`;
  const buildEntryArtifacts = [
    ampArtifact,
    openClawArtifact,
    `${openClawPluginDir}/${artifacts.openclaw.OPENCLAW_PLUGIN_MANIFEST_FILE}`,
    `${openClawPluginDir}/package.json`,
    `${layout.outdir}/api.d.ts`,
    `${layout.outdir}/api.js`,
    `${layout.outdir}/bin/cc-safety-net.js`,
    `${layout.outdir}/index.d.ts`,
    `${layout.outdir}/index.js`,
    `${layout.outdir}/pi/index.js`,
    // Only the layout whose schema requires zod lazily ships a vendored copy for it.
    ...(layout.lazyZod ? [`${layout.outdir}/vendor/zod.cjs`] : []),
  ];
  const files = await listFiles(resolve(layout.outdir));
  const unexpected = files.filter(
    (path) => !buildEntryArtifacts.includes(path) && !isBuildChunkArtifact(path, layout.outdir),
  );
  const missingEntries = buildEntryArtifacts.filter((path) => !files.includes(path));
  const chunks = files.filter((path) => isBuildChunkArtifact(path, layout.outdir));
  if (unexpected.length > 0 || missingEntries.length > 0) {
    throw new Error(`Unexpected build artifacts:\n${files.join('\n')}`);
  }

  const reachableChunks = new Set<string>();
  const pending = buildEntryArtifacts.filter((path) => path.endsWith('.js'));
  const missingChunks = new Set<string>();
  while (pending.length > 0) {
    const path = pending.shift();
    if (!path) break;
    for (const chunk of getSharedChunkImports(path, await readFile(path, 'utf8'), layout.outdir)) {
      if (!files.includes(chunk)) {
        missingChunks.add(chunk);
        continue;
      }
      if (reachableChunks.has(chunk)) continue;
      reachableChunks.add(chunk);
      pending.push(chunk);
    }
  }
  if (missingChunks.size > 0) {
    throw new Error(
      `Build artifacts reference missing shared chunks:\n${[...missingChunks].join('\n')}`,
    );
  }
  if (chunks.length === 0) {
    throw new Error('Build artifacts contain no shared chunks');
  }
  const orphanedChunks = chunks.filter((path) => !reachableChunks.has(path));
  if (orphanedChunks.length > 0) {
    throw new Error(
      `Build artifacts contain orphaned shared chunks:\n${orphanedChunks.join('\n')}`,
    );
  }
  if (
    requiresRepositoryExecutableMode(process.platform) &&
    ((await stat(`${layout.outdir}/bin/cc-safety-net.js`)).mode & 0o777) !== 0o755
  ) {
    throw new Error(`${layout.outdir}/bin/cc-safety-net.js must have mode 0755`);
  }
  if (
    !(await readFile(`${layout.outdir}/bin/cc-safety-net.js`, 'utf8')).startsWith(
      '#!/usr/bin/env node\n',
    )
  ) {
    throw new Error(`${layout.outdir}/bin/cc-safety-net.js has the wrong shebang`);
  }
  verifyManagedArtifact(
    'Amp',
    artifacts.amp.AMP_MANAGED_HEADER,
    await readFile(ampArtifact, 'utf8'),
  );
  verifyManagedArtifact(
    'OpenClaw',
    artifacts.openclaw.OPENCLAW_MANAGED_HEADER,
    await readFile(openClawArtifact, 'utf8'),
  );
  return files;
}

/** @internal */
export function verifyManagedArtifact(label: string, header: string, source: string): void {
  if (!source.startsWith(header)) {
    throw new Error(`${label} artifact is missing the managed-file header`);
  }
  if (!source.includes(`// version: ${pkg.version}`)) {
    throw new Error(`${label} artifact is missing the package version ${pkg.version}`);
  }
  const unresolved = unbundledRuntimeImports(source);
  if (unresolved.length > 0) {
    throw new Error(`${label} artifact has unresolved runtime imports:\n${unresolved.join('\n')}`);
  }
}
