import { afterAll, expect, spyOn } from 'bun:test';
import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { analyzeCommand } from '@/analyzer';
import { listAuditLogFiles } from '@/engine/audit-scan';
import { resolveProtectedGitMetadata } from '@/guards/git-metadata-protection';
import type { VersionFetcher } from '@/integrations/system-info';
import type { AnalyzeInput, EnvironmentContext } from '@/ir/analysis';
import type { AuditLogEntry } from '@/ir/audit';
import type { TraceStep } from '@/ir/command-trace';
import type { Decision } from '@/ir/decision';
import type { ExplainResult } from '@/ir/explain';
import { envTruthy, getCCSafetyNetEnvModes } from '@/policy/env';
import { loadPolicySnapshot } from '@/policy/snapshot';
import { TEST_ENVIRONMENT } from './helpers/environment';
import { policySnapshot, type TestPolicyInput } from './helpers/policy';

// Default empty config for tests that don't specify a cwd.
// This prevents loading the project's rulebook-backed config.
const DEFAULT_TEST_POLICY = policySnapshot();
const CLI_ENTRYPOINT = join(process.cwd(), 'src/cli/cc-safety-net.ts');

function getOptionsFromEnv(
  cwd?: string,
  policy?: TestPolicyInput,
  environment: EnvironmentContext = TEST_ENVIRONMENT,
): AnalyzeInput {
  // If no cwd specified, use empty config to avoid loading project's config
  const snapshot = policy
    ? policySnapshot(policy)
    : cwd
      ? loadPolicySnapshot({ cwd })
      : DEFAULT_TEST_POLICY;
  return {
    cwd,
    policySnapshot: snapshot,
    environment,
    protectedGitMetadata: resolveProtectedGitMetadata([cwd]),
    effectiveCapabilities: getCCSafetyNetEnvModes(snapshot.policy).capabilities,
    strict: envTruthy('SAFETY_NET_STRICT'),
    paranoidRm: envTruthy('SAFETY_NET_PARANOID') || envTruthy('SAFETY_NET_PARANOID_RM'),
    paranoidInterpreters:
      envTruthy('SAFETY_NET_PARANOID') || envTruthy('SAFETY_NET_PARANOID_INTERPRETERS'),
    worktreeMode: envTruthy('SAFETY_NET_WORKTREE'),
  };
}

export function assertBlocked(
  command: string,
  reasonContains: string,
  cwd?: string,
  environment?: EnvironmentContext,
): void {
  const options = getOptionsFromEnv(cwd, undefined, environment);
  const result = analyzeCommand(command, options);
  expect(result).not.toBeNull();
  expect(result?.reason).toContain(reasonContains);
}

export function assertStrictBlocked(
  command: string,
  reasonContains: string,
  cwd?: string,
  environment?: EnvironmentContext,
): void {
  const result = analyzeCommand(command, {
    ...getOptionsFromEnv(cwd, undefined, environment),
    strict: true,
  });
  expect(result).not.toBeNull();
  expect(result?.reason).toContain(reasonContains);
}

export function assertAllowed(
  command: string,
  cwd?: string,
  environment?: EnvironmentContext,
): void {
  const options = getOptionsFromEnv(cwd, undefined, environment);
  const result = analyzeCommand(command, options);
  expect(result).toBeNull();
}

export function blockedSegment(decision: Extract<Decision, { kind: 'deny' }> | null) {
  return decision?.evidence.find((item) => item.kind === 'command')?.segment;
}

export function runGuard(command: string, cwd?: string, policy?: TestPolicyInput): string | null {
  const options = getOptionsFromEnv(cwd, policy);
  return analyzeCommand(command, options)?.reason ?? null;
}

/**
 * A project configured with a remote rulebook source whose content is vendored, the state
 * `rule add` leaves behind and the only state a clone ever has.
 */
export function writeVendoredGitHubRulebookPolicy(
  cwd: string,
  content: string,
  options: { rulebookAsDirectory?: boolean } = {},
): void {
  const rulebookPath = join(cwd, '.cc-safety-net', 'rules', 'policy', 'rulebook.json');

  mkdirSync(join(cwd, '.cc-safety-net', 'rules'), { recursive: true });
  writeFileSync(
    join(cwd, '.cc-safety-net', 'rules', 'rule.json'),
    JSON.stringify({ version: 1, rules: ['owner/repo#main/policy'], overrides: {} }),
  );
  if (options.rulebookAsDirectory) {
    mkdirSync(rulebookPath, { recursive: true });
    return;
  }
  mkdirSync(join(rulebookPath, '..'), { recursive: true });
  writeFileSync(rulebookPath, content);
}

export function readLatestAuditLogEntry(homeDir: string, sessionId: string): AuditLogEntry {
  const files = listAuditLogFiles(join(homeDir, '.cc-safety-net', 'logs'))
    .filter((file) => file.endsWith(`${sessionId}.jsonl`))
    .sort();
  expect(files.length).toBeGreaterThan(0);
  const lines = readFileSync(files[files.length - 1] ?? '', 'utf-8')
    .trim()
    .split('\n');
  return JSON.parse(lines[lines.length - 1] ?? '{}') as AuditLogEntry;
}

export function readAuditLogEntriesForSession(homeDir: string, sessionId: string): AuditLogEntry[] {
  return listAuditLogFiles(join(homeDir, '.cc-safety-net', 'logs'))
    .flatMap((file) =>
      readFileSync(file, 'utf8')
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line) as AuditLogEntry),
    )
    .filter((entry) => entry.sessionId === sessionId);
}

export function writeJsonlFixture(
  filePath: string,
  entries: readonly Record<string, unknown>[],
): void {
  writeFileSync(filePath, entries.map((entry) => JSON.stringify(entry)).join('\n'));
}

export function writeNestedAuditLogFixture(
  logsDir: string,
  projectDir: string,
  entry: Record<string, unknown> & { ts: string; sessionId: string },
): void {
  const date = entry.ts.slice(0, 10);
  const monthDir = join(logsDir, projectDir, date.slice(0, 7));
  mkdirSync(monthDir, { recursive: true });
  writeJsonlFixture(join(monthDir, `${date}-${entry.sessionId}.jsonl`), [entry]);
}

export function mockReadFileError(filePath: string) {
  const readFileSync = fs.readFileSync;
  return spyOn(fs, 'readFileSync').mockImplementation(((path, options) => {
    if (path === filePath) throw new Error('EACCES: permission denied');
    return readFileSync(path, options);
  }) as typeof fs.readFileSync);
}

export function mockReaddirError(dirPath: string) {
  const readdirSync = fs.readdirSync;
  return spyOn(fs, 'readdirSync').mockImplementation((path, options) => {
    if (path === dirPath) throw new Error('EACCES: permission denied');
    return Reflect.apply(readdirSync, fs, [path, options]);
  });
}

function setEnvValue(key: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[key];
    return;
  }
  process.env[key] = value;
}

export function withEnv<T>(env: Record<string, string | undefined>, fn: () => T): T {
  const effectiveEnv =
    env.HOME !== undefined && env.CC_SAFETY_NET_AUDIT_HOME === undefined
      ? { ...env, CC_SAFETY_NET_AUDIT_HOME: env.HOME }
      : env;
  const original: Record<string, string | undefined> = {};
  for (const key of Object.keys(effectiveEnv)) {
    original[key] = process.env[key];
    setEnvValue(key, effectiveEnv[key]);
  }

  const restore = () => {
    for (const key of Object.keys(effectiveEnv)) setEnvValue(key, original[key]);
  };

  try {
    const result = fn();
    if (result instanceof Promise) return result.finally(restore) as T;
    restore();
    return result;
  } catch (error) {
    restore();
    throw error;
  }
}

export function createSpawnEnv(overrides: Record<string, string>) {
  const overriddenNames = new Set(
    Object.keys(overrides).map((name) =>
      process.platform === 'win32' ? name.toLowerCase() : name,
    ),
  );
  return {
    ...Object.fromEntries(
      Object.entries(process.env).filter(
        (entry): entry is [string, string] =>
          entry[1] !== undefined &&
          !overriddenNames.has(process.platform === 'win32' ? entry[0].toLowerCase() : entry[0]),
      ),
    ),
    ...overrides,
  };
}

export async function captureConsoleOutput<T>(
  fn: (output: { stdout: string[]; stderr: string[] }) => T | Promise<T>,
) {
  const output = { stdout: [] as string[], stderr: [] as string[] };
  const log = spyOn(console, 'log').mockImplementation((...parts: unknown[]) =>
    output.stdout.push(parts.map(String).join(' ')),
  );
  const error = spyOn(console, 'error').mockImplementation((...parts: unknown[]) =>
    output.stderr.push(parts.map(String).join(' ')),
  );
  const warn = spyOn(console, 'warn').mockImplementation((...parts: unknown[]) =>
    output.stderr.push(parts.map(String).join(' ')),
  );

  try {
    return { result: await fn(output), ...output };
  } finally {
    log.mockRestore();
    error.mockRestore();
    warn.mockRestore();
  }
}

/**
 * Points CC_SAFETY_NET_HOME at an empty hermetic home for the calling test file.
 * Spawned CLIs resolve it from the inherited environment; deleting it instead would
 * fall back to the developer's real ~/.cc-safety-net, whose contents default-output
 * assertions cannot depend on. Restores the original value after the file finishes.
 * Call at module scope and assign the result to process.env.CC_SAFETY_NET_HOME in
 * the file's env reset.
 */
export function hermeticSafetyNetHome(prefix: string): string {
  const home = mkdtempSync(join(tmpdir(), prefix));
  const original = process.env.CC_SAFETY_NET_HOME;
  afterAll(() => {
    if (original === undefined) delete process.env.CC_SAFETY_NET_HOME;
    if (original !== undefined) process.env.CC_SAFETY_NET_HOME = original;
    rmSync(home, { recursive: true, force: true });
  });
  return home;
}

export async function withTempDir<T>(prefix: string, fn: (dir: string) => T | Promise<T>) {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  try {
    const result = await fn(dir);
    return result;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function withSymlinkedHomeCwd<T>(prefix: string, fn: (home: string, cwd: string) => T): T {
  const root = mkdtempSync(join(tmpdir(), prefix));
  try {
    const home = join(root, 'home');
    const cwd = join(root, 'home-link');
    mkdirSync(home);
    symlinkSync(home, cwd, 'dir');
    return fn(home, cwd);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

export async function runCCSafetyNetCli(
  args: string[],
  env?: Record<string, string>,
  cwd?: string,
): Promise<{ output: string; stderr: string; exitCode: number }> {
  const proc = Bun.spawn([process.execPath, CLI_ENTRYPOINT, ...args], {
    stdout: 'pipe',
    stderr: 'pipe',
    env: { ...process.env, ...(env ?? {}) },
    cwd,
  });
  const output = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  const exitCode = await proc.exited;
  return { output, stderr, exitCode };
}

export function withStdoutColor<T>(enabled: boolean, fn: () => T): T {
  const originalIsTTY = process.stdout.isTTY;
  const originalNoColor = process.env.NO_COLOR;
  // This mutates process-global stdout state; keep color assertions single-process.
  Object.defineProperty(process.stdout, 'isTTY', {
    value: enabled,
    writable: true,
    configurable: true,
  });
  if (enabled) {
    delete process.env.NO_COLOR;
  }
  try {
    return fn();
  } finally {
    Object.defineProperty(process.stdout, 'isTTY', {
      value: originalIsTTY,
      writable: true,
      configurable: true,
    });
    if (originalNoColor === undefined) {
      delete process.env.NO_COLOR;
    } else {
      process.env.NO_COLOR = originalNoColor;
    }
  }
}

export function getTraceSteps(result: Pick<ExplainResult, 'trace'>): TraceStep[] {
  return result.trace.segments.flatMap((segment) => segment.steps);
}

/**
 * Mock version fetcher for testing.
 * Returns predefined versions instantly without spawning processes.
 * @internal Exported for testing
 */
export const mockVersionFetcher: VersionFetcher = async (args: string[]) => {
  if (args[0] === 'claude' && args[1] === 'plugin') {
    return `Installed plugins:

  ❯ cc-safety-net@cc-marketplace
    Version: 0.8.2
    Scope: user
    Status: ✔ enabled`;
  }

  if (args[0] === 'codex' && args[1] === 'plugin') {
    return 'cc-safety-net https://github.com/kenryu42/cc-safety-net.git installed, enabled';
  }

  // Handle multi-word commands like `copilot plugin list`
  if (args[0] === 'copilot' && args[1] === 'plugin') {
    return 'Installed plugins:\n  • copilot-safety-net (v1.0.0)';
  }

  if (args[0] === 'gemini' && args[1] === 'extensions') {
    return `✓ gemini-safety-net (1.0.0)
 Source: https://github.com/kenryu42/gemini-safety-net (Type: github-release)
 Enabled (User): true
 Enabled (Workspace): true`;
  }

  const cmd = args[0];
  const mockVersions: Record<string, string> = {
    claude: '1.0.0',
    agy: 'Antigravity CLI v2.0.0',
    opencode: '0.1.0',
    codex: 'codex 1.2.0',
    gemini: '0.20.0',
    hermes: 'hermes 1.5.0',
    openclaw: 'openclaw 2026.8.1',
    grok: 'grok 1.1.0',
    kimi: 'kimi 0.3.0',
    pi: 'pi 0.4.0',
    copilot: 'Copilot binary version: 1.0.9',
    node: 'v22.0.0',
    npm: '10.0.0',
    bun: '1.0.0',
  };
  return mockVersions[cmd ?? ''] ?? null;
};

/**
 * Convert Windows backslashes to forward slashes for shell command embedding.
 * The POSIX parser reads backslashes as escape characters, which corrupts
 * Windows paths like C:\Users\... into C:Users...
 */
export function toShellPath(p: string): string {
  return p.replace(/\\/g, '/');
}

/** Convert a native path to one safely quoted POSIX shell word. */
export function quoteShellPath(p: string): string {
  return `'${toShellPath(p).replaceAll("'", `'\\''`)}'`;
}

export interface LinkedWorktreeFixture {
  rootDir: string;
  mainWorktree: string;
  linkedWorktree: string;
  cleanup: () => void;
}

function runGit(args: readonly string[], cwd: string): void {
  execFileSync('git', [...args], {
    cwd,
    stdio: 'ignore',
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'CC Safety Net Test',
      GIT_AUTHOR_EMAIL: 'safety-net@example.test',
      GIT_COMMITTER_NAME: 'CC Safety Net Test',
      GIT_COMMITTER_EMAIL: 'safety-net@example.test',
    },
  });
}

let linkedWorktreeSeed: { rootDir: string; repository: string } | undefined;

function getLinkedWorktreeSeed(): string {
  if (linkedWorktreeSeed) return linkedWorktreeSeed.repository;

  const rootDir = mkdtempSync(join(tmpdir(), 'safety-net-worktree-seed-'));
  const repository = join(rootDir, 'repository');
  mkdirSync(repository);
  runGit(['init'], repository);
  writeFileSync(join(repository, 'file.txt'), 'initial\n');
  runGit(['add', 'file.txt'], repository);
  runGit(['-c', 'commit.gpgsign=false', 'commit', '-m', 'initial'], repository);
  linkedWorktreeSeed = { rootDir, repository };
  return repository;
}

export function createLinkedWorktreeFixture(): LinkedWorktreeFixture {
  const rootDir = mkdtempSync(join(tmpdir(), 'safety-net-worktree-'));
  const mainWorktree = join(rootDir, 'main');
  const linkedWorktree = join(rootDir, 'linked');

  runGit(['clone', '--local', getLinkedWorktreeSeed(), mainWorktree], rootDir);
  runGit(['worktree', 'add', '-b', 'feature/worktree-test', linkedWorktree], mainWorktree);

  return {
    rootDir,
    mainWorktree,
    linkedWorktree,
    cleanup: () => {
      rmSync(rootDir, { recursive: true, force: true });
    },
  };
}

export async function withLinkedWorktreeFixture<T>(
  fn: (fixture: LinkedWorktreeFixture) => T | Promise<T>,
) {
  const fixture = createLinkedWorktreeFixture();
  try {
    const result = await fn(fixture);
    return result;
  } finally {
    fixture.cleanup();
  }
}

let readonlyLinkedWorktreeFixture: LinkedWorktreeFixture | undefined;

process.on('exit', () => {
  readonlyLinkedWorktreeFixture?.cleanup();
  if (linkedWorktreeSeed) rmSync(linkedWorktreeSeed.rootDir, { recursive: true, force: true });
});

export async function withReadonlyLinkedWorktreeFixture<T>(
  fn: (fixture: LinkedWorktreeFixture) => T | Promise<T>,
) {
  readonlyLinkedWorktreeFixture ??= createLinkedWorktreeFixture();
  return await fn(readonlyLinkedWorktreeFixture);
}

export interface FakeGitFileFixture {
  rootDir: string;
  cwd: string;
  cleanup: () => void;
}

export function createSubmoduleLikeGitFileFixture(): FakeGitFileFixture {
  const rootDir = mkdtempSync(join(tmpdir(), 'safety-net-submodule-like-'));
  const cwd = join(rootDir, 'submodule');
  const gitDir = join(rootDir, '.git', 'modules', 'submodule');

  mkdirSync(cwd, { recursive: true });
  mkdirSync(gitDir, { recursive: true });
  writeFileSync(join(cwd, '.git'), 'gitdir: ../.git/modules/submodule\n');

  return {
    rootDir,
    cwd,
    cleanup: () => {
      rmSync(rootDir, { recursive: true, force: true });
    },
  };
}
