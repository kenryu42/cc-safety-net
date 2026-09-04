import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, parse, relative } from 'node:path';
import { PathCanonicalizationLimitError } from '@/analyzer/path-canonicalization';
import { findPolicyConfigMutationTargetInToolInput as findPolicyMutationWithRoute } from '@/guards/policy-protection';
import type { ToolRoute } from '@/ir/invocation';
import { getNonCommandToolInputKind, normalizeToolName } from '@/parser/tool-input';
import { getUserPolicyPath } from '@/policy/store';
import {
  getProjectPolicyPath,
  getProjectRulesConfigPath,
  getProjectRulesLockPath,
  getUserRulesConfigPath,
  getUserRulesLockPath,
} from '@/rules/policy/paths';
import { toShellPath, withEnv } from '../helpers';

const COMMAND_TOOL_NAMES = new Set([
  'bash',
  'powershell',
  'runcommand',
  'runshellcommand',
  'shell',
]);

function findPolicyMutation(toolName: string, input: unknown, cwd = process.cwd()) {
  const route: ToolRoute = COMMAND_TOOL_NAMES.has(normalizeToolName(toolName))
    ? { kind: 'command', shell: 'auto' }
    : { kind: getNonCommandToolInputKind(toolName) };
  return findPolicyMutationWithRoute(toolName, input, route, {
    configCwd: cwd,
    executionCwd: cwd,
  });
}

function materializeUserPolicyFile() {
  const policyPath = getUserPolicyPath();
  mkdirSync(dirname(policyPath), { recursive: true });
  writeFileSync(policyPath, '{}');
  return policyPath;
}

describe('policy config protection', () => {
  let cwd: string;

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), 'safety-net-policy-protection-'));
  });

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true });
  });

  test('allows the explicit read whitelist and policy directory inspection', () => {
    const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      const policyPath = getUserPolicyPath();
      for (const [toolName, input] of [
        ['Read', { file_path: policyPath }],
        ['read_file', { file_path: policyPath }],
        ['view_file', { AbsolutePath: policyPath }],
        ['View', { AbsolutePath: policyPath }],
      ] as const) {
        expect(findPolicyMutation(toolName, input, cwd)).toBeNull();
      }
      for (const command of [
        `cat ${toShellPath(policyPath)}`,
        `jq '.' ${toShellPath(policyPath)}`,
        `FOO=1 sed -n 1p ${toShellPath(policyPath)} > policy-copy.txt`,
        `ls -la ${toShellPath(safetyNetHome)}`,
        `file ${toShellPath(safetyNetHome)}`,
        `find ${toShellPath(safetyNetHome)} -maxdepth 3 -type f | head -200`,
      ]) {
        expect(findPolicyMutation('Bash', { command }, cwd), command).toBeNull();
      }
    });
  });

  test('blocks direct write-like tool paths and allows unrelated fields', () => {
    const policyPath = getUserPolicyPath();
    for (const [toolName, input] of [
      ['Write', { file_path: policyPath, content: '{}' }],
      ['MultiEdit', { edits: [{ path: policyPath }] }],
      ['write_to_file', { TargetFile: policyPath, CodeContent: '{}' }],
      ['NotebookEdit', { notebook_path: policyPath, new_source: '{}' }],
      ['Write', { command: 'echo ok', file_path: policyPath, content: '{}' }],
    ] as const) {
      expect(findPolicyMutation(toolName, input, cwd)?.target).toBe(policyPath);
    }

    expect(findPolicyMutation('Write', { file_path: 'README.md' }, cwd)).toBeNull();
    expect(findPolicyMutation('Write', { glob: policyPath }, cwd)).toBeNull();
    expect(findPolicyMutation('Write', { pattern: policyPath }, cwd)).toBeNull();
  });

  test('protects only the canonical user policy path', () => {
    const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      for (const path of [
        getUserRulesConfigPath(),
        getProjectRulesConfigPath(cwd),
        getUserRulesLockPath(),
        getProjectRulesLockPath(cwd),
        join(safetyNetHome, 'rules', 'local', 'rulebook.json'),
        join(safetyNetHome, 'cache', 'rulebook.json'),
      ]) {
        expect(findPolicyMutation('Write', { file_path: path }, cwd), path).toBeNull();
        expect(
          findPolicyMutation('Bash', { command: `cat package.json > ${toShellPath(path)}` }, cwd),
          path,
        ).toBeNull();
      }
    });
  });

  test('resolves supported environment, relative, and symlink aliases', () => {
    const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      const policyPath = materializeUserPolicyFile();
      const alias = join(cwd, 'policy-alias.json');
      symlinkSync(policyPath, alias);

      expect(
        findPolicyMutation('Write', { file_path: '$CC_SAFETY_NET_HOME/policy.json' }, cwd)?.target,
      ).toBe('$CC_SAFETY_NET_HOME/policy.json');
      expect(findPolicyMutation('Write', { file_path: alias }, cwd)?.target).toBe(alias);
      expect(findPolicyMutation('Read', { file_path: alias }, cwd)).toBeNull();

      const executionCwd = join(cwd, 'nested');
      mkdirSync(executionCwd);
      const target = relative(executionCwd, policyPath);
      expect(
        findPolicyMutationWithRoute(
          'Write',
          { file_path: target },
          { kind: 'path' },
          { configCwd: join(cwd, 'unrelated-config-root'), executionCwd },
        )?.target,
      ).toBe(target);
    });
  });

  test('blocks exact shell operands, option values, and write redirects', () => {
    const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      const policyPath = getUserPolicyPath();
      for (const command of [
        `cat package.json > ${toShellPath(policyPath)}`,
        `cat package.json >| ${toShellPath(policyPath)}`,
        `tee ${toShellPath(policyPath)}`,
        `rm ${toShellPath(policyPath)}`,
        `sed -i.bak s/a/b/ ${toShellPath(policyPath)}`,
        `dd if=/dev/zero of=${toShellPath(policyPath)}`,
        `curl --output=${toShellPath(policyPath)} https://example.com/config`,
        `ln -sf /tmp/replacement.json ${toShellPath(policyPath)}`,
        `jq '.' ${toShellPath(policyPath)} > ${toShellPath(policyPath)}`,
        `jq '.' ${toShellPath(policyPath)} | tee ${toShellPath(policyPath)}`,
        `jq '.' ${toShellPath(policyPath)} | sponge ${toShellPath(policyPath)}`,
        `cat package.json > $CC_SAFETY_NET_HOME/policy.json`,
      ]) {
        expect(findPolicyMutation('Bash', { command }, cwd)?.target, command).toContain(
          'policy.json',
        );
      }
    });
  });

  test('tracks only simple assignment-only variables and explicit cd changes', () => {
    const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      for (const command of [
        'policy_dir=$CC_SAFETY_NET_HOME; echo x > "$policy_dir/policy.json"',
        'cd $CC_SAFETY_NET_HOME && echo x > policy.json',
      ]) {
        expect(findPolicyMutation('Bash', { command }, cwd), command).not.toBeNull();
      }

      expect(
        findPolicyMutation(
          'Bash',
          { command: 'policy_dir=$CC_SAFETY_NET_HOME; echo x > "$policy_dir/rules/rule.json"' },
          cwd,
        ),
      ).toBeNull();
    });
  });

  test('blocks recursive rm of the policy directory or an ancestor', () => {
    const home = join(cwd, 'home');
    const safetyNetHome = join(home, '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      for (const command of [
        `rm -r ${toShellPath(safetyNetHome)}`,
        `rm -rf ${toShellPath(safetyNetHome)}`,
        `rm -R ${toShellPath(home)}`,
        `rm --recursive ${toShellPath(parse(safetyNetHome).root)}`,
        `cd ${toShellPath(home)} && rm -rf .cc-safety-net`,
      ]) {
        expect(findPolicyMutation('Bash', { command }, cwd), command).not.toBeNull();
      }
      for (const command of [
        `rm -rf ${toShellPath(join(safetyNetHome, 'rules'))}`,
        `rm ${toShellPath(safetyNetHome)}`,
        `rm -rf "${toShellPath(safetyNetHome.slice(0, -1))}?"`,
      ]) {
        expect(findPolicyMutation('Bash', { command }, cwd), command).toBeNull();
      }
    });
  });

  test.skipIf(process.platform !== 'win32')(
    '[windows] blocks an MSYS spelling of the policy directory',
    () => {
      const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
      const msysSafetyNetHome = toShellPath(safetyNetHome).replace(/^([A-Za-z]):\//, '/$1/');
      [safetyNetHome, msysSafetyNetHome].forEach((configuredHome) => {
        withEnv({ CC_SAFETY_NET_HOME: configuredHome }, () => {
          expect(
            findPolicyMutation('Bash', { command: `rm -rf ${msysSafetyNetHome}` }, cwd)?.target,
          ).toBe(msysSafetyNetHome);
        });
      });
    },
  );

  test('blocks policy mutations hidden in an env -S split string', () => {
    const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      const policyPath = getUserPolicyPath();
      for (const command of [
        `env -S 'rm ${toShellPath(policyPath)}' true`,
        `env -S 'rm -r ${toShellPath(safetyNetHome)}' true`,
        `env -S 'rm ${toShellPath(policyPath)}' cat`,
        `env -S 'LC_ALL=C rm -r ${toShellPath(safetyNetHome)}' true`,
        `find ${toShellPath(safetyNetHome)} -exec env -S 'rm -rf' {} \\;`,
        `env -S 'rm "${toShellPath(policyPath)}"' true`,
        `env -S 'rm -r "${toShellPath(safetyNetHome)}"' true`,
      ]) {
        expect(findPolicyMutation('Bash', { command }, cwd), command).not.toBeNull();
      }
    });
  });

  test('blocks a quoted policy path with spaces inside an env -S split value', () => {
    withEnv({ CC_SAFETY_NET_HOME: join(cwd, 'home with space', '.cc-safety-net') }, () => {
      const policyPath = getUserPolicyPath();
      const command = `env -S 'rm "${toShellPath(policyPath)}"' true`;
      expect(findPolicyMutation('Bash', { command }, cwd)?.target, command).toBe(
        toShellPath(policyPath),
      );
    });
  });

  test('protects an outside-home policy through executed brace groups and called functions', () => {
    const safetyNetHome = join(cwd, 'shared-policy');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      for (const command of [
        `rm -rf ${toShellPath(safetyNetHome)}`,
        `( rm -rf ${toShellPath(safetyNetHome)} )`,
        `{ rm -rf ${toShellPath(safetyNetHome)}; }`,
        `cleanup() { rm -rf ${toShellPath(safetyNetHome)}; }; cleanup`,
        `cleanup() { rm -rf ${toShellPath(safetyNetHome)}; }; X=1 cleanup`,
        `function cleanup { rm -rf ${toShellPath(safetyNetHome)}; }; cleanup`,
        `function cleanup() { rm -rf ${toShellPath(safetyNetHome)}; }; cleanup`,
      ]) {
        expect(findPolicyMutation('Bash', { command }, cwd)?.target, command).toBe(
          toShellPath(safetyNetHome),
        );
      }

      for (const command of [
        `cleanup() { rm -rf ${toShellPath(safetyNetHome)}; }`,
        `function cleanup { rm -rf ${toShellPath(safetyNetHome)}; }`,
        `function cleanup() { rm -rf ${toShellPath(safetyNetHome)}; }`,
      ]) {
        expect(findPolicyMutation('Bash', { command }, cwd), command).toBeNull();
      }
    });
  });

  test('protects an outside-home project policy through brace groups and subshells', () => {
    const project = join(cwd, 'project');
    mkdirSync(project);
    const projectDir = dirname(getProjectPolicyPath(project));
    for (const command of [
      `rm -rf ${toShellPath(projectDir)}`,
      `{ rm -rf ${toShellPath(projectDir)}; }`,
      `( rm -rf ${toShellPath(projectDir)} )`,
      `true; { rm -rf ${toShellPath(projectDir)}; }`,
      `{ { rm -rf ${toShellPath(projectDir)}; }; }`,
      `{ cd ${toShellPath(project)} && rm -rf .cc-safety-net; }`,
    ]) {
      expect(findPolicyMutation('Bash', { command }, project), command).not.toBeNull();
    }
    for (const command of [
      `{ rm -rf ${toShellPath(join(project, 'node_modules'))}; }`,
      `( ls ${toShellPath(projectDir)} )`,
      `{ echo done; } > ${toShellPath(join(project, 'out.txt'))}`,
    ]) {
      expect(findPolicyMutation('Bash', { command }, project), command).toBeNull();
    }
  });

  test('blocks destructive find roots that contain the policy file', () => {
    const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      const home = dirname(safetyNetHome);
      const policyPath = getUserPolicyPath();
      for (const command of [
        `find ${toShellPath(policyPath)} -delete`,
        `find ${toShellPath(safetyNetHome)} -delete`,
        `find ${toShellPath(home)} -type f -delete`,
        `find ${toShellPath(safetyNetHome)} -exec rm -f {} +`,
        `find ${toShellPath(home)} -execdir rm -f {} +`,
        `find . -maxdepth 0 -exec rm -f ${toShellPath(policyPath)} \\;`,
        `find ${toShellPath(policyPath)} -exec mv {} /tmp \\;`,
      ]) {
        expect(findPolicyMutation('Bash', { command }, cwd)?.target, command).toBeTruthy();
      }
      for (const command of [
        `cat ${toShellPath(policyPath)}`,
        `find ${toShellPath(safetyNetHome)} -type f -print`,
        `find ${toShellPath(join(safetyNetHome, 'sibling.json'))} -delete`,
        `find ${toShellPath(safetyNetHome)} -maxdepth 0 -exec rm -f /tmp/unrelated-cache \\;`,
      ]) {
        expect(findPolicyMutation('Bash', { command }, cwd), command).toBeNull();
      }
    });
  });

  test('blocks moving the policy file, directory, or an ancestor as a source', () => {
    const home = join(cwd, 'home');
    const safetyNetHome = join(home, '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      const policyPath = getUserPolicyPath();
      for (const command of [
        `mv ${toShellPath(policyPath)} /tmp/policy-copy.json`,
        `mv ${toShellPath(safetyNetHome)} /tmp/disabled-safety-net`,
        `mv ${toShellPath(home)} /tmp/disabled-home`,
        `mv -t /tmp ${toShellPath(safetyNetHome)}`,
        `mv --target-directory=/tmp ${toShellPath(home)}`,
      ]) {
        expect(findPolicyMutation('Bash', { command }, cwd), command).not.toBeNull();
      }
      for (const command of [
        `mv ${toShellPath(join(safetyNetHome, 'rules'))} /tmp/rules`,
        `mv /tmp/rules ${toShellPath(safetyNetHome)}`,
      ]) {
        expect(findPolicyMutation('Bash', { command }, cwd), command).toBeNull();
      }
    });
  });

  test('does not infer advanced shell and filesystem effects', () => {
    const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      for (const command of [
        `cp /tmp/policy.json ${toShellPath(safetyNetHome)}`,
        `cd ${toShellPath(safetyNetHome)} && curl -O https://example.com/policy.json`,
        `python -c 'import os; open(os.environ["CC_SAFETY_NET_HOME"] + "/policy.json", "w")'`,
        `awk 'BEGIN { print "{}" > ENVIRON["CC_SAFETY_NET_HOME"] "/policy.json" }'`,
      ]) {
        expect(findPolicyMutation('Bash', { command }, cwd), command).toBeNull();
      }
    });
  });

  test('allows prose, quoted literal wildcards, and case-distinct siblings', () => {
    const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      const policyPath = getUserPolicyPath();
      expect(
        findPolicyMutation(
          'Bash',
          {
            command: `/opt/reviewer --prompt 'Only ${toShellPath(policyPath)} is protected by policy.'`,
          },
          cwd,
        ),
      ).toBeNull();
      expect(
        findPolicyMutation(
          'Bash',
          { command: `rm "${toShellPath(safetyNetHome)}/polic?.json"` },
          cwd,
        ),
      ).toBeNull();
      if (process.platform !== 'win32') {
        expect(
          findPolicyMutation(
            'Bash',
            { command: `rm ${toShellPath(safetyNetHome)}/POLICY.JSON` },
            cwd,
          ),
        ).toBeNull();
      }
    });
  });

  test('malformed shell fails closed only for a directly extractable policy path', () => {
    const policyPath = getUserPolicyPath();
    expect(findPolicyMutation('Bash', { command: 'rm -rf / ${' }, cwd)).toBeNull();
    expect(
      findPolicyMutation('Bash', { command: `rm ${toShellPath(policyPath)} "` }, cwd)?.target,
    ).toContain('policy.json');
  });

  test('reads a quoted heredoc body as literal data but still blocks header-line writes', () => {
    const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      const policyPath = getUserPolicyPath();
      const shellPolicyPath = toShellPath(policyPath);
      expect(
        findPolicyMutation(
          'Bash',
          { command: `cat <<'EOF'\nit's about ${shellPolicyPath}\nEOF` },
          cwd,
        ),
      ).toBeNull();
      expect(
        findPolicyMutation('Bash', { command: `cat <<'EOF' > ${shellPolicyPath}\nbody\nEOF` }, cwd)
          ?.target,
      ).toContain('policy.json');
      expect(
        findPolicyMutation('Bash', { command: `bash <<'EOF'\nrm ${shellPolicyPath}\nEOF` }, cwd)
          ?.target,
      ).toContain('policy.json');
    });
  });

  test('protects patch metadata while treating patch content as inert', () => {
    const policyPath = getUserPolicyPath();
    for (const field of ['command', 'patch', 'diff', 'input']) {
      const patch = ['*** Begin Patch', `*** Update File: ${policyPath}`, '*** End Patch'].join(
        '\n',
      );
      expect(
        findPolicyMutationWithRoute(
          'apply_patch',
          { [field]: patch },
          { kind: 'patch' },
          { configCwd: cwd, executionCwd: cwd },
        )?.target,
      ).toBe(policyPath);
    }

    const inertPatch = [
      '*** Begin Patch',
      '*** Update File: README.md',
      '@@ -1 +1 @@',
      '-safe',
      `+rm ${policyPath}`,
      `+*** Update File: ${policyPath}`,
      '*** End Patch',
    ].join('\n');
    expect(
      findPolicyMutationWithRoute(
        'apply_patch',
        { patch: inertPatch },
        { kind: 'patch' },
        { configCwd: cwd, executionCwd: cwd },
      ),
    ).toBeNull();
    expect(
      findPolicyMutationWithRoute(
        'apply_patch',
        { patch: `*** Update File: ${getProjectRulesConfigPath(cwd)}` },
        { kind: 'patch' },
        { configCwd: cwd, executionCwd: cwd },
      ),
    ).toBeNull();
  });

  test('allows a command dense with ordinary relative path tokens', () => {
    const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      const command = `echo ${Array.from({ length: 256 }, (_, index) => `d${index}/e${index}/f${index}`).join(' ')}`;
      expect(findPolicyMutation('Bash', { command }, cwd)).toBeNull();
    });
  });

  test('allows a quoted interpreter heredoc with many slash tokens in one word', () => {
    const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      const body = Array.from({ length: 128 }, (_, index) => `t${index}/u${index}/v${index}`).join(
        ' ',
      );
      expect(
        findPolicyMutation('Bash', { command: `python3 - <<'PY'\ns = '''${body}'''\nPY` }, cwd),
      ).toBeNull();
    });
  });

  test('allows prose heredoc bodies re-parsed as shell', () => {
    const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      const body = Array.from({ length: 600 }, (_, index) => `word_${index}`).join(' ');
      expect(
        findPolicyMutation('Bash', { command: `python3 - <<'PY'\n${body}\nPY` }, cwd),
      ).toBeNull();
    });
  });

  test('still blocks a bare-name symlink alias and the literal policy path', () => {
    const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      const policyPath = materializeUserPolicyFile();
      symlinkSync(policyPath, join(cwd, 'innocent'));

      expect(findPolicyMutation('Bash', { command: 'tee innocent' }, cwd)?.target).toBe('innocent');
      expect(
        findPolicyMutation('Bash', { command: `rm ${toShellPath(policyPath)}` }, cwd)?.target,
      ).toBe(toShellPath(policyPath));
    });
  });

  test('still fails closed when a plausible candidate exceeds analysis limits', () => {
    const safetyNetHome = join(cwd, 'home', '.cc-safety-net');
    withEnv({ CC_SAFETY_NET_HOME: safetyNetHome }, () => {
      const prefix = Array.from({ length: 15 }, (_, index) => `m${index}`).join('/');
      const command = `tee ${Array.from(
        { length: 1100 },
        (_, index) => `${prefix}/p${index}/policy.json`,
      ).join(' ')}`;
      expect(() => findPolicyMutation('Bash', { command }, cwd)).toThrow(
        PathCanonicalizationLimitError,
      );
    });
  });

  test('blocks every mutation route against the absent project policy file', () => {
    withEnv({ CC_SAFETY_NET_HOME: join(cwd, 'home', '.cc-safety-net') }, () => {
      const project = join(cwd, 'project');
      mkdirSync(project);
      const projectPolicy = getProjectPolicyPath(project);
      const projectDir = dirname(projectPolicy);
      for (const command of [
        `cat package.json > ${toShellPath(projectPolicy)}`,
        'cat package.json > .cc-safety-net/policy.json',
        `tee ${toShellPath(projectPolicy)}`,
        `sed -i.bak s/a/b/ ${toShellPath(projectPolicy)}`,
        `rm -rf ${toShellPath(projectDir)}`,
        'cd .cc-safety-net && rm -rf ../.cc-safety-net',
        `mv ${toShellPath(projectPolicy)} /tmp/policy-copy.json`,
        `mv ${toShellPath(projectDir)} /tmp/disabled-safety-net`,
        `find ${toShellPath(projectPolicy)} -delete`,
        `find ${toShellPath(projectDir)} -type f -delete`,
        `rm ${toShellPath(projectPolicy)} "`,
      ]) {
        expect(findPolicyMutation('Bash', { command }, project), command).not.toBeNull();
      }

      for (const path of [projectPolicy, '.cc-safety-net/policy.json']) {
        expect(findPolicyMutation('Write', { file_path: path }, project)?.target, path).toBe(path);
      }
      expect(
        findPolicyMutationWithRoute(
          'apply_patch',
          { patch: `*** Update File: ${projectPolicy}` },
          { kind: 'patch' },
          { configCwd: project, executionCwd: project },
        )?.target,
      ).toBe(projectPolicy);
    });
  });

  test('leaves the project root itself to the destructive command rules', () => {
    withEnv({ CC_SAFETY_NET_HOME: join(cwd, 'home', '.cc-safety-net') }, () => {
      const project = join(cwd, 'project');
      mkdirSync(project);
      for (const command of [
        `rm -rf ${toShellPath(project)}`,
        'rm -rf .',
        'find . -delete',
        `mv ${toShellPath(project)} /tmp`,
      ]) {
        expect(findPolicyMutation('Bash', { command }, project), command).toBeNull();
      }
    });
  });

  test('keeps reading the project policy file allowed', () => {
    withEnv({ CC_SAFETY_NET_HOME: join(cwd, 'home', '.cc-safety-net') }, () => {
      const projectPolicy = getProjectPolicyPath(cwd);
      expect(findPolicyMutation('Read', { file_path: projectPolicy }, cwd)).toBeNull();
      for (const command of [
        'cat .cc-safety-net/policy.json',
        `jq '.' ${toShellPath(projectPolicy)}`,
        `ls -la ${toShellPath(dirname(projectPolicy))}`,
      ]) {
        expect(findPolicyMutation('Bash', { command }, cwd), command).toBeNull();
      }
    });
  });

  test('protects the project policy of both the execution and the config project', () => {
    withEnv({ CC_SAFETY_NET_HOME: join(cwd, 'home', '.cc-safety-net') }, () => {
      const executionCwd = join(cwd, 'execution-project');
      const configCwd = join(cwd, 'config-project');
      mkdirSync(executionCwd);
      mkdirSync(configCwd);
      for (const target of [getProjectPolicyPath(executionCwd), getProjectPolicyPath(configCwd)]) {
        expect(
          findPolicyMutationWithRoute(
            'Write',
            { file_path: target },
            { kind: 'path' },
            { configCwd, executionCwd },
          )?.target,
          target,
        ).toBe(target);
      }
      expect(
        findPolicyMutationWithRoute(
          'Write',
          { file_path: getUserPolicyPath() },
          { kind: 'path' },
          { configCwd, executionCwd },
        ),
      ).not.toBeNull();
      expect(
        findPolicyMutationWithRoute(
          'Write',
          { file_path: getProjectPolicyPath(join(cwd, 'unrelated-project')) },
          { kind: 'path' },
          { configCwd, executionCwd },
        ),
      ).toBeNull();
    });
  });

  test('keeps conservative direct-path inspection for unknown tools', () => {
    const policyPath = getUserPolicyPath();
    expect(
      findPolicyMutationWithRoute(
        'mcp__shell__run',
        { command: `rm ${policyPath}` },
        { kind: 'unknown' },
        { configCwd: cwd, executionCwd: cwd },
      )?.target,
    ).toBe(policyPath);
    expect(
      findPolicyMutationWithRoute(
        'unknown_writer',
        { path: policyPath },
        { kind: 'unknown' },
        { configCwd: cwd, executionCwd: cwd },
      )?.target,
    ).toBe(policyPath);
  });
});
