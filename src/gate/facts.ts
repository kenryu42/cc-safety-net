import type { CommandProgram, ShellKind } from '@/core/shell/model';
import type { GuardSyntax } from './guards/guard-walk';
import type { ToolCallContext, ToolRoute } from './invocation';

export type CommandFactUsage = 'input-candidate' | 'declared-command';

export type CommandSyntaxFacts = {
  readonly usages: readonly CommandFactUsage[];
  readonly source: string;
  readonly program: CommandProgram;
  readonly shell: GuardSyntax;
};

export type SemanticFactStore = {
  readonly getShellSyntax: (source: string, program?: CommandProgram) => GuardSyntax;
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
