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
  const unparseableBlock: BehavioralContractCase['expected'] = {
    kind: 'block',
    ruleId: 'analysis.strict-unparseable',
    intent: 'stop_and_explain',
    reasonIncludes: 'could not be safely analyzed',
  };
  const atStandardAndStrict = (
    rows: [string, string, BehavioralContractCase['expected']][],
    values: OptionValues,
  ) =>
    [false, true].flatMap((strict) =>
      rows.map(([name, command, expected]) => ({
        name: `${name}${strict ? ' at strict safety' : ''}`,
        command,
        options: options({ ...values, strict }),
        expected,
      })),
    );
  const homeRemovalBlock: BehavioralContractCase['expected'] = {
    kind: 'block',
    ruleId: 'rm.recursive-force-root-or-home',
    intent: 'hard_stop',
    reasonIncludes: 'targeting root or home',
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
  const cmdRootRemovalBlock: BehavioralContractCase['expected'] = {
    kind: 'block',
    ruleId: 'cmd.recursive-delete-root-or-home',
    intent: 'hard_stop',
    reasonIncludes: 'targeting root or home',
  };
  const cmdOutsideRemovalBlock: BehavioralContractCase['expected'] = {
    kind: 'block',
    ruleId: 'cmd.recursive-delete-outside-cwd',
    intent: 'scope_down',
    reasonIncludes: 'outside cwd is blocked',
  };
  const unverifiableShellSourceBlock: BehavioralContractCase['expected'] = {
    kind: 'block',
    ruleId: 'analysis.dynamic-shell-source',
    intent: 'stop_and_explain',
    reasonIncludes: 'shell execution source cannot be verified',
  };
  const cmdEscapedQuoteBlock: BehavioralContractCase['expected'] = {
    kind: 'block',
    ruleId: 'cmd.recursive-delete-escaped-quote',
    intent: 'hard_stop',
    reasonIncludes: 'root of the drive',
  };
  const inBothDialects = (
    rows: readonly {
      name: string;
      powershell: string;
      posix: string;
      expected: BehavioralContractCase['expected'];
    }[],
  ) =>
    rows.flatMap((row): BehavioralContractCase[] =>
      (['powershell', 'posix'] as const).map((shell) => ({
        name: `${row.name} (${shell})`,
        command: row[shell],
        options: options({ cwd: paths.cwd, shell }),
        expected: row.expected,
      })),
    );
  const cmdWrapperCases = inBothDialects([
    {
      name: 'blocks the field incident whose escaped quotes turned a worktree cleanup into a drive wipe',
      powershell: String.raw`cmd /c "rmdir /s /q \"\\?\C:\Users\cookm\Desktop\CLAUDE CODE\heloc-calculator\.claude\worktrees\agent-a27e08c1bfbd7f8c9\""`,
      posix: String.raw`cmd /c "rmdir /s /q \"\\?\C:\Users\cookm\Desktop\CLAUDE CODE\heloc-calculator\.claude\worktrees\agent-a27e08c1bfbd7f8c9\""`,
      expected: cmdEscapedQuoteBlock,
    },
    {
      name: 'blocks a cmd recursive delete of the drive root',
      powershell: 'cmd /c rmdir /s /q \\',
      posix: String.raw`cmd /c rmdir /s /q '\'`,
      expected: cmdRootRemovalBlock,
    },
    {
      name: 'blocks a quoted cmd recursive delete of a drive',
      powershell: String.raw`cmd /c "rmdir /s /q C:\"`,
      posix: String.raw`cmd /c "rmdir /s /q C:\\"`,
      expected: cmdRootRemovalBlock,
    },
    {
      name: 'blocks a cmd.exe rd /s of a drive',
      powershell: String.raw`cmd.exe /c "rd /s /q C:\"`,
      posix: String.raw`cmd.exe /c "rd /s /q C:\\"`,
      expected: cmdRootRemovalBlock,
    },
    {
      name: 'blocks a cmd recursive delete with uppercase and joined switches',
      powershell: String.raw`CMD.EXE /D /S /C "RMDIR /S/Q C:\"`,
      posix: String.raw`CMD.EXE /D /S /C "RMDIR /S/Q C:\\"`,
      expected: cmdRootRemovalBlock,
    },
    {
      name: 'blocks a cmd del /s of every file on a drive',
      powershell: String.raw`cmd /c "del /s /q C:\*"`,
      posix: String.raw`cmd /c "del /s /q C:\*"`,
      expected: cmdRootRemovalBlock,
    },
    {
      name: 'blocks a cmd del /s of every file on a drive through the star-dot-star wildcard',
      powershell: String.raw`cmd /c "del /s /q C:\*.*"`,
      posix: String.raw`cmd /c "del /s /q C:\*.*"`,
      expected: cmdRootRemovalBlock,
    },
    {
      name: 'blocks a cmd recursive delete of a drive behind an if exist guard',
      powershell: String.raw`cmd /c "if exist C:\ rmdir /s /q C:\"`,
      posix: String.raw`cmd /c "if exist C:\\ rmdir /s /q C:\\"`,
      expected: cmdRootRemovalBlock,
    },
    {
      name: 'blocks an echo-suppressed cmd recursive delete outside the workspace',
      powershell: String.raw`cmd /c '@rd /s /q ..\outside'`,
      posix: String.raw`cmd /c '@rd /s /q ..\outside'`,
      expected: cmdOutsideRemovalBlock,
    },
    {
      name: 'blocks a cmd recursive delete outside the workspace',
      powershell: String.raw`cmd /c rmdir /s /q ..\outside`,
      posix: String.raw`cmd /c rmdir /s /q '..\outside'`,
      expected: cmdOutsideRemovalBlock,
    },
    {
      name: 'blocks a cmd recursive delete after an echo-suppressed directory change',
      powershell: String.raw`cmd /c '@cd /d C:\outside & rd /s /q build'`,
      posix: String.raw`cmd /c '@cd /d C:\outside & rd /s /q build'`,
      expected: unverifiableShellSourceBlock,
    },
    {
      name: 'blocks a cmd recursive delete after a guarded directory change',
      powershell: String.raw`cmd /c 'if exist C:\outside cd /d C:\outside & rd /s /q build'`,
      posix: String.raw`cmd /c 'if exist C:\outside cd /d C:\outside & rd /s /q build'`,
      expected: unverifiableShellSourceBlock,
    },
    {
      name: 'blocks a cmd recursive delete after a glued parent directory change',
      powershell: String.raw`cmd /c "cd.. & rmdir /s /q build"`,
      posix: String.raw`cmd /c 'cd.. & rmdir /s /q build'`,
      expected: unverifiableShellSourceBlock,
    },
    {
      name: 'blocks a cmd recursive delete after a glued root directory change',
      powershell: String.raw`cmd /c "cd\ & rmdir /s /q Users"`,
      posix: String.raw`cmd /c 'cd\ & rmdir /s /q Users'`,
      expected: unverifiableShellSourceBlock,
    },
    {
      name: 'blocks a cmd recursive delete whose switches are glued to the command',
      powershell: String.raw`cmd /c "rd/s/q C:\"`,
      posix: String.raw`cmd /c 'rd/s/q C:\'`,
      expected: unverifiableShellSourceBlock,
    },
    {
      name: 'blocks a cmd recursive delete inside a parenthesized group',
      powershell: String.raw`cmd /c "(rmdir /s /q C:\)"`,
      posix: String.raw`cmd /c '(rmdir /s /q C:\)'`,
      expected: unverifiableShellSourceBlock,
    },
    {
      name: 'keeps the root denial for a cmd recursive delete next to an expansion',
      powershell: String.raw`cmd /c "rmdir /s /q C:\ & echo %DATE%"`,
      posix: String.raw`cmd /c 'rmdir /s /q C:\ & echo %DATE%'`,
      expected: cmdRootRemovalBlock,
    },
    {
      name: 'allows a non-recursive cmd delete inside the workspace',
      powershell: 'cmd /c "del /q build.log"',
      posix: 'cmd /c "del /q build.log"',
      expected: { kind: 'allow' } as const,
    },
    {
      name: 'blocks a cmd recursive delete of an environment variable target',
      powershell: 'cmd /c "rmdir /s /q %USERPROFILE%"',
      posix: 'cmd /c "rmdir /s /q %USERPROFILE%"',
      expected: unverifiableShellSourceBlock,
    },
    {
      name: 'blocks a cmd recursive delete after a directory change inside the body',
      powershell: String.raw`cmd /c "cd /d C:\Users && rmdir /s /q build"`,
      posix: String.raw`cmd /c "cd /d C:\\Users && rmdir /s /q build"`,
      expected: unverifiableShellSourceBlock,
    },
    {
      name: 'allows a cmd recursive delete of a worktree inside the workspace',
      powershell: String.raw`cmd /c rmdir /s /q ".claude\worktrees\agent-a27e08c1bfbd7f8c9"`,
      posix: String.raw`cmd /c rmdir /s /q ".claude\worktrees\agent-a27e08c1bfbd7f8c9"`,
      expected: { kind: 'allow' } as const,
    },
    {
      name: 'allows a guarded cmd recursive delete of a dependency directory inside the workspace',
      powershell: 'cmd /c "if exist node_modules rmdir /s /q node_modules"',
      posix: 'cmd /c "if exist node_modules rmdir /s /q node_modules"',
      expected: { kind: 'allow' } as const,
    },
    {
      name: 'allows a cmd del /s of every file in a directory inside the workspace',
      powershell: String.raw`cmd /c "del /s /q build\*.*"`,
      posix: String.raw`cmd /c "del /s /q build\*.*"`,
      expected: { kind: 'allow' } as const,
    },
    {
      name: 'allows a cmd directory listing',
      powershell: 'cmd /c dir',
      posix: 'cmd /c dir',
      expected: { kind: 'allow' } as const,
    },
    {
      name: 'allows a quoted cmd echo',
      powershell: 'cmd /c "echo hi"',
      posix: 'cmd /c "echo hi"',
      expected: { kind: 'allow' } as const,
    },
  ]);
  const nestedRemoveItemRootBlock: BehavioralContractCase['expected'] = {
    kind: 'block',
    ruleId: 'powershell.remove-item-recursive-force-root-or-home',
    intent: 'hard_stop',
    reasonIncludes: 'targeting root or home',
  };
  const nestedUnreadRecursiveDeleteBlock: BehavioralContractCase['expected'] = {
    kind: 'block',
    ruleId: 'powershell.nested-recursive-delete-unread',
    intent: 'hard_stop',
    reasonIncludes: 'single -Command with literal paths',
  };
  const powerShellWrapperCases = inBothDialects([
    {
      name: 'blocks a nested PowerShell recursive delete of a drive',
      powershell: String.raw`powershell -Command "Remove-Item -Recurse -Force C:\"`,
      posix: String.raw`powershell -Command "Remove-Item -Recurse -Force C:\\"`,
      expected: nestedRemoveItemRootBlock,
    },
    {
      name: 'blocks a nested pwsh recursive delete of a drive through the short command switch',
      powershell: String.raw`pwsh -NoProfile -c "Remove-Item -Recurse -Force C:\"`,
      posix: String.raw`pwsh -NoProfile -c 'Remove-Item -Recurse -Force C:\'`,
      expected: nestedRemoveItemRootBlock,
    },
    {
      name: 'blocks a nested powershell.exe recursive delete behind an execution policy',
      powershell: String.raw`PowerShell.exe -NoProfile -ExecutionPolicy Bypass -Command "Remove-Item -Recurse -Force C:\"`,
      posix: String.raw`PowerShell.exe -NoProfile -ExecutionPolicy Bypass -Command 'Remove-Item -Recurse -Force C:\'`,
      expected: nestedRemoveItemRootBlock,
    },
    {
      name: 'blocks an unquoted nested PowerShell recursive delete behind the short switches',
      powershell: 'PWSH -nop -noni -NoLogo -ep Bypass -C Remove-Item -Recurse -Force C:\\',
      posix: String.raw`PWSH -nop -noni -NoLogo -ep Bypass -C Remove-Item -Recurse -Force 'C:\'`,
      expected: nestedRemoveItemRootBlock,
    },
    {
      name: 'blocks a nested PowerShell recursive delete started in another working directory',
      powershell: String.raw`pwsh -WorkingDirectory C:\ -c 'Remove-Item -Recurse -Force *'`,
      posix: String.raw`pwsh -WorkingDirectory 'C:\' -c 'Remove-Item -Recurse -Force *'`,
      expected: nestedUnreadRecursiveDeleteBlock,
    },
    {
      name: 'blocks a nested PowerShell recursive delete behind a slash-prefixed switch',
      powershell: String.raw`pwsh /c "Remove-Item -Recurse -Force C:\"`,
      posix: String.raw`pwsh /c 'Remove-Item -Recurse -Force C:\'`,
      expected: nestedUnreadRecursiveDeleteBlock,
    },
    {
      name: 'blocks a nested PowerShell recursive delete behind an en-dash switch',
      powershell: 'pwsh \u2013Command "Remove-Item -Recurse -Force C:\\"',
      posix: "pwsh \u2013Command 'Remove-Item -Recurse -Force C:\\'",
      expected: nestedUnreadRecursiveDeleteBlock,
    },
    {
      name: 'blocks a nested PowerShell recursive delete whose switch is written with an em dash',
      powershell: 'pwsh /c "Remove-Item \u2014Recurse C:\\"',
      posix: "pwsh /c 'Remove-Item \u2014Recurse C:\\'",
      expected: nestedUnreadRecursiveDeleteBlock,
    },
    {
      name: 'blocks a cmd recursive delete handed to pwsh in an unread form',
      powershell: String.raw`pwsh /c "cmd /c rd /s /q C:\"`,
      posix: String.raw`pwsh /c 'cmd /c rd /s /q C:\'`,
      expected: nestedUnreadRecursiveDeleteBlock,
    },
    {
      name: 'blocks an unread nested cmd recursive delete with glued switches',
      powershell: String.raw`pwsh /c "cmd /c rd/s/q C:\"`,
      posix: String.raw`pwsh /c 'cmd /c rd/s/q C:\'`,
      expected: nestedUnreadRecursiveDeleteBlock,
    },
    {
      name: 'blocks an unread nested cmd recursive delete with bundled switches',
      powershell: String.raw`pwsh /c "cmd /c del /f/s/q C:\*"`,
      posix: String.raw`pwsh /c 'cmd /c del /f/s/q C:\*'`,
      expected: nestedUnreadRecursiveDeleteBlock,
    },
    {
      name: 'blocks a nested PowerShell recursive delete passed as the positional script',
      powershell: String.raw`powershell -NoProfile "Remove-Item -Recurse -Force C:\"`,
      posix: String.raw`powershell -NoProfile 'Remove-Item -Recurse -Force C:\'`,
      expected: nestedUnreadRecursiveDeleteBlock,
    },
    {
      name: 'blocks a nested PowerShell script file whose arguments name a recursive delete',
      powershell: 'pwsh -File .\\scripts\\run.ps1 rm --recursive C:\\',
      posix: String.raw`pwsh -File '.\scripts\run.ps1' rm --recursive 'C:\'`,
      expected: nestedUnreadRecursiveDeleteBlock,
    },
    {
      name: 'blocks a nested PowerShell recursive delete of a path the outer shell expands',
      powershell: 'pwsh -c "Remove-Item -Recurse -Force $target"',
      posix: 'pwsh -c "Remove-Item -Recurse -Force $TARGET"',
      expected: nestedUnreadRecursiveDeleteBlock,
    },
    {
      name: 'blocks an unread nested recursive delete whose rm flags are bundled after the dash',
      powershell: "pwsh -NoExit -c 'rm -fr ~'",
      posix: "pwsh -NoExit -c 'rm -fr ~'",
      expected: nestedUnreadRecursiveDeleteBlock,
    },
    {
      name: 'blocks a nested recursive delete of an expanded home whose rm flags are bundled after the dash',
      powershell: 'pwsh -c "rm -vfR $HOME"',
      posix: 'pwsh -c "rm -vfR $HOME"',
      expected: nestedUnreadRecursiveDeleteBlock,
    },
    {
      name: 'blocks a nested PowerShell encoded command',
      powershell: 'powershell -NoProfile -EncodedCommand UgBlAG0AbwB2AGUALQBJAHQAZQBtAA==',
      posix: 'powershell -NoProfile -EncodedCommand UgBlAG0AbwB2AGUALQBJAHQAZQBtAA==',
      expected: unverifiableShellSourceBlock,
    },
    {
      name: 'blocks a nested pwsh encoded command through a slash-prefixed abbreviation',
      powershell: 'pwsh /enc UgBlAG0AbwB2AGUALQBJAHQAZQBtAA==',
      posix: 'pwsh /enc UgBlAG0AbwB2AGUALQBJAHQAZQBtAA==',
      expected: unverifiableShellSourceBlock,
    },
    {
      name: 'blocks a nested pwsh encoded command through its em-dash alias',
      powershell: 'pwsh —ec UgBlAG0AbwB2AGUALQBJAHQAZQBtAA==',
      posix: 'pwsh —ec UgBlAG0AbwB2AGUALQBJAHQAZQBtAA==',
      expected: unverifiableShellSourceBlock,
    },
    {
      name: 'allows a nested pwsh directory listing',
      powershell: 'pwsh -NoProfile -c "Get-ChildItem"',
      posix: 'pwsh -NoProfile -c "Get-ChildItem"',
      expected: { kind: 'allow' } as const,
    },
    {
      name: 'allows a nested PowerShell recursive delete inside the workspace',
      powershell: String.raw`powershell -NoProfile -Command "Remove-Item -Recurse -Force .\build"`,
      posix: String.raw`powershell -NoProfile -Command 'Remove-Item -Recurse -Force .\build'`,
      expected: { kind: 'allow' } as const,
    },
    {
      name: 'allows a nested PowerShell recursive delete of every item in a workspace directory',
      powershell: String.raw`pwsh -NoProfile -c "Remove-Item -Recurse -Force .\build\*"`,
      posix: String.raw`pwsh -NoProfile -c 'Remove-Item -Recurse -Force .\build\*'`,
      expected: { kind: 'allow' } as const,
    },
    {
      name: 'allows a recursive pwsh script file whose arguments hold delete verbs only inside other words',
      powershell: String.raw`pwsh -File .\scripts\export.ps1 -Format Word -Region Delta -Recurse`,
      posix: String.raw`pwsh -File '.\scripts\export.ps1' -Format Word -Region Delta -Recurse`,
      expected: { kind: 'allow' } as const,
    },
    {
      name: 'allows an unread nested PowerShell script whose only delete is not recursive',
      powershell:
        'pwsh -WorkingDirectory . -c "Invoke-RestMethod https://example.com -OutFile /srv/x.json; rm /srv/x.json"',
      posix:
        "pwsh -WorkingDirectory . -c 'Invoke-RestMethod https://example.com -OutFile /srv/x.json; rm /srv/x.json'",
      expected: { kind: 'allow' } as const,
    },
    {
      name: 'blocks a destructive git command behind a pwsh switch the reader does not read',
      powershell: 'pwsh -NoExit -c git reset --hard',
      posix: 'pwsh -NoExit -c git reset --hard',
      expected: {
        kind: 'block',
        ruleId: 'git.reset-hard',
        intent: 'use_alternative',
        reasonIncludes: 'destroys all uncommitted changes',
      },
    },
    {
      name: 'allows a nested PowerShell script file whose arguments start with r',
      powershell: 'pwsh -File report.ps1 -Action rm -Region east',
      posix: 'pwsh -File report.ps1 -Action rm -Region east',
      expected: { kind: 'allow' } as const,
    },
    {
      name: 'allows a nested PowerShell script file',
      powershell: String.raw`pwsh -File .\scripts\build.ps1`,
      posix: String.raw`pwsh -File '.\scripts\build.ps1'`,
      expected: { kind: 'allow' } as const,
    },
  ]);

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
    ...atStandardAndStrict(
      [
        [
          'blocks a home removal behind zsh options that turn execution back on after -n',
          "zsh -n -o exec -c 'rm -rf ~'",
          homeRemovalBlock,
        ],
        [
          'blocks a home removal behind a ksh long option that turns execution back on after -n',
          "ksh -n --exec -c 'rm -rf ~'",
          homeRemovalBlock,
        ],
        [
          'fails closed on a zsh +n that turns execution back on after -n',
          "zsh -n +n -c 'rm -rf ~'",
          unverifiableShellSourceBlock,
        ],
        [
          'fails closed on a bash +n that the -c cluster would take as its command string',
          "bash -nc +n 'rm -rf ~'",
          unverifiableShellSourceBlock,
        ],
        [
          'fails closed on a +o noexec that turns execution back on after -n',
          "bash -n +o noexec -c 'rm -rf ~'",
          unverifiableShellSourceBlock,
        ],
        [
          'fails closed on a +n after an -o value',
          "sh -n -o posix +n -c 'rm -rf ~'",
          unverifiableShellSourceBlock,
        ],
        [
          'fails closed on a +nc cluster that selects the command string',
          "bash -n +nc 'rm -rf ~'",
          unverifiableShellSourceBlock,
        ],
        [
          'fails closed on an option word that -c would take as its command string',
          "bash -c -x 'rm -rf ~'",
          unverifiableShellSourceBlock,
        ],
        [
          'fails closed on a lone dash that -c would take as its command string',
          "sh -c - 'rm -rf ~'",
          unverifiableShellSourceBlock,
        ],
        [
          'fails closed on a -c cluster followed by an -o option',
          "bash -ec -o pipefail 'rm -rf ~'",
          unverifiableShellSourceBlock,
        ],
        [
          'fails closed on a -c cluster whose -o takes the next word as its value',
          "dash -oc pipefail 'rm -rf ~'",
          unverifiableShellSourceBlock,
        ],
        [
          'fails closed on a child shell of xargs with a +o noexec after -n',
          "echo x | xargs bash -n +o noexec -c 'rm -rf ~'",
          unverifiableShellSourceBlock,
        ],
        [
          'fails closed on a child shell of parallel with a +n after -n',
          "parallel zsh -n +n -c 'rm -rf ~' ::: x",
          unverifiableShellSourceBlock,
        ],
        [
          'fails closed on an option word that -c would take as its command string in a quoted parallel child shell',
          "parallel -q bash -c -x 'rm -rf ~' ::: x",
          unverifiableShellSourceBlock,
        ],
        [
          'fails closed on a +n in a quoted parallel child shell',
          "parallel -q bash -c +n 'git reset --hard' ::: x",
          unverifiableShellSourceBlock,
        ],
        ['allows a syntax check of a script', 'bash -n script.sh', { kind: 'allow' }],
        [
          'allows a syntax check of a command string that is never run',
          "bash -n -c 'rm -rf ~'",
          { kind: 'allow' },
        ],
        [
          'allows a shell option before the command string',
          "bash -o pipefail -c 'echo ok'",
          { kind: 'allow' },
        ],
        [
          'allows a script whose own arguments are property options',
          'bash ./gradlew -Dorg.gradle.console=plain build',
          { kind: 'allow' },
        ],
        [
          'allows a script whose own arguments hold c and o',
          'bash ./scripts/ci.sh -config ci.yml',
          { kind: 'allow' },
        ],
        [
          'allows a script whose own argument starts with +',
          'bash scripts/release.sh +1',
          { kind: 'allow' },
        ],
        [
          'allows a positional argument starting with + after the command string',
          `bash -c 'date "$1"' _ +%Y-%m-%d`,
          { kind: 'allow' },
        ],
      ],
      { cwd: paths.cwd },
    ),
    {
      name: 'blocks a heredoc fed to zsh with an option that turns execution back on after -n',
      command: "zsh -n -o exec <<'EOF'\ngit reset --hard\nEOF",
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'raw-text.dangerous-command',
        intent: 'stop_and_explain',
        reasonIncludes: 'Unparseable command text contains a destructive pattern',
      },
    },
    {
      name: 'fails closed on a heredoc fed to zsh with a +n after -n',
      command: "zsh -n +n <<'EOF'\ngit reset --hard\nEOF",
      options: options({ cwd: paths.cwd }),
      expected: unverifiableShellSourceBlock,
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
      expected: unparseableBlock,
    },
    {
      name: 'fails closed on a function substitution inside a nested shell',
      command: "bash -c 'echo ${ rm -rf ~/; }'",
      options: options({ cwd: paths.cwd }),
      expected: unparseableBlock,
    },
    {
      name: 'fails closed on a harmless function substitution too',
      command: 'echo ${ date; }',
      options: options({ cwd: paths.cwd }),
      expected: unparseableBlock,
    },
    {
      name: 'fails closed on a function substitution glued to a variable',
      command: 'echo $x${ rm -rf ~/; }',
      options: options({ cwd: paths.cwd }),
      expected: unparseableBlock,
    },
    {
      name: 'fails closed on a function substitution after a depth-limited heredoc line',
      command: `: <<EOF\n${'$(( '.repeat(64)}0${' ))'.repeat(64)}\n\${ cd ~; }\nEOF\nrm -rf *`,
      options: options({ cwd: paths.cwd }),
      expected: unparseableBlock,
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
    ...atStandardAndStrict(
      [
        [
          'blocks a home removal in a parameter-expansion operand',
          'echo ${x:-$(rm -rf ~/)}',
          homeRemovalBlock,
        ],
        [
          'blocks a home removal in a double-quoted parameter-expansion operand',
          'echo "${x:-$(rm -rf ~/)}"',
          homeRemovalBlock,
        ],
        [
          'blocks a home removal in an operand inside a double-quoted argument of a substitution',
          'echo $(printf "%s" "${U:-$(rm -rf ~/)}")',
          homeRemovalBlock,
        ],
        [
          'blocks a home removal behind a process substitution in a pattern operand',
          'echo "${y#<(rm -rf ~/)}"',
          homeRemovalBlock,
        ],
        [
          'blocks a home removal inside double-quoted arithmetic',
          'echo "$(( $(rm -rf ~/) ))"',
          homeRemovalBlock,
        ],
        [
          'fails closed on a backtick body whose escaped dollar hides a substitution',
          'echo `echo "\\$(rm -rf ~/)"`',
          unparseableBlock,
        ],
        [
          'fails closed on a backtick body whose doubled backslash unquotes a substitution',
          "echo `echo \\\\'$(rm -rf ~/)\\\\'`",
          unparseableBlock,
        ],
        [
          'fails closed on a backtick body whose doubled backslash reaches a quote across a line continuation',
          "echo `echo \\\\\\\n'$(rm -rf ~/)\\\\\\\n'`",
          unparseableBlock,
        ],
        [
          'fails closed on a quote beside a substitution in a parameter expansion',
          'echo ${x:-"$(date)"}',
          unparseableBlock,
        ],
        [
          'fails closed on a function substitution in a parameter-expansion operand',
          'echo ${x:-${ rm -rf ~/; }}',
          unparseableBlock,
        ],
        [
          'fails closed on a quoted closing brace that ends a parameter expansion early',
          "echo ${x:-'}'$(rm -rf ~/)\\'}",
          unparseableBlock,
        ],
        [
          'fails closed on a line continuation that hides a substitution in a parameter expansion',
          'echo ${x:-$\\\n(rm -rf ~/)}',
          unparseableBlock,
        ],
        [
          'fails closed on balanced mixed quotes that end a parameter expansion early',
          "echo ${x:-'\"'\"}'$(rm -rf ~/)'\"}'\"\\'",
          unparseableBlock,
        ],
        [
          'fails closed on an escaped quote that ends a parameter expansion early',
          "echo ${x:-'\\''}'$(rm -rf ~/)'}'\\'}",
          unparseableBlock,
        ],
        [
          'fails closed on a backtick body whose doubled backslash joins a command name',
          'echo `r\\\\m -rf ~/`',
          unparseableBlock,
        ],
        [
          'allows an apostrophe in a double-quoted default-value operand',
          'echo "${MSG:-it\'s done}"',
          { kind: 'allow' },
        ],
        ['allows a nested parameter expansion', 'echo ${x:-${y}}', { kind: 'allow' }],
        [
          'allows a harmless generator in a default-value operand',
          'EDITOR=${EDITOR:-$(command -v vim)}',
          { kind: 'allow' },
        ],
        [
          'allows a double-quoted substitution nested in a default-value operand',
          'NODE_DIR=${NODE_DIR:-$(dirname "$(command -v node)")}',
          { kind: 'allow' },
        ],
        [
          'allows harmless double-quoted arithmetic over a substitution',
          'echo "$(( $(date +%s) - 60 ))"',
          { kind: 'allow' },
        ],
      ],
      { cwd: paths.cwd },
    ),
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
    ...atStandardAndStrict(
      [
        [
          'blocks a home removal behind a mid-word hash that a PowerShell guess reads as a comment in auto mode',
          'Get-Content x#; rm -rf ~',
          homeRemovalBlock,
        ],
        [
          'blocks a home removal between backslash-quotes that a PowerShell guess reads as quotes in auto mode',
          'echo \\"; rm -rf ~; echo \\"; Get-Content x',
          homeRemovalBlock,
        ],
        [
          'blocks a home removal between backslash-apostrophes that a PowerShell guess reads as quotes in auto mode',
          "echo \\'; rm -rf ~; echo \\'; Get-Content x",
          homeRemovalBlock,
        ],
        [
          'blocks a home removal after a backslash-backtick that PowerShell reads as an escape in auto mode',
          'echo \\`; rm -rf ~; Get-Content x',
          homeRemovalBlock,
        ],
        [
          'blocks a home removal joined by a line continuation that a PowerShell guess reads as a line break in auto mode',
          'Get-Content x; r\\\nm -rf ~',
          homeRemovalBlock,
        ],
        [
          'blocks a home removal in an input process substitution that PowerShell reads as text in auto mode',
          'Get-Content x; cat <(rm -rf ~)',
          homeRemovalBlock,
        ],
        [
          'blocks a home removal in an output process substitution that PowerShell reads as text in auto mode',
          'Get-Content x; echo >(rm -rf ~)',
          homeRemovalBlock,
        ],
        [
          'blocks a home removal behind a mid-word hash in a nested shell body guessed as PowerShell',
          "bash -c 'Get-Content x#; rm -rf ~'",
          homeRemovalBlock,
        ],
        [
          'allows a PowerShell comment after a selector in auto mode',
          'Get-Content x # note',
          { kind: 'allow' },
        ],
        [
          'allows inline code in a PowerShell comment after a selector in auto mode',
          'Get-Content README.md # use `code` in docs',
          { kind: 'allow' },
        ],
        ['allows a plain PowerShell selector in auto mode', 'Get-Content x', { kind: 'allow' }],
        [
          'allows a Windows path after a PowerShell selector in auto mode',
          'Get-Content C:\\Users\\me\\notes.txt',
          { kind: 'allow' },
        ],
        [
          'allows a POSIX comment that never selects PowerShell in auto mode',
          'git log --oneline # recent commits',
          { kind: 'allow' },
        ],
      ],
      { cwd: paths.cwd, shell: 'auto' },
    ),
    {
      name: 'allows a backtick substitution that PowerShell reads as escapes in auto mode, like its POSIX reading',
      command: 'Get-Content x; echo `true`;rm -rf ~/` true`',
      options: options({ cwd: paths.cwd, shell: 'auto' }),
      expected: { kind: 'allow' },
    },
    {
      name: 'fails closed on a backtick substitution that PowerShell reads as escapes in auto mode at strict safety',
      command: 'Get-Content x; echo `true`;rm -rf ~/` true`',
      options: options({ cwd: paths.cwd, shell: 'auto', strict: true }),
      expected: unparseableBlock,
    },
    {
      name: 'keeps reading a PowerShell comment in explicit powershell mode',
      command: 'Get-Content x # note',
      options: options({ cwd: paths.cwd, shell: 'powershell' }),
      expected: { kind: 'allow' },
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
    ...atStandardAndStrict(
      [
        [
          'fails closed on a CR-suffixed heredoc terminator, whose CR bash keeps in the line',
          "cat <<EOF\nEOF\r\ncat <<'EOF'\n$(git push --force)\nEOF",
          unparseableBlock,
        ],
        [
          'fails closed on a benign CRLF heredoc, whose CR bash keeps in each line',
          'cat <<EOF\r\nhello\r\nEOF\r\n',
          unparseableBlock,
        ],
        [
          'fails closed on a no-break space that bash keeps inside a heredoc delimiter',
          'cat <<EOF\u00a0x\nEOF\u00a0x\nrm -rf ~/Documents\nEOF',
          unparseableBlock,
        ],
        [
          'fails closed on a byte order mark that bash keeps inside a heredoc delimiter',
          'cat <<EOF\ufeffx\nEOF\ufeffx\nrm -rf ~/Documents\nEOF',
          unparseableBlock,
        ],
        [
          'fails closed on an ideographic space a quoted shell body reads as part of a word',
          'bash -c "echo a　#; rm -rf ~"',
          unparseableBlock,
        ],
        [
          'fails closed on an ideographic space inside a quoted command substitution',
          'echo "$(echo a　#; rm -rf ~)"',
          unparseableBlock,
        ],
        [
          'allows an ideographic space inside a quoted commit message',
          "git commit -m '修正　テスト'",
          { kind: 'allow' },
        ],
        [
          'allows an ideographic space inside a quoted heredoc body',
          "cat > notes.md <<'EOF'\n日本語　です\nEOF",
          { kind: 'allow' },
        ],
        [
          'allows a no-break space inside a quoted argument',
          "gh pr create --title 'feat: 追加' --body 'Some text'",
          { kind: 'allow' },
        ],
        [
          'fails closed on a live expansion inside a CRLF heredoc',
          'cat <<EOF\r\n$(git switch -f main)\r\nEOF\r\n',
          unparseableBlock,
        ],
      ],
      { cwd: paths.cwd },
    ),
    {
      name: 'allows dd writing to a regular file',
      command: 'dd if=/dev/zero of=disk.img bs=1M',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows dd writing to the null sink',
      command: 'dd if=big.bin of=/dev/null bs=1M',
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
    ...[
      'diskutil eraseDisk JHFS+ Kiwi /dev/disk4',
      'diskutil eraseVolume apfs KiwiLV /dev/disk5s2',
      'diskutil reformat /dev/disk6',
      'diskutil partitionDisk /dev/disk7 2 MBR fat32 A fat32 B',
      'diskutil zeroDisk /dev/disk8',
      'diskutil randomDisk 3 /dev/disk9',
      'diskutil secureErase 1 /dev/disk10',
      'diskutil erasedisk APFS X disk4',
      'wipefs -a /dev/sdb',
      'sgdisk -Z /dev/sdc',
      'sgdisk --zap-all /dev/sdd',
      'sudo parted /dev/sde mklabel gpt',
      'sudo parted -s /dev/sdf rm 3',
      'nice wipefs -a /dev/sdb',
    ].map((command) => ({
      name: `blocks a disk erase or repartition: ${command}`,
      command,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block' as const,
        ruleId: 'disk.erase',
        intent: 'manual_only' as const,
        reasonIncludes: 'erases or repartitions a disk',
      },
    })),
    {
      name: 'blocks a disk erase at strict safety',
      command: 'diskutil eraseDisk JHFS+ Kiwi /dev/disk4',
      options: options({ cwd: paths.cwd, strict: true }),
      expected: {
        kind: 'block',
        ruleId: 'disk.erase',
        intent: 'manual_only',
        reasonIncludes: 'erases or repartitions a disk',
      },
    },
    ...['newfs_hfs /dev/disk2s1', 'newfs_msdos /dev/disk3', 'mke2fs -t ext4 /dev/sde'].map(
      (command) => ({
        name: `blocks a filesystem format on a /dev target: ${command}`,
        command,
        options: options({ cwd: paths.cwd }),
        expected: {
          kind: 'block' as const,
          ruleId: 'mkfs.device',
          intent: 'manual_only' as const,
          reasonIncludes: 'erases everything on it',
        },
      }),
    ),
    ...[
      'diskutil list',
      'diskutil info disk4',
      'wipefs /dev/sdb',
      'sgdisk -p /dev/sda',
      'sgdisk -Z disk.img',
      'parted /dev/sda print',
      'parted -l',
      'parted disk.img mklabel gpt',
      'mke2fs disk.img',
    ].map((command) => ({
      name: `allows a read-only or image-file disk command: ${command}`,
      command,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' as const },
    })),
    ...[
      'echo x > /dev/sda',
      'cat img.raw > /dev/nvme0n1',
      'sh -c "echo x > /dev/sda"',
      'printf x >> /dev/disk4',
      'echo x &> /dev/sdb',
    ].map((command) => ({
      name: `blocks an output redirect onto a disk device: ${command}`,
      command,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block' as const,
        ruleId: 'redirect.block-device',
        intent: 'manual_only' as const,
        reasonIncludes: 'overwrites a disk device',
      },
    })),
    ...[
      'echo x > /dev/null',
      'echo x > /dev/tty',
      'echo x > /dev/cu.usbmodem1',
      'cat < /dev/sda > disk.img',
    ].map((command) => ({
      name: `allows a redirect onto a non-disk /dev path or from a disk: ${command}`,
      command,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' as const },
    })),
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
    ...cmdWrapperCases,
    ...powerShellWrapperCases,
    {
      name: 'allows a nested PowerShell workspace cleanup behind a transparent wrapper',
      command: String.raw`timeout 30 pwsh -NoProfile -c 'Remove-Item -Recurse -Force .\build\*'`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a nested PowerShell recursive delete behind the outer stop-parsing token',
      command: 'pwsh -c --% Remove-Item -Recurse -Force C:\\',
      options: options({ cwd: paths.cwd, shell: 'powershell' }),
      expected: nestedUnreadRecursiveDeleteBlock,
    },
    {
      name: 'blocks a POSIX recursive delete of root inside a cmd body',
      command: 'cmd /c "rm -rf /"',
      options: options({ cwd: paths.cwd }),
      expected: homeRemovalBlock,
    },
    {
      name: 'blocks a recursive delete of root inside a cmd body from PowerShell',
      command: 'cmd /c "rm -rf /"',
      options: options({ cwd: paths.cwd, shell: 'powershell' }),
      expected: {
        kind: 'block',
        ruleId: 'powershell.remove-item-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'targeting root or home',
      },
    },
    {
      name: 'blocks a cmd recursive delete of the PowerShell home variable',
      command: 'cmd /c rmdir /s /q $env:USERPROFILE',
      options: options({ cwd: paths.cwd, shell: 'powershell' }),
      expected: cmdRootRemovalBlock,
    },
    {
      name: 'blocks a cmd recursive delete behind the Git Bash //c switch',
      command: String.raw`cmd //c "rmdir /s /q C:\\"`,
      options: options({ cwd: paths.cwd }),
      expected: cmdRootRemovalBlock,
    },
    {
      name: 'blocks a cmd recursive delete whose PowerShell string ends at a backslash-escaped quote',
      command: String.raw`cmd /c "rmdir /s /q \"build output\""`,
      options: options({ cwd: paths.cwd, shell: 'powershell' }),
      expected: cmdEscapedQuoteBlock,
    },
    {
      name: 'blocks a cmd recursive delete whose quotes Git Bash re-escapes for cmd',
      command: String.raw`cmd /c "rmdir /s /q \"build output\""`,
      options: options({ cwd: paths.cwd }),
      expected: cmdEscapedQuoteBlock,
    },
    {
      name: 'blocks a single-quoted cmd recursive delete whose inner quotes Git Bash re-escapes for cmd',
      command: `cmd /c 'rmdir /s /q "dir with space"'`,
      options: options({ cwd: paths.cwd }),
      expected: cmdEscapedQuoteBlock,
    },
    {
      name: 'blocks a cmd recursive delete whose quoted command name Git Bash re-escapes for cmd',
      command: String.raw`cmd /c '"rmdir" /s /q C:\'`,
      options: options({ cwd: paths.cwd }),
      expected: cmdEscapedQuoteBlock,
    },
    {
      name: 'blocks a cmd recursive delete whose quoted target holds a connector from PowerShell',
      command: String.raw`cmd /c 'rmdir /s /q "build & output\..\..\outside"'`,
      options: options({ cwd: paths.cwd, shell: 'powershell' }),
      expected: unverifiableShellSourceBlock,
    },
    {
      name: 'keeps the root denial for a quoted drive wildcard next to a connector from PowerShell',
      command: String.raw`cmd /c 'del /s /q "C:\*" & echo done'`,
      options: options({ cwd: paths.cwd, shell: 'powershell' }),
      expected: cmdRootRemovalBlock,
    },
    {
      name: 'blocks a cmd recursive delete whose command name is quoted from PowerShell',
      command: String.raw`cmd /c '"rmdir" /s /q C:\'`,
      options: options({ cwd: paths.cwd, shell: 'powershell' }),
      expected: {
        kind: 'block',
        ruleId: 'powershell.remove-item-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'targeting root or home',
      },
    },
    {
      name: 'blocks a cmd recursive delete of a quoted target inside an outer quoted body from PowerShell',
      command: String.raw`cmd /c '"rmdir /s /q "..\outside dir""'`,
      options: options({ cwd: paths.cwd, shell: 'powershell' }),
      expected: cmdOutsideRemovalBlock,
    },
    {
      name: 'blocks a cmd recursive delete of a quoted target inside an outer quoted body from Git Bash',
      command: String.raw`cmd /c '"rmdir /s /q "..\outside dir""'`,
      options: options({ cwd: paths.cwd }),
      expected: cmdEscapedQuoteBlock,
    },
    {
      name: 'checks every cmd delete target when the rule for an earlier one is off',
      command: String.raw`cmd /c rmdir /s /q ..\outside .`,
      options: options({
        cwd: paths.cwd,
        shell: 'powershell',
        policy: {
          destructiveCommandRuleOverrides: { 'cmd.recursive-delete-outside-cwd': 'off' },
        },
      }),
      expected: {
        kind: 'block',
        ruleId: 'cmd.recursive-delete-cwd-self',
        intent: 'scope_down',
        reasonIncludes: 'outside cwd is blocked',
      },
    },
    {
      name: 'blocks a cmd recursive delete whose body still carries backslash-escaped quotes',
      command: String.raw`cmd /c 'rmdir /s /q \"build output\"'`,
      options: options({ cwd: paths.cwd }),
      expected: cmdEscapedQuoteBlock,
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
    ...atStandardAndStrict(
      [
        [
          'blocks a temp-root Git clean whose command-line config moves the work tree',
          `git -C ${tempRepo} -c core.worktree=${paths.home} clean -ffdx`,
          {
            kind: 'block',
            ruleId: 'git.clean-force',
            intent: 'use_alternative',
            reasonIncludes: 'removes untracked files permanently',
          },
        ],
        [
          'blocks a temp-root Git clean whose environment config moves the work tree',
          `GIT_CONFIG_PARAMETERS="'core.worktree'='${paths.home}'" git -C ${tempRepo} clean -ffdx`,
          {
            kind: 'block',
            ruleId: 'git.clean-force',
            intent: 'use_alternative',
            reasonIncludes: 'removes untracked files permanently',
          },
        ],
      ],
      { cwd: paths.cwd },
    ),
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
      name: 'allows sourcing a file whose path expands from a literal assignment',
      command: `S=${tempParent}; source $S/env.sh; . "$S/env.sh"`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a heredoc script written and sourced through a literal-assignment path',
      command: `S=${tempParent}; cat > $S/env.sh <<'EOF'\nrm -rf ~\nEOF\n. $S/env.sh`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'rm -rf',
      },
    },
    {
      name: 'allows scripts whose literal-assignment path starts at $PWD, $HOME or ~',
      command:
        'K=$PWD/kit; bash $K/run.sh; Z=$HOME/.zsh; source $Z/functions.zsh; N=~/bin/w.sh; bash $N',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a heredoc script written through a $PWD assignment and run by its relative path',
      command: `K=$PWD; cat > $K/cleanup.sh <<'EOF'\nrm -rf ~\nEOF\nbash ./cleanup.sh`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'rm -rf',
      },
    },
    {
      name: 'allows scripts named through the macOS per-user temp directory from getconf',
      command:
        'D=$(getconf DARWIN_USER_TEMP_DIR)ccsn-probe; bash $D/run.sh; T="$(getconf DARWIN_USER_TEMP_DIR)"; source ${T}env.sh',
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'blocks a heredoc script written and run through the getconf temp directory',
      command: `D=$(getconf DARWIN_USER_TEMP_DIR); cat > $D/cleanup.sh <<'EOF'\nrm -rf ~\nEOF\nsh $D/cleanup.sh`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'rm -rf',
      },
    },
    {
      name: 'blocks a script operand that runs getconf itself, since the heredoc it may name is untracked by then',
      command: 'sh "$(getconf DARWIN_USER_TEMP_DIR)probe.sh"',
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'analysis.dynamic-shell-source',
        intent: 'stop_and_explain',
        reasonIncludes: 'shell execution source cannot be verified',
      },
    },
    {
      name: 'blocks a heredoc script executed directly by its path',
      command: `S=${tempParent}; cat > $S/run.sh <<'EOF'\nrm -rf ~\nEOF\nchmod +x $S/run.sh && $S/run.sh`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'rm -rf',
      },
    },
    {
      name: 'blocks a heredoc script written through $HOME and run through an alias of it',
      command: `cat > $HOME/ccsn-cleanup.sh <<'EOF'\nrm -rf ~\nEOF\nZ=$HOME; bash $Z/ccsn-cleanup.sh`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'rm -rf',
      },
    },
    {
      name: 'blocks a heredoc script written and run through an unquoted ~ path',
      command: `cat > ~/ccsn-cleanup.sh <<'EOF'\nrm -rf ~\nEOF\nbash ~/ccsn-cleanup.sh`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'rm -rf',
      },
    },
    {
      name: 'blocks a heredoc script written through $PWD and run through an alias of it',
      command: `cat > $PWD/cleanup.sh <<'EOF'\nrm -rf ~\nEOF\nK=$PWD; bash $K/cleanup.sh`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'rm -rf',
      },
    },
    {
      name: 'blocks a heredoc script written and run through a quoted ~ directory',
      command: `cat > '~/cleanup.sh' <<'EOF'\nrm -rf ~\nEOF\nbash '~/cleanup.sh'`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'rm.recursive-force-root-or-home',
        intent: 'hard_stop',
        reasonIncludes: 'rm -rf',
      },
    },
    {
      name: 'allows a heredoc Python script run by its path in strict mode',
      command: `cat > ${tempParent}/check.py <<'EOF'\n#!/usr/bin/env python3\nprint("hello")\nEOF\nchmod +x ${tempParent}/check.py; ${tempParent}/check.py`,
      options: options({ cwd: paths.cwd, strict: true }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a heredoc zsh script run by its path when its body cannot be parsed',
      command: `cat > ${tempParent}/rebuild.sh <<'EOF'\n#!/bin/zsh\nfiles=(\${(f)"$(git diff --name-only HEAD~1 HEAD)"})\nprint -l $files\nEOF\nchmod +x ${tempParent}/rebuild.sh && ${tempParent}/rebuild.sh`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'allows a heredoc script run by its path when its body exceeds analysis limits',
      command: `SP=${tempParent}; cat > $SP/repeat.sh <<'EOF'\n#!/bin/zsh\nSP=\${0:h}; SK=/opt/skills/video\ntt=$(printf "%05.2f" $2)\nfor d in orig new; do\n  cd $SP/$d-film\n  for i in 1 2 3; do\n    uv run --project $SK python $SK/scripts/render.py stills . $2 --scene $1 >/dev/null 2>&1\n    cp build/story-$1/t$tt.png $SP/r-$d$i.png\n  done\ndone\nfor a in orig1 orig2 orig3 new1 new2 new3; do echo "$a: $(magick compare -metric AE $SP/r-orig1.png $SP/r-$a.png null: 2>&1)"; done\nEOF\nchmod +x $SP/repeat.sh; $SP/repeat.sh shelter 11`,
      options: options({ cwd: paths.cwd }),
      expected: { kind: 'allow' },
    },
    {
      name: 'keeps $PWD in a script operand dynamic when a wrapper changes the working directory',
      command: `cat > $PWD/cleanup.sh <<'EOF'\nrm -rf ~\nEOF\nenv -C ${tempParent} bash $PWD/cleanup.sh`,
      options: options({ cwd: paths.cwd }),
      expected: {
        kind: 'block',
        ruleId: 'analysis.dynamic-shell-source',
        intent: 'stop_and_explain',
        reasonIncludes: 'shell execution source cannot be verified',
      },
    },
    {
      name: 'blocks sourcing a file whose path expands from an unbound variable',
      command: 'source $S/env.sh',
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
    ...atStandardAndStrict(
      [
        [
          'fails closed on a vertical tab that bash keeps inside a cd operand',
          `cd ~; cd ${tempRepo}\v; rm -rf Documents`,
          unparseableBlock,
        ],
        [
          'fails closed on a no-break space that bash keeps inside a cd operand',
          `cd ~; cd ${tempRepo}\u00a0; rm -rf Documents`,
          unparseableBlock,
        ],
        [
          'fails closed on a byte order mark that bash keeps inside a cd operand',
          `cd ~; cd ${tempRepo}\ufeff; rm -rf Documents`,
          unparseableBlock,
        ],
        [
          'fails closed on a CRLF line end whose CR bash keeps inside a cd operand',
          `cd ~; cd ${tempRepo}\r\nrm -rf Documents`,
          unparseableBlock,
        ],
        [
          'fails closed on a vertical tab an ANSI-C quoted shell body keeps inside a cd operand',
          `bash -c $'cd ~; cd ${tempRepo}\\v; rm -rf Documents'`,
          unparseableBlock,
        ],
      ],
      { cwd: paths.cwd },
    ),
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
