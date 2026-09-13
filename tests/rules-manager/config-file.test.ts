import { afterEach, describe, expect, test } from 'bun:test';
import { lstatSync } from 'node:fs';
import { join } from 'node:path';
import { assertValidRulebook } from '@/core/policy/rulebook';
import {
  readScopeRulesConfig,
  writeDefaultRulesConfig,
  writeStarterRulebook,
} from '@/rules-manager/config-file';
import { snapshotTree, type TreeSpec, writeTree } from '../helpers/fixture-tree';
import { createTempRoot, removeTempRoots } from '../helpers/temp-home';

const OVER_LIMIT_SOURCES = Array.from({ length: 65 }, (_unused, index) => `book-${index}`);

const TREE: TreeSpec = {
  'listed/rule.json': '{"version":1,"rules":["team-rules"],"overrides":{"team-rules/x":"off"}}',
  'blank/rule.json': '   ',
  'garbled/rule.json': '{"version":1,',
  'over-limit/rule.json': JSON.stringify({ version: 1, rules: OVER_LIMIT_SOURCES }),
  nothing: null,
};

afterEach(removeTempRoots);

function readBoth(file: string) {
  const portedRoot = createTempRoot('scope-config-read-ported-');
  writeTree(portedRoot, TREE);
  return readScopeRulesConfig(join(portedRoot, file));
}

describe('reading a scope config reports what the shipped reader reports', () => {
  test('a missing config reads as the empty default', () => {
    expect(readBoth('nothing/rule.json')).toEqual({
      ok: true,
      config: { version: 1, rules: [], overrides: {}, transparent_wrappers: [] },
    });
  });

  test('a listed source keeps its overrides and gains the omitted fields', () => {
    expect(readBoth('listed/rule.json')).toEqual({
      ok: true,
      config: {
        version: 1,
        rules: ['team-rules'],
        overrides: { 'team-rules/x': 'off' },
        transparent_wrappers: [],
      },
    });
  });

  test.each([
    ['blank/rule.json', 'Config file is empty'],
    ['garbled/rule.json', 'Invalid JSON'],
    ['over-limit/rule.json', "Rule config exceeds CC Safety Net's safe source limit."],
  ])('%s refuses the scope with %s', (file, message) => {
    expect(readBoth(file)).toEqual({
      ok: false,
      result: { ok: false, errors: [message], entries: [] },
    });
  });
});

const WRITES = [
  {
    name: 'a default config with no sources',
    ported: (path: string) => writeDefaultRulesConfig(path),
    states: (written: unknown) =>
      expect(written).toEqual({ version: 1, rules: [], overrides: {}, transparent_wrappers: [] }),
  },
  {
    name: 'a default config listing two sources',
    ported: (path: string) => writeDefaultRulesConfig(path, ['team-rules', 'local-a']),
    states: (written: unknown) =>
      expect(written).toEqual({
        version: 1,
        rules: ['team-rules', 'local-a'],
        overrides: {},
        transparent_wrappers: [],
      }),
  },
  {
    name: 'the project starter rulebook',
    ported: (path: string) => writeStarterRulebook(path),
    states: (written: unknown) =>
      expect(starterExample(written)).toEqual({
        name: 'project-rules',
        author: 'project',
        description: 'Project-specific CC Safety Net rules.',
      }),
  },
  {
    name: 'the user starter rulebook',
    ported: (path: string) => writeStarterRulebook(path, 'user-rules'),
    states: (written: unknown) =>
      expect(starterExample(written)).toEqual({
        name: 'user-rules',
        author: 'user',
        description: 'User-specific CC Safety Net rules.',
      }),
  },
];

function starterExample(written: unknown) {
  const rulebook = assertValidRulebook(written);
  expect(rulebook.allowed_commands).toEqual(['docker']);
  expect(rulebook.rules.map((rule) => rule.name)).toEqual(['block-docker-system-prune']);
  expect(rulebook.tests).toEqual([
    { command: 'docker system prune', expect: 'blocked', rule: 'block-docker-system-prune' },
  ]);
  return { name: rulebook.name, author: rulebook.author, description: rulebook.description };
}

describe('writing a scope file leaves what the shipped writer leaves', () => {
  test.each(WRITES)('writes $name', (row) => {
    const portedRoot = createTempRoot('scope-config-write-ported-');
    const target = 'scope/rules/written.json';
    row.ported(join(portedRoot, target));
    const tree = snapshotTree(portedRoot);
    const written: unknown = JSON.parse(tree.at(-1)?.content ?? 'null');
    row.states(written);
    expect(tree.at(-1)?.content).toBe(`${JSON.stringify(written, null, 2)}\n`);
    expect(tree.map((entry) => ({ path: entry.path, kind: entry.kind }))).toEqual([
      { path: 'scope', kind: 'directory' },
      { path: 'scope/rules', kind: 'directory' },
      { path: target, kind: 'file' },
    ]);
    if (process.platform === 'win32') return;
    expect(
      tree.map((entry) => (lstatSync(join(portedRoot, entry.path)).mode & 0o777).toString(8)),
    ).toEqual(['700', '700', '600']);
  });
});
