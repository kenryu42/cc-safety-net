import { afterEach, describe, expect, test } from 'bun:test';
import { installCursor } from '@next/hosts/cursor/install';
import {
  type CliRow,
  expectSameCli,
  runCliDifferential,
  runPortedCli,
} from '../helpers/cli-differential';
import { environmentFor, removeTempRoots } from '../helpers/temp-home';

/**
 * Dispatch is contract: the same argument vector has to reach the same handler, print the same
 * bytes and exit the same way through both bins, even though the ported one resolves the hook
 * verb before it loads the CLI chunk at all. Every row below is one argument vector; the
 * differential decides, and the pin behind it stops both sides passing by staying silent.
 */

afterEach(() => {
  removeTempRoots();
});

const differential = async (row: CliRow) => expectSameCli(await runCliDifferential(row));

describe('help', () => {
  for (const args of [['help'], ['--help'], ['-h'], []]) {
    test(`\`${args.join(' ') || 'no arguments'}\` prints the main help`, async () => {
      const shipped = await differential({ args });
      expect(shipped.exitCode).toBe(0);
      expect(shipped.stdout).toContain('cc-safety-net vdev');
      expect(shipped.stderr).toBe('');
    }, 60_000);
  }

  for (const name of [
    'status',
    'doctor',
    'logs',
    'explain',
    'rule',
    'policy',
    'install',
    'update',
    'uninstall',
    'hook',
    'gui',
    'statusline',
  ]) {
    test(`\`help ${name}\` prints the command help`, async () => {
      const shipped = await differential({ args: ['help', name] });
      expect(shipped.exitCode).toBe(0);
      expect(shipped.stdout.split('\n')[0]).toBe(`cc-safety-net ${name}`);
    }, 60_000);
  }

  test('`help frob` names the unknown command', async () => {
    const shipped = await differential({ args: ['help', 'frob'] });
    expect(shipped.exitCode).toBe(1);
    expect(shipped.stderr).toBe(
      "Unknown command: frob\nRun 'cc-safety-net --help' for available commands.\n",
    );
  }, 60_000);

  for (const args of [
    ['status', '--help'],
    ['doctor', '-h'],
  ]) {
    test(`\`${args.join(' ')}\` prints that command's help`, async () => {
      const shipped = await differential({ args });
      expect(shipped.exitCode).toBe(0);
      expect(shipped.stdout.split('\n')[0]).toBe(`cc-safety-net ${args[0]}`);
    }, 60_000);
  }
});

describe('version', () => {
  for (const args of [['--version'], ['-V']]) {
    test(`\`${args.join(' ')}\` prints the version`, async () => {
      const shipped = await differential({ args });
      expect(shipped.exitCode).toBe(0);
      expect(shipped.stdout).toBe('dev\n');
    }, 60_000);
  }

  // The ported bin resolves the legacy top-level hook flags itself, so the global scan has to
  // gate that lookup: without it `-cc -V` would run the Claude Code hook over an empty stdin
  // instead of answering the version request the shipped bin answers.
  test('`-cc -V` prints the version instead of running the Claude Code hook', async () => {
    const shipped = await differential({ args: ['-cc', '-V'] });
    expect(shipped.exitCode).toBe(0);
    expect(shipped.stdout).toBe('dev\n');
  }, 60_000);
});

describe('unknown input', () => {
  test('`frob` is an unknown command', async () => {
    const shipped = await differential({ args: ['frob'] });
    expect(shipped.exitCode).toBe(1);
    expect(shipped.stderr).toBe("Unknown command: frob\nRun 'cc-safety-net --help' for usage.\n");
  }, 60_000);

  test('`--frob` is an unknown option', async () => {
    const shipped = await differential({ args: ['--frob'] });
    expect(shipped.exitCode).toBe(1);
    expect(shipped.stderr.split('\n')[0]).toBe('Unknown option: --frob');
  }, 60_000);

  test('`status extra` refuses the positional', async () => {
    const shipped = await differential({ args: ['status', 'extra'] });
    expect(shipped.exitCode).toBe(1);
    expect(shipped.stderr).toBe('Unexpected argument for status: extra\n');
    expect(shipped.stdout).toBe('');
  }, 60_000);
});

describe('hook', () => {
  for (const args of [['hook'], ['hook', '--cursor', '--kimi-code']]) {
    test(`\`${args.join(' ')}\` names no integration`, async () => {
      const shipped = await differential({ args });
      expect(shipped.exitCode).toBe(1);
      expect(shipped.stdout).toBe('');
      expect(shipped.stderr.split('\n')[0]).toBe(
        'hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code',
      );
      expect(shipped.stderr).toContain('-cc, --coding-cli');
    }, 60_000);
  }

  // The other half of the scan gate: the flag names an integration, but the request is for help.
  test('`hook --claude-code --help` prints the hook help', async () => {
    const shipped = await differential({ args: ['hook', '--claude-code', '--help'] });
    expect(shipped.exitCode).toBe(0);
    expect(shipped.stdout.split('\n')[0]).toBe('cc-safety-net hook');
    expect(shipped.stderr).toBe('');
  }, 60_000);
});

describe('install, update and uninstall reach the Phase 6 flows', () => {
  test('`install --cursor` writes the Cursor hook', async () => {
    const shipped = await differential({ args: ['install', '--cursor'] });
    expect(shipped.exitCode).toBe(0);
    expect(shipped.stdout).toBe('Installed Cursor hook in <root>/home/.cursor/hooks.json\n');
    expect(shipped.tree.map((entry) => entry.path)).toContain('home/.cursor/hooks.json');
  }, 60_000);

  test('`uninstall --cursor` removes it again', async () => {
    const shipped = await differential({
      args: ['uninstall', '--cursor'],
      seed: (side) => {
        installCursor(environmentFor(side.home, side.env));
      },
    });
    expect(shipped.exitCode).toBe(0);
    expect(shipped.stdout).toBe('Uninstalled Cursor hook from <root>/home/.cursor/hooks.json\n');
  }, 60_000);

  test('`install` with no target and no terminal refuses to guess', async () => {
    const shipped = await differential({ args: ['install'] });
    expect(shipped.exitCode).toBe(1);
    expect(shipped.stdout).toBe('');
    expect(shipped.stderr.split('\n')[0]).toStartWith('Choose exactly one install target: ');
  }, 60_000);

  test('`update --nope` fails on the flag before any registry probe', async () => {
    const shipped = await differential({ args: ['update', '--nope'] });
    expect(shipped.exitCode).toBe(1);
    expect(shipped.stdout).toBe('');
    expect(shipped.stderr).toBe('Unknown option for update: --nope\n');
  }, 60_000);
});

// `gui` lands in Phase 9; until then it names itself on one stderr line. The shipped side is
// not run: its `gui` starts a loopback server that never exits.
describe('the commands this build does not carry', () => {
  for (const [name, args] of [['gui', ['gui', '--no-open']]] as const) {
    test(`\`${args.join(' ')}\` says the ${name} command is unavailable`, () => {
      const ported = runPortedCli({ args });
      expect(ported.stdout).toBe('');
      expect(ported.exitCode).toBe(1);
      expect(ported.stderr).toBe(
        `cc-safety-net: the ${name} command is not available in this build\n`,
      );
    }, 60_000);
  }
});
