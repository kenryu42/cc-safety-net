---
name: cc-safety-net
description: Configure CC Safety Net rulebooks for user, project, or shareable GitHub scope.
---

<!-- Keep the workflow below in sync with src/opencode/builtin-commands/templates/cc-safety-net.ts. -->

## Workflow

Help the user configure custom blocking rules for CC Safety Net.

Use information already provided in the user's prompt. Ask only when the scope, action, rule intent, merge behavior, or target command is unclear.

1. Run `npx -y cc-safety-net rule doc` and treat that output as the complete source of truth for schema, paths, GitHub sources, matching behavior, and validation.
2. Determine the requested scope from the prompt when possible:
   - User: applies to all projects.
   - Project: applies only to the current project.
   - GitHub: edits or creates a shareable rulebook structure in the current repository.
3. Determine whether to add a rule, edit a rule, disable a rule, override a reason, migrate legacy rules, or explain custom rules from the prompt when possible.
4. Inspect existing configs before modifying installed local rules:
   - Run `npx -y cc-safety-net rule verify`
   - Run `npx -y cc-safety-net rule list`
5. Inspect relevant project files only when the user asks for rule suggestions or the requested rule depends on project context. Look at manifests, scripts, task runners, CI, infrastructure, database, migration, and deployment files that explain risky commands.
6. Convert the request into valid CC Safety Net JSON using `rule doc`.
   - For User or Project scope, add or edit the selected local `rule.json` and `<rulebook-name>/rulebook.json`.
   - For GitHub scope, add or edit `.cc-safety-net/rules/<rulebook-name>/rulebook.json` in the current repository.
   - Do not offer to add a GitHub source with `owner/repo`; installing rules from a GitHub source is outside this workflow.
7. Preserve unrelated existing rulebook sources, overrides, and rulebooks. Preview proposed JSON before writing when creating a new rulebook, merging with existing config, or resolving ambiguity.
8. For GitHub rules, ensure the repository layout is `.cc-safety-net/rules/<rulebook-name>/rulebook.json`, and ensure the source name, directory name, and rulebook `name` match exactly.
9. Validate after edits:
   - Project rules: run `npx -y cc-safety-net rule sync`, `npx -y cc-safety-net rule verify`, `npx -y cc-safety-net rule test`, and `npx -y cc-safety-net rule list`.
   - User rules: run `npx -y cc-safety-net rule sync --global`, `npx -y cc-safety-net rule verify`, `npx -y cc-safety-net rule test --global`, and `npx -y cc-safety-net rule list`.
   - Shareable GitHub rulebook-only edits: run `npx -y cc-safety-net rule verify` and `npx -y cc-safety-net rule test <rulebook-name>`. Run `sync` and `list` only if the rulebook is also installed in local `rule.json`.
10. If validation or tests fail, show the exact errors and make the smallest fix.
11. Confirm the saved paths or GitHub rulebook path and summarize the added or updated rules.

## Rules

- Custom rules can only add restrictions; they cannot bypass built-in CC Safety Net protections.
- Config files list rulebook sources. Rule definitions live in `rulebook.json`, not directly in `rule.json`.
- Do not use legacy inline `.safety-net.json` or `~/.cc-safety-net/config.json` rules. Convert existing legacy files with `npx -y cc-safety-net rule migrate`.
- Every rule command must be listed in `allowed_commands`, and every rule must have at least one blocked fixture.
- Blocked fixtures must specify the expected `rule`; include allowed fixtures for close-but-safe commands.
- Local source names are bare names such as `project-rules`; do not put filesystem paths in `rules`.
- Invalid config, corrupt cache, invalid local rulebooks, or remote rulebook repair failures fail closed until repaired with `npx -y cc-safety-net rule sync`.
