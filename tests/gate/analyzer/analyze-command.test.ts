import { afterAll, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir as systemTempRoot } from 'node:os';
import { join } from 'node:path';
import { REASON_DERIVED_COMMAND_WORK_LIMIT } from '@/core/budget';
import { createTestEnvironment, processPathResolver as portedPaths } from '@/core/environment';
import { resolveProtectedGitMetadata } from '@/core/git/metadata';
import type { EffectiveSafetyCapabilities } from '@/core/policy/types';
import { analyzeCommand, analyzeOrCapBreach } from '@/gate/analyzer';
import { REASON_RECURSION_LIMIT } from '@/gate/analyzer/reasons';
import { policySnapshot } from '../../helpers/policy';

/**
 * The analyzer entry point decides the whole destructive half of the gate, so each level states
 * the rule a command reaches under one policy, one capability set and one process state. Every
 * budget the entry owns also gets a breach and a below-the-cap counterpart, so a cap that silently
 * moves fails here rather than in a later phase.
 */

const workspace = mkdtempSync(join(systemTempRoot(), 'analyze-command-'));
const agentHome = join(workspace, 'agent-home');
const scratch = join(workspace, 'scratch');
const project = join(workspace, 'checkout');
for (const directory of [agentHome, scratch, project, join(project, '.git')]) {
  mkdirSync(directory, { recursive: true });
}

afterAll(() => {
  rmSync(workspace, { recursive: true, force: true });
});

const processState = new Map([
  ['HOME', agentHome],
  ['TMPDIR', scratch],
  ['PATH', '/usr/bin:/bin'],
  ['SHELL', '/bin/bash'],
  ['USER', 'agent'],
]);

const environment = createTestEnvironment({
  env: processState,
  home: agentHome,
  tmpdir: scratch,
  paths: portedPaths,
});

// Resolved once, so the stated decisions isolate the entry point from anchor resolution
// (pinned by tests/core/git/metadata.test.ts).
const gitMetadata = resolveProtectedGitMetadata(project, environment);

const customRules = [
  {
    name: 'terraform-destroy',
    command: 'terraform',
    subcommand: 'destroy',
    block_args: ['-auto-approve'],
    reason: 'Terraform destroy removes live infrastructure. Ask the user to run it.',
  },
  {
    name: 'helm-uninstall',
    command: 'helm',
    block_args: ['uninstall'],
    reason: 'Helm uninstall removes a release. Ask the user to run it.',
  },
];
const transparentWrappers = ['doas', 'nice'];

const snapshot = policySnapshot({
  rules: customRules,
  transparent_wrappers: transparentWrappers,
});

function capabilityState(enabled: boolean) {
  return { enabled, source: 'preset' as const, sources: [] };
}

type AnalysisMode = {
  readonly label: string;
  readonly capabilities: EffectiveSafetyCapabilities;
  readonly options: {
    strict?: boolean;
    paranoidRm?: boolean;
    paranoidInterpreters?: boolean;
    worktreeMode?: boolean;
  };
};

function mode(label: string, options: AnalysisMode['options']): AnalysisMode {
  return {
    label,
    capabilities: {
      fail_closed: capabilityState(options.strict ?? false),
      paranoid_rm: capabilityState(options.paranoidRm ?? false),
      paranoid_interpreters: capabilityState(options.paranoidInterpreters ?? false),
    },
    options,
  };
}

const standard = mode('standard', {});
const strict = mode('strict', { strict: true });
const paranoidRm = mode('paranoid_rm', { paranoidRm: true });
const paranoidInterpreters = mode('paranoid_interpreters', { paranoidInterpreters: true });

/**
 * The analyzer throws the caps the pipeline maps back into denials; this maps them the same way
 * and rethrows the rest.
 */
function decisionAt(cwd: string, command: string, analysis: AnalysisMode) {
  return analyzeOrCapBreach(
    () =>
      analyzeCommand(command, {
        policySnapshot: snapshot,
        effectiveCapabilities: analysis.capabilities,
        environment,
        protectedGitMetadata: gitMetadata,
        cwd,
        ...analysis.options,
      }),
    command,
  ).decision;
}

function decision(command: string, analysis: AnalysisMode) {
  return decisionAt(project, command, analysis);
}

describe('analyzeCommand', () => {
  test('a denied command reports the rule, the intent and the segment that matched', () => {
    expect(decision('echo start && git reset --hard', standard)).toStrictEqual({
      kind: 'deny',
      reason:
        "git reset --hard destroys all uncommitted changes permanently. Use 'git stash' first.",
      intent: 'use_alternative',
      ruleId: 'git.reset-hard',
      evidence: [
        {
          kind: 'command',
          command: 'echo start && git reset --hard',
          segment: 'git reset --hard',
        },
      ],
    });
  });

  test('each destructive shape reaches its rule at the standard level', () => {
    const rows: readonly { readonly command: string; readonly ruleId: string }[] = [
      { command: 'git push --force', ruleId: 'git.push-force' },
      { command: 'rm -rf /', ruleId: 'rm.recursive-force-root-or-home' },
      { command: 'echo $(rm -rf /)', ruleId: 'rm.recursive-force-root-or-home' },
      // The fixture checkout holds a `.git`, which a delete rooted at `.` would reach.
      { command: 'find . -delete', ruleId: 'find.delete-git-metadata' },
      { command: 'find logs -exec rm -rf {} +', ruleId: 'find.exec-rm-recursive-force' },
      { command: 'echo / | xargs rm -rf', ruleId: 'xargs.rm-recursive-force-dynamic' },
      { command: 'parallel r$(printf m) -rf ::: child', ruleId: 'parallel.shell-dynamic' },
      { command: 'terraform destroy -auto-approve', ruleId: 'custom.terraform-destroy' },
      // A transparent wrapper lets the custom rules inspect the command it runs.
      { command: 'doas terraform destroy -auto-approve', ruleId: 'custom.terraform-destroy' },
      { command: 'nice -n 5 helm uninstall release', ruleId: 'custom.helm-uninstall' },
      {
        command: 'awk \'BEGIN { system("rm -rf /") }\'',
        ruleId: 'rm.recursive-force-root-or-home',
      },
      { command: "bash <<'EOF'\nrm -rf ~\nEOF", ruleId: 'raw-text.dangerous-command' },
      {
        command: 'cat <<EOF && rm -rf ~\nharmless body\nEOF',
        ruleId: 'rm.recursive-force-root-or-home',
      },
      { command: 'cat <<EOF\n$(find . -delete)\nEOF', ruleId: 'find.delete-git-metadata' },
      { command: 'find logs -delete', ruleId: 'find.delete' },
    ];
    for (const row of rows) {
      expect(decision(row.command, standard)?.ruleId, row.command).toBe(row.ruleId);
    }
  });

  test('a child each producer synthesizes reaches its rule through the dispatch', () => {
    const rows: readonly {
      readonly command: string;
      readonly ruleId: string;
      readonly intent: 'hard_stop' | 'manual_only' | 'scope_down' | 'use_alternative';
      readonly reason: string;
      readonly segment: string;
    }[] = [
      {
        command: 'echo / | xargs rm -rf',
        ruleId: 'xargs.rm-recursive-force-dynamic',
        intent: 'scope_down',
        reason: 'xargs rm -rf with dynamic input is dangerous. Use explicit file list instead.',
        segment: 'xargs rm -rf',
      },
      // busybox is peeled by the child dispatch, never by the wrapper prelude.
      {
        command: 'echo / | xargs busybox rm -rf',
        ruleId: 'xargs.rm-recursive-force-dynamic',
        intent: 'scope_down',
        reason: 'xargs rm -rf with dynamic input is dangerous. Use explicit file list instead.',
        segment: 'xargs busybox rm -rf',
      },
      // An argument list expands the job, so it is analyzed as the command it runs.
      {
        command: 'parallel rm -rf / ::: a',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reason:
          'rm -rf targeting root or home directory is extremely dangerous and always blocked.',
        segment: 'parallel rm -rf / ::: a',
      },
      {
        command: 'parallel busybox rm -rf / ::: a',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reason:
          'rm -rf targeting root or home directory is extremely dangerous and always blocked.',
        segment: 'parallel busybox rm -rf / ::: a',
      },
      {
        command: 'find logs -exec busybox rm -rf {} ;',
        ruleId: 'find.exec-rm-recursive-force',
        intent: 'scope_down',
        reason: 'find -exec rm -rf is dangerous. Use explicit file list instead.',
        segment: 'find logs -exec busybox rm -rf {}',
      },
      {
        command: 'python3 -c "import os; os.system(\'rm -rf /\')"',
        ruleId: 'interpreter.dangerous-command',
        intent: 'use_alternative',
        reason:
          'Interpreter code contains a dangerous command. Run the underlying command directly so it can be analyzed, or use the safer alternative for that command.',
        segment: "python3 -c import os; os.system('rm -rf /')",
      },
      {
        command: 'sh -c "git reset --hard"',
        ruleId: 'git.reset-hard',
        intent: 'use_alternative',
        reason:
          "git reset --hard destroys all uncommitted changes permanently. Use 'git stash' first.",
        segment: 'sh -c git reset --hard',
      },
      // The unknown head scans its own suffix for a command it would run.
      {
        command: 'unknown-head -x git reset --hard',
        ruleId: 'git.reset-hard',
        intent: 'use_alternative',
        reason:
          "git reset --hard destroys all uncommitted changes permanently. Use 'git stash' first.",
        segment: 'unknown-head -x git reset --hard',
      },
      // An embedded child reaches the custom rules only through a transparent wrapper.
      {
        command: 'unknown-head -x doas terraform destroy -auto-approve',
        ruleId: 'custom.terraform-destroy',
        intent: 'manual_only',
        reason:
          '[terraform-destroy] Terraform destroy removes live infrastructure. Ask the user to run it.',
        segment: 'unknown-head -x doas terraform destroy -auto-approve',
      },
      // `eval` is not a head of the dynamic-execution carrier walk: an eval body inside a child
      // shell is read by the producer's own scan of the script it would run.
      {
        command: 'echo x | xargs sh -c \'eval "$1"\' _',
        ruleId: 'xargs.shell-dynamic',
        intent: 'scope_down',
        reason:
          'xargs dynamic input can supply arbitrary executable command source. Use an explicit child command and arguments instead.',
        segment: 'xargs sh -c eval "$1" _',
      },
    ];
    for (const row of rows) {
      expect(decision(row.command, standard), row.command).toStrictEqual({
        kind: 'deny',
        reason: row.reason,
        intent: row.intent,
        ruleId: row.ruleId,
        evidence: [{ kind: 'command', command: row.command, segment: row.segment }],
      });
    }
    // Without the wrapper the same embedded command is only a command.
    expect(decision('unknown-head -x terraform destroy -auto-approve', standard)).toBeNull();
  });

  test('an embedded find -exec body is analyzed as the command as written', () => {
    const rows: readonly {
      readonly command: string;
      readonly ruleId?: string;
      readonly intent:
        | 'hard_stop'
        | 'manual_only'
        | 'scope_down'
        | 'stop_and_explain'
        | 'use_alternative';
      readonly segment: string;
    }[] = [
      {
        command: 'custom-tool -x find . -exec python3 -c \'import os; os.system("rm -rf /")\' ;',
        ruleId: 'interpreter.dangerous-command',
        intent: 'use_alternative',
        segment: 'custom-tool -x find . -exec python3 -c import os; os.system("rm -rf /")',
      },
      {
        command: 'custom-tool -x find . -exec dd of=/dev/sda ;',
        ruleId: 'dd.device-write',
        intent: 'manual_only',
        segment: 'custom-tool -x find . -exec dd of=/dev/sda',
      },
      {
        command: 'custom-tool -x find . -exec awk \'BEGIN{system("rm -rf /")}\' ;',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        segment: 'custom-tool -x find . -exec awk BEGIN{system("rm -rf /")}',
      },
      {
        command: "custom-tool -x find . -exec eval 'rm -rf /' ;",
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        segment: 'custom-tool -x find . -exec eval rm -rf /',
      },
      {
        command: 'custom-tool -x find . -exec xargs rm -rf ;',
        ruleId: 'xargs.rm-recursive-force-dynamic',
        intent: 'scope_down',
        segment: 'custom-tool -x find . -exec xargs rm -rf',
      },
      // No rule owns an unverifiable shell source; the reason stands on its own.
      {
        command: "foo find . -exec sh -c 'exec $X' ;",
        intent: 'stop_and_explain',
        segment: 'foo find . -exec sh -c exec $X',
      },
    ];
    for (const row of rows) {
      const decided = decision(row.command, standard);
      expect(decided?.ruleId, row.command).toBe(row.ruleId);
      expect(decided?.intent, row.command).toBe(row.intent);
      expect(decided?.evidence, row.command).toStrictEqual([
        { kind: 'command', command: row.command, segment: row.segment },
      ]);
    }
  });

  test('a wrapper inside a stream child find -exec body does not hide the command', () => {
    const rows: readonly string[] = [
      'echo x | xargs find . -exec sudo git reset --hard {} ;',
      'echo x | xargs find . -exec env FOO=1 git reset --hard {} ;',
      'echo x | xargs find . -exec FOO=1 git reset --hard {} ;',
      'echo x | xargs find . -exec busybox git reset --hard {} ;',
    ];
    for (const command of rows) {
      expect(decision(command, standard)?.ruleId, command).toBe('git.reset-hard');
    }
  });

  test('a command that only names a destructive one is allowed', () => {
    const rows: readonly string[] = [
      '',
      '""',
      'helm upgrade release',
      'git status',
      'rm -f file.txt',
      'find . -print',
      'echo git reset --hard',
      "printf 'rm -rf /'",
      "rg 'rm -rf' .",
      "awk '/rm -rf/ {print}' log.txt",
      'xargs git status',
      "cat <<'EOF'\nrm -rf ~ remains inert prose\nEOF",
      'TMPDIR=/tmp rm -rf $TMPDIR/test-dir',
    ];
    for (const command of rows) {
      expect(decision(command, standard), command).toBeNull();
      expect(decision(command, strict), `strict: ${command}`).toBeNull();
    }
  });

  test('rm -rf in the home directory is denied there and nowhere else', () => {
    expect(decisionAt(agentHome, 'rm -rf build', standard)?.ruleId).toBe(
      'rm.recursive-force-home-cwd',
    );
    expect(decisionAt(agentHome, 'rm -f file.txt', standard)).toBeNull();
    expect(decisionAt(project, 'rm -rf build', standard)).toBeNull();
  });

  test('strict adds the rules for command text it cannot verify', () => {
    const rows: readonly {
      readonly command: string;
      readonly ruleId: string;
      readonly intent: string;
    }[] = [
      {
        command: 'rm -rf "$target"',
        ruleId: 'rm.recursive-force-dynamic-target',
        intent: 'scope_down',
      },
      {
        command: '$(printf r)m -rf /tmp/x',
        ruleId: 'shell.dynamic-executable',
        intent: 'manual_only',
      },
      {
        command: 'git reset $(printf --hard)',
        ruleId: 'shell.dynamic-structure',
        intent: 'stop_and_explain',
      },
      {
        command: 'c=rm; "$c" -rf dir',
        ruleId: 'shell.dynamic-executable',
        intent: 'manual_only',
      },
    ];
    for (const row of rows) {
      expect(decision(row.command, standard), `standard: ${row.command}`).toBeNull();
      expect(decision(row.command, strict), row.command).toMatchObject({
        ruleId: row.ruleId,
        intent: row.intent,
      });
    }
    for (const command of ["echo 'unclosed", 'cd "unterminated']) {
      expect(decision(command, standard), `standard: ${command}`).toBeNull();
      const denial = decision(command, strict);
      expect(denial?.intent, command).toBe('stop_and_explain');
      expect(denial?.reason, command).toContain('strict mode');
    }
  });

  test('a paranoid capability blocks what the standard level allows', () => {
    expect(decision('rm -rf ./cache', standard)).toBeNull();
    expect(decision('rm -rf ./cache', paranoidRm)?.ruleId).toBe('rm.recursive-force-paranoid');
    expect(decision('python -c "print(1)"', standard)).toBeNull();
    expect(decision('python -c "print(1)"', paranoidInterpreters)?.ruleId).toBe(
      'interpreter.one-liner-paranoid',
    );
  });
});

/** Nests `bash -c` so the analyzer meets the recursion cap before it meets the payload. */
function nestShellWrappers(depth: number, payload: string): string {
  let command = payload;
  for (let level = 0; level < depth; level++) {
    command = `bash -c ${JSON.stringify(command)}`;
  }
  return command;
}

function repeatWords(count: number, word: (index: number) => string): string {
  return Array.from({ length: count }, (_unused, index) => word(index)).join(' ');
}

const BUDGET_BREACHES: readonly {
  readonly budget: string;
  readonly breaching: string;
  readonly allowed: string;
  readonly reason: string;
}[] = [
  {
    budget: 'recursion depth',
    breaching: nestShellWrappers(10, 'echo ok'),
    allowed: nestShellWrappers(9, 'echo ok'),
    reason: REASON_RECURSION_LIMIT,
  },
  {
    // Each `&&` step keeps the state before it and the state with the new function defined, so
    // the distinct states outrun the control-flow cap that deduplication enforces.
    budget: 'control-flow states',
    breaching: repeatWords(64, (index) => `{ state${index}() { :; }; } &&`).slice(0, -3),
    allowed: repeatWords(63, (index) => `{ state${index}() { :; }; } &&`).slice(0, -3),
    reason: REASON_DERIVED_COMMAND_WORK_LIMIT,
  },
  {
    budget: 'tracked heredoc files',
    breaching: `tee ${repeatWords(65, (index) => `sink${index}`)} <<'BODY'\nhello\nBODY`,
    allowed: `tee ${repeatWords(64, (index) => `sink${index}`)} <<'BODY'\nhello\nBODY`,
    reason: REASON_DERIVED_COMMAND_WORK_LIMIT,
  },
  {
    // Every embedded shell token reserves the words left after it, so the reservations sum past
    // the derived-command cap well before the token list itself is remarkable.
    budget: 'derived command work',
    breaching: `unknown-head ${repeatWords(181, () => 'bash')}`,
    allowed: `unknown-head ${repeatWords(180, () => 'bash')}`,
    reason: REASON_DERIVED_COMMAND_WORK_LIMIT,
  },
];

describe('analyzer budget breaches', () => {
  for (const breach of BUDGET_BREACHES) {
    test(`${breach.budget} denies with its reason, and stays silent below the cap`, () => {
      const denial = decision(breach.breaching, standard);
      expect(denial?.reason).toBe(breach.reason);
      expect(denial?.intent).toBe('stop_and_explain');
      expect(decision(breach.allowed, standard)).toBeNull();
    });
  }

  test('the recursion cap is met before the payload it wraps', () => {
    expect(decision(nestShellWrappers(10, 'rm -rf /some/path'), standard)?.reason).toBe(
      REASON_RECURSION_LIMIT,
    );
    expect(decision(nestShellWrappers(9, 'rm -rf /some/path'), standard)?.ruleId).toBe(
      'rm.recursive-force-outside-cwd',
    );
  });
});
