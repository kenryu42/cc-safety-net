# Greenfield performance versus main

Measurements taken on 2026-09-10 comparing `main` at v2.3.4 (`e34ca61`) with `feat/greenfield`,
first at `7901eb8` and then with the hook-runtime changes recorded in the last section. Every
number below was measured, not estimated; the scripts that produced them are described under
"Method". Absolute times belong to the machine they were taken on and drift between runs, so the
tables that matter compare rows taken in the same interleaved run.

## Machine

- Linux container, 4 cores, 15 GB RAM, ephemeral disk.
- Node v22.22.2 (the runtime the published bins run under), Bun 1.4.2 (build and test runner).
- Bare `node -e ""` cost between 24 ms and 43 ms depending on the machine's state at the time; each
  table notes the value it saw.

## Hook invocation

The hook is the metric that matters: a fresh Node process per tool call, invoked exactly as
`hooks/hooks.json` does (`node dist/bin/cc-safety-net.js hook --coding-cli`), with an isolated
`HOME` and a fresh git repository as the working directory. Cells are the median of 30 runs after
three warm-ups unless stated otherwise. Decisions were checked to be identical across branches on
every scenario.

### main versus greenfield at `7901eb8`

Bare Node in this run: ~42 ms.

| Scenario | main p50 | greenfield p50 | Δ |
|---|---:|---:|---:|
| allow: `ls -la` | 189 ms | 117 ms | -38% |
| allow: `git status && bun test` | 197 ms | 127 ms | -36% |
| deny: `rm -rf /` | 174 ms | 114 ms | -34% |
| deny: `git push --force origin main` | 204 ms | 137 ms | -33% |
| complex pipeline with `find -exec rm` | 221 ms | 141 ms | -36% |
| secret read of `.env` | 185 ms | 112 ms | -39% |
| non-Bash tool (Edit) | 172 ms | 110 ms | -36% |
| `hook --codex` | 199 ms | 128 ms | -36% |

| Per invocation (median of 20) | main | greenfield |
|---|---:|---:|
| peak RSS | 73.0 MB | 61.3 MB |
| CPU, user + system | 240 ms | 137 ms |

Why: greenfield's bin resolved the `hook` verb before one dynamic import of the CLI, so the hook
path loaded about 350 KB of JavaScript instead of about 808 KB. Traced with a Node resolve hook:

| Loaded on the hook path | main | greenfield |
|---|---:|---:|
| `bin/cc-safety-net.js` | 475 KB | 17 KB |
| gate chunk | 323 KB | 328 KB |
| small chunk | 10 KB | 5 KB |
| CLI chunk (455 KB) | inlined in bin | lazy `import()` only for non-hook verbs |

### Three-way, after the hook-runtime changes

One interleaved run, 40 rounds per cell, bare Node ~40 ms. "Before" is `7901eb8`; "now" is the
tree described in the last section.

| Scenario | main | greenfield before | greenfield now | now vs before | now vs main |
|---|---:|---:|---:|---:|---:|
| allow `ls -la` | 195.0 ms | 119.6 ms | 84.8 ms | -29% | -57% |
| deny `rm -rf /` | 183.4 ms | 117.0 ms | 79.9 ms | -32% | -56% |
| `git status && bun test \| grep x` | 206.0 ms | 130.2 ms | 97.6 ms | -25% | -53% |

Time above bare Node on the allow path, which is the part the project controls: ~155 ms on main,
~80 ms before, ~45 ms now. The p90 tail tightened the same way: 229 ms, 128 ms, 89 ms.

| Per invocation (median of 20) | main | greenfield before | greenfield now |
|---|---:|---:|---:|
| peak RSS | 75.5 MB | 61.6 MB | 55.9 MB |
| CPU, user + system | 220 ms | 127 ms | 94 ms |

## Non-hook CLI and library entries

Between main and greenfield at `7901eb8` these were within noise: `--version` 162 vs 158 ms,
`status` 178 vs 169 ms, `explain` 191 vs 192 ms, `doctor` 476 vs 449 ms, `statusline` 173 vs
171 ms. They pay for the lazily loaded CLI chunk either way.

After the hook-runtime changes, before versus now, p50 of 25 interleaved runs:

| Command | before | now | Δ |
|---|---:|---:|---:|
| `--version` | 170.0 ms | 166.0 ms | -2% |
| `status` | 181.1 ms | 166.1 ms | -8% |
| `explain 'rm -rf node_modules'` | 207.4 ms | 189.6 ms | -9% |
| `doctor` | 465.1 ms | 447.0 ms | -4% |
| `statusline --claude-code` | 177.2 ms | 161.3 ms | -9% |
| `dist/api.js` `checkCommand` (ESM import) | 106.2 ms | 98.7 ms | -7% |
| `dist/index.js` import (OpenCode plugin) | 104.2 ms | 94.7 ms | -9% |

## In-process analyzer throughput

Through the public `checkCommand` API over a 30-command mix (10 denies), 3,000 decisions after a
warm-up, main versus greenfield at `7901eb8`:

| | main | greenfield |
|---|---:|---:|
| µs per decision | ~3,000 | ~1,500 |
| decisions per second | ~330 | ~670 |
| `api.js` import time | ~30 ms | ~29 ms |

Commit `68a4894` (memoized coding-CLI roots, no `win32.parse` on paths without a backslash)
accounts for most of this.

## Artifact and package size

| | main | greenfield `7901eb8` | greenfield now |
|---|---:|---:|---:|
| `dist/` total | 2.0 MB, 14 files | 1.7 MB, 14 files | 2.0 MB, 17 files |
| published bin (`dist/bin/cc-safety-net.js`) | 464 KB (124 KB gzip) | 16.5 KB (5 KB gzip) | 355 B loader + 329 KB `hook.js` |
| Amp / OpenClaw plugin bundles | 428 KB each | 314 KB each | 314 KB each |
| npm tarball / unpacked | 521 kB / 1.8 MB | 434 kB / 1.5 MB | 532 kB / 1.8 MB |
| runtime dependencies | 1 (zod 4.3.5) | 0 | 0 |
| clean `bun run build`, best of 3 | 1.56 s | 1.12 s | unchanged |

Removing zod (`fe8d4ab`) is the ~115 KB drop in every bundle that carries the gate. The growth in
the last column is the CommonJS hook bundle carrying its own copy of the gate beside the ESM
chunk the other entries share; see "Costs" below. The packed-size check caps the tarball at
560,000 bytes.

## Developer loop

Both suites run sequentially with nothing else competing for CPU, main versus greenfield at
`7901eb8`:

| | main | greenfield |
|---|---:|---:|
| `bun test` (excluding e2e-live) | 78.2 s; 5,100 pass, 1 fail, 37 skip; 199 files | 92.6 s; 3,506 pass, 0 fail, 2 skip; 200 files |
| `expect()` calls | 58,395 | 545,557 |
| `test:coverage` | 80.7 s | 86.9 s |
| line coverage | 98.53% | 96.14% |
| `lint:ci` | 1.02 s | 0.86 s |
| `typecheck` | 2.32 s | 1.86 s |
| `knip` | 1.15 s | 0.95 s |
| `check-duplicates` | 0.36 s | 0.28 s |

The one failure on main is `tests/integrations/hermes-agent/install.test.ts` ("kills the whole
analyzer process tree when the analysis times out"), which main's own history marks as
environment-dependent.

One file explains the suite-time gap. Per-file profiling (each file run alone, so about 150 ms of
bun start-up is included per file):

- `tests/gate/harvested.test.ts` on greenfield takes 30.4 s: 6,964 harvested literals replayed
  through the gate at two places and two levels. It is pure CPU and scales with single-core speed.
- main's slowest files are subprocess-heavy: `e2e/protection.test.ts` 12.6 s,
  `cli/install/update.test.ts` 8.3 s, `integrations/install/hook-install.test.ts` 6.2 s.
  Greenfield's counterparts take 8.8 s, 1.2 s, and do not exist.
- Excluding the harvested replay, greenfield's per-file sum is ~67 s against main's ~94 s.

Greenfield's lower pass count and coverage come from folding about 1,600 small tests into the
harvested verdict table; that is a test-design change, not lost behaviour.

## CI wall clock

Latest completed `ci.yml` run on each branch at the time of measurement (main run 337,
greenfield run 348):

| Job | main | greenfield |
|---|---:|---:|
| full-check (ubuntu) | 1m48s | 1m45s |
| full-check-macos | 1m08s | 1m03s |
| full-check-windows | separate workflow | 3m16s |
| packed-runtime (windows) | 2m33s | 1m37s |
| whole run | 4m29s | 3m31s |

The Windows `verify:package` step went from 1m43s to 1m05s, consistent with the smaller package.

## Where the remaining hook time goes

A CPU profile of the `7901eb8` hook, before the changes below, split the ~75 ms above bare Node
roughly as: loading `node:crypto` and `node:child_process` at import ~18 ms, ES module loader
overhead versus CommonJS ~15 ms, compiling and evaluating the 328 KB gate chunk ~20 ms, and the
first-time execution of the gate itself (parse, analyze, sensitive-path checks, audit write, stdin
read) ~40 ms. The hook spawns no child process and opens nine files. The last bucket is cold-JIT
cost and only shrinks by doing less work or by not starting a fresh process.

Candidates measured and rejected:

| Variant | p50 (same run, shipped bin 131 ms) |
|---|---:|
| V8 startup snapshot, 7 MB blob per Node version | 97 ms |
| shipped bin run under Bun instead of Node | 101 ms |
| lazy `node:child_process` via `createRequire` | ~3 ms better than a static import |

The snapshot barely beats the cheap changes and Node warns that `child_process` is unverified in
user snapshots. A persistent daemon is the only route to the ~45 ms floor and was not pursued. The
lazy `child_process` load would need an exemption from the architecture rule that keeps
`createRequire` out of `core`, `gate` and `audit`; 3 ms did not justify it.

## Hook-runtime changes recorded here

Three changes landed on top of `7901eb8`, with the results in the three-way table above.

1. **`node:crypto` left the hook's static closure.** The audit id and the policy temp-file suffix
   come from a `Math.random` helper (`src/core/random-hex.ts`) that keeps the same sixteen-hex
   shape; both need uniqueness, not unpredictability, and the id is generated on every call, so a
   lazy load would have saved nothing. Pinned by `tests/entries/import-closure.test.ts`.
2. **Node's compile cache.** `dist/bin/cc-safety-net.js` is now a tiny CommonJS loader that calls
   `module.enableCompileCache` and then requires the bundle, so the bundle's bytecode is cached
   after the first run. The cache lives under the user's `.cc-safety-net` home rather than the
   shared temp directory. Worth 6 to 7 ms per run; the first run per home pays 15 to 30 ms once.
   A Node without the API runs uncached.
3. **CommonJS hook bundle.** `dist/bin/hook.js` is a self-contained CommonJS bundle of the hook
   path, under a `dist/bin/package.json` that marks the directory CommonJS inside the ESM package,
   so the pinned bin path keeps its name. The CLI sits behind the bundle's one dynamic import as
   the ESM `dist/cli.js` entry. Skipping the ES module loader is worth 13 to 15 ms per run.

### Costs

- The tarball grew from 434 kB to 532 kB, unpacked from 1.5 MB to 1.8 MB, because the CommonJS
  bundle carries its own copy of the gate beside the ESM chunk. Node cannot read named exports
  from Bun's CommonJS output (its export pattern is not recognized by the CommonJS export
  detector), so the ESM entries cannot share that bundle without hand-written facades; Bun cannot
  code-split CommonJS; and CommonJS cannot `require()` an ESM chunk on Node 18 or 20. The package
  already ships two other full copies of the gate in the Amp and OpenClaw artifacts.
- One ~220 KB compile-cache file per Node version accumulates under
  `~/.cc-safety-net/compile-cache`; nothing prunes files from Node versions no longer in use.
- `dist/bin/hook.js` dispatches every verb, so it was added to the invocation guard's entrypoint
  list; without that, `node dist/bin/hook.js policy apply` would have bypassed policy-apply
  protection.

## Method

- Hook and CLI timings: a Node script spawning each variant with `spawnSync`, stdin fed the hook
  JSON, wall time from `process.hrtime.bigint()`, variants interleaved per round so a slow moment
  slows every variant equally; medians reported.
- Memory and CPU: Python `os.wait4` resource usage of the spawned Node process.
- Module loads: a `node:module` `register` hook logging every resolved `dist/` URL.
- CPU profile: `node --cpu-prof` over an unminified CommonJS build, aggregated by inclusive time.
- Test suite: `AGENT=1 bun test tests --path-ignore-patterns 'tests/e2e-live/**'` and
  `bun run test:coverage`, each branch alone; per-file times from running each test file
  separately.
- CI: job step timestamps from the GitHub Actions API for the runs named above.
