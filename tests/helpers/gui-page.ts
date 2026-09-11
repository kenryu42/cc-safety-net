import { renderPolicyGuiHtml as renderPortedPage } from '@/gui/page';

export function renderPages(token: string) {
  return { ported: renderPortedPage(token) };
}

const MODULE_LABEL = /^\/\/ (?:src|next)\/[^\n]*\.ts\n/m;

export function normalizePage(html: string, token: string) {
  const pieces = html.replaceAll(token, '<token>').split(MODULE_LABEL);
  return {
    head: pieces[0],
    modules: pieces.slice(1, -1).map(() => '[bundle]'),
    tail: (pieces[pieces.length - 1] ?? '').replace(/[\s\S]*\n(?= {2}<\/script>)/, '[bundle]\n'),
  };
}

export function sliceBlock(html: string, start: string, end: string): string {
  const from = html.indexOf(start);
  if (from < 0) throw new Error(`page block start not found: ${start}`);
  const to = html.indexOf(end, from);
  if (to < 0) throw new Error(`page block end not found: ${end}`);
  return html.slice(from, to).trimEnd();
}
