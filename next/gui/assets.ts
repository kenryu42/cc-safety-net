import { join } from 'node:path';

// The GUI's served document. frontend/page.html is a real HTML document that
// links its icon, stylesheet and script; this module resolves those references
// into one self-contained page, so nothing is spliced through placeholder
// tokens. main.ts is TypeScript, so it is built for the browser here.
//
// scripts/gui-assets.ts freezes this export into the dist bundle, so the
// published CLI reads no files and runs no build to serve the page.
const frontendDir = join(import.meta.dir, 'frontend');
const readAsset = (name: string) => Bun.file(join(frontendDir, name)).text();
const buildPageScript = async () => {
  const result = await Bun.build({
    entrypoints: [join(frontendDir, 'main.ts')],
    target: 'browser',
    minify: false,
    sourcemap: 'none',
  });
  const output = result.outputs[0];
  if (!output) throw new Error(`GUI page script build failed:\n${result.logs.join('\n')}`);
  // Bun labels each bundled module with its path relative to the working
  // directory. `bun run` pins that to the package root, so the comments the
  // served page carries are repository paths, not this machine's layout.
  return output.text();
};

const [pageHtml, faviconSvg, customCss, logoSvg, pageScriptJs] = await Promise.all([
  readAsset('page.html'),
  readAsset('favicon.svg'),
  readAsset('custom.css'),
  readAsset('logo.svg'),
  buildPageScript(),
]);

export const guiDocument = new HTMLRewriter()
  .on('link[rel="icon"]', {
    element(link) {
      link.setAttribute('href', `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`);
    },
  })
  .on('link[rel="stylesheet"]', {
    element(link) {
      link.replace(`<style>\n${customCss}\n  </style>`, { html: true });
    },
  })
  // The logo is inline SVG so it can take its colour from the surrounding text.
  .on('a.brand-home', {
    element(anchor) {
      anchor.setInnerContent(logoSvg, { html: true });
    },
  })
  .on('script[src]', {
    element(script) {
      script.replace(`<script>\n${pageScriptJs}\n  </script>`, { html: true });
    },
  })
  .transform(pageHtml);
