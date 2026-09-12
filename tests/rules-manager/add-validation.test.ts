import { afterEach, expect, test } from 'bun:test';
import { join } from 'node:path';
import { addRulebookSource } from '@/rules-manager/sync';
import { snapshotTree, writeTree } from '../helpers/fixture-tree';
import {
  createTempRoot,
  environmentFor,
  isolationEnv,
  removeTempRoots,
} from '../helpers/temp-home';

afterEach(removeTempRoots);

test('invalid repository rulebook names leave the existing configuration unchanged', async () => {
  const home = createTempRoot('rule-add-validation-');
  const environment = environmentFor(home, isolationEnv(home));
  writeTree(home, { 'project/.cc-safety-net/rules/rule.json': '{"version":1,"rules":[]}' });
  const before = snapshotTree(home);
  const result = await addRulebookSource(environment, 'acme/rules', {
    cwd: join(home, 'project'),
    rulebooks: ['../outside', 'bad name'],
  });
  expect(result).toMatchObject({
    ok: false,
    errors: ['Invalid rulebook names: ../outside, bad name'],
  });
  expect(snapshotTree(home)).toEqual(before);
});
