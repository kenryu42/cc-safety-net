interface SubprocessOutput {
  stdout: { toString: () => string };
  stderr: { toString: () => string };
}

export function formatSubprocessFailure(name: string, output: SubprocessOutput): string {
  return [
    `${name} failed`,
    formatStream('stdout', output.stdout.toString()),
    formatStream('stderr', output.stderr.toString()),
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
}

function formatStream(name: string, value: string): string | null {
  const trimmed = value.trimEnd();
  if (!trimmed) {
    return null;
  }
  return `${name}:\n${trimmed}`;
}
