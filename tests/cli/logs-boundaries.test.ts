import { afterEach, expect, test } from 'bun:test';
import { runLogsCommand } from '@/cli/audit-log';
import { captureConsole } from '../helpers/console-capture';
import { snapshotTree, writeTree } from '../helpers/fixture-tree';
import {
  createTempRoot,
  environmentFor,
  isolationEnv,
  removeTempRoots,
} from '../helpers/temp-home';

afterEach(removeTempRoots);

test.each([
  [[], 'No audit log entries found.'],
  [['--json'], '[]'],
  [['--id', '0123456789abcdef'], 'No retained audit log entry found for id 0123456789abcdef.'],
])('logs answer without writing when audit storage is disabled: %j', async (args, expected) => {
  const home = createTempRoot('logs-disabled-');
  const result = await captureConsole(() =>
    runLogsCommand(environmentFor(home, { NODE_ENV: 'test' }), args),
  );
  expect(result.returned).toBe(0);
  expect(result.log).toEqual([expected]);
  expect(result.error).toEqual([]);
  expect(snapshotTree(home)).toEqual([]);
});

test('legacy pruning rejects filters without deleting a retained log', async () => {
  const home = createTempRoot('logs-filter-');
  const values = isolationEnv(home);
  writeTree(home, { '.cc-safety-net/audit/.cc-safety-net/logs/session.jsonl': '{}\n' });
  const before = snapshotTree(home);
  const result = await captureConsole(() =>
    runLogsCommand(environmentFor(home, values), ['--prune-legacy', '--all']),
  );
  expect(result.returned).toBe(1);
  expect(result.log).toEqual([]);
  expect(result.error).toEqual([
    '--prune-legacy cannot be combined with --id, --agent, --rule, --session, --project, --suspect, --all, --since, or --limit',
  ]);
  expect(snapshotTree(home)).toEqual(before);
});

test('JSON id lookup returns only the matching retained entry', async () => {
  const home = createTempRoot('logs-id-');
  const values = isolationEnv(home, { CC_SAFETY_NET_AUDIT_HOME: home });
  const entry = {
    id: '0123456789abcdef',
    ts: new Date().toISOString(),
    command: 'git reset --hard',
    decision: 'deny',
  };
  writeTree(home, {
    '.cc-safety-net/logs/session.jsonl': [entry, { ...entry, id: 'ffffffffffffffff' }]
      .map((value) => JSON.stringify(value))
      .join('\n'),
  });
  const result = await captureConsole(() =>
    runLogsCommand(environmentFor(home, values), ['--id', entry.id, '--json']),
  );
  expect(result.returned).toBe(0);
  expect(result.error).toEqual([]);
  expect(result.log).toHaveLength(1);
  expect(JSON.parse(result.log[0] ?? '')).toEqual([entry]);
});
