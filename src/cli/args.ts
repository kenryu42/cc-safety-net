const HELP_FLAGS = ['-h', '--help'];

export function parseCommandArgs<
  Flag extends string,
  Valued extends string,
  Listed extends string = never,
>(
  spec: {
    label: string;

    booleans?: Readonly<Record<Flag, readonly string[]>>;

    values?: Readonly<Record<Valued, readonly string[]>>;

    lists?: Readonly<Record<Listed, readonly string[]>>;

    positionals?: 'none' | 'list' | 'tail';
  },
  argv: readonly string[],
) {
  const booleanEntries = Object.entries(spec.booleans ?? {}) as [Flag, readonly string[]][];
  const valueEntries = Object.entries(spec.values ?? {}) as [Valued, readonly string[]][];
  const listEntries = Object.entries(spec.lists ?? {}) as [Listed, readonly string[]][];
  const flags = Object.fromEntries(booleanEntries.map(([name]) => [name, false])) as Record<
    Flag,
    boolean
  >;
  const values: Partial<Record<Valued, string>> = {};
  const lists: Record<string, string[]> = Object.fromEntries(
    listEntries.map(([name]) => [name, []]),
  );
  const positionals: string[] = [];
  const errors: string[] = [];
  let help = false;
  let consumedIndex = -1;

  for (const [index, arg] of argv.entries()) {
    if (index <= consumedIndex) continue;
    if (arg === '--') {
      positionals.push(...argv.slice(index + 1));
      break;
    }
    if (HELP_FLAGS.includes(arg)) {
      help = true;
      continue;
    }
    const booleanEntry = booleanEntries.find(([, spellings]) => spellings.includes(arg));
    if (booleanEntry) {
      flags[booleanEntry[0]] = true;
      continue;
    }
    const valueEntry = valueEntries.find(([, spellings]) => spellings.includes(arg));
    if (valueEntry) {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('-')) {
        errors.push(`${arg} requires a value`);
        continue;
      }
      values[valueEntry[0]] = value;
      consumedIndex = index + 1;
      continue;
    }
    const listEntry = listEntries.find(([, spellings]) => spellings.includes(arg));
    if (listEntry) {
      const remaining = argv.slice(index + 1);
      const nextOptionIndex = remaining.findIndex((value) => value.startsWith('-'));
      const listValues = remaining.slice(
        0,
        nextOptionIndex === -1 ? remaining.length : nextOptionIndex,
      );
      if (listValues.length === 0) {
        errors.push(`${arg} requires at least one value`);
        continue;
      }
      lists[listEntry[0]] = [...(lists[listEntry[0]] ?? []), ...listValues];
      consumedIndex = index + listValues.length;
      continue;
    }
    if (arg.startsWith('-')) {
      errors.push(`Unknown option for ${spec.label}: ${arg}`);
      continue;
    }
    if (spec.positionals === 'tail') {
      positionals.push(...argv.slice(index));
      break;
    }
    positionals.push(arg);
  }

  if (spec.positionals !== 'list' && spec.positionals !== 'tail') {
    errors.push(
      ...positionals.map((positional) => `Unexpected argument for ${spec.label}: ${positional}`),
    );
  }

  return { flags, values, lists, positionals, help, errors };
}

export function reportCommandArgErrors(errors: readonly string[]): boolean {
  for (const error of errors) console.error(error);
  return errors.length > 0;
}
