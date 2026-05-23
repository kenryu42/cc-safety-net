import { describe, expect, test } from 'bun:test';
import { RULE_DOC } from '@/bin/rule/doc';
import { runSafetyNetCli } from '../helpers';

describe('rule command docs', () => {
  test('documents current rulebook configuration', () => {
    expect(RULE_DOC).toContain('.cc-safetynet-rules/rule.json');
    expect(RULE_DOC).toContain('.cc-safetynet-rules/<rulebook-name>/rulebook.json');
    expect(RULE_DOC).toContain('owner/repo#ref/<rulebook-name>');
    expect(RULE_DOC).toContain('allowed_commands');
    expect(RULE_DOC).toContain('tests');
    expect(RULE_DOC).toContain('overrides');
    expect(RULE_DOC).toContain('<rulebook-name>/<rule-name>');
    expect(RULE_DOC).not.toContain(
      'Agent reference for generating `.safety-net.json` config files.',
    );
  });

  test('prints rule docs', async () => {
    const result = await runSafetyNetCli(['rule', 'doc']);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.output).toBe(`${RULE_DOC}\n`);
  });
});
