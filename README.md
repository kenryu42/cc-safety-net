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
[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)

<div align="center">

**English** · [简体中文](https://ccsafetynet.com/docs/zh-Hans) · [日本語](https://ccsafetynet.com/docs/ja)

[![CC Safety Net](./.github/assets/cc-safety-net-v2.png)](./.github/assets/cc-safety-net-v2.png)

</div>

CC Safety Net (Coding CLI Safety Net) blocks destructive commands and access to secrets such as SSH keys and `.env` files before the tool call runs. It parses what the command does. Wrapping the command or reordering flags does not hide it. A broken config file never blocks anything.

> [!NOTE]
> **[Full documentation →](https://ccsafetynet.com/docs)** covers installation, configuration, reference material, guides, and the security model. This README is the short version.

## Supported coding CLIs

CC Safety Net supports the coding agent CLIs below on Windows, macOS, and Linux. Automated tests cover the analyzer and some Windows integrations. Windows support for the remaining CLIs is best effort and has not been tested.

<table align="center">
  <tr>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#amp-code-installation"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/amp-dark.svg"><img alt="Amp Code" src="./.github/assets/amp-light.svg" height="32"></picture><br>Amp Code</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#antigravity-cli-installation"><img alt="Antigravity CLI" src="./.github/assets/antigravity-cli.png" height="32"><br>Antigravity CLI</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#claude-code-installation"><img alt="Claude Code" src="./.github/assets/claude-code.svg" height="32"><br>Claude Code</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#codex-installation"><img alt="Codex" src="./.github/assets/codex.svg" height="32"><br>Codex</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#cursor-installation"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/cursor-dark.svg"><img alt="Cursor" src="./.github/assets/cursor-light.svg" height="32"></picture><br>Cursor</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#gemini-cli-installation"><img alt="Gemini CLI" src="./.github/assets/gemini-cli.svg" height="32"><br>Gemini CLI</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#github-copilot-cli-installation"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/copilot-cli-dark.svg"><img alt="GitHub Copilot CLI" src="./.github/assets/copilot-cli-light.svg" height="32"></picture><br>GitHub Copilot CLI</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#grok-build-installation"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/grok-build-dark.svg"><img alt="Grok Build" src="./.github/assets/grok-build-light.svg" height="32"></picture><br>Grok Build</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#hermes-agent-installation"><img alt="Hermes Agent" src="./.github/assets/hermes.png" height="32"><br>Hermes Agent</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#kimi-code-installation"><img alt="Kimi Code" src="./.github/assets/kimi-cli.png" height="32"><br>Kimi Code</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#openclaw-installation"><img alt="OpenClaw" src="./.github/assets/openclaw.png" height="32"><br>OpenClaw</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#opencode-installation"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/opencode-dark.svg"><img alt="OpenCode" src="./.github/assets/opencode-light.svg" height="32"></picture><br>OpenCode</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#pi-installation"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/pi-dark.svg"><img alt="Pi" src="./.github/assets/pi-light.svg" height="32"></picture><br>Pi</a></td>
  </tr>
</table>

Amp documents macOS, Linux, and WSL, but not native Windows.

## Features

- **Blocks destructive commands.** `git reset --hard`, `git push --force`, `rm -rf` on dangerous targets, `find -delete`, and PowerShell `Remove-Item`. The hook still blocks the same command inside `bash -c` or `python -c`. A sandbox still allows `git reset --hard` inside your project. See [vs Sandboxing](https://ccsafetynet.com/docs/guides/vs-sandboxing).
- **Blocks secret access.** SSH keys, `.env` files, `~/.aws`, and the credential files coding CLIs keep. The rules cover the shell and the agent's read, edit, write, and search tools. Blocking a CLI's own settings files is optional. It stays off until you turn it on.
- **Customize the rules in a GUI.** Run `npx cc-safety-net gui` and open Policy. Turn individual block and secret rules off. Add paths to allow or deny. You cannot turn off the rules that catch wiping `/` or `~`.
- **Adds blocks through rulebooks.** Official packs for Terraform, AWS, gcloud, and Azure, or JSON you write yourself. A rulebook can only add blocks. It cannot turn built-in protection off. The packs live in [cc-safety-net/rulebooks](https://github.com/cc-safety-net/rulebooks). Install a pack with:

  ```bash
  npx -y cc-safety-net rule add --only terraform aws --global
  ```

  See [Official Rulebooks](https://ccsafetynet.com/docs/configuration/rulebooks).
- **Shares policy through git.** Commit `.cc-safety-net/` so clones and cloud sessions pick up the same rules. If a project file tries to loosen a member's stricter settings, `status` and `doctor` report it. `policy apply` asks for confirmation in a terminal. Copying the folder is not enough. The hook still has to be installed. See [Team Setup](https://ccsafetynet.com/docs/guides/team-setup) and [Cloud Environments](https://ccsafetynet.com/docs/guides/cloud-environments).
- **Embeds in your own tools.** Install the npm package and call `checkCommand` to get allow or deny from your own code. No hook required. See [Library API](#library-api).

Full rule catalogs: [Blocked Commands](https://ccsafetynet.com/docs/reference/blocked-commands) · [Allowed Commands](https://ccsafetynet.com/docs/reference/allowed-commands) · [Secret Protection](https://ccsafetynet.com/docs/reference/secret-protection).

## Quick start

You need Node.js 18 or higher.

To install into the coding CLIs on this machine, run:

```bash
npx -y cc-safety-net@latest install
```

To update every installed integration:

```bash
npx -y cc-safety-net@latest update
```

Keep the `@latest` qualifier. A bare `cc-safety-net` spec can run an older copy from the npx cache. To uninstall, run `npx -y cc-safety-net uninstall`. `npm install -g cc-safety-net` also installs the `ccsn` alias.

## Safety presets

To set a preset, run `npx cc-safety-net gui` and open Policy.

| Preset | Effect |
|---|---|
| Standard | Blocks recognizable destructive Git and filesystem commands. Allows metadata-only checks of built-in sensitive paths while continuing to block content access. Recommended for normal coding. |
| Strict | Standard, plus blocks dynamic or unparseable commands the analyzer cannot verify safely. Also blocks metadata-only discovery of built-in sensitive paths. Occasional false positives on advanced shell. |
| Paranoid | Strict, plus blocks `rm -rf` inside your project and interpreter one-liners. Expect friction; for untrusted agents or high-stakes repos. |

Linked-worktree mode relaxes only local discard. See [Modes](https://ccsafetynet.com/docs/configuration/modes).

## Diagnostics

```bash
# Summarize what is being enforced right now
npx cc-safety-net status
# Verify your installation and run a self-test
npx cc-safety-net doctor
# Trace how a command is analyzed step-by-step
npx cc-safety-net explain "git reset --hard"
# Browse recorded denials from the audit trail (add --all to include allowed commands)
npx cc-safety-net logs
# Review what was blocked and edit your policy in a local web GUI
npx cc-safety-net gui
```

`doctor`, `explain`, and `logs` support `--json` for machine-readable output. The audit trail stays on your machine. It records command decisions, but it does not record command output or prompts.

Details: [CLI Commands](https://ccsafetynet.com/docs/reference/cli-commands) · [Explain Trace](https://ccsafetynet.com/docs/reference/explain-trace) · [Audit Log](https://ccsafetynet.com/docs/reference/audit-log) · [Dashboard](https://ccsafetynet.com/docs/guides/dashboard) · [Configuration Recovery](https://ccsafetynet.com/docs/configuration/recovery).

## Limitations

CC Safety Net denies a tool call before it runs. It does not set filesystem permissions, watch network egress, or contain a process.

The policy and secret-path extractors are mostly POSIX. For PowerShell they resolve a home prefix (`$HOME`, `$env:USERPROFILE`, `$env:HOME`, or `~`) joined to a literal suffix with `\` or `/`. The same check applies to `Get-Content`, `Set-Content`, `Add-Content`, `Copy-Item`, `Move-Item`, `Remove-Item`, and their aliases. `Get-Content $HOME\.ssh\id_rsa` is denied. A path built by concatenation, a subexpression, or `Join-Path` is not.

Policy-file protection matches exact paths. It does not emulate commands. Use OS permissions or a sandbox when you need that.

Codex has one integration-specific limit. Its unified exec path is the default on macOS and Linux. It sends a hook payload when a command starts a session, but it sends none for `write_stdin`. CC Safety Net can inspect and audit the command that opens the session. It cannot inspect or audit text that the model types into the running session. Codex emits no event for that call, so an adapter change cannot close this gap.

[SECURITY.md](SECURITY.md) contains the full residual-risk registry. [Known Limitations](https://ccsafetynet.com/docs/guides/known-limitations) explains what those risks mean in practice.

## Upgrading from an older version

Run the `update` command from [Quick start](#quick-start) to upgrade every installed integration to the current release.

If you installed rulebooks from GitHub on version 2.2 or earlier, run `npx -y cc-safety-net rule sync` once per scope after upgrading. Add `--global` for user-scope sources. Rulebooks are now live files in your config. The command copies each cached rulebook into that location and removes the leftovers. Until you run it, those GitHub-sourced rules are inactive. `status` and `doctor` report the degraded sources.

> [!WARNING]
> If you defined custom rules in a legacy inline config such as `.safety-net.json` or `~/.cc-safety-net/config.json`, CC Safety Net no longer loads those files at runtime. Their rules enforce nothing. Normal use does not show this failure because the commands now run. Run `npx -y cc-safety-net rule migrate` to convert the rules to the rulebook layout. Then run `npx -y cc-safety-net doctor` and confirm that the runtime is `ready`. See the [migration guide](https://ccsafetynet.com/docs/configuration/custom-rules#migrate-legacy-configuration).

## Full documentation

The **[ccsafetynet.com/docs](https://ccsafetynet.com/docs)** site contains the full documentation:

| Area | Pages |
|---|---|
| Get started | [Introduction](https://ccsafetynet.com/docs/introduction) · [Installation](https://ccsafetynet.com/docs/installation) · [Quickstart](https://ccsafetynet.com/docs/quickstart) · [Team Setup](https://ccsafetynet.com/docs/guides/team-setup) · [Cloud Environments](https://ccsafetynet.com/docs/guides/cloud-environments) · [How It Works](https://ccsafetynet.com/docs/guides/how-it-works) · [Dashboard](https://ccsafetynet.com/docs/guides/dashboard) |
| Configuration | [Modes](https://ccsafetynet.com/docs/configuration/modes) · [Policy](https://ccsafetynet.com/docs/configuration/policy) · [Environment](https://ccsafetynet.com/docs/configuration/environment) · [Custom Rules](https://ccsafetynet.com/docs/configuration/custom-rules) · [Official Rulebooks](https://ccsafetynet.com/docs/configuration/rulebooks) · [Status Line](https://ccsafetynet.com/docs/configuration/status-line) · [Configuration Recovery](https://ccsafetynet.com/docs/configuration/recovery) |
| Reference | [Blocked Commands](https://ccsafetynet.com/docs/reference/blocked-commands) · [Allowed Commands](https://ccsafetynet.com/docs/reference/allowed-commands) · [Secret Protection](https://ccsafetynet.com/docs/reference/secret-protection) · [Audit Log](https://ccsafetynet.com/docs/reference/audit-log) · [CLI Commands](https://ccsafetynet.com/docs/reference/cli-commands) · [Explain Trace](https://ccsafetynet.com/docs/reference/explain-trace) · [Glossary](https://ccsafetynet.com/docs/reference/glossary) |
| Guides | [Architecture](https://ccsafetynet.com/docs/guides/architecture) · [Analysis Engine](https://ccsafetynet.com/docs/guides/analysis-engine) · [Design Principles](https://ccsafetynet.com/docs/guides/design-principles) · [Security Model](https://ccsafetynet.com/docs/guides/security-model) · [vs Sandboxing](https://ccsafetynet.com/docs/guides/vs-sandboxing) · [Integration Architecture](https://ccsafetynet.com/docs/guides/integration-architecture) · [Embedding](https://ccsafetynet.com/docs/guides/embedding) · [Known Limitations](https://ccsafetynet.com/docs/guides/known-limitations) · [Troubleshooting](https://ccsafetynet.com/docs/guides/troubleshooting) |
| Project | [Contributing](https://ccsafetynet.com/docs/contributing) · [Security Policy](https://ccsafetynet.com/docs/security) |

## The cc-safety-net skill

The skill is the operating manual for CC Safety Net. Ask it anything about the tool: why a command was blocked, whether a block was wrong, how to write or migrate custom rules, how to change the policy or safety level, how to install or remove an integration, or whether protection is working at all. When the CLI output cannot settle a question, it reads the source of the installed version and answers from that.

```text
/cc-safety-net why was my last git command blocked
/cc-safety-net block terraform destroy in this repo
/cc-safety-net is secret protection active in Codex?
```

The command ships with the Claude Code and Codex plugins and is built into the OpenCode and Pi integrations. The skill loads only when you invoke it, so it takes no context-window space until you type the command. The agent cannot trigger it on its own.

## Library API

To check a command from Node.js without installing the hook:

```bash
npm install cc-safety-net
```

```ts
import { checkCommand } from 'cc-safety-net/api';

const result = checkCommand({ command: 'git status', cwd: process.cwd() });
if (result.kind !== 'allow') {
  throw new Error(result.reason);
}
```

`cwd` must be an absolute directory path. If `checkCommand` throws, do not run the command.

A full example is in [Embedding](https://ccsafetynet.com/docs/guides/embedding).

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute to the project.

## License

MIT
