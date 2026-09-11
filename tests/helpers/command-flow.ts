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
import { snapshotTree, type TreeSpec, writeTree } from './fixture-tree';
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

export type FlowSpec = {
  seed?: TreeSpec;
  seedTmp?: TreeSpec;
  script?: readonly FakeScriptEntry[];
  extraCommands?: readonly string[];
  invoke: 'install' | 'uninstall' | 'update';
  args?: readonly string[];
  options?: (home: string) => FlowOptions;
};

async function runSide(spec: FlowSpec) {
  const root = createTempRoot('cc-safety-net-ported-flow-');
  const home = join(root, 'home');
  const tmp = join(root, 'tmp');
  mkdirSync(home, { recursive: true });
  mkdirSync(tmp, { recursive: true });
  writeTree(home, spec.seed ?? {});
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
  const exitCode = await withProcessEnv(isolationEnv(home, { ...fakeBin.env, TMPDIR: tmp }), () => {
    if (spec.invoke === 'update') return runUpdateCommand(args, callOptions);
    return runInstallCommand(spec.invoke, args, callOptions);
  }).finally(() => {
    process.chdir(previousCwd);
    console.error = reportedError;
    console.warn = reportedWarning;
  });

  return normalize(
    {
      exitCode,
      lines: output.text().split('\n'),
      errors,
      warnings,
      log: fakeBin.readLog().sort(),
      tree: snapshotHome(home),
      tmp: snapshotTree(tmp),
    },
    [[home, '<home>'], [root, '<root>'], [REPO_ROOT, '<repo>'], ...WINDOWS_SEPARATOR_FOLDS],
  );
}

export async function runFlowDifferential(spec: FlowSpec) {
  return runSide(spec);
}
