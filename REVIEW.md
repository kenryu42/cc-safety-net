# Code Review Rules

## Threat model and review boundary

- Treat standard mode as protection for helpful, non-adversarial coding agents making accidental mistakes. Follow the standard/strict/paranoid contract documented in `SECURITY.md`.
- Standard mode must block recognizable destructive operations, but it is not expected to be bypass-proof against deliberately crafted shell syntax, placeholder combinations, or runtime mutation.
- Adversarial commands, prompt injection, and unverifiable execution belong to strict/paranoid mode. Those modes should fail closed without requiring exact emulation of every shell or utility.
- Do not add exact shell, interpreter, xargs, GNU Parallel, or tool-language emulation solely to close a crafted standard-mode bypass. Prefer a simpler ownership boundary, bounded conservative check, strict-only denial, documented residual risk, or OS-level sandbox.
- A review finding is merge-blocking when it demonstrates a plausible accidental command from a helpful agent, violates the documented mode contract, causes a false negative for recognizable danger, or creates an availability/resource-exhaustion problem.
- Findings that require intentionally adversarial construction in standard mode should be classified as accepted residual risk or follow-up hardening unless the user explicitly expands the threat model.
- Adjudicated bypass families live in `docs/residual-risk.md`; consult it before debating a finding. Matches are pre-adjudicated residual risk, and the productive response to a crafted bypass in a listed family is a strict or paranoid fail-closed fixture, not a standard-mode parser patch.
- A standard-mode false-negative finding enters remediation only with plausible non-adversarial provenance: a realistic agent task or real-world sighting that produces the command shape. New behavioral-contract corpus entries come from field evidence, not reviewer construction.
- Severity labels from review bots ("Major", "P1") are not a classification. Classify every finding by the order under "Automated finding classification", whatever label it arrives with; findings from autoreview and from review bots count alike.
- Review rounds continue only while they produce must-fix work. Fix every must-fix finding (a regression against main — a deny that becomes an allow, or a new false positive on a command agents run — a never-residual guarantee, or a standard-mode false negative with realistic provenance) in whatever round it appears, each with its failing test first. A round whose remaining findings are all reviewer-constructed, out-of-scope, or accepted residual ends review without asking the maintainer: record those findings as known gaps in the PR description and the work's plan, and ship.
- Never refine a mechanism to close a reviewer-constructed finding. Its only remedy is one positionless refusal within the cost threshold in `docs/residual-risk.md`, applied without another autoreview round because the PR's review bots cover it, or a known gap.
- When must-fix findings hit the same mechanism (the same scanner, walker, or matcher) in two rounds, the next remedy is a positionless refusal of the shapes that mechanism cannot read, never a further refinement of it.
- When a PR reaches five fix commits after its first bot review, stop and ask the maintainer whether to continue or split the work.
- Every finding must propose the smallest sufficient remediation, per the Scope Discipline section of `AGENTS.md`. A proposal that adds process automation, registries, attestations, or new validation frameworks is a suggestion for the maintainer — never merge-blocking, and never implemented in the same remediation pass without explicit user approval. Reviewers do not answer "how could this process be subverted?" with new machinery; unenforceable-process concerns are documented limitations, not findings.
- When invoking isolated autoreview, pass `--prompt-file docs/review-prompt.md`; it inlines this threat model, the ranked review priorities, and the residual-risk families for the isolated reviewer.
- Also pass `--prompt` with a concise task-specific overview: why the change exists, its intended behavior, its scope and ownership boundary, and any deliberately unchanged or generated code. When generated artifacts relocate unchanged source, say so explicitly and direct the reviewer to evaluate the generator and artifact contract instead of treating the relocated logic as newly introduced.

## Automated finding classification

The primary agent owns classification after verifying each finding against the real source, tests,
task scope, and current diff. The reviewer that discovers a finding does not adjudicate its own
residual-risk proposal.

Classify findings in this order:

1. Unchanged or unrelated behavior is **out-of-scope**.
2. Anything listed under "What Is Never Residual Risk" is **must-fix**, even if its command shape
   resembles an existing family. When the triggering input is reviewer-constructed, the fix is
   limited to the positionless refusal that section describes.
3. A match for an existing `docs/residual-risk.md` family is
   **accepted-existing-residual** and does not create a new entry.
4. A standard-mode false negative with realistic non-adversarial provenance or field evidence is
   **must-fix**. Realistic provenance means the shape appears in the real-world command corpus,
   audit logs, or published install or usage docs, or is composed only of ordinary utilities and
   options an agent uses for their normal purpose (`timeout`, `sudo`, `gunzip`, `tee`, pipes,
   redirects to files). A shape whose only purpose is to defeat analysis (fd duplication or
   `/dev/stdin` aliasing, quote or escape games, nested evaluation, constructed variable
   indirection) is reviewer-constructed.
5. A reviewer-constructed finding without enough source or contract proof is
   **evidence-invalid**.
6. Only a distinct, documented analysis or ownership boundary may become an
   **accepted-new-residual** candidate.

Uncertainty never creates a new family. If uncertainty touches a never-residual guarantee, classify
the finding as must-fix, with the same remedy limit. Otherwise classify it as evidence-invalid.

### Independent confirmation for a new family

For an accepted-new-residual candidate, the primary agent must spawn one independent classification
subagent without inherited conversation history when the agent runtime supports it. Otherwise use
an equivalently isolated reviewer. Give it the finding, reviewed diff, `REVIEW.md`, `SECURITY.md`,
`AGENTS.md`, the residual-risk registry, and relevant source and tests. Label the primary
classification as untrusted, use a neutral prompt, and prohibit edits and nested reviewers.

The agent runtime enforces the separate, context-isolated execution. Each classifier must return a
structured decision containing:

- whether the finding is introduced or exposed by the change;
- whether it touches a never-residual guarantee;
- whether realistic provenance or field evidence exists;
- an existing-family match or `null`;
- the documented boundary that owns the limitation;
- whether accepting it would require changing `SECURITY.md`;
- the specific fail-closed mode, `strict` or `paranoid`;
- whether the family is distinct rather than another command shape;
- repository-relative evidence paths with concise notes.

The primary and confirmation decisions must agree on every gate. Any agent identifying a
never-residual condition makes the finding must-fix. An existing-family match uses that family. A
disagreement or missing proof makes the finding evidence-invalid. The process must not change
`SECURITY.md` to justify an accepted residual risk.

Use this neutral confirmation prompt:

```text
Independently classify this finding. Do not assume the proposed classification is correct.
Determine whether it is must-fix, covered by an existing residual family, a genuinely new residual
family, evidence-invalid, or out-of-scope. Return the required structured decision and cite concrete
repository evidence.
```

After agreement, add the strict or paranoid fail-closed fixture first, then add the family to both
`docs/residual-risk-registry.json` and `docs/residual-risk.md`. Confirm in review that the entry
records the candidate, boundary, evidence paths, fixture, and identifiers, and that the registry
and Markdown stay synchronized.
