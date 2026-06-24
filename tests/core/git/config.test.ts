import { describe, expect, test } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { hasRecursiveSubmoduleConfig } from '@/core/git/config';
import { createLinkedWorktreeFixture, getLinkedGitDir } from '../../helpers.ts';

interface FakeGitDirFixture {
  tmpDir: string;
  gitDir: string;
  commonDir: string;
  cleanup: () => void;
}

function createFakeGitDirFixture(suffix: string, configContent?: string): FakeGitDirFixture {
  const tmpDir = mkdtempSync(join(tmpdir(), `safety-net-${suffix}-`));
  const gitDir = join(tmpDir, 'worktrees', 'linked');
  const commonDir = join(tmpDir, 'common');
  mkdirSync(gitDir, { recursive: true });
  mkdirSync(commonDir);
  writeFileSync(join(tmpDir, '.git'), `gitdir: ${gitDir}\n`);
  writeFileSync(join(gitDir, 'commondir'), `${commonDir}\n`);
  if (configContent !== undefined) {
    writeFileSync(join(commonDir, 'config'), configContent);
  }
  return {
    tmpDir,
    gitDir,
    commonDir,
    cleanup: () => rmSync(tmpDir, { recursive: true, force: true }),
  };
}

function expectConfigResult(
  tokens: readonly string[],
  envAssignments: ReadonlyMap<string, string> | undefined,
  cwd: string,
  expected: boolean,
) {
  expect(hasRecursiveSubmoduleConfig(tokens, envAssignments, cwd)).toBe(expected);
}

const GIT_RESET = ['git', 'reset', '--hard'] as const;

describe('hasRecursiveSubmoduleConfig', () => {
  describe('command-line config options', () => {
    test('returns false when git -c submodule.recurse=false', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        expectConfigResult(
          ['git', '-c', 'submodule.recurse=false', 'reset', '--hard'],
          undefined,
          fixture.linkedWorktree,
          false,
        );
      } finally {
        fixture.cleanup();
      }
    });

    test('returns true for git -c with include.path', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        expectConfigResult(
          ['git', '-c', 'include.path=other.config', 'reset', '--hard'],
          undefined,
          fixture.linkedWorktree,
          true,
        );
      } finally {
        fixture.cleanup();
      }
    });

    test('returns true for git -c with includeIf path', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        expectConfigResult(
          ['git', '-c', 'includeIf.gitdir:foo/.path=extra.config', 'reset', '--hard'],
          undefined,
          fixture.linkedWorktree,
          true,
        );
      } finally {
        fixture.cleanup();
      }
    });

    test('handles -- separator as subcommand boundary', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        const result = hasRecursiveSubmoduleConfig(
          ['git', '--', 'reset', '--hard'],
          undefined,
          fixture.linkedWorktree,
        );
        expect(typeof result).toBe('boolean');
      } finally {
        fixture.cleanup();
      }
    });

    test('handles --config-env with env assignment for submodule.recurse', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        expectConfigResult(
          ['git', '--config-env', 'submodule.recurse=MY_RECURSE', 'reset', '--hard'],
          new Map([['MY_RECURSE', 'true']]),
          fixture.linkedWorktree,
          true,
        );
      } finally {
        fixture.cleanup();
      }
    });

    test('handles --config-env= form with env assignment for submodule.recurse=false', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        expectConfigResult(
          ['git', '--config-env=submodule.recurse=MY_RECURSE', 'reset', '--hard'],
          new Map([['MY_RECURSE', 'false']]),
          fixture.linkedWorktree,
          false,
        );
      } finally {
        fixture.cleanup();
      }
    });

    test('--config-env without = in spec does not override', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        const result = hasRecursiveSubmoduleConfig(
          ['git', '--config-env', 'submodule.recurse', 'reset', '--hard'],
          undefined,
          fixture.linkedWorktree,
        );
        expect(typeof result).toBe('boolean');
      } finally {
        fixture.cleanup();
      }
    });

    test('--config-env with include.path key returns true', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        expectConfigResult(
          ['git', '--config-env=include.path=INC_PATH', 'reset', '--hard'],
          new Map([['INC_PATH', '/some/config']]),
          fixture.linkedWorktree,
          true,
        );
      } finally {
        fixture.cleanup();
      }
    });

    test('--config-env with undefined env value returns true (fail closed)', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        expectConfigResult(
          ['git', '--config-env=submodule.recurse=MISSING_VAR', 'reset', '--hard'],
          undefined,
          fixture.linkedWorktree,
          true,
        );
      } finally {
        fixture.cleanup();
      }
    });
  });

  describe('env-based config (GIT_CONFIG_COUNT)', () => {
    test('returns true when GIT_CONFIG_PARAMETERS is set', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        expectConfigResult(
          GIT_RESET,
          new Map([['GIT_CONFIG_PARAMETERS', "'submodule.recurse=true'"]]),
          fixture.linkedWorktree,
          true,
        );
      } finally {
        fixture.cleanup();
      }
    });

    test('returns true for non-integer GIT_CONFIG_COUNT', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        expectConfigResult(
          GIT_RESET,
          new Map([['GIT_CONFIG_COUNT', 'abc']]),
          fixture.linkedWorktree,
          true,
        );
      } finally {
        fixture.cleanup();
      }
    });

    test('returns true for negative GIT_CONFIG_COUNT', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        expectConfigResult(
          GIT_RESET,
          new Map([['GIT_CONFIG_COUNT', '-1']]),
          fixture.linkedWorktree,
          true,
        );
      } finally {
        fixture.cleanup();
      }
    });

    test('reads submodule.recurse from env config entries', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        expectConfigResult(
          GIT_RESET,
          new Map([
            ['GIT_CONFIG_COUNT', '1'],
            ['GIT_CONFIG_KEY_0', 'submodule.recurse'],
            ['GIT_CONFIG_VALUE_0', 'false'],
          ]),
          fixture.linkedWorktree,
          false,
        );
      } finally {
        fixture.cleanup();
      }
    });

    test('returns true when GIT_CONFIG_VALUE is missing for submodule.recurse', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        expectConfigResult(
          GIT_RESET,
          new Map([
            ['GIT_CONFIG_COUNT', '1'],
            ['GIT_CONFIG_KEY_0', 'submodule.recurse'],
          ]),
          fixture.linkedWorktree,
          true,
        );
      } finally {
        fixture.cleanup();
      }
    });
  });

  describe('local git config file resolution', () => {
    test('returns true when cwd has no .git ancestor (null config paths)', () => {
      const tmpDir = mkdtempSync(join(tmpdir(), 'safety-net-no-git-'));
      try {
        expectConfigResult(GIT_RESET, undefined, tmpDir, true);
      } finally {
        rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    test('detects submodule.recurse=true in local worktree config', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        execFileSync('git', ['config', 'submodule.recurse', 'true'], {
          cwd: fixture.linkedWorktree,
          stdio: 'ignore',
        });
        expectConfigResult(GIT_RESET, undefined, fixture.linkedWorktree, true);
      } finally {
        fixture.cleanup();
      }
    });

    test('detects submodule.recurse=false in local worktree config', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        execFileSync('git', ['config', 'submodule.recurse', 'false'], {
          cwd: fixture.linkedWorktree,
          stdio: 'ignore',
        });
        expectConfigResult(GIT_RESET, undefined, fixture.linkedWorktree, false);
      } finally {
        fixture.cleanup();
      }
    });

    test('returns true when local config has include directive', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        const configPath = join(fixture.mainWorktree, '.git', 'config');
        const existing = readFileSync(configPath, 'utf-8');
        writeFileSync(configPath, `${existing}\n[include]\n\tpath = extra.config\n`);
        expectConfigResult(GIT_RESET, undefined, fixture.linkedWorktree, true);
      } finally {
        fixture.cleanup();
      }
    });

    test('returns true when local config has includeIf directive', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        const configPath = join(fixture.mainWorktree, '.git', 'config');
        const existing = readFileSync(configPath, 'utf-8');
        writeFileSync(
          configPath,
          `${existing}\n[includeIf "gitdir:~/projects/"]\n\tpath = work.config\n`,
        );
        expectConfigResult(GIT_RESET, undefined, fixture.linkedWorktree, true);
      } finally {
        fixture.cleanup();
      }
    });

    test('returns true when .git file points to nonexistent gitdir', () => {
      const tmpDir = mkdtempSync(join(tmpdir(), 'safety-net-bad-gitdir-'));
      writeFileSync(join(tmpDir, '.git'), 'gitdir: /nonexistent/gitdir/path\n');
      try {
        expectConfigResult(GIT_RESET, undefined, tmpDir, true);
      } finally {
        rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    test('returns true when .git file has empty gitdir reference', () => {
      const tmpDir = mkdtempSync(join(tmpdir(), 'safety-net-empty-gitdir-'));
      writeFileSync(join(tmpDir, '.git'), 'gitdir:\n');
      try {
        expectConfigResult(GIT_RESET, undefined, tmpDir, true);
      } finally {
        rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    test('returns true when commondir points to empty content', () => {
      const f = createFakeGitDirFixture('empty-commondir');
      writeFileSync(join(f.gitDir, 'commondir'), '\n');
      try {
        expectConfigResult(GIT_RESET, undefined, f.tmpDir, true);
      } finally {
        f.cleanup();
      }
    });

    test('resolves commondir with relative path', () => {
      const fixture = createLinkedWorktreeFixture();
      const gitDir = getLinkedGitDir(fixture.linkedWorktree);
      try {
        const commonDirContent = readFileSync(join(gitDir, 'commondir'), 'utf-8').trim();
        expect(commonDirContent).not.toBe('');
        const result = hasRecursiveSubmoduleConfig(GIT_RESET, undefined, fixture.linkedWorktree);
        expect(typeof result).toBe('boolean');
      } finally {
        fixture.cleanup();
      }
    });

    test('resolves commondir with absolute path', () => {
      const f = createFakeGitDirFixture('abs-commondir', '[submodule]\n\trecurse = false\n');
      try {
        const result = hasRecursiveSubmoduleConfig(GIT_RESET, undefined, f.tmpDir);
        expect(typeof result).toBe('boolean');
      } finally {
        f.cleanup();
      }
    });

    test('returns true when git config file is unreadable (fail closed)', () => {
      const f = createFakeGitDirFixture('unreadable-config');
      mkdirSync(join(f.commonDir, 'config'));
      try {
        expectConfigResult(GIT_RESET, undefined, f.tmpDir, true);
      } finally {
        f.cleanup();
      }
    });

    test('handles config key without = sign (implied true)', () => {
      const f = createFakeGitDirFixture('implied-true', '[submodule]\n\trecurse\n');
      try {
        expectConfigResult(GIT_RESET, undefined, f.tmpDir, true);
      } finally {
        f.cleanup();
      }
    });
  });

  describe('config-affecting env assignment fallback', () => {
    test('returns true when HOME env is overridden', () => {
      const fixture = createLinkedWorktreeFixture();
      try {
        expectConfigResult(
          GIT_RESET,
          new Map([['HOME', '/some/other/home']]),
          fixture.linkedWorktree,
          true,
        );
      } finally {
        fixture.cleanup();
      }
    });
  });
});
