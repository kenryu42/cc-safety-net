import { homedir } from 'node:os';
import { installKimiCode, uninstallKimiCode } from '@/bin/hook/install/kimi-code';

type HookAction = 'install' | 'uninstall';

function getHomeDir() {
  return process.env.HOME ?? homedir();
}

function parseInstallTarget(args: readonly string[], action: HookAction): void {
  const unknownOption = args.find((arg) => arg.startsWith('-') && !['--kimi-code'].includes(arg));

  if (unknownOption) throw new Error(`Unknown install option: ${unknownOption}`);
  const unexpectedArg = args.find((arg) => !arg.startsWith('-'));
  if (unexpectedArg) throw new Error(`Unexpected argument for hook ${action}: ${unexpectedArg}`);
  if (!args.includes('--kimi-code'))
    throw new Error('Choose exactly one install target: --kimi-code');
}

export function runHookInstallCommand(action: HookAction, args: readonly string[]): number {
  try {
    parseInstallTarget(args, action);
    const homeDir = getHomeDir();
    const result = action === 'install' ? installKimiCode(homeDir) : uninstallKimiCode(homeDir);
    const name = 'Kimi Code';
    const pastTense = action === 'install' ? 'Installed' : 'Uninstalled';

    console.log(
      action === 'install' && result.alreadyInstalled
        ? `${name} hook already installed in ${result.path}`
        : action === 'uninstall' && !result.alreadyInstalled
          ? `${name} hook not installed in ${result.path}`
          : `${pastTense} ${name} hook ${action === 'install' ? 'in' : 'from'} ${result.path}`,
    );
    return 0;
  } catch (e) {
    console.error(formatInstallError(e));
    return 1;
  }
}

function formatInstallError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : null;

  if (code === 'EACCES' || code === 'EPERM') {
    return `${message}\nCheck file permissions for the target config file and parent directory.`;
  }
  if (code === 'ENOENT') {
    return `${message}\nCheck that the target config path and parent directory exist.`;
  }
  if (code === 'ENOTDIR') {
    return `${message}\nCheck that every parent path component is a directory.`;
  }
  return message;
}
