import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CC_SAFETY_NET_TEMPLATE } from '@/builtin-commands/templates/cc-safety-net';
import { loadBuiltinCommands } from '@/opencode/builtin-commands/commands';

function normalizeNewlines(value: string): string {
  return value.replace(/\r\n/g, '\n');
}

describe('builtin OpenCode commands', () => {
  test('uses the shared cc-safety-net workflow as the command template', () => {
    expect(loadBuiltinCommands()['cc-safety-net']?.template).toBe(
      CC_SAFETY_NET_TEMPLATE.slice(CC_SAFETY_NET_TEMPLATE.indexOf('## Workflow')),
    );
  });

  test('keeps the shared cc-safety-net workflow in sync with the skill', () => {
    const skill = readFileSync(join(process.cwd(), 'skills/cc-safety-net/SKILL.md'), 'utf-8');

    expect(CC_SAFETY_NET_TEMPLATE.trimStart()).toBe(
      normalizeNewlines(skill.slice(skill.indexOf('## Workflow'))),
    );
  });

  test('keeps the cc-safety-net skill manual and doc-driven', () => {
    const skill = readFileSync(join(process.cwd(), 'skills/cc-safety-net/SKILL.md'), 'utf-8');

    expect(skill).toContain(
      'description: Configure CC Safety Net rulebooks for user, project, or shareable GitHub scope.',
    );
    expect(skill).toContain('npx -y cc-safety-net rule doc');
    expect(skill).not.toContain('**STRICT**');
  });

  test('uses the current rulebook repository path', () => {
    const template = loadBuiltinCommands()['cc-safety-net']?.template;

    expect(template).toContain('.cc-safety-net/rules/<rulebook-name>/rulebook.json');
    expect(template).not.toContain('`cc-safety-net-rules/<rulebook-name>/rulebook.json`');
  });
});
