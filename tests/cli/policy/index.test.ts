import { afterEach, describe, expect, spyOn, test } from 'bun:test';
import { lstatSync } from 'node:fs';
import { join, posix } from 'node:path';
import { PassThrough } from 'node:stream';
import { runPolicyCommand as portedPolicyCommand } from '@/cli/policy/index';
import {
  type CliRow,
  runCliCommand,
  runCliDifferential,
  seedFiles,
} from '../../helpers/cli-differential';
import { json, PROJECT_POLICY, USER_POLICY } from '../../helpers/cli-fixtures';
import { createFakeOutput } from '../../helpers/fake-tty';
import { snapshotTree, type TreeSpec, writeTree } from '../../helpers/fixture-tree';
import {
  createTempRoot,
  environmentFor,
  isolationEnv,
  normalize,
  removeTempRoots,
  WINDOWS_SEPARATOR_FOLDS,
} from '../../helpers/temp-home';

afterEach(() => {
  removeTempRoots();
});

const STRICT_PROPOSAL = json({ version: 1, safety: { level: 'strict' } });
const STANDARD_PROPOSAL = json({ version: 1, safety: { level: 'standard' } });
const PROPOSAL_FILE = 'project/prop.json';

async function runPolicy(args: readonly string[], files: Record<string, string> = {}) {
  const row: CliRow = {
    args: ['policy', ...args],
    seed: (side) => seedFiles(side, files),
  };
  if (args[0] === 'apply') return runCliDifferential(row);
  return runCliCommand(row, (environment) => portedPolicyCommand(environment, [...args]));
}

describe('policy check', () => {
  test('an unchanged proposal reports no changes and leaves the policy unwritten', async () => {
    const outcome = await runPolicy(['check', 'prop.json'], {
      [PROPOSAL_FILE]: STANDARD_PROPOSAL,
    });
    expect(outcome.exitCode).toBe(0);
    expect(outcome.stdout).toContain('No changes.\n');
    expect(outcome.stderr).toBe('');
    expect(outcome.tree.some((entry) => entry.path === PROJECT_POLICY)).toBe(false);
  });
  test('a project proposal is reported against the merged effective policy', async () => {
    const outcome = await runPolicy(['check', 'prop.json'], { [PROPOSAL_FILE]: STRICT_PROPOSAL });
    expect(outcome.exitCode).toBe(0);
    expect(outcome.stdout).toBe(
      [
        `Scope: project (${posix.join('<root>', PROJECT_POLICY)})`,
        'Proposal: prop.json',
        'Effective policy (user + project merged):',
        'Changes (1):',
        '  safety.level: standard -> strict',
        '',
      ].join('\n'),
    );
    expect(outcome.stderr).toBe('');
  }, 60_000);

  test('--global reports the same proposal against the user file', async () => {
    const outcome = await runPolicy(['check', 'prop.json', '--global'], {
      [PROPOSAL_FILE]: STRICT_PROPOSAL,
    });
    expect(outcome.exitCode).toBe(0);
    expect(outcome.stdout).toContain(`Scope: user (${posix.join('<root>', USER_POLICY)})`);
    expect(outcome.stdout).toContain('  safety.level: standard -> strict');
  }, 60_000);

  test('a proposal that relaxes the user scope shows the level it drops', async () => {
    const outcome = await runPolicy(['check', 'prop.json', '--global'], {
      [PROPOSAL_FILE]: STANDARD_PROPOSAL,
      [USER_POLICY]: STRICT_PROPOSAL,
    });
    expect(outcome.stdout).toContain('  safety.level: strict -> standard');
  }, 60_000);

  test('an unrecognized level is refused with the validator diagnostic', async () => {
    const outcome = await runPolicy(['check', 'prop.json'], {
      [PROPOSAL_FILE]: json({ version: 1, safety: { level: 'nope' } }),
    });
    expect(outcome.exitCode).toBe(1);
    expect(outcome.stdout).toBe('');
    expect(outcome.stderr).toContain('prop.json: ');
    expect(outcome.stderr).toContain('safety.level');
  }, 60_000);

  test('an audit section names the one scope that reads it', async () => {
    const outcome = await runPolicy(['check', 'prop.json'], {
      [PROPOSAL_FILE]: json({ version: 1, audit: { retention_days: 5 } }),
    });
    expect(outcome.exitCode).toBe(1);
    expect(outcome.stderr).toBe(
      'prop.json: audit settings are user scope only; remove the audit section from a project proposal\n',
    );
  }, 60_000);

  test('--global lists each rule message a proposal adds', async () => {
    const outcome = await runPolicy(['check', 'prop.json', '--global'], {
      [PROPOSAL_FILE]: json({
        version: 1,
        destructive_command_protection: {
          messages: {
            'git.push-force': { reason: 'Use --force-with-lease.', intent: 'use_alternative' },
          },
        },
        secret_protection: {
          messages: { 'secret.pattern.env-variant': { reason: 'Run `link-env <worktree>`.' } },
        },
      }),
    });
    expect(outcome.stderr).toBe('');
    expect(outcome.stdout).toContain(
      [
        'Changes (2):',
        '  destructive_command_protection.messages.git.push-force: (unset) -> Use --force-with-lease. (use_alternative)',
        '  secret_protection.messages.secret.pattern.env-variant: (unset) -> Run `link-env <worktree>`.',
        '',
      ].join('\n'),
    );
    expect(outcome.exitCode).toBe(0);
  }, 60_000);

  test('a malformed rule message is refused and names what is wrong with it', async () => {
    const outcome = await runPolicy(['check', 'prop.json', '--global'], {
      [PROPOSAL_FILE]: json({
        version: 1,
        destructive_command_protection: {
          messages: {
            'secret.basename.env': { reason: 'A secret rule under the destructive section.' },
            'git.push-force': { intent: 'use_alternative' },
            'git.reset-hard': { reason: 'Stash first.', intent: 'nope' },
            'git.clean-force': 'Preview with git clean -n.',
            'git.stash-drop': { reason: 'Keep the stash.', intnet: 'hard_stop' },
            'git.stash-clear': { reason: 'x'.repeat(257) },
          },
        },
        secret_protection: { messages: [] },
      }),
    });
    expect(outcome.exitCode).toBe(1);
    expect(outcome.stdout).toBe('');
    expect(outcome.stderr.split('\n')).toEqual([
      'prop.json: unknown destructive command rule id "secret.basename.env"',
      'prop.json: destructive_command_protection.messages.git.push-force.reason required non-empty string',
      'prop.json: destructive_command_protection.messages.git.reset-hard.intent must be one of hard_stop, use_alternative, scope_down, manual_only, stop_and_explain',
      'prop.json: destructive_command_protection.messages.git.clean-force must be an object with a reason',
      'prop.json: destructive_command_protection.messages.git.stash-drop.unknown field "intnet"',
      'prop.json: destructive_command_protection.messages.git.stash-clear.reason must be at most 256 characters',
      'prop.json: secret_protection.messages must be an object if provided',
      '',
    ]);
  }, 60_000);

  test('a reason written under overrides is pointed at the messages map', async () => {
    const outcome = await runPolicy(['check', 'prop.json', '--global'], {
      [PROPOSAL_FILE]: json({
        version: 1,
        secret_protection: {
          overrides: { 'secret.pattern.env-variant': { reason: 'Run `link-env <worktree>`.' } },
        },
      }),
    });
    expect(outcome.exitCode).toBe(1);
    expect(outcome.stderr).toBe(
      'prop.json: secret_protection.overrides.secret.pattern.env-variant must be "on" or "off"; a custom reason belongs in secret_protection.messages\n',
    );
  }, 60_000);

  test('a project proposal carrying rule messages is refused, because they are user scope only', async () => {
    const outcome = await runPolicy(['check', 'prop.json'], {
      [PROPOSAL_FILE]: json({
        version: 1,
        destructive_command_protection: { messages: { 'git.push-force': { reason: 'Push it.' } } },
        secret_protection: { messages: {} },
      }),
    });
    expect(outcome.exitCode).toBe(1);
    expect(outcome.stdout).toBe('');
    expect(outcome.stderr).toBe(
      [
        'prop.json: destructive_command_protection.messages is user scope only; remove it from a project proposal',
        'prop.json: secret_protection.messages is user scope only; remove it from a project proposal',
        '',
      ].join('\n'),
    );
  }, 60_000);

  test('a file that does not exist is reported by path', async () => {
    const outcome = await runPolicy(['check', 'missing.json']);
    expect(outcome.exitCode).toBe(1);
    expect(outcome.stderr).toBe(
      'missing.json: file not found\nmissing.json: Config must be an object\n',
    );
  }, 60_000);
});

describe('policy usage', () => {
  test('the bare verb prints its help on stderr', async () => {
    const outcome = await runPolicy([]);
    expect(outcome.exitCode).toBe(1);
    expect(outcome.stdout).toBe('');
    expect(outcome.stderr).toContain('cc-safety-net policy');
  }, 60_000);

  test('an unknown subcommand, a missing file and an extra argument each name themselves', async () => {
    const unknown = await runPolicy(['frob', 'x']);
    expect(unknown.stderr).toBe('Unknown policy subcommand: frob\n');
    const noFile = await runPolicy(['check']);
    expect(noFile.stderr).toBe('policy check requires a file\n');
    const extra = await runPolicy(['check', 'a', 'b', 'c']);
    expect(extra.stderr).toBe('Unexpected policy argument: b\nUnexpected policy argument: c\n');
  }, 60_000);
});

describe('policy apply without a terminal', () => {
  test('a piped stdin is refused in both scopes and writes nothing', async () => {
    const outcome = await runPolicy(['apply', 'prop.json'], { [PROPOSAL_FILE]: STRICT_PROPOSAL });
    expect(outcome.exitCode).toBe(1);
    expect(outcome.stderr).toBe(
      [
        'policy apply confirms interactively; run this yourself in a terminal:',
        '  cc-safety-net policy apply prop.json',
        '',
      ].join('\n'),
    );
    expect(outcome.tree.map((entry) => entry.path)).toEqual([
      'home',
      'home/tmp',
      'project',
      'project/prop.json',
    ]);
    const global = await runPolicy(['apply', 'prop.json', '--global'], {
      [PROPOSAL_FILE]: STRICT_PROPOSAL,
    });
    expect(global.stderr).toContain('  cc-safety-net policy apply prop.json --global\n');
    expect(global.tree).toStrictEqual(outcome.tree);
  }, 60_000);
});

async function driveApply(
  label: string,
  extra: readonly string[],
  answer: (input: PassThrough) => void,
  call: (context: {
    home: string;
    env: Record<string, string | undefined>;
    cwd: string;
    args: string[];
    input: NodeJS.ReadStream;
    output: NodeJS.WriteStream;
  }) => Promise<number>,
  from = 'project',
  files: TreeSpec = {},
) {
  const root = createTempRoot(`policy-${label}-`);
  const home = join(root, 'home');
  const env = isolationEnv(home);
  writeTree(root, { [PROPOSAL_FILE]: STRICT_PROPOSAL, ...files });
  const input = Object.assign(new PassThrough(), { isTTY: true }) as unknown as NodeJS.ReadStream;
  const output = createFakeOutput({ isTTY: true });
  const written: string[] = [];
  const record = (...parts: unknown[]) => {
    written.push(parts.join(' '));
  };
  const log = spyOn(console, 'log').mockImplementation(record);
  const error = spyOn(console, 'error').mockImplementation(record);
  try {
    const running = call({
      home,
      env,
      cwd: join(root, from),
      args: ['apply', join(root, PROPOSAL_FILE), ...extra],
      input,
      output: output as unknown as NodeJS.WriteStream,
    });
    answer(input as unknown as PassThrough);
    const code = await running;
    return {
      home,
      outcome: normalize({ code, written, prompt: output.text(), tree: snapshotTree(root) }, [
        [root, '<root>'],
        ...WINDOWS_SEPARATOR_FOLDS,
      ]),
    };
  } finally {
    log.mockRestore();
    error.mockRestore();
  }
}

async function applyBothWays(
  extra: readonly string[],
  answer: (input: PassThrough) => void,
  from?: string,
  files?: TreeSpec,
) {
  const ported = await driveApply(
    'ported',
    extra,
    answer,
    (context) =>
      portedPolicyCommand(environmentFor(context.home, context.env), context.args, {
        cwd: context.cwd,
        input: context.input,
        output: context.output,
      }),
    from,
    files,
  );
  return { ...ported.outcome, home: ported.home };
}

describe('policy apply at a terminal', () => {
  test('a typed yes writes only the fields the proposal set', async () => {
    const outcome = await applyBothWays([], (input) => input.write('y\n'));
    expect(outcome.code).toBe(0);
    expect(outcome.prompt).toBe(
      `Apply this policy to ${posix.join('<root>', PROJECT_POLICY)}? [y/N] `,
    );
    expect(outcome.written).toContain(`Policy applied: ${posix.join('<root>', PROJECT_POLICY)}`);
    const applied = outcome.tree.find(
      (entry) => entry.path === 'project/.cc-safety-net/policy.json',
    );
    expect(applied?.content).toBe(STRICT_PROPOSAL);
  }, 30_000);

  test('--global writes the user file readable by its owner alone', async () => {
    const outcome = await applyBothWays(['--global'], (input) => input.write('y\n'));
    expect(outcome.code).toBe(0);
    const applied = outcome.tree.find((entry) => entry.path === 'home/.cc-safety-net/policy.json');
    expect(JSON.parse(applied?.content ?? '')).toMatchObject({ safety: { level: 'strict' } });
    if (process.platform === 'win32') return;
    expect(lstatSync(join(outcome.home, '.cc-safety-net', 'policy.json')).mode & 0o777).toBe(0o600);
  }, 30_000);

  test('--global writes the rule messages a proposal carries and no empty map beside them', async () => {
    const messages = {
      'secret.pattern.env-variant': {
        reason: 'Run `link-env <worktree>`.',
        intent: 'use_alternative',
      },
    };
    const outcome = await applyBothWays(['--global'], (input) => input.write('y\n'), undefined, {
      [PROPOSAL_FILE]: json({ version: 1, secret_protection: { messages } }),
    });
    expect(outcome.code).toBe(0);
    const applied = JSON.parse(
      outcome.tree.find((entry) => entry.path === USER_POLICY)?.content ?? '',
    );
    expect(applied.secret_protection.messages).toEqual(messages);
    expect(Object.keys(applied.destructive_command_protection)).toEqual([
      'enabled',
      'overrides',
      'allow_paths',
    ]);
  }, 30_000);

  test('a typed no cancels and leaves the scope untouched', async () => {
    const outcome = await applyBothWays([], (input) => input.write('n\n'));
    expect(outcome.code).toBe(0);
    expect(outcome.written).toContain('Cancelled; nothing was written.');
    expect(outcome.tree.map((entry) => entry.path)).toEqual([
      'home',
      'home/tmp',
      'project',
      'project/prop.json',
    ]);
  }, 30_000);

  test('a closed stream declines rather than waiting for a line that never comes', async () => {
    const outcome = await applyBothWays([], (input) => input.end());
    expect(outcome.code).toBe(0);
    expect(outcome.written).toContain('Cancelled; nothing was written.');
  }, 30_000);
});

describe('policy from the directory that holds the user policy', () => {
  const AUDITED_USER_POLICY = json({
    version: 1,
    safety: { level: 'standard', overrides: {} },
    audit: { retention_days: 30 },
  });
  const REFUSAL = `${posix.join('<root>', USER_POLICY)} is the user policy, not a project policy; use --global for the user scope, or run from a project directory`;

  test('apply refuses the project scope before prompting and leaves the user policy as it was', async () => {
    const outcome = await applyBothWays([], (input) => input.write('y\n'), 'home', {
      [USER_POLICY]: AUDITED_USER_POLICY,
    });
    expect(outcome.written).toEqual([REFUSAL]);
    expect(outcome.code).toBe(1);
    expect(outcome.prompt).toBe('');
    expect(outcome.tree.find((entry) => entry.path === USER_POLICY)?.content).toBe(
      AUDITED_USER_POLICY,
    );
  }, 30_000);

  test('check refuses the project scope before printing a diff', async () => {
    const outcome = await runCliCommand(
      {
        args: ['policy', 'check', 'prop.json'],
        seed: (side) =>
          seedFiles(side, {
            'home/prop.json': STRICT_PROPOSAL,
            [USER_POLICY]: AUDITED_USER_POLICY,
          }),
        cwd: (side) => side.home,
      },
      (environment) =>
        portedPolicyCommand(environment, ['check', 'prop.json'], { cwd: environment.home }),
    );
    expect(outcome.stderr).toBe(`${REFUSAL}\n`);
    expect(outcome.exitCode).toBe(1);
    expect(outcome.stdout).toBe('');
  }, 60_000);
});
