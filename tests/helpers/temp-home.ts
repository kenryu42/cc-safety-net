import { mkdirSync, mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';
import { encodeCwdForLogDirname } from '@/audit/writer';
import { createTestEnvironment, processPathResolver } from '@/core/environment';
import { createSpawnEnv } from '../helpers';
import { snapshotTree } from './fixture-tree';

const roots: string[] = [];

export function createTempRoot(prefix: string): string {
  const root = mkdtempSync(join(process.env.CC_SAFETY_NET_TEST_TMPDIR ?? tmpdir(), prefix));
  roots.push(root);
  return root;
}

export function removeTempRoots(): void {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
}

export const HOST_ENV_NAMES = [
  'HOME',
  'CC_SAFETY_NET_HOME',
  'CC_SAFETY_NET_AUDIT_HOME',
  'npm_config_cache',
  'TMPDIR',
  'KIMI_CODE_HOME',
  'GROK_HOME',
  'HERMES_HOME',
  'OPENCLAW_STATE_DIR',
  'OPENCLAW_CONFIG_PATH',
  'COPILOT_HOME',
  'GEMINI_CLI_HOME',
  'CODEX_HOME',
  'PI_CODING_AGENT_DIR',
  'AMP_SETTINGS_FILE',
  'CURSOR_DATA_DIR',
  'XDG_CONFIG_HOME',
  'XDG_CACHE_HOME',
  'LOCALAPPDATA',
];

export function isolationEnv(
  home: string,
  overrides: Record<string, string | undefined> = {},
): Record<string, string | undefined> {
  mkdirSync(join(home, 'tmp'), { recursive: true });
  const tmpdir = overrides.TMPDIR ?? join(home, 'tmp');
  return {
    ...Object.fromEntries(HOST_ENV_NAMES.map((name) => [name, undefined])),
    HOME: home,
    CC_SAFETY_NET_HOME: join(home, '.cc-safety-net'),
    CC_SAFETY_NET_AUDIT_HOME: join(home, '.cc-safety-net', 'audit'),
    npm_config_cache: join(home, '.npm'),
    TMPDIR: tmpdir,
    TEMP: tmpdir,
    TMP: tmpdir,
    BUN_RUNTIME_TRANSPILER_CACHE_PATH: '0',
    ...overrides,
  };
}

export function isolatedSpawnEnv(
  home: string,
  overrides: Record<string, string | undefined> = {},
): Record<string, string> {
  const values = isolationEnv(home, overrides);
  const blanked = new Set(Object.keys(values).filter((name) => values[name] === undefined));
  const inherited = createSpawnEnv(
    Object.fromEntries(
      Object.entries(values).filter((entry): entry is [string, string] => entry[1] !== undefined),
    ),
  );
  return Object.fromEntries(Object.entries(inherited).filter(([name]) => !blanked.has(name)));
}

export function withProcessEnv<T>(values: Record<string, string | undefined>, fn: () => T): T {
  const previous = Object.keys(values).map((name) => [name, process.env[name]] as const);
  const restore = () => {
    for (const [name, value] of previous) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  };
  for (const [name, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
  let deferred = false;
  try {
    const result = fn();
    if (result instanceof Promise) {
      deferred = true;
      return result.finally(restore) as T;
    }
    return result;
  } finally {
    if (!deferred) restore();
  }
}

export function environmentFor(home: string, values: Record<string, string | undefined>) {
  return createTestEnvironment({
    home,
    tmpdir: values.TMPDIR ?? join(home, 'tmp'),
    env: new Map(
      Object.entries(values).flatMap(([name, value]) =>
        value === undefined ? [] : [[name, value] as const],
      ),
    ),
    paths: processPathResolver,
  });
}

export function snapshotHome(home: string) {
  return normalize(snapshotTree(home), [[home, '<home>']]).sort((a, b) =>
    a.path.localeCompare(b.path),
  );
}

export type Fold = readonly [string | RegExp, string | ((...match: string[]) => string)];

export function normalize<T>(value: T, replacements: readonly Fold[]): T {
  if (typeof value === 'string') {
    const replaced: string = replacements.reduce<string>(
      (text, [from, to]) =>
        typeof to === 'string' ? text.replaceAll(from, to) : text.replaceAll(from, to),
      value,
    );
    return replaced.replace(/cc-safety-net-amp-[A-Za-z0-9]+/g, 'cc-safety-net-amp-<id>') as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalize(item, replacements)) as T;
  }
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalize(item, replacements)]),
    ) as T;
  }
  return value;
}

function foldWindowsSeparators(text: string): string {
  const json = /^\s*[[{]/.test(text);
  const separators = json
    ? /([A-Za-z]:\\\\[^\s"'`<>|;,]*)|(\\\\(?=[A-Za-z0-9_.~@<-]|"))|\\./g
    : /([A-Za-z]:\\[^\s"'`<>|;,]*)|(\\+(?=[A-Za-z0-9_.~@<-]|$))|\\./gm;
  return text.replace(
    separators,
    (match, drive: string | undefined, separator: string | undefined) =>
      drive ?? (separator === undefined ? match : '/'),
  );
}

export const WINDOWS_SEPARATOR_FOLDS: readonly Fold[] =
  sep === '/' ? [] : [[/^[\s\S]+$/g, foldWindowsSeparators]];

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const rootFolds = (root: string, marker = '<root>'): readonly Fold[] =>
  [...new Set([realpathSync.native(root), realpathSync(root), root])].flatMap(
    (spelling): readonly Fold[] => {
      if (sep !== '/')
        return [
          [new RegExp(spelling.split(sep).map(escapeRegExp).join('(?:\\\\{1,2}|/)'), 'gi'), marker],
        ];
      const escaped = JSON.stringify(spelling).slice(1, -1);
      return escaped === spelling
        ? [[spelling, marker]]
        : [
            [escaped, marker],
            [spelling, marker],
          ];
    },
  );

export const auditDirnameFolds = (path: string, marker: string) =>
  [
    [encodeCwdForLogDirname(realpathSync(path)), marker],
    [encodeCwdForLogDirname(path), marker],
  ] as const;

export function describeAsyncOutcome<T>(run: () => Promise<T>) {
  return run().then(
    (value) => ({ kind: 'returned' as const, value }),
    (error: unknown) => ({
      kind: 'threw' as const,
      message: error instanceof Error ? error.message : String(error),
    }),
  );
}
