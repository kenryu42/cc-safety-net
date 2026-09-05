import { spawn } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { delimiter, join } from 'node:path';

/** The dialog blocks on the user, so this only releases a window that was
 *  abandoned rather than answered. */
const DIALOG_TIMEOUT_MS = 120_000;
const PROMPT = 'Choose the project folder';

/** AppleScript raises -128 on cancel; returning empty instead keeps cancel off
 *  the error path, where it would surface as a failed pick.
 *
 *  No `activate`: osascript is background-only, so activating transforms it into
 *  a foreground app at a flat ~2s cost before the panel is even requested. It
 *  leaves the process registered as a UIElement either way, so the delay bought
 *  nothing. */
const MACOS_SCRIPT = `try
  return POSIX path of (choose folder with prompt "${PROMPT}")
on error number -128
  return ""
end try`;

/** Console.Out.Write rather than Write-Output: the pipeline re-encodes, which is
 *  how PowerShell 7 ends up emitting "UTF-8" in place of the path. Invoked
 *  through powershell.exe (5.1, STA by default) to avoid that path entirely. */
const WINDOWS_SCRIPT = `Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = '${PROMPT}'
if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($dialog.SelectedPath) }`;

const LINUX_DIALOGS = [
  { binary: 'zenity', args: ['--file-selection', '--directory', `--title=${PROMPT}`] },
  { binary: 'kdialog', args: ['--getexistingdirectory', '.', '--title', PROMPT] },
];

/** Presence alone is not enough: a stale non-executable file, or a directory
 *  carrying its default executable bit, would advertise a picker that can never
 *  start. The stat is caught per entry because a PATH entry that is itself a
 *  file (ENOTDIR) or unreadable (EACCES) is one dead entry, not a lookup
 *  failure. */
const onPath = (binary: string, env: NodeJS.ProcessEnv) =>
  (env.PATH ?? '').split(delimiter).some((dir) => {
    if (dir.length === 0) return false;
    try {
      const stats = statSync(join(dir, binary));
      return stats.isFile() && (stats.mode & 0o111) !== 0;
    } catch {
      return false;
    }
  });

/**
 * Whether a native folder dialog can be opened for this process.
 *
 * macOS and Windows ship one with the OS. Linux needs both a dialog binary and
 * a session to draw into: minimal, container and server installs have neither,
 * and WSL without WSLg has the binary but no display.
 */
export function isDirectoryPickerAvailable(
  platform: NodeJS.Platform | string,
  env: NodeJS.ProcessEnv,
): boolean {
  if (platform === 'darwin' || platform === 'win32') return true;
  if (platform !== 'linux') return false;
  if (!env.DISPLAY && !env.WAYLAND_DISPLAY) return false;
  return LINUX_DIALOGS.some((dialog) => onPath(dialog.binary, env));
}

function getDialogCommand(
  platform: NodeJS.Platform | string,
  env: NodeJS.ProcessEnv,
): { cmd: string; args: string[] } | null {
  if (platform === 'darwin') return { cmd: 'osascript', args: ['-e', MACOS_SCRIPT] };
  if (platform === 'win32') {
    return {
      cmd: 'powershell.exe',
      args: ['-NoProfile', '-STA', '-Command', WINDOWS_SCRIPT],
    };
  }
  const dialog = LINUX_DIALOGS.find((candidate) => onPath(candidate.binary, env));
  return dialog ? { cmd: dialog.binary, args: dialog.args } : null;
}

export type ChooseDirectoryResult = { path: string } | { cancelled: true } | { error: string };

/**
 * Opens the platform's folder dialog and returns the chosen absolute path.
 *
 * Every dialog reports cancel as empty output, so an empty result is a cancel
 * rather than a failure. The path is confirmed to be an existing directory
 * before it is returned: Windows' shell dialogs can hand back a virtual folder
 * that is not a filesystem location at all.
 */
export function chooseDirectory(
  platform: NodeJS.Platform | string = process.platform,
  env: NodeJS.ProcessEnv = process.env,
): Promise<ChooseDirectoryResult> {
  const command = getDialogCommand(platform, env);
  if (!command) return Promise.resolve({ error: 'No folder dialog is available on this system' });

  return new Promise((resolve) => {
    const child = spawn(command.cmd, command.args, { env, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let settled = false;
    const finish = (result: ChooseDirectoryResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(result);
    };
    const timeout = setTimeout(() => {
      child.kill();
      finish({ error: 'The folder dialog timed out' });
    }, DIALOG_TIMEOUT_MS);

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.on('error', () => finish({ error: `Could not open the folder dialog (${command.cmd})` }));
    child.on('close', () => {
      // POSIX path of an AppleScript alias is directory-style, so it arrives
      // with a trailing separator that no other path in the payload carries.
      const picked = stdout.trim().replace(/\/+$/, '');
      if (!picked) return finish({ cancelled: true });
      if (!existsSync(picked) || !statSync(picked).isDirectory()) {
        return finish({ error: 'That selection is not a folder on disk' });
      }
      finish({ path: picked });
    });
  });
}
