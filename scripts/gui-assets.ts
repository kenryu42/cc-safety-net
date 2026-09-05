import type { BunPlugin } from 'bun';
import type { Layout } from './build-layout';

/**
 * Freezes the layout's gui/assets.ts into the bundle: the module reads the frontend
 * files and builds frontend/main.ts with Bun, neither of which the published
 * Node CLI can do, so the built bundle gets the produced strings as literals.
 * The assets module is loaded here, while its own layout is being bundled, so
 * building one layout never builds or bundles the other layout's page.
 */
export async function guiAssetsPlugin(layout: Layout): Promise<BunPlugin> {
  const contents = Object.entries(await layout.loadGuiAssets())
    .map(([name, value]) => `export const ${name} = ${JSON.stringify(value)};`)
    .join('\n');
  return {
    name: 'gui-assets',
    setup(build) {
      // `args.path` is native, so the separator is a backslash on Windows.
      build.onLoad(
        { filter: new RegExp(`${layout.alias.root}[\\\\/]gui[\\\\/]assets\\.ts$`) },
        () => ({ contents, loader: 'js' }),
      );
    },
  };
}
