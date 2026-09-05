/**
 * CLI flag parsing for the doctor command.
 */

import { parseCommandArgs, reportCommandArgErrors } from '@next/cli/args';
import type { DoctorOptions } from '@next/hosts/doctor-types';

export function parseDoctorFlags(args: string[]): DoctorOptions | null {
  const parsed = parseCommandArgs(
    {
      label: 'doctor',
      booleans: { json: ['--json'], skipUpdateCheck: ['--skip-update-check'] },
    },
    args,
  );
  if (reportCommandArgErrors(parsed.errors)) return null;

  return { json: parsed.flags.json, skipUpdateCheck: parsed.flags.skipUpdateCheck };
}
