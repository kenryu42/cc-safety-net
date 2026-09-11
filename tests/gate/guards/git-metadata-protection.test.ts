import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { join } from 'node:path';
import { createBudget } from '@/core/budget';
import { type ProtectedGitMetadata, resolveProtectedGitMetadata } from '@/core/git/metadata';
import {
  findGitMetadataMutationTargetInSemanticFacts,
  isProtectedGitDeleteTarget,
  isProtectedGitHookNameSelection,
  REASON_GIT_METADATA_PROTECTION,
} from '@/gate/guards/git-metadata-protection';
import { createSemanticFacts } from '@/gate/guards/semantic-facts';
import { createToolInvocation, type ToolRoute } from '@/gate/invocation';
import { pairedEnvironments } from '../../core/differential-inputs';
import {
  createLinkedWorktreeFixture,
  createSubmoduleLikeGitFileFixture,
  type FakeGitFileFixture,
  type LinkedWorktreeFixture,
} from '../../helpers';

let worktrees: LinkedWorktreeFixture;
let submodule: FakeGitFileFixture;

type Repository = { label: string; cwd: string; metadata: ProtectedGitMetadata | null };

let repositories: readonly Repository[] = [];

function environments() {
  return pairedEnvironments({ HOME: worktrees.rootDir }, worktrees.rootDir);
}

beforeAll(() => {
  worktrees = createLinkedWorktreeFixture();
  submodule = createSubmoduleLikeGitFileFixture();
  repositories = [
    { label: 'main worktree', cwd: worktrees.mainWorktree },
    { label: 'linked worktree', cwd: worktrees.linkedWorktree },
    { label: 'submodule', cwd: submodule.cwd },
    { label: 'outside any repository', cwd: submodule.rootDir },
  ].map((repository) => ({
    ...repository,
    metadata: resolveProtectedGitMetadata(repository.cwd, environments()),
  }));
});

afterAll(() => {
  worktrees.cleanup();
  submodule.cleanup();
});

describe('protected git delete targets', () => {
  test('an exact Git entry or a hook is protected; an ordinary file inside it is not', () => {
    const repository = repositories.find((row) => row.label === 'main worktree');
    if (!repository) throw new Error('missing fixture');
    const paired = environments();
    const budget = createBudget();
    const protect = (target: string, recursive: boolean) =>
      isProtectedGitDeleteTarget(
        target,
        repository.cwd,
        repository.metadata,
        recursive,
        paired,
        budget,
        false,
      );
    const rows: readonly {
      readonly target: string;
      readonly recursive: boolean;
      readonly expected: boolean;
    }[] = [
      { target: '.git', recursive: false, expected: true },
      { target: '.git/', recursive: false, expected: true },
      { target: './.git', recursive: false, expected: true },
      { target: join(repository.cwd, '.git'), recursive: false, expected: true },
      { target: '.git/hooks', recursive: false, expected: true },
      { target: '.git/hooks/pre-commit', recursive: false, expected: true },
      { target: '.git/config', recursive: false, expected: false },
      { target: '.git/hooks/../refs', recursive: false, expected: false },
      { target: 'nested/.git', recursive: true, expected: false },
      { target: 'file.txt', recursive: true, expected: false },
      { target: '', recursive: true, expected: false },
      { target: '   ', recursive: true, expected: false },
      { target: '..', recursive: true, expected: true },
      { target: '..', recursive: false, expected: false },
      { target: '../*', recursive: true, expected: true },
    ];
    for (const row of rows) {
      expect(protect(row.target, row.recursive), `${row.target} recursive=${row.recursive}`).toBe(
        row.expected,
      );
    }
  });

  test('a checkout whose Git directory lives elsewhere protects the marker and that directory', () => {
    const paired = environments();
    const budget = createBudget();
    const protect = (label: string, target: string, recursive: boolean) => {
      const repository = repositories.find((row) => row.label === label);
      if (!repository) throw new Error(`missing fixture: ${label}`);
      return isProtectedGitDeleteTarget(
        target,
        repository.cwd,
        repository.metadata,
        recursive,
        paired,
        budget,
        false,
      );
    };
    const main = repositories.find((row) => row.label === 'main worktree');
    if (!main) throw new Error('missing fixture');
    for (const label of ['linked worktree', 'submodule']) {
      expect(protect(label, '.git', false), label).toBeTrue();
      expect(protect(label, '.git/hooks', false), label).toBeFalse();
    }
    expect(protect('linked worktree', join(main.cwd, '.git'), true)).toBeTrue();
    expect(protect('main worktree', '.git/hooks', false)).toBeTrue();
    const linked = repositories.find((row) => row.label === 'linked worktree');
    if (!linked) throw new Error('missing fixture');
    expect(
      nextMutation(
        'Bash',
        { command: 'echo payload > .git' },
        { kind: 'command', shell: 'posix' },
        'echo payload > .git',
        linked,
      ),
    ).toStrictEqual({ target: '.git' });
  });

  test('the table separates protected targets from the rest', () => {
    const repository = repositories[0];
    if (!repository) throw new Error('missing fixture');
    const paired = environments();
    const budget = createBudget();
    const protect = (target: string, recursive: boolean, dotEntryGlobs = false) =>
      isProtectedGitDeleteTarget(
        target,
        repository.cwd,
        repository.metadata,
        recursive,
        paired,
        budget,
        dotEntryGlobs,
      );
    expect(protect('.git', false)).toBeTrue();
    expect(protect('.git/hooks/pre-commit', false)).toBeTrue();
    expect(protect('file.txt', true)).toBeFalse();
    expect(protect('*', true)).toBeFalse();
    expect(protect('.*', true)).toBeTrue();
    expect(protect('*', true, true)).toBeTrue();
    expect(protect('..', true)).toBeTrue();
    expect(protect('..', false)).toBeFalse();
    expect(
      isProtectedGitDeleteTarget('.git', repository.cwd, null, true, paired, budget),
    ).toBeFalse();
  });
});

describe('protected git hook name selection', () => {
  test('a starting point at or above the hooks directory selects hook names', () => {
    const rows: readonly {
      readonly startingPoints: readonly string[];
      readonly selectedIn: readonly string[];
    }[] = [
      { startingPoints: [], selectedIn: [] },
      { startingPoints: ['.'], selectedIn: ['main worktree', 'outside any repository'] },
      { startingPoints: ['.git'], selectedIn: ['main worktree', 'outside any repository'] },
      { startingPoints: ['.git/hooks'], selectedIn: ['main worktree', 'outside any repository'] },
      { startingPoints: ['.git/hooks/pre-commit'], selectedIn: [] },
      {
        startingPoints: ['..'],
        selectedIn: ['main worktree', 'linked worktree', 'submodule', 'outside any repository'],
      },
      { startingPoints: ['nested', '.'], selectedIn: ['main worktree', 'outside any repository'] },
      { startingPoints: ['file.txt'], selectedIn: [] },
      { startingPoints: ['', '.'], selectedIn: ['main worktree', 'outside any repository'] },
    ];
    for (const repository of repositories) {
      const paired = environments();
      const budget = createBudget();
      for (const row of rows) {
        expect(
          isProtectedGitHookNameSelection(
            row.startingPoints,
            repository.cwd,
            repository.metadata,
            paired,
            budget,
          ),
          `${repository.label}: ${JSON.stringify(row.startingPoints)}`,
        ).toBe(row.selectedIn.includes(repository.label));
      }
    }
  });

  test('a selection rooted at or above the hooks directory is protected', () => {
    const repository = repositories[0];
    if (!repository) throw new Error('missing fixture');
    const paired = environments();
    const budget = createBudget();
    const select = (startingPoints: readonly string[]) =>
      isProtectedGitHookNameSelection(
        startingPoints,
        repository.cwd,
        repository.metadata,
        paired,
        budget,
      );
    expect(select(['.'])).toBeTrue();
    expect(select(['.git/hooks'])).toBeTrue();
    expect(select(['.git/hooks/pre-commit'])).toBeFalse();
    expect(select(['file.txt'])).toBeFalse();
    expect(select([])).toBeFalse();
  });
});

const NON_COMMAND_ROUTES: readonly ToolRoute[] = [
  { kind: 'patch' },
  { kind: 'path' },
  { kind: 'unknown' },
  { kind: 'grep' },
  { kind: 'glob' },
];

function nextMutation(
  toolName: string,
  input: unknown,
  route: ToolRoute,
  command: string | null,
  repository: Repository,
) {
  const paired = environments();
  return findGitMetadataMutationTargetInSemanticFacts(
    createSemanticFacts(
      createToolInvocation(
        toolName,
        input,
        route,
        { executionCwd: repository.cwd, configCwd: repository.cwd },
        command,
      ),
    ),
    repository.metadata,
    paired,
    createBudget(),
  );
}

describe('git metadata mutation targets in semantic facts', () => {
  test('a move or a write reaching the Git directory reports the operand as written', () => {
    const repository = repositories[0];
    if (!repository) throw new Error('missing fixture');
    const route: ToolRoute = { kind: 'command', shell: 'posix' };
    const rows: readonly { readonly command: string; readonly target: string | null }[] = [
      { command: 'mv .git /tmp/stash', target: '.git' },
      { command: 'mv -- .git /tmp/stash', target: '.git' },
      { command: 'mv /tmp/payload .git/hooks/pre-commit', target: '.git/hooks/pre-commit' },
      { command: 'mv -t .git/hooks /tmp/pre-commit', target: '.git/hooks' },
      { command: 'mv --target-directory=.git/hooks /tmp/pre-commit', target: '.git/hooks' },
      { command: 'G=.git; mv $G /tmp/stash', target: '${G}' },
      { command: 'G=.git && mv ${G}/hooks /tmp/stash', target: '${G}/hooks' },
      { command: 'cd .git && mv hooks /tmp/stash', target: 'hooks' },
      { command: '( mv .git /tmp/stash )', target: '.git' },
      { command: '(cd .git) && mv .git /tmp/stash', target: '.git' },
      { command: 'sudo mv .git /tmp/stash', target: '.git' },
      { command: 'env -i mv .git /tmp/stash', target: '.git' },
      { command: 'echo payload > .git', target: null },
      { command: 'echo payload >> .git/hooks/pre-commit', target: '.git/hooks/pre-commit' },
      { command: 'echo payload > .git/config', target: null },
      { command: 'echo payload > file.txt', target: null },
      { command: 'mv file.txt other.txt', target: null },
      { command: 'git mv file.txt other.txt', target: null },
      { command: 'mv', target: null },
    ];
    for (const row of rows) {
      expect(
        nextMutation('Bash', { command: row.command }, route, row.command, repository),
        row.command,
      ).toStrictEqual(row.target === null ? null : { target: row.target });
    }
  });

  test('a path-carrying route reports a write-like target, a read-only tool never does', () => {
    const repository = repositories[0];
    if (!repository) throw new Error('missing fixture');
    const rows: readonly {
      readonly toolName: string;
      readonly input: Record<string, string>;
      readonly target: string | null;
    }[] = [
      { toolName: 'Write', input: { file_path: '.git' }, target: '.git' },
      {
        toolName: 'Write',
        input: { file_path: '.git/hooks/pre-commit' },
        target: '.git/hooks/pre-commit',
      },
      { toolName: 'Write', input: { file_path: '.git/config' }, target: null },
      { toolName: 'Write', input: { file_path: 'file.txt' }, target: null },
      { toolName: 'Edit', input: { file_path: '.git' }, target: '.git' },
      {
        toolName: 'NotebookEdit',
        input: { notebook_path: '.git/hooks/pre-commit' },
        target: '.git/hooks/pre-commit',
      },
      {
        toolName: 'unknown_writer',
        input: { path: '.git/hooks/pre-commit' },
        target: '.git/hooks/pre-commit',
      },
      { toolName: 'Read', input: { file_path: '.git' }, target: null },
      { toolName: 'Grep', input: { path: '.git' }, target: null },
    ];
    for (const route of NON_COMMAND_ROUTES) {
      for (const row of rows) {
        const carriesPaths =
          route.kind === 'patch' || route.kind === 'path' || route.kind === 'unknown';
        expect(
          nextMutation(row.toolName, row.input, route, null, repository),
          `${route.kind}: ${row.toolName} ${JSON.stringify(row.input)}`,
        ).toStrictEqual(carriesPaths && row.target !== null ? { target: row.target } : null);
      }
    }
  });

  test('the command table denies the control plane and allows ordinary files', () => {
    const repository = repositories[0];
    if (!repository) throw new Error('missing fixture');
    const route: ToolRoute = { kind: 'command', shell: 'posix' };
    const find = (command: string) => nextMutation('Bash', { command }, route, command, repository);
    expect(find('mv .git /tmp/stash')).toStrictEqual({ target: '.git' });
    expect(find('echo payload > .git/hooks/post-commit')).toStrictEqual({
      target: '.git/hooks/post-commit',
    });
    expect(find('mv file.txt other.txt')).toBeNull();
    expect(
      nextMutation('Read', { file_path: '.git/config' }, { kind: 'path' }, null, repository),
    ).toBeNull();
    expect(
      nextMutation('Write', { file_path: '.git/config' }, { kind: 'path' }, null, repository),
    ).toBeNull();
    expect(
      nextMutation('Write', { file_path: '.git' }, { kind: 'path' }, null, repository),
    ).toStrictEqual({ target: '.git' });
    expect(
      nextMutation(
        'Write',
        { file_path: '.git/hooks/pre-commit' },
        { kind: 'path' },
        null,
        repository,
      ),
    ).toStrictEqual({ target: '.git/hooks/pre-commit' });
    expect(
      nextMutation('Write', { file_path: '.git' }, { kind: 'path' }, null, {
        ...repository,
        metadata: null,
      }),
    ).toBeNull();
  });

  test('the denial asks the user before the control plane is touched', () => {
    expect(REASON_GIT_METADATA_PROTECTION).toBe(
      'Git metadata and hooks are protected. Ask the user before modifying them.',
    );
  });
});
