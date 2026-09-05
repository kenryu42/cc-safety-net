import { guiDocument } from './assets';

const dataTag = '<script id="ccsn-data" type="application/json">';

export function renderPolicyGuiHtml(token: string): string {
  // The session token is the page's one request-time value; it goes into the
  // empty data tag the page script reads. Escaping `<` keeps the payload from
  // closing the tag whatever the token holds; JSON.parse reads it back as `<`.
  return guiDocument.replace(
    dataTag,
    () => dataTag + JSON.stringify({ token }).replaceAll('<', '\\u003c'),
  );
}
