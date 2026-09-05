import { renderPolicyGuiHtml as renderPortedPage } from '@next/gui/page';
import { renderPolicyGuiHtml as renderShippedPage } from '@/gui/page';
import { repairBundlerDirectoryCache } from './gui-bundle-repair';

await repairBundlerDirectoryCache();

/**
 * The served page is one string built at module load: `page.html` with the stylesheet, the icon,
 * the logo and the bundled browser script folded in. Both sides render the same document for the
 * same session token, so the comparison is textual — with the two differences the port forces
 * folded out.
 */
export function renderPages(token: string) {
  return { shipped: renderShippedPage(token), ported: renderPortedPage(token) };
}

// Bun labels every bundled module with its repository path and emits them in import order, so the
// ported script carries `next/` labels where the shipped one carries `src/`, and orders the three
// helper modules differently. The label lines are the split points: the head (the document down to
// the opening `<script>`), the three helper modules, and the page script itself.
const MODULE_LABEL = /^\/\/ (?:src|next)\/[^\n]*\.ts\n/m;

const withoutEmptyLines = (text: string) =>
  text
    .split('\n')
    .filter((line) => line.length > 0)
    .join('\n');

export function normalizePage(html: string, token: string) {
  const pieces = html.replaceAll(token, '<token>').split(MODULE_LABEL);
  return {
    head: pieces[0],
    modules: pieces.slice(1, -1).map(withoutEmptyLines).sort(),
    tail: withoutEmptyLines(pieces[pieces.length - 1] ?? ''),
  };
}

/** The page text from `start` up to the next `end`, so a block bounded by two markers inside one
 *  bundled module is byte-equal on both sides. */
export function sliceBlock(html: string, start: string, end: string): string {
  const from = html.indexOf(start);
  if (from < 0) throw new Error(`page block start not found: ${start}`);
  const to = html.indexOf(end, from);
  if (to < 0) throw new Error(`page block end not found: ${end}`);
  return html.slice(from, to).trimEnd();
}
