import { afterAll, afterEach, beforeAll, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import pkg from '../../package.json';
import { buildRuntimeBundles } from '../../scripts/build-runtime';
import { normalizeDoctorJson } from '../helpers/doctor-json';
import {
  createTempRoot,
  isolatedSpawnEnv,
  normalize,
  removeTempRoots,
  rootFolds,
} from '../helpers/temp-home';

const NODE = (() => {
  const executable = Bun.which('node');
  if (executable) return executable;
  throw new Error('Node.js is required to run the built runtime bundles');
})();

const API_SCRIPT = `
  import { pathToFileURL } from 'node:url';
  const { checkCommand } = await import(pathToFileURL(process.argv[1]).href);
  console.log(
    JSON.stringify([
      checkCommand({ command: 'git reset --hard', cwd: process.cwd() }),
      checkCommand({ command: 'ls', cwd: process.cwd() }),
    ]),
  );
`;
const INDEX_SCRIPT = `
  import { pathToFileURL } from 'node:url';
  const module = await import(pathToFileURL(process.argv[1]).href);
  console.log(Object.keys(module).join(','));
`;

type Side = { root: string; home: string; project: string; outdir: string; bin: string };

type Outcome = { stdout: string; stderr: string; exitCode: number | null };

type Journey = {
  name: string;
  args: (side: Side) => string[];
  stdin?: (side: Side) => string;
  normalize?: (text: string) => string;
  check: (outcome: Outcome) => void;
};

const hookInput = (side: Side, command: string) =>
  JSON.stringify({
    hook_event_name: 'PreToolUse',
    session_id: 'packed',
    transcript_path: join(side.home, 'transcript.jsonl'),
    cwd: side.project,
    tool_name: 'Bash',
    tool_input: { command },
  });

const JOURNEYS: readonly Journey[] = [
  {
    name: 'the hook denies a destructive command',
    args: (side) => [side.bin, 'hook', '--claude-code'],
    stdin: (side) => hookInput(side, 'git reset --hard'),
    check: (outcome) => {
      expect(outcome.stdout).toContain('"permissionDecision":"deny"');
      expect(outcome.stdout).toContain('git.reset-hard');
    },
  },
  {
    name: 'the hook stays silent on a safe command',
    args: (side) => [side.bin, 'hook', '--claude-code'],
    stdin: (side) => hookInput(side, 'ls'),
    check: (outcome) => {
      expect(outcome.stdout).toBe('');
      expect(outcome.exitCode).toBe(0);
    },
  },
  {
    name: 'explain renders the blocked verdict',
    args: (side) => [side.bin, 'explain', 'git reset --hard'],
    check: (outcome) => {
      expect(outcome.stdout).toContain('Status: BLOCKED');
      expect(outcome.exitCode).toBe(0);
    },
  },
  {
    name: 'the bin reports the version the define substituted',
    args: (side) => [side.bin, '--version'],
    check: (outcome) => {
      expect(outcome.stdout).toBe(`${pkg.version}\n`);
    },
  },
  {
    name: 'status renders a report',
    args: (side) => [side.bin, 'status'],
    check: (outcome) => {
      expect(outcome.stdout).toContain('CC Safety Net');
      expect(outcome.exitCode).toBe(0);
    },
  },
  {
    name: 'doctor renders a parseable report',
    args: (side) => [side.bin, 'doctor', '--json', '--skip-update-check'],
    normalize: normalizeDoctorJson,
    check: (outcome) => {
      expect((JSON.parse(outcome.stdout) as { hooks: unknown[] }).hooks.length).toBeGreaterThan(0);
    },
  },
  {
    name: 'the api entry answers a deny and an allow',
    args: (side) => ['--input-type=module', '--eval', API_SCRIPT, join(side.outdir, 'api.js')],
    check: (outcome) => {
      const results = JSON.parse(outcome.stdout) as { kind: string; ruleId?: string }[];

      expect(results.map((result) => result.kind)).toEqual(['deny', 'allow']);
      expect(results[0]?.ruleId).toBe('git.reset-hard');
    },
  },
  {
    name: 'the index entry exports the OpenCode plugin',
    args: (side) => ['--input-type=module', '--eval', INDEX_SCRIPT, join(side.outdir, 'index.js')],
    check: (outcome) => {
      expect(outcome.stdout).toBe('CCSafetyNetPlugin\n');
    },
  },
];

const buildRoot = join(
  process.env.CC_SAFETY_NET_TEST_TMPDIR ?? tmpdir(),
  `packed-runtime-${process.pid}`,
);

beforeAll(async () => {
  mkdirSync(buildRoot, { recursive: true });
  expect((await buildRuntimeBundles(buildRoot)).success).toBeTrue();
}, 120_000);

afterAll(() => {
  rmSync(buildRoot, { recursive: true, force: true });
});

afterEach(() => {
  removeTempRoots();
});

function runSide(outdir: string, journey: Journey): Outcome {
  const root = createTempRoot('packed-ported-');
  const side = {
    root,
    home: join(root, 'home'),
    project: join(root, 'project'),
    outdir,
    bin: join(outdir, 'bin', 'cc-safety-net.js'),
  };
  mkdirSync(side.home, { recursive: true });
  mkdirSync(side.project, { recursive: true });
  const emptyBin = join(root, 'bin');
  mkdirSync(emptyBin, { recursive: true });
  const result = spawnSync(NODE, journey.args(side), {
    cwd: side.project,
    input: journey.stdin?.(side) ?? '',
    env: isolatedSpawnEnv(side.home, { PATH: emptyBin, TZ: 'UTC' }),
    encoding: 'utf-8',
    maxBuffer: 32 * 1024 * 1024,
  });
  const clean = (text: string) => {
    const spelled = normalize(text, [...rootFolds(root), ...rootFolds(outdir, '<dist>')]);
    return journey.normalize?.(spelled) ?? spelled;
  };
  return { stdout: clean(result.stdout), stderr: clean(result.stderr), exitCode: result.status };
}

for (const journey of JOURNEYS) {
  test(journey.name, () => {
    const outcome = runSide(buildRoot, journey);

    journey.check(outcome);
  }, 60_000);
}
