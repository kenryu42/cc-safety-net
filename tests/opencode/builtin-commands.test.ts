import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadBuiltinCommands } from '@/opencode/builtin-commands/commands';

describe('builtin OpenCode commands', () => {
  test('uses the cc-safetynet-rules skill workflow as the command template', () => {
    const skill = readFileSync(join(process.cwd(), 'skills/cc-safetynet-rules/SKILL.md'), 'utf-8');

    expect(loadBuiltinCommands()['cc-safetynet-rules']?.template).toBe(
      skill.slice(skill.indexOf('## Workflow')),
    );
  });
});
