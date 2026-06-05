/**
 * Tests for the explain command CLI flag parsing.
 */
import { describe, expect, test } from 'bun:test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createLinkedWorktreeFixture, runCCSafetyNetCli, withTempDir } from '../../helpers.ts';

function writeGitRulebook(dir: string): void {
  mkdirSync(join(dir, '.cc-safety-net/rules', 'git-rules'), { recursive: true });
  writeFileSync(
    join(dir, '.cc-safety-net/rules', 'git-rules', 'rulebook.json'),
    JSON.stringify({
      rulebook_version: 1,
      name: 'git-rules',
      version: '1.0.0',
      allowed_commands: ['git'],
      rules: [
        {
          name: 'block-add-all',
          command: 'git',
          subcommand: 'add',
          block_args: ['-A', '--all', '.'],
          reason: 'Stage specific files.',
        },
      ],
      tests: [
        { command: 'git add -A', expect: 'blocked', rule: 'block-add-all' },
        { command: 'git status', expect: 'allowed' },
      ],
    }),
    'utf-8',
  );
}

async function explainJson(args: string[]) {
  return withTempDir('safety-net-explain-cli-', async (tempDir) => {
    const result = await runCCSafetyNetCli(['explain', '--json', ...args], undefined, tempDir);
    return {
      parsed: JSON.parse(result.output),
      exitCode: result.exitCode,
    };
  });
}

async function withGitRulebook(
  fn: (tempDir: string, env: Record<string, string>) => Promise<void>,
) {
  await withTempDir('safety-net-explain-cli-', async (tempDir) => {
    const env = { HOME: join(tempDir, 'home') };
    writeGitRulebook(tempDir);
    await runCCSafetyNetCli(['rule', 'add', 'git-rules'], env, tempDir);
    await fn(tempDir, env);
  });
}

describe('explain CLI flag parsing', () => {
  test('explain preserves --debug in command when it appears after first positional arg', async () => {
    const { parsed, exitCode } = await explainJson(['echo', '--debug']);
    const parseStep = parsed.trace.steps.find((s: { type: string }) => s.type === 'parse');
    expect(parseStep.input).toBe('echo --debug');
    expect(exitCode).toBe(0);
  });

  test('explain preserves --json in command when after positional arg', async () => {
    const { parsed, exitCode } = await explainJson(['git', 'push', '--json']);
    const parseStep = parsed.trace.steps.find((s: { type: string }) => s.type === 'parse');
    expect(parseStep.input).toBe('git push --json');
    expect(exitCode).toBe(0);
  });

  test('explain with -- separator treats everything after as command', async () => {
    const { parsed, exitCode } = await explainJson(['--', '--debug']);
    const parseStep = parsed.trace.steps.find((s: { type: string }) => s.type === 'parse');
    expect(parseStep.input).toBe('--debug');
    expect(exitCode).toBe(0);
  });

  test('explain unknown flag is treated as start of command', async () => {
    const { parsed, exitCode } = await explainJson(['--unknown-flag', 'foo']);
    const parseStep = parsed.trace.steps.find((s: { type: string }) => s.type === 'parse');
    expect(parseStep.input).toBe('--unknown-flag foo');
    expect(exitCode).toBe(0);
  });

  test('explain single-arg command with pipe preserves shell operators', async () => {
    const { parsed, exitCode } = await explainJson(['git status | rm -rf /']);
    const parseStep = parsed.trace.steps.find((s: { type: string }) => s.type === 'parse');
    expect(parseStep.input).toBe('git status | rm -rf /');
    expect(parseStep.segments).toEqual([
      ['git', 'status'],
      ['rm', '-rf', '/'],
    ]);
    expect(parsed.result).toBe('blocked');
    expect(exitCode).toBe(0);
  });

  test('explain --cwd <path> passes cwd to analysis', async () => {
    await withTempDir('safety-net-explain-', async (tempDir) => {
      const { parsed, exitCode } = await explainJson(['--cwd', tempDir, 'rm -rf ./foo']);
      expect(parsed.result).toBe('allowed');
      expect(exitCode).toBe(0);
    });
  });

  test('explain --json reports worktree relaxation', async () => {
    const fixture = createLinkedWorktreeFixture();
    try {
      const proc = Bun.spawn(
        [
          'bun',
          'src/bin/cc-safety-net.ts',
          'explain',
          '--json',
          '--cwd',
          fixture.linkedWorktree,
          'git reset --hard',
        ],
        {
          stdout: 'pipe',
          stderr: 'pipe',
          env: {
            ...process.env,
            HOME: join(fixture.mainWorktree, 'home'),
            SAFETY_NET_WORKTREE: '1',
          },
        },
      );

      const output = await new Response(proc.stdout).text();
      const exitCode = await proc.exited;

      const parsed = JSON.parse(output);
      const worktreeStep = parsed.trace.segments
        .flatMap((s: { steps: Array<{ type: string }> }) => s.steps)
        .find((s: { type: string }) => s.type === 'worktree-relaxation');
      expect(parsed.result).toBe('allowed');
      expect(worktreeStep).toBeDefined();
      expect(exitCode).toBe(0);
    } finally {
      fixture.cleanup();
    }
  });

  test('explain --json reports rulebook-backed custom rule metadata', async () => {
    await withGitRulebook(async (tempDir, env) => {
      const result = await runCCSafetyNetCli(
        ['explain', '--json', 'git', 'add', '-A'],
        env,
        tempDir,
      );

      expect(result.exitCode).toBe(0);
      expect(JSON.parse(result.output).customRule).toEqual({
        id: 'git-rules/block-add-all',
        rulebook: { name: 'git-rules', version: '1.0.0' },
        source: 'git-rules',
      });
    });
  });

  test('explain human output reports rulebook-backed custom rule metadata', async () => {
    await withGitRulebook(async (tempDir, env) => {
      const result = await runCCSafetyNetCli(['explain', 'git', 'add', '-A'], env, tempDir);

      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('Rule: git-rules/block-add-all');
      expect(result.output).toContain('Rulebook: git-rules 1.0.0');
      expect(result.output).toContain('Source: git-rules');
    });
  });

  test('explain --json reports custom rule reason override metadata', async () => {
    await withGitRulebook(async (tempDir, env) => {
      const configPath = join(tempDir, '.cc-safety-net/rules', 'rule.json');
      writeFileSync(
        configPath,
        JSON.stringify({
          ...JSON.parse(readFileSync(configPath, 'utf-8')),
          overrides: {
            'git-rules/block-add-all': { reason: 'Stage precise files.' },
          },
        }),
        'utf-8',
      );

      const result = await runCCSafetyNetCli(
        ['explain', '--json', 'git', 'add', '-A'],
        env,
        tempDir,
      );

      expect(result.exitCode).toBe(0);
      expect(JSON.parse(result.output).customRule.override).toEqual({
        type: 'reason',
        reason: 'Stage precise files.',
      });
    });
  });

  test('explain --cwd without path shows error', async () => {
    const proc = Bun.spawn(['bun', 'src/bin/cc-safety-net.ts', 'explain', '--cwd'], {
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const stderr = await new Response(proc.stderr).text();
    const exitCode = await proc.exited;

    expect(stderr).toContain('--cwd requires a path');
    expect(exitCode).toBe(1);
  });

  test('explain --cwd with following flag shows error', async () => {
    const proc = Bun.spawn(
      ['bun', 'src/bin/cc-safety-net.ts', 'explain', '--cwd', '--json', 'echo hello'],
      {
        stdout: 'pipe',
        stderr: 'pipe',
      },
    );

    const stderr = await new Response(proc.stderr).text();
    const exitCode = await proc.exited;

    expect(stderr).toContain('--cwd requires a path');
    expect(exitCode).toBe(1);
  });
});
