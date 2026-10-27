import { destructiveCommandMatch } from '@/core/rules/destructive';
import type { DestructiveCommandRuleMatch } from '@/core/rules/types';
import type { CommandRedirection } from '@/core/shell/model';

const REASON_DD_DEVICE_WRITE =
  'dd writing to a /dev device can destroy a disk or partition. Ask the user to run device writes manually after confirming the target.';
const REASON_MKFS_DEVICE =
  'mkfs formatting a /dev device erases everything on it. Ask the user to run the format manually after confirming the target.';
const REASON_DISK_ERASE =
  'This erases or repartitions a disk. Ask the user to run disk erase and partition commands manually after confirming the target.';
const REASON_REDIRECT_BLOCK_DEVICE =
  'This output redirect overwrites a disk device. Ask the user to run device writes manually after confirming the target.';
const REASON_SHRED_TARGET =
  'shred permanently destroys the given target. Use rm for ordinary deletes, or ask the user to run shred manually.';

const DD_SINK_TARGETS = new Set(['of=/dev/null', 'of=/dev/zero', 'of=/dev/full']);
const FILESYSTEM_FORMAT_HEAD = /^(?:mkfs(?:\..+)?|mke2fs|newfs(?:_.+)?)$/;
const DISK_ERASE_HEADS = new Set(['diskutil', 'wipefs', 'sgdisk', 'parted']);
const DISKUTIL_ERASE_VERBS = new Set([
  'erasedisk',
  'erasevolume',
  'reformat',
  'partitiondisk',
  'zerodisk',
  'randomdisk',
  'secureerase',
]);
const WIPEFS_ERASE_OPTION = /^(?:-[^-]*[ao]|--all$|--offset(?:=|$))/;
const SGDISK_READ_ONLY_OPTIONS = new Set([
  '-p',
  '--print',
  '-i',
  '--info',
  '-v',
  '--verify',
  '-O',
  '--print-mbr',
  '-E',
  '--end-of-largest',
  '-F',
  '--first-in-largest',
  '-f',
  '--first-aligned-in-largest',
  '-D',
  '--display-alignment',
  '-L',
  '--list-types',
  '-P',
  '--pretend',
  '-b',
  '--backup',
  '-V',
  '--version',
  '-?',
  '--help',
  '--usage',
]);
const SGDISK_READ_ONLY_FLAGS = new Set(['p', 'v', 'O', 'E', 'F', 'f', 'D', 'L', 'P', 'V', '?']);
const SGDISK_READ_ONLY_VALUE_OPTIONS = new Set(['i', 'b']);
const BLOCK_DEVICE_PATH =
  /^\/dev\/(?:r?disk\d|sd[a-z]|hd[a-z]|vd[a-z]|xvd[a-z]|nvme\d|mmcblk\d|md\d|dm-\d|loop\d|mapper\/|disk\/)/;
const DEVICE_WRITING_REDIRECTIONS = new Set(['>', '>|', '>>', '<>', '>&']);
const PARTED_TABLE_EDITS = new Set(['mklabel', 'mktable', 'mkpart', 'rm', 'resizepart']);

export function isDeviceCommand(head: string): boolean {
  return (
    head === 'dd' ||
    head === 'shred' ||
    FILESYSTEM_FORMAT_HEAD.test(head) ||
    DISK_ERASE_HEADS.has(head)
  );
}

function erasesDisk(head: string, operands: readonly string[]): boolean {
  const namesDevice = operands.some((token) => token.startsWith('/dev/'));
  if (head === 'diskutil') {
    const verb = operands.find((token) => !token.startsWith('-'));
    return verb !== undefined && DISKUTIL_ERASE_VERBS.has(verb.toLowerCase());
  }
  if (head === 'wipefs') {
    return namesDevice && operands.some((token) => WIPEFS_ERASE_OPTION.test(token));
  }
  if (head === 'sgdisk') {
    return (
      namesDevice &&
      operands.some((token) => token.startsWith('-') && !isSgdiskReadOnlyOption(token))
    );
  }
  return (
    head === 'parted' &&
    namesDevice &&
    operands.some((token) => PARTED_TABLE_EDITS.has(token.toLowerCase()))
  );
}

function isSgdiskReadOnlyOption(token: string): boolean {
  if (SGDISK_READ_ONLY_OPTIONS.has(token.split('=', 1)[0] ?? token)) return true;
  if (token.startsWith('--')) return false;
  const letters = token.slice(1).split('');
  return (
    SGDISK_READ_ONLY_VALUE_OPTIONS.has(letters[0] ?? '') ||
    letters.every((letter) => SGDISK_READ_ONLY_FLAGS.has(letter))
  );
}

export function analyzeDeviceCommandMatch(
  head: string,
  tokens: readonly string[],
): DestructiveCommandRuleMatch | null {
  const operands = tokens.slice(1);
  if (
    head === 'dd' &&
    operands.some((token) => /^of=\/dev\/.+/.test(token) && !DD_SINK_TARGETS.has(token))
  ) {
    return destructiveCommandMatch('dd.device-write', REASON_DD_DEVICE_WRITE);
  }
  if (FILESYSTEM_FORMAT_HEAD.test(head) && operands.some((token) => token.startsWith('/dev/'))) {
    return destructiveCommandMatch('mkfs.device', REASON_MKFS_DEVICE);
  }
  if (erasesDisk(head, operands)) {
    return destructiveCommandMatch('disk.erase', REASON_DISK_ERASE);
  }
  if (head === 'shred' && operands.length > 0) {
    return destructiveCommandMatch('shred.target', REASON_SHRED_TARGET);
  }
  return null;
}

export function analyzeDeviceRedirectionMatch(
  redirections: readonly CommandRedirection[],
): DestructiveCommandRuleMatch | null {
  return redirections.some(
    (redirection) =>
      DEVICE_WRITING_REDIRECTIONS.has(redirection.operator) &&
      redirection.target?.provenance === 'literal' &&
      BLOCK_DEVICE_PATH.test(redirection.target.text),
  )
    ? destructiveCommandMatch('redirect.block-device', REASON_REDIRECT_BLOCK_DEVICE)
    : null;
}
