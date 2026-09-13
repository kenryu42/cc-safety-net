import { expect } from 'bun:test';
import { mkdirSync, realpathSync } from 'node:fs';
import { connect } from 'node:net';
import { join } from 'node:path';
import { createPolicyGuiServer as createPortedServer } from '@/gui/index';
import { snapshotTree, type TreeSpec, writeTree } from './fixture-tree';
import { normalizePage } from './gui-page';
import {
  createTempRoot,
  environmentFor,
  isolationEnv,
  normalize,
  WINDOWS_SEPARATOR_FOLDS,
} from './temp-home';

const BLANKED_ENV_NAMES = [
  'CC_SAFETY_NET_LEVEL',
  'CC_SAFETY_NET_STRICT',
  'CC_SAFETY_NET_PARANOID',
  'CC_SAFETY_NET_PARANOID_RM',
  'CC_SAFETY_NET_PARANOID_INTERPRETERS',
  'CC_SAFETY_NET_WORKTREE',
  'CC_SAFETY_NET_DEBUG',
  'CC_SAFETY_NET_AUDIT_SCOPE',
  'SAFETY_NET_STRICT',
  'SAFETY_NET_PARANOID',
  'SAFETY_NET_PARANOID_RM',
  'SAFETY_NET_PARANOID_INTERPRETERS',
  'SAFETY_NET_WORKTREE',
  'CLAUDE_SETTINGS_PATH',
];

export type GuiSide = {
  root: string;
  home: string;
  project: string;
  values: Record<string, string | undefined>;
};

export type GuiRequest = {
  method?: 'GET' | 'POST';
  path: string;
  token?: 'query' | 'header' | 'both' | 'none' | 'wrong-query' | 'wrong-header';
  body?: unknown;
  raw?: string;
  hold?: true;
};

export type GuiResponse = {
  status: number;
  contentType: string | null;
  cacheControl: string | null;
  body: unknown;
};

export type GuiHookOptions = Omit<
  NonNullable<Parameters<typeof createPortedServer>[1]>,
  'cwd' | 'userConfigDir' | 'userConfigPath' | 'projectConfigPath'
>;

function seedSide(prefix: string, seed: TreeSpec): GuiSide {
  const root = createTempRoot(prefix);
  const home = join(root, 'home');
  mkdirSync(join(root, 'project'), { recursive: true });
  mkdirSync(home, { recursive: true });
  writeTree(root, seed);
  return {
    root,
    home,
    project: join(root, 'project'),
    values: isolationEnv(
      home,
      Object.fromEntries(BLANKED_ENV_NAMES.map((name) => [name, undefined])),
    ),
  };
}

function addressed(origin: string, token: string, request: GuiRequest) {
  const mode = request.token ?? (request.method === 'POST' ? 'both' : 'query');
  const wrong = `${token.slice(1)}x`;
  const url = new URL(`${origin}${request.path}`);
  if (mode === 'query' || mode === 'both' || mode === 'wrong-header') {
    url.searchParams.set('token', token);
  }
  if (mode === 'wrong-query') url.searchParams.set('token', wrong);
  return {
    url,
    headerToken:
      mode === 'wrong-header' ? wrong : mode === 'none' || mode === 'query' ? null : token,
  };
}

const observeBody = (contentType: string | null, text: string, token: string): unknown =>
  contentType?.startsWith('application/json')
    ? (JSON.parse(text) as unknown)
    : contentType?.startsWith('text/html')
      ? normalizePage(text, token)
      : text;

async function send(origin: string, token: string, request: GuiRequest): Promise<GuiResponse> {
  const sent = addressed(origin, token, request);
  const response = await fetch(sent.url, {
    method: request.method ?? 'GET',
    headers: sent.headerToken === null ? {} : { 'x-cc-safety-net-token': sent.headerToken },
    ...(request.raw === undefined && request.body === undefined
      ? {}
      : { body: request.raw ?? JSON.stringify(request.body) }),
  });
  const contentType = response.headers.get('content-type');
  return {
    status: response.status,
    contentType,
    cacheControl: response.headers.get('cache-control'),
    body: observeBody(contentType, await response.text(), token),
  };
}

async function openHeld(
  origin: string,
  token: string,
  request: GuiRequest,
  gate: Promise<void>,
): Promise<{ response: Promise<GuiResponse> }> {
  const sent = addressed(origin, token, request);
  const payload = request.raw ?? JSON.stringify(request.body);
  const socket = connect(Number(sent.url.port), sent.url.hostname);
  const chunks: Buffer[] = [];
  const replied = new Promise<string>((resolve) => {
    socket.on('data', (chunk: Buffer) => chunks.push(chunk));
    socket.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
  await new Promise<void>((resolve) => socket.once('connect', () => resolve()));
  await new Promise<void>((resolve) =>
    socket.write(
      [
        `${request.method ?? 'GET'} ${sent.url.pathname}${sent.url.search} HTTP/1.1`,
        `host: ${sent.url.host}`,
        ...(sent.headerToken === null ? [] : [`x-cc-safety-net-token: ${sent.headerToken}`]),
        `content-length: ${Buffer.byteLength(payload)}`,
        'connection: close',
        '',
        '',
      ].join('\r\n'),
      () => resolve(),
    ),
  );
  return {
    response: gate.then(async () => {
      socket.write(payload);
      const reply = await replied;
      socket.destroy();
      const split = reply.indexOf('\r\n\r\n');
      const head = reply.slice(0, split).split('\r\n');
      const headerOf = (name: string) =>
        head
          .find((line) => line.toLowerCase().startsWith(`${name}:`))
          ?.slice(name.length + 1)
          .trim() ?? null;
      const contentType = headerOf('content-type');
      const framed = reply.slice(split + 4);
      return {
        status: Number(head[0]?.split(' ')[1]),
        contentType,
        cacheControl: headerOf('cache-control'),
        body: observeBody(
          contentType,
          headerOf('transfer-encoding') === 'chunked'
            ? framed
                .split('\r\n')
                .filter((_, index) => index % 2 === 1)
                .join('')
            : framed,
          token,
        ),
      };
    }),
  };
}

async function drive(
  server: { origin: string; token: string },
  requests: readonly GuiRequest[],
): Promise<GuiResponse[]> {
  const gate = Promise.withResolvers<void>();
  const responses: Promise<GuiResponse>[] = [];
  for (const request of requests) {
    if (request.hold) {
      responses.push((await openHeld(server.origin, server.token, request, gate.promise)).response);
      continue;
    }
    const response = send(server.origin, server.token, request);
    responses.push(response);
    await response;
  }
  gate.resolve();
  return Promise.all(responses);
}

function observe(side: GuiSide, responses: readonly GuiResponse[]) {
  return normalize({ responses, tree: snapshotTree(side.root) }, [
    [realpathSync(side.root), '<root>'],
    [side.root, '<root>'],
    ...WINDOWS_SEPARATOR_FOLDS,
  ]);
}

export async function runGuiRow(row: {
  seed: TreeSpec;
  options?: (side: GuiSide) => GuiHookOptions;
  requests: readonly GuiRequest[];
}) {
  const portedSide = seedSide('gui-ported-', row.seed);

  const portedServer = await createPortedServer(
    () => environmentFor(portedSide.home, portedSide.values),
    { cwd: portedSide.project, ...row.options?.(portedSide) },
  );
  const portedResponses = await drive(portedServer, row.requests).finally(portedServer.close);

  const ported = observe(portedSide, portedResponses);
  expect(ported.tree.filter((entry) => /\.[0-9a-f]{16}\.tmp$/.test(entry.path))).toStrictEqual([]);
  return { ...ported, home: portedSide.home };
}
