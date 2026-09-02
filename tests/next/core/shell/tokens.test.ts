import { describe, expect, test } from 'bun:test';
import {
  advanceQuoteScanState,
  extractShortOpts,
  getBasename,
  getShellCommandString,
  hasUnclosedQuotes,
  normalizeCommandToken,
} from '@next/core/shell/tokens';
import {
  extractShortOpts as extractShortOptsWithSrc,
  getBasename as getBasenameWithSrc,
  getShellCommandString as getShellCommandStringWithSrc,
  normalizeCommandToken as normalizeCommandTokenWithSrc,
} from '@/parser/shell';
import {
  advanceQuoteScanState as advanceQuoteScanStateWithSrc,
  hasUnclosedQuotes as hasUnclosedQuotesWithSrc,
} from '@/parser/shell/shared';
import {
  createSeededRandom,
  differentialSources,
  FUZZ_SEED,
  fuzzShellSources,
} from '../../helpers/shell-inputs';

const SHELLS = ['bash', 'sh', 'dash', 'zsh', 'ksh', 'fish', 'pwsh', 'BASH'];

const ARGV_ALPHABET = [
  '-c',
  '-lc',
  '-cl',
  '-ic',
  '-o',
  '+o',
  '-oc',
  '-o-c',
  '-ox',
  '-oxc',
  '+oc',
  '-O',
  '-Ox',
  '--',
  '-',
  '+',
  '-e',
  '--norc',
  '--rcfile',
  '--rcfile=x',
  '--init-file',
  '--init-file=y',
  '--posix',
  'x',
  'echo hi',
  'rm -rf /',
  'pipefail',
  '',
];

function tokensOf(sources: readonly string[]): readonly string[] {
  return [...new Set(sources.flatMap((source) => source.split(/[\s]+/)))];
}

describe('next/core/shell/tokens against src/parser/shell', () => {
  const sources = differentialSources();
  const tokens = tokensOf(sources);

  test('normalizes and strips basenames identically', () => {
    const paths = [
      '/usr/bin/Git.EXE',
      'C:\\Program Files\\Git\\git.exe',
      'RM',
      '.\\rm.exe',
      '/',
      '\\',
      '',
      'a/b/',
      'x.exe.exe',
    ];
    for (const token of [...tokens, ...paths]) {
      expect({
        token,
        basename: getBasename(token),
        normalized: normalizeCommandToken(token),
      }).toStrictEqual({
        token,
        basename: getBasenameWithSrc(token),
        normalized: normalizeCommandTokenWithSrc(token),
      });
    }
  });

  test('extracts the same short options with and without value-taking options', () => {
    const random = createSeededRandom(FUZZ_SEED);
    const valueOptions = new Set(['-c', '-o', '-f', '-m']);
    const argvs = [
      ...sources.map((source) => source.split(' ')),
      ...Array.from({ length: 500 }, () =>
        Array.from(
          { length: 1 + Math.floor(random() * 6) },
          () => ARGV_ALPHABET[Math.floor(random() * ARGV_ALPHABET.length)] ?? '',
        ),
      ),
    ];
    for (const argv of argvs) {
      expect({
        argv,
        plain: [...extractShortOpts(argv)],
        withValues: [...extractShortOpts(argv, { shortOptsWithValue: valueOptions })],
      }).toStrictEqual({
        argv,
        plain: [...extractShortOptsWithSrc(argv)],
        withValues: [...extractShortOptsWithSrc(argv, { shortOptsWithValue: valueOptions })],
      });
    }
  });

  test('selects the same -c command string for every shell and argv', () => {
    const random = createSeededRandom(FUZZ_SEED ^ 0xff);
    for (let sample = 0; sample < 3_000; sample++) {
      const shell = SHELLS[Math.floor(random() * SHELLS.length)] ?? 'bash';
      const args = Array.from(
        { length: Math.floor(random() * 6) },
        () => ARGV_ALPHABET[Math.floor(random() * ARGV_ALPHABET.length)] ?? '',
      );
      expect({ shell, args, command: getShellCommandString(shell, args) }).toStrictEqual({
        shell,
        args,
        command: getShellCommandStringWithSrc(shell, args),
      });
    }
  });

  test('scans quotes and comments identically over every source', () => {
    for (const source of [...sources, ...fuzzShellSources(500, FUZZ_SEED ^ 0xabcd)]) {
      const state = { inSingle: false, inDouble: false, escaped: false };
      const srcState = { inSingle: false, inDouble: false, escaped: false };
      const steps = [...source].map((char) => ({
        consumed: advanceQuoteScanState(char, state),
        state: { ...state },
      }));
      const srcSteps = [...source].map((char) => ({
        consumed: advanceQuoteScanStateWithSrc(char, srcState),
        state: { ...srcState },
      }));
      expect({ source, unclosed: hasUnclosedQuotes(source), steps }).toStrictEqual({
        source,
        unclosed: hasUnclosedQuotesWithSrc(source),
        steps: srcSteps,
      });
    }
  });
});
