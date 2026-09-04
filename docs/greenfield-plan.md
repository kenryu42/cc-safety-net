# Greenfield construction plan

The goal of the `feat/greenfield` branch is to rebuild cc-safety-net from the behavioral contract
in [greenfield-contract.md](greenfield-contract.md) according to the amended design in
[greenfield-design.md](greenfield-design.md), and to cut over in one commit once the new gate
passes every contract row. The branch is done when Phase 11 is complete.

Users should notice almost nothing: the CLI, denial text, host protocols, file formats, rule ids,
and audit layout are preserved. The visible deltas are a closed secret-protection gap
(an agent debugging a Git remote runs `cd ~` and then reads `.ssh/config`; that read becomes a
denial like `cat ~/.ssh/config`), `explain` agreeing with the hook, a leaner hook path, and a
timeout on the one Git subprocess.

## Branch rules

- The new implementation lives under `next/`. The old `src/` is read-only reference until cutover.
- Nothing under `next/` imports from `src/`. Phase 1 adds the architecture-test rule with the first
  file so the rule is falsifiable from day one.
- Structure-independent tests are shared and must pass on both implementations: the corpora in
  `tests/analyzer/behavioral-contract-cases.ts` and `tests/engine/pipeline-contract-cases.ts`, the
  rule-id snapshot in `tests/rules/rule-ids.snapshot.json`, `tests/e2e`, and
  `scripts/verify-package.ts`. The corpora import only types from the implementation; the reason
  strings, stage names, rule ids, and intents they assert are literal contract constants, so the
  `next/` harness (Phase 3) imports the same corpus files and the `next/` gate must reproduce those
  values verbatim. The cutover commit re-points the type imports and nothing else.
- While `src/` exists, every ported module under `next/` carries a differential test under
  `tests/next/` that feeds the same inputs (the corpus commands, fixed tables, a seeded fuzz) to
  the `src/` module and the `next/` module and asserts equal output. Existing test files are never
  copied (`jscpd` scans `tests/`); fresh domain tests cover only behavior the port changes. The
  cutover commit deletes the differential tests and re-points the legacy domain tests.
- `next/` is outside `knip` and `jscpd` until Phase 5 gives it real entries (`next/entries/`);
  until then `tsc` (`noUnusedLocals`) and the differential tests are the dead-code checks.
- A row marked `knownGap` runs as `test.failing` against `src/` and as a plain test against
  `next/`. The cutover commit removes the marker together with the `src/` run. Adding a row is the
  only way to change expected behavior.
- `src/`, `dist/`, and the shipped manifests stay untouched until cutover, so `main` can be merged
  into this branch at any time and every field fix is re-run against the corpus.
- The residual-risk boundary in `REVIEW.md` and `docs/residual-risk.md` governs `next/` exactly as
  it governs `src/`: no parser fidelity to chase a crafted standard-mode bypass.
- Every phase ends with `bun run check` green. Phases that change runtime behavior visible to a
  user (5, 7, 9, 11) also run the `verify-cc-safety-net` skill against an isolated home. Its
  evidence under `artifacts/verify/` is gitignored and local to the machine that ran it; the
  commit message of the phase records the run id and the check results.
- While the local bun is not the pinned 1.4.0, commits are made with `LEFTHOOK_EXCLUDE=build` so
  the pre-commit hook does not rebuild `dist/` from an unchanged `src/` under a different bun
  version. The knip and biome jobs still run; a contributor on bun 1.4.0 needs no override.
  Pushes from a root container use `LEFTHOOK_EXCLUDE=check`, because the pre-push job runs
  `bun run check` and the root-only failures below would reject the push; the check is run
  explicitly before every commit instead.
- In a container that runs as root, two pre-existing tests fail on `main` and on this branch
  alike: the GUI oversized-POST 413 test and the Hermes process-tree kill test are sensitive to the
  bun version or the sandbox (the container ships bun 1.3.11; the project pins 1.4.0). CI on a
  non-root runner with bun 1.4.0 is the gate for those. Before the `main` v2.3.3 merge eight more
  tests failed as root because they injected failures with `chmod`, which root ignores; `main`
  reworked those and they now pass. Everything else in `bun run check`, including the 90%
  coverage floor, must pass locally.

## Phases

Status legend: `[ ]` pending, `[~]` in progress, `[x]` done. Complexity: S, M, L, XL.

### Phase 0 — Contract capture (S) `[x]`

- Route the analyzer corpus through `evaluateGuard`
  (`tests/engine/behavioral-contract-pipeline.test.ts`) so the guard stages sit in front of
  analysis for every row.
- Add pipeline-only rows (`tests/engine/pipeline-contract-cases.ts`): secret protection through
  the shell and through read tools, the metadata-only relaxation at standard versus strict, user
  and project policy-file protection, the `policy apply` invocation block, Git metadata through
  `rm`, redirections, and write tools, tool routing, and fail-closed blank input.
- Mark the reproduced secret-walk gap as `knownGap` (`test.failing`).
- Add the additive-only rule-id snapshot (`tests/rules/rule-id-snapshot.test.ts`,
  `tests/rules/rule-ids.snapshot.json`: 59 destructive records with intent, catastrophic flag,
  and activation gate; 134 secret records with the default-off tier).
- Land the contract, the amended design, and this plan under `docs/`.
- Acceptance: `bun run check` green; the known-gap row fails as expected against `src/`.
- Already covered elsewhere and therefore not duplicated: host payload and response goldens
  (`tests/integrations/hook/routing.test.ts`, `tests/e2e/protection.test.ts`), denial-frame
  goldens (`tests/integrations/format.test.ts`), explain trace goldens
  (`tests/cli/explain/trace-golden.test.ts`), doctor finding ids (`tests/cli/doctor/findings.test.ts`).

### Phase 1 — Core services (L) `[x]`

- `next/core/`: shell parser and command tree (words with text, raw, quoted, provenance; nested
  programs; heredocs with live substitutions; statuses complete, partial, invalid, limited;
  PowerShell subset with command-position auto-detection), one `Budget` with named counters,
  the environment seam (`env`, `home`, `tmpdir`, `realpath`, `entryKind`, `gitMetadata(cwd)`,
  `worktreeFacts(cwd)` with a spawn timeout), safe file I/O (symlink-refusing identity-checked
  reads, atomic writes, JSONC and TOML surgical edits), redaction, the denial renderer, and the
  rule catalog (59 destructive records, 134 secret records, the v1 and v2 custom-rule compiler).
- Decisions settled: the word model stays as shipped (text, raw, span, provenance, quoted
  boolean, parts) because no consumer needs more; the PowerShell subset is exactly what ships;
  parser caps stay parser limits that yield status `limited`; brace overflow, the Git config
  count, and `env -S` overflow stay rule-visible, every other breach throws `AnalysisLimit`.
- Layout: `next/core/shell/` (model, parse, posix, powershell, heredoc, traversal, tokens,
  projection), `next/core/tool-input.ts`, `next/core/budget.ts`, `next/core/environment.ts`,
  `next/core/paths/`, `next/core/git/`, `next/core/io/`, `next/core/redaction.ts`,
  `next/core/denial.ts`, `next/core/decision.ts`, `next/core/rules/`. Imports use the
  `@next/*` alias, re-pointed to `@/*` at cutover.
- Validation: parser domain tests per construct; property test "any string under the caps yields
  a status and never throws except `AnalysisLimit`"; redaction goldens; budget breach per counter.
- Acceptance: the parser assigns the expected status to every corpus command; the architecture
  test enforces `next/` never imports `src/`.
- Risk: the parser is the product's largest liability; every added case needs a corpus row on
  both sides of the standard-allow / strict-deny line.
- Landed: every module is a verbatim port with differential tests against `src/` (both corpora,
  fixed tables, seeded fuzz). Named deviations: `worktreeFacts` yields null (no relaxation) on any
  spawn failure, timeout, or unexpected exit status; the `LIMITS` table gives the analyzer-work
  breaches an error code and collapses their wording to the two documented reasons plus recursion
  depth; `resolveProtectedGitMetadata` takes one cwd. Carried to Phase 3: union
  `gitMetadata(execDir)` and `gitMetadata(policyDir)` when they differ; port
  `src/analyzer/git/env.ts` (import `isGitConfigEnvName` from `next/core/git/worktree.ts`) and
  `normalizeProtectedFileCandidate`; the effective-rule filter (`filterDestructiveCommandMatch`,
  `resolveEffectiveDestructiveCommandRules`, `createCommandAnalysisPolicy`) belongs to Phase 2 or 3.

### Phase 2 — Policy loader (M) `[x]`

- `next/core/policy/`: defaults, user `policy.json` with section-wise salvage, project
  `policy.json` merge and weakening lines, both `rule.json` files (a malformed file drops its
  scope; user scope claims rulebook names first), live rulebooks (v1 and v2 schema, name match,
  vendored-only), environment variables (level raises only; capability flags force on),
  capability provenance, and a `retentionDays` projection. The salvage normalizer reports the
  sections it dropped; schema diagnostics run only on diagnostic surfaces.
- Validation: the fallback matrix in `docs/config-recovery.md` as a table test.
- Acceptance: every degraded case yields the documented fallback and reason; one reader serves
  the gate, the CLI, the GUI, `policy check`, and audit retention.
- Phase 2 landed: `next/core/policy/` is a verbatim port with differential tests; the hot path validates `policy.json`, `rule.json` and rulebooks with hand-written checkers in `validate.ts` that reproduce the zod diagnostics and their order, while `schema.ts` keeps the zod schemas for diagnostic surfaces only (architecture test: zod allowed in that one file, nothing else under `next/` imports it; a child-process probe proves the loader never loads zod). Named deviations: loader entries take the Environment first and a required `cwd` (no `process.cwd()` fallback); the default user home is `environment.home`; `policy.json` keeps its plain read while `rule.json` and rulebooks use the safe reader; `readRetentionDays` is a projection over the same salvaged read, with no snapshot field; `isInterpreterCommand` lives in `next/core/policy/transparent-wrappers.ts` with the four interpreter names as data.
- Effective-capability resolution (`env.ts`), effective destructive-rule state, the per-match filter and `resolveCommandAnalysisContext` live under `next/core/policy/`; Phase 3 imports them and `isInterpreterCommand` from there, and appends the remaining analyzer vocabulary to `next/core/rules/constants.ts` (Phase 2 added `COMMAND_PATTERN`, `MAX_REASON_LENGTH`, `SHELL_WRAPPERS`, `INTERPRETERS`, `PYTHON_INTERPRETER_PATTERN`, `AWK_INTERPRETERS`).
- Carried: `src/policy/diff.ts` and the GUI read/write/preview/repair helpers (Phases 7 and 9); `getRulesConfigRuntimeErrorsForConfig`, the rule.json and starter-rulebook writers, `sources.ts`, the sync budget, and the legacy config validators (Phase 8); lock and legacy path helpers (Phases 7/8); Phase 4 calls `readRetentionDays(environment, options)` at prune time.

### Phase 3 — Gate (XL) `[x]`

- `next/gate/`: intake (input caps, route table, three containment modes), the decision pipeline
  with a single catch boundary, the guard walk (`cd` and simple-assignment tracking) shared by
  the policy-file, policy-apply, Git-metadata, and secret guards, the secret matcher with its
  carrier extractors, and the destructive analyzer with one per-command dispatch (synthesized
  `xargs`, `parallel`, `find -exec`, and unknown-head children carry provenance), one wrapper
  peel, one text detector with a stop-rule parameter, worktree relaxation through the environment
  seam, the rule filter, and a trace sink.
- Validation: both corpora through `runPipeline` at standard and strict with an in-memory
  environment seam; fuzzing that no exception escapes the catch boundary; failure injection
  (seam errors, replaced files, oversized input, `toolInputTruncated`, 1,025 `GIT_CONFIG_COUNT`).
- Acceptance: 100% of corpus rows including the former known-gap rows; strict-unverifiable rows;
  every budget counter has a breach test.
- 3a landed (the verbatim port): `next/gate/` holds 53 files ported from the analyzer, guards,
  secret matcher, trace recorder, intake, and pipeline, each with a normalized-diff self-check
  and differential tests; both corpora run through the ported `evaluateGuard`; a harvested-literal
  differential replays every string literal in the legacy test suites at standard and strict;
  trace, tool-route, and failure-injection parity hold. Three review lenses and a re-review found
  no wrong port. Carried to 3b: the shared guard walk (the secret guard gains `cd` tracking, the
  known-gap row flips to a plain test against `next/`, and the harvested differential must
  classify that divergence class); budget unification (`createBudget()` is still called once per
  guard and the analyzer keeps its own derived, parallel, strip, recursion, heredoc, and
  control-flow caps); the trace sink through `evaluateGuard`; the `gitMetadata(execDir)` and
  `gitMetadata(policyDir)` union if the pipeline stage did not land it; `BUILTIN_ANALYZED_COMMANDS`
  duplicated between core and gate. Intake keeps two `statSync`/`accessSync` reads as the host
  boundary, and `process.platform` stays ambient as in `src/`.
- 3b landed (the design changes): the secret matcher walks with the scanner's exported
  `applyShellState`, so its candidates carry the tracked cwd while the evidence stays the operand;
  the walk tracks `cd` only (`cd -`, `pushd`/`popd`, subshell scoping and interpreter bodies are
  pinned as limits in `tests/next/gate/secret-walk.test.ts`; a subshell `cd` is tracked as leaking,
  as the scanner already does for the other three guards) and the metadata-only relaxation stays
  standalone-only. The known-gap row runs plain against `next/`; the harvested, secret-module and
  pipeline-corpus differentials classify the tracked-cwd divergence with one predicate
  (`deniedByTrackedCwd`) and pin the accepted inputs exactly (one input, `cd ~ && cat .ssh/config`).
- Budget: one `Budget` per `evaluateGuard`, threaded to the four guards, the secret matcher, the
  analyzer and its derived children (spy-tested per path); analyzer caps throw `AnalysisLimit{kind}`
  and `analyzeOrCapBreach` in `next/gate/analyzer/index.ts` maps the nine analyzer kinds to `src`'s
  wording with `GuardEvaluation.errorCode` (path-canonicalization kinds still fail closed);
  per-scope caps compare against `LIMITS` rather than charge; recursion depth stays a returned
  denial; `derivedCommandShape` added; no harvested outcome changed by the shared budget.
- Trace: `GuardOptions.trace` reaches the analyzer and the breach mapping; the guards record no
  steps by design; `next/gate/evaluate-command.ts` stays the analyzer-level trace oracle for `src`
  parity and is deleted at cutover with its differential tests; Phase 7 explain records `parse` and
  `segment-skipped` itself and runs `evaluateGuard` with the real dialect.
- Carried: subshell-scoped and `pushd`/`popd` tracking for the shared walk (a `src`-divergent
  scanner change for all four guards); `errorCode` on failed-closed evaluations for Phase 4's
  audit classification; the dispatch, peel and text-detector consolidations (no defect
  demonstrated in 3b); the dead segment-scoped branch of the breach mapping (a verbatim carry of
  `src`); ten `src` tests that fail only as root and one `next/` differential that needs an
  explicit per-test timeout on slow runners.

### Phase 4 — Audit (S) `[x]`

- `next/audit/`: writer (layout, caps, redaction of the four fields, 0600/0700, prune at most
  once per UTC day using `retentionDays` from the resolved snapshot), reader with filters and
  suspect detection.
- Acceptance: record goldens; concurrent appends; an unwritable directory never changes a decision.
- Landed: `next/audit/{writer,retention,reader,display}.ts` are verbatim ports of
  `src/engine/{audit,audit-retention,audit-scan,audit-display}.ts` behind the Environment seam:
  every entry takes the `Environment` first, `CC_SAFETY_NET_AUDIT_HOME` and the `NODE_ENV` test
  refusal read `environment.env`, the home is `environment.home` (no `homedir()`/`userInfo()`), the
  `homeDir` option is gone while `now`/`createId` stay injectable, and prune reads its window through
  `readRetentionDays(environment)`. The record types moved to `next/core/audit.ts`
  (`AuditErrorCode = AnalysisErrorCode | 'unexpected-error'`) so gate and audit share them through
  core; `tests/next/architecture.test.ts` enforces "audit imports only core; core and gate never
  import audit" for both import spellings. Differentials pin byte-identical trees for a fixed clock
  and id sequence, every cap (10,000/2,000/256/32,768, the 180-character encoded cwd, the
  128-character session id), four concurrently spawned appenders, an unwritable location, and the
  retention and reader sweeps over one fixture tree.
- Carried: `src/integrations/audit.ts` (Phase 5 maps the runtime's `homeDir` option onto the
  Environment; in `src/` an explicit `homeDir` bypassed `CC_SAFETY_NET_AUDIT_HOME` and the test
  refusal, in `next/` the Environment decides); the logs CLI with `matchesLogsFlags` and
  `--prune-legacy` (Phase 7); GUI activity (Phase 9); the `__PKG_VERSION__` define (Phase 10).

### Phase 5 — Entries and hosts (L) `[x]`

- `next/entries/`: the bin resolves the `hook` verb before importing anything else through one
  dynamic import of a second chunk; the pinned path `dist/bin/cc-safety-net.js` is preserved.
- `next/hosts/<id>/`: the Claude-shaped family (Claude Code, Codex, Kimi) with three explicit
  overrides (route table including PowerShell, cwd override key, transcript attribution), the
  other stdin adapters (Cursor, Gemini, Copilot, Antigravity, Grok Build, Hermes), and the four
  in-process entries (OpenClaw, OpenCode, Pi, Amp) sharing one helper. Every adapter renders its
  own fallback deny in its host's format.
- Acceptance: adapter contract tests (payload to envelope, decision to document bytes, throw to
  host-format deny, unsupported event to silence); a cold-start budget test on the hook path;
  git-checkout mode runs without `node_modules`; the verify skill's hook recipes pass.
- Phase 5 landed: `next/hosts/` (runner, audit projection, runtime, agent detection, eight stdin adapters for nine hosts, OpenClaw/OpenCode/Pi/Amp handlers, catalog and the cc-safety-net template as data) and `next/entries/` (bin with the hook verb and legacy top-level flags, hook table, args, library API, OpenCode/Pi/Amp export entries) are verbatim ports behind the Environment seam: one `createProcessEnvironment()` per call, environment-first audit and runtime signatures with the `homeDir` option gone (OpenCode's `homeDir` maps onto `environment.home`, so `CC_SAFETY_NET_AUDIT_HOME` and the test refusal now win over it), `AnalysisLimit` classified through `LIMITS[kind].errorCode`, adapter callbacks receiving the Environment last with `process.cwd()` read at the call site.
- Adopted: every stdin adapter and the OpenClaw/Pi/Amp handlers convert any thrown value into the host's own failed-closed deny (stderr `CC Safety Net error:` line, exit 0, no audit); OpenCode's deny form is already a throw. Type-only imports of `@opencode-ai/plugin` and `@ampcode/plugin` are allowed per file by the architecture test, which also enforces hosts -> gate/core/audit, no upward imports, and no http/https/net/child_process under hosts or entries.
- Validation: one shared per-host payload table drives the in-process adapter differential and the process-level bin differential (stdout bytes, exit code, audit lines minus ts/id); fake-host differentials for the four in-process entries and the library API; cold-start and git-checkout import-closure tests on `next/entries/bin.ts`.
- Carried: `amp/run.ts` with its install/native and system-info helpers and the OpenClaw export entry (Phase 6); the hook help listing, every other verb and the dynamic CLI chunk (Phase 7); `GuardEvaluation.errorCode` in the audit for returned analyzer-cap denials (parity with `src` kept); knip entries for `next/entries`, the jscpd scope for `next/`, the verify-skill hook run and the `dist/bin` wiring (Phase 10).
- Verified: the verify skill's hook-protection recipes (deny with `Rule: git.reset-hard`, allow with
  empty stdout and exit 0, the two audit entries, isolation of the real home) pass against
  `next/entries/bin.ts` under an isolated home, and the same destructive payload through every
  stdin flag yields bytes and exit codes identical to `src`. Full-suite coverage sits at 98.90%
  (threshold 90%); `next/entries/args.ts` is ported whole for Phase 7 and only `parseCommandArgs`
  is exercised so far.
- Merged from `main` (v2.3.3) after Phase 5: the native Codex hook (`--codex`, `-cx`; the
  Claude-shaped payload, `Bash` → auto, no transcript attribution) lives in
  `next/hosts/codex/hook.ts` over the shared `next/hosts/hook/pre-tool-use.ts` that Claude Code
  now also uses; the catalog's runtime rows, the hook table, the per-host differentials and the
  verify recipes carry it. The Windows guard fixes (PowerShell default dialect for unrouted tools,
  strict secret matching for PowerShell candidates, metadata-only `ls`/`stat` for unrouted
  PowerShell) are mirrored verbatim into `next/gate`; their win32-only branches are unreachable in
  the Linux differentials and rest on the normalized-diff self-check. `main` also replaced the
  chmod-based unreadable fixtures with spies, so `bun run check` as root now fails only the GUI
  413 and Hermes process-kill tests.


### Phase 6 — Installers and detectors (L) `[ ]`

- Thirteen installers and detectors with the managed hook command shared with each adapter;
  detection from host state files only; probes with a 5 s timeout; exact artifacts written
  atomically; npx and bunx cache clearing; the Hermes Python shim; the Amp hosted-repo write with
  the embedded policy; precise uninstall.
- Acceptance: fake host configs produce the exact artifacts, detect finds them, uninstall restores
  byte-identical files (JSON comment loss asserted); install is idempotent.
- From `main` v2.3.3: the Codex native plugin (`.codex-plugin/plugin.json`, `hooks/codex.json`
  running `node "${PLUGIN_ROOT}/dist/bin/cc-safety-net.js" hook --codex`, so the pinned bin path
  now has a third consumer) and the Hermes shim's Windows process-tree kill are part of the port
  source.

### Phase 7 — CLI diagnostics (M) `[ ]`

- `status`, `doctor` with stable finding ids and `--json`, `statusline` glyphs including the
  Claude settings probe, `explain` through the pipeline with a trace sink and the real dialect,
  `logs`, `rule verify` and `rule doc`, `policy check` and `policy apply` with the TTY gate.
- Acceptance: explain goldens; doctor JSON goldens; exit codes 0 and 1 only; every surface is a
  projection of one policy resolution; the verify skill's explain, diagnostics, and logs recipes pass.
- From `main` v2.3.3: `logs --project` matches with `relative`/`sep` rather than a `/` prefix.

### Phase 8 — Rulebook manager (M) `[ ]`

- `rule init`, `add`, `remove`, `update`, `list`, `wrapper`, with `migrate` and `sync` as edge
  shims; bounded GitHub fetch (64 sources, 4 concurrent, 131 requests, 64 MiB, 15 s, no
  redirects, per-response caps); vendoring through temp and rename; acceptance limits; fixtures
  evaluated through the pipeline.
- Acceptance: a fake server exercises every limit; nothing is written on failure; a post-change
  reload equals the gate's view.

### Phase 9 — GUI (M, optional) `[ ]`

- Loopback server, ephemeral port, token in the URL and the POST header, 1 MiB bodies, policy
  editor, activity feed, project draft with compare-and-swap, scrubbed false-positive report. The
  star, health, and install-from-GUI endpoints are deferred unless a demonstrated need appears.
- Acceptance: token and CSRF tests; CAS conflict; no core module imports the GUI; the verify
  skill's GUI recipe passes.

### Phase 10 — Build, verification, release (M) `[ ]`

- Bundles with no module-level work; committed `dist/` with the pinned entry paths; the
  verify-build allowlist updated; packed-tarball journeys on the six-cell matrix; the atomic
  release transaction retained; coverage, duplication, knip, and an import lint with cycle check
  and third-party ban that also flags `fetch`, `require`, and non-literal `import()` below the
  host layer.
- Acceptance: tarball at or under 560,000 bytes; the git-checkout plugin works without
  `node_modules`; CI green.
- From `main` v2.3.3: the release scripts validate the Codex manifest and hook file
  (`verify-repository-plugin.ts`, `release-state.ts`, `prepare-release-files.ts`), and CI runs
  `check:ci` on Windows and macOS, so `tests/next` must be portable before cutover: spawn through
  `process.execPath`, build child environments with `createSpawnEnv`, quote native paths in POSIX
  fixtures, and avoid `/`-joined path assertions.

### Phase 11 — Performance validation and cutover (S+M) `[ ]`

- Measure hook cold start before and after the lean entry and the validator removal on the CI
  runner; set a hook-path budget test.
- Cutover in one commit: swap the entries, delete `src/`, move `next/` to `src/`, rebuild
  `dist/`, keep structure-independent tests, retire structure-dependent legacy tests, drop the
  `LEFTHOOK_EXCLUDE=build` note.
- Run the `verify-cc-safety-net` skill against the cut-over CLI; draft release notes for the
  closed secret-walk gap.
- Acceptance: hook path at or under Node startup plus a fixed budget; all corpus rows including
  the former known-gap rows pass; release notes drafted.

## How to resume

1. `git checkout feat/greenfield && git merge main` (merge, never rebase, so the corpus re-runs
   against every field fix).
2. Read the phase status above; the status markers are the only record of progress.
3. Run `bun test tests/engine/behavioral-contract-pipeline.test.ts tests/rules/rule-id-snapshot.test.ts`
   to confirm the oracle is intact before touching `next/`.
4. Finish the phase, run `bun run check`, run the verify skill where the phase requires it,
   update the status marker here, commit (with `LEFTHOOK_EXCLUDE=build` unless on bun 1.4.0), and
   push to `feat/greenfield`.
