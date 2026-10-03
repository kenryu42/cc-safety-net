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

https://github.com/user-attachments/assets/928dbe97-31e3-41d1-b35a-7941a701b056

</div>

CC Safety Net (Coding CLI Safety Net) blocks destructive commands and access to secrets such as SSH keys and `.env` files before the tool call runs. It parses what the command does. Wrapping the command or reordering flags does not hide it. A broken config file never blocks anything. It is not a sandbox: it does not contain processes, set filesystem permissions, or watch network egress.

> [!NOTE]
> **[Full documentation →](https://ccsafetynet.com/docs)** covers installation, configuration, reference material, guides, and the security model. This README is the short version.

## How it works

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/how-it-works-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./.github/assets/how-it-works-light.svg">
    <img alt="An AI coding agent tries to run a command or open a file. CC Safety Net checks what it would actually do before it runs. Safe calls such as git status run normally; dangerous ones such as git reset --hard never run, and the agent is told why." src="./.github/assets/how-it-works-light.svg" width="720">
  </picture>
</p>

## Supported coding CLIs

CC Safety Net supports these coding agent CLIs on Windows, macOS, and Linux.

<table align="center">
  <tr>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#amp-code-installation"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/amp-dark.svg"><img alt="Amp Code" src="./.github/assets/amp-light.svg" height="32"></picture><br>Amp Code</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#antigravity-cli-installation"><img alt="Antigravity CLI" src="./.github/assets/antigravity-cli.png" height="32"><br>Antigravity CLI</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#claude-code-installation"><img alt="Claude Code" src="./.github/assets/claude-code.svg" height="32"><br>Claude Code</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#codex-installation"><img alt="Codex" src="./.github/assets/codex.svg" height="32"><br>Codex</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#cursor-installation"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/cursor-dark.svg"><img alt="Cursor" src="./.github/assets/cursor-light.svg" height="32"></picture><br>Cursor</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#deepseek-harness-installation"><img alt="DeepSeek Harness" src="./.github/assets/deepseek.svg" height="32"><br>DeepSeek Harness</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#factory-droid-installation"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/droid-dark.svg"><img alt="Factory Droid" src="./.github/assets/droid-light.svg" height="32"></picture><br>Factory Droid</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#gemini-cli-installation"><img alt="Gemini CLI" src="./.github/assets/gemini-cli.svg" height="32"><br>Gemini CLI</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#github-copilot-cli-installation"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/copilot-cli-dark.svg"><img alt="GitHub Copilot CLI" src="./.github/assets/copilot-cli-light.svg" height="32"></picture><br>GitHub Copilot CLI</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#grok-build-installation"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/grok-build-dark.svg"><img alt="Grok Build" src="./.github/assets/grok-build-light.svg" height="32"></picture><br>Grok Build</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#hermes-agent-installation"><img alt="Hermes Agent" src="./.github/assets/hermes.png" height="32"><br>Hermes Agent</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#kimi-code-installation"><img alt="Kimi Code" src="./.github/assets/kimi-cli.png" height="32"><br>Kimi Code</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#openclaw-installation"><img alt="OpenClaw" src="./.github/assets/openclaw.png" height="32"><br>OpenClaw</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#opencode-installation"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/opencode-dark.svg"><img alt="OpenCode" src="./.github/assets/opencode-light.svg" height="32"></picture><br>OpenCode</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation#pi-installation"><img alt="Pi" src="./.github/assets/pi.svg" height="32"><br>Pi</a></td>
  </tr>
</table>


## Features

- **Blocks destructive commands** such as `git reset --hard`, `git push --force`, and `rm -rf` on dangerous targets, even inside `bash -c` or `python -c`. See [Blocked Commands](https://ccsafetynet.com/docs/reference/blocked-commands).
- **Blocks secret access** to SSH keys, `.env` files, `~/.aws`, and coding-CLI credentials, from the shell and from the agent's file tools. See [Secret Protection](https://ccsafetynet.com/docs/reference/secret-protection).
- **Tunes the policy in a GUI.** Run `npx cc-safety-net gui` to pick the Standard, Strict, or Paranoid preset and turn rules on or off. See [Modes](https://ccsafetynet.com/docs/configuration/modes).
- **Adds blocks through rulebooks**: official packs for Terraform, AWS, gcloud, and Azure, or your own JSON. See [Official Rulebooks](https://ccsafetynet.com/docs/configuration/rulebooks).
- **Shares policy through git.** Commit `.cc-safety-net/` so clones and cloud sessions get the same rules. See [Team Setup](https://ccsafetynet.com/docs/guides/team-setup).
- **Embeds in your own tools.** Call `checkCommand` from Node.js without installing the hook. See [Library API](https://ccsafetynet.com/docs/reference/library-api).

## Quick start

You need Node.js 18 or higher. Install into the coding CLIs on this machine, then check that protection is working:

```bash
npx -y cc-safety-net@latest install
npx -y cc-safety-net@latest doctor
```

Update with `npx -y cc-safety-net@latest update` and uninstall with `npx -y cc-safety-net uninstall`. Keep the `@latest` qualifier: a bare `cc-safety-net` spec can run an older copy from the npx cache. Per-CLI requirements are in [Installation](https://ccsafetynet.com/docs/installation).

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute to the project.

## License

MIT
