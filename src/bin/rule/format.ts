import { getRulebookDisplaySource, type RulebookLockEntryWithStats } from '@/core/rules-policy';

export function printSyncResult(result: {
  ok: boolean;
  errors: string[];
  entries: RulebookLockEntryWithStats[];
}): void {
  if (!result.ok) {
    printResultErrors(result);
    return;
  }
  for (const entry of result.entries) {
    const ruleCount = entry.ruleCount === undefined ? '' : ` (${entry.ruleCount} rules)`;
    console.log(`${entry.name} ${entry.version} ${entry.digest} ${entry.spec}${ruleCount}`);
  }
}

export function printRuleChangeResult(
  result: {
    ok: boolean;
    errors: string[];
    entries: RulebookLockEntryWithStats[];
  },
  action: string,
): void {
  if (!result.ok) {
    printResultErrors(result);
    return;
  }
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
    entries: RulebookLockEntryWithStats[];
  },
  sourceDisplayMap: Map<string, string> = new Map(),
): void {
  if (!result.ok) {
    printResultErrors(result);
    return;
  }
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

function sumStats(entries: RulebookLockEntryWithStats[], key: 'ruleCount' | 'testCount'): number {
  return entries.reduce((total, entry) => total + (entry[key] ?? 0), 0);
}

function printResultErrors(result: { errors: string[] }): void {
  for (const error of result.errors) console.error(error);
}

export function relativeDisplay(cwd: string, path: string): string {
  return path.startsWith(cwd) ? path.slice(cwd.length + 1) : path;
}
