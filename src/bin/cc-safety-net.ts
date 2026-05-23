#!/usr/bin/env node
import { findCommand } from '@/bin/commands';
import { parseDoctorFlags, runDoctor } from '@/bin/doctor/index';
import {
  explainCommand,
  formatTraceHuman,
  formatTraceJson,
  parseExplainFlags,
} from '@/bin/explain/index';
import { printHelp, printVersion, showCommandHelp } from '@/bin/help';
import { runClaudeCodeHook } from '@/bin/hook/claude-code';
import { runCopilotCliHook } from '@/bin/hook/copilot-cli';
import { runGeminiCLIHook } from '@/bin/hook/gemini-cli';
import { runHookInstallCommand } from '@/bin/hook/install';
import { runKimiCliHook } from '@/bin/hook/kimi-cli';
import { runRuleCommand } from '@/bin/rule';
import { printStatusline } from '@/bin/statusline';

type CommandMode =
  | 'claude-code'
  | 'copilot-cli'
  | 'gemini-cli'
  | 'kimi-cli'
  | 'hook-install'
  | 'hook-uninstall'
  | 'rule'
  | 'statusline'
  | 'doctor'
  | 'explain';

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

function handleCliFlags(): CommandMode | null {
  const args = process.argv.slice(2);

  // Handle "help <command>" pattern first
  if (handleHelpCommand(args)) {
    return null;
  }

  // Handle "<command> --help" pattern
  if (handleCommandHelp(args)) {
    return null;
  }

  if (args[0] === 'explain') {
    return 'explain';
  }

  if (args[0] === 'rule') {
    return 'rule';
  }

  if (args[0] === 'statusline') {
    if (args.includes('--claude-code') || args.includes('-cc')) return 'statusline';
    showCommandHelp('statusline');
    process.exit(1);
  }

  if (args[0] === 'hook') {
    if (args[1] === 'install') return 'hook-install';
    if (args[1] === 'uninstall') return 'hook-uninstall';
    if (args.includes('--claude-code') || args.includes('-cc')) return 'claude-code';
    if (args.includes('--copilot-cli') || args.includes('-cp')) return 'copilot-cli';
    if (args.includes('--gemini-cli') || args.includes('-gc')) return 'gemini-cli';
    if (args.includes('--kimi-cli')) return 'kimi-cli';
    if (args.includes('-kc')) return 'kimi-cli';
    showCommandHelp('hook');
    process.exit(1);
  }

  if (args.length === 0 || hasHelpFlag(args)) {
    printHelp();
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-V')) {
    printVersion();
    process.exit(0);
  }

  if (args.includes('doctor') || args.includes('--doctor')) {
    return 'doctor';
  }

  if (args[0] === '--claude-code' || args[0] === '-cc') {
    return 'claude-code';
  }

  if (args[0] === '--copilot-cli' || args[0] === '-cp') {
    return 'copilot-cli';
  }

  if (args[0] === '--gemini-cli' || args[0] === '-gc') {
    return 'gemini-cli';
  }

  if (args[0] === '--kimi-cli' || args[0] === '-kc') {
    return 'kimi-cli';
  }

  console.error(`Unknown option: ${args[0]}`);
  console.error("Run 'cc-safety-net --help' for usage.");
  process.exit(1);
}

async function main(): Promise<void> {
  const mode = handleCliFlags();
  if (mode === 'claude-code') {
    await runClaudeCodeHook();
  } else if (mode === 'copilot-cli') {
    await runCopilotCliHook();
  } else if (mode === 'gemini-cli') {
    await runGeminiCLIHook();
  } else if (mode === 'kimi-cli') {
    await runKimiCliHook();
  } else if (mode === 'hook-install') {
    process.exit(runHookInstallCommand('install', process.argv.slice(4)));
  } else if (mode === 'hook-uninstall') {
    process.exit(runHookInstallCommand('uninstall', process.argv.slice(4)));
  } else if (mode === 'rule') {
    process.exit(await runRuleCommand(process.argv.slice(3)));
  } else if (mode === 'statusline') {
    await printStatusline();
  } else if (mode === 'doctor') {
    const flags = parseDoctorFlags(process.argv.slice(2));
    const exitCode = await runDoctor({
      json: flags.json,
      skipUpdateCheck: flags.skipUpdateCheck,
    });
    process.exit(exitCode);
  } else if (mode === 'explain') {
    const args = process.argv.slice(3);

    // Check for --help in explain args
    if (hasHelpFlag(args) || args.length === 0) {
      showCommandHelp('explain');
      process.exit(0);
    }

    const flags = parseExplainFlags(args);
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
  }
}

main().catch((error: unknown) => {
  console.error('Safety Net error:', error);
  process.exit(1);
});
