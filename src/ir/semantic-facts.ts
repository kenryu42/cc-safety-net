import type { CommandProgram, ShellKind } from '@/ir/command';
import type { ToolCallContext, ToolRoute } from '@/ir/invocation';

export type CommandFactUsage = 'input-candidate' | 'declared-command';

export type ShellSyntaxEntry =
  | { readonly kind: 'word'; readonly text: string }
  | { readonly kind: 'operator'; readonly operator: string; readonly boundary: boolean }
  | {
      readonly kind: 'redirection';
      readonly operator: string;
      readonly fd?: number;
      readonly role: 'file-read' | 'file-write' | 'here-data';
      readonly targetOrder: 'immediate' | 'legacy-segment';
      readonly target?: string;
    };

export type ShellSyntaxFacts = {
  readonly status: 'complete' | 'unclosed-quote' | 'invalid' | 'structural-limit';
  readonly source: string;
  readonly entries: readonly ShellSyntaxEntry[];
  readonly assignmentFallbacks: readonly string[];
};

export type CommandSyntaxFacts = {
  readonly usages: readonly CommandFactUsage[];
  readonly source: string;
  readonly program: CommandProgram;
  readonly shell: ShellSyntaxFacts;
};

export type SemanticFactStore = {
  readonly getShellSyntax: (source: string, program?: CommandProgram) => ShellSyntaxFacts;
  readonly getCommandProgram: (source: string, dialect: ShellKind) => CommandProgram;
};

export type SemanticFacts = {
  readonly invocation: {
    readonly toolName: string;
    readonly route: ToolRoute;
    readonly context: ToolCallContext;
  };
  readonly commands: readonly CommandSyntaxFacts[];
  readonly paths: readonly string[];
  readonly store: SemanticFactStore;
};
