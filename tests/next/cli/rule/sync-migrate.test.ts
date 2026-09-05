import { afterEach, describe, expect, test } from 'bun:test';
import { join } from 'node:path';
import { findRuleV2Leftovers as findPorted } from '@next/cli/rule/sync-migrate';
import { findRuleV2Leftovers as findShipped } from '@/cli/rule/sync-migrate';
import { type TreeSpec, writeTree } from '../../helpers/fixture-tree';
import {
  createTempRoot,
  environmentFor,
  isolationEnv,
  removeTempRoots,
  withProcessEnv,
} from '../../helpers/temp-home';

/**
 * Doctor's only reason to name a version 2 lock or cache is that the file is there, so each row
 * puts one where a scope would have left it and asserts both implementations name the same
 * absolute paths in the same order — project scope first, then user scope, lock before cache.
 * The user scope is resolved from `CC_SAFETY_NET_HOME`, which the last row moves.
 */

afterEach(() => {
  removeTempRoots();
});

function findLeftovers(spec: TreeSpec, overrides: Record<string, string | undefined> = {}) {
  const root = createTempRoot('rule-leftovers-');
  const home = join(root, 'home');
  const values = isolationEnv(
    home,
    Object.fromEntries(
      Object.entries(overrides).map(([name, value]) => [
        name,
        value === undefined ? undefined : join(root, value),
      ]),
    ),
  );
  writeTree(root, spec);
  const cwd = join(root, 'project');
  const shipped = withProcessEnv(values, () => findShipped(cwd));
  const ported = findPorted(environmentFor(home, values), cwd);
  expect(ported).toEqual(shipped);
  return { root, paths: ported };
}

describe('findRuleV2Leftovers', () => {
  test('a scope with nothing left behind reports nothing', () => {
    expect(findLeftovers({ 'project/.cc-safety-net/rules/rule.json': '{}\n' }).paths).toEqual([]);
  });

  test('a project lock is reported on its own', () => {
    const { root, paths } = findLeftovers({ 'project/.cc-safety-net/rules/rule.lock': '{}\n' });
    expect(paths).toEqual([join(root, 'project/.cc-safety-net/rules/rule.lock')]);
  });

  test('a user cache directory is reported on its own', () => {
    const { root, paths } = findLeftovers({ 'home/.cc-safety-net/cache/rulebooks': null });
    expect(paths).toEqual([join(root, 'home/.cc-safety-net/cache')]);
  });

  test('both scopes report lock before cache, project before user', () => {
    const { root, paths } = findLeftovers({
      'project/.cc-safety-net/rules/rule.lock': '{}\n',
      'project/.cc-safety-net/cache/rulebooks': null,
      'home/.cc-safety-net/rules/rule.lock': '{}\n',
      'home/.cc-safety-net/cache/rulebooks': null,
    });
    expect(paths).toEqual([
      join(root, 'project/.cc-safety-net/rules/rule.lock'),
      join(root, 'project/.cc-safety-net/cache'),
      join(root, 'home/.cc-safety-net/rules/rule.lock'),
      join(root, 'home/.cc-safety-net/cache'),
    ]);
  });

  test('CC_SAFETY_NET_HOME moves the user scope the probe reads', () => {
    const { root, paths } = findLeftovers(
      {
        'home/.cc-safety-net/rules/rule.lock': '{}\n',
        'relocated/rules/rule.lock': '{}\n',
      },
      { CC_SAFETY_NET_HOME: 'relocated' },
    );
    expect(paths).toEqual([join(root, 'relocated/rules/rule.lock')]);
  });
});
