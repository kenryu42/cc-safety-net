import { describe, expect, test } from 'bun:test';
import { analyzeAcli } from '@/analyzer/acli';
import { assertAllowed, assertBlocked, runGuard } from '../helpers.ts';

const COMMENT_REASON = 'posts a Jira or Confluence comment';
const EDIT_REASON = 'changes Jira or Confluence content';
const CREATE_REASON = 'posts a new Jira work item or Confluence page or blog';
const TRANSITION_REASON = 'changes work item status';

describe('analyzeAcli direct', () => {
  test('empty tokens returns null', () => {
    expect(analyzeAcli([])).toBeNull();
  });

  test('non-acli head returns null', () => {
    expect(analyzeAcli(['jira', 'workitem', 'edit'])).toBeNull();
  });
});

describe('acli comment write', () => {
  test('blocks bare jira workitem comment', () => {
    assertBlocked('acli jira workitem comment --key KEY-1 --body hi', COMMENT_REASON);
  });

  test('blocks jira workitem comment create', () => {
    assertBlocked('acli jira workitem comment create --key KEY-1 --body hi', COMMENT_REASON);
  });

  test('blocks jira workitem comment update', () => {
    assertBlocked(
      'acli jira workitem comment update --key KEY-1 --comment-id 1 --body hi',
      COMMENT_REASON,
    );
  });

  test('blocks confluence comment create', () => {
    assertBlocked('acli confluence page comment create --id 1 --body hi', COMMENT_REASON);
  });

  test('allows comment list, visibility, and delete', () => {
    assertAllowed('acli jira workitem comment list --key KEY-1');
    assertAllowed('acli jira workitem comment visibility');
    assertAllowed('acli jira workitem comment delete --key KEY-1 --comment-id 1');
  });
});

describe('acli edit', () => {
  test('blocks jira workitem edit', () => {
    assertBlocked('acli jira workitem edit --key KEY-1 --summary x', EDIT_REASON);
  });

  test('blocks confluence page and space updates', () => {
    assertBlocked('acli confluence page update --id 1', EDIT_REASON);
    assertBlocked('acli confluence page edit --id 1', EDIT_REASON);
    assertBlocked('acli confluence space update --key SPACE --name x', EDIT_REASON);
    assertBlocked('acli confluence blog update --id 1', EDIT_REASON);
  });

  test('allows confluence page view', () => {
    assertAllowed('acli confluence page view --id 1');
  });
});

describe('acli create', () => {
  test('blocks jira workitem create and create-bulk', () => {
    assertBlocked('acli jira workitem create --summary x', CREATE_REASON);
    assertBlocked('acli jira workitem create-bulk', CREATE_REASON);
  });

  test('blocks confluence blog and page create', () => {
    assertBlocked('acli confluence blog create --space-id 1 --title x', CREATE_REASON);
    assertBlocked('acli confluence page create', CREATE_REASON);
  });

  test('allows confluence blog list and space create', () => {
    assertAllowed('acli confluence blog list');
    assertAllowed('acli confluence space create --key SPACE');
  });
});

describe('acli transition', () => {
  test('blocks jira workitem transition', () => {
    assertBlocked('acli jira workitem transition --key KEY-1', TRANSITION_REASON);
  });

  test('allows jira workitem view and assign', () => {
    assertAllowed('acli jira workitem view --key KEY-1');
    assertAllowed('acli jira workitem assign --key KEY-1');
  });
});

describe('acli wrappers and near misses', () => {
  test('blocks path-prefixed acli', () => {
    assertBlocked('/opt/homebrew/bin/acli jira workitem edit --key KEY-1', EDIT_REASON);
  });

  test('blocks inside sh -c', () => {
    assertBlocked(
      "sh -c 'acli jira workitem comment create --key KEY-1 --body hi'",
      COMMENT_REASON,
    );
  });

  test('allows acli help for a blocked command', () => {
    assertAllowed('acli help jira workitem create');
    assertAllowed('acli help jira workitem comment create');
    assertAllowed('acli help confluence blog create');
    assertAllowed('acli jira workitem create --help');
    assertAllowed('acli jira workitem comment -h');
    assertAllowed('acli jira workitem transition --help');
    assertAllowed('acli confluence blog create --help');
  });

  test('comment-write override allows comments and still blocks edit, create, and transition', () => {
    const policy = { destructiveCommandRuleOverrides: { 'acli.comment-write': 'off' as const } };
    expect(
      runGuard('acli jira workitem comment create --key KEY-1 --body hi', undefined, policy),
    ).toBeNull();
    expect(
      runGuard('acli jira workitem edit --key KEY-1 --summary x', undefined, policy),
    ).toContain(EDIT_REASON);
    expect(runGuard('acli jira workitem create --summary x', undefined, policy)).toContain(
      CREATE_REASON,
    );
    expect(runGuard('acli jira workitem transition --key KEY-1', undefined, policy)).toContain(
      TRANSITION_REASON,
    );
  });
});
