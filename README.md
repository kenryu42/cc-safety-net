<h1>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/cc-safety-net-header-logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/cc-safety-net-header-logo-light.svg">
    <img alt="CC Safety Net" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/cc-safety-net-header-logo-light.svg">
  </picture>
</h1>

[![CI](https://github.com/kenryu42/cc-safety-net/actions/workflows/ci.yml/badge.svg)](https://github.com/kenryu42/cc-safety-net/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/kenryu42/cc-safety-net/branch/main/graph/badge.svg?token=C9QTION6ZF)](https://codecov.io/github/kenryu42/cc-safety-net)
[![Version](https://img.shields.io/github/v/tag/kenryu42/cc-safety-net?label=version&color=blue)](https://github.com/kenryu42/cc-safety-net)
![macOS](https://img.shields.io/badge/macOS-000000?logo=apple&logoColor=white)
![Windows](https://img.shields.io/badge/Windows-0078D4?logo=data:image/svg%2Bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0wIDMuNDQ5IDkuNzUgMi4xdjkuNDUxSDB6bTEwLjk0OS0xLjZMMjQgMHYxMS40SDEwLjk0OXpNMCAxMi42aDkuNzV2OS40NTFMMCAyMC42OTl6bTEwLjk0OSAwSDI0VjI0bC0xMy4wNTEtMS44eiIvPjwvc3ZnPg%3D%3D)
![Linux](https://img.shields.io/badge/Linux-FCC624?logo=linux&logoColor=black)
[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)

<div align="center">

**English** · [简体中文](https://ccsafetynet.com/docs/zh-Hans) · [日本語](https://ccsafetynet.com/docs/ja)

https://github.com/user-attachments/assets/353c1441-9156-483c-b8e5-32fce7905a83

</div>

CC Safety Net (Coding CLI Safety Net) blocks destructive commands and access to secrets such as SSH keys and `.env` files before the tool call runs. It parses what the command does. Wrapping the command or reordering flags does not hide it. A broken config file falls back to safe defaults instead of stopping your agent. It is not a sandbox: it does not contain processes, set filesystem permissions, or watch network egress.

> [!NOTE]
> **[Full documentation →](https://ccsafetynet.com/docs)** covers installation, configuration, reference material, guides, and the security model. This README is the short version.

## How it works

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/how-it-works-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/how-it-works-light.svg">
    <img alt="An AI coding agent tries to run a command or open a file. CC Safety Net checks what it would actually do before it runs. Safe calls such as git status run normally; dangerous ones such as git reset --hard never run, and the agent is told why." src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/how-it-works-light.svg" width="720">
  </picture>
</p>

## Supported coding CLIs

CC Safety Net supports these coding agent CLIs on Windows, macOS, and Linux.

<table align="center">
  <tr>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/amp-code"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/amp-dark.svg"><img alt="Amp Code" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/amp-light.svg" height="32"></picture><br>Amp Code</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/antigravity-cli"><img alt="Antigravity CLI" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/antigravity-cli.png" height="32"><br>Antigravity CLI</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/claude-code"><img alt="Claude Code" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/claude-code.svg" height="32"><br>Claude Code</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/codex"><img alt="Codex" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/codex.svg" height="32"><br>Codex</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/cursor"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/cursor-dark.svg"><img alt="Cursor" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/cursor-light.svg" height="32"></picture><br>Cursor</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/deepseek-harness"><img alt="DeepSeek Harness" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/deepseek.svg" height="32"><br>DeepSeek Harness</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/devin-cli"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/devin-dark.svg"><img alt="Devin CLI" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/devin-light.svg" height="32"></picture><br>Devin CLI</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/factory-droid"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/droid-dark.svg"><img alt="Factory Droid" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/droid-light.svg" height="32"></picture><br>Factory Droid</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/gemini-cli"><img alt="Gemini CLI" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/gemini-cli.svg" height="32"><br>Gemini CLI</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/github-copilot-cli"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/copilot-cli-dark.svg"><img alt="GitHub Copilot CLI" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/copilot-cli-light.svg" height="32"></picture><br>GitHub Copilot CLI</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/grok-build"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/grok-build-dark.svg"><img alt="Grok Build" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/grok-build-light.svg" height="32"></picture><br>Grok Build</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/hermes-agent"><img alt="Hermes Agent" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/hermes.png" height="32"><br>Hermes Agent</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/kimi-code"><img alt="Kimi Code" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/kimi-cli.png" height="32"><br>Kimi Code</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/openclaw"><img alt="OpenClaw" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/openclaw.png" height="32"><br>OpenClaw</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/opencode"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/opencode-dark.svg"><img alt="OpenCode" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/opencode-light.svg" height="32"></picture><br>OpenCode</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/pi"><img alt="Pi" src="https://raw.githubusercontent.com/kenryu42/cc-safety-net/v2.7.0/.github/assets/pi.svg" height="32"><br>Pi</a></td>
  </tr>
</table>


## Features

- **Blocks destructive commands** such as `git reset --hard`, `git push --force`, and `rm -rf` on dangerous targets, and install scripts piped from the internet (`curl … | bash`), even inside `bash -c` or `python -c`. See [Blocked commands](https://ccsafetynet.com/docs/reference/blocked-commands).
- **Blocks secret access** to SSH keys, `.env` files, `~/.aws`, and coding-CLI credentials, from the shell and from the agent's file tools. See [Secret protection](https://ccsafetynet.com/docs/reference/secret-protection).
- **Tunes the policy in a GUI.** Run `npx cc-safety-net gui` to pick the Standard, Strict, or Paranoid preset and turn rules on or off. See [Dashboard](https://ccsafetynet.com/docs/guides/dashboard).
- **Adds blocks through rulebooks**: official packs for Terraform, AWS, gcloud, and Azure, or your own JSON. See [Official rulebooks](https://ccsafetynet.com/docs/configuration/rulebooks).
- **Shares policy through git.** Commit `.cc-safety-net/` so clones and cloud sessions get the same rules. See [Team setup](https://ccsafetynet.com/docs/guides/team-setup).
- **Embeds in your own tools.** Call `checkCommand` from Node.js without installing the hook. See [Library API](https://ccsafetynet.com/docs/reference/library-api).

## Quick start

You need Node.js 22 or higher. Install into the coding CLIs on this machine, then check that protection is working:

```bash
npx -y cc-safety-net@latest install
npx -y cc-safety-net@latest doctor
```

Update with `npx -y cc-safety-net@latest update` and uninstall with `npx -y cc-safety-net uninstall`. Keep the `@latest` qualifier: a bare `cc-safety-net` spec can run an older copy from the npx cache. Per-CLI requirements are in [Installation](https://ccsafetynet.com/docs/installation).

## Development

See [CONTRIBUTING.md](https://github.com/kenryu42/cc-safety-net/blob/v2.7.0/CONTRIBUTING.md) to report a bug or request a feature.

## License

MIT
