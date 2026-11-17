import type { CommandWord } from '@/core/shell/model';
import { expandKnownVariableWord } from './shell-git-env';

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
const MOUNT_FLAG = /^(?:--(?:volume|mount)|-[A-Za-z]*v)$/;
const HOST_ACCESS_OPTION = /^--(?:volumes-from|privileged|pid|userns|device|rootfs|cap-add)(?:=|$)/;
const HOST_CONTROL_PATH = /\.sock\b|(?:^|[=,])\/(?:var\/)?run(?:[:,/]|$)/;
const READ_ONLY_MOUNT_FIELDS = new Set(['readonly', 'ro']);
const MOUNT_FIELD_THAT_MAY_UNDO_READ_ONLY = /^(?:readonly|ro|bind-recursive)=/;

export function isContainerRunIsolatedFromHost(
  head: string,
  words: readonly CommandWord[],
  shellAssignments: ReadonlyMap<string, string>,
): boolean {
  if (!CONTAINER_CLIS.has(head)) return false;
  const operands = words.slice(1);
  const args = operands.map((word) => word.text);
  const mayHideAnOption = (word: CommandWord, index: number) =>
    mayExpandToSeveralWords(word) ||
    /^"?-[^=]*[$`]/.test(word.raw) ||
    (/^"?[$`]/.test(word.raw) &&
      !MOUNT_FLAG.test(args[index - 1] ?? '') &&
      expandKnownVariableWord(word, shellAssignments) === null);
  if (operands.some(mayHideAnOption)) return false;
  const firstCommandIndex = args.findIndex(
    (arg, index) => !arg.startsWith('-') && !GLOBAL_OPTIONS_WITH_VALUE.has(args[index - 1] ?? ''),
  );
  if (firstCommandIndex === -1) return false;
  const runIndex =
    args[firstCommandIndex] === 'container' ? firstCommandIndex + 1 : firstCommandIndex;
  if (args[runIndex] !== 'run') return false;
  const runArgs = args.slice(runIndex + 1);
  return !runArgs.some((_, index) => reachesHostAt(runArgs, index));
}

function mayExpandToSeveralWords(word: CommandWord): boolean {
  if (word.provenance === 'literal') return false;
  if (word.provenance === 'unknown') return /[$`]/.test(word.text);
  return !/^"[^"]*"$/.test(word.raw) || /\$@|\$\{@|\[@\]/.test(word.raw);
}

function reachesHostAt(args: readonly string[], index: number): boolean {
  const arg = args[index] ?? '';
  if (HOST_ACCESS_OPTION.test(arg)) return true;
  const long = /^--(volume|mount)(?:=(.*))?$/s.exec(arg);
  const short = /^-[A-Za-z]*?v(.*)$/s.exec(arg);
  if (!long && !short) return false;
  const value = (long ? long[2] : short?.[1]) || (args[index + 1] ?? '');
  if (HOST_CONTROL_PATH.test(value) || value.includes('"')) return true;
  const fields = value.split(',');
  return long?.[1] === 'mount'
    ? !fields.some((field) => READ_ONLY_MOUNT_FIELDS.has(field)) ||
        fields.some((field) => MOUNT_FIELD_THAT_MAY_UNDO_READ_ONLY.test(field))
    : !value.split(':').at(-1)?.split(',').includes('ro');
}
