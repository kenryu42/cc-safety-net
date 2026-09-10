import { describe, expect, test } from 'bun:test';
import { safetyNetSubcommandIndex } from '@/gate/guards/safety-net-invocation';

/**
 * Two guards read this index with opposite strictness, so every runner spelling is stated in
 * both modes: a wrong answer either exempts a real command from secret protection or lets
 * `policy apply` through.
 */

const RUNNER_COMMANDS = [
  'cc-safety-net',
  'ccsn',
  'npx',
  'bunx',
  'pnpx',
  'pnpm',
  'yarn',
  'npm',
  'bun',
  'node',
  'deno',
  'sh',
];

const TOKEN_LISTS: readonly (readonly string[])[] = [
  [],
  ['explain', 'rm -rf /'],
  ['policy', 'apply'],
  ['-y', 'cc-safety-net', 'explain', 'x'],
  ['--yes', 'ccsn', 'policy', 'apply'],
  ['cc-safety-net', 'policy', 'apply'],
  ['ccsn@latest', 'explain', 'x'],
  ['cc-safety-net@2.3.0', 'status'],
  ['cc-safety-net@npm:other', 'status'],
  ['cc-safety-net@file:../local', 'status'],
  ['cc-safety-net@', 'status'],
  ['@scope/cc-safety-net', 'status'],
  ['./node_modules/.bin/cc-safety-net', 'status'],
  ['--loglevel=silent', 'cc-safety-net', 'policy', 'apply'],
  ['--package', 'cc-safety-net', 'ccsn', 'policy', 'apply'],
  ['dlx', 'cc-safety-net', 'policy', 'apply'],
  ['dlx', '-y', 'cc-safety-net', 'policy', 'apply'],
  ['dlx', 'other-package', 'policy', 'apply'],
  ['--silent', 'dlx', 'cc-safety-net', 'policy', 'apply'],
  ['exec', 'cc-safety-net', 'policy', 'apply'],
  ['exec', 'ccsn', 'explain', 'cat ~/.ssh/config'],
  ['--silent', 'exec', 'cc-safety-net', 'policy', 'apply'],
  ['exec', '--', 'cc-safety-net', 'policy', 'apply'],
  ['run', 'dist/bin/cc-safety-net.js', 'policy', 'apply'],
  ['run', 'other.js', 'policy', 'apply'],
  ['dist/bin/cc-safety-net.js', 'policy', 'apply'],
  ['src/cli/cc-safety-net.ts', 'explain', 'x'],
  ['/opt/app/dist/bin/cc-safety-net.js', 'policy', 'apply'],
  ['C:\\app\\dist\\bin\\cc-safety-net.js', 'policy', 'apply'],
  ['--experimental-strip-types', 'src/cli/cc-safety-net.ts', 'explain', 'x'],
  ['--', 'dist/bin/cc-safety-net.js', 'policy', 'apply'],
  ['cc-safety-net'],
  ['ccsn', 'ccsn', 'explain', 'x'],
];

const MODES = [{}, { broad: false }, { broad: true }];

describe('safetyNetSubcommandIndex', () => {
  const rows = RUNNER_COMMANDS.flatMap((command) =>
    TOKEN_LISTS.flatMap((tokens) => MODES.map((options) => ({ command, tokens, options }))),
  );

  /** `narrow` is the exempting consumer's answer, `broad` the blocking one's. */
  test('locates the subcommand of a runner spelling, under-matching or over-matching by mode', () => {
    const spellings: readonly {
      readonly command: string;
      readonly tokens: readonly string[];
      readonly narrow: number | null;
      readonly broad: number | null;
    }[] = [
      { command: 'cc-safety-net', tokens: ['explain', 'x'], narrow: 0, broad: 0 },
      { command: 'ccsn', tokens: [], narrow: 0, broad: 0 },
      { command: 'npx', tokens: ['cc-safety-net', 'policy', 'apply'], narrow: 1, broad: 1 },
      { command: 'npx', tokens: ['-y', 'cc-safety-net', 'explain', 'x'], narrow: 2, broad: 2 },
      // Only the documented consent flag is skipped by the exemption; the blocking consumer
      // looks past any option in front of the target.
      {
        command: 'npx',
        tokens: ['--loglevel=silent', 'cc-safety-net', 'policy', 'apply'],
        narrow: null,
        broad: 2,
      },
      {
        command: 'npx',
        tokens: ['--package', 'cc-safety-net', 'ccsn', 'policy', 'apply'],
        narrow: null,
        broad: 3,
      },
      // A version or tag suffix resolves this package; a protocol, a scope or a path does not.
      { command: 'npx', tokens: ['ccsn@latest', 'explain', 'x'], narrow: 1, broad: 1 },
      { command: 'npx', tokens: ['cc-safety-net@npm:other', 'status'], narrow: null, broad: null },
      { command: 'npx', tokens: ['@scope/cc-safety-net', 'status'], narrow: null, broad: null },
      {
        command: 'npx',
        tokens: ['./node_modules/.bin/cc-safety-net', 'status'],
        narrow: null,
        broad: null,
      },
      { command: 'pnpm', tokens: ['dlx', 'cc-safety-net', 'policy', 'apply'], narrow: 2, broad: 2 },
      // Yarn Classic runs a project script named `dlx`, so only the blocking consumer trusts it.
      {
        command: 'yarn',
        tokens: ['dlx', 'cc-safety-net', 'policy', 'apply'],
        narrow: null,
        broad: 2,
      },
      {
        command: 'pnpm',
        tokens: ['dlx', 'other-package', 'policy', 'apply'],
        narrow: null,
        broad: null,
      },
      {
        command: 'npm',
        tokens: ['exec', 'cc-safety-net', 'policy', 'apply'],
        narrow: null,
        broad: 2,
      },
      {
        command: 'npm',
        tokens: ['--silent', 'exec', 'cc-safety-net', 'policy', 'apply'],
        narrow: null,
        broad: 3,
      },
      {
        command: 'bun',
        tokens: ['dist/bin/cc-safety-net.js', 'policy', 'apply'],
        narrow: 1,
        broad: 1,
      },
      {
        command: 'bun',
        tokens: ['run', 'dist/bin/cc-safety-net.js', 'policy', 'apply'],
        narrow: 2,
        broad: 2,
      },
      // `node run x` executes a local script named `run`, so it is a different program.
      {
        command: 'node',
        tokens: ['run', 'dist/bin/cc-safety-net.js', 'policy', 'apply'],
        narrow: null,
        broad: null,
      },
      {
        command: 'node',
        tokens: ['--experimental-strip-types', 'src/cli/cc-safety-net.ts', 'explain', 'x'],
        narrow: null,
        broad: 2,
      },
      {
        command: 'node',
        tokens: ['C:\\app\\dist\\bin\\cc-safety-net.js', 'policy', 'apply'],
        narrow: 1,
        broad: 1,
      },
      // The bundle the bin loads dispatches every verb itself, so running it is running the CLI.
      {
        command: 'node',
        tokens: ['dist/bin/hook.js', 'policy', 'apply'],
        narrow: 1,
        broad: 1,
      },
      { command: 'sh', tokens: ['cc-safety-net', 'explain', 'x'], narrow: null, broad: null },
      { command: 'deno', tokens: ['cc-safety-net', 'explain'], narrow: null, broad: null },
    ];
    for (const row of spellings) {
      const label = `${row.command} ${row.tokens.join(' ')}`;
      expect(safetyNetSubcommandIndex(row.command, row.tokens, {}), label).toBe(row.narrow);
      expect(safetyNetSubcommandIndex(row.command, row.tokens, { broad: false }), label).toBe(
        row.narrow,
      );
      expect(safetyNetSubcommandIndex(row.command, row.tokens, { broad: true }), label).toBe(
        row.broad,
      );
    }
  });

  test('the cutover entrypoint is recognized like the retired one', () => {
    const cutover = safetyNetSubcommandIndex('bun', ['src/entries/bin.ts', 'explain', 'x'], {});

    expect(cutover).not.toBeNull();
    expect(cutover).toBe(
      safetyNetSubcommandIndex('bun', ['src/cli/cc-safety-net.ts', 'explain', 'x'], {}),
    );
  });

  test('the table reaches both answers, so the sweep is not vacuous', () => {
    const indexes = rows.map((row) =>
      safetyNetSubcommandIndex(row.command, row.tokens, row.options),
    );
    expect(indexes.filter((index) => index !== null).length).toBeGreaterThan(40);
    expect(indexes.filter((index) => index === null).length).toBeGreaterThan(40);
  });
});
