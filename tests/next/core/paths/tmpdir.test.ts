import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as next from '@next/core/paths/tmpdir';
import * as shipped from '@/analyzer/tmpdir';
import { corpusWords, pairedEnvironments, pickWord, seededRandom } from '../differential-inputs';

const IFS_VALUES = [undefined, '', ' \t\n', ':', 'x'];
const FRAGMENTS = [
  '/tmp',
  '/var',
  '/private',
  '/',
  '..',
  'x',
  '$',
  '`',
  '*',
  '?',
  '[',
  '{a,b}',
  '{1..2}',
  '@(x)',
  ' ',
  '\t',
  '~',
];

let root = '';
let outside = '';

function tmpdirValues(): (string | undefined)[] {
  return [
    undefined,
    '/tmp',
    '/tmp/',
    '/tmp/sub',
    '/var/tmp/x',
    '/private/tmp/x',
    '/private/var/tmp',
    '/tmp/../etc',
    '/tmp-evil',
    '',
    ' ',
    '/tmp/$x',
    '/tmp/`x`',
    '/tmp/{a,b}',
    '/tmp/{1..3}',
    '/tmp/+(x)',
    '/tmp/a b',
    'relative/tmp',
    '~/tmp',
    '/tmp/*',
    '/tmp/?',
    '/tmp/[a]',
    '/tmp\0x',
    tmpdir(),
    join(tmpdir(), 'x'),
    root,
    join(root, 'escape'),
    join(root, 'escape', 'x'),
    join(root, 'inner'),
    join(root, 'broken'),
    outside,
    ...corpusWords(),
  ];
}

function compare(
  envValue: string | undefined,
  assigned: string | undefined,
  ifs: string | undefined,
): void {
  const env = {
    ...(envValue === undefined ? {} : { TMPDIR: envValue }),
    ...(ifs === undefined ? {} : { IFS: ifs }),
  };
  const pair = pairedEnvironments(env, '/srv/home/tester');
  const assignments = new Map(assigned === undefined ? [] : [['TMPDIR', assigned]]);
  expect(next.isTmpdirOverriddenToNonTemp(assignments, pair.next)).toBe(
    shipped.isTmpdirOverriddenToNonTemp(assignments, pair.shipped),
  );
  expect(next.isTmpdirValueTrusted(assignments, pair.next)).toBe(
    shipped.isTmpdirValueTrusted(assignments, pair.shipped),
  );
  expect(next.getEffectiveTmpdirValue(assignments, pair.next)).toBe(
    shipped.getEffectiveTmpdirValue(assignments, pair.shipped),
  );
  expect(next.hasUnsafeTmpdirWordSplitting(assignments, pair.next)).toBe(
    shipped.hasUnsafeTmpdirWordSplitting(assignments, pair.shipped),
  );
  const value = assigned ?? envValue ?? '';
  expect(next.isTrustedTempPath(value, pair.next)).toBe(
    shipped.isTrustedTempPath(value, pair.shipped),
  );
  expect(next.isTrustedTempRootPath(value, pair.next)).toBe(
    shipped.isTrustedTempRootPath(value, pair.shipped),
  );
}

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'next-tmpdir-'));
  outside = mkdtempSync(join(tmpdir(), 'next-tmpdir-outside-'));
  mkdirSync(join(root, 'inner'));
  symlinkSync(outside, join(root, 'escape'));
  symlinkSync(join(root, 'nowhere'), join(root, 'broken'));
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
  rmSync(outside, { recursive: true, force: true });
});

describe('tmpdir trust', () => {
  test('agrees with the shipped checks over the table, as inherited and as assigned', () => {
    for (const value of tmpdirValues()) {
      for (const ifs of IFS_VALUES) {
        compare(value, undefined, ifs);
        compare(undefined, value, ifs);
        compare('/tmp', value, ifs);
        compare(value, '/tmp', ifs);
      }
    }
  });

  test('agrees with the shipped checks on a seeded fuzz of assigned values', () => {
    const random = seededRandom(0x7e3d_1201);
    const words = [...FRAGMENTS, ...corpusWords()];
    for (let sample = 0; sample < 300; sample++) {
      const length = 1 + Math.floor(random() * 6);
      const value = Array.from({ length }, () => pickWord(random, words)).join('');
      compare(undefined, value, undefined);
      compare(
        value,
        undefined,
        pickWord(
          random,
          IFS_VALUES.filter((ifs) => ifs !== undefined),
        ),
      );
    }
  });
});
