import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { RULE_DOC } from '@/bin/rule/doc';
import { printRuleChangeResult, printRulesTestResult, printSyncResult } from '@/bin/rule/format';
import { runRulesVerify } from '@/bin/rule/verify';
import {
  addRulebookSource,
  getProjectRulesConfigPath,
  getProjectRulesDir,
  getUserRulesConfigPath,
  getUserRulesDir,
  loadRulesPolicy,
  removeRulebookSource,
  syncRulesConfig,
  testRulebookSources,
  writeDefaultRulesConfig,
  writeStarterRulebook,
} from '@/core/rules/policy';

interface RuleFlags {
  global: boolean;
  check: boolean;
  help: boolean;
  positionals: string[];
  errors: string[];
}

const RULE_SUBCOMMANDS = new Set([
  'init',
  'add',
  'remove',
  'update',
  'sync',
  'list',
  'test',
  'doc',
  'verify',
]);

export async function runRuleCommand(args: readonly string[]): Promise<number> {
  const flags = parseRuleFlags(args);
  if (flags.errors.length > 0) {
    for (const error of flags.errors) console.error(error);
    return 1;
  }

  const subcommand = flags.positionals[0];
  if (!subcommand || flags.help) {
    return 0;
  }
  const value = flags.positionals[1];
  const options = { global: flags.global, check: flags.check };

  if (subcommand === 'init') {
    const dir = flags.global ? getUserRulesDir() : getProjectRulesDir();
    const configPath = flags.global ? getUserRulesConfigPath() : getProjectRulesConfigPath();
    const rulebookName = flags.global ? 'user-rules' : 'project-rules';
    if (!existsSync(configPath)) writeDefaultRulesConfig(configPath, [rulebookName]);
    const rulebookPath = join(dir, rulebookName, 'rulebook.json');
    if (!existsSync(rulebookPath)) writeStarterRulebook(rulebookPath, rulebookName);
    const result = await syncRulesConfig(options);
    printRuleChangeResult(result, 'Rule config initialized.');
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'add') {
    if (!value) {
      console.error('rule add requires a source');
      return 1;
    }
    const result = await addRulebookSource(value, options);
    printRuleChangeResult(result, `Added rulebook source: ${value}`);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'remove') {
    if (!value) {
      console.error('rule remove requires a source');
      return 1;
    }
    const result = await removeRulebookSource(value, options);
    printRuleChangeResult(result, `Removed rulebook source: ${value}`);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'update' || subcommand === 'sync') {
    const result = await syncRulesConfig({
      ...options,
      only: subcommand === 'update' ? value : undefined,
    });
    printRuleChangeResult(result, flags.check ? 'Rule config checked.' : 'Rule config synced.');
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'list') {
    const policy = loadRulesPolicy();
    if (policy.errors.length > 0) {
      for (const error of policy.errors) console.error(error);
      return 1;
    }
    printSyncResult({ ok: true, errors: [], entries: [] });
    return 0;
  }

  if (subcommand === 'test') {
    const sources = value ? [value] : [];
    const result = await testRulebookSources(sources, options);
    printRulesTestResult(result);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'doc') {
    console.log(RULE_DOC);
    return 0;
  }

  if (subcommand === 'verify') {
    return runRulesVerify();
  }

  return 1;
}

function parseRuleFlags(args: readonly string[]): RuleFlags {
  const flags: RuleFlags = {
    global: false,
    check: false,
    help: false,
    positionals: [],
    errors: [],
  };

  for (const arg of args) {
    if (arg === '-g' || arg === '--global') {
      flags.global = true;
    } else if (arg === '--check') {
      flags.check = true;
    } else if (arg === '-h' || arg === '--help') {
      flags.help = true;
    } else if (arg.startsWith('-')) {
      flags.errors.push(`Unknown rule option: ${arg}`);
    } else {
      flags.positionals.push(arg);
    }
  }

  const [subcommand] = flags.positionals;
  if (subcommand && !RULE_SUBCOMMANDS.has(subcommand)) {
    flags.errors.push(`Unknown rule subcommand: ${subcommand}`);
  }
  if (flags.positionals.length > 2) {
    flags.errors.push(`Unexpected rule argument: ${flags.positionals[2]}`);
  }

  return flags;
}
