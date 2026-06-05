# Security Policy

## Supported Versions

Security fixes are provided for the latest published release of `cc-safety-net`.

If you are using an older version, please upgrade to the latest version before reporting an issue unless the vulnerability also affects the latest release.

## Reporting a Vulnerability

Please do not report security vulnerabilities in public GitHub issues.

Use GitHub private vulnerability reporting for this repository when available. If that is unavailable, email the maintainer at jliew@420024lab.com.

Include as much detail as you can safely share:

- The affected `cc-safety-net` version
- Your operating system and runtime version
- The affected integration, such as Claude Code, OpenCode, Gemini CLI, GitHub Copilot CLI, or Codex
- Steps to reproduce the issue
- The command or input that bypasses, weakens, or abuses CC Safety Net
- Any relevant output from `cc-safety-net explain` or `cc-safety-net doctor`
- Whether the issue can cause data loss, command execution, secret exposure, or another concrete security impact

Please redact tokens, credentials, private repository names, and sensitive file paths before sending logs or command output.

## What Counts as a Security Issue

Examples of security issues include:

- A bypass that allows a clearly destructive command to execute when CC Safety Net should block it
- A parsing or wrapper-analysis flaw that makes documented protections ineffective
- Leakage of secrets through block messages, audit logs, diagnostics, or debug output
- A path traversal or filesystem issue in audit logging or configuration handling
- A supply-chain or packaging issue that affects the published npm package or plugin distribution

## What Should Be Reported Publicly Instead

Please use normal GitHub issues for:

- False positives where a safe command is blocked
- Missing convenience rules or new feature requests
- Documentation bugs
- Installation problems without a security impact
- Questions about custom rules or configuration

## Response Expectations

You should receive an initial response within 7 days.

The maintainer will work with you to confirm the impact, identify affected versions, prepare a fix, and coordinate disclosure. Please give the maintainer reasonable time to investigate before publishing details publicly.

## Disclosure

When a vulnerability is confirmed, the maintainer will publish a fix as soon as practical and may publish a GitHub security advisory or release note with appropriate credit, unless you request otherwise.

Please do not publicly disclose exploit details until a fixed version is available.
