import { describe, expect, test } from 'bun:test';
import { renderPages, sliceBlock } from '../helpers/gui-page';

const TOKEN = Buffer.from('cc-safety-net gui suspect fixture').toString('base64url');

type Entry = {
  command: string;
  decision: string;
  sessionId?: string;
  segment?: string;
  failureStage?: string;
};

const pages = renderPages(TOKEN);
const block = (page: string) =>
  [
    sliceBlock(page, 'var commandSignature = (source) => {', '\n// '),
    sliceBlock(page, 'var findSuspects = (entries) => {', 'var clearCommandFilter'),
  ].join('\n');

const findSuspects = new Function(
  'entries',
  `${block(pages.ported)}\nreturn findSuspects(entries);`,
) as (entries: readonly Entry[]) => Set<Entry>;

const suspectCommands = (entries: readonly Entry[]) =>
  [...findSuspects(entries)].map((entry) => entry.command);

describe('the suspect block on the served page', () => {
  test('flags a denial that failed inside the gate on its own', () => {
    const entries: Entry[] = [
      { command: 'terraform destroy', decision: 'deny', sessionId: 's1', failureStage: 'analysis' },
      { command: 'terraform plan', decision: 'deny', sessionId: 's1' },
    ];

    expect(suspectCommands(entries)).toStrictEqual(['terraform destroy']);
  });

  test('flags a signature one session was denied twice for, reading the segment first', () => {
    const entries: Entry[] = [
      {
        command: 'cd /srv && git push --force origin main',
        segment: 'git push --force origin main',
        decision: 'deny',
        sessionId: 's1',
      },
      {
        command: 'FOO=1 git push --force',
        segment: 'git push --force',
        decision: 'deny',
        sessionId: 's1',
      },
    ];

    expect(findSuspects(entries).size).toBe(2);
  });

  test('leaves one denial per session and every allow alone', () => {
    const entries: Entry[] = [
      { command: 'git push --force', decision: 'deny', sessionId: 's1' },
      { command: 'git push --force', decision: 'deny', sessionId: 's2' },
      { command: 'git status', decision: 'allow', sessionId: 's3', failureStage: 'analysis' },
      { command: 'git status', decision: 'allow', sessionId: 's3' },
      { command: 'git push --force', decision: 'deny' },
      { command: 'git push --force', decision: 'deny' },
    ];

    expect(suspectCommands(entries)).toStrictEqual([]);
  });
});
