import {
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, sep } from 'node:path';

export type TreeSpec = Record<string, string | null | { symlink: string }>;

export function writeTree(root: string, spec: TreeSpec): void {
  const entries = Object.entries(spec).sort(
    ([, a], [, b]) => Number(isLink(a)) - Number(isLink(b)),
  );
  for (const [path, entry] of entries) {
    const full = join(root, path);
    mkdirSync(dirname(full), { recursive: true });
    if (entry === null) {
      mkdirSync(full, { recursive: true });
      continue;
    }
    if (typeof entry === 'string') {
      writeFileSync(full, entry);
      continue;
    }
    symlinkSync(entry.symlink, full);
  }
}

const isLink = (entry: TreeSpec[string]) => entry !== null && typeof entry === 'object';

export type TreeEntry = {
  path: string;
  kind: 'file' | 'directory' | 'symlink' | 'other';
  content?: string;
  target?: string;
};

export function snapshotTree(root: string, prefix = ''): TreeEntry[] {
  return readdirSync(join(root, prefix))
    .sort()
    .flatMap((name): TreeEntry[] => {
      const path = prefix === '' ? name : `${prefix}/${name}`;
      const stat = lstatSync(join(root, path));
      if (stat.isSymbolicLink()) {
        return [
          { path, kind: 'symlink', target: readlinkSync(join(root, path)).split(sep).join('/') },
        ];
      }
      if (stat.isDirectory()) {
        return [{ path, kind: 'directory' }, ...snapshotTree(root, path)];
      }
      if (stat.isFile()) {
        return [{ path, kind: 'file', content: readFileSync(join(root, path), 'utf-8') }];
      }
      return [{ path, kind: 'other' }];
    });
}

export type Outcome<T> =
  | { ok: true; value: T }
  | { ok: false; error: { name: string; message: string } };

export function describeOutcome<T>(run: () => T): Outcome<T> {
  try {
    return { ok: true, value: run() };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? { name: error.name, message: error.message }
          : { name: 'unknown', message: String(error) },
    };
  }
}
