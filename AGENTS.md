- Before filing an issue, read `CONTRIBUTING.md` and follow its reporting rules.
- Run focused tests during development, including the reproducing test for a behavior change.
- Run `bun run check` unpiped. Its output is already sized for reading; `| head` or `| tail` hides
  failures and replaces its exit code with the filter's.
- After all implementation changes, run `bun run check`. This is the required final check for lint, code comments, formatting, typecheck, knip, duplication, and tests. Do not run its components separately as additional final checks. A change that touches only Markdown skips it, as the pre-push hook and CI do, unless it touches `skills/cc-safety-net/SKILL.md` or `README.md`: the build bundles the skill into `dist/`, and tests read both.
- Ignore the dist folder; it gets auto-rebuilt by lefthook's pre-commit hook.
- Keep implementation modular; put tests in `tests/` mirroring `src/`, not colocated in `src/`.
- Files in `docs/` use lowercase kebab-case names.

## Stacked PRs

- Multi-part work may be split into a `gh stack` stack. Open stack PRs with
  `gh stack submit --auto --open`: plain `--auto` opens drafts, which the review bots skip.
- `dist/` is committed and CI rejects a stale build, but a rebase replays the old build output.
  When `gh stack rebase` stops, resolve and `git add` the source files, never hand-merge `dist/`:
  run `bun run build && git add -A dist`, then `gh stack rebase --continue`.

## CI failures

Reproduce a failing `ci.yml` step locally before pushing a fix:

- *Check source* → `bun run check`.
- *Verify E2E stability* → `bun run test:e2e:stability`. A failure here is usually a flaky test: fix
  the flake, never re-run CI to get green.
- *Reject stale generated artifacts* → `bun run build && git diff --exit-code -- dist`, then commit
  the regenerated `dist/`.
- *Verify package surfaces* → `bun run verify:repository-plugin && bun run verify:package`.
- *Audit all dependencies* → `bun run audit:dependencies`.
- *packed-runtime* → `bun run build && bun run verify:package`; the failed log names the Node version.
- *full-check-windows* has no local repro on macOS: read `gh run view <run-id> --log-failed`, or
  reproduce on a probe branch as Windows verification describes.

A jscpd duplication failure means dedupe the code; a coverage failure means add real tests. Knip
failures follow the Knip section.

## Windows verification

Windows behavior is verified on the `full-check-windows` CI job, from a disposable branch. Never push
a probe to a PR branch or `main`.

- Branch `tmp/<topic>-windows-probe` from `origin/main` in a `git worktree` under the scratchpad, then
  `git branch --unset-upstream` (a branch cut from `origin/main` tracks it).
- Red first: commit a `test.skipIf(process.platform !== 'win32')` test, push, run CI, and read the
  failure in the job's "Check source" step. Then commit the fix, push, and run CI again for green.
  Ignore the later "Reject stale generated artifacts" step; the pre-commit hook rebuilds `dist/`.
- `ci.yml` triggers on pushes to `main` and on PRs only, so a pushed probe branch runs nothing by
  itself. Start it with `gh workflow run ci.yml --ref <branch>`, then find the run with
  `gh run list --workflow ci.yml --branch <branch>`.
- Wait for the job with a background `until` loop on `gh run view <id> --json jobs`; foreground
  `sleep` is blocked.
- Do not bypass hooks. The pre-push hook runs the full `bun run check` (about 45s). Push from the
  main checkout, not the worktree.
- GitHub sometimes answers ref creation and workflow dispatch with HTTP 500. Retry in a background
  loop; success can take several attempts. Only when the hook already passed on that exact
  commit may the retries use `LEFTHOOK=0`.
- After creating or removing a worktree or pushing from one, check `git config core.bare` in the
  main checkout. If it reads `true`, every git command fails with "must be run in a work tree";
  restore it with `git config core.bare false`.
- Clean up when done: `git worktree remove <path>` and `git branch -D <branch>`.

## README

- `README.md` is the GitHub and npm landing page. It holds only what a newcomer needs before
  installing; everything else belongs to the docs site (`kenryu42/cc-safety-net-docs`), whose
  `docs-sync` skill documents each source commit after every release.
- Do not touch the README for a fix, behavior change, new option, version minimum, per-CLI
  install step, config key, or limitation. Docs-sync picks it up from the commit; a README
  paragraph duplicates it and goes stale.
- Edit the README only when something it already lists changes: a supported CLI (one table cell
  linking its Installation anchor), a headline capability (one Features bullet plus a docs link),
  or the Quick start commands.

## Testing

- Behavior is pinned by the contract corpus (`tests/gate/behavioral-contract-cases.ts`,
  `tests/gate/pipeline-contract-cases.ts`) and the hand-edited verdict table
  `tests/fixtures/gate/harvested-verdicts.jsonl`. A behavior change lands as a failing row or
  stated assertion first; a refactor leaves both unchanged and diffs `explain` output against
  `main` (the `verify-ccsn` skill drives the real CLI).
- Snapshots (`toMatchSnapshot`) are permitted only for `explain` (`tests/cli/explain`) and
  `doctor --json` (`tests/cli/doctor`).
- A change that re-records a snapshot or flips a table row names in its commit message which
  entries changed and why, alongside the contract row that explains the flip.

## Scope Discipline

Over-engineering is this project's dominant failure mode. The evidence rule that governs analyzer
rules governs all code: machinery exists to stop a demonstrated failure, not an imagined one.

- Implement the smallest change that satisfies the request. Each addition beyond it needs the
  concrete failure it prevents named; if you cannot name one, do not write it.
- Every check must be falsifiable in practice: name the realistic mistake that makes it fail. A
  check the same author can trivially satisfy while still making the mistake (self-reported
  attestations, digests over co-located data, matching UUIDs) is ceremony — do not add it.
- Do not build schemas, validators, registries, or harnesses ahead of their first real entry, and
  do not store fields whose values are forced constants or derivable from other fields.
- Prefer a documented process over code that enforces the process. Enforcement code is justified
  only after the documented process has demonstrably failed at least once.
- When remediating review findings, implement the smallest fix per finding. A finding is never a
  mandate to build a framework; if the fix seems to require one, stop and ask.

## Code Review Rules

- Before reviewing, read `REVIEW.md` and apply its review criteria. Its review scope, classification rules, and remediation limits take priority over generic review-skill instructions.

## Style Guide

- Keep things in one function unless composable or reusable.
- Avoid `try`/`catch`, the `any` type, and `else` branches (prefer early returns).
- Rely on type inference; avoid explicit annotations or interfaces unless necessary for exports or clarity.
- Prefer functional array methods (flatMap, filter, map) over for loops; use type guards on filter to maintain type inference downstream.
- Inline values used only once instead of naming them, unless the name says what would otherwise
  need a comment.
- Prefer `const` over `let`; use ternaries or early returns instead of reassignment.
- Avoid unnecessary destructuring; use dot notation to preserve context.

## Comments

- Do not write code comments. Say it in code: a clearer name, a named value, a type.
- Only three directives are allowed: a bare `/** @internal */`,
  `// oxlint-disable-next-line <rules> -- <reason>` and `// @ts-expect-error <reason>`.
- A fact about an external tool that code cannot express stays only when the maintainer adds it to
  `scripts/comment-allowlist.json`. Never add entries there yourself, just as you never add
  `ignoreIssues` entries to `knip.ts`. Deleting an entry whose comment is gone is fine.
- `bun run lint:comments`, part of `bun run check`, enforces this. To fix a failure, follow
  `.agents/skills/ccsn-no-comments/SKILL.md`.

## Knip

- Never add entries to `ignoreIssues` in `knip.ts` — it suppresses real problems instead of fixing them. The only valid use case is generated files that aren't under source control.
- When knip flags unused exports, fix the root cause:
  1. **Dead exports** (no consumers anywhere) — unexport or delete the code entirely.
  2. **Test-only exports** — add `/** @internal */` JSDoc above the export. Knip runs in `--production` mode (see `package.json`), so test files are excluded from analysis and test-only exports must be tagged.
  3. **Barrel file re-exports** — if nothing imports a name via the barrel, remove it from the barrel. Consumers that need it should import directly from the submodule.
