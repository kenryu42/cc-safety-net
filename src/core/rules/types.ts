import type { BlockIntent } from '@/core/decision';

export interface CustomRuleMatch {
  readonly command_path: readonly string[];

  readonly any_args?: readonly string[];

  readonly exclude_args?: readonly string[];
}

export type RuleActivationCapability = 'fail_closed' | 'paranoid_rm' | 'paranoid_interpreters';

export type PolicyRule = {
  readonly name: string;
  readonly command: string;
  readonly subcommand?: string;
  readonly block_args: readonly string[];
  readonly match?: CustomRuleMatch;
  readonly reason: string;
  readonly intent?: BlockIntent;
};

export interface DestructiveCommandRuleMatch {
  id: string;
  reason: string;
  intent: BlockIntent;
}
