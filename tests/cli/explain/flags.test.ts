/**
 * Tests for parseExplainFlags unit parsing behavior.
 */
import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { parseExplainFlags } from '@/cli/explain/flags';
import { parseCommand } from '@/parser/command';

describe('parseExplainFlags', () => {
  let capturedStderr: string[];
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    capturedStderr = [];
    originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      capturedStderr.push(args.map(String).join(' '));
    };
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  function getStderr(): string {
    return capturedStderr.join('\n');
  }

  test('parses --json and command args', () => {
    const flags = parseExplainFlags(['--json', 'git', 'status']);
    expect(flags).not.toBeNull();
    if (!flags) return;
    expect(flags.json).toBe(true);
    expect(flags.cwd).toBeUndefined();
    expect(flags.command).toBe('git status');
  });

  test('parses --cwd and command args', () => {
    const flags = parseExplainFlags(['--cwd', process.cwd(), 'rm', '-rf', './foo']);
    expect(flags).not.toBeNull();
    if (!flags) return;
    expect(flags.json).toBe(false);
    expect(flags.cwd).toBe(process.cwd());
    expect(flags.command).toBe('rm -rf ./foo');
  });

  test('skips help flags and continues parsing', () => {
    const flags = parseExplainFlags(['-h', '--json', 'echo']);
    expect(flags).not.toBeNull();
    if (!flags) return;
    expect(flags.json).toBe(true);
    expect(flags.command).toBe('echo');
  });

  test('treats -- separator as command start', () => {
    const flags = parseExplainFlags(['--json', '--', '--debug', '--verbose']);
    expect(flags).not.toBeNull();
    if (!flags) return;
    expect(flags.json).toBe(true);
    expect(flags.command).toBe('--debug --verbose');
  });

  test('rejects an unknown flag instead of analyzing different text', () => {
    const flags = parseExplainFlags(['--jsoon', 'rm -rf /']);
    expect(flags).toBeNull();
    expect(getStderr()).toContain('Unknown option for explain: --jsoon');
  });

  test('keeps an unknown flag as command input after the -- separator', () => {
    const flags = parseExplainFlags(['--json', '--', '--unknown-flag', 'foo']);
    expect(flags).not.toBeNull();
    if (!flags) return;
    expect(flags.command).toBe('--unknown-flag foo');
  });

  test('preserves single-arg command with shell operators', () => {
    const flags = parseExplainFlags(['--json', 'git status | rm -rf /']);
    expect(flags).not.toBeNull();
    if (!flags) return;
    expect(flags.command).toBe('git status | rm -rf /');
  });

  // The joined command is re-parsed downstream, so quoting must return the exact argv it was
  // given; a plain space join would silently explain a different command.
  test.each([
    ['spaces', ['echo', 'hello world']],
    ['a single quote', ['echo', "it's"]],
    ['shell metacharacters', ['grep', '-e', 'a|b', 'file.txt']],
    ['an expansion', ['echo', '$HOME']],
    ['a double quote', ['echo', 'a"b']],
    ['an empty argument', ['echo', '']],
  ])('quotes multiple arguments so %s survives a reparse', (_label, args) => {
    const flags = parseExplainFlags([...args]);
    expect(flags).not.toBeNull();
    if (!flags) return;
    expect(
      parseCommand(flags.command, 'posix').nodes.flatMap((node) =>
        node.kind === 'command' ? node.words.map((word) => word.text) : [],
      ),
    ).toEqual(args);
  });

  test('errors when command is missing', () => {
    const flags = parseExplainFlags(['--json']);
    expect(flags).toBeNull();
    const stderr = getStderr();
    expect(stderr).toContain('No command provided');
    expect(stderr).toContain('Usage: cc-safety-net explain');
  });

  test('errors when --cwd has no value', () => {
    const flags = parseExplainFlags(['--cwd']);
    expect(flags).toBeNull();
    expect(getStderr()).toContain('--cwd requires a value');
  });

  test('errors when --cwd value is another flag', () => {
    const flags = parseExplainFlags(['--cwd', '--json', 'echo']);
    expect(flags).toBeNull();
    expect(getStderr()).toContain('--cwd requires a value');
  });

  test('errors when --cwd path does not exist', () => {
    const flags = parseExplainFlags(['--cwd', '/definitely/not/here', 'rm -rf /tmp/x']);
    expect(flags).toBeNull();
    expect(getStderr()).toContain('--cwd path does not exist: /definitely/not/here');
  });
});
