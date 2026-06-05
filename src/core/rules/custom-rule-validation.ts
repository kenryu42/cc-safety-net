import { COMMAND_PATTERN, MAX_REASON_LENGTH, NAME_PATTERN } from '@/types';

interface ValidateCustomRuleOptions {
  messageStyle?: 'legacy' | 'rulebook';
}

export function validateCustomRule(
  rule: unknown,
  index: number,
  ruleNames: Set<string>,
  options: ValidateCustomRuleOptions = {},
): string[] {
  const errors: string[] = [];
  const prefix = `rules[${index}]`;

  if (!rule || typeof rule !== 'object') {
    errors.push(`${prefix}: must be an object`);
    return errors;
  }

  const r = rule as Record<string, unknown>;
  const messageStyle = options.messageStyle ?? 'legacy';

  if (typeof r.name !== 'string') {
    errors.push(`${prefix}.name: required string`);
  } else {
    if (!NAME_PATTERN.test(r.name)) {
      errors.push(
        messageStyle === 'rulebook'
          ? `${prefix}.name: must match rule name pattern`
          : `${prefix}.name: must match pattern (letters, numbers, hyphens, underscores; max 64 chars)`,
      );
    }
    const lowerName = r.name.toLowerCase();
    if (ruleNames.has(lowerName)) {
      errors.push(`${prefix}.name: duplicate rule name "${r.name}"`);
    } else {
      ruleNames.add(lowerName);
    }
  }

  if (typeof r.command !== 'string') {
    errors.push(
      messageStyle === 'rulebook'
        ? `${prefix}.command: required string matching command pattern`
        : `${prefix}.command: required string`,
    );
  } else if (!COMMAND_PATTERN.test(r.command)) {
    errors.push(
      messageStyle === 'rulebook'
        ? `${prefix}.command: required string matching command pattern`
        : `${prefix}.command: must match pattern (letters, numbers, hyphens, underscores)`,
    );
  }

  if (r.subcommand !== undefined) {
    if (typeof r.subcommand !== 'string') {
      errors.push(
        messageStyle === 'rulebook'
          ? `${prefix}.subcommand: must match command pattern`
          : `${prefix}.subcommand: must be a string if provided`,
      );
    } else if (!COMMAND_PATTERN.test(r.subcommand)) {
      errors.push(
        messageStyle === 'rulebook'
          ? `${prefix}.subcommand: must match command pattern`
          : `${prefix}.subcommand: must match pattern (letters, numbers, hyphens, underscores)`,
      );
    }
  }

  if (!Array.isArray(r.block_args)) {
    errors.push(
      messageStyle === 'rulebook'
        ? `${prefix}.block_args: required non-empty array`
        : `${prefix}.block_args: required array`,
    );
  } else {
    if (r.block_args.length === 0) {
      errors.push(
        messageStyle === 'rulebook'
          ? `${prefix}.block_args: required non-empty array`
          : `${prefix}.block_args: must have at least one element`,
      );
    }
    for (let i = 0; i < r.block_args.length; i++) {
      const arg = r.block_args[i];
      if (typeof arg !== 'string') {
        errors.push(
          messageStyle === 'rulebook'
            ? `${prefix}.block_args[${i}]: must be a non-empty string`
            : `${prefix}.block_args[${i}]: must be a string`,
        );
      } else if (arg === '') {
        errors.push(
          messageStyle === 'rulebook'
            ? `${prefix}.block_args[${i}]: must be a non-empty string`
            : `${prefix}.block_args[${i}]: must not be empty`,
        );
      }
    }
  }

  if (typeof r.reason !== 'string') {
    errors.push(
      messageStyle === 'rulebook'
        ? `${prefix}.reason: required non-empty string up to ${MAX_REASON_LENGTH} characters`
        : `${prefix}.reason: required string`,
    );
  } else if (r.reason === '') {
    errors.push(
      messageStyle === 'rulebook'
        ? `${prefix}.reason: required non-empty string up to ${MAX_REASON_LENGTH} characters`
        : `${prefix}.reason: must not be empty`,
    );
  } else if (r.reason.length > MAX_REASON_LENGTH) {
    errors.push(
      messageStyle === 'rulebook'
        ? `${prefix}.reason: required non-empty string up to ${MAX_REASON_LENGTH} characters`
        : `${prefix}.reason: must be at most ${MAX_REASON_LENGTH} characters`,
    );
  }

  return errors;
}
