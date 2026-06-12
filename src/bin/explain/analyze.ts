/**
 * Core analysis logic for the explain command.
 */

import { buildAnalyzeOptions, getConfigSource } from '@/bin/explain/config';
import { redactEnvAssignmentsInString, redactEnvAssignmentTokens } from '@/bin/explain/redact';
import {
  explainSegment,
  isUnparseableCommand,
  REASON_STRICT_UNPARSEABLE,
} from '@/bin/explain/segment';
import { dangerousInText } from '@/core/analyze/dangerous-text';
import { resolveCwdAfterSegment } from '@/core/analyze/segment';
import {
  applyShellGitContextEnvSegment,
  createShellGitContextEnvState,
  getSegmentGitContextEnvAssignments,
} from '@/core/analyze/shell-git-env';
import { loadRulesPolicy } from '@/core/rules/policy';
import { splitShellCommands } from '@/core/shell';
import type { ExplainOptions, ExplainResult, ExplainTrace, TraceStep } from '@/types';

export function explainCommand(command: string, options?: ExplainOptions): ExplainResult {
  const trace: ExplainTrace = { steps: [], segments: [] };
  const analyzeOpts = buildAnalyzeOptions(options);
  const { configSource, configValid } = getConfigSource({
    cwd: options?.cwd,
    userConfigDir: options?.userConfigDir,
  });

  if (!command || !command.trim()) {
    trace.steps.push({ type: 'error', message: 'No command provided' });
    return {
      trace,
      result: 'allowed',
      configSource,
      configValid,
    };
  }

  const segments = splitShellCommands(command);
  const redactedInput = redactEnvAssignmentsInString(command);
  const redactedSegments = splitShellCommands(redactedInput).map((seg) =>
    redactEnvAssignmentTokens(seg),
  );
  trace.steps.push({
    type: 'parse',
    input: redactedInput,
    segments: redactedSegments,
  });

  if (analyzeOpts.strict && isUnparseableCommand(command, segments)) {
    trace.steps.push({
      type: 'strict-unparseable',
      rawCommand: redactedInput,
      reason: REASON_STRICT_UNPARSEABLE,
    });
    return {
      trace,
      result: 'blocked',
      reason: REASON_STRICT_UNPARSEABLE,
      segment: redactEnvAssignmentsInString(command),
      configSource,
      configValid,
    };
  }

  let blocked = false;
  let blockReason: string | undefined;
  let blockSegment: string | undefined;
  let effectiveCwd: string | null | undefined = analyzeOpts.effectiveCwd;
  const shellGitContextState = createShellGitContextEnvState(analyzeOpts.envAssignments);

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (!segment) continue;

    const segmentSteps: TraceStep[] = [];

    if (blocked) {
      segmentSteps.push({
        type: 'segment-skipped',
        index: i,
        reason: 'prior-segment-blocked',
      });
      trace.segments.push({ index: i, steps: segmentSteps });
      continue;
    }

    // Check for unparseable segment (single token with spaces) - matches guard behavior
    if (segment.length === 1 && segment[0]?.includes(' ')) {
      const textReason = dangerousInText(segment[0]);
      if (textReason) {
        segmentSteps.push({
          type: 'dangerous-text',
          token: redactEnvAssignmentsInString(segment[0]),
          matched: true,
          reason: textReason,
        });
        trace.segments.push({ index: i, steps: segmentSteps });
        blocked = true;
        blockReason = textReason;
        blockSegment = redactEnvAssignmentsInString(segment.join(' '));
        continue;
      }
      segmentSteps.push({
        type: 'dangerous-text',
        token: redactEnvAssignmentsInString(segment[0]),
        matched: false,
      });
      const nextCwd = resolveCwdAfterSegment(segment, effectiveCwd);
      if (nextCwd !== undefined) {
        if (nextCwd !== null) {
          effectiveCwd = nextCwd;
          trace.segments.push({ index: i, steps: segmentSteps });
          continue;
        }
        segmentSteps.push(cwdChangeStep(segment));
        effectiveCwd = null;
      }
      trace.segments.push({ index: i, steps: segmentSteps });
      continue;
    }

    const result = explainSegment(
      segment,
      0,
      {
        ...analyzeOpts,
        effectiveCwd,
        envAssignments: getSegmentGitContextEnvAssignments(segment, shellGitContextState),
      },
      segmentSteps,
    );

    if (result) {
      blocked = true;
      blockReason = result.reason;
      blockSegment = redactEnvAssignmentsInString(segment.join(' '));
    }

    const nextCwd = resolveCwdAfterSegment(segment, effectiveCwd);
    if (nextCwd !== undefined) {
      if (nextCwd !== null) {
        effectiveCwd = nextCwd;
        applyShellGitContextEnvSegment(segment, shellGitContextState);
        trace.segments.push({ index: i, steps: segmentSteps });
        continue;
      }
      segmentSteps.push(cwdChangeStep(segment));
      effectiveCwd = null;
    }

    applyShellGitContextEnvSegment(segment, shellGitContextState);

    trace.segments.push({ index: i, steps: segmentSteps });
  }

  return {
    trace,
    result: blocked ? 'blocked' : 'allowed',
    reason: blockReason,
    segment: blockSegment,
    customRule: getCustomRuleMetadata(blockReason, options, analyzeOpts.cwd ?? process.cwd()),
    configSource,
    configValid,
  };
}

function cwdChangeStep(segment: readonly string[]): TraceStep {
  return {
    type: 'cwd-change',
    segment: redactEnvAssignmentsInString(segment.join(' ')),
    effectiveCwdNowUnknown: true,
  };
}

function getCustomRuleMetadata(
  reason: string | undefined,
  options: ExplainOptions | undefined,
  cwd: string,
): ExplainResult['customRule'] {
  const id = reason?.match(/^\[([^\]]+)]/)?.[1];
  if (!id) return undefined;

  if (options?.config) {
    return options.config.rules.some((rule) => rule.name === id) ? { id } : undefined;
  }

  const policy = loadRulesPolicy({ cwd, userConfigDir: options?.userConfigDir });
  if (!policy.rules.some((rule) => rule.name === id)) return undefined;

  const rulebook = policy.rulebooks.find((item) => item.rules.includes(id));
  const override = {
    ...(policy.userConfig?.overrides ?? {}),
    ...(policy.projectConfig?.overrides ?? {}),
  }[id];

  return {
    id,
    ...(rulebook
      ? {
          rulebook: { name: rulebook.name, version: rulebook.version },
          source: rulebook.spec,
        }
      : {}),
    ...(override && typeof override === 'object'
      ? { override: { type: 'reason' as const, reason: override.reason } }
      : {}),
  };
}
