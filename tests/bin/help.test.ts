import { describe, expect, test } from 'bun:test';
import { findCommand } from '@/bin/commands';
import { printCommandHelp, printHelp, printVersion, showCommandHelp } from '@/bin/help';
import { runCCSafetyNetCli } from '../helpers';

/**
 * Capture console.log output during a function call.
 */
function captureOutput<T>(fn: () => T) {
  const originalLog = console.log;
  let output = '';
  console.log = (...args: unknown[]) => {
    output += `${args.map(String).join(' ')}\n`;
  };
  try {
    const result = fn();
    return { output, result };
  } finally {
    console.log = originalLog;
  }
}

describe('help output', () => {
  describe('removed legacy flags', () => {
    test('rejects --verify-config as unknown', async () => {
      const result = await runCCSafetyNetCli(['--verify-config']);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Unknown option: --verify-config');
    });

    test('rejects -vc as unknown', async () => {
      const result = await runCCSafetyNetCli(['-vc']);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Unknown option: -vc');
    });

    test('does not route doctor when it is not the command name', async () => {
      const nestedCommand = await runCCSafetyNetCli(['xxx', 'doctor']);
      const nestedAlias = await runCCSafetyNetCli(['xxx', '--doctor']);

      expect(nestedCommand.exitCode).toBe(1);
      expect(nestedCommand.stderr).toContain('Unknown option: xxx');
      expect(nestedAlias.exitCode).toBe(1);
      expect(nestedAlias.stderr).toContain('Unknown option: xxx');
    });

    test('supports doctor command alias only as the first argument', async () => {
      const result = await runCCSafetyNetCli(['--doctor', '--json', '--skip-update-check']);

      expect(JSON.parse(result.output)).toHaveProperty('hooks');
    });

    test('doctor json output contains the full top-level report shape', async () => {
      const result = await runCCSafetyNetCli(['doctor', '--json', '--skip-update-check']);
      const report = JSON.parse(result.output);

      expect(result.exitCode).toBeGreaterThanOrEqual(0);
      expect(report).toHaveProperty('hooks');
      expect(report).toHaveProperty('userConfig');
      expect(report).toHaveProperty('projectConfig');
      expect(report).toHaveProperty('effectiveRules');
      expect(report).toHaveProperty('shadowedRules');
      expect(report).toHaveProperty('environment');
      expect(report).toHaveProperty('activity');
      expect(report).toHaveProperty('update');
      expect(report).toHaveProperty('system');
    });
  });

  describe('printHelp (main help)', () => {
    test('prints exact main help output', () => {
      const { output } = captureOutput(() => printHelp());

      expect(output).toBe(`cc-safety-net vdev

Blocks destructive git and filesystem commands before execution.

COMMANDS:
  cc-safety-net doctor [options]             Run diagnostic checks to verify installation and configuration
  cc-safety-net explain [options] <command>  Show step-by-step analysis trace of how a command would be analyzed
  cc-safety-net rule <subcommand>            Manage CC Safety Net rulebook sources
  cc-safety-net hook <coding cli>            Run as an agent CLI hook (reads JSON from stdin)
  cc-safety-net statusline <coding cli>      Print status line with mode indicators for shell integration

GLOBAL OPTIONS:
  -h, --help       Show help (use with command for command-specific help)
  -V, --version    Show version

HELP:
  cc-safety-net help <command>     Show help for a specific command
  cc-safety-net <command> --help   Show help for a specific command

ENVIRONMENT VARIABLES:
  CC_SAFETY_NET_STRICT=1                  Fail-closed on unparseable commands
  CC_SAFETY_NET_PARANOID=1                Enable all paranoid checks
  CC_SAFETY_NET_PARANOID_RM=1             Block non-temp rm -rf within cwd
  CC_SAFETY_NET_PARANOID_INTERPRETERS=1   Block interpreter one-liners
  CC_SAFETY_NET_WORKTREE=1                Allow local git discards in linked worktrees
  CC_SAFETY_NET_DEBUG=1                   Log allowed hook commands for debugging
  CC_SAFETY_NET_HOME                      Override rule config home directory
`);
    });

    test('contains version header', () => {
      const { output } = captureOutput(() => printHelp());
      expect(output).toContain('cc-safety-net v');
    });

    test('contains description', () => {
      const { output } = captureOutput(() => printHelp());
      expect(output).toContain('Blocks destructive git and filesystem commands');
    });

    test('lists all visible commands', () => {
      const { output } = captureOutput(() => printHelp());
      expect(output).toContain('doctor');
      expect(output).toContain('explain');
      expect(output).toContain('hook');
      expect(output).not.toContain('cc-safety-net -cc');
      expect(output).not.toContain('cc-safety-net -gc');
      expect(output).not.toContain('verify-config');
    });

    test('contains COMMANDS section', () => {
      const { output } = captureOutput(() => printHelp());
      expect(output).toContain('COMMANDS:');
    });

    test('contains GLOBAL OPTIONS section', () => {
      const { output } = captureOutput(() => printHelp());
      expect(output).toContain('GLOBAL OPTIONS:');
      expect(output).toContain('--help');
      expect(output).toContain('--version');
    });

    test('contains HELP section with usage hints', () => {
      const { output } = captureOutput(() => printHelp());
      expect(output).toContain('HELP:');
      expect(output).toContain('help <command>');
      expect(output).toContain('<command> --help');
    });

    test('contains ENVIRONMENT VARIABLES section', () => {
      const { output } = captureOutput(() => printHelp());
      expect(output).toContain('ENVIRONMENT VARIABLES:');
      expect(output).toContain('CC_SAFETY_NET_STRICT');
      expect(output).toContain('CC_SAFETY_NET_PARANOID');
      expect(output).toContain('CC_SAFETY_NET_WORKTREE');
      expect(output).toContain('CC_SAFETY_NET_DEBUG');
      expect(output).toContain('CC_SAFETY_NET_HOME');
    });

    test('omits config files from main help', () => {
      const { output } = captureOutput(() => printHelp());
      expect(output).not.toContain('CONFIG FILES:');
    });
  });

  describe('printVersion', () => {
    test('prints version string', () => {
      const { output } = captureOutput(() => printVersion());
      // Version is either "dev" or a semver string
      expect(output.trim()).toMatch(/^(dev|\d+\.\d+\.\d+.*)$/);
    });
  });

  describe('printCommandHelp (subcommand help)', () => {
    test('prints command name', () => {
      const cmd = findCommand('doctor');
      if (!cmd) throw new Error('doctor command not found');
      const { output } = captureOutput(() => printCommandHelp(cmd));
      expect(output).toContain('cc-safety-net doctor');
    });

    test('prints description', () => {
      const cmd = findCommand('doctor');
      if (!cmd) throw new Error('doctor command not found');
      const { output } = captureOutput(() => printCommandHelp(cmd));
      expect(output).toContain('Run diagnostic checks');
    });

    test('prints USAGE section', () => {
      const cmd = findCommand('doctor');
      if (!cmd) throw new Error('doctor command not found');
      const { output } = captureOutput(() => printCommandHelp(cmd));
      expect(output).toContain('USAGE:');
      expect(output).toContain('doctor [options]');
    });

    test('prints OPTIONS section', () => {
      const cmd = findCommand('doctor');
      if (!cmd) throw new Error('doctor command not found');
      const { output } = captureOutput(() => printCommandHelp(cmd));
      expect(output).toContain('OPTIONS:');
      expect(output).toContain('--json');
      expect(output).toContain('--skip-update-check');
    });

    test('prints EXAMPLES section when available', () => {
      const cmd = findCommand('doctor');
      if (!cmd) throw new Error('doctor command not found');
      const { output } = captureOutput(() => printCommandHelp(cmd));
      expect(output).toContain('EXAMPLES:');
      expect(output).toContain('cc-safety-net doctor');
    });

    test('explain command shows --cwd option with argument', () => {
      const cmd = findCommand('explain');
      if (!cmd) throw new Error('explain command not found');
      const { output } = captureOutput(() => printCommandHelp(cmd));
      expect(output).toContain('--cwd');
      expect(output).toContain('<path>');
    });

    test('rule command prints subcommands', () => {
      const cmd = findCommand('rule');
      if (!cmd) throw new Error('rule command not found');
      const { output } = captureOutput(() => printCommandHelp(cmd));
      expect(output).toContain('SUBCOMMANDS:');
      expect(output).toContain('verify');
      expect(output).toContain('--delete-source');
      expect(output).not.toContain('explain -- <command>');
    });

    test('hook command prints platform flags', () => {
      const cmd = findCommand('hook');
      if (!cmd) throw new Error('hook command not found');
      const { output } = captureOutput(() => printCommandHelp(cmd));
      expect(output).toContain('cc-safety-net hook');
      expect(output).toContain('-cc, --claude-code');
      expect(output).toContain('-cp, --copilot-cli');
      expect(output).toContain('-gc, --gemini-cli');
      expect(output).toContain('-kc, --kimi-code');
      expect(output).toContain('cc-safety-net hook --claude-code');
      expect(output).toContain('cc-safety-net hook --kimi-code');
      expect(output).toContain('install --kimi-code');
      expect(output).toContain('uninstall --kimi-code');
      expect(output).not.toContain('install --opencode');
      expect(output).not.toContain('uninstall --opencode');
    });

    test('statusline command prints Claude Code platform flag', () => {
      const cmd = findCommand('statusline');
      if (!cmd) throw new Error('statusline command not found');
      const { output } = captureOutput(() => printCommandHelp(cmd));
      expect(output).toContain('cc-safety-net statusline');
      expect(output).toContain('statusline <coding cli>');
      expect(output).toContain('-cc, --claude-code');
      expect(output).toContain('cc-safety-net statusline --claude-code');
    });
  });

  describe('showCommandHelp', () => {
    test('returns true and prints help for valid command', () => {
      const { output, result } = captureOutput(() => showCommandHelp('doctor'));

      expect(result).toBe(true);
      expect(output).toContain('cc-safety-net doctor');
    });

    test('returns true for hook command', () => {
      const { output, result } = captureOutput(() => showCommandHelp('hook'));

      expect(result).toBe(true);
      expect(output).toContain('cc-safety-net hook');
    });

    test('returns false for old top-level hook aliases', () => {
      expect(showCommandHelp('-cc')).toBe(false);
      expect(showCommandHelp('--claude-code')).toBe(false);
    });

    test('returns false for legacy statusline alias', () => {
      expect(showCommandHelp('--statusline')).toBe(false);
    });

    test('returns false for unknown command', () => {
      const result = showCommandHelp('nonexistent');
      expect(result).toBe(false);
    });
  });
});
