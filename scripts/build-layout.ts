/**
 * The two source trees the build scripts can bundle. `shipped` is today's `src/` into the
 * committed `dist/`; `ported` is the greenfield `next/entries` roots into the gitignored
 * `dist-next/`. Every field below is something the two trees genuinely differ on; anything
 * derivable from another field stays out.
 */
export const SHIPPED_LAYOUT = {
  outdir: 'dist',
  alias: { filter: /^@\//, root: 'src' },
  entrypoints: {
    runtime: [
      'src/index.ts',
      'src/api.ts',
      'src/cli/cc-safety-net.ts',
      'src/integrations/pi/index.ts',
    ],
    amp: 'src/integrations/amp/index.ts',
    openclaw: 'src/integrations/openclaw/index.ts',
  },
  // Bun names a split entry `[dir]/[name]` relative to the entries' common root and tsc emits
  // a declaration relative to `rootDir`, so both follow from where the entries live rather
  // than from the published layout; deriving them would re-implement the tools' naming rules.
  emitted: {
    bin: 'cli/cc-safety-net.js',
    pi: 'integrations/pi/index.js',
    declarations: ['index.d.ts', 'api.d.ts'],
  },
  // The shipped build keeps spawning the package script verbatim, down to its stderr echo,
  // and package.json gains no `build:types:next`, so the ported tsconfig is named here.
  typesCommand: ['bun', 'run', 'build:types'],
  // The shipped schema requires zod through `createRequire`, so the split bundles ship a
  // vendored copy for it and the single-file plugins inline it; the ported schema imports
  // zod statically and needs neither.
  lazyZod: true,
  // Headers, plugin ids and manifests are read from the tree the layout bundles.
  loadArtifacts: async () => ({
    amp: await import('../src/integrations/amp/artifact'),
    openclaw: await import('../src/integrations/openclaw/artifact'),
  }),
  loadGuiAssets: () => import('../src/gui/assets'),
};

/** @internal */
export const PORTED_LAYOUT = {
  outdir: 'dist-next',
  alias: { filter: /^@next\//, root: 'next' },
  entrypoints: {
    runtime: [
      'next/entries/index.ts',
      'next/entries/api.ts',
      'next/entries/bin.ts',
      'next/entries/pi.ts',
    ],
    amp: 'next/entries/amp.ts',
    openclaw: 'next/entries/openclaw.ts',
  },
  emitted: {
    bin: 'bin.js',
    pi: 'pi.js',
    declarations: ['entries/index.d.ts', 'entries/api.d.ts'],
  },
  typesCommand: [
    'bunx',
    'tsc',
    '--project',
    'tsconfig.build-next.json',
    '--emitDeclarationOnly',
    '--declaration',
  ],
  lazyZod: false,
  loadArtifacts: async () => ({
    amp: await import('../next/hosts/amp/artifact'),
    openclaw: await import('../next/hosts/openclaw/artifact'),
  }),
  loadGuiAssets: () => import('../next/gui/assets'),
};

export type Layout = typeof SHIPPED_LAYOUT | typeof PORTED_LAYOUT;

export function resolveLayout(argv: readonly string[]): Layout {
  const index = argv.indexOf('--layout');
  if (index === -1) return SHIPPED_LAYOUT;
  const value = argv[index + 1];
  if (value === 'shipped') return SHIPPED_LAYOUT;
  if (value === 'ported') return PORTED_LAYOUT;
  throw new Error(`--layout must be shipped or ported, got ${value}`);
}
