import { describe, expect, test } from 'bun:test';
import { findCommand, getVisibleCommands } from '@/bin/commands';

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
