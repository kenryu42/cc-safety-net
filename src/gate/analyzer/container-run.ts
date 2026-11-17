import type { CommandWord } from '@/core/shell/model';

const CONTAINER_CLIS = new Set(['docker', 'podman', 'nerdctl']);
const GLOBAL_OPTIONS_WITH_VALUE = new Set([
  '--config',
  '-c',
  '--context',
  '-H',
  '--host',
  '-l',
  '--log-level',
  '--tlscacert',
  '--tlscert',
  '--tlskey',
]);
const READ_ONLY_MOUNT_FIELDS = new Set(['readonly', 'ro', 'readonly=true', 'ro=true']);

export function isContainerRunWithoutWritableMount(
  head: string,
  words: readonly CommandWord[],
): boolean {
  if (!CONTAINER_CLIS.has(head)) return false;
  const operands = words.slice(1);
  if (operands.some(mayExpandToSeveralWords)) return false;
  const args = operands.map((word) => word.text);
  const firstCommandIndex = args.findIndex(
    (arg, index) => !arg.startsWith('-') && !GLOBAL_OPTIONS_WITH_VALUE.has(args[index - 1] ?? ''),
  );
  if (firstCommandIndex === -1) return false;
  const runIndex =
    args[firstCommandIndex] === 'container' ? firstCommandIndex + 1 : firstCommandIndex;
  if (args[runIndex] !== 'run') return false;
  const runArgs = args.slice(runIndex + 1);
  return !runArgs.some((_, index) => isWritableMountAt(runArgs, index));
}

function mayExpandToSeveralWords(word: CommandWord): boolean {
  if (word.provenance === 'literal') return false;
  if (word.provenance === 'unknown') return /[$`]/.test(word.text);
  return !/^"[^"]*"$/.test(word.raw) || /\$@|\$\{@|\[@\]/.test(word.raw);
}

function isWritableMountAt(args: readonly string[], index: number): boolean {
  const arg = args[index] ?? '';
  if (/^--volumes-from(?:=|$)/.test(arg)) return true;
  const long = /^--(volume|mount)(?:=(.*))?$/s.exec(arg);
  const short = /^-[A-Za-z]*?v(.*)$/s.exec(arg);
  if (!long && !short) return false;
  const value = (long ? long[2] : short?.[1]) || (args[index + 1] ?? '');
  return long?.[1] === 'mount'
    ? !value.split(',').some((field) => READ_ONLY_MOUNT_FIELDS.has(field))
    : !value.split(':').at(-1)?.split(',').includes('ro');
}
