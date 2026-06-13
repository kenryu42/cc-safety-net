# Contributing to CC Safety Net

First off, thanks for taking the time to contribute! This document provides guidelines and instructions for contributing to cc-safety-net.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Before You Start: Proposing New Features](#before-you-start-proposing-new-features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Development Setup](#development-setup)
  - [Testing Your Changes Locally](#testing-your-changes-locally)
- [Development Workflow](#development-workflow)
  - [Build Commands](#build-commands)
  - [Conventions](#conventions)
- [Pull Request Process](#pull-request-process)
- [Publishing](#publishing)
- [Getting Help](#getting-help)

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to make better tools together.

## Before You Start: Proposing New Features

**Please open an issue to discuss new features before implementing them.**

This project has a focused scope: **preventing coding agents from making accidental mistakes that cause data loss** (e.g., `rm -rf ~/`, `git reset --hard`). It is NOT a general security hardening tool or an attack prevention system.

### Why Discuss First?

1. **Scope alignment** — Your idea might be great but outside the project's scope
2. **Approach feedback** — We can suggest the best way to implement it
3. **Avoid wasted effort** — Save time for both you and maintainers

### When to Open an Issue First

| Scenario | Open Issue First? |
|----------|-------------------|
| New detection rule (git, rm, etc.) | **Yes** |
| New command category to block | **Yes** |
| Architectural changes | **Yes** |
| New configuration options | **Yes** |
| Typo/documentation fixes | No, just PR |
| Small bug fixes with obvious solution | No, just PR |

### What to Include in Your Proposal

- **What** you want to add/change
- **Why** it fits the project scope (preventing accidental data loss)
- **Real-world scenario** where this would help
- Any **trade-offs** you've considered

A quick 5-minute issue can save hours of implementation time on both sides.

## Getting Started

### Prerequisites

- **Bun** - Required runtime and package manager ([install guide](https://bun.sh/docs/installation))
- **Claude Code** or **OpenCode** - For testing the plugin

### Development Setup

```bash
# Clone the repository
git clone https://github.com/kenryu42/cc-safety-net.git
cd cc-safety-net

# Install dependencies
bun install

# Build for distribution
bun run build

# Check for all lint errors, type errors, dead code and run tests
bun run check
```

### Testing Your Changes Locally

## Claude Code

1. **Build the project**:
   ```bash
   bun run build
   ```

2. **Disable the safety-net plugin** in Claude Code (if installed) and exit Claude Code completely.

3. **Run Claude Code with the local plugin**:
   ```bash
   claude --plugin-dir .
   ```

4. **Test blocked commands** to verify your changes:
   ```bash
   # This should be blocked
   git checkout -- README.md

   # This should be allowed
   git checkout -b test-branch
   ```

> [!NOTE]
> See the [official documentation](https://docs.anthropic.com/en/docs/claude-code/plugins#test-your-plugins-locally) for more details on testing plugins locally.

## OpenCode

1. **Build the project**:
   ```bash
   bun run build
   ```

2. **Update your OpenCode config** (`~/.config/opencode/opencode.json` or `opencode.jsonc`):
   ```json
   {
     "plugin": [
       "file:///absolute/path/to/cc-safety-net/dist/index.js"
     ]
   }
   ```
   
   For example, if your project is at `/Users/yourname/projects/cc-safety-net`:
   ```json
   {
     "plugin": [
       "file:///Users/yourname/projects/cc-safety-net/dist/index.js"
     ]
   }
   ```

> [!NOTE]
> Remove `"cc-safety-net"` from the plugin array if it exists, to avoid conflicts with the npm version.
> Or comment out the line if you're using `opencode.jsonc`.

3. **Restart OpenCode** to load the changes.

4. **Verify the plugin is loaded:** Run `/status` and confirm that the plugin name appears as `dist`.

5. **Test blocked commands** to verify your changes:
   ```bash
   # This should be blocked
   git checkout -- README.md

   # This should be allowed
   git checkout -b test-branch
   ```

> [!NOTE]
> See the [official documentation](https://opencode.ai/docs/plugins/) for more details on OpenCode plugins.

## Development Workflow

### Build Commands

```bash
# Run all checks (lint, type check, dead code, ast-grep scan, tests)
bun run check

# Individual commands
bun run lint          # Lint + format (Biome)
bun run typecheck     # Type check
bun run knip          # Dead code detection
bun run sg:scan       # AST pattern scan
bun test              # Run tests

# Run specific test
bun test tests/rules-git.test.ts

# Run tests matching pattern
bun test --test-name-pattern "checkout"

# Build for distribution
bun run build
```

### Conventions

| Convention | Rule |
|------------|------|
| Runtime | **Bun** |
| Package Manager | **bun only** (`bun install`, `bun run`) |
| Formatter/Linter | **Biome** |
| Type Hints | Required on all functions |
| Type Syntax | `type \| null` preferred over `type \| undefined` |
| File Naming | `kebab-case` (e.g., `worktree-relaxation.ts`, not `worktreeRelaxation.ts`) |
| Function Naming | `camelCase` for functions, `PascalCase` for types/interfaces |
| Constants | `SCREAMING_SNAKE_CASE` for reason constants |
| Imports | Relative imports within package |

## Pull Request Process

1. **Fork** the repository and create your branch from `main`
2. **Make changes** following the conventions above
3. **Run all checks** locally:
   ```bash
   bun run check  # Must pass with no errors
   ```
4. **Test in Claude Code and OpenCode** using the local plugin method described above
5. **Commit** with clear, descriptive messages:
   - Use present tense ("Add rule" not "Added rule")
   - Reference issues if applicable ("Fix #123")
6. **Push** to your fork and create a Pull Request
7. **Describe** your changes clearly in the PR description

### PR Checklist

- [ ] Code follows project conventions (type hints, naming, etc.)
- [ ] `bun run check` passes (lint, types, dead code, tests)
- [ ] Tests added for new rules (minimum 90% coverage required)
- [ ] Tested locally with Codex, Claude Code, Gemini CLI, GitHub Copilot CLI, Kimi Code or Pi
- [ ] Updated documentation if needed (README, AGENTS.md)
- [ ] No version changes in `package.json`

## Publishing

**Important**: Version bumping and releases are handled by maintainers only.

- **Never** modify the version in `package.json` or `plugin.json` directly
- Maintainers handle versioning, tagging, and releases

## Getting Help

- **Diagnostics**: Run `bunx cc-safety-net doctor` to verify your setup is working correctly
- **Debug Analysis**: Run `bunx cc-safety-net explain "git command"` to see step-by-step how a command is analyzed
- **Project Knowledge**: Check `CLAUDE.md` or `AGENTS.md` for detailed architecture and conventions
- **Code Patterns**: Review existing implementations in `src/core/`
- **Test Patterns**: See `tests/helpers.ts` for test utilities
- **Issues**: Open an issue for bugs or feature requests

---

Thank you for contributing to CC Safety Net! Your efforts help keep AI-assisted coding safer for everyone.
