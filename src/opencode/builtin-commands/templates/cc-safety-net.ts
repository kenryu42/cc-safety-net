export const CC_SAFETY_NET_TEMPLATE = `
## Workflow

**STRICT**: Use ask questions tool if possible

Help the user configure custom blocking rules for CC Safety Net.

Use information already provided in the user's prompt. Do not ask for scope, action, rule intent, rulebook name, or target command again when the prompt already provides enough information to proceed confidently.

1. Run \`npx -y cc-safety-net rule doc\` and treat that output as the complete source of truth for schema, paths, GitHub sources, matching behavior, and validation.
2. Inspect existing configs before proposing edits:
   - Run \`npx -y cc-safety-net rule verify\`
   - Run \`npx -y cc-safety-net rule list\`
3. Determine the requested scope from the user's prompt when possible. Ask only if the prompt does not already make the scope clear:
   - User: applies to all projects.
   - Project: applies only to the current project.
   - GitHub: edits or creates a shareable rulebook structure in the current repository.
4. Determine whether the user wants to add a rule or edit an existing rule from the prompt when possible. Ask only if the prompt does not already make the action clear:
   - For User or Project scope, add or edit rules in the selected local rulebook.
   - For GitHub scope, add or edit rules in \`.cc-safety-net/rules/<rulebook-name>/rulebook.json\` in the current repository.
   - Do not offer to add a GitHub source with \`owner/repo\`; installing rules from a GitHub source is outside this workflow.
   - If GitHub scope is selected and no GitHub rulebook structure exists in the current repository, show the intended path and create it only after confirming the rule with the user.
5. Inspect the project before suggesting rules. Use manifests, lockfiles, build files, scripts, and infrastructure files for any language or ecosystem, including:
   - JavaScript/TypeScript: \`package.json\`, lockfiles, workspace files, \`turbo.json\`, \`vite.config.*\`, \`next.config.*\`
   - Python: \`pyproject.toml\`, \`requirements*.txt\`, \`Pipfile\`, \`poetry.lock\`, \`uv.lock\`, \`tox.ini\`, \`noxfile.py\`
   - Ruby: \`Gemfile\`, \`Gemfile.lock\`, \`Rakefile\`
   - PHP: \`composer.json\`, \`composer.lock\`
   - Go: \`go.mod\`, \`go.sum\`, \`Makefile\`
   - Rust: \`Cargo.toml\`, \`Cargo.lock\`
   - JVM: \`pom.xml\`, \`build.gradle*\`, \`settings.gradle*\`, \`gradle.properties\`
   - .NET: \`*.csproj\`, \`*.fsproj\`, \`*.sln\`, \`Directory.Build.*\`
   - Native/build: \`Makefile\`, \`CMakeLists.txt\`, \`meson.build\`, \`Brewfile\`
   - Database and ORM: \`schema.prisma\`, \`drizzle.config.*\`, \`knexfile.*\`, \`alembic.ini\`, migration directories, SQL files
   - Containers and infrastructure: \`Dockerfile*\`, \`docker-compose*.yml\`, \`compose*.yml\`, Terraform, Pulumi, Kubernetes, Helm, Ansible, CloudFormation, Serverless, and deployment config files
   - Project scripts and task runners: \`justfile\`, \`Taskfile*.yml\`, \`.github/workflows/*.yml\`, CI config files, shell scripts, and release scripts
6. Suggest relevant rule ideas from the inspected files before asking the user to choose. Phrase suggestions as project-specific hypotheses, not facts. For example, database libraries or migration tooling may justify SQL/database mutation rules; Docker or compose files may justify container cleanup rules; deploy, publish, release, migration, reset, prune, destroy, or cleanup scripts may justify command-specific blocking rules.
7. Convert the request into valid SafetyNet JSON using \`rule doc\`. Show the generated config JSON and rulebook JSON, or the GitHub rulebook path and contents, and ask whether it looks correct.
8. If the selected scope already has a config, show it and ask whether to merge or replace. When merging, preserve unrelated existing rulebook sources, overrides, and rulebooks.
9. For local rules, write both files only after user confirmation:
   - Selected-scope \`rule.json\`
   - Selected-scope \`<rulebook-name>/rulebook.json\`
10. For GitHub rules, ensure the repository layout is \`.cc-safety-net/rules/<rulebook-name>/rulebook.json\`, and ensure the source name, directory name, and rulebook \`name\` match exactly.
11. After edits, run:
   - \`npx -y cc-safety-net rule sync\`
   - \`npx -y cc-safety-net rule verify\`
   - \`npx -y cc-safety-net rule test\` for project rules, or \`npx -y cc-safety-net rule test --global\` for user rules
12. Run \`npx -y cc-safety-net rule list\` to confirm active sources, active rules, disabled rules, reason overrides, and issues.
13. If validation or tests fail, show the exact errors, suggest the smallest fix, and confirm before changing files again.
14. Confirm the saved paths or GitHub rulebook path, state that \`rule sync\` verifies local lock/cache consistency, and summarize the added or updated rules.

## Rules

- Custom rules can only add restrictions; they cannot bypass built-in SafetyNet protections.
- Config files list rulebook sources. Rule definitions live in \`rulebook.json\`, not directly in \`rule.json\`.
- Do not use legacy inline \`.safety-net.json\` or \`~/.cc-safety-net/config.json\` rules. Convert existing legacy files with \`npx -y cc-safety-net rule migrate\`.
- Rule names must be unique within the rulebook.
- Every rule command must be listed in \`allowed_commands\`, and every rule must have at least one blocked fixture.
- Blocked fixtures must specify the expected \`rule\`; include allowed fixtures for close-but-safe commands.
- Local source names are bare names such as \`project-rules\`; do not put filesystem paths in \`rules\`.
- GitHub refs must be a tag, SHA, or simple branch name without \`/\`.
- Invalid config, corrupt cache, invalid local rulebooks, or remote rulebook repair failures fail closed until repaired with \`npx -y cc-safety-net rule sync\`.
- Valid local rulebook drift is repaired automatically by hooks; use \`npx -y cc-safety-net rule update\` when intentionally refreshing remote sources.
`;
