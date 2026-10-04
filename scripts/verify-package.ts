#!/usr/bin/env bun

import {
  chmodSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { AMP_PLUGIN_ENTRY } from '../src/hosts/amp/artifact';
import {
  AMP_HOST_SCRIPT,
  DEEPSEEK_HARNESS_HOST_SCRIPT,
  OPENCODE_HOST_SCRIPT,
  PI_HOST_SCRIPT,
} from './integration-host-scripts';
import { OPENCODE_V2_HOST_SCRIPT } from './opencode-v2-host';
import { verifyBuildArtifacts } from './verify-build';

const PACKAGE_ROOT_FILES = [
  'package/LICENSE',
  'package/README.md',
  'package/package.json',
] as const;
const MAX_TARBALL_BYTES = 620_000;
const SKIP_OPENCODE_V2_PEER_INSTALL_ON_WINDOWS = process.platform === 'win32';

interface PackResult {
  filename: string;
  size: number;
  files: Array<{ path: string; mode: number }>;
}

interface BuildPackageTarballOptions {
  outputDirectory: string;
  gitHead?: string;
  npmCommand?: string[];
}

export function writeTypeScriptConsumer(directory: string, consumer: string): string {
  writeFileSync(join(directory, 'consumer.ts'), consumer);
  writeFileSync(
    join(directory, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        module: 'ESNext',
        moduleResolution: 'Bundler',
        noEmit: true,
        strict: true,
        target: 'ES2022',
      },
      files: ['consumer.ts'],
    }),
  );
  return join(directory, 'tsconfig.json');
}

function run(
  command: string[],
  cwd = process.cwd(),
  allowedExitCodes = [0],
  stdin?: string,
  env?: Record<string, string | undefined>,
) {
  const result = Bun.spawnSync(command, {
    cwd,
    stdout: 'pipe',
    stderr: 'pipe',
    ...(stdin === undefined ? {} : { stdin: Buffer.from(stdin) }),
    ...(env === undefined ? {} : { env }),
  });
  if (allowedExitCodes.includes(result.exitCode)) return result;
  throw new Error(
    `${command.join(' ')} failed (${result.exitCode})\n${result.stdout.toString()}${result.stderr.toString()}`,
  );
}

export async function verifyPackage(): Promise<void> {
  const directory = mkdtempSync(join(tmpdir(), 'cc-safety-net-package-'));
  const outputArgument = process.argv.indexOf('--output');
  const outputDirectory =
    outputArgument === -1
      ? directory
      : resolve(process.argv[outputArgument + 1] ?? throwMissingOutputDirectory());
  mkdirSync(outputDirectory, { recursive: true });
  try {
    const buildArtifacts = await verifyBuildArtifacts();
    const gitHeadArgument = process.argv.indexOf('--git-head');
    const { result, tarball } = await buildPackageTarball({
      outputDirectory,
      ...(gitHeadArgument === -1
        ? {}
        : { gitHead: process.argv[gitHeadArgument + 1] ?? throwMissingGitHead() }),
    });
    const files = result.files.map((file) => `package/${file.path}`).sort();
    const expectedFiles = [
      ...PACKAGE_ROOT_FILES,
      ...buildArtifacts.map((path) => `package/${path}`),
    ].sort();
    if (JSON.stringify(files) !== JSON.stringify(expectedFiles)) {
      throw new Error(`Unexpected npm package files:\n${files.join('\n')}`);
    }
    if (result.size > MAX_TARBALL_BYTES) {
      throw new Error(`npm tarball is ${result.size} bytes; maximum is ${MAX_TARBALL_BYTES}`);
    }
    if (process.platform !== 'win32') {
      const bin = result.files.find((file) => file.path === 'dist/bin/cc-safety-net.js');
      if (!bin || bin.mode !== 0o755) throw new Error('Packed CLI mode is not 0755');
      if (result.files.some((file) => file !== bin && file.mode !== 0o644)) {
        throw new Error('Packed non-executable files must have mode 0644');
      }
    }

    run(['npm', 'init', '--yes'], directory);
    run(
      [
        'npm',
        'install',
        '--ignore-scripts',
        '--no-audit',
        '--no-fund',
        tarball,
        '@opencode-ai/plugin@1.18.29',
        ...(SKIP_OPENCODE_V2_PEER_INSTALL_ON_WINDOWS
          ? []
          : [
              '@opencode/plugin@2.0.6',
              '@opencode/core@2.0.6',
              '@effect/platform-node@4.0.0-rc.112',
              '@effect/platform-node-shared@4.0.0-rc.112',
              'effect@4.0.0-rc.112',
            ]),
        '@types/node@18',
        '@types/json-schema',
        'typescript@5',
      ],
      directory,
    );
    const packageRoot = join(directory, 'node_modules', 'cc-safety-net');
    const cli = join(packageRoot, 'dist', 'bin', 'cc-safety-net.js');
    const packageVerificationEnv = getPackageVerificationEnv(directory);
    for (const bundle of [
      'dist/index.js',
      'dist/cli.js',
      'dist/bin/hook.js',
      'dist/pi/index.js',
      `dist/amp/${AMP_PLUGIN_ENTRY}`,
    ]) {
      if (readFileSync(join(packageRoot, bundle), 'utf8').includes('_operation')) {
        throw new Error(`Packed ${bundle} exposes the internal rule synchronization operation`);
      }
    }
    verifyInstalledProtectionJourneys({
      directory,
      cli,
      pi: join(packageRoot, 'dist', 'pi', 'index.js'),
      deepSeekHarness: deepSeekHarnessBundleModule(packageRoot),
      openCode: join(packageRoot, 'dist', 'index.js'),
      amp: join(packageRoot, 'dist', 'amp', AMP_PLUGIN_ENTRY),
      env: packageVerificationEnv,
    });
    if (!SKIP_OPENCODE_V2_PEER_INSTALL_ON_WINDOWS) {
      const v2 = run(
        [
          process.execPath,
          '--eval',
          OPENCODE_V2_HOST_SCRIPT,
          join(packageRoot, 'dist', 'index.js'),
        ],
        directory,
        [0],
        undefined,
        packageVerificationEnv,
      );
      console.log(v2.stdout.toString().trim());
    }
    const overLimitRulebook = join(
      directory,
      '.cc-safety-net',
      'rules',
      'package-limits',
      'rulebook.json',
    );
    mkdirSync(resolve(overLimitRulebook, '..'), { recursive: true });
    writeFileSync(
      overLimitRulebook,
      JSON.stringify({
        rulebook_version: 1,
        name: 'package-limits',
        version: '1.0.0',
        allowed_commands: ['echo'],
        rules: [
          {
            name: 'oversized',
            command: 'echo',
            block_args: Array(1_025).fill('TOPSECRET'),
            reason: 'TOPSECRET',
          },
        ],
        tests: [{ command: 'echo TOPSECRET', expect: 'blocked', rule: 'oversized' }],
      }),
    );
    writeFileSync(
      join(directory, '.cc-safety-net', 'rules', 'rule.json'),
      JSON.stringify({ version: 1, rules: ['package-limits'] }),
    );
    const ruleLimitResult = run(['node', cli, 'rule', 'verify'], directory, [1]);
    const ruleLimitOutput = `${ruleLimitResult.stdout.toString()}${ruleLimitResult.stderr.toString()}`;
    if (
      !ruleLimitOutput.includes("Rulebook exceeds CC Safety Net's safe validation limits.") ||
      ruleLimitOutput.includes('TOPSECRET')
    ) {
      throw new Error('Packed CLI did not fail closed on an over-limit rulebook');
    }
    const sourceLimitConfig = join(directory, '.cc-safety-net', 'rules', 'rule.json');
    const sourceLimitSentinel = join(directory, 'source-limit-sentinel');
    const sourceLimitNetworkSentinel = join(directory, 'source-limit-network-sentinel');
    const sourceLimitNetworkGuard = join(directory, 'source-limit-network-guard.mjs');
    writeFileSync(
      sourceLimitConfig,
      JSON.stringify({
        version: 1,
        rules: [
          ...Array.from({ length: 64 }, (_, index) => `owner/repo#main/package-${index}`),
          'owner/repo#main/TOPSECRET',
        ],
      }),
    );
    writeFileSync(sourceLimitSentinel, 'unchanged');
    writeFileSync(
      sourceLimitNetworkGuard,
      `import { writeFileSync } from 'node:fs';\nglobalThis.fetch = () => { writeFileSync(${JSON.stringify(sourceLimitNetworkSentinel)}, 'unexpected'); throw new Error('unexpected package verification network'); };\n`,
    );
    const sourceLimitResult = run(
      ['node', '--import', pathToFileURL(sourceLimitNetworkGuard).href, cli, 'rule', 'verify'],
      directory,
      [1],
    );
    const sourceLimitOutput = `${sourceLimitResult.stdout.toString()}${sourceLimitResult.stderr.toString()}`;
    if (
      !sourceLimitOutput.includes("Rule config exceeds CC Safety Net's safe source limit.") ||
      sourceLimitOutput.includes('TOPSECRET') ||
      readFileSync(sourceLimitSentinel, 'utf8') !== 'unchanged' ||
      existsSync(sourceLimitNetworkSentinel) ||
      existsSync(join(directory, '.cc-safety-net', 'rules', 'rule.lock')) ||
      existsSync(join(directory, '.cc-safety-net', 'cache'))
    ) {
      throw new Error('Packed CLI did not fail closed on an over-limit source config');
    }
    rmSync(sourceLimitConfig);
    for (const args of [['--version'], ['--help']]) {
      run(['node', cli, ...args], directory);
    }
    if (
      !run(['node', cli, 'explain', '--json', 'git status'], directory).stdout.includes('allowed')
    ) {
      throw new Error('Packed CLI did not allow the safe explain command');
    }
    if (
      !run(['node', cli, 'explain', '--json', 'git reset --hard'], directory).stdout.includes(
        'blocked',
      )
    ) {
      throw new Error('Packed CLI did not block the destructive explain command');
    }
    const aliasConfigReason =
      'Git aliases supplied through command-line or environment config can hide or execute commands. Run git without Git alias overrides, or ask the user to run it manually.';
    for (const command of ['GIT_CONFIG_COUNT=1025 git status', 'GIT_CONFIG_COUNT=1 git status']) {
      const output = JSON.parse(
        run(
          ['node', cli, 'hook', '--coding-cli'],
          directory,
          [0],
          JSON.stringify({
            session_id: 'package-verification',
            cwd: directory,
            hook_event_name: 'PreToolUse',
            tool_name: 'Bash',
            tool_input: { command },
          }),
          packageVerificationEnv,
        ).stdout.toString(),
      ) as {
        hookSpecificOutput?: { permissionDecision?: string; permissionDecisionReason?: string };
      };
      if (
        output.hookSpecificOutput?.permissionDecision !== 'deny' ||
        output.hookSpecificOutput.permissionDecisionReason !==
          `BLOCKED by CC Safety Net\n\nReason: ${aliasConfigReason}\n\nRule: git.alias-config\n\nCommand: ${command}\n\nIf this operation is truly needed, ask the user for explicit permission and have them run the command manually.`
      ) {
        throw new Error(`Packed CLI did not fail closed on incomplete Git config: ${command}`);
      }
    }
    const largeSafeCommand = `'git push ${'x '.repeat(45_000)}'`;
    const largeSafeResult = run(
      [
        'node',
        '--input-type=module',
        '--eval',
        "import { pathToFileURL } from 'node:url'; let command = ''; for await (const chunk of process.stdin) command += chunk; const cli = process.argv[1]; process.argv = ['node', cli, 'explain', '--json', command]; await import(pathToFileURL(cli).href)",
        cli,
      ],
      directory,
      [0],
      largeSafeCommand,
    );
    if (!largeSafeResult.stdout.includes('allowed')) {
      throw new Error('Packed CLI did not allow the large safe explain command');
    }

    const evalModule = (source: string, expected = 0) =>
      run(['node', '--input-type=module', '--eval', source], directory, [expected]);
    evalModule(
      "import * as api from 'cc-safety-net'; if (Object.keys(api).join() !== 'CCSafetyNetPlugin,default') process.exit(2)",
    );
    evalModule(
      "import root from 'cc-safety-net'; import v2 from 'cc-safety-net/opencode/v2'; if (v2 !== root || typeof v2.effect !== 'function' || typeof v2.server !== 'function') process.exit(2)",
    );
    run(['node', '--eval', "require('cc-safety-net')"], directory, [1]);
    evalModule("import 'cc-safety-net/dist/index.js'", 1);
    evalModule(`
      import { createRequire } from 'node:module';
      import { dirname, resolve } from 'node:path';
      import { pathToFileURL } from 'node:url';
      const require = createRequire(import.meta.url);
      const packageRoot = dirname(require.resolve('cc-safety-net/package.json'));
      const manifest = require(resolve(packageRoot, 'package.json'));
      if (manifest.dependencies !== undefined) process.exit(4);
      if (manifest.peerDependencies['@opencode-ai/plugin'] !== '^1.18.29') process.exit(5);
      if (!manifest.peerDependenciesMeta['@opencode-ai/plugin'].optional) process.exit(6);
      const extension = manifest.pi.extensions[0];
      if (extension !== './dist/pi/index.js') process.exit(2);
      const loaded = await import(pathToFileURL(resolve(packageRoot, extension)).href);
      if (typeof loaded.default !== 'function') process.exit(3);
    `);

    const pluginConsumer = writeTypeScriptConsumer(
      directory,
      "import { CCSafetyNetPlugin } from 'cc-safety-net';\nvoid CCSafetyNetPlugin;\n",
    );
    run([join(directory, 'node_modules', '.bin', 'tsc'), '--project', pluginConsumer], directory);

    evalModule(
      "import * as api from 'cc-safety-net/api'; if (Object.keys(api).join() !== 'checkCommand') process.exit(2)",
    );
    const apiAuditHome = join(directory, 'api-audit-home');
    run(
      [
        'node',
        '--input-type=module',
        '--eval',
        `
          import { checkCommand } from 'cc-safety-net/api';
          const allow = checkCommand({ command: 'git status', cwd: process.cwd() });
          if (allow.kind !== 'allow') process.exit(2);
          const deny = checkCommand({ command: 'git reset --hard', cwd: process.cwd() });
          if (deny.kind !== 'deny') process.exit(3);
          if (deny.ruleId !== 'git.reset-hard') process.exit(4);
        `,
      ],
      directory,
      [0],
      undefined,
      { ...packageVerificationEnv, CC_SAFETY_NET_AUDIT_HOME: apiAuditHome },
    );
    if (existsSync(apiAuditHome)) {
      throw new Error('Packed library API wrote audit data');
    }
    verifyIsolatedConsumers(tarball);
    console.log(`Verified ${basename(tarball)} (${result.size} bytes)`);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function verifyIsolatedConsumers(tarball: string): void {
  for (const fixture of [
    {
      peers: [],
      absent: ['@opencode-ai/plugin', '@opencode/plugin'],
      source:
        "import { checkCommand, type CheckCommandResult } from 'cc-safety-net/api';\nconst result: CheckCommandResult = checkCommand({ command: 'git status', cwd: '/tmp' });\nvoid result;\n",
    },
    {
      peers: ['@opencode-ai/plugin@1.18.29'],
      absent: ['@opencode/plugin'],
      source:
        "import plugin, { CCSafetyNetPlugin } from 'cc-safety-net';\nimport type { Plugin } from '@opencode-ai/plugin';\nconst named: Plugin = CCSafetyNetPlugin;\nconst server: Plugin = plugin.server;\nvoid named; void server;\n",
    },
    {
      peers: ['@opencode/plugin@2.0.6', '@types/json-schema'],
      absent: ['@opencode-ai/plugin'],
      source:
        "import plugin from 'cc-safety-net/opencode/v2';\nimport type { Plugin } from '@opencode/plugin/effect/plugin';\nconst registered: Plugin = plugin;\nvoid registered;\n",
    },
  ].filter(
    (fixture) =>
      !SKIP_OPENCODE_V2_PEER_INSTALL_ON_WINDOWS ||
      !fixture.peers.some((peer) => peer.startsWith('@opencode/plugin@')),
  )) {
    const directory = mkdtempSync(join(tmpdir(), 'cc-safety-net-consumer-'));
    try {
      run(['npm', 'init', '--yes'], directory);
      run(
        [
          'npm',
          'install',
          '--ignore-scripts',
          '--no-audit',
          '--no-fund',
          '--omit=optional',
          tarball,
          '@types/node@18',
          'typescript@5',
          ...fixture.peers,
        ],
        directory,
      );
      for (const peer of fixture.absent) {
        run(['node', '--eval', `require.resolve('${peer}')`], directory, [1]);
      }
      const consumer = writeTypeScriptConsumer(directory, fixture.source);
      run([join(directory, 'node_modules', '.bin', 'tsc'), '--project', consumer], directory);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }
}

function verifyInstalledProtectionJourneys(options: {
  directory: string;
  cli: string;
  pi: string;
  deepSeekHarness: string;
  openCode: string;
  amp: string;
  env: Record<string, string | undefined>;
}) {
  const cliSafe = runPackedCliHook(options, 'git status', 'package-cli-safe');
  if (cliSafe !== null) throw new Error('Packed CLI blocked git status');

  const cliReset = runPackedCliHook(options, 'git reset --hard', 'package-cli-reset');
  const cliHookOutput = cliReset?.hookSpecificOutput as Record<string, unknown> | undefined;
  if (
    cliHookOutput?.permissionDecision !== 'deny' ||
    !String(cliHookOutput.permissionDecisionReason).includes('git.reset-hard')
  ) {
    throw new Error('Packed CLI did not block git reset --hard');
  }

  for (const [name, command] of [
    ['xargs positional input', `find src -type f | xargs sh -c 'wc -l "$1"' _`],
    ['Parallel literal shell source', `parallel sh -c 'printf safe' ::: job`],
    ['literal stdin-to-shell flow', `printf '%s\\n' 'printf safe' | sh`],
    [
      'heredoc-created safe script',
      `cat > ./ccsn-package-script.sh <<'EOF'\nprintf safe\nEOF\nsh ./ccsn-package-script.sh`,
    ],
  ] as const) {
    if (runPackedCliHook(options, command, `package-cli-allowed-${name}`) !== null) {
      throw new Error(`Packed CLI blocked safe ${name}`);
    }
  }

  for (const [name, command, ruleId] of [
    [
      'xargs source execution',
      `printf '%s\\n' 'git reset --hard' | xargs sh -c`,
      'xargs.shell-dynamic',
    ],
    [
      'Parallel source execution',
      `parallel sh -c {} ::: 'git reset --hard'`,
      'parallel.shell-dynamic',
    ],
    [
      'literal stdin-to-shell execution',
      `printf '%s\\n' 'git reset --hard' | sh`,
      'git.reset-hard',
    ],
    [
      'heredoc-created script execution',
      `cat > ./ccsn-package-script.sh <<'EOF'\ngit reset --hard\nEOF\nsh ./ccsn-package-script.sh`,
      'git.reset-hard',
    ],
  ] as const) {
    const output = runPackedCliHook(options, command, `package-cli-blocked-${name}`);
    const hookOutput = output?.hookSpecificOutput as Record<string, unknown> | undefined;
    if (
      hookOutput?.permissionDecision !== 'deny' ||
      !String(hookOutput.permissionDecisionReason).includes(ruleId)
    ) {
      throw new Error(`Packed CLI did not block ${name} with ${ruleId}`);
    }
  }

  const piSafe = runPackedHost(
    options,
    options.pi,
    PI_HOST_SCRIPT,
    integrationToolRequest('package-pi-safe', 'git status'),
  );
  if (piSafe.result !== null) throw new Error('Packed Pi extension blocked git status');

  const piReset = runPackedHost(
    options,
    options.pi,
    PI_HOST_SCRIPT,
    integrationToolRequest('package-pi-reset', 'git reset --hard'),
  ).result as { block?: boolean; reason?: string } | undefined;
  if (piReset?.block !== true || !piReset.reason?.includes('git.reset-hard')) {
    throw new Error('Packed Pi extension did not block git reset --hard');
  }

  const deepSeekHarnessSafe = runPackedHost(
    options,
    options.deepSeekHarness,
    DEEPSEEK_HARNESS_HOST_SCRIPT,
    { command: 'git status', sessionId: 'package-dsh-safe' },
  );
  if (deepSeekHarnessSafe.guards !== 1 || deepSeekHarnessSafe.reason !== null) {
    throw new Error('Packed DeepSeek Harness bundle did not allow git status through one guard');
  }

  const deepSeekHarnessReset = runPackedHost(
    options,
    options.deepSeekHarness,
    DEEPSEEK_HARNESS_HOST_SCRIPT,
    { command: 'git reset --hard', sessionId: 'package-dsh-reset' },
  );
  if (!String(deepSeekHarnessReset.reason).includes('git.reset-hard')) {
    throw new Error('Packed DeepSeek Harness bundle did not block git reset --hard');
  }

  const openCodeSafe = runPackedHost(
    options,
    options.openCode,
    OPENCODE_HOST_SCRIPT,
    openCodeToolRequest('package-opencode-safe', 'git status'),
  );
  if (openCodeSafe.allowed !== true) throw new Error('Packed OpenCode plugin blocked git status');

  const openCodeReset = runPackedHost(
    options,
    options.openCode,
    OPENCODE_HOST_SCRIPT,
    openCodeToolRequest('package-opencode-reset', 'git reset --hard'),
  );
  if (openCodeReset.allowed !== false || !String(openCodeReset.reason).includes('git.reset-hard')) {
    throw new Error('Packed OpenCode plugin did not block git reset --hard');
  }

  const ampSafe = runPackedAmpHost(options, 'git status', 'package-amp-safe');
  if (ampSafe.action !== 'allow') throw new Error('Packed Amp plugin blocked git status');

  const ampReset = runPackedAmpHost(options, 'git reset --hard', 'package-amp-reset');
  if (
    ampReset.action !== 'reject-and-continue' ||
    !String(ampReset.message).includes('git.reset-hard')
  ) {
    throw new Error('Packed Amp plugin did not block git reset --hard');
  }
}

function deepSeekHarnessBundleModule(packageRoot: string): string {
  const manifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8')) as {
    dsh?: { bundle?: { patch?: string } };
  };
  const patch = join(packageRoot, manifest.dsh?.bundle?.patch ?? 'missing-dsh-bundle-patch');
  const rows = Bun.YAML.parse(readFileSync(patch, 'utf8')) as {
    insert?: { id?: string; name?: string }[];
  }[];
  const row = rows
    .flatMap((layer) => layer.insert ?? [])
    .find((entry) => entry.id === 'cc-safety-net');
  if (!row?.name)
    throw new Error(`Packed DeepSeek Harness bundle patch ${patch} has no cc-safety-net row`);
  return resolve(dirname(patch), row.name);
}

function runPackedAmpHost(
  options: { directory: string; amp: string; env: Record<string, string | undefined> },
  command: string,
  threadId: string,
) {
  const result = run(
    [process.execPath, '--eval', AMP_HOST_SCRIPT],
    options.directory,
    [0],
    JSON.stringify({
      artifact: options.amp,
      workspaceRoot: options.directory,
      command,
      threadId,
    }),
    options.env,
  );
  if (result.stderr.length > 0)
    throw new Error(`Packed Amp plugin wrote to stderr: ${result.stderr.toString()}`);
  return parsePackedJson('Packed Amp plugin', result.stdout) as Record<string, unknown>;
}

function runPackedCliHook(
  options: { directory: string; cli: string; env: Record<string, string | undefined> },
  command: string,
  sessionId: string,
) {
  const result = run(
    ['node', options.cli, 'hook', '--coding-cli'],
    options.directory,
    [0],
    JSON.stringify({
      hook_event_name: 'PreToolUse',
      session_id: sessionId,
      transcript_path: join(options.directory, 'home', '.claude', 'transcript.jsonl'),
      cwd: options.directory,
      tool_name: 'Bash',
      tool_input: { command },
    }),
    options.env,
  );
  if (result.stderr.length > 0)
    throw new Error(`Packed CLI wrote to stderr: ${result.stderr.toString()}`);
  return result.stdout.length === 0
    ? null
    : (parsePackedJson('Packed CLI', result.stdout) as Record<string, unknown>);
}

function runPackedHost(
  options: { directory: string; env: Record<string, string | undefined> },
  bundle: string,
  hostScript: string,
  input: unknown,
) {
  const result = run(
    ['node', '--input-type=module', '--eval', hostScript, bundle],
    options.directory,
    [0],
    JSON.stringify(input),
    options.env,
  );
  if (result.stderr.length > 0)
    throw new Error(`Packed integration wrote to stderr: ${result.stderr.toString()}`);
  return parsePackedJson('Packed integration', result.stdout) as Record<string, unknown>;
}

function integrationToolRequest(sessionId: string, command: string) {
  return {
    kind: 'tool_call',
    event: {
      type: 'tool_call',
      toolCallId: `${sessionId}-call`,
      toolName: 'bash',
      input: { command },
    },
    sessionId,
  };
}

function openCodeToolRequest(sessionId: string, command: string) {
  return { kind: 'tool', tool: 'bash', args: { command }, sessionId };
}

function parsePackedJson(label: string, output: Uint8Array) {
  try {
    return JSON.parse(output.toString()) as unknown;
  } catch (error) {
    throw new Error(`${label} returned invalid JSON: ${output.toString()}`, { cause: error });
  }
}

/** @internal */
export function getPackageVerificationEnv(directory: string): Record<string, string | undefined> {
  return {
    ...process.env,
    HOME: join(directory, 'home'),
    USERPROFILE: join(directory, 'home'),
    CC_SAFETY_NET_HOME: join(directory, '.cc-safety-net'),
    CC_SAFETY_NET_AUDIT_HOME: join(directory, 'audit-home'),
  };
}

export async function buildPackageTarball(options: BuildPackageTarballOptions) {
  if (options.gitHead && !/^[0-9a-f]{40}$/.test(options.gitHead)) {
    throw new Error(`gitHead must be a full commit SHA: ${options.gitHead}`);
  }
  const stagingDirectory = mkdtempSync(join(tmpdir(), 'cc-safety-net-pack-stage-'));
  try {
    cpSync('README.md', join(stagingDirectory, 'README.md'));
    cpSync('LICENSE', join(stagingDirectory, 'LICENSE'));
    cpSync('dist', join(stagingDirectory, 'dist'), { recursive: true });
    chmodSync(join(stagingDirectory, 'dist', 'bin', 'cc-safety-net.js'), 0o755);
    const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as Record<string, unknown>;
    delete manifest.gitHead;
    delete (manifest.scripts as Record<string, unknown>).prepare;
    writeFileSync(
      join(stagingDirectory, 'package.json'),
      `${JSON.stringify(options.gitHead ? { ...manifest, gitHead: options.gitHead } : manifest, null, 2)}\n`,
    );
    const packed = JSON.parse(
      run([
        ...(options.npmCommand ?? ['npm']),
        'pack',
        stagingDirectory,
        '--ignore-scripts',
        '--json',
        '--pack-destination',
        options.outputDirectory,
      ]).stdout.toString(),
    ) as PackResult[] | Record<string, PackResult>;
    const result = Array.isArray(packed) ? packed[0] : Object.values(packed)[0];
    if (!result) throw new Error('npm pack did not report an artifact');
    const tarball = resolve(options.outputDirectory, result.filename);
    const packedManifest = run(['tar', '-xOf', tarball, 'package/package.json']);
    const actualGitHead = (JSON.parse(packedManifest.stdout.toString()) as { gitHead?: string })
      .gitHead;
    if (actualGitHead !== options.gitHead) {
      throw new Error(
        `Packed gitHead mismatch: expected ${options.gitHead ?? 'absent'}, found ${actualGitHead ?? 'absent'}`,
      );
    }
    return { result, tarball };
  } finally {
    rmSync(stagingDirectory, { recursive: true, force: true });
  }
}

function throwMissingOutputDirectory(): never {
  throw new Error('--output requires a directory');
}

function throwMissingGitHead(): never {
  throw new Error('--git-head requires a full commit SHA');
}

if (import.meta.main) await verifyPackage();
