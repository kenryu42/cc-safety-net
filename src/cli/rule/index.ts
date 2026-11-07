import { join } from 'node:path';
import { parseCommandArgs } from '@/cli/args';
import { ruleAddExamples, ruleAddOptions, ruleCommand } from '@/cli/commands/rule';
import { printCommandHelp } from '@/cli/help';
import { RULE_DOC } from '@/cli/rule/doc';
import {
  printCommandToolsList,
  printRuleAddResult,
  printRuleChangeResult,
  printRulesListReport,
} from '@/cli/rule/format';
import { runRulesMigrate } from '@/cli/rule/migrate';
import { runRuleSyncMigration } from '@/cli/rule/sync-migrate';
import { getUpdateNotice } from '@/cli/rule/update-notice';
import { runRulesVerify } from '@/cli/rule/verify';
import { colors } from '@/cli/utils/colors';
import type { Environment } from '@/core/environment';
import {
  getPolicyFilesystemTargetForPath,
  PolicyFilesystemError,
  type PolicyFilesystemTarget,
  readPolicyFile,
} from '@/core/io/safe-read';
import { writeJsonAtomic } from '@/core/policy/config-file';
import { getProjectRulesConfigPath, projectPolicyIsUserPolicy } from '@/core/policy/paths';
import {
  COMMAND_TOOL_NAME_PATTERN,
  COMMAND_TOOL_NAME_RULE,
  type CommandToolEntry,
  DEFAULT_CONFIG,
  readRulesConfig,
} from '@/core/policy/rules-config';
import { getRulesConfigRuntimeErrorsForConfig, loadRulesPolicy } from '@/core/policy/scope-policy';
import { isGitHubRef, isGitHubRepositorySource, NAME_PATTERN } from '@/core/policy/source-syntax';
import { isReservedTransparentWrapper } from '@/core/policy/transparent-wrappers';
import { COMMAND_PATTERN } from '@/core/rules/constants';
import { getBuiltInToolRefusal } from '@/hosts/built-in-tools';
import {
  readScopeRulesConfig,
  writeDefaultRulesConfig,
  writeStarterRulebook,
} from '@/rules-manager/config-file';
import { getScopePaths } from '@/rules-manager/paths';
import { addRulebookSource, removeRulebookSource, syncRulesConfig } from '@/rules-manager/sync';

interface RuleFlags {
  global: boolean;
  project: boolean;
  cleanup: boolean;
  deleteSource: boolean;
  example: boolean;
  ref?: string;
  cwdArg?: string;
  noCwdArg: boolean;
  only: string[];
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
  'wrapper',
  'tool',
  'migrate',
  'doc',
  'verify',
]);
const RULE_WRITE_SUBCOMMANDS = new Set(['init', 'add', 'remove', 'update', 'sync', 'wrapper']);
const RULE_LIST_ACTIONS = new Set(['add', 'remove', 'list']);
const OFFICIAL_RULEBOOKS_SOURCE = 'cc-safety-net/rulebooks';

export async function runRuleCommand(
  environment: Environment,
  args: readonly string[],
): Promise<number> {
  try {
    return await runRuleCommandInternal(environment, args);
  } catch (error) {
    if (error instanceof PolicyFilesystemError) {
      console.error(error.message);
      return 1;
    }
    throw error;
  }
}

async function runRuleCommandInternal(
  environment: Environment,
  args: readonly string[],
): Promise<number> {
  const flags = parseRuleFlags(args);

  const helpCommand = flags.help ? getRuleHelpCommand(flags.positionals) : null;
  if (helpCommand) {
    printCommandHelp(helpCommand);
    return 0;
  }
  if (flags.errors.length > 0) {
    for (const error of flags.errors) console.error(error);
    return 1;
  }

  const subcommand = flags.positionals[0];
  if (!subcommand) {
    printCommandHelp(ruleCommand, console.error);
    return 1;
  }
  const value = flags.positionals[1];
  const options = { global: flags.global };
  const cwd = process.cwd();
  const writesProjectRules =
    subcommand === 'tool'
      ? flags.project
      : !flags.global &&
        RULE_WRITE_SUBCOMMANDS.has(subcommand) &&
        !(subcommand === 'wrapper' && value === 'list');
  if (writesProjectRules && projectPolicyIsUserPolicy(environment, { cwd })) {
    console.error(
      `${getProjectRulesConfigPath(cwd)} is the user rule config, not a project rule config; ${subcommand === 'tool' ? 'drop --project' : 'use --global'} for the user scope, or run from a project directory`,
    );
    return 1;
  }

  if (subcommand === 'init') {
    const scope = getScopePaths(environment, options);
    ensureRulesConfig(scope.configTarget);
    const rulebookPath = join(scope.configDir, 'example-rules', 'rulebook.json');
    const rulebookTarget = getPolicyFilesystemTargetForPath(scope.filesystemScope, rulebookPath);
    if (flags.example && readPolicyFile(rulebookTarget) === null)
      writeStarterRulebook(rulebookTarget);

    const errors = getRulesConfigRuntimeErrorsForConfig(scope.configPath, scope.filesystemScope);
    for (const error of errors) console.error(error);
    if (errors.length > 0) return 1;
    console.log('Rule config initialized.');
    return 0;
  }

  if (subcommand === 'add') {
    const source = resolveRuleAddSource(flags);
    if (!source) {
      console.error(
        'rule add requires a source (pass --only <rulebook...> to select from cc-safety-net/rulebooks)',
      );
      return 1;
    }
    const scope = getScopePaths(environment, options);
    const result = await addRulebookSource(environment, source, {
      ...options,
      ref: flags.ref,
      rulebooks: flags.only.length > 0 ? flags.only : undefined,
    });
    printRuleAddResult(
      result,
      source,
      `Scope: ${flags.global ? 'user' : 'project'} (${scope.configDir})`,
    );
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'remove') {
    if (!value) {
      console.error('rule remove requires a source');
      return 1;
    }
    const result = await removeRulebookSource(environment, value, {
      ...options,
      deleteSource: flags.deleteSource,
    });
    printRuleChangeResult(result, `Removed rulebook source: ${value}`);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'update') {
    const result = await syncRulesConfig(environment, { ...options, only: value, refresh: true });
    printRuleChangeResult(result, 'Rule config updated.');
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'sync') {
    return runRuleSyncMigration(environment, { global: flags.global });
  }

  if (subcommand === 'list') {
    const policy = loadRulesPolicy(environment, { cwd });
    printRulesListReport(policy);
    return policy.errors.length > 0 ? 1 : 0;
  }

  if (subcommand === 'wrapper') {
    return runRuleWrapperCommand(environment, flags);
  }

  if (subcommand === 'tool') {
    return runRuleToolCommand(environment, flags, cwd);
  }

  if (subcommand === 'migrate') {
    return runRulesMigrate(environment, { cleanup: flags.cleanup, cwd });
  }

  if (subcommand === 'doc') {
    console.log(RULE_DOC);
    const notice = await getUpdateNotice(environment);
    if (notice) console.error(notice);
    return 0;
  }

  if (subcommand === 'verify') {
    return runRulesVerify(environment);
  }

  return 1;
}

function getRuleHelpCommand(positionals: string[]) {
  if (positionals.length === 0) return ruleCommand;
  const leaves = ruleCommand.subcommands.filter(
    (leaf) => leaf.usage.split(' ')[0] === positionals[0],
  );
  if (leaves.length === 0) return null;

  if (positionals.length === 1 && leaves.length > 1) {
    return {
      name: `rule ${positionals[0]}`,
      description: `Subcommands of rule ${positionals[0]}`,
      usage: `rule ${positionals[0]} <subcommand>`,
      subcommands: leaves,
      options: [],
    };
  }
  const leaf =
    positionals.length === 1
      ? leaves[0]
      : leaves.find((entry) => entry.usage.split(' ')[1] === positionals[1]);
  if (!leaf) return null;
  return {
    name: `rule ${positionals[0]}`,
    description: leaf.description,
    usage: `rule ${leaf.usage}`,
    options: positionals[0] === 'add' ? ruleAddOptions : [],
    examples: positionals[0] === 'add' ? ruleAddExamples : undefined,
  };
}

function parseRuleFlags(args: readonly string[]): RuleFlags {
  const parsed = parseCommandArgs(
    {
      label: 'rule',
      booleans: {
        global: ['-g', '--global'],
        project: ['--project'],
        cleanup: ['--cleanup'],
        deleteSource: ['--delete-source'],
        example: ['--example'],
        noCwdArg: ['--no-cwd-arg'],
      },
      values: { ref: ['--ref'], cwdArg: ['--cwd-arg'] },
      lists: { only: ['--only'] },
      positionals: 'list',
    },
    args,
  );
  const flags: RuleFlags = {
    ...parsed.flags,
    ref: parsed.values.ref,
    cwdArg: parsed.values.cwdArg,
    only: parsed.lists.only ?? [],
    help: parsed.help,
    positionals: parsed.positionals,
    errors: parsed.errors,
  };

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
  if (flags.example && subcommand !== 'init') {
    flags.errors.push(unknownRuleOption(subcommand, '--example'));
  }
  if (flags.ref && subcommand !== 'add') {
    flags.errors.push(unknownRuleOption(subcommand, '--ref'));
  }
  if (flags.only.length > 0 && subcommand !== 'add') {
    flags.errors.push(unknownRuleOption(subcommand, '--only'));
  }
  const toolAction = subcommand === 'tool' ? flags.positionals[1] : undefined;
  const optionOwner =
    toolAction && RULE_LIST_ACTIONS.has(toolAction) ? `tool ${toolAction}` : subcommand;
  if (flags.project && toolAction !== 'add' && toolAction !== 'remove') {
    flags.errors.push(unknownRuleOption(optionOwner, '--project'));
  }
  if (flags.cwdArg !== undefined && toolAction !== 'add') {
    flags.errors.push(unknownRuleOption(optionOwner, '--cwd-arg'));
  }
  if (flags.noCwdArg && toolAction !== 'add') {
    flags.errors.push(unknownRuleOption(optionOwner, '--no-cwd-arg'));
  }
  if (flags.noCwdArg && flags.cwdArg !== undefined && toolAction === 'add') {
    flags.errors.push('rule tool add takes --cwd-arg or --no-cwd-arg, not both');
  }
  if (subcommand === 'tool' && flags.global) {
    flags.errors.push(unknownRuleOption(subcommand, '--global'));
  }
  if (subcommand === 'add') validateRuleAddFlags(flags);
  if (subcommand === 'migrate') {
    if (flags.global) flags.errors.push(unknownRuleOption(subcommand, '--global'));
    if (flags.positionals.length > 1) {
      flags.errors.push(`Unexpected rule migrate argument: ${flags.positionals[1]}`);
    }
  } else if (subcommand === 'wrapper') {
    validateRuleListActionFlags(flags, 'a command');
  } else if (subcommand === 'tool') {
    validateRuleListActionFlags(flags, 'a tool name');
  } else if (flags.positionals.length > 2) {
    flags.errors.push(`Unexpected rule argument: ${flags.positionals[2]}`);
  }
  if (subcommand === 'list' && flags.global) {
    flags.errors.push('Unknown option for rule list: --global');
  }
}

function resolveRuleAddSource(flags: RuleFlags): string | undefined {
  if (flags.positionals[1]) return flags.positionals[1];
  if (flags.ref || flags.only.length > 0) return OFFICIAL_RULEBOOKS_SOURCE;
  return undefined;
}

function validateRuleAddFlags(flags: RuleFlags): void {
  const source = resolveRuleAddSource(flags);
  if (!source) return;
  if ((flags.ref || flags.only.length > 0) && !isGitHubRepositorySource(source)) {
    if (flags.ref) {
      flags.errors.push(`--ref can only select a ref for an owner/repo source: ${source}`);
    }
    if (flags.only.length > 0) {
      flags.errors.push('--only can only select rulebooks from an owner/repo source');
    }
    return;
  }
  if (flags.ref && !isGitHubRef(flags.ref)) {
    flags.errors.push(`--ref must use valid path segments: ${flags.ref}`);
  }
  const invalidNames = flags.only.filter((name) => !NAME_PATTERN.test(name));
  if (invalidNames.length > 0) {
    flags.errors.push(`Invalid rulebook names: ${invalidNames.join(', ')}`);
  }
}

function unknownRuleOption(subcommand: string | undefined, option: string) {
  return subcommand
    ? `Unknown option for rule ${subcommand}: ${option}`
    : `Unknown option for rule: ${option}`;
}

function validateRuleListActionFlags(flags: RuleFlags, operand: string): void {
  const subcommand = flags.positionals[0];
  const action = flags.positionals[1];
  const value = flags.positionals[2];
  if (!action) {
    flags.errors.push(`rule ${subcommand} requires add, remove, or list`);
    return;
  }
  if (!RULE_LIST_ACTIONS.has(action)) {
    flags.errors.push(`Unknown rule ${subcommand} action: ${action}`);
    return;
  }
  if (action === 'list') {
    if (value) flags.errors.push(`Unexpected rule ${subcommand} argument: ${value}`);
    return;
  }
  if (!value) {
    flags.errors.push(`rule ${subcommand} ${action} requires ${operand}`);
    return;
  }
  if (subcommand !== 'tool' && flags.positionals.length > 3) {
    flags.errors.push(`Unexpected rule ${subcommand} argument: ${flags.positionals[3]}`);
  }
}

function ensureRulesConfig(configPath: PolicyFilesystemTarget): void {
  if (readPolicyFile(configPath) === null) {
    writeDefaultRulesConfig(configPath);
    return;
  }

  const loaded = readRulesConfig(configPath);
  if (!loaded.config) return;

  writeJsonAtomic(configPath, loaded.config);
}

async function runRuleWrapperCommand(environment: Environment, flags: RuleFlags): Promise<number> {
  const action = flags.positionals[1];
  const command = flags.positionals[2];
  const configPath = getScopePaths(environment, { global: flags.global }).configTarget;

  if (action === 'list') {
    const loaded = readRulesConfig(configPath);
    if (loaded.errors.length > 0) {
      for (const error of loaded.errors) console.error(error);
      return 1;
    }
    printTransparentWrappers(loaded.config?.transparent_wrappers ?? []);
    return 0;
  }

  if (!command || !COMMAND_PATTERN.test(command)) {
    console.error('transparent wrapper must match command pattern');
    return 1;
  }
  if (isReservedTransparentWrapper(command)) {
    console.error(`reserved command "${command}" cannot be a wrapper`);
    return 1;
  }

  const loaded = readRulesConfig(configPath);
  if (loaded.errors.length > 0) {
    for (const error of loaded.errors) console.error(error);
    return 1;
  }
  const config = loaded.config ?? DEFAULT_CONFIG;
  const wrappers =
    action === 'add'
      ? [...new Set([...(config.transparent_wrappers ?? []), command])]
      : (config.transparent_wrappers ?? []).filter((wrapper) => wrapper !== command);

  writeJsonAtomic(configPath, { ...config, transparent_wrappers: wrappers });
  console.log(
    action === 'add'
      ? `Added transparent wrapper: ${command}`
      : `Removed transparent wrapper: ${command}`,
  );
  return 0;
}

function printTransparentWrappers(wrappers: string[]): void {
  if (wrappers.length === 0) {
    console.log('Transparent wrappers: (none)');
    return;
  }
  console.log(`Transparent wrappers (${wrappers.length}):`);
  for (const wrapper of wrappers) console.log(`  - ${wrapper}`);
}

function runRuleToolCommand(environment: Environment, flags: RuleFlags, cwd: string): number {
  const action = flags.positionals[1];
  const names = [...new Set(flags.positionals.slice(2))];
  if (action === 'list') return listCommandTools(environment, cwd);

  const refusals = [
    ...names.flatMap((name) => {
      if (!COMMAND_TOOL_NAME_PATTERN.test(name)) {
        return [`"${name}" is not a tool name: ${COMMAND_TOOL_NAME_RULE}.`];
      }
      const builtInRefusal = action === 'add' ? getBuiltInToolRefusal(name) : undefined;
      return builtInRefusal ? [builtInRefusal] : [];
    }),
    ...(flags.cwdArg !== undefined && !COMMAND_TOOL_NAME_PATTERN.test(flags.cwdArg)
      ? [`"${flags.cwdArg}" is not an argument name: ${COMMAND_TOOL_NAME_RULE}.`]
      : []),
  ];
  if (refusals.length > 0) {
    for (const refusal of refusals) console.error(colors.red(`Error: ${refusal}`));
    return 1;
  }

  const scope = getScopePaths(environment, { global: !flags.project });
  const loaded = readScopeRulesConfig(scope.configTarget);
  if (!loaded.ok) {
    for (const error of loaded.result.errors) console.error(error);
    return 1;
  }
  const cwdArg = flags.noCwdArg ? (false as const) : flags.cwdArg;
  const nextTools = names.reduce((tools, name) => {
    const entry = cwdArg === undefined ? name : { name, cwd: cwdArg };
    const isNamed = (tool: CommandToolEntry) =>
      (typeof tool === 'string' ? tool : tool.name) === name;
    if (action === 'remove') return tools.filter((tool) => !isNamed(tool));
    return tools.some(isNamed)
      ? tools.map((tool) => (isNamed(tool) ? entry : tool))
      : [...tools, entry];
  }, loaded.config.command_tools ?? []);

  writeJsonAtomic(scope.configTarget, { ...loaded.config, command_tools: nextTools });
  for (const name of names) {
    console.log(
      action === 'add'
        ? `Added command tool: ${name}${cwdArg === undefined ? '' : cwdArg === false ? ' (no cwd argument)' : ` (cwd argument: ${cwdArg})`}`
        : `Removed command tool: ${name}`,
    );
  }
  console.log(`Scope: ${flags.project ? 'project' : 'user'} (${scope.configPath})`);
  return 0;
}

function listCommandTools(environment: Environment, cwd: string): number {
  const scopes = (
    projectPolicyIsUserPolicy(environment, { cwd })
      ? (['user'] as const)
      : (['user', 'project'] as const)
  ).map((scope) => {
    const paths = getScopePaths(environment, { global: scope === 'user' });
    return { scope, path: paths.configPath, ...readRulesConfig(paths.configTarget) };
  });
  const errors = scopes.flatMap((scope) => scope.errors.map((error) => `${scope.path}: ${error}`));
  if (errors.length > 0) {
    for (const error of errors) console.error(error);
    return 1;
  }
  printCommandToolsList(
    scopes.flatMap((scope) =>
      (scope.config?.command_tools ?? []).map((tool) => ({ scope: scope.scope, tool })),
    ),
  );
  return 0;
}
