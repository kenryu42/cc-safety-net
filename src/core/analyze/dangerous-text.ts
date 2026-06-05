export function dangerousInText(text: string): string | null {
  const t = text.toLowerCase();
  const stripped = t.trimStart();
  const isEchoOrRg = stripped.startsWith('echo ') || stripped.startsWith('rg ');

  const patterns: Array<{
    regex: RegExp;
    reason: string;
    skipForEchoRg?: boolean;
    caseSensitive?: boolean;
  }> = [
    {
      regex:
        /(^|[^\w])\\?r\\?m\s+(-[^\s]*r[^\s]*\s+-[^\s]*f|-[^\s]*f[^\s]*\s+-[^\s]*r|-[^\s]*rf|-[^\s]*fr|(?=[^\n;&|]*--recursive\b)(?=[^\n;&|]*--force\b)[^\n;&|]*)\b/,
      reason: 'rm -rf',
    },
    {
      regex: /\bgit\s+reset\s+--ha(?:r(?:d)?)?\b/,
      reason: 'git reset --hard',
    },
    {
      regex: /\bgit\s+reset\s+--me(?:r(?:g(?:e)?)?)?\b/,
      reason: 'git reset --merge',
    },
    {
      regex: /\bgit\s+clean\s+(-[^\s]*f[^\s]*|--fo(?:r(?:c(?:e)?)?)?)\b/,
      reason: 'git clean -f',
    },
    {
      regex: /\bgit\s+checkout\s+[^|;]*(--fo(?:r(?:c(?:e)?)?)?\b|-(?![bBU])[^\s]*f[^\s]*\b)/,
      reason: 'git checkout --force',
    },
    {
      regex: /\bgit\s+push\s+[^|;]*(-f\b|--fo(?:r(?:c(?:e)?)?)?\b)(?!-with-lease)/,
      reason: 'git push --force (use --force-with-lease instead)',
    },
    {
      regex:
        /\bgit\s+branch\b(?=[^\n;|&]*(?:-D\b|-[A-Za-z]*D[A-Za-z]*\b|--de(?:l(?:e(?:t(?:e)?)?)?)?\b|-[A-Za-z]*d[A-Za-z]*\b))(?=[^\n;|&]*(?:-D\b|-[A-Za-z]*D[A-Za-z]*\b|--fo(?:r(?:c(?:e)?)?)?\b|-[A-Za-z]*f[A-Za-z]*\b))/,
      reason: 'git branch -D',
      caseSensitive: true,
    },
    {
      regex: /\bgit\s+tag\s+[^|;]*(-[^\s]*d[^\s]*|--de(?:l(?:e(?:t(?:e)?)?)?)?)\b/,
      reason: 'git tag -d',
    },
    {
      regex: /\bgit\s+stash\s+(drop|clear)\b/,
      reason: 'git stash drop/clear',
    },
    {
      regex: /\bgit\s+checkout\s+--\s/,
      reason: 'git checkout --',
    },
    {
      regex: /\bgit\s+restore\b(?!.*--(staged|help))/,
      reason: 'git restore (without --staged)',
    },
    {
      regex: /\bfind\b[^\n;|&]*\s-delete\b/,
      reason: 'find -delete',
      skipForEchoRg: true,
    },
  ];

  for (const { regex, reason, skipForEchoRg, caseSensitive } of patterns) {
    if (skipForEchoRg && isEchoOrRg) continue;
    const target = caseSensitive ? text : t;
    if (regex.test(target)) {
      return reason;
    }
  }
  return null;
}
