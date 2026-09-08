import { afterAll, describe, expect, test } from 'bun:test';
import { resolveGitCommandLineAliases } from '@/gate/analyzer/git/parse';
import {
  analyzeGitRule,
  GIT_RULE_SUBCOMMANDS,
  matchesGitLongOption,
} from '@/gate/analyzer/git/rules';
import { getGitWorktreeRelaxationForMatch } from '@/gate/analyzer/git/worktree-relaxation';
import { pairedEnvironments } from '../../core/differential-inputs';
import { createLinkedWorktreeFixture } from '../../helpers';

/**
 * The Git rule dispatch has to walk the global-option, alias and short-option forms before it
 * sees a subcommand, so each row states the rule a command line reaches.
 */

function argvOf(line: string): string[] {
  return line.split(/\s+/).filter((word) => word.length > 0);
}

describe('git rule dispatch', () => {
  test('the dispatch table names every subcommand with a rule', () => {
    expect([...GIT_RULE_SUBCOMMANDS].sort()).toStrictEqual([
      'branch',
      'checkout',
      'clean',
      'merge',
      'push',
      'rebase',
      'reflog',
      'reset',
      'restore',
      'rm',
      'stash',
      'switch',
      'tag',
      'worktree',
    ]);
  });

  test('a matched rule carries its reason, intent and whether it discards local work', () => {
    expect(analyzeGitRule(argvOf('git reset --hard'))).toStrictEqual({
      id: 'git.reset-hard',
      reason:
        "git reset --hard destroys all uncommitted changes permanently. Use 'git stash' first.",
      intent: 'use_alternative',
      localDiscard: true,
    });
    expect(analyzeGitRule(argvOf('git push --force origin main'))).toStrictEqual({
      id: 'git.push-force',
      reason:
        'git push --force destroys remote history. Use --force-with-lease for safer force push.',
      intent: 'use_alternative',
      localDiscard: false,
    });
  });

  test('each command line reaches the rule its subcommand and options select', () => {
    const rows: readonly { readonly line: string; readonly id: string | null }[] = [
      { line: 'git', id: null },
      { line: 'git --', id: null },
      { line: 'git -- -x', id: null },
      { line: 'git status', id: null },
      { line: 'not-git checkout -- .', id: null },
      { line: '/usr/bin/git checkout -- .', id: 'git.checkout-double-dash' },
      { line: 'git.exe reset --hard', id: 'git.reset-hard' },
      { line: 'git -C /tmp clean -ffd', id: 'git.clean-force' },
      { line: 'git -C/tmp clean -fd', id: 'git.clean-force' },
      { line: 'git -C', id: null },
      { line: 'git --git-dir=/tmp/x checkout -- .', id: 'git.checkout-double-dash' },
      { line: 'git --namespace ns reset --hard', id: 'git.reset-hard' },
      { line: 'git checkout HEAD -- src/file.ts', id: 'git.checkout-ref-path' },
      { line: 'git checkout --force main', id: 'git.checkout-force' },
      // contract: src/gate/analyzer/git/rules.ts:55 — `-b` takes a value, so `-bf` names a
      // branch called `f` rather than adding `-f`.
      { line: 'git checkout -bf feature', id: null },
      { line: 'git checkout -f main', id: 'git.checkout-force' },
      { line: 'git checkout -b feature', id: null },
      { line: 'git checkout --orphan fresh', id: null },
      { line: 'git checkout --pathspec-from-file=list', id: 'git.checkout-pathspec-from-file' },
      { line: 'git checkout main other', id: 'git.checkout-ambiguous' },
      { line: 'git checkout main', id: null },
      // The mode word an option owns is not a positional.
      { line: 'git checkout --recurse-submodules on-demand one', id: null },
      { line: 'git checkout --recurse-submodules bogus one', id: 'git.checkout-ambiguous' },
      { line: 'git switch --discard-changes main', id: 'git.switch-discard-changes' },
      { line: 'git switch -f main', id: 'git.switch-force' },
      { line: 'git switch -C main', id: null },
      { line: 'git restore .', id: 'git.restore-unstaged' },
      { line: 'git restore --staged .', id: null },
      { line: 'git restore --worktree .', id: 'git.restore-worktree' },
      { line: 'git restore -SW .', id: 'git.restore-worktree' },
      { line: 'git restore -p', id: 'git.restore-unstaged' },
      { line: 'git restore --patch --staged', id: null },
      { line: 'git reset --merge', id: 'git.reset-merge' },
      // An abbreviation of at least four characters still names the option.
      { line: 'git reset --har', id: 'git.reset-hard' },
      { line: 'git clean -n -fd', id: null },
      { line: 'git rm --force file', id: 'git.rm-force' },
      { line: 'git rm --cached --force file', id: null },
      { line: 'git rm --force --dry-run file', id: null },
      { line: 'git push --mirror origin', id: 'git.push-mirror' },
      { line: 'git push --delete origin main', id: 'git.push-delete' },
      { line: 'git push origin +main', id: 'git.push-force' },
      { line: 'git push origin :main', id: 'git.push-delete' },
      { line: 'git push origin main', id: null },
      { line: 'git branch -D feature', id: 'git.branch-force-delete' },
      { line: 'git branch -d feature', id: null },
      { line: 'git stash drop', id: 'git.stash-drop' },
      { line: 'git stash clear', id: 'git.stash-clear' },
      { line: 'git stash list', id: null },
      { line: 'git worktree remove --force wt', id: 'git.worktree-remove-force' },
      { line: 'git worktree remove wt', id: null },
      { line: 'git rebase --abort', id: 'git.rebase-abort' },
      { line: 'git rebase --continue', id: null },
      { line: 'git merge --abort', id: 'git.merge-abort' },
      { line: 'git tag -d v1', id: 'git.tag-delete' },
      { line: 'git reflog delete HEAD@{0}', id: 'git.reflog-delete' },
      { line: 'git reflog show', id: null },
      { line: 'git submodule update --init', id: null },
      // An alias is not expanded here, so `co` is not a subcommand the dispatch knows.
      { line: 'git -c alias.co=checkout co -- .', id: null },
    ];
    for (const row of rows) {
      expect(analyzeGitRule(argvOf(row.line))?.id ?? null, row.line).toBe(row.id);
    }
  });

  test('a long option matches from four characters, up to its value', () => {
    const rows: readonly {
      readonly token: string;
      readonly option: string;
      readonly matches: boolean;
    }[] = [
      { token: '--force', option: '--force', matches: true },
      { token: '--for', option: '--force', matches: true },
      // contract: src/gate/analyzer/git/rules.ts:84 — the four characters include the dashes.
      { token: '--fo', option: '--force', matches: true },
      { token: '--f', option: '--force', matches: false },
      { token: '--force=x', option: '--force', matches: true },
      { token: '--forceful', option: '--force', matches: false },
      { token: '-f', option: '--force', matches: false },
      { token: 'force', option: '--force', matches: false },
      { token: '--de', option: '--delete', matches: true },
      { token: '--d', option: '--delete', matches: false },
      { token: '--discard-changes', option: '--discard-changes', matches: true },
    ];
    for (const row of rows) {
      expect(matchesGitLongOption(row.token, row.option), `${row.token} ${row.option}`).toBe(
        row.matches,
      );
    }
  });
});

describe('git alias resolution', () => {
  test('a command-line alias is expanded before the rules see the tokens', () => {
    const aliased = argvOf('git -c alias.co=checkout co --force main');
    const resolution = resolveGitCommandLineAliases(aliased, new Map());
    expect(resolution.expanded).toBeTrue();
    expect(resolution.blockedReason).toBeNull();
    expect(resolution.tokens).toStrictEqual(['git', 'checkout', '--force', 'main']);
    expect(analyzeGitRule(resolution.tokens)?.id).toBe('git.checkout-force');
  });

  test('an alias the reader cannot resolve is reported as a blocked reason', () => {
    const rows: readonly {
      readonly line: string;
      readonly env?: readonly (readonly [string, string])[];
      readonly assignments?: readonly (readonly [string, string])[];
      readonly expanded: boolean;
      readonly blocked: boolean;
      readonly tokens?: readonly string[];
    }[] = [
      { line: 'git status', expanded: false, blocked: false },
      { line: 'git -c alias.=checkout co', expanded: false, blocked: false },
      { line: 'git -c alias.co=!rm co', expanded: true, blocked: true },
      { line: 'git -c alias.co= co', expanded: true, blocked: true },
      // Aliases that expand into each other run past the resolution depth.
      { line: 'git -c alias.a=b -c alias.b=a a', expanded: true, blocked: true },
      {
        line: 'git co',
        env: [
          ['GIT_CONFIG_COUNT', '1'],
          ['GIT_CONFIG_KEY_0', 'alias.co'],
          ['GIT_CONFIG_VALUE_0', 'checkout --force'],
        ],
        expanded: true,
        blocked: false,
        tokens: ['git', 'checkout', '--force'],
      },
      { line: 'git co', env: [['GIT_CONFIG_COUNT', '1025']], expanded: false, blocked: true },
      {
        line: 'git co',
        env: [['GIT_CONFIG_PARAMETERS', "'alias.co=checkout'"]],
        expanded: true,
        blocked: false,
        tokens: ['git', 'checkout'],
      },
      {
        line: 'git co',
        env: [['GIT_CONFIG_PARAMETERS', "'unterminated"]],
        expanded: false,
        blocked: true,
      },
      {
        line: 'git --config-env alias.co=CO co',
        env: [['CO', 'status']],
        assignments: [['CO', 'checkout --force']],
        expanded: true,
        blocked: false,
        tokens: ['git', 'checkout', '--force'],
      },
    ];
    for (const row of rows) {
      const assignments = row.assignments === undefined ? undefined : new Map(row.assignments);
      const resolved = resolveGitCommandLineAliases(
        argvOf(row.line),
        new Map(row.env ?? []),
        assignments,
      );
      expect(resolved.expanded, row.line).toBe(row.expanded);
      expect(resolved.blockedReason !== null, row.line).toBe(row.blocked);
      if (row.tokens) expect(resolved.tokens, row.line).toStrictEqual(row.tokens);
    }
  });
});

describe('worktree relaxation', () => {
  const fixture = createLinkedWorktreeFixture();

  afterAll(() => {
    fixture.cleanup();
  });

  test('a local discard is relaxed only in a linked worktree Git reads plainly', () => {
    const relaxationFor = (
      line: string,
      options: {
        variables?: Record<string, string>;
        assignments?: ReadonlyMap<string, string>;
        cwd?: string;
        worktreeMode?: boolean;
        dynamicArguments?: boolean;
      } = {},
    ) => {
      const argv = argvOf(line);
      const match = analyzeGitRule(argv);
      if (!match) throw new Error(`expected a rule for ${line}`);
      return getGitWorktreeRelaxationForMatch(argv, match, {
        environment: pairedEnvironments(options.variables ?? {}, fixture.rootDir),
        cwd: options.cwd ?? fixture.linkedWorktree,
        envAssignments: options.assignments,
        worktreeMode: options.worktreeMode ?? true,
        dynamicArguments: options.dynamicArguments,
      });
    };

    const rows: readonly {
      readonly line: string;
      readonly options?: Parameters<typeof relaxationFor>[1];
      readonly relaxed: boolean;
    }[] = [
      { line: 'git checkout -- .', relaxed: true },
      { line: 'git restore .', relaxed: true },
      { line: 'git clean -fd', relaxed: true },
      { line: 'git reset --hard', relaxed: true },
      // Two forces reach beyond the worktree, so the relaxation does not apply.
      { line: 'git clean -ffd', relaxed: false },
      { line: 'git checkout -f -B main origin/main', relaxed: false },
      { line: 'git switch -f -C main', relaxed: false },
      // A reset that moves the ref is not a local discard.
      { line: 'git reset --hard HEAD~1', relaxed: false },
      { line: 'git push --force origin main', relaxed: false },
      // An argument the reader cannot resolve leaves the affected paths unknown.
      { line: 'git checkout -- "$FILE"', relaxed: false },
      { line: 'git checkout -- *.ts', relaxed: false },
      { line: 'git checkout -- .', options: { dynamicArguments: true }, relaxed: false },
      { line: 'git checkout -- .', options: { worktreeMode: false }, relaxed: false },
      { line: 'git checkout -- .', options: { cwd: fixture.mainWorktree }, relaxed: false },
      { line: 'git checkout -- .', options: { cwd: fixture.rootDir }, relaxed: false },
      { line: 'git checkout --recurse-submodules -- .', relaxed: false },
      { line: 'git -c submodule.recurse=true checkout -- .', relaxed: false },
      { line: 'git -c submodule.recurse=false checkout -- .', relaxed: true },
      { line: 'git -c include.path=/tmp/evil checkout -- .', relaxed: false },
      {
        line: 'git --config-env submodule.recurse=RECURSE checkout -- .',
        options: { variables: { RECURSE: 'true' } },
        relaxed: false,
      },
      {
        line: 'git --config-env submodule.recurse=RECURSE checkout -- .',
        options: { variables: { RECURSE: 'false' } },
        relaxed: true,
      },
      { line: 'git --git-dir=.git checkout -- .', relaxed: false },
      { line: 'git -C . checkout -- .', relaxed: true },
      { line: 'git -C missing checkout -- .', relaxed: false },
      {
        line: 'git checkout -- .',
        options: { variables: { GIT_DIR: '/tmp/elsewhere' } },
        relaxed: false,
      },
      {
        line: 'git checkout -- .',
        options: { variables: { GIT_CONFIG_COUNT: '1025' } },
        relaxed: false,
      },
      {
        line: 'git checkout -- .',
        options: { assignments: new Map([['GIT_WORK_TREE', '/tmp/elsewhere']]) },
        relaxed: false,
      },
      {
        // A changed HOME changes which config Git would read.
        line: 'git checkout -- .',
        options: { assignments: new Map([['HOME', '/tmp/elsewhere']]) },
        relaxed: false,
      },
    ];
    for (const row of rows) {
      expect(relaxationFor(row.line, row.options) !== null, row.line).toBe(row.relaxed);
    }
  });

  test('a relaxation names the reason it lifts and the directory Git runs in', () => {
    const argv = argvOf('git checkout -- .');
    const match = analyzeGitRule(argv);
    if (!match) throw new Error('expected a git.checkout-double-dash match');
    const environments = pairedEnvironments({}, fixture.rootDir);
    const relaxation = getGitWorktreeRelaxationForMatch(argv, match, {
      environment: environments,
      cwd: fixture.linkedWorktree,
      worktreeMode: true,
    });
    expect(relaxation?.originalReason).toBe(match.reason);
    expect(relaxation?.gitCwd).toBeString();
  });
});
