#!/usr/bin/env node
import { type CommandName, findCommand } from '@/bin/commands';
import { parseDoctorFlags, runDoctor } from '@/bin/doctor/index';
import {
  explainCommand,
  formatTraceHuman,
  formatTraceJson,
  parseExplainFlags,
} from '@/bin/explain/index';
import { printHelp, printVersion, showCommandHelp } from '@/bin/help';
import { runHookInstallCommand } from '@/bin/hook/install';
import {
  findHookIntegrationByFlag,
  findLegacyTopLevelHookIntegration,
  type HookIntegration,
} from '@/bin/hook/integrations';
import { runRuleCommand } from '@/bin/rule';
import { printStatusline } from '@/bin/statusline';

type ParsedCommand =
  | { mode: 'hook'; integration: HookIntegration }
  | { mode: 'hook-install'; args: string[] }
  | { mode: 'hook-uninstall'; args: string[] }
  | { mode: 'rule'; args: string[] }
  | { mode: 'statusline' }
  | { mode: 'doctor'; args: string[] }
  | { mode: 'explain'; args: string[] };

type ParsedCommandHandler<T extends ParsedCommand['mode']> = (
  command: Extract<ParsedCommand, { mode: T }>,
) => Promise<void>;

/**
 * Check if --help or -h is present in args (but not as a quoted command argument).
 */
function hasHelpFlag(args: readonly string[]): boolean {
  return args.includes('--help') || args.includes('-h');
}

/**
 * Handle "help <command>" pattern.
 * Returns true if handled (printed help or error), false if not the help command.
 */
function handleHelpCommand(args: readonly string[]): boolean {
  if (args[0] !== 'help') {
    return false;
  }

  const commandName = args[1];
  if (!commandName) {
    // Just "help" with no argument - show main help
    printHelp();
    process.exit(0);
  }

  if (showCommandHelp(commandName)) {
    process.exit(0);
  }

  console.error(`Unknown command: ${commandName}`);
  console.error("Run 'cc-safety-net --help' for available commands.");
  process.exit(1);
}

/**
 * Handle "<command> --help" pattern for subcommands.
 * Returns true if handled, false otherwise.
 */
function handleCommandHelp(args: readonly string[]): boolean {
  if (!hasHelpFlag(args)) {
    return false;
  }

  const commandName = args[0];
  if (!commandName || commandName.startsWith('-')) {
    // Not a subcommand, will be handled by global help
    return false;
  }

  // Check if this is a known command
  const command = findCommand(commandName);
  if (command) {
    showCommandHelp(commandName);
    process.exit(0);
  }

  return false;
}

const commandParsers = {
  explain: (args: string[]): ParsedCommand => ({ mode: 'explain', args }),
  rule: (args: string[]): ParsedCommand => ({ mode: 'rule', args }),
  statusline: (args: string[]): ParsedCommand => {
    if (args.includes('--claude-code') || args.includes('-cc')) return { mode: 'statusline' };
    console.error('statusline requires --claude-code (-cc)');
    showCommandHelp('statusline');
    process.exit(1);
  },
  hook: (args: string[]): ParsedCommand => {
    if (args[0] === 'install') return { mode: 'hook-install', args: args.slice(1) };
    if (args[0] === 'uninstall') return { mode: 'hook-uninstall', args: args.slice(1) };

    const integration = findHookIntegrationByFlag(args);
    if (integration) return { mode: 'hook', integration };

    console.error(
      'hook requires a subcommand or integration flag. Try: cc-safety-net hook install --kimi-code',
    );
    showCommandHelp('hook');
    process.exit(1);
  },
  doctor: (args: string[]): ParsedCommand => ({ mode: 'doctor', args }),
} satisfies Record<CommandName, (args: string[]) => ParsedCommand>;

function parseCliArgs(args: string[]): ParsedCommand | null {
  // Handle "help <command>" pattern first
  if (handleHelpCommand(args)) {
    return null;
  }

  // Handle "<command> --help" pattern
  if (handleCommandHelp(args)) {
    return null;
  }

  if (args.length === 0 || hasHelpFlag(args)) {
    printHelp();
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-V')) {
    printVersion();
    process.exit(0);
  }

  const commandName = args[0];
  if (!commandName) {
    printHelp();
    process.exit(0);
  }

  const command = findCommand(commandName);
  if (command) {
    return commandParsers[command.name](args.slice(1));
  }

  const legacyIntegration = findLegacyTopLevelHookIntegration(commandName);
  if (legacyIntegration) return { mode: 'hook', integration: legacyIntegration };
  if (commandName === '--statusline') return { mode: 'statusline' };

  console.error(`Unknown option: ${commandName}`);
  console.error("Run 'cc-safety-net --help' for usage.");
  process.exit(1);
}

const commandHandlers = {
  hook: async (command) => {
    await command.integration.run();
  },
  'hook-install': async (command) => {
    process.exit(runHookInstallCommand('install', command.args));
  },
  'hook-uninstall': async (command) => {
    process.exit(runHookInstallCommand('uninstall', command.args));
  },
  rule: async (command) => {
    process.exit(await runRuleCommand(command.args));
  },
  statusline: async (_command) => {
    await printStatusline();
  },
  doctor: async (command) => {
    const flags = parseDoctorFlags(command.args);
    const exitCode = await runDoctor({
      json: flags.json,
      skipUpdateCheck: flags.skipUpdateCheck,
    });
    process.exit(exitCode);
  },
  explain: async (command) => {
    // Check for --help in explain args
    if (hasHelpFlag(command.args) || command.args.length === 0) {
      showCommandHelp('explain');
      process.exit(0);
    }

    const flags = parseExplainFlags(command.args);
    if (!flags) {
      process.exit(1);
    }

    const result = explainCommand(flags.command, { cwd: flags.cwd });
    const asciiOnly = !!process.env.NO_COLOR || !process.stdout.isTTY;

    if (flags.json) {
      console.log(formatTraceJson(result));
    } else {
      console.log(formatTraceHuman(result, { asciiOnly }));
    }
    process.exit(0);
  },
} satisfies { [Mode in ParsedCommand['mode']]: ParsedCommandHandler<Mode> };

function assertNever(command: never): never {
  throw new Error(`Unhandled command mode: ${JSON.stringify(command)}`);
}

async function runParsedCommand(command: ParsedCommand): Promise<void> {
  switch (command.mode) {
    case 'hook':
      await commandHandlers.hook(command);
      return;
    case 'hook-install':
      await commandHandlers['hook-install'](command);
      return;
    case 'hook-uninstall':
      await commandHandlers['hook-uninstall'](command);
      return;
    case 'rule':
      await commandHandlers.rule(command);
      return;
    case 'statusline':
      await commandHandlers.statusline(command);
      return;
    case 'doctor':
      await commandHandlers.doctor(command);
      return;
    case 'explain':
      await commandHandlers.explain(command);
      return;
    default:
      assertNever(command);
  }
}

async function main(): Promise<void> {
  const command = parseCliArgs(process.argv.slice(2));
  if (command) await runParsedCommand(command);
}

main().catch((error: unknown) => {
  console.error('CC Safety Net error:', error);
  process.exit(1);
});
