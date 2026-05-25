import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadBuiltinCommands } from '@/opencode/builtin-commands/commands';

describe('builtin OpenCode commands', () => {
  test('uses the cc-safety-net skill workflow as the command template', () => {
    const skill = readFileSync(join(process.cwd(), 'skills/cc-safety-net/SKILL.md'), 'utf-8');

    expect(loadBuiltinCommands()['cc-safety-net']?.template).toBe(
      skill.slice(skill.indexOf('## Workflow')),
    );
  });

  test('uses the current rulebook repository path', () => {
    const template = loadBuiltinCommands()['cc-safety-net']?.template;

    expect(template).toContain('.cc-safety-net/rules/<rulebook-name>/rulebook.json');
    expect(template).not.toContain('`cc-safety-net-rules/<rulebook-name>/rulebook.json`');
  });
});
