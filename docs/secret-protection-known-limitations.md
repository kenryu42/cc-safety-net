# Secret Protection Known Limitations

CC Safety Net's secret protection is a static pre-execution command analysis
layer. It blocks many common ways an agent can read or write sensitive paths
before a shell command runs, but it is not a sandbox and does not evaluate
arbitrary shell or interpreter semantics.

## Current Static Coverage

The static parser is intended to catch direct and common-obfuscated references
to all built-in sensitive path rules from `src/rules/secret-protection-rules.ts`
and configured `denyPaths`, including:

- direct path operands such as `cat .env`
- unlisted file readers such as `xxd .env`, `base64 .env`, or `dd if=.env`
- shell assignment indirection where the assignment contains the sensitive path
- interpreter inline-code literals such as `python3 -c "open('.env')"`
- base64/base64url complete-path literals inside interpreter inline code
- base64/base64url complete-path values decoded inside command substitutions,
  such as `$(echo LmVudg== | base64 -d)`

Decoded candidates are fed through the existing sensitive-path matcher. They
are not hardcoded to `.env`.

## Known Limitation: Reconstructed Interpreter Strings

Static parsing does not evaluate interpreter expressions that reconstruct a
sensitive path at runtime. The following shapes are known limitations:

```sh
python3 -c "
import os
e = chr(46) + chr(101) + chr(110) + chr(118)
p = os.path.expanduser('~/Developer/420024-lab/test-cc/') + e
print(open(p).read())
"
```

```sh
python3 -c "
import os
h = '2e' + '656e76'
e = bytes.fromhex(h).decode()
p = os.path.expanduser('~/Developer/420024-lab/test-cc/') + e
open(p, 'a').write('# HEX_WRITE=works\n')
"
```

The same class includes:

- `chr()` / `String.fromCharCode()` / equivalent character assembly
- split base64, hex, URL, or escape-sequence fragments
- string concatenation, joining, reversing, slicing, or arithmetic transforms
- variables that flow through interpreter code before being used as a path
- runtime-generated filenames discovered from directory listings or globs
- shell expansions that compute the final path only after the hook returns

## Why This Is Not Chased in Static Parsing

Handling these examples reliably would require building and maintaining partial
interpreters for Python, Node, Ruby, shell, and other languages. Even then, the
coverage would remain incomplete: every added expression rule creates nearby
variants using arithmetic, helper functions, dynamic imports, aliases, external
programs, or data read at runtime.

For that reason, CC Safety Net treats expression-level path reconstruction as an
accepted residual risk of static analysis. The static layer should keep closing
simple, reusable bypass shapes when they can be handled generically with low
false-positive risk, but it should not become a fragile interpreter emulator.

## Complete Mitigation

The complete mitigation for this class is runtime filesystem enforcement, such
as operating-system permissions, a sandbox, container isolation, Landlock on
Linux, or another policy that prevents the executed process from opening
sensitive files even if the command text evades static detection.

## Known Limitation: A Deny Path Covering the Workspace

Configuration validation rejects the deny entries that would block every
command in every workspace under the home directory: home itself, any path
above it, and `/`, in their `~`, `$HOME`, and `${HOME}` spellings too
(`getSecretDenyPathError` in `src/policy/allow-paths.ts`). The check
runs at the same save-time sites as the allow-path home guard — the policy
diagnostics in `src/core/policy/user-policy-diagnostics.ts`, the salvage repair in
`src/policy/store.ts`, which drops rejected entries and reports them, and the
GUI deny-path list, which posts the candidate policy to `/api/policy/preview`
and surfaces the rejection inline before the entry is added.

Validation deliberately stops there. An entry that names a specific workspace
— the project path itself, or a relative entry such as `.` (relative entries
are supported behavior; they resolve against the config cwd, which
`tests/guards/secret-protection.test.ts` pins) — cannot be judged at save time:
whether it covers the session depends on each session's cwd, and denying a
project directory is legitimate configuration when working from somewhere
else.

Inside a workspace such an entry covers, essentially every command blocks.
Operand extraction is fail-safe: an operand that is not recognized as
something else is kept as a path candidate and resolved against the cwd, so
`ls src` blocks on `src`, `git status` blocks on `status`, and
`cat README.md` blocks on `README.md`. What survives is the narrow set whose
tokens are not kept as path candidates: operand-less commands, `echo` and
`printf`, and shapes such as a pattern-only `grep` or interpreter inline code
with no path-like literal. In standard mode an interpreter string literal that
no access call, locally defined function, or shell-exec call uses is inert data
and is not kept as a candidate; strict mode keeps every literal.

The failure is loud, not silent. Each denial carries `Rule: secret.deny-path`
in the hook message (`formatBlockedMessage` in `src/integrations/format.ts`), and
secret-protection denials use the `hard_stop` footer, which tells the agent to
stop retrying and report the block to the user.

Diagnosis from inside the session is unavailable in this state:

- `cc-safety-net status` is blocked. The analyzer's carve-out for the CLI
  (`extractSafetyNetExplainPathTargets` in `src/guards/secret-protection.ts`)
  recognizes only the `explain` subcommand, and `status` was added after it, so
  the literal word `status` stays an ordinary operand and resolves to
  `<cwd>/status`.
- `cc-safety-net explain` is blocked despite its carve-out, because the
  carve-out keeps the executable token itself among the candidate targets, and
  `cc-safety-net` resolves to `<cwd>/cc-safety-net` — a child of any deny root
  covering the cwd.

Recovery is out of band. The hook sees only agent tool calls, so the user's own
shell and the GUI policy editor keep working; removing or narrowing the entry
there restores the session.

## Why Deny-Path Validation Stops at Home

The residual misconfiguration fails closed. It is immediate, it names its own
rule id in every message, and it is repaired from a shell the hook does not
guard. That is the opposite of `destructive_command_protection.allow_paths`,
whose home guard exists because an allow path covering home fails open and
silently: protection disappears with nothing printed anywhere. For the same
reason the allow-path guard re-checks its roots after symlink canonicalization
at match time (`resolveAllowRoots`), while deny paths get no match-time
validation: a deny entry can only over-block, never widen access.

The deny-path matcher itself stays fail-safe and unvalidated:
`tests/guards/secret-protection.test.ts` deliberately pins that
`denyPaths: ['/']` matches everything at the matcher level, so a
home-covering value that reaches the matcher from outside a validated config
still blocks rather than being silently ignored.

## Known Limitation: Operating-System Keyrings

Some coding CLI tools keep the primary login token in the operating-system
keyring. A keyring entry has no file path. Thus no path rule can protect it.
This applies to the primary login of Antigravity CLI, Claude Code on macOS,
Copilot CLI, Cursor on macOS, and Gemini CLI. For these products, the path
rules protect the related credential and configuration files only.

## Known Limitation: Windows Path Forms

The path matcher does no `%VAR%` expansion. It does not read `%APPDATA%` or
`%USERPROFILE%`. A rule anchored to `~` thus covers a Windows host only when
the process resolves `~` to the same directory. No failure from a Windows host
is reported. Examine this limit again after the first report from a Windows
host.

## Known Limitation: `.envrc` Files

An `.envrc` file can export credentials into the environment. CC Safety Net
does not block it. This is a decision, not a gap. Most `.envrc` files hold
`use flake`, `layout python`, or `PATH` edits. A block on this name thus stops
routine shell work. The `.env` files that hold the values are already
protected.
