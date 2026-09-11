import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createInterface } from 'node:readline';
import { parseCommandArgs } from '@/cli/args';
import { policyCommand } from '@/cli/commands/policy';
import { printCommandHelp } from '@/cli/help';
import type { Environment } from '@/core/environment';
import { writeJsonAtomic } from '@/core/policy/config-file';
import {
  buildProjectPolicyFileValue,
  diffPolicyRows,
  readPolicyJson,
  readRuntimeUserBaseline,
} from '@/core/policy/diff';
import { mergeProjectPolicy } from '@/core/policy/merge';
import { getProjectPolicyPath, getUserPolicyPath } from '@/core/policy/paths';
import { normalizeGuiPolicy, projectPolicyProjection } from '@/core/policy/store';
import { writeUserPolicyFromGui } from '@/core/policy/store-gui';
import type { GuiPolicy } from '@/core/policy/types';
import { getUserPolicyDiagnostics } from '@/core/policy/user-policy-diagnostics';

type PolicyCommandOptions = {
  cwd?: string;

  input?: NodeJS.ReadStream;
  output?: NodeJS.WriteStream;
};

const POLICY_SUBCOMMANDS = new Set(['check', 'apply']);
const UNSET = '(unset)';

export async function runPolicyCommand(
  environment: Environment,
  args: readonly string[],
  options: PolicyCommandOptions = {},
): Promise<number> {
  const parsed = parseCommandArgs(
    { label: 'policy', booleans: { global: ['-g', '--global'] }, positionals: 'list' },
    args,
  );
  const subcommand = parsed.positionals[0];
  const errors = [
    ...parsed.errors,
    ...(subcommand && !POLICY_SUBCOMMANDS.has(subcommand)
      ? [`Unknown policy subcommand: ${subcommand}`]
      : []),
    ...(subcommand && POLICY_SUBCOMMANDS.has(subcommand) && !parsed.positionals[1]
      ? [`policy ${subcommand} requires a file`]
      : []),
    ...parsed.positionals.slice(2).map((extra) => `Unexpected policy argument: ${extra}`),
  ];
  if (errors.length > 0) {
    for (const error of errors) console.error(error);
    return 1;
  }
  const file = parsed.positionals[1];
  if (!subcommand || !file) {
    printCommandHelp(policyCommand, console.error);
    return 1;
  }

  const targetPath = parsed.flags.global
    ? getUserPolicyPath(environment)
    : getProjectPolicyPath(options.cwd ?? process.cwd());
  const proposal = readPolicyJson(file);
  const diagnostics = [
    ...proposal.errors,
    ...getUserPolicyDiagnostics(proposal.value, environment.home).map(
      (error) => `${file}: ${error}`,
    ),

    ...(!parsed.flags.global && isRecord(proposal.value) && proposal.value.audit !== undefined
      ? [
          `${file}: audit settings are user scope only; remove the audit section from a project proposal`,
        ]
      : []),
  ];
  if (diagnostics.length > 0) {
    for (const diagnostic of diagnostics) console.error(diagnostic);
    return 1;
  }

  const proposed = normalizeGuiPolicy(proposal.value, environment.home);
  console.log(`Scope: ${parsed.flags.global ? 'user' : 'project'} (${targetPath})`);
  console.log(`Proposal: ${file}`);
  if (parsed.flags.global) {
    printPolicyDiff(
      normalizeGuiPolicy(readPolicyJson(targetPath).value, environment.home),
      proposed,
      true,
    );
  }
  if (!parsed.flags.global) {
    const user = readRuntimeUserBaseline(environment).baseline;
    console.log('Effective policy (user + project merged):');
    printPolicyDiff(
      mergeProjectPolicy(
        user,
        projectPolicyProjection(readPolicyJson(targetPath).value, environment.home).policy,
      ).policy,
      mergeProjectPolicy(user, projectPolicyProjection(proposal.value, environment.home).policy)
        .policy,
      false,
    );
  }
  if (subcommand === 'check') return 0;

  const input = options.input ?? process.stdin;
  const output = options.output ?? process.stdout;
  if (!input.isTTY || !output.isTTY) {
    console.error('policy apply confirms interactively; run this yourself in a terminal:');
    console.error(`  cc-safety-net policy apply ${file}${parsed.flags.global ? ' --global' : ''}`);
    return 1;
  }
  const confirmed = await confirmApply(`Apply this policy to ${targetPath}? [y/N] `, input, output);
  if (!confirmed) {
    console.log('Cancelled; nothing was written.');
    return 0;
  }

  writeScopePolicy(environment, targetPath, proposal.value, proposed, parsed.flags.global);
  console.log(`Policy applied: ${targetPath}`);
  return 0;
}

function confirmApply(
  question: string,
  input: NodeJS.ReadStream,
  output: NodeJS.WriteStream,
): Promise<boolean> {
  const prompt = createInterface({ input, output, terminal: false });
  return new Promise((resolve) => {
    prompt.once('close', () => resolve(false));
    prompt.question(question, (answer) => {
      resolve(/^y(es)?$/i.test(answer.trim()));
      prompt.close();
    });
  });
}

function writeScopePolicy(
  environment: Environment,
  path: string,
  proposalValue: unknown,
  normalized: GuiPolicy,
  global: boolean,
): void {
  if (global) {
    writeUserPolicyFromGui(environment, normalized);
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeJsonAtomic(path, buildProjectPolicyFileValue(proposalValue, normalized));
}

function printPolicyDiff(current: GuiPolicy, proposed: GuiPolicy, global: boolean): void {
  const rows = diffPolicyRows(current, proposed, global);
  if (rows.length === 0) {
    console.log('No changes.');
    return;
  }
  console.log(`Changes (${rows.length}):`);
  for (const row of rows) {
    console.log(`  ${row.field}: ${row.before ?? UNSET} -> ${row.after ?? UNSET}`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
