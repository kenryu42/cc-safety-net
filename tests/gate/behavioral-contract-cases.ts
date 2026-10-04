import { basename, dirname, sep } from 'node:path';
import type { BlockIntent } from '@/core/decision';
import type { ShellKind } from '@/core/shell/model';
import type { AnalyzeOptions } from '@/gate/analysis';
import { policySnapshot, type TestPolicyInput } from '../helpers/policy';

export interface BehavioralContractCase {
  name: string;
  command: string;
  options: AnalyzeOptions;
  expected:
    | { kind: 'allow' }
    | {
        kind: 'block';
        ruleId: string;
        intent: BlockIntent | undefined;
        reasonIncludes: string;
        segment?: string;
      };
}

interface OptionValues {
  cwd: string;
  policy?: Omit<TestPolicyInput, 'rules' | 'version'> & Pick<Partial<TestPolicyInput>, 'rules'>;
  shell?: ShellKind;
  strict?: boolean;
  paranoidRm?: boolean;
  paranoidInterpreters?: boolean;
  worktreeMode?: boolean;
  allowTmpdirVar?: boolean;
  envAssignments?: ReadonlyMap<string, string>;
}

function options(values: OptionValues): BehavioralContractCase['options'] {
  return {
    policySnapshot: policySnapshot({
      ...values.policy,
      version: 1,
      rules:
        values.policy?.rules?.map((rule) => ({
          ...rule,
          block_args: [...rule.block_args],
        })) ?? [],
    }),
    cwd: values.cwd,
    shell: values.shell ?? 'posix',
    strict: values.strict ?? false,
    paranoidRm: values.paranoidRm ?? false,
    paranoidInterpreters: values.paranoidInterpreters ?? false,
    worktreeMode: values.worktreeMode ?? false,
    allowTmpdirVar: values.allowTmpdirVar ?? true,
    envAssignments: new Map(values.envAssignments ?? []),
  };
}

export function behavioralContractCases(paths: {
  cwd: string;
  home: string;
  tempRepos: readonly [string, string];
}): BehavioralContractCase[] {
  const tempRepo = paths.tempRepos[0].split(sep).join('/');
  const tempParent = dirname(tempRepo).split(sep).join('/');
  const recursiveCommand = Array.from({ length: 10 }).reduce<string>(
    (command) => `bash -c ${JSON.stringify(command)}`,
    'printf safe',
  );
  const nestedRmRule = {
    name: 'block-recursive-rm',
    command: 'rm',
    block_args: ['-r', '-R', '--recursive'],
    reason: 'Delete files one at a time.',
  };
  const invalidConfig = {
    configFallbackReason: 'invalid policy config: fix the file named in the diagnostic.',
  };
  const functionSubstitutionBlock: BehavioralContractCase['expected'] = {
    kind: 'block',
    ruleId: 'analysis.strict-unparseable',
    intent: 'stop_and_explain',
    reasonIncludes: 'could not be safely analyzed',
  };
  const everydayCommands = [
    'git status',
    'git add -A',
    'git commit -m "fix: adjust parser"',
    'git push',
    'git push --force-with-lease origin main',
    'git pull --rebase',
    'git log --oneline -20',
    'git diff HEAD~1',
    'git checkout -b feature/new-thing',
    'git checkout main',
    'git stash',
    'npm install',
    'npm run build',
    'bun install',
    'pnpm install --frozen-lockfile',
    'npx tsc --noEmit',
    'cargo build --release',
    'rg -n "TODO" src/',
    'grep -rn "TODO" src',
    'find . -name "*.ts" -type f',
    'mkdir -p src/components',
    'mv src/old-name.ts src/new-name.ts',
    'cp -r templates/base src/generated',
    'rm -rf node_modules',
    'rm -rf dist',
    'touch README.md',
    'ls -la src',
    'cat package.json',
    'sed -n "1,40p" src/index.ts',
  ];

  return [
    {
      name: 'allows an ordinary command',
      command: 'printf safe',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a destructive-looking Git near miss',
      command: 'git reset --soft HEAD~1',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks destructive Git reset',
      command: 'git reset --hard',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.reset-hard',
        intent: 'use_alternative',
        reasonIncludes: 'destroys all uncommitted changes',
        segment: 'git reset --hard',
      },
    },
    {
      name: 'blocks the separator-free checkout discard reported in the field',
      command: 'git checkout .',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.checkout-double-dash',
        intent: 'use_alternative',
        reasonIncludes: 'discards uncommitted changes',
        segment: 'git checkout .',
      },
    },
    {
      name: 'blocks a quoted glob checkout that git expands itself',
      command: "git checkout '*.ts'",
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.checkout-double-dash',
        intent: 'use_alternative',
        reasonIncludes: 'discards uncommitted changes',
        segment: 'git checkout *.ts',
      },
    },
    {
      name: 'blocks checkout of a path that exists in the working tree',
      command: 'git checkout src/app.ts',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.checkout-double-dash',
        intent: 'use_alternative',
        reasonIncludes: 'discards uncommitted changes',
        segment: 'git checkout src/app.ts',
      },
    },
    {
      name: 'blocks forced Git removal seen in a field incident',
      command: 'git checkout --orphan test-connection && git rm -rf . --quiet',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.rm-force',
        intent: 'use_alternative',
        reasonIncludes: 'removes tracked files from the working tree',
        segment: 'git rm -rf . --quiet',
      },
    },
    {
      name: 'allows recursive removal inside the workspace',
      command: 'rm -rf build',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks recursive removal outside the workspace',
      command: 'rm -rf ../outside',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-outside-cwd',
        intent: 'scope_down',
        reasonIncludes: 'outside cwd is blocked',
        segment: 'rm -rf ../outside',
      },
    },
    {
      name: 'blocks recursive removal without force outside the workspace',
      command: 'rm -r ../outside',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-outside-cwd',
        intent: 'scope_down',
        reasonIncludes: 'outside cwd is blocked',
        segment: 'rm -r ../outside',
      },
    },
    {
      name: 'blocks destructive Git nested in a shell',
      command: "sh -c 'git reset --hard'",
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.reset-hard',
        intent: 'use_alternative',
        reasonIncludes: 'destroys all uncommitted changes',
      },
    },
    {
      name: 'allows an executable assembled by command substitution at standard safety',
      command: '$(printf r)m -rf /',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks an executable assembled by command substitution at strict safety',
      command: '$(printf r)m -rf /',
      options: options({ cwd: paths.cwd, strict: true }),
      expected: {
        kind: 'block',
        ruleId: 'shell.dynamic-executable',
        intent: 'manual_only',
        reasonIncludes: 'dynamic command name',
      },
    },
    {
      name: 'fails closed on a function substitution, which runs its commands in the current shell',
      command: 'echo ${ rm -rf ~/; }',
      options: options({ cwd: paths.cwd }),
      expected: functionSubstitutionBlock,
    },
    {
      name: 'fails closed on a function substitution inside a nested shell',
      command: "bash -c 'echo ${ rm -rf ~/; }'",
      options: options({ cwd: paths.cwd }),
      expected: functionSubstitutionBlock,
    },
    {
      name: 'fails closed on a harmless function substitution too',
      command: 'echo ${ date; }',
      options: options({ cwd: paths.cwd }),
      expected: functionSubstitutionBlock,
    },
    {
      name: 'fails closed on a function substitution glued to a variable',
      command: 'echo $x${ rm -rf ~/; }',
      options: options({ cwd: paths.cwd }),
      expected: functionSubstitutionBlock,
    },
    {
      name: 'fails closed on a function substitution after a depth-limited heredoc line',
      command: `: <<EOF\n${'$(( '.repeat(64)}0${' ))'.repeat(64)}\n\${ cd ~; }\nEOF\nrm -rf *`,
      options: options({ cwd: paths.cwd }),
      expected: functionSubstitutionBlock,
    },
    {
      name: 'blocks a home removal in a command substitution glued to a variable',
      command: 'echo "$x$(rm -rf ~/)"',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'targeting root or home',
      },
    },
    {
      name: 'blocks a home removal in a parameter-expansion operand',
      command: 'echo ${x:-$(rm -rf ~/)}',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'targeting root or home',
      },
    },
    {
      name: 'blocks a home removal inside double-quoted arithmetic',
      command: 'echo "$(( $(rm -rf ~/) ))"',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'targeting root or home',
      },
    },
    {
      name: 'fails closed on a backtick body whose escaped dollar hides a substitution',
      command: 'echo `echo "\\$(rm -rf ~/)"`',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'analysis.strict-unparseable',
        intent: 'stop_and_explain',
        reasonIncludes: 'could not be safely analyzed',
      },
    },
    {
      name: 'fails closed on a backtick body whose doubled backslash unquotes a substitution',
      command: "echo `echo \\\\'$(rm -rf ~/)\\\\'`",
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'analysis.strict-unparseable',
        intent: 'stop_and_explain',
        reasonIncludes: 'could not be safely analyzed',
      },
    },
    {
      name: 'fails closed on a backtick body whose doubled backslash reaches a quote across a line continuation',
      command: "echo `echo \\\\\\\n'$(rm -rf ~/)\\\\\\\n'`",
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'analysis.strict-unparseable',
        intent: 'stop_and_explain',
        reasonIncludes: 'could not be safely analyzed',
      },
    },
    {
      name: 'allows a nested parameter expansion',
      command: 'echo ${x:-${y}}',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a single-quoted substitution text in a default-value operand',
      command: "echo ${x:-'$(rm -rf ~/)'}",
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a single-quoted brace in a default-value operand',
      command: "echo ${prefix:-'${'}",
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows an apostrophe inside a double-quoted default-value operand',
      command: 'echo ${message:-"don\'t panic"}',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a brace inside a substitution in a double-quoted default-value operand',
      command: 'value="${value:-$(awk \'{print $1}\' data.txt)}"; echo "$value"',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a single-quoted pattern in a double-quoted prefix removal',
      command: 'echo "${text#\'$(\'}"',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a single-quoted brace in a double-quoted suffix removal',
      command: 'echo "${path%\'}\'}"',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a single-quoted pattern in a double-quoted array prefix removal',
      command: "printf '%s\\n' \"${items[@]#'$('}\"",
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a single-quoted pattern after a variable array subscript',
      command: "printf '%s\\n' \"${items[$i]#'$('}\"",
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows an ANSI-C string with an escaped quote in a default-value operand',
      command: "message=${message:-$'can\\'t open file'}; echo \"$message\"",
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows an ANSI-C string inside a substitution in a default-value operand',
      command: "message=${message:-$(printf '%s' $'can\\'t open file')}; echo \"$message\"",
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows an ANSI-C string inside a command substitution',
      command: "echo $(printf '%s' $'can\\'t open file')",
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a double-quoted substitution nested in a default-value operand',
      command: 'NODE_DIR=${NODE_DIR:-$(dirname "$(command -v node)")}; echo "$NODE_DIR"',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a single-quoted pattern in a double-quoted substitution',
      command: "printf '%s\\n' \"${text//'$('}\"",
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a home removal in an array subscript before a pattern operator',
      command: 'echo "${arr[$(rm -rf ~/)]#x}"',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'targeting root or home',
      },
    },
    {
      name: 'blocks a home removal quoted inside a nested double-quoted operand',
      command: 'echo ${x:-"${y:-"\'$(rm -rf ~/)\'"}"}',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'targeting root or home',
      },
    },
    {
      name: 'blocks a home removal single-quoted inside a double-quoted operand',
      command: 'echo ${x:-"\'$(rm -rf ~/)\'"}',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'targeting root or home',
      },
    },
    {
      name: 'allows a harmless generator in a default-value operand',
      command: 'EDITOR=${EDITOR:-$(command -v vim)}; echo $EDITOR',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows harmless double-quoted arithmetic over a substitution',
      command: 'echo "$(( $(date +%s) - 60 ))"',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks find delete',
      command: 'find . -delete',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'find.delete',
        intent: 'scope_down',
        reasonIncludes: 'Use -print first',
        segment: 'find . -delete',
      },
    },
    {
      name: 'allows find delete of a workspace subdirectory',
      command: 'find build -type f -delete',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks find delete of a workspace subdirectory under paranoid rm',
      command: 'find build -type f -delete',
      options: options({ cwd: paths.cwd, paranoidRm: true }),
      expected: {
        kind: 'block',
        ruleId: 'find.delete',
        intent: 'scope_down',
        reasonIncludes: 'Use -print first',
        segment: 'find build -type f -delete',
      },
    },
    {
      name: 'blocks find delete of a starting point that climbs out of the workspace',
      command: 'find build/../.. -delete',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'find.delete',
        intent: 'scope_down',
        reasonIncludes: 'Use -print first',
        segment: 'find build/../.. -delete',
      },
    },
    {
      name: 'blocks a destructive command inside interpreter code',
      command: `python -c "import os; os.system('rm -rf /')"`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'interpreter.dangerous-command',
        intent: 'use_alternative',
        reasonIncludes: 'Interpreter code contains a dangerous command',
      },
    },
    {
      name: 'blocks xargs recursive removal with dynamic input',
      command: 'printf / | xargs rm -rf',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'xargs.rm-recursive-force-dynamic',
        intent: 'scope_down',
        reasonIncludes: 'dynamic input is dangerous',
      },
    },
    {
      name: 'blocks recursive removal from the platform home directory',
      command: 'rm -rf contract-build',
      options: options({ cwd: paths.home }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-home-cwd',
        intent: 'scope_down',
        reasonIncludes: 'rm -rf in home directory',
        segment: 'rm -rf contract-build',
      },
    },
    {
      name: 'does not apply PowerShell removal rules in posix mode',
      command: 'Remove-Item . -Recurse -Force',
      options: options({ cwd: paths.cwd, shell: 'posix' }),
      expected: { kind: 'allow' },
    },
    {
      name: 'applies PowerShell removal rules in powershell mode',
      command: 'Remove-Item . -Recurse -Force',
      options: options({ cwd: paths.cwd, shell: 'powershell' }),
      expected: {
        kind: 'block',
        ruleId: 'powershell.remove-item-recursive-force-cwd-self',
        intent: 'scope_down',
        reasonIncludes: 'PowerShell Remove-Item -Recurse -Force',
        segment: 'Remove-Item . -Recurse -Force',
      },
    },
    {
      name: 'detects explicit PowerShell removal in auto mode',
      command: 'Remove-Item . -Recurse -Force',
      options: options({ cwd: paths.cwd, shell: 'auto' }),
      expected: {
        kind: 'block',
        ruleId: 'powershell.remove-item-recursive-force-cwd-self',
        intent: 'scope_down',
        reasonIncludes: 'PowerShell Remove-Item -Recurse -Force',
        segment: 'Remove-Item . -Recurse -Force',
      },
    },
    {
      name: 'applies a custom rule',
      command: 'docker system prune',
      options: options({
        cwd: paths.cwd,
        policy: {
          rules: [
            {
              name: 'block-docker-prune',
              command: 'docker',
              subcommand: 'system',
              block_args: ['prune'],
              reason: 'Use targeted Docker cleanup.',
              intent: 'use_alternative',
            },
          ],
        },
      }),
      expected: {
        kind: 'block',
        ruleId: 'custom.block-docker-prune',
        intent: 'use_alternative',
        reasonIncludes: '[block-docker-prune] Use targeted Docker cleanup.',
        segment: 'docker system prune',
      },
    },
    ...[
      { command: "bash -c 'rm -r ./tmpdir'", segment: 'bash -c rm -r ./tmpdir' },
      { command: "eval 'rm -r ./tmpdir'", segment: 'eval rm -r ./tmpdir' },
    ].map((row) => ({
      name: `applies a custom rule for a built-in-analyzed command nested in ${row.command}`,
      command: row.command,
      options: options({ cwd: paths.cwd, policy: { rules: [nestedRmRule] } }),
      expected: {
        kind: 'block' as const,
        ruleId: 'custom.block-recursive-rm',
        intent: 'manual_only' as const,
        reasonIncludes: '[block-recursive-rm] Delete files one at a time.',
        segment: row.segment,
      },
    })),
    {
      name: 'allows a nested built-in-analyzed command the custom rule does not name',
      command: "bash -c 'rm ./tmpfile'",
      options: options({ cwd: paths.cwd, policy: { rules: [nestedRmRule] } }),
      expected: { kind: 'allow' },
    },
    {
      name: 'applies a custom Git rule nested in a shell wrapper',
      command: "bash -c 'git commit --amend'",
      options: options({
        cwd: paths.cwd,
        policy: {
          rules: [
            {
              name: 'block-amend',
              command: 'git',
              subcommand: 'commit',
              block_args: ['--amend'],
              reason: 'Create a new commit instead.',
            },
          ],
        },
      }),
      expected: {
        kind: 'block',
        ruleId: 'custom.block-amend',
        intent: 'manual_only',
        reasonIncludes: '[block-amend] Create a new commit instead.',
        segment: 'bash -c git commit --amend',
      },
    },
    ...['/usr/bin/env git reset --hard', 'sudo /usr/bin/env git reset --hard'].map((command) => ({
      name: `unwraps an absolute-path env in ${command}`,
      command,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block' as const,
        ruleId: 'git.reset-hard',
        intent: 'use_alternative' as const,
        reasonIncludes: 'destroys all uncommitted changes',
        segment: command,
      },
    })),
    {
      name: 'unwraps an absolute-path env before a recursive delete',
      command: '/usr/bin/env rm -rf ../outside',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-outside-cwd',
        intent: 'scope_down',
        reasonIncludes: 'outside cwd is blocked',
        segment: '/usr/bin/env rm -rf ../outside',
      },
    },
    {
      name: 'allows an absolute-path env running a safe command',
      command: '/usr/bin/env -- git status',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'keeps unrelated built-in protection active when one rule is disabled',
      command: 'git reset --hard && git clean -f',
      options: options({
        cwd: paths.cwd,
        policy: { destructiveCommandRuleOverrides: { 'git.reset-hard': 'off' } },
      }),
      expected: {
        kind: 'block',
        ruleId: 'git.clean-force',
        intent: 'use_alternative',
        reasonIncludes: 'removes untracked files permanently',
        segment: 'git clean -f',
      },
    },
    {
      name: 'allows malformed safe input at standard safety',
      command: "echo 'unterminated",
      options: options({ cwd: paths.cwd, strict: false }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks malformed safe input at strict safety',
      command: "echo 'unterminated",
      options: options({ cwd: paths.cwd, strict: true }),
      expected: {
        kind: 'block',
        ruleId: 'analysis.strict-unparseable',
        intent: 'stop_and_explain',
        reasonIncludes: 'could not be safely analyzed (strict mode)',
        segment: "echo 'unterminated",
      },
    },
    {
      name: 'uses a destructive heuristic for malformed dangerous input',
      command: "git reset --hard 'unterminated",
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'raw-text.dangerous-command',
        intent: 'stop_and_explain',
        reasonIncludes: 'Unparseable command text contains a destructive pattern',
        segment: "git reset --hard 'unterminated",
      },
    },
    {
      name: 'blocks analysis that reaches the recursion limit',
      command: recursiveCommand,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'analysis.recursion-limit',
        intent: 'stop_and_explain',
        reasonIncludes: 'exceeds maximum recursion depth',
      },
    },
    {
      name: 'allows a lease-guarded force push',
      command: 'git push --force-with-lease origin main',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks an unguarded force push',
      command: 'git push --force origin main',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.push-force',
        intent: 'use_alternative',
        reasonIncludes: 'destroys remote history',
        segment: 'git push --force origin main',
      },
    },
    {
      name: 'allows a read-only stash verb',
      command: 'git stash list',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks dropping a stash',
      command: 'git stash drop',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.stash-drop',
        intent: 'use_alternative',
        reasonIncludes: 'permanently deletes stashed changes',
      },
    },
    {
      name: 'allows a dry-run clean',
      command: 'git clean -n',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows find without a destructive action',
      command: 'find . -name x -print',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks find exec with recursive removal',
      command: 'find . -exec rm -rf {} +',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'find.exec-rm-recursive-force',
        intent: 'scope_down',
        reasonIncludes: 'find -exec rm -rf is dangerous',
      },
    },
    {
      name: 'allows xargs with a non-destructive child',
      command: 'printf x | xargs echo',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks xargs feeding dynamic input into a shell at strict safety',
      command: 'printf x | xargs -I{} sh -c "echo {}"',
      options: options({ cwd: paths.cwd, strict: true }),
      expected: {
        kind: 'block',
        ruleId: 'xargs.shell-dynamic',
        intent: 'scope_down',
        reasonIncludes: 'arbitrary executable command source',
      },
    },
    {
      name: 'allows parallel with a non-destructive child',
      command: 'parallel echo ::: a b',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks parallel expanding a root target into recursive removal',
      command: 'parallel rm -rf {1} ::: /',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'targeting root or home',
        segment: 'parallel rm -rf {1} ::: /',
      },
    },
    {
      name: 'allows a harmless interpreter one-liner at standard safety',
      command: 'python -c "print(1)"',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a harmless interpreter one-liner under paranoid interpreters',
      command: 'python -c "print(1)"',
      options: options({ cwd: paths.cwd, paranoidInterpreters: true }),
      expected: {
        kind: 'block',
        ruleId: 'interpreter.one-liner-paranoid',
        intent: 'use_alternative',
        reasonIncludes: 'Interpreter one-liners are blocked',
      },
    },
    {
      name: 'allows eval of a harmless literal',
      command: 'eval "printf safe"',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks eval of a destructive literal',
      command: 'eval "rm -rf /"',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'targeting root or home',
        segment: 'eval rm -rf /',
      },
    },
    ...[
      `sh -c 'rm -rf "$1"' _ /`,
      `bash -c 'rm -rf -- "$@"' _ dist /`,
      `sh -c 'rm -rf $1' _ 'dist /'`,
    ].map((command) => ({
      name: `blocks a shell -c body whose literal positional argument is root: ${command}`,
      command,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block' as const,
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop' as const,
        reasonIncludes: 'targeting root or home',
      },
    })),
    {
      name: 'allows a shell -c body whose literal positional argument is an ordinary directory',
      command: `sh -c 'rm -rf "$1"' _ dist`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks piping a remote script into a shell',
      command: 'curl http://x | bash',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'analysis.dynamic-shell-source',
        intent: 'stop_and_explain',
        reasonIncludes: 'shell execution source cannot be verified',
        segment: 'bash',
      },
    },
    {
      name: 'allows a quoted heredoc that only mentions a destructive command',
      command: "cat <<'EOF'\nrm -rf ~\nEOF",
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows an unquoted heredoc whose only expansion is a variable at standard safety',
      command: 'cat <<EOF\nrm -rf ~ $target\nEOF',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks an unquoted heredoc script that a later command executes',
      command: 'cat > cleanup.sh <<EOF\nrm -rf ~ $target\nEOF\nbash cleanup.sh',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'rm -rf',
      },
    },
    {
      name: 'allows a python heredoc run through uv that only mentions a destructive command',
      command: 'uv run python - <<\'EOF\'\nx = "rm -rf build"\nprint(x)\nEOF',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a python heredoc run through uv that executes a destructive command',
      command: 'uv run python - <<\'EOF\'\nimport os\nos.system("rm -rf ~")\nEOF',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'interpreter.dangerous-command',
        intent: 'use_alternative',
        reasonIncludes: 'Interpreter code contains a dangerous command',
      },
    },
    {
      name: 'allows a python stdin script with arguments that only mentions a destructive command',
      command: 'python3 - in.ts out.ts <<\'PY\'\nimport sys\nprint("rm -rf /", sys.argv)\nPY',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows python code that imports subprocess but only prints a destructive command',
      command: 'python3 - <<\'EOF\'\nimport subprocess\nprint("rm -rf /")\nEOF',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks python code that only prints a destructive command at strict safety',
      command: 'python3 - <<\'EOF\'\nimport subprocess\nprint("rm -rf /")\nEOF',
      options: options({ cwd: paths.cwd, strict: true }),
      expected: {
        kind: 'block',
        ruleId: 'analysis.unsupported-heredoc',
        intent: 'stop_and_explain',
        reasonIncludes: 'heredoc',
      },
    },
    {
      name: 'allows an inline harness that serializes a destructive command as data',
      command:
        "python3 -c \"import json, subprocess\nprint(json.dumps({'command': 'git reset --hard'}))\"",
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks an inline command handed to subprocess with a shell',
      command: 'python3 -c "import subprocess; subprocess.run(\'git reset --hard\', shell=True)"',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'interpreter.dangerous-command',
        intent: 'use_alternative',
        reasonIncludes: 'Interpreter code contains a dangerous command',
      },
    },
    {
      name: 'blocks a brace-group heredoc piped into a shell',
      command: "{ cat <<'EOF'\nrm -rf ~\nEOF\n} | sh",
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'raw-text.dangerous-command',
        intent: 'stop_and_explain',
        reasonIncludes: 'Unparseable command text',
      },
    },
    {
      name: 'allows an xargs shell body that only reads and prints each input',
      command: 'grep -rl TODO src | xargs -I{} sh -c \'echo "--- {}"; head -3 {}\'',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks an xargs shell body that deletes each input',
      command: "find . -name '*.log' | xargs -I{} sh -c 'rm -rf {}'",
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'xargs.shell-dynamic',
        intent: 'scope_down',
        reasonIncludes: 'xargs dynamic input',
      },
    },
    {
      name: 'blocks an xargs shell body that runs each input as a command',
      command: "cat jobs.txt | xargs -I{} sh -c '{} --verbose'",
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'xargs.shell-dynamic',
        intent: 'scope_down',
        reasonIncludes: 'xargs dynamic input',
      },
    },
    {
      name: 'allows eval of an unquoted literal local generator',
      command: 'eval $(opam env) && opam update',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a paren-less ruby spawn of a destructive command',
      command: 'ruby -e \'spawn "rm -rf /"\'',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'interpreter.dangerous-command',
        intent: 'use_alternative',
        reasonIncludes: 'Interpreter code contains a dangerous command',
      },
    },
    {
      name: 'blocks a spaced dotted subprocess call of a destructive command',
      command: 'python3 -c \'import subprocess; subprocess . run("rm -rf /", shell=True)\'',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'interpreter.dangerous-command',
        intent: 'use_alternative',
        reasonIncludes: 'Interpreter code contains a dangerous command',
      },
    },
    ...['{ {}; }', '! {}', 'time {}', 'command {}', 'VAR=1 {}', 'case y in x) {};; esac'].map(
      (body) => ({
        name: `blocks xargs input in command position: ${body}`,
        command: `printf x | xargs -I{} sh -c '${body}'`,
        options: options({ cwd: paths.cwd }),
        expected: {
          kind: 'block' as const,
          ruleId: 'xargs.shell-dynamic',
          intent: 'scope_down' as const,
          reasonIncludes: 'xargs dynamic input',
        },
      }),
    ),
    {
      name: 'blocks a script written from a redirected group heredoc and then executed',
      command: "{ cat <<'EOF'\nrm -rf ~\nEOF\n} > cleanup.sh\nbash cleanup.sh",
      options: options({ cwd: paths.cwd, strict: true }),
      expected: {
        kind: 'block',
        ruleId: 'analysis.unsupported-heredoc',
        intent: 'stop_and_explain',
        reasonIncludes: 'heredoc',
      },
    },
    {
      name: 'blocks an unquoted heredoc carrying a destructive command and a live expansion at strict safety',
      command: 'cat <<EOF\nrm -rf ~ $target\nEOF',
      options: options({ cwd: paths.cwd, strict: true }),
      expected: {
        kind: 'block',
        ruleId: 'analysis.unsupported-heredoc',
        intent: 'stop_and_explain',
        reasonIncludes: 'Unquoted heredoc',
      },
    },
    {
      name: 'blocks a live expansion behind a CR-suffixed heredoc terminator at standard safety',
      command: "cat <<EOF\nEOF\r\ncat <<'EOF'\n$(git push --force)\nEOF",
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.push-force',
        intent: 'use_alternative',
        reasonIncludes: 'destroys remote history',
        segment: 'git push --force',
      },
    },
    {
      name: 'blocks a live expansion behind a CR-suffixed heredoc terminator at strict safety',
      command: "cat <<EOF\nEOF\r\ncat <<'EOF'\n$(git push --force)\nEOF",
      options: options({ cwd: paths.cwd, strict: true }),
      expected: {
        kind: 'block',
        ruleId: 'git.push-force',
        intent: 'use_alternative',
        reasonIncludes: 'destroys remote history',
        segment: 'git push --force',
      },
    },
    {
      name: 'allows a benign CRLF heredoc at standard safety',
      command: 'cat <<EOF\r\nhello\r\nEOF\r\n',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a benign CRLF heredoc at strict safety because its delimiter keeps the CR',
      command: 'cat <<EOF\r\nhello\r\nEOF\r\n',
      options: options({ cwd: paths.cwd, strict: true }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a live expansion inside a CRLF heredoc at standard safety',
      command: 'cat <<EOF\r\n$(git switch -f main)\r\nEOF\r\n',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.switch-force',
        intent: 'use_alternative',
        reasonIncludes: 'discards uncommitted changes',
        segment: 'git switch -f main',
      },
    },
    {
      name: 'blocks a live expansion inside a CRLF heredoc at strict safety',
      command: 'cat <<EOF\r\n$(git switch -f main)\r\nEOF\r\n',
      options: options({ cwd: paths.cwd, strict: true }),
      expected: {
        kind: 'block',
        ruleId: 'git.switch-force',
        intent: 'use_alternative',
        reasonIncludes: 'discards uncommitted changes',
        segment: 'git switch -f main',
      },
    },
    {
      name: 'allows dd writing to a regular file',
      command: 'dd if=/dev/zero of=disk.img bs=1M',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks dd writing to a device',
      command: 'dd if=/dev/zero of=/dev/sda bs=1M',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'dd.device-write',
        intent: 'manual_only',
        reasonIncludes: 'can destroy a disk or partition',
      },
    },
    {
      name: 'allows awk running a literal command',
      command: `awk 'BEGIN { system("ls") }'`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks awk running a dynamic command',
      command: `awk 'BEGIN { system(cmd) }'`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'awk.system-dynamic',
        intent: 'stop_and_explain',
        reasonIncludes: 'cannot be safely analyzed',
      },
    },
    {
      name: 'allows a safe command under sudo',
      command: 'sudo git status',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a destructive command under sudo with the full segment',
      command: 'sudo git reset --hard',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.reset-hard',
        intent: 'use_alternative',
        reasonIncludes: 'destroys all uncommitted changes',
        segment: 'sudo git reset --hard',
      },
    },
    {
      name: 'allows a quoted reference to a destructive assignment',
      command: `W='rm -rf ~'; echo "$W"`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks executing a destructive assignment',
      command: `W='rm -rf ~'; $W`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'raw-text.dangerous-command',
        intent: 'stop_and_explain',
        reasonIncludes: 'contains a destructive pattern',
        segment: 'W=rm -rf ~',
      },
    },
    {
      name: 'allows recursive removal of a trusted TMPDIR target under paranoid rm',
      command: 'rm -rf "$TMPDIR/build"',
      options: options({ cwd: paths.cwd, paranoidRm: true }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks workspace recursive removal under paranoid rm',
      command: 'rm -rf build',
      options: options({ cwd: paths.cwd, paranoidRm: true }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-paranoid',
        intent: 'scope_down',
        reasonIncludes: 'blocked by the active safety policy',
      },
    },
    {
      name: 'allows PowerShell removal of an in-workspace target',
      command: 'Remove-Item build -Recurse -Force',
      options: options({ cwd: paths.cwd, shell: 'powershell' }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks PowerShell removal outside the workspace',
      command: 'Remove-Item ../outside -Recurse -Force',
      options: options({ cwd: paths.cwd, shell: 'powershell' }),
      expected: {
        kind: 'block',
        ruleId: 'powershell.remove-item-recursive-force-outside-cwd',
        intent: 'scope_down',
        reasonIncludes: 'outside cwd is blocked',
      },
    },
    {
      name: 'allows an ordinary command while a fallback configuration is enforced',
      command: 'printf safe',
      options: options({ cwd: paths.cwd, policy: invalidConfig }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a Git discard in a temp-root repository reached by a literal cd',
      command: `cd ${tempRepo}; git reset --hard`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a Git discard in a temp-root repository reached through a tracked variable',
      command: `R=${tempRepo}; cd $R; git reset --hard HEAD~1`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a Git discard in every temp-root repository a literal for list visits',
      command: `for c in ${basename(tempRepo)} ${basename(paths.tempRepos[1])}; do R=${tempParent}/$c; cd $R; git clean -fdx; done`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a Git discard when the workspace is the temp-root repository itself',
      command: 'git reset --hard',
      options: options({ cwd: paths.tempRepos[0] }),
      expected: {
        kind: 'block',
        ruleId: 'git.reset-hard',
        intent: 'use_alternative',
        reasonIncludes: 'destroys all uncommitted changes',
        segment: 'git reset --hard',
      },
    },
    {
      name: 'blocks a force push from a temp-root repository',
      command: `cd ${tempRepo}; git push --force origin main`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.push-force',
        intent: 'use_alternative',
        reasonIncludes: 'destroys remote history',
        segment: 'git push --force origin main',
      },
    },
    {
      name: 'blocks a Git discard after a cd whose variable is not literal',
      command: 'R=$(pwd); cd $R; git reset --hard',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.reset-hard',
        intent: 'use_alternative',
        reasonIncludes: 'destroys all uncommitted changes',
        segment: 'git reset --hard',
      },
    },
    {
      name: 'blocks a Git discard aimed at a temp-root repository through GIT_DIR',
      command: `GIT_DIR=${tempRepo}/.git git reset --hard`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.reset-hard',
        intent: 'use_alternative',
        reasonIncludes: 'destroys all uncommitted changes',
      },
    },
    {
      name: 'blocks a Git discard when the for list exceeds the binding cap',
      command: `for c in a b c d e f g h i; do R=${tempParent}/$c; cd $R; git reset --hard; done`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.reset-hard',
        intent: 'use_alternative',
        reasonIncludes: 'destroys all uncommitted changes',
        segment: 'git reset --hard',
      },
    },
    {
      name: 'allows a forced worktree removal whose operand is a temp-root path unrelated to the workspace',
      command: `git worktree remove --force ${tempRepo}`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a forced worktree removal whose operand is a tracked variable naming a temp-root path',
      command: `S=${tempParent}; git worktree remove -f $S/${basename(tempRepo)}`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a forced worktree removal whose operand contains the workspace',
      command: `git worktree remove --force ${tempParent}`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.worktree-remove-force',
        intent: 'use_alternative',
        reasonIncludes: 'can delete uncommitted changes',
        segment: `git worktree remove --force ${tempParent}`,
      },
    },
    {
      name: 'allows a shell script whose path expands from a literal assignment',
      command: `S=${tempParent}; bash $S/make-fixture.sh`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a heredoc script written and run through a literal-assignment path',
      command: `S=${tempParent}; cat > $S/cleanup.sh <<'EOF'\nrm -rf ~\nEOF\nbash $S/cleanup.sh`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'rm -rf',
      },
    },
    {
      name: 'blocks a shell script whose path expands from an unbound variable',
      command: 'bash $S/make-fixture.sh',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'analysis.dynamic-shell-source',
        intent: 'stop_and_explain',
        reasonIncludes: 'shell execution source cannot be verified',
      },
    },
    {
      name: 'allows a shell script whose assignment starts an && chain that crosses a pipeline',
      command: `S=${tempParent} && git status | head -1 && bash $S/make-fixture.sh`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a Git discard in a temp-root repository an && chain reaches across a pipeline',
      command: `cd ${tempRepo} && git status | head -1 && git reset --hard`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a delete that a cd into a missing directory reaches through an || pipeline',
      command: `cd ${tempParent}/missing || printf retry | cat; rm -rf build`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-outside-cwd',
        intent: 'scope_down',
        reasonIncludes: 'rm -rf outside cwd is blocked',
        segment: 'rm -rf build',
      },
    },
    {
      name: 'allows a find delete a later line runs in the directory an && chain entered',
      command: `cd ${tempRepo} && printf ready\nfind . -maxdepth 1 -name 'still-*.jpg' -delete`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a Git discard a later line runs after an && chain whose cd target is missing',
      command: `cd ${tempParent}/missing && printf ready\ngit reset --hard`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.reset-hard',
        intent: 'use_alternative',
        reasonIncludes: 'destroys all uncommitted changes',
        segment: 'git reset --hard',
      },
    },
    {
      name: 'allows a find delete from the directory a tracked cd entered under a temp root',
      command: `cd ${tempRepo} && find . -maxdepth 1 -name 'still-*.jpg' -delete`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a find delete from a tracked cd into a temp directory holding the workspace',
      command: `cd ${tempParent} && find . -name '*.jpg' -delete`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'find.delete',
        intent: 'scope_down',
        reasonIncludes: 'Use -print first',
        segment: 'find . -name *.jpg -delete',
      },
    },
    {
      name: 'blocks a find delete from a workspace subdirectory a tracked cd entered',
      command: 'cd src && find . -delete',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'find.delete',
        intent: 'scope_down',
        reasonIncludes: 'Use -print first',
        segment: 'find . -delete',
      },
    },
    {
      name: 'blocks a find delete from a temp-root workspace without a cd',
      command: "find . -name '*.jpg' -delete",
      options: options({ cwd: paths.tempRepos[0] }),
      expected: {
        kind: 'block',
        ruleId: 'find.delete',
        intent: 'scope_down',
        reasonIncludes: 'Use -print first',
        segment: 'find . -name *.jpg -delete',
      },
    },
    {
      name: 'allows a delete inside a temp directory that an earlier mkdir -p created and cd entered',
      command: `S=${tempParent}; mkdir -p $S/fresh/src && cd $S/fresh && rm -rf src/folder.ts`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a delete after a cd into a directory a parentless mkdir cannot create',
      command: `mkdir ${tempParent}/absent/leaf; cd ${tempParent}/absent/leaf; rm -rf build`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-outside-cwd',
        intent: 'scope_down',
        reasonIncludes: 'rm -rf outside cwd is blocked',
        segment: 'rm -rf build',
      },
    },
    {
      name: 'blocks a delete after a cd into a directory whose mkdir may have failed',
      command: `mkdir -p ${tempParent}/fresh || true; cd ${tempParent}/fresh; rm -rf build`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-outside-cwd',
        intent: 'scope_down',
        reasonIncludes: 'rm -rf outside cwd is blocked',
        segment: 'rm -rf build',
      },
    },
    {
      name: 'blocks deleting the workspace from a directory an earlier mkdir -p created',
      command: `mkdir -p ${tempParent}/fresh && cd ${tempParent}/fresh && rm -rf ../${basename(paths.cwd)}`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-cwd-self',
        intent: 'scope_down',
        reasonIncludes: 'rm -rf outside cwd is blocked',
        segment: `rm -rf ../${basename(paths.cwd)}`,
      },
    },
    {
      name: 'allows a Git discard in a temp-root repository named by a literal-assignment git -C',
      command: `S=${tempRepo}; git -C $S checkout -- README.md`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a Git discard after a cd through an unbound variable',
      command: `cd ${tempParent}/$c; git reset --hard`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'git.reset-hard',
        intent: 'use_alternative',
        reasonIncludes: 'destroys all uncommitted changes',
        segment: 'git reset --hard',
      },
    },
    ...everydayCommands.flatMap((command): BehavioralContractCase[] => [
      {
        name: `allows an everyday command at standard safety: ${command}`,
        command,
        options: options({ cwd: paths.cwd }),
        expected: { kind: 'allow' },
      },
      {
        name: `allows an everyday command at strict safety: ${command}`,
        command,
        options: options({ cwd: paths.cwd, strict: true }),
        expected: { kind: 'allow' },
      },
    ]),
  ];
}
