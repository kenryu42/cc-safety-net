export function normalizeCommandToken(token: string): string {
  return getBasename(token).toLowerCase();
}

export function getBasename(token: string): string {
  return token.includes('/') ? (token.split('/').pop() ?? token) : token;
}
