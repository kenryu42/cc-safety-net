import { ENV_FLAGS } from '@/core/policy/env';
import { type Command, commands, findCommand } from './commands';

declare const __PKG_VERSION__: string | undefined;

const version = typeof __PKG_VERSION__ !== 'undefined' ? __PKG_VERSION__ : 'dev';

const INDENT = '  ';
const PROGRAM_NAME = 'cc-safety-net';

function formatOptionFlags(option: { flags: string; argument?: string }): string {
  return option.argument ? `${option.flags} ${option.argument}` : option.flags;
}

function getOptionsColumnWidth(options: readonly { flags: string; argument?: string }[]): number {
  return Math.max(...options.map((opt) => formatOptionFlags(opt).length));
}

function getSubcommandsColumnWidth(subcommands: readonly { usage: string }[]): number {
  return Math.max(...subcommands.map((subcommand) => subcommand.usage.length));
}

function getCommandSummaryWidth(commands: readonly Command[]): number {
  return Math.max(...commands.map((cmd) => `${PROGRAM_NAME} ${cmd.usage}`.length));
}

function formatCommandSummary(cmd: Command, maxUsageWidth: number): string {
  const usage = `${PROGRAM_NAME} ${cmd.usage}`;
  return `${INDENT}${usage.padEnd(maxUsageWidth + 2)}${cmd.description}`;
}

function formatEnvironmentVariable(name: string, description: string): string {
  return `${INDENT}${name.padEnd(Math.max(40, name.length + 2))}${description}`;
}

export function printCommandHelp(command: Command, write: (text: string) => void = console.log) {
  const lines: string[] = [];

  lines.push(`${PROGRAM_NAME} ${command.name}`);
  lines.push('');
  lines.push(`${INDENT}${command.description}`);
  lines.push('');

  lines.push('USAGE:');
  lines.push(`${INDENT}${PROGRAM_NAME} ${command.usage}`);
  lines.push('');

  if (command.subcommands && command.subcommands.length > 0) {
    lines.push('SUBCOMMANDS:');
    const subcommandWidth = getSubcommandsColumnWidth(command.subcommands);
    for (const subcommand of command.subcommands) {
      lines.push(
        `${INDENT}${subcommand.usage.padEnd(subcommandWidth + 2)}${subcommand.description}`,
      );
    }
    lines.push('');
  }

  if (command.options.length > 0) {
    lines.push('OPTIONS:');
    const optWidth = getOptionsColumnWidth(command.options);
    for (const opt of command.options) {
      const flags = formatOptionFlags(opt);
      const description = opt.default
        ? `${opt.description} (default: ${opt.default})`
        : opt.description;
      lines.push(`${INDENT}${flags.padEnd(optWidth + 2)}${description}`);
    }
    lines.push('');
  }

  if (command.examples && command.examples.length > 0) {
    lines.push('EXAMPLES:');
    for (const example of command.examples) {
      lines.push(`${INDENT}${example}`);
    }
  }

  write(lines.join('\n'));
}

export function printHelp(): void {
  const maxUsageWidth = getCommandSummaryWidth(commands);

  const lines: string[] = [];

  lines.push(`${PROGRAM_NAME} v${version}`);
  lines.push('');
  lines.push('Blocks destructive commands and secret access.');
  lines.push('');

  lines.push('COMMANDS:');
  for (const cmd of commands) {
    lines.push(formatCommandSummary(cmd, maxUsageWidth));
  }
  lines.push('');

  lines.push('GLOBAL OPTIONS:');
  lines.push(`${INDENT}-h, --help       Show help (use with command for command-specific help)`);
  lines.push(`${INDENT}-V, --version    Show version`);
  lines.push('');

  lines.push('HELP:');
  lines.push(`${INDENT}${PROGRAM_NAME} help <command>     Show help for a specific command`);
  lines.push(`${INDENT}${PROGRAM_NAME} <command> --help   Show help for a specific command`);
  lines.push('');

  lines.push('ENVIRONMENT VARIABLES:');
  lines.push(
    formatEnvironmentVariable(
      `${ENV_FLAGS.level.name}=standard|strict|paranoid`,
      'Set session safety level',
    ),
  );
  lines.push(
    formatEnvironmentVariable(
      `${ENV_FLAGS.worktree.name}=1`,
      'Allow local git discards in linked worktrees',
    ),
  );
  lines.push(
    formatEnvironmentVariable(`${ENV_FLAGS.debug.name}=1`, 'Print diagnostic messages to stderr'),
  );
  lines.push(
    formatEnvironmentVariable(
      `${ENV_FLAGS.auditScope.name}=all|blocked`,
      'Record all command decisions, or denials only',
    ),
  );
  lines.push(
    formatEnvironmentVariable('CC_SAFETY_NET_HOME', 'Override rule config home directory'),
  );
  lines.push('');
  lines.push('LEGACY ENVIRONMENT VARIABLES (STILL SUPPORTED):');
  lines.push(
    formatEnvironmentVariable(
      `${ENV_FLAGS.strict.name}=1`,
      'Force safety.overrides.fail_closed on',
    ),
  );
  lines.push(
    formatEnvironmentVariable(
      `${ENV_FLAGS.paranoid.name}=1`,
      'Force paranoid_rm and paranoid_interpreters on',
    ),
  );
  lines.push(
    formatEnvironmentVariable(
      `${ENV_FLAGS.paranoidRm.name}=1`,
      'Force safety.overrides.paranoid_rm on',
    ),
  );
  lines.push(
    formatEnvironmentVariable(
      `${ENV_FLAGS.paranoidInterpreters.name}=1`,
      'Force safety.overrides.paranoid_interpreters on',
    ),
  );
  lines.push('');
  lines.push('Documentation:        https://ccsafetynet.com/docs');

  console.log(lines.join('\n'));
}

export function printVersion(): void {
  console.log(version);
}

export function showCommandHelp(
  commandName: string,
  write: (text: string) => void = console.log,
): boolean {
  const command = findCommand(commandName);
  if (!command) {
    return false;
  }
  if (command.name.toLowerCase() !== commandName.toLowerCase()) {
    return false;
  }
  printCommandHelp(command, write);
  return true;
}
