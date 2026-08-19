import type { DestructiveCommandRuleMatch } from '@/ir/analysis';
import type { BlockIntent } from '@/ir/decision';
import type {
  CommandAnalysisPolicy,
  EffectiveDestructiveCommandRuleState,
  EffectivePolicy,
  EffectiveSafetyCapabilities,
  RuleActivationCapability,
} from '@/ir/policy';

export const DESTRUCTIVE_COMMAND_RULE_IDS = [
  'git.ssh-env',
  'git.alias-config',
  'git.checkout-force',
  'git.checkout-double-dash',
  'git.checkout-ref-path',
  'git.checkout-pathspec-from-file',
  'git.checkout-ambiguous',
  'git.switch-discard-changes',
  'git.switch-force',
  'git.restore-worktree',
  'git.restore-unstaged',
  'git.reset-hard',
  'git.reset-merge',
  'git.clean-force',
  'git.push-force',
  'git.push-delete',
  'git.push-mirror',
  'git.branch-force-delete',
  'git.rebase-abort',
  'git.merge-abort',
  'git.tag-delete',
  'git.reflog-delete',
  'git.stash-drop',
  'git.stash-clear',
  'git.worktree-remove-force',
  'rm.recursive-force-root-or-home',
  'rm.git-metadata',
  'rm.recursive-force-dynamic-target',
  'rm.recursive-force-home-cwd',
  'rm.recursive-force-cwd-self',
  'rm.recursive-force-outside-cwd',
  'rm.recursive-force-paranoid',
  'powershell.remove-item-root-or-home',
  'powershell.remove-item-recursive-force-root-or-home',
  'powershell.remove-item-git-metadata',
  'powershell.remove-item-recursive-force-dynamic-target',
  'powershell.remove-item-recursive-force-home-cwd',
  'powershell.remove-item-recursive-force-cwd-self',
  'powershell.remove-item-recursive-force-outside-cwd',
  'powershell.remove-item-recursive-force-paranoid',
  'powershell.remove-item-pipeline-dynamic-target',
  'find.delete',
  'find.delete-git-metadata',
  'find.exec-rm-recursive-force',
  'dd.device-write',
  'mkfs.device',
  'shred.target',
  'interpreter.dangerous-command',
  'interpreter.one-liner-paranoid',
  'awk.system-dynamic',
  'xargs.rm-recursive-force-dynamic',
  'xargs.shell-dynamic',
  'parallel.rm-recursive-force-dynamic',
  'parallel.shell-dynamic',
  'parallel.command-stream-dynamic',
  'shell.dynamic-structure',
  'shell.dynamic-executable',
  'raw-text.dangerous-command',
  'acli.comment-write',
  'acli.edit',
  'acli.create',
  'acli.transition',
] as const;

export const DESTRUCTIVE_COMMAND_RULE_ID_SET = new Set<string>(DESTRUCTIVE_COMMAND_RULE_IDS);

export type DestructiveCommandRuleId = (typeof DESTRUCTIVE_COMMAND_RULE_IDS)[number];

export interface DestructiveCommandRuleMetadata {
  id: DestructiveCommandRuleId;
  category: string;
  label: string;
  description: string;
  example: string;
  intent: BlockIntent;
  catastrophic?: true;
  activationCapability?: RuleActivationCapability;
}

export const DESTRUCTIVE_COMMAND_RULE_METADATA: readonly DestructiveCommandRuleMetadata[] = [
  {
    id: 'git.ssh-env',
    category: 'Git',
    label: 'Git SSH environment override',
    description: 'Blocks Git network operations with SSH environment overrides.',
    example: 'GIT_SSH_COMMAND="./ssh-wrapper" git push',
    intent: 'manual_only',
  },
  {
    id: 'git.alias-config',
    category: 'Git',
    label: 'Git command-line alias',
    description: 'Blocks command-line Git aliases that cannot be safely resolved.',
    example: "git -c alias.wipe='!rm -rf /' wipe",
    intent: 'manual_only',
  },
  {
    id: 'git.checkout-force',
    category: 'Git',
    label: 'Git checkout force',
    description: 'Blocks forced checkout operations that discard local changes.',
    example: 'git checkout --force main',
    intent: 'use_alternative',
  },
  {
    id: 'git.checkout-double-dash',
    category: 'Git',
    label: 'Git checkout path restore',
    description: 'Blocks checkout path restores after --.',
    example: 'git checkout -- src/app.ts',
    intent: 'use_alternative',
  },
  {
    id: 'git.checkout-ref-path',
    category: 'Git',
    label: 'Git checkout ref and path',
    description: 'Blocks checkout forms that mix a ref and path restore.',
    example: 'git checkout HEAD -- src/app.ts',
    intent: 'use_alternative',
  },
  {
    id: 'git.checkout-pathspec-from-file',
    category: 'Git',
    label: 'Git checkout pathspec file',
    description: 'Blocks checkout pathspec loading from a file.',
    example: 'git checkout --pathspec-from-file=paths.txt',
    intent: 'use_alternative',
  },
  {
    id: 'git.checkout-ambiguous',
    category: 'Git',
    label: 'Git checkout ambiguous targets',
    description: 'Blocks ambiguous checkout arguments that may restore paths.',
    example: 'git checkout main src/app.ts',
    intent: 'use_alternative',
  },
  {
    id: 'git.switch-discard-changes',
    category: 'Git',
    label: 'Git switch discard changes',
    description: 'Blocks branch switches that explicitly discard local changes.',
    example: 'git switch --discard-changes main',
    intent: 'use_alternative',
  },
  {
    id: 'git.switch-force',
    category: 'Git',
    label: 'Git switch force',
    description: 'Blocks forced branch switches.',
    example: 'git switch --force main',
    intent: 'use_alternative',
  },
  {
    id: 'git.restore-worktree',
    category: 'Git',
    label: 'Git restore worktree',
    description: 'Blocks worktree restore operations.',
    example: 'git restore --worktree src/app.ts',
    intent: 'use_alternative',
  },
  {
    id: 'git.restore-unstaged',
    category: 'Git',
    label: 'Git restore unstaged',
    description: 'Blocks unstaged restore operations.',
    example: 'git restore src/app.ts',
    intent: 'use_alternative',
  },
  {
    id: 'git.reset-hard',
    category: 'Git',
    label: 'Git reset hard',
    description: 'Blocks hard resets.',
    example: 'git reset --hard',
    intent: 'use_alternative',
  },
  {
    id: 'git.reset-merge',
    category: 'Git',
    label: 'Git reset merge',
    description: 'Blocks merge resets.',
    example: 'git reset --merge',
    intent: 'use_alternative',
  },
  {
    id: 'git.clean-force',
    category: 'Git',
    label: 'Git clean force',
    description: 'Blocks forced clean operations.',
    example: 'git clean -fd',
    intent: 'use_alternative',
  },
  {
    id: 'git.push-force',
    category: 'Git',
    label: 'Git push force',
    description: 'Blocks force pushes.',
    example: 'git push --force origin main',
    intent: 'use_alternative',
  },
  {
    id: 'git.push-delete',
    category: 'Git',
    label: 'Git push delete',
    description: 'Blocks remote ref deletion through push.',
    example: 'git push --delete origin old-branch',
    intent: 'manual_only',
  },
  {
    id: 'git.push-mirror',
    category: 'Git',
    label: 'Git push mirror',
    description: 'Blocks mirror pushes that can force-update or delete remote refs.',
    example: 'git push --mirror origin',
    intent: 'manual_only',
  },
  {
    id: 'git.branch-force-delete',
    category: 'Git',
    label: 'Git branch force delete',
    description: 'Blocks forced branch deletion.',
    example: 'git branch -D old-branch',
    intent: 'use_alternative',
  },
  {
    id: 'git.rebase-abort',
    category: 'Git',
    label: 'Git rebase abort',
    description: 'Blocks rebase abort operations.',
    example: 'git rebase --abort',
    intent: 'use_alternative',
  },
  {
    id: 'git.merge-abort',
    category: 'Git',
    label: 'Git merge abort',
    description: 'Blocks merge abort operations.',
    example: 'git merge --abort',
    intent: 'use_alternative',
  },
  {
    id: 'git.tag-delete',
    category: 'Git',
    label: 'Git tag delete',
    description: 'Blocks tag deletion.',
    example: 'git tag --delete v1.0.0',
    intent: 'manual_only',
  },
  {
    id: 'git.reflog-delete',
    category: 'Git',
    label: 'Git reflog delete',
    description: 'Blocks reflog deletion.',
    example: 'git reflog delete HEAD@{1}',
    intent: 'manual_only',
  },
  {
    id: 'git.stash-drop',
    category: 'Git',
    label: 'Git stash drop',
    description: 'Blocks dropping stash entries.',
    example: 'git stash drop stash@{0}',
    intent: 'use_alternative',
  },
  {
    id: 'git.stash-clear',
    category: 'Git',
    label: 'Git stash clear',
    description: 'Blocks clearing all stash entries.',
    example: 'git stash clear',
    intent: 'manual_only',
  },
  {
    id: 'git.worktree-remove-force',
    category: 'Git',
    label: 'Git worktree force remove',
    description: 'Blocks forced worktree removal.',
    example: 'git worktree remove --force ../feature',
    intent: 'use_alternative',
  },
  {
    id: 'rm.recursive-force-root-or-home',
    category: 'Filesystem',
    label: 'rm -rf root or home',
    description: 'Blocks recursive forced removal of root or home paths.',
    example: 'rm -rf /',
    intent: 'hard_stop',
    catastrophic: true,
  },
  {
    id: 'rm.git-metadata',
    category: 'Filesystem',
    label: 'rm Git metadata',
    description: 'Blocks removal of protected Git metadata and hooks.',
    example: 'rm -rf .git',
    intent: 'hard_stop',
    catastrophic: true,
  },
  {
    id: 'rm.recursive-force-dynamic-target',
    category: 'Filesystem',
    label: 'rm -rf dynamic target',
    description: 'Blocks recursive forced removal with dynamic targets in strict mode.',
    example: 'rm -rf "$target"',
    intent: 'scope_down',
    activationCapability: 'fail_closed',
  },
  {
    id: 'rm.recursive-force-home-cwd',
    category: 'Filesystem',
    label: 'rm -rf from home cwd',
    description: 'Blocks recursive forced removal while working in home.',
    example: 'cd "$HOME" && rm -rf build',
    intent: 'scope_down',
  },
  {
    id: 'rm.recursive-force-cwd-self',
    category: 'Filesystem',
    label: 'rm -rf current directory',
    description: 'Blocks recursive forced removal of the current directory.',
    example: 'rm -rf .',
    intent: 'scope_down',
  },
  {
    id: 'rm.recursive-force-outside-cwd',
    category: 'Filesystem',
    label: 'rm -rf outside cwd',
    description: 'Blocks recursive forced removal outside the original cwd.',
    example: 'rm -rf ../outside',
    intent: 'scope_down',
  },
  {
    id: 'rm.recursive-force-paranoid',
    category: 'Filesystem',
    label: 'rm -rf paranoid mode',
    description: 'Blocks non-temp recursive forced removal when paranoid rm is enabled.',
    example: 'rm -rf ./cache',
    intent: 'scope_down',
    activationCapability: 'paranoid_rm',
  },
  {
    id: 'powershell.remove-item-root-or-home',
    category: 'PowerShell',
    label: 'Remove-Item root or home',
    description: 'Blocks PowerShell Remove-Item targeting root or home paths.',
    example: 'Remove-Item C:\\',
    intent: 'hard_stop',
    catastrophic: true,
  },
  {
    id: 'powershell.remove-item-recursive-force-root-or-home',
    category: 'PowerShell',
    label: 'Remove-Item recursive force root or home',
    description: 'Blocks recursive forced PowerShell removal of root or home paths.',
    example: 'Remove-Item C:\\ -Recurse -Force',
    intent: 'hard_stop',
    catastrophic: true,
  },
  {
    id: 'powershell.remove-item-git-metadata',
    category: 'PowerShell',
    label: 'Remove-Item Git metadata',
    description: 'Blocks PowerShell removal of protected Git metadata and hooks.',
    example: 'Remove-Item .git -Recurse -Force',
    intent: 'hard_stop',
    catastrophic: true,
  },
  {
    id: 'powershell.remove-item-recursive-force-dynamic-target',
    category: 'PowerShell',
    label: 'Remove-Item recursive force dynamic target',
    description: 'Blocks recursive forced PowerShell removal with dynamic targets in strict mode.',
    example: 'Remove-Item $target -Recurse -Force',
    intent: 'scope_down',
    activationCapability: 'fail_closed',
  },
  {
    id: 'powershell.remove-item-recursive-force-home-cwd',
    category: 'PowerShell',
    label: 'Remove-Item recursive force from home cwd',
    description: 'Blocks recursive forced PowerShell removal while working in home.',
    example: 'Set-Location $HOME; Remove-Item ./build -Recurse -Force',
    intent: 'scope_down',
  },
  {
    id: 'powershell.remove-item-recursive-force-cwd-self',
    category: 'PowerShell',
    label: 'Remove-Item recursive force current directory',
    description: 'Blocks recursive forced PowerShell removal of the current directory.',
    example: 'Remove-Item . -Recurse -Force',
    intent: 'scope_down',
  },
  {
    id: 'powershell.remove-item-recursive-force-outside-cwd',
    category: 'PowerShell',
    label: 'Remove-Item recursive force outside cwd',
    description: 'Blocks recursive forced PowerShell removal outside the original cwd.',
    example: 'Remove-Item ../outside -Recurse -Force',
    intent: 'scope_down',
  },
  {
    id: 'powershell.remove-item-recursive-force-paranoid',
    category: 'PowerShell',
    label: 'Remove-Item recursive force paranoid mode',
    description: 'Blocks non-temp recursive forced PowerShell removal when paranoid rm is enabled.',
    example: 'Remove-Item ./cache -Recurse -Force',
    intent: 'scope_down',
    activationCapability: 'paranoid_rm',
  },
  {
    id: 'powershell.remove-item-pipeline-dynamic-target',
    category: 'PowerShell',
    label: 'Remove-Item pipeline dynamic target',
    description: 'Blocks PowerShell Remove-Item with unverifiable pipeline input in strict mode.',
    example: 'Get-ChildItem . -Recurse | Remove-Item -Force',
    intent: 'scope_down',
    activationCapability: 'fail_closed',
  },
  {
    id: 'find.delete',
    category: 'Filesystem',
    label: 'find delete',
    description: 'Blocks unsafe find -delete operations.',
    example: 'find . -delete',
    intent: 'scope_down',
  },
  {
    id: 'find.delete-git-metadata',
    category: 'Filesystem',
    label: 'find delete Git metadata',
    description: 'Blocks find -delete operations selecting protected Git metadata and hooks.',
    example: 'find .git -delete',
    intent: 'hard_stop',
    catastrophic: true,
  },
  {
    id: 'find.exec-rm-recursive-force',
    category: 'Filesystem',
    label: 'find exec rm -rf',
    description: 'Blocks find -exec rm -rf operations.',
    example: 'find . -exec rm -rf {} +',
    intent: 'scope_down',
  },
  {
    id: 'dd.device-write',
    category: 'Filesystem',
    label: 'dd device write',
    description: 'Blocks dd writing to a /dev device.',
    example: 'dd if=/dev/zero of=/dev/sda',
    intent: 'manual_only',
  },
  {
    id: 'mkfs.device',
    category: 'Filesystem',
    label: 'mkfs device format',
    description: 'Blocks mkfs formatting a /dev device.',
    example: 'mkfs.ext4 /dev/sda1',
    intent: 'manual_only',
  },
  {
    id: 'shred.target',
    category: 'Filesystem',
    label: 'shred target',
    description: 'Blocks shred against any target, including shred --help and shred --version.',
    example: 'shred -u secret.txt',
    intent: 'use_alternative',
  },
  {
    id: 'interpreter.dangerous-command',
    category: 'Execution',
    label: 'Interpreter dangerous command',
    description: 'Blocks interpreter one-liners containing dangerous commands.',
    example: `python -c "import os; os.system('rm -rf /')"`,
    intent: 'use_alternative',
  },
  {
    id: 'interpreter.one-liner-paranoid',
    category: 'Execution',
    label: 'Interpreter one-liner paranoid mode',
    description: 'Blocks interpreter one-liners when paranoid interpreters is enabled.',
    example: 'python -c "print(1)"',
    intent: 'use_alternative',
    activationCapability: 'paranoid_interpreters',
  },
  {
    id: 'awk.system-dynamic',
    category: 'Execution',
    label: 'Awk dynamic system call',
    description: 'Blocks awk system calls that cannot be safely analyzed.',
    example: "awk '{ system($0) }'",
    intent: 'stop_and_explain',
  },
  {
    id: 'xargs.rm-recursive-force-dynamic',
    category: 'Execution',
    label: 'xargs dynamic rm -rf',
    description: 'Blocks xargs rm -rf with dynamic input.',
    example: 'printf / | xargs rm -rf',
    intent: 'scope_down',
  },
  {
    id: 'xargs.shell-dynamic',
    category: 'Execution',
    label: 'xargs dynamic shell',
    description: 'Blocks xargs shell execution with dynamic input.',
    example: 'xargs r$(printf m) -rf',
    intent: 'scope_down',
  },
  {
    id: 'parallel.rm-recursive-force-dynamic',
    category: 'Execution',
    label: 'parallel dynamic rm -rf',
    description: 'Blocks parallel rm -rf with dynamic input.',
    example: 'printf / | parallel rm -rf',
    intent: 'scope_down',
  },
  {
    id: 'parallel.shell-dynamic',
    category: 'Execution',
    label: 'parallel dynamic shell',
    description: 'Blocks parallel shell execution with dynamic input.',
    example: 'parallel r$(printf m) -rf ::: child',
    intent: 'scope_down',
  },
  {
    id: 'parallel.command-stream-dynamic',
    category: 'Execution',
    label: 'parallel dynamic command stream',
    description: 'Blocks parallel command streams from dynamic input.',
    example: 'parallel --dry-run',
    intent: 'scope_down',
  },
  {
    id: 'shell.dynamic-structure',
    category: 'Execution',
    label: 'Dynamic command structure',
    description:
      'Blocks guarded subcommands and options assembled from substitution output in strict mode.',
    example: 'git reset $(printf --hard)',
    intent: 'stop_and_explain',
    activationCapability: 'fail_closed',
  },
  {
    id: 'shell.dynamic-executable',
    category: 'Execution',
    label: 'Dynamic executable name',
    description:
      'Blocks executable names assembled from command substitution output in strict mode.',
    example: '$(printf r)m -rf /',
    intent: 'manual_only',
    activationCapability: 'fail_closed',
  },
  {
    id: 'raw-text.dangerous-command',
    category: 'Execution',
    label: 'Raw text dangerous command',
    description: 'Blocks dangerous commands detected in raw command text.',
    example: "git reset --hard 'unterminated",
    intent: 'stop_and_explain',
  },
  {
    id: 'acli.comment-write',
    category: 'Atlassian',
    label: 'acli comment write',
    description: 'Blocks acli commands that create or update Jira or Confluence comments.',
    example: 'acli jira workitem comment create --key KEY-1 --body hi',
    intent: 'manual_only',
  },
  {
    id: 'acli.edit',
    category: 'Atlassian',
    label: 'acli content edit',
    description: 'Blocks acli commands that edit Jira work items or Confluence content.',
    example: 'acli jira workitem edit --key KEY-1 --summary x',
    intent: 'manual_only',
  },
  {
    id: 'acli.create',
    category: 'Atlassian',
    label: 'acli create',
    description: 'Blocks acli commands that create Jira work items or Confluence pages or blogs.',
    example: 'acli jira workitem create --summary x',
    intent: 'manual_only',
  },
  {
    id: 'acli.transition',
    category: 'Atlassian',
    label: 'acli work item transition',
    description: 'Blocks acli commands that transition Jira work items.',
    example: 'acli jira workitem transition --key KEY-1',
    intent: 'manual_only',
  },
] as const;

const DESTRUCTIVE_COMMAND_RULE_INTENTS = new Map(
  DESTRUCTIVE_COMMAND_RULE_METADATA.map((rule) => [rule.id, rule.intent]),
);

const CATASTROPHIC_DESTRUCTIVE_COMMAND_RULE_IDS = new Set(
  DESTRUCTIVE_COMMAND_RULE_METADATA.filter((rule) => rule.catastrophic).map((rule) => rule.id),
);

export function destructiveCommandMatch(
  id: (typeof DESTRUCTIVE_COMMAND_RULE_IDS)[number],
  reason: string,
) {
  return {
    id,
    reason,
    intent: DESTRUCTIVE_COMMAND_RULE_INTENTS.get(id) ?? 'manual_only',
  };
}

export function filterDestructiveCommandMatch(
  match: DestructiveCommandRuleMatch | null,
  policy:
    | (Pick<
        EffectivePolicy,
        'destructiveCommandProtectionEnabled' | 'destructiveCommandRuleOverrides'
      > &
        Partial<Pick<CommandAnalysisPolicy, 'effectiveDestructiveCommandRules'>>)
    | undefined,
): DestructiveCommandRuleMatch | null {
  if (!match) return null;
  if (CATASTROPHIC_DESTRUCTIVE_COMMAND_RULE_IDS.has(match.id as DestructiveCommandRuleId)) {
    return match;
  }
  if (policy?.destructiveCommandProtectionEnabled === false) return null;
  const effectiveRule = policy?.effectiveDestructiveCommandRules?.[match.id];
  if (effectiveRule) return effectiveRule.enabled ? match : null;
  return policy?.destructiveCommandRuleOverrides[match.id] === 'off' ? null : match;
}

export function destructiveCommandRuleIsEnabled(
  policy:
    | (Pick<
        EffectivePolicy,
        'destructiveCommandProtectionEnabled' | 'destructiveCommandRuleOverrides'
      > &
        Partial<Pick<CommandAnalysisPolicy, 'effectiveDestructiveCommandRules'>>)
    | undefined,
  id: DestructiveCommandRuleId,
  inheritedEnabled: boolean,
): boolean {
  if (CATASTROPHIC_DESTRUCTIVE_COMMAND_RULE_IDS.has(id)) return true;
  if (policy?.destructiveCommandProtectionEnabled === false) return false;
  const resolved = policy?.effectiveDestructiveCommandRules?.[id];
  if (resolved) return resolved.enabled;
  const override = policy?.destructiveCommandRuleOverrides[id];
  return override ? override === 'on' : inheritedEnabled;
}

export function resolveEffectiveDestructiveCommandRules(
  policy: Pick<
    EffectivePolicy,
    'destructiveCommandProtectionEnabled' | 'destructiveCommandRuleOverrides'
  >,
  capabilities: EffectiveSafetyCapabilities,
): Readonly<Record<string, EffectiveDestructiveCommandRuleState>> {
  return Object.freeze(
    Object.fromEntries(
      DESTRUCTIVE_COMMAND_RULE_METADATA.map((rule) => {
        const capability = rule.activationCapability
          ? capabilities[rule.activationCapability]
          : undefined;
        const inheritedEnabled = capability?.enabled ?? true;
        const override = policy.destructiveCommandRuleOverrides[rule.id];
        const state = rule.catastrophic
          ? {
              enabled: true,
              inheritedEnabled: true,
              changesInherited: false,
              source: 'catastrophic' as const,
              ...(override ? { override } : {}),
            }
          : policy.destructiveCommandProtectionEnabled
            ? override
              ? {
                  enabled: override === 'on',
                  inheritedEnabled,
                  changesInherited: (override === 'on') !== inheritedEnabled,
                  source: 'rule_override' as const,
                  ...(rule.activationCapability
                    ? { activationCapability: rule.activationCapability }
                    : {}),
                  override,
                }
              : {
                  enabled: inheritedEnabled,
                  inheritedEnabled,
                  changesInherited: false,
                  source: capability?.source ?? ('built_in_default' as const),
                  ...(rule.activationCapability
                    ? { activationCapability: rule.activationCapability }
                    : {}),
                }
            : {
                enabled: false,
                inheritedEnabled,
                changesInherited: false,
                source: 'master_disabled' as const,
                ...(rule.activationCapability
                  ? { activationCapability: rule.activationCapability }
                  : {}),
                ...(override ? { override } : {}),
              };
        return [rule.id, Object.freeze(state)];
      }),
    ),
  );
}

export function createCommandAnalysisPolicy(
  policy: EffectivePolicy,
  capabilities: EffectiveSafetyCapabilities,
): CommandAnalysisPolicy {
  return Object.freeze({
    ...policy,
    effectiveDestructiveCommandRules: resolveEffectiveDestructiveCommandRules(policy, capabilities),
  });
}
