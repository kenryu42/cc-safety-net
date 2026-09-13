import { afterEach, expect, test } from 'bun:test';
import { formatTraceHuman } from '@/cli/explain/format';
import { explainCommand } from '@/gate/explain';
import { withLinkedWorktreeFixture } from '../../helpers';
import { policySnapshot } from '../../helpers/policy';
import {
  createTempRoot,
  environmentFor,
  isolationEnv,
  removeTempRoots,
} from '../../helpers/temp-home';

afterEach(removeTempRoots);

test('human explain shows a sanitized custom reason override and leaves unrelated commands allowed', () => {
  const home = createTempRoot('explain-override-');
  const options = {
    cwd: home,
    policySnapshot: policySnapshot({
      rules: [
        {
          name: 'deploy',
          command: 'deploy',
          block_args: ['--force'],
          reason: 'Use the release process',
        },
      ],
      ruleMetadata: {
        deploy: {
          id: 'deploy',
          override: { type: 'reason', reason: 'Use the release process TOKEN=private-value' },
        },
      },
    }),
  };
  const environment = environmentFor(home, isolationEnv(home));
  const denied = explainCommand('deploy --force', options, environment);
  expect(denied.result).toBe('blocked');
  expect(denied.customRule?.override?.reason).toBe('Use the release process TOKEN=<redacted>');
  expect(formatTraceHuman(denied)).toContain(
    'Override: reason Use the release process TOKEN=<redacted>',
  );
  const allowed = explainCommand('echo ready', options, environment);
  expect(allowed.result).toBe('allowed');
  expect(formatTraceHuman(allowed)).toContain('No match');
});

test('human explain names the linked worktree that permits a local discard', async () => {
  const home = createTempRoot('explain-worktree-');
  await withLinkedWorktreeFixture((fixture) => {
    const result = explainCommand(
      'git reset --hard',
      { cwd: fixture.linkedWorktree },
      environmentFor(home, isolationEnv(home, { CC_SAFETY_NET_WORKTREE: '1' })),
    );
    expect(result.result).toBe('allowed');
    const text = formatTraceHuman(result);
    expect(text).toContain('Worktree relaxation');
    expect(text).toContain(fixture.linkedWorktree);
    expect(text).toContain('Allowed local discard in linked worktree');
  });
});

test('human explain truncates long segment headings while retaining the full input and denial', () => {
  const home = createTempRoot('explain-human-');
  const command = `printf '${'long argument '.repeat(8)}'; git reset --hard`;
  const result = explainCommand(command, { cwd: home }, environmentFor(home, isolationEnv(home)));
  const text = formatTraceHuman(result);
  expect(text).toContain(command);
  expect(text).toMatch(/Segment 1: .*…/);
  expect(text).toContain('╔');
  expect(text).toContain('BLOCKED');
  expect(text).toContain('git reset --hard destroys all uncommitted changes');
});

test('human explain identifies a paranoid interpreter denial', () => {
  const home = createTempRoot('explain-human-');
  const result = explainCommand(
    'python -c "print(1)"',
    { cwd: home },
    environmentFor(home, isolationEnv(home, { CC_SAFETY_NET_LEVEL: 'paranoid' })),
  );
  const text = formatTraceHuman(result);
  expect(text).toContain('Interpreter: python');
  expect(text).toContain('BLOCKED (paranoid mode)');
});
