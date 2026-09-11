import { afterAll, describe, expect, test } from 'bun:test';
import { createTestEnvironment, processPathResolver } from '@/core/environment';
import type { DestructiveCommandRulePolicy } from '@/core/policy/effective-rules';
import { resolveEffectiveDestructiveCommandRules } from '@/core/policy/effective-rules';
import type { EffectiveSafetyCapabilities } from '@/core/policy/types';
import { textCommandWords } from '@/gate/analyzer/command-words';
import { analyzeGitDetailed, analyzeGitMatch, getGitWorktreeRelaxation } from '@/gate/analyzer/git';
import { createLinkedWorktreeFixture, withLinkedWorktreeFixture } from '../../helpers';
import { runGit } from '../../helpers/git-worktree';
import { corpusCommands } from '../../helpers/shell-inputs';

const fixture = createLinkedWorktreeFixture();

afterAll(() => {
  fixture.cleanup();
});

const GIT_ARGVS: readonly (readonly string[])[] = [
  ['git', 'status'],
  ['git', 'checkout', '--', '.'],
  ['git', 'checkout', '.'],
  ['git', 'checkout', '-f', 'main'],
  ['git', 'checkout', '-B', 'main', '--force'],
  ['git', 'checkout', '--force', '-B', 'main'],
  ['git', 'restore', '.'],
  ['git', 'restore', '--staged', '.'],
  ['git', 'restore', '--source=HEAD', '.'],
  ['git', 'reset', '--hard'],
  ['git', 'reset', '--hard', 'HEAD~1'],
  ['git', 'reset', '--merge'],
  ['git', 'reset', '--soft', 'HEAD~1'],
  ['git', 'clean', '-fd'],
  ['git', 'clean', '-f', '-f'],
  ['git', 'clean', '-ff'],
  ['git', 'clean', '--force', '--force'],
  ['git', 'clean', '-n'],
  ['git', 'switch', '-C', 'main', '--force'],
  ['git', 'switch', '--discard-changes', '-C', 'main'],
  ['git', 'switch', 'main'],
  ['git', 'stash', 'drop'],
  ['git', 'stash', 'clear'],
  ['git', 'branch', '-D', 'feature'],
  ['git', 'tag', '-d', 'v1'],
  ['git', 'push', '--force', 'origin', 'main'],
  ['git', 'push', 'origin', 'main'],
  ['git', 'pull', '--rebase'],
  ['git', 'fetch', 'origin'],
  ['git', 'clone', 'https://example.test/r.git'],
  ['git', 'ls-remote', 'origin'],
  ['git', 'submodule', 'update'],
  ['git', 'archive', '--remote=origin', 'HEAD'],
  ['git', 'archive', 'HEAD'],
  ['git', 'remote', 'update'],
  ['git', 'remote', '-v', 'update'],
  ['git', 'remote', 'show'],
  ['git', 'checkout', '--', '$FILE'],
  ['git', 'checkout', '--', '*.txt'],
  ['git', 'checkout', '--recurse-submodules', '--', '.'],
  ['git', '-c', 'submodule.recurse=true', 'checkout', '--', '.'],
  ['git', '-c', 'submodule.recurse=false', 'checkout', '--', '.'],
  ['git', '-c', 'alias.wipe=!rm -rf /', 'wipe'],
  ['git', '-c', 'alias.co=checkout', 'co', '--', '.'],
  ['git', '-c', 'core.sshCommand=touch pwned', 'fetch'],
  ['git', '-c', 'core.sshCommand=touch pwned', 'status'],
  ['git', '-C', 'sub', 'checkout', '--', '.'],
  ['git', '-C', '.', '-c', 'submodule.recurse=true', 'checkout', '--', '.'],
  ['git', '-C', '.', '-c', 'submodule.recurse=false', 'checkout', '--', '.'],
  ['git', '--git-dir=.git', 'checkout', '--', '.'],
  ['git', '--', 'checkout'],
  ['git'],
  ['not-git', 'checkout', '--', '.'],
];

const ENVIRONMENTS: readonly Readonly<Record<string, string>>[] = [
  {},
  { GIT_SSH_COMMAND: 'ssh -o StrictHostKeyChecking=no' },
  { GIT_DIR: '/elsewhere/.git' },
  {
    GIT_CONFIG_COUNT: '1',
    GIT_CONFIG_KEY_0: 'alias.co',
    GIT_CONFIG_VALUE_0: 'checkout',
  },
];

const ENV_ASSIGNMENTS: readonly (ReadonlyMap<string, string> | undefined)[] = [
  undefined,
  new Map([['GIT_SSH_COMMAND', 'ssh -v']]),
  new Map([['GIT_WORK_TREE', '/elsewhere']]),
];

function capabilities(failClosed: boolean): EffectiveSafetyCapabilities {
  const state = (enabled: boolean) => ({ enabled, source: 'preset' as const, sources: ['preset'] });
  return {
    fail_closed: state(failClosed),
    paranoid_rm: state(false),
    paranoid_interpreters: state(false),
  };
}

function policyPair(
  protectionEnabled: boolean,
  overrides: Readonly<Record<string, 'on' | 'off'>>,
  failClosed: boolean,
) {
  const base = {
    destructiveCommandProtectionEnabled: protectionEnabled,
    destructiveCommandRuleOverrides: overrides,
  };
  return {
    destructiveCommandProtectionEnabled: protectionEnabled,
    effectiveDestructiveCommandRules: resolveEffectiveDestructiveCommandRules(
      base,
      capabilities(failClosed),
    ),
  } satisfies DestructiveCommandRulePolicy;
}

const POLICIES = [
  undefined,
  policyPair(true, {}, false),
  policyPair(true, {}, true),
  policyPair(false, {}, false),
  policyPair(true, { 'git.alias-config': 'off' }, true),
] as const;

function gitCorpusArgvs(): readonly (readonly string[])[] {
  return corpusCommands()
    .filter((command) => /(^|[\s|;&(])git\s/.test(command))
    .map((command) => command.split(/\s+/).filter(Boolean));
}

describe('gate/analyzer/git', () => {
  test('every Git command is decided in and out of a linked worktree', () => {
    const rows = [...GIT_ARGVS, ...gitCorpusArgvs()];
    let matches = 0;
    let relaxations = 0;

    for (const variables of ENVIRONMENTS) {
      const env = new Map(Object.entries(variables));
      const environment = createTestEnvironment({
        env,
        home: fixture.rootDir,
        paths: processPathResolver,
      });

      for (const cwd of [fixture.linkedWorktree, fixture.mainWorktree, fixture.rootDir]) {
        for (const worktreeMode of [true, false]) {
          for (const envAssignments of ENV_ASSIGNMENTS) {
            for (const policy of POLICIES) {
              for (const tokens of rows) {
                const shared = { cwd, envAssignments, worktreeMode, dynamicArguments: false };
                const match = analyzeGitMatch(textCommandWords(tokens), {
                  ...shared,
                  environment,
                  policy,
                });

                const detailed = analyzeGitDetailed(textCommandWords(tokens), {
                  ...shared,
                  environment,
                  policy,
                });
                expect(detailed.match).toStrictEqual(match);

                const relaxation = getGitWorktreeRelaxation(tokens, {
                  ...shared,
                  environment,
                  policy,
                });
                expect(relaxation, tokens.join(' ')).toStrictEqual(detailed.relaxation);

                if (match) matches++;
                if (detailed.relaxation) relaxations++;
              }
            }
          }
        }
      }
    }

    expect(matches).toBeGreaterThan(100);
    expect(relaxations).toBeGreaterThan(10);
  }, 60_000);

  test('dynamic arguments withhold the relaxation', () => {
    const env = new Map<string, string>();
    const environment = createTestEnvironment({
      env,
      home: fixture.rootDir,
      paths: processPathResolver,
    });
    const shared = { cwd: fixture.linkedWorktree, worktreeMode: true };
    let relaxed = 0;

    for (const tokens of GIT_ARGVS) {
      for (const dynamicArguments of [true, false]) {
        const detailed = analyzeGitDetailed(textCommandWords(tokens), {
          ...shared,
          dynamicArguments,
          environment,
        });
        if (detailed.relaxation) {
          relaxed++;
          expect(dynamicArguments).toBeFalse();
        }
      }
    }

    expect(relaxed).toBeGreaterThan(3);
  });

  test('submodule.recurse in the worktree config withholds the relaxation', async () => {
    await withLinkedWorktreeFixture((configured) => {
      runGit(configured.linkedWorktree, ['config', 'submodule.recurse', 'true']);
      const env = new Map<string, string>();
      const shared = {
        cwd: configured.linkedWorktree,
        worktreeMode: true,
        dynamicArguments: false,
      };
      const tokens = ['git', 'checkout', '--', '.'];
      const detailed = analyzeGitDetailed(textCommandWords(tokens), {
        ...shared,
        environment: createTestEnvironment({
          env,
          home: configured.rootDir,
          paths: processPathResolver,
        }),
      });
      expect(detailed.relaxation).toBeNull();
      expect(detailed.match?.id).toBe('git.checkout-double-dash');
    });
  });
});

const REASON_GIT_SSH_ENV =
  'Git SSH environment overrides can execute arbitrary commands during network operations. Run git without GIT_SSH/GIT_SSH_COMMAND overrides, or ask the user to run it manually.';
const REASON_GIT_ALIAS_CONFIG =
  'Git aliases supplied through command-line or environment config can hide or execute commands. Run git without Git alias overrides, or ask the user to run it manually.';

function configEnv(count: number, entries: readonly (readonly [string, string])[] = []) {
  const assignments = new Map<string, string>([['GIT_CONFIG_COUNT', String(count)]]);
  entries.forEach(([key, value], index) => {
    assignments.set(`GIT_CONFIG_KEY_${index}`, key);
    assignments.set(`GIT_CONFIG_VALUE_${index}`, value);
  });
  return assignments;
}

describe('git configuration read through the environment', () => {
  const environment = () =>
    createTestEnvironment({
      env: new Map<string, string>(),
      home: fixture.rootDir,
      paths: processPathResolver,
    });

  const analyze = (
    tokens: readonly string[],
    options: {
      envAssignments?: ReadonlyMap<string, string>;
      cwd?: string;
      worktreeMode?: boolean;
      policy?: DestructiveCommandRulePolicy;
    } = {},
  ) =>
    analyzeGitMatch(textCommandWords(tokens), {
      cwd: options.cwd ?? fixture.mainWorktree,
      envAssignments: options.envAssignments,
      worktreeMode: options.worktreeMode ?? false,
      dynamicArguments: false,
      environment: environment(),
      policy: options.policy,
    });

  test('an alias defined through the environment is expanded before the rules run', () => {
    expect(analyze([])).toBeNull();
    expect(
      analyze(['git', 'nuke'], { envAssignments: configEnv(1, [['alias.nuke', 'status']]) }),
    ).toBeNull();
    expect(
      analyze(['git', 'nuke'], {
        envAssignments: configEnv(1, [['alias.nuke', 'reset --hard']]),
      })?.id,
    ).toBe('git.reset-hard');
    expect(
      analyze(['git', 'nuke'], {
        envAssignments: configEnv(2, [
          ['alias.nuke', 'reset --hard'],
          ['ALIAS.NUKE', 'status'],
        ]),
      }),
    ).toBeNull();
    expect(
      analyze(['git', 'nuke'], {
        envAssignments: new Map([['GIT_CONFIG_PARAMETERS', "'alias.nuke=reset --hard'"]]),
      })?.id,
    ).toBe('git.reset-hard');
  });

  test('config the reader cannot enumerate is blocked as an alias override', () => {
    const overLimit = analyze(['git', 'status'], { envAssignments: configEnv(1025) });
    expect(overLimit).toStrictEqual({
      id: 'git.alias-config',
      reason: REASON_GIT_ALIAS_CONFIG,
      intent: 'manual_only',
    });
    const atLimit = configEnv(
      1024,
      Array.from({ length: 1024 }, (_unused, index) => [`user.safety${index}`, ''] as const),
    );
    expect(analyze(['git', 'status'], { envAssignments: atLimit })).toBeNull();
    expect(analyze(['git', 'status'], { envAssignments: configEnv(1) })?.id).toBe(
      'git.alias-config',
    );
    expect(
      analyze(['git', 'status'], {
        envAssignments: new Map([['GIT_CONFIG_PARAMETERS', "'unterminated"]]),
      })?.id,
    ).toBe('git.alias-config');
    expect(
      analyze(['git', '-c', 'alias.wipe=!rm -rf /', 'wipe'], {
        policy: policyPair(true, { 'git.alias-config': 'off' }, true),
        envAssignments: configEnv(1025),
      }),
    ).toBeNull();
  });

  test('an SSH override is blocked for the network subcommands only', () => {
    const sshEnv = new Map([['GIT_SSH_COMMAND', 'touch pwned']]);
    expect(analyze(['git', 'fetch', 'origin'], { envAssignments: sshEnv })).toStrictEqual({
      id: 'git.ssh-env',
      reason: REASON_GIT_SSH_ENV,
      intent: 'manual_only',
    });
    expect(analyze(['git', 'status'], { envAssignments: sshEnv })).toBeNull();
    expect(
      analyze(['git', 'archive', '--remote=origin', 'HEAD'], { envAssignments: sshEnv })?.id,
    ).toBe('git.ssh-env');
    expect(analyze(['git', 'archive', 'HEAD'], { envAssignments: sshEnv })).toBeNull();
    expect(
      analyze(['git', 'fetch', 'origin'], {
        envAssignments: configEnv(1, [['CORE.SSHCOMMAND', '']]),
      })?.id,
    ).toBe('git.ssh-env');
  });

  test('a local discard is relaxed only inside a linked worktree that Git reads plainly', () => {
    const relaxed = (
      tokens: readonly string[],
      options: { envAssignments?: ReadonlyMap<string, string>; cwd?: string } = {},
    ) =>
      analyzeGitDetailed(textCommandWords(tokens), {
        cwd: options.cwd ?? fixture.linkedWorktree,
        envAssignments: options.envAssignments,
        worktreeMode: true,
        dynamicArguments: false,
        environment: environment(),
      });

    expect(relaxed(['git', 'reset', '--hard'])).toStrictEqual({
      match: null,
      relaxation: {
        originalReason:
          "git reset --hard destroys all uncommitted changes permanently. Use 'git stash' first.",
        gitCwd: expect.any(String),
      },
    });
    expect(relaxed(['git', 'checkout', '--', '.']).match).toBeNull();
    expect(relaxed(['git', 'reset', '--hard'], { cwd: fixture.mainWorktree }).match?.id).toBe(
      'git.reset-hard',
    );
    expect(
      relaxed(['git', 'reset', '--hard'], {
        envAssignments: configEnv(1, [['include.path', '.gitconfig-extra']]),
      }).match?.id,
    ).toBe('git.reset-hard');
    expect(
      relaxed(['git', 'reset', '--hard'], {
        envAssignments: configEnv(1, [['submodule.recurse', 'true']]),
      }).match?.id,
    ).toBe('git.reset-hard');
    expect(
      relaxed(['git', 'reset', '--hard'], {
        envAssignments: configEnv(2, [
          ['SUBMODULE.RECURSE', 'true'],
          ['submodule.recurse', 'false'],
        ]),
      }).match,
    ).toBeNull();
    expect(
      relaxed(['git', 'reset', '--hard'], {
        envAssignments: new Map([['GIT_DIR', '/elsewhere/.git']]),
      }).match?.id,
    ).toBe('git.reset-hard');
  });
});
