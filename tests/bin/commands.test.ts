import { describe, expect, test } from 'bun:test';
import { findCommand, getVisibleCommands } from '@/bin/commands';
import { runSafetyNetCli } from '../helpers';

describe('command registry', () => {
  describe('findCommand', () => {
    test('finds command by name', () => {
      const cmd = findCommand('doctor');
      expect(cmd).toBeDefined();
      expect(cmd?.name).toBe('doctor');
    });

    test('does not register legacy top-level hook aliases as commands', () => {
      expect(findCommand('-cc')).toBeUndefined();
      expect(findCommand('--claude-code')).toBeUndefined();
      expect(findCommand('-cp')).toBeUndefined();
      expect(findCommand('--copilot-cli')).toBeUndefined();
      expect(findCommand('-gc')).toBeUndefined();
      expect(findCommand('--gemini-cli')).toBeUndefined();
    });

    test('finds command case-insensitively', () => {
      const cmd = findCommand('DOCTOR');
      expect(cmd).toBeDefined();
      expect(cmd?.name).toBe('doctor');
    });

    test('returns undefined for unknown command', () => {
      const cmd = findCommand('nonexistent');
      expect(cmd).toBeUndefined();
    });

    test('does not register legacy verify-config command or aliases', () => {
      expect(findCommand('verify-config')).toBeUndefined();
      expect(findCommand('--verify-config')).toBeUndefined();
      expect(findCommand('-vc')).toBeUndefined();
    });

    test('finds rule command and does not alias old rules command', () => {
      expect(findCommand('rule')?.name).toBe('rule');
      expect(findCommand('rules')).toBeUndefined();
    });
  });

  describe('getVisibleCommands', () => {
    test('returns all non-hidden commands', () => {
      const visible = getVisibleCommands();
      expect(visible.length).toBeGreaterThan(0);

      const names = visible.map((c) => c.name);
      expect(names).toEqual(['doctor', 'explain', 'rule', 'hook', 'statusline']);
    });
  });
});

describe('command definitions', () => {
  test('all commands have required fields', () => {
    const visible = getVisibleCommands();
    for (const cmd of visible) {
      expect(cmd.name).toBeDefined();
      expect(cmd.description).toBeDefined();
      expect(cmd.usage).toBeDefined();
      expect(cmd.options).toBeDefined();
      expect(Array.isArray(cmd.options)).toBe(true);
    }
  });

  test('all commands have help option', () => {
    const visible = getVisibleCommands();
    for (const cmd of visible) {
      const hasHelpOption = cmd.options.some(
        (opt) => opt.flags.includes('--help') || opt.flags.includes('-h'),
      );
      expect(hasHelpOption).toBe(true);
    }
  });

  test('doctor command has expected options', () => {
    const cmd = findCommand('doctor');
    expect(cmd).toBeDefined();

    const flags = cmd?.options.map((opt) => opt.flags);
    expect(flags).toContain('--json');
    expect(flags).toContain('--skip-update-check');
  });

  test('explain command has expected options', () => {
    const cmd = findCommand('explain');
    expect(cmd).toBeDefined();

    const flags = cmd?.options.map((opt) => opt.flags);
    expect(flags).toContain('--json');
    expect(flags).toContain('--cwd');
  });
});

describe('command routing', () => {
  test('registered command names route through the CLI dispatcher', async () => {
    const cases: Array<{ args: string[]; output: string; stderr?: string; exitCode?: number }> = [
      { args: ['doctor', '--json', '--skip-update-check'], output: '"hooks"' },
      { args: ['explain', '--help'], output: 'USAGE:\n  cc-safety-net explain' },
      { args: ['rule', '--help'], output: 'USAGE:\n  cc-safety-net rule' },
      { args: ['hook', '--help'], output: 'USAGE:\n  cc-safety-net hook' },
      {
        args: ['statusline'],
        output: 'USAGE:\n  cc-safety-net statusline',
        stderr: 'statusline requires --claude-code (-cc)',
        exitCode: 1,
      },
    ];

    for (const command of cases) {
      const result = await runSafetyNetCli(command.args);

      expect(result.exitCode).toBe(command.exitCode ?? 0);
      expect(result.output).toContain(command.output);
      if (command.stderr !== undefined) expect(result.stderr).toContain(command.stderr);
    }
  });

  test('bare hook command explains the missing subcommand or integration flag', async () => {
    const result = await runSafetyNetCli(['hook']);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain(
      'hook requires a subcommand or integration flag. Try: cc-safety-net hook install --opencode',
    );
    expect(result.output).toContain('USAGE:\n  cc-safety-net hook');
  });
});
