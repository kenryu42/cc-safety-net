/** Render untrusted text without emitting terminal control bytes. */
export function renderTerminalText(value: string): string {
  return Array.from(value, (character) => {
    const code = character.charCodeAt(0);
    if (code <= 0x1f || (code >= 0x7f && code <= 0x9f)) {
      return `\\x${code.toString(16).padStart(2, '0')}`;
    }
    return character;
  }).join('');
}
