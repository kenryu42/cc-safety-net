import { join } from 'node:path';

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
