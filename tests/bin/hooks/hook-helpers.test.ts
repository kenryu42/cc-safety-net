import { describe, expect, test } from 'bun:test';
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { withHookTestContext } from './hook-helpers';

describe('hook test helpers', () => {
  test('withHookTestContext creates isolated cwd and home directories', async () => {
    let firstCwd = '';
    let secondCwd = '';
    let leakedFile = '';

    await withHookTestContext((context) => {
      firstCwd = context.cwd;
      leakedFile = join(context.cwd, '.safety-net.json');
      writeFileSync(leakedFile, '{}');

      expect(context.claudeCodeBashInput('git status').cwd).toBe(context.cwd);
      expect(context.copilotBashInput('git status').cwd).toBe(context.cwd);
      expect(context.copilotRawToolArgsInput('{}').cwd).toBe(context.cwd);
      expect(context.geminiShellInput('git status').cwd).toBe(context.cwd);
      expect(context.kimiShellInput('git status').cwd).toBe(context.cwd);
      expect(context.home).toBe(join(context.cwd, 'home'));
    });

    await withHookTestContext((context) => {
      secondCwd = context.cwd;

      expect(context.cwd).not.toBe(firstCwd);
      expect(existsSync(leakedFile)).toBe(false);
      expect(context.claudeCodeBashInput('git status').cwd).toBe(context.cwd);
    });

    expect(existsSync(firstCwd)).toBe(false);
    expect(existsSync(secondCwd)).toBe(false);
  });

  test('withHookTestContext binds hook runners to the isolated cwd', async () => {
    await withHookTestContext(async (context) => {
      expect((await context.runCli(['hook'])).stdout).toContain('cc-safety-net hook');
      expect(
        (await context.runClaudeCodeHook(context.claudeCodeBashInput('git status'))).stdout,
      ).toBe('');
      expect((await context.runGeminiHook(context.geminiShellInput('git status'))).stdout).toBe('');
      expect((await context.runKimiHook(context.kimiShellInput('git status'))).stdout).toBe('');
      expect((await context.runCopilotHook(context.copilotBashInput('git status'))).stdout).toBe(
        '',
      );
    });
  });
});
