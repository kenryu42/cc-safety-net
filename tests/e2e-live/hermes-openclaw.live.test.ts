import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { listAuditLogFiles, readAuditLogEntries } from '@/audit/reader';
import { createTestEnvironment } from '@/core/environment';
import { redactSecrets } from '@/core/redaction';
import { getHermesAgentPluginDir } from '@/hosts/hermes-agent/install';
import { OPENCLAW_PLUGIN_ID } from '@/hosts/openclaw/artifact';
import { getOpenClawPluginDir } from '@/hosts/openclaw/install';
import { buildOpenClawBundle, buildRuntimeBundles } from '../../scripts/build-runtime';
import {
  buildE2EArtifacts,
  describeHermesGates,
  isolatedEnv,
  parseJsonOutput,
  readHermesDirective,
  runCommand,
  runNode,
  SESSION_PREFIX,
  snapshotRealHostState,
  withHostWorkspace,
} from '../e2e/harness';
import {
  openClawEnv,
  reserveLoopbackPort,
  runOpenClaw,
  startOpenClawGateway,
  startStubModelServer,
  writeOpenClawConfig,
} from './openclaw-host';

const liveEnabled = process.env.CC_SAFETY_NET_E2E_LIVE === '1';
const hermesBin = Bun.which('hermes');
const openClawBin = Bun.which('openclaw');
const skipHermes = !liveEnabled || hermesBin === null;
const skipOpenClaw = !liveEnabled || openClawBin === null;

const GATEWAY_READY_TIMEOUT_MS = 180_000;
const AGENT_TURN_TIMEOUT_MS = 120_000;
const OPENCLAW_CLI_TIMEOUT_MS = 60_000;
const REAL_OPENCLAW_TIMEOUT_MS = 300_000;

let buildRoot = '';
let cliPath = '';

beforeAll(async () => {
  if (skipHermes && skipOpenClaw) return;
  buildRoot = await buildE2EArtifacts('cc-safety-net-e2e-live-hosts-', [
    buildRuntimeBundles,
    buildOpenClawBundle,
  ]);
  cliPath = join(buildRoot, 'dist', 'bin', 'cc-safety-net.js');
});

afterAll(() => {
  if (buildRoot) rmSync(buildRoot, { recursive: true, force: true });
});

const hermesBinaryGate = {
  agent: 'hermes-agent',
  async run(command: string, cwd: string, home: string, sessionId: string, action: () => void) {
    const hermesHome = join(home, '.hermes');
    mkdirSync(hermesHome, { recursive: true });
    writeFileSync(
      join(hermesHome, 'config.yaml'),
      `hooks:\n  pre_tool_call:\n    - matcher: "terminal"\n      command: "node ${cliPath} hook --hermes-agent"\n      timeout: 30\n`,
    );
    const payloadPath = join(home, 'hermes-payload.json');
    writeFileSync(payloadPath, JSON.stringify({ args: { command }, session_id: sessionId }));

    const { stdout } = await runCommand(
      [
        'hermes',
        'hooks',
        'test',
        'pre_tool_call',
        '--for-tool',
        'terminal',
        '--payload-file',
        payloadPath,
      ],
      '',
      cwd,
      home,
    );
    expect(stdout).toContain('exit=0');
    expect(stdout).not.toContain('stderr:');
    const directive = /parsed \(Hermes wire shape\): (.+)$/m.exec(stdout);
    if (!directive) expect(stdout).toContain('parsed: <none');
    return readHermesDirective(
      directive?.[1] ? parseJsonOutput('Hermes dispatcher', directive[1]) : null,
      action,
    );
  },
};

describeHermesGates([{ name: 'the real hermes binary', gate: hermesBinaryGate, skip: skipHermes }]);

describe.skipIf(skipHermes)('packaged Hermes Agent plugin under the real hermes CLI', () => {
  test('installs a plugin the real host discovers, and uninstall removes it again', async () => {
    await withHostWorkspace(async ({ cwd, home }) => {
      await runNode([cliPath, 'install', '--hermes-agent'], '', cwd, home);

      expect(await listRealHermesPlugins(cwd, home)).toContain(
        'Block destructive commands and secret-file access before Hermes runs a tool.',
      );

      await runNode([cliPath, 'uninstall', '--hermes-agent'], '', cwd, home);

      expect(await listRealHermesPlugins(cwd, home)).toBe('');
      expect(
        existsSync(
          getHermesAgentPluginDir(
            createTestEnvironment({ home, tmpdir: tmpdir(), env: new Map() }),
          ),
        ),
      ).toBe(false);
    });
  });
});

async function listRealHermesPlugins(cwd: string, home: string) {
  const { stdout } = await runCommand(['hermes', 'plugins', 'list'], '', cwd, home, {
    env: { COLUMNS: '400' },
  });
  return stdout
    .split('\n')
    .filter((line) => line.includes('cc-safety-net'))
    .join('\n');
}

describe.skipIf(skipOpenClaw)('packaged OpenClaw plugin under the real openclaw CLI', () => {
  test(
    'the built CLI installs a plugin the real host loads, and native uninstall removes it again',
    async () => {
      await withHostWorkspace(async ({ cwd, home }) => {
        await runCommand(['node', cliPath, 'install', '--openclaw'], '', cwd, home, {
          env: openClawEnv(home),
        });

        expect(await listRealOpenClawPlugins(cwd, home)).toContain(OPENCLAW_PLUGIN_ID);
        expect(await inspectRealOpenClawPlugin(cwd, home)).toMatchObject({
          plugin: { id: OPENCLAW_PLUGIN_ID, enabled: true, status: 'loaded' },
          typedHooks: [{ name: 'before_tool_call', priority: 50 }],
        });

        await runOpenClawChecked(
          ['plugins', 'uninstall', OPENCLAW_PLUGIN_ID, '--force'],
          cwd,
          home,
        );

        expect(await listRealOpenClawPlugins(cwd, home)).toBe('');
        expect(
          existsSync(
            getOpenClawPluginDir(createTestEnvironment({ home, tmpdir: tmpdir(), env: new Map() })),
          ),
        ).toBe(false);
      });
    },
    REAL_OPENCLAW_TIMEOUT_MS,
  );
});

describe.skipIf(skipOpenClaw)(
  'packaged OpenClaw protection through a real gateway agent turn',
  () => {
    let context: Awaited<ReturnType<typeof startRealOpenClawGateway>> | undefined;

    beforeAll(async () => {
      context = await startRealOpenClawGateway();
    }, REAL_OPENCLAW_TIMEOUT_MS);

    afterAll(async () => {
      await context?.close();
    });

    test(
      'allows a harmless command and lets the real host run it',
      async () => {
        const gateway = requireGateway(context);
        const marker = join(gateway.workspace, 'openclaw-allowed-ran');
        gateway.stub.armExec(`touch ${marker}`);

        await gateway.runTurn('allow');

        expect(existsSync(marker)).toBe(true);
        expect(readOpenClawDenials(gateway.home, `touch ${marker}`)).toEqual([]);
      },
      REAL_OPENCLAW_TIMEOUT_MS,
    );

    test(
      'blocks git reset --hard before the real host can run it',
      async () => {
        const gateway = requireGateway(context);
        const sentinel = join(gateway.workspace, 'sentinel.txt');
        writeFileSync(sentinel, 'uncommitted');
        gateway.stub.armExec('git reset --hard');

        await gateway.runTurn('block');

        expect(readFileSync(sentinel, 'utf8')).toBe('uncommitted');
        expect(readOpenClawDenials(gateway.home, 'git reset --hard')).toMatchObject([
          { decision: 'deny', agent: 'openclaw', toolName: 'exec', ruleId: 'git.reset-hard' },
        ]);
      },
      REAL_OPENCLAW_TIMEOUT_MS,
    );
  },
);

async function startRealOpenClawGateway() {
  const root = mkdtempSync(join(tmpdir(), 'cc-safety-net-openclaw-'));
  const home = join(root, 'home');
  const workspace = join(root, 'workspace');
  mkdirSync(home);
  mkdirSync(workspace);
  const before = snapshotRealHostState();

  const stub = startStubModelServer();
  const gatewayPort = reserveLoopbackPort();
  const token = 'stub-gateway-token';
  writeOpenClawConfig(home, { modelPort: stub.port, gatewayPort, token, workspace });

  const env = { ...isolatedEnv(home), ...openClawEnv(home) };
  await runCommand(['node', cliPath, 'install', '--openclaw'], '', workspace, home, {
    env: openClawEnv(home),
  });

  writeFileSync(join(workspace, 'sentinel.txt'), 'committed');
  for (const args of [
    ['init', '-q', '-b', 'main'],
    ['config', 'user.email', 'test@example.com'],
    ['config', 'user.name', 'test'],
    ['add', 'sentinel.txt'],
    ['commit', '-q', '-m', 'sentinel'],
  ]) {
    await runCommand(['git', ...args], '', workspace, home);
  }

  const gateway = await startOpenClawGateway({
    cwd: workspace,
    env,
    port: gatewayPort,
    token,
    readyTimeoutMs: GATEWAY_READY_TIMEOUT_MS,
  });

  return {
    home,
    workspace,
    stub,
    async runTurn(sessionSlug: string) {
      const result = await runOpenClaw(
        [
          'agent',
          '--agent',
          'main',
          '--session-key',
          `agent:main:${SESSION_PREFIX}-${sessionSlug}`,
          '--message',
          'run the command',
          '--timeout',
          String(Math.floor(AGENT_TURN_TIMEOUT_MS / 1000)),
          '--json',
        ],
        { cwd: workspace, env, timeoutMs: AGENT_TURN_TIMEOUT_MS },
      );
      if (result.exitCode !== 0) {
        throw new Error(
          `OpenClaw agent turn failed (exit ${result.exitCode}):\n${redactSecrets(result.stdout)}\n${redactSecrets(result.stderr)}`,
        );
      }
      return result;
    },
    async close() {
      await gateway.stop();
      stub.stop();
      expect(snapshotRealHostState()).toBe(before);
      rmSync(root, { recursive: true, force: true });
    },
  };
}

function requireGateway<T>(context: T | undefined): T {
  if (!context) throw new Error('The real OpenClaw gateway did not start');
  return context;
}

function readOpenClawDenials(home: string, command: string) {
  return listAuditLogFiles(join(home, '.cc-safety-net', 'logs'))
    .flatMap((file) => readAuditLogEntries(file))
    .filter((entry) => entry.decision === 'deny' && entry.command === command);
}

async function runOpenClawChecked(args: readonly string[], cwd: string, home: string) {
  const result = await runOpenClaw(args, {
    cwd,
    env: { ...isolatedEnv(home), ...openClawEnv(home) },
    timeoutMs: OPENCLAW_CLI_TIMEOUT_MS,
  });
  if (result.exitCode === 0 && result.stderr.trim() === '') return result.stdout;
  throw new Error(
    `openclaw ${args.join(' ')} violated the E2E contract:\n${redactSecrets(JSON.stringify(result, null, 2))}`,
  );
}

async function listRealOpenClawPlugins(cwd: string, home: string) {
  const stdout = await runOpenClawChecked(['plugins', 'list', '--enabled'], cwd, home);
  return stdout
    .split('\n')
    .filter((line) => line.includes(OPENCLAW_PLUGIN_ID))
    .join('\n');
}

async function inspectRealOpenClawPlugin(cwd: string, home: string) {
  return parseJsonOutput(
    'OpenClaw inspect',
    await runOpenClawChecked(
      ['plugins', 'inspect', OPENCLAW_PLUGIN_ID, '--runtime', '--json'],
      cwd,
      home,
    ),
  );
}
