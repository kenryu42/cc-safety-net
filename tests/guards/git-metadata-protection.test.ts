import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { evaluateGuard } from '@/engine/guard';
import type { ToolInvocation } from '@/ir/invocation';
import { getUserPolicyPath } from '@/policy/store';
import { analyzeTestCommand, policySnapshot, type TestPolicyInput } from '../helpers/policy.ts';
import {
  createLinkedWorktreeFixture,
  createSubmoduleLikeGitFileFixture,
  quoteShellPath,
  toShellPath,
} from '../helpers.ts';

function createRepositoryFixture(repositoryName = 'repository') {
  const root = mkdtempSync(join(tmpdir(), 'ccsn-git-metadata-'));
  const repository = join(root, repositoryName);
  mkdirSync(join(repository, '.git', 'hooks'), { recursive: true });
  writeFileSync(join(repository, '.git', 'HEAD'), 'ref: refs/heads/main\n');
  writeFileSync(join(repository, '.git', 'config'), '[core]\n');
  writeFileSync(join(repository, '.git', 'hooks', 'pre-commit'), '#!/bin/sh\n');
  return { root, repository, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}

function commandRule(
  command: string,
  cwd: string,
  config: TestPolicyInput = {},
  shell: 'posix' | 'powershell' = 'posix',
) {
  return analyzeTestCommand(command, { cwd, config, shell })?.ruleId;
}

function guard(
  toolName: string,
  input: unknown,
  cwd: string,
  route: ToolInvocation['route'],
  snapshot = policySnapshot(),
) {
  const invocation =
    route.kind === 'command'
      ? {
          toolName,
          input,
          context: { configCwd: cwd, executionCwd: cwd },
          route,
          command:
            input && typeof input === 'object' && 'command' in input ? String(input.command) : null,
        }
      : { toolName, input, context: { configCwd: cwd, executionCwd: cwd }, route };
  return evaluateGuard(invocation, {
    dependencies: { loadPolicySnapshot: () => snapshot },
  });
}

function linkedGitDirectories(worktree: string) {
  const firstLine = readFileSync(join(worktree, '.git'), 'utf8').split(/\r?\n/, 1)[0] ?? '';
  const rawGitDir = firstLine.slice('gitdir:'.length).trim();
  const gitDir = isAbsolute(rawGitDir) ? rawGitDir : resolve(worktree, rawGitDir);
  const rawCommonDir = readFileSync(join(gitDir, 'commondir'), 'utf8').trim();
  return {
    gitDir,
    commonDir: isAbsolute(rawCommonDir) ? rawCommonDir : resolve(gitDir, rawCommonDir),
  };
}

describe('Git metadata command protection', () => {
  test('blocks rm, rmdir, nested rm, find, and PowerShell delete families', () => {
    const fixture = createRepositoryFixture();
    try {
      for (const command of [
        'rm -rf .git',
        'rm -r .git',
        'rm .git',
        'rmdir .git',
        'rm -rf .git/*',
        'rm .git/*',
        'rm -rf .git/hooks/*',
        'rm -rf .*',
        "bash -c 'rm -rf .git'",
        'find .git -delete',
        'find .git/* -delete',
        'find -delete',
        'find -exec rm -rf {} +',
        'find . -name hooks -delete',
        'find .git -exec rm -rf {} +',
        'find . -name hooks -execdir rm -rf {} +',
        'xargs rm -rf .git </dev/null',
        'parallel rm -rf ::: .git',
      ]) {
        expect(commandRule(command, fixture.repository), command).toMatch(/git-metadata$/);
      }
      expect(
        commandRule('Remove-Item -Recurse -Force .git', fixture.repository, {}, 'powershell'),
      ).toBe('powershell.remove-item-git-metadata');
      expect(commandRule('ri .git -Recurse -Force', fixture.repository, {}, 'powershell')).toBe(
        'powershell.remove-item-git-metadata',
      );
      expect(
        commandRule('Remove-Item * -Recurse -Force', fixture.repository, {}, 'powershell'),
      ).toBe('powershell.remove-item-git-metadata');
    } finally {
      fixture.cleanup();
    }
  });

  test('blocks an ancestor of the repository before allow-path relaxation', () => {
    const fixture = createRepositoryFixture();
    try {
      expect(
        commandRule(`rm -rf ${quoteShellPath(fixture.root)}`, fixture.repository, {
          destructiveCommandAllowPaths: [fixture.root],
        }),
      ).toBe('rm.git-metadata');
    } finally {
      fixture.cleanup();
    }
  });

  test('blocks linked-worktree marker, gitdir, and common-dir mutation', () => {
    const fixture = createLinkedWorktreeFixture();
    try {
      const directories = linkedGitDirectories(fixture.linkedWorktree);
      expect(commandRule('rm .git', fixture.linkedWorktree)).toBe('rm.git-metadata');
      expect(
        commandRule(`rm -rf ${quoteShellPath(directories.gitDir)}`, fixture.linkedWorktree),
      ).toBe('rm.git-metadata');
      expect(
        commandRule(`rm -rf ${quoteShellPath(directories.commonDir)}`, fixture.linkedWorktree),
      ).toBe('rm.git-metadata');
      expect(
        commandRule(
          `rm -rf ${quoteShellPath(dirname(directories.gitDir))}/*`,
          fixture.linkedWorktree,
        ),
      ).toBe('rm.git-metadata');
      expect(
        guard('Bash', { command: '> .git' }, fixture.linkedWorktree, {
          kind: 'command',
          shell: 'posix',
        }).decision,
      ).toMatchObject({ kind: 'deny', intent: 'hard_stop' });
    } finally {
      fixture.cleanup();
    }
  });

  test('protects a symlinked .git directory and its hooks', () => {
    const root = mkdtempSync(join(tmpdir(), 'ccsn-git-symlink-'));
    try {
      const repository = join(root, 'repository');
      const target = join(root, 'git-storage');
      mkdirSync(join(target, 'hooks'), { recursive: true });
      writeFileSync(join(target, 'hooks', 'pre-commit'), '#!/bin/sh\n');
      mkdirSync(repository, { recursive: true });
      symlinkSync(target, join(repository, '.git'));
      expect(commandRule('rm -rf .git', repository)).toBe('rm.git-metadata');
      expect(commandRule('rm -rf .git/hooks', repository)).toBe('rm.git-metadata');
      expect(commandRule(`rm -rf ${quoteShellPath(repository)}`, repository)).toBe(
        'rm.git-metadata',
      );
      expect(commandRule(`rm -rf ${quoteShellPath(root)}`, repository)).toBe('rm.git-metadata');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('protects repositories under a dot-dot-prefixed directory name', () => {
    const root = mkdtempSync(join(tmpdir(), 'ccsn-git-dotdot-'));
    try {
      const repository = join(root, '..repo');
      mkdirSync(join(repository, '.git', 'hooks'), { recursive: true });
      writeFileSync(join(repository, '.git', 'HEAD'), 'ref: refs/heads/main\n');
      expect(commandRule(`rm -rf ${quoteShellPath(root)}`, repository)).toBe('rm.git-metadata');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('protects hooks through a symlinked hooks directory', () => {
    const root = mkdtempSync(join(tmpdir(), 'ccsn-git-hooks-link-'));
    try {
      const repository = join(root, 'repository');
      const external = join(root, 'srv', 'git-hooks');
      mkdirSync(join(repository, '.git'), { recursive: true });
      mkdirSync(external, { recursive: true });
      writeFileSync(join(external, 'pre-commit'), '#!/bin/sh\n');
      symlinkSync(external, join(repository, '.git', 'hooks'));
      expect(commandRule('rm -rf .git/hooks', repository)).toBe('rm.git-metadata');
      expect(commandRule(`rm ${quoteShellPath(join(external, 'pre-commit'))}`, repository)).toBe(
        'rm.git-metadata',
      );
      expect(commandRule(`rm -rf ${quoteShellPath(join(root, 'srv'))}`, repository)).toBe(
        'rm.git-metadata',
      );
      expect(
        guard('Write', { path: '.git/hooks/new-hook' }, repository, { kind: 'path' }).decision,
      ).toMatchObject({ kind: 'deny', intent: 'hard_stop' });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('protects a submodule-like marker and its resolved gitdir', () => {
    const fixture = createSubmoduleLikeGitFileFixture();
    try {
      expect(commandRule('rm .git', fixture.cwd)).toBe('rm.git-metadata');
      expect(commandRule('rm .*', fixture.cwd)).toBe('rm.git-metadata');
      expect(
        commandRule(
          `rm -rf ${quoteShellPath(join(fixture.rootDir, '.git', 'modules', 'submodule'))}`,
          fixture.cwd,
        ),
      ).toBe('rm.git-metadata');
      writeFileSync(join(fixture.cwd, '.git'), 'gitdir: ../missing\n');
      expect(commandRule('rm .git', fixture.cwd)).toBe('rm.git-metadata');
    } finally {
      fixture.cleanup();
    }
  });

  test('keeps catastrophic Git delete rules enabled through every override channel', () => {
    const fixture = createRepositoryFixture();
    try {
      expect(
        commandRule('rm -rf .git', fixture.repository, {
          destructiveCommandProtectionEnabled: false,
        }),
      ).toBe('rm.git-metadata');
      expect(
        commandRule('find .git -delete', fixture.repository, {
          destructiveCommandRuleOverrides: { 'find.delete-git-metadata': 'off' },
        }),
      ).toBe('find.delete-git-metadata');
      expect(
        commandRule(
          'Remove-Item .git -Recurse -Force',
          fixture.repository,
          {
            destructiveCommandAllowPaths: [fixture.root],
          },
          'powershell',
        ),
      ).toBe('powershell.remove-item-git-metadata');
    } finally {
      fixture.cleanup();
    }
  });

  test('does not inspect Git CLI subcommand operands', () => {
    const fixture = createRepositoryFixture();
    try {
      for (const command of [
        'git commit',
        'git status',
        'git gc',
        'git worktree add ../other',
        'git config core.filemode false',
        'git rev-parse --git-dir',
      ]) {
        expect(commandRule(command, fixture.repository), command).toBeUndefined();
      }
    } finally {
      fixture.cleanup();
    }
  });

  test('allows reads and unrelated Git-internal mutations', () => {
    const fixture = createRepositoryFixture();
    mkdirSync(join(fixture.repository, 'vendored', 'foo', '.git'), { recursive: true });
    try {
      for (const command of [
        'cat .git/config',
        'cat .git/HEAD',
        'grep core .git/config',
        'rg core .git/config',
        'stat .git',
        'ls .git',
        'du -sh .git',
        'rm .git/index.lock',
        'rm .git/MERGE_MSG',
        'rm -rf vendored/foo/.git',
        'rm -rf ./*',
        'rm -rf .git/objects/*',
        'find .git -maxdepth 0 -exec rm -f /tmp/unrelated-cache \\;',
      ]) {
        expect(commandRule(command, fixture.repository), command).toBeUndefined();
      }
      expect(
        guard('Edit', { path: '.git/config' }, fixture.repository, { kind: 'path' }).decision,
      ).toEqual({ kind: 'allow' });
      expect(
        guard('Read', { path: '.git/hooks/pre-commit' }, fixture.repository, {
          kind: 'path',
        }).decision,
      ).toEqual({ kind: 'allow' });
    } finally {
      fixture.cleanup();
    }
  });
});

describe('Git metadata guard protection', () => {
  test('blocks mv sources, protected destinations, and marker redirection', () => {
    const fixture = createRepositoryFixture();
    try {
      for (const command of ['mv .git /tmp/x', 'mv source .git', '> .git/hooks/pre-commit']) {
        expect(
          guard('Bash', { command }, fixture.repository, { kind: 'command', shell: 'posix' })
            .decision,
          command,
        ).toMatchObject({ kind: 'deny', intent: 'hard_stop' });
      }
    } finally {
      fixture.cleanup();
    }
  });

  test('blocks a Git metadata move hidden in an env -S split string', () => {
    const fixture = createRepositoryFixture();
    try {
      const moved = toShellPath(join(fixture.root, 'moved'));
      const commands = [
        `env -S 'mv .git "${moved}"' true`,
        `env -S 'LC_ALL=C mv' .git ${quoteShellPath(join(fixture.root, 'moved'))}`,
        `env -S 'LC_ALL=C mv .git "${moved}"' true`,
        `env -S 'mv ".git" "${moved}"' true`,
        `env -S '"mv" .git "${moved}"' true`,
      ];
      expect(
        commands.map(
          (command) =>
            guard('Bash', { command }, fixture.repository, { kind: 'command', shell: 'posix' })
              .decision,
        ),
        commands.join(' | '),
      ).toMatchObject(commands.map(() => ({ kind: 'deny', intent: 'hard_stop' })));
    } finally {
      fixture.cleanup();
    }
  });

  test('blocks a quoted Git metadata move on a space-containing path inside an env -S split value', () => {
    const fixture = createRepositoryFixture('My Repo');
    try {
      const command = `env -S 'mv "${toShellPath(join(fixture.repository, '.git'))}" "${toShellPath(join(fixture.root, 'moved'))}"' true`;
      expect(
        guard('Bash', { command }, fixture.repository, { kind: 'command', shell: 'posix' })
          .decision,
        command,
      ).toMatchObject({ kind: 'deny', intent: 'hard_stop' });
    } finally {
      fixture.cleanup();
    }
  });

  test('blocks write tools and patches for existing and new hook files', () => {
    const fixture = createRepositoryFixture();
    try {
      for (const [toolName, input, route] of [
        ['Write', { path: '.git/hooks/new-hook' }, { kind: 'path' as const }],
        ['Edit', { file_path: '.git/hooks/pre-commit' }, { kind: 'path' as const }],
        ['unknown_writer', { path: '.git/hooks/pre-commit' }, { kind: 'unknown' as const }],
        [
          'apply_patch',
          { patch: '*** Begin Patch\n*** Delete File: .git/hooks/pre-commit\n*** End Patch' },
          { kind: 'patch' as const },
        ],
        [
          'apply_patch',
          {
            patch:
              '*** Begin Patch\n*** Update File: .git/hooks/pre-commit\n@@\n-old\n+new\n*** End Patch',
          },
          { kind: 'patch' as const },
        ],
        [
          'apply_patch',
          {
            patch: '*** Begin Patch\n*** Add File: .git/hooks/new-patch-hook\n+new\n*** End Patch',
          },
          { kind: 'patch' as const },
        ],
        [
          'apply_patch',
          {
            patch:
              '*** Begin Patch\n*** Update File: safe\n*** Move to: .git/hooks/moved\n@@\n-old\n+new\n*** End Patch',
          },
          { kind: 'patch' as const },
        ],
      ] as const) {
        expect(guard(toolName, input, fixture.repository, route).decision).toMatchObject({
          kind: 'deny',
          intent: 'hard_stop',
        });
      }
    } finally {
      fixture.cleanup();
    }
  });

  test('Git guard protection ignores every destructive-command override channel', () => {
    const fixture = createRepositoryFixture();
    try {
      const invocation = {
        toolName: 'Write',
        input: { path: '.git/hooks/new-hook' },
        context: { configCwd: fixture.repository, executionCwd: fixture.repository },
        route: { kind: 'path' as const },
      };
      for (const snapshot of [
        policySnapshot({ destructiveCommandProtectionEnabled: false }),
        policySnapshot({ destructiveCommandRuleOverrides: { 'rm.git-metadata': 'off' } }),
        policySnapshot({ destructiveCommandAllowPaths: [fixture.root] }),
      ]) {
        expect(
          evaluateGuard(invocation, {
            dependencies: { loadPolicySnapshot: () => snapshot },
          }).decision,
        ).toMatchObject({ kind: 'deny', intent: 'hard_stop' });
      }
    } finally {
      fixture.cleanup();
    }
  });

  test('policy protection remains unconditional under destructive-command settings', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'ccsn-policy-catastrophic-'));
    try {
      const policyPath = getUserPolicyPath();
      const policyDirectory = dirname(policyPath);
      const policyParent = dirname(policyDirectory);
      for (const snapshot of [
        policySnapshot(),
        policySnapshot({ destructiveCommandProtectionEnabled: false }),
        policySnapshot({ destructiveCommandRuleOverrides: { 'find.delete': 'off' } }),
        policySnapshot({ destructiveCommandAllowPaths: [policyDirectory] }),
      ]) {
        expect(
          guard('Write', { path: policyPath }, cwd, { kind: 'path' }, snapshot).decision,
        ).toMatchObject({ kind: 'deny', intent: 'hard_stop' });
        for (const command of [
          `find ${quoteShellPath(policyDirectory)} -delete`,
          `find ${quoteShellPath(policyParent)} -type f -delete`,
        ]) {
          expect(
            guard('Bash', { command }, cwd, { kind: 'command', shell: 'posix' }, snapshot).decision,
          ).toMatchObject({
            kind: 'deny',
            intent: 'hard_stop',
            reason:
              'This path contains the protected policy config and you must not modify or delete it.',
          });
        }
      }

      const disabled = policySnapshot({ destructiveCommandProtectionEnabled: false });
      for (const command of [
        `cat ${quoteShellPath(policyPath)}`,
        `find ${quoteShellPath(join(policyDirectory, 'sibling.json'))} -delete`,
      ]) {
        expect(
          guard('Bash', { command }, cwd, { kind: 'command', shell: 'posix' }, disabled).decision,
        ).toEqual({ kind: 'allow' });
      }
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});
