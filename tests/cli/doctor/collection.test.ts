import { afterEach, expect, test } from 'bun:test';
import { join } from 'node:path';
import { getActivitySummary } from '@/cli/doctor/activity';
import { getConfigInfo } from '@/cli/doctor/config';
import { formatRulesTable } from '@/cli/doctor/format';
import { writeTree } from '../../helpers/fixture-tree';
import { rulesConfig, v1Rulebook } from '../../helpers/rulebook-seeds';
import {
  createTempRoot,
  environmentFor,
  isolationEnv,
  removeTempRoots,
} from '../../helpers/temp-home';

afterEach(removeTempRoots);

test('doctor attributes each active local rulebook to its configuration scope', () => {
  const root = createTempRoot('doctor-rules-');
  const home = join(root, 'home');
  writeTree(root, {
    'home/.cc-safety-net/rules/rule.json': rulesConfig(['user-team']),
    'home/.cc-safety-net/rules/user-team/rulebook.json': v1Rulebook('user-team'),
    'project/.cc-safety-net/rules/rule.json': rulesConfig(['project-team']),
    'project/.cc-safety-net/rules/project-team/rulebook.json': v1Rulebook('project-team'),
  });
  const info = getConfigInfo(environmentFor(home, isolationEnv(home)), join(root, 'project'));
  expect(info.userConfig).toMatchObject({ exists: true, valid: true, ruleCount: 1 });
  expect(info.projectConfig).toMatchObject({ exists: true, valid: true, ruleCount: 1 });
  expect(info.effectiveRules.map((rule) => [rule.source, rule.name])).toEqual([
    ['user', 'user-team/block-docker-system-prune'],
    ['project', 'project-team/block-docker-system-prune'],
  ]);
  const table = formatRulesTable(info.effectiveRules);
  expect(table).toContain('docker system');
  expect(table).toContain('prune');
  expect(table).toContain('user-team/block-docker-system-prune');
  expect(table).toContain('project-team/block-docker-system-prune');
});

test('doctor keeps the newest three denials from an out-of-order audit file', () => {
  const home = createTempRoot('doctor-order-');
  const now = Date.now();
  const entries = [5, 3, 4, 1, 2].map((hours) => ({
    ts: new Date(now - hours * 3_600_000).toISOString(),
    command: `git reset --hard HEAD~${hours}`,
    reason: 'discard',
    sessionId: 'session',
    decision: 'deny',
  }));
  writeTree(home, {
    'logs/session.jsonl': entries.map((entry) => JSON.stringify(entry)).join('\n'),
  });
  const summary = getActivitySummary(
    environmentFor(home, isolationEnv(home)),
    7,
    join(home, 'logs'),
  );
  expect(summary.totalBlocked).toBe(5);
  expect(summary.sessionCount).toBe(1);
  expect(summary.unreadable).toBe(0);
  expect(summary.recentEntries.map((entry) => entry.command)).toEqual([
    'git reset --hard HEAD~1',
    'git reset --hard HEAD~2',
    'git reset --hard HEAD~3',
  ]);
  expect(summary.oldestEntry).toBe(entries[0]?.ts);
  expect(summary.newestEntry).toBe(entries[3]?.ts);
});
