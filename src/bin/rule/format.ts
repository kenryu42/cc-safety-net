import {
  getRulebookDisplaySource,
  type LoadedRulesPolicy,
  type RulebookLockEntryWithStats,
  type RuleOverride,
} from '@/core/rules/policy';

export function printRuleChangeResult(
  result: {
    ok: boolean;
    errors: string[];
    warnings?: string[];
    entries: RulebookLockEntryWithStats[];
  },
  action: string,
): void {
  if (!result.ok) {
    printResultErrors(result);
    return;
  }
  printResultWarnings(result);
  console.log(action);
  console.log('Rule config synced.');
  console.log('');
  printActiveRulebookSummary(result.entries);
}

function printActiveRulebookSummary(entries: RulebookLockEntryWithStats[]): void {
  if (entries.length === 0) {
    console.log('Active rulebooks: (none)');
    return;
  }
  console.log(`Active rulebooks (${entries.length}):`);
  for (const entry of entries) {
    console.log(`  - ${entry.name} ${entry.version} (${formatRuleCount(entry.ruleCount ?? 0)})`);
    console.log(`    Source: ${formatRulebookSource(entry, new Map())}`);
  }
}

function formatRuleCount(count: number): string {
  return `${count} ${count === 1 ? 'rule' : 'rules'}`;
}

function formatRulebookSource(
  entry: RulebookLockEntryWithStats,
  sourceDisplayMap: Map<string, string>,
): string {
  return sourceDisplayMap.get(entry.spec) ?? getRulebookDisplaySource(entry);
}

export function printRulesTestResult(
  result: {
    ok: boolean;
    errors: string[];
    warnings?: string[];
    entries: RulebookLockEntryWithStats[];
  },
  sourceDisplayMap: Map<string, string> = new Map(),
): void {
  if (!result.ok) {
    printResultErrors(result);
    return;
  }
  printResultWarnings(result);
  console.log('Rulebook tests passed.');
  console.log('');
  for (const entry of result.entries) {
    console.log(`  ${entry.name} ${entry.version}`);
    console.log(`    Source: ${formatRulebookSource(entry, sourceDisplayMap)}`);
    console.log(`    Rules: ${entry.ruleCount ?? 0}`);
    console.log(`    Tests: ${entry.testCount ?? 0}`);
  }
  if (result.entries.length < 2) return;

  console.log('');
  console.log(
    `Tested ${result.entries.length} rulebooks, ${sumStats(result.entries, 'ruleCount')} rules, ${sumStats(result.entries, 'testCount')} tests.`,
  );
}

export function printRulesListReport(
  policy: LoadedRulesPolicy,
  sourceDisplayMaps: Record<'user' | 'project', Map<string, string>>,
): void {
  printListSection('Active sources', policy.rulebooks, (rulebook) => [
    `[${rulebook.source}] ${rulebook.name} ${rulebook.version}`,
    `  Source: ${sourceDisplayMaps[rulebook.source].get(rulebook.spec) ?? rulebook.spec}`,
  ]);
  printListSection('Active rules', policy.rules, (rule) => [
    `[${getRuleSource(policy, rule.name)}] ${rule.name}`,
    `  Command: ${rule.subcommand ? `${rule.command} ${rule.subcommand}` : rule.command}`,
    `  Block args: ${rule.block_args.join(', ')}`,
    `  Reason: ${rule.reason}`,
  ]);
  printListSection('Disabled rules', getMergedOverrides(policy, 'off'), (override) => [
    override.key,
  ]);
  printListSection('Reason overrides', getMergedOverrides(policy, 'reason'), (override) => [
    override.key,
    `  Reason: ${(override.value as { reason: string }).reason}`,
  ]);
  printListSection('Issues', policy.errors, (error) => [error]);
}

function printListSection<T>(title: string, items: T[], format: (item: T) => string[]): void {
  if (items.length === 0) {
    console.log(`${title}: (none)`);
    return;
  }
  console.log(`${title} (${items.length}):`);
  for (const item of items) {
    const [firstLine, ...detailLines] = format(item);
    console.log(`  - ${firstLine}`);
    for (const line of detailLines) console.log(`    ${line}`);
  }
}

function getRuleSource(policy: LoadedRulesPolicy, ruleName: string): 'user' | 'project' {
  return (
    policy.rulebooks.find((rulebook) => rulebook.rules.includes(ruleName))?.source ?? 'project'
  );
}

function getMergedOverrides(
  policy: LoadedRulesPolicy,
  kind: 'off' | 'reason',
): Array<{ key: string; value: RuleOverride }> {
  return Object.entries({
    ...(policy.userConfig?.overrides ?? {}),
    ...(policy.projectConfig?.overrides ?? {}),
  })
    .filter((entry): entry is [string, RuleOverride] => {
      if (kind === 'off') return entry[1] === 'off';
      return !!entry[1] && typeof entry[1] === 'object';
    })
    .map(([key, value]) => ({ key, value }));
}

function sumStats(entries: RulebookLockEntryWithStats[], key: 'ruleCount' | 'testCount'): number {
  return entries.reduce((total, entry) => total + (entry[key] ?? 0), 0);
}

function printResultErrors(result: { errors: string[] }): void {
  for (const error of result.errors) console.error(error);
}

function printResultWarnings(result: { warnings?: string[] }): void {
  if (!result.warnings || result.warnings.length === 0) return;
  for (const warning of result.warnings) console.warn(warning);
}
