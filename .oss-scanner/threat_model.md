# Threat model

CC Safety Net is a pre-execution hook for AI coding agents (Claude Code, Codex, Cursor, OpenCode, Pi, and others).
Before an agent's tool call runs, the host passes it to CC Safety Net, which statically analyzes it and allows or
denies it. It blocks destructive Git and filesystem commands and access to sensitive files. It is a best-effort
policy gate, not a sandbox or privilege boundary. `SECURITY.md` is the full contract; this file summarizes it for
triage.

## Where untrusted input enters

- **Hook payloads** (`cc-safety-net hook --<integration>`, JSON on stdin; `src/hosts/`, `src/gate/intake.ts`). The
  tool name, command text, file paths, and patch bodies are written by an LLM that may be under prompt injection.
  Treat all of it as attacker-controlled.
- **The working directory**: files, symlinks, `.git` contents, and project policy or rulebooks that a cloned
  repository can ship (`src/core/policy/`, `src/core/git/`).
- **Remote rulebooks** fetched by `cc-safety-net rule sync` from GitHub, pinned by lock and digest
  (`src/rules-manager/`).
- **The local GUI** (`cc-safety-net gui`), an HTTP server on `127.0.0.1` guarded by a per-session token
  (`src/gui/`). Other local processes and web pages in the user's browser are untrusted.

Trusted: the user's own `policy.json`, the host agent CLI, and the operating system.

## What matters most

1. **The tool becoming the harmful vector.** Examples: code execution from an analyzed payload or rulebook (fixtures
   must never run), writes outside the intended directories through audit logging or config handling, secrets
   leaking through block messages, audit logs, `doctor`/`explain` output or GUI report prefills, a rulebook
   integrity bypass, or GUI access without the token.
2. **Catastrophic protections failing in any mode on a command a helpful agent plausibly writes**: recursive
   deletion of `/` or the home directory, destructive mutation of the protected Git metadata set, or destructive
   mutation of the canonical user `policy.json`.
3. **Strict or paranoid mode failing open** where `SECURITY.md` documents fail-closed behavior.
4. **Resource bounds** in `SECURITY.md` (payload size, parser limits, rulebook limits, sync budget) not holding:
   unbounded recursion, catastrophic regex backtracking, or a crash that lets a call through.

## How to exercise it

- `bun run cc-safety-net explain --cwd <dir> "<command>"` prints the full analysis trace and verdict for a command.
  `CC_SAFETY_NET_LEVEL=strict` or `paranoid` selects a safety level.
- `printf '%s' '<payload json>' | bun run cc-safety-net hook --claude-code` runs a real hook decision. Payload shapes
  for every integration are in `tests/hosts/` and `tests/fixtures/`.
- `tests/gate/` holds the analyzer suites and `tests/gate/behavioral-contract-cases.ts` the must-block corpus.
  `bun test tests --path-ignore-patterns 'tests/e2e-live/**'` runs everything offline.
- Point `CC_SAFETY_NET_HOME` at a temporary directory so experiments do not touch real user config.

## How we rate severity

- **Critical**: code execution, or writing or deleting files, driven by a hook payload, repository content, or a
  remote rulebook through CC Safety Net itself; GUI access without the token from a browser page or another
  user's process; a rulebook integrity bypass that lets unpinned content weaken a user's policy.
- **High**: secret disclosure through CC Safety Net's own output or logs; path traversal in audit or config writes;
  a command a helpful agent plausibly writes during ordinary coding work that defeats a catastrophic protection
  in any mode.
- **Medium**: strict or paranoid mode failing open on a documented fail-closed shape; an adapter crash or
  malformed-input path that allows a call on a host documented as fail-closed; a resource-bound regression.
- **Low**: a standard-mode bypass of a documented rule by a command shape an agent plausibly writes without
  adversarial intent.
- **Informational**: standard-mode bypasses that need crafted input, a crafted command that defeats a catastrophic
  protection such as deleting root or home, and anything already listed below.

Standard mode is a blocklist and admits endless constructed bypasses. CC Safety Net fixes the commands helpful
agents write, not shapes built to evade it, so a constructed bypass rates Informational and needs no report. For a
command an agent plausibly writes, name the ordinary task that produces it.

## Out of scope

- Families in `docs/residual-risk.md` and `docs/residual-risk-registry.json` (RR-1 to RR-15) in standard mode, and
  the limits in `docs/secret-protection-known-limitations.md`.
- Host gaps documented in `SECURITY.md`: Codex `write_stdin`, the missing Codex `workdir` and OpenClaw execution
  directory, hosts that fail open by design (Grok Build, Factory Droid, Devin CLI), and DeepSeek Harness optional
  plugin loading.
- An agent editing `rule.json`, rulebooks, lockfiles, or caches. Tamper resistance covers `policy.json` only.
- Anything an agent does outside a hooked tool call, or after a user-approved prompt.
- False positives (a safe command blocked). These are bugs, not security issues.
- `dist/` (generated from `src/`), `tests/`, `scripts/`, `evals/`, `docs/`, and `tests/e2e-live/`, which needs
  network access and real agent CLIs.
