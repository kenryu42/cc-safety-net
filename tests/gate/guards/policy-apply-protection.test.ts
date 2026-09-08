import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createBudget } from '@/core/budget';
import {
  findPolicyApplyInvocationInCommand,
  findPolicyApplyInvocationInSemanticFacts,
  REASON_POLICY_APPLY_PROTECTION,
} from '@/gate/guards/policy-apply-protection';
import { createSemanticFacts } from '@/gate/guards/semantic-facts';
import { createToolInvocation, type ToolRoute } from '@/gate/invocation';
import { pairedEnvironments } from '../../core/differential-inputs';
import { describeOutcome, writeTree } from '../../helpers/fixture-tree';

/**
 * Only the user may apply a policy proposal, so this guard must recognize the invocation through
 * every runner spelling, wrapper prelude and `cd` the segment walk can carry — and must keep
 * `policy check` and every other subcommand allowed. Both properties are stated over the
 * commands below.
 */

let root = '';
let workspace = '';

/** The command as the recognizer sees it: the row's cwd, its environment, a fresh budget. */
function findPair(command: string) {
  const environments = pairedEnvironments({ HOME: join(root, 'home') }, join(root, 'home'));
  return describeOutcome(() =>
    findPolicyApplyInvocationInCommand(command, workspace, environments),
  );
}

function factsPair(toolName: string, input: unknown, route: ToolRoute, command: string | null) {
  const environments = pairedEnvironments({ HOME: join(root, 'home') }, join(root, 'home'));
  const context = { executionCwd: workspace, configCwd: workspace };
  return describeOutcome(() =>
    findPolicyApplyInvocationInSemanticFacts(
      createSemanticFacts(createToolInvocation(toolName, input, route, context, command)),
      environments,
      createBudget(),
    ),
  );
}

const RUNNER_SPELLINGS: readonly string[] = [
  'cc-safety-net policy apply proposal.json',
  'ccsn policy apply proposal.json',
  './node_modules/.bin/cc-safety-net policy apply proposal.json',
  '/usr/local/bin/cc-safety-net policy apply proposal.json',
  'CC-SAFETY-NET policy apply proposal.json',
  'cc-safety-net.exe policy apply proposal.json',
  'npx cc-safety-net policy apply proposal.json',
  'npx -y cc-safety-net policy apply proposal.json',
  'npx --yes cc-safety-net policy apply proposal.json',
  'npx --loglevel=silent cc-safety-net policy apply proposal.json',
  'npx --package cc-safety-net ccsn policy apply proposal.json',
  'bunx cc-safety-net policy apply proposal.json',
  'bunx --bun cc-safety-net policy apply proposal.json',
  'pnpx cc-safety-net policy apply proposal.json',
  'pnpm dlx cc-safety-net policy apply proposal.json',
  'yarn dlx cc-safety-net policy apply proposal.json',
  'npm exec cc-safety-net policy apply proposal.json',
  'npm --silent exec cc-safety-net policy apply proposal.json',
  'pnpm exec cc-safety-net policy apply proposal.json',
  'yarn exec cc-safety-net policy apply proposal.json',
  'bun run src/cli/cc-safety-net.ts policy apply proposal.json',
  'bun src/cli/cc-safety-net.ts policy apply proposal.json',
  'node dist/bin/cc-safety-net.js policy apply proposal.json',
  'sudo cc-safety-net policy apply proposal.json',
  'env CC_SAFETY_NET_HOME=/tmp cc-safety-net policy apply proposal.json',
  'command cc-safety-net policy apply proposal.json',
  'cd /tmp && cc-safety-net policy apply proposal.json',
  'echo hi; cc-safety-net policy apply proposal.json',
  'echo hi | cc-safety-net policy apply proposal.json',
  'cc-safety-net -g policy apply proposal.json',
  'cc-safety-net --global policy apply proposal.json',
  'cc-safety-net policy -g apply proposal.json',
  'cc-safety-net policy apply -g proposal.json',
  'cc-safety-net policy apply',
];

const UNBLOCKED_SPELLINGS: readonly string[] = [
  // `time` is a shell keyword the segment walk does not peel, so the guard has never recognized
  // this form.
  'time cc-safety-net policy apply proposal.json',
  'cc-safety-net policy check proposal.json',
  'cc-safety-net policy show',
  'cc-safety-net status',
  'cc-safety-net explain "rm -rf /"',
  'cc-safety-net',
  'cc-safety-net policy',
  'cc-safety-net apply policy',
  'cc-safety-net policy applyx proposal.json',
  'policy apply proposal.json',
  'other-tool policy apply proposal.json',
  'npx other-tool policy apply proposal.json',
  'echo cc-safety-net policy apply',
  'yarn policy apply',
  'npm exec -- other policy apply',
  '',
  '   ',
];

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'next-policy-apply-'));
  workspace = join(root, 'work');
  writeTree(root, { 'work/nested': null, home: null });
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('policy apply protection', () => {
  test('blocks the runner spellings and leaves every other invocation alone', () => {
    for (const command of RUNNER_SPELLINGS) {
      expect(findPair(command), command).toStrictEqual({
        ok: true,
        value: { target: expect.any(String) },
      });
    }
    for (const command of UNBLOCKED_SPELLINGS) {
      expect(findPair(command), command).toStrictEqual({ ok: true, value: null });
    }
  });

  test('the reported target is the segment as written, wrappers peeled', () => {
    const environments = pairedEnvironments({ HOME: join(root, 'home') }, join(root, 'home'));
    const find = (command: string) =>
      findPolicyApplyInvocationInCommand(command, workspace, environments);
    expect(find('cc-safety-net policy apply proposal.json')).toStrictEqual({
      target: 'cc-safety-net policy apply proposal.json',
    });
    expect(find('sudo cc-safety-net policy apply proposal.json')).toStrictEqual({
      target: 'cc-safety-net policy apply proposal.json',
    });
    expect(find('echo hi && cc-safety-net policy apply proposal.json')).toStrictEqual({
      target: 'cc-safety-net policy apply proposal.json',
    });
    // A nested shell is walked, so an invocation inside one is still found.
    expect(find('( cc-safety-net policy apply proposal.json )')).toStrictEqual({
      target: 'cc-safety-net policy apply proposal.json',
    });
  });

  test('a wrapper prelude, a runner option or a package spec does not hide the invocation', () => {
    const rows: readonly { readonly command: string; readonly blocked: boolean }[] = [
      { command: 'CI=1 cc-safety-net policy apply proposal.json', blocked: true },
      { command: 'env CI=1 cc-safety-net policy apply proposal.json', blocked: true },
      {
        command: 'env FORCE_COLOR=0 npx -y cc-safety-net policy apply proposal.json',
        blocked: true,
      },
      { command: 'npx -y cc-safety-net@latest policy apply proposal.json', blocked: true },
      { command: 'bunx cc-safety-net@2.3.0 policy apply proposal.json', blocked: true },
      { command: 'pnpm dlx cc-safety-net@next policy apply proposal.json', blocked: true },
      { command: 'npm exec -- cc-safety-net policy apply proposal.json', blocked: true },
      {
        command: 'node --no-warnings dist/bin/cc-safety-net.js policy apply proposal.json',
        blocked: true,
      },
      { command: 'bun dist/bin/cc-safety-net.js policy apply proposal.json', blocked: true },
      { command: 'git status && cc-safety-net policy apply proposal.json', blocked: true },
      // A different package, a different entrypoint or quoted prose is a different program.
      { command: 'npx -y @scope/cc-safety-net policy apply proposal.json', blocked: false },
      { command: 'bunx ./vendor/cc-safety-net policy apply proposal.json', blocked: false },
      { command: 'bun run src/cli/other.ts policy apply proposal.json', blocked: false },
      { command: "echo 'cc-safety-net policy apply proposal.json'", blocked: false },
      { command: 'npx -y cc-safety-net policy check proposal.json', blocked: false },
    ];
    for (const row of rows) {
      expect(findPair(row.command), row.command).toStrictEqual({
        ok: true,
        value: row.blocked ? { target: expect.any(String) } : null,
      });
    }
  });

  test('only a route that carries a command candidate reaches the recognizer', () => {
    const routes: readonly ToolRoute[] = [
      ...(['posix', 'powershell', 'auto'] as const).map(
        (shell): ToolRoute => ({ kind: 'command', shell }),
      ),
      ...(['patch', 'path', 'grep', 'glob', 'unknown'] as const).map(
        (kind): ToolRoute => ({ kind }),
      ),
    ];
    const invocation = 'cc-safety-net policy apply proposal.json';
    for (const route of routes) {
      // A command route and the unknown route carry the input candidate; the others do not.
      const carriesCommand = route.kind === 'command' || route.kind === 'unknown';
      expect(
        factsPair('Bash', { command: invocation }, route, invocation),
        route.kind,
      ).toStrictEqual({ ok: true, value: carriesCommand ? { target: invocation } : null });
      expect(
        factsPair('Bash', { command: 'cc-safety-net policy check proposal.json' }, route, null),
        route.kind,
      ).toStrictEqual({ ok: true, value: null });
      // A path that reads like the invocation must not reach the recognizer.
      expect(
        factsPair('Write', { file_path: invocation }, route, null),
        `${route.kind}: path input`,
      ).toStrictEqual({ ok: true, value: null });
    }
  });

  test('the denial names the command the user has to run themselves', () => {
    expect(REASON_POLICY_APPLY_PROTECTION).toBe(
      'Only the user may apply a policy proposal, because it rewrites the configuration CC Safety Net enforces. Ask them to run `cc-safety-net policy apply <file>` themselves in a terminal; you can run `cc-safety-net policy check <file>` to show them what it would change.',
    );
  });
});
