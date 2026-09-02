import { describe, expect, test } from 'bun:test';
import { getCalledCommandName, isDynamicExecutable } from '@next/core/shell/model';
import { projectCommandViews } from '@next/core/shell/traversal';
import {
  getCalledCommandName as getCalledCommandNameWithSrc,
  isDynamicExecutable as isDynamicExecutableWithSrc,
} from '@/ir/command';
import { projectCommandViews as projectCommandViewsWithSrc } from '@/parser/traversal';
import { differentialProgramPairs } from '../../helpers/shell-inputs';

describe('next/core/shell/model against src/ir/command', () => {
  test('names the called command and detects dynamic executables identically for every view', () => {
    for (const pair of differentialProgramPairs()) {
      const srcViews = projectCommandViewsWithSrc(pair.src);
      const nextViews = projectCommandViews(pair.next);
      expect({
        source: pair.source,
        dialect: pair.dialect,
        views: nextViews.map((view) => ({
          called: getCalledCommandName(view),
          dynamic: isDynamicExecutable(view.dialect, view.words),
        })),
      }).toStrictEqual({
        source: pair.source,
        dialect: pair.dialect,
        views: srcViews.map((view) => ({
          called: getCalledCommandNameWithSrc(view),
          dynamic: isDynamicExecutableWithSrc(view.dialect, view.words),
        })),
      });
    }
  });
});
