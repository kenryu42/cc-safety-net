import { dangerousInText } from '@/core/analyze/dangerous-text';
import { analyzeSegment, segmentChangesCwd } from '@/core/analyze/segment';
import {
  applyShellGitContextEnvSegment,
  createShellGitContextEnvState,
  getSegmentGitContextEnvAssignments,
} from '@/core/analyze/shell-git-env';
import { getBasename, splitShellCommandsWithInfo } from '@/core/shell';
import {
  type AnalyzeNestedOverrides,
  type AnalyzeOptions,
  type AnalyzeResult,
  type Config,
  MAX_RECURSION_DEPTH,
} from '@/types';

const REASON_STRICT_UNPARSEABLE =
  'Command could not be safely analyzed (strict mode). Verify manually.';
const DYNAMIC_SUBSTITUTION_TOKEN = '$__CC_SAFETY_NET_DYNAMIC_SUBSTITUTION__';

export const REASON_RECURSION_LIMIT =
  'Command exceeds maximum recursion depth and cannot be safely analyzed.';

export type InternalOptions = AnalyzeOptions & { config: Config };

export function analyzeCommandInternal(
  command: string,
  depth: number,
  options: InternalOptions,
): AnalyzeResult | null {
  if (depth >= MAX_RECURSION_DEPTH) {
    return { reason: REASON_RECURSION_LIMIT, segment: command };
  }

  const segments = splitShellCommandsWithInfo(command);
  if (depth === 0 && options.config.failClosedReason && isFailClosedRepairCommand(segments)) {
    return null;
  }

  // Strict mode: block if command couldn't be parsed (unclosed quotes, etc.)
  // Detected when splitShellCommands returns a single segment containing the raw command
  if (
    options.strict &&
    segments.length === 1 &&
    segments[0]?.tokens.length === 1 &&
    segments[0].tokens[0] === command &&
    command.includes(' ')
  ) {
    return { reason: REASON_STRICT_UNPARSEABLE, segment: command };
  }

  const originalCwd = options.cwd;
  // Preserve effectiveCwd from caller (e.g., after cd in prior segment of outer command)
  // undefined = use cwd, null = unknown (after cd/pushd)
  let effectiveCwd: string | null | undefined =
    options.effectiveCwd !== undefined ? options.effectiveCwd : options.cwd;
  const shellGitContextState = createShellGitContextEnvState(options.envAssignments);

  for (const segmentInfo of segments) {
    const segment = segmentInfo.hasDynamicSubstitution
      ? appendDynamicSubstitutionSentinelForGit(segmentInfo.tokens)
      : segmentInfo.tokens;
    const segmentStr = segment.join(' ');
    const segmentEnvAssignments = getSegmentGitContextEnvAssignments(segment, shellGitContextState);

    if (segment.length === 1 && segment[0]?.includes(' ')) {
      const textReason = dangerousInText(segment[0]);
      if (textReason) {
        return { reason: textReason, segment: segmentStr };
      }
      if (segmentChangesCwd(segment)) {
        effectiveCwd = null;
      }
      continue;
    }

    const reason = analyzeSegment(segment, depth, {
      ...options,
      cwd: originalCwd,
      effectiveCwd,
      envAssignments: segmentEnvAssignments,
      analyzeNested: (nestedCommand: string, overrides?: AnalyzeNestedOverrides): string | null => {
        // Pass current effectiveCwd so nested analysis sees CWD changes from prior segments
        const nestedEffectiveCwd =
          overrides && Object.hasOwn(overrides, 'effectiveCwd')
            ? overrides.effectiveCwd
            : effectiveCwd;
        return (
          analyzeCommandInternal(nestedCommand, depth + 1, {
            ...options,
            effectiveCwd: nestedEffectiveCwd,
            envAssignments: overrides?.envAssignments ?? segmentEnvAssignments,
            worktreeMode: overrides?.worktreeMode ?? options.worktreeMode,
          })?.reason ?? null
        );
      },
    });
    if (reason) {
      return { reason, segment: segmentStr };
    }

    if (segmentChangesCwd(segment)) {
      effectiveCwd = null;
    }

    applyShellGitContextEnvSegment(segment, shellGitContextState);
  }

  return null;
}

function appendDynamicSubstitutionSentinelForGit(tokens: string[]): string[] {
  if (!tokens.some((token) => getBasename(token).toLowerCase() === 'git')) {
    return tokens;
  }
  return [...tokens, DYNAMIC_SUBSTITUTION_TOKEN];
}

function isFailClosedRepairCommand(
  segments: ReturnType<typeof splitShellCommandsWithInfo>,
): boolean {
  if (segments.length !== 1 || segments[0]?.hasDynamicSubstitution) {
    return false;
  }

  const segment = segments[0];
  if (!segment) {
    return false;
  }

  const tokens = segment.tokens;
  if (tokens[0] === 'cc-safety-net') {
    return tokens[1] === 'rule' && isRuleSyncArgs(tokens.slice(2));
  }

  if (tokens[0] === 'npx') {
    return (tokens[1] === '-y' || tokens[1] === '--yes') && isPackageRuleSyncRepair(tokens, 2);
  }

  if (tokens[0] === 'bunx' || tokens[0] === 'pnpx') {
    return isPackageRuleSyncRepair(tokens, 1);
  }

  if ((tokens[0] === 'pnpm' || tokens[0] === 'yarn') && tokens[1] === 'dlx') {
    return isPackageRuleSyncRepair(tokens, 2);
  }

  return false;
}

function isPackageRuleSyncRepair(tokens: string[], packageIndex: number): boolean {
  return (
    isCCSafetyNetPackage(tokens[packageIndex]) &&
    tokens[packageIndex + 1] === 'rule' &&
    isRuleSyncArgs(tokens.slice(packageIndex + 2))
  );
}

function isRuleSyncArgs(args: string[]): boolean {
  return (
    args.length >= 1 &&
    args.length <= 2 &&
    args.filter((arg) => arg === 'sync').length === 1 &&
    args.every((arg) => arg === 'sync' || arg === '--global' || arg === '-g')
  );
}

function isCCSafetyNetPackage(value: string | undefined): boolean {
  return /^cc-safety-net(?:@[a-zA-Z0-9._-]+)?$/.test(value ?? '');
}
