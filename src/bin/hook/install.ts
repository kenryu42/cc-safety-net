import { homedir } from 'node:os';
import { installKimiCli, uninstallKimiCli } from '@/bin/hook/install/kimi-cli';
import { installOpenCode, uninstallOpenCode } from '@/bin/hook/install/opencode';

type HookAction = 'install' | 'uninstall';

function getHomeDir() {
  return process.env.HOME ?? homedir();
}

function parseInstallTarget(args: readonly string[], action: HookAction): 'opencode' | 'kimi-cli' {
  const targets = [
    args.includes('--opencode') ? 'opencode' : undefined,
    args.includes('--kimi-cli') ? 'kimi-cli' : undefined,
  ].filter((target): target is 'opencode' | 'kimi-cli' => target !== undefined);
  const unknownOption = args.find(
    (arg) => arg.startsWith('-') && !['--opencode', '--kimi-cli'].includes(arg),
  );

  if (unknownOption) throw new Error(`Unknown install option: ${unknownOption}`);
  const unexpectedArg = args.find((arg) => !arg.startsWith('-'));
  if (unexpectedArg) throw new Error(`Unexpected argument for hook ${action}: ${unexpectedArg}`);
  if (targets.length !== 1)
    throw new Error('Choose exactly one install target: --opencode or --kimi-cli');

  return targets[0] as 'opencode' | 'kimi-cli';
}

export function runHookInstallCommand(action: HookAction, args: readonly string[]): number {
  try {
    const target = parseInstallTarget(args, action);
    const homeDir = getHomeDir();
    const result =
      target === 'opencode'
        ? action === 'install'
          ? installOpenCode(homeDir)
          : uninstallOpenCode(homeDir)
        : action === 'install'
          ? installKimiCli(homeDir)
          : uninstallKimiCli(homeDir);
    const name = target === 'opencode' ? 'OpenCode' : 'Kimi CLI';
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
