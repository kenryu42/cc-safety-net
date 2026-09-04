import { afterAll, describe, expect, test } from 'bun:test';
import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chooseDirectory, isDirectoryPickerAvailable } from '@/gui/choose-directory';

// A real PATH entry holding a stub binary: asserting on the host's own zenity
// would make the result depend on whatever the suite happens to run on.
const withZenity = mkdtempSync(join(tmpdir(), 'cc-picker-'));
writeFileSync(join(withZenity, 'zenity'), '');
chmodSync(join(withZenity, 'zenity'), 0o755);
const withKdialog = mkdtempSync(join(tmpdir(), 'cc-picker-'));
writeFileSync(join(withKdialog, 'kdialog'), '');
chmodSync(join(withKdialog, 'kdialog'), 0o755);
const empty = mkdtempSync(join(tmpdir(), 'cc-picker-'));

afterAll(() => {
  for (const dir of [withZenity, withKdialog, empty]) rmSync(dir, { recursive: true, force: true });
});

describe('directory picker availability', () => {
  // osascript and powershell.exe ship with the OS, so the only question is
  // whether a desktop session exists at all - which the GUI already implies.
  test('is always available on macOS and Windows', () => {
    expect(isDirectoryPickerAvailable('darwin', {})).toBe(true);
    expect(isDirectoryPickerAvailable('win32', {})).toBe(true);
  });

  // Windows cannot execute the extensionless Unix stubs used to model Linux dialog binaries.
  test.skipIf(process.platform === 'win32')('accepts either dialog binary on Linux', () => {
    expect(isDirectoryPickerAvailable('linux', { PATH: withZenity, DISPLAY: ':0' })).toBe(true);
    expect(isDirectoryPickerAvailable('linux', { PATH: withKdialog, DISPLAY: ':0' })).toBe(true);
    expect(isDirectoryPickerAvailable('linux', { PATH: empty, DISPLAY: ':0' })).toBe(false);
  });

  // Windows cannot execute the extensionless Unix stub used to model a Linux dialog binary.
  test.skipIf(process.platform === 'win32')('counts Wayland as a display', () => {
    expect(
      isDirectoryPickerAvailable('linux', { PATH: withZenity, WAYLAND_DISPLAY: 'wayland-0' }),
    ).toBe(true);
  });

  // Present but unusable: WSL without WSLg and containers both look like this,
  // and the dialog would only fail with "cannot open display" after the click.
  test('rejects a dialog binary with no display', () => {
    expect(isDirectoryPickerAvailable('linux', { PATH: withZenity })).toBe(false);
  });

  // A stale install can leave a plain file where the binary was: advertising it
  // would offer a picker that can never start.
  // Windows has no Unix executable mode bits, so it cannot exercise this Linux capability check.
  test.skipIf(process.platform === 'win32')('rejects a dialog file that is not executable', () => {
    const nonExecutable = mkdtempSync(join(tmpdir(), 'cc-picker-'));
    stubs.push(nonExecutable);
    writeFileSync(join(nonExecutable, 'zenity'), '');
    chmodSync(join(nonExecutable, 'zenity'), 0o644);
    expect(isDirectoryPickerAvailable('linux', { PATH: nonExecutable, DISPLAY: ':0' })).toBe(false);
  });

  // A PATH entry pointing at a file makes the lookup below it fail with ENOTDIR
  // rather than "not found": the probe must treat that as one dead entry.
  test('survives a PATH entry that is not a directory', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cc-picker-'));
    stubs.push(dir);
    const fileEntry = join(dir, 'not-a-directory');
    writeFileSync(fileEntry, '');
    expect(isDirectoryPickerAvailable('linux', { PATH: fileEntry, DISPLAY: ':0' })).toBe(false);
  });

  // Directories carry the executable bit by default, so a directory named after
  // the binary would otherwise advertise a picker that can never start.
  test('rejects a directory named after a dialog binary', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cc-picker-'));
    stubs.push(dir);
    mkdirSync(join(dir, 'zenity'));
    // Explicit mode: a restrictive umask stripping the execute bits would let
    // the mode check reject the entry before the isFile check is exercised.
    chmodSync(join(dir, 'zenity'), 0o755);
    expect(isDirectoryPickerAvailable('linux', { PATH: dir, DISPLAY: ':0' })).toBe(false);
  });

  test('is unavailable on platforms with no known dialog', () => {
    expect(isDirectoryPickerAvailable('aix', { PATH: withZenity, DISPLAY: ':0' })).toBe(false);
  });
});

// A stub on PATH stands in for the dialog: the real one cannot be driven
// headlessly, but everything downstream of its stdout can be.
const stubDialog = (output: string) => {
  const dir = mkdtempSync(join(tmpdir(), 'cc-picker-stub-'));
  const binary = join(dir, 'zenity');
  writeFileSync(binary, `#!/bin/sh\nprintf '%s' '${output}'\n`);
  chmodSync(binary, 0o755);
  stubs.push(dir);
  return { PATH: dir };
};
const stubs: string[] = [];
afterAll(() => {
  for (const dir of stubs) rmSync(dir, { recursive: true, force: true });
});

describe('choosing a directory', () => {
  // Windows cannot execute the POSIX shell dialog stub used by these Linux picker tests.
  test.skipIf(process.platform === 'win32')(
    'strips the trailing separator an AppleScript POSIX path carries',
    async () => {
      expect(await chooseDirectory('linux', stubDialog(`${withZenity}/`))).toEqual({
        path: withZenity,
      });
    },
  );

  // Windows cannot execute the POSIX shell dialog stub used by this Linux picker test.
  test.skipIf(process.platform === 'win32')(
    'reads no output as a cancel rather than a failure',
    async () => {
      expect(await chooseDirectory('linux', stubDialog(''))).toEqual({ cancelled: true });
    },
  );

  // Windows shell dialogs can return a virtual folder such as "This PC", which
  // would otherwise reach the prompt as a path the agent cannot write to.
  // Windows cannot execute the POSIX shell dialog stub used by this Linux picker test.
  test.skipIf(process.platform === 'win32')(
    'rejects a selection that is not a directory on disk',
    async () => {
      const result = await chooseDirectory('linux', stubDialog('/nonexistent/virtual folder'));
      expect(result).toEqual({ error: 'That selection is not a folder on disk' });
    },
  );

  test('reports when no dialog binary is present', async () => {
    expect(await chooseDirectory('linux', { PATH: empty })).toEqual({
      error: 'No folder dialog is available on this system',
    });
  });
});
