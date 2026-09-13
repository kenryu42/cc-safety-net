import type { CommandNode, CommandProgram, CommandView } from './model';
import { parseCommand } from './parse';

/** @internal */
export function* walkCommandViews(program: CommandProgram): Generator<CommandView> {
  for (const node of program.nodes) {
    yield* walkNode(node);
  }
}

/** @internal */
export function projectCommandViews(program: CommandProgram): readonly CommandView[] {
  return Object.freeze([...walkCommandViews(program)]);
}

export function projectSegmentWords(program: CommandProgram): readonly (readonly string[])[] {
  return Object.freeze(
    projectCommandViews(program).map((view) => Object.freeze(view.words.map((word) => word.text))),
  );
}

export function parseSimpleWords(source: string): string[] | null {
  const program = parseCommand(source, 'posix');
  if (program.status !== 'complete' || program.nodes.length !== 1) return null;
  const command = program.nodes[0];
  if (command?.kind !== 'command') return null;
  if (command.redirections.length > 0 || command.nested.length > 0) return null;
  if (command.words.some((word) => word.provenance === 'command-substitution')) return null;
  return command.words.map((word) => word.text);
}

function* walkNode(node: CommandNode): Generator<CommandView> {
  if (node.kind === 'command') {
    yield node;
    for (const nested of node.nested) yield* walkCommandViews(nested);
    return;
  }
  if (node.kind === 'group') yield* walkCommandViews(node.body);
}
