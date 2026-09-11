import { sep } from 'node:path';
import { wrapReason } from '@/cli/explain/format-helpers';
import { isPluginEnabled } from '@/cli/statusline';
import { colors } from '@/cli/utils/colors';
import type { Environment } from '@/core/environment';
import { resolveEffectiveDestructiveCommandRules } from '@/core/policy/effective-rules';
import { getCCSafetyNetEnvModes } from '@/core/policy/env';
import { getProjectPolicyPath, getUserPolicyPath } from '@/core/policy/paths';
import { loadPolicySnapshot } from '@/core/policy/snapshot';

export function printStatus(environment: Environment): void {
  const snapshot = loadPolicySnapshot(environment, { cwd: process.cwd() });
  const policy = snapshot.policy;
  const modes = getCCSafetyNetEnvModes(policy, environment.env);
  const asciiOnly = !!process.env.NO_COLOR || !process.stdout.isTTY;

  const width = Math.min(process.stdout.columns || 80, 100);
  const on = asciiOnly ? 'ok' : '✔';
  const off = asciiOnly ? 'OFF' : '✘';

  const row = (label: string, value: string) => {
    const line = `  ${label.padEnd(13)}${value}`;
    return (line.length > width ? `${line.slice(0, width - 1)}…` : line).replaceAll(
      off,
      colors.red(off),
    );
  };

  const hasEffectiveRuleCustomization = Object.values(
    resolveEffectiveDestructiveCommandRules(policy, modes.capabilities),
  ).some((rule) => rule.changesInherited);

  const shorten = (path: string) =>
    path === environment.home || path.startsWith(`${environment.home}${sep}`)
      ? `~${path.slice(environment.home.length)}`
      : path;
  const paintVerdict = { ready: colors.green, degraded: colors.yellow }[snapshot.state];

  const weakenings = snapshot.policyScopes?.weakenings ?? [];

  const issues = [
    ...(isPluginEnabled(environment)
      ? []
      : [
          'plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected.',
        ]),
    ...snapshot.diagnostics,
  ];
  const bullet = asciiOnly ? '-' : '·';

  console.log(
    [
      `${asciiOnly ? '' : '🛡️  '}CC Safety Net — ${paintVerdict(snapshot.state)}`,
      '',
      row(
        'Protection',
        `destructive ${policy.destructiveCommandProtectionEnabled ? on : off}   secrets ${policy.secretProtection.enabled ? on : off}`,
      ),
      row(
        'Level',
        hasEffectiveRuleCustomization
          ? `${modes.effectiveLevel} (customised)`
          : modes.effectiveLevel,
      ),
      row('Rules', policy.rules.length === 0 ? 'none active' : `${policy.rules.length} active`),
      row('Policy', shorten(getUserPolicyPath(environment))),
      ...(snapshot.policyScopes
        ? [row('Project', shorten(getProjectPolicyPath(process.cwd())))]
        : []),
      ...(modes.worktreeMode ? [row('Worktree', 'relaxations active')] : []),
      '',

      ...(weakenings.length === 0
        ? []
        : [
            '  Project policy',
            ...weakenings.flatMap((weakening) =>
              wrapReason(weakening, '      ', width - 6).map((line, index) =>
                index === 0 ? `    ${line}` : line,
              ),
            ),
            '',
          ]),
      ...(issues.length === 0
        ? ['  Everything configured is active.']
        : [
            '  Not active',
            ...issues.flatMap((issue) =>
              wrapReason(issue, '      ', width - 6).map((line, index) =>
                index === 0 ? `    ${bullet} ${line}` : line,
              ),
            ),
            '',
            '  Full report: cc-safety-net doctor',
          ]),
    ].join('\n'),
  );
}
