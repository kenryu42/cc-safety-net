import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  type RunInstallCommandOptions,
  runInstallCommand,
  runUpdateCommand,
} from '@/cli/install/index';
import type { UpdateInfo } from '@/hosts/doctor-types';
import { createFakeBin, type FakeScriptEntry } from './fake-bin';
import { createFakeInput, createFakeOutput } from './fake-tty';
import { snapshotTree, type TreeSpec, withHomePlaceholder, writeTree } from './fixture-tree';
import { resolvePlaceholders } from './host-differential';
import {
  createTempRoot,
  isolationEnv,
  normalize,
  snapshotHome,
  WINDOWS_SEPARATOR_FOLDS,
  withProcessEnv,
} from './temp-home';

const REPO_ROOT = join(import.meta.dir, '..', '..');

export type FlowOptions = Omit<RunInstallCommandOptions, 'input' | 'output'> & {
  showBanner?: boolean;
  checkLatestVersion?: () => Promise<UpdateInfo>;
  scriptPath?: string;
};

type Invocation = 'install' | 'uninstall' | 'update';

export type FlowSpec = {
  seed?: TreeSpec;
  seedTmp?: TreeSpec;
  env?: Record<string, string>;
  script?: readonly FakeScriptEntry[];
  extraCommands?: readonly string[];
  invoke: Invocation | readonly Invocation[];
  args?: readonly string[];
  options?: (home: string) => FlowOptions;
};

export function openCodeV2Script(
  row = 'cc-safety-net  2.4.2  cc-safety-net@latest',
  addStdout = 'Plugin "cc-safety-net@latest" installed and added to <home>/.config/opencode/opencode.json\n',
) {
  return [
    { command: 'opencode', args: ['--version'], stdout: '2.0.6\n' },
    { command: 'opencode', args: ['plugin', 'add', 'cc-safety-net@latest'], stdout: addStdout },
    { command: 'opencode', args: ['plugin', 'update', 'cc-safety-net@latest'] },
    { command: 'opencode', args: ['plugin', 'list'], stdout: `ID  VERSION  SOURCE\n${row}\n` },
    { command: 'opencode', args: ['api', 'integration.list'] },
    {
      command: 'opencode',
      args: ['api', 'plugin.list'],
      stdout: JSON.stringify({
        location: { directory: '/x' },
        data: [
          {
            id: 'cc-safety-net',
            source: { type: 'package', target: 'cc-safety-net@latest' },
            features: { server: true },
            state: { status: 'active' },
          },
        ],
      }),
    },
  ];
}

export async function runSide(spec: FlowSpec) {
  const root = createTempRoot('cc-safety-net-ported-flow-');
  const home = join(root, 'home');
  const tmp = join(root, 'tmp');
  mkdirSync(home, { recursive: true });
  mkdirSync(tmp, { recursive: true });
  writeTree(home, withHomePlaceholder(spec.seed ?? {}, home));
  writeTree(tmp, spec.seedTmp ?? {});
  const fakeBin = createFakeBin(
    root,
    JSON.parse(
      JSON.stringify(spec.script ?? [])
        .replaceAll('<home>', JSON.stringify(home).slice(1, -1))
        .replaceAll('<root>', JSON.stringify(root).slice(1, -1)),
    ) as FakeScriptEntry[],
    spec.extraCommands,
  );

  const output = createFakeOutput({ isTTY: false });
  const errors: string[] = [];
  const warnings: string[] = [];
  const reportedError = console.error;
  const reportedWarning = console.warn;
  console.error = (...args: unknown[]) => {
    errors.push(args.map((arg) => String(arg)).join(' '));
  };
  console.warn = (...args: unknown[]) => {
    warnings.push(args.map((arg) => String(arg)).join(' '));
  };
  const callOptions = {
    input: createFakeInput({ isTTY: false }) as unknown as NodeJS.ReadStream,
    output: output as unknown as NodeJS.WriteStream,
    ...spec.options?.(home),
  };
  const args = spec.args ?? [];
  const previousCwd = process.cwd();
  process.chdir(root);
  const reportedCwd = process.cwd();
  const run = (invoke: Invocation) =>
    invoke === 'update'
      ? runUpdateCommand(args, callOptions)
      : runInstallCommand(invoke, args, callOptions);
  const exitCodes = await withProcessEnv(
    isolationEnv(home, {
      ...fakeBin.env,
      TMPDIR: tmp,
      ...resolvePlaceholders(spec.env, home),
    }),
    () =>
      [spec.invoke]
        .flat()
        .reduce<Promise<number[]>>(
          async (codes, invoke) => [...(await codes), await run(invoke)],
          Promise.resolve([]),
        ),
  ).finally(() => {
    process.chdir(previousCwd);
    console.error = reportedError;
    console.warn = reportedWarning;
  });

  const pathFolds = [
    [home, '<home>'],
    [reportedCwd, '<root>'],
    [root, '<root>'],
    [REPO_ROOT, '<repo>'],
  ] as const;
  return {
    ...normalize(
      {
        exitCode: typeof spec.invoke === 'string' ? exitCodes[0] : exitCodes,
        lines: output.text().split('\n'),
        errors,
        warnings,
        log: fakeBin.readLog().sort(),
      },
      [...pathFolds, ...WINDOWS_SEPARATOR_FOLDS],
    ),
    tree: normalize(snapshotHome(home), pathFolds),
    tmp: normalize(snapshotTree(tmp), pathFolds),
  };
}
