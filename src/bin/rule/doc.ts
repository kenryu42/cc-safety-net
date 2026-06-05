export const RULE_DOC = `# Custom Rules Reference

Agent reference for generating CC Safety Net rulebook configuration.

## Config Locations

| Scope | Config path | Rulebook path | Cache path | Priority |
|-------|-------------|---------------|------------|----------|
| User | \`~/.cc-safety-net/rules/rule.json\` | \`~/.cc-safety-net/rules/<rulebook-name>/rulebook.json\` | \`~/.cc-safety-net/cache/rulebooks/\` | Lower |
| Project | \`.cc-safety-net/rules/rule.json\` | \`.cc-safety-net/rules/<rulebook-name>/rulebook.json\` | \`.cc-safety-net/cache/rulebooks/\` | Higher |
| GitHub source | Listed in a local \`rule.json\` | \`.cc-safety-net/rules/<rulebook-name>/rulebook.json\` in the source repository | Consumer local cache | Source order |

Use \`cc-safety-net rule init\` to create a starter local config and rulebook. Use \`--global\` for user scope.

Legacy inline \`.safety-net.json\` and \`~/.cc-safety-net/config.json\` files are not loaded at runtime. Convert them with \`cc-safety-net rule migrate\`.

## rule.json Schema

\`\`\`json
{
  "version": 1,
  "rules": ["project-rules", "owner/repo#main/team-rules"],
  "overrides": {
    "project-rules/block-docker-system-prune": {
      "reason": "Use targeted Docker cleanup commands."
    },
    "team-rules/block-npm-global": "off"
  }
}
\`\`\`

- \`version\`: Required. Must be \`1\`.
- \`rules\`: Optional array of rulebook source strings. Missing \`rules\` is treated as \`[]\`.
- \`overrides\`: Optional object keyed by \`<rulebook-name>/<rule-name>\`.
- Override values are either \`"off"\` to disable a rule or \`{ "reason": "..." }\` to replace the rule reason.

## Rulebook Sources

- Local sources are bare rulebook names such as \`project-rules\`; the rulebook file is \`.cc-safety-net/rules/project-rules/rulebook.json\`.
- GitHub sources use \`owner/repo#ref/<rulebook-name>\`.
- GitHub refs must be one path segment, such as a tag, SHA, or branch name without \`/\`.
- Rulebook source names must be unique in a config.

## rulebook.json Schema

\`\`\`json
{
  "rulebook_version": 1,
  "name": "project-rules",
  "version": "1.0.0",
  "description": "Project-specific CC Safety Net rules.",
  "author": "project",
  "allowed_commands": ["docker"],
  "rules": [
    {
      "name": "block-docker-system-prune",
      "command": "docker",
      "subcommand": "system",
      "block_args": ["prune"],
      "reason": "Use targeted cleanup instead."
    }
  ],
  "tests": [
    {
      "command": "docker system prune",
      "expect": "blocked",
      "rule": "block-docker-system-prune"
    },
    {
      "command": "docker ps",
      "expect": "allowed"
    }
  ]
}
\`\`\`

### Rulebook Fields

| Field | Required | Constraints |
|-------|----------|-------------|
| \`rulebook_version\` | Yes | Must be \`1\` |
| \`name\` | Yes | \`^[a-zA-Z][a-zA-Z0-9_-]{0,63}$\` |
| \`version\` | Yes | Non-empty string |
| \`description\` | No | String |
| \`author\` | No | String |
| \`allowed_commands\` | Yes | Unique command names matching \`^[a-zA-Z][a-zA-Z0-9_-]*$\` |
| \`rules\` | Yes | Array of rule objects |
| \`tests\` | Yes | Array of fixtures |

### Rule Fields

| Field | Required | Constraints |
|-------|----------|-------------|
| \`name\` | Yes | Unique within the rulebook; same pattern as rulebook \`name\` |
| \`command\` | Yes | Must be listed in \`allowed_commands\`; basename only, not path |
| \`subcommand\` | No | Same pattern as \`command\`; omit to match any subcommand |
| \`block_args\` | Yes | Non-empty array of non-empty strings |
| \`reason\` | Yes | Non-empty string, max 256 chars |

### Test Fixture Fields

| Field | Required | Constraints |
|-------|----------|-------------|
| \`command\` | Yes | Non-empty shell command string |
| \`expect\` | Yes | \`"blocked"\` or \`"allowed"\` |
| \`rule\` | Required for blocked fixtures | Rule name expected to block the command |

Every rule must have at least one blocked fixture. Add allowed fixtures for close-but-safe commands.

## Matching Behavior

- **Command**: Normalized to basename (\`/usr/bin/git\` → \`git\`).
- **Subcommand**: First non-option argument after command.
- **Arguments**: Matched literally. Command blocked if **any** \`block_args\` item is present.
- **Short options**: Expanded (\`-Ap\` matches \`-A\`).
- **Long options**: Exact match (\`--all-files\` does not match \`--all\`).
- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.

## Workflow

1. Run \`cc-safety-net rule init\` or create \`rule.json\` and \`rulebook.json\` manually.
2. Run \`cc-safety-net rule sync\` after adding or changing rulebook sources.
3. Run \`cc-safety-net rule verify\` to validate config, lock/cache state, local rulebooks, and GitHub source rulebooks.
4. Run \`cc-safety-net rule test\` to execute rulebook fixtures.
5. Run \`cc-safety-net rule list\` to inspect active rulebooks.

Invalid rule config, corrupt cache, invalid local rulebooks, or remote rulebook repair failures fail closed until repaired with \`cc-safety-net rule sync\`.
`;
