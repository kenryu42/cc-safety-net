import {
  formatColoredTokenArray,
  formatHeader,
  formatStepStyleD,
  getBoxChars,
  wrapReason,
} from '@/cli/explain/format-helpers';
import { colors } from '@/cli/utils/colors';
import { describePolicyScope } from '@/core/policy/types';
import type { ExplainResult } from '@/gate/explain';

export function formatTraceHuman(result: ExplainResult, options?: { asciiOnly?: boolean }): string {
  const box = getBoxChars(options?.asciiOnly ?? false);
  const width = 58;
  const lines: string[] = [];
  let stepNum = 1;

  lines.push(...formatHeader(box, width));
  lines.push('');

  const errorStep = result.trace.steps.find((s) => s.type === 'error');
  if (errorStep && errorStep.type === 'error') {
    lines.push('ERROR');
    lines.push(`  ${errorStep.message}`);
    lines.push('');
    lines.push('RESULT');
    lines.push(
      `  Status: ${result.result === 'blocked' ? colors.red('BLOCKED') : colors.green('ALLOWED')}`,
    );
    lines.push('');
    lines.push('CONFIG');
    const configPath = result.configSource ?? 'none';
    lines.push(`  Path: ${configPath}`);
    return lines.join('\n');
  }

  const parseStep = result.trace.steps.find((s) => s.type === 'parse');
  if (parseStep && parseStep.type === 'parse') {
    lines.push('INPUT');
    lines.push(`  ${parseStep.input}`);
    lines.push('');

    lines.push(`STEP ${stepNum} ${box.h} Split shell commands`);
    stepNum++;
    for (let i = 0; i < parseStep.segments.length; i++) {
      const seg = parseStep.segments[i];
      if (seg) {
        const seed = Math.random();
        lines.push(`  Segment ${i + 1}: ${formatColoredTokenArray(seg, seed)}`);
      }
    }
  }

  const segments = result.trace.segments;
  const hasMultipleSegments = segments.length > 1;

  for (const seg of segments) {
    if (hasMultipleSegments) {
      lines.push('');

      let segCommand = '';
      if (parseStep && parseStep.type === 'parse') {
        const tokens = parseStep.segments[seg.index];
        if (tokens) {
          segCommand = tokens.join(' ');
        }
      }

      const maxLabelLen = width - 4;

      let displayCommand = segCommand;
      const baseLabel = ` Segment ${seg.index + 1}: `;
      const suffix = ' ';

      if (segCommand) {
        const totalLen = baseLabel.length + segCommand.length + suffix.length;

        if (totalLen > maxLabelLen) {
          const availableForCmd = maxLabelLen - baseLabel.length - suffix.length;

          displayCommand = `${segCommand.substring(0, availableForCmd - 1)}…`;
        }
      }

      const labelContent = segCommand
        ? `${baseLabel}${displayCommand}${suffix}`
        : ` Segment ${seg.index + 1} `;

      const coloredContent = segCommand
        ? `${baseLabel}${colors.cyan(displayCommand)}${suffix}`
        : labelContent;

      const segLineLen = width - labelContent.length;
      const leftLen = Math.floor(segLineLen / 2);
      const rightLen = segLineLen - leftLen;

      lines.push(`${box.sh.repeat(leftLen)}${coloredContent}${box.sh.repeat(rightLen)}`);
    }

    const skippedStep = seg.steps.find((s) => s.type === 'segment-skipped');
    if (skippedStep) {
      lines.push('');
      lines.push('  (skipped — prior segment blocked)');
      continue;
    }

    let inRecursion = false;
    let hasVisibleSteps = false;

    for (const step of seg.steps) {
      const formattedStep = formatStepStyleD(step, stepNum, box);
      if (formattedStep) {
        hasVisibleSteps = true;

        if (step.type === 'recurse') {
          lines.push('');
          const recurseLabel = ' RECURSING ';
          const recurseLineLen = width - recurseLabel.length - 4;
          lines.push(`  ${box.tl}${box.h}${recurseLabel}${box.h.repeat(recurseLineLen)}`);
          lines.push(`  ${box.v}`);
          inRecursion = true;
          continue;
        }

        for (const line of formattedStep.lines) {
          if (inRecursion) {
            lines.push(`  ${box.v} ${line}`);
          } else {
            lines.push(line);
          }
        }
        if (formattedStep.incrementStep) {
          stepNum++;
        }
      }
    }

    if (inRecursion) {
      lines.push(`  ${box.v}`);
      lines.push(`  ${box.bl}${box.h.repeat(width - 2)}`);
      inRecursion = false;
    }

    if (!hasVisibleSteps) {
      lines.push('');
      lines.push(`  ${colors.green('✓')} Allowed (no matching rules)`);
    }
  }

  lines.push('');
  lines.push('RESULT');
  if (result.result === 'blocked') {
    lines.push(`  Status: ${colors.red('BLOCKED')}`);
    if (result.customRule) {
      lines.push(`  Rule: ${result.customRule.id}`);
      if (result.customRule.rulebook) {
        lines.push(
          `  Rulebook: ${result.customRule.rulebook.name} ${result.customRule.rulebook.version}`,
        );
      }
      if (result.customRule.source) {
        lines.push(`  Source: ${result.customRule.source}`);
      }
      if (result.customRule.override) {
        lines.push(`  Override: reason ${result.customRule.override.reason}`);
      }
    }
    if (result.reason) {
      const reasonLines = wrapReason(result.reason, '          ');
      lines.push(`  Reason: ${reasonLines[0]}`);
      for (let i = 1; i < reasonLines.length; i++) {
        lines.push(reasonLines[i] ?? '');
      }
    }
  } else {
    lines.push(`  Status: ${colors.green('ALLOWED')}`);
  }

  lines.push('');
  lines.push('CONFIG');
  const configPath = result.configSource ?? 'none';
  const configStatus = result.configValid ? '' : ' (invalid)';
  lines.push(`  Path: ${configPath}${configStatus}`);
  const presetScope = result.safetyPresetScope;
  lines.push(
    `  Safety preset: ${result.selectedPreset ?? 'standard'}${presetScope ? ` (${describePolicyScope(presetScope)})` : ''}`,
  );
  lines.push(`  Effective capabilities: ${result.effectiveLevel}`);
  const overrides = Object.entries(result.destructiveCommandRuleOverrides ?? {});
  lines.push(`  Rule customizations: ${overrides.length}`);
  if (result.ruleActivation) {
    lines.push(
      `  Rule activation: ${result.ruleActivation.id} — ${result.ruleActivation.enabled ? 'on' : 'off'} via ${result.ruleActivation.source}`,
    );
  }

  return lines.join('\n');
}

export function formatTraceJson(result: ExplainResult): string {
  return JSON.stringify(result, null, 2);
}
