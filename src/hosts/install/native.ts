import { spawn } from 'node:child_process';
import { getSpawnCommand } from '@/hosts/system-info';

export type NativeCommand = readonly [string, ...string[]];

function formatNativeCommand(command: NativeCommand) {
  return command.join(' ');
}

function formatCommandFailure(command: NativeCommand, status: number | null, output: string) {
  return [
    `Failed to run ${formatNativeCommand(command)}${status === null ? '' : ` (exit ${status})`}.`,
    output.trim(),
  ]
    .filter(Boolean)
    .join('\n');
}

export function captureOutputStreams(child: {
  stdout: NodeJS.ReadableStream;
  stderr: NodeJS.ReadableStream;
}) {
  const captured = { stdout: '', stderr: '' };
  child.stdout.setEncoding('utf-8');
  child.stderr.setEncoding('utf-8');
  child.stdout.on('data', (chunk: string) => {
    captured.stdout += chunk;
  });
  child.stderr.on('data', (chunk: string) => {
    captured.stderr += chunk;
  });
  return captured;
}

export function runNativeCommand(
  command: NativeCommand,
  options?: { stdoutOnly?: boolean; timeoutMs?: number },
): Promise<string> {
  return new Promise((resolve, reject) => {
    const spawnCommand = getSpawnCommand([...command], process.env);
    const child = spawn(spawnCommand.cmd, spawnCommand.args, {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const captured = captureOutputStreams(child);
    const merged = () => [captured.stdout, captured.stderr].filter(Boolean).join('\n');
    const timeoutMs = options?.timeoutMs ?? 120_000;

    const timer = setTimeout(() => {
      child.kill();
      reject(
        new Error(
          formatCommandFailure(
            command,
            null,
            `Timed out after ${timeoutMs}ms.\n${merged()}`.trim(),
          ),
        ),
      );
    }, timeoutMs);
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(
        new Error(formatCommandFailure(command, null, `${error.message}\n${merged()}`.trim())),
      );
    });
    child.on('close', (status) => {
      clearTimeout(timer);
      if (status !== 0) {
        reject(new Error(formatCommandFailure(command, status, merged())));
        return;
      }
      resolve(options?.stdoutOnly ? captured.stdout : merged());
    });
  });
}

export async function runNativeCommands(commands: readonly NativeCommand[]): Promise<void> {
  for (const command of commands) await runNativeCommand(command);
}

export async function runNativeCleanupCommands(commands: readonly NativeCommand[]): Promise<void> {
  for (const command of commands) {
    try {
      await runNativeCommand(command);
    } catch (error) {
      console.warn(error instanceof Error ? error.message : String(error));
    }
  }
}
