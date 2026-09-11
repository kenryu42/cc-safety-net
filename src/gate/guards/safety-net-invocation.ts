const CC_SAFETY_NET_ENTRYPOINTS = new Set([
  'src/entries/bin.ts',
  'src/cli/cc-safety-net.ts',
  'dist/bin/cc-safety-net.js',

  'dist/bin/hook.js',
]);

const CC_SAFETY_NET_BIN_NAMES = new Set(['cc-safety-net', 'ccsn']);
const PACKAGE_RUNNERS = new Set(['bunx', 'npx', 'pnpx']);
const DLX_RUNNERS = new Set(['pnpm', 'yarn']);
const EXEC_RUNNERS = new Set(['npm', 'pnpm', 'yarn']);
const SCRIPT_RUNTIMES = new Set(['bun', 'node']);

export function safetyNetSubcommandIndex(
  command: string,
  tokens: readonly string[],
  options: { broad?: boolean } = {},
): number | null {
  if (CC_SAFETY_NET_BIN_NAMES.has(command)) return 0;
  if (PACKAGE_RUNNERS.has(command)) {
    if (options.broad) return broadRunnerSubcommandIndex(tokens);

    const skip = tokens[0] === '-y' || tokens[0] === '--yes' ? 1 : 0;
    return isRunnerTarget(tokens[skip]) ? skip + 1 : null;
  }

  const start = options.broad ? tokens.findIndex((token) => !token.startsWith('-')) : 0;
  if (start !== -1 && EXEC_RUNNERS.has(command) && options.broad && tokens[start] === 'exec') {
    const index = broadRunnerSubcommandIndex(tokens.slice(start + 1));
    return index === null ? null : start + 1 + index;
  }

  if (DLX_RUNNERS.has(command)) {
    if (command === 'yarn' && !options.broad) return null;
    if (!options.broad) return tokens[0] === 'dlx' && isRunnerTarget(tokens[1]) ? 2 : null;
    if (start === -1 || tokens[start] !== 'dlx') return null;
    const index = broadRunnerSubcommandIndex(tokens.slice(start + 1));
    return index === null ? null : start + 1 + index;
  }
  if (SCRIPT_RUNTIMES.has(command)) {
    const at = options.broad && start !== -1 ? start : 0;
    if (isSafetyNetEntrypoint(tokens[at])) return at + 1;

    if (command === 'bun' && tokens[at] === 'run' && isSafetyNetEntrypoint(tokens[at + 1])) {
      return at + 2;
    }
  }
  return null;
}

function broadRunnerSubcommandIndex(tokens: readonly string[]): number | null {
  const first = tokens.findIndex((token) => isRunnerTarget(token));
  if (first === -1) return null;
  let index = first;
  while (index < tokens.length) {
    const token = tokens[index] ?? '';
    if (!token.startsWith('-') && !isRunnerTarget(token)) break;
    index++;
  }
  return index;
}

function isRunnerTarget(token: string | undefined): boolean {
  if (!token) return false;
  const at = token.indexOf('@');
  if (at === -1) return CC_SAFETY_NET_BIN_NAMES.has(token);
  if (at === 0) return false;
  const suffix = token.slice(at + 1);
  if (suffix === '' || suffix.includes('/') || suffix.includes(':')) return false;
  return CC_SAFETY_NET_BIN_NAMES.has(token.slice(0, at));
}

function isSafetyNetEntrypoint(value: string | undefined): boolean {
  const normalized = value?.replaceAll('\\', '/');
  return [...CC_SAFETY_NET_ENTRYPOINTS].some(
    (entrypoint) => normalized === entrypoint || normalized?.endsWith(`/${entrypoint}`),
  );
}
