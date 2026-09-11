import { afterAll, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { evaluateGuard, type GuardEvaluation } from '@/gate/pipeline';
import { bashCall } from '../helpers/gate-differential';
import { policySnapshot } from '../helpers/policy';
import { environmentFor } from '../helpers/temp-home';

const root = realpathSync(mkdtempSync(join(tmpdir(), 'secret-walk-')));
const home = join(root, 'home');
const project = join(home, 'project');
for (const dir of [join(home, '.ssh'), join(project, '.ssh'), join(root, 'tmp')]) {
  mkdirSync(dir, { recursive: true });
}
writeFileSync(join(home, '.ssh', 'config'), 'Host home\n');
writeFileSync(join(project, '.ssh', 'config'), 'Host project\n');
const environment = environmentFor(home, { HOME: home, TMPDIR: join(root, 'tmp') });

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

const STANDARD = policySnapshot();
const SNAPSHOTS = [
  STANDARD,
  policySnapshot({ safety: { level: 'strict' } }),
  policySnapshot({ safety: { level: 'paranoid' } }),
];

type Expectation = 'allow' | { readonly ruleId: string; readonly segment: string };

const DENIED_HOME_SSH_CONFIG = { ruleId: 'secret.home.ssh', segment: '.ssh/config' } as const;

const ROWS: readonly {
  readonly name: string;
  readonly command: string;
  readonly cwd: 'home' | 'project';
  readonly expected: Expectation;
  readonly alsoAllows?: string;
}[] = [
  {
    name: 'a cd into home makes a later relative read of the SSH config a denial',
    command: 'cd ~ && cat .ssh/config',
    cwd: 'project',
    expected: DENIED_HOME_SSH_CONFIG,
  },
  {
    name: 'the cd operand itself is still the first candidate the matcher sees',
    command: 'cd ~/.ssh && cat id_rsa',
    cwd: 'project',
    expected: { ruleId: 'secret.home.ssh', segment: '~/.ssh' },
  },
  {
    name: 'a subshell that changes directory leaves the parent reading its own directory',
    command: '(cd project && pwd) && cat .ssh/config',
    cwd: 'home',
    expected: DENIED_HOME_SSH_CONFIG,
  },
  {
    name: 'cd - returns to the directory the previous cd left',
    command: 'cd project && cd - && cat .ssh/config',
    cwd: 'home',
    expected: DENIED_HOME_SSH_CONFIG,
  },
  {
    name: 'a cd into home inside a subshell does not follow the parent out of it',
    command: '(cd ~ && pwd) && cat .ssh/config',
    cwd: 'project',
    expected: 'allow',
  },
  {
    name: 'a cd inside a command substitution ends with the substitution',
    command: 'x=$(cd ~; ls); cat .ssh/config',
    cwd: 'project',
    expected: 'allow',
  },
  {
    name: 'cd - after a cd into home returns to the directory the command started in',
    command: 'cd ~ && cd - && cat .ssh/config',
    cwd: 'project',
    expected: 'allow',
  },
  {
    name: 'a cd inside a subshell group does not move the parent cwd',
    command: '(cd ~) && cat .ssh/config',
    cwd: 'project',
    expected: 'allow',
  },
  {
    name: 'a brace group runs in the current shell, so its cd counts',
    command: '{ cd ~; } && cat .ssh/config',
    cwd: 'project',
    expected: DENIED_HOME_SSH_CONFIG,
  },
  {
    name: 'a read inside the subshell that changed directory resolves against it',
    command: '(cd ~ && cat .ssh/config)',
    cwd: 'project',
    expected: DENIED_HOME_SSH_CONFIG,
  },
  {
    name: 'a nested subshell restores its immediate parent, not the outermost shell',
    command: '(cd ~ && (cd project; pwd) && cat .ssh/config)',
    cwd: 'project',
    expected: DENIED_HOME_SSH_CONFIG,
  },
  {
    name: 'two successive cd - swap twice and end where the first cd went',
    command: 'cd ~ && cd - && cd - && cat .ssh/config',
    cwd: 'project',
    expected: DENIED_HOME_SSH_CONFIG,
  },
  {
    name: 'cd - with no previous directory leaves the cwd where the command started',
    command: 'cd - && cat .ssh/config',
    cwd: 'home',
    expected: DENIED_HOME_SSH_CONFIG,
  },
  {
    name: 'cd - with no previous directory does not invent one either',
    command: 'cd - && cat .ssh/config',
    cwd: 'project',
    expected: 'allow',
  },
  {
    name: 'a function body runs in the current shell, so its cd counts',
    command: 'f() { cd ~; }; f; cat .ssh/config',
    cwd: 'project',
    expected: DENIED_HOME_SSH_CONFIG,
  },
  {
    name: 'a backtick substitution ends with its own directory change',
    command: 'x=`cd ~; ls`; cat .ssh/config',
    cwd: 'project',
    expected: 'allow',
  },
  {
    name: 'a process substitution ends with its own directory change',
    command: 'cat <(cd ~; ls) && cat .ssh/config',
    cwd: 'project',
    expected: 'allow',
  },
  {
    name: 'pushd does not move the tracked cwd',
    command: 'pushd ~ && cat .ssh/config',
    cwd: 'project',
    expected: 'allow',
  },
  {
    name: 'a read before the cd resolves against the directory it actually runs in',
    command: 'cat .ssh/config && cd ~',
    cwd: 'project',
    expected: 'allow',
  },
  {
    name: 'an assignment holding a directory moves the cwd when the cd dereferences it',
    command: 'd=~; cd "$d" && cat .ssh/config',
    cwd: 'project',
    expected: DENIED_HOME_SSH_CONFIG,
  },
  {
    name: 'a cd to an unset variable leaves later relative operands unresolvable',
    command: 'cd "$UNSET_DIR_XYZ" && cat .ssh/config',
    cwd: 'project',
    expected: 'allow',
  },
  {
    name: 'a cd to a command substitution leaves later relative operands unresolvable',
    command: 'cd $(mktemp -d) && cat .ssh/config',
    cwd: 'project',
    expected: 'allow',
  },
  {
    name: 'an operand inside an interpreter body resolves against its segment cwd',
    command: "cd ~ && sh -c 'cat .ssh/config'",
    cwd: 'project',
    expected: DENIED_HOME_SSH_CONFIG,
  },
  {
    name: 'a cd inside an interpreter body is scanned as text, not walked',
    command: "sh -c 'cd ~ && cat .ssh/config'",
    cwd: 'project',
    expected: 'allow',
  },
  {
    name: 'the producer of a pipe resolves against the tracked cwd',
    command: 'cd ~ && cat .ssh/config | grep Host',
    cwd: 'project',
    expected: DENIED_HOME_SSH_CONFIG,
  },
  {
    name: 'a pipe is a boundary, not a scope: the cd before it still counts',
    command: 'cd ~ | cat .ssh/config',
    cwd: 'project',
    expected: DENIED_HOME_SSH_CONFIG,
  },
  {
    name: 'a write redirection target resolves against the tracked cwd',
    command: 'cd ~ && cat > .ssh/config',
    cwd: 'project',
    expected: DENIED_HOME_SSH_CONFIG,
  },
  {
    name: 'the metadata-only relaxation stays standalone-only after a cd',
    command: 'cd ~ && ls .ssh',
    cwd: 'project',
    expected: { ruleId: 'secret.home.ssh', segment: '.ssh' },
    alsoAllows: 'ls ~/.ssh',
  },
  {
    name: 'a cd to a directory that does not exist puts later operands under it',
    command: 'cd /nonexistent-dir-zz && cat .ssh/config',
    cwd: 'project',
    expected: 'allow',
  },
];

function evaluate(
  command: string,
  cwd: 'home' | 'project',
  snapshot: ReturnType<typeof policySnapshot>,
): GuardEvaluation {
  return evaluateGuard(bashCall(command, cwd === 'home' ? home : project), {
    environment,
    dependencies: { loadPolicySnapshot: () => snapshot, resolveGitMetadata: () => null },
  });
}

function decided(evaluation: GuardEvaluation) {
  const decision = evaluation.decision;
  if (decision.kind !== 'deny') return 'allow';
  return {
    stage: evaluation.stage,
    intent: decision.intent,
    ruleId: decision.ruleId,
    segment: decision.evidence.find((item) => item.kind === 'command')?.segment,
  };
}

function expected(expectation: Expectation) {
  return expectation === 'allow'
    ? 'allow'
    : ({ stage: 'secret-protection', intent: 'hard_stop', ...expectation } as const);
}

for (const row of ROWS) {
  test(row.name, () => {
    for (const snapshot of SNAPSHOTS) {
      expect(decided(evaluate(row.command, row.cwd, snapshot)), row.command).toStrictEqual(
        expected(row.expected),
      );
    }
    if (row.alsoAllows !== undefined) {
      expect(decided(evaluate(row.alsoAllows, row.cwd, STANDARD)), row.alsoAllows).toBe('allow');
    }
  });
}
