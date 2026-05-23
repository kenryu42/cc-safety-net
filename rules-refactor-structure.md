# Rules Refactor Handoff

## Goal

Refactor rule-related core files into domain-owned folders while preserving current behavior. Use `src/core/rules` for the custom rulebook subsystem, `src/core/analyze` for built-in shell command analyzers, and `src/core/git` for git-specific safety logic.

## Target Shape

```txt
src/core/
  analyze/
    rm.ts
    find.ts
    xargs.ts
    parallel.ts
    rm-flags.ts
    ...

  git/
    rules.ts
    parse.ts
    config.ts
    env.ts
    worktree-relaxation.ts

  rules/
    custom.ts
    rulebook.ts
    policy/
      index.ts
      config-file.ts
      lockfile.ts
      paths.ts
      resolver.ts
      scope-policy.ts
      sources.ts
      sync.ts
      types.ts
```

## File Moves

- Move `src/core/rules-custom.ts` to `src/core/rules/custom.ts`.
- Move `src/core/rulebook.ts` to `src/core/rules/rulebook.ts`.
- Move `src/core/rules-policy.ts` to `src/core/rules/policy/index.ts`.
- Move `src/core/rules-policy/*` to `src/core/rules/policy/*`.
- Move `src/core/rules-rm.ts` to `src/core/analyze/rm.ts`.
- Keep `src/core/git/rules.ts` in `src/core/git/rules.ts`.

## Ownership Boundaries

Use `rules` for the reusable custom/rulebook/policy subsystem.

Use `rules/custom.ts` for generic custom rule matching.

Use `rules/rulebook.ts` for rulebook schema validation and fixture execution.

Use `rules/policy/index.ts` as the public barrel for policy-related APIs.

Use `rules/policy/*` for config parsing, scope policy, overrides, lockfiles, source resolution, cache paths, sync, and related types.

Use `analyze/rm.ts` for built-in `rm` command safety analysis, alongside `find.ts`, `xargs.ts`, `parallel.ts`, and `rm-flags.ts`.

Use `git/rules.ts` for git-specific command safety logic, alongside git parsing, config, environment handling, and worktree relaxation.

## Implementation Notes

- Update imports from `@/core/rules-custom` to `@/core/rules/custom`.
- Update imports from `@/core/rulebook` to `@/core/rules/rulebook`.
- Update imports from `@/core/rules-policy` to `@/core/rules/policy`.
- Update imports from `@/core/rules-policy/*` to `@/core/rules/policy/*`.
- Update imports from `@/core/rules-rm` to `@/core/analyze/rm`.
- Update tests and explain trace expectations that reference old module names.
- Update `knip.ts` ignore paths for the new files.

## Verification

Run `bun run check` after the move.
