export function randomHex16(): string {
  const half = () =>
    Math.floor(Math.random() * 0x1_0000_0000)
      .toString(16)
      .padStart(8, '0');
  return `${half()}${half()}`;
}
