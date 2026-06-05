export function normalizeCommandToken(token: string): string {
  return getBasename(token).toLowerCase();
}

export function getBasename(token: string): string {
  return (
    token
      .split(/[\\/]/)
      .pop()
      ?.replace(/\.exe$/i, '') ?? token
  );
}
