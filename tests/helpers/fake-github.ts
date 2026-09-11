import type { ServerResponse } from 'node:http';
import { startLoopbackServer } from './loopback-server';

export type ScriptedRepository = {
  owner: string;
  repo: string;
  defaultBranch: string;
  refs: Record<string, string>;
  trees: Record<string, Record<string, string>>;
};

export type Fault =
  | {
      kind: 'response';
      status?: number;
      headers?: Record<string, string>;
      body?: string | Buffer;
      chunkBoundaries?: number[];
      endless?: boolean;
    }
  | { kind: 'defer' };

export type FakeGitHub = {
  origin: string;
  resolveUrl(url: string): string;
  requests: string[];
  faults: Map<string, Fault>;
  release(): void;
  maxInFlight(): number;
  reset(): void;
  repositories: ScriptedRepository[];
  close(): Promise<void>;
};

const RULES_PATH = '.cc-safety-net/rules';
const API_REPOSITORY_RE = /^\/api\/repos\/([^/]+)\/([^/]+)$/;
const API_COMMIT_RE = /^\/api\/repos\/([^/]+)\/([^/]+)\/commits\/(.+)$/;
const API_TREE_RE = /^\/api\/repos\/([^/]+)\/([^/]+)\/git\/trees\/([^/]+)$/;
const RAW_RE = new RegExp(`^/raw/([^/]+)/([^/]+)/([^/]+)/${RULES_PATH}/([^/]+)/rulebook\\.json$`);
const MAX_WRITE_BYTES = 64 * 1024;
const NOT_FOUND = { status: 404, body: JSON.stringify({ message: 'Not Found' }) };

export async function startFakeGitHub(repositories: ScriptedRepository[]): Promise<FakeGitHub> {
  const requests: string[] = [];
  const faults = new Map<string, Fault>();
  const parked: (() => void)[] = [];
  let inFlight = 0;
  let peak = 0;

  const server = await startLoopbackServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    requests.push(`${request.method} ${url.pathname}${url.search}`);
    inFlight += 1;
    peak = Math.max(peak, inFlight);
    response.once('close', () => {
      inFlight -= 1;
    });
    const fault = faults.get(url.pathname);
    if (fault?.kind === 'defer') {
      parked.push(() => sendScripted(repositories, url.pathname, response));
      return;
    }
    if (fault) {
      void sendFault(response, fault);
      return;
    }
    sendScripted(repositories, url.pathname, response);
  });

  return {
    origin: server.origin,
    resolveUrl: (url) =>
      url
        .replace('https://api.github.com', `${server.origin}/api`)
        .replace('https://raw.githubusercontent.com', `${server.origin}/raw`),
    requests,
    faults,
    release: () => {
      for (const send of parked.splice(0)) send();
    },
    maxInFlight: () => peak,
    reset: () => {
      requests.length = 0;
      faults.clear();
      peak = 0;
    },
    repositories,
    close: server.close,
  };
}

function sendScripted(
  repositories: readonly ScriptedRepository[],
  pathname: string,
  response: ServerResponse,
): void {
  const answer = scriptedAnswer(repositories, pathname);
  response.writeHead(answer.status, { 'content-type': 'application/json' });
  response.end(answer.body);
}

function scriptedAnswer(repositories: readonly ScriptedRepository[], pathname: string) {
  const metadata = pathname.match(API_REPOSITORY_RE);
  if (metadata) {
    const repository = findRepository(repositories, metadata[1], metadata[2]);
    return repository ? ok({ default_branch: repository.defaultBranch }) : NOT_FOUND;
  }
  const commit = pathname.match(API_COMMIT_RE);
  if (commit) {
    const sha = findRepository(repositories, commit[1], commit[2])?.refs[
      decodeURIComponent(commit[3] ?? '')
    ];
    return sha ? ok({ sha }) : NOT_FOUND;
  }
  const tree = pathname.match(API_TREE_RE);
  if (tree) {
    const files = findRepository(repositories, tree[1], tree[2])?.trees[tree[3] ?? ''];
    return files ? ok(treeListing(Object.keys(files))) : NOT_FOUND;
  }
  const raw = pathname.match(RAW_RE);
  if (raw) {
    const body = findRepository(repositories, raw[1], raw[2])?.trees[raw[3] ?? '']?.[raw[4] ?? ''];
    return body === undefined ? NOT_FOUND : { status: 200, body };
  }
  return NOT_FOUND;
}

function treeListing(names: readonly string[]) {
  return {
    tree: [
      { path: RULES_PATH, type: 'tree' },
      { path: 'README.md', type: 'blob' },
      ...names.map((name) => ({ path: `${RULES_PATH}/${name}/rulebook.json`, type: 'blob' })),
    ],
  };
}

function findRepository(
  repositories: readonly ScriptedRepository[],
  owner: string | undefined,
  repo: string | undefined,
) {
  return repositories.find((entry) => entry.owner === owner && entry.repo === repo);
}

function ok(value: unknown) {
  return { status: 200, body: JSON.stringify(value) };
}

async function sendFault(
  response: ServerResponse,
  fault: Extract<Fault, { kind: 'response' }>,
): Promise<void> {
  response.writeHead(fault.status ?? 200, fault.headers ?? {});
  for (const chunk of bodyChunks(fault.body ?? '', fault.chunkBoundaries)) {
    if (response.destroyed) return;
    if (!response.write(chunk)) await drained(response);
  }
  if (fault.endless || response.destroyed) return;
  response.end();
}

function bodyChunks(body: string | Buffer, boundaries: readonly number[] = []): Buffer[] {
  const buffer = Buffer.isBuffer(body) ? body : Buffer.from(body);
  const cuts = [...new Set([...boundaries, buffer.byteLength])]
    .filter((cut) => cut > 0 && cut <= buffer.byteLength)
    .sort((left, right) => left - right);
  return cuts.flatMap((cut, index) => {
    const start = index === 0 ? 0 : (cuts[index - 1] ?? 0);
    return Array.from({ length: Math.ceil((cut - start) / MAX_WRITE_BYTES) }, (_unused, piece) =>
      buffer.subarray(
        start + piece * MAX_WRITE_BYTES,
        Math.min(start + (piece + 1) * MAX_WRITE_BYTES, cut),
      ),
    );
  });
}

function drained(response: ServerResponse): Promise<void> {
  return new Promise((resolve) => {
    const settle = () => {
      response.off('drain', settle);
      response.off('close', settle);
      resolve();
    };
    response.once('drain', settle);
    response.once('close', settle);
  });
}
