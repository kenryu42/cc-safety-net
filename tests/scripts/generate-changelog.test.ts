import { describe, expect, test } from 'bun:test';
import {
  type CommandRunner,
  formatReleaseNotes,
  generateChangelog,
  getContributors,
  getContributorsForRepo,
  getLatestReleasedTag,
  isIncludedCommit,
  runChangelog,
} from '../../scripts/generate-changelog';

type RunnerResponse = string | (() => string) | (() => Promise<string>);

function createRunner(responses: Record<string, RunnerResponse>): CommandRunner {
  return (strings, ...values) => {
    const command = strings.reduce(
      (acc, part, index) => `${acc}${part}${String(values[index] ?? '')}`,
      '',
    );
    return {
      text: async () => {
        const response = responses[command];
        if (response === undefined) {
          throw new Error(`Unexpected command: ${command}`);
        }
        if (typeof response === 'function') {
          return await response();
        }
        return response;
      },
    };
  };
}

function contributorRunner(compare: string): CommandRunner {
  return createRunner({
    'gh api "/repos/example/repo/compare/v1.0.0...HEAD" --jq \'.commits[] | {login: .author.login, message: .commit.message}\'':
      compare,
  });
}

function compareCommit(login: string | null, message: string): string {
  return JSON.stringify({ login, message });
}

describe('isIncludedCommit', () => {
  describe('simple prefixes', () => {
    test('includes feat: commits', () => {
      expect(isIncludedCommit('feat: add new feature')).toBe(true);
    });

    test('includes fix: commits', () => {
      expect(isIncludedCommit('fix: resolve bug')).toBe(true);
    });

    test('excludes chore: commits', () => {
      expect(isIncludedCommit('chore: update deps')).toBe(false);
    });

    test('excludes docs: commits', () => {
      expect(isIncludedCommit('docs: update readme')).toBe(false);
    });
  });

  describe('scoped prefixes', () => {
    test('includes feat(scope): commits', () => {
      expect(isIncludedCommit('feat(api): add endpoint')).toBe(true);
    });

    test('includes fix(scope): commits', () => {
      expect(isIncludedCommit('fix(commands): resolve issue')).toBe(true);
    });

    test('includes feat(multi-word): commits', () => {
      expect(isIncludedCommit('feat(user-auth): add login')).toBe(true);
    });

    test('excludes chore(scope): commits', () => {
      expect(isIncludedCommit('chore(deps): update')).toBe(false);
    });

    test('excludes docs(scope): commits', () => {
      expect(isIncludedCommit('docs(readme): update')).toBe(false);
    });
  });

  describe('with git hash prefix', () => {
    test('includes abc1234 feat: commits', () => {
      expect(isIncludedCommit('abc1234 feat: add feature')).toBe(true);
    });

    test('includes abc1234 fix(scope): commits', () => {
      expect(isIncludedCommit('abc1234 fix(commands): fix bug')).toBe(true);
    });

    test('excludes abc1234 chore: commits', () => {
      expect(isIncludedCommit('abc1234 chore: update')).toBe(false);
    });
  });

  describe('case insensitivity', () => {
    test('includes FEAT: commits', () => {
      expect(isIncludedCommit('FEAT: add feature')).toBe(true);
    });

    test('includes FIX(scope): commits', () => {
      expect(isIncludedCommit('FIX(commands): fix bug')).toBe(true);
    });
  });
});

describe('getLatestReleasedTag', () => {
  test('returns latest tag', async () => {
    const runner = createRunner({
      "gh release list --exclude-drafts --exclude-pre-releases --limit 1 --json tagName --jq '.[0].tagName // empty'":
        'v1.2.3\n',
    });

    await expect(getLatestReleasedTag(runner)).resolves.toBe('v1.2.3');
  });

  test('returns null on failure', async () => {
    const runner = createRunner({});

    await expect(getLatestReleasedTag(runner)).resolves.toBeNull();
  });
});

describe('formatReleaseNotes', () => {
  test('renders sections and contributors', () => {
    const notes = formatReleaseNotes(
      {
        core: ['- abc123 feat: core change'],
        claudeCode: ['- def456 fix(commands): adjust'],
        openCode: ['- ghi789 fix(opencode): tweak'],
      },
      ['', '**Thank you to 1 community contributor:**', '- @alice:', '  - feat: add thing'],
    );

    expect(notes).toEqual([
      '## Core',
      '- abc123 feat: core change',
      '',
      '## Claude Code',
      '- def456 fix(commands): adjust',
      '',
      '## OpenCode',
      '- ghi789 fix(opencode): tweak',
      '',
      '**Thank you to 1 community contributor:**',
      '- @alice:',
      '  - feat: add thing',
    ]);
  });

  test('renders empty sections without contributors', () => {
    const notes = formatReleaseNotes({ core: [], claudeCode: [], openCode: [] }, []);

    expect(notes).toEqual([
      '## Core',
      'No changes in this release',
      '',
      '## Claude Code',
      'No changes in this release',
      '',
      '## OpenCode',
      'No changes in this release',
    ]);
  });
});

describe('generateChangelog', () => {
  test('categorizes commits by changed files', async () => {
    const runner = createRunner({
      'git log v1.0.0..HEAD --oneline --format="%h %s"': [
        'abc123 feat: core change',
        'bcd234 fix(skills): adjust',
        'cde345 fix(opencode): tweak',
        'eee111 feat: missing files',
        'fff222 chore: skip',
      ].join('\n'),
      'git diff-tree --no-commit-id --name-only -r abc123': 'src/core/analyze/index.ts\n',
      'git diff-tree --no-commit-id --name-only -r bcd234': 'skills/example/SKILL.md\n',
      'git diff-tree --no-commit-id --name-only -r cde345': '.opencode/config.json\n',
      'git diff-tree --no-commit-id --name-only -r eee111': () => {
        throw new Error('boom');
      },
    });

    const changelog = await generateChangelog('v1.0.0', runner);

    expect(changelog).toEqual({
      core: ['- abc123 feat: core change', '- eee111 feat: missing files'],
      claudeCode: ['- bcd234 fix(skills): adjust'],
      openCode: ['- cde345 fix(opencode): tweak'],
    });
  });

  test('returns empty categories when git log fails', async () => {
    const runner = createRunner({});

    const changelog = await generateChangelog('v1.0.0', runner);

    expect(changelog).toEqual({
      core: [],
      claudeCode: [],
      openCode: [],
    });
  });
});

describe('getContributorsForRepo', () => {
  test('includes unique contributors and their commits', async () => {
    const compare = [
      compareCommit('alice', 'feat: add thing\n\nBody'),
      compareCommit('bob', 'fix: resolve issue'),
      compareCommit('alice', 'feat: follow-up'),
      compareCommit('kenryu42', 'feat: excluded author'),
      compareCommit(null, 'feat: missing author'),
      compareCommit('carol', 'chore: ignore'),
    ].join('\n');

    const notes = await getContributorsForRepo(
      'v1.0.0',
      'example/repo',
      contributorRunner(compare),
    );

    expect(notes).toEqual([
      '',
      '**Thank you to 2 community contributors:**',
      '- @alice:',
      '  - feat: add thing',
      '  - feat: follow-up',
      '- @bob:',
      '  - fix: resolve issue',
    ]);
  });

  test('returns empty list when no contributors qualify', async () => {
    const compare = [
      compareCommit('kenryu42', 'feat: excluded author'),
      compareCommit('carol', 'chore: ignore'),
    ].join('\n');

    const notes = await getContributorsForRepo(
      'v1.0.0',
      'example/repo',
      contributorRunner(compare),
    );

    expect(notes).toEqual([]);
  });

  test('returns empty list on command failure', async () => {
    const runner = createRunner({});

    const notes = await getContributorsForRepo('v1.0.0', 'example/repo', runner);

    expect(notes).toEqual([]);
  });
});

describe('getContributors', () => {
  test('uses default repo wrapper', async () => {
    const runner = createRunner({
      'gh api "/repos/kenryu42/cc-safety-net/compare/v1.0.0...HEAD" --jq \'.commits[] | {login: .author.login, message: .commit.message}\'':
        JSON.stringify({
          login: 'alice',
          message: 'feat: add thing',
        }),
    });

    const notes = await getContributors('v1.0.0', runner);

    expect(notes).toEqual([
      '',
      '**Thank you to 1 community contributor:**',
      '- @alice:',
      '  - feat: add thing',
    ]);
  });
});

describe('runChangelog', () => {
  test('prints initial release when no tag exists', async () => {
    const runner = createRunner({
      "gh release list --exclude-drafts --exclude-pre-releases --limit 1 --json tagName --jq '.[0].tagName // empty'":
        '\n',
    });
    const logs: string[] = [];

    await runChangelog({
      runner,
      log: (message) => {
        logs.push(message);
      },
    });

    expect(logs).toEqual(['Initial release']);
  });

  test('prints changelog and contributors for tagged releases', async () => {
    const compare = JSON.stringify({
      login: 'alice',
      message: 'feat: add thing',
    });
    const runner = createRunner({
      "gh release list --exclude-drafts --exclude-pre-releases --limit 1 --json tagName --jq '.[0].tagName // empty'":
        'v1.0.0\n',
      'git log v1.0.0..HEAD --oneline --format="%h %s"': 'abc123 feat: core change',
      'git diff-tree --no-commit-id --name-only -r abc123': 'src/core/analyze/index.ts\n',
      'gh api "/repos/kenryu42/cc-safety-net/compare/v1.0.0...HEAD" --jq \'.commits[] | {login: .author.login, message: .commit.message}\'':
        compare,
    });
    const logs: string[] = [];

    await runChangelog({
      runner,
      log: (message) => {
        logs.push(message);
      },
    });

    expect(logs).toEqual([
      [
        '## Core',
        '- abc123 feat: core change',
        '',
        '## Claude Code',
        'No changes in this release',
        '',
        '## OpenCode',
        'No changes in this release',
        '',
        '**Thank you to 1 community contributor:**',
        '- @alice:',
        '  - feat: add thing',
      ].join('\n'),
    ]);
  });
});
