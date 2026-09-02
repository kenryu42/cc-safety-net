import { describe, expect, test } from 'bun:test';
import { parseSimpleWords, projectSegmentWords } from '@next/core/shell/traversal';
import {
  parseSimpleWords as parseSimpleWordsWithSrc,
  projectSegmentWords as projectSegmentWordsWithSrc,
} from '@/parser/traversal';
import { differentialProgramPairs, differentialSources } from '../../helpers/shell-inputs';

describe('next/core/shell/traversal against src/parser/traversal', () => {
  test('projects the same segment word lists from every parsed program', () => {
    for (const pair of differentialProgramPairs()) {
      expect({
        source: pair.source,
        dialect: pair.dialect,
        words: projectSegmentWords(pair.next),
      }).toStrictEqual({
        source: pair.source,
        dialect: pair.dialect,
        words: projectSegmentWordsWithSrc(pair.src),
      });
    }
  });

  test('recognizes the same argv-like sources as one plain command', () => {
    const argvLike = [
      'log --oneline -n 5',
      'commit -m "msg"',
      'status $(pwd)',
      'echo one; echo two',
      'echo > out',
      'echo {}',
      '',
    ];
    for (const source of [...differentialSources(), ...argvLike]) {
      expect({ source, words: parseSimpleWords(source) }).toStrictEqual({
        source,
        words: parseSimpleWordsWithSrc(source),
      });
    }
  });
});
