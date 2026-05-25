# Claude Code Safety Net

[![CI](https://github.com/kenryu42/claude-code-safety-net/actions/workflows/ci.yml/badge.svg)](https://github.com/kenryu42/claude-code-safety-net/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/kenryu42/claude-code-safety-net/branch/main/graph/badge.svg?token=C9QTION6ZF)](https://codecov.io/github/kenryu42/claude-code-safety-net)
[![Version](https://img.shields.io/github/v/tag/kenryu42/claude-code-safety-net?label=version&color=blue)](https://github.com/kenryu42/claude-code-safety-net)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-D27656)](#claude-code-installation)
[![OpenCode](https://img.shields.io/badge/OpenCode-black)](#opencode-installation)
[![Kimi CLI](https://img.shields.io/badge/Kimi%20CLI-111111)](#kimi-cli-installation)
[![Gemini CLI](https://img.shields.io/badge/Gemini%20CLI-678AE3)](#gemini-cli-installation)
[![Copilot CLI](https://img.shields.io/badge/Copilot%20CLI-4EA5C9)](#github-copilot-cli-installation)
[![Codex](https://img.shields.io/badge/Codex-white)](#codex-installation)
[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)

<div align="center">

[![CC Safety Net](./.github/assets/cc-safety-net.png)](./.github/assets/cc-safety-net.png)

</div>

A Claude Code plugin that acts as a safety net, catching destructive git and filesystem commands before they execute.

## Contents

- [Why This Exists](#why-this-exists)
- [Why Use This Instead of Permission Deny Rules?](#why-use-this-instead-of-permission-deny-rules)
- [What About Sandboxing?](#what-about-sandboxing)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
  - [Claude Code Installation](#claude-code-installation)
  - [OpenCode Installation](#opencode-installation)
  - [Kimi CLI Installation](#kimi-cli-installation)
  - [Gemini CLI Installation](#gemini-cli-installation)
  - [GitHub Copilot CLI Installation](#github-copilot-cli-installation)
  - [Codex Installation](#codex-installation)
- [Status Line Integration](#status-line-integration)
  - [Setup via Slash Command](#setup-via-slash-command)
  - [Manual Setup](#manual-setup)
  - [Emoji Mode Indicators](#emoji-mode-indicators)
- [Diagnostics](#diagnostics)
- [Explain (Debug Analysis)](#explain-debug-analysis)
- [Commands Blocked](#commands-blocked)
- [Commands Allowed](#commands-allowed)
- [What Happens When Blocked](#what-happens-when-blocked)
- [Testing the Hook](#testing-the-hook)
- [Development](#development)
- [Custom Rules (Experimental)](#custom-rules-experimental)
  - [Config File Location](#config-file-location)
  - [Rule Schema](#rule-schema)
  - [Matching Behavior](#matching-behavior)
  - [Examples](#examples)
  - [Error Handling](#error-handling)
- [Advanced Features](#advanced-features)
  - [Strict Mode](#strict-mode)
  - [Paranoid Mode](#paranoid-mode)
  - [Worktree Mode](#worktree-mode)
  - [Shell Wrapper Detection](#shell-wrapper-detection)
  - [Interpreter One-Liner Detection](#interpreter-one-liner-detection)
  - [Secret Redaction](#secret-redaction)
  - [Audit Logging](#audit-logging)
- [License](#license)

## Why This Exists

We learned the [hard way](https://www.reddit.com/r/ClaudeAI/comments/1pgxckk/claude_cli_deleted_my_entire_home_directory_wiped/) that instructions aren't enough to keep AI agents in check.
After Claude Code silently wiped out hours of progress with a single `rm -rf ~/` or `git checkout --`, it became evident that **soft** rules in an `CLAUDE.md` or `AGENTS.md` file cannot replace **hard** technical constraints.
The current approach is to use a dedicated hook to programmatically prevent agents from running destructive commands.

## Why Use This Instead of Permission Deny Rules?

Claude Code's `.claude/settings.json` supports [deny rules](https://code.claude.com/docs/en/iam#tool-specific-permission-rules) with wildcard matching (e.g., `Bash(git reset --hard:*)`). Here's how this plugin differs:

### At a Glance

| | Permission Deny Rules | Safety Net |
|---|---|---|
| **Setup** | Manual configuration required | Works out of the box |
| **Parsing** | Wildcard pattern matching | Semantic command analysis |
| **Execution order** | Runs second | Runs first (PreToolUse hook) |
| **Shell wrappers** | Not handled automatically (must match wrapper forms) | Recursively analyzed (5 levels) |
| **Interpreter one-liners** | Not handled automatically (must match interpreter forms) | Detected and blocked |

### Permission Rules Have Known Bypass Vectors

Even with wildcard matching, Bash permission patterns are intentionally limited and can be bypassed in many ways:

| Bypass Method | Example |
|---------------|---------|
| Options before value | `curl -X GET http://evil.com` bypasses `Bash(curl http://evil.com:*)` |
| Shell variables | `URL=http://evil.com && curl $URL` bypasses URL pattern |
| Flag reordering | `rm -r -f /` bypasses `Bash(rm -rf:*)` |
| Extra whitespace | `rm  -rf /` (double space) bypasses pattern |
| Shell wrappers | `sh -c "rm -rf /"` bypasses `Bash(rm:*)` entirely |

### Safety Net Handles What Patterns Can't

| Scenario | Permission Rules | Safety Net |
|----------|------------------|------------|
| `git checkout -b feature` (safe) | Blocked by `Bash(git checkout:*)` | Allowed |
| `git checkout -- file` (dangerous) | Blocked by `Bash(git checkout:*)` | Blocked |
| `rm -rf /tmp/cache` (safe) | Blocked by `Bash(rm -rf:*)` | Allowed |
| `rm -r -f /` (dangerous) | Allowed (flag order) | Blocked |
| `bash -c 'git reset --hard'` | Allowed (wrapper) | Blocked |
| `python -c 'os.system("rm -rf /")'` | Allowed (interpreter) | Blocked |

### Defense in Depth

PreToolUse hooks run [**before**](https://code.claude.com/docs/en/iam#additional-permission-control-with-hooks) the permission system. This means Safety Net inspects every command first, regardless of your permission configuration. Even if you misconfigure deny rules, Safety Net provides a fallback layer of protection.

**Use both together**: Permission deny rules for quick, user-configurable blocks; Safety Net for robust, bypass-resistant protection that works out of the box.

## What About Sandboxing?

Claude Code offers [native sandboxing](https://code.claude.com/docs/en/sandboxing) that provides OS-level filesystem and network isolation. Here's how it compares to Safety Net:

### Different Layers of Protection

| | Sandboxing | Safety Net |
|---|---|---|
| **Enforcement** | OS-level (Seatbelt/bubblewrap) | Application-level (PreToolUse hook) |
| **Approach** | Containment — restricts filesystem + network access | Command analysis — blocks destructive operations |
| **Filesystem** | Writes restricted (default: cwd); reads are broad by default | Only destructive operations blocked |
| **Network** | Domain-based proxy filtering | None |
| **Git awareness** | None | Explicit rules for destructive git operations |
| **Bypass resistance** | High — OS enforces boundaries | Lower — analyzes command strings only |

### Why Sandboxing Isn't Enough

Sandboxing restricts filesystem + network access, but it doesn't understand whether an operation is destructive within those boundaries. These commands are not blocked by the sandbox boundary:

> [!NOTE]
> Whether they're auto-run or require confirmation depends on your sandbox mode (auto-allow vs regular permissions), and network access still depends on your allowed-domain policy. Claude Code can also retry a command outside the sandbox via `dangerouslyDisableSandbox` (with user permission); this can be disabled with `allowUnsandboxedCommands: false`.

| Command | Sandboxing | Safety Net |
|---------|------------|------------|
| `git reset --hard` | Allowed (within cwd) | **Blocked** |
| `git checkout -- .` | Allowed (within cwd) | **Blocked** |
| `git stash clear` | Allowed (within cwd) | **Blocked** |
| `git push --force` | Allowed (if remote domain is allowed) | **Blocked** |
| `rm -rf .` | Allowed (within cwd) | **Blocked** |

Sandboxing sees `git reset --hard` as a safe operation—it only modifies files within the current directory. But you just lost all uncommitted work.

### When to Use Sandboxing Instead

Sandboxing is the better choice when your primary concern is:

- **Prompt injection attacks** — Reduces exfiltration risk by restricting outbound domains (depends on your allowed-domain policy)
- **Malicious dependencies** — Limits filesystem writes and network access by default (subject to your sandbox configuration)
- **Untrusted code execution** — OS-level containment is stronger than pattern matching
- **Network control** — Safety Net has no network protection

### Recommended: Use Both

They protect against different threats:

- **Sandboxing** contains blast radius — even if something goes wrong, damage is limited to cwd and approved network domains
- **Safety Net** prevents footguns — catches git-specific mistakes that are technically "safe" from the sandbox's perspective

Running both together provides defense-in-depth. Sandboxing handles unknown threats; Safety Net handles known destructive patterns that sandboxing permits.

## Prerequisites

- **Node.js**: Version 18 or higher is required to run this plugin

## Quick Start

### Claude Code Installation

```bash
/plugin marketplace add kenryu42/cc-marketplace
/plugin install safety-net@cc-marketplace
/reload-plugins
```

### Claude Code Auto-Update

1. Run `/plugin` → Select `Marketplaces` → Choose `cc-marketplace` → Enable auto-update

---

### OpenCode Installation

Install Safety Net into your OpenCode config:

```bash
npx -y cc-safety-net hook install --opencode
```

This updates the first existing OpenCode config file in OpenCode's priority order:

1. `opencode.jsonc`
2. `opencode.json`
3. `config.json`

If no config file exists, Safety Net creates `opencode.jsonc`.

The config directory is `$OPENCODE_CONFIG_DIR` when set, otherwise `$XDG_CONFIG_HOME/opencode` or `~/.config/opencode`.

To uninstall:

```bash
npx -y cc-safety-net hook uninstall --opencode
```

---

### Kimi CLI Installation

Install Safety Net into your Kimi CLI config:

```bash
npx -y cc-safety-net hook install --kimi-cli
```

This updates `$KIMI_SHARE_DIR/config.toml` when `KIMI_SHARE_DIR` is set, otherwise `~/.kimi/config.toml`.

Safety Net preserves the existing Kimi hook syntax:

- If your config already uses `hooks = [...]`, it adds a matching inline hook entry.
- If your config has `hooks = []`, it removes that empty array and writes `[[hooks]]`.
- Otherwise, it appends a `[[hooks]]` block.

To uninstall:

```bash
npx -y cc-safety-net hook uninstall --kimi-cli
```

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

> [!NOTE]
> After installing the plugin, you need to restart your Copilot CLI for it to take effect.

---

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

## Status Line Integration

Safety Net can display its status in Claude Code's status line, showing whether protection is active and which modes are enabled.

Add the following to your `~/.claude/settings.json`:

**Using Bun (recommended):**

```json
{
  "statusLine": {
    "type": "command",
    "command": "bunx cc-safety-net statusline --claude-code"
  }
}
```

**Using Claude X:**

```json
{
  "statusLine": {
    "type": "command",
    "command": "BUN_BE_BUN=1 claude x cc-safety-net statusline --claude-code"
  }
}
```
> [!NOTE]
> The `claude x` command is only compatible with the native version of Claude Code. If you installed via npm, please use `npx` or `bunx` instead.



**Using NPM:**

```json
{
  "statusLine": {
    "type": "command",
    "command": "npx -y cc-safety-net statusline --claude-code"
  }
}
```

**Piping with existing status line:**

If you already have a status line command, you can pipe Safety Net at the end:

```json
{
  "statusLine": {
    "type": "command",
    "command": "your-existing-command | bunx cc-safety-net statusline --claude-code"
  }
}
```

Changes take effect immediately — no restart needed.

### Emoji Mode Indicators

The status line displays different emojis based on the current configuration:

| Status | Display | Meaning |
|--------|---------|---------|
| Plugin disabled | `🛡️ Safety Net ❌` | Safety Net plugin is not enabled |
| Default mode | `🛡️ Safety Net ✅` | Protection active with default settings |
| Strict mode | `🛡️ Safety Net 🔒` | `SAFETY_NET_STRICT=1` — fail-closed on unparseable commands |
| Paranoid mode | `🛡️ Safety Net 👁️` | `SAFETY_NET_PARANOID=1` — all paranoid checks enabled |
| Paranoid RM only | `🛡️ Safety Net 🗑️` | `SAFETY_NET_PARANOID_RM=1` — blocks `rm -rf` even within cwd |
| Paranoid interpreters only | `🛡️ Safety Net 🐚` | `SAFETY_NET_PARANOID_INTERPRETERS=1` — blocks interpreter one-liners |
| Worktree mode | `🛡️ Safety Net 🌳` | `SAFETY_NET_WORKTREE=1` — relax local git discards inside linked worktrees |
| Strict + Paranoid | `🛡️ Safety Net 🔒👁️` | Both strict and paranoid modes enabled |

Multiple mode emojis are combined when multiple environment variables are set.

## Diagnostics

Run the diagnostic command to verify your installation and troubleshoot issues:

```bash
npx cc-safety-net doctor
# or with bun
bunx cc-safety-net doctor
```

The doctor command checks:

| Check | Description |
|-------|-------------|
| Hook Integration | Verifies the plugin is properly configured for each supported platform |
| Self-Test | Runs sample commands to confirm blocking works correctly |
| Configuration | Validates custom rules in user and project configs |
| Environment | Shows status of mode flags (SAFETY_NET_STRICT, SAFETY_NET_PARANOID, etc.) |
| Recent Activity | Summarizes blocked commands from the last 7 days |
| System Info | Displays versions of all relevant tools |
| Update Check | Checks if a newer version is available |

### Options

| Flag | Description |
|------|-------------|
| `--json` | Output in JSON format (useful for sharing in bug reports) |
| `--skip-update-check` | Skip the npm version check |

## Explain (Debug Analysis)

Trace how Safety Net analyzes a command step-by-step. Useful for debugging why a command is blocked or allowed, or when developing custom rules.

```bash
npx cc-safety-net explain "git reset --hard"
# or with bun
bunx cc-safety-net explain "git reset --hard"
```

### Options

| Flag | Description |
|------|-------------|
| `--json` | Output analysis as JSON |
| `--cwd <path>` | Use custom working directory for analysis |

### Examples

```bash
npx cc-safety-net explain "rm -rf /"
npx cc-safety-net explain --json "git checkout -- file.txt"
npx cc-safety-net explain --cwd /tmp "git status"
```

## Commands Blocked

| Command Pattern | Why It's Dangerous |
|-----------------|-------------------|
| git checkout -- files | Discards uncommitted changes permanently |
| git checkout \<ref\> -- \<path\> | Overwrites working tree with ref version |
| git checkout \<ref\> \<path\> | May overwrite working tree when Git disambiguates ref vs pathspec |
| git restore files | Discards uncommitted changes |
| git restore --worktree | Explicitly discards working tree changes |
| git reset --hard | Destroys all uncommitted changes |
| git reset --merge | Can lose uncommitted changes |
| git clean -f | Removes untracked files permanently |
| git push --force / -f | Destroys remote history |
| git branch -D | Force-deletes branch without merge check |
| git stash drop | Permanently deletes stashed changes |
| git stash clear | Deletes ALL stashed changes |
| git worktree remove --force | Force-deletes worktree without checking for changes |
| rm -rf (paths outside cwd) | Recursive file deletion outside the current directory |
| rm -rf / or ~ or $HOME | Root/home deletion is extremely dangerous |
| find ... -delete | Permanently removes files matching criteria |
| xargs rm -rf | Dynamic input makes targets unpredictable |
| xargs \<shell\> -c | Can execute arbitrary commands |
| parallel rm -rf | Dynamic input makes targets unpredictable |
| parallel \<shell\> -c | Can execute arbitrary commands |

## Commands Allowed

| Command Pattern | Why It's Safe |
|-----------------|--------------|
| git checkout -b branch | Creates new branch |
| git checkout --orphan | Creates orphan branch |
| git restore --staged | Only unstages, doesn't discard |
| git restore --help/--version | Help/version output |
| git branch -d | Safe delete with merge check |
| git clean -n / --dry-run | Preview only |
| git push --force-with-lease | Safe force push |
| rm -rf /tmp/... | Temp directories are ephemeral |
| rm -rf /var/tmp/... | System temp directory |
| rm -rf $TMPDIR/... | User's temp directory |
| rm -rf ./... (within cwd) | Limited to current working directory |
| git restore / checkout -- / reset --hard / clean -f (in linked worktree) | Relaxed only when `SAFETY_NET_WORKTREE=1` and cwd is a linked worktree |

## What Happens When Blocked

When a destructive command is detected, the plugin blocks the tool execution and provides a reason.

Example output:
```text
BLOCKED by Safety Net

Reason: git checkout -- discards uncommitted changes permanently. Use 'git stash' first.

Command: git checkout -- src/main.py

If this operation is truly needed, ask the user for explicit permission and have them run the command manually.
```

## Testing the Hook

You can manually test the hook by attempting to run blocked commands in Claude Code:

```bash
# This should be blocked
git checkout -- README.md

# This should be allowed
git checkout -b test-branch
```

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## Custom Rules (Experimental)

Beyond the built-in protections, you can define your own blocking rules to enforce team conventions or project-specific safety policies.

> [!TIP]
> Use the `cc-safety-net` skill to create custom rules interactively with natural language.
>
> If your agent does not support skills, prompt it with:
> ```text
> run npx -y cc-safety-net rule doc and help me set up custom rules
> ```

### Quick Example

Create a starter project rule config and rulebook:

```bash
npx -y cc-safety-net rule init
```

This creates `.cc-safety-net/rules/rule.json`:

```json
{
  "version": 1,
  "rules": ["project-rules"],
  "overrides": {}
}
```

Rule definitions live in `.cc-safety-net/rules/project-rules/rulebook.json`:

```json
{
  "rulebook_version": 1,
  "name": "project-rules",
  "version": "1.0.0",
  "description": "Project-specific CC Safety Net rules.",
  "author": "project",
  "allowed_commands": ["git"],
  "rules": [
    {
      "name": "block-git-add-all",
      "command": "git",
      "subcommand": "add",
      "block_args": ["-A", "--all", "."],
      "reason": "Use 'git add <specific-files>' instead of blanket add."
    }
  ],
  "tests": [
    {
      "command": "git add -A",
      "expect": "blocked",
      "rule": "block-git-add-all"
    },
    {
      "command": "git add README.md",
      "expect": "allowed"
    }
  ]
}
```

After editing rulebooks, run:

```bash
npx -y cc-safety-net rule sync
npx -y cc-safety-net rule verify
npx -y cc-safety-net rule test
```

Now `git add -A`, `git add --all`, and `git add .` will be blocked with your custom message.

### Config File Location

Config files are loaded from two scopes and merged:

1. **User scope**: `~/.cc-safety-net/rules/rule.json` (use `rule init --global`)
2. **Project scope**: `.cc-safety-net/rules/rule.json` in the current working directory

Local rulebook sources are bare names like `project-rules`. GitHub rulebook sources use `owner/repo#ref/<rulebook-name>` and point to `.cc-safety-net/rules/<rulebook-name>/rulebook.json` in that repository.

Legacy inline config files (`.safety-net.json` and `~/.cc-safety-net/config.json`) are no longer loaded at runtime. Convert existing legacy rules with `npx -y cc-safety-net rule migrate`; use `npx -y cc-safety-net rule migrate --cleanup` if you also want to delete verified legacy files after migration.

**Merging behavior**:
- Rulebooks from both scopes are combined
- Duplicate active rulebook names are invalid
- Project overrides win over user overrides for the same `<rulebook-name>/<rule-name>` key

This allows you to define personal defaults in user scope while letting projects disable or replace reasons for specific rules.

If no config file is found in either location, only built-in rules apply.

### Config Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | integer | Yes | Schema version (must be `1`) |
| `rules` | array | No | List of rulebook source strings (defaults to empty) |
| `overrides` | object | No | Rule overrides keyed by `<rulebook-name>/<rule-name>` |

Override values are either `"off"` to disable a rule or `{ "reason": "..." }` to replace the rule reason.

### Rulebook Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rulebook_version` | integer | Yes | Rulebook schema version (must be `1`) |
| `name` | string | Yes | Rulebook name; must match the local directory name or GitHub source name |
| `version` | string | Yes | Rulebook version |
| `description` | string | No | Human-readable description |
| `author` | string | No | Rulebook author |
| `allowed_commands` | array | Yes | Commands this rulebook is allowed to define rules for |
| `rules` | array | Yes | Custom blocking rules |
| `tests` | array | Yes | Rulebook fixtures |

### Rule Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique within the rulebook (letters, numbers, hyphens, underscores; max 64 chars) |
| `command` | string | Yes | Base command to match; must be listed in `allowed_commands` |
| `subcommand` | string | No | Subcommand to match (e.g., `add`, `install`). If omitted, matches any. |
| `block_args` | array | Yes | Arguments that trigger the block (at least one required) |
| `reason` | string | Yes | Message shown when blocked (max 256 chars) |

### Fixture Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `command` | string | Yes | Shell command fixture |
| `expect` | string | Yes | Either `blocked` or `allowed` |
| `rule` | string | For blocked fixtures | Rule expected to block the command |

Every rule must have at least one blocked fixture. Add allowed fixtures for close-but-safe commands.

### Matching Behavior

- **Commands** are normalized to basename (`/usr/bin/git` → `git`)
- **Subcommand** is the first non-option argument after the command
- **Arguments** are matched literally (no regex, no glob), with short option expansion
- A command is blocked if **any** argument in `block_args` is present
- **Short options** are expanded: `-Ap` matches `-A` (bundled flags are unbundled)
- **Long options** use exact match: `--all-files` does NOT match `--all`
- Custom rules only add restrictions—they cannot bypass built-in protections

#### Known Limitations

- **Short option expansion**: `-Cfoo` is treated as `-C -f -o -o`, not `-C foo`. Blocking `-f` may false-positive on attached option values.

### Examples

#### Block global npm installs

`.cc-safety-net/rules/rule.json`:

```json
{
  "version": 1,
  "rules": ["project-rules"],
  "overrides": {}
}
```

`.cc-safety-net/rules/project-rules/rulebook.json`:

```json
{
  "rulebook_version": 1,
  "name": "project-rules",
  "version": "1.0.0",
  "allowed_commands": ["npm"],
  "rules": [
    {
      "name": "block-npm-global",
      "command": "npm",
      "subcommand": "install",
      "block_args": ["-g", "--global"],
      "reason": "Global npm installs can cause version conflicts. Use npx or local install."
    }
  ],
  "tests": [
    {
      "command": "npm install -g typescript",
      "expect": "blocked",
      "rule": "block-npm-global"
    },
    {
      "command": "npm install typescript",
      "expect": "allowed"
    }
  ]
}
```

#### Block dangerous docker commands

```json
{
  "rulebook_version": 1,
  "name": "project-rules",
  "version": "1.0.0",
  "allowed_commands": ["docker"],
  "rules": [
    {
      "name": "block-docker-system-prune",
      "command": "docker",
      "subcommand": "system",
      "block_args": ["prune"],
      "reason": "docker system prune removes all unused data. Use targeted cleanup instead."
    }
  ],
  "tests": [
    {
      "command": "docker system prune",
      "expect": "blocked",
      "rule": "block-docker-system-prune"
    },
    {
      "command": "docker ps",
      "expect": "allowed"
    }
  ]
}
```

#### Multiple rules

```json
{
  "rulebook_version": 1,
  "name": "project-rules",
  "version": "1.0.0",
  "allowed_commands": ["git", "npm"],
  "rules": [
    {
      "name": "block-git-add-all",
      "command": "git",
      "subcommand": "add",
      "block_args": ["-A", "--all", ".", "-u", "--update"],
      "reason": "Use 'git add <specific-files>' instead of blanket add."
    },
    {
      "name": "block-npm-global",
      "command": "npm",
      "subcommand": "install",
      "block_args": ["-g", "--global"],
      "reason": "Use npx or local install instead of global."
    }
  ],
  "tests": [
    {
      "command": "git add -A",
      "expect": "blocked",
      "rule": "block-git-add-all"
    },
    {
      "command": "npm install -g typescript",
      "expect": "blocked",
      "rule": "block-npm-global"
    }
  ]
}
```

### Error Handling

Rulebook-backed custom rules fail closed when configured rulebooks cannot be loaded safely:

| Scenario | Behavior |
|----------|----------|
| Config file not found | Silent — use built-in rules only |
| Invalid rule config | Fail closed until fixed |
| Legacy config without migrated rule config | Fail closed until `rule migrate` creates the new rule config |
| Missing or stale lock/cache | Fail closed until `rule sync` repairs it |
| Invalid local rulebook | Fail closed until the rulebook is fixed and synced |
| Invalid GitHub rulebook | Fail closed until the source is fixed or removed |


> [!IMPORTANT]  
> If you add or modify custom rules manually, always validate them with `npx -y cc-safety-net rule verify` and `npx -y cc-safety-net rule test`.

### Block Output Format

When a custom rule blocks a command, the output includes the rule name:

```text
BLOCKED by Safety Net

Reason: [block-git-add-all] Use 'git add <specific-files>' instead of blanket add.

Command: git add -A
```

## Advanced Features

### Strict Mode

By default, unparseable commands are allowed through. Enable strict mode to fail-closed
when the hook input or shell command cannot be safely analyzed (e.g., invalid JSON,
unterminated quotes, malformed `bash -c` wrappers):

```bash
export SAFETY_NET_STRICT=1
```

### Paranoid Mode

Paranoid mode enables stricter safety checks that may be disruptive to normal workflows.
You can enable it globally or via focused toggles:

```bash
# Enable all paranoid checks
export SAFETY_NET_PARANOID=1

# Or enable specific paranoid checks
export SAFETY_NET_PARANOID_RM=1
export SAFETY_NET_PARANOID_INTERPRETERS=1
```

Paranoid behavior:

- **rm**: blocks non-temp `rm -rf` even within the current working directory.
- **interpreters**: blocks interpreter one-liners like `python -c`, `node -e`, `ruby -e`,
  and `perl -e` (these can hide destructive commands).

### Worktree Mode

Linked git worktrees are designed as disposable, isolated workspaces — discarding
changes inside one doesn't risk the main working tree. Worktree mode relaxes
local-discard rules when (and only when) the command is proven to run inside a
linked worktree:

```bash
export SAFETY_NET_WORKTREE=1
```

When enabled, these commands are allowed inside a linked worktree:

- `git restore <file>` and `git restore --worktree <file>`
- `git checkout -- <file>`, `git checkout <ref> -- <file>`, `git checkout --force`,
  and ambiguous multi-positional checkout forms
- `git switch --discard-changes` and `git switch -f / --force`
- `git reset --hard` and `git reset --merge`
- `git clean -f` (and combined short flags like `-fd`)

These remain blocked even in linked worktrees because they reach beyond the
local working tree:

- `git push --force` (affects remote)
- `git branch -D` (affects shared refs)
- `git stash drop` / `git stash clear` (stash is shared across worktrees)
- `git worktree remove --force` (could delete another worktree)

Detection is fail-closed and mostly filesystem-based:

- A linked worktree is identified by a `.git` *file* containing `gitdir:` whose
  resolved git directory contains a `commondir` file. Main worktrees and
  submodules don't satisfy this and are not relaxed.
- The cwd walk uses `realpath` so symlinked paths resolve correctly.
- `git -C <path>` (including chained `-C` and attached `-Cpath`) is honored;
  unresolved targets keep the command blocked.
- Relaxation is disabled if cwd becomes unknown (e.g., after `cd`/`pushd`),
  if `--git-dir` / `--work-tree` is passed, or if `GIT_DIR` / `GIT_WORK_TREE`
  / `GIT_COMMON_DIR` is set in the environment.
- Git may be invoked from a trusted system path to inspect effective config that
  could make submodule operations recursive.

### Shell Wrapper Detection

The guard recursively analyzes commands wrapped in shells:

```bash
bash -c 'git reset --hard'    # Blocked
sh -lc 'rm -rf /'             # Blocked
```

### Interpreter One-Liner Detection

Detects destructive commands hidden in Python/Node/Ruby/Perl one-liners:

```bash
python -c 'import os; os.system("rm -rf /")'  # Blocked
```

### Secret Redaction

Block messages automatically redact sensitive data (tokens, passwords, API keys) to prevent leaking secrets in logs.

### Audit Logging

All blocked commands are logged to `~/.cc-safety-net/logs/<session_id>.jsonl` for audit purposes:

```json
{"ts": "2025-01-15T10:30:00Z", "command": "git reset --hard", "segment": "git reset --hard", "reason": "...", "cwd": "/path/to/project"}
```

Sensitive data in log entries is automatically redacted.

## License

MIT
