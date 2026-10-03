function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isManagedHandler(hook: unknown, command: string): hook is Record<string, unknown> {
  return isRecord(hook) && hook.command === command;
}

function isManagedEntry(entry: unknown, command: string): entry is Record<string, unknown> {
  return (
    isRecord(entry) &&
    Array.isArray(entry.hooks) &&
    entry.hooks.some((hook) => isManagedHandler(hook, command))
  );
}

export function canonicalPreToolUseEntry(command: string, timeout: number) {
  return { hooks: [{ type: 'command', command, timeout }] };
}

export function withoutManagedHandlers(entries: readonly unknown[], command: string): unknown[] {
  return entries.flatMap((entry) => {
    if (!isRecord(entry) || !Array.isArray(entry.hooks)) return [entry];
    const foreign = entry.hooks.filter((hook) => !isManagedHandler(hook, command));
    if (foreign.length === entry.hooks.length) return [entry];
    return foreign.length === 0 ? [] : [{ ...entry, hooks: foreign }];
  });
}

export function isInstalledOnceCanonically(
  entries: readonly unknown[],
  command: string,
  timeout: number,
): boolean {
  const managed = entries.filter((entry) => isManagedEntry(entry, command));
  return (
    managed.length === 1 &&
    JSON.stringify(managed[0]) === JSON.stringify(canonicalPreToolUseEntry(command, timeout))
  );
}

export function findManagedEntry(entries: readonly unknown[], command: string) {
  return entries.find((entry) => isManagedEntry(entry, command));
}

export function managedEntryDriftErrors(
  entry: Record<string, unknown>,
  command: string,
  timeout: number,
): string[] {
  const managed = Array.isArray(entry.hooks)
    ? entry.hooks.find((hook) => isManagedHandler(hook, command))
    : undefined;
  return [
    ...(entry.matcher === undefined || entry.matcher === '' || entry.matcher === '*'
      ? []
      : ['Managed hook has a "matcher" that narrows coverage; reinstall to repair']),
    ...(managed?.type === 'command'
      ? []
      : ['Managed hook "type" is not "command"; reinstall to repair']),
    ...(managed?.timeout === timeout
      ? []
      : [`Managed hook "timeout" is not ${timeout}; reinstall to repair`]),
  ];
}
