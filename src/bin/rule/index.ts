import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ruleCommand } from '@/bin/commands/rule';
import { printCommandHelp } from '@/bin/help';
import { RULE_DOC } from '@/bin/rule/doc';
import {
  printRuleChangeResult,
  printRulesListReport,
  printRulesTestResult,
} from '@/bin/rule/format';
import { runRulesMigrate } from '@/bin/rule/migrate';
import { runRulesVerify } from '@/bin/rule/verify';
import {
  addRulebookSource,
  getProjectRulesConfigPath,
  getProjectRulesDir,
  getRulesConfigSourceDisplayMap,
  getUserRulesConfigPath,
  getUserRulesDir,
  loadRulesPolicy,
  readRulesConfig,
  removeRulebookSource,
  syncRulesConfig,
  testRulebookSources,
  writeDefaultRulesConfig,
  writeStarterRulebook,
} from '@/core/rules/policy';
import { writeJsonAtomic } from '@/core/rules/policy/config-file';

interface RuleFlags {
  global: boolean;
  check: boolean;
  cleanup: boolean;
  deleteSource: boolean;
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
  'migrate',
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
  if (flags.help) {
    printCommandHelp(ruleCommand);
    return 0;
  }
  if (!subcommand) {
    printCommandHelp(ruleCommand);
    return 1;
  }
  const value = flags.positionals[1];
  const options = { global: flags.global, check: flags.check };

  if (subcommand === 'init') {
    const dir = flags.global ? getUserRulesDir() : getProjectRulesDir();
    const configPath = flags.global ? getUserRulesConfigPath() : getProjectRulesConfigPath();
    const rulebookName = flags.global ? 'user-rules' : 'project-rules';
    ensureDefaultRulebookSource(configPath, rulebookName);
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
    const result = await removeRulebookSource(value, {
      ...options,
      deleteSource: flags.deleteSource,
    });
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
    printRulesListReport(policy, {
      user: getRulesConfigSourceDisplayMap(policy.userConfigPath),
      project: getRulesConfigSourceDisplayMap(policy.projectConfigPath),
    });
    return policy.errors.length > 0 ? 1 : 0;
  }

  if (subcommand === 'test') {
    const sources = value ? [value] : [];
    const result = await testRulebookSources(sources, options);
    printRulesTestResult(result);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'migrate') {
    return runRulesMigrate({ cleanup: flags.cleanup, cwd: process.cwd() });
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
    cleanup: false,
    deleteSource: false,
    help: false,
    positionals: [],
    errors: [],
  };

  for (const arg of args) {
    if (arg === '-g' || arg === '--global') {
      flags.global = true;
    } else if (arg === '--check') {
      flags.check = true;
    } else if (arg === '--delete-source') {
      flags.deleteSource = true;
    } else if (arg === '--cleanup') {
      flags.cleanup = true;
    } else if (arg === '-h' || arg === '--help') {
      flags.help = true;
    } else if (arg.startsWith('-')) {
      flags.errors.push(unknownRuleOption(flags.positionals[0], arg));
    } else {
      flags.positionals.push(arg);
    }
  }

  validateRuleFlags(flags);
  return flags;
}

function validateRuleFlags(flags: RuleFlags): void {
  const [subcommand] = flags.positionals;
  if (subcommand && !RULE_SUBCOMMANDS.has(subcommand)) {
    flags.errors.push(`Unknown rule subcommand: ${subcommand}`);
  }
  if (flags.deleteSource && subcommand !== 'remove') {
    if (subcommand && RULE_SUBCOMMANDS.has(subcommand)) {
      flags.errors.push(`Unknown option for rule ${subcommand}: --delete-source`);
    } else {
      flags.errors.push("--delete-source is only valid with 'rule remove'");
    }
  }
  if (flags.cleanup && subcommand !== 'migrate') {
    flags.errors.push(unknownRuleOption(subcommand, '--cleanup'));
  }
  if (subcommand === 'migrate') {
    if (flags.global) flags.errors.push('Unknown option for rule migrate: --global');
    if (flags.check) flags.errors.push('Unknown option for rule migrate: --check');
    if (flags.positionals.length > 1) {
      flags.errors.push(`Unexpected rule migrate argument: ${flags.positionals[1]}`);
    }
  } else if (flags.positionals.length > 2) {
    flags.errors.push(`Unexpected rule argument: ${flags.positionals[2]}`);
  }
  if (subcommand === 'list' && flags.global) {
    flags.errors.push('Unknown option for rule list: --global');
  }
}

function unknownRuleOption(subcommand: string | undefined, option: string) {
  if (subcommand === 'migrate') return `Unknown option for rule migrate: ${option}`;
  return `Unknown rule option: ${option}`;
}

function ensureDefaultRulebookSource(configPath: string, rulebookName: string): void {
  if (!existsSync(configPath)) {
    writeDefaultRulesConfig(configPath, [rulebookName]);
    return;
  }

  const loaded = readRulesConfig(configPath);
  if (!loaded.config || loaded.config.rules.includes(rulebookName)) return;

  writeJsonAtomic(configPath, {
    version: 1,
    rules: [...loaded.config.rules, rulebookName],
    overrides: loaded.config.overrides ?? {},
  });
}
