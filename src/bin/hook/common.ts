import { analyzeCommand, loadConfig } from '@/core/analyze';
import { writeAuditLog } from '@/core/audit';
import { ENV_FLAGS, envTruthy } from '@/core/env';

export const REASON_SAFETY_NET_FAILED_CLOSED =
  'Safety Net failed closed because command analysis failed unexpectedly.';

export async function readHookInput<T>(outputDeny: (reason: string) => void): Promise<T | null> {
  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }

  const inputText = Buffer.concat(chunks).toString('utf-8').trim();

  if (!inputText) {
    outputDeny('Missing hook input JSON.');
    return null;
  }

  return parseHookJson<T>(inputText, outputDeny, 'Failed to parse hook input JSON.');
}

export function parseHookJson<T>(
  inputText: string,
  outputDeny: (reason: string) => void,
  strictReason: string,
): T | null {
  try {
    return JSON.parse(inputText) as T;
  } catch {
    outputDeny(strictReason);
    return null;
  }
}

function analyzeHookCommand(command: string, cwd: string) {
  const paranoidAll = envTruthy(ENV_FLAGS.paranoid);
  return analyzeCommand(command, {
    cwd,
    config: loadConfig(cwd, { repairLocalRulebooks: true }),
    strict: envTruthy(ENV_FLAGS.strict),
    paranoidRm: paranoidAll || envTruthy(ENV_FLAGS.paranoidRm),
    paranoidInterpreters: paranoidAll || envTruthy(ENV_FLAGS.paranoidInterpreters),
    worktreeMode: envTruthy(ENV_FLAGS.worktree),
  });
}

export function handleBlockedHookCommand(
  command: string,
  cwd: string,
  sessionId: string | undefined,
  outputDeny: (reason: string, command?: string, segment?: string) => void,
): void {
  let result: ReturnType<typeof analyzeHookCommand>;
  try {
    result = analyzeHookCommand(command, cwd);
  } catch {
    outputDeny(REASON_SAFETY_NET_FAILED_CLOSED, command, command);
    return;
  }
  if (!result) {
    if (sessionId && envTruthy(ENV_FLAGS.debug)) {
      writeAuditLog(sessionId, command, command, 'allowed', cwd, { decision: 'allow' });
    }
    return;
  }

  if (sessionId) {
    writeAuditLog(sessionId, command, result.segment, result.reason, cwd);
  }
  outputDeny(result.reason, command, result.segment);
}
