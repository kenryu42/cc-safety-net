import { describe, expect, test } from 'bun:test';
import { projectShellSyntax } from '@next/core/shell/projection';
import { projectShellSyntax as projectWithSrc } from '@/parser/shell/entry-projection';
import { differentialProgramPairs } from '../../helpers/shell-inputs';

describe('next/core/shell/projection against src/parser/shell/entry-projection', () => {
  test('projects every parsed program onto the same entry stream', () => {
    for (const pair of differentialProgramPairs()) {
      expect({
        source: pair.source,
        dialect: pair.dialect,
        facts: projectShellSyntax(pair.source, pair.next),
      }).toStrictEqual({
        source: pair.source,
        dialect: pair.dialect,
        facts: projectWithSrc(pair.source, pair.src),
      });
    }
  });
});
