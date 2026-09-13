import { afterEach, describe, expect, test } from 'bun:test';
import { runIntegrationSelfTest } from '@/hosts/self-test';
import { readAuditEntries } from '../helpers/hook-capture';
import {
  createTempRoot,
  environmentFor,
  isolationEnv,
  removeTempRoots,
  snapshotHome,
} from '../helpers/temp-home';

describe('the engine self-test', () => {
  afterEach(removeTempRoots);

  test('reaches the same verdicts as the shipped suite and writes nothing', () => {
    const root = createTempRoot('self-test-');
    const env = isolationEnv(root);
    const auditHome = env.CC_SAFETY_NET_AUDIT_HOME as string;

    const ported = {
      summary: runIntegrationSelfTest(environmentFor(root, env)),
      entries: readAuditEntries(auditHome),
      tree: snapshotHome(root),
    };

    expect(ported.summary).toEqual({
      total: 3,
      passed: 3,
      failed: 0,
      results: [
        {
          description: 'git reset --hard',
          command: 'git reset --hard',
          expected: 'blocked',
          actual: 'blocked',
          passed: true,
          ruleId: 'git.reset-hard',
          reason:
            "git reset --hard destroys all uncommitted changes permanently. Use 'git stash' first.",
        },
        {
          description: 'rm -rf /',
          command: 'rm -rf /',
          expected: 'blocked',
          actual: 'blocked',
          passed: true,
          ruleId: 'rm.recursive-force-root-or-home',
          reason:
            'rm -rf targeting root or home directory is extremely dangerous and always blocked.',
        },
        {
          description: 'rm in cwd (safe)',
          command: 'rm -rf ./node_modules',
          expected: 'allowed',
          actual: 'allowed',
          passed: true,
          ruleId: undefined,
          reason: undefined,
        },
      ],
    });
    expect(ported.entries).toEqual([]);
    expect(ported.tree.map((entry) => entry.path)).toEqual(['tmp']);
  });
});
