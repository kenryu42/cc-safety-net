import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';
import { createBudget } from '@/core/budget';
import {
  findPolicyConfigMutationTargetInSemanticFacts,
  findPolicyConfigMutationTargetInToolInput,
} from '@/gate/guards/policy-protection';
import { createSemanticFacts } from '@/gate/guards/semantic-facts';
import type { ToolRoute } from '@/gate/invocation';
import { createToolInvocation } from '@/gate/invocation';
import { pairedEnvironments } from '../../core/differential-inputs';
import { describeOutcome, writeTree } from '../../helpers/fixture-tree';

/**
 * The policy files are protected in both scopes and through every write channel the gate sees:
 * shell operands, tracked assignments, redirections, `rm -r` of an ancestor, `mv`, `find -delete`
 * and the write-shaped tool inputs. The fixture sets `CC_SAFETY_NET_HOME` on the process as well as
 * on the environment it hands the guard, so `~` and the user scope line up with it.
 */

let root = '';
let home = '';
let workspace = '';
let safetyHome = '';
let userPolicy = '';
let projectPolicy = '';
const previousSafetyHome = process.env.CC_SAFETY_NET_HOME;
const previousHome = process.env.HOME;

beforeAll(() => {
  root = realpathSync(mkdtempSync(join(tmpdir(), 'next-policy-guard-')));
  home = join(root, 'home');
  workspace = join(root, 'work');
  safetyHome = join(home, '.cc-safety-net');
  userPolicy = join(safetyHome, 'policy.json');
  projectPolicy = join(workspace, '.cc-safety-net', 'policy.json');
  writeTree(root, {
    'home/.cc-safety-net/rules': null,
    'home/.cc-safety-net/policy.json': '{}',
    'work/.cc-safety-net/policy.json': '{}',
    'work/src': null,
    'work/alias': { symlink: join(home, '.cc-safety-net') },
    other: null,
  });
  // A path that reads `~` resolves against the process home, so the process carries the same home
  // the guard's environment does.
  process.env.CC_SAFETY_NET_HOME = safetyHome;
  process.env.HOME = home;
});

afterAll(() => {
  if (previousSafetyHome === undefined) delete process.env.CC_SAFETY_NET_HOME;
  if (previousSafetyHome !== undefined) process.env.CC_SAFETY_NET_HOME = previousSafetyHome;
  if (previousHome === undefined) delete process.env.HOME;
  if (previousHome !== undefined) process.env.HOME = previousHome;
  rmSync(root, { recursive: true, force: true });
});

function guardEnvironments() {
  return pairedEnvironments({ HOME: home, CC_SAFETY_NET_HOME: safetyHome }, home);
}

function toolContext() {
  return { executionCwd: workspace, configCwd: workspace };
}

/** One tool call through the guard, from the raw input the host would deliver. */
function guardPair(toolName: string, input: unknown, route: ToolRoute) {
  const paired = guardEnvironments();
  return describeOutcome(() =>
    findPolicyConfigMutationTargetInToolInput(toolName, input, route, toolContext(), paired),
  );
}

/** A fixture path as a POSIX shell operand: on Windows `join` spells it with `\\`, which the shell
 *  would read as escapes. */
const sh = (path: string) => path.split(sep).join('/');

/** The home shorthand, kept out of this file's own source as a literal path. */
const TILDE = '~';

/** Every row of a shell table, labelled by the command it states. */
function expectBlocked(rows: readonly { readonly command: string; readonly blocked: boolean }[]) {
  for (const row of rows) {
    const outcome = guardPair(
      'Bash',
      { command: row.command },
      { kind: 'command', shell: 'posix' },
    );
    expect(outcome.ok && outcome.value !== null, row.command).toBe(row.blocked);
  }
}

describe('policy config protection through the shell', () => {
  test('every write channel that reaches a policy file is blocked, and a read is not', () => {
    // The user scope spelled through `~`, which resolves against the fixture home.
    const tildePolicy = `${TILDE}/.cc-safety-net/policy.json`;
    const rows: readonly { readonly command: string; readonly blocked: boolean }[] = [
      { command: `less ${sh(userPolicy)}`, blocked: false },
      { command: `sed s/a/b/ ${sh(userPolicy)}`, blocked: false },
      { command: `jq . ${sh(userPolicy)}`, blocked: false },
      { command: `echo {} >> ${sh(userPolicy)}`, blocked: true },
      { command: `tee ${sh(userPolicy)}`, blocked: true },
      { command: `cp /dev/null ${sh(userPolicy)}`, blocked: true },
      { command: `install -m 600 /dev/null ${sh(userPolicy)}`, blocked: true },
      { command: `rm ${sh(userPolicy)}`, blocked: true },
      { command: `rm -f ${sh(projectPolicy)}`, blocked: true },
      // A recursive delete of an ancestor takes the policy file with it.
      { command: `rm -r ${sh(home)}`, blocked: true },
      { command: `rm -rf ${join(workspace, '.cc-safety-net')}`, blocked: true },
      // The project root itself is not the policy directory, so deleting it is left to the
      // destructive-command rules.
      { command: `rm -rf ${sh(workspace)}`, blocked: false },
      { command: `mv ${sh(join(root, 'other'))} ${sh(userPolicy)}`, blocked: true },
      { command: `find ${sh(safetyHome)} -exec rm -rf {} \\;`, blocked: true },
      { command: `find ${sh(join(root, 'other'))} -delete`, blocked: false },
      { command: `rm -rf ${TILDE}/.cc-safety-net`, blocked: true },
      { command: `cat ${tildePolicy}`, blocked: false },
      { command: `truncate -s 0 ${tildePolicy}`, blocked: true },
      { command: `P=${sh(safetyHome)}; rm -rf "$P"`, blocked: true },
      // A `cd` moves the directory the later relative operand resolves against.
      { command: `cd ${sh(home)} && rm -rf .cc-safety-net`, blocked: true },
      { command: 'cd /nowhere-at-all && cp /dev/null .cc-safety-net/policy.json', blocked: false },
      // A nested shell is walked, so a mutation inside one is still blocked — but its `cd` ends
      // with it, so the operand after the group resolves against the project directory.
      { command: `( rm -rf ${sh(safetyHome)} )`, blocked: true },
      { command: `(cd ${sh(join(root, 'other'))}) && rm -rf .cc-safety-net`, blocked: true },
      { command: `env -S "cp /dev/null ${sh(userPolicy)}"`, blocked: true },
      { command: `sudo cp /dev/null ${sh(userPolicy)}`, blocked: true },
      // contract: src/gate/guards/policy-protection.ts:213 — outside a read-only segment any
      // operand naming the policy file is treated as a write, so a command that only prints it
      // is denied too.
      { command: `echo CONFIG=${sh(userPolicy)}`, blocked: true },
      { command: `printf x > ${sh(join(workspace, 'src', 'policy.json'))}`, blocked: false },
      { command: '', blocked: false },
    ];
    expectBlocked(rows);
  });

  test('the table separates reads from writes and covers both scopes', () => {
    const blocked = (command: string) => {
      const outcome = guardPair('Bash', { command }, { kind: 'command', shell: 'posix' });
      return outcome.ok && outcome.value !== null;
    };
    expect(blocked(`cat ${sh(userPolicy)}`)).toBeFalse();
    expect(blocked(`sed -i s/a/b/ ${sh(userPolicy)}`)).toBeTrue();
    expect(blocked(`echo {} > ${sh(projectPolicy)}`)).toBeTrue();
    expect(blocked(`rm -rf ${sh(safetyHome)}`)).toBeTrue();
    expect(blocked(`mv ${sh(userPolicy)} ${sh(join(root, 'other'))}`)).toBeTrue();
    expect(blocked(`find ${sh(safetyHome)} -delete`)).toBeTrue();
    expect(blocked(`P=${sh(userPolicy)}; cp /dev/null "$P"`)).toBeTrue();
    expect(blocked(`truncate -s 0 ${sh(join(workspace, 'alias', 'policy.json'))}`)).toBeTrue();
    expect(blocked(`rm -rf ${sh(join(root, 'other'))}`)).toBeFalse();
    expect(blocked('echo hello')).toBeFalse();
  });

  test('a command that only mentions the policy path, or cannot be read, writes nothing', () => {
    const rows: readonly { readonly command: string; readonly blocked: boolean }[] = [
      {
        command: `/opt/reviewer --prompt 'Only ${sh(userPolicy)} is protected by policy.'`,
        blocked: false,
      },
      // A wildcard is not resolved into the protected name.
      { command: `rm "${sh(safetyHome)}/polic?.json"`, blocked: false },
      // A write the guard cannot attribute to the file is not inferred from the directory.
      { command: `cp /tmp/policy.json ${sh(safetyHome)}`, blocked: false },
      { command: 'rm -rf / ${', blocked: false },
      // A quoted heredoc body is data, unless the heredoc is redirected into the file or fed to
      // a shell.
      { command: `cat <<'EOF'\nit is about ${sh(userPolicy)}\nEOF`, blocked: false },
      { command: `cat <<'EOF' > ${sh(userPolicy)}\nbody\nEOF`, blocked: true },
      { command: `bash <<'EOF'\nrm ${sh(userPolicy)}\nEOF`, blocked: true },
      // An unterminated quote still leaves the operand visible.
      { command: `rm ${sh(userPolicy)} "`, blocked: true },
      // A sibling of the policy file inside the same directory is not the policy file.
      { command: `rm -rf ${sh(join(safetyHome, 'rules'))}`, blocked: false },
      { command: `mv ${sh(join(safetyHome, 'rules'))} /tmp/rules`, blocked: false },
      { command: `find ${sh(safetyHome)} -type f -print`, blocked: false },
    ];
    expectBlocked(rows);
  });
});

describe('policy config protection through tool inputs', () => {
  test('a payload reports the policy path it would write, by route and by tool', () => {
    const rows: readonly {
      readonly toolName: string;
      readonly input: unknown;
      readonly route: ToolRoute;
      readonly target: string | null;
    }[] = [
      {
        toolName: 'Write',
        input: { file_path: userPolicy },
        route: { kind: 'path' },
        target: userPolicy,
      },
      {
        toolName: 'Write',
        input: { file_path: projectPolicy },
        route: { kind: 'path' },
        target: projectPolicy,
      },
      {
        toolName: 'Write',
        input: { file_path: join(workspace, 'src', 'a.ts') },
        route: { kind: 'path' },
        target: null,
      },
      // The target is reported as written, alias and `~` spellings included.
      {
        toolName: 'Edit',
        input: { file_path: `${TILDE}/.cc-safety-net/policy.json` },
        route: { kind: 'path' },
        target: `${TILDE}/.cc-safety-net/policy.json`,
      },
      {
        toolName: 'Edit',
        input: { path: join(workspace, 'alias', 'policy.json') },
        route: { kind: 'path' },
        target: join(workspace, 'alias', 'policy.json'),
      },
      {
        toolName: 'Read',
        input: { file_path: userPolicy },
        route: { kind: 'path' },
        target: null,
      },
      {
        toolName: 'Grep',
        input: { path: safetyHome, pattern: 'x' },
        route: { kind: 'grep' },
        target: null,
      },
      {
        toolName: 'Glob',
        input: { path: safetyHome, pattern: '*' },
        route: { kind: 'glob' },
        target: null,
      },
      {
        toolName: 'ApplyPatch',
        input: { patch: `*** Update File: ${sh(userPolicy)}\n` },
        route: { kind: 'patch' },
        target: sh(userPolicy),
      },
      {
        toolName: 'ApplyPatch',
        input: { input: `*** Update File: ${sh(projectPolicy)}\n` },
        route: { kind: 'patch' },
        target: sh(projectPolicy),
      },
      {
        toolName: 'mystery',
        input: { command: `cp /dev/null ${sh(userPolicy)}` },
        route: { kind: 'unknown' },
        target: sh(userPolicy),
      },
      {
        toolName: 'mystery',
        input: { file_path: userPolicy },
        route: { kind: 'unknown' },
        target: userPolicy,
      },
      { toolName: 'Write', input: null, route: { kind: 'path' }, target: null },
      { toolName: 'Write', input: { file_path: 42 }, route: { kind: 'path' }, target: null },
    ];
    for (const row of rows) {
      expect(
        guardPair(row.toolName, row.input, row.route),
        `${row.toolName} ${row.route.kind} ${JSON.stringify(row.input)}`,
      ).toStrictEqual({ ok: true, value: row.target === null ? null : { target: row.target } });
    }
  });

  test('a write to either policy file is blocked while a read of it is not', () => {
    const target = (toolName: string, input: unknown, route: ToolRoute) => {
      const outcome = guardPair(toolName, input, route);
      return outcome.ok ? (outcome.value?.target ?? null) : 'threw';
    };
    expect(target('Write', { file_path: userPolicy }, { kind: 'path' })).toBe(userPolicy);
    expect(target('Write', { file_path: projectPolicy }, { kind: 'path' })).toBe(projectPolicy);
    expect(target('Read', { file_path: userPolicy }, { kind: 'path' })).toBeNull();
    expect(target('Glob', { path: safetyHome, pattern: '*' }, { kind: 'glob' })).toBeNull();
    expect(
      target('Write', { file_path: join(workspace, 'src', 'a.ts') }, { kind: 'path' }),
    ).toBeNull();
  });
});

describe('policy config protection over prepared facts', () => {
  test('a declared command reaches the same verdict through the facts entry point', () => {
    const paired = guardEnvironments();
    const target = (command: string) =>
      findPolicyConfigMutationTargetInSemanticFacts(
        createSemanticFacts(
          createToolInvocation(
            'Bash',
            { command },
            { kind: 'command', shell: 'posix' },
            toolContext(),
            command,
          ),
        ),
        paired,
        createBudget(),
      );
    expect(target(`cp /dev/null ${sh(userPolicy)}`)).toStrictEqual({ target: sh(userPolicy) });
    expect(target(`rm -rf ${sh(safetyHome)}`)).toStrictEqual({ target: sh(safetyHome) });
    expect(target(`cat ${sh(userPolicy)}`)).toBeNull();
  });
});
