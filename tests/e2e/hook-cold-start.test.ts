import { afterAll, beforeAll, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { buildRuntimeBundles } from '../../scripts/build-runtime';
import { createTempRoot, isolatedSpawnEnv, removeTempRoots } from '../helpers/temp-home';

const NODE = Bun.which('node');
if (NODE === null) throw new Error('Node.js is required to measure the hook cold start');

const outdir = join(
  process.env.CC_SAFETY_NET_TEST_TMPDIR ?? tmpdir(),
  `hook-cold-start-${process.pid}`,
);
const bin = join(outdir, 'bin', 'cc-safety-net.js');

beforeAll(async () => {
  mkdirSync(outdir, { recursive: true });
  expect((await buildRuntimeBundles(outdir)).success).toBeTrue();
}, 120_000);

afterAll(() => {
  rmSync(outdir, { recursive: true, force: true });
  removeTempRoots();
});

const STATIC_SPECIFIER = /\b(?:from|import|require\s*\()\s*["']([^"']+)["']/g;

function staticClosure(path: string, seen = new Set<string>()): string[] {
  if (seen.has(path)) return [];
  seen.add(path);
  return [
    path,
    ...[...readFileSync(path, 'utf8').matchAll(STATIC_SPECIFIER)]
      .map((match) => match[1] ?? '')
      .filter((specifier) => specifier.startsWith('.'))
      .flatMap((specifier) => staticClosure(resolve(dirname(path), specifier), seen)),
  ];
}

test('the hook closure stays under 400,000 bytes', () => {
  const files = staticClosure(bin);
  const bytes = files.reduce((total, file) => total + Buffer.byteLength(readFileSync(file)), 0);

  expect(files.length).toBeGreaterThan(1);
  expect(bytes, `hook closure: ${bytes} bytes over ${files.length} files`).toBeLessThanOrEqual(
    400_000,
  );
});

test('the hook cold start stays within 150 ms of node itself', () => {
  const root = createTempRoot('hook-cold-start-');
  const home = join(root, 'home');
  const project = join(root, 'project');
  const emptyBin = join(root, 'bin');
  for (const directory of [home, project, emptyBin]) mkdirSync(directory, { recursive: true });
  const env = isolatedSpawnEnv(home, { PATH: emptyBin, TZ: 'UTC' });
  const payload = JSON.stringify({
    hook_event_name: 'PreToolUse',
    session_id: 'cold-start',
    transcript_path: join(home, 'transcript.jsonl'),
    cwd: project,
    tool_name: 'Bash',
    tool_input: { command: 'ls' },
  });
  const run = (args: string[], input: string) =>
    spawnSync(NODE, args, { cwd: project, input, env, encoding: 'utf-8' });

  const proof = run([bin, 'hook', '--claude-code'], payload);
  expect({ status: proof.status, stdout: proof.stdout }).toStrictEqual({ status: 0, stdout: '' });

  const elapsed = (args: string[], input: string) => {
    const started = performance.now();
    expect(run(args, input).status).toBe(0);
    return performance.now() - started;
  };
  const samples = Array.from({ length: 7 }, () => ({
    node: elapsed(['-e', '0'], ''),
    hook: elapsed([bin, 'hook', '--claude-code'], payload),
  }));
  const median = (values: number[]) => [...values].sort((a, b) => a - b)[3] ?? Number.NaN;
  const nodeMedian = median(samples.map((sample) => sample.node));
  const hookMedian = median(samples.map((sample) => sample.hook));

  expect(
    hookMedian,
    `cold start medians: node ${nodeMedian.toFixed(1)} ms, hook ${hookMedian.toFixed(1)} ms`,
  ).toBeLessThanOrEqual(nodeMedian + 150);
}, 60_000);
