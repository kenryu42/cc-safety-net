# Contributing to CC Safety Net

Bug reports, feature requests, and technical analysis are welcome through
[GitHub Issues](https://github.com/kenryu42/cc-safety-net/issues).

Pull request creation is restricted to invited collaborators. If you want
something fixed or improved, please describe the problem in an issue before
spending time on an implementation.

## Table of contents

- [Why pull requests are restricted](#why-pull-requests-are-restricted)
- [Reporting a bug](#reporting-a-bug)
- [Requesting a feature](#requesting-a-feature)
- [Code of conduct](#code-of-conduct)
- [Development setup](#development-setup)
  - [Prerequisites](#prerequisites)
  - [Install and build](#install-and-build)
  - [Testing your changes locally](#testing-your-changes-locally)
- [Development workflow](#development-workflow)
  - [Build commands](#build-commands)
  - [Conventions](#conventions)
- [Pull request process for invited collaborators](#pull-request-process-for-invited-collaborators)
- [Publishing](#publishing)
- [Getting help](#getting-help)

## Why pull requests are restricted

AI-generated submissions have increased the work required to review outside
contributions. A plausible patch still needs someone to verify the problem,
understand the changes, check their effects on the rest of the project, and
work through revisions.

I use coding agents to implement fixes myself. A detailed issue report often
helps me resolve a problem faster than reviewing and reworking an unsolicited
pull request. Reproduction steps and technical analysis are especially useful.

## Reporting a bug

Most issues are written by coding agents. Whether you are an agent or a person,
follow these rules:

- Search existing issues first (`gh issue list --search "<keywords>" --state all`).
  If the problem has already been reported, add new evidence to that issue
  instead of opening another.
- Report one problem per issue.
- Reproduce the problem on the latest release. Only describe a reproduction you
  actually ran; if you could not run it, say so.
- Lead with the problem and the evidence: what you did, what you expected, and
  what happened. Keep the report short.
- Include your CC Safety Net version, operating system, coding agent or CLI and
  its version, and how CC Safety Net is installed. `npx cc-safety-net doctor --json`
  covers most of this and shows whether custom rules are in play.
- Root-cause analysis is welcome. Put it after the evidence and label it as a
  hypothesis unless a test or a trace confirms it.
- Do not attach a patch or diff. Describe the fix you suggest in prose.
- Have the person you are working for review the issue before you submit it.

For an incorrect command decision, a destructive command that was allowed or a
safe one that was blocked, also include:

- The full command, including the whole chain, not just the segment that matched.
- The working directory and the safety level.
- The output of `npx cc-safety-net explain --cwd <dir> "<command>"`.
- For a block that already happened, the entry from `npx cc-safety-net logs`
  (`npx cc-safety-net logs --id <id> --json`).
- Why the decision should have been different.

A missed destructive command is a public bug, not a vulnerability. See
[SECURITY.md](SECURITY.md) for the few issues that must be reported privately.

Before you submit, remove credentials and tokens. Logs redact secrets but not
file paths: replace private directory names with `<project>` and `~`, keeping
the path structure intact so the command still reproduces.

## Requesting a feature

Explain the problem you need to solve, the behavior you want, and a concrete
example of where it would help. The rules above apply: search first, one
request per issue, and no patches.

CC Safety Net has a focused scope: preventing coding agents from making
accidental mistakes that cause data loss, such as `rm -rf ~/` or
`git reset --hard`. It is not a general security hardening tool or an attack
prevention system.

Requests for detection rules, configuration changes, documentation corrections,
and small bug fixes should all start with an issue. An accepted proposal does
not automatically authorize a pull request.

## Code of conduct

Be respectful and constructive. Keep reports focused on the problem and
provide enough information for someone else to investigate it.

## Development setup

This section is for invited collaborators and for anyone running a local build.

### Prerequisites

- **Bun** - Required build/test runtime and package manager ([install guide](https://bun.sh/docs/installation))
- **Node.js 22 or newer** - Supported runtime for built artifacts
- **Claude Code** or **OpenCode** - For testing the plugin

`package.json` defines the project Bun version in `packageManager`. CI, `bun run build`,
and Git hooks use that version automatically, independently of your global Bun version.
If it differs, the launcher downloads and caches the selected Bun through `bun x`;
this requires network access on first use or after cache eviction. To run another
command with the project runtime, use `bun scripts/project-bun.ts run check`.
To upgrade Bun, change `packageManager`, rebuild, and commit the regenerated artifacts.

### Install and build

```bash
# Clone the repository
git clone https://github.com/kenryu42/cc-safety-net.git
cd cc-safety-net

# Install dependencies
bun install

# Build for distribution
bun run build

# Check for all lint errors, type errors, dead code and run tests
bun run check
```

### Testing your changes locally

#### Claude Code

1. **Build the project**:
   ```bash
   bun run build
   ```

2. **Disable the safety-net plugin** in Claude Code (if installed) and exit Claude Code completely.

3. **Run Claude Code with the local plugin**:
   ```bash
   claude --plugin-dir .
   ```

4. **Test blocked commands** to verify your changes:
   ```bash
   # This should be blocked
   git checkout -- README.md

   # This should be allowed
   git checkout -b test-branch
   ```

> [!NOTE]
> See the [official documentation](https://docs.anthropic.com/en/docs/claude-code/plugins#test-your-plugins-locally) for more details on testing plugins locally.

#### OpenCode

1. **Build the project**:
   ```bash
   bun run build
   ```

2. **Update your OpenCode config** (`~/.config/opencode/opencode.json` or `opencode.jsonc`):
   ```json
   {
     "plugin": [
       "file:///absolute/path/to/cc-safety-net/dist/index.js"
     ]
   }
   ```
   
   For example, if your project is at `/Users/yourname/projects/cc-safety-net`:
   ```json
   {
     "plugin": [
       "file:///Users/yourname/projects/cc-safety-net/dist/index.js"
     ]
   }
   ```

> [!NOTE]
> Remove `"cc-safety-net"` from the plugin array if it exists, to avoid conflicts with the npm version.
> Or comment out the line if you're using `opencode.jsonc`.

3. **Restart OpenCode** to load the changes.

4. **Verify the plugin is loaded:** Run `/status` and confirm that the plugin name appears as `dist`.

5. **Test blocked commands** to verify your changes:
   ```bash
   # This should be blocked
   git checkout -- README.md

   # This should be allowed
   git checkout -b test-branch
   ```

> [!NOTE]
> See the [official documentation](https://opencode.ai/docs/plugins/) for more details on OpenCode plugins.

## Development workflow

### Build commands

```bash
# Run all checks (lint, type check, dead code, tests)
bun run check

# Individual commands
bun run lint          # Lint (Oxlint, type-aware)
bun run lint:comments # Code-comment check (see "Comments" in AGENTS.md)
bun run format        # Format (Oxfmt)
bun run format:check  # Formatting check (Oxfmt)
bun run typecheck     # Type check
bun run knip          # Dead code detection
bun run check-duplicates  # Duplicate-code detection (jscpd)
bun run test          # Run tests (30 s per-test timeout, as in CI)

# Run specific test
bun run test tests/gate/analyzer/git-rules.test.ts

# Run tests matching pattern
bun run test --test-name-pattern "checkout"

# Build for distribution
bun run build
```

### Conventions

| Convention | Rule |
|------------|------|
| Build/test runtime | **Bun**, pinned in `package.json` |
| Published runtime | **Node.js 22+** |
| Package Manager | **bun only** (`bun install`, `bun run`) |
| Formatter | **Oxfmt** |
| Linter | **Oxlint** (type-aware) |
| Type Hints | Rely on inference; annotate exports only where it adds clarity |
| Type Syntax | `type \| null` preferred over `type \| undefined` |
| File Naming | `kebab-case` (e.g., `worktree-relaxation.ts`, not `worktreeRelaxation.ts`) |
| Function Naming | `camelCase` for functions, `PascalCase` for types/interfaces |
| Constants | `SCREAMING_SNAKE_CASE` for reason constants |
| Imports | Relative imports within package |

## Pull request process for invited collaborators

This section applies only to invited collaborators. Everyone else should
report problems or propose changes through GitHub Issues.

Before implementing a change, agree on its scope with the maintainer in the
related issue.

1. Create a branch from `main`.
2. Follow `AGENTS.md` and the project conventions.
3. For behavior changes, start with a meaningful failing test and verify that
   the fix makes it pass.
4. Run focused tests during development, then `bun run check` after completing
   the changes.
5. Verify the affected behavior in the relevant supported CLI when applicable.
6. Use a conventional commit message.
7. Open a pull request linking the issue. Explain the problem, the change, and
   how you verified it.

### PR checklist

- [ ] Code follows `AGENTS.md` and the project conventions
- [ ] `bun run check` passes (lint, types, dead code, tests)
- [ ] Tests added for new rules (minimum 90% coverage required)
- [ ] Tested locally in each host CLI the change affects
- [ ] README untouched unless a supported CLI, headline feature, or Quick start command changed (see `AGENTS.md`)
- [ ] No version changes in `package.json`

## Publishing

**Important**: Version bumping and releases are handled by maintainers only.

- **Never** modify the version in `package.json` or `plugin.json` directly
- Before starting a release, and again whenever a supported host CLI is upgraded, run
  `bun run test:e2e:live`. It spends real tokens, so it stays out of `bun run check` and
  per-commit CI, and it is the only evidence for the per-host-version claim that a `PreToolUse`
  deny still holds in Claude Code's bypass and auto permission modes.
- Start `.github/workflows/prepare-release.yml` with a bump type (`patch`, `minor`, or `major`).
  It computes the next stable version from `package.json` on `main`. An explicit `version` input
  overrides the bump. Its dry-run mode performs the same checks without changing Git.
- Preparation requires clean `main` at `origin/main`, updates both version manifests, rebuilds and
  verifies every package surface, then atomically pushes one release commit and one new immutable
  tag.
- The tag-bound `.github/workflows/publish.yml` workflow independently rebuilds and verifies the
  exact npm tarball before trusted publishing with provenance. It attaches the tarball and its
  SHA-256 checksum to the GitHub release.
- Configure npm trusted publishing with repository `kenryu42/cc-safety-net`, workflow filename
  `publish.yml`, environment `npm`, and permission to run `npm publish`. Protect release tags and
  configure the GitHub `npm` environment with the required maintainer reviewers. The workflow
  refuses branch-dispatched runs even when the input names a valid tag.
- Resume only the same tag at the same commit. Never move or recreate a release tag, force-push
  `main`, or unpublish a bad npm version.
- If a release is defective, deprecate that npm version and prepare a patch release. If npm publish
  succeeded but the GitHub release is missing, rerun the publisher for the same immutable tag; it
  verifies the `gitHead`, tarball, checksum, draft/prerelease state, and exact asset allowlist before
  completing only the missing release assets. Any npm version collision before tag creation is a
  hard stop.

## Getting help

- **Diagnostics**: Run `bunx cc-safety-net doctor` to verify your setup is working correctly
- **Debug Analysis**: Run `bunx cc-safety-net explain "git command"` to see step-by-step how a command is analyzed
- **Project Knowledge**: Check `CLAUDE.md` or `AGENTS.md` for detailed architecture and conventions
- **Code Patterns**: Review existing implementations in `src/gate/analyzer/`
- **Test Patterns**: See `tests/helpers.ts` for test utilities
- **Issues**: Open an issue for bugs or feature requests

---

Thank you for taking the time to report problems and share ideas. It helps keep AI-assisted coding safer for everyone.
