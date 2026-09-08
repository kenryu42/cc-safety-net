import { describe, expect, test } from 'bun:test';
import type { CommandDialect } from '@/core/shell/model';
import { getCalledCommandName, isDynamicExecutable } from '@/core/shell/model';
import { parseCommand } from '@/core/shell/parse';
import { projectCommandViews } from '@/core/shell/traversal';

const firstView = (source: string, dialect: CommandDialect = 'posix') =>
  projectCommandViews(parseCommand(source, dialect))[0];

describe('core/shell/model', () => {
  test('names the command a word list runs, skipping keyword prefixes and assignments', () => {
    const rows: readonly { readonly source: string; readonly called: string | undefined }[] = [
      { source: 'git status', called: 'git' },
      { source: 'FOO=1 BAR=2 git status', called: 'git' },
      { source: 'time git status', called: 'git' },
      { source: 'time -p git status', called: 'git' },
      { source: 'time -p -- git status', called: 'git' },
      { source: '! git status', called: 'git' },
      // contract: src/core/shell/model.ts:113 — quoting does not change provenance, so a
      // quoted literal still names the command.
      { source: '"git" status', called: 'git' },
      { source: '$(printf git) status', called: undefined },
      { source: 'A=1', called: undefined },
      { source: '$HOME/bin/git status', called: undefined },
    ];
    for (const row of rows) {
      const view = firstView(row.source);
      expect(view === undefined ? undefined : getCalledCommandName(view), row.source).toBe(
        row.called,
      );
    }
  });

  test('detects an executable the parse cannot name', () => {
    const rows: readonly {
      readonly source: string;
      readonly dialect: CommandDialect;
      readonly dynamic: boolean;
    }[] = [
      { source: 'git status', dialect: 'posix', dynamic: false },
      { source: '$(printf r)m -rf /', dialect: 'posix', dynamic: true },
      { source: '"git" status', dialect: 'posix', dynamic: false },
      { source: '$HOME/bin/git status', dialect: 'posix', dynamic: false },
      { source: '& git status', dialect: 'powershell', dynamic: false },
      { source: '& $cmd status', dialect: 'powershell', dynamic: true },
      { source: '. $script', dialect: 'powershell', dynamic: true },
      { source: 'Remove-Item .', dialect: 'powershell', dynamic: false },
    ];
    for (const row of rows) {
      const view = firstView(row.source, row.dialect);
      expect(
        view === undefined ? undefined : isDynamicExecutable(view.dialect, view.words),
        row.source,
      ).toBe(row.dynamic);
    }
  });

  test('the words of a substitution-headed command are the substitution output', () => {
    const view = firstView('$(printf r)m -rf /');
    expect(view?.words.map((word) => word.text)).toStrictEqual(['m', '-rf', '/']);
    expect(view?.words[0]?.provenance).toBe('command-substitution');
  });
});
