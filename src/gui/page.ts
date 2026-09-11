import { guiDocument } from './assets';

const dataTag = '<script id="ccsn-data" type="application/json">';

export function renderPolicyGuiHtml(token: string): string {
  return guiDocument.replace(
    dataTag,
    () => dataTag + JSON.stringify({ token }).replaceAll('<', '\\u003c'),
  );
}
