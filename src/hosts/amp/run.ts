import { spawn } from 'node:child_process';
import { captureOutputStreams } from '@/hosts/install/native';
import { getSpawnCommand } from '@/hosts/system-info';

type AmpCommandResult = {
  status: number | null;

  errorCode?: string;
  stdout: string;
  stderr: string;
};

export type AmpRunner = (
  command: readonly [string, ...string[]],
  cwd?: string,
) => AmpCommandResult | Promise<AmpCommandResult>;

export const runAmpCommand: AmpRunner = (command, cwd) => {
  const spawnCommand = getSpawnCommand([...command], process.env);
  return new Promise((resolve) => {
    const child = spawn(spawnCommand.cmd, spawnCommand.args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const captured = captureOutputStreams(child);
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, 120_000);
    child.on('error', (error) => {
      clearTimeout(timer);
      resolve({
        status: null,
        errorCode: (error as NodeJS.ErrnoException).code,
        stdout: captured.stdout,
        stderr: [error.message, captured.stderr].filter(Boolean).join('\n'),
      });
    });
    child.on('close', (status) => {
      clearTimeout(timer);
      resolve({
        status: timedOut ? null : status,
        errorCode: timedOut ? 'ETIMEDOUT' : undefined,
        stdout: captured.stdout,
        stderr: captured.stderr,
      });
    });
  });
};
