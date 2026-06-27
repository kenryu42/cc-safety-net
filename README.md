<h1>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/cc-safety-net-header-logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./.github/assets/cc-safety-net-header-logo-light.svg">
    <img alt="CC Safety Net" src="./.github/assets/cc-safety-net-header-logo-light.svg">
  </picture>
</h1>

[![CI](https://github.com/kenryu42/cc-safety-net/actions/workflows/ci.yml/badge.svg)](https://github.com/kenryu42/cc-safety-net/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/kenryu42/cc-safety-net/branch/main/graph/badge.svg?token=C9QTION6ZF)](https://codecov.io/github/kenryu42/cc-safety-net)
[![Version](https://img.shields.io/github/v/tag/kenryu42/cc-safety-net?label=version&color=blue)](https://github.com/kenryu42/cc-safety-net)
[![Codex](https://img.shields.io/badge/Codex-white)](#codex-installation)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-D27656)](#claude-code-installation)
[![Copilot CLI](https://img.shields.io/badge/Copilot%20CLI-4EA5C9)](#github-copilot-cli-installation)
[![Gemini CLI](https://img.shields.io/badge/Gemini%20CLI-678AE3)](#gemini-cli-installation)
[![Kimi Code](https://img.shields.io/badge/Kimi%20Code-5587FF)](#kimi-code-installation)
[![OpenCode](https://img.shields.io/badge/OpenCode-black)](#opencode-installation)
[![Pi](https://img.shields.io/badge/Pi%20Coding-22262E)](#pi-installation)
[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)

<div align="center">

[![CC Safety Net](./.github/assets/cc-safety-net.png)](./.github/assets/cc-safety-net.png)

</div>

A PreToolUse hook that intercepts and blocks destructive git and filesystem commands before AI coding agents run them. CC Safety Net parses command **semantics** — so flag reordering, shell wrappers, and interpreter one-liners can't bypass it.

> [!NOTE]
> **[Full documentation →](https://ccsafetynet.com/docs)** — installation, configuration, reference, guides, and the security model live on the docs site.

## Why this exists

We learned the [hard way](https://www.reddit.com/r/ClaudeAI/comments/1pgxckk/claude_cli_deleted_my_entire_home_directory_wiped/) that instructions aren't enough to keep AI agents in check. After an agent silently wiped hours of progress with a single `rm -rf ~/` or `git checkout --`, it became clear that **soft** rules in a `CLAUDE.md` or `AGENTS.md` file cannot replace **hard** technical constraints. CC Safety Net is that constraint: it intercepts every Bash tool call and blocks destructive commands before they reach the shell. See [What Is CC Safety Net](https://ccsafetynet.com/docs/introduction) for the full background.

## Supported agents

CC Safety Net works across seven coding agent CLIs: **Claude Code, Codex, Gemini CLI, GitHub Copilot CLI, Kimi Code, OpenCode, and Pi**. Each integration is documented at [Architecture](https://ccsafetynet.com/docs/guides/architecture).

## Supported platforms

CC Safety Net runs on **Windows, macOS, and Linux**. It detects the host OS to apply correct behavior — case-insensitive path comparison on Windows, both `/` and `\` path separators, and `cmd.exe`/PowerShell command resolution via `COMSPEC`/`PATHEXT`.

## Prerequisites

- **Node.js** 18 or higher.

## Quick start

### Codex Installation

1. Enable Codex plugin hooks in `~/.codex/config.toml`:

  ```toml
  [features]
  plugin_hooks = true
  ```

2. Add the marketplace:

  ```bash
  codex plugin marketplace add kenryu42/cc-marketplace
  ```

3. Start Codex.
4. In the TUI, run `/plugins`.
5. Use arrow keys to select `[cc-marketplace]`.
6. Press Enter to install the plugin.
7. run `/hooks` and select the safety-net PreToolUse hook and press `t` to trust it.

---

### Claude Code Installation

```bash
/plugin marketplace add kenryu42/cc-marketplace
/plugin install safety-net@cc-marketplace
/reload-plugins
```

### Claude Code Auto-Update

1. Run `/plugin` → Select `Marketplaces` → Choose `cc-marketplace` → Enable auto-update

---

### Gemini CLI Installation

```bash
gemini extensions install https://github.com/kenryu42/gemini-safety-net
```

---

### GitHub Copilot CLI Installation

```bash
/plugin install kenryu42/copilot-safety-net
```

---

### Kimi Code Installation

Install CC Safety Net into your Kimi Code config:

```bash
npx -y cc-safety-net hook install --kimi-code
```

Optional: run `npx skill add kenryu42/cc-safety-net` to add the `/cc-safety-net` skill for configuring custom rules.

---

### OpenCode Installation

Install CC Safety Net with OpenCode's native plugin command:

```bash
opencode plugin -g cc-safety-net
```

> [!NOTE]
> OpenCode can sometimes keep using a stale cached plugin version. See
> anomalyco/opencode#25293 for the current tracking issue.
>
> To force OpenCode to reinstall `cc-safety-net`, remove its cached package and
> install the version you want:
>
> ```sh
> rm -rf ~/.cache/opencode/packages/cc-safety-net@latest
> opencode plugin -g -f cc-safety-net@latest
> ```
>
> If you prefer pinning a specific version:
>
> ```sh
> rm -rf ~/.cache/opencode/packages/cc-safety-net@latest
> opencode plugin -g -f cc-safety-net@<version>
> ```
>
> Restart OpenCode after updating so the plugin is loaded from the refreshed
> cache.

---

### Pi Installation

Install CC Safety Net with Pi's package installer:

```bash
pi install npm:cc-safety-net
```

---

## What it does

| Capability | What it catches |
|---|---|
| **Semantic command analysis** | `rm -rf` on destructive targets, `git reset --hard`, `git checkout --`, `git push --force`, `git stash clear`, `git clean -f`, `find -delete`, `dd`/`mkfs`/`shred` — by intent, not string pattern. `git checkout -b feature` (safe) is allowed while `git checkout -- file` (destructive) is blocked. |
| **Shell wrapper detection** | Destructive commands hidden in `bash -c`, `sh -c`, and similar wrappers, recursively analyzed up to 10 levels deep. |
| **Interpreter one-liners** | Destructive code in `python -c`, `node -e`, `ruby -e`, `perl -e` one-liners (e.g. `os.system("rm -rf /")`). |
| **Fail-closed by default** | Malformed hook input, unparseable commands (in strict mode), invalid config, and broken rulebooks block rather than allow. |
| **Custom rules via rulebooks** | Add your own blocking rules at user or project scope, pinned by SHA-256 digest when fetched from GitHub. |
| **Audit logging** | Every blocked command logged to `~/.cc-safety-net/logs/<session_id>.jsonl` with secrets auto-redacted. |

Full blocked/allowed command lists: [Blocked Commands](https://ccsafetynet.com/docs/reference/blocked-commands) · [Allowed Commands](https://ccsafetynet.com/docs/reference/allowed-commands).

## Why not just use a sandbox?

A workspace-writable sandbox still permits `git reset --hard`, `git push --force`, and `rm -rf .` *inside* the project directory, because the OS only sees writes to an allowed path. Sandboxing contains blast radius; CC Safety Net catches the destructive operations sandboxing permits — use both for defense-in-depth. See [vs Sandboxing](https://ccsafetynet.com/docs/guides/vs-sandboxing).

## Modes

CC Safety Net has opt-in modes toggled by `CC_SAFETY_NET_*` environment variables (legacy `SAFETY_NET_*` names also accepted):

| Mode | Flag | Effect |
|---|---|---|
| Strict | `CC_SAFETY_NET_STRICT=1` | Fail closed on unparseable commands, not just malformed input. |
| Paranoid | `CC_SAFETY_NET_PARANOID=1` | Stricter checks; or use `CC_SAFETY_NET_PARANOID_RM=1` (block `rm -rf` even within cwd) and `CC_SAFETY_NET_PARANOID_INTERPRETERS=1` (block interpreter one-liners). |
| Worktree | `CC_SAFETY_NET_WORKTREE=1` | Relax local git discards inside verified linked worktrees. |

See [Modes](https://ccsafetynet.com/docs/configuration/modes) and [Environment](https://ccsafetynet.com/docs/configuration/environment).

## Diagnostics and tracing

```bash
# Verify your installation and run a self-test
npx cc-safety-net doctor
# Trace how a command is analyzed step-by-step
npx cc-safety-net explain "git reset --hard"
```

Both support `--json` for machine-readable output. Full reference: [CLI Commands](https://ccsafetynet.com/docs/reference/cli-commands) · [Explain Trace](https://ccsafetynet.com/docs/reference/explain-trace).

## Upgrading from an older version

> [!WARNING]
> If you previously defined custom rules in a legacy inline config (`.safety-net.json` or `~/.cc-safety-net/config.json`), those files are **no longer loaded at runtime**. Commands now **fail closed** (stay blocked) until you migrate. Run `npx -y cc-safety-net rule migrate` to convert them to the rulebook layout. See the [migration guide](https://ccsafetynet.com/docs/configuration/custom-rules#migration-from-legacy-config).

## Full documentation

All details live on the docs site at **[ccsafetynet.com/docs](https://ccsafetynet.com/docs)**:

| Area | Pages |
|---|---|
| Get started | [Introduction](https://ccsafetynet.com/docs/introduction) · [Installation](https://ccsafetynet.com/docs/installation) · [Quickstart](https://ccsafetynet.com/docs/quickstart) |
| Configuration | [Modes](https://ccsafetynet.com/docs/configuration/modes) · [Environment](https://ccsafetynet.com/docs/configuration/environment) · [Custom Rules](https://ccsafetynet.com/docs/configuration/custom-rules) · [Status Line](https://ccsafetynet.com/docs/configuration/status-line) |
| Reference | [Blocked Commands](https://ccsafetynet.com/docs/reference/blocked-commands) · [Allowed Commands](https://ccsafetynet.com/docs/reference/allowed-commands) · [Audit Log](https://ccsafetynet.com/docs/reference/audit-log) · [CLI Commands](https://ccsafetynet.com/docs/reference/cli-commands) · [Explain Trace](https://ccsafetynet.com/docs/reference/explain-trace) · [Glossary](https://ccsafetynet.com/docs/reference/glossary) |
| Guides | [How It Works](https://ccsafetynet.com/docs/guides/how-it-works) · [Architecture](https://ccsafetynet.com/docs/guides/architecture) · [Analysis Engine](https://ccsafetynet.com/docs/guides/analysis-engine) · [Design Principles](https://ccsafetynet.com/docs/guides/design-principles) · [Security Model](https://ccsafetynet.com/docs/guides/security-model) · [vs Sandboxing](https://ccsafetynet.com/docs/guides/vs-sandboxing) · [Known Limitations](https://ccsafetynet.com/docs/guides/known-limitations) · [Troubleshooting](https://ccsafetynet.com/docs/guides/troubleshooting) |
| Project | [Contributing](https://ccsafetynet.com/docs/contributing) · [Security Policy](https://ccsafetynet.com/docs/security) |

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## License

MIT
