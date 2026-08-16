import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { Writable } from 'node:stream';
import { parseCommandArgs } from '@/cli/args';
import { getActivitySummary } from '@/cli/doctor/activity';
import { checkForUpdates } from '@/cli/doctor/updates';
import { explainCommand } from '@/cli/explain';
import { type RunInstallCommandOptions, runInstallCommand } from '@/cli/install';
import {
  createPolicySnapshot,
  describeConfigState,
  getUserPolicyDiagnostics,
  loadPolicySnapshot,
  loadRulesPolicy,
  type RulesPolicyOptions,
  resolveAuditRetentionDays,
} from '@/engine/facade';
import { getIntegrationDisplayName, installIntegrationMetadata } from '@/integrations/catalog';
import { detectAllHooks } from '@/integrations/detect';
import type { SystemInfo, UpdateInfo } from '@/integrations/doctor-types';
import {
  INSTALL_TARGETS,
  type InstallAction,
  type InstallTarget,
} from '@/integrations/install/targets';
import { getPackageVersion, getSystemInfo, type VersionFetcher } from '@/integrations/system-info';
import type { ExplainResult } from '@/ir/explain';
import {
  createPolicyPreview,
  DEFAULT_GUI_POLICY,
  DESTRUCTIVE_COMMAND_RULE_METADATA,
  normalizeGuiPolicy,
  normalizeSafety,
  previewUserPolicyForGui,
  readUserPolicyForGui,
  repairUserPolicyForGui,
  resolveSecretDisabledRules,
  SECRET_PROTECTION_RULE_METADATA,
  writeUserPolicyFromGui,
} from '@/policy/store';
import { getActivityFeed } from './activity';
import { chooseDirectory, isDirectoryPickerAvailable } from './choose-directory';
import { renderPolicyGuiHtml } from './page';

const REPO = 'kenryu42/cc-safety-net';
const REPO_URL = `https://github.com/${REPO}`;
const STAR_TIMEOUT_MS = 10_000;
const DEFAULT_ACTIVITY_DAYS = 7;
type StarCountFetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

/** @internal */
export interface StarContext {
  starred: boolean | null;
  starCount: number | null;
  blockedTotal: number;
}

interface IntegrationsStatus {
  targets: {
    target: InstallTarget;
    label: string;
    version: string | null;
    status: 'active' | 'disabled' | 'not-installed' | 'not-inspected';
  }[];
  system: { version: string; nodeVersion: string | null; platform: string };
}

interface HealthStatus {
  hooks: { platform: string; label: string; configured: boolean }[];
  update: { currentVersion: string; latestVersion: string | null; updateAvailable: boolean };
}

/** @internal */
export interface PolicyGuiServer {
  origin: string;
  token: string;
  url: string;
  close: () => Promise<void>;
}

interface PolicyGuiServerOptions extends RulesPolicyOptions {
  starRepo?: () => Promise<{ ok: boolean }>;
  fetchStarContext?: () => Promise<StarContext>;
  fetchIntegrations?: () => Promise<IntegrationsStatus>;
  fetchHealth?: () => Promise<HealthStatus>;
  runIntegration?: (
    action: InstallAction,
    target: InstallTarget,
  ) => Promise<{ ok: boolean; output: string }>;
  activityLogsDir?: string;
  token?: string;
}

interface RunGuiCommandOptions extends RulesPolicyOptions {
  openBrowser?: (url: string) => Promise<void> | void;
  keepAlive?: boolean;
  log?: (message: string) => void;
  error?: (message: string) => void;
}

export async function runGuiCommand(
  args: readonly string[],
  options: RunGuiCommandOptions = {},
): Promise<number> {
  const parsed = parseCommandArgs({ label: 'gui', booleans: { noOpen: ['--no-open'] } }, args);
  const log = options.log ?? console.log;
  const error = options.error ?? console.error;
  if (parsed.errors.length > 0) {
    for (const message of parsed.errors) error(message);
    error('Usage: cc-safety-net gui [--no-open]');
    return 1;
  }

  const server = await createPolicyGuiServer(options);
  log(`CC Safety Net policy GUI: ${server.url}`);

  if (!parsed.flags.noOpen) {
    try {
      await (options.openBrowser ?? openBrowser)(server.url);
    } catch (openError) {
      error(
        `Failed to open browser: ${openError instanceof Error ? openError.message : String(openError)}`,
      );
      error(`Open this URL manually: ${server.url}`);
    }
  }

  if (options.keepAlive === false) {
    await server.close();
    return 0;
  }

  await waitForShutdown(server);
  return 0;
}

/** @internal */
export async function createPolicyGuiServer(
  options: PolicyGuiServerOptions = {},
): Promise<PolicyGuiServer> {
  const token = options.token ?? randomBytes(24).toString('base64url');
  const server = createServer((request, response) => {
    void handleRequest(request, response, token, options);
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });

  const address = server.address() as AddressInfo;
  const origin = `http://127.0.0.1:${address.port}`;
  return {
    origin,
    token,
    url: `${origin}/?token=${encodeURIComponent(token)}`,
    close: () => closeServer(server),
  };
}

async function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
  token: string,
  options: PolicyGuiServerOptions,
): Promise<void> {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1');
  if (request.method === 'GET' && url.pathname === '/favicon.ico') {
    response.writeHead(204, { 'cache-control': 'no-store' });
    response.end();
    return;
  }

  if (!requestHasValidToken(request, url, token)) {
    sendJson(response, 403, { error: 'Forbidden' });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/') {
    sendHtml(response, renderPolicyGuiHtml(token));
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/policy') {
    const result = readUserPolicyForGui(options);
    sendJson(response, 200, {
      ...result,
      configState: describeConfigState(loadPolicySnapshot(options)),
      destructiveCommandRules: DESTRUCTIVE_COMMAND_RULE_METADATA,
      secretPatterns: SECRET_PROTECTION_RULE_METADATA,
      version: getPackageVersion(),
      preview: result.errors.length > 0 ? null : createPolicyPreview(result.policy),
    });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/policy/preview') {
    const body = await readJsonBody(request);
    if (!body.ok) {
      sendJson(response, 400, { errors: [body.error] });
      return;
    }
    const result = previewUserPolicyForGui(body.value);
    sendJson(response, result.errors.length > 0 ? 400 : 200, result);
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/policy/explain') {
    const body = await readJsonBody(request);
    if (!body.ok) {
      sendJson(response, 400, { errors: [body.error] });
      return;
    }
    const payload = body.value as { command?: unknown; policy?: unknown } | null;
    if (payload === null || typeof payload.command !== 'string') {
      sendJson(response, 400, { errors: ['command must be a string'] });
      return;
    }
    const errors = getUserPolicyDiagnostics(payload.policy);
    if (errors.length > 0) {
      sendJson(response, 400, { errors });
      return;
    }
    sendJson(response, 200, explainDraftCommand(payload.command, payload.policy, options));
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/policy') {
    const body = await readJsonBody(request);
    if (!body.ok) {
      sendJson(response, 400, { errors: [body.error] });
      return;
    }
    const result = writeUserPolicyFromGui(body.value, options);
    sendJson(response, result.errors.length > 0 ? 400 : 200, result);
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/reset') {
    sendJson(response, 200, writeUserPolicyFromGui(DEFAULT_GUI_POLICY, options));
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/repair') {
    sendJson(response, 200, repairUserPolicyForGui(options));
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/activity') {
    const retentionDays = resolveAuditRetentionDays(options);
    const days = parseActivityDays(url.searchParams.get('days'), retentionDays);
    if (days === null) {
      sendJson(response, 400, {
        error: `days must be an integer between 1 and ${retentionDays}`,
      });
      return;
    }
    sendJson(response, 200, getActivityFeed(days, options.activityLogsDir));
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/rules/choose-directory') {
    // Takes no path from the client: the dialog is the only input, so there is
    // nothing here to point at a directory of the caller's choosing.
    sendJson(response, 200, await chooseDirectory());
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/rules') {
    const policy = loadRulesPolicy(options);
    const enforcedByName = new Map(policy.rules.map((rule) => [rule.name, rule]));
    sendJson(response, 200, {
      projectPath: options.cwd ?? process.cwd(),
      canPickDirectory: isDirectoryPickerAvailable(process.platform, process.env),
      rulebooks: policy.rulebooks.map((rulebook) => ({
        source: rulebook.source,
        spec: rulebook.spec,
        name: rulebook.name,
        version: rulebook.version,
        // A rule disabled by an override stays listed here but leaves policy.rules.
        rules: rulebook.rules.flatMap((ruleName) => {
          const rule = enforcedByName.get(ruleName);
          if (!rule) return [];
          return [
            {
              name: rule.name,
              command: rule.command,
              subcommand: rule.subcommand,
              block_args: rule.block_args,
              reason: rule.reason,
            },
          ];
        }),
      })),
      errors: policy.errors,
      warnings: policy.warnings,
    });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/star/context') {
    sendJson(
      response,
      200,
      await (
        options.fetchStarContext ?? (() => fetchStarContext({ logsDir: options.activityLogsDir }))
      )(),
    );
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/star') {
    const result = await (options.starRepo ?? starRepo)();
    sendJson(response, 200, result.ok ? { ok: true } : { ok: false, fallbackUrl: REPO_URL });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/integrations') {
    sendJson(response, 200, await (options.fetchIntegrations ?? fetchIntegrations)());
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/health') {
    sendJson(response, 200, await (options.fetchHealth ?? fetchHealth)());
    return;
  }

  if (
    request.method === 'POST' &&
    (url.pathname === '/api/install' || url.pathname === '/api/uninstall')
  ) {
    const body = await readJsonBody(request);
    if (!body.ok) {
      sendJson(response, 400, { errors: [body.error] });
      return;
    }
    const target = (body.value as { target?: unknown } | null)?.target;
    if (typeof target !== 'string' || !INSTALL_TARGETS.some((entry) => entry.target === target)) {
      sendJson(response, 400, { error: 'unknown target' });
      return;
    }
    const action = url.pathname === '/api/install' ? 'install' : 'uninstall';
    sendJson(
      response,
      200,
      await (options.runIntegration ?? runIntegration)(action, target as InstallTarget),
    );
    return;
  }

  sendJson(response, 404, { error: 'Not found' });
}

function explainDraftCommand(
  command: string,
  policy: unknown,
  options: RulesPolicyOptions,
): ExplainResult {
  const draft = normalizeGuiPolicy(policy);
  const diskSnapshot = loadPolicySnapshot(options);
  const snapshot = createPolicySnapshot({
    rules: diskSnapshot.policy.rules,
    transparentWrappers: diskSnapshot.policy.transparentWrappers,
    safety: normalizeSafety(draft.safety),
    worktreeMode: draft.workflow.worktree_mode,
    destructiveCommandProtectionEnabled: draft.destructive_command_protection.enabled,
    destructiveCommandRuleOverrides: draft.destructive_command_protection.overrides,
    destructiveCommandAllowPaths: draft.destructive_command_protection.allow_paths,
    secretProtection: {
      enabled: draft.secret_protection.enabled,
      disabledRules: [...resolveSecretDisabledRules(draft.secret_protection.overrides)],
      denyPaths: draft.secret_protection.deny_paths,
      allowPaths: draft.secret_protection.allow_paths,
    },
  });
  return explainCommand(command, {
    policySnapshot: snapshot,
    cwd: options.cwd,
    userConfigDir: options.userConfigDir,
  });
}

function parseActivityDays(raw: string | null, retentionDays: number): number | null {
  // The default window cannot outrun a retention set below it.
  if (raw === null) return Math.min(DEFAULT_ACTIVITY_DAYS, retentionDays);
  const days = Number(raw);
  if (!Number.isInteger(days) || days < 1 || days > retentionDays) return null;
  return days;
}

function requestHasValidToken(request: IncomingMessage, url: URL, token: string): boolean {
  if (url.searchParams.get('token') !== token) return false;
  if (request.method !== 'POST') return true;
  return request.headers['x-cc-safety-net-token'] === token;
}

async function readJsonBody(
  request: IncomingMessage,
): Promise<{ ok: true; value: unknown } | { ok: false; error: string }> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(chunk as Buffer);
  }
  try {
    return { ok: true, value: JSON.parse(Buffer.concat(chunks).toString('utf-8') || '{}') };
  } catch (error) {
    return {
      ok: false,
      error: `Invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function sendHtml(response: ServerResponse, html: string): void {
  response.writeHead(200, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
  });
  response.end(html);
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  response.end(JSON.stringify(body));
}

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

function waitForShutdown(server: PolicyGuiServer): Promise<void> {
  return new Promise((resolve) => {
    const cleanup = () => {
      process.off('SIGINT', shutdown);
      process.off('SIGTERM', shutdown);
    };
    const shutdown = () => {
      cleanup();
      void server.close().then(resolve);
    };
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  });
}

function openBrowser(url: string): Promise<void> {
  const command =
    process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'cmd' : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url];
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { detached: true, stdio: 'ignore' });
    const handleError = (error: Error) => {
      child.off('spawn', handleSpawn);
      reject(error);
    };
    const handleSpawn = () => {
      child.off('error', handleError);
      child.unref();
      resolve();
    };
    child.once('error', handleError);
    child.once('spawn', handleSpawn);
  });
}

/** @internal */
export async function starRepo(
  command = 'gh',
  timeoutMs = STAR_TIMEOUT_MS,
): Promise<{ ok: boolean }> {
  return {
    ok:
      (await runGhCommand(command, ['api', '-X', 'PUT', `/user/starred/${REPO}`], timeoutMs)) === 0,
  };
}

const VERSION_FIELDS = {
  amp: 'ampVersion',
  'antigravity-cli': 'antigravityCliVersion',
  'claude-code': 'claudeCodeVersion',
  codex: 'codexCliVersion',
  'copilot-cli': 'copilotCliVersion',
  cursor: 'cursorVersion',
  'gemini-cli': 'geminiCliVersion',
  'hermes-agent': 'hermesAgentVersion',
  'kimi-code': 'kimiCodeVersion',
  openclaw: 'openClawVersion',
  opencode: 'openCodeVersion',
  pi: 'piCliVersion',
} as const satisfies Record<InstallTarget, keyof SystemInfo>;

/** @internal */
export async function fetchIntegrations(
  probe: { fetcher?: VersionFetcher; homeDir?: string } = {},
): Promise<IntegrationsStatus> {
  const systemInfo = await getSystemInfo(probe.fetcher);
  const hookStatuses = detectHooksFromSystemInfo(systemInfo, probe.homeDir);
  return {
    targets: installIntegrationMetadata.map((meta) => {
      const hook = hookStatuses.find((status) => status.platform === meta.id);
      return {
        target: meta.id,
        label: getIntegrationDisplayName(meta.id),
        version: systemInfo[VERSION_FIELDS[meta.id]],
        status: hook?.configured
          ? 'active'
          : hook?.detected
            ? 'disabled'
            : hook?.inspectionStatus === 'not-inspected'
              ? 'not-inspected'
              : 'not-installed',
      } as const;
    }),
    system: {
      version: systemInfo.version,
      nodeVersion: systemInfo.nodeVersion,
      platform: systemInfo.platform,
    },
  };
}

function detectHooksFromSystemInfo(systemInfo: SystemInfo, homeDir?: string) {
  return detectAllHooks(process.cwd(), {
    homeDir,
    ampPluginListOutput: systemInfo.ampPluginListOutput,
    codexPluginListOutput: systemInfo.codexPluginListOutput,
    copilotCliVersion: systemInfo.copilotCliVersion,
  });
}

/**
 * Health for the Overview strip, from the same getSystemInfo batch the Integrations tab
 * uses. Runtimes whose hook state can only be read by writing into their config directory
 * are reported as not inspected, so they are absent from this list rather than listed as
 * inactive; the Integrations tab shows that state per runtime.
 * @internal
 */
export async function fetchHealth(
  probe: {
    fetcher?: VersionFetcher;
    homeDir?: string;
    checkUpdates?: () => Promise<UpdateInfo>;
  } = {},
): Promise<HealthStatus> {
  const [systemInfo, update] = await Promise.all([
    getSystemInfo(probe.fetcher),
    (probe.checkUpdates ?? checkForUpdates)(),
  ]);
  return {
    hooks: detectHooksFromSystemInfo(systemInfo, probe.homeDir)
      .filter((hook) => hook.detected)
      .map((hook) => ({
        platform: hook.platform,
        label: getIntegrationDisplayName(hook.platform),
        configured: hook.configured,
      })),
    update: {
      currentVersion: update.currentVersion,
      latestVersion: update.latestVersion ?? null,
      updateAvailable: update.updateAvailable,
    },
  };
}

let integrationActionQueue: Promise<unknown> = Promise.resolve();

/** @internal */
export function runIntegration(
  action: InstallAction,
  target: InstallTarget,
  overrides: RunInstallCommandOptions = {},
): Promise<{ ok: boolean; output: string }> {
  const run = async () => {
    const lines: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;
    console.log = (...args: unknown[]) => lines.push(args.map(String).join(' '));
    console.error = console.log;
    try {
      const exitCode = await runInstallCommand(action, [], {
        selectTargets: async () => [target],
        output: new Writable({
          write(_chunk, _encoding, callback) {
            callback();
          },
        }) as unknown as NodeJS.WriteStream,
        ...overrides,
      });
      return { ok: exitCode === 0, output: lines.join('\n') };
    } finally {
      console.log = originalLog;
      console.error = originalError;
    }
  };
  const result = integrationActionQueue.then(run);
  integrationActionQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

/** @internal */
export async function fetchStarContext(
  options: { command?: string; logsDir?: string; fetchRepo?: StarCountFetch } = {},
): Promise<StarContext> {
  const [starred, starCount, blockedTotal] = await Promise.all([
    userHasStarredRepo(options.command),
    fetchStarCount(options.fetchRepo),
    Promise.resolve(getActivitySummary(resolveAuditRetentionDays(), options.logsDir).totalBlocked),
  ]);
  return { starred, starCount, blockedTotal };
}

/** @internal */
export async function userHasStarredRepo(
  command = 'gh',
  timeoutMs = STAR_TIMEOUT_MS,
): Promise<boolean | null> {
  if ((await runGhCommand(command, ['auth', 'status'], timeoutMs)) !== 0) return null;
  const starredExitCode = await runGhCommand(command, ['api', `/user/starred/${REPO}`], timeoutMs);
  if (starredExitCode === 0) return true;
  if (starredExitCode === null) return null;
  return false;
}

function runGhCommand(
  command: string,
  args: readonly string[],
  timeoutMs: number,
): Promise<number | null> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: 'ignore',
      windowsHide: true,
    });
    let settled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const finish = (code: number | null) => {
      if (settled) return;
      settled = true;
      if (timeout) clearTimeout(timeout);
      resolve(code);
    };
    child.once('error', () => finish(null));
    child.once('close', finish);
    timeout = setTimeout(() => {
      child.kill();
      finish(null);
    }, timeoutMs);
  });
}

async function fetchStarCount(fetchRepo: StarCountFetch = fetch): Promise<number | null> {
  try {
    const response = await fetchRepo(`https://api.github.com/repos/${REPO}`, {
      headers: { accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(STAR_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { stargazers_count?: unknown };
    return typeof body.stargazers_count === 'number' ? body.stargazers_count : null;
  } catch {
    return null;
  }
}
