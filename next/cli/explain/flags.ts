/**
 * CLI flag parsing for the explain command.
 */

import { existsSync } from 'node:fs';
import { parseCommandArgs, reportCommandArgErrors } from '@next/cli/args';

const SHELL_SAFE_ARGUMENT = /^[A-Za-z0-9_@%+=:,./-]+$/;
const USAGE = 'Usage: cc-safety-net explain [--json] [--cwd <path>] <command>';

export interface ExplainFlags {
  json: boolean;
  cwd?: string;
  command: string;
}

export function parseExplainFlags(args: string[]): ExplainFlags | null {
  const parsed = parseCommandArgs(
    {
      label: 'explain',
      booleans: { json: ['--json'] },
      values: { cwd: ['--cwd'] },
      positionals: 'tail',
    },
    args,
  );
  if (reportCommandArgErrors(parsed.errors)) {
    console.error(USAGE);
    console.error('Pass -- before a command that starts with dashes.');
    return null;
  }
  if (parsed.values.cwd !== undefined && !existsSync(parsed.values.cwd)) {
    console.error(`Error: --cwd path does not exist: ${parsed.values.cwd}`);
    return null;
  }

  // When the user passes a full command as a single argument (e.g., explain "git status | rm -rf /"),
  // use it directly to preserve shell operators. Otherwise, single-quote every argument that is
  // not already inert so multiple arguments survive the reparse as themselves.
  const command =
    parsed.positionals.length === 1
      ? parsed.positionals[0]
      : parsed.positionals
          .map((argument) =>
            SHELL_SAFE_ARGUMENT.test(argument)
              ? argument
              : `'${argument.replaceAll("'", `'\\''`)}'`,
          )
          .join(' ');
  if (!command) {
    console.error('Error: No command provided');
    console.error(USAGE);
    return null;
  }

  return { json: parsed.flags.json, cwd: parsed.values.cwd, command };
}
