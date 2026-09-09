# Release notes draft — the greenfield rebuild

A draft for the release that ships the rebuilt `src/`. Numbers marked "measured" come from the
sandbox the rebuild was verified in; re-measure on the release machine before publishing.

## Secret protection now follows `cd`

The secret matcher used to inspect each command segment on its own, so `cat ~/.ssh/config` was
denied while `cd ~ && cat .ssh/config` read the same file and was allowed. The matcher now walks
the command with the same shell-state tracking the protected-path guards have always used: a
`cd` moves the directory later relative operands resolve against, and a simple assignment that
holds a directory is followed when a `cd` dereferences it.

What changes for a user:

- `cd ~ && cat .ssh/config`, `cd ~ && cat .ssh/config | grep Host`, `cd ~ && cat > .ssh/config`
  and `d=~; cd "$d" && cat .ssh/config` are denied at every level, with the operand (`.ssh/config`)
  reported as the evidence.
- A read before the `cd` (`cat .ssh/config && cd ~`) resolves against the directory the command
  actually runs in, as before.
- The walk follows the shell's directory scope: `cd -` returns to the previous directory, and a
  `cd` inside a subshell, `$( )`, backticks or a process substitution ends with that shell, so
  `(cd ~) && cat .ssh/config` and `x=$(cd ~; ls); cat .ssh/config` read `.ssh/config` where the
  command actually runs, while `(cd project && pwd) && cat .ssh/config` from the home directory
  and `cd project && cd - && cat .ssh/config` are denied. A brace group or a function body runs in
  the current shell, so its `cd` still counts. `pushd`/`popd` stay untracked, an operand inside an
  interpreter body (`sh -c '…'`) resolves against the segment that runs the interpreter, and a
  `cd` inside that body is scanned as text. A `cd` to an unset variable or to a command
  substitution leaves later relative operands unresolvable, which the matcher treats as before.

No policy change is needed; the rules, levels and `secretProtection` configuration are the same.

The policy GUI reads Git facts fresh on every request, so a `.git` marker created or removed while
the GUI is open changes its command tester's answer at once instead of at the next restart.

## The hook's configuration warning names what it dropped

When `policy.json` holds something the loader will not accept, the loader salvages the rest and the
next user-visible denial carries a `Config warning:` line. That line now names the section or field
that was dropped, in the loader's own plain wording, instead of repeating the schema's sentence. For
a file with an unknown `tier` key and an unusable `safety.level`:

- before: `invalid policy config: <path>: unknown field "tier"; <path>: safety.level must be
  "standard", "strict", or "paranoid". …`
- after: `invalid policy config: <path>: safety.level: not one of standard, strict, paranoid;
  <path>: tier: unknown field. …`

A file that is valid JSON but not an object reports `<path>: not a JSON object` where it used to
report `<path>: Config must be an object`. Nothing else about the warning changes: which failures
degrade the snapshot, which values survive salvage, and the audit `configFallback` flag are all as
before, and `cc-safety-net doctor` and `cc-safety-net policy check` keep the schema wording they
have always printed.

## Same contract, rebuilt implementation

The hook, CLI, API, GUI and every host integration keep their behavior: the rebuild was verified
command by command against the previous implementation, on the same fixtures, before the old code
was removed, and the expectations that comparison established are now stated in the test suite.

- Hook cold start: the hook path is a lean entry that loads only what a decision needs. Measured:
  node itself 30 ms, the hook 99 ms median over seven interleaved runs on the verification
  sandbox, with a test that fails if the hook exceeds node's startup by more than 150 ms or if
  the hook's static import closure exceeds 400,000 bytes (measured 344,139).
- Package: zod is gone entirely. The user-policy and legacy-config diagnostics are hand-written
  issue lists beside the `rule.json` one, `assets/cc-safety-net.schema.json` is a hand-maintained
  asset held to the validator by a test, and the published manifest declares no dependencies at all
  (package verification fails if one reappears). Packed tarball measured under the 560,000-byte cap
  the package verification enforces.
- Diagnostics: `doctor --json` keeps its shape; `explain`, `status`, `logs` and the rules manager
  print the same text.

## For contributors

`src/` is now layered as core → gate → audit → hosts → rules-manager → cli → gui → entries, with
an architecture test that forbids upward imports and sockets outside the GUI. The CLI runs from
source as `bun run src/entries/bin.ts`, and the self-invocation guard recognizes that path.
Tests live under `tests/` mirroring `src/`, and state their expectations directly. Two recordings
remain, for the output surfaces whose bytes are the contract: the `explain` and `doctor --json`
snapshots under `tests/cli/*/__snapshots__`. Beside them the gate's replay reads
`tests/fixtures/gate/harvested-verdicts.jsonl`, a readable verdict per literal that is edited by
hand. The port-time digests and their recording switches are gone. A behavior change lands as a
failing stated expectation first; a commit that re-records a snapshot or flips a table row names
which entries changed and why.

Three duplications the rebuild had carried are gone:

- One policy validator. The salvage normalizer in `core/policy/store.ts` owns runtime acceptance of
  `policy.json` and reports what it dropped; the hand-written mirror of the schema is deleted. The
  diagnostic surfaces — `doctor`, `policy check`, the GUI, `diff.ts` and the legacy-config writer —
  share one issue list in `core/policy/user-policy-diagnostics.ts`, and no schema library is
  involved.
- One per-command dispatcher. `gate/analyzer/segment.ts` decides every command, and a child
  synthesized by `xargs`, `parallel`, a `find -exec` body or the unknown-head suffix scan enters it
  as command words carrying a `ChildProvenance` instead of through a door of its own. Custom-rule
  matching, built-in filtering, trace recording and budget accounting each happen in one place;
  wrapper peeling shares one algorithm but still runs from two sites, the dispatcher for the
  command as written and `normalizeChildCommands` for a synthesized child.
- One guard walk. `gate/guards/guard-walk.ts` reads the parsed tree and replays it through a
  word/segment/redirection visitor; every pre-analysis guard, secret protection included, drives it,
  and the flat `core/shell/projection.ts` entry stream is deleted. The destructive analyzer keeps
  its own control-flow walk by design.
