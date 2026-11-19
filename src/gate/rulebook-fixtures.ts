import { createTestEnvironment } from '@/core/environment';
import { getCCSafetyNetEnvModes } from '@/core/policy/env';
import { declaredOptionsWithValues, type Rulebook } from '@/core/policy/rulebook';
import { createPolicySnapshot } from '@/core/policy/snapshot';
import type { AnalyzeInput } from '@/gate/analysis';
import { analyzeCommandWithProgram, analyzeOrCapBreach } from '@/gate/analyzer';

const CUSTOM_RULE_ID_PREFIX = 'custom.';

export function evaluateRulebookFixtures(rulebook: Rulebook): string[] {
  if (rulebook.rulebook_version !== 2) {
    return [];
  }
  const analysis: AnalyzeInput = {
    effectiveCapabilities: getCCSafetyNetEnvModes({}, new Map()).capabilities,
    environment: createTestEnvironment(),
    protectedGitMetadata: null,
    policySnapshot: createPolicySnapshot({
      rules: rulebook.rules.map((rule) => ({
        name: rule.name,
        command: rule.command,
        block_args: [],
        match: rule.match,
        options_with_values: declaredOptionsWithValues(rulebook, rule.command),
        reason: rule.reason,
        intent: rule.intent,
      })),
      transparentWrappers: [],
      heredocDataWrappers: [],
      commandTools: [],
      safety: { level: 'standard' },
      worktreeMode: false,
      destructiveCommandProtectionEnabled: false,
      destructiveCommandRuleOverrides: {},
      destructiveCommandAllowPaths: [],
      secretProtection: { enabled: false, disabledRules: [], denyPaths: [], allowPaths: [] },
    }),
  };

  return (rulebook.tests ?? []).flatMap((fixture, index) => {
    const blockingRuleId = analyzeOrCapBreach(
      () => analyzeCommandWithProgram(fixture.command, analysis),
      fixture.command,
    ).decision?.ruleId;
    const matched = blockingRuleId?.startsWith(CUSTOM_RULE_ID_PREFIX)
      ? blockingRuleId.slice(CUSTOM_RULE_ID_PREFIX.length)
      : undefined;
    if (fixture.expect === 'blocked') {
      if (matched === fixture.rule) {
        return [];
      }
      const actual = blockingRuleId
        ? `"${matched ?? blockingRuleId}" matched first`
        : 'no rule matched';
      return [
        `tests[${index}]: expected "${fixture.rule}" to block "${fixture.command}" but ${actual}`,
      ];
    }
    return matched
      ? [`tests[${index}]: expected "${fixture.command}" to be allowed but "${matched}" matched`]
      : [];
  });
}
