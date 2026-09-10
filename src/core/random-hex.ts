/**
 * Sixteen lowercase hex digits from `Math.random`, for names that only have to be unique: an
 * audit entry id and a policy temp-file suffix. Neither needs unpredictability, and both are
 * produced on the hook path — the audit id on every call — so `node:crypto` would be loaded on
 * every hook start for no security benefit; it stays off the hook's import closure instead.
 */
export function randomHex16(): string {
  const half = () =>
    Math.floor(Math.random() * 0x1_0000_0000)
      .toString(16)
      .padStart(8, '0');
  return `${half()}${half()}`;
}
